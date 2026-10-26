<template>
    <el-dialog v-model="visible" title="预测网格玩法说明" width="860px" class="prediction-grid-guide mm-ui" append-to-body destroy-on-close>
        <template #header><h2 class="guide-title">预测网格玩法说明</h2><p class="guide-subtitle">用一个例子看懂格子、命中概率和赔率</p></template>
        <div class="guide-body">
            <div class="guide-metrics">
                <article><span>示例网格大小</span><strong>10 × 10</strong><small>横向 10 列，纵向 10 行</small></article>
                <article><span>每列时间</span><strong>2 秒</strong><small>每个格子只在对应 2 秒内有效</small></article>
                <article><span>覆盖时间</span><strong>20 秒</strong><small>从左到右预测未来 20 秒</small></article>
                <article><span>下单方式</span><strong>点 1 格</strong><small>点击一个格子就是一笔订单</small></article>
            </div>
            <p class="guide-note">以下网格与概率推演用于说明原型示例。实际格子的价格范围、有效时间、可下注状态和锁定赔率以交易页面及订单记录为准。</p>
            <section><header><b>01</b><div><h3>这个网格怎么看？</h3><p>横向看时间，纵向看价格；一个格子代表“某个价格在某段时间出现”。</p></div></header>
                <div class="guide-columns"><article><h4>X 轴＝未来时间</h4><p>共 10 列，每列 2 秒。第 1 列看未来第 0～2 秒，第 2 列看第 2～4 秒，依次覆盖未来 20 秒。</p></article><article><h4>Y 轴＝价格区间</h4><p>共 10 行，以当前价格为中线，上方 5 行、下方 5 行，每行对应一个明确的价格范围。</p></article></div>
            </section>
            <section><header><b>02</b><div><h3>什么叫“命中”？</h3><p>看的是这 2 秒内价格有没有碰过格子，不是 2 秒结束时价格停在哪里。</p></div></header>
                <article class="guide-example"><h4>举例</h4><p>买入格子：BTC 65,010～65,020 · 10:00:04～10:00:06</p><p><el-tag type="success">命中</el-tag> 10:00:05 价格到达 65,015，进入了格子价格范围。</p><p><el-tag type="success">命中</el-tag> 连续有效行情从 65,005 到达 65,025，线段中间穿过了这个格子，也算碰到。</p><p><el-tag type="danger">未命中</el-tag> 这 2 秒内价格始终没有进入或穿过 65,010～65,020。</p></article>
                <p>只要有效时间内碰到一次就算命中；离开后不用继续停在格子里。到 10:00:06 时这个格子已经结束，之后再碰到不算。行情缺口不能跨缺口连线判定命中。</p>
            </section>
            <section><header><b>03</b><div><h3>命中概率怎么来的？</h3><p>原型按当前价格、距离、剩余时间和最近的波动大小推演，不按用户下注人数计算。</p></div></header>
                <ol><li><strong>看当前价格</strong>：从最新标记价出发，确定目标格子离当前价格有多远。</li><li><strong>看最近波动</strong>：根据最近一段行情，估算价格每 500ms 通常可能向上或向下移动多少；波动越大，概率扩散得越远。</li><li><strong>逐步推演</strong>：把可能价格切成 100 个位置，当前价格所在位置从 100% 开始。每 500ms 按正态分布把概率扩散到下一批价格位置；2 秒共计算 4 步。</li><li><strong>收集命中</strong>：某一步进入或穿过目标价格范围，就把这部分概率记为命中；已经命中的部分不重复计算。</li></ol>
                <article class="guide-formulas"><h4>原型计算公式示例 <small>时间单位统一为 500ms</small></h4>
                    <div v-for="formula in formulas" :key="formula.title"><h4>{{ formula.title }}</h4><pre>{{ formula.expression }}</pre><p>{{ formula.explanation }}</p></div>
                </article>
                <article class="guide-example"><h4>具体例子</h4><p>目标格子的 2 秒内共有 4 个 500ms 步骤。每一步“第一次碰到格子”的概率分别为 6%、5%、4%、5%：</p><strong>命中概率＝6%＋5%＋4%＋5%＝20%</strong><p>也可以理解为：命中概率＝100%－到结束时仍然从未碰到格子的概率。</p><p>如果格子在未来第 8～10 秒，先推演价格走到第 8 秒可能在哪里，再只统计第 8～10 秒这 2 秒内是否碰到。</p></article>
                <p class="guide-note">命中概率就是“从当前价格出发，按照最近的波动速度运行，在格子指定的 2 秒内进入或穿过该价格范围”的总概率。上述节点数和步长是示例，不是可在本页修改的交易参数。</p>
            </section>
            <section><header><b>04</b><div><h3>概率怎么变成赔率？</h3><p>概率越高，赔率越低；概率越低，赔率越高。</p></div></header>
                <div class="guide-equation">赔率＝目标返奖率 ÷ 命中概率</div>
                <article class="guide-example"><p>目标返奖率为 97%，命中概率为 20%：97% ÷ 20%＝4.85。若订单锁定为 4.85x，下注 100 USDT，命中总返还为 485 USDT。</p><p>页面若简写为 4.9x，仅是显示精度；不能据此把订单锁定的返还改成 490 USDT。</p></article>
                <p>原型示例使用最低赔率 1.02x、最高赔率 20x，超出最高值的格子不可下注，不强制压低赔率。实际可下注状态以当前格子报价为准，本页示例不改变交易服务规则。</p>
            </section>
            <section><header><b>05</b><div><h3>前后端需要统一的三件事</h3><p>规则保持一致，才能避免前端显示命中、后端却判定未命中。</p></div></header>
                <ul><li><strong>统一价格：</strong>展示、概率计算和结算都使用平台合约标记价。</li><li><strong>下单后锁定：</strong>用户下单后，该格子的价格范围、有效时间和赔率不再跟着新网格变化。</li><li><strong>异常不判输：</strong>有效时间内价格数据中断或无法确认是否碰到时，订单进入异常处理或退款。</li></ul>
            </section>
        </div>
        <template #footer><div class="guide-footer"><span>核心规则：有效时间内，连续有效价格进入或穿过对应价格范围一次，即为命中。</span><el-button type="primary" @click="visible = false">我知道了</el-button></div></template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ElDialog, ElTag, ElButton } from 'element-plus'

const visible = defineModel<boolean>({ default: false })
const formulas = [
    { title: '① 计算短期波动率', expression: 'rₖ = ln(Pₖ ÷ Pₖ₋₁)\nσ = √[ Σ(rₖ − r̄)² ÷ (M − 1) ]', explanation: 'Pₖ 是每 500ms 的标记价；示例取最近 60 秒，即 M＝120。这里的 σ 是每 500ms 对数价格波动率，不能直接使用年化波动率。' },
    { title: '② 建立 100 个可能价格位置', expression: 'y₀ = ln(P当前)\nymin = y₀ − 4σ√N，ymax = y₀ ＋ 4σ√N\nΔy = (ymax − ymin) ÷ 99，yⱼ = ymin ＋ jΔy', explanation: 'N 是从现在到格子结束的 500ms 步数；在对数价格上下 4 个标准差范围内均匀划分 100 个位置。' },
    { title: '③ 计算每 500ms 的价格转移概率', expression: 'φ(z) = e^(−z²/2) ÷ √(2π)\nwᵢⱼ = φ[(yⱼ − yᵢ) ÷ σ] × Δy ÷ σ\nTᵢⱼ = wᵢⱼ ÷ Σⱼwᵢⱼ', explanation: 'Tᵢⱼ 表示价格当前位于第 i 个位置，500ms 后移动到第 j 个位置的概率；每一行归一化后合计为 100%。' },
    { title: '④ 逐步传递并移除已命中的概率', expression: 'pₙ₊₁,ⱼ = Σᵢ(pₙ,ᵢ × Tᵢⱼ)\n有效期内，若 ln(L) ≤ yⱼ < ln(U)，则令 pₙ₊₁,ⱼ = 0', explanation: 'L、U 是格子价格下限和上限。进入格子的概率被移除，代表已经命中，后续步骤不再重复计算这部分概率；实际穿越判定同时考虑有效行情线段。' },
    { title: '⑤ 得到最终命中概率', expression: 'pHit = 1 − Σⱼp结束,ⱼ', explanation: 'Σp结束 是格子有效期结束后仍然从未进入格子的概率；用 100% 减去它，就是该格子的命中概率。' },
]
</script>
<style scoped>
.guide-title { margin:0; color:var(--el-text-color-primary); font-size:16px; font-weight:700; line-height:22px; }
.guide-subtitle { margin:4px 0 0; font-size:11px; line-height:16px; color:var(--el-text-color-secondary); }
.guide-body { color:var(--el-text-color-regular); font-size:10px; line-height:1.6; }
.guide-metrics { display:grid; gap:8px; grid-template-columns:repeat(4,minmax(0,1fr)); }
.guide-metrics article { padding:11px 12px; border:1px solid var(--el-color-primary-light-7); border-radius:8px; min-width:0; }
.guide-metrics span,.guide-metrics small { display:block; font-size:10px; color:var(--el-text-color-secondary); }
.guide-metrics strong { display:block; margin:4px 0; font-size:16px; line-height:20px; font-weight:700; color:var(--el-color-primary); }
.guide-body section { margin-top:12px; border:1px solid var(--el-border-color-lighter); border-radius:9px; overflow:hidden; }
.guide-body header { display:flex; align-items:flex-start; gap:10px; padding:12px 14px; border-bottom:1px solid var(--el-border-color-lighter); }
.guide-body header b { flex:none; display:flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:6px; color:var(--el-color-primary); background:var(--el-color-primary-light-9); font-size:12px; }
.guide-body h3 { margin:0; color:var(--el-text-color-primary); font-size:12px; font-weight:700; line-height:17.4px; }
.guide-body h4 { margin:0 0 6px; color:var(--el-text-color-primary); font-size:11px; font-weight:700; }
.guide-body p { margin:6px 0 0; font-size:10px; line-height:16px; }
.guide-body header p { margin:3px 0 0; color:var(--el-text-color-secondary); line-height:15px; }
.guide-columns { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); }
.guide-columns article { padding:12px 14px; }
.guide-columns article + article { border-left:1px solid var(--el-border-color-lighter); }
.guide-note, .guide-body section > p { padding:10px 12px; margin:10px 14px 12px; border-radius:6px; background:var(--el-color-primary-light-9); color:var(--el-text-color-secondary); }
.guide-body > .guide-note { margin:10px 0; }
.guide-example { margin:12px 14px; }
.guide-example:has(.el-tag) { display:grid; gap:8px; }
.guide-example:has(.el-tag) > h4 { display:none; }
.guide-example:has(.el-tag) > p { margin:0; padding:9px 12px; border:1px solid var(--el-border-color-lighter); border-radius:6px; display:flex; align-items:center; gap:8px; }
.guide-example:has(.el-tag) > p:first-of-type { background:var(--el-fill-color-light); border:0; }
.guide-example .el-tag { flex:none; min-width:52px; height:24px; border:0; border-radius:12px; font-size:10px; font-weight:650; }
.guide-body ol { counter-reset:step; display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px; padding:12px 14px; margin:0; list-style:none; }
.guide-body ol li { padding:10px; border:1px solid var(--el-border-color-lighter); border-radius:6px; font-size:10px; line-height:15.5px; }
.guide-body ol li::before { counter-increment:step; content:counter(step); display:block; color:var(--el-color-primary); font-weight:700; margin-bottom:6px; }
.guide-body ul { margin:0; padding:12px 14px 12px 28px; }
.guide-body ul li { margin:6px 0; }
.guide-formulas { margin:0 14px 12px; border:1px solid var(--el-border-color-lighter); border-radius:7px; overflow:hidden; }
.guide-formulas > h4 { margin:0; padding:10px 12px; background:var(--el-fill-color-light); }
.guide-formulas > div { padding:12px; border-top:1px solid var(--el-border-color-lighter); }
.guide-formulas pre { margin:8px 0; padding:10px; font-family:ui-monospace,monospace; font-size:11px; line-height:1.6; white-space:pre-wrap; overflow-wrap:anywhere; background:var(--el-fill-color-light); border-radius:5px; }
.guide-formulas small { margin-left:8px; color:var(--el-text-color-secondary); font-size:10px; font-weight:400; }
.guide-equation { margin:12px 14px; padding:12px; font-size:14px; font-weight:700; color:var(--el-color-primary); background:var(--el-color-primary-light-9); border-radius:6px; }
.guide-footer { display:flex; align-items:center; justify-content:space-between; gap:16px; }
.guide-footer span { font-size:10px; line-height:16px; color:var(--el-text-color-secondary); text-align:left; }
.guide-footer .el-button { height:36px; padding:0 16px; border-radius:6px; font-size:11px; font-weight:700; flex:none; }
@media(max-width:600px) { .guide-metrics,.guide-body ol { grid-template-columns:repeat(2,minmax(0,1fr)); } .guide-columns { grid-template-columns:1fr; } .guide-columns article + article { border-left:0; border-top:1px solid var(--el-border-color-lighter); } .guide-footer { gap:8px; } }
</style>
<style>
:root .el-overlay-dialog .el-dialog.prediction-grid-guide { max-width:calc(100vw - 32px); height:88vh; max-height:88vh; margin:6vh auto; padding:0; border-radius:12px; display:flex; flex-direction:column; font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif; }
:root .el-overlay-dialog .prediction-grid-guide .el-dialog__header { flex:none; margin:0; padding:16px 20px; border-bottom:1px solid var(--el-border-color-lighter); }
:root .el-overlay-dialog .prediction-grid-guide .el-dialog__headerbtn { top:20px; right:20px; width:32px; height:32px; border:1px solid var(--el-border-color); border-radius:6px; }
:root .el-overlay-dialog .prediction-grid-guide .el-dialog__body { flex:1; min-height:0; padding:16px 20px; overflow-y:auto; }
:root .el-overlay-dialog .prediction-grid-guide .el-dialog__footer { flex:none; padding:12px 20px; border-top:1px solid var(--el-border-color-lighter); }
</style>
