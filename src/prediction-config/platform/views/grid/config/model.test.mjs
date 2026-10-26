import test from 'node:test'
import assert from 'node:assert/strict'
import * as module from './model.ts'
const subject = async () => module
const snapshot = () => ({
    config_id:'11',requested_agent_id:'0',agent_id:null,inherited:false,default_config_id:'11',default_version:'7',default_resolution_epoch:'2',default_enabled:true,effective_enabled:true,default_target_rtp:'1',default_min_order_amount:'0.00000001',default_max_order_amount:'9007199254740993.00000001',
    site_id: 'site-A', symbol: 'BTCUSDT', layout_version: '9223372036854775807', site_version: '7', effective_from_ms: '1789000000000',
    enabled: true, target_rtp: '0.875000000000000001', min_multiplier: '1.01', max_multiplier: '99.99', min_order_amount: '0.00000001', max_order_amount: '9007199254740993.00000001'
})
const memory = () => {
    const data = new Map()
    return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key), data }
}

test('RTP percent conversion shifts decimal characters without numeric rounding', async () => {
    const m = await subject()
    assert.equal(m.ratioToPercent('0.875000000000000001'), '87.5000000000000001')
    assert.equal(m.percentToRatio('87.5000000000000001'), '0.875000000000000001')
    assert.equal(m.ratioToPercent('1'), '100')
    assert.equal(m.percentToRatio('0.000001'), '0.00000001')
    for (const value of ['', '1e2', '-1', '100', '100.0000001']) assert.throws(() => m.percentToRatio(value))
})

test('command keeps exact strings and includes only changed allowed fields', async () => {
    const m = await subject(), source = snapshot()
    const command = m.makeCommand(source, { ...source, target_rtp: '0.9', max_order_amount: '9007199254740993.00000000' }, '调整配置', 'request_123', true)
    assert.deepEqual(command, {
        site_id: 'site-A', symbol: 'BTCUSDT', based_on_layout_version: '9223372036854775807', based_on_site_version: '7',
        based_on_config_id:'11',based_on_default_version:'7',based_on_default_resolution_epoch:'2',
        client_request_id: 'request_123', reason: '调整配置', changes: { target_rtp: '0.9', max_order_amount: '9007199254740993' }
    })
    assert.throws(() => m.makeCommand(source, source, '无变化', 'request_456', true))
    assert.throws(() => m.makeCommand(source, { ...source, min_multiplier: '2' }, '代理越权', 'request_789', false))
    assert.equal(m.normalizeSnapshotForTarget(source, 'site-A', 'BTCUSDT').site_version, '7')
    assert.throws(() => m.normalizeSnapshotForTarget(source, 'site-B', 'BTCUSDT'), /INVALID_GRID_TARGET/)
})

test('secure request ids work without randomUUID and stale async confirmations cannot persist', async () => {
    const m = await subject()
    const random = { getRandomValues(bytes) { bytes.forEach((_, index) => { bytes[index] = index }); return bytes } }
    assert.equal(random.randomUUID, undefined)
    assert.equal(m.secureRequestId(random), '00010203-0405-4607-8809-0a0b0c0d0e0f')

    const storage = memory()
    const command = m.makeCommand(snapshot(), { ...snapshot(), enabled: false }, '停用', 'request_123', true)
    const review = m.captureSaveReview('101', command)
    let approve
    const confirmation = new Promise(resolve => { approve = resolve })
    let currentOperator = '101'
    const persistAfterConfirmation = (async () => {
        await confirmation
        return m.persistReviewedCommand(storage, review, currentOperator, command)
    })()
    currentOperator = '102'
    approve()
    await assert.rejects(persistAfterConfirmation, /STALE_CONFIRMATION/)
    assert.equal(m.readPending(storage), null)
    const changedSource = { ...snapshot(), layout_version: '9223372036854775808' }
    const changedCommand = m.makeCommand(changedSource, { ...changedSource, enabled: false }, '停用', 'request_123', true)
    assert.throws(() => m.persistReviewedCommand(storage, review, '101', changedCommand), /STALE_CONFIRMATION/)
    const otherTarget = { ...snapshot(), site_id: 'site-B' }
    const otherCommand = m.makeCommand(otherTarget, { ...otherTarget, enabled: false }, '停用', 'request_123', true)
    assert.throws(() => m.persistReviewedCommand(storage, review, '101', otherCommand), /STALE_CONFIRMATION/)
})

test('UNKNOWN preserves original command and receipt lookup never resubmits it', async () => {
    const m = await subject(), storage = memory(), command = m.makeCommand(snapshot(), { ...snapshot(), enabled: false }, '停用', 'request_123', true)
    const pending = m.persistPending(storage, '101', command)
    command.reason = 'mutated'
    const calls = []
    const unknown = await m.attemptPending(storage, pending, 'save', async (mode, body) => {
        calls.push([mode, structuredClone(body)])
        throw { operation_status: 'UNKNOWN', error_code: 'DATABASE_ERROR' }
    })
    assert.equal(unknown.status, 'unknown')
    const restored = m.pendingForActor(storage, '101')
    assert.equal(restored.status, 'bound')
    assert.equal(restored.pending.command.reason, '停用')
    const malformed = await m.attemptPending(storage, restored.pending, 'receipt', async (mode, body) => {
        calls.push([mode, structuredClone(body)])
        return { operation_status: 'SUCCEEDED', operation_id: '87', site_id: 'site-A', symbol: 'ETHUSDT', layout_version: '9223372036854775807', site_version: '8', effective_from_ms: '1789000000001', changed: true, cache_state: 'PENDING' }
    })
    assert.equal(malformed.status, 'unknown')
    assert.equal(m.pendingForActor(storage, '101').status, 'bound')
    const success = await m.attemptPending(storage, restored.pending, 'receipt', async (mode, body) => {
        calls.push([mode, structuredClone(body)])
        return { operation_status: 'SUCCEEDED', operation_id: '88', site_id: 'site-A', symbol: 'BTCUSDT', layout_version: '9223372036854775807', site_version: '8', effective_from_ms: '1789000000001', changed: true, cache_state: 'PENDING' }
    })
    assert.equal(success.status, 'success')
    assert.deepEqual(calls.map(call => call[0]), ['save', 'receipt', 'receipt'])
    assert.deepEqual(calls[0][1], calls[1][1])
    assert.deepEqual(calls[1][1], calls[2][1])
    assert.equal(m.readPending(storage), null)
})

test('foreign accounts and stale selections cannot own persisted or late results', async () => {
    const m = await subject(), storage = memory(), command = m.makeCommand(snapshot(), { ...snapshot(), enabled: false }, '停用', 'request_123', true)
    m.persistPending(storage, '101', command)
    assert.equal(m.pendingForActor(storage, '102').status, 'foreign')
    const gate = new m.SelectionGate(), first = gate.next('101:site-A:BTCUSDT'), second = gate.next('101:site-A:ETHUSDT')
    assert.equal(first.current('101:site-A:BTCUSDT'), false)
    assert.equal(second.current('101:site-A:ETHUSDT'), true)
    gate.close()
    assert.equal(second.current('101:site-A:ETHUSDT'), false)
})


const layoutSnapshot = () => ({ ...snapshot(), layout: {
    row_count: '20', column_count: '4', column_duration_seconds: '5', price_band_width: '0.000000000000000001',
    effective_from_ms: '1789000000000000001', editable: true, affected_site_ids: ['site-A', 'site-B']
} })

test('optional layout parsing preserves precise strings and rejects malformed or non-positive layout', async () => {
    const m = await subject()
    assert.equal(m.normalizeSnapshot(snapshot()).layout, undefined)
    const source = layoutSnapshot()
    assert.deepEqual(m.normalizeSnapshot(source).layout, source.layout)
    for (const invalid of [null, {}, { ...source.layout, row_count: 20 }, { ...source.layout, price_band_width: '1e-18' },
        { ...source.layout, price_band_width: '0' }, { ...source.layout, editable: 'true' }, { ...source.layout, affected_site_ids: ['site-A', 3] },
        { ...source.layout, affected_site_ids: ['site-A', 'site-A'] }, { ...source.layout, column_duration_seconds: '0' },
        { ...source.layout, row_count: '1'.repeat(129) }, { ...source.layout, column_duration_seconds: '1.0' }]) {
        assert.throws(() => m.normalizeSnapshot({ ...source, layout: invalid }))
    }
})

test('platform command only sends changed layout values with both grants and exact decimal precision', async () => {
    const m = await subject(), source = layoutSnapshot()
    const draft = { ...source, target_rtp: '0.9', layout: { ...source.layout, price_band_width: '9007199254740993.12345678', column_duration_seconds: '4' } }
    const command = m.makeCommand(source, draft, '调整配置', 'request_layout', true, true)
    assert.deepEqual(command.changes, { target_rtp: '0.9', price_band_width: '9007199254740993.12345678', column_duration_seconds: '4' })
    assert.equal(command.based_on_layout_version, '9223372036854775807')
    assert.throws(() => m.makeCommand(source, draft, '越权', 'request_layout', true), /FIELD_FORBIDDEN/)
    assert.throws(() => m.makeCommand(source, draft, '越权', 'request_layout', false, false), /FIELD_FORBIDDEN/)
    const readonly = { ...source, layout: { ...source.layout, editable: false } }
    assert.throws(() => m.makeCommand(readonly, draft, '越权', 'request_layout', true, true), /FIELD_FORBIDDEN/)
    const old = snapshot()
    assert.throws(() => m.makeCommand(old, draft, '旧接口', 'request_layout', true, true), /FIELD_FORBIDDEN/)
})

test('new price band width rejects every ninth fractional digit, including trailing zeroes', async () => {
    const m = await subject(), source = layoutSnapshot()
    const allowed = { ...source, layout: { ...source.layout, price_band_width: '7.12345678' } }
    assert.equal(m.makeCommand(source, allowed, '调整', 'request_width8', true, true).changes.price_band_width, '7.12345678')
    for (const width of ['7.123456789', '0.000000001', '1.000000000']) {
        const draft = { ...source, layout: { ...source.layout, price_band_width: width } }
        assert.throws(() => m.makeCommand(source, draft, '调整', 'request_width9', true, true), /INVALID_LAYOUT_PRECISION/)
    }
    const historical = { ...source, layout: { ...source.layout, price_band_width: '0.123456789012345678' } }
    assert.deepEqual(m.makeCommand(historical, { ...historical, enabled: false }, '仅改开关', 'request_legacy_width', true, true).changes, { enabled: false })
})

test('readonly layout metadata does not dirty site settings or enter commands', async () => {
    const m = await subject(), source = layoutSnapshot()
    const metadata = { ...source, layout: { ...source.layout, row_count: '21', editable: false, affected_site_ids: ['site-A'], effective_from_ms: '1789000000000000002' } }
    assert.equal(m.hasLayoutChanges(source, metadata, true), false)
    assert.throws(() => m.makeCommand(source, metadata, '未修改', 'request_layout', true, true), /EMPTY_CHANGES/)
    const changed = { ...metadata, layout: { ...metadata.layout, price_band_width: '2' } }
    assert.equal(m.hasLayoutChanges(source, changed, false), false)
    assert.equal(m.hasLayoutChanges(source, changed, true), true)
    assert.equal(m.hasLayoutChanges({ ...source, layout: { ...source.layout, editable: false } }, changed, true), false)
    assert.deepEqual(m.makeCommand(source, { ...source, enabled: false }, '停用', 'request_layout', false).changes, { enabled: false })
})

test('layout command validates horizon using source column count and rejects excessive decimal precision', async () => {
    const m = await subject(), source = layoutSnapshot()
    assert.deepEqual(m.makeCommand(source, { ...source, layout: { ...source.layout, price_band_width: '1.00000000' } }, '调整', 'request_layout', true, true).changes, { price_band_width: '1' })
    assert.deepEqual(m.makeCommand(source, { ...source, layout: { ...source.layout, column_duration_seconds: '10' } }, '调整', 'request_layout', true, true).changes, { column_duration_seconds: '10' })
    for (const duration of ['0', '1.5', '1e0', '11', '26', '9007199254740993']) {
        assert.throws(() => m.makeCommand(source, { ...source, layout: { ...source.layout, column_duration_seconds: duration } }, '调整', 'request_layout', true, true))
    }
    const wide = { ...source, layout: { ...source.layout, column_count: '30' } }
    assert.throws(() => m.makeCommand(wide, { ...wide, layout: { ...wide.layout, column_duration_seconds: '4' } }, '调整', 'request_layout', true, true), /INVALID_LAYOUT_HORIZON/)
    assert.throws(() => m.makeCommand(source, { ...source, layout: { ...source.layout, price_band_width: '1.0000000000000000001' } }, '调整', 'request_layout', true, true), /INVALID_LAYOUT_PRECISION/)
})

test('layout UNKNOWN recovery freezes exact original body and old pending commands still load', async () => {
    const m = await subject(), source = layoutSnapshot(), storage = memory()
    const command = m.makeCommand(source, { ...source, layout: { ...source.layout, price_band_width: '1.00000001' } }, '调整', 'request_layout', true, true)
    const pending = m.persistPending(storage, '101', command), original = JSON.stringify(pending.command)
    const first = await m.attemptPending(storage, pending, 'save', async () => { throw { operation_status: 'UNKNOWN' } })
    assert.equal(first.status, 'unknown')
    command.changes.price_band_width = '9'
    source.layout.price_band_width = '8'
    const restored = m.readPending(storage)
    assert.equal(Object.isFrozen(restored.command.changes), true)
    const calls = []
    await m.attemptPending(storage, restored, 'receipt', async (mode, body) => { calls.push([mode, JSON.stringify(body)]); throw { operation_status: 'UNKNOWN' } })
    assert.deepEqual(calls, [['receipt', original]])
    assert.equal(JSON.stringify(m.readPending(storage).command), original)
    const oldStorage = memory()
    m.persistPending(oldStorage, '101', m.makeCommand(snapshot(), { ...snapshot(), enabled: false }, '停用', 'request_old', true))
    assert.deepEqual(m.readPending(oldStorage).command.changes, { enabled: false })
    const historicalCommand = structuredClone(command)
    historicalCommand.changes.price_band_width = '1.000000000000000001'
    oldStorage.setItem('grid.config.pending.v1', JSON.stringify({ schema: 1, operator_id: '101', command: historicalCommand }))
    assert.equal(m.readPending(oldStorage).command.changes.price_band_width, '1.000000000000000001')
    for (const changes of [{ price_band_width: '0' }, { price_band_width: '1.0000000000000000001' }, { column_duration_seconds: '1.5' }, { column_duration_seconds: '26' }, { row_count: '20' }]) {
        const bad = memory()
        bad.setItem('grid.config.pending.v1', JSON.stringify({ schema: 1, operator_id: '101', command: { ...command, changes } }))
        assert.throws(() => m.readPending(bad))
    }
})


test('legacy positive layouts remain readable and do not block site-only saves', async () => {
    const m = await subject(), base = layoutSnapshot()
    for (const layout of [
        { ...base.layout, row_count: '20', column_count: '30', column_duration_seconds: '10' },
        { ...base.layout, column_count: '10', price_band_width: '0.0000000000000000001' },
        { ...base.layout, row_count: '10001', column_duration_seconds: '26' }
    ]) {
        const source = { ...base, layout }
        assert.deepEqual(m.normalizeSnapshot(source).layout, layout)
        assert.deepEqual(m.makeCommand(source, { ...source, enabled: false, target_rtp: '0.9' }, '调整经营参数', 'request_legacy', false, false).changes, { enabled: false, target_rtp: '0.9' })
        assert.throws(() => m.makeCommand(source, source, '未修改', 'request_legacy', true, true), /EMPTY_CHANGES/)
    }
})

test('legacy layout repairs validate the complete resulting layout only when geometry changes', async () => {
    const m = await subject(), base = layoutSnapshot()
    const source = { ...base, layout: { ...base.layout, column_count: '30', column_duration_seconds: '5' } }
    assert.throws(() => m.makeCommand(source, { ...source, layout: { ...source.layout, price_band_width: '2' } }, '未修复时域', 'request_repair', true, true), /INVALID_LAYOUT_HORIZON/)
    assert.throws(() => m.makeCommand(source, { ...source, layout: { ...source.layout, column_duration_seconds: '4' } }, '时域仍超限', 'request_repair', true, true), /INVALID_LAYOUT_HORIZON/)
    assert.deepEqual(m.makeCommand(source, { ...source, layout: { ...source.layout, column_duration_seconds: '2' } }, '修复时域', 'request_repair', true, true).changes, { column_duration_seconds: '2' })
    const precise = { ...source, layout: { ...source.layout, price_band_width: '0.0000000000000000001' } }
    assert.throws(() => m.makeCommand(precise, { ...precise, layout: { ...precise.layout, column_duration_seconds: '2' } }, '精度仍超限', 'request_repair', true, true), /INVALID_DECIMAL/)
    assert.deepEqual(m.makeCommand(precise, { ...precise, layout: { ...precise.layout, column_duration_seconds: '2', price_band_width: '0.00000001' } }, '同时修复', 'request_repair', true, true).changes, { price_band_width: '0.00000001', column_duration_seconds: '2' })
    const tooManyCells = { ...base, layout: { ...base.layout, row_count: '2501' } }
    assert.throws(() => m.makeCommand(tooManyCells, { ...tooManyCells, layout: { ...tooManyCells.layout, row_count: '20', price_band_width: '2' } }, '不可改只读行数', 'request_repair', true, true), /INVALID_GRID_LAYOUT/)
})


test('v3新保存绑定配置来源与默认屏障，旧原请求保持原格式', async () => {
    const m=await subject(), old=snapshot(), source={...old,config_id:'11',requested_agent_id:'29',agent_id:null,inherited:true,default_config_id:'11',default_version:'7',default_resolution_epoch:'2',default_enabled:true,effective_enabled:true,default_target_rtp:'0.9',default_min_order_amount:'0.00000001',default_max_order_amount:'9007199254740993.00000001'}
    const result=m.makeCommand(source,{...source,target_rtp:'0.8'},'调整','request_v3',false)
    assert.equal(result.based_on_config_id,'11')
    assert.equal(result.based_on_default_version,'7')
    assert.equal(result.based_on_default_resolution_epoch,'2')
    assert.throws(()=>m.makeCommand(source,{...source,target_rtp:'0.95'},'越界','request_over',false),/PLATFORM_LIMIT/)
    const storage=memory();const legacy={site_id:'site-A',symbol:'BTCUSDT',based_on_layout_version:'1',based_on_site_version:'1',client_request_id:'legacy_123',reason:'旧请求',changes:{enabled:false}}
    storage.setItem('grid.config.pending.v1',JSON.stringify({schema:1,operator_id:'29',command:legacy}))
    assert.deepEqual(m.readPending(storage).command,legacy)
})


test('recovery sends the exact original command to save and clears only a valid success', async () => {
    const m = await subject(), storage = memory()
    const original = m.makeCommand(snapshot(), { ...snapshot(), enabled: false }, '恢复原请求', 'recovery_123', true)
    const pending = m.persistPending(storage, '101', original), calls = []
    const result = await m.attemptPending(storage, pending, 'recover', async (route, body) => {
        calls.push([route, structuredClone(body)])
        return { operation_status: 'SUCCEEDED', operation_id: '91', site_id: original.site_id, symbol: original.symbol,
            layout_version: original.based_on_layout_version, site_version: '8', effective_from_ms: '123', changed: true, cache_state: 'PENDING' }
    })
    assert.equal(result.status, 'success')
    assert.deepEqual(calls, [['save', original]])
    assert.equal(m.readPending(storage), null)
})

test('recovery clears a superseded request only after a definitive version conflict', async () => {
    const m = await subject(), storage = memory()
    const original = m.makeCommand(snapshot(), { ...snapshot(), enabled: false }, '恢复', 'recovery_123', true)
    const pending = m.persistPending(storage, '101', original)
    const result = await m.attemptPending(storage, pending, 'recover', async () => {
        throw { error_code: 'VERSION_CONFLICT', operation_status: 'FAILED' }
    })
    assert.equal(result.status, 'rejected')
    assert.equal(result.journalCleared, true)
    assert.equal(m.readPending(storage), null)
})

test('recovery preserves a replacement journal and UNKNOWN version conflicts', async () => {
    const m = await subject(), original = m.makeCommand(snapshot(), { ...snapshot(), enabled: false }, '恢复', 'recovery_123', true)
    const storage = memory(), pending = m.persistPending(storage, '101', original)
    const replacement = { ...pending, command: { ...original, reason: 'other request' } }
    const changed = await m.attemptPending(storage, pending, 'recover', async () => {
        storage.setItem('grid.config.pending.v1', JSON.stringify(replacement))
        throw { error_code: 'VERSION_CONFLICT', operation_status: 'FAILED' }
    })
    assert.equal(changed.status, 'rejected')
    assert.equal(changed.journalCleared, false)
    assert.deepEqual(m.readPending(storage), replacement)
    const freshStorage = memory(), fresh = m.persistPending(freshStorage, '101', original)
    const unknown = await m.attemptPending(freshStorage, fresh, 'recover', async () => {
        throw { error_code: 'VERSION_CONFLICT', operation_status: 'UNKNOWN' }
    })
    assert.equal(unknown.status, 'unknown')
    assert.deepEqual(m.readPending(freshStorage), fresh)
})

test('recovery retains the journal on other rejection, timeout or malformed receipt', async () => {
    const m = await subject()
    for (const error_code of ['FORBIDDEN', 'IDEMPOTENCY_CONFLICT', 'INVALID_INPUT', 'DATABASE_ERROR']) {
        const storage = memory(), original = m.makeCommand(snapshot(), { ...snapshot(), enabled: false }, '恢复', 'recovery_123', true)
        const pending = m.persistPending(storage, '101', original)
        const result = await m.attemptPending(storage, pending, 'recover', async () => { throw { error_code, operation_status: 'FAILED' } })
        assert.equal(result.status, 'unknown', error_code)
        assert.deepEqual(m.readPending(storage), pending)
    }
    for (const sender of [async () => { throw new Error('timeout') }, async () => ({ operation_status: 'SUCCEEDED' })]) {
        const storage = memory(), original = m.makeCommand(snapshot(), { ...snapshot(), enabled: false }, '恢复', 'recovery_123', true)
        const pending = m.persistPending(storage, '101', original)
        const result = await m.attemptPending(storage, pending, 'recover', sender)
        assert.equal(result.status, 'unknown')
        assert.deepEqual(m.readPending(storage), pending)
    }
})

test('only an unconfirmed receipt permits offering original-request recovery', async () => {
    const m = await subject()
    assert.equal(m.isUnconfirmedReceipt({ error_code: 'RECEIPT_UNCONFIRMED', operation_status: 'UNKNOWN' }), true)
    for (const error of [null, {}, { error_code: 'RECEIPT_UNCONFIRMED' }, { error_code: 'RECEIPT_UNCONFIRMED', operation_status: 'FAILED' },
        { error_code: 'DEPENDENCY_UNAVAILABLE', operation_status: 'UNKNOWN' }, { error_code: 'IDEMPOTENCY_CONFLICT', operation_status: 'UNKNOWN' }]) {
        assert.equal(m.isUnconfirmedReceipt(error), false)
    }
})


test('layout precision keeps legacy null and exact zero/eight, rejects lossy width and owner overrides', () => {
 const legacy=layoutSnapshot()
 for(const d of [null,0,8,18]) {
  const source={...legacy,layout:{...legacy.layout,price_decimals:d}}
  assert.equal(module.normalizeSnapshot(source).layout.price_decimals,d)
  assert.deepEqual(module.makeCommand(source,{...source,enabled:false},'switch','precision_switch',true,true).changes,{enabled:false})
 }
 for(const d of [0,8]) {
  const source={...legacy,layout:{...legacy.layout,price_band_width:'5',price_decimals:null}}
  const draft={...source,layout:{...source.layout,price_decimals:d}}
  const cmd=module.makeCommand(source,draft,'precision','precision_request',true,true)
  assert.deepEqual(cmd.changes,{price_decimals:d})
  const storage=memory();module.persistPending(storage,'101',cmd)
  assert.deepEqual(module.readPending(storage).command,cmd)
  assert.throws(()=>module.makeCommand(source,draft,'precision','precision_request',false,false),/FIELD_FORBIDDEN/)
 }
 const source={...legacy,layout:{...legacy.layout,price_band_width:'0.5',price_decimals:null}}
 for(const d of [-1,9,1.5,'8',true,undefined])assert.throws(()=>module.makeCommand(source,{...source,layout:{...source.layout,price_decimals:d}},'precision','precision_request',true,true))
 assert.throws(()=>module.makeCommand(source,{...source,layout:{...source.layout,price_decimals:0}},'precision','precision_request',true,true),/INVALID_LAYOUT_PRECISION/)
})


test('editable Grid draft defaults missing precision to three without changing stored snapshots', () => {
 for (const n of [undefined, null, 0, 3, 8, 18]) {
  const source = {...snapshot(), layout:{editable:true,price_decimals:n}}
  const draft = module.createGridDraft(source)
  assert.equal(draft.layout.price_decimals, n ?? 3)
  assert.equal(source.layout.price_decimals, n)
 }
 const source = {...snapshot(),layout:{editable:false,price_decimals:null}}
 assert.equal(module.createGridDraft(source).layout.price_decimals,null)
 assert.equal(module.createGridDraft(source,false).layout.price_decimals,null)
 source.layout.editable=true
 assert.equal(module.createGridDraft(source,false).layout.price_decimals,null)
 assert.equal(module.createGridDraft(snapshot()).layout,undefined)
})

test('default Grid precision is submitted through the existing command and still validates width', () => {
 const source=layoutSnapshot();source.layout.price_decimals=null;source.layout.price_band_width='0.001'
 const draft=module.createGridDraft(source)
 assert.deepEqual(module.makeCommand(source,draft,'default precision','default_precision_request',true,true).changes,{price_decimals:3})
 source.layout.price_band_width='0.0001'
 assert.throws(()=>module.makeCommand(source,module.createGridDraft(source),'default precision','default_precision_request',true,true),/INVALID_LAYOUT_PRECISION/)
 assert.equal(source.layout.price_decimals,null)
})
