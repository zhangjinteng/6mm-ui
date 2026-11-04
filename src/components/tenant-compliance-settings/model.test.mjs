import assert from 'node:assert/strict'
import test from 'node:test'
import {
    complianceTypes,
    validComplianceUrl,
    validateCompliance,
    normalizeCompliance,
    toComplianceDraft
} from './model.ts'

const fixture = () => ({
    profile: {
        legal_entity_name: 'Alpha Ltd',
        registration_number: 'HK-123',
        registered_address: 'Address',
        support_email: 'support@example.com',
        effective_date: '2026-11-03'
    },
    agreements: complianceTypes.map((t) => ({
        agreement_type: t.value,
        mode: 'platform',
        is_enabled: true,
        url: ''
    }))
})
test('platform references require complete legal variables; all custom/disabled permits empty profile', () => {
    const d = fixture()
    assert.deepEqual(validateCompliance(d), {})
    d.profile.legal_entity_name = ''
    assert.ok(validateCompliance(d)['profile.legal_entity_name'])
    d.agreements.forEach((a) => (a.is_enabled = false))
    assert.deepEqual(validateCompliance(d), {})
})
test('HTTPS links reject script, credentials, controls and HTML', () => {
    assert.ok(validComplianceUrl('https://legal.example.com/terms?a=1&b=2'))
    for (const url of [
        'javascript:alert(1)',
        'http://example.com',
        'https://a:b@example.com',
        'https://example.com/"x',
        'https://example.com/\nx'
    ])
        assert.ok(!validComplianceUrl(url))
    const d = fixture()
    d.agreements[0].mode = 'url'
    assert.ok(validateCompliance(d)['agreements.0.url'])
    d.agreements[0].is_enabled = false
    assert.deepEqual(validateCompliance(d), {})
})
test('date and email errors clear on correction', () => {
    const d = fixture()
    d.profile.effective_date = '2026-02-30'
    d.profile.support_email = 'invalid'
    assert.ok(validateCompliance(d)['profile.effective_date'])
    assert.ok(validateCompliance(d)['profile.support_email'])
    d.profile.effective_date = '2028-02-29'
    d.profile.support_email = 'valid@example.com'
    assert.deepEqual(validateCompliance(d), {})
})
test('draft conversion strips server metadata and trims fields', () => {
    const f = fixture(),
        detail = {
            ...f,
            revision: 'secret',
            agreements: f.agreements.map((a) => ({ ...a, published_version: '1' }))
        }
    const d = toComplianceDraft(detail)
    assert.equal(d.revision, undefined)
    assert.equal(d.agreements[0].published_version, undefined)
    d.profile.legal_entity_name = ' Alpha '
    assert.equal(normalizeCompliance(d).profile.legal_entity_name, 'Alpha')
})

