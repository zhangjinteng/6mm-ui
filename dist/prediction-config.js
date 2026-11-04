import { n as e, t, u as n } from "./Loading-NM70IAOz.js";
import { Fragment as r, computed as i, createBlock as a, createCommentVNode as o, createElementBlock as s, createElementVNode as c, createSlots as l, createTextVNode as u, createVNode as d, defineComponent as f, inject as ee, mergeModels as p, mergeProps as m, nextTick as h, normalizeClass as te, normalizeStyle as g, onBeforeUnmount as ne, onMounted as re, openBlock as _, provide as ie, ref as v, renderList as ae, renderSlot as y, resolveDynamicComponent as b, shallowRef as x, toDisplayString as S, toRaw as C, unref as w, useModel as oe, watch as se, withCtx as T, withKeys as E, withModifiers as D } from "vue";
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
import { ElAlert as O, ElButton as k, ElCard as A, ElConfigProvider as j, ElDialog as M, ElDrawer as N, ElEmpty as P, ElForm as ce, ElFormItem as F, ElIcon as I, ElInput as L, ElMessage as R, ElMessageBox as z, ElOption as le, ElPopover as B, ElSelect as ue, ElSwitch as de, ElTag as V, useFormDisabled as H } from "element-plus";
import { QuestionFilled as U } from "@element-plus/icons-vue";
import W from "element-plus/es/locale/lang/en";
import G from "element-plus/es/locale/lang/zh-cn";
//#region src/prediction-config/runtime.ts
var K = Symbol("MmPredictionGameConfig");
function q() {
	let e = ee(K);
	if (!e) throw Error("Prediction configuration runtime is missing");
	return e;
}
function fe() {
	let { adapter: e } = q();
	if (e.role !== "platform") throw Error("Platform configuration adapter required");
	return e;
}
function pe() {
	let { adapter: e } = q();
	if (e.role !== "agent") throw Error("Agent configuration adapter required");
	return e;
}
function me() {
	let e = q();
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
function he() {
	return q().symbolComponent;
}
function ge(e) {
	q().registerBeforeLeave?.(e);
}
function _e() {
	let e = q();
	return {
		locale: i(() => e.locale),
		t: (t) => e.translate?.(t) ?? t,
		te: (t) => e.hasTranslation?.(t) ?? !1
	};
}
//#endregion
//#region src/prediction-config/platform/views/prediction/format.ts
var ve = 9223372036854775807n;
function ye(e, t = ve, n = !0) {
	return typeof e == "string" && /^(0|[1-9]\d*)$/.test(e) && BigInt(e) <= t && (n || e !== "0");
}
function be(e) {
	return e == null ? "未提供" : ye(e, 8640000000000000n) ? new Date(Number(e)).toLocaleString("zh-CN", { hour12: !1 }) : `${String(e)}（无法显示时间）`;
}
function xe(e, t = "UP_DOWN") {
	let n = {
		35: "5",
		40: "10",
		45: "15",
		60: "30",
		90: "60"
	};
	return t === "UP_DOWN" ? n[e] ? `${n[e]}秒` : `历史周期${e}秒` : `${e}秒`;
}
function Se(e) {
	return e instanceof Error || e && typeof e == "object" && "message" in e && typeof e.message == "string" ? e.message : "暂时无法获取确定结果，请稍后刷新或核验原操作";
}
//#endregion
//#region src/prediction-config/platform/views/config/prediction/form.ts
var J = /^(?:0|[1-9]\d*)(?:\.\d+)?$/, Y = /^[1-9]\d*$/, Ce = /^\d+$/, we = [
	"35",
	"40",
	"45",
	"60",
	"90"
], Te = [
	"5",
	"10",
	"15",
	"30",
	"60"
], Ee = (e) => {
	if (e === "GAME_TYPE_UP_DOWN") return "UP_DOWN";
	if (e === "GAME_TYPE_HIGH_LOW") return "HIGH_LOW";
	throw Error(`不支持的预测玩法类型：${e || "空"}`);
}, De = (e) => ({
	default_value: e.default_value,
	minimum_value: e.minimum_value,
	maximum_value: e.maximum_value,
	agent_editable: e.agent_editable
}), Oe = (e) => ({
	default_value: e.default_value,
	minimum_value: e.minimum_value,
	maximum_value: e.maximum_value,
	agent_editable: e.agent_editable
}), ke = (e) => {
	let t = {
		enabled_by_default: e.enabled_by_default,
		display_order: e.display_order,
		minimum_stake: De(e.minimum_stake),
		maximum_stake: De(e.maximum_stake),
		retired: e.retired
	};
	return e.stake_tier_id && (t.stake_tier_id = e.stake_tier_id), t;
}, Ae = (e, t) => {
	let n = e.stake_tiers ?? [], r = n.find((e) => !e.retired) ?? n[0], i = e[t] ?? r?.[t];
	if (!i) throw Error(`周期 ${e.duration_seconds || "--"} 秒缺少${t === "minimum_stake" ? "最低" : "最高"}下注限制配置，请刷新后重试`);
	return i;
}, je = (e) => {
	let t = {
		duration_seconds: e.duration_seconds,
		enabled_by_default: e.enabled_by_default,
		minimum_stake: De(Ae(e, "minimum_stake")),
		maximum_stake: De(Ae(e, "maximum_stake")),
		settlement_display_seconds: e.settlement_display_seconds,
		price_rule: {
			max_age_milliseconds: e.price_rule.max_age_milliseconds,
			late_arrival_grace_milliseconds: e.price_rule.late_arrival_grace_milliseconds,
			price_decimals: e.price_rule.price_decimals === void 0 ? 3 : e.price_rule.price_decimals
		}
	};
	e.market_id && (t.market_id = e.market_id), e.bet_open_seconds && (t.bet_open_seconds = Oe(e.bet_open_seconds)), e.target_payout_rate && (t.target_payout_rate = De(e.target_payout_rate)), e.minimum_odds && (t.minimum_odds = {
		default_value: "1",
		minimum_value: "1",
		maximum_value: "1",
		agent_editable: !1
	}), e.maximum_odds && (t.maximum_odds = De(e.maximum_odds)), e.fixed_odds && (t.fixed_odds = De(e.fixed_odds));
	let n = e.stake_tiers ?? [];
	return n.length > 0 && (t.stake_tiers = n.map(ke)), t;
};
function Me(e) {
	let t = e.rules.map(je);
	if (new Set(t.map((e) => e.duration_seconds)).size !== t.length) throw Error("自选周期重复");
	return Te.map((e) => {
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
function Ne(e) {
	let t = e.rules[0];
	if (!t) throw Error("当前配置没有可编辑周期");
	return {
		game_type: Ee(t.game_type),
		symbol: t.symbol,
		based_on_template_version: e.template_version,
		enabled: qe(e),
		rules: (t.game_type === "GAME_TYPE_HIGH_LOW" ? Me(e) : e.rules.map(je)).map((t) => ({
			...t,
			enabled_by_default: Ke(e) || t.enabled_by_default
		}))
	};
}
function Pe(e, t, n) {
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
function Fe(e, t = e.is_new === !0) {
	e = Le(e);
	let n = [];
	e.symbol || n.push("交易对不能为空"), ye(e.based_on_template_version) || n.push("配置版本无效"), e.rules.length === 0 && n.push("至少保留一个周期"), e.game_type === "UP_DOWN" && [...e.rules.map((e) => e.duration_seconds)].sort().join(",") !== we.join(",") && n.push("涨跌配置必须包含5、10、15、30、60秒五个固定房间"), e.game_type === "HIGH_LOW" && [...e.rules.map((e) => e.duration_seconds)].sort().join(",") !== [...Te].sort().join(",") && n.push("自选配置必须包含5、10、15、30、60秒五个固定房间"), new Set(e.rules.map((e) => e.price_rule.price_decimals)).size > 1 && n.push("同一币种各周期的价格小数位必须一致");
	let r = /* @__PURE__ */ new Set();
	return e.rules.forEach((i) => {
		let a = `${i.duration_seconds || "--"} 秒周期`;
		Y.test(i.duration_seconds) || n.push(`${a}的周期必须是正整数`), r.has(i.duration_seconds) && n.push(`周期 ${i.duration_seconds} 秒重复`), r.add(i.duration_seconds);
		let o = i.price_rule.price_decimals;
		o !== void 0 && (typeof o != "number" || !Number.isInteger(o) || o < 0 || o > 8) && n.push("价格小数位必须是0～8的整数"), Re(i.settlement_display_seconds, `${a}的结算展示时间`, n), Re(i.price_rule.max_age_milliseconds, `${a}的行情最大年龄`, n), Re(i.price_rule.late_arrival_grace_milliseconds, `${a}的行情延迟宽限`, n), Be(i.minimum_stake, a, "最低下注额", n), Be(i.maximum_stake, a, "最高下注额", n);
		let s = i.minimum_stake?.default_value, c = i.maximum_stake?.default_value, l = /^(0|[1-9]\d{0,17})(\.\d{1,18})?$/;
		typeof s != "string" || typeof c != "string" || !l.test(s) || !l.test(c) || Ve(s, "0") <= 0 || Ve(c, "0") <= 0 ? n.push(`${a}的单笔限额必须为正数，整数及小数最多18位`) : Ve(s, c) > 0 && n.push(`${a}的最小额不能大于最大额`), e.game_type === "UP_DOWN" ? (((e, t) => !!e && e.agent_editable === !1 && [
			e.minimum_value,
			e.default_value,
			e.maximum_value
		].every((e) => typeof e == "string" && J.test(e) && Ve(e, t) === 0))(i.bet_open_seconds, "30") || n.push("下注开放固定30秒且不可由代理调整"), (!t && !i.market_id || i.stake_tiers?.filter((e) => !e.retired).length !== 1) && n.push("房间配置不完整，请重新加载"), i.stake_tiers?.filter((e) => !e.retired).forEach((e) => {
			!t && !e.stake_tier_id && n.push("房间标识无效");
		}), [
			i.target_payout_rate,
			i.minimum_odds,
			i.maximum_odds
		].some((e) => e?.agent_editable !== !1) && n.push("返奖率和赔率不能由代理调整"), ze(i.bet_open_seconds, a, "下注开放时间", n), Be(i.target_payout_rate, a, "目标返奖率", n), typeof i.target_payout_rate?.default_value == "string" && J.test(i.target_payout_rate.default_value) && Ve(i.target_payout_rate.default_value, "1") >= 0 && n.push(`${a}的目标返奖率必须小于 100%`), Be(i.minimum_odds, a, "最低赔率", n), Be(i.maximum_odds, a, "最高赔率", n), i.stake_tiers?.length || n.push(`${a}的房间配置不完整`), i.stake_tiers?.forEach((e, t) => {
			let r = `${a}历史设置 ${t + 1}`;
			Be(e.minimum_stake, r, "最低下注额", n), Be(e.maximum_stake, r, "最高下注额", n);
		})) : (Be(i.fixed_odds, a, "固定赔率", n), typeof i.fixed_odds?.default_value == "string" && J.test(i.fixed_odds.default_value) && Ve(i.fixed_odds.default_value, "2") >= 0 && n.push(`${a}的固定赔率必须小于 2`));
	}), [...new Set(n)];
}
function Ie(e, t, n) {
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
	ye(e) || n.push(`${t}必须是非负整数`);
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
	].some((e) => typeof e != "string" || !Ce.test(e))) {
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
	].some((e) => typeof e != "string" || !J.test(e))) {
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
	if (!J.test(e)) return e;
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
//#region src/prediction-config/platform/views/prediction/query.ts
var Ze = (e, t) => e.includes("*") || e.includes(t), Qe = {
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
Qe.result, Qe.sort_direction;
//#endregion
//#region src/prediction-config/submission-outcome.ts
function $e(e, t) {
	if (!e || typeof e != "object") return;
	let n = e, r = [n.control?.submission_outcome, n.detail?.control?.submission_outcome];
	if (r.includes("UNVERIFIED") || n.client_request_id !== void 0 && n.client_request_id !== t) return "unverified";
	if (r.includes("REJECTED")) return n.client_request_id === t ? "rejected" : "unverified";
}
//#endregion
//#region src/prediction-config/platform/views/grid/config/journal.ts
var et = /^[1-9]\d*$/;
function tt(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function nt(e, t) {
	if (!e) throw Error(t);
}
function rt(e, t) {
	nt(Object.keys(e).length === t.length && t.every((t) => Object.hasOwn(e, t)), "PENDING_CORRUPT");
}
function it(e, t, n) {
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
		nt(i.length <= 32768, "PENDING_CORRUPT");
		let a;
		try {
			a = JSON.parse(i);
		} catch {
			throw Error("PENDING_CORRUPT");
		}
		return nt(tt(a), "PENDING_CORRUPT"), rt(a, [
			"schema",
			"operator_id",
			"command"
		]), nt(a.schema === 1 && typeof a.operator_id == "string" && et.test(a.operator_id), "PENDING_CORRUPT"), t(a.command), r(a);
	}
	function o(n, r, o) {
		nt(et.test(r), "IDENTITY_UNCONFIRMED"), nt(a(n) === null, "PENDING_EXISTS"), t(o);
		let s = {
			schema: 1,
			operator_id: r,
			command: JSON.parse(JSON.stringify(o))
		};
		n.setItem(e, JSON.stringify(s));
		let c = a(n);
		return nt(i(c, s), "PERSISTENCE_UNAVAILABLE"), c;
	}
	function s(e, n) {
		return nt(et.test(e), "IDENTITY_UNCONFIRMED"), t(n), r({
			operator_id: e,
			command: structuredClone(n)
		});
	}
	function c(e, n, r, i) {
		return t(n.command), t(i), nt(n.operator_id === r && JSON.stringify(n.command) === JSON.stringify(i), "STALE_CONFIRMATION"), o(e, n.operator_id, n.command);
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
		nt(i(a(t), r), "PENDING_CHANGED");
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
			if ((tt(n) ? n.operation_status : void 0) === "FAILED" && (o === "save" || o === "recover" && tt(n) && n.error_code === "VERSION_CONFLICT")) {
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
var at = [
	"parameters_available",
	"parameter_source",
	"stored_parameters",
	"global_parameters_source",
	"default_parameter_source",
	"default_global_parameters_source",
	"default_min_multiplier",
	"default_max_multiplier"
], ot = [
	"target_rtp",
	"min_multiplier",
	"max_multiplier",
	"min_order_amount",
	"max_order_amount"
], st = (e) => !!e && typeof e == "object" && !Array.isArray(e), ct = (e) => {
	if (!e) throw Error("INVALID_GRID_CONFIGURATION");
}, lt = (e) => typeof e == "string" && /^[1-9][0-9]*$/.test(e) && (e.length < 19 || e.length === 19 && e <= "9223372036854775807");
function ut(e) {
	if (e === null) return null;
	ct(st(e) && Object.keys(e).length === 3 && e.kind === "GLOBAL" && lt(e.version) && typeof e.effective_from_ms == "string" && /^[0-9]+$/.test(e.effective_from_ms));
	let t = e;
	return {
		kind: "GLOBAL",
		version: t.version,
		effective_from_ms: t.effective_from_ms
	};
}
function dt(e, t) {
	if (!at.some((t) => t in e)) return;
	if (ct(at.every((t) => t in e)), e.parameters_available === !1) throw Error("CONFIG_PARAMETERS_UNAVAILABLE");
	ct(e.parameters_available === !0 && [
		"GLOBAL",
		"SITE",
		"MERCHANT"
	].includes(String(e.parameter_source)) && ["GLOBAL", "SITE"].includes(String(e.default_parameter_source))), ct(st(e.stored_parameters) && Object.keys(e.stored_parameters).length === 5 && ot.every((t) => t in e.stored_parameters));
	let n = e.stored_parameters, r = Object.fromEntries(ot.map((e) => [e, n[e] === null ? null : t(n[e])]));
	ct(Object.values(r).every((t) => e.parameter_source === "GLOBAL" ? t === null : t !== null));
	let i = ut(e.global_parameters_source), a = ut(e.default_global_parameters_source);
	return ct(e.parameter_source === "GLOBAL" == (i !== null) && e.default_parameter_source === "GLOBAL" == (a !== null)), ct(!i || !a || i.version === a.version), {
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
function ft(e) {
	return e.global_parameters_source?.version ?? e.default_global_parameters_source?.version;
}
//#endregion
//#region src/prediction-config/platform/views/grid/config/model.ts
function pt(e, t = !0) {
	let n = structuredClone(e);
	return t && n.layout?.editable && n.layout.price_decimals == null && (n.layout.price_decimals = 3), n;
}
var mt = "grid.config.pending.v1", ht = /^(0|[1-9]\d*)(?:\.(\d+))?$/, gt = /^[1-9]\d*$/, _t = /^[A-Z0-9]{2,32}$/, vt = [
	"site_id",
	"symbol",
	"based_on_layout_version",
	"based_on_site_version",
	"client_request_id",
	"reason",
	"changes"
], yt = [
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
], bt = [
	"based_on_config_id",
	"based_on_default_version",
	"based_on_default_resolution_epoch"
], xt = [
	"price_band_width",
	"column_duration_seconds",
	"price_decimals"
], St = [
	"enabled",
	"target_rtp",
	"min_multiplier",
	"max_multiplier",
	"min_order_amount",
	"max_order_amount"
];
function Ct(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function X(e, t = "INVALID_GRID_CONFIGURATION") {
	if (!e) throw Error(t);
}
function wt(e, t) {
	X(Object.keys(e).length === t.length && Object.keys(e).every((e) => t.includes(e)), "PENDING_CORRUPT");
}
function Tt(e, t) {
	X(typeof e == "string" && e.length <= 128 && ht.test(e), "INVALID_DECIMAL");
	let [n, r = ""] = e.split("."), i = n.replace(/^0+(?=\d)/, ""), a = r.replace(/0+$/, "");
	return X(t === void 0 || a.length <= t, "INVALID_DECIMAL"), a ? i + "." + a : i;
}
function Et(e) {
	let [t, n = ""] = Tt(e).split(".");
	return {
		whole: t,
		fraction: n
	};
}
function Dt(e, t) {
	let n = Et(e), r = Et(t);
	if (n.whole.length !== r.whole.length) return n.whole.length > r.whole.length ? 1 : -1;
	if (n.whole !== r.whole) return n.whole > r.whole ? 1 : -1;
	let i = Math.max(n.fraction.length, r.fraction.length), a = n.fraction.padEnd(i, "0"), o = r.fraction.padEnd(i, "0");
	return a === o ? 0 : a > o ? 1 : -1;
}
function Ot(e, t) {
	let { whole: n, fraction: r } = Et(e), i = n + r, a = n.length + t, o;
	o = a <= 0 ? "0." + "0".repeat(-a) + i : a >= i.length ? i + "0".repeat(a - i.length) : i.slice(0, a) + "." + i.slice(a);
	let [s, c = ""] = o.split("."), l = s.replace(/^0+(?=\d)/, "") || "0", u = c.replace(/0+$/, "");
	return u ? l + "." + u : l;
}
function kt(e) {
	let t = Tt(e);
	return X(Dt(t, "0") > 0 && Dt(t, "1") <= 0, "INVALID_RTP"), Ot(t, 2);
}
function At(e) {
	let t = Tt(e);
	return X(Dt(t, "0") > 0 && Dt(t, "100") < 0, "INVALID_RTP"), Ot(t, -2);
}
function jt(e = globalThis.crypto) {
	X(e && typeof e.getRandomValues == "function", "SECURE_RANDOM_UNAVAILABLE");
	let t = e.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	X(t instanceof Uint8Array && t.length === 16, "SECURE_RANDOM_UNAVAILABLE"), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0")).join("");
	return `${n.slice(0, 8)}-${n.slice(8, 12)}-${n.slice(12, 16)}-${n.slice(16, 20)}-${n.slice(20)}`;
}
function Mt(e) {
	return X(typeof e == "string" && gt.test(e) && Dt(e, "25") <= 0, "INVALID_LAYOUT_DURATION"), e;
}
function Nt(e) {
	let t = Mt(e);
	return X(Dt(t, "10") <= 0, "INVALID_LAYOUT_DURATION"), t;
}
function Pt(e, t) {
	let n = Tt(e, t);
	return X(Dt(n, "0") > 0, "INVALID_LAYOUT_WIDTH"), n;
}
function Ft(e) {
	if (typeof e != "string") return !1;
	let t = /^(?:0|[1-9]\d*)\.(\d+)$/.exec(e)?.[1];
	return t !== void 0 && t.length > 8;
}
function It(e) {
	return X(e === null || typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 18, "INVALID_LAYOUT_PRECISION"), e;
}
function Lt(e) {
	return X(typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 8, "INVALID_LAYOUT_PRECISION"), e;
}
function Rt(e, t) {
	t != null && X((Tt(e).split(".")[1] ?? "").length <= t, "INVALID_LAYOUT_PRECISION");
}
function zt(e, t) {
	X(5 + (Number(e) + 1) * Number(t) <= 120, "INVALID_LAYOUT_HORIZON");
}
function Bt(e) {
	return X(Ct(e), "INVALID_GRID_LAYOUT"), wt(e, [
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
	].every((e) => typeof e == "string" && e.length <= 128 && gt.test(e)), "INVALID_GRID_LAYOUT"), X(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_LAYOUT"), X(typeof e.editable == "boolean", "INVALID_GRID_LAYOUT"), X(Array.isArray(e.affected_site_ids) && e.affected_site_ids.every((e) => typeof e == "string" && e.length > 0 && e.length <= 64 && e.trim() === e), "INVALID_GRID_LAYOUT"), X(new Set(e.affected_site_ids).size === e.affected_site_ids.length && (!e.editable || e.affected_site_ids.length > 0), "INVALID_GRID_LAYOUT"), {
		row_count: e.row_count,
		column_count: e.column_count,
		column_duration_seconds: e.column_duration_seconds,
		price_band_width: Pt(e.price_band_width),
		..."price_decimals" in e ? { price_decimals: It(e.price_decimals) } : {},
		effective_from_ms: e.effective_from_ms,
		editable: e.editable,
		affected_site_ids: [...e.affected_site_ids]
	};
}
function Vt(e, t, n = !1) {
	return !!(n && e.layout?.editable && t.layout && xt.some((n) => e.layout[n] !== t.layout[n]));
}
function Ht(e) {
	X(Ct(e), "INVALID_GRID_CONFIGURATION"), wt(e, [
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
		..."config_id" in e ? yt : [],
		...at.filter((t) => t in e),
		..."availability_version" in e ? ["availability_version"] : []
	]), X(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "INVALID_GRID_CONFIGURATION"), X(typeof e.symbol == "string" && _t.test(e.symbol), "INVALID_GRID_CONFIGURATION"), X([e.layout_version, e.site_version].every((e) => typeof e == "string" && gt.test(e)), "INVALID_GRID_CONFIGURATION"), X(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_CONFIGURATION"), X(typeof e.enabled == "boolean", "INVALID_GRID_CONFIGURATION");
	let t = {
		site_id: e.site_id,
		symbol: e.symbol,
		layout_version: e.layout_version,
		site_version: e.site_version,
		effective_from_ms: e.effective_from_ms,
		enabled: e.enabled,
		target_rtp: Tt(e.target_rtp),
		min_multiplier: Tt(e.min_multiplier, 2),
		max_multiplier: Tt(e.max_multiplier, 2),
		min_order_amount: Tt(e.min_order_amount, 8),
		max_order_amount: Tt(e.max_order_amount, 8)
	};
	if (X(Dt(t.target_rtp, "0") > 0 && Dt(t.target_rtp, "1") <= 0, "INVALID_GRID_CONFIGURATION"), X(Dt(t.min_multiplier, "1") >= 0 && Dt(t.max_multiplier, t.min_multiplier) >= 0, "INVALID_GRID_CONFIGURATION"), X(Dt(t.min_order_amount, "0") > 0 && Dt(t.max_order_amount, t.min_order_amount) >= 0, "INVALID_GRID_CONFIGURATION"), "config_id" in e) {
		for (let n of [
			"config_id",
			"default_config_id",
			"default_version",
			"default_resolution_epoch"
		]) X(typeof e[n] == "string" && gt.test(e[n]) && Dt(e[n], "9223372036854775807") <= 0), t[n] = e[n];
		X(typeof e.requested_agent_id == "string" && /^(0|[1-9][0-9]*)$/.test(e.requested_agent_id) && Dt(e.requested_agent_id, "9223372036854775807") <= 0), X(e.agent_id === null || e.agent_id === e.requested_agent_id && e.agent_id !== "0"), t.requested_agent_id = e.requested_agent_id, t.agent_id = e.agent_id;
		for (let n of [
			"inherited",
			"default_enabled",
			"effective_enabled"
		]) X(typeof e[n] == "boolean"), t[n] = e[n];
		for (let n of [
			"default_target_rtp",
			"default_min_order_amount",
			"default_max_order_amount"
		]) t[n] = Tt(e[n]);
	}
	return "availability_version" in e && (X(typeof e.availability_version == "string" && /^(0|[1-9][0-9]*)$/.test(e.availability_version) && Dt(e.availability_version, "9223372036854775807") <= 0), t.availability_version = e.availability_version), Object.assign(t, dt(e, Tt)), "layout" in e && (t.layout = Bt(e.layout)), t;
}
function Ut(e, t, n) {
	let r = Ht(e);
	return X(r.site_id === t && r.symbol === n, "INVALID_GRID_TARGET"), r;
}
function Wt(e, t, n, r, i, a = !1) {
	if (Ct(e) && e.site_version === "0") return Gt(e, t, n, r, i, a);
	let o = Ct(e) && Ct(e.layout) ? e.layout.price_band_width : void 0, s = Ct(t) && Ct(t.layout) ? t.layout.price_band_width : void 0;
	X(o === s || !Ft(s), "INVALID_LAYOUT_PRECISION");
	let c = Ht(e), l = Ht(t);
	X(c.site_id === l.site_id && c.symbol === l.symbol, "INVALID_GRID_TARGET"), X(typeof n == "string" && n.length <= 500 && n.trim().length > 0 && !n.includes("\0"), "INVALID_REASON"), X(typeof r == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(r), "INVALID_REQUEST_ID"), X(c.config_id && c.default_version && c.default_resolution_epoch, "CONFIG_IDENTITY_REQUIRED"), X(yt.every((e) => c[e] === l[e]), "INVALID_GRID_TARGET"), X(JSON.stringify(dt(c, Tt)) === JSON.stringify(dt(l, Tt)), "INVALID_GRID_TARGET");
	let u = {};
	for (let e of St) c[e] !== l[e] && (u[e] = l[e]);
	for (let e of xt) c.layout?.[e] !== l.layout?.[e] && (X(a && c.layout?.editable && l.layout, "FIELD_FORBIDDEN"), u[e] = l.layout[e]);
	if (c.requested_agent_id !== "0" && !(u.enabled === !1 && Object.keys(u).length === 1) && (X(!l.enabled || c.default_enabled, "PLATFORM_LIMIT"), X(Dt(l.target_rtp, c.default_target_rtp) <= 0 && Dt(l.min_order_amount, c.default_min_order_amount) >= 0 && Dt(l.max_order_amount, c.default_max_order_amount) <= 0, "PLATFORM_LIMIT")), xt.some((e) => e in u)) {
		let e = c.layout;
		"price_decimals" in u && Lt(u.price_decimals), Rt(l.layout.price_band_width, l.layout.price_decimals), Pt(u.price_band_width ?? e.price_band_width, 18), "column_duration_seconds" in u && Nt(u.column_duration_seconds);
		let t = Mt(u.column_duration_seconds ?? e.column_duration_seconds);
		X(Dt(e.row_count, "10000") <= 0 && Dt(e.column_count, "10000") <= 0 && Number(e.row_count) * Number(e.column_count) <= 1e4, "INVALID_GRID_LAYOUT"), zt(e.column_count, t);
	}
	if (!i && ("min_multiplier" in u || "max_multiplier" in u)) throw Error("FIELD_FORBIDDEN");
	return X(Object.keys(u).length > 0, "EMPTY_CHANGES"), {
		site_id: c.site_id,
		symbol: c.symbol,
		based_on_layout_version: c.layout_version,
		based_on_site_version: c.site_version,
		based_on_config_id: c.config_id,
		...c.requested_agent_id === "0" && u.enabled === !0 && c.availability_version !== void 0 ? { based_on_availability_version: c.availability_version } : {},
		...ft(c) ? { based_on_global_version: ft(c) } : {},
		based_on_default_version: c.default_version,
		based_on_default_resolution_epoch: c.default_resolution_epoch,
		client_request_id: r,
		reason: n,
		changes: u
	};
}
function Gt(e, t, n, r, i, a) {
	X(i && a && Ct(t) && e.site_id === t.site_id && e.symbol === t.symbol, "INVALID_GRID_TARGET"), X(e.layout_version === t.layout_version && t.site_version === "0", "INVALID_GRID_TARGET"), e.layout_version === "0" && Ct(t.layout) && X(!Ft(t.layout.price_band_width), "INVALID_LAYOUT_PRECISION");
	let o = Ht({
		...t,
		enabled: !1,
		site_version: "1",
		layout_version: e.layout_version === "0" ? "1" : e.layout_version
	}), s = { enabled: !1 };
	for (let e of St) e !== "enabled" && (s[e] = o[e]);
	let c = [
		"row_count",
		"column_count",
		...xt
	];
	if (e.layout_version === "0") {
		X(o.layout, "INVALID_GRID_LAYOUT"), Nt(o.layout.column_duration_seconds);
		for (let e of c) e === "price_decimals" && o.layout.price_decimals == null || (s[e] = o.layout[e]);
		Rt(o.layout.price_band_width, o.layout.price_decimals);
	} else {
		let t = e.layout;
		X(Ct(t) && o.layout && c.every((e) => t[e] === o.layout[e]), "FIELD_FORBIDDEN");
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
	return Kt(l), l;
}
function Kt(e) {
	if (X(Ct(e), "PENDING_CORRUPT"), wt(e, [
		...vt,
		..."based_on_config_id" in e ? bt : [],
		..."based_on_global_version" in e ? ["based_on_global_version"] : [],
		..."based_on_availability_version" in e ? ["based_on_availability_version"] : []
	]), "based_on_availability_version" in e && X(typeof e.based_on_availability_version == "string" && /^(0|[1-9][0-9]*)$/.test(e.based_on_availability_version) && Dt(e.based_on_availability_version, "9223372036854775807") <= 0 && Ct(e.changes) && e.changes.enabled === !0, "PENDING_CORRUPT"), "based_on_global_version" in e && X(typeof e.based_on_global_version == "string" && /^(0|[1-9][0-9]*)$/.test(e.based_on_global_version) && Dt(e.based_on_global_version, "9223372036854775807") <= 0, "PENDING_CORRUPT"), "based_on_config_id" in e) for (let t of bt) X(typeof e[t] == "string" && gt.test(e[t]) && Dt(e[t], "9223372036854775807") <= 0, "PENDING_CORRUPT");
	X(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "PENDING_CORRUPT"), X(typeof e.symbol == "string" && _t.test(e.symbol), "PENDING_CORRUPT");
	let t = e.based_on_site_version === "0";
	X(typeof e.based_on_layout_version == "string" && (gt.test(e.based_on_layout_version) || t && e.based_on_layout_version === "0"), "PENDING_CORRUPT"), X(typeof e.based_on_site_version == "string" && (t || gt.test(e.based_on_site_version)), "PENDING_CORRUPT"), X(typeof e.client_request_id == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(e.client_request_id), "PENDING_CORRUPT"), X(typeof e.reason == "string" && e.reason.length <= 500 && e.reason.trim().length > 0 && !e.reason.includes("\0"), "PENDING_CORRUPT");
	let n = [
		...St,
		...xt,
		...t ? ["row_count", "column_count"] : []
	];
	X(Ct(e.changes) && Object.keys(e.changes).length > 0 && Object.keys(e.changes).every((e) => n.includes(e)), "PENDING_CORRUPT");
	for (let [t, n] of Object.entries(e.changes)) t === "enabled" ? X(typeof n == "boolean", "PENDING_CORRUPT") : t === "row_count" || t === "column_count" ? X(typeof n == "string" && /^[1-9]\d{0,4}$/.test(n), "INVALID_GRID_LAYOUT") : t === "price_decimals" ? Lt(n) : t === "price_band_width" ? Pt(n, 18) : t === "column_duration_seconds" ? Mt(n) : Tt(n, t.includes("order_amount") ? 8 : t.includes("multiplier") ? 2 : void 0);
	if (t) {
		X(!("based_on_config_id" in e) && e.changes.enabled === !1, "PENDING_CORRUPT");
		let t = e.based_on_layout_version === "0";
		if (wt(e.changes, [...St, ...t ? [
			"row_count",
			"column_count",
			...xt.filter((t) => t !== "price_decimals" || Object.prototype.hasOwnProperty.call(e.changes, t))
		] : []]), Ht({
			...Object.fromEntries(St.map((t) => [t, e.changes[t]])),
			site_id: e.site_id,
			symbol: e.symbol,
			site_version: "1",
			layout_version: "1",
			effective_from_ms: "0"
		}), X(Dt(e.based_on_layout_version, "9223372036854775807") <= 0, "PENDING_CORRUPT"), t) {
			let t = e.changes;
			X(Number(t.row_count) * Number(t.column_count) <= 1e4, "INVALID_GRID_LAYOUT"), Pt(t.price_band_width, 8), zt(t.column_count, t.column_duration_seconds);
		}
	}
}
function qt(e, t) {
	return Ct(e) ? e.operation_status === "SUCCEEDED" && typeof e.operation_id == "string" && gt.test(e.operation_id) && e.site_id === t.command.site_id && e.symbol === t.command.symbol && typeof e.layout_version == "string" && gt.test(e.layout_version) && typeof e.site_version == "string" && gt.test(e.site_version) && typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms) && typeof e.changed == "boolean" && [
		"PENDING",
		"DONE",
		"NOT_REQUIRED"
	].includes(String(e.cache_state)) : !1;
}
function Jt(e) {
	return Ct(e) && e.error_code === "RECEIPT_UNCONFIRMED" && e.operation_status === "UNKNOWN";
}
var { readPending: Yt, persistPending: Xt, captureSaveReview: Zt, persistReviewedCommand: Qt, pendingForActor: $t, attemptPending: en } = it(mt, Kt, qt), tn = class {
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
}, nn = [
	"game_type",
	"symbol",
	"based_on_template_version"
], rn = {
	"config.save": [...nn, "platform_template"],
	"config.availability": [
		...nn,
		"action",
		"enabled"
	]
};
function an(e, t) {
	let n = t;
	return e === "routing.prepare" || e === "routing.cancel" ? n?.change?.receipt : e === "routing.commit" ? n?.binding?.receipt : n?.receipt;
}
var on = class {
	busy = !1;
	key;
	storage;
	action;
	constructor(e, t, n, r) {
		if (!t || !rn[n] || !r) throw Error("无法确认当前操作上下文");
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
			...rn[this.action],
			"reason",
			"client_request_id",
			...this.action === "config.save" && e.action === "save_parameters" ? ["action"] : []
		];
		if (Object.keys(e).some((e) => !t.includes(e)) || typeof e.reason != "string" || !e.reason.trim() || e.reason.length > 500 || typeof e.client_request_id != "string" || !e.client_request_id || e.client_request_id.length > 128) throw Error("操作记录字段无效");
		if (rn[this.action].some((t) => !Object.hasOwn(e, t))) throw Error("操作记录缺少必要字段");
		let n = (t) => typeof e[t] == "string" && !!e[t].trim() && e[t].length <= 128;
		if (!["UP_DOWN", "HIGH_LOW"].includes(String(e.game_type)) || !n("symbol") || typeof e.based_on_template_version != "string" || !/^(0|[1-9]\d*)$/.test(e.based_on_template_version)) throw Error("配置操作记录无效");
		if (this.action === "config.availability") {
			if (e.action !== "set_enabled" || typeof e.enabled != "boolean") throw Error("开关操作记录无效");
		} else if (this.action === "config.save") {
			let t = e.platform_template;
			if (!["UP_DOWN", "HIGH_LOW"].includes(String(e.game_type)) || !n("symbol") || !t || (e.action === "save_parameters" ? Object.hasOwn(t, "enabled") : typeof t.enabled != "boolean") || !Array.isArray(t.rules)) throw Error("配置操作记录无效");
			let r = {
				game_type: e.game_type,
				symbol: e.symbol,
				based_on_template_version: e.based_on_template_version,
				enabled: t.enabled ?? !1,
				rules: structuredClone(t.rules)
			};
			if (r.game_type === "UP_DOWN") for (let e of r.rules) {
				let t = e.stake_tiers?.find((e) => !e.retired);
				t && (e.minimum_stake ??= t.minimum_stake, e.maximum_stake ??= t.maximum_stake);
			}
			if (Fe(r, t.enabled !== !0 && r.rules.every((e) => e.market_id === void 0 && (e.stake_tiers ?? []).every((e) => e.stake_tier_id === void 0))).length) throw Error("配置操作记录无效");
		}
	}
	begin(e, t = jt()) {
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
			let n = await e(structuredClone(t.body)), i = an(this.action, n);
			if (typeof i?.operation_id != "string" || !i.operation_id || i.client_request_id !== t.body.client_request_id || i.result !== "OPERATION_RESULT_SUCCEEDED") throw Error("未收到可核验的成功回执");
			return this.ownsStoredIntent(t) && this.storage.removeItem(this.key), n;
		} catch (e) {
			let r = e, i = this.read();
			if (!i || JSON.stringify(i.body) !== JSON.stringify(t.body)) throw e;
			let a = $e(e, t.body.client_request_id), o = i.attemptGeneration === t.attemptGeneration, s = !n && a !== "unverified", c = this.action === "config.save" && r?.error_code === "ERROR_CODE_MARK_PRICE_UNAVAILABLE", l = s && (c || [
				"ERROR_CODE_INVALID_ARGUMENT",
				"ERROR_CODE_NOT_FOUND",
				"ERROR_CODE_CONFLICT",
				"ERROR_CODE_PERMISSION_DENIED",
				"ERROR_CODE_UNAUTHENTICATED"
			].includes(r?.error_code || ""));
			throw o && (a === "rejected" || l) ? this.storage.removeItem(this.key) : (i.state = "unverified", this.storage.setItem(this.key, JSON.stringify(i))), e;
		} finally {
			this.busy = !1;
		}
	}
}, sn = ["data-action"], cn = {
	key: 2,
	class: "pending-summary"
}, ln = { key: 0 }, un = {
	key: 5,
	role: "status"
}, dn = /*#__PURE__*/ n(/* @__PURE__ */ f({
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
		let r = e, c = n, l = me(), f = i(() => Ze(l.perms, r.permission)), ee = v(""), p = v(""), m = v(""), h = v(!1), te = v(null), g = v(""), re = i(() => !!((te.value || r.newAllowed) && (p.value && !r.hideError || te.value && !r.hidePendingDetails || !te.value && !r.automaticReason || f.value && !r.hideButton || m.value && !r.hideSuccess))), ie, ae = 0;
		se(h, (e) => c("busy", e), { flush: "sync" });
		function y() {
			try {
				te.value = ie?.read() ?? null, c("pending", !!te.value);
			} catch (e) {
				g.value = Se(e), p.value = g.value;
			}
		}
		se(() => [
			r.action,
			r.target,
			String(l.userInfo.id || "")
		], () => {
			if (ae++, h.value = !1, ee.value = "", p.value = "", m.value = "", g.value = "", te.value = null, c("pending", !1), ie = void 0, r.target) try {
				ie = new on(sessionStorage, String(l.userInfo.id || ""), r.action, r.target), y();
			} catch (e) {
				g.value = Se(e), p.value = g.value;
			}
		}, {
			immediate: !0,
			flush: "sync"
		});
		async function b() {
			if (h.value || r.blocked || !f.value || !ie || g.value) return;
			let e = ie, t = ae, n = String(l.userInfo.id || ""), i = r.action, a = r.target, o = r.send, s = () => t === ae && ie === e && n === String(l.userInfo.id || "") && i === r.action && a === r.target;
			p.value = "", m.value = "";
			try {
				if (!te.value) {
					if (r.disabled || !r.newAllowed) return;
					let t = r.automaticReason?.trim() || ee.value.trim();
					if (!t) throw Error("请填写操作原因");
					e.begin({
						...r.payload(),
						reason: t
					}), y();
				}
				h.value = !0;
				let t = await e.attempt(o);
				if (!s()) return;
				m.value = "操作已确认成功", ee.value = "", c("success", t);
			} catch (e) {
				s() && (p.value = Se(e));
			} finally {
				s() && (h.value = !1, y());
			}
		}
		ne(() => {
			ae++, c("busy", !1);
		});
		function x() {
			h.value || te.value || (m.value = "", g.value || (p.value = ""));
		}
		return t({
			submit: b,
			success: m,
			error: p,
			clearFeedback: x
		}), (t, n) => re.value ? (_(), s("section", {
			key: 0,
			class: "prediction-write",
			"data-action": e.action
		}, [
			p.value && !e.hideError ? (_(), a(w(O), {
				key: 0,
				title: p.value,
				type: "error",
				closable: !1,
				"show-icon": ""
			}, null, 8, ["title"])) : o("", !0),
			te.value && !e.hidePendingDetails ? (_(), a(w(O), {
				key: 1,
				title: "上次操作结果尚未确定。核验将使用原操作内容，不会重复创建新的操作。",
				type: "warning",
				closable: !1
			})) : o("", !0),
			te.value && !e.hidePendingDetails ? (_(), s("div", cn, [u(" 操作号：" + S(te.value.body.client_request_id), 1), e.automaticReason ? o("", !0) : (_(), s("span", ln, " · 原因：" + S(te.value.body.reason), 1))])) : !te.value && !e.automaticReason ? (_(), a(w(F), {
				key: 3,
				label: "操作原因",
				required: ""
			}, {
				default: T(() => [d(w(L), {
					modelValue: ee.value,
					"onUpdate:modelValue": n[0] ||= (e) => ee.value = e,
					type: "textarea",
					rows: 2,
					maxlength: "500",
					"show-word-limit": "",
					placeholder: "请说明本次调整原因",
					disabled: h.value || e.disabled
				}, null, 8, ["modelValue", "disabled"])]),
				_: 1
			})) : o("", !0),
			f.value && !e.hideButton ? (_(), a(w(k), {
				key: 4,
				type: "primary",
				loading: h.value,
				disabled: h.value || e.blocked || !te.value && e.disabled || !!g.value,
				onClick: b
			}, {
				default: T(() => [u(S(te.value ? "核验原操作" : e.label), 1)]),
				_: 1
			}, 8, ["loading", "disabled"])) : o("", !0),
			m.value && !e.hideSuccess ? (_(), s("p", un, S(m.value), 1)) : o("", !0)
		], 8, sn)) : o("", !0);
	}
}), [["__scopeId", "data-v-e2bd32a3"]]), fn = (e = !1) => ({
	default_value: "",
	minimum_value: "",
	maximum_value: "",
	agent_editable: e
});
function pn(e, t, n) {
	return {
		is_new: !0,
		game_type: e,
		symbol: t,
		based_on_template_version: n,
		enabled: !1,
		rules: (e === "UP_DOWN" ? we : Te).map((t) => ({
			duration_seconds: t,
			enabled_by_default: !0,
			minimum_stake: fn(!0),
			maximum_stake: fn(!0),
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
				target_payout_rate: fn(),
				minimum_odds: {
					default_value: "1",
					minimum_value: "1",
					maximum_value: "1",
					agent_editable: !1
				},
				maximum_odds: fn(),
				stake_tiers: [{
					enabled_by_default: !0,
					display_order: 1,
					minimum_stake: fn(!0),
					maximum_stake: fn(!0),
					retired: !1
				}]
			} : { fixed_odds: fn(!0) }
		}))
	};
}
function mn(e, t, n) {
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
//#region src/prediction-config/platform/views/prediction/components/PredictionLoadingRegion.vue?vue&type=script&setup=true&lang.ts
var hn = ["inert", "aria-hidden"], gn = /*#__PURE__*/ n(/* @__PURE__ */ f({
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
		let n = e, r = v(!1), i;
		function o() {
			i !== void 0 && clearTimeout(i), i = void 0;
		}
		return se(() => n.loading, (e) => {
			o(), r.value = !1, e && (i = setTimeout(() => {
				i = void 0, r.value = n.loading;
			}, 150));
		}, {
			immediate: !0,
			flush: "sync"
		}), ne(o), (n, i) => (_(), a(b(e.as), {
			class: te(["prediction-loading-region", { "is-loading": e.loading }]),
			style: g({ "--prediction-loading-min-height": e.minHeight }),
			"aria-busy": e.loading
		}, {
			default: T(() => [c("div", {
				class: te(["prediction-loading-region__content", { "is-hidden": e.hideContent }]),
				inert: e.loading || void 0,
				"aria-hidden": e.hideContent || void 0
			}, [y(n.$slots, "default", {}, void 0, !0)], 10, hn), d(w(t), {
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
		let t = e, n = v(!1), r = {
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
		return (t, r) => s.value ? (_(), a(w(B), {
			key: 0,
			visible: n.value,
			"onUpdate:visible": r[2] ||= (e) => n.value = e,
			trigger: "click",
			placement: "top",
			width: 300,
			title: e.label
		}, {
			reference: T(() => [c("button", {
				type: "button",
				class: "prediction-help-button",
				"aria-label": `${e.label}说明`,
				"aria-expanded": n.value,
				onClick: r[0] ||= D(() => {}, ["stop"]),
				onKeydown: r[1] ||= E(D((e) => n.value = !1, ["prevent"]), ["esc"])
			}, [d(w(I), null, {
				default: T(() => [d(w(U))]),
				_: 1
			})], 40, vn)]),
			default: T(() => [c("p", _n, S(s.value), 1)]),
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
	let ee = f.slice(-o).replace(/0+$/, "");
	return f.slice(0, -o) + (ee ? "." + ee : "");
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
		let n = e, r = L, o = t, s = H(), d = v(n.percentage ? Sn(n.modelValue, 2) : n.modelValue);
		se(() => [n.modelValue, n.percentage], () => {
			n.percentage && Sn(d.value, -2) === n.modelValue || (d.value = n.percentage ? Sn(n.modelValue, 2) : n.modelValue);
		});
		let f = (e) => xn(d.value, n.step, e, n.min, n.max), ee = i(() => f(1)), p = i(() => f(-1));
		function h(e) {
			if (s.value) return;
			d.value = e;
			let t = n.percentage ? Sn(e, -2) : e;
			o("update:modelValue", t), o("input", t);
		}
		function te(e) {
			if (s.value) return;
			let t = f(e);
			t !== null && t !== d.value && h(t);
		}
		return (t, n) => (_(), a(b(e.inputComponent || w(r)), m({ class: "prediction-decimal-input" }, t.$attrs, {
			modelValue: d.value,
			disabled: w(s),
			inputmode: t.$attrs.inputmode || "decimal",
			"onUpdate:modelValue": h,
			onKeydown: [n[4] ||= E(D((e) => te(1), ["prevent"]), ["up"]), n[5] ||= E(D((e) => te(-1), ["prevent"]), ["down"])]
		}), l({
			suffix: T(() => [c("span", Cn, [c("button", {
				type: "button",
				tabindex: "-1",
				"aria-label": "增加数值",
				disabled: w(s) || ee.value === null || ee.value === d.value,
				onMousedown: n[0] ||= D(() => {}, ["prevent"]),
				onClick: n[1] ||= (e) => te(1)
			}, [...n[6] ||= [c("svg", {
				viewBox: "0 0 12 12",
				"aria-hidden": "true"
			}, [c("path", { d: "m3 7 3-3 3 3" })], -1)]], 40, wn), c("button", {
				type: "button",
				tabindex: "-1",
				"aria-label": "减少数值",
				disabled: w(s) || p.value === null || p.value === d.value,
				onMousedown: n[2] ||= D(() => {}, ["prevent"]),
				onClick: n[3] ||= (e) => te(-1)
			}, [...n[7] ||= [c("svg", {
				viewBox: "0 0 12 12",
				"aria-hidden": "true"
			}, [c("path", { d: "m3 5 3 3 3-3" })], -1)]], 40, Tn)])]),
			_: 2
		}, [e.unit || t.$slots.append ? {
			name: "append",
			fn: T(() => [y(t.$slots, "append", {}, () => [u(S(e.unit), 1)], !0)]),
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
	props: /*@__PURE__*/ p({
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
		let n = t, r = oe(t, "modelValue"), a = i({
			get: () => n.percentage ? Ue(r.value[n.field]) : r.value[n.field],
			set: (e) => {
				let t = r.value[n.field], i = n.percentage ? We(e) : e;
				n.field === "default_value" && r.value.maximum_value === t && (n.agentLocked && r.value.minimum_value === t && (r.value.minimum_value = i), r.value.maximum_value = i), r.value[n.field] = i;
			}
		});
		return (n, r) => (_(), s("div", {
			class: te(["prediction-constraint", { "is-compact": t.compact }]),
			role: "group",
			"aria-label": t.title
		}, [
			c("div", On, [u(S(t.title), 1), d(yn, { label: t.title }, null, 8, ["label"])]),
			d(En, {
				"input-component": w(e),
				step: t.percentage ? "1" : "0.01",
				modelValue: a.value,
				"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
				"aria-label": t.title,
				disabled: t.disabled
			}, l({ _: 2 }, [t.percentage || t.unit ? {
				name: "append",
				fn: T(() => [u(S(t.percentage ? "%" : t.unit), 1)]),
				key: "0"
			} : void 0]), 1032, [
				"input-component",
				"step",
				"modelValue",
				"aria-label",
				"disabled"
			]),
			t.description ? (_(), s("p", kn, S(t.description), 1)) : o("", !0)
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
		let n = e, l = t, f = i(() => n.rooms.filter((e) => e.present)), ee = i(() => n.rooms.filter((e) => !e.present && e.allowed)), p = v(""), m = v(), h = v(""), g = v("");
		function ne() {
			p.value = "", m.value = void 0, h.value = "";
		}
		function re(e) {
			n.disabled || !e.present || (g.value = n.context, m.value = e, p.value = "remove");
		}
		function ie() {
			n.disabled || !ee.value.length || (g.value = n.context, h.value = ee.value[0].key, p.value = "add");
		}
		function y() {
			return !n.disabled && g.value === n.context;
		}
		function b() {
			let e = m.value?.key;
			p.value === "remove" && y() && n.rooms.some((t) => t.key === e && t.present) && l("change", e, !1), ne();
		}
		function x() {
			p.value === "add" && y() && ee.value.some((e) => e.key === h.value) && l("change", h.value, !0), ne();
		}
		return se(() => n.context, ne, { flush: "sync" }), (t, n) => (_(), s("div", jn, [
			c("div", Mn, [(_(!0), s(r, null, ae(f.value, (t) => (_(), s("span", {
				key: t.key,
				class: te(["room-tag", { active: e.selected === t.key }])
			}, [c("button", {
				type: "button",
				"data-room-choice": t.key,
				"aria-pressed": e.selected === t.key,
				onClick: (e) => l("select", t.key)
			}, S(t.label), 9, Nn), c("button", {
				type: "button",
				class: "room-remove",
				"data-room-remove": t.key,
				"aria-label": `删除${t.label}房间`,
				disabled: e.disabled,
				onClick: (e) => re(t)
			}, "×", 8, Pn)], 2))), 128)), d(w(k), {
				class: "room-add",
				"data-room-add": !0,
				disabled: e.disabled || !ee.value.length,
				onClick: ie
			}, {
				default: T(() => [...n[1] ||= [u("＋ 新增周期", -1)]]),
				_: 1
			}, 8, ["disabled"])]),
			f.value.length ? o("", !0) : (_(), s("p", Fn, "暂无房间，可从固定周期中新增。保存后生效。")),
			p.value ? (_(), a(w(M), {
				key: 1,
				"model-value": !0,
				title: p.value === "remove" ? "确认删除周期？" : "新增周期",
				width: "460px",
				"append-to-body": "",
				class: "prediction-room-dialog mm-ui",
				"close-on-click-modal": !1,
				"onUpdate:modelValue": ne
			}, {
				footer: T(() => [d(w(k), {
					"data-room-cancel": !0,
					onClick: ne
				}, {
					default: T(() => [...n[5] ||= [u("取消", -1)]]),
					_: 1
				}), p.value === "remove" ? (_(), a(w(k), {
					key: 0,
					type: "danger",
					"data-room-confirm": !0,
					disabled: e.disabled,
					onClick: b
				}, {
					default: T(() => [...n[6] ||= [u("确认删除", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (_(), a(w(k), {
					key: 1,
					type: "primary",
					"data-room-add-confirm": !0,
					disabled: e.disabled || !h.value,
					onClick: x
				}, {
					default: T(() => [...n[7] ||= [u("确认新增", -1)]]),
					_: 1
				}, 8, ["disabled"]))]),
				default: T(() => [p.value === "remove" ? (_(), s(r, { key: 0 }, [
					c("p", In, S(e.description) + " · " + S(m.value?.label), 1),
					n[2] ||= c("p", { class: "dialog-description" }, "删除后该房间将从当前配置中移除，点击保存配置后停止生效。", -1),
					n[3] ||= c("p", { class: "dialog-note" }, "该操作不会影响已创建订单，历史订单仍保留原配置快照。后续可从固定周期中重新添加。", -1)
				], 64)) : (_(), s(r, { key: 1 }, [n[4] ||= c("label", { class: "dialog-label" }, "预测周期", -1), d(w(ue), {
					modelValue: h.value,
					"onUpdate:modelValue": n[0] ||= (e) => h.value = e,
					placeholder: "请选择周期",
					style: { width: "100%" },
					disabled: e.disabled
				}, {
					default: T(() => [(_(!0), s(r, null, ae(ee.value, (e) => (_(), a(w(le), {
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
	key: 2,
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
		let { predictionConfigurationDetail: f, predictionConfigurationList: ee, predictionConfigurationSave: p } = fe().api, m = t, h = v(), g = v(), re = v(!1), ie = v();
		function y() {
			g.value?.submit();
		}
		function x() {
			ie.value?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		let oe = l, E = me(), D = v(!1), j = v(!1), M = v(""), P = v(), I = v(!1), L = i(() => Ze(E.perms, "prediction_config:edit")), R = v(""), z = v("UP_DOWN"), le = v(""), B = i({
			get: () => P.value?.rules[0]?.price_rule.price_decimals ?? void 0,
			set: (e) => {
				if (!(!P.value || !L.value || !Y.value.ready || I.value || re.value)) for (let t of P.value.rules) t.price_rule.price_decimals = e ?? null;
			}
		}), ue = v("");
		se(B, (e) => {
			Number.isNaN(e) || (ue.value = e == null ? "" : String(e));
		}, {
			immediate: !0,
			flush: "sync"
		});
		let H = i({
			get: () => ue.value,
			set: (e) => {
				!P.value || !L.value || !Y.value.ready || I.value || re.value || (ue.value = e, B.value = e === "" ? void 0 : /^[0-8]$/.test(e) ? Number(e) : NaN);
			}
		}), U = v(!1), W = i(() => P.value?.game_type === "UP_DOWN" ? [...P.value.rules].sort((e, t) => we.indexOf(e.duration_seconds) - we.indexOf(t.duration_seconds)) : P.value?.rules ?? []), G = i(() => W.value.filter((e) => e.enabled_by_default)), K = i(() => W.value.map((e) => ({
			key: e.duration_seconds,
			label: xe(e.duration_seconds, P.value?.game_type),
			present: e.enabled_by_default,
			allowed: !0
		}))), q = i(() => m.inline ? h.value?.enabled_by_default ? [h.value] : [] : G.value);
		function pe(e) {
			h.value = G.value.find((t) => t.duration_seconds === e);
		}
		function he(e, t) {
			if (!L.value || !Y.value.ready || I.value || re.value) return;
			let n = W.value.find((t) => t.duration_seconds === e);
			!n || n.enabled_by_default === t || (n.enabled_by_default = t, h.value = t ? n : G.value[0]);
		}
		let ge = v(0), _e = v(0), ve = v(""), ye = v(""), be, J = i(() => String(E.userInfo.id || "")), Y = i(() => ({
			target: R.value,
			generation: ge.value,
			actor: ve.value,
			enabled: P.value?.enabled,
			roomDurations: G.value.map((e) => e.duration_seconds),
			loading: j.value,
			pending: I.value,
			saving: re.value,
			saveError: g.value?.error || "",
			isNew: !!P.value?.is_new,
			dirty: !!(P.value && ye.value && JSON.stringify(P.value) !== ye.value),
			ready: !!(P.value && !j.value && !M.value && _e.value === ge.value && ve.value === J.value && `${P.value.game_type}:${P.value.symbol}` === R.value)
		}));
		se(P, () => {
			m.externalSave && !j.value && g.value?.clearFeedback();
		}, {
			deep: !0,
			flush: "sync"
		});
		function Ce(e, t) {
			let n = P.value;
			if (!n || !ye.value || n.based_on_template_version !== e || !Y.value.ready) return;
			let r = JSON.parse(ye.value);
			n.based_on_template_version = r.based_on_template_version = t.template_version, t.rules[0]?.game_type === "GAME_TYPE_" + n.game_type && t.rules[0].symbol === n.symbol && (n.enabled = r.enabled = t.symbol_enabled), ye.value = JSON.stringify(r);
		}
		se(() => [
			J.value,
			Ze(E.perms, "prediction_config:lists"),
			L.value
		], () => {
			ge.value++, be?.abort(), j.value = !1;
		}, { flush: "sync" });
		function Te(e, t) {
			if (!e.rules.length || e.rules.some((e) => e.game_type !== `GAME_TYPE_${z.value}` || e.symbol !== le.value)) throw Error("返回配置与当前币种或玩法不匹配，请重新加载");
			let n = h.value?.duration_seconds;
			P.value = Ne(e), U.value = !1, ye.value = JSON.stringify(P.value), _e.value = t, ve.value = J.value, h.value = G.value.find((e) => e.duration_seconds === n) || G.value[0];
		}
		async function Ee() {
			if (!Ze(E.perms, "prediction_config:lists")) return;
			be?.abort(), be = new AbortController();
			let e = ++ge.value, t = z.value, n = le.value;
			j.value = !0, M.value = "";
			try {
				if (U.value) {
					if (!L.value) throw Error("没有配置新增权限");
					let r = await ee({}, be.signal);
					if (e !== ge.value) return;
					let i = mn(r, t, n);
					return i.existing ? Te(i.existing, e) : (P.value = pn(t, n, i.version), ye.value = JSON.stringify(P.value), _e.value = e, ve.value = J.value, h.value = G.value[0]), e;
				}
				let r = await f({
					game_type: t,
					symbol: n
				}, be.signal);
				if (e === ge.value) return Te(r.configuration, e), e;
			} catch (t) {
				e === ge.value && (M.value = Se(t));
			} finally {
				e === ge.value && (j.value = !1);
			}
		}
		async function De(e, t, n, r = !1) {
			if (z.value = e, le.value = t, R.value = `${e}:${t}`, U.value = r, P.value = void 0, ye.value = "", h.value = void 0, I.value = !1, D.value = !0, n && Ze(E.perms, "prediction_config:lists")) {
				be?.abort();
				let e = ++ge.value;
				j.value = !1, M.value = "";
				try {
					return Te(n, e), e;
				} catch (e) {
					M.value = Se(e);
					return;
				}
			}
			return await Ee();
		}
		function Oe() {
			if (!P.value) throw Error("请先加载配置");
			let e = Fe(C(P.value));
			if (e.length) throw Error(Ie(e, P.value.game_type, h.value?.duration_seconds || P.value.rules[0]?.duration_seconds || ""));
			let { client_request_id: t, reason: n, ...r } = Pe(C(P.value), "", "");
			return m.inline ? {
				...r,
				action: "save_parameters",
				platform_template: { rules: r.platform_template.rules }
			} : r;
		}
		async function ke(e) {
			let t = await p(e), n = t.configuration;
			if (!n?.rules?.length || n.rules.some((t) => t.symbol !== e.symbol || t.game_type !== "GAME_TYPE_" + e.game_type) || !/^[1-9]\d*$/.test(n.template_version)) throw Error("保存回执与当前币种或玩法不符，请核验原操作");
			return {
				...t,
				priorVersion: e.based_on_template_version
			};
		}
		function Ae(e) {
			let { configuration: t, priorVersion: n } = e;
			if (P.value && BigInt(P.value.based_on_template_version) > BigInt(t.template_version)) {
				Ee();
				return;
			}
			Te(t, ge.value), oe("success", t, n);
		}
		async function je() {
			j.value || I.value || re.value || await Ee();
		}
		return ne(() => {
			ge.value++, be?.abort();
		}), n({
			open: De,
			focusSave: x,
			saveConfig: y,
			editingState: Y,
			appliedSwitch: Ce
		}), (n, i) => !t.inline || D.value ? (_(), a(b(t.inline ? "section" : w(N)), {
			key: 0,
			class: te(["mm-ui", { "prediction-edit-inline": t.inline }]),
			modelValue: D.value,
			"onUpdate:modelValue": i[5] ||= (e) => D.value = e,
			"close-on-click-modal": !1,
			"destroy-on-close": "",
			size: "min(1080px,96vw)",
			title: "玩法配置",
			onClosed: i[6] ||= (e) => oe("close")
		}, {
			default: T(() => [
				M.value ? (_(), a(w(O), {
					key: 0,
					title: M.value,
					type: "error",
					closable: !1
				}, null, 8, ["title"])) : o("", !0),
				t.externalSave && Y.value.saveError ? (_(), a(w(O), {
					key: 1,
					title: Y.value.saveError,
					type: I.value ? "warning" : "error",
					closable: !1,
					"show-icon": ""
				}, null, 8, ["title", "type"])) : o("", !0),
				d(gn, {
					loading: j.value,
					"hide-content": j.value && !P.value,
					"min-height": t.inline ? "0px" : "280px",
					class: "prediction-edit"
				}, {
					default: T(() => [c("div", {
						ref_key: "saveArea",
						ref: ie,
						"data-config-save-area": "",
						class: te(["config-save-area", { "config-save-area--external": t.externalSave }])
					}, [D.value && L.value ? (_(), a(dn, {
						key: 0,
						ref_key: "writeRef",
						ref: g,
						"hide-button": t.externalSave,
						"hide-success": t.externalSave,
						"hide-pending-details": t.externalSave,
						"hide-error": t.externalSave,
						action: "config.save",
						target: R.value,
						permission: "prediction_config:edit",
						label: "保存配置",
						"automatic-reason": "通过总后台玩法配置页面保存配置",
						disabled: j.value || !Y.value.ready,
						payload: Oe,
						send: ke,
						onPending: i[0] ||= (e) => I.value = e,
						onBusy: i[1] ||= (e) => re.value = e,
						onSuccess: Ae
					}, null, 8, [
						"hide-button",
						"hide-success",
						"hide-pending-details",
						"hide-error",
						"target",
						"disabled"
					])) : o("", !0)], 2), P.value ? (_(), s(r, { key: 0 }, [
						P.value.is_new ? (_(), a(w(O), {
							key: 0,
							title: "首次配置需填写全部五个周期的必填参数；保存后币种保持关闭。",
							type: "info",
							closable: !1
						})) : o("", !0),
						d(w(A), {
							shadow: "never",
							class: "room-config"
						}, {
							header: T(() => [c("div", Rn, [c("div", null, [c("h3", null, S(P.value.game_type === "UP_DOWN" ? "房间配置" : "周期配置"), 1), c("p", null, S(P.value.symbol) + " · " + S(P.value.game_type === "UP_DOWN" ? "涨跌预测" : "自选预测"), 1)]), t.inline ? o("", !0) : (_(), a(w(de), {
								key: 0,
								modelValue: P.value.enabled,
								"onUpdate:modelValue": i[2] ||= (e) => P.value.enabled = e,
								disabled: !L.value || I.value || P.value.is_new,
								"active-text": "开放",
								"inactive-text": "停用"
							}, null, 8, ["modelValue", "disabled"]))])]),
							default: T(() => [c("div", zn, S(P.value.game_type === "UP_DOWN" ? "支持房间" : "支持周期"), 1), d(Ln, {
								description: `${P.value.symbol} · ${P.value.game_type === "UP_DOWN" ? "涨跌预测" : "自选预测"}`,
								rooms: K.value,
								selected: h.value?.duration_seconds || "",
								disabled: !L.value || !Y.value.ready || I.value || re.value,
								context: `${J.value}:${R.value}:${ge.value}`,
								onSelect: pe,
								onChange: he
							}, null, 8, [
								"description",
								"rooms",
								"selected",
								"disabled",
								"context"
							])]),
							_: 1
						}),
						d(w(A), {
							shadow: "never",
							class: "config-group"
						}, {
							header: T(() => [...i[7] ||= [c("div", { class: "group-heading" }, [c("div", null, [c("h3", null, "价格精度"), c("p", null, "同一币种全部周期共用，变更只影响后续新场次或订单。")])], -1)]]),
							default: T(() => [d(w(ce), { "label-position": "top" }, {
								default: T(() => [c("div", Bn, [d(w(F), { label: "价格小数位" }, {
									default: T(() => [d(En, {
										"input-component": w(e),
										modelValue: H.value,
										"onUpdate:modelValue": i[3] ||= (e) => H.value = e,
										min: "0",
										max: "8",
										step: "1",
										unit: "位",
										inputmode: "numeric",
										placeholder: "请输入 0～8 的整数",
										"aria-label": "价格小数位",
										disabled: !L.value || !Y.value.ready || I.value || re.value
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
						d(w(ce), {
							"label-position": "top",
							disabled: !L.value || I.value
						}, {
							default: T(() => [(_(!0), s(r, null, ae(q.value, (n, l) => (_(), s("section", {
								key: n.market_id || l,
								class: "rule",
								"data-room": n.duration_seconds
							}, [
								t.inline ? o("", !0) : (_(), s("div", Hn, [c("strong", null, S(w(xe)(n.duration_seconds, P.value.game_type)) + S(P.value.game_type === "UP_DOWN" ? "房间" : ""), 1)])),
								P.value.game_type === "UP_DOWN" ? (_(), a(w(A), {
									key: 1,
									shadow: "never",
									class: "config-group round-time-summary"
								}, {
									header: T(() => [c("div", Un, [c("div", null, [c("h3", null, " 场次时间 · " + S(w(xe)(n.duration_seconds, P.value.game_type)) + "房间 ", 1), i[9] ||= c("p", null, "每个场次的下注开放时间固定为 30 秒", -1)]), d(w(V), { size: "small" }, {
										default: T(() => [u(S(w(xe)(n.duration_seconds, P.value.game_type)), 1)]),
										_: 2
									}, 1024)])]),
									_: 2
								}, 1024)) : o("", !0),
								d(w(A), {
									shadow: "never",
									class: "config-group"
								}, {
									header: T(() => [c("div", Wn, [c("div", null, [c("h3", null, " 赔率配置 · " + S(w(xe)(n.duration_seconds, P.value.game_type)), 1), c("p", null, S(P.value.game_type === "UP_DOWN" ? "上涨赔率 = 1 + 目标返奖率 × 下跌池 ÷（上涨池＋本次下注）；下跌赔率反向计算。下注期间为预计倍率，封盘后锁定最终倍率。" : "用户下单时按当前周期固定赔率锁定，订单存储赔率快照"), 1)]), d(w(V), {
										size: "small",
										effect: "plain"
									}, {
										default: T(() => [u(S(P.value.game_type === "UP_DOWN" ? "动态赔率" : "固定赔率"), 1)]),
										_: 1
									})])]),
									default: T(() => [c("div", { class: te(["odds-fields", { "one-field": P.value.game_type === "HIGH_LOW" }]) }, [P.value.game_type === "HIGH_LOW" && n.fixed_odds ? (_(), a(An, {
										key: 0,
										modelValue: n.fixed_odds,
										"onUpdate:modelValue": (e) => n.fixed_odds = e,
										compact: "",
										unit: "x",
										title: "固定赔率",
										description: "上涨和下跌使用相同赔率，且必须小于 2"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])) : o("", !0), P.value.game_type === "UP_DOWN" ? (_(), s(r, { key: 1 }, [n.target_payout_rate ? (_(), a(An, {
										key: 0,
										modelValue: n.target_payout_rate,
										"onUpdate:modelValue": (e) => n.target_payout_rate = e,
										compact: "",
										"agent-locked": "",
										percentage: "",
										title: "目标返奖率",
										description: "例如 90%：按对方资金池的 90% 计算可分配收益，且必须小于 100%"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])) : o("", !0), n.maximum_odds ? (_(), a(An, {
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
								d(w(A), {
									shadow: "never",
									class: "config-group"
								}, {
									header: T(() => [c("div", Gn, [c("div", null, [c("h3", null, " 下注限制 · " + S(w(xe)(n.duration_seconds, P.value.game_type)), 1), c("p", null, S(P.value.symbol) + " 当前" + S(P.value.game_type === "UP_DOWN" ? "房间" : "周期") + "的单笔下注范围 ", 1)]), d(w(V), { size: "small" }, {
										default: T(() => [u(S(w(xe)(n.duration_seconds, P.value.game_type)), 1)]),
										_: 2
									}, 1024)])]),
									default: T(() => [c("div", Kn, [d(w(F), { label: "单笔最小额（USDT）" }, {
										label: T(() => [i[10] ||= u("单笔最小额（USDT）", -1), d(yn, {
											label: "单笔最小额",
											content: "此房间允许的最低单笔下注额。商户可在总后台单笔范围内调整自己的最小额和最大额。"
										})]),
										default: T(() => [d(En, {
											"input-component": w(e),
											"aria-label": "单笔最小额",
											unit: "USDT",
											"model-value": n.minimum_stake.default_value,
											"onUpdate:modelValue": (e) => w(Ge)(n, "minimum_stake", e)
										}, null, 8, [
											"input-component",
											"model-value",
											"onUpdate:modelValue"
										])]),
										_: 2
									}, 1024), d(w(F), { label: "单笔最大额（USDT）" }, {
										label: T(() => [i[11] ||= u("单笔最大额（USDT）", -1), d(yn, {
											label: "单笔最大额",
											content: "此房间允许的最高单笔下注额。修改生效后，对应房间的商户限额重置为总后台范围。"
										})]),
										default: T(() => [d(En, {
											"input-component": w(e),
											"aria-label": "单笔最大额",
											unit: "USDT",
											"model-value": n.maximum_stake.default_value,
											"onUpdate:modelValue": (e) => w(Ge)(n, "maximum_stake", e)
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
				M.value || !t.inline || Y.value.dirty ? (_(), s("div", qn, [
					Y.value.dirty ? (_(), a(w(k), {
						key: 0,
						"data-config-discard": !0,
						disabled: j.value || I.value || re.value,
						onClick: je
					}, {
						default: T(() => [...i[12] ||= [u("放弃修改并重新加载", -1)]]),
						_: 1
					}, 8, ["disabled"])) : o("", !0),
					M.value ? (_(), a(w(k), {
						key: 1,
						disabled: j.value,
						onClick: Ee
					}, {
						default: T(() => [...i[13] ||= [u("重试", -1)]]),
						_: 1
					}, 8, ["disabled"])) : o("", !0),
					t.inline ? o("", !0) : (_(), a(w(k), {
						key: 2,
						onClick: i[4] ||= (e) => D.value = !1
					}, {
						default: T(() => [...i[14] ||= [u("关闭", -1)]]),
						_: 1
					}))
				])) : o("", !0)
			]),
			_: 1
		}, 40, ["class", "modelValue"])) : o("", !0);
	}
}), [["__scopeId", "data-v-07bf6313"]]), Yn = { class: "guide-body" }, Xn = { class: "guide-example" }, Zn = { class: "guide-formulas" }, Qn = { class: "guide-footer" }, $n = /*#__PURE__*/ n(/* @__PURE__ */ f({
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
		let t = oe(e, "modelValue"), n = [
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
		return (e, i) => (_(), a(w(M), {
			modelValue: t.value,
			"onUpdate:modelValue": i[1] ||= (e) => t.value = e,
			title: "预测网格玩法说明",
			width: "860px",
			class: "prediction-grid-guide mm-ui",
			"append-to-body": "",
			"destroy-on-close": ""
		}, {
			header: T(() => [...i[2] ||= [c("h2", { class: "guide-title" }, "预测网格玩法说明", -1), c("p", { class: "guide-subtitle" }, "用一个例子看懂格子、命中概率和赔率", -1)]]),
			footer: T(() => [c("div", Qn, [i[24] ||= c("span", null, "核心规则：有效时间内，连续有效价格进入或穿过对应价格范围一次，即为命中。", -1), d(w(k), {
				type: "primary",
				onClick: i[0] ||= (e) => t.value = !1
			}, {
				default: T(() => [...i[23] ||= [u("我知道了", -1)]]),
				_: 1
			})])]),
			default: T(() => [c("div", Yn, [
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
						c("p", null, [d(w(V), { type: "success" }, {
							default: T(() => [...i[3] ||= [u("命中", -1)]]),
							_: 1
						}), i[4] ||= u(" 10:00:05 价格到达 65,015，进入了格子价格范围。", -1)]),
						c("p", null, [d(w(V), { type: "success" }, {
							default: T(() => [...i[5] ||= [u("命中", -1)]]),
							_: 1
						}), i[6] ||= u(" 连续有效行情从 65,005 到达 65,025，线段中间穿过了这个格子，也算碰到。", -1)]),
						c("p", null, [d(w(V), { type: "danger" }, {
							default: T(() => [...i[7] ||= [u("未命中", -1)]]),
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
					c("article", Zn, [i[13] ||= c("h4", null, [u("原型计算公式示例 "), c("small", null, "时间单位统一为 500ms")], -1), (_(), s(r, null, ae(n, (e) => c("div", { key: e.title }, [
						c("h4", null, S(e.title), 1),
						c("pre", null, S(e.expression), 1),
						c("p", null, S(e.explanation), 1)
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
	let n = e, r = (e) => typeof e == "string" && /^(0|[1-9]\d{0,18})$/.test(e) && Dt(e, "9223372036854775807") <= 0;
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
	} : Bt({
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
		let { gridConfigSymbols: l, gridConfigCatalog: f, gridConfigCreation: ee, gridConfigReceipt: p, gridConfigSite: m, saveGridConfig: h } = fe().grid, g = he(), re = me(), ie = (e) => re.perms.includes("*") || re.perms.includes(e), y = i(() => ie("grid_config:read")), b = i(() => ie("grid_config:save")), x = i(() => {
			let e = String(re.userInfo.id || "");
			return /^[1-9]\d*$/.test(e) ? e : "";
		}), oe = v([]), E = v(""), A = v(""), j = v(""), M = v(null), N = v(null), I = v(""), L = v("通过预测网格配置页面保存配置"), R = v(!1), B = v(!1), V = v(!1), H = v(!1), U = v(!1), W = v(""), G = v(""), K = v("info"), q = v(null), pe = v(!1), _e = v(""), ve = v(!1), ye = new tn(), xe = new tn(), Se = new tn(), J, Y = 0, Ce = i(() => y.value ? x.value ? "" : "无法确认当前操作人身份" : "当前账号没有预测网格配置查询权限"), we = i(() => oe.value.find((e) => e.site_id === E.value)), Te = v([]), Ee = v(""), De = i(() => Ye(we.value?.products ?? [], Te.value)), Oe = i(() => {
			let e = j.value.trim().toUpperCase();
			return De.value.filter((t) => !e || t.symbol.includes(e));
		}), ke = i(() => M.value?.site_version === "0"), Ae = i(() => y.value && b.value && !!x.value && B.value && !Ee.value && !V.value && !q.value && !pe.value && !U.value);
		function je(e) {
			if (!e || !N.value) return !1;
			if (ke.value) return JSON.stringify(e) !== JSON.stringify(N.value) || I.value !== "";
			try {
				return Vt(e, N.value, !0) || kt(e.target_rtp) !== I.value || [
					"enabled",
					"min_multiplier",
					"max_multiplier",
					"min_order_amount",
					"max_order_amount"
				].some((t) => e[t] !== N.value[t]);
			} catch {
				return !0;
			}
		}
		let Me = i(() => je(M.value)), Ne = i(() => je(M.value ? pt(C(M.value), b.value) : null)), Pe = i(() => q.value ? q.value.operator_id === x.value ? "bound" : "foreign" : "none"), Fe = i(() => Pe.value === "bound" ? q.value : null), Ie = i(() => Pe.value === "foreign"), Le = i(() => Ne.value || !!q.value || U.value), Re = i(() => y.value && b.value && (ke.value || !!we.value?.can_edit) && !!x.value && !!M.value && !q.value && !pe.value && !H.value && !U.value), ze = i(() => Re.value && !!M.value?.layout?.editable), Be = i({
			get: () => {
				let e = N.value?.layout?.price_decimals;
				return e != null && (e <= 8 || Number.isNaN(e)) ? e : void 0;
			},
			set: (e) => {
				!ze.value || !N.value?.layout || (N.value.layout.price_decimals = e ?? null, lt());
			}
		}), Ve = v("");
		se(Be, (e) => {
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
		}), Ue = i(() => !!ze.value && !!N.value?.layout && M.value?.layout?.price_band_width !== N.value.layout.price_band_width && Ft(N.value.layout.price_band_width)), We = i(() => Re.value && (ke.value || !!we.value?.can_edit_limits)), Ge = i(() => !!Fe.value && y.value && b.value && (Fe.value.command.based_on_site_version === "0" || oe.value.some((e) => e.site_id === Fe.value.command.site_id && e.can_edit && e.products.some((e) => e.symbol === Fe.value.command.symbol)))), Ke = i(() => Ge.value && B.value && !V.value && !H.value && !U.value && !pe.value && !ve.value && _e.value === JSON.stringify(Fe.value));
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
			let e = [M.value?.effective_from_ms, M.value?.layout?.effective_from_ms].filter((e) => typeof e == "string" && /^[1-9][0-9]*$/.test(e)).reduce((e, t) => BigInt(e) > BigInt(t) ? e : t, "0");
			return e === "0" ? "未提供" : be(e);
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
				let e = $t(sessionStorage, x.value);
				q.value = e.pending ?? null, pe.value = !1;
			} catch {
				pe.value = !0, q.value = null;
			}
		}
		function Qe() {
			return `${x.value}:${E.value}:${A.value}`;
		}
		function $e() {
			xe.close(), M.value = null, N.value = null, I.value = "", L.value = "通过预测网格配置页面保存配置", H.value = !1;
		}
		async function et(e) {
			if (ye.close(), Se.close(), _e.value = "", B.value = !1, $e(), oe.value = [], Te.value = [], Ee.value = "", E.value = "", A.value = "", j.value = "", W.value = "", G.value = "", Ze(), Ce.value || pe.value) return;
			let t = ye.next(x.value);
			V.value = !0;
			try {
				let [n, r] = await Promise.allSettled([f(t.signal), l(t.signal)]);
				if (!t.current(x.value)) return;
				if (r.status === "fulfilled" && Array.isArray(r.value) && r.value.every((e) => typeof e == "string") ? Te.value = r.value : Ee.value = "通用币种目录暂不可用，当前仅显示已授权的网格配置。", n.status === "rejected") throw n.reason;
				oe.value = Xe(n.value), B.value = !0;
				let i = Fe.value ?? (e ? { command: e } : null), a = i && (i.command.based_on_site_version === "0" || oe.value.some((e) => e.site_id === i.command.site_id)) ? i.command.site_id : oe.value[0]?.site_id || "";
				E.value = a;
				let o = oe.value.find((e) => e.site_id === a), s = i && i.command.site_id === a && (i.command.based_on_site_version === "0" || o?.products.some((e) => e.symbol === i.command.symbol)) ? i.command.symbol : De.value.find((e) => e.configured)?.symbol || "";
				A.value = s, s && o?.products.some((e) => e.symbol === s) && (J = at());
			} catch (e) {
				t.current(x.value) && (W.value = qe(e));
			} finally {
				t.current(x.value) && (V.value = !1);
			}
		}
		function tt(e) {
			Le.value || ($e(), E.value = e, A.value = De.value.find((e) => e.configured)?.symbol || "", A.value && (J = at()));
		}
		function nt(e) {
			if (e === A.value && (M.value || H.value) || Le.value) return;
			let t = De.value.find((t) => t.symbol === e);
			!t || !t.configured && !Ae.value || ($e(), W.value = "", A.value = e, J = t.configured ? at() : rt());
		}
		async function rt() {
			if ($e(), !Ae.value || !A.value) return;
			let e = A.value, t = xe.next(Qe());
			H.value = !0;
			try {
				let n = await ee(e, t.signal);
				if (!t.current(Qe()) || !b.value) return;
				let r = er(n, e);
				M.value = r, N.value = pt(r, b.value), H.value = !1, E.value = r.site_id;
			} catch (e) {
				t.current(Qe()) && (W.value = qe(e));
			} finally {
				t.current(Qe()) && (H.value = !1);
			}
		}
		function it() {
			!ke.value || q.value || U.value || ($e(), A.value = "", G.value = "");
		}
		async function at() {
			if ($e(), !y.value || !E.value || !A.value) return;
			let e = E.value, t = A.value, n = Qe(), r = xe.next(n);
			H.value = !0;
			try {
				let n = await m(e, t, r.signal);
				if (!r.current(Qe())) return;
				let i = Ut(n, e, t);
				M.value = i, N.value = pt(i, b.value), I.value = kt(i.target_rtp);
			} catch (e) {
				r.current(Qe()) && (W.value = qe(e));
			} finally {
				r.current(Qe()) && (H.value = !1);
			}
		}
		function ot(e) {
			return e.symbol === A.value && N.value ? N.value.enabled : e.enabled;
		}
		function st(e) {
			return !we.value?.products.some((t) => t.symbol === e.symbol) || !b.value || !we.value?.can_edit || H.value || U.value || !!q.value || pe.value || Ne.value && e.symbol !== A.value;
		}
		async function ct(e, t) {
			typeof t != "boolean" || st(e) || (e.symbol !== A.value && (nt(e.symbol), await J), N.value && N.value.symbol === e.symbol && !st(e) && (N.value.enabled = t, lt()));
		}
		function lt() {
			G.value = "";
		}
		async function ut() {
			if (!Re.value || !M.value || !N.value || !x.value) return;
			let e;
			try {
				e = Wt(M.value, {
					...N.value,
					target_rtp: At(I.value)
				}, L.value, jt(), ke.value || !!we.value?.can_edit_limits, !0);
			} catch (e) {
				K.value = "warning", G.value = qe(e);
				return;
			}
			let t = Zt(x.value, e), n = gt(), r = "price_band_width" in e.changes || "column_duration_seconds" in e.changes || "price_decimals" in e.changes, i = ke.value ? " 首次创建后保持关闭。" : r ? ` 公共网格区间修改将影响站点：${M.value.layout.affected_site_ids.join("、")}。` : "";
			try {
				await z.confirm(`确认保存 ${e.site_id} / ${e.symbol} 的 ${Object.keys(e.changes).length} 项修改？${i}`, "确认预测网格配置", {
					type: "warning",
					confirmButtonText: "确认保存",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			}
			if (Ze(), !Re.value || !M.value || !N.value || n !== gt()) {
				K.value = "warning", G.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let a;
			try {
				a = Wt(M.value, {
					...N.value,
					target_rtp: At(I.value)
				}, L.value, t.command.client_request_id, ke.value || !!we.value?.can_edit_limits, !0);
			} catch {
				K.value = "warning", G.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let o;
			try {
				o = Qt(sessionStorage, t, x.value, a), Ze();
			} catch (e) {
				if (e?.message === "STALE_CONFIRMATION") {
					K.value = "warning", G.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
					return;
				}
				pe.value = !0;
				return;
			}
			mt(o, "save");
		}
		async function dt() {
			Ze(), !(!Fe.value || !Ge.value || U.value || ve.value) && mt(Fe.value, "receipt");
		}
		async function ft() {
			if (Ze(), !Ke.value || !Fe.value) return;
			let e = Fe.value;
			ve.value = !0;
			try {
				await z.confirm(`确认恢复 ${e.command.site_id} / ${e.command.symbol} 的原请求 ${e.command.client_request_id}？将沿用原编号和原参数；已提交则返回原回执，尚未提交则保存原配置，不使用当前页面的新修改。`, "恢复原配置请求", {
					type: "warning",
					confirmButtonText: "确认恢复",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			} finally {
				ve.value = !1;
			}
			if (Ze(), !Ke.value || JSON.stringify(e) !== JSON.stringify(Fe.value)) {
				K.value = "warning", G.value = "确认期间账号、权限或原请求已变化，本次恢复已取消，请重新查询原操作回执";
				return;
			}
			await mt(e, "recover");
		}
		async function mt(e, t) {
			let n = ++Y, r = Qe(), i = Se.next(r);
			U.value = !0, _e.value = "", G.value = "";
			try {
				let n = await en(sessionStorage, e, t, (e, t) => e === "save" ? h(t) : p(t));
				if (!i.current(Qe())) return;
				if (Ze(), n.status === "success") {
					let e = x.value;
					L.value = "通过预测网格配置页面保存配置", U.value = !1, await et(), e === x.value && (K.value = "warning", G.value = W.value ? "配置已保存；最新配置刷新失败，请手动刷新" : "");
				} else if (t === "recover" && n.status === "rejected" && n.error?.error_code === "VERSION_CONFLICT") if (!n.journalCleared || q.value || pe.value) K.value = "warning", G.value = "旧请求已明确拒绝，但本机待确认记录已变化，请重新核对当前记录";
				else {
					let t = x.value;
					if (await et(e.command), E.value && A.value && J && await J, t === x.value) {
						K.value = "warning";
						let t = E.value === e.command.site_id && A.value === e.command.symbol && oe.value.some((t) => t.site_id === e.command.site_id && t.products.some((t) => t.symbol === e.command.symbol));
						G.value = "旧请求未生效，配置版本已变化；已清除旧待确认记录。" + (t ? W.value || !M.value ? "最新配置刷新失败，请手动刷新" : "请以当前配置为准" : `原目标当前不可见（${e.command.site_id} / ${e.command.symbol}），请核对权限和配置`);
					}
				}
				else K.value = n.status === "unknown" ? "warning" : "info", t === "receipt" && Jt(n.error) && JSON.stringify(Fe.value) === JSON.stringify(e) ? (_e.value = JSON.stringify(e), G.value = "未找到原操作回执，可使用原编号和原参数恢复请求") : t === "recover" ? G.value = "恢复尚未确认，原请求已保留，请重新查询原操作回执 · " + qe(n.error) : G.value = n.status === "unknown" ? "原操作结果仍待确认，请使用原请求查询回执" : "保存已明确拒绝，可修正后重新提交 · " + qe(n.error);
			} catch (e) {
				i.current(Qe()) && (Ze(), K.value = "warning", G.value = "原操作结果仍待确认 · " + qe(e));
			} finally {
				n === Y && (U.value = !1, Ze());
			}
		}
		async function ht() {
			if (!Le.value) return !0;
			try {
				return await z.confirm("当前有未保存修改或待确认操作，离开不会删除原记录。仍要离开吗？", "离开预测网格配置", { type: "warning" }), !0;
			} catch {
				return !1;
			}
		}
		function gt() {
			return JSON.stringify({
				operator: x.value,
				site: E.value,
				symbol: A.value,
				snapshot: M.value,
				draft: N.value,
				rtp: I.value,
				reason: L.value
			});
		}
		async function _t() {
			if (!U.value) {
				if (Ne.value) {
					let e = gt();
					try {
						await z.confirm("刷新会丢弃当前未保存修改，仍要刷新吗？", "刷新预测网格配置", { type: "warning" });
					} catch {
						return;
					}
					if (U.value || e !== gt()) {
						K.value = "warning", G.value = "确认期间编辑状态已变化，本次刷新已取消";
						return;
					}
				}
				await et();
			}
		}
		function vt(e) {
			Le.value && (e.preventDefault(), e.returnValue = "");
		}
		return se(() => [
			x.value,
			y.value,
			b.value
		], () => et(), { immediate: !0 }), ge(ht), window.addEventListener("beforeunload", vt), ne(() => {
			_e.value = "", B.value = !1, ye.close(), xe.close(), Se.close(), window.removeEventListener("beforeunload", vt);
		}), n({
			hasBlockingWork: Le,
			confirmLeave: ht,
			refresh: _t,
			loading: V
		}), (t, n) => (_(), s("section", tr, [
			Ce.value ? (_(), a(w(O), {
				key: 0,
				title: Ce.value,
				type: "warning",
				closable: !1
			}, null, 8, ["title"])) : pe.value ? (_(), a(w(O), {
				key: 1,
				title: "本机保存的待确认操作记录已损坏或不可用，请停止操作并联系管理员核验",
				type: "error",
				closable: !1
			})) : Ie.value ? (_(), a(w(O), {
				key: 2,
				title: "检测到其他账号尚未确认的预测网格配置操作，当前账号不可覆盖，请切回原账号查询回执",
				type: "error",
				closable: !1
			})) : o("", !0),
			W.value ? (_(), s("div", nr, [d(w(O), {
				title: W.value,
				type: "error",
				closable: !1
			}, null, 8, ["title"]), d(w(k), {
				loading: V.value || H.value,
				disabled: U.value || !!q.value,
				onClick: _t
			}, {
				default: T(() => [...n[16] ||= [u("重试", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"])])) : o("", !0),
			G.value ? (_(), a(w(O), {
				key: 4,
				title: G.value,
				type: K.value,
				closable: !1
			}, null, 8, ["title", "type"])) : o("", !0),
			Fe.value ? (_(), s("div", rr, [c("div", null, [n[17] ||= c("strong", null, "原配置操作结果待确认", -1), c("small", null, S(Fe.value.command.site_id) + " · " + S(Fe.value.command.symbol) + " · " + S(Fe.value.command.client_request_id), 1)]), c("div", ir, [d(w(k), {
				type: "warning",
				loading: U.value,
				disabled: !Ge.value || ve.value,
				onClick: dt
			}, {
				default: T(() => [...n[18] ||= [u("查询原操作回执", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"]), Ke.value || ve.value ? (_(), a(w(k), {
				key: 0,
				type: "warning",
				disabled: !Ke.value,
				onClick: ft
			}, {
				default: T(() => [...n[19] ||= [u("恢复原请求", -1)]]),
				_: 1
			}, 8, ["disabled"])) : o("", !0)])])) : o("", !0),
			d(gn, {
				loading: V.value,
				"hide-content": V.value,
				"min-height": "0px",
				class: "grid-loading-workspace"
			}, {
				default: T(() => [c("div", ar, [c("aside", or, [
					c("div", sr, [n[20] ||= c("strong", null, "币种配置", -1), c("span", null, S(Oe.value.length) + " 条", 1)]),
					oe.value.length > 1 ? (_(), a(w(ue), {
						key: 0,
						modelValue: E.value,
						"onUpdate:modelValue": n[0] ||= (e) => E.value = e,
						"aria-label": "选择站点",
						disabled: Le.value,
						onChange: tt
					}, {
						default: T(() => [(_(!0), s(r, null, ae(oe.value, (e) => (_(), a(w(le), {
							key: e.site_id,
							label: e.site_id,
							value: e.site_id
						}, null, 8, ["label", "value"]))), 128))]),
						_: 1
					}, 8, ["modelValue", "disabled"])) : o("", !0),
					Ee.value ? (_(), s("p", cr, [u(S(Ee.value), 1), d(w(k), {
						link: "",
						type: "primary",
						disabled: Le.value,
						onClick: _t
					}, {
						default: T(() => [...n[21] ||= [u("重试", -1)]]),
						_: 1
					}, 8, ["disabled"])])) : o("", !0),
					d(w(e), {
						modelValue: j.value,
						"onUpdate:modelValue": n[1] ||= (e) => j.value = e,
						clearable: "",
						placeholder: "搜索交易对",
						"aria-label": "搜索交易对"
					}, null, 8, ["modelValue"]),
					c("div", lr, [(_(!0), s(r, null, ae(Oe.value, (e) => (_(), s("div", {
						key: e.symbol,
						class: te(["symbol-row", { active: e.symbol === A.value }])
					}, [
						c("button", {
							type: "button",
							class: "symbol-button",
							disabled: !e.configured && !Ae.value || Le.value && e.symbol !== A.value,
							onClick: (t) => nt(e.symbol)
						}, [d(w(g), { symbol: e.symbol }, null, 8, ["symbol"])], 8, ur),
						e.configured ? (_(), a(w(de), {
							key: 1,
							"model-value": ot(e),
							disabled: st(e),
							"aria-label": `${e.symbol} 开放配置`,
							onChange: (t) => ct(e, t)
						}, null, 8, [
							"model-value",
							"disabled",
							"aria-label",
							"onChange"
						])) : (_(), s("span", dr, "未配置")),
						e.symbol === A.value && Me.value ? (_(), s("small", fr, "未保存")) : o("", !0)
					], 2))), 128)), !V.value && we.value && !Oe.value.length ? (_(), a(w(P), {
						key: 0,
						description: "当前站点没有已授权的预测网格产品",
						"image-size": 56
					})) : o("", !0)])
				]), c("main", pr, [M.value && N.value ? (_(), s("header", mr, [c("div", null, [
					c("h2", null, S(M.value.symbol) + " · 预测网格", 1),
					c("p", hr, "更新时间 " + S(Je.value), 1),
					ke.value || oe.value.length > 1 ? (_(), s("p", gr, "当前站点：" + S(M.value.site_id), 1)) : o("", !0)
				]), c("div", _r, [
					ke.value ? (_(), a(w(k), {
						key: 0,
						disabled: !!q.value || U.value,
						onClick: it
					}, {
						default: T(() => [...n[22] ||= [u("取消新增", -1)]]),
						_: 1
					}, 8, ["disabled"])) : o("", !0),
					d(w(k), { onClick: n[2] ||= (e) => R.value = !0 }, {
						default: T(() => [...n[23] ||= [u("玩法说明", -1)]]),
						_: 1
					}),
					b.value ? (_(), a(w(k), {
						key: 1,
						type: "primary",
						loading: U.value,
						disabled: !Re.value || !Me.value || Ue.value,
						onClick: ut
					}, {
						default: T(() => [...n[24] ||= [u("保存配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])) : o("", !0)
				])])) : o("", !0), d(gn, {
					loading: H.value && !V.value,
					"hide-content": H.value && !M.value,
					"min-height": "0px",
					class: "grid-config__detail"
				}, {
					default: T(() => [!V.value && !H.value && !M.value && !A.value && !W.value ? (_(), a(w(P), {
						key: 0,
						description: Ae.value ? "请选择币种填写配置，首次保存后保持关闭" : "当前账号暂无已配置的产品"
					}, null, 8, ["description"])) : !V.value && !H.value && !W.value && we.value && !A.value ? (_(), a(w(P), {
						key: 1,
						description: "请选择交易对查看配置"
					})) : M.value && N.value ? (_(), s(r, { key: 2 }, [ke.value ? (_(), a(w(O), {
						key: 0,
						title: "请填写参数后保存，首次保存后保持关闭；确认配置后再单独开启。",
						type: "info",
						closable: !1
					})) : o("", !0), c("div", vr, [
						c("article", yr, [n[29] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "网格区间配置"), c("p", { class: "parameter-description" }, "网格区间由平台按币种统一设置，修改后自动用于该币种下的商户交易。")], -1), N.value.layout ? (_(), s(r, { key: 0 }, [d(w(ce), {
							"label-position": "top",
							class: "fields limit-fields",
							onSubmit: n[5] ||= D(() => {}, ["prevent"])
						}, {
							default: T(() => [d(w(F), { label: "纵向格子区间（USDT）" }, {
								label: T(() => [n[25] ||= u("纵向格子区间（USDT）", -1), d(yn, {
									label: "纵向格子区间",
									content: "每个格子覆盖的价格区间宽度，最多保留 8 位小数。数值越大，每格覆盖的价格范围越宽；保存时会根据最新标记价检查安全范围。"
								})]),
								default: T(() => [d(En, {
									"input-component": w(e),
									modelValue: N.value.layout.price_band_width,
									"onUpdate:modelValue": n[3] ||= (e) => N.value.layout.price_band_width = e,
									disabled: !ze.value,
									inputmode: "decimal",
									"aria-label": "纵向格子区间",
									onInput: lt
								}, {
									append: T(() => [...n[26] ||= [u("USDT", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								]), Ue.value ? (_(), s("small", br, "精度不规范，最多保留 8 位小数")) : o("", !0)]),
								_: 1
							}), d(w(F), { label: "横向格子区间（秒）" }, {
								label: T(() => [n[27] ||= u("横向格子区间（秒）", -1), d(yn, {
									label: "横向格子区间",
									content: "每列格子覆盖的时间长度，可填 1 至 10 秒整数；全部列连同起始等待时间不能超过 120 秒。"
								})]),
								default: T(() => [d(En, {
									"input-component": w(e),
									modelValue: N.value.layout.column_duration_seconds,
									"onUpdate:modelValue": n[4] ||= (e) => N.value.layout.column_duration_seconds = e,
									disabled: !ze.value,
									inputmode: "numeric",
									min: "1",
									max: "10",
									step: "1",
									"aria-label": "横向格子区间",
									onInput: lt
								}, {
									append: T(() => [...n[28] ||= [u("秒", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								])]),
								_: 1
							})]),
							_: 1
						}), M.value.layout?.editable ? o("", !0) : (_(), s("p", xr, S(ke.value ? "该币种已有公共网格区间，首次创建将直接沿用。" : "当前账号无法修改该币种全部受影响站点的公共网格区间，仅可查看。"), 1))], 64)) : (_(), a(w(O), {
							key: 1,
							title: "当前接口未返回网格区间，请刷新后重试；暂不支持编辑网格区间。",
							type: "info",
							closable: !1
						}))]),
						N.value.layout ? (_(), s("article", Sr, [
							n[30] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "价格精度"), c("p", { class: "parameter-description" }, "由平台按币种统一设置，保存后用于后续新订单。")], -1),
							d(w(ce), {
								"label-position": "top",
								class: "fields odds-fields",
								onSubmit: n[7] ||= D(() => {}, ["prevent"])
							}, {
								default: T(() => [d(w(F), { label: "价格小数位" }, {
									default: T(() => [d(En, {
										"input-component": w(e),
										modelValue: He.value,
										"onUpdate:modelValue": n[6] ||= (e) => He.value = e,
										min: "0",
										max: "8",
										step: "1",
										unit: "位",
										inputmode: "numeric",
										"aria-label": "价格小数位",
										disabled: !ze.value,
										placeholder: (M.value.layout?.price_decimals ?? 0) > 8 ? `当前 ${M.value.layout.price_decimals} 位` : "请输入 0～8 的整数"
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
						c("article", Cr, [n[41] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "赔率配置"), c("p", { class: "parameter-description" }, "命中概率由标记价、实时波动率及格子的价格和时间边界计算；格子赔率 = 目标返奖率 ÷ 命中概率")], -1), d(w(ce), {
							"label-position": "top",
							class: "fields odds-fields",
							onSubmit: n[11] ||= D(() => {}, ["prevent"])
						}, {
							default: T(() => [
								d(w(F), { label: "目标返奖率" }, {
									label: T(() => [n[32] ||= u("目标返奖率", -1), d(yn, {
										label: "目标返奖率",
										content: "例如 97%：命中概率为 20% 时，计算赔率为 4.85x。"
									})]),
									default: T(() => [d(En, {
										"input-component": w(e),
										modelValue: I.value,
										"onUpdate:modelValue": n[8] ||= (e) => I.value = e,
										disabled: !Re.value,
										inputmode: "decimal",
										"aria-label": "目标返奖率",
										onInput: lt
									}, {
										append: T(() => [...n[33] ||= [u("%", -1)]]),
										_: 1
									}, 8, [
										"input-component",
										"modelValue",
										"disabled"
									]), n[34] ||= c("small", null, "例如 97%：命中概率为 20% 时，计算赔率为 4.85x", -1)]),
									_: 1
								}),
								d(w(F), { label: "最低赔率" }, {
									label: T(() => [n[35] ||= u("最低赔率", -1), d(yn, {
										label: "最低赔率",
										content: "当前币种报价允许的最低倍率。"
									})]),
									default: T(() => [d(En, {
										"input-component": w(e),
										modelValue: N.value.min_multiplier,
										"onUpdate:modelValue": n[9] ||= (e) => N.value.min_multiplier = e,
										step: "0.01",
										disabled: !We.value,
										inputmode: "decimal",
										"aria-label": "最低赔率",
										onInput: lt
									}, {
										append: T(() => [...n[36] ||= [u("x", -1)]]),
										_: 1
									}, 8, [
										"input-component",
										"modelValue",
										"disabled"
									]), n[37] ||= c("small", null, "计算赔率不会低于此值", -1)]),
									_: 1
								}),
								d(w(F), { label: "最高赔率" }, {
									label: T(() => [n[38] ||= u("最高赔率", -1), d(yn, {
										label: "最高赔率",
										content: "当前币种报价允许的最高倍率。原型中超过此值的格子不可下注，不强制压低赔率；实际是否可下注以当前格子报价为准。"
									})]),
									default: T(() => [d(En, {
										"input-component": w(e),
										modelValue: N.value.max_multiplier,
										"onUpdate:modelValue": n[10] ||= (e) => N.value.max_multiplier = e,
										step: "0.01",
										disabled: !We.value,
										inputmode: "decimal",
										"aria-label": "最高赔率",
										onInput: lt
									}, {
										append: T(() => [...n[39] ||= [u("x", -1)]]),
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
						c("article", wr, [c("header", Tr, [n[42] ||= c("h3", null, "下注限制", -1), c("p", Er, S(M.value.symbol) + " 每个格子生成一笔独立订单，限制作用于该币种全部网格订单", 1)]), d(w(ce), {
							"label-position": "top",
							class: "fields limit-fields",
							onSubmit: n[14] ||= D(() => {}, ["prevent"])
						}, {
							default: T(() => [d(w(F), { label: "单笔最小额（USDT）" }, {
								label: T(() => [n[43] ||= u("单笔最小额（USDT）", -1), d(yn, { label: "单笔最小额" })]),
								default: T(() => [d(En, {
									"input-component": w(e),
									modelValue: N.value.min_order_amount,
									"onUpdate:modelValue": n[12] ||= (e) => N.value.min_order_amount = e,
									disabled: !Re.value,
									inputmode: "decimal",
									"aria-label": "单笔最小额",
									onInput: lt
								}, {
									append: T(() => [...n[44] ||= [u("USDT", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								])]),
								_: 1
							}), d(w(F), { label: "单笔最大额（USDT）" }, {
								label: T(() => [n[45] ||= u("单笔最大额（USDT）", -1), d(yn, { label: "单笔最大额" })]),
								default: T(() => [d(En, {
									"input-component": w(e),
									modelValue: N.value.max_order_amount,
									"onUpdate:modelValue": n[13] ||= (e) => N.value.max_order_amount = e,
									disabled: !Re.value,
									inputmode: "decimal",
									"aria-label": "单笔最大额",
									onInput: lt
								}, {
									append: T(() => [...n[46] ||= [u("USDT", -1)]]),
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
						b.value ? o("", !0) : (_(), a(w(O), {
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
				modelValue: R.value,
				"onUpdate:modelValue": n[15] ||= (e) => R.value = e
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
	for (let [n] of Or) t[n] = Tt(e[n], n.includes("multiplier") ? 2 : n.includes("amount") ? 8 : void 0);
	jr(Dt(t.target_rtp, "0") > 0 && Dt(t.target_rtp, "1") < 0), jr(Dt(t.min_multiplier, "1") >= 0 && Dt(t.max_multiplier, t.min_multiplier) >= 0), jr(Dt(t.min_order_amount, "0") > 0 && Dt(t.max_order_amount, t.min_order_amount) >= 0);
	let n = (e, t) => {
		let [n, r = ""] = e.split(".");
		return BigInt(n + r.padEnd(t, "0"));
	};
	return jr(n(t.max_order_amount, 8) * n(t.max_multiplier, 2) <= 9223372036854775807n * 100n), t;
}
function Fr(e, t) {
	jr(Ar(e));
	let n = "availability_version" in e || "enabled" in e;
	Mr(e, [
		"scope",
		"symbol",
		"global_version",
		"effective_from_ms",
		"parameters",
		"layout",
		...n ? ["availability_version", "enabled"] : []
	]), n && jr(typeof e.enabled == "boolean" && Nr(e.availability_version));
	let r = n ? {
		enabled: e.enabled,
		availability_version: e.availability_version
	} : {};
	jr(e.scope === "GLOBAL" && e.symbol === t && kr.test(t) && Nr(e.global_version));
	let i = null;
	if (e.layout !== null) {
		let t = e.layout;
		Mr(t, [
			"version",
			"row_count",
			"column_count",
			"column_duration_seconds",
			"price_band_width",
			"price_decimals"
		]), jr(Nr(t.version) && t.version !== "0" && typeof t.row_count == "string" && typeof t.column_count == "string" && typeof t.column_duration_seconds == "string"), jr(t.price_decimals === null || typeof t.price_decimals == "number" && Number.isInteger(t.price_decimals) && t.price_decimals >= 0 && t.price_decimals <= 18), i = {
			version: t.version,
			row_count: t.row_count,
			column_count: t.column_count,
			column_duration_seconds: t.column_duration_seconds,
			price_band_width: Tt(t.price_band_width),
			price_decimals: t.price_decimals
		};
	}
	return e.global_version === "0" ? (jr(e.parameters === null && e.effective_from_ms === null), {
		...r,
		scope: "GLOBAL",
		symbol: t,
		global_version: "0",
		effective_from_ms: null,
		parameters: null,
		layout: i
	}) : (jr(Nr(e.effective_from_ms) && e.effective_from_ms !== "0" && i !== null), {
		...r,
		scope: "GLOBAL",
		symbol: t,
		global_version: e.global_version,
		effective_from_ms: e.effective_from_ms,
		parameters: Pr(e.parameters),
		layout: i
	});
}
function Ir(e) {
	if (jr(Ar(e) && typeof e.symbol == "string" && kr.test(e.symbol)), jr(typeof e.client_request_id == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(e.client_request_id)), jr(typeof e.reason == "string" && e.reason.trim() && !e.reason.includes("\0") && new TextEncoder().encode(e.reason).length <= 500), e.action === "set_enabled") {
		Mr(e, [
			"action",
			"symbol",
			"based_on_availability_version",
			"client_request_id",
			"reason",
			"enabled"
		]), jr(typeof e.enabled == "boolean" && Nr(e.based_on_availability_version));
		return;
	}
	jr(e.action === void 0 || e.action === "save_parameters");
	let t = [
		"symbol",
		"based_on_global_version",
		"client_request_id",
		"reason",
		"changes",
		..."action" in e ? ["action"] : []
	];
	if (Ar(e) && "layout" in e) {
		t.push("layout", "based_on_layout_version"), jr(Nr(e.based_on_layout_version) && Ar(e.layout));
		let n = Object.keys(e.layout);
		jr(n.length > 0 && n.every((e) => [
			"price_band_width",
			"column_duration_seconds",
			"price_decimals"
		].includes(e))), e.based_on_layout_version === "0" && jr(n.length === 3), "price_decimals" in e.layout && jr(typeof e.layout.price_decimals == "number" && Number.isInteger(e.layout.price_decimals) && e.layout.price_decimals >= 0 && e.layout.price_decimals <= 8), "column_duration_seconds" in e.layout && jr(typeof e.layout.column_duration_seconds == "string" && /^(?:[1-9]|10)$/.test(e.layout.column_duration_seconds)), "price_band_width" in e.layout && jr(Dt(Tt(e.layout.price_band_width, 8), "0") > 0);
	}
	Mr(e, t), jr(Nr(e.based_on_global_version)), Pr(e.changes);
}
function Lr(e, t, n, r) {
	let i = Fr(e, e.symbol), a = Pr(t), o = {
		action: "save_parameters",
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
	if (!Ar(e) || e.scope !== "GLOBAL" || e.symbol !== t.command.symbol || e.operation_status !== "SUCCEEDED" || !Nr(e.operation_id) || e.operation_id === "0" || typeof e.changed != "boolean" || !Nr(e.global_version)) return !1;
	if (t.command.action === "set_enabled") return e.enabled !== t.command.enabled || !Nr(e.availability_version) || !(Nr(e.effective_from_ms) || !e.changed && e.effective_from_ms === null) ? !1 : BigInt(e.availability_version) - BigInt(t.command.based_on_availability_version) === (e.changed ? 1n : 0n) && [
		"PENDING",
		"DONE",
		"NOT_REQUIRED"
	].includes(String(e.cache_state));
	if (!Nr(e.effective_from_ms)) return !1;
	let n = BigInt(e.global_version) - BigInt(t.command.based_on_global_version);
	if (n < 0n || n > 1n) return !1;
	let r = 0n;
	return t.command.layout && (!Nr(e.layout_version) || (r = BigInt(e.layout_version) - BigInt(t.command.based_on_layout_version), r < 0n || r > 1n)) ? !1 : e.changed === n + r > 0n && (e.changed ? [
		"PENDING",
		"DONE",
		"NOT_REQUIRED"
	].includes(String(e.cache_state)) : e.cache_state === "NOT_REQUIRED");
}
var zr = it("grid.config.global.pending.v1", Ir, Rr), Br = {
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
		let l = fe().grid, f = l.globalTemplate, ee = q(), p = he(), m = [{
			title: "赔率配置",
			fields: Or.slice(0, 3)
		}, {
			title: "下注限制",
			fields: Or.slice(3)
		}], h = (e) => ee.context.permissions.includes("*") || ee.context.permissions.includes(e), g = i(() => ee.context.operatorId), re = i(() => !!ee.context.identityKey && /^[1-9]\d*$/.test(g.value) && h("grid_config:read")), ie = i(() => re.value && h("grid_config:save")), y = v([]), b = v(""), C = v(""), oe = i(() => y.value.filter((e) => e.symbol.includes(C.value.trim().toUpperCase()))), E = x(null), A = {
			target_rtp: "0.97",
			min_multiplier: "1.02",
			max_multiplier: "20",
			min_order_amount: "1",
			max_order_amount: "3000"
		}, j = v({ ...A }), M = v({
			price_band_width: "",
			column_duration_seconds: "",
			price_decimals: "3"
		}), N = v(!1), I = v(!1), L = v(!1), R = v(""), le = v(!1), B = v(!1), ue = x(null), V = (e) => ({
			price_band_width: e.layout?.price_band_width ?? "",
			column_duration_seconds: e.layout?.column_duration_seconds ?? "",
			price_decimals: String(e.layout?.price_decimals ?? 3)
		}), H = i(() => !!E.value && (JSON.stringify(M.value) !== JSON.stringify(V(E.value)) || Or.some(([e]) => j.value[e] !== (E.value?.parameters ?? A)[e]))), U = i(() => !ie.value || I.value || !!ue.value || B.value), W = 0, G;
		function K() {
			try {
				let e = zr.pendingForActor(sessionStorage, g.value);
				ue.value = e.pending ?? null, B.value = e.status === "foreign", B.value && (R.value = "请切回原账号核对尚未确认的模板操作。");
			} catch {
				ue.value = null, B.value = !0, R.value = "无法读取待确认操作，请先核对原请求。";
			}
		}
		function pe() {
			return W++, G?.abort(), G = new AbortController(), W;
		}
		async function me(e) {
			let t = pe();
			I.value = !0, L.value = !1, R.value = "", b.value = e, E.value = null;
			try {
				let n = Fr(await f.detail(e, G.signal), e);
				if (t !== W) return;
				E.value = n, j.value = { ...n.parameters ?? A }, M.value = V(n);
				let r = y.value.find((t) => t.symbol === e);
				r && Object.assign(r, {
					configured: n.parameters !== null,
					enabled: n.enabled,
					availability_version: n.availability_version
				});
			} catch {
				t === W && (L.value = !0, R.value = "读取平台模板失败，请重试。");
			} finally {
				t === W && (I.value = !1);
			}
		}
		async function _e() {
			if (!re.value || H.value || I.value || (K(), ue.value || B.value)) return;
			let e = pe();
			I.value = !0, R.value = "", L.value = !1;
			try {
				let [t, n] = await Promise.all([f.catalog(G.signal), l.gridConfigSymbols(G.signal)]);
				if (e !== W) return;
				let r = new Map(t.products.map((e) => [e.symbol, e]));
				y.value = [.../* @__PURE__ */ new Set([...n, ...r.keys()])].filter((e) => /^[A-Z0-9]{2,32}$/.test(e)).map((e) => r.get(e) ?? {
					symbol: e,
					configured: !1
				});
				let i = y.value.find((e) => e.symbol === b.value) ?? y.value[0];
				i && await me(i.symbol);
			} catch {
				e === W && (L.value = !0, R.value = "读取平台币种目录失败，请重试。");
			} finally {
				e === W && (I.value = !1);
			}
		}
		async function ve() {
			if (I.value || ue.value) return !1;
			if (!H.value) return !0;
			try {
				return await z.confirm("放弃未保存的配置？", "离开配置"), !0;
			} catch {
				return !1;
			}
		}
		async function ye(e) {
			e !== b.value && await ve() && await me(e);
		}
		function be() {
			let e = E.value, t = V(e), n = {};
			for (let r of ["price_band_width", "column_duration_seconds"]) {
				if (!M.value[r].trim()) throw Error(r === "price_band_width" ? "请填写纵向格子区间" : "请填写横向格子区间");
				(!e.layout || t[r] !== M.value[r]) && (n[r] = M.value[r]);
			}
			if (!e.layout || t.price_decimals !== M.value.price_decimals) {
				if (!/^[0-8]$/.test(M.value.price_decimals)) throw Error("价格小数位须为 0～8 的整数");
				n.price_decimals = Number(M.value.price_decimals);
			}
			return Object.keys(n).length ? n : void 0;
		}
		async function xe() {
			if (!(U.value || !E.value)) {
				try {
					for (let [e, t] of Or) if (!j.value[e].trim()) throw Error("请填写" + t);
					Se(Lr(E.value, j.value, jt(), be()));
				} catch (e) {
					R.value = e instanceof Error ? e.message : "请核对模板参数";
					return;
				}
				await Y("save");
			}
		}
		function Se(e) {
			let t = zr.captureSaveReview(g.value, e);
			ue.value = zr.persistReviewedCommand(sessionStorage, t, g.value, e);
		}
		async function J(e, t) {
			if (!(U.value || typeof t != "boolean" || !e.availability_version || !e.configured && t)) {
				try {
					Se({
						action: "set_enabled",
						symbol: e.symbol,
						based_on_availability_version: e.availability_version,
						client_request_id: jt(),
						reason: "通过总后台设置网格币种开关",
						enabled: t
					});
				} catch (e) {
					R.value = e instanceof Error ? e.message : "无法保全开关操作";
					return;
				}
				await Y("save");
			}
		}
		async function Y(e) {
			if (K(), I.value || !ue.value || B.value || !ie.value) return;
			let t = ue.value, n = W;
			I.value = !0, le.value = !1;
			try {
				let r = await zr.attemptPending(sessionStorage, t, e, (e, t) => e === "save" ? f.save(t) : f.receipt(t));
				if (n !== W) return;
				if (K(), t.command.action === "set_enabled" && r.status === "success" && y.value.length) {
					let e = y.value.find((e) => e.symbol === t.command.symbol), n = {
						enabled: r.value.enabled,
						availability_version: r.value.availability_version
					};
					e && Object.assign(e, n), E.value?.symbol === t.command.symbol && (E.value = {
						...E.value,
						...n
					}), R.value = "";
				} else r.status === "rejected" && r.journalCleared && y.value.length && t.command.action === "set_enabled" ? R.value = r.error instanceof Error ? r.error.message : "开关未生效，请重新读取币种配置。" : r.status === "success" || r.status === "rejected" && r.journalCleared ? (I.value = !1, E.value = null, b.value = t.command.symbol, await _e(), r.status === "rejected" && (R.value = "保存未生效，请核对最新配置后再提交。")) : (le.value = e === "receipt" && Jt(r.error), R.value = r.error instanceof Error ? "保存结果待确认：" + r.error.message + "。请先查询原操作回执。" : "保存结果待确认，请先查询原操作回执。");
			} catch {
				n === W && (R.value = "保存结果待确认，请先查询原操作回执。");
			} finally {
				n === W && (I.value = !1);
			}
		}
		return se(() => [
			g.value,
			ee.context.identityKey,
			re.value,
			ie.value
		], () => {
			pe(), I.value = !1, E.value = null, y.value = [], b.value = "", R.value = "", ue.value = null, B.value = !1, re.value && _e();
		}, {
			immediate: !0,
			flush: "sync"
		}), ne(pe), ge(ve), n({
			confirmLeave: ve,
			refresh: _e
		}), (t, n) => (_(), s("section", Br, [
			R.value ? (_(), a(w(O), {
				key: 0,
				title: R.value,
				type: "warning",
				closable: !1
			}, null, 8, ["title"])) : o("", !0),
			re.value ? o("", !0) : (_(), a(w(O), {
				key: 1,
				title: "当前账号没有预测网格配置查询权限",
				type: "warning",
				closable: !1
			})),
			ue.value ? (_(), s("div", Vr, [
				c("strong", null, S(ue.value.command.symbol) + " 配置结果待确认", 1),
				d(w(k), {
					disabled: I.value || !ie.value,
					onClick: n[0] ||= (e) => Y("receipt")
				}, {
					default: T(() => [...n[11] ||= [u("查询原操作回执", -1)]]),
					_: 1
				}, 8, ["disabled"]),
				le.value ? (_(), a(w(k), {
					key: 0,
					disabled: I.value || !ie.value,
					onClick: n[1] ||= (e) => Y("recover")
				}, {
					default: T(() => [...n[12] ||= [u("恢复原请求", -1)]]),
					_: 1
				}, 8, ["disabled"])) : o("", !0)
			])) : o("", !0),
			c("div", Hr, [c("aside", Ur, [
				c("div", Wr, [n[13] ||= c("strong", null, "币种配置", -1), c("span", null, S(oe.value.length) + " 条", 1)]),
				d(w(e), {
					modelValue: C.value,
					"onUpdate:modelValue": n[2] ||= (e) => C.value = e,
					clearable: "",
					placeholder: "搜索交易对",
					"aria-label": "搜索交易对"
				}, null, 8, ["modelValue"]),
				c("div", Gr, [(_(!0), s(r, null, ae(oe.value, (e) => (_(), s("div", {
					key: e.symbol,
					class: te(["symbol-row", { active: e.symbol === b.value }])
				}, [
					c("button", {
						type: "button",
						class: "symbol-button",
						disabled: I.value || !!ue.value,
						onClick: (t) => ye(e.symbol)
					}, [d(w(p), { symbol: e.symbol }, null, 8, ["symbol"])], 8, Kr),
					c("span", qr, S(e.configured ? "已配置" : "待配置"), 1),
					d(w(de), {
						"model-value": e.enabled,
						disabled: U.value || e.availability_version === void 0 || !e.enabled && !e.configured,
						"data-config-enabled": e.symbol,
						"aria-label": e.symbol + " 网格币种开关",
						title: !e.configured && !e.enabled ? "请先保存模板参数" : "立即设置币种开放状态",
						onChange: (t) => J(e, t)
					}, null, 8, [
						"model-value",
						"disabled",
						"data-config-enabled",
						"aria-label",
						"title",
						"onChange"
					])
				], 2))), 128))])
			]), c("main", Jr, [b.value ? (_(), s("header", Yr, [c("div", null, [c("h2", null, S(b.value) + " · 预测网格", 1), n[14] ||= c("p", null, "平台模板", -1)]), c("div", Xr, [d(w(k), { onClick: n[3] ||= (e) => N.value = !0 }, {
				default: T(() => [...n[15] ||= [u("玩法说明", -1)]]),
				_: 1
			}), ie.value ? (_(), a(w(k), {
				key: 0,
				type: "primary",
				disabled: U.value || !E.value,
				loading: I.value,
				onClick: xe
			}, {
				default: T(() => [...n[16] ||= [u("仅保存参数", -1)]]),
				_: 1
			}, 8, ["disabled", "loading"])) : o("", !0)])])) : o("", !0), d(gn, {
				loading: I.value && !E.value,
				"hide-content": I.value && !E.value,
				"min-height": "0px",
				class: "grid-config__detail"
			}, {
				default: T(() => [L.value ? (_(), a(w(k), {
					key: 0,
					disabled: I.value,
					onClick: _e
				}, {
					default: T(() => [...n[17] ||= [u("重新加载", -1)]]),
					_: 1
				}, 8, ["disabled"])) : !E.value && !I.value ? (_(), a(w(P), {
					key: 1,
					description: "请选择交易对查看配置"
				})) : o("", !0), E.value ? (_(), s("div", Zr, [
					c("article", Qr, [n[18] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "网格区间配置"), c("p", { class: "parameter-description" }, "该币种的网格区间由平台统一设置。")], -1), d(w(ce), {
						class: "fields limit-fields",
						"label-position": "top",
						onSubmit: n[6] ||= D(() => {}, ["prevent"])
					}, {
						default: T(() => [d(w(F), { label: "纵向格子区间" }, {
							default: T(() => [d(En, {
								modelValue: M.value.price_band_width,
								"onUpdate:modelValue": n[4] ||= (e) => M.value.price_band_width = e,
								"input-component": w(e),
								unit: "USDT",
								disabled: U.value
							}, null, 8, [
								"modelValue",
								"input-component",
								"disabled"
							])]),
							_: 1
						}), d(w(F), { label: "横向格子区间" }, {
							default: T(() => [d(En, {
								modelValue: M.value.column_duration_seconds,
								"onUpdate:modelValue": n[5] ||= (e) => M.value.column_duration_seconds = e,
								"input-component": w(e),
								unit: "秒",
								min: "1",
								max: "10",
								disabled: U.value
							}, null, 8, [
								"modelValue",
								"input-component",
								"disabled"
							])]),
							_: 1
						})]),
						_: 1
					})]),
					c("article", $r, [n[19] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "价格精度")], -1), d(w(ce), {
						class: "fields limit-fields",
						"label-position": "top",
						onSubmit: n[8] ||= D(() => {}, ["prevent"])
					}, {
						default: T(() => [d(w(F), { label: "价格小数位" }, {
							default: T(() => [d(En, {
								modelValue: M.value.price_decimals,
								"onUpdate:modelValue": n[7] ||= (e) => M.value.price_decimals = e,
								"input-component": w(e),
								unit: "位",
								min: "0",
								max: "8",
								disabled: U.value
							}, null, 8, [
								"modelValue",
								"input-component",
								"disabled"
							])]),
							_: 1
						})]),
						_: 1
					})]),
					(_(), s(r, null, ae(m, (t, i) => c("article", {
						key: t.title,
						class: "parameter-card"
					}, [c("header", ei, [c("h3", null, S(t.title), 1)]), d(w(ce), {
						class: te(["fields", i === 0 ? "odds-fields" : "limit-fields"]),
						"label-position": "top",
						onSubmit: n[9] ||= D(() => {}, ["prevent"])
					}, {
						default: T(() => [(_(!0), s(r, null, ae(t.fields, ([t, n, r]) => (_(), a(w(F), {
							key: t,
							label: n
						}, {
							default: T(() => [d(En, {
								modelValue: j.value[t],
								"onUpdate:modelValue": (e) => j.value[t] = e,
								"input-component": w(e),
								unit: r,
								percentage: t === "target_rtp",
								step: r === "x" ? "0.01" : "1",
								disabled: U.value
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
				modelValue: N.value,
				"onUpdate:modelValue": n[10] ||= (e) => N.value = e
			}, null, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-9dad56d4"]]), ni = { class: "prediction-page prediction-table-page mm-ui" }, ri = { class: "prediction-page__header" }, ii = {
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
}, oi = { class: "game-choice-content" }, si = { key: 1 }, ci = {
	key: 2,
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
		let { predictionConfigurationList: n, predictionConfigurationSave: l } = fe().api, { symbols: f } = fe().api, ee = he(), p = me(), m = v(""), g = v(!1), ie = v([]), y = v("UP_DOWN"), C = v("UP_DOWN"), oe = fe().grid.globalTemplate ? ti : Dr, E = x(), D = [
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
		], A = v(""), j = i(() => Ze(p.perms, "prediction_config:lists")), M = v(""), N = x(), ce = i(() => N.value?.editingState), F = i(() => {
			let e = ce.value;
			return !e || e.target !== A.value || e.actor !== String(p.userInfo.id || "") || !j.value || !Ze(p.perms, "prediction_config:edit") || e.saving ? null : z.value ? {
				text: "开关待核验",
				tone: "warning",
				detail: L.value?.error || "请使用原请求核验开关结果"
			} : e.pending ? {
				text: "结果待确认",
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
		}), I = 0, L = x(), z = v(!1), le = v(!1), B;
		function ue() {
			if (!B) throw Error("请选择要调整的币种");
			return B;
		}
		function H(e) {
			return !j.value || !Ze(p.perms, "prediction_config:edit") || !e.configured || g.value || z.value || le.value || !!(ce.value?.saving || ce.value?.pending);
		}
		function U(e) {
			return z.value ? "请先核验原操作" : H(e) ? "当前不可操作" : "立即设置该币种所有周期的开放状态";
		}
		function W(e, t) {
			typeof t != "boolean" || !e.game_type || H(e) || (B = {
				action: "set_enabled",
				game_type: e.game_type,
				symbol: e.symbol,
				based_on_template_version: e.template_version,
				enabled: t
			}, L.value?.submit());
		}
		async function G(e) {
			let t = await l(e), n = t.configuration;
			if (!n?.rules?.length || n.rules.some((t) => t.game_type !== "GAME_TYPE_" + e.game_type || t.symbol !== e.symbol) || n.symbol_enabled !== e.enabled || !/^[1-9]\d*$/.test(n.template_version)) throw Error("开关回执与当前操作不符，请核验原操作");
			return {
				...t,
				priorVersion: e.based_on_template_version
			};
		}
		function K(e) {
			let { configuration: t, priorVersion: n } = e;
			q(t, n), N.value?.appliedSwitch(n, t);
		}
		function q(e, t) {
			let n = e.rules[0], r = !1, i = ie.value.map((i) => i.rules[0]?.symbol === n.symbol && i.rules[0].game_type === n.game_type ? (r = !0, BigInt(i.template_version) > BigInt(e.template_version) ? i : e) : i.template_version === t ? {
				...i,
				template_version: e.template_version
			} : i);
			!r && n.game_type === "GAME_TYPE_" + y.value && i.push(e), ie.value = i;
		}
		let pe = (e) => e === "GAME_TYPE_UP_DOWN" ? "UP_DOWN" : e === "GAME_TYPE_HIGH_LOW" ? "HIGH_LOW" : null, ge = (e) => e === "UP_DOWN" ? "涨跌预测" : e === "HIGH_LOW" ? "自选预测" : "--", _e = be, ve = i(() => ie.value.map((e, t) => {
			let n = e.rules[0], r = pe(n?.game_type) || y.value || null, i = n?.symbol || "";
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
				updated_at: _e(e.updated_at_ms)
			};
		}).sort((e, t) => e.game_type === t.game_type ? e.symbol.localeCompare(t.symbol) : (e.game_type || "").localeCompare(t.game_type || "")));
		function ye(e) {
			let t = e.row_key === ce.value?.target && ce.value?.ready ? ce.value.roomDurations : e.configuration ? Je(e.configuration) : void 0;
			return t ? t.map((t) => xe(t, e.game_type || void 0)).join(" · ") || "暂无房间" : e.directory_label;
		}
		let J = v([]), Y = v(!1), Ce = v(""), we = (e) => e.trim().toUpperCase(), Te = 0, Ee;
		async function De() {
			if (!j.value) return;
			Ee?.abort(), Ee = new AbortController();
			let e = ++Te;
			Y.value = !0, Ce.value = "";
			try {
				let t = await f(Ee.signal);
				if (e !== Te) return;
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
					let r = we(t.symbol);
					n.has(r) || n.set(r, {
						symbol: r,
						base_asset: typeof t.base_asset == "string" ? t.base_asset : "",
						quote_asset: typeof t.quote_asset == "string" ? t.quote_asset : ""
					});
				}
				J.value = [...n.values()];
			} catch (t) {
				e === Te && (Ce.value = Se(t));
			} finally {
				e === Te && (Y.value = !1);
			}
		}
		let Oe = i(() => {
			let e = [...ve.value], t = new Set(e.filter((e) => e.game_type === y.value).map((e) => we(e.symbol)));
			for (let n of J.value) t.has(n.symbol) || e.push({
				row_key: `${y.value}:${n.symbol}`,
				configuration: null,
				game_type: y.value,
				symbol: n.symbol,
				enabled: !1,
				configured: !1,
				editable: Ze(p.perms, "prediction_config:edit") && !Ce.value,
				rule_count: 0,
				template_version: "未配置",
				effective_version: "未配置",
				updated_at: "未提供",
				directory_label: [n.base_asset, n.quote_asset].filter(Boolean).join(" / ") || "点击填写配置"
			});
			return Xe(e, J.value.map((e) => e.symbol));
		}), ke = i(() => {
			let e = M.value.trim().toUpperCase();
			return Oe.value.filter((t) => (!y.value || t.game_type === y.value) && (!e || t.symbol.includes(e)));
		}), Ae = i(() => Oe.value.find((e) => e.row_key === A.value)), je = i(() => (g.value || Y.value) && !Ae.value), Me = 0, Ne, Pe = async () => {
			if (!Ze(p.perms, "prediction_config:lists")) {
				m.value = "没有玩法配置查询权限";
				return;
			}
			m.value = "", Ne?.abort(), Ne = new AbortController();
			let e = ++Me, t = String(p.userInfo.id || "");
			g.value = !0;
			try {
				let r = await n({ game_type: y.value || void 0 }, Ne.signal);
				if (e !== Me || t !== String(p.userInfo.id || "") || !j.value) return;
				if (!Array.isArray(r.configurations)) throw Error("配置列表格式异常，请重新加载");
				if (ie.value = r.configurations, !Oe.value.some((e) => e.row_key === A.value && e.editable)) {
					let e = Oe.value.find((e) => e.configured && e.editable && e.game_type === y.value);
					e ? await Ie(e, !0) : A.value = "";
				}
			} catch (t) {
				e === Me && (m.value = Se(t), ie.value = []);
			} finally {
				e === Me && (g.value = !1);
			}
		}, Fe = async (e) => {
			if (!(C.value === e || le.value || z.value) && !(C.value === "GRID" && E.value && !await E.value.confirmLeave())) {
				if (C.value !== "GRID" && (ce.value?.dirty || ce.value?.pending)) {
					R.warning("请先处理当前未保存修改或待确认操作");
					return;
				}
				if (I++, C.value = e, e === "GRID") {
					A.value = "";
					return;
				}
				y.value = e, A.value = "", M.value = "", ie.value = [], Pe(), J.value.length || De();
			}
		}, Ie = async (e, t = !1) => {
			if (!t && (ce.value?.saving || ce.value?.pending || ce.value?.dirty || le.value || z.value)) {
				R.warning("请先处理当前未保存修改或待确认操作");
				return;
			}
			let n = String(p.userInfo.id || ""), r = ++I;
			if (!(!j.value || !e.editable || g.value && !t || m.value || !e.game_type || !e.symbol || A.value === e.row_key) && (A.value = e.row_key, await h(), !(r !== I || A.value !== e.row_key || n !== String(p.userInfo.id || "") || !j.value))) return {
				selection: r,
				detail: await N.value?.open(e.game_type, e.symbol, t ? e.configuration ?? void 0 : void 0, !e.configured)
			};
		}, Le = () => {
			if (C.value === "GRID") {
				E.value?.refresh();
				return;
			}
			I++, Pe(), De();
		};
		return se(() => [
			p.userInfo.id,
			j.value,
			Ze(p.perms, "prediction_config:edit")
		], () => {
			I++, Me++, Ne?.abort(), g.value = !1;
		}, { flush: "sync" }), re(Le), ne(() => {
			I++, Me++, Ne?.abort(), Te++, Ee?.abort();
		}), (t, n) => (_(), s("section", ni, [
			c("header", ri, [c("div", ii, [(_(), s(r, null, ae(D, (e) => d(w(k), {
				key: e.value,
				type: C.value === e.value ? "primary" : void 0,
				"aria-pressed": C.value === e.value,
				"aria-label": e.label,
				onClick: (t) => Fe(e.value)
			}, {
				default: T(() => [(_(), s("svg", ai, [e.value === "UP_DOWN" ? (_(), s(r, { key: 0 }, [n[4] ||= c("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}, null, -1), n[5] ||= c("path", { d: "m16 12-4-4-4 4M12 16V8" }, null, -1)], 64)) : e.value === "HIGH_LOW" ? (_(), s(r, { key: 1 }, [n[6] ||= c("path", { d: "m9 9 5 12 1.8-5.2L21 14Z" }, null, -1), n[7] ||= c("path", { d: "M7.2 2.2 8 5.1M5.1 8l-2.9-.8M14 4.1 12 6M6 12l-1.9 2" }, null, -1)], 64)) : (_(), s(r, { key: 2 }, [n[8] ||= c("rect", {
					x: "3",
					y: "3",
					width: "18",
					height: "18",
					rx: "2"
				}, null, -1), n[9] ||= c("path", { d: "M9 3v18M15 3v18M3 9h18M3 15h18" }, null, -1)], 64))])), c("span", oi, [c("strong", null, S(e.label), 1), c("small", null, S(e.description), 1)])]),
				_: 2
			}, 1032, [
				"type",
				"aria-pressed",
				"aria-label",
				"onClick"
			])), 64))])]),
			j.value ? (_(), a(dn, {
				key: 0,
				ref_key: "switchPanel",
				ref: L,
				action: "config.availability",
				target: "platform",
				permission: "prediction_config:edit",
				"automatic-reason": "通过总后台设置币种全周期开关",
				payload: ue,
				send: G,
				"hide-button": !!Ae.value || !z.value,
				"hide-success": "",
				"hide-pending-details": "",
				onPending: n[0] ||= (e) => z.value = e,
				onBusy: n[1] ||= (e) => le.value = e,
				onSuccess: K
			}, null, 8, ["hide-button"])) : o("", !0),
			C.value !== "GRID" && m.value ? (_(), s("div", si, [d(w(O), {
				title: m.value,
				type: "error",
				closable: !1
			}, null, 8, ["title"]), d(w(k), {
				loading: g.value,
				onClick: Le
			}, {
				default: T(() => [...n[10] ||= [u("重试", -1)]]),
				_: 1
			}, 8, ["loading"])])) : o("", !0),
			C.value !== "GRID" && Ce.value ? (_(), s("div", ci, [d(w(O), {
				title: `币种目录加载失败：${Ce.value}`,
				type: "warning",
				closable: !1
			}, null, 8, ["title"]), d(w(k), {
				"aria-label": "重试币种目录",
				loading: Y.value,
				onClick: De
			}, {
				default: T(() => [...n[11] ||= [u("重试币种目录", -1)]]),
				_: 1
			}, 8, ["loading"])])) : o("", !0),
			C.value !== "GRID" && j.value ? (_(), a(gn, {
				key: 3,
				class: "prediction-page__loading-workspace",
				loading: je.value,
				"hide-content": je.value,
				"min-height": "0px"
			}, {
				default: T(() => [c("div", li, [d(gn, {
					as: "aside",
					loading: (g.value || Y.value) && !je.value,
					"min-height": "0px",
					class: "symbol-panel",
					"aria-label": "交易对配置列表"
				}, {
					default: T(() => [
						c("div", ui, [n[12] ||= c("strong", null, "币种配置", -1), c("span", null, S(ke.value.length) + " 条", 1)]),
						d(w(e), {
							modelValue: M.value,
							"onUpdate:modelValue": n[2] ||= (e) => M.value = e,
							clearable: "",
							placeholder: "搜索交易对",
							"aria-label": "搜索交易对"
						}, null, 8, ["modelValue"]),
						c("div", di, [(_(!0), s(r, null, ae(ke.value, (e) => (_(), s("div", {
							key: e.row_key,
							class: te(["symbol-row", { "is-active": A.value === e.row_key }])
						}, [
							c("button", {
								type: "button",
								class: "symbol-choice",
								"aria-pressed": A.value === e.row_key,
								"data-config-symbol": e.symbol,
								disabled: !e.editable || g.value || !!m.value,
								onClick: (t) => Ie(e)
							}, [c("span", pi, [d(w(ee), { symbol: e.symbol }, null, 8, ["symbol"]), e.configured ? o("", !0) : (_(), a(w(V), {
								key: 0,
								size: "small",
								type: "info"
							}, {
								default: T(() => [...n[13] ||= [u("待首次配置", -1)]]),
								_: 1
							}))]), c("span", {
								class: "symbol-choice__periods",
								title: ye(e)
							}, S(ye(e)), 9, mi)], 8, fi),
							e.configured ? (_(), a(w(de), {
								key: 0,
								"data-config-enabled": e.symbol,
								"aria-label": `${e.symbol} 开放配置`,
								"model-value": e.enabled,
								disabled: H(e),
								title: U(e),
								onChange: (t) => W(e, t)
							}, null, 8, [
								"data-config-enabled",
								"aria-label",
								"model-value",
								"disabled",
								"title",
								"onChange"
							])) : o("", !0),
							A.value === e.row_key && ce.value?.dirty ? (_(), s("span", hi, "未保存")) : o("", !0)
						], 2))), 128)), !g.value && !Y.value && !m.value && !Ce.value && !ke.value.length ? (_(), a(w(P), {
							key: 0,
							description: "暂无符合条件的交易对",
							"image-size": 56
						})) : o("", !0)])
					]),
					_: 1
				}, 8, ["loading"]), c("main", gi, [Ae.value ? (_(), s("div", _i, [c("div", null, [c("h2", null, [u(S(Ae.value.symbol) + " ", 1), c("span", vi, " · " + S(ge(Ae.value.game_type)), 1)]), c("p", yi, "更新时间 " + S(Ae.value.updated_at), 1)]), w(Ze)(w(p).perms, "prediction_config:edit") ? (_(), s("div", bi, [F.value ? (_(), s("span", {
					key: 0,
					"data-config-save-feedback": "",
					class: te(["config-save-feedback", `config-save-feedback--${F.value.tone}`]),
					role: "status",
					title: F.value.detail || void 0,
					"aria-label": F.value.detail ? `${F.value.text}：${F.value.detail}` : void 0
				}, S(F.value.text), 11, xi)) : o("", !0), d(w(k), {
					type: "primary",
					loading: ce.value?.saving || le.value,
					disabled: le.value || !z.value && (!ce.value || ce.value.saving || !ce.value.pending && !ce.value.ready),
					onClick: n[3] ||= (e) => z.value ? L.value?.submit() : N.value?.saveConfig()
				}, {
					default: T(() => [u(S(z.value || ce.value?.pending ? "核验原操作" : "仅保存参数"), 1)]),
					_: 1
				}, 8, ["loading", "disabled"])])) : o("", !0)])) : o("", !0), A.value ? (_(), a(Jn, {
					key: 1,
					ref_key: "editRef",
					ref: N,
					inline: "",
					"external-save": "",
					onSuccess: q
				}, null, 512)) : !g.value && !Y.value && !m.value ? (_(), a(w(P), {
					key: 2,
					description: "请选择交易对查看配置"
				})) : o("", !0)])])]),
				_: 1
			}, 8, ["loading", "hide-content"])) : C.value === "GRID" ? (_(), a(b(w(oe)), {
				key: 4,
				ref_key: "gridRef",
				ref: E,
				class: "grid-mode"
			}, null, 512)) : o("", !0)
		]));
	}
}), [["__scopeId", "data-v-42ea0cb5"]]), Ci = 9223372036854775807n;
function wi(e) {
	return e == null ? "—" : typeof e == "object" ? JSON.stringify(e) : String(e);
}
function Z(e, t = !1) {
	return typeof e == "string" && /^(0|[1-9][0-9]*)$/.test(e) && e.length <= 19 && BigInt(e) <= Ci && (!t || e !== "0");
}
function Ti(e) {
	return typeof e == "number" ? Number.isSafeInteger(e) && e > 0 ? String(e) : null : Z(e, !0) ? e : null;
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
	if (!Z(e) || BigInt(e) > 8640000000000000n) return e == null ? "—" : wi(e);
	let t = new Date(Number(e));
	return Number.isNaN(t.getTime()) ? wi(e) : t.toLocaleString();
}
function ki(e, t = 64, n = !1) {
	return typeof e == "string" && e.length > 0 && [...e].length <= t && e.trim() === e && !/[\u0000-\u001f\u007f]/.test(e) && (!n || /^[A-Z0-9][A-Z0-9._-]*$/.test(e));
}
//#endregion
//#region src/prediction-config/agent/utils/decimal.ts
var Ai = /^([+-]?)(\d*)(?:\.(\d*))?$/, ji = /^([+-]?)(\d*\.?\d+)[eE]([+-]?\d+)$/, Mi = 1e3;
function Ni(e) {
	if (!/[eE]/.test(e)) return e;
	let t = e.match(ji);
	if (!t) return null;
	let [, n, r, i] = t, a = Number(i);
	if (!Number.isSafeInteger(a) || Math.abs(a) > Mi) return null;
	let [o = "", s = ""] = r.split("."), c = `${o}${s}`, l = o.length + a;
	return l <= 0 ? `${n}0.${"0".repeat(Math.abs(l))}${c}` : l >= c.length ? `${n}${c}${"0".repeat(l - c.length)}` : `${n}${c.slice(0, l)}.${c.slice(l)}`;
}
function Pi(e) {
	if (e == null || e === "") return null;
	let t = Ni(String(e).trim().replace(/,/g, ""));
	if (t == null) return null;
	let n = t.match(Ai);
	if (!n || !n[2] && !n[3]) return null;
	let [, r, i = "", a = ""] = n, o = i.replace(/^0+(?=\d)/, "") || "0", s = a.replace(/0+$/, ""), c = s ? `${o}.${s}` : o;
	return /^0(?:\.0*)?$/.test(c) ? "0" : r === "-" ? `-${c}` : c;
}
//#endregion
//#region src/prediction-config/agent/views/prediction/game-config/site-model.ts
var Fi = (e) => e.stored.game_type === "GAME_TYPE_HIGH_LOW" ? "HIGH_LOW" : "UP_DOWN", Ii = [
	"35",
	"40",
	"45",
	"60",
	"90"
], Li = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Q(e, t = "INVALID_SITE_CONFIGURATION") {
	if (!e) throw Error(t);
}
function Ri(e) {
	if (e && typeof e == "object") {
		Object.freeze(e);
		for (let t of Object.values(e)) Ri(t);
	}
	return e;
}
function zi(e = globalThis.crypto) {
	Q(e && typeof e.getRandomValues == "function", "SECURE_RANDOM_UNAVAILABLE");
	let t = e.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	Q(t instanceof Uint8Array && t.length === 16, "SECURE_RANDOM_UNAVAILABLE"), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0")).join("");
	return `${n.slice(0, 8)}-${n.slice(8, 12)}-${n.slice(12, 16)}-${n.slice(16, 20)}-${n.slice(20)}`;
}
function Bi(e) {
	Q(Li(e) && Ti(e.operator_id) === e.operator_id && Ti(e.agent_id) === e.agent_id, "IDENTITY_UNCONFIRMED");
}
function Vi(e) {
	Q(Li(e)), Bi(e.actor), Q(Array.isArray(e.sites) && e.sites.length <= 100);
	let t = /* @__PURE__ */ new Set();
	for (let n of e.sites) {
		Q(Li(n) && ki(n.site_id, 128) && !t.has(n.site_id) && Array.isArray(n.games)), t.add(n.site_id), Q(n.games.length > 0 && n.games.length <= 2);
		let e = /* @__PURE__ */ new Set();
		for (let t of n.games) Q(Li(t) && ["UP_DOWN", "HIGH_LOW"].includes(String(t.game_type)) && !e.has(t.game_type) && Array.isArray(t.symbols) && t.symbols.length <= 100 && t.symbols.every((e) => ki(e, 64, !0)) && new Set(t.symbols).size === t.symbols.length), e.add(t.game_type);
	}
}
function Hi(e, t) {
	Q(Object.keys(e).every((e) => t.includes(e)));
}
function Ui(e) {
	Q(Li(e) && ki(e.site_id, 128) && ["GAME_TYPE_UP_DOWN", "GAME_TYPE_HIGH_LOW"].includes(String(e.game_type)) && ki(e.symbol, 64, !0)), Q(Z(e.version, !0) && Z(e.based_on_public_version, !0) && typeof e.enabled == "boolean" && Array.isArray(e.overrides));
	let t = e.game_type === "GAME_TYPE_UP_DOWN";
	Q(e.overrides.length <= (t ? 5 : 100) && new Set(e.overrides.map((e) => e.duration_seconds)).size === e.overrides.length);
	for (let n of e.overrides) {
		Q(Li(n)), Hi(n, [
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
		]), Q(n.game_type === e.game_type && n.symbol === e.symbol && (t ? Ii.includes(String(n.duration_seconds)) : Z(n.duration_seconds, !0))), Q(!Object.hasOwn(n, "enabled") || typeof n.enabled == "boolean"), Q(Array.isArray(n.stake_tiers) && n.stake_tiers.length <= +!!t), t || Gi(n);
		for (let e of n.stake_tiers) Q(Li(e)), Hi(e, [
			"stake_tier_id",
			"enabled",
			"maximum_stake"
		]), Q(ki(e.stake_tier_id) && (!Object.hasOwn(e, "enabled") || typeof e.enabled == "boolean") && (!Object.hasOwn(e, "maximum_stake") || Ei(e.maximum_stake)));
	}
}
function Wi(e, t, n, r) {
	Q(Li(e)), Ui(e.stored);
	let i = e.stored, a = e.effective;
	Q(i.site_id === t && i.symbol === n && Li(a) && (!r || i.game_type === "GAME_TYPE_" + r));
	let o = i.game_type === "GAME_TYPE_UP_DOWN";
	Q(a.site_id === t && a.symbol === n && a.game_type === i.game_type), Q(Z(a.public_version, !0) && a.site_version === i.version && a.based_on_public_version === i.based_on_public_version && typeof a.enabled == "boolean"), Q(Array.isArray(a.rules) && (o ? a.rules.length === 5 : a.rules.length > 0 && a.rules.length <= 100) && new Set(a.rules.map((e) => e.duration_seconds)).size === a.rules.length);
	let s = a.rules;
	for (let e of s) {
		if (Q(Li(e) && e.game_type === i.game_type && e.symbol === n && (o ? Ii.includes(String(e.duration_seconds)) : Z(e.duration_seconds, !0)) && typeof e.enabled == "boolean"), Q(Array.isArray(e.stake_tiers)), !o) {
			Q(e.stake_tiers.length === 0), Gi(e, !0);
			continue;
		}
		Q(e.bet_open_seconds === "30"), Q(e.stake_tiers.every((e) => Li(e) && ki(e.stake_tier_id) && typeof e.enabled == "boolean" && typeof e.retired == "boolean"));
		let t = e.stake_tiers.filter((e) => !e.retired);
		Q(t.length === 1 && t[0].minimum_stake === "1" && Ei(t[0].maximum_stake));
		let r = i.overrides.find((t) => t.duration_seconds === e.duration_seconds);
		Q(!r?.stake_tiers.length || r.stake_tiers[0].stake_tier_id === t[0].stake_tier_id);
	}
	a.public_version === i.based_on_public_version && Q(i.overrides.every((e) => s.some((t) => t.duration_seconds === e.duration_seconds))), Q(Array.isArray(e.adjustments));
}
function Gi(e, t = !1) {
	for (let n of [
		"fixed_odds",
		"minimum_stake",
		"maximum_stake"
	]) (t || Object.hasOwn(e, n)) && Q(Ei(e[n]) && Di(e[n], n === "fixed_odds" ? "1" : "0") > 0);
	e.minimum_stake !== void 0 && e.maximum_stake !== void 0 && Q(Di(e.minimum_stake, e.maximum_stake) <= 0);
}
function Ki(e) {
	return Wi(e, e.stored.site_id, e.stored.symbol), Fi(e) === "HIGH_LOW" ? [...e.effective.rules].sort((e, t) => BigInt(e.duration_seconds) < BigInt(t.duration_seconds) ? -1 : 1).map((t) => {
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
	}) : Ii.map((t) => {
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
function qi(e, t, n, r, i) {
	let a = Ki(e);
	Q(typeof n == "boolean" && ki(r, 500) && ki(i, 128), "INVALID_REASON"), Q(t.length === a.length && new Set(t.map((e) => e.duration_seconds)).size === a.length);
	let o = Fi(e), s = a.map((n) => {
		let r = t.find((e) => e.duration_seconds === n.duration_seconds);
		Q(r && r.stake_tier_id === n.stake_tier_id && typeof r.enabled == "boolean");
		let i = e.stored.overrides.find((e) => e.duration_seconds === n.duration_seconds);
		if (o === "HIGH_LOW") {
			Gi(r, !0), Q(Di(r.fixed_odds, "2") < 0, "INVALID_ODDS");
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
	return Ri({
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
var Ji = class {
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
function Yi(e) {
	return e.stake_tiers.find((e) => !e.retired);
}
function Xi(e) {
	return e?.kind !== void 0 || e?.config_site_id !== void 0;
}
function Zi(e) {
	return Z(e?.operator_id, !0) ? Xi(e) ? Z(e.config_site_id) ? e.kind === "SITE" ? e.agent_id === "0" && Z(e.config_site_id, !0) : e.kind === "MERCHANT" && Z(e.agent_id, !0) && e.operator_id === e.agent_id : !1 : e.operator_id === e.agent_id : !1;
}
var Qi = (e) => typeof e == "string" && /^(0|[1-9][0-9]{0,17})(\.[0-9]{1,18})?$/.test(e) && Di(e, "0") > 0;
function $i(e, t, n, r) {
	return [
		e,
		t,
		n,
		r
	].every(Qi) && Di(e, n) <= 0 && Di(n, r) <= 0 && Di(r, t) <= 0;
}
function ea(e, t) {
	Q(Zi(t), "IDENTITY_UNCONFIRMED"), Q(Li(e) && e.owner_agent_id === t.agent_id && ["GAME_TYPE_UP_DOWN", "GAME_TYPE_HIGH_LOW"].includes(String(e.game_type)) && ki(e.symbol, 64, !0), "INVALID_OWNER_CONFIGURATION"), Q(Z(e.public_version, !0) && Z(e.owner_revision) && Array.isArray(e.rules) && e.rules.length > 0 && e.rules.length <= 100);
	let n = Xi(t);
	Q(e.config_model === "SCOPED_OWNER_V1" === n, "CONFIGURATION_MODEL_MISMATCH"), n && (Q(e.config_site_id === t.config_site_id && Z(e.revision, !0) && Z(e.site_revision), "IDENTITY_UNCONFIRMED"), Q(e.revision === (t.kind === "SITE" ? e.site_revision : e.owner_revision)), Q(t.kind !== "SITE" || e.owner_revision === "0"), Q(t.config_site_id !== "0" || e.site_revision === "0"), Q(typeof e.effective_enabled == "boolean" && typeof e.can_enable == "boolean" && ["", "PARENT_CONSTRAINT_CHANGED"].includes(String(e.blocked_reason))), Q(e.symbol_available === void 0 || typeof e.symbol_available == "boolean"), Q(!e.can_enable || e.blocked_reason === "" && e.symbol_available !== !1));
	let r = n && e.blocked_reason === "PARENT_CONSTRAINT_CHANGED";
	Q(typeof e.enabled == "boolean" && typeof e.platform_enabled == "boolean");
	let i = e.game_type === "GAME_TYPE_UP_DOWN", a = /* @__PURE__ */ new Set();
	i && Q(e.rules.length === 5);
	for (let t of e.rules) {
		Q(Li(t) && Li(t.rule) && Z(t.rule_epoch, !0) && typeof t.custom == "boolean");
		let n = t.rule;
		Q(typeof t.platform_enabled == "boolean" && typeof t.owner_enabled == "boolean" && n.enabled === (!r && e.enabled && t.platform_enabled && t.owner_enabled)), Q(i ? Qi(t.platform_target_payout_rate) && Qi(t.platform_maximum_odds) && t.platform_fixed_odds === "" && Qi(n.target_payout_rate) && Qi(n.maximum_odds) && (r || Di(n.target_payout_rate, t.platform_target_payout_rate) <= 0) && Di(n.target_payout_rate, "1") <= 0 && (r || Di(n.maximum_odds, t.platform_maximum_odds) <= 0) && Di(n.maximum_odds, "1") >= 0 : Qi(t.platform_fixed_odds) && t.platform_target_payout_rate === "" && t.platform_maximum_odds === "" && Qi(n.fixed_odds) && Di(n.fixed_odds, "1") > 0 && (r || Di(n.fixed_odds, t.platform_fixed_odds) <= 0)), Q(n.game_type === e.game_type && n.symbol === e.symbol && Z(n.duration_seconds, !0) && !a.has(n.duration_seconds) && typeof n.enabled == "boolean" && Array.isArray(n.stake_tiers)), a.add(n.duration_seconds);
		let o = n;
		if (i) {
			Q(Ii.includes(n.duration_seconds) && n.bet_open_seconds === "30");
			let e = /* @__PURE__ */ new Set(), t = n.stake_tiers.filter((t) => (Q(Li(t) && ki(t.stake_tier_id) && !e.has(t.stake_tier_id) && typeof t.retired == "boolean" && typeof t.enabled == "boolean"), e.add(t.stake_tier_id), !t.retired));
			Q(t.length === 1), o = t[0], Q(Li(o) && ki(o.stake_tier_id) && typeof o.enabled == "boolean" && o.retired === !1), Q(Ei(n.target_payout_rate) && Ei(n.minimum_odds) && Ei(n.maximum_odds));
		} else Q(n.stake_tiers.length === 0 && Ei(n.fixed_odds));
		Q(Qi(t.platform_minimum_stake) && Qi(t.platform_maximum_stake) && Qi(o.minimum_stake) && Qi(o.maximum_stake) && Di(o.minimum_stake, o.maximum_stake) <= 0), Q(r || $i(t.platform_minimum_stake, t.platform_maximum_stake, o.minimum_stake, o.maximum_stake));
	}
	n && Q(e.effective_enabled === e.rules.some((e) => e.rule.enabled));
}
function ta(e, t) {
	ea(e, t);
	let n = e.game_type === "GAME_TYPE_UP_DOWN";
	return e.rules.map((e) => {
		let t = e.rule, r = n ? Yi(t) : t;
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
			stake_tier_id: n ? Yi(t).stake_tier_id : "",
			based_rule_epoch: e.rule_epoch,
			minimum_stake: r.minimum_stake,
			maximum_stake: r.maximum_stake,
			platform_minimum: e.platform_minimum_stake,
			platform_maximum: e.platform_maximum_stake,
			enabled: t.enabled && (!n || Yi(t).enabled),
			odds: n ? `${t.minimum_odds} ~ ${t.maximum_odds}` : t.fixed_odds,
			custom: e.custom
		};
	});
}
function na(e, t, n, r, i, a = e.enabled) {
	let o = ta(e, t);
	Q(n.length === o.length && new Set(n.map((e) => e.duration_seconds)).size === o.length);
	let s = Xi(t) && e.enabled && a === !1 && o.every((e) => {
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
	Q(ki(r, 500) && ki(i, 128), "INVALID_REASON");
	let c = [];
	for (let t of o) {
		let r = n.find((e) => e.duration_seconds === t.duration_seconds);
		Q(r && r.stake_tier_id === t.stake_tier_id && r.based_rule_epoch === t.based_rule_epoch && (s || $i(t.platform_minimum, t.platform_maximum, r.minimum_stake, r.maximum_stake)), "INVALID_LIMITS"), Q(typeof r.owner_enabled == "boolean" && (r.owner_enabled === t.owner_enabled || !r.owner_enabled || t.platform_enabled), "PLATFORM_DISABLED");
		let i = e.game_type === "GAME_TYPE_UP_DOWN", a = i ? ["target_payout_rate", "maximum_odds"] : ["fixed_odds"];
		for (let e of a) Q(Qi(r[e]) && (s || Di(r[e], t[`platform_${e}`]) <= 0), "INVALID_ODDS");
		Q(i ? Di(r.target_payout_rate, "1") < 0 && Di(r.maximum_odds, "1") >= 0 : Di(r.fixed_odds, "1") > 0 && Di(r.fixed_odds, "2") < 0, "INVALID_ODDS");
		let o = Di(r.minimum_stake, t.minimum_stake) !== 0 || Di(r.maximum_stake, t.maximum_stake) !== 0, l = a.some((e) => Di(r[e], t[e]) !== 0), u = r.owner_enabled !== t.owner_enabled;
		if (o || l || u) {
			let e = {
				duration_seconds: t.duration_seconds,
				stake_tier_id: t.stake_tier_id,
				based_rule_epoch: t.based_rule_epoch,
				minimum_stake: Pi(r.minimum_stake),
				maximum_stake: Pi(r.maximum_stake)
			};
			if (u && (e.enabled = r.owner_enabled), l) for (let t of a) e[t] = Pi(r[t]);
			c.push(e);
		}
	}
	return Q(typeof a == "boolean" && (a === e.enabled || !a || (Xi(t) ? e.can_enable : e.platform_enabled)), "PLATFORM_DISABLED"), Q(c.length > 0 || a !== e.enabled, "NO_CHANGES"), t.kind === "SITE" && a && !e.enabled && Q(c.length === 0, "SEPARATE_ENABLE"), {
		...t.kind === "SITE" && a && !e.enabled ? { based_on_public_version: e.public_version } : {},
		...a === e.enabled ? {} : { enabled: a },
		game_type: e.game_type === "GAME_TYPE_UP_DOWN" ? "UP_DOWN" : "HIGH_LOW",
		symbol: e.symbol,
		based_owner_revision: Xi(t) ? e.revision : e.owner_revision,
		changes: c,
		client_request_id: i,
		reason: r
	};
}
var ra = class {
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
}, ia = [
	"35",
	"40",
	"45",
	"60",
	"90"
], aa = "prediction.agent.pending.v1", oa = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function sa(e, t = "INVALID_CONFIGURATION") {
	if (!e) throw Error(t);
}
function ca(e) {
	sa(oa(e)), sa(e.scope === "CONFIG_SCOPE_AGENT" && Ti(e.agent_id) === e.agent_id), sa(Z(e.template_version) && Z(e.agent_version) && ki(e.effective_version, 256) && Z(e.updated_at_ms)), sa(Array.isArray(e.rules) && e.rules.length === 5);
	let t = e.rules, n = t[0]?.symbol;
	sa(ki(n, 64, !0)), sa(new Set(t.map((e) => e.duration_seconds)).size === 5);
	for (let e of t) sa(oa(e) && e.game_type === "GAME_TYPE_UP_DOWN" && e.symbol === n && ia.includes(e.duration_seconds) && typeof e.enabled == "boolean"), sa(Array.isArray(e.stake_tiers) && e.stake_tiers.every((e) => oa(e) && ki(e.stake_tier_id) && typeof e.enabled == "boolean" && typeof e.retired == "boolean"));
}
function la(e) {
	return ca(e), e.rules[0].symbol;
}
function ua(e, t) {
	sa(Object.keys(e).length === t.length && Object.keys(e).every((e) => t.includes(e)), "PENDING_CORRUPT");
}
function da(e) {
	sa(oa(e), "PENDING_CORRUPT"), ua(e, [
		"client_request_id",
		"reason",
		"based_on_template_version",
		"based_on_agent_version",
		"game_type",
		"symbol",
		"agent_override"
	]), sa(ki(e.client_request_id, 128) && ki(e.reason, 500) && Z(e.based_on_template_version) && Z(e.based_on_agent_version) && e.game_type === "UP_DOWN" && ki(e.symbol, 64, !0), "PENDING_CORRUPT");
	let t = e.agent_override;
	sa(oa(t), "PENDING_CORRUPT"), ua(t, ["enabled", "overrides"]), sa(typeof t.enabled == "boolean" && Array.isArray(t.overrides) && t.overrides.length === 5, "PENDING_CORRUPT");
	let n = t.overrides;
	sa(new Set(n.map((e) => e.duration_seconds)).size === 5, "PENDING_CORRUPT");
	for (let e of n) {
		sa(oa(e), "PENDING_CORRUPT"), ua(e, [
			"duration_seconds",
			"enabled",
			"stake_tiers"
		]), sa(ia.includes(e.duration_seconds) && typeof e.enabled == "boolean" && Array.isArray(e.stake_tiers) && e.stake_tiers.length === 1, "PENDING_CORRUPT");
		let t = e.stake_tiers[0];
		sa(oa(t), "PENDING_CORRUPT"), ua(t, [
			"stake_tier_id",
			"enabled",
			"maximum_stake"
		]), sa(ki(t.stake_tier_id) && t.enabled === e.enabled && Ei(t.maximum_stake) && Di(t.maximum_stake, "1") >= 0, "PENDING_CORRUPT");
	}
	sa(t.enabled === n.some((e) => e.enabled), "PENDING_CORRUPT");
}
function fa(e) {
	if (e && typeof e == "object") {
		Object.freeze(e);
		for (let t of Object.values(e)) fa(t);
	}
	return e;
}
function pa(e) {
	let t = e.getItem(aa);
	if (t === null) return null;
	sa(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return sa(oa(n), "PENDING_CORRUPT"), ua(n, [
		"schema",
		"operator_id",
		"agent_id",
		"body",
		"attempted",
		"attempt"
	]), sa(n.schema === 1 && Ti(n.operator_id) === n.operator_id && Ti(n.agent_id) === n.agent_id && typeof n.attempted == "boolean" && Number.isSafeInteger(n.attempt) && Number(n.attempt) >= 0 && n.attempted === Number(n.attempt) > 0, "PENDING_CORRUPT"), da(n.body), fa(n);
}
var ma = (e, t) => !!e && e.operator_id === t.operator_id && e.agent_id === t.agent_id && JSON.stringify(e.body) === JSON.stringify(t.body);
function ha(e, t) {
	ma(pa(e), t) && e.removeItem(aa);
}
function ga(e, t, n, r) {
	try {
		sa(oa(e) && oa(e.receipt)), ca(e.configuration), sa(e.configuration.agent_id === r && e.configuration.rules[0].symbol === t.symbol);
		let i = e.receipt;
		return sa([
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
		].every((e) => typeof i[e] == "string")), sa(ki(i.operation_id, 256) && ki(i.trace_id, 256) && Z(i.created_at_ms) && Z(i.completed_at_ms)), sa(i.client_request_id === t.client_request_id && i.operator_id === n && i.source_service === "agent_admin" && i.result === "OPERATION_RESULT_SUCCEEDED" && i.reason === t.reason), !0;
	} catch {
		return !1;
	}
}
function _a(e) {
	return oa(e) ? [
		"INVALID_ARGUMENT",
		"UNAUTHENTICATED",
		"PERMISSION_DENIED",
		"NOT_FOUND",
		"CONFLICT"
	].includes(String(e.error_code)) ? !0 : oa(e.response) && [
		401,
		403,
		422
	].includes(Number(e.response.status)) : !1;
}
var va = /* @__PURE__ */ new WeakMap();
function ya(e, t, n) {
	let r = va.get(e);
	if (r) return sa(ma(r.pending, t), "PENDING_EXISTS"), r.promise;
	let i = pa(e);
	sa(ma(i, t), "PENDING_CHANGED");
	let a = i.attempted, o = i.attempt + 1;
	sa(Number.isSafeInteger(o), "ATTEMPT_LIMIT"), e.setItem(aa, JSON.stringify({
		...i,
		attempted: !0,
		attempt: o
	}));
	let s = pa(e);
	sa(s?.attempt === o && ma(s, t), "PERSISTENCE_UNAVAILABLE");
	let c = Promise.resolve().then(async () => {
		try {
			let r = await n(t.body);
			return ma(pa(e), t) ? ga(r, t.body, t.operator_id, t.agent_id) ? (ha(e, t), {
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
			let r = pa(e);
			if (!ma(r, t)) return {
				status: "superseded",
				error: n
			};
			let i = oa(n) && n.client_request_id !== void 0 && n.client_request_id !== t.body.client_request_id;
			return !a && r.attempt === o && !i && _a(n) ? (ha(e, t), {
				status: "rejected",
				error: n
			}) : {
				status: "unknown",
				error: n
			};
		}
	}).finally(() => {
		va.get(e)?.promise === c && va.delete(e);
	});
	return va.set(e, {
		pending: t,
		promise: c
	}), c;
}
//#endregion
//#region src/prediction-config/agent/views/prediction/game-config/owner-mutation.ts
function ba(e) {
	Q(Zi(e), "IDENTITY_UNCONFIRMED");
}
var xa = "prediction.owner.pending.v1";
function Sa(e, t, n = []) {
	Q(t.every((t) => Object.hasOwn(e, t)) && Object.keys(e).every((e) => t.includes(e) || n.includes(e)), "PENDING_CORRUPT");
}
function Ca(e) {
	Q(Li(e), "PENDING_CORRUPT"), Sa(e, [
		"game_type",
		"symbol",
		"based_owner_revision",
		"changes",
		"client_request_id",
		"reason"
	], ["enabled", "based_on_public_version"]), Q(e.based_on_public_version === void 0 || e.enabled === !0 && Z(e.based_on_public_version, !0), "PENDING_CORRUPT"), Q(e.enabled === void 0 || typeof e.enabled == "boolean", "PENDING_CORRUPT"), Q(["UP_DOWN", "HIGH_LOW"].includes(String(e.game_type)) && ki(e.symbol, 64, !0) && ki(e.client_request_id, 128) && ki(e.reason, 500) && Z(e.based_owner_revision), "PENDING_CORRUPT"), Q(Array.isArray(e.changes) && (e.changes.length > 0 || e.enabled !== void 0) && e.changes.length <= 100 && new Set(e.changes.map((e) => e.duration_seconds)).size === e.changes.length, "PENDING_CORRUPT");
	for (let t of e.changes) Q(Li(t)), Sa(t, [
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
	]), Q(t.enabled === void 0 || typeof t.enabled == "boolean", "PENDING_CORRUPT"), e.game_type === "UP_DOWN" ? (Q(t.fixed_odds === void 0, "PENDING_CORRUPT"), (t.target_payout_rate !== void 0 || t.maximum_odds !== void 0) && Q(Qi(t.target_payout_rate) && Di(t.target_payout_rate, "1") <= 0 && Qi(t.maximum_odds) && Di(t.maximum_odds, "1") >= 0, "PENDING_CORRUPT")) : (Q(t.target_payout_rate === void 0 && t.maximum_odds === void 0, "PENDING_CORRUPT"), t.fixed_odds !== void 0 && Q(Qi(t.fixed_odds) && Di(t.fixed_odds, "1") > 0, "PENDING_CORRUPT")), Q(Z(t.duration_seconds, !0) && Z(t.based_rule_epoch, !0) && (e.game_type === "UP_DOWN" ? Ii.includes(t.duration_seconds) && ki(t.stake_tier_id) : t.stake_tier_id === ""), "PENDING_CORRUPT"), Q(Qi(t.minimum_stake) && Qi(t.maximum_stake) && Di(t.minimum_stake, t.maximum_stake) <= 0, "PENDING_CORRUPT");
}
function wa(e) {
	let t = e.getItem(xa);
	if (t === null) return null;
	Q(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return Q(Li(n)), Sa(n, [
		"schema",
		"operator_id",
		"agent_id",
		"body",
		"attempted",
		"attempt"
	], ["config_site_id", "kind"]), ba(n), Q(n.schema === (Xi(n) ? "scoped-owner-v1" : "owner-v1") && typeof n.attempted == "boolean" && Number.isSafeInteger(n.attempt) && Number(n.attempt) >= 0 && n.attempted === Number(n.attempt) > 0, "PENDING_CORRUPT"), Ca(n.body), Ri(n);
}
var Ta = (e, t) => !!e && e.operator_id === t.operator_id && e.agent_id === t.agent_id && e.config_site_id === t.config_site_id && e.kind === t.kind && e.schema === t.schema && JSON.stringify(e.body) === JSON.stringify(t.body);
function Ea(e, t, n) {
	ba(t), Ca(n), Q(wa(e) === null, "PENDING_EXISTS");
	let r = {
		schema: Xi(t) ? "scoped-owner-v1" : "owner-v1",
		operator_id: t.operator_id,
		agent_id: t.agent_id,
		...Xi(t) ? {
			config_site_id: t.config_site_id,
			kind: t.kind
		} : {},
		body: JSON.parse(JSON.stringify(n)),
		attempted: !1,
		attempt: 0
	};
	return e.setItem(xa, JSON.stringify(r)), Q(Ta(wa(e), r), "PERSISTENCE_UNAVAILABLE"), Ri(r);
}
function Da(e, t) {
	Ta(wa(e), t) && e.removeItem(xa);
}
function Oa(e, t) {
	try {
		if (Xi(t)) return ka(e, t);
		Q(Li(e) && Li(e.receipt)), ea(e.configuration, t);
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
			let i = n.game_type === "UP_DOWN" ? Yi(t.rule) : t.rule;
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
		].every((e) => typeof i[e] == "string")), Q(ki(i.operation_id, 256) && ki(i.trace_id, 256) && ki(i.target_id, 256) && Z(i.created_at_ms) && Z(i.completed_at_ms)), Q(i.operator_id === t.operator_id && i.client_request_id === n.client_request_id && i.reason === n.reason && i.source_service === "agent_admin"), Q(i.result === "OPERATION_RESULT_SUCCEEDED" && i.error_code === "" && i.action === "ADMIN_ACTION_OWNER_CONFIG_PUBLISH" && i.capability === "prediction.owner.config.publish" && i.target_type === "owner_config"), !0;
	} catch {
		return !1;
	}
}
function ka(e, t) {
	Q(Li(e) && Li(e.stored) && Li(e.receipt));
	let n = e.stored, r = e.receipt, i = t.body;
	Q(Li(n.key) && n.key.configSiteId === t.config_site_id && n.key.ownerAgentId === t.agent_id && n.key.gameType === i.game_type && n.key.symbol === i.symbol), Q(Z(n.revision, !0) && BigInt(n.revision) === BigInt(i.based_owner_revision) + 1n && Z(n.basedPublicVersion, !0) && Z(n.basedSiteRevision)), i.based_on_public_version !== void 0 && Q(n.basedPublicVersion === i.based_on_public_version), Q(n.basedSiteRevision === "0" == (t.kind === "SITE" || t.config_site_id === "0")), Q(typeof n.disabled == "boolean" && (i.enabled === void 0 || n.disabled === !i.enabled)), Q(Array.isArray(n.overrides) && n.overrides.length > 0 && n.overrides.length <= 100);
	let a = /* @__PURE__ */ new Map();
	for (let e of n.overrides) {
		Q(Li(e) && Li(e.key) && e.key.gameType === i.game_type && e.key.symbol === i.symbol && Number.isSafeInteger(e.key.durationSeconds) && Number(e.key.durationSeconds) > 0);
		let t = String(e.key.durationSeconds);
		Q(!a.has(t) && typeof e.enabled == "boolean" && Z(e.basedRuleEpoch, !0) && Li(e.bounds) && Li(e.odds)), Q(Qi(e.bounds.minimum) && Qi(e.bounds.maximum) && Di(e.bounds.minimum, e.bounds.maximum) <= 0), i.game_type === "UP_DOWN" ? Q(Ii.includes(t) && ki(e.stakeTierId) && Qi(e.odds.targetPayoutRate) && Di(e.odds.targetPayoutRate, "1") <= 0 && Qi(e.odds.maximumOdds) && Di(e.odds.maximumOdds, "1") >= 0 && e.odds.fixedOdds === void 0) : Q(e.stakeTierId === "" && Qi(e.odds.fixedOdds) && Di(e.odds.fixedOdds, "1") > 0 && e.odds.targetPayoutRate === void 0 && e.odds.maximumOdds === void 0), a.set(t, e);
	}
	for (let e of i.changes) {
		let t = a.get(e.duration_seconds);
		Q(t && Li(t.bounds) && Li(t.odds) && t.stakeTierId === e.stake_tier_id && t.basedRuleEpoch === e.based_rule_epoch && (e.enabled === void 0 || t.enabled === e.enabled)), Q(Di(String(t.bounds.minimum), e.minimum_stake) === 0 && Di(String(t.bounds.maximum), e.maximum_stake) === 0);
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
	].every((e) => typeof r[e] == "string")), Q(ki(r.operation_id, 256) && ki(r.trace_id, 256) && typeof r.target_id == "string" && /^[a-f0-9]{64}$/.test(r.target_id) && Z(r.created_at_ms) && Z(r.completed_at_ms)), Q(r.operator_id === t.operator_id && r.client_request_id === i.client_request_id && r.reason === i.reason && r.source_service === "agent_admin"), Q(r.result === "OPERATION_RESULT_SUCCEEDED" && r.error_code === "" && r.action === "ADMIN_ACTION_SCOPED_CONFIG_PUBLISH" && r.target_type === "scoped_owner_config" && r.capability === "prediction." + (t.kind === "SITE" ? "site" : "owner") + ".config.publish");
	let o = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(r.after_json), (e) => e.charCodeAt(0)))), s = (e) => Array.isArray(e) ? e.map(s) : Li(e) ? Object.fromEntries(Object.keys(e).sort().map((t) => [t, s(e[t])])) : e;
	return Q(JSON.stringify(s(o)) === JSON.stringify(s(n))), !0;
}
var Aa = /* @__PURE__ */ new WeakMap();
function ja(e, t, n) {
	let r = Aa.get(e);
	if (r) return Q(Ta(r.pending, t), "PENDING_EXISTS"), r.promise;
	let i = wa(e);
	Q(Ta(i, t), "PENDING_CHANGED");
	let a = i.attempted, o = i.attempt + 1;
	Q(Number.isSafeInteger(o), "ATTEMPT_LIMIT"), e.setItem(xa, JSON.stringify({
		...i,
		attempted: !0,
		attempt: o
	}));
	let s = wa(e);
	Q(s?.attempt === o && Ta(s, t), "PERSISTENCE_UNAVAILABLE");
	let c = Promise.resolve().then(async () => {
		try {
			let r = await n(t.body);
			return Ta(wa(e), t) ? Oa(r, t) ? (Da(e, t), {
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
			let r = wa(e);
			if (!Ta(r, t)) return {
				status: "superseded",
				error: n
			};
			let i = $e(n, t.body.client_request_id), s = !a && i !== "unverified" && _a(n);
			return r.attempt === o && (i === "rejected" || s) ? (Da(e, t), {
				status: "rejected",
				error: n
			}) : {
				status: "unknown",
				error: n
			};
		}
	}).finally(() => {
		Aa.get(e)?.promise === c && Aa.delete(e);
	});
	return Aa.set(e, {
		pending: t,
		promise: c
	}), c;
}
async function Ma(e, t, n, r) {
	let i = await ja(e, t, n);
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
var Na = "grid.config.pending.v1", Pa = /^(0|[1-9]\d*)(?:\.(\d+))?$/, Fa = /^[1-9]\d*$/, Ia = /^[A-Z0-9]{2,32}$/, La = [
	"site_id",
	"symbol",
	"based_on_layout_version",
	"based_on_site_version",
	"client_request_id",
	"reason",
	"changes"
], Ra = [
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
], za = [
	"based_on_config_id",
	"based_on_default_version",
	"based_on_default_resolution_epoch"
], Ba = [
	"price_band_width",
	"column_duration_seconds",
	"price_decimals"
], Va = [
	"enabled",
	"target_rtp",
	"min_multiplier",
	"max_multiplier",
	"min_order_amount",
	"max_order_amount"
];
function Ha(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function $(e, t = "INVALID_GRID_CONFIGURATION") {
	if (!e) throw Error(t);
}
function Ua(e, t) {
	$(Object.keys(e).length === t.length && Object.keys(e).every((e) => t.includes(e)), "PENDING_CORRUPT");
}
function Wa(e, t) {
	$(typeof e == "string" && e.length <= 128 && Pa.test(e), "INVALID_DECIMAL");
	let [n, r = ""] = e.split("."), i = n.replace(/^0+(?=\d)/, ""), a = r.replace(/0+$/, "");
	return $(t === void 0 || a.length <= t, "INVALID_DECIMAL"), a ? i + "." + a : i;
}
function Ga(e) {
	let [t, n = ""] = Wa(e).split(".");
	return {
		whole: t,
		fraction: n
	};
}
function Ka(e, t) {
	let n = Ga(e), r = Ga(t);
	if (n.whole.length !== r.whole.length) return n.whole.length > r.whole.length ? 1 : -1;
	if (n.whole !== r.whole) return n.whole > r.whole ? 1 : -1;
	let i = Math.max(n.fraction.length, r.fraction.length), a = n.fraction.padEnd(i, "0"), o = r.fraction.padEnd(i, "0");
	return a === o ? 0 : a > o ? 1 : -1;
}
function qa(e, t) {
	let { whole: n, fraction: r } = Ga(e), i = n + r, a = n.length + t, o;
	o = a <= 0 ? "0." + "0".repeat(-a) + i : a >= i.length ? i + "0".repeat(a - i.length) : i.slice(0, a) + "." + i.slice(a);
	let [s, c = ""] = o.split("."), l = s.replace(/^0+(?=\d)/, "") || "0", u = c.replace(/0+$/, "");
	return u ? l + "." + u : l;
}
function Ja(e) {
	let t = Wa(e);
	return $(Ka(t, "0") > 0 && Ka(t, "1") <= 0, "INVALID_RTP"), qa(t, 2);
}
function Ya(e) {
	let t = Wa(e);
	return $(Ka(t, "0") > 0 && Ka(t, "100") < 0, "INVALID_RTP"), qa(t, -2);
}
function Xa(e = globalThis.crypto) {
	$(e && typeof e.getRandomValues == "function", "SECURE_RANDOM_UNAVAILABLE");
	let t = e.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	$(t instanceof Uint8Array && t.length === 16, "SECURE_RANDOM_UNAVAILABLE"), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0")).join("");
	return `${n.slice(0, 8)}-${n.slice(8, 12)}-${n.slice(12, 16)}-${n.slice(16, 20)}-${n.slice(20)}`;
}
function Za(e) {
	return $(typeof e == "string" && Fa.test(e) && Ka(e, "25") <= 0, "INVALID_LAYOUT_DURATION"), e;
}
function Qa(e, t) {
	let n = Wa(e, t);
	return $(Ka(n, "0") > 0, "INVALID_LAYOUT_WIDTH"), n;
}
function $a(e) {
	return $(e === null || typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 18, "INVALID_LAYOUT_PRECISION"), e;
}
function eo(e) {
	return $(typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 8, "INVALID_LAYOUT_PRECISION"), e;
}
function to(e, t) {
	t != null && $((Wa(e).split(".")[1] ?? "").length <= t, "INVALID_LAYOUT_PRECISION");
}
function no(e, t) {
	$(5 + (Number(e) + 1) * Number(t) <= 30, "INVALID_LAYOUT_HORIZON");
}
function ro(e) {
	return $(Ha(e), "INVALID_GRID_LAYOUT"), Ua(e, [
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
	].every((e) => typeof e == "string" && e.length <= 128 && Fa.test(e)), "INVALID_GRID_LAYOUT"), $(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_LAYOUT"), $(typeof e.editable == "boolean", "INVALID_GRID_LAYOUT"), $(Array.isArray(e.affected_site_ids) && e.affected_site_ids.every((e) => typeof e == "string" && e.length > 0 && e.length <= 64 && e.trim() === e), "INVALID_GRID_LAYOUT"), $(new Set(e.affected_site_ids).size === e.affected_site_ids.length && (!e.editable || e.affected_site_ids.length > 0), "INVALID_GRID_LAYOUT"), {
		row_count: e.row_count,
		column_count: e.column_count,
		column_duration_seconds: e.column_duration_seconds,
		price_band_width: Qa(e.price_band_width),
		..."price_decimals" in e ? { price_decimals: $a(e.price_decimals) } : {},
		effective_from_ms: e.effective_from_ms,
		editable: e.editable,
		affected_site_ids: [...e.affected_site_ids]
	};
}
function io(e) {
	$(Ha(e), "INVALID_GRID_CONFIGURATION"), Ua(e, [
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
		..."config_id" in e ? Ra : [],
		...at.filter((t) => t in e),
		..."availability_version" in e ? ["availability_version"] : []
	]), $(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "INVALID_GRID_CONFIGURATION"), $(typeof e.symbol == "string" && Ia.test(e.symbol), "INVALID_GRID_CONFIGURATION"), $([e.layout_version, e.site_version].every((e) => typeof e == "string" && Fa.test(e)), "INVALID_GRID_CONFIGURATION"), $(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_CONFIGURATION"), $(typeof e.enabled == "boolean", "INVALID_GRID_CONFIGURATION");
	let t = {
		site_id: e.site_id,
		symbol: e.symbol,
		layout_version: e.layout_version,
		site_version: e.site_version,
		effective_from_ms: e.effective_from_ms,
		enabled: e.enabled,
		target_rtp: Wa(e.target_rtp),
		min_multiplier: Wa(e.min_multiplier, 2),
		max_multiplier: Wa(e.max_multiplier, 2),
		min_order_amount: Wa(e.min_order_amount, 8),
		max_order_amount: Wa(e.max_order_amount, 8)
	};
	if ($(Ka(t.target_rtp, "0") > 0 && Ka(t.target_rtp, "1") <= 0, "INVALID_GRID_CONFIGURATION"), $(Ka(t.min_multiplier, "1") >= 0 && Ka(t.max_multiplier, t.min_multiplier) >= 0, "INVALID_GRID_CONFIGURATION"), $(Ka(t.min_order_amount, "0") > 0 && Ka(t.max_order_amount, t.min_order_amount) >= 0, "INVALID_GRID_CONFIGURATION"), "config_id" in e) {
		for (let n of [
			"config_id",
			"default_config_id",
			"default_version",
			"default_resolution_epoch"
		]) $(typeof e[n] == "string" && Fa.test(e[n]) && Ka(e[n], "9223372036854775807") <= 0), t[n] = e[n];
		$(typeof e.requested_agent_id == "string" && /^(0|[1-9][0-9]*)$/.test(e.requested_agent_id) && Ka(e.requested_agent_id, "9223372036854775807") <= 0), $(e.agent_id === null || e.agent_id === e.requested_agent_id && e.agent_id !== "0"), t.requested_agent_id = e.requested_agent_id, t.agent_id = e.agent_id;
		for (let n of [
			"inherited",
			"default_enabled",
			"effective_enabled"
		]) $(typeof e[n] == "boolean"), t[n] = e[n];
		for (let n of [
			"default_target_rtp",
			"default_min_order_amount",
			"default_max_order_amount"
		]) t[n] = Wa(e[n]);
	}
	return "availability_version" in e && ($(typeof e.availability_version == "string" && /^(0|[1-9][0-9]*)$/.test(e.availability_version) && Ka(e.availability_version, "9223372036854775807") <= 0), t.availability_version = e.availability_version), Object.assign(t, dt(e, Wa)), "layout" in e && (t.layout = ro(e.layout)), t;
}
function ao(e, t, n) {
	let r = io(e);
	return $(r.site_id === t && r.symbol === n, "INVALID_GRID_TARGET"), r;
}
function oo(e, t, n, r, i, a = !1) {
	let o = io(e), s = io(t);
	$(o.site_id === s.site_id && o.symbol === s.symbol, "INVALID_GRID_TARGET"), $(typeof n == "string" && n.length <= 500 && n.trim().length > 0 && !n.includes("\0"), "INVALID_REASON"), $(typeof r == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(r), "INVALID_REQUEST_ID"), $(o.config_id && o.default_version && o.default_resolution_epoch, "CONFIG_IDENTITY_REQUIRED"), $(Ra.every((e) => o[e] === s[e]), "INVALID_GRID_TARGET"), $(JSON.stringify(dt(o, Wa)) === JSON.stringify(dt(s, Wa)), "INVALID_GRID_TARGET");
	let c = {};
	for (let e of Va) o[e] !== s[e] && (c[e] = s[e]);
	for (let e of Ba) o.layout?.[e] !== s.layout?.[e] && ($(a && o.layout?.editable && s.layout, "FIELD_FORBIDDEN"), c[e] = s.layout[e]);
	if (o.requested_agent_id !== "0" && !(c.enabled === !1 && Object.keys(c).length === 1) && ($(!s.enabled || o.default_enabled, "PLATFORM_LIMIT"), $(Ka(s.target_rtp, o.default_target_rtp) <= 0 && Ka(s.min_order_amount, o.default_min_order_amount) >= 0 && Ka(s.max_order_amount, o.default_max_order_amount) <= 0, "PLATFORM_LIMIT")), Ba.some((e) => e in c)) {
		let e = o.layout;
		"price_decimals" in c && eo(c.price_decimals), to(s.layout.price_band_width, s.layout.price_decimals), Qa(c.price_band_width ?? e.price_band_width, 18);
		let t = Za(c.column_duration_seconds ?? e.column_duration_seconds);
		$(Ka(e.row_count, "10000") <= 0 && Ka(e.column_count, "10000") <= 0 && Number(e.row_count) * Number(e.column_count) <= 1e4, "INVALID_GRID_LAYOUT"), no(e.column_count, t);
	}
	if (!i && ("min_multiplier" in c || "max_multiplier" in c)) throw Error("FIELD_FORBIDDEN");
	return $(Object.keys(c).length > 0, "EMPTY_CHANGES"), {
		site_id: o.site_id,
		symbol: o.symbol,
		based_on_layout_version: o.layout_version,
		based_on_site_version: o.site_version,
		based_on_config_id: o.config_id,
		...o.requested_agent_id === "0" && c.enabled === !0 && o.availability_version !== void 0 ? { based_on_availability_version: o.availability_version } : {},
		...ft(o) ? { based_on_global_version: ft(o) } : {},
		based_on_default_version: o.default_version,
		based_on_default_resolution_epoch: o.default_resolution_epoch,
		client_request_id: r,
		reason: n,
		changes: c
	};
}
function so(e) {
	if ($(Ha(e), "PENDING_CORRUPT"), Ua(e, [
		...La,
		..."based_on_config_id" in e ? za : [],
		..."based_on_global_version" in e ? ["based_on_global_version"] : [],
		..."based_on_availability_version" in e ? ["based_on_availability_version"] : []
	]), "based_on_availability_version" in e && $(typeof e.based_on_availability_version == "string" && /^(0|[1-9][0-9]*)$/.test(e.based_on_availability_version) && Ka(e.based_on_availability_version, "9223372036854775807") <= 0 && Ha(e.changes) && e.changes.enabled === !0, "PENDING_CORRUPT"), "based_on_global_version" in e && $(typeof e.based_on_global_version == "string" && /^(0|[1-9][0-9]*)$/.test(e.based_on_global_version) && Ka(e.based_on_global_version, "9223372036854775807") <= 0, "PENDING_CORRUPT"), "based_on_config_id" in e) for (let t of za) $(typeof e[t] == "string" && Fa.test(e[t]) && Ka(e[t], "9223372036854775807") <= 0, "PENDING_CORRUPT");
	$(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "PENDING_CORRUPT"), $(typeof e.symbol == "string" && Ia.test(e.symbol), "PENDING_CORRUPT"), $(typeof e.based_on_layout_version == "string" && Fa.test(e.based_on_layout_version), "PENDING_CORRUPT"), $(typeof e.based_on_site_version == "string" && Fa.test(e.based_on_site_version), "PENDING_CORRUPT"), $(typeof e.client_request_id == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(e.client_request_id), "PENDING_CORRUPT"), $(typeof e.reason == "string" && e.reason.length <= 500 && e.reason.trim().length > 0 && !e.reason.includes("\0"), "PENDING_CORRUPT"), $(Ha(e.changes) && Object.keys(e.changes).length > 0 && Object.keys(e.changes).every((e) => [...Va, ...Ba].includes(e)), "PENDING_CORRUPT");
	for (let [t, n] of Object.entries(e.changes)) t === "enabled" ? $(typeof n == "boolean", "PENDING_CORRUPT") : t === "price_decimals" ? eo(n) : t === "price_band_width" ? Qa(n, 18) : t === "column_duration_seconds" ? Za(n) : Wa(n, t.includes("order_amount") ? 8 : t.includes("multiplier") ? 2 : void 0);
}
function co(e) {
	if (e && typeof e == "object") {
		Object.freeze(e);
		for (let t of Object.values(e)) co(t);
	}
	return e;
}
function lo(e, t) {
	return !!e && JSON.stringify(e) === JSON.stringify(t);
}
function uo(e) {
	let t = e.getItem(Na);
	if (t === null) return null;
	$(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return $(Ha(n), "PENDING_CORRUPT"), Ua(n, [
		"schema",
		"operator_id",
		"command"
	]), $(n.schema === 1 && typeof n.operator_id == "string" && Fa.test(n.operator_id), "PENDING_CORRUPT"), so(n.command), co(n);
}
function fo(e, t, n) {
	$(Fa.test(t), "IDENTITY_UNCONFIRMED"), $(uo(e) === null, "PENDING_EXISTS"), so(n);
	let r = {
		schema: 1,
		operator_id: t,
		command: JSON.parse(JSON.stringify(n))
	};
	e.setItem(Na, JSON.stringify(r));
	let i = uo(e);
	return $(lo(i, r), "PERSISTENCE_UNAVAILABLE"), i;
}
function po(e, t) {
	return $(Fa.test(e), "IDENTITY_UNCONFIRMED"), so(t), co({
		operator_id: e,
		command: structuredClone(t)
	});
}
function mo(e, t, n, r) {
	return so(t.command), so(r), $(t.operator_id === n && JSON.stringify(t.command) === JSON.stringify(r), "STALE_CONFIRMATION"), fo(e, t.operator_id, t.command);
}
function ho(e, t) {
	let n = uo(e);
	return n ? n.operator_id === t ? {
		status: "bound",
		pending: n
	} : {
		status: "foreign",
		pending: n
	} : { status: "none" };
}
function go(e, t) {
	return Ha(e) ? e.operation_status === "SUCCEEDED" && typeof e.operation_id == "string" && Fa.test(e.operation_id) && e.site_id === t.command.site_id && e.symbol === t.command.symbol && typeof e.layout_version == "string" && Fa.test(e.layout_version) && typeof e.site_version == "string" && Fa.test(e.site_version) && typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms) && typeof e.changed == "boolean" && [
		"PENDING",
		"DONE",
		"NOT_REQUIRED"
	].includes(String(e.cache_state)) : !1;
}
function _o(e) {
	return Ha(e) && e.error_code === "RECEIPT_UNCONFIRMED" && e.operation_status === "UNKNOWN";
}
async function vo(e, t, n, r) {
	$(lo(uo(e), t), "PENDING_CHANGED");
	try {
		let i = await r(n === "recover" ? "save" : n, structuredClone(t.command));
		return go(i, t) ? (lo(uo(e), t) && e.removeItem(Na), {
			status: "success",
			value: i
		}) : {
			status: "unknown",
			error: /* @__PURE__ */ Error("INVALID_RECEIPT")
		};
	} catch (r) {
		if ((Ha(r) ? r.operation_status : void 0) === "FAILED" && (n === "save" || n === "recover" && Ha(r) && r.error_code === "VERSION_CONFLICT")) {
			let n = lo(uo(e), t);
			return n && e.removeItem(Na), {
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
var yo = class {
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
function bo(e, t) {
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
function xo(e, t, n = !1) {
	return So(e.filter((e) => n || e.default_enabled).map((e) => ({
		...e,
		configured: !0
	})), t);
}
function So(e, t, n = (e) => !!e.enabled) {
	let r = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.trim().toUpperCase();
		r.has(t) || r.set(t, r.size);
	}
	return [...e].sort((e, t) => Number(n(t)) - Number(n(e)) || (r.get(e.symbol) ?? 2 ** 53 - 1) - (r.get(t.symbol) ?? 2 ** 53 - 1) || e.symbol.localeCompare(t.symbol));
}
//#endregion
//#region src/prediction-config/agent/views/grid/config/index.vue?vue&type=script&setup=true&lang.ts
var Co = {
	class: "grid-config",
	"data-grid-config": "agent"
}, wo = { key: 3 }, To = {
	key: 5,
	class: "pending-bar"
}, Eo = { class: "pending-actions" }, Do = { class: "grid-layout" }, Oo = { class: "symbol-panel" }, ko = { class: "panel-heading" }, Ao = {
	key: 1,
	class: "directory-error",
	role: "alert"
}, jo = { class: "symbol-list" }, Mo = ["disabled", "onClick"], No = {
	key: 0,
	class: "symbol-unconfigured"
}, Po = { key: 2 }, Fo = { class: "config-panel" }, Io = { class: "config-heading" }, Lo = { "data-config-updated-at": "" }, Ro = { key: 0 }, zo = { class: "config-heading__actions" }, Bo = {
	key: 0,
	class: "parameter-description"
}, Vo = {
	key: 0,
	class: "parameter-card",
	"data-price-precision": ""
}, Ho = { class: "fields" }, Uo = { class: "parameter-card" }, Wo = { class: "fields odds-fields" }, Go = { key: 0 }, Ko = { key: 1 }, qo = { class: "parameter-card" }, Jo = { class: "parameter-heading" }, Yo = { class: "parameter-description" }, Xo = { class: "fields limit-fields" }, Zo = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "index",
	props: { actor: {} },
	setup(t, { expose: n }) {
		let { initializeGridSite: l, initializeGridMerchant: f, gridConfigSymbols: ee, gridConfigCatalog: p, gridConfigReceipt: m, gridConfigSite: h, saveGridConfig: g } = pe().grid, re = he(), ie = t, y = i(() => ie.actor?.kind === "SITE"), b = () => bo(sessionStorage, ie.actor), x = me(), C = (e) => x.perms.includes("*") || x.perms.includes(e), oe = i(() => C("prediction_config:lists") && (!y.value || x.userInfo.can_manage_prediction_config === !0 && ie.actor?.operator_id === String(x.userInfo.id))), E = oe, D = i(() => {
			let e = String(x.userInfo.id || "");
			return /^[1-9]\d*$/.test(e) ? e : "";
		}), A = i(() => `${D.value}:${x.token ?? ""}:${ie.actor?.kind ?? ""}:${ie.actor?.tenant_id ?? ""}:${ie.actor?.config_site_id ?? ""}`), j = v([]), M = v(""), N = v(""), ce = v(""), F = v(null), I = v(null), L = v(""), R = v("通过预测网格配置页面保存配置"), B = v(!1), V = v(!1), H = v(!1), U = v(!1), W = v(!1), G = v(""), K = v(""), q = v("info"), fe = v(null), _e = v(!1), ve = v(""), ye = v(!1), be = new yo(), xe = new yo(), Se = new yo(), J, Y = 0, Ce = i(() => oe.value ? D.value ? "" : "无法确认当前操作人身份" : "当前账号没有预测网格配置查询权限"), we = i(() => j.value.find((e) => e.site_id === M.value)), Te = i(() => y.value && we.value?.can_edit_limits === !0), Ee = v([]), De = v(""), Oe = i(() => xo(we.value?.products ?? [], Ee.value, y.value)), ke = i(() => {
			let e = ce.value.trim().toUpperCase();
			return Oe.value.filter((t) => !e || t.symbol.includes(e));
		}), Ae = i(() => {
			if (!F.value || !I.value) return !1;
			try {
				return Ja(F.value.target_rtp) !== L.value || [
					"enabled",
					"min_multiplier",
					"max_multiplier",
					"min_order_amount",
					"max_order_amount"
				].some((e) => F.value[e] !== I.value[e]);
			} catch {
				return !0;
			}
		}), je = i(() => fe.value ? fe.value.operator_id === D.value ? "bound" : "foreign" : "none"), Me = i(() => je.value === "bound" ? fe.value : null), Ne = i(() => je.value === "foreign"), Pe = i(() => Ae.value || !!fe.value || W.value), Fe = i(() => oe.value && E.value && !!we.value?.can_edit && !!D.value && !!F.value && !fe.value && !_e.value && !U.value && !W.value), Ie = i(() => !!Me.value && oe.value && E.value && j.value.some((e) => e.site_id === Me.value.command.site_id && e.can_edit)), Le = i(() => Ie.value && V.value && !H.value && !U.value && !W.value && !_e.value && !ye.value && ve.value === JSON.stringify(Me.value));
		function Re(e) {
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
		let ze = i(() => {
			let e = [F.value?.effective_from_ms, F.value?.layout?.effective_from_ms].filter((e) => typeof e == "string" && /^[1-9][0-9]*$/.test(e)).reduce((e, t) => BigInt(e) > BigInt(t) ? e : t, "0");
			return e === "0" ? "未提供" : Oi(e);
		});
		function Be(e) {
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
			return e.sites.filter((e) => !y.value || e.site_id === ie.actor?.config_site_id).map((e) => ({
				...e,
				products: e.products.filter((e) => y.value || e.default_enabled)
			}));
		}
		function Ve() {
			try {
				let e = ho(b(), D.value);
				fe.value = e.pending ?? null, _e.value = !1;
			} catch {
				_e.value = !0, fe.value = null;
			}
		}
		function He() {
			return `${A.value}:${M.value}:${N.value}`;
		}
		function Ue() {
			xe.close(), F.value = null, I.value = null, L.value = "", R.value = "通过预测网格配置页面保存配置", U.value = !1;
		}
		async function We(e) {
			if (V.value = !1, be.close(), Se.close(), ve.value = "", Ue(), j.value = [], Ee.value = [], De.value = "", M.value = "", N.value = "", ce.value = "", G.value = "", K.value = "", Ve(), Ce.value || _e.value) return;
			let t = be.next(A.value);
			H.value = !0;
			try {
				if (y.value) {
					if (!l || !ie.actor?.config_site_id) throw Error("SITE_UNAVAILABLE");
					Me.value || await l(ie.actor.config_site_id, t.signal);
				} else await f(t.signal);
				if (!t.current(A.value)) return;
				let [n, r] = await Promise.allSettled([p(t.signal), ee(t.signal)]);
				if (!t.current(A.value)) return;
				if (r.status === "fulfilled" && Array.isArray(r.value) && r.value.every((e) => typeof e == "string") ? Ee.value = r.value : De.value = "通用币种目录暂不可用，当前仅显示已授权的网格配置。", n.status === "rejected") throw n.reason;
				j.value = Be(n.value), V.value = !0;
				let i = Me.value ?? (e ? { command: e } : null), a = i && j.value.some((e) => e.site_id === i.command.site_id) ? i.command.site_id : j.value[0]?.site_id || "";
				M.value = a;
				let o = j.value.find((e) => e.site_id === a), s = i && i.command.site_id === a && o?.products.some((e) => e.symbol === i.command.symbol) ? i.command.symbol : Oe.value.find((e) => e.configured)?.symbol || "";
				N.value = s, s && (J = qe());
			} catch (e) {
				t.current(A.value) && (G.value = Re(e));
			} finally {
				t.current(A.value) && (H.value = !1);
			}
		}
		function Ge(e) {
			Pe.value || (Ue(), M.value = e, N.value = Oe.value.find((e) => e.configured)?.symbol || "", N.value && (J = qe()));
		}
		function Ke(e) {
			e === N.value || Pe.value || !we.value?.products.some((t) => t.symbol === e) || (Ue(), N.value = e, J = qe());
		}
		async function qe() {
			if (Ue(), !oe.value || !M.value || !N.value) return;
			let e = M.value, t = N.value, n = He(), r = xe.next(n);
			U.value = !0;
			try {
				let n = await h(e, t, r.signal);
				if (!r.current(He())) return;
				let i = ao(n, e, t);
				if (y.value && i.requested_agent_id !== "0") throw Error("CONFIG_IDENTITY_REQUIRED");
				F.value = i, I.value = structuredClone(i), L.value = Ja(i.target_rtp);
			} catch (e) {
				r.current(He()) && (G.value = Re(e));
			} finally {
				r.current(He()) && (U.value = !1);
			}
		}
		function Je(e) {
			return e.symbol === N.value && I.value ? I.value.enabled && (y.value || I.value.default_enabled !== !1) : e.enabled;
		}
		function Ye(e) {
			return !y.value && e.symbol === N.value && F.value?.default_enabled === !1 || !we.value?.products.some((t) => t.symbol === e.symbol) || !E.value || !we.value?.can_edit || U.value || W.value || !!fe.value || _e.value || Ae.value && e.symbol !== N.value;
		}
		async function Xe(e, t) {
			typeof t != "boolean" || Ye(e) || (e.symbol !== N.value && (Ke(e.symbol), await J), I.value && I.value.symbol === e.symbol && !Ye(e) && (I.value.enabled = t, Ze()));
		}
		function Ze() {
			K.value = "";
		}
		async function Qe() {
			if (!Fe.value || !F.value || !I.value || !D.value) return;
			let e;
			try {
				e = oo(F.value, {
					...I.value,
					target_rtp: Ya(L.value)
				}, R.value, Xa(), Te.value, !1);
			} catch (e) {
				q.value = "warning", K.value = Re(e);
				return;
			}
			let t = po(D.value, e);
			try {
				await z.confirm(`确认保存 ${e.site_id} / ${e.symbol} 的 ${Object.keys(e.changes).length} 项修改？`, "确认预测网格配置", {
					type: "warning",
					confirmButtonText: "确认保存",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			}
			if (Ve(), !Fe.value || !F.value || !I.value) {
				q.value = "warning", K.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let n;
			try {
				n = oo(F.value, {
					...I.value,
					target_rtp: Ya(L.value)
				}, R.value, t.command.client_request_id, Te.value, !1);
			} catch {
				q.value = "warning", K.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let r;
			try {
				r = mo(b(), t, D.value, n), Ve();
			} catch (e) {
				if (e?.message === "STALE_CONFIRMATION") {
					q.value = "warning", K.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
					return;
				}
				_e.value = !0;
				return;
			}
			tt(r, "save");
		}
		async function $e() {
			Ve(), !(!Me.value || !Ie.value || W.value || ye.value) && tt(Me.value, "receipt");
		}
		async function et() {
			if (Ve(), !Le.value || !Me.value) return;
			let e = Me.value;
			ye.value = !0;
			try {
				await z.confirm(`确认恢复 ${e.command.site_id} / ${e.command.symbol} 的原请求 ${e.command.client_request_id}？将沿用原编号和原参数；已提交则返回原回执，尚未提交则保存原配置，不使用当前页面的新修改。`, "恢复原配置请求", {
					type: "warning",
					confirmButtonText: "确认恢复",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			} finally {
				ye.value = !1;
			}
			if (Ve(), !Le.value || JSON.stringify(e) !== JSON.stringify(Me.value)) {
				q.value = "warning", K.value = "确认期间账号、权限或原请求已变化，本次恢复已取消，请重新查询原操作回执";
				return;
			}
			await tt(e, "recover");
		}
		async function tt(e, t) {
			let n = ++Y, r = He(), i = Se.next(r);
			W.value = !0, ve.value = "", K.value = "";
			try {
				let n = await vo(b(), e, t, (e, t) => e === "save" ? g(t) : m(t));
				if (!i.current(He())) return;
				if (Ve(), n.status === "success") {
					let e = D.value;
					R.value = "通过预测网格配置页面保存配置", W.value = !1, await We(), e === D.value && (q.value = "warning", K.value = G.value ? "配置已保存；最新配置刷新失败，请手动刷新" : "");
				} else if (t === "recover" && n.status === "rejected" && n.error?.error_code === "VERSION_CONFLICT") if (!n.journalCleared || fe.value || _e.value) q.value = "warning", K.value = "旧请求已明确拒绝，但本机待确认记录已变化，请重新核对当前记录";
				else {
					let t = D.value;
					if (await We(e.command), M.value && N.value && J && await J, t === D.value) {
						q.value = "warning";
						let t = M.value === e.command.site_id && N.value === e.command.symbol && j.value.some((t) => t.site_id === e.command.site_id && t.products.some((t) => t.symbol === e.command.symbol));
						K.value = "旧请求未生效，配置版本已变化；已清除旧待确认记录。" + (t ? G.value || !F.value ? "最新配置刷新失败，请手动刷新" : "请以当前配置为准" : `原目标当前不可见（${e.command.site_id} / ${e.command.symbol}），请核对权限和配置`);
					}
				}
				else q.value = n.status === "unknown" ? "warning" : "info", t === "receipt" && _o(n.error) && JSON.stringify(Me.value) === JSON.stringify(e) ? (ve.value = JSON.stringify(e), K.value = "未找到原操作回执，可使用原编号和原参数恢复请求") : t === "recover" ? K.value = "恢复尚未确认，原请求已保留，请重新查询原操作回执 · " + Re(n.error) : K.value = n.status === "unknown" ? "原操作结果仍待确认，请使用原请求查询回执" : "保存已明确拒绝，可修正后重新提交 · " + Re(n.error);
			} catch (e) {
				i.current(He()) && (Ve(), q.value = "warning", K.value = "原操作结果仍待确认 · " + Re(e));
			} finally {
				n === Y && (W.value = !1, Ve());
			}
		}
		async function nt() {
			if (!Pe.value) return !0;
			try {
				return await z.confirm("当前有未保存修改或待确认操作，离开不会删除原记录。仍要离开吗？", "离开预测网格配置", { type: "warning" }), !0;
			} catch {
				return !1;
			}
		}
		function rt() {
			return JSON.stringify({
				operator: D.value,
				site: M.value,
				symbol: N.value,
				snapshot: F.value,
				draft: I.value,
				rtp: L.value,
				reason: R.value
			});
		}
		async function it() {
			if (!W.value) {
				if (Ae.value) {
					let e = rt();
					try {
						await z.confirm("刷新会丢弃当前未保存修改，仍要刷新吗？", "刷新预测网格配置", { type: "warning" });
					} catch {
						return;
					}
					if (W.value || e !== rt()) {
						q.value = "warning", K.value = "确认期间编辑状态已变化，本次刷新已取消";
						return;
					}
				}
				await We();
			}
		}
		function at(e) {
			Pe.value && (e.preventDefault(), e.returnValue = "");
		}
		return se(() => [
			A.value,
			oe.value,
			E.value
		], () => We(), { immediate: !0 }), ge(nt), window.addEventListener("beforeunload", at), ne(() => {
			ve.value = "", V.value = !1, be.close(), xe.close(), Se.close(), window.removeEventListener("beforeunload", at);
		}), n({
			hasBlockingWork: Pe,
			confirmLeave: nt,
			refresh: it,
			loading: H
		}), (t, n) => (_(), s("section", Co, [
			Ce.value ? (_(), a(w(O), {
				key: 0,
				title: Ce.value,
				type: "warning",
				closable: !1
			}, null, 8, ["title"])) : _e.value ? (_(), a(w(O), {
				key: 1,
				title: "本机保存的待确认操作记录已损坏或不可用，请停止操作并联系管理员核验",
				type: "error",
				closable: !1
			})) : Ne.value ? (_(), a(w(O), {
				key: 2,
				title: "检测到其他账号尚未确认的预测网格配置操作，当前账号不可覆盖，请切回原账号查询回执",
				type: "error",
				closable: !1
			})) : o("", !0),
			G.value ? (_(), s("div", wo, [d(w(O), {
				title: G.value,
				type: "error",
				closable: !1
			}, null, 8, ["title"]), d(w(k), {
				loading: H.value || U.value,
				disabled: W.value || !!fe.value,
				onClick: it
			}, {
				default: T(() => [...n[9] ||= [u("重试", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"])])) : o("", !0),
			K.value ? (_(), a(w(O), {
				key: 4,
				title: K.value,
				type: q.value,
				closable: !1
			}, null, 8, ["title", "type"])) : o("", !0),
			Me.value ? (_(), s("div", To, [c("div", null, [n[10] ||= c("strong", null, "原配置操作结果待确认", -1), c("small", null, S(Me.value.command.site_id) + " · " + S(Me.value.command.symbol) + " · " + S(Me.value.command.client_request_id), 1)]), c("div", Eo, [d(w(k), {
				type: "warning",
				loading: W.value,
				disabled: !Ie.value || ye.value,
				onClick: $e
			}, {
				default: T(() => [...n[11] ||= [u("查询原操作回执", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"]), Le.value || ye.value ? (_(), a(w(k), {
				key: 0,
				type: "warning",
				disabled: !Le.value,
				onClick: et
			}, {
				default: T(() => [...n[12] ||= [u("恢复原请求", -1)]]),
				_: 1
			}, 8, ["disabled"])) : o("", !0)])])) : o("", !0),
			d(gn, {
				loading: H.value,
				"min-height": "0px",
				class: "grid-loading-region"
			}, {
				default: T(() => [c("div", Do, [c("aside", Oo, [
					c("div", ko, [n[13] ||= c("strong", null, "交易对配置", -1), c("span", null, S(ke.value.length) + " 条", 1)]),
					j.value.length > 1 ? (_(), a(w(ue), {
						key: 0,
						modelValue: M.value,
						"onUpdate:modelValue": n[0] ||= (e) => M.value = e,
						"aria-label": "选择站点",
						disabled: Pe.value,
						onChange: Ge
					}, {
						default: T(() => [(_(!0), s(r, null, ae(j.value, (e) => (_(), a(w(le), {
							key: e.site_id,
							label: e.site_id,
							value: e.site_id
						}, null, 8, ["label", "value"]))), 128))]),
						_: 1
					}, 8, ["modelValue", "disabled"])) : o("", !0),
					De.value ? (_(), s("p", Ao, [u(S(De.value), 1), d(w(k), {
						link: "",
						type: "primary",
						disabled: Pe.value,
						onClick: it
					}, {
						default: T(() => [...n[14] ||= [u("重试", -1)]]),
						_: 1
					}, 8, ["disabled"])])) : o("", !0),
					d(w(e), {
						modelValue: ce.value,
						"onUpdate:modelValue": n[1] ||= (e) => ce.value = e,
						clearable: "",
						placeholder: "搜索交易对",
						"aria-label": "搜索交易对"
					}, null, 8, ["modelValue"]),
					c("div", jo, [(_(!0), s(r, null, ae(ke.value, (e) => (_(), s("div", {
						key: e.symbol,
						class: te(["symbol-row", { active: e.symbol === N.value }])
					}, [
						c("button", {
							type: "button",
							class: "symbol-button",
							disabled: !e.configured || Pe.value && e.symbol !== N.value,
							onClick: (t) => Ke(e.symbol)
						}, [d(w(re), { symbol: e.symbol }, null, 8, ["symbol"])], 8, Mo),
						e.configured ? (_(), a(w(de), {
							key: 1,
							"model-value": Je(e),
							disabled: Ye(e),
							"aria-label": `${e.symbol} 开放配置`,
							onChange: (t) => Xe(e, t)
						}, null, 8, [
							"model-value",
							"disabled",
							"aria-label",
							"onChange"
						])) : (_(), s("span", No, "未配置")),
						e.symbol === N.value && Ae.value ? (_(), s("small", Po, "未保存")) : o("", !0)
					], 2))), 128)), !H.value && we.value && !ke.value.length ? (_(), a(w(P), {
						key: 0,
						description: "当前站点没有已授权的预测网格产品",
						"image-size": 56
					})) : o("", !0)])
				]), c("main", Fo, [!H.value && !j.value.length && !G.value ? (_(), a(w(P), {
					key: 0,
					description: "当前账号暂无授权站点"
				})) : we.value && !N.value ? (_(), a(w(P), {
					key: 1,
					description: "请选择交易对查看配置"
				})) : F.value && I.value ? (_(), s(r, { key: 2 }, [
					c("header", Io, [c("div", null, [
						c("h2", null, S(F.value.symbol) + " · 预测网格", 1),
						c("p", Lo, "更新时间 " + S(ze.value), 1),
						j.value.length > 1 ? (_(), s("p", Ro, "当前站点：" + S(F.value.site_id), 1)) : o("", !0)
					]), c("div", zo, [d(w(k), { onClick: n[2] ||= (e) => B.value = !0 }, {
						default: T(() => [...n[15] ||= [u("玩法说明", -1)]]),
						_: 1
					}), w(E) ? (_(), a(w(k), {
						key: 0,
						type: "primary",
						loading: W.value,
						disabled: !Fe.value || !Ae.value,
						onClick: Qe
					}, {
						default: T(() => [...n[16] ||= [u("保存配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])) : o("", !0)])]),
					F.value.requested_agent_id === "0" ? o("", !0) : (_(), s("p", Bo, S(F.value.inherited ? "当前继承所属站点配置" : "当前使用商户配置") + "；已有商户配置保持不变。平台返奖率上限 " + S(F.value.default_target_rtp ? `${w(Ja)(F.value.default_target_rtp)}%` : "—") + "，单笔范围 " + S(F.value.default_min_order_amount) + " ~ " + S(F.value.default_max_order_amount) + " USDT。", 1)),
					!y.value && F.value.default_enabled === !1 ? (_(), a(w(O), {
						key: 1,
						title: "平台已关闭此币种，商户不能开启",
						type: "info",
						closable: !1
					})) : o("", !0),
					d(gn, { loading: U.value }, {
						default: T(() => [
							F.value.layout ? (_(), s("article", Vo, [n[17] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "价格精度"), c("p", { class: "parameter-description" }, "由总后台统一设置，此处只读")], -1), c("div", Ho, [c("label", null, [c("span", null, "价格小数位：" + S(F.value.layout.price_decimals == null ? "未设置（沿用原规则）" : `${F.value.layout.price_decimals} 位`), 1)])])])) : o("", !0),
							c("article", Uo, [n[25] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "赔率配置"), c("p", { class: "parameter-description" }, "格子赔率按目标返奖率与命中概率动态计算")], -1), c("div", Wo, [
								c("label", null, [
									c("span", null, [n[18] ||= u("目标返奖率", -1), d(yn, {
										label: "目标返奖率",
										content: "例如 97%：命中概率为 20% 时，计算赔率为 4.85x。"
									})]),
									d(En, {
										"input-component": w(e),
										modelValue: L.value,
										"onUpdate:modelValue": n[3] ||= (e) => L.value = e,
										disabled: !Fe.value,
										inputmode: "decimal",
										onInput: Ze
									}, {
										append: T(() => [...n[19] ||= [u("%", -1)]]),
										_: 1
									}, 8, [
										"input-component",
										"modelValue",
										"disabled"
									]),
									n[20] ||= c("small", null, "例如 97%：命中概率为 20% 时，计算赔率为 4.85x", -1)
								]),
								Te.value ? (_(), s("label", Go, [n[22] ||= c("span", null, "最低赔率", -1), d(En, {
									"input-component": w(e),
									modelValue: I.value.min_multiplier,
									"onUpdate:modelValue": n[4] ||= (e) => I.value.min_multiplier = e,
									disabled: !Fe.value,
									inputmode: "decimal",
									onInput: Ze
								}, {
									append: T(() => [...n[21] ||= [u("x", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								])])) : o("", !0),
								Te.value ? (_(), s("label", Ko, [n[24] ||= c("span", null, "最高赔率", -1), d(En, {
									"input-component": w(e),
									modelValue: I.value.max_multiplier,
									"onUpdate:modelValue": n[5] ||= (e) => I.value.max_multiplier = e,
									disabled: !Fe.value,
									inputmode: "decimal",
									onInput: Ze
								}, {
									append: T(() => [...n[23] ||= [u("x", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								])])) : o("", !0)
							])]),
							c("article", qo, [c("header", Jo, [n[26] ||= c("h3", null, "下注限制", -1), c("p", Yo, S(F.value.symbol) + " 每个格子生成一笔独立订单", 1)]), c("div", Xo, [c("label", null, [c("span", null, [n[27] ||= u("最小下注金额", -1), d(yn, { label: "最小下注金额" })]), d(En, {
								"input-component": w(e),
								modelValue: I.value.min_order_amount,
								"onUpdate:modelValue": n[6] ||= (e) => I.value.min_order_amount = e,
								disabled: !Fe.value,
								inputmode: "decimal",
								onInput: Ze
							}, {
								append: T(() => [...n[28] ||= [u("USDT", -1)]]),
								_: 1
							}, 8, [
								"input-component",
								"modelValue",
								"disabled"
							])]), c("label", null, [c("span", null, [n[29] ||= u("最大下注金额", -1), d(yn, { label: "最大下注金额" })]), d(En, {
								"input-component": w(e),
								modelValue: I.value.max_order_amount,
								"onUpdate:modelValue": n[7] ||= (e) => I.value.max_order_amount = e,
								disabled: !Fe.value,
								inputmode: "decimal",
								onInput: Ze
							}, {
								append: T(() => [...n[30] ||= [u("USDT", -1)]]),
								_: 1
							}, 8, [
								"input-component",
								"modelValue",
								"disabled"
							])])])]),
							w(E) ? o("", !0) : (_(), a(w(O), {
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
}), [["__scopeId", "data-v-2768af6f"]]), Qo = {
	class: "prediction-config prediction-table-page",
	"data-prediction-page": "OWNER_CONFIG"
}, $o = {
	class: "game-tabs",
	"aria-label": "选择预测玩法"
}, es = {
	class: "game-choice-icon",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	"aria-hidden": "true"
}, ts = { class: "game-choice-content" }, ns = {
	key: 0,
	role: "alert"
}, rs = {
	key: 1,
	role: "alert"
}, is = {
	key: 3,
	class: "config-layout"
}, as = {
	class: "symbol-directory",
	"aria-label": "交易对配置"
}, os = {
	key: 0,
	role: "status"
}, ss = {
	key: 1,
	class: "catalog-error",
	role: "alert"
}, cs = { class: "symbol-list" }, ls = [
	"aria-pressed",
	"disabled",
	"onClick"
], us = ["title"], ds = { class: "symbol-all-control" }, fs = { key: 2 }, ps = { class: "config-content" }, ms = { class: "config-title" }, hs = { class: "config-title-actions" }, gs = {
	key: 0,
	class: "draft-label"
}, _s = {
	key: 0,
	role: "alert"
}, vs = {
	key: 1,
	role: "status"
}, ys = {
	key: 0,
	class: "config-note"
}, bs = {
	key: 1,
	class: "config-note",
	role: "alert"
}, xs = {
	key: 2,
	class: "config-note"
}, Ss = {
	key: 3,
	class: "config-note"
}, Cs = {
	key: 4,
	class: "config-note"
}, ws = { class: "parameter-card room-config" }, Ts = { class: "parameter-heading" }, Es = { class: "field-description" }, Ds = { class: "room-config-body" }, Os = { class: "parameter-cards" }, ks = {
	class: "parameter-card",
	"data-price-precision": !0
}, As = { class: "room-config-body" }, js = { class: "field-label" }, Ms = {
	key: 0,
	class: "config-note"
}, Ns = { class: "parameter-card" }, Ps = { class: "parameter-heading" }, Fs = { class: "field-description" }, Is = {
	key: 0,
	class: "limit-fields odds-fields"
}, Ls = {
	key: 1,
	class: "limit-fields"
}, Rs = { class: "parameter-card" }, zs = { class: "parameter-heading" }, Bs = { class: "field-description" }, Vs = { class: "limit-fields" }, Hs = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "OwnerConfig",
	props: { actor: {} },
	setup(t, { expose: n }) {
		let l = pe().api, { siteDirectorySymbols: f } = l, ee = he(), p = t, m = me(), h = i(() => Xi(p.actor)), g = i(() => !M.value || M.value.operator_id === p.actor.operator_id && M.value.agent_id === p.actor.agent_id && M.value.config_site_id === p.actor.config_site_id && M.value.kind === p.actor.kind);
		function re(e) {
			return e.symbol_available ?? (e.platform_enabled || p.actor.kind !== "SITE" && h.value && (e.enabled || !!e.blocked_reason));
		}
		let ie = [
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
		], y = v("UP_DOWN"), b = x([]), C = v(""), oe = v(""), E = v([]), D = v(!1), O = v(!1), A = v(""), j = v(""), M = x(null), N = v(!1), P = v(!1), ce = new ra(), I = !0, L = () => I && Zi(p.actor) && Ti(m.userInfo.id) === p.actor.operator_id && m.userInfo.can_manage_prediction_config === !0 && (m.perms.includes("*") || m.perms.includes("prediction_config:lists")), R = i(() => L() && !N.value && !P.value), z = i(() => b.value.find((e) => e.symbol === C.value && re(e))), le = v("35"), B = v(0), ue = i(() => E.value.filter((e) => e.owner_enabled && (h.value || e.platform_enabled))), V = i(() => ue.value.find((e) => e.duration_seconds === le.value)), H = i(() => E.value.map((e) => ({
			key: e.duration_seconds,
			label: `${e.observation_seconds}秒`,
			present: e.owner_enabled && (h.value || e.platform_enabled),
			allowed: e.platform_enabled
		})));
		function U(e, t) {
			if (!R.value || O.value || M.value || D.value) return;
			let n = E.value.find((t) => t.duration_seconds === e);
			!n || n.owner_enabled === t || t && !n.platform_enabled || (n.owner_enabled = t, le.value = t ? e : ue.value[0]?.duration_seconds ?? "");
		}
		function W(e) {
			let t = e.symbol === C.value ? ue.value.map((e) => e.observation_seconds) : e.rules.filter((e) => e.owner_enabled && (h.value || e.platform_enabled)).map((e) => y.value === "UP_DOWN" ? String(BigInt(e.rule.duration_seconds) - 30n) : e.rule.duration_seconds);
			return t.length ? t.map((e) => `${e}秒`).join(" · ") : "暂无房间";
		}
		let G = v(!0), K = () => JSON.stringify([G.value, E.value.map((e) => [
			e.minimum_stake,
			e.maximum_stake,
			e.owner_enabled,
			e.target_payout_rate,
			e.maximum_odds,
			e.fixed_odds
		])]), q = v(""), fe = i(() => K() !== q.value), ge = x(), _e = i(() => O.value || fe.value || !!M.value || y.value === "GRID" && !!ge.value?.hasBlockingWork);
		n({ hasBlockingWork: _e });
		let ve = v([]), ye = i(() => So(b.value.filter(re), ve.value, (e) => e.platform_enabled && e.enabled).filter((e) => e.symbol.includes(oe.value.trim().toUpperCase())));
		function be() {
			try {
				M.value = wa(localStorage), N.value = ["prediction.agent.pending.v1", "prediction.site.pending.v1"].some((e) => localStorage.getItem(e) !== null), P.value = !1;
			} catch {
				P.value = !0;
			}
		}
		function xe() {
			B.value++, E.value = z.value ? ta(z.value, p.actor) : [], G.value = z.value?.enabled ?? !0, ue.value.some((e) => e.duration_seconds === le.value) || (le.value = ue.value[0]?.duration_seconds ?? ""), q.value = K();
		}
		function Se(e) {
			_e.value || (C.value = e, j.value = "", xe());
		}
		function J(e) {
			_e.value || (y.value = e, Te());
		}
		function Y(e) {
			if (p.actor.kind !== "SITE") return l.ownerConfigurations(e);
			if (!l.scopedSiteConfigurations) throw Error("SITE_UNAVAILABLE");
			return l.scopedSiteConfigurations(p.actor.config_site_id, e);
		}
		function Ce(e, t) {
			if (p.actor.kind !== "SITE") return l.ownerConfiguration(e, t);
			if (!l.scopedSiteConfiguration) throw Error("SITE_UNAVAILABLE");
			return l.scopedSiteConfiguration(p.actor.config_site_id, e, t);
		}
		function we(e) {
			if (p.actor.kind !== "SITE") return l.saveOwnerConfiguration(e);
			if (!l.saveScopedSiteConfiguration) throw Error("SITE_UNAVAILABLE");
			return l.saveScopedSiteConfiguration(p.actor.config_site_id, e);
		}
		async function Te() {
			let e = y.value, t = ce.begin(p.actor, e, "");
			if (b.value = [], C.value = "", xe(), A.value = "", D.value = !1, !(!L() || e === "GRID")) {
				D.value = !0;
				try {
					let [n, r] = await Promise.all([Y(e), f()]);
					if (!ce.current(t, p.actor, y.value, "") || !L()) return;
					if (!Array.isArray(n.items) || new Set(n.items.map((e) => e.symbol)).size !== n.items.length) throw Error("INVALID_CATALOG");
					for (let t of n.items) if (ea(t, p.actor), t.game_type !== "GAME_TYPE_" + e) throw Error("WRONG_GAME");
					if (!Array.isArray(r) || !r.every((e) => typeof e == "string")) throw Error("INVALID_SYMBOL_DIRECTORY");
					ve.value = r, b.value = n.items, C.value = ye.value[0]?.symbol ?? "", xe();
				} catch {
					ce.current(t, p.actor, y.value, "") && L() && (A.value = "配置加载失败，请重试。");
				} finally {
					ce.current(t, p.actor, y.value, "") && (D.value = !1);
				}
			}
		}
		async function Ee() {
			if (be(), !R.value || O.value) return;
			let e = y.value, t = C.value;
			try {
				if (!M.value) {
					if (!z.value) return;
					M.value = Ea(localStorage, p.actor, na(z.value, p.actor, E.value, "通过玩法配置页面保存配置", zi(), G.value));
				}
				let n = M.value;
				if (!g.value) return;
				O.value = !0, j.value = "";
				let r = await Ma(localStorage, n, (e) => {
					if (!L() || !g.value) throw Error("IDENTITY_CHANGED");
					return we(e);
				}, async (e) => {
					if (!L()) throw Error("IDENTITY_CHANGED");
					let t = await Ce(e.game_type, e.symbol);
					if (ea(t.configuration, p.actor), t.configuration.symbol !== e.symbol || t.configuration.game_type !== "GAME_TYPE_" + e.game_type) throw Error("WRONG_CONFIGURATION");
					return t.configuration;
				});
				if (!L() || y.value !== e || C.value !== t) return;
				be(), r.status === "success" ? (j.value = r.refreshFailed ? "保存已成功，配置刷新失败，请重新打开页面查看；无需再次保存。" : "配置已保存并生效。", r.latest && r.latest.symbol === C.value && r.latest.game_type === "GAME_TYPE_" + y.value ? (b.value = b.value.map((e) => e.symbol === C.value ? r.latest : e), xe()) : (b.value = [], C.value = "", xe(), A.value = "保存已确认，请重试读取最新配置。")) : (j.value = r.status === "rejected" ? "保存未通过，请重新读取配置后调整。" : "暂未确认保存结果，请稍后使用原请求确认。", r.status === "rejected" && (A.value = "保存被拒绝，请读取最新配置后修改。"));
			} catch (e) {
				j.value = e instanceof Error && e.message === "SEPARATE_ENABLE" ? "请先关闭币种开关并保存参数，再单独开启币种。" : e instanceof Error && e.message === "NO_CHANGES" ? "配置没有变化。" : "无法保存，请检查金额、赔率范围及待确认请求。";
			} finally {
				O.value = !1;
			}
		}
		be();
		try {
			p.actor.kind === "SITE" && uo(bo(sessionStorage, p.actor)) && (y.value = "GRID");
		} catch {
			P.value = !0;
		}
		return Te(), se(() => [
			m.userInfo.id,
			m.token,
			m.userInfo.can_manage_prediction_config,
			m.perms.join("|"),
			p.actor.operator_id,
			p.actor.agent_id,
			p.actor.config_site_id,
			p.actor.kind
		], () => {
			ce.close(), b.value = [], E.value = [], q.value = "[]", C.value = "", j.value = "", be();
		}, { flush: "sync" }), ne(() => {
			I = !1, ce.close();
		}), (n, i) => (_(), s("section", Qo, [
			c("nav", $o, [(_(!0), s(r, null, ae(w(ie), (e) => (_(), a(w(k), {
				key: e.key,
				type: y.value === e.key ? "primary" : void 0,
				"aria-pressed": y.value === e.key,
				disabled: _e.value,
				onClick: (t) => J(e.key)
			}, {
				default: T(() => [(_(), s("svg", es, [e.key === "UP_DOWN" ? (_(), s(r, { key: 0 }, [i[8] ||= c("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}, null, -1), i[9] ||= c("path", { d: "m16 12-4-4-4 4M12 16V8" }, null, -1)], 64)) : e.key === "HIGH_LOW" ? (_(), s(r, { key: 1 }, [i[10] ||= c("path", { d: "m9 9 5 12 1.8-5.2L21 14Z" }, null, -1), i[11] ||= c("path", { d: "M7.2 2.2 8 5.1M5.1 8l-2.9-.8M14 4.1 12 6M6 12l-1.9 2" }, null, -1)], 64)) : (_(), s(r, { key: 2 }, [i[12] ||= c("rect", {
					x: "3",
					y: "3",
					width: "18",
					height: "18",
					rx: "2"
				}, null, -1), i[13] ||= c("path", { d: "M9 3v18M15 3v18M3 9h18M3 15h18" }, null, -1)], 64))])), c("span", ts, [c("strong", null, S(e.label), 1), c("small", null, S(e.description), 1)])]),
				_: 2
			}, 1032, [
				"type",
				"aria-pressed",
				"disabled",
				"onClick"
			]))), 128))]),
			N.value ? (_(), s("p", ns, "发现旧配置模式尚未确认的请求，已保留原请求。请联系管理员核对原操作回执后完成迁移，当前暂停新配置保存。")) : o("", !0),
			P.value ? (_(), s("p", rs, "无法读取或保全待确认请求，当前暂停配置保存。")) : o("", !0),
			y.value === "GRID" ? (_(), a(Zo, {
				key: 2,
				ref_key: "gridRef",
				ref: ge,
				actor: t.actor,
				class: "grid-mode"
			}, null, 8, ["actor"])) : (_(), s("div", is, [c("aside", as, [
				c("h3", null, [i[14] ||= u("交易对配置 ", -1), c("small", null, S(b.value.filter(re).length) + " 条", 1)]),
				d(w(e), {
					modelValue: oe.value,
					"onUpdate:modelValue": i[0] ||= (e) => oe.value = e,
					placeholder: "搜索币种",
					"aria-label": "搜索币种",
					clearable: ""
				}, null, 8, ["modelValue"]),
				D.value ? (_(), s("p", os, "正在加载配置…")) : o("", !0),
				A.value ? (_(), s("div", ss, [u(S(A.value) + " ", 1), d(w(k), {
					size: "small",
					disabled: O.value || !!M.value || D.value,
					onClick: Te
				}, {
					default: T(() => [...i[15] ||= [u("读取最新配置（放弃未保存修改）", -1)]]),
					_: 1
				}, 8, ["disabled"])])) : o("", !0),
				c("div", cs, [(_(!0), s(r, null, ae(ye.value, (e) => (_(), s("div", {
					key: e.symbol,
					class: te(["symbol-entry", { selected: e.symbol === C.value }])
				}, [c("button", {
					class: "symbol-option",
					"aria-pressed": e.symbol === C.value,
					disabled: _e.value,
					onClick: (t) => Se(e.symbol)
				}, [d(w(ee), { symbol: e.symbol }, null, 8, ["symbol"]), c("span", {
					class: "symbol-status",
					title: W(e)
				}, S(W(e)), 9, us)], 8, ls), c("div", ds, [d(w(de), {
					"aria-label": e.symbol === C.value ? "币种开关" : `${e.symbol} 币种开关`,
					modelValue: e.symbol === C.value ? G.value : e.enabled,
					disabled: e.symbol !== C.value || !R.value || O.value || !!M.value || (h.value ? !G.value && !e.can_enable : !e.platform_enabled),
					"onUpdate:modelValue": i[1] ||= (e) => G.value = !!e
				}, null, 8, [
					"aria-label",
					"modelValue",
					"disabled"
				])])], 2))), 128))]),
				!D.value && !A.value && !ye.value.length ? (_(), s("p", fs, "当前没有可用的交易对配置。")) : o("", !0)
			]), c("main", ps, [
				c("header", ms, [c("div", null, [c("h3", null, S(C.value || "请选择交易对") + " · " + S(y.value === "UP_DOWN" ? "涨跌预测" : "自选预测"), 1), c("p", null, S(t.actor.kind === "SITE" ? "当前白标生效" : "当前商户生效"), 1)]), c("div", hs, [fe.value ? (_(), s("span", gs, "有未保存修改")) : o("", !0), z.value || M.value ? (_(), a(w(k), {
					key: 1,
					type: "primary",
					loading: O.value,
					disabled: !R.value || O.value || !M.value && !fe.value || !!M.value && !g.value,
					onClick: Ee
				}, {
					default: T(() => [u(S(M.value ? "确认原保存结果" : "保存配置"), 1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : o("", !0)])]),
				M.value ? (_(), s("p", _s, "存在待确认操作（" + S(M.value.body.symbol) + "），请使用原请求确认结果。" + S(g.value ? "" : "该操作属于另一个账号或站点，需切回原范围处理。"), 1)) : o("", !0),
				j.value ? (_(), s("p", vs, S(j.value), 1)) : o("", !0),
				z.value ? (_(), s(r, { key: 2 }, [
					h.value ? (_(), s("p", ys, "已保存的开关、限额和赔率保持独立；上级默认值只用于新建配置，当前配置仍受上级启停和限额约束。")) : o("", !0),
					z.value.blocked_reason ? (_(), s("p", bs, "上级限制已变化，原配置已保留。请调整超出范围的参数后保存；也可以先关闭币种。")) : o("", !0),
					h.value && !z.value.platform_enabled ? (_(), s("p", xs, "上级已关闭此币种或房间；原配置已保留，当前不能交易。")) : o("", !0),
					h.value ? o("", !0) : (_(), s("p", Ss, "可关闭自己的币种或房间，并在平台范围内调整" + S(y.value === "UP_DOWN" ? "限额和目标返奖率，最高赔率使用平台配置" : "限额和赔率") + "。平台修改对应房间后，限额和赔率恢复平台值，您主动关闭的选择会保留。", 1)),
					G.value ? o("", !0) : (_(), s("p", Cs, "交易对已关闭；以下房间设置仍会保留。")),
					c("article", ws, [c("header", Ts, [i[16] ||= c("h4", null, "房间配置", -1), c("p", Es, S(C.value) + " · " + S(t.actor.kind === "SITE" ? "当前白标生效" : "当前商户生效"), 1)]), c("div", Ds, [
						i[17] ||= c("span", { class: "field-label" }, "支持周期", -1),
						d(Ln, {
							description: `${C.value} · ${y.value === "UP_DOWN" ? "涨跌预测" : "自选预测"}`,
							rooms: H.value,
							selected: le.value,
							disabled: !R.value || O.value || !!M.value || D.value,
							context: `${t.actor.operator_id}:${t.actor.agent_id}:${t.actor.config_site_id}:${y.value}:${C.value}:${B.value}`,
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
					c("div", Os, [c("article", ks, [i[20] ||= c("header", { class: "parameter-heading" }, [c("h4", null, "价格精度"), c("p", { class: "field-description" }, "由平台统一设置，此处只读")], -1), c("div", As, [c("p", js, "价格小数位：" + S(z.value.rules[0]?.rule.price_rule?.price_decimals === void 0 ? "未设置（沿用原规则）" : `${z.value.rules[0].rule.price_rule.price_decimals} 位`), 1), i[19] ||= c("p", { class: "config-note" }, "按所选位数截断，不四舍五入；旧订单保留原规则。", -1)])]), V.value ? (_(), s(r, { key: 0 }, [
						V.value.platform_enabled ? o("", !0) : (_(), s("p", Ms, "平台已关闭此房间，暂不能开启。")),
						c("article", Ns, [c("header", Ps, [c("h4", null, "赔率配置 · " + S(V.value.observation_seconds) + " 秒", 1), c("p", Fs, S(y.value === "UP_DOWN" ? "上涨/下跌赔率按资金池动态计算" : "下单时锁定当前周期固定赔率，上涨和下跌使用相同赔率。"), 1)]), y.value === "UP_DOWN" ? (_(), s("div", Is, [d(w(F), { label: `目标返奖率（平台上限 ${w(Sn)(V.value.platform_target_payout_rate, 2)}%，且必须小于 100%）` }, {
							default: T(() => [d(En, {
								"input-component": w(e),
								modelValue: V.value.target_payout_rate,
								"onUpdate:modelValue": i[3] ||= (e) => V.value.target_payout_rate = e,
								percentage: "",
								unit: "%",
								max: w(Sn)(V.value.platform_target_payout_rate, 2),
								disabled: !R.value || O.value || !!M.value,
								"aria-label": `${V.value.observation_seconds}秒目标返奖率`
							}, null, 8, [
								"input-component",
								"modelValue",
								"max",
								"disabled",
								"aria-label"
							])]),
							_: 1
						}, 8, ["label"]), o("", !0)])) : (_(), s("div", Ls, [d(w(F), { label: `固定赔率（平台上限 ${V.value.platform_fixed_odds}，且必须小于 2，含本金）` }, {
							default: T(() => [d(En, {
								"input-component": w(e),
								modelValue: V.value.fixed_odds,
								"onUpdate:modelValue": i[5] ||= (e) => V.value.fixed_odds = e,
								step: "0.01",
								min: "1.01",
								max: V.value.platform_fixed_odds,
								unit: "x",
								disabled: !R.value || O.value || !!M.value,
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
						c("article", Rs, [c("header", zs, [c("h4", null, "下注限制 · " + S(V.value.observation_seconds) + " 秒", 1), c("p", Bs, "平台单笔范围：" + S(V.value.platform_minimum) + " ~ " + S(V.value.platform_maximum) + " USDT。变更不影响已受理订单。", 1)]), c("div", Vs, [d(w(F), { label: "单笔最小额" }, {
							default: T(() => [d(En, {
								"input-component": w(e),
								modelValue: V.value.minimum_stake,
								"onUpdate:modelValue": i[6] ||= (e) => V.value.minimum_stake = e,
								min: V.value.platform_minimum,
								max: V.value.maximum_stake,
								disabled: !R.value || O.value || !!M.value,
								"aria-label": `${V.value.observation_seconds}秒单笔最小额`
							}, {
								append: T(() => [...i[21] ||= [u("USDT", -1)]]),
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
						}), d(w(F), { label: "单笔最大额" }, {
							default: T(() => [d(En, {
								"input-component": w(e),
								modelValue: V.value.maximum_stake,
								"onUpdate:modelValue": i[7] ||= (e) => V.value.maximum_stake = e,
								min: V.value.minimum_stake,
								max: V.value.platform_maximum,
								disabled: !R.value || O.value || !!M.value,
								"aria-label": `${V.value.observation_seconds}秒单笔最大额`
							}, {
								append: T(() => [...i[22] ||= [u("USDT", -1)]]),
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
}), [["__scopeId", "data-v-ae1538c1"]]), Us = class {
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
function Ws(e) {
	if (typeof e != "string" || !/^[A-Z0-9][A-Z0-9._-]{0,63}$/.test(e)) throw Error("INVALID_SYMBOL_DIRECTORY");
	return e;
}
function Gs(e, t) {
	let n = e?.configurations;
	if (!Array.isArray(n)) throw Error("INVALID_SYMBOL_DIRECTORY");
	return [...new Set(n.flatMap((e) => {
		if (!Array.isArray(e?.rules) || !e.rules.length) throw Error("INVALID_SYMBOL_DIRECTORY");
		return e.rules.flatMap((e) => {
			if (e.game_type !== `GAME_TYPE_${t}` || typeof e.enabled_by_default != "boolean") throw Error("INVALID_SYMBOL_DIRECTORY");
			let n = Ws(e.symbol);
			return e.enabled_by_default ? [n] : [];
		});
	}))];
}
function Ks(e, t, n, r = []) {
	let i = new Set(e.map(Ws)), a = new Set(t.map(Ws));
	n.forEach(Ws);
	let o = [...i].filter((e) => a.has(e)), s = new Set(r.map(Ws));
	return So([...o].map((e) => ({
		symbol: e,
		allowed: i.has(e),
		publicConfigured: a.has(e)
	})), n, (e) => s.has(e.symbol));
}
//#endregion
//#region src/prediction-config/agent/views/prediction/game-config/site-mutation.ts
var qs = "prediction.site.pending.v1";
function Js(e, t, n = []) {
	Q(t.every((t) => Object.hasOwn(e, t)) && Object.keys(e).every((e) => t.includes(e) || n.includes(e)), "PENDING_CORRUPT");
}
function Ys(e) {
	Q(Li(e), "PENDING_CORRUPT"), Js(e, [
		"site_id",
		"game_type",
		"symbol",
		"client_request_id",
		"reason",
		"based_on_public_version",
		"based_on_site_version",
		"enabled",
		"overrides"
	]), Q(ki(e.site_id, 128) && ["UP_DOWN", "HIGH_LOW"].includes(String(e.game_type)) && ki(e.symbol, 64, !0) && ki(e.client_request_id, 128) && ki(e.reason, 500), "PENDING_CORRUPT"), Q(Z(e.based_on_public_version, !0) && Z(e.based_on_site_version, !0) && typeof e.enabled == "boolean" && Array.isArray(e.overrides), "PENDING_CORRUPT");
	let t = e.game_type === "UP_DOWN";
	Q((t ? e.overrides.length === 5 : e.overrides.length > 0 && e.overrides.length <= 100) && new Set(e.overrides.map((e) => e.duration_seconds)).size === e.overrides.length, "PENDING_CORRUPT");
	for (let n of e.overrides) {
		if (Q(Li(n)), !t) {
			Js(n, ["duration_seconds"], [
				"enabled",
				"fixed_odds",
				"minimum_stake",
				"maximum_stake"
			]), Q(Z(n.duration_seconds, !0) && (!Object.hasOwn(n, "enabled") || typeof n.enabled == "boolean"), "PENDING_CORRUPT"), Gi(n);
			continue;
		}
		Js(n, ["duration_seconds", "stake_tiers"], ["enabled"]), Q(Ii.includes(String(n.duration_seconds)) && (!Object.hasOwn(n, "enabled") || typeof n.enabled == "boolean") && Array.isArray(n.stake_tiers) && n.stake_tiers.length === 1, "PENDING_CORRUPT");
		let e = n.stake_tiers[0];
		Q(Li(e)), Js(e, ["stake_tier_id"], ["enabled", "maximum_stake"]), Q(ki(e.stake_tier_id) && (!Object.hasOwn(e, "enabled") || typeof e.enabled == "boolean"), "PENDING_CORRUPT"), Q(!Object.hasOwn(e, "maximum_stake") || Ei(e.maximum_stake) && Di(e.maximum_stake, "1") >= 0, "PENDING_CORRUPT");
	}
}
function Xs(e) {
	let t = e.getItem(qs);
	if (t === null) return null;
	Q(t.length <= 32768, "PENDING_CORRUPT");
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error("PENDING_CORRUPT");
	}
	return Q(Li(n)), Js(n, [
		"schema",
		"operator_id",
		"agent_id",
		"body",
		"attempted",
		"attempt"
	]), Bi(n), Q(n.schema === "site-v1" && typeof n.attempted == "boolean" && Number.isSafeInteger(n.attempt) && Number(n.attempt) >= 0 && n.attempted === Number(n.attempt) > 0, "PENDING_CORRUPT"), Ys(n.body), Ri(n);
}
var Zs = (e, t) => !!e && e.operator_id === t.operator_id && e.agent_id === t.agent_id && JSON.stringify(e.body) === JSON.stringify(t.body);
function Qs(e, t, n) {
	Bi(t), Ys(n), Q(Xs(e) === null, "PENDING_EXISTS");
	let r = {
		schema: "site-v1",
		...t,
		body: JSON.parse(JSON.stringify(n)),
		attempted: !1,
		attempt: 0
	};
	return e.setItem(qs, JSON.stringify(r)), Q(Zs(Xs(e), r), "PERSISTENCE_UNAVAILABLE"), Ri(r);
}
function $s(e, t) {
	Zs(Xs(e), t) && e.removeItem(qs);
}
function ec(e, t) {
	try {
		Q(Li(e) && Li(e.receipt)), Ui(e.stored);
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
		].every((e) => typeof i[e] == "string")), Q(ki(i.operation_id, 256) && ki(i.trace_id, 256) && ki(i.target_id, 256) && Z(i.created_at_ms) && Z(i.completed_at_ms)), Q(i.operator_id === t.operator_id && i.client_request_id === n.client_request_id && i.reason === n.reason && i.source_service === "agent_admin"), Q(i.result === "OPERATION_RESULT_SUCCEEDED" && i.error_code === "" && i.action === "ADMIN_ACTION_SITE_CONFIG_PUBLISH" && i.capability === "prediction.site.config.publish" && i.target_type === "site_config"), !0;
	} catch {
		return !1;
	}
}
var tc = /* @__PURE__ */ new WeakMap();
function nc(e, t, n) {
	let r = tc.get(e);
	if (r) return Q(Zs(r.pending, t), "PENDING_EXISTS"), r.promise;
	let i = Xs(e);
	Q(Zs(i, t), "PENDING_CHANGED");
	let a = i.attempted, o = i.attempt + 1;
	Q(Number.isSafeInteger(o), "ATTEMPT_LIMIT"), e.setItem(qs, JSON.stringify({
		...i,
		attempted: !0,
		attempt: o
	}));
	let s = Xs(e);
	Q(s?.attempt === o && Zs(s, t), "PERSISTENCE_UNAVAILABLE");
	let c = Promise.resolve().then(async () => {
		try {
			let r = await n(t.body);
			return Zs(Xs(e), t) ? ec(r, t) ? ($s(e, t), {
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
			let r = Xs(e);
			if (!Zs(r, t)) return {
				status: "superseded",
				error: n
			};
			let i = Li(n) && n.client_request_id !== void 0 && n.client_request_id !== t.body.client_request_id;
			return !a && r.attempt === o && !i && _a(n) ? ($s(e, t), {
				status: "rejected",
				error: n
			}) : {
				status: "unknown",
				error: n
			};
		}
	}).finally(() => {
		tc.get(e)?.promise === c && tc.delete(e);
	});
	return tc.set(e, {
		pending: t,
		promise: c
	}), c;
}
async function rc(e, t, n, r) {
	let i = await nc(e, t, n);
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
var ic = {
	class: "prediction-config prediction-table-page",
	"data-prediction-page": "GAME_CONFIG"
}, ac = {
	class: "game-tabs",
	"aria-label": "选择预测玩法"
}, oc = {
	key: 1,
	role: "alert"
}, sc = {
	key: 2,
	class: "config-layout"
}, cc = ["aria-label"], lc = {
	key: 0,
	class: "catalog-error",
	role: "alert"
}, uc = {
	key: 1,
	role: "status"
}, dc = {
	key: 2,
	class: "catalog-error",
	role: "alert"
}, fc = {
	key: 3,
	role: "status"
}, pc = { class: "symbol-list" }, mc = [
	"data-symbol",
	"aria-pressed",
	"disabled",
	"onClick"
], hc = {
	key: 0,
	class: "symbol-status"
}, gc = {
	key: 1,
	class: "symbol-status"
}, _c = {
	key: 2,
	class: "symbol-status"
}, vc = {
	key: 3,
	class: "symbol-status"
}, yc = {
	key: 4,
	class: "symbol-status"
}, bc = {
	key: 5,
	class: "draft-label"
}, xc = {
	key: 0,
	class: "symbol-all-control"
}, Sc = { class: "config-content" }, Cc = { class: "config-title" }, wc = { class: "config-title-actions" }, Tc = {
	key: 0,
	class: "draft-label",
	"data-dirty": "true"
}, Ec = {
	key: 0,
	role: "status"
}, Dc = {
	key: 1,
	role: "alert"
}, Oc = {
	key: 2,
	role: "alert"
}, kc = { key: 3 }, Ac = { key: 1 }, jc = { key: 0 }, Mc = { key: 1 }, Nc = { key: 1 }, Pc = {
	key: 7,
	role: "status"
}, Fc = { key: 0 }, Ic = { key: 1 }, Lc = { key: 2 }, Rc = ["aria-label"], zc = [
	"data-room",
	"aria-pressed",
	"onClick"
], Bc = { class: "room-heading" }, Vc = { class: "room-switch" }, Hc = { key: 0 }, Uc = { class: "parameter-cards" }, Wc = {
	key: 0,
	class: "parameter-card"
}, Gc = { class: "parameter-facts" }, Kc = { class: "read-only-label" }, qc = {
	key: 1,
	class: "parameter-card"
}, Jc = { class: "parameter-facts" }, Yc = { "data-field": "fixed_odds" }, Xc = { class: "read-only-label" }, Zc = { class: "parameter-card" }, Qc = { class: "limit-fields" }, $c = { key: 0 }, el = { key: 1 }, tl = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "SiteConfig",
	setup(e) {
		let { siteDirectorySymbols: t, configurations: n, siteConfigurationTargets: l, siteConfiguration: f, saveSiteConfiguration: ee, saveConfiguration: p, configuration: m } = pe().api, h = he(), { t: g, te: re, locale: ie } = _e(), y = me(), b = new Us(), C = new Us(), oe = new Us(), E = new Us(), D = new Ji(), A = v("UP_DOWN"), M = x(), N = i(() => A.value === "HIGH_LOW" ? "HIGH_LOW" : "UP_DOWN"), P = i(() => ie.value === "en-US" ? W : G), ce = (e) => y.perms.includes("*") || y.perms.includes(e), F = i(() => ce("prediction_config:lists")), I = F, z = i(() => Ti(y.userInfo.id)), B = v(null), V = v([]), H = v(""), U = v(""), K = v(""), q = i(() => V.value.find((e) => e.site_id === H.value)?.games.find((e) => e.game_type === N.value)?.symbols ?? []), fe = v([]), ge = v([]), ve = v(""), ye = i(() => Ks(q.value, ge.value, fe.value, Object.keys(xe.value).filter((e) => ct(e) && (st(e) ?? 0) > 0))), be = i(() => ye.value.map((e) => e.symbol).filter((e) => e.toLowerCase().includes(K.value.toLowerCase()))), xe = v({}), Se = v({}), J = v(null), Y = v([]), Ce = v(!1), we = v("35"), Te = v("通过商户玩法配置页面保存配置"), Ee = v(""), De = v(!1), Oe = v(!1), ke = v(""), Ae = v(!1), je = v(!1), Me = v(""), Ne = v(""), Pe = v(!1), Fe = v(!1), Ie = x(null), Le = x(null), Re = x(null), ze, Be, Ve = 0, He = i(() => ie.value === "en-US" ? "Enabled" : "启用交易对"), Ue = i(() => Ie.value && B.value && Ie.value.operator_id === B.value.operator_id && Ie.value.agent_id === B.value.agent_id && Ie.value.body.site_id === H.value && Ie.value.body.game_type === N.value && Ie.value.body.symbol === U.value ? Ie.value : null), We = v(null), Ge = i(() => Le.value && We.value && Le.value.operator_id === z.value && Le.value.operator_id === We.value.operator_id && Le.value.agent_id === We.value.agent_id), Ke = i(() => F.value && I.value && B.value?.operator_id === z.value && !!J.value && (N.value === "UP_DOWN" ? Y.value.length === 5 : Y.value.length > 0) && !Me.value && !Ie.value && !Le.value && !Fe.value && !je.value && !Ae.value), qe = i(() => Y.value.find((e) => e.duration_seconds === we.value)), Je = i(() => J.value?.effective.rules.find((e) => e.duration_seconds === we.value)), Ye = () => JSON.stringify({
			enabled: Ce.value,
			rows: Y.value.map((e) => ({
				duration: e.duration_seconds,
				enabled: e.enabled,
				maximum: e.maximum_stake,
				minimum: e.minimum_stake,
				odds: e.fixed_odds
			})),
			reason: Te.value
		}), Xe = i(() => !!J.value && !!Ee.value && Ye() !== Ee.value);
		function Ze() {
			return B.value ? {
				...B.value,
				site_id: H.value,
				game_type: N.value,
				symbol: U.value,
				public_version: J.value?.effective.public_version ?? "",
				site_version: J.value?.stored.version ?? ""
			} : null;
		}
		function Qe() {
			Fe.value = !1;
			try {
				Ie.value = Xs(sessionStorage);
			} catch {
				Fe.value = !0;
			}
			try {
				Le.value = pa(sessionStorage);
			} catch {
				Fe.value = !0;
			}
		}
		function $e() {
			D.close(), Ne.value = "", Re.value = null, ze?.abort(), je.value = !1;
		}
		function et() {
			$e(), E.close(), J.value = null, Y.value = [], Ee.value = "", Te.value = "通过商户玩法配置页面保存配置", Me.value = "", Pe.value = !1, Ae.value = !1, Qe();
		}
		function tt(e) {
			Wi(e, H.value, U.value, N.value), J.value = e, Y.value = Ki(e), Ce.value = e.stored.enabled, xe.value[U.value] = e, Se.value[U.value] = "configured", Te.value = "通过商户玩法配置页面保存配置", Ee.value = Ye(), Qe();
		}
		function nt(e) {
			let t = e?.error_code;
			return t === "NOT_FOUND" ? "该交易对尚未配置，请联系管理员完成初始配置。" : t === "UNAVAILABLE" ? "站点配置暂不可用，请稍后刷新。" : t === "PERMISSION_DENIED" ? "当前账号无权访问该站点配置。" : g("predictionPages.loadFailed");
		}
		async function rt() {
			et(), oe.close(), Be = void 0, Oe.value = !1;
			let e = C.next(), t = z.value, n = y.token;
			if (B.value = null, We.value = null, b.close(), it(), V.value = [], fe.value = [], ge.value = [], ve.value = "", H.value = "", U.value = "", xe.value = {}, Se.value = {}, ke.value = "", De.value = !1, !(!F.value || !t)) {
				De.value = !0;
				try {
					let r = await l(e.signal);
					if (!e.current() || z.value !== t || y.token !== n) return;
					if (Vi(r), r.actor.operator_id !== t) throw Error("IDENTITY_UNCONFIRMED");
					B.value = r.actor, V.value = r.sites, Ie.value?.operator_id === t && Ie.value.agent_id === r.actor.agent_id && (A.value = Ie.value.body.game_type);
					let i = Ie.value?.operator_id === t ? r.sites.find((e) => e.site_id === Ie.value?.body.site_id)?.site_id : void 0;
					(i || r.sites.length === 1) && (H.value = i ?? r.sites[0].site_id);
				} catch (t) {
					e.current() && (ke.value = nt(t));
				} finally {
					e.current() && (De.value = !1);
				}
			}
		}
		async function it() {
			let e = b.next(), t = Le.value, n = z.value, r = y.token;
			if (!(!t || t.operator_id !== n || !F.value)) try {
				let i = await m(t.body.symbol, e.signal);
				if (!e.current() || z.value !== n || y.token !== r) return;
				la(i.configuration) === t.body.symbol && i.configuration.agent_id === t.agent_id && (We.value = {
					operator_id: t.operator_id,
					agent_id: t.agent_id
				});
			} catch {}
		}
		async function at() {
			et();
			let e = oe.next(), r = H.value, i = JSON.stringify(B.value), a = y.token, o = N.value, s = [...q.value];
			if (Be = void 0, xe.value = {}, Se.value = {}, fe.value = [], ge.value = [], ve.value = "", Oe.value = !1, A.value === "GRID" || !B.value || !r || !F.value) return;
			let c = () => e.current() && A.value !== "GRID" && F.value && y.token === a && H.value === r && N.value === o && i === JSON.stringify(B.value), l = /* @__PURE__ */ new Map(), u = {
				current: c,
				requests: l,
				read(t) {
					let n = l.get(t);
					return n || (n = f({
						site_id: r,
						game_type: o,
						symbol: t
					}, e.signal).then((e) => (Wi(e, r, t, o), e)), l.set(t, n)), n;
				}
			};
			Be = u;
			for (let e of s) Se.value[e] = "loading";
			let d = Ie.value?.body.game_type === o && Ie.value.body.site_id === r ? Ie.value.body.symbol : U.value, ee = s.includes(d) ? d : s[0] ?? "", p = Ie.value?.body.game_type === o && Ie.value.body.site_id === r && s.includes(Ie.value.body.symbol);
			U.value = p ? ee : "", p && ot(!0), Oe.value = !0;
			let m = Promise.allSettled([t(e.signal).then((e) => {
				Ks([], [], e), c() && (fe.value = e);
			}), n(e.signal, o).then((e) => {
				let t = Gs(e, o);
				if (c() && (ge.value = t, !p)) {
					let e = s.filter((e) => t.includes(e)), n = e.includes(ee) ? ee : e[0] ?? "";
					U.value === n ? ot(!0) : U.value = n;
				}
			})]).then((e) => {
				c() && e.some((e) => e.status === "rejected") && (ve.value = "平台币种目录未完整加载，请重试。");
			}), h = s.filter((e) => e !== ee);
			await Promise.all([m, ...Array.from({ length: Math.min(3, h.length) }, async () => {
				for (; c() && h.length;) {
					let e = h.shift();
					if (Se.value[e] !== "loading") continue;
					let t = u.read(e);
					try {
						let n = await t;
						if (!c() || l.get(e) !== t) continue;
						xe.value[e] = n, Se.value[e] = "configured";
					} catch (n) {
						if (!c() || l.get(e) !== t) continue;
						Se.value[e] = n?.error_code === "NOT_FOUND" ? "unconfigured" : "unavailable", l.delete(e);
					}
				}
			})]), c() && (Oe.value = !1);
		}
		async function ot(e = !1) {
			et();
			let t = E.next(), n = {
				site_id: H.value,
				game_type: N.value,
				symbol: U.value
			}, r = JSON.stringify(B.value), i = Be;
			if (we.value = "35", A.value === "GRID" || !F.value || !B.value || !n.site_id || !q.value.includes(n.symbol)) return;
			Ae.value = !0, e || i?.requests.delete(n.symbol);
			let a = e && i?.current() ? i.read(n.symbol) : f(n, t.signal);
			try {
				let e = await a;
				if (i?.current() && i.requests.get(n.symbol) === a && (xe.value[n.symbol] = e, Se.value[n.symbol] = "configured"), !t.current() || r !== JSON.stringify(B.value) || n.site_id !== H.value || n.game_type !== N.value || n.symbol !== U.value) return;
				tt(e), we.value = Y.value[0]?.duration_seconds ?? "";
			} catch (e) {
				if (i?.current() && i.requests.get(n.symbol) === a && (Se.value[n.symbol] = e?.error_code === "NOT_FOUND" ? "unconfigured" : "unavailable", i.requests.delete(n.symbol)), !t.current()) return;
				Pe.value = e?.error_code === "NOT_FOUND", Se.value[n.symbol] = Pe.value ? "unconfigured" : "unavailable", Me.value = nt(e);
			} finally {
				t.current() && i?.requests.get(n.symbol) === a && i.requests.delete(n.symbol), t.current() && (Ae.value = !1);
			}
		}
		function st(e) {
			let t = e === U.value ? J.value : xe.value[e];
			return t ? e === U.value && (N.value === "UP_DOWN" ? Y.value.length === 5 : Y.value.length > 0) ? Ce.value ? Y.value.filter((e) => e.enabled).length : 0 : t.effective.rules.filter((e) => e.enabled && (N.value === "HIGH_LOW" || e.stake_tiers.some((e) => !e.retired && e.enabled))).length : null;
		}
		function ct(e) {
			return e === U.value && J.value ? Ce.value : xe.value[e]?.stored.enabled ?? !1;
		}
		function lt(e) {
			return !Ke.value || Se.value[e] !== "configured" || e !== U.value && Xe.value;
		}
		function ut(e) {
			if (q.value.includes(e)) {
				if (e !== U.value && (Xe.value || je.value || Ie.value)) {
					R.warning("请先处理当前未保存修改或待确认操作");
					return;
				}
				U.value = e;
			}
		}
		async function dt(e, t) {
			if (typeof t != "boolean" || lt(e)) return;
			let n = JSON.stringify(B.value), r = H.value;
			e !== U.value && (U.value = e);
			let i = Ve;
			if (Ae.value) {
				let t = Be?.requests.get(e);
				if (t) try {
					await t;
				} catch {
					return;
				}
			}
			i !== Ve || n !== JSON.stringify(B.value) || r !== H.value || U.value !== e || !Ke.value || ($e(), Ce.value = t);
		}
		function ft() {
			B.value && H.value && U.value ? ot() : rt();
		}
		async function pt(e) {
			if (A.value !== e && !(A.value === "GRID" && M.value && !await M.value.confirmLeave())) {
				if (A.value !== "GRID" && (Xe.value || Ie.value || Le.value)) {
					R.warning("请先处理当前未保存修改或待确认操作");
					return;
				}
				A.value = e, K.value = "", et(), U.value = "", at();
			}
		}
		async function mt() {
			let e = Ze();
			if (!Ke.value || !J.value || !B.value || !e) return;
			let t;
			try {
				t = qi(J.value, Y.value, Ce.value, Te.value, zi());
			} catch {
				Ne.value = g("predictionPages.invalidSave");
				return;
			}
			if (!D.next(e).current(Ze()) || !F.value || !I.value) return;
			let n;
			try {
				n = Qs(sessionStorage, B.value, t), Qe();
			} catch {
				Fe.value = !0;
				return;
			}
			await gt(n);
		}
		function ht() {
			Qe(), Ue.value && F.value && I.value && !je.value && !Fe.value && gt(Ue.value);
		}
		async function gt(e) {
			let t = Ze();
			if (!t) return;
			let n = D.next(t), r = new AbortController();
			ze = r;
			let i = () => n.current(Ze()) && F.value && I.value;
			je.value = !0, Ne.value = "", Re.value = null;
			try {
				let t = await rc(sessionStorage, e, (e) => ee(e, r.signal), async (e) => {
					let t = await f({
						site_id: e.site_id,
						game_type: e.game_type,
						symbol: e.symbol
					}, r.signal);
					return Wi(t, e.site_id, e.symbol, e.game_type), t;
				});
				if (!i()) return;
				Qe(), t.status === "success" ? (Re.value = t.value.receipt, t.latest ? (tt(t.latest), Me.value = "", Ne.value = g("predictionPages.saved")) : (J.value = null, Y.value = [], Ee.value = "", Me.value = "已保存，刷新失败。请刷新查看当前配置。", Ne.value = "已保存，刷新失败")) : t.status !== "superseded" && (Ne.value = g("predictionPages." + (t.status === "unknown" ? "pending" : "rejected")) + " · " + wi(t.error?.error_code));
			} catch {
				i() && (Qe(), Ne.value = g("predictionPages.pending"));
			} finally {
				ze === r && (je.value = !1);
			}
		}
		async function _t() {
			if (Qe(), !Le.value || !Ge.value || !F.value || !I.value || je.value || Fe.value) return;
			let e = Le.value, t = y.token, n = Ve, r = new AbortController(), i = () => n === Ve && t === y.token && Ge.value && F.value && I.value;
			ze = r, je.value = !0;
			try {
				let t = await ya(sessionStorage, e, (e) => p(e, r.signal));
				if (!i()) return;
				Qe(), Ne.value = t.status === "success" ? "旧版原请求已确认成功。站点设置请单独查看。" : g("predictionPages.pending");
			} catch {
				i() && (Qe(), Ne.value = g("predictionPages.pending"));
			} finally {
				ze === r && (je.value = !1);
			}
		}
		function vt(e) {
			let t = N.value === "UP_DOWN" ? BigInt(e.observation_seconds) : BigInt(e.duration_seconds);
			return N.value === "HIGH_LOW" && t >= 60n && t % 60n == 0n ? `${t / 60n}分钟` : `${t}秒`;
		}
		function yt(e) {
			let t = e === U.value ? J.value : xe.value[e];
			return t ? Ki(t).map(vt).join(" · ") : "";
		}
		function bt(e) {
			return typeof e == "string" || typeof e == "boolean" ? wi(e) : g("predictionPages.notProvided");
		}
		function xt(e, t) {
			let n = bt(t);
			if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return n;
			if (e !== "target_payout_rate") return n + "x";
			let [r, i = ""] = n.split("."), a = r + i, o = r.length + 2;
			return (o >= a.length ? a + "0".repeat(o - a.length) : a.slice(0, o) + "." + a.slice(o)).replace(/^0+(?=\d)/, "") + "%";
		}
		let St = (e) => re("predictionPages.fields." + e) ? g("predictionPages.fields." + e) : e;
		return se(H, () => {
			Ve++, U.value = "", at();
		}, { flush: "sync" }), se(U, () => {
			Ve++, ot(!0);
		}, { flush: "sync" }), se(() => [
			y.userInfo.id,
			y.token,
			F.value,
			I.value
		], () => {
			Ve++, $e(), C.close(), oe.close(), E.close(), b.close(), rt();
		}, {
			immediate: !0,
			flush: "sync"
		}), ne(() => {
			Ve++, $e(), C.close(), oe.close(), E.close(), b.close();
		}), (e, t) => (_(), a(w(j), { locale: P.value }, {
			default: T(() => [c("section", ic, [c("nav", ac, [
				d(w(k), {
					type: A.value === "UP_DOWN" ? "primary" : void 0,
					"aria-pressed": A.value === "UP_DOWN",
					onClick: t[0] ||= (e) => pt("UP_DOWN")
				}, {
					default: T(() => [...t[8] ||= [u("涨跌预测", -1), c("small", null, "按系统场次预测结算价格相对开盘价格上涨或下跌", -1)]]),
					_: 1
				}, 8, ["type", "aria-pressed"]),
				d(w(k), {
					type: A.value === "HIGH_LOW" ? "primary" : void 0,
					"aria-pressed": A.value === "HIGH_LOW",
					onClick: t[1] ||= (e) => pt("HIGH_LOW")
				}, {
					default: T(() => [...t[9] ||= [u("自选预测", -1), c("small", null, "用户自主选择方向和预测周期，生成独立预测订单", -1)]]),
					_: 1
				}, 8, ["type", "aria-pressed"]),
				d(w(k), {
					type: A.value === "GRID" ? "primary" : void 0,
					"aria-pressed": A.value === "GRID",
					onClick: t[2] ||= (e) => pt("GRID")
				}, {
					default: T(() => [...t[10] ||= [u("预测网格", -1), c("small", null, "按时间格与价格区间展示网格预测规则", -1)]]),
					_: 1
				}, 8, ["type", "aria-pressed"])
			]), A.value === "GRID" ? (_(), a(Zo, {
				key: 1,
				ref_key: "gridRef",
				ref: M
			}, null, 512)) : (_(), s(r, { key: 0 }, [V.value.length > 1 ? (_(), a(w(ue), {
				key: 0,
				modelValue: H.value,
				"onUpdate:modelValue": t[3] ||= (e) => H.value = e,
				placeholder: "请选择配置站点",
				"aria-label": "配置站点",
				disabled: je.value || Xe.value || !!Ie.value || !!Le.value
			}, {
				default: T(() => [(_(!0), s(r, null, ae(V.value, (e, t) => (_(), a(w(le), {
					key: e.site_id,
					label: `站点配置 ${t + 1}`,
					value: e.site_id
				}, null, 8, ["label", "value"]))), 128))]),
				_: 1
			}, 8, ["modelValue", "disabled"])) : o("", !0), F.value ? (_(), s("div", sc, [c("aside", {
				class: "symbol-directory",
				"aria-label": w(g)("predictionPages.symbolDirectory")
			}, [
				c("h3", null, [t[11] ||= u("交易对配置 ", -1), c("small", null, S(ye.value.length) + " 条", 1)]),
				d(w(L), {
					modelValue: K.value,
					"onUpdate:modelValue": t[4] ||= (e) => K.value = e,
					clearable: "",
					"aria-label": w(g)("predictionPages.searchSymbol"),
					placeholder: w(g)("predictionPages.searchSymbol")
				}, null, 8, [
					"modelValue",
					"aria-label",
					"placeholder"
				]),
				ve.value ? (_(), s("p", lc, [u(S(ve.value), 1), d(w(k), {
					size: "small",
					disabled: Xe.value || je.value || !!Ie.value || Oe.value,
					onClick: at
				}, {
					default: T(() => [...t[12] ||= [u("重试币种目录", -1)]]),
					_: 1
				}, 8, ["disabled"])])) : o("", !0),
				De.value || Oe.value ? (_(), s("p", uc, S(w(g)("predictionPages.loading")), 1)) : o("", !0),
				ke.value ? (_(), s("div", dc, [c("p", null, S(ke.value), 1), d(w(k), {
					"data-action": "retry-catalog",
					size: "small",
					disabled: De.value,
					onClick: rt
				}, {
					default: T(() => [u(S(w(g)("predictionPages.retry")), 1)]),
					_: 1
				}, 8, ["disabled"])])) : o("", !0),
				!De.value && !ke.value && !be.value.length ? (_(), s("p", fc, S(V.value.length ? H.value ? q.value.length ? "没有匹配的交易对。" : "当前站点尚未开放此玩法的交易对配置。" : "请选择配置站点。" : "当前账号暂无预测配置站点授权，请联系管理员配置后刷新。"), 1)) : o("", !0),
				c("div", pc, [(_(!0), s(r, null, ae(be.value, (e) => (_(), s("div", {
					key: e,
					class: te(["symbol-entry", { selected: e === U.value }])
				}, [c("button", {
					type: "button",
					class: "symbol-option",
					"data-symbol": e,
					"aria-pressed": e === U.value,
					disabled: !q.value.includes(e),
					onClick: (t) => ut(e)
				}, [
					d(w(h), { symbol: e }, null, 8, ["symbol"]),
					q.value.includes(e) ? Se.value[e] === "loading" ? (_(), s("span", gc, S(w(g)("predictionPages.loading")), 1)) : Se.value[e] === "unconfigured" ? (_(), s("span", _c, S(w(g)("predictionPages.unconfigured")), 1)) : st(e) === null ? (_(), s("span", vc, S(w(g)("predictionPages.unavailableConfig")), 1)) : (_(), s("span", yc, S(yt(e)), 1)) : (_(), s("span", hc, S(ge.value.includes(e) ? "未开放配置" : "未配置"), 1)),
					e === U.value && Xe.value ? (_(), s("span", bc, S(w(g)("predictionPages.unsaved")), 1)) : o("", !0)
				], 8, mc), Se.value[e] === "configured" ? (_(), s("div", xc, [d(w(de), {
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
			], 8, cc), c("main", Sc, [
				c("header", Cc, [c("div", null, [c("h3", null, S(U.value || w(g)("predictionPages.selectSymbol")) + " · " + S(w(g)("predictionPages.games." + N.value)), 1), t[13] ||= c("p", null, "当前商户生效", -1)]), c("div", wc, [Xe.value ? (_(), s("span", Tc, S(w(g)("predictionPages.unsaved")), 1)) : o("", !0), w(I) ? (_(), a(w(k), {
					key: 1,
					"data-action": "save",
					type: "primary",
					loading: je.value,
					disabled: !Ke.value,
					onClick: mt
				}, {
					default: T(() => [...t[14] ||= [u("保存配置", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])) : o("", !0)])]),
				Ae.value ? (_(), s("p", Ec, S(w(g)("predictionPages.loading")), 1)) : o("", !0),
				Me.value ? (_(), s("p", Dc, [u(S(Me.value), 1), F.value ? (_(), a(w(k), {
					key: 0,
					disabled: Ae.value || De.value || je.value || Xe.value || !!Ie.value || !!Le.value,
					onClick: ft
				}, {
					default: T(() => [...t[15] ||= [u("重试", -1)]]),
					_: 1
				}, 8, ["disabled"])) : o("", !0)])) : o("", !0),
				z.value ? o("", !0) : (_(), s("p", Oc, S(w(g)("predictionPages.identityError")), 1)),
				Pe.value ? (_(), s("p", kc, "该交易对尚未配置，请联系管理员完成初始配置后刷新。")) : o("", !0),
				Le.value ? (_(), a(w(O), {
					key: 4,
					type: "warning",
					closable: !1,
					title: "存在旧版代理配置待确认请求"
				}, {
					default: T(() => [
						t[17] ||= c("p", null, "旧请求按原协议恢复，不会转换为站点保存。", -1),
						c("p", null, S(Le.value.body.symbol) + " · " + S(Le.value.body.client_request_id), 1),
						Ge.value ? (_(), a(w(k), {
							key: 0,
							disabled: je.value || !w(I) || Fe.value,
							onClick: _t
						}, {
							default: T(() => [...t[16] ||= [u("确认旧版原请求", -1)]]),
							_: 1
						}, 8, ["disabled"])) : (_(), s("p", Ac, "请使用原操作账号恢复该请求。"))
					]),
					_: 1
				})) : o("", !0),
				Fe.value ? (_(), a(w(O), {
					key: 5,
					type: "error",
					closable: !1,
					title: w(g)("predictionPages.storageError")
				}, null, 8, ["title"])) : Ie.value ? (_(), a(w(O), {
					key: 6,
					type: "warning",
					closable: !1,
					title: w(g)("predictionPages.pending")
				}, {
					default: T(() => [Ue.value ? (_(), s(r, { key: 0 }, [
						c("p", null, [u(S(w(g)("predictionPages.fields.client_request_id")) + ": ", 1), c("code", null, S(Ue.value.body.client_request_id), 1)]),
						c("p", null, S(Ue.value.body.symbol) + " · 站点 " + S(Ue.value.body.site_id) + " · 公共版本 " + S(Ue.value.body.based_on_public_version) + " / 站点版本 " + S(Ue.value.body.based_on_site_version), 1),
						c("ul", null, [(_(!0), s(r, null, ae(Ue.value.body.overrides, (e) => (_(), s("li", { key: e.duration_seconds }, [
							u(S(e.duration_seconds) + "s · " + S(e.enabled === void 0 ? "继承原设置" : e.enabled ? w(g)("predictionPages.on") : w(g)("predictionPages.off")) + " · " + S(e.maximum_stake ?? e.stake_tiers?.[0]?.maximum_stake ?? "继承平台设置"), 1),
							e.fixed_odds === void 0 ? o("", !0) : (_(), s("span", jc, " · 固定赔率 " + S(e.fixed_odds) + "x", 1)),
							e.minimum_stake === void 0 ? o("", !0) : (_(), s("span", Mc, " · 最小下注金额 " + S(e.minimum_stake) + " USDT", 1))
						]))), 128))]),
						w(I) ? (_(), a(w(k), {
							key: 0,
							disabled: je.value,
							"data-action": "replay",
							onClick: ht
						}, {
							default: T(() => [u(S(w(g)("predictionPages.confirmOriginal")), 1)]),
							_: 1
						}, 8, ["disabled"])) : o("", !0)
					], 64)) : (_(), s("p", Nc, S(w(g)("predictionPages.otherPending")), 1))]),
					_: 1
				}, 8, ["title"])) : o("", !0),
				Ne.value ? (_(), s("p", Pc, S(Ne.value), 1)) : o("", !0),
				J.value ? (_(), s(r, { key: 8 }, [
					Ce.value ? o("", !0) : (_(), s("p", Fc, "交易对已关闭；以下房间设置仍会保留。")),
					J.value.adjustments.length ? (_(), s("p", Ic, "部分保存值受当前公共配置调整，编辑框保留原设置；实际生效金额见下方。")) : o("", !0),
					w(I) ? o("", !0) : (_(), s("p", Lc, S(w(g)("predictionPages.readOnlyConfig")), 1)),
					c("nav", {
						class: "room-tabs",
						"aria-label": N.value === "UP_DOWN" ? w(g)("predictionPages.observationRoom") : "支持周期"
					}, [(_(!0), s(r, null, ae(Y.value, (e) => (_(), s("button", {
						key: e.duration_seconds,
						type: "button",
						"data-room": e.duration_seconds,
						"aria-pressed": we.value === e.duration_seconds,
						class: te({ active: we.value === e.duration_seconds }),
						onClick: (t) => we.value = e.duration_seconds
					}, S(vt(e)), 11, zc))), 128))], 8, Rc),
					qe.value && Je.value ? (_(), s(r, { key: 3 }, [
						c("div", Bc, [c("div", null, [c("h3", null, S(vt(qe.value)) + " · " + S(N.value === "UP_DOWN" ? w(g)("predictionPages.observationRoom") : "支持周期"), 1)]), c("label", Vc, [u(S(w(g)("predictionPages.roomEnabled")), 1), d(w(de), {
							modelValue: qe.value.enabled,
							"onUpdate:modelValue": t[5] ||= (e) => qe.value.enabled = e,
							"data-field": "enabled",
							"aria-label": w(g)("predictionPages.roomEnabled"),
							disabled: !Ke.value,
							onChange: $e
						}, null, 8, [
							"modelValue",
							"aria-label",
							"disabled"
						])])]),
						qe.value.inherited_enabled ? (_(), s("p", Hc, "房间开关包含继承设置；未修改时保留继承状态。")) : o("", !0),
						c("div", Uc, [
							N.value === "UP_DOWN" ? (_(), s("article", Wc, [
								c("h4", null, S(w(g)("predictionPages.oddsSettings")), 1),
								t[18] ||= c("p", { class: "field-description" }, "上涨赔率 = 1 + 目标返奖率 × 下跌池 ÷（上涨池＋本次下注）；下跌赔率反向计算。下注期间为预计倍率，封盘后锁定最终倍率。", -1),
								c("dl", Gc, [(_(), s(r, null, ae(["target_payout_rate", "maximum_odds"], (e) => c("div", { key: e }, [c("dt", null, [u(S(St(e)), 1), d(yn, { label: St(e) }, null, 8, ["label"])]), c("dd", null, S(xt(e, Je.value[e])), 1)])), 64))]),
								c("span", Kc, S(w(g)("predictionPages.readOnly")), 1)
							])) : o("", !0),
							N.value === "HIGH_LOW" ? (_(), s("article", qc, [
								c("h4", null, "赔率配置 · " + S(vt(qe.value)), 1),
								t[20] ||= c("p", { class: "field-description" }, "用户下单时按当前周期固定赔率锁定，订单存储赔率快照；上涨和下跌使用相同赔率。", -1),
								c("dl", Jc, [c("div", null, [c("dt", null, [t[19] ||= u("当前生效固定赔率", -1), d(yn, { label: "固定赔率" })]), c("dd", Yc, S(xt("fixed_odds", Je.value.fixed_odds)), 1)])]),
								c("span", Xc, S(w(g)("predictionPages.readOnly")), 1)
							])) : o("", !0),
							c("article", Zc, [
								c("h4", null, S(w(g)("predictionPages.stakeLimits")) + " · " + S(vt(qe.value)), 1),
								t[22] ||= c("p", { class: "field-description" }, "不同周期独立保存下注限制，变更不影响已受理订单。", -1),
								c("div", Qc, [N.value === "UP_DOWN" ? (_(), s("dl", $c, [c("dt", null, [u(S(w(g)("predictionPages.fields.minimum_stake")), 1), d(yn, {
									label: "单笔最小额",
									content: "用户创建一笔预测订单时允许输入的最低下注金额。本版涨跌预测固定为 1 USDT，由平台统一维护。"
								})]), c("dd", null, S(bt(Je.value.stake_tiers?.find((e) => e.stake_tier_id === qe.value?.stake_tier_id)?.minimum_stake)), 1)])) : (_(), s("div", el, [c("label", null, [u(S(w(g)("predictionPages.fields.minimum_stake")), 1), d(yn, { label: "单笔最小额" })]), d(w(L), {
									modelValue: qe.value.minimum_stake,
									"onUpdate:modelValue": t[6] ||= (e) => qe.value.minimum_stake = e,
									"data-field": "minimum_stake",
									"aria-label": w(g)("predictionPages.fields.minimum_stake"),
									disabled: !Ke.value,
									onInput: $e
								}, {
									append: T(() => [...t[21] ||= [u("USDT", -1)]]),
									_: 1
								}, 8, [
									"modelValue",
									"aria-label",
									"disabled"
								])])), c("div", null, [
									c("label", null, [u(S(w(g)("predictionPages.fields.maximum_stake")), 1), d(yn, { label: "单笔最大额" })]),
									d(w(L), {
										modelValue: qe.value.maximum_stake,
										"onUpdate:modelValue": t[7] ||= (e) => qe.value.maximum_stake = e,
										"data-field": "maximum_stake",
										"aria-label": w(g)("predictionPages.fields.maximum_stake"),
										disabled: !Ke.value || !qe.value.editable,
										onInput: $e
									}, null, 8, [
										"modelValue",
										"aria-label",
										"disabled"
									]),
									c("small", null, "当前生效：" + S(qe.value.effective_maximum) + "；可填写更高限额，最终由平台范围校验。", 1)
								])])
							])
						])
					], 64)) : o("", !0)
				], 64)) : o("", !0)
			])])) : (_(), s("p", oc, S(w(g)("predictionPages.noPermission")), 1))], 64))])]),
			_: 1
		}, 8, ["locale"]));
	}
}), [["__scopeId", "data-v-3a0bcf9c"]]), nl = {
	key: 0,
	role: "alert"
}, rl = {
	key: 1,
	role: "status"
}, il = {
	key: 2,
	role: "alert"
}, al = {
	key: 5,
	role: "alert"
}, ol = /* @__PURE__ */ f({
	__name: "index",
	setup(e) {
		let t = pe().api, n = me(), r = x(null), o = v(!1), c = v(""), l = i(() => n.userInfo.can_manage_prediction_config === !0 && (n.perms.includes("*") || n.perms.includes("prediction_config:lists")) && Ti(n.userInfo.id) !== null), f = i(() => `${n.userInfo.id}:${n.token}`), ee = 0, p;
		async function m() {
			let e = ++ee, i = f.value;
			if (p?.abort(), r.value = null, c.value = "", o.value = !1, !l.value) return;
			p = new AbortController(), o.value = !0;
			let a = () => e === ee && i === f.value && l.value;
			try {
				let e = await t.ownerConfigurationModel(p.signal);
				if (!a()) return;
				if (e.actor?.operator_id !== Ti(n.userInfo.id) || ![
					"AGENT_V1",
					"SITE_V1",
					"OWNER_V1",
					"SCOPED_OWNER_V1"
				].includes(e.config_model)) throw Error("INVALID_MODEL");
				if (e.config_model === "SCOPED_OWNER_V1" && e.actor.kind === "SITE") {
					let n = e.actor;
					if (n.agent_id !== "0" || !Z(n.tenant_id, !0) || !Array.isArray(n.site_ids) || n.site_ids.length !== 1 || !Z(n.site_ids[0], !0)) throw Error("INVALID_SITES");
					let i = wa(localStorage), o = i?.operator_id === n.operator_id && i.kind === "SITE" ? i.config_site_id : void 0, s = uo(bo(sessionStorage, n))?.command.site_id, c = n.site_ids[0];
					if (o && o !== c || s && s !== c || !t.initializeSiteConfigurations) throw Error("SITE_UNAVAILABLE");
					if (!o && !s) {
						let e = await t.initializeSiteConfigurations(c, p.signal);
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
				if (!Zi(e.actor) || e.config_model === "SCOPED_OWNER_V1" !== Xi(e.actor)) throw Error("INVALID_MODEL");
				if (e.config_model === "SCOPED_OWNER_V1") {
					if (!t.initializeOwnerConfigurations) throw Error("INITIALIZATION_UNAVAILABLE");
					let e = await t.initializeOwnerConfigurations(p.signal);
					if (!a()) return;
					if (!Number.isSafeInteger(e.created) || e.created < 0) throw Error("INVALID_INITIALIZATION");
				}
				r.value = e;
			} catch {
				a() && (c.value = "无法加载当前账号的配置，请重试。");
			} finally {
				e === ee && (o.value = !1);
			}
		}
		return se(() => [f.value, l.value], () => {
			m();
		}, {
			immediate: !0,
			flush: "sync"
		}), ne(() => {
			ee++, p?.abort();
		}), (e, t) => l.value ? o.value ? (_(), s("p", rl, "正在读取配置…")) : c.value ? (_(), s("div", il, [u(S(c.value) + " ", 1), d(w(k), { onClick: t[0] ||= (e) => m() }, {
			default: T(() => [...t[1] ||= [u("重试", -1)]]),
			_: 1
		})])) : r.value?.config_model === "OWNER_V1" || r.value?.config_model === "SCOPED_OWNER_V1" ? (_(), a(Hs, {
			key: `${f.value}:${r.value.actor.config_site_id ?? ""}`,
			actor: r.value.actor
		}, null, 8, ["actor"])) : r.value?.config_model === "SITE_V1" ? (_(), a(tl, { key: f.value })) : (_(), s("p", al, "当前配置模式尚未接入此页面，请联系管理员确认切换；原有未确认请求保持原样。")) : (_(), s("p", nl, "当前账号无权管理预测配置。商户端仅代理商主账号可管理；白标账号需有所属站点的玩法配置权限。"));
	}
}), sl = {
	class: "mm-prediction-game-config mm-ui",
	"data-mm-component": "prediction-game-config"
}, cl = {
	key: 0,
	role: "alert"
}, ll = /* @__PURE__ */ f({
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
		ie(K, {
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
		return (t, i) => (_(), s("section", sl, [r.value ? (_(), a(b(e.adapter.role === "platform" ? Si : ol), { key: n.value })) : (_(), s("p", cl, "无法确认当前操作人身份"))]));
	}
});
//#endregion
export { ll as MmPredictionGameConfig };

//# sourceMappingURL=prediction-config.js.map