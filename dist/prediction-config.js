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
import { ElAlert as O, ElButton as k, ElCard as A, ElConfigProvider as j, ElDialog as M, ElDrawer as N, ElEmpty as P, ElForm as ce, ElFormItem as F, ElIcon as I, ElInput as L, ElMessage as le, ElMessageBox as R, ElOption as z, ElPopover as B, ElSelect as ue, ElSwitch as de, ElTag as fe, useFormDisabled as V } from "element-plus";
import { QuestionFilled as H } from "@element-plus/icons-vue";
import pe from "element-plus/es/locale/lang/en";
import U from "element-plus/es/locale/lang/zh-cn";
//#region src/prediction-config/runtime.ts
var W = Symbol("MmPredictionGameConfig");
function G() {
	let e = ee(W);
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
		enabled: Je(e),
		rules: (t.game_type === "GAME_TYPE_HIGH_LOW" ? Pe(e) : e.rules.map(Ne)).map((t) => ({
			...t,
			enabled_by_default: qe(e) || t.enabled_by_default
		}))
	};
}
function Ie(e, t, n) {
	e = Re(e);
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
	e = Re(e);
	let n = [];
	e.symbol || n.push("交易对不能为空"), xe(e.based_on_template_version) || n.push("配置版本无效"), e.rules.length === 0 && n.push("至少保留一个周期"), e.game_type === "UP_DOWN" && [...e.rules.map((e) => e.duration_seconds)].sort().join(",") !== Ee.join(",") && n.push("涨跌配置必须包含5、10、15、30、60秒五个固定房间"), e.game_type === "HIGH_LOW" && [...e.rules.map((e) => e.duration_seconds)].sort().join(",") !== [...De].sort().join(",") && n.push("自选配置必须包含5、10、15、30、60秒五个固定房间"), new Set(e.rules.map((e) => e.price_rule.price_decimals)).size > 1 && n.push("同一币种各周期的价格小数位必须一致");
	let r = /* @__PURE__ */ new Set();
	return e.rules.forEach((i) => {
		let a = `${i.duration_seconds || "--"} 秒周期`;
		q.test(i.duration_seconds) || n.push(`${a}的周期必须是正整数`), r.has(i.duration_seconds) && n.push(`周期 ${i.duration_seconds} 秒重复`), r.add(i.duration_seconds);
		let o = i.price_rule.price_decimals;
		o !== void 0 && (typeof o != "number" || !Number.isInteger(o) || o < 0 || o > 8) && n.push("价格小数位必须是0～8的整数"), ze(i.settlement_display_seconds, `${a}的结算展示时间`, n), ze(i.price_rule.max_age_milliseconds, `${a}的行情最大年龄`, n), ze(i.price_rule.late_arrival_grace_milliseconds, `${a}的行情延迟宽限`, n), Ve(i.minimum_stake, a, "最低下注额", n), Ve(i.maximum_stake, a, "最高下注额", n);
		let s = i.minimum_stake?.default_value, c = i.maximum_stake?.default_value, l = /^(0|[1-9]\d{0,17})(\.\d{1,18})?$/;
		typeof s != "string" || typeof c != "string" || !l.test(s) || !l.test(c) || He(s, "0") <= 0 || He(c, "0") <= 0 ? n.push(`${a}的单笔限额必须为正数，整数及小数最多18位`) : He(s, c) > 0 && n.push(`${a}的最小额不能大于最大额`), e.game_type === "UP_DOWN" ? (((e, t) => !!e && e.agent_editable === !1 && [
			e.minimum_value,
			e.default_value,
			e.maximum_value
		].every((e) => typeof e == "string" && K.test(e) && He(e, t) === 0))(i.bet_open_seconds, "30") || n.push("下注开放固定30秒且不可由代理调整"), (!t && !i.market_id || i.stake_tiers?.filter((e) => !e.retired).length !== 1) && n.push("房间配置不完整，请重新加载"), i.stake_tiers?.filter((e) => !e.retired).forEach((e) => {
			!t && !e.stake_tier_id && n.push("房间标识无效");
		}), [
			i.target_payout_rate,
			i.minimum_odds,
			i.maximum_odds
		].some((e) => e?.agent_editable !== !1) && n.push("返奖率和赔率不能由代理调整"), Be(i.bet_open_seconds, a, "下注开放时间", n), Ve(i.target_payout_rate, a, "目标返奖率", n), typeof i.target_payout_rate?.default_value == "string" && K.test(i.target_payout_rate.default_value) && He(i.target_payout_rate.default_value, "1") >= 0 && n.push(`${a}的目标返奖率必须小于 100%`), Ve(i.minimum_odds, a, "最低赔率", n), Ve(i.maximum_odds, a, "最高赔率", n), i.stake_tiers?.length || n.push(`${a}的房间配置不完整`), i.stake_tiers?.forEach((e, t) => {
			let r = `${a}历史设置 ${t + 1}`;
			Ve(e.minimum_stake, r, "最低下注额", n), Ve(e.maximum_stake, r, "最高下注额", n);
		})) : (Ve(i.fixed_odds, a, "固定赔率", n), typeof i.fixed_odds?.default_value == "string" && K.test(i.fixed_odds.default_value) && He(i.fixed_odds.default_value, "2") >= 0 && n.push(`${a}的固定赔率必须小于 2`));
	}), [...new Set(n)];
}
function J(e, t, n) {
	if (e.length <= 3) return e.join("；");
	let r = (e) => t === "UP_DOWN" ? String(Number(e) - 30) : e, i = `${n} 秒周期`, a = e.filter((e) => e.startsWith(i)), o = [...new Set(e.flatMap((e) => {
		let t = /^(\d+) 秒周期/.exec(e);
		return t && t[1] !== n ? [t[1]] : [];
	}))], s = [...e.filter((e) => !/^\d+ 秒周期/.test(e)).slice(0, 1), ...a.slice(0, 2)];
	return a.length > 2 && s.push(`${r(n)} 秒周期还有 ${a.length - 2} 项需检查`), o.length && s.push(`请补全 ${o.map(r).join("、")} 秒周期参数`), s.join("；").slice(0, 180);
}
function Re(e) {
	if (!e.is_new) return e;
	let t = structuredClone(e);
	for (let e of t.rules) {
		for (let t of [e.target_payout_rate, e.maximum_odds]) t && (t.minimum_value = t.maximum_value = t.default_value);
		e.fixed_odds && (e.fixed_odds.minimum_value = "1.000000000000000001", e.fixed_odds.maximum_value = e.fixed_odds.default_value);
		for (let t of e.stake_tiers ?? []) t.minimum_stake = structuredClone(e.minimum_stake), t.maximum_stake = structuredClone(e.maximum_stake);
	}
	return t;
}
function ze(e, t, n) {
	xe(e) || n.push(`${t}必须是非负整数`);
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
	].some((e) => typeof e != "string" || !Te.test(e))) {
		r.push(`${t}的${n}必须是非负整数`);
		return;
	}
	(He(e.minimum_value, e.default_value) > 0 || He(e.default_value, e.maximum_value) > 0) && r.push(`${t}的${n}默认值必须处于上下限之间`);
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
	].some((e) => typeof e != "string" || !K.test(e))) {
		r.push(`${t}的${n}必须是非负十进制字符串`);
		return;
	}
	(He(e.minimum_value, e.default_value) > 0 || He(e.default_value, e.maximum_value) > 0) && r.push(`${t}的${n}默认值必须处于上下限之间`);
}
function He(e, t) {
	let [n, r = ""] = e.split("."), [i, a = ""] = t.split("."), o = n.replace(/^0+(?=\d)/, ""), s = i.replace(/^0+(?=\d)/, "");
	if (o.length !== s.length) return o.length > s.length ? 1 : -1;
	if (o !== s) return o > s ? 1 : -1;
	let c = Math.max(r.length, a.length), l = r.padEnd(c, "0"), u = a.padEnd(c, "0");
	return l === u ? 0 : l > u ? 1 : -1;
}
function Ue(e, t) {
	if (!K.test(e)) return e;
	let [n, r = ""] = e.split("."), i = n + r, a = n.length + t;
	return (a <= 0 ? "0." + "0".repeat(-a) + i : a >= i.length ? i + "0".repeat(a - i.length) : i.slice(0, a) + "." + i.slice(a)).replace(/^0+(?=\d)/, "");
}
var We = (e) => Ue(e, 2), Ge = (e) => Ue(e, -2);
function Ke(e, t, n) {
	e[t].default_value = n;
	for (let t of ["minimum_stake", "maximum_stake"]) e[t].minimum_value = e.minimum_stake.default_value, e[t].maximum_value = e.maximum_stake.default_value;
}
var qe = (e) => e.symbol_enabled === void 0 && !e.rules.some((e) => e.enabled_by_default), Je = (e) => e.symbol_enabled ?? e.rules.some((e) => e.enabled), Ye = (e) => e.rules.filter((t) => qe(e) || t.enabled_by_default).map((e) => e.duration_seconds);
//#endregion
//#region src/prediction-config/platform/views/grid/config/directory.ts
function Xe(e, t) {
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
	return Ze([...n.values()], t);
}
function Ze(e, t, n = (e) => !!e.enabled) {
	let r = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.trim().toUpperCase();
		r.has(t) || r.set(t, r.size);
	}
	return [...e].sort((e, t) => Number(n(t)) - Number(n(e)) || (r.get(e.symbol) ?? 2 ** 53 - 1) - (r.get(t.symbol) ?? 2 ** 53 - 1) || e.symbol.localeCompare(t.symbol));
}
//#endregion
//#region src/prediction-config/platform/views/prediction/query.ts
var Qe = (e, t) => e.includes("*") || e.includes(t), $e = {
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
$e.result, $e.sort_direction;
//#endregion
//#region src/prediction-config/submission-outcome.ts
function et(e, t) {
	if (!e || typeof e != "object") return;
	let n = e, r = [n.control?.submission_outcome, n.detail?.control?.submission_outcome];
	if (r.includes("UNVERIFIED") || n.client_request_id !== void 0 && n.client_request_id !== t) return "unverified";
	if (r.includes("REJECTED")) return n.client_request_id === t ? "rejected" : "unverified";
}
//#endregion
//#region src/prediction-config/platform/views/grid/config/journal.ts
var tt = /^[1-9]\d*$/;
function nt(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function rt(e, t) {
	if (!e) throw Error(t);
}
function it(e, t) {
	rt(Object.keys(e).length === t.length && t.every((t) => Object.hasOwn(e, t)), "PENDING_CORRUPT");
}
function at(e, t, n) {
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
		rt(i.length <= 32768, "PENDING_CORRUPT");
		let a;
		try {
			a = JSON.parse(i);
		} catch {
			throw Error("PENDING_CORRUPT");
		}
		return rt(nt(a), "PENDING_CORRUPT"), it(a, [
			"schema",
			"operator_id",
			"command"
		]), rt(a.schema === 1 && typeof a.operator_id == "string" && tt.test(a.operator_id), "PENDING_CORRUPT"), t(a.command), r(a);
	}
	function o(n, r, o) {
		rt(tt.test(r), "IDENTITY_UNCONFIRMED"), rt(a(n) === null, "PENDING_EXISTS"), t(o);
		let s = {
			schema: 1,
			operator_id: r,
			command: JSON.parse(JSON.stringify(o))
		};
		n.setItem(e, JSON.stringify(s));
		let c = a(n);
		return rt(i(c, s), "PERSISTENCE_UNAVAILABLE"), c;
	}
	function s(e, n) {
		return rt(tt.test(e), "IDENTITY_UNCONFIRMED"), t(n), r({
			operator_id: e,
			command: structuredClone(n)
		});
	}
	function c(e, n, r, i) {
		return t(n.command), t(i), rt(n.operator_id === r && JSON.stringify(n.command) === JSON.stringify(i), "STALE_CONFIRMATION"), o(e, n.operator_id, n.command);
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
		rt(i(a(t), r), "PENDING_CHANGED");
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
			if ((nt(n) ? n.operation_status : void 0) === "FAILED" && (o === "save" || o === "recover" && nt(n) && n.error_code === "VERSION_CONFLICT")) {
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
var ot = [
	"parameters_available",
	"parameter_source",
	"stored_parameters",
	"global_parameters_source",
	"default_parameter_source",
	"default_global_parameters_source",
	"default_min_multiplier",
	"default_max_multiplier"
], st = [
	"target_rtp",
	"min_multiplier",
	"max_multiplier",
	"min_order_amount",
	"max_order_amount"
], ct = (e) => !!e && typeof e == "object" && !Array.isArray(e), lt = (e) => {
	if (!e) throw Error("INVALID_GRID_CONFIGURATION");
}, ut = (e) => typeof e == "string" && /^[1-9][0-9]*$/.test(e) && (e.length < 19 || e.length === 19 && e <= "9223372036854775807");
function dt(e) {
	if (e === null) return null;
	lt(ct(e) && Object.keys(e).length === 3 && e.kind === "GLOBAL" && ut(e.version) && typeof e.effective_from_ms == "string" && /^[0-9]+$/.test(e.effective_from_ms));
	let t = e;
	return {
		kind: "GLOBAL",
		version: t.version,
		effective_from_ms: t.effective_from_ms
	};
}
function ft(e, t) {
	if (!ot.some((t) => t in e)) return;
	if (lt(ot.every((t) => t in e)), e.parameters_available === !1) throw Error("CONFIG_PARAMETERS_UNAVAILABLE");
	lt(e.parameters_available === !0 && [
		"GLOBAL",
		"SITE",
		"MERCHANT"
	].includes(String(e.parameter_source)) && ["GLOBAL", "SITE"].includes(String(e.default_parameter_source))), lt(ct(e.stored_parameters) && Object.keys(e.stored_parameters).length === 5 && st.every((t) => t in e.stored_parameters));
	let n = e.stored_parameters, r = Object.fromEntries(st.map((e) => [e, n[e] === null ? null : t(n[e])]));
	lt(Object.values(r).every((t) => e.parameter_source === "GLOBAL" ? t === null : t !== null));
	let i = dt(e.global_parameters_source), a = dt(e.default_global_parameters_source);
	return lt(e.parameter_source === "GLOBAL" == (i !== null) && e.default_parameter_source === "GLOBAL" == (a !== null)), lt(!i || !a || i.version === a.version), {
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
function pt(e) {
	return e.global_parameters_source?.version ?? e.default_global_parameters_source?.version;
}
//#endregion
//#region src/prediction-config/platform/views/grid/config/model.ts
function mt(e, t = !0) {
	let n = structuredClone(e);
	return t && n.layout?.editable && n.layout.price_decimals == null && (n.layout.price_decimals = 3), n;
}
var ht = "grid.config.pending.v1", gt = /^(0|[1-9]\d*)(?:\.(\d+))?$/, _t = /^[1-9]\d*$/, vt = /^[A-Z0-9]{2,32}$/, yt = [
	"site_id",
	"symbol",
	"based_on_layout_version",
	"based_on_site_version",
	"client_request_id",
	"reason",
	"changes"
], bt = [
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
], xt = [
	"based_on_config_id",
	"based_on_default_version",
	"based_on_default_resolution_epoch"
], St = [
	"price_band_width",
	"column_duration_seconds",
	"price_decimals"
], Ct = [
	"enabled",
	"target_rtp",
	"min_multiplier",
	"max_multiplier",
	"min_order_amount",
	"max_order_amount"
];
function wt(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function Y(e, t = "INVALID_GRID_CONFIGURATION") {
	if (!e) throw Error(t);
}
function Tt(e, t) {
	Y(Object.keys(e).length === t.length && Object.keys(e).every((e) => t.includes(e)), "PENDING_CORRUPT");
}
function Et(e, t) {
	Y(typeof e == "string" && e.length <= 128 && gt.test(e), "INVALID_DECIMAL");
	let [n, r = ""] = e.split("."), i = n.replace(/^0+(?=\d)/, ""), a = r.replace(/0+$/, "");
	return Y(t === void 0 || a.length <= t, "INVALID_DECIMAL"), a ? i + "." + a : i;
}
function Dt(e) {
	let [t, n = ""] = Et(e).split(".");
	return {
		whole: t,
		fraction: n
	};
}
function Ot(e, t) {
	let n = Dt(e), r = Dt(t);
	if (n.whole.length !== r.whole.length) return n.whole.length > r.whole.length ? 1 : -1;
	if (n.whole !== r.whole) return n.whole > r.whole ? 1 : -1;
	let i = Math.max(n.fraction.length, r.fraction.length), a = n.fraction.padEnd(i, "0"), o = r.fraction.padEnd(i, "0");
	return a === o ? 0 : a > o ? 1 : -1;
}
function kt(e, t) {
	let { whole: n, fraction: r } = Dt(e), i = n + r, a = n.length + t, o;
	o = a <= 0 ? "0." + "0".repeat(-a) + i : a >= i.length ? i + "0".repeat(a - i.length) : i.slice(0, a) + "." + i.slice(a);
	let [s, c = ""] = o.split("."), l = s.replace(/^0+(?=\d)/, "") || "0", u = c.replace(/0+$/, "");
	return u ? l + "." + u : l;
}
function At(e) {
	let t = Et(e);
	return Y(Ot(t, "0") > 0 && Ot(t, "1") <= 0, "INVALID_RTP"), kt(t, 2);
}
function jt(e) {
	let t = Et(e);
	return Y(Ot(t, "0") > 0 && Ot(t, "100") < 0, "INVALID_RTP"), kt(t, -2);
}
function Mt(e = globalThis.crypto) {
	Y(e && typeof e.getRandomValues == "function", "SECURE_RANDOM_UNAVAILABLE");
	let t = e.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	Y(t instanceof Uint8Array && t.length === 16, "SECURE_RANDOM_UNAVAILABLE"), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0")).join("");
	return `${n.slice(0, 8)}-${n.slice(8, 12)}-${n.slice(12, 16)}-${n.slice(16, 20)}-${n.slice(20)}`;
}
function Nt(e) {
	return Y(typeof e == "string" && _t.test(e) && Ot(e, "25") <= 0, "INVALID_LAYOUT_DURATION"), e;
}
function Pt(e) {
	let t = Nt(e);
	return Y(Ot(t, "10") <= 0, "INVALID_LAYOUT_DURATION"), t;
}
function Ft(e, t) {
	let n = Et(e, t);
	return Y(Ot(n, "0") > 0, "INVALID_LAYOUT_WIDTH"), n;
}
function It(e) {
	if (typeof e != "string") return !1;
	let t = /^(?:0|[1-9]\d*)\.(\d+)$/.exec(e)?.[1];
	return t !== void 0 && t.length > 8;
}
function Lt(e) {
	return Y(e === null || typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 18, "INVALID_LAYOUT_PRECISION"), e;
}
function Rt(e) {
	return Y(typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 8, "INVALID_LAYOUT_PRECISION"), e;
}
function zt(e, t) {
	t != null && Y((Et(e).split(".")[1] ?? "").length <= t, "INVALID_LAYOUT_PRECISION");
}
function Bt(e, t) {
	Y(5 + (Number(e) + 1) * Number(t) <= 120, "INVALID_LAYOUT_HORIZON");
}
function Vt(e) {
	return Y(wt(e), "INVALID_GRID_LAYOUT"), Tt(e, [
		"row_count",
		"column_count",
		"column_duration_seconds",
		"price_band_width",
		"effective_from_ms",
		"editable",
		"affected_site_ids",
		..."price_decimals" in e ? ["price_decimals"] : []
	]), Y([
		e.row_count,
		e.column_count,
		e.column_duration_seconds
	].every((e) => typeof e == "string" && e.length <= 128 && _t.test(e)), "INVALID_GRID_LAYOUT"), Y(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_LAYOUT"), Y(typeof e.editable == "boolean", "INVALID_GRID_LAYOUT"), Y(Array.isArray(e.affected_site_ids) && e.affected_site_ids.every((e) => typeof e == "string" && e.length > 0 && e.length <= 64 && e.trim() === e), "INVALID_GRID_LAYOUT"), Y(new Set(e.affected_site_ids).size === e.affected_site_ids.length && (!e.editable || e.affected_site_ids.length > 0), "INVALID_GRID_LAYOUT"), {
		row_count: e.row_count,
		column_count: e.column_count,
		column_duration_seconds: e.column_duration_seconds,
		price_band_width: Ft(e.price_band_width),
		..."price_decimals" in e ? { price_decimals: Lt(e.price_decimals) } : {},
		effective_from_ms: e.effective_from_ms,
		editable: e.editable,
		affected_site_ids: [...e.affected_site_ids]
	};
}
function Ht(e, t, n = !1) {
	return !!(n && e.layout?.editable && t.layout && St.some((n) => e.layout[n] !== t.layout[n]));
}
function Ut(e) {
	Y(wt(e), "INVALID_GRID_CONFIGURATION"), Tt(e, [
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
		..."config_id" in e ? bt : [],
		...ot.filter((t) => t in e),
		..."availability_version" in e ? ["availability_version"] : []
	]), Y(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "INVALID_GRID_CONFIGURATION"), Y(typeof e.symbol == "string" && vt.test(e.symbol), "INVALID_GRID_CONFIGURATION"), Y([e.layout_version, e.site_version].every((e) => typeof e == "string" && _t.test(e)), "INVALID_GRID_CONFIGURATION"), Y(typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms), "INVALID_GRID_CONFIGURATION"), Y(typeof e.enabled == "boolean", "INVALID_GRID_CONFIGURATION");
	let t = {
		site_id: e.site_id,
		symbol: e.symbol,
		layout_version: e.layout_version,
		site_version: e.site_version,
		effective_from_ms: e.effective_from_ms,
		enabled: e.enabled,
		target_rtp: Et(e.target_rtp),
		min_multiplier: Et(e.min_multiplier, 2),
		max_multiplier: Et(e.max_multiplier, 2),
		min_order_amount: Et(e.min_order_amount, 8),
		max_order_amount: Et(e.max_order_amount, 8)
	};
	if (Y(Ot(t.target_rtp, "0") > 0 && Ot(t.target_rtp, "1") <= 0, "INVALID_GRID_CONFIGURATION"), Y(Ot(t.min_multiplier, "1") >= 0 && Ot(t.max_multiplier, t.min_multiplier) >= 0, "INVALID_GRID_CONFIGURATION"), Y(Ot(t.min_order_amount, "0") > 0 && Ot(t.max_order_amount, t.min_order_amount) >= 0, "INVALID_GRID_CONFIGURATION"), "config_id" in e) {
		for (let n of [
			"config_id",
			"default_config_id",
			"default_version",
			"default_resolution_epoch"
		]) Y(typeof e[n] == "string" && _t.test(e[n]) && Ot(e[n], "9223372036854775807") <= 0), t[n] = e[n];
		Y(typeof e.requested_agent_id == "string" && /^(0|[1-9][0-9]*)$/.test(e.requested_agent_id) && Ot(e.requested_agent_id, "9223372036854775807") <= 0), Y(e.agent_id === null || e.agent_id === e.requested_agent_id && e.agent_id !== "0"), t.requested_agent_id = e.requested_agent_id, t.agent_id = e.agent_id;
		for (let n of [
			"inherited",
			"default_enabled",
			"effective_enabled"
		]) Y(typeof e[n] == "boolean"), t[n] = e[n];
		for (let n of [
			"default_target_rtp",
			"default_min_order_amount",
			"default_max_order_amount"
		]) t[n] = Et(e[n]);
	}
	return "availability_version" in e && (Y(typeof e.availability_version == "string" && /^(0|[1-9][0-9]*)$/.test(e.availability_version) && Ot(e.availability_version, "9223372036854775807") <= 0), t.availability_version = e.availability_version), Object.assign(t, ft(e, Et)), "layout" in e && (t.layout = Vt(e.layout)), t;
}
function Wt(e, t, n) {
	let r = Ut(e);
	return Y(r.site_id === t && r.symbol === n, "INVALID_GRID_TARGET"), r;
}
function Gt(e, t, n, r, i, a = !1) {
	if (wt(e) && e.site_version === "0") return Kt(e, t, n, r, i, a);
	let o = wt(e) && wt(e.layout) ? e.layout.price_band_width : void 0, s = wt(t) && wt(t.layout) ? t.layout.price_band_width : void 0;
	Y(o === s || !It(s), "INVALID_LAYOUT_PRECISION");
	let c = Ut(e), l = Ut(t);
	Y(c.site_id === l.site_id && c.symbol === l.symbol, "INVALID_GRID_TARGET"), Y(typeof n == "string" && n.length <= 500 && n.trim().length > 0 && !n.includes("\0"), "INVALID_REASON"), Y(typeof r == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(r), "INVALID_REQUEST_ID"), Y(c.config_id && c.default_version && c.default_resolution_epoch, "CONFIG_IDENTITY_REQUIRED"), Y(bt.every((e) => c[e] === l[e]), "INVALID_GRID_TARGET"), Y(JSON.stringify(ft(c, Et)) === JSON.stringify(ft(l, Et)), "INVALID_GRID_TARGET");
	let u = {};
	for (let e of Ct) c[e] !== l[e] && (u[e] = l[e]);
	for (let e of St) c.layout?.[e] !== l.layout?.[e] && (Y(a && c.layout?.editable && l.layout, "FIELD_FORBIDDEN"), u[e] = l.layout[e]);
	if (c.requested_agent_id !== "0" && !(u.enabled === !1 && Object.keys(u).length === 1) && (Y(!l.enabled || c.default_enabled, "PLATFORM_LIMIT"), Y(Ot(l.target_rtp, c.default_target_rtp) <= 0 && Ot(l.min_order_amount, c.default_min_order_amount) >= 0 && Ot(l.max_order_amount, c.default_max_order_amount) <= 0, "PLATFORM_LIMIT")), St.some((e) => e in u)) {
		let e = c.layout;
		"price_decimals" in u && Rt(u.price_decimals), zt(l.layout.price_band_width, l.layout.price_decimals), Ft(u.price_band_width ?? e.price_band_width, 18), "column_duration_seconds" in u && Pt(u.column_duration_seconds);
		let t = Nt(u.column_duration_seconds ?? e.column_duration_seconds);
		Y(Ot(e.row_count, "10000") <= 0 && Ot(e.column_count, "10000") <= 0 && Number(e.row_count) * Number(e.column_count) <= 1e4, "INVALID_GRID_LAYOUT"), Bt(e.column_count, t);
	}
	if (!i && ("min_multiplier" in u || "max_multiplier" in u)) throw Error("FIELD_FORBIDDEN");
	return Y(Object.keys(u).length > 0, "EMPTY_CHANGES"), {
		site_id: c.site_id,
		symbol: c.symbol,
		based_on_layout_version: c.layout_version,
		based_on_site_version: c.site_version,
		based_on_config_id: c.config_id,
		...c.requested_agent_id === "0" && u.enabled === !0 && c.availability_version !== void 0 ? { based_on_availability_version: c.availability_version } : {},
		...pt(c) ? { based_on_global_version: pt(c) } : {},
		based_on_default_version: c.default_version,
		based_on_default_resolution_epoch: c.default_resolution_epoch,
		client_request_id: r,
		reason: n,
		changes: u
	};
}
function Kt(e, t, n, r, i, a) {
	Y(i && a && wt(t) && e.site_id === t.site_id && e.symbol === t.symbol, "INVALID_GRID_TARGET"), Y(e.layout_version === t.layout_version && t.site_version === "0", "INVALID_GRID_TARGET"), e.layout_version === "0" && wt(t.layout) && Y(!It(t.layout.price_band_width), "INVALID_LAYOUT_PRECISION");
	let o = Ut({
		...t,
		enabled: !1,
		site_version: "1",
		layout_version: e.layout_version === "0" ? "1" : e.layout_version
	}), s = { enabled: !1 };
	for (let e of Ct) e !== "enabled" && (s[e] = o[e]);
	let c = [
		"row_count",
		"column_count",
		...St
	];
	if (e.layout_version === "0") {
		Y(o.layout, "INVALID_GRID_LAYOUT"), Pt(o.layout.column_duration_seconds);
		for (let e of c) e === "price_decimals" && o.layout.price_decimals == null || (s[e] = o.layout[e]);
		zt(o.layout.price_band_width, o.layout.price_decimals);
	} else {
		let t = e.layout;
		Y(wt(t) && o.layout && c.every((e) => t[e] === o.layout[e]), "FIELD_FORBIDDEN");
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
	return qt(l), l;
}
function qt(e) {
	if (Y(wt(e), "PENDING_CORRUPT"), Tt(e, [
		...yt,
		..."based_on_config_id" in e ? xt : [],
		..."based_on_global_version" in e ? ["based_on_global_version"] : [],
		..."based_on_availability_version" in e ? ["based_on_availability_version"] : []
	]), "based_on_availability_version" in e && Y(typeof e.based_on_availability_version == "string" && /^(0|[1-9][0-9]*)$/.test(e.based_on_availability_version) && Ot(e.based_on_availability_version, "9223372036854775807") <= 0 && wt(e.changes) && e.changes.enabled === !0, "PENDING_CORRUPT"), "based_on_global_version" in e && Y(typeof e.based_on_global_version == "string" && /^(0|[1-9][0-9]*)$/.test(e.based_on_global_version) && Ot(e.based_on_global_version, "9223372036854775807") <= 0, "PENDING_CORRUPT"), "based_on_config_id" in e) for (let t of xt) Y(typeof e[t] == "string" && _t.test(e[t]) && Ot(e[t], "9223372036854775807") <= 0, "PENDING_CORRUPT");
	Y(typeof e.site_id == "string" && e.site_id.length > 0 && e.site_id.length <= 64 && e.site_id.trim() === e.site_id, "PENDING_CORRUPT"), Y(typeof e.symbol == "string" && vt.test(e.symbol), "PENDING_CORRUPT");
	let t = e.based_on_site_version === "0";
	Y(typeof e.based_on_layout_version == "string" && (_t.test(e.based_on_layout_version) || t && e.based_on_layout_version === "0"), "PENDING_CORRUPT"), Y(typeof e.based_on_site_version == "string" && (t || _t.test(e.based_on_site_version)), "PENDING_CORRUPT"), Y(typeof e.client_request_id == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(e.client_request_id), "PENDING_CORRUPT"), Y(typeof e.reason == "string" && e.reason.length <= 500 && e.reason.trim().length > 0 && !e.reason.includes("\0"), "PENDING_CORRUPT");
	let n = [
		...Ct,
		...St,
		...t ? ["row_count", "column_count"] : []
	];
	Y(wt(e.changes) && Object.keys(e.changes).length > 0 && Object.keys(e.changes).every((e) => n.includes(e)), "PENDING_CORRUPT");
	for (let [t, n] of Object.entries(e.changes)) t === "enabled" ? Y(typeof n == "boolean", "PENDING_CORRUPT") : t === "row_count" || t === "column_count" ? Y(typeof n == "string" && /^[1-9]\d{0,4}$/.test(n), "INVALID_GRID_LAYOUT") : t === "price_decimals" ? Rt(n) : t === "price_band_width" ? Ft(n, 18) : t === "column_duration_seconds" ? Nt(n) : Et(n, t.includes("order_amount") ? 8 : t.includes("multiplier") ? 2 : void 0);
	if (t) {
		Y(!("based_on_config_id" in e) && e.changes.enabled === !1, "PENDING_CORRUPT");
		let t = e.based_on_layout_version === "0";
		if (Tt(e.changes, [...Ct, ...t ? [
			"row_count",
			"column_count",
			...St.filter((t) => t !== "price_decimals" || Object.prototype.hasOwnProperty.call(e.changes, t))
		] : []]), Ut({
			...Object.fromEntries(Ct.map((t) => [t, e.changes[t]])),
			site_id: e.site_id,
			symbol: e.symbol,
			site_version: "1",
			layout_version: "1",
			effective_from_ms: "0"
		}), Y(Ot(e.based_on_layout_version, "9223372036854775807") <= 0, "PENDING_CORRUPT"), t) {
			let t = e.changes;
			Y(Number(t.row_count) * Number(t.column_count) <= 1e4, "INVALID_GRID_LAYOUT"), Ft(t.price_band_width, 8), Bt(t.column_count, t.column_duration_seconds);
		}
	}
}
function Jt(e, t) {
	return wt(e) ? e.operation_status === "SUCCEEDED" && typeof e.operation_id == "string" && _t.test(e.operation_id) && e.site_id === t.command.site_id && e.symbol === t.command.symbol && typeof e.layout_version == "string" && _t.test(e.layout_version) && typeof e.site_version == "string" && _t.test(e.site_version) && typeof e.effective_from_ms == "string" && /^\d+$/.test(e.effective_from_ms) && typeof e.changed == "boolean" && [
		"PENDING",
		"DONE",
		"NOT_REQUIRED"
	].includes(String(e.cache_state)) : !1;
}
function Yt(e) {
	return wt(e) && e.error_code === "RECEIPT_UNCONFIRMED" && e.operation_status === "UNKNOWN";
}
var { readPending: Xt, persistPending: Zt, captureSaveReview: Qt, persistReviewedCommand: $t, pendingForActor: en, attemptPending: tn } = at(ht, qt, Jt), nn = class {
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
}, rn = [
	"game_type",
	"symbol",
	"based_on_template_version"
], an = {
	"config.save": [...rn, "platform_template"],
	"config.availability": [
		...rn,
		"action",
		"enabled"
	]
};
function on(e, t) {
	let n = t;
	return e === "routing.prepare" || e === "routing.cancel" ? n?.change?.receipt : e === "routing.commit" ? n?.binding?.receipt : n?.receipt;
}
var sn = class {
	busy = !1;
	key;
	storage;
	action;
	constructor(e, t, n, r) {
		if (!t || !an[n] || !r) throw Error("无法确认当前操作上下文");
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
			...an[this.action],
			"reason",
			"client_request_id",
			...this.action === "config.save" && e.action === "save_parameters" ? ["action"] : []
		];
		if (Object.keys(e).some((e) => !t.includes(e)) || typeof e.reason != "string" || !e.reason.trim() || e.reason.length > 500 || typeof e.client_request_id != "string" || !e.client_request_id || e.client_request_id.length > 128) throw Error("操作记录字段无效");
		if (an[this.action].some((t) => !Object.hasOwn(e, t))) throw Error("操作记录缺少必要字段");
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
			if (Le(r, t.enabled !== !0 && r.rules.every((e) => e.market_id === void 0 && (e.stake_tiers ?? []).every((e) => e.stake_tier_id === void 0))).length) throw Error("配置操作记录无效");
		}
	}
	begin(e, t = Mt()) {
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
			let n = await e(structuredClone(t.body)), i = on(this.action, n);
			if (typeof i?.operation_id != "string" || !i.operation_id || i.client_request_id !== t.body.client_request_id || i.result !== "OPERATION_RESULT_SUCCEEDED") throw Error("未收到可核验的成功回执");
			return this.ownsStoredIntent(t) && this.storage.removeItem(this.key), n;
		} catch (e) {
			let r = e, i = this.read();
			if (!i || JSON.stringify(i.body) !== JSON.stringify(t.body)) throw e;
			let a = et(e, t.body.client_request_id), o = i.attemptGeneration === t.attemptGeneration, s = !n && a !== "unverified", c = this.action === "config.save" && r?.error_code === "ERROR_CODE_MARK_PRICE_UNAVAILABLE", l = s && (c || [
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
}, cn = ["data-action"], ln = {
	key: 2,
	class: "pending-summary"
}, un = { key: 0 }, dn = {
	key: 5,
	role: "status"
}, fn = /*#__PURE__*/ n(/* @__PURE__ */ f({
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
		let r = e, c = n, l = ge(), f = i(() => Qe(l.perms, r.permission)), ee = v(""), p = v(""), m = v(""), h = v(!1), te = v(null), g = v(""), re = i(() => !!((te.value || r.newAllowed) && (p.value && !r.hideError || te.value && !r.hidePendingDetails || !te.value && !r.automaticReason || f.value && !r.hideButton || m.value && !r.hideSuccess))), ie, ae = 0;
		se(h, (e) => c("busy", e), { flush: "sync" });
		function y() {
			try {
				te.value = ie?.read() ?? null, c("pending", !!te.value);
			} catch (e) {
				g.value = we(e), p.value = g.value;
			}
		}
		se(() => [
			r.action,
			r.target,
			String(l.userInfo.id || "")
		], () => {
			if (ae++, h.value = !1, ee.value = "", p.value = "", m.value = "", g.value = "", te.value = null, c("pending", !1), ie = void 0, r.target) try {
				ie = new sn(sessionStorage, String(l.userInfo.id || ""), r.action, r.target), y();
			} catch (e) {
				g.value = we(e), p.value = g.value;
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
				s() && (p.value = we(e));
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
			te.value && !e.hidePendingDetails ? (_(), s("div", ln, [u(" 操作号：" + S(te.value.body.client_request_id), 1), e.automaticReason ? o("", !0) : (_(), s("span", un, " · 原因：" + S(te.value.body.reason), 1))])) : !te.value && !e.automaticReason ? (_(), a(w(F), {
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
			m.value && !e.hideSuccess ? (_(), s("p", dn, S(m.value), 1)) : o("", !0)
		], 8, cn)) : o("", !0);
	}
}), [["__scopeId", "data-v-e2bd32a3"]]), pn = (e = !1) => ({
	default_value: "",
	minimum_value: "",
	maximum_value: "",
	agent_editable: e
});
function mn(e, t, n) {
	return {
		is_new: !0,
		game_type: e,
		symbol: t,
		based_on_template_version: n,
		enabled: !1,
		rules: (e === "UP_DOWN" ? Ee : De).map((t) => ({
			duration_seconds: t,
			enabled_by_default: !0,
			minimum_stake: pn(!0),
			maximum_stake: pn(!0),
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
				target_payout_rate: pn(),
				minimum_odds: {
					default_value: "1",
					minimum_value: "1",
					maximum_value: "1",
					agent_editable: !1
				},
				maximum_odds: pn(),
				stake_tiers: [{
					enabled_by_default: !0,
					display_order: 1,
					minimum_stake: pn(!0),
					maximum_stake: pn(!0),
					retired: !1
				}]
			} : { fixed_odds: pn(!0) }
		}))
	};
}
function hn(e, t, n) {
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
var gn = ["inert", "aria-hidden"], _n = /*#__PURE__*/ n(/* @__PURE__ */ f({
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
			}, [y(n.$slots, "default", {}, void 0, !0)], 10, gn), d(w(t), {
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
				default: T(() => [d(w(H))]),
				_: 1
			})], 40, yn)]),
			default: T(() => [c("p", vn, S(s.value), 1)]),
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
	let ee = f.slice(-o).replace(/0+$/, "");
	return f.slice(0, -o) + (ee ? "." + ee : "");
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
		let n = e, r = L, o = t, s = V(), d = v(n.percentage ? Cn(n.modelValue, 2) : n.modelValue);
		se(() => [n.modelValue, n.percentage], () => {
			n.percentage && Cn(d.value, -2) === n.modelValue || (d.value = n.percentage ? Cn(n.modelValue, 2) : n.modelValue);
		});
		let f = (e) => Sn(d.value, n.step, e, n.min, n.max), ee = i(() => f(1)), p = i(() => f(-1));
		function h(e) {
			if (s.value) return;
			d.value = e;
			let t = n.percentage ? Cn(e, -2) : e;
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
			suffix: T(() => [c("span", wn, [c("button", {
				type: "button",
				tabindex: "-1",
				"aria-label": "增加数值",
				disabled: w(s) || ee.value === null || ee.value === d.value,
				onMousedown: n[0] ||= D(() => {}, ["prevent"]),
				onClick: n[1] ||= (e) => te(1)
			}, [...n[6] ||= [c("svg", {
				viewBox: "0 0 12 12",
				"aria-hidden": "true"
			}, [c("path", { d: "m3 7 3-3 3 3" })], -1)]], 40, Tn), c("button", {
				type: "button",
				tabindex: "-1",
				"aria-label": "减少数值",
				disabled: w(s) || p.value === null || p.value === d.value,
				onMousedown: n[2] ||= D(() => {}, ["prevent"]),
				onClick: n[3] ||= (e) => te(-1)
			}, [...n[7] ||= [c("svg", {
				viewBox: "0 0 12 12",
				"aria-hidden": "true"
			}, [c("path", { d: "m3 5 3 3 3-3" })], -1)]], 40, En)])]),
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
}), [["__scopeId", "data-v-ecdf8293"]]), On = ["aria-label"], kn = { class: "prediction-constraint__title" }, An = {
	key: 0,
	class: "constraint-description"
}, jn = /*#__PURE__*/ n(/* @__PURE__ */ f({
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
			get: () => n.percentage ? We(r.value[n.field]) : r.value[n.field],
			set: (e) => {
				let t = r.value[n.field], i = n.percentage ? Ge(e) : e;
				n.field === "default_value" && r.value.maximum_value === t && (n.agentLocked && r.value.minimum_value === t && (r.value.minimum_value = i), r.value.maximum_value = i), r.value[n.field] = i;
			}
		});
		return (n, r) => (_(), s("div", {
			class: te(["prediction-constraint", { "is-compact": t.compact }]),
			role: "group",
			"aria-label": t.title
		}, [
			c("div", kn, [u(S(t.title), 1), d(bn, { label: t.title }, null, 8, ["label"])]),
			d(Dn, {
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
			t.description ? (_(), s("p", An, S(t.description), 1)) : o("", !0)
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
		return se(() => n.context, ne, { flush: "sync" }), (t, n) => (_(), s("div", Mn, [
			c("div", Nn, [(_(!0), s(r, null, ae(f.value, (t) => (_(), s("span", {
				key: t.key,
				class: te(["room-tag", { active: e.selected === t.key }])
			}, [c("button", {
				type: "button",
				"data-room-choice": t.key,
				"aria-pressed": e.selected === t.key,
				onClick: (e) => l("select", t.key)
			}, S(t.label), 9, Pn), c("button", {
				type: "button",
				class: "room-remove",
				"data-room-remove": t.key,
				"aria-label": `删除${t.label}房间`,
				disabled: e.disabled,
				onClick: (e) => re(t)
			}, "×", 8, Fn)], 2))), 128)), d(w(k), {
				class: "room-add",
				"data-room-add": !0,
				disabled: e.disabled || !ee.value.length,
				onClick: ie
			}, {
				default: T(() => [...n[1] ||= [u("＋ 新增周期", -1)]]),
				_: 1
			}, 8, ["disabled"])]),
			f.value.length ? o("", !0) : (_(), s("p", In, "暂无房间，可从固定周期中新增。保存后生效。")),
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
					c("p", Ln, S(e.description) + " · " + S(m.value?.label), 1),
					n[2] ||= c("p", { class: "dialog-description" }, "删除后该房间将从当前配置中移除，点击保存配置后停止生效。", -1),
					n[3] ||= c("p", { class: "dialog-note" }, "该操作不会影响已创建订单，历史订单仍保留原配置快照。后续可从固定周期中重新添加。", -1)
				], 64)) : (_(), s(r, { key: 1 }, [n[4] ||= c("label", { class: "dialog-label" }, "预测周期", -1), d(w(ue), {
					modelValue: h.value,
					"onUpdate:modelValue": n[0] ||= (e) => h.value = e,
					placeholder: "请选择周期",
					style: { width: "100%" },
					disabled: e.disabled
				}, {
					default: T(() => [(_(!0), s(r, null, ae(ee.value, (e) => (_(), a(w(z), {
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
	key: 2,
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
		let { predictionConfigurationDetail: f, predictionConfigurationList: ee, predictionConfigurationSave: p } = me().api, m = t, h = v(), g = v(), re = v(!1), ie = v();
		function y() {
			g.value?.submit();
		}
		function x() {
			ie.value?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		let oe = l, E = ge(), D = v(!1), j = v(!1), M = v(""), P = v(), I = v(!1), L = i(() => Qe(E.perms, "prediction_config:edit")), R = v(""), z = v("UP_DOWN"), B = v(""), ue = i({
			get: () => P.value?.rules[0]?.price_rule.price_decimals ?? void 0,
			set: (e) => {
				if (!(!P.value || !L.value || !Te.value.ready || I.value || re.value)) for (let t of P.value.rules) t.price_rule.price_decimals = e ?? null;
			}
		}), V = v("");
		se(ue, (e) => {
			Number.isNaN(e) || (V.value = e == null ? "" : String(e));
		}, {
			immediate: !0,
			flush: "sync"
		});
		let H = i({
			get: () => V.value,
			set: (e) => {
				!P.value || !L.value || !Te.value.ready || I.value || re.value || (V.value = e, ue.value = e === "" ? void 0 : /^[0-8]$/.test(e) ? Number(e) : NaN);
			}
		}), pe = v(!1), U = i(() => P.value?.game_type === "UP_DOWN" ? [...P.value.rules].sort((e, t) => Ee.indexOf(e.duration_seconds) - Ee.indexOf(t.duration_seconds)) : P.value?.rules ?? []), W = i(() => U.value.filter((e) => e.enabled_by_default)), G = i(() => U.value.map((e) => ({
			key: e.duration_seconds,
			label: Ce(e.duration_seconds, P.value?.game_type),
			present: e.enabled_by_default,
			allowed: !0
		}))), he = i(() => m.inline ? h.value?.enabled_by_default ? [h.value] : [] : W.value);
		function _e(e) {
			h.value = W.value.find((t) => t.duration_seconds === e);
		}
		function ve(e, t) {
			if (!L.value || !Te.value.ready || I.value || re.value) return;
			let n = U.value.find((t) => t.duration_seconds === e);
			!n || n.enabled_by_default === t || (n.enabled_by_default = t, h.value = t ? n : W.value[0]);
		}
		let ye = v(0), be = v(0), xe = v(""), Se = v(""), K, q = i(() => String(E.userInfo.id || "")), Te = i(() => ({
			target: R.value,
			generation: ye.value,
			actor: xe.value,
			enabled: P.value?.enabled,
			roomDurations: W.value.map((e) => e.duration_seconds),
			loading: j.value,
			pending: I.value,
			saving: re.value,
			saveError: g.value?.error || "",
			isNew: !!P.value?.is_new,
			dirty: !!(P.value && Se.value && JSON.stringify(P.value) !== Se.value),
			ready: !!(P.value && !j.value && !M.value && be.value === ye.value && xe.value === q.value && `${P.value.game_type}:${P.value.symbol}` === R.value)
		}));
		se(P, () => {
			m.externalSave && !j.value && g.value?.clearFeedback();
		}, {
			deep: !0,
			flush: "sync"
		});
		function De(e, t) {
			let n = P.value;
			if (!n || !Se.value || n.based_on_template_version !== e || !Te.value.ready) return;
			let r = JSON.parse(Se.value);
			n.based_on_template_version = r.based_on_template_version = t.template_version, t.rules[0]?.game_type === "GAME_TYPE_" + n.game_type && t.rules[0].symbol === n.symbol && (n.enabled = r.enabled = t.symbol_enabled), Se.value = JSON.stringify(r);
		}
		se(() => [
			q.value,
			Qe(E.perms, "prediction_config:lists"),
			L.value
		], () => {
			ye.value++, K?.abort(), j.value = !1;
		}, { flush: "sync" });
		function Oe(e, t) {
			if (!e.rules.length || e.rules.some((e) => e.game_type !== `GAME_TYPE_${z.value}` || e.symbol !== B.value)) throw Error("返回配置与当前币种或玩法不匹配，请重新加载");
			let n = h.value?.duration_seconds;
			P.value = Fe(e), pe.value = !1, Se.value = JSON.stringify(P.value), be.value = t, xe.value = q.value, h.value = W.value.find((e) => e.duration_seconds === n) || W.value[0];
		}
		async function ke() {
			if (!Qe(E.perms, "prediction_config:lists")) return;
			K?.abort(), K = new AbortController();
			let e = ++ye.value, t = z.value, n = B.value;
			j.value = !0, M.value = "";
			try {
				if (pe.value) {
					if (!L.value) throw Error("没有配置新增权限");
					let r = await ee({}, K.signal);
					if (e !== ye.value) return;
					let i = hn(r, t, n);
					return i.existing ? Oe(i.existing, e) : (P.value = mn(t, n, i.version), Se.value = JSON.stringify(P.value), be.value = e, xe.value = q.value, h.value = W.value[0]), e;
				}
				let r = await f({
					game_type: t,
					symbol: n
				}, K.signal);
				if (e === ye.value) return Oe(r.configuration, e), e;
			} catch (t) {
				e === ye.value && (M.value = we(t));
			} finally {
				e === ye.value && (j.value = !1);
			}
		}
		async function Ae(e, t, n, r = !1) {
			if (z.value = e, B.value = t, R.value = `${e}:${t}`, pe.value = r, P.value = void 0, Se.value = "", h.value = void 0, I.value = !1, D.value = !0, n && Qe(E.perms, "prediction_config:lists")) {
				K?.abort();
				let e = ++ye.value;
				j.value = !1, M.value = "";
				try {
					return Oe(n, e), e;
				} catch (e) {
					M.value = we(e);
					return;
				}
			}
			return await ke();
		}
		function je() {
			if (!P.value) throw Error("请先加载配置");
			let e = Le(C(P.value));
			if (e.length) throw Error(J(e, P.value.game_type, h.value?.duration_seconds || P.value.rules[0]?.duration_seconds || ""));
			let { client_request_id: t, reason: n, ...r } = Ie(C(P.value), "", "");
			return m.inline ? {
				...r,
				action: "save_parameters",
				platform_template: { rules: r.platform_template.rules }
			} : r;
		}
		async function Me(e) {
			let t = await p(e), n = t.configuration;
			if (!n?.rules?.length || n.rules.some((t) => t.symbol !== e.symbol || t.game_type !== "GAME_TYPE_" + e.game_type) || !/^[1-9]\d*$/.test(n.template_version)) throw Error("保存回执与当前币种或玩法不符，请核验原操作");
			return {
				...t,
				priorVersion: e.based_on_template_version
			};
		}
		function Ne(e) {
			le.success("保存成功");
			let { configuration: t, priorVersion: n } = e;
			if (P.value && BigInt(P.value.based_on_template_version) > BigInt(t.template_version)) {
				ke();
				return;
			}
			Oe(t, ye.value), oe("success", t, n);
		}
		async function Pe() {
			j.value || I.value || re.value || await ke();
		}
		return ne(() => {
			ye.value++, K?.abort();
		}), n({
			open: Ae,
			focusSave: x,
			saveConfig: y,
			editingState: Te,
			appliedSwitch: De
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
				t.externalSave && Te.value.saveError ? (_(), a(w(O), {
					key: 1,
					title: Te.value.saveError,
					type: I.value ? "warning" : "error",
					closable: !1,
					"show-icon": ""
				}, null, 8, ["title", "type"])) : o("", !0),
				d(_n, {
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
					}, [D.value && L.value ? (_(), a(fn, {
						key: 0,
						ref_key: "writeRef",
						ref: g,
						"hide-button": t.externalSave,
						"hide-success": "",
						"hide-pending-details": t.externalSave,
						"hide-error": t.externalSave,
						action: "config.save",
						target: R.value,
						permission: "prediction_config:edit",
						label: "保存配置",
						"automatic-reason": "通过总后台玩法配置页面保存配置",
						disabled: j.value || !Te.value.ready,
						payload: je,
						send: Me,
						onPending: i[0] ||= (e) => I.value = e,
						onBusy: i[1] ||= (e) => re.value = e,
						onSuccess: Ne
					}, null, 8, [
						"hide-button",
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
							header: T(() => [c("div", zn, [c("div", null, [c("h3", null, S(P.value.game_type === "UP_DOWN" ? "房间配置" : "周期配置"), 1), c("p", null, S(P.value.symbol) + " · " + S(P.value.game_type === "UP_DOWN" ? "涨跌预测" : "自选预测"), 1)]), t.inline ? o("", !0) : (_(), a(w(de), {
								key: 0,
								modelValue: P.value.enabled,
								"onUpdate:modelValue": i[2] ||= (e) => P.value.enabled = e,
								disabled: !L.value || I.value || P.value.is_new,
								"active-text": "开放",
								"inactive-text": "停用"
							}, null, 8, ["modelValue", "disabled"]))])]),
							default: T(() => [c("div", Bn, S(P.value.game_type === "UP_DOWN" ? "支持房间" : "支持周期"), 1), d(Rn, {
								description: `${P.value.symbol} · ${P.value.game_type === "UP_DOWN" ? "涨跌预测" : "自选预测"}`,
								rooms: G.value,
								selected: h.value?.duration_seconds || "",
								disabled: !L.value || !Te.value.ready || I.value || re.value,
								context: `${q.value}:${R.value}:${ye.value}`,
								onSelect: _e,
								onChange: ve
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
								default: T(() => [c("div", Vn, [d(w(F), { label: "价格小数位" }, {
									default: T(() => [d(Dn, {
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
										disabled: !L.value || !Te.value.ready || I.value || re.value
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
							default: T(() => [(_(!0), s(r, null, ae(he.value, (n, l) => (_(), s("section", {
								key: n.market_id || l,
								class: "rule",
								"data-room": n.duration_seconds
							}, [
								t.inline ? o("", !0) : (_(), s("div", Un, [c("strong", null, S(w(Ce)(n.duration_seconds, P.value.game_type)) + S(P.value.game_type === "UP_DOWN" ? "房间" : ""), 1)])),
								P.value.game_type === "UP_DOWN" ? (_(), a(w(A), {
									key: 1,
									shadow: "never",
									class: "config-group round-time-summary"
								}, {
									header: T(() => [c("div", Wn, [c("div", null, [c("h3", null, " 场次时间 · " + S(w(Ce)(n.duration_seconds, P.value.game_type)) + "房间 ", 1), i[9] ||= c("p", null, "每个场次的下注开放时间固定为 30 秒", -1)]), d(w(fe), { size: "small" }, {
										default: T(() => [u(S(w(Ce)(n.duration_seconds, P.value.game_type)), 1)]),
										_: 2
									}, 1024)])]),
									_: 2
								}, 1024)) : o("", !0),
								d(w(A), {
									shadow: "never",
									class: "config-group"
								}, {
									header: T(() => [c("div", Gn, [c("div", null, [c("h3", null, " 赔率配置 · " + S(w(Ce)(n.duration_seconds, P.value.game_type)), 1), c("p", null, S(P.value.game_type === "UP_DOWN" ? "上涨赔率 = 1 + 目标返奖率 × 下跌池 ÷（上涨池＋本次下注）；下跌赔率反向计算。下注期间为预计倍率，封盘后锁定最终倍率。" : "用户下单时按当前周期固定赔率锁定，订单存储赔率快照"), 1)]), d(w(fe), {
										size: "small",
										effect: "plain"
									}, {
										default: T(() => [u(S(P.value.game_type === "UP_DOWN" ? "动态赔率" : "固定赔率"), 1)]),
										_: 1
									})])]),
									default: T(() => [c("div", { class: te(["odds-fields", { "one-field": P.value.game_type === "HIGH_LOW" }]) }, [P.value.game_type === "HIGH_LOW" && n.fixed_odds ? (_(), a(jn, {
										key: 0,
										modelValue: n.fixed_odds,
										"onUpdate:modelValue": (e) => n.fixed_odds = e,
										compact: "",
										unit: "x",
										title: "固定赔率",
										description: "上涨和下跌使用相同赔率，且必须小于 2"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])) : o("", !0), P.value.game_type === "UP_DOWN" ? (_(), s(r, { key: 1 }, [n.target_payout_rate ? (_(), a(jn, {
										key: 0,
										modelValue: n.target_payout_rate,
										"onUpdate:modelValue": (e) => n.target_payout_rate = e,
										compact: "",
										"agent-locked": "",
										percentage: "",
										title: "目标返奖率",
										description: "例如 90%：按对方资金池的 90% 计算可分配收益，且必须小于 100%"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])) : o("", !0), n.maximum_odds ? (_(), a(jn, {
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
									header: T(() => [c("div", Kn, [c("div", null, [c("h3", null, " 下注限制 · " + S(w(Ce)(n.duration_seconds, P.value.game_type)), 1), c("p", null, S(P.value.symbol) + " 当前" + S(P.value.game_type === "UP_DOWN" ? "房间" : "周期") + "的单笔下注范围 ", 1)]), d(w(fe), { size: "small" }, {
										default: T(() => [u(S(w(Ce)(n.duration_seconds, P.value.game_type)), 1)]),
										_: 2
									}, 1024)])]),
									default: T(() => [c("div", qn, [d(w(F), { label: "单笔最小额（USDT）" }, {
										label: T(() => [i[10] ||= u("单笔最小额（USDT）", -1), d(bn, {
											label: "单笔最小额",
											content: "此房间允许的最低单笔下注额。商户可在总后台单笔范围内调整自己的最小额和最大额。"
										})]),
										default: T(() => [d(Dn, {
											"input-component": w(e),
											"aria-label": "单笔最小额",
											unit: "USDT",
											"model-value": n.minimum_stake.default_value,
											"onUpdate:modelValue": (e) => w(Ke)(n, "minimum_stake", e)
										}, null, 8, [
											"input-component",
											"model-value",
											"onUpdate:modelValue"
										])]),
										_: 2
									}, 1024), d(w(F), { label: "单笔最大额（USDT）" }, {
										label: T(() => [i[11] ||= u("单笔最大额（USDT）", -1), d(bn, {
											label: "单笔最大额",
											content: "此房间允许的最高单笔下注额。修改生效后，对应房间的商户限额重置为总后台范围。"
										})]),
										default: T(() => [d(Dn, {
											"input-component": w(e),
											"aria-label": "单笔最大额",
											unit: "USDT",
											"model-value": n.maximum_stake.default_value,
											"onUpdate:modelValue": (e) => w(Ke)(n, "maximum_stake", e)
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
				M.value || !t.inline || Te.value.dirty ? (_(), s("div", Jn, [
					Te.value.dirty ? (_(), a(w(k), {
						key: 0,
						"data-config-discard": !0,
						disabled: j.value || I.value || re.value,
						onClick: Pe
					}, {
						default: T(() => [...i[12] ||= [u("放弃修改并重新加载", -1)]]),
						_: 1
					}, 8, ["disabled"])) : o("", !0),
					M.value ? (_(), a(w(k), {
						key: 1,
						disabled: j.value,
						onClick: ke
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
}), [["__scopeId", "data-v-09646975"]]), Xn = { class: "guide-body" }, Zn = { class: "guide-example" }, Qn = { class: "guide-formulas" }, $n = { class: "guide-footer" }, er = /*#__PURE__*/ n(/* @__PURE__ */ f({
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
			footer: T(() => [c("div", $n, [i[24] ||= c("span", null, "核心规则：有效时间内，连续有效价格进入或穿过对应价格范围一次，即为命中。", -1), d(w(k), {
				type: "primary",
				onClick: i[0] ||= (e) => t.value = !1
			}, {
				default: T(() => [...i[23] ||= [u("我知道了", -1)]]),
				_: 1
			})])]),
			default: T(() => [c("div", Xn, [
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
						c("p", null, [d(w(fe), { type: "success" }, {
							default: T(() => [...i[3] ||= [u("命中", -1)]]),
							_: 1
						}), i[4] ||= u(" 10:00:05 价格到达 65,015，进入了格子价格范围。", -1)]),
						c("p", null, [d(w(fe), { type: "success" }, {
							default: T(() => [...i[5] ||= [u("命中", -1)]]),
							_: 1
						}), i[6] ||= u(" 连续有效行情从 65,005 到达 65,025，线段中间穿过了这个格子，也算碰到。", -1)]),
						c("p", null, [d(w(fe), { type: "danger" }, {
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
					c("article", Qn, [i[13] ||= c("h4", null, [u("原型计算公式示例 "), c("small", null, "时间单位统一为 500ms")], -1), (_(), s(r, null, ae(n, (e) => c("div", { key: e.title }, [
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
function tr(e, t) {
	let n = e, r = (e) => typeof e == "string" && /^(0|[1-9]\d{0,18})$/.test(e) && Ot(e, "9223372036854775807") <= 0;
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
	} : Vt({
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
		let { gridConfigSymbols: l, gridConfigCatalog: f, gridConfigCreation: ee, gridConfigReceipt: p, gridConfigSite: m, saveGridConfig: h } = me().grid, g = _e(), re = ge(), ie = (e) => re.perms.includes("*") || re.perms.includes(e), y = i(() => ie("grid_config:read")), b = i(() => ie("grid_config:save")), x = i(() => {
			let e = String(re.userInfo.id || "");
			return /^[1-9]\d*$/.test(e) ? e : "";
		}), oe = v([]), E = v(""), A = v(""), j = v(""), M = v(null), N = v(null), I = v(""), L = v("通过预测网格配置页面保存配置"), B = v(!1), fe = v(!1), V = v(!1), H = v(!1), pe = v(!1), U = v(""), W = v(""), G = v("info"), he = v(null), ye = v(!1), be = v(""), xe = v(!1), Ce = new nn(), we = new nn(), K = new nn(), q, Te = 0, Ee = i(() => y.value ? x.value ? "" : "无法确认当前操作人身份" : "当前账号没有预测网格配置查询权限"), De = i(() => oe.value.find((e) => e.site_id === E.value)), Oe = v([]), ke = v(""), Ae = i(() => Xe(De.value?.products ?? [], Oe.value)), je = i(() => {
			let e = j.value.trim().toUpperCase();
			return Ae.value.filter((t) => !e || t.symbol.includes(e));
		}), Me = i(() => M.value?.site_version === "0"), Ne = i(() => y.value && b.value && !!x.value && fe.value && !ke.value && !V.value && !he.value && !ye.value && !pe.value);
		function Pe(e) {
			if (!e || !N.value) return !1;
			if (Me.value) return JSON.stringify(e) !== JSON.stringify(N.value) || I.value !== "";
			try {
				return Ht(e, N.value, !0) || At(e.target_rtp) !== I.value || [
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
		let Fe = i(() => Pe(M.value)), Ie = i(() => Pe(M.value ? mt(C(M.value), b.value) : null)), Le = i(() => he.value ? he.value.operator_id === x.value ? "bound" : "foreign" : "none"), J = i(() => Le.value === "bound" ? he.value : null), Re = i(() => Le.value === "foreign"), ze = i(() => Ie.value || !!he.value || pe.value), Be = i(() => y.value && b.value && (Me.value || !!De.value?.can_edit) && !!x.value && !!M.value && !he.value && !ye.value && !H.value && !pe.value), Ve = i(() => Be.value && !!M.value?.layout?.editable), He = i({
			get: () => {
				let e = N.value?.layout?.price_decimals;
				return e != null && (e <= 8 || Number.isNaN(e)) ? e : void 0;
			},
			set: (e) => {
				!Ve.value || !N.value?.layout || (N.value.layout.price_decimals = e ?? null, dt());
			}
		}), Ue = v("");
		se(He, (e) => {
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
		}), Ge = i(() => !!Ve.value && !!N.value?.layout && M.value?.layout?.price_band_width !== N.value.layout.price_band_width && It(N.value.layout.price_band_width)), Ke = i(() => Be.value && (Me.value || !!De.value?.can_edit_limits)), qe = i(() => !!J.value && y.value && b.value && (J.value.command.based_on_site_version === "0" || oe.value.some((e) => e.site_id === J.value.command.site_id && e.can_edit && e.products.some((e) => e.symbol === J.value.command.symbol)))), Je = i(() => qe.value && fe.value && !V.value && !H.value && !pe.value && !ye.value && !xe.value && be.value === JSON.stringify(J.value));
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
		let Ze = i(() => {
			let e = [M.value?.effective_from_ms, M.value?.layout?.effective_from_ms].filter((e) => typeof e == "string" && /^[1-9][0-9]*$/.test(e)).reduce((e, t) => BigInt(e) > BigInt(t) ? e : t, "0");
			return e === "0" ? "未提供" : Se(e);
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
				let e = en(sessionStorage, x.value);
				he.value = e.pending ?? null, ye.value = !1;
			} catch {
				ye.value = !0, he.value = null;
			}
		}
		function et() {
			return `${x.value}:${E.value}:${A.value}`;
		}
		function tt() {
			we.close(), M.value = null, N.value = null, I.value = "", L.value = "通过预测网格配置页面保存配置", H.value = !1;
		}
		async function nt(e) {
			if (Ce.close(), K.close(), be.value = "", fe.value = !1, tt(), oe.value = [], Oe.value = [], ke.value = "", E.value = "", A.value = "", j.value = "", U.value = "", W.value = "", $e(), Ee.value || ye.value) return;
			let t = Ce.next(x.value);
			V.value = !0;
			try {
				let [n, r] = await Promise.allSettled([f(t.signal), l(t.signal)]);
				if (!t.current(x.value)) return;
				if (r.status === "fulfilled" && Array.isArray(r.value) && r.value.every((e) => typeof e == "string") ? Oe.value = r.value : ke.value = "通用币种目录暂不可用，当前仅显示已授权的网格配置。", n.status === "rejected") throw n.reason;
				oe.value = Qe(n.value), fe.value = !0;
				let i = J.value ?? (e ? { command: e } : null), a = i && (i.command.based_on_site_version === "0" || oe.value.some((e) => e.site_id === i.command.site_id)) ? i.command.site_id : oe.value[0]?.site_id || "";
				E.value = a;
				let o = oe.value.find((e) => e.site_id === a), s = i && i.command.site_id === a && (i.command.based_on_site_version === "0" || o?.products.some((e) => e.symbol === i.command.symbol)) ? i.command.symbol : Ae.value.find((e) => e.configured)?.symbol || "";
				A.value = s, s && o?.products.some((e) => e.symbol === s) && (q = st());
			} catch (e) {
				t.current(x.value) && (U.value = Ye(e));
			} finally {
				t.current(x.value) && (V.value = !1);
			}
		}
		function rt(e) {
			ze.value || (tt(), E.value = e, A.value = Ae.value.find((e) => e.configured)?.symbol || "", A.value && (q = st()));
		}
		function it(e) {
			if (e === A.value && (M.value || H.value) || ze.value) return;
			let t = Ae.value.find((t) => t.symbol === e);
			!t || !t.configured && !Ne.value || (tt(), U.value = "", A.value = e, q = t.configured ? st() : at());
		}
		async function at() {
			if (tt(), !Ne.value || !A.value) return;
			let e = A.value, t = we.next(et());
			H.value = !0;
			try {
				let n = await ee(e, t.signal);
				if (!t.current(et()) || !b.value) return;
				let r = tr(n, e);
				M.value = r, N.value = mt(r, b.value), H.value = !1, E.value = r.site_id;
			} catch (e) {
				t.current(et()) && (U.value = Ye(e));
			} finally {
				t.current(et()) && (H.value = !1);
			}
		}
		function ot() {
			!Me.value || he.value || pe.value || (tt(), A.value = "", W.value = "");
		}
		async function st() {
			if (tt(), !y.value || !E.value || !A.value) return;
			let e = E.value, t = A.value, n = et(), r = we.next(n);
			H.value = !0;
			try {
				let n = await m(e, t, r.signal);
				if (!r.current(et())) return;
				let i = Wt(n, e, t);
				M.value = i, N.value = mt(i, b.value), I.value = At(i.target_rtp);
			} catch (e) {
				r.current(et()) && (U.value = Ye(e));
			} finally {
				r.current(et()) && (H.value = !1);
			}
		}
		function ct(e) {
			return e.symbol === A.value && N.value ? N.value.enabled : e.enabled;
		}
		function lt(e) {
			return !De.value?.products.some((t) => t.symbol === e.symbol) || !b.value || !De.value?.can_edit || H.value || pe.value || !!he.value || ye.value || Ie.value && e.symbol !== A.value;
		}
		async function ut(e, t) {
			typeof t != "boolean" || lt(e) || (e.symbol !== A.value && (it(e.symbol), await q), N.value && N.value.symbol === e.symbol && !lt(e) && (N.value.enabled = t, dt()));
		}
		function dt() {
			W.value = "";
		}
		async function ft() {
			if (!Be.value || !M.value || !N.value || !x.value) return;
			let e;
			try {
				e = Gt(M.value, {
					...N.value,
					target_rtp: jt(I.value)
				}, L.value, Mt(), Me.value || !!De.value?.can_edit_limits, !0);
			} catch (e) {
				if (e instanceof Error && e.message === "EMPTY_CHANGES") {
					W.value = "", le.success("保存成功");
					return;
				}
				G.value = "warning", W.value = Ye(e);
				return;
			}
			let t = Qt(x.value, e), n = vt(), r = "price_band_width" in e.changes || "column_duration_seconds" in e.changes || "price_decimals" in e.changes, i = Me.value ? " 首次创建后保持关闭。" : r ? ` 公共网格区间修改将影响站点：${M.value.layout.affected_site_ids.join("、")}。` : "";
			try {
				await R.confirm(`确认保存 ${e.site_id} / ${e.symbol} 的 ${Object.keys(e.changes).length} 项修改？${i}`, "确认预测网格配置", {
					type: "warning",
					confirmButtonText: "确认保存",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			}
			if ($e(), !Be.value || !M.value || !N.value || n !== vt()) {
				G.value = "warning", W.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let a;
			try {
				a = Gt(M.value, {
					...N.value,
					target_rtp: jt(I.value)
				}, L.value, t.command.client_request_id, Me.value || !!De.value?.can_edit_limits, !0);
			} catch {
				G.value = "warning", W.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let o;
			try {
				o = $t(sessionStorage, t, x.value, a), $e();
			} catch (e) {
				if (e?.message === "STALE_CONFIRMATION") {
					G.value = "warning", W.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
					return;
				}
				ye.value = !0;
				return;
			}
			gt(o, "save");
		}
		async function pt() {
			$e(), !(!J.value || !qe.value || pe.value || xe.value) && gt(J.value, "receipt");
		}
		async function ht() {
			if ($e(), !Je.value || !J.value) return;
			let e = J.value;
			xe.value = !0;
			try {
				await R.confirm(`确认恢复 ${e.command.site_id} / ${e.command.symbol} 的原请求 ${e.command.client_request_id}？将沿用原编号和原参数；已提交则返回原回执，尚未提交则保存原配置，不使用当前页面的新修改。`, "恢复原配置请求", {
					type: "warning",
					confirmButtonText: "确认恢复",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			} finally {
				xe.value = !1;
			}
			if ($e(), !Je.value || JSON.stringify(e) !== JSON.stringify(J.value)) {
				G.value = "warning", W.value = "确认期间账号、权限或原请求已变化，本次恢复已取消，请重新查询原操作回执";
				return;
			}
			await gt(e, "recover");
		}
		async function gt(e, t) {
			let n = ++Te, r = et(), i = K.next(r);
			pe.value = !0, be.value = "", W.value = "";
			try {
				let n = await tn(sessionStorage, e, t, (e, t) => e === "save" ? h(t) : p(t));
				if (!i.current(et())) return;
				if ($e(), n.status === "success") {
					let e = x.value;
					L.value = "通过预测网格配置页面保存配置", pe.value = !1, await nt(), e === x.value && (G.value = "warning", W.value = U.value ? "配置已保存；最新配置刷新失败，请手动刷新" : "", U.value || le.success("保存成功"));
				} else if (t === "recover" && n.status === "rejected" && n.error?.error_code === "VERSION_CONFLICT") if (!n.journalCleared || he.value || ye.value) G.value = "warning", W.value = "旧请求已明确拒绝，但本机待确认记录已变化，请重新核对当前记录";
				else {
					let t = x.value;
					if (await nt(e.command), E.value && A.value && q && await q, t === x.value) {
						G.value = "warning";
						let t = E.value === e.command.site_id && A.value === e.command.symbol && oe.value.some((t) => t.site_id === e.command.site_id && t.products.some((t) => t.symbol === e.command.symbol));
						W.value = "旧请求未生效，配置版本已变化；已清除旧待确认记录。" + (t ? U.value || !M.value ? "最新配置刷新失败，请手动刷新" : "请以当前配置为准" : `原目标当前不可见（${e.command.site_id} / ${e.command.symbol}），请核对权限和配置`);
					}
				}
				else G.value = n.status === "unknown" ? "warning" : "info", t === "receipt" && Yt(n.error) && JSON.stringify(J.value) === JSON.stringify(e) ? (be.value = JSON.stringify(e), W.value = "未找到原操作回执，可使用原编号和原参数恢复请求") : t === "recover" ? W.value = "恢复尚未确认，原请求已保留，请重新查询原操作回执 · " + Ye(n.error) : W.value = n.status === "unknown" ? "原操作结果仍待确认，请使用原请求查询回执" : "保存已明确拒绝，可修正后重新提交 · " + Ye(n.error);
			} catch (e) {
				i.current(et()) && ($e(), G.value = "warning", W.value = "原操作结果仍待确认 · " + Ye(e));
			} finally {
				n === Te && (pe.value = !1, $e());
			}
		}
		async function _t() {
			if (!ze.value) return !0;
			try {
				return await R.confirm("当前有未保存修改或待确认操作，离开不会删除原记录。仍要离开吗？", "离开预测网格配置", { type: "warning" }), !0;
			} catch {
				return !1;
			}
		}
		function vt() {
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
		async function yt() {
			if (!pe.value) {
				if (Ie.value) {
					let e = vt();
					try {
						await R.confirm("刷新会丢弃当前未保存修改，仍要刷新吗？", "刷新预测网格配置", { type: "warning" });
					} catch {
						return;
					}
					if (pe.value || e !== vt()) {
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
		return se(() => [
			x.value,
			y.value,
			b.value
		], () => nt(), { immediate: !0 }), ve(_t), window.addEventListener("beforeunload", bt), ne(() => {
			be.value = "", fe.value = !1, Ce.close(), we.close(), K.close(), window.removeEventListener("beforeunload", bt);
		}), n({
			hasBlockingWork: ze,
			confirmLeave: _t,
			refresh: yt,
			loading: V
		}), (t, n) => (_(), s("section", nr, [
			Ee.value ? (_(), a(w(O), {
				key: 0,
				title: Ee.value,
				type: "warning",
				closable: !1
			}, null, 8, ["title"])) : ye.value ? (_(), a(w(O), {
				key: 1,
				title: "本机保存的待确认操作记录已损坏或不可用，请停止操作并联系管理员核验",
				type: "error",
				closable: !1
			})) : Re.value ? (_(), a(w(O), {
				key: 2,
				title: "检测到其他账号尚未确认的预测网格配置操作，当前账号不可覆盖，请切回原账号查询回执",
				type: "error",
				closable: !1
			})) : o("", !0),
			U.value ? (_(), s("div", rr, [d(w(O), {
				title: U.value,
				type: "error",
				closable: !1
			}, null, 8, ["title"]), d(w(k), {
				loading: V.value || H.value,
				disabled: pe.value || !!he.value,
				onClick: yt
			}, {
				default: T(() => [...n[16] ||= [u("重试", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"])])) : o("", !0),
			W.value ? (_(), a(w(O), {
				key: 4,
				title: W.value,
				type: G.value,
				closable: !1
			}, null, 8, ["title", "type"])) : o("", !0),
			J.value ? (_(), s("div", ir, [c("div", null, [n[17] ||= c("strong", null, "原配置操作结果待确认", -1), c("small", null, S(J.value.command.site_id) + " · " + S(J.value.command.symbol) + " · " + S(J.value.command.client_request_id), 1)]), c("div", ar, [d(w(k), {
				type: "warning",
				loading: pe.value,
				disabled: !qe.value || xe.value,
				onClick: pt
			}, {
				default: T(() => [...n[18] ||= [u("查询原操作回执", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"]), Je.value || xe.value ? (_(), a(w(k), {
				key: 0,
				type: "warning",
				disabled: !Je.value,
				onClick: ht
			}, {
				default: T(() => [...n[19] ||= [u("恢复原请求", -1)]]),
				_: 1
			}, 8, ["disabled"])) : o("", !0)])])) : o("", !0),
			d(_n, {
				loading: V.value,
				"hide-content": V.value,
				"min-height": "0px",
				class: "grid-loading-workspace"
			}, {
				default: T(() => [c("div", or, [c("aside", sr, [
					c("div", cr, [n[20] ||= c("strong", null, "币种配置", -1), c("span", null, S(je.value.length) + " 条", 1)]),
					oe.value.length > 1 ? (_(), a(w(ue), {
						key: 0,
						modelValue: E.value,
						"onUpdate:modelValue": n[0] ||= (e) => E.value = e,
						"aria-label": "选择站点",
						disabled: ze.value,
						onChange: rt
					}, {
						default: T(() => [(_(!0), s(r, null, ae(oe.value, (e) => (_(), a(w(z), {
							key: e.site_id,
							label: e.site_id,
							value: e.site_id
						}, null, 8, ["label", "value"]))), 128))]),
						_: 1
					}, 8, ["modelValue", "disabled"])) : o("", !0),
					ke.value ? (_(), s("p", lr, [u(S(ke.value), 1), d(w(k), {
						link: "",
						type: "primary",
						disabled: ze.value,
						onClick: yt
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
					c("div", ur, [(_(!0), s(r, null, ae(je.value, (e) => (_(), s("div", {
						key: e.symbol,
						class: te(["symbol-row", { active: e.symbol === A.value }])
					}, [
						c("button", {
							type: "button",
							class: "symbol-button",
							disabled: !e.configured && !Ne.value || ze.value && e.symbol !== A.value,
							onClick: (t) => it(e.symbol)
						}, [d(w(g), { symbol: e.symbol }, null, 8, ["symbol"])], 8, dr),
						e.configured ? (_(), a(w(de), {
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
						])) : (_(), s("span", fr, "未配置")),
						e.symbol === A.value && Fe.value ? (_(), s("small", pr, "未保存")) : o("", !0)
					], 2))), 128)), !V.value && De.value && !je.value.length ? (_(), a(w(P), {
						key: 0,
						description: "当前站点没有已授权的预测网格产品",
						"image-size": 56
					})) : o("", !0)])
				]), c("main", mr, [M.value && N.value ? (_(), s("header", hr, [c("div", null, [
					c("h2", null, S(M.value.symbol) + " · 预测网格", 1),
					c("p", gr, "更新时间 " + S(Ze.value), 1),
					Me.value || oe.value.length > 1 ? (_(), s("p", _r, "当前站点：" + S(M.value.site_id), 1)) : o("", !0)
				]), c("div", vr, [
					Me.value ? (_(), a(w(k), {
						key: 0,
						disabled: !!he.value || pe.value,
						onClick: ot
					}, {
						default: T(() => [...n[22] ||= [u("取消新增", -1)]]),
						_: 1
					}, 8, ["disabled"])) : o("", !0),
					d(w(k), { onClick: n[2] ||= (e) => B.value = !0 }, {
						default: T(() => [...n[23] ||= [u("玩法说明", -1)]]),
						_: 1
					}),
					b.value ? (_(), a(w(k), {
						key: 1,
						type: "primary",
						loading: pe.value,
						disabled: !Be.value || !Fe.value || Ge.value,
						onClick: ft
					}, {
						default: T(() => [...n[24] ||= [u("保存配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])) : o("", !0)
				])])) : o("", !0), d(_n, {
					loading: H.value && !V.value,
					"hide-content": H.value && !M.value,
					"min-height": "0px",
					class: "grid-config__detail"
				}, {
					default: T(() => [!V.value && !H.value && !M.value && !A.value && !U.value ? (_(), a(w(P), {
						key: 0,
						description: Ne.value ? "请选择币种填写配置，首次保存后保持关闭" : "当前账号暂无已配置的产品"
					}, null, 8, ["description"])) : !V.value && !H.value && !U.value && De.value && !A.value ? (_(), a(w(P), {
						key: 1,
						description: "请选择交易对查看配置"
					})) : M.value && N.value ? (_(), s(r, { key: 2 }, [Me.value ? (_(), a(w(O), {
						key: 0,
						title: "请填写参数后保存，首次保存后保持关闭；确认配置后再单独开启。",
						type: "info",
						closable: !1
					})) : o("", !0), c("div", yr, [
						c("article", br, [n[29] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "网格区间配置"), c("p", { class: "parameter-description" }, "网格区间由平台按币种统一设置，修改后自动用于该币种下的商户交易。")], -1), N.value.layout ? (_(), s(r, { key: 0 }, [d(w(ce), {
							"label-position": "top",
							class: "fields limit-fields",
							onSubmit: n[5] ||= D(() => {}, ["prevent"])
						}, {
							default: T(() => [d(w(F), { label: "纵向格子区间（USDT）" }, {
								label: T(() => [n[25] ||= u("纵向格子区间（USDT）", -1), d(bn, {
									label: "纵向格子区间",
									content: "每个格子覆盖的价格区间宽度，最多保留 8 位小数。数值越大，每格覆盖的价格范围越宽；保存时会根据最新标记价检查安全范围。"
								})]),
								default: T(() => [d(Dn, {
									"input-component": w(e),
									modelValue: N.value.layout.price_band_width,
									"onUpdate:modelValue": n[3] ||= (e) => N.value.layout.price_band_width = e,
									disabled: !Ve.value,
									inputmode: "decimal",
									"aria-label": "纵向格子区间",
									onInput: dt
								}, {
									append: T(() => [...n[26] ||= [u("USDT", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								]), Ge.value ? (_(), s("small", xr, "精度不规范，最多保留 8 位小数")) : o("", !0)]),
								_: 1
							}), d(w(F), { label: "横向格子区间（秒）" }, {
								label: T(() => [n[27] ||= u("横向格子区间（秒）", -1), d(bn, {
									label: "横向格子区间",
									content: "每列格子覆盖的时间长度，可填 1 至 10 秒整数；全部列连同起始等待时间不能超过 120 秒。"
								})]),
								default: T(() => [d(Dn, {
									"input-component": w(e),
									modelValue: N.value.layout.column_duration_seconds,
									"onUpdate:modelValue": n[4] ||= (e) => N.value.layout.column_duration_seconds = e,
									disabled: !Ve.value,
									inputmode: "numeric",
									min: "1",
									max: "10",
									step: "1",
									"aria-label": "横向格子区间",
									onInput: dt
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
						}), M.value.layout?.editable ? o("", !0) : (_(), s("p", Sr, S(Me.value ? "该币种已有公共网格区间，首次创建将直接沿用。" : "当前账号无法修改该币种全部受影响站点的公共网格区间，仅可查看。"), 1))], 64)) : (_(), a(w(O), {
							key: 1,
							title: "当前接口未返回网格区间，请刷新后重试；暂不支持编辑网格区间。",
							type: "info",
							closable: !1
						}))]),
						N.value.layout ? (_(), s("article", Cr, [
							n[30] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "价格精度"), c("p", { class: "parameter-description" }, "由平台按币种统一设置，保存后用于后续新订单。")], -1),
							d(w(ce), {
								"label-position": "top",
								class: "fields odds-fields",
								onSubmit: n[7] ||= D(() => {}, ["prevent"])
							}, {
								default: T(() => [d(w(F), { label: "价格小数位" }, {
									default: T(() => [d(Dn, {
										"input-component": w(e),
										modelValue: We.value,
										"onUpdate:modelValue": n[6] ||= (e) => We.value = e,
										min: "0",
										max: "8",
										step: "1",
										unit: "位",
										inputmode: "numeric",
										"aria-label": "价格小数位",
										disabled: !Ve.value,
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
						c("article", wr, [n[41] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "赔率配置"), c("p", { class: "parameter-description" }, "命中概率由标记价、实时波动率及格子的价格和时间边界计算；格子赔率 = 目标返奖率 ÷ 命中概率")], -1), d(w(ce), {
							"label-position": "top",
							class: "fields odds-fields",
							onSubmit: n[11] ||= D(() => {}, ["prevent"])
						}, {
							default: T(() => [
								d(w(F), { label: "目标返奖率" }, {
									label: T(() => [n[32] ||= u("目标返奖率", -1), d(bn, {
										label: "目标返奖率",
										content: "例如 97%：命中概率为 20% 时，计算赔率为 4.85x。"
									})]),
									default: T(() => [d(Dn, {
										"input-component": w(e),
										modelValue: I.value,
										"onUpdate:modelValue": n[8] ||= (e) => I.value = e,
										disabled: !Be.value,
										inputmode: "decimal",
										"aria-label": "目标返奖率",
										onInput: dt
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
									label: T(() => [n[35] ||= u("最低赔率", -1), d(bn, {
										label: "最低赔率",
										content: "当前币种报价允许的最低倍率。"
									})]),
									default: T(() => [d(Dn, {
										"input-component": w(e),
										modelValue: N.value.min_multiplier,
										"onUpdate:modelValue": n[9] ||= (e) => N.value.min_multiplier = e,
										step: "0.01",
										disabled: !Ke.value,
										inputmode: "decimal",
										"aria-label": "最低赔率",
										onInput: dt
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
									label: T(() => [n[38] ||= u("最高赔率", -1), d(bn, {
										label: "最高赔率",
										content: "当前币种报价允许的最高倍率。原型中超过此值的格子不可下注，不强制压低赔率；实际是否可下注以当前格子报价为准。"
									})]),
									default: T(() => [d(Dn, {
										"input-component": w(e),
										modelValue: N.value.max_multiplier,
										"onUpdate:modelValue": n[10] ||= (e) => N.value.max_multiplier = e,
										step: "0.01",
										disabled: !Ke.value,
										inputmode: "decimal",
										"aria-label": "最高赔率",
										onInput: dt
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
						c("article", Tr, [c("header", Er, [n[42] ||= c("h3", null, "下注限制", -1), c("p", Dr, S(M.value.symbol) + " 每个格子生成一笔独立订单，限制作用于该币种全部网格订单", 1)]), d(w(ce), {
							"label-position": "top",
							class: "fields limit-fields",
							onSubmit: n[14] ||= D(() => {}, ["prevent"])
						}, {
							default: T(() => [d(w(F), { label: "单笔最小额（USDT）" }, {
								label: T(() => [n[43] ||= u("单笔最小额（USDT）", -1), d(bn, { label: "单笔最小额" })]),
								default: T(() => [d(Dn, {
									"input-component": w(e),
									modelValue: N.value.min_order_amount,
									"onUpdate:modelValue": n[12] ||= (e) => N.value.min_order_amount = e,
									disabled: !Be.value,
									inputmode: "decimal",
									"aria-label": "单笔最小额",
									onInput: dt
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
								label: T(() => [n[45] ||= u("单笔最大额（USDT）", -1), d(bn, { label: "单笔最大额" })]),
								default: T(() => [d(Dn, {
									"input-component": w(e),
									modelValue: N.value.max_order_amount,
									"onUpdate:modelValue": n[13] ||= (e) => N.value.max_order_amount = e,
									disabled: !Be.value,
									inputmode: "decimal",
									"aria-label": "单笔最大额",
									onInput: dt
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
			d(er, {
				modelValue: B.value,
				"onUpdate:modelValue": n[15] ||= (e) => B.value = e
			}, null, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-1acabdfd"]]), kr = [
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
], Ar = /^[A-Z0-9]{2,32}$/, jr = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Mr(e) {
	if (!e) throw Error("模板参数或版本无效");
}
function Nr(e, t) {
	Mr(jr(e) && Object.keys(e).length === t.length && t.every((t) => Object.hasOwn(e, t)));
}
function Pr(e) {
	return typeof e == "string" && /^(0|[1-9]\d*)$/.test(e) && e.length <= 19 && BigInt(e) <= 9223372036854775807n;
}
function Fr(e) {
	Nr(e, kr.map(([e]) => e));
	let t = {};
	for (let [n] of kr) t[n] = Et(e[n], n.includes("multiplier") ? 2 : n.includes("amount") ? 8 : void 0);
	Mr(Ot(t.target_rtp, "0") > 0 && Ot(t.target_rtp, "1") < 0), Mr(Ot(t.min_multiplier, "1") >= 0 && Ot(t.max_multiplier, t.min_multiplier) >= 0), Mr(Ot(t.min_order_amount, "0") > 0 && Ot(t.max_order_amount, t.min_order_amount) >= 0);
	let n = (e, t) => {
		let [n, r = ""] = e.split(".");
		return BigInt(n + r.padEnd(t, "0"));
	};
	return Mr(n(t.max_order_amount, 8) * n(t.max_multiplier, 2) <= 9223372036854775807n * 100n), t;
}
function Ir(e, t) {
	Mr(jr(e));
	let n = "availability_version" in e || "enabled" in e;
	Nr(e, [
		"scope",
		"symbol",
		"global_version",
		"effective_from_ms",
		"parameters",
		"layout",
		...n ? ["availability_version", "enabled"] : []
	]), n && Mr(typeof e.enabled == "boolean" && Pr(e.availability_version));
	let r = n ? {
		enabled: e.enabled,
		availability_version: e.availability_version
	} : {};
	Mr(e.scope === "GLOBAL" && e.symbol === t && Ar.test(t) && Pr(e.global_version));
	let i = null;
	if (e.layout !== null) {
		let t = e.layout;
		Nr(t, [
			"version",
			"row_count",
			"column_count",
			"column_duration_seconds",
			"price_band_width",
			"price_decimals"
		]), Mr(Pr(t.version) && t.version !== "0" && typeof t.row_count == "string" && typeof t.column_count == "string" && typeof t.column_duration_seconds == "string"), Mr(t.price_decimals === null || typeof t.price_decimals == "number" && Number.isInteger(t.price_decimals) && t.price_decimals >= 0 && t.price_decimals <= 18), i = {
			version: t.version,
			row_count: t.row_count,
			column_count: t.column_count,
			column_duration_seconds: t.column_duration_seconds,
			price_band_width: Et(t.price_band_width),
			price_decimals: t.price_decimals
		};
	}
	return e.global_version === "0" ? (Mr(e.parameters === null && e.effective_from_ms === null), {
		...r,
		scope: "GLOBAL",
		symbol: t,
		global_version: "0",
		effective_from_ms: null,
		parameters: null,
		layout: i
	}) : (Mr(Pr(e.effective_from_ms) && e.effective_from_ms !== "0" && i !== null), {
		...r,
		scope: "GLOBAL",
		symbol: t,
		global_version: e.global_version,
		effective_from_ms: e.effective_from_ms,
		parameters: Fr(e.parameters),
		layout: i
	});
}
function Lr(e) {
	if (Mr(jr(e) && typeof e.symbol == "string" && Ar.test(e.symbol)), Mr(typeof e.client_request_id == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(e.client_request_id)), Mr(typeof e.reason == "string" && e.reason.trim() && !e.reason.includes("\0") && new TextEncoder().encode(e.reason).length <= 500), e.action === "set_enabled") {
		Nr(e, [
			"action",
			"symbol",
			"based_on_availability_version",
			"client_request_id",
			"reason",
			"enabled"
		]), Mr(typeof e.enabled == "boolean" && Pr(e.based_on_availability_version));
		return;
	}
	Mr(e.action === void 0 || e.action === "save_parameters");
	let t = [
		"symbol",
		"based_on_global_version",
		"client_request_id",
		"reason",
		"changes",
		..."action" in e ? ["action"] : []
	];
	if (jr(e) && "layout" in e) {
		t.push("layout", "based_on_layout_version"), Mr(Pr(e.based_on_layout_version) && jr(e.layout));
		let n = Object.keys(e.layout);
		Mr(n.length > 0 && n.every((e) => [
			"price_band_width",
			"column_duration_seconds",
			"price_decimals"
		].includes(e))), e.based_on_layout_version === "0" && Mr(n.length === 3), "price_decimals" in e.layout && Mr(typeof e.layout.price_decimals == "number" && Number.isInteger(e.layout.price_decimals) && e.layout.price_decimals >= 0 && e.layout.price_decimals <= 8), "column_duration_seconds" in e.layout && Mr(typeof e.layout.column_duration_seconds == "string" && /^(?:[1-9]|10)$/.test(e.layout.column_duration_seconds)), "price_band_width" in e.layout && Mr(Ot(Et(e.layout.price_band_width, 8), "0") > 0);
	}
	Nr(e, t), Mr(Pr(e.based_on_global_version)), Fr(e.changes);
}
function Rr(e, t, n, r) {
	let i = Ir(e, e.symbol), a = Fr(t), o = {
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
	return Lr(o), o;
}
function zr(e, t) {
	if (!jr(e) || e.scope !== "GLOBAL" || e.symbol !== t.command.symbol || e.operation_status !== "SUCCEEDED" || !Pr(e.operation_id) || e.operation_id === "0" || typeof e.changed != "boolean" || !Pr(e.global_version)) return !1;
	if (t.command.action === "set_enabled") return e.enabled !== t.command.enabled || !Pr(e.availability_version) || !(Pr(e.effective_from_ms) || !e.changed && e.effective_from_ms === null) ? !1 : BigInt(e.availability_version) - BigInt(t.command.based_on_availability_version) === (e.changed ? 1n : 0n) && [
		"PENDING",
		"DONE",
		"NOT_REQUIRED"
	].includes(String(e.cache_state));
	if (!Pr(e.effective_from_ms)) return !1;
	let n = BigInt(e.global_version) - BigInt(t.command.based_on_global_version);
	if (n < 0n || n > 1n) return !1;
	let r = 0n;
	return t.command.layout && (!Pr(e.layout_version) || (r = BigInt(e.layout_version) - BigInt(t.command.based_on_layout_version), r < 0n || r > 1n)) ? !1 : e.changed === n + r > 0n && (e.changed ? [
		"PENDING",
		"DONE",
		"NOT_REQUIRED"
	].includes(String(e.cache_state)) : e.cache_state === "NOT_REQUIRED");
}
var Br = at("grid.config.global.pending.v1", Lr, zr), Vr = {
	class: "grid-config mm-ui",
	"data-grid-config": "platform"
}, Hr = {
	key: 2,
	class: "pending-bar"
}, Ur = { class: "grid-layout" }, Wr = { class: "symbol-panel" }, Gr = { class: "panel-heading" }, Kr = { class: "symbol-list" }, qr = ["disabled", "onClick"], Jr = { class: "symbol-unconfigured" }, Yr = { class: "config-panel" }, Xr = {
	key: 0,
	class: "config-heading"
}, Zr = { class: "config-heading__actions" }, Qr = {
	key: 2,
	class: "grid-config__parameters"
}, $r = { class: "parameter-card" }, ei = { class: "parameter-card" }, ti = { class: "parameter-heading" }, ni = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "GlobalGridConfig",
	setup(t, { expose: n }) {
		let l = me().grid, f = l.globalTemplate, ee = G(), p = _e(), m = [{
			title: "赔率配置",
			fields: kr.slice(0, 3)
		}, {
			title: "下注限制",
			fields: kr.slice(3)
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
		}), N = v(!1), I = v(!1), L = v(!1), z = v(""), B = v(!1), ue = v(!1), fe = x(null), V = (e) => ({
			price_band_width: e.layout?.price_band_width ?? "",
			column_duration_seconds: e.layout?.column_duration_seconds ?? "",
			price_decimals: String(e.layout?.price_decimals ?? 3)
		}), H = i(() => !!E.value && (JSON.stringify(M.value) !== JSON.stringify(V(E.value)) || kr.some(([e]) => j.value[e] !== (E.value?.parameters ?? A)[e]))), pe = i(() => !ie.value || I.value || !!fe.value || ue.value), U = 0, W;
		function he() {
			try {
				let e = Br.pendingForActor(sessionStorage, g.value);
				fe.value = e.pending ?? null, ue.value = e.status === "foreign", ue.value && (z.value = "请切回原账号核对尚未确认的模板操作。");
			} catch {
				fe.value = null, ue.value = !0, z.value = "无法读取待确认操作，请先核对原请求。";
			}
		}
		function ge() {
			return U++, W?.abort(), W = new AbortController(), U;
		}
		async function ye(e) {
			let t = ge();
			I.value = !0, L.value = !1, z.value = "", b.value = e, E.value = null;
			try {
				let n = Ir(await f.detail(e, W.signal), e);
				if (t !== U) return;
				E.value = n, j.value = { ...n.parameters ?? A }, M.value = V(n);
				let r = y.value.find((t) => t.symbol === e);
				r && Object.assign(r, {
					configured: n.parameters !== null,
					enabled: n.enabled,
					availability_version: n.availability_version
				});
			} catch {
				t === U && (L.value = !0, z.value = "读取平台模板失败，请重试。");
			} finally {
				t === U && (I.value = !1);
			}
		}
		async function be() {
			if (!re.value || H.value || I.value || (he(), fe.value || ue.value)) return;
			let e = ge();
			I.value = !0, z.value = "", L.value = !1;
			try {
				let [t, n] = await Promise.all([f.catalog(W.signal), l.gridConfigSymbols(W.signal)]);
				if (e !== U) return;
				let r = new Map(t.products.map((e) => [e.symbol, e]));
				y.value = [.../* @__PURE__ */ new Set([...n, ...r.keys()])].filter((e) => /^[A-Z0-9]{2,32}$/.test(e)).map((e) => r.get(e) ?? {
					symbol: e,
					configured: !1
				});
				let i = y.value.find((e) => e.symbol === b.value) ?? y.value[0];
				i && await ye(i.symbol);
			} catch {
				e === U && (L.value = !0, z.value = "读取平台币种目录失败，请重试。");
			} finally {
				e === U && (I.value = !1);
			}
		}
		async function xe() {
			if (I.value || fe.value) return !1;
			if (!H.value) return !0;
			try {
				return await R.confirm("放弃未保存的配置？", "离开配置"), !0;
			} catch {
				return !1;
			}
		}
		async function Se(e) {
			e !== b.value && await xe() && await ye(e);
		}
		function Ce() {
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
		async function we() {
			if (!(pe.value || !E.value)) {
				try {
					for (let [e, t] of kr) if (!j.value[e].trim()) throw Error("请填写" + t);
					K(Rr(E.value, j.value, Mt(), Ce()));
				} catch (e) {
					z.value = e instanceof Error ? e.message : "请核对模板参数";
					return;
				}
				await Te("save");
			}
		}
		function K(e) {
			let t = Br.captureSaveReview(g.value, e);
			fe.value = Br.persistReviewedCommand(sessionStorage, t, g.value, e);
		}
		async function q(e, t) {
			if (!(pe.value || typeof t != "boolean" || !e.availability_version || !e.configured && t)) {
				try {
					K({
						action: "set_enabled",
						symbol: e.symbol,
						based_on_availability_version: e.availability_version,
						client_request_id: Mt(),
						reason: "通过总后台设置网格币种开关",
						enabled: t
					});
				} catch (e) {
					z.value = e instanceof Error ? e.message : "无法保全开关操作";
					return;
				}
				await Te("save");
			}
		}
		async function Te(e) {
			if (he(), I.value || !fe.value || ue.value || !ie.value) return;
			let t = fe.value, n = U;
			I.value = !0, B.value = !1;
			try {
				let r = await Br.attemptPending(sessionStorage, t, e, (e, t) => e === "save" ? f.save(t) : f.receipt(t));
				if (n !== U) return;
				if (he(), t.command.action === "set_enabled" && r.status === "success" && y.value.length) {
					let e = y.value.find((e) => e.symbol === t.command.symbol), n = {
						enabled: r.value.enabled,
						availability_version: r.value.availability_version
					};
					e && Object.assign(e, n), E.value?.symbol === t.command.symbol && (E.value = {
						...E.value,
						...n
					}), z.value = "";
				} else r.status === "rejected" && r.journalCleared && y.value.length && t.command.action === "set_enabled" ? z.value = r.error instanceof Error ? r.error.message : "开关未生效，请重新读取币种配置。" : r.status === "success" || r.status === "rejected" && r.journalCleared ? (r.status === "success" && le.success("保存成功"), I.value = !1, E.value = null, b.value = t.command.symbol, await be(), r.status === "rejected" && (z.value = "保存未生效，请核对最新配置后再提交。")) : (B.value = e === "receipt" && Yt(r.error), z.value = r.error instanceof Error ? "保存结果待确认：" + r.error.message + "。请先查询原操作回执。" : "保存结果待确认，请先查询原操作回执。");
			} catch {
				n === U && (z.value = "保存结果待确认，请先查询原操作回执。");
			} finally {
				n === U && (I.value = !1);
			}
		}
		return se(() => [
			g.value,
			ee.context.identityKey,
			re.value,
			ie.value
		], () => {
			ge(), I.value = !1, E.value = null, y.value = [], b.value = "", z.value = "", fe.value = null, ue.value = !1, re.value && be();
		}, {
			immediate: !0,
			flush: "sync"
		}), ne(ge), ve(xe), n({
			confirmLeave: xe,
			refresh: be
		}), (t, n) => (_(), s("section", Vr, [
			z.value ? (_(), a(w(O), {
				key: 0,
				title: z.value,
				type: "warning",
				closable: !1
			}, null, 8, ["title"])) : o("", !0),
			re.value ? o("", !0) : (_(), a(w(O), {
				key: 1,
				title: "当前账号没有预测网格配置查询权限",
				type: "warning",
				closable: !1
			})),
			fe.value ? (_(), s("div", Hr, [
				c("strong", null, S(fe.value.command.symbol) + " 配置结果待确认", 1),
				d(w(k), {
					disabled: I.value || !ie.value,
					onClick: n[0] ||= (e) => Te("receipt")
				}, {
					default: T(() => [...n[11] ||= [u("查询原操作回执", -1)]]),
					_: 1
				}, 8, ["disabled"]),
				B.value ? (_(), a(w(k), {
					key: 0,
					disabled: I.value || !ie.value,
					onClick: n[1] ||= (e) => Te("recover")
				}, {
					default: T(() => [...n[12] ||= [u("恢复原请求", -1)]]),
					_: 1
				}, 8, ["disabled"])) : o("", !0)
			])) : o("", !0),
			c("div", Ur, [c("aside", Wr, [
				c("div", Gr, [n[13] ||= c("strong", null, "币种配置", -1), c("span", null, S(oe.value.length) + " 条", 1)]),
				d(w(e), {
					modelValue: C.value,
					"onUpdate:modelValue": n[2] ||= (e) => C.value = e,
					clearable: "",
					placeholder: "搜索交易对",
					"aria-label": "搜索交易对"
				}, null, 8, ["modelValue"]),
				c("div", Kr, [(_(!0), s(r, null, ae(oe.value, (e) => (_(), s("div", {
					key: e.symbol,
					class: te(["symbol-row", { active: e.symbol === b.value }])
				}, [
					c("button", {
						type: "button",
						class: "symbol-button",
						disabled: I.value || !!fe.value,
						onClick: (t) => Se(e.symbol)
					}, [d(w(p), { symbol: e.symbol }, null, 8, ["symbol"])], 8, qr),
					c("span", Jr, S(e.configured ? "已配置" : "待配置"), 1),
					d(w(de), {
						"model-value": e.enabled,
						disabled: pe.value || e.availability_version === void 0 || !e.enabled && !e.configured,
						"data-config-enabled": e.symbol,
						"aria-label": e.symbol + " 网格币种开关",
						title: !e.configured && !e.enabled ? "请先保存模板参数" : "立即设置币种开放状态",
						onChange: (t) => q(e, t)
					}, null, 8, [
						"model-value",
						"disabled",
						"data-config-enabled",
						"aria-label",
						"title",
						"onChange"
					])
				], 2))), 128))])
			]), c("main", Yr, [b.value ? (_(), s("header", Xr, [c("div", null, [c("h2", null, S(b.value) + " · 预测网格", 1), n[14] ||= c("p", null, "平台模板", -1)]), c("div", Zr, [d(w(k), { onClick: n[3] ||= (e) => N.value = !0 }, {
				default: T(() => [...n[15] ||= [u("玩法说明", -1)]]),
				_: 1
			}), ie.value ? (_(), a(w(k), {
				key: 0,
				type: "primary",
				disabled: pe.value || !E.value,
				loading: I.value,
				onClick: we
			}, {
				default: T(() => [...n[16] ||= [u("保存配置", -1)]]),
				_: 1
			}, 8, ["disabled", "loading"])) : o("", !0)])])) : o("", !0), d(_n, {
				loading: I.value && !E.value,
				"hide-content": I.value && !E.value,
				"min-height": "0px",
				class: "grid-config__detail"
			}, {
				default: T(() => [L.value ? (_(), a(w(k), {
					key: 0,
					disabled: I.value,
					onClick: be
				}, {
					default: T(() => [...n[17] ||= [u("重新加载", -1)]]),
					_: 1
				}, 8, ["disabled"])) : !E.value && !I.value ? (_(), a(w(P), {
					key: 1,
					description: "请选择交易对查看配置"
				})) : o("", !0), E.value ? (_(), s("div", Qr, [
					c("article", $r, [n[18] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "网格区间配置"), c("p", { class: "parameter-description" }, "该币种的网格区间由平台统一设置。")], -1), d(w(ce), {
						class: "fields limit-fields",
						"label-position": "top",
						onSubmit: n[6] ||= D(() => {}, ["prevent"])
					}, {
						default: T(() => [d(w(F), { label: "纵向格子区间" }, {
							default: T(() => [d(Dn, {
								modelValue: M.value.price_band_width,
								"onUpdate:modelValue": n[4] ||= (e) => M.value.price_band_width = e,
								"input-component": w(e),
								unit: "USDT",
								disabled: pe.value
							}, null, 8, [
								"modelValue",
								"input-component",
								"disabled"
							])]),
							_: 1
						}), d(w(F), { label: "横向格子区间" }, {
							default: T(() => [d(Dn, {
								modelValue: M.value.column_duration_seconds,
								"onUpdate:modelValue": n[5] ||= (e) => M.value.column_duration_seconds = e,
								"input-component": w(e),
								unit: "秒",
								min: "1",
								max: "10",
								disabled: pe.value
							}, null, 8, [
								"modelValue",
								"input-component",
								"disabled"
							])]),
							_: 1
						})]),
						_: 1
					})]),
					c("article", ei, [n[19] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "价格精度")], -1), d(w(ce), {
						class: "fields limit-fields",
						"label-position": "top",
						onSubmit: n[8] ||= D(() => {}, ["prevent"])
					}, {
						default: T(() => [d(w(F), { label: "价格小数位" }, {
							default: T(() => [d(Dn, {
								modelValue: M.value.price_decimals,
								"onUpdate:modelValue": n[7] ||= (e) => M.value.price_decimals = e,
								"input-component": w(e),
								unit: "位",
								min: "0",
								max: "8",
								disabled: pe.value
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
					}, [c("header", ti, [c("h3", null, S(t.title), 1)]), d(w(ce), {
						class: te(["fields", i === 0 ? "odds-fields" : "limit-fields"]),
						"label-position": "top",
						onSubmit: n[9] ||= D(() => {}, ["prevent"])
					}, {
						default: T(() => [(_(!0), s(r, null, ae(t.fields, ([t, n, r]) => (_(), a(w(F), {
							key: t,
							label: n
						}, {
							default: T(() => [d(Dn, {
								modelValue: j.value[t],
								"onUpdate:modelValue": (e) => j.value[t] = e,
								"input-component": w(e),
								unit: r,
								percentage: t === "target_rtp",
								step: r === "x" ? "0.01" : "1",
								disabled: pe.value
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
			d(er, {
				modelValue: N.value,
				"onUpdate:modelValue": n[10] ||= (e) => N.value = e
			}, null, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-e4933b0f"]]), ri = { class: "prediction-page prediction-table-page mm-ui" }, ii = { class: "prediction-page__header" }, ai = {
	class: "game-tabs",
	role: "group",
	"aria-label": "选择预测玩法"
}, oi = {
	class: "game-choice-icon",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	"aria-hidden": "true"
}, si = { class: "game-choice-content" }, ci = { key: 1 }, li = {
	key: 2,
	class: "catalog-error"
}, ui = { class: "prediction-page__workspace" }, di = { class: "symbol-panel__heading" }, fi = { class: "symbol-panel__list" }, pi = [
	"aria-pressed",
	"data-config-symbol",
	"disabled",
	"onClick"
], mi = { class: "symbol-choice__top" }, hi = ["title"], gi = {
	key: 1,
	class: "symbol-row__draft"
}, _i = { class: "config-content" }, vi = {
	key: 0,
	class: "config-content__heading"
}, yi = { class: "config-game-label" }, bi = { "data-config-updated-at": "" }, xi = {
	key: 0,
	class: "config-heading-actions"
}, Si = ["title", "aria-label"], Ci = /*#__PURE__*/ n(/* @__PURE__ */ f({
	__name: "index",
	setup(t) {
		let { predictionConfigurationList: n, predictionConfigurationSave: l } = me().api, { symbols: f } = me().api, ee = _e(), p = ge(), m = v(""), g = v(!1), ie = v([]), y = v("UP_DOWN"), C = v("UP_DOWN"), oe = me().grid.globalTemplate ? ni : Or, E = x(), D = [
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
		], A = v(""), j = i(() => Qe(p.perms, "prediction_config:lists")), M = v(""), N = x(), ce = i(() => N.value?.editingState), F = i(() => {
			let e = ce.value;
			return !e || e.target !== A.value || e.actor !== String(p.userInfo.id || "") || !j.value || !Qe(p.perms, "prediction_config:edit") || e.saving ? null : R.value ? {
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
			} : e.ready && (e.dirty || e.isNew) ? {
				text: "未保存",
				tone: "warning",
				detail: ""
			} : null;
		}), I = 0, L = x(), R = v(!1), z = v(!1), B;
		function ue() {
			if (!B) throw Error("请选择要调整的币种");
			return B;
		}
		function V(e) {
			return !j.value || !Qe(p.perms, "prediction_config:edit") || !e.configured || g.value || R.value || z.value || !!(ce.value?.saving || ce.value?.pending);
		}
		function H(e) {
			return R.value ? "请先核验原操作" : V(e) ? "当前不可操作" : "立即设置该币种所有周期的开放状态";
		}
		function pe(e, t) {
			typeof t != "boolean" || !e.game_type || V(e) || (B = {
				action: "set_enabled",
				game_type: e.game_type,
				symbol: e.symbol,
				based_on_template_version: e.template_version,
				enabled: t
			}, L.value?.submit());
		}
		async function U(e) {
			let t = await l(e), n = t.configuration;
			if (!n?.rules?.length || n.rules.some((t) => t.game_type !== "GAME_TYPE_" + e.game_type || t.symbol !== e.symbol) || n.symbol_enabled !== e.enabled || !/^[1-9]\d*$/.test(n.template_version)) throw Error("开关回执与当前操作不符，请核验原操作");
			return {
				...t,
				priorVersion: e.based_on_template_version
			};
		}
		function W(e) {
			let { configuration: t, priorVersion: n } = e;
			G(t, n), N.value?.appliedSwitch(n, t);
		}
		function G(e, t) {
			let n = e.rules[0], r = !1, i = ie.value.map((i) => i.rules[0]?.symbol === n.symbol && i.rules[0].game_type === n.game_type ? (r = !0, BigInt(i.template_version) > BigInt(e.template_version) ? i : e) : i.template_version === t ? {
				...i,
				template_version: e.template_version
			} : i);
			!r && n.game_type === "GAME_TYPE_" + y.value && i.push(e), ie.value = i;
		}
		let he = (e) => e === "GAME_TYPE_UP_DOWN" ? "UP_DOWN" : e === "GAME_TYPE_HIGH_LOW" ? "HIGH_LOW" : null, ve = (e) => e === "UP_DOWN" ? "涨跌预测" : e === "HIGH_LOW" ? "自选预测" : "--", ye = Se, be = i(() => ie.value.map((e, t) => {
			let n = e.rules[0], r = he(n?.game_type) || y.value || null, i = n?.symbol || "";
			return {
				row_key: r && i ? `${r}:${i}` : `empty:${t}`,
				configuration: e,
				game_type: r,
				symbol: i,
				enabled: Je(e),
				configured: e.rules.length > 0,
				editable: !!(r && i && e.rules.length > 0),
				rule_count: e.rules.length,
				template_version: e.template_version,
				effective_version: e.effective_version,
				updated_at: ye(e.updated_at_ms)
			};
		}).sort((e, t) => e.game_type === t.game_type ? e.symbol.localeCompare(t.symbol) : (e.game_type || "").localeCompare(t.game_type || "")));
		function xe(e) {
			let t = e.row_key === ce.value?.target && ce.value?.ready ? ce.value.roomDurations : e.configuration ? Ye(e.configuration) : void 0;
			return t ? t.map((t) => Ce(t, e.game_type || void 0)).join(" · ") || "暂无房间" : e.directory_label;
		}
		let K = v([]), q = v(!1), Te = v(""), Ee = (e) => e.trim().toUpperCase(), De = 0, Oe;
		async function ke() {
			if (!j.value) return;
			Oe?.abort(), Oe = new AbortController();
			let e = ++De;
			q.value = !0, Te.value = "";
			try {
				let t = await f(Oe.signal);
				if (e !== De) return;
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
					let r = Ee(t.symbol);
					n.has(r) || n.set(r, {
						symbol: r,
						base_asset: typeof t.base_asset == "string" ? t.base_asset : "",
						quote_asset: typeof t.quote_asset == "string" ? t.quote_asset : ""
					});
				}
				K.value = [...n.values()];
			} catch (t) {
				e === De && (Te.value = we(t));
			} finally {
				e === De && (q.value = !1);
			}
		}
		let Ae = i(() => {
			let e = [...be.value], t = new Set(e.filter((e) => e.game_type === y.value).map((e) => Ee(e.symbol)));
			for (let n of K.value) t.has(n.symbol) || e.push({
				row_key: `${y.value}:${n.symbol}`,
				configuration: null,
				game_type: y.value,
				symbol: n.symbol,
				enabled: !1,
				configured: !1,
				editable: Qe(p.perms, "prediction_config:edit") && !Te.value,
				rule_count: 0,
				template_version: "未配置",
				effective_version: "未配置",
				updated_at: "未提供",
				directory_label: [n.base_asset, n.quote_asset].filter(Boolean).join(" / ") || "点击填写配置"
			});
			return Ze(e, K.value.map((e) => e.symbol));
		}), je = i(() => {
			let e = M.value.trim().toUpperCase();
			return Ae.value.filter((t) => (!y.value || t.game_type === y.value) && (!e || t.symbol.includes(e)));
		}), Me = i(() => Ae.value.find((e) => e.row_key === A.value)), Ne = i(() => (g.value || q.value) && !Me.value), Pe = 0, Fe, Ie = async () => {
			if (!Qe(p.perms, "prediction_config:lists")) {
				m.value = "没有玩法配置查询权限";
				return;
			}
			m.value = "", Fe?.abort(), Fe = new AbortController();
			let e = ++Pe, t = String(p.userInfo.id || "");
			g.value = !0;
			try {
				let r = await n({ game_type: y.value || void 0 }, Fe.signal);
				if (e !== Pe || t !== String(p.userInfo.id || "") || !j.value) return;
				if (!Array.isArray(r.configurations)) throw Error("配置列表格式异常，请重新加载");
				if (ie.value = r.configurations, !Ae.value.some((e) => e.row_key === A.value && e.editable)) {
					let e = Ae.value.find((e) => e.configured && e.editable && e.game_type === y.value);
					e ? await J(e, !0) : A.value = "";
				}
			} catch (t) {
				e === Pe && (m.value = we(t), ie.value = []);
			} finally {
				e === Pe && (g.value = !1);
			}
		}, Le = async (e) => {
			if (!(C.value === e || z.value || R.value) && !(C.value === "GRID" && E.value && !await E.value.confirmLeave())) {
				if (C.value !== "GRID" && (ce.value?.dirty || ce.value?.pending)) {
					le.warning("请先处理当前未保存修改或待确认操作");
					return;
				}
				if (I++, C.value = e, e === "GRID") {
					A.value = "";
					return;
				}
				y.value = e, A.value = "", M.value = "", ie.value = [], Ie(), K.value.length || ke();
			}
		}, J = async (e, t = !1) => {
			if (!t && (ce.value?.saving || ce.value?.pending || ce.value?.dirty || z.value || R.value)) {
				le.warning("请先处理当前未保存修改或待确认操作");
				return;
			}
			let n = String(p.userInfo.id || ""), r = ++I;
			if (!(!j.value || !e.editable || g.value && !t || m.value || !e.game_type || !e.symbol || A.value === e.row_key) && (A.value = e.row_key, await h(), !(r !== I || A.value !== e.row_key || n !== String(p.userInfo.id || "") || !j.value))) return {
				selection: r,
				detail: await N.value?.open(e.game_type, e.symbol, t ? e.configuration ?? void 0 : void 0, !e.configured)
			};
		}, Re = () => {
			if (C.value === "GRID") {
				E.value?.refresh();
				return;
			}
			I++, Ie(), ke();
		};
		return se(() => [
			p.userInfo.id,
			j.value,
			Qe(p.perms, "prediction_config:edit")
		], () => {
			I++, Pe++, Fe?.abort(), g.value = !1;
		}, { flush: "sync" }), re(Re), ne(() => {
			I++, Pe++, Fe?.abort(), De++, Oe?.abort();
		}), (t, n) => (_(), s("section", ri, [
			c("header", ii, [c("div", ai, [(_(), s(r, null, ae(D, (e) => d(w(k), {
				key: e.value,
				type: C.value === e.value ? "primary" : void 0,
				"aria-pressed": C.value === e.value,
				"aria-label": e.label,
				onClick: (t) => Le(e.value)
			}, {
				default: T(() => [(_(), s("svg", oi, [e.value === "UP_DOWN" ? (_(), s(r, { key: 0 }, [n[4] ||= c("circle", {
					cx: "12",
					cy: "12",
					r: "10"
				}, null, -1), n[5] ||= c("path", { d: "m16 12-4-4-4 4M12 16V8" }, null, -1)], 64)) : e.value === "HIGH_LOW" ? (_(), s(r, { key: 1 }, [n[6] ||= c("path", { d: "m9 9 5 12 1.8-5.2L21 14Z" }, null, -1), n[7] ||= c("path", { d: "M7.2 2.2 8 5.1M5.1 8l-2.9-.8M14 4.1 12 6M6 12l-1.9 2" }, null, -1)], 64)) : (_(), s(r, { key: 2 }, [n[8] ||= c("rect", {
					x: "3",
					y: "3",
					width: "18",
					height: "18",
					rx: "2"
				}, null, -1), n[9] ||= c("path", { d: "M9 3v18M15 3v18M3 9h18M3 15h18" }, null, -1)], 64))])), c("span", si, [c("strong", null, S(e.label), 1), c("small", null, S(e.description), 1)])]),
				_: 2
			}, 1032, [
				"type",
				"aria-pressed",
				"aria-label",
				"onClick"
			])), 64))])]),
			j.value ? (_(), a(fn, {
				key: 0,
				ref_key: "switchPanel",
				ref: L,
				action: "config.availability",
				target: "platform",
				permission: "prediction_config:edit",
				"automatic-reason": "通过总后台设置币种全周期开关",
				payload: ue,
				send: U,
				"hide-button": !!Me.value || !R.value,
				"hide-success": "",
				"hide-pending-details": "",
				onPending: n[0] ||= (e) => R.value = e,
				onBusy: n[1] ||= (e) => z.value = e,
				onSuccess: W
			}, null, 8, ["hide-button"])) : o("", !0),
			C.value !== "GRID" && m.value ? (_(), s("div", ci, [d(w(O), {
				title: m.value,
				type: "error",
				closable: !1
			}, null, 8, ["title"]), d(w(k), {
				loading: g.value,
				onClick: Re
			}, {
				default: T(() => [...n[10] ||= [u("重试", -1)]]),
				_: 1
			}, 8, ["loading"])])) : o("", !0),
			C.value !== "GRID" && Te.value ? (_(), s("div", li, [d(w(O), {
				title: `币种目录加载失败：${Te.value}`,
				type: "warning",
				closable: !1
			}, null, 8, ["title"]), d(w(k), {
				"aria-label": "重试币种目录",
				loading: q.value,
				onClick: ke
			}, {
				default: T(() => [...n[11] ||= [u("重试币种目录", -1)]]),
				_: 1
			}, 8, ["loading"])])) : o("", !0),
			C.value !== "GRID" && j.value ? (_(), a(_n, {
				key: 3,
				class: "prediction-page__loading-workspace",
				loading: Ne.value,
				"hide-content": Ne.value,
				"min-height": "0px"
			}, {
				default: T(() => [c("div", ui, [d(_n, {
					as: "aside",
					loading: (g.value || q.value) && !Ne.value,
					"min-height": "0px",
					class: "symbol-panel",
					"aria-label": "交易对配置列表"
				}, {
					default: T(() => [
						c("div", di, [n[12] ||= c("strong", null, "币种配置", -1), c("span", null, S(je.value.length) + " 条", 1)]),
						d(w(e), {
							modelValue: M.value,
							"onUpdate:modelValue": n[2] ||= (e) => M.value = e,
							clearable: "",
							placeholder: "搜索交易对",
							"aria-label": "搜索交易对"
						}, null, 8, ["modelValue"]),
						c("div", fi, [(_(!0), s(r, null, ae(je.value, (e) => (_(), s("div", {
							key: e.row_key,
							class: te(["symbol-row", { "is-active": A.value === e.row_key }])
						}, [
							c("button", {
								type: "button",
								class: "symbol-choice",
								"aria-pressed": A.value === e.row_key,
								"data-config-symbol": e.symbol,
								disabled: !e.editable || g.value || !!m.value,
								onClick: (t) => J(e)
							}, [c("span", mi, [d(w(ee), { symbol: e.symbol }, null, 8, ["symbol"]), e.configured ? o("", !0) : (_(), a(w(fe), {
								key: 0,
								size: "small",
								type: "info"
							}, {
								default: T(() => [...n[13] ||= [u("待首次配置", -1)]]),
								_: 1
							}))]), c("span", {
								class: "symbol-choice__periods",
								title: xe(e)
							}, S(xe(e)), 9, hi)], 8, pi),
							e.configured ? (_(), a(w(de), {
								key: 0,
								"data-config-enabled": e.symbol,
								"aria-label": `${e.symbol} 开放配置`,
								"model-value": e.enabled,
								disabled: V(e),
								title: H(e),
								onChange: (t) => pe(e, t)
							}, null, 8, [
								"data-config-enabled",
								"aria-label",
								"model-value",
								"disabled",
								"title",
								"onChange"
							])) : o("", !0),
							A.value === e.row_key && ce.value?.dirty ? (_(), s("span", gi, "未保存")) : o("", !0)
						], 2))), 128)), !g.value && !q.value && !m.value && !Te.value && !je.value.length ? (_(), a(w(P), {
							key: 0,
							description: "暂无符合条件的交易对",
							"image-size": 56
						})) : o("", !0)])
					]),
					_: 1
				}, 8, ["loading"]), c("main", _i, [Me.value ? (_(), s("div", vi, [c("div", null, [c("h2", null, [u(S(Me.value.symbol) + " ", 1), c("span", yi, " · " + S(ve(Me.value.game_type)), 1)]), c("p", bi, "更新时间 " + S(Me.value.updated_at), 1)]), w(Qe)(w(p).perms, "prediction_config:edit") ? (_(), s("div", xi, [F.value ? (_(), s("span", {
					key: 0,
					"data-config-save-feedback": "",
					class: te(["config-save-feedback", `config-save-feedback--${F.value.tone}`]),
					role: "status",
					title: F.value.detail || void 0,
					"aria-label": F.value.detail ? `${F.value.text}：${F.value.detail}` : void 0
				}, S(F.value.text), 11, Si)) : o("", !0), d(w(k), {
					type: "primary",
					loading: ce.value?.saving || z.value,
					disabled: z.value || !R.value && (!ce.value || ce.value.saving || !ce.value.pending && !ce.value.ready),
					onClick: n[3] ||= (e) => R.value ? L.value?.submit() : N.value?.saveConfig()
				}, {
					default: T(() => [u(S(R.value || ce.value?.pending ? "核验原操作" : "保存配置"), 1)]),
					_: 1
				}, 8, ["loading", "disabled"])])) : o("", !0)])) : o("", !0), A.value ? (_(), a(Yn, {
					key: 1,
					ref_key: "editRef",
					ref: N,
					inline: "",
					"external-save": "",
					onSuccess: G
				}, null, 512)) : !g.value && !q.value && !m.value ? (_(), a(w(P), {
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
}), [["__scopeId", "data-v-4ace4fe8"]]), wi = 9223372036854775807n;
function Ti(e) {
	return e == null ? "—" : typeof e == "object" ? JSON.stringify(e) : String(e);
}
function X(e, t = !1) {
	return typeof e == "string" && /^(0|[1-9][0-9]*)$/.test(e) && e.length <= 19 && BigInt(e) <= wi && (!t || e !== "0");
}
function Ei(e) {
	return typeof e == "number" ? Number.isSafeInteger(e) && e > 0 ? String(e) : null : X(e, !0) ? e : null;
}
function Di(e) {
	return typeof e == "string" && e.length <= 256 && /^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(e);
}
function Oi(e, t) {
	if (!Di(e) || !Di(t)) throw Error("INVALID_DECIMAL");
	let [n, r = ""] = e.split("."), [i, a = ""] = t.split("."), o = Math.max(r.length, a.length), s = BigInt(n + r.padEnd(o, "0")), c = BigInt(i + a.padEnd(o, "0"));
	return s === c ? 0 : s > c ? 1 : -1;
}
function ki(e) {
	if (!X(e) || BigInt(e) > 8640000000000000n) return e == null ? "—" : Ti(e);
	let t = new Date(Number(e));
	return Number.isNaN(t.getTime()) ? Ti(e) : t.toLocaleString();
}
function Z(e, t = 64, n = !1) {
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
	Q(Li(e) && Ei(e.operator_id) === e.operator_id && Ei(e.agent_id) === e.agent_id, "IDENTITY_UNCONFIRMED");
}
function Vi(e) {
	Q(Li(e)), Bi(e.actor), Q(Array.isArray(e.sites) && e.sites.length <= 100);
	let t = /* @__PURE__ */ new Set();
	for (let n of e.sites) {
		Q(Li(n) && Z(n.site_id, 128) && !t.has(n.site_id) && Array.isArray(n.games)), t.add(n.site_id), Q(n.games.length > 0 && n.games.length <= 2);
		let e = /* @__PURE__ */ new Set();
		for (let t of n.games) Q(Li(t) && ["UP_DOWN", "HIGH_LOW"].includes(String(t.game_type)) && !e.has(t.game_type) && Array.isArray(t.symbols) && t.symbols.length <= 100 && t.symbols.every((e) => Z(e, 64, !0)) && new Set(t.symbols).size === t.symbols.length), e.add(t.game_type);
	}
}
function Hi(e, t) {
	Q(Object.keys(e).every((e) => t.includes(e)));
}
function Ui(e) {
	Q(Li(e) && Z(e.site_id, 128) && ["GAME_TYPE_UP_DOWN", "GAME_TYPE_HIGH_LOW"].includes(String(e.game_type)) && Z(e.symbol, 64, !0)), Q(X(e.version, !0) && X(e.based_on_public_version, !0) && typeof e.enabled == "boolean" && Array.isArray(e.overrides));
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
		]), Q(n.game_type === e.game_type && n.symbol === e.symbol && (t ? Ii.includes(String(n.duration_seconds)) : X(n.duration_seconds, !0))), Q(!Object.hasOwn(n, "enabled") || typeof n.enabled == "boolean"), Q(Array.isArray(n.stake_tiers) && n.stake_tiers.length <= +!!t), t || Gi(n);
		for (let e of n.stake_tiers) Q(Li(e)), Hi(e, [
			"stake_tier_id",
			"enabled",
			"maximum_stake"
		]), Q(Z(e.stake_tier_id) && (!Object.hasOwn(e, "enabled") || typeof e.enabled == "boolean") && (!Object.hasOwn(e, "maximum_stake") || Di(e.maximum_stake)));
	}
}
function Wi(e, t, n, r) {
	Q(Li(e)), Ui(e.stored);
	let i = e.stored, a = e.effective;
	Q(i.site_id === t && i.symbol === n && Li(a) && (!r || i.game_type === "GAME_TYPE_" + r));
	let o = i.game_type === "GAME_TYPE_UP_DOWN";
	Q(a.site_id === t && a.symbol === n && a.game_type === i.game_type), Q(X(a.public_version, !0) && a.site_version === i.version && a.based_on_public_version === i.based_on_public_version && typeof a.enabled == "boolean"), Q(Array.isArray(a.rules) && (o ? a.rules.length === 5 : a.rules.length > 0 && a.rules.length <= 100) && new Set(a.rules.map((e) => e.duration_seconds)).size === a.rules.length);
	let s = a.rules;
	for (let e of s) {
		if (Q(Li(e) && e.game_type === i.game_type && e.symbol === n && (o ? Ii.includes(String(e.duration_seconds)) : X(e.duration_seconds, !0)) && typeof e.enabled == "boolean"), Q(Array.isArray(e.stake_tiers)), !o) {
			Q(e.stake_tiers.length === 0), Gi(e, !0);
			continue;
		}
		Q(e.bet_open_seconds === "30"), Q(e.stake_tiers.every((e) => Li(e) && Z(e.stake_tier_id) && typeof e.enabled == "boolean" && typeof e.retired == "boolean"));
		let t = e.stake_tiers.filter((e) => !e.retired);
		Q(t.length === 1 && t[0].minimum_stake === "1" && Di(t[0].maximum_stake));
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
	]) (t || Object.hasOwn(e, n)) && Q(Di(e[n]) && Oi(e[n], n === "fixed_odds" ? "1" : "0") > 0);
	e.minimum_stake !== void 0 && e.maximum_stake !== void 0 && Q(Oi(e.minimum_stake, e.maximum_stake) <= 0);
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
	Q(typeof n == "boolean" && Z(r, 500) && Z(i, 128), "INVALID_REASON"), Q(t.length === a.length && new Set(t.map((e) => e.duration_seconds)).size === a.length);
	let o = Fi(e), s = a.map((n) => {
		let r = t.find((e) => e.duration_seconds === n.duration_seconds);
		Q(r && r.stake_tier_id === n.stake_tier_id && typeof r.enabled == "boolean");
		let i = e.stored.overrides.find((e) => e.duration_seconds === n.duration_seconds);
		if (o === "HIGH_LOW") {
			Gi(r, !0), Q(Oi(r.fixed_odds, "2") < 0, "INVALID_ODDS");
			let e = { duration_seconds: n.duration_seconds };
			i ? i.enabled !== void 0 && (e.enabled = i.enabled) : e.enabled = r.enabled, r.enabled !== n.enabled && (e.enabled = r.enabled);
			for (let t of [
				"fixed_odds",
				"minimum_stake",
				"maximum_stake"
			]) i?.[t] !== void 0 && (e[t] = i[t]), r[t] !== n[t] && (e[t] = r[t]);
			return e;
		}
		Q(Di(r.maximum_stake) && Oi(r.maximum_stake, "1") >= 0, "INVALID_MAXIMUM");
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
	return X(e?.operator_id, !0) ? Xi(e) ? X(e.config_site_id) ? e.kind === "SITE" ? e.agent_id === "0" && X(e.config_site_id, !0) : e.kind === "MERCHANT" && X(e.agent_id, !0) && e.operator_id === e.agent_id : !1 : e.operator_id === e.agent_id : !1;
}
var Qi = (e) => typeof e == "string" && /^(0|[1-9][0-9]{0,17})(\.[0-9]{1,18})?$/.test(e) && Oi(e, "0") > 0;
function $i(e, t, n, r) {
	return [
		e,
		t,
		n,
		r
	].every(Qi) && Oi(e, n) <= 0 && Oi(n, r) <= 0 && Oi(r, t) <= 0;
}
function ea(e, t) {
	Q(Zi(t), "IDENTITY_UNCONFIRMED"), Q(Li(e) && e.owner_agent_id === t.agent_id && ["GAME_TYPE_UP_DOWN", "GAME_TYPE_HIGH_LOW"].includes(String(e.game_type)) && Z(e.symbol, 64, !0), "INVALID_OWNER_CONFIGURATION"), Q(X(e.public_version, !0) && X(e.owner_revision) && Array.isArray(e.rules) && e.rules.length > 0 && e.rules.length <= 100);
	let n = Xi(t);
	Q(e.config_model === "SCOPED_OWNER_V1" === n, "CONFIGURATION_MODEL_MISMATCH"), n && (Q(e.config_site_id === t.config_site_id && X(e.revision, !0) && X(e.site_revision), "IDENTITY_UNCONFIRMED"), Q(e.revision === (t.kind === "SITE" ? e.site_revision : e.owner_revision)), Q(t.kind !== "SITE" || e.owner_revision === "0"), Q(t.config_site_id !== "0" || e.site_revision === "0"), Q(typeof e.effective_enabled == "boolean" && typeof e.can_enable == "boolean" && ["", "PARENT_CONSTRAINT_CHANGED"].includes(String(e.blocked_reason))), Q(e.symbol_available === void 0 || typeof e.symbol_available == "boolean"), Q(!e.can_enable || e.blocked_reason === "" && e.symbol_available !== !1));
	let r = n && e.blocked_reason === "PARENT_CONSTRAINT_CHANGED";
	Q(typeof e.enabled == "boolean" && typeof e.platform_enabled == "boolean");
	let i = e.game_type === "GAME_TYPE_UP_DOWN", a = /* @__PURE__ */ new Set();
	i && Q(e.rules.length === 5);
	for (let t of e.rules) {
		Q(Li(t) && Li(t.rule) && X(t.rule_epoch, !0) && typeof t.custom == "boolean");
		let n = t.rule;
		Q(typeof t.platform_enabled == "boolean" && typeof t.owner_enabled == "boolean" && n.enabled === (!r && e.enabled && t.platform_enabled && t.owner_enabled)), Q(i ? Qi(t.platform_target_payout_rate) && Qi(t.platform_maximum_odds) && t.platform_fixed_odds === "" && Qi(n.target_payout_rate) && Qi(n.maximum_odds) && (r || Oi(n.target_payout_rate, t.platform_target_payout_rate) <= 0) && Oi(n.target_payout_rate, "1") <= 0 && (r || Oi(n.maximum_odds, t.platform_maximum_odds) <= 0) && Oi(n.maximum_odds, "1") >= 0 : Qi(t.platform_fixed_odds) && t.platform_target_payout_rate === "" && t.platform_maximum_odds === "" && Qi(n.fixed_odds) && Oi(n.fixed_odds, "1") > 0 && (r || Oi(n.fixed_odds, t.platform_fixed_odds) <= 0)), Q(n.game_type === e.game_type && n.symbol === e.symbol && X(n.duration_seconds, !0) && !a.has(n.duration_seconds) && typeof n.enabled == "boolean" && Array.isArray(n.stake_tiers)), a.add(n.duration_seconds);
		let o = n;
		if (i) {
			Q(Ii.includes(n.duration_seconds) && n.bet_open_seconds === "30");
			let e = /* @__PURE__ */ new Set(), t = n.stake_tiers.filter((t) => (Q(Li(t) && Z(t.stake_tier_id) && !e.has(t.stake_tier_id) && typeof t.retired == "boolean" && typeof t.enabled == "boolean"), e.add(t.stake_tier_id), !t.retired));
			Q(t.length === 1), o = t[0], Q(Li(o) && Z(o.stake_tier_id) && typeof o.enabled == "boolean" && o.retired === !1), Q(Di(n.target_payout_rate) && Di(n.minimum_odds) && Di(n.maximum_odds));
		} else Q(n.stake_tiers.length === 0 && Di(n.fixed_odds));
		Q(Qi(t.platform_minimum_stake) && Qi(t.platform_maximum_stake) && Qi(o.minimum_stake) && Qi(o.maximum_stake) && Oi(o.minimum_stake, o.maximum_stake) <= 0), Q(r || $i(t.platform_minimum_stake, t.platform_maximum_stake, o.minimum_stake, o.maximum_stake));
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
	Q(Z(r, 500) && Z(i, 128), "INVALID_REASON");
	let c = [];
	for (let t of o) {
		let r = n.find((e) => e.duration_seconds === t.duration_seconds);
		Q(r && r.stake_tier_id === t.stake_tier_id && r.based_rule_epoch === t.based_rule_epoch && (s || $i(t.platform_minimum, t.platform_maximum, r.minimum_stake, r.maximum_stake)), "INVALID_LIMITS"), Q(typeof r.owner_enabled == "boolean" && (r.owner_enabled === t.owner_enabled || !r.owner_enabled || t.platform_enabled), "PLATFORM_DISABLED");
		let i = e.game_type === "GAME_TYPE_UP_DOWN", a = i ? ["target_payout_rate", "maximum_odds"] : ["fixed_odds"];
		for (let e of a) Q(Qi(r[e]) && (s || Oi(r[e], t[`platform_${e}`]) <= 0), "INVALID_ODDS");
		Q(i ? Oi(r.target_payout_rate, "1") < 0 && Oi(r.maximum_odds, "1") >= 0 : Oi(r.fixed_odds, "1") > 0 && Oi(r.fixed_odds, "2") < 0, "INVALID_ODDS");
		let o = Oi(r.minimum_stake, t.minimum_stake) !== 0 || Oi(r.maximum_stake, t.maximum_stake) !== 0, l = a.some((e) => Oi(r[e], t[e]) !== 0), u = r.owner_enabled !== t.owner_enabled;
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
	sa(oa(e)), sa(e.scope === "CONFIG_SCOPE_AGENT" && Ei(e.agent_id) === e.agent_id), sa(X(e.template_version) && X(e.agent_version) && Z(e.effective_version, 256) && X(e.updated_at_ms)), sa(Array.isArray(e.rules) && e.rules.length === 5);
	let t = e.rules, n = t[0]?.symbol;
	sa(Z(n, 64, !0)), sa(new Set(t.map((e) => e.duration_seconds)).size === 5);
	for (let e of t) sa(oa(e) && e.game_type === "GAME_TYPE_UP_DOWN" && e.symbol === n && ia.includes(e.duration_seconds) && typeof e.enabled == "boolean"), sa(Array.isArray(e.stake_tiers) && e.stake_tiers.every((e) => oa(e) && Z(e.stake_tier_id) && typeof e.enabled == "boolean" && typeof e.retired == "boolean"));
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
	]), sa(Z(e.client_request_id, 128) && Z(e.reason, 500) && X(e.based_on_template_version) && X(e.based_on_agent_version) && e.game_type === "UP_DOWN" && Z(e.symbol, 64, !0), "PENDING_CORRUPT");
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
		]), sa(Z(t.stake_tier_id) && t.enabled === e.enabled && Di(t.maximum_stake) && Oi(t.maximum_stake, "1") >= 0, "PENDING_CORRUPT");
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
	]), sa(n.schema === 1 && Ei(n.operator_id) === n.operator_id && Ei(n.agent_id) === n.agent_id && typeof n.attempted == "boolean" && Number.isSafeInteger(n.attempt) && Number(n.attempt) >= 0 && n.attempted === Number(n.attempt) > 0, "PENDING_CORRUPT"), da(n.body), fa(n);
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
		].every((e) => typeof i[e] == "string")), sa(Z(i.operation_id, 256) && Z(i.trace_id, 256) && X(i.created_at_ms) && X(i.completed_at_ms)), sa(i.client_request_id === t.client_request_id && i.operator_id === n && i.source_service === "agent_admin" && i.result === "OPERATION_RESULT_SUCCEEDED" && i.reason === t.reason), !0;
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
	], ["enabled", "based_on_public_version"]), Q(e.based_on_public_version === void 0 || e.enabled === !0 && X(e.based_on_public_version, !0), "PENDING_CORRUPT"), Q(e.enabled === void 0 || typeof e.enabled == "boolean", "PENDING_CORRUPT"), Q(["UP_DOWN", "HIGH_LOW"].includes(String(e.game_type)) && Z(e.symbol, 64, !0) && Z(e.client_request_id, 128) && Z(e.reason, 500) && X(e.based_owner_revision), "PENDING_CORRUPT"), Q(Array.isArray(e.changes) && (e.changes.length > 0 || e.enabled !== void 0) && e.changes.length <= 100 && new Set(e.changes.map((e) => e.duration_seconds)).size === e.changes.length, "PENDING_CORRUPT");
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
	]), Q(t.enabled === void 0 || typeof t.enabled == "boolean", "PENDING_CORRUPT"), e.game_type === "UP_DOWN" ? (Q(t.fixed_odds === void 0, "PENDING_CORRUPT"), (t.target_payout_rate !== void 0 || t.maximum_odds !== void 0) && Q(Qi(t.target_payout_rate) && Oi(t.target_payout_rate, "1") <= 0 && Qi(t.maximum_odds) && Oi(t.maximum_odds, "1") >= 0, "PENDING_CORRUPT")) : (Q(t.target_payout_rate === void 0 && t.maximum_odds === void 0, "PENDING_CORRUPT"), t.fixed_odds !== void 0 && Q(Qi(t.fixed_odds) && Oi(t.fixed_odds, "1") > 0, "PENDING_CORRUPT")), Q(X(t.duration_seconds, !0) && X(t.based_rule_epoch, !0) && (e.game_type === "UP_DOWN" ? Ii.includes(t.duration_seconds) && Z(t.stake_tier_id) : t.stake_tier_id === ""), "PENDING_CORRUPT"), Q(Qi(t.minimum_stake) && Qi(t.maximum_stake) && Oi(t.minimum_stake, t.maximum_stake) <= 0, "PENDING_CORRUPT");
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
			]) e[n] !== void 0 && Q(Oi(t.rule[n], e[n]) === 0);
			let i = n.game_type === "UP_DOWN" ? Yi(t.rule) : t.rule;
			Q(("stake_tier_id" in i ? i.stake_tier_id : "") === e.stake_tier_id && Oi(i.minimum_stake, e.minimum_stake) === 0 && Oi(i.maximum_stake, e.maximum_stake) === 0);
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
		].every((e) => typeof i[e] == "string")), Q(Z(i.operation_id, 256) && Z(i.trace_id, 256) && Z(i.target_id, 256) && X(i.created_at_ms) && X(i.completed_at_ms)), Q(i.operator_id === t.operator_id && i.client_request_id === n.client_request_id && i.reason === n.reason && i.source_service === "agent_admin"), Q(i.result === "OPERATION_RESULT_SUCCEEDED" && i.error_code === "" && i.action === "ADMIN_ACTION_OWNER_CONFIG_PUBLISH" && i.capability === "prediction.owner.config.publish" && i.target_type === "owner_config"), !0;
	} catch {
		return !1;
	}
}
function ka(e, t) {
	Q(Li(e) && Li(e.stored) && Li(e.receipt));
	let n = e.stored, r = e.receipt, i = t.body;
	Q(Li(n.key) && n.key.configSiteId === t.config_site_id && n.key.ownerAgentId === t.agent_id && n.key.gameType === i.game_type && n.key.symbol === i.symbol), Q(X(n.revision, !0) && BigInt(n.revision) === BigInt(i.based_owner_revision) + 1n && X(n.basedPublicVersion, !0) && X(n.basedSiteRevision)), i.based_on_public_version !== void 0 && Q(n.basedPublicVersion === i.based_on_public_version), Q(n.basedSiteRevision === "0" == (t.kind === "SITE" || t.config_site_id === "0")), Q(typeof n.disabled == "boolean" && (i.enabled === void 0 || n.disabled === !i.enabled)), Q(Array.isArray(n.overrides) && n.overrides.length > 0 && n.overrides.length <= 100);
	let a = /* @__PURE__ */ new Map();
	for (let e of n.overrides) {
		Q(Li(e) && Li(e.key) && e.key.gameType === i.game_type && e.key.symbol === i.symbol && Number.isSafeInteger(e.key.durationSeconds) && Number(e.key.durationSeconds) > 0);
		let t = String(e.key.durationSeconds);
		Q(!a.has(t) && typeof e.enabled == "boolean" && X(e.basedRuleEpoch, !0) && Li(e.bounds) && Li(e.odds)), Q(Qi(e.bounds.minimum) && Qi(e.bounds.maximum) && Oi(e.bounds.minimum, e.bounds.maximum) <= 0), i.game_type === "UP_DOWN" ? Q(Ii.includes(t) && Z(e.stakeTierId) && Qi(e.odds.targetPayoutRate) && Oi(e.odds.targetPayoutRate, "1") <= 0 && Qi(e.odds.maximumOdds) && Oi(e.odds.maximumOdds, "1") >= 0 && e.odds.fixedOdds === void 0) : Q(e.stakeTierId === "" && Qi(e.odds.fixedOdds) && Oi(e.odds.fixedOdds, "1") > 0 && e.odds.targetPayoutRate === void 0 && e.odds.maximumOdds === void 0), a.set(t, e);
	}
	for (let e of i.changes) {
		let t = a.get(e.duration_seconds);
		Q(t && Li(t.bounds) && Li(t.odds) && t.stakeTierId === e.stake_tier_id && t.basedRuleEpoch === e.based_rule_epoch && (e.enabled === void 0 || t.enabled === e.enabled)), Q(Oi(String(t.bounds.minimum), e.minimum_stake) === 0 && Oi(String(t.bounds.maximum), e.maximum_stake) === 0);
		for (let [n, r] of [
			["target_payout_rate", "targetPayoutRate"],
			["maximum_odds", "maximumOdds"],
			["fixed_odds", "fixedOdds"]
		]) e[n] !== void 0 && Q(Oi(String(t.odds[r]), e[n]) === 0);
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
	].every((e) => typeof r[e] == "string")), Q(Z(r.operation_id, 256) && Z(r.trace_id, 256) && typeof r.target_id == "string" && /^[a-f0-9]{64}$/.test(r.target_id) && X(r.created_at_ms) && X(r.completed_at_ms)), Q(r.operator_id === t.operator_id && r.client_request_id === i.client_request_id && r.reason === i.reason && r.source_service === "agent_admin"), Q(r.result === "OPERATION_RESULT_SUCCEEDED" && r.error_code === "" && r.action === "ADMIN_ACTION_SCOPED_CONFIG_PUBLISH" && r.target_type === "scoped_owner_config" && r.capability === "prediction." + (t.kind === "SITE" ? "site" : "owner") + ".config.publish");
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
			let i = et(n, t.body.client_request_id), s = !a && i !== "unverified" && _a(n);
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
		...ot.filter((t) => t in e),
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
	return "availability_version" in e && ($(typeof e.availability_version == "string" && /^(0|[1-9][0-9]*)$/.test(e.availability_version) && Ka(e.availability_version, "9223372036854775807") <= 0), t.availability_version = e.availability_version), Object.assign(t, ft(e, Wa)), "layout" in e && (t.layout = ro(e.layout)), t;
}
function ao(e, t, n) {
	let r = io(e);
	return $(r.site_id === t && r.symbol === n, "INVALID_GRID_TARGET"), r;
}
function oo(e, t, n, r, i, a = !1) {
	let o = io(e), s = io(t);
	$(o.site_id === s.site_id && o.symbol === s.symbol, "INVALID_GRID_TARGET"), $(typeof n == "string" && n.length <= 500 && n.trim().length > 0 && !n.includes("\0"), "INVALID_REASON"), $(typeof r == "string" && /^[A-Za-z0-9_-]{8,64}$/.test(r), "INVALID_REQUEST_ID"), $(o.config_id && o.default_version && o.default_resolution_epoch, "CONFIG_IDENTITY_REQUIRED"), $(Ra.every((e) => o[e] === s[e]), "INVALID_GRID_TARGET"), $(JSON.stringify(ft(o, Wa)) === JSON.stringify(ft(s, Wa)), "INVALID_GRID_TARGET");
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
		...pt(o) ? { based_on_global_version: pt(o) } : {},
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
		let { initializeGridSite: l, initializeGridMerchant: f, gridConfigSymbols: ee, gridConfigCatalog: p, gridConfigReceipt: m, gridConfigSite: h, saveGridConfig: g } = he().grid, re = _e(), ie = t, y = i(() => ie.actor?.kind === "SITE"), b = () => bo(sessionStorage, ie.actor), x = ge(), C = (e) => x.perms.includes("*") || x.perms.includes(e), oe = i(() => C("prediction_config:lists") && (!y.value || x.userInfo.can_manage_prediction_config === !0 && ie.actor?.operator_id === String(x.userInfo.id))), E = oe, D = i(() => {
			let e = String(x.userInfo.id || "");
			return /^[1-9]\d*$/.test(e) ? e : "";
		}), A = i(() => `${D.value}:${x.token ?? ""}:${ie.actor?.kind ?? ""}:${ie.actor?.tenant_id ?? ""}:${ie.actor?.config_site_id ?? ""}`), j = v([]), M = v(""), N = v(""), ce = v(""), F = v(null), I = v(null), L = v(""), B = v("通过预测网格配置页面保存配置"), fe = v(!1), V = v(!1), H = v(!1), pe = v(!1), U = v(!1), W = v(""), G = v(""), me = v("info"), ye = v(null), be = v(!1), xe = v(""), Se = v(!1), Ce = new yo(), we = new yo(), K = new yo(), q, Te = 0, Ee = i(() => oe.value ? D.value ? "" : "无法确认当前操作人身份" : "当前账号没有预测网格配置查询权限"), De = i(() => j.value.find((e) => e.site_id === M.value)), Oe = i(() => y.value && De.value?.can_edit_limits === !0), ke = v([]), Ae = v(""), je = i(() => xo(De.value?.products ?? [], ke.value, y.value)), Me = i(() => {
			let e = ce.value.trim().toUpperCase();
			return je.value.filter((t) => !e || t.symbol.includes(e));
		}), Ne = i(() => {
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
		}), Pe = i(() => ye.value ? ye.value.operator_id === D.value ? "bound" : "foreign" : "none"), Fe = i(() => Pe.value === "bound" ? ye.value : null), Ie = i(() => Pe.value === "foreign"), Le = i(() => Ne.value || !!ye.value || U.value), J = i(() => oe.value && E.value && !!De.value?.can_edit && !!D.value && !!F.value && !ye.value && !be.value && !pe.value && !U.value), Re = i(() => !!Fe.value && oe.value && E.value && j.value.some((e) => e.site_id === Fe.value.command.site_id && e.can_edit)), ze = i(() => Re.value && V.value && !H.value && !pe.value && !U.value && !be.value && !Se.value && xe.value === JSON.stringify(Fe.value));
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
			let e = [F.value?.effective_from_ms, F.value?.layout?.effective_from_ms].filter((e) => typeof e == "string" && /^[1-9][0-9]*$/.test(e)).reduce((e, t) => BigInt(e) > BigInt(t) ? e : t, "0");
			return e === "0" ? "未提供" : ki(e);
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
			return e.sites.filter((e) => !y.value || e.site_id === ie.actor?.config_site_id).map((e) => ({
				...e,
				products: e.products.filter((e) => y.value || e.default_enabled)
			}));
		}
		function Ue() {
			try {
				let e = ho(b(), D.value);
				ye.value = e.pending ?? null, be.value = !1;
			} catch {
				be.value = !0, ye.value = null;
			}
		}
		function We() {
			return `${A.value}:${M.value}:${N.value}`;
		}
		function Ge() {
			we.close(), F.value = null, I.value = null, L.value = "", B.value = "通过预测网格配置页面保存配置", pe.value = !1;
		}
		async function Ke(e) {
			if (V.value = !1, Ce.close(), K.close(), xe.value = "", Ge(), j.value = [], ke.value = [], Ae.value = "", M.value = "", N.value = "", ce.value = "", W.value = "", G.value = "", Ue(), Ee.value || be.value) return;
			let t = Ce.next(A.value);
			H.value = !0;
			try {
				if (y.value) {
					if (!l || !ie.actor?.config_site_id) throw Error("SITE_UNAVAILABLE");
					Fe.value || await l(ie.actor.config_site_id, t.signal);
				} else await f(t.signal);
				if (!t.current(A.value)) return;
				let [n, r] = await Promise.allSettled([p(t.signal), ee(t.signal)]);
				if (!t.current(A.value)) return;
				if (r.status === "fulfilled" && Array.isArray(r.value) && r.value.every((e) => typeof e == "string") ? ke.value = r.value : Ae.value = "通用币种目录暂不可用，当前仅显示已授权的网格配置。", n.status === "rejected") throw n.reason;
				j.value = He(n.value), V.value = !0;
				let i = Fe.value ?? (e ? { command: e } : null), a = i && j.value.some((e) => e.site_id === i.command.site_id) ? i.command.site_id : j.value[0]?.site_id || "";
				M.value = a;
				let o = j.value.find((e) => e.site_id === a), s = i && i.command.site_id === a && o?.products.some((e) => e.symbol === i.command.symbol) ? i.command.symbol : je.value.find((e) => e.configured)?.symbol || "";
				N.value = s, s && (q = Ye());
			} catch (e) {
				t.current(A.value) && (W.value = Be(e));
			} finally {
				t.current(A.value) && (H.value = !1);
			}
		}
		function qe(e) {
			Le.value || (Ge(), M.value = e, N.value = je.value.find((e) => e.configured)?.symbol || "", N.value && (q = Ye()));
		}
		function Je(e) {
			e === N.value || Le.value || !De.value?.products.some((t) => t.symbol === e) || (Ge(), N.value = e, q = Ye());
		}
		async function Ye() {
			if (Ge(), !oe.value || !M.value || !N.value) return;
			let e = M.value, t = N.value, n = We(), r = we.next(n);
			pe.value = !0;
			try {
				let n = await h(e, t, r.signal);
				if (!r.current(We())) return;
				let i = ao(n, e, t);
				if (y.value && i.requested_agent_id !== "0") throw Error("CONFIG_IDENTITY_REQUIRED");
				F.value = i, I.value = structuredClone(i), L.value = Ja(i.target_rtp);
			} catch (e) {
				r.current(We()) && (W.value = Be(e));
			} finally {
				r.current(We()) && (pe.value = !1);
			}
		}
		function Xe(e) {
			return e.symbol === N.value && I.value ? I.value.enabled && (y.value || I.value.default_enabled !== !1) : e.enabled;
		}
		function Ze(e) {
			return !y.value && e.symbol === N.value && F.value?.default_enabled === !1 || !De.value?.products.some((t) => t.symbol === e.symbol) || !E.value || !De.value?.can_edit || pe.value || U.value || !!ye.value || be.value || Ne.value && e.symbol !== N.value;
		}
		async function Qe(e, t) {
			typeof t != "boolean" || Ze(e) || (e.symbol !== N.value && (Je(e.symbol), await q), I.value && I.value.symbol === e.symbol && !Ze(e) && (I.value.enabled = t, $e()));
		}
		function $e() {
			G.value = "";
		}
		async function et() {
			if (!J.value || !F.value || !I.value || !D.value) return;
			let e;
			try {
				e = oo(F.value, {
					...I.value,
					target_rtp: Ya(L.value)
				}, B.value, Xa(), Oe.value, !1);
			} catch (e) {
				if (e instanceof Error && e.message === "EMPTY_CHANGES") {
					G.value = "", le.success("保存成功");
					return;
				}
				me.value = "warning", G.value = Be(e);
				return;
			}
			let t = po(D.value, e);
			try {
				await R.confirm(`确认保存 ${e.site_id} / ${e.symbol} 的 ${Object.keys(e.changes).length} 项修改？`, "确认预测网格配置", {
					type: "warning",
					confirmButtonText: "确认保存",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			}
			if (Ue(), !J.value || !F.value || !I.value) {
				me.value = "warning", G.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let n;
			try {
				n = oo(F.value, {
					...I.value,
					target_rtp: Ya(L.value)
				}, B.value, t.command.client_request_id, Oe.value, !1);
			} catch {
				me.value = "warning", G.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
				return;
			}
			let r;
			try {
				r = mo(b(), t, D.value, n), Ue();
			} catch (e) {
				if (e?.message === "STALE_CONFIRMATION") {
					me.value = "warning", G.value = "确认期间账号、目标或编辑状态已变化，本次保存已取消";
					return;
				}
				be.value = !0;
				return;
			}
			rt(r, "save");
		}
		async function tt() {
			Ue(), !(!Fe.value || !Re.value || U.value || Se.value) && rt(Fe.value, "receipt");
		}
		async function nt() {
			if (Ue(), !ze.value || !Fe.value) return;
			let e = Fe.value;
			Se.value = !0;
			try {
				await R.confirm(`确认恢复 ${e.command.site_id} / ${e.command.symbol} 的原请求 ${e.command.client_request_id}？将沿用原编号和原参数；已提交则返回原回执，尚未提交则保存原配置，不使用当前页面的新修改。`, "恢复原配置请求", {
					type: "warning",
					confirmButtonText: "确认恢复",
					cancelButtonText: "取消"
				});
			} catch {
				return;
			} finally {
				Se.value = !1;
			}
			if (Ue(), !ze.value || JSON.stringify(e) !== JSON.stringify(Fe.value)) {
				me.value = "warning", G.value = "确认期间账号、权限或原请求已变化，本次恢复已取消，请重新查询原操作回执";
				return;
			}
			await rt(e, "recover");
		}
		async function rt(e, t) {
			let n = ++Te, r = We(), i = K.next(r);
			U.value = !0, xe.value = "", G.value = "";
			try {
				let n = await vo(b(), e, t, (e, t) => e === "save" ? g(t) : m(t));
				if (!i.current(We())) return;
				if (Ue(), n.status === "success") {
					let e = D.value;
					B.value = "通过预测网格配置页面保存配置", U.value = !1, await Ke(), e === D.value && (me.value = "warning", G.value = W.value ? "配置已保存；最新配置刷新失败，请手动刷新" : "", W.value || le.success("保存成功"));
				} else if (t === "recover" && n.status === "rejected" && n.error?.error_code === "VERSION_CONFLICT") if (!n.journalCleared || ye.value || be.value) me.value = "warning", G.value = "旧请求已明确拒绝，但本机待确认记录已变化，请重新核对当前记录";
				else {
					let t = D.value;
					if (await Ke(e.command), M.value && N.value && q && await q, t === D.value) {
						me.value = "warning";
						let t = M.value === e.command.site_id && N.value === e.command.symbol && j.value.some((t) => t.site_id === e.command.site_id && t.products.some((t) => t.symbol === e.command.symbol));
						G.value = "旧请求未生效，配置版本已变化；已清除旧待确认记录。" + (t ? W.value || !F.value ? "最新配置刷新失败，请手动刷新" : "请以当前配置为准" : `原目标当前不可见（${e.command.site_id} / ${e.command.symbol}），请核对权限和配置`);
					}
				}
				else me.value = n.status === "unknown" ? "warning" : "info", t === "receipt" && _o(n.error) && JSON.stringify(Fe.value) === JSON.stringify(e) ? (xe.value = JSON.stringify(e), G.value = "未找到原操作回执，可使用原编号和原参数恢复请求") : t === "recover" ? G.value = "恢复尚未确认，原请求已保留，请重新查询原操作回执 · " + Be(n.error) : G.value = n.status === "unknown" ? "原操作结果仍待确认，请使用原请求查询回执" : "保存已明确拒绝，可修正后重新提交 · " + Be(n.error);
			} catch (e) {
				i.current(We()) && (Ue(), me.value = "warning", G.value = "原操作结果仍待确认 · " + Be(e));
			} finally {
				n === Te && (U.value = !1, Ue());
			}
		}
		async function it() {
			if (!Le.value) return !0;
			try {
				return await R.confirm("当前有未保存修改或待确认操作，离开不会删除原记录。仍要离开吗？", "离开预测网格配置", { type: "warning" }), !0;
			} catch {
				return !1;
			}
		}
		function at() {
			return JSON.stringify({
				operator: D.value,
				site: M.value,
				symbol: N.value,
				snapshot: F.value,
				draft: I.value,
				rtp: L.value,
				reason: B.value
			});
		}
		async function ot() {
			if (!U.value) {
				if (Ne.value) {
					let e = at();
					try {
						await R.confirm("刷新会丢弃当前未保存修改，仍要刷新吗？", "刷新预测网格配置", { type: "warning" });
					} catch {
						return;
					}
					if (U.value || e !== at()) {
						me.value = "warning", G.value = "确认期间编辑状态已变化，本次刷新已取消";
						return;
					}
				}
				await Ke();
			}
		}
		function st(e) {
			Le.value && (e.preventDefault(), e.returnValue = "");
		}
		return se(() => [
			A.value,
			oe.value,
			E.value
		], () => Ke(), { immediate: !0 }), ve(it), window.addEventListener("beforeunload", st), ne(() => {
			xe.value = "", V.value = !1, Ce.close(), we.close(), K.close(), window.removeEventListener("beforeunload", st);
		}), n({
			hasBlockingWork: Le,
			confirmLeave: it,
			refresh: ot,
			loading: H
		}), (t, n) => (_(), s("section", Co, [
			Ee.value ? (_(), a(w(O), {
				key: 0,
				title: Ee.value,
				type: "warning",
				closable: !1
			}, null, 8, ["title"])) : be.value ? (_(), a(w(O), {
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
			W.value ? (_(), s("div", wo, [d(w(O), {
				title: W.value,
				type: "error",
				closable: !1
			}, null, 8, ["title"]), d(w(k), {
				loading: H.value || pe.value,
				disabled: U.value || !!ye.value,
				onClick: ot
			}, {
				default: T(() => [...n[9] ||= [u("重试", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"])])) : o("", !0),
			G.value ? (_(), a(w(O), {
				key: 4,
				title: G.value,
				type: me.value,
				closable: !1
			}, null, 8, ["title", "type"])) : o("", !0),
			Fe.value ? (_(), s("div", To, [c("div", null, [n[10] ||= c("strong", null, "原配置操作结果待确认", -1), c("small", null, S(Fe.value.command.site_id) + " · " + S(Fe.value.command.symbol) + " · " + S(Fe.value.command.client_request_id), 1)]), c("div", Eo, [d(w(k), {
				type: "warning",
				loading: U.value,
				disabled: !Re.value || Se.value,
				onClick: tt
			}, {
				default: T(() => [...n[11] ||= [u("查询原操作回执", -1)]]),
				_: 1
			}, 8, ["loading", "disabled"]), ze.value || Se.value ? (_(), a(w(k), {
				key: 0,
				type: "warning",
				disabled: !ze.value,
				onClick: nt
			}, {
				default: T(() => [...n[12] ||= [u("恢复原请求", -1)]]),
				_: 1
			}, 8, ["disabled"])) : o("", !0)])])) : o("", !0),
			d(_n, {
				loading: H.value,
				"min-height": "0px",
				class: "grid-loading-region"
			}, {
				default: T(() => [c("div", Do, [c("aside", Oo, [
					c("div", ko, [n[13] ||= c("strong", null, "交易对配置", -1), c("span", null, S(Me.value.length) + " 条", 1)]),
					j.value.length > 1 ? (_(), a(w(ue), {
						key: 0,
						modelValue: M.value,
						"onUpdate:modelValue": n[0] ||= (e) => M.value = e,
						"aria-label": "选择站点",
						disabled: Le.value,
						onChange: qe
					}, {
						default: T(() => [(_(!0), s(r, null, ae(j.value, (e) => (_(), a(w(z), {
							key: e.site_id,
							label: e.site_id,
							value: e.site_id
						}, null, 8, ["label", "value"]))), 128))]),
						_: 1
					}, 8, ["modelValue", "disabled"])) : o("", !0),
					Ae.value ? (_(), s("p", Ao, [u(S(Ae.value), 1), d(w(k), {
						link: "",
						type: "primary",
						disabled: Le.value,
						onClick: ot
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
					c("div", jo, [(_(!0), s(r, null, ae(Me.value, (e) => (_(), s("div", {
						key: e.symbol,
						class: te(["symbol-row", { active: e.symbol === N.value }])
					}, [
						c("button", {
							type: "button",
							class: "symbol-button",
							disabled: !e.configured || Le.value && e.symbol !== N.value,
							onClick: (t) => Je(e.symbol)
						}, [d(w(re), { symbol: e.symbol }, null, 8, ["symbol"])], 8, Mo),
						e.configured ? (_(), a(w(de), {
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
						])) : (_(), s("span", No, "未配置")),
						e.symbol === N.value && Ne.value ? (_(), s("small", Po, "未保存")) : o("", !0)
					], 2))), 128)), !H.value && De.value && !Me.value.length ? (_(), a(w(P), {
						key: 0,
						description: "当前站点没有已授权的预测网格产品",
						"image-size": 56
					})) : o("", !0)])
				]), c("main", Fo, [!H.value && !j.value.length && !W.value ? (_(), a(w(P), {
					key: 0,
					description: "当前账号暂无授权站点"
				})) : De.value && !N.value ? (_(), a(w(P), {
					key: 1,
					description: "请选择交易对查看配置"
				})) : F.value && I.value ? (_(), s(r, { key: 2 }, [
					c("header", Io, [c("div", null, [
						c("h2", null, S(F.value.symbol) + " · 预测网格", 1),
						c("p", Lo, "更新时间 " + S(Ve.value), 1),
						j.value.length > 1 ? (_(), s("p", Ro, "当前站点：" + S(F.value.site_id), 1)) : o("", !0)
					]), c("div", zo, [d(w(k), { onClick: n[2] ||= (e) => fe.value = !0 }, {
						default: T(() => [...n[15] ||= [u("玩法说明", -1)]]),
						_: 1
					}), w(E) ? (_(), a(w(k), {
						key: 0,
						type: "primary",
						loading: U.value,
						disabled: !J.value,
						onClick: et
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
					d(_n, { loading: pe.value }, {
						default: T(() => [
							F.value.layout ? (_(), s("article", Vo, [n[17] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "价格精度"), c("p", { class: "parameter-description" }, "由总后台统一设置，此处只读")], -1), c("div", Ho, [c("label", null, [c("span", null, "价格小数位：" + S(F.value.layout.price_decimals == null ? "未设置（沿用原规则）" : `${F.value.layout.price_decimals} 位`), 1)])])])) : o("", !0),
							c("article", Uo, [n[25] ||= c("header", { class: "parameter-heading" }, [c("h3", null, "赔率配置"), c("p", { class: "parameter-description" }, "格子赔率按目标返奖率与命中概率动态计算")], -1), c("div", Wo, [
								c("label", null, [
									c("span", null, [n[18] ||= u("目标返奖率", -1), d(bn, {
										label: "目标返奖率",
										content: "例如 97%：命中概率为 20% 时，计算赔率为 4.85x。"
									})]),
									d(Dn, {
										"input-component": w(e),
										modelValue: L.value,
										"onUpdate:modelValue": n[3] ||= (e) => L.value = e,
										disabled: !J.value,
										inputmode: "decimal",
										onInput: $e
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
								Oe.value ? (_(), s("label", Go, [n[22] ||= c("span", null, "最低赔率", -1), d(Dn, {
									"input-component": w(e),
									modelValue: I.value.min_multiplier,
									"onUpdate:modelValue": n[4] ||= (e) => I.value.min_multiplier = e,
									disabled: !J.value,
									inputmode: "decimal",
									onInput: $e
								}, {
									append: T(() => [...n[21] ||= [u("x", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								])])) : o("", !0),
								Oe.value ? (_(), s("label", Ko, [n[24] ||= c("span", null, "最高赔率", -1), d(Dn, {
									"input-component": w(e),
									modelValue: I.value.max_multiplier,
									"onUpdate:modelValue": n[5] ||= (e) => I.value.max_multiplier = e,
									disabled: !J.value,
									inputmode: "decimal",
									onInput: $e
								}, {
									append: T(() => [...n[23] ||= [u("x", -1)]]),
									_: 1
								}, 8, [
									"input-component",
									"modelValue",
									"disabled"
								])])) : o("", !0)
							])]),
							c("article", qo, [c("header", Jo, [n[26] ||= c("h3", null, "下注限制", -1), c("p", Yo, S(F.value.symbol) + " 每个格子生成一笔独立订单", 1)]), c("div", Xo, [c("label", null, [c("span", null, [n[27] ||= u("最小下注金额", -1), d(bn, { label: "最小下注金额" })]), d(Dn, {
								"input-component": w(e),
								modelValue: I.value.min_order_amount,
								"onUpdate:modelValue": n[6] ||= (e) => I.value.min_order_amount = e,
								disabled: !J.value,
								inputmode: "decimal",
								onInput: $e
							}, {
								append: T(() => [...n[28] ||= [u("USDT", -1)]]),
								_: 1
							}, 8, [
								"input-component",
								"modelValue",
								"disabled"
							])]), c("label", null, [c("span", null, [n[29] ||= u("最大下注金额", -1), d(bn, { label: "最大下注金额" })]), d(Dn, {
								"input-component": w(e),
								modelValue: I.value.max_order_amount,
								"onUpdate:modelValue": n[7] ||= (e) => I.value.max_order_amount = e,
								disabled: !J.value,
								inputmode: "decimal",
								onInput: $e
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
			d(er, {
				modelValue: fe.value,
				"onUpdate:modelValue": n[8] ||= (e) => fe.value = e
			}, null, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-64be8b68"]]), Qo = {
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
		let l = he().api, { siteDirectorySymbols: f } = l, ee = _e(), p = t, m = ge(), h = i(() => Xi(p.actor)), g = i(() => !M.value || M.value.operator_id === p.actor.operator_id && M.value.agent_id === p.actor.agent_id && M.value.config_site_id === p.actor.config_site_id && M.value.kind === p.actor.kind);
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
		], y = v("UP_DOWN"), b = x([]), C = v(""), oe = v(""), E = v([]), D = v(!1), O = v(!1), A = v(""), j = v(""), M = x(null), N = v(!1), P = v(!1), ce = new ra(), I = !0, L = () => I && Zi(p.actor) && Ei(m.userInfo.id) === p.actor.operator_id && m.userInfo.can_manage_prediction_config === !0 && (m.perms.includes("*") || m.perms.includes("prediction_config:lists")), R = i(() => L() && !N.value && !P.value), z = i(() => b.value.find((e) => e.symbol === C.value && re(e))), B = v("35"), ue = v(0), fe = i(() => E.value.filter((e) => e.owner_enabled && (h.value || e.platform_enabled))), V = i(() => fe.value.find((e) => e.duration_seconds === B.value)), H = i(() => E.value.map((e) => ({
			key: e.duration_seconds,
			label: `${e.observation_seconds}秒`,
			present: e.owner_enabled && (h.value || e.platform_enabled),
			allowed: e.platform_enabled
		})));
		function pe(e, t) {
			if (!R.value || O.value || M.value || D.value) return;
			let n = E.value.find((t) => t.duration_seconds === e);
			!n || n.owner_enabled === t || t && !n.platform_enabled || (n.owner_enabled = t, B.value = t ? e : fe.value[0]?.duration_seconds ?? "");
		}
		function U(e) {
			let t = e.symbol === C.value ? fe.value.map((e) => e.observation_seconds) : e.rules.filter((e) => e.owner_enabled && (h.value || e.platform_enabled)).map((e) => y.value === "UP_DOWN" ? String(BigInt(e.rule.duration_seconds) - 30n) : e.rule.duration_seconds);
			return t.length ? t.map((e) => `${e}秒`).join(" · ") : "暂无房间";
		}
		let W = v(!0), G = () => JSON.stringify([W.value, E.value.map((e) => [
			e.minimum_stake,
			e.maximum_stake,
			e.owner_enabled,
			e.target_payout_rate,
			e.maximum_odds,
			e.fixed_odds
		])]), me = v(""), ve = i(() => G() !== me.value), ye = x(), be = i(() => O.value || ve.value || !!M.value || y.value === "GRID" && !!ye.value?.hasBlockingWork);
		n({ hasBlockingWork: be });
		let xe = v([]), Se = i(() => So(b.value.filter(re), xe.value, (e) => e.platform_enabled && e.enabled).filter((e) => e.symbol.includes(oe.value.trim().toUpperCase())));
		function Ce() {
			try {
				M.value = wa(localStorage), N.value = ["prediction.agent.pending.v1", "prediction.site.pending.v1"].some((e) => localStorage.getItem(e) !== null), P.value = !1;
			} catch {
				P.value = !0;
			}
		}
		function we() {
			ue.value++, E.value = z.value ? ta(z.value, p.actor) : [], W.value = z.value?.enabled ?? !0, fe.value.some((e) => e.duration_seconds === B.value) || (B.value = fe.value[0]?.duration_seconds ?? ""), me.value = G();
		}
		function K(e) {
			be.value || (C.value = e, j.value = "", we());
		}
		function q(e) {
			be.value || (y.value = e, Oe());
		}
		function Te(e) {
			if (p.actor.kind !== "SITE") return l.ownerConfigurations(e);
			if (!l.scopedSiteConfigurations) throw Error("SITE_UNAVAILABLE");
			return l.scopedSiteConfigurations(p.actor.config_site_id, e);
		}
		function Ee(e, t) {
			if (p.actor.kind !== "SITE") return l.ownerConfiguration(e, t);
			if (!l.scopedSiteConfiguration) throw Error("SITE_UNAVAILABLE");
			return l.scopedSiteConfiguration(p.actor.config_site_id, e, t);
		}
		function De(e) {
			if (p.actor.kind !== "SITE") return l.saveOwnerConfiguration(e);
			if (!l.saveScopedSiteConfiguration) throw Error("SITE_UNAVAILABLE");
			return l.saveScopedSiteConfiguration(p.actor.config_site_id, e);
		}
		async function Oe() {
			let e = y.value, t = ce.begin(p.actor, e, "");
			if (b.value = [], C.value = "", we(), A.value = "", D.value = !1, !(!L() || e === "GRID")) {
				D.value = !0;
				try {
					let [n, r] = await Promise.all([Te(e), f()]);
					if (!ce.current(t, p.actor, y.value, "") || !L()) return;
					if (!Array.isArray(n.items) || new Set(n.items.map((e) => e.symbol)).size !== n.items.length) throw Error("INVALID_CATALOG");
					for (let t of n.items) if (ea(t, p.actor), t.game_type !== "GAME_TYPE_" + e) throw Error("WRONG_GAME");
					if (!Array.isArray(r) || !r.every((e) => typeof e == "string")) throw Error("INVALID_SYMBOL_DIRECTORY");
					xe.value = r, b.value = n.items, C.value = Se.value[0]?.symbol ?? "", we();
				} catch {
					ce.current(t, p.actor, y.value, "") && L() && (A.value = "配置加载失败，请重试。");
				} finally {
					ce.current(t, p.actor, y.value, "") && (D.value = !1);
				}
			}
		}
		async function ke() {
			if (Ce(), !R.value || O.value) return;
			let e = y.value, t = C.value;
			try {
				if (!M.value) {
					if (!z.value) return;
					M.value = Ea(localStorage, p.actor, na(z.value, p.actor, E.value, "通过玩法配置页面保存配置", zi(), W.value));
				}
				let n = M.value;
				if (!g.value) return;
				O.value = !0, j.value = "";
				let r = await Ma(localStorage, n, (e) => {
					if (!L() || !g.value) throw Error("IDENTITY_CHANGED");
					return De(e);
				}, async (e) => {
					if (!L()) throw Error("IDENTITY_CHANGED");
					let t = await Ee(e.game_type, e.symbol);
					if (ea(t.configuration, p.actor), t.configuration.symbol !== e.symbol || t.configuration.game_type !== "GAME_TYPE_" + e.game_type) throw Error("WRONG_CONFIGURATION");
					return t.configuration;
				});
				if (!L() || y.value !== e || C.value !== t) return;
				Ce(), r.status === "success" ? (j.value = r.refreshFailed ? "保存已成功，配置刷新失败，请重新打开页面查看；无需再次保存。" : "", r.refreshFailed || le.success("保存成功"), r.latest && r.latest.symbol === C.value && r.latest.game_type === "GAME_TYPE_" + y.value ? (b.value = b.value.map((e) => e.symbol === C.value ? r.latest : e), we()) : (b.value = [], C.value = "", we(), A.value = "保存已确认，请重试读取最新配置。")) : (j.value = r.status === "rejected" ? "保存未通过，请重新读取配置后调整。" : "暂未确认保存结果，请稍后使用原请求确认。", r.status === "rejected" && (A.value = "保存被拒绝，请读取最新配置后修改。"));
			} catch (e) {
				e instanceof Error && e.message === "NO_CHANGES" ? (j.value = "", le.success("保存成功")) : j.value = e instanceof Error && e.message === "SEPARATE_ENABLE" ? "请先关闭币种开关并保存参数，再单独开启币种。" : "无法保存，请检查金额、赔率范围及待确认请求。";
			} finally {
				O.value = !1;
			}
		}
		Ce();
		try {
			p.actor.kind === "SITE" && uo(bo(sessionStorage, p.actor)) && (y.value = "GRID");
		} catch {
			P.value = !0;
		}
		return Oe(), se(() => [
			m.userInfo.id,
			m.token,
			m.userInfo.can_manage_prediction_config,
			m.perms.join("|"),
			p.actor.operator_id,
			p.actor.agent_id,
			p.actor.config_site_id,
			p.actor.kind
		], () => {
			ce.close(), b.value = [], E.value = [], me.value = "[]", C.value = "", j.value = "", Ce();
		}, { flush: "sync" }), ne(() => {
			I = !1, ce.close();
		}), (n, i) => (_(), s("section", Qo, [
			c("nav", $o, [(_(!0), s(r, null, ae(w(ie), (e) => (_(), a(w(k), {
				key: e.key,
				type: y.value === e.key ? "primary" : void 0,
				"aria-pressed": y.value === e.key,
				disabled: be.value,
				onClick: (t) => q(e.key)
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
				ref: ye,
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
					onClick: Oe
				}, {
					default: T(() => [...i[15] ||= [u("读取最新配置（放弃未保存修改）", -1)]]),
					_: 1
				}, 8, ["disabled"])])) : o("", !0),
				c("div", cs, [(_(!0), s(r, null, ae(Se.value, (e) => (_(), s("div", {
					key: e.symbol,
					class: te(["symbol-entry", { selected: e.symbol === C.value }])
				}, [c("button", {
					class: "symbol-option",
					"aria-pressed": e.symbol === C.value,
					disabled: be.value,
					onClick: (t) => K(e.symbol)
				}, [d(w(ee), { symbol: e.symbol }, null, 8, ["symbol"]), c("span", {
					class: "symbol-status",
					title: U(e)
				}, S(U(e)), 9, us)], 8, ls), c("div", ds, [d(w(de), {
					"aria-label": e.symbol === C.value ? "币种开关" : `${e.symbol} 币种开关`,
					modelValue: e.symbol === C.value ? W.value : e.enabled,
					disabled: e.symbol !== C.value || !R.value || O.value || !!M.value || (h.value ? !W.value && !e.can_enable : !e.platform_enabled),
					"onUpdate:modelValue": i[1] ||= (e) => W.value = !!e
				}, null, 8, [
					"aria-label",
					"modelValue",
					"disabled"
				])])], 2))), 128))]),
				!D.value && !A.value && !Se.value.length ? (_(), s("p", fs, "当前没有可用的交易对配置。")) : o("", !0)
			]), c("main", ps, [
				c("header", ms, [c("div", null, [c("h3", null, S(C.value || "请选择交易对") + " · " + S(y.value === "UP_DOWN" ? "涨跌预测" : "自选预测"), 1), c("p", null, S(t.actor.kind === "SITE" ? "当前白标生效" : "当前商户生效"), 1)]), c("div", hs, [ve.value ? (_(), s("span", gs, "有未保存修改")) : o("", !0), z.value || M.value ? (_(), a(w(k), {
					key: 1,
					type: "primary",
					loading: O.value,
					disabled: !R.value || O.value || D.value || !!M.value && !g.value,
					onClick: ke
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
					W.value ? o("", !0) : (_(), s("p", Cs, "交易对已关闭；以下房间设置仍会保留。")),
					c("article", ws, [c("header", Ts, [i[16] ||= c("h4", null, "房间配置", -1), c("p", Es, S(C.value) + " · " + S(t.actor.kind === "SITE" ? "当前白标生效" : "当前商户生效"), 1)]), c("div", Ds, [
						i[17] ||= c("span", { class: "field-label" }, "支持周期", -1),
						d(Rn, {
							description: `${C.value} · ${y.value === "UP_DOWN" ? "涨跌预测" : "自选预测"}`,
							rooms: H.value,
							selected: B.value,
							disabled: !R.value || O.value || !!M.value || D.value,
							context: `${t.actor.operator_id}:${t.actor.agent_id}:${t.actor.config_site_id}:${y.value}:${C.value}:${ue.value}`,
							onSelect: i[2] ||= (e) => B.value = e,
							onChange: pe
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
						c("article", Ns, [c("header", Ps, [c("h4", null, "赔率配置 · " + S(V.value.observation_seconds) + " 秒", 1), c("p", Fs, S(y.value === "UP_DOWN" ? "上涨/下跌赔率按资金池动态计算" : "下单时锁定当前周期固定赔率，上涨和下跌使用相同赔率。"), 1)]), y.value === "UP_DOWN" ? (_(), s("div", Is, [d(w(F), { label: `目标返奖率（平台上限 ${w(Cn)(V.value.platform_target_payout_rate, 2)}%，且必须小于 100%）` }, {
							default: T(() => [d(Dn, {
								"input-component": w(e),
								modelValue: V.value.target_payout_rate,
								"onUpdate:modelValue": i[3] ||= (e) => V.value.target_payout_rate = e,
								percentage: "",
								unit: "%",
								max: w(Cn)(V.value.platform_target_payout_rate, 2),
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
							default: T(() => [d(Dn, {
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
							default: T(() => [d(Dn, {
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
							default: T(() => [d(Dn, {
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
}), [["__scopeId", "data-v-4c577cf8"]]), Us = class {
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
	]), Q(Z(e.site_id, 128) && ["UP_DOWN", "HIGH_LOW"].includes(String(e.game_type)) && Z(e.symbol, 64, !0) && Z(e.client_request_id, 128) && Z(e.reason, 500), "PENDING_CORRUPT"), Q(X(e.based_on_public_version, !0) && X(e.based_on_site_version, !0) && typeof e.enabled == "boolean" && Array.isArray(e.overrides), "PENDING_CORRUPT");
	let t = e.game_type === "UP_DOWN";
	Q((t ? e.overrides.length === 5 : e.overrides.length > 0 && e.overrides.length <= 100) && new Set(e.overrides.map((e) => e.duration_seconds)).size === e.overrides.length, "PENDING_CORRUPT");
	for (let n of e.overrides) {
		if (Q(Li(n)), !t) {
			Js(n, ["duration_seconds"], [
				"enabled",
				"fixed_odds",
				"minimum_stake",
				"maximum_stake"
			]), Q(X(n.duration_seconds, !0) && (!Object.hasOwn(n, "enabled") || typeof n.enabled == "boolean"), "PENDING_CORRUPT"), Gi(n);
			continue;
		}
		Js(n, ["duration_seconds", "stake_tiers"], ["enabled"]), Q(Ii.includes(String(n.duration_seconds)) && (!Object.hasOwn(n, "enabled") || typeof n.enabled == "boolean") && Array.isArray(n.stake_tiers) && n.stake_tiers.length === 1, "PENDING_CORRUPT");
		let e = n.stake_tiers[0];
		Q(Li(e)), Js(e, ["stake_tier_id"], ["enabled", "maximum_stake"]), Q(Z(e.stake_tier_id) && (!Object.hasOwn(e, "enabled") || typeof e.enabled == "boolean"), "PENDING_CORRUPT"), Q(!Object.hasOwn(e, "maximum_stake") || Di(e.maximum_stake) && Oi(e.maximum_stake, "1") >= 0, "PENDING_CORRUPT");
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
		].every((e) => typeof i[e] == "string")), Q(Z(i.operation_id, 256) && Z(i.trace_id, 256) && Z(i.target_id, 256) && X(i.created_at_ms) && X(i.completed_at_ms)), Q(i.operator_id === t.operator_id && i.client_request_id === n.client_request_id && i.reason === n.reason && i.source_service === "agent_admin"), Q(i.result === "OPERATION_RESULT_SUCCEEDED" && i.error_code === "" && i.action === "ADMIN_ACTION_SITE_CONFIG_PUBLISH" && i.capability === "prediction.site.config.publish" && i.target_type === "site_config"), !0;
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
		let { siteDirectorySymbols: t, configurations: n, siteConfigurationTargets: l, siteConfiguration: f, saveSiteConfiguration: ee, saveConfiguration: p, configuration: m } = he().api, h = _e(), { t: g, te: re, locale: ie } = ye(), y = ge(), b = new Us(), C = new Us(), oe = new Us(), E = new Us(), D = new Ji(), A = v("UP_DOWN"), M = x(), N = i(() => A.value === "HIGH_LOW" ? "HIGH_LOW" : "UP_DOWN"), P = i(() => ie.value === "en-US" ? pe : U), ce = (e) => y.perms.includes("*") || y.perms.includes(e), F = i(() => ce("prediction_config:lists")), I = F, R = i(() => Ei(y.userInfo.id)), B = v(null), fe = v([]), V = v(""), H = v(""), W = v(""), G = i(() => fe.value.find((e) => e.site_id === V.value)?.games.find((e) => e.game_type === N.value)?.symbols ?? []), me = v([]), ve = v([]), be = v(""), xe = i(() => Ks(G.value, ve.value, me.value, Object.keys(Ce.value).filter((e) => lt(e) && (ct(e) ?? 0) > 0))), Se = i(() => xe.value.map((e) => e.symbol).filter((e) => e.toLowerCase().includes(W.value.toLowerCase()))), Ce = v({}), we = v({}), K = v(null), q = v([]), Te = v(!1), Ee = v("35"), De = v("通过商户玩法配置页面保存配置"), Oe = v(""), ke = v(!1), Ae = v(!1), je = v(""), Me = v(!1), Ne = v(!1), Pe = v(""), Fe = v(""), Ie = v(!1), Le = v(!1), J = x(null), Re = x(null), ze = x(null), Be, Ve, He = 0, Ue = i(() => ie.value === "en-US" ? "Enabled" : "启用交易对"), We = i(() => J.value && B.value && J.value.operator_id === B.value.operator_id && J.value.agent_id === B.value.agent_id && J.value.body.site_id === V.value && J.value.body.game_type === N.value && J.value.body.symbol === H.value ? J.value : null), Ge = v(null), Ke = i(() => Re.value && Ge.value && Re.value.operator_id === R.value && Re.value.operator_id === Ge.value.operator_id && Re.value.agent_id === Ge.value.agent_id), qe = i(() => F.value && I.value && B.value?.operator_id === R.value && !!K.value && (N.value === "UP_DOWN" ? q.value.length === 5 : q.value.length > 0) && !Pe.value && !J.value && !Re.value && !Le.value && !Ne.value && !Me.value), Je = i(() => q.value.find((e) => e.duration_seconds === Ee.value)), Ye = i(() => K.value?.effective.rules.find((e) => e.duration_seconds === Ee.value)), Xe = () => JSON.stringify({
			enabled: Te.value,
			rows: q.value.map((e) => ({
				duration: e.duration_seconds,
				enabled: e.enabled,
				maximum: e.maximum_stake,
				minimum: e.minimum_stake,
				odds: e.fixed_odds
			})),
			reason: De.value
		}), Ze = i(() => !!K.value && !!Oe.value && Xe() !== Oe.value);
		function Qe() {
			return B.value ? {
				...B.value,
				site_id: V.value,
				game_type: N.value,
				symbol: H.value,
				public_version: K.value?.effective.public_version ?? "",
				site_version: K.value?.stored.version ?? ""
			} : null;
		}
		function $e() {
			Le.value = !1;
			try {
				J.value = Xs(sessionStorage);
			} catch {
				Le.value = !0;
			}
			try {
				Re.value = pa(sessionStorage);
			} catch {
				Le.value = !0;
			}
		}
		function et() {
			D.close(), Fe.value = "", ze.value = null, Be?.abort(), Ne.value = !1;
		}
		function tt() {
			et(), E.close(), K.value = null, q.value = [], Oe.value = "", De.value = "通过商户玩法配置页面保存配置", Pe.value = "", Ie.value = !1, Me.value = !1, $e();
		}
		function nt(e) {
			Wi(e, V.value, H.value, N.value), K.value = e, q.value = Ki(e), Te.value = e.stored.enabled, Ce.value[H.value] = e, we.value[H.value] = "configured", De.value = "通过商户玩法配置页面保存配置", Oe.value = Xe(), $e();
		}
		function rt(e) {
			let t = e?.error_code;
			return t === "NOT_FOUND" ? "该交易对尚未配置，请联系管理员完成初始配置。" : t === "UNAVAILABLE" ? "站点配置暂不可用，请稍后刷新。" : t === "PERMISSION_DENIED" ? "当前账号无权访问该站点配置。" : g("predictionPages.loadFailed");
		}
		async function it() {
			tt(), oe.close(), Ve = void 0, Ae.value = !1;
			let e = C.next(), t = R.value, n = y.token;
			if (B.value = null, Ge.value = null, b.close(), at(), fe.value = [], me.value = [], ve.value = [], be.value = "", V.value = "", H.value = "", Ce.value = {}, we.value = {}, je.value = "", ke.value = !1, !(!F.value || !t)) {
				ke.value = !0;
				try {
					let r = await l(e.signal);
					if (!e.current() || R.value !== t || y.token !== n) return;
					if (Vi(r), r.actor.operator_id !== t) throw Error("IDENTITY_UNCONFIRMED");
					B.value = r.actor, fe.value = r.sites, J.value?.operator_id === t && J.value.agent_id === r.actor.agent_id && (A.value = J.value.body.game_type);
					let i = J.value?.operator_id === t ? r.sites.find((e) => e.site_id === J.value?.body.site_id)?.site_id : void 0;
					(i || r.sites.length === 1) && (V.value = i ?? r.sites[0].site_id);
				} catch (t) {
					e.current() && (je.value = rt(t));
				} finally {
					e.current() && (ke.value = !1);
				}
			}
		}
		async function at() {
			let e = b.next(), t = Re.value, n = R.value, r = y.token;
			if (!(!t || t.operator_id !== n || !F.value)) try {
				let i = await m(t.body.symbol, e.signal);
				if (!e.current() || R.value !== n || y.token !== r) return;
				la(i.configuration) === t.body.symbol && i.configuration.agent_id === t.agent_id && (Ge.value = {
					operator_id: t.operator_id,
					agent_id: t.agent_id
				});
			} catch {}
		}
		async function ot() {
			tt();
			let e = oe.next(), r = V.value, i = JSON.stringify(B.value), a = y.token, o = N.value, s = [...G.value];
			if (Ve = void 0, Ce.value = {}, we.value = {}, me.value = [], ve.value = [], be.value = "", Ae.value = !1, A.value === "GRID" || !B.value || !r || !F.value) return;
			let c = () => e.current() && A.value !== "GRID" && F.value && y.token === a && V.value === r && N.value === o && i === JSON.stringify(B.value), l = /* @__PURE__ */ new Map(), u = {
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
			Ve = u;
			for (let e of s) we.value[e] = "loading";
			let d = J.value?.body.game_type === o && J.value.body.site_id === r ? J.value.body.symbol : H.value, ee = s.includes(d) ? d : s[0] ?? "", p = J.value?.body.game_type === o && J.value.body.site_id === r && s.includes(J.value.body.symbol);
			H.value = p ? ee : "", p && st(!0), Ae.value = !0;
			let m = Promise.allSettled([t(e.signal).then((e) => {
				Ks([], [], e), c() && (me.value = e);
			}), n(e.signal, o).then((e) => {
				let t = Gs(e, o);
				if (c() && (ve.value = t, !p)) {
					let e = s.filter((e) => t.includes(e)), n = e.includes(ee) ? ee : e[0] ?? "";
					H.value === n ? st(!0) : H.value = n;
				}
			})]).then((e) => {
				c() && e.some((e) => e.status === "rejected") && (be.value = "平台币种目录未完整加载，请重试。");
			}), h = s.filter((e) => e !== ee);
			await Promise.all([m, ...Array.from({ length: Math.min(3, h.length) }, async () => {
				for (; c() && h.length;) {
					let e = h.shift();
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
		async function st(e = !1) {
			tt();
			let t = E.next(), n = {
				site_id: V.value,
				game_type: N.value,
				symbol: H.value
			}, r = JSON.stringify(B.value), i = Ve;
			if (Ee.value = "35", A.value === "GRID" || !F.value || !B.value || !n.site_id || !G.value.includes(n.symbol)) return;
			Me.value = !0, e || i?.requests.delete(n.symbol);
			let a = e && i?.current() ? i.read(n.symbol) : f(n, t.signal);
			try {
				let e = await a;
				if (i?.current() && i.requests.get(n.symbol) === a && (Ce.value[n.symbol] = e, we.value[n.symbol] = "configured"), !t.current() || r !== JSON.stringify(B.value) || n.site_id !== V.value || n.game_type !== N.value || n.symbol !== H.value) return;
				nt(e), Ee.value = q.value[0]?.duration_seconds ?? "";
			} catch (e) {
				if (i?.current() && i.requests.get(n.symbol) === a && (we.value[n.symbol] = e?.error_code === "NOT_FOUND" ? "unconfigured" : "unavailable", i.requests.delete(n.symbol)), !t.current()) return;
				Ie.value = e?.error_code === "NOT_FOUND", we.value[n.symbol] = Ie.value ? "unconfigured" : "unavailable", Pe.value = rt(e);
			} finally {
				t.current() && i?.requests.get(n.symbol) === a && i.requests.delete(n.symbol), t.current() && (Me.value = !1);
			}
		}
		function ct(e) {
			let t = e === H.value ? K.value : Ce.value[e];
			return t ? e === H.value && (N.value === "UP_DOWN" ? q.value.length === 5 : q.value.length > 0) ? Te.value ? q.value.filter((e) => e.enabled).length : 0 : t.effective.rules.filter((e) => e.enabled && (N.value === "HIGH_LOW" || e.stake_tiers.some((e) => !e.retired && e.enabled))).length : null;
		}
		function lt(e) {
			return e === H.value && K.value ? Te.value : Ce.value[e]?.stored.enabled ?? !1;
		}
		function ut(e) {
			return !qe.value || we.value[e] !== "configured" || e !== H.value && Ze.value;
		}
		function dt(e) {
			if (G.value.includes(e)) {
				if (e !== H.value && (Ze.value || Ne.value || J.value)) {
					le.warning("请先处理当前未保存修改或待确认操作");
					return;
				}
				H.value = e;
			}
		}
		async function ft(e, t) {
			if (typeof t != "boolean" || ut(e)) return;
			let n = JSON.stringify(B.value), r = V.value;
			e !== H.value && (H.value = e);
			let i = He;
			if (Me.value) {
				let t = Ve?.requests.get(e);
				if (t) try {
					await t;
				} catch {
					return;
				}
			}
			i !== He || n !== JSON.stringify(B.value) || r !== V.value || H.value !== e || !qe.value || (et(), Te.value = t);
		}
		function pt() {
			B.value && V.value && H.value ? st() : it();
		}
		async function mt(e) {
			if (A.value !== e && !(A.value === "GRID" && M.value && !await M.value.confirmLeave())) {
				if (A.value !== "GRID" && (Ze.value || J.value || Re.value)) {
					le.warning("请先处理当前未保存修改或待确认操作");
					return;
				}
				A.value = e, W.value = "", tt(), H.value = "", ot();
			}
		}
		async function ht() {
			let e = Qe();
			if (!qe.value || !K.value || !B.value || !e) return;
			let t;
			try {
				t = qi(K.value, q.value, Te.value, De.value, zi());
			} catch {
				Fe.value = g("predictionPages.invalidSave");
				return;
			}
			if (!D.next(e).current(Qe()) || !F.value || !I.value) return;
			let n;
			try {
				n = Qs(sessionStorage, B.value, t), $e();
			} catch {
				Le.value = !0;
				return;
			}
			await _t(n);
		}
		function gt() {
			$e(), We.value && F.value && I.value && !Ne.value && !Le.value && _t(We.value);
		}
		async function _t(e) {
			let t = Qe();
			if (!t) return;
			let n = D.next(t), r = new AbortController();
			Be = r;
			let i = () => n.current(Qe()) && F.value && I.value;
			Ne.value = !0, Fe.value = "", ze.value = null;
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
				$e(), t.status === "success" ? (ze.value = t.value.receipt, t.latest ? (nt(t.latest), Pe.value = "", Fe.value = "", le.success("保存成功")) : (K.value = null, q.value = [], Oe.value = "", Pe.value = "已保存，刷新失败。请刷新查看当前配置。", Fe.value = "已保存，刷新失败")) : t.status !== "superseded" && (Fe.value = g("predictionPages." + (t.status === "unknown" ? "pending" : "rejected")) + " · " + Ti(t.error?.error_code));
			} catch {
				i() && ($e(), Fe.value = g("predictionPages.pending"));
			} finally {
				Be === r && (Ne.value = !1);
			}
		}
		async function vt() {
			if ($e(), !Re.value || !Ke.value || !F.value || !I.value || Ne.value || Le.value) return;
			let e = Re.value, t = y.token, n = He, r = new AbortController(), i = () => n === He && t === y.token && Ke.value && F.value && I.value;
			Be = r, Ne.value = !0;
			try {
				let t = await ya(sessionStorage, e, (e) => p(e, r.signal));
				if (!i()) return;
				$e(), Fe.value = t.status === "success" ? "旧版原请求已确认成功。站点设置请单独查看。" : g("predictionPages.pending");
			} catch {
				i() && ($e(), Fe.value = g("predictionPages.pending"));
			} finally {
				Be === r && (Ne.value = !1);
			}
		}
		function yt(e) {
			let t = N.value === "UP_DOWN" ? BigInt(e.observation_seconds) : BigInt(e.duration_seconds);
			return N.value === "HIGH_LOW" && t >= 60n && t % 60n == 0n ? `${t / 60n}分钟` : `${t}秒`;
		}
		function bt(e) {
			let t = e === H.value ? K.value : Ce.value[e];
			return t ? Ki(t).map(yt).join(" · ") : "";
		}
		function xt(e) {
			return typeof e == "string" || typeof e == "boolean" ? Ti(e) : g("predictionPages.notProvided");
		}
		function St(e, t) {
			let n = xt(t);
			if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return n;
			if (e !== "target_payout_rate") return n + "x";
			let [r, i = ""] = n.split("."), a = r + i, o = r.length + 2;
			return (o >= a.length ? a + "0".repeat(o - a.length) : a.slice(0, o) + "." + a.slice(o)).replace(/^0+(?=\d)/, "") + "%";
		}
		let Ct = (e) => re("predictionPages.fields." + e) ? g("predictionPages.fields." + e) : e;
		return se(V, () => {
			He++, H.value = "", ot();
		}, { flush: "sync" }), se(H, () => {
			He++, st(!0);
		}, { flush: "sync" }), se(() => [
			y.userInfo.id,
			y.token,
			F.value,
			I.value
		], () => {
			He++, et(), C.close(), oe.close(), E.close(), b.close(), it();
		}, {
			immediate: !0,
			flush: "sync"
		}), ne(() => {
			He++, et(), C.close(), oe.close(), E.close(), b.close();
		}), (e, t) => (_(), a(w(j), { locale: P.value }, {
			default: T(() => [c("section", ic, [c("nav", ac, [
				d(w(k), {
					type: A.value === "UP_DOWN" ? "primary" : void 0,
					"aria-pressed": A.value === "UP_DOWN",
					onClick: t[0] ||= (e) => mt("UP_DOWN")
				}, {
					default: T(() => [...t[8] ||= [u("涨跌预测", -1), c("small", null, "按系统场次预测结算价格相对开盘价格上涨或下跌", -1)]]),
					_: 1
				}, 8, ["type", "aria-pressed"]),
				d(w(k), {
					type: A.value === "HIGH_LOW" ? "primary" : void 0,
					"aria-pressed": A.value === "HIGH_LOW",
					onClick: t[1] ||= (e) => mt("HIGH_LOW")
				}, {
					default: T(() => [...t[9] ||= [u("自选预测", -1), c("small", null, "用户自主选择方向和预测周期，生成独立预测订单", -1)]]),
					_: 1
				}, 8, ["type", "aria-pressed"]),
				d(w(k), {
					type: A.value === "GRID" ? "primary" : void 0,
					"aria-pressed": A.value === "GRID",
					onClick: t[2] ||= (e) => mt("GRID")
				}, {
					default: T(() => [...t[10] ||= [u("预测网格", -1), c("small", null, "按时间格与价格区间展示网格预测规则", -1)]]),
					_: 1
				}, 8, ["type", "aria-pressed"])
			]), A.value === "GRID" ? (_(), a(Zo, {
				key: 1,
				ref_key: "gridRef",
				ref: M
			}, null, 512)) : (_(), s(r, { key: 0 }, [fe.value.length > 1 ? (_(), a(w(ue), {
				key: 0,
				modelValue: V.value,
				"onUpdate:modelValue": t[3] ||= (e) => V.value = e,
				placeholder: "请选择配置站点",
				"aria-label": "配置站点",
				disabled: Ne.value || Ze.value || !!J.value || !!Re.value
			}, {
				default: T(() => [(_(!0), s(r, null, ae(fe.value, (e, t) => (_(), a(w(z), {
					key: e.site_id,
					label: `站点配置 ${t + 1}`,
					value: e.site_id
				}, null, 8, ["label", "value"]))), 128))]),
				_: 1
			}, 8, ["modelValue", "disabled"])) : o("", !0), F.value ? (_(), s("div", sc, [c("aside", {
				class: "symbol-directory",
				"aria-label": w(g)("predictionPages.symbolDirectory")
			}, [
				c("h3", null, [t[11] ||= u("交易对配置 ", -1), c("small", null, S(xe.value.length) + " 条", 1)]),
				d(w(L), {
					modelValue: W.value,
					"onUpdate:modelValue": t[4] ||= (e) => W.value = e,
					clearable: "",
					"aria-label": w(g)("predictionPages.searchSymbol"),
					placeholder: w(g)("predictionPages.searchSymbol")
				}, null, 8, [
					"modelValue",
					"aria-label",
					"placeholder"
				]),
				be.value ? (_(), s("p", lc, [u(S(be.value), 1), d(w(k), {
					size: "small",
					disabled: Ze.value || Ne.value || !!J.value || Ae.value,
					onClick: ot
				}, {
					default: T(() => [...t[12] ||= [u("重试币种目录", -1)]]),
					_: 1
				}, 8, ["disabled"])])) : o("", !0),
				ke.value || Ae.value ? (_(), s("p", uc, S(w(g)("predictionPages.loading")), 1)) : o("", !0),
				je.value ? (_(), s("div", dc, [c("p", null, S(je.value), 1), d(w(k), {
					"data-action": "retry-catalog",
					size: "small",
					disabled: ke.value,
					onClick: it
				}, {
					default: T(() => [u(S(w(g)("predictionPages.retry")), 1)]),
					_: 1
				}, 8, ["disabled"])])) : o("", !0),
				!ke.value && !je.value && !Se.value.length ? (_(), s("p", fc, S(fe.value.length ? V.value ? G.value.length ? "没有匹配的交易对。" : "当前站点尚未开放此玩法的交易对配置。" : "请选择配置站点。" : "当前账号暂无预测配置站点授权，请联系管理员配置后刷新。"), 1)) : o("", !0),
				c("div", pc, [(_(!0), s(r, null, ae(Se.value, (e) => (_(), s("div", {
					key: e,
					class: te(["symbol-entry", { selected: e === H.value }])
				}, [c("button", {
					type: "button",
					class: "symbol-option",
					"data-symbol": e,
					"aria-pressed": e === H.value,
					disabled: !G.value.includes(e),
					onClick: (t) => dt(e)
				}, [
					d(w(h), { symbol: e }, null, 8, ["symbol"]),
					G.value.includes(e) ? we.value[e] === "loading" ? (_(), s("span", gc, S(w(g)("predictionPages.loading")), 1)) : we.value[e] === "unconfigured" ? (_(), s("span", _c, S(w(g)("predictionPages.unconfigured")), 1)) : ct(e) === null ? (_(), s("span", vc, S(w(g)("predictionPages.unavailableConfig")), 1)) : (_(), s("span", yc, S(bt(e)), 1)) : (_(), s("span", hc, S(ve.value.includes(e) ? "未开放配置" : "未配置"), 1)),
					e === H.value && Ze.value ? (_(), s("span", bc, S(w(g)("predictionPages.unsaved")), 1)) : o("", !0)
				], 8, mc), we.value[e] === "configured" ? (_(), s("div", xc, [d(w(de), {
					"inline-prompt": "",
					"active-text": "开放",
					"inactive-text": "停用",
					"data-symbol-enabled": e,
					"aria-label": `${e} ${Ue.value}`,
					"model-value": lt(e),
					disabled: ut(e),
					onChange: (t) => ft(e, t)
				}, null, 8, [
					"data-symbol-enabled",
					"aria-label",
					"model-value",
					"disabled",
					"onChange"
				])])) : o("", !0)], 2))), 128))])
			], 8, cc), c("main", Sc, [
				c("header", Cc, [c("div", null, [c("h3", null, S(H.value || w(g)("predictionPages.selectSymbol")) + " · " + S(w(g)("predictionPages.games." + N.value)), 1), t[13] ||= c("p", null, "当前商户生效", -1)]), c("div", wc, [Ze.value ? (_(), s("span", Tc, S(w(g)("predictionPages.unsaved")), 1)) : o("", !0), w(I) ? (_(), a(w(k), {
					key: 1,
					"data-action": "save",
					type: "primary",
					loading: Ne.value,
					disabled: !qe.value,
					onClick: ht
				}, {
					default: T(() => [...t[14] ||= [u("保存配置", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])) : o("", !0)])]),
				Me.value ? (_(), s("p", Ec, S(w(g)("predictionPages.loading")), 1)) : o("", !0),
				Pe.value ? (_(), s("p", Dc, [u(S(Pe.value), 1), F.value ? (_(), a(w(k), {
					key: 0,
					disabled: Me.value || ke.value || Ne.value || Ze.value || !!J.value || !!Re.value,
					onClick: pt
				}, {
					default: T(() => [...t[15] ||= [u("重试", -1)]]),
					_: 1
				}, 8, ["disabled"])) : o("", !0)])) : o("", !0),
				R.value ? o("", !0) : (_(), s("p", Oc, S(w(g)("predictionPages.identityError")), 1)),
				Ie.value ? (_(), s("p", kc, "该交易对尚未配置，请联系管理员完成初始配置后刷新。")) : o("", !0),
				Re.value ? (_(), a(w(O), {
					key: 4,
					type: "warning",
					closable: !1,
					title: "存在旧版代理配置待确认请求"
				}, {
					default: T(() => [
						t[17] ||= c("p", null, "旧请求按原协议恢复，不会转换为站点保存。", -1),
						c("p", null, S(Re.value.body.symbol) + " · " + S(Re.value.body.client_request_id), 1),
						Ke.value ? (_(), a(w(k), {
							key: 0,
							disabled: Ne.value || !w(I) || Le.value,
							onClick: vt
						}, {
							default: T(() => [...t[16] ||= [u("确认旧版原请求", -1)]]),
							_: 1
						}, 8, ["disabled"])) : (_(), s("p", Ac, "请使用原操作账号恢复该请求。"))
					]),
					_: 1
				})) : o("", !0),
				Le.value ? (_(), a(w(O), {
					key: 5,
					type: "error",
					closable: !1,
					title: w(g)("predictionPages.storageError")
				}, null, 8, ["title"])) : J.value ? (_(), a(w(O), {
					key: 6,
					type: "warning",
					closable: !1,
					title: w(g)("predictionPages.pending")
				}, {
					default: T(() => [We.value ? (_(), s(r, { key: 0 }, [
						c("p", null, [u(S(w(g)("predictionPages.fields.client_request_id")) + ": ", 1), c("code", null, S(We.value.body.client_request_id), 1)]),
						c("p", null, S(We.value.body.symbol) + " · 站点 " + S(We.value.body.site_id) + " · 公共版本 " + S(We.value.body.based_on_public_version) + " / 站点版本 " + S(We.value.body.based_on_site_version), 1),
						c("ul", null, [(_(!0), s(r, null, ae(We.value.body.overrides, (e) => (_(), s("li", { key: e.duration_seconds }, [
							u(S(e.duration_seconds) + "s · " + S(e.enabled === void 0 ? "继承原设置" : e.enabled ? w(g)("predictionPages.on") : w(g)("predictionPages.off")) + " · " + S(e.maximum_stake ?? e.stake_tiers?.[0]?.maximum_stake ?? "继承平台设置"), 1),
							e.fixed_odds === void 0 ? o("", !0) : (_(), s("span", jc, " · 固定赔率 " + S(e.fixed_odds) + "x", 1)),
							e.minimum_stake === void 0 ? o("", !0) : (_(), s("span", Mc, " · 最小下注金额 " + S(e.minimum_stake) + " USDT", 1))
						]))), 128))]),
						w(I) ? (_(), a(w(k), {
							key: 0,
							disabled: Ne.value,
							"data-action": "replay",
							onClick: gt
						}, {
							default: T(() => [u(S(w(g)("predictionPages.confirmOriginal")), 1)]),
							_: 1
						}, 8, ["disabled"])) : o("", !0)
					], 64)) : (_(), s("p", Nc, S(w(g)("predictionPages.otherPending")), 1))]),
					_: 1
				}, 8, ["title"])) : o("", !0),
				Fe.value ? (_(), s("p", Pc, S(Fe.value), 1)) : o("", !0),
				K.value ? (_(), s(r, { key: 8 }, [
					Te.value ? o("", !0) : (_(), s("p", Fc, "交易对已关闭；以下房间设置仍会保留。")),
					K.value.adjustments.length ? (_(), s("p", Ic, "部分保存值受当前公共配置调整，编辑框保留原设置；实际生效金额见下方。")) : o("", !0),
					w(I) ? o("", !0) : (_(), s("p", Lc, S(w(g)("predictionPages.readOnlyConfig")), 1)),
					c("nav", {
						class: "room-tabs",
						"aria-label": N.value === "UP_DOWN" ? w(g)("predictionPages.observationRoom") : "支持周期"
					}, [(_(!0), s(r, null, ae(q.value, (e) => (_(), s("button", {
						key: e.duration_seconds,
						type: "button",
						"data-room": e.duration_seconds,
						"aria-pressed": Ee.value === e.duration_seconds,
						class: te({ active: Ee.value === e.duration_seconds }),
						onClick: (t) => Ee.value = e.duration_seconds
					}, S(yt(e)), 11, zc))), 128))], 8, Rc),
					Je.value && Ye.value ? (_(), s(r, { key: 3 }, [
						c("div", Bc, [c("div", null, [c("h3", null, S(yt(Je.value)) + " · " + S(N.value === "UP_DOWN" ? w(g)("predictionPages.observationRoom") : "支持周期"), 1)]), c("label", Vc, [u(S(w(g)("predictionPages.roomEnabled")), 1), d(w(de), {
							modelValue: Je.value.enabled,
							"onUpdate:modelValue": t[5] ||= (e) => Je.value.enabled = e,
							"data-field": "enabled",
							"aria-label": w(g)("predictionPages.roomEnabled"),
							disabled: !qe.value,
							onChange: et
						}, null, 8, [
							"modelValue",
							"aria-label",
							"disabled"
						])])]),
						Je.value.inherited_enabled ? (_(), s("p", Hc, "房间开关包含继承设置；未修改时保留继承状态。")) : o("", !0),
						c("div", Uc, [
							N.value === "UP_DOWN" ? (_(), s("article", Wc, [
								c("h4", null, S(w(g)("predictionPages.oddsSettings")), 1),
								t[18] ||= c("p", { class: "field-description" }, "上涨赔率 = 1 + 目标返奖率 × 下跌池 ÷（上涨池＋本次下注）；下跌赔率反向计算。下注期间为预计倍率，封盘后锁定最终倍率。", -1),
								c("dl", Gc, [(_(), s(r, null, ae(["target_payout_rate", "maximum_odds"], (e) => c("div", { key: e }, [c("dt", null, [u(S(Ct(e)), 1), d(bn, { label: Ct(e) }, null, 8, ["label"])]), c("dd", null, S(St(e, Ye.value[e])), 1)])), 64))]),
								c("span", Kc, S(w(g)("predictionPages.readOnly")), 1)
							])) : o("", !0),
							N.value === "HIGH_LOW" ? (_(), s("article", qc, [
								c("h4", null, "赔率配置 · " + S(yt(Je.value)), 1),
								t[20] ||= c("p", { class: "field-description" }, "用户下单时按当前周期固定赔率锁定，订单存储赔率快照；上涨和下跌使用相同赔率。", -1),
								c("dl", Jc, [c("div", null, [c("dt", null, [t[19] ||= u("当前生效固定赔率", -1), d(bn, { label: "固定赔率" })]), c("dd", Yc, S(St("fixed_odds", Ye.value.fixed_odds)), 1)])]),
								c("span", Xc, S(w(g)("predictionPages.readOnly")), 1)
							])) : o("", !0),
							c("article", Zc, [
								c("h4", null, S(w(g)("predictionPages.stakeLimits")) + " · " + S(yt(Je.value)), 1),
								t[22] ||= c("p", { class: "field-description" }, "不同周期独立保存下注限制，变更不影响已受理订单。", -1),
								c("div", Qc, [N.value === "UP_DOWN" ? (_(), s("dl", $c, [c("dt", null, [u(S(w(g)("predictionPages.fields.minimum_stake")), 1), d(bn, {
									label: "单笔最小额",
									content: "用户创建一笔预测订单时允许输入的最低下注金额。本版涨跌预测固定为 1 USDT，由平台统一维护。"
								})]), c("dd", null, S(xt(Ye.value.stake_tiers?.find((e) => e.stake_tier_id === Je.value?.stake_tier_id)?.minimum_stake)), 1)])) : (_(), s("div", el, [c("label", null, [u(S(w(g)("predictionPages.fields.minimum_stake")), 1), d(bn, { label: "单笔最小额" })]), d(w(L), {
									modelValue: Je.value.minimum_stake,
									"onUpdate:modelValue": t[6] ||= (e) => Je.value.minimum_stake = e,
									"data-field": "minimum_stake",
									"aria-label": w(g)("predictionPages.fields.minimum_stake"),
									disabled: !qe.value,
									onInput: et
								}, {
									append: T(() => [...t[21] ||= [u("USDT", -1)]]),
									_: 1
								}, 8, [
									"modelValue",
									"aria-label",
									"disabled"
								])])), c("div", null, [
									c("label", null, [u(S(w(g)("predictionPages.fields.maximum_stake")), 1), d(bn, { label: "单笔最大额" })]),
									d(w(L), {
										modelValue: Je.value.maximum_stake,
										"onUpdate:modelValue": t[7] ||= (e) => Je.value.maximum_stake = e,
										"data-field": "maximum_stake",
										"aria-label": w(g)("predictionPages.fields.maximum_stake"),
										disabled: !qe.value || !Je.value.editable,
										onInput: et
									}, null, 8, [
										"modelValue",
										"aria-label",
										"disabled"
									]),
									c("small", null, "当前生效：" + S(Je.value.effective_maximum) + "；可填写更高限额，最终由平台范围校验。", 1)
								])])
							])
						])
					], 64)) : o("", !0)
				], 64)) : o("", !0)
			])])) : (_(), s("p", oc, S(w(g)("predictionPages.noPermission")), 1))], 64))])]),
			_: 1
		}, 8, ["locale"]));
	}
}), [["__scopeId", "data-v-f9f9515e"]]), nl = {
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
		let t = he().api, n = ge(), r = x(null), o = v(!1), c = v(""), l = i(() => n.userInfo.can_manage_prediction_config === !0 && (n.perms.includes("*") || n.perms.includes("prediction_config:lists")) && Ei(n.userInfo.id) !== null), f = i(() => `${n.userInfo.id}:${n.token}`), ee = 0, p;
		async function m() {
			let e = ++ee, i = f.value;
			if (p?.abort(), r.value = null, c.value = "", o.value = !1, !l.value) return;
			p = new AbortController(), o.value = !0;
			let a = () => e === ee && i === f.value && l.value;
			try {
				let e = await t.ownerConfigurationModel(p.signal);
				if (!a()) return;
				if (e.actor?.operator_id !== Ei(n.userInfo.id) || ![
					"AGENT_V1",
					"SITE_V1",
					"OWNER_V1",
					"SCOPED_OWNER_V1"
				].includes(e.config_model)) throw Error("INVALID_MODEL");
				if (e.config_model === "SCOPED_OWNER_V1" && e.actor.kind === "SITE") {
					let n = e.actor;
					if (n.agent_id !== "0" || !X(n.tenant_id, !0) || !Array.isArray(n.site_ids) || n.site_ids.length !== 1 || !X(n.site_ids[0], !0)) throw Error("INVALID_SITES");
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
		ie(W, {
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
		return (t, i) => (_(), s("section", sl, [r.value ? (_(), a(b(e.adapter.role === "platform" ? Ci : ol), { key: n.value })) : (_(), s("p", cl, "无法确认当前操作人身份"))]));
	}
});
//#endregion
export { ll as MmPredictionGameConfig };

//# sourceMappingURL=prediction-config.js.map