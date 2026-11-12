import { $r as e, A as t, Hi as n, Kn as r, O as i, Qr as a, Wi as o, Zr as s, _i as ee, _r as c, a as l, ai as u, bi as d, bn as f, gi as te, ii as p, kr as ne, pr as re, vi as ie, yn as m } from "./src-CPQZp0Mv.js";
import { a as h, i as g, n as _ } from "./Loading-Djhi-Drb.js";
import { Fragment as ae, computed as v, createBlock as y, createCommentVNode as b, createElementBlock as x, createElementVNode as S, createTextVNode as C, createVNode as w, defineComponent as T, inject as E, mergeProps as D, nextTick as O, normalizeClass as k, onBeforeUnmount as oe, onMounted as se, openBlock as A, provide as j, reactive as ce, ref as M, renderList as le, resolveDynamicComponent as ue, toDisplayString as N, unref as P, vModelSelect as F, vModelText as de, vShow as I, watch as L, withCtx as R, withDirectives as fe, withKeys as pe, withModifiers as me } from "vue";
//#region src/cms/runtime.ts
var z = Symbol("MmCms");
function B() {
	let e = E(z);
	if (!e) throw Error("CMS host adapter is missing");
	return e;
}
function he(e) {
	B().registerBeforeLeave?.(e);
}
//#endregion
//#region src/cms/site-transport.ts
function V(e, t, n) {
	let r = !0, i = n, a = () => {
		if (!r) throw Error("站点已切换，请重新操作");
	};
	function o(e, t) {
		if (a(), t && !i) throw Error("请选择已初始化的站点");
		if (i === null) throw Error("该站点尚未初始化内容空间");
		if (e.data instanceof FormData) {
			let t = new FormData();
			return e.data.forEach((e, n) => t.append(n, e)), i && t.set("space_id", i), {
				...e,
				data: t
			};
		}
		let n = { ...e.params };
		return i ? n.space_id = i : delete n.space_id, {
			...e,
			params: n
		};
	}
	function s(e, n, r) {
		if (a(), n.signal?.aborted) throw new DOMException("Aborted", "AbortError");
		let o = e?.cms_context;
		if (!o) {
			if (!r && i === void 0) throw Error("内容接口未返回站点信息，请刷新或更新服务");
			return e;
		}
		if (i !== void 0 && o.space_id !== i) throw Error("站点已切换，请重新操作");
		return i = o.space_id, t(o), e;
	}
	return {
		request: {
			get(t, n) {
				return e.request.get(o(t, !1), n).then((e) => s(e, t, !1));
			},
			post(t, n) {
				return e.request.post(o(t, !0), n).then((e) => s(e, t, !0));
			}
		},
		invalidate: () => {
			r = !1;
		}
	};
}
//#endregion
//#region src/cms/views/content/components/CategoryTreeName.vue?vue&type=script&setup=true&lang.ts
var H = ["aria-expanded", "aria-label"], U = {
	key: 1,
	class: "spacer",
	"aria-hidden": "true"
}, ge = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "CategoryTreeName",
	props: {
		name: {},
		child: { type: Boolean },
		branch: { type: Boolean },
		expanded: { type: Boolean }
	},
	emits: ["toggle"],
	setup(e) {
		return (t, n) => (A(), x("div", { class: k(["category-name", { child: e.child }]) }, [e.branch ? (A(), x("button", {
			key: 0,
			type: "button",
			"aria-expanded": e.expanded,
			"aria-label": (e.expanded ? "收起" : "展开") + e.name,
			onClick: n[0] ||= me((e) => t.$emit("toggle"), ["stop"])
		}, [w(P(_), {
			name: e.expanded ? "chevron-down" : "chevron-right",
			size: 14
		}, null, 8, ["name"])], 8, H)) : (A(), x("span", U)), S("span", null, N(e.name), 1)], 2));
	}
}), [["__scopeId", "data-v-dd16b37d"]]);
//#endregion
//#region src/cms/views/content/categoryTree.ts
async function W(e, t) {
	let n = await e(1, 100), r = [...n.lists];
	for (let i = 2; i <= Math.ceil(n.count / 100); i++) t.throwIfAborted(), r.push(...(await e(i, 100)).lists);
	return {
		rows: r,
		total: r.length
	};
}
function G(e) {
	let t = M(/* @__PURE__ */ new Set()), n = v(() => {
		let t = [], n = /* @__PURE__ */ new Map(), r = new Set(e.value.map((e) => e.id));
		for (let i of e.value) {
			let e = String(i.parent_id ?? "");
			!e || !r.has(e) ? t.push(i) : (n.has(e) || n.set(e, []), n.get(e).push(i));
		}
		return {
			roots: t,
			children: n
		};
	}), r = v(() => n.value.roots.flatMap((e) => [e, ...t.value.has(e.id) ? n.value.children.get(e.id) ?? [] : []])), i = v(() => n.value.children.size > 0 && [...n.value.children.keys()].every((e) => t.value.has(e)));
	function a(e) {
		t.value.has(e) ? t.value.delete(e) : t.value.add(e);
	}
	function o() {
		t.value = i.value ? /* @__PURE__ */ new Set() : new Set(n.value.children.keys());
	}
	return {
		visibleRows: r,
		expanded: t,
		groups: n,
		allExpanded: i,
		toggle: a,
		toggleAll: o
	};
}
//#endregion
//#region src/cms/views/content/cmsSources.ts
function K() {
	return [{
		key: "cms_source_name",
		dataIndex: "cms_source_name",
		title: "来源昵称",
		width: 160
	}, {
		key: "cms_source_type",
		dataIndex: "cms_source_type",
		title: "来源类型",
		width: 100
	}];
}
function q(e, t) {
	let n = B().mode === "platform", r = ce(n ? [{
		key: "cms_source_type",
		label: "来源类型",
		type: "segmented",
		width: 200,
		defaultValue: "",
		options: [
			{
				label: "全部",
				value: ""
			},
			{
				label: "平台",
				value: "platform"
			},
			{
				label: "白标",
				value: "white_label"
			}
		]
	}, {
		key: "cms_tenant_id",
		label: "白标昵称",
		type: "select",
		width: 180,
		defaultValue: "",
		filterable: !0,
		placeholder: "搜索白标昵称",
		options: [{
			label: "全部白标",
			value: ""
		}]
	}] : []), i, a, o = !1, s = (e) => [String(e.cms_source_type || ""), String(e.cms_tenant_id || "")], ee = (e, t) => e[0] === t[0] && e[1] === t[1], c = (e) => {
		for (let t of [
			"parent_id",
			"category_id",
			"scene_id",
			"issue_category_id"
		]) t in e && (e[t] = "");
	};
	async function l() {
		if (o) return;
		a?.abort();
		let s = a = new AbortController(), ee = n ? {
			cms_source_type: String(i?.value.cms_source_type || ""),
			cms_tenant_id: String(i?.value.cms_tenant_id || "")
		} : {};
		try {
			let n = await e(s.signal, ee);
			if (o || s.signal.aborted) return;
			let a = r[1];
			a?.type === "select" && (a.options = [{
				label: "全部白标",
				value: ""
			}, ...n.cms_source_options || []], a.disabled = i?.value.cms_source_type === "platform"), t?.(n);
		} catch {
			!o && !s.signal.aborted && r[1]?.type === "select" && (r[1].disabled = !0);
		}
	}
	se(() => {
		if (n || t) return l();
	}), oe(() => {
		o = !0, a?.abort();
	});
	function u(e) {
		if (!n) return e;
		let t = e.filters;
		i = t;
		let a = s(t.value), u = (e) => {
			let t = { ...e };
			return t.cms_source_type === "platform" && (t.cms_tenant_id = ""), ee(a, s(t)) || c(t), t;
		}, d = (n = t.value) => {
			let r = u(n);
			a = s(r), e.query(r);
		}, f = (n) => {
			e.reset(n === void 0 ? void 0 : u(n)), a = s(t.value);
		};
		return L(() => t.value.cms_source_type, (e) => {
			e === "platform" && (t.value.cms_tenant_id = ""), r[1].disabled = e === "platform";
		}, {
			immediate: !0,
			flush: "sync"
		}), L([() => String(t.value.cms_source_type || ""), () => String(t.value.cms_tenant_id || "")], () => {
			c(t.value), l(), O(() => {
				!o && !ee(a, s(t.value)) && d();
			});
		}), {
			...e,
			query: d,
			reset: f,
			proTableBindings: v(() => ({
				...e.proTableBindings.value,
				onQuery: d,
				onReset: f
			}))
		};
	}
	return {
		fields: r,
		bindTable: u,
		loadMetadata: l
	};
}
//#endregion
//#region src/cms/components/source-type-tag/index.vue
var _e = /* @__PURE__ */ T({
	__name: "index",
	props: { sourceType: { default: "merchant" } },
	setup(e) {
		let t = e, n = {
			merchant: "商户",
			white_label: "白标",
			platform: "平台"
		}, r = {
			merchant: "primary",
			white_label: "info",
			platform: "success"
		}, i = v(() => t.sourceType ? n[t.sourceType] : "-"), a = v(() => t.sourceType ? r[t.sourceType] : "default");
		return (e, t) => (A(), y(P(o), {
			effect: "soft",
			round: "",
			size: "sm",
			type: a.value
		}, {
			default: R(() => [C(N(i.value), 1)]),
			_: 1
		}, 8, ["type"]));
	}
});
//#endregion
//#region src/cms/api/content/news.ts
function J() {
	let e = B().request, t = "/cms/news", n = (n, r = {}) => e.get({
		url: `${t}/metadata`,
		params: r,
		signal: n
	}), r = (n, r, i) => e.get({
		url: `${t}/${n}`,
		params: r,
		signal: i
	}), i = (n, r, i) => e.get({
		url: `${t}/${n}/detail`,
		params: { id: r },
		signal: i
	}), a = (n, r) => e.post({
		url: `${t}/${n}/${r.id ? "edit" : "create"}`,
		params: r
	}, { isOpenRetry: !1 }), o = (n, r, i) => e.post({
		url: `${t}/${n}/delete`,
		params: {
			id: r,
			row_version: i
		}
	}, { isOpenRetry: !1 }), s = l(e, `${t}/upload`), ee = [
		{
			label: "草稿",
			value: "draft"
		},
		{
			label: "定时发布",
			value: "scheduled"
		},
		{
			label: "已发布",
			value: "published"
		}
	];
	function c(e, t) {
		let n = e?.categories.find((e) => e.id === String(t));
		if (!n) return "—";
		let r = e?.categories.find((e) => e.id === n.parent_id);
		return r ? `${r.name} / ${n.name}` : n.name;
	}
	function u(e) {
		if (e && typeof e == "object") {
			let t = e;
			return Object.values(t.errors || {}).flat()[0] || t.msg || t.message || "操作失败，请稍后重试";
		}
		return "操作失败，请稍后重试";
	}
	return {
		getNewsMetadata: n,
		getNewsList: r,
		getNewsDetail: i,
		saveNews: a,
		deleteNews: o,
		uploadNewsCover: s,
		newsPublishStates: ee,
		newsCategoryLabel: c,
		newsError: u
	};
}
//#endregion
//#region src/cms/views/content/news/EnabledToggle.vue?vue&type=script&setup=true&lang.ts
var Y = ["aria-checked", "disabled"], X = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "EnabledToggle",
	props: {
		modelValue: { type: Boolean },
		disabled: { type: Boolean }
	},
	emits: ["update:modelValue"],
	setup(e) {
		return (t, n) => (A(), x("button", {
			type: "button",
			role: "switch",
			class: k(["news-toggle", { "is-on": e.modelValue }]),
			"aria-checked": e.modelValue,
			"aria-label": "启用状态",
			disabled: e.disabled,
			onClick: n[0] ||= (n) => t.$emit("update:modelValue", !e.modelValue)
		}, [n[1] ||= S("span", {
			class: "news-toggle__track",
			"aria-hidden": "true"
		}, [S("span")], -1), S("span", null, N(e.modelValue ? "已启用" : "已停用"), 1)], 10, Y));
	}
}), [["__scopeId", "data-v-8b527db1"]]), ve = { class: "news-categories" }, ye = ["aria-busy"], be = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, xe = { class: "taxonomy-editor__field" }, Z = { class: "taxonomy-editor__row" }, Q = "分类", Se = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { newsError: t, deleteNews: r, getNewsMetadata: i, getNewsList: s, getNewsDetail: ee, saveNews: c } = J(), { hasPermission: l } = B(), { formatDateTime: te } = B(), g = (e) => l([`cms_news_category:${e}`]), ae = M(), T = M(), E = q(i, (e) => {
			ae.value = e;
		}), O = [
			{
				key: "name",
				dataIndex: "name",
				title: "分类名称",
				width: 210,
				hideable: !1
			},
			...K(),
			{
				key: "code",
				dataIndex: "code",
				title: "分类ID",
				width: 220
			},
			{
				key: "parent_id",
				dataIndex: "parent_id",
				title: "父分类",
				width: 180,
				formatter: (e) => ae.value?.categories.find((t) => t.id === e)?.name || "一级分类"
			},
			{
				key: "news_count",
				dataIndex: "news_count",
				title: "新闻数量",
				width: 100
			},
			{
				key: "sort_order",
				dataIndex: "sort_order",
				title: "排序",
				width: 80
			},
			{
				key: "is_enabled",
				title: "状态",
				width: 100
			},
			{
				key: "updated_by_name",
				dataIndex: "updated_by_name",
				title: "最后编辑人",
				width: 150
			},
			{
				key: "updated_at",
				dataIndex: "updated_at",
				title: "更新时间",
				width: 180,
				formatter: te
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], k = [
			...E.fields,
			{
				key: "code",
				label: "分类ID",
				type: "keyword",
				width: 200,
				placeholder: "分类ID",
				defaultValue: ""
			},
			{
				key: "keyword",
				label: "分类名称",
				type: "keyword",
				width: 200,
				placeholder: "分类名称",
				defaultValue: ""
			},
			{
				key: "is_enabled",
				label: "状态",
				type: "segmented",
				width: 200,
				defaultValue: "",
				options: [
					{
						label: "全部",
						value: ""
					},
					{
						label: "已启用",
						value: "1"
					},
					{
						label: "已停用",
						value: "0"
					}
				]
			}
		], { proTableBindings: se, rows: j, reload: le } = E.bindTable(ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: k,
			request: async ({ filters: e, signal: t, reason: n }) => {
				let r = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), i = await W((e, n) => s("categories", {
					...r,
					page_no: e,
					page_size: n
				}, t), t);
				return !t.aborted && (n === "query" || n === "reset") && (F.value = Object.keys(r).length ? new Set(i.rows.filter((e) => e.parent_id != null).map((e) => String(e.parent_id))) : /* @__PURE__ */ new Set()), i;
			}
		})), { visibleRows: ue, expanded: F, groups: de, allExpanded: I, toggle: L, toggleAll: fe } = G(j), pe = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), z = ce(pe()), he = M(!1), V = M(!1), H = M(!1), U = M(!1), Y = M(!1), Se = M(""), $ = M(!1), Ce = M(""), we = M(!1), Te = v(() => !g(z.id ? "edit" : "add")), Ee = v(() => H.value || U.value), De = "", Oe;
		async function ke(e) {
			Oe?.abort(), Oe = new AbortController();
			let n = Oe;
			Object.assign(z, pe(), { id: e || "" }), Ce.value = "", Y.value = !1, Se.value = "", $.value = !1, he.value = !0, V.value = !0, De = JSON.stringify(z);
			try {
				if (T.value = await i(n.signal, { cms_source_type: "platform" }), !e || n.signal.aborted) return;
				let t = await ee("categories", e, n.signal);
				if (T.value = await i(n.signal, { space_id: String(t.space_id) }), n.signal.aborted) return;
				Object.assign(z, {
					id: t.id,
					row_version: t.row_version,
					name: t.name,
					code: t.code,
					parent_id: t.parent_id || "",
					sort_order: t.sort_order,
					is_enabled: t.is_enabled
				}), De = JSON.stringify(z);
			} catch (e) {
				n.signal.aborted || ($.value = !0, Ce.value = t(e));
			} finally {
				n.signal.aborted || (V.value = !1);
			}
		}
		function Ae() {
			return Ee.value ? !1 : !V.value && !$.value && JSON.stringify(z) !== De ? (we.value = !0, !1) : (Oe?.abort(), !0);
		}
		function je() {
			Ee.value || (Oe?.abort(), he.value = !1);
		}
		function Me() {
			we.value = !1, he.value = !1;
		}
		async function Ne() {
			if (!(Te.value || Ee.value || V.value || $.value)) {
				if (!z.name.trim() || z.sort_order === null) {
					Ce.value = "请填写分类名称和排序";
					return;
				}
				H.value = !0, Ce.value = "";
				try {
					await c("categories", {
						name: z.name,
						parent_id: z.parent_id || null,
						sort_order: z.sort_order,
						is_enabled: z.is_enabled,
						id: z.id || void 0,
						row_version: z.id ? z.row_version : void 0
					}), he.value = !1, u.success("保存成功"), await Promise.all([le(), Le()]);
				} catch (e) {
					Ce.value = t(e);
				} finally {
					H.value = !1;
				}
			}
		}
		function Pe() {
			!z.id || !g("delete") || Ee.value || V.value || $.value || (Se.value = "", Y.value = !0);
		}
		async function Fe() {
			if (!(!Y.value || !z.id || !g("delete") || Ee.value || V.value || $.value)) {
				U.value = !0, Se.value = "";
				try {
					await r("categories", z.id, z.row_version), Y.value = !1, he.value = !1, u.success("分类已删除"), await Promise.all([le(), Le()]);
				} catch (e) {
					Se.value = t(e);
				} finally {
					U.value = !1;
				}
			}
		}
		let Ie = v(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(T.value?.categories || []).filter((e) => !e.parent_id && e.id !== z.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Le = E.loadMetadata;
		return oe(() => {
			Oe?.abort();
		}), (e, t) => (A(), x("div", ve, [
			w(P(re), D(P(se), {
				"auto-refreshable": !1,
				columns: O,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Q}管理`,
				data: P(ue),
				"show-pagination": !1
			}), {
				"cell-cms_source_type": R(({ row: e }) => [w(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [g("add") ? (A(), y(P(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: t[0] ||= (e) => ke()
				}, {
					icon: R(() => [w(P(_), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [C("新增" + N(Q))]),
					_: 1
				})) : b("", !0), w(P(n), {
					size: "sm",
					disabled: !P(de).children.size,
					onClick: P(fe)
				}, {
					icon: R(() => [w(P(_), {
						name: P(I) ? "chevron-up" : "chevron-down",
						size: 14
					}, null, 8, ["name"])]),
					default: R(() => [C(" " + N(P(I) ? "全部收起" : "全部展开"), 1)]),
					_: 1
				}, 8, ["disabled", "onClick"])]),
				"cell-name": R(({ row: e }) => [w(ge, {
					name: e.name,
					child: e.parent_id != null,
					branch: P(de).children.has(e.id),
					expanded: P(F).has(e.id),
					onToggle: (t) => P(L)(e.id)
				}, null, 8, [
					"name",
					"child",
					"branch",
					"expanded",
					"onToggle"
				])]),
				"cell-is_enabled": R(({ row: e }) => [w(P(o), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [C(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": R(({ row: e }) => [w(P(n), {
					size: "sm",
					"icon-only": "",
					title: g("edit") ? `编辑${Q}` : `${Q}详情`,
					"aria-label": `编辑${Q}`,
					onClick: (t) => ke(e.id)
				}, {
					default: R(() => [w(P(_), {
						name: g("edit") ? "square-pen" : "panel-right-open",
						size: 15
					}, null, 8, ["name"])]),
					_: 1
				}, 8, [
					"title",
					"aria-label",
					"onClick"
				])]),
				_: 1
			}, 16, ["aria-label", "data"]),
			w(P(d), {
				modelValue: he.value,
				"onUpdate:modelValue": t[5] ||= (e) => he.value = e,
				title: `${z.id ? "编辑" : "新增"}新闻${Q}`,
				width: "680px",
				subtitle: "新闻分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Ae
			}, {
				footer: R(() => [
					z.id && g("delete") ? (A(), y(P(n), {
						key: 0,
						variant: "danger",
						disabled: V.value || $.value || Ee.value,
						onClick: Pe
					}, {
						icon: R(() => [w(P(_), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [t[11] ||= C("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(P(n), {
						disabled: Ee.value,
						onClick: je
					}, {
						default: R(() => [...t[12] ||= [C("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Te.value ? b("", !0) : (A(), y(P(n), {
						key: 1,
						variant: "primary",
						loading: H.value,
						disabled: V.value || $.value || U.value,
						onClick: Ne
					}, {
						default: R(() => [C("保存" + N(Q))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [S("div", {
					class: "taxonomy-editor",
					"aria-busy": V.value
				}, [
					V.value ? (A(), x("div", be, [w(P(_), {
						name: "loader-circle",
						class: "news-spin",
						size: 24
					}), S("span", null, "正在读取" + N(Q) + "...")])) : b("", !0),
					Ce.value ? (A(), y(P(p), {
						key: 1,
						type: "error",
						closable: !1,
						description: Ce.value
					}, null, 8, ["description"])) : b("", !0),
					!V.value && !$.value ? (A(), y(P(f), {
						key: 2,
						model: z,
						"label-position": "top",
						onSubmit: me(Ne, ["prevent"])
					}, {
						default: R(() => [
							z.id ? (A(), y(P(m), {
								key: 0,
								label: "分类ID"
							}, {
								default: R(() => [w(P(h), {
									"model-value": z.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : b("", !0),
							w(P(m), {
								label: `${Q}名称`,
								required: ""
							}, {
								default: R(() => [w(P(h), {
									modelValue: z.name,
									"onUpdate:modelValue": t[1] ||= (e) => z.name = e,
									maxlength: 120,
									disabled: Te.value || Ee.value,
									"aria-label": `${Q}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							w(P(m), { label: "父分类" }, {
								default: R(() => [S("div", xe, [w(P(ie), {
									modelValue: z.parent_id,
									"onUpdate:modelValue": t[2] ||= (e) => z.parent_id = e,
									options: Ie.value,
									disabled: Te.value || Ee.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), t[10] ||= S("p", { class: "news-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类新闻。 ", -1)])]),
								_: 1
							}),
							S("div", Z, [w(P(m), {
								label: "前端排序",
								required: ""
							}, {
								default: R(() => [w(P(a), {
									modelValue: z.sort_order,
									"onUpdate:modelValue": t[3] ||= (e) => z.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Te.value || Ee.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), w(P(m), { label: "启用状态" }, {
								default: R(() => [w(X, {
									modelValue: z.is_enabled,
									"onUpdate:modelValue": t[4] ||= (e) => z.is_enabled = e,
									disabled: Te.value || Ee.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : b("", !0)
				], 8, ye)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			w(P(d), {
				modelValue: Y.value,
				"onUpdate:modelValue": t[7] ||= (e) => Y.value = e,
				title: "删除新闻分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !U.value
			}, {
				footer: R(() => [w(P(n), {
					disabled: U.value,
					onClick: t[6] ||= (e) => Y.value = !1
				}, {
					default: R(() => [...t[13] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(n), {
					variant: "danger",
					loading: U.value,
					onClick: Fe
				}, {
					default: R(() => [...t[14] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [S("p", null, "确认删除分类“" + N(z.name) + "”？有关联新闻或子分类的分类无法删除。", 1), Se.value ? (A(), y(P(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: Se.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			w(P(d), {
				modelValue: we.value,
				"onUpdate:modelValue": t[9] ||= (e) => we.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [w(P(n), { onClick: t[8] ||= (e) => we.value = !1 }, {
					default: R(() => [...t[15] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(P(n), {
					variant: "primary",
					onClick: Me
				}, {
					default: R(() => [...t[16] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-ae27f13a"]]), $ = {
	news: "新闻",
	help: "文章",
	announcement: "公告"
}, Ce = [
	"category_id",
	"title",
	"body_html",
	"sort_order",
	"summary",
	"seo_description",
	"cover_url",
	"content_source",
	"author_name",
	"is_enabled",
	"scheduled_local",
	"search_keywords",
	"helpful_enabled",
	"related_content_ids"
];
function we(e, t, n, r, i = Date.now()) {
	let a = {}, o = $[n];
	e.title.trim() || (a.title = `请填写${o}标题`);
	for (let [t, n, r] of [
		[
			"title",
			255,
			`${o}标题`
		],
		[
			"summary",
			1e4,
			"摘要"
		],
		[
			"body_html",
			1e6,
			"正文"
		],
		[
			"seo_description",
			2e3,
			"SEO 描述"
		],
		[
			"cover_url",
			2048,
			"封面地址"
		],
		[
			"content_source",
			160,
			"内容来源"
		],
		[
			"author_name",
			120,
			"作者署名"
		],
		[
			"search_keywords",
			2e3,
			"搜索关键词"
		]
	]) [...e[t] || ""].length > n && (a[t] = `${r}不能超过 ${n} 个字符`);
	if ((e.sort_order === null || !Number.isInteger(e.sort_order) || e.sort_order < 0 || e.sort_order > 2147483647) && (a.sort_order = "请填写 0–2147483647 之间的整数"), e.cover_url) {
		let t = !/[\x00-\x20\\]/.test(e.cover_url);
		if (!(e.cover_url.startsWith("/") && !e.cover_url.startsWith("//"))) try {
			t &&= /^https?:\/\//i.test(e.cover_url) && ["http:", "https:"].includes(new URL(e.cover_url).protocol);
		} catch {
			t = !1;
		}
		t || (a.cover_url = "封面地址必须为 HTTP(S) 或站内绝对路径");
	}
	let s = t.find((t) => t.id === e.category_id);
	if (e.category_id && !s && (a.category_id = "所选分类已不可用，请重新选择"), n !== "announcement" && s && s.parent_id == null && (a.category_id = `${o}只能选择二级分类`), r !== "draft" && (e.category_id ? s && !s.effective_enabled && (a.category_id = `发布${o}的分类及父分类必须已启用`) : a.category_id = `请选择${o}分类`, e.body_html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "").replace(/&nbsp;|&#0*(?:160|9|10|13|32);|&#x0*(?:a0|9|a|d|20);/gi, " ").trim() || (a.body_html = `请填写${o}正文`)), (e.related_content_ids?.length || 0) > 20 && (a.related_content_ids = `相关${o}最多选择 20 篇`), r === "scheduled") {
		let t = new Date(e.scheduled_local).getTime();
		(!Number.isFinite(t) || t <= i) && (a.scheduled_local = "计划发布时间必须晚于当前时间");
	}
	return a;
}
function Te(e, t) {
	let n = {}, r = [], i = $[t], a = {
		[`${i}标题不能为空`]: "title",
		[`发布${i}必须选择分类`]: "category_id",
		[`${i}只能选择二级分类`]: "category_id",
		[`发布${i}的分类及父分类必须已启用`]: "category_id",
		[`发布${i}需要填写正文`]: "body_html",
		"封面地址必须为 HTTP(S) 或站内绝对路径": "cover_url",
		计划发布时间必须晚于当前时间: "scheduled_local"
	}, o = e && typeof e == "object" ? e : {};
	for (let [e, i] of Object.entries(o.errors || {})) {
		let o = e.split(".")[0], s = o === "scheduled_at" ? "scheduled_local" : o;
		for (let o of Array.isArray(i) ? i : [i]) {
			if (typeof o != "string" || !o) continue;
			let i = Ce.includes(s) ? s : e === t ? a[o] : void 0;
			i ? n[i] ||= o : r.push(o);
		}
	}
	return {
		fields: n,
		general: r.join("；") || (Object.keys(n).length ? "" : o.msg || o.message || "操作失败，请稍后重试")
	};
}
//#endregion
//#region src/cms/views/content/useArticleValidation.ts
function Ee(e, t, n, r) {
	let i = M(), a = M(), o = M(null), s = M(Date.now()), ee = ce({}), c = M(""), l = Object.fromEntries(Ce.map((e) => [e, {
		required: e === "title" || e === "category_id",
		trigger: "submit"
	}])), u = v(() => o.value ? we(e, t(), n, o.value === "draft" ? "draft" : e.scheduled_local ? "scheduled" : "published", s.value) : {}), d = v(() => ({
		...ee,
		...u.value
	})), f = v(() => Object.keys(d.value).length);
	for (let t of Ce) L(() => e[t], () => {
		delete ee[t], c.value = "", s.value = Date.now();
	}, { deep: !0 });
	function te() {
		d.value.seo_description && a.value?.focus();
	}
	async function p() {
		await O();
		let e = [...i.value?.querySelectorAll("[data-prop]") || []].find((e) => d.value[e.dataset.prop]);
		if (!e && d.value.seo_description) {
			r.value ? te() : r.value = !0;
			return;
		}
		e && (e.scrollIntoView({
			block: "center",
			behavior: "auto"
		}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
	}
	async function ne(e) {
		o.value = e === "draft" ? "draft" : "publish", s.value = Date.now(), c.value = "";
		for (let e of Ce) delete ee[e];
		return f.value ? (await p(), !1) : !0;
	}
	function re(e) {
		let t = Te(e, n);
		Object.assign(ee, t.fields), c.value = t.general;
	}
	return {
		editorRoot: i,
		seoInput: a,
		fieldRules: l,
		fieldErrors: d,
		pendingCount: f,
		saveError: c,
		validateSave: ne,
		setSaveFailure: re,
		focusFirstError: p,
		focusSeoError: te
	};
}
//#endregion
//#region src/cms/views/content/news/list/ArticleEditor.vue?vue&type=script&setup=true&lang.ts
var De = ["aria-busy"], Oe = { class: "article-editor__header" }, ke = { class: "article-editor__heading" }, Ae = { class: "article-editor__commands" }, je = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, Me = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Ne = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, Pe = {
	key: 1,
	class: "article-editor__failure"
}, Fe = {
	key: 0,
	class: "article-editor__error"
}, Ie = { class: "article-editor__body" }, Le = { class: "article-editor__settings" }, Re = { class: "article-editor__content" }, ze = ["aria-invalid", "disabled"], Be = ["aria-invalid", "disabled"], Ve = {
	class: "news-delete-dialog__icon",
	"aria-hidden": "true"
}, He = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: r }) {
		let { newsError: o, newsCategoryLabel: s, deleteNews: ee, getNewsDetail: c, getNewsMetadata: l, saveNews: te, uploadNewsCover: ne } = J(), { hasPermission: re } = B(), g = t, T = r, E = M(!0), D = M(!1), O = M(!1), k = M(""), j = M(!1), le = M(!1), ue = M(!1), F = M(!1), I = M(B().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), L = M(), pe = M("draft"), z = M(!1), V = v(() => re(["cms_news:publish"])), H = v(() => !re([`cms_news:${g.articleId ? "edit" : "add"}`]) || !V.value && pe.value !== "draft"), U = v(() => re(["cms_news:delete"]) && (V.value || pe.value === "draft"));
		async function ge() {
			if (!(!U.value || D.value || E.value || O.value)) {
				D.value = !0, k.value = "";
				try {
					await ee("articles", G.id, G.row_version), we = JSON.stringify(G), u.success("新闻已删除"), T("saved");
				} catch (e) {
					k.value = o(e), F.value = !1;
				} finally {
					D.value = !1;
				}
			}
		}
		let W = v(() => H.value || D.value), G = ce({
			id: "",
			row_version: "",
			title: "",
			category_id: "",
			summary: "",
			body_html: "",
			seo_description: "",
			cover_url: "",
			content_source: "",
			author_name: "",
			sort_order: 10,
			is_enabled: !0,
			scheduled_local: ""
		}), { editorRoot: K, seoInput: q, fieldRules: _e, fieldErrors: Y, pendingCount: ve, saveError: ye, validateSave: be, setSaveFailure: xe, focusFirstError: Z, focusSeoError: Q } = Ee(G, () => L.value?.categories || [], "news", j), Se = v(() => (L.value?.categories || []).filter((e) => e.parent_id != null).map((e) => ({
			label: s(L.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), $ = v(() => L.value?.categories.find((e) => e.id === G.category_id && e.parent_id == null)), Ce = v({
			get: () => $.value ? "" : G.category_id,
			set: (e) => {
				G.category_id = e;
			}
		}), we = "", Te;
		function He(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Ue() {
			Te?.abort(), Te = new AbortController();
			let e = Te;
			E.value = !0, O.value = !1, k.value = "";
			try {
				if (L.value = await l(e.signal, { cms_source_type: "platform" }), g.articleId) {
					let t = await c("articles", g.articleId, e.signal);
					if (L.value = await l(e.signal, { space_id: String(t.space_id) }), I.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"sort_order",
						"is_enabled"
					]) Object.assign(G, { [e]: t[e] });
					G.category_id = t.category_id || "";
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url",
						"content_source",
						"author_name"
					]) G[e] = t[e] || "";
					G.scheduled_local = t.publish_status === "scheduled" ? He(t.scheduled_at) : "", pe.value = t.publish_status;
				}
				we = JSON.stringify(G);
			} catch (t) {
				e.signal.aborted || (k.value = o(t), O.value = !0);
			} finally {
				e.signal.aborted || (E.value = !1);
			}
		}
		let We = () => !E.value && !O.value && we !== JSON.stringify(G);
		function Ge() {
			We() ? le.value = !0 : T("close");
		}
		function Ke() {
			pe.value === "draft" ? Je("draft") : ue.value = !0;
		}
		function qe() {
			ue.value = !1, Je("draft");
		}
		async function Je(e) {
			if (W.value || E.value || O.value || z.value || (k.value = "", !await be(e))) return;
			let t = G.scheduled_local ? new Date(G.scheduled_local) : null;
			D.value = !0, k.value = "";
			try {
				await te("articles", {
					...G,
					id: G.id || void 0,
					row_version: G.id ? G.row_version : void 0,
					category_id: G.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), we = JSON.stringify(G), u.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "新闻已发布"), T("saved");
			} catch (e) {
				xe(e);
			} finally {
				D.value = !1;
			}
			ve.value && await Z();
		}
		function Ye(e) {
			k.value = o(e);
		}
		let Xe = (e) => {
			We() && (e.preventDefault(), e.returnValue = "");
		};
		return he(() => !D.value && !z.value && (!We() || window.confirm("新闻有未保存的修改，确定离开？"))), se(() => {
			Ue(), window.addEventListener("beforeunload", Xe);
		}), oe(() => {
			Te?.abort(), window.removeEventListener("beforeunload", Xe);
		}), (r, o) => (A(), x("section", {
			ref_key: "editorRoot",
			ref: K,
			class: "article-editor",
			"aria-busy": E.value || D.value
		}, [
			S("header", Oe, [
				w(P(n), {
					"icon-only": "",
					title: "返回新闻列表",
					"aria-label": "返回新闻列表",
					disabled: D.value || z.value,
					onClick: Ge
				}, {
					default: R(() => [w(P(_), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				S("div", ke, [S("h2", null, N(t.articleId ? "编辑新闻" : "新增新闻"), 1), S("span", null, N(L.value?.source_locale || "zh-CN") + " · " + N(I.value), 1)]),
				S("div", Ae, [
					t.articleId && U.value ? (A(), y(P(n), {
						key: 0,
						size: "sm",
						disabled: E.value || O.value || D.value || z.value,
						onClick: o[0] ||= (e) => F.value = !0
					}, {
						default: R(() => [...o[28] ||= [C("删除新闻", -1)]]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(P(n), {
						size: "sm",
						disabled: E.value || O.value,
						onClick: o[1] ||= (e) => j.value = !0
					}, {
						icon: R(() => [w(P(_), {
							name: "search",
							size: 14
						})]),
						default: R(() => [o[29] ||= C("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					H.value ? b("", !0) : (A(), y(P(n), {
						key: 1,
						size: "sm",
						disabled: E.value || O.value || D.value || z.value,
						onClick: Ke
					}, {
						icon: R(() => [w(P(_), {
							name: "save",
							size: 14
						})]),
						default: R(() => [o[30] ||= C("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					P(ye) ? (A(), x("span", je, N(P(ye)), 1)) : b("", !0),
					!H.value && P(ve) ? (A(), x("span", Me, "还有 " + N(P(ve)) + " 项待完善", 1)) : b("", !0),
					!H.value && V.value ? (A(), y(P(n), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: E.value || O.value || z.value,
						loading: D.value,
						onClick: o[2] ||= (e) => Je(G.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [w(P(_), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [C(N(G.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : b("", !0)
				])
			]),
			E.value ? (A(), x("div", Ne, [w(P(_), {
				name: "loader-circle",
				class: "news-spin",
				size: 28
			}), o[31] ||= S("span", null, "正在读取新闻资料...", -1)])) : O.value ? (A(), x("div", Pe, [w(P(p), {
				type: "error",
				description: k.value,
				closable: !1
			}, null, 8, ["description"]), w(P(n), { onClick: Ue }, {
				default: R(() => [...o[32] ||= [C("重新加载", -1)]]),
				_: 1
			})])) : (A(), x(ae, { key: 2 }, [k.value ? (A(), x("div", Fe, [w(P(p), {
				type: "error",
				description: k.value,
				closable: !1
			}, null, 8, ["description"])])) : b("", !0), S("div", Ie, [S("aside", Le, [w(P(f), {
				model: G,
				rules: P(_e),
				"label-position": "top",
				onSubmit: o[12] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					w(P(m), {
						label: "新闻分类",
						prop: "category_id",
						error: P(Y).category_id,
						required: ""
					}, {
						default: R(() => [w(P(ie), {
							modelValue: Ce.value,
							"onUpdate:modelValue": o[3] ||= (e) => Ce.value = e,
							options: Se.value,
							placeholder: $.value ? "原分类：" + $.value.name + "（请选择二级分类）" : "请选择二级分类",
							clearable: "",
							disabled: W.value,
							"aria-label": "新闻分类"
						}, null, 8, [
							"modelValue",
							"options",
							"placeholder",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					o[33] ||= S("h3", null, "新闻设置", -1),
					w(P(m), {
						label: "新闻封面",
						prop: "cover_url",
						error: P(Y).cover_url
					}, {
						default: R(() => [w(e, {
							modelValue: G.cover_url,
							"onUpdate:modelValue": o[4] ||= (e) => G.cover_url = e,
							label: "新闻封面",
							disabled: W.value,
							upload: P(ne),
							onBusyChange: o[5] ||= (e) => z.value = e,
							onStart: o[6] ||= (e) => k.value = "",
							onError: Ye
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "内容来源",
						prop: "content_source",
						error: P(Y).content_source
					}, {
						default: R(() => [w(P(h), {
							modelValue: G.content_source,
							"onUpdate:modelValue": o[7] ||= (e) => G.content_source = e,
							maxlength: 160,
							disabled: W.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "作者署名",
						prop: "author_name",
						error: P(Y).author_name
					}, {
						default: R(() => [w(P(h), {
							modelValue: G.author_name,
							"onUpdate:modelValue": o[8] ||= (e) => G.author_name = e,
							maxlength: 120,
							disabled: W.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "前端排序",
						prop: "sort_order",
						error: P(Y).sort_order
					}, {
						default: R(() => [w(P(a), {
							modelValue: G.sort_order,
							"onUpdate:modelValue": o[9] ||= (e) => G.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: W.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[34] ||= S("h3", null, "发布设置", -1),
					w(P(m), {
						label: "启用状态",
						prop: "is_enabled",
						error: P(Y).is_enabled
					}, {
						default: R(() => [w(X, {
							modelValue: G.is_enabled,
							"onUpdate:modelValue": o[10] ||= (e) => G.is_enabled = e,
							disabled: W.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: P(Y).scheduled_local
					}, {
						default: R(() => [w(P(h), {
							modelValue: G.scheduled_local,
							"onUpdate:modelValue": o[11] ||= (e) => G.scheduled_local = e,
							type: "datetime-local",
							disabled: W.value || !V.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[35] ||= S("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), S("main", Re, [w(P(f), {
				model: G,
				rules: P(_e),
				"label-position": "top",
				onSubmit: o[16] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					w(P(m), {
						label: "标题",
						prop: "title",
						error: P(Y).title,
						required: ""
					}, {
						default: R(() => [w(P(h), {
							modelValue: G.title,
							"onUpdate:modelValue": o[13] ||= (e) => G.title = e,
							maxlength: 255,
							disabled: W.value,
							placeholder: "输入新闻标题",
							"aria-label": "新闻标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "摘要",
						prop: "summary",
						error: P(Y).summary
					}, {
						default: R(() => [fe(S("textarea", {
							"onUpdate:modelValue": o[14] ||= (e) => G.summary = e,
							"aria-invalid": !!P(Y).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: W.value,
							"aria-label": "新闻摘要"
						}, null, 8, ze), [[de, G.summary]])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "正文",
						prop: "body_html",
						error: P(Y).body_html
					}, {
						default: R(() => [w(P(i), {
							modelValue: G.body_html,
							"onUpdate:modelValue": o[15] ||= (e) => G.body_html = e,
							readonly: H.value,
							disabled: D.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "新闻正文"
						}, {
							"image-upload": R(({ url: t, setUrl: n, setBusy: r }) => [w(e, {
								label: "正文图片",
								"model-value": t,
								upload: P(ne),
								"onUpdate:modelValue": n,
								onBusyChange: r,
								onError: Ye
							}, null, 8, [
								"model-value",
								"upload",
								"onUpdate:modelValue",
								"onBusyChange"
							])]),
							_: 1
						}, 8, [
							"modelValue",
							"readonly",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])])])], 64)),
			w(P(d), {
				modelValue: j.value,
				"onUpdate:modelValue": o[20] ||= (e) => j.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: R(() => [w(P(n), {
					variant: "primary",
					onClick: o[19] ||= (e) => j.value = !1
				}, {
					default: R(() => [...o[36] ||= [C("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [w(P(f), {
					model: G,
					rules: P(_e),
					"label-position": "top",
					onSubmit: o[18] ||= me(() => {}, ["prevent"])
				}, {
					default: R(() => [w(P(m), {
						label: "SEO 描述",
						prop: "seo_description",
						error: P(Y).seo_description
					}, {
						default: R(() => [fe(S("textarea", {
							ref_key: "seoInput",
							ref: q,
							"onUpdate:modelValue": o[17] ||= (e) => G.seo_description = e,
							"aria-invalid": !!P(Y).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: W.value,
							"aria-label": "SEO 描述"
						}, null, 8, Be), [[de, G.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			w(P(d), {
				modelValue: F.value,
				"onUpdate:modelValue": o[22] ||= (e) => F.value = e,
				title: "确认删除",
				subtitle: `操作对象：${G.title || "未命名新闻"}`,
				width: "460px",
				"panel-class": "news-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !D.value
			}, {
				"header-actions": R(() => [S("span", Ve, [w(P(_), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [w(P(n), {
					disabled: D.value,
					onClick: o[21] ||= (e) => F.value = !1
				}, {
					default: R(() => [...o[37] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(n), {
					variant: "warning",
					loading: D.value,
					onClick: ge
				}, {
					default: R(() => [...o[38] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [w(P(p), {
					class: "news-delete-dialog__notice",
					type: "warning",
					closable: !1,
					"show-icon": !1,
					description: "确定删除这条新闻吗？删除后将不再展示，请谨慎操作。"
				})]),
				_: 1
			}, 8, [
				"modelValue",
				"subtitle",
				"before-close"
			]),
			w(P(d), {
				modelValue: le.value,
				"onUpdate:modelValue": o[25] ||= (e) => le.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [w(P(n), { onClick: o[23] ||= (e) => le.value = !1 }, {
					default: R(() => [...o[39] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(P(n), {
					variant: "primary",
					onClick: o[24] ||= (e) => T("close")
				}, {
					default: R(() => [...o[40] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			w(P(d), {
				modelValue: ue.value,
				"onUpdate:modelValue": o[27] ||= (e) => ue.value = e,
				title: "将新闻转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [w(P(n), { onClick: o[26] ||= (e) => ue.value = !1 }, {
					default: R(() => [...o[41] ||= [C("取消", -1)]]),
					_: 1
				}), w(P(n), {
					variant: "primary",
					onClick: qe
				}, {
					default: R(() => [...o[42] ||= [C("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, De));
	}
}), [["__scopeId", "data-v-33394e7e"]]), Ue = { class: "news-articles" }, We = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { newsPublishStates: t, newsCategoryLabel: r, getNewsList: i, getNewsMetadata: a } = J(), { hasPermission: s } = B(), { formatDateTime: ee } = B(), c = M(!1), l = M(), u = (e) => s([`cms_news:${e}`]), d = M(), f = q(a, (e) => {
			d.value = e;
		}), te = [
			...K(),
			{
				key: "code",
				dataIndex: "code",
				title: "新闻ID",
				width: 220
			},
			{
				key: "title",
				dataIndex: "title",
				title: "新闻标题",
				width: 240,
				hideable: !1
			},
			{
				key: "category_id",
				dataIndex: "category_id",
				title: "新闻分类",
				width: 220,
				formatter: (e) => r(d.value, e)
			},
			{
				key: "sort_order",
				dataIndex: "sort_order",
				title: "排序",
				width: 70
			},
			{
				key: "publish_status",
				title: "发布状态",
				width: 100
			},
			{
				key: "is_enabled",
				title: "状态",
				width: 85
			},
			{
				key: "publish_time",
				title: "发布时间",
				width: 180
			},
			{
				key: "updated_by_name",
				dataIndex: "updated_by_name",
				title: "最后编辑人",
				width: 130
			},
			{
				key: "updated_at",
				dataIndex: "updated_at",
				title: "更新时间",
				width: 180,
				formatter: ee
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], p = v(() => [
			...f.fields,
			{
				key: "code",
				label: "新闻ID",
				type: "keyword",
				width: 170,
				placeholder: "新闻ID",
				defaultValue: ""
			},
			{
				key: "keyword",
				label: "新闻标题",
				type: "keyword",
				width: 200,
				placeholder: "新闻标题",
				defaultValue: ""
			},
			{
				key: "category_id",
				label: "新闻分类",
				type: "select",
				width: 160,
				defaultValue: "",
				options: [{
					label: "全部",
					value: ""
				}, ...(d.value?.categories || []).map((e) => ({
					label: r(d.value, e.id),
					value: e.id
				}))]
			},
			{
				key: "publish_status",
				label: "发布状态",
				type: "select",
				width: 150,
				defaultValue: "",
				options: [{
					label: "全部",
					value: ""
				}, ...t]
			},
			{
				key: "is_enabled",
				label: "状态",
				type: "select",
				width: 130,
				defaultValue: "",
				options: [
					{
						label: "全部",
						value: ""
					},
					{
						label: "已启用",
						value: "1"
					},
					{
						label: "已停用",
						value: "0"
					}
				]
			},
			{
				key: "publish_range",
				label: "发布时间",
				type: "date-range",
				width: 240,
				defaultValue: null
			}
		]), { proTableBindings: ie, reload: m } = f.bindTable(ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: p,
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let a = Object.fromEntries(Object.entries(e).filter(([e, t]) => e !== "publish_range" && t !== "" && t != null)), o = e.publish_range;
				Array.isArray(o) && o.length === 2 && (a.published_from = (/* @__PURE__ */ new Date(`${o[0]}T00:00:00`)).toISOString(), a.published_to = (/* @__PURE__ */ new Date(`${o[1]}T23:59:59.999`)).toISOString());
				let s = await i("articles", {
					...a,
					page_no: t,
					page_size: n
				}, r);
				return {
					rows: s.lists,
					total: s.count
				};
			}
		})), h = f.loadMetadata;
		function g(e) {
			l.value = e, c.value = !0;
		}
		function ae() {
			c.value = !1, m(), h();
		}
		return (e, r) => (A(), x("div", Ue, [c.value ? (A(), y(He, {
			key: 0,
			"article-id": l.value,
			onClose: r[0] ||= (e) => c.value = !1,
			onSaved: ae
		}, null, 8, ["article-id"])) : b("", !0), fe(w(P(re), D(P(ie), {
			"auto-refreshable": !1,
			columns: te,
			"row-key": "id",
			"fill-height": "",
			"columns-configurable": "",
			"show-cell-title": "",
			"aria-label": "新闻列表",
			"page-sizes": [
				20,
				50,
				100
			]
		}), {
			"cell-cms_source_type": R(({ row: e }) => [w(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": R(() => [u("add") ? (A(), y(P(n), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: r[1] ||= (e) => g()
			}, {
				icon: R(() => [w(P(_), {
					name: "plus",
					size: 14
				})]),
				default: R(() => [r[2] ||= C("新增新闻", -1)]),
				_: 1
			})) : b("", !0)]),
			"cell-publish_status": R(({ row: e }) => [w(P(o), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: R(() => [C(N(P(t).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": R(({ row: e }) => [w(P(o), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: R(() => [C(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": R(({ row: e }) => [C(N(P(ee)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": R(({ row: e }) => [w(P(n), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑新闻" : "新闻详情",
				"aria-label": u("edit") ? "编辑新闻" : "新闻详情",
				onClick: (t) => g(e.id)
			}, {
				default: R(() => [w(P(_), {
					name: u("edit") ? "square-pen" : "panel-right-open",
					size: 15
				}, null, 8, ["name"])]),
				_: 1
			}, 8, [
				"title",
				"aria-label",
				"onClick"
			])]),
			_: 1
		}, 16), [[I, !c.value]])]));
	}
}), [["__scopeId", "data-v-15e6f2c5"]]);
//#endregion
//#region src/cms/api/content/academy.ts
function Ge() {
	let e = B().request, t = "/cms/academy";
	return {
		getAcademyMetadata: (n, r = {}) => e.get({
			url: `${t}/metadata`,
			params: r,
			signal: n
		}),
		getAcademyList: (n, r, i) => e.get({
			url: `${t}/${n}`,
			params: r,
			signal: i
		}),
		getAcademyDetail: (n, r, i) => e.get({
			url: `${t}/${n}/detail`,
			params: { id: r },
			signal: i
		}),
		saveAcademy: (n, r) => e.post({
			url: `${t}/${n}/${r.id ? "edit" : "create"}`,
			params: r
		}, { isOpenRetry: !1 }),
		uploadAcademyCover: l(e, "/cms/academy/upload"),
		deleteAcademyCourse: (n) => e.post({
			url: `${t}/courses/delete`,
			params: n
		}, { isOpenRetry: !1 }),
		deleteAcademyCategory: (n) => e.post({
			url: `${t}/categories/delete`,
			params: n
		}, { isOpenRetry: !1 }),
		academyDifficulties: [
			{
				label: "入门",
				value: 1
			},
			{
				label: "进阶",
				value: 2
			},
			{
				label: "专业",
				value: 3
			}
		],
		academyPublishStates: [
			{
				label: "草稿",
				value: "draft"
			},
			{
				label: "定时发布",
				value: "scheduled"
			},
			{
				label: "已发布",
				value: "published"
			}
		],
		academyError: (e) => {
			if (e && typeof e == "object") {
				let t = e;
				return Object.values(t.errors || {}).flat()[0] || t.msg || t.message || "操作失败，请稍后重试";
			}
			return "操作失败，请稍后重试";
		}
	};
}
//#endregion
//#region src/cms/views/content/academy/categories/CategoryTable.vue?vue&type=script&setup=true&lang.ts
var Ke = ["aria-busy"], qe = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Je = { class: "taxonomy-editor__row" }, Ye = "分类", Xe = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "CategoryTable",
	setup(e) {
		let { hasPermission: t } = B(), { formatDateTime: i } = B(), { academyDifficulties: s, academyError: ee, getAcademyList: c, getAcademyMetadata: l, getAcademyDetail: te, saveAcademy: ie, deleteAcademyCategory: g } = Ge(), T = (e) => t([`cms_academy_category:${e}`]), E = q(l), O = [
			...K(),
			{
				key: "code",
				dataIndex: "code",
				title: "分类ID",
				width: 220
			},
			{
				key: "name",
				dataIndex: "name",
				title: "分类名称",
				width: 210
			},
			{
				key: "course_count",
				dataIndex: "course_count",
				title: "课程数量",
				width: 100
			},
			{
				key: "sort_order",
				dataIndex: "sort_order",
				title: "排序",
				width: 80
			},
			{
				key: "is_enabled",
				title: "状态",
				width: 100
			},
			{
				key: "updated_by_name",
				dataIndex: "updated_by_name",
				title: "最后编辑人",
				width: 150
			},
			{
				key: "updated_at",
				dataIndex: "updated_at",
				title: "更新时间",
				width: 180,
				formatter: i
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], k = [
			...E.fields,
			{
				key: "code",
				label: "分类ID",
				type: "keyword",
				width: 200,
				placeholder: "分类ID",
				defaultValue: ""
			},
			{
				key: "keyword",
				label: "分类名称",
				type: "keyword",
				width: 200,
				placeholder: "分类名称",
				defaultValue: ""
			},
			{
				key: "difficulty_level",
				label: "难度范围",
				type: "select",
				width: 160,
				defaultValue: "",
				options: [{
					label: "全部",
					value: ""
				}, ...s]
			},
			{
				key: "is_enabled",
				label: "状态",
				type: "segmented",
				width: 200,
				defaultValue: "",
				options: [
					{
						label: "全部",
						value: ""
					},
					{
						label: "已启用",
						value: "1"
					},
					{
						label: "已停用",
						value: "0"
					}
				]
			}
		], { proTableBindings: se, reload: j, currentPage: le, pageSize: ue, total: F } = E.bindTable(ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: k,
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), a = await c("categories", {
					...i,
					page_no: t,
					page_size: n
				}, r);
				return {
					rows: a.lists,
					total: a.count
				};
			}
		})), de = () => ({
			id: "",
			row_version: "",
			name: "",
			difficulty_levels: [
				1,
				2,
				3
			],
			sort_order: 10,
			is_enabled: !0
		}), I = ce(de()), L = M(!1), fe = M(!1), pe = M(!1), z = M(!1), he = M(!1), V = M(""), H = M(!1), U = M(""), ge = M(!1), W = v(() => !T(I.id ? "edit" : "add")), G = v(() => pe.value || z.value), J = "", Y;
		async function X(e) {
			Y?.abort(), Y = new AbortController();
			let t = Y;
			if (Object.assign(I, de(), { id: e || "" }), U.value = "", he.value = !1, V.value = "", H.value = !1, L.value = !0, fe.value = !!e, J = JSON.stringify(I), e) try {
				let n = await te("categories", e, t.signal);
				if (t.signal.aborted) return;
				Object.assign(I, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					difficulty_levels: n.difficulty_levels || [
						1,
						2,
						3
					],
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), J = JSON.stringify(I);
			} catch (e) {
				t.signal.aborted || (H.value = !0, U.value = ee(e));
			} finally {
				t.signal.aborted || (fe.value = !1);
			}
		}
		function ve() {
			return G.value ? !1 : !fe.value && !H.value && JSON.stringify(I) !== J ? (ge.value = !0, !1) : (Y?.abort(), !0);
		}
		function ye() {
			G.value || (Y?.abort(), L.value = !1);
		}
		function be() {
			ge.value = !1, L.value = !1;
		}
		async function xe() {
			if (!(W.value || G.value || fe.value || H.value)) {
				if (!I.name.trim() || I.sort_order === null) {
					U.value = "请填写名称和排序";
					return;
				}
				pe.value = !0, U.value = "";
				try {
					await ie("categories", {
						...I,
						id: I.id || void 0,
						row_version: I.id ? I.row_version : void 0
					}), L.value = !1, u.success("保存成功"), await j();
				} catch (e) {
					U.value = ee(e);
				} finally {
					pe.value = !1;
				}
			}
		}
		function Z() {
			!I.id || !T("delete") || G.value || fe.value || H.value || (V.value = "", he.value = !0);
		}
		async function Q() {
			if (!(!he.value || !I.id || !T("delete") || G.value || fe.value || H.value)) {
				z.value = !0, V.value = "";
				try {
					await g({
						id: I.id,
						row_version: I.row_version
					}), he.value = !1, L.value = !1, u.success("分类已删除"), await j(), le.value = Math.min(le.value, Math.max(1, Math.ceil(F.value / ue.value)));
				} catch (e) {
					V.value = ee(e);
				} finally {
					z.value = !1;
				}
			}
		}
		return oe(() => Y?.abort()), (e, t) => (A(), x(ae, null, [
			w(P(re), D(P(se), {
				"auto-refreshable": !1,
				columns: O,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Ye}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": R(({ row: e }) => [w(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [T("add") ? (A(), y(P(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: t[0] ||= (e) => X()
				}, {
					icon: R(() => [w(P(_), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [C("新增" + N(Ye))]),
					_: 1
				})) : b("", !0)]),
				"cell-is_enabled": R(({ row: e }) => [w(P(o), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [C(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": R(({ row: e }) => [w(P(n), {
					size: "sm",
					"icon-only": "",
					title: T("edit") ? `编辑${Ye}` : `${Ye}详情`,
					"aria-label": `编辑${Ye}`,
					onClick: (t) => X(e.id)
				}, {
					default: R(() => [w(P(_), {
						name: T("edit") ? "square-pen" : "panel-right-open",
						size: 15
					}, null, 8, ["name"])]),
					_: 1
				}, 8, [
					"title",
					"aria-label",
					"onClick"
				])]),
				_: 1
			}, 16, ["aria-label"]),
			w(P(d), {
				modelValue: L.value,
				"onUpdate:modelValue": t[4] ||= (e) => L.value = e,
				title: `${I.id ? "编辑" : "新增"}课程${Ye}`,
				width: "620px",
				"close-on-click-modal": !1,
				"before-close": ve
			}, {
				footer: R(() => [
					I.id && T("delete") ? (A(), y(P(n), {
						key: 0,
						variant: "danger",
						disabled: fe.value || H.value || G.value,
						onClick: Z
					}, {
						icon: R(() => [w(P(_), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [t[9] ||= C("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(P(n), {
						disabled: G.value,
						onClick: ye
					}, {
						default: R(() => [...t[10] ||= [C("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					W.value ? b("", !0) : (A(), y(P(n), {
						key: 1,
						variant: "primary",
						loading: pe.value,
						disabled: fe.value || H.value || z.value,
						onClick: xe
					}, {
						default: R(() => [C("保存" + N(Ye))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [S("div", {
					class: "taxonomy-editor",
					"aria-busy": fe.value
				}, [
					fe.value ? (A(), x("div", qe, [w(P(_), {
						name: "loader-circle",
						class: "academy-spin",
						size: 24
					}), S("span", null, "正在读取" + N(Ye) + "...")])) : b("", !0),
					U.value ? (A(), y(P(p), {
						key: 1,
						type: "error",
						closable: !1,
						description: U.value
					}, null, 8, ["description"])) : b("", !0),
					!fe.value && !H.value ? (A(), y(P(f), {
						key: 2,
						model: I,
						"label-position": "top",
						onSubmit: me(xe, ["prevent"])
					}, {
						default: R(() => [w(P(m), {
							label: `${Ye}名称`,
							required: ""
						}, {
							default: R(() => [w(P(h), {
								modelValue: I.name,
								"onUpdate:modelValue": t[1] ||= (e) => I.name = e,
								maxlength: 120,
								disabled: W.value || G.value,
								"aria-label": `${Ye}名称`
							}, null, 8, [
								"modelValue",
								"disabled",
								"aria-label"
							])]),
							_: 1
						}, 8, ["label"]), S("div", Je, [w(P(m), {
							label: "前端排序",
							required: ""
						}, {
							default: R(() => [w(P(a), {
								modelValue: I.sort_order,
								"onUpdate:modelValue": t[2] ||= (e) => I.sort_order = e,
								min: 0,
								max: 2147483647,
								precision: 0,
								disabled: W.value || G.value,
								"aria-label": "前端排序"
							}, null, 8, ["modelValue", "disabled"])]),
							_: 1
						}), w(P(m), { label: "启用状态" }, {
							default: R(() => [w(P(r), {
								modelValue: I.is_enabled,
								"onUpdate:modelValue": t[3] ||= (e) => I.is_enabled = e,
								disabled: W.value || G.value,
								label: "已启用",
								"aria-label": "启用状态"
							}, null, 8, ["modelValue", "disabled"])]),
							_: 1
						})])]),
						_: 1
					}, 8, ["model"])) : b("", !0)
				], 8, Ke)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			w(P(d), {
				modelValue: he.value,
				"onUpdate:modelValue": t[6] ||= (e) => he.value = e,
				title: "删除课程分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !z.value
			}, {
				footer: R(() => [w(P(n), {
					disabled: z.value,
					onClick: t[5] ||= (e) => he.value = !1
				}, {
					default: R(() => [...t[11] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(n), {
					variant: "danger",
					loading: z.value,
					onClick: Q
				}, {
					default: R(() => [...t[12] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [S("p", null, "确认删除分类“" + N(I.name) + "”？有关联课程的分类无法删除。", 1), V.value ? (A(), y(P(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: V.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			w(P(d), {
				modelValue: ge.value,
				"onUpdate:modelValue": t[8] ||= (e) => ge.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [w(P(n), { onClick: t[7] ||= (e) => ge.value = !1 }, {
					default: R(() => [...t[13] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(P(n), {
					variant: "primary",
					onClick: be
				}, {
					default: R(() => [...t[14] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 64));
	}
}), [["__scopeId", "data-v-e36abb56"]]), Ze = { class: "academy-categories" }, Qe = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		return (e, t) => (A(), x("div", Ze, [w(Xe)]));
	}
}), [["__scopeId", "data-v-8f5e5114"]]), $e = [
	"category_ids",
	"cover_url",
	"difficulty_level",
	"sort_order",
	"is_enabled",
	"scheduled_local",
	"title",
	"summary",
	"body_html",
	"seo_description"
];
function et(e) {
	if (/[\x00-\x20\\]/.test(e)) return !1;
	if (e.startsWith("/") && !e.startsWith("//")) return !0;
	try {
		let t = new URL(e);
		return /^https?:\/\//i.test(e) && ["http:", "https:"].includes(t.protocol);
	} catch {
		return !1;
	}
}
function tt(e) {
	return e.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "").replace(/&nbsp;|&#0*(?:160|9|10|13|32);|&#x0*(?:a0|9|a|d|20);/gi, " ").trim().length > 0;
}
function nt(e, t, n, r = Date.now()) {
	let i = {}, a = n !== "draft";
	e.title.trim() || (i.title = "请填写课程标题");
	for (let [t, n, r] of [
		[
			"title",
			255,
			"课程标题"
		],
		[
			"summary",
			1e4,
			"摘要"
		],
		[
			"body_html",
			1e6,
			"正文"
		],
		[
			"seo_description",
			2e3,
			"SEO 描述"
		],
		[
			"cover_url",
			2048,
			"封面地址"
		]
	]) [...e[t]].length > n && (i[t] = `${r}不能超过 ${n} 个字符`);
	(e.sort_order === null || !Number.isInteger(e.sort_order) || e.sort_order < 0 || e.sort_order > 2147483647) && (i.sort_order = "请填写 0–2147483647 之间的整数"), e.cover_url && !et(e.cover_url) && (i.cover_url = "封面地址必须为 HTTP(S) 或站内绝对路径");
	let o = e.category_ids.map((e) => t.find((t) => t.id === e));
	if (a && !o.length ? i.category_ids = "请选择课程分类" : o.some((e) => !e) ? i.category_ids = "所选分类已不可用，请重新选择" : a && o.some((e) => !e?.is_enabled) ? i.category_ids = "发布课程必须选择已启用的分类" : o.length > 50 && (i.category_ids = "最多选择 50 个课程分类"), a && !e.difficulty_level ? i.difficulty_level = "请选择课程难度" : e.difficulty_level !== "" && ![
		1,
		2,
		3
	].includes(e.difficulty_level) && (i.difficulty_level = "请选择有效的课程难度"), a && !tt(e.body_html) && (i.body_html = "请填写课程正文"), n === "scheduled") {
		let t = new Date(e.scheduled_local).getTime();
		(!Number.isFinite(t) || t <= r) && (i.scheduled_local = "计划发布时间必须晚于当前时间");
	}
	return i;
}
var rt = {
	课程标题不能为空: "title",
	"封面地址必须为 HTTP(S) 或站内绝对路径": "cover_url",
	计划发布时间必须晚于当前时间: "scheduled_local",
	发布课程必须选择分类: "category_ids",
	所选分类不存在或不属于当前学院模板: "category_ids",
	"发布课程必须选择已启用的分类，存在已停用分类": "category_ids",
	发布课程需要填写正文和课程难度: "body_html"
};
function it(e) {
	let t = {}, n = [], r = e && typeof e == "object" ? e : {};
	for (let [e, i] of Object.entries(r.errors || {})) {
		let r = e.split(".")[0], a = r === "scheduled_at" ? "scheduled_local" : r;
		for (let r of Array.isArray(i) ? i : [i]) {
			if (typeof r != "string" || !r) continue;
			let i = $e.includes(a) ? a : e === "academy" ? rt[r] : void 0;
			i ? t[i] ||= r : n.push(r);
		}
	}
	return {
		fields: t,
		general: n.join("；") || (Object.keys(t).length ? "" : r.msg || r.message || "操作失败，请稍后重试")
	};
}
//#endregion
//#region src/cms/views/content/academy/courses/CourseEditor.vue?vue&type=script&setup=true&lang.ts
var at = ["aria-busy"], ot = { class: "course-editor__header" }, st = { class: "course-editor__heading" }, ct = { class: "course-editor__commands" }, lt = {
	key: 2,
	class: "course-editor__save-error",
	role: "alert"
}, ut = {
	key: 3,
	class: "course-editor__publish-actions"
}, dt = {
	key: 0,
	class: "course-editor__pending",
	role: "status",
	"aria-live": "polite"
}, ft = {
	key: 0,
	class: "course-editor__loading",
	role: "status"
}, pt = {
	key: 1,
	class: "course-editor__failure"
}, mt = {
	key: 2,
	class: "course-editor__body"
}, ht = { class: "course-editor__settings" }, gt = { class: "course-editor__content" }, _t = ["disabled", "aria-invalid"], vt = ["disabled", "aria-invalid"], yt = {
	class: "course-delete-dialog__icon",
	"aria-hidden": "true"
}, bt = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "CourseEditor",
	props: { courseId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: o }) {
		let { hasPermission: s } = B(), { academyDifficulties: ee, academyError: c, deleteAcademyCourse: l, getAcademyDetail: te, getAcademyMetadata: ne, saveAcademy: re, uploadAcademyCover: g } = Ge(), ae = t, T = o, E = M(!0), D = M(!1), k = M(!1), j = M(""), le = M(!1), ue = M(!1), F = M(!1), I = M(B().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), pe = M(), z = M("draft"), V = M(!1), H = M(!1), U = M(""), ge = v(() => s(["cms_academy:publish"])), W = v(() => !!ae.courseId && s(["cms_academy:delete"]) && (ge.value || z.value === "draft")), G = v(() => !s([`cms_academy:${ae.courseId ? "edit" : "add"}`]) || !ge.value && z.value !== "draft"), K = v(() => G.value || D.value), q = ce({
			id: "",
			row_version: "",
			title: "",
			category_ids: [],
			summary: "",
			body_html: "",
			seo_description: "",
			cover_url: "",
			difficulty_level: 1,
			sort_order: 10,
			is_enabled: !0,
			scheduled_local: ""
		}), _e = M(), J = M(), Y = M(null), X = M(Date.now()), ve = ce({}), ye = M(""), be = Object.fromEntries($e.map((e) => [e, {
			required: e === "title" || e === "category_ids",
			trigger: "submit"
		}])), xe = v(() => Y.value ? nt(q, pe.value?.categories || [], Y.value === "draft" ? "draft" : q.scheduled_local ? "scheduled" : "published", X.value) : {}), Z = v(() => ({
			...ve,
			...xe.value
		})), Q = v(() => Object.keys(Z.value).length);
		for (let e of $e) L(() => q[e], () => {
			delete ve[e], ye.value = "", X.value = Date.now();
		}, { deep: !0 });
		function Se() {
			Z.value.seo_description && J.value?.focus();
		}
		async function $() {
			await O();
			let e = [..._e.value?.querySelectorAll("[data-prop]") || []].find((e) => Z.value[e.dataset.prop]);
			if (!e && Z.value.seo_description) {
				le.value ? Se() : le.value = !0;
				return;
			}
			e && (e.scrollIntoView({
				block: "center",
				behavior: "auto"
			}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
		}
		let Ce = v(() => (pe.value?.categories || []).map((e) => ({
			label: e.name + (e.is_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.is_enabled
		}))), we = "", Te;
		function Ee(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function De() {
			Te?.abort(), Te = new AbortController();
			let e = Te;
			E.value = !0, k.value = !1, j.value = "";
			try {
				if (pe.value = await ne(e.signal, { cms_source_type: "platform" }), ae.courseId) {
					let t = await te("courses", ae.courseId, e.signal);
					if (pe.value = await ne(e.signal, { space_id: String(t.space_id) }), I.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"category_ids",
						"sort_order",
						"is_enabled"
					]) Object.assign(q, { [e]: t[e] });
					q.difficulty_level = t.difficulty_level || "";
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url"
					]) q[e] = t[e] || "";
					q.scheduled_local = t.publish_status === "scheduled" ? Ee(t.scheduled_at) : "", z.value = t.publish_status;
				}
				we = JSON.stringify(q);
			} catch (t) {
				e.signal.aborted || (j.value = c(t), k.value = !0);
			} finally {
				e.signal.aborted || (E.value = !1);
			}
		}
		let Oe = () => !E.value && !k.value && we !== JSON.stringify(q);
		function ke() {
			Oe() ? ue.value = !0 : T("close");
		}
		function Ae() {
			z.value === "draft" ? Me("draft") : F.value = !0;
		}
		function je() {
			F.value = !1, Me("draft");
		}
		async function Me(e) {
			if (K.value || E.value || k.value || V.value) return;
			Y.value = e === "draft" ? "draft" : "publish", X.value = Date.now(), ye.value = "";
			for (let e of $e) delete ve[e];
			if (Q.value) {
				await $();
				return;
			}
			let t = q.scheduled_local ? new Date(q.scheduled_local) : null;
			D.value = !0, j.value = "";
			try {
				await re("courses", {
					...q,
					id: q.id || void 0,
					row_version: q.id ? q.row_version : void 0,
					difficulty_level: q.difficulty_level || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), we = JSON.stringify(q), u.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "课程已发布"), T("saved");
			} catch (e) {
				let t = it(e);
				Object.assign(ve, t.fields), ye.value = t.general;
			} finally {
				D.value = !1;
			}
			Q.value && await $();
		}
		function Ne() {
			U.value = "", H.value = !0;
		}
		async function Pe() {
			if (!(!W.value || E.value || k.value || D.value || V.value)) {
				D.value = !0, U.value = "";
				try {
					await l({
						id: q.id,
						row_version: q.row_version
					}), we = JSON.stringify(q), H.value = !1, u.success("课程已删除"), T("saved");
				} catch (e) {
					U.value = c(e);
				} finally {
					D.value = !1;
				}
			}
		}
		function Fe(e) {
			ve.cover_url = c(e);
		}
		function Ie() {
			delete ve.cover_url;
		}
		let Le = (e) => {
			Oe() && (e.preventDefault(), e.returnValue = "");
		};
		return he(() => !D.value && !V.value && (!Oe() || window.confirm("课程有未保存的修改，确定离开？"))), se(() => {
			De(), window.addEventListener("beforeunload", Le);
		}), oe(() => {
			Te?.abort(), window.removeEventListener("beforeunload", Le);
		}), (o, s) => (A(), x("section", {
			ref_key: "editorRoot",
			ref: _e,
			class: "course-editor",
			"aria-busy": E.value || D.value
		}, [
			S("header", ot, [
				w(P(n), {
					"icon-only": "",
					title: "返回课程列表",
					"aria-label": "返回课程列表",
					disabled: D.value || V.value,
					onClick: ke
				}, {
					default: R(() => [w(P(_), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				S("div", st, [S("h2", null, N(t.courseId ? "编辑课程" : "新增课程"), 1), S("span", null, N(pe.value?.source_locale || "zh-CN") + " · " + N(I.value), 1)]),
				S("div", ct, [
					W.value ? (A(), y(P(n), {
						key: 0,
						variant: "danger",
						size: "sm",
						disabled: E.value || k.value || D.value || V.value,
						onClick: Ne
					}, {
						default: R(() => [...s[26] ||= [C("删除课程", -1)]]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(P(n), {
						size: "sm",
						disabled: E.value || k.value,
						onClick: s[0] ||= (e) => le.value = !0
					}, {
						icon: R(() => [w(P(_), {
							name: "search",
							size: 14
						})]),
						default: R(() => [s[27] ||= C("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					G.value ? b("", !0) : (A(), y(P(n), {
						key: 1,
						size: "sm",
						disabled: E.value || k.value || D.value || V.value,
						onClick: Ae
					}, {
						icon: R(() => [w(P(_), {
							name: "save",
							size: 14
						})]),
						default: R(() => [s[28] ||= C("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					ye.value ? (A(), x("span", lt, N(ye.value), 1)) : b("", !0),
					G.value ? b("", !0) : (A(), x("div", ut, [Q.value ? (A(), x("span", dt, "还有 " + N(Q.value) + " 项待完善", 1)) : b("", !0), ge.value ? (A(), y(P(n), {
						key: 1,
						variant: "primary",
						size: "sm",
						disabled: E.value || k.value || V.value,
						loading: D.value,
						onClick: s[1] ||= (e) => Me(q.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [w(P(_), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [C(N(q.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : b("", !0)]))
				])
			]),
			E.value ? (A(), x("div", ft, [w(P(_), {
				name: "loader-circle",
				class: "academy-spin",
				size: 28
			}), s[29] ||= S("span", null, "正在读取课程资料...", -1)])) : k.value ? (A(), x("div", pt, [w(P(p), {
				type: "error",
				description: j.value,
				closable: !1
			}, null, 8, ["description"]), w(P(n), { onClick: De }, {
				default: R(() => [...s[30] ||= [C("重新加载", -1)]]),
				_: 1
			})])) : (A(), x("div", mt, [S("aside", ht, [w(P(f), {
				model: q,
				rules: P(be),
				"label-position": "top",
				onSubmit: s[10] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					w(P(m), {
						label: "课程分类",
						prop: "category_ids",
						error: Z.value.category_ids,
						required: ""
					}, {
						default: R(() => [w(P(ie), {
							modelValue: q.category_ids,
							"onUpdate:modelValue": s[2] ||= (e) => q.category_ids = e,
							options: Ce.value,
							multiple: "",
							filterable: "",
							clearable: "",
							disabled: K.value,
							"aria-label": "课程分类"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					s[31] ||= S("h3", null, "课程设置", -1),
					w(P(m), {
						label: "课程封面",
						prop: "cover_url",
						error: Z.value.cover_url
					}, {
						default: R(() => [w(e, {
							modelValue: q.cover_url,
							"onUpdate:modelValue": s[3] ||= (e) => q.cover_url = e,
							label: "课程封面",
							disabled: K.value,
							upload: P(g),
							onBusyChange: s[4] ||= (e) => V.value = e,
							onStart: s[5] ||= (e) => j.value = "",
							onError: Fe,
							onSuccess: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "课程难度",
						prop: "difficulty_level",
						error: Z.value.difficulty_level
					}, {
						default: R(() => [w(P(ie), {
							modelValue: q.difficulty_level,
							"onUpdate:modelValue": s[6] ||= (e) => q.difficulty_level = e,
							options: P(ee),
							disabled: K.value,
							"aria-label": "课程难度"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "前端排序",
						prop: "sort_order",
						error: Z.value.sort_order
					}, {
						default: R(() => [w(P(a), {
							modelValue: q.sort_order,
							"onUpdate:modelValue": s[7] ||= (e) => q.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: K.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					s[32] ||= S("h3", null, "发布设置", -1),
					w(P(m), {
						label: "启用状态",
						prop: "is_enabled",
						error: Z.value.is_enabled
					}, {
						default: R(() => [w(P(r), {
							modelValue: q.is_enabled,
							"onUpdate:modelValue": s[8] ||= (e) => q.is_enabled = e,
							disabled: K.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "计划发布时间",
						prop: "scheduled_local",
						error: Z.value.scheduled_local
					}, {
						default: R(() => [w(P(h), {
							modelValue: q.scheduled_local,
							"onUpdate:modelValue": s[9] ||= (e) => q.scheduled_local = e,
							type: "datetime-local",
							disabled: K.value || !ge.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])]), S("main", gt, [w(P(f), {
				model: q,
				rules: P(be),
				"label-position": "top",
				onSubmit: s[14] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					w(P(m), {
						label: "标题",
						prop: "title",
						error: Z.value.title,
						required: ""
					}, {
						default: R(() => [w(P(h), {
							modelValue: q.title,
							"onUpdate:modelValue": s[11] ||= (e) => q.title = e,
							maxlength: 255,
							disabled: K.value,
							placeholder: "输入课程标题",
							"aria-label": "课程标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "摘要",
						prop: "summary",
						error: Z.value.summary
					}, {
						default: R(() => [fe(S("textarea", {
							"onUpdate:modelValue": s[12] ||= (e) => q.summary = e,
							class: "course-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: K.value,
							"aria-invalid": !!Z.value.summary,
							"aria-label": "课程摘要"
						}, null, 8, _t), [[de, q.summary]])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "正文",
						prop: "body_html",
						error: Z.value.body_html
					}, {
						default: R(() => [w(P(i), {
							modelValue: q.body_html,
							"onUpdate:modelValue": s[13] ||= (e) => q.body_html = e,
							readonly: G.value,
							disabled: D.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "课程正文"
						}, {
							"image-upload": R(({ url: t, setUrl: n, setBusy: r }) => [w(e, {
								label: "正文图片",
								"model-value": t,
								upload: P(g),
								"onUpdate:modelValue": n,
								onBusyChange: r,
								onError: Fe
							}, null, 8, [
								"model-value",
								"upload",
								"onUpdate:modelValue",
								"onBusyChange"
							])]),
							_: 1
						}, 8, [
							"modelValue",
							"readonly",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])])])),
			w(P(d), {
				modelValue: le.value,
				"onUpdate:modelValue": s[18] ||= (e) => le.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1,
				onOpened: Se
			}, {
				footer: R(() => [w(P(n), {
					variant: "primary",
					onClick: s[17] ||= (e) => le.value = !1
				}, {
					default: R(() => [...s[33] ||= [C("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [w(P(f), {
					model: q,
					rules: P(be),
					"label-position": "top",
					onSubmit: s[16] ||= me(() => {}, ["prevent"])
				}, {
					default: R(() => [w(P(m), {
						label: "SEO 描述",
						prop: "seo_description",
						error: Z.value.seo_description
					}, {
						default: R(() => [fe(S("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": s[15] ||= (e) => q.seo_description = e,
							class: "course-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: K.value,
							"aria-invalid": !!Z.value.seo_description,
							"aria-label": "SEO 描述"
						}, null, 8, vt), [[de, q.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			w(P(d), {
				modelValue: H.value,
				"onUpdate:modelValue": s[20] ||= (e) => H.value = e,
				title: "确认删除",
				subtitle: `操作对象：${q.title || "未命名课程"}`,
				width: "460px",
				"panel-class": "course-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !D.value
			}, {
				"header-actions": R(() => [S("span", yt, [w(P(_), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [w(P(n), {
					disabled: D.value,
					onClick: s[19] ||= (e) => H.value = !1
				}, {
					default: R(() => [...s[34] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(n), {
					variant: "warning",
					loading: D.value,
					onClick: Pe
				}, {
					default: R(() => [...s[35] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [w(P(p), {
					class: "course-delete-dialog__notice",
					type: "warning",
					closable: !1,
					"show-icon": !1,
					description: "确定删除这门课程吗？删除后将不再展示，请谨慎操作。"
				}), U.value ? (A(), y(P(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: U.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, [
				"modelValue",
				"subtitle",
				"before-close"
			]),
			w(P(d), {
				modelValue: ue.value,
				"onUpdate:modelValue": s[23] ||= (e) => ue.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [w(P(n), { onClick: s[21] ||= (e) => ue.value = !1 }, {
					default: R(() => [...s[36] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(P(n), {
					variant: "primary",
					onClick: s[22] ||= (e) => T("close")
				}, {
					default: R(() => [...s[37] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			w(P(d), {
				modelValue: F.value,
				"onUpdate:modelValue": s[25] ||= (e) => F.value = e,
				title: "将课程转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [w(P(n), { onClick: s[24] ||= (e) => F.value = !1 }, {
					default: R(() => [...s[38] ||= [C("取消", -1)]]),
					_: 1
				}), w(P(n), {
					variant: "primary",
					onClick: je
				}, {
					default: R(() => [...s[39] ||= [C("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, at));
	}
}), [["__scopeId", "data-v-5463d19a"]]), xt = { class: "academy-courses" }, St = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = B(), { formatDateTime: r } = B(), { academyDifficulties: i, academyPublishStates: a, getAcademyList: s, getAcademyMetadata: ee } = Ge(), c = M(!1), l = M(), u = (e) => t([`cms_academy:${e}`]), d = M(), f = q(ee, (e) => {
			d.value = e;
		}), te = [
			...K(),
			{
				key: "code",
				dataIndex: "code",
				title: "课程ID",
				width: 220
			},
			{
				key: "title",
				dataIndex: "title",
				title: "课程标题",
				width: 240,
				hideable: !1
			},
			{
				key: "categories",
				dataIndex: "categories",
				title: "课程分类",
				width: 220,
				formatter: (e) => (e || []).map((e) => e.name).join(" / ") || "-"
			},
			{
				key: "difficulty_level",
				dataIndex: "difficulty_level",
				title: "难度",
				width: 70,
				formatter: (e) => i.find((t) => t.value === Number(e))?.label || "-"
			},
			{
				key: "sort_order",
				dataIndex: "sort_order",
				title: "排序",
				width: 70
			},
			{
				key: "publish_status",
				title: "发布状态",
				width: 100
			},
			{
				key: "is_enabled",
				title: "状态",
				width: 85
			},
			{
				key: "publish_time",
				title: "发布时间",
				width: 180
			},
			{
				key: "updated_by_name",
				dataIndex: "updated_by_name",
				title: "最后编辑人",
				width: 130
			},
			{
				key: "updated_at",
				dataIndex: "updated_at",
				title: "更新时间",
				width: 180,
				formatter: r
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], p = v(() => [
			...f.fields,
			{
				key: "code",
				label: "课程ID",
				type: "keyword",
				width: 170,
				placeholder: "课程ID",
				defaultValue: ""
			},
			{
				key: "keyword",
				label: "课程标题",
				type: "keyword",
				width: 200,
				placeholder: "课程标题",
				defaultValue: ""
			},
			{
				key: "category_id",
				label: "课程分类",
				type: "select",
				width: 160,
				defaultValue: "",
				options: [{
					label: "全部",
					value: ""
				}, ...(d.value?.categories || []).map((e) => ({
					label: e.name,
					value: e.id
				}))]
			},
			{
				key: "difficulty_level",
				label: "难度",
				type: "select",
				width: 120,
				defaultValue: "",
				options: [{
					label: "全部",
					value: ""
				}, ...i]
			},
			{
				key: "publish_status",
				label: "发布状态",
				type: "select",
				width: 150,
				defaultValue: "",
				options: [{
					label: "全部",
					value: ""
				}, ...a]
			},
			{
				key: "is_enabled",
				label: "状态",
				type: "select",
				width: 130,
				defaultValue: "",
				options: [
					{
						label: "全部",
						value: ""
					},
					{
						label: "已启用",
						value: "1"
					},
					{
						label: "已停用",
						value: "0"
					}
				]
			},
			{
				key: "publish_range",
				label: "发布时间",
				type: "date-range",
				width: 240,
				defaultValue: null
			}
		]), { proTableBindings: ie, reload: m } = f.bindTable(ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: p,
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([e, t]) => e !== "publish_range" && t !== "" && t != null)), a = e.publish_range;
				Array.isArray(a) && a.length === 2 && (i.published_from = (/* @__PURE__ */ new Date(`${a[0]}T00:00:00`)).toISOString(), i.published_to = (/* @__PURE__ */ new Date(`${a[1]}T23:59:59.999`)).toISOString());
				let o = await s("courses", {
					...i,
					page_no: t,
					page_size: n
				}, r);
				return {
					rows: o.lists,
					total: o.count
				};
			}
		})), h = f.loadMetadata;
		function g(e) {
			l.value = e, c.value = !0;
		}
		function ae() {
			c.value = !1, m(), h();
		}
		return (e, t) => (A(), x("div", xt, [c.value ? (A(), y(bt, {
			key: 0,
			"course-id": l.value,
			onClose: t[0] ||= (e) => c.value = !1,
			onSaved: ae
		}, null, 8, ["course-id"])) : b("", !0), fe(w(P(re), D(P(ie), {
			"auto-refreshable": !1,
			columns: te,
			"row-key": "id",
			"fill-height": "",
			"columns-configurable": "",
			"show-cell-title": "",
			"aria-label": "课程列表",
			"page-sizes": [
				20,
				50,
				100
			]
		}), {
			"cell-cms_source_type": R(({ row: e }) => [w(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": R(() => [u("add") ? (A(), y(P(n), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => g()
			}, {
				icon: R(() => [w(P(_), {
					name: "plus",
					size: 14
				})]),
				default: R(() => [t[2] ||= C("新增课程", -1)]),
				_: 1
			})) : b("", !0)]),
			"cell-publish_status": R(({ row: e }) => [w(P(o), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: R(() => [C(N(P(a).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": R(({ row: e }) => [w(P(o), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: R(() => [C(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": R(({ row: e }) => [C(N(P(r)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": R(({ row: e }) => [w(P(n), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑课程" : "课程详情",
				"aria-label": u("edit") ? "编辑课程" : "课程详情",
				onClick: (t) => g(e.id)
			}, {
				default: R(() => [w(P(_), {
					name: u("edit") ? "square-pen" : "panel-right-open",
					size: 15
				}, null, 8, ["name"])]),
				_: 1
			}, 8, [
				"title",
				"aria-label",
				"onClick"
			])]),
			_: 1
		}, 16), [[I, !c.value]])]));
	}
}), [["__scopeId", "data-v-8efe9924"]]);
//#endregion
//#region src/cms/api/content/help.ts
function Ct() {
	let e = B().request, t = "/cms/help", n = (n, r = {}) => e.get({
		url: `${t}/metadata`,
		params: r,
		signal: n
	}), r = (n, r, i) => e.get({
		url: `${t}/${n}`,
		params: r,
		signal: i
	}), i = (n, r, i) => e.get({
		url: `${t}/${n}/detail`,
		params: { id: r },
		signal: i
	}), a = (n, r) => e.post({
		url: `${t}/${n}/${r.id ? "edit" : "create"}`,
		params: r
	}, { isOpenRetry: !1 }), o = (n, r, i) => e.post({
		url: `${t}/${n}/delete`,
		params: {
			id: r,
			row_version: i
		}
	}, { isOpenRetry: !1 }), s = l(e, "/cms/help/categories/upload"), ee = l(e, "/cms/help/upload"), c = [
		{
			label: "草稿",
			value: "draft"
		},
		{
			label: "定时发布",
			value: "scheduled"
		},
		{
			label: "已发布",
			value: "published"
		}
	];
	function u(e, t) {
		let n = e?.categories.find((e) => e.id === String(t));
		if (!n) return "—";
		let r = e?.categories.find((e) => e.id === n.parent_id);
		return r ? `${r.name} / ${n.name}` : n.name;
	}
	function d(e) {
		if (e && typeof e == "object") {
			let t = e;
			return Object.values(t.errors || {}).flat()[0] || t.msg || t.message || "操作失败，请稍后重试";
		}
		return "操作失败，请稍后重试";
	}
	return {
		getHelpMetadata: n,
		getHelpList: r,
		getHelpDetail: i,
		saveHelp: a,
		deleteHelp: o,
		uploadHelpCategoryImage: s,
		uploadHelpCover: ee,
		helpPublishStates: c,
		helpCategoryLabel: u,
		helpError: d
	};
}
//#endregion
//#region src/cms/views/content/help/EnabledToggle.vue?vue&type=script&setup=true&lang.ts
var wt = ["aria-checked", "disabled"], Tt = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "EnabledToggle",
	props: {
		modelValue: { type: Boolean },
		disabled: { type: Boolean }
	},
	emits: ["update:modelValue"],
	setup(e) {
		return (t, n) => (A(), x("button", {
			type: "button",
			role: "switch",
			class: k(["help-toggle", { "is-on": e.modelValue }]),
			"aria-checked": e.modelValue,
			"aria-label": "启用状态",
			disabled: e.disabled,
			onClick: n[0] ||= (n) => t.$emit("update:modelValue", !e.modelValue)
		}, [n[1] ||= S("span", {
			class: "help-toggle__track",
			"aria-hidden": "true"
		}, [S("span")], -1), S("span", null, N(e.modelValue ? "已启用" : "已停用"), 1)], 10, wt));
	}
}), [["__scopeId", "data-v-5cfe8693"]]), Et = { class: "help-categories" }, Dt = ["aria-busy"], Ot = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, kt = { class: "taxonomy-editor__field" }, At = { class: "taxonomy-editor__row" }, jt = "分类", Mt = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(t) {
		let { helpError: r, deleteHelp: i, getHelpMetadata: s, getHelpList: ee, getHelpDetail: c, saveHelp: l, uploadHelpCategoryImage: te } = Ct(), { hasPermission: g } = B(), { formatDateTime: ae } = B(), T = (e) => g([`cms_help_category:${e}`]), E = M(), O = M(), k = q(s, (e) => {
			E.value = e;
		}), se = [
			{
				key: "name",
				dataIndex: "name",
				title: "分类名称",
				width: 210,
				hideable: !1
			},
			...K(),
			{
				key: "code",
				dataIndex: "code",
				title: "分类ID",
				width: 220
			},
			{
				key: "parent_id",
				dataIndex: "parent_id",
				title: "父分类",
				width: 180,
				formatter: (e) => E.value?.categories.find((t) => t.id === e)?.name || "一级分类"
			},
			{
				key: "help_count",
				dataIndex: "help_count",
				title: "文章数量",
				width: 100
			},
			{
				key: "sort_order",
				dataIndex: "sort_order",
				title: "排序",
				width: 80
			},
			{
				key: "is_enabled",
				title: "状态",
				width: 100
			},
			{
				key: "updated_by_name",
				dataIndex: "updated_by_name",
				title: "最后编辑人",
				width: 150
			},
			{
				key: "updated_at",
				dataIndex: "updated_at",
				title: "更新时间",
				width: 180,
				formatter: ae
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], j = v(() => [
			...k.fields,
			{
				key: "code",
				label: "分类ID",
				type: "keyword",
				width: 200,
				placeholder: "分类ID",
				defaultValue: ""
			},
			{
				key: "keyword",
				label: "分类名称",
				type: "keyword",
				width: 200,
				placeholder: "分类名称",
				defaultValue: ""
			},
			{
				key: "parent_id",
				label: "父级分类",
				type: "select",
				width: 180,
				defaultValue: "",
				options: [{
					label: "全部",
					value: ""
				}, ...(E.value?.categories || []).filter((e) => !e.parent_id).map((e) => ({
					label: e.name,
					value: e.id
				}))]
			},
			{
				key: "is_enabled",
				label: "状态",
				type: "segmented",
				width: 200,
				defaultValue: "",
				options: [
					{
						label: "全部",
						value: ""
					},
					{
						label: "已启用",
						value: "1"
					},
					{
						label: "已停用",
						value: "0"
					}
				]
			}
		]), { proTableBindings: le, rows: ue, reload: F } = k.bindTable(ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: j,
			request: async ({ filters: e, signal: t, reason: n }) => {
				let r = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), i = await W((e, n) => ee("categories", {
					...r,
					page_no: e,
					page_size: n
				}, t), t);
				return !t.aborted && (n === "query" || n === "reset") && (I.value = Object.keys(r).length ? new Set(i.rows.filter((e) => e.parent_id != null).map((e) => String(e.parent_id))) : /* @__PURE__ */ new Set()), i;
			}
		})), { visibleRows: de, expanded: I, groups: L, allExpanded: fe, toggle: pe, toggleAll: z } = G(ue), he = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			image_url: "",
			image_media_id: null,
			sort_order: 10,
			is_enabled: !0
		}), V = ce(he()), H = M(!1), U = M(!1), J = M(!1), Y = M(!1), X = M(!1), ve = M(!1), ye = M(""), be = M(!1), xe = M(""), Z = v(() => !T(V.id ? "edit" : "add")), Q = v(() => Y.value || X.value || H.value), Se;
		async function $(e) {
			Se?.abort(), Se = new AbortController();
			let t = Se;
			Object.assign(V, he(), { id: e || "" }), xe.value = "", ve.value = !1, ye.value = "", be.value = !1, U.value = !0, J.value = !0;
			try {
				if (O.value = await s(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await c("categories", e, t.signal);
				if (O.value = await s(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(V, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					image_url: n.image_url || "",
					image_media_id: n.image_media_id || null,
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				});
			} catch (e) {
				t.signal.aborted || (be.value = !0, xe.value = r(e));
			} finally {
				t.signal.aborted || (J.value = !1);
			}
		}
		function Ce() {
			return Q.value ? !1 : (Se?.abort(), !0);
		}
		function we() {
			Ce() && (U.value = !1);
		}
		async function Te() {
			if (!(Z.value || Q.value || J.value || be.value)) {
				if (!V.name.trim() || V.sort_order === null) {
					xe.value = "请填写分类名称和排序";
					return;
				}
				Y.value = !0, xe.value = "";
				try {
					await l("categories", {
						name: V.name,
						parent_id: V.parent_id || null,
						image_media_id: V.image_media_id,
						sort_order: V.sort_order,
						is_enabled: V.is_enabled,
						id: V.id || void 0,
						row_version: V.id ? V.row_version : void 0
					}), U.value = !1, u.success("保存成功"), await Promise.all([F(), ke()]);
				} catch (e) {
					xe.value = r(e);
				} finally {
					Y.value = !1;
				}
			}
		}
		function Ee() {
			!V.id || !T("delete") || Q.value || J.value || be.value || (ye.value = "", ve.value = !0);
		}
		async function De() {
			if (!(!ve.value || !V.id || !T("delete") || Q.value || J.value || be.value)) {
				X.value = !0, ye.value = "";
				try {
					await i("categories", V.id, V.row_version), ve.value = !1, U.value = !1, u.success("分类已删除"), await Promise.all([F(), ke()]);
				} catch (e) {
					ye.value = r(e);
				} finally {
					X.value = !1;
				}
			}
		}
		let Oe = v(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(O.value?.categories || []).filter((e) => !e.parent_id && e.id !== V.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), ke = k.loadMetadata;
		return oe(() => {
			Se?.abort();
		}), (t, i) => (A(), x("div", Et, [
			w(P(re), D(P(le), {
				"auto-refreshable": !1,
				columns: se,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${jt}管理`,
				data: P(de),
				"show-pagination": !1
			}), {
				"cell-cms_source_type": R(({ row: e }) => [w(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [T("add") ? (A(), y(P(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: i[0] ||= (e) => $()
				}, {
					icon: R(() => [w(P(_), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [C("新增" + N(jt))]),
					_: 1
				})) : b("", !0), w(P(n), {
					size: "sm",
					disabled: !P(L).children.size,
					onClick: P(z)
				}, {
					icon: R(() => [w(P(_), {
						name: P(fe) ? "chevron-up" : "chevron-down",
						size: 14
					}, null, 8, ["name"])]),
					default: R(() => [C(" " + N(P(fe) ? "全部收起" : "全部展开"), 1)]),
					_: 1
				}, 8, ["disabled", "onClick"])]),
				"cell-name": R(({ row: e }) => [w(ge, {
					name: e.name,
					child: e.parent_id != null,
					branch: P(L).children.has(e.id),
					expanded: P(I).has(e.id),
					onToggle: (t) => P(pe)(e.id)
				}, null, 8, [
					"name",
					"child",
					"branch",
					"expanded",
					"onToggle"
				])]),
				"cell-is_enabled": R(({ row: e }) => [w(P(o), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [C(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": R(({ row: e }) => [w(P(n), {
					size: "sm",
					"icon-only": "",
					title: T("edit") ? `编辑${jt}` : `${jt}详情`,
					"aria-label": `编辑${jt}`,
					onClick: (t) => $(e.id)
				}, {
					default: R(() => [w(P(_), {
						name: T("edit") ? "square-pen" : "panel-right-open",
						size: 15
					}, null, 8, ["name"])]),
					_: 1
				}, 8, [
					"title",
					"aria-label",
					"onClick"
				])]),
				_: 1
			}, 16, ["aria-label", "data"]),
			w(P(d), {
				modelValue: U.value,
				"onUpdate:modelValue": i[10] ||= (e) => U.value = e,
				title: `${V.id ? "编辑" : "新增"}帮助${jt}`,
				width: "680px",
				subtitle: "帮助分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Ce
			}, {
				footer: R(() => [
					V.id && T("delete") ? (A(), y(P(n), {
						key: 0,
						variant: "danger",
						disabled: J.value || be.value || Q.value,
						onClick: Ee
					}, {
						icon: R(() => [w(P(_), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [i[14] ||= C("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(P(n), {
						disabled: Q.value,
						onClick: we
					}, {
						default: R(() => [...i[15] ||= [C("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Z.value ? b("", !0) : (A(), y(P(n), {
						key: 1,
						variant: "primary",
						loading: Y.value,
						disabled: J.value || be.value || X.value || H.value,
						onClick: Te
					}, {
						default: R(() => [C("保存" + N(jt))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [S("div", {
					class: "taxonomy-editor",
					"aria-busy": J.value
				}, [
					J.value ? (A(), x("div", Ot, [w(P(_), {
						name: "loader-circle",
						class: "help-spin",
						size: 24
					}), S("span", null, "正在读取" + N(jt) + "...")])) : b("", !0),
					xe.value ? (A(), y(P(p), {
						key: 1,
						type: "error",
						closable: !1,
						description: xe.value
					}, null, 8, ["description"])) : b("", !0),
					!J.value && !be.value ? (A(), y(P(f), {
						key: 2,
						model: V,
						"label-position": "top",
						onSubmit: me(Te, ["prevent"])
					}, {
						default: R(() => [
							V.id ? (A(), y(P(m), {
								key: 0,
								label: "分类ID"
							}, {
								default: R(() => [w(P(h), {
									"model-value": V.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : b("", !0),
							w(P(m), {
								label: `${jt}名称`,
								required: ""
							}, {
								default: R(() => [w(P(h), {
									modelValue: V.name,
									"onUpdate:modelValue": i[1] ||= (e) => V.name = e,
									maxlength: 120,
									disabled: Z.value || Q.value,
									"aria-label": `${jt}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							w(P(m), { label: "父分类" }, {
								default: R(() => [S("div", kt, [w(P(ie), {
									modelValue: V.parent_id,
									"onUpdate:modelValue": i[2] ||= (e) => V.parent_id = e,
									options: Oe.value,
									disabled: Z.value || Q.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), i[13] ||= S("p", { class: "help-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类文章。 ", -1)])]),
								_: 1
							}),
							w(P(m), { label: "分类图片" }, {
								default: R(() => [w(e, {
									class: "taxonomy-editor__image",
									modelValue: V.image_url,
									"onUpdate:modelValue": i[3] ||= (e) => V.image_url = e,
									label: "分类图片",
									upload: P(te),
									disabled: Z.value || Q.value,
									"onUpdate:mediaId": i[4] ||= (e) => V.image_media_id = e,
									onBusyChange: i[5] ||= (e) => H.value = e,
									onStart: i[6] ||= (e) => xe.value = "",
									onError: i[7] ||= (e) => xe.value = P(r)(e)
								}, null, 8, [
									"modelValue",
									"upload",
									"disabled"
								])]),
								_: 1
							}),
							S("div", At, [w(P(m), {
								label: "前端排序",
								required: ""
							}, {
								default: R(() => [w(P(a), {
									modelValue: V.sort_order,
									"onUpdate:modelValue": i[8] ||= (e) => V.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Z.value || Q.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), w(P(m), { label: "启用状态" }, {
								default: R(() => [w(Tt, {
									modelValue: V.is_enabled,
									"onUpdate:modelValue": i[9] ||= (e) => V.is_enabled = e,
									disabled: Z.value || Q.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : b("", !0)
				], 8, Dt)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			w(P(d), {
				modelValue: ve.value,
				"onUpdate:modelValue": i[12] ||= (e) => ve.value = e,
				title: "删除帮助分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !X.value
			}, {
				footer: R(() => [w(P(n), {
					disabled: X.value,
					onClick: i[11] ||= (e) => ve.value = !1
				}, {
					default: R(() => [...i[16] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(n), {
					variant: "danger",
					loading: X.value,
					onClick: De
				}, {
					default: R(() => [...i[17] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [S("p", null, "确认删除分类“" + N(V.name) + "”？有关联文章或子分类的分类无法删除。", 1), ye.value ? (A(), y(P(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: ye.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"])
		]));
	}
}), [["__scopeId", "data-v-52a5768d"]]), Nt = ["aria-busy"], Pt = { class: "article-editor__header" }, Ft = { class: "article-editor__heading" }, It = { class: "article-editor__commands" }, Lt = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, Rt = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, zt = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, Bt = {
	key: 1,
	class: "article-editor__failure"
}, Vt = {
	key: 0,
	class: "article-editor__error"
}, Ht = { class: "article-editor__body" }, Ut = { class: "article-editor__settings" }, Wt = { class: "article-editor__related" }, Gt = { class: "article-editor__content" }, Kt = ["aria-invalid", "disabled"], qt = ["aria-invalid", "disabled"], Jt = {
	class: "help-delete-dialog__icon",
	"aria-hidden": "true"
}, Yt = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: r }) {
		let { helpError: o, helpCategoryLabel: s, deleteHelp: ee, getHelpDetail: c, getHelpMetadata: l, getHelpList: te, saveHelp: ne, uploadHelpCover: re } = Ct(), { hasPermission: g } = B(), T = t, E = r, D = M(!0), O = M(!1), k = M(!1), j = M(""), le = M(!1), ue = M(!1), F = M(!1), I = M(!1), L = M(B().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), z = M(), V = M("draft"), H = M(!1), U = v(() => g(["cms_help:publish"])), ge = v(() => !g([`cms_help:${T.articleId ? "edit" : "add"}`]) || !U.value && V.value !== "draft"), W = v(() => g(["cms_help:delete"]) && (U.value || V.value === "draft"));
		async function G() {
			if (!(!W.value || O.value || D.value || k.value)) {
				O.value = !0, j.value = "";
				try {
					await ee("articles", q.id, q.row_version), Ae = JSON.stringify(q), u.success("文章已删除"), E("saved");
				} catch (e) {
					j.value = o(e), I.value = !1;
				} finally {
					O.value = !1;
				}
			}
		}
		let K = v(() => ge.value || O.value), q = ce({
			id: "",
			row_version: "",
			title: "",
			category_id: "",
			summary: "",
			body_html: "",
			seo_description: "",
			cover_url: "",
			content_source: "",
			author_name: "",
			sort_order: 10,
			is_enabled: !0,
			search_keywords: "",
			helpful_enabled: !0,
			related_content_ids: [],
			scheduled_local: ""
		}), { editorRoot: _e, seoInput: J, fieldRules: Y, fieldErrors: X, pendingCount: ve, saveError: ye, validateSave: be, setSaveFailure: xe, focusFirstError: Z, focusSeoError: Q } = Ee(q, () => z.value?.categories || [], "help", le), Se = M(""), $ = M(!1), Ce = M([]), we = v(() => Ce.value.filter((e) => e.id !== T.articleId).map((e) => ({
			label: `${e.title} · ${e.code}`,
			value: e.id
		})));
		async function Te() {
			if (!(K.value || $.value)) {
				$.value = !0;
				try {
					let e = await te("articles", {
						keyword: Se.value,
						page_size: 100
					}, je?.signal), t = Ce.value.filter((e) => q.related_content_ids.includes(e.id));
					Ce.value = [...new Map([...t, ...e.lists].map((e) => [e.id, e])).values()];
				} catch (e) {
					je?.signal.aborted || (j.value = o(e));
				} finally {
					$.value = !1;
				}
			}
		}
		let De = v(() => (z.value?.categories || []).filter((e) => e.parent_id != null).map((e) => ({
			label: s(z.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), Oe = v(() => z.value?.categories.find((e) => e.id === q.category_id && e.parent_id == null)), ke = v({
			get: () => Oe.value ? "" : q.category_id,
			set: (e) => {
				q.category_id = e;
			}
		}), Ae = "", je;
		function Me(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Ne() {
			je?.abort(), je = new AbortController();
			let e = je;
			D.value = !0, k.value = !1, j.value = "";
			try {
				if (z.value = await l(e.signal, { cms_source_type: "platform" }), T.articleId) {
					let t = await c("articles", T.articleId, e.signal);
					if (z.value = await l(e.signal, { space_id: String(t.space_id) }), L.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"sort_order",
						"is_enabled"
					]) Object.assign(q, { [e]: t[e] });
					q.category_id = t.category_id || "", q.search_keywords = t.search_keywords || "", q.helpful_enabled = t.helpful_enabled ?? !0, q.related_content_ids = t.related_content_ids || [], Ce.value = t.related_articles || [];
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url",
						"content_source",
						"author_name"
					]) q[e] = t[e] || "";
					q.scheduled_local = t.publish_status === "scheduled" ? Me(t.scheduled_at) : "", V.value = t.publish_status;
				}
				Ae = JSON.stringify(q);
			} catch (t) {
				e.signal.aborted || (j.value = o(t), k.value = !0);
			} finally {
				e.signal.aborted || (D.value = !1);
			}
		}
		let Pe = () => !D.value && !k.value && Ae !== JSON.stringify(q);
		function Fe() {
			Pe() ? ue.value = !0 : E("close");
		}
		function Ie() {
			V.value === "draft" ? Re("draft") : F.value = !0;
		}
		function Le() {
			F.value = !1, Re("draft");
		}
		async function Re(e) {
			if (K.value || D.value || k.value || H.value || (j.value = "", !await be(e))) return;
			let t = q.scheduled_local ? new Date(q.scheduled_local) : null;
			O.value = !0, j.value = "";
			try {
				await ne("articles", {
					...q,
					id: q.id || void 0,
					row_version: q.id ? q.row_version : void 0,
					category_id: q.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), Ae = JSON.stringify(q), u.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "文章已发布"), E("saved");
			} catch (e) {
				xe(e);
			} finally {
				O.value = !1;
			}
			ve.value && await Z();
		}
		function ze(e) {
			j.value = o(e);
		}
		let Be = (e) => {
			Pe() && (e.preventDefault(), e.returnValue = "");
		};
		return he(() => !O.value && !H.value && (!Pe() || window.confirm("文章有未保存的修改，确定离开？"))), se(() => {
			Ne(), window.addEventListener("beforeunload", Be);
		}), oe(() => {
			je?.abort(), window.removeEventListener("beforeunload", Be);
		}), (r, o) => (A(), x("section", {
			ref_key: "editorRoot",
			ref: _e,
			class: "article-editor",
			"aria-busy": D.value || O.value
		}, [
			S("header", Pt, [
				w(P(n), {
					"icon-only": "",
					title: "返回文章列表",
					"aria-label": "返回文章列表",
					disabled: O.value || H.value,
					onClick: Fe
				}, {
					default: R(() => [w(P(_), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				S("div", Ft, [S("h2", null, N(t.articleId ? "编辑文章" : "新增文章"), 1), S("span", null, N(z.value?.source_locale || "zh-CN") + " · " + N(L.value), 1)]),
				S("div", It, [
					t.articleId && W.value ? (A(), y(P(n), {
						key: 0,
						size: "sm",
						disabled: D.value || k.value || O.value || H.value,
						onClick: o[0] ||= (e) => I.value = !0
					}, {
						default: R(() => [...o[32] ||= [C("删除文章", -1)]]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(P(n), {
						size: "sm",
						disabled: D.value || k.value,
						onClick: o[1] ||= (e) => le.value = !0
					}, {
						icon: R(() => [w(P(_), {
							name: "search",
							size: 14
						})]),
						default: R(() => [o[33] ||= C("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					ge.value ? b("", !0) : (A(), y(P(n), {
						key: 1,
						size: "sm",
						disabled: D.value || k.value || O.value || H.value,
						onClick: Ie
					}, {
						icon: R(() => [w(P(_), {
							name: "save",
							size: 14
						})]),
						default: R(() => [o[34] ||= C("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					P(ye) ? (A(), x("span", Lt, N(P(ye)), 1)) : b("", !0),
					!ge.value && P(ve) ? (A(), x("span", Rt, "还有 " + N(P(ve)) + " 项待完善", 1)) : b("", !0),
					!ge.value && U.value ? (A(), y(P(n), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: D.value || k.value || H.value,
						loading: O.value,
						onClick: o[2] ||= (e) => Re(q.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [w(P(_), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [C(N(q.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : b("", !0)
				])
			]),
			D.value ? (A(), x("div", zt, [w(P(_), {
				name: "loader-circle",
				class: "help-spin",
				size: 28
			}), o[35] ||= S("span", null, "正在读取文章资料...", -1)])) : k.value ? (A(), x("div", Bt, [w(P(p), {
				type: "error",
				description: j.value,
				closable: !1
			}, null, 8, ["description"]), w(P(n), { onClick: Ne }, {
				default: R(() => [...o[36] ||= [C("重新加载", -1)]]),
				_: 1
			})])) : (A(), x(ae, { key: 2 }, [j.value ? (A(), x("div", Vt, [w(P(p), {
				type: "error",
				description: j.value,
				closable: !1
			}, null, 8, ["description"])])) : b("", !0), S("div", Ht, [S("aside", Ut, [w(P(f), {
				model: q,
				rules: P(Y),
				"label-position": "top",
				onSubmit: o[16] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					w(P(m), {
						label: "文章分类",
						prop: "category_id",
						error: P(X).category_id,
						required: ""
					}, {
						default: R(() => [w(P(ie), {
							modelValue: ke.value,
							"onUpdate:modelValue": o[3] ||= (e) => ke.value = e,
							options: De.value,
							placeholder: Oe.value ? "原分类：" + Oe.value.name + "（请选择二级分类）" : "请选择二级分类",
							clearable: "",
							disabled: K.value,
							"aria-label": "文章分类"
						}, null, 8, [
							"modelValue",
							"options",
							"placeholder",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					o[39] ||= S("h3", null, "文章设置", -1),
					w(P(m), {
						label: "文章封面",
						prop: "cover_url",
						error: P(X).cover_url
					}, {
						default: R(() => [w(e, {
							modelValue: q.cover_url,
							"onUpdate:modelValue": o[4] ||= (e) => q.cover_url = e,
							label: "文章封面",
							disabled: K.value,
							upload: P(re),
							onBusyChange: o[5] ||= (e) => H.value = e,
							onStart: o[6] ||= (e) => j.value = "",
							onError: ze
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "内容来源",
						prop: "content_source",
						error: P(X).content_source
					}, {
						default: R(() => [w(P(h), {
							modelValue: q.content_source,
							"onUpdate:modelValue": o[7] ||= (e) => q.content_source = e,
							maxlength: 160,
							disabled: K.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "作者署名",
						prop: "author_name",
						error: P(X).author_name
					}, {
						default: R(() => [w(P(h), {
							modelValue: q.author_name,
							"onUpdate:modelValue": o[8] ||= (e) => q.author_name = e,
							maxlength: 120,
							disabled: K.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "前端排序",
						prop: "sort_order",
						error: P(X).sort_order
					}, {
						default: R(() => [w(P(a), {
							modelValue: q.sort_order,
							"onUpdate:modelValue": o[9] ||= (e) => q.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: K.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[40] ||= S("h3", null, "发布设置", -1),
					w(P(m), {
						label: "搜索关键词",
						prop: "search_keywords",
						error: P(X).search_keywords
					}, {
						default: R(() => [w(P(h), {
							modelValue: q.search_keywords,
							"onUpdate:modelValue": o[10] ||= (e) => q.search_keywords = e,
							maxlength: 2e3,
							disabled: K.value,
							placeholder: "使用空格或逗号分隔",
							"aria-label": "搜索关键词"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: P(X).helpful_enabled
					}, {
						default: R(() => [w(Tt, {
							modelValue: q.helpful_enabled,
							"onUpdate:modelValue": o[11] ||= (e) => q.helpful_enabled = e,
							disabled: K.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "相关文章",
						prop: "related_content_ids",
						error: P(X).related_content_ids
					}, {
						default: R(() => [S("div", Wt, [
							w(P(h), {
								modelValue: Se.value,
								"onUpdate:modelValue": o[12] ||= (e) => Se.value = e,
								disabled: K.value,
								placeholder: "搜索文章标题",
								"aria-label": "搜索相关文章",
								onKeydown: pe(me(Te, ["prevent"]), ["enter"])
							}, null, 8, [
								"modelValue",
								"disabled",
								"onKeydown"
							]),
							w(P(n), {
								size: "sm",
								disabled: K.value,
								loading: $.value,
								onClick: Te
							}, {
								default: R(() => [...o[37] ||= [C("查找文章", -1)]]),
								_: 1
							}, 8, ["disabled", "loading"]),
							w(P(ie), {
								modelValue: q.related_content_ids,
								"onUpdate:modelValue": o[13] ||= (e) => q.related_content_ids = e,
								options: we.value,
								multiple: "",
								clearable: "",
								disabled: K.value,
								"aria-label": "相关文章"
							}, null, 8, [
								"modelValue",
								"options",
								"disabled"
							]),
							o[38] ||= S("p", { class: "article-editor__hint" }, " 最多 20 篇，按选择顺序展示。可关联草稿，前台须按发布状态过滤。 ", -1)
						])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "启用状态",
						prop: "is_enabled",
						error: P(X).is_enabled
					}, {
						default: R(() => [w(Tt, {
							modelValue: q.is_enabled,
							"onUpdate:modelValue": o[14] ||= (e) => q.is_enabled = e,
							disabled: K.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: P(X).scheduled_local
					}, {
						default: R(() => [w(P(h), {
							modelValue: q.scheduled_local,
							"onUpdate:modelValue": o[15] ||= (e) => q.scheduled_local = e,
							type: "datetime-local",
							disabled: K.value || !U.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[41] ||= S("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), S("main", Gt, [w(P(f), {
				model: q,
				rules: P(Y),
				"label-position": "top",
				onSubmit: o[20] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					w(P(m), {
						label: "标题",
						prop: "title",
						error: P(X).title,
						required: ""
					}, {
						default: R(() => [w(P(h), {
							modelValue: q.title,
							"onUpdate:modelValue": o[17] ||= (e) => q.title = e,
							maxlength: 255,
							disabled: K.value,
							placeholder: "输入文章标题",
							"aria-label": "文章标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "摘要",
						prop: "summary",
						error: P(X).summary
					}, {
						default: R(() => [fe(S("textarea", {
							"onUpdate:modelValue": o[18] ||= (e) => q.summary = e,
							"aria-invalid": !!P(X).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: K.value,
							"aria-label": "文章摘要"
						}, null, 8, Kt), [[de, q.summary]])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "正文",
						prop: "body_html",
						error: P(X).body_html
					}, {
						default: R(() => [w(P(i), {
							modelValue: q.body_html,
							"onUpdate:modelValue": o[19] ||= (e) => q.body_html = e,
							readonly: ge.value,
							disabled: O.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "文章正文"
						}, {
							"image-upload": R(({ url: t, setUrl: n, setBusy: r }) => [w(e, {
								label: "正文图片",
								"model-value": t,
								upload: P(re),
								"onUpdate:modelValue": n,
								onBusyChange: r,
								onError: ze
							}, null, 8, [
								"model-value",
								"upload",
								"onUpdate:modelValue",
								"onBusyChange"
							])]),
							_: 1
						}, 8, [
							"modelValue",
							"readonly",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])])])], 64)),
			w(P(d), {
				modelValue: le.value,
				"onUpdate:modelValue": o[24] ||= (e) => le.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: R(() => [w(P(n), {
					variant: "primary",
					onClick: o[23] ||= (e) => le.value = !1
				}, {
					default: R(() => [...o[42] ||= [C("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [w(P(f), {
					model: q,
					rules: P(Y),
					"label-position": "top",
					onSubmit: o[22] ||= me(() => {}, ["prevent"])
				}, {
					default: R(() => [w(P(m), {
						label: "SEO 描述",
						prop: "seo_description",
						error: P(X).seo_description
					}, {
						default: R(() => [fe(S("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": o[21] ||= (e) => q.seo_description = e,
							"aria-invalid": !!P(X).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: K.value,
							"aria-label": "SEO 描述"
						}, null, 8, qt), [[de, q.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			w(P(d), {
				modelValue: I.value,
				"onUpdate:modelValue": o[26] ||= (e) => I.value = e,
				title: "确认删除",
				subtitle: `操作对象：${q.title || "未命名文章"}`,
				width: "460px",
				"panel-class": "help-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !O.value
			}, {
				"header-actions": R(() => [S("span", Jt, [w(P(_), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [w(P(n), {
					disabled: O.value,
					onClick: o[25] ||= (e) => I.value = !1
				}, {
					default: R(() => [...o[43] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(n), {
					variant: "warning",
					loading: O.value,
					onClick: G
				}, {
					default: R(() => [...o[44] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [w(P(p), {
					class: "help-delete-dialog__notice",
					type: "warning",
					closable: !1,
					"show-icon": !1,
					description: "确定删除这条文章吗？删除后将不再展示，请谨慎操作。"
				})]),
				_: 1
			}, 8, [
				"modelValue",
				"subtitle",
				"before-close"
			]),
			w(P(d), {
				modelValue: ue.value,
				"onUpdate:modelValue": o[29] ||= (e) => ue.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [w(P(n), { onClick: o[27] ||= (e) => ue.value = !1 }, {
					default: R(() => [...o[45] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(P(n), {
					variant: "primary",
					onClick: o[28] ||= (e) => E("close")
				}, {
					default: R(() => [...o[46] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			w(P(d), {
				modelValue: F.value,
				"onUpdate:modelValue": o[31] ||= (e) => F.value = e,
				title: "将文章转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [w(P(n), { onClick: o[30] ||= (e) => F.value = !1 }, {
					default: R(() => [...o[47] ||= [C("取消", -1)]]),
					_: 1
				}), w(P(n), {
					variant: "primary",
					onClick: Le
				}, {
					default: R(() => [...o[48] ||= [C("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Nt));
	}
}), [["__scopeId", "data-v-438b969d"]]), Xt = { class: "help-articles" }, Zt = {
	key: 0,
	class: "help-statistics-note"
}, Qt = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let t = B(), { helpPublishStates: r, helpCategoryLabel: i, getHelpList: a, getHelpMetadata: s } = Ct(), { hasPermission: ee } = B(), { formatDateTime: c } = B(), l = M(!1), u = M(), d = (e) => ee([`cms_help:${e}`]), f = M(), te = q(s, (e) => {
			f.value = e;
		}), p = [
			...K(),
			{
				key: "code",
				dataIndex: "code",
				title: "文章ID",
				width: 220
			},
			{
				key: "title",
				dataIndex: "title",
				title: "文章标题",
				width: 240,
				hideable: !1
			},
			{
				key: "category_id",
				dataIndex: "category_id",
				title: "文章分类",
				width: 220,
				formatter: (e) => i(f.value, e)
			},
			{
				key: "sort_order",
				dataIndex: "sort_order",
				title: "排序",
				width: 70
			},
			{
				key: "view_count",
				dataIndex: "view_count",
				title: "浏览量",
				width: 90,
				formatter: (e) => e == null ? "—" : String(e)
			},
			{
				key: "vote_count",
				dataIndex: "vote_count",
				title: "评价数",
				width: 90,
				formatter: (e) => e == null ? "—" : String(e)
			},
			{
				key: "helpful_rate",
				dataIndex: "helpful_rate",
				title: "有帮助率",
				width: 100,
				formatter: (e) => e == null ? "—" : `${Number(e).toFixed(1)}%`
			},
			{
				key: "publish_status",
				title: "发布状态",
				width: 100
			},
			{
				key: "is_enabled",
				title: "状态",
				width: 85
			},
			{
				key: "publish_time",
				title: "发布时间",
				width: 180
			},
			{
				key: "updated_by_name",
				dataIndex: "updated_by_name",
				title: "最后编辑人",
				width: 130
			},
			{
				key: "updated_at",
				dataIndex: "updated_at",
				title: "更新时间",
				width: 180,
				formatter: c
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], ie = v(() => [
			...te.fields,
			{
				key: "code",
				label: "文章ID",
				type: "keyword",
				width: 170,
				placeholder: "文章ID",
				defaultValue: ""
			},
			{
				key: "keyword",
				label: "文章标题",
				type: "keyword",
				width: 200,
				placeholder: "文章标题",
				defaultValue: ""
			},
			{
				key: "category_id",
				label: "文章分类",
				type: "select",
				width: 160,
				defaultValue: "",
				options: [{
					label: "全部",
					value: ""
				}, ...(f.value?.categories || []).map((e) => ({
					label: i(f.value, e.id),
					value: e.id
				}))]
			},
			{
				key: "publish_status",
				label: "发布状态",
				type: "select",
				width: 150,
				defaultValue: "",
				options: [{
					label: "全部",
					value: ""
				}, ...r]
			},
			{
				key: "is_enabled",
				label: "状态",
				type: "select",
				width: 130,
				defaultValue: "",
				options: [
					{
						label: "全部",
						value: ""
					},
					{
						label: "已启用",
						value: "1"
					},
					{
						label: "已停用",
						value: "0"
					}
				]
			},
			{
				key: "publish_range",
				label: "发布时间",
				type: "date-range",
				width: 240,
				defaultValue: null
			}
		]), { proTableBindings: m, reload: h } = te.bindTable(ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: ie,
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([e, t]) => e !== "publish_range" && t !== "" && t != null)), o = e.publish_range;
				Array.isArray(o) && o.length === 2 && (i.published_from = (/* @__PURE__ */ new Date(`${o[0]}T00:00:00`)).toISOString(), i.published_to = (/* @__PURE__ */ new Date(`${o[1]}T23:59:59.999`)).toISOString());
				let s = await a("articles", {
					...i,
					page_no: t,
					page_size: n
				}, r);
				return {
					rows: s.lists,
					total: s.count
				};
			}
		})), g = te.loadMetadata;
		function ae(e) {
			u.value = e, l.value = !0;
		}
		function S() {
			l.value = !1, h(), g();
		}
		return (e, i) => (A(), x("div", Xt, [
			!l.value && P(t).mode === "platform" ? (A(), x("p", Zt, " 当前管理平台默认模板。浏览量、评价数及有帮助率属于站点运行数据，此处显示“—”，不汇总白标站点。 ")) : b("", !0),
			l.value ? (A(), y(Yt, {
				key: 1,
				"article-id": u.value,
				onClose: i[0] ||= (e) => l.value = !1,
				onSaved: S
			}, null, 8, ["article-id"])) : b("", !0),
			fe(w(P(re), D(P(m), {
				"auto-refreshable": !1,
				columns: p,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": "文章列表",
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": R(({ row: e }) => [w(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [d("add") ? (A(), y(P(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: i[1] ||= (e) => ae()
				}, {
					icon: R(() => [w(P(_), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [i[2] ||= C("新增文章", -1)]),
					_: 1
				})) : b("", !0)]),
				"cell-publish_status": R(({ row: e }) => [w(P(o), {
					size: "sm",
					effect: "soft",
					type: e.publish_status === "published" ? "success" : "warning"
				}, {
					default: R(() => [C(N(P(r).find((t) => t.value === e.publish_status)?.label), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-is_enabled": R(({ row: e }) => [w(P(o), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [C(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-publish_time": R(({ row: e }) => [C(N(P(c)(e.published_at || e.scheduled_at)), 1)]),
				"cell-actions": R(({ row: e }) => [w(P(n), {
					size: "sm",
					"icon-only": "",
					title: d("edit") ? "编辑文章" : "文章详情",
					"aria-label": d("edit") ? "编辑文章" : "文章详情",
					onClick: (t) => ae(e.id)
				}, {
					default: R(() => [w(P(_), {
						name: d("edit") ? "square-pen" : "panel-right-open",
						size: 15
					}, null, 8, ["name"])]),
					_: 1
				}, 8, [
					"title",
					"aria-label",
					"onClick"
				])]),
				_: 1
			}, 16), [[I, !l.value]])
		]));
	}
}), [["__scopeId", "data-v-9671264b"]]);
//#endregion
//#region src/cms/api/content/feedback.ts
function $t() {
	let e = B().request, t = "/cms/feedback", n = (n, r) => e.get({
		url: `${t}/list`,
		params: n,
		signal: r
	}), r = (n, r = {}) => e.get({
		url: `${t}/metadata`,
		params: r,
		signal: n
	}), i = (n, r) => e.get({
		url: `${t}/detail`,
		params: { id: n },
		signal: r
	}), a = (n, r, i) => e.get({
		url: `${t}/attachment`,
		params: {
			id: n,
			attachment_id: r
		},
		signal: i
	}), o = [
		{
			label: "商户",
			value: "merchant"
		},
		{
			label: "白标",
			value: "white_label"
		},
		{
			label: "平台",
			value: "platform"
		}
	], s = (e) => o.find((t) => t.value === e)?.label || "—";
	function ee(e) {
		let t = e;
		return Object.values(t?.errors || {}).flat()[0] || t?.message || "读取失败，请稍后重试";
	}
	return {
		getFeedbackList: n,
		getFeedbackMetadata: r,
		getFeedbackDetail: i,
		getFeedbackAttachment: a,
		feedbackSourceTypes: o,
		feedbackSourceLabel: s,
		feedbackError: ee
	};
}
//#endregion
//#region src/cms/views/content/feedback/list/index.vue?vue&type=script&setup=true&lang.ts
var en = { class: "feedback-page" }, tn = ["aria-busy"], nn = {
	key: 0,
	role: "status"
}, rn = { class: "feedback-info" }, an = { class: "feedback-content" }, on = {
	key: 0,
	class: "muted"
}, sn = { class: "attachment-title" }, cn = ["src", "alt"], ln = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { getFeedbackList: t, getFeedbackMetadata: r, getFeedbackDetail: i, getFeedbackAttachment: a, feedbackSourceTypes: s, feedbackSourceLabel: ee, feedbackError: c } = $t(), { formatDateTime: l } = B(), u = M({
			scenes: [],
			issues: []
		}), f = q(r, (e) => {
			u.value = e;
		}), te = [
			...K(),
			{
				key: "code",
				dataIndex: "code",
				title: "反馈ID",
				width: 200
			},
			{
				key: "public_user_id_snapshot",
				dataIndex: "public_user_id_snapshot",
				title: "UID",
				width: 120
			},
			{
				key: "username_snapshot",
				dataIndex: "username_snapshot",
				title: "用户账号",
				width: 150
			},
			{
				key: "source_type",
				title: "用户来源类型",
				width: 90
			},
			{
				key: "source_name_snapshot",
				dataIndex: "source_name_snapshot",
				title: "用户来源名称",
				width: 140
			},
			{
				key: "category",
				title: "业务场景 / 问题分类",
				width: 190,
				formatter: (e, t) => `${t.scene_name_snapshot} / ${t.issue_category_name_snapshot}`
			},
			{
				key: "content",
				dataIndex: "content",
				title: "反馈内容",
				width: 340
			},
			{
				key: "contact_display",
				dataIndex: "contact_display",
				title: "联系方式",
				width: 180
			},
			{
				key: "submitted_at",
				dataIndex: "submitted_at",
				title: "提交时间",
				width: 180,
				formatter: l
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				fixed: "right",
				align: "center",
				hideable: !1
			}
		], ie = v(() => [
			...f.fields,
			{
				key: "code",
				label: "反馈ID",
				type: "keyword",
				width: 180,
				placeholder: "反馈ID",
				defaultValue: ""
			},
			{
				key: "uid",
				label: "UID",
				type: "keyword",
				width: 160,
				placeholder: "UID（精确查询）",
				defaultValue: ""
			},
			{
				key: "source_name",
				label: "用户来源名称",
				type: "keyword",
				width: 180,
				placeholder: "搜索用户来源名称",
				defaultValue: ""
			},
			{
				key: "source_type",
				label: "用户来源类型",
				type: "select",
				width: 140,
				defaultValue: "",
				options: [{
					label: "全部",
					value: ""
				}, ...s]
			},
			{
				key: "scene_id",
				label: "业务场景",
				type: "select",
				width: 160,
				defaultValue: "",
				options: [{
					label: "全部",
					value: ""
				}, ...u.value.scenes.map((e) => ({
					label: e.name,
					value: e.id
				}))]
			},
			{
				key: "issue_category_id",
				label: "问题分类",
				type: "select",
				width: 180,
				defaultValue: "",
				options: [{
					label: "全部",
					value: ""
				}, ...u.value.issues.map((e) => ({
					label: `${u.value.scenes.find((t) => t.id === e.scene_id)?.name || "—"} / ${e.name}`,
					value: e.id
				}))]
			},
			{
				key: "submitted_range",
				label: "提交时间",
				type: "date-range",
				width: 240,
				defaultValue: null
			}
		]), { proTableBindings: m } = f.bindTable(ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: ie,
			request: async ({ filters: e, page: n, pageSize: r, signal: i }) => {
				let a = Object.fromEntries(Object.entries(e).filter(([e, t]) => e !== "submitted_range" && t !== "" && t != null)), o = e.submitted_range;
				Array.isArray(o) && o.length === 2 && (a.submitted_from = (/* @__PURE__ */ new Date(`${o[0]}T00:00:00`)).toISOString(), a.submitted_to = (/* @__PURE__ */ new Date(`${o[1]}T23:59:59.999`)).toISOString());
				let s = await t({
					...a,
					page_no: n,
					page_size: r
				}, i);
				return {
					rows: s.lists,
					total: s.count
				};
			}
		})), h = M(!1), g = M(!1), T = M(""), E = M(), O = M({}), k = M(""), se;
		async function j(e) {
			se?.abort();
			let t = new AbortController();
			se = t, E.value = void 0, O.value = {}, T.value = "", k.value = "", h.value = !0, g.value = !0;
			try {
				let n = await i(e, t.signal);
				t.signal.aborted || (E.value = n);
			} catch (e) {
				t.signal.aborted || (T.value = c(e));
			} finally {
				t.signal.aborted || (g.value = !1);
			}
		}
		async function ce(e) {
			let t = se, n = E.value?.id;
			if (!(!t || !n || k.value)) {
				k.value = e, T.value = "";
				try {
					let r = await a(n, e, t.signal);
					!t.signal.aborted && /^data:image\/(png|jpeg|webp|svg\+xml|x-icon|vnd\.microsoft\.icon);base64,[A-Za-z0-9+/=]+$/.test(r.data_url) && (O.value[e] = r.data_url);
				} catch (e) {
					t.signal.aborted || (T.value = c(e));
				} finally {
					t.signal.aborted || (k.value = "");
				}
			}
		}
		return L(h, (e) => {
			e || (se?.abort(), E.value = void 0, O.value = {}, T.value = "");
		}), oe(() => {
			se?.abort();
		}), (e, t) => (A(), x("div", en, [w(P(re), D(P(m), {
			"auto-refreshable": !1,
			columns: te,
			"row-key": "id",
			"fill-height": "",
			"columns-configurable": "",
			"show-cell-title": "",
			"aria-label": "意见反馈",
			"page-sizes": [
				20,
				50,
				100
			]
		}), {
			"cell-cms_source_type": R(({ row: e }) => [w(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"cell-source_type": R(({ row: e }) => [w(P(o), {
				size: "sm",
				effect: "soft",
				type: e.source_type === "merchant" ? "warning" : e.source_type === "platform" ? "success" : "primary"
			}, {
				default: R(() => [C(N(P(ee)(e.source_type)), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-actions": R(({ row: e }) => [w(P(n), {
				size: "sm",
				"icon-only": "",
				title: "查看反馈",
				"aria-label": "查看反馈",
				onClick: (t) => j(e.id)
			}, {
				default: R(() => [w(P(_), {
					name: "eye",
					size: 15
				})]),
				_: 1
			}, 8, ["onClick"])]),
			_: 1
		}, 16), w(P(d), {
			modelValue: h.value,
			"onUpdate:modelValue": t[1] ||= (e) => h.value = e,
			title: "反馈详情",
			subtitle: E.value?.code || "查看用户正式提交的意见反馈",
			width: "760px",
			"close-on-click-modal": !1
		}, {
			footer: R(() => [w(P(n), { onClick: t[0] ||= (e) => h.value = !1 }, {
				default: R(() => [...t[14] ||= [C("关闭", -1)]]),
				_: 1
			})]),
			default: R(() => [S("div", {
				class: "feedback-detail",
				"aria-busy": g.value
			}, [
				g.value ? (A(), x("p", nn, "正在读取反馈…")) : b("", !0),
				T.value ? (A(), y(P(p), {
					key: 1,
					type: "error",
					closable: !1,
					description: T.value
				}, null, 8, ["description"])) : b("", !0),
				E.value && !g.value ? (A(), x(ae, { key: 2 }, [
					S("dl", rn, [
						S("div", null, [t[2] ||= S("dt", null, "UID", -1), S("dd", null, N(E.value.public_user_id_snapshot), 1)]),
						S("div", null, [t[3] ||= S("dt", null, "用户账号", -1), S("dd", null, N(E.value.username_snapshot || "—"), 1)]),
						S("div", null, [t[4] ||= S("dt", null, "来源类型", -1), S("dd", null, N(P(ee)(E.value.source_type)), 1)]),
						S("div", null, [t[5] ||= S("dt", null, "来源名称", -1), S("dd", null, N(E.value.source_name_snapshot || "—"), 1)]),
						S("div", null, [t[6] ||= S("dt", null, "业务场景", -1), S("dd", null, N(E.value.scene_name_snapshot), 1)]),
						S("div", null, [t[7] ||= S("dt", null, "问题分类", -1), S("dd", null, N(E.value.issue_category_name_snapshot), 1)]),
						S("div", null, [t[8] ||= S("dt", null, "联系方式（脱敏）", -1), S("dd", null, N(E.value.contact_display), 1)]),
						S("div", null, [t[9] ||= S("dt", null, "提交时间", -1), S("dd", null, N(P(l)(E.value.submitted_at)), 1)])
					]),
					S("section", null, [t[10] ||= S("h3", null, "反馈内容", -1), S("div", an, N(E.value.content), 1)]),
					S("section", null, [
						S("h3", null, [t[11] ||= C(" 附件 ", -1), S("span", null, N(E.value.attachments?.length || 0), 1)]),
						E.value.attachments?.length ? b("", !0) : (A(), x("p", on, "暂无附件")),
						(A(!0), x(ae, null, le(E.value.attachments, (e) => (A(), x("div", {
							key: e.id,
							class: "feedback-attachment"
						}, [S("div", sn, [S("span", null, N(e.original_name || "图片附件") + " · " + N(Math.ceil(e.byte_size / 1024)) + " KB", 1), w(P(n), {
							size: "sm",
							loading: k.value === e.id,
							onClick: (t) => ce(e.id)
						}, {
							default: R(() => [...t[12] ||= [C("查看图片", -1)]]),
							_: 1
						}, 8, ["loading", "onClick"])]), O.value[e.id] ? (A(), x("img", {
							key: 0,
							src: O.value[e.id],
							alt: e.original_name || "反馈图片"
						}, null, 8, cn)) : b("", !0)]))), 128))
					]),
					t[13] ||= S("p", { class: "muted" }, "来源和分类为提交时快照；此页面仅查看，不修改用户原始反馈。", -1)
				], 64)) : b("", !0)
			], 8, tn)]),
			_: 1
		}, 8, ["modelValue", "subtitle"])]));
	}
}), [["__scopeId", "data-v-750f3a8a"]]);
//#endregion
//#region src/cms/api/content/announcement.ts
function un() {
	let e = B().request, t = "/cms/announcement", n = (n, r = {}) => e.get({
		url: `${t}/metadata`,
		params: r,
		signal: n
	}), r = (n, r, i) => e.get({
		url: `${t}/${n}`,
		params: r,
		signal: i
	}), i = (n, r, i) => e.get({
		url: `${t}/${n}/detail`,
		params: { id: r },
		signal: i
	}), a = (n, r) => e.post({
		url: `${t}/${n}/${r.id ? "edit" : "create"}`,
		params: r
	}, { isOpenRetry: !1 }), o = (n, r, i) => e.post({
		url: `${t}/${n}/delete`,
		params: {
			id: r,
			row_version: i
		}
	}, { isOpenRetry: !1 }), s = l(e, "/cms/announcement/upload"), ee = l(e, "/cms/announcement/categories/upload"), c = [
		{
			label: "草稿",
			value: "draft"
		},
		{
			label: "定时发布",
			value: "scheduled"
		},
		{
			label: "已发布",
			value: "published"
		}
	];
	function u(e, t) {
		let n = e?.categories.find((e) => e.id === String(t));
		if (!n) return "—";
		let r = e?.categories.find((e) => e.id === n.parent_id);
		return r ? `${r.name} / ${n.name}` : n.name;
	}
	function d(e) {
		if (e && typeof e == "object") {
			let t = e;
			return Object.values(t.errors || {}).flat()[0] || t.msg || t.message || "操作失败，请稍后重试";
		}
		return "操作失败，请稍后重试";
	}
	return {
		getAnnouncementMetadata: n,
		getAnnouncementList: r,
		getAnnouncementDetail: i,
		saveAnnouncement: a,
		deleteAnnouncement: o,
		uploadAnnouncementCover: s,
		uploadAnnouncementCategoryImage: ee,
		announcementPublishStates: c,
		announcementCategoryLabel: u,
		announcementError: d
	};
}
//#endregion
//#region src/cms/views/content/announcement/categories/index.vue?vue&type=script&setup=true&lang.ts
var dn = { class: "announcement-categories" }, fn = ["aria-busy"], pn = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, mn = { class: "taxonomy-editor__field" }, hn = { class: "taxonomy-editor__row" }, gn = "分类", _n = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(t) {
		let { hasPermission: r } = B(), { formatDateTime: i } = B(), { announcementError: s, deleteAnnouncement: ee, getAnnouncementMetadata: c, getAnnouncementList: l, getAnnouncementDetail: te, saveAnnouncement: g, uploadAnnouncementCategoryImage: ae } = un(), T = (e) => r([`cms_announcement_category:${e}`]), E = M(), O = M(), k = q(c, (e) => {
			E.value = e;
		}), se = [
			{
				key: "name",
				dataIndex: "name",
				title: "分类名称",
				width: 210,
				hideable: !1
			},
			...K(),
			{
				key: "code",
				dataIndex: "code",
				title: "分类ID",
				width: 220
			},
			{
				key: "parent_id",
				dataIndex: "parent_id",
				title: "父分类",
				width: 180,
				formatter: (e) => E.value?.categories.find((t) => t.id === e)?.name || "一级分类"
			},
			{
				key: "announcement_count",
				dataIndex: "announcement_count",
				title: "公告数量",
				width: 100
			},
			{
				key: "sort_order",
				dataIndex: "sort_order",
				title: "排序",
				width: 80
			},
			{
				key: "is_enabled",
				title: "状态",
				width: 100
			},
			{
				key: "updated_by_name",
				dataIndex: "updated_by_name",
				title: "最后编辑人",
				width: 150
			},
			{
				key: "updated_at",
				dataIndex: "updated_at",
				title: "更新时间",
				width: 180,
				formatter: i
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], j = [
			...k.fields,
			{
				key: "code",
				label: "分类ID",
				type: "keyword",
				width: 200,
				placeholder: "分类ID",
				defaultValue: ""
			},
			{
				key: "keyword",
				label: "分类名称",
				type: "keyword",
				width: 200,
				placeholder: "分类名称",
				defaultValue: ""
			},
			{
				key: "is_enabled",
				label: "状态",
				type: "segmented",
				width: 200,
				defaultValue: "",
				options: [
					{
						label: "全部",
						value: ""
					},
					{
						label: "已启用",
						value: "1"
					},
					{
						label: "已停用",
						value: "0"
					}
				]
			}
		], { proTableBindings: le, rows: ue, reload: F } = k.bindTable(ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: j,
			request: async ({ filters: e, signal: t, reason: n }) => {
				let r = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), i = await W((e, n) => l("categories", {
					...r,
					page_no: e,
					page_size: n
				}, t), t);
				return !t.aborted && (n === "query" || n === "reset") && (I.value = Object.keys(r).length ? new Set(i.rows.filter((e) => e.parent_id != null).map((e) => String(e.parent_id))) : /* @__PURE__ */ new Set()), i;
			}
		})), { visibleRows: de, expanded: I, groups: L, allExpanded: fe, toggle: pe, toggleAll: z } = G(ue), he = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			image_url: "",
			image_media_id: null,
			sort_order: 10,
			is_enabled: !0
		}), V = ce(he()), H = M(!1), U = M(!1), J = M(!1), Y = M(!1), ve = M(!1), ye = M(""), be = M(!1), xe = M(""), Z = M(!1), Q = v(() => !T(V.id ? "edit" : "add")), Se = M(!1), $ = v(() => J.value || Y.value || Se.value), Ce = "", we;
		async function Te(e) {
			we?.abort(), we = new AbortController();
			let t = we;
			Object.assign(V, he(), { id: e || "" }), xe.value = "", ve.value = !1, ye.value = "", be.value = !1, H.value = !0, U.value = !0, Ce = JSON.stringify(V);
			try {
				if (O.value = await c(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await te("categories", e, t.signal);
				if (O.value = await c(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(V, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					image_url: n.image_url || "",
					image_media_id: n.image_media_id || null,
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), Ce = JSON.stringify(V);
			} catch (e) {
				t.signal.aborted || (be.value = !0, xe.value = s(e));
			} finally {
				t.signal.aborted || (U.value = !1);
			}
		}
		function Ee() {
			return $.value ? !1 : !U.value && !be.value && JSON.stringify(V) !== Ce ? (Z.value = !0, !1) : (we?.abort(), !0);
		}
		function De() {
			Ee() && (H.value = !1);
		}
		function Oe() {
			we?.abort(), Z.value = !1, H.value = !1;
		}
		async function ke() {
			if (!(Q.value || $.value || U.value || be.value)) {
				if (!V.name.trim() || V.sort_order === null) {
					xe.value = "请填写分类名称和排序";
					return;
				}
				J.value = !0, xe.value = "";
				try {
					await g("categories", {
						name: V.name,
						parent_id: V.parent_id || null,
						image_media_id: V.image_media_id,
						sort_order: V.sort_order,
						is_enabled: V.is_enabled,
						id: V.id || void 0,
						row_version: V.id ? V.row_version : void 0
					}), H.value = !1, u.success("保存成功"), await Promise.all([F(), Ne()]);
				} catch (e) {
					xe.value = s(e);
				} finally {
					J.value = !1;
				}
			}
		}
		function Ae() {
			!V.id || !T("delete") || $.value || U.value || be.value || (ye.value = "", ve.value = !0);
		}
		async function je() {
			if (!(!ve.value || !V.id || !T("delete") || $.value || U.value || be.value)) {
				Y.value = !0, ye.value = "";
				try {
					await ee("categories", V.id, V.row_version), ve.value = !1, H.value = !1, u.success("分类已删除"), await Promise.all([F(), Ne()]);
				} catch (e) {
					ye.value = s(e);
				} finally {
					Y.value = !1;
				}
			}
		}
		let Me = v(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(O.value?.categories || []).filter((e) => !e.parent_id && e.id !== V.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Ne = k.loadMetadata;
		return oe(() => {
			we?.abort();
		}), (t, r) => (A(), x("div", dn, [
			w(P(re), D(P(le), {
				"auto-refreshable": !1,
				columns: se,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${gn}管理`,
				data: P(de),
				"show-pagination": !1
			}), {
				"cell-cms_source_type": R(({ row: e }) => [w(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [T("add") ? (A(), y(P(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => Te()
				}, {
					icon: R(() => [w(P(_), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [C("新增" + N(gn))]),
					_: 1
				})) : b("", !0), w(P(n), {
					size: "sm",
					disabled: !P(L).children.size,
					onClick: P(z)
				}, {
					icon: R(() => [w(P(_), {
						name: P(fe) ? "chevron-up" : "chevron-down",
						size: 14
					}, null, 8, ["name"])]),
					default: R(() => [C(" " + N(P(fe) ? "全部收起" : "全部展开"), 1)]),
					_: 1
				}, 8, ["disabled", "onClick"])]),
				"cell-name": R(({ row: e }) => [w(ge, {
					name: e.name,
					child: e.parent_id != null,
					branch: P(L).children.has(e.id),
					expanded: P(I).has(e.id),
					onToggle: (t) => P(pe)(e.id)
				}, null, 8, [
					"name",
					"child",
					"branch",
					"expanded",
					"onToggle"
				])]),
				"cell-is_enabled": R(({ row: e }) => [w(P(o), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [C(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": R(({ row: e }) => [w(P(n), {
					size: "sm",
					"icon-only": "",
					title: T("edit") ? `编辑${gn}` : `${gn}详情`,
					"aria-label": T("edit") ? `编辑${gn}` : `${gn}详情`,
					onClick: (t) => Te(e.id)
				}, {
					default: R(() => [w(P(_), {
						name: T("edit") ? "square-pen" : "panel-right-open",
						size: 15
					}, null, 8, ["name"])]),
					_: 1
				}, 8, [
					"title",
					"aria-label",
					"onClick"
				])]),
				_: 1
			}, 16, ["aria-label", "data"]),
			w(P(d), {
				modelValue: H.value,
				"onUpdate:modelValue": r[10] ||= (e) => H.value = e,
				title: `${V.id ? "编辑" : "新增"}公告${gn}`,
				width: "680px",
				subtitle: "公告分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Ee
			}, {
				footer: R(() => [
					V.id && T("delete") ? (A(), y(P(n), {
						key: 0,
						variant: "danger",
						disabled: U.value || be.value || $.value,
						onClick: Ae
					}, {
						icon: R(() => [w(P(_), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [r[16] ||= C("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(P(n), {
						disabled: $.value,
						onClick: De
					}, {
						default: R(() => [...r[17] ||= [C("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Q.value ? b("", !0) : (A(), y(P(n), {
						key: 1,
						variant: "primary",
						loading: J.value,
						disabled: U.value || be.value || Y.value || Se.value,
						onClick: ke
					}, {
						default: R(() => [C("保存" + N(gn))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [S("div", {
					class: "taxonomy-editor",
					"aria-busy": U.value
				}, [
					U.value ? (A(), x("div", pn, [w(P(_), {
						name: "loader-circle",
						class: "announcement-spin",
						size: 24
					}), S("span", null, "正在读取" + N(gn) + "...")])) : b("", !0),
					xe.value ? (A(), y(P(p), {
						key: 1,
						type: "error",
						closable: !1,
						description: xe.value
					}, null, 8, ["description"])) : b("", !0),
					!U.value && !be.value ? (A(), y(P(f), {
						key: 2,
						model: V,
						"label-position": "top",
						onSubmit: me(ke, ["prevent"])
					}, {
						default: R(() => [
							V.id ? (A(), y(P(m), {
								key: 0,
								label: "分类ID"
							}, {
								default: R(() => [w(P(h), {
									"model-value": V.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : b("", !0),
							w(P(m), {
								label: `${gn}名称`,
								required: ""
							}, {
								default: R(() => [w(P(h), {
									modelValue: V.name,
									"onUpdate:modelValue": r[1] ||= (e) => V.name = e,
									maxlength: 120,
									disabled: Q.value || $.value,
									"aria-label": `${gn}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							w(P(m), { label: "父分类" }, {
								default: R(() => [S("div", mn, [w(P(ie), {
									modelValue: V.parent_id,
									"onUpdate:modelValue": r[2] ||= (e) => V.parent_id = e,
									options: Me.value,
									disabled: Q.value || $.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), r[15] ||= S("p", { class: "announcement-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类公告。 ", -1)])]),
								_: 1
							}),
							w(P(m), { label: "分类图片" }, {
								default: R(() => [w(e, {
									class: "taxonomy-editor__image",
									modelValue: V.image_url,
									"onUpdate:modelValue": r[3] ||= (e) => V.image_url = e,
									label: "分类图片",
									upload: P(ae),
									disabled: Q.value || $.value,
									"onUpdate:mediaId": r[4] ||= (e) => V.image_media_id = e,
									onBusyChange: r[5] ||= (e) => Se.value = e,
									onStart: r[6] ||= (e) => xe.value = "",
									onError: r[7] ||= (e) => xe.value = P(s)(e)
								}, null, 8, [
									"modelValue",
									"upload",
									"disabled"
								])]),
								_: 1
							}),
							S("div", hn, [w(P(m), {
								label: "前端排序",
								required: ""
							}, {
								default: R(() => [w(P(a), {
									modelValue: V.sort_order,
									"onUpdate:modelValue": r[8] ||= (e) => V.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Q.value || $.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), w(P(m), { label: "启用状态" }, {
								default: R(() => [w(X, {
									modelValue: V.is_enabled,
									"onUpdate:modelValue": r[9] ||= (e) => V.is_enabled = e,
									disabled: Q.value || $.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : b("", !0)
				], 8, fn)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			w(P(d), {
				modelValue: ve.value,
				"onUpdate:modelValue": r[12] ||= (e) => ve.value = e,
				title: "删除公告分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !Y.value
			}, {
				footer: R(() => [w(P(n), {
					disabled: Y.value,
					onClick: r[11] ||= (e) => ve.value = !1
				}, {
					default: R(() => [...r[18] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(n), {
					variant: "danger",
					loading: Y.value,
					onClick: je
				}, {
					default: R(() => [...r[19] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [S("p", null, "确认删除分类“" + N(V.name) + "”？有关联公告或子分类的分类无法删除。", 1), ye.value ? (A(), y(P(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: ye.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			w(P(d), {
				modelValue: Z.value,
				"onUpdate:modelValue": r[14] ||= (e) => Z.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [w(P(n), { onClick: r[13] ||= (e) => Z.value = !1 }, {
					default: R(() => [...r[20] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(P(n), {
					variant: "primary",
					onClick: Oe
				}, {
					default: R(() => [...r[21] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-99f0ce2d"]]), vn = ["aria-busy"], yn = { class: "article-editor__header" }, bn = { class: "article-editor__heading" }, xn = { class: "article-editor__commands" }, Sn = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, Cn = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, wn = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, Tn = {
	key: 1,
	class: "article-editor__failure"
}, En = {
	key: 0,
	class: "article-editor__error"
}, Dn = { class: "article-editor__body" }, On = { class: "article-editor__settings" }, kn = { class: "article-editor__content" }, An = ["aria-invalid", "disabled"], jn = ["aria-invalid", "disabled"], Mn = {
	class: "announcement-delete-dialog__icon",
	"aria-hidden": "true"
}, Nn = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: r }) {
		let { hasPermission: o } = B(), { announcementError: s, announcementCategoryLabel: ee, deleteAnnouncement: c, getAnnouncementDetail: l, getAnnouncementMetadata: te, saveAnnouncement: ne, uploadAnnouncementCover: re } = un(), g = t, T = r, E = M(!0), D = M(!1), O = M(!1), k = M(""), j = M(!1), le = M(!1), ue = M(!1), F = M(!1), I = M(B().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), L = M(), pe = M("draft"), z = M(!1), V = v(() => o(["cms_announcement:publish"])), H = v(() => !o([`cms_announcement:${g.articleId ? "edit" : "add"}`]) || !V.value && pe.value !== "draft"), U = v(() => o(["cms_announcement:delete"]) && (V.value || pe.value === "draft"));
		async function ge() {
			if (!(!U.value || D.value || E.value || O.value)) {
				D.value = !0, k.value = "";
				try {
					await c("articles", G.id, G.row_version), $ = JSON.stringify(G), u.success("公告已删除"), T("saved");
				} catch (e) {
					k.value = s(e), F.value = !1;
				} finally {
					D.value = !1;
				}
			}
		}
		let W = v(() => H.value || D.value), G = ce({
			id: "",
			row_version: "",
			title: "",
			category_id: "",
			summary: "",
			body_html: "",
			seo_description: "",
			cover_url: "",
			content_source: "",
			author_name: "",
			sort_order: 10,
			is_enabled: !0,
			helpful_enabled: !0,
			scheduled_local: ""
		}), { editorRoot: K, seoInput: q, fieldRules: _e, fieldErrors: J, pendingCount: Y, saveError: X, validateSave: ve, setSaveFailure: ye, focusFirstError: be, focusSeoError: xe } = Ee(G, () => L.value?.categories || [], "announcement", j), Z = v(() => (L.value?.categories || []).filter((e) => e.parent_id != null).map((e) => ({
			label: ee(L.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), Q = v(() => L.value?.categories.find((e) => e.id === G.category_id && e.parent_id == null)), Se = v({
			get: () => Q.value ? "" : G.category_id,
			set: (e) => {
				G.category_id = e;
			}
		}), $ = "", Ce;
		function we(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Te() {
			Ce?.abort(), Ce = new AbortController();
			let e = Ce;
			E.value = !0, O.value = !1, k.value = "";
			try {
				if (L.value = await te(e.signal, { cms_source_type: "platform" }), g.articleId) {
					let t = await l("articles", g.articleId, e.signal);
					if (L.value = await te(e.signal, { space_id: String(t.space_id) }), I.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"sort_order",
						"is_enabled"
					]) Object.assign(G, { [e]: t[e] });
					G.category_id = t.category_id || "", G.helpful_enabled = t.helpful_enabled ?? !0;
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url",
						"content_source",
						"author_name"
					]) G[e] = t[e] || "";
					G.scheduled_local = t.publish_status === "scheduled" ? we(t.scheduled_at) : "", pe.value = t.publish_status;
				}
				$ = JSON.stringify(G);
			} catch (t) {
				e.signal.aborted || (k.value = s(t), O.value = !0);
			} finally {
				e.signal.aborted || (E.value = !1);
			}
		}
		let De = () => !E.value && !O.value && $ !== JSON.stringify(G);
		function Oe() {
			De() ? le.value = !0 : T("close");
		}
		function ke() {
			pe.value === "draft" ? je("draft") : ue.value = !0;
		}
		function Ae() {
			ue.value = !1, je("draft");
		}
		async function je(e) {
			if (W.value || E.value || O.value || z.value || (k.value = "", !await ve(e))) return;
			let t = G.scheduled_local ? new Date(G.scheduled_local) : null;
			D.value = !0, k.value = "";
			try {
				await ne("articles", {
					...G,
					id: G.id || void 0,
					row_version: G.id ? G.row_version : void 0,
					category_id: G.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), $ = JSON.stringify(G), u.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "公告已发布"), T("saved");
			} catch (e) {
				ye(e);
			} finally {
				D.value = !1;
			}
			Y.value && await be();
		}
		function Me(e) {
			k.value = s(e);
		}
		let Ne = (e) => {
			De() && (e.preventDefault(), e.returnValue = "");
		};
		return he(() => !D.value && !z.value && (!De() || window.confirm("公告有未保存的修改，确定离开？"))), se(() => {
			Te(), window.addEventListener("beforeunload", Ne);
		}), oe(() => {
			Ce?.abort(), window.removeEventListener("beforeunload", Ne);
		}), (r, o) => (A(), x("section", {
			ref_key: "editorRoot",
			ref: K,
			class: "article-editor",
			"aria-busy": E.value || D.value
		}, [
			S("header", yn, [
				w(P(n), {
					"icon-only": "",
					title: "返回公告列表",
					"aria-label": "返回公告列表",
					disabled: D.value || z.value,
					onClick: Oe
				}, {
					default: R(() => [w(P(_), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				S("div", bn, [S("h2", null, N(t.articleId ? "编辑公告" : "新增公告"), 1), S("span", null, N(L.value?.source_locale || "zh-CN") + " · " + N(I.value), 1)]),
				S("div", xn, [
					t.articleId && U.value ? (A(), y(P(n), {
						key: 0,
						size: "sm",
						disabled: E.value || O.value || D.value || z.value,
						onClick: o[0] ||= (e) => F.value = !0
					}, {
						default: R(() => [...o[29] ||= [C("删除公告", -1)]]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(P(n), {
						size: "sm",
						disabled: E.value || O.value,
						onClick: o[1] ||= (e) => j.value = !0
					}, {
						icon: R(() => [w(P(_), {
							name: "search",
							size: 14
						})]),
						default: R(() => [o[30] ||= C("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					H.value ? b("", !0) : (A(), y(P(n), {
						key: 1,
						size: "sm",
						disabled: E.value || O.value || D.value || z.value,
						onClick: ke
					}, {
						icon: R(() => [w(P(_), {
							name: "save",
							size: 14
						})]),
						default: R(() => [o[31] ||= C("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					P(X) ? (A(), x("span", Sn, N(P(X)), 1)) : b("", !0),
					!H.value && P(Y) ? (A(), x("span", Cn, "还有 " + N(P(Y)) + " 项待完善", 1)) : b("", !0),
					!H.value && V.value ? (A(), y(P(n), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: E.value || O.value || z.value,
						loading: D.value,
						onClick: o[2] ||= (e) => je(G.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [w(P(_), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [C(N(G.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : b("", !0)
				])
			]),
			E.value ? (A(), x("div", wn, [w(P(_), {
				name: "loader-circle",
				class: "announcement-spin",
				size: 28
			}), o[32] ||= S("span", null, "正在读取公告资料...", -1)])) : O.value ? (A(), x("div", Tn, [w(P(p), {
				type: "error",
				description: k.value,
				closable: !1
			}, null, 8, ["description"]), w(P(n), { onClick: Te }, {
				default: R(() => [...o[33] ||= [C("重新加载", -1)]]),
				_: 1
			})])) : (A(), x(ae, { key: 2 }, [k.value ? (A(), x("div", En, [w(P(p), {
				type: "error",
				description: k.value,
				closable: !1
			}, null, 8, ["description"])])) : b("", !0), S("div", Dn, [S("aside", On, [w(P(f), {
				model: G,
				rules: P(_e),
				"label-position": "top",
				onSubmit: o[13] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					w(P(m), {
						label: "公告分类",
						prop: "category_id",
						error: P(J).category_id,
						required: ""
					}, {
						default: R(() => [w(P(ie), {
							modelValue: Se.value,
							"onUpdate:modelValue": o[3] ||= (e) => Se.value = e,
							options: Z.value,
							placeholder: Q.value ? "原分类：" + Q.value.name + "（一级）" : "请选择二级分类",
							clearable: "",
							disabled: W.value,
							"aria-label": "公告分类"
						}, null, 8, [
							"modelValue",
							"options",
							"placeholder",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					o[34] ||= S("h3", null, "公告设置", -1),
					w(P(m), {
						label: "公告封面",
						prop: "cover_url",
						error: P(J).cover_url
					}, {
						default: R(() => [w(e, {
							modelValue: G.cover_url,
							"onUpdate:modelValue": o[4] ||= (e) => G.cover_url = e,
							label: "公告封面",
							disabled: W.value,
							upload: P(re),
							onBusyChange: o[5] ||= (e) => z.value = e,
							onStart: o[6] ||= (e) => k.value = "",
							onError: Me
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "内容来源",
						prop: "content_source",
						error: P(J).content_source
					}, {
						default: R(() => [w(P(h), {
							modelValue: G.content_source,
							"onUpdate:modelValue": o[7] ||= (e) => G.content_source = e,
							maxlength: 160,
							disabled: W.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "作者署名",
						prop: "author_name",
						error: P(J).author_name
					}, {
						default: R(() => [w(P(h), {
							modelValue: G.author_name,
							"onUpdate:modelValue": o[8] ||= (e) => G.author_name = e,
							maxlength: 120,
							disabled: W.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "前端排序",
						prop: "sort_order",
						error: P(J).sort_order
					}, {
						default: R(() => [w(P(a), {
							modelValue: G.sort_order,
							"onUpdate:modelValue": o[9] ||= (e) => G.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: W.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[35] ||= S("h3", null, "发布设置", -1),
					w(P(m), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: P(J).helpful_enabled
					}, {
						default: R(() => [w(Tt, {
							modelValue: G.helpful_enabled,
							"onUpdate:modelValue": o[10] ||= (e) => G.helpful_enabled = e,
							disabled: W.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "启用状态",
						prop: "is_enabled",
						error: P(J).is_enabled
					}, {
						default: R(() => [w(Tt, {
							modelValue: G.is_enabled,
							"onUpdate:modelValue": o[11] ||= (e) => G.is_enabled = e,
							disabled: W.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: P(J).scheduled_local
					}, {
						default: R(() => [w(P(h), {
							modelValue: G.scheduled_local,
							"onUpdate:modelValue": o[12] ||= (e) => G.scheduled_local = e,
							type: "datetime-local",
							disabled: W.value || !V.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[36] ||= S("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), S("main", kn, [w(P(f), {
				model: G,
				rules: P(_e),
				"label-position": "top",
				onSubmit: o[17] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					w(P(m), {
						label: "标题",
						prop: "title",
						error: P(J).title,
						required: ""
					}, {
						default: R(() => [w(P(h), {
							modelValue: G.title,
							"onUpdate:modelValue": o[14] ||= (e) => G.title = e,
							maxlength: 255,
							disabled: W.value,
							placeholder: "输入公告标题",
							"aria-label": "公告标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "摘要",
						prop: "summary",
						error: P(J).summary
					}, {
						default: R(() => [fe(S("textarea", {
							"onUpdate:modelValue": o[15] ||= (e) => G.summary = e,
							"aria-invalid": !!P(J).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: W.value,
							"aria-label": "公告摘要"
						}, null, 8, An), [[de, G.summary]])]),
						_: 1
					}, 8, ["error"]),
					w(P(m), {
						label: "正文",
						prop: "body_html",
						error: P(J).body_html
					}, {
						default: R(() => [w(P(i), {
							modelValue: G.body_html,
							"onUpdate:modelValue": o[16] ||= (e) => G.body_html = e,
							readonly: H.value,
							disabled: D.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "公告正文"
						}, {
							"image-upload": R(({ url: t, setUrl: n, setBusy: r }) => [w(e, {
								label: "正文图片",
								"model-value": t,
								upload: P(re),
								"onUpdate:modelValue": n,
								onBusyChange: r,
								onError: Me
							}, null, 8, [
								"model-value",
								"upload",
								"onUpdate:modelValue",
								"onBusyChange"
							])]),
							_: 1
						}, 8, [
							"modelValue",
							"readonly",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])])])], 64)),
			w(P(d), {
				modelValue: j.value,
				"onUpdate:modelValue": o[21] ||= (e) => j.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: R(() => [w(P(n), {
					variant: "primary",
					onClick: o[20] ||= (e) => j.value = !1
				}, {
					default: R(() => [...o[37] ||= [C("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [w(P(f), {
					model: G,
					rules: P(_e),
					"label-position": "top",
					onSubmit: o[19] ||= me(() => {}, ["prevent"])
				}, {
					default: R(() => [w(P(m), {
						label: "SEO 描述",
						prop: "seo_description",
						error: P(J).seo_description
					}, {
						default: R(() => [fe(S("textarea", {
							ref_key: "seoInput",
							ref: q,
							"onUpdate:modelValue": o[18] ||= (e) => G.seo_description = e,
							"aria-invalid": !!P(J).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: W.value,
							"aria-label": "SEO 描述"
						}, null, 8, jn), [[de, G.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			w(P(d), {
				modelValue: F.value,
				"onUpdate:modelValue": o[23] ||= (e) => F.value = e,
				title: "确认删除",
				subtitle: `操作对象：${G.title || "未命名公告"}`,
				width: "460px",
				"panel-class": "announcement-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !D.value
			}, {
				"header-actions": R(() => [S("span", Mn, [w(P(_), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [w(P(n), {
					disabled: D.value,
					onClick: o[22] ||= (e) => F.value = !1
				}, {
					default: R(() => [...o[38] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(n), {
					variant: "warning",
					loading: D.value,
					onClick: ge
				}, {
					default: R(() => [...o[39] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [w(P(p), {
					class: "announcement-delete-dialog__notice",
					type: "warning",
					closable: !1,
					"show-icon": !1,
					description: "确定删除这条公告吗？删除后将不再展示，请谨慎操作。"
				})]),
				_: 1
			}, 8, [
				"modelValue",
				"subtitle",
				"before-close"
			]),
			w(P(d), {
				modelValue: le.value,
				"onUpdate:modelValue": o[26] ||= (e) => le.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [w(P(n), { onClick: o[24] ||= (e) => le.value = !1 }, {
					default: R(() => [...o[40] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(P(n), {
					variant: "primary",
					onClick: o[25] ||= (e) => T("close")
				}, {
					default: R(() => [...o[41] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			w(P(d), {
				modelValue: ue.value,
				"onUpdate:modelValue": o[28] ||= (e) => ue.value = e,
				title: "将公告转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [w(P(n), { onClick: o[27] ||= (e) => ue.value = !1 }, {
					default: R(() => [...o[42] ||= [C("取消", -1)]]),
					_: 1
				}), w(P(n), {
					variant: "primary",
					onClick: Ae
				}, {
					default: R(() => [...o[43] ||= [C("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, vn));
	}
}), [["__scopeId", "data-v-6f468168"]]), Pn = { class: "announcement-articles" }, Fn = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = B(), { formatDateTime: r } = B(), { announcementPublishStates: i, announcementCategoryLabel: a, getAnnouncementList: s, getAnnouncementMetadata: ee } = un(), c = M(!1), l = M(), u = (e) => t([`cms_announcement:${e}`]), d = M(), f = q(ee, (e) => {
			d.value = e;
		}), te = [
			...K(),
			{
				key: "code",
				dataIndex: "code",
				title: "公告ID",
				width: 220
			},
			{
				key: "category_id",
				dataIndex: "category_id",
				title: "公告分类",
				width: 220,
				formatter: (e) => a(d.value, e)
			},
			{
				key: "title",
				dataIndex: "title",
				title: "公告标题",
				width: 240,
				hideable: !1
			},
			{
				key: "publish_status",
				title: "发布状态",
				width: 100
			},
			{
				key: "is_enabled",
				title: "状态",
				width: 85
			},
			{
				key: "publish_time",
				title: "发布时间",
				width: 180
			},
			{
				key: "updated_by_name",
				dataIndex: "updated_by_name",
				title: "最后编辑人",
				width: 130
			},
			{
				key: "updated_at",
				dataIndex: "updated_at",
				title: "更新时间",
				width: 180,
				formatter: r
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], p = v(() => [
			...f.fields,
			{
				key: "code",
				label: "公告ID",
				type: "keyword",
				width: 170,
				placeholder: "公告ID",
				defaultValue: ""
			},
			{
				key: "keyword",
				label: "公告标题",
				type: "keyword",
				width: 200,
				placeholder: "公告标题",
				defaultValue: ""
			},
			{
				key: "category_id",
				label: "公告分类",
				type: "select",
				width: 160,
				defaultValue: "",
				options: [{
					label: "全部",
					value: ""
				}, ...(d.value?.categories || []).map((e) => ({
					label: a(d.value, e.id),
					value: e.id
				}))]
			},
			{
				key: "publish_status",
				label: "发布状态",
				type: "select",
				width: 150,
				defaultValue: "",
				options: [{
					label: "全部",
					value: ""
				}, ...i]
			},
			{
				key: "is_enabled",
				label: "状态",
				type: "select",
				width: 130,
				defaultValue: "",
				options: [
					{
						label: "全部",
						value: ""
					},
					{
						label: "已启用",
						value: "1"
					},
					{
						label: "已停用",
						value: "0"
					}
				]
			},
			{
				key: "publish_range",
				label: "发布时间",
				type: "date-range",
				width: 240,
				defaultValue: null
			}
		]), { proTableBindings: ie, reload: m } = f.bindTable(ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: p,
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([e, t]) => e !== "publish_range" && t !== "" && t != null)), a = e.publish_range;
				Array.isArray(a) && a.length === 2 && (i.published_from = (/* @__PURE__ */ new Date(`${a[0]}T00:00:00`)).toISOString(), i.published_to = (/* @__PURE__ */ new Date(`${a[1]}T23:59:59.999`)).toISOString());
				let o = await s("articles", {
					...i,
					page_no: t,
					page_size: n
				}, r);
				return {
					rows: o.lists,
					total: o.count
				};
			}
		})), h = f.loadMetadata;
		function g(e) {
			l.value = e, c.value = !0;
		}
		function ae() {
			c.value = !1, m(), h();
		}
		return (e, t) => (A(), x("div", Pn, [c.value ? (A(), y(Nn, {
			key: 0,
			"article-id": l.value,
			onClose: t[0] ||= (e) => c.value = !1,
			onSaved: ae
		}, null, 8, ["article-id"])) : b("", !0), fe(w(P(re), D(P(ie), {
			"auto-refreshable": !1,
			columns: te,
			"row-key": "id",
			"fill-height": "",
			"columns-configurable": "",
			"show-cell-title": "",
			"aria-label": "公告中心",
			"page-sizes": [
				20,
				50,
				100
			]
		}), {
			"cell-cms_source_type": R(({ row: e }) => [w(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": R(() => [u("add") ? (A(), y(P(n), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => g()
			}, {
				icon: R(() => [w(P(_), {
					name: "plus",
					size: 14
				})]),
				default: R(() => [t[2] ||= C("新增公告", -1)]),
				_: 1
			})) : b("", !0)]),
			"cell-publish_status": R(({ row: e }) => [w(P(o), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: R(() => [C(N(P(i).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": R(({ row: e }) => [w(P(o), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: R(() => [C(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": R(({ row: e }) => [C(N(P(r)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": R(({ row: e }) => [w(P(n), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑公告" : "公告详情",
				"aria-label": u("edit") ? "编辑公告" : "公告详情",
				onClick: (t) => g(e.id)
			}, {
				default: R(() => [w(P(_), {
					name: u("edit") ? "square-pen" : "panel-right-open",
					size: 15
				}, null, 8, ["name"])]),
				_: 1
			}, 8, [
				"title",
				"aria-label",
				"onClick"
			])]),
			_: 1
		}, 16), [[I, !c.value]])]));
	}
}), [["__scopeId", "data-v-3d615d55"]]);
//#endregion
//#region src/cms/api/content/translations.ts
function In() {
	let e = B().request, t = "/cms/translations";
	return {
		getTranslationMetadata: (n, r) => e.get({
			url: `${t}/metadata`,
			params: { space_id: n },
			signal: r
		}),
		getTranslationList: (n, r, i, a) => e.get({
			url: `${t}/listing`,
			params: {
				...n,
				keyword: r,
				page_no: i
			},
			signal: a
		}),
		getTranslationDetail: (n, r, i) => e.get({
			url: `${t}/detail`,
			params: {
				...n,
				id: r
			},
			signal: i
		}),
		saveTranslations: (n, r, i) => e.post({
			url: `${t}/save`,
			params: {
				...n,
				id: r,
				items: i
			}
		}, { isOpenRetry: !1 }),
		getTranslationSettings: (n, r) => e.get({
			url: `${t}/settings`,
			params: { space_id: n },
			signal: r
		}),
		saveTranslationSettings: (n, r = "") => e.post({
			url: `${t}/saveSettings`,
			params: {
				...n,
				api_key: r
			}
		}, { isOpenRetry: !1 }),
		testTranslationConnection: (n, r, i = "") => e.post({
			url: `${t}/testConnection`,
			params: {
				space_id: n,
				space_revision: r,
				api_key: i
			}
		}, { isOpenRetry: !1 }),
		createTranslationJob: (n, r) => e.post({
			url: `${t}/createJob`,
			params: {
				...n,
				...r
			}
		}, { isOpenRetry: !1 }),
		getTranslationJob: (n, r) => e.get({
			url: `${t}/jobStatus`,
			params: { space_id: n },
			signal: r
		}),
		cancelTranslationJob: (n, r) => e.post({
			url: `${t}/cancelJob`,
			params: {
				space_id: n,
				job_id: r
			}
		}, { isOpenRetry: !1 })
	};
}
//#endregion
//#region src/cms/views/content/localization/translations/model.ts
var Ln = (e, t) => t > 0 ? Math.min(100, Math.round(e / t * 100)) : 0, Rn = (e, t) => `${e}:${t}`;
function zn(e, t) {
	return e ? e.fields.flatMap((e) => e.translations.flatMap((n) => {
		let r = t[Rn(e.key, n.locale)] ?? n.text;
		return r === n.text ? [] : [{
			field_name: e.key,
			locale: n.locale,
			text: r,
			source_hash: e.source_hash,
			row_version: n.row_version
		}];
	})) : [];
}
function Bn(e) {
	return Object.fromEntries(e.fields.flatMap((e) => e.translations.map((t) => [Rn(e.key, t.locale), t.text])));
}
function Vn(e) {
	return e?.translations.filter((e) => e.status === "ready").length ?? 0;
}
var Hn = (e) => !!e && ["queued", "running"].includes(e.status), Un = {
	queued: "等待处理",
	running: "翻译中",
	succeeded: "翻译完成",
	partial_failed: "部分未完成",
	failed: "翻译未完成",
	cancelled: "已取消"
}, Wn = {
	draft: "草稿",
	scheduled: "定时发布",
	published: "已发布"
};
function Gn(e) {
	if (e && typeof e == "object") {
		let t = e;
		return Object.values(t.errors || {}).flat()[0] || t.msg || t.message || "操作失败，请稍后重试";
	}
	return "操作失败，请稍后重试";
}
//#endregion
//#region src/cms/views/content/localization/translations/index.vue?vue&type=script&setup=true&lang.ts
var Kn = ["aria-busy"], qn = { class: "translation-toolbar surface" }, Jn = { class: "translation-title" }, Yn = { class: "translation-title__icon" }, Xn = { class: "translation-progress" }, Zn = { class: "translation-toolbar__actions" }, Qn = { class: "source-language" }, $n = {
	key: 3,
	class: "translation-job surface",
	role: "status"
}, er = { key: 0 }, tr = { key: 1 }, nr = ["title"], rr = {
	class: "language-overview surface",
	"aria-label": "目标语言完成度"
}, ir = [
	"disabled",
	"title",
	"onClick"
], ar = {
	class: "module-bar surface",
	"aria-label": "翻译内容模块"
}, or = { class: "module-count" }, sr = { class: "translation-workspace surface" }, cr = { class: "content-browser" }, lr = { class: "content-browser__header" }, ur = ["aria-busy"], dr = {
	key: 0,
	class: "region-status",
	role: "status"
}, fr = [
	"aria-current",
	"disabled",
	"onClick"
], pr = { class: "content-item__text" }, mr = ["title"], hr = {
	key: 0,
	class: "region-status"
}, gr = { class: "content-browser__footer" }, _r = ["aria-busy"], vr = {
	key: 0,
	class: "editor-state",
	role: "status"
}, yr = { class: "translation-editor__header" }, br = { class: "translation-editor__title" }, xr = { key: 0 }, Sr = ["title"], Cr = { class: "source-field" }, wr = { class: "section-heading" }, Tr = [
	"value",
	"rows",
	"aria-label"
], Er = { class: "section-heading target-heading" }, Dr = {
	key: 0,
	class: "empty-source"
}, Or = {
	key: 1,
	class: "empty-source"
}, kr = ["data-locale"], Ar = { class: "target-field__heading" }, jr = ["for"], Mr = {
	key: 0,
	class: "status-stale"
}, Nr = {
	key: 1,
	class: "status-ready"
}, Pr = [
	"id",
	"onUpdate:modelValue",
	"rows",
	"maxlength",
	"disabled",
	"dir",
	"placeholder"
], Fr = { class: "target-field__count" }, Ir = {
	key: 2,
	class: "editor-state"
}, Lr = { class: "job-confirm" }, Rr = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { cancelTranslationJob: r, createTranslationJob: i, getTranslationDetail: a, getTranslationJob: l, getTranslationList: f, getTranslationMetadata: ne, getTranslationSettings: re, saveTranslations: g, saveTranslationSettings: T, testTranslationConnection: E } = In(), { hasPermission: D } = B(), j = M(), ce = M(""), ue = M("news:content"), F = M([]), I = M(), L = M(""), me = M("title"), z = M(""), V = M(""), H = M(1), U = M(0), ge = M({}), W = M(!1), G = M(!1), K = M(!1), q = M(!1), _e = M(""), J = M(""), Y = M(), X = M(null), ve = M(!1), ye = M(!1), be = {
			load: () => re(ce.value, ke.signal),
			save: (e, t) => {
				if (Ie.value) throw Error("请先保存或放弃当前译文修改，再修改配置。");
				return T(e, t);
			},
			testConnection: (e, t) => E(e.space_id, e.space_revision, t)
		}, xe = M(!1), Z = M("field"), Q = M([]), Se = M(""), $ = M(!1), Ce = M(!1), we, Te, Ee, De, Oe, ke = new AbortController(), Ae, je = "", Me = v(() => D(["cms_translation:edit"])), Ne = v(() => D(["cms_translation:config"])), Pe = v(() => D(["cms_translation:translate"])), Fe = v(() => q.value || ye.value || $.value), Ie = v(() => zn(I.value, ge.value).length > 0), Le = v(() => Ln(j.value?.done || 0, j.value?.total || 0)), Re = v(() => ({
			space_id: ce.value,
			module: ue.value.split(":")[0],
			kind: ue.value.endsWith(":category") ? "category" : "content"
		})), ze = v(() => j.value?.spaces.map((e) => ({
			label: e.label + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		})) || []), Be = v(() => j.value?.locales.filter((e) => e.code !== j.value?.source_locale) || []), Ve = v(() => Be.value.map((e) => ({
			label: `${e.flag} ${e.label}`,
			value: e.code
		}))), He = v(() => j.value?.locales.map((e) => ({
			label: `${e.label} · ${e.code}`,
			value: e.code
		})) || []), Ue = v(() => Ve.value.filter((e) => Xe(String(e.value)))), We = v(() => j.value?.locales.find((e) => e.code === j.value?.source_locale)?.label || j.value?.source_locale || "简体中文"), Ge = v(() => I.value?.fields.find((e) => e.key === me.value)), Ke = v(() => {
			let e = j.value?.modules.find((e) => e.key === ue.value);
			return e?.kind === "category" ? `${j.value?.modules.find((t) => t.module === e.module && t.kind === "content")?.label || ""}分类` : e?.label || "新闻";
		}), qe = v(() => {
			let e = [];
			for (let t of j.value?.modules || []) {
				let n = e.find((e) => e[0].module === t.module);
				n ? n.push(t) : e.push([t]);
			}
			return e;
		}), Je = v(() => !!ce.value && j.value?.space_enabled && !!j.value.target_locales.length && !Hn(X.value) && !Fe.value && !Ie.value && !W.value && !G.value), Ye = v(() => X.value ? Ln([
			"succeeded",
			"skipped",
			"cancelled"
		].reduce((e, t) => e + (X.value?.counts[t] || 0), 0) + (Hn(X.value) ? 0 : X.value.counts.failed || 0), X.value.total) : 0), Xe = (e) => j.value?.target_locales.includes(e) ?? !1, Ze = (e) => j.value?.locales.find((t) => t.code === e), Qe = (e) => ({
			news: "file-text",
			academy: "landmark",
			help: "info",
			announcement: "megaphone"
		})[e] || "info";
		function $e(e) {
			Fe.value || (Ie.value ? (we = e, Ce.value = !0) : e());
		}
		function et() {
			let e = we;
			we = void 0, Ce.value = !1, ge.value = I.value ? Bn(I.value) : {}, e?.();
		}
		function tt() {
			Ce.value = !1, we = void 0, Oe?.(!1), Oe = void 0;
		}
		function nt(e) {
			e !== ce.value && $e(() => {
				ce.value = e, z.value = "", V.value = "", H.value = 1, X.value = null, st();
			});
		}
		function rt(e) {
			e.available && ue.value !== e.key && $e(() => {
				ue.value = e.key, z.value = "", V.value = "", H.value = 1, lt();
			});
		}
		function it(e) {
			$e(() => {
				H.value = e, lt();
			});
		}
		function at() {
			$e(() => {
				V.value = z.value.trim(), H.value = 1, lt();
			});
		}
		function ot(e) {
			e !== L.value && $e(() => {
				ut(e);
			});
		}
		async function st() {
			De?.abort();
			let e = De = new AbortController();
			W.value = !0, _e.value = "";
			try {
				let t = await ne(ce.value || void 0, e.signal);
				if (e.signal.aborted) return;
				j.value = t, ce.value = t.space_id || "", await lt(), _t();
			} catch (t) {
				e.signal.aborted || (_e.value = Gn(t));
			} finally {
				e.signal.aborted || (W.value = !1);
			}
		}
		async function ct() {
			let e = ce.value;
			if (e) try {
				let t = await ne(e, ke.signal);
				e === ce.value && (j.value = t);
			} catch {}
		}
		async function lt() {
			Te?.abort(), Ee?.abort();
			let e = Te = new AbortController();
			if (G.value = !0, K.value = !1, I.value = void 0, L.value = "", ge.value = {}, _e.value = "", !ce.value) {
				F.value = [], U.value = 0, G.value = !1;
				return;
			}
			let t = { ...Re.value };
			try {
				let n = await f(t, V.value, H.value, e.signal);
				if (e.signal.aborted) return;
				F.value = n.lists, U.value = n.count, F.value[0] && await ut(F.value[0].id);
			} catch (t) {
				e.signal.aborted || (F.value = [], U.value = 0, _e.value = Gn(t));
			} finally {
				e.signal.aborted || (G.value = !1);
			}
		}
		async function ut(e) {
			Ee?.abort();
			let t = Ee = new AbortController();
			K.value = !0, L.value = e, I.value = void 0, ge.value = {}, _e.value = "";
			try {
				let n = await a({ ...Re.value }, e, t.signal);
				if (t.signal.aborted) return;
				I.value = n, ge.value = Bn(n), n.fields.some((e) => e.key === me.value) || (me.value = n.fields[0]?.key || ""), Y.value?.scrollTo({ top: 0 });
			} catch (e) {
				t.signal.aborted || (_e.value = Gn(e));
			} finally {
				t.signal.aborted || (K.value = !1);
			}
		}
		async function dt() {
			if (!I.value || !Me.value || Fe.value) return;
			let e = zn(I.value, ge.value);
			if (e.length) {
				if (e.some((e) => !e.text.trim())) {
					_e.value = "译文不能为空；未翻译的语言请保持未填写。";
					return;
				}
				q.value = !0, _e.value = "";
				try {
					let t = await g({ ...Re.value }, I.value.id, e);
					I.value = t, ge.value = Bn(t);
					let n = F.value.findIndex((e) => e.id === t.id);
					n >= 0 && (F.value[n] = t), u.success("翻译已保存"), ct();
				} catch (e) {
					_e.value = Gn(e);
				} finally {
					q.value = !1;
				}
			}
		}
		async function ft(e) {
			J.value = e, await O();
			let t = Y.value?.querySelector(`[data-locale="${e}"]`);
			t?.scrollIntoView({
				block: "nearest",
				behavior: "smooth"
			}), t?.querySelector("textarea")?.focus();
		}
		function pt() {
			Ne.value && ce.value && !Ie.value ? ve.value = !0 : Ie.value && u.warning("请先保存或放弃当前译文修改，再修改配置。");
		}
		function mt(e) {
			Z.value = e, Q.value = [...j.value?.target_locales || []], Se.value = "", je = crypto.randomUUID(), xe.value = !0;
		}
		async function ht() {
			if (!(!Q.value.length || $.value)) {
				$.value = !0, Se.value = "";
				try {
					let e = await i({ ...Re.value }, {
						request_key: je,
						target_locales: Q.value,
						...Z.value === "field" ? {
							id: L.value,
							field_name: me.value
						} : { keyword: V.value }
					});
					X.value = e.job, xe.value = !1, u.success("翻译任务已提交"), gt();
				} catch (e) {
					Se.value = Gn(e);
				} finally {
					$.value = !1;
				}
			}
		}
		function gt() {
			clearTimeout(Ae), Hn(X.value) && (Ae = setTimeout(() => {
				_t();
			}, 3e3));
		}
		async function _t() {
			let e = ce.value;
			if (!e || ke.signal.aborted) return;
			let t = Hn(X.value);
			try {
				let n = await l(e, ke.signal);
				if (e !== ce.value) return;
				X.value = n.job, t && !Hn(X.value) && (await ct(), !Ie.value && !Fe.value && L.value && await ut(L.value));
			} catch {}
			gt();
		}
		async function vt() {
			if (X.value) try {
				let e = await r(ce.value, X.value.id);
				X.value = e.job, clearTimeout(Ae), ct();
			} catch (e) {
				_e.value = Gn(e);
			}
		}
		function yt(e) {
			(Ie.value || Fe.value) && (e.preventDefault(), e.returnValue = "");
		}
		return he(() => !Ie.value && !Fe.value || !Fe.value && new Promise((e) => {
			Oe?.(!1), Oe = e, we = () => {
				Oe = void 0, e(!0);
			}, Ce.value = !0;
		})), se(() => {
			window.addEventListener("beforeunload", yt), st();
		}), oe(() => {
			Oe?.(!1), ke.abort(), Te?.abort(), Ee?.abort(), De?.abort(), clearTimeout(Ae), window.removeEventListener("beforeunload", yt);
		}), (e, r) => (A(), x("section", {
			class: "translations-page",
			"aria-label": "多语言翻译管理",
			"aria-busy": W.value
		}, [
			S("header", qn, [S("div", Jn, [S("span", Yn, [w(P(_), {
				name: "globe",
				size: 21
			})]), S("div", null, [r[15] ||= S("h1", null, "语言翻译管理", -1), S("div", Xn, [
				S("strong", null, N(Le.value) + "%", 1),
				w(P(t), {
					percentage: Le.value,
					"show-text": !1,
					"stroke-width": 4,
					"aria-label": "全部翻译完成度"
				}, null, 8, ["percentage"]),
				S("span", null, N(j.value?.done.toLocaleString() || 0) + " / " + N(j.value?.total.toLocaleString() || 0) + " 个目标字段", 1)
			])])]), S("div", Zn, [
				w(P(ie), {
					"model-value": ce.value,
					options: ze.value,
					size: "sm",
					disabled: W.value || Fe.value,
					placeholder: "内容空间",
					"aria-label": "内容空间",
					"onUpdate:modelValue": r[0] ||= (e) => nt(String(e))
				}, null, 8, [
					"model-value",
					"options",
					"disabled"
				]),
				S("span", Qn, [r[16] ||= C("内容源语言 ", -1), S("b", null, N(We.value), 1)]),
				Ne.value ? (A(), y(P(n), {
					key: 0,
					size: "sm",
					disabled: !ce.value || Fe.value,
					onClick: pt
				}, {
					icon: R(() => [w(P(_), {
						name: "sliders-horizontal",
						size: 14
					})]),
					default: R(() => [r[17] ||= C("翻译配置", -1)]),
					_: 1
				}, 8, ["disabled"])) : b("", !0),
				Pe.value ? (A(), y(P(n), {
					key: 1,
					size: "sm",
					disabled: !Je.value,
					onClick: r[1] ||= (e) => mt("batch")
				}, {
					icon: R(() => [w(P(_), {
						name: "rocket",
						size: 14
					})]),
					default: R(() => [r[18] ||= C("批量翻译", -1)]),
					_: 1
				}, 8, ["disabled"])) : b("", !0),
				Pe.value ? (A(), y(P(n), {
					key: 2,
					size: "sm",
					disabled: !Je.value || !I.value || !Ge.value?.translatable,
					onClick: r[2] ||= (e) => mt("field")
				}, {
					icon: R(() => [w(P(_), {
						name: "globe",
						size: 14
					})]),
					default: R(() => [r[19] ||= C("翻译当前字段", -1)]),
					_: 1
				}, 8, ["disabled"])) : b("", !0),
				Me.value ? (A(), y(P(n), {
					key: 3,
					size: "sm",
					variant: "primary",
					loading: q.value,
					disabled: !Ie.value || Fe.value || !j.value?.space_enabled,
					onClick: dt
				}, {
					icon: R(() => [w(P(_), {
						name: "save",
						size: 14
					})]),
					default: R(() => [r[20] ||= C("保存翻译", -1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : b("", !0)
			])]),
			_e.value ? (A(), y(P(p), {
				key: 0,
				type: "error",
				closable: !0,
				onClose: r[3] ||= (e) => _e.value = ""
			}, {
				default: R(() => [C(N(_e.value), 1)]),
				_: 1
			})) : b("", !0),
			j.value && !j.value.space_enabled && ce.value ? (A(), y(P(p), {
				key: 1,
				type: "warning"
			}, {
				default: R(() => [...r[21] ||= [C("当前内容空间已停用，仅可查看翻译。", -1)]]),
				_: 1
			})) : b("", !0),
			j.value && !j.value.target_locales.length && ce.value ? (A(), y(P(p), {
				key: 2,
				type: "info"
			}, {
				default: R(() => [...r[22] ||= [C("尚未启用目标语言，请在“翻译配置”中选择语言后开始翻译。", -1)]]),
				_: 1
			})) : b("", !0),
			X.value ? (A(), x("div", $n, [
				w(P(_), {
					name: P(Hn)(X.value) ? "loader-circle" : "info",
					size: 15
				}, null, 8, ["name"]),
				S("strong", null, N(P(Un)[X.value.status] || X.value.status), 1),
				S("span", null, "任务 #" + N(X.value.id), 1),
				w(P(t), {
					percentage: Ye.value,
					"show-text": !1,
					"stroke-width": 4
				}, null, 8, ["percentage"]),
				S("span", null, [
					C(N(X.value.counts.succeeded || 0) + " / " + N(X.value.total) + " 已完成", 1),
					X.value.counts.failed ? (A(), x("span", er, " · " + N(X.value.counts.failed) + " 失败", 1)) : b("", !0),
					X.value.counts.skipped ? (A(), x("span", tr, " · " + N(X.value.counts.skipped) + " 冲突跳过", 1)) : b("", !0)
				]),
				P(Hn)(X.value) && Pe.value ? (A(), y(P(n), {
					key: 0,
					size: "sm",
					variant: "text",
					disabled: Fe.value,
					onClick: vt
				}, {
					default: R(() => [...r[23] ||= [C("取消任务", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (A(), y(P(n), {
					key: 1,
					size: "sm",
					variant: "text",
					onClick: r[4] ||= (e) => X.value = null
				}, {
					default: R(() => [...r[24] ||= [C("收起", -1)]]),
					_: 1
				})),
				X.value.errors.length ? (A(), x("span", {
					key: 2,
					class: "translation-job__error",
					title: X.value.errors.map((e) => `${e.target_locale}: ${e.error_code}`).join("；")
				}, N(X.value.errors[0].error_code) + "（可重新提交补翻）", 9, nr)) : b("", !0)
			])) : b("", !0),
			S("div", rr, [(A(!0), x(ae, null, le(Be.value, (e) => (A(), x("button", {
				key: e.code,
				type: "button",
				class: k(["language-card", {
					"is-active": J.value === e.code,
					"is-disabled": !Xe(e.code)
				}]),
				disabled: !Xe(e.code),
				title: Xe(e.code) ? `${e.native}：${e.done} / ${e.total}` : "请在翻译配置中启用",
				onClick: (t) => ft(e.code)
			}, [
				S("span", null, N(e.flag), 1),
				S("span", null, N(e.label), 1),
				S("strong", null, N(Xe(e.code) ? P(Ln)(e.done, e.total) + "%" : "未启用"), 1),
				w(P(t), {
					percentage: P(Ln)(e.done, e.total),
					"show-text": !1,
					"stroke-width": 2
				}, null, 8, ["percentage"])
			], 10, ir))), 128))]),
			S("nav", ar, [(A(!0), x(ae, null, le(qe.value, (e) => (A(), x("div", {
				key: e[0].module,
				class: "module-group"
			}, [(A(!0), x(ae, null, le(e, (e) => (A(), y(P(n), {
				key: e.key,
				variant: ue.value === e.key ? "primary" : "text",
				plain: ue.value === e.key,
				size: "sm",
				disabled: !e.available || Fe.value,
				title: e.reason,
				"aria-pressed": ue.value === e.key,
				onClick: (t) => rt(e)
			}, {
				default: R(() => [
					e.kind === "category" ? b("", !0) : (A(), y(P(_), {
						key: 0,
						name: Qe(e.module),
						size: 14
					}, null, 8, ["name"])),
					C(N(e.label), 1),
					S("span", or, N(e.count), 1)
				]),
				_: 2
			}, 1032, [
				"variant",
				"plain",
				"disabled",
				"title",
				"aria-pressed",
				"onClick"
			]))), 128))]))), 128))]),
			S("main", sr, [S("aside", cr, [
				S("div", lr, [S("div", null, [S("strong", null, N(Ke.value), 1), S("span", null, N(U.value) + " 条" + N(Re.value.kind === "category" ? "分类" : "内容"), 1)]), w(P(h), {
					modelValue: z.value,
					"onUpdate:modelValue": r[5] ||= (e) => z.value = e,
					size: "sm",
					clearable: "",
					placeholder: "搜索内容",
					"aria-label": "搜索内容",
					onKeydown: pe(at, ["enter"])
				}, {
					prefix: R(() => [w(P(_), {
						name: "search",
						size: 14
					})]),
					_: 1
				}, 8, ["modelValue"])]),
				S("div", {
					class: "content-browser__list",
					"aria-busy": G.value
				}, [G.value ? (A(), x("p", dr, "加载内容中…")) : (A(), x(ae, { key: 1 }, [(A(!0), x(ae, null, le(F.value, (e) => (A(), x("button", {
					key: e.id,
					type: "button",
					class: k(["content-item", { "is-selected": L.value === e.id }]),
					"aria-current": L.value === e.id ? "true" : void 0,
					disabled: Fe.value,
					onClick: (t) => ot(e.id)
				}, [S("span", pr, [S("strong", { title: e.title }, N(e.title), 9, mr), S("small", null, N(P(Wn)[e.publish_status || ""] || "分类") + " · " + N(e.done) + "/" + N(e.total), 1)]), w(P(t), {
					type: "circle",
					percentage: P(Ln)(e.done, e.total),
					"show-text": !1,
					size: 16,
					"stroke-width": 2,
					status: e.total && e.done === e.total ? "success" : "warning"
				}, null, 8, ["percentage", "status"])], 10, fr))), 128)), F.value.length ? b("", !0) : (A(), x("p", hr, N(V.value ? "没有匹配的内容" : "暂无可翻译内容"), 1))], 64))], 8, ur),
				S("footer", gr, [
					w(P(n), {
						size: "sm",
						"icon-only": "",
						"aria-label": "上一页",
						disabled: H.value <= 1 || G.value || Fe.value,
						onClick: r[6] ||= (e) => it(H.value - 1)
					}, {
						default: R(() => [w(P(_), {
							name: "chevron-left",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"]),
					S("span", null, N(H.value) + " / " + N(Math.max(1, Math.ceil(U.value / 30))), 1),
					w(P(n), {
						size: "sm",
						"icon-only": "",
						"aria-label": "下一页",
						disabled: H.value * 30 >= U.value || G.value || Fe.value,
						onClick: r[7] ||= (e) => it(H.value + 1)
					}, {
						default: R(() => [w(P(_), {
							name: "chevron-right",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"])
				])
			]), S("section", {
				class: "translation-editor",
				"aria-busy": K.value
			}, [K.value ? (A(), x("div", vr, [w(P(_), {
				name: "loader-circle",
				size: 28
			}), r[25] ||= S("p", null, "加载译文中…", -1)])) : I.value ? (A(), x(ae, { key: 1 }, [S("header", yr, [S("div", br, [S("span", null, [C(N(Ke.value) + " ", 1), Ie.value ? (A(), x("em", xr, "有未保存修改")) : b("", !0)]), S("h2", { title: I.value.title }, N(I.value.title), 9, Sr)]), w(P(te), {
				modelValue: me.value,
				"onUpdate:modelValue": r[8] ||= (e) => me.value = e
			}, {
				default: R(() => [(A(!0), x(ae, null, le(I.value.fields, (e) => (A(), y(P(ee), {
					key: e.key,
					name: e.key,
					label: `${e.label} ${e.translatable ? P(Vn)(e) + "/" + e.translations.length : "—"}`
				}, null, 8, ["name", "label"]))), 128))]),
				_: 1
			}, 8, ["modelValue"])]), Ge.value ? (A(), x("div", {
				key: 0,
				class: "translation-editor__body",
				ref_key: "editorBody",
				ref: Y
			}, [
				S("section", Cr, [S("div", wr, [S("strong", null, [C(N(We.value) + " ", 1), w(P(o), {
					size: "sm",
					type: "primary",
					effect: "soft"
				}, {
					default: R(() => [...r[26] ||= [C("内容源语言", -1)]]),
					_: 1
				})]), r[27] ||= S("span", null, "只读原文", -1)]), S("textarea", {
					value: Ge.value.source,
					readonly: "",
					rows: Ge.value.key === "body_html" ? 5 : 2,
					class: "translation-textarea source-textarea",
					"aria-label": `原文${Ge.value.label}`
				}, null, 8, Tr)]),
				S("div", Er, [r[28] ||= S("strong", null, "目标语言", -1), S("span", null, N(I.value.fields.find((e) => e.key === me.value)?.translations.length || 0) + " 种语言 · 手工修改后请保存", 1)]),
				Ge.value.translatable ? Ge.value.translations.length ? (A(), x("div", {
					key: 2,
					class: k(["target-grid", { "is-body": me.value === "body_html" }])
				}, [(A(!0), x(ae, null, le(Ge.value.translations, (e) => (A(), x("div", {
					key: e.locale,
					class: k(["target-field", { "is-focused": J.value === e.locale }]),
					"data-locale": e.locale
				}, [
					S("div", Ar, [S("label", { for: `translation-${me.value}-${e.locale}` }, [C(N(Ze(e.locale)?.native || e.locale) + " ", 1), S("small", null, N(e.locale), 1)], 8, jr), e.status === "stale" ? (A(), x("span", Mr, "原文已更新")) : e.status === "ready" ? (A(), x("span", Nr, N(e.method === "machine" ? "机器翻译" : "已保存"), 1)) : b("", !0)]),
					fe(S("textarea", {
						id: `translation-${me.value}-${e.locale}`,
						"onUpdate:modelValue": (t) => ge.value[P(Rn)(me.value, e.locale)] = t,
						class: "translation-textarea",
						rows: me.value === "body_html" ? 10 : 2,
						maxlength: Ge.value.max_length,
						disabled: !Me.value || !j.value?.space_enabled || Fe.value,
						dir: e.locale === "ar" ? "rtl" : "auto",
						placeholder: `请输入${Ze(e.locale)?.native || e.locale}翻译${me.value === "body_html" ? "（HTML）" : ""}`
					}, null, 8, Pr), [[de, ge.value[P(Rn)(me.value, e.locale)]]]),
					S("div", Fr, N((ge.value[P(Rn)(me.value, e.locale)] || "").length.toLocaleString()) + " / " + N(Ge.value.max_length.toLocaleString()), 1)
				], 10, kr))), 128))], 2)) : (A(), x("div", Or, " 请先在“翻译配置”中启用目标语言。 ")) : (A(), x("div", Dr, [w(P(_), {
					name: "info",
					size: 18
				}), r[29] ||= C("原文字段为空，不参与翻译和完成度统计。 ", -1)]))
			], 512)) : b("", !0)], 64)) : (A(), x("div", Ir, [w(P(c), { description: _e.value ? "内容加载失败，可点击刷新重试" : "选择左侧内容开始翻译" }, null, 8, ["description"]), _e.value ? (A(), y(P(n), {
				key: 0,
				size: "sm",
				onClick: st
			}, {
				default: R(() => [...r[30] ||= [C("重新加载", -1)]]),
				_: 1
			})) : b("", !0)]))], 8, _r)]),
			w(P(s), {
				modelValue: ve.value,
				"onUpdate:modelValue": r[9] ||= (e) => ve.value = e,
				actions: be,
				locales: He.value,
				onBusy: r[10] ||= (e) => ye.value = e,
				onSaved: st
			}, null, 8, ["modelValue", "locales"]),
			w(P(d), {
				modelValue: xe.value,
				"onUpdate:modelValue": r[13] ||= (e) => xe.value = e,
				title: Z.value === "field" ? "翻译当前字段" : "批量翻译",
				subtitle: "Google Translate · 仅补齐缺失及原文已更新的译文",
				width: "520px",
				"close-on-click-modal": !1,
				"before-close": () => !$.value
			}, {
				footer: R(() => [w(P(n), {
					size: "sm",
					disabled: $.value,
					onClick: r[12] ||= (e) => xe.value = !1
				}, {
					default: R(() => [...r[32] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(n), {
					variant: "primary",
					size: "sm",
					loading: $.value,
					disabled: !Q.value.length,
					onClick: ht
				}, {
					default: R(() => [...r[33] ||= [C("确认翻译", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])]),
				default: R(() => [S("div", Lr, [
					S("p", null, N(Z.value === "field" ? `当前内容的「${Ge.value?.label}」` : `当前空间「${Ke.value}」${V.value ? "中匹配搜索条件的内容" : "全部内容"}`), 1),
					w(P(m), { label: "目标语言" }, {
						default: R(() => [w(P(ie), {
							modelValue: Q.value,
							"onUpdate:modelValue": r[11] ||= (e) => Q.value = e,
							options: Ue.value,
							multiple: "",
							filterable: "",
							"max-tag-count": 5,
							disabled: $.value
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}),
					w(P(p), { type: "warning" }, {
						default: R(() => [...r[31] ||= [C("内容将发送至 Google Translate，并可能产生翻译费用。已有有效译文不会覆盖；单次最多 200 条内容、5,000 个字段任务。后台任务需要已启动翻译 worker。", -1)]]),
						_: 1
					}),
					Se.value ? (A(), y(P(p), {
						key: 0,
						type: "error"
					}, {
						default: R(() => [C(N(Se.value), 1)]),
						_: 1
					})) : b("", !0)
				])]),
				_: 1
			}, 8, [
				"modelValue",
				"title",
				"before-close"
			]),
			w(P(d), {
				modelValue: Ce.value,
				"onUpdate:modelValue": r[14] ||= (e) => Ce.value = e,
				title: "有未保存的翻译",
				subtitle: "切换后将丢弃当前修改，是否继续？",
				width: "380px",
				onClose: tt
			}, {
				footer: R(() => [w(P(n), {
					size: "sm",
					onClick: tt
				}, {
					default: R(() => [...r[34] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(P(n), {
					size: "sm",
					variant: "warning",
					onClick: et
				}, {
					default: R(() => [...r[35] ||= [C("放弃修改并继续", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Kn));
	}
}), [["__scopeId", "data-v-c0eba488"]]), zr = {
	key: 0,
	class: "mm-cms-site"
}, Br = ["disabled"], Vr = ["value"], Hr = {
	key: 1,
	role: "alert"
}, Ur = {
	key: 2,
	role: "status"
}, Wr = { key: 3 }, Gr = ["disabled"], Kr = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "MmCmsPage",
	props: {
		page: {},
		runtime: {},
		identityKey: {},
		showSiteSelector: {
			type: Boolean,
			default: !0
		},
		viewport: {
			type: Boolean,
			default: !1
		}
	},
	setup(e) {
		let t = e, n = {
			"news/categories": Se,
			"news/list": We,
			"academy/categories": Qe,
			"academy/courses": St,
			"help/categories": Mt,
			"help/articles": Qt,
			"feedback/list": ln,
			"announcement/categories": _n,
			"announcement/list": Fn,
			"localization/translations": Rr
		}, r = t.runtime.mode === "white_label" && !!t.runtime.resolveSiteInRequest, i = M(!1), a = M(0), o = M([]), s = M(""), ee = M(""), c = M(t.runtime.mode === "white_label" && !r), l = M(!1), u = v(() => o.value.find((e) => e.site_id === s.value)), d = v(() => n[t.page]), f = v(() => t.runtime.hasPermission([
			"cms_news:add",
			"cms_academy:add",
			"cms_help:add",
			"cms_announcement:add"
		])), te = new AbortController(), p = !0, ne = !1;
		function re(e) {
			ne = !0;
			try {
				o.value = e.sites, s.value = e.site_id ?? "", i.value = !0;
			} finally {
				ne = !1;
			}
		}
		let ie = V(t.runtime, re);
		L(s, () => {
			!r || ne || (ie.invalidate(), ie = V(t.runtime, re, u.value?.space_id ?? null), a.value++);
		}, { flush: "sync" });
		function m(e, n) {
			if (!p || t.runtime.mode === "white_label" && u.value?.space_id !== n) throw Error("站点已切换，请重新操作");
			if (t.runtime.mode === "platform") return e;
			if (!n) throw Error("请选择已初始化的站点");
			if (e.data instanceof FormData) {
				let t = new FormData();
				return e.data.forEach((e, n) => t.append(n, e)), t.set("space_id", n), {
					...e,
					data: t
				};
			}
			return {
				...e,
				params: {
					...e.params,
					space_id: n
				}
			};
		}
		j(z, {
			get mode() {
				return t.runtime.mode;
			},
			hasPermission: (e) => t.runtime.hasPermission(e),
			formatDateTime: (e) => t.runtime.formatDateTime(e),
			registerBeforeLeave: (e) => t.runtime.registerBeforeLeave?.(e),
			get request() {
				if (r) return ie.request;
				let e = u.value?.space_id;
				return {
					get: (n, r) => t.runtime.request.get(m(n, e), r),
					post: (n, r) => t.runtime.request.post(m(n, e), r)
				};
			}
		});
		async function h() {
			let e = await t.runtime.request.get({
				url: "/cms/sites",
				signal: te.signal
			});
			te.signal.aborted || (o.value = e.sites, o.value.some((e) => e.site_id === s.value) || (s.value = o.value[0]?.site_id ?? ""));
		}
		async function g() {
			if (!u.value || l.value) return;
			let e = a.value;
			l.value = !0;
			try {
				let n = await t.runtime.request.post({
					url: "/cms/initialize",
					params: { site_id: u.value.site_id }
				}, { isOpenRetry: !1 });
				if (!p || r && e !== a.value) return;
				if (r) {
					if (!n.cms_context) throw Error("初始化接口未返回站点信息");
					ie.invalidate(), ie = V(t.runtime, re, n.cms_context.space_id), re(n.cms_context), a.value++;
				} else await h();
			} catch (e) {
				ee.value = e instanceof Error ? e.message : "初始化失败";
			} finally {
				l.value = !1;
			}
		}
		return se(async () => {
			if (t.runtime.mode === "white_label" && !r) try {
				await h();
			} catch {
				te.signal.aborted || (ee.value = "加载站点失败，请刷新重试");
			} finally {
				c.value = !1;
			}
		}), oe(() => {
			p = !1, ie.invalidate(), te.abort();
		}), (t, n) => (A(), x("section", { class: k(["mm-cms-page", { "is-viewport": e.viewport }]) }, [e.runtime.mode === "white_label" && e.showSiteSelector && (!P(r) || i.value) ? (A(), x("header", zr, [S("label", null, [n[1] ||= C("内容站点 ", -1), fe(S("select", {
			"onUpdate:modelValue": n[0] ||= (e) => s.value = e,
			disabled: c.value
		}, [(A(!0), x(ae, null, le(o.value, (e) => (A(), x("option", {
			key: e.site_id,
			value: e.site_id
		}, N(e.label), 9, Vr))), 128))], 8, Br), [[F, s.value]])]), n[2] ||= S("span", null, "各站点内容独立管理", -1)])) : b("", !0), ee.value ? (A(), x("p", Hr, N(ee.value), 1)) : c.value ? (A(), x("p", Ur, "正在加载站点…")) : e.runtime.mode === "white_label" && (!P(r) || i.value) && !u.value?.space_id ? (A(), x("div", Wr, [S("p", null, N(u.value ? "该站点尚未初始化内容空间。" : "暂无可管理的内容站点。"), 1), u.value && f.value ? (A(), x("button", {
			key: 0,
			type: "button",
			disabled: l.value,
			onClick: g
		}, "初始化空内容空间", 8, Gr)) : b("", !0)])) : (A(), y(ue(d.value), { key: `${e.page}:${e.identityKey}:${P(r) ? a.value : u.value?.space_id ?? "platform"}` }))], 2));
	}
}), [["__scopeId", "data-v-f447749a"]]);
//#endregion
//#region src/cms/permission-tree.ts
function qr(e, t, n = "", r = 0) {
	let i = e.children ?? [], a = e.type === "C" && !!(e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:")), o = t(e), s = n ? `${n} / ${o}` : o, ee = a || e.type === "M" && r > 0 ? s : n;
	return [...!i.length || a ? [{
		id: e.id,
		name: a || e.type === "A" && e.perms?.startsWith("cms_") ? s : o
	}] : [], ...i.flatMap((e) => qr(e, t, ee, r + 1))];
}
function Jr(e, t) {
	let n = new Set(t.map(String)), r = /* @__PURE__ */ new Set(), i = [];
	function a(e) {
		let t = e.children ?? [], o = (!t.length || e.type === "C" && (e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:"))) && n.has(String(e.id));
		for (let e of t) a(e) && (o = !0);
		return o && !r.has(String(e.id)) && (r.add(String(e.id)), i.push(e.id)), !!o;
	}
	return e.forEach(a), i;
}
//#endregion
export { Kr as MmCmsPage, e as MmMediaUpload, qr as cmsPermissionItems, Jr as cmsPermissionSubmission, l as createMediaUploader };

//# sourceMappingURL=cms.js.map