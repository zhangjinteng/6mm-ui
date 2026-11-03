import { a as e, n as t, t as n } from "./_plugin-vue_export-helper-BDMPCwNE.js";
import { Fragment as r, computed as i, createBlock as a, createCommentVNode as o, createElementBlock as s, createElementVNode as c, createSlots as l, createTextVNode as u, createVNode as d, defineComponent as f, inject as p, mergeModels as m, mergeProps as h, nextTick as g, normalizeClass as ee, normalizeStyle as _, onBeforeUnmount as te, onMounted as ne, openBlock as v, provide as y, ref as b, renderList as re, renderSlot as x, resolveDynamicComponent as S, shallowRef as C, toDisplayString as w, toRaw as ie, unref as T, useModel as ae, watch as oe, withCtx as E, withKeys as D, withModifiers as O } from "vue";
import "element-plus/es/components/alert/style/css";
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/card/style/css";
import "element-plus/es/components/dialog/style/css";
import "element-plus/es/components/drawer/style/css";
import "element-plus/es/components/empty/style/css";
import "element-plus/es/components/form/style/css";
import "element-plus/es/components/form-item/style/css";
import "element-plus/es/components/icon/style/css";
import "element-plus/es/components/input/style/css";
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/message-box/style/css";
import "element-plus/es/components/option/style/css";
import "element-plus/es/components/popover/style/css";
import "element-plus/es/components/select/style/css";
import "element-plus/es/components/switch/style/css";
import "element-plus/es/components/tag/style/css";
import { ElAlert as k, ElButton as A, ElCard as j, ElConfigProvider as M, ElDialog as N, ElDrawer as P, ElEmpty as F, ElForm as se, ElFormItem as I, ElIcon as L, ElInput as R, ElMessage as z, ElMessageBox as ce, ElOption as le, ElPopover as B, ElSelect as ue, ElSwitch as de, ElTag as V, useFormDisabled as H } from "element-plus";
import { QuestionFilled as U } from "@element-plus/icons-vue";
import fe from "element-plus/es/locale/lang/en";
import W from "element-plus/es/locale/lang/zh-cn";
//#region src/prediction-config/runtime.ts
var G = Symbol("MmPredictionGameConfig");
function K() {
	let e = p(G);
	if (!e) throw Error("Prediction configuration runtime is missing");
	return e;
}
function pe() {
	let { adapter: e } = K();
	if (e.role !== "platform") throw Error("Platform configuration adapter required");
	return e;
}
function me() {
	let { adapter: e } = K();
	if (e.role !== "agent") throw Error("Agent configuration adapter required");
	return e;
}
function he() {
	let e = K();
	return {
		get userInfo() {
			return {
				id: e.context.operatorId,
				can_manage_prediction_config: e.context.canManagePredictionConfig === !0
			};
		},
		get perms() {
			return e.context.permissions;
		},
		get token() {
			return e.context.identityKey;
		}
	};
}
function ge() {
	return K().symbolComponent;
}
function _e(e) {
	K().registerBeforeLeave?.(e);
}
function ve() {
	let e = K();
	return {
		locale: i(() => e.locale),
		t: (t) => e.translate?.(t) ?? t,
		te: (t) => e.hasTranslation?.(t) ?? !1
	};
}
//#endregion
//#region src/prediction-config/platform/views/prediction/format.ts
var ye = 9223372036854775807n;
function be(e, t = ye, n = !0) {
	return typeof e == "string" && /^(0|[1-9]\d*)$/.test(e) && BigInt(e) <= t && (n || e !== "0");
}
function xe(e) {
	return e == null ? "未提供" : be(e, 8640000000000000n) ? new Date(Number(e)).toLocaleString("zh-CN", { hour12: !1 }) : `${String(e)}（无法显示时间）`;
}
function Se(e, t = "UP_DOWN") {
	let n = {
		35: "5",
		40: "10",
		45: "15",
		60: "30",
		90: "60"
	};
	return t === "UP_DOWN" ? n[e] ? `${n[e]}秒` : `历史周期${e}秒` : `${e}秒`;
}
function Ce(e) {
	return e instanceof Error || e && typeof e == "object" && "message" in e && typeof e.message == "string" ? e.message : "暂时无法获取确定结果，请稍后刷新或核验原操作";
}
//#endregion
//#region src/prediction-config/platform/views/config/prediction/form.ts
var q = /^(?:0|[1-9]\d*)(?:\.\d+)?$/, we = /^[1-9]\d*$/, Te = /^\d+$/, Ee = [
	"35",
	"40",
	"45",
	"60",
	"90"
], De = [
	"5",
	"10",
	"15",
	"30",
	"60"
], Oe = (e) => {
	if (e === "GAME_TYPE_UP_DOWN") return "UP_DOWN";
	if (e === "GAME_TYPE_HIGH_LOW") return "HIGH_LOW";
	throw Error(`不支持的预测玩法类型：${e || "空"}`);
}, ke = (e) => ({
	default_value: e.default_value,
	minimum_value: e.minimum_value,
	maximum_value: e.maximum_value,
	agent_editable: e.agent_editable
}), Ae = (e) => ({
	default_value: e.default_value,
	minimum_value: e.minimum_value,
	maximum_value: e.maximum_value,
	agent_editable: e.agent_editable
}), je = (e) => {
	let t = {
		enabled_by_default: e.enabled_by_default,
		display_order: e.display_order,
		minimum_stake: ke(e.minimum_stake),
		maximum_stake: ke(e.maximum_stake),
		retired: e.retired
	};
	return e.stake_tier_id && (t.stake_tier_id = e.stake_tier_id), t;
}, Me = (e, t) => {
	let n = e.stake_tiers ?? [], r = n.find((e) => !e.retired) ?? n[0], i = e[t] ?? r?.[t];
	if (!i) throw Error(`周期 ${e.duration_seconds || "--"} 秒缺少${t === "minimum_stake" ? "最低" : "最高"}下注限制配置，请刷新后重试`);
	return i;
}, Ne = (e) => {
	let t = {
		duration_seconds: e.duration_seconds,
		enabled_by_default: e.enabled_by_default,
		minimum_stake: ke(Me(e, "minimum_stake")),
		maximum_stake: ke(Me(e, "maximum_stake")),
		settlement_display_seconds: e.settlement_display_seconds,
		price_rule: {
			max_age_milliseconds: e.price_rule.max_age_milliseconds,
			late_arrival_grace_milliseconds: e.price_rule.late_arrival_grace_milliseconds,
			price_decimals: e.price_rule.price_decimals === void 0 ? 3 : e.price_rule.price_decimals
		}
	};
	e.market_id && (t.market_id = e.market_id), e.bet_open_seconds && (t.bet_open_seconds = Ae(e.bet_open_seconds)), e.target_payout_rate && (t.target_payout_rate = ke(e.target_payout_rate)), e.minimum_odds && (t.minimum_odds = {
		default_value: "1",
		minimum_value: "1",
		maximum_value: "1",
		agent_editable: !1
	}), e.maximum_odds && (t.maximum_odds = ke(e.maximum_odds)), e.fixed_odds && (t.fixed_odds = ke(e.fixed_odds));
	let n = e.stake_tiers ?? [];
	return n.length > 0 && (t.stake_tiers = n.map(je)), t;
};
function Pe(e) {
	let t = e.rules.map(Ne);
	if (new Set(t.map((e) => e.duration_seconds)).size !== t.length) throw Error("自选周期重复");
	return De.map((e) => {
		let n = t.find((t) => t.duration_seconds === e);
		if (n) return n;
		let r = e === "60" ? "5000" : "3000";
		return {
			duration_seconds: e,
			enabled_by_default: !0,
			fixed_odds: {
				default_value: "1.85",
				minimum_value: "1.01",
				maximum_value: "1.85",
				agent_editable: !0
			},
			minimum_stake: {
				default_value: "1",
				minimum_value: "1",
				maximum_value: r,
				agent_editable: !0
			},
			maximum_stake: {
				default_value: r,
				minimum_value: "1",
				maximum_value: r,
				agent_editable: !0
			},
			settlement_display_seconds: t[0].settlement_display_seconds,
			price_rule: structuredClone(t[0].price_rule)
		};
	});
}
function Fe(e) {
	let t = e.rules[0];
	if (!t) throw Error("当前配置没有可编辑周期");
	return {
		game_type: Oe(t.game_type),
		symbol: t.symbol,
		based_on_template_version: e.template_version,
		enabled: Ye(e),
		rules: (t.game_type === "GAME_TYPE_HIGH_LOW" ? Pe(e) : e.rules.map(Ne)).map((t) => ({
			...t,
			enabled_by_default: Je(e) || t.enabled_by_default
		}))
	};
}
function Ie(e, t, n) {
	e = ze(e);
	let r = structuredClone(e.rules);
	if (e.game_type === "UP_DOWN") for (let [t, n] of r.entries()) {
		let r = e.rules[t], i = n.stake_tiers?.find((e) => !e.retired);
		i && (i.minimum_stake = structuredClone(r.minimum_stake), i.maximum_stake = structuredClone(r.maximum_stake), i.enabled_by_default = n.enabled_by_default), delete n.minimum_stake, delete n.maximum_stake;
	}
	return {
		client_request_id: n,
		reason: t.trim(),
		based_on_template_version: e.based_on_template_version,
		game_type: e.game_type,
		symbol: e.symbol,
		platform_template: {
			enabled: !e.is_new && e.enabled,
			rules: r
		}
	};
}
function Le(e, t = e.is_new === !0) {
	e = ze(e);
	let n = [];
	e.symbol || n.push("交易对不能为空"), be(e.based_on_template_version) || n.push("配置版本无效"), e.rules.length === 0 && n.push("至少保留一个周期"), e.game_type === "UP_DOWN" && [...e.rules.map((e) => e.duration_seconds)].sort().join(",") !== Ee.join(",") && n.push("涨跌配置必须包含5、10、15、30、60秒五个固定房间"), e.game_type === "HIGH_LOW" && [...e.rules.map((e) => e.duration_seconds)].sort().join(",") !== [...De].sort().join(",") && n.push("自选配置必须包含5、10、15、30、60秒五个固定房间"), new Set(e.rules.map((e) => e.price_rule.price_decimals)).size > 1 && n.push("同一币种各周期的价格小数位必须一致");
	let r = /* @__PURE__ */ new Set();
	return e.rules.forEach((i) => {
		let a = `${i.duration_seconds || "--"} 秒周期`;
		we.test(i.duration_seconds) || n.push(`${a}的周期必须是正整数`), r.has(i.duration_seconds) && n.push(`周期 ${i.duration_seconds} 秒重复`), r.add(i.duration_seconds);
		let o = i.price_rule.price_decimals;
		o !== void 0 && (typeof o != "number" || !Number.isInteger(o) || o < 0 || o > 8) && n.push("价格小数位必须是0～8的整数"), Be(i.settlement_display_seconds, `${a}的结算展示时间`, n), Be(i.price_rule.max_age_milliseconds, `${a}的行情最大年龄`, n), Be(i.price_rule.late_arrival_grace_milliseconds, `${a}的行情延迟宽限`, n), He(i.minimum_stake, a, "最低下注额", n), He(i.maximum_stake, a, "最高下注额", n);
		let s = i.minimum_stake?.default_value, c = i.maximum_stake?.default_value, l = /^(0|[1-9]\d{0,17})(\.\d{1,18})?$/;
		typeof s != "string" || typeof c != "string" || !l.test(s) || !l.test(c) || Ue(s, "0") <= 0 || Ue(c, "0") <= 0 ? n.push(`${a}的单笔限额必须为正数，整数及小数最多18位`) : Ue(s, c) > 0 && n.push(`${a}的最小额不能大于最大额`), e.game_type === "UP_DOWN" ? (((e, t) => !!e && e.agent_editable === !1 && [
			e.minimum_value,
			e.default_value,
			e.maximum_value
		].every((e) => typeof e == "string" && q.test(e) && Ue(e, t) === 0))(i.bet_open_seconds, "30") || n.push("下注开放固定30秒且不可由代理调整"), (!t && !i.market_id || i.stake_tiers?.filter((e) => !e.retired).length !== 1) && n.push("房间配置不完整，请重新加载"), i.stake_tiers?.filter((e) => !e.retired).forEach((e) => {
			!t && !e.stake_tier_id && n.push("房间标识无效");
		}), [
			i.target_payout_rate,
			i.minimum_odds,
			i.maximum_odds
		].some((e) => e?.agent_editable !== !1) && n.push("返奖率和赔率不能由代理调整"), Ve(i.bet_open_seconds, a, "下注开放时间", n), He(i.target_payout_rate, a, "目标返奖率", n), typeof i.target_payout_rate?.default_value == "string" && q.test(i.target_payout_rate.default_value) && Ue(i.target_payout_rate.default_value, "1") >= 0 && n.push(`${a}的目标返奖率必须小于 100%`), He(i.minimum_odds, a, "最低赔率", n), He(i.maximum_odds, a, "最高赔率", n), i.stake_tiers?.length || n.push(`${a}的房间配置不完整`), i.stake_tiers?.forEach((e, t) => {
			let r = `${a}历史设置 ${t + 1}`;
			He(e.minimum_stake, r, "最低下注额", n), He(e.maximum_stake, r, "最高下注额", n);
		})) : (He(i.fixed_odds, a, "固定赔率", n), typeof i.fixed_odds?.default_value == "string" && q.test(i.fixed_odds.default_value) && Ue(i.fixed_odds.default_value, "2") >= 0 && n.push(`${a}的固定赔率必须小于 2`));
	}), [...new Set(n)];
}
function Re(e, t, n) {
	if (e.length <= 3) return e.join("；");
	let r = (e) => t === "UP_DOWN" ? String(Number(e) - 30) : e, i = `${n} 秒周期`, a = e.filter((e) => e.startsWith(i)), o = [...new Set(e.flatMap((e) => {
		let t = /^(\d+) 秒周期/.exec(e);
		return t && t[1] !== n ? [t[1]] : [];
	}))], s = [...e.filter((e) => !/^\d+ 秒周期/.test(e)).slice(0, 1), ...a.slice(0, 2)];
	return a.length > 2 && s.push(`${r(n)} 秒周期还有 ${a.length - 2} 项需检查`), o.length && s.push(`请补全 ${o.map(r).join("、")} 秒周期参数`), s.join("；").slice(0, 180);
}
function ze(e) {
	if (!e.is_new) return e;
	let t = structuredClone(e);
	for (let e of t.rules) {
		for (let t of [e.target_payout_rate, e.maximum_odds]) t && (t.minimum_value = t.maximum_value = t.default_value);
		e.fixed_odds && (e.fixed_odds.minimum_value = "1.000000000000000001", e.fixed_odds.maximum_value = e.fixed_odds.default_value);
		for (let t of e.stake_tiers ?? []) t.minimum_stake = structuredClone(e.minimum_stake), t.maximum_stake = structuredClone(e.maximum_stake);
	}
	return t;
}
function Be(e, t, n) {
	be(e) || n.push(`${t}必须是非负整数`);
}
function Ve(e, t, n, r) {
	if (!e) {
		r.push(`${t}缺少${n}`);
		return;
	}
	if ([
		e.minimum_value,
		e.default_value,
		e.maximum_value
	].some((e) => typeof e != "string" || !Te.test(e))) {
		r.push(`${t}的${n}必须是非负整数`);
		return;
	}
	(Ue(e.minimum_value, e.default_value) > 0 || Ue(e.default_value, e.maximum_value) > 0) && r.push(`${t}的${n}默认值必须处于上下限之间`);
}
function He(e, t, n, r) {
	if (!e) {
		r.push(`${t}缺少${n}`);
		return;
	}
	if ([
		e.minimum_value,
		e.default_value,
		e.maximum_value
	].some((e) => typeof e != "string" || !q.test(e))) {
		r.push(`${t}的${n}必须是非负十进制字符串`);
		return;
	}
	(Ue(e.minimum_value, e.default_value) > 0 || Ue(e.default_value, e.maximum_value) > 0) && r.push(`${t}的${n}默认值必须处于上下限之间`);
}
function Ue(e, t) {
	let [n, r = ""] = e.split("."), [i, a = ""] = t.split("."), o = n.replace(/^0+(?=\d)/, ""), s = i.replace(/^0+(?=\d)/, "");
	if (o.length !== s.length) return o.length > s.length ? 1 : -1;
	if (o !== s) return o > s ? 1 : -1;
	let c = Math.max(r.length, a.length), l = r.padEnd(c, "0"), u = a.padEnd(c, "0");
	return l === u ? 0 : l > u ? 1 : -1;
}
function We(e, t) {
	if (!q.test(e)) return e;
	let [n, r = ""] = e.split("."), i = n + r, a = n.length + t;
	return (a <= 0 ? "0." + "0".repeat(-a) + i : a >= i.length ? i + "0".repeat(a - i.length) : i.slice(0, a) + "." + i.slice(a)).replace(/^0+(?=\d)/, "");
}
var Ge = (e) => We(e, 2), Ke = (e) => We(e, -2);
function qe(e, t, n) {
	e[t].default_value = n;
	for (let t of ["minimum_stake", "maximum_stake"]) e[t].minimum_value = e.minimum_stake.default_value, e[t].maximum_value = e.maximum_stake.default_value;
}
var Je = (e) => e.symbol_enabled === void 0 && !e.rules.some((e) => e.enabled_by_default), Ye = (e) => e.symbol_enabled ?? e.rules.some((e) => e.enabled), Xe = (e) => e.rules.filter((t) => Je(e) || t.enabled_by_default).map((e) => e.duration_seconds);
//#endregion
//#region src/prediction-config/platform/views/grid/config/directory.ts
function Ze(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.symbol, {
		...t,
		configured: !0
	});
	for (let e of t) {
		let t = e.trim().toUpperCase();
		/^[A-Z0-9]{2,32}$/.test(t) && !n.has(t) && n.set(t, {
			symbol: t,
			enabled: !1,
			configured: !1
		});
	}
	return Qe([...n.values()], t);
}
function Qe(e, t, n = (e) => !!e.enabled) {
	let r = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.trim().toUpperCase();
		r.has(t) || r.set(t, r.size);
	}
	return [...e].sort((e, t) => Number(n(t)) - Number(n(e)) || (r.get(e.symbol) ?? 2 ** 53 - 1) - (r.get(t.symbol) ?? 2 ** 53 - 1) || e.symbol.localeCompare(t.symbol));
}
//#endregion
//#region src/prediction-config/platform/views/config/prediction/creation.ts
var $e = (e = !1) => ({
	default_value: "",
	minimum_value: "",
	maximum_value: "",
	agent_editable: e
});
function et(e, t, n) {
	return {
		is_new: !0,
		game_type: e,
		symbol: t,
		based_on_template_version: n,
		enabled: !1,
		rules: (e === "UP_DOWN" ? Ee : De).map((t) => ({
			duration_seconds: t,
			enabled_by_default: !0,
			minimum_stake: $e(!0),
			maximum_stake: $e(!0),
			settlement_display_seconds: "10",
			price_rule: {
				max_age_milliseconds: "5000",
				late_arrival_grace_milliseconds: "500",
				price_decimals: 3
			},
			...e === "UP_DOWN" ? {
				bet_open_seconds: {
					default_value: "30",
					minimum_value: "30",
					maximum_value: "30",
					agent_editable: !1
				},
				target_payout_rate: $e(),
				minimum_odds: {
					default_value: "1",
					minimum_value: "1",
					maximum_value: "1",
					agent_editable: !1
				},
				maximum_odds: $e(),
				stake_tiers: [{
					enabled_by_default: !0,
					display_order: 1,
					minimum_stake: $e(!0),
					maximum_stake: $e(!0),
					retired: !1
				}]
			} : { fixed_odds: $e(!0) }
		}))
	};
}
function tt(e, t, n) {
	let r = e?.configurations;
	if (!Array.isArray(r)) throw Error("配置列表格式异常，请重新加载");
	let i = "0", a, o = /* @__PURE__ */ new Set();
	for (let e of r) {
		if (!e || e.scope !== "CONFIG_SCOPE_PLATFORM" || typeof e.template_version != "string" || !/^[1-9]\d*$/.test(e.template_version) || BigInt(e.template_version) > 9223372036854775807n || !Array.isArray(e.rules) || !e.rules.length) throw Error("配置列表格式异常，请重新加载");
		if (i !== "0" && i !== e.template_version) throw Error("配置版本不一致，请重新加载");
		i = e.template_version;
		let r = e.rules[0];
		if (!r || !["GAME_TYPE_UP_DOWN", "GAME_TYPE_HIGH_LOW"].includes(r.game_type) || !/^[A-Z0-9]{2,32}$/.test(r.symbol) || e.rules.some((e) => !e || e.symbol !== r.symbol || e.game_type !== r.game_type)) throw Error("配置列表格式异常，请重新加载");
		let s = `${r.game_type}:${r.symbol}`;
		if (o.has(s)) throw Error("配置列表重复，请重新加载");
		o.add(s), r.game_type === `GAME_TYPE_${t}` && r.symbol === n && (a = e);
	}
	return {
		version: i,
		existing: a
	};
}
//#endregion
//#region src/prediction-config/platform/views/prediction/query.ts
var nt = (e, t) => e.includes("*") || e.includes(t), rt = {
	direction: ["UP", "DOWN"],
	order_source: ["PLAYER", "MARKET_MAKER"],
	business_status: [
		"PENDING",
		"ACTIVE",
		"RESULT_READY",
		"SETTLED",
		"CANCELED"
	],
	fund_status: [
		"PENDING",
		"DEBITED",
		"SETTLE_PENDING",
		"SETTLED",
		"REFUND_PENDING",
		"REFUNDED",
		"UNKNOWN",
		"REJECTED",
		"MANUAL_REQUIRED"
	],
	result: [
		"PENDING",
		"WIN",
		"LOSE",
		"DRAW",
		"CANCELED"
	],
	sort_field: [
		"CREATED_AT",
		"SETTLED_AT",
		"STAKE",
		"FINAL_RETURN"
	],
	sort_direction: ["ASC", "DESC"]
};
rt.result, rt.sort_direction;
//#endregion
//#region src/prediction-config/platform/views/grid/config/journal.ts
var it = /^[1-9]\d*$/;
function at(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function ot(e, t) {
	if (!e) throw Error(t);
}
function st(e, t) {
	ot(Object.keys(e).length === t.length && t.every((t) => Object.hasOwn(e, t)), "PENDING_CORRUPT");
}
function ct(e, t, n) {
	function r(e) {
		if (e && typeof e == "object") {
			Object.freeze(e);
			for (let t of Object.values(e)) r(t);
		}
		return e;
	}
	function i(e, t) {
		return !!e && JSON.stringify(e) === JSON.stringify(t);
	}
	function a(n) {
		let i = n.getItem(e);
		if (i === null) return null;
		ot(i.length <= 32768, "PENDING_CORRUPT");
		let a;
		try {
			a = JSON.parse(i);
		} catch {
			throw Error("PENDING_CORRUPT");
		}
		return ot(at(a), "PENDING_CORRUPT"), st(a, [
			"schema",
			"operator_id",
			"command"
		]), ot(a.schema === 1 && typeof a.operator_id == "string" && it.test(a.operator_id), "PENDING_CORRUPT"), t(a.command), r(a);
	}
	function o(n, r, o) {
		ot(it.test(r), "IDENTITY_UNCONFIRMED"), ot(a(n) === null, "PENDING_EXISTS"), t(o);
		let s = {
			schema: 1,
			operator_id: r,
			command: JSON.parse(JSON.stringify(o))
		};
		n.setItem(e, JSON.stringify(s));
		let c = a(n);
		return ot(i(c, s), "PERSISTENCE_UNAVAILABLE"), c;
	}
	function s(e, n) {
		return ot(it.test(e), "IDENTITY_UNCONFIRMED"), t(n), r({
			operator_id: e,
			command: structuredClone(n)
		});
	}
	function c(e, n, r, i) {
		return t(n.command), t(i), ot(n.operator_id === r && JSON.stringify(n.command) === JSON.stringify(i), "STALE_CONFIRMATION"), o(e, n.operator_id, n.command);
	}
	function l(e, t) {
		let n = a(e);
		return n ? n.operator_id === t ? {
			status: "bound",
			pending: n
		} : {
			status: "foreign",
			pending: n
		} : { status: "none" };
	}
	async function u(t, r, o, s) {
		ot(i(a(t), r), "PENDING_CHANGED");
		try {
			let c = await s(o === "recover" ? "save" : o, structuredClone(r.command));
			return n(c, r) ? (i(a(t), r) && t.removeItem(e), {
				status: "success",
				value: c
			}) : {
				status: "unknown",
				error: /* @__PURE__ */ Error("INVALID_RECEIPT")
			};
		} catch (n) {
			if ((at(n) ? n.operation_status : void 0) === "FAILED" && (o === "save" || o === "recover" && at(n) && n.error_code === "VERSION_CONFLICT")) {
				let o = i(a(t), r);
				return o && t.removeItem(e), {
					status: "rejected",
					error: n,
					journalCleared: o
				};
			}
			return {
				status: "unknown",
				error: n
			};
		}
	}
	return {
		readPending: a,
		persistPending: o,
		captureSaveReview: s,
		persistReviewedCommand: c,
		pendingForActor: l,
		attemptPending: u
	};
}
//#endregion
//#region src/prediction-config/grid-parameters.ts
var lt = [
	"parameters_available",
	"parameter_source",
	"stored_parameters",
	"global_parameters_source",
	"default_parameter_source",
	"default_global_parameters_source",
	"default_min_multiplier",
	"default_max_multiplier"
], ut = [
	"target_rtp",
	"min_multiplier",
	"max_multiplier",
	"min_order_amount",
	"max_order_amount"
], dt = (e) => !!e && typeof e == "object" && !Array.isArray(e), ft = (e) => {
	if (!e) throw Error("INVALID_GRID_CONFIGURATION");
}, pt = (e) => typeof e == "string" && /^[1-9][0-9]*$/.test(e) && (e.length < 19 || e.length === 19 && e <= "9223372036854775807");
function mt(e) {
	if (e === null) return null;
	ft(dt(e) && Object.keys(e).length === 3 && e.kind === "GLOBAL" && pt(e.version) && typeof e.effective_from_ms == "string" && /^[0-9]+$/.test(e.effective_from_ms));
	let t = e;
	return {
		kind: "GLOBAL",
		version: t.version,
		effective_from_ms: t.effective_from_ms
	};
}
function ht(e, t) {
	if (!lt.some((t) => t in e)) return;
	if (ft(lt.every((t) => t in e)), e.parameters_available === !1) throw Error("CONFIG_PARAMETERS_UNAVAILABLE");
	ft(e.parameters_available === !0 && [
		"GLOBAL",
		"SITE",
		"MERCHANT"
	].includes(String(e.parameter_source)) && ["GLOBAL", "SITE"].includes(String(e.default_parameter_source))), ft(dt(e.stored_parameters) && Object.keys(e.stored_parameters).length === 5 && ut.every((t) => t in e.stored_parameters));
	let n = e.stored_parameters, r = Object.fromEntries(ut.map((e) => [e, n[e] === null ? null : t(n[e])]));
	ft(Object.values(r).every((t) => e.parameter_source === "GLOBAL" ? t === null : t !== null));
	let i = mt(e.global_parameters_source), a = mt(e.default_global_parameters_source);
	return ft(e.parameter_source === "GLOBAL" == (i !== null) && e.default_parameter_source === "GLOBAL" == (a !== null)), ft(!i || !a || i.version === a.version), {
		parameters_available: !0,
		parameter_source: e.parameter_source,
		stored_parameters: r,
		global_parameters_source: i,
		default_parameter_source: e.default_parameter_source,
		default_global_parameters_source: a,
		default_min_multiplier: t(e.default_min_multiplier),
		default_max_multiplier: t(e.default_max_multiplier)
	};
}
function gt(e) {
	return e.global_parameters_source?.version ?? e.default_global_parameters_source?.version;
}
//#endregion
//#region src/prediction-config/platform/views/grid/config/model.ts
function _t(e, t = !0) {
	let n = structuredClone(e);
	return t && n.layout?.editable && n.layout.price_decimals == null && (n.layout.price_decimals = 3), n;
}
var vt = "grid.config.pending.v1", yt = /^(0|[1-9]\d*)(?:\.(\d+))?$/, bt = /^[1-9]\d*$/, xt = /^[A-Z0-9]{2,32}$/, St = [
	"site_id",
	"symbol",
	"based_on_layout_version",
	"based_on_site_version",
	"client_request_id",
	"reason",
	"changes"
], Ct = [
	"config_id",
	"requested_agent_id",
	"agent_id",
	"inherited",
	"default_config_id",
	"default_version",
	"default_resolution_epoch",
	"default_enabled",
	"effective_enabled",
	"default_target_rtp",
	"default_min_order_amount",
	"default_max_order_amount"
], wt = [
	"based_on_config_id",
	"based_on_default_version",
	"based_on_default_resolution_epoch"
], Tt = [
	"price_band_width",
	"column_duration_seconds",
	"price_decimals"
], Et = [
	"enabled",
	"target_rtp",
	"min_multiplier",
	"max_multiplier",
	"min_order_amount",
	"max_order_amount"
];
function Dt(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function J(e, t = "INVALID_GRID_CONFIGURATION") {
	if (!e) throw Error(t);
}
function Ot(e, t) {
	J(Object.keys(e).length === t.length && Object.keys(e).every((e) => t.includes(e)), "PENDING_CORRUPT");
}
function kt(e, t) {
	J(typeof e == "string" && e.length <= 128 && yt.test(e), "INVALID_DECIMAL");
	let [n, r = ""] = e.split("."), i = n.replace(/^0+(?=\d)/, ""), a = r.replace(/0+$/, "");
	return J(t === void 0 || a.length <= t, "INVALID_DECIMAL"), a ? i + "." + a : i;
}
function At(e) {
	let [t, n = ""] = kt(e).split(".");
	return {
		whole: t,
		fraction: n
	};
}
function jt(e, t) {
	let n = At(e), r = At(t);
	if (n.whole.length !== r.whole.length) return n.whole.length > r.whole.length ? 1 : -1;
	if (n.whole !== r.whole) return n.whole > r.whole ? 1 : -1;
	let i = Math.max(n.fraction.length, r.fraction.length), a = n.fraction.padEnd(i, "0"), o = r.fraction.padEnd(i, "0");
	return a === o ? 0 : a > o ? 1 : -1;
}
function Mt(e, t) {
	let { whole: n, fraction: r } = At(e), i = n + r, a = n.length + t, o;
	o = a <= 0 ? "0." + "0".repeat(-a) + i : a >= i.length ? i + "0".repeat(a - i.length) : i.slice(0, a) + "." + i.slice(a);
	let [s, c = ""] = o.split("."), l = s.replace(/^0+(?=\d)/, "") || "0", u = c.replace(/0+$/, "");
	return u ? l + "." + u : l;
}
function Nt(e) {
	let t = kt(e);
	return J(jt(t, "0") > 0 && jt(t, "1") <= 0, "INVALID_RTP"), Mt(t, 2);
}
function Pt(e) {
	let t = kt(e);
	return J(jt(t, "0") > 0 && jt(t, "100") < 0, "INVALID_RTP"), Mt(t, -2);
}
function Ft(e = globalThis.crypto) {
	J(e && typeof e.getRandomValues == "function", "SECURE_RANDOM_UNAVAILABLE");
	let t = e.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	J(t instanceof Uint8Array && t.length === 16, "SECURE_RANDOM_UNAVAILABLE"), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0")).join("");
	return `${n.slice(0, 8)}-${n.slice(8, 12)}-${n.slice(12, 16)}-${n.slice(16, 20)}-${n.slice(20)}`;
}
function It(e) {
	return J(typeof e == "string" && bt.test(e) && jt(e, "25") <= 0, "INVALID_LAYOUT_DURATION"), e;
}
function Lt(e) {
	let t = It(e);
	return J(jt(t, "10") <= 0, "INVALID_LAYOUT_DURATION"), t;
}
function Rt(e, t) {
	let n = kt(e, t);
	return J(jt(n, "0") > 0, "INVALID_LAYOUT_WIDTH"), n;
}
function zt(e) {
	if (typeof e != "string") return !1;
	let t = /^(?:0|[1-9]\d*)\.(\d+)$/.exec(e)?.[1];
	return t !== void 0 && t.length > 8;
}
function Bt(e) {
	return J(e === null || typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 18, "INVALID_LAYOUT_PRECISION"), e;
}
function Vt(e) {
	return J(typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 8, "INVALID_LAYOUT_PRECISION"), e;
}
function Ht(e, t) {
	t != null && J((kt(e).split(".")[1] ?? "").length <= t, "INVALID_LAYOUT_PRECISION");
}
function Ut(e, t) {
	J(5 + (Number(e) + 1) * Number(t) <= 120, "INVALID_LAYOUT_HORIZON");
}
function Wt(e) {
	return J(Dt(e), "INVALID_GRID_LAYOUT"), Ot(e, [
		"row_count",
		"column_count",
		"column_duration_seconds",
		"price_band_width",
		"effective_from_ms",
		"editable",
		"affected_site_ids",
		..."price_decimals" in e ? ["price_decimals"] : []
	]), J([
		e.row_count,
		e.column_count,
		e.column_duration_seconds
	].every((e) => typeof e == "string" && e.length <= 128 && bt.test(e)), "INVALID_GRID_LAYOUT"), J(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_LAYOUT"), J(typeof e.editable == "boolean", "INVALID_GRID_LAYOUT"), J(Array.isArray(e.affected_site_ids) && e.affected_site_ids.every((e) => typeof e == "string" && e.length > 0 && e.length <= 64 && e.trim() === e), "INVALID_GRID_LAYOUT"), J(new Set(e.affected_site_ids).size === e.affected_site_ids.length && (!e.editable || e.affected_site_ids.length > 0), "INVALID_GRID_LAYOUT"), {
		row_count: e.row_count,
		column_count: e.column_count,
		column_duration_seconds: e.column_duration_seconds,
		price_band_width: Rt(e.price_band_width),
		..."price_decimals" in e ? { price_decimals: Bt(e.price_decimals) } : {},
		effective_from_ms: e.effective_from_ms,
		editable: e.editable,
		affected_site_ids: [...e.affected_site_ids]
	};
}
function Gt(e, t, n = !1) {
	return !!(n && e.layout?.editable && t.layout && Tt.some((n) => e.layout[n] !== t.layout[n]));
}
function Kt(e) {
	J(Dt(e), "INVALID_GRID_CONFIGURATION"), Ot(e, [
		"site_id",
		"symbol",
		"layout_version",
		"site_version",
		"effective_from_ms",
		"enabled",
		"target_rtp",
		"min_multiplier",
		"max_multiplier",
		"min_order_amount",
		"max_order_amount",
		..."layout" in e ? ["layout"] : [],
		..."config_id" in e ? Ct : [],
		...lt.filter((t) => t in e)
	]), J(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "INVALID_GRID_CONFIGURATION"), J(typeof e.symbol == "string" && xt.test(e.symbol), "INVALID_GRID_CONFIGURATION"), J([e.layout_version, e.site_version].every((e) => typeof e == "string" && bt.test(e)), "INVALID_GRID_CONFIGURATION"), J(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_CONFIGURATION"), J(typeof e.enabled == "boolean", "INVALID_GRID_CONFIGURATION");
	let t = {
		site_id: e.site_id,
		symbol: e.symbol,
		layout_version: e.layout_version,
		site_version: e.site_version,
		effective_from_ms: e.effective_from_ms,
		enabled: e.enabled,
		target_rtp: kt(e.target_rtp),
		min_multiplier: kt(e.min_multiplier, 2),
		max_multiplier: kt(e.max_multiplier, 2),
		min_order_amount: kt(e.min_order_amount, 8),
		max_order_amount: kt(e.max_order_amount, 8)
	};
	if (J(jt(t.target_rtp, "0") > 0 && jt(t.target_rtp, "1") <= 0, "INVALID_GRID_CONFIGURATION"), J(jt(t.min_multiplier, "1") >= 0 && jt(t.max_multiplier, t.min_multiplier) >= 0, "INVALID_GRID_CONFIGURATION"), J(jt(t.min_order_amount, "0") > 0 && jt(t.max_order_amount, t.min_order_amount) >= 0, "INVALID_GRID_CONFIGURATION"), "config_id" in e) {
		for (let n of [
			"config_id",
			"default_config_id",
			"default_version",
			"default_resolution_epoch"
		]) J(typeof e[n] == "string" && bt.test(e[n]) && jt(e[n], "9223372036854775807") <= 0), t[n] = e[n];
		J(typeof e.requested_agent_id == "string" && /^(0|[1-9][0-9]*)$/.test(e.requested_agent_id) && jt(e.requested_agent_id, "9223372036854775807") <= 0), J(e.agent_id === null || e.agent_id === e.requested_agent_id && e.agent_id !== "0"), t.requested_agent_id = e.requested_agent_id, t.agent_id = e.agent_id;
		for (let n of [
			"inherited",
			"default_enabled",
			"effective_enabled"
		]) J(typeof e[n] == "boolean"), t[n] = e[n];
		for (let n of [
			"default_target_rtp",
			"default_min_order_amount",
			"default_max_order_amount"
		]) t[n] = kt(e[n]);
	}
	return Object.assign(t, ht(e, kt)), "layout" in e && (t.layout = Wt(e.layout)), t;
}
function qt(e, t, n) {
	let r = Kt(e);
	return J(r.site_id === t && r.symbol === n, "INVALID_GRID_TARGET"), r;
}
function Jt(e, t, n, r, i, a = !1) {
	if (Dt(e) && e.site_version === "0") return Yt(e, t, n, r, i, a);
	let o = Dt(e) && Dt(e.layout) ? e.layout.price_band_width : void 0, s = Dt(t) && Dt(t.layout) ? t.layout.price_band_width : void 0;
	J(o === s || !zt(s), "INVALID_LAYOUT_PRECISION");
	let c = Kt(e), l = Kt(t);
	J(c.site_id === l.site_id && c.symbol === l.symbol, "INVALID_GRID_TARGET"), J(typeof n == "string" && n.length <= 500 && n.trim().length > 0 && !n.includes("\0"), "INVALID_REASON"), J(typeof r == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(r), "INVALID_REQUEST_ID"), J(c.config_id && c.default_version && c.default_resolution_epoch, "CONFIG_IDENTITY_REQUIRED"), J(Ct.every((e) => c[e] === l[e]), "INVALID_GRID_TARGET"), J(JSON.stringify(ht(c, kt)) === JSON.stringify(ht(l, kt)), "INVALID_GRID_TARGET");
	let u = {};
	for (let e of Et) c[e] !== l[e] && (u[e] = l[e]);
	for (let e of Tt) c.layout?.[e] !== l.layout?.[e] && (J(a && c.layout?.editable && l.layout, "FIELD_FORBIDDEN"), u[e] = l.layout[e]);
	if (c.requested_agent_id !== "0" && !(u.enabled === !1 && Object.keys(u).length === 1) && (J(!l.enabled || c.default_enabled, "PLATFORM_LIMIT"), J(jt(l.target_rtp, c.default_target_rtp) <= 0 && jt(l.min_order_amount, c.default_min_order_amount) >= 0 && jt(l.max_order_amount, c.default_max_order_amount) <= 0, "PLATFORM_LIMIT")), Tt.some((e) => e in u)) {
		let e = c.layout;
		"price_decimals" in u && Vt(u.price_decimals), Ht(l.layout.price_band_width, l.layout.price_decimals), Rt(u.price_band_width ?? e.price_band_width, 18), "column_duration_seconds" in u && Lt(u.column_duration_seconds);
		let t = It(u.column_duration_seconds ?? e.column_duration_seconds);
		J(jt(e.row_count, "10000") <= 0 && jt(e.column_count, "10000") <= 0 && Number(e.row_count) * Number(e.column_count) <= 1e4, "INVALID_GRID_LAYOUT"), Ut(e.column_count, t);
	}
	if (!i && ("min_multiplier" in u || "max_multiplier" in u)) throw Error("FIELD_FORBIDDEN");
	return J(Object.keys(u).length > 0, "EMPTY_CHANGES"), {
		site_id: c.site_id,
		symbol: c.symbol,
		based_on_layout_version: c.layout_version,
		based_on_site_version: c.site_version,
		based_on_config_id: c.config_id,
		...gt(c) ? { based_on_global_version: gt(c) } : {},
		based_on_default_version: c.default_version,
		based_on_default_resolution_epoch: c.default_resolution_epoch,
		client_request_id: r,
		reason: n,
		changes: u
	};
}
function Yt(e, t, n, r, i, a) {
	J(i && a && Dt(t) && e.site_id === t.site_id && e.symbol === t.symbol, "INVALID_GRID_TARGET"), J(e.layout_version === t.layout_version && t.site_version === "0", "INVALID_GRID_TARGET"), e.layout_version === "0" && Dt(t.layout) && J(!zt(t.layout.price_band_width), "INVALID_LAYOUT_PRECISION");
	let o = Kt({
		...t,
		enabled: !1,
		site_version: "1",
		layout_version: e.layout_version === "0" ? "1" : e.layout_version
	}), s = { enabled: !1 };
	for (let e of Et) e !== "enabled" && (s[e] = o[e]);
	let c = [
		"row_count",
		"column_count",
		...Tt
	];
	if (e.layout_version === "0") {
		J(o.layout, "INVALID_GRID_LAYOUT"), Lt(o.layout.column_duration_seconds);
		for (let e of c) e === "price_decimals" && o.layout.price_decimals == null || (s[e] = o.layout[e]);
		Ht(o.layout.price_band_width, o.layout.price_decimals);
	} else {
		let t = e.layout;
		J(Dt(t) && o.layout && c.every((e) => t[e] === o.layout[e]), "FIELD_FORBIDDEN");
	}
	let l = {
		site_id: o.site_id,
		symbol: o.symbol,
		based_on_layout_version: e.layout_version,
		based_on_site_version: "0",
		client_request_id: r,
		reason: n,
		changes: s
	};
	return Xt(l), l;
}
function Xt(e) {
	if (J(Dt(e), "PENDING_CORRUPT"), Ot(e, [
		...St,
		..."based_on_config_id" in e ? wt : [],
		..."based_on_global_version" in e ? ["based_on_global_version"] : []
	]), "based_on_global_version" in e && J(typeof e.based_on_global_version == "string" && /^(0|[1-9][0-9]*)$/.test(e.based_on_global_version) && jt(e.based_on_global_version, "9223372036854775807") <= 0, "PENDING_CORRUPT"), "based_on_config_id" in e) for (let t of wt) J(typeof e[t] == "string" && bt.test(e[t]) && jt(e[t], "9223372036854775807") <= 0, "PENDING_CORRUPT");
	J(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "PENDING_CORRUPT"), J(typeof e.symbol == "string" && xt.test(e.symbol), "PENDING_CORRUPT");
	let t = e.based_on_site_version === "0";
	J(typeof e.based_on_layout_version == "string" && (bt.test(e.based_on_layout_version) || t && e.based_on_layout_version === "0"), "PENDING_CORRUPT"), J(typeof e.based_on_site_version == "string" && (t || bt.test(e.based_on_site_version)), "PENDING_CORRUPT"), J(typeof e.client_request_id == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(e.client_request_id), "PENDING_CORRUPT"), J(typeof e.reason == "string" && e.reason.length <= 500 && e.reason.trim().length > 0 && !e.reason.includes("\0"), "PENDING_CORRUPT");
	let n = [
		...Et,
		...Tt,
		...t ? ["row_count", "column_count"] : []
	];
	J(Dt(e.changes) && Object.keys(e.changes).length > 0 && Object.keys(e.changes).every((e) => n.includes(e)), "PENDING_CORRUPT");
	for (let [t, n] of Object.entries(e.changes)) t === "enabled" ? J(typeof n == "boolean", "PENDING_CORRUPT") : t === "row_count" || t === "column_count" ? J(typeof n == "string" && /^[1-9]\d{0,4}$/.test(n), "INVALID_GRID_LAYOUT") : t === "price_decimals" ? Vt(n) : t === "price_band_width" ? Rt(n, 18) : t === "column_duration_seconds" ? It(n) : kt(n, t.includes("order_amount") ? 8 : t.includes("multiplier") ? 2 : void 0);
	if (t) {
		J(!("based_on_config_id" in e) && e.changes.enabled === !1, "PENDING_CORRUPT");
		let t = e.based_on_layout_version === "0";
		if (Ot(e.changes, [...Et, ...t ? [
			"row_count",
			"column_count",
			...Tt.filter((t) => t !== "price_decimals" || Object.prototype.hasOwnProperty.call(e.changes, t))
		] : []]), Kt({
			...Object.fromEntries(Et.map((t) => [t, e.changes[t]])),
			site_id: e.site_id,
			symbol: e.symbol,
			site_version: "1",
			layout_version: "1",
			effective_from_ms: "0"
		}), J(jt(e.based_on_layout_version, "9223372036854775807") <= 0, "PENDING_CORRUPT"), t) {
			let t = e.changes;
			J(Number(t.row_count) * Number(t.column_count) <= 1e4, "INVALID_GRID_LAYOUT"), Rt(t.price_band_width, 8), Ut(t.column_count, t.column_duration_seconds);
		}
	}
}
function Zt(e, t) {
	return Dt(e) ? e.operation_status === "SUCCEEDED" && typeof e.operation_id == "string" && bt.test(e.operation_id) && e.site_id === t.command.site_id && e.symbol === t.command.symbol && typeof e.layout_version == "string" && bt.test(e.layout_version) && typeof e.site_version == "string" && bt.test(e.site_version) && typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms) && typeof e.changed == "boolean" && [
		"PENDING",
		"DONE",
		"NOT_REQUIRED"
	].includes(String(e.cache_state)) : !1;
}
function Qt(e) {
	return Dt(e) && e.error_code === "RECEIPT_UNCONFIRMED" && e.operation_status === "UNKNOWN";
}
var { readPending: $t, persistPending: en, captureSaveReview: tn, persistReviewedCommand: nn, pendingForActor: rn, attemptPending: an } = ct(vt, Xt, Zt), on = class {
	generation = 0;
	controller;
	next(e) {
		this.controller?.abort();
		let t = ++this.generation, n = new AbortController();
		return this.controller = n, {
			signal: n.signal,
			current: (r) => t === this.generation && !n.signal.aborted && r === e
		};
	}
	close() {
		this.generation++, this.controller?.abort();
	}
}, sn = { "config.save": [
	"game_type",
	"symbol",
	"based_on_template_version",
	"platform_template"
] };
function cn(e, t) {
	let n = t;
	return e === "routing.prepare" || e === "routing.cancel" ? n?.change?.receipt : e === "routing.commit" ? n?.binding?.receipt : n?.receipt;
}
var ln = class {
	busy = !1;
	key;
	storage;
	action;
	constructor(e, t, n, r) {
		if (!t || !sn[n] || !r) throw Error("无法确认当前操作上下文");
		this.storage = e, this.action = n, this.key = `prediction:pending:${encodeURIComponent(t)}:${n}:${encodeURIComponent(r)}`;
	}
	read() {
		let e = this.storage.getItem(this.key);
		if (!e) return null;
		let t = JSON.parse(e);
		if (t.action !== this.action || !t.body || typeof t.body != "object" || !["submitting", "unverified"].includes(t.state) || t.attempted !== void 0 && typeof t.attempted != "boolean" || t.state === "submitting" && t.attempted === !1 || t.attemptGeneration !== void 0 && (!Number.isSafeInteger(t.attemptGeneration) || t.attemptGeneration < 0 || t.attempted === !1 && t.attemptGeneration !== 0 || t.attempted === !0 && t.attemptGeneration === 0 || t.state === "submitting" && t.attemptGeneration === 0)) throw Error("上次操作记录无法读取，请先核验处理结果");
		return this.validate(t.body), t;
	}
	validate(e) {
		let t = [
			...sn[this.action],
			"reason",
			"client_request_id"
		];
		if (Object.keys(e).some((e) => !t.includes(e)) || typeof e.reason != "string" || !e.reason.trim() || e.reason.length > 500 || typeof e.client_request_id != "string" || !e.client_request_id || e.client_request_id.length > 128) throw Error("操作记录字段无效");
		if (sn[this.action].some((t) => !Object.hasOwn(e, t))) throw Error("操作记录缺少必要字段");
		let n = (t) => typeof e[t] == "string" && !!e[t].trim() && e[t].length <= 128;
		if (this.action === "config.save") {
			let t = e.platform_template;
			if (!["UP_DOWN", "HIGH_LOW"].includes(String(e.game_type)) || !n("symbol") || !t || typeof t.enabled != "boolean" || !Array.isArray(t.rules)) throw Error("配置操作记录无效");
			let r = {
				game_type: e.game_type,
				symbol: e.symbol,
				based_on_template_version: e.based_on_template_version,
				enabled: t.enabled,
				rules: structuredClone(t.rules)
			};
			if (r.game_type === "UP_DOWN") for (let e of r.rules) {
				let t = e.stake_tiers?.find((e) => !e.retired);
				t && (e.minimum_stake ??= t.minimum_stake, e.maximum_stake ??= t.maximum_stake);
			}
			if (Le(r, t.enabled === !1 && r.rules.every((e) => e.market_id === void 0 && (e.stake_tiers ?? []).every((e) => e.stake_tier_id === void 0))).length) throw Error("配置操作记录无效");
		}
	}
	begin(e, t = Ft()) {
		if (this.read()) throw Error("上次操作结果尚未确定，请先核验原操作");
		let n = JSON.parse(JSON.stringify({
			...e,
			client_request_id: t
		}));
		this.validate(n), this.storage.setItem(this.key, JSON.stringify({
			action: this.action,
			body: n,
			state: "unverified",
			attempted: !1,
			attemptGeneration: 0
		}));
	}
	ownsStoredIntent(e) {
		let t = this.read();
		return t !== null && JSON.stringify(t.body) === JSON.stringify(e.body);
	}
	async attempt(e) {
		if (this.busy) throw Error("操作正在提交");
		let t = this.read();
		if (!t) throw Error("没有待核验操作");
		let n = t.attempted !== !1, r = (t.attemptGeneration ?? 0) + 1;
		if (!Number.isSafeInteger(r)) throw Error("操作尝试记录无法继续核验");
		this.busy = !0;
		try {
			t.state = "submitting", t.attempted = !0, t.attemptGeneration = r, this.storage.setItem(this.key, JSON.stringify(t));
			let n = await e(structuredClone(t.body)), i = cn(this.action, n);
			if (typeof i?.operation_id != "string" || !i.operation_id || i.client_request_id !== t.body.client_request_id || i.result !== "OPERATION_RESULT_SUCCEEDED") throw Error("未收到可核验的成功回执");
			return this.ownsStoredIntent(t) && this.storage.removeItem(this.key), n;
		} catch (e) {
			let r = e, i = this.read();
			if (!i || JSON.stringify(i.body) !== JSON.stringify(t.body)) throw e;
			let a = i.attemptGeneration !== t.attemptGeneration || r.control?.submission_outcome === "UNVERIFIED" || r.detail?.control?.submission_outcome === "UNVERIFIED";
			throw this.action === "config.save" && r.error_code === "ERROR_CODE_MARK_PRICE_UNAVAILABLE" && !a || !(n || a) && [
				"ERROR_CODE_INVALID_ARGUMENT",
				"ERROR_CODE_NOT_FOUND",
				"ERROR_CODE_CONFLICT",
				"ERROR_CODE_PERMISSION_DENIED",
				"ERROR_CODE_UNAUTHENTICATED"
			].includes(r.error_code || "") ? this.storage.removeItem(this.key) : (i.state = "unverified", this.storage.setItem(this.key, JSON.stringify(i))), e;
		} finally {
			this.busy = !1;
		}
	}
}, un = ["data-action"], dn = {
	key: 2,
	class: "pending-summary"
}, fn = { key: 0 }, pn = {
	key: 5,
	role: "status"
}, mn = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "WritePanel",
	props: {
		action: {},
		target: {},
		permission: {},
		hideButton: { type: Boolean },
		hideSuccess: { type: Boolean },
		hidePendingDetails: { type: Boolean },
		hideError: { type: Boolean },
		label: { default: "保存" },
		automaticReason: {},
		disabled: {
			type: Boolean,
			default: !1
		},
		blocked: {
			type: Boolean,
			default: !1
		},
		newAllowed: {
			type: Boolean,
			default: !0
		},
		payload: {},
		send: {}
	},
	emits: [
		"success",
		"pending",
		"busy"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, c = n, l = he(), f = i(() => nt(l.perms, r.permission)), p = b(""), m = b(""), h = b(""), g = b(!1), ee = b(null), _ = b(""), ne = i(() => !!((ee.value || r.newAllowed) && (m.value && !r.hideError || ee.value && !r.hidePendingDetails || !ee.value && !r.automaticReason || f.value && !r.hideButton || h.value && !r.hideSuccess))), y, re = 0;
		oe(g, (e) => c("busy", e), { flush: "sync" });
		function x() {
			try {
				ee.value = y?.read() ?? null, c("pending", !!ee.value);
			} catch (e) {
				_.value = Ce(e), m.value = _.value;
			}
		}
		oe(() => [
			r.action,
			r.target,
			String(l.userInfo.id || "")
		], () => {
			if (re++, g.value = !1, p.value = "", m.value = "", h.value = "", _.value = "", ee.value = null, c("pending", !1), y = void 0, r.target) try {
				y = new ln(sessionStorage, String(l.userInfo.id || ""), r.action, r.target), x();
			} catch (e) {
				_.value = Ce(e), m.value = _.value;
			}
		}, {
			immediate: !0,
			flush: "sync"
		});
		async function S() {
			if (g.value || r.blocked || !f.value || !y || _.value) return;
			let e = y, t = re, n = String(l.userInfo.id || ""), i = r.action, a = r.target, o = r.send, s = () => t === re && y === e && n === String(l.userInfo.id || "") && i === r.action && a === r.target;
			m.value = "", h.value = "";
			try {
				if (!ee.value) {
					if (r.disabled || !r.newAllowed) return;
					let t = r.automaticReason?.trim() || p.value.trim();
					if (!t) throw Error("请填写操作原因");
					e.begin({
						...r.payload(),
						reason: t
					}), x();
				}
				g.value = !0;
				let t = await e.attempt(o);
				if (!s()) return;
				h.value = "操作已确认成功", p.value = "", c("success", t);
			} catch (e) {
				s() && (m.value = Ce(e));
			} finally {
				s() && (g.value = !1, x());
			}
		}
		te(() => {
			re++, c("busy", !1);
		});
		function C() {
			g.value || ee.value || (h.value = "", _.value || (m.value = ""));
		}
		return t({
			submit: S,
			success: h,
			error: m,
			clearFeedback: C
		}), (t, n) => ne.value ? (v(), s("section", {
			key: 0,
			class: "prediction-write",
			"data-action": e.action
		}, [
			m.value && !e.hideError ? (v(), a(T(k), {
				key: 0,
				title: m.value,
				type: "error",
				closable: !1,
				"show-icon": ""
			}, null, 8, ["title"])) : o("", !0),
			ee.value && !e.hidePendingDetails ? (v(), a(T(k), {
				key: 1,
				title: "上次操作结果尚未确定。核验将使用原操作内容，不会重复创建新的操作。",
				type: "warning",
				closable: !1
			})) : o("", !0),
			ee.value && !e.hidePendingDetails ? (v(), s("div", dn, [u(" 操作号：" + w(ee.value.body.client_request_id), 1), e.automaticReason ? o("", !0) : (v(), s("span", fn, " · 原因：" + w(ee.value.body.reason), 1))])) : !ee.value && !e.automaticReason ? (v(), a(T(I), {
				key: 3,
				label: "操作原因",
				required: ""
			}, {
				default: E(() => [d(T(R), {
					modelValue: p.value,
					"onUpdate:modelValue": n[0] ||= (e) => p.value = e,
					type: "textarea",
					rows: 2,
					maxlength: "500",
					"show-word-limit": "",
					placeholder: "请说明本次调整原因",
					disabled: g.value || e.disabled
				}, null, 8, ["modelValue", "disabled"])]),
				_: 1
			})) : o("", !0),
			f.value && !e.hideButton ? (v(), a(T(A), {
				key: 4,
				type: "primary",
				loading: g.value,
				disabled: g.value || e.blocked || !ee.value && e.disabled || !!_.value,
				onClick: S
			}, {
				default: E(() => [u(w(ee.value ? "核验原操作" : e.label), 1)]),
				_: 1
			}, 8, ["loading", "disabled"])) : o("", !0),
			h.value && !e.hideSuccess ? (v(), s("p", pn, w(h.value), 1)) : o("", !0)
		], 8, un)) : o("", !0);
	}
}), [["__scopeId", "data-v-e2bd32a3"]]), hn = ["inert", "aria-hidden"], gn = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "PredictionLoadingRegion",
	props: {
		as: { default: "div" },
		hideContent: {
			type: Boolean,
			default: !1
		},
		loading: { type: Boolean },
		minHeight: { default: "280px" },
		text: { default: "正在加载配置…" }
	},
	setup(e) {
		let n = e, r = b(!1), i;
		function o() {
			i !== void 0 && clearTimeout(i), i = void 0;
		}
		return oe(() => n.loading, (e) => {
			o(), r.value = !1, e && (i = setTimeout(() => {
				i = void 0, r.value = n.loading;
			}, 150));
		}, {
			immediate: !0,
			flush: "sync"
		}), te(o), (n, i) => (v(), a(S(e.as), {
			class: ee(["prediction-loading-region", { "is-loading": e.loading }]),
			style: _({ "--prediction-loading-min-height": e.minHeight }),
			"aria-busy": e.loading
		}, {
			default: E(() => [c("div", {
				class: ee(["prediction-loading-region__content", { "is-hidden": e.hideContent }]),
				inert: e.loading || void 0,
				"aria-hidden": e.hideContent || void 0
			}, [x(n.$slots, "default", {}, void 0, !0)], 10, hn), d(T(t), {
				visible: r.value,
				size: "md",
				text: e.text
			}, null, 8, ["visible", "text"])]),
			_: 3
		}, 8, [
			"class",
			"style",
			"aria-busy"
		]));
	}
}), [["__scopeId", "data-v-bd8381e2"]]), _n = { class: "prediction-help-copy" }, vn = ["aria-label", "aria-expanded"], yn = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "ParameterHelp",
	props: {
		label: {},
		content: {}
	},
	setup(e) {
		let t = e, n = b(!1), r = {
			下注开放时长: "场次开放后保持可下注的时间；倒计时结束立即封盘，不再接受新订单。本版固定为 30 秒。",
			目标返奖率: "例如 90% 表示平台按 90% 的理论返奖水平计算赔率。",
			最低赔率: "当前最低赔率用于接单校验，低于下限时无法受理；最终倍率以封盘为准。",
			最高赔率: "动态赔率不会高于此值。",
			固定赔率: "上涨和下跌使用相同赔率。用户下单时锁定当前周期的赔率，后续配置变更不影响历史订单。",
			单笔最小额: "用户创建一笔预测订单时允许输入的最低下注金额。",
			单笔最大额: "用户创建一笔预测订单时允许输入的最高下注金额。",
			最小下注金额: "用户创建一笔预测订单时允许输入的最低下注金额。",
			最大下注金额: "用户创建一笔预测订单时允许输入的最高下注金额。",
			周期: "用户选择的预测时长。不同周期独立配置；变更只影响新订单，历史订单保留原周期快照。",
			房间启用: "保存后控制当前房间是否接受本站新订单，已受理订单仍按原规则结算。"
		}, s = i(() => t.content ?? r[t.label] ?? "");
		return (t, r) => s.value ? (v(), a(T(B), {
			key: 0,
			visible: n.value,
			"onUpdate:visible": r[2] ||= (e) => n.value = e,
			trigger: "click",
			placement: "top",
			width: 300,
			title: e.label
		}, {
			reference: E(() => [c("button", {
				type: "button",
				class: "prediction-help-button",
				"aria-label": `${e.label}说明`,
				"aria-expanded": n.value,
				onClick: r[0] ||= O(() => {}, ["stop"]),
				onKeydown: r[1] ||= D(O((e) => n.value = !1, ["prevent"]), ["esc"])
			}, [d(T(L), null, {
				default: E(() => [d(T(U))]),
				_: 1
			})], 40, vn)]),
			default: E(() => [c("p", _n, w(s.value), 1)]),
			_: 1
		}, 8, ["visible", "title"])) : o("", !0);
	}
}), [["__scopeId", "data-v-b226ed88"]]), bn = /^(0|[1-9][0-9]{0,35})(?:\.[0-9]{1,18})?$/;
function xn(e, t, n, r = "0", i) {
	let a = [
		e,
		t,
		r,
		...i === void 0 ? [] : [i]
	];
	if (!a.every((e) => bn.test(e))) return null;
	let o = Math.max(...a.map((e) => e.split(".")[1]?.length ?? 0)), s = (e) => {
		let [t, n = ""] = e.split(".");
		return BigInt(t + n.padEnd(o, "0"));
	}, c = s(t), l = s(r), u = i === void 0 ? void 0 : s(i);
	if (c <= 0n || u !== void 0 && l > u) return null;
	let d = s(e) + BigInt(n) * c;
	d < l && (d = l), u !== void 0 && d > u && (d = u);
	let f = d.toString().padStart(o + 1, "0");
	if (!o) return f;
	let p = f.slice(-o).replace(/0+$/, "");
	return f.slice(0, -o) + (p ? "." + p : "");
}
function Sn(e, t) {
	if (!/^(0|[1-9][0-9]*)(?:\.[0-9]*)?$/.test(e)) return e;
	let [n, r = ""] = e.split("."), i = n + r, a = n.length + t, [o, s = ""] = (a <= 0 ? "0." + "0".repeat(-a) + i : a >= i.length ? i + "0".repeat(a - i.length) : i.slice(0, a) + "." + i.slice(a)).split("."), c = s.replace(/0+$/, "");
	return (o.replace(/^0+(?=\d)/, "") || "0") + (c ? "." + c : "");
}
//#endregion
//#region src/prediction-config/platform/views/prediction/components/DecimalInput.vue?vue&type=script&setup=true&lang.ts
var Cn = { class: "decimal-step-controls" }, wn = ["disabled"], Tn = ["disabled"], En = /*#__PURE__*/ n(/* @__PURE__ */ f({
	inheritAttrs: !1,
	__name: "DecimalInput",
	props: {
		modelValue: {},
		step: { default: "1" },
		min: { default: "0" },
		max: {},
		unit: {},
		disabled: {
			type: Boolean,
			default: void 0
		},
		percentage: {
			type: Boolean,
			default: !1
		},
		inputComponent: {}
	},
	emits: ["update:modelValue", "input"],
	setup(e, { emit: t }) {
		let n = e, r = R, o = t, s = H(), d = b(n.percentage ? Sn(n.modelValue, 2) : n.modelValue);
		oe(() => [n.modelValue, n.percentage], () => {
			n.percentage && Sn(d.value, -2) === n.modelValue || (d.value = n.percentage ? Sn(n.modelValue, 2) : n.modelValue);
		});
		let f = (e) => xn(d.value, n.step, e, n.min, n.max), p = i(() => f(1)), m = i(() => f(-1));
		function g(e) {
			if (s.value) return;
			d.value = e;
			let t = n.percentage ? Sn(e, -2) : e;
			o("update:modelValue", t), o("input", t);
		}
		function ee(e) {
			if (s.value) return;
			let t = f(e);
			t !== null && t !== d.value && g(t);
		}
		return (t, n) => (v(), a(S(e.inputComponent || T(r)), h({ class: "prediction-decimal-input" }, t.$attrs, {
			modelValue: d.value,
			disabled: T(s),
			inputmode: t.$attrs.inputmode || "decimal",
			"onUpdate:modelValue": g,
			onKeydown: [n[4] ||= D(O((e) => ee(1), ["prevent"]), ["up"]), n[5] ||= D(O((e) => ee(-1), ["prevent"]), ["down"])]
		}), l({
			suffix: E(() => [c("span", Cn, [c("button", {
				type: "button",
				tabindex: "-1",
				"aria-label": "增加数值",
				disabled: T(s) || p.value === null || p.value === d.value,
				onMousedown: n[0] ||= O(() => {}, ["prevent"]),
				onClick: n[1] ||= (e) => ee(1)
			}, [...n[6] ||= [c("svg", {
				viewBox: "0 0 12 12",
				"aria-hidden": "true"
			}, [c("path", { d: "m3 7 3-3 3 3" })], -1)]], 40, wn), c("button", {
				type: "button",
				tabindex: "-1",
				"aria-label": "减少数值",
				disabled: T(s) || m.value === null || m.value === d.value,
				onMousedown: n[2] ||= O(() => {}, ["prevent"]),
				onClick: n[3] ||= (e) => ee(-1)
			}, [...n[7] ||= [c("svg", {
				viewBox: "0 0 12 12",
				"aria-hidden": "true"
			}, [c("path", { d: "m3 5 3 3 3-3" })], -1)]], 40, Tn)])]),
			_: 2
		}, [e.unit || t.$slots.append ? {
			name: "append",
			fn: E(() => [x(t.$slots, "append", {}, () => [u(w(e.unit), 1)], !0)]),
			key: "0"
		} : void 0]), 1040, [
			"modelValue",
			"disabled",
			"inputmode"
		]));
	}
}), [["__scopeId", "data-v-ecdf8293"]]), Dn = ["aria-label"], On = { class: "prediction-constraint__title" }, kn = {
	key: 0,
	class: "constraint-description"
}, An = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "constraint-editor",
	props: /*@__PURE__*/ m({
		title: {},
		description: {},
		disabled: {
			type: Boolean,
			default: !1
		},
		agentLocked: {
			type: Boolean,
			default: !1
		},
		compact: {
			type: Boolean,
			default: !1
		},
		field: { default: "default_value" },
		percentage: {
			type: Boolean,
			default: !1
		},
		unit: { default: "" }
	}, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(t) {
		let n = t, r = ae(t, "modelValue"), a = i({
			get: () => n.percentage ? Ge(r.value[n.field]) : r.value[n.field],
			set: (e) => {
				let t = r.value[n.field], i = n.percentage ? Ke(e) : e;
				n.field === "default_value" && r.value.maximum_value === t && (n.agentLocked && r.value.minimum_value === t && (r.value.minimum_value = i), r.value.maximum_value = i), r.value[n.field] = i;
			}
		});
		return (n, r) => (v(), s("div", {
			class: ee(["prediction-constraint", { "is-compact": t.compact }]),
			role: "group",
			"aria-label": t.title
		}, [
			c("div", On, [u(w(t.title), 1), d(yn, { label: t.title }, null, 8, ["label"])]),
			d(En, {
				"input-component": T(e),
				step: t.percentage ? "1" : "0.01",
				modelValue: a.value,
				"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
				"aria-label": t.title,
				disabled: t.disabled
			}, l({ _: 2 }, [t.percentage || t.unit ? {
				name: "append",
				fn: E(() => [u(w(t.percentage ? "%" : t.unit), 1)]),
				key: "0"
			} : void 0]), 1032, [
				"input-component",
				"step",
				"modelValue",
				"aria-label",
				"disabled"
			]),
			t.description ? (v(), s("p", kn, w(t.description), 1)) : o("", !0)
		], 10, Dn));
	}
}), [["__scopeId", "data-v-a22ded5a"]]), jn = { class: "fixed-room-controls" }, Mn = {
	class: "room-tabs",
	role: "group",
	"aria-label": "选择房间或周期"
}, Nn = [
	"data-room-choice",
	"aria-pressed",
	"onClick"
], Pn = [
	"data-room-remove",
	"aria-label",
	"disabled",
	"onClick"
], Fn = {
	key: 0,
	class: "room-empty"
}, In = { class: "dialog-context" }, Ln = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "FixedRoomControls",
	props: {
		rooms: {},
		selected: {},
		disabled: { type: Boolean },
		context: {},
		description: {}
	},
	emits: ["select", "change"],
	setup(e, { emit: t }) {
		let n = e, l = t, f = i(() => n.rooms.filter((e) => e.present)), p = i(() => n.rooms.filter((e) => !e.present && e.allowed)), m = b(""), h = b(), g = b(""), _ = b("");
		function te() {
			m.value = "", h.value = void 0, g.value = "";
		}
		function ne(e) {
			n.disabled || !e.present || (_.value = n.context, h.value = e, m.value = "remove");
		}
		function y() {
			n.disabled || !p.value.length || (_.value = n.context, g.value = p.value[0].key, m.value = "add");
		}
		function x() {
			return !n.disabled && _.value === n.context;
		}
		function S() {
			let e = h.value?.key;
			m.value === "remove" && x() && n.rooms.some((t) => t.key === e && t.present) && l("change", e, !1), te();
		}
		function C() {
			m.value === "add" && x() && p.value.some((e) => e.key === g.value) && l("change", g.value, !0), te();
		}
		return oe(() => n.context, te, { flush: "sync" }), (t, n) => (v(), s("div", jn, [
			c("div", Mn, [(v(!0), s(r, null, re(f.value, (t) => (v(), s("span", {
				key: t.key,
				class: ee(["room-tag", { active: e.selected === t.key }])
			}, [c("button", {
				type: "button",
				"data-room-choice": t.key,
				"aria-pressed": e.selected === t.key,
				onClick: (e) => l("select", t.key)
			}, w(t.label), 9, Nn), c("button", {
				type: "button",
				class: "room-remove",
				"data-room-remove": t.key,
				"aria-label": `删除${t.label}房间`,
				disabled: e.disabled,
				onClick: (e) => ne(t)
			}, "×", 8, Pn)], 2))), 128)), d(T(A), {
				class: "room-add",
				"data-room-add": !0,
				disabled: e.disabled || !p.value.length,
				onClick: y
			}, {
				default: E(() => [...n[1] ||= [u("＋ 新增周期", -1)]]),
				_: 1
			}, 8, ["disabled"])]),
			f.value.length ? o("", !0) : (v(), s("p", Fn, "暂无房间，可从固定周期中新增。保存后生效。")),
			m.value ? (v(), a(T(N), {
				key: 1,
				"model-value": !0,
				title: m.value === "remove" ? "确认删除周期？" : "新增周期",
				width: "460px",
				"append-to-body": "",
				class: "prediction-room-dialog mm-ui",
				"close-on-click-modal": !1,
				"onUpdate:modelValue": te
			}, {
				footer: E(() => [d(T(A), {
					"data-room-cancel": !0,
					onClick: te
				}, {
					default: E(() => [...n[5] ||= [u("取消", -1)]]),
					_: 1
				}), m.value === "remove" ? (v(), a(T(A), {
					key: 0,
					type: "danger",
					"data-room-confirm": !0,
					disabled: e.disabled,
					onClick: S
				}, {
					default: E(() => [...n[6] ||= [u("确认删除", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (v(), a(T(A), {
					key: 1,
					type: "primary",
					"data-room-add-confirm": !0,
					disabled: e.disabled || !g.value,
					onClick: C
				}, {
					default: E(() => [...n[7] ||= [u("确认新增", -1)]]),
					_: 1
				}, 8, ["disabled"]))]),
				default: E(() => [m.value === "remove" ? (v(), s(r, { key: 0 }, [
					c("p", In, w(e.description) + " · " + w(h.value?.label), 1),
					n[2] ||= c("p", { class: "dialog-description" }, "删除后该房间将从当前配置中移除，点击保存配置后停止生效。", -1),
					n[3] ||= c("p", { class: "dialog-note" }, "该操作不会影响已创建订单，历史订单仍保留原配置快照。后续可从固定周期中重新添加。", -1)
				], 64)) : (v(), s(r, { key: 1 }, [n[4] ||= c("label", { class: "dialog-label" }, "预测周期", -1), d(T(ue), {
					modelValue: g.value,
					"onUpdate:modelValue": n[0] ||= (e) => g.value = e,
					placeholder: "请选择周期",
					style: { width: "100%" },
					disabled: e.disabled
				}, {
					default: E(() => [(v(!0), s(r, null, re(p.value, (e) => (v(), a(T(le), {
						key: e.key,
						value: e.key,
						label: e.label
					}, null, 8, ["value", "label"]))), 128))]),
					_: 1
				}, 8, ["modelValue", "disabled"])], 64))]),
				_: 1
			}, 8, ["title"])) : o("", !0)
		]));
	}
}), [["__scopeId", "data-v-6b23ed77"]]), Rn = { class: "group-heading" }, zn = { class: "field-caption" }, Bn = { class: "odds-fields" }, Vn = ["data-room"], Hn = {
	key: 0,
	class: "rule-heading"
}, Un = { class: "group-heading" }, Wn = { class: "group-heading" }, Gn = { class: "group-heading" }, Kn = { class: "two-fields" }, qn = {
	key: 1,
	class: "editor-footer"
}, Jn = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "edit",
	props: {
		inline: {
			type: Boolean,
			default: !1
		},
		externalSave: {
			type: Boolean,
			default: !1
		}
	},
	emits: ["success", "close"],
	setup(t, { expose: n, emit: l }) {
		let { predictionConfigurationDetail: f, predictionConfigurationList: p, predictionConfigurationSave: m } = pe().api, h = t, g = b(), _ = b(), ne = b(!1), y = b();
		function x() {
			_.value?.submit();
		}
		function C() {
			y.value?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		let ae = l, D = he(), O = b(!1), M = b(!1), N = b(""), F = b(), L = b(!1), R = i(() => nt(D.perms, "prediction_config:edit")), z = b(""), ce = b("UP_DOWN"), le = b(""), B = i({
			get: () => F.value?.rules[0]?.price_rule.price_decimals ?? void 0,
			set: (e) => {
				if (!(!F.value || !R.value || !we.value.ready || L.value || ne.value)) for (let t of F.value.rules) t.price_rule.price_decimals = e ?? null;
			}
		}), ue = b("");
		oe(B, (e) => {
			Number.isNaN(e) || (ue.value = e == null ? "" : String(e));
		}, {
			immediate: !0,
			flush: "sync"
		});
		let H = i({
			get: () => ue.value,
			set: (e) => {
				!F.value || !R.value || !we.value.ready || L.value || ne.value || (ue.value = e, B.value = e === "" ? void 0 : /^[0-8]$/.test(e) ? Number(e) : NaN);
			}
		}), U = b(!1), fe = i(() => F.value?.game_type === "UP_DOWN" ? [...F.value.rules].sort((e, t) => Ee.indexOf(e.duration_seconds) - Ee.indexOf(t.duration_seconds)) : F.value?.rules ?? []), W = i(() => fe.value.filter((e) => e.enabled_by_default)), G = i(() => fe.value.map((e) => ({
			key: e.duration_seconds,
			label: Se(e.duration_seconds, F.value?.game_type),
			present: e.enabled_by_default,
			allowed: !0
		}))), K = i(() => h.inline ? g.value?.enabled_by_default ? [g.value] : [] : W.value);
		function me(e) {
			g.value = W.value.find((t) => t.duration_seconds === e);
		}
		function ge(e, t) {
			if (!R.value || !we.value.ready || L.value || ne.value) return;
			let n = fe.value.find((t) => t.duration_seconds === e);
			!n || n.enabled_by_default === t || (n.enabled_by_default = t, g.value = t ? n : W.value[0]);
		}
		let _e = b(0), ve = b(0), ye = b(""), be = b(""), xe, q = i(() => String(D.userInfo.id || "")), we = i(() => ({
			target: z.value,
			generation: _e.value,
			actor: ye.value,
			enabled: F.value?.enabled,
			roomDurations: W.value.map((e) => e.duration_seconds),
			loading: M.value,
			pending: L.value,
			saving: ne.value,
			saveError: _.value?.error || "",
			isNew: !!F.value?.is_new,
			dirty: !!(F.value && be.value && JSON.stringify(F.value) !== be.value),
			ready: !!(F.value && !M.value && !N.value && ve.value === _e.value && ye.value === q.value && `${F.value.game_type}:${F.value.symbol}` === z.value)
		}));
		oe(F, () => {
			h.externalSave && !M.value && _.value?.clearFeedback();
		}, {
			deep: !0,
			flush: "sync"
		});
		function Te(e, t, n, r) {
			return typeof r != "boolean" || !F.value || F.value.is_new || !we.value.ready || !R.value || !nt(D.perms, "prediction_config:lists") || L.value || ne.value || e !== z.value || t !== _e.value || n !== q.value ? !1 : (F.value.enabled = r, !0);
		}
		oe(() => [
			q.value,
			nt(D.perms, "prediction_config:lists"),
			R.value
		], () => {
			_e.value++, xe?.abort(), M.value = !1;
		}, { flush: "sync" });
		function De(e, t) {
			if (!e.rules.length || e.rules.some((e) => e.game_type !== `GAME_TYPE_${ce.value}` || e.symbol !== le.value)) throw Error("返回配置与当前币种或玩法不匹配，请重新加载");
			let n = g.value?.duration_seconds;
			F.value = Fe(e), U.value = !1, be.value = JSON.stringify(F.value), ve.value = t, ye.value = q.value, g.value = W.value.find((e) => e.duration_seconds === n) || W.value[0];
		}
		async function Oe() {
			if (!nt(D.perms, "prediction_config:lists")) return;
			xe?.abort(), xe = new AbortController();
			let e = ++_e.value, t = ce.value, n = le.value;
			M.value = !0, N.value = "";
			try {
				if (U.value) {
					if (!R.value) throw Error("没有配置新增权限");
					let r = await p({}, xe.signal);
					if (e !== _e.value) return;
					let i = tt(r, t, n);
					return i.existing ? De(i.existing, e) : (F.value = et(t, n, i.version), be.value = JSON.stringify(F.value), ve.value = e, ye.value = q.value, g.value = W.value[0]), e;
				}
				let r = await f({
					game_type: t,
					symbol: n
				}, xe.signal);
				if (e === _e.value) return De(r.configuration, e), e;
			} catch (t) {
				e === _e.value && (N.value = Ce(t));
			} finally {
				e === _e.value && (M.value = !1);
			}
		}
		async function ke(e, t, n, r = !1) {
			if (ce.value = e, le.value = t, z.value = `${e}:${t}`, U.value = r, F.value = void 0, be.value = "", g.value = void 0, L.value = !1, O.value = !0, n && nt(D.perms, "prediction_config:lists")) {
				xe?.abort();
				let e = ++_e.value;
				M.value = !1, N.value = "";
				try {
					return De(n, e), e;
				} catch (e) {
					N.value = Ce(e);
					return;
				}
			}
			return await Oe();
		}
		function Ae() {
			if (!F.value) throw Error("请先加载配置");
			let e = Le(ie(F.value));
			if (e.length) throw Error(Re(e, F.value.game_type, g.value?.duration_seconds || F.value.rules[0]?.duration_seconds || ""));
			let { client_request_id: t, reason: n, ...r } = Ie(ie(F.value), "", "");
			return r;
		}
		let je = (e) => m(e);
		function Me() {
			U.value = !1, ae("success"), Oe();
		}
		async function Ne() {
			M.value || L.value || ne.value || await Oe();
		}
		return te(() => {
			_e.value++, xe?.abort();
		}), n({
			open: ke,
			focusSave: C,
			saveConfig: x,
			editingState: we,
			setEnabled: Te
		}), (n, i) => !t.inline || O.value ? (v(), a(S(t.inline ? "section" : T(P)), {
			key: 0,
			class: ee(["mm-ui", { "prediction-edit-inline": t.inline }]),
			modelValue: O.value,
			"onUpdate:modelValue": i[5] ||= (e) => O.value = e,
			"close-on-click-modal": !1,
			"destroy-on-close": "",
			size: "min(1080px,96vw)",
			title: "玩法配置",
			onClosed: i[6] ||= (e) => ae("close")
		}, {
			default: E(() => [
				N.value ? (v(), a(T(k), {
					key: 0,
					title: N.value,
					type: "error",
					closable: !1
				}, null, 8, ["title"])) : o("", !0),
				d(gn, {
					loading: M.value,
					"hide-content": M.value && !F.value,
					"min-height": t.inline ? "0px" : "280px",
					class: "prediction-edit"
				}, {
					default: E(() => [c("div", {
						ref_key: "saveArea",
						ref: y,
						"data-config-save-area": "",
						class: ee(["config-save-area", { "config-save-area--external": t.externalSave }])
					}, [O.value && R.value ? (v(), a(mn, {
						key: 0,
						ref_key: "writeRef",
						ref: _,
						"hide-button": t.externalSave,
						"hide-success": t.externalSave,
						"hide-pending-details": t.externalSave,
						"hide-error": t.externalSave,
						action: "config.save",
						target: z.value,
						permission: "prediction_config:edit",
						label: "保存配置",
						"automatic-reason": "通过总后台玩法配置页面保存配置",
						disabled: M.value || !we.value.ready,
						payload: Ae,
						send: je,
						onPending: i[0] ||= (e) => L.value = e,
						onBusy: i[1] ||= (e) => ne.value = e,
						onSuccess: Me
					}, null, 8, [
						"hide-button",
						"hide-success",
						"hide-pending-details",
						"hide-error",
						"target",
						"disabled"
					])) : o("", !0)], 2), F.value ? (v(), s(r, { key: 0 }, [
						F.value.is_new ? (v(), a(T(k), {
							key: 0,
							title: "首次配置需填写全部五个周期的必填参数；保存后币种保持关闭。",
							type: "info",
							closable: !1
						})) : o("", !0),
						d(T(j), {
							shadow: "never",
							class: "room-config"
						}, {
							header: E(() => [c("div", Rn, [c("div", null, [c("h3", null, w(F.value.game_type === "UP_DOWN" ? "房间配置" : "周期配置"), 1), c("p", null, w(F.value.symbol) + " · " + w(F.value.game_type === "UP_DOWN" ? "涨跌预测" : "自选预测"), 1)]), t.inline ? o("", !0) : (v(), a(T(de), {
								key: 0,
								modelValue: F.value.enabled,
								"onUpdate:modelValue": i[2] ||= (e) => F.value.enabled = e,
								disabled: !R.value || L.value || F.value.is_new,
								"active-text": "开放",
								"inactive-text": "停用"
							}, null, 8, ["modelValue", "disabled"]))])]),
							default: E(() => [c("div", zn, w(F.value.game_type === "UP_DOWN" ? "支持房间" : "支持周期"), 1), d(Ln, {
								description: `${F.value.symbol} · ${F.value.game_type === "UP_DOWN" ? "涨跌预测" : "自选预测"}`,
								rooms: G.value,
								selected: g.value?.duration_seconds || "",
								disabled: !R.value || !we.value.ready || L.value || ne.value,
								context: `${q.value}:${z.value}:${_e.value}`,
								onSelect: me,
								onChange: ge
							}, null, 8, [
								"description",
								"rooms",
								"selected",
								"disabled",
								"context"
							])]),
							_: 1
						}),
						d(T(j), {
							shadow: "never",
							class: "config-group"
						}, {
							header: E(() => [...i[7] ||= [c("div", { class: "group-heading" }, [c("div", null, [c("h3", null, "价格精度"), c("p", null, "同一币种全部周期共用，变更只影响后续新场次或订单。")])], -1)]]),
							default: E(() => [d(T(se), { "label-position": "top" }, {
								default: E(() => [c("div", Bn, [d(T(I), { label: "价格小数位" }, {
									default: E(() => [d(En, {
										"input-component": T(e),
										modelValue: H.value,
										"onUpdate:modelValue": i[3] ||= (e) => H.value = e,
										min: "0",
										max: "8",
										step: "1",
										unit: "位",
										inputmode: "numeric",
										placeholder: "请输入 0～8 的整数",
										"aria-label": "价格小数位",
										disabled: !R.value || !we.value.ready || L.value || ne.value
									}, null, 8, [
										"input-component",
										"modelValue",
										"disabled"
									])]),
									_: 1
								})])]),
								_: 1
							}), i[8] ||= c("p", { class: "group-note" }, "可设置 0～8 位，未配置时默认填入 3 位，保存后生效。按所选位数截断，不四舍五入；0 表示整数，旧订单保留原规则。", -1)]),
							_: 1
						}),
						d(T(se), {
							"label-position": "top",
							disabled: !R.value || L.value
						}, {
							default: E(() => [(v(!0), s(r, null, re(K.value, (n, l) => (v(), s("section", {
								key: n.market_id || l,
								class: "rule",
								"data-room": n.duration_seconds
							}, [
								t.inline ? o("", !0) : (v(), s("div", Hn, [c("strong", null, w(T(Se)(n.duration_seconds, F.value.game_type)) + w(F.value.game_type === "UP_DOWN" ? "房间" : ""), 1)])),
								F.value.game_type === "UP_DOWN" ? (v(), a(T(j), {
									key: 1,
									shadow: "never",
									class: "config-group round-time-summary"
								}, {
									header: E(() => [c("div", Un, [c("div", null, [c("h3", null, " 场次时间 · " + w(T(Se)(n.duration_seconds, F.value.game_type)) + "房间 ", 1), i[9] ||= c("p", null, "每个场次的下注开放时间固定为 30 秒", -1)]), d(T(V), { size: "small" }, {
										default: E(() => [u(w(T(Se)(n.duration_seconds, F.value.game_type)), 1)]),
										_: 2
									}, 1024)])]),
									_: 2
								}, 1024)) : o("", !0),
								d(T(j), {
									shadow: "never",
									class: "config-group"
								}, {
									header: E(() => [c("div", Wn, [c("div", null, [c("h3", null, " 赔率配置 · " + w(T(Se)(n.duration_seconds, F.value.game_type)), 1), c("p", null, w(F.value.game_type === "UP_DOWN" ? "上涨赔率 = 1 + 目标返奖率 × 下跌池 ÷（上涨池＋本次下注）；下跌赔率反向计算。下注期间为预计倍率，封盘后锁定最终倍率。" : "用户下单时按当前周期固定赔率锁定，订单存储赔率快照"), 1)]), d(T(V), {
										size: "small",
										effect: "plain"
									}, {
										default: E(() => [u(w(F.value.game_type === "UP_DOWN" ? "动态赔率" : "固定赔率"), 1)]),
										_: 1
									})])]),
									default: E(() => [c("div", { class: ee(["odds-fields", { "one-field": F.value.game_type === "HIGH_LOW" }]) }, [F.value.game_type === "HIGH_LOW" && n.fixed_odds ? (v(), a(An, {
										key: 0,
										modelValue: n.fixed_odds,
										"onUpdate:modelValue": (e) => n.fixed_odds = e,
										compact: "",
										unit: "x",
										title: "固定赔率",
										description: "上涨和下跌使用相同赔率，且必须小于 2"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])) : o("", !0), F.value.game_type === "UP_DOWN" ? (v(), s(r, { key: 1 }, [n.target_payout_rate ? (v(), a(An, {
										key: 0,
										modelValue: n.target_payout_rate,
										"onUpdate:modelValue": (e) => n.target_payout_rate = e,
										compact: "",
										"agent-locked": "",
										percentage: "",
										title: "目标返奖率",
										description: "例如 90%：按对方资金池的 90% 计算可分配收益，且必须小于 100%"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])) : o("", !0), n.maximum_odds ? (v(), a(An, {
										key: 1,
										modelValue: n.maximum_odds,
										"onUpdate:modelValue": (e) => n.maximum_odds = e,
										compact: "",
										"agent-locked": "",
										unit: "x",
										title: "最高赔率",
										description: "最终结算倍率不高于此值"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])) : o("", !0)], 64)) : o("", !0)], 2)]),
									_: 2
								}, 1024),
								d(T(j), {
									shadow: "never",
									class: "config-group"
								}, {
									header: E(() => [c("div", Gn, [c("div", null, [c("h3", null, " 下注限制 · " + w(T(Se)(n.duration_seconds, F.value.game_type)), 1), c("p", null, w(F.value.symbol) + " 当前" + w(F.value.game_type === "UP_DOWN" ? "房间" : "周期") + "的单笔下注范围 ", 1)]), d(T(V), { size: "small" }, {
										default: E(() => [u(w(T(Se)(n.duration_seconds, F.value.game_type)), 1)]),
										_: 2
									}, 1024)])]),
									default: E(() => [c("div", Kn, [d(T(I), { label: "单笔最小额（USDT）" }, {
										label: E(() => [i[10] ||= u("单笔最小额（USDT）", -1), d(yn, {
											label: "单笔最小额",
											content: "此房间允许的最低单笔下注额。商户可在总后台单笔范围内调整自己的最小额和最大额。"
										})]),
										default: E(() => [d(En, {
											"input-component": T(e),
											"aria-label": "单笔最小额",
											unit: "USDT",
											"model-value": n.minimum_stake.default_value,
											"onUpdate:modelValue": (e) => T(qe)(n, "minimum_stake", e)
										}, null, 8, [
											"input-component",
											"model-value",
											"onUpdate:modelValue"
										])]),
										_: 2
									}, 1024), d(T(I), { label: "单笔最大额（USDT）" }, {
										label: E(() => [i[11] ||= u("单笔最大额（USDT）", -1), d(yn, {
											label: "单笔最大额",
											content: "此房间允许的最高单笔下注额。修改生效后，对应房间的商户限额重置为总后台范围。"
										})]),
										default: E(() => [d(En, {
											"input-component": T(e),
											"aria-label": "单笔最大额",
											unit: "USDT",
											"model-value": n.maximum_stake.default_value,
											"onUpdate:modelValue": (e) => T(qe)(n, "maximum_stake", e)
										}, null, 8, [
											"input-component",
											"model-value",
											"onUpdate:modelValue"
										])]),
										_: 2
									}, 1024)])]),
									_: 2
								}, 1024)
							], 8, Vn))), 128))]),
							_: 1
						}, 8, ["disabled"])
					], 64)) : o("", !0)]),
					_: 1
				}, 8, [
					"loading",
					"hide-content",
					"min-height"
				]),
				N.value || !t.inline || we.value.dirty ? (v(), s("div", qn, [
					we.value.dirty ? (v(), a(T(A), {
						key: 0,
						"data-config-discard": !0,
						disabled: M.value || L.value || ne.value,
						onClick: Ne
					}, {
						default: E(() => [...i[12] ||= [u("放弃修改并重新加载", -1)]]),
						_: 1
					}, 8, ["disabled"])) : o("", !0),
					N.value ? (v(), a(T(A), {
						key: 1,
						disabled: M.value,
						onClick: Oe
					}, {
						default: E(() => [...i[13] ||= [u("重试", -1)]]),
						_: 1
					}, 8, ["disabled"])) : o("", !0),
					t.inline ? o("", !0) : (v(), a(T(A), {
						key: 2,
						onClick: i[4] ||= (e) => O.value = !1
					}, {
						default: E(() => [...i[14] ||= [u("关闭", -1)]]),
						_: 1
					}))
				])) : o("", !0)
			]),
			_: 1
		}, 40, ["class", "modelValue"])) : o("", !0);
	}
}), [["__scopeId", "data-v-ff28b192"]]), Yn = { class: "guide-body" }, Xn = { class: "guide-example" }, Zn = { class: "guide-formulas" }, Qn = { class: "guide-footer" }, $n = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "GridGuide",
	props: {
		modelValue: {
			type: Boolean,
			default: !1
		},
		modelModifiers: {}
	},
	emits: ["update:modelValue"],
	setup(e) {
		let t = ae(e, "modelValue"), n = [
			{
				title: "① 计算短期波动率",
				expression: "rₖ = ln(Pₖ ÷ Pₖ₋₁)\nσ = √[ Σ(rₖ − r̄)² ÷ (M − 1) ]",
				explanation: "Pₖ 是每 500ms 的标记价；示例取最近 60 秒，即 M＝120。这里的 σ 是每 500ms 对数价格波动率，不能直接使用年化波动率。"
			},
			{
				title: "② 建立 100 个可能价格位置",
				expression: "y₀ = ln(P当前)\nymin = y₀ − 4σ√N，ymax = y₀ ＋ 4σ√N\nΔy = (ymax − ymin) ÷ 99，yⱼ = ymin ＋ jΔy",
				explanation: "N 是从现在到格子结束的 500ms 步数；在对数价格上下 4 个标准差范围内均匀划分 100 个位置。"
			},
			{
				title: "③ 计算每 500ms 的价格转移概率",
				expression: "φ(z) = e^(−z²/2) ÷ √(2π)\nwᵢⱼ = φ[(yⱼ − yᵢ) ÷ σ] × Δy ÷ σ\nTᵢⱼ = wᵢⱼ ÷ Σⱼwᵢⱼ",
				explanation: "Tᵢⱼ 表示价格当前位于第 i 个位置，500ms 后移动到第 j 个位置的概率；每一行归一化后合计为 100%。"
			},
			{
				title: "④ 逐步传递并移除已命中的概率",
				expression: "pₙ₊₁,ⱼ = Σᵢ(pₙ,ᵢ × Tᵢⱼ)\n有效期内，若 ln(L) ≤ yⱼ < ln(U)，则令 pₙ₊₁,ⱼ = 0",
				explanation: "L、U 是格子价格下限和上限。进入格子的概率被移除，代表已经命中，后续步骤不再重复计算这部分概率；实际穿越判定同时考虑有效行情线段。"
			},
			{
				title: "⑤ 得到最终命中概率",
				expression: "pHit = 1 − Σⱼp结束,ⱼ",
				explanation: "Σp结束 是格子有效期结束后仍然从未进入格子的概率；用 100% 减去它，就是该格子的命中概率。"
			}
		];
		return (e, i) => (v(), a(T(N), {
			modelValue: t.value,
			"onUpdate:modelValue": i[1] ||= (e) => t.value = e,
			title: "预测网格玩法说明",
			width: "860px",
			class: "prediction-grid-guide mm-ui",
			"append-to-body": "",
			"destroy-on-close": ""
		}, {
			header: E(() => [...i[2] ||= [c("h2", { class: "guide-title" }, "预测网格玩法说明", -1), c("p", { class: "guide-subtitle" }, "用一个例子看懂格子、命中概率和赔率", -1)]]),
			footer: E(() => [c("div", Qn, [i[24] ||= c("span", null, "核心规则：有效时间内，连续有效价格进入或穿过对应价格范围一次，即为命中。", -1), d(T(A), {
				type: "primary",
				onClick: i[0] ||= (e) => t.value = !1
			}, {
				default: E(() => [...i[23] ||= [u("我知道了", -1)]]),
				_: 1
			})])]),
			default: E(() => [c("div", Yn, [
				i[18] ||= c("div", { class: "guide-metrics" }, [
					c("article", null, [
						c("span", null, "示例网格大小"),
						c("strong", null, "10 × 10"),
						c("small", null, "横向 10 列，纵向 10 行")
					]),
					c("article", null, [
						c("span", null, "每列时间"),
						c("strong", null, "2 秒"),
						c("small", null, "每个格子只在对应 2 秒内有效")
					]),
					c("article", null, [
						c("span", null, "覆盖时间"),
						c("strong", null, "20 秒"),
						c("small", null, "从左到右预测未来 20 秒")
					]),
					c("article", null, [
						c("span", null, "下单方式"),
						c("strong", null, "点 1 格"),
						c("small", null, "点击一个格子就是一笔订单")
					])
				], -1),
				i[19] ||= c("p", { class: "guide-note" }, "以下网格与概率推演用于说明原型示例。实际格子的价格范围、有效时间、可下注状态和锁定赔率以交易页面及订单记录为准。", -1),
				i[20] ||= c("section", null, [c("header", null, [c("b", null, "01"), c("div", null, [c("h3", null, "这个网格怎么看？"), c("p", null, "横向看时间，纵向看价格；一个格子代表“某个价格在某段时间出现”。")])]), c("div", { class: "guide-columns" }, [c("article", null, [c("h4", null, "X 轴＝未来时间"), c("p", null, "共 10 列，每列 2 秒。第 1 列看未来第 0～2 秒，第 2 列看第 2～4 秒，依次覆盖未来 20 秒。")]), c("article", null, [c("h4", null, "Y 轴＝价格区间"), c("p", null, "共 10 行，以当前价格为中线，上方 5 行、下方 5 行，每行对应一个明确的价格范围。")])])], -1),
				c("section", null, [
					i[11] ||= c("header", null, [c("b", null, "02"), c("div", null, [c("h3", null, "什么叫“命中”？"), c("p", null, "看的是这 2 秒内价格有没有碰过格子，不是 2 秒结束时价格停在哪里。")])], -1),
					c("article", Xn, [
						i[9] ||= c("h4", null, "举例", -1),
						i[10] ||= c("p", null, "买入格子：BTC 65,010～65,020 · 10:00:04～10:00:06", -1),
						c("p", null, [d(T(V), { type: "success" }, {
							default: E(() => [...i[3] ||= [u("命中", -1)]]),
							_: 1
						}), i[4] ||= u(" 10:00:05 价格到达 65,015，进入了格子价格范围。", -1)]),
						c("p", null, [d(T(V), { type: "success" }, {
							default: E(() => [...i[5] ||= [u("命中", -1)]]),
							_: 1
						}), i[6] ||= u(" 连续有效行情从 65,005 到达 65,025，线段中间穿过了这个格子，也算碰到。", -1)]),
						c("p", null, [d(T(V), { type: "danger" }, {
							default: E(() => [...i[7] ||= [u("未命中", -1)]]),
							_: 1
						}), i[8] ||= u(" 这 2 秒内价格始终没有进入或穿过 65,010～65,020。", -1)])
					]),
					i[12] ||= c("p", null, "只要有效时间内碰到一次就算命中；离开后不用继续停在格子里。到 10:00:06 时这个格子已经结束，之后再碰到不算。行情缺口不能跨缺口连线判定命中。", -1)
				]),
				c("section", null, [
					i[14] ||= c("header", null, [c("b", null, "03"), c("div", null, [c("h3", null, "命中概率怎么来的？"), c("p", null, "原型按当前价格、距离、剩余时间和最近的波动大小推演，不按用户下注人数计算。")])], -1),
					i[15] ||= c("ol", null, [
						c("li", null, [c("strong", null, "看当前价格"), u("：从最新标记价出发，确定目标格子离当前价格有多远。")]),
						c("li", null, [c("strong", null, "看最近波动"), u("：根据最近一段行情，估算价格每 500ms 通常可能向上或向下移动多少；波动越大，概率扩散得越远。")]),
						c("li", null, [c("strong", null, "逐步推演"), u("：把可能价格切成 100 个位置，当前价格所在位置从 100% 开始。每 500ms 按正态分布把概率扩散到下一批价格位置；2 秒共计算 4 步。")]),
						c("li", null, [c("strong", null, "收集命中"), u("：某一步进入或穿过目标价格范围，就把这部分概率记为命中；已经命中的部分不重复计算。")])
					], -1),
					c("article", Zn, [i[13] ||= c("h4", null, [u("原型计算公式示例 "), c("small", null, "时间单位统一为 500ms")], -1), (v(), s(r, null, re(n, (e) => c("div", { key: e.title }, [
						c("h4", null, w(e.title), 1),
						c("pre", null, w(e.expression), 1),
						c("p", null, w(e.explanation), 1)
					])), 64))]),
					i[16] ||= c("article", { class: "guide-example" }, [
						c("h4", null, "具体例子"),
						c("p", null, "目标格子的 2 秒内共有 4 个 500ms 步骤。每一步“第一次碰到格子”的概率分别为 6%、5%、4%、5%："),
						c("strong", null, "命中概率＝6%＋5%＋4%＋5%＝20%"),
						c("p", null, "也可以理解为：命中概率＝100%－到结束时仍然从未碰到格子的概率。"),
						c("p", null, "如果格子在未来第 8～10 秒，先推演价格走到第 8 秒可能在哪里，再只统计第 8～10 秒这 2 秒内是否碰到。")
					], -1),
					i[17] ||= c("p", { class: "guide-note" }, "命中概率就是“从当前价格出发，按照最近的波动速度运行，在格子指定的 2 秒内进入或穿过该价格范围”的总概率。上述节点数和步长是示例，不是可在本页修改的交易参数。", -1)
				]),
				i[21] ||= c("section", null, [
					c("header", null, [c("b", null, "04"), c("div", null, [c("h3", null, "概率怎么变成赔率？"), c("p", null, "概率越高，赔率越低；概率越低，赔率越高。")])]),
					c("div", { class: "guide-equation" }, "赔率＝目标返奖率 ÷ 命中概率"),
					c("article", { class: "guide-example" }, [c("p", null, "目标返奖率为 97%，命中概率为 20%：97% ÷ 20%＝4.85。若订单锁定为 4.85x，下注 100 USDT，命中总返还为 485 USDT。"), c("p", null, "页面若简写为 4.9x，仅是显示精度；不能据此把订单锁定的返还改成 490 USDT。")]),
					c("p", null, "原型示例使用最低赔率 1.02x、最高赔率 20x，超出最高值的格子不可下注，不强制压低赔率。实际可下注状态以当前格子报价为准，本页示例不改变交易服务规则。")
				], -1),
				i[22] ||= c("section", null, [c("header", null, [c("b", null, "05"), c("div", null, [c("h3", null, "前后端需要统一的三件事"), c("p", null, "规则保持一致，才能避免前端显示命中、后端却判定未命中。")])]), c("ul", null, [
					c("li", null, [c("strong", null, "统一价格："), u("展示、概率计算和结算都使用平台合约标记价。")]),
					c("li", null, [c("strong", null, "下单后锁定："), u("用户下单后，该格子的价格范围、有效时间和赔率不再跟着新网格变化。")]),
					c("li", null, [c("strong", null, "异常不判输："), u("有效时间内价格数据中断或无法确认是否碰到时，订单进入异常处理或退款。")])
				])], -1)
			])]),
			_: 1
		}, 8, ["modelValue"]));
	}
}), [["__scopeId", "data-v-20df0f5b"]]);
//#endregion
//#region src/prediction-config/platform/views/grid/config/creation.ts
function er(e, t) {
	let n = e, r = (e) => typeof e == "string" && /^(0|[1-9]\d{0,18})$/.test(e) && jt(e, "9223372036854775807") <= 0;
	if (!n || n.symbol !== t || !/^[A-Z0-9]{2,32}$/.test(t) || !r(n.site_id) || n.site_id === "0" || !r(n.layout_version)) throw Error("INVALID_GRID_TARGET");
	let i = n.layout_version === "0";
	if (i !== (n.layout === null)) throw Error("INVALID_GRID_LAYOUT");
	let a = i ? {
		row_count: "10",
		column_count: "10",
		column_duration_seconds: "",
		price_band_width: "",
		effective_from_ms: "0",
		editable: !0,
		affected_site_ids: [n.site_id]
	} : Wt({
		...n.layout,
		effective_from_ms: "0",
		editable: !1,
		affected_site_ids: [n.site_id]
	});
	return {
		site_id: n.site_id,
		symbol: t,
		layout_version: n.layout_version,
		site_version: "0",
		effective_from_ms: "0",
		enabled: !1,
		target_rtp: "",
		min_multiplier: "",
		max_multiplier: "",
		min_order_amount: "",
		max_order_amount: "",
		layout: a
	};
}
//#endregion
//#region src/prediction-config/platform/views/grid/config/index.vue?vue&type=script&setup=true&lang.ts
var tr = {
	class: "grid-config mm-ui",
	"data-grid-config": "platform"
}, nr = { key: 3 }, rr = {
	key: 5,
	class: "pending-bar"
}, ir = { class: "pending-actions" }, ar = { class: "grid-layout" }, or = { class: "symbol-panel" }, sr = { class: "panel-heading" }, cr = {
	key: 1,
	class: "directory-error",
	role: "alert"
}, lr = { class: "symbol-list" }, ur = ["disabled", "onClick"], dr = {
	key: 0,
	class: "symbol-unconfigured"
}, fr = { key: 2 }, pr = { class: "config-panel" }, mr = {
	key: 0,
	class: "config-heading"
}, hr = { "data-config-updated-at": "" }, gr = { key: 0 }, _r = { class: "config-heading__actions" }, vr = { class: "grid-config__parameters" }, yr = { class: "parameter-card" }, br = {
	key: 0,
	class: "field-error",
	role: "alert"
}, xr = {
	key: 0,
	class: "layout-notice"
}, Sr = {
	key: 0,
	class: "parameter-card",
	"data-price-precision": ""
}, Cr = { class: "parameter-card" }, wr = { class: "parameter-card" }, Tr = { class: "parameter-heading" }, Er = { class: "parameter-description" }, Dr = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "index",
	setup(t, { expose: n }) {
		let { gridConfigSymbols: l, gridConfigCatalog: f, gridConfigCreation: p, gridConfigReceipt: m, gridConfigSite: h, saveGridConfig: g } = pe().grid, _ = ge(), ne = he(), y = (e) => ne.perms.includes("*") || ne.perms.includes(e), x = i(() => y("grid_config:read")), S = i(() => y("grid_config:save")), C = i(() => {
			let e = String(ne.userInfo.id || "");
			return /^[1-9]\d*$/.test(e) ? e : "";
		}), ae = b([]), D = b(""), j = b(""), M = b(""), N = b(null), P = b(null), L = b(""), R = b("通过预测网格配置页面保存配置"), z = b(!1), B = b(!1), V = b(!1), H = b(!1), U = b(!1), fe = b(""), W = b(""), G = b("info"), K = b(null), me = b(!1), ve = b(""), ye = b(!1), be = new on(), Se = new on(), Ce = new on(), q, we = 0, Te = i(() => x.value ? C.value ? "" : "无法确认当前操作人身份" : "当前账号没有预测网格配置查询权限"), Ee = i(() => ae.value.find((e) => e.site_id === D.value)), De = b([]), Oe = b(""), ke = i(() => Ze(Ee.value?.products ?? [], De.value)), Ae = i(() => {
			let e = M.value.trim().toUpperCase();
			return ke.value.filter((t) => !e || t.symbol.includes(e));
		}), je = i(() => N.value?.site_version === "0"), Me = i(() => x.value && S.value && !!C.value && B.value && !Oe.value && !V.value && !K.value && !me.value && !U.value);
		function Ne(e) {
			if (!e || !P.value) return !1;
			if (je.value) return JSON.stringify(e) !== JSON.stringify(P.value) || L.value !== "";
			try {
				return Gt(e, P.value, !0) || Nt(e.target_rtp) !== L.value || [
					"enabled",
					"min_multiplier",
					"max_multiplier",
					"min_order_amount",
					"max_order_amount"
				].some((t) => e[t] !== P.value[t]);
			} catch {
				return !0;
			}
		}
		let Pe = i(() => Ne(N.value)), Fe = i(() => Ne(N.value ? _t(ie(N.value), S.value) : null)), Ie = i(() => K.value ? K.value.operator_id === C.value ? "bound" : "foreign" : "none"), Le = i(() => Ie.value === "bound" ? K.value : null), Re = i(() => Ie.value === "foreign"), ze = i(() => Fe.value || !!K.value || U.value), Be = i(() => x.value && S.value && (je.value || !!Ee.value?.can_edit) && !!C.value && !!N.value && !K.value && !me.value && !H.value && !U.value), Ve = i(() => Be.value && !!N.value?.layout?.editable), He = i({
			get: () => {
				let e = P.value?.layout?.price_decimals;
				return e != null && (e <= 8 || Number.isNaN(e)) ? e : void 0;
			},
			set: (e) => {
				!Ve.value || !P.value?.layout || (P.value.layout.price_decimals = e ?? null, dt());
			}
		}), Ue = b("");
		oe(He, (e) => {
			Number.isNaN(e) || (Ue.value = e == null ? "" : String(e));
		}, {
			immediate: !0,
			flush: "sync"
		});
		let We = i({
			get: () => Ue.value,
			set: (e) => {
				Ve.value && (Ue.value = e, He.value = e === "" ? void 0 : /^[0-8]$/.test(e) ? Number(e) : NaN);
			}
		}), Ge = i(() => !!Ve.value && !!P.value?.layout && N.value?.layout?.price_band_width !== P.value.layout.price_band_width && zt(P.value.layout.price_band_width)), Ke = i(() => Be.value && (je.value || !!Ee.value?.can_edit_limits)), qe = i(() => !!Le.value && x.value && S.value && (Le.value.command.based_on_site_version === "0" || ae.value.some((e) => e.site_id === Le.value.command.site_id && e.can_edit && e.products.some((e) => e.symbol === Le.value.command.symbol)))), Je = i(() => qe.value && B.value && !V.value && !H.value && !U.value && !me.value && !ye.value && ve.value === JSON.stringify(Le.value));
		function Ye(e) {
			let t = e;
			return {
				INVALID_LAYOUT: "网格区间超出允许范围，请检查价格区间和每列时长后重试",
				LAYOUT_PRICE_UNAVAILABLE: "当前标记价暂不可用，请稍后刷新重试",
				LAYOUT_PRICE_READ_FAILED: "行情读取暂时失败，请稍后重试",
				INVALID_LAYOUT_DURATION: "横向格子区间必须为 1 至 10 的整数秒数",
				INVALID_LAYOUT_HORIZON: "横向格子区间过大，当前列数加起始等待时间后超出允许的报价时长",
				INVALID_LAYOUT_WIDTH: "纵向格子区间必须大于 0",
				INVALID_DECIMAL: "请输入有效的十进制数",
				INVALID_RTP: "目标返奖率必须大于 0 且小于 100%",
				INVALID_LAYOUT_PRECISION: "价格精度须为 0～8 位，格子区间须能以该精度精确表示",
				INVALID_GRID_LAYOUT: "网格区间返回格式不正确，请刷新后重试",
				FIELD_FORBIDDEN: "当前账号无权修改所选配置，请刷新后重试",
				CONFIG_IDENTITY_REQUIRED: "配置接口版本需要更新，请联系管理员完成本次升级",
				PLATFORM_LIMIT: "商户配置不能超出平台的开关、返奖率和金额范围",
				EMPTY_CHANGES: "配置没有实际变化，无需保存"
			}[t?.error_code || t?.message || ""] || [t?.message || "预测网格配置请求失败", t?.error_code].filter(Boolean).join(" · ");
		}
		let Xe = i(() => {
			let e = [N.value?.effective_from_ms, N.value?.layout?.effective_from_ms].filter((e) => typeof e == "string" && /^[1-9][0-9]*$/.test(e)).reduce((e, t) => BigInt(e) > BigInt(t) ? e : t, "0");
			return e === "0" ? "未提供" : xe(e);
		});
		function Qe(e) {
			if (!e || !Array.isArray(e.sites)) throw Error("币种目录返回格式不正确");
			let t = /* @__PURE__ */ new Set();
			for (let n of e.sites) {
				if (!n || typeof n.site_id != "string" || !n.site_id || n.site_id.trim() !== n.site_id || typeof n.can_edit != "boolean" || typeof n.can_edit_limits != "boolean" || !Array.isArray(n.products) || t.has(n.site_id)) throw Error("币种目录返回格式不正确");
				t.add(n.site_id);
				let e = /* @__PURE__ */ new Set();
				for (let t of n.products) {
					if (!t || typeof t.symbol != "string" || !/^[A-Z0-9]{2,32}$/.test(t.symbol) || typeof t.enabled != "boolean" || e.has(t.symbol)) throw Error("币种目录返回格式不正确");
					e.add(t.symbol);
				}
			}
			return e.sites;
		}
		function $e() {
			try {
				let e = rn(sessionStorage, C.value);
				K.value = e.pending ?? null, me.value = !1;
			} catch {
				me.value = !0, K.value = null;
			}
		}
		function et() {
			return `${C.value}:${D.value}:${j.value}`;
		}
		function tt() {
			Se.close(), N.value = null, P.value = null, L.value = "", R.value = "通过预测网格配置页面保存配置", H.value = !1;
		}
		async function nt(e) {
			if (be.close(), Ce.close(), ve.value = "", B.value = !1, tt(), ae.value = [], De.value = [], Oe.value = "", D.value = "", j.value = "", M.value = "", fe.value = "", W.value = "", $e(), Te.value || me.value) return;
			let t = be.next(C.value);
			V.value = !0;
			try {
				let [n, r] = await Promise.allSettled([f(t.signal), l(t.signal)]);
				if (!t.current(C.value)) return;
				if (r.status === "fulfilled" && Array.isArray(r.value) && r.value.every((e) => typeof e == "string") ? De.value = r.value : Oe.value = "通用币种目录暂不可用，当前仅显示已授权的网格配置。", n.status === "rejected") throw n.reason;
				ae.value = Qe(n.value), B.value = !0;
				let i = Le.value ?? (e ? { command: e } : null), a = i && (i.command.based_on_site_version === "0" || ae.value.some((e) => e.site_id === i.command.site_id)) ? i.command.site_id : ae.value[0]?.site_id || "";
				D.value = a;
				let o = ae.value.find((e) => e.site_id === a), s = i && i.command.site_id === a && (i.command.based_on_site_version === "0" || o?.products.some((e) => e.symbol === i.command.symbol)) ? i.command.symbol : ke.value.find((e) => e.configured)?.symbol || "";
				j.value = s, s && o?.products.some((e) => e.symbol === s) && (q = st());
			} catch (e) {
				t.current(C.value) && (fe.value = Ye(e));
			} finally {
				t.current(C.value) && (V.value = !1);
			}
		}
		function rt(e) {
			ze.value || (tt(), D.value = e, j.value = ke.value.find((e) => e.configured)?.symbol || "", j.value && (q = st()));
		}
		function it(e) {
			if (e === j.value && (N.value || H.value) || ze.value) return;
			let t = ke.value.find((t) => t.symbol === e);
			!t || !t.configured && !Me.value || (tt(), fe.value = "", j.value = e, q = t.configured ? st() : at());
		}
		async function at() {
			if (tt(), !Me.value || !j.value) return;
			let e = j.value, t = Se.next(et());
			H.value = !0;
			try {
				let n = await p(e, t.signal);
				if (!t.current(et()) || !S.value) return;
				let r = er(n, e);
				N.value = r, P.value = _t(r, S.value), H.value = !1, D.value = r.site_id;
			} catch (e) {
				t.current(et()) && (fe.value = Ye(e));
			} finally {
				t.current(et()) && (H.value = !1);
			}
		}
		function ot() {
			!je.value || K.value || U.value || (tt(), j.value = "", W.value = "");
		}
		async function st() {
			if (tt(), !x.value || !D.value || !j.value) return;
			let e = D.value, t = j.value, n = et(), r = Se.next(n);
			H.value = !0;
			try {
				let n = await h(e, t, r.signal);
				if (!r.current(et())) return;
				let i = qt(n, e, t);
				N.value = i, P.value = _t(i, S.value), L.value = Nt(i.target_rtp);
			} catch (e) {
				r.current(et()) && (fe.value = Ye(e));
			} finally {
				r.current(et()) && (H.value = !1);
			}
		}
		function ct(e) {
			return e.symbol === j.value && P.value ? P.value.enabled : e.enabled;
		}
		function lt(e) {
			return !Ee.value?.products.some((t) => t.symbol === e.symbol) || !S.value || !Ee.value?.can_edit || H.value || U.value || !!K.value || me.value || Fe.value && e.symbol !== j.value;
		}
		async function ut(e, t) {
			typeof t != "boolean" || lt(e) || (e.symbol !== j.value && (it(e.symbol), await q), P.value && P.value.symbol === e.symbol && !lt(e) && (P.value.enabled = t, dt()));
		}
		function dt() {
			W.value = "";
		}
		async function ft() {
			if (!Be.value || !N.value || !P.value || !C.value) return;
			let e;
			try {
				e = Jt(N.value, {
					...P.value,
					target_rtp: Pt(L.value)
				}, R.value, Ft(), je.value || !!Ee.value?.can_edit_limits, !0);
			} catch (e) {
				G.value = "warning", W.value = Ye(e);
				return;
			}
			let t = tn(C.value, e), n = vt(), r = "price_band_width" in e.changes || "column_duration_seconds" in e.changes || "price_decimals" in e.changes, i = je.value ? " 首次创建后保持关闭。" : r ? ` 公共网格区间修改将影响站点：${N.value.layout.affected_site_ids.join("、")}。` : "";
			try {
				await ce.confirm(`确认保存 ${e.site_id} / ${e.symbol} 的 ${Object.keys(e.changes).length} 项修改？${i}`, "确认预测网格配置", {
					type: "warning",
					confirmButtonText: "确认保存",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			}
			if ($e(), !Be.value || !N.value || !P.value || n !== vt()) {
				G.value = "warning", W.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let a;
			try {
				a = Jt(N.value, {
					...P.value,
					target_rtp: Pt(L.value)
				}, R.value, t.command.client_request_id, je.value || !!Ee.value?.can_edit_limits, !0);
			} catch {
				G.value = "warning", W.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let o;
			try {
				o = nn(sessionStorage, t, C.value, a), $e();
			} catch (e) {
				if (e?.message === "STALE_CONFIRMATION") {
					G.value = "warning", W.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
					return;
				}
				me.value = !0;
				return;
			}
			ht(o, "save");
		}
		async function pt() {
			$e(), !(!Le.value || !qe.value || U.value || ye.value) && ht(Le.value, "receipt");
		}
		async function mt() {
			if ($e(), !Je.value || !Le.value) return;
			let e = Le.value;
			ye.value = !0;
			try {
				await ce.confirm(`确认恢复 ${e.command.site_id} / ${e.command.symbol} 的原请求 ${e.command.client_request_id}？将沿用原编号和原参数；已提交则返回原回执，尚未提交则保存原配置，不使用当前页面的新修改。`, "恢复原配置请求", {
					type: "warning",
					confirmButtonText: "确认恢复",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			} finally {
				ye.value = !1;
			}
			if ($e(), !Je.value || JSON.stringify(e) !== JSON.stringify(Le.value)) {
				G.value = "warning", W.value = "确认期间账号、权限或原请求已变化，本次恢复已取消，请重新查询原操作回执";
				return;
			}
			await ht(e, "recover");
		}
		async function ht(e, t) {
			let n = ++we, r = et(), i = Ce.next(r);
			U.value = !0, ve.value = "", W.value = "";
			try {
				let n = await an(sessionStorage, e, t, (e, t) => e === "save" ? g(t) : m(t));
				if (!i.current(et())) return;
				if ($e(), n.status === "success") {
					let e = C.value;
					R.value = "通过预测网格配置页面保存配置", U.value = !1, await nt(), e === C.value && (G.value = "warning", W.value = fe.value ? "配置已保存；最新配置刷新失败，请手动刷新" : "");
				} else if (t === "recover" && n.status === "rejected" && n.error?.error_code === "VERSION_CONFLICT") if (!n.journalCleared || K.value || me.value) G.value = "warning", W.value = "旧请求已明确拒绝，但本机待确认记录已变化，请重新核对当前记录";
				else {
					let t = C.value;
					if (await nt(e.command), D.value && j.value && q && await q, t === C.value) {
						G.value = "warning";
						let t = D.value === e.command.site_id && j.value === e.command.symbol && ae.value.some((t) => t.site_id === e.command.site_id && t.products.some((t) => t.symbol === e.command.symbol));
						W.value = "旧请求未生效，配置版本已变化；已清除旧待确认记录。" + (t ? fe.value || !N.value ? "最新配置刷新失败，请手动刷新" : "请以当前配置为准" : `原目标当前不可见（${e.command.site_id} / ${e.command.symbol}），请核对权限和配置`);
					}
				}
				else G.value = n.status === "unknown" ? "warning" : "info", t === "receipt" && Qt(n.error) && JSON.stringify(Le.value) === JSON.stringify(e) ? (ve.value = JSON.stringify(e), W.value = "未找到原操作回执，可使用原编号和原参数恢复请求") : t === "recover" ? W.value = "恢复尚未确认，原请求已保留，请重新查询原操作回执 · " + Ye(n.error) : W.value = n.status === "unknown" ? "原操作结果仍待确认，请使用原请求查询回执" : "保存已明确拒绝，可修正后重新提交 · " + Ye(n.error);
			} catch (e) {
				i.current(et()) && ($e(), G.value = "warning", W.value = "原操作结果仍待确认 · " + Ye(e));
			} finally {
				n === we && (U.value = !1, $e());
			}
		}
		async function gt() {
			if (!ze.value) return !0;
			try {
				return await ce.confirm("当前有未保存修改或待确认操作，离开不会删除原记录。仍要离开吗？", "离开预测网格配置", { type: "warning" }), !0;
			} catch {
				return !1;
			}
		}
		function vt() {
			return JSON.stringify({
				operator: C.value,
				site: D.value,
				symbol: j.value,
				snapshot: N.value,
				draft: P.value,
				rtp: L.value,
				reason: R.value
			});
		}
		async function yt() {
			if (!U.value) {
				if (Fe.value) {
					let e = vt();
					try {
						await ce.confirm("刷新会丢弃当前未保存修改，仍要刷新吗？", "刷新预测网格配置", { type: "warning" });
					} catch {
						return;
					}
					if (U.value || e !== vt()) {
						G.value = "warning", W.value = "确认期间编辑状态已变化，本次刷新已取消";
						return;
					}
				}
				await nt();
			}
		}
		function bt(e) {
			ze.value && (e.preventDefault(), e.returnValue = "");
		}
		return oe(() => [
			C.value,
			x.value,
			S.value
		], () => nt(), { immediate: !0 }), _e(gt), window.addEventListener("beforeunload", bt), te(() => {
			ve.value = "", B.value = !1, be.close(), Se.close(), Ce.close(), window.removeEventListener("beforeunload", bt);
		}), n({
			hasBlockingWork: ze,
			confirmLeave: gt,
			refresh: yt,
			loading: V
		}), (t, n) => (v(), s("section", tr, [
			Te.value ? (v(), a(T(k), {
				key: 0,
				title: Te.value,
				type: "warning",
				closable: !1
			}, null, 8, ["title"])) : me.value ? (v(), a(T(k), {
				key: 1,
				title: "本机保存的待确认操作记录已损坏或不可用，请停止操作并联系管理员核验",
				type: "error",
				closable: !1
			})) : Re.value ? (v(), a(T(k), {
				key: 2,
				title: "检测到其他账号尚未确认的预测网格配置操作，当前账号不可覆盖，请切回原账号查询回执",
				type: "error",
				closable: !1
			})) : o("", !0),
			fe.value ? (v(), s("div", nr, [d(T(k), {
				title: fe.value,
				type: "error",
				closable: !1
			}, null, 8, ["title"]), d(T(A), {
				loading: V.value || H.value,
				disabled: U.value || !!K.value,
				onClick: yt
			}, {
				default: E(() => [...n[16] ||= [u("重试", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"])])) : o("", !0),
			W.value ? (v(), a(T(k), {
				key: 4,
				title: W.value,
				type: G.value,
				closable: !1
			}, null, 8, ["title", "type"])) : o("", !0),
			Le.value ? (v(), s("div", rr, [c("div", null, [n[17] ||= c("strong", null, "原配置操作结果待确认", -1), c("small", null, w(Le.value.command.site_id) + " · " + w(Le.value.command.symbol) + " · " + w(Le.value.command.client_request_id), 1)]), c("div", ir, [d(T(A), {
				type: "warning",
				loading: U.value,
				disabled: !qe.value || ye.value,
				onClick: pt
			}, {
				default: E(() => [...n[18] ||= [u("查询原操作回执", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"]), Je.value || ye.value ? (v(), a(T(A), {
				key: 0,
				type: "warning",
				disabled: !Je.value,
				onClick: mt
			}, {
				default: E(() => [...n[19] ||= [u("恢复原请求", -1)]]),
				_: 1
			}, 8, ["disabled"])) : o("", !0)])])) : o("", !0),
			d(gn, {
				loading: V.value,
				"hide-content": V.value,
				"min-height": "0px",
				class: "grid-loading-workspace"
			}, {
				default: E(() => [c("div", ar, [c("aside", or, [
					c("div", sr, [n[20] ||= c("strong", null, "币种配置", -1), c("span", null, w(Ae.value.length) + " 条", 1)]),
					ae.value.length > 1 ? (v(), a(T(ue), {
						key: 0,
						modelValue: D.value,
						"onUpdate:modelValue": n[0] ||= (e) => D.value = e,
						"aria-label": "选择站点",
						disabled: ze.value,
						onChange: rt
					}, {
						default: E(() => [(v(!0), s(r, null, re(ae.value, (e) => (v(), a(T(le), {
							key: e.site_id,
							label: e.site_id,
							value: e.site_id
						}, null, 8, ["label", "value"]))), 128))]),
						_: 1
					}, 8, ["modelValue", "disabled"])) : o("", !0),
					Oe.value ? (v(), s("p", cr, [u(w(Oe.value), 1), d(T(A), {
						link: "",
						type: "primary",
						disabled: ze.value,
						onClick: yt
					}, {
						default: E(() => [...n[21] ||= [u("重试", -1)]]),
						_: 1
					}, 8, ["disabled"])])) : o("", !0),
					d(T(e), {
						modelValue: M.value,
						"onUpdate:modelValue": n[1] ||= (e) => M.value = e,
						clearable: "",
						placeholder: "搜索交易对",
						"aria-label": "搜索交易对"
					}, null, 8, ["modelValue"]),
					c("div", lr, [(v(!0), s(r, null, re(Ae.value, (e) => (v(), s("div", {
						key: e.symbol,
						class: ee(["symbol-row", { active: e.symbol === j.value }])
					}, [
						c("button", {
							type: "button",
							class: "symbol-button",
							disabled: !e.configured && !Me.value || ze.value && e.symbol !== j.value,
							onClick: (t) => it(e.symbol)
						}, [d(T(_), { symbol: e.symbol }, null, 8, ["symbol"])], 8, ur),
						e.configured ? (v(), a(T(de), {
							key: 1,
							"model-value": ct(e),
							disabled: lt(e),
							"aria-label": `${e.symbol} 开放配置`,
							onChange: (t) => ut(e, t)
						}, null, 8, [
							"model-value",
							"disabled",
							"aria-label",
							"onChange"
						])) : (v(), s("span", dr, "未配置")),
						e.symbol === j.value && Pe.value ? (v(), s("small", fr, "未保存")) : o("", !0)
					], 2))), 128)), !V.value && Ee.value && !Ae.value.length ? (v(), a(T(F), {
						key: 0,
						description: "当前站点没有已授权的预测网格产品",
						"image-size": 56
					})) : o("", !0)])
				]), c("main", pr, [N.value && P.value ? (v(), s("header", mr, [c("div", null, [
					c("h2", null, w(N.value.symbol) + " · 预测网格", 1),
					c("p", hr, "更新时间 " + w(Xe.value), 1),
					je.value || ae.value.length > 1 ? (v(), s("p", gr, "当前站点：" + w(N.value.site_id), 1)) : o("", !0)
				]), c("div", _r, [
					je.value ? (v(), a(T(A), {
						key: 0,
						disabled: !!K.value || U.value,
						onClick: ot
					}, {
						default: E(() => [...n[22] ||= [u("取消新增", -1)]]),
						_: 1
					}, 8, ["disabled"])) : o("", !0),
					d(T(A), { onClick: n[2] ||= (e) => z.value = !0 }, {
						default: E(() => [...n[23] ||= [u("玩法说明", -1)]]),
						_: 1
					}),
					S.value ? (v(), a(T(A), {
						key: 1,
						type: "primary",
						loading: U.value,
						disabled: !Be.value || !Pe.value || Ge.value,
						onClick: ft
					}, {
						default: E(() => [...n[24] ||= [u("保存配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])) : o("", !0)
				])])) : o("", !0), d(gn, {
					loading: H.value && !V.value,
					"hide-content": H.value && !N.value,
					"min-height": "0px",
					class: "grid-config__detail"
				}, {
					default: E(() => [!V.value && !H.value && !N.value && !j.value && !fe.value ? (v(), a(T(F), {
						key: 0,
						description: Me.value ? "请选择币种填写配置，首次保存后保持关闭" : "当前账号暂无已配置的产品"
					}, null, 8, ["description"])) : !V.value && !H.value && !fe.value && Ee.value && !j.value ? (v(), a(T(F), {
						key: 1,
						description: "请选择交易对查看配置"
					})) : N.value && P.value ? (v(), s(r, { key: 2 }, [je.value ? (v(), a(T(k), {
						key: 0,
						title: "请填写参数后保存，首次保存后保持关闭；确认配置后再单独开启。",
						type: "info",
						closable: !1
					})) : o("", !0), c("div", vr, [
						c("article", yr, [n[29] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "网格区间配置"), c("p", { class: "parameter-description" }, "网格区间由平台按币种统一设置，修改后自动用于该币种下的商户交易。")], -1), P.value.layout ? (v(), s(r, { key: 0 }, [d(T(se), {
							"label-position": "top",
							class: "fields limit-fields",
							onSubmit: n[5] ||= O(() => {}, ["prevent"])
						}, {
							default: E(() => [d(T(I), { label: "纵向格子区间（USDT）" }, {
								label: E(() => [n[25] ||= u("纵向格子区间（USDT）", -1), d(yn, {
									label: "纵向格子区间",
									content: "每个格子覆盖的价格区间宽度，最多保留 8 位小数。数值越大，每格覆盖的价格范围越宽；保存时会根据最新标记价检查安全范围。"
								})]),
								default: E(() => [d(En, {
									"input-component": T(e),
									modelValue: P.value.layout.price_band_width,
									"onUpdate:modelValue": n[3] ||= (e) => P.value.layout.price_band_width = e,
									disabled: !Ve.value,
									inputmode: "decimal",
									"aria-label": "纵向格子区间",
									onInput: dt
								}, {
									append: E(() => [...n[26] ||= [u("USDT", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								]), Ge.value ? (v(), s("small", br, "精度不规范，最多保留 8 位小数")) : o("", !0)]),
								_: 1
							}), d(T(I), { label: "横向格子区间（秒）" }, {
								label: E(() => [n[27] ||= u("横向格子区间（秒）", -1), d(yn, {
									label: "横向格子区间",
									content: "每列格子覆盖的时间长度，可填 1 至 10 秒整数；全部列连同起始等待时间不能超过 120 秒。"
								})]),
								default: E(() => [d(En, {
									"input-component": T(e),
									modelValue: P.value.layout.column_duration_seconds,
									"onUpdate:modelValue": n[4] ||= (e) => P.value.layout.column_duration_seconds = e,
									disabled: !Ve.value,
									inputmode: "numeric",
									min: "1",
									max: "10",
									step: "1",
									"aria-label": "横向格子区间",
									onInput: dt
								}, {
									append: E(() => [...n[28] ||= [u("秒", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								])]),
								_: 1
							})]),
							_: 1
						}), N.value.layout?.editable ? o("", !0) : (v(), s("p", xr, w(je.value ? "该币种已有公共网格区间，首次创建将直接沿用。" : "当前账号无法修改该币种全部受影响站点的公共网格区间，仅可查看。"), 1))], 64)) : (v(), a(T(k), {
							key: 1,
							title: "当前接口未返回网格区间，请刷新后重试；暂不支持编辑网格区间。",
							type: "info",
							closable: !1
						}))]),
						P.value.layout ? (v(), s("article", Sr, [
							n[30] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "价格精度"), c("p", { class: "parameter-description" }, "由平台按币种统一设置，保存后用于后续新订单。")], -1),
							d(T(se), {
								"label-position": "top",
								class: "fields odds-fields",
								onSubmit: n[7] ||= O(() => {}, ["prevent"])
							}, {
								default: E(() => [d(T(I), { label: "价格小数位" }, {
									default: E(() => [d(En, {
										"input-component": T(e),
										modelValue: We.value,
										"onUpdate:modelValue": n[6] ||= (e) => We.value = e,
										min: "0",
										max: "8",
										step: "1",
										unit: "位",
										inputmode: "numeric",
										"aria-label": "价格小数位",
										disabled: !Ve.value,
										placeholder: (N.value.layout?.price_decimals ?? 0) > 8 ? `当前 ${N.value.layout.price_decimals} 位` : "请输入 0～8 的整数"
									}, null, 8, [
										"input-component",
										"modelValue",
										"disabled",
										"placeholder"
									])]),
									_: 1
								})]),
								_: 1
							}),
							n[31] ||= c("p", { class: "precision-note" }, "可设置 0～8 位，未配置时默认填入 3 位，保存后生效。按所选位数截断，不四舍五入；0 表示整数，旧订单保留原规则。", -1)
						])) : o("", !0),
						c("article", Cr, [n[41] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "赔率配置"), c("p", { class: "parameter-description" }, "命中概率由标记价、实时波动率及格子的价格和时间边界计算；格子赔率 = 目标返奖率 ÷ 命中概率")], -1), d(T(se), {
							"label-position": "top",
							class: "fields odds-fields",
							onSubmit: n[11] ||= O(() => {}, ["prevent"])
						}, {
							default: E(() => [
								d(T(I), { label: "目标返奖率" }, {
									label: E(() => [n[32] ||= u("目标返奖率", -1), d(yn, {
										label: "目标返奖率",
										content: "例如 97%：命中概率为 20% 时，计算赔率为 4.85x。"
									})]),
									default: E(() => [d(En, {
										"input-component": T(e),
										modelValue: L.value,
										"onUpdate:modelValue": n[8] ||= (e) => L.value = e,
										disabled: !Be.value,
										inputmode: "decimal",
										"aria-label": "目标返奖率",
										onInput: dt
									}, {
										append: E(() => [...n[33] ||= [u("%", -1)]]),
										_: 1
									}, 8, [
										"input-component",
										"modelValue",
										"disabled"
									]), n[34] ||= c("small", null, "例如 97%：命中概率为 20% 时，计算赔率为 4.85x", -1)]),
									_: 1
								}),
								d(T(I), { label: "最低赔率" }, {
									label: E(() => [n[35] ||= u("最低赔率", -1), d(yn, {
										label: "最低赔率",
										content: "当前币种报价允许的最低倍率。"
									})]),
									default: E(() => [d(En, {
										"input-component": T(e),
										modelValue: P.value.min_multiplier,
										"onUpdate:modelValue": n[9] ||= (e) => P.value.min_multiplier = e,
										step: "0.01",
										disabled: !Ke.value,
										inputmode: "decimal",
										"aria-label": "最低赔率",
										onInput: dt
									}, {
										append: E(() => [...n[36] ||= [u("x", -1)]]),
										_: 1
									}, 8, [
										"input-component",
										"modelValue",
										"disabled"
									]), n[37] ||= c("small", null, "计算赔率不会低于此值", -1)]),
									_: 1
								}),
								d(T(I), { label: "最高赔率" }, {
									label: E(() => [n[38] ||= u("最高赔率", -1), d(yn, {
										label: "最高赔率",
										content: "当前币种报价允许的最高倍率。原型中超过此值的格子不可下注，不强制压低赔率；实际是否可下注以当前格子报价为准。"
									})]),
									default: E(() => [d(En, {
										"input-component": T(e),
										modelValue: P.value.max_multiplier,
										"onUpdate:modelValue": n[10] ||= (e) => P.value.max_multiplier = e,
										step: "0.01",
										disabled: !Ke.value,
										inputmode: "decimal",
										"aria-label": "最高赔率",
										onInput: dt
									}, {
										append: E(() => [...n[39] ||= [u("x", -1)]]),
										_: 1
									}, 8, [
										"input-component",
										"modelValue",
										"disabled"
									]), n[40] ||= c("small", null, "超过此值的格子不可下注，不强制压低赔率；以当前格子报价为准", -1)]),
									_: 1
								})
							]),
							_: 1
						})]),
						c("article", wr, [c("header", Tr, [n[42] ||= c("h3", null, "下注限制", -1), c("p", Er, w(N.value.symbol) + " 每个格子生成一笔独立订单，限制作用于该币种全部网格订单", 1)]), d(T(se), {
							"label-position": "top",
							class: "fields limit-fields",
							onSubmit: n[14] ||= O(() => {}, ["prevent"])
						}, {
							default: E(() => [d(T(I), { label: "单笔最小额（USDT）" }, {
								label: E(() => [n[43] ||= u("单笔最小额（USDT）", -1), d(yn, { label: "单笔最小额" })]),
								default: E(() => [d(En, {
									"input-component": T(e),
									modelValue: P.value.min_order_amount,
									"onUpdate:modelValue": n[12] ||= (e) => P.value.min_order_amount = e,
									disabled: !Be.value,
									inputmode: "decimal",
									"aria-label": "单笔最小额",
									onInput: dt
								}, {
									append: E(() => [...n[44] ||= [u("USDT", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								])]),
								_: 1
							}), d(T(I), { label: "单笔最大额（USDT）" }, {
								label: E(() => [n[45] ||= u("单笔最大额（USDT）", -1), d(yn, { label: "单笔最大额" })]),
								default: E(() => [d(En, {
									"input-component": T(e),
									modelValue: P.value.max_order_amount,
									"onUpdate:modelValue": n[13] ||= (e) => P.value.max_order_amount = e,
									disabled: !Be.value,
									inputmode: "decimal",
									"aria-label": "单笔最大额",
									onInput: dt
								}, {
									append: E(() => [...n[46] ||= [u("USDT", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								])]),
								_: 1
							})]),
							_: 1
						})]),
						S.value ? o("", !0) : (v(), a(T(k), {
							key: 1,
							title: "当前账号只有预测网格配置查看权限",
							type: "info",
							closable: !1
						}))
					])], 64)) : o("", !0)]),
					_: 1
				}, 8, ["loading", "hide-content"])])])]),
				_: 1
			}, 8, ["loading", "hide-content"]),
			d($n, {
				modelValue: z.value,
				"onUpdate:modelValue": n[15] ||= (e) => z.value = e
			}, null, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-6fd276a0"]]), Or = [
	[
		"target_rtp",
		"目标返奖率",
		"%"
	],
	[
		"min_multiplier",
		"最低赔率",
		"x"
	],
	[
		"max_multiplier",
		"最高赔率",
		"x"
	],
	[
		"min_order_amount",
		"单笔最小额",
		"USDT"
	],
	[
		"max_order_amount",
		"单笔最大额",
		"USDT"
	]
], kr = /^[A-Z0-9]{2,32}$/, Ar = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function jr(e) {
	if (!e) throw Error("模板参数或版本无效");
}
function Mr(e, t) {
	jr(Ar(e) && Object.keys(e).length === t.length && t.every((t) => Object.hasOwn(e, t)));
}
function Nr(e) {
	return typeof e == "string" && /^(0|[1-9]\d*)$/.test(e) && e.length <= 19 && BigInt(e) <= 9223372036854775807n;
}
function Pr(e) {
	Mr(e, Or.map(([e]) => e));
	let t = {};
	for (let [n] of Or) t[n] = kt(e[n], n.includes("multiplier") ? 2 : n.includes("amount") ? 8 : void 0);
	jr(jt(t.target_rtp, "0") > 0 && jt(t.target_rtp, "1") < 0), jr(jt(t.min_multiplier, "1") >= 0 && jt(t.max_multiplier, t.min_multiplier) >= 0), jr(jt(t.min_order_amount, "0") > 0 && jt(t.max_order_amount, t.min_order_amount) >= 0);
	let n = (e, t) => {
		let [n, r = ""] = e.split(".");
		return BigInt(n + r.padEnd(t, "0"));
	};
	return jr(n(t.max_order_amount, 8) * n(t.max_multiplier, 2) <= 9223372036854775807n * 100n), t;
}
function Fr(e, t) {
	Mr(e, [
		"scope",
		"symbol",
		"global_version",
		"effective_from_ms",
		"parameters",
		"layout"
	]), jr(e.scope === "GLOBAL" && e.symbol === t && kr.test(t) && Nr(e.global_version));
	let n = null;
	if (e.layout !== null) {
		let t = e.layout;
		Mr(t, [
			"version",
			"row_count",
			"column_count",
			"column_duration_seconds",
			"price_band_width",
			"price_decimals"
		]), jr(Nr(t.version) && t.version !== "0" && typeof t.row_count == "string" && typeof t.column_count == "string" && typeof t.column_duration_seconds == "string"), jr(t.price_decimals === null || typeof t.price_decimals == "number" && Number.isInteger(t.price_decimals) && t.price_decimals >= 0 && t.price_decimals <= 18), n = {
			version: t.version,
			row_count: t.row_count,
			column_count: t.column_count,
			column_duration_seconds: t.column_duration_seconds,
			price_band_width: kt(t.price_band_width),
			price_decimals: t.price_decimals
		};
	}
	return e.global_version === "0" ? (jr(e.parameters === null && e.effective_from_ms === null), {
		scope: "GLOBAL",
		symbol: t,
		global_version: "0",
		effective_from_ms: null,
		parameters: null,
		layout: n
	}) : (jr(Nr(e.effective_from_ms) && e.effective_from_ms !== "0" && n !== null), {
		scope: "GLOBAL",
		symbol: t,
		global_version: e.global_version,
		effective_from_ms: e.effective_from_ms,
		parameters: Pr(e.parameters),
		layout: n
	});
}
function Ir(e) {
	let t = [
		"symbol",
		"based_on_global_version",
		"client_request_id",
		"reason",
		"changes"
	];
	if (Ar(e) && "layout" in e) {
		t.push("layout", "based_on_layout_version"), jr(Nr(e.based_on_layout_version) && Ar(e.layout));
		let n = Object.keys(e.layout);
		jr(n.length > 0 && n.every((e) => [
			"price_band_width",
			"column_duration_seconds",
			"price_decimals"
		].includes(e))), e.based_on_layout_version === "0" && jr(n.length === 3), "price_decimals" in e.layout && jr(typeof e.layout.price_decimals == "number" && Number.isInteger(e.layout.price_decimals) && e.layout.price_decimals >= 0 && e.layout.price_decimals <= 8), "column_duration_seconds" in e.layout && jr(typeof e.layout.column_duration_seconds == "string" && /^(?:[1-9]|10)$/.test(e.layout.column_duration_seconds)), "price_band_width" in e.layout && jr(jt(kt(e.layout.price_band_width, 8), "0") > 0);
	}
	Mr(e, t), jr(typeof e.symbol == "string" && kr.test(e.symbol) && Nr(e.based_on_global_version)), jr(typeof e.client_request_id == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(e.client_request_id)), jr(typeof e.reason == "string" && e.reason.trim() && !e.reason.includes("\0") && new TextEncoder().encode(e.reason).length <= 500), Pr(e.changes);
}
function Lr(e, t, n, r) {
	let i = Fr(e, e.symbol), a = Pr(t);
	jr(r || !i.parameters || Or.some(([e]) => i.parameters[e] !== a[e]));
	let o = {
		...r ? {
			based_on_layout_version: i.layout?.version ?? "0",
			layout: r
		} : {},
		symbol: i.symbol,
		based_on_global_version: i.global_version,
		client_request_id: n,
		reason: "更新新建站点的默认网格参数",
		changes: a
	};
	return Ir(o), o;
}
function Rr(e, t) {
	if (!Ar(e) || e.scope !== "GLOBAL" || e.symbol !== t.command.symbol || e.operation_status !== "SUCCEEDED" || !Nr(e.operation_id) || e.operation_id === "0" || !Nr(e.effective_from_ms) || typeof e.changed != "boolean" || !Nr(e.global_version)) return !1;
	let n = BigInt(e.global_version) - BigInt(t.command.based_on_global_version);
	if (n < 0n || n > 1n) return !1;
	let r = 0n;
	return t.command.layout && (!Nr(e.layout_version) || (r = BigInt(e.layout_version) - BigInt(t.command.based_on_layout_version), r < 0n || r > 1n)) ? !1 : e.changed === n + r > 0n && (e.changed ? [
		"PENDING",
		"DONE",
		"NOT_REQUIRED"
	].includes(String(e.cache_state)) : e.cache_state === "NOT_REQUIRED");
}
var zr = ct("grid.config.global.pending.v1", Ir, Rr), Br = {
	class: "grid-config mm-ui",
	"data-grid-config": "platform"
}, Vr = {
	key: 2,
	class: "pending-bar"
}, Hr = { class: "grid-layout" }, Ur = { class: "symbol-panel" }, Wr = { class: "panel-heading" }, Gr = { class: "symbol-list" }, Kr = ["disabled", "onClick"], qr = { class: "symbol-unconfigured" }, Jr = { class: "config-panel" }, Yr = {
	key: 0,
	class: "config-heading"
}, Xr = { class: "config-heading__actions" }, Zr = {
	key: 2,
	class: "grid-config__parameters"
}, Qr = { class: "parameter-card" }, $r = { class: "parameter-card" }, ei = { class: "parameter-heading" }, ti = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "GlobalGridConfig",
	setup(t, { expose: n }) {
		let l = pe().grid, f = l.globalTemplate, p = K(), m = ge(), h = [{
			title: "赔率配置",
			fields: Or.slice(0, 3)
		}, {
			title: "下注限制",
			fields: Or.slice(3)
		}], g = (e) => p.context.permissions.includes("*") || p.context.permissions.includes(e), _ = i(() => p.context.operatorId), ne = i(() => !!p.context.identityKey && /^[1-9]\d*$/.test(_.value) && g("grid_config:read")), y = i(() => ne.value && g("grid_config:save")), x = b([]), S = b(""), ie = b(""), ae = i(() => x.value.filter((e) => e.symbol.includes(ie.value.trim().toUpperCase()))), D = C(null), j = () => ({
			target_rtp: "",
			min_multiplier: "",
			max_multiplier: "",
			min_order_amount: "",
			max_order_amount: ""
		}), M = b(j()), N = b({
			price_band_width: "",
			column_duration_seconds: "",
			price_decimals: "3"
		}), P = b(!1), L = b(!1), R = b(!1), z = b(""), le = b(!1), B = b(!1), ue = C(null), de = (e) => ({
			price_band_width: e.layout?.price_band_width ?? "",
			column_duration_seconds: e.layout?.column_duration_seconds ?? "",
			price_decimals: String(e.layout?.price_decimals ?? 3)
		}), V = i(() => !!D.value && (JSON.stringify(N.value) !== JSON.stringify(de(D.value)) || Or.some(([e]) => M.value[e] !== (D.value?.parameters?.[e] ?? "")))), H = i(() => !y.value || L.value || !!ue.value || B.value), U = 0, fe;
		function W() {
			try {
				let e = zr.pendingForActor(sessionStorage, _.value);
				ue.value = e.pending ?? null, B.value = e.status === "foreign", B.value && (z.value = "请切回原账号核对尚未确认的模板操作。");
			} catch {
				ue.value = null, B.value = !0, z.value = "无法读取待确认操作，请先核对原请求。";
			}
		}
		function G() {
			return U++, fe?.abort(), fe = new AbortController(), U;
		}
		async function me(e) {
			let t = G();
			L.value = !0, R.value = !1, z.value = "", S.value = e, D.value = null;
			try {
				let n = Fr(await f.detail(e, fe.signal), e);
				if (t !== U) return;
				D.value = n, M.value = { ...n.parameters ?? j() }, N.value = de(n);
				let r = x.value.find((t) => t.symbol === e);
				r && (r.configured = n.parameters !== null);
			} catch {
				t === U && (R.value = !0, z.value = "读取平台模板失败，请重试。");
			} finally {
				t === U && (L.value = !1);
			}
		}
		async function he() {
			if (!ne.value || V.value || L.value || (W(), ue.value || B.value)) return;
			let e = G();
			L.value = !0, z.value = "", R.value = !1;
			try {
				let [t, n] = await Promise.all([f.catalog(fe.signal), l.gridConfigSymbols(fe.signal)]);
				if (e !== U) return;
				let r = new Map(t.products.map((e) => [e.symbol, e.configured]));
				x.value = [.../* @__PURE__ */ new Set([...n, ...r.keys()])].filter((e) => /^[A-Z0-9]{2,32}$/.test(e)).map((e) => ({
					symbol: e,
					configured: r.get(e) === !0
				}));
				let i = x.value.find((e) => e.symbol === S.value) ?? x.value[0];
				i && await me(i.symbol);
			} catch {
				e === U && (R.value = !0, z.value = "读取平台币种目录失败，请重试。");
			} finally {
				e === U && (L.value = !1);
			}
		}
		async function ve() {
			if (L.value || ue.value) return !1;
			if (!V.value) return !0;
			try {
				return await ce.confirm("放弃未保存的配置？", "离开配置"), !0;
			} catch {
				return !1;
			}
		}
		async function ye(e) {
			e !== S.value && await ve() && await me(e);
		}
		function be() {
			let e = D.value, t = de(e), n = {};
			for (let r of ["price_band_width", "column_duration_seconds"]) (!e.layout || t[r] !== N.value[r]) && (n[r] = N.value[r]);
			if (!e.layout || t.price_decimals !== N.value.price_decimals) {
				if (!/^[0-8]$/.test(N.value.price_decimals)) throw Error("价格小数位须为 0～8 的整数");
				n.price_decimals = Number(N.value.price_decimals);
			}
			return Object.keys(n).length ? n : void 0;
		}
		async function xe() {
			if (!(H.value || !D.value || !V.value)) {
				try {
					let e = Lr(D.value, M.value, Ft(), be()), t = zr.captureSaveReview(_.value, e);
					ue.value = zr.persistReviewedCommand(sessionStorage, t, _.value, e);
				} catch (e) {
					z.value = e instanceof Error ? e.message : "请核对模板参数";
					return;
				}
				await Se("save");
			}
		}
		async function Se(e) {
			if (W(), L.value || !ue.value || B.value || !y.value) return;
			let t = ue.value, n = U;
			L.value = !0, le.value = !1;
			try {
				let r = await zr.attemptPending(sessionStorage, t, e, (e, t) => e === "save" ? f.save(t) : f.receipt(t));
				if (n !== U) return;
				W(), r.status === "success" || r.status === "rejected" && r.journalCleared ? (L.value = !1, D.value = null, S.value = t.command.symbol, await he(), r.status === "rejected" && (z.value = "保存未生效，请核对最新配置后再提交。")) : (le.value = e === "receipt" && Qt(r.error), z.value = "保存结果待确认，请先查询原操作回执。");
			} catch {
				n === U && (z.value = "保存结果待确认，请先查询原操作回执。");
			} finally {
				n === U && (L.value = !1);
			}
		}
		return oe(() => [
			_.value,
			p.context.identityKey,
			ne.value,
			y.value
		], () => {
			G(), L.value = !1, D.value = null, x.value = [], S.value = "", z.value = "", ue.value = null, B.value = !1, ne.value && he();
		}, {
			immediate: !0,
			flush: "sync"
		}), te(G), _e(ve), n({
			confirmLeave: ve,
			refresh: he
		}), (t, n) => (v(), s("section", Br, [
			z.value ? (v(), a(T(k), {
				key: 0,
				title: z.value,
				type: "warning",
				closable: !1
			}, null, 8, ["title"])) : o("", !0),
			ne.value ? o("", !0) : (v(), a(T(k), {
				key: 1,
				title: "当前账号没有预测网格配置查询权限",
				type: "warning",
				closable: !1
			})),
			ue.value ? (v(), s("div", Vr, [
				c("strong", null, w(ue.value.command.symbol) + " 配置结果待确认", 1),
				d(T(A), {
					disabled: L.value || !y.value,
					onClick: n[0] ||= (e) => Se("receipt")
				}, {
					default: E(() => [...n[11] ||= [u("查询原操作回执", -1)]]),
					_: 1
				}, 8, ["disabled"]),
				le.value ? (v(), a(T(A), {
					key: 0,
					disabled: L.value || !y.value,
					onClick: n[1] ||= (e) => Se("recover")
				}, {
					default: E(() => [...n[12] ||= [u("恢复原请求", -1)]]),
					_: 1
				}, 8, ["disabled"])) : o("", !0)
			])) : o("", !0),
			c("div", Hr, [c("aside", Ur, [
				c("div", Wr, [n[13] ||= c("strong", null, "币种配置", -1), c("span", null, w(ae.value.length) + " 条", 1)]),
				d(T(e), {
					modelValue: ie.value,
					"onUpdate:modelValue": n[2] ||= (e) => ie.value = e,
					clearable: "",
					placeholder: "搜索交易对",
					"aria-label": "搜索交易对"
				}, null, 8, ["modelValue"]),
				c("div", Gr, [(v(!0), s(r, null, re(ae.value, (e) => (v(), s("div", {
					key: e.symbol,
					class: ee(["symbol-row", { active: e.symbol === S.value }])
				}, [c("button", {
					type: "button",
					class: "symbol-button",
					disabled: L.value || !!ue.value,
					onClick: (t) => ye(e.symbol)
				}, [d(T(m), { symbol: e.symbol }, null, 8, ["symbol"])], 8, Kr), c("span", qr, w(e.configured ? "已配置" : "待配置"), 1)], 2))), 128))])
			]), c("main", Jr, [S.value ? (v(), s("header", Yr, [c("div", null, [c("h2", null, w(S.value) + " · 预测网格", 1), n[14] ||= c("p", null, "平台模板", -1)]), c("div", Xr, [d(T(A), { onClick: n[3] ||= (e) => P.value = !0 }, {
				default: E(() => [...n[15] ||= [u("玩法说明", -1)]]),
				_: 1
			}), y.value ? (v(), a(T(A), {
				key: 0,
				type: "primary",
				disabled: H.value || !V.value,
				loading: L.value,
				onClick: xe
			}, {
				default: E(() => [...n[16] ||= [u("保存配置", -1)]]),
				_: 1
			}, 8, ["disabled", "loading"])) : o("", !0)])])) : o("", !0), d(gn, {
				loading: L.value && !D.value,
				"hide-content": L.value && !D.value,
				"min-height": "0px",
				class: "grid-config__detail"
			}, {
				default: E(() => [R.value ? (v(), a(T(A), {
					key: 0,
					disabled: L.value,
					onClick: he
				}, {
					default: E(() => [...n[17] ||= [u("重新加载", -1)]]),
					_: 1
				}, 8, ["disabled"])) : !D.value && !L.value ? (v(), a(T(F), {
					key: 1,
					description: "请选择交易对查看配置"
				})) : o("", !0), D.value ? (v(), s("div", Zr, [
					c("article", Qr, [n[18] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "网格区间配置"), c("p", { class: "parameter-description" }, "该币种的网格区间由平台统一设置。")], -1), d(T(se), {
						class: "fields limit-fields",
						"label-position": "top",
						onSubmit: n[6] ||= O(() => {}, ["prevent"])
					}, {
						default: E(() => [d(T(I), { label: "纵向格子区间" }, {
							default: E(() => [d(En, {
								modelValue: N.value.price_band_width,
								"onUpdate:modelValue": n[4] ||= (e) => N.value.price_band_width = e,
								"input-component": T(e),
								unit: "USDT",
								disabled: H.value
							}, null, 8, [
								"modelValue",
								"input-component",
								"disabled"
							])]),
							_: 1
						}), d(T(I), { label: "横向格子区间" }, {
							default: E(() => [d(En, {
								modelValue: N.value.column_duration_seconds,
								"onUpdate:modelValue": n[5] ||= (e) => N.value.column_duration_seconds = e,
								"input-component": T(e),
								unit: "秒",
								min: "1",
								max: "10",
								disabled: H.value
							}, null, 8, [
								"modelValue",
								"input-component",
								"disabled"
							])]),
							_: 1
						})]),
						_: 1
					})]),
					c("article", $r, [n[19] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "价格精度")], -1), d(T(se), {
						class: "fields limit-fields",
						"label-position": "top",
						onSubmit: n[8] ||= O(() => {}, ["prevent"])
					}, {
						default: E(() => [d(T(I), { label: "价格小数位" }, {
							default: E(() => [d(En, {
								modelValue: N.value.price_decimals,
								"onUpdate:modelValue": n[7] ||= (e) => N.value.price_decimals = e,
								"input-component": T(e),
								unit: "位",
								min: "0",
								max: "8",
								disabled: H.value
							}, null, 8, [
								"modelValue",
								"input-component",
								"disabled"
							])]),
							_: 1
						})]),
						_: 1
					})]),
					(v(), s(r, null, re(h, (t, i) => c("article", {
						key: t.title,
						class: "parameter-card"
					}, [c("header", ei, [c("h3", null, w(t.title), 1)]), d(T(se), {
						class: ee(["fields", i === 0 ? "odds-fields" : "limit-fields"]),
						"label-position": "top",
						onSubmit: n[9] ||= O(() => {}, ["prevent"])
					}, {
						default: E(() => [(v(!0), s(r, null, re(t.fields, ([t, n, r]) => (v(), a(T(I), {
							key: t,
							label: n
						}, {
							default: E(() => [d(En, {
								modelValue: M.value[t],
								"onUpdate:modelValue": (e) => M.value[t] = e,
								"input-component": T(e),
								unit: r,
								percentage: t === "target_rtp",
								step: r === "x" ? "0.01" : "1",
								disabled: H.value
							}, null, 8, [
								"modelValue",
								"onUpdate:modelValue",
								"input-component",
								"unit",
								"percentage",
								"step",
								"disabled"
							])]),
							_: 2
						}, 1032, ["label"]))), 128))]),
						_: 2
					}, 1032, ["class"])])), 64))
				])) : o("", !0)]),
				_: 1
			}, 8, ["loading", "hide-content"])])]),
			d($n, {
				modelValue: P.value,
				"onUpdate:modelValue": n[10] ||= (e) => P.value = e
			}, null, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-b579c14c"]]), ni = { class: "prediction-page prediction-table-page mm-ui" }, ri = { class: "prediction-page__header" }, ii = {
	class: "game-tabs",
	role: "group",
	"aria-label": "选择预测玩法"
}, ai = {
	class: "game-choice-icon",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	"aria-hidden": "true"
}, oi = { class: "game-choice-content" }, si = { key: 0 }, ci = {
	key: 1,
	class: "catalog-error"
}, li = { class: "prediction-page__workspace" }, ui = { class: "symbol-panel__heading" }, di = { class: "symbol-panel__list" }, fi = [
	"aria-pressed",
	"data-config-symbol",
	"disabled",
	"onClick"
], pi = { class: "symbol-choice__top" }, mi = ["title"], hi = {
	key: 1,
	class: "symbol-row__draft"
}, gi = { class: "config-content" }, _i = {
	key: 0,
	class: "config-content__heading"
}, vi = { class: "config-game-label" }, yi = { "data-config-updated-at": "" }, bi = {
	key: 0,
	class: "config-heading-actions"
}, xi = ["title", "aria-label"], Si = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "index",
	setup(t) {
		let { predictionConfigurationList: n } = pe().api, { symbols: l } = pe().api, f = ge(), p = he(), m = b(""), h = b(!1), _ = b([]), y = b("UP_DOWN"), x = b("UP_DOWN"), ie = pe().grid.globalTemplate ? ti : Dr, ae = C(), D = [
			{
				value: "UP_DOWN",
				label: "涨跌预测",
				description: "按系统场次预测结算价格相对开盘价格上涨或下跌"
			},
			{
				value: "HIGH_LOW",
				label: "自选预测",
				description: "用户随时发起独立订单，自选方向及预测周期"
			},
			{
				value: "GRID",
				label: "预测网格",
				description: "纵轴为价格区间、横轴为时间区间，一格生成一笔订单"
			}
		], O = b(""), j = i(() => nt(p.perms, "prediction_config:lists")), M = b(""), N = C(), P = i(() => N.value?.editingState), se = i(() => {
			let e = P.value;
			return !e || e.target !== O.value || e.actor !== String(p.userInfo.id || "") || !j.value || !nt(p.perms, "prediction_config:edit") || e.saving ? null : e.pending ? {
				text: "未保存",
				tone: "warning",
				detail: e.saveError || "结果尚未确认，请核验原操作"
			} : e.saveError ? {
				text: "保存失败",
				tone: "danger",
				detail: e.saveError
			} : e.ready ? e.dirty || e.isNew ? {
				text: "未保存",
				tone: "warning",
				detail: ""
			} : {
				text: "已保存",
				tone: "success",
				detail: ""
			} : null;
		}), I = 0, L = (e) => O.value === e.row_key && P.value?.target === e.row_key ? P.value.enabled ?? e.enabled : e.enabled;
		function R(e) {
			return nt(p.perms, "prediction_config:edit") ? P.value?.pending ? "请先核验待确认的操作" : h.value || P.value?.loading ? "正在加载配置" : O.value !== e.row_key && P.value?.dirty ? "请先处理当前未保存修改" : O.value === e.row_key && !P.value?.ready ? "请重新加载当前配置" : "修改后需保存配置" : "没有配置修改权限";
		}
		function ce(e) {
			let t = P.value;
			return !j.value || !nt(p.perms, "prediction_config:edit") || !e.editable || h.value || !t || t.loading || t.pending || (O.value === e.row_key ? !t.ready || t.target !== e.row_key : t.dirty);
		}
		async function le(e, t) {
			if (typeof t != "boolean" || ce(e)) return;
			let n = String(p.userInfo.id || ""), r = P.value?.generation;
			if (O.value !== e.row_key) {
				let t = await Ae(e);
				if (await g(), !t || t.selection !== I) return;
				r = t.detail;
			}
			r === void 0 || O.value !== e.row_key || ce(e) || N.value?.setEnabled(e.row_key, r, n, t);
		}
		let B = (e) => e === "GAME_TYPE_UP_DOWN" ? "UP_DOWN" : e === "GAME_TYPE_HIGH_LOW" ? "HIGH_LOW" : null, ue = (e) => e === "UP_DOWN" ? "涨跌预测" : e === "HIGH_LOW" ? "自选预测" : "--", H = xe, U = i(() => _.value.map((e, t) => {
			let n = e.rules[0], r = B(n?.game_type) || y.value || null, i = n?.symbol || "";
			return {
				row_key: r && i ? `${r}:${i}` : `empty:${t}`,
				configuration: e,
				game_type: r,
				symbol: i,
				enabled: Ye(e),
				configured: e.rules.length > 0,
				editable: !!(r && i && e.rules.length > 0),
				rule_count: e.rules.length,
				template_version: e.template_version,
				effective_version: e.effective_version,
				updated_at: H(e.updated_at_ms)
			};
		}).sort((e, t) => e.game_type === t.game_type ? e.symbol.localeCompare(t.symbol) : (e.game_type || "").localeCompare(t.game_type || "")));
		function fe(e) {
			let t = e.row_key === P.value?.target && P.value?.ready ? P.value.roomDurations : e.configuration ? Xe(e.configuration) : void 0;
			return t ? t.map((t) => Se(t, e.game_type || void 0)).join(" · ") || "暂无房间" : e.directory_label;
		}
		let W = b([]), G = b(!1), K = b(""), me = (e) => e.trim().toUpperCase(), _e = 0, ve;
		async function ye() {
			if (!j.value) return;
			ve?.abort(), ve = new AbortController();
			let e = ++_e;
			G.value = !0, K.value = "";
			try {
				let t = await l(ve.signal);
				if (e !== _e) return;
				if (!Array.isArray(t)) throw Error("币种目录返回格式不正确");
				let n = /* @__PURE__ */ new Map();
				for (let e of t) {
					if (typeof e != "string") throw Error("币种目录返回格式不正确");
					let t = {
						symbol: e,
						base_asset: "",
						quote_asset: ""
					};
					if (typeof t.symbol != "string" || !t.symbol.trim()) continue;
					let r = me(t.symbol);
					n.has(r) || n.set(r, {
						symbol: r,
						base_asset: typeof t.base_asset == "string" ? t.base_asset : "",
						quote_asset: typeof t.quote_asset == "string" ? t.quote_asset : ""
					});
				}
				W.value = [...n.values()];
			} catch (t) {
				e === _e && (K.value = Ce(t));
			} finally {
				e === _e && (G.value = !1);
			}
		}
		let be = i(() => {
			let e = [...U.value], t = new Set(e.filter((e) => e.game_type === y.value).map((e) => me(e.symbol)));
			for (let n of W.value) t.has(n.symbol) || e.push({
				row_key: `${y.value}:${n.symbol}`,
				configuration: null,
				game_type: y.value,
				symbol: n.symbol,
				enabled: !1,
				configured: !1,
				editable: nt(p.perms, "prediction_config:edit") && !K.value,
				rule_count: 0,
				template_version: "未配置",
				effective_version: "未配置",
				updated_at: "未提供",
				directory_label: [n.base_asset, n.quote_asset].filter(Boolean).join(" / ") || "点击填写配置"
			});
			return Qe(e, W.value.map((e) => e.symbol));
		}), q = i(() => {
			let e = M.value.trim().toUpperCase();
			return be.value.filter((t) => (!y.value || t.game_type === y.value) && (!e || t.symbol.includes(e)));
		}), we = i(() => be.value.find((e) => e.row_key === O.value)), Te = i(() => (h.value || G.value) && !we.value), Ee = 0, De, Oe = async () => {
			if (!nt(p.perms, "prediction_config:lists")) {
				m.value = "没有玩法配置查询权限";
				return;
			}
			m.value = "", De?.abort(), De = new AbortController();
			let e = ++Ee, t = String(p.userInfo.id || "");
			h.value = !0;
			try {
				let r = await n({ game_type: y.value || void 0 }, De.signal);
				if (e !== Ee || t !== String(p.userInfo.id || "") || !j.value) return;
				if (!Array.isArray(r.configurations)) throw Error("配置列表格式异常，请重新加载");
				if (_.value = r.configurations, !be.value.some((e) => e.row_key === O.value && e.editable)) {
					let e = be.value.find((e) => e.configured && e.editable && e.game_type === y.value);
					e ? await Ae(e, !0) : O.value = "";
				}
			} catch (t) {
				e === Ee && (m.value = Ce(t), _.value = []);
			} finally {
				e === Ee && (h.value = !1);
			}
		}, ke = async (e) => {
			if (x.value !== e && !(x.value === "GRID" && ae.value && !await ae.value.confirmLeave())) {
				if (x.value !== "GRID" && (P.value?.dirty || P.value?.pending)) {
					z.warning("请先处理当前未保存修改或待确认操作");
					return;
				}
				if (I++, x.value = e, e === "GRID") {
					O.value = "";
					return;
				}
				y.value = e, O.value = "", M.value = "", _.value = [], Oe(), W.value.length || ye();
			}
		}, Ae = async (e, t = !1) => {
			if (P.value?.saving) {
				z.warning("请先处理当前未保存修改或待确认操作");
				return;
			}
			let n = String(p.userInfo.id || ""), r = ++I;
			if (!(!j.value || !e.editable || h.value && !t || m.value || !e.game_type || !e.symbol || O.value === e.row_key) && (O.value = e.row_key, await g(), !(r !== I || O.value !== e.row_key || n !== String(p.userInfo.id || "") || !j.value))) return {
				selection: r,
				detail: await N.value?.open(e.game_type, e.symbol, t ? e.configuration ?? void 0 : void 0, !e.configured)
			};
		}, je = () => {
			if (x.value === "GRID") {
				ae.value?.refresh();
				return;
			}
			I++, Oe(), ye();
		};
		return oe(() => [
			p.userInfo.id,
			j.value,
			nt(p.perms, "prediction_config:edit")
		], () => {
			I++, Ee++, De?.abort(), h.value = !1;
		}, { flush: "sync" }), ne(je), te(() => {
			I++, Ee++, De?.abort(), _e++, ve?.abort();
		}), (t, n) => (v(), s("section", ni, [
			c("header", ri, [c("div", ii, [(v(), s(r, null, re(D, (e) => d(T(A), {
				key: e.value,
				type: x.value === e.value ? "primary" : void 0,
				"aria-pressed": x.value === e.value,
				"aria-label": e.label,
				onClick: (t) => ke(e.value)
			}, {
				default: E(() => [(v(), s("svg", ai, [e.value === "UP_DOWN" ? (v(), s(r, { key: 0 }, [n[2] ||= c("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}, null, -1), n[3] ||= c("path", { d: "m16 12-4-4-4 4M12 16V8" }, null, -1)], 64)) : e.value === "HIGH_LOW" ? (v(), s(r, { key: 1 }, [n[4] ||= c("path", { d: "m9 9 5 12 1.8-5.2L21 14Z" }, null, -1), n[5] ||= c("path", { d: "M7.2 2.2 8 5.1M5.1 8l-2.9-.8M14 4.1 12 6M6 12l-1.9 2" }, null, -1)], 64)) : (v(), s(r, { key: 2 }, [n[6] ||= c("rect", {
					x: "3",
					y: "3",
					width: "18",
					height: "18",
					rx: "2"
				}, null, -1), n[7] ||= c("path", { d: "M9 3v18M15 3v18M3 9h18M3 15h18" }, null, -1)], 64))])), c("span", oi, [c("strong", null, w(e.label), 1), c("small", null, w(e.description), 1)])]),
				_: 2
			}, 1032, [
				"type",
				"aria-pressed",
				"aria-label",
				"onClick"
			])), 64))])]),
			x.value !== "GRID" && m.value ? (v(), s("div", si, [d(T(k), {
				title: m.value,
				type: "error",
				closable: !1
			}, null, 8, ["title"]), d(T(A), {
				loading: h.value,
				onClick: je
			}, {
				default: E(() => [...n[8] ||= [u("重试", -1)]]),
				_: 1
			}, 8, ["loading"])])) : o("", !0),
			x.value !== "GRID" && K.value ? (v(), s("div", ci, [d(T(k), {
				title: `币种目录加载失败：${K.value}`,
				type: "warning",
				closable: !1
			}, null, 8, ["title"]), d(T(A), {
				"aria-label": "重试币种目录",
				loading: G.value,
				onClick: ye
			}, {
				default: E(() => [...n[9] ||= [u("重试币种目录", -1)]]),
				_: 1
			}, 8, ["loading"])])) : o("", !0),
			x.value !== "GRID" && j.value ? (v(), a(gn, {
				key: 2,
				class: "prediction-page__loading-workspace",
				loading: Te.value,
				"hide-content": Te.value,
				"min-height": "0px"
			}, {
				default: E(() => [c("div", li, [d(gn, {
					as: "aside",
					loading: (h.value || G.value) && !Te.value,
					"min-height": "0px",
					class: "symbol-panel",
					"aria-label": "交易对配置列表"
				}, {
					default: E(() => [
						c("div", ui, [n[10] ||= c("strong", null, "币种配置", -1), c("span", null, w(q.value.length) + " 条", 1)]),
						d(T(e), {
							modelValue: M.value,
							"onUpdate:modelValue": n[0] ||= (e) => M.value = e,
							clearable: "",
							placeholder: "搜索交易对",
							"aria-label": "搜索交易对"
						}, null, 8, ["modelValue"]),
						c("div", di, [(v(!0), s(r, null, re(q.value, (e) => (v(), s("div", {
							key: e.row_key,
							class: ee(["symbol-row", { "is-active": O.value === e.row_key }])
						}, [
							c("button", {
								type: "button",
								class: "symbol-choice",
								"aria-pressed": O.value === e.row_key,
								"data-config-symbol": e.symbol,
								disabled: !e.editable || h.value || !!m.value,
								onClick: (t) => Ae(e)
							}, [c("span", pi, [d(T(f), { symbol: e.symbol }, null, 8, ["symbol"]), e.configured ? o("", !0) : (v(), a(T(V), {
								key: 0,
								size: "small",
								type: "info"
							}, {
								default: E(() => [...n[11] ||= [u("待首次配置", -1)]]),
								_: 1
							}))]), c("span", {
								class: "symbol-choice__periods",
								title: fe(e)
							}, w(fe(e)), 9, mi)], 8, fi),
							e.configured ? (v(), a(T(de), {
								key: 0,
								"data-config-enabled": e.symbol,
								"aria-label": `${e.symbol} 开放配置`,
								"model-value": L(e),
								disabled: ce(e),
								title: R(e),
								onChange: (t) => le(e, t)
							}, null, 8, [
								"data-config-enabled",
								"aria-label",
								"model-value",
								"disabled",
								"title",
								"onChange"
							])) : o("", !0),
							O.value === e.row_key && P.value?.dirty ? (v(), s("span", hi, "未保存")) : o("", !0)
						], 2))), 128)), !h.value && !G.value && !m.value && !K.value && !q.value.length ? (v(), a(T(F), {
							key: 0,
							description: "暂无符合条件的交易对",
							"image-size": 56
						})) : o("", !0)])
					]),
					_: 1
				}, 8, ["loading"]), c("main", gi, [we.value ? (v(), s("div", _i, [c("div", null, [c("h2", null, [u(w(we.value.symbol) + " ", 1), c("span", vi, " · " + w(ue(we.value.game_type)), 1)]), c("p", yi, "更新时间 " + w(we.value.updated_at), 1)]), T(nt)(T(p).perms, "prediction_config:edit") ? (v(), s("div", bi, [se.value ? (v(), s("span", {
					key: 0,
					"data-config-save-feedback": "",
					class: ee(["config-save-feedback", `config-save-feedback--${se.value.tone}`]),
					role: "status",
					title: se.value.detail || void 0,
					"aria-label": se.value.detail ? `${se.value.text}：${se.value.detail}` : void 0
				}, w(se.value.text), 11, xi)) : o("", !0), d(T(A), {
					type: "primary",
					loading: P.value?.saving,
					disabled: !P.value || P.value.saving || !P.value.pending && !P.value.ready,
					onClick: n[1] ||= (e) => N.value?.saveConfig()
				}, {
					default: E(() => [u(w(P.value?.pending ? "核验原操作" : "保存配置"), 1)]),
					_: 1
				}, 8, ["loading", "disabled"])])) : o("", !0)])) : o("", !0), O.value ? (v(), a(Jn, {
					key: 1,
					ref_key: "editRef",
					ref: N,
					inline: "",
					"external-save": "",
					onSuccess: Oe
				}, null, 512)) : !h.value && !G.value && !m.value ? (v(), a(T(F), {
					key: 2,
					description: "请选择交易对查看配置"
				})) : o("", !0)])])]),
				_: 1
			}, 8, ["loading", "hide-content"])) : x.value === "GRID" ? (v(), a(S(T(ie)), {
				key: 3,
				ref_key: "gridRef",
				ref: ae,
				class: "grid-mode"
			}, null, 512)) : o("", !0)
		]));
	}
}), [["__scopeId", "data-v-71ea0cb7"]]), Ci = 9223372036854775807n;
function wi(e) {
	return e == null ? "—" : typeof e == "object" ? JSON.stringify(e) : String(e);
}
function Y(e, t = !1) {
	return typeof e == "string" && /^(0|[1-9][0-9]*)$/.test(e) && e.length <= 19 && BigInt(e) <= Ci && (!t || e !== "0");
}
function Ti(e) {
	return typeof e == "number" ? Number.isSafeInteger(e) && e > 0 ? String(e) : null : Y(e, !0) ? e : null;
}
function Ei(e) {
	return typeof e == "string" && e.length <= 256 && /^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(e);
}
function Di(e, t) {
	if (!Ei(e) || !Ei(t)) throw Error("INVALID_DECIMAL");
	let [n, r = ""] = e.split("."), [i, a = ""] = t.split("."), o = Math.max(r.length, a.length), s = BigInt(n + r.padEnd(o, "0")), c = BigInt(i + a.padEnd(o, "0"));
	return s === c ? 0 : s > c ? 1 : -1;
}
function Oi(e) {
	if (!Y(e) || BigInt(e) > 8640000000000000n) return e == null ? "—" : wi(e);
	let t = new Date(Number(e));
	return Number.isNaN(t.getTime()) ? wi(e) : t.toLocaleString();
}
function X(e, t = 64, n = !1) {
	return typeof e == "string" && e.length > 0 && [...e].length <= t && e.trim() === e && !/[\u0000-\u001f\u007f]/.test(e) && (!n || /^[A-Z0-9][A-Z0-9._-]*$/.test(e));
}
//#endregion
//#region src/prediction-config/agent/utils/decimal.ts
var ki = /^([+-]?)(\d*)(?:\.(\d*))?$/, Ai = /^([+-]?)(\d*\.?\d+)[eE]([+-]?\d+)$/, ji = 1e3;
function Mi(e) {
	if (!/[eE]/.test(e)) return e;
	let t = e.match(Ai);
	if (!t) return null;
	let [, n, r, i] = t, a = Number(i);
	if (!Number.isSafeInteger(a) || Math.abs(a) > ji) return null;
	let [o = "", s = ""] = r.split("."), c = `${o}${s}`, l = o.length + a;
	return l <= 0 ? `${n}0.${"0".repeat(Math.abs(l))}${c}` : l >= c.length ? `${n}${c}${"0".repeat(l - c.length)}` : `${n}${c.slice(0, l)}.${c.slice(l)}`;
}
function Ni(e) {
	if (e == null || e === "") return null;
	let t = Mi(String(e).trim().replace(/,/g, ""));
	if (t == null) return null;
	let n = t.match(ki);
	if (!n || !n[2] && !n[3]) return null;
	let [, r, i = "", a = ""] = n, o = i.replace(/^0+(?=\d)/, "") || "0", s = a.replace(/0+$/, ""), c = s ? `${o}.${s}` : o;
	return /^0(?:\.0*)?$/.test(c) ? "0" : r === "-" ? `-${c}` : c;
}
//#endregion
//#region src/prediction-config/agent/views/prediction/game-config/site-model.ts
var Pi = (e) => e.stored.game_type === "GAME_TYPE_HIGH_LOW" ? "HIGH_LOW" : "UP_DOWN", Fi = [
	"35",
	"40",
	"45",
	"60",
	"90"
], Z = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Q(e, t = "INVALID_SITE_CONFIGURATION") {
	if (!e) throw Error(t);
}
function Ii(e) {
	if (e && typeof e == "object") {
		Object.freeze(e);
		for (let t of Object.values(e)) Ii(t);
	}
	return e;
}
function Li(e = globalThis.crypto) {
	Q(e && typeof e.getRandomValues == "function", "SECURE_RANDOM_UNAVAILABLE");
	let t = e.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	Q(t instanceof Uint8Array && t.length === 16, "SECURE_RANDOM_UNAVAILABLE"), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0")).join("");
	return `${n.slice(0, 8)}-${n.slice(8, 12)}-${n.slice(12, 16)}-${n.slice(16, 20)}-${n.slice(20)}`;
}
function Ri(e) {
	Q(Z(e) && Ti(e.operator_id) === e.operator_id && Ti(e.agent_id) === e.agent_id, "IDENTITY_UNCONFIRMED");
}
function zi(e) {
	Q(Z(e)), Ri(e.actor), Q(Array.isArray(e.sites) && e.sites.length <= 100);
	let t = /* @__PURE__ */ new Set();
	for (let n of e.sites) {
		Q(Z(n) && X(n.site_id, 128) && !t.has(n.site_id) && Array.isArray(n.games)), t.add(n.site_id), Q(n.games.length > 0 && n.games.length <= 2);
		let e = /* @__PURE__ */ new Set();
		for (let t of n.games) Q(Z(t) && ["UP_DOWN", "HIGH_LOW"].includes(String(t.game_type)) && !e.has(t.game_type) && Array.isArray(t.symbols) && t.symbols.length <= 100 && t.symbols.every((e) => X(e, 64, !0)) && new Set(t.symbols).size === t.symbols.length), e.add(t.game_type);
	}
}
function Bi(e, t) {
	Q(Object.keys(e).every((e) => t.includes(e)));
}
function Vi(e) {
	Q(Z(e) && X(e.site_id, 128) && ["GAME_TYPE_UP_DOWN", "GAME_TYPE_HIGH_LOW"].includes(String(e.game_type)) && X(e.symbol, 64, !0)), Q(Y(e.version, !0) && Y(e.based_on_public_version, !0) && typeof e.enabled == "boolean" && Array.isArray(e.overrides));
	let t = e.game_type === "GAME_TYPE_UP_DOWN";
	Q(e.overrides.length <= (t ? 5 : 100) && new Set(e.overrides.map((e) => e.duration_seconds)).size === e.overrides.length);
	for (let n of e.overrides) {
		Q(Z(n)), Bi(n, [
			"game_type",
			"symbol",
			"duration_seconds",
			"enabled",
			"stake_tiers",
			...t ? [] : [
				"fixed_odds",
				"minimum_stake",
				"maximum_stake"
			]
		]), Q(n.game_type === e.game_type && n.symbol === e.symbol && (t ? Fi.includes(String(n.duration_seconds)) : Y(n.duration_seconds, !0))), Q(!Object.hasOwn(n, "enabled") || typeof n.enabled == "boolean"), Q(Array.isArray(n.stake_tiers) && n.stake_tiers.length <= +!!t), t || Ui(n);
		for (let e of n.stake_tiers) Q(Z(e)), Bi(e, [
			"stake_tier_id",
			"enabled",
			"maximum_stake"
		]), Q(X(e.stake_tier_id) && (!Object.hasOwn(e, "enabled") || typeof e.enabled == "boolean") && (!Object.hasOwn(e, "maximum_stake") || Ei(e.maximum_stake)));
	}
}
function Hi(e, t, n, r) {
	Q(Z(e)), Vi(e.stored);
	let i = e.stored, a = e.effective;
	Q(i.site_id === t && i.symbol === n && Z(a) && (!r || i.game_type === "GAME_TYPE_" + r));
	let o = i.game_type === "GAME_TYPE_UP_DOWN";
	Q(a.site_id === t && a.symbol === n && a.game_type === i.game_type), Q(Y(a.public_version, !0) && a.site_version === i.version && a.based_on_public_version === i.based_on_public_version && typeof a.enabled == "boolean"), Q(Array.isArray(a.rules) && (o ? a.rules.length === 5 : a.rules.length > 0 && a.rules.length <= 100) && new Set(a.rules.map((e) => e.duration_seconds)).size === a.rules.length);
	let s = a.rules;
	for (let e of s) {
		if (Q(Z(e) && e.game_type === i.game_type && e.symbol === n && (o ? Fi.includes(String(e.duration_seconds)) : Y(e.duration_seconds, !0)) && typeof e.enabled == "boolean"), Q(Array.isArray(e.stake_tiers)), !o) {
			Q(e.stake_tiers.length === 0), Ui(e, !0);
			continue;
		}
		Q(e.bet_open_seconds === "30"), Q(e.stake_tiers.every((e) => Z(e) && X(e.stake_tier_id) && typeof e.enabled == "boolean" && typeof e.retired == "boolean"));
		let t = e.stake_tiers.filter((e) => !e.retired);
		Q(t.length === 1 && t[0].minimum_stake === "1" && Ei(t[0].maximum_stake));
		let r = i.overrides.find((t) => t.duration_seconds === e.duration_seconds);
		Q(!r?.stake_tiers.length || r.stake_tiers[0].stake_tier_id === t[0].stake_tier_id);
	}
	a.public_version === i.based_on_public_version && Q(i.overrides.every((e) => s.some((t) => t.duration_seconds === e.duration_seconds))), Q(Array.isArray(e.adjustments));
}
function Ui(e, t = !1) {
	for (let n of [
		"fixed_odds",
		"minimum_stake",
		"maximum_stake"
	]) (t || Object.hasOwn(e, n)) && Q(Ei(e[n]) && Di(e[n], n === "fixed_odds" ? "1" : "0") > 0);
	e.minimum_stake !== void 0 && e.maximum_stake !== void 0 && Q(Di(e.minimum_stake, e.maximum_stake) <= 0);
}
function Wi(e) {
	return Hi(e, e.stored.site_id, e.stored.symbol), Pi(e) === "HIGH_LOW" ? [...e.effective.rules].sort((e, t) => BigInt(e.duration_seconds) < BigInt(t.duration_seconds) ? -1 : 1).map((t) => {
		let n = e.stored.overrides.find((e) => e.duration_seconds === t.duration_seconds);
		return {
			duration_seconds: t.duration_seconds,
			observation_seconds: t.duration_seconds,
			stake_tier_id: "",
			enabled: n?.enabled ?? t.enabled,
			fixed_odds: n?.fixed_odds ?? t.fixed_odds,
			minimum_stake: n?.minimum_stake ?? t.minimum_stake,
			maximum_stake: n?.maximum_stake ?? t.maximum_stake,
			effective_fixed_odds: t.fixed_odds,
			effective_minimum: t.minimum_stake,
			effective_maximum: t.maximum_stake,
			effective_enabled: t.enabled,
			inherited_enabled: n?.enabled === void 0,
			editable: !0
		};
	}) : Fi.map((t) => {
		let n = e.effective.rules.find((e) => e.duration_seconds === t), r = n.stake_tiers.find((e) => !e.retired), i = e.stored.overrides.find((e) => e.duration_seconds === t), a = i?.stake_tiers[0];
		return {
			duration_seconds: t,
			observation_seconds: String(Number(t) - 30),
			stake_tier_id: r.stake_tier_id,
			enabled: (i?.enabled ?? n.enabled) && (a?.enabled ?? r.enabled),
			maximum_stake: a?.maximum_stake ?? r.maximum_stake,
			effective_maximum: r.maximum_stake,
			effective_enabled: n.enabled && r.enabled,
			inherited_enabled: i?.enabled === void 0 || a?.enabled === void 0,
			editable: !0
		};
	});
}
function Gi(e, t, n, r, i) {
	let a = Wi(e);
	Q(typeof n == "boolean" && X(r, 500) && X(i, 128), "INVALID_REASON"), Q(t.length === a.length && new Set(t.map((e) => e.duration_seconds)).size === a.length);
	let o = Pi(e), s = a.map((n) => {
		let r = t.find((e) => e.duration_seconds === n.duration_seconds);
		Q(r && r.stake_tier_id === n.stake_tier_id && typeof r.enabled == "boolean");
		let i = e.stored.overrides.find((e) => e.duration_seconds === n.duration_seconds);
		if (o === "HIGH_LOW") {
			Ui(r, !0), Q(Di(r.fixed_odds, "2") < 0, "INVALID_ODDS");
			let e = { duration_seconds: n.duration_seconds };
			i ? i.enabled !== void 0 && (e.enabled = i.enabled) : e.enabled = r.enabled, r.enabled !== n.enabled && (e.enabled = r.enabled);
			for (let t of [
				"fixed_odds",
				"minimum_stake",
				"maximum_stake"
			]) i?.[t] !== void 0 && (e[t] = i[t]), r[t] !== n[t] && (e[t] = r[t]);
			return e;
		}
		Q(Ei(r.maximum_stake) && Di(r.maximum_stake, "1") >= 0, "INVALID_MAXIMUM");
		let a = { ...i?.stake_tiers[0] ?? { stake_tier_id: n.stake_tier_id } }, s = {
			duration_seconds: n.duration_seconds,
			...i?.enabled === void 0 ? {} : { enabled: i.enabled },
			stake_tiers: [a]
		};
		return r.enabled !== n.enabled && (s.enabled = r.enabled, a.enabled = r.enabled), r.maximum_stake !== n.maximum_stake && (a.maximum_stake = r.maximum_stake), s;
	});
	return Ii({
		site_id: e.stored.site_id,
		game_type: o,
		symbol: e.stored.symbol,
		client_request_id: i,
		reason: r,
		based_on_public_version: e.effective.public_version,
		based_on_site_version: e.stored.version,
		enabled: n,
		overrides: s
	});
}
var Ki = class {
	generation = 0;
	next(e) {
		let t = ++this.generation, n = JSON.stringify(e);
		return { current: (e) => t === this.generation && !!e && JSON.stringify(e) === n };
	}
	close() {
		this.generation++;
	}
};
//#endregion
//#region src/prediction-config/agent/views/prediction/game-config/owner-model.ts
function qi(e) {
	return e.stake_tiers.find((e) => !e.retired);
}
function Ji(e) {
	return e?.kind !== void 0 || e?.config_site_id !== void 0;
}
function Yi(e) {
	return Y(e?.operator_id, !0) ? Ji(e) ? Y(e.config_site_id) ? e.kind === "SITE" ? e.agent_id === "0" && Y(e.config_site_id, !0) : e.kind === "MERCHANT" && Y(e.agent_id, !0) && e.operator_id === e.agent_id : !1 : e.operator_id === e.agent_id : !1;
}
var Xi = (e) => typeof e == "string" && /^(0|[1-9][0-9]{0,17})(\.[0-9]{1,18})?$/.test(e) && Di(e, "0") > 0;
function Zi(e, t, n, r) {
	return [
		e,
		t,
		n,
		r
	].every(Xi) && Di(e, n) <= 0 && Di(n, r) <= 0 && Di(r, t) <= 0;
}
function Qi(e, t) {
	Q(Yi(t), "IDENTITY_UNCONFIRMED"), Q(Z(e) && e.owner_agent_id === t.agent_id && ["GAME_TYPE_UP_DOWN", "GAME_TYPE_HIGH_LOW"].includes(String(e.game_type)) && X(e.symbol, 64, !0), "INVALID_OWNER_CONFIGURATION"), Q(Y(e.public_version, !0) && Y(e.owner_revision) && Array.isArray(e.rules) && e.rules.length > 0 && e.rules.length <= 100);
	let n = Ji(t);
	Q(e.config_model === "SCOPED_OWNER_V1" === n, "CONFIGURATION_MODEL_MISMATCH"), n && (Q(e.config_site_id === t.config_site_id && Y(e.revision, !0) && Y(e.site_revision), "IDENTITY_UNCONFIRMED"), Q(e.revision === (t.kind === "SITE" ? e.site_revision : e.owner_revision)), Q(t.kind !== "SITE" || e.owner_revision === "0"), Q(t.config_site_id !== "0" || e.site_revision === "0"), Q(typeof e.effective_enabled == "boolean" && typeof e.can_enable == "boolean" && ["", "PARENT_CONSTRAINT_CHANGED"].includes(String(e.blocked_reason))), Q(e.can_enable === (e.blocked_reason === "" && e.platform_enabled)));
	let r = n && e.blocked_reason === "PARENT_CONSTRAINT_CHANGED";
	Q(typeof e.enabled == "boolean" && typeof e.platform_enabled == "boolean");
	let i = e.game_type === "GAME_TYPE_UP_DOWN", a = /* @__PURE__ */ new Set();
	i && Q(e.rules.length === 5);
	for (let t of e.rules) {
		Q(Z(t) && Z(t.rule) && Y(t.rule_epoch, !0) && typeof t.custom == "boolean");
		let n = t.rule;
		Q(typeof t.platform_enabled == "boolean" && typeof t.owner_enabled == "boolean" && n.enabled === (!r && e.enabled && t.platform_enabled && t.owner_enabled)), Q(i ? Xi(t.platform_target_payout_rate) && Xi(t.platform_maximum_odds) && t.platform_fixed_odds === "" && Xi(n.target_payout_rate) && Xi(n.maximum_odds) && (r || Di(n.target_payout_rate, t.platform_target_payout_rate) <= 0) && Di(n.target_payout_rate, "1") <= 0 && (r || Di(n.maximum_odds, t.platform_maximum_odds) <= 0) && Di(n.maximum_odds, "1") >= 0 : Xi(t.platform_fixed_odds) && t.platform_target_payout_rate === "" && t.platform_maximum_odds === "" && Xi(n.fixed_odds) && Di(n.fixed_odds, "1") > 0 && (r || Di(n.fixed_odds, t.platform_fixed_odds) <= 0)), Q(n.game_type === e.game_type && n.symbol === e.symbol && Y(n.duration_seconds, !0) && !a.has(n.duration_seconds) && typeof n.enabled == "boolean" && Array.isArray(n.stake_tiers)), a.add(n.duration_seconds);
		let o = n;
		if (i) {
			Q(Fi.includes(n.duration_seconds) && n.bet_open_seconds === "30");
			let e = /* @__PURE__ */ new Set(), t = n.stake_tiers.filter((t) => (Q(Z(t) && X(t.stake_tier_id) && !e.has(t.stake_tier_id) && typeof t.retired == "boolean" && typeof t.enabled == "boolean"), e.add(t.stake_tier_id), !t.retired));
			Q(t.length === 1), o = t[0], Q(Z(o) && X(o.stake_tier_id) && typeof o.enabled == "boolean" && o.retired === !1), Q(Ei(n.target_payout_rate) && Ei(n.minimum_odds) && Ei(n.maximum_odds));
		} else Q(n.stake_tiers.length === 0 && Ei(n.fixed_odds));
		Q(Xi(t.platform_minimum_stake) && Xi(t.platform_maximum_stake) && Xi(o.minimum_stake) && Xi(o.maximum_stake) && Di(o.minimum_stake, o.maximum_stake) <= 0), Q(r || Zi(t.platform_minimum_stake, t.platform_maximum_stake, o.minimum_stake, o.maximum_stake));
	}
	n && Q(e.effective_enabled === e.rules.some((e) => e.rule.enabled));
}
function $i(e, t) {
	Qi(e, t);
	let n = e.game_type === "GAME_TYPE_UP_DOWN";
	return e.rules.map((e) => {
		let t = e.rule, r = n ? qi(t) : t;
		return {
			owner_enabled: e.owner_enabled,
			platform_enabled: e.platform_enabled,
			target_payout_rate: t.target_payout_rate,
			maximum_odds: t.maximum_odds,
			fixed_odds: t.fixed_odds,
			minimum_odds: t.minimum_odds,
			platform_target_payout_rate: e.platform_target_payout_rate,
			platform_maximum_odds: e.platform_maximum_odds,
			platform_fixed_odds: e.platform_fixed_odds,
			duration_seconds: t.duration_seconds,
			observation_seconds: n ? String(BigInt(t.duration_seconds) - 30n) : t.duration_seconds,
			stake_tier_id: n ? qi(t).stake_tier_id : "",
			based_rule_epoch: e.rule_epoch,
			minimum_stake: r.minimum_stake,
			maximum_stake: r.maximum_stake,
			platform_minimum: e.platform_minimum_stake,
			platform_maximum: e.platform_maximum_stake,
			enabled: t.enabled && (!n || qi(t).enabled),
			odds: n ? `${t.minimum_odds} ~ ${t.maximum_odds}` : t.fixed_odds,
			custom: e.custom
		};
	});
}
function ea(e, t, n, r, i, a = e.enabled) {
	let o = $i(e, t);
	Q(n.length === o.length && new Set(n.map((e) => e.duration_seconds)).size === o.length);
	let s = Ji(t) && e.enabled && a === !1 && o.every((e) => {
		let t = n.find((t) => t.duration_seconds === e.duration_seconds);
		return t && [
			"stake_tier_id",
			"based_rule_epoch",
			"minimum_stake",
			"maximum_stake",
			"owner_enabled",
			"target_payout_rate",
			"maximum_odds",
			"fixed_odds"
		].every((n) => t[n] === e[n]);
	});
	Q(X(r, 500) && X(i, 128), "INVALID_REASON");
	let c = [];
	for (let t of o) {
		let r = n.find((e) => e.duration_seconds === t.duration_seconds);
		Q(r && r.stake_tier_id === t.stake_tier_id && r.based_rule_epoch === t.based_rule_epoch && (s || Zi(t.platform_minimum, t.platform_maximum, r.minimum_stake, r.maximum_stake)), "INVALID_LIMITS"), Q(typeof r.owner_enabled == "boolean" && (r.owner_enabled === t.owner_enabled || !r.owner_enabled || t.platform_enabled), "PLATFORM_DISABLED");
		let i = e.game_type === "GAME_TYPE_UP_DOWN", a = i ? ["target_payout_rate", "maximum_odds"] : ["fixed_odds"];
		for (let e of a) Q(Xi(r[e]) && (s || Di(r[e], t[`platform_${e}`]) <= 0), "INVALID_ODDS");
		Q(i ? Di(r.target_payout_rate, "1") < 0 && Di(r.maximum_odds, "1") >= 0 : Di(r.fixed_odds, "1") > 0 && Di(r.fixed_odds, "2") < 0, "INVALID_ODDS");
		let o = Di(r.minimum_stake, t.minimum_stake) !== 0 || Di(r.maximum_stake, t.maximum_stake) !== 0, l = a.some((e) => Di(r[e], t[e]) !== 0), u = r.owner_enabled !== t.owner_enabled;
		if (o || l || u) {
			let e = {
				duration_seconds: t.duration_seconds,
				stake_tier_id: t.stake_tier_id,
				based_rule_epoch: t.based_rule_epoch,
				minimum_stake: Ni(r.minimum_stake),
				maximum_stake: Ni(r.maximum_stake)
			};
			if (u && (e.enabled = r.owner_enabled), l) for (let t of a) e[t] = Ni(r[t]);
			c.push(e);
		}
	}
	return Q(typeof a == "boolean" && (a === e.enabled || !a || (Ji(t) ? e.can_enable : e.platform_enabled)), "PLATFORM_DISABLED"), Q(c.length > 0 || a !== e.enabled, "NO_CHANGES"), {
		...a === e.enabled ? {} : { enabled: a },
		game_type: e.game_type === "GAME_TYPE_UP_DOWN" ? "UP_DOWN" : "HIGH_LOW",
		symbol: e.symbol,
		based_owner_revision: Ji(t) ? e.revision : e.owner_revision,
		changes: c,
		client_request_id: i,
		reason: r
	};
}
var ta = class {
	generation = 0;
	begin(e, t, n) {
		return {
			generation: ++this.generation,
			operator: e.operator_id,
			owner: e.agent_id,
			site: e.config_site_id,
			kind: e.kind,
			game: t,
			symbol: n
		};
	}
	close() {
		this.generation++;
	}
	current(e, t, n, r) {
		return e.generation === this.generation && e.operator === t.operator_id && e.owner === t.agent_id && e.site === t.config_site_id && e.kind === t.kind && e.game === n && e.symbol === r;
	}
}, na = [
	"35",
	"40",
	"45",
	"60",
	"90"
], ra = "prediction.agent.pending.v1", ia = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function aa(e, t = "INVALID_CONFIGURATION") {
	if (!e) throw Error(t);
}
function oa(e) {
	aa(ia(e)), aa(e.scope === "CONFIG_SCOPE_AGENT" && Ti(e.agent_id) === e.agent_id), aa(Y(e.template_version) && Y(e.agent_version) && X(e.effective_version, 256) && Y(e.updated_at_ms)), aa(Array.isArray(e.rules) && e.rules.length === 5);
	let t = e.rules, n = t[0]?.symbol;
	aa(X(n, 64, !0)), aa(new Set(t.map((e) => e.duration_seconds)).size === 5);
	for (let e of t) aa(ia(e) && e.game_type === "GAME_TYPE_UP_DOWN" && e.symbol === n && na.includes(e.duration_seconds) && typeof e.enabled == "boolean"), aa(Array.isArray(e.stake_tiers) && e.stake_tiers.every((e) => ia(e) && X(e.stake_tier_id) && typeof e.enabled == "boolean" && typeof e.retired == "boolean"));
}
function sa(e) {
	return oa(e), e.rules[0].symbol;
}
function ca(e, t) {
	aa(Object.keys(e).length === t.length && Object.keys(e).every((e) => t.includes(e)), "PENDING_CORRUPT");
}
function la(e) {
	aa(ia(e), "PENDING_CORRUPT"), ca(e, [
		"client_request_id",
		"reason",
		"based_on_template_version",
		"based_on_agent_version",
		"game_type",
		"symbol",
		"agent_override"
	]), aa(X(e.client_request_id, 128) && X(e.reason, 500) && Y(e.based_on_template_version) && Y(e.based_on_agent_version) && e.game_type === "UP_DOWN" && X(e.symbol, 64, !0), "PENDING_CORRUPT");
	let t = e.agent_override;
	aa(ia(t), "PENDING_CORRUPT"), ca(t, ["enabled", "overrides"]), aa(typeof t.enabled == "boolean" && Array.isArray(t.overrides) && t.overrides.length === 5, "PENDING_CORRUPT");
	let n = t.overrides;
	aa(new Set(n.map((e) => e.duration_seconds)).size === 5, "PENDING_CORRUPT");
	for (let e of n) {
		aa(ia(e), "PENDING_CORRUPT"), ca(e, [
			"duration_seconds",
			"enabled",
			"stake_tiers"
		]), aa(na.includes(e.duration_seconds) && typeof e.enabled == "boolean" && Array.isArray(e.stake_tiers) && e.stake_tiers.length === 1, "PENDING_CORRUPT");
		let t = e.stake_tiers[0];
		aa(ia(t), "PENDING_CORRUPT"), ca(t, [
			"stake_tier_id",
			"enabled",
			"maximum_stake"
		]), aa(X(t.stake_tier_id) && t.enabled === e.enabled && Ei(t.maximum_stake) && Di(t.maximum_stake, "1") >= 0, "PENDING_CORRUPT");
	}
	aa(t.enabled === n.some((e) => e.enabled), "PENDING_CORRUPT");
}
function ua(e) {
	if (e && typeof e == "object") {
		Object.freeze(e);
		for (let t of Object.values(e)) ua(t);
	}
	return e;
}
function da(e) {
	let t = e.getItem(ra);
	if (t === null) return null;
	aa(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return aa(ia(n), "PENDING_CORRUPT"), ca(n, [
		"schema",
		"operator_id",
		"agent_id",
		"body",
		"attempted",
		"attempt"
	]), aa(n.schema === 1 && Ti(n.operator_id) === n.operator_id && Ti(n.agent_id) === n.agent_id && typeof n.attempted == "boolean" && Number.isSafeInteger(n.attempt) && Number(n.attempt) >= 0 && n.attempted === Number(n.attempt) > 0, "PENDING_CORRUPT"), la(n.body), ua(n);
}
var fa = (e, t) => !!e && e.operator_id === t.operator_id && e.agent_id === t.agent_id && JSON.stringify(e.body) === JSON.stringify(t.body);
function pa(e, t) {
	fa(da(e), t) && e.removeItem(ra);
}
function ma(e, t, n, r) {
	try {
		aa(ia(e) && ia(e.receipt)), oa(e.configuration), aa(e.configuration.agent_id === r && e.configuration.rules[0].symbol === t.symbol);
		let i = e.receipt;
		return aa([
			"operation_id",
			"operator_id",
			"client_request_id",
			"capability",
			"action",
			"target_type",
			"target_id",
			"reason",
			"before_json",
			"after_json",
			"result",
			"error_code",
			"created_at_ms",
			"completed_at_ms",
			"source_service",
			"trace_id"
		].every((e) => typeof i[e] == "string")), aa(X(i.operation_id, 256) && X(i.trace_id, 256) && Y(i.created_at_ms) && Y(i.completed_at_ms)), aa(i.client_request_id === t.client_request_id && i.operator_id === n && i.source_service === "agent_admin" && i.result === "OPERATION_RESULT_SUCCEEDED" && i.reason === t.reason), !0;
	} catch {
		return !1;
	}
}
function ha(e) {
	return ia(e) ? [
		"INVALID_ARGUMENT",
		"UNAUTHENTICATED",
		"PERMISSION_DENIED",
		"NOT_FOUND",
		"CONFLICT"
	].includes(String(e.error_code)) ? !0 : ia(e.response) && [
		401,
		403,
		422
	].includes(Number(e.response.status)) : !1;
}
var ga = /* @__PURE__ */ new WeakMap();
function _a(e, t, n) {
	let r = ga.get(e);
	if (r) return aa(fa(r.pending, t), "PENDING_EXISTS"), r.promise;
	let i = da(e);
	aa(fa(i, t), "PENDING_CHANGED");
	let a = i.attempted, o = i.attempt + 1;
	aa(Number.isSafeInteger(o), "ATTEMPT_LIMIT"), e.setItem(ra, JSON.stringify({
		...i,
		attempted: !0,
		attempt: o
	}));
	let s = da(e);
	aa(s?.attempt === o && fa(s, t), "PERSISTENCE_UNAVAILABLE");
	let c = Promise.resolve().then(async () => {
		try {
			let r = await n(t.body);
			return fa(da(e), t) ? ma(r, t.body, t.operator_id, t.agent_id) ? (pa(e, t), {
				status: "success",
				value: r
			}) : {
				status: "unknown",
				error: /* @__PURE__ */ Error("INVALID_RECEIPT")
			} : {
				status: "superseded",
				error: null
			};
		} catch (n) {
			let r = da(e);
			if (!fa(r, t)) return {
				status: "superseded",
				error: n
			};
			let i = ia(n) && n.client_request_id !== void 0 && n.client_request_id !== t.body.client_request_id;
			return !a && r.attempt === o && !i && ha(n) ? (pa(e, t), {
				status: "rejected",
				error: n
			}) : {
				status: "unknown",
				error: n
			};
		}
	}).finally(() => {
		ga.get(e)?.promise === c && ga.delete(e);
	});
	return ga.set(e, {
		pending: t,
		promise: c
	}), c;
}
//#endregion
//#region src/prediction-config/agent/views/prediction/game-config/owner-mutation.ts
function va(e) {
	Q(Yi(e), "IDENTITY_UNCONFIRMED");
}
var ya = "prediction.owner.pending.v1";
function ba(e, t, n = []) {
	Q(t.every((t) => Object.hasOwn(e, t)) && Object.keys(e).every((e) => t.includes(e) || n.includes(e)), "PENDING_CORRUPT");
}
function xa(e) {
	Q(Z(e), "PENDING_CORRUPT"), ba(e, [
		"game_type",
		"symbol",
		"based_owner_revision",
		"changes",
		"client_request_id",
		"reason"
	], ["enabled"]), Q(e.enabled === void 0 || typeof e.enabled == "boolean", "PENDING_CORRUPT"), Q(["UP_DOWN", "HIGH_LOW"].includes(String(e.game_type)) && X(e.symbol, 64, !0) && X(e.client_request_id, 128) && X(e.reason, 500) && Y(e.based_owner_revision), "PENDING_CORRUPT"), Q(Array.isArray(e.changes) && (e.changes.length > 0 || e.enabled !== void 0) && e.changes.length <= 100 && new Set(e.changes.map((e) => e.duration_seconds)).size === e.changes.length, "PENDING_CORRUPT");
	for (let t of e.changes) Q(Z(t)), ba(t, [
		"duration_seconds",
		"stake_tier_id",
		"based_rule_epoch",
		"minimum_stake",
		"maximum_stake"
	], [
		"enabled",
		"target_payout_rate",
		"maximum_odds",
		"fixed_odds"
	]), Q(t.enabled === void 0 || typeof t.enabled == "boolean", "PENDING_CORRUPT"), e.game_type === "UP_DOWN" ? (Q(t.fixed_odds === void 0, "PENDING_CORRUPT"), (t.target_payout_rate !== void 0 || t.maximum_odds !== void 0) && Q(Xi(t.target_payout_rate) && Di(t.target_payout_rate, "1") <= 0 && Xi(t.maximum_odds) && Di(t.maximum_odds, "1") >= 0, "PENDING_CORRUPT")) : (Q(t.target_payout_rate === void 0 && t.maximum_odds === void 0, "PENDING_CORRUPT"), t.fixed_odds !== void 0 && Q(Xi(t.fixed_odds) && Di(t.fixed_odds, "1") > 0, "PENDING_CORRUPT")), Q(Y(t.duration_seconds, !0) && Y(t.based_rule_epoch, !0) && (e.game_type === "UP_DOWN" ? Fi.includes(t.duration_seconds) && X(t.stake_tier_id) : t.stake_tier_id === ""), "PENDING_CORRUPT"), Q(Xi(t.minimum_stake) && Xi(t.maximum_stake) && Di(t.minimum_stake, t.maximum_stake) <= 0, "PENDING_CORRUPT");
}
function Sa(e) {
	let t = e.getItem(ya);
	if (t === null) return null;
	Q(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return Q(Z(n)), ba(n, [
		"schema",
		"operator_id",
		"agent_id",
		"body",
		"attempted",
		"attempt"
	], ["config_site_id", "kind"]), va(n), Q(n.schema === (Ji(n) ? "scoped-owner-v1" : "owner-v1") && typeof n.attempted == "boolean" && Number.isSafeInteger(n.attempt) && Number(n.attempt) >= 0 && n.attempted === Number(n.attempt) > 0, "PENDING_CORRUPT"), xa(n.body), Ii(n);
}
var Ca = (e, t) => !!e && e.operator_id === t.operator_id && e.agent_id === t.agent_id && e.config_site_id === t.config_site_id && e.kind === t.kind && e.schema === t.schema && JSON.stringify(e.body) === JSON.stringify(t.body);
function wa(e, t, n) {
	va(t), xa(n), Q(Sa(e) === null, "PENDING_EXISTS");
	let r = {
		schema: Ji(t) ? "scoped-owner-v1" : "owner-v1",
		operator_id: t.operator_id,
		agent_id: t.agent_id,
		...Ji(t) ? {
			config_site_id: t.config_site_id,
			kind: t.kind
		} : {},
		body: JSON.parse(JSON.stringify(n)),
		attempted: !1,
		attempt: 0
	};
	return e.setItem(ya, JSON.stringify(r)), Q(Ca(Sa(e), r), "PERSISTENCE_UNAVAILABLE"), Ii(r);
}
function Ta(e, t) {
	Ca(Sa(e), t) && e.removeItem(ya);
}
function Ea(e, t) {
	try {
		if (Ji(t)) return Da(e, t);
		Q(Z(e) && Z(e.receipt)), Qi(e.configuration, t);
		let n = t.body, r = e.configuration, i = e.receipt;
		Q(r.symbol === n.symbol && r.game_type === "GAME_TYPE_" + n.game_type && BigInt(r.owner_revision) === BigInt(n.based_owner_revision) + 1n), n.enabled !== void 0 && Q(r.enabled === n.enabled);
		for (let e of n.changes) {
			let t = r.rules.find((t) => t.rule.duration_seconds === e.duration_seconds);
			Q(t && t.rule_epoch === e.based_rule_epoch), e.enabled !== void 0 && Q(t.owner_enabled === e.enabled);
			for (let n of [
				"target_payout_rate",
				"maximum_odds",
				"fixed_odds"
			]) e[n] !== void 0 && Q(Di(t.rule[n], e[n]) === 0);
			let i = n.game_type === "UP_DOWN" ? qi(t.rule) : t.rule;
			Q(("stake_tier_id" in i ? i.stake_tier_id : "") === e.stake_tier_id && Di(i.minimum_stake, e.minimum_stake) === 0 && Di(i.maximum_stake, e.maximum_stake) === 0);
		}
		return Q([
			"operation_id",
			"operator_id",
			"client_request_id",
			"capability",
			"action",
			"target_type",
			"target_id",
			"reason",
			"before_json",
			"after_json",
			"result",
			"error_code",
			"created_at_ms",
			"completed_at_ms",
			"source_service",
			"trace_id"
		].every((e) => typeof i[e] == "string")), Q(X(i.operation_id, 256) && X(i.trace_id, 256) && X(i.target_id, 256) && Y(i.created_at_ms) && Y(i.completed_at_ms)), Q(i.operator_id === t.operator_id && i.client_request_id === n.client_request_id && i.reason === n.reason && i.source_service === "agent_admin"), Q(i.result === "OPERATION_RESULT_SUCCEEDED" && i.error_code === "" && i.action === "ADMIN_ACTION_OWNER_CONFIG_PUBLISH" && i.capability === "prediction.owner.config.publish" && i.target_type === "owner_config"), !0;
	} catch {
		return !1;
	}
}
function Da(e, t) {
	Q(Z(e) && Z(e.stored) && Z(e.receipt));
	let n = e.stored, r = e.receipt, i = t.body;
	Q(Z(n.key) && n.key.configSiteId === t.config_site_id && n.key.ownerAgentId === t.agent_id && n.key.gameType === i.game_type && n.key.symbol === i.symbol), Q(Y(n.revision, !0) && BigInt(n.revision) === BigInt(i.based_owner_revision) + 1n && Y(n.basedPublicVersion, !0) && Y(n.basedSiteRevision)), Q(n.basedSiteRevision === "0" == (t.kind === "SITE" || t.config_site_id === "0")), Q(typeof n.disabled == "boolean" && (i.enabled === void 0 || n.disabled === !i.enabled)), Q(Array.isArray(n.overrides) && n.overrides.length > 0 && n.overrides.length <= 100);
	let a = /* @__PURE__ */ new Map();
	for (let e of n.overrides) {
		Q(Z(e) && Z(e.key) && e.key.gameType === i.game_type && e.key.symbol === i.symbol && Number.isSafeInteger(e.key.durationSeconds) && Number(e.key.durationSeconds) > 0);
		let t = String(e.key.durationSeconds);
		Q(!a.has(t) && typeof e.enabled == "boolean" && Y(e.basedRuleEpoch, !0) && Z(e.bounds) && Z(e.odds)), Q(Xi(e.bounds.minimum) && Xi(e.bounds.maximum) && Di(e.bounds.minimum, e.bounds.maximum) <= 0), i.game_type === "UP_DOWN" ? Q(Fi.includes(t) && X(e.stakeTierId) && Xi(e.odds.targetPayoutRate) && Di(e.odds.targetPayoutRate, "1") <= 0 && Xi(e.odds.maximumOdds) && Di(e.odds.maximumOdds, "1") >= 0 && e.odds.fixedOdds === void 0) : Q(e.stakeTierId === "" && Xi(e.odds.fixedOdds) && Di(e.odds.fixedOdds, "1") > 0 && e.odds.targetPayoutRate === void 0 && e.odds.maximumOdds === void 0), a.set(t, e);
	}
	for (let e of i.changes) {
		let t = a.get(e.duration_seconds);
		Q(t && Z(t.bounds) && Z(t.odds) && t.stakeTierId === e.stake_tier_id && t.basedRuleEpoch === e.based_rule_epoch && (e.enabled === void 0 || t.enabled === e.enabled)), Q(Di(String(t.bounds.minimum), e.minimum_stake) === 0 && Di(String(t.bounds.maximum), e.maximum_stake) === 0);
		for (let [n, r] of [
			["target_payout_rate", "targetPayoutRate"],
			["maximum_odds", "maximumOdds"],
			["fixed_odds", "fixedOdds"]
		]) e[n] !== void 0 && Q(Di(String(t.odds[r]), e[n]) === 0);
	}
	Q([
		"operation_id",
		"operator_id",
		"client_request_id",
		"capability",
		"action",
		"target_type",
		"target_id",
		"reason",
		"before_json",
		"after_json",
		"result",
		"error_code",
		"created_at_ms",
		"completed_at_ms",
		"source_service",
		"trace_id"
	].every((e) => typeof r[e] == "string")), Q(X(r.operation_id, 256) && X(r.trace_id, 256) && typeof r.target_id == "string" && /^[a-f0-9]{64}$/.test(r.target_id) && Y(r.created_at_ms) && Y(r.completed_at_ms)), Q(r.operator_id === t.operator_id && r.client_request_id === i.client_request_id && r.reason === i.reason && r.source_service === "agent_admin"), Q(r.result === "OPERATION_RESULT_SUCCEEDED" && r.error_code === "" && r.action === "ADMIN_ACTION_SCOPED_CONFIG_PUBLISH" && r.target_type === "scoped_owner_config" && r.capability === "prediction." + (t.kind === "SITE" ? "site" : "owner") + ".config.publish");
	let o = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(r.after_json), (e) => e.charCodeAt(0)))), s = (e) => Array.isArray(e) ? e.map(s) : Z(e) ? Object.fromEntries(Object.keys(e).sort().map((t) => [t, s(e[t])])) : e;
	return Q(JSON.stringify(s(o)) === JSON.stringify(s(n))), !0;
}
var Oa = /* @__PURE__ */ new WeakMap();
function ka(e, t, n) {
	let r = Oa.get(e);
	if (r) return Q(Ca(r.pending, t), "PENDING_EXISTS"), r.promise;
	let i = Sa(e);
	Q(Ca(i, t), "PENDING_CHANGED");
	let a = i.attempted, o = i.attempt + 1;
	Q(Number.isSafeInteger(o), "ATTEMPT_LIMIT"), e.setItem(ya, JSON.stringify({
		...i,
		attempted: !0,
		attempt: o
	}));
	let s = Sa(e);
	Q(s?.attempt === o && Ca(s, t), "PERSISTENCE_UNAVAILABLE");
	let c = Promise.resolve().then(async () => {
		try {
			let r = await n(t.body);
			return Ca(Sa(e), t) ? Ea(r, t) ? (Ta(e, t), {
				status: "success",
				value: r
			}) : {
				status: "unknown",
				error: Error("INVALID_RECEIPT")
			} : {
				status: "superseded",
				error: null
			};
		} catch (n) {
			let r = Sa(e);
			if (!Ca(r, t)) return {
				status: "superseded",
				error: n
			};
			let i = Z(n) && n.client_request_id !== void 0 && n.client_request_id !== t.body.client_request_id;
			return !a && r.attempt === o && !i && ha(n) ? (Ta(e, t), {
				status: "rejected",
				error: n
			}) : {
				status: "unknown",
				error: n
			};
		}
	}).finally(() => {
		Oa.get(e)?.promise === c && Oa.delete(e);
	});
	return Oa.set(e, {
		pending: t,
		promise: c
	}), c;
}
async function Aa(e, t, n, r) {
	let i = await ka(e, t, n);
	if (i.status !== "success") return i;
	try {
		return {
			...i,
			latest: await r(t.body),
			refreshFailed: !1
		};
	} catch {
		return {
			...i,
			latest: null,
			refreshFailed: !0
		};
	}
}
//#endregion
//#region src/prediction-config/agent/views/grid/config/model.ts
var ja = "grid.config.pending.v1", Ma = /^(0|[1-9]\d*)(?:\.(\d+))?$/, Na = /^[1-9]\d*$/, Pa = /^[A-Z0-9]{2,32}$/, Fa = [
	"site_id",
	"symbol",
	"based_on_layout_version",
	"based_on_site_version",
	"client_request_id",
	"reason",
	"changes"
], Ia = [
	"config_id",
	"requested_agent_id",
	"agent_id",
	"inherited",
	"default_config_id",
	"default_version",
	"default_resolution_epoch",
	"default_enabled",
	"effective_enabled",
	"default_target_rtp",
	"default_min_order_amount",
	"default_max_order_amount"
], La = [
	"based_on_config_id",
	"based_on_default_version",
	"based_on_default_resolution_epoch"
], Ra = [
	"price_band_width",
	"column_duration_seconds",
	"price_decimals"
], za = [
	"enabled",
	"target_rtp",
	"min_multiplier",
	"max_multiplier",
	"min_order_amount",
	"max_order_amount"
];
function Ba(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function $(e, t = "INVALID_GRID_CONFIGURATION") {
	if (!e) throw Error(t);
}
function Va(e, t) {
	$(Object.keys(e).length === t.length && Object.keys(e).every((e) => t.includes(e)), "PENDING_CORRUPT");
}
function Ha(e, t) {
	$(typeof e == "string" && e.length <= 128 && Ma.test(e), "INVALID_DECIMAL");
	let [n, r = ""] = e.split("."), i = n.replace(/^0+(?=\d)/, ""), a = r.replace(/0+$/, "");
	return $(t === void 0 || a.length <= t, "INVALID_DECIMAL"), a ? i + "." + a : i;
}
function Ua(e) {
	let [t, n = ""] = Ha(e).split(".");
	return {
		whole: t,
		fraction: n
	};
}
function Wa(e, t) {
	let n = Ua(e), r = Ua(t);
	if (n.whole.length !== r.whole.length) return n.whole.length > r.whole.length ? 1 : -1;
	if (n.whole !== r.whole) return n.whole > r.whole ? 1 : -1;
	let i = Math.max(n.fraction.length, r.fraction.length), a = n.fraction.padEnd(i, "0"), o = r.fraction.padEnd(i, "0");
	return a === o ? 0 : a > o ? 1 : -1;
}
function Ga(e, t) {
	let { whole: n, fraction: r } = Ua(e), i = n + r, a = n.length + t, o;
	o = a <= 0 ? "0." + "0".repeat(-a) + i : a >= i.length ? i + "0".repeat(a - i.length) : i.slice(0, a) + "." + i.slice(a);
	let [s, c = ""] = o.split("."), l = s.replace(/^0+(?=\d)/, "") || "0", u = c.replace(/0+$/, "");
	return u ? l + "." + u : l;
}
function Ka(e) {
	let t = Ha(e);
	return $(Wa(t, "0") > 0 && Wa(t, "1") <= 0, "INVALID_RTP"), Ga(t, 2);
}
function qa(e) {
	let t = Ha(e);
	return $(Wa(t, "0") > 0 && Wa(t, "100") < 0, "INVALID_RTP"), Ga(t, -2);
}
function Ja(e = globalThis.crypto) {
	$(e && typeof e.getRandomValues == "function", "SECURE_RANDOM_UNAVAILABLE");
	let t = e.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	$(t instanceof Uint8Array && t.length === 16, "SECURE_RANDOM_UNAVAILABLE"), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0")).join("");
	return `${n.slice(0, 8)}-${n.slice(8, 12)}-${n.slice(12, 16)}-${n.slice(16, 20)}-${n.slice(20)}`;
}
function Ya(e) {
	return $(typeof e == "string" && Na.test(e) && Wa(e, "25") <= 0, "INVALID_LAYOUT_DURATION"), e;
}
function Xa(e, t) {
	let n = Ha(e, t);
	return $(Wa(n, "0") > 0, "INVALID_LAYOUT_WIDTH"), n;
}
function Za(e) {
	return $(e === null || typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 18, "INVALID_LAYOUT_PRECISION"), e;
}
function Qa(e) {
	return $(typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 8, "INVALID_LAYOUT_PRECISION"), e;
}
function $a(e, t) {
	t != null && $((Ha(e).split(".")[1] ?? "").length <= t, "INVALID_LAYOUT_PRECISION");
}
function eo(e, t) {
	$(5 + (Number(e) + 1) * Number(t) <= 30, "INVALID_LAYOUT_HORIZON");
}
function to(e) {
	return $(Ba(e), "INVALID_GRID_LAYOUT"), Va(e, [
		"row_count",
		"column_count",
		"column_duration_seconds",
		"price_band_width",
		"effective_from_ms",
		"editable",
		"affected_site_ids",
		..."price_decimals" in e ? ["price_decimals"] : []
	]), $([
		e.row_count,
		e.column_count,
		e.column_duration_seconds
	].every((e) => typeof e == "string" && e.length <= 128 && Na.test(e)), "INVALID_GRID_LAYOUT"), $(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_LAYOUT"), $(typeof e.editable == "boolean", "INVALID_GRID_LAYOUT"), $(Array.isArray(e.affected_site_ids) && e.affected_site_ids.every((e) => typeof e == "string" && e.length > 0 && e.length <= 64 && e.trim() === e), "INVALID_GRID_LAYOUT"), $(new Set(e.affected_site_ids).size === e.affected_site_ids.length && (!e.editable || e.affected_site_ids.length > 0), "INVALID_GRID_LAYOUT"), {
		row_count: e.row_count,
		column_count: e.column_count,
		column_duration_seconds: e.column_duration_seconds,
		price_band_width: Xa(e.price_band_width),
		..."price_decimals" in e ? { price_decimals: Za(e.price_decimals) } : {},
		effective_from_ms: e.effective_from_ms,
		editable: e.editable,
		affected_site_ids: [...e.affected_site_ids]
	};
}
function no(e) {
	$(Ba(e), "INVALID_GRID_CONFIGURATION"), Va(e, [
		"site_id",
		"symbol",
		"layout_version",
		"site_version",
		"effective_from_ms",
		"enabled",
		"target_rtp",
		"min_multiplier",
		"max_multiplier",
		"min_order_amount",
		"max_order_amount",
		..."layout" in e ? ["layout"] : [],
		..."config_id" in e ? Ia : [],
		...lt.filter((t) => t in e)
	]), $(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "INVALID_GRID_CONFIGURATION"), $(typeof e.symbol == "string" && Pa.test(e.symbol), "INVALID_GRID_CONFIGURATION"), $([e.layout_version, e.site_version].every((e) => typeof e == "string" && Na.test(e)), "INVALID_GRID_CONFIGURATION"), $(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_CONFIGURATION"), $(typeof e.enabled == "boolean", "INVALID_GRID_CONFIGURATION");
	let t = {
		site_id: e.site_id,
		symbol: e.symbol,
		layout_version: e.layout_version,
		site_version: e.site_version,
		effective_from_ms: e.effective_from_ms,
		enabled: e.enabled,
		target_rtp: Ha(e.target_rtp),
		min_multiplier: Ha(e.min_multiplier, 2),
		max_multiplier: Ha(e.max_multiplier, 2),
		min_order_amount: Ha(e.min_order_amount, 8),
		max_order_amount: Ha(e.max_order_amount, 8)
	};
	if ($(Wa(t.target_rtp, "0") > 0 && Wa(t.target_rtp, "1") <= 0, "INVALID_GRID_CONFIGURATION"), $(Wa(t.min_multiplier, "1") >= 0 && Wa(t.max_multiplier, t.min_multiplier) >= 0, "INVALID_GRID_CONFIGURATION"), $(Wa(t.min_order_amount, "0") > 0 && Wa(t.max_order_amount, t.min_order_amount) >= 0, "INVALID_GRID_CONFIGURATION"), "config_id" in e) {
		for (let n of [
			"config_id",
			"default_config_id",
			"default_version",
			"default_resolution_epoch"
		]) $(typeof e[n] == "string" && Na.test(e[n]) && Wa(e[n], "9223372036854775807") <= 0), t[n] = e[n];
		$(typeof e.requested_agent_id == "string" && /^(0|[1-9][0-9]*)$/.test(e.requested_agent_id) && Wa(e.requested_agent_id, "9223372036854775807") <= 0), $(e.agent_id === null || e.agent_id === e.requested_agent_id && e.agent_id !== "0"), t.requested_agent_id = e.requested_agent_id, t.agent_id = e.agent_id;
		for (let n of [
			"inherited",
			"default_enabled",
			"effective_enabled"
		]) $(typeof e[n] == "boolean"), t[n] = e[n];
		for (let n of [
			"default_target_rtp",
			"default_min_order_amount",
			"default_max_order_amount"
		]) t[n] = Ha(e[n]);
	}
	return Object.assign(t, ht(e, Ha)), "layout" in e && (t.layout = to(e.layout)), t;
}
function ro(e, t, n) {
	let r = no(e);
	return $(r.site_id === t && r.symbol === n, "INVALID_GRID_TARGET"), r;
}
function io(e, t, n, r, i, a = !1) {
	let o = no(e), s = no(t);
	$(o.site_id === s.site_id && o.symbol === s.symbol, "INVALID_GRID_TARGET"), $(typeof n == "string" && n.length <= 500 && n.trim().length > 0 && !n.includes("\0"), "INVALID_REASON"), $(typeof r == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(r), "INVALID_REQUEST_ID"), $(o.config_id && o.default_version && o.default_resolution_epoch, "CONFIG_IDENTITY_REQUIRED"), $(Ia.every((e) => o[e] === s[e]), "INVALID_GRID_TARGET"), $(JSON.stringify(ht(o, Ha)) === JSON.stringify(ht(s, Ha)), "INVALID_GRID_TARGET");
	let c = {};
	for (let e of za) o[e] !== s[e] && (c[e] = s[e]);
	for (let e of Ra) o.layout?.[e] !== s.layout?.[e] && ($(a && o.layout?.editable && s.layout, "FIELD_FORBIDDEN"), c[e] = s.layout[e]);
	if (o.requested_agent_id !== "0" && !(c.enabled === !1 && Object.keys(c).length === 1) && ($(!s.enabled || o.default_enabled, "PLATFORM_LIMIT"), $(Wa(s.target_rtp, o.default_target_rtp) <= 0 && Wa(s.min_order_amount, o.default_min_order_amount) >= 0 && Wa(s.max_order_amount, o.default_max_order_amount) <= 0, "PLATFORM_LIMIT")), Ra.some((e) => e in c)) {
		let e = o.layout;
		"price_decimals" in c && Qa(c.price_decimals), $a(s.layout.price_band_width, s.layout.price_decimals), Xa(c.price_band_width ?? e.price_band_width, 18);
		let t = Ya(c.column_duration_seconds ?? e.column_duration_seconds);
		$(Wa(e.row_count, "10000") <= 0 && Wa(e.column_count, "10000") <= 0 && Number(e.row_count) * Number(e.column_count) <= 1e4, "INVALID_GRID_LAYOUT"), eo(e.column_count, t);
	}
	if (!i && ("min_multiplier" in c || "max_multiplier" in c)) throw Error("FIELD_FORBIDDEN");
	return $(Object.keys(c).length > 0, "EMPTY_CHANGES"), {
		site_id: o.site_id,
		symbol: o.symbol,
		based_on_layout_version: o.layout_version,
		based_on_site_version: o.site_version,
		based_on_config_id: o.config_id,
		...gt(o) ? { based_on_global_version: gt(o) } : {},
		based_on_default_version: o.default_version,
		based_on_default_resolution_epoch: o.default_resolution_epoch,
		client_request_id: r,
		reason: n,
		changes: c
	};
}
function ao(e) {
	if ($(Ba(e), "PENDING_CORRUPT"), Va(e, [
		...Fa,
		..."based_on_config_id" in e ? La : [],
		..."based_on_global_version" in e ? ["based_on_global_version"] : []
	]), "based_on_global_version" in e && $(typeof e.based_on_global_version == "string" && /^(0|[1-9][0-9]*)$/.test(e.based_on_global_version) && Wa(e.based_on_global_version, "9223372036854775807") <= 0, "PENDING_CORRUPT"), "based_on_config_id" in e) for (let t of La) $(typeof e[t] == "string" && Na.test(e[t]) && Wa(e[t], "9223372036854775807") <= 0, "PENDING_CORRUPT");
	$(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "PENDING_CORRUPT"), $(typeof e.symbol == "string" && Pa.test(e.symbol), "PENDING_CORRUPT"), $(typeof e.based_on_layout_version == "string" && Na.test(e.based_on_layout_version), "PENDING_CORRUPT"), $(typeof e.based_on_site_version == "string" && Na.test(e.based_on_site_version), "PENDING_CORRUPT"), $(typeof e.client_request_id == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(e.client_request_id), "PENDING_CORRUPT"), $(typeof e.reason == "string" && e.reason.length <= 500 && e.reason.trim().length > 0 && !e.reason.includes("\0"), "PENDING_CORRUPT"), $(Ba(e.changes) && Object.keys(e.changes).length > 0 && Object.keys(e.changes).every((e) => [...za, ...Ra].includes(e)), "PENDING_CORRUPT");
	for (let [t, n] of Object.entries(e.changes)) t === "enabled" ? $(typeof n == "boolean", "PENDING_CORRUPT") : t === "price_decimals" ? Qa(n) : t === "price_band_width" ? Xa(n, 18) : t === "column_duration_seconds" ? Ya(n) : Ha(n, t.includes("order_amount") ? 8 : t.includes("multiplier") ? 2 : void 0);
}
function oo(e) {
	if (e && typeof e == "object") {
		Object.freeze(e);
		for (let t of Object.values(e)) oo(t);
	}
	return e;
}
function so(e, t) {
	return !!e && JSON.stringify(e) === JSON.stringify(t);
}
function co(e) {
	let t = e.getItem(ja);
	if (t === null) return null;
	$(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return $(Ba(n), "PENDING_CORRUPT"), Va(n, [
		"schema",
		"operator_id",
		"command"
	]), $(n.schema === 1 && typeof n.operator_id == "string" && Na.test(n.operator_id), "PENDING_CORRUPT"), ao(n.command), oo(n);
}
function lo(e, t, n) {
	$(Na.test(t), "IDENTITY_UNCONFIRMED"), $(co(e) === null, "PENDING_EXISTS"), ao(n);
	let r = {
		schema: 1,
		operator_id: t,
		command: JSON.parse(JSON.stringify(n))
	};
	e.setItem(ja, JSON.stringify(r));
	let i = co(e);
	return $(so(i, r), "PERSISTENCE_UNAVAILABLE"), i;
}
function uo(e, t) {
	return $(Na.test(e), "IDENTITY_UNCONFIRMED"), ao(t), oo({
		operator_id: e,
		command: structuredClone(t)
	});
}
function fo(e, t, n, r) {
	return ao(t.command), ao(r), $(t.operator_id === n && JSON.stringify(t.command) === JSON.stringify(r), "STALE_CONFIRMATION"), lo(e, t.operator_id, t.command);
}
function po(e, t) {
	let n = co(e);
	return n ? n.operator_id === t ? {
		status: "bound",
		pending: n
	} : {
		status: "foreign",
		pending: n
	} : { status: "none" };
}
function mo(e, t) {
	return Ba(e) ? e.operation_status === "SUCCEEDED" && typeof e.operation_id == "string" && Na.test(e.operation_id) && e.site_id === t.command.site_id && e.symbol === t.command.symbol && typeof e.layout_version == "string" && Na.test(e.layout_version) && typeof e.site_version == "string" && Na.test(e.site_version) && typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms) && typeof e.changed == "boolean" && [
		"PENDING",
		"DONE",
		"NOT_REQUIRED"
	].includes(String(e.cache_state)) : !1;
}
function ho(e) {
	return Ba(e) && e.error_code === "RECEIPT_UNCONFIRMED" && e.operation_status === "UNKNOWN";
}
async function go(e, t, n, r) {
	$(so(co(e), t), "PENDING_CHANGED");
	try {
		let i = await r(n === "recover" ? "save" : n, structuredClone(t.command));
		return mo(i, t) ? (so(co(e), t) && e.removeItem(ja), {
			status: "success",
			value: i
		}) : {
			status: "unknown",
			error: /* @__PURE__ */ Error("INVALID_RECEIPT")
		};
	} catch (r) {
		if ((Ba(r) ? r.operation_status : void 0) === "FAILED" && (n === "save" || n === "recover" && Ba(r) && r.error_code === "VERSION_CONFLICT")) {
			let n = so(co(e), t);
			return n && e.removeItem(ja), {
				status: "rejected",
				error: r,
				journalCleared: n
			};
		}
		return {
			status: "unknown",
			error: r
		};
	}
}
var _o = class {
	generation = 0;
	controller;
	next(e) {
		this.controller?.abort();
		let t = ++this.generation, n = new AbortController();
		return this.controller = n, {
			signal: n.signal,
			current: (r) => t === this.generation && !n.signal.aborted && r === e
		};
	}
	close() {
		this.generation++, this.controller?.abort();
	}
};
//#endregion
//#region src/prediction-config/agent/views/grid/config/pending-scope.ts
function vo(e, t) {
	if (t?.kind !== "SITE") return e;
	if (t.agent_id !== "0" || !/^[1-9][0-9]*$/.test(t.operator_id) || !/^[1-9][0-9]*$/.test(t.tenant_id ?? "")) throw Error("INVALID_GRID_ACTOR");
	let n = `white-label:${t.tenant_id}:${t.operator_id}:`;
	return {
		getItem: (t) => e.getItem(n + t),
		setItem: (t, r) => e.setItem(n + t, r),
		removeItem: (t) => e.removeItem(n + t)
	};
}
//#endregion
//#region src/prediction-config/agent/views/grid/config/directory.ts
function yo(e, t, n = !1) {
	return bo(e.filter((e) => n || e.default_enabled).map((e) => ({
		...e,
		configured: !0
	})), t);
}
function bo(e, t, n = (e) => !!e.enabled) {
	let r = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.trim().toUpperCase();
		r.has(t) || r.set(t, r.size);
	}
	return [...e].sort((e, t) => Number(n(t)) - Number(n(e)) || (r.get(e.symbol) ?? 2 ** 53 - 1) - (r.get(t.symbol) ?? 2 ** 53 - 1) || e.symbol.localeCompare(t.symbol));
}
//#endregion
//#region src/prediction-config/agent/views/grid/config/index.vue?vue&type=script&setup=true&lang.ts
var xo = {
	class: "grid-config",
	"data-grid-config": "agent"
}, So = { key: 3 }, Co = {
	key: 5,
	class: "pending-bar"
}, wo = { class: "pending-actions" }, To = { class: "grid-layout" }, Eo = { class: "symbol-panel" }, Do = { class: "panel-heading" }, Oo = {
	key: 1,
	class: "directory-error",
	role: "alert"
}, ko = { class: "symbol-list" }, Ao = ["disabled", "onClick"], jo = {
	key: 0,
	class: "symbol-unconfigured"
}, Mo = { key: 2 }, No = { class: "config-panel" }, Po = { class: "config-heading" }, Fo = { "data-config-updated-at": "" }, Io = { key: 0 }, Lo = { class: "config-heading__actions" }, Ro = {
	key: 0,
	class: "parameter-description"
}, zo = {
	key: 0,
	class: "parameter-card",
	"data-price-precision": ""
}, Bo = { class: "fields" }, Vo = { class: "parameter-card" }, Ho = { class: "fields odds-fields" }, Uo = { key: 0 }, Wo = { key: 1 }, Go = { class: "parameter-card" }, Ko = { class: "parameter-heading" }, qo = { class: "parameter-description" }, Jo = { class: "fields limit-fields" }, Yo = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "index",
	props: { actor: {} },
	setup(t, { expose: n }) {
		let { initializeGridSite: l, initializeGridMerchant: f, gridConfigSymbols: p, gridConfigCatalog: m, gridConfigReceipt: h, gridConfigSite: g, saveGridConfig: _ } = me().grid, ne = ge(), y = t, x = i(() => y.actor?.kind === "SITE"), S = () => vo(sessionStorage, y.actor), C = he(), ie = (e) => C.perms.includes("*") || C.perms.includes(e), ae = i(() => ie("prediction_config:lists") && (!x.value || C.userInfo.can_manage_prediction_config === !0 && y.actor?.operator_id === String(C.userInfo.id))), D = ae, O = i(() => {
			let e = String(C.userInfo.id || "");
			return /^[1-9]\d*$/.test(e) ? e : "";
		}), j = i(() => `${O.value}:${C.token ?? ""}:${y.actor?.kind ?? ""}:${y.actor?.tenant_id ?? ""}:${y.actor?.config_site_id ?? ""}`), M = b([]), N = b(""), P = b(""), se = b(""), I = b(null), L = b(null), R = b(""), z = b("通过预测网格配置页面保存配置"), B = b(!1), V = b(!1), H = b(!1), U = b(!1), fe = b(!1), W = b(""), G = b(""), K = b("info"), pe = b(null), ve = b(!1), ye = b(""), be = b(!1), xe = new _o(), Se = new _o(), Ce = new _o(), q, we = 0, Te = i(() => ae.value ? O.value ? "" : "无法确认当前操作人身份" : "当前账号没有预测网格配置查询权限"), Ee = i(() => M.value.find((e) => e.site_id === N.value)), De = i(() => x.value && Ee.value?.can_edit_limits === !0), Oe = b([]), ke = b(""), Ae = i(() => yo(Ee.value?.products ?? [], Oe.value, x.value)), je = i(() => {
			let e = se.value.trim().toUpperCase();
			return Ae.value.filter((t) => !e || t.symbol.includes(e));
		}), Me = i(() => {
			if (!I.value || !L.value) return !1;
			try {
				return Ka(I.value.target_rtp) !== R.value || [
					"enabled",
					"min_multiplier",
					"max_multiplier",
					"min_order_amount",
					"max_order_amount"
				].some((e) => I.value[e] !== L.value[e]);
			} catch {
				return !0;
			}
		}), Ne = i(() => pe.value ? pe.value.operator_id === O.value ? "bound" : "foreign" : "none"), Pe = i(() => Ne.value === "bound" ? pe.value : null), Fe = i(() => Ne.value === "foreign"), Ie = i(() => Me.value || !!pe.value || fe.value), Le = i(() => ae.value && D.value && !!Ee.value?.can_edit && !!O.value && !!I.value && !pe.value && !ve.value && !U.value && !fe.value), Re = i(() => !!Pe.value && ae.value && D.value && M.value.some((e) => e.site_id === Pe.value.command.site_id && e.can_edit)), ze = i(() => Re.value && V.value && !H.value && !U.value && !fe.value && !ve.value && !be.value && ye.value === JSON.stringify(Pe.value));
		function Be(e) {
			let t = e;
			return {
				INVALID_LAYOUT: "网格区间超出允许范围，请检查价格区间和每列时长后重试",
				LAYOUT_PRICE_UNAVAILABLE: "当前标记价暂不可用，请稍后刷新重试",
				INVALID_LAYOUT_DURATION: "横向格子区间必须为 1 至 25 的整数秒数",
				INVALID_LAYOUT_HORIZON: "横向格子区间过大，当前列数加起始等待时间后超出允许的报价时长",
				INVALID_LAYOUT_WIDTH: "纵向格子区间必须大于 0",
				INVALID_DECIMAL: "请输入有效的十进制数，纵向格子区间最多支持 18 位有效小数",
				INVALID_RTP: "目标返奖率必须大于 0 且小于 100%",
				INVALID_GRID_LAYOUT: "网格区间返回格式不正确，请刷新后重试",
				FIELD_FORBIDDEN: "当前账号无权修改所选配置，请刷新后重试",
				CONFIG_IDENTITY_REQUIRED: "配置接口版本需要更新，请联系管理员完成本次升级",
				PLATFORM_LIMIT: "商户配置不能超出平台的开关、返奖率和金额范围",
				EMPTY_CHANGES: "配置没有实际变化，无需保存"
			}[t?.error_code || t?.message || ""] || [t?.message || "预测网格配置请求失败", t?.error_code].filter(Boolean).join(" · ");
		}
		let Ve = i(() => {
			let e = [I.value?.effective_from_ms, I.value?.layout?.effective_from_ms].filter((e) => typeof e == "string" && /^[1-9][0-9]*$/.test(e)).reduce((e, t) => BigInt(e) > BigInt(t) ? e : t, "0");
			return e === "0" ? "未提供" : Oi(e);
		});
		function He(e) {
			if (!e || !Array.isArray(e.sites)) throw Error("币种目录返回格式不正确");
			let t = /* @__PURE__ */ new Set();
			for (let n of e.sites) {
				if (!n || typeof n.site_id != "string" || !n.site_id || n.site_id.trim() !== n.site_id || typeof n.can_edit != "boolean" || typeof n.can_edit_limits != "boolean" || !Array.isArray(n.products) || t.has(n.site_id)) throw Error("币种目录返回格式不正确");
				t.add(n.site_id);
				let e = /* @__PURE__ */ new Set();
				for (let t of n.products) {
					if (!t || typeof t.symbol != "string" || !/^[A-Z0-9]{2,32}$/.test(t.symbol) || typeof t.enabled != "boolean" || typeof t.default_enabled != "boolean" || e.has(t.symbol)) throw Error("币种目录返回格式不正确");
					e.add(t.symbol);
				}
			}
			return e.sites.filter((e) => !x.value || e.site_id === y.actor?.config_site_id).map((e) => ({
				...e,
				products: e.products.filter((e) => x.value || e.default_enabled)
			}));
		}
		function Ue() {
			try {
				let e = po(S(), O.value);
				pe.value = e.pending ?? null, ve.value = !1;
			} catch {
				ve.value = !0, pe.value = null;
			}
		}
		function We() {
			return `${j.value}:${N.value}:${P.value}`;
		}
		function Ge() {
			Se.close(), I.value = null, L.value = null, R.value = "", z.value = "通过预测网格配置页面保存配置", U.value = !1;
		}
		async function Ke(e) {
			if (V.value = !1, xe.close(), Ce.close(), ye.value = "", Ge(), M.value = [], Oe.value = [], ke.value = "", N.value = "", P.value = "", se.value = "", W.value = "", G.value = "", Ue(), Te.value || ve.value) return;
			let t = xe.next(j.value);
			H.value = !0;
			try {
				if (x.value) {
					if (!l || !y.actor?.config_site_id) throw Error("SITE_UNAVAILABLE");
					Pe.value || await l(y.actor.config_site_id, t.signal);
				} else await f(t.signal);
				if (!t.current(j.value)) return;
				let [n, r] = await Promise.allSettled([m(t.signal), p(t.signal)]);
				if (!t.current(j.value)) return;
				if (r.status === "fulfilled" && Array.isArray(r.value) && r.value.every((e) => typeof e == "string") ? Oe.value = r.value : ke.value = "通用币种目录暂不可用，当前仅显示已授权的网格配置。", n.status === "rejected") throw n.reason;
				M.value = He(n.value), V.value = !0;
				let i = Pe.value ?? (e ? { command: e } : null), a = i && M.value.some((e) => e.site_id === i.command.site_id) ? i.command.site_id : M.value[0]?.site_id || "";
				N.value = a;
				let o = M.value.find((e) => e.site_id === a), s = i && i.command.site_id === a && o?.products.some((e) => e.symbol === i.command.symbol) ? i.command.symbol : Ae.value.find((e) => e.configured)?.symbol || "";
				P.value = s, s && (q = Ye());
			} catch (e) {
				t.current(j.value) && (W.value = Be(e));
			} finally {
				t.current(j.value) && (H.value = !1);
			}
		}
		function qe(e) {
			Ie.value || (Ge(), N.value = e, P.value = Ae.value.find((e) => e.configured)?.symbol || "", P.value && (q = Ye()));
		}
		function Je(e) {
			e === P.value || Ie.value || !Ee.value?.products.some((t) => t.symbol === e) || (Ge(), P.value = e, q = Ye());
		}
		async function Ye() {
			if (Ge(), !ae.value || !N.value || !P.value) return;
			let e = N.value, t = P.value, n = We(), r = Se.next(n);
			U.value = !0;
			try {
				let n = await g(e, t, r.signal);
				if (!r.current(We())) return;
				let i = ro(n, e, t);
				if (x.value && i.requested_agent_id !== "0") throw Error("CONFIG_IDENTITY_REQUIRED");
				I.value = i, L.value = structuredClone(i), R.value = Ka(i.target_rtp);
			} catch (e) {
				r.current(We()) && (W.value = Be(e));
			} finally {
				r.current(We()) && (U.value = !1);
			}
		}
		function Xe(e) {
			return e.symbol === P.value && L.value ? L.value.enabled && (x.value || L.value.default_enabled !== !1) : e.enabled;
		}
		function Ze(e) {
			return !x.value && e.symbol === P.value && I.value?.default_enabled === !1 || !Ee.value?.products.some((t) => t.symbol === e.symbol) || !D.value || !Ee.value?.can_edit || U.value || fe.value || !!pe.value || ve.value || Me.value && e.symbol !== P.value;
		}
		async function Qe(e, t) {
			typeof t != "boolean" || Ze(e) || (e.symbol !== P.value && (Je(e.symbol), await q), L.value && L.value.symbol === e.symbol && !Ze(e) && (L.value.enabled = t, $e()));
		}
		function $e() {
			G.value = "";
		}
		async function et() {
			if (!Le.value || !I.value || !L.value || !O.value) return;
			let e;
			try {
				e = io(I.value, {
					...L.value,
					target_rtp: qa(R.value)
				}, z.value, Ja(), De.value, !1);
			} catch (e) {
				K.value = "warning", G.value = Be(e);
				return;
			}
			let t = uo(O.value, e);
			try {
				await ce.confirm(`确认保存 ${e.site_id} / ${e.symbol} 的 ${Object.keys(e.changes).length} 项修改？`, "确认预测网格配置", {
					type: "warning",
					confirmButtonText: "确认保存",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			}
			if (Ue(), !Le.value || !I.value || !L.value) {
				K.value = "warning", G.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let n;
			try {
				n = io(I.value, {
					...L.value,
					target_rtp: qa(R.value)
				}, z.value, t.command.client_request_id, De.value, !1);
			} catch {
				K.value = "warning", G.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let r;
			try {
				r = fo(S(), t, O.value, n), Ue();
			} catch (e) {
				if (e?.message === "STALE_CONFIRMATION") {
					K.value = "warning", G.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
					return;
				}
				ve.value = !0;
				return;
			}
			rt(r, "save");
		}
		async function tt() {
			Ue(), !(!Pe.value || !Re.value || fe.value || be.value) && rt(Pe.value, "receipt");
		}
		async function nt() {
			if (Ue(), !ze.value || !Pe.value) return;
			let e = Pe.value;
			be.value = !0;
			try {
				await ce.confirm(`确认恢复 ${e.command.site_id} / ${e.command.symbol} 的原请求 ${e.command.client_request_id}？将沿用原编号和原参数；已提交则返回原回执，尚未提交则保存原配置，不使用当前页面的新修改。`, "恢复原配置请求", {
					type: "warning",
					confirmButtonText: "确认恢复",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			} finally {
				be.value = !1;
			}
			if (Ue(), !ze.value || JSON.stringify(e) !== JSON.stringify(Pe.value)) {
				K.value = "warning", G.value = "确认期间账号、权限或原请求已变化，本次恢复已取消，请重新查询原操作回执";
				return;
			}
			await rt(e, "recover");
		}
		async function rt(e, t) {
			let n = ++we, r = We(), i = Ce.next(r);
			fe.value = !0, ye.value = "", G.value = "";
			try {
				let n = await go(S(), e, t, (e, t) => e === "save" ? _(t) : h(t));
				if (!i.current(We())) return;
				if (Ue(), n.status === "success") {
					let e = O.value;
					z.value = "通过预测网格配置页面保存配置", fe.value = !1, await Ke(), e === O.value && (K.value = "warning", G.value = W.value ? "配置已保存；最新配置刷新失败，请手动刷新" : "");
				} else if (t === "recover" && n.status === "rejected" && n.error?.error_code === "VERSION_CONFLICT") if (!n.journalCleared || pe.value || ve.value) K.value = "warning", G.value = "旧请求已明确拒绝，但本机待确认记录已变化，请重新核对当前记录";
				else {
					let t = O.value;
					if (await Ke(e.command), N.value && P.value && q && await q, t === O.value) {
						K.value = "warning";
						let t = N.value === e.command.site_id && P.value === e.command.symbol && M.value.some((t) => t.site_id === e.command.site_id && t.products.some((t) => t.symbol === e.command.symbol));
						G.value = "旧请求未生效，配置版本已变化；已清除旧待确认记录。" + (t ? W.value || !I.value ? "最新配置刷新失败，请手动刷新" : "请以当前配置为准" : `原目标当前不可见（${e.command.site_id} / ${e.command.symbol}），请核对权限和配置`);
					}
				}
				else K.value = n.status === "unknown" ? "warning" : "info", t === "receipt" && ho(n.error) && JSON.stringify(Pe.value) === JSON.stringify(e) ? (ye.value = JSON.stringify(e), G.value = "未找到原操作回执，可使用原编号和原参数恢复请求") : t === "recover" ? G.value = "恢复尚未确认，原请求已保留，请重新查询原操作回执 · " + Be(n.error) : G.value = n.status === "unknown" ? "原操作结果仍待确认，请使用原请求查询回执" : "保存已明确拒绝，可修正后重新提交 · " + Be(n.error);
			} catch (e) {
				i.current(We()) && (Ue(), K.value = "warning", G.value = "原操作结果仍待确认 · " + Be(e));
			} finally {
				n === we && (fe.value = !1, Ue());
			}
		}
		async function it() {
			if (!Ie.value) return !0;
			try {
				return await ce.confirm("当前有未保存修改或待确认操作，离开不会删除原记录。仍要离开吗？", "离开预测网格配置", { type: "warning" }), !0;
			} catch {
				return !1;
			}
		}
		function at() {
			return JSON.stringify({
				operator: O.value,
				site: N.value,
				symbol: P.value,
				snapshot: I.value,
				draft: L.value,
				rtp: R.value,
				reason: z.value
			});
		}
		async function ot() {
			if (!fe.value) {
				if (Me.value) {
					let e = at();
					try {
						await ce.confirm("刷新会丢弃当前未保存修改，仍要刷新吗？", "刷新预测网格配置", { type: "warning" });
					} catch {
						return;
					}
					if (fe.value || e !== at()) {
						K.value = "warning", G.value = "确认期间编辑状态已变化，本次刷新已取消";
						return;
					}
				}
				await Ke();
			}
		}
		function st(e) {
			Ie.value && (e.preventDefault(), e.returnValue = "");
		}
		return oe(() => [
			j.value,
			ae.value,
			D.value
		], () => Ke(), { immediate: !0 }), _e(it), window.addEventListener("beforeunload", st), te(() => {
			ye.value = "", V.value = !1, xe.close(), Se.close(), Ce.close(), window.removeEventListener("beforeunload", st);
		}), n({
			hasBlockingWork: Ie,
			confirmLeave: it,
			refresh: ot,
			loading: H
		}), (t, n) => (v(), s("section", xo, [
			Te.value ? (v(), a(T(k), {
				key: 0,
				title: Te.value,
				type: "warning",
				closable: !1
			}, null, 8, ["title"])) : ve.value ? (v(), a(T(k), {
				key: 1,
				title: "本机保存的待确认操作记录已损坏或不可用，请停止操作并联系管理员核验",
				type: "error",
				closable: !1
			})) : Fe.value ? (v(), a(T(k), {
				key: 2,
				title: "检测到其他账号尚未确认的预测网格配置操作，当前账号不可覆盖，请切回原账号查询回执",
				type: "error",
				closable: !1
			})) : o("", !0),
			W.value ? (v(), s("div", So, [d(T(k), {
				title: W.value,
				type: "error",
				closable: !1
			}, null, 8, ["title"]), d(T(A), {
				loading: H.value || U.value,
				disabled: fe.value || !!pe.value,
				onClick: ot
			}, {
				default: E(() => [...n[9] ||= [u("重试", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"])])) : o("", !0),
			G.value ? (v(), a(T(k), {
				key: 4,
				title: G.value,
				type: K.value,
				closable: !1
			}, null, 8, ["title", "type"])) : o("", !0),
			Pe.value ? (v(), s("div", Co, [c("div", null, [n[10] ||= c("strong", null, "原配置操作结果待确认", -1), c("small", null, w(Pe.value.command.site_id) + " · " + w(Pe.value.command.symbol) + " · " + w(Pe.value.command.client_request_id), 1)]), c("div", wo, [d(T(A), {
				type: "warning",
				loading: fe.value,
				disabled: !Re.value || be.value,
				onClick: tt
			}, {
				default: E(() => [...n[11] ||= [u("查询原操作回执", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"]), ze.value || be.value ? (v(), a(T(A), {
				key: 0,
				type: "warning",
				disabled: !ze.value,
				onClick: nt
			}, {
				default: E(() => [...n[12] ||= [u("恢复原请求", -1)]]),
				_: 1
			}, 8, ["disabled"])) : o("", !0)])])) : o("", !0),
			d(gn, {
				loading: H.value,
				"min-height": "0px",
				class: "grid-loading-region"
			}, {
				default: E(() => [c("div", To, [c("aside", Eo, [
					c("div", Do, [n[13] ||= c("strong", null, "交易对配置", -1), c("span", null, w(je.value.length) + " 条", 1)]),
					M.value.length > 1 ? (v(), a(T(ue), {
						key: 0,
						modelValue: N.value,
						"onUpdate:modelValue": n[0] ||= (e) => N.value = e,
						"aria-label": "选择站点",
						disabled: Ie.value,
						onChange: qe
					}, {
						default: E(() => [(v(!0), s(r, null, re(M.value, (e) => (v(), a(T(le), {
							key: e.site_id,
							label: e.site_id,
							value: e.site_id
						}, null, 8, ["label", "value"]))), 128))]),
						_: 1
					}, 8, ["modelValue", "disabled"])) : o("", !0),
					ke.value ? (v(), s("p", Oo, [u(w(ke.value), 1), d(T(A), {
						link: "",
						type: "primary",
						disabled: Ie.value,
						onClick: ot
					}, {
						default: E(() => [...n[14] ||= [u("重试", -1)]]),
						_: 1
					}, 8, ["disabled"])])) : o("", !0),
					d(T(e), {
						modelValue: se.value,
						"onUpdate:modelValue": n[1] ||= (e) => se.value = e,
						clearable: "",
						placeholder: "搜索交易对",
						"aria-label": "搜索交易对"
					}, null, 8, ["modelValue"]),
					c("div", ko, [(v(!0), s(r, null, re(je.value, (e) => (v(), s("div", {
						key: e.symbol,
						class: ee(["symbol-row", { active: e.symbol === P.value }])
					}, [
						c("button", {
							type: "button",
							class: "symbol-button",
							disabled: !e.configured || Ie.value && e.symbol !== P.value,
							onClick: (t) => Je(e.symbol)
						}, [d(T(ne), { symbol: e.symbol }, null, 8, ["symbol"])], 8, Ao),
						e.configured ? (v(), a(T(de), {
							key: 1,
							"model-value": Xe(e),
							disabled: Ze(e),
							"aria-label": `${e.symbol} 开放配置`,
							onChange: (t) => Qe(e, t)
						}, null, 8, [
							"model-value",
							"disabled",
							"aria-label",
							"onChange"
						])) : (v(), s("span", jo, "未配置")),
						e.symbol === P.value && Me.value ? (v(), s("small", Mo, "未保存")) : o("", !0)
					], 2))), 128)), !H.value && Ee.value && !je.value.length ? (v(), a(T(F), {
						key: 0,
						description: "当前站点没有已授权的预测网格产品",
						"image-size": 56
					})) : o("", !0)])
				]), c("main", No, [!H.value && !M.value.length && !W.value ? (v(), a(T(F), {
					key: 0,
					description: "当前账号暂无授权站点"
				})) : Ee.value && !P.value ? (v(), a(T(F), {
					key: 1,
					description: "请选择交易对查看配置"
				})) : I.value && L.value ? (v(), s(r, { key: 2 }, [
					c("header", Po, [c("div", null, [
						c("h2", null, w(I.value.symbol) + " · 预测网格", 1),
						c("p", Fo, "更新时间 " + w(Ve.value), 1),
						M.value.length > 1 ? (v(), s("p", Io, "当前站点：" + w(I.value.site_id), 1)) : o("", !0)
					]), c("div", Lo, [d(T(A), { onClick: n[2] ||= (e) => B.value = !0 }, {
						default: E(() => [...n[15] ||= [u("玩法说明", -1)]]),
						_: 1
					}), T(D) ? (v(), a(T(A), {
						key: 0,
						type: "primary",
						loading: fe.value,
						disabled: !Le.value || !Me.value,
						onClick: et
					}, {
						default: E(() => [...n[16] ||= [u("保存配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])) : o("", !0)])]),
					I.value.requested_agent_id === "0" ? o("", !0) : (v(), s("p", Ro, w(I.value.inherited ? "当前继承所属站点配置" : "当前使用商户配置") + "；已有商户配置保持不变。平台返奖率上限 " + w(I.value.default_target_rtp ? `${T(Ka)(I.value.default_target_rtp)}%` : "—") + "，单笔范围 " + w(I.value.default_min_order_amount) + " ~ " + w(I.value.default_max_order_amount) + " USDT。", 1)),
					!x.value && I.value.default_enabled === !1 ? (v(), a(T(k), {
						key: 1,
						title: "平台已关闭此币种，商户不能开启",
						type: "info",
						closable: !1
					})) : o("", !0),
					d(gn, { loading: U.value }, {
						default: E(() => [
							I.value.layout ? (v(), s("article", zo, [n[17] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "价格精度"), c("p", { class: "parameter-description" }, "由总后台统一设置，此处只读")], -1), c("div", Bo, [c("label", null, [c("span", null, "价格小数位：" + w(I.value.layout.price_decimals == null ? "未设置（沿用原规则）" : `${I.value.layout.price_decimals} 位`), 1)])])])) : o("", !0),
							c("article", Vo, [n[25] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "赔率配置"), c("p", { class: "parameter-description" }, "格子赔率按目标返奖率与命中概率动态计算")], -1), c("div", Ho, [
								c("label", null, [
									c("span", null, [n[18] ||= u("目标返奖率", -1), d(yn, {
										label: "目标返奖率",
										content: "例如 97%：命中概率为 20% 时，计算赔率为 4.85x。"
									})]),
									d(En, {
										"input-component": T(e),
										modelValue: R.value,
										"onUpdate:modelValue": n[3] ||= (e) => R.value = e,
										disabled: !Le.value,
										inputmode: "decimal",
										onInput: $e
									}, {
										append: E(() => [...n[19] ||= [u("%", -1)]]),
										_: 1
									}, 8, [
										"input-component",
										"modelValue",
										"disabled"
									]),
									n[20] ||= c("small", null, "例如 97%：命中概率为 20% 时，计算赔率为 4.85x", -1)
								]),
								De.value ? (v(), s("label", Uo, [n[22] ||= c("span", null, "最低赔率", -1), d(En, {
									"input-component": T(e),
									modelValue: L.value.min_multiplier,
									"onUpdate:modelValue": n[4] ||= (e) => L.value.min_multiplier = e,
									disabled: !Le.value,
									inputmode: "decimal",
									onInput: $e
								}, {
									append: E(() => [...n[21] ||= [u("x", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								])])) : o("", !0),
								De.value ? (v(), s("label", Wo, [n[24] ||= c("span", null, "最高赔率", -1), d(En, {
									"input-component": T(e),
									modelValue: L.value.max_multiplier,
									"onUpdate:modelValue": n[5] ||= (e) => L.value.max_multiplier = e,
									disabled: !Le.value,
									inputmode: "decimal",
									onInput: $e
								}, {
									append: E(() => [...n[23] ||= [u("x", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								])])) : o("", !0)
							])]),
							c("article", Go, [c("header", Ko, [n[26] ||= c("h3", null, "下注限制", -1), c("p", qo, w(I.value.symbol) + " 每个格子生成一笔独立订单", 1)]), c("div", Jo, [c("label", null, [c("span", null, [n[27] ||= u("最小下注金额", -1), d(yn, { label: "最小下注金额" })]), d(En, {
								"input-component": T(e),
								modelValue: L.value.min_order_amount,
								"onUpdate:modelValue": n[6] ||= (e) => L.value.min_order_amount = e,
								disabled: !Le.value,
								inputmode: "decimal",
								onInput: $e
							}, {
								append: E(() => [...n[28] ||= [u("USDT", -1)]]),
								_: 1
							}, 8, [
								"input-component",
								"modelValue",
								"disabled"
							])]), c("label", null, [c("span", null, [n[29] ||= u("最大下注金额", -1), d(yn, { label: "最大下注金额" })]), d(En, {
								"input-component": T(e),
								modelValue: L.value.max_order_amount,
								"onUpdate:modelValue": n[7] ||= (e) => L.value.max_order_amount = e,
								disabled: !Le.value,
								inputmode: "decimal",
								onInput: $e
							}, {
								append: E(() => [...n[30] ||= [u("USDT", -1)]]),
								_: 1
							}, 8, [
								"input-component",
								"modelValue",
								"disabled"
							])])])]),
							T(D) ? o("", !0) : (v(), a(T(k), {
								key: 1,
								title: "当前账号只有预测网格配置查看权限",
								type: "info",
								closable: !1
							}))
						]),
						_: 1
					}, 8, ["loading"])
				], 64)) : o("", !0)])])]),
				_: 1
			}, 8, ["loading"]),
			d($n, {
				modelValue: B.value,
				"onUpdate:modelValue": n[8] ||= (e) => B.value = e
			}, null, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-2768af6f"]]), Xo = {
	class: "prediction-config prediction-table-page",
	"data-prediction-page": "OWNER_CONFIG"
}, Zo = {
	class: "game-tabs",
	"aria-label": "选择预测玩法"
}, Qo = {
	class: "game-choice-icon",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	"aria-hidden": "true"
}, $o = { class: "game-choice-content" }, es = {
	key: 0,
	role: "alert"
}, ts = {
	key: 1,
	role: "alert"
}, ns = {
	key: 3,
	class: "config-layout"
}, rs = {
	class: "symbol-directory",
	"aria-label": "交易对配置"
}, is = {
	key: 0,
	role: "status"
}, as = {
	key: 1,
	class: "catalog-error",
	role: "alert"
}, os = { class: "symbol-list" }, ss = [
	"aria-pressed",
	"disabled",
	"onClick"
], cs = ["title"], ls = { class: "symbol-all-control" }, us = { key: 2 }, ds = { class: "config-content" }, fs = { class: "config-title" }, ps = { class: "config-title-actions" }, ms = {
	key: 0,
	class: "draft-label"
}, hs = {
	key: 0,
	role: "alert"
}, gs = {
	key: 1,
	role: "status"
}, _s = {
	key: 0,
	class: "config-note"
}, vs = {
	key: 1,
	class: "config-note",
	role: "alert"
}, ys = {
	key: 2,
	class: "config-note"
}, bs = {
	key: 3,
	class: "config-note"
}, xs = {
	key: 4,
	class: "config-note"
}, Ss = { class: "parameter-card room-config" }, Cs = { class: "parameter-heading" }, ws = { class: "field-description" }, Ts = { class: "room-config-body" }, Es = { class: "parameter-cards" }, Ds = {
	class: "parameter-card",
	"data-price-precision": !0
}, Os = { class: "room-config-body" }, ks = { class: "field-label" }, As = {
	key: 0,
	class: "config-note"
}, js = { class: "parameter-card" }, Ms = { class: "parameter-heading" }, Ns = { class: "field-description" }, Ps = {
	key: 0,
	class: "limit-fields odds-fields"
}, Fs = {
	key: 1,
	class: "limit-fields"
}, Is = { class: "parameter-card" }, Ls = { class: "parameter-heading" }, Rs = { class: "field-description" }, zs = { class: "limit-fields" }, Bs = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "OwnerConfig",
	props: { actor: {} },
	setup(t, { expose: n }) {
		let l = me().api, { siteDirectorySymbols: f } = l, p = ge(), m = t, h = he(), g = i(() => Ji(m.actor)), _ = i(() => !N.value || N.value.operator_id === m.actor.operator_id && N.value.agent_id === m.actor.agent_id && N.value.config_site_id === m.actor.config_site_id && N.value.kind === m.actor.kind);
		function ne(e) {
			return e.platform_enabled || g.value && (e.enabled || !!e.blocked_reason);
		}
		let y = [
			{
				key: "UP_DOWN",
				label: "涨跌预测",
				description: "按系统场次预测结算价格相对开盘价格上涨或下跌"
			},
			{
				key: "HIGH_LOW",
				label: "自选预测",
				description: "用户自主选择方向和预测周期，生成独立预测订单"
			},
			{
				key: "GRID",
				label: "预测网格",
				description: "按时间格与价格区间展示网格预测规则"
			}
		], x = b("UP_DOWN"), S = C([]), ie = b(""), ae = b(""), D = b([]), O = b(!1), k = b(!1), j = b(""), M = b(""), N = C(null), P = b(!1), F = b(!1), se = new ta(), L = !0, R = () => L && Yi(m.actor) && Ti(h.userInfo.id) === m.actor.operator_id && h.userInfo.can_manage_prediction_config === !0 && (h.perms.includes("*") || h.perms.includes("prediction_config:lists")), z = i(() => R() && !P.value && !F.value), ce = i(() => S.value.find((e) => e.symbol === ie.value)), le = b("35"), B = b(0), ue = i(() => D.value.filter((e) => e.owner_enabled && (g.value || e.platform_enabled))), V = i(() => ue.value.find((e) => e.duration_seconds === le.value)), H = i(() => D.value.map((e) => ({
			key: e.duration_seconds,
			label: `${e.observation_seconds}秒`,
			present: e.owner_enabled && (g.value || e.platform_enabled),
			allowed: e.platform_enabled
		})));
		function U(e, t) {
			if (!z.value || k.value || N.value || O.value) return;
			let n = D.value.find((t) => t.duration_seconds === e);
			!n || n.owner_enabled === t || t && !n.platform_enabled || (n.owner_enabled = t, le.value = t ? e : ue.value[0]?.duration_seconds ?? "");
		}
		function fe(e) {
			let t = e.symbol === ie.value ? ue.value.map((e) => e.observation_seconds) : e.rules.filter((e) => e.owner_enabled && (g.value || e.platform_enabled)).map((e) => x.value === "UP_DOWN" ? String(BigInt(e.rule.duration_seconds) - 30n) : e.rule.duration_seconds);
			return t.length ? t.map((e) => `${e}秒`).join(" · ") : "暂无房间";
		}
		let W = b(!0), G = () => JSON.stringify([W.value, D.value.map((e) => [
			e.minimum_stake,
			e.maximum_stake,
			e.owner_enabled,
			e.target_payout_rate,
			e.maximum_odds,
			e.fixed_odds
		])]), K = b(""), pe = i(() => G() !== K.value), _e = C(), ve = i(() => k.value || pe.value || !!N.value || x.value === "GRID" && !!_e.value?.hasBlockingWork);
		n({ hasBlockingWork: ve });
		let ye = b([]), be = i(() => bo(S.value.filter(ne), ye.value, (e) => e.platform_enabled && e.enabled).filter((e) => e.symbol.includes(ae.value.trim().toUpperCase())));
		function xe() {
			try {
				N.value = Sa(localStorage), P.value = ["prediction.agent.pending.v1", "prediction.site.pending.v1"].some((e) => localStorage.getItem(e) !== null), F.value = !1;
			} catch {
				F.value = !0;
			}
		}
		function Se() {
			B.value++, D.value = ce.value ? $i(ce.value, m.actor) : [], W.value = ce.value?.enabled ?? !0, ue.value.some((e) => e.duration_seconds === le.value) || (le.value = ue.value[0]?.duration_seconds ?? ""), K.value = G();
		}
		function Ce(e) {
			ve.value || (ie.value = e, M.value = "", Se());
		}
		function q(e) {
			ve.value || (x.value = e, De());
		}
		function we(e) {
			if (m.actor.kind !== "SITE") return l.ownerConfigurations(e);
			if (!l.scopedSiteConfigurations) throw Error("SITE_UNAVAILABLE");
			return l.scopedSiteConfigurations(m.actor.config_site_id, e);
		}
		function Te(e, t) {
			if (m.actor.kind !== "SITE") return l.ownerConfiguration(e, t);
			if (!l.scopedSiteConfiguration) throw Error("SITE_UNAVAILABLE");
			return l.scopedSiteConfiguration(m.actor.config_site_id, e, t);
		}
		function Ee(e) {
			if (m.actor.kind !== "SITE") return l.saveOwnerConfiguration(e);
			if (!l.saveScopedSiteConfiguration) throw Error("SITE_UNAVAILABLE");
			return l.saveScopedSiteConfiguration(m.actor.config_site_id, e);
		}
		async function De() {
			let e = x.value, t = se.begin(m.actor, e, "");
			if (S.value = [], ie.value = "", Se(), j.value = "", O.value = !1, !(!R() || e === "GRID")) {
				O.value = !0;
				try {
					let [n, r] = await Promise.all([we(e), f()]);
					if (!se.current(t, m.actor, x.value, "") || !R()) return;
					if (!Array.isArray(n.items) || new Set(n.items.map((e) => e.symbol)).size !== n.items.length) throw Error("INVALID_CATALOG");
					for (let t of n.items) if (Qi(t, m.actor), t.game_type !== "GAME_TYPE_" + e) throw Error("WRONG_GAME");
					if (!Array.isArray(r) || !r.every((e) => typeof e == "string")) throw Error("INVALID_SYMBOL_DIRECTORY");
					ye.value = r, S.value = n.items, ie.value = be.value[0]?.symbol ?? "", Se();
				} catch {
					se.current(t, m.actor, x.value, "") && R() && (j.value = "配置加载失败，请重试。");
				} finally {
					se.current(t, m.actor, x.value, "") && (O.value = !1);
				}
			}
		}
		async function Oe() {
			if (xe(), !z.value || k.value) return;
			let e = x.value, t = ie.value;
			try {
				if (!N.value) {
					if (!ce.value) return;
					N.value = wa(localStorage, m.actor, ea(ce.value, m.actor, D.value, "通过玩法配置页面保存配置", Li(), W.value));
				}
				let n = N.value;
				if (!_.value) return;
				k.value = !0, M.value = "";
				let r = await Aa(localStorage, n, (e) => {
					if (!R() || !_.value) throw Error("IDENTITY_CHANGED");
					return Ee(e);
				}, async (e) => {
					if (!R()) throw Error("IDENTITY_CHANGED");
					let t = await Te(e.game_type, e.symbol);
					if (Qi(t.configuration, m.actor), t.configuration.symbol !== e.symbol || t.configuration.game_type !== "GAME_TYPE_" + e.game_type) throw Error("WRONG_CONFIGURATION");
					return t.configuration;
				});
				if (!R() || x.value !== e || ie.value !== t) return;
				xe(), r.status === "success" ? (M.value = r.refreshFailed ? "保存已成功，配置刷新失败，请重新打开页面查看；无需再次保存。" : "配置已保存并生效。", r.latest && r.latest.symbol === ie.value && r.latest.game_type === "GAME_TYPE_" + x.value ? (S.value = S.value.map((e) => e.symbol === ie.value ? r.latest : e), Se()) : (S.value = [], ie.value = "", Se(), j.value = "保存已确认，请重试读取最新配置。")) : (M.value = r.status === "rejected" ? "保存未通过，请重新读取配置后调整。" : "暂未确认保存结果，请稍后使用原请求确认。", r.status === "rejected" && (j.value = "保存被拒绝，请读取最新配置后修改。"));
			} catch (e) {
				M.value = e instanceof Error && e.message === "NO_CHANGES" ? "配置没有变化。" : "无法保存，请检查金额、赔率范围及待确认请求。";
			} finally {
				k.value = !1;
			}
		}
		xe();
		try {
			m.actor.kind === "SITE" && co(vo(sessionStorage, m.actor)) && (x.value = "GRID");
		} catch {
			F.value = !0;
		}
		return De(), oe(() => [
			h.userInfo.id,
			h.token,
			h.userInfo.can_manage_prediction_config,
			h.perms.join("|"),
			m.actor.operator_id,
			m.actor.agent_id,
			m.actor.config_site_id,
			m.actor.kind
		], () => {
			se.close(), S.value = [], D.value = [], K.value = "[]", ie.value = "", M.value = "", xe();
		}, { flush: "sync" }), te(() => {
			L = !1, se.close();
		}), (n, i) => (v(), s("section", Xo, [
			c("nav", Zo, [(v(!0), s(r, null, re(T(y), (e) => (v(), a(T(A), {
				key: e.key,
				type: x.value === e.key ? "primary" : void 0,
				"aria-pressed": x.value === e.key,
				disabled: ve.value,
				onClick: (t) => q(e.key)
			}, {
				default: E(() => [(v(), s("svg", Qo, [e.key === "UP_DOWN" ? (v(), s(r, { key: 0 }, [i[8] ||= c("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}, null, -1), i[9] ||= c("path", { d: "m16 12-4-4-4 4M12 16V8" }, null, -1)], 64)) : e.key === "HIGH_LOW" ? (v(), s(r, { key: 1 }, [i[10] ||= c("path", { d: "m9 9 5 12 1.8-5.2L21 14Z" }, null, -1), i[11] ||= c("path", { d: "M7.2 2.2 8 5.1M5.1 8l-2.9-.8M14 4.1 12 6M6 12l-1.9 2" }, null, -1)], 64)) : (v(), s(r, { key: 2 }, [i[12] ||= c("rect", {
					x: "3",
					y: "3",
					width: "18",
					height: "18",
					rx: "2"
				}, null, -1), i[13] ||= c("path", { d: "M9 3v18M15 3v18M3 9h18M3 15h18" }, null, -1)], 64))])), c("span", $o, [c("strong", null, w(e.label), 1), c("small", null, w(e.description), 1)])]),
				_: 2
			}, 1032, [
				"type",
				"aria-pressed",
				"disabled",
				"onClick"
			]))), 128))]),
			P.value ? (v(), s("p", es, "发现旧配置模式尚未确认的请求，已保留原请求。请联系管理员核对原操作回执后完成迁移，当前暂停新配置保存。")) : o("", !0),
			F.value ? (v(), s("p", ts, "无法读取或保全待确认请求，当前暂停配置保存。")) : o("", !0),
			x.value === "GRID" ? (v(), a(Yo, {
				key: 2,
				ref_key: "gridRef",
				ref: _e,
				actor: t.actor,
				class: "grid-mode"
			}, null, 8, ["actor"])) : (v(), s("div", ns, [c("aside", rs, [
				c("h3", null, [i[14] ||= u("交易对配置 ", -1), c("small", null, w(S.value.filter(ne).length) + " 条", 1)]),
				d(T(e), {
					modelValue: ae.value,
					"onUpdate:modelValue": i[0] ||= (e) => ae.value = e,
					placeholder: "搜索币种",
					"aria-label": "搜索币种",
					clearable: ""
				}, null, 8, ["modelValue"]),
				O.value ? (v(), s("p", is, "正在加载配置…")) : o("", !0),
				j.value ? (v(), s("div", as, [u(w(j.value) + " ", 1), d(T(A), {
					size: "small",
					disabled: k.value || !!N.value || O.value,
					onClick: De
				}, {
					default: E(() => [...i[15] ||= [u("读取最新配置（放弃未保存修改）", -1)]]),
					_: 1
				}, 8, ["disabled"])])) : o("", !0),
				c("div", os, [(v(!0), s(r, null, re(be.value, (e) => (v(), s("div", {
					key: e.symbol,
					class: ee(["symbol-entry", { selected: e.symbol === ie.value }])
				}, [c("button", {
					class: "symbol-option",
					"aria-pressed": e.symbol === ie.value,
					disabled: ve.value,
					onClick: (t) => Ce(e.symbol)
				}, [d(T(p), { symbol: e.symbol }, null, 8, ["symbol"]), c("span", {
					class: "symbol-status",
					title: fe(e)
				}, w(fe(e)), 9, cs)], 8, ss), c("div", ls, [d(T(de), {
					"aria-label": e.symbol === ie.value ? "币种开关" : `${e.symbol} 币种开关`,
					modelValue: e.symbol === ie.value ? W.value : e.enabled,
					disabled: e.symbol !== ie.value || !z.value || k.value || !!N.value || (g.value ? !W.value && !e.can_enable : !e.platform_enabled),
					"onUpdate:modelValue": i[1] ||= (e) => W.value = !!e
				}, null, 8, [
					"aria-label",
					"modelValue",
					"disabled"
				])])], 2))), 128))]),
				!O.value && !j.value && !be.value.length ? (v(), s("p", us, "当前没有可用的交易对配置。")) : o("", !0)
			]), c("main", ds, [
				c("header", fs, [c("div", null, [c("h3", null, w(ie.value || "请选择交易对") + " · " + w(x.value === "UP_DOWN" ? "涨跌预测" : "自选预测"), 1), c("p", null, w(t.actor.kind === "SITE" ? "当前白标生效" : "当前商户生效"), 1)]), c("div", ps, [pe.value ? (v(), s("span", ms, "有未保存修改")) : o("", !0), ce.value || N.value ? (v(), a(T(A), {
					key: 1,
					type: "primary",
					loading: k.value,
					disabled: !z.value || k.value || !N.value && !pe.value || !!N.value && !_.value,
					onClick: Oe
				}, {
					default: E(() => [u(w(N.value ? "确认原保存结果" : "保存配置"), 1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : o("", !0)])]),
				N.value ? (v(), s("p", hs, "存在待确认操作（" + w(N.value.body.symbol) + "），请使用原请求确认结果。" + w(_.value ? "" : "该操作属于另一个账号或站点，需切回原范围处理。"), 1)) : o("", !0),
				M.value ? (v(), s("p", gs, w(M.value), 1)) : o("", !0),
				ce.value ? (v(), s(r, { key: 2 }, [
					g.value ? (v(), s("p", _s, "已保存的开关、限额和赔率保持独立；上级默认值只用于新建配置，当前配置仍受上级启停和限额约束。")) : o("", !0),
					ce.value.blocked_reason ? (v(), s("p", vs, "上级限制已变化，原配置已保留。请调整超出范围的参数后保存；也可以先关闭币种。")) : o("", !0),
					g.value && !ce.value.platform_enabled ? (v(), s("p", ys, "上级已关闭此币种或房间；原配置已保留，当前不能交易。")) : o("", !0),
					g.value ? o("", !0) : (v(), s("p", bs, "可关闭自己的币种或房间，并在平台范围内调整" + w(x.value === "UP_DOWN" ? "限额和目标返奖率，最高赔率使用平台配置" : "限额和赔率") + "。平台修改对应房间后，限额和赔率恢复平台值，您主动关闭的选择会保留。", 1)),
					W.value ? o("", !0) : (v(), s("p", xs, "交易对已关闭；以下房间设置仍会保留。")),
					c("article", Ss, [c("header", Cs, [i[16] ||= c("h4", null, "房间配置", -1), c("p", ws, w(ie.value) + " · " + w(t.actor.kind === "SITE" ? "当前白标生效" : "当前商户生效"), 1)]), c("div", Ts, [
						i[17] ||= c("span", { class: "field-label" }, "支持周期", -1),
						d(Ln, {
							description: `${ie.value} · ${x.value === "UP_DOWN" ? "涨跌预测" : "自选预测"}`,
							rooms: H.value,
							selected: le.value,
							disabled: !z.value || k.value || !!N.value || O.value,
							context: `${t.actor.operator_id}:${t.actor.agent_id}:${t.actor.config_site_id}:${x.value}:${ie.value}:${B.value}`,
							onSelect: i[2] ||= (e) => le.value = e,
							onChange: U
						}, null, 8, [
							"description",
							"rooms",
							"selected",
							"disabled",
							"context"
						]),
						i[18] ||= c("p", { class: "config-note" }, "变更只影响新订单，历史订单保留原配置快照。", -1)
					])]),
					c("div", Es, [c("article", Ds, [i[20] ||= c("header", { class: "parameter-heading" }, [c("h4", null, "价格精度"), c("p", { class: "field-description" }, "由平台统一设置，此处只读")], -1), c("div", Os, [c("p", ks, "价格小数位：" + w(ce.value.rules[0]?.rule.price_rule?.price_decimals === void 0 ? "未设置（沿用原规则）" : `${ce.value.rules[0].rule.price_rule.price_decimals} 位`), 1), i[19] ||= c("p", { class: "config-note" }, "按所选位数截断，不四舍五入；旧订单保留原规则。", -1)])]), V.value ? (v(), s(r, { key: 0 }, [
						V.value.platform_enabled ? o("", !0) : (v(), s("p", As, "平台已关闭此房间，暂不能开启。")),
						c("article", js, [c("header", Ms, [c("h4", null, "赔率配置 · " + w(V.value.observation_seconds) + " 秒", 1), c("p", Ns, w(x.value === "UP_DOWN" ? "上涨/下跌赔率按资金池动态计算" : "下单时锁定当前周期固定赔率，上涨和下跌使用相同赔率。"), 1)]), x.value === "UP_DOWN" ? (v(), s("div", Ps, [d(T(I), { label: `目标返奖率（平台上限 ${T(Sn)(V.value.platform_target_payout_rate, 2)}%，且必须小于 100%）` }, {
							default: E(() => [d(En, {
								"input-component": T(e),
								modelValue: V.value.target_payout_rate,
								"onUpdate:modelValue": i[3] ||= (e) => V.value.target_payout_rate = e,
								percentage: "",
								unit: "%",
								max: T(Sn)(V.value.platform_target_payout_rate, 2),
								disabled: !z.value || k.value || !!N.value,
								"aria-label": `${V.value.observation_seconds}秒目标返奖率`
							}, null, 8, [
								"input-component",
								"modelValue",
								"max",
								"disabled",
								"aria-label"
							])]),
							_: 1
						}, 8, ["label"]), o("", !0)])) : (v(), s("div", Fs, [d(T(I), { label: `固定赔率（平台上限 ${V.value.platform_fixed_odds}，且必须小于 2，含本金）` }, {
							default: E(() => [d(En, {
								"input-component": T(e),
								modelValue: V.value.fixed_odds,
								"onUpdate:modelValue": i[5] ||= (e) => V.value.fixed_odds = e,
								step: "0.01",
								min: "1.01",
								max: V.value.platform_fixed_odds,
								unit: "x",
								disabled: !z.value || k.value || !!N.value,
								"aria-label": `${V.value.observation_seconds}秒固定赔率`
							}, null, 8, [
								"input-component",
								"modelValue",
								"max",
								"disabled",
								"aria-label"
							])]),
							_: 1
						}, 8, ["label"])]))]),
						c("article", Is, [c("header", Ls, [c("h4", null, "下注限制 · " + w(V.value.observation_seconds) + " 秒", 1), c("p", Rs, "平台单笔范围：" + w(V.value.platform_minimum) + " ~ " + w(V.value.platform_maximum) + " USDT。变更不影响已受理订单。", 1)]), c("div", zs, [d(T(I), { label: "单笔最小额" }, {
							default: E(() => [d(En, {
								"input-component": T(e),
								modelValue: V.value.minimum_stake,
								"onUpdate:modelValue": i[6] ||= (e) => V.value.minimum_stake = e,
								min: V.value.platform_minimum,
								max: V.value.maximum_stake,
								disabled: !z.value || k.value || !!N.value,
								"aria-label": `${V.value.observation_seconds}秒单笔最小额`
							}, {
								append: E(() => [...i[21] ||= [u("USDT", -1)]]),
								_: 1
							}, 8, [
								"input-component",
								"modelValue",
								"min",
								"max",
								"disabled",
								"aria-label"
							])]),
							_: 1
						}), d(T(I), { label: "单笔最大额" }, {
							default: E(() => [d(En, {
								"input-component": T(e),
								modelValue: V.value.maximum_stake,
								"onUpdate:modelValue": i[7] ||= (e) => V.value.maximum_stake = e,
								min: V.value.minimum_stake,
								max: V.value.platform_maximum,
								disabled: !z.value || k.value || !!N.value,
								"aria-label": `${V.value.observation_seconds}秒单笔最大额`
							}, {
								append: E(() => [...i[22] ||= [u("USDT", -1)]]),
								_: 1
							}, 8, [
								"input-component",
								"modelValue",
								"min",
								"max",
								"disabled",
								"aria-label"
							])]),
							_: 1
						})])])
					], 64)) : o("", !0)])
				], 64)) : o("", !0)
			])]))
		]));
	}
}), [["__scopeId", "data-v-62b028ac"]]), Vs = class {
	generation = 0;
	controller;
	next() {
		this.controller?.abort(), this.controller = new AbortController();
		let e = ++this.generation, t = this.controller;
		return {
			signal: t.signal,
			current: () => e === this.generation && !t.signal.aborted
		};
	}
	close() {
		this.generation++, this.controller?.abort();
	}
};
"order_no order_id debit_ledger_id settlement_ledger_id agent_id user_id home_site_id order_source game_type symbol market_id direction settlement_asset stake estimated_net_profit estimated_return final_net_profit final_return business_status fund_status unknown_from result config_version created_at_ms accepted_at_ms expire_at_ms result_at_ms settled_at_ms round_id duration_seconds open_price result_price funds_transaction_id agent_profit client_request_id order_version".split(" "), "agent_id round_id generation_id market_id symbol duration_seconds room_code status result cancel_reason config_version settlement_asset pool_share up_pool down_pool locked_up_pool locked_down_pool up_odds down_odds start_price end_price bet_open_at_ms bet_close_at_ms observe_end_at_ms display_end_at_ms draw_at_ms result_at_ms settled_at_ms participant_count order_count total_stake total_return platform_revenue truncation_tail agent_profit player_stake market_maker_stake player_order_count market_maker_order_count".split(" ");
//#endregion
//#region src/prediction-config/agent/views/prediction/game-config/site-directory.ts
function Hs(e) {
	if (typeof e != "string" || !/^[A-Z0-9][A-Z0-9._-]{0,63}$/.test(e)) throw Error("INVALID_SYMBOL_DIRECTORY");
	return e;
}
function Us(e, t) {
	let n = e?.configurations;
	if (!Array.isArray(n)) throw Error("INVALID_SYMBOL_DIRECTORY");
	return [...new Set(n.flatMap((e) => {
		if (!Array.isArray(e?.rules) || !e.rules.length) throw Error("INVALID_SYMBOL_DIRECTORY");
		return e.rules.flatMap((e) => {
			if (e.game_type !== `GAME_TYPE_${t}` || typeof e.enabled_by_default != "boolean") throw Error("INVALID_SYMBOL_DIRECTORY");
			let n = Hs(e.symbol);
			return e.enabled_by_default ? [n] : [];
		});
	}))];
}
function Ws(e, t, n, r = []) {
	let i = new Set(e.map(Hs)), a = new Set(t.map(Hs));
	n.forEach(Hs);
	let o = [...i].filter((e) => a.has(e)), s = new Set(r.map(Hs));
	return bo([...o].map((e) => ({
		symbol: e,
		allowed: i.has(e),
		publicConfigured: a.has(e)
	})), n, (e) => s.has(e.symbol));
}
//#endregion
//#region src/prediction-config/agent/views/prediction/game-config/site-mutation.ts
var Gs = "prediction.site.pending.v1";
function Ks(e, t, n = []) {
	Q(t.every((t) => Object.hasOwn(e, t)) && Object.keys(e).every((e) => t.includes(e) || n.includes(e)), "PENDING_CORRUPT");
}
function qs(e) {
	Q(Z(e), "PENDING_CORRUPT"), Ks(e, [
		"site_id",
		"game_type",
		"symbol",
		"client_request_id",
		"reason",
		"based_on_public_version",
		"based_on_site_version",
		"enabled",
		"overrides"
	]), Q(X(e.site_id, 128) && ["UP_DOWN", "HIGH_LOW"].includes(String(e.game_type)) && X(e.symbol, 64, !0) && X(e.client_request_id, 128) && X(e.reason, 500), "PENDING_CORRUPT"), Q(Y(e.based_on_public_version, !0) && Y(e.based_on_site_version, !0) && typeof e.enabled == "boolean" && Array.isArray(e.overrides), "PENDING_CORRUPT");
	let t = e.game_type === "UP_DOWN";
	Q((t ? e.overrides.length === 5 : e.overrides.length > 0 && e.overrides.length <= 100) && new Set(e.overrides.map((e) => e.duration_seconds)).size === e.overrides.length, "PENDING_CORRUPT");
	for (let n of e.overrides) {
		if (Q(Z(n)), !t) {
			Ks(n, ["duration_seconds"], [
				"enabled",
				"fixed_odds",
				"minimum_stake",
				"maximum_stake"
			]), Q(Y(n.duration_seconds, !0) && (!Object.hasOwn(n, "enabled") || typeof n.enabled == "boolean"), "PENDING_CORRUPT"), Ui(n);
			continue;
		}
		Ks(n, ["duration_seconds", "stake_tiers"], ["enabled"]), Q(Fi.includes(String(n.duration_seconds)) && (!Object.hasOwn(n, "enabled") || typeof n.enabled == "boolean") && Array.isArray(n.stake_tiers) && n.stake_tiers.length === 1, "PENDING_CORRUPT");
		let e = n.stake_tiers[0];
		Q(Z(e)), Ks(e, ["stake_tier_id"], ["enabled", "maximum_stake"]), Q(X(e.stake_tier_id) && (!Object.hasOwn(e, "enabled") || typeof e.enabled == "boolean"), "PENDING_CORRUPT"), Q(!Object.hasOwn(e, "maximum_stake") || Ei(e.maximum_stake) && Di(e.maximum_stake, "1") >= 0, "PENDING_CORRUPT");
	}
}
function Js(e) {
	let t = e.getItem(Gs);
	if (t === null) return null;
	Q(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return Q(Z(n)), Ks(n, [
		"schema",
		"operator_id",
		"agent_id",
		"body",
		"attempted",
		"attempt"
	]), Ri(n), Q(n.schema === "site-v1" && typeof n.attempted == "boolean" && Number.isSafeInteger(n.attempt) && Number(n.attempt) >= 0 && n.attempted === Number(n.attempt) > 0, "PENDING_CORRUPT"), qs(n.body), Ii(n);
}
var Ys = (e, t) => !!e && e.operator_id === t.operator_id && e.agent_id === t.agent_id && JSON.stringify(e.body) === JSON.stringify(t.body);
function Xs(e, t, n) {
	Ri(t), qs(n), Q(Js(e) === null, "PENDING_EXISTS");
	let r = {
		schema: "site-v1",
		...t,
		body: JSON.parse(JSON.stringify(n)),
		attempted: !1,
		attempt: 0
	};
	return e.setItem(Gs, JSON.stringify(r)), Q(Ys(Js(e), r), "PERSISTENCE_UNAVAILABLE"), Ii(r);
}
function Zs(e, t) {
	Ys(Js(e), t) && e.removeItem(Gs);
}
function Qs(e, t) {
	try {
		Q(Z(e) && Z(e.receipt)), Vi(e.stored);
		let n = t.body, r = e.stored, i = e.receipt;
		return Q(r.site_id === n.site_id && r.symbol === n.symbol && r.game_type === "GAME_TYPE_" + n.game_type && r.based_on_public_version === n.based_on_public_version && r.enabled === n.enabled), Q(BigInt(r.version) === BigInt(n.based_on_site_version) + 1n), Q([
			"operation_id",
			"operator_id",
			"client_request_id",
			"capability",
			"action",
			"target_type",
			"target_id",
			"reason",
			"before_json",
			"after_json",
			"result",
			"error_code",
			"created_at_ms",
			"completed_at_ms",
			"source_service",
			"trace_id"
		].every((e) => typeof i[e] == "string")), Q(X(i.operation_id, 256) && X(i.trace_id, 256) && X(i.target_id, 256) && Y(i.created_at_ms) && Y(i.completed_at_ms)), Q(i.operator_id === t.operator_id && i.client_request_id === n.client_request_id && i.reason === n.reason && i.source_service === "agent_admin"), Q(i.result === "OPERATION_RESULT_SUCCEEDED" && i.error_code === "" && i.action === "ADMIN_ACTION_SITE_CONFIG_PUBLISH" && i.capability === "prediction.site.config.publish" && i.target_type === "site_config"), !0;
	} catch {
		return !1;
	}
}
var $s = /* @__PURE__ */ new WeakMap();
function ec(e, t, n) {
	let r = $s.get(e);
	if (r) return Q(Ys(r.pending, t), "PENDING_EXISTS"), r.promise;
	let i = Js(e);
	Q(Ys(i, t), "PENDING_CHANGED");
	let a = i.attempted, o = i.attempt + 1;
	Q(Number.isSafeInteger(o), "ATTEMPT_LIMIT"), e.setItem(Gs, JSON.stringify({
		...i,
		attempted: !0,
		attempt: o
	}));
	let s = Js(e);
	Q(s?.attempt === o && Ys(s, t), "PERSISTENCE_UNAVAILABLE");
	let c = Promise.resolve().then(async () => {
		try {
			let r = await n(t.body);
			return Ys(Js(e), t) ? Qs(r, t) ? (Zs(e, t), {
				status: "success",
				value: r
			}) : {
				status: "unknown",
				error: Error("INVALID_RECEIPT")
			} : {
				status: "superseded",
				error: null
			};
		} catch (n) {
			let r = Js(e);
			if (!Ys(r, t)) return {
				status: "superseded",
				error: n
			};
			let i = Z(n) && n.client_request_id !== void 0 && n.client_request_id !== t.body.client_request_id;
			return !a && r.attempt === o && !i && ha(n) ? (Zs(e, t), {
				status: "rejected",
				error: n
			}) : {
				status: "unknown",
				error: n
			};
		}
	}).finally(() => {
		$s.get(e)?.promise === c && $s.delete(e);
	});
	return $s.set(e, {
		pending: t,
		promise: c
	}), c;
}
async function tc(e, t, n, r) {
	let i = await ec(e, t, n);
	if (i.status !== "success") return i;
	try {
		return {
			...i,
			latest: await r(t.body),
			refreshFailed: !1
		};
	} catch {
		return {
			...i,
			latest: null,
			refreshFailed: !0
		};
	}
}
//#endregion
//#region src/prediction-config/agent/views/prediction/game-config/SiteConfig.vue?vue&type=script&setup=true&lang.ts
var nc = {
	class: "prediction-config prediction-table-page",
	"data-prediction-page": "GAME_CONFIG"
}, rc = {
	class: "game-tabs",
	"aria-label": "选择预测玩法"
}, ic = {
	key: 1,
	role: "alert"
}, ac = {
	key: 2,
	class: "config-layout"
}, oc = ["aria-label"], sc = {
	key: 0,
	class: "catalog-error",
	role: "alert"
}, cc = {
	key: 1,
	role: "status"
}, lc = {
	key: 2,
	class: "catalog-error",
	role: "alert"
}, uc = {
	key: 3,
	role: "status"
}, dc = { class: "symbol-list" }, fc = [
	"data-symbol",
	"aria-pressed",
	"disabled",
	"onClick"
], pc = {
	key: 0,
	class: "symbol-status"
}, mc = {
	key: 1,
	class: "symbol-status"
}, hc = {
	key: 2,
	class: "symbol-status"
}, gc = {
	key: 3,
	class: "symbol-status"
}, _c = {
	key: 4,
	class: "symbol-status"
}, vc = {
	key: 5,
	class: "draft-label"
}, yc = {
	key: 0,
	class: "symbol-all-control"
}, bc = { class: "config-content" }, xc = { class: "config-title" }, Sc = { class: "config-title-actions" }, Cc = {
	key: 0,
	class: "draft-label",
	"data-dirty": "true"
}, wc = {
	key: 0,
	role: "status"
}, Tc = {
	key: 1,
	role: "alert"
}, Ec = {
	key: 2,
	role: "alert"
}, Dc = { key: 3 }, Oc = { key: 1 }, kc = { key: 0 }, Ac = { key: 1 }, jc = { key: 1 }, Mc = {
	key: 7,
	role: "status"
}, Nc = { key: 0 }, Pc = { key: 1 }, Fc = { key: 2 }, Ic = ["aria-label"], Lc = [
	"data-room",
	"aria-pressed",
	"onClick"
], Rc = { class: "room-heading" }, zc = { class: "room-switch" }, Bc = { key: 0 }, Vc = { class: "parameter-cards" }, Hc = {
	key: 0,
	class: "parameter-card"
}, Uc = { class: "parameter-facts" }, Wc = { class: "read-only-label" }, Gc = {
	key: 1,
	class: "parameter-card"
}, Kc = { class: "parameter-facts" }, qc = { "data-field": "fixed_odds" }, Jc = { class: "read-only-label" }, Yc = { class: "parameter-card" }, Xc = { class: "limit-fields" }, Zc = { key: 0 }, Qc = { key: 1 }, $c = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "SiteConfig",
	setup(e) {
		let { siteDirectorySymbols: t, configurations: n, siteConfigurationTargets: l, siteConfiguration: f, saveSiteConfiguration: p, saveConfiguration: m, configuration: h } = me().api, g = ge(), { t: _, te: ne, locale: y } = ve(), x = he(), S = new Vs(), ie = new Vs(), ae = new Vs(), D = new Vs(), O = new Ki(), j = b("UP_DOWN"), N = C(), P = i(() => j.value === "HIGH_LOW" ? "HIGH_LOW" : "UP_DOWN"), F = i(() => y.value === "en-US" ? fe : W), se = (e) => x.perms.includes("*") || x.perms.includes(e), I = i(() => se("prediction_config:lists")), L = I, ce = i(() => Ti(x.userInfo.id)), B = b(null), V = b([]), H = b(""), U = b(""), G = b(""), K = i(() => V.value.find((e) => e.site_id === H.value)?.games.find((e) => e.game_type === P.value)?.symbols ?? []), pe = b([]), _e = b([]), ye = b(""), be = i(() => Ws(K.value, _e.value, pe.value, Object.keys(Se.value).filter((e) => ut(e) && (lt(e) ?? 0) > 0))), xe = i(() => be.value.map((e) => e.symbol).filter((e) => e.toLowerCase().includes(G.value.toLowerCase()))), Se = b({}), Ce = b({}), q = b(null), we = b([]), Te = b(!1), Ee = b("35"), De = b("通过商户玩法配置页面保存配置"), Oe = b(""), ke = b(!1), Ae = b(!1), je = b(""), Me = b(!1), Ne = b(!1), Pe = b(""), Fe = b(""), Ie = b(!1), Le = b(!1), Re = C(null), ze = C(null), Be = C(null), Ve, He, Ue = 0, We = i(() => y.value === "en-US" ? "Enabled" : "启用交易对"), Ge = i(() => Re.value && B.value && Re.value.operator_id === B.value.operator_id && Re.value.agent_id === B.value.agent_id && Re.value.body.site_id === H.value && Re.value.body.game_type === P.value && Re.value.body.symbol === U.value ? Re.value : null), Ke = b(null), qe = i(() => ze.value && Ke.value && ze.value.operator_id === ce.value && ze.value.operator_id === Ke.value.operator_id && ze.value.agent_id === Ke.value.agent_id), Je = i(() => I.value && L.value && B.value?.operator_id === ce.value && !!q.value && (P.value === "UP_DOWN" ? we.value.length === 5 : we.value.length > 0) && !Pe.value && !Re.value && !ze.value && !Le.value && !Ne.value && !Me.value), Ye = i(() => we.value.find((e) => e.duration_seconds === Ee.value)), Xe = i(() => q.value?.effective.rules.find((e) => e.duration_seconds === Ee.value)), Ze = () => JSON.stringify({
			enabled: Te.value,
			rows: we.value.map((e) => ({
				duration: e.duration_seconds,
				enabled: e.enabled,
				maximum: e.maximum_stake,
				minimum: e.minimum_stake,
				odds: e.fixed_odds
			})),
			reason: De.value
		}), Qe = i(() => !!q.value && !!Oe.value && Ze() !== Oe.value);
		function $e() {
			return B.value ? {
				...B.value,
				site_id: H.value,
				game_type: P.value,
				symbol: U.value,
				public_version: q.value?.effective.public_version ?? "",
				site_version: q.value?.stored.version ?? ""
			} : null;
		}
		function et() {
			Le.value = !1;
			try {
				Re.value = Js(sessionStorage);
			} catch {
				Le.value = !0;
			}
			try {
				ze.value = da(sessionStorage);
			} catch {
				Le.value = !0;
			}
		}
		function tt() {
			O.close(), Fe.value = "", Be.value = null, Ve?.abort(), Ne.value = !1;
		}
		function nt() {
			tt(), D.close(), q.value = null, we.value = [], Oe.value = "", De.value = "通过商户玩法配置页面保存配置", Pe.value = "", Ie.value = !1, Me.value = !1, et();
		}
		function rt(e) {
			Hi(e, H.value, U.value, P.value), q.value = e, we.value = Wi(e), Te.value = e.stored.enabled, Se.value[U.value] = e, Ce.value[U.value] = "configured", De.value = "通过商户玩法配置页面保存配置", Oe.value = Ze(), et();
		}
		function it(e) {
			let t = e?.error_code;
			return t === "NOT_FOUND" ? "该交易对尚未配置，请联系管理员完成初始配置。" : t === "UNAVAILABLE" ? "站点配置暂不可用，请稍后刷新。" : t === "PERMISSION_DENIED" ? "当前账号无权访问该站点配置。" : _("predictionPages.loadFailed");
		}
		async function at() {
			nt(), ae.close(), He = void 0, Ae.value = !1;
			let e = ie.next(), t = ce.value, n = x.token;
			if (B.value = null, Ke.value = null, S.close(), ot(), V.value = [], pe.value = [], _e.value = [], ye.value = "", H.value = "", U.value = "", Se.value = {}, Ce.value = {}, je.value = "", ke.value = !1, !(!I.value || !t)) {
				ke.value = !0;
				try {
					let r = await l(e.signal);
					if (!e.current() || ce.value !== t || x.token !== n) return;
					if (zi(r), r.actor.operator_id !== t) throw Error("IDENTITY_UNCONFIRMED");
					B.value = r.actor, V.value = r.sites, Re.value?.operator_id === t && Re.value.agent_id === r.actor.agent_id && (j.value = Re.value.body.game_type);
					let i = Re.value?.operator_id === t ? r.sites.find((e) => e.site_id === Re.value?.body.site_id)?.site_id : void 0;
					(i || r.sites.length === 1) && (H.value = i ?? r.sites[0].site_id);
				} catch (t) {
					e.current() && (je.value = it(t));
				} finally {
					e.current() && (ke.value = !1);
				}
			}
		}
		async function ot() {
			let e = S.next(), t = ze.value, n = ce.value, r = x.token;
			if (!(!t || t.operator_id !== n || !I.value)) try {
				let i = await h(t.body.symbol, e.signal);
				if (!e.current() || ce.value !== n || x.token !== r) return;
				sa(i.configuration) === t.body.symbol && i.configuration.agent_id === t.agent_id && (Ke.value = {
					operator_id: t.operator_id,
					agent_id: t.agent_id
				});
			} catch {}
		}
		async function st() {
			nt();
			let e = ae.next(), r = H.value, i = JSON.stringify(B.value), a = x.token, o = P.value, s = [...K.value];
			if (He = void 0, Se.value = {}, Ce.value = {}, pe.value = [], _e.value = [], ye.value = "", Ae.value = !1, j.value === "GRID" || !B.value || !r || !I.value) return;
			let c = () => e.current() && j.value !== "GRID" && I.value && x.token === a && H.value === r && P.value === o && i === JSON.stringify(B.value), l = /* @__PURE__ */ new Map(), u = {
				current: c,
				requests: l,
				read(t) {
					let n = l.get(t);
					return n || (n = f({
						site_id: r,
						game_type: o,
						symbol: t
					}, e.signal).then((e) => (Hi(e, r, t, o), e)), l.set(t, n)), n;
				}
			};
			He = u;
			for (let e of s) Ce.value[e] = "loading";
			let d = Re.value?.body.game_type === o && Re.value.body.site_id === r ? Re.value.body.symbol : U.value, p = s.includes(d) ? d : s[0] ?? "", m = Re.value?.body.game_type === o && Re.value.body.site_id === r && s.includes(Re.value.body.symbol);
			U.value = m ? p : "", m && ct(!0), Ae.value = !0;
			let h = Promise.allSettled([t(e.signal).then((e) => {
				Ws([], [], e), c() && (pe.value = e);
			}), n(e.signal, o).then((e) => {
				let t = Us(e, o);
				if (c() && (_e.value = t, !m)) {
					let e = s.filter((e) => t.includes(e)), n = e.includes(p) ? p : e[0] ?? "";
					U.value === n ? ct(!0) : U.value = n;
				}
			})]).then((e) => {
				c() && e.some((e) => e.status === "rejected") && (ye.value = "平台币种目录未完整加载，请重试。");
			}), g = s.filter((e) => e !== p);
			await Promise.all([h, ...Array.from({ length: Math.min(3, g.length) }, async () => {
				for (; c() && g.length;) {
					let e = g.shift();
					if (Ce.value[e] !== "loading") continue;
					let t = u.read(e);
					try {
						let n = await t;
						if (!c() || l.get(e) !== t) continue;
						Se.value[e] = n, Ce.value[e] = "configured";
					} catch (n) {
						if (!c() || l.get(e) !== t) continue;
						Ce.value[e] = n?.error_code === "NOT_FOUND" ? "unconfigured" : "unavailable", l.delete(e);
					}
				}
			})]), c() && (Ae.value = !1);
		}
		async function ct(e = !1) {
			nt();
			let t = D.next(), n = {
				site_id: H.value,
				game_type: P.value,
				symbol: U.value
			}, r = JSON.stringify(B.value), i = He;
			if (Ee.value = "35", j.value === "GRID" || !I.value || !B.value || !n.site_id || !K.value.includes(n.symbol)) return;
			Me.value = !0, e || i?.requests.delete(n.symbol);
			let a = e && i?.current() ? i.read(n.symbol) : f(n, t.signal);
			try {
				let e = await a;
				if (i?.current() && i.requests.get(n.symbol) === a && (Se.value[n.symbol] = e, Ce.value[n.symbol] = "configured"), !t.current() || r !== JSON.stringify(B.value) || n.site_id !== H.value || n.game_type !== P.value || n.symbol !== U.value) return;
				rt(e), Ee.value = we.value[0]?.duration_seconds ?? "";
			} catch (e) {
				if (i?.current() && i.requests.get(n.symbol) === a && (Ce.value[n.symbol] = e?.error_code === "NOT_FOUND" ? "unconfigured" : "unavailable", i.requests.delete(n.symbol)), !t.current()) return;
				Ie.value = e?.error_code === "NOT_FOUND", Ce.value[n.symbol] = Ie.value ? "unconfigured" : "unavailable", Pe.value = it(e);
			} finally {
				t.current() && i?.requests.get(n.symbol) === a && i.requests.delete(n.symbol), t.current() && (Me.value = !1);
			}
		}
		function lt(e) {
			let t = e === U.value ? q.value : Se.value[e];
			return t ? e === U.value && (P.value === "UP_DOWN" ? we.value.length === 5 : we.value.length > 0) ? Te.value ? we.value.filter((e) => e.enabled).length : 0 : t.effective.rules.filter((e) => e.enabled && (P.value === "HIGH_LOW" || e.stake_tiers.some((e) => !e.retired && e.enabled))).length : null;
		}
		function ut(e) {
			return e === U.value && q.value ? Te.value : Se.value[e]?.stored.enabled ?? !1;
		}
		function dt(e) {
			return !Je.value || Ce.value[e] !== "configured" || e !== U.value && Qe.value;
		}
		function ft(e) {
			if (K.value.includes(e)) {
				if (e !== U.value && (Qe.value || Ne.value || Re.value)) {
					z.warning("请先处理当前未保存修改或待确认操作");
					return;
				}
				U.value = e;
			}
		}
		async function pt(e, t) {
			if (typeof t != "boolean" || dt(e)) return;
			let n = JSON.stringify(B.value), r = H.value;
			e !== U.value && (U.value = e);
			let i = Ue;
			if (Me.value) {
				let t = He?.requests.get(e);
				if (t) try {
					await t;
				} catch {
					return;
				}
			}
			i !== Ue || n !== JSON.stringify(B.value) || r !== H.value || U.value !== e || !Je.value || (tt(), Te.value = t);
		}
		function mt() {
			B.value && H.value && U.value ? ct() : at();
		}
		async function ht(e) {
			if (j.value !== e && !(j.value === "GRID" && N.value && !await N.value.confirmLeave())) {
				if (j.value !== "GRID" && (Qe.value || Re.value || ze.value)) {
					z.warning("请先处理当前未保存修改或待确认操作");
					return;
				}
				j.value = e, G.value = "", nt(), U.value = "", st();
			}
		}
		async function gt() {
			let e = $e();
			if (!Je.value || !q.value || !B.value || !e) return;
			let t;
			try {
				t = Gi(q.value, we.value, Te.value, De.value, Li());
			} catch {
				Fe.value = _("predictionPages.invalidSave");
				return;
			}
			if (!O.next(e).current($e()) || !I.value || !L.value) return;
			let n;
			try {
				n = Xs(sessionStorage, B.value, t), et();
			} catch {
				Le.value = !0;
				return;
			}
			await vt(n);
		}
		function _t() {
			et(), Ge.value && I.value && L.value && !Ne.value && !Le.value && vt(Ge.value);
		}
		async function vt(e) {
			let t = $e();
			if (!t) return;
			let n = O.next(t), r = new AbortController();
			Ve = r;
			let i = () => n.current($e()) && I.value && L.value;
			Ne.value = !0, Fe.value = "", Be.value = null;
			try {
				let t = await tc(sessionStorage, e, (e) => p(e, r.signal), async (e) => {
					let t = await f({
						site_id: e.site_id,
						game_type: e.game_type,
						symbol: e.symbol
					}, r.signal);
					return Hi(t, e.site_id, e.symbol, e.game_type), t;
				});
				if (!i()) return;
				et(), t.status === "success" ? (Be.value = t.value.receipt, t.latest ? (rt(t.latest), Pe.value = "", Fe.value = _("predictionPages.saved")) : (q.value = null, we.value = [], Oe.value = "", Pe.value = "已保存，刷新失败。请刷新查看当前配置。", Fe.value = "已保存，刷新失败")) : t.status !== "superseded" && (Fe.value = _("predictionPages." + (t.status === "unknown" ? "pending" : "rejected")) + " · " + wi(t.error?.error_code));
			} catch {
				i() && (et(), Fe.value = _("predictionPages.pending"));
			} finally {
				Ve === r && (Ne.value = !1);
			}
		}
		async function yt() {
			if (et(), !ze.value || !qe.value || !I.value || !L.value || Ne.value || Le.value) return;
			let e = ze.value, t = x.token, n = Ue, r = new AbortController(), i = () => n === Ue && t === x.token && qe.value && I.value && L.value;
			Ve = r, Ne.value = !0;
			try {
				let t = await _a(sessionStorage, e, (e) => m(e, r.signal));
				if (!i()) return;
				et(), Fe.value = t.status === "success" ? "旧版原请求已确认成功。站点设置请单独查看。" : _("predictionPages.pending");
			} catch {
				i() && (et(), Fe.value = _("predictionPages.pending"));
			} finally {
				Ve === r && (Ne.value = !1);
			}
		}
		function bt(e) {
			let t = P.value === "UP_DOWN" ? BigInt(e.observation_seconds) : BigInt(e.duration_seconds);
			return P.value === "HIGH_LOW" && t >= 60n && t % 60n == 0n ? `${t / 60n}分钟` : `${t}秒`;
		}
		function xt(e) {
			let t = e === U.value ? q.value : Se.value[e];
			return t ? Wi(t).map(bt).join(" · ") : "";
		}
		function St(e) {
			return typeof e == "string" || typeof e == "boolean" ? wi(e) : _("predictionPages.notProvided");
		}
		function Ct(e, t) {
			let n = St(t);
			if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return n;
			if (e !== "target_payout_rate") return n + "x";
			let [r, i = ""] = n.split("."), a = r + i, o = r.length + 2;
			return (o >= a.length ? a + "0".repeat(o - a.length) : a.slice(0, o) + "." + a.slice(o)).replace(/^0+(?=\d)/, "") + "%";
		}
		let wt = (e) => ne("predictionPages.fields." + e) ? _("predictionPages.fields." + e) : e;
		return oe(H, () => {
			Ue++, U.value = "", st();
		}, { flush: "sync" }), oe(U, () => {
			Ue++, ct(!0);
		}, { flush: "sync" }), oe(() => [
			x.userInfo.id,
			x.token,
			I.value,
			L.value
		], () => {
			Ue++, tt(), ie.close(), ae.close(), D.close(), S.close(), at();
		}, {
			immediate: !0,
			flush: "sync"
		}), te(() => {
			Ue++, tt(), ie.close(), ae.close(), D.close(), S.close();
		}), (e, t) => (v(), a(T(M), { locale: F.value }, {
			default: E(() => [c("section", nc, [c("nav", rc, [
				d(T(A), {
					type: j.value === "UP_DOWN" ? "primary" : void 0,
					"aria-pressed": j.value === "UP_DOWN",
					onClick: t[0] ||= (e) => ht("UP_DOWN")
				}, {
					default: E(() => [...t[8] ||= [u("涨跌预测", -1), c("small", null, "按系统场次预测结算价格相对开盘价格上涨或下跌", -1)]]),
					_: 1
				}, 8, ["type", "aria-pressed"]),
				d(T(A), {
					type: j.value === "HIGH_LOW" ? "primary" : void 0,
					"aria-pressed": j.value === "HIGH_LOW",
					onClick: t[1] ||= (e) => ht("HIGH_LOW")
				}, {
					default: E(() => [...t[9] ||= [u("自选预测", -1), c("small", null, "用户自主选择方向和预测周期，生成独立预测订单", -1)]]),
					_: 1
				}, 8, ["type", "aria-pressed"]),
				d(T(A), {
					type: j.value === "GRID" ? "primary" : void 0,
					"aria-pressed": j.value === "GRID",
					onClick: t[2] ||= (e) => ht("GRID")
				}, {
					default: E(() => [...t[10] ||= [u("预测网格", -1), c("small", null, "按时间格与价格区间展示网格预测规则", -1)]]),
					_: 1
				}, 8, ["type", "aria-pressed"])
			]), j.value === "GRID" ? (v(), a(Yo, {
				key: 1,
				ref_key: "gridRef",
				ref: N
			}, null, 512)) : (v(), s(r, { key: 0 }, [V.value.length > 1 ? (v(), a(T(ue), {
				key: 0,
				modelValue: H.value,
				"onUpdate:modelValue": t[3] ||= (e) => H.value = e,
				placeholder: "请选择配置站点",
				"aria-label": "配置站点",
				disabled: Ne.value || Qe.value || !!Re.value || !!ze.value
			}, {
				default: E(() => [(v(!0), s(r, null, re(V.value, (e, t) => (v(), a(T(le), {
					key: e.site_id,
					label: `站点配置 ${t + 1}`,
					value: e.site_id
				}, null, 8, ["label", "value"]))), 128))]),
				_: 1
			}, 8, ["modelValue", "disabled"])) : o("", !0), I.value ? (v(), s("div", ac, [c("aside", {
				class: "symbol-directory",
				"aria-label": T(_)("predictionPages.symbolDirectory")
			}, [
				c("h3", null, [t[11] ||= u("交易对配置 ", -1), c("small", null, w(be.value.length) + " 条", 1)]),
				d(T(R), {
					modelValue: G.value,
					"onUpdate:modelValue": t[4] ||= (e) => G.value = e,
					clearable: "",
					"aria-label": T(_)("predictionPages.searchSymbol"),
					placeholder: T(_)("predictionPages.searchSymbol")
				}, null, 8, [
					"modelValue",
					"aria-label",
					"placeholder"
				]),
				ye.value ? (v(), s("p", sc, [u(w(ye.value), 1), d(T(A), {
					size: "small",
					disabled: Qe.value || Ne.value || !!Re.value || Ae.value,
					onClick: st
				}, {
					default: E(() => [...t[12] ||= [u("重试币种目录", -1)]]),
					_: 1
				}, 8, ["disabled"])])) : o("", !0),
				ke.value || Ae.value ? (v(), s("p", cc, w(T(_)("predictionPages.loading")), 1)) : o("", !0),
				je.value ? (v(), s("div", lc, [c("p", null, w(je.value), 1), d(T(A), {
					"data-action": "retry-catalog",
					size: "small",
					disabled: ke.value,
					onClick: at
				}, {
					default: E(() => [u(w(T(_)("predictionPages.retry")), 1)]),
					_: 1
				}, 8, ["disabled"])])) : o("", !0),
				!ke.value && !je.value && !xe.value.length ? (v(), s("p", uc, w(V.value.length ? H.value ? K.value.length ? "没有匹配的交易对。" : "当前站点尚未开放此玩法的交易对配置。" : "请选择配置站点。" : "当前账号暂无预测配置站点授权，请联系管理员配置后刷新。"), 1)) : o("", !0),
				c("div", dc, [(v(!0), s(r, null, re(xe.value, (e) => (v(), s("div", {
					key: e,
					class: ee(["symbol-entry", { selected: e === U.value }])
				}, [c("button", {
					type: "button",
					class: "symbol-option",
					"data-symbol": e,
					"aria-pressed": e === U.value,
					disabled: !K.value.includes(e),
					onClick: (t) => ft(e)
				}, [
					d(T(g), { symbol: e }, null, 8, ["symbol"]),
					K.value.includes(e) ? Ce.value[e] === "loading" ? (v(), s("span", mc, w(T(_)("predictionPages.loading")), 1)) : Ce.value[e] === "unconfigured" ? (v(), s("span", hc, w(T(_)("predictionPages.unconfigured")), 1)) : lt(e) === null ? (v(), s("span", gc, w(T(_)("predictionPages.unavailableConfig")), 1)) : (v(), s("span", _c, w(xt(e)), 1)) : (v(), s("span", pc, w(_e.value.includes(e) ? "未开放配置" : "未配置"), 1)),
					e === U.value && Qe.value ? (v(), s("span", vc, w(T(_)("predictionPages.unsaved")), 1)) : o("", !0)
				], 8, fc), Ce.value[e] === "configured" ? (v(), s("div", yc, [d(T(de), {
					"inline-prompt": "",
					"active-text": "开放",
					"inactive-text": "停用",
					"data-symbol-enabled": e,
					"aria-label": `${e} ${We.value}`,
					"model-value": ut(e),
					disabled: dt(e),
					onChange: (t) => pt(e, t)
				}, null, 8, [
					"data-symbol-enabled",
					"aria-label",
					"model-value",
					"disabled",
					"onChange"
				])])) : o("", !0)], 2))), 128))])
			], 8, oc), c("main", bc, [
				c("header", xc, [c("div", null, [c("h3", null, w(U.value || T(_)("predictionPages.selectSymbol")) + " · " + w(T(_)("predictionPages.games." + P.value)), 1), t[13] ||= c("p", null, "当前商户生效", -1)]), c("div", Sc, [Qe.value ? (v(), s("span", Cc, w(T(_)("predictionPages.unsaved")), 1)) : o("", !0), T(L) ? (v(), a(T(A), {
					key: 1,
					"data-action": "save",
					type: "primary",
					loading: Ne.value,
					disabled: !Je.value,
					onClick: gt
				}, {
					default: E(() => [...t[14] ||= [u("保存配置", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])) : o("", !0)])]),
				Me.value ? (v(), s("p", wc, w(T(_)("predictionPages.loading")), 1)) : o("", !0),
				Pe.value ? (v(), s("p", Tc, [u(w(Pe.value), 1), I.value ? (v(), a(T(A), {
					key: 0,
					disabled: Me.value || ke.value || Ne.value || Qe.value || !!Re.value || !!ze.value,
					onClick: mt
				}, {
					default: E(() => [...t[15] ||= [u("重试", -1)]]),
					_: 1
				}, 8, ["disabled"])) : o("", !0)])) : o("", !0),
				ce.value ? o("", !0) : (v(), s("p", Ec, w(T(_)("predictionPages.identityError")), 1)),
				Ie.value ? (v(), s("p", Dc, "该交易对尚未配置，请联系管理员完成初始配置后刷新。")) : o("", !0),
				ze.value ? (v(), a(T(k), {
					key: 4,
					type: "warning",
					closable: !1,
					title: "存在旧版代理配置待确认请求"
				}, {
					default: E(() => [
						t[17] ||= c("p", null, "旧请求按原协议恢复，不会转换为站点保存。", -1),
						c("p", null, w(ze.value.body.symbol) + " · " + w(ze.value.body.client_request_id), 1),
						qe.value ? (v(), a(T(A), {
							key: 0,
							disabled: Ne.value || !T(L) || Le.value,
							onClick: yt
						}, {
							default: E(() => [...t[16] ||= [u("确认旧版原请求", -1)]]),
							_: 1
						}, 8, ["disabled"])) : (v(), s("p", Oc, "请使用原操作账号恢复该请求。"))
					]),
					_: 1
				})) : o("", !0),
				Le.value ? (v(), a(T(k), {
					key: 5,
					type: "error",
					closable: !1,
					title: T(_)("predictionPages.storageError")
				}, null, 8, ["title"])) : Re.value ? (v(), a(T(k), {
					key: 6,
					type: "warning",
					closable: !1,
					title: T(_)("predictionPages.pending")
				}, {
					default: E(() => [Ge.value ? (v(), s(r, { key: 0 }, [
						c("p", null, [u(w(T(_)("predictionPages.fields.client_request_id")) + ": ", 1), c("code", null, w(Ge.value.body.client_request_id), 1)]),
						c("p", null, w(Ge.value.body.symbol) + " · 站点 " + w(Ge.value.body.site_id) + " · 公共版本 " + w(Ge.value.body.based_on_public_version) + " / 站点版本 " + w(Ge.value.body.based_on_site_version), 1),
						c("ul", null, [(v(!0), s(r, null, re(Ge.value.body.overrides, (e) => (v(), s("li", { key: e.duration_seconds }, [
							u(w(e.duration_seconds) + "s · " + w(e.enabled === void 0 ? "继承原设置" : e.enabled ? T(_)("predictionPages.on") : T(_)("predictionPages.off")) + " · " + w(e.maximum_stake ?? e.stake_tiers?.[0]?.maximum_stake ?? "继承平台设置"), 1),
							e.fixed_odds === void 0 ? o("", !0) : (v(), s("span", kc, " · 固定赔率 " + w(e.fixed_odds) + "x", 1)),
							e.minimum_stake === void 0 ? o("", !0) : (v(), s("span", Ac, " · 最小下注金额 " + w(e.minimum_stake) + " USDT", 1))
						]))), 128))]),
						T(L) ? (v(), a(T(A), {
							key: 0,
							disabled: Ne.value,
							"data-action": "replay",
							onClick: _t
						}, {
							default: E(() => [u(w(T(_)("predictionPages.confirmOriginal")), 1)]),
							_: 1
						}, 8, ["disabled"])) : o("", !0)
					], 64)) : (v(), s("p", jc, w(T(_)("predictionPages.otherPending")), 1))]),
					_: 1
				}, 8, ["title"])) : o("", !0),
				Fe.value ? (v(), s("p", Mc, w(Fe.value), 1)) : o("", !0),
				q.value ? (v(), s(r, { key: 8 }, [
					Te.value ? o("", !0) : (v(), s("p", Nc, "交易对已关闭；以下房间设置仍会保留。")),
					q.value.adjustments.length ? (v(), s("p", Pc, "部分保存值受当前公共配置调整，编辑框保留原设置；实际生效金额见下方。")) : o("", !0),
					T(L) ? o("", !0) : (v(), s("p", Fc, w(T(_)("predictionPages.readOnlyConfig")), 1)),
					c("nav", {
						class: "room-tabs",
						"aria-label": P.value === "UP_DOWN" ? T(_)("predictionPages.observationRoom") : "支持周期"
					}, [(v(!0), s(r, null, re(we.value, (e) => (v(), s("button", {
						key: e.duration_seconds,
						type: "button",
						"data-room": e.duration_seconds,
						"aria-pressed": Ee.value === e.duration_seconds,
						class: ee({ active: Ee.value === e.duration_seconds }),
						onClick: (t) => Ee.value = e.duration_seconds
					}, w(bt(e)), 11, Lc))), 128))], 8, Ic),
					Ye.value && Xe.value ? (v(), s(r, { key: 3 }, [
						c("div", Rc, [c("div", null, [c("h3", null, w(bt(Ye.value)) + " · " + w(P.value === "UP_DOWN" ? T(_)("predictionPages.observationRoom") : "支持周期"), 1)]), c("label", zc, [u(w(T(_)("predictionPages.roomEnabled")), 1), d(T(de), {
							modelValue: Ye.value.enabled,
							"onUpdate:modelValue": t[5] ||= (e) => Ye.value.enabled = e,
							"data-field": "enabled",
							"aria-label": T(_)("predictionPages.roomEnabled"),
							disabled: !Je.value,
							onChange: tt
						}, null, 8, [
							"modelValue",
							"aria-label",
							"disabled"
						])])]),
						Ye.value.inherited_enabled ? (v(), s("p", Bc, "房间开关包含继承设置；未修改时保留继承状态。")) : o("", !0),
						c("div", Vc, [
							P.value === "UP_DOWN" ? (v(), s("article", Hc, [
								c("h4", null, w(T(_)("predictionPages.oddsSettings")), 1),
								t[18] ||= c("p", { class: "field-description" }, "上涨赔率 = 1 + 目标返奖率 × 下跌池 ÷（上涨池＋本次下注）；下跌赔率反向计算。下注期间为预计倍率，封盘后锁定最终倍率。", -1),
								c("dl", Uc, [(v(), s(r, null, re(["target_payout_rate", "maximum_odds"], (e) => c("div", { key: e }, [c("dt", null, [u(w(wt(e)), 1), d(yn, { label: wt(e) }, null, 8, ["label"])]), c("dd", null, w(Ct(e, Xe.value[e])), 1)])), 64))]),
								c("span", Wc, w(T(_)("predictionPages.readOnly")), 1)
							])) : o("", !0),
							P.value === "HIGH_LOW" ? (v(), s("article", Gc, [
								c("h4", null, "赔率配置 · " + w(bt(Ye.value)), 1),
								t[20] ||= c("p", { class: "field-description" }, "用户下单时按当前周期固定赔率锁定，订单存储赔率快照；上涨和下跌使用相同赔率。", -1),
								c("dl", Kc, [c("div", null, [c("dt", null, [t[19] ||= u("当前生效固定赔率", -1), d(yn, { label: "固定赔率" })]), c("dd", qc, w(Ct("fixed_odds", Xe.value.fixed_odds)), 1)])]),
								c("span", Jc, w(T(_)("predictionPages.readOnly")), 1)
							])) : o("", !0),
							c("article", Yc, [
								c("h4", null, w(T(_)("predictionPages.stakeLimits")) + " · " + w(bt(Ye.value)), 1),
								t[22] ||= c("p", { class: "field-description" }, "不同周期独立保存下注限制，变更不影响已受理订单。", -1),
								c("div", Xc, [P.value === "UP_DOWN" ? (v(), s("dl", Zc, [c("dt", null, [u(w(T(_)("predictionPages.fields.minimum_stake")), 1), d(yn, {
									label: "单笔最小额",
									content: "用户创建一笔预测订单时允许输入的最低下注金额。本版涨跌预测固定为 1 USDT，由平台统一维护。"
								})]), c("dd", null, w(St(Xe.value.stake_tiers?.find((e) => e.stake_tier_id === Ye.value?.stake_tier_id)?.minimum_stake)), 1)])) : (v(), s("div", Qc, [c("label", null, [u(w(T(_)("predictionPages.fields.minimum_stake")), 1), d(yn, { label: "单笔最小额" })]), d(T(R), {
									modelValue: Ye.value.minimum_stake,
									"onUpdate:modelValue": t[6] ||= (e) => Ye.value.minimum_stake = e,
									"data-field": "minimum_stake",
									"aria-label": T(_)("predictionPages.fields.minimum_stake"),
									disabled: !Je.value,
									onInput: tt
								}, {
									append: E(() => [...t[21] ||= [u("USDT", -1)]]),
									_: 1
								}, 8, [
									"modelValue",
									"aria-label",
									"disabled"
								])])), c("div", null, [
									c("label", null, [u(w(T(_)("predictionPages.fields.maximum_stake")), 1), d(yn, { label: "单笔最大额" })]),
									d(T(R), {
										modelValue: Ye.value.maximum_stake,
										"onUpdate:modelValue": t[7] ||= (e) => Ye.value.maximum_stake = e,
										"data-field": "maximum_stake",
										"aria-label": T(_)("predictionPages.fields.maximum_stake"),
										disabled: !Je.value || !Ye.value.editable,
										onInput: tt
									}, null, 8, [
										"modelValue",
										"aria-label",
										"disabled"
									]),
									c("small", null, "当前生效：" + w(Ye.value.effective_maximum) + "；可填写更高限额，最终由平台范围校验。", 1)
								])])
							])
						])
					], 64)) : o("", !0)
				], 64)) : o("", !0)
			])])) : (v(), s("p", ic, w(T(_)("predictionPages.noPermission")), 1))], 64))])]),
			_: 1
		}, 8, ["locale"]));
	}
}), [["__scopeId", "data-v-3a0bcf9c"]]), el = {
	key: 0,
	role: "alert"
}, tl = {
	key: 1,
	role: "status"
}, nl = {
	key: 2,
	role: "alert"
}, rl = {
	key: 5,
	role: "alert"
}, il = /* @__PURE__ */ f({
	__name: "index",
	setup(e) {
		let t = me().api, n = he(), r = C(null), o = b(!1), c = b(""), l = i(() => n.userInfo.can_manage_prediction_config === !0 && (n.perms.includes("*") || n.perms.includes("prediction_config:lists")) && Ti(n.userInfo.id) !== null), f = i(() => `${n.userInfo.id}:${n.token}`), p = 0, m;
		async function h() {
			let e = ++p, i = f.value;
			if (m?.abort(), r.value = null, c.value = "", o.value = !1, !l.value) return;
			m = new AbortController(), o.value = !0;
			let a = () => e === p && i === f.value && l.value;
			try {
				let e = await t.ownerConfigurationModel(m.signal);
				if (!a()) return;
				if (e.actor?.operator_id !== Ti(n.userInfo.id) || ![
					"AGENT_V1",
					"SITE_V1",
					"OWNER_V1",
					"SCOPED_OWNER_V1"
				].includes(e.config_model)) throw Error("INVALID_MODEL");
				if (e.config_model === "SCOPED_OWNER_V1" && e.actor.kind === "SITE") {
					let n = e.actor;
					if (n.agent_id !== "0" || !Y(n.tenant_id, !0) || !Array.isArray(n.site_ids) || n.site_ids.length !== 1 || !Y(n.site_ids[0], !0)) throw Error("INVALID_SITES");
					let i = Sa(localStorage), o = i?.operator_id === n.operator_id && i.kind === "SITE" ? i.config_site_id : void 0, s = co(vo(sessionStorage, n))?.command.site_id, c = n.site_ids[0];
					if (o && o !== c || s && s !== c || !t.initializeSiteConfigurations) throw Error("SITE_UNAVAILABLE");
					if (!o && !s) {
						let e = await t.initializeSiteConfigurations(c, m.signal);
						if (!a()) return;
						if (!Number.isSafeInteger(e.created) || e.created < 0) throw Error("INVALID_INITIALIZATION");
					}
					r.value = {
						config_model: e.config_model,
						actor: {
							operator_id: n.operator_id,
							agent_id: "0",
							kind: "SITE",
							config_site_id: c,
							tenant_id: n.tenant_id
						}
					};
					return;
				}
				if (!Yi(e.actor) || e.config_model === "SCOPED_OWNER_V1" !== Ji(e.actor)) throw Error("INVALID_MODEL");
				if (e.config_model === "SCOPED_OWNER_V1") {
					if (!t.initializeOwnerConfigurations) throw Error("INITIALIZATION_UNAVAILABLE");
					let e = await t.initializeOwnerConfigurations(m.signal);
					if (!a()) return;
					if (!Number.isSafeInteger(e.created) || e.created < 0) throw Error("INVALID_INITIALIZATION");
				}
				r.value = e;
			} catch {
				a() && (c.value = "无法加载当前账号的配置，请重试。");
			} finally {
				e === p && (o.value = !1);
			}
		}
		return oe(() => [f.value, l.value], () => {
			h();
		}, {
			immediate: !0,
			flush: "sync"
		}), te(() => {
			p++, m?.abort();
		}), (e, t) => l.value ? o.value ? (v(), s("p", tl, "正在读取配置…")) : c.value ? (v(), s("div", nl, [u(w(c.value) + " ", 1), d(T(A), { onClick: t[0] ||= (e) => h() }, {
			default: E(() => [...t[1] ||= [u("重试", -1)]]),
			_: 1
		})])) : r.value?.config_model === "OWNER_V1" || r.value?.config_model === "SCOPED_OWNER_V1" ? (v(), a(Bs, {
			key: `${f.value}:${r.value.actor.config_site_id ?? ""}`,
			actor: r.value.actor
		}, null, 8, ["actor"])) : r.value?.config_model === "SITE_V1" ? (v(), a($c, { key: f.value })) : (v(), s("p", rl, "当前配置模式尚未接入此页面，请联系管理员确认切换；原有未确认请求保持原样。")) : (v(), s("p", el, "当前账号无权管理预测配置。商户端仅代理商主账号可管理；白标账号需有所属站点的玩法配置权限。"));
	}
}), al = {
	class: "mm-prediction-game-config mm-ui",
	"data-mm-component": "prediction-game-config"
}, ol = {
	key: 0,
	role: "alert"
}, sl = /* @__PURE__ */ f({
	name: "MmPredictionGameConfig",
	__name: "MmPredictionGameConfig",
	props: {
		adapter: {},
		context: {},
		symbolComponent: {},
		locale: { default: "zh-CN" },
		translate: {},
		hasTranslation: {},
		registerBeforeLeave: {}
	},
	setup(e) {
		let t = e;
		y(G, {
			get context() {
				return t.context;
			},
			get adapter() {
				return t.adapter;
			},
			get symbolComponent() {
				return t.symbolComponent;
			},
			get locale() {
				return t.locale;
			},
			translate: (e) => t.translate?.(e) ?? e,
			hasTranslation: (e) => t.hasTranslation?.(e) ?? !1,
			registerBeforeLeave: (e) => t.registerBeforeLeave?.(e)
		});
		let n = i(() => `${t.adapter.role}:${t.context.operatorId}:${t.context.identityKey}`), r = i(() => /^[1-9]\d*$/.test(t.context.operatorId) && !!t.context.identityKey);
		return (t, i) => (v(), s("section", al, [r.value ? (v(), a(S(e.adapter.role === "platform" ? Si : il), { key: n.value })) : (v(), s("p", ol, "无法确认当前操作人身份"))]));
	}
});
//#endregion
export { sl as MmPredictionGameConfig };

//# sourceMappingURL=prediction-config.js.map