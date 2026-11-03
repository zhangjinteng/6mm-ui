import { a as e, n as t, t as n } from "./_plugin-vue_export-helper-BDMPCwNE.js";
import { Fragment as r, computed as i, createBlock as a, createCommentVNode as o, createElementBlock as s, createElementVNode as c, createSlots as l, createTextVNode as u, createVNode as d, defineComponent as f, inject as p, mergeModels as m, mergeProps as h, nextTick as g, normalizeClass as ee, normalizeStyle as _, onBeforeUnmount as te, onMounted as ne, openBlock as v, provide as re, ref as y, renderList as ie, renderSlot as b, resolveDynamicComponent as x, shallowRef as S, toDisplayString as C, toRaw as ae, unref as w, useModel as T, watch as oe, withCtx as E, withKeys as D, withModifiers as O } from "vue";
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
import { ElAlert as k, ElButton as A, ElCard as j, ElConfigProvider as M, ElDialog as N, ElDrawer as P, ElEmpty as F, ElForm as se, ElFormItem as I, ElIcon as L, ElInput as R, ElMessage as ce, ElMessageBox as le, ElOption as ue, ElPopover as de, ElSelect as fe, ElSwitch as pe, ElTag as z, useFormDisabled as B } from "element-plus";
import { QuestionFilled as V } from "@element-plus/icons-vue";
import H from "element-plus/es/locale/lang/en";
import U from "element-plus/es/locale/lang/zh-cn";
//#region src/prediction-config/runtime.ts
var W = Symbol("MmPredictionGameConfig");
function G() {
	let e = p(W);
	if (!e) throw Error("Prediction configuration runtime is missing");
	return e;
}
function me() {
	let { adapter: e } = G();
	if (e.role !== "platform") throw Error("Platform configuration adapter required");
	return e;
}
function he() {
	let { adapter: e } = G();
	if (e.role !== "agent") throw Error("Agent configuration adapter required");
	return e;
}
function ge() {
	let e = G();
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
function _e() {
	return G().symbolComponent;
}
function ve(e) {
	G().registerBeforeLeave?.(e);
}
function ye() {
	let e = G();
	return {
		locale: i(() => e.locale),
		t: (t) => e.translate?.(t) ?? t,
		te: (t) => e.hasTranslation?.(t) ?? !1
	};
}
//#endregion
//#region src/prediction-config/platform/views/prediction/format.ts
var be = 9223372036854775807n;
function xe(e, t = be, n = !0) {
	return typeof e == "string" && /^(0|[1-9]\d*)$/.test(e) && BigInt(e) <= t && (n || e !== "0");
}
function Se(e) {
	return e == null ? "未提供" : xe(e, 8640000000000000n) ? new Date(Number(e)).toLocaleString("zh-CN", { hour12: !1 }) : `${String(e)}（无法显示时间）`;
}
function Ce(e, t = "UP_DOWN") {
	let n = {
		35: "5",
		40: "10",
		45: "15",
		60: "30",
		90: "60"
	};
	return t === "UP_DOWN" ? n[e] ? `${n[e]}秒` : `历史周期${e}秒` : `${e}秒`;
}
function we(e) {
	return e instanceof Error || e && typeof e == "object" && "message" in e && typeof e.message == "string" ? e.message : "暂时无法获取确定结果，请稍后刷新或核验原操作";
}
//#endregion
//#region src/prediction-config/platform/views/config/prediction/form.ts
var K = /^(?:0|[1-9]\d*)(?:\.\d+)?$/, Te = /^[1-9]\d*$/, Ee = /^\d+$/, De = [
	"35",
	"40",
	"45",
	"60",
	"90"
], Oe = [
	"5",
	"10",
	"15",
	"30",
	"60"
], ke = (e) => {
	if (e === "GAME_TYPE_UP_DOWN") return "UP_DOWN";
	if (e === "GAME_TYPE_HIGH_LOW") return "HIGH_LOW";
	throw Error(`不支持的预测玩法类型：${e || "空"}`);
}, Ae = (e) => ({
	default_value: e.default_value,
	minimum_value: e.minimum_value,
	maximum_value: e.maximum_value,
	agent_editable: e.agent_editable
}), je = (e) => ({
	default_value: e.default_value,
	minimum_value: e.minimum_value,
	maximum_value: e.maximum_value,
	agent_editable: e.agent_editable
}), Me = (e) => {
	let t = {
		enabled_by_default: e.enabled_by_default,
		display_order: e.display_order,
		minimum_stake: Ae(e.minimum_stake),
		maximum_stake: Ae(e.maximum_stake),
		retired: e.retired
	};
	return e.stake_tier_id && (t.stake_tier_id = e.stake_tier_id), t;
}, Ne = (e, t) => {
	let n = e.stake_tiers ?? [], r = n.find((e) => !e.retired) ?? n[0], i = e[t] ?? r?.[t];
	if (!i) throw Error(`周期 ${e.duration_seconds || "--"} 秒缺少${t === "minimum_stake" ? "最低" : "最高"}下注限制配置，请刷新后重试`);
	return i;
}, Pe = (e) => {
	let t = {
		duration_seconds: e.duration_seconds,
		enabled_by_default: e.enabled_by_default,
		minimum_stake: Ae(Ne(e, "minimum_stake")),
		maximum_stake: Ae(Ne(e, "maximum_stake")),
		settlement_display_seconds: e.settlement_display_seconds,
		price_rule: {
			max_age_milliseconds: e.price_rule.max_age_milliseconds,
			late_arrival_grace_milliseconds: e.price_rule.late_arrival_grace_milliseconds,
			price_decimals: e.price_rule.price_decimals === void 0 ? 3 : e.price_rule.price_decimals
		}
	};
	e.market_id && (t.market_id = e.market_id), e.bet_open_seconds && (t.bet_open_seconds = je(e.bet_open_seconds)), e.target_payout_rate && (t.target_payout_rate = Ae(e.target_payout_rate)), e.minimum_odds && (t.minimum_odds = {
		default_value: "1",
		minimum_value: "1",
		maximum_value: "1",
		agent_editable: !1
	}), e.maximum_odds && (t.maximum_odds = Ae(e.maximum_odds)), e.fixed_odds && (t.fixed_odds = Ae(e.fixed_odds));
	let n = e.stake_tiers ?? [];
	return n.length > 0 && (t.stake_tiers = n.map(Me)), t;
};
function Fe(e) {
	let t = e.rules.map(Pe);
	if (new Set(t.map((e) => e.duration_seconds)).size !== t.length) throw Error("自选周期重复");
	return Oe.map((e) => {
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
function Ie(e) {
	let t = e.rules[0];
	if (!t) throw Error("当前配置没有可编辑周期");
	return {
		game_type: ke(t.game_type),
		symbol: t.symbol,
		based_on_template_version: e.template_version,
		enabled: Xe(e),
		rules: (t.game_type === "GAME_TYPE_HIGH_LOW" ? Fe(e) : e.rules.map(Pe)).map((t) => ({
			...t,
			enabled_by_default: Ye(e) || t.enabled_by_default
		}))
	};
}
function Le(e, t, n) {
	e = Be(e);
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
function Re(e, t = e.is_new === !0) {
	e = Be(e);
	let n = [];
	e.symbol || n.push("交易对不能为空"), xe(e.based_on_template_version) || n.push("配置版本无效"), e.rules.length === 0 && n.push("至少保留一个周期"), e.game_type === "UP_DOWN" && [...e.rules.map((e) => e.duration_seconds)].sort().join(",") !== De.join(",") && n.push("涨跌配置必须包含5、10、15、30、60秒五个固定房间"), e.game_type === "HIGH_LOW" && [...e.rules.map((e) => e.duration_seconds)].sort().join(",") !== [...Oe].sort().join(",") && n.push("自选配置必须包含5、10、15、30、60秒五个固定房间"), new Set(e.rules.map((e) => e.price_rule.price_decimals)).size > 1 && n.push("同一币种各周期的价格小数位必须一致");
	let r = /* @__PURE__ */ new Set();
	return e.rules.forEach((i) => {
		let a = `${i.duration_seconds || "--"} 秒周期`;
		Te.test(i.duration_seconds) || n.push(`${a}的周期必须是正整数`), r.has(i.duration_seconds) && n.push(`周期 ${i.duration_seconds} 秒重复`), r.add(i.duration_seconds);
		let o = i.price_rule.price_decimals;
		o !== void 0 && (typeof o != "number" || !Number.isInteger(o) || o < 0 || o > 8) && n.push("价格小数位必须是0～8的整数"), Ve(i.settlement_display_seconds, `${a}的结算展示时间`, n), Ve(i.price_rule.max_age_milliseconds, `${a}的行情最大年龄`, n), Ve(i.price_rule.late_arrival_grace_milliseconds, `${a}的行情延迟宽限`, n), Ue(i.minimum_stake, a, "最低下注额", n), Ue(i.maximum_stake, a, "最高下注额", n);
		let s = i.minimum_stake?.default_value, c = i.maximum_stake?.default_value, l = /^(0|[1-9]\d{0,17})(\.\d{1,18})?$/;
		typeof s != "string" || typeof c != "string" || !l.test(s) || !l.test(c) || We(s, "0") <= 0 || We(c, "0") <= 0 ? n.push(`${a}的单笔限额必须为正数，整数及小数最多18位`) : We(s, c) > 0 && n.push(`${a}的最小额不能大于最大额`), e.game_type === "UP_DOWN" ? (((e, t) => !!e && e.agent_editable === !1 && [
			e.minimum_value,
			e.default_value,
			e.maximum_value
		].every((e) => typeof e == "string" && K.test(e) && We(e, t) === 0))(i.bet_open_seconds, "30") || n.push("下注开放固定30秒且不可由代理调整"), (!t && !i.market_id || i.stake_tiers?.filter((e) => !e.retired).length !== 1) && n.push("房间配置不完整，请重新加载"), i.stake_tiers?.filter((e) => !e.retired).forEach((e) => {
			!t && !e.stake_tier_id && n.push("房间标识无效");
		}), [
			i.target_payout_rate,
			i.minimum_odds,
			i.maximum_odds
		].some((e) => e?.agent_editable !== !1) && n.push("返奖率和赔率不能由代理调整"), He(i.bet_open_seconds, a, "下注开放时间", n), Ue(i.target_payout_rate, a, "目标返奖率", n), typeof i.target_payout_rate?.default_value == "string" && K.test(i.target_payout_rate.default_value) && We(i.target_payout_rate.default_value, "1") >= 0 && n.push(`${a}的目标返奖率必须小于 100%`), Ue(i.minimum_odds, a, "最低赔率", n), Ue(i.maximum_odds, a, "最高赔率", n), i.stake_tiers?.length || n.push(`${a}的房间配置不完整`), i.stake_tiers?.forEach((e, t) => {
			let r = `${a}历史设置 ${t + 1}`;
			Ue(e.minimum_stake, r, "最低下注额", n), Ue(e.maximum_stake, r, "最高下注额", n);
		})) : (Ue(i.fixed_odds, a, "固定赔率", n), typeof i.fixed_odds?.default_value == "string" && K.test(i.fixed_odds.default_value) && We(i.fixed_odds.default_value, "2") >= 0 && n.push(`${a}的固定赔率必须小于 2`));
	}), [...new Set(n)];
}
function ze(e, t, n) {
	if (e.length <= 3) return e.join("；");
	let r = (e) => t === "UP_DOWN" ? String(Number(e) - 30) : e, i = `${n} 秒周期`, a = e.filter((e) => e.startsWith(i)), o = [...new Set(e.flatMap((e) => {
		let t = /^(\d+) 秒周期/.exec(e);
		return t && t[1] !== n ? [t[1]] : [];
	}))], s = [...e.filter((e) => !/^\d+ 秒周期/.test(e)).slice(0, 1), ...a.slice(0, 2)];
	return a.length > 2 && s.push(`${r(n)} 秒周期还有 ${a.length - 2} 项需检查`), o.length && s.push(`请补全 ${o.map(r).join("、")} 秒周期参数`), s.join("；").slice(0, 180);
}
function Be(e) {
	if (!e.is_new) return e;
	let t = structuredClone(e);
	for (let e of t.rules) {
		for (let t of [e.target_payout_rate, e.maximum_odds]) t && (t.minimum_value = t.maximum_value = t.default_value);
		e.fixed_odds && (e.fixed_odds.minimum_value = "1.000000000000000001", e.fixed_odds.maximum_value = e.fixed_odds.default_value);
		for (let t of e.stake_tiers ?? []) t.minimum_stake = structuredClone(e.minimum_stake), t.maximum_stake = structuredClone(e.maximum_stake);
	}
	return t;
}
function Ve(e, t, n) {
	xe(e) || n.push(`${t}必须是非负整数`);
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
	].some((e) => typeof e != "string" || !Ee.test(e))) {
		r.push(`${t}的${n}必须是非负整数`);
		return;
	}
	(We(e.minimum_value, e.default_value) > 0 || We(e.default_value, e.maximum_value) > 0) && r.push(`${t}的${n}默认值必须处于上下限之间`);
}
function Ue(e, t, n, r) {
	if (!e) {
		r.push(`${t}缺少${n}`);
		return;
	}
	if ([
		e.minimum_value,
		e.default_value,
		e.maximum_value
	].some((e) => typeof e != "string" || !K.test(e))) {
		r.push(`${t}的${n}必须是非负十进制字符串`);
		return;
	}
	(We(e.minimum_value, e.default_value) > 0 || We(e.default_value, e.maximum_value) > 0) && r.push(`${t}的${n}默认值必须处于上下限之间`);
}
function We(e, t) {
	let [n, r = ""] = e.split("."), [i, a = ""] = t.split("."), o = n.replace(/^0+(?=\d)/, ""), s = i.replace(/^0+(?=\d)/, "");
	if (o.length !== s.length) return o.length > s.length ? 1 : -1;
	if (o !== s) return o > s ? 1 : -1;
	let c = Math.max(r.length, a.length), l = r.padEnd(c, "0"), u = a.padEnd(c, "0");
	return l === u ? 0 : l > u ? 1 : -1;
}
function Ge(e, t) {
	if (!K.test(e)) return e;
	let [n, r = ""] = e.split("."), i = n + r, a = n.length + t;
	return (a <= 0 ? "0." + "0".repeat(-a) + i : a >= i.length ? i + "0".repeat(a - i.length) : i.slice(0, a) + "." + i.slice(a)).replace(/^0+(?=\d)/, "");
}
var Ke = (e) => Ge(e, 2), qe = (e) => Ge(e, -2);
function Je(e, t, n) {
	e[t].default_value = n;
	for (let t of ["minimum_stake", "maximum_stake"]) e[t].minimum_value = e.minimum_stake.default_value, e[t].maximum_value = e.maximum_stake.default_value;
}
var Ye = (e) => e.symbol_enabled === void 0 && !e.rules.some((e) => e.enabled_by_default), Xe = (e) => e.symbol_enabled ?? e.rules.some((e) => e.enabled), Ze = (e) => e.rules.filter((t) => Ye(e) || t.enabled_by_default).map((e) => e.duration_seconds);
//#endregion
//#region src/prediction-config/platform/views/grid/config/directory.ts
function Qe(e, t) {
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
	return $e([...n.values()], t);
}
function $e(e, t, n = (e) => !!e.enabled) {
	let r = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.trim().toUpperCase();
		r.has(t) || r.set(t, r.size);
	}
	return [...e].sort((e, t) => Number(n(t)) - Number(n(e)) || (r.get(e.symbol) ?? 2 ** 53 - 1) - (r.get(t.symbol) ?? 2 ** 53 - 1) || e.symbol.localeCompare(t.symbol));
}
//#endregion
//#region src/prediction-config/platform/views/config/prediction/creation.ts
var et = (e = !1) => ({
	default_value: "",
	minimum_value: "",
	maximum_value: "",
	agent_editable: e
});
function tt(e, t, n) {
	return {
		is_new: !0,
		game_type: e,
		symbol: t,
		based_on_template_version: n,
		enabled: !1,
		rules: (e === "UP_DOWN" ? De : Oe).map((t) => ({
			duration_seconds: t,
			enabled_by_default: !0,
			minimum_stake: et(!0),
			maximum_stake: et(!0),
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
				target_payout_rate: et(),
				minimum_odds: {
					default_value: "1",
					minimum_value: "1",
					maximum_value: "1",
					agent_editable: !1
				},
				maximum_odds: et(),
				stake_tiers: [{
					enabled_by_default: !0,
					display_order: 1,
					minimum_stake: et(!0),
					maximum_stake: et(!0),
					retired: !1
				}]
			} : { fixed_odds: et(!0) }
		}))
	};
}
function nt(e, t, n) {
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
var rt = (e, t) => e.includes("*") || e.includes(t), it = {
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
it.result, it.sort_direction;
//#endregion
//#region src/prediction-config/platform/views/grid/config/journal.ts
var at = /^[1-9]\d*$/;
function ot(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function st(e, t) {
	if (!e) throw Error(t);
}
function ct(e, t) {
	st(Object.keys(e).length === t.length && t.every((t) => Object.hasOwn(e, t)), "PENDING_CORRUPT");
}
function lt(e, t, n) {
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
		st(i.length <= 32768, "PENDING_CORRUPT");
		let a;
		try {
			a = JSON.parse(i);
		} catch {
			throw Error("PENDING_CORRUPT");
		}
		return st(ot(a), "PENDING_CORRUPT"), ct(a, [
			"schema",
			"operator_id",
			"command"
		]), st(a.schema === 1 && typeof a.operator_id == "string" && at.test(a.operator_id), "PENDING_CORRUPT"), t(a.command), r(a);
	}
	function o(n, r, o) {
		st(at.test(r), "IDENTITY_UNCONFIRMED"), st(a(n) === null, "PENDING_EXISTS"), t(o);
		let s = {
			schema: 1,
			operator_id: r,
			command: JSON.parse(JSON.stringify(o))
		};
		n.setItem(e, JSON.stringify(s));
		let c = a(n);
		return st(i(c, s), "PERSISTENCE_UNAVAILABLE"), c;
	}
	function s(e, n) {
		return st(at.test(e), "IDENTITY_UNCONFIRMED"), t(n), r({
			operator_id: e,
			command: structuredClone(n)
		});
	}
	function c(e, n, r, i) {
		return t(n.command), t(i), st(n.operator_id === r && JSON.stringify(n.command) === JSON.stringify(i), "STALE_CONFIRMATION"), o(e, n.operator_id, n.command);
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
		st(i(a(t), r), "PENDING_CHANGED");
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
			if ((ot(n) ? n.operation_status : void 0) === "FAILED" && (o === "save" || o === "recover" && ot(n) && n.error_code === "VERSION_CONFLICT")) {
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
var ut = [
	"parameters_available",
	"parameter_source",
	"stored_parameters",
	"global_parameters_source",
	"default_parameter_source",
	"default_global_parameters_source",
	"default_min_multiplier",
	"default_max_multiplier"
], dt = [
	"target_rtp",
	"min_multiplier",
	"max_multiplier",
	"min_order_amount",
	"max_order_amount"
], ft = (e) => !!e && typeof e == "object" && !Array.isArray(e), pt = (e) => {
	if (!e) throw Error("INVALID_GRID_CONFIGURATION");
}, mt = (e) => typeof e == "string" && /^[1-9][0-9]*$/.test(e) && (e.length < 19 || e.length === 19 && e <= "9223372036854775807");
function ht(e) {
	if (e === null) return null;
	pt(ft(e) && Object.keys(e).length === 3 && e.kind === "GLOBAL" && mt(e.version) && typeof e.effective_from_ms == "string" && /^[0-9]+$/.test(e.effective_from_ms));
	let t = e;
	return {
		kind: "GLOBAL",
		version: t.version,
		effective_from_ms: t.effective_from_ms
	};
}
function gt(e, t) {
	if (!ut.some((t) => t in e)) return;
	if (pt(ut.every((t) => t in e)), e.parameters_available === !1) throw Error("CONFIG_PARAMETERS_UNAVAILABLE");
	pt(e.parameters_available === !0 && [
		"GLOBAL",
		"SITE",
		"MERCHANT"
	].includes(String(e.parameter_source)) && ["GLOBAL", "SITE"].includes(String(e.default_parameter_source))), pt(ft(e.stored_parameters) && Object.keys(e.stored_parameters).length === 5 && dt.every((t) => t in e.stored_parameters));
	let n = e.stored_parameters, r = Object.fromEntries(dt.map((e) => [e, n[e] === null ? null : t(n[e])]));
	pt(Object.values(r).every((t) => e.parameter_source === "GLOBAL" ? t === null : t !== null));
	let i = ht(e.global_parameters_source), a = ht(e.default_global_parameters_source);
	return pt(e.parameter_source === "GLOBAL" == (i !== null) && e.default_parameter_source === "GLOBAL" == (a !== null)), pt(!i || !a || i.version === a.version), {
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
function _t(e) {
	return e.global_parameters_source?.version ?? e.default_global_parameters_source?.version;
}
//#endregion
//#region src/prediction-config/platform/views/grid/config/model.ts
function vt(e, t = !0) {
	let n = structuredClone(e);
	return t && n.layout?.editable && n.layout.price_decimals == null && (n.layout.price_decimals = 3), n;
}
var yt = "grid.config.pending.v1", bt = /^(0|[1-9]\d*)(?:\.(\d+))?$/, xt = /^[1-9]\d*$/, St = /^[A-Z0-9]{2,32}$/, Ct = [
	"site_id",
	"symbol",
	"based_on_layout_version",
	"based_on_site_version",
	"client_request_id",
	"reason",
	"changes"
], wt = [
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
], Tt = [
	"based_on_config_id",
	"based_on_default_version",
	"based_on_default_resolution_epoch"
], Et = [
	"price_band_width",
	"column_duration_seconds",
	"price_decimals"
], Dt = [
	"enabled",
	"target_rtp",
	"min_multiplier",
	"max_multiplier",
	"min_order_amount",
	"max_order_amount"
];
function Ot(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function q(e, t = "INVALID_GRID_CONFIGURATION") {
	if (!e) throw Error(t);
}
function kt(e, t) {
	q(Object.keys(e).length === t.length && Object.keys(e).every((e) => t.includes(e)), "PENDING_CORRUPT");
}
function At(e, t) {
	q(typeof e == "string" && e.length <= 128 && bt.test(e), "INVALID_DECIMAL");
	let [n, r = ""] = e.split("."), i = n.replace(/^0+(?=\d)/, ""), a = r.replace(/0+$/, "");
	return q(t === void 0 || a.length <= t, "INVALID_DECIMAL"), a ? i + "." + a : i;
}
function jt(e) {
	let [t, n = ""] = At(e).split(".");
	return {
		whole: t,
		fraction: n
	};
}
function Mt(e, t) {
	let n = jt(e), r = jt(t);
	if (n.whole.length !== r.whole.length) return n.whole.length > r.whole.length ? 1 : -1;
	if (n.whole !== r.whole) return n.whole > r.whole ? 1 : -1;
	let i = Math.max(n.fraction.length, r.fraction.length), a = n.fraction.padEnd(i, "0"), o = r.fraction.padEnd(i, "0");
	return a === o ? 0 : a > o ? 1 : -1;
}
function Nt(e, t) {
	let { whole: n, fraction: r } = jt(e), i = n + r, a = n.length + t, o;
	o = a <= 0 ? "0." + "0".repeat(-a) + i : a >= i.length ? i + "0".repeat(a - i.length) : i.slice(0, a) + "." + i.slice(a);
	let [s, c = ""] = o.split("."), l = s.replace(/^0+(?=\d)/, "") || "0", u = c.replace(/0+$/, "");
	return u ? l + "." + u : l;
}
function Pt(e) {
	let t = At(e);
	return q(Mt(t, "0") > 0 && Mt(t, "1") <= 0, "INVALID_RTP"), Nt(t, 2);
}
function Ft(e) {
	let t = At(e);
	return q(Mt(t, "0") > 0 && Mt(t, "100") < 0, "INVALID_RTP"), Nt(t, -2);
}
function It(e = globalThis.crypto) {
	q(e && typeof e.getRandomValues == "function", "SECURE_RANDOM_UNAVAILABLE");
	let t = e.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	q(t instanceof Uint8Array && t.length === 16, "SECURE_RANDOM_UNAVAILABLE"), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0")).join("");
	return `${n.slice(0, 8)}-${n.slice(8, 12)}-${n.slice(12, 16)}-${n.slice(16, 20)}-${n.slice(20)}`;
}
function Lt(e) {
	return q(typeof e == "string" && xt.test(e) && Mt(e, "25") <= 0, "INVALID_LAYOUT_DURATION"), e;
}
function Rt(e) {
	let t = Lt(e);
	return q(Mt(t, "10") <= 0, "INVALID_LAYOUT_DURATION"), t;
}
function zt(e, t) {
	let n = At(e, t);
	return q(Mt(n, "0") > 0, "INVALID_LAYOUT_WIDTH"), n;
}
function Bt(e) {
	if (typeof e != "string") return !1;
	let t = /^(?:0|[1-9]\d*)\.(\d+)$/.exec(e)?.[1];
	return t !== void 0 && t.length > 8;
}
function Vt(e) {
	return q(e === null || typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 18, "INVALID_LAYOUT_PRECISION"), e;
}
function Ht(e) {
	return q(typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 8, "INVALID_LAYOUT_PRECISION"), e;
}
function Ut(e, t) {
	t != null && q((At(e).split(".")[1] ?? "").length <= t, "INVALID_LAYOUT_PRECISION");
}
function Wt(e, t) {
	q(5 + (Number(e) + 1) * Number(t) <= 120, "INVALID_LAYOUT_HORIZON");
}
function Gt(e) {
	return q(Ot(e), "INVALID_GRID_LAYOUT"), kt(e, [
		"row_count",
		"column_count",
		"column_duration_seconds",
		"price_band_width",
		"effective_from_ms",
		"editable",
		"affected_site_ids",
		..."price_decimals" in e ? ["price_decimals"] : []
	]), q([
		e.row_count,
		e.column_count,
		e.column_duration_seconds
	].every((e) => typeof e == "string" && e.length <= 128 && xt.test(e)), "INVALID_GRID_LAYOUT"), q(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_LAYOUT"), q(typeof e.editable == "boolean", "INVALID_GRID_LAYOUT"), q(Array.isArray(e.affected_site_ids) && e.affected_site_ids.every((e) => typeof e == "string" && e.length > 0 && e.length <= 64 && e.trim() === e), "INVALID_GRID_LAYOUT"), q(new Set(e.affected_site_ids).size === e.affected_site_ids.length && (!e.editable || e.affected_site_ids.length > 0), "INVALID_GRID_LAYOUT"), {
		row_count: e.row_count,
		column_count: e.column_count,
		column_duration_seconds: e.column_duration_seconds,
		price_band_width: zt(e.price_band_width),
		..."price_decimals" in e ? { price_decimals: Vt(e.price_decimals) } : {},
		effective_from_ms: e.effective_from_ms,
		editable: e.editable,
		affected_site_ids: [...e.affected_site_ids]
	};
}
function Kt(e, t, n = !1) {
	return !!(n && e.layout?.editable && t.layout && Et.some((n) => e.layout[n] !== t.layout[n]));
}
function qt(e) {
	q(Ot(e), "INVALID_GRID_CONFIGURATION"), kt(e, [
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
		..."config_id" in e ? wt : [],
		...ut.filter((t) => t in e)
	]), q(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "INVALID_GRID_CONFIGURATION"), q(typeof e.symbol == "string" && St.test(e.symbol), "INVALID_GRID_CONFIGURATION"), q([e.layout_version, e.site_version].every((e) => typeof e == "string" && xt.test(e)), "INVALID_GRID_CONFIGURATION"), q(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_CONFIGURATION"), q(typeof e.enabled == "boolean", "INVALID_GRID_CONFIGURATION");
	let t = {
		site_id: e.site_id,
		symbol: e.symbol,
		layout_version: e.layout_version,
		site_version: e.site_version,
		effective_from_ms: e.effective_from_ms,
		enabled: e.enabled,
		target_rtp: At(e.target_rtp),
		min_multiplier: At(e.min_multiplier, 2),
		max_multiplier: At(e.max_multiplier, 2),
		min_order_amount: At(e.min_order_amount, 8),
		max_order_amount: At(e.max_order_amount, 8)
	};
	if (q(Mt(t.target_rtp, "0") > 0 && Mt(t.target_rtp, "1") <= 0, "INVALID_GRID_CONFIGURATION"), q(Mt(t.min_multiplier, "1") >= 0 && Mt(t.max_multiplier, t.min_multiplier) >= 0, "INVALID_GRID_CONFIGURATION"), q(Mt(t.min_order_amount, "0") > 0 && Mt(t.max_order_amount, t.min_order_amount) >= 0, "INVALID_GRID_CONFIGURATION"), "config_id" in e) {
		for (let n of [
			"config_id",
			"default_config_id",
			"default_version",
			"default_resolution_epoch"
		]) q(typeof e[n] == "string" && xt.test(e[n]) && Mt(e[n], "9223372036854775807") <= 0), t[n] = e[n];
		q(typeof e.requested_agent_id == "string" && /^(0|[1-9][0-9]*)$/.test(e.requested_agent_id) && Mt(e.requested_agent_id, "9223372036854775807") <= 0), q(e.agent_id === null || e.agent_id === e.requested_agent_id && e.agent_id !== "0"), t.requested_agent_id = e.requested_agent_id, t.agent_id = e.agent_id;
		for (let n of [
			"inherited",
			"default_enabled",
			"effective_enabled"
		]) q(typeof e[n] == "boolean"), t[n] = e[n];
		for (let n of [
			"default_target_rtp",
			"default_min_order_amount",
			"default_max_order_amount"
		]) t[n] = At(e[n]);
	}
	return Object.assign(t, gt(e, At)), "layout" in e && (t.layout = Gt(e.layout)), t;
}
function Jt(e, t, n) {
	let r = qt(e);
	return q(r.site_id === t && r.symbol === n, "INVALID_GRID_TARGET"), r;
}
function Yt(e, t, n, r, i, a = !1) {
	if (Ot(e) && e.site_version === "0") return Xt(e, t, n, r, i, a);
	let o = Ot(e) && Ot(e.layout) ? e.layout.price_band_width : void 0, s = Ot(t) && Ot(t.layout) ? t.layout.price_band_width : void 0;
	q(o === s || !Bt(s), "INVALID_LAYOUT_PRECISION");
	let c = qt(e), l = qt(t);
	q(c.site_id === l.site_id && c.symbol === l.symbol, "INVALID_GRID_TARGET"), q(typeof n == "string" && n.length <= 500 && n.trim().length > 0 && !n.includes("\0"), "INVALID_REASON"), q(typeof r == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(r), "INVALID_REQUEST_ID"), q(c.config_id && c.default_version && c.default_resolution_epoch, "CONFIG_IDENTITY_REQUIRED"), q(wt.every((e) => c[e] === l[e]), "INVALID_GRID_TARGET"), q(JSON.stringify(gt(c, At)) === JSON.stringify(gt(l, At)), "INVALID_GRID_TARGET");
	let u = {};
	for (let e of Dt) c[e] !== l[e] && (u[e] = l[e]);
	for (let e of Et) c.layout?.[e] !== l.layout?.[e] && (q(a && c.layout?.editable && l.layout, "FIELD_FORBIDDEN"), u[e] = l.layout[e]);
	if (c.requested_agent_id !== "0" && !(u.enabled === !1 && Object.keys(u).length === 1) && (q(!l.enabled || c.default_enabled, "PLATFORM_LIMIT"), q(Mt(l.target_rtp, c.default_target_rtp) <= 0 && Mt(l.min_order_amount, c.default_min_order_amount) >= 0 && Mt(l.max_order_amount, c.default_max_order_amount) <= 0, "PLATFORM_LIMIT")), Et.some((e) => e in u)) {
		let e = c.layout;
		"price_decimals" in u && Ht(u.price_decimals), Ut(l.layout.price_band_width, l.layout.price_decimals), zt(u.price_band_width ?? e.price_band_width, 18), "column_duration_seconds" in u && Rt(u.column_duration_seconds);
		let t = Lt(u.column_duration_seconds ?? e.column_duration_seconds);
		q(Mt(e.row_count, "10000") <= 0 && Mt(e.column_count, "10000") <= 0 && Number(e.row_count) * Number(e.column_count) <= 1e4, "INVALID_GRID_LAYOUT"), Wt(e.column_count, t);
	}
	if (!i && ("min_multiplier" in u || "max_multiplier" in u)) throw Error("FIELD_FORBIDDEN");
	return q(Object.keys(u).length > 0, "EMPTY_CHANGES"), {
		site_id: c.site_id,
		symbol: c.symbol,
		based_on_layout_version: c.layout_version,
		based_on_site_version: c.site_version,
		based_on_config_id: c.config_id,
		..._t(c) ? { based_on_global_version: _t(c) } : {},
		based_on_default_version: c.default_version,
		based_on_default_resolution_epoch: c.default_resolution_epoch,
		client_request_id: r,
		reason: n,
		changes: u
	};
}
function Xt(e, t, n, r, i, a) {
	q(i && a && Ot(t) && e.site_id === t.site_id && e.symbol === t.symbol, "INVALID_GRID_TARGET"), q(e.layout_version === t.layout_version && t.site_version === "0", "INVALID_GRID_TARGET"), e.layout_version === "0" && Ot(t.layout) && q(!Bt(t.layout.price_band_width), "INVALID_LAYOUT_PRECISION");
	let o = qt({
		...t,
		enabled: !1,
		site_version: "1",
		layout_version: e.layout_version === "0" ? "1" : e.layout_version
	}), s = { enabled: !1 };
	for (let e of Dt) e !== "enabled" && (s[e] = o[e]);
	let c = [
		"row_count",
		"column_count",
		...Et
	];
	if (e.layout_version === "0") {
		q(o.layout, "INVALID_GRID_LAYOUT"), Rt(o.layout.column_duration_seconds);
		for (let e of c) e === "price_decimals" && o.layout.price_decimals == null || (s[e] = o.layout[e]);
		Ut(o.layout.price_band_width, o.layout.price_decimals);
	} else {
		let t = e.layout;
		q(Ot(t) && o.layout && c.every((e) => t[e] === o.layout[e]), "FIELD_FORBIDDEN");
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
	return Zt(l), l;
}
function Zt(e) {
	if (q(Ot(e), "PENDING_CORRUPT"), kt(e, [
		...Ct,
		..."based_on_config_id" in e ? Tt : [],
		..."based_on_global_version" in e ? ["based_on_global_version"] : []
	]), "based_on_global_version" in e && q(typeof e.based_on_global_version == "string" && /^(0|[1-9][0-9]*)$/.test(e.based_on_global_version) && Mt(e.based_on_global_version, "9223372036854775807") <= 0, "PENDING_CORRUPT"), "based_on_config_id" in e) for (let t of Tt) q(typeof e[t] == "string" && xt.test(e[t]) && Mt(e[t], "9223372036854775807") <= 0, "PENDING_CORRUPT");
	q(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "PENDING_CORRUPT"), q(typeof e.symbol == "string" && St.test(e.symbol), "PENDING_CORRUPT");
	let t = e.based_on_site_version === "0";
	q(typeof e.based_on_layout_version == "string" && (xt.test(e.based_on_layout_version) || t && e.based_on_layout_version === "0"), "PENDING_CORRUPT"), q(typeof e.based_on_site_version == "string" && (t || xt.test(e.based_on_site_version)), "PENDING_CORRUPT"), q(typeof e.client_request_id == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(e.client_request_id), "PENDING_CORRUPT"), q(typeof e.reason == "string" && e.reason.length <= 500 && e.reason.trim().length > 0 && !e.reason.includes("\0"), "PENDING_CORRUPT");
	let n = [
		...Dt,
		...Et,
		...t ? ["row_count", "column_count"] : []
	];
	q(Ot(e.changes) && Object.keys(e.changes).length > 0 && Object.keys(e.changes).every((e) => n.includes(e)), "PENDING_CORRUPT");
	for (let [t, n] of Object.entries(e.changes)) t === "enabled" ? q(typeof n == "boolean", "PENDING_CORRUPT") : t === "row_count" || t === "column_count" ? q(typeof n == "string" && /^[1-9]\d{0,4}$/.test(n), "INVALID_GRID_LAYOUT") : t === "price_decimals" ? Ht(n) : t === "price_band_width" ? zt(n, 18) : t === "column_duration_seconds" ? Lt(n) : At(n, t.includes("order_amount") ? 8 : t.includes("multiplier") ? 2 : void 0);
	if (t) {
		q(!("based_on_config_id" in e) && e.changes.enabled === !1, "PENDING_CORRUPT");
		let t = e.based_on_layout_version === "0";
		if (kt(e.changes, [...Dt, ...t ? [
			"row_count",
			"column_count",
			...Et.filter((t) => t !== "price_decimals" || Object.prototype.hasOwnProperty.call(e.changes, t))
		] : []]), qt({
			...Object.fromEntries(Dt.map((t) => [t, e.changes[t]])),
			site_id: e.site_id,
			symbol: e.symbol,
			site_version: "1",
			layout_version: "1",
			effective_from_ms: "0"
		}), q(Mt(e.based_on_layout_version, "9223372036854775807") <= 0, "PENDING_CORRUPT"), t) {
			let t = e.changes;
			q(Number(t.row_count) * Number(t.column_count) <= 1e4, "INVALID_GRID_LAYOUT"), zt(t.price_band_width, 8), Wt(t.column_count, t.column_duration_seconds);
		}
	}
}
function Qt(e, t) {
	return Ot(e) ? e.operation_status === "SUCCEEDED" && typeof e.operation_id == "string" && xt.test(e.operation_id) && e.site_id === t.command.site_id && e.symbol === t.command.symbol && typeof e.layout_version == "string" && xt.test(e.layout_version) && typeof e.site_version == "string" && xt.test(e.site_version) && typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms) && typeof e.changed == "boolean" && [
		"PENDING",
		"DONE",
		"NOT_REQUIRED"
	].includes(String(e.cache_state)) : !1;
}
function $t(e) {
	return Ot(e) && e.error_code === "RECEIPT_UNCONFIRMED" && e.operation_status === "UNKNOWN";
}
var { readPending: en, persistPending: tn, captureSaveReview: nn, persistReviewedCommand: rn, pendingForActor: an, attemptPending: on } = lt(yt, Zt, Qt), sn = class {
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
}, cn = { "config.save": [
	"game_type",
	"symbol",
	"based_on_template_version",
	"platform_template"
] };
function ln(e, t) {
	let n = t;
	return e === "routing.prepare" || e === "routing.cancel" ? n?.change?.receipt : e === "routing.commit" ? n?.binding?.receipt : n?.receipt;
}
var un = class {
	busy = !1;
	key;
	storage;
	action;
	constructor(e, t, n, r) {
		if (!t || !cn[n] || !r) throw Error("无法确认当前操作上下文");
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
			...cn[this.action],
			"reason",
			"client_request_id"
		];
		if (Object.keys(e).some((e) => !t.includes(e)) || typeof e.reason != "string" || !e.reason.trim() || e.reason.length > 500 || typeof e.client_request_id != "string" || !e.client_request_id || e.client_request_id.length > 128) throw Error("操作记录字段无效");
		if (cn[this.action].some((t) => !Object.hasOwn(e, t))) throw Error("操作记录缺少必要字段");
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
			if (Re(r, t.enabled === !1 && r.rules.every((e) => e.market_id === void 0 && (e.stake_tiers ?? []).every((e) => e.stake_tier_id === void 0))).length) throw Error("配置操作记录无效");
		}
	}
	begin(e, t = It()) {
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
			let n = await e(structuredClone(t.body)), i = ln(this.action, n);
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
}, dn = ["data-action"], fn = {
	key: 2,
	class: "pending-summary"
}, pn = { key: 0 }, mn = {
	key: 5,
	role: "status"
}, hn = /*#__PURE__*/ n(/* @__PURE__ */ f({
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
		let r = e, c = n, l = ge(), f = i(() => rt(l.perms, r.permission)), p = y(""), m = y(""), h = y(""), g = y(!1), ee = y(null), _ = y(""), ne = i(() => !!((ee.value || r.newAllowed) && (m.value && !r.hideError || ee.value && !r.hidePendingDetails || !ee.value && !r.automaticReason || f.value && !r.hideButton || h.value && !r.hideSuccess))), re, ie = 0;
		oe(g, (e) => c("busy", e), { flush: "sync" });
		function b() {
			try {
				ee.value = re?.read() ?? null, c("pending", !!ee.value);
			} catch (e) {
				_.value = we(e), m.value = _.value;
			}
		}
		oe(() => [
			r.action,
			r.target,
			String(l.userInfo.id || "")
		], () => {
			if (ie++, g.value = !1, p.value = "", m.value = "", h.value = "", _.value = "", ee.value = null, c("pending", !1), re = void 0, r.target) try {
				re = new un(sessionStorage, String(l.userInfo.id || ""), r.action, r.target), b();
			} catch (e) {
				_.value = we(e), m.value = _.value;
			}
		}, {
			immediate: !0,
			flush: "sync"
		});
		async function x() {
			if (g.value || r.blocked || !f.value || !re || _.value) return;
			let e = re, t = ie, n = String(l.userInfo.id || ""), i = r.action, a = r.target, o = r.send, s = () => t === ie && re === e && n === String(l.userInfo.id || "") && i === r.action && a === r.target;
			m.value = "", h.value = "";
			try {
				if (!ee.value) {
					if (r.disabled || !r.newAllowed) return;
					let t = r.automaticReason?.trim() || p.value.trim();
					if (!t) throw Error("请填写操作原因");
					e.begin({
						...r.payload(),
						reason: t
					}), b();
				}
				g.value = !0;
				let t = await e.attempt(o);
				if (!s()) return;
				h.value = "操作已确认成功", p.value = "", c("success", t);
			} catch (e) {
				s() && (m.value = we(e));
			} finally {
				s() && (g.value = !1, b());
			}
		}
		te(() => {
			ie++, c("busy", !1);
		});
		function S() {
			g.value || ee.value || (h.value = "", _.value || (m.value = ""));
		}
		return t({
			submit: x,
			success: h,
			error: m,
			clearFeedback: S
		}), (t, n) => ne.value ? (v(), s("section", {
			key: 0,
			class: "prediction-write",
			"data-action": e.action
		}, [
			m.value && !e.hideError ? (v(), a(w(k), {
				key: 0,
				title: m.value,
				type: "error",
				closable: !1,
				"show-icon": ""
			}, null, 8, ["title"])) : o("", !0),
			ee.value && !e.hidePendingDetails ? (v(), a(w(k), {
				key: 1,
				title: "上次操作结果尚未确定。核验将使用原操作内容，不会重复创建新的操作。",
				type: "warning",
				closable: !1
			})) : o("", !0),
			ee.value && !e.hidePendingDetails ? (v(), s("div", fn, [u(" 操作号：" + C(ee.value.body.client_request_id), 1), e.automaticReason ? o("", !0) : (v(), s("span", pn, " · 原因：" + C(ee.value.body.reason), 1))])) : !ee.value && !e.automaticReason ? (v(), a(w(I), {
				key: 3,
				label: "操作原因",
				required: ""
			}, {
				default: E(() => [d(w(R), {
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
			f.value && !e.hideButton ? (v(), a(w(A), {
				key: 4,
				type: "primary",
				loading: g.value,
				disabled: g.value || e.blocked || !ee.value && e.disabled || !!_.value,
				onClick: x
			}, {
				default: E(() => [u(C(ee.value ? "核验原操作" : e.label), 1)]),
				_: 1
			}, 8, ["loading", "disabled"])) : o("", !0),
			h.value && !e.hideSuccess ? (v(), s("p", mn, C(h.value), 1)) : o("", !0)
		], 8, dn)) : o("", !0);
	}
}), [["__scopeId", "data-v-e2bd32a3"]]), gn = ["inert", "aria-hidden"], _n = /*#__PURE__*/ n(/* @__PURE__ */ f({
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
		let n = e, r = y(!1), i;
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
		}), te(o), (n, i) => (v(), a(x(e.as), {
			class: ee(["prediction-loading-region", { "is-loading": e.loading }]),
			style: _({ "--prediction-loading-min-height": e.minHeight }),
			"aria-busy": e.loading
		}, {
			default: E(() => [c("div", {
				class: ee(["prediction-loading-region__content", { "is-hidden": e.hideContent }]),
				inert: e.loading || void 0,
				"aria-hidden": e.hideContent || void 0
			}, [b(n.$slots, "default", {}, void 0, !0)], 10, gn), d(w(t), {
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
}), [["__scopeId", "data-v-bd8381e2"]]), vn = { class: "prediction-help-copy" }, yn = ["aria-label", "aria-expanded"], bn = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "ParameterHelp",
	props: {
		label: {},
		content: {}
	},
	setup(e) {
		let t = e, n = y(!1), r = {
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
		return (t, r) => s.value ? (v(), a(w(de), {
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
			}, [d(w(L), null, {
				default: E(() => [d(w(V))]),
				_: 1
			})], 40, yn)]),
			default: E(() => [c("p", vn, C(s.value), 1)]),
			_: 1
		}, 8, ["visible", "title"])) : o("", !0);
	}
}), [["__scopeId", "data-v-b226ed88"]]), xn = /^(0|[1-9][0-9]{0,35})(?:\.[0-9]{1,18})?$/;
function Sn(e, t, n, r = "0", i) {
	let a = [
		e,
		t,
		r,
		...i === void 0 ? [] : [i]
	];
	if (!a.every((e) => xn.test(e))) return null;
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
function Cn(e, t) {
	if (!/^(0|[1-9][0-9]*)(?:\.[0-9]*)?$/.test(e)) return e;
	let [n, r = ""] = e.split("."), i = n + r, a = n.length + t, [o, s = ""] = (a <= 0 ? "0." + "0".repeat(-a) + i : a >= i.length ? i + "0".repeat(a - i.length) : i.slice(0, a) + "." + i.slice(a)).split("."), c = s.replace(/0+$/, "");
	return (o.replace(/^0+(?=\d)/, "") || "0") + (c ? "." + c : "");
}
//#endregion
//#region src/prediction-config/platform/views/prediction/components/DecimalInput.vue?vue&type=script&setup=true&lang.ts
var wn = { class: "decimal-step-controls" }, Tn = ["disabled"], En = ["disabled"], Dn = /*#__PURE__*/ n(/* @__PURE__ */ f({
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
		let n = e, r = R, o = t, s = B(), d = y(n.percentage ? Cn(n.modelValue, 2) : n.modelValue);
		oe(() => [n.modelValue, n.percentage], () => {
			n.percentage && Cn(d.value, -2) === n.modelValue || (d.value = n.percentage ? Cn(n.modelValue, 2) : n.modelValue);
		});
		let f = (e) => Sn(d.value, n.step, e, n.min, n.max), p = i(() => f(1)), m = i(() => f(-1));
		function g(e) {
			if (s.value) return;
			d.value = e;
			let t = n.percentage ? Cn(e, -2) : e;
			o("update:modelValue", t), o("input", t);
		}
		function ee(e) {
			if (s.value) return;
			let t = f(e);
			t !== null && t !== d.value && g(t);
		}
		return (t, n) => (v(), a(x(e.inputComponent || w(r)), h({ class: "prediction-decimal-input" }, t.$attrs, {
			modelValue: d.value,
			disabled: w(s),
			inputmode: t.$attrs.inputmode || "decimal",
			"onUpdate:modelValue": g,
			onKeydown: [n[4] ||= D(O((e) => ee(1), ["prevent"]), ["up"]), n[5] ||= D(O((e) => ee(-1), ["prevent"]), ["down"])]
		}), l({
			suffix: E(() => [c("span", wn, [c("button", {
				type: "button",
				tabindex: "-1",
				"aria-label": "增加数值",
				disabled: w(s) || p.value === null || p.value === d.value,
				onMousedown: n[0] ||= O(() => {}, ["prevent"]),
				onClick: n[1] ||= (e) => ee(1)
			}, [...n[6] ||= [c("svg", {
				viewBox: "0 0 12 12",
				"aria-hidden": "true"
			}, [c("path", { d: "m3 7 3-3 3 3" })], -1)]], 40, Tn), c("button", {
				type: "button",
				tabindex: "-1",
				"aria-label": "减少数值",
				disabled: w(s) || m.value === null || m.value === d.value,
				onMousedown: n[2] ||= O(() => {}, ["prevent"]),
				onClick: n[3] ||= (e) => ee(-1)
			}, [...n[7] ||= [c("svg", {
				viewBox: "0 0 12 12",
				"aria-hidden": "true"
			}, [c("path", { d: "m3 5 3 3 3-3" })], -1)]], 40, En)])]),
			_: 2
		}, [e.unit || t.$slots.append ? {
			name: "append",
			fn: E(() => [b(t.$slots, "append", {}, () => [u(C(e.unit), 1)], !0)]),
			key: "0"
		} : void 0]), 1040, [
			"modelValue",
			"disabled",
			"inputmode"
		]));
	}
}), [["__scopeId", "data-v-ecdf8293"]]), On = ["aria-label"], kn = { class: "prediction-constraint__title" }, An = {
	key: 0,
	class: "constraint-description"
}, jn = /*#__PURE__*/ n(/* @__PURE__ */ f({
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
		let n = t, r = T(t, "modelValue"), a = i({
			get: () => n.percentage ? Ke(r.value[n.field]) : r.value[n.field],
			set: (e) => {
				let t = r.value[n.field], i = n.percentage ? qe(e) : e;
				n.field === "default_value" && r.value.maximum_value === t && (n.agentLocked && r.value.minimum_value === t && (r.value.minimum_value = i), r.value.maximum_value = i), r.value[n.field] = i;
			}
		});
		return (n, r) => (v(), s("div", {
			class: ee(["prediction-constraint", { "is-compact": t.compact }]),
			role: "group",
			"aria-label": t.title
		}, [
			c("div", kn, [u(C(t.title), 1), d(bn, { label: t.title }, null, 8, ["label"])]),
			d(Dn, {
				"input-component": w(e),
				step: t.percentage ? "1" : "0.01",
				modelValue: a.value,
				"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
				"aria-label": t.title,
				disabled: t.disabled
			}, l({ _: 2 }, [t.percentage || t.unit ? {
				name: "append",
				fn: E(() => [u(C(t.percentage ? "%" : t.unit), 1)]),
				key: "0"
			} : void 0]), 1032, [
				"input-component",
				"step",
				"modelValue",
				"aria-label",
				"disabled"
			]),
			t.description ? (v(), s("p", An, C(t.description), 1)) : o("", !0)
		], 10, On));
	}
}), [["__scopeId", "data-v-a22ded5a"]]), Mn = { class: "fixed-room-controls" }, Nn = {
	class: "room-tabs",
	role: "group",
	"aria-label": "选择房间或周期"
}, Pn = [
	"data-room-choice",
	"aria-pressed",
	"onClick"
], Fn = [
	"data-room-remove",
	"aria-label",
	"disabled",
	"onClick"
], In = {
	key: 0,
	class: "room-empty"
}, Ln = { class: "dialog-context" }, Rn = /*#__PURE__*/ n(/* @__PURE__ */ f({
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
		let n = e, l = t, f = i(() => n.rooms.filter((e) => e.present)), p = i(() => n.rooms.filter((e) => !e.present && e.allowed)), m = y(""), h = y(), g = y(""), _ = y("");
		function te() {
			m.value = "", h.value = void 0, g.value = "";
		}
		function ne(e) {
			n.disabled || !e.present || (_.value = n.context, h.value = e, m.value = "remove");
		}
		function re() {
			n.disabled || !p.value.length || (_.value = n.context, g.value = p.value[0].key, m.value = "add");
		}
		function b() {
			return !n.disabled && _.value === n.context;
		}
		function x() {
			let e = h.value?.key;
			m.value === "remove" && b() && n.rooms.some((t) => t.key === e && t.present) && l("change", e, !1), te();
		}
		function S() {
			m.value === "add" && b() && p.value.some((e) => e.key === g.value) && l("change", g.value, !0), te();
		}
		return oe(() => n.context, te, { flush: "sync" }), (t, n) => (v(), s("div", Mn, [
			c("div", Nn, [(v(!0), s(r, null, ie(f.value, (t) => (v(), s("span", {
				key: t.key,
				class: ee(["room-tag", { active: e.selected === t.key }])
			}, [c("button", {
				type: "button",
				"data-room-choice": t.key,
				"aria-pressed": e.selected === t.key,
				onClick: (e) => l("select", t.key)
			}, C(t.label), 9, Pn), c("button", {
				type: "button",
				class: "room-remove",
				"data-room-remove": t.key,
				"aria-label": `删除${t.label}房间`,
				disabled: e.disabled,
				onClick: (e) => ne(t)
			}, "×", 8, Fn)], 2))), 128)), d(w(A), {
				class: "room-add",
				"data-room-add": !0,
				disabled: e.disabled || !p.value.length,
				onClick: re
			}, {
				default: E(() => [...n[1] ||= [u("＋ 新增周期", -1)]]),
				_: 1
			}, 8, ["disabled"])]),
			f.value.length ? o("", !0) : (v(), s("p", In, "暂无房间，可从固定周期中新增。保存后生效。")),
			m.value ? (v(), a(w(N), {
				key: 1,
				"model-value": !0,
				title: m.value === "remove" ? "确认删除周期？" : "新增周期",
				width: "460px",
				"append-to-body": "",
				class: "prediction-room-dialog mm-ui",
				"close-on-click-modal": !1,
				"onUpdate:modelValue": te
			}, {
				footer: E(() => [d(w(A), {
					"data-room-cancel": !0,
					onClick: te
				}, {
					default: E(() => [...n[5] ||= [u("取消", -1)]]),
					_: 1
				}), m.value === "remove" ? (v(), a(w(A), {
					key: 0,
					type: "danger",
					"data-room-confirm": !0,
					disabled: e.disabled,
					onClick: x
				}, {
					default: E(() => [...n[6] ||= [u("确认删除", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (v(), a(w(A), {
					key: 1,
					type: "primary",
					"data-room-add-confirm": !0,
					disabled: e.disabled || !g.value,
					onClick: S
				}, {
					default: E(() => [...n[7] ||= [u("确认新增", -1)]]),
					_: 1
				}, 8, ["disabled"]))]),
				default: E(() => [m.value === "remove" ? (v(), s(r, { key: 0 }, [
					c("p", Ln, C(e.description) + " · " + C(h.value?.label), 1),
					n[2] ||= c("p", { class: "dialog-description" }, "删除后该房间将从当前配置中移除，点击保存配置后停止生效。", -1),
					n[3] ||= c("p", { class: "dialog-note" }, "该操作不会影响已创建订单，历史订单仍保留原配置快照。后续可从固定周期中重新添加。", -1)
				], 64)) : (v(), s(r, { key: 1 }, [n[4] ||= c("label", { class: "dialog-label" }, "预测周期", -1), d(w(fe), {
					modelValue: g.value,
					"onUpdate:modelValue": n[0] ||= (e) => g.value = e,
					placeholder: "请选择周期",
					style: { width: "100%" },
					disabled: e.disabled
				}, {
					default: E(() => [(v(!0), s(r, null, ie(p.value, (e) => (v(), a(w(ue), {
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
}), [["__scopeId", "data-v-6b23ed77"]]), zn = { class: "group-heading" }, Bn = { class: "field-caption" }, Vn = { class: "odds-fields" }, Hn = ["data-room"], Un = {
	key: 0,
	class: "rule-heading"
}, Wn = { class: "group-heading" }, Gn = { class: "group-heading" }, Kn = { class: "group-heading" }, qn = { class: "two-fields" }, Jn = {
	key: 1,
	class: "editor-footer"
}, Yn = /*#__PURE__*/ n(/* @__PURE__ */ f({
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
		let { predictionConfigurationDetail: f, predictionConfigurationList: p, predictionConfigurationSave: m } = me().api, h = t, g = y(), _ = y(), ne = y(!1), re = y();
		function b() {
			_.value?.submit();
		}
		function S() {
			re.value?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		let T = l, D = ge(), O = y(!1), M = y(!1), N = y(""), F = y(), L = y(!1), R = i(() => rt(D.perms, "prediction_config:edit")), ce = y(""), le = y("UP_DOWN"), ue = y(""), de = i({
			get: () => F.value?.rules[0]?.price_rule.price_decimals ?? void 0,
			set: (e) => {
				if (!(!F.value || !R.value || !Te.value.ready || L.value || ne.value)) for (let t of F.value.rules) t.price_rule.price_decimals = e ?? null;
			}
		}), fe = y("");
		oe(de, (e) => {
			Number.isNaN(e) || (fe.value = e == null ? "" : String(e));
		}, {
			immediate: !0,
			flush: "sync"
		});
		let B = i({
			get: () => fe.value,
			set: (e) => {
				!F.value || !R.value || !Te.value.ready || L.value || ne.value || (fe.value = e, de.value = e === "" ? void 0 : /^[0-8]$/.test(e) ? Number(e) : NaN);
			}
		}), V = y(!1), H = i(() => F.value?.game_type === "UP_DOWN" ? [...F.value.rules].sort((e, t) => De.indexOf(e.duration_seconds) - De.indexOf(t.duration_seconds)) : F.value?.rules ?? []), U = i(() => H.value.filter((e) => e.enabled_by_default)), W = i(() => H.value.map((e) => ({
			key: e.duration_seconds,
			label: Ce(e.duration_seconds, F.value?.game_type),
			present: e.enabled_by_default,
			allowed: !0
		}))), G = i(() => h.inline ? g.value?.enabled_by_default ? [g.value] : [] : U.value);
		function he(e) {
			g.value = U.value.find((t) => t.duration_seconds === e);
		}
		function _e(e, t) {
			if (!R.value || !Te.value.ready || L.value || ne.value) return;
			let n = H.value.find((t) => t.duration_seconds === e);
			!n || n.enabled_by_default === t || (n.enabled_by_default = t, g.value = t ? n : U.value[0]);
		}
		let ve = y(0), ye = y(0), be = y(""), xe = y(""), Se, K = i(() => String(D.userInfo.id || "")), Te = i(() => ({
			target: ce.value,
			generation: ve.value,
			actor: be.value,
			enabled: F.value?.enabled,
			roomDurations: U.value.map((e) => e.duration_seconds),
			loading: M.value,
			pending: L.value,
			saving: ne.value,
			saveError: _.value?.error || "",
			isNew: !!F.value?.is_new,
			dirty: !!(F.value && xe.value && JSON.stringify(F.value) !== xe.value),
			ready: !!(F.value && !M.value && !N.value && ye.value === ve.value && be.value === K.value && `${F.value.game_type}:${F.value.symbol}` === ce.value)
		}));
		oe(F, () => {
			h.externalSave && !M.value && _.value?.clearFeedback();
		}, {
			deep: !0,
			flush: "sync"
		});
		function Ee(e, t, n, r) {
			return typeof r != "boolean" || !F.value || F.value.is_new || !Te.value.ready || !R.value || !rt(D.perms, "prediction_config:lists") || L.value || ne.value || e !== ce.value || t !== ve.value || n !== K.value ? !1 : (F.value.enabled = r, !0);
		}
		oe(() => [
			K.value,
			rt(D.perms, "prediction_config:lists"),
			R.value
		], () => {
			ve.value++, Se?.abort(), M.value = !1;
		}, { flush: "sync" });
		function Oe(e, t) {
			if (!e.rules.length || e.rules.some((e) => e.game_type !== `GAME_TYPE_${le.value}` || e.symbol !== ue.value)) throw Error("返回配置与当前币种或玩法不匹配，请重新加载");
			let n = g.value?.duration_seconds;
			F.value = Ie(e), V.value = !1, xe.value = JSON.stringify(F.value), ye.value = t, be.value = K.value, g.value = U.value.find((e) => e.duration_seconds === n) || U.value[0];
		}
		async function ke() {
			if (!rt(D.perms, "prediction_config:lists")) return;
			Se?.abort(), Se = new AbortController();
			let e = ++ve.value, t = le.value, n = ue.value;
			M.value = !0, N.value = "";
			try {
				if (V.value) {
					if (!R.value) throw Error("没有配置新增权限");
					let r = await p({}, Se.signal);
					if (e !== ve.value) return;
					let i = nt(r, t, n);
					return i.existing ? Oe(i.existing, e) : (F.value = tt(t, n, i.version), xe.value = JSON.stringify(F.value), ye.value = e, be.value = K.value, g.value = U.value[0]), e;
				}
				let r = await f({
					game_type: t,
					symbol: n
				}, Se.signal);
				if (e === ve.value) return Oe(r.configuration, e), e;
			} catch (t) {
				e === ve.value && (N.value = we(t));
			} finally {
				e === ve.value && (M.value = !1);
			}
		}
		async function Ae(e, t, n, r = !1) {
			if (le.value = e, ue.value = t, ce.value = `${e}:${t}`, V.value = r, F.value = void 0, xe.value = "", g.value = void 0, L.value = !1, O.value = !0, n && rt(D.perms, "prediction_config:lists")) {
				Se?.abort();
				let e = ++ve.value;
				M.value = !1, N.value = "";
				try {
					return Oe(n, e), e;
				} catch (e) {
					N.value = we(e);
					return;
				}
			}
			return await ke();
		}
		function je() {
			if (!F.value) throw Error("请先加载配置");
			let e = Re(ae(F.value));
			if (e.length) throw Error(ze(e, F.value.game_type, g.value?.duration_seconds || F.value.rules[0]?.duration_seconds || ""));
			let { client_request_id: t, reason: n, ...r } = Le(ae(F.value), "", "");
			return r;
		}
		let Me = (e) => m(e);
		function Ne() {
			V.value = !1, T("success"), ke();
		}
		async function Pe() {
			M.value || L.value || ne.value || await ke();
		}
		return te(() => {
			ve.value++, Se?.abort();
		}), n({
			open: Ae,
			focusSave: S,
			saveConfig: b,
			editingState: Te,
			setEnabled: Ee
		}), (n, i) => !t.inline || O.value ? (v(), a(x(t.inline ? "section" : w(P)), {
			key: 0,
			class: ee(["mm-ui", { "prediction-edit-inline": t.inline }]),
			modelValue: O.value,
			"onUpdate:modelValue": i[5] ||= (e) => O.value = e,
			"close-on-click-modal": !1,
			"destroy-on-close": "",
			size: "min(1080px,96vw)",
			title: "玩法配置",
			onClosed: i[6] ||= (e) => T("close")
		}, {
			default: E(() => [
				N.value ? (v(), a(w(k), {
					key: 0,
					title: N.value,
					type: "error",
					closable: !1
				}, null, 8, ["title"])) : o("", !0),
				d(_n, {
					loading: M.value,
					"hide-content": M.value && !F.value,
					"min-height": t.inline ? "0px" : "280px",
					class: "prediction-edit"
				}, {
					default: E(() => [c("div", {
						ref_key: "saveArea",
						ref: re,
						"data-config-save-area": "",
						class: ee(["config-save-area", { "config-save-area--external": t.externalSave }])
					}, [O.value && R.value ? (v(), a(hn, {
						key: 0,
						ref_key: "writeRef",
						ref: _,
						"hide-button": t.externalSave,
						"hide-success": t.externalSave,
						"hide-pending-details": t.externalSave,
						"hide-error": t.externalSave,
						action: "config.save",
						target: ce.value,
						permission: "prediction_config:edit",
						label: "保存配置",
						"automatic-reason": "通过总后台玩法配置页面保存配置",
						disabled: M.value || !Te.value.ready,
						payload: je,
						send: Me,
						onPending: i[0] ||= (e) => L.value = e,
						onBusy: i[1] ||= (e) => ne.value = e,
						onSuccess: Ne
					}, null, 8, [
						"hide-button",
						"hide-success",
						"hide-pending-details",
						"hide-error",
						"target",
						"disabled"
					])) : o("", !0)], 2), F.value ? (v(), s(r, { key: 0 }, [
						F.value.is_new ? (v(), a(w(k), {
							key: 0,
							title: "首次配置需填写全部五个周期的必填参数；保存后币种保持关闭。",
							type: "info",
							closable: !1
						})) : o("", !0),
						d(w(j), {
							shadow: "never",
							class: "room-config"
						}, {
							header: E(() => [c("div", zn, [c("div", null, [c("h3", null, C(F.value.game_type === "UP_DOWN" ? "房间配置" : "周期配置"), 1), c("p", null, C(F.value.symbol) + " · " + C(F.value.game_type === "UP_DOWN" ? "涨跌预测" : "自选预测"), 1)]), t.inline ? o("", !0) : (v(), a(w(pe), {
								key: 0,
								modelValue: F.value.enabled,
								"onUpdate:modelValue": i[2] ||= (e) => F.value.enabled = e,
								disabled: !R.value || L.value || F.value.is_new,
								"active-text": "开放",
								"inactive-text": "停用"
							}, null, 8, ["modelValue", "disabled"]))])]),
							default: E(() => [c("div", Bn, C(F.value.game_type === "UP_DOWN" ? "支持房间" : "支持周期"), 1), d(Rn, {
								description: `${F.value.symbol} · ${F.value.game_type === "UP_DOWN" ? "涨跌预测" : "自选预测"}`,
								rooms: W.value,
								selected: g.value?.duration_seconds || "",
								disabled: !R.value || !Te.value.ready || L.value || ne.value,
								context: `${K.value}:${ce.value}:${ve.value}`,
								onSelect: he,
								onChange: _e
							}, null, 8, [
								"description",
								"rooms",
								"selected",
								"disabled",
								"context"
							])]),
							_: 1
						}),
						d(w(j), {
							shadow: "never",
							class: "config-group"
						}, {
							header: E(() => [...i[7] ||= [c("div", { class: "group-heading" }, [c("div", null, [c("h3", null, "价格精度"), c("p", null, "同一币种全部周期共用，变更只影响后续新场次或订单。")])], -1)]]),
							default: E(() => [d(w(se), { "label-position": "top" }, {
								default: E(() => [c("div", Vn, [d(w(I), { label: "价格小数位" }, {
									default: E(() => [d(Dn, {
										"input-component": w(e),
										modelValue: B.value,
										"onUpdate:modelValue": i[3] ||= (e) => B.value = e,
										min: "0",
										max: "8",
										step: "1",
										unit: "位",
										inputmode: "numeric",
										placeholder: "请输入 0～8 的整数",
										"aria-label": "价格小数位",
										disabled: !R.value || !Te.value.ready || L.value || ne.value
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
						d(w(se), {
							"label-position": "top",
							disabled: !R.value || L.value
						}, {
							default: E(() => [(v(!0), s(r, null, ie(G.value, (n, l) => (v(), s("section", {
								key: n.market_id || l,
								class: "rule",
								"data-room": n.duration_seconds
							}, [
								t.inline ? o("", !0) : (v(), s("div", Un, [c("strong", null, C(w(Ce)(n.duration_seconds, F.value.game_type)) + C(F.value.game_type === "UP_DOWN" ? "房间" : ""), 1)])),
								F.value.game_type === "UP_DOWN" ? (v(), a(w(j), {
									key: 1,
									shadow: "never",
									class: "config-group round-time-summary"
								}, {
									header: E(() => [c("div", Wn, [c("div", null, [c("h3", null, " 场次时间 · " + C(w(Ce)(n.duration_seconds, F.value.game_type)) + "房间 ", 1), i[9] ||= c("p", null, "每个场次的下注开放时间固定为 30 秒", -1)]), d(w(z), { size: "small" }, {
										default: E(() => [u(C(w(Ce)(n.duration_seconds, F.value.game_type)), 1)]),
										_: 2
									}, 1024)])]),
									_: 2
								}, 1024)) : o("", !0),
								d(w(j), {
									shadow: "never",
									class: "config-group"
								}, {
									header: E(() => [c("div", Gn, [c("div", null, [c("h3", null, " 赔率配置 · " + C(w(Ce)(n.duration_seconds, F.value.game_type)), 1), c("p", null, C(F.value.game_type === "UP_DOWN" ? "上涨赔率 = 1 + 目标返奖率 × 下跌池 ÷（上涨池＋本次下注）；下跌赔率反向计算。下注期间为预计倍率，封盘后锁定最终倍率。" : "用户下单时按当前周期固定赔率锁定，订单存储赔率快照"), 1)]), d(w(z), {
										size: "small",
										effect: "plain"
									}, {
										default: E(() => [u(C(F.value.game_type === "UP_DOWN" ? "动态赔率" : "固定赔率"), 1)]),
										_: 1
									})])]),
									default: E(() => [c("div", { class: ee(["odds-fields", { "one-field": F.value.game_type === "HIGH_LOW" }]) }, [F.value.game_type === "HIGH_LOW" && n.fixed_odds ? (v(), a(jn, {
										key: 0,
										modelValue: n.fixed_odds,
										"onUpdate:modelValue": (e) => n.fixed_odds = e,
										compact: "",
										unit: "x",
										title: "固定赔率",
										description: "上涨和下跌使用相同赔率，且必须小于 2"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])) : o("", !0), F.value.game_type === "UP_DOWN" ? (v(), s(r, { key: 1 }, [n.target_payout_rate ? (v(), a(jn, {
										key: 0,
										modelValue: n.target_payout_rate,
										"onUpdate:modelValue": (e) => n.target_payout_rate = e,
										compact: "",
										"agent-locked": "",
										percentage: "",
										title: "目标返奖率",
										description: "例如 90%：按对方资金池的 90% 计算可分配收益，且必须小于 100%"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])) : o("", !0), n.maximum_odds ? (v(), a(jn, {
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
								d(w(j), {
									shadow: "never",
									class: "config-group"
								}, {
									header: E(() => [c("div", Kn, [c("div", null, [c("h3", null, " 下注限制 · " + C(w(Ce)(n.duration_seconds, F.value.game_type)), 1), c("p", null, C(F.value.symbol) + " 当前" + C(F.value.game_type === "UP_DOWN" ? "房间" : "周期") + "的单笔下注范围 ", 1)]), d(w(z), { size: "small" }, {
										default: E(() => [u(C(w(Ce)(n.duration_seconds, F.value.game_type)), 1)]),
										_: 2
									}, 1024)])]),
									default: E(() => [c("div", qn, [d(w(I), { label: "单笔最小额（USDT）" }, {
										label: E(() => [i[10] ||= u("单笔最小额（USDT）", -1), d(bn, {
											label: "单笔最小额",
											content: "此房间允许的最低单笔下注额。商户可在总后台单笔范围内调整自己的最小额和最大额。"
										})]),
										default: E(() => [d(Dn, {
											"input-component": w(e),
											"aria-label": "单笔最小额",
											unit: "USDT",
											"model-value": n.minimum_stake.default_value,
											"onUpdate:modelValue": (e) => w(Je)(n, "minimum_stake", e)
										}, null, 8, [
											"input-component",
											"model-value",
											"onUpdate:modelValue"
										])]),
										_: 2
									}, 1024), d(w(I), { label: "单笔最大额（USDT）" }, {
										label: E(() => [i[11] ||= u("单笔最大额（USDT）", -1), d(bn, {
											label: "单笔最大额",
											content: "此房间允许的最高单笔下注额。修改生效后，对应房间的商户限额重置为总后台范围。"
										})]),
										default: E(() => [d(Dn, {
											"input-component": w(e),
											"aria-label": "单笔最大额",
											unit: "USDT",
											"model-value": n.maximum_stake.default_value,
											"onUpdate:modelValue": (e) => w(Je)(n, "maximum_stake", e)
										}, null, 8, [
											"input-component",
											"model-value",
											"onUpdate:modelValue"
										])]),
										_: 2
									}, 1024)])]),
									_: 2
								}, 1024)
							], 8, Hn))), 128))]),
							_: 1
						}, 8, ["disabled"])
					], 64)) : o("", !0)]),
					_: 1
				}, 8, [
					"loading",
					"hide-content",
					"min-height"
				]),
				N.value || !t.inline || Te.value.dirty ? (v(), s("div", Jn, [
					Te.value.dirty ? (v(), a(w(A), {
						key: 0,
						"data-config-discard": !0,
						disabled: M.value || L.value || ne.value,
						onClick: Pe
					}, {
						default: E(() => [...i[12] ||= [u("放弃修改并重新加载", -1)]]),
						_: 1
					}, 8, ["disabled"])) : o("", !0),
					N.value ? (v(), a(w(A), {
						key: 1,
						disabled: M.value,
						onClick: ke
					}, {
						default: E(() => [...i[13] ||= [u("重试", -1)]]),
						_: 1
					}, 8, ["disabled"])) : o("", !0),
					t.inline ? o("", !0) : (v(), a(w(A), {
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
}), [["__scopeId", "data-v-ff28b192"]]), Xn = { class: "guide-body" }, Zn = { class: "guide-example" }, Qn = { class: "guide-formulas" }, $n = { class: "guide-footer" }, er = /*#__PURE__*/ n(/* @__PURE__ */ f({
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
		let t = T(e, "modelValue"), n = [
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
		return (e, i) => (v(), a(w(N), {
			modelValue: t.value,
			"onUpdate:modelValue": i[1] ||= (e) => t.value = e,
			title: "预测网格玩法说明",
			width: "860px",
			class: "prediction-grid-guide mm-ui",
			"append-to-body": "",
			"destroy-on-close": ""
		}, {
			header: E(() => [...i[2] ||= [c("h2", { class: "guide-title" }, "预测网格玩法说明", -1), c("p", { class: "guide-subtitle" }, "用一个例子看懂格子、命中概率和赔率", -1)]]),
			footer: E(() => [c("div", $n, [i[24] ||= c("span", null, "核心规则：有效时间内，连续有效价格进入或穿过对应价格范围一次，即为命中。", -1), d(w(A), {
				type: "primary",
				onClick: i[0] ||= (e) => t.value = !1
			}, {
				default: E(() => [...i[23] ||= [u("我知道了", -1)]]),
				_: 1
			})])]),
			default: E(() => [c("div", Xn, [
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
					c("article", Zn, [
						i[9] ||= c("h4", null, "举例", -1),
						i[10] ||= c("p", null, "买入格子：BTC 65,010～65,020 · 10:00:04～10:00:06", -1),
						c("p", null, [d(w(z), { type: "success" }, {
							default: E(() => [...i[3] ||= [u("命中", -1)]]),
							_: 1
						}), i[4] ||= u(" 10:00:05 价格到达 65,015，进入了格子价格范围。", -1)]),
						c("p", null, [d(w(z), { type: "success" }, {
							default: E(() => [...i[5] ||= [u("命中", -1)]]),
							_: 1
						}), i[6] ||= u(" 连续有效行情从 65,005 到达 65,025，线段中间穿过了这个格子，也算碰到。", -1)]),
						c("p", null, [d(w(z), { type: "danger" }, {
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
					c("article", Qn, [i[13] ||= c("h4", null, [u("原型计算公式示例 "), c("small", null, "时间单位统一为 500ms")], -1), (v(), s(r, null, ie(n, (e) => c("div", { key: e.title }, [
						c("h4", null, C(e.title), 1),
						c("pre", null, C(e.expression), 1),
						c("p", null, C(e.explanation), 1)
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
function tr(e, t) {
	let n = e, r = (e) => typeof e == "string" && /^(0|[1-9]\d{0,18})$/.test(e) && Mt(e, "9223372036854775807") <= 0;
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
	} : Gt({
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
var nr = {
	class: "grid-config mm-ui",
	"data-grid-config": "platform"
}, rr = { key: 3 }, ir = {
	key: 5,
	class: "pending-bar"
}, ar = { class: "pending-actions" }, or = { class: "grid-layout" }, sr = { class: "symbol-panel" }, cr = { class: "panel-heading" }, lr = {
	key: 1,
	class: "directory-error",
	role: "alert"
}, ur = { class: "symbol-list" }, dr = ["disabled", "onClick"], fr = {
	key: 0,
	class: "symbol-unconfigured"
}, pr = { key: 2 }, mr = { class: "config-panel" }, hr = {
	key: 0,
	class: "config-heading"
}, gr = { "data-config-updated-at": "" }, _r = { key: 0 }, vr = { class: "config-heading__actions" }, yr = { class: "grid-config__parameters" }, br = { class: "parameter-card" }, xr = {
	key: 0,
	class: "field-error",
	role: "alert"
}, Sr = {
	key: 0,
	class: "layout-notice"
}, Cr = {
	key: 0,
	class: "parameter-card",
	"data-price-precision": ""
}, wr = { class: "parameter-card" }, Tr = { class: "parameter-card" }, Er = { class: "parameter-heading" }, Dr = { class: "parameter-description" }, Or = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "index",
	setup(t, { expose: n }) {
		let { gridConfigSymbols: l, gridConfigCatalog: f, gridConfigCreation: p, gridConfigReceipt: m, gridConfigSite: h, saveGridConfig: g } = me().grid, _ = _e(), ne = ge(), re = (e) => ne.perms.includes("*") || ne.perms.includes(e), b = i(() => re("grid_config:read")), x = i(() => re("grid_config:save")), S = i(() => {
			let e = String(ne.userInfo.id || "");
			return /^[1-9]\d*$/.test(e) ? e : "";
		}), T = y([]), D = y(""), j = y(""), M = y(""), N = y(null), P = y(null), L = y(""), R = y("通过预测网格配置页面保存配置"), ce = y(!1), de = y(!1), z = y(!1), B = y(!1), V = y(!1), H = y(""), U = y(""), W = y("info"), G = y(null), he = y(!1), ye = y(""), be = y(!1), xe = new sn(), Ce = new sn(), we = new sn(), K, Te = 0, Ee = i(() => b.value ? S.value ? "" : "无法确认当前操作人身份" : "当前账号没有预测网格配置查询权限"), De = i(() => T.value.find((e) => e.site_id === D.value)), Oe = y([]), ke = y(""), Ae = i(() => Qe(De.value?.products ?? [], Oe.value)), je = i(() => {
			let e = M.value.trim().toUpperCase();
			return Ae.value.filter((t) => !e || t.symbol.includes(e));
		}), Me = i(() => N.value?.site_version === "0"), Ne = i(() => b.value && x.value && !!S.value && de.value && !ke.value && !z.value && !G.value && !he.value && !V.value);
		function Pe(e) {
			if (!e || !P.value) return !1;
			if (Me.value) return JSON.stringify(e) !== JSON.stringify(P.value) || L.value !== "";
			try {
				return Kt(e, P.value, !0) || Pt(e.target_rtp) !== L.value || [
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
		let Fe = i(() => Pe(N.value)), Ie = i(() => Pe(N.value ? vt(ae(N.value), x.value) : null)), Le = i(() => G.value ? G.value.operator_id === S.value ? "bound" : "foreign" : "none"), Re = i(() => Le.value === "bound" ? G.value : null), ze = i(() => Le.value === "foreign"), Be = i(() => Ie.value || !!G.value || V.value), Ve = i(() => b.value && x.value && (Me.value || !!De.value?.can_edit) && !!S.value && !!N.value && !G.value && !he.value && !B.value && !V.value), He = i(() => Ve.value && !!N.value?.layout?.editable), Ue = i({
			get: () => {
				let e = P.value?.layout?.price_decimals;
				return e != null && (e <= 8 || Number.isNaN(e)) ? e : void 0;
			},
			set: (e) => {
				!He.value || !P.value?.layout || (P.value.layout.price_decimals = e ?? null, ft());
			}
		}), We = y("");
		oe(Ue, (e) => {
			Number.isNaN(e) || (We.value = e == null ? "" : String(e));
		}, {
			immediate: !0,
			flush: "sync"
		});
		let Ge = i({
			get: () => We.value,
			set: (e) => {
				He.value && (We.value = e, Ue.value = e === "" ? void 0 : /^[0-8]$/.test(e) ? Number(e) : NaN);
			}
		}), Ke = i(() => !!He.value && !!P.value?.layout && N.value?.layout?.price_band_width !== P.value.layout.price_band_width && Bt(P.value.layout.price_band_width)), qe = i(() => Ve.value && (Me.value || !!De.value?.can_edit_limits)), Je = i(() => !!Re.value && b.value && x.value && (Re.value.command.based_on_site_version === "0" || T.value.some((e) => e.site_id === Re.value.command.site_id && e.can_edit && e.products.some((e) => e.symbol === Re.value.command.symbol)))), Ye = i(() => Je.value && de.value && !z.value && !B.value && !V.value && !he.value && !be.value && ye.value === JSON.stringify(Re.value));
		function Xe(e) {
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
		let Ze = i(() => {
			let e = [N.value?.effective_from_ms, N.value?.layout?.effective_from_ms].filter((e) => typeof e == "string" && /^[1-9][0-9]*$/.test(e)).reduce((e, t) => BigInt(e) > BigInt(t) ? e : t, "0");
			return e === "0" ? "未提供" : Se(e);
		});
		function $e(e) {
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
		function et() {
			try {
				let e = an(sessionStorage, S.value);
				G.value = e.pending ?? null, he.value = !1;
			} catch {
				he.value = !0, G.value = null;
			}
		}
		function tt() {
			return `${S.value}:${D.value}:${j.value}`;
		}
		function nt() {
			Ce.close(), N.value = null, P.value = null, L.value = "", R.value = "通过预测网格配置页面保存配置", B.value = !1;
		}
		async function rt(e) {
			if (xe.close(), we.close(), ye.value = "", de.value = !1, nt(), T.value = [], Oe.value = [], ke.value = "", D.value = "", j.value = "", M.value = "", H.value = "", U.value = "", et(), Ee.value || he.value) return;
			let t = xe.next(S.value);
			z.value = !0;
			try {
				let [n, r] = await Promise.allSettled([f(t.signal), l(t.signal)]);
				if (!t.current(S.value)) return;
				if (r.status === "fulfilled" && Array.isArray(r.value) && r.value.every((e) => typeof e == "string") ? Oe.value = r.value : ke.value = "通用币种目录暂不可用，当前仅显示已授权的网格配置。", n.status === "rejected") throw n.reason;
				T.value = $e(n.value), de.value = !0;
				let i = Re.value ?? (e ? { command: e } : null), a = i && (i.command.based_on_site_version === "0" || T.value.some((e) => e.site_id === i.command.site_id)) ? i.command.site_id : T.value[0]?.site_id || "";
				D.value = a;
				let o = T.value.find((e) => e.site_id === a), s = i && i.command.site_id === a && (i.command.based_on_site_version === "0" || o?.products.some((e) => e.symbol === i.command.symbol)) ? i.command.symbol : Ae.value.find((e) => e.configured)?.symbol || "";
				j.value = s, s && o?.products.some((e) => e.symbol === s) && (K = ct());
			} catch (e) {
				t.current(S.value) && (H.value = Xe(e));
			} finally {
				t.current(S.value) && (z.value = !1);
			}
		}
		function it(e) {
			Be.value || (nt(), D.value = e, j.value = Ae.value.find((e) => e.configured)?.symbol || "", j.value && (K = ct()));
		}
		function at(e) {
			if (e === j.value && (N.value || B.value) || Be.value) return;
			let t = Ae.value.find((t) => t.symbol === e);
			!t || !t.configured && !Ne.value || (nt(), H.value = "", j.value = e, K = t.configured ? ct() : ot());
		}
		async function ot() {
			if (nt(), !Ne.value || !j.value) return;
			let e = j.value, t = Ce.next(tt());
			B.value = !0;
			try {
				let n = await p(e, t.signal);
				if (!t.current(tt()) || !x.value) return;
				let r = tr(n, e);
				N.value = r, P.value = vt(r, x.value), B.value = !1, D.value = r.site_id;
			} catch (e) {
				t.current(tt()) && (H.value = Xe(e));
			} finally {
				t.current(tt()) && (B.value = !1);
			}
		}
		function st() {
			!Me.value || G.value || V.value || (nt(), j.value = "", U.value = "");
		}
		async function ct() {
			if (nt(), !b.value || !D.value || !j.value) return;
			let e = D.value, t = j.value, n = tt(), r = Ce.next(n);
			B.value = !0;
			try {
				let n = await h(e, t, r.signal);
				if (!r.current(tt())) return;
				let i = Jt(n, e, t);
				N.value = i, P.value = vt(i, x.value), L.value = Pt(i.target_rtp);
			} catch (e) {
				r.current(tt()) && (H.value = Xe(e));
			} finally {
				r.current(tt()) && (B.value = !1);
			}
		}
		function lt(e) {
			return e.symbol === j.value && P.value ? P.value.enabled : e.enabled;
		}
		function ut(e) {
			return !De.value?.products.some((t) => t.symbol === e.symbol) || !x.value || !De.value?.can_edit || B.value || V.value || !!G.value || he.value || Ie.value && e.symbol !== j.value;
		}
		async function dt(e, t) {
			typeof t != "boolean" || ut(e) || (e.symbol !== j.value && (at(e.symbol), await K), P.value && P.value.symbol === e.symbol && !ut(e) && (P.value.enabled = t, ft()));
		}
		function ft() {
			U.value = "";
		}
		async function pt() {
			if (!Ve.value || !N.value || !P.value || !S.value) return;
			let e;
			try {
				e = Yt(N.value, {
					...P.value,
					target_rtp: Ft(L.value)
				}, R.value, It(), Me.value || !!De.value?.can_edit_limits, !0);
			} catch (e) {
				W.value = "warning", U.value = Xe(e);
				return;
			}
			let t = nn(S.value, e), n = yt(), r = "price_band_width" in e.changes || "column_duration_seconds" in e.changes || "price_decimals" in e.changes, i = Me.value ? " 首次创建后保持关闭。" : r ? ` 公共网格区间修改将影响站点：${N.value.layout.affected_site_ids.join("、")}。` : "";
			try {
				await le.confirm(`确认保存 ${e.site_id} / ${e.symbol} 的 ${Object.keys(e.changes).length} 项修改？${i}`, "确认预测网格配置", {
					type: "warning",
					confirmButtonText: "确认保存",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			}
			if (et(), !Ve.value || !N.value || !P.value || n !== yt()) {
				W.value = "warning", U.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let a;
			try {
				a = Yt(N.value, {
					...P.value,
					target_rtp: Ft(L.value)
				}, R.value, t.command.client_request_id, Me.value || !!De.value?.can_edit_limits, !0);
			} catch {
				W.value = "warning", U.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let o;
			try {
				o = rn(sessionStorage, t, S.value, a), et();
			} catch (e) {
				if (e?.message === "STALE_CONFIRMATION") {
					W.value = "warning", U.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
					return;
				}
				he.value = !0;
				return;
			}
			gt(o, "save");
		}
		async function mt() {
			et(), !(!Re.value || !Je.value || V.value || be.value) && gt(Re.value, "receipt");
		}
		async function ht() {
			if (et(), !Ye.value || !Re.value) return;
			let e = Re.value;
			be.value = !0;
			try {
				await le.confirm(`确认恢复 ${e.command.site_id} / ${e.command.symbol} 的原请求 ${e.command.client_request_id}？将沿用原编号和原参数；已提交则返回原回执，尚未提交则保存原配置，不使用当前页面的新修改。`, "恢复原配置请求", {
					type: "warning",
					confirmButtonText: "确认恢复",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			} finally {
				be.value = !1;
			}
			if (et(), !Ye.value || JSON.stringify(e) !== JSON.stringify(Re.value)) {
				W.value = "warning", U.value = "确认期间账号、权限或原请求已变化，本次恢复已取消，请重新查询原操作回执";
				return;
			}
			await gt(e, "recover");
		}
		async function gt(e, t) {
			let n = ++Te, r = tt(), i = we.next(r);
			V.value = !0, ye.value = "", U.value = "";
			try {
				let n = await on(sessionStorage, e, t, (e, t) => e === "save" ? g(t) : m(t));
				if (!i.current(tt())) return;
				if (et(), n.status === "success") {
					let e = S.value;
					R.value = "通过预测网格配置页面保存配置", V.value = !1, await rt(), e === S.value && (W.value = "warning", U.value = H.value ? "配置已保存；最新配置刷新失败，请手动刷新" : "");
				} else if (t === "recover" && n.status === "rejected" && n.error?.error_code === "VERSION_CONFLICT") if (!n.journalCleared || G.value || he.value) W.value = "warning", U.value = "旧请求已明确拒绝，但本机待确认记录已变化，请重新核对当前记录";
				else {
					let t = S.value;
					if (await rt(e.command), D.value && j.value && K && await K, t === S.value) {
						W.value = "warning";
						let t = D.value === e.command.site_id && j.value === e.command.symbol && T.value.some((t) => t.site_id === e.command.site_id && t.products.some((t) => t.symbol === e.command.symbol));
						U.value = "旧请求未生效，配置版本已变化；已清除旧待确认记录。" + (t ? H.value || !N.value ? "最新配置刷新失败，请手动刷新" : "请以当前配置为准" : `原目标当前不可见（${e.command.site_id} / ${e.command.symbol}），请核对权限和配置`);
					}
				}
				else W.value = n.status === "unknown" ? "warning" : "info", t === "receipt" && $t(n.error) && JSON.stringify(Re.value) === JSON.stringify(e) ? (ye.value = JSON.stringify(e), U.value = "未找到原操作回执，可使用原编号和原参数恢复请求") : t === "recover" ? U.value = "恢复尚未确认，原请求已保留，请重新查询原操作回执 · " + Xe(n.error) : U.value = n.status === "unknown" ? "原操作结果仍待确认，请使用原请求查询回执" : "保存已明确拒绝，可修正后重新提交 · " + Xe(n.error);
			} catch (e) {
				i.current(tt()) && (et(), W.value = "warning", U.value = "原操作结果仍待确认 · " + Xe(e));
			} finally {
				n === Te && (V.value = !1, et());
			}
		}
		async function _t() {
			if (!Be.value) return !0;
			try {
				return await le.confirm("当前有未保存修改或待确认操作，离开不会删除原记录。仍要离开吗？", "离开预测网格配置", { type: "warning" }), !0;
			} catch {
				return !1;
			}
		}
		function yt() {
			return JSON.stringify({
				operator: S.value,
				site: D.value,
				symbol: j.value,
				snapshot: N.value,
				draft: P.value,
				rtp: L.value,
				reason: R.value
			});
		}
		async function bt() {
			if (!V.value) {
				if (Ie.value) {
					let e = yt();
					try {
						await le.confirm("刷新会丢弃当前未保存修改，仍要刷新吗？", "刷新预测网格配置", { type: "warning" });
					} catch {
						return;
					}
					if (V.value || e !== yt()) {
						W.value = "warning", U.value = "确认期间编辑状态已变化，本次刷新已取消";
						return;
					}
				}
				await rt();
			}
		}
		function xt(e) {
			Be.value && (e.preventDefault(), e.returnValue = "");
		}
		return oe(() => [
			S.value,
			b.value,
			x.value
		], () => rt(), { immediate: !0 }), ve(_t), window.addEventListener("beforeunload", xt), te(() => {
			ye.value = "", de.value = !1, xe.close(), Ce.close(), we.close(), window.removeEventListener("beforeunload", xt);
		}), n({
			hasBlockingWork: Be,
			confirmLeave: _t,
			refresh: bt,
			loading: z
		}), (t, n) => (v(), s("section", nr, [
			Ee.value ? (v(), a(w(k), {
				key: 0,
				title: Ee.value,
				type: "warning",
				closable: !1
			}, null, 8, ["title"])) : he.value ? (v(), a(w(k), {
				key: 1,
				title: "本机保存的待确认操作记录已损坏或不可用，请停止操作并联系管理员核验",
				type: "error",
				closable: !1
			})) : ze.value ? (v(), a(w(k), {
				key: 2,
				title: "检测到其他账号尚未确认的预测网格配置操作，当前账号不可覆盖，请切回原账号查询回执",
				type: "error",
				closable: !1
			})) : o("", !0),
			H.value ? (v(), s("div", rr, [d(w(k), {
				title: H.value,
				type: "error",
				closable: !1
			}, null, 8, ["title"]), d(w(A), {
				loading: z.value || B.value,
				disabled: V.value || !!G.value,
				onClick: bt
			}, {
				default: E(() => [...n[16] ||= [u("重试", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"])])) : o("", !0),
			U.value ? (v(), a(w(k), {
				key: 4,
				title: U.value,
				type: W.value,
				closable: !1
			}, null, 8, ["title", "type"])) : o("", !0),
			Re.value ? (v(), s("div", ir, [c("div", null, [n[17] ||= c("strong", null, "原配置操作结果待确认", -1), c("small", null, C(Re.value.command.site_id) + " · " + C(Re.value.command.symbol) + " · " + C(Re.value.command.client_request_id), 1)]), c("div", ar, [d(w(A), {
				type: "warning",
				loading: V.value,
				disabled: !Je.value || be.value,
				onClick: mt
			}, {
				default: E(() => [...n[18] ||= [u("查询原操作回执", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"]), Ye.value || be.value ? (v(), a(w(A), {
				key: 0,
				type: "warning",
				disabled: !Ye.value,
				onClick: ht
			}, {
				default: E(() => [...n[19] ||= [u("恢复原请求", -1)]]),
				_: 1
			}, 8, ["disabled"])) : o("", !0)])])) : o("", !0),
			d(_n, {
				loading: z.value,
				"hide-content": z.value,
				"min-height": "0px",
				class: "grid-loading-workspace"
			}, {
				default: E(() => [c("div", or, [c("aside", sr, [
					c("div", cr, [n[20] ||= c("strong", null, "币种配置", -1), c("span", null, C(je.value.length) + " 条", 1)]),
					T.value.length > 1 ? (v(), a(w(fe), {
						key: 0,
						modelValue: D.value,
						"onUpdate:modelValue": n[0] ||= (e) => D.value = e,
						"aria-label": "选择站点",
						disabled: Be.value,
						onChange: it
					}, {
						default: E(() => [(v(!0), s(r, null, ie(T.value, (e) => (v(), a(w(ue), {
							key: e.site_id,
							label: e.site_id,
							value: e.site_id
						}, null, 8, ["label", "value"]))), 128))]),
						_: 1
					}, 8, ["modelValue", "disabled"])) : o("", !0),
					ke.value ? (v(), s("p", lr, [u(C(ke.value), 1), d(w(A), {
						link: "",
						type: "primary",
						disabled: Be.value,
						onClick: bt
					}, {
						default: E(() => [...n[21] ||= [u("重试", -1)]]),
						_: 1
					}, 8, ["disabled"])])) : o("", !0),
					d(w(e), {
						modelValue: M.value,
						"onUpdate:modelValue": n[1] ||= (e) => M.value = e,
						clearable: "",
						placeholder: "搜索交易对",
						"aria-label": "搜索交易对"
					}, null, 8, ["modelValue"]),
					c("div", ur, [(v(!0), s(r, null, ie(je.value, (e) => (v(), s("div", {
						key: e.symbol,
						class: ee(["symbol-row", { active: e.symbol === j.value }])
					}, [
						c("button", {
							type: "button",
							class: "symbol-button",
							disabled: !e.configured && !Ne.value || Be.value && e.symbol !== j.value,
							onClick: (t) => at(e.symbol)
						}, [d(w(_), { symbol: e.symbol }, null, 8, ["symbol"])], 8, dr),
						e.configured ? (v(), a(w(pe), {
							key: 1,
							"model-value": lt(e),
							disabled: ut(e),
							"aria-label": `${e.symbol} 开放配置`,
							onChange: (t) => dt(e, t)
						}, null, 8, [
							"model-value",
							"disabled",
							"aria-label",
							"onChange"
						])) : (v(), s("span", fr, "未配置")),
						e.symbol === j.value && Fe.value ? (v(), s("small", pr, "未保存")) : o("", !0)
					], 2))), 128)), !z.value && De.value && !je.value.length ? (v(), a(w(F), {
						key: 0,
						description: "当前站点没有已授权的预测网格产品",
						"image-size": 56
					})) : o("", !0)])
				]), c("main", mr, [N.value && P.value ? (v(), s("header", hr, [c("div", null, [
					c("h2", null, C(N.value.symbol) + " · 预测网格", 1),
					c("p", gr, "更新时间 " + C(Ze.value), 1),
					Me.value || T.value.length > 1 ? (v(), s("p", _r, "当前站点：" + C(N.value.site_id), 1)) : o("", !0)
				]), c("div", vr, [
					Me.value ? (v(), a(w(A), {
						key: 0,
						disabled: !!G.value || V.value,
						onClick: st
					}, {
						default: E(() => [...n[22] ||= [u("取消新增", -1)]]),
						_: 1
					}, 8, ["disabled"])) : o("", !0),
					d(w(A), { onClick: n[2] ||= (e) => ce.value = !0 }, {
						default: E(() => [...n[23] ||= [u("玩法说明", -1)]]),
						_: 1
					}),
					x.value ? (v(), a(w(A), {
						key: 1,
						type: "primary",
						loading: V.value,
						disabled: !Ve.value || !Fe.value || Ke.value,
						onClick: pt
					}, {
						default: E(() => [...n[24] ||= [u("保存配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])) : o("", !0)
				])])) : o("", !0), d(_n, {
					loading: B.value && !z.value,
					"hide-content": B.value && !N.value,
					"min-height": "0px",
					class: "grid-config__detail"
				}, {
					default: E(() => [!z.value && !B.value && !N.value && !j.value && !H.value ? (v(), a(w(F), {
						key: 0,
						description: Ne.value ? "请选择币种填写配置，首次保存后保持关闭" : "当前账号暂无已配置的产品"
					}, null, 8, ["description"])) : !z.value && !B.value && !H.value && De.value && !j.value ? (v(), a(w(F), {
						key: 1,
						description: "请选择交易对查看配置"
					})) : N.value && P.value ? (v(), s(r, { key: 2 }, [Me.value ? (v(), a(w(k), {
						key: 0,
						title: "请填写参数后保存，首次保存后保持关闭；确认配置后再单独开启。",
						type: "info",
						closable: !1
					})) : o("", !0), c("div", yr, [
						c("article", br, [n[29] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "网格区间配置"), c("p", { class: "parameter-description" }, "网格区间由平台按币种统一设置，修改后自动用于该币种下的商户交易。")], -1), P.value.layout ? (v(), s(r, { key: 0 }, [d(w(se), {
							"label-position": "top",
							class: "fields limit-fields",
							onSubmit: n[5] ||= O(() => {}, ["prevent"])
						}, {
							default: E(() => [d(w(I), { label: "纵向格子区间（USDT）" }, {
								label: E(() => [n[25] ||= u("纵向格子区间（USDT）", -1), d(bn, {
									label: "纵向格子区间",
									content: "每个格子覆盖的价格区间宽度，最多保留 8 位小数。数值越大，每格覆盖的价格范围越宽；保存时会根据最新标记价检查安全范围。"
								})]),
								default: E(() => [d(Dn, {
									"input-component": w(e),
									modelValue: P.value.layout.price_band_width,
									"onUpdate:modelValue": n[3] ||= (e) => P.value.layout.price_band_width = e,
									disabled: !He.value,
									inputmode: "decimal",
									"aria-label": "纵向格子区间",
									onInput: ft
								}, {
									append: E(() => [...n[26] ||= [u("USDT", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								]), Ke.value ? (v(), s("small", xr, "精度不规范，最多保留 8 位小数")) : o("", !0)]),
								_: 1
							}), d(w(I), { label: "横向格子区间（秒）" }, {
								label: E(() => [n[27] ||= u("横向格子区间（秒）", -1), d(bn, {
									label: "横向格子区间",
									content: "每列格子覆盖的时间长度，可填 1 至 10 秒整数；全部列连同起始等待时间不能超过 120 秒。"
								})]),
								default: E(() => [d(Dn, {
									"input-component": w(e),
									modelValue: P.value.layout.column_duration_seconds,
									"onUpdate:modelValue": n[4] ||= (e) => P.value.layout.column_duration_seconds = e,
									disabled: !He.value,
									inputmode: "numeric",
									min: "1",
									max: "10",
									step: "1",
									"aria-label": "横向格子区间",
									onInput: ft
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
						}), N.value.layout?.editable ? o("", !0) : (v(), s("p", Sr, C(Me.value ? "该币种已有公共网格区间，首次创建将直接沿用。" : "当前账号无法修改该币种全部受影响站点的公共网格区间，仅可查看。"), 1))], 64)) : (v(), a(w(k), {
							key: 1,
							title: "当前接口未返回网格区间，请刷新后重试；暂不支持编辑网格区间。",
							type: "info",
							closable: !1
						}))]),
						P.value.layout ? (v(), s("article", Cr, [
							n[30] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "价格精度"), c("p", { class: "parameter-description" }, "由平台按币种统一设置，保存后用于后续新订单。")], -1),
							d(w(se), {
								"label-position": "top",
								class: "fields odds-fields",
								onSubmit: n[7] ||= O(() => {}, ["prevent"])
							}, {
								default: E(() => [d(w(I), { label: "价格小数位" }, {
									default: E(() => [d(Dn, {
										"input-component": w(e),
										modelValue: Ge.value,
										"onUpdate:modelValue": n[6] ||= (e) => Ge.value = e,
										min: "0",
										max: "8",
										step: "1",
										unit: "位",
										inputmode: "numeric",
										"aria-label": "价格小数位",
										disabled: !He.value,
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
						c("article", wr, [n[41] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "赔率配置"), c("p", { class: "parameter-description" }, "命中概率由标记价、实时波动率及格子的价格和时间边界计算；格子赔率 = 目标返奖率 ÷ 命中概率")], -1), d(w(se), {
							"label-position": "top",
							class: "fields odds-fields",
							onSubmit: n[11] ||= O(() => {}, ["prevent"])
						}, {
							default: E(() => [
								d(w(I), { label: "目标返奖率" }, {
									label: E(() => [n[32] ||= u("目标返奖率", -1), d(bn, {
										label: "目标返奖率",
										content: "例如 97%：命中概率为 20% 时，计算赔率为 4.85x。"
									})]),
									default: E(() => [d(Dn, {
										"input-component": w(e),
										modelValue: L.value,
										"onUpdate:modelValue": n[8] ||= (e) => L.value = e,
										disabled: !Ve.value,
										inputmode: "decimal",
										"aria-label": "目标返奖率",
										onInput: ft
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
								d(w(I), { label: "最低赔率" }, {
									label: E(() => [n[35] ||= u("最低赔率", -1), d(bn, {
										label: "最低赔率",
										content: "当前币种报价允许的最低倍率。"
									})]),
									default: E(() => [d(Dn, {
										"input-component": w(e),
										modelValue: P.value.min_multiplier,
										"onUpdate:modelValue": n[9] ||= (e) => P.value.min_multiplier = e,
										step: "0.01",
										disabled: !qe.value,
										inputmode: "decimal",
										"aria-label": "最低赔率",
										onInput: ft
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
								d(w(I), { label: "最高赔率" }, {
									label: E(() => [n[38] ||= u("最高赔率", -1), d(bn, {
										label: "最高赔率",
										content: "当前币种报价允许的最高倍率。原型中超过此值的格子不可下注，不强制压低赔率；实际是否可下注以当前格子报价为准。"
									})]),
									default: E(() => [d(Dn, {
										"input-component": w(e),
										modelValue: P.value.max_multiplier,
										"onUpdate:modelValue": n[10] ||= (e) => P.value.max_multiplier = e,
										step: "0.01",
										disabled: !qe.value,
										inputmode: "decimal",
										"aria-label": "最高赔率",
										onInput: ft
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
						c("article", Tr, [c("header", Er, [n[42] ||= c("h3", null, "下注限制", -1), c("p", Dr, C(N.value.symbol) + " 每个格子生成一笔独立订单，限制作用于该币种全部网格订单", 1)]), d(w(se), {
							"label-position": "top",
							class: "fields limit-fields",
							onSubmit: n[14] ||= O(() => {}, ["prevent"])
						}, {
							default: E(() => [d(w(I), { label: "单笔最小额（USDT）" }, {
								label: E(() => [n[43] ||= u("单笔最小额（USDT）", -1), d(bn, { label: "单笔最小额" })]),
								default: E(() => [d(Dn, {
									"input-component": w(e),
									modelValue: P.value.min_order_amount,
									"onUpdate:modelValue": n[12] ||= (e) => P.value.min_order_amount = e,
									disabled: !Ve.value,
									inputmode: "decimal",
									"aria-label": "单笔最小额",
									onInput: ft
								}, {
									append: E(() => [...n[44] ||= [u("USDT", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								])]),
								_: 1
							}), d(w(I), { label: "单笔最大额（USDT）" }, {
								label: E(() => [n[45] ||= u("单笔最大额（USDT）", -1), d(bn, { label: "单笔最大额" })]),
								default: E(() => [d(Dn, {
									"input-component": w(e),
									modelValue: P.value.max_order_amount,
									"onUpdate:modelValue": n[13] ||= (e) => P.value.max_order_amount = e,
									disabled: !Ve.value,
									inputmode: "decimal",
									"aria-label": "单笔最大额",
									onInput: ft
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
						x.value ? o("", !0) : (v(), a(w(k), {
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
			d(er, {
				modelValue: ce.value,
				"onUpdate:modelValue": n[15] ||= (e) => ce.value = e
			}, null, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-d23eeae9"]]), kr = { class: "prediction-page prediction-table-page mm-ui" }, Ar = { class: "prediction-page__header" }, jr = {
	class: "game-tabs",
	role: "group",
	"aria-label": "选择预测玩法"
}, Mr = {
	class: "game-choice-icon",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	"aria-hidden": "true"
}, Nr = { class: "game-choice-content" }, Pr = { key: 0 }, Fr = {
	key: 1,
	class: "catalog-error"
}, Ir = { class: "prediction-page__workspace" }, Lr = { class: "symbol-panel__heading" }, Rr = { class: "symbol-panel__list" }, zr = [
	"aria-pressed",
	"data-config-symbol",
	"disabled",
	"onClick"
], Br = { class: "symbol-choice__top" }, Vr = ["title"], Hr = {
	key: 1,
	class: "symbol-row__draft"
}, Ur = { class: "config-content" }, Wr = {
	key: 0,
	class: "config-content__heading"
}, Gr = { class: "config-game-label" }, Kr = { "data-config-updated-at": "" }, qr = {
	key: 0,
	class: "config-heading-actions"
}, Jr = ["title", "aria-label"], Yr = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "index",
	setup(t) {
		let { predictionConfigurationList: n } = me().api, { symbols: l } = me().api, f = _e(), p = ge(), m = y(""), h = y(!1), _ = y([]), re = y("UP_DOWN"), b = y("UP_DOWN"), x = S(), ae = [
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
		], T = y(""), D = i(() => rt(p.perms, "prediction_config:lists")), O = y(""), j = S(), M = i(() => j.value?.editingState), N = i(() => {
			let e = M.value;
			return !e || e.target !== T.value || e.actor !== String(p.userInfo.id || "") || !D.value || !rt(p.perms, "prediction_config:edit") || e.saving ? null : e.pending ? {
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
		}), P = 0, se = (e) => T.value === e.row_key && M.value?.target === e.row_key ? M.value.enabled ?? e.enabled : e.enabled;
		function I(e) {
			return rt(p.perms, "prediction_config:edit") ? M.value?.pending ? "请先核验待确认的操作" : h.value || M.value?.loading ? "正在加载配置" : T.value !== e.row_key && M.value?.dirty ? "请先处理当前未保存修改" : T.value === e.row_key && !M.value?.ready ? "请重新加载当前配置" : "修改后需保存配置" : "没有配置修改权限";
		}
		function L(e) {
			let t = M.value;
			return !D.value || !rt(p.perms, "prediction_config:edit") || !e.editable || h.value || !t || t.loading || t.pending || (T.value === e.row_key ? !t.ready || t.target !== e.row_key : t.dirty);
		}
		async function R(e, t) {
			if (typeof t != "boolean" || L(e)) return;
			let n = String(p.userInfo.id || ""), r = M.value?.generation;
			if (T.value !== e.row_key) {
				let t = await ke(e);
				if (await g(), !t || t.selection !== P) return;
				r = t.detail;
			}
			r === void 0 || T.value !== e.row_key || L(e) || j.value?.setEnabled(e.row_key, r, n, t);
		}
		let le = (e) => e === "GAME_TYPE_UP_DOWN" ? "UP_DOWN" : e === "GAME_TYPE_HIGH_LOW" ? "HIGH_LOW" : null, ue = (e) => e === "UP_DOWN" ? "涨跌预测" : e === "HIGH_LOW" ? "自选预测" : "--", de = Se, fe = i(() => _.value.map((e, t) => {
			let n = e.rules[0], r = le(n?.game_type) || re.value || null, i = n?.symbol || "";
			return {
				row_key: r && i ? `${r}:${i}` : `empty:${t}`,
				configuration: e,
				game_type: r,
				symbol: i,
				enabled: Xe(e),
				configured: e.rules.length > 0,
				editable: !!(r && i && e.rules.length > 0),
				rule_count: e.rules.length,
				template_version: e.template_version,
				effective_version: e.effective_version,
				updated_at: de(e.updated_at_ms)
			};
		}).sort((e, t) => e.game_type === t.game_type ? e.symbol.localeCompare(t.symbol) : (e.game_type || "").localeCompare(t.game_type || "")));
		function B(e) {
			let t = e.row_key === M.value?.target && M.value?.ready ? M.value.roomDurations : e.configuration ? Ze(e.configuration) : void 0;
			return t ? t.map((t) => Ce(t, e.game_type || void 0)).join(" · ") || "暂无房间" : e.directory_label;
		}
		let V = y([]), H = y(!1), U = y(""), W = (e) => e.trim().toUpperCase(), G = 0, he;
		async function ve() {
			if (!D.value) return;
			he?.abort(), he = new AbortController();
			let e = ++G;
			H.value = !0, U.value = "";
			try {
				let t = await l(he.signal);
				if (e !== G) return;
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
					let r = W(t.symbol);
					n.has(r) || n.set(r, {
						symbol: r,
						base_asset: typeof t.base_asset == "string" ? t.base_asset : "",
						quote_asset: typeof t.quote_asset == "string" ? t.quote_asset : ""
					});
				}
				V.value = [...n.values()];
			} catch (t) {
				e === G && (U.value = we(t));
			} finally {
				e === G && (H.value = !1);
			}
		}
		let ye = i(() => {
			let e = [...fe.value], t = new Set(e.filter((e) => e.game_type === re.value).map((e) => W(e.symbol)));
			for (let n of V.value) t.has(n.symbol) || e.push({
				row_key: `${re.value}:${n.symbol}`,
				configuration: null,
				game_type: re.value,
				symbol: n.symbol,
				enabled: !1,
				configured: !1,
				editable: rt(p.perms, "prediction_config:edit") && !U.value,
				rule_count: 0,
				template_version: "未配置",
				effective_version: "未配置",
				updated_at: "未提供",
				directory_label: [n.base_asset, n.quote_asset].filter(Boolean).join(" / ") || "点击填写配置"
			});
			return $e(e, V.value.map((e) => e.symbol));
		}), be = i(() => {
			let e = O.value.trim().toUpperCase();
			return ye.value.filter((t) => (!re.value || t.game_type === re.value) && (!e || t.symbol.includes(e)));
		}), xe = i(() => ye.value.find((e) => e.row_key === T.value)), K = i(() => (h.value || H.value) && !xe.value), Te = 0, Ee, De = async () => {
			if (!rt(p.perms, "prediction_config:lists")) {
				m.value = "没有玩法配置查询权限";
				return;
			}
			m.value = "", Ee?.abort(), Ee = new AbortController();
			let e = ++Te, t = String(p.userInfo.id || "");
			h.value = !0;
			try {
				let r = await n({ game_type: re.value || void 0 }, Ee.signal);
				if (e !== Te || t !== String(p.userInfo.id || "") || !D.value) return;
				if (!Array.isArray(r.configurations)) throw Error("配置列表格式异常，请重新加载");
				if (_.value = r.configurations, !ye.value.some((e) => e.row_key === T.value && e.editable)) {
					let e = ye.value.find((e) => e.configured && e.editable && e.game_type === re.value);
					e ? await ke(e, !0) : T.value = "";
				}
			} catch (t) {
				e === Te && (m.value = we(t), _.value = []);
			} finally {
				e === Te && (h.value = !1);
			}
		}, Oe = async (e) => {
			if (b.value !== e && !(b.value === "GRID" && x.value && !await x.value.confirmLeave())) {
				if (b.value !== "GRID" && (M.value?.dirty || M.value?.pending)) {
					ce.warning("请先处理当前未保存修改或待确认操作");
					return;
				}
				if (P++, b.value = e, e === "GRID") {
					T.value = "";
					return;
				}
				re.value = e, T.value = "", O.value = "", _.value = [], De(), V.value.length || ve();
			}
		}, ke = async (e, t = !1) => {
			if (M.value?.saving) {
				ce.warning("请先处理当前未保存修改或待确认操作");
				return;
			}
			let n = String(p.userInfo.id || ""), r = ++P;
			if (!(!D.value || !e.editable || h.value && !t || m.value || !e.game_type || !e.symbol || T.value === e.row_key) && (T.value = e.row_key, await g(), !(r !== P || T.value !== e.row_key || n !== String(p.userInfo.id || "") || !D.value))) return {
				selection: r,
				detail: await j.value?.open(e.game_type, e.symbol, t ? e.configuration ?? void 0 : void 0, !e.configured)
			};
		}, Ae = () => {
			if (b.value === "GRID") {
				x.value?.refresh();
				return;
			}
			P++, De(), ve();
		};
		return oe(() => [
			p.userInfo.id,
			D.value,
			rt(p.perms, "prediction_config:edit")
		], () => {
			P++, Te++, Ee?.abort(), h.value = !1;
		}, { flush: "sync" }), ne(Ae), te(() => {
			P++, Te++, Ee?.abort(), G++, he?.abort();
		}), (t, n) => (v(), s("section", kr, [
			c("header", Ar, [c("div", jr, [(v(), s(r, null, ie(ae, (e) => d(w(A), {
				key: e.value,
				type: b.value === e.value ? "primary" : void 0,
				"aria-pressed": b.value === e.value,
				"aria-label": e.label,
				onClick: (t) => Oe(e.value)
			}, {
				default: E(() => [(v(), s("svg", Mr, [e.value === "UP_DOWN" ? (v(), s(r, { key: 0 }, [n[2] ||= c("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}, null, -1), n[3] ||= c("path", { d: "m16 12-4-4-4 4M12 16V8" }, null, -1)], 64)) : e.value === "HIGH_LOW" ? (v(), s(r, { key: 1 }, [n[4] ||= c("path", { d: "m9 9 5 12 1.8-5.2L21 14Z" }, null, -1), n[5] ||= c("path", { d: "M7.2 2.2 8 5.1M5.1 8l-2.9-.8M14 4.1 12 6M6 12l-1.9 2" }, null, -1)], 64)) : (v(), s(r, { key: 2 }, [n[6] ||= c("rect", {
					x: "3",
					y: "3",
					width: "18",
					height: "18",
					rx: "2"
				}, null, -1), n[7] ||= c("path", { d: "M9 3v18M15 3v18M3 9h18M3 15h18" }, null, -1)], 64))])), c("span", Nr, [c("strong", null, C(e.label), 1), c("small", null, C(e.description), 1)])]),
				_: 2
			}, 1032, [
				"type",
				"aria-pressed",
				"aria-label",
				"onClick"
			])), 64))])]),
			b.value !== "GRID" && m.value ? (v(), s("div", Pr, [d(w(k), {
				title: m.value,
				type: "error",
				closable: !1
			}, null, 8, ["title"]), d(w(A), {
				loading: h.value,
				onClick: Ae
			}, {
				default: E(() => [...n[8] ||= [u("重试", -1)]]),
				_: 1
			}, 8, ["loading"])])) : o("", !0),
			b.value !== "GRID" && U.value ? (v(), s("div", Fr, [d(w(k), {
				title: `币种目录加载失败：${U.value}`,
				type: "warning",
				closable: !1
			}, null, 8, ["title"]), d(w(A), {
				"aria-label": "重试币种目录",
				loading: H.value,
				onClick: ve
			}, {
				default: E(() => [...n[9] ||= [u("重试币种目录", -1)]]),
				_: 1
			}, 8, ["loading"])])) : o("", !0),
			b.value !== "GRID" && D.value ? (v(), a(_n, {
				key: 2,
				class: "prediction-page__loading-workspace",
				loading: K.value,
				"hide-content": K.value,
				"min-height": "0px"
			}, {
				default: E(() => [c("div", Ir, [d(_n, {
					as: "aside",
					loading: (h.value || H.value) && !K.value,
					"min-height": "0px",
					class: "symbol-panel",
					"aria-label": "交易对配置列表"
				}, {
					default: E(() => [
						c("div", Lr, [n[10] ||= c("strong", null, "币种配置", -1), c("span", null, C(be.value.length) + " 条", 1)]),
						d(w(e), {
							modelValue: O.value,
							"onUpdate:modelValue": n[0] ||= (e) => O.value = e,
							clearable: "",
							placeholder: "搜索交易对",
							"aria-label": "搜索交易对"
						}, null, 8, ["modelValue"]),
						c("div", Rr, [(v(!0), s(r, null, ie(be.value, (e) => (v(), s("div", {
							key: e.row_key,
							class: ee(["symbol-row", { "is-active": T.value === e.row_key }])
						}, [
							c("button", {
								type: "button",
								class: "symbol-choice",
								"aria-pressed": T.value === e.row_key,
								"data-config-symbol": e.symbol,
								disabled: !e.editable || h.value || !!m.value,
								onClick: (t) => ke(e)
							}, [c("span", Br, [d(w(f), { symbol: e.symbol }, null, 8, ["symbol"]), e.configured ? o("", !0) : (v(), a(w(z), {
								key: 0,
								size: "small",
								type: "info"
							}, {
								default: E(() => [...n[11] ||= [u("待首次配置", -1)]]),
								_: 1
							}))]), c("span", {
								class: "symbol-choice__periods",
								title: B(e)
							}, C(B(e)), 9, Vr)], 8, zr),
							e.configured ? (v(), a(w(pe), {
								key: 0,
								"data-config-enabled": e.symbol,
								"aria-label": `${e.symbol} 开放配置`,
								"model-value": se(e),
								disabled: L(e),
								title: I(e),
								onChange: (t) => R(e, t)
							}, null, 8, [
								"data-config-enabled",
								"aria-label",
								"model-value",
								"disabled",
								"title",
								"onChange"
							])) : o("", !0),
							T.value === e.row_key && M.value?.dirty ? (v(), s("span", Hr, "未保存")) : o("", !0)
						], 2))), 128)), !h.value && !H.value && !m.value && !U.value && !be.value.length ? (v(), a(w(F), {
							key: 0,
							description: "暂无符合条件的交易对",
							"image-size": 56
						})) : o("", !0)])
					]),
					_: 1
				}, 8, ["loading"]), c("main", Ur, [xe.value ? (v(), s("div", Wr, [c("div", null, [c("h2", null, [u(C(xe.value.symbol) + " ", 1), c("span", Gr, " · " + C(ue(xe.value.game_type)), 1)]), c("p", Kr, "更新时间 " + C(xe.value.updated_at), 1)]), w(rt)(w(p).perms, "prediction_config:edit") ? (v(), s("div", qr, [N.value ? (v(), s("span", {
					key: 0,
					"data-config-save-feedback": "",
					class: ee(["config-save-feedback", `config-save-feedback--${N.value.tone}`]),
					role: "status",
					title: N.value.detail || void 0,
					"aria-label": N.value.detail ? `${N.value.text}：${N.value.detail}` : void 0
				}, C(N.value.text), 11, Jr)) : o("", !0), d(w(A), {
					type: "primary",
					loading: M.value?.saving,
					disabled: !M.value || M.value.saving || !M.value.pending && !M.value.ready,
					onClick: n[1] ||= (e) => j.value?.saveConfig()
				}, {
					default: E(() => [u(C(M.value?.pending ? "核验原操作" : "保存配置"), 1)]),
					_: 1
				}, 8, ["loading", "disabled"])])) : o("", !0)])) : o("", !0), T.value ? (v(), a(Yn, {
					key: 1,
					ref_key: "editRef",
					ref: j,
					inline: "",
					"external-save": "",
					onSuccess: De
				}, null, 512)) : !h.value && !H.value && !m.value ? (v(), a(w(F), {
					key: 2,
					description: "请选择交易对查看配置"
				})) : o("", !0)])])]),
				_: 1
			}, 8, ["loading", "hide-content"])) : b.value === "GRID" ? (v(), a(Or, {
				key: 3,
				ref_key: "gridRef",
				ref: x,
				class: "grid-mode"
			}, null, 512)) : o("", !0)
		]));
	}
}), [["__scopeId", "data-v-17102a95"]]), Xr = 9223372036854775807n;
function Zr(e) {
	return e == null ? "—" : typeof e == "object" ? JSON.stringify(e) : String(e);
}
function J(e, t = !1) {
	return typeof e == "string" && /^(0|[1-9][0-9]*)$/.test(e) && e.length <= 19 && BigInt(e) <= Xr && (!t || e !== "0");
}
function Qr(e) {
	return typeof e == "number" ? Number.isSafeInteger(e) && e > 0 ? String(e) : null : J(e, !0) ? e : null;
}
function $r(e) {
	return typeof e == "string" && e.length <= 256 && /^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(e);
}
function Y(e, t) {
	if (!$r(e) || !$r(t)) throw Error("INVALID_DECIMAL");
	let [n, r = ""] = e.split("."), [i, a = ""] = t.split("."), o = Math.max(r.length, a.length), s = BigInt(n + r.padEnd(o, "0")), c = BigInt(i + a.padEnd(o, "0"));
	return s === c ? 0 : s > c ? 1 : -1;
}
function ei(e) {
	if (!J(e) || BigInt(e) > 8640000000000000n) return e == null ? "—" : Zr(e);
	let t = new Date(Number(e));
	return Number.isNaN(t.getTime()) ? Zr(e) : t.toLocaleString();
}
function X(e, t = 64, n = !1) {
	return typeof e == "string" && e.length > 0 && [...e].length <= t && e.trim() === e && !/[\u0000-\u001f\u007f]/.test(e) && (!n || /^[A-Z0-9][A-Z0-9._-]*$/.test(e));
}
//#endregion
//#region src/prediction-config/agent/utils/decimal.ts
var ti = /^([+-]?)(\d*)(?:\.(\d*))?$/, ni = /^([+-]?)(\d*\.?\d+)[eE]([+-]?\d+)$/, ri = 1e3;
function ii(e) {
	if (!/[eE]/.test(e)) return e;
	let t = e.match(ni);
	if (!t) return null;
	let [, n, r, i] = t, a = Number(i);
	if (!Number.isSafeInteger(a) || Math.abs(a) > ri) return null;
	let [o = "", s = ""] = r.split("."), c = `${o}${s}`, l = o.length + a;
	return l <= 0 ? `${n}0.${"0".repeat(Math.abs(l))}${c}` : l >= c.length ? `${n}${c}${"0".repeat(l - c.length)}` : `${n}${c.slice(0, l)}.${c.slice(l)}`;
}
function ai(e) {
	if (e == null || e === "") return null;
	let t = ii(String(e).trim().replace(/,/g, ""));
	if (t == null) return null;
	let n = t.match(ti);
	if (!n || !n[2] && !n[3]) return null;
	let [, r, i = "", a = ""] = n, o = i.replace(/^0+(?=\d)/, "") || "0", s = a.replace(/0+$/, ""), c = s ? `${o}.${s}` : o;
	return /^0(?:\.0*)?$/.test(c) ? "0" : r === "-" ? `-${c}` : c;
}
//#endregion
//#region src/prediction-config/agent/views/prediction/game-config/site-model.ts
var oi = (e) => e.stored.game_type === "GAME_TYPE_HIGH_LOW" ? "HIGH_LOW" : "UP_DOWN", si = [
	"35",
	"40",
	"45",
	"60",
	"90"
], Z = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Q(e, t = "INVALID_SITE_CONFIGURATION") {
	if (!e) throw Error(t);
}
function ci(e) {
	if (e && typeof e == "object") {
		Object.freeze(e);
		for (let t of Object.values(e)) ci(t);
	}
	return e;
}
function li(e = globalThis.crypto) {
	Q(e && typeof e.getRandomValues == "function", "SECURE_RANDOM_UNAVAILABLE");
	let t = e.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	Q(t instanceof Uint8Array && t.length === 16, "SECURE_RANDOM_UNAVAILABLE"), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0")).join("");
	return `${n.slice(0, 8)}-${n.slice(8, 12)}-${n.slice(12, 16)}-${n.slice(16, 20)}-${n.slice(20)}`;
}
function ui(e) {
	Q(Z(e) && Qr(e.operator_id) === e.operator_id && Qr(e.agent_id) === e.agent_id, "IDENTITY_UNCONFIRMED");
}
function di(e) {
	Q(Z(e)), ui(e.actor), Q(Array.isArray(e.sites) && e.sites.length <= 100);
	let t = /* @__PURE__ */ new Set();
	for (let n of e.sites) {
		Q(Z(n) && X(n.site_id, 128) && !t.has(n.site_id) && Array.isArray(n.games)), t.add(n.site_id), Q(n.games.length > 0 && n.games.length <= 2);
		let e = /* @__PURE__ */ new Set();
		for (let t of n.games) Q(Z(t) && ["UP_DOWN", "HIGH_LOW"].includes(String(t.game_type)) && !e.has(t.game_type) && Array.isArray(t.symbols) && t.symbols.length <= 100 && t.symbols.every((e) => X(e, 64, !0)) && new Set(t.symbols).size === t.symbols.length), e.add(t.game_type);
	}
}
function fi(e, t) {
	Q(Object.keys(e).every((e) => t.includes(e)));
}
function pi(e) {
	Q(Z(e) && X(e.site_id, 128) && ["GAME_TYPE_UP_DOWN", "GAME_TYPE_HIGH_LOW"].includes(String(e.game_type)) && X(e.symbol, 64, !0)), Q(J(e.version, !0) && J(e.based_on_public_version, !0) && typeof e.enabled == "boolean" && Array.isArray(e.overrides));
	let t = e.game_type === "GAME_TYPE_UP_DOWN";
	Q(e.overrides.length <= (t ? 5 : 100) && new Set(e.overrides.map((e) => e.duration_seconds)).size === e.overrides.length);
	for (let n of e.overrides) {
		Q(Z(n)), fi(n, [
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
		]), Q(n.game_type === e.game_type && n.symbol === e.symbol && (t ? si.includes(String(n.duration_seconds)) : J(n.duration_seconds, !0))), Q(!Object.hasOwn(n, "enabled") || typeof n.enabled == "boolean"), Q(Array.isArray(n.stake_tiers) && n.stake_tiers.length <= +!!t), t || hi(n);
		for (let e of n.stake_tiers) Q(Z(e)), fi(e, [
			"stake_tier_id",
			"enabled",
			"maximum_stake"
		]), Q(X(e.stake_tier_id) && (!Object.hasOwn(e, "enabled") || typeof e.enabled == "boolean") && (!Object.hasOwn(e, "maximum_stake") || $r(e.maximum_stake)));
	}
}
function mi(e, t, n, r) {
	Q(Z(e)), pi(e.stored);
	let i = e.stored, a = e.effective;
	Q(i.site_id === t && i.symbol === n && Z(a) && (!r || i.game_type === "GAME_TYPE_" + r));
	let o = i.game_type === "GAME_TYPE_UP_DOWN";
	Q(a.site_id === t && a.symbol === n && a.game_type === i.game_type), Q(J(a.public_version, !0) && a.site_version === i.version && a.based_on_public_version === i.based_on_public_version && typeof a.enabled == "boolean"), Q(Array.isArray(a.rules) && (o ? a.rules.length === 5 : a.rules.length > 0 && a.rules.length <= 100) && new Set(a.rules.map((e) => e.duration_seconds)).size === a.rules.length);
	let s = a.rules;
	for (let e of s) {
		if (Q(Z(e) && e.game_type === i.game_type && e.symbol === n && (o ? si.includes(String(e.duration_seconds)) : J(e.duration_seconds, !0)) && typeof e.enabled == "boolean"), Q(Array.isArray(e.stake_tiers)), !o) {
			Q(e.stake_tiers.length === 0), hi(e, !0);
			continue;
		}
		Q(e.bet_open_seconds === "30"), Q(e.stake_tiers.every((e) => Z(e) && X(e.stake_tier_id) && typeof e.enabled == "boolean" && typeof e.retired == "boolean"));
		let t = e.stake_tiers.filter((e) => !e.retired);
		Q(t.length === 1 && t[0].minimum_stake === "1" && $r(t[0].maximum_stake));
		let r = i.overrides.find((t) => t.duration_seconds === e.duration_seconds);
		Q(!r?.stake_tiers.length || r.stake_tiers[0].stake_tier_id === t[0].stake_tier_id);
	}
	a.public_version === i.based_on_public_version && Q(i.overrides.every((e) => s.some((t) => t.duration_seconds === e.duration_seconds))), Q(Array.isArray(e.adjustments));
}
function hi(e, t = !1) {
	for (let n of [
		"fixed_odds",
		"minimum_stake",
		"maximum_stake"
	]) (t || Object.hasOwn(e, n)) && Q($r(e[n]) && Y(e[n], n === "fixed_odds" ? "1" : "0") > 0);
	e.minimum_stake !== void 0 && e.maximum_stake !== void 0 && Q(Y(e.minimum_stake, e.maximum_stake) <= 0);
}
function gi(e) {
	return mi(e, e.stored.site_id, e.stored.symbol), oi(e) === "HIGH_LOW" ? [...e.effective.rules].sort((e, t) => BigInt(e.duration_seconds) < BigInt(t.duration_seconds) ? -1 : 1).map((t) => {
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
	}) : si.map((t) => {
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
function _i(e, t, n, r, i) {
	let a = gi(e);
	Q(typeof n == "boolean" && X(r, 500) && X(i, 128), "INVALID_REASON"), Q(t.length === a.length && new Set(t.map((e) => e.duration_seconds)).size === a.length);
	let o = oi(e), s = a.map((n) => {
		let r = t.find((e) => e.duration_seconds === n.duration_seconds);
		Q(r && r.stake_tier_id === n.stake_tier_id && typeof r.enabled == "boolean");
		let i = e.stored.overrides.find((e) => e.duration_seconds === n.duration_seconds);
		if (o === "HIGH_LOW") {
			hi(r, !0), Q(Y(r.fixed_odds, "2") < 0, "INVALID_ODDS");
			let e = { duration_seconds: n.duration_seconds };
			i ? i.enabled !== void 0 && (e.enabled = i.enabled) : e.enabled = r.enabled, r.enabled !== n.enabled && (e.enabled = r.enabled);
			for (let t of [
				"fixed_odds",
				"minimum_stake",
				"maximum_stake"
			]) i?.[t] !== void 0 && (e[t] = i[t]), r[t] !== n[t] && (e[t] = r[t]);
			return e;
		}
		Q($r(r.maximum_stake) && Y(r.maximum_stake, "1") >= 0, "INVALID_MAXIMUM");
		let a = { ...i?.stake_tiers[0] ?? { stake_tier_id: n.stake_tier_id } }, s = {
			duration_seconds: n.duration_seconds,
			...i?.enabled === void 0 ? {} : { enabled: i.enabled },
			stake_tiers: [a]
		};
		return r.enabled !== n.enabled && (s.enabled = r.enabled, a.enabled = r.enabled), r.maximum_stake !== n.maximum_stake && (a.maximum_stake = r.maximum_stake), s;
	});
	return ci({
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
var vi = class {
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
function yi(e) {
	return e.stake_tiers.find((e) => !e.retired);
}
function bi(e) {
	return e?.kind !== void 0 || e?.config_site_id !== void 0;
}
function xi(e) {
	return J(e?.operator_id, !0) ? bi(e) ? J(e.config_site_id) ? e.kind === "SITE" ? e.agent_id === "0" && J(e.config_site_id, !0) : e.kind === "MERCHANT" && J(e.agent_id, !0) && e.operator_id === e.agent_id : !1 : e.operator_id === e.agent_id : !1;
}
var Si = (e) => typeof e == "string" && /^(0|[1-9][0-9]{0,17})(\.[0-9]{1,18})?$/.test(e) && Y(e, "0") > 0;
function Ci(e, t, n, r) {
	return [
		e,
		t,
		n,
		r
	].every(Si) && Y(e, n) <= 0 && Y(n, r) <= 0 && Y(r, t) <= 0;
}
function wi(e, t) {
	Q(xi(t), "IDENTITY_UNCONFIRMED"), Q(Z(e) && e.owner_agent_id === t.agent_id && ["GAME_TYPE_UP_DOWN", "GAME_TYPE_HIGH_LOW"].includes(String(e.game_type)) && X(e.symbol, 64, !0), "INVALID_OWNER_CONFIGURATION"), Q(J(e.public_version, !0) && J(e.owner_revision) && Array.isArray(e.rules) && e.rules.length > 0 && e.rules.length <= 100);
	let n = bi(t);
	Q(e.config_model === "SCOPED_OWNER_V1" === n, "CONFIGURATION_MODEL_MISMATCH"), n && (Q(e.config_site_id === t.config_site_id && J(e.revision, !0) && J(e.site_revision), "IDENTITY_UNCONFIRMED"), Q(e.revision === (t.kind === "SITE" ? e.site_revision : e.owner_revision)), Q(t.kind !== "SITE" || e.owner_revision === "0"), Q(t.config_site_id !== "0" || e.site_revision === "0"), Q(typeof e.effective_enabled == "boolean" && typeof e.can_enable == "boolean" && ["", "PARENT_CONSTRAINT_CHANGED"].includes(String(e.blocked_reason))), Q(e.can_enable === (e.blocked_reason === "" && e.platform_enabled)));
	let r = n && e.blocked_reason === "PARENT_CONSTRAINT_CHANGED";
	Q(typeof e.enabled == "boolean" && typeof e.platform_enabled == "boolean");
	let i = e.game_type === "GAME_TYPE_UP_DOWN", a = /* @__PURE__ */ new Set();
	i && Q(e.rules.length === 5);
	for (let t of e.rules) {
		Q(Z(t) && Z(t.rule) && J(t.rule_epoch, !0) && typeof t.custom == "boolean");
		let n = t.rule;
		Q(typeof t.platform_enabled == "boolean" && typeof t.owner_enabled == "boolean" && n.enabled === (!r && e.enabled && t.platform_enabled && t.owner_enabled)), Q(i ? Si(t.platform_target_payout_rate) && Si(t.platform_maximum_odds) && t.platform_fixed_odds === "" && Si(n.target_payout_rate) && Si(n.maximum_odds) && (r || Y(n.target_payout_rate, t.platform_target_payout_rate) <= 0) && Y(n.target_payout_rate, "1") <= 0 && (r || Y(n.maximum_odds, t.platform_maximum_odds) <= 0) && Y(n.maximum_odds, "1") >= 0 : Si(t.platform_fixed_odds) && t.platform_target_payout_rate === "" && t.platform_maximum_odds === "" && Si(n.fixed_odds) && Y(n.fixed_odds, "1") > 0 && (r || Y(n.fixed_odds, t.platform_fixed_odds) <= 0)), Q(n.game_type === e.game_type && n.symbol === e.symbol && J(n.duration_seconds, !0) && !a.has(n.duration_seconds) && typeof n.enabled == "boolean" && Array.isArray(n.stake_tiers)), a.add(n.duration_seconds);
		let o = n;
		if (i) {
			Q(si.includes(n.duration_seconds) && n.bet_open_seconds === "30");
			let e = /* @__PURE__ */ new Set(), t = n.stake_tiers.filter((t) => (Q(Z(t) && X(t.stake_tier_id) && !e.has(t.stake_tier_id) && typeof t.retired == "boolean" && typeof t.enabled == "boolean"), e.add(t.stake_tier_id), !t.retired));
			Q(t.length === 1), o = t[0], Q(Z(o) && X(o.stake_tier_id) && typeof o.enabled == "boolean" && o.retired === !1), Q($r(n.target_payout_rate) && $r(n.minimum_odds) && $r(n.maximum_odds));
		} else Q(n.stake_tiers.length === 0 && $r(n.fixed_odds));
		Q(Si(t.platform_minimum_stake) && Si(t.platform_maximum_stake) && Si(o.minimum_stake) && Si(o.maximum_stake) && Y(o.minimum_stake, o.maximum_stake) <= 0), Q(r || Ci(t.platform_minimum_stake, t.platform_maximum_stake, o.minimum_stake, o.maximum_stake));
	}
	n && Q(e.effective_enabled === e.rules.some((e) => e.rule.enabled));
}
function Ti(e, t) {
	wi(e, t);
	let n = e.game_type === "GAME_TYPE_UP_DOWN";
	return e.rules.map((e) => {
		let t = e.rule, r = n ? yi(t) : t;
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
			stake_tier_id: n ? yi(t).stake_tier_id : "",
			based_rule_epoch: e.rule_epoch,
			minimum_stake: r.minimum_stake,
			maximum_stake: r.maximum_stake,
			platform_minimum: e.platform_minimum_stake,
			platform_maximum: e.platform_maximum_stake,
			enabled: t.enabled && (!n || yi(t).enabled),
			odds: n ? `${t.minimum_odds} ~ ${t.maximum_odds}` : t.fixed_odds,
			custom: e.custom
		};
	});
}
function Ei(e, t, n, r, i, a = e.enabled) {
	let o = Ti(e, t);
	Q(n.length === o.length && new Set(n.map((e) => e.duration_seconds)).size === o.length);
	let s = bi(t) && e.enabled && a === !1 && o.every((e) => {
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
		Q(r && r.stake_tier_id === t.stake_tier_id && r.based_rule_epoch === t.based_rule_epoch && (s || Ci(t.platform_minimum, t.platform_maximum, r.minimum_stake, r.maximum_stake)), "INVALID_LIMITS"), Q(typeof r.owner_enabled == "boolean" && (r.owner_enabled === t.owner_enabled || !r.owner_enabled || t.platform_enabled), "PLATFORM_DISABLED");
		let i = e.game_type === "GAME_TYPE_UP_DOWN", a = i ? ["target_payout_rate", "maximum_odds"] : ["fixed_odds"];
		for (let e of a) Q(Si(r[e]) && (s || Y(r[e], t[`platform_${e}`]) <= 0), "INVALID_ODDS");
		Q(i ? Y(r.target_payout_rate, "1") < 0 && Y(r.maximum_odds, "1") >= 0 : Y(r.fixed_odds, "1") > 0 && Y(r.fixed_odds, "2") < 0, "INVALID_ODDS");
		let o = Y(r.minimum_stake, t.minimum_stake) !== 0 || Y(r.maximum_stake, t.maximum_stake) !== 0, l = a.some((e) => Y(r[e], t[e]) !== 0), u = r.owner_enabled !== t.owner_enabled;
		if (o || l || u) {
			let e = {
				duration_seconds: t.duration_seconds,
				stake_tier_id: t.stake_tier_id,
				based_rule_epoch: t.based_rule_epoch,
				minimum_stake: ai(r.minimum_stake),
				maximum_stake: ai(r.maximum_stake)
			};
			if (u && (e.enabled = r.owner_enabled), l) for (let t of a) e[t] = ai(r[t]);
			c.push(e);
		}
	}
	return Q(typeof a == "boolean" && (a === e.enabled || !a || (bi(t) ? e.can_enable : e.platform_enabled)), "PLATFORM_DISABLED"), Q(c.length > 0 || a !== e.enabled, "NO_CHANGES"), {
		...a === e.enabled ? {} : { enabled: a },
		game_type: e.game_type === "GAME_TYPE_UP_DOWN" ? "UP_DOWN" : "HIGH_LOW",
		symbol: e.symbol,
		based_owner_revision: bi(t) ? e.revision : e.owner_revision,
		changes: c,
		client_request_id: i,
		reason: r
	};
}
var Di = class {
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
}, Oi = [
	"35",
	"40",
	"45",
	"60",
	"90"
], ki = "prediction.agent.pending.v1", Ai = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function ji(e, t = "INVALID_CONFIGURATION") {
	if (!e) throw Error(t);
}
function Mi(e) {
	ji(Ai(e)), ji(e.scope === "CONFIG_SCOPE_AGENT" && Qr(e.agent_id) === e.agent_id), ji(J(e.template_version) && J(e.agent_version) && X(e.effective_version, 256) && J(e.updated_at_ms)), ji(Array.isArray(e.rules) && e.rules.length === 5);
	let t = e.rules, n = t[0]?.symbol;
	ji(X(n, 64, !0)), ji(new Set(t.map((e) => e.duration_seconds)).size === 5);
	for (let e of t) ji(Ai(e) && e.game_type === "GAME_TYPE_UP_DOWN" && e.symbol === n && Oi.includes(e.duration_seconds) && typeof e.enabled == "boolean"), ji(Array.isArray(e.stake_tiers) && e.stake_tiers.every((e) => Ai(e) && X(e.stake_tier_id) && typeof e.enabled == "boolean" && typeof e.retired == "boolean"));
}
function Ni(e) {
	return Mi(e), e.rules[0].symbol;
}
function Pi(e, t) {
	ji(Object.keys(e).length === t.length && Object.keys(e).every((e) => t.includes(e)), "PENDING_CORRUPT");
}
function Fi(e) {
	ji(Ai(e), "PENDING_CORRUPT"), Pi(e, [
		"client_request_id",
		"reason",
		"based_on_template_version",
		"based_on_agent_version",
		"game_type",
		"symbol",
		"agent_override"
	]), ji(X(e.client_request_id, 128) && X(e.reason, 500) && J(e.based_on_template_version) && J(e.based_on_agent_version) && e.game_type === "UP_DOWN" && X(e.symbol, 64, !0), "PENDING_CORRUPT");
	let t = e.agent_override;
	ji(Ai(t), "PENDING_CORRUPT"), Pi(t, ["enabled", "overrides"]), ji(typeof t.enabled == "boolean" && Array.isArray(t.overrides) && t.overrides.length === 5, "PENDING_CORRUPT");
	let n = t.overrides;
	ji(new Set(n.map((e) => e.duration_seconds)).size === 5, "PENDING_CORRUPT");
	for (let e of n) {
		ji(Ai(e), "PENDING_CORRUPT"), Pi(e, [
			"duration_seconds",
			"enabled",
			"stake_tiers"
		]), ji(Oi.includes(e.duration_seconds) && typeof e.enabled == "boolean" && Array.isArray(e.stake_tiers) && e.stake_tiers.length === 1, "PENDING_CORRUPT");
		let t = e.stake_tiers[0];
		ji(Ai(t), "PENDING_CORRUPT"), Pi(t, [
			"stake_tier_id",
			"enabled",
			"maximum_stake"
		]), ji(X(t.stake_tier_id) && t.enabled === e.enabled && $r(t.maximum_stake) && Y(t.maximum_stake, "1") >= 0, "PENDING_CORRUPT");
	}
	ji(t.enabled === n.some((e) => e.enabled), "PENDING_CORRUPT");
}
function Ii(e) {
	if (e && typeof e == "object") {
		Object.freeze(e);
		for (let t of Object.values(e)) Ii(t);
	}
	return e;
}
function Li(e) {
	let t = e.getItem(ki);
	if (t === null) return null;
	ji(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return ji(Ai(n), "PENDING_CORRUPT"), Pi(n, [
		"schema",
		"operator_id",
		"agent_id",
		"body",
		"attempted",
		"attempt"
	]), ji(n.schema === 1 && Qr(n.operator_id) === n.operator_id && Qr(n.agent_id) === n.agent_id && typeof n.attempted == "boolean" && Number.isSafeInteger(n.attempt) && Number(n.attempt) >= 0 && n.attempted === Number(n.attempt) > 0, "PENDING_CORRUPT"), Fi(n.body), Ii(n);
}
var Ri = (e, t) => !!e && e.operator_id === t.operator_id && e.agent_id === t.agent_id && JSON.stringify(e.body) === JSON.stringify(t.body);
function zi(e, t) {
	Ri(Li(e), t) && e.removeItem(ki);
}
function Bi(e, t, n, r) {
	try {
		ji(Ai(e) && Ai(e.receipt)), Mi(e.configuration), ji(e.configuration.agent_id === r && e.configuration.rules[0].symbol === t.symbol);
		let i = e.receipt;
		return ji([
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
		].every((e) => typeof i[e] == "string")), ji(X(i.operation_id, 256) && X(i.trace_id, 256) && J(i.created_at_ms) && J(i.completed_at_ms)), ji(i.client_request_id === t.client_request_id && i.operator_id === n && i.source_service === "agent_admin" && i.result === "OPERATION_RESULT_SUCCEEDED" && i.reason === t.reason), !0;
	} catch {
		return !1;
	}
}
function Vi(e) {
	return Ai(e) ? [
		"INVALID_ARGUMENT",
		"UNAUTHENTICATED",
		"PERMISSION_DENIED",
		"NOT_FOUND",
		"CONFLICT"
	].includes(String(e.error_code)) ? !0 : Ai(e.response) && [
		401,
		403,
		422
	].includes(Number(e.response.status)) : !1;
}
var Hi = /* @__PURE__ */ new WeakMap();
function Ui(e, t, n) {
	let r = Hi.get(e);
	if (r) return ji(Ri(r.pending, t), "PENDING_EXISTS"), r.promise;
	let i = Li(e);
	ji(Ri(i, t), "PENDING_CHANGED");
	let a = i.attempted, o = i.attempt + 1;
	ji(Number.isSafeInteger(o), "ATTEMPT_LIMIT"), e.setItem(ki, JSON.stringify({
		...i,
		attempted: !0,
		attempt: o
	}));
	let s = Li(e);
	ji(s?.attempt === o && Ri(s, t), "PERSISTENCE_UNAVAILABLE");
	let c = Promise.resolve().then(async () => {
		try {
			let r = await n(t.body);
			return Ri(Li(e), t) ? Bi(r, t.body, t.operator_id, t.agent_id) ? (zi(e, t), {
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
			let r = Li(e);
			if (!Ri(r, t)) return {
				status: "superseded",
				error: n
			};
			let i = Ai(n) && n.client_request_id !== void 0 && n.client_request_id !== t.body.client_request_id;
			return !a && r.attempt === o && !i && Vi(n) ? (zi(e, t), {
				status: "rejected",
				error: n
			}) : {
				status: "unknown",
				error: n
			};
		}
	}).finally(() => {
		Hi.get(e)?.promise === c && Hi.delete(e);
	});
	return Hi.set(e, {
		pending: t,
		promise: c
	}), c;
}
//#endregion
//#region src/prediction-config/agent/views/prediction/game-config/owner-mutation.ts
function Wi(e) {
	Q(xi(e), "IDENTITY_UNCONFIRMED");
}
var Gi = "prediction.owner.pending.v1";
function Ki(e, t, n = []) {
	Q(t.every((t) => Object.hasOwn(e, t)) && Object.keys(e).every((e) => t.includes(e) || n.includes(e)), "PENDING_CORRUPT");
}
function qi(e) {
	Q(Z(e), "PENDING_CORRUPT"), Ki(e, [
		"game_type",
		"symbol",
		"based_owner_revision",
		"changes",
		"client_request_id",
		"reason"
	], ["enabled"]), Q(e.enabled === void 0 || typeof e.enabled == "boolean", "PENDING_CORRUPT"), Q(["UP_DOWN", "HIGH_LOW"].includes(String(e.game_type)) && X(e.symbol, 64, !0) && X(e.client_request_id, 128) && X(e.reason, 500) && J(e.based_owner_revision), "PENDING_CORRUPT"), Q(Array.isArray(e.changes) && (e.changes.length > 0 || e.enabled !== void 0) && e.changes.length <= 100 && new Set(e.changes.map((e) => e.duration_seconds)).size === e.changes.length, "PENDING_CORRUPT");
	for (let t of e.changes) Q(Z(t)), Ki(t, [
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
	]), Q(t.enabled === void 0 || typeof t.enabled == "boolean", "PENDING_CORRUPT"), e.game_type === "UP_DOWN" ? (Q(t.fixed_odds === void 0, "PENDING_CORRUPT"), (t.target_payout_rate !== void 0 || t.maximum_odds !== void 0) && Q(Si(t.target_payout_rate) && Y(t.target_payout_rate, "1") <= 0 && Si(t.maximum_odds) && Y(t.maximum_odds, "1") >= 0, "PENDING_CORRUPT")) : (Q(t.target_payout_rate === void 0 && t.maximum_odds === void 0, "PENDING_CORRUPT"), t.fixed_odds !== void 0 && Q(Si(t.fixed_odds) && Y(t.fixed_odds, "1") > 0, "PENDING_CORRUPT")), Q(J(t.duration_seconds, !0) && J(t.based_rule_epoch, !0) && (e.game_type === "UP_DOWN" ? si.includes(t.duration_seconds) && X(t.stake_tier_id) : t.stake_tier_id === ""), "PENDING_CORRUPT"), Q(Si(t.minimum_stake) && Si(t.maximum_stake) && Y(t.minimum_stake, t.maximum_stake) <= 0, "PENDING_CORRUPT");
}
function Ji(e) {
	let t = e.getItem(Gi);
	if (t === null) return null;
	Q(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return Q(Z(n)), Ki(n, [
		"schema",
		"operator_id",
		"agent_id",
		"body",
		"attempted",
		"attempt"
	], ["config_site_id", "kind"]), Wi(n), Q(n.schema === (bi(n) ? "scoped-owner-v1" : "owner-v1") && typeof n.attempted == "boolean" && Number.isSafeInteger(n.attempt) && Number(n.attempt) >= 0 && n.attempted === Number(n.attempt) > 0, "PENDING_CORRUPT"), qi(n.body), ci(n);
}
var Yi = (e, t) => !!e && e.operator_id === t.operator_id && e.agent_id === t.agent_id && e.config_site_id === t.config_site_id && e.kind === t.kind && e.schema === t.schema && JSON.stringify(e.body) === JSON.stringify(t.body);
function Xi(e, t, n) {
	Wi(t), qi(n), Q(Ji(e) === null, "PENDING_EXISTS");
	let r = {
		schema: bi(t) ? "scoped-owner-v1" : "owner-v1",
		operator_id: t.operator_id,
		agent_id: t.agent_id,
		...bi(t) ? {
			config_site_id: t.config_site_id,
			kind: t.kind
		} : {},
		body: JSON.parse(JSON.stringify(n)),
		attempted: !1,
		attempt: 0
	};
	return e.setItem(Gi, JSON.stringify(r)), Q(Yi(Ji(e), r), "PERSISTENCE_UNAVAILABLE"), ci(r);
}
function Zi(e, t) {
	Yi(Ji(e), t) && e.removeItem(Gi);
}
function Qi(e, t) {
	try {
		if (bi(t)) return $i(e, t);
		Q(Z(e) && Z(e.receipt)), wi(e.configuration, t);
		let n = t.body, r = e.configuration, i = e.receipt;
		Q(r.symbol === n.symbol && r.game_type === "GAME_TYPE_" + n.game_type && BigInt(r.owner_revision) === BigInt(n.based_owner_revision) + 1n), n.enabled !== void 0 && Q(r.enabled === n.enabled);
		for (let e of n.changes) {
			let t = r.rules.find((t) => t.rule.duration_seconds === e.duration_seconds);
			Q(t && t.rule_epoch === e.based_rule_epoch), e.enabled !== void 0 && Q(t.owner_enabled === e.enabled);
			for (let n of [
				"target_payout_rate",
				"maximum_odds",
				"fixed_odds"
			]) e[n] !== void 0 && Q(Y(t.rule[n], e[n]) === 0);
			let i = n.game_type === "UP_DOWN" ? yi(t.rule) : t.rule;
			Q(("stake_tier_id" in i ? i.stake_tier_id : "") === e.stake_tier_id && Y(i.minimum_stake, e.minimum_stake) === 0 && Y(i.maximum_stake, e.maximum_stake) === 0);
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
		].every((e) => typeof i[e] == "string")), Q(X(i.operation_id, 256) && X(i.trace_id, 256) && X(i.target_id, 256) && J(i.created_at_ms) && J(i.completed_at_ms)), Q(i.operator_id === t.operator_id && i.client_request_id === n.client_request_id && i.reason === n.reason && i.source_service === "agent_admin"), Q(i.result === "OPERATION_RESULT_SUCCEEDED" && i.error_code === "" && i.action === "ADMIN_ACTION_OWNER_CONFIG_PUBLISH" && i.capability === "prediction.owner.config.publish" && i.target_type === "owner_config"), !0;
	} catch {
		return !1;
	}
}
function $i(e, t) {
	Q(Z(e) && Z(e.stored) && Z(e.receipt));
	let n = e.stored, r = e.receipt, i = t.body;
	Q(Z(n.key) && n.key.configSiteId === t.config_site_id && n.key.ownerAgentId === t.agent_id && n.key.gameType === i.game_type && n.key.symbol === i.symbol), Q(J(n.revision, !0) && BigInt(n.revision) === BigInt(i.based_owner_revision) + 1n && J(n.basedPublicVersion, !0) && J(n.basedSiteRevision)), Q(n.basedSiteRevision === "0" == (t.kind === "SITE" || t.config_site_id === "0")), Q(typeof n.disabled == "boolean" && (i.enabled === void 0 || n.disabled === !i.enabled)), Q(Array.isArray(n.overrides) && n.overrides.length > 0 && n.overrides.length <= 100);
	let a = /* @__PURE__ */ new Map();
	for (let e of n.overrides) {
		Q(Z(e) && Z(e.key) && e.key.gameType === i.game_type && e.key.symbol === i.symbol && Number.isSafeInteger(e.key.durationSeconds) && Number(e.key.durationSeconds) > 0);
		let t = String(e.key.durationSeconds);
		Q(!a.has(t) && typeof e.enabled == "boolean" && J(e.basedRuleEpoch, !0) && Z(e.bounds) && Z(e.odds)), Q(Si(e.bounds.minimum) && Si(e.bounds.maximum) && Y(e.bounds.minimum, e.bounds.maximum) <= 0), i.game_type === "UP_DOWN" ? Q(si.includes(t) && X(e.stakeTierId) && Si(e.odds.targetPayoutRate) && Y(e.odds.targetPayoutRate, "1") <= 0 && Si(e.odds.maximumOdds) && Y(e.odds.maximumOdds, "1") >= 0 && e.odds.fixedOdds === void 0) : Q(e.stakeTierId === "" && Si(e.odds.fixedOdds) && Y(e.odds.fixedOdds, "1") > 0 && e.odds.targetPayoutRate === void 0 && e.odds.maximumOdds === void 0), a.set(t, e);
	}
	for (let e of i.changes) {
		let t = a.get(e.duration_seconds);
		Q(t && Z(t.bounds) && Z(t.odds) && t.stakeTierId === e.stake_tier_id && t.basedRuleEpoch === e.based_rule_epoch && (e.enabled === void 0 || t.enabled === e.enabled)), Q(Y(String(t.bounds.minimum), e.minimum_stake) === 0 && Y(String(t.bounds.maximum), e.maximum_stake) === 0);
		for (let [n, r] of [
			["target_payout_rate", "targetPayoutRate"],
			["maximum_odds", "maximumOdds"],
			["fixed_odds", "fixedOdds"]
		]) e[n] !== void 0 && Q(Y(String(t.odds[r]), e[n]) === 0);
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
	].every((e) => typeof r[e] == "string")), Q(X(r.operation_id, 256) && X(r.trace_id, 256) && typeof r.target_id == "string" && /^[a-f0-9]{64}$/.test(r.target_id) && J(r.created_at_ms) && J(r.completed_at_ms)), Q(r.operator_id === t.operator_id && r.client_request_id === i.client_request_id && r.reason === i.reason && r.source_service === "agent_admin"), Q(r.result === "OPERATION_RESULT_SUCCEEDED" && r.error_code === "" && r.action === "ADMIN_ACTION_SCOPED_CONFIG_PUBLISH" && r.target_type === "scoped_owner_config" && r.capability === "prediction." + (t.kind === "SITE" ? "site" : "owner") + ".config.publish");
	let o = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(r.after_json), (e) => e.charCodeAt(0)))), s = (e) => Array.isArray(e) ? e.map(s) : Z(e) ? Object.fromEntries(Object.keys(e).sort().map((t) => [t, s(e[t])])) : e;
	return Q(JSON.stringify(s(o)) === JSON.stringify(s(n))), !0;
}
var ea = /* @__PURE__ */ new WeakMap();
function ta(e, t, n) {
	let r = ea.get(e);
	if (r) return Q(Yi(r.pending, t), "PENDING_EXISTS"), r.promise;
	let i = Ji(e);
	Q(Yi(i, t), "PENDING_CHANGED");
	let a = i.attempted, o = i.attempt + 1;
	Q(Number.isSafeInteger(o), "ATTEMPT_LIMIT"), e.setItem(Gi, JSON.stringify({
		...i,
		attempted: !0,
		attempt: o
	}));
	let s = Ji(e);
	Q(s?.attempt === o && Yi(s, t), "PERSISTENCE_UNAVAILABLE");
	let c = Promise.resolve().then(async () => {
		try {
			let r = await n(t.body);
			return Yi(Ji(e), t) ? Qi(r, t) ? (Zi(e, t), {
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
			let r = Ji(e);
			if (!Yi(r, t)) return {
				status: "superseded",
				error: n
			};
			let i = Z(n) && n.client_request_id !== void 0 && n.client_request_id !== t.body.client_request_id;
			return !a && r.attempt === o && !i && Vi(n) ? (Zi(e, t), {
				status: "rejected",
				error: n
			}) : {
				status: "unknown",
				error: n
			};
		}
	}).finally(() => {
		ea.get(e)?.promise === c && ea.delete(e);
	});
	return ea.set(e, {
		pending: t,
		promise: c
	}), c;
}
async function na(e, t, n, r) {
	let i = await ta(e, t, n);
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
var ra = "grid.config.pending.v1", ia = /^(0|[1-9]\d*)(?:\.(\d+))?$/, aa = /^[1-9]\d*$/, oa = /^[A-Z0-9]{2,32}$/, sa = [
	"site_id",
	"symbol",
	"based_on_layout_version",
	"based_on_site_version",
	"client_request_id",
	"reason",
	"changes"
], ca = [
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
], la = [
	"based_on_config_id",
	"based_on_default_version",
	"based_on_default_resolution_epoch"
], ua = [
	"price_band_width",
	"column_duration_seconds",
	"price_decimals"
], da = [
	"enabled",
	"target_rtp",
	"min_multiplier",
	"max_multiplier",
	"min_order_amount",
	"max_order_amount"
];
function fa(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function $(e, t = "INVALID_GRID_CONFIGURATION") {
	if (!e) throw Error(t);
}
function pa(e, t) {
	$(Object.keys(e).length === t.length && Object.keys(e).every((e) => t.includes(e)), "PENDING_CORRUPT");
}
function ma(e, t) {
	$(typeof e == "string" && e.length <= 128 && ia.test(e), "INVALID_DECIMAL");
	let [n, r = ""] = e.split("."), i = n.replace(/^0+(?=\d)/, ""), a = r.replace(/0+$/, "");
	return $(t === void 0 || a.length <= t, "INVALID_DECIMAL"), a ? i + "." + a : i;
}
function ha(e) {
	let [t, n = ""] = ma(e).split(".");
	return {
		whole: t,
		fraction: n
	};
}
function ga(e, t) {
	let n = ha(e), r = ha(t);
	if (n.whole.length !== r.whole.length) return n.whole.length > r.whole.length ? 1 : -1;
	if (n.whole !== r.whole) return n.whole > r.whole ? 1 : -1;
	let i = Math.max(n.fraction.length, r.fraction.length), a = n.fraction.padEnd(i, "0"), o = r.fraction.padEnd(i, "0");
	return a === o ? 0 : a > o ? 1 : -1;
}
function _a(e, t) {
	let { whole: n, fraction: r } = ha(e), i = n + r, a = n.length + t, o;
	o = a <= 0 ? "0." + "0".repeat(-a) + i : a >= i.length ? i + "0".repeat(a - i.length) : i.slice(0, a) + "." + i.slice(a);
	let [s, c = ""] = o.split("."), l = s.replace(/^0+(?=\d)/, "") || "0", u = c.replace(/0+$/, "");
	return u ? l + "." + u : l;
}
function va(e) {
	let t = ma(e);
	return $(ga(t, "0") > 0 && ga(t, "1") <= 0, "INVALID_RTP"), _a(t, 2);
}
function ya(e) {
	let t = ma(e);
	return $(ga(t, "0") > 0 && ga(t, "100") < 0, "INVALID_RTP"), _a(t, -2);
}
function ba(e = globalThis.crypto) {
	$(e && typeof e.getRandomValues == "function", "SECURE_RANDOM_UNAVAILABLE");
	let t = e.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	$(t instanceof Uint8Array && t.length === 16, "SECURE_RANDOM_UNAVAILABLE"), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0")).join("");
	return `${n.slice(0, 8)}-${n.slice(8, 12)}-${n.slice(12, 16)}-${n.slice(16, 20)}-${n.slice(20)}`;
}
function xa(e) {
	return $(typeof e == "string" && aa.test(e) && ga(e, "25") <= 0, "INVALID_LAYOUT_DURATION"), e;
}
function Sa(e, t) {
	let n = ma(e, t);
	return $(ga(n, "0") > 0, "INVALID_LAYOUT_WIDTH"), n;
}
function Ca(e) {
	return $(e === null || typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 18, "INVALID_LAYOUT_PRECISION"), e;
}
function wa(e) {
	return $(typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 8, "INVALID_LAYOUT_PRECISION"), e;
}
function Ta(e, t) {
	t != null && $((ma(e).split(".")[1] ?? "").length <= t, "INVALID_LAYOUT_PRECISION");
}
function Ea(e, t) {
	$(5 + (Number(e) + 1) * Number(t) <= 30, "INVALID_LAYOUT_HORIZON");
}
function Da(e) {
	return $(fa(e), "INVALID_GRID_LAYOUT"), pa(e, [
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
	].every((e) => typeof e == "string" && e.length <= 128 && aa.test(e)), "INVALID_GRID_LAYOUT"), $(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_LAYOUT"), $(typeof e.editable == "boolean", "INVALID_GRID_LAYOUT"), $(Array.isArray(e.affected_site_ids) && e.affected_site_ids.every((e) => typeof e == "string" && e.length > 0 && e.length <= 64 && e.trim() === e), "INVALID_GRID_LAYOUT"), $(new Set(e.affected_site_ids).size === e.affected_site_ids.length && (!e.editable || e.affected_site_ids.length > 0), "INVALID_GRID_LAYOUT"), {
		row_count: e.row_count,
		column_count: e.column_count,
		column_duration_seconds: e.column_duration_seconds,
		price_band_width: Sa(e.price_band_width),
		..."price_decimals" in e ? { price_decimals: Ca(e.price_decimals) } : {},
		effective_from_ms: e.effective_from_ms,
		editable: e.editable,
		affected_site_ids: [...e.affected_site_ids]
	};
}
function Oa(e) {
	$(fa(e), "INVALID_GRID_CONFIGURATION"), pa(e, [
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
		..."config_id" in e ? ca : [],
		...ut.filter((t) => t in e)
	]), $(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "INVALID_GRID_CONFIGURATION"), $(typeof e.symbol == "string" && oa.test(e.symbol), "INVALID_GRID_CONFIGURATION"), $([e.layout_version, e.site_version].every((e) => typeof e == "string" && aa.test(e)), "INVALID_GRID_CONFIGURATION"), $(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_CONFIGURATION"), $(typeof e.enabled == "boolean", "INVALID_GRID_CONFIGURATION");
	let t = {
		site_id: e.site_id,
		symbol: e.symbol,
		layout_version: e.layout_version,
		site_version: e.site_version,
		effective_from_ms: e.effective_from_ms,
		enabled: e.enabled,
		target_rtp: ma(e.target_rtp),
		min_multiplier: ma(e.min_multiplier, 2),
		max_multiplier: ma(e.max_multiplier, 2),
		min_order_amount: ma(e.min_order_amount, 8),
		max_order_amount: ma(e.max_order_amount, 8)
	};
	if ($(ga(t.target_rtp, "0") > 0 && ga(t.target_rtp, "1") <= 0, "INVALID_GRID_CONFIGURATION"), $(ga(t.min_multiplier, "1") >= 0 && ga(t.max_multiplier, t.min_multiplier) >= 0, "INVALID_GRID_CONFIGURATION"), $(ga(t.min_order_amount, "0") > 0 && ga(t.max_order_amount, t.min_order_amount) >= 0, "INVALID_GRID_CONFIGURATION"), "config_id" in e) {
		for (let n of [
			"config_id",
			"default_config_id",
			"default_version",
			"default_resolution_epoch"
		]) $(typeof e[n] == "string" && aa.test(e[n]) && ga(e[n], "9223372036854775807") <= 0), t[n] = e[n];
		$(typeof e.requested_agent_id == "string" && /^(0|[1-9][0-9]*)$/.test(e.requested_agent_id) && ga(e.requested_agent_id, "9223372036854775807") <= 0), $(e.agent_id === null || e.agent_id === e.requested_agent_id && e.agent_id !== "0"), t.requested_agent_id = e.requested_agent_id, t.agent_id = e.agent_id;
		for (let n of [
			"inherited",
			"default_enabled",
			"effective_enabled"
		]) $(typeof e[n] == "boolean"), t[n] = e[n];
		for (let n of [
			"default_target_rtp",
			"default_min_order_amount",
			"default_max_order_amount"
		]) t[n] = ma(e[n]);
	}
	return Object.assign(t, gt(e, ma)), "layout" in e && (t.layout = Da(e.layout)), t;
}
function ka(e, t, n) {
	let r = Oa(e);
	return $(r.site_id === t && r.symbol === n, "INVALID_GRID_TARGET"), r;
}
function Aa(e, t, n, r, i, a = !1) {
	let o = Oa(e), s = Oa(t);
	$(o.site_id === s.site_id && o.symbol === s.symbol, "INVALID_GRID_TARGET"), $(typeof n == "string" && n.length <= 500 && n.trim().length > 0 && !n.includes("\0"), "INVALID_REASON"), $(typeof r == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(r), "INVALID_REQUEST_ID"), $(o.config_id && o.default_version && o.default_resolution_epoch, "CONFIG_IDENTITY_REQUIRED"), $(ca.every((e) => o[e] === s[e]), "INVALID_GRID_TARGET"), $(JSON.stringify(gt(o, ma)) === JSON.stringify(gt(s, ma)), "INVALID_GRID_TARGET");
	let c = {};
	for (let e of da) o[e] !== s[e] && (c[e] = s[e]);
	for (let e of ua) o.layout?.[e] !== s.layout?.[e] && ($(a && o.layout?.editable && s.layout, "FIELD_FORBIDDEN"), c[e] = s.layout[e]);
	if (o.requested_agent_id !== "0" && !(c.enabled === !1 && Object.keys(c).length === 1) && ($(!s.enabled || o.default_enabled, "PLATFORM_LIMIT"), $(ga(s.target_rtp, o.default_target_rtp) <= 0 && ga(s.min_order_amount, o.default_min_order_amount) >= 0 && ga(s.max_order_amount, o.default_max_order_amount) <= 0, "PLATFORM_LIMIT")), ua.some((e) => e in c)) {
		let e = o.layout;
		"price_decimals" in c && wa(c.price_decimals), Ta(s.layout.price_band_width, s.layout.price_decimals), Sa(c.price_band_width ?? e.price_band_width, 18);
		let t = xa(c.column_duration_seconds ?? e.column_duration_seconds);
		$(ga(e.row_count, "10000") <= 0 && ga(e.column_count, "10000") <= 0 && Number(e.row_count) * Number(e.column_count) <= 1e4, "INVALID_GRID_LAYOUT"), Ea(e.column_count, t);
	}
	if (!i && ("min_multiplier" in c || "max_multiplier" in c)) throw Error("FIELD_FORBIDDEN");
	return $(Object.keys(c).length > 0, "EMPTY_CHANGES"), {
		site_id: o.site_id,
		symbol: o.symbol,
		based_on_layout_version: o.layout_version,
		based_on_site_version: o.site_version,
		based_on_config_id: o.config_id,
		..._t(o) ? { based_on_global_version: _t(o) } : {},
		based_on_default_version: o.default_version,
		based_on_default_resolution_epoch: o.default_resolution_epoch,
		client_request_id: r,
		reason: n,
		changes: c
	};
}
function ja(e) {
	if ($(fa(e), "PENDING_CORRUPT"), pa(e, [
		...sa,
		..."based_on_config_id" in e ? la : [],
		..."based_on_global_version" in e ? ["based_on_global_version"] : []
	]), "based_on_global_version" in e && $(typeof e.based_on_global_version == "string" && /^(0|[1-9][0-9]*)$/.test(e.based_on_global_version) && ga(e.based_on_global_version, "9223372036854775807") <= 0, "PENDING_CORRUPT"), "based_on_config_id" in e) for (let t of la) $(typeof e[t] == "string" && aa.test(e[t]) && ga(e[t], "9223372036854775807") <= 0, "PENDING_CORRUPT");
	$(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "PENDING_CORRUPT"), $(typeof e.symbol == "string" && oa.test(e.symbol), "PENDING_CORRUPT"), $(typeof e.based_on_layout_version == "string" && aa.test(e.based_on_layout_version), "PENDING_CORRUPT"), $(typeof e.based_on_site_version == "string" && aa.test(e.based_on_site_version), "PENDING_CORRUPT"), $(typeof e.client_request_id == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(e.client_request_id), "PENDING_CORRUPT"), $(typeof e.reason == "string" && e.reason.length <= 500 && e.reason.trim().length > 0 && !e.reason.includes("\0"), "PENDING_CORRUPT"), $(fa(e.changes) && Object.keys(e.changes).length > 0 && Object.keys(e.changes).every((e) => [...da, ...ua].includes(e)), "PENDING_CORRUPT");
	for (let [t, n] of Object.entries(e.changes)) t === "enabled" ? $(typeof n == "boolean", "PENDING_CORRUPT") : t === "price_decimals" ? wa(n) : t === "price_band_width" ? Sa(n, 18) : t === "column_duration_seconds" ? xa(n) : ma(n, t.includes("order_amount") ? 8 : t.includes("multiplier") ? 2 : void 0);
}
function Ma(e) {
	if (e && typeof e == "object") {
		Object.freeze(e);
		for (let t of Object.values(e)) Ma(t);
	}
	return e;
}
function Na(e, t) {
	return !!e && JSON.stringify(e) === JSON.stringify(t);
}
function Pa(e) {
	let t = e.getItem(ra);
	if (t === null) return null;
	$(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return $(fa(n), "PENDING_CORRUPT"), pa(n, [
		"schema",
		"operator_id",
		"command"
	]), $(n.schema === 1 && typeof n.operator_id == "string" && aa.test(n.operator_id), "PENDING_CORRUPT"), ja(n.command), Ma(n);
}
function Fa(e, t, n) {
	$(aa.test(t), "IDENTITY_UNCONFIRMED"), $(Pa(e) === null, "PENDING_EXISTS"), ja(n);
	let r = {
		schema: 1,
		operator_id: t,
		command: JSON.parse(JSON.stringify(n))
	};
	e.setItem(ra, JSON.stringify(r));
	let i = Pa(e);
	return $(Na(i, r), "PERSISTENCE_UNAVAILABLE"), i;
}
function Ia(e, t) {
	return $(aa.test(e), "IDENTITY_UNCONFIRMED"), ja(t), Ma({
		operator_id: e,
		command: structuredClone(t)
	});
}
function La(e, t, n, r) {
	return ja(t.command), ja(r), $(t.operator_id === n && JSON.stringify(t.command) === JSON.stringify(r), "STALE_CONFIRMATION"), Fa(e, t.operator_id, t.command);
}
function Ra(e, t) {
	let n = Pa(e);
	return n ? n.operator_id === t ? {
		status: "bound",
		pending: n
	} : {
		status: "foreign",
		pending: n
	} : { status: "none" };
}
function za(e, t) {
	return fa(e) ? e.operation_status === "SUCCEEDED" && typeof e.operation_id == "string" && aa.test(e.operation_id) && e.site_id === t.command.site_id && e.symbol === t.command.symbol && typeof e.layout_version == "string" && aa.test(e.layout_version) && typeof e.site_version == "string" && aa.test(e.site_version) && typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms) && typeof e.changed == "boolean" && [
		"PENDING",
		"DONE",
		"NOT_REQUIRED"
	].includes(String(e.cache_state)) : !1;
}
function Ba(e) {
	return fa(e) && e.error_code === "RECEIPT_UNCONFIRMED" && e.operation_status === "UNKNOWN";
}
async function Va(e, t, n, r) {
	$(Na(Pa(e), t), "PENDING_CHANGED");
	try {
		let i = await r(n === "recover" ? "save" : n, structuredClone(t.command));
		return za(i, t) ? (Na(Pa(e), t) && e.removeItem(ra), {
			status: "success",
			value: i
		}) : {
			status: "unknown",
			error: /* @__PURE__ */ Error("INVALID_RECEIPT")
		};
	} catch (r) {
		if ((fa(r) ? r.operation_status : void 0) === "FAILED" && (n === "save" || n === "recover" && fa(r) && r.error_code === "VERSION_CONFLICT")) {
			let n = Na(Pa(e), t);
			return n && e.removeItem(ra), {
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
var Ha = class {
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
function Ua(e, t) {
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
function Wa(e, t, n = !1) {
	return Ga(e.filter((e) => n || e.default_enabled).map((e) => ({
		...e,
		configured: !0
	})), t);
}
function Ga(e, t, n = (e) => !!e.enabled) {
	let r = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.trim().toUpperCase();
		r.has(t) || r.set(t, r.size);
	}
	return [...e].sort((e, t) => Number(n(t)) - Number(n(e)) || (r.get(e.symbol) ?? 2 ** 53 - 1) - (r.get(t.symbol) ?? 2 ** 53 - 1) || e.symbol.localeCompare(t.symbol));
}
//#endregion
//#region src/prediction-config/agent/views/grid/config/index.vue?vue&type=script&setup=true&lang.ts
var Ka = {
	class: "grid-config",
	"data-grid-config": "agent"
}, qa = { key: 3 }, Ja = {
	key: 5,
	class: "pending-bar"
}, Ya = { class: "pending-actions" }, Xa = { class: "grid-layout" }, Za = { class: "symbol-panel" }, Qa = { class: "panel-heading" }, $a = {
	key: 1,
	class: "directory-error",
	role: "alert"
}, eo = { class: "symbol-list" }, to = ["disabled", "onClick"], no = {
	key: 0,
	class: "symbol-unconfigured"
}, ro = { key: 2 }, io = { class: "config-panel" }, ao = { class: "config-heading" }, oo = { "data-config-updated-at": "" }, so = { key: 0 }, co = { class: "config-heading__actions" }, lo = {
	key: 0,
	class: "parameter-description"
}, uo = {
	key: 0,
	class: "parameter-card",
	"data-price-precision": ""
}, fo = { class: "fields" }, po = { class: "parameter-card" }, mo = { class: "fields odds-fields" }, ho = { key: 0 }, go = { key: 1 }, _o = { class: "parameter-card" }, vo = { class: "parameter-heading" }, yo = { class: "parameter-description" }, bo = { class: "fields limit-fields" }, xo = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "index",
	props: { actor: {} },
	setup(t, { expose: n }) {
		let { initializeGridSite: l, initializeGridMerchant: f, gridConfigSymbols: p, gridConfigCatalog: m, gridConfigReceipt: h, gridConfigSite: g, saveGridConfig: _ } = he().grid, ne = _e(), re = t, b = i(() => re.actor?.kind === "SITE"), x = () => Ua(sessionStorage, re.actor), S = ge(), ae = (e) => S.perms.includes("*") || S.perms.includes(e), T = i(() => ae("prediction_config:lists") && (!b.value || S.userInfo.can_manage_prediction_config === !0 && re.actor?.operator_id === String(S.userInfo.id))), D = T, O = i(() => {
			let e = String(S.userInfo.id || "");
			return /^[1-9]\d*$/.test(e) ? e : "";
		}), j = i(() => `${O.value}:${S.token ?? ""}:${re.actor?.kind ?? ""}:${re.actor?.tenant_id ?? ""}:${re.actor?.config_site_id ?? ""}`), M = y([]), N = y(""), P = y(""), se = y(""), I = y(null), L = y(null), R = y(""), ce = y("通过预测网格配置页面保存配置"), de = y(!1), z = y(!1), B = y(!1), V = y(!1), H = y(!1), U = y(""), W = y(""), G = y("info"), me = y(null), ye = y(!1), be = y(""), xe = y(!1), Se = new Ha(), Ce = new Ha(), we = new Ha(), K, Te = 0, Ee = i(() => T.value ? O.value ? "" : "无法确认当前操作人身份" : "当前账号没有预测网格配置查询权限"), De = i(() => M.value.find((e) => e.site_id === N.value)), Oe = i(() => b.value && De.value?.can_edit_limits === !0), ke = y([]), Ae = y(""), je = i(() => Wa(De.value?.products ?? [], ke.value, b.value)), Me = i(() => {
			let e = se.value.trim().toUpperCase();
			return je.value.filter((t) => !e || t.symbol.includes(e));
		}), Ne = i(() => {
			if (!I.value || !L.value) return !1;
			try {
				return va(I.value.target_rtp) !== R.value || [
					"enabled",
					"min_multiplier",
					"max_multiplier",
					"min_order_amount",
					"max_order_amount"
				].some((e) => I.value[e] !== L.value[e]);
			} catch {
				return !0;
			}
		}), Pe = i(() => me.value ? me.value.operator_id === O.value ? "bound" : "foreign" : "none"), Fe = i(() => Pe.value === "bound" ? me.value : null), Ie = i(() => Pe.value === "foreign"), Le = i(() => Ne.value || !!me.value || H.value), Re = i(() => T.value && D.value && !!De.value?.can_edit && !!O.value && !!I.value && !me.value && !ye.value && !V.value && !H.value), ze = i(() => !!Fe.value && T.value && D.value && M.value.some((e) => e.site_id === Fe.value.command.site_id && e.can_edit)), Be = i(() => ze.value && z.value && !B.value && !V.value && !H.value && !ye.value && !xe.value && be.value === JSON.stringify(Fe.value));
		function Ve(e) {
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
		let He = i(() => {
			let e = [I.value?.effective_from_ms, I.value?.layout?.effective_from_ms].filter((e) => typeof e == "string" && /^[1-9][0-9]*$/.test(e)).reduce((e, t) => BigInt(e) > BigInt(t) ? e : t, "0");
			return e === "0" ? "未提供" : ei(e);
		});
		function Ue(e) {
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
			return e.sites.filter((e) => !b.value || e.site_id === re.actor?.config_site_id).map((e) => ({
				...e,
				products: e.products.filter((e) => b.value || e.default_enabled)
			}));
		}
		function We() {
			try {
				let e = Ra(x(), O.value);
				me.value = e.pending ?? null, ye.value = !1;
			} catch {
				ye.value = !0, me.value = null;
			}
		}
		function Ge() {
			return `${j.value}:${N.value}:${P.value}`;
		}
		function Ke() {
			Ce.close(), I.value = null, L.value = null, R.value = "", ce.value = "通过预测网格配置页面保存配置", V.value = !1;
		}
		async function qe(e) {
			if (z.value = !1, Se.close(), we.close(), be.value = "", Ke(), M.value = [], ke.value = [], Ae.value = "", N.value = "", P.value = "", se.value = "", U.value = "", W.value = "", We(), Ee.value || ye.value) return;
			let t = Se.next(j.value);
			B.value = !0;
			try {
				if (b.value) {
					if (!l || !re.actor?.config_site_id) throw Error("SITE_UNAVAILABLE");
					Fe.value || await l(re.actor.config_site_id, t.signal);
				} else await f(t.signal);
				if (!t.current(j.value)) return;
				let [n, r] = await Promise.allSettled([m(t.signal), p(t.signal)]);
				if (!t.current(j.value)) return;
				if (r.status === "fulfilled" && Array.isArray(r.value) && r.value.every((e) => typeof e == "string") ? ke.value = r.value : Ae.value = "通用币种目录暂不可用，当前仅显示已授权的网格配置。", n.status === "rejected") throw n.reason;
				M.value = Ue(n.value), z.value = !0;
				let i = Fe.value ?? (e ? { command: e } : null), a = i && M.value.some((e) => e.site_id === i.command.site_id) ? i.command.site_id : M.value[0]?.site_id || "";
				N.value = a;
				let o = M.value.find((e) => e.site_id === a), s = i && i.command.site_id === a && o?.products.some((e) => e.symbol === i.command.symbol) ? i.command.symbol : je.value.find((e) => e.configured)?.symbol || "";
				P.value = s, s && (K = Xe());
			} catch (e) {
				t.current(j.value) && (U.value = Ve(e));
			} finally {
				t.current(j.value) && (B.value = !1);
			}
		}
		function Je(e) {
			Le.value || (Ke(), N.value = e, P.value = je.value.find((e) => e.configured)?.symbol || "", P.value && (K = Xe()));
		}
		function Ye(e) {
			e === P.value || Le.value || !De.value?.products.some((t) => t.symbol === e) || (Ke(), P.value = e, K = Xe());
		}
		async function Xe() {
			if (Ke(), !T.value || !N.value || !P.value) return;
			let e = N.value, t = P.value, n = Ge(), r = Ce.next(n);
			V.value = !0;
			try {
				let n = await g(e, t, r.signal);
				if (!r.current(Ge())) return;
				let i = ka(n, e, t);
				if (b.value && i.requested_agent_id !== "0") throw Error("CONFIG_IDENTITY_REQUIRED");
				I.value = i, L.value = structuredClone(i), R.value = va(i.target_rtp);
			} catch (e) {
				r.current(Ge()) && (U.value = Ve(e));
			} finally {
				r.current(Ge()) && (V.value = !1);
			}
		}
		function Ze(e) {
			return e.symbol === P.value && L.value ? L.value.enabled && (b.value || L.value.default_enabled !== !1) : e.enabled;
		}
		function Qe(e) {
			return !b.value && e.symbol === P.value && I.value?.default_enabled === !1 || !De.value?.products.some((t) => t.symbol === e.symbol) || !D.value || !De.value?.can_edit || V.value || H.value || !!me.value || ye.value || Ne.value && e.symbol !== P.value;
		}
		async function $e(e, t) {
			typeof t != "boolean" || Qe(e) || (e.symbol !== P.value && (Ye(e.symbol), await K), L.value && L.value.symbol === e.symbol && !Qe(e) && (L.value.enabled = t, et()));
		}
		function et() {
			W.value = "";
		}
		async function tt() {
			if (!Re.value || !I.value || !L.value || !O.value) return;
			let e;
			try {
				e = Aa(I.value, {
					...L.value,
					target_rtp: ya(R.value)
				}, ce.value, ba(), Oe.value, !1);
			} catch (e) {
				G.value = "warning", W.value = Ve(e);
				return;
			}
			let t = Ia(O.value, e);
			try {
				await le.confirm(`确认保存 ${e.site_id} / ${e.symbol} 的 ${Object.keys(e.changes).length} 项修改？`, "确认预测网格配置", {
					type: "warning",
					confirmButtonText: "确认保存",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			}
			if (We(), !Re.value || !I.value || !L.value) {
				G.value = "warning", W.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let n;
			try {
				n = Aa(I.value, {
					...L.value,
					target_rtp: ya(R.value)
				}, ce.value, t.command.client_request_id, Oe.value, !1);
			} catch {
				G.value = "warning", W.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let r;
			try {
				r = La(x(), t, O.value, n), We();
			} catch (e) {
				if (e?.message === "STALE_CONFIRMATION") {
					G.value = "warning", W.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
					return;
				}
				ye.value = !0;
				return;
			}
			it(r, "save");
		}
		async function nt() {
			We(), !(!Fe.value || !ze.value || H.value || xe.value) && it(Fe.value, "receipt");
		}
		async function rt() {
			if (We(), !Be.value || !Fe.value) return;
			let e = Fe.value;
			xe.value = !0;
			try {
				await le.confirm(`确认恢复 ${e.command.site_id} / ${e.command.symbol} 的原请求 ${e.command.client_request_id}？将沿用原编号和原参数；已提交则返回原回执，尚未提交则保存原配置，不使用当前页面的新修改。`, "恢复原配置请求", {
					type: "warning",
					confirmButtonText: "确认恢复",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			} finally {
				xe.value = !1;
			}
			if (We(), !Be.value || JSON.stringify(e) !== JSON.stringify(Fe.value)) {
				G.value = "warning", W.value = "确认期间账号、权限或原请求已变化，本次恢复已取消，请重新查询原操作回执";
				return;
			}
			await it(e, "recover");
		}
		async function it(e, t) {
			let n = ++Te, r = Ge(), i = we.next(r);
			H.value = !0, be.value = "", W.value = "";
			try {
				let n = await Va(x(), e, t, (e, t) => e === "save" ? _(t) : h(t));
				if (!i.current(Ge())) return;
				if (We(), n.status === "success") {
					let e = O.value;
					ce.value = "通过预测网格配置页面保存配置", H.value = !1, await qe(), e === O.value && (G.value = "warning", W.value = U.value ? "配置已保存；最新配置刷新失败，请手动刷新" : "");
				} else if (t === "recover" && n.status === "rejected" && n.error?.error_code === "VERSION_CONFLICT") if (!n.journalCleared || me.value || ye.value) G.value = "warning", W.value = "旧请求已明确拒绝，但本机待确认记录已变化，请重新核对当前记录";
				else {
					let t = O.value;
					if (await qe(e.command), N.value && P.value && K && await K, t === O.value) {
						G.value = "warning";
						let t = N.value === e.command.site_id && P.value === e.command.symbol && M.value.some((t) => t.site_id === e.command.site_id && t.products.some((t) => t.symbol === e.command.symbol));
						W.value = "旧请求未生效，配置版本已变化；已清除旧待确认记录。" + (t ? U.value || !I.value ? "最新配置刷新失败，请手动刷新" : "请以当前配置为准" : `原目标当前不可见（${e.command.site_id} / ${e.command.symbol}），请核对权限和配置`);
					}
				}
				else G.value = n.status === "unknown" ? "warning" : "info", t === "receipt" && Ba(n.error) && JSON.stringify(Fe.value) === JSON.stringify(e) ? (be.value = JSON.stringify(e), W.value = "未找到原操作回执，可使用原编号和原参数恢复请求") : t === "recover" ? W.value = "恢复尚未确认，原请求已保留，请重新查询原操作回执 · " + Ve(n.error) : W.value = n.status === "unknown" ? "原操作结果仍待确认，请使用原请求查询回执" : "保存已明确拒绝，可修正后重新提交 · " + Ve(n.error);
			} catch (e) {
				i.current(Ge()) && (We(), G.value = "warning", W.value = "原操作结果仍待确认 · " + Ve(e));
			} finally {
				n === Te && (H.value = !1, We());
			}
		}
		async function at() {
			if (!Le.value) return !0;
			try {
				return await le.confirm("当前有未保存修改或待确认操作，离开不会删除原记录。仍要离开吗？", "离开预测网格配置", { type: "warning" }), !0;
			} catch {
				return !1;
			}
		}
		function ot() {
			return JSON.stringify({
				operator: O.value,
				site: N.value,
				symbol: P.value,
				snapshot: I.value,
				draft: L.value,
				rtp: R.value,
				reason: ce.value
			});
		}
		async function st() {
			if (!H.value) {
				if (Ne.value) {
					let e = ot();
					try {
						await le.confirm("刷新会丢弃当前未保存修改，仍要刷新吗？", "刷新预测网格配置", { type: "warning" });
					} catch {
						return;
					}
					if (H.value || e !== ot()) {
						G.value = "warning", W.value = "确认期间编辑状态已变化，本次刷新已取消";
						return;
					}
				}
				await qe();
			}
		}
		function ct(e) {
			Le.value && (e.preventDefault(), e.returnValue = "");
		}
		return oe(() => [
			j.value,
			T.value,
			D.value
		], () => qe(), { immediate: !0 }), ve(at), window.addEventListener("beforeunload", ct), te(() => {
			be.value = "", z.value = !1, Se.close(), Ce.close(), we.close(), window.removeEventListener("beforeunload", ct);
		}), n({
			hasBlockingWork: Le,
			confirmLeave: at,
			refresh: st,
			loading: B
		}), (t, n) => (v(), s("section", Ka, [
			Ee.value ? (v(), a(w(k), {
				key: 0,
				title: Ee.value,
				type: "warning",
				closable: !1
			}, null, 8, ["title"])) : ye.value ? (v(), a(w(k), {
				key: 1,
				title: "本机保存的待确认操作记录已损坏或不可用，请停止操作并联系管理员核验",
				type: "error",
				closable: !1
			})) : Ie.value ? (v(), a(w(k), {
				key: 2,
				title: "检测到其他账号尚未确认的预测网格配置操作，当前账号不可覆盖，请切回原账号查询回执",
				type: "error",
				closable: !1
			})) : o("", !0),
			U.value ? (v(), s("div", qa, [d(w(k), {
				title: U.value,
				type: "error",
				closable: !1
			}, null, 8, ["title"]), d(w(A), {
				loading: B.value || V.value,
				disabled: H.value || !!me.value,
				onClick: st
			}, {
				default: E(() => [...n[9] ||= [u("重试", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"])])) : o("", !0),
			W.value ? (v(), a(w(k), {
				key: 4,
				title: W.value,
				type: G.value,
				closable: !1
			}, null, 8, ["title", "type"])) : o("", !0),
			Fe.value ? (v(), s("div", Ja, [c("div", null, [n[10] ||= c("strong", null, "原配置操作结果待确认", -1), c("small", null, C(Fe.value.command.site_id) + " · " + C(Fe.value.command.symbol) + " · " + C(Fe.value.command.client_request_id), 1)]), c("div", Ya, [d(w(A), {
				type: "warning",
				loading: H.value,
				disabled: !ze.value || xe.value,
				onClick: nt
			}, {
				default: E(() => [...n[11] ||= [u("查询原操作回执", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"]), Be.value || xe.value ? (v(), a(w(A), {
				key: 0,
				type: "warning",
				disabled: !Be.value,
				onClick: rt
			}, {
				default: E(() => [...n[12] ||= [u("恢复原请求", -1)]]),
				_: 1
			}, 8, ["disabled"])) : o("", !0)])])) : o("", !0),
			d(_n, {
				loading: B.value,
				"min-height": "0px",
				class: "grid-loading-region"
			}, {
				default: E(() => [c("div", Xa, [c("aside", Za, [
					c("div", Qa, [n[13] ||= c("strong", null, "交易对配置", -1), c("span", null, C(Me.value.length) + " 条", 1)]),
					M.value.length > 1 ? (v(), a(w(fe), {
						key: 0,
						modelValue: N.value,
						"onUpdate:modelValue": n[0] ||= (e) => N.value = e,
						"aria-label": "选择站点",
						disabled: Le.value,
						onChange: Je
					}, {
						default: E(() => [(v(!0), s(r, null, ie(M.value, (e) => (v(), a(w(ue), {
							key: e.site_id,
							label: e.site_id,
							value: e.site_id
						}, null, 8, ["label", "value"]))), 128))]),
						_: 1
					}, 8, ["modelValue", "disabled"])) : o("", !0),
					Ae.value ? (v(), s("p", $a, [u(C(Ae.value), 1), d(w(A), {
						link: "",
						type: "primary",
						disabled: Le.value,
						onClick: st
					}, {
						default: E(() => [...n[14] ||= [u("重试", -1)]]),
						_: 1
					}, 8, ["disabled"])])) : o("", !0),
					d(w(e), {
						modelValue: se.value,
						"onUpdate:modelValue": n[1] ||= (e) => se.value = e,
						clearable: "",
						placeholder: "搜索交易对",
						"aria-label": "搜索交易对"
					}, null, 8, ["modelValue"]),
					c("div", eo, [(v(!0), s(r, null, ie(Me.value, (e) => (v(), s("div", {
						key: e.symbol,
						class: ee(["symbol-row", { active: e.symbol === P.value }])
					}, [
						c("button", {
							type: "button",
							class: "symbol-button",
							disabled: !e.configured || Le.value && e.symbol !== P.value,
							onClick: (t) => Ye(e.symbol)
						}, [d(w(ne), { symbol: e.symbol }, null, 8, ["symbol"])], 8, to),
						e.configured ? (v(), a(w(pe), {
							key: 1,
							"model-value": Ze(e),
							disabled: Qe(e),
							"aria-label": `${e.symbol} 开放配置`,
							onChange: (t) => $e(e, t)
						}, null, 8, [
							"model-value",
							"disabled",
							"aria-label",
							"onChange"
						])) : (v(), s("span", no, "未配置")),
						e.symbol === P.value && Ne.value ? (v(), s("small", ro, "未保存")) : o("", !0)
					], 2))), 128)), !B.value && De.value && !Me.value.length ? (v(), a(w(F), {
						key: 0,
						description: "当前站点没有已授权的预测网格产品",
						"image-size": 56
					})) : o("", !0)])
				]), c("main", io, [!B.value && !M.value.length && !U.value ? (v(), a(w(F), {
					key: 0,
					description: "当前账号暂无授权站点"
				})) : De.value && !P.value ? (v(), a(w(F), {
					key: 1,
					description: "请选择交易对查看配置"
				})) : I.value && L.value ? (v(), s(r, { key: 2 }, [
					c("header", ao, [c("div", null, [
						c("h2", null, C(I.value.symbol) + " · 预测网格", 1),
						c("p", oo, "更新时间 " + C(He.value), 1),
						M.value.length > 1 ? (v(), s("p", so, "当前站点：" + C(I.value.site_id), 1)) : o("", !0)
					]), c("div", co, [d(w(A), { onClick: n[2] ||= (e) => de.value = !0 }, {
						default: E(() => [...n[15] ||= [u("玩法说明", -1)]]),
						_: 1
					}), w(D) ? (v(), a(w(A), {
						key: 0,
						type: "primary",
						loading: H.value,
						disabled: !Re.value || !Ne.value,
						onClick: tt
					}, {
						default: E(() => [...n[16] ||= [u("保存配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])) : o("", !0)])]),
					I.value.requested_agent_id === "0" ? o("", !0) : (v(), s("p", lo, C(I.value.inherited ? "当前继承所属站点配置" : "当前使用商户配置") + "；已有商户配置保持不变。平台返奖率上限 " + C(I.value.default_target_rtp ? `${w(va)(I.value.default_target_rtp)}%` : "—") + "，单笔范围 " + C(I.value.default_min_order_amount) + " ~ " + C(I.value.default_max_order_amount) + " USDT。", 1)),
					!b.value && I.value.default_enabled === !1 ? (v(), a(w(k), {
						key: 1,
						title: "平台已关闭此币种，商户不能开启",
						type: "info",
						closable: !1
					})) : o("", !0),
					d(_n, { loading: V.value }, {
						default: E(() => [
							I.value.layout ? (v(), s("article", uo, [n[17] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "价格精度"), c("p", { class: "parameter-description" }, "由总后台统一设置，此处只读")], -1), c("div", fo, [c("label", null, [c("span", null, "价格小数位：" + C(I.value.layout.price_decimals == null ? "未设置（沿用原规则）" : `${I.value.layout.price_decimals} 位`), 1)])])])) : o("", !0),
							c("article", po, [n[25] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "赔率配置"), c("p", { class: "parameter-description" }, "格子赔率按目标返奖率与命中概率动态计算")], -1), c("div", mo, [
								c("label", null, [
									c("span", null, [n[18] ||= u("目标返奖率", -1), d(bn, {
										label: "目标返奖率",
										content: "例如 97%：命中概率为 20% 时，计算赔率为 4.85x。"
									})]),
									d(Dn, {
										"input-component": w(e),
										modelValue: R.value,
										"onUpdate:modelValue": n[3] ||= (e) => R.value = e,
										disabled: !Re.value,
										inputmode: "decimal",
										onInput: et
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
								Oe.value ? (v(), s("label", ho, [n[22] ||= c("span", null, "最低赔率", -1), d(Dn, {
									"input-component": w(e),
									modelValue: L.value.min_multiplier,
									"onUpdate:modelValue": n[4] ||= (e) => L.value.min_multiplier = e,
									disabled: !Re.value,
									inputmode: "decimal",
									onInput: et
								}, {
									append: E(() => [...n[21] ||= [u("x", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								])])) : o("", !0),
								Oe.value ? (v(), s("label", go, [n[24] ||= c("span", null, "最高赔率", -1), d(Dn, {
									"input-component": w(e),
									modelValue: L.value.max_multiplier,
									"onUpdate:modelValue": n[5] ||= (e) => L.value.max_multiplier = e,
									disabled: !Re.value,
									inputmode: "decimal",
									onInput: et
								}, {
									append: E(() => [...n[23] ||= [u("x", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								])])) : o("", !0)
							])]),
							c("article", _o, [c("header", vo, [n[26] ||= c("h3", null, "下注限制", -1), c("p", yo, C(I.value.symbol) + " 每个格子生成一笔独立订单", 1)]), c("div", bo, [c("label", null, [c("span", null, [n[27] ||= u("最小下注金额", -1), d(bn, { label: "最小下注金额" })]), d(Dn, {
								"input-component": w(e),
								modelValue: L.value.min_order_amount,
								"onUpdate:modelValue": n[6] ||= (e) => L.value.min_order_amount = e,
								disabled: !Re.value,
								inputmode: "decimal",
								onInput: et
							}, {
								append: E(() => [...n[28] ||= [u("USDT", -1)]]),
								_: 1
							}, 8, [
								"input-component",
								"modelValue",
								"disabled"
							])]), c("label", null, [c("span", null, [n[29] ||= u("最大下注金额", -1), d(bn, { label: "最大下注金额" })]), d(Dn, {
								"input-component": w(e),
								modelValue: L.value.max_order_amount,
								"onUpdate:modelValue": n[7] ||= (e) => L.value.max_order_amount = e,
								disabled: !Re.value,
								inputmode: "decimal",
								onInput: et
							}, {
								append: E(() => [...n[30] ||= [u("USDT", -1)]]),
								_: 1
							}, 8, [
								"input-component",
								"modelValue",
								"disabled"
							])])])]),
							w(D) ? o("", !0) : (v(), a(w(k), {
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
			d(er, {
				modelValue: de.value,
				"onUpdate:modelValue": n[8] ||= (e) => de.value = e
			}, null, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-2768af6f"]]), So = {
	class: "prediction-config prediction-table-page",
	"data-prediction-page": "OWNER_CONFIG"
}, Co = {
	class: "game-tabs",
	"aria-label": "选择预测玩法"
}, wo = {
	class: "game-choice-icon",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	"aria-hidden": "true"
}, To = { class: "game-choice-content" }, Eo = {
	key: 0,
	role: "alert"
}, Do = {
	key: 1,
	role: "alert"
}, Oo = {
	key: 3,
	class: "config-layout"
}, ko = {
	class: "symbol-directory",
	"aria-label": "交易对配置"
}, Ao = {
	key: 0,
	role: "status"
}, jo = {
	key: 1,
	class: "catalog-error",
	role: "alert"
}, Mo = { class: "symbol-list" }, No = [
	"aria-pressed",
	"disabled",
	"onClick"
], Po = ["title"], Fo = { class: "symbol-all-control" }, Io = { key: 2 }, Lo = { class: "config-content" }, Ro = { class: "config-title" }, zo = { class: "config-title-actions" }, Bo = {
	key: 0,
	class: "draft-label"
}, Vo = {
	key: 0,
	role: "alert"
}, Ho = {
	key: 1,
	role: "status"
}, Uo = {
	key: 0,
	class: "config-note"
}, Wo = {
	key: 1,
	class: "config-note",
	role: "alert"
}, Go = {
	key: 2,
	class: "config-note"
}, Ko = {
	key: 3,
	class: "config-note"
}, qo = {
	key: 4,
	class: "config-note"
}, Jo = { class: "parameter-card room-config" }, Yo = { class: "parameter-heading" }, Xo = { class: "field-description" }, Zo = { class: "room-config-body" }, Qo = { class: "parameter-cards" }, $o = {
	class: "parameter-card",
	"data-price-precision": !0
}, es = { class: "room-config-body" }, ts = { class: "field-label" }, ns = {
	key: 0,
	class: "config-note"
}, rs = { class: "parameter-card" }, is = { class: "parameter-heading" }, as = { class: "field-description" }, os = {
	key: 0,
	class: "limit-fields odds-fields"
}, ss = {
	key: 1,
	class: "limit-fields"
}, cs = { class: "parameter-card" }, ls = { class: "parameter-heading" }, us = { class: "field-description" }, ds = { class: "limit-fields" }, fs = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "OwnerConfig",
	props: { actor: {} },
	setup(t, { expose: n }) {
		let l = he().api, { siteDirectorySymbols: f } = l, p = _e(), m = t, h = ge(), g = i(() => bi(m.actor)), _ = i(() => !N.value || N.value.operator_id === m.actor.operator_id && N.value.agent_id === m.actor.agent_id && N.value.config_site_id === m.actor.config_site_id && N.value.kind === m.actor.kind);
		function ne(e) {
			return e.platform_enabled || g.value && (e.enabled || !!e.blocked_reason);
		}
		let re = [
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
		], b = y("UP_DOWN"), x = S([]), ae = y(""), T = y(""), D = y([]), O = y(!1), k = y(!1), j = y(""), M = y(""), N = S(null), P = y(!1), F = y(!1), se = new Di(), L = !0, R = () => L && xi(m.actor) && Qr(h.userInfo.id) === m.actor.operator_id && h.userInfo.can_manage_prediction_config === !0 && (h.perms.includes("*") || h.perms.includes("prediction_config:lists")), ce = i(() => R() && !P.value && !F.value), le = i(() => x.value.find((e) => e.symbol === ae.value)), ue = y("35"), de = y(0), fe = i(() => D.value.filter((e) => e.owner_enabled && (g.value || e.platform_enabled))), z = i(() => fe.value.find((e) => e.duration_seconds === ue.value)), B = i(() => D.value.map((e) => ({
			key: e.duration_seconds,
			label: `${e.observation_seconds}秒`,
			present: e.owner_enabled && (g.value || e.platform_enabled),
			allowed: e.platform_enabled
		})));
		function V(e, t) {
			if (!ce.value || k.value || N.value || O.value) return;
			let n = D.value.find((t) => t.duration_seconds === e);
			!n || n.owner_enabled === t || t && !n.platform_enabled || (n.owner_enabled = t, ue.value = t ? e : fe.value[0]?.duration_seconds ?? "");
		}
		function H(e) {
			let t = e.symbol === ae.value ? fe.value.map((e) => e.observation_seconds) : e.rules.filter((e) => e.owner_enabled && (g.value || e.platform_enabled)).map((e) => b.value === "UP_DOWN" ? String(BigInt(e.rule.duration_seconds) - 30n) : e.rule.duration_seconds);
			return t.length ? t.map((e) => `${e}秒`).join(" · ") : "暂无房间";
		}
		let U = y(!0), W = () => JSON.stringify([U.value, D.value.map((e) => [
			e.minimum_stake,
			e.maximum_stake,
			e.owner_enabled,
			e.target_payout_rate,
			e.maximum_odds,
			e.fixed_odds
		])]), G = y(""), me = i(() => W() !== G.value), ve = S(), ye = i(() => k.value || me.value || !!N.value || b.value === "GRID" && !!ve.value?.hasBlockingWork);
		n({ hasBlockingWork: ye });
		let be = y([]), xe = i(() => Ga(x.value.filter(ne), be.value, (e) => e.platform_enabled && e.enabled).filter((e) => e.symbol.includes(T.value.trim().toUpperCase())));
		function Se() {
			try {
				N.value = Ji(localStorage), P.value = ["prediction.agent.pending.v1", "prediction.site.pending.v1"].some((e) => localStorage.getItem(e) !== null), F.value = !1;
			} catch {
				F.value = !0;
			}
		}
		function Ce() {
			de.value++, D.value = le.value ? Ti(le.value, m.actor) : [], U.value = le.value?.enabled ?? !0, fe.value.some((e) => e.duration_seconds === ue.value) || (ue.value = fe.value[0]?.duration_seconds ?? ""), G.value = W();
		}
		function we(e) {
			ye.value || (ae.value = e, M.value = "", Ce());
		}
		function K(e) {
			ye.value || (b.value = e, Oe());
		}
		function Te(e) {
			if (m.actor.kind !== "SITE") return l.ownerConfigurations(e);
			if (!l.scopedSiteConfigurations) throw Error("SITE_UNAVAILABLE");
			return l.scopedSiteConfigurations(m.actor.config_site_id, e);
		}
		function Ee(e, t) {
			if (m.actor.kind !== "SITE") return l.ownerConfiguration(e, t);
			if (!l.scopedSiteConfiguration) throw Error("SITE_UNAVAILABLE");
			return l.scopedSiteConfiguration(m.actor.config_site_id, e, t);
		}
		function De(e) {
			if (m.actor.kind !== "SITE") return l.saveOwnerConfiguration(e);
			if (!l.saveScopedSiteConfiguration) throw Error("SITE_UNAVAILABLE");
			return l.saveScopedSiteConfiguration(m.actor.config_site_id, e);
		}
		async function Oe() {
			let e = b.value, t = se.begin(m.actor, e, "");
			if (x.value = [], ae.value = "", Ce(), j.value = "", O.value = !1, !(!R() || e === "GRID")) {
				O.value = !0;
				try {
					let [n, r] = await Promise.all([Te(e), f()]);
					if (!se.current(t, m.actor, b.value, "") || !R()) return;
					if (!Array.isArray(n.items) || new Set(n.items.map((e) => e.symbol)).size !== n.items.length) throw Error("INVALID_CATALOG");
					for (let t of n.items) if (wi(t, m.actor), t.game_type !== "GAME_TYPE_" + e) throw Error("WRONG_GAME");
					if (!Array.isArray(r) || !r.every((e) => typeof e == "string")) throw Error("INVALID_SYMBOL_DIRECTORY");
					be.value = r, x.value = n.items, ae.value = xe.value[0]?.symbol ?? "", Ce();
				} catch {
					se.current(t, m.actor, b.value, "") && R() && (j.value = "配置加载失败，请重试。");
				} finally {
					se.current(t, m.actor, b.value, "") && (O.value = !1);
				}
			}
		}
		async function ke() {
			if (Se(), !ce.value || k.value) return;
			let e = b.value, t = ae.value;
			try {
				if (!N.value) {
					if (!le.value) return;
					N.value = Xi(localStorage, m.actor, Ei(le.value, m.actor, D.value, "通过玩法配置页面保存配置", li(), U.value));
				}
				let n = N.value;
				if (!_.value) return;
				k.value = !0, M.value = "";
				let r = await na(localStorage, n, (e) => {
					if (!R() || !_.value) throw Error("IDENTITY_CHANGED");
					return De(e);
				}, async (e) => {
					if (!R()) throw Error("IDENTITY_CHANGED");
					let t = await Ee(e.game_type, e.symbol);
					if (wi(t.configuration, m.actor), t.configuration.symbol !== e.symbol || t.configuration.game_type !== "GAME_TYPE_" + e.game_type) throw Error("WRONG_CONFIGURATION");
					return t.configuration;
				});
				if (!R() || b.value !== e || ae.value !== t) return;
				Se(), r.status === "success" ? (M.value = r.refreshFailed ? "保存已成功，配置刷新失败，请重新打开页面查看；无需再次保存。" : "配置已保存并生效。", r.latest && r.latest.symbol === ae.value && r.latest.game_type === "GAME_TYPE_" + b.value ? (x.value = x.value.map((e) => e.symbol === ae.value ? r.latest : e), Ce()) : (x.value = [], ae.value = "", Ce(), j.value = "保存已确认，请重试读取最新配置。")) : (M.value = r.status === "rejected" ? "保存未通过，请重新读取配置后调整。" : "暂未确认保存结果，请稍后使用原请求确认。", r.status === "rejected" && (j.value = "保存被拒绝，请读取最新配置后修改。"));
			} catch (e) {
				M.value = e instanceof Error && e.message === "NO_CHANGES" ? "配置没有变化。" : "无法保存，请检查金额、赔率范围及待确认请求。";
			} finally {
				k.value = !1;
			}
		}
		Se();
		try {
			m.actor.kind === "SITE" && Pa(Ua(sessionStorage, m.actor)) && (b.value = "GRID");
		} catch {
			F.value = !0;
		}
		return Oe(), oe(() => [
			h.userInfo.id,
			h.token,
			h.userInfo.can_manage_prediction_config,
			h.perms.join("|"),
			m.actor.operator_id,
			m.actor.agent_id,
			m.actor.config_site_id,
			m.actor.kind
		], () => {
			se.close(), x.value = [], D.value = [], G.value = "[]", ae.value = "", M.value = "", Se();
		}, { flush: "sync" }), te(() => {
			L = !1, se.close();
		}), (n, i) => (v(), s("section", So, [
			c("nav", Co, [(v(!0), s(r, null, ie(w(re), (e) => (v(), a(w(A), {
				key: e.key,
				type: b.value === e.key ? "primary" : void 0,
				"aria-pressed": b.value === e.key,
				disabled: ye.value,
				onClick: (t) => K(e.key)
			}, {
				default: E(() => [(v(), s("svg", wo, [e.key === "UP_DOWN" ? (v(), s(r, { key: 0 }, [i[8] ||= c("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}, null, -1), i[9] ||= c("path", { d: "m16 12-4-4-4 4M12 16V8" }, null, -1)], 64)) : e.key === "HIGH_LOW" ? (v(), s(r, { key: 1 }, [i[10] ||= c("path", { d: "m9 9 5 12 1.8-5.2L21 14Z" }, null, -1), i[11] ||= c("path", { d: "M7.2 2.2 8 5.1M5.1 8l-2.9-.8M14 4.1 12 6M6 12l-1.9 2" }, null, -1)], 64)) : (v(), s(r, { key: 2 }, [i[12] ||= c("rect", {
					x: "3",
					y: "3",
					width: "18",
					height: "18",
					rx: "2"
				}, null, -1), i[13] ||= c("path", { d: "M9 3v18M15 3v18M3 9h18M3 15h18" }, null, -1)], 64))])), c("span", To, [c("strong", null, C(e.label), 1), c("small", null, C(e.description), 1)])]),
				_: 2
			}, 1032, [
				"type",
				"aria-pressed",
				"disabled",
				"onClick"
			]))), 128))]),
			P.value ? (v(), s("p", Eo, "发现旧配置模式尚未确认的请求，已保留原请求。请联系管理员核对原操作回执后完成迁移，当前暂停新配置保存。")) : o("", !0),
			F.value ? (v(), s("p", Do, "无法读取或保全待确认请求，当前暂停配置保存。")) : o("", !0),
			b.value === "GRID" ? (v(), a(xo, {
				key: 2,
				ref_key: "gridRef",
				ref: ve,
				actor: t.actor,
				class: "grid-mode"
			}, null, 8, ["actor"])) : (v(), s("div", Oo, [c("aside", ko, [
				c("h3", null, [i[14] ||= u("交易对配置 ", -1), c("small", null, C(x.value.filter(ne).length) + " 条", 1)]),
				d(w(e), {
					modelValue: T.value,
					"onUpdate:modelValue": i[0] ||= (e) => T.value = e,
					placeholder: "搜索币种",
					"aria-label": "搜索币种",
					clearable: ""
				}, null, 8, ["modelValue"]),
				O.value ? (v(), s("p", Ao, "正在加载配置…")) : o("", !0),
				j.value ? (v(), s("div", jo, [u(C(j.value) + " ", 1), d(w(A), {
					size: "small",
					disabled: k.value || !!N.value || O.value,
					onClick: Oe
				}, {
					default: E(() => [...i[15] ||= [u("读取最新配置（放弃未保存修改）", -1)]]),
					_: 1
				}, 8, ["disabled"])])) : o("", !0),
				c("div", Mo, [(v(!0), s(r, null, ie(xe.value, (e) => (v(), s("div", {
					key: e.symbol,
					class: ee(["symbol-entry", { selected: e.symbol === ae.value }])
				}, [c("button", {
					class: "symbol-option",
					"aria-pressed": e.symbol === ae.value,
					disabled: ye.value,
					onClick: (t) => we(e.symbol)
				}, [d(w(p), { symbol: e.symbol }, null, 8, ["symbol"]), c("span", {
					class: "symbol-status",
					title: H(e)
				}, C(H(e)), 9, Po)], 8, No), c("div", Fo, [d(w(pe), {
					"aria-label": e.symbol === ae.value ? "币种开关" : `${e.symbol} 币种开关`,
					modelValue: e.symbol === ae.value ? U.value : e.enabled,
					disabled: e.symbol !== ae.value || !ce.value || k.value || !!N.value || (g.value ? !U.value && !e.can_enable : !e.platform_enabled),
					"onUpdate:modelValue": i[1] ||= (e) => U.value = !!e
				}, null, 8, [
					"aria-label",
					"modelValue",
					"disabled"
				])])], 2))), 128))]),
				!O.value && !j.value && !xe.value.length ? (v(), s("p", Io, "当前没有可用的交易对配置。")) : o("", !0)
			]), c("main", Lo, [
				c("header", Ro, [c("div", null, [c("h3", null, C(ae.value || "请选择交易对") + " · " + C(b.value === "UP_DOWN" ? "涨跌预测" : "自选预测"), 1), c("p", null, C(t.actor.kind === "SITE" ? "当前白标生效" : "当前商户生效"), 1)]), c("div", zo, [me.value ? (v(), s("span", Bo, "有未保存修改")) : o("", !0), le.value || N.value ? (v(), a(w(A), {
					key: 1,
					type: "primary",
					loading: k.value,
					disabled: !ce.value || k.value || !N.value && !me.value || !!N.value && !_.value,
					onClick: ke
				}, {
					default: E(() => [u(C(N.value ? "确认原保存结果" : "保存配置"), 1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : o("", !0)])]),
				N.value ? (v(), s("p", Vo, "存在待确认操作（" + C(N.value.body.symbol) + "），请使用原请求确认结果。" + C(_.value ? "" : "该操作属于另一个账号或站点，需切回原范围处理。"), 1)) : o("", !0),
				M.value ? (v(), s("p", Ho, C(M.value), 1)) : o("", !0),
				le.value ? (v(), s(r, { key: 2 }, [
					g.value ? (v(), s("p", Uo, "已保存的开关、限额和赔率保持独立；上级默认值只用于新建配置，当前配置仍受上级启停和限额约束。")) : o("", !0),
					le.value.blocked_reason ? (v(), s("p", Wo, "上级限制已变化，原配置已保留。请调整超出范围的参数后保存；也可以先关闭币种。")) : o("", !0),
					g.value && !le.value.platform_enabled ? (v(), s("p", Go, "上级已关闭此币种或房间；原配置已保留，当前不能交易。")) : o("", !0),
					g.value ? o("", !0) : (v(), s("p", Ko, "可关闭自己的币种或房间，并在平台范围内调整" + C(b.value === "UP_DOWN" ? "限额和目标返奖率，最高赔率使用平台配置" : "限额和赔率") + "。平台修改对应房间后，限额和赔率恢复平台值，您主动关闭的选择会保留。", 1)),
					U.value ? o("", !0) : (v(), s("p", qo, "交易对已关闭；以下房间设置仍会保留。")),
					c("article", Jo, [c("header", Yo, [i[16] ||= c("h4", null, "房间配置", -1), c("p", Xo, C(ae.value) + " · " + C(t.actor.kind === "SITE" ? "当前白标生效" : "当前商户生效"), 1)]), c("div", Zo, [
						i[17] ||= c("span", { class: "field-label" }, "支持周期", -1),
						d(Rn, {
							description: `${ae.value} · ${b.value === "UP_DOWN" ? "涨跌预测" : "自选预测"}`,
							rooms: B.value,
							selected: ue.value,
							disabled: !ce.value || k.value || !!N.value || O.value,
							context: `${t.actor.operator_id}:${t.actor.agent_id}:${t.actor.config_site_id}:${b.value}:${ae.value}:${de.value}`,
							onSelect: i[2] ||= (e) => ue.value = e,
							onChange: V
						}, null, 8, [
							"description",
							"rooms",
							"selected",
							"disabled",
							"context"
						]),
						i[18] ||= c("p", { class: "config-note" }, "变更只影响新订单，历史订单保留原配置快照。", -1)
					])]),
					c("div", Qo, [c("article", $o, [i[20] ||= c("header", { class: "parameter-heading" }, [c("h4", null, "价格精度"), c("p", { class: "field-description" }, "由平台统一设置，此处只读")], -1), c("div", es, [c("p", ts, "价格小数位：" + C(le.value.rules[0]?.rule.price_rule?.price_decimals === void 0 ? "未设置（沿用原规则）" : `${le.value.rules[0].rule.price_rule.price_decimals} 位`), 1), i[19] ||= c("p", { class: "config-note" }, "按所选位数截断，不四舍五入；旧订单保留原规则。", -1)])]), z.value ? (v(), s(r, { key: 0 }, [
						z.value.platform_enabled ? o("", !0) : (v(), s("p", ns, "平台已关闭此房间，暂不能开启。")),
						c("article", rs, [c("header", is, [c("h4", null, "赔率配置 · " + C(z.value.observation_seconds) + " 秒", 1), c("p", as, C(b.value === "UP_DOWN" ? "上涨/下跌赔率按资金池动态计算" : "下单时锁定当前周期固定赔率，上涨和下跌使用相同赔率。"), 1)]), b.value === "UP_DOWN" ? (v(), s("div", os, [d(w(I), { label: `目标返奖率（平台上限 ${w(Cn)(z.value.platform_target_payout_rate, 2)}%，且必须小于 100%）` }, {
							default: E(() => [d(Dn, {
								"input-component": w(e),
								modelValue: z.value.target_payout_rate,
								"onUpdate:modelValue": i[3] ||= (e) => z.value.target_payout_rate = e,
								percentage: "",
								unit: "%",
								max: w(Cn)(z.value.platform_target_payout_rate, 2),
								disabled: !ce.value || k.value || !!N.value,
								"aria-label": `${z.value.observation_seconds}秒目标返奖率`
							}, null, 8, [
								"input-component",
								"modelValue",
								"max",
								"disabled",
								"aria-label"
							])]),
							_: 1
						}, 8, ["label"]), o("", !0)])) : (v(), s("div", ss, [d(w(I), { label: `固定赔率（平台上限 ${z.value.platform_fixed_odds}，且必须小于 2，含本金）` }, {
							default: E(() => [d(Dn, {
								"input-component": w(e),
								modelValue: z.value.fixed_odds,
								"onUpdate:modelValue": i[5] ||= (e) => z.value.fixed_odds = e,
								step: "0.01",
								min: "1.01",
								max: z.value.platform_fixed_odds,
								unit: "x",
								disabled: !ce.value || k.value || !!N.value,
								"aria-label": `${z.value.observation_seconds}秒固定赔率`
							}, null, 8, [
								"input-component",
								"modelValue",
								"max",
								"disabled",
								"aria-label"
							])]),
							_: 1
						}, 8, ["label"])]))]),
						c("article", cs, [c("header", ls, [c("h4", null, "下注限制 · " + C(z.value.observation_seconds) + " 秒", 1), c("p", us, "平台单笔范围：" + C(z.value.platform_minimum) + " ~ " + C(z.value.platform_maximum) + " USDT。变更不影响已受理订单。", 1)]), c("div", ds, [d(w(I), { label: "单笔最小额" }, {
							default: E(() => [d(Dn, {
								"input-component": w(e),
								modelValue: z.value.minimum_stake,
								"onUpdate:modelValue": i[6] ||= (e) => z.value.minimum_stake = e,
								min: z.value.platform_minimum,
								max: z.value.maximum_stake,
								disabled: !ce.value || k.value || !!N.value,
								"aria-label": `${z.value.observation_seconds}秒单笔最小额`
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
						}), d(w(I), { label: "单笔最大额" }, {
							default: E(() => [d(Dn, {
								"input-component": w(e),
								modelValue: z.value.maximum_stake,
								"onUpdate:modelValue": i[7] ||= (e) => z.value.maximum_stake = e,
								min: z.value.minimum_stake,
								max: z.value.platform_maximum,
								disabled: !ce.value || k.value || !!N.value,
								"aria-label": `${z.value.observation_seconds}秒单笔最大额`
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
}), [["__scopeId", "data-v-62b028ac"]]), ps = class {
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
function ms(e) {
	if (typeof e != "string" || !/^[A-Z0-9][A-Z0-9._-]{0,63}$/.test(e)) throw Error("INVALID_SYMBOL_DIRECTORY");
	return e;
}
function hs(e, t) {
	let n = e?.configurations;
	if (!Array.isArray(n)) throw Error("INVALID_SYMBOL_DIRECTORY");
	return [...new Set(n.flatMap((e) => {
		if (!Array.isArray(e?.rules) || !e.rules.length) throw Error("INVALID_SYMBOL_DIRECTORY");
		return e.rules.flatMap((e) => {
			if (e.game_type !== `GAME_TYPE_${t}` || typeof e.enabled_by_default != "boolean") throw Error("INVALID_SYMBOL_DIRECTORY");
			let n = ms(e.symbol);
			return e.enabled_by_default ? [n] : [];
		});
	}))];
}
function gs(e, t, n, r = []) {
	let i = new Set(e.map(ms)), a = new Set(t.map(ms));
	n.forEach(ms);
	let o = [...i].filter((e) => a.has(e)), s = new Set(r.map(ms));
	return Ga([...o].map((e) => ({
		symbol: e,
		allowed: i.has(e),
		publicConfigured: a.has(e)
	})), n, (e) => s.has(e.symbol));
}
//#endregion
//#region src/prediction-config/agent/views/prediction/game-config/site-mutation.ts
var _s = "prediction.site.pending.v1";
function vs(e, t, n = []) {
	Q(t.every((t) => Object.hasOwn(e, t)) && Object.keys(e).every((e) => t.includes(e) || n.includes(e)), "PENDING_CORRUPT");
}
function ys(e) {
	Q(Z(e), "PENDING_CORRUPT"), vs(e, [
		"site_id",
		"game_type",
		"symbol",
		"client_request_id",
		"reason",
		"based_on_public_version",
		"based_on_site_version",
		"enabled",
		"overrides"
	]), Q(X(e.site_id, 128) && ["UP_DOWN", "HIGH_LOW"].includes(String(e.game_type)) && X(e.symbol, 64, !0) && X(e.client_request_id, 128) && X(e.reason, 500), "PENDING_CORRUPT"), Q(J(e.based_on_public_version, !0) && J(e.based_on_site_version, !0) && typeof e.enabled == "boolean" && Array.isArray(e.overrides), "PENDING_CORRUPT");
	let t = e.game_type === "UP_DOWN";
	Q((t ? e.overrides.length === 5 : e.overrides.length > 0 && e.overrides.length <= 100) && new Set(e.overrides.map((e) => e.duration_seconds)).size === e.overrides.length, "PENDING_CORRUPT");
	for (let n of e.overrides) {
		if (Q(Z(n)), !t) {
			vs(n, ["duration_seconds"], [
				"enabled",
				"fixed_odds",
				"minimum_stake",
				"maximum_stake"
			]), Q(J(n.duration_seconds, !0) && (!Object.hasOwn(n, "enabled") || typeof n.enabled == "boolean"), "PENDING_CORRUPT"), hi(n);
			continue;
		}
		vs(n, ["duration_seconds", "stake_tiers"], ["enabled"]), Q(si.includes(String(n.duration_seconds)) && (!Object.hasOwn(n, "enabled") || typeof n.enabled == "boolean") && Array.isArray(n.stake_tiers) && n.stake_tiers.length === 1, "PENDING_CORRUPT");
		let e = n.stake_tiers[0];
		Q(Z(e)), vs(e, ["stake_tier_id"], ["enabled", "maximum_stake"]), Q(X(e.stake_tier_id) && (!Object.hasOwn(e, "enabled") || typeof e.enabled == "boolean"), "PENDING_CORRUPT"), Q(!Object.hasOwn(e, "maximum_stake") || $r(e.maximum_stake) && Y(e.maximum_stake, "1") >= 0, "PENDING_CORRUPT");
	}
}
function bs(e) {
	let t = e.getItem(_s);
	if (t === null) return null;
	Q(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return Q(Z(n)), vs(n, [
		"schema",
		"operator_id",
		"agent_id",
		"body",
		"attempted",
		"attempt"
	]), ui(n), Q(n.schema === "site-v1" && typeof n.attempted == "boolean" && Number.isSafeInteger(n.attempt) && Number(n.attempt) >= 0 && n.attempted === Number(n.attempt) > 0, "PENDING_CORRUPT"), ys(n.body), ci(n);
}
var xs = (e, t) => !!e && e.operator_id === t.operator_id && e.agent_id === t.agent_id && JSON.stringify(e.body) === JSON.stringify(t.body);
function Ss(e, t, n) {
	ui(t), ys(n), Q(bs(e) === null, "PENDING_EXISTS");
	let r = {
		schema: "site-v1",
		...t,
		body: JSON.parse(JSON.stringify(n)),
		attempted: !1,
		attempt: 0
	};
	return e.setItem(_s, JSON.stringify(r)), Q(xs(bs(e), r), "PERSISTENCE_UNAVAILABLE"), ci(r);
}
function Cs(e, t) {
	xs(bs(e), t) && e.removeItem(_s);
}
function ws(e, t) {
	try {
		Q(Z(e) && Z(e.receipt)), pi(e.stored);
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
		].every((e) => typeof i[e] == "string")), Q(X(i.operation_id, 256) && X(i.trace_id, 256) && X(i.target_id, 256) && J(i.created_at_ms) && J(i.completed_at_ms)), Q(i.operator_id === t.operator_id && i.client_request_id === n.client_request_id && i.reason === n.reason && i.source_service === "agent_admin"), Q(i.result === "OPERATION_RESULT_SUCCEEDED" && i.error_code === "" && i.action === "ADMIN_ACTION_SITE_CONFIG_PUBLISH" && i.capability === "prediction.site.config.publish" && i.target_type === "site_config"), !0;
	} catch {
		return !1;
	}
}
var Ts = /* @__PURE__ */ new WeakMap();
function Es(e, t, n) {
	let r = Ts.get(e);
	if (r) return Q(xs(r.pending, t), "PENDING_EXISTS"), r.promise;
	let i = bs(e);
	Q(xs(i, t), "PENDING_CHANGED");
	let a = i.attempted, o = i.attempt + 1;
	Q(Number.isSafeInteger(o), "ATTEMPT_LIMIT"), e.setItem(_s, JSON.stringify({
		...i,
		attempted: !0,
		attempt: o
	}));
	let s = bs(e);
	Q(s?.attempt === o && xs(s, t), "PERSISTENCE_UNAVAILABLE");
	let c = Promise.resolve().then(async () => {
		try {
			let r = await n(t.body);
			return xs(bs(e), t) ? ws(r, t) ? (Cs(e, t), {
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
			let r = bs(e);
			if (!xs(r, t)) return {
				status: "superseded",
				error: n
			};
			let i = Z(n) && n.client_request_id !== void 0 && n.client_request_id !== t.body.client_request_id;
			return !a && r.attempt === o && !i && Vi(n) ? (Cs(e, t), {
				status: "rejected",
				error: n
			}) : {
				status: "unknown",
				error: n
			};
		}
	}).finally(() => {
		Ts.get(e)?.promise === c && Ts.delete(e);
	});
	return Ts.set(e, {
		pending: t,
		promise: c
	}), c;
}
async function Ds(e, t, n, r) {
	let i = await Es(e, t, n);
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
var Os = {
	class: "prediction-config prediction-table-page",
	"data-prediction-page": "GAME_CONFIG"
}, ks = {
	class: "game-tabs",
	"aria-label": "选择预测玩法"
}, As = {
	key: 1,
	role: "alert"
}, js = {
	key: 2,
	class: "config-layout"
}, Ms = ["aria-label"], Ns = {
	key: 0,
	class: "catalog-error",
	role: "alert"
}, Ps = {
	key: 1,
	role: "status"
}, Fs = {
	key: 2,
	class: "catalog-error",
	role: "alert"
}, Is = {
	key: 3,
	role: "status"
}, Ls = { class: "symbol-list" }, Rs = [
	"data-symbol",
	"aria-pressed",
	"disabled",
	"onClick"
], zs = {
	key: 0,
	class: "symbol-status"
}, Bs = {
	key: 1,
	class: "symbol-status"
}, Vs = {
	key: 2,
	class: "symbol-status"
}, Hs = {
	key: 3,
	class: "symbol-status"
}, Us = {
	key: 4,
	class: "symbol-status"
}, Ws = {
	key: 5,
	class: "draft-label"
}, Gs = {
	key: 0,
	class: "symbol-all-control"
}, Ks = { class: "config-content" }, qs = { class: "config-title" }, Js = { class: "config-title-actions" }, Ys = {
	key: 0,
	class: "draft-label",
	"data-dirty": "true"
}, Xs = {
	key: 0,
	role: "status"
}, Zs = {
	key: 1,
	role: "alert"
}, Qs = {
	key: 2,
	role: "alert"
}, $s = { key: 3 }, ec = { key: 1 }, tc = { key: 0 }, nc = { key: 1 }, rc = { key: 1 }, ic = {
	key: 7,
	role: "status"
}, ac = { key: 0 }, oc = { key: 1 }, sc = { key: 2 }, cc = ["aria-label"], lc = [
	"data-room",
	"aria-pressed",
	"onClick"
], uc = { class: "room-heading" }, dc = { class: "room-switch" }, fc = { key: 0 }, pc = { class: "parameter-cards" }, mc = {
	key: 0,
	class: "parameter-card"
}, hc = { class: "parameter-facts" }, gc = { class: "read-only-label" }, _c = {
	key: 1,
	class: "parameter-card"
}, vc = { class: "parameter-facts" }, yc = { "data-field": "fixed_odds" }, bc = { class: "read-only-label" }, xc = { class: "parameter-card" }, Sc = { class: "limit-fields" }, Cc = { key: 0 }, wc = { key: 1 }, Tc = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "SiteConfig",
	setup(e) {
		let { siteDirectorySymbols: t, configurations: n, siteConfigurationTargets: l, siteConfiguration: f, saveSiteConfiguration: p, saveConfiguration: m, configuration: h } = he().api, g = _e(), { t: _, te: ne, locale: re } = ye(), b = ge(), x = new ps(), ae = new ps(), T = new ps(), D = new ps(), O = new vi(), j = y("UP_DOWN"), N = S(), P = i(() => j.value === "HIGH_LOW" ? "HIGH_LOW" : "UP_DOWN"), F = i(() => re.value === "en-US" ? H : U), se = (e) => b.perms.includes("*") || b.perms.includes(e), I = i(() => se("prediction_config:lists")), L = I, le = i(() => Qr(b.userInfo.id)), de = y(null), z = y([]), B = y(""), V = y(""), W = y(""), G = i(() => z.value.find((e) => e.site_id === B.value)?.games.find((e) => e.game_type === P.value)?.symbols ?? []), me = y([]), ve = y([]), be = y(""), xe = i(() => gs(G.value, ve.value, me.value, Object.keys(Ce.value).filter((e) => dt(e) && (ut(e) ?? 0) > 0))), Se = i(() => xe.value.map((e) => e.symbol).filter((e) => e.toLowerCase().includes(W.value.toLowerCase()))), Ce = y({}), we = y({}), K = y(null), Te = y([]), Ee = y(!1), De = y("35"), Oe = y("通过商户玩法配置页面保存配置"), ke = y(""), Ae = y(!1), je = y(!1), Me = y(""), Ne = y(!1), Pe = y(!1), Fe = y(""), Ie = y(""), Le = y(!1), Re = y(!1), ze = S(null), Be = S(null), Ve = S(null), He, Ue, We = 0, Ge = i(() => re.value === "en-US" ? "Enabled" : "启用交易对"), Ke = i(() => ze.value && de.value && ze.value.operator_id === de.value.operator_id && ze.value.agent_id === de.value.agent_id && ze.value.body.site_id === B.value && ze.value.body.game_type === P.value && ze.value.body.symbol === V.value ? ze.value : null), qe = y(null), Je = i(() => Be.value && qe.value && Be.value.operator_id === le.value && Be.value.operator_id === qe.value.operator_id && Be.value.agent_id === qe.value.agent_id), Ye = i(() => I.value && L.value && de.value?.operator_id === le.value && !!K.value && (P.value === "UP_DOWN" ? Te.value.length === 5 : Te.value.length > 0) && !Fe.value && !ze.value && !Be.value && !Re.value && !Pe.value && !Ne.value), Xe = i(() => Te.value.find((e) => e.duration_seconds === De.value)), Ze = i(() => K.value?.effective.rules.find((e) => e.duration_seconds === De.value)), Qe = () => JSON.stringify({
			enabled: Ee.value,
			rows: Te.value.map((e) => ({
				duration: e.duration_seconds,
				enabled: e.enabled,
				maximum: e.maximum_stake,
				minimum: e.minimum_stake,
				odds: e.fixed_odds
			})),
			reason: Oe.value
		}), $e = i(() => !!K.value && !!ke.value && Qe() !== ke.value);
		function et() {
			return de.value ? {
				...de.value,
				site_id: B.value,
				game_type: P.value,
				symbol: V.value,
				public_version: K.value?.effective.public_version ?? "",
				site_version: K.value?.stored.version ?? ""
			} : null;
		}
		function tt() {
			Re.value = !1;
			try {
				ze.value = bs(sessionStorage);
			} catch {
				Re.value = !0;
			}
			try {
				Be.value = Li(sessionStorage);
			} catch {
				Re.value = !0;
			}
		}
		function nt() {
			O.close(), Ie.value = "", Ve.value = null, He?.abort(), Pe.value = !1;
		}
		function rt() {
			nt(), D.close(), K.value = null, Te.value = [], ke.value = "", Oe.value = "通过商户玩法配置页面保存配置", Fe.value = "", Le.value = !1, Ne.value = !1, tt();
		}
		function it(e) {
			mi(e, B.value, V.value, P.value), K.value = e, Te.value = gi(e), Ee.value = e.stored.enabled, Ce.value[V.value] = e, we.value[V.value] = "configured", Oe.value = "通过商户玩法配置页面保存配置", ke.value = Qe(), tt();
		}
		function at(e) {
			let t = e?.error_code;
			return t === "NOT_FOUND" ? "该交易对尚未配置，请联系管理员完成初始配置。" : t === "UNAVAILABLE" ? "站点配置暂不可用，请稍后刷新。" : t === "PERMISSION_DENIED" ? "当前账号无权访问该站点配置。" : _("predictionPages.loadFailed");
		}
		async function ot() {
			rt(), T.close(), Ue = void 0, je.value = !1;
			let e = ae.next(), t = le.value, n = b.token;
			if (de.value = null, qe.value = null, x.close(), st(), z.value = [], me.value = [], ve.value = [], be.value = "", B.value = "", V.value = "", Ce.value = {}, we.value = {}, Me.value = "", Ae.value = !1, !(!I.value || !t)) {
				Ae.value = !0;
				try {
					let r = await l(e.signal);
					if (!e.current() || le.value !== t || b.token !== n) return;
					if (di(r), r.actor.operator_id !== t) throw Error("IDENTITY_UNCONFIRMED");
					de.value = r.actor, z.value = r.sites, ze.value?.operator_id === t && ze.value.agent_id === r.actor.agent_id && (j.value = ze.value.body.game_type);
					let i = ze.value?.operator_id === t ? r.sites.find((e) => e.site_id === ze.value?.body.site_id)?.site_id : void 0;
					(i || r.sites.length === 1) && (B.value = i ?? r.sites[0].site_id);
				} catch (t) {
					e.current() && (Me.value = at(t));
				} finally {
					e.current() && (Ae.value = !1);
				}
			}
		}
		async function st() {
			let e = x.next(), t = Be.value, n = le.value, r = b.token;
			if (!(!t || t.operator_id !== n || !I.value)) try {
				let i = await h(t.body.symbol, e.signal);
				if (!e.current() || le.value !== n || b.token !== r) return;
				Ni(i.configuration) === t.body.symbol && i.configuration.agent_id === t.agent_id && (qe.value = {
					operator_id: t.operator_id,
					agent_id: t.agent_id
				});
			} catch {}
		}
		async function ct() {
			rt();
			let e = T.next(), r = B.value, i = JSON.stringify(de.value), a = b.token, o = P.value, s = [...G.value];
			if (Ue = void 0, Ce.value = {}, we.value = {}, me.value = [], ve.value = [], be.value = "", je.value = !1, j.value === "GRID" || !de.value || !r || !I.value) return;
			let c = () => e.current() && j.value !== "GRID" && I.value && b.token === a && B.value === r && P.value === o && i === JSON.stringify(de.value), l = /* @__PURE__ */ new Map(), u = {
				current: c,
				requests: l,
				read(t) {
					let n = l.get(t);
					return n || (n = f({
						site_id: r,
						game_type: o,
						symbol: t
					}, e.signal).then((e) => (mi(e, r, t, o), e)), l.set(t, n)), n;
				}
			};
			Ue = u;
			for (let e of s) we.value[e] = "loading";
			let d = ze.value?.body.game_type === o && ze.value.body.site_id === r ? ze.value.body.symbol : V.value, p = s.includes(d) ? d : s[0] ?? "", m = ze.value?.body.game_type === o && ze.value.body.site_id === r && s.includes(ze.value.body.symbol);
			V.value = m ? p : "", m && lt(!0), je.value = !0;
			let h = Promise.allSettled([t(e.signal).then((e) => {
				gs([], [], e), c() && (me.value = e);
			}), n(e.signal, o).then((e) => {
				let t = hs(e, o);
				if (c() && (ve.value = t, !m)) {
					let e = s.filter((e) => t.includes(e)), n = e.includes(p) ? p : e[0] ?? "";
					V.value === n ? lt(!0) : V.value = n;
				}
			})]).then((e) => {
				c() && e.some((e) => e.status === "rejected") && (be.value = "平台币种目录未完整加载，请重试。");
			}), g = s.filter((e) => e !== p);
			await Promise.all([h, ...Array.from({ length: Math.min(3, g.length) }, async () => {
				for (; c() && g.length;) {
					let e = g.shift();
					if (we.value[e] !== "loading") continue;
					let t = u.read(e);
					try {
						let n = await t;
						if (!c() || l.get(e) !== t) continue;
						Ce.value[e] = n, we.value[e] = "configured";
					} catch (n) {
						if (!c() || l.get(e) !== t) continue;
						we.value[e] = n?.error_code === "NOT_FOUND" ? "unconfigured" : "unavailable", l.delete(e);
					}
				}
			})]), c() && (je.value = !1);
		}
		async function lt(e = !1) {
			rt();
			let t = D.next(), n = {
				site_id: B.value,
				game_type: P.value,
				symbol: V.value
			}, r = JSON.stringify(de.value), i = Ue;
			if (De.value = "35", j.value === "GRID" || !I.value || !de.value || !n.site_id || !G.value.includes(n.symbol)) return;
			Ne.value = !0, e || i?.requests.delete(n.symbol);
			let a = e && i?.current() ? i.read(n.symbol) : f(n, t.signal);
			try {
				let e = await a;
				if (i?.current() && i.requests.get(n.symbol) === a && (Ce.value[n.symbol] = e, we.value[n.symbol] = "configured"), !t.current() || r !== JSON.stringify(de.value) || n.site_id !== B.value || n.game_type !== P.value || n.symbol !== V.value) return;
				it(e), De.value = Te.value[0]?.duration_seconds ?? "";
			} catch (e) {
				if (i?.current() && i.requests.get(n.symbol) === a && (we.value[n.symbol] = e?.error_code === "NOT_FOUND" ? "unconfigured" : "unavailable", i.requests.delete(n.symbol)), !t.current()) return;
				Le.value = e?.error_code === "NOT_FOUND", we.value[n.symbol] = Le.value ? "unconfigured" : "unavailable", Fe.value = at(e);
			} finally {
				t.current() && i?.requests.get(n.symbol) === a && i.requests.delete(n.symbol), t.current() && (Ne.value = !1);
			}
		}
		function ut(e) {
			let t = e === V.value ? K.value : Ce.value[e];
			return t ? e === V.value && (P.value === "UP_DOWN" ? Te.value.length === 5 : Te.value.length > 0) ? Ee.value ? Te.value.filter((e) => e.enabled).length : 0 : t.effective.rules.filter((e) => e.enabled && (P.value === "HIGH_LOW" || e.stake_tiers.some((e) => !e.retired && e.enabled))).length : null;
		}
		function dt(e) {
			return e === V.value && K.value ? Ee.value : Ce.value[e]?.stored.enabled ?? !1;
		}
		function ft(e) {
			return !Ye.value || we.value[e] !== "configured" || e !== V.value && $e.value;
		}
		function pt(e) {
			if (G.value.includes(e)) {
				if (e !== V.value && ($e.value || Pe.value || ze.value)) {
					ce.warning("请先处理当前未保存修改或待确认操作");
					return;
				}
				V.value = e;
			}
		}
		async function mt(e, t) {
			if (typeof t != "boolean" || ft(e)) return;
			let n = JSON.stringify(de.value), r = B.value;
			e !== V.value && (V.value = e);
			let i = We;
			if (Ne.value) {
				let t = Ue?.requests.get(e);
				if (t) try {
					await t;
				} catch {
					return;
				}
			}
			i !== We || n !== JSON.stringify(de.value) || r !== B.value || V.value !== e || !Ye.value || (nt(), Ee.value = t);
		}
		function ht() {
			de.value && B.value && V.value ? lt() : ot();
		}
		async function gt(e) {
			if (j.value !== e && !(j.value === "GRID" && N.value && !await N.value.confirmLeave())) {
				if (j.value !== "GRID" && ($e.value || ze.value || Be.value)) {
					ce.warning("请先处理当前未保存修改或待确认操作");
					return;
				}
				j.value = e, W.value = "", rt(), V.value = "", ct();
			}
		}
		async function _t() {
			let e = et();
			if (!Ye.value || !K.value || !de.value || !e) return;
			let t;
			try {
				t = _i(K.value, Te.value, Ee.value, Oe.value, li());
			} catch {
				Ie.value = _("predictionPages.invalidSave");
				return;
			}
			if (!O.next(e).current(et()) || !I.value || !L.value) return;
			let n;
			try {
				n = Ss(sessionStorage, de.value, t), tt();
			} catch {
				Re.value = !0;
				return;
			}
			await yt(n);
		}
		function vt() {
			tt(), Ke.value && I.value && L.value && !Pe.value && !Re.value && yt(Ke.value);
		}
		async function yt(e) {
			let t = et();
			if (!t) return;
			let n = O.next(t), r = new AbortController();
			He = r;
			let i = () => n.current(et()) && I.value && L.value;
			Pe.value = !0, Ie.value = "", Ve.value = null;
			try {
				let t = await Ds(sessionStorage, e, (e) => p(e, r.signal), async (e) => {
					let t = await f({
						site_id: e.site_id,
						game_type: e.game_type,
						symbol: e.symbol
					}, r.signal);
					return mi(t, e.site_id, e.symbol, e.game_type), t;
				});
				if (!i()) return;
				tt(), t.status === "success" ? (Ve.value = t.value.receipt, t.latest ? (it(t.latest), Fe.value = "", Ie.value = _("predictionPages.saved")) : (K.value = null, Te.value = [], ke.value = "", Fe.value = "已保存，刷新失败。请刷新查看当前配置。", Ie.value = "已保存，刷新失败")) : t.status !== "superseded" && (Ie.value = _("predictionPages." + (t.status === "unknown" ? "pending" : "rejected")) + " · " + Zr(t.error?.error_code));
			} catch {
				i() && (tt(), Ie.value = _("predictionPages.pending"));
			} finally {
				He === r && (Pe.value = !1);
			}
		}
		async function bt() {
			if (tt(), !Be.value || !Je.value || !I.value || !L.value || Pe.value || Re.value) return;
			let e = Be.value, t = b.token, n = We, r = new AbortController(), i = () => n === We && t === b.token && Je.value && I.value && L.value;
			He = r, Pe.value = !0;
			try {
				let t = await Ui(sessionStorage, e, (e) => m(e, r.signal));
				if (!i()) return;
				tt(), Ie.value = t.status === "success" ? "旧版原请求已确认成功。站点设置请单独查看。" : _("predictionPages.pending");
			} catch {
				i() && (tt(), Ie.value = _("predictionPages.pending"));
			} finally {
				He === r && (Pe.value = !1);
			}
		}
		function xt(e) {
			let t = P.value === "UP_DOWN" ? BigInt(e.observation_seconds) : BigInt(e.duration_seconds);
			return P.value === "HIGH_LOW" && t >= 60n && t % 60n == 0n ? `${t / 60n}分钟` : `${t}秒`;
		}
		function St(e) {
			let t = e === V.value ? K.value : Ce.value[e];
			return t ? gi(t).map(xt).join(" · ") : "";
		}
		function Ct(e) {
			return typeof e == "string" || typeof e == "boolean" ? Zr(e) : _("predictionPages.notProvided");
		}
		function wt(e, t) {
			let n = Ct(t);
			if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return n;
			if (e !== "target_payout_rate") return n + "x";
			let [r, i = ""] = n.split("."), a = r + i, o = r.length + 2;
			return (o >= a.length ? a + "0".repeat(o - a.length) : a.slice(0, o) + "." + a.slice(o)).replace(/^0+(?=\d)/, "") + "%";
		}
		let Tt = (e) => ne("predictionPages.fields." + e) ? _("predictionPages.fields." + e) : e;
		return oe(B, () => {
			We++, V.value = "", ct();
		}, { flush: "sync" }), oe(V, () => {
			We++, lt(!0);
		}, { flush: "sync" }), oe(() => [
			b.userInfo.id,
			b.token,
			I.value,
			L.value
		], () => {
			We++, nt(), ae.close(), T.close(), D.close(), x.close(), ot();
		}, {
			immediate: !0,
			flush: "sync"
		}), te(() => {
			We++, nt(), ae.close(), T.close(), D.close(), x.close();
		}), (e, t) => (v(), a(w(M), { locale: F.value }, {
			default: E(() => [c("section", Os, [c("nav", ks, [
				d(w(A), {
					type: j.value === "UP_DOWN" ? "primary" : void 0,
					"aria-pressed": j.value === "UP_DOWN",
					onClick: t[0] ||= (e) => gt("UP_DOWN")
				}, {
					default: E(() => [...t[8] ||= [u("涨跌预测", -1), c("small", null, "按系统场次预测结算价格相对开盘价格上涨或下跌", -1)]]),
					_: 1
				}, 8, ["type", "aria-pressed"]),
				d(w(A), {
					type: j.value === "HIGH_LOW" ? "primary" : void 0,
					"aria-pressed": j.value === "HIGH_LOW",
					onClick: t[1] ||= (e) => gt("HIGH_LOW")
				}, {
					default: E(() => [...t[9] ||= [u("自选预测", -1), c("small", null, "用户自主选择方向和预测周期，生成独立预测订单", -1)]]),
					_: 1
				}, 8, ["type", "aria-pressed"]),
				d(w(A), {
					type: j.value === "GRID" ? "primary" : void 0,
					"aria-pressed": j.value === "GRID",
					onClick: t[2] ||= (e) => gt("GRID")
				}, {
					default: E(() => [...t[10] ||= [u("预测网格", -1), c("small", null, "按时间格与价格区间展示网格预测规则", -1)]]),
					_: 1
				}, 8, ["type", "aria-pressed"])
			]), j.value === "GRID" ? (v(), a(xo, {
				key: 1,
				ref_key: "gridRef",
				ref: N
			}, null, 512)) : (v(), s(r, { key: 0 }, [z.value.length > 1 ? (v(), a(w(fe), {
				key: 0,
				modelValue: B.value,
				"onUpdate:modelValue": t[3] ||= (e) => B.value = e,
				placeholder: "请选择配置站点",
				"aria-label": "配置站点",
				disabled: Pe.value || $e.value || !!ze.value || !!Be.value
			}, {
				default: E(() => [(v(!0), s(r, null, ie(z.value, (e, t) => (v(), a(w(ue), {
					key: e.site_id,
					label: `站点配置 ${t + 1}`,
					value: e.site_id
				}, null, 8, ["label", "value"]))), 128))]),
				_: 1
			}, 8, ["modelValue", "disabled"])) : o("", !0), I.value ? (v(), s("div", js, [c("aside", {
				class: "symbol-directory",
				"aria-label": w(_)("predictionPages.symbolDirectory")
			}, [
				c("h3", null, [t[11] ||= u("交易对配置 ", -1), c("small", null, C(xe.value.length) + " 条", 1)]),
				d(w(R), {
					modelValue: W.value,
					"onUpdate:modelValue": t[4] ||= (e) => W.value = e,
					clearable: "",
					"aria-label": w(_)("predictionPages.searchSymbol"),
					placeholder: w(_)("predictionPages.searchSymbol")
				}, null, 8, [
					"modelValue",
					"aria-label",
					"placeholder"
				]),
				be.value ? (v(), s("p", Ns, [u(C(be.value), 1), d(w(A), {
					size: "small",
					disabled: $e.value || Pe.value || !!ze.value || je.value,
					onClick: ct
				}, {
					default: E(() => [...t[12] ||= [u("重试币种目录", -1)]]),
					_: 1
				}, 8, ["disabled"])])) : o("", !0),
				Ae.value || je.value ? (v(), s("p", Ps, C(w(_)("predictionPages.loading")), 1)) : o("", !0),
				Me.value ? (v(), s("div", Fs, [c("p", null, C(Me.value), 1), d(w(A), {
					"data-action": "retry-catalog",
					size: "small",
					disabled: Ae.value,
					onClick: ot
				}, {
					default: E(() => [u(C(w(_)("predictionPages.retry")), 1)]),
					_: 1
				}, 8, ["disabled"])])) : o("", !0),
				!Ae.value && !Me.value && !Se.value.length ? (v(), s("p", Is, C(z.value.length ? B.value ? G.value.length ? "没有匹配的交易对。" : "当前站点尚未开放此玩法的交易对配置。" : "请选择配置站点。" : "当前账号暂无预测配置站点授权，请联系管理员配置后刷新。"), 1)) : o("", !0),
				c("div", Ls, [(v(!0), s(r, null, ie(Se.value, (e) => (v(), s("div", {
					key: e,
					class: ee(["symbol-entry", { selected: e === V.value }])
				}, [c("button", {
					type: "button",
					class: "symbol-option",
					"data-symbol": e,
					"aria-pressed": e === V.value,
					disabled: !G.value.includes(e),
					onClick: (t) => pt(e)
				}, [
					d(w(g), { symbol: e }, null, 8, ["symbol"]),
					G.value.includes(e) ? we.value[e] === "loading" ? (v(), s("span", Bs, C(w(_)("predictionPages.loading")), 1)) : we.value[e] === "unconfigured" ? (v(), s("span", Vs, C(w(_)("predictionPages.unconfigured")), 1)) : ut(e) === null ? (v(), s("span", Hs, C(w(_)("predictionPages.unavailableConfig")), 1)) : (v(), s("span", Us, C(St(e)), 1)) : (v(), s("span", zs, C(ve.value.includes(e) ? "未开放配置" : "未配置"), 1)),
					e === V.value && $e.value ? (v(), s("span", Ws, C(w(_)("predictionPages.unsaved")), 1)) : o("", !0)
				], 8, Rs), we.value[e] === "configured" ? (v(), s("div", Gs, [d(w(pe), {
					"inline-prompt": "",
					"active-text": "开放",
					"inactive-text": "停用",
					"data-symbol-enabled": e,
					"aria-label": `${e} ${Ge.value}`,
					"model-value": dt(e),
					disabled: ft(e),
					onChange: (t) => mt(e, t)
				}, null, 8, [
					"data-symbol-enabled",
					"aria-label",
					"model-value",
					"disabled",
					"onChange"
				])])) : o("", !0)], 2))), 128))])
			], 8, Ms), c("main", Ks, [
				c("header", qs, [c("div", null, [c("h3", null, C(V.value || w(_)("predictionPages.selectSymbol")) + " · " + C(w(_)("predictionPages.games." + P.value)), 1), t[13] ||= c("p", null, "当前商户生效", -1)]), c("div", Js, [$e.value ? (v(), s("span", Ys, C(w(_)("predictionPages.unsaved")), 1)) : o("", !0), w(L) ? (v(), a(w(A), {
					key: 1,
					"data-action": "save",
					type: "primary",
					loading: Pe.value,
					disabled: !Ye.value,
					onClick: _t
				}, {
					default: E(() => [...t[14] ||= [u("保存配置", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])) : o("", !0)])]),
				Ne.value ? (v(), s("p", Xs, C(w(_)("predictionPages.loading")), 1)) : o("", !0),
				Fe.value ? (v(), s("p", Zs, [u(C(Fe.value), 1), I.value ? (v(), a(w(A), {
					key: 0,
					disabled: Ne.value || Ae.value || Pe.value || $e.value || !!ze.value || !!Be.value,
					onClick: ht
				}, {
					default: E(() => [...t[15] ||= [u("重试", -1)]]),
					_: 1
				}, 8, ["disabled"])) : o("", !0)])) : o("", !0),
				le.value ? o("", !0) : (v(), s("p", Qs, C(w(_)("predictionPages.identityError")), 1)),
				Le.value ? (v(), s("p", $s, "该交易对尚未配置，请联系管理员完成初始配置后刷新。")) : o("", !0),
				Be.value ? (v(), a(w(k), {
					key: 4,
					type: "warning",
					closable: !1,
					title: "存在旧版代理配置待确认请求"
				}, {
					default: E(() => [
						t[17] ||= c("p", null, "旧请求按原协议恢复，不会转换为站点保存。", -1),
						c("p", null, C(Be.value.body.symbol) + " · " + C(Be.value.body.client_request_id), 1),
						Je.value ? (v(), a(w(A), {
							key: 0,
							disabled: Pe.value || !w(L) || Re.value,
							onClick: bt
						}, {
							default: E(() => [...t[16] ||= [u("确认旧版原请求", -1)]]),
							_: 1
						}, 8, ["disabled"])) : (v(), s("p", ec, "请使用原操作账号恢复该请求。"))
					]),
					_: 1
				})) : o("", !0),
				Re.value ? (v(), a(w(k), {
					key: 5,
					type: "error",
					closable: !1,
					title: w(_)("predictionPages.storageError")
				}, null, 8, ["title"])) : ze.value ? (v(), a(w(k), {
					key: 6,
					type: "warning",
					closable: !1,
					title: w(_)("predictionPages.pending")
				}, {
					default: E(() => [Ke.value ? (v(), s(r, { key: 0 }, [
						c("p", null, [u(C(w(_)("predictionPages.fields.client_request_id")) + ": ", 1), c("code", null, C(Ke.value.body.client_request_id), 1)]),
						c("p", null, C(Ke.value.body.symbol) + " · 站点 " + C(Ke.value.body.site_id) + " · 公共版本 " + C(Ke.value.body.based_on_public_version) + " / 站点版本 " + C(Ke.value.body.based_on_site_version), 1),
						c("ul", null, [(v(!0), s(r, null, ie(Ke.value.body.overrides, (e) => (v(), s("li", { key: e.duration_seconds }, [
							u(C(e.duration_seconds) + "s · " + C(e.enabled === void 0 ? "继承原设置" : e.enabled ? w(_)("predictionPages.on") : w(_)("predictionPages.off")) + " · " + C(e.maximum_stake ?? e.stake_tiers?.[0]?.maximum_stake ?? "继承平台设置"), 1),
							e.fixed_odds === void 0 ? o("", !0) : (v(), s("span", tc, " · 固定赔率 " + C(e.fixed_odds) + "x", 1)),
							e.minimum_stake === void 0 ? o("", !0) : (v(), s("span", nc, " · 最小下注金额 " + C(e.minimum_stake) + " USDT", 1))
						]))), 128))]),
						w(L) ? (v(), a(w(A), {
							key: 0,
							disabled: Pe.value,
							"data-action": "replay",
							onClick: vt
						}, {
							default: E(() => [u(C(w(_)("predictionPages.confirmOriginal")), 1)]),
							_: 1
						}, 8, ["disabled"])) : o("", !0)
					], 64)) : (v(), s("p", rc, C(w(_)("predictionPages.otherPending")), 1))]),
					_: 1
				}, 8, ["title"])) : o("", !0),
				Ie.value ? (v(), s("p", ic, C(Ie.value), 1)) : o("", !0),
				K.value ? (v(), s(r, { key: 8 }, [
					Ee.value ? o("", !0) : (v(), s("p", ac, "交易对已关闭；以下房间设置仍会保留。")),
					K.value.adjustments.length ? (v(), s("p", oc, "部分保存值受当前公共配置调整，编辑框保留原设置；实际生效金额见下方。")) : o("", !0),
					w(L) ? o("", !0) : (v(), s("p", sc, C(w(_)("predictionPages.readOnlyConfig")), 1)),
					c("nav", {
						class: "room-tabs",
						"aria-label": P.value === "UP_DOWN" ? w(_)("predictionPages.observationRoom") : "支持周期"
					}, [(v(!0), s(r, null, ie(Te.value, (e) => (v(), s("button", {
						key: e.duration_seconds,
						type: "button",
						"data-room": e.duration_seconds,
						"aria-pressed": De.value === e.duration_seconds,
						class: ee({ active: De.value === e.duration_seconds }),
						onClick: (t) => De.value = e.duration_seconds
					}, C(xt(e)), 11, lc))), 128))], 8, cc),
					Xe.value && Ze.value ? (v(), s(r, { key: 3 }, [
						c("div", uc, [c("div", null, [c("h3", null, C(xt(Xe.value)) + " · " + C(P.value === "UP_DOWN" ? w(_)("predictionPages.observationRoom") : "支持周期"), 1)]), c("label", dc, [u(C(w(_)("predictionPages.roomEnabled")), 1), d(w(pe), {
							modelValue: Xe.value.enabled,
							"onUpdate:modelValue": t[5] ||= (e) => Xe.value.enabled = e,
							"data-field": "enabled",
							"aria-label": w(_)("predictionPages.roomEnabled"),
							disabled: !Ye.value,
							onChange: nt
						}, null, 8, [
							"modelValue",
							"aria-label",
							"disabled"
						])])]),
						Xe.value.inherited_enabled ? (v(), s("p", fc, "房间开关包含继承设置；未修改时保留继承状态。")) : o("", !0),
						c("div", pc, [
							P.value === "UP_DOWN" ? (v(), s("article", mc, [
								c("h4", null, C(w(_)("predictionPages.oddsSettings")), 1),
								t[18] ||= c("p", { class: "field-description" }, "上涨赔率 = 1 + 目标返奖率 × 下跌池 ÷（上涨池＋本次下注）；下跌赔率反向计算。下注期间为预计倍率，封盘后锁定最终倍率。", -1),
								c("dl", hc, [(v(), s(r, null, ie(["target_payout_rate", "maximum_odds"], (e) => c("div", { key: e }, [c("dt", null, [u(C(Tt(e)), 1), d(bn, { label: Tt(e) }, null, 8, ["label"])]), c("dd", null, C(wt(e, Ze.value[e])), 1)])), 64))]),
								c("span", gc, C(w(_)("predictionPages.readOnly")), 1)
							])) : o("", !0),
							P.value === "HIGH_LOW" ? (v(), s("article", _c, [
								c("h4", null, "赔率配置 · " + C(xt(Xe.value)), 1),
								t[20] ||= c("p", { class: "field-description" }, "用户下单时按当前周期固定赔率锁定，订单存储赔率快照；上涨和下跌使用相同赔率。", -1),
								c("dl", vc, [c("div", null, [c("dt", null, [t[19] ||= u("当前生效固定赔率", -1), d(bn, { label: "固定赔率" })]), c("dd", yc, C(wt("fixed_odds", Ze.value.fixed_odds)), 1)])]),
								c("span", bc, C(w(_)("predictionPages.readOnly")), 1)
							])) : o("", !0),
							c("article", xc, [
								c("h4", null, C(w(_)("predictionPages.stakeLimits")) + " · " + C(xt(Xe.value)), 1),
								t[22] ||= c("p", { class: "field-description" }, "不同周期独立保存下注限制，变更不影响已受理订单。", -1),
								c("div", Sc, [P.value === "UP_DOWN" ? (v(), s("dl", Cc, [c("dt", null, [u(C(w(_)("predictionPages.fields.minimum_stake")), 1), d(bn, {
									label: "单笔最小额",
									content: "用户创建一笔预测订单时允许输入的最低下注金额。本版涨跌预测固定为 1 USDT，由平台统一维护。"
								})]), c("dd", null, C(Ct(Ze.value.stake_tiers?.find((e) => e.stake_tier_id === Xe.value?.stake_tier_id)?.minimum_stake)), 1)])) : (v(), s("div", wc, [c("label", null, [u(C(w(_)("predictionPages.fields.minimum_stake")), 1), d(bn, { label: "单笔最小额" })]), d(w(R), {
									modelValue: Xe.value.minimum_stake,
									"onUpdate:modelValue": t[6] ||= (e) => Xe.value.minimum_stake = e,
									"data-field": "minimum_stake",
									"aria-label": w(_)("predictionPages.fields.minimum_stake"),
									disabled: !Ye.value,
									onInput: nt
								}, {
									append: E(() => [...t[21] ||= [u("USDT", -1)]]),
									_: 1
								}, 8, [
									"modelValue",
									"aria-label",
									"disabled"
								])])), c("div", null, [
									c("label", null, [u(C(w(_)("predictionPages.fields.maximum_stake")), 1), d(bn, { label: "单笔最大额" })]),
									d(w(R), {
										modelValue: Xe.value.maximum_stake,
										"onUpdate:modelValue": t[7] ||= (e) => Xe.value.maximum_stake = e,
										"data-field": "maximum_stake",
										"aria-label": w(_)("predictionPages.fields.maximum_stake"),
										disabled: !Ye.value || !Xe.value.editable,
										onInput: nt
									}, null, 8, [
										"modelValue",
										"aria-label",
										"disabled"
									]),
									c("small", null, "当前生效：" + C(Xe.value.effective_maximum) + "；可填写更高限额，最终由平台范围校验。", 1)
								])])
							])
						])
					], 64)) : o("", !0)
				], 64)) : o("", !0)
			])])) : (v(), s("p", As, C(w(_)("predictionPages.noPermission")), 1))], 64))])]),
			_: 1
		}, 8, ["locale"]));
	}
}), [["__scopeId", "data-v-3a0bcf9c"]]), Ec = {
	key: 0,
	role: "alert"
}, Dc = {
	key: 1,
	role: "status"
}, Oc = {
	key: 2,
	role: "alert"
}, kc = {
	key: 5,
	role: "alert"
}, Ac = /* @__PURE__ */ f({
	__name: "index",
	setup(e) {
		let t = he().api, n = ge(), r = S(null), o = y(!1), c = y(""), l = i(() => n.userInfo.can_manage_prediction_config === !0 && (n.perms.includes("*") || n.perms.includes("prediction_config:lists")) && Qr(n.userInfo.id) !== null), f = i(() => `${n.userInfo.id}:${n.token}`), p = 0, m;
		async function h() {
			let e = ++p, i = f.value;
			if (m?.abort(), r.value = null, c.value = "", o.value = !1, !l.value) return;
			m = new AbortController(), o.value = !0;
			let a = () => e === p && i === f.value && l.value;
			try {
				let e = await t.ownerConfigurationModel(m.signal);
				if (!a()) return;
				if (e.actor?.operator_id !== Qr(n.userInfo.id) || ![
					"AGENT_V1",
					"SITE_V1",
					"OWNER_V1",
					"SCOPED_OWNER_V1"
				].includes(e.config_model)) throw Error("INVALID_MODEL");
				if (e.config_model === "SCOPED_OWNER_V1" && e.actor.kind === "SITE") {
					let n = e.actor;
					if (n.agent_id !== "0" || !J(n.tenant_id, !0) || !Array.isArray(n.site_ids) || n.site_ids.length !== 1 || !J(n.site_ids[0], !0)) throw Error("INVALID_SITES");
					let i = Ji(localStorage), o = i?.operator_id === n.operator_id && i.kind === "SITE" ? i.config_site_id : void 0, s = Pa(Ua(sessionStorage, n))?.command.site_id, c = n.site_ids[0];
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
				if (!xi(e.actor) || e.config_model === "SCOPED_OWNER_V1" !== bi(e.actor)) throw Error("INVALID_MODEL");
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
		}), (e, t) => l.value ? o.value ? (v(), s("p", Dc, "正在读取配置…")) : c.value ? (v(), s("div", Oc, [u(C(c.value) + " ", 1), d(w(A), { onClick: t[0] ||= (e) => h() }, {
			default: E(() => [...t[1] ||= [u("重试", -1)]]),
			_: 1
		})])) : r.value?.config_model === "OWNER_V1" || r.value?.config_model === "SCOPED_OWNER_V1" ? (v(), a(fs, {
			key: `${f.value}:${r.value.actor.config_site_id ?? ""}`,
			actor: r.value.actor
		}, null, 8, ["actor"])) : r.value?.config_model === "SITE_V1" ? (v(), a(Tc, { key: f.value })) : (v(), s("p", kc, "当前配置模式尚未接入此页面，请联系管理员确认切换；原有未确认请求保持原样。")) : (v(), s("p", Ec, "当前账号无权管理预测配置。商户端仅代理商主账号可管理；白标账号需有所属站点的玩法配置权限。"));
	}
}), jc = {
	class: "mm-prediction-game-config mm-ui",
	"data-mm-component": "prediction-game-config"
}, Mc = {
	key: 0,
	role: "alert"
}, Nc = /* @__PURE__ */ f({
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
		re(W, {
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
		return (t, i) => (v(), s("section", jc, [r.value ? (v(), a(x(e.adapter.role === "platform" ? Yr : Ac), { key: n.value })) : (v(), s("p", Mc, "无法确认当前操作人身份"))]));
	}
});
//#endregion
export { Nc as MmPredictionGameConfig };

//# sourceMappingURL=prediction-config.js.map