import { n as e, r as t, t as n } from "./Loading-DlKfRjF6.js";
import { Fragment as r, computed as i, createBlock as a, createCommentVNode as o, createElementBlock as s, createElementVNode as c, createSlots as l, createTextVNode as u, createVNode as d, defineComponent as f, inject as p, mergeModels as m, mergeProps as h, nextTick as g, normalizeClass as ee, normalizeStyle as _, onBeforeUnmount as te, onMounted as v, openBlock as y, provide as ne, ref as b, renderList as re, renderSlot as x, resolveDynamicComponent as S, shallowRef as C, toDisplayString as w, toRaw as ie, unref as T, useModel as E, watch as ae, withCtx as D, withKeys as O, withModifiers as k } from "vue";
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
import { ElAlert as oe, ElButton as A, ElCard as j, ElConfigProvider as M, ElDialog as N, ElDrawer as P, ElEmpty as F, ElForm as se, ElFormItem as I, ElIcon as L, ElInput as R, ElMessage as ce, ElMessageBox as le, ElOption as ue, ElPopover as z, ElSelect as de, ElSwitch as fe, ElTag as B, useFormDisabled as V } from "element-plus";
import { QuestionFilled as H } from "@element-plus/icons-vue";
import U from "element-plus/es/locale/lang/en";
import W from "element-plus/es/locale/lang/zh-cn";
//#region src/prediction-config/runtime.ts
var pe = Symbol("MmPredictionGameConfig");
function G() {
	let e = p(pe);
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
var K = /^(?:0|[1-9]\d*)(?:\.\d+)?$/, q = /^[1-9]\d*$/, Te = /^\d+$/, Ee = [
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
		enabled: qe(e),
		rules: (t.game_type === "GAME_TYPE_HIGH_LOW" ? Pe(e) : e.rules.map(Ne)).map((t) => ({
			...t,
			enabled_by_default: Ke(e) || t.enabled_by_default
		}))
	};
}
function Ie(e, t, n) {
	e = Le(e);
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
function J(e, t = e.is_new === !0) {
	e = Le(e);
	let n = [];
	e.symbol || n.push("交易对不能为空"), xe(e.based_on_template_version) || n.push("配置版本无效"), e.rules.length === 0 && n.push("至少保留一个周期"), e.game_type === "UP_DOWN" && [...e.rules.map((e) => e.duration_seconds)].sort().join(",") !== Ee.join(",") && n.push("涨跌配置必须包含5、10、15、30、60秒五个固定房间"), e.game_type === "HIGH_LOW" && [...e.rules.map((e) => e.duration_seconds)].sort().join(",") !== [...De].sort().join(",") && n.push("自选配置必须包含5、10、15、30、60秒五个固定房间"), new Set(e.rules.map((e) => e.price_rule.price_decimals)).size > 1 && n.push("同一币种各周期的价格小数位必须一致");
	let r = /* @__PURE__ */ new Set();
	return e.rules.forEach((i) => {
		let a = `${i.duration_seconds || "--"} 秒周期`;
		q.test(i.duration_seconds) || n.push(`${a}的周期必须是正整数`), r.has(i.duration_seconds) && n.push(`周期 ${i.duration_seconds} 秒重复`), r.add(i.duration_seconds);
		let o = i.price_rule.price_decimals;
		o !== void 0 && (typeof o != "number" || !Number.isInteger(o) || o < 0 || o > 8) && n.push("价格小数位必须是0～8的整数"), Re(i.settlement_display_seconds, `${a}的结算展示时间`, n), Re(i.price_rule.max_age_milliseconds, `${a}的行情最大年龄`, n), Re(i.price_rule.late_arrival_grace_milliseconds, `${a}的行情延迟宽限`, n), Be(i.minimum_stake, a, "最低下注额", n), Be(i.maximum_stake, a, "最高下注额", n);
		let s = i.minimum_stake?.default_value, c = i.maximum_stake?.default_value, l = /^(0|[1-9]\d{0,17})(\.\d{1,18})?$/;
		typeof s != "string" || typeof c != "string" || !l.test(s) || !l.test(c) || Ve(s, "0") <= 0 || Ve(c, "0") <= 0 ? n.push(`${a}的单笔限额必须为正数，整数及小数最多18位`) : Ve(s, c) > 0 && n.push(`${a}的最小额不能大于最大额`), e.game_type === "UP_DOWN" ? (((e, t) => !!e && e.agent_editable === !1 && [
			e.minimum_value,
			e.default_value,
			e.maximum_value
		].every((e) => typeof e == "string" && K.test(e) && Ve(e, t) === 0))(i.bet_open_seconds, "30") || n.push("下注开放固定30秒且不可由代理调整"), (!t && !i.market_id || i.stake_tiers?.filter((e) => !e.retired).length !== 1) && n.push("房间配置不完整，请重新加载"), i.stake_tiers?.filter((e) => !e.retired).forEach((e) => {
			!t && !e.stake_tier_id && n.push("房间标识无效");
		}), [
			i.target_payout_rate,
			i.minimum_odds,
			i.maximum_odds
		].some((e) => e?.agent_editable !== !1) && n.push("返奖率和赔率不能由代理调整"), ze(i.bet_open_seconds, a, "下注开放时间", n), Be(i.target_payout_rate, a, "目标返奖率", n), typeof i.target_payout_rate?.default_value == "string" && K.test(i.target_payout_rate.default_value) && Ve(i.target_payout_rate.default_value, "1") >= 0 && n.push(`${a}的目标返奖率必须小于 100%`), Be(i.minimum_odds, a, "最低赔率", n), Be(i.maximum_odds, a, "最高赔率", n), i.stake_tiers?.length || n.push(`${a}的房间配置不完整`), i.stake_tiers?.forEach((e, t) => {
			let r = `${a}历史设置 ${t + 1}`;
			Be(e.minimum_stake, r, "最低下注额", n), Be(e.maximum_stake, r, "最高下注额", n);
		})) : (Be(i.fixed_odds, a, "固定赔率", n), typeof i.fixed_odds?.default_value == "string" && K.test(i.fixed_odds.default_value) && Ve(i.fixed_odds.default_value, "2") >= 0 && n.push(`${a}的固定赔率必须小于 2`));
	}), [...new Set(n)];
}
function Y(e, t, n) {
	if (e.length <= 3) return e.join("；");
	let r = (e) => t === "UP_DOWN" ? String(Number(e) - 30) : e, i = `${n} 秒周期`, a = e.filter((e) => e.startsWith(i)), o = [...new Set(e.flatMap((e) => {
		let t = /^(\d+) 秒周期/.exec(e);
		return t && t[1] !== n ? [t[1]] : [];
	}))], s = [...e.filter((e) => !/^\d+ 秒周期/.test(e)).slice(0, 1), ...a.slice(0, 2)];
	return a.length > 2 && s.push(`${r(n)} 秒周期还有 ${a.length - 2} 项需检查`), o.length && s.push(`请补全 ${o.map(r).join("、")} 秒周期参数`), s.join("；").slice(0, 180);
}
function Le(e) {
	if (!e.is_new) return e;
	let t = structuredClone(e);
	for (let e of t.rules) {
		for (let t of [e.target_payout_rate, e.maximum_odds]) t && (t.minimum_value = t.maximum_value = t.default_value);
		e.fixed_odds && (e.fixed_odds.minimum_value = "1.000000000000000001", e.fixed_odds.maximum_value = e.fixed_odds.default_value);
		for (let t of e.stake_tiers ?? []) t.minimum_stake = structuredClone(e.minimum_stake), t.maximum_stake = structuredClone(e.maximum_stake);
	}
	return t;
}
function Re(e, t, n) {
	xe(e) || n.push(`${t}必须是非负整数`);
}
function ze(e, t, n, r) {
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
	(Ve(e.minimum_value, e.default_value) > 0 || Ve(e.default_value, e.maximum_value) > 0) && r.push(`${t}的${n}默认值必须处于上下限之间`);
}
function Be(e, t, n, r) {
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
	(Ve(e.minimum_value, e.default_value) > 0 || Ve(e.default_value, e.maximum_value) > 0) && r.push(`${t}的${n}默认值必须处于上下限之间`);
}
function Ve(e, t) {
	let [n, r = ""] = e.split("."), [i, a = ""] = t.split("."), o = n.replace(/^0+(?=\d)/, ""), s = i.replace(/^0+(?=\d)/, "");
	if (o.length !== s.length) return o.length > s.length ? 1 : -1;
	if (o !== s) return o > s ? 1 : -1;
	let c = Math.max(r.length, a.length), l = r.padEnd(c, "0"), u = a.padEnd(c, "0");
	return l === u ? 0 : l > u ? 1 : -1;
}
function He(e, t) {
	if (!K.test(e)) return e;
	let [n, r = ""] = e.split("."), i = n + r, a = n.length + t;
	return (a <= 0 ? "0." + "0".repeat(-a) + i : a >= i.length ? i + "0".repeat(a - i.length) : i.slice(0, a) + "." + i.slice(a)).replace(/^0+(?=\d)/, "");
}
var Ue = (e) => He(e, 2), We = (e) => He(e, -2);
function Ge(e, t, n) {
	e[t].default_value = n;
	for (let t of ["minimum_stake", "maximum_stake"]) e[t].minimum_value = e.minimum_stake.default_value, e[t].maximum_value = e.maximum_stake.default_value;
}
var Ke = (e) => e.symbol_enabled === void 0 && !e.rules.some((e) => e.enabled_by_default), qe = (e) => e.symbol_enabled ?? e.rules.some((e) => e.enabled), Je = (e) => e.rules.filter((t) => Ke(e) || t.enabled_by_default).map((e) => e.duration_seconds);
//#endregion
//#region src/prediction-config/platform/views/grid/config/directory.ts
function Ye(e, t) {
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
	return Xe([...n.values()], t);
}
function Xe(e, t, n = (e) => !!e.enabled) {
	let r = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.trim().toUpperCase();
		r.has(t) || r.set(t, r.size);
	}
	return [...e].sort((e, t) => Number(n(t)) - Number(n(e)) || (r.get(e.symbol) ?? 2 ** 53 - 1) - (r.get(t.symbol) ?? 2 ** 53 - 1) || e.symbol.localeCompare(t.symbol));
}
//#endregion
//#region src/prediction-config/platform/views/config/prediction/creation.ts
var Ze = (e = !1) => ({
	default_value: "",
	minimum_value: "",
	maximum_value: "",
	agent_editable: e
});
function Qe(e, t, n) {
	return {
		is_new: !0,
		game_type: e,
		symbol: t,
		based_on_template_version: n,
		enabled: !1,
		rules: (e === "UP_DOWN" ? Ee : De).map((t) => ({
			duration_seconds: t,
			enabled_by_default: !0,
			minimum_stake: Ze(!0),
			maximum_stake: Ze(!0),
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
				target_payout_rate: Ze(),
				minimum_odds: {
					default_value: "1",
					minimum_value: "1",
					maximum_value: "1",
					agent_editable: !1
				},
				maximum_odds: Ze(),
				stake_tiers: [{
					enabled_by_default: !0,
					display_order: 1,
					minimum_stake: Ze(!0),
					maximum_stake: Ze(!0),
					retired: !1
				}]
			} : { fixed_odds: Ze(!0) }
		}))
	};
}
function $e(e, t, n) {
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
var et = (e, t) => e.includes("*") || e.includes(t), tt = {
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
tt.result, tt.sort_direction;
//#endregion
//#region src/prediction-config/platform/views/grid/config/model.ts
function nt(e, t = !0) {
	let n = structuredClone(e);
	return t && n.layout?.editable && n.layout.price_decimals == null && (n.layout.price_decimals = 3), n;
}
var rt = "grid.config.pending.v1", it = /^(0|[1-9]\d*)(?:\.(\d+))?$/, at = /^[1-9]\d*$/, ot = /^[A-Z0-9]{2,32}$/, st = [
	"site_id",
	"symbol",
	"based_on_layout_version",
	"based_on_site_version",
	"client_request_id",
	"reason",
	"changes"
], ct = [
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
], lt = [
	"based_on_config_id",
	"based_on_default_version",
	"based_on_default_resolution_epoch"
], ut = [
	"price_band_width",
	"column_duration_seconds",
	"price_decimals"
], dt = [
	"enabled",
	"target_rtp",
	"min_multiplier",
	"max_multiplier",
	"min_order_amount",
	"max_order_amount"
];
function ft(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function X(e, t = "INVALID_GRID_CONFIGURATION") {
	if (!e) throw Error(t);
}
function pt(e, t) {
	X(Object.keys(e).length === t.length && Object.keys(e).every((e) => t.includes(e)), "PENDING_CORRUPT");
}
function mt(e, t) {
	X(typeof e == "string" && e.length <= 128 && it.test(e), "INVALID_DECIMAL");
	let [n, r = ""] = e.split("."), i = n.replace(/^0+(?=\d)/, ""), a = r.replace(/0+$/, "");
	return X(t === void 0 || a.length <= t, "INVALID_DECIMAL"), a ? i + "." + a : i;
}
function ht(e) {
	let [t, n = ""] = mt(e).split(".");
	return {
		whole: t,
		fraction: n
	};
}
function gt(e, t) {
	let n = ht(e), r = ht(t);
	if (n.whole.length !== r.whole.length) return n.whole.length > r.whole.length ? 1 : -1;
	if (n.whole !== r.whole) return n.whole > r.whole ? 1 : -1;
	let i = Math.max(n.fraction.length, r.fraction.length), a = n.fraction.padEnd(i, "0"), o = r.fraction.padEnd(i, "0");
	return a === o ? 0 : a > o ? 1 : -1;
}
function _t(e, t) {
	let { whole: n, fraction: r } = ht(e), i = n + r, a = n.length + t, o;
	o = a <= 0 ? "0." + "0".repeat(-a) + i : a >= i.length ? i + "0".repeat(a - i.length) : i.slice(0, a) + "." + i.slice(a);
	let [s, c = ""] = o.split("."), l = s.replace(/^0+(?=\d)/, "") || "0", u = c.replace(/0+$/, "");
	return u ? l + "." + u : l;
}
function vt(e) {
	let t = mt(e);
	return X(gt(t, "0") > 0 && gt(t, "1") <= 0, "INVALID_RTP"), _t(t, 2);
}
function yt(e) {
	let t = mt(e);
	return X(gt(t, "0") > 0 && gt(t, "100") < 0, "INVALID_RTP"), _t(t, -2);
}
function bt(e = globalThis.crypto) {
	X(e && typeof e.getRandomValues == "function", "SECURE_RANDOM_UNAVAILABLE");
	let t = e.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	X(t instanceof Uint8Array && t.length === 16, "SECURE_RANDOM_UNAVAILABLE"), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0")).join("");
	return `${n.slice(0, 8)}-${n.slice(8, 12)}-${n.slice(12, 16)}-${n.slice(16, 20)}-${n.slice(20)}`;
}
function xt(e) {
	return X(typeof e == "string" && at.test(e) && gt(e, "25") <= 0, "INVALID_LAYOUT_DURATION"), e;
}
function St(e) {
	let t = xt(e);
	return X(gt(t, "10") <= 0, "INVALID_LAYOUT_DURATION"), t;
}
function Ct(e, t) {
	let n = mt(e, t);
	return X(gt(n, "0") > 0, "INVALID_LAYOUT_WIDTH"), n;
}
function wt(e) {
	if (typeof e != "string") return !1;
	let t = /^(?:0|[1-9]\d*)\.(\d+)$/.exec(e)?.[1];
	return t !== void 0 && t.length > 8;
}
function Tt(e) {
	return X(e === null || typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 18, "INVALID_LAYOUT_PRECISION"), e;
}
function Et(e) {
	return X(typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 8, "INVALID_LAYOUT_PRECISION"), e;
}
function Dt(e, t) {
	t != null && X((mt(e).split(".")[1] ?? "").length <= t, "INVALID_LAYOUT_PRECISION");
}
function Ot(e, t) {
	X(5 + (Number(e) + 1) * Number(t) <= 120, "INVALID_LAYOUT_HORIZON");
}
function kt(e) {
	return X(ft(e), "INVALID_GRID_LAYOUT"), pt(e, [
		"row_count",
		"column_count",
		"column_duration_seconds",
		"price_band_width",
		"effective_from_ms",
		"editable",
		"affected_site_ids",
		..."price_decimals" in e ? ["price_decimals"] : []
	]), X([
		e.row_count,
		e.column_count,
		e.column_duration_seconds
	].every((e) => typeof e == "string" && e.length <= 128 && at.test(e)), "INVALID_GRID_LAYOUT"), X(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_LAYOUT"), X(typeof e.editable == "boolean", "INVALID_GRID_LAYOUT"), X(Array.isArray(e.affected_site_ids) && e.affected_site_ids.every((e) => typeof e == "string" && e.length > 0 && e.length <= 64 && e.trim() === e), "INVALID_GRID_LAYOUT"), X(new Set(e.affected_site_ids).size === e.affected_site_ids.length && (!e.editable || e.affected_site_ids.length > 0), "INVALID_GRID_LAYOUT"), {
		row_count: e.row_count,
		column_count: e.column_count,
		column_duration_seconds: e.column_duration_seconds,
		price_band_width: Ct(e.price_band_width),
		..."price_decimals" in e ? { price_decimals: Tt(e.price_decimals) } : {},
		effective_from_ms: e.effective_from_ms,
		editable: e.editable,
		affected_site_ids: [...e.affected_site_ids]
	};
}
function At(e, t, n = !1) {
	return !!(n && e.layout?.editable && t.layout && ut.some((n) => e.layout[n] !== t.layout[n]));
}
function jt(e) {
	X(ft(e), "INVALID_GRID_CONFIGURATION"), pt(e, [
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
		..."config_id" in e ? ct : []
	]), X(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "INVALID_GRID_CONFIGURATION"), X(typeof e.symbol == "string" && ot.test(e.symbol), "INVALID_GRID_CONFIGURATION"), X([e.layout_version, e.site_version].every((e) => typeof e == "string" && at.test(e)), "INVALID_GRID_CONFIGURATION"), X(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_CONFIGURATION"), X(typeof e.enabled == "boolean", "INVALID_GRID_CONFIGURATION");
	let t = {
		site_id: e.site_id,
		symbol: e.symbol,
		layout_version: e.layout_version,
		site_version: e.site_version,
		effective_from_ms: e.effective_from_ms,
		enabled: e.enabled,
		target_rtp: mt(e.target_rtp),
		min_multiplier: mt(e.min_multiplier, 2),
		max_multiplier: mt(e.max_multiplier, 2),
		min_order_amount: mt(e.min_order_amount, 8),
		max_order_amount: mt(e.max_order_amount, 8)
	};
	if (X(gt(t.target_rtp, "0") > 0 && gt(t.target_rtp, "1") <= 0, "INVALID_GRID_CONFIGURATION"), X(gt(t.min_multiplier, "1") >= 0 && gt(t.max_multiplier, t.min_multiplier) >= 0, "INVALID_GRID_CONFIGURATION"), X(gt(t.min_order_amount, "0") > 0 && gt(t.max_order_amount, t.min_order_amount) >= 0, "INVALID_GRID_CONFIGURATION"), "config_id" in e) {
		for (let n of [
			"config_id",
			"default_config_id",
			"default_version",
			"default_resolution_epoch"
		]) X(typeof e[n] == "string" && at.test(e[n]) && gt(e[n], "9223372036854775807") <= 0), t[n] = e[n];
		X(typeof e.requested_agent_id == "string" && /^(0|[1-9][0-9]*)$/.test(e.requested_agent_id) && gt(e.requested_agent_id, "9223372036854775807") <= 0), X(e.agent_id === null || e.agent_id === e.requested_agent_id && e.agent_id !== "0"), t.requested_agent_id = e.requested_agent_id, t.agent_id = e.agent_id;
		for (let n of [
			"inherited",
			"default_enabled",
			"effective_enabled"
		]) X(typeof e[n] == "boolean"), t[n] = e[n];
		for (let n of [
			"default_target_rtp",
			"default_min_order_amount",
			"default_max_order_amount"
		]) t[n] = mt(e[n]);
	}
	return "layout" in e && (t.layout = kt(e.layout)), t;
}
function Mt(e, t, n) {
	let r = jt(e);
	return X(r.site_id === t && r.symbol === n, "INVALID_GRID_TARGET"), r;
}
function Nt(e, t, n, r, i, a = !1) {
	if (ft(e) && e.site_version === "0") return Pt(e, t, n, r, i, a);
	let o = ft(e) && ft(e.layout) ? e.layout.price_band_width : void 0, s = ft(t) && ft(t.layout) ? t.layout.price_band_width : void 0;
	X(o === s || !wt(s), "INVALID_LAYOUT_PRECISION");
	let c = jt(e), l = jt(t);
	X(c.site_id === l.site_id && c.symbol === l.symbol, "INVALID_GRID_TARGET"), X(typeof n == "string" && n.length <= 500 && n.trim().length > 0 && !n.includes("\0"), "INVALID_REASON"), X(typeof r == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(r), "INVALID_REQUEST_ID"), X(c.config_id && c.default_version && c.default_resolution_epoch, "CONFIG_IDENTITY_REQUIRED"), X(ct.every((e) => c[e] === l[e]), "INVALID_GRID_TARGET"), c.requested_agent_id !== "0" && (X(!l.enabled || c.default_enabled, "PLATFORM_LIMIT"), X(gt(l.target_rtp, c.default_target_rtp) <= 0 && gt(l.min_order_amount, c.default_min_order_amount) >= 0 && gt(l.max_order_amount, c.default_max_order_amount) <= 0, "PLATFORM_LIMIT"));
	let u = {};
	for (let e of dt) c[e] !== l[e] && (u[e] = l[e]);
	for (let e of ut) c.layout?.[e] !== l.layout?.[e] && (X(a && c.layout?.editable && l.layout, "FIELD_FORBIDDEN"), u[e] = l.layout[e]);
	if (ut.some((e) => e in u)) {
		let e = c.layout;
		"price_decimals" in u && Et(u.price_decimals), Dt(l.layout.price_band_width, l.layout.price_decimals), Ct(u.price_band_width ?? e.price_band_width, 18), "column_duration_seconds" in u && St(u.column_duration_seconds);
		let t = xt(u.column_duration_seconds ?? e.column_duration_seconds);
		X(gt(e.row_count, "10000") <= 0 && gt(e.column_count, "10000") <= 0 && Number(e.row_count) * Number(e.column_count) <= 1e4, "INVALID_GRID_LAYOUT"), Ot(e.column_count, t);
	}
	if (!i && ("min_multiplier" in u || "max_multiplier" in u)) throw Error("FIELD_FORBIDDEN");
	return X(Object.keys(u).length > 0, "EMPTY_CHANGES"), {
		site_id: c.site_id,
		symbol: c.symbol,
		based_on_layout_version: c.layout_version,
		based_on_site_version: c.site_version,
		based_on_config_id: c.config_id,
		based_on_default_version: c.default_version,
		based_on_default_resolution_epoch: c.default_resolution_epoch,
		client_request_id: r,
		reason: n,
		changes: u
	};
}
function Pt(e, t, n, r, i, a) {
	X(i && a && ft(t) && e.site_id === t.site_id && e.symbol === t.symbol, "INVALID_GRID_TARGET"), X(e.layout_version === t.layout_version && t.site_version === "0", "INVALID_GRID_TARGET"), e.layout_version === "0" && ft(t.layout) && X(!wt(t.layout.price_band_width), "INVALID_LAYOUT_PRECISION");
	let o = jt({
		...t,
		enabled: !1,
		site_version: "1",
		layout_version: e.layout_version === "0" ? "1" : e.layout_version
	}), s = { enabled: !1 };
	for (let e of dt) e !== "enabled" && (s[e] = o[e]);
	let c = [
		"row_count",
		"column_count",
		...ut
	];
	if (e.layout_version === "0") {
		X(o.layout, "INVALID_GRID_LAYOUT"), St(o.layout.column_duration_seconds);
		for (let e of c) e === "price_decimals" && o.layout.price_decimals == null || (s[e] = o.layout[e]);
		Dt(o.layout.price_band_width, o.layout.price_decimals);
	} else {
		let t = e.layout;
		X(ft(t) && o.layout && c.every((e) => t[e] === o.layout[e]), "FIELD_FORBIDDEN");
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
	return Ft(l), l;
}
function Ft(e) {
	if (X(ft(e), "PENDING_CORRUPT"), pt(e, [...st, ..."based_on_config_id" in e ? lt : []]), "based_on_config_id" in e) for (let t of lt) X(typeof e[t] == "string" && at.test(e[t]) && gt(e[t], "9223372036854775807") <= 0, "PENDING_CORRUPT");
	X(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "PENDING_CORRUPT"), X(typeof e.symbol == "string" && ot.test(e.symbol), "PENDING_CORRUPT");
	let t = e.based_on_site_version === "0";
	X(typeof e.based_on_layout_version == "string" && (at.test(e.based_on_layout_version) || t && e.based_on_layout_version === "0"), "PENDING_CORRUPT"), X(typeof e.based_on_site_version == "string" && (t || at.test(e.based_on_site_version)), "PENDING_CORRUPT"), X(typeof e.client_request_id == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(e.client_request_id), "PENDING_CORRUPT"), X(typeof e.reason == "string" && e.reason.length <= 500 && e.reason.trim().length > 0 && !e.reason.includes("\0"), "PENDING_CORRUPT");
	let n = [
		...dt,
		...ut,
		...t ? ["row_count", "column_count"] : []
	];
	X(ft(e.changes) && Object.keys(e.changes).length > 0 && Object.keys(e.changes).every((e) => n.includes(e)), "PENDING_CORRUPT");
	for (let [t, n] of Object.entries(e.changes)) t === "enabled" ? X(typeof n == "boolean", "PENDING_CORRUPT") : t === "row_count" || t === "column_count" ? X(typeof n == "string" && /^[1-9]\d{0,4}$/.test(n), "INVALID_GRID_LAYOUT") : t === "price_decimals" ? Et(n) : t === "price_band_width" ? Ct(n, 18) : t === "column_duration_seconds" ? xt(n) : mt(n, t.includes("order_amount") ? 8 : t.includes("multiplier") ? 2 : void 0);
	if (t) {
		X(!("based_on_config_id" in e) && e.changes.enabled === !1, "PENDING_CORRUPT");
		let t = e.based_on_layout_version === "0";
		if (pt(e.changes, [...dt, ...t ? [
			"row_count",
			"column_count",
			...ut.filter((t) => t !== "price_decimals" || Object.prototype.hasOwnProperty.call(e.changes, t))
		] : []]), jt({
			...Object.fromEntries(dt.map((t) => [t, e.changes[t]])),
			site_id: e.site_id,
			symbol: e.symbol,
			site_version: "1",
			layout_version: "1",
			effective_from_ms: "0"
		}), X(gt(e.based_on_layout_version, "9223372036854775807") <= 0, "PENDING_CORRUPT"), t) {
			let t = e.changes;
			X(Number(t.row_count) * Number(t.column_count) <= 1e4, "INVALID_GRID_LAYOUT"), Ct(t.price_band_width, 8), Ot(t.column_count, t.column_duration_seconds);
		}
	}
}
function It(e) {
	if (e && typeof e == "object") {
		Object.freeze(e);
		for (let t of Object.values(e)) It(t);
	}
	return e;
}
function Lt(e, t) {
	return !!e && JSON.stringify(e) === JSON.stringify(t);
}
function Rt(e) {
	let t = e.getItem(rt);
	if (t === null) return null;
	X(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return X(ft(n), "PENDING_CORRUPT"), pt(n, [
		"schema",
		"operator_id",
		"command"
	]), X(n.schema === 1 && typeof n.operator_id == "string" && at.test(n.operator_id), "PENDING_CORRUPT"), Ft(n.command), It(n);
}
function zt(e, t, n) {
	X(at.test(t), "IDENTITY_UNCONFIRMED"), X(Rt(e) === null, "PENDING_EXISTS"), Ft(n);
	let r = {
		schema: 1,
		operator_id: t,
		command: JSON.parse(JSON.stringify(n))
	};
	e.setItem(rt, JSON.stringify(r));
	let i = Rt(e);
	return X(Lt(i, r), "PERSISTENCE_UNAVAILABLE"), i;
}
function Bt(e, t) {
	return X(at.test(e), "IDENTITY_UNCONFIRMED"), Ft(t), It({
		operator_id: e,
		command: structuredClone(t)
	});
}
function Vt(e, t, n, r) {
	return Ft(t.command), Ft(r), X(t.operator_id === n && JSON.stringify(t.command) === JSON.stringify(r), "STALE_CONFIRMATION"), zt(e, t.operator_id, t.command);
}
function Ht(e, t) {
	let n = Rt(e);
	return n ? n.operator_id === t ? {
		status: "bound",
		pending: n
	} : {
		status: "foreign",
		pending: n
	} : { status: "none" };
}
function Ut(e, t) {
	return ft(e) ? e.operation_status === "SUCCEEDED" && typeof e.operation_id == "string" && at.test(e.operation_id) && e.site_id === t.command.site_id && e.symbol === t.command.symbol && typeof e.layout_version == "string" && at.test(e.layout_version) && typeof e.site_version == "string" && at.test(e.site_version) && typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms) && typeof e.changed == "boolean" && [
		"PENDING",
		"DONE",
		"NOT_REQUIRED"
	].includes(String(e.cache_state)) : !1;
}
function Wt(e) {
	return ft(e) && e.error_code === "RECEIPT_UNCONFIRMED" && e.operation_status === "UNKNOWN";
}
async function Gt(e, t, n, r) {
	X(Lt(Rt(e), t), "PENDING_CHANGED");
	try {
		let i = await r(n === "recover" ? "save" : n, structuredClone(t.command));
		return Ut(i, t) ? (Lt(Rt(e), t) && e.removeItem(rt), {
			status: "success",
			value: i
		}) : {
			status: "unknown",
			error: /* @__PURE__ */ Error("INVALID_RECEIPT")
		};
	} catch (r) {
		if ((ft(r) ? r.operation_status : void 0) === "FAILED" && (n === "save" || n === "recover" && ft(r) && r.error_code === "VERSION_CONFLICT")) {
			let n = Lt(Rt(e), t);
			return n && e.removeItem(rt), {
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
var Kt = class {
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
}, qt = { "config.save": [
	"game_type",
	"symbol",
	"based_on_template_version",
	"platform_template"
] };
function Jt(e, t) {
	let n = t;
	return e === "routing.prepare" || e === "routing.cancel" ? n?.change?.receipt : e === "routing.commit" ? n?.binding?.receipt : n?.receipt;
}
var Yt = class {
	busy = !1;
	key;
	storage;
	action;
	constructor(e, t, n, r) {
		if (!t || !qt[n] || !r) throw Error("无法确认当前操作上下文");
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
			...qt[this.action],
			"reason",
			"client_request_id"
		];
		if (Object.keys(e).some((e) => !t.includes(e)) || typeof e.reason != "string" || !e.reason.trim() || e.reason.length > 500 || typeof e.client_request_id != "string" || !e.client_request_id || e.client_request_id.length > 128) throw Error("操作记录字段无效");
		if (qt[this.action].some((t) => !Object.hasOwn(e, t))) throw Error("操作记录缺少必要字段");
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
			if (J(r, t.enabled === !1 && r.rules.every((e) => e.market_id === void 0 && (e.stake_tiers ?? []).every((e) => e.stake_tier_id === void 0))).length) throw Error("配置操作记录无效");
		}
	}
	begin(e, t = bt()) {
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
			let n = await e(structuredClone(t.body)), i = Jt(this.action, n);
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
}, Xt = ["data-action"], Zt = {
	key: 2,
	class: "pending-summary"
}, Qt = { key: 0 }, $t = {
	key: 5,
	role: "status"
}, en = /*#__PURE__*/ e(/* @__PURE__ */ f({
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
		let r = e, c = n, l = ge(), f = i(() => et(l.perms, r.permission)), p = b(""), m = b(""), h = b(""), g = b(!1), ee = b(null), _ = b(""), v = i(() => !!((ee.value || r.newAllowed) && (m.value && !r.hideError || ee.value && !r.hidePendingDetails || !ee.value && !r.automaticReason || f.value && !r.hideButton || h.value && !r.hideSuccess))), ne, re = 0;
		ae(g, (e) => c("busy", e), { flush: "sync" });
		function x() {
			try {
				ee.value = ne?.read() ?? null, c("pending", !!ee.value);
			} catch (e) {
				_.value = we(e), m.value = _.value;
			}
		}
		ae(() => [
			r.action,
			r.target,
			String(l.userInfo.id || "")
		], () => {
			if (re++, g.value = !1, p.value = "", m.value = "", h.value = "", _.value = "", ee.value = null, c("pending", !1), ne = void 0, r.target) try {
				ne = new Yt(sessionStorage, String(l.userInfo.id || ""), r.action, r.target), x();
			} catch (e) {
				_.value = we(e), m.value = _.value;
			}
		}, {
			immediate: !0,
			flush: "sync"
		});
		async function S() {
			if (g.value || r.blocked || !f.value || !ne || _.value) return;
			let e = ne, t = re, n = String(l.userInfo.id || ""), i = r.action, a = r.target, o = r.send, s = () => t === re && ne === e && n === String(l.userInfo.id || "") && i === r.action && a === r.target;
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
				s() && (m.value = we(e));
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
		}), (t, n) => v.value ? (y(), s("section", {
			key: 0,
			class: "prediction-write",
			"data-action": e.action
		}, [
			m.value && !e.hideError ? (y(), a(T(oe), {
				key: 0,
				title: m.value,
				type: "error",
				closable: !1,
				"show-icon": ""
			}, null, 8, ["title"])) : o("", !0),
			ee.value && !e.hidePendingDetails ? (y(), a(T(oe), {
				key: 1,
				title: "上次操作结果尚未确定。核验将使用原操作内容，不会重复创建新的操作。",
				type: "warning",
				closable: !1
			})) : o("", !0),
			ee.value && !e.hidePendingDetails ? (y(), s("div", Zt, [u(" 操作号：" + w(ee.value.body.client_request_id), 1), e.automaticReason ? o("", !0) : (y(), s("span", Qt, " · 原因：" + w(ee.value.body.reason), 1))])) : !ee.value && !e.automaticReason ? (y(), a(T(I), {
				key: 3,
				label: "操作原因",
				required: ""
			}, {
				default: D(() => [d(T(R), {
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
			f.value && !e.hideButton ? (y(), a(T(A), {
				key: 4,
				type: "primary",
				loading: g.value,
				disabled: g.value || e.blocked || !ee.value && e.disabled || !!_.value,
				onClick: S
			}, {
				default: D(() => [u(w(ee.value ? "核验原操作" : e.label), 1)]),
				_: 1
			}, 8, ["loading", "disabled"])) : o("", !0),
			h.value && !e.hideSuccess ? (y(), s("p", $t, w(h.value), 1)) : o("", !0)
		], 8, Xt)) : o("", !0);
	}
}), [["__scopeId", "data-v-e2bd32a3"]]), tn = ["inert", "aria-hidden"], nn = /*#__PURE__*/ e(/* @__PURE__ */ f({
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
		let t = e, r = b(!1), i;
		function o() {
			i !== void 0 && clearTimeout(i), i = void 0;
		}
		return ae(() => t.loading, (e) => {
			o(), r.value = !1, e && (i = setTimeout(() => {
				i = void 0, r.value = t.loading;
			}, 150));
		}, {
			immediate: !0,
			flush: "sync"
		}), te(o), (t, i) => (y(), a(S(e.as), {
			class: ee(["prediction-loading-region", { "is-loading": e.loading }]),
			style: _({ "--prediction-loading-min-height": e.minHeight }),
			"aria-busy": e.loading
		}, {
			default: D(() => [c("div", {
				class: ee(["prediction-loading-region__content", { "is-hidden": e.hideContent }]),
				inert: e.loading || void 0,
				"aria-hidden": e.hideContent || void 0
			}, [x(t.$slots, "default", {}, void 0, !0)], 10, tn), d(T(n), {
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
}), [["__scopeId", "data-v-bd8381e2"]]), rn = { class: "prediction-help-copy" }, an = ["aria-label", "aria-expanded"], on = /*#__PURE__*/ e(/* @__PURE__ */ f({
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
		return (t, r) => s.value ? (y(), a(T(z), {
			key: 0,
			visible: n.value,
			"onUpdate:visible": r[2] ||= (e) => n.value = e,
			trigger: "click",
			placement: "top",
			width: 300,
			title: e.label
		}, {
			reference: D(() => [c("button", {
				type: "button",
				class: "prediction-help-button",
				"aria-label": `${e.label}说明`,
				"aria-expanded": n.value,
				onClick: r[0] ||= k(() => {}, ["stop"]),
				onKeydown: r[1] ||= O(k((e) => n.value = !1, ["prevent"]), ["esc"])
			}, [d(T(L), null, {
				default: D(() => [d(T(H))]),
				_: 1
			})], 40, an)]),
			default: D(() => [c("p", rn, w(s.value), 1)]),
			_: 1
		}, 8, ["visible", "title"])) : o("", !0);
	}
}), [["__scopeId", "data-v-b226ed88"]]), sn = /^(0|[1-9][0-9]{0,35})(?:\.[0-9]{1,18})?$/;
function cn(e, t, n, r = "0", i) {
	let a = [
		e,
		t,
		r,
		...i === void 0 ? [] : [i]
	];
	if (!a.every((e) => sn.test(e))) return null;
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
function ln(e, t) {
	if (!/^(0|[1-9][0-9]*)(?:\.[0-9]*)?$/.test(e)) return e;
	let [n, r = ""] = e.split("."), i = n + r, a = n.length + t, [o, s = ""] = (a <= 0 ? "0." + "0".repeat(-a) + i : a >= i.length ? i + "0".repeat(a - i.length) : i.slice(0, a) + "." + i.slice(a)).split("."), c = s.replace(/0+$/, "");
	return (o.replace(/^0+(?=\d)/, "") || "0") + (c ? "." + c : "");
}
//#endregion
//#region src/prediction-config/platform/views/prediction/components/DecimalInput.vue?vue&type=script&setup=true&lang.ts
var un = { class: "decimal-step-controls" }, dn = ["disabled"], fn = ["disabled"], pn = /*#__PURE__*/ e(/* @__PURE__ */ f({
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
		let n = e, r = R, o = t, s = V(), d = b(n.percentage ? ln(n.modelValue, 2) : n.modelValue);
		ae(() => [n.modelValue, n.percentage], () => {
			n.percentage && ln(d.value, -2) === n.modelValue || (d.value = n.percentage ? ln(n.modelValue, 2) : n.modelValue);
		});
		let f = (e) => cn(d.value, n.step, e, n.min, n.max), p = i(() => f(1)), m = i(() => f(-1));
		function g(e) {
			if (s.value) return;
			d.value = e;
			let t = n.percentage ? ln(e, -2) : e;
			o("update:modelValue", t), o("input", t);
		}
		function ee(e) {
			if (s.value) return;
			let t = f(e);
			t !== null && t !== d.value && g(t);
		}
		return (t, n) => (y(), a(S(e.inputComponent || T(r)), h({ class: "prediction-decimal-input" }, t.$attrs, {
			modelValue: d.value,
			disabled: T(s),
			inputmode: t.$attrs.inputmode || "decimal",
			"onUpdate:modelValue": g,
			onKeydown: [n[4] ||= O(k((e) => ee(1), ["prevent"]), ["up"]), n[5] ||= O(k((e) => ee(-1), ["prevent"]), ["down"])]
		}), l({
			suffix: D(() => [c("span", un, [c("button", {
				type: "button",
				tabindex: "-1",
				"aria-label": "增加数值",
				disabled: T(s) || p.value === null || p.value === d.value,
				onMousedown: n[0] ||= k(() => {}, ["prevent"]),
				onClick: n[1] ||= (e) => ee(1)
			}, [...n[6] ||= [c("svg", {
				viewBox: "0 0 12 12",
				"aria-hidden": "true"
			}, [c("path", { d: "m3 7 3-3 3 3" })], -1)]], 40, dn), c("button", {
				type: "button",
				tabindex: "-1",
				"aria-label": "减少数值",
				disabled: T(s) || m.value === null || m.value === d.value,
				onMousedown: n[2] ||= k(() => {}, ["prevent"]),
				onClick: n[3] ||= (e) => ee(-1)
			}, [...n[7] ||= [c("svg", {
				viewBox: "0 0 12 12",
				"aria-hidden": "true"
			}, [c("path", { d: "m3 5 3 3 3-3" })], -1)]], 40, fn)])]),
			_: 2
		}, [e.unit || t.$slots.append ? {
			name: "append",
			fn: D(() => [x(t.$slots, "append", {}, () => [u(w(e.unit), 1)], !0)]),
			key: "0"
		} : void 0]), 1040, [
			"modelValue",
			"disabled",
			"inputmode"
		]));
	}
}), [["__scopeId", "data-v-ecdf8293"]]), mn = ["aria-label"], hn = { class: "prediction-constraint__title" }, gn = {
	key: 0,
	class: "constraint-description"
}, _n = /*#__PURE__*/ e(/* @__PURE__ */ f({
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
	setup(e) {
		let n = e, r = E(e, "modelValue"), a = i({
			get: () => n.percentage ? Ue(r.value[n.field]) : r.value[n.field],
			set: (e) => {
				let t = r.value[n.field], i = n.percentage ? We(e) : e;
				n.field === "default_value" && r.value.maximum_value === t && (n.agentLocked && r.value.minimum_value === t && (r.value.minimum_value = i), r.value.maximum_value = i), r.value[n.field] = i;
			}
		});
		return (n, r) => (y(), s("div", {
			class: ee(["prediction-constraint", { "is-compact": e.compact }]),
			role: "group",
			"aria-label": e.title
		}, [
			c("div", hn, [u(w(e.title), 1), d(on, { label: e.title }, null, 8, ["label"])]),
			d(pn, {
				"input-component": T(t),
				step: e.percentage ? "1" : "0.01",
				modelValue: a.value,
				"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
				"aria-label": e.title,
				disabled: e.disabled
			}, l({ _: 2 }, [e.percentage || e.unit ? {
				name: "append",
				fn: D(() => [u(w(e.percentage ? "%" : e.unit), 1)]),
				key: "0"
			} : void 0]), 1032, [
				"input-component",
				"step",
				"modelValue",
				"aria-label",
				"disabled"
			]),
			e.description ? (y(), s("p", gn, w(e.description), 1)) : o("", !0)
		], 10, mn));
	}
}), [["__scopeId", "data-v-a22ded5a"]]), vn = { class: "fixed-room-controls" }, yn = {
	class: "room-tabs",
	role: "group",
	"aria-label": "选择房间或周期"
}, bn = [
	"data-room-choice",
	"aria-pressed",
	"onClick"
], xn = [
	"data-room-remove",
	"aria-label",
	"disabled",
	"onClick"
], Sn = {
	key: 0,
	class: "room-empty"
}, Cn = { class: "dialog-context" }, wn = /*#__PURE__*/ e(/* @__PURE__ */ f({
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
		function v(e) {
			n.disabled || !e.present || (_.value = n.context, h.value = e, m.value = "remove");
		}
		function ne() {
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
		return ae(() => n.context, te, { flush: "sync" }), (t, n) => (y(), s("div", vn, [
			c("div", yn, [(y(!0), s(r, null, re(f.value, (t) => (y(), s("span", {
				key: t.key,
				class: ee(["room-tag", { active: e.selected === t.key }])
			}, [c("button", {
				type: "button",
				"data-room-choice": t.key,
				"aria-pressed": e.selected === t.key,
				onClick: (e) => l("select", t.key)
			}, w(t.label), 9, bn), c("button", {
				type: "button",
				class: "room-remove",
				"data-room-remove": t.key,
				"aria-label": `删除${t.label}房间`,
				disabled: e.disabled,
				onClick: (e) => v(t)
			}, "×", 8, xn)], 2))), 128)), d(T(A), {
				class: "room-add",
				"data-room-add": !0,
				disabled: e.disabled || !p.value.length,
				onClick: ne
			}, {
				default: D(() => [...n[1] ||= [u("＋ 新增周期", -1)]]),
				_: 1
			}, 8, ["disabled"])]),
			f.value.length ? o("", !0) : (y(), s("p", Sn, "暂无房间，可从固定周期中新增。保存后生效。")),
			m.value ? (y(), a(T(N), {
				key: 1,
				"model-value": !0,
				title: m.value === "remove" ? "确认删除周期？" : "新增周期",
				width: "460px",
				"append-to-body": "",
				class: "prediction-room-dialog mm-ui",
				"close-on-click-modal": !1,
				"onUpdate:modelValue": te
			}, {
				footer: D(() => [d(T(A), {
					"data-room-cancel": !0,
					onClick: te
				}, {
					default: D(() => [...n[5] ||= [u("取消", -1)]]),
					_: 1
				}), m.value === "remove" ? (y(), a(T(A), {
					key: 0,
					type: "danger",
					"data-room-confirm": !0,
					disabled: e.disabled,
					onClick: S
				}, {
					default: D(() => [...n[6] ||= [u("确认删除", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (y(), a(T(A), {
					key: 1,
					type: "primary",
					"data-room-add-confirm": !0,
					disabled: e.disabled || !g.value,
					onClick: C
				}, {
					default: D(() => [...n[7] ||= [u("确认新增", -1)]]),
					_: 1
				}, 8, ["disabled"]))]),
				default: D(() => [m.value === "remove" ? (y(), s(r, { key: 0 }, [
					c("p", Cn, w(e.description) + " · " + w(h.value?.label), 1),
					n[2] ||= c("p", { class: "dialog-description" }, "删除后该房间将从当前配置中移除，点击保存配置后停止生效。", -1),
					n[3] ||= c("p", { class: "dialog-note" }, "该操作不会影响已创建订单，历史订单仍保留原配置快照。后续可从固定周期中重新添加。", -1)
				], 64)) : (y(), s(r, { key: 1 }, [n[4] ||= c("label", { class: "dialog-label" }, "预测周期", -1), d(T(de), {
					modelValue: g.value,
					"onUpdate:modelValue": n[0] ||= (e) => g.value = e,
					placeholder: "请选择周期",
					style: { width: "100%" },
					disabled: e.disabled
				}, {
					default: D(() => [(y(!0), s(r, null, re(p.value, (e) => (y(), a(T(ue), {
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
}), [["__scopeId", "data-v-6b23ed77"]]), Tn = { class: "group-heading" }, En = { class: "field-caption" }, Dn = { class: "odds-fields" }, On = ["data-room"], kn = {
	key: 0,
	class: "rule-heading"
}, An = { class: "group-heading" }, jn = { class: "group-heading" }, Mn = { class: "group-heading" }, Nn = { class: "two-fields" }, Pn = {
	key: 1,
	class: "editor-footer"
}, Fn = /*#__PURE__*/ e(/* @__PURE__ */ f({
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
	setup(e, { expose: n, emit: l }) {
		let { predictionConfigurationDetail: f, predictionConfigurationList: p, predictionConfigurationSave: m } = me().api, h = e, g = b(), _ = b(), v = b(!1), ne = b();
		function x() {
			_.value?.submit();
		}
		function C() {
			ne.value?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		let E = l, O = ge(), k = b(!1), M = b(!1), N = b(""), F = b(), L = b(!1), R = i(() => et(O.perms, "prediction_config:edit")), ce = b(""), le = b("UP_DOWN"), ue = b(""), z = i({
			get: () => F.value?.rules[0]?.price_rule.price_decimals ?? void 0,
			set: (e) => {
				if (!(!F.value || !R.value || !q.value.ready || L.value || v.value)) for (let t of F.value.rules) t.price_rule.price_decimals = e ?? null;
			}
		}), de = b("");
		ae(z, (e) => {
			Number.isNaN(e) || (de.value = e == null ? "" : String(e));
		}, {
			immediate: !0,
			flush: "sync"
		});
		let V = i({
			get: () => de.value,
			set: (e) => {
				!F.value || !R.value || !q.value.ready || L.value || v.value || (de.value = e, z.value = e === "" ? void 0 : /^[0-8]$/.test(e) ? Number(e) : NaN);
			}
		}), H = b(!1), U = i(() => F.value?.game_type === "UP_DOWN" ? [...F.value.rules].sort((e, t) => Ee.indexOf(e.duration_seconds) - Ee.indexOf(t.duration_seconds)) : F.value?.rules ?? []), W = i(() => U.value.filter((e) => e.enabled_by_default)), pe = i(() => U.value.map((e) => ({
			key: e.duration_seconds,
			label: Ce(e.duration_seconds, F.value?.game_type),
			present: e.enabled_by_default,
			allowed: !0
		}))), G = i(() => h.inline ? g.value?.enabled_by_default ? [g.value] : [] : W.value);
		function he(e) {
			g.value = W.value.find((t) => t.duration_seconds === e);
		}
		function _e(e, t) {
			if (!R.value || !q.value.ready || L.value || v.value) return;
			let n = U.value.find((t) => t.duration_seconds === e);
			!n || n.enabled_by_default === t || (n.enabled_by_default = t, g.value = t ? n : W.value[0]);
		}
		let ve = b(0), ye = b(0), be = b(""), xe = b(""), Se, K = i(() => String(O.userInfo.id || "")), q = i(() => ({
			target: ce.value,
			generation: ve.value,
			actor: be.value,
			enabled: F.value?.enabled,
			roomDurations: W.value.map((e) => e.duration_seconds),
			loading: M.value,
			pending: L.value,
			saving: v.value,
			saveError: _.value?.error || "",
			isNew: !!F.value?.is_new,
			dirty: !!(F.value && xe.value && JSON.stringify(F.value) !== xe.value),
			ready: !!(F.value && !M.value && !N.value && ye.value === ve.value && be.value === K.value && `${F.value.game_type}:${F.value.symbol}` === ce.value)
		}));
		ae(F, () => {
			h.externalSave && !M.value && _.value?.clearFeedback();
		}, {
			deep: !0,
			flush: "sync"
		});
		function Te(e, t, n, r) {
			return typeof r != "boolean" || !F.value || F.value.is_new || !q.value.ready || !R.value || !et(O.perms, "prediction_config:lists") || L.value || v.value || e !== ce.value || t !== ve.value || n !== K.value ? !1 : (F.value.enabled = r, !0);
		}
		ae(() => [
			K.value,
			et(O.perms, "prediction_config:lists"),
			R.value
		], () => {
			ve.value++, Se?.abort(), M.value = !1;
		}, { flush: "sync" });
		function De(e, t) {
			if (!e.rules.length || e.rules.some((e) => e.game_type !== `GAME_TYPE_${le.value}` || e.symbol !== ue.value)) throw Error("返回配置与当前币种或玩法不匹配，请重新加载");
			let n = g.value?.duration_seconds;
			F.value = Fe(e), H.value = !1, xe.value = JSON.stringify(F.value), ye.value = t, be.value = K.value, g.value = W.value.find((e) => e.duration_seconds === n) || W.value[0];
		}
		async function Oe() {
			if (!et(O.perms, "prediction_config:lists")) return;
			Se?.abort(), Se = new AbortController();
			let e = ++ve.value, t = le.value, n = ue.value;
			M.value = !0, N.value = "";
			try {
				if (H.value) {
					if (!R.value) throw Error("没有配置新增权限");
					let r = await p({}, Se.signal);
					if (e !== ve.value) return;
					let i = $e(r, t, n);
					return i.existing ? De(i.existing, e) : (F.value = Qe(t, n, i.version), xe.value = JSON.stringify(F.value), ye.value = e, be.value = K.value, g.value = W.value[0]), e;
				}
				let r = await f({
					game_type: t,
					symbol: n
				}, Se.signal);
				if (e === ve.value) return De(r.configuration, e), e;
			} catch (t) {
				e === ve.value && (N.value = we(t));
			} finally {
				e === ve.value && (M.value = !1);
			}
		}
		async function ke(e, t, n, r = !1) {
			if (le.value = e, ue.value = t, ce.value = `${e}:${t}`, H.value = r, F.value = void 0, xe.value = "", g.value = void 0, L.value = !1, k.value = !0, n && et(O.perms, "prediction_config:lists")) {
				Se?.abort();
				let e = ++ve.value;
				M.value = !1, N.value = "";
				try {
					return De(n, e), e;
				} catch (e) {
					N.value = we(e);
					return;
				}
			}
			return await Oe();
		}
		function Ae() {
			if (!F.value) throw Error("请先加载配置");
			let e = J(ie(F.value));
			if (e.length) throw Error(Y(e, F.value.game_type, g.value?.duration_seconds || F.value.rules[0]?.duration_seconds || ""));
			let { client_request_id: t, reason: n, ...r } = Ie(ie(F.value), "", "");
			return r;
		}
		let je = (e) => m(e);
		function Me() {
			H.value = !1, E("success"), Oe();
		}
		async function Ne() {
			M.value || L.value || v.value || await Oe();
		}
		return te(() => {
			ve.value++, Se?.abort();
		}), n({
			open: ke,
			focusSave: C,
			saveConfig: x,
			editingState: q,
			setEnabled: Te
		}), (n, i) => !e.inline || k.value ? (y(), a(S(e.inline ? "section" : T(P)), {
			key: 0,
			class: ee(["mm-ui", { "prediction-edit-inline": e.inline }]),
			modelValue: k.value,
			"onUpdate:modelValue": i[5] ||= (e) => k.value = e,
			"close-on-click-modal": !1,
			"destroy-on-close": "",
			size: "min(1080px,96vw)",
			title: "玩法配置",
			onClosed: i[6] ||= (e) => E("close")
		}, {
			default: D(() => [
				N.value ? (y(), a(T(oe), {
					key: 0,
					title: N.value,
					type: "error",
					closable: !1
				}, null, 8, ["title"])) : o("", !0),
				d(nn, {
					loading: M.value,
					"hide-content": M.value && !F.value,
					"min-height": e.inline ? "0px" : "280px",
					class: "prediction-edit"
				}, {
					default: D(() => [c("div", {
						ref_key: "saveArea",
						ref: ne,
						"data-config-save-area": "",
						class: ee(["config-save-area", { "config-save-area--external": e.externalSave }])
					}, [k.value && R.value ? (y(), a(en, {
						key: 0,
						ref_key: "writeRef",
						ref: _,
						"hide-button": e.externalSave,
						"hide-success": e.externalSave,
						"hide-pending-details": e.externalSave,
						"hide-error": e.externalSave,
						action: "config.save",
						target: ce.value,
						permission: "prediction_config:edit",
						label: "保存配置",
						"automatic-reason": "通过总后台玩法配置页面保存配置",
						disabled: M.value || !q.value.ready,
						payload: Ae,
						send: je,
						onPending: i[0] ||= (e) => L.value = e,
						onBusy: i[1] ||= (e) => v.value = e,
						onSuccess: Me
					}, null, 8, [
						"hide-button",
						"hide-success",
						"hide-pending-details",
						"hide-error",
						"target",
						"disabled"
					])) : o("", !0)], 2), F.value ? (y(), s(r, { key: 0 }, [
						F.value.is_new ? (y(), a(T(oe), {
							key: 0,
							title: "首次配置需填写全部五个周期的必填参数；保存后币种保持关闭。",
							type: "info",
							closable: !1
						})) : o("", !0),
						d(T(j), {
							shadow: "never",
							class: "room-config"
						}, {
							header: D(() => [c("div", Tn, [c("div", null, [c("h3", null, w(F.value.game_type === "UP_DOWN" ? "房间配置" : "周期配置"), 1), c("p", null, w(F.value.symbol) + " · " + w(F.value.game_type === "UP_DOWN" ? "涨跌预测" : "自选预测"), 1)]), e.inline ? o("", !0) : (y(), a(T(fe), {
								key: 0,
								modelValue: F.value.enabled,
								"onUpdate:modelValue": i[2] ||= (e) => F.value.enabled = e,
								disabled: !R.value || L.value || F.value.is_new,
								"active-text": "开放",
								"inactive-text": "停用"
							}, null, 8, ["modelValue", "disabled"]))])]),
							default: D(() => [c("div", En, w(F.value.game_type === "UP_DOWN" ? "支持房间" : "支持周期"), 1), d(wn, {
								description: `${F.value.symbol} · ${F.value.game_type === "UP_DOWN" ? "涨跌预测" : "自选预测"}`,
								rooms: pe.value,
								selected: g.value?.duration_seconds || "",
								disabled: !R.value || !q.value.ready || L.value || v.value,
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
						d(T(j), {
							shadow: "never",
							class: "config-group"
						}, {
							header: D(() => [...i[7] ||= [c("div", { class: "group-heading" }, [c("div", null, [c("h3", null, "价格精度"), c("p", null, "同一币种全部周期共用，变更只影响后续新场次或订单。")])], -1)]]),
							default: D(() => [d(T(se), { "label-position": "top" }, {
								default: D(() => [c("div", Dn, [d(T(I), { label: "价格小数位" }, {
									default: D(() => [d(pn, {
										"input-component": T(t),
										modelValue: V.value,
										"onUpdate:modelValue": i[3] ||= (e) => V.value = e,
										min: "0",
										max: "8",
										step: "1",
										unit: "位",
										inputmode: "numeric",
										placeholder: "请输入 0～8 的整数",
										"aria-label": "价格小数位",
										disabled: !R.value || !q.value.ready || L.value || v.value
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
							default: D(() => [(y(!0), s(r, null, re(G.value, (n, l) => (y(), s("section", {
								key: n.market_id || l,
								class: "rule",
								"data-room": n.duration_seconds
							}, [
								e.inline ? o("", !0) : (y(), s("div", kn, [c("strong", null, w(T(Ce)(n.duration_seconds, F.value.game_type)) + w(F.value.game_type === "UP_DOWN" ? "房间" : ""), 1)])),
								F.value.game_type === "UP_DOWN" ? (y(), a(T(j), {
									key: 1,
									shadow: "never",
									class: "config-group round-time-summary"
								}, {
									header: D(() => [c("div", An, [c("div", null, [c("h3", null, " 场次时间 · " + w(T(Ce)(n.duration_seconds, F.value.game_type)) + "房间 ", 1), i[9] ||= c("p", null, "每个场次的下注开放时间固定为 30 秒", -1)]), d(T(B), { size: "small" }, {
										default: D(() => [u(w(T(Ce)(n.duration_seconds, F.value.game_type)), 1)]),
										_: 2
									}, 1024)])]),
									_: 2
								}, 1024)) : o("", !0),
								d(T(j), {
									shadow: "never",
									class: "config-group"
								}, {
									header: D(() => [c("div", jn, [c("div", null, [c("h3", null, " 赔率配置 · " + w(T(Ce)(n.duration_seconds, F.value.game_type)), 1), c("p", null, w(F.value.game_type === "UP_DOWN" ? "上涨赔率 = 1 + 目标返奖率 × 下跌池 ÷（上涨池＋本次下注）；下跌赔率反向计算。下注期间为预计倍率，封盘后锁定最终倍率。" : "用户下单时按当前周期固定赔率锁定，订单存储赔率快照"), 1)]), d(T(B), {
										size: "small",
										effect: "plain"
									}, {
										default: D(() => [u(w(F.value.game_type === "UP_DOWN" ? "动态赔率" : "固定赔率"), 1)]),
										_: 1
									})])]),
									default: D(() => [c("div", { class: ee(["odds-fields", { "one-field": F.value.game_type === "HIGH_LOW" }]) }, [F.value.game_type === "HIGH_LOW" && n.fixed_odds ? (y(), a(_n, {
										key: 0,
										modelValue: n.fixed_odds,
										"onUpdate:modelValue": (e) => n.fixed_odds = e,
										compact: "",
										unit: "x",
										title: "固定赔率",
										description: "上涨和下跌使用相同赔率，且必须小于 2"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])) : o("", !0), F.value.game_type === "UP_DOWN" ? (y(), s(r, { key: 1 }, [n.target_payout_rate ? (y(), a(_n, {
										key: 0,
										modelValue: n.target_payout_rate,
										"onUpdate:modelValue": (e) => n.target_payout_rate = e,
										compact: "",
										"agent-locked": "",
										percentage: "",
										title: "目标返奖率",
										description: "例如 90%：按对方资金池的 90% 计算可分配收益，且必须小于 100%"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])) : o("", !0), n.maximum_odds ? (y(), a(_n, {
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
									header: D(() => [c("div", Mn, [c("div", null, [c("h3", null, " 下注限制 · " + w(T(Ce)(n.duration_seconds, F.value.game_type)), 1), c("p", null, w(F.value.symbol) + " 当前" + w(F.value.game_type === "UP_DOWN" ? "房间" : "周期") + "的单笔下注范围 ", 1)]), d(T(B), { size: "small" }, {
										default: D(() => [u(w(T(Ce)(n.duration_seconds, F.value.game_type)), 1)]),
										_: 2
									}, 1024)])]),
									default: D(() => [c("div", Nn, [d(T(I), { label: "单笔最小额（USDT）" }, {
										label: D(() => [i[10] ||= u("单笔最小额（USDT）", -1), d(on, {
											label: "单笔最小额",
											content: "此房间允许的最低单笔下注额。商户可在总后台单笔范围内调整自己的最小额和最大额。"
										})]),
										default: D(() => [d(pn, {
											"input-component": T(t),
											"aria-label": "单笔最小额",
											unit: "USDT",
											"model-value": n.minimum_stake.default_value,
											"onUpdate:modelValue": (e) => T(Ge)(n, "minimum_stake", e)
										}, null, 8, [
											"input-component",
											"model-value",
											"onUpdate:modelValue"
										])]),
										_: 2
									}, 1024), d(T(I), { label: "单笔最大额（USDT）" }, {
										label: D(() => [i[11] ||= u("单笔最大额（USDT）", -1), d(on, {
											label: "单笔最大额",
											content: "此房间允许的最高单笔下注额。修改生效后，对应房间的商户限额重置为总后台范围。"
										})]),
										default: D(() => [d(pn, {
											"input-component": T(t),
											"aria-label": "单笔最大额",
											unit: "USDT",
											"model-value": n.maximum_stake.default_value,
											"onUpdate:modelValue": (e) => T(Ge)(n, "maximum_stake", e)
										}, null, 8, [
											"input-component",
											"model-value",
											"onUpdate:modelValue"
										])]),
										_: 2
									}, 1024)])]),
									_: 2
								}, 1024)
							], 8, On))), 128))]),
							_: 1
						}, 8, ["disabled"])
					], 64)) : o("", !0)]),
					_: 1
				}, 8, [
					"loading",
					"hide-content",
					"min-height"
				]),
				N.value || !e.inline || q.value.dirty ? (y(), s("div", Pn, [
					q.value.dirty ? (y(), a(T(A), {
						key: 0,
						"data-config-discard": !0,
						disabled: M.value || L.value || v.value,
						onClick: Ne
					}, {
						default: D(() => [...i[12] ||= [u("放弃修改并重新加载", -1)]]),
						_: 1
					}, 8, ["disabled"])) : o("", !0),
					N.value ? (y(), a(T(A), {
						key: 1,
						disabled: M.value,
						onClick: Oe
					}, {
						default: D(() => [...i[13] ||= [u("重试", -1)]]),
						_: 1
					}, 8, ["disabled"])) : o("", !0),
					e.inline ? o("", !0) : (y(), a(T(A), {
						key: 2,
						onClick: i[4] ||= (e) => k.value = !1
					}, {
						default: D(() => [...i[14] ||= [u("关闭", -1)]]),
						_: 1
					}))
				])) : o("", !0)
			]),
			_: 1
		}, 40, ["class", "modelValue"])) : o("", !0);
	}
}), [["__scopeId", "data-v-ff28b192"]]), In = { class: "guide-body" }, Ln = { class: "guide-example" }, Rn = { class: "guide-formulas" }, zn = { class: "guide-footer" }, Bn = /*#__PURE__*/ e(/* @__PURE__ */ f({
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
		let t = E(e, "modelValue"), n = [
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
		return (e, i) => (y(), a(T(N), {
			modelValue: t.value,
			"onUpdate:modelValue": i[1] ||= (e) => t.value = e,
			title: "预测网格玩法说明",
			width: "860px",
			class: "prediction-grid-guide mm-ui",
			"append-to-body": "",
			"destroy-on-close": ""
		}, {
			header: D(() => [...i[2] ||= [c("h2", { class: "guide-title" }, "预测网格玩法说明", -1), c("p", { class: "guide-subtitle" }, "用一个例子看懂格子、命中概率和赔率", -1)]]),
			footer: D(() => [c("div", zn, [i[24] ||= c("span", null, "核心规则：有效时间内，连续有效价格进入或穿过对应价格范围一次，即为命中。", -1), d(T(A), {
				type: "primary",
				onClick: i[0] ||= (e) => t.value = !1
			}, {
				default: D(() => [...i[23] ||= [u("我知道了", -1)]]),
				_: 1
			})])]),
			default: D(() => [c("div", In, [
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
					c("article", Ln, [
						i[9] ||= c("h4", null, "举例", -1),
						i[10] ||= c("p", null, "买入格子：BTC 65,010～65,020 · 10:00:04～10:00:06", -1),
						c("p", null, [d(T(B), { type: "success" }, {
							default: D(() => [...i[3] ||= [u("命中", -1)]]),
							_: 1
						}), i[4] ||= u(" 10:00:05 价格到达 65,015，进入了格子价格范围。", -1)]),
						c("p", null, [d(T(B), { type: "success" }, {
							default: D(() => [...i[5] ||= [u("命中", -1)]]),
							_: 1
						}), i[6] ||= u(" 连续有效行情从 65,005 到达 65,025，线段中间穿过了这个格子，也算碰到。", -1)]),
						c("p", null, [d(T(B), { type: "danger" }, {
							default: D(() => [...i[7] ||= [u("未命中", -1)]]),
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
					c("article", Rn, [i[13] ||= c("h4", null, [u("原型计算公式示例 "), c("small", null, "时间单位统一为 500ms")], -1), (y(), s(r, null, re(n, (e) => c("div", { key: e.title }, [
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
function Vn(e, t) {
	let n = e, r = (e) => typeof e == "string" && /^(0|[1-9]\d{0,18})$/.test(e) && gt(e, "9223372036854775807") <= 0;
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
	} : kt({
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
var Hn = {
	class: "grid-config mm-ui",
	"data-grid-config": "platform"
}, Un = { key: 3 }, Wn = {
	key: 5,
	class: "pending-bar"
}, Gn = { class: "pending-actions" }, Kn = { class: "grid-layout" }, qn = { class: "symbol-panel" }, Jn = { class: "panel-heading" }, Yn = {
	key: 1,
	class: "directory-error",
	role: "alert"
}, Xn = { class: "symbol-list" }, Zn = ["disabled", "onClick"], Qn = {
	key: 0,
	class: "symbol-unconfigured"
}, $n = { key: 2 }, er = { class: "config-panel" }, tr = {
	key: 0,
	class: "config-heading"
}, nr = { "data-config-updated-at": "" }, rr = { key: 0 }, ir = { class: "config-heading__actions" }, ar = { class: "grid-config__parameters" }, or = { class: "parameter-card" }, sr = {
	key: 0,
	class: "field-error",
	role: "alert"
}, cr = {
	key: 0,
	class: "layout-notice"
}, lr = {
	key: 0,
	class: "parameter-card",
	"data-price-precision": ""
}, ur = { class: "parameter-card" }, dr = { class: "parameter-card" }, fr = { class: "parameter-heading" }, pr = { class: "parameter-description" }, mr = /*#__PURE__*/ e(/* @__PURE__ */ f({
	__name: "index",
	setup(e, { expose: n }) {
		let { gridConfigSymbols: l, gridConfigCatalog: f, gridConfigCreation: p, gridConfigReceipt: m, gridConfigSite: h, saveGridConfig: g } = me().grid, _ = _e(), v = ge(), ne = (e) => v.perms.includes("*") || v.perms.includes(e), x = i(() => ne("grid_config:read")), S = i(() => ne("grid_config:save")), C = i(() => {
			let e = String(v.userInfo.id || "");
			return /^[1-9]\d*$/.test(e) ? e : "";
		}), E = b([]), O = b(""), j = b(""), M = b(""), N = b(null), P = b(null), L = b(""), R = b("通过预测网格配置页面保存配置"), ce = b(!1), z = b(!1), B = b(!1), V = b(!1), H = b(!1), U = b(""), W = b(""), pe = b("info"), G = b(null), he = b(!1), ye = b(""), be = b(!1), xe = new Kt(), Ce = new Kt(), we = new Kt(), K, q = 0, Te = i(() => x.value ? C.value ? "" : "无法确认当前操作人身份" : "当前账号没有预测网格配置查询权限"), Ee = i(() => E.value.find((e) => e.site_id === O.value)), De = b([]), Oe = b(""), ke = i(() => Ye(Ee.value?.products ?? [], De.value)), Ae = i(() => {
			let e = M.value.trim().toUpperCase();
			return ke.value.filter((t) => !e || t.symbol.includes(e));
		}), je = i(() => N.value?.site_version === "0"), Me = i(() => x.value && S.value && !!C.value && z.value && !Oe.value && !B.value && !G.value && !he.value && !H.value);
		function Ne(e) {
			if (!e || !P.value) return !1;
			if (je.value) return JSON.stringify(e) !== JSON.stringify(P.value) || L.value !== "";
			try {
				return At(e, P.value, !0) || vt(e.target_rtp) !== L.value || [
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
		let Pe = i(() => Ne(N.value)), Fe = i(() => Ne(N.value ? nt(ie(N.value), S.value) : null)), Ie = i(() => G.value ? G.value.operator_id === C.value ? "bound" : "foreign" : "none"), J = i(() => Ie.value === "bound" ? G.value : null), Y = i(() => Ie.value === "foreign"), Le = i(() => Fe.value || !!G.value || H.value), Re = i(() => x.value && S.value && (je.value || !!Ee.value?.can_edit) && !!C.value && !!N.value && !G.value && !he.value && !V.value && !H.value), ze = i(() => Re.value && !!N.value?.layout?.editable), Be = i({
			get: () => {
				let e = P.value?.layout?.price_decimals;
				return e != null && (e <= 8 || Number.isNaN(e)) ? e : void 0;
			},
			set: (e) => {
				!ze.value || !P.value?.layout || (P.value.layout.price_decimals = e ?? null, ut());
			}
		}), Ve = b("");
		ae(Be, (e) => {
			Number.isNaN(e) || (Ve.value = e == null ? "" : String(e));
		}, {
			immediate: !0,
			flush: "sync"
		});
		let He = i({
			get: () => Ve.value,
			set: (e) => {
				ze.value && (Ve.value = e, Be.value = e === "" ? void 0 : /^[0-8]$/.test(e) ? Number(e) : NaN);
			}
		}), Ue = i(() => !!ze.value && !!P.value?.layout && N.value?.layout?.price_band_width !== P.value.layout.price_band_width && wt(P.value.layout.price_band_width)), We = i(() => Re.value && (je.value || !!Ee.value?.can_edit_limits)), Ge = i(() => !!J.value && x.value && S.value && (J.value.command.based_on_site_version === "0" || E.value.some((e) => e.site_id === J.value.command.site_id && e.can_edit && e.products.some((e) => e.symbol === J.value.command.symbol)))), Ke = i(() => Ge.value && z.value && !B.value && !V.value && !H.value && !he.value && !be.value && ye.value === JSON.stringify(J.value));
		function qe(e) {
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
		let Je = i(() => {
			let e = [N.value?.effective_from_ms, N.value?.layout?.effective_from_ms].filter((e) => typeof e == "string" && /^[1-9][0-9]*$/.test(e)).reduce((e, t) => BigInt(e) > BigInt(t) ? e : t, "0");
			return e === "0" ? "未提供" : Se(e);
		});
		function Xe(e) {
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
		function Ze() {
			try {
				let e = Ht(sessionStorage, C.value);
				G.value = e.pending ?? null, he.value = !1;
			} catch {
				he.value = !0, G.value = null;
			}
		}
		function Qe() {
			return `${C.value}:${O.value}:${j.value}`;
		}
		function $e() {
			Ce.close(), N.value = null, P.value = null, L.value = "", R.value = "通过预测网格配置页面保存配置", V.value = !1;
		}
		async function et(e) {
			if (xe.close(), we.close(), ye.value = "", z.value = !1, $e(), E.value = [], De.value = [], Oe.value = "", O.value = "", j.value = "", M.value = "", U.value = "", W.value = "", Ze(), Te.value || he.value) return;
			let t = xe.next(C.value);
			B.value = !0;
			try {
				let [n, r] = await Promise.allSettled([f(t.signal), l(t.signal)]);
				if (!t.current(C.value)) return;
				if (r.status === "fulfilled" && Array.isArray(r.value) && r.value.every((e) => typeof e == "string") ? De.value = r.value : Oe.value = "通用币种目录暂不可用，当前仅显示已授权的网格配置。", n.status === "rejected") throw n.reason;
				E.value = Xe(n.value), z.value = !0;
				let i = J.value ?? (e ? { command: e } : null), a = i && (i.command.based_on_site_version === "0" || E.value.some((e) => e.site_id === i.command.site_id)) ? i.command.site_id : E.value[0]?.site_id || "";
				O.value = a;
				let o = E.value.find((e) => e.site_id === a), s = i && i.command.site_id === a && (i.command.based_on_site_version === "0" || o?.products.some((e) => e.symbol === i.command.symbol)) ? i.command.symbol : ke.value.find((e) => e.configured)?.symbol || "";
				j.value = s, s && o?.products.some((e) => e.symbol === s) && (K = ot());
			} catch (e) {
				t.current(C.value) && (U.value = qe(e));
			} finally {
				t.current(C.value) && (B.value = !1);
			}
		}
		function tt(e) {
			Le.value || ($e(), O.value = e, j.value = ke.value.find((e) => e.configured)?.symbol || "", j.value && (K = ot()));
		}
		function rt(e) {
			if (e === j.value && (N.value || V.value) || Le.value) return;
			let t = ke.value.find((t) => t.symbol === e);
			!t || !t.configured && !Me.value || ($e(), U.value = "", j.value = e, K = t.configured ? ot() : it());
		}
		async function it() {
			if ($e(), !Me.value || !j.value) return;
			let e = j.value, t = Ce.next(Qe());
			V.value = !0;
			try {
				let n = await p(e, t.signal);
				if (!t.current(Qe()) || !S.value) return;
				let r = Vn(n, e);
				N.value = r, P.value = nt(r, S.value), V.value = !1, O.value = r.site_id;
			} catch (e) {
				t.current(Qe()) && (U.value = qe(e));
			} finally {
				t.current(Qe()) && (V.value = !1);
			}
		}
		function at() {
			!je.value || G.value || H.value || ($e(), j.value = "", W.value = "");
		}
		async function ot() {
			if ($e(), !x.value || !O.value || !j.value) return;
			let e = O.value, t = j.value, n = Qe(), r = Ce.next(n);
			V.value = !0;
			try {
				let n = await h(e, t, r.signal);
				if (!r.current(Qe())) return;
				let i = Mt(n, e, t);
				N.value = i, P.value = nt(i, S.value), L.value = vt(i.target_rtp);
			} catch (e) {
				r.current(Qe()) && (U.value = qe(e));
			} finally {
				r.current(Qe()) && (V.value = !1);
			}
		}
		function st(e) {
			return e.symbol === j.value && P.value ? P.value.enabled : e.enabled;
		}
		function ct(e) {
			return !Ee.value?.products.some((t) => t.symbol === e.symbol) || !S.value || !Ee.value?.can_edit || V.value || H.value || !!G.value || he.value || Fe.value && e.symbol !== j.value;
		}
		async function lt(e, t) {
			typeof t != "boolean" || ct(e) || (e.symbol !== j.value && (rt(e.symbol), await K), P.value && P.value.symbol === e.symbol && !ct(e) && (P.value.enabled = t, ut()));
		}
		function ut() {
			W.value = "";
		}
		async function dt() {
			if (!Re.value || !N.value || !P.value || !C.value) return;
			let e;
			try {
				e = Nt(N.value, {
					...P.value,
					target_rtp: yt(L.value)
				}, R.value, bt(), je.value || !!Ee.value?.can_edit_limits, !0);
			} catch (e) {
				pe.value = "warning", W.value = qe(e);
				return;
			}
			let t = Bt(C.value, e), n = ht(), r = "price_band_width" in e.changes || "column_duration_seconds" in e.changes || "price_decimals" in e.changes, i = je.value ? " 首次创建后保持关闭。" : r ? ` 公共网格区间修改将影响站点：${N.value.layout.affected_site_ids.join("、")}。` : "";
			try {
				await le.confirm(`确认保存 ${e.site_id} / ${e.symbol} 的 ${Object.keys(e.changes).length} 项修改？${i}`, "确认预测网格配置", {
					type: "warning",
					confirmButtonText: "确认保存",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			}
			if (Ze(), !Re.value || !N.value || !P.value || n !== ht()) {
				pe.value = "warning", W.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let a;
			try {
				a = Nt(N.value, {
					...P.value,
					target_rtp: yt(L.value)
				}, R.value, t.command.client_request_id, je.value || !!Ee.value?.can_edit_limits, !0);
			} catch {
				pe.value = "warning", W.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let o;
			try {
				o = Vt(sessionStorage, t, C.value, a), Ze();
			} catch (e) {
				if (e?.message === "STALE_CONFIRMATION") {
					pe.value = "warning", W.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
					return;
				}
				he.value = !0;
				return;
			}
			pt(o, "save");
		}
		async function ft() {
			Ze(), !(!J.value || !Ge.value || H.value || be.value) && pt(J.value, "receipt");
		}
		async function X() {
			if (Ze(), !Ke.value || !J.value) return;
			let e = J.value;
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
			if (Ze(), !Ke.value || JSON.stringify(e) !== JSON.stringify(J.value)) {
				pe.value = "warning", W.value = "确认期间账号、权限或原请求已变化，本次恢复已取消，请重新查询原操作回执";
				return;
			}
			await pt(e, "recover");
		}
		async function pt(e, t) {
			let n = ++q, r = Qe(), i = we.next(r);
			H.value = !0, ye.value = "", W.value = "";
			try {
				let n = await Gt(sessionStorage, e, t, (e, t) => e === "save" ? g(t) : m(t));
				if (!i.current(Qe())) return;
				if (Ze(), n.status === "success") {
					let e = C.value;
					R.value = "通过预测网格配置页面保存配置", H.value = !1, await et(), e === C.value && (pe.value = "warning", W.value = U.value ? "配置已保存；最新配置刷新失败，请手动刷新" : "");
				} else if (t === "recover" && n.status === "rejected" && n.error?.error_code === "VERSION_CONFLICT") if (!n.journalCleared || G.value || he.value) pe.value = "warning", W.value = "旧请求已明确拒绝，但本机待确认记录已变化，请重新核对当前记录";
				else {
					let t = C.value;
					if (await et(e.command), O.value && j.value && K && await K, t === C.value) {
						pe.value = "warning";
						let t = O.value === e.command.site_id && j.value === e.command.symbol && E.value.some((t) => t.site_id === e.command.site_id && t.products.some((t) => t.symbol === e.command.symbol));
						W.value = "旧请求未生效，配置版本已变化；已清除旧待确认记录。" + (t ? U.value || !N.value ? "最新配置刷新失败，请手动刷新" : "请以当前配置为准" : `原目标当前不可见（${e.command.site_id} / ${e.command.symbol}），请核对权限和配置`);
					}
				}
				else pe.value = n.status === "unknown" ? "warning" : "info", t === "receipt" && Wt(n.error) && JSON.stringify(J.value) === JSON.stringify(e) ? (ye.value = JSON.stringify(e), W.value = "未找到原操作回执，可使用原编号和原参数恢复请求") : t === "recover" ? W.value = "恢复尚未确认，原请求已保留，请重新查询原操作回执 · " + qe(n.error) : W.value = n.status === "unknown" ? "原操作结果仍待确认，请使用原请求查询回执" : "保存已明确拒绝，可修正后重新提交 · " + qe(n.error);
			} catch (e) {
				i.current(Qe()) && (Ze(), pe.value = "warning", W.value = "原操作结果仍待确认 · " + qe(e));
			} finally {
				n === q && (H.value = !1, Ze());
			}
		}
		async function mt() {
			if (!Le.value) return !0;
			try {
				return await le.confirm("当前有未保存修改或待确认操作，离开不会删除原记录。仍要离开吗？", "离开预测网格配置", { type: "warning" }), !0;
			} catch {
				return !1;
			}
		}
		function ht() {
			return JSON.stringify({
				operator: C.value,
				site: O.value,
				symbol: j.value,
				snapshot: N.value,
				draft: P.value,
				rtp: L.value,
				reason: R.value
			});
		}
		async function gt() {
			if (!H.value) {
				if (Fe.value) {
					let e = ht();
					try {
						await le.confirm("刷新会丢弃当前未保存修改，仍要刷新吗？", "刷新预测网格配置", { type: "warning" });
					} catch {
						return;
					}
					if (H.value || e !== ht()) {
						pe.value = "warning", W.value = "确认期间编辑状态已变化，本次刷新已取消";
						return;
					}
				}
				await et();
			}
		}
		function _t(e) {
			Le.value && (e.preventDefault(), e.returnValue = "");
		}
		return ae(() => [
			C.value,
			x.value,
			S.value
		], () => et(), { immediate: !0 }), ve(mt), window.addEventListener("beforeunload", _t), te(() => {
			ye.value = "", z.value = !1, xe.close(), Ce.close(), we.close(), window.removeEventListener("beforeunload", _t);
		}), n({
			hasBlockingWork: Le,
			confirmLeave: mt,
			refresh: gt,
			loading: B
		}), (e, n) => (y(), s("section", Hn, [
			Te.value ? (y(), a(T(oe), {
				key: 0,
				title: Te.value,
				type: "warning",
				closable: !1
			}, null, 8, ["title"])) : he.value ? (y(), a(T(oe), {
				key: 1,
				title: "本机保存的待确认操作记录已损坏或不可用，请停止操作并联系管理员核验",
				type: "error",
				closable: !1
			})) : Y.value ? (y(), a(T(oe), {
				key: 2,
				title: "检测到其他账号尚未确认的预测网格配置操作，当前账号不可覆盖，请切回原账号查询回执",
				type: "error",
				closable: !1
			})) : o("", !0),
			U.value ? (y(), s("div", Un, [d(T(oe), {
				title: U.value,
				type: "error",
				closable: !1
			}, null, 8, ["title"]), d(T(A), {
				loading: B.value || V.value,
				disabled: H.value || !!G.value,
				onClick: gt
			}, {
				default: D(() => [...n[16] ||= [u("重试", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"])])) : o("", !0),
			W.value ? (y(), a(T(oe), {
				key: 4,
				title: W.value,
				type: pe.value,
				closable: !1
			}, null, 8, ["title", "type"])) : o("", !0),
			J.value ? (y(), s("div", Wn, [c("div", null, [n[17] ||= c("strong", null, "原配置操作结果待确认", -1), c("small", null, w(J.value.command.site_id) + " · " + w(J.value.command.symbol) + " · " + w(J.value.command.client_request_id), 1)]), c("div", Gn, [d(T(A), {
				type: "warning",
				loading: H.value,
				disabled: !Ge.value || be.value,
				onClick: ft
			}, {
				default: D(() => [...n[18] ||= [u("查询原操作回执", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"]), Ke.value || be.value ? (y(), a(T(A), {
				key: 0,
				type: "warning",
				disabled: !Ke.value,
				onClick: X
			}, {
				default: D(() => [...n[19] ||= [u("恢复原请求", -1)]]),
				_: 1
			}, 8, ["disabled"])) : o("", !0)])])) : o("", !0),
			d(nn, {
				loading: B.value,
				"hide-content": B.value,
				"min-height": "0px",
				class: "grid-loading-workspace"
			}, {
				default: D(() => [c("div", Kn, [c("aside", qn, [
					c("div", Jn, [n[20] ||= c("strong", null, "币种配置", -1), c("span", null, w(Ae.value.length) + " 条", 1)]),
					E.value.length > 1 ? (y(), a(T(de), {
						key: 0,
						modelValue: O.value,
						"onUpdate:modelValue": n[0] ||= (e) => O.value = e,
						"aria-label": "选择站点",
						disabled: Le.value,
						onChange: tt
					}, {
						default: D(() => [(y(!0), s(r, null, re(E.value, (e) => (y(), a(T(ue), {
							key: e.site_id,
							label: e.site_id,
							value: e.site_id
						}, null, 8, ["label", "value"]))), 128))]),
						_: 1
					}, 8, ["modelValue", "disabled"])) : o("", !0),
					Oe.value ? (y(), s("p", Yn, [u(w(Oe.value), 1), d(T(A), {
						link: "",
						type: "primary",
						disabled: Le.value,
						onClick: gt
					}, {
						default: D(() => [...n[21] ||= [u("重试", -1)]]),
						_: 1
					}, 8, ["disabled"])])) : o("", !0),
					d(T(t), {
						modelValue: M.value,
						"onUpdate:modelValue": n[1] ||= (e) => M.value = e,
						clearable: "",
						placeholder: "搜索交易对",
						"aria-label": "搜索交易对"
					}, null, 8, ["modelValue"]),
					c("div", Xn, [(y(!0), s(r, null, re(Ae.value, (e) => (y(), s("div", {
						key: e.symbol,
						class: ee(["symbol-row", { active: e.symbol === j.value }])
					}, [
						c("button", {
							type: "button",
							class: "symbol-button",
							disabled: !e.configured && !Me.value || Le.value && e.symbol !== j.value,
							onClick: (t) => rt(e.symbol)
						}, [d(T(_), { symbol: e.symbol }, null, 8, ["symbol"])], 8, Zn),
						e.configured ? (y(), a(T(fe), {
							key: 1,
							"model-value": st(e),
							disabled: ct(e),
							"aria-label": `${e.symbol} 开放配置`,
							onChange: (t) => lt(e, t)
						}, null, 8, [
							"model-value",
							"disabled",
							"aria-label",
							"onChange"
						])) : (y(), s("span", Qn, "未配置")),
						e.symbol === j.value && Pe.value ? (y(), s("small", $n, "未保存")) : o("", !0)
					], 2))), 128)), !B.value && Ee.value && !Ae.value.length ? (y(), a(T(F), {
						key: 0,
						description: "当前站点没有已授权的预测网格产品",
						"image-size": 56
					})) : o("", !0)])
				]), c("main", er, [N.value && P.value ? (y(), s("header", tr, [c("div", null, [
					c("h2", null, w(N.value.symbol) + " · 预测网格", 1),
					c("p", nr, "更新时间 " + w(Je.value), 1),
					je.value || E.value.length > 1 ? (y(), s("p", rr, "当前站点：" + w(N.value.site_id), 1)) : o("", !0)
				]), c("div", ir, [
					je.value ? (y(), a(T(A), {
						key: 0,
						disabled: !!G.value || H.value,
						onClick: at
					}, {
						default: D(() => [...n[22] ||= [u("取消新增", -1)]]),
						_: 1
					}, 8, ["disabled"])) : o("", !0),
					d(T(A), { onClick: n[2] ||= (e) => ce.value = !0 }, {
						default: D(() => [...n[23] ||= [u("玩法说明", -1)]]),
						_: 1
					}),
					S.value ? (y(), a(T(A), {
						key: 1,
						type: "primary",
						loading: H.value,
						disabled: !Re.value || !Pe.value || Ue.value,
						onClick: dt
					}, {
						default: D(() => [...n[24] ||= [u("保存配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])) : o("", !0)
				])])) : o("", !0), d(nn, {
					loading: V.value && !B.value,
					"hide-content": V.value && !N.value,
					"min-height": "0px",
					class: "grid-config__detail"
				}, {
					default: D(() => [!B.value && !V.value && !N.value && !j.value && !U.value ? (y(), a(T(F), {
						key: 0,
						description: Me.value ? "请选择币种填写配置，首次保存后保持关闭" : "当前账号暂无已配置的产品"
					}, null, 8, ["description"])) : !B.value && !V.value && !U.value && Ee.value && !j.value ? (y(), a(T(F), {
						key: 1,
						description: "请选择交易对查看配置"
					})) : N.value && P.value ? (y(), s(r, { key: 2 }, [je.value ? (y(), a(T(oe), {
						key: 0,
						title: "请填写参数后保存，首次保存后保持关闭；确认配置后再单独开启。",
						type: "info",
						closable: !1
					})) : o("", !0), c("div", ar, [
						c("article", or, [n[29] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "网格区间配置"), c("p", { class: "parameter-description" }, "网格区间由平台按币种统一设置，修改后自动用于该币种下的商户交易。")], -1), P.value.layout ? (y(), s(r, { key: 0 }, [d(T(se), {
							"label-position": "top",
							class: "fields limit-fields",
							onSubmit: n[5] ||= k(() => {}, ["prevent"])
						}, {
							default: D(() => [d(T(I), { label: "纵向格子区间（USDT）" }, {
								label: D(() => [n[25] ||= u("纵向格子区间（USDT）", -1), d(on, {
									label: "纵向格子区间",
									content: "每个格子覆盖的价格区间宽度，最多保留 8 位小数。数值越大，每格覆盖的价格范围越宽；保存时会根据最新标记价检查安全范围。"
								})]),
								default: D(() => [d(pn, {
									"input-component": T(t),
									modelValue: P.value.layout.price_band_width,
									"onUpdate:modelValue": n[3] ||= (e) => P.value.layout.price_band_width = e,
									disabled: !ze.value,
									inputmode: "decimal",
									"aria-label": "纵向格子区间",
									onInput: ut
								}, {
									append: D(() => [...n[26] ||= [u("USDT", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								]), Ue.value ? (y(), s("small", sr, "精度不规范，最多保留 8 位小数")) : o("", !0)]),
								_: 1
							}), d(T(I), { label: "横向格子区间（秒）" }, {
								label: D(() => [n[27] ||= u("横向格子区间（秒）", -1), d(on, {
									label: "横向格子区间",
									content: "每列格子覆盖的时间长度，可填 1 至 10 秒整数；全部列连同起始等待时间不能超过 120 秒。"
								})]),
								default: D(() => [d(pn, {
									"input-component": T(t),
									modelValue: P.value.layout.column_duration_seconds,
									"onUpdate:modelValue": n[4] ||= (e) => P.value.layout.column_duration_seconds = e,
									disabled: !ze.value,
									inputmode: "numeric",
									min: "1",
									max: "10",
									step: "1",
									"aria-label": "横向格子区间",
									onInput: ut
								}, {
									append: D(() => [...n[28] ||= [u("秒", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								])]),
								_: 1
							})]),
							_: 1
						}), N.value.layout?.editable ? o("", !0) : (y(), s("p", cr, w(je.value ? "该币种已有公共网格区间，首次创建将直接沿用。" : "当前账号无法修改该币种全部受影响站点的公共网格区间，仅可查看。"), 1))], 64)) : (y(), a(T(oe), {
							key: 1,
							title: "当前接口未返回网格区间，请刷新后重试；暂不支持编辑网格区间。",
							type: "info",
							closable: !1
						}))]),
						P.value.layout ? (y(), s("article", lr, [
							n[30] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "价格精度"), c("p", { class: "parameter-description" }, "由平台按币种统一设置，保存后用于后续新订单。")], -1),
							d(T(se), {
								"label-position": "top",
								class: "fields odds-fields",
								onSubmit: n[7] ||= k(() => {}, ["prevent"])
							}, {
								default: D(() => [d(T(I), { label: "价格小数位" }, {
									default: D(() => [d(pn, {
										"input-component": T(t),
										modelValue: He.value,
										"onUpdate:modelValue": n[6] ||= (e) => He.value = e,
										min: "0",
										max: "8",
										step: "1",
										unit: "位",
										inputmode: "numeric",
										"aria-label": "价格小数位",
										disabled: !ze.value,
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
						c("article", ur, [n[41] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "赔率配置"), c("p", { class: "parameter-description" }, "命中概率由标记价、实时波动率及格子的价格和时间边界计算；格子赔率 = 目标返奖率 ÷ 命中概率")], -1), d(T(se), {
							"label-position": "top",
							class: "fields odds-fields",
							onSubmit: n[11] ||= k(() => {}, ["prevent"])
						}, {
							default: D(() => [
								d(T(I), { label: "目标返奖率" }, {
									label: D(() => [n[32] ||= u("目标返奖率", -1), d(on, {
										label: "目标返奖率",
										content: "例如 97%：命中概率为 20% 时，计算赔率为 4.85x。"
									})]),
									default: D(() => [d(pn, {
										"input-component": T(t),
										modelValue: L.value,
										"onUpdate:modelValue": n[8] ||= (e) => L.value = e,
										disabled: !Re.value,
										inputmode: "decimal",
										"aria-label": "目标返奖率",
										onInput: ut
									}, {
										append: D(() => [...n[33] ||= [u("%", -1)]]),
										_: 1
									}, 8, [
										"input-component",
										"modelValue",
										"disabled"
									]), n[34] ||= c("small", null, "例如 97%：命中概率为 20% 时，计算赔率为 4.85x", -1)]),
									_: 1
								}),
								d(T(I), { label: "最低赔率" }, {
									label: D(() => [n[35] ||= u("最低赔率", -1), d(on, {
										label: "最低赔率",
										content: "当前币种报价允许的最低倍率。"
									})]),
									default: D(() => [d(pn, {
										"input-component": T(t),
										modelValue: P.value.min_multiplier,
										"onUpdate:modelValue": n[9] ||= (e) => P.value.min_multiplier = e,
										step: "0.01",
										disabled: !We.value,
										inputmode: "decimal",
										"aria-label": "最低赔率",
										onInput: ut
									}, {
										append: D(() => [...n[36] ||= [u("x", -1)]]),
										_: 1
									}, 8, [
										"input-component",
										"modelValue",
										"disabled"
									]), n[37] ||= c("small", null, "计算赔率不会低于此值", -1)]),
									_: 1
								}),
								d(T(I), { label: "最高赔率" }, {
									label: D(() => [n[38] ||= u("最高赔率", -1), d(on, {
										label: "最高赔率",
										content: "当前币种报价允许的最高倍率。原型中超过此值的格子不可下注，不强制压低赔率；实际是否可下注以当前格子报价为准。"
									})]),
									default: D(() => [d(pn, {
										"input-component": T(t),
										modelValue: P.value.max_multiplier,
										"onUpdate:modelValue": n[10] ||= (e) => P.value.max_multiplier = e,
										step: "0.01",
										disabled: !We.value,
										inputmode: "decimal",
										"aria-label": "最高赔率",
										onInput: ut
									}, {
										append: D(() => [...n[39] ||= [u("x", -1)]]),
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
						c("article", dr, [c("header", fr, [n[42] ||= c("h3", null, "下注限制", -1), c("p", pr, w(N.value.symbol) + " 每个格子生成一笔独立订单，限制作用于该币种全部网格订单", 1)]), d(T(se), {
							"label-position": "top",
							class: "fields limit-fields",
							onSubmit: n[14] ||= k(() => {}, ["prevent"])
						}, {
							default: D(() => [d(T(I), { label: "单笔最小额（USDT）" }, {
								label: D(() => [n[43] ||= u("单笔最小额（USDT）", -1), d(on, { label: "单笔最小额" })]),
								default: D(() => [d(pn, {
									"input-component": T(t),
									modelValue: P.value.min_order_amount,
									"onUpdate:modelValue": n[12] ||= (e) => P.value.min_order_amount = e,
									disabled: !Re.value,
									inputmode: "decimal",
									"aria-label": "单笔最小额",
									onInput: ut
								}, {
									append: D(() => [...n[44] ||= [u("USDT", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								])]),
								_: 1
							}), d(T(I), { label: "单笔最大额（USDT）" }, {
								label: D(() => [n[45] ||= u("单笔最大额（USDT）", -1), d(on, { label: "单笔最大额" })]),
								default: D(() => [d(pn, {
									"input-component": T(t),
									modelValue: P.value.max_order_amount,
									"onUpdate:modelValue": n[13] ||= (e) => P.value.max_order_amount = e,
									disabled: !Re.value,
									inputmode: "decimal",
									"aria-label": "单笔最大额",
									onInput: ut
								}, {
									append: D(() => [...n[46] ||= [u("USDT", -1)]]),
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
						S.value ? o("", !0) : (y(), a(T(oe), {
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
			d(Bn, {
				modelValue: ce.value,
				"onUpdate:modelValue": n[15] ||= (e) => ce.value = e
			}, null, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-d23eeae9"]]), hr = { class: "prediction-page prediction-table-page mm-ui" }, gr = { class: "prediction-page__header" }, _r = {
	class: "game-tabs",
	role: "group",
	"aria-label": "选择预测玩法"
}, vr = {
	class: "game-choice-icon",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	"aria-hidden": "true"
}, yr = { class: "game-choice-content" }, br = { key: 0 }, xr = {
	key: 1,
	class: "catalog-error"
}, Sr = { class: "prediction-page__workspace" }, Cr = { class: "symbol-panel__heading" }, wr = { class: "symbol-panel__list" }, Tr = [
	"aria-pressed",
	"data-config-symbol",
	"disabled",
	"onClick"
], Er = { class: "symbol-choice__top" }, Dr = ["title"], Or = {
	key: 1,
	class: "symbol-row__draft"
}, kr = { class: "config-content" }, Ar = {
	key: 0,
	class: "config-content__heading"
}, jr = { class: "config-game-label" }, Mr = { "data-config-updated-at": "" }, Nr = {
	key: 0,
	class: "config-heading-actions"
}, Pr = ["title", "aria-label"], Fr = /*#__PURE__*/ e(/* @__PURE__ */ f({
	__name: "index",
	setup(e) {
		let { predictionConfigurationList: n } = me().api, { symbols: l } = me().api, f = _e(), p = ge(), m = b(""), h = b(!1), _ = b([]), ne = b("UP_DOWN"), x = b("UP_DOWN"), S = C(), ie = [
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
		], E = b(""), O = i(() => et(p.perms, "prediction_config:lists")), k = b(""), j = C(), M = i(() => j.value?.editingState), N = i(() => {
			let e = M.value;
			return !e || e.target !== E.value || e.actor !== String(p.userInfo.id || "") || !O.value || !et(p.perms, "prediction_config:edit") || e.saving ? null : e.pending ? {
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
		}), P = 0, se = (e) => E.value === e.row_key && M.value?.target === e.row_key ? M.value.enabled ?? e.enabled : e.enabled;
		function I(e) {
			return et(p.perms, "prediction_config:edit") ? M.value?.pending ? "请先核验待确认的操作" : h.value || M.value?.loading ? "正在加载配置" : E.value !== e.row_key && M.value?.dirty ? "请先处理当前未保存修改" : E.value === e.row_key && !M.value?.ready ? "请重新加载当前配置" : "修改后需保存配置" : "没有配置修改权限";
		}
		function L(e) {
			let t = M.value;
			return !O.value || !et(p.perms, "prediction_config:edit") || !e.editable || h.value || !t || t.loading || t.pending || (E.value === e.row_key ? !t.ready || t.target !== e.row_key : t.dirty);
		}
		async function R(e, t) {
			if (typeof t != "boolean" || L(e)) return;
			let n = String(p.userInfo.id || ""), r = M.value?.generation;
			if (E.value !== e.row_key) {
				let t = await Oe(e);
				if (await g(), !t || t.selection !== P) return;
				r = t.detail;
			}
			r === void 0 || E.value !== e.row_key || L(e) || j.value?.setEnabled(e.row_key, r, n, t);
		}
		let le = (e) => e === "GAME_TYPE_UP_DOWN" ? "UP_DOWN" : e === "GAME_TYPE_HIGH_LOW" ? "HIGH_LOW" : null, ue = (e) => e === "UP_DOWN" ? "涨跌预测" : e === "HIGH_LOW" ? "自选预测" : "--", z = Se, de = i(() => _.value.map((e, t) => {
			let n = e.rules[0], r = le(n?.game_type) || ne.value || null, i = n?.symbol || "";
			return {
				row_key: r && i ? `${r}:${i}` : `empty:${t}`,
				configuration: e,
				game_type: r,
				symbol: i,
				enabled: qe(e),
				configured: e.rules.length > 0,
				editable: !!(r && i && e.rules.length > 0),
				rule_count: e.rules.length,
				template_version: e.template_version,
				effective_version: e.effective_version,
				updated_at: z(e.updated_at_ms)
			};
		}).sort((e, t) => e.game_type === t.game_type ? e.symbol.localeCompare(t.symbol) : (e.game_type || "").localeCompare(t.game_type || "")));
		function V(e) {
			let t = e.row_key === M.value?.target && M.value?.ready ? M.value.roomDurations : e.configuration ? Je(e.configuration) : void 0;
			return t ? t.map((t) => Ce(t, e.game_type || void 0)).join(" · ") || "暂无房间" : e.directory_label;
		}
		let H = b([]), U = b(!1), W = b(""), pe = (e) => e.trim().toUpperCase(), G = 0, he;
		async function ve() {
			if (!O.value) return;
			he?.abort(), he = new AbortController();
			let e = ++G;
			U.value = !0, W.value = "";
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
					let r = pe(t.symbol);
					n.has(r) || n.set(r, {
						symbol: r,
						base_asset: typeof t.base_asset == "string" ? t.base_asset : "",
						quote_asset: typeof t.quote_asset == "string" ? t.quote_asset : ""
					});
				}
				H.value = [...n.values()];
			} catch (t) {
				e === G && (W.value = we(t));
			} finally {
				e === G && (U.value = !1);
			}
		}
		let ye = i(() => {
			let e = [...de.value], t = new Set(e.filter((e) => e.game_type === ne.value).map((e) => pe(e.symbol)));
			for (let n of H.value) t.has(n.symbol) || e.push({
				row_key: `${ne.value}:${n.symbol}`,
				configuration: null,
				game_type: ne.value,
				symbol: n.symbol,
				enabled: !1,
				configured: !1,
				editable: et(p.perms, "prediction_config:edit") && !W.value,
				rule_count: 0,
				template_version: "未配置",
				effective_version: "未配置",
				updated_at: "未提供",
				directory_label: [n.base_asset, n.quote_asset].filter(Boolean).join(" / ") || "点击填写配置"
			});
			return Xe(e, H.value.map((e) => e.symbol));
		}), be = i(() => {
			let e = k.value.trim().toUpperCase();
			return ye.value.filter((t) => (!ne.value || t.game_type === ne.value) && (!e || t.symbol.includes(e)));
		}), xe = i(() => ye.value.find((e) => e.row_key === E.value)), K = i(() => (h.value || U.value) && !xe.value), q = 0, Te, Ee = async () => {
			if (!et(p.perms, "prediction_config:lists")) {
				m.value = "没有玩法配置查询权限";
				return;
			}
			m.value = "", Te?.abort(), Te = new AbortController();
			let e = ++q, t = String(p.userInfo.id || "");
			h.value = !0;
			try {
				let r = await n({ game_type: ne.value || void 0 }, Te.signal);
				if (e !== q || t !== String(p.userInfo.id || "") || !O.value) return;
				if (!Array.isArray(r.configurations)) throw Error("配置列表格式异常，请重新加载");
				if (_.value = r.configurations, !ye.value.some((e) => e.row_key === E.value && e.editable)) {
					let e = ye.value.find((e) => e.configured && e.editable && e.game_type === ne.value);
					e ? await Oe(e, !0) : E.value = "";
				}
			} catch (t) {
				e === q && (m.value = we(t), _.value = []);
			} finally {
				e === q && (h.value = !1);
			}
		}, De = async (e) => {
			if (x.value !== e && !(x.value === "GRID" && S.value && !await S.value.confirmLeave())) {
				if (x.value !== "GRID" && (M.value?.dirty || M.value?.pending)) {
					ce.warning("请先处理当前未保存修改或待确认操作");
					return;
				}
				if (P++, x.value = e, e === "GRID") {
					E.value = "";
					return;
				}
				ne.value = e, E.value = "", k.value = "", _.value = [], Ee(), H.value.length || ve();
			}
		}, Oe = async (e, t = !1) => {
			if (M.value?.saving) {
				ce.warning("请先处理当前未保存修改或待确认操作");
				return;
			}
			let n = String(p.userInfo.id || ""), r = ++P;
			if (!(!O.value || !e.editable || h.value && !t || m.value || !e.game_type || !e.symbol || E.value === e.row_key) && (E.value = e.row_key, await g(), !(r !== P || E.value !== e.row_key || n !== String(p.userInfo.id || "") || !O.value))) return {
				selection: r,
				detail: await j.value?.open(e.game_type, e.symbol, t ? e.configuration ?? void 0 : void 0, !e.configured)
			};
		}, ke = () => {
			if (x.value === "GRID") {
				S.value?.refresh();
				return;
			}
			P++, Ee(), ve();
		};
		return ae(() => [
			p.userInfo.id,
			O.value,
			et(p.perms, "prediction_config:edit")
		], () => {
			P++, q++, Te?.abort(), h.value = !1;
		}, { flush: "sync" }), v(ke), te(() => {
			P++, q++, Te?.abort(), G++, he?.abort();
		}), (e, n) => (y(), s("section", hr, [
			c("header", gr, [c("div", _r, [(y(), s(r, null, re(ie, (e) => d(T(A), {
				key: e.value,
				type: x.value === e.value ? "primary" : void 0,
				"aria-pressed": x.value === e.value,
				"aria-label": e.label,
				onClick: (t) => De(e.value)
			}, {
				default: D(() => [(y(), s("svg", vr, [e.value === "UP_DOWN" ? (y(), s(r, { key: 0 }, [n[2] ||= c("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}, null, -1), n[3] ||= c("path", { d: "m16 12-4-4-4 4M12 16V8" }, null, -1)], 64)) : e.value === "HIGH_LOW" ? (y(), s(r, { key: 1 }, [n[4] ||= c("path", { d: "m9 9 5 12 1.8-5.2L21 14Z" }, null, -1), n[5] ||= c("path", { d: "M7.2 2.2 8 5.1M5.1 8l-2.9-.8M14 4.1 12 6M6 12l-1.9 2" }, null, -1)], 64)) : (y(), s(r, { key: 2 }, [n[6] ||= c("rect", {
					x: "3",
					y: "3",
					width: "18",
					height: "18",
					rx: "2"
				}, null, -1), n[7] ||= c("path", { d: "M9 3v18M15 3v18M3 9h18M3 15h18" }, null, -1)], 64))])), c("span", yr, [c("strong", null, w(e.label), 1), c("small", null, w(e.description), 1)])]),
				_: 2
			}, 1032, [
				"type",
				"aria-pressed",
				"aria-label",
				"onClick"
			])), 64))])]),
			x.value !== "GRID" && m.value ? (y(), s("div", br, [d(T(oe), {
				title: m.value,
				type: "error",
				closable: !1
			}, null, 8, ["title"]), d(T(A), {
				loading: h.value,
				onClick: ke
			}, {
				default: D(() => [...n[8] ||= [u("重试", -1)]]),
				_: 1
			}, 8, ["loading"])])) : o("", !0),
			x.value !== "GRID" && W.value ? (y(), s("div", xr, [d(T(oe), {
				title: `币种目录加载失败：${W.value}`,
				type: "warning",
				closable: !1
			}, null, 8, ["title"]), d(T(A), {
				"aria-label": "重试币种目录",
				loading: U.value,
				onClick: ve
			}, {
				default: D(() => [...n[9] ||= [u("重试币种目录", -1)]]),
				_: 1
			}, 8, ["loading"])])) : o("", !0),
			x.value !== "GRID" && O.value ? (y(), a(nn, {
				key: 2,
				class: "prediction-page__loading-workspace",
				loading: K.value,
				"hide-content": K.value,
				"min-height": "0px"
			}, {
				default: D(() => [c("div", Sr, [d(nn, {
					as: "aside",
					loading: (h.value || U.value) && !K.value,
					"min-height": "0px",
					class: "symbol-panel",
					"aria-label": "交易对配置列表"
				}, {
					default: D(() => [
						c("div", Cr, [n[10] ||= c("strong", null, "币种配置", -1), c("span", null, w(be.value.length) + " 条", 1)]),
						d(T(t), {
							modelValue: k.value,
							"onUpdate:modelValue": n[0] ||= (e) => k.value = e,
							clearable: "",
							placeholder: "搜索交易对",
							"aria-label": "搜索交易对"
						}, null, 8, ["modelValue"]),
						c("div", wr, [(y(!0), s(r, null, re(be.value, (e) => (y(), s("div", {
							key: e.row_key,
							class: ee(["symbol-row", { "is-active": E.value === e.row_key }])
						}, [
							c("button", {
								type: "button",
								class: "symbol-choice",
								"aria-pressed": E.value === e.row_key,
								"data-config-symbol": e.symbol,
								disabled: !e.editable || h.value || !!m.value,
								onClick: (t) => Oe(e)
							}, [c("span", Er, [d(T(f), { symbol: e.symbol }, null, 8, ["symbol"]), e.configured ? o("", !0) : (y(), a(T(B), {
								key: 0,
								size: "small",
								type: "info"
							}, {
								default: D(() => [...n[11] ||= [u("待首次配置", -1)]]),
								_: 1
							}))]), c("span", {
								class: "symbol-choice__periods",
								title: V(e)
							}, w(V(e)), 9, Dr)], 8, Tr),
							e.configured ? (y(), a(T(fe), {
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
							E.value === e.row_key && M.value?.dirty ? (y(), s("span", Or, "未保存")) : o("", !0)
						], 2))), 128)), !h.value && !U.value && !m.value && !W.value && !be.value.length ? (y(), a(T(F), {
							key: 0,
							description: "暂无符合条件的交易对",
							"image-size": 56
						})) : o("", !0)])
					]),
					_: 1
				}, 8, ["loading"]), c("main", kr, [xe.value ? (y(), s("div", Ar, [c("div", null, [c("h2", null, [u(w(xe.value.symbol) + " ", 1), c("span", jr, " · " + w(ue(xe.value.game_type)), 1)]), c("p", Mr, "更新时间 " + w(xe.value.updated_at), 1)]), T(et)(T(p).perms, "prediction_config:edit") ? (y(), s("div", Nr, [N.value ? (y(), s("span", {
					key: 0,
					"data-config-save-feedback": "",
					class: ee(["config-save-feedback", `config-save-feedback--${N.value.tone}`]),
					role: "status",
					title: N.value.detail || void 0,
					"aria-label": N.value.detail ? `${N.value.text}：${N.value.detail}` : void 0
				}, w(N.value.text), 11, Pr)) : o("", !0), d(T(A), {
					type: "primary",
					loading: M.value?.saving,
					disabled: !M.value || M.value.saving || !M.value.pending && !M.value.ready,
					onClick: n[1] ||= (e) => j.value?.saveConfig()
				}, {
					default: D(() => [u(w(M.value?.pending ? "核验原操作" : "保存配置"), 1)]),
					_: 1
				}, 8, ["loading", "disabled"])])) : o("", !0)])) : o("", !0), E.value ? (y(), a(Fn, {
					key: 1,
					ref_key: "editRef",
					ref: j,
					inline: "",
					"external-save": "",
					onSuccess: Ee
				}, null, 512)) : !h.value && !U.value && !m.value ? (y(), a(T(F), {
					key: 2,
					description: "请选择交易对查看配置"
				})) : o("", !0)])])]),
				_: 1
			}, 8, ["loading", "hide-content"])) : x.value === "GRID" ? (y(), a(mr, {
				key: 3,
				ref_key: "gridRef",
				ref: S,
				class: "grid-mode"
			}, null, 512)) : o("", !0)
		]));
	}
}), [["__scopeId", "data-v-17102a95"]]), Ir = 9223372036854775807n;
function Lr(e) {
	return e == null ? "—" : typeof e == "object" ? JSON.stringify(e) : String(e);
}
function Rr(e, t = !1) {
	return typeof e == "string" && /^(0|[1-9][0-9]*)$/.test(e) && e.length <= 19 && BigInt(e) <= Ir && (!t || e !== "0");
}
function zr(e) {
	return typeof e == "number" ? Number.isSafeInteger(e) && e > 0 ? String(e) : null : Rr(e, !0) ? e : null;
}
function Br(e) {
	return typeof e == "string" && e.length <= 256 && /^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(e);
}
function Vr(e, t) {
	if (!Br(e) || !Br(t)) throw Error("INVALID_DECIMAL");
	let [n, r = ""] = e.split("."), [i, a = ""] = t.split("."), o = Math.max(r.length, a.length), s = BigInt(n + r.padEnd(o, "0")), c = BigInt(i + a.padEnd(o, "0"));
	return s === c ? 0 : s > c ? 1 : -1;
}
function Hr(e) {
	if (!Rr(e) || BigInt(e) > 8640000000000000n) return e == null ? "—" : Lr(e);
	let t = new Date(Number(e));
	return Number.isNaN(t.getTime()) ? Lr(e) : t.toLocaleString();
}
function Z(e, t = 64, n = !1) {
	return typeof e == "string" && e.length > 0 && [...e].length <= t && e.trim() === e && !/[\u0000-\u001f\u007f]/.test(e) && (!n || /^[A-Z0-9][A-Z0-9._-]*$/.test(e));
}
//#endregion
//#region src/prediction-config/agent/utils/decimal.ts
var Ur = /^([+-]?)(\d*)(?:\.(\d*))?$/, Wr = /^([+-]?)(\d*\.?\d+)[eE]([+-]?\d+)$/, Gr = 1e3;
function Kr(e) {
	if (!/[eE]/.test(e)) return e;
	let t = e.match(Wr);
	if (!t) return null;
	let [, n, r, i] = t, a = Number(i);
	if (!Number.isSafeInteger(a) || Math.abs(a) > Gr) return null;
	let [o = "", s = ""] = r.split("."), c = `${o}${s}`, l = o.length + a;
	return l <= 0 ? `${n}0.${"0".repeat(Math.abs(l))}${c}` : l >= c.length ? `${n}${c}${"0".repeat(l - c.length)}` : `${n}${c.slice(0, l)}.${c.slice(l)}`;
}
function qr(e) {
	if (e == null || e === "") return null;
	let t = Kr(String(e).trim().replace(/,/g, ""));
	if (t == null) return null;
	let n = t.match(Ur);
	if (!n || !n[2] && !n[3]) return null;
	let [, r, i = "", a = ""] = n, o = i.replace(/^0+(?=\d)/, "") || "0", s = a.replace(/0+$/, ""), c = s ? `${o}.${s}` : o;
	return /^0(?:\.0*)?$/.test(c) ? "0" : r === "-" ? `-${c}` : c;
}
//#endregion
//#region src/prediction-config/agent/views/prediction/game-config/site-model.ts
var Jr = (e) => e.stored.game_type === "GAME_TYPE_HIGH_LOW" ? "HIGH_LOW" : "UP_DOWN", Yr = [
	"35",
	"40",
	"45",
	"60",
	"90"
], Xr = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Q(e, t = "INVALID_SITE_CONFIGURATION") {
	if (!e) throw Error(t);
}
function Zr(e) {
	if (e && typeof e == "object") {
		Object.freeze(e);
		for (let t of Object.values(e)) Zr(t);
	}
	return e;
}
function Qr(e = globalThis.crypto) {
	Q(e && typeof e.getRandomValues == "function", "SECURE_RANDOM_UNAVAILABLE");
	let t = e.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	Q(t instanceof Uint8Array && t.length === 16, "SECURE_RANDOM_UNAVAILABLE"), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0")).join("");
	return `${n.slice(0, 8)}-${n.slice(8, 12)}-${n.slice(12, 16)}-${n.slice(16, 20)}-${n.slice(20)}`;
}
function $r(e) {
	Q(Xr(e) && zr(e.operator_id) === e.operator_id && zr(e.agent_id) === e.agent_id, "IDENTITY_UNCONFIRMED");
}
function ei(e) {
	Q(Xr(e)), $r(e.actor), Q(Array.isArray(e.sites) && e.sites.length <= 100);
	let t = /* @__PURE__ */ new Set();
	for (let n of e.sites) {
		Q(Xr(n) && Z(n.site_id, 128) && !t.has(n.site_id) && Array.isArray(n.games)), t.add(n.site_id), Q(n.games.length > 0 && n.games.length <= 2);
		let e = /* @__PURE__ */ new Set();
		for (let t of n.games) Q(Xr(t) && ["UP_DOWN", "HIGH_LOW"].includes(String(t.game_type)) && !e.has(t.game_type) && Array.isArray(t.symbols) && t.symbols.length <= 100 && t.symbols.every((e) => Z(e, 64, !0)) && new Set(t.symbols).size === t.symbols.length), e.add(t.game_type);
	}
}
function ti(e, t) {
	Q(Object.keys(e).every((e) => t.includes(e)));
}
function ni(e) {
	Q(Xr(e) && Z(e.site_id, 128) && ["GAME_TYPE_UP_DOWN", "GAME_TYPE_HIGH_LOW"].includes(String(e.game_type)) && Z(e.symbol, 64, !0)), Q(Rr(e.version, !0) && Rr(e.based_on_public_version, !0) && typeof e.enabled == "boolean" && Array.isArray(e.overrides));
	let t = e.game_type === "GAME_TYPE_UP_DOWN";
	Q(e.overrides.length <= (t ? 5 : 100) && new Set(e.overrides.map((e) => e.duration_seconds)).size === e.overrides.length);
	for (let n of e.overrides) {
		Q(Xr(n)), ti(n, [
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
		]), Q(n.game_type === e.game_type && n.symbol === e.symbol && (t ? Yr.includes(String(n.duration_seconds)) : Rr(n.duration_seconds, !0))), Q(!Object.hasOwn(n, "enabled") || typeof n.enabled == "boolean"), Q(Array.isArray(n.stake_tiers) && n.stake_tiers.length <= +!!t), t || ii(n);
		for (let e of n.stake_tiers) Q(Xr(e)), ti(e, [
			"stake_tier_id",
			"enabled",
			"maximum_stake"
		]), Q(Z(e.stake_tier_id) && (!Object.hasOwn(e, "enabled") || typeof e.enabled == "boolean") && (!Object.hasOwn(e, "maximum_stake") || Br(e.maximum_stake)));
	}
}
function ri(e, t, n, r) {
	Q(Xr(e)), ni(e.stored);
	let i = e.stored, a = e.effective;
	Q(i.site_id === t && i.symbol === n && Xr(a) && (!r || i.game_type === "GAME_TYPE_" + r));
	let o = i.game_type === "GAME_TYPE_UP_DOWN";
	Q(a.site_id === t && a.symbol === n && a.game_type === i.game_type), Q(Rr(a.public_version, !0) && a.site_version === i.version && a.based_on_public_version === i.based_on_public_version && typeof a.enabled == "boolean"), Q(Array.isArray(a.rules) && (o ? a.rules.length === 5 : a.rules.length > 0 && a.rules.length <= 100) && new Set(a.rules.map((e) => e.duration_seconds)).size === a.rules.length);
	let s = a.rules;
	for (let e of s) {
		if (Q(Xr(e) && e.game_type === i.game_type && e.symbol === n && (o ? Yr.includes(String(e.duration_seconds)) : Rr(e.duration_seconds, !0)) && typeof e.enabled == "boolean"), Q(Array.isArray(e.stake_tiers)), !o) {
			Q(e.stake_tiers.length === 0), ii(e, !0);
			continue;
		}
		Q(e.bet_open_seconds === "30"), Q(e.stake_tiers.every((e) => Xr(e) && Z(e.stake_tier_id) && typeof e.enabled == "boolean" && typeof e.retired == "boolean"));
		let t = e.stake_tiers.filter((e) => !e.retired);
		Q(t.length === 1 && t[0].minimum_stake === "1" && Br(t[0].maximum_stake));
		let r = i.overrides.find((t) => t.duration_seconds === e.duration_seconds);
		Q(!r?.stake_tiers.length || r.stake_tiers[0].stake_tier_id === t[0].stake_tier_id);
	}
	a.public_version === i.based_on_public_version && Q(i.overrides.every((e) => s.some((t) => t.duration_seconds === e.duration_seconds))), Q(Array.isArray(e.adjustments));
}
function ii(e, t = !1) {
	for (let n of [
		"fixed_odds",
		"minimum_stake",
		"maximum_stake"
	]) (t || Object.hasOwn(e, n)) && Q(Br(e[n]) && Vr(e[n], n === "fixed_odds" ? "1" : "0") > 0);
	e.minimum_stake !== void 0 && e.maximum_stake !== void 0 && Q(Vr(e.minimum_stake, e.maximum_stake) <= 0);
}
function ai(e) {
	return ri(e, e.stored.site_id, e.stored.symbol), Jr(e) === "HIGH_LOW" ? [...e.effective.rules].sort((e, t) => BigInt(e.duration_seconds) < BigInt(t.duration_seconds) ? -1 : 1).map((t) => {
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
	}) : Yr.map((t) => {
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
function oi(e, t, n, r, i) {
	let a = ai(e);
	Q(typeof n == "boolean" && Z(r, 500) && Z(i, 128), "INVALID_REASON"), Q(t.length === a.length && new Set(t.map((e) => e.duration_seconds)).size === a.length);
	let o = Jr(e), s = a.map((n) => {
		let r = t.find((e) => e.duration_seconds === n.duration_seconds);
		Q(r && r.stake_tier_id === n.stake_tier_id && typeof r.enabled == "boolean");
		let i = e.stored.overrides.find((e) => e.duration_seconds === n.duration_seconds);
		if (o === "HIGH_LOW") {
			ii(r, !0), Q(Vr(r.fixed_odds, "2") < 0, "INVALID_ODDS");
			let e = { duration_seconds: n.duration_seconds };
			i ? i.enabled !== void 0 && (e.enabled = i.enabled) : e.enabled = r.enabled, r.enabled !== n.enabled && (e.enabled = r.enabled);
			for (let t of [
				"fixed_odds",
				"minimum_stake",
				"maximum_stake"
			]) i?.[t] !== void 0 && (e[t] = i[t]), r[t] !== n[t] && (e[t] = r[t]);
			return e;
		}
		Q(Br(r.maximum_stake) && Vr(r.maximum_stake, "1") >= 0, "INVALID_MAXIMUM");
		let a = { ...i?.stake_tiers[0] ?? { stake_tier_id: n.stake_tier_id } }, s = {
			duration_seconds: n.duration_seconds,
			...i?.enabled === void 0 ? {} : { enabled: i.enabled },
			stake_tiers: [a]
		};
		return r.enabled !== n.enabled && (s.enabled = r.enabled, a.enabled = r.enabled), r.maximum_stake !== n.maximum_stake && (a.maximum_stake = r.maximum_stake), s;
	});
	return Zr({
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
var si = class {
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
function ci(e) {
	return e.stake_tiers.find((e) => !e.retired);
}
function li(e) {
	return Rr(e?.operator_id, !0) && e.operator_id === e.agent_id;
}
var ui = (e) => typeof e == "string" && /^(0|[1-9][0-9]{0,17})(\.[0-9]{1,18})?$/.test(e) && Vr(e, "0") > 0;
function di(e, t, n, r) {
	return [
		e,
		t,
		n,
		r
	].every(ui) && Vr(e, n) <= 0 && Vr(n, r) <= 0 && Vr(r, t) <= 0;
}
function fi(e, t) {
	Q(li(t), "IDENTITY_UNCONFIRMED"), Q(Xr(e) && e.owner_agent_id === t.agent_id && ["GAME_TYPE_UP_DOWN", "GAME_TYPE_HIGH_LOW"].includes(String(e.game_type)) && Z(e.symbol, 64, !0), "INVALID_OWNER_CONFIGURATION"), Q(Rr(e.public_version, !0) && Rr(e.owner_revision) && Array.isArray(e.rules) && e.rules.length > 0 && e.rules.length <= 100), Q(typeof e.enabled == "boolean" && typeof e.platform_enabled == "boolean");
	let n = e.game_type === "GAME_TYPE_UP_DOWN", r = /* @__PURE__ */ new Set();
	n && Q(e.rules.length === 5);
	for (let t of e.rules) {
		Q(Xr(t) && Xr(t.rule) && Rr(t.rule_epoch, !0) && typeof t.custom == "boolean");
		let i = t.rule;
		Q(typeof t.platform_enabled == "boolean" && typeof t.owner_enabled == "boolean" && i.enabled === (e.enabled && t.platform_enabled && t.owner_enabled)), Q(n ? ui(t.platform_target_payout_rate) && ui(t.platform_maximum_odds) && t.platform_fixed_odds === "" && ui(i.target_payout_rate) && ui(i.maximum_odds) && Vr(i.target_payout_rate, t.platform_target_payout_rate) <= 0 && Vr(i.target_payout_rate, "1") <= 0 && Vr(i.maximum_odds, t.platform_maximum_odds) <= 0 && Vr(i.maximum_odds, "1") >= 0 : ui(t.platform_fixed_odds) && t.platform_target_payout_rate === "" && t.platform_maximum_odds === "" && ui(i.fixed_odds) && Vr(i.fixed_odds, "1") > 0 && Vr(i.fixed_odds, t.platform_fixed_odds) <= 0), Q(i.game_type === e.game_type && i.symbol === e.symbol && Rr(i.duration_seconds, !0) && !r.has(i.duration_seconds) && typeof i.enabled == "boolean" && Array.isArray(i.stake_tiers)), r.add(i.duration_seconds);
		let a = i;
		if (n) {
			Q(Yr.includes(i.duration_seconds) && i.bet_open_seconds === "30");
			let e = /* @__PURE__ */ new Set(), t = i.stake_tiers.filter((t) => (Q(Xr(t) && Z(t.stake_tier_id) && !e.has(t.stake_tier_id) && typeof t.retired == "boolean" && typeof t.enabled == "boolean"), e.add(t.stake_tier_id), !t.retired));
			Q(t.length === 1), a = t[0], Q(Xr(a) && Z(a.stake_tier_id) && typeof a.enabled == "boolean" && a.retired === !1), Q(Br(i.target_payout_rate) && Br(i.minimum_odds) && Br(i.maximum_odds));
		} else Q(i.stake_tiers.length === 0 && Br(i.fixed_odds));
		Q(di(t.platform_minimum_stake, t.platform_maximum_stake, a.minimum_stake, a.maximum_stake));
	}
}
function pi(e, t) {
	fi(e, t);
	let n = e.game_type === "GAME_TYPE_UP_DOWN";
	return e.rules.map((e) => {
		let t = e.rule, r = n ? ci(t) : t;
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
			stake_tier_id: n ? ci(t).stake_tier_id : "",
			based_rule_epoch: e.rule_epoch,
			minimum_stake: r.minimum_stake,
			maximum_stake: r.maximum_stake,
			platform_minimum: e.platform_minimum_stake,
			platform_maximum: e.platform_maximum_stake,
			enabled: t.enabled && (!n || ci(t).enabled),
			odds: n ? `${t.minimum_odds} ~ ${t.maximum_odds}` : t.fixed_odds,
			custom: e.custom
		};
	});
}
function mi(e, t, n, r, i, a = e.enabled) {
	let o = pi(e, t);
	Q(n.length === o.length && new Set(n.map((e) => e.duration_seconds)).size === o.length), Q(Z(r, 500) && Z(i, 128), "INVALID_REASON");
	let s = [];
	for (let t of o) {
		let r = n.find((e) => e.duration_seconds === t.duration_seconds);
		Q(r && r.stake_tier_id === t.stake_tier_id && r.based_rule_epoch === t.based_rule_epoch && di(t.platform_minimum, t.platform_maximum, r.minimum_stake, r.maximum_stake), "INVALID_LIMITS"), Q(typeof r.owner_enabled == "boolean" && (r.owner_enabled === t.owner_enabled || !r.owner_enabled || t.platform_enabled), "PLATFORM_DISABLED");
		let i = e.game_type === "GAME_TYPE_UP_DOWN", a = i ? ["target_payout_rate", "maximum_odds"] : ["fixed_odds"];
		for (let e of a) Q(ui(r[e]) && Vr(r[e], t[`platform_${e}`]) <= 0, "INVALID_ODDS");
		Q(i ? Vr(r.target_payout_rate, "1") < 0 && Vr(r.maximum_odds, "1") >= 0 : Vr(r.fixed_odds, "1") > 0 && Vr(r.fixed_odds, "2") < 0, "INVALID_ODDS");
		let o = Vr(r.minimum_stake, t.minimum_stake) !== 0 || Vr(r.maximum_stake, t.maximum_stake) !== 0, c = a.some((e) => Vr(r[e], t[e]) !== 0), l = r.owner_enabled !== t.owner_enabled;
		if (o || c || l) {
			let e = {
				duration_seconds: t.duration_seconds,
				stake_tier_id: t.stake_tier_id,
				based_rule_epoch: t.based_rule_epoch,
				minimum_stake: qr(r.minimum_stake),
				maximum_stake: qr(r.maximum_stake)
			};
			if (l && (e.enabled = r.owner_enabled), c) for (let t of a) e[t] = qr(r[t]);
			s.push(e);
		}
	}
	return Q(typeof a == "boolean" && (a === e.enabled || !a || e.platform_enabled), "PLATFORM_DISABLED"), Q(s.length > 0 || a !== e.enabled, "NO_CHANGES"), {
		...a === e.enabled ? {} : { enabled: a },
		game_type: e.game_type === "GAME_TYPE_UP_DOWN" ? "UP_DOWN" : "HIGH_LOW",
		symbol: e.symbol,
		based_owner_revision: e.owner_revision,
		changes: s,
		client_request_id: i,
		reason: r
	};
}
var hi = class {
	generation = 0;
	begin(e, t, n) {
		return {
			generation: ++this.generation,
			operator: e.operator_id,
			owner: e.agent_id,
			game: t,
			symbol: n
		};
	}
	close() {
		this.generation++;
	}
	current(e, t, n, r) {
		return e.generation === this.generation && e.operator === t.operator_id && e.owner === t.agent_id && e.game === n && e.symbol === r;
	}
};
//#endregion
//#region src/prediction-config/agent/views/grid/config/directory.ts
function gi(e, t) {
	return _i(e.filter((e) => e.default_enabled).map((e) => ({
		...e,
		configured: !0
	})), t);
}
function _i(e, t, n = (e) => !!e.enabled) {
	let r = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.trim().toUpperCase();
		r.has(t) || r.set(t, r.size);
	}
	return [...e].sort((e, t) => Number(n(t)) - Number(n(e)) || (r.get(e.symbol) ?? 2 ** 53 - 1) - (r.get(t.symbol) ?? 2 ** 53 - 1) || e.symbol.localeCompare(t.symbol));
}
//#endregion
//#region src/prediction-config/agent/views/grid/config/model.ts
var vi = "grid.config.pending.v1", yi = /^(0|[1-9]\d*)(?:\.(\d+))?$/, bi = /^[1-9]\d*$/, xi = /^[A-Z0-9]{2,32}$/, Si = [
	"site_id",
	"symbol",
	"based_on_layout_version",
	"based_on_site_version",
	"client_request_id",
	"reason",
	"changes"
], Ci = [
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
], wi = [
	"based_on_config_id",
	"based_on_default_version",
	"based_on_default_resolution_epoch"
], Ti = [
	"price_band_width",
	"column_duration_seconds",
	"price_decimals"
], Ei = [
	"enabled",
	"target_rtp",
	"min_multiplier",
	"max_multiplier",
	"min_order_amount",
	"max_order_amount"
];
function Di(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function $(e, t = "INVALID_GRID_CONFIGURATION") {
	if (!e) throw Error(t);
}
function Oi(e, t) {
	$(Object.keys(e).length === t.length && Object.keys(e).every((e) => t.includes(e)), "PENDING_CORRUPT");
}
function ki(e, t) {
	$(typeof e == "string" && e.length <= 128 && yi.test(e), "INVALID_DECIMAL");
	let [n, r = ""] = e.split("."), i = n.replace(/^0+(?=\d)/, ""), a = r.replace(/0+$/, "");
	return $(t === void 0 || a.length <= t, "INVALID_DECIMAL"), a ? i + "." + a : i;
}
function Ai(e) {
	let [t, n = ""] = ki(e).split(".");
	return {
		whole: t,
		fraction: n
	};
}
function ji(e, t) {
	let n = Ai(e), r = Ai(t);
	if (n.whole.length !== r.whole.length) return n.whole.length > r.whole.length ? 1 : -1;
	if (n.whole !== r.whole) return n.whole > r.whole ? 1 : -1;
	let i = Math.max(n.fraction.length, r.fraction.length), a = n.fraction.padEnd(i, "0"), o = r.fraction.padEnd(i, "0");
	return a === o ? 0 : a > o ? 1 : -1;
}
function Mi(e, t) {
	let { whole: n, fraction: r } = Ai(e), i = n + r, a = n.length + t, o;
	o = a <= 0 ? "0." + "0".repeat(-a) + i : a >= i.length ? i + "0".repeat(a - i.length) : i.slice(0, a) + "." + i.slice(a);
	let [s, c = ""] = o.split("."), l = s.replace(/^0+(?=\d)/, "") || "0", u = c.replace(/0+$/, "");
	return u ? l + "." + u : l;
}
function Ni(e) {
	let t = ki(e);
	return $(ji(t, "0") > 0 && ji(t, "1") <= 0, "INVALID_RTP"), Mi(t, 2);
}
function Pi(e) {
	let t = ki(e);
	return $(ji(t, "0") > 0 && ji(t, "100") < 0, "INVALID_RTP"), Mi(t, -2);
}
function Fi(e = globalThis.crypto) {
	$(e && typeof e.getRandomValues == "function", "SECURE_RANDOM_UNAVAILABLE");
	let t = e.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	$(t instanceof Uint8Array && t.length === 16, "SECURE_RANDOM_UNAVAILABLE"), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0")).join("");
	return `${n.slice(0, 8)}-${n.slice(8, 12)}-${n.slice(12, 16)}-${n.slice(16, 20)}-${n.slice(20)}`;
}
function Ii(e) {
	return $(typeof e == "string" && bi.test(e) && ji(e, "25") <= 0, "INVALID_LAYOUT_DURATION"), e;
}
function Li(e, t) {
	let n = ki(e, t);
	return $(ji(n, "0") > 0, "INVALID_LAYOUT_WIDTH"), n;
}
function Ri(e) {
	return $(e === null || typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 18, "INVALID_LAYOUT_PRECISION"), e;
}
function zi(e) {
	return $(typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 8, "INVALID_LAYOUT_PRECISION"), e;
}
function Bi(e, t) {
	t != null && $((ki(e).split(".")[1] ?? "").length <= t, "INVALID_LAYOUT_PRECISION");
}
function Vi(e, t) {
	$(5 + (Number(e) + 1) * Number(t) <= 30, "INVALID_LAYOUT_HORIZON");
}
function Hi(e) {
	return $(Di(e), "INVALID_GRID_LAYOUT"), Oi(e, [
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
	].every((e) => typeof e == "string" && e.length <= 128 && bi.test(e)), "INVALID_GRID_LAYOUT"), $(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_LAYOUT"), $(typeof e.editable == "boolean", "INVALID_GRID_LAYOUT"), $(Array.isArray(e.affected_site_ids) && e.affected_site_ids.every((e) => typeof e == "string" && e.length > 0 && e.length <= 64 && e.trim() === e), "INVALID_GRID_LAYOUT"), $(new Set(e.affected_site_ids).size === e.affected_site_ids.length && (!e.editable || e.affected_site_ids.length > 0), "INVALID_GRID_LAYOUT"), {
		row_count: e.row_count,
		column_count: e.column_count,
		column_duration_seconds: e.column_duration_seconds,
		price_band_width: Li(e.price_band_width),
		..."price_decimals" in e ? { price_decimals: Ri(e.price_decimals) } : {},
		effective_from_ms: e.effective_from_ms,
		editable: e.editable,
		affected_site_ids: [...e.affected_site_ids]
	};
}
function Ui(e) {
	$(Di(e), "INVALID_GRID_CONFIGURATION"), Oi(e, [
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
		..."config_id" in e ? Ci : []
	]), $(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "INVALID_GRID_CONFIGURATION"), $(typeof e.symbol == "string" && xi.test(e.symbol), "INVALID_GRID_CONFIGURATION"), $([e.layout_version, e.site_version].every((e) => typeof e == "string" && bi.test(e)), "INVALID_GRID_CONFIGURATION"), $(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_CONFIGURATION"), $(typeof e.enabled == "boolean", "INVALID_GRID_CONFIGURATION");
	let t = {
		site_id: e.site_id,
		symbol: e.symbol,
		layout_version: e.layout_version,
		site_version: e.site_version,
		effective_from_ms: e.effective_from_ms,
		enabled: e.enabled,
		target_rtp: ki(e.target_rtp),
		min_multiplier: ki(e.min_multiplier, 2),
		max_multiplier: ki(e.max_multiplier, 2),
		min_order_amount: ki(e.min_order_amount, 8),
		max_order_amount: ki(e.max_order_amount, 8)
	};
	if ($(ji(t.target_rtp, "0") > 0 && ji(t.target_rtp, "1") <= 0, "INVALID_GRID_CONFIGURATION"), $(ji(t.min_multiplier, "1") >= 0 && ji(t.max_multiplier, t.min_multiplier) >= 0, "INVALID_GRID_CONFIGURATION"), $(ji(t.min_order_amount, "0") > 0 && ji(t.max_order_amount, t.min_order_amount) >= 0, "INVALID_GRID_CONFIGURATION"), "config_id" in e) {
		for (let n of [
			"config_id",
			"default_config_id",
			"default_version",
			"default_resolution_epoch"
		]) $(typeof e[n] == "string" && bi.test(e[n]) && ji(e[n], "9223372036854775807") <= 0), t[n] = e[n];
		$(typeof e.requested_agent_id == "string" && /^(0|[1-9][0-9]*)$/.test(e.requested_agent_id) && ji(e.requested_agent_id, "9223372036854775807") <= 0), $(e.agent_id === null || e.agent_id === e.requested_agent_id && e.agent_id !== "0"), t.requested_agent_id = e.requested_agent_id, t.agent_id = e.agent_id;
		for (let n of [
			"inherited",
			"default_enabled",
			"effective_enabled"
		]) $(typeof e[n] == "boolean"), t[n] = e[n];
		for (let n of [
			"default_target_rtp",
			"default_min_order_amount",
			"default_max_order_amount"
		]) t[n] = ki(e[n]);
	}
	return "layout" in e && (t.layout = Hi(e.layout)), t;
}
function Wi(e, t, n) {
	let r = Ui(e);
	return $(r.site_id === t && r.symbol === n, "INVALID_GRID_TARGET"), r;
}
function Gi(e, t, n, r, i, a = !1) {
	let o = Ui(e), s = Ui(t);
	$(o.site_id === s.site_id && o.symbol === s.symbol, "INVALID_GRID_TARGET"), $(typeof n == "string" && n.length <= 500 && n.trim().length > 0 && !n.includes("\0"), "INVALID_REASON"), $(typeof r == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(r), "INVALID_REQUEST_ID"), $(o.config_id && o.default_version && o.default_resolution_epoch, "CONFIG_IDENTITY_REQUIRED"), $(Ci.every((e) => o[e] === s[e]), "INVALID_GRID_TARGET"), o.requested_agent_id !== "0" && ($(!s.enabled || o.default_enabled, "PLATFORM_LIMIT"), $(ji(s.target_rtp, o.default_target_rtp) <= 0 && ji(s.min_order_amount, o.default_min_order_amount) >= 0 && ji(s.max_order_amount, o.default_max_order_amount) <= 0, "PLATFORM_LIMIT"));
	let c = {};
	for (let e of Ei) o[e] !== s[e] && (c[e] = s[e]);
	for (let e of Ti) o.layout?.[e] !== s.layout?.[e] && ($(a && o.layout?.editable && s.layout, "FIELD_FORBIDDEN"), c[e] = s.layout[e]);
	if (Ti.some((e) => e in c)) {
		let e = o.layout;
		"price_decimals" in c && zi(c.price_decimals), Bi(s.layout.price_band_width, s.layout.price_decimals), Li(c.price_band_width ?? e.price_band_width, 18);
		let t = Ii(c.column_duration_seconds ?? e.column_duration_seconds);
		$(ji(e.row_count, "10000") <= 0 && ji(e.column_count, "10000") <= 0 && Number(e.row_count) * Number(e.column_count) <= 1e4, "INVALID_GRID_LAYOUT"), Vi(e.column_count, t);
	}
	if (!i && ("min_multiplier" in c || "max_multiplier" in c)) throw Error("FIELD_FORBIDDEN");
	return $(Object.keys(c).length > 0, "EMPTY_CHANGES"), {
		site_id: o.site_id,
		symbol: o.symbol,
		based_on_layout_version: o.layout_version,
		based_on_site_version: o.site_version,
		based_on_config_id: o.config_id,
		based_on_default_version: o.default_version,
		based_on_default_resolution_epoch: o.default_resolution_epoch,
		client_request_id: r,
		reason: n,
		changes: c
	};
}
function Ki(e) {
	if ($(Di(e), "PENDING_CORRUPT"), Oi(e, [...Si, ..."based_on_config_id" in e ? wi : []]), "based_on_config_id" in e) for (let t of wi) $(typeof e[t] == "string" && bi.test(e[t]) && ji(e[t], "9223372036854775807") <= 0, "PENDING_CORRUPT");
	$(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "PENDING_CORRUPT"), $(typeof e.symbol == "string" && xi.test(e.symbol), "PENDING_CORRUPT"), $(typeof e.based_on_layout_version == "string" && bi.test(e.based_on_layout_version), "PENDING_CORRUPT"), $(typeof e.based_on_site_version == "string" && bi.test(e.based_on_site_version), "PENDING_CORRUPT"), $(typeof e.client_request_id == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(e.client_request_id), "PENDING_CORRUPT"), $(typeof e.reason == "string" && e.reason.length <= 500 && e.reason.trim().length > 0 && !e.reason.includes("\0"), "PENDING_CORRUPT"), $(Di(e.changes) && Object.keys(e.changes).length > 0 && Object.keys(e.changes).every((e) => [...Ei, ...Ti].includes(e)), "PENDING_CORRUPT");
	for (let [t, n] of Object.entries(e.changes)) t === "enabled" ? $(typeof n == "boolean", "PENDING_CORRUPT") : t === "price_decimals" ? zi(n) : t === "price_band_width" ? Li(n, 18) : t === "column_duration_seconds" ? Ii(n) : ki(n, t.includes("order_amount") ? 8 : t.includes("multiplier") ? 2 : void 0);
}
function qi(e) {
	if (e && typeof e == "object") {
		Object.freeze(e);
		for (let t of Object.values(e)) qi(t);
	}
	return e;
}
function Ji(e, t) {
	return !!e && JSON.stringify(e) === JSON.stringify(t);
}
function Yi(e) {
	let t = e.getItem(vi);
	if (t === null) return null;
	$(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return $(Di(n), "PENDING_CORRUPT"), Oi(n, [
		"schema",
		"operator_id",
		"command"
	]), $(n.schema === 1 && typeof n.operator_id == "string" && bi.test(n.operator_id), "PENDING_CORRUPT"), Ki(n.command), qi(n);
}
function Xi(e, t, n) {
	$(bi.test(t), "IDENTITY_UNCONFIRMED"), $(Yi(e) === null, "PENDING_EXISTS"), Ki(n);
	let r = {
		schema: 1,
		operator_id: t,
		command: JSON.parse(JSON.stringify(n))
	};
	e.setItem(vi, JSON.stringify(r));
	let i = Yi(e);
	return $(Ji(i, r), "PERSISTENCE_UNAVAILABLE"), i;
}
function Zi(e, t) {
	return $(bi.test(e), "IDENTITY_UNCONFIRMED"), Ki(t), qi({
		operator_id: e,
		command: structuredClone(t)
	});
}
function Qi(e, t, n, r) {
	return Ki(t.command), Ki(r), $(t.operator_id === n && JSON.stringify(t.command) === JSON.stringify(r), "STALE_CONFIRMATION"), Xi(e, t.operator_id, t.command);
}
function $i(e, t) {
	let n = Yi(e);
	return n ? n.operator_id === t ? {
		status: "bound",
		pending: n
	} : {
		status: "foreign",
		pending: n
	} : { status: "none" };
}
function ea(e, t) {
	return Di(e) ? e.operation_status === "SUCCEEDED" && typeof e.operation_id == "string" && bi.test(e.operation_id) && e.site_id === t.command.site_id && e.symbol === t.command.symbol && typeof e.layout_version == "string" && bi.test(e.layout_version) && typeof e.site_version == "string" && bi.test(e.site_version) && typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms) && typeof e.changed == "boolean" && [
		"PENDING",
		"DONE",
		"NOT_REQUIRED"
	].includes(String(e.cache_state)) : !1;
}
function ta(e) {
	return Di(e) && e.error_code === "RECEIPT_UNCONFIRMED" && e.operation_status === "UNKNOWN";
}
async function na(e, t, n, r) {
	$(Ji(Yi(e), t), "PENDING_CHANGED");
	try {
		let i = await r(n === "recover" ? "save" : n, structuredClone(t.command));
		return ea(i, t) ? (Ji(Yi(e), t) && e.removeItem(vi), {
			status: "success",
			value: i
		}) : {
			status: "unknown",
			error: /* @__PURE__ */ Error("INVALID_RECEIPT")
		};
	} catch (r) {
		if ((Di(r) ? r.operation_status : void 0) === "FAILED" && (n === "save" || n === "recover" && Di(r) && r.error_code === "VERSION_CONFLICT")) {
			let n = Ji(Yi(e), t);
			return n && e.removeItem(vi), {
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
var ra = class {
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
}, ia = {
	class: "grid-config",
	"data-grid-config": "agent"
}, aa = { key: 3 }, oa = {
	key: 5,
	class: "pending-bar"
}, sa = { class: "pending-actions" }, ca = { class: "grid-layout" }, la = { class: "symbol-panel" }, ua = { class: "panel-heading" }, da = {
	key: 1,
	class: "directory-error",
	role: "alert"
}, fa = { class: "symbol-list" }, pa = ["disabled", "onClick"], ma = {
	key: 0,
	class: "symbol-unconfigured"
}, ha = { key: 2 }, ga = { class: "config-panel" }, _a = { class: "config-heading" }, va = { "data-config-updated-at": "" }, ya = { key: 0 }, ba = { class: "config-heading__actions" }, xa = {
	key: 0,
	class: "parameter-description"
}, Sa = {
	key: 0,
	class: "parameter-card",
	"data-price-precision": ""
}, Ca = { class: "fields" }, wa = { class: "parameter-card" }, Ta = { class: "fields odds-fields" }, Ea = { class: "parameter-card" }, Da = { class: "parameter-heading" }, Oa = { class: "parameter-description" }, ka = { class: "fields limit-fields" }, Aa = /*#__PURE__*/ e(/* @__PURE__ */ f({
	__name: "index",
	setup(e, { expose: n }) {
		let { initializeGridMerchant: l, gridConfigSymbols: f, gridConfigCatalog: p, gridConfigReceipt: m, gridConfigSite: h, saveGridConfig: g } = he().grid, _ = _e(), v = ge(), ne = (e) => v.perms.includes("*") || v.perms.includes(e), x = i(() => ne("prediction_config:lists")), S = x, C = i(() => {
			let e = String(v.userInfo.id || "");
			return /^[1-9]\d*$/.test(e) ? e : "";
		}), ie = b([]), E = b(""), O = b(""), k = b(""), j = b(null), M = b(null), N = b(""), P = b("通过预测网格配置页面保存配置"), se = b(!1), I = b(!1), L = b(!1), R = b(!1), ce = b(!1), z = b(""), B = b(""), V = b("info"), H = b(null), U = b(!1), W = b(""), pe = b(!1), G = new ra(), me = new ra(), ye = new ra(), be, xe = 0, Se = i(() => x.value ? C.value ? "" : "无法确认当前操作人身份" : "当前账号没有预测网格配置查询权限"), Ce = i(() => ie.value.find((e) => e.site_id === E.value)), we = b([]), K = b(""), q = i(() => gi(Ce.value?.products ?? [], we.value)), Te = i(() => {
			let e = k.value.trim().toUpperCase();
			return q.value.filter((t) => !e || t.symbol.includes(e));
		}), Ee = i(() => {
			if (!j.value || !M.value) return !1;
			try {
				return Ni(j.value.target_rtp) !== N.value || [
					"enabled",
					"min_multiplier",
					"max_multiplier",
					"min_order_amount",
					"max_order_amount"
				].some((e) => j.value[e] !== M.value[e]);
			} catch {
				return !0;
			}
		}), De = i(() => H.value ? H.value.operator_id === C.value ? "bound" : "foreign" : "none"), Oe = i(() => De.value === "bound" ? H.value : null), ke = i(() => De.value === "foreign"), Ae = i(() => Ee.value || !!H.value || ce.value), je = i(() => x.value && S.value && !!Ce.value?.can_edit && !!C.value && !!j.value && !H.value && !U.value && !R.value && !ce.value), Me = i(() => !!Oe.value && x.value && S.value && ie.value.some((e) => e.site_id === Oe.value.command.site_id && e.can_edit)), Ne = i(() => Me.value && I.value && !L.value && !R.value && !ce.value && !U.value && !pe.value && W.value === JSON.stringify(Oe.value));
		function Pe(e) {
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
		let Fe = i(() => {
			let e = [j.value?.effective_from_ms, j.value?.layout?.effective_from_ms].filter((e) => typeof e == "string" && /^[1-9][0-9]*$/.test(e)).reduce((e, t) => BigInt(e) > BigInt(t) ? e : t, "0");
			return e === "0" ? "未提供" : Hr(e);
		});
		function Ie(e) {
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
			return e.sites.map((e) => ({
				...e,
				products: e.products.filter((e) => e.default_enabled)
			}));
		}
		function J() {
			try {
				let e = $i(sessionStorage, C.value);
				H.value = e.pending ?? null, U.value = !1;
			} catch {
				U.value = !0, H.value = null;
			}
		}
		function Y() {
			return `${C.value}:${E.value}:${O.value}`;
		}
		function Le() {
			me.close(), j.value = null, M.value = null, N.value = "", P.value = "通过预测网格配置页面保存配置", R.value = !1;
		}
		async function Re(e) {
			if (I.value = !1, G.close(), ye.close(), W.value = "", Le(), ie.value = [], we.value = [], K.value = "", E.value = "", O.value = "", k.value = "", z.value = "", B.value = "", J(), Se.value || U.value) return;
			let t = G.next(C.value);
			L.value = !0;
			try {
				if (await l(t.signal), !t.current(C.value)) return;
				let [n, r] = await Promise.allSettled([p(t.signal), f(t.signal)]);
				if (!t.current(C.value)) return;
				if (r.status === "fulfilled" && Array.isArray(r.value) && r.value.every((e) => typeof e == "string") ? we.value = r.value : K.value = "通用币种目录暂不可用，当前仅显示已授权的网格配置。", n.status === "rejected") throw n.reason;
				ie.value = Ie(n.value), I.value = !0;
				let i = Oe.value ?? (e ? { command: e } : null), a = i && ie.value.some((e) => e.site_id === i.command.site_id) ? i.command.site_id : ie.value[0]?.site_id || "";
				E.value = a;
				let o = ie.value.find((e) => e.site_id === a), s = i && i.command.site_id === a && o?.products.some((e) => e.symbol === i.command.symbol) ? i.command.symbol : q.value.find((e) => e.configured)?.symbol || "";
				O.value = s, s && (be = Ve());
			} catch (e) {
				t.current(C.value) && (z.value = Pe(e));
			} finally {
				t.current(C.value) && (L.value = !1);
			}
		}
		function ze(e) {
			Ae.value || (Le(), E.value = e, O.value = q.value.find((e) => e.configured)?.symbol || "", O.value && (be = Ve()));
		}
		function Be(e) {
			e === O.value || Ae.value || !Ce.value?.products.some((t) => t.symbol === e) || (Le(), O.value = e, be = Ve());
		}
		async function Ve() {
			if (Le(), !x.value || !E.value || !O.value) return;
			let e = E.value, t = O.value, n = Y(), r = me.next(n);
			R.value = !0;
			try {
				let n = await h(e, t, r.signal);
				if (!r.current(Y())) return;
				let i = Wi(n, e, t);
				j.value = i, M.value = structuredClone(i), N.value = Ni(i.target_rtp);
			} catch (e) {
				r.current(Y()) && (z.value = Pe(e));
			} finally {
				r.current(Y()) && (R.value = !1);
			}
		}
		function He(e) {
			return e.symbol === O.value && M.value ? M.value.enabled && M.value.default_enabled !== !1 : e.enabled;
		}
		function Ue(e) {
			return e.symbol === O.value && j.value?.default_enabled === !1 || !Ce.value?.products.some((t) => t.symbol === e.symbol) || !S.value || !Ce.value?.can_edit || R.value || ce.value || !!H.value || U.value || Ee.value && e.symbol !== O.value;
		}
		async function We(e, t) {
			typeof t != "boolean" || Ue(e) || (e.symbol !== O.value && (Be(e.symbol), await be), M.value && M.value.symbol === e.symbol && !Ue(e) && (M.value.enabled = t, Ge()));
		}
		function Ge() {
			B.value = "";
		}
		async function Ke() {
			if (!je.value || !j.value || !M.value || !C.value) return;
			let e;
			try {
				e = Gi(j.value, {
					...M.value,
					target_rtp: Pi(N.value)
				}, P.value, Fi(), !1, !1);
			} catch (e) {
				V.value = "warning", B.value = Pe(e);
				return;
			}
			let t = Zi(C.value, e);
			try {
				await le.confirm(`确认保存 ${e.site_id} / ${e.symbol} 的 ${Object.keys(e.changes).length} 项修改？`, "确认预测网格配置", {
					type: "warning",
					confirmButtonText: "确认保存",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			}
			if (J(), !je.value || !j.value || !M.value) {
				V.value = "warning", B.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let n;
			try {
				n = Gi(j.value, {
					...M.value,
					target_rtp: Pi(N.value)
				}, P.value, t.command.client_request_id, !1, !1);
			} catch {
				V.value = "warning", B.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let r;
			try {
				r = Qi(sessionStorage, t, C.value, n), J();
			} catch (e) {
				if (e?.message === "STALE_CONFIRMATION") {
					V.value = "warning", B.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
					return;
				}
				U.value = !0;
				return;
			}
			Ye(r, "save");
		}
		async function qe() {
			J(), !(!Oe.value || !Me.value || ce.value || pe.value) && Ye(Oe.value, "receipt");
		}
		async function Je() {
			if (J(), !Ne.value || !Oe.value) return;
			let e = Oe.value;
			pe.value = !0;
			try {
				await le.confirm(`确认恢复 ${e.command.site_id} / ${e.command.symbol} 的原请求 ${e.command.client_request_id}？将沿用原编号和原参数；已提交则返回原回执，尚未提交则保存原配置，不使用当前页面的新修改。`, "恢复原配置请求", {
					type: "warning",
					confirmButtonText: "确认恢复",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			} finally {
				pe.value = !1;
			}
			if (J(), !Ne.value || JSON.stringify(e) !== JSON.stringify(Oe.value)) {
				V.value = "warning", B.value = "确认期间账号、权限或原请求已变化，本次恢复已取消，请重新查询原操作回执";
				return;
			}
			await Ye(e, "recover");
		}
		async function Ye(e, t) {
			let n = ++xe, r = Y(), i = ye.next(r);
			ce.value = !0, W.value = "", B.value = "";
			try {
				let n = await na(sessionStorage, e, t, (e, t) => e === "save" ? g(t) : m(t));
				if (!i.current(Y())) return;
				if (J(), n.status === "success") {
					let e = C.value;
					P.value = "通过预测网格配置页面保存配置", ce.value = !1, await Re(), e === C.value && (V.value = "warning", B.value = z.value ? "配置已保存；最新配置刷新失败，请手动刷新" : "");
				} else if (t === "recover" && n.status === "rejected" && n.error?.error_code === "VERSION_CONFLICT") if (!n.journalCleared || H.value || U.value) V.value = "warning", B.value = "旧请求已明确拒绝，但本机待确认记录已变化，请重新核对当前记录";
				else {
					let t = C.value;
					if (await Re(e.command), E.value && O.value && be && await be, t === C.value) {
						V.value = "warning";
						let t = E.value === e.command.site_id && O.value === e.command.symbol && ie.value.some((t) => t.site_id === e.command.site_id && t.products.some((t) => t.symbol === e.command.symbol));
						B.value = "旧请求未生效，配置版本已变化；已清除旧待确认记录。" + (t ? z.value || !j.value ? "最新配置刷新失败，请手动刷新" : "请以当前配置为准" : `原目标当前不可见（${e.command.site_id} / ${e.command.symbol}），请核对权限和配置`);
					}
				}
				else V.value = n.status === "unknown" ? "warning" : "info", t === "receipt" && ta(n.error) && JSON.stringify(Oe.value) === JSON.stringify(e) ? (W.value = JSON.stringify(e), B.value = "未找到原操作回执，可使用原编号和原参数恢复请求") : t === "recover" ? B.value = "恢复尚未确认，原请求已保留，请重新查询原操作回执 · " + Pe(n.error) : B.value = n.status === "unknown" ? "原操作结果仍待确认，请使用原请求查询回执" : "保存已明确拒绝，可修正后重新提交 · " + Pe(n.error);
			} catch (e) {
				i.current(Y()) && (J(), V.value = "warning", B.value = "原操作结果仍待确认 · " + Pe(e));
			} finally {
				n === xe && (ce.value = !1, J());
			}
		}
		async function Xe() {
			if (!Ae.value) return !0;
			try {
				return await le.confirm("当前有未保存修改或待确认操作，离开不会删除原记录。仍要离开吗？", "离开预测网格配置", { type: "warning" }), !0;
			} catch {
				return !1;
			}
		}
		function Ze() {
			return JSON.stringify({
				operator: C.value,
				site: E.value,
				symbol: O.value,
				snapshot: j.value,
				draft: M.value,
				rtp: N.value,
				reason: P.value
			});
		}
		async function Qe() {
			if (!ce.value) {
				if (Ee.value) {
					let e = Ze();
					try {
						await le.confirm("刷新会丢弃当前未保存修改，仍要刷新吗？", "刷新预测网格配置", { type: "warning" });
					} catch {
						return;
					}
					if (ce.value || e !== Ze()) {
						V.value = "warning", B.value = "确认期间编辑状态已变化，本次刷新已取消";
						return;
					}
				}
				await Re();
			}
		}
		function $e(e) {
			Ae.value && (e.preventDefault(), e.returnValue = "");
		}
		return ae(() => [
			C.value,
			x.value,
			S.value
		], () => Re(), { immediate: !0 }), ve(Xe), window.addEventListener("beforeunload", $e), te(() => {
			W.value = "", I.value = !1, G.close(), me.close(), ye.close(), window.removeEventListener("beforeunload", $e);
		}), n({
			hasBlockingWork: Ae,
			confirmLeave: Xe,
			refresh: Qe,
			loading: L
		}), (e, n) => (y(), s("section", ia, [
			Se.value ? (y(), a(T(oe), {
				key: 0,
				title: Se.value,
				type: "warning",
				closable: !1
			}, null, 8, ["title"])) : U.value ? (y(), a(T(oe), {
				key: 1,
				title: "本机保存的待确认操作记录已损坏或不可用，请停止操作并联系管理员核验",
				type: "error",
				closable: !1
			})) : ke.value ? (y(), a(T(oe), {
				key: 2,
				title: "检测到其他账号尚未确认的预测网格配置操作，当前账号不可覆盖，请切回原账号查询回执",
				type: "error",
				closable: !1
			})) : o("", !0),
			z.value ? (y(), s("div", aa, [d(T(oe), {
				title: z.value,
				type: "error",
				closable: !1
			}, null, 8, ["title"]), d(T(A), {
				loading: L.value || R.value,
				disabled: ce.value || !!H.value,
				onClick: Qe
			}, {
				default: D(() => [...n[7] ||= [u("重试", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"])])) : o("", !0),
			B.value ? (y(), a(T(oe), {
				key: 4,
				title: B.value,
				type: V.value,
				closable: !1
			}, null, 8, ["title", "type"])) : o("", !0),
			Oe.value ? (y(), s("div", oa, [c("div", null, [n[8] ||= c("strong", null, "原配置操作结果待确认", -1), c("small", null, w(Oe.value.command.site_id) + " · " + w(Oe.value.command.symbol) + " · " + w(Oe.value.command.client_request_id), 1)]), c("div", sa, [d(T(A), {
				type: "warning",
				loading: ce.value,
				disabled: !Me.value || pe.value,
				onClick: qe
			}, {
				default: D(() => [...n[9] ||= [u("查询原操作回执", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"]), Ne.value || pe.value ? (y(), a(T(A), {
				key: 0,
				type: "warning",
				disabled: !Ne.value,
				onClick: Je
			}, {
				default: D(() => [...n[10] ||= [u("恢复原请求", -1)]]),
				_: 1
			}, 8, ["disabled"])) : o("", !0)])])) : o("", !0),
			d(nn, {
				loading: L.value,
				"min-height": "0px",
				class: "grid-loading-region"
			}, {
				default: D(() => [c("div", ca, [c("aside", la, [
					c("div", ua, [n[11] ||= c("strong", null, "交易对配置", -1), c("span", null, w(Te.value.length) + " 条", 1)]),
					ie.value.length > 1 ? (y(), a(T(de), {
						key: 0,
						modelValue: E.value,
						"onUpdate:modelValue": n[0] ||= (e) => E.value = e,
						"aria-label": "选择站点",
						disabled: Ae.value,
						onChange: ze
					}, {
						default: D(() => [(y(!0), s(r, null, re(ie.value, (e) => (y(), a(T(ue), {
							key: e.site_id,
							label: e.site_id,
							value: e.site_id
						}, null, 8, ["label", "value"]))), 128))]),
						_: 1
					}, 8, ["modelValue", "disabled"])) : o("", !0),
					K.value ? (y(), s("p", da, [u(w(K.value), 1), d(T(A), {
						link: "",
						type: "primary",
						disabled: Ae.value,
						onClick: Qe
					}, {
						default: D(() => [...n[12] ||= [u("重试", -1)]]),
						_: 1
					}, 8, ["disabled"])])) : o("", !0),
					d(T(t), {
						modelValue: k.value,
						"onUpdate:modelValue": n[1] ||= (e) => k.value = e,
						clearable: "",
						placeholder: "搜索交易对",
						"aria-label": "搜索交易对"
					}, null, 8, ["modelValue"]),
					c("div", fa, [(y(!0), s(r, null, re(Te.value, (e) => (y(), s("div", {
						key: e.symbol,
						class: ee(["symbol-row", { active: e.symbol === O.value }])
					}, [
						c("button", {
							type: "button",
							class: "symbol-button",
							disabled: !e.configured || Ae.value && e.symbol !== O.value,
							onClick: (t) => Be(e.symbol)
						}, [d(T(_), { symbol: e.symbol }, null, 8, ["symbol"])], 8, pa),
						e.configured ? (y(), a(T(fe), {
							key: 1,
							"model-value": He(e),
							disabled: Ue(e),
							"aria-label": `${e.symbol} 开放配置`,
							onChange: (t) => We(e, t)
						}, null, 8, [
							"model-value",
							"disabled",
							"aria-label",
							"onChange"
						])) : (y(), s("span", ma, "未配置")),
						e.symbol === O.value && Ee.value ? (y(), s("small", ha, "未保存")) : o("", !0)
					], 2))), 128)), !L.value && Ce.value && !Te.value.length ? (y(), a(T(F), {
						key: 0,
						description: "当前站点没有已授权的预测网格产品",
						"image-size": 56
					})) : o("", !0)])
				]), c("main", ga, [!L.value && !ie.value.length && !z.value ? (y(), a(T(F), {
					key: 0,
					description: "当前账号暂无授权站点"
				})) : Ce.value && !O.value ? (y(), a(T(F), {
					key: 1,
					description: "请选择交易对查看配置"
				})) : j.value && M.value ? (y(), s(r, { key: 2 }, [
					c("header", _a, [c("div", null, [
						c("h2", null, w(j.value.symbol) + " · 预测网格", 1),
						c("p", va, "更新时间 " + w(Fe.value), 1),
						ie.value.length > 1 ? (y(), s("p", ya, "当前站点：" + w(j.value.site_id), 1)) : o("", !0)
					]), c("div", ba, [d(T(A), { onClick: n[2] ||= (e) => se.value = !0 }, {
						default: D(() => [...n[13] ||= [u("玩法说明", -1)]]),
						_: 1
					}), T(S) ? (y(), a(T(A), {
						key: 0,
						type: "primary",
						loading: ce.value,
						disabled: !je.value || !Ee.value,
						onClick: Ke
					}, {
						default: D(() => [...n[14] ||= [u("保存配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])) : o("", !0)])]),
					j.value.requested_agent_id === "0" ? o("", !0) : (y(), s("p", xa, w(j.value.inherited ? "当前继承平台配置" : "当前使用商户配置") + "；平台更新后恢复平台配置。平台返奖率上限 " + w(j.value.default_target_rtp ? `${T(Ni)(j.value.default_target_rtp)}%` : "—") + "，单笔范围 " + w(j.value.default_min_order_amount) + " ~ " + w(j.value.default_max_order_amount) + " USDT。", 1)),
					j.value.default_enabled === !1 ? (y(), a(T(oe), {
						key: 1,
						title: "平台已关闭此币种，商户不能开启",
						type: "info",
						closable: !1
					})) : o("", !0),
					d(nn, { loading: R.value }, {
						default: D(() => [
							j.value.layout ? (y(), s("article", Sa, [n[15] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "价格精度"), c("p", { class: "parameter-description" }, "由平台统一设置，商户只读")], -1), c("div", Ca, [c("label", null, [c("span", null, "价格小数位：" + w(j.value.layout.price_decimals == null ? "未设置（沿用原规则）" : `${j.value.layout.price_decimals} 位`), 1)])])])) : o("", !0),
							c("article", wa, [n[19] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "赔率配置"), c("p", { class: "parameter-description" }, "格子赔率按目标返奖率与命中概率动态计算")], -1), c("div", Ta, [c("label", null, [
								c("span", null, [n[16] ||= u("目标返奖率", -1), d(on, {
									label: "目标返奖率",
									content: "例如 97%：命中概率为 20% 时，计算赔率为 4.85x。"
								})]),
								d(pn, {
									"input-component": T(t),
									modelValue: N.value,
									"onUpdate:modelValue": n[3] ||= (e) => N.value = e,
									disabled: !je.value,
									inputmode: "decimal",
									onInput: Ge
								}, {
									append: D(() => [...n[17] ||= [u("%", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								]),
								n[18] ||= c("small", null, "例如 97%：命中概率为 20% 时，计算赔率为 4.85x", -1)
							])])]),
							c("article", Ea, [c("header", Da, [n[20] ||= c("h3", null, "下注限制", -1), c("p", Oa, w(j.value.symbol) + " 每个格子生成一笔独立订单", 1)]), c("div", ka, [c("label", null, [c("span", null, [n[21] ||= u("最小下注金额", -1), d(on, { label: "最小下注金额" })]), d(pn, {
								"input-component": T(t),
								modelValue: M.value.min_order_amount,
								"onUpdate:modelValue": n[4] ||= (e) => M.value.min_order_amount = e,
								disabled: !je.value,
								inputmode: "decimal",
								onInput: Ge
							}, {
								append: D(() => [...n[22] ||= [u("USDT", -1)]]),
								_: 1
							}, 8, [
								"input-component",
								"modelValue",
								"disabled"
							])]), c("label", null, [c("span", null, [n[23] ||= u("最大下注金额", -1), d(on, { label: "最大下注金额" })]), d(pn, {
								"input-component": T(t),
								modelValue: M.value.max_order_amount,
								"onUpdate:modelValue": n[5] ||= (e) => M.value.max_order_amount = e,
								disabled: !je.value,
								inputmode: "decimal",
								onInput: Ge
							}, {
								append: D(() => [...n[24] ||= [u("USDT", -1)]]),
								_: 1
							}, 8, [
								"input-component",
								"modelValue",
								"disabled"
							])])])]),
							T(S) ? o("", !0) : (y(), a(T(oe), {
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
			d(Bn, {
				modelValue: se.value,
				"onUpdate:modelValue": n[6] ||= (e) => se.value = e
			}, null, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-80f76425"]]), ja = [
	"35",
	"40",
	"45",
	"60",
	"90"
], Ma = "prediction.agent.pending.v1", Na = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Pa(e, t = "INVALID_CONFIGURATION") {
	if (!e) throw Error(t);
}
function Fa(e) {
	Pa(Na(e)), Pa(e.scope === "CONFIG_SCOPE_AGENT" && zr(e.agent_id) === e.agent_id), Pa(Rr(e.template_version) && Rr(e.agent_version) && Z(e.effective_version, 256) && Rr(e.updated_at_ms)), Pa(Array.isArray(e.rules) && e.rules.length === 5);
	let t = e.rules, n = t[0]?.symbol;
	Pa(Z(n, 64, !0)), Pa(new Set(t.map((e) => e.duration_seconds)).size === 5);
	for (let e of t) Pa(Na(e) && e.game_type === "GAME_TYPE_UP_DOWN" && e.symbol === n && ja.includes(e.duration_seconds) && typeof e.enabled == "boolean"), Pa(Array.isArray(e.stake_tiers) && e.stake_tiers.every((e) => Na(e) && Z(e.stake_tier_id) && typeof e.enabled == "boolean" && typeof e.retired == "boolean"));
}
function Ia(e) {
	return Fa(e), e.rules[0].symbol;
}
function La(e, t) {
	Pa(Object.keys(e).length === t.length && Object.keys(e).every((e) => t.includes(e)), "PENDING_CORRUPT");
}
function Ra(e) {
	Pa(Na(e), "PENDING_CORRUPT"), La(e, [
		"client_request_id",
		"reason",
		"based_on_template_version",
		"based_on_agent_version",
		"game_type",
		"symbol",
		"agent_override"
	]), Pa(Z(e.client_request_id, 128) && Z(e.reason, 500) && Rr(e.based_on_template_version) && Rr(e.based_on_agent_version) && e.game_type === "UP_DOWN" && Z(e.symbol, 64, !0), "PENDING_CORRUPT");
	let t = e.agent_override;
	Pa(Na(t), "PENDING_CORRUPT"), La(t, ["enabled", "overrides"]), Pa(typeof t.enabled == "boolean" && Array.isArray(t.overrides) && t.overrides.length === 5, "PENDING_CORRUPT");
	let n = t.overrides;
	Pa(new Set(n.map((e) => e.duration_seconds)).size === 5, "PENDING_CORRUPT");
	for (let e of n) {
		Pa(Na(e), "PENDING_CORRUPT"), La(e, [
			"duration_seconds",
			"enabled",
			"stake_tiers"
		]), Pa(ja.includes(e.duration_seconds) && typeof e.enabled == "boolean" && Array.isArray(e.stake_tiers) && e.stake_tiers.length === 1, "PENDING_CORRUPT");
		let t = e.stake_tiers[0];
		Pa(Na(t), "PENDING_CORRUPT"), La(t, [
			"stake_tier_id",
			"enabled",
			"maximum_stake"
		]), Pa(Z(t.stake_tier_id) && t.enabled === e.enabled && Br(t.maximum_stake) && Vr(t.maximum_stake, "1") >= 0, "PENDING_CORRUPT");
	}
	Pa(t.enabled === n.some((e) => e.enabled), "PENDING_CORRUPT");
}
function za(e) {
	if (e && typeof e == "object") {
		Object.freeze(e);
		for (let t of Object.values(e)) za(t);
	}
	return e;
}
function Ba(e) {
	let t = e.getItem(Ma);
	if (t === null) return null;
	Pa(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return Pa(Na(n), "PENDING_CORRUPT"), La(n, [
		"schema",
		"operator_id",
		"agent_id",
		"body",
		"attempted",
		"attempt"
	]), Pa(n.schema === 1 && zr(n.operator_id) === n.operator_id && zr(n.agent_id) === n.agent_id && typeof n.attempted == "boolean" && Number.isSafeInteger(n.attempt) && Number(n.attempt) >= 0 && n.attempted === Number(n.attempt) > 0, "PENDING_CORRUPT"), Ra(n.body), za(n);
}
var Va = (e, t) => !!e && e.operator_id === t.operator_id && e.agent_id === t.agent_id && JSON.stringify(e.body) === JSON.stringify(t.body);
function Ha(e, t) {
	Va(Ba(e), t) && e.removeItem(Ma);
}
function Ua(e, t, n, r) {
	try {
		Pa(Na(e) && Na(e.receipt)), Fa(e.configuration), Pa(e.configuration.agent_id === r && e.configuration.rules[0].symbol === t.symbol);
		let i = e.receipt;
		return Pa([
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
		].every((e) => typeof i[e] == "string")), Pa(Z(i.operation_id, 256) && Z(i.trace_id, 256) && Rr(i.created_at_ms) && Rr(i.completed_at_ms)), Pa(i.client_request_id === t.client_request_id && i.operator_id === n && i.source_service === "agent_admin" && i.result === "OPERATION_RESULT_SUCCEEDED" && i.reason === t.reason), !0;
	} catch {
		return !1;
	}
}
function Wa(e) {
	return Na(e) ? [
		"INVALID_ARGUMENT",
		"UNAUTHENTICATED",
		"PERMISSION_DENIED",
		"NOT_FOUND",
		"CONFLICT"
	].includes(String(e.error_code)) ? !0 : Na(e.response) && [
		401,
		403,
		422
	].includes(Number(e.response.status)) : !1;
}
var Ga = /* @__PURE__ */ new WeakMap();
function Ka(e, t, n) {
	let r = Ga.get(e);
	if (r) return Pa(Va(r.pending, t), "PENDING_EXISTS"), r.promise;
	let i = Ba(e);
	Pa(Va(i, t), "PENDING_CHANGED");
	let a = i.attempted, o = i.attempt + 1;
	Pa(Number.isSafeInteger(o), "ATTEMPT_LIMIT"), e.setItem(Ma, JSON.stringify({
		...i,
		attempted: !0,
		attempt: o
	}));
	let s = Ba(e);
	Pa(s?.attempt === o && Va(s, t), "PERSISTENCE_UNAVAILABLE");
	let c = Promise.resolve().then(async () => {
		try {
			let r = await n(t.body);
			return Va(Ba(e), t) ? Ua(r, t.body, t.operator_id, t.agent_id) ? (Ha(e, t), {
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
			let r = Ba(e);
			if (!Va(r, t)) return {
				status: "superseded",
				error: n
			};
			let i = Na(n) && n.client_request_id !== void 0 && n.client_request_id !== t.body.client_request_id;
			return !a && r.attempt === o && !i && Wa(n) ? (Ha(e, t), {
				status: "rejected",
				error: n
			}) : {
				status: "unknown",
				error: n
			};
		}
	}).finally(() => {
		Ga.get(e)?.promise === c && Ga.delete(e);
	});
	return Ga.set(e, {
		pending: t,
		promise: c
	}), c;
}
//#endregion
//#region src/prediction-config/agent/views/prediction/game-config/owner-mutation.ts
function qa(e) {
	Q(li(e), "IDENTITY_UNCONFIRMED");
}
var Ja = "prediction.owner.pending.v1";
function Ya(e, t, n = []) {
	Q(t.every((t) => Object.hasOwn(e, t)) && Object.keys(e).every((e) => t.includes(e) || n.includes(e)), "PENDING_CORRUPT");
}
function Xa(e) {
	Q(Xr(e), "PENDING_CORRUPT"), Ya(e, [
		"game_type",
		"symbol",
		"based_owner_revision",
		"changes",
		"client_request_id",
		"reason"
	], ["enabled"]), Q(e.enabled === void 0 || typeof e.enabled == "boolean", "PENDING_CORRUPT"), Q(["UP_DOWN", "HIGH_LOW"].includes(String(e.game_type)) && Z(e.symbol, 64, !0) && Z(e.client_request_id, 128) && Z(e.reason, 500) && Rr(e.based_owner_revision), "PENDING_CORRUPT"), Q(Array.isArray(e.changes) && (e.changes.length > 0 || e.enabled !== void 0) && e.changes.length <= 100 && new Set(e.changes.map((e) => e.duration_seconds)).size === e.changes.length, "PENDING_CORRUPT");
	for (let t of e.changes) Q(Xr(t)), Ya(t, [
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
	]), Q(t.enabled === void 0 || typeof t.enabled == "boolean", "PENDING_CORRUPT"), e.game_type === "UP_DOWN" ? (Q(t.fixed_odds === void 0, "PENDING_CORRUPT"), (t.target_payout_rate !== void 0 || t.maximum_odds !== void 0) && Q(ui(t.target_payout_rate) && Vr(t.target_payout_rate, "1") <= 0 && ui(t.maximum_odds) && Vr(t.maximum_odds, "1") >= 0, "PENDING_CORRUPT")) : (Q(t.target_payout_rate === void 0 && t.maximum_odds === void 0, "PENDING_CORRUPT"), t.fixed_odds !== void 0 && Q(ui(t.fixed_odds) && Vr(t.fixed_odds, "1") > 0, "PENDING_CORRUPT")), Q(Rr(t.duration_seconds, !0) && Rr(t.based_rule_epoch, !0) && (e.game_type === "UP_DOWN" ? Yr.includes(t.duration_seconds) && Z(t.stake_tier_id) : t.stake_tier_id === ""), "PENDING_CORRUPT"), Q(ui(t.minimum_stake) && ui(t.maximum_stake) && Vr(t.minimum_stake, t.maximum_stake) <= 0, "PENDING_CORRUPT");
}
function Za(e) {
	let t = e.getItem(Ja);
	if (t === null) return null;
	Q(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return Q(Xr(n)), Ya(n, [
		"schema",
		"operator_id",
		"agent_id",
		"body",
		"attempted",
		"attempt"
	]), qa(n), Q(n.schema === "owner-v1" && typeof n.attempted == "boolean" && Number.isSafeInteger(n.attempt) && Number(n.attempt) >= 0 && n.attempted === Number(n.attempt) > 0, "PENDING_CORRUPT"), Xa(n.body), Zr(n);
}
var Qa = (e, t) => !!e && e.operator_id === t.operator_id && e.agent_id === t.agent_id && JSON.stringify(e.body) === JSON.stringify(t.body);
function $a(e, t, n) {
	qa(t), Xa(n), Q(Za(e) === null, "PENDING_EXISTS");
	let r = {
		schema: "owner-v1",
		...t,
		body: JSON.parse(JSON.stringify(n)),
		attempted: !1,
		attempt: 0
	};
	return e.setItem(Ja, JSON.stringify(r)), Q(Qa(Za(e), r), "PERSISTENCE_UNAVAILABLE"), Zr(r);
}
function eo(e, t) {
	Qa(Za(e), t) && e.removeItem(Ja);
}
function to(e, t) {
	try {
		Q(Xr(e) && Xr(e.receipt)), fi(e.configuration, t);
		let n = t.body, r = e.configuration, i = e.receipt;
		Q(r.symbol === n.symbol && r.game_type === "GAME_TYPE_" + n.game_type && BigInt(r.owner_revision) === BigInt(n.based_owner_revision) + 1n), n.enabled !== void 0 && Q(r.enabled === n.enabled);
		for (let e of n.changes) {
			let t = r.rules.find((t) => t.rule.duration_seconds === e.duration_seconds);
			Q(t && t.rule_epoch === e.based_rule_epoch), e.enabled !== void 0 && Q(t.owner_enabled === e.enabled);
			for (let n of [
				"target_payout_rate",
				"maximum_odds",
				"fixed_odds"
			]) e[n] !== void 0 && Q(Vr(t.rule[n], e[n]) === 0);
			let i = n.game_type === "UP_DOWN" ? ci(t.rule) : t.rule;
			Q(("stake_tier_id" in i ? i.stake_tier_id : "") === e.stake_tier_id && Vr(i.minimum_stake, e.minimum_stake) === 0 && Vr(i.maximum_stake, e.maximum_stake) === 0);
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
		].every((e) => typeof i[e] == "string")), Q(Z(i.operation_id, 256) && Z(i.trace_id, 256) && Z(i.target_id, 256) && Rr(i.created_at_ms) && Rr(i.completed_at_ms)), Q(i.operator_id === t.operator_id && i.client_request_id === n.client_request_id && i.reason === n.reason && i.source_service === "agent_admin"), Q(i.result === "OPERATION_RESULT_SUCCEEDED" && i.error_code === "" && i.action === "ADMIN_ACTION_OWNER_CONFIG_PUBLISH" && i.capability === "prediction.owner.config.publish" && i.target_type === "owner_config"), !0;
	} catch {
		return !1;
	}
}
var no = /* @__PURE__ */ new WeakMap();
function ro(e, t, n) {
	let r = no.get(e);
	if (r) return Q(Qa(r.pending, t), "PENDING_EXISTS"), r.promise;
	let i = Za(e);
	Q(Qa(i, t), "PENDING_CHANGED");
	let a = i.attempted, o = i.attempt + 1;
	Q(Number.isSafeInteger(o), "ATTEMPT_LIMIT"), e.setItem(Ja, JSON.stringify({
		...i,
		attempted: !0,
		attempt: o
	}));
	let s = Za(e);
	Q(s?.attempt === o && Qa(s, t), "PERSISTENCE_UNAVAILABLE");
	let c = Promise.resolve().then(async () => {
		try {
			let r = await n(t.body);
			return Qa(Za(e), t) ? to(r, t) ? (eo(e, t), {
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
			let r = Za(e);
			if (!Qa(r, t)) return {
				status: "superseded",
				error: n
			};
			let i = Xr(n) && n.client_request_id !== void 0 && n.client_request_id !== t.body.client_request_id;
			return !a && r.attempt === o && !i && Wa(n) ? (eo(e, t), {
				status: "rejected",
				error: n
			}) : {
				status: "unknown",
				error: n
			};
		}
	}).finally(() => {
		no.get(e)?.promise === c && no.delete(e);
	});
	return no.set(e, {
		pending: t,
		promise: c
	}), c;
}
async function io(e, t, n, r) {
	let i = await ro(e, t, n);
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
//#region src/prediction-config/agent/views/prediction/game-config/OwnerConfig.vue?vue&type=script&setup=true&lang.ts
var ao = {
	class: "prediction-config prediction-table-page",
	"data-prediction-page": "OWNER_CONFIG"
}, oo = {
	class: "game-tabs",
	"aria-label": "选择预测玩法"
}, so = {
	class: "game-choice-icon",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	"aria-hidden": "true"
}, co = { class: "game-choice-content" }, lo = {
	key: 0,
	role: "alert"
}, uo = {
	key: 1,
	role: "alert"
}, fo = {
	key: 3,
	class: "config-layout"
}, po = {
	class: "symbol-directory",
	"aria-label": "交易对配置"
}, mo = {
	key: 0,
	role: "status"
}, ho = {
	key: 1,
	class: "catalog-error",
	role: "alert"
}, go = { class: "symbol-list" }, _o = [
	"aria-pressed",
	"disabled",
	"onClick"
], vo = ["title"], yo = { class: "symbol-all-control" }, bo = { key: 2 }, xo = { class: "config-content" }, So = { class: "config-title" }, Co = { class: "config-title-actions" }, wo = {
	key: 0,
	class: "draft-label"
}, To = {
	key: 0,
	role: "alert"
}, Eo = {
	key: 1,
	role: "status"
}, Do = { class: "config-note" }, Oo = {
	key: 0,
	class: "config-note"
}, ko = { class: "parameter-card room-config" }, Ao = { class: "parameter-heading" }, jo = { class: "field-description" }, Mo = { class: "room-config-body" }, No = { class: "parameter-cards" }, Po = {
	class: "parameter-card",
	"data-price-precision": !0
}, Fo = { class: "room-config-body" }, Io = { class: "field-label" }, Lo = {
	key: 0,
	class: "config-note"
}, Ro = { class: "parameter-card" }, zo = { class: "parameter-heading" }, Bo = { class: "field-description" }, Vo = {
	key: 0,
	class: "limit-fields odds-fields"
}, Ho = {
	key: 1,
	class: "limit-fields"
}, Uo = { class: "parameter-card" }, Wo = { class: "parameter-heading" }, Go = { class: "field-description" }, Ko = { class: "limit-fields" }, qo = /*#__PURE__*/ e(/* @__PURE__ */ f({
	__name: "OwnerConfig",
	props: { actor: {} },
	setup(e) {
		let { ownerConfigurations: n, ownerConfiguration: l, saveOwnerConfiguration: f, siteDirectorySymbols: p } = he().api, m = _e(), h = e, g = ge(), _ = [
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
		], v = b("UP_DOWN"), ne = C([]), x = b(""), S = b(""), ie = b([]), E = b(!1), O = b(!1), k = b(""), oe = b(""), j = C(null), M = b(!1), N = b(!1), P = new hi(), F = !0, se = () => F && li(h.actor) && zr(g.userInfo.id) === h.actor.operator_id && g.userInfo.can_manage_prediction_config === !0 && (g.perms.includes("*") || g.perms.includes("prediction_config:lists")), L = i(() => se() && !M.value && !N.value), R = i(() => ne.value.find((e) => e.symbol === x.value)), ce = b("35"), le = b(0), ue = i(() => ie.value.filter((e) => e.owner_enabled && e.platform_enabled)), z = i(() => ue.value.find((e) => e.duration_seconds === ce.value)), de = i(() => ie.value.map((e) => ({
			key: e.duration_seconds,
			label: `${e.observation_seconds}秒`,
			present: e.owner_enabled && e.platform_enabled,
			allowed: e.platform_enabled
		})));
		function B(e, t) {
			if (!L.value || O.value || j.value || E.value) return;
			let n = ie.value.find((t) => t.duration_seconds === e);
			!n || n.owner_enabled === t || t && !n.platform_enabled || (n.owner_enabled = t, ce.value = t ? e : ue.value[0]?.duration_seconds ?? "");
		}
		function V(e) {
			let t = e.symbol === x.value ? ue.value.map((e) => e.observation_seconds) : e.rules.filter((e) => e.owner_enabled && e.platform_enabled).map((e) => v.value === "UP_DOWN" ? String(BigInt(e.rule.duration_seconds) - 30n) : e.rule.duration_seconds);
			return t.length ? t.map((e) => `${e}秒`).join(" · ") : "暂无房间";
		}
		let H = b(!0), U = () => JSON.stringify([H.value, ie.value.map((e) => [
			e.minimum_stake,
			e.maximum_stake,
			e.owner_enabled,
			e.target_payout_rate,
			e.maximum_odds,
			e.fixed_odds
		])]), W = b(""), pe = i(() => U() !== W.value), G = C(), me = i(() => O.value || pe.value || !!j.value || v.value === "GRID" && !!G.value?.hasBlockingWork), ve = b([]), ye = i(() => _i(ne.value.filter((e) => e.platform_enabled), ve.value, (e) => e.platform_enabled && e.enabled).filter((e) => e.symbol.includes(S.value.trim().toUpperCase())));
		function be() {
			try {
				j.value = Za(localStorage), M.value = ["prediction.agent.pending.v1", "prediction.site.pending.v1"].some((e) => localStorage.getItem(e) !== null), N.value = !1;
			} catch {
				N.value = !0;
			}
		}
		function xe() {
			le.value++, ie.value = R.value ? pi(R.value, h.actor) : [], H.value = R.value?.enabled ?? !0, ue.value.some((e) => e.duration_seconds === ce.value) || (ce.value = ue.value[0]?.duration_seconds ?? ""), W.value = U();
		}
		function Se(e) {
			me.value || (x.value = e, oe.value = "", xe());
		}
		function Ce(e) {
			me.value || (v.value = e, we());
		}
		async function we() {
			let e = v.value, t = P.begin(h.actor, e, "");
			if (ne.value = [], x.value = "", xe(), k.value = "", E.value = !1, !(!se() || e === "GRID")) {
				E.value = !0;
				try {
					let [r, i] = await Promise.all([n(e), p()]);
					if (!P.current(t, h.actor, v.value, "") || !se()) return;
					if (!Array.isArray(r.items) || new Set(r.items.map((e) => e.symbol)).size !== r.items.length) throw Error("INVALID_CATALOG");
					for (let t of r.items) if (fi(t, h.actor), t.game_type !== "GAME_TYPE_" + e) throw Error("WRONG_GAME");
					if (!Array.isArray(i) || !i.every((e) => typeof e == "string")) throw Error("INVALID_SYMBOL_DIRECTORY");
					ve.value = i, ne.value = r.items, x.value = ye.value[0]?.symbol ?? "", xe();
				} catch {
					P.current(t, h.actor, v.value, "") && se() && (k.value = "配置加载失败，请重试。");
				} finally {
					P.current(t, h.actor, v.value, "") && (E.value = !1);
				}
			}
		}
		async function K() {
			if (be(), !L.value || O.value) return;
			let e = v.value, t = x.value;
			try {
				if (!j.value) {
					if (!R.value) return;
					j.value = $a(localStorage, h.actor, mi(R.value, h.actor, ie.value, "通过商户玩法配置页面保存配置", Qr(), H.value));
				}
				let n = j.value;
				if (n.operator_id !== h.actor.operator_id || n.agent_id !== h.actor.agent_id) return;
				O.value = !0, oe.value = "";
				let r = await io(localStorage, n, (e) => {
					if (!se()) throw Error("IDENTITY_CHANGED");
					return f(e);
				}, async (e) => {
					if (!se()) throw Error("IDENTITY_CHANGED");
					let t = await l(e.game_type, e.symbol);
					if (fi(t.configuration, h.actor), t.configuration.symbol !== e.symbol || t.configuration.game_type !== "GAME_TYPE_" + e.game_type) throw Error("WRONG_CONFIGURATION");
					return t.configuration;
				});
				if (!se() || v.value !== e || x.value !== t) return;
				be(), r.status === "success" ? (oe.value = r.refreshFailed ? "保存已成功，配置刷新失败，请重新打开页面查看；无需再次保存。" : "配置已保存并生效。", r.latest && r.latest.symbol === x.value && r.latest.game_type === "GAME_TYPE_" + v.value ? (ne.value = ne.value.map((e) => e.symbol === x.value ? r.latest : e), xe()) : (ne.value = [], x.value = "", xe(), k.value = "保存已确认，请重试读取最新配置。")) : (oe.value = r.status === "rejected" ? "保存未通过，请重新读取配置后调整。" : "暂未确认保存结果，请稍后使用原请求确认。", r.status === "rejected" && (k.value = "保存被拒绝，请读取最新配置后修改。"));
			} catch (e) {
				oe.value = e instanceof Error && e.message === "NO_CHANGES" ? "配置没有变化。" : "无法保存，请检查金额、赔率范围及待确认请求。";
			} finally {
				O.value = !1;
			}
		}
		return be(), we(), ae(() => [
			g.userInfo.id,
			g.token,
			g.userInfo.can_manage_prediction_config,
			g.perms.join("|")
		], () => {
			P.close(), ne.value = [], ie.value = [], W.value = "[]", x.value = "", oe.value = "", be();
		}, { flush: "sync" }), te(() => {
			F = !1, P.close();
		}), (n, i) => (y(), s("section", ao, [
			c("nav", oo, [(y(), s(r, null, re(_, (e) => d(T(A), {
				key: e.key,
				type: v.value === e.key ? "primary" : void 0,
				"aria-pressed": v.value === e.key,
				disabled: me.value,
				onClick: (t) => Ce(e.key)
			}, {
				default: D(() => [(y(), s("svg", so, [e.key === "UP_DOWN" ? (y(), s(r, { key: 0 }, [i[8] ||= c("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}, null, -1), i[9] ||= c("path", { d: "m16 12-4-4-4 4M12 16V8" }, null, -1)], 64)) : e.key === "HIGH_LOW" ? (y(), s(r, { key: 1 }, [i[10] ||= c("path", { d: "m9 9 5 12 1.8-5.2L21 14Z" }, null, -1), i[11] ||= c("path", { d: "M7.2 2.2 8 5.1M5.1 8l-2.9-.8M14 4.1 12 6M6 12l-1.9 2" }, null, -1)], 64)) : (y(), s(r, { key: 2 }, [i[12] ||= c("rect", {
					x: "3",
					y: "3",
					width: "18",
					height: "18",
					rx: "2"
				}, null, -1), i[13] ||= c("path", { d: "M9 3v18M15 3v18M3 9h18M3 15h18" }, null, -1)], 64))])), c("span", co, [c("strong", null, w(e.label), 1), c("small", null, w(e.description), 1)])]),
				_: 2
			}, 1032, [
				"type",
				"aria-pressed",
				"disabled",
				"onClick"
			])), 64))]),
			M.value ? (y(), s("p", lo, "发现旧配置模式尚未确认的请求，已保留原请求。请联系管理员核对原操作回执后完成迁移，当前暂停新配置保存。")) : o("", !0),
			N.value ? (y(), s("p", uo, "无法读取或保全待确认请求，当前暂停配置保存。")) : o("", !0),
			v.value === "GRID" ? (y(), a(Aa, {
				key: 2,
				ref_key: "gridRef",
				ref: G,
				class: "grid-mode"
			}, null, 512)) : (y(), s("div", fo, [c("aside", po, [
				c("h3", null, [i[14] ||= u("交易对配置 ", -1), c("small", null, w(ne.value.filter((e) => e.platform_enabled).length) + " 条", 1)]),
				d(T(t), {
					modelValue: S.value,
					"onUpdate:modelValue": i[0] ||= (e) => S.value = e,
					placeholder: "搜索币种",
					"aria-label": "搜索币种",
					clearable: ""
				}, null, 8, ["modelValue"]),
				E.value ? (y(), s("p", mo, "正在加载配置…")) : o("", !0),
				k.value ? (y(), s("div", ho, [u(w(k.value) + " ", 1), d(T(A), {
					size: "small",
					disabled: O.value || !!j.value || E.value,
					onClick: we
				}, {
					default: D(() => [...i[15] ||= [u("读取最新配置（放弃未保存修改）", -1)]]),
					_: 1
				}, 8, ["disabled"])])) : o("", !0),
				c("div", go, [(y(!0), s(r, null, re(ye.value, (e) => (y(), s("div", {
					key: e.symbol,
					class: ee(["symbol-entry", { selected: e.symbol === x.value }])
				}, [c("button", {
					class: "symbol-option",
					"aria-pressed": e.symbol === x.value,
					disabled: me.value,
					onClick: (t) => Se(e.symbol)
				}, [d(T(m), { symbol: e.symbol }, null, 8, ["symbol"]), c("span", {
					class: "symbol-status",
					title: V(e)
				}, w(V(e)), 9, vo)], 8, _o), c("div", yo, [d(T(fe), {
					"aria-label": e.symbol === x.value ? "币种开关" : `${e.symbol} 币种开关`,
					modelValue: e.symbol === x.value ? H.value : e.enabled,
					disabled: e.symbol !== x.value || !L.value || O.value || !!j.value || !e.platform_enabled,
					"onUpdate:modelValue": i[1] ||= (e) => H.value = !!e
				}, null, 8, [
					"aria-label",
					"modelValue",
					"disabled"
				])])], 2))), 128))]),
				!E.value && !k.value && !ye.value.length ? (y(), s("p", bo, "当前没有可用的交易对配置。")) : o("", !0)
			]), c("main", xo, [
				c("header", So, [c("div", null, [c("h3", null, w(x.value || "请选择交易对") + " · " + w(v.value === "UP_DOWN" ? "涨跌预测" : "自选预测"), 1), i[16] ||= c("p", null, "当前商户生效", -1)]), c("div", Co, [pe.value ? (y(), s("span", wo, "有未保存修改")) : o("", !0), R.value || j.value ? (y(), a(T(A), {
					key: 1,
					type: "primary",
					loading: O.value,
					disabled: !L.value || O.value || !j.value && !pe.value || !!j.value && j.value.operator_id !== e.actor.operator_id,
					onClick: K
				}, {
					default: D(() => [u(w(j.value ? "确认原保存结果" : "保存配置"), 1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : o("", !0)])]),
				j.value ? (y(), s("p", To, "存在待确认操作（" + w(j.value.body.symbol) + "），请使用原请求确认结果。" + w(j.value.operator_id === e.actor.operator_id ? "" : "该操作属于另一个账号，需切回原账号处理。"), 1)) : o("", !0),
				oe.value ? (y(), s("p", Eo, w(oe.value), 1)) : o("", !0),
				R.value ? (y(), s(r, { key: 2 }, [
					c("p", Do, "可关闭自己的币种或房间，并在平台范围内调整" + w(v.value === "UP_DOWN" ? "限额和目标返奖率，最高赔率使用平台配置" : "限额和赔率") + "。平台修改对应房间后，限额和赔率恢复平台值，您主动关闭的选择会保留。", 1),
					H.value ? o("", !0) : (y(), s("p", Oo, "交易对已关闭；以下房间设置仍会保留。")),
					c("article", ko, [c("header", Ao, [i[17] ||= c("h4", null, "房间配置", -1), c("p", jo, w(x.value) + " · 当前商户生效", 1)]), c("div", Mo, [
						i[18] ||= c("span", { class: "field-label" }, "支持周期", -1),
						d(wn, {
							description: `${x.value} · ${v.value === "UP_DOWN" ? "涨跌预测" : "自选预测"}`,
							rooms: de.value,
							selected: ce.value,
							disabled: !L.value || O.value || !!j.value || E.value,
							context: `${e.actor.operator_id}:${e.actor.agent_id}:${v.value}:${x.value}:${le.value}`,
							onSelect: i[2] ||= (e) => ce.value = e,
							onChange: B
						}, null, 8, [
							"description",
							"rooms",
							"selected",
							"disabled",
							"context"
						]),
						i[19] ||= c("p", { class: "config-note" }, "变更只影响新订单，历史订单保留原配置快照。", -1)
					])]),
					c("div", No, [c("article", Po, [i[21] ||= c("header", { class: "parameter-heading" }, [c("h4", null, "价格精度"), c("p", { class: "field-description" }, "由平台统一设置，商户只读")], -1), c("div", Fo, [c("p", Io, "价格小数位：" + w(R.value.rules[0]?.rule.price_rule?.price_decimals === void 0 ? "未设置（沿用原规则）" : `${R.value.rules[0].rule.price_rule.price_decimals} 位`), 1), i[20] ||= c("p", { class: "config-note" }, "按所选位数截断，不四舍五入；旧订单保留原规则。", -1)])]), z.value ? (y(), s(r, { key: 0 }, [
						z.value.platform_enabled ? o("", !0) : (y(), s("p", Lo, "平台已关闭此房间，暂不能开启。")),
						c("article", Ro, [c("header", zo, [c("h4", null, "赔率配置 · " + w(z.value.observation_seconds) + " 秒", 1), c("p", Bo, w(v.value === "UP_DOWN" ? "上涨/下跌赔率按资金池动态计算" : "下单时锁定当前周期固定赔率，上涨和下跌使用相同赔率。"), 1)]), v.value === "UP_DOWN" ? (y(), s("div", Vo, [d(T(I), { label: `目标返奖率（平台上限 ${T(ln)(z.value.platform_target_payout_rate, 2)}%，且必须小于 100%）` }, {
							default: D(() => [d(pn, {
								"input-component": T(t),
								modelValue: z.value.target_payout_rate,
								"onUpdate:modelValue": i[3] ||= (e) => z.value.target_payout_rate = e,
								percentage: "",
								unit: "%",
								max: T(ln)(z.value.platform_target_payout_rate, 2),
								disabled: !L.value || O.value || !!j.value,
								"aria-label": `${z.value.observation_seconds}秒目标返奖率`
							}, null, 8, [
								"input-component",
								"modelValue",
								"max",
								"disabled",
								"aria-label"
							])]),
							_: 1
						}, 8, ["label"]), o("", !0)])) : (y(), s("div", Ho, [d(T(I), { label: `固定赔率（平台上限 ${z.value.platform_fixed_odds}，且必须小于 2，含本金）` }, {
							default: D(() => [d(pn, {
								"input-component": T(t),
								modelValue: z.value.fixed_odds,
								"onUpdate:modelValue": i[5] ||= (e) => z.value.fixed_odds = e,
								step: "0.01",
								min: "1.01",
								max: z.value.platform_fixed_odds,
								unit: "x",
								disabled: !L.value || O.value || !!j.value,
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
						c("article", Uo, [c("header", Wo, [c("h4", null, "下注限制 · " + w(z.value.observation_seconds) + " 秒", 1), c("p", Go, "平台单笔范围：" + w(z.value.platform_minimum) + " ~ " + w(z.value.platform_maximum) + " USDT。变更不影响已受理订单。", 1)]), c("div", Ko, [d(T(I), { label: "单笔最小额" }, {
							default: D(() => [d(pn, {
								"input-component": T(t),
								modelValue: z.value.minimum_stake,
								"onUpdate:modelValue": i[6] ||= (e) => z.value.minimum_stake = e,
								min: z.value.platform_minimum,
								max: z.value.maximum_stake,
								disabled: !L.value || O.value || !!j.value,
								"aria-label": `${z.value.observation_seconds}秒单笔最小额`
							}, {
								append: D(() => [...i[22] ||= [u("USDT", -1)]]),
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
							default: D(() => [d(pn, {
								"input-component": T(t),
								modelValue: z.value.maximum_stake,
								"onUpdate:modelValue": i[7] ||= (e) => z.value.maximum_stake = e,
								min: z.value.minimum_stake,
								max: z.value.platform_maximum,
								disabled: !L.value || O.value || !!j.value,
								"aria-label": `${z.value.observation_seconds}秒单笔最大额`
							}, {
								append: D(() => [...i[23] ||= [u("USDT", -1)]]),
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
}), [["__scopeId", "data-v-341067d3"]]), Jo = class {
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
function Yo(e) {
	if (typeof e != "string" || !/^[A-Z0-9][A-Z0-9._-]{0,63}$/.test(e)) throw Error("INVALID_SYMBOL_DIRECTORY");
	return e;
}
function Xo(e, t) {
	let n = e?.configurations;
	if (!Array.isArray(n)) throw Error("INVALID_SYMBOL_DIRECTORY");
	return [...new Set(n.flatMap((e) => {
		if (!Array.isArray(e?.rules) || !e.rules.length) throw Error("INVALID_SYMBOL_DIRECTORY");
		return e.rules.flatMap((e) => {
			if (e.game_type !== `GAME_TYPE_${t}` || typeof e.enabled_by_default != "boolean") throw Error("INVALID_SYMBOL_DIRECTORY");
			let n = Yo(e.symbol);
			return e.enabled_by_default ? [n] : [];
		});
	}))];
}
function Zo(e, t, n, r = []) {
	let i = new Set(e.map(Yo)), a = new Set(t.map(Yo));
	n.forEach(Yo);
	let o = [...i].filter((e) => a.has(e)), s = new Set(r.map(Yo));
	return _i([...o].map((e) => ({
		symbol: e,
		allowed: i.has(e),
		publicConfigured: a.has(e)
	})), n, (e) => s.has(e.symbol));
}
//#endregion
//#region src/prediction-config/agent/views/prediction/game-config/site-mutation.ts
var Qo = "prediction.site.pending.v1";
function $o(e, t, n = []) {
	Q(t.every((t) => Object.hasOwn(e, t)) && Object.keys(e).every((e) => t.includes(e) || n.includes(e)), "PENDING_CORRUPT");
}
function es(e) {
	Q(Xr(e), "PENDING_CORRUPT"), $o(e, [
		"site_id",
		"game_type",
		"symbol",
		"client_request_id",
		"reason",
		"based_on_public_version",
		"based_on_site_version",
		"enabled",
		"overrides"
	]), Q(Z(e.site_id, 128) && ["UP_DOWN", "HIGH_LOW"].includes(String(e.game_type)) && Z(e.symbol, 64, !0) && Z(e.client_request_id, 128) && Z(e.reason, 500), "PENDING_CORRUPT"), Q(Rr(e.based_on_public_version, !0) && Rr(e.based_on_site_version, !0) && typeof e.enabled == "boolean" && Array.isArray(e.overrides), "PENDING_CORRUPT");
	let t = e.game_type === "UP_DOWN";
	Q((t ? e.overrides.length === 5 : e.overrides.length > 0 && e.overrides.length <= 100) && new Set(e.overrides.map((e) => e.duration_seconds)).size === e.overrides.length, "PENDING_CORRUPT");
	for (let n of e.overrides) {
		if (Q(Xr(n)), !t) {
			$o(n, ["duration_seconds"], [
				"enabled",
				"fixed_odds",
				"minimum_stake",
				"maximum_stake"
			]), Q(Rr(n.duration_seconds, !0) && (!Object.hasOwn(n, "enabled") || typeof n.enabled == "boolean"), "PENDING_CORRUPT"), ii(n);
			continue;
		}
		$o(n, ["duration_seconds", "stake_tiers"], ["enabled"]), Q(Yr.includes(String(n.duration_seconds)) && (!Object.hasOwn(n, "enabled") || typeof n.enabled == "boolean") && Array.isArray(n.stake_tiers) && n.stake_tiers.length === 1, "PENDING_CORRUPT");
		let e = n.stake_tiers[0];
		Q(Xr(e)), $o(e, ["stake_tier_id"], ["enabled", "maximum_stake"]), Q(Z(e.stake_tier_id) && (!Object.hasOwn(e, "enabled") || typeof e.enabled == "boolean"), "PENDING_CORRUPT"), Q(!Object.hasOwn(e, "maximum_stake") || Br(e.maximum_stake) && Vr(e.maximum_stake, "1") >= 0, "PENDING_CORRUPT");
	}
}
function ts(e) {
	let t = e.getItem(Qo);
	if (t === null) return null;
	Q(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return Q(Xr(n)), $o(n, [
		"schema",
		"operator_id",
		"agent_id",
		"body",
		"attempted",
		"attempt"
	]), $r(n), Q(n.schema === "site-v1" && typeof n.attempted == "boolean" && Number.isSafeInteger(n.attempt) && Number(n.attempt) >= 0 && n.attempted === Number(n.attempt) > 0, "PENDING_CORRUPT"), es(n.body), Zr(n);
}
var ns = (e, t) => !!e && e.operator_id === t.operator_id && e.agent_id === t.agent_id && JSON.stringify(e.body) === JSON.stringify(t.body);
function rs(e, t, n) {
	$r(t), es(n), Q(ts(e) === null, "PENDING_EXISTS");
	let r = {
		schema: "site-v1",
		...t,
		body: JSON.parse(JSON.stringify(n)),
		attempted: !1,
		attempt: 0
	};
	return e.setItem(Qo, JSON.stringify(r)), Q(ns(ts(e), r), "PERSISTENCE_UNAVAILABLE"), Zr(r);
}
function is(e, t) {
	ns(ts(e), t) && e.removeItem(Qo);
}
function as(e, t) {
	try {
		Q(Xr(e) && Xr(e.receipt)), ni(e.stored);
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
		].every((e) => typeof i[e] == "string")), Q(Z(i.operation_id, 256) && Z(i.trace_id, 256) && Z(i.target_id, 256) && Rr(i.created_at_ms) && Rr(i.completed_at_ms)), Q(i.operator_id === t.operator_id && i.client_request_id === n.client_request_id && i.reason === n.reason && i.source_service === "agent_admin"), Q(i.result === "OPERATION_RESULT_SUCCEEDED" && i.error_code === "" && i.action === "ADMIN_ACTION_SITE_CONFIG_PUBLISH" && i.capability === "prediction.site.config.publish" && i.target_type === "site_config"), !0;
	} catch {
		return !1;
	}
}
var os = /* @__PURE__ */ new WeakMap();
function ss(e, t, n) {
	let r = os.get(e);
	if (r) return Q(ns(r.pending, t), "PENDING_EXISTS"), r.promise;
	let i = ts(e);
	Q(ns(i, t), "PENDING_CHANGED");
	let a = i.attempted, o = i.attempt + 1;
	Q(Number.isSafeInteger(o), "ATTEMPT_LIMIT"), e.setItem(Qo, JSON.stringify({
		...i,
		attempted: !0,
		attempt: o
	}));
	let s = ts(e);
	Q(s?.attempt === o && ns(s, t), "PERSISTENCE_UNAVAILABLE");
	let c = Promise.resolve().then(async () => {
		try {
			let r = await n(t.body);
			return ns(ts(e), t) ? as(r, t) ? (is(e, t), {
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
			let r = ts(e);
			if (!ns(r, t)) return {
				status: "superseded",
				error: n
			};
			let i = Xr(n) && n.client_request_id !== void 0 && n.client_request_id !== t.body.client_request_id;
			return !a && r.attempt === o && !i && Wa(n) ? (is(e, t), {
				status: "rejected",
				error: n
			}) : {
				status: "unknown",
				error: n
			};
		}
	}).finally(() => {
		os.get(e)?.promise === c && os.delete(e);
	});
	return os.set(e, {
		pending: t,
		promise: c
	}), c;
}
async function cs(e, t, n, r) {
	let i = await ss(e, t, n);
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
var ls = {
	class: "prediction-config prediction-table-page",
	"data-prediction-page": "GAME_CONFIG"
}, us = {
	class: "game-tabs",
	"aria-label": "选择预测玩法"
}, ds = {
	key: 1,
	role: "alert"
}, fs = {
	key: 2,
	class: "config-layout"
}, ps = ["aria-label"], ms = {
	key: 0,
	class: "catalog-error",
	role: "alert"
}, hs = {
	key: 1,
	role: "status"
}, gs = {
	key: 2,
	class: "catalog-error",
	role: "alert"
}, _s = {
	key: 3,
	role: "status"
}, vs = { class: "symbol-list" }, ys = [
	"data-symbol",
	"aria-pressed",
	"disabled",
	"onClick"
], bs = {
	key: 0,
	class: "symbol-status"
}, xs = {
	key: 1,
	class: "symbol-status"
}, Ss = {
	key: 2,
	class: "symbol-status"
}, Cs = {
	key: 3,
	class: "symbol-status"
}, ws = {
	key: 4,
	class: "symbol-status"
}, Ts = {
	key: 5,
	class: "draft-label"
}, Es = {
	key: 0,
	class: "symbol-all-control"
}, Ds = { class: "config-content" }, Os = { class: "config-title" }, ks = { class: "config-title-actions" }, As = {
	key: 0,
	class: "draft-label",
	"data-dirty": "true"
}, js = {
	key: 0,
	role: "status"
}, Ms = {
	key: 1,
	role: "alert"
}, Ns = {
	key: 2,
	role: "alert"
}, Ps = { key: 3 }, Fs = { key: 1 }, Is = { key: 0 }, Ls = { key: 1 }, Rs = { key: 1 }, zs = {
	key: 7,
	role: "status"
}, Bs = { key: 0 }, Vs = { key: 1 }, Hs = { key: 2 }, Us = ["aria-label"], Ws = [
	"data-room",
	"aria-pressed",
	"onClick"
], Gs = { class: "room-heading" }, Ks = { class: "room-switch" }, qs = { key: 0 }, Js = { class: "parameter-cards" }, Ys = {
	key: 0,
	class: "parameter-card"
}, Xs = { class: "parameter-facts" }, Zs = { class: "read-only-label" }, Qs = {
	key: 1,
	class: "parameter-card"
}, $s = { class: "parameter-facts" }, ec = { "data-field": "fixed_odds" }, tc = { class: "read-only-label" }, nc = { class: "parameter-card" }, rc = { class: "limit-fields" }, ic = { key: 0 }, ac = { key: 1 }, oc = /*#__PURE__*/ e(/* @__PURE__ */ f({
	__name: "SiteConfig",
	setup(e) {
		let { siteDirectorySymbols: t, configurations: n, siteConfigurationTargets: l, siteConfiguration: f, saveSiteConfiguration: p, saveConfiguration: m, configuration: h } = he().api, g = _e(), { t: _, te: v, locale: ne } = ye(), x = ge(), S = new Jo(), ie = new Jo(), E = new Jo(), O = new Jo(), k = new si(), j = b("UP_DOWN"), N = C(), P = i(() => j.value === "HIGH_LOW" ? "HIGH_LOW" : "UP_DOWN"), F = i(() => ne.value === "en-US" ? U : W), se = (e) => x.perms.includes("*") || x.perms.includes(e), I = i(() => se("prediction_config:lists")), L = I, le = i(() => zr(x.userInfo.id)), z = b(null), B = b([]), V = b(""), H = b(""), pe = b(""), G = i(() => B.value.find((e) => e.site_id === V.value)?.games.find((e) => e.game_type === P.value)?.symbols ?? []), me = b([]), ve = b([]), be = b(""), xe = i(() => Zo(G.value, ve.value, me.value, Object.keys(Ce.value).filter((e) => ct(e) && (st(e) ?? 0) > 0))), Se = i(() => xe.value.map((e) => e.symbol).filter((e) => e.toLowerCase().includes(pe.value.toLowerCase()))), Ce = b({}), we = b({}), K = b(null), q = b([]), Te = b(!1), Ee = b("35"), De = b("通过商户玩法配置页面保存配置"), Oe = b(""), ke = b(!1), Ae = b(!1), je = b(""), Me = b(!1), Ne = b(!1), Pe = b(""), Fe = b(""), Ie = b(!1), J = b(!1), Y = C(null), Le = C(null), Re = C(null), ze, Be, Ve = 0, He = i(() => ne.value === "en-US" ? "Enabled" : "启用交易对"), Ue = i(() => Y.value && z.value && Y.value.operator_id === z.value.operator_id && Y.value.agent_id === z.value.agent_id && Y.value.body.site_id === V.value && Y.value.body.game_type === P.value && Y.value.body.symbol === H.value ? Y.value : null), We = b(null), Ge = i(() => Le.value && We.value && Le.value.operator_id === le.value && Le.value.operator_id === We.value.operator_id && Le.value.agent_id === We.value.agent_id), Ke = i(() => I.value && L.value && z.value?.operator_id === le.value && !!K.value && (P.value === "UP_DOWN" ? q.value.length === 5 : q.value.length > 0) && !Pe.value && !Y.value && !Le.value && !J.value && !Ne.value && !Me.value), qe = i(() => q.value.find((e) => e.duration_seconds === Ee.value)), Je = i(() => K.value?.effective.rules.find((e) => e.duration_seconds === Ee.value)), Ye = () => JSON.stringify({
			enabled: Te.value,
			rows: q.value.map((e) => ({
				duration: e.duration_seconds,
				enabled: e.enabled,
				maximum: e.maximum_stake,
				minimum: e.minimum_stake,
				odds: e.fixed_odds
			})),
			reason: De.value
		}), Xe = i(() => !!K.value && !!Oe.value && Ye() !== Oe.value);
		function Ze() {
			return z.value ? {
				...z.value,
				site_id: V.value,
				game_type: P.value,
				symbol: H.value,
				public_version: K.value?.effective.public_version ?? "",
				site_version: K.value?.stored.version ?? ""
			} : null;
		}
		function Qe() {
			J.value = !1;
			try {
				Y.value = ts(sessionStorage);
			} catch {
				J.value = !0;
			}
			try {
				Le.value = Ba(sessionStorage);
			} catch {
				J.value = !0;
			}
		}
		function $e() {
			k.close(), Fe.value = "", Re.value = null, ze?.abort(), Ne.value = !1;
		}
		function et() {
			$e(), O.close(), K.value = null, q.value = [], Oe.value = "", De.value = "通过商户玩法配置页面保存配置", Pe.value = "", Ie.value = !1, Me.value = !1, Qe();
		}
		function tt(e) {
			ri(e, V.value, H.value, P.value), K.value = e, q.value = ai(e), Te.value = e.stored.enabled, Ce.value[H.value] = e, we.value[H.value] = "configured", De.value = "通过商户玩法配置页面保存配置", Oe.value = Ye(), Qe();
		}
		function nt(e) {
			let t = e?.error_code;
			return t === "NOT_FOUND" ? "该交易对尚未配置，请联系管理员完成初始配置。" : t === "UNAVAILABLE" ? "站点配置暂不可用，请稍后刷新。" : t === "PERMISSION_DENIED" ? "当前账号无权访问该站点配置。" : _("predictionPages.loadFailed");
		}
		async function rt() {
			et(), E.close(), Be = void 0, Ae.value = !1;
			let e = ie.next(), t = le.value, n = x.token;
			if (z.value = null, We.value = null, S.close(), it(), B.value = [], me.value = [], ve.value = [], be.value = "", V.value = "", H.value = "", Ce.value = {}, we.value = {}, je.value = "", ke.value = !1, !(!I.value || !t)) {
				ke.value = !0;
				try {
					let r = await l(e.signal);
					if (!e.current() || le.value !== t || x.token !== n) return;
					if (ei(r), r.actor.operator_id !== t) throw Error("IDENTITY_UNCONFIRMED");
					z.value = r.actor, B.value = r.sites, Y.value?.operator_id === t && Y.value.agent_id === r.actor.agent_id && (j.value = Y.value.body.game_type);
					let i = Y.value?.operator_id === t ? r.sites.find((e) => e.site_id === Y.value?.body.site_id)?.site_id : void 0;
					(i || r.sites.length === 1) && (V.value = i ?? r.sites[0].site_id);
				} catch (t) {
					e.current() && (je.value = nt(t));
				} finally {
					e.current() && (ke.value = !1);
				}
			}
		}
		async function it() {
			let e = S.next(), t = Le.value, n = le.value, r = x.token;
			if (!(!t || t.operator_id !== n || !I.value)) try {
				let i = await h(t.body.symbol, e.signal);
				if (!e.current() || le.value !== n || x.token !== r) return;
				Ia(i.configuration) === t.body.symbol && i.configuration.agent_id === t.agent_id && (We.value = {
					operator_id: t.operator_id,
					agent_id: t.agent_id
				});
			} catch {}
		}
		async function at() {
			et();
			let e = E.next(), r = V.value, i = JSON.stringify(z.value), a = x.token, o = P.value, s = [...G.value];
			if (Be = void 0, Ce.value = {}, we.value = {}, me.value = [], ve.value = [], be.value = "", Ae.value = !1, j.value === "GRID" || !z.value || !r || !I.value) return;
			let c = () => e.current() && j.value !== "GRID" && I.value && x.token === a && V.value === r && P.value === o && i === JSON.stringify(z.value), l = /* @__PURE__ */ new Map(), u = {
				current: c,
				requests: l,
				read(t) {
					let n = l.get(t);
					return n || (n = f({
						site_id: r,
						game_type: o,
						symbol: t
					}, e.signal).then((e) => (ri(e, r, t, o), e)), l.set(t, n)), n;
				}
			};
			Be = u;
			for (let e of s) we.value[e] = "loading";
			let d = Y.value?.body.game_type === o && Y.value.body.site_id === r ? Y.value.body.symbol : H.value, p = s.includes(d) ? d : s[0] ?? "", m = Y.value?.body.game_type === o && Y.value.body.site_id === r && s.includes(Y.value.body.symbol);
			H.value = m ? p : "", m && ot(!0), Ae.value = !0;
			let h = Promise.allSettled([t(e.signal).then((e) => {
				Zo([], [], e), c() && (me.value = e);
			}), n(e.signal, o).then((e) => {
				let t = Xo(e, o);
				if (c() && (ve.value = t, !m)) {
					let e = s.filter((e) => t.includes(e)), n = e.includes(p) ? p : e[0] ?? "";
					H.value === n ? ot(!0) : H.value = n;
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
			})]), c() && (Ae.value = !1);
		}
		async function ot(e = !1) {
			et();
			let t = O.next(), n = {
				site_id: V.value,
				game_type: P.value,
				symbol: H.value
			}, r = JSON.stringify(z.value), i = Be;
			if (Ee.value = "35", j.value === "GRID" || !I.value || !z.value || !n.site_id || !G.value.includes(n.symbol)) return;
			Me.value = !0, e || i?.requests.delete(n.symbol);
			let a = e && i?.current() ? i.read(n.symbol) : f(n, t.signal);
			try {
				let e = await a;
				if (i?.current() && i.requests.get(n.symbol) === a && (Ce.value[n.symbol] = e, we.value[n.symbol] = "configured"), !t.current() || r !== JSON.stringify(z.value) || n.site_id !== V.value || n.game_type !== P.value || n.symbol !== H.value) return;
				tt(e), Ee.value = q.value[0]?.duration_seconds ?? "";
			} catch (e) {
				if (i?.current() && i.requests.get(n.symbol) === a && (we.value[n.symbol] = e?.error_code === "NOT_FOUND" ? "unconfigured" : "unavailable", i.requests.delete(n.symbol)), !t.current()) return;
				Ie.value = e?.error_code === "NOT_FOUND", we.value[n.symbol] = Ie.value ? "unconfigured" : "unavailable", Pe.value = nt(e);
			} finally {
				t.current() && i?.requests.get(n.symbol) === a && i.requests.delete(n.symbol), t.current() && (Me.value = !1);
			}
		}
		function st(e) {
			let t = e === H.value ? K.value : Ce.value[e];
			return t ? e === H.value && (P.value === "UP_DOWN" ? q.value.length === 5 : q.value.length > 0) ? Te.value ? q.value.filter((e) => e.enabled).length : 0 : t.effective.rules.filter((e) => e.enabled && (P.value === "HIGH_LOW" || e.stake_tiers.some((e) => !e.retired && e.enabled))).length : null;
		}
		function ct(e) {
			return e === H.value && K.value ? Te.value : Ce.value[e]?.stored.enabled ?? !1;
		}
		function lt(e) {
			return !Ke.value || we.value[e] !== "configured" || e !== H.value && Xe.value;
		}
		function ut(e) {
			if (G.value.includes(e)) {
				if (e !== H.value && (Xe.value || Ne.value || Y.value)) {
					ce.warning("请先处理当前未保存修改或待确认操作");
					return;
				}
				H.value = e;
			}
		}
		async function dt(e, t) {
			if (typeof t != "boolean" || lt(e)) return;
			let n = JSON.stringify(z.value), r = V.value;
			e !== H.value && (H.value = e);
			let i = Ve;
			if (Me.value) {
				let t = Be?.requests.get(e);
				if (t) try {
					await t;
				} catch {
					return;
				}
			}
			i !== Ve || n !== JSON.stringify(z.value) || r !== V.value || H.value !== e || !Ke.value || ($e(), Te.value = t);
		}
		function ft() {
			z.value && V.value && H.value ? ot() : rt();
		}
		async function X(e) {
			if (j.value !== e && !(j.value === "GRID" && N.value && !await N.value.confirmLeave())) {
				if (j.value !== "GRID" && (Xe.value || Y.value || Le.value)) {
					ce.warning("请先处理当前未保存修改或待确认操作");
					return;
				}
				j.value = e, pe.value = "", et(), H.value = "", at();
			}
		}
		async function pt() {
			let e = Ze();
			if (!Ke.value || !K.value || !z.value || !e) return;
			let t;
			try {
				t = oi(K.value, q.value, Te.value, De.value, Qr());
			} catch {
				Fe.value = _("predictionPages.invalidSave");
				return;
			}
			if (!k.next(e).current(Ze()) || !I.value || !L.value) return;
			let n;
			try {
				n = rs(sessionStorage, z.value, t), Qe();
			} catch {
				J.value = !0;
				return;
			}
			await ht(n);
		}
		function mt() {
			Qe(), Ue.value && I.value && L.value && !Ne.value && !J.value && ht(Ue.value);
		}
		async function ht(e) {
			let t = Ze();
			if (!t) return;
			let n = k.next(t), r = new AbortController();
			ze = r;
			let i = () => n.current(Ze()) && I.value && L.value;
			Ne.value = !0, Fe.value = "", Re.value = null;
			try {
				let t = await cs(sessionStorage, e, (e) => p(e, r.signal), async (e) => {
					let t = await f({
						site_id: e.site_id,
						game_type: e.game_type,
						symbol: e.symbol
					}, r.signal);
					return ri(t, e.site_id, e.symbol, e.game_type), t;
				});
				if (!i()) return;
				Qe(), t.status === "success" ? (Re.value = t.value.receipt, t.latest ? (tt(t.latest), Pe.value = "", Fe.value = _("predictionPages.saved")) : (K.value = null, q.value = [], Oe.value = "", Pe.value = "已保存，刷新失败。请刷新查看当前配置。", Fe.value = "已保存，刷新失败")) : t.status !== "superseded" && (Fe.value = _("predictionPages." + (t.status === "unknown" ? "pending" : "rejected")) + " · " + Lr(t.error?.error_code));
			} catch {
				i() && (Qe(), Fe.value = _("predictionPages.pending"));
			} finally {
				ze === r && (Ne.value = !1);
			}
		}
		async function gt() {
			if (Qe(), !Le.value || !Ge.value || !I.value || !L.value || Ne.value || J.value) return;
			let e = Le.value, t = x.token, n = Ve, r = new AbortController(), i = () => n === Ve && t === x.token && Ge.value && I.value && L.value;
			ze = r, Ne.value = !0;
			try {
				let t = await Ka(sessionStorage, e, (e) => m(e, r.signal));
				if (!i()) return;
				Qe(), Fe.value = t.status === "success" ? "旧版原请求已确认成功。站点设置请单独查看。" : _("predictionPages.pending");
			} catch {
				i() && (Qe(), Fe.value = _("predictionPages.pending"));
			} finally {
				ze === r && (Ne.value = !1);
			}
		}
		function _t(e) {
			let t = P.value === "UP_DOWN" ? BigInt(e.observation_seconds) : BigInt(e.duration_seconds);
			return P.value === "HIGH_LOW" && t >= 60n && t % 60n == 0n ? `${t / 60n}分钟` : `${t}秒`;
		}
		function vt(e) {
			let t = e === H.value ? K.value : Ce.value[e];
			return t ? ai(t).map(_t).join(" · ") : "";
		}
		function yt(e) {
			return typeof e == "string" || typeof e == "boolean" ? Lr(e) : _("predictionPages.notProvided");
		}
		function bt(e, t) {
			let n = yt(t);
			if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return n;
			if (e !== "target_payout_rate") return n + "x";
			let [r, i = ""] = n.split("."), a = r + i, o = r.length + 2;
			return (o >= a.length ? a + "0".repeat(o - a.length) : a.slice(0, o) + "." + a.slice(o)).replace(/^0+(?=\d)/, "") + "%";
		}
		let xt = (e) => v("predictionPages.fields." + e) ? _("predictionPages.fields." + e) : e;
		return ae(V, () => {
			Ve++, H.value = "", at();
		}, { flush: "sync" }), ae(H, () => {
			Ve++, ot(!0);
		}, { flush: "sync" }), ae(() => [
			x.userInfo.id,
			x.token,
			I.value,
			L.value
		], () => {
			Ve++, $e(), ie.close(), E.close(), O.close(), S.close(), rt();
		}, {
			immediate: !0,
			flush: "sync"
		}), te(() => {
			Ve++, $e(), ie.close(), E.close(), O.close(), S.close();
		}), (e, t) => (y(), a(T(M), { locale: F.value }, {
			default: D(() => [c("section", ls, [c("nav", us, [
				d(T(A), {
					type: j.value === "UP_DOWN" ? "primary" : void 0,
					"aria-pressed": j.value === "UP_DOWN",
					onClick: t[0] ||= (e) => X("UP_DOWN")
				}, {
					default: D(() => [...t[8] ||= [u("涨跌预测", -1), c("small", null, "按系统场次预测结算价格相对开盘价格上涨或下跌", -1)]]),
					_: 1
				}, 8, ["type", "aria-pressed"]),
				d(T(A), {
					type: j.value === "HIGH_LOW" ? "primary" : void 0,
					"aria-pressed": j.value === "HIGH_LOW",
					onClick: t[1] ||= (e) => X("HIGH_LOW")
				}, {
					default: D(() => [...t[9] ||= [u("自选预测", -1), c("small", null, "用户自主选择方向和预测周期，生成独立预测订单", -1)]]),
					_: 1
				}, 8, ["type", "aria-pressed"]),
				d(T(A), {
					type: j.value === "GRID" ? "primary" : void 0,
					"aria-pressed": j.value === "GRID",
					onClick: t[2] ||= (e) => X("GRID")
				}, {
					default: D(() => [...t[10] ||= [u("预测网格", -1), c("small", null, "按时间格与价格区间展示网格预测规则", -1)]]),
					_: 1
				}, 8, ["type", "aria-pressed"])
			]), j.value === "GRID" ? (y(), a(Aa, {
				key: 1,
				ref_key: "gridRef",
				ref: N
			}, null, 512)) : (y(), s(r, { key: 0 }, [B.value.length > 1 ? (y(), a(T(de), {
				key: 0,
				modelValue: V.value,
				"onUpdate:modelValue": t[3] ||= (e) => V.value = e,
				placeholder: "请选择配置站点",
				"aria-label": "配置站点",
				disabled: Ne.value || Xe.value || !!Y.value || !!Le.value
			}, {
				default: D(() => [(y(!0), s(r, null, re(B.value, (e, t) => (y(), a(T(ue), {
					key: e.site_id,
					label: `站点配置 ${t + 1}`,
					value: e.site_id
				}, null, 8, ["label", "value"]))), 128))]),
				_: 1
			}, 8, ["modelValue", "disabled"])) : o("", !0), I.value ? (y(), s("div", fs, [c("aside", {
				class: "symbol-directory",
				"aria-label": T(_)("predictionPages.symbolDirectory")
			}, [
				c("h3", null, [t[11] ||= u("交易对配置 ", -1), c("small", null, w(xe.value.length) + " 条", 1)]),
				d(T(R), {
					modelValue: pe.value,
					"onUpdate:modelValue": t[4] ||= (e) => pe.value = e,
					clearable: "",
					"aria-label": T(_)("predictionPages.searchSymbol"),
					placeholder: T(_)("predictionPages.searchSymbol")
				}, null, 8, [
					"modelValue",
					"aria-label",
					"placeholder"
				]),
				be.value ? (y(), s("p", ms, [u(w(be.value), 1), d(T(A), {
					size: "small",
					disabled: Xe.value || Ne.value || !!Y.value || Ae.value,
					onClick: at
				}, {
					default: D(() => [...t[12] ||= [u("重试币种目录", -1)]]),
					_: 1
				}, 8, ["disabled"])])) : o("", !0),
				ke.value || Ae.value ? (y(), s("p", hs, w(T(_)("predictionPages.loading")), 1)) : o("", !0),
				je.value ? (y(), s("div", gs, [c("p", null, w(je.value), 1), d(T(A), {
					"data-action": "retry-catalog",
					size: "small",
					disabled: ke.value,
					onClick: rt
				}, {
					default: D(() => [u(w(T(_)("predictionPages.retry")), 1)]),
					_: 1
				}, 8, ["disabled"])])) : o("", !0),
				!ke.value && !je.value && !Se.value.length ? (y(), s("p", _s, w(B.value.length ? V.value ? G.value.length ? "没有匹配的交易对。" : "当前站点尚未开放此玩法的交易对配置。" : "请选择配置站点。" : "当前账号暂无预测配置站点授权，请联系管理员配置后刷新。"), 1)) : o("", !0),
				c("div", vs, [(y(!0), s(r, null, re(Se.value, (e) => (y(), s("div", {
					key: e,
					class: ee(["symbol-entry", { selected: e === H.value }])
				}, [c("button", {
					type: "button",
					class: "symbol-option",
					"data-symbol": e,
					"aria-pressed": e === H.value,
					disabled: !G.value.includes(e),
					onClick: (t) => ut(e)
				}, [
					d(T(g), { symbol: e }, null, 8, ["symbol"]),
					G.value.includes(e) ? we.value[e] === "loading" ? (y(), s("span", xs, w(T(_)("predictionPages.loading")), 1)) : we.value[e] === "unconfigured" ? (y(), s("span", Ss, w(T(_)("predictionPages.unconfigured")), 1)) : st(e) === null ? (y(), s("span", Cs, w(T(_)("predictionPages.unavailableConfig")), 1)) : (y(), s("span", ws, w(vt(e)), 1)) : (y(), s("span", bs, w(ve.value.includes(e) ? "未开放配置" : "未配置"), 1)),
					e === H.value && Xe.value ? (y(), s("span", Ts, w(T(_)("predictionPages.unsaved")), 1)) : o("", !0)
				], 8, ys), we.value[e] === "configured" ? (y(), s("div", Es, [d(T(fe), {
					"inline-prompt": "",
					"active-text": "开放",
					"inactive-text": "停用",
					"data-symbol-enabled": e,
					"aria-label": `${e} ${He.value}`,
					"model-value": ct(e),
					disabled: lt(e),
					onChange: (t) => dt(e, t)
				}, null, 8, [
					"data-symbol-enabled",
					"aria-label",
					"model-value",
					"disabled",
					"onChange"
				])])) : o("", !0)], 2))), 128))])
			], 8, ps), c("main", Ds, [
				c("header", Os, [c("div", null, [c("h3", null, w(H.value || T(_)("predictionPages.selectSymbol")) + " · " + w(T(_)("predictionPages.games." + P.value)), 1), t[13] ||= c("p", null, "当前商户生效", -1)]), c("div", ks, [Xe.value ? (y(), s("span", As, w(T(_)("predictionPages.unsaved")), 1)) : o("", !0), T(L) ? (y(), a(T(A), {
					key: 1,
					"data-action": "save",
					type: "primary",
					loading: Ne.value,
					disabled: !Ke.value,
					onClick: pt
				}, {
					default: D(() => [...t[14] ||= [u("保存配置", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])) : o("", !0)])]),
				Me.value ? (y(), s("p", js, w(T(_)("predictionPages.loading")), 1)) : o("", !0),
				Pe.value ? (y(), s("p", Ms, [u(w(Pe.value), 1), I.value ? (y(), a(T(A), {
					key: 0,
					disabled: Me.value || ke.value || Ne.value || Xe.value || !!Y.value || !!Le.value,
					onClick: ft
				}, {
					default: D(() => [...t[15] ||= [u("重试", -1)]]),
					_: 1
				}, 8, ["disabled"])) : o("", !0)])) : o("", !0),
				le.value ? o("", !0) : (y(), s("p", Ns, w(T(_)("predictionPages.identityError")), 1)),
				Ie.value ? (y(), s("p", Ps, "该交易对尚未配置，请联系管理员完成初始配置后刷新。")) : o("", !0),
				Le.value ? (y(), a(T(oe), {
					key: 4,
					type: "warning",
					closable: !1,
					title: "存在旧版代理配置待确认请求"
				}, {
					default: D(() => [
						t[17] ||= c("p", null, "旧请求按原协议恢复，不会转换为站点保存。", -1),
						c("p", null, w(Le.value.body.symbol) + " · " + w(Le.value.body.client_request_id), 1),
						Ge.value ? (y(), a(T(A), {
							key: 0,
							disabled: Ne.value || !T(L) || J.value,
							onClick: gt
						}, {
							default: D(() => [...t[16] ||= [u("确认旧版原请求", -1)]]),
							_: 1
						}, 8, ["disabled"])) : (y(), s("p", Fs, "请使用原操作账号恢复该请求。"))
					]),
					_: 1
				})) : o("", !0),
				J.value ? (y(), a(T(oe), {
					key: 5,
					type: "error",
					closable: !1,
					title: T(_)("predictionPages.storageError")
				}, null, 8, ["title"])) : Y.value ? (y(), a(T(oe), {
					key: 6,
					type: "warning",
					closable: !1,
					title: T(_)("predictionPages.pending")
				}, {
					default: D(() => [Ue.value ? (y(), s(r, { key: 0 }, [
						c("p", null, [u(w(T(_)("predictionPages.fields.client_request_id")) + ": ", 1), c("code", null, w(Ue.value.body.client_request_id), 1)]),
						c("p", null, w(Ue.value.body.symbol) + " · 站点 " + w(Ue.value.body.site_id) + " · 公共版本 " + w(Ue.value.body.based_on_public_version) + " / 站点版本 " + w(Ue.value.body.based_on_site_version), 1),
						c("ul", null, [(y(!0), s(r, null, re(Ue.value.body.overrides, (e) => (y(), s("li", { key: e.duration_seconds }, [
							u(w(e.duration_seconds) + "s · " + w(e.enabled === void 0 ? "继承原设置" : e.enabled ? T(_)("predictionPages.on") : T(_)("predictionPages.off")) + " · " + w(e.maximum_stake ?? e.stake_tiers?.[0]?.maximum_stake ?? "继承平台设置"), 1),
							e.fixed_odds === void 0 ? o("", !0) : (y(), s("span", Is, " · 固定赔率 " + w(e.fixed_odds) + "x", 1)),
							e.minimum_stake === void 0 ? o("", !0) : (y(), s("span", Ls, " · 最小下注金额 " + w(e.minimum_stake) + " USDT", 1))
						]))), 128))]),
						T(L) ? (y(), a(T(A), {
							key: 0,
							disabled: Ne.value,
							"data-action": "replay",
							onClick: mt
						}, {
							default: D(() => [u(w(T(_)("predictionPages.confirmOriginal")), 1)]),
							_: 1
						}, 8, ["disabled"])) : o("", !0)
					], 64)) : (y(), s("p", Rs, w(T(_)("predictionPages.otherPending")), 1))]),
					_: 1
				}, 8, ["title"])) : o("", !0),
				Fe.value ? (y(), s("p", zs, w(Fe.value), 1)) : o("", !0),
				K.value ? (y(), s(r, { key: 8 }, [
					Te.value ? o("", !0) : (y(), s("p", Bs, "交易对已关闭；以下房间设置仍会保留。")),
					K.value.adjustments.length ? (y(), s("p", Vs, "部分保存值受当前公共配置调整，编辑框保留原设置；实际生效金额见下方。")) : o("", !0),
					T(L) ? o("", !0) : (y(), s("p", Hs, w(T(_)("predictionPages.readOnlyConfig")), 1)),
					c("nav", {
						class: "room-tabs",
						"aria-label": P.value === "UP_DOWN" ? T(_)("predictionPages.observationRoom") : "支持周期"
					}, [(y(!0), s(r, null, re(q.value, (e) => (y(), s("button", {
						key: e.duration_seconds,
						type: "button",
						"data-room": e.duration_seconds,
						"aria-pressed": Ee.value === e.duration_seconds,
						class: ee({ active: Ee.value === e.duration_seconds }),
						onClick: (t) => Ee.value = e.duration_seconds
					}, w(_t(e)), 11, Ws))), 128))], 8, Us),
					qe.value && Je.value ? (y(), s(r, { key: 3 }, [
						c("div", Gs, [c("div", null, [c("h3", null, w(_t(qe.value)) + " · " + w(P.value === "UP_DOWN" ? T(_)("predictionPages.observationRoom") : "支持周期"), 1)]), c("label", Ks, [u(w(T(_)("predictionPages.roomEnabled")), 1), d(T(fe), {
							modelValue: qe.value.enabled,
							"onUpdate:modelValue": t[5] ||= (e) => qe.value.enabled = e,
							"data-field": "enabled",
							"aria-label": T(_)("predictionPages.roomEnabled"),
							disabled: !Ke.value,
							onChange: $e
						}, null, 8, [
							"modelValue",
							"aria-label",
							"disabled"
						])])]),
						qe.value.inherited_enabled ? (y(), s("p", qs, "房间开关包含继承设置；未修改时保留继承状态。")) : o("", !0),
						c("div", Js, [
							P.value === "UP_DOWN" ? (y(), s("article", Ys, [
								c("h4", null, w(T(_)("predictionPages.oddsSettings")), 1),
								t[18] ||= c("p", { class: "field-description" }, "上涨赔率 = 1 + 目标返奖率 × 下跌池 ÷（上涨池＋本次下注）；下跌赔率反向计算。下注期间为预计倍率，封盘后锁定最终倍率。", -1),
								c("dl", Xs, [(y(), s(r, null, re(["target_payout_rate", "maximum_odds"], (e) => c("div", { key: e }, [c("dt", null, [u(w(xt(e)), 1), d(on, { label: xt(e) }, null, 8, ["label"])]), c("dd", null, w(bt(e, Je.value[e])), 1)])), 64))]),
								c("span", Zs, w(T(_)("predictionPages.readOnly")), 1)
							])) : o("", !0),
							P.value === "HIGH_LOW" ? (y(), s("article", Qs, [
								c("h4", null, "赔率配置 · " + w(_t(qe.value)), 1),
								t[20] ||= c("p", { class: "field-description" }, "用户下单时按当前周期固定赔率锁定，订单存储赔率快照；上涨和下跌使用相同赔率。", -1),
								c("dl", $s, [c("div", null, [c("dt", null, [t[19] ||= u("当前生效固定赔率", -1), d(on, { label: "固定赔率" })]), c("dd", ec, w(bt("fixed_odds", Je.value.fixed_odds)), 1)])]),
								c("span", tc, w(T(_)("predictionPages.readOnly")), 1)
							])) : o("", !0),
							c("article", nc, [
								c("h4", null, w(T(_)("predictionPages.stakeLimits")) + " · " + w(_t(qe.value)), 1),
								t[22] ||= c("p", { class: "field-description" }, "不同周期独立保存下注限制，变更不影响已受理订单。", -1),
								c("div", rc, [P.value === "UP_DOWN" ? (y(), s("dl", ic, [c("dt", null, [u(w(T(_)("predictionPages.fields.minimum_stake")), 1), d(on, {
									label: "单笔最小额",
									content: "用户创建一笔预测订单时允许输入的最低下注金额。本版涨跌预测固定为 1 USDT，由平台统一维护。"
								})]), c("dd", null, w(yt(Je.value.stake_tiers?.find((e) => e.stake_tier_id === qe.value?.stake_tier_id)?.minimum_stake)), 1)])) : (y(), s("div", ac, [c("label", null, [u(w(T(_)("predictionPages.fields.minimum_stake")), 1), d(on, { label: "单笔最小额" })]), d(T(R), {
									modelValue: qe.value.minimum_stake,
									"onUpdate:modelValue": t[6] ||= (e) => qe.value.minimum_stake = e,
									"data-field": "minimum_stake",
									"aria-label": T(_)("predictionPages.fields.minimum_stake"),
									disabled: !Ke.value,
									onInput: $e
								}, {
									append: D(() => [...t[21] ||= [u("USDT", -1)]]),
									_: 1
								}, 8, [
									"modelValue",
									"aria-label",
									"disabled"
								])])), c("div", null, [
									c("label", null, [u(w(T(_)("predictionPages.fields.maximum_stake")), 1), d(on, { label: "单笔最大额" })]),
									d(T(R), {
										modelValue: qe.value.maximum_stake,
										"onUpdate:modelValue": t[7] ||= (e) => qe.value.maximum_stake = e,
										"data-field": "maximum_stake",
										"aria-label": T(_)("predictionPages.fields.maximum_stake"),
										disabled: !Ke.value || !qe.value.editable,
										onInput: $e
									}, null, 8, [
										"modelValue",
										"aria-label",
										"disabled"
									]),
									c("small", null, "当前生效：" + w(qe.value.effective_maximum) + "；可填写更高限额，最终由平台范围校验。", 1)
								])])
							])
						])
					], 64)) : o("", !0)
				], 64)) : o("", !0)
			])])) : (y(), s("p", ds, w(T(_)("predictionPages.noPermission")), 1))], 64))])]),
			_: 1
		}, 8, ["locale"]));
	}
}), [["__scopeId", "data-v-3a0bcf9c"]]), sc = {
	key: 0,
	role: "alert"
}, cc = {
	key: 1,
	role: "status"
}, lc = {
	key: 2,
	role: "alert"
}, uc = {
	key: 5,
	role: "alert"
}, dc = /* @__PURE__ */ f({
	__name: "index",
	setup(e) {
		let { ownerConfigurationModel: t } = he().api, n = ge(), r = C(null), o = b(!1), c = b(""), l = i(() => n.userInfo.can_manage_prediction_config === !0 && (n.perms.includes("*") || n.perms.includes("prediction_config:lists")) && zr(n.userInfo.id) !== null), f = i(() => `${n.userInfo.id}:${n.token}`), p = 0, m;
		async function h() {
			let e = ++p, i = f.value;
			if (m?.abort(), r.value = null, c.value = "", o.value = !1, l.value) {
				m = new AbortController(), o.value = !0;
				try {
					let a = await t(m.signal);
					if (e !== p || i !== f.value || !l.value) return;
					if (!li(a.actor) || a.actor.operator_id !== zr(n.userInfo.id) || ![
						"AGENT_V1",
						"SITE_V1",
						"OWNER_V1"
					].includes(a.config_model)) throw Error("INVALID_MODEL");
					r.value = a;
				} catch {
					e === p && (c.value = "无法确认当前账号的配置模式，请重试。");
				} finally {
					e === p && (o.value = !1);
				}
			}
		}
		return ae(() => [f.value, l.value], h, {
			immediate: !0,
			flush: "sync"
		}), te(() => {
			p++, m?.abort();
		}), (e, t) => l.value ? o.value ? (y(), s("p", cc, "正在读取配置模式…")) : c.value ? (y(), s("div", lc, [u(w(c.value) + " ", 1), d(T(A), { onClick: h }, {
			default: D(() => [...t[0] ||= [u("重试", -1)]]),
			_: 1
		})])) : r.value?.config_model === "OWNER_V1" ? (y(), a(qo, {
			key: f.value,
			actor: r.value.actor
		}, null, 8, ["actor"])) : r.value?.config_model === "SITE_V1" ? (y(), a(oc, { key: f.value })) : (y(), s("p", uc, "当前配置模式尚未接入此页面，请联系管理员确认切换；原有未确认请求保持原样。")) : (y(), s("p", sc, "仅代理商主账号可查看和修改预测配置。"));
	}
}), fc = {
	class: "mm-prediction-game-config mm-ui",
	"data-mm-component": "prediction-game-config"
}, pc = {
	key: 0,
	role: "alert"
}, mc = /* @__PURE__ */ f({
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
		ne(pe, {
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
		return (t, i) => (y(), s("section", fc, [r.value ? (y(), a(S(e.adapter.role === "platform" ? Fr : dc), { key: n.value })) : (y(), s("p", pc, "无法确认当前操作人身份"))]));
	}
});
//#endregion
export { mc as MmPredictionGameConfig };

//# sourceMappingURL=prediction-config.js.map