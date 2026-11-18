import { Bi as e, Di as t, Fr as n, L as r, Nn as i, Oi as a, Pn as o, Si as s, Ui as c, Vi as l, Zr as ee, bi as u, da as d, m as f, or as te, pa as ne, xi as re, yi as ie, z as ae, zi as oe, zr as se } from "./src-CmNG1JyW.js";
import { a as p, i as m, n as h } from "./Loading-CnGgDnDT.js";
import { Fragment as g, computed as _, createBlock as v, createCommentVNode as y, createElementBlock as b, createElementVNode as x, createTextVNode as S, createVNode as C, defineComponent as w, inject as T, mergeProps as E, nextTick as D, normalizeClass as O, onBeforeUnmount as ce, onMounted as le, openBlock as k, provide as A, reactive as ue, ref as j, renderList as de, resolveDynamicComponent as M, toDisplayString as N, unref as P, vModelSelect as fe, vModelText as F, vShow as I, watch as L, withCtx as R, withDirectives as pe, withKeys as z, withModifiers as me } from "vue";
//#region src/cms/runtime.ts
var B = Symbol("MmCms");
function he() {
	let e = T(B);
	if (!e) throw Error("CMS host adapter is missing");
	return e;
}
function V(e) {
	he().registerBeforeLeave?.(e);
}
//#endregion
//#region src/cms/site-transport.ts
function H(e, t, n) {
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
var U = ["aria-expanded", "aria-label"], W = {
	key: 1,
	class: "spacer",
	"aria-hidden": "true"
}, G = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "CategoryTreeName",
	props: {
		name: {},
		child: { type: Boolean },
		branch: { type: Boolean },
		expanded: { type: Boolean }
	},
	emits: ["toggle"],
	setup(e) {
		return (t, n) => (k(), b("div", { class: O(["category-name", { child: e.child }]) }, [e.branch ? (k(), b("button", {
			key: 0,
			type: "button",
			"aria-expanded": e.expanded,
			"aria-label": (e.expanded ? "收起" : "展开") + e.name,
			onClick: n[0] ||= me((e) => t.$emit("toggle"), ["stop"])
		}, [C(P(h), {
			name: e.expanded ? "chevron-down" : "chevron-right",
			size: 14
		}, null, 8, ["name"])], 8, U)) : (k(), b("span", W)), x("span", null, N(e.name), 1)], 2));
	}
}), [["__scopeId", "data-v-dd16b37d"]]);
//#endregion
//#region src/cms/views/content/categoryTree.ts
async function K(e, t) {
	let n = await e(1, 100), r = [...n.lists];
	for (let i = 2; i <= Math.ceil(n.count / 100); i++) t.throwIfAborted(), r.push(...(await e(i, 100)).lists);
	return {
		rows: r,
		total: r.length
	};
}
function q(e) {
	let t = j(/* @__PURE__ */ new Set()), n = _(() => {
		let t = [], n = /* @__PURE__ */ new Map(), r = new Set(e.value.map((e) => e.id));
		for (let i of e.value) {
			let e = String(i.parent_id ?? "");
			!e || !r.has(e) ? t.push(i) : (n.has(e) || n.set(e, []), n.get(e).push(i));
		}
		return {
			roots: t,
			children: n
		};
	}), r = _(() => n.value.roots.flatMap((e) => [e, ...t.value.has(e.id) ? n.value.children.get(e.id) ?? [] : []])), i = _(() => n.value.children.size > 0 && [...n.value.children.keys()].every((e) => t.value.has(e)));
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
function J() {
	return he().mode === "white_label" ? [] : [{
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
function ge(e, t) {
	let n = he().mode === "platform", r = ue(n ? [{
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
	}] : []), i, a, o = !1, s = (e) => [String(e.cms_source_type || ""), String(e.cms_tenant_id || "")], c = (e, t) => e[0] === t[0] && e[1] === t[1], l = (e) => {
		for (let t of [
			"parent_id",
			"category_id",
			"scene_id",
			"issue_category_id"
		]) t in e && (e[t] = "");
	};
	async function ee() {
		if (o) return;
		a?.abort();
		let s = a = new AbortController(), c = n ? {
			cms_source_type: String(i?.value.cms_source_type || ""),
			cms_tenant_id: String(i?.value.cms_tenant_id || "")
		} : {};
		try {
			let n = await e(s.signal, c);
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
	le(() => {
		if (n || t) return ee();
	}), ce(() => {
		o = !0, a?.abort();
	});
	function u(e) {
		if (!n) return e;
		let t = e.filters;
		i = t;
		let a = s(t.value), u = (e) => {
			let t = { ...e };
			return t.cms_source_type === "platform" && (t.cms_tenant_id = ""), c(a, s(t)) || l(t), t;
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
			l(t.value), ee(), D(() => {
				!o && !c(a, s(t.value)) && d();
			});
		}), {
			...e,
			query: d,
			reset: f,
			proTableBindings: _(() => ({
				...e.proTableBindings.value,
				onQuery: d,
				onReset: f
			}))
		};
	}
	return {
		fields: r,
		bindTable: u,
		loadMetadata: ee
	};
}
//#endregion
//#region src/cms/components/source-type-tag/index.vue
var Y = /* @__PURE__ */ w({
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
		}, i = _(() => t.sourceType ? n[t.sourceType] : "-"), a = _(() => t.sourceType ? r[t.sourceType] : "default");
		return (e, t) => (k(), v(P(ne), {
			effect: "soft",
			round: "",
			size: "sm",
			type: a.value
		}, {
			default: R(() => [S(N(i.value), 1)]),
			_: 1
		}, 8, ["type"]));
	}
});
//#endregion
//#region src/cms/api/content/news.ts
function _e() {
	let e = he().request, t = "/cms/news", n = (n, r = {}) => e.get({
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
	}, { isOpenRetry: !1 }), s = f(e, `${t}/upload`), c = [
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
	function l(e, t) {
		let n = e?.categories.find((e) => e.id === String(t));
		if (!n) return "—";
		let r = e?.categories.find((e) => e.id === n.parent_id);
		return r ? `${r.name} / ${n.name}` : n.name;
	}
	function ee(e) {
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
		newsPublishStates: c,
		newsCategoryLabel: l,
		newsError: ee
	};
}
//#endregion
//#region src/cms/views/content/news/EnabledToggle.vue?vue&type=script&setup=true&lang.ts
var X = ["aria-checked", "disabled"], Z = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "EnabledToggle",
	props: {
		modelValue: { type: Boolean },
		disabled: { type: Boolean }
	},
	emits: ["update:modelValue"],
	setup(e) {
		return (t, n) => (k(), b("button", {
			type: "button",
			role: "switch",
			class: O(["news-toggle", { "is-on": e.modelValue }]),
			"aria-checked": e.modelValue,
			"aria-label": "启用状态",
			disabled: e.disabled,
			onClick: n[0] ||= (n) => t.$emit("update:modelValue", !e.modelValue)
		}, [n[1] ||= x("span", {
			class: "news-toggle__track",
			"aria-hidden": "true"
		}, [x("span")], -1), x("span", null, N(e.modelValue ? "已启用" : "已停用"), 1)], 10, X));
	}
}), [["__scopeId", "data-v-8b527db1"]]), ve = { class: "news-categories" }, ye = ["aria-busy"], be = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Q = { class: "taxonomy-editor__field" }, xe = { class: "taxonomy-editor__row" }, Se = "分类", $ = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { newsError: r, deleteNews: s, getNewsMetadata: u, getNewsList: f, getNewsDetail: te, saveNews: ie } = _e(), { hasPermission: ae } = he(), { formatDateTime: oe } = he(), se = (e) => ae([`cms_news_category:${e}`]), m = j(), g = j(), w = ge(u, (e) => {
			m.value = e;
		}), T = [
			{
				key: "name",
				dataIndex: "name",
				title: "分类名称",
				width: 210,
				hideable: !1
			},
			...J(),
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
				formatter: (e) => m.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
				formatter: oe
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], D = [
			...w.fields,
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
		], { proTableBindings: O, rows: le, reload: A } = w.bindTable(ee({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: D,
			request: async ({ filters: e, signal: t, reason: n }) => {
				let r = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), i = await K((e, n) => f("categories", {
					...r,
					page_no: e,
					page_size: n
				}, t), t);
				return !t.aborted && (n === "query" || n === "reset") && (M.value = Object.keys(r).length ? new Set(i.rows.filter((e) => e.parent_id != null).map((e) => String(e.parent_id))) : /* @__PURE__ */ new Set()), i;
			}
		})), { visibleRows: de, expanded: M, groups: fe, allExpanded: F, toggle: I, toggleAll: L } = q(le), pe = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), z = ue(pe()), B = j(!1), V = j(!1), H = j(!1), U = j(!1), W = j(!1), X = j(""), $ = j(!1), Ce = j(""), we = j(!1), Te = _(() => !se(z.id ? "edit" : "add")), Ee = _(() => H.value || U.value), De = "", Oe;
		async function ke(e) {
			Oe?.abort(), Oe = new AbortController();
			let t = Oe;
			Object.assign(z, pe(), { id: e || "" }), Ce.value = "", W.value = !1, X.value = "", $.value = !1, B.value = !0, V.value = !0, De = JSON.stringify(z);
			try {
				if (g.value = await u(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await te("categories", e, t.signal);
				if (g.value = await u(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(z, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), De = JSON.stringify(z);
			} catch (e) {
				t.signal.aborted || ($.value = !0, Ce.value = r(e));
			} finally {
				t.signal.aborted || (V.value = !1);
			}
		}
		function Ae() {
			return Ee.value ? !1 : !V.value && !$.value && JSON.stringify(z) !== De ? (we.value = !0, !1) : (Oe?.abort(), !0);
		}
		function je() {
			Ee.value || (Oe?.abort(), B.value = !1);
		}
		function Me() {
			we.value = !1, B.value = !1;
		}
		async function Ne() {
			if (!(Te.value || Ee.value || V.value || $.value)) {
				if (!z.name.trim() || z.sort_order === null) {
					Ce.value = "请填写分类名称和排序";
					return;
				}
				H.value = !0, Ce.value = "";
				try {
					await ie("categories", {
						name: z.name,
						parent_id: z.parent_id || null,
						sort_order: z.sort_order,
						is_enabled: z.is_enabled,
						id: z.id || void 0,
						row_version: z.id ? z.row_version : void 0
					}), B.value = !1, a.success("保存成功"), await Promise.all([A(), Le()]);
				} catch (e) {
					Ce.value = r(e);
				} finally {
					H.value = !1;
				}
			}
		}
		function Pe() {
			!z.id || !se("delete") || Ee.value || V.value || $.value || (X.value = "", W.value = !0);
		}
		async function Fe() {
			if (!(!W.value || !z.id || !se("delete") || Ee.value || V.value || $.value)) {
				U.value = !0, X.value = "";
				try {
					await s("categories", z.id, z.row_version), W.value = !1, B.value = !1, a.success("分类已删除"), await Promise.all([A(), Le()]);
				} catch (e) {
					X.value = r(e);
				} finally {
					U.value = !1;
				}
			}
		}
		let Ie = _(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(g.value?.categories || []).filter((e) => !e.parent_id && e.id !== z.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Le = w.loadMetadata;
		return ce(() => {
			Oe?.abort();
		}), (e, r) => (k(), b("div", ve, [
			C(P(n), E(P(O), {
				"auto-refreshable": !1,
				columns: T,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Se}管理`,
				data: P(de),
				"show-pagination": !1
			}), {
				"cell-cms_source_type": R(({ row: e }) => [C(Y, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [se("add") ? (k(), v(P(d), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => ke()
				}, {
					icon: R(() => [C(P(h), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [S("新增" + N(Se))]),
					_: 1
				})) : y("", !0), C(P(d), {
					size: "sm",
					disabled: !P(fe).children.size,
					onClick: P(L)
				}, {
					icon: R(() => [C(P(h), {
						name: P(F) ? "chevron-up" : "chevron-down",
						size: 14
					}, null, 8, ["name"])]),
					default: R(() => [S(" " + N(P(F) ? "全部收起" : "全部展开"), 1)]),
					_: 1
				}, 8, ["disabled", "onClick"])]),
				"cell-name": R(({ row: e }) => [C(G, {
					name: e.name,
					child: e.parent_id != null,
					branch: P(fe).children.has(e.id),
					expanded: P(M).has(e.id),
					onToggle: (t) => P(I)(e.id)
				}, null, 8, [
					"name",
					"child",
					"branch",
					"expanded",
					"onToggle"
				])]),
				"cell-is_enabled": R(({ row: e }) => [C(P(ne), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": R(({ row: e }) => [C(P(d), {
					size: "sm",
					"icon-only": "",
					title: se("edit") ? `编辑${Se}` : `${Se}详情`,
					"aria-label": `编辑${Se}`,
					onClick: (t) => ke(e.id)
				}, {
					default: R(() => [C(P(h), {
						name: se("edit") ? "square-pen" : "panel-right-open",
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
			C(P(c), {
				modelValue: B.value,
				"onUpdate:modelValue": r[5] ||= (e) => B.value = e,
				title: `${z.id ? "编辑" : "新增"}新闻${Se}`,
				width: "680px",
				subtitle: "新闻分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Ae
			}, {
				footer: R(() => [
					z.id && se("delete") ? (k(), v(P(d), {
						key: 0,
						variant: "danger",
						disabled: V.value || $.value || Ee.value,
						onClick: Pe
					}, {
						icon: R(() => [C(P(h), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [r[11] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(d), {
						disabled: Ee.value,
						onClick: je
					}, {
						default: R(() => [...r[12] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Te.value ? y("", !0) : (k(), v(P(d), {
						key: 1,
						variant: "primary",
						loading: H.value,
						disabled: V.value || $.value || U.value,
						onClick: Ne
					}, {
						default: R(() => [S("保存" + N(Se))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": V.value
				}, [
					V.value ? (k(), b("div", be, [C(P(h), {
						name: "loader-circle",
						class: "news-spin",
						size: 24
					}), x("span", null, "正在读取" + N(Se) + "...")])) : y("", !0),
					Ce.value ? (k(), v(P(t), {
						key: 1,
						type: "error",
						closable: !1,
						description: Ce.value
					}, null, 8, ["description"])) : y("", !0),
					!V.value && !$.value ? (k(), v(P(o), {
						key: 2,
						model: z,
						"label-position": "top",
						onSubmit: me(Ne, ["prevent"])
					}, {
						default: R(() => [
							z.id ? (k(), v(P(i), {
								key: 0,
								label: "分类ID"
							}, {
								default: R(() => [C(P(p), {
									"model-value": z.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : y("", !0),
							C(P(i), {
								label: `${Se}名称`,
								required: ""
							}, {
								default: R(() => [C(P(p), {
									modelValue: z.name,
									"onUpdate:modelValue": r[1] ||= (e) => z.name = e,
									maxlength: 120,
									disabled: Te.value || Ee.value,
									"aria-label": `${Se}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							C(P(i), { label: "父分类" }, {
								default: R(() => [x("div", Q, [C(P(l), {
									modelValue: z.parent_id,
									"onUpdate:modelValue": r[2] ||= (e) => z.parent_id = e,
									options: Ie.value,
									disabled: Te.value || Ee.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), r[10] ||= x("p", { class: "news-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类新闻。 ", -1)])]),
								_: 1
							}),
							x("div", xe, [C(P(i), {
								label: "前端排序",
								required: ""
							}, {
								default: R(() => [C(P(re), {
									modelValue: z.sort_order,
									"onUpdate:modelValue": r[3] ||= (e) => z.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Te.value || Ee.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(P(i), { label: "启用状态" }, {
								default: R(() => [C(Z, {
									modelValue: z.is_enabled,
									"onUpdate:modelValue": r[4] ||= (e) => z.is_enabled = e,
									disabled: Te.value || Ee.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : y("", !0)
				], 8, ye)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(P(c), {
				modelValue: W.value,
				"onUpdate:modelValue": r[7] ||= (e) => W.value = e,
				title: "删除新闻分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !U.value
			}, {
				footer: R(() => [C(P(d), {
					disabled: U.value,
					onClick: r[6] ||= (e) => W.value = !1
				}, {
					default: R(() => [...r[13] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(d), {
					variant: "danger",
					loading: U.value,
					onClick: Fe
				}, {
					default: R(() => [...r[14] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [x("p", null, "确认删除分类“" + N(z.name) + "”？有关联新闻或子分类的分类无法删除。", 1), X.value ? (k(), v(P(t), {
					key: 0,
					type: "error",
					closable: !1,
					description: X.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(P(c), {
				modelValue: we.value,
				"onUpdate:modelValue": r[9] ||= (e) => we.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [C(P(d), { onClick: r[8] ||= (e) => we.value = !1 }, {
					default: R(() => [...r[15] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(d), {
					variant: "primary",
					onClick: Me
				}, {
					default: R(() => [...r[16] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-ae27f13a"]]), Ce = {
	news: "新闻",
	help: "文章",
	announcement: "公告"
}, we = [
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
function Te(e, t, n, r, i = Date.now()) {
	let a = {}, o = Ce[n];
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
function Ee(e, t) {
	let n = {}, r = [], i = Ce[t], a = {
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
			let i = we.includes(s) ? s : e === t ? a[o] : void 0;
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
function De(e, t, n, r) {
	let i = j(), a = j(), o = j(null), s = j(Date.now()), c = ue({}), l = j(""), ee = Object.fromEntries(we.map((e) => [e, {
		required: e === "title" || e === "category_id",
		trigger: "submit"
	}])), u = _(() => o.value ? Te(e, t(), n, o.value === "draft" ? "draft" : e.scheduled_local ? "scheduled" : "published", s.value) : {}), d = _(() => ({
		...c,
		...u.value
	})), f = _(() => Object.keys(d.value).length);
	for (let t of we) L(() => e[t], () => {
		delete c[t], l.value = "", s.value = Date.now();
	}, { deep: !0 });
	function te() {
		d.value.seo_description && a.value?.focus();
	}
	async function ne() {
		await D();
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
	async function re(e) {
		o.value = e === "draft" ? "draft" : "publish", s.value = Date.now(), l.value = "";
		for (let e of we) delete c[e];
		return f.value ? (await ne(), !1) : !0;
	}
	function ie(e) {
		let t = Ee(e, n);
		Object.assign(c, t.fields), l.value = t.general;
	}
	return {
		editorRoot: i,
		seoInput: a,
		fieldRules: ee,
		fieldErrors: d,
		pendingCount: f,
		saveError: l,
		validateSave: re,
		setSaveFailure: ie,
		focusFirstError: ne,
		focusSeoError: te
	};
}
//#endregion
//#region src/cms/views/content/news/list/ArticleEditor.vue?vue&type=script&setup=true&lang.ts
var Oe = ["aria-busy"], ke = { class: "article-editor__header" }, Ae = { class: "article-editor__heading" }, je = { class: "article-editor__commands" }, Me = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, Ne = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Pe = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, Fe = {
	key: 1,
	class: "article-editor__failure"
}, Ie = {
	key: 0,
	class: "article-editor__error"
}, Le = { class: "article-editor__body" }, Re = { class: "article-editor__settings" }, ze = { class: "article-editor__content" }, Be = ["aria-invalid", "disabled"], Ve = ["aria-invalid", "disabled"], He = {
	class: "news-delete-dialog__icon",
	"aria-hidden": "true"
}, Ue = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(e, { emit: n }) {
		let { newsError: ee, newsCategoryLabel: u, deleteNews: f, getNewsDetail: te, getNewsMetadata: ne, saveNews: ie, uploadNewsCover: ae } = _e(), { hasPermission: oe } = he(), se = e, m = n, w = j(!0), T = j(!1), E = j(!1), D = j(""), O = j(!1), A = j(!1), de = j(!1), M = j(!1), fe = j(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), I = j(), L = j("draft"), z = j(!1), B = _(() => oe(["cms_news:publish"])), H = _(() => !oe([`cms_news:${se.articleId ? "edit" : "add"}`]) || !B.value && L.value !== "draft"), U = _(() => oe(["cms_news:delete"]) && (B.value || L.value === "draft"));
		async function W() {
			if (!(!U.value || T.value || w.value || E.value)) {
				T.value = !0, D.value = "";
				try {
					await f("articles", K.id, K.row_version), we = JSON.stringify(K), a.success("新闻已删除"), m("saved");
				} catch (e) {
					D.value = ee(e), M.value = !1;
				} finally {
					T.value = !1;
				}
			}
		}
		let G = _(() => H.value || T.value), K = ue({
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
		}), { editorRoot: q, seoInput: J, fieldRules: ge, fieldErrors: Y, pendingCount: X, saveError: ve, validateSave: ye, setSaveFailure: be, focusFirstError: Q, focusSeoError: xe } = De(K, () => I.value?.categories || [], "news", O), Se = _(() => (I.value?.categories || []).filter((e) => e.parent_id != null).map((e) => ({
			label: u(I.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), $ = _(() => I.value?.categories.find((e) => e.id === K.category_id && e.parent_id == null)), Ce = _({
			get: () => $.value ? "" : K.category_id,
			set: (e) => {
				K.category_id = e;
			}
		}), we = "", Te;
		function Ee(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Ue() {
			Te?.abort(), Te = new AbortController();
			let e = Te;
			w.value = !0, E.value = !1, D.value = "";
			try {
				if (I.value = await ne(e.signal, { cms_source_type: "platform" }), se.articleId) {
					let t = await te("articles", se.articleId, e.signal);
					if (I.value = await ne(e.signal, { space_id: String(t.space_id) }), fe.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"sort_order",
						"is_enabled"
					]) Object.assign(K, { [e]: t[e] });
					K.category_id = t.category_id || "";
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url",
						"content_source",
						"author_name"
					]) K[e] = t[e] || "";
					K.scheduled_local = t.publish_status === "scheduled" ? Ee(t.scheduled_at) : "", L.value = t.publish_status;
				}
				we = JSON.stringify(K);
			} catch (t) {
				e.signal.aborted || (D.value = ee(t), E.value = !0);
			} finally {
				e.signal.aborted || (w.value = !1);
			}
		}
		let We = () => !w.value && !E.value && we !== JSON.stringify(K);
		function Ge() {
			We() ? A.value = !0 : m("close");
		}
		function Ke() {
			L.value === "draft" ? Je("draft") : de.value = !0;
		}
		function qe() {
			de.value = !1, Je("draft");
		}
		async function Je(e) {
			if (G.value || w.value || E.value || z.value || (D.value = "", !await ye(e))) return;
			let t = K.scheduled_local ? new Date(K.scheduled_local) : null;
			T.value = !0, D.value = "";
			try {
				await ie("articles", {
					...K,
					id: K.id || void 0,
					row_version: K.id ? K.row_version : void 0,
					category_id: K.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), we = JSON.stringify(K), a.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "新闻已发布"), m("saved");
			} catch (e) {
				be(e);
			} finally {
				T.value = !1;
			}
			X.value && await Q();
		}
		function Ye(e) {
			D.value = ee(e);
		}
		let Xe = (e) => {
			We() && (e.preventDefault(), e.returnValue = "");
		};
		return V(() => !T.value && !z.value && (!We() || window.confirm("新闻有未保存的修改，确定离开？"))), le(() => {
			Ue(), window.addEventListener("beforeunload", Xe);
		}), ce(() => {
			Te?.abort(), window.removeEventListener("beforeunload", Xe);
		}), (n, a) => (k(), b("section", {
			ref_key: "editorRoot",
			ref: q,
			class: "article-editor",
			"aria-busy": w.value || T.value
		}, [
			x("header", ke, [
				C(P(d), {
					"icon-only": "",
					title: "返回新闻列表",
					"aria-label": "返回新闻列表",
					disabled: T.value || z.value,
					onClick: Ge
				}, {
					default: R(() => [C(P(h), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", Ae, [x("h2", null, N(e.articleId ? "编辑新闻" : "新增新闻"), 1), x("span", null, N(I.value?.source_locale || "zh-CN") + " · " + N(fe.value), 1)]),
				x("div", je, [
					e.articleId && U.value ? (k(), v(P(d), {
						key: 0,
						size: "sm",
						disabled: w.value || E.value || T.value || z.value,
						onClick: a[0] ||= (e) => M.value = !0
					}, {
						default: R(() => [...a[28] ||= [S("删除新闻", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(d), {
						size: "sm",
						disabled: w.value || E.value,
						onClick: a[1] ||= (e) => O.value = !0
					}, {
						icon: R(() => [C(P(h), {
							name: "search",
							size: 14
						})]),
						default: R(() => [a[29] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					H.value ? y("", !0) : (k(), v(P(d), {
						key: 1,
						size: "sm",
						disabled: w.value || E.value || T.value || z.value,
						onClick: Ke
					}, {
						icon: R(() => [C(P(h), {
							name: "save",
							size: 14
						})]),
						default: R(() => [a[30] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					P(ve) ? (k(), b("span", Me, N(P(ve)), 1)) : y("", !0),
					!H.value && P(X) ? (k(), b("span", Ne, "还有 " + N(P(X)) + " 项待完善", 1)) : y("", !0),
					!H.value && B.value ? (k(), v(P(d), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: w.value || E.value || z.value,
						loading: T.value,
						onClick: a[2] ||= (e) => Je(K.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [C(P(h), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [S(N(K.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)
				])
			]),
			w.value ? (k(), b("div", Pe, [C(P(h), {
				name: "loader-circle",
				class: "news-spin",
				size: 28
			}), a[31] ||= x("span", null, "正在读取新闻资料...", -1)])) : E.value ? (k(), b("div", Fe, [C(P(t), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"]), C(P(d), { onClick: Ue }, {
				default: R(() => [...a[32] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (k(), b(g, { key: 2 }, [D.value ? (k(), b("div", Ie, [C(P(t), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"])])) : y("", !0), x("div", Le, [x("aside", Re, [C(P(o), {
				model: K,
				rules: P(ge),
				"label-position": "top",
				onSubmit: a[12] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					C(P(i), {
						label: "新闻分类",
						prop: "category_id",
						error: P(Y).category_id,
						required: ""
					}, {
						default: R(() => [C(P(l), {
							modelValue: Ce.value,
							"onUpdate:modelValue": a[3] ||= (e) => Ce.value = e,
							options: Se.value,
							placeholder: $.value ? "原分类：" + $.value.name + "（请选择二级分类）" : "请选择二级分类",
							clearable: "",
							disabled: G.value,
							"aria-label": "新闻分类"
						}, null, 8, [
							"modelValue",
							"options",
							"placeholder",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					a[33] ||= x("h3", null, "新闻设置", -1),
					C(P(i), {
						label: "新闻封面",
						prop: "cover_url",
						error: P(Y).cover_url
					}, {
						default: R(() => [C(s, {
							modelValue: K.cover_url,
							"onUpdate:modelValue": a[4] ||= (e) => K.cover_url = e,
							label: "新闻封面",
							disabled: G.value,
							upload: P(ae),
							onBusyChange: a[5] ||= (e) => z.value = e,
							onStart: a[6] ||= (e) => D.value = "",
							onError: Ye
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "内容来源",
						prop: "content_source",
						error: P(Y).content_source
					}, {
						default: R(() => [C(P(p), {
							modelValue: K.content_source,
							"onUpdate:modelValue": a[7] ||= (e) => K.content_source = e,
							maxlength: 160,
							disabled: G.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "作者署名",
						prop: "author_name",
						error: P(Y).author_name
					}, {
						default: R(() => [C(P(p), {
							modelValue: K.author_name,
							"onUpdate:modelValue": a[8] ||= (e) => K.author_name = e,
							maxlength: 120,
							disabled: G.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "前端排序",
						prop: "sort_order",
						error: P(Y).sort_order
					}, {
						default: R(() => [C(P(re), {
							modelValue: K.sort_order,
							"onUpdate:modelValue": a[9] ||= (e) => K.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: G.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[34] ||= x("h3", null, "发布设置", -1),
					C(P(i), {
						label: "启用状态",
						prop: "is_enabled",
						error: P(Y).is_enabled
					}, {
						default: R(() => [C(Z, {
							modelValue: K.is_enabled,
							"onUpdate:modelValue": a[10] ||= (e) => K.is_enabled = e,
							disabled: G.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: P(Y).scheduled_local
					}, {
						default: R(() => [C(P(p), {
							modelValue: K.scheduled_local,
							"onUpdate:modelValue": a[11] ||= (e) => K.scheduled_local = e,
							type: "datetime-local",
							disabled: G.value || !B.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[35] ||= x("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", ze, [C(P(o), {
				model: K,
				rules: P(ge),
				"label-position": "top",
				onSubmit: a[16] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					C(P(i), {
						label: "标题",
						prop: "title",
						error: P(Y).title,
						required: ""
					}, {
						default: R(() => [C(P(p), {
							modelValue: K.title,
							"onUpdate:modelValue": a[13] ||= (e) => K.title = e,
							maxlength: 255,
							disabled: G.value,
							placeholder: "输入新闻标题",
							"aria-label": "新闻标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "摘要",
						prop: "summary",
						error: P(Y).summary
					}, {
						default: R(() => [pe(x("textarea", {
							"onUpdate:modelValue": a[14] ||= (e) => K.summary = e,
							"aria-invalid": !!P(Y).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: G.value,
							"aria-label": "新闻摘要"
						}, null, 8, Be), [[F, K.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "正文",
						prop: "body_html",
						error: P(Y).body_html
					}, {
						default: R(() => [C(P(r), {
							modelValue: K.body_html,
							"onUpdate:modelValue": a[15] ||= (e) => K.body_html = e,
							readonly: H.value,
							disabled: T.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "新闻正文"
						}, {
							"image-upload": R(({ url: e, setUrl: t, setBusy: n }) => [C(s, {
								label: "正文图片",
								"model-value": e,
								upload: P(ae),
								"onUpdate:modelValue": t,
								onBusyChange: n,
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
			C(P(c), {
				modelValue: O.value,
				"onUpdate:modelValue": a[20] ||= (e) => O.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: R(() => [C(P(d), {
					variant: "primary",
					onClick: a[19] ||= (e) => O.value = !1
				}, {
					default: R(() => [...a[36] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [C(P(o), {
					model: K,
					rules: P(ge),
					"label-position": "top",
					onSubmit: a[18] ||= me(() => {}, ["prevent"])
				}, {
					default: R(() => [C(P(i), {
						label: "SEO 描述",
						prop: "seo_description",
						error: P(Y).seo_description
					}, {
						default: R(() => [pe(x("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": a[17] ||= (e) => K.seo_description = e,
							"aria-invalid": !!P(Y).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: G.value,
							"aria-label": "SEO 描述"
						}, null, 8, Ve), [[F, K.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(c), {
				modelValue: M.value,
				"onUpdate:modelValue": a[22] ||= (e) => M.value = e,
				title: "确认删除",
				subtitle: `操作对象：${K.title || "未命名新闻"}`,
				width: "460px",
				"panel-class": "news-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !T.value
			}, {
				"header-actions": R(() => [x("span", He, [C(P(h), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [C(P(d), {
					disabled: T.value,
					onClick: a[21] ||= (e) => M.value = !1
				}, {
					default: R(() => [...a[37] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(d), {
					variant: "warning",
					loading: T.value,
					onClick: W
				}, {
					default: R(() => [...a[38] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [C(P(t), {
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
			C(P(c), {
				modelValue: A.value,
				"onUpdate:modelValue": a[25] ||= (e) => A.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [C(P(d), { onClick: a[23] ||= (e) => A.value = !1 }, {
					default: R(() => [...a[39] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(d), {
					variant: "primary",
					onClick: a[24] ||= (e) => m("close")
				}, {
					default: R(() => [...a[40] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(c), {
				modelValue: de.value,
				"onUpdate:modelValue": a[27] ||= (e) => de.value = e,
				title: "将新闻转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [C(P(d), { onClick: a[26] ||= (e) => de.value = !1 }, {
					default: R(() => [...a[41] ||= [S("取消", -1)]]),
					_: 1
				}), C(P(d), {
					variant: "primary",
					onClick: qe
				}, {
					default: R(() => [...a[42] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Oe));
	}
}), [["__scopeId", "data-v-33394e7e"]]), We = { class: "news-articles" }, Ge = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { newsPublishStates: t, newsCategoryLabel: r, getNewsList: i, getNewsMetadata: a } = _e(), { hasPermission: o } = he(), { formatDateTime: s } = he(), c = j(!1), l = j(), u = (e) => o([`cms_news:${e}`]), f = j(), te = ge(a, (e) => {
			f.value = e;
		}), re = [
			...J(),
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
				formatter: (e) => r(f.value, e)
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
				formatter: s
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], ie = _(() => [
			...te.fields,
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
				}, ...(f.value?.categories || []).map((e) => ({
					label: r(f.value, e.id),
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
		]), { proTableBindings: ae, reload: oe } = te.bindTable(ee({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: ie,
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
		})), se = te.loadMetadata;
		function p(e) {
			l.value = e, c.value = !0;
		}
		function m() {
			c.value = !1, oe(), se();
		}
		return (e, r) => (k(), b("div", We, [c.value ? (k(), v(Ue, {
			key: 0,
			"article-id": l.value,
			onClose: r[0] ||= (e) => c.value = !1,
			onSaved: m
		}, null, 8, ["article-id"])) : y("", !0), pe(C(P(n), E(P(ae), {
			"auto-refreshable": !1,
			columns: re,
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
			"cell-cms_source_type": R(({ row: e }) => [C(Y, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": R(() => [u("add") ? (k(), v(P(d), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: r[1] ||= (e) => p()
			}, {
				icon: R(() => [C(P(h), {
					name: "plus",
					size: 14
				})]),
				default: R(() => [r[2] ||= S("新增新闻", -1)]),
				_: 1
			})) : y("", !0)]),
			"cell-publish_status": R(({ row: e }) => [C(P(ne), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: R(() => [S(N(P(t).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": R(({ row: e }) => [C(P(ne), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: R(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": R(({ row: e }) => [S(N(P(s)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": R(({ row: e }) => [C(P(d), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑新闻" : "新闻详情",
				"aria-label": u("edit") ? "编辑新闻" : "新闻详情",
				onClick: (t) => p(e.id)
			}, {
				default: R(() => [C(P(h), {
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
function Ke() {
	let e = he().request, t = "/cms/academy";
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
		uploadAcademyCover: f(e, "/cms/academy/upload"),
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
var qe = ["aria-busy"], Je = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Ye = { class: "taxonomy-editor__row" }, Xe = "分类", Ze = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "CategoryTable",
	setup(e) {
		let { hasPermission: r } = he(), { formatDateTime: s } = he(), { academyDifficulties: l, academyError: u, getAcademyList: f, getAcademyMetadata: ie, getAcademyDetail: ae, saveAcademy: oe, deleteAcademyCategory: se } = Ke(), m = (e) => r([`cms_academy_category:${e}`]), w = ge(ie), T = [
			...J(),
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
				formatter: s
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], D = [
			...w.fields,
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
				}, ...l]
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
		], { proTableBindings: O, reload: le, currentPage: A, pageSize: de, total: M } = w.bindTable(ee({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: D,
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), a = await f("categories", {
					...i,
					page_no: t,
					page_size: n
				}, r);
				return {
					rows: a.lists,
					total: a.count
				};
			}
		})), fe = () => ({
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
		}), F = ue(fe()), I = j(!1), L = j(!1), pe = j(!1), z = j(!1), B = j(!1), V = j(""), H = j(!1), U = j(""), W = j(!1), G = _(() => !m(F.id ? "edit" : "add")), K = _(() => pe.value || z.value), q = "", _e;
		async function X(e) {
			_e?.abort(), _e = new AbortController();
			let t = _e;
			if (Object.assign(F, fe(), { id: e || "" }), U.value = "", B.value = !1, V.value = "", H.value = !1, I.value = !0, L.value = !!e, q = JSON.stringify(F), e) try {
				let n = await ae("categories", e, t.signal);
				if (t.signal.aborted) return;
				Object.assign(F, {
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
				}), q = JSON.stringify(F);
			} catch (e) {
				t.signal.aborted || (H.value = !0, U.value = u(e));
			} finally {
				t.signal.aborted || (L.value = !1);
			}
		}
		function Z() {
			return K.value ? !1 : !L.value && !H.value && JSON.stringify(F) !== q ? (W.value = !0, !1) : (_e?.abort(), !0);
		}
		function ve() {
			K.value || (_e?.abort(), I.value = !1);
		}
		function ye() {
			W.value = !1, I.value = !1;
		}
		async function be() {
			if (!(G.value || K.value || L.value || H.value)) {
				if (!F.name.trim() || F.sort_order === null) {
					U.value = "请填写名称和排序";
					return;
				}
				pe.value = !0, U.value = "";
				try {
					await oe("categories", {
						...F,
						id: F.id || void 0,
						row_version: F.id ? F.row_version : void 0
					}), I.value = !1, a.success("保存成功"), await le();
				} catch (e) {
					U.value = u(e);
				} finally {
					pe.value = !1;
				}
			}
		}
		function Q() {
			!F.id || !m("delete") || K.value || L.value || H.value || (V.value = "", B.value = !0);
		}
		async function xe() {
			if (!(!B.value || !F.id || !m("delete") || K.value || L.value || H.value)) {
				z.value = !0, V.value = "";
				try {
					await se({
						id: F.id,
						row_version: F.row_version
					}), B.value = !1, I.value = !1, a.success("分类已删除"), await le(), A.value = Math.min(A.value, Math.max(1, Math.ceil(M.value / de.value)));
				} catch (e) {
					V.value = u(e);
				} finally {
					z.value = !1;
				}
			}
		}
		return ce(() => _e?.abort()), (e, r) => (k(), b(g, null, [
			C(P(n), E(P(O), {
				"auto-refreshable": !1,
				columns: T,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Xe}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": R(({ row: e }) => [C(Y, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [m("add") ? (k(), v(P(d), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => X()
				}, {
					icon: R(() => [C(P(h), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [S("新增" + N(Xe))]),
					_: 1
				})) : y("", !0)]),
				"cell-is_enabled": R(({ row: e }) => [C(P(ne), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": R(({ row: e }) => [C(P(d), {
					size: "sm",
					"icon-only": "",
					title: m("edit") ? `编辑${Xe}` : `${Xe}详情`,
					"aria-label": `编辑${Xe}`,
					onClick: (t) => X(e.id)
				}, {
					default: R(() => [C(P(h), {
						name: m("edit") ? "square-pen" : "panel-right-open",
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
			C(P(c), {
				modelValue: I.value,
				"onUpdate:modelValue": r[4] ||= (e) => I.value = e,
				title: `${F.id ? "编辑" : "新增"}课程${Xe}`,
				width: "620px",
				"close-on-click-modal": !1,
				"before-close": Z
			}, {
				footer: R(() => [
					F.id && m("delete") ? (k(), v(P(d), {
						key: 0,
						variant: "danger",
						disabled: L.value || H.value || K.value,
						onClick: Q
					}, {
						icon: R(() => [C(P(h), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [r[9] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(d), {
						disabled: K.value,
						onClick: ve
					}, {
						default: R(() => [...r[10] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					G.value ? y("", !0) : (k(), v(P(d), {
						key: 1,
						variant: "primary",
						loading: pe.value,
						disabled: L.value || H.value || z.value,
						onClick: be
					}, {
						default: R(() => [S("保存" + N(Xe))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": L.value
				}, [
					L.value ? (k(), b("div", Je, [C(P(h), {
						name: "loader-circle",
						class: "academy-spin",
						size: 24
					}), x("span", null, "正在读取" + N(Xe) + "...")])) : y("", !0),
					U.value ? (k(), v(P(t), {
						key: 1,
						type: "error",
						closable: !1,
						description: U.value
					}, null, 8, ["description"])) : y("", !0),
					!L.value && !H.value ? (k(), v(P(o), {
						key: 2,
						model: F,
						"label-position": "top",
						onSubmit: me(be, ["prevent"])
					}, {
						default: R(() => [C(P(i), {
							label: `${Xe}名称`,
							required: ""
						}, {
							default: R(() => [C(P(p), {
								modelValue: F.name,
								"onUpdate:modelValue": r[1] ||= (e) => F.name = e,
								maxlength: 120,
								disabled: G.value || K.value,
								"aria-label": `${Xe}名称`
							}, null, 8, [
								"modelValue",
								"disabled",
								"aria-label"
							])]),
							_: 1
						}, 8, ["label"]), x("div", Ye, [C(P(i), {
							label: "前端排序",
							required: ""
						}, {
							default: R(() => [C(P(re), {
								modelValue: F.sort_order,
								"onUpdate:modelValue": r[2] ||= (e) => F.sort_order = e,
								min: 0,
								max: 2147483647,
								precision: 0,
								disabled: G.value || K.value,
								"aria-label": "前端排序"
							}, null, 8, ["modelValue", "disabled"])]),
							_: 1
						}), C(P(i), { label: "启用状态" }, {
							default: R(() => [C(P(te), {
								modelValue: F.is_enabled,
								"onUpdate:modelValue": r[3] ||= (e) => F.is_enabled = e,
								disabled: G.value || K.value,
								label: "已启用",
								"aria-label": "启用状态"
							}, null, 8, ["modelValue", "disabled"])]),
							_: 1
						})])]),
						_: 1
					}, 8, ["model"])) : y("", !0)
				], 8, qe)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(P(c), {
				modelValue: B.value,
				"onUpdate:modelValue": r[6] ||= (e) => B.value = e,
				title: "删除课程分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !z.value
			}, {
				footer: R(() => [C(P(d), {
					disabled: z.value,
					onClick: r[5] ||= (e) => B.value = !1
				}, {
					default: R(() => [...r[11] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(d), {
					variant: "danger",
					loading: z.value,
					onClick: xe
				}, {
					default: R(() => [...r[12] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [x("p", null, "确认删除分类“" + N(F.name) + "”？有关联课程的分类无法删除。", 1), V.value ? (k(), v(P(t), {
					key: 0,
					type: "error",
					closable: !1,
					description: V.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(P(c), {
				modelValue: W.value,
				"onUpdate:modelValue": r[8] ||= (e) => W.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [C(P(d), { onClick: r[7] ||= (e) => W.value = !1 }, {
					default: R(() => [...r[13] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(d), {
					variant: "primary",
					onClick: ye
				}, {
					default: R(() => [...r[14] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 64));
	}
}), [["__scopeId", "data-v-e36abb56"]]), Qe = { class: "academy-categories" }, $e = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		return (e, t) => (k(), b("div", Qe, [C(Ze)]));
	}
}), [["__scopeId", "data-v-8f5e5114"]]), et = [
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
function tt(e) {
	if (/[\x00-\x20\\]/.test(e)) return !1;
	if (e.startsWith("/") && !e.startsWith("//")) return !0;
	try {
		let t = new URL(e);
		return /^https?:\/\//i.test(e) && ["http:", "https:"].includes(t.protocol);
	} catch {
		return !1;
	}
}
function nt(e) {
	return e.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "").replace(/&nbsp;|&#0*(?:160|9|10|13|32);|&#x0*(?:a0|9|a|d|20);/gi, " ").trim().length > 0;
}
function rt(e, t, n, r = Date.now()) {
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
	(e.sort_order === null || !Number.isInteger(e.sort_order) || e.sort_order < 0 || e.sort_order > 2147483647) && (i.sort_order = "请填写 0–2147483647 之间的整数"), e.cover_url && !tt(e.cover_url) && (i.cover_url = "封面地址必须为 HTTP(S) 或站内绝对路径");
	let o = e.category_ids.map((e) => t.find((t) => t.id === e));
	if (a && !o.length ? i.category_ids = "请选择课程分类" : o.some((e) => !e) ? i.category_ids = "所选分类已不可用，请重新选择" : a && o.some((e) => !e?.is_enabled) ? i.category_ids = "发布课程必须选择已启用的分类" : o.length > 50 && (i.category_ids = "最多选择 50 个课程分类"), a && !e.difficulty_level ? i.difficulty_level = "请选择课程难度" : e.difficulty_level !== "" && ![
		1,
		2,
		3
	].includes(e.difficulty_level) && (i.difficulty_level = "请选择有效的课程难度"), a && !nt(e.body_html) && (i.body_html = "请填写课程正文"), n === "scheduled") {
		let t = new Date(e.scheduled_local).getTime();
		(!Number.isFinite(t) || t <= r) && (i.scheduled_local = "计划发布时间必须晚于当前时间");
	}
	return i;
}
var it = {
	课程标题不能为空: "title",
	"封面地址必须为 HTTP(S) 或站内绝对路径": "cover_url",
	计划发布时间必须晚于当前时间: "scheduled_local",
	发布课程必须选择分类: "category_ids",
	所选分类不存在或不属于当前学院模板: "category_ids",
	"发布课程必须选择已启用的分类，存在已停用分类": "category_ids",
	发布课程需要填写正文和课程难度: "body_html"
};
function at(e) {
	let t = {}, n = [], r = e && typeof e == "object" ? e : {};
	for (let [e, i] of Object.entries(r.errors || {})) {
		let r = e.split(".")[0], a = r === "scheduled_at" ? "scheduled_local" : r;
		for (let r of Array.isArray(i) ? i : [i]) {
			if (typeof r != "string" || !r) continue;
			let i = et.includes(a) ? a : e === "academy" ? it[r] : void 0;
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
var ot = ["aria-busy"], st = { class: "course-editor__header" }, ct = { class: "course-editor__heading" }, lt = { class: "course-editor__commands" }, ut = {
	key: 2,
	class: "course-editor__save-error",
	role: "alert"
}, dt = {
	key: 3,
	class: "course-editor__publish-actions"
}, ft = {
	key: 0,
	class: "course-editor__pending",
	role: "status",
	"aria-live": "polite"
}, pt = {
	key: 0,
	class: "course-editor__loading",
	role: "status"
}, mt = {
	key: 1,
	class: "course-editor__failure"
}, ht = {
	key: 2,
	class: "course-editor__body"
}, gt = { class: "course-editor__settings" }, _t = { class: "course-editor__content" }, vt = ["disabled", "aria-invalid"], yt = ["disabled", "aria-invalid"], bt = {
	class: "course-delete-dialog__icon",
	"aria-hidden": "true"
}, xt = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "CourseEditor",
	props: { courseId: {} },
	emits: ["close", "saved"],
	setup(e, { emit: n }) {
		let { hasPermission: ee } = he(), { academyDifficulties: u, academyError: f, deleteAcademyCourse: ne, getAcademyDetail: ie, getAcademyMetadata: ae, saveAcademy: oe, uploadAcademyCover: se } = Ke(), m = e, g = n, w = j(!0), T = j(!1), E = j(!1), O = j(""), A = j(!1), de = j(!1), M = j(!1), fe = j(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), I = j(), z = j("draft"), B = j(!1), H = j(!1), U = j(""), W = _(() => ee(["cms_academy:publish"])), G = _(() => !!m.courseId && ee(["cms_academy:delete"]) && (W.value || z.value === "draft")), K = _(() => !ee([`cms_academy:${m.courseId ? "edit" : "add"}`]) || !W.value && z.value !== "draft"), q = _(() => K.value || T.value), J = ue({
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
		}), ge = j(), Y = j(), _e = j(null), X = j(Date.now()), Z = ue({}), ve = j(""), ye = Object.fromEntries(et.map((e) => [e, {
			required: e === "title" || e === "category_ids",
			trigger: "submit"
		}])), be = _(() => _e.value ? rt(J, I.value?.categories || [], _e.value === "draft" ? "draft" : J.scheduled_local ? "scheduled" : "published", X.value) : {}), Q = _(() => ({
			...Z,
			...be.value
		})), xe = _(() => Object.keys(Q.value).length);
		for (let e of et) L(() => J[e], () => {
			delete Z[e], ve.value = "", X.value = Date.now();
		}, { deep: !0 });
		function Se() {
			Q.value.seo_description && Y.value?.focus();
		}
		async function $() {
			await D();
			let e = [...ge.value?.querySelectorAll("[data-prop]") || []].find((e) => Q.value[e.dataset.prop]);
			if (!e && Q.value.seo_description) {
				A.value ? Se() : A.value = !0;
				return;
			}
			e && (e.scrollIntoView({
				block: "center",
				behavior: "auto"
			}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
		}
		let Ce = _(() => (I.value?.categories || []).map((e) => ({
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
			w.value = !0, E.value = !1, O.value = "";
			try {
				if (I.value = await ae(e.signal, { cms_source_type: "platform" }), m.courseId) {
					let t = await ie("courses", m.courseId, e.signal);
					if (I.value = await ae(e.signal, { space_id: String(t.space_id) }), fe.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"category_ids",
						"sort_order",
						"is_enabled"
					]) Object.assign(J, { [e]: t[e] });
					J.difficulty_level = t.difficulty_level || "";
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url"
					]) J[e] = t[e] || "";
					J.scheduled_local = t.publish_status === "scheduled" ? Ee(t.scheduled_at) : "", z.value = t.publish_status;
				}
				we = JSON.stringify(J);
			} catch (t) {
				e.signal.aborted || (O.value = f(t), E.value = !0);
			} finally {
				e.signal.aborted || (w.value = !1);
			}
		}
		let Oe = () => !w.value && !E.value && we !== JSON.stringify(J);
		function ke() {
			Oe() ? de.value = !0 : g("close");
		}
		function Ae() {
			z.value === "draft" ? Me("draft") : M.value = !0;
		}
		function je() {
			M.value = !1, Me("draft");
		}
		async function Me(e) {
			if (q.value || w.value || E.value || B.value) return;
			_e.value = e === "draft" ? "draft" : "publish", X.value = Date.now(), ve.value = "";
			for (let e of et) delete Z[e];
			if (xe.value) {
				await $();
				return;
			}
			let t = J.scheduled_local ? new Date(J.scheduled_local) : null;
			T.value = !0, O.value = "";
			try {
				await oe("courses", {
					...J,
					id: J.id || void 0,
					row_version: J.id ? J.row_version : void 0,
					difficulty_level: J.difficulty_level || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), we = JSON.stringify(J), a.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "课程已发布"), g("saved");
			} catch (e) {
				let t = at(e);
				Object.assign(Z, t.fields), ve.value = t.general;
			} finally {
				T.value = !1;
			}
			xe.value && await $();
		}
		function Ne() {
			U.value = "", H.value = !0;
		}
		async function Pe() {
			if (!(!G.value || w.value || E.value || T.value || B.value)) {
				T.value = !0, U.value = "";
				try {
					await ne({
						id: J.id,
						row_version: J.row_version
					}), we = JSON.stringify(J), H.value = !1, a.success("课程已删除"), g("saved");
				} catch (e) {
					U.value = f(e);
				} finally {
					T.value = !1;
				}
			}
		}
		function Fe(e) {
			Z.cover_url = f(e);
		}
		function Ie() {
			delete Z.cover_url;
		}
		let Le = (e) => {
			Oe() && (e.preventDefault(), e.returnValue = "");
		};
		return V(() => !T.value && !B.value && (!Oe() || window.confirm("课程有未保存的修改，确定离开？"))), le(() => {
			De(), window.addEventListener("beforeunload", Le);
		}), ce(() => {
			Te?.abort(), window.removeEventListener("beforeunload", Le);
		}), (n, a) => (k(), b("section", {
			ref_key: "editorRoot",
			ref: ge,
			class: "course-editor",
			"aria-busy": w.value || T.value
		}, [
			x("header", st, [
				C(P(d), {
					"icon-only": "",
					title: "返回课程列表",
					"aria-label": "返回课程列表",
					disabled: T.value || B.value,
					onClick: ke
				}, {
					default: R(() => [C(P(h), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", ct, [x("h2", null, N(e.courseId ? "编辑课程" : "新增课程"), 1), x("span", null, N(I.value?.source_locale || "zh-CN") + " · " + N(fe.value), 1)]),
				x("div", lt, [
					G.value ? (k(), v(P(d), {
						key: 0,
						variant: "danger",
						size: "sm",
						disabled: w.value || E.value || T.value || B.value,
						onClick: Ne
					}, {
						default: R(() => [...a[26] ||= [S("删除课程", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(d), {
						size: "sm",
						disabled: w.value || E.value,
						onClick: a[0] ||= (e) => A.value = !0
					}, {
						icon: R(() => [C(P(h), {
							name: "search",
							size: 14
						})]),
						default: R(() => [a[27] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					K.value ? y("", !0) : (k(), v(P(d), {
						key: 1,
						size: "sm",
						disabled: w.value || E.value || T.value || B.value,
						onClick: Ae
					}, {
						icon: R(() => [C(P(h), {
							name: "save",
							size: 14
						})]),
						default: R(() => [a[28] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					ve.value ? (k(), b("span", ut, N(ve.value), 1)) : y("", !0),
					K.value ? y("", !0) : (k(), b("div", dt, [xe.value ? (k(), b("span", ft, "还有 " + N(xe.value) + " 项待完善", 1)) : y("", !0), W.value ? (k(), v(P(d), {
						key: 1,
						variant: "primary",
						size: "sm",
						disabled: w.value || E.value || B.value,
						loading: T.value,
						onClick: a[1] ||= (e) => Me(J.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [C(P(h), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [S(N(J.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)]))
				])
			]),
			w.value ? (k(), b("div", pt, [C(P(h), {
				name: "loader-circle",
				class: "academy-spin",
				size: 28
			}), a[29] ||= x("span", null, "正在读取课程资料...", -1)])) : E.value ? (k(), b("div", mt, [C(P(t), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"]), C(P(d), { onClick: De }, {
				default: R(() => [...a[30] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (k(), b("div", ht, [x("aside", gt, [C(P(o), {
				model: J,
				rules: P(ye),
				"label-position": "top",
				onSubmit: a[10] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					C(P(i), {
						label: "课程分类",
						prop: "category_ids",
						error: Q.value.category_ids,
						required: ""
					}, {
						default: R(() => [C(P(l), {
							modelValue: J.category_ids,
							"onUpdate:modelValue": a[2] ||= (e) => J.category_ids = e,
							options: Ce.value,
							multiple: "",
							filterable: "",
							clearable: "",
							disabled: q.value,
							"aria-label": "课程分类"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					a[31] ||= x("h3", null, "课程设置", -1),
					C(P(i), {
						label: "课程封面",
						prop: "cover_url",
						error: Q.value.cover_url
					}, {
						default: R(() => [C(s, {
							modelValue: J.cover_url,
							"onUpdate:modelValue": a[3] ||= (e) => J.cover_url = e,
							label: "课程封面",
							disabled: q.value,
							upload: P(se),
							onBusyChange: a[4] ||= (e) => B.value = e,
							onStart: a[5] ||= (e) => O.value = "",
							onError: Fe,
							onSuccess: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "课程难度",
						prop: "difficulty_level",
						error: Q.value.difficulty_level
					}, {
						default: R(() => [C(P(l), {
							modelValue: J.difficulty_level,
							"onUpdate:modelValue": a[6] ||= (e) => J.difficulty_level = e,
							options: P(u),
							disabled: q.value,
							"aria-label": "课程难度"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "前端排序",
						prop: "sort_order",
						error: Q.value.sort_order
					}, {
						default: R(() => [C(P(re), {
							modelValue: J.sort_order,
							"onUpdate:modelValue": a[7] ||= (e) => J.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: q.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[32] ||= x("h3", null, "发布设置", -1),
					C(P(i), {
						label: "启用状态",
						prop: "is_enabled",
						error: Q.value.is_enabled
					}, {
						default: R(() => [C(P(te), {
							modelValue: J.is_enabled,
							"onUpdate:modelValue": a[8] ||= (e) => J.is_enabled = e,
							disabled: q.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "计划发布时间",
						prop: "scheduled_local",
						error: Q.value.scheduled_local
					}, {
						default: R(() => [C(P(p), {
							modelValue: J.scheduled_local,
							"onUpdate:modelValue": a[9] ||= (e) => J.scheduled_local = e,
							type: "datetime-local",
							disabled: q.value || !W.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", _t, [C(P(o), {
				model: J,
				rules: P(ye),
				"label-position": "top",
				onSubmit: a[14] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					C(P(i), {
						label: "标题",
						prop: "title",
						error: Q.value.title,
						required: ""
					}, {
						default: R(() => [C(P(p), {
							modelValue: J.title,
							"onUpdate:modelValue": a[11] ||= (e) => J.title = e,
							maxlength: 255,
							disabled: q.value,
							placeholder: "输入课程标题",
							"aria-label": "课程标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "摘要",
						prop: "summary",
						error: Q.value.summary
					}, {
						default: R(() => [pe(x("textarea", {
							"onUpdate:modelValue": a[12] ||= (e) => J.summary = e,
							class: "course-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: q.value,
							"aria-invalid": !!Q.value.summary,
							"aria-label": "课程摘要"
						}, null, 8, vt), [[F, J.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "正文",
						prop: "body_html",
						error: Q.value.body_html
					}, {
						default: R(() => [C(P(r), {
							modelValue: J.body_html,
							"onUpdate:modelValue": a[13] ||= (e) => J.body_html = e,
							readonly: K.value,
							disabled: T.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "课程正文"
						}, {
							"image-upload": R(({ url: e, setUrl: t, setBusy: n }) => [C(s, {
								label: "正文图片",
								"model-value": e,
								upload: P(se),
								"onUpdate:modelValue": t,
								onBusyChange: n,
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
			C(P(c), {
				modelValue: A.value,
				"onUpdate:modelValue": a[18] ||= (e) => A.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1,
				onOpened: Se
			}, {
				footer: R(() => [C(P(d), {
					variant: "primary",
					onClick: a[17] ||= (e) => A.value = !1
				}, {
					default: R(() => [...a[33] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [C(P(o), {
					model: J,
					rules: P(ye),
					"label-position": "top",
					onSubmit: a[16] ||= me(() => {}, ["prevent"])
				}, {
					default: R(() => [C(P(i), {
						label: "SEO 描述",
						prop: "seo_description",
						error: Q.value.seo_description
					}, {
						default: R(() => [pe(x("textarea", {
							ref_key: "seoInput",
							ref: Y,
							"onUpdate:modelValue": a[15] ||= (e) => J.seo_description = e,
							class: "course-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: q.value,
							"aria-invalid": !!Q.value.seo_description,
							"aria-label": "SEO 描述"
						}, null, 8, yt), [[F, J.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(c), {
				modelValue: H.value,
				"onUpdate:modelValue": a[20] ||= (e) => H.value = e,
				title: "确认删除",
				subtitle: `操作对象：${J.title || "未命名课程"}`,
				width: "460px",
				"panel-class": "course-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !T.value
			}, {
				"header-actions": R(() => [x("span", bt, [C(P(h), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [C(P(d), {
					disabled: T.value,
					onClick: a[19] ||= (e) => H.value = !1
				}, {
					default: R(() => [...a[34] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(d), {
					variant: "warning",
					loading: T.value,
					onClick: Pe
				}, {
					default: R(() => [...a[35] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [C(P(t), {
					class: "course-delete-dialog__notice",
					type: "warning",
					closable: !1,
					"show-icon": !1,
					description: "确定删除这门课程吗？删除后将不再展示，请谨慎操作。"
				}), U.value ? (k(), v(P(t), {
					key: 0,
					type: "error",
					closable: !1,
					description: U.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, [
				"modelValue",
				"subtitle",
				"before-close"
			]),
			C(P(c), {
				modelValue: de.value,
				"onUpdate:modelValue": a[23] ||= (e) => de.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [C(P(d), { onClick: a[21] ||= (e) => de.value = !1 }, {
					default: R(() => [...a[36] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(d), {
					variant: "primary",
					onClick: a[22] ||= (e) => g("close")
				}, {
					default: R(() => [...a[37] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(c), {
				modelValue: M.value,
				"onUpdate:modelValue": a[25] ||= (e) => M.value = e,
				title: "将课程转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [C(P(d), { onClick: a[24] ||= (e) => M.value = !1 }, {
					default: R(() => [...a[38] ||= [S("取消", -1)]]),
					_: 1
				}), C(P(d), {
					variant: "primary",
					onClick: je
				}, {
					default: R(() => [...a[39] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, ot));
	}
}), [["__scopeId", "data-v-5463d19a"]]), St = { class: "academy-courses" }, Ct = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = he(), { formatDateTime: r } = he(), { academyDifficulties: i, academyPublishStates: a, getAcademyList: o, getAcademyMetadata: s } = Ke(), c = j(!1), l = j(), u = (e) => t([`cms_academy:${e}`]), f = j(), te = ge(s, (e) => {
			f.value = e;
		}), re = [
			...J(),
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
		], ie = _(() => [
			...te.fields,
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
				}, ...(f.value?.categories || []).map((e) => ({
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
		]), { proTableBindings: ae, reload: oe } = te.bindTable(ee({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: ie,
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([e, t]) => e !== "publish_range" && t !== "" && t != null)), a = e.publish_range;
				Array.isArray(a) && a.length === 2 && (i.published_from = (/* @__PURE__ */ new Date(`${a[0]}T00:00:00`)).toISOString(), i.published_to = (/* @__PURE__ */ new Date(`${a[1]}T23:59:59.999`)).toISOString());
				let s = await o("courses", {
					...i,
					page_no: t,
					page_size: n
				}, r);
				return {
					rows: s.lists,
					total: s.count
				};
			}
		})), se = te.loadMetadata;
		function p(e) {
			l.value = e, c.value = !0;
		}
		function m() {
			c.value = !1, oe(), se();
		}
		return (e, t) => (k(), b("div", St, [c.value ? (k(), v(xt, {
			key: 0,
			"course-id": l.value,
			onClose: t[0] ||= (e) => c.value = !1,
			onSaved: m
		}, null, 8, ["course-id"])) : y("", !0), pe(C(P(n), E(P(ae), {
			"auto-refreshable": !1,
			columns: re,
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
			"cell-cms_source_type": R(({ row: e }) => [C(Y, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": R(() => [u("add") ? (k(), v(P(d), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => p()
			}, {
				icon: R(() => [C(P(h), {
					name: "plus",
					size: 14
				})]),
				default: R(() => [t[2] ||= S("新增课程", -1)]),
				_: 1
			})) : y("", !0)]),
			"cell-publish_status": R(({ row: e }) => [C(P(ne), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: R(() => [S(N(P(a).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": R(({ row: e }) => [C(P(ne), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: R(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": R(({ row: e }) => [S(N(P(r)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": R(({ row: e }) => [C(P(d), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑课程" : "课程详情",
				"aria-label": u("edit") ? "编辑课程" : "课程详情",
				onClick: (t) => p(e.id)
			}, {
				default: R(() => [C(P(h), {
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
function wt() {
	let e = he().request, t = "/cms/help", n = (n, r = {}) => e.get({
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
	}, { isOpenRetry: !1 }), s = f(e, "/cms/help/categories/upload"), c = f(e, "/cms/help/upload"), l = [
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
	function ee(e, t) {
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
		getHelpMetadata: n,
		getHelpList: r,
		getHelpDetail: i,
		saveHelp: a,
		deleteHelp: o,
		uploadHelpCategoryImage: s,
		uploadHelpCover: c,
		helpPublishStates: l,
		helpCategoryLabel: ee,
		helpError: u
	};
}
//#endregion
//#region src/cms/views/content/help/EnabledToggle.vue?vue&type=script&setup=true&lang.ts
var Tt = ["aria-checked", "disabled"], Et = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "EnabledToggle",
	props: {
		modelValue: { type: Boolean },
		disabled: { type: Boolean }
	},
	emits: ["update:modelValue"],
	setup(e) {
		return (t, n) => (k(), b("button", {
			type: "button",
			role: "switch",
			class: O(["help-toggle", { "is-on": e.modelValue }]),
			"aria-checked": e.modelValue,
			"aria-label": "启用状态",
			disabled: e.disabled,
			onClick: n[0] ||= (n) => t.$emit("update:modelValue", !e.modelValue)
		}, [n[1] ||= x("span", {
			class: "help-toggle__track",
			"aria-hidden": "true"
		}, [x("span")], -1), x("span", null, N(e.modelValue ? "已启用" : "已停用"), 1)], 10, Tt));
	}
}), [["__scopeId", "data-v-5cfe8693"]]), Dt = { class: "help-categories" }, Ot = ["aria-busy"], kt = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, At = { class: "taxonomy-editor__field" }, jt = { class: "taxonomy-editor__row" }, Mt = "分类", Nt = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { helpError: r, deleteHelp: u, getHelpMetadata: f, getHelpList: te, getHelpDetail: ie, saveHelp: ae, uploadHelpCategoryImage: oe } = wt(), { hasPermission: se } = he(), { formatDateTime: m } = he(), g = (e) => se([`cms_help_category:${e}`]), w = j(), T = j(), D = ge(f, (e) => {
			w.value = e;
		}), O = [
			{
				key: "name",
				dataIndex: "name",
				title: "分类名称",
				width: 210,
				hideable: !1
			},
			...J(),
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
				formatter: (e) => w.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
				formatter: m
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], le = _(() => [
			...D.fields,
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
				}, ...(w.value?.categories || []).filter((e) => !e.parent_id).map((e) => ({
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
		]), { proTableBindings: A, rows: de, reload: M } = D.bindTable(ee({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: le,
			request: async ({ filters: e, signal: t, reason: n }) => {
				let r = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), i = await K((e, n) => te("categories", {
					...r,
					page_no: e,
					page_size: n
				}, t), t);
				return !t.aborted && (n === "query" || n === "reset") && (F.value = Object.keys(r).length ? new Set(i.rows.filter((e) => e.parent_id != null).map((e) => String(e.parent_id))) : /* @__PURE__ */ new Set()), i;
			}
		})), { visibleRows: fe, expanded: F, groups: I, allExpanded: L, toggle: pe, toggleAll: z } = q(de), B = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			image_url: "",
			image_media_id: null,
			sort_order: 10,
			is_enabled: !0
		}), V = ue(B()), H = j(!1), U = j(!1), W = j(!1), _e = j(!1), X = j(!1), Z = j(!1), ve = j(""), ye = j(!1), be = j(""), Q = _(() => !g(V.id ? "edit" : "add")), xe = _(() => _e.value || X.value || H.value), Se;
		async function $(e) {
			Se?.abort(), Se = new AbortController();
			let t = Se;
			Object.assign(V, B(), { id: e || "" }), be.value = "", Z.value = !1, ve.value = "", ye.value = !1, U.value = !0, W.value = !0;
			try {
				if (T.value = await f(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await ie("categories", e, t.signal);
				if (T.value = await f(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
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
				t.signal.aborted || (ye.value = !0, be.value = r(e));
			} finally {
				t.signal.aborted || (W.value = !1);
			}
		}
		function Ce() {
			return xe.value ? !1 : (Se?.abort(), !0);
		}
		function we() {
			Ce() && (U.value = !1);
		}
		async function Te() {
			if (!(Q.value || xe.value || W.value || ye.value)) {
				if (!V.name.trim() || V.sort_order === null) {
					be.value = "请填写分类名称和排序";
					return;
				}
				_e.value = !0, be.value = "";
				try {
					await ae("categories", {
						name: V.name,
						parent_id: V.parent_id || null,
						image_media_id: V.image_media_id,
						sort_order: V.sort_order,
						is_enabled: V.is_enabled,
						id: V.id || void 0,
						row_version: V.id ? V.row_version : void 0
					}), U.value = !1, a.success("保存成功"), await Promise.all([M(), ke()]);
				} catch (e) {
					be.value = r(e);
				} finally {
					_e.value = !1;
				}
			}
		}
		function Ee() {
			!V.id || !g("delete") || xe.value || W.value || ye.value || (ve.value = "", Z.value = !0);
		}
		async function De() {
			if (!(!Z.value || !V.id || !g("delete") || xe.value || W.value || ye.value)) {
				X.value = !0, ve.value = "";
				try {
					await u("categories", V.id, V.row_version), Z.value = !1, U.value = !1, a.success("分类已删除"), await Promise.all([M(), ke()]);
				} catch (e) {
					ve.value = r(e);
				} finally {
					X.value = !1;
				}
			}
		}
		let Oe = _(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(T.value?.categories || []).filter((e) => !e.parent_id && e.id !== V.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), ke = D.loadMetadata;
		return ce(() => {
			Se?.abort();
		}), (e, a) => (k(), b("div", Dt, [
			C(P(n), E(P(A), {
				"auto-refreshable": !1,
				columns: O,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Mt}管理`,
				data: P(fe),
				"show-pagination": !1
			}), {
				"cell-cms_source_type": R(({ row: e }) => [C(Y, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [g("add") ? (k(), v(P(d), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: a[0] ||= (e) => $()
				}, {
					icon: R(() => [C(P(h), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [S("新增" + N(Mt))]),
					_: 1
				})) : y("", !0), C(P(d), {
					size: "sm",
					disabled: !P(I).children.size,
					onClick: P(z)
				}, {
					icon: R(() => [C(P(h), {
						name: P(L) ? "chevron-up" : "chevron-down",
						size: 14
					}, null, 8, ["name"])]),
					default: R(() => [S(" " + N(P(L) ? "全部收起" : "全部展开"), 1)]),
					_: 1
				}, 8, ["disabled", "onClick"])]),
				"cell-name": R(({ row: e }) => [C(G, {
					name: e.name,
					child: e.parent_id != null,
					branch: P(I).children.has(e.id),
					expanded: P(F).has(e.id),
					onToggle: (t) => P(pe)(e.id)
				}, null, 8, [
					"name",
					"child",
					"branch",
					"expanded",
					"onToggle"
				])]),
				"cell-is_enabled": R(({ row: e }) => [C(P(ne), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": R(({ row: e }) => [C(P(d), {
					size: "sm",
					"icon-only": "",
					title: g("edit") ? `编辑${Mt}` : `${Mt}详情`,
					"aria-label": `编辑${Mt}`,
					onClick: (t) => $(e.id)
				}, {
					default: R(() => [C(P(h), {
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
			C(P(c), {
				modelValue: U.value,
				"onUpdate:modelValue": a[10] ||= (e) => U.value = e,
				title: `${V.id ? "编辑" : "新增"}帮助${Mt}`,
				width: "680px",
				subtitle: "帮助分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Ce
			}, {
				footer: R(() => [
					V.id && g("delete") ? (k(), v(P(d), {
						key: 0,
						variant: "danger",
						disabled: W.value || ye.value || xe.value,
						onClick: Ee
					}, {
						icon: R(() => [C(P(h), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [a[14] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(d), {
						disabled: xe.value,
						onClick: we
					}, {
						default: R(() => [...a[15] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Q.value ? y("", !0) : (k(), v(P(d), {
						key: 1,
						variant: "primary",
						loading: _e.value,
						disabled: W.value || ye.value || X.value || H.value,
						onClick: Te
					}, {
						default: R(() => [S("保存" + N(Mt))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": W.value
				}, [
					W.value ? (k(), b("div", kt, [C(P(h), {
						name: "loader-circle",
						class: "help-spin",
						size: 24
					}), x("span", null, "正在读取" + N(Mt) + "...")])) : y("", !0),
					be.value ? (k(), v(P(t), {
						key: 1,
						type: "error",
						closable: !1,
						description: be.value
					}, null, 8, ["description"])) : y("", !0),
					!W.value && !ye.value ? (k(), v(P(o), {
						key: 2,
						model: V,
						"label-position": "top",
						onSubmit: me(Te, ["prevent"])
					}, {
						default: R(() => [
							V.id ? (k(), v(P(i), {
								key: 0,
								label: "分类ID"
							}, {
								default: R(() => [C(P(p), {
									"model-value": V.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : y("", !0),
							C(P(i), {
								label: `${Mt}名称`,
								required: ""
							}, {
								default: R(() => [C(P(p), {
									modelValue: V.name,
									"onUpdate:modelValue": a[1] ||= (e) => V.name = e,
									maxlength: 120,
									disabled: Q.value || xe.value,
									"aria-label": `${Mt}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							C(P(i), { label: "父分类" }, {
								default: R(() => [x("div", At, [C(P(l), {
									modelValue: V.parent_id,
									"onUpdate:modelValue": a[2] ||= (e) => V.parent_id = e,
									options: Oe.value,
									disabled: Q.value || xe.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), a[13] ||= x("p", { class: "help-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类文章。 ", -1)])]),
								_: 1
							}),
							C(P(i), { label: "分类图片" }, {
								default: R(() => [C(s, {
									class: "taxonomy-editor__image",
									modelValue: V.image_url,
									"onUpdate:modelValue": a[3] ||= (e) => V.image_url = e,
									label: "分类图片",
									upload: P(oe),
									disabled: Q.value || xe.value,
									"onUpdate:mediaId": a[4] ||= (e) => V.image_media_id = e,
									onBusyChange: a[5] ||= (e) => H.value = e,
									onStart: a[6] ||= (e) => be.value = "",
									onError: a[7] ||= (e) => be.value = P(r)(e)
								}, null, 8, [
									"modelValue",
									"upload",
									"disabled"
								])]),
								_: 1
							}),
							x("div", jt, [C(P(i), {
								label: "前端排序",
								required: ""
							}, {
								default: R(() => [C(P(re), {
									modelValue: V.sort_order,
									"onUpdate:modelValue": a[8] ||= (e) => V.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Q.value || xe.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(P(i), { label: "启用状态" }, {
								default: R(() => [C(Et, {
									modelValue: V.is_enabled,
									"onUpdate:modelValue": a[9] ||= (e) => V.is_enabled = e,
									disabled: Q.value || xe.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : y("", !0)
				], 8, Ot)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(P(c), {
				modelValue: Z.value,
				"onUpdate:modelValue": a[12] ||= (e) => Z.value = e,
				title: "删除帮助分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !X.value
			}, {
				footer: R(() => [C(P(d), {
					disabled: X.value,
					onClick: a[11] ||= (e) => Z.value = !1
				}, {
					default: R(() => [...a[16] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(d), {
					variant: "danger",
					loading: X.value,
					onClick: De
				}, {
					default: R(() => [...a[17] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [x("p", null, "确认删除分类“" + N(V.name) + "”？有关联文章或子分类的分类无法删除。", 1), ve.value ? (k(), v(P(t), {
					key: 0,
					type: "error",
					closable: !1,
					description: ve.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"])
		]));
	}
}), [["__scopeId", "data-v-52a5768d"]]), Pt = ["aria-busy"], Ft = { class: "article-editor__header" }, It = { class: "article-editor__heading" }, Lt = { class: "article-editor__commands" }, Rt = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, zt = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Bt = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, Vt = {
	key: 1,
	class: "article-editor__failure"
}, Ht = {
	key: 0,
	class: "article-editor__error"
}, Ut = { class: "article-editor__body" }, Wt = { class: "article-editor__settings" }, Gt = { class: "article-editor__related" }, Kt = { class: "article-editor__content" }, qt = ["aria-invalid", "disabled"], Jt = ["aria-invalid", "disabled"], Yt = {
	class: "help-delete-dialog__icon",
	"aria-hidden": "true"
}, Xt = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(e, { emit: n }) {
		let { helpError: ee, helpCategoryLabel: u, deleteHelp: f, getHelpDetail: te, getHelpMetadata: ne, getHelpList: ie, saveHelp: ae, uploadHelpCover: oe } = wt(), { hasPermission: se } = he(), m = e, w = n, T = j(!0), E = j(!1), D = j(!1), O = j(""), A = j(!1), de = j(!1), M = j(!1), fe = j(!1), I = j(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), L = j(), B = j("draft"), H = j(!1), U = _(() => se(["cms_help:publish"])), W = _(() => !se([`cms_help:${m.articleId ? "edit" : "add"}`]) || !U.value && B.value !== "draft"), G = _(() => se(["cms_help:delete"]) && (U.value || B.value === "draft"));
		async function K() {
			if (!(!G.value || E.value || T.value || D.value)) {
				E.value = !0, O.value = "";
				try {
					await f("articles", J.id, J.row_version), Ae = JSON.stringify(J), a.success("文章已删除"), w("saved");
				} catch (e) {
					O.value = ee(e), fe.value = !1;
				} finally {
					E.value = !1;
				}
			}
		}
		let q = _(() => W.value || E.value), J = ue({
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
		}), { editorRoot: ge, seoInput: Y, fieldRules: _e, fieldErrors: X, pendingCount: Z, saveError: ve, validateSave: ye, setSaveFailure: be, focusFirstError: Q, focusSeoError: xe } = De(J, () => L.value?.categories || [], "help", A), Se = j(""), $ = j(!1), Ce = j([]), we = _(() => Ce.value.filter((e) => e.id !== m.articleId).map((e) => ({
			label: `${e.title} · ${e.code}`,
			value: e.id
		})));
		async function Te() {
			if (!(q.value || $.value)) {
				$.value = !0;
				try {
					let e = await ie("articles", {
						keyword: Se.value,
						page_size: 100
					}, je?.signal), t = Ce.value.filter((e) => J.related_content_ids.includes(e.id));
					Ce.value = [...new Map([...t, ...e.lists].map((e) => [e.id, e])).values()];
				} catch (e) {
					je?.signal.aborted || (O.value = ee(e));
				} finally {
					$.value = !1;
				}
			}
		}
		let Ee = _(() => (L.value?.categories || []).filter((e) => e.parent_id != null).map((e) => ({
			label: u(L.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), Oe = _(() => L.value?.categories.find((e) => e.id === J.category_id && e.parent_id == null)), ke = _({
			get: () => Oe.value ? "" : J.category_id,
			set: (e) => {
				J.category_id = e;
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
			T.value = !0, D.value = !1, O.value = "";
			try {
				if (L.value = await ne(e.signal, { cms_source_type: "platform" }), m.articleId) {
					let t = await te("articles", m.articleId, e.signal);
					if (L.value = await ne(e.signal, { space_id: String(t.space_id) }), I.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"sort_order",
						"is_enabled"
					]) Object.assign(J, { [e]: t[e] });
					J.category_id = t.category_id || "", J.search_keywords = t.search_keywords || "", J.helpful_enabled = t.helpful_enabled ?? !0, J.related_content_ids = t.related_content_ids || [], Ce.value = t.related_articles || [];
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url",
						"content_source",
						"author_name"
					]) J[e] = t[e] || "";
					J.scheduled_local = t.publish_status === "scheduled" ? Me(t.scheduled_at) : "", B.value = t.publish_status;
				}
				Ae = JSON.stringify(J);
			} catch (t) {
				e.signal.aborted || (O.value = ee(t), D.value = !0);
			} finally {
				e.signal.aborted || (T.value = !1);
			}
		}
		let Pe = () => !T.value && !D.value && Ae !== JSON.stringify(J);
		function Fe() {
			Pe() ? de.value = !0 : w("close");
		}
		function Ie() {
			B.value === "draft" ? Re("draft") : M.value = !0;
		}
		function Le() {
			M.value = !1, Re("draft");
		}
		async function Re(e) {
			if (q.value || T.value || D.value || H.value || (O.value = "", !await ye(e))) return;
			let t = J.scheduled_local ? new Date(J.scheduled_local) : null;
			E.value = !0, O.value = "";
			try {
				await ae("articles", {
					...J,
					id: J.id || void 0,
					row_version: J.id ? J.row_version : void 0,
					category_id: J.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), Ae = JSON.stringify(J), a.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "文章已发布"), w("saved");
			} catch (e) {
				be(e);
			} finally {
				E.value = !1;
			}
			Z.value && await Q();
		}
		function ze(e) {
			O.value = ee(e);
		}
		let Be = (e) => {
			Pe() && (e.preventDefault(), e.returnValue = "");
		};
		return V(() => !E.value && !H.value && (!Pe() || window.confirm("文章有未保存的修改，确定离开？"))), le(() => {
			Ne(), window.addEventListener("beforeunload", Be);
		}), ce(() => {
			je?.abort(), window.removeEventListener("beforeunload", Be);
		}), (n, a) => (k(), b("section", {
			ref_key: "editorRoot",
			ref: ge,
			class: "article-editor",
			"aria-busy": T.value || E.value
		}, [
			x("header", Ft, [
				C(P(d), {
					"icon-only": "",
					title: "返回文章列表",
					"aria-label": "返回文章列表",
					disabled: E.value || H.value,
					onClick: Fe
				}, {
					default: R(() => [C(P(h), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", It, [x("h2", null, N(e.articleId ? "编辑文章" : "新增文章"), 1), x("span", null, N(L.value?.source_locale || "zh-CN") + " · " + N(I.value), 1)]),
				x("div", Lt, [
					e.articleId && G.value ? (k(), v(P(d), {
						key: 0,
						size: "sm",
						disabled: T.value || D.value || E.value || H.value,
						onClick: a[0] ||= (e) => fe.value = !0
					}, {
						default: R(() => [...a[32] ||= [S("删除文章", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(d), {
						size: "sm",
						disabled: T.value || D.value,
						onClick: a[1] ||= (e) => A.value = !0
					}, {
						icon: R(() => [C(P(h), {
							name: "search",
							size: 14
						})]),
						default: R(() => [a[33] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					W.value ? y("", !0) : (k(), v(P(d), {
						key: 1,
						size: "sm",
						disabled: T.value || D.value || E.value || H.value,
						onClick: Ie
					}, {
						icon: R(() => [C(P(h), {
							name: "save",
							size: 14
						})]),
						default: R(() => [a[34] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					P(ve) ? (k(), b("span", Rt, N(P(ve)), 1)) : y("", !0),
					!W.value && P(Z) ? (k(), b("span", zt, "还有 " + N(P(Z)) + " 项待完善", 1)) : y("", !0),
					!W.value && U.value ? (k(), v(P(d), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: T.value || D.value || H.value,
						loading: E.value,
						onClick: a[2] ||= (e) => Re(J.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [C(P(h), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [S(N(J.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)
				])
			]),
			T.value ? (k(), b("div", Bt, [C(P(h), {
				name: "loader-circle",
				class: "help-spin",
				size: 28
			}), a[35] ||= x("span", null, "正在读取文章资料...", -1)])) : D.value ? (k(), b("div", Vt, [C(P(t), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"]), C(P(d), { onClick: Ne }, {
				default: R(() => [...a[36] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (k(), b(g, { key: 2 }, [O.value ? (k(), b("div", Ht, [C(P(t), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"])])) : y("", !0), x("div", Ut, [x("aside", Wt, [C(P(o), {
				model: J,
				rules: P(_e),
				"label-position": "top",
				onSubmit: a[16] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					C(P(i), {
						label: "文章分类",
						prop: "category_id",
						error: P(X).category_id,
						required: ""
					}, {
						default: R(() => [C(P(l), {
							modelValue: ke.value,
							"onUpdate:modelValue": a[3] ||= (e) => ke.value = e,
							options: Ee.value,
							placeholder: Oe.value ? "原分类：" + Oe.value.name + "（请选择二级分类）" : "请选择二级分类",
							clearable: "",
							disabled: q.value,
							"aria-label": "文章分类"
						}, null, 8, [
							"modelValue",
							"options",
							"placeholder",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					a[39] ||= x("h3", null, "文章设置", -1),
					C(P(i), {
						label: "文章封面",
						prop: "cover_url",
						error: P(X).cover_url
					}, {
						default: R(() => [C(s, {
							modelValue: J.cover_url,
							"onUpdate:modelValue": a[4] ||= (e) => J.cover_url = e,
							label: "文章封面",
							disabled: q.value,
							upload: P(oe),
							onBusyChange: a[5] ||= (e) => H.value = e,
							onStart: a[6] ||= (e) => O.value = "",
							onError: ze
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "内容来源",
						prop: "content_source",
						error: P(X).content_source
					}, {
						default: R(() => [C(P(p), {
							modelValue: J.content_source,
							"onUpdate:modelValue": a[7] ||= (e) => J.content_source = e,
							maxlength: 160,
							disabled: q.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "作者署名",
						prop: "author_name",
						error: P(X).author_name
					}, {
						default: R(() => [C(P(p), {
							modelValue: J.author_name,
							"onUpdate:modelValue": a[8] ||= (e) => J.author_name = e,
							maxlength: 120,
							disabled: q.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "前端排序",
						prop: "sort_order",
						error: P(X).sort_order
					}, {
						default: R(() => [C(P(re), {
							modelValue: J.sort_order,
							"onUpdate:modelValue": a[9] ||= (e) => J.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: q.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[40] ||= x("h3", null, "发布设置", -1),
					C(P(i), {
						label: "搜索关键词",
						prop: "search_keywords",
						error: P(X).search_keywords
					}, {
						default: R(() => [C(P(p), {
							modelValue: J.search_keywords,
							"onUpdate:modelValue": a[10] ||= (e) => J.search_keywords = e,
							maxlength: 2e3,
							disabled: q.value,
							placeholder: "使用空格或逗号分隔",
							"aria-label": "搜索关键词"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: P(X).helpful_enabled
					}, {
						default: R(() => [C(Et, {
							modelValue: J.helpful_enabled,
							"onUpdate:modelValue": a[11] ||= (e) => J.helpful_enabled = e,
							disabled: q.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "相关文章",
						prop: "related_content_ids",
						error: P(X).related_content_ids
					}, {
						default: R(() => [x("div", Gt, [
							C(P(p), {
								modelValue: Se.value,
								"onUpdate:modelValue": a[12] ||= (e) => Se.value = e,
								disabled: q.value,
								placeholder: "搜索文章标题",
								"aria-label": "搜索相关文章",
								onKeydown: z(me(Te, ["prevent"]), ["enter"])
							}, null, 8, [
								"modelValue",
								"disabled",
								"onKeydown"
							]),
							C(P(d), {
								size: "sm",
								disabled: q.value,
								loading: $.value,
								onClick: Te
							}, {
								default: R(() => [...a[37] ||= [S("查找文章", -1)]]),
								_: 1
							}, 8, ["disabled", "loading"]),
							C(P(l), {
								modelValue: J.related_content_ids,
								"onUpdate:modelValue": a[13] ||= (e) => J.related_content_ids = e,
								options: we.value,
								multiple: "",
								clearable: "",
								disabled: q.value,
								"aria-label": "相关文章"
							}, null, 8, [
								"modelValue",
								"options",
								"disabled"
							]),
							a[38] ||= x("p", { class: "article-editor__hint" }, " 最多 20 篇，按选择顺序展示。可关联草稿，前台须按发布状态过滤。 ", -1)
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "启用状态",
						prop: "is_enabled",
						error: P(X).is_enabled
					}, {
						default: R(() => [C(Et, {
							modelValue: J.is_enabled,
							"onUpdate:modelValue": a[14] ||= (e) => J.is_enabled = e,
							disabled: q.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: P(X).scheduled_local
					}, {
						default: R(() => [C(P(p), {
							modelValue: J.scheduled_local,
							"onUpdate:modelValue": a[15] ||= (e) => J.scheduled_local = e,
							type: "datetime-local",
							disabled: q.value || !U.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[41] ||= x("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", Kt, [C(P(o), {
				model: J,
				rules: P(_e),
				"label-position": "top",
				onSubmit: a[20] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					C(P(i), {
						label: "标题",
						prop: "title",
						error: P(X).title,
						required: ""
					}, {
						default: R(() => [C(P(p), {
							modelValue: J.title,
							"onUpdate:modelValue": a[17] ||= (e) => J.title = e,
							maxlength: 255,
							disabled: q.value,
							placeholder: "输入文章标题",
							"aria-label": "文章标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "摘要",
						prop: "summary",
						error: P(X).summary
					}, {
						default: R(() => [pe(x("textarea", {
							"onUpdate:modelValue": a[18] ||= (e) => J.summary = e,
							"aria-invalid": !!P(X).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: q.value,
							"aria-label": "文章摘要"
						}, null, 8, qt), [[F, J.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "正文",
						prop: "body_html",
						error: P(X).body_html
					}, {
						default: R(() => [C(P(r), {
							modelValue: J.body_html,
							"onUpdate:modelValue": a[19] ||= (e) => J.body_html = e,
							readonly: W.value,
							disabled: E.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "文章正文"
						}, {
							"image-upload": R(({ url: e, setUrl: t, setBusy: n }) => [C(s, {
								label: "正文图片",
								"model-value": e,
								upload: P(oe),
								"onUpdate:modelValue": t,
								onBusyChange: n,
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
			C(P(c), {
				modelValue: A.value,
				"onUpdate:modelValue": a[24] ||= (e) => A.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: R(() => [C(P(d), {
					variant: "primary",
					onClick: a[23] ||= (e) => A.value = !1
				}, {
					default: R(() => [...a[42] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [C(P(o), {
					model: J,
					rules: P(_e),
					"label-position": "top",
					onSubmit: a[22] ||= me(() => {}, ["prevent"])
				}, {
					default: R(() => [C(P(i), {
						label: "SEO 描述",
						prop: "seo_description",
						error: P(X).seo_description
					}, {
						default: R(() => [pe(x("textarea", {
							ref_key: "seoInput",
							ref: Y,
							"onUpdate:modelValue": a[21] ||= (e) => J.seo_description = e,
							"aria-invalid": !!P(X).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: q.value,
							"aria-label": "SEO 描述"
						}, null, 8, Jt), [[F, J.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(c), {
				modelValue: fe.value,
				"onUpdate:modelValue": a[26] ||= (e) => fe.value = e,
				title: "确认删除",
				subtitle: `操作对象：${J.title || "未命名文章"}`,
				width: "460px",
				"panel-class": "help-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !E.value
			}, {
				"header-actions": R(() => [x("span", Yt, [C(P(h), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [C(P(d), {
					disabled: E.value,
					onClick: a[25] ||= (e) => fe.value = !1
				}, {
					default: R(() => [...a[43] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(d), {
					variant: "warning",
					loading: E.value,
					onClick: K
				}, {
					default: R(() => [...a[44] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [C(P(t), {
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
			C(P(c), {
				modelValue: de.value,
				"onUpdate:modelValue": a[29] ||= (e) => de.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [C(P(d), { onClick: a[27] ||= (e) => de.value = !1 }, {
					default: R(() => [...a[45] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(d), {
					variant: "primary",
					onClick: a[28] ||= (e) => w("close")
				}, {
					default: R(() => [...a[46] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(c), {
				modelValue: M.value,
				"onUpdate:modelValue": a[31] ||= (e) => M.value = e,
				title: "将文章转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [C(P(d), { onClick: a[30] ||= (e) => M.value = !1 }, {
					default: R(() => [...a[47] ||= [S("取消", -1)]]),
					_: 1
				}), C(P(d), {
					variant: "primary",
					onClick: Le
				}, {
					default: R(() => [...a[48] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Pt));
	}
}), [["__scopeId", "data-v-438b969d"]]), Zt = { class: "help-articles" }, Qt = {
	key: 0,
	class: "help-statistics-note"
}, $t = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let t = he(), { helpPublishStates: r, helpCategoryLabel: i, getHelpList: a, getHelpMetadata: o } = wt(), { hasPermission: s } = he(), { formatDateTime: c } = he(), l = j(!1), u = j(), f = (e) => s([`cms_help:${e}`]), te = j(), re = ge(o, (e) => {
			te.value = e;
		}), ie = [
			...J(),
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
				formatter: (e) => i(te.value, e)
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
		], ae = _(() => [
			...re.fields,
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
				}, ...(te.value?.categories || []).map((e) => ({
					label: i(te.value, e.id),
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
		]), { proTableBindings: oe, reload: se } = re.bindTable(ee({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: ae,
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
		})), p = re.loadMetadata;
		function m(e) {
			u.value = e, l.value = !0;
		}
		function g() {
			l.value = !1, se(), p();
		}
		return (e, i) => (k(), b("div", Zt, [
			!l.value && P(t).mode === "platform" ? (k(), b("p", Qt, " 当前管理平台默认模板。浏览量、评价数及有帮助率属于站点运行数据，此处显示“—”，不汇总白标站点。 ")) : y("", !0),
			l.value ? (k(), v(Xt, {
				key: 1,
				"article-id": u.value,
				onClose: i[0] ||= (e) => l.value = !1,
				onSaved: g
			}, null, 8, ["article-id"])) : y("", !0),
			pe(C(P(n), E(P(oe), {
				"auto-refreshable": !1,
				columns: ie,
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
				"cell-cms_source_type": R(({ row: e }) => [C(Y, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [f("add") ? (k(), v(P(d), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: i[1] ||= (e) => m()
				}, {
					icon: R(() => [C(P(h), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [i[2] ||= S("新增文章", -1)]),
					_: 1
				})) : y("", !0)]),
				"cell-publish_status": R(({ row: e }) => [C(P(ne), {
					size: "sm",
					effect: "soft",
					type: e.publish_status === "published" ? "success" : "warning"
				}, {
					default: R(() => [S(N(P(r).find((t) => t.value === e.publish_status)?.label), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-is_enabled": R(({ row: e }) => [C(P(ne), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-publish_time": R(({ row: e }) => [S(N(P(c)(e.published_at || e.scheduled_at)), 1)]),
				"cell-actions": R(({ row: e }) => [C(P(d), {
					size: "sm",
					"icon-only": "",
					title: f("edit") ? "编辑文章" : "文章详情",
					"aria-label": f("edit") ? "编辑文章" : "文章详情",
					onClick: (t) => m(e.id)
				}, {
					default: R(() => [C(P(h), {
						name: f("edit") ? "square-pen" : "panel-right-open",
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
function en() {
	let e = he().request, t = "/cms/feedback", n = (n, r) => e.get({
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
	function c(e) {
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
		feedbackError: c
	};
}
//#endregion
//#region src/cms/views/content/feedback/list/index.vue?vue&type=script&setup=true&lang.ts
var tn = { class: "feedback-page" }, nn = ["aria-busy"], rn = {
	key: 0,
	role: "status"
}, an = { class: "feedback-info" }, on = { class: "feedback-content" }, sn = {
	key: 0,
	class: "muted"
}, cn = { class: "attachment-title" }, ln = ["src", "alt"], un = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { getFeedbackList: r, getFeedbackMetadata: i, getFeedbackDetail: a, getFeedbackAttachment: o, feedbackSourceTypes: s, feedbackSourceLabel: l, feedbackError: u } = en(), { formatDateTime: f } = he(), te = j({
			scenes: [],
			issues: []
		}), re = ge(i, (e) => {
			te.value = e;
		}), ie = [
			...J(),
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
				formatter: f
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				fixed: "right",
				align: "center",
				hideable: !1
			}
		], ae = _(() => [
			...re.fields,
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
				}, ...te.value.scenes.map((e) => ({
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
				}, ...te.value.issues.map((e) => ({
					label: `${te.value.scenes.find((t) => t.id === e.scene_id)?.name || "—"} / ${e.name}`,
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
		]), { proTableBindings: oe } = re.bindTable(ee({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: ae,
			request: async ({ filters: e, page: t, pageSize: n, signal: i }) => {
				let a = Object.fromEntries(Object.entries(e).filter(([e, t]) => e !== "submitted_range" && t !== "" && t != null)), o = e.submitted_range;
				Array.isArray(o) && o.length === 2 && (a.submitted_from = (/* @__PURE__ */ new Date(`${o[0]}T00:00:00`)).toISOString(), a.submitted_to = (/* @__PURE__ */ new Date(`${o[1]}T23:59:59.999`)).toISOString());
				let s = await r({
					...a,
					page_no: t,
					page_size: n
				}, i);
				return {
					rows: s.lists,
					total: s.count
				};
			}
		})), se = j(!1), p = j(!1), m = j(""), w = j(), T = j({}), D = j(""), O;
		async function le(e) {
			O?.abort();
			let t = new AbortController();
			O = t, w.value = void 0, T.value = {}, m.value = "", D.value = "", se.value = !0, p.value = !0;
			try {
				let n = await a(e, t.signal);
				t.signal.aborted || (w.value = n);
			} catch (e) {
				t.signal.aborted || (m.value = u(e));
			} finally {
				t.signal.aborted || (p.value = !1);
			}
		}
		async function A(e) {
			let t = O, n = w.value?.id;
			if (!(!t || !n || D.value)) {
				D.value = e, m.value = "";
				try {
					let r = await o(n, e, t.signal);
					!t.signal.aborted && /^data:image\/(png|jpeg|webp|svg\+xml|x-icon|vnd\.microsoft\.icon);base64,[A-Za-z0-9+/=]+$/.test(r.data_url) && (T.value[e] = r.data_url);
				} catch (e) {
					t.signal.aborted || (m.value = u(e));
				} finally {
					t.signal.aborted || (D.value = "");
				}
			}
		}
		return L(se, (e) => {
			e || (O?.abort(), w.value = void 0, T.value = {}, m.value = "");
		}), ce(() => {
			O?.abort();
		}), (e, r) => (k(), b("div", tn, [C(P(n), E(P(oe), {
			"auto-refreshable": !1,
			columns: ie,
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
			"cell-cms_source_type": R(({ row: e }) => [C(Y, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"cell-source_type": R(({ row: e }) => [C(P(ne), {
				size: "sm",
				effect: "soft",
				type: e.source_type === "merchant" ? "warning" : e.source_type === "platform" ? "success" : "primary"
			}, {
				default: R(() => [S(N(P(l)(e.source_type)), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-actions": R(({ row: e }) => [C(P(d), {
				size: "sm",
				"icon-only": "",
				title: "查看反馈",
				"aria-label": "查看反馈",
				onClick: (t) => le(e.id)
			}, {
				default: R(() => [C(P(h), {
					name: "eye",
					size: 15
				})]),
				_: 1
			}, 8, ["onClick"])]),
			_: 1
		}, 16), C(P(c), {
			modelValue: se.value,
			"onUpdate:modelValue": r[1] ||= (e) => se.value = e,
			title: "反馈详情",
			subtitle: w.value?.code || "查看用户正式提交的意见反馈",
			width: "760px",
			"close-on-click-modal": !1
		}, {
			footer: R(() => [C(P(d), { onClick: r[0] ||= (e) => se.value = !1 }, {
				default: R(() => [...r[14] ||= [S("关闭", -1)]]),
				_: 1
			})]),
			default: R(() => [x("div", {
				class: "feedback-detail",
				"aria-busy": p.value
			}, [
				p.value ? (k(), b("p", rn, "正在读取反馈…")) : y("", !0),
				m.value ? (k(), v(P(t), {
					key: 1,
					type: "error",
					closable: !1,
					description: m.value
				}, null, 8, ["description"])) : y("", !0),
				w.value && !p.value ? (k(), b(g, { key: 2 }, [
					x("dl", an, [
						x("div", null, [r[2] ||= x("dt", null, "UID", -1), x("dd", null, N(w.value.public_user_id_snapshot), 1)]),
						x("div", null, [r[3] ||= x("dt", null, "用户账号", -1), x("dd", null, N(w.value.username_snapshot || "—"), 1)]),
						x("div", null, [r[4] ||= x("dt", null, "来源类型", -1), x("dd", null, N(P(l)(w.value.source_type)), 1)]),
						x("div", null, [r[5] ||= x("dt", null, "来源名称", -1), x("dd", null, N(w.value.source_name_snapshot || "—"), 1)]),
						x("div", null, [r[6] ||= x("dt", null, "业务场景", -1), x("dd", null, N(w.value.scene_name_snapshot), 1)]),
						x("div", null, [r[7] ||= x("dt", null, "问题分类", -1), x("dd", null, N(w.value.issue_category_name_snapshot), 1)]),
						x("div", null, [r[8] ||= x("dt", null, "联系方式（脱敏）", -1), x("dd", null, N(w.value.contact_display), 1)]),
						x("div", null, [r[9] ||= x("dt", null, "提交时间", -1), x("dd", null, N(P(f)(w.value.submitted_at)), 1)])
					]),
					x("section", null, [r[10] ||= x("h3", null, "反馈内容", -1), x("div", on, N(w.value.content), 1)]),
					x("section", null, [
						x("h3", null, [r[11] ||= S(" 附件 ", -1), x("span", null, N(w.value.attachments?.length || 0), 1)]),
						w.value.attachments?.length ? y("", !0) : (k(), b("p", sn, "暂无附件")),
						(k(!0), b(g, null, de(w.value.attachments, (e) => (k(), b("div", {
							key: e.id,
							class: "feedback-attachment"
						}, [x("div", cn, [x("span", null, N(e.original_name || "图片附件") + " · " + N(Math.ceil(e.byte_size / 1024)) + " KB", 1), C(P(d), {
							size: "sm",
							loading: D.value === e.id,
							onClick: (t) => A(e.id)
						}, {
							default: R(() => [...r[12] ||= [S("查看图片", -1)]]),
							_: 1
						}, 8, ["loading", "onClick"])]), T.value[e.id] ? (k(), b("img", {
							key: 0,
							src: T.value[e.id],
							alt: e.original_name || "反馈图片"
						}, null, 8, ln)) : y("", !0)]))), 128))
					]),
					r[13] ||= x("p", { class: "muted" }, "来源和分类为提交时快照；此页面仅查看，不修改用户原始反馈。", -1)
				], 64)) : y("", !0)
			], 8, nn)]),
			_: 1
		}, 8, ["modelValue", "subtitle"])]));
	}
}), [["__scopeId", "data-v-750f3a8a"]]);
//#endregion
//#region src/cms/api/content/announcement.ts
function dn() {
	let e = he().request, t = "/cms/announcement", n = (n, r = {}) => e.get({
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
	}, { isOpenRetry: !1 }), s = f(e, "/cms/announcement/upload"), c = f(e, "/cms/announcement/categories/upload"), l = [
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
	function ee(e, t) {
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
		getAnnouncementMetadata: n,
		getAnnouncementList: r,
		getAnnouncementDetail: i,
		saveAnnouncement: a,
		deleteAnnouncement: o,
		uploadAnnouncementCover: s,
		uploadAnnouncementCategoryImage: c,
		announcementPublishStates: l,
		announcementCategoryLabel: ee,
		announcementError: u
	};
}
//#endregion
//#region src/cms/views/content/announcement/categories/index.vue?vue&type=script&setup=true&lang.ts
var fn = { class: "announcement-categories" }, pn = ["aria-busy"], mn = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, hn = { class: "taxonomy-editor__field" }, gn = { class: "taxonomy-editor__row" }, _n = "分类", vn = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { hasPermission: r } = he(), { formatDateTime: u } = he(), { announcementError: f, deleteAnnouncement: te, getAnnouncementMetadata: ie, getAnnouncementList: ae, getAnnouncementDetail: oe, saveAnnouncement: se, uploadAnnouncementCategoryImage: m } = dn(), g = (e) => r([`cms_announcement_category:${e}`]), w = j(), T = j(), D = ge(ie, (e) => {
			w.value = e;
		}), O = [
			{
				key: "name",
				dataIndex: "name",
				title: "分类名称",
				width: 210,
				hideable: !1
			},
			...J(),
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
				formatter: (e) => w.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
				formatter: u
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], le = [
			...D.fields,
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
		], { proTableBindings: A, rows: de, reload: M } = D.bindTable(ee({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: le,
			request: async ({ filters: e, signal: t, reason: n }) => {
				let r = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), i = await K((e, n) => ae("categories", {
					...r,
					page_no: e,
					page_size: n
				}, t), t);
				return !t.aborted && (n === "query" || n === "reset") && (F.value = Object.keys(r).length ? new Set(i.rows.filter((e) => e.parent_id != null).map((e) => String(e.parent_id))) : /* @__PURE__ */ new Set()), i;
			}
		})), { visibleRows: fe, expanded: F, groups: I, allExpanded: L, toggle: pe, toggleAll: z } = q(de), B = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			image_url: "",
			image_media_id: null,
			sort_order: 10,
			is_enabled: !0
		}), V = ue(B()), H = j(!1), U = j(!1), W = j(!1), _e = j(!1), X = j(!1), ve = j(""), ye = j(!1), be = j(""), Q = j(!1), xe = _(() => !g(V.id ? "edit" : "add")), Se = j(!1), $ = _(() => W.value || _e.value || Se.value), Ce = "", we;
		async function Te(e) {
			we?.abort(), we = new AbortController();
			let t = we;
			Object.assign(V, B(), { id: e || "" }), be.value = "", X.value = !1, ve.value = "", ye.value = !1, H.value = !0, U.value = !0, Ce = JSON.stringify(V);
			try {
				if (T.value = await ie(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await oe("categories", e, t.signal);
				if (T.value = await ie(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
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
				t.signal.aborted || (ye.value = !0, be.value = f(e));
			} finally {
				t.signal.aborted || (U.value = !1);
			}
		}
		function Ee() {
			return $.value ? !1 : !U.value && !ye.value && JSON.stringify(V) !== Ce ? (Q.value = !0, !1) : (we?.abort(), !0);
		}
		function De() {
			Ee() && (H.value = !1);
		}
		function Oe() {
			we?.abort(), Q.value = !1, H.value = !1;
		}
		async function ke() {
			if (!(xe.value || $.value || U.value || ye.value)) {
				if (!V.name.trim() || V.sort_order === null) {
					be.value = "请填写分类名称和排序";
					return;
				}
				W.value = !0, be.value = "";
				try {
					await se("categories", {
						name: V.name,
						parent_id: V.parent_id || null,
						image_media_id: V.image_media_id,
						sort_order: V.sort_order,
						is_enabled: V.is_enabled,
						id: V.id || void 0,
						row_version: V.id ? V.row_version : void 0
					}), H.value = !1, a.success("保存成功"), await Promise.all([M(), Ne()]);
				} catch (e) {
					be.value = f(e);
				} finally {
					W.value = !1;
				}
			}
		}
		function Ae() {
			!V.id || !g("delete") || $.value || U.value || ye.value || (ve.value = "", X.value = !0);
		}
		async function je() {
			if (!(!X.value || !V.id || !g("delete") || $.value || U.value || ye.value)) {
				_e.value = !0, ve.value = "";
				try {
					await te("categories", V.id, V.row_version), X.value = !1, H.value = !1, a.success("分类已删除"), await Promise.all([M(), Ne()]);
				} catch (e) {
					ve.value = f(e);
				} finally {
					_e.value = !1;
				}
			}
		}
		let Me = _(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(T.value?.categories || []).filter((e) => !e.parent_id && e.id !== V.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Ne = D.loadMetadata;
		return ce(() => {
			we?.abort();
		}), (e, r) => (k(), b("div", fn, [
			C(P(n), E(P(A), {
				"auto-refreshable": !1,
				columns: O,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${_n}管理`,
				data: P(fe),
				"show-pagination": !1
			}), {
				"cell-cms_source_type": R(({ row: e }) => [C(Y, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [g("add") ? (k(), v(P(d), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => Te()
				}, {
					icon: R(() => [C(P(h), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [S("新增" + N(_n))]),
					_: 1
				})) : y("", !0), C(P(d), {
					size: "sm",
					disabled: !P(I).children.size,
					onClick: P(z)
				}, {
					icon: R(() => [C(P(h), {
						name: P(L) ? "chevron-up" : "chevron-down",
						size: 14
					}, null, 8, ["name"])]),
					default: R(() => [S(" " + N(P(L) ? "全部收起" : "全部展开"), 1)]),
					_: 1
				}, 8, ["disabled", "onClick"])]),
				"cell-name": R(({ row: e }) => [C(G, {
					name: e.name,
					child: e.parent_id != null,
					branch: P(I).children.has(e.id),
					expanded: P(F).has(e.id),
					onToggle: (t) => P(pe)(e.id)
				}, null, 8, [
					"name",
					"child",
					"branch",
					"expanded",
					"onToggle"
				])]),
				"cell-is_enabled": R(({ row: e }) => [C(P(ne), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": R(({ row: e }) => [C(P(d), {
					size: "sm",
					"icon-only": "",
					title: g("edit") ? `编辑${_n}` : `${_n}详情`,
					"aria-label": g("edit") ? `编辑${_n}` : `${_n}详情`,
					onClick: (t) => Te(e.id)
				}, {
					default: R(() => [C(P(h), {
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
			C(P(c), {
				modelValue: H.value,
				"onUpdate:modelValue": r[10] ||= (e) => H.value = e,
				title: `${V.id ? "编辑" : "新增"}公告${_n}`,
				width: "680px",
				subtitle: "公告分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Ee
			}, {
				footer: R(() => [
					V.id && g("delete") ? (k(), v(P(d), {
						key: 0,
						variant: "danger",
						disabled: U.value || ye.value || $.value,
						onClick: Ae
					}, {
						icon: R(() => [C(P(h), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [r[16] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(d), {
						disabled: $.value,
						onClick: De
					}, {
						default: R(() => [...r[17] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					xe.value ? y("", !0) : (k(), v(P(d), {
						key: 1,
						variant: "primary",
						loading: W.value,
						disabled: U.value || ye.value || _e.value || Se.value,
						onClick: ke
					}, {
						default: R(() => [S("保存" + N(_n))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": U.value
				}, [
					U.value ? (k(), b("div", mn, [C(P(h), {
						name: "loader-circle",
						class: "announcement-spin",
						size: 24
					}), x("span", null, "正在读取" + N(_n) + "...")])) : y("", !0),
					be.value ? (k(), v(P(t), {
						key: 1,
						type: "error",
						closable: !1,
						description: be.value
					}, null, 8, ["description"])) : y("", !0),
					!U.value && !ye.value ? (k(), v(P(o), {
						key: 2,
						model: V,
						"label-position": "top",
						onSubmit: me(ke, ["prevent"])
					}, {
						default: R(() => [
							V.id ? (k(), v(P(i), {
								key: 0,
								label: "分类ID"
							}, {
								default: R(() => [C(P(p), {
									"model-value": V.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : y("", !0),
							C(P(i), {
								label: `${_n}名称`,
								required: ""
							}, {
								default: R(() => [C(P(p), {
									modelValue: V.name,
									"onUpdate:modelValue": r[1] ||= (e) => V.name = e,
									maxlength: 120,
									disabled: xe.value || $.value,
									"aria-label": `${_n}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							C(P(i), { label: "父分类" }, {
								default: R(() => [x("div", hn, [C(P(l), {
									modelValue: V.parent_id,
									"onUpdate:modelValue": r[2] ||= (e) => V.parent_id = e,
									options: Me.value,
									disabled: xe.value || $.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), r[15] ||= x("p", { class: "announcement-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类公告。 ", -1)])]),
								_: 1
							}),
							C(P(i), { label: "分类图片" }, {
								default: R(() => [C(s, {
									class: "taxonomy-editor__image",
									modelValue: V.image_url,
									"onUpdate:modelValue": r[3] ||= (e) => V.image_url = e,
									label: "分类图片",
									upload: P(m),
									disabled: xe.value || $.value,
									"onUpdate:mediaId": r[4] ||= (e) => V.image_media_id = e,
									onBusyChange: r[5] ||= (e) => Se.value = e,
									onStart: r[6] ||= (e) => be.value = "",
									onError: r[7] ||= (e) => be.value = P(f)(e)
								}, null, 8, [
									"modelValue",
									"upload",
									"disabled"
								])]),
								_: 1
							}),
							x("div", gn, [C(P(i), {
								label: "前端排序",
								required: ""
							}, {
								default: R(() => [C(P(re), {
									modelValue: V.sort_order,
									"onUpdate:modelValue": r[8] ||= (e) => V.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: xe.value || $.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(P(i), { label: "启用状态" }, {
								default: R(() => [C(Z, {
									modelValue: V.is_enabled,
									"onUpdate:modelValue": r[9] ||= (e) => V.is_enabled = e,
									disabled: xe.value || $.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : y("", !0)
				], 8, pn)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(P(c), {
				modelValue: X.value,
				"onUpdate:modelValue": r[12] ||= (e) => X.value = e,
				title: "删除公告分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !_e.value
			}, {
				footer: R(() => [C(P(d), {
					disabled: _e.value,
					onClick: r[11] ||= (e) => X.value = !1
				}, {
					default: R(() => [...r[18] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(d), {
					variant: "danger",
					loading: _e.value,
					onClick: je
				}, {
					default: R(() => [...r[19] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [x("p", null, "确认删除分类“" + N(V.name) + "”？有关联公告或子分类的分类无法删除。", 1), ve.value ? (k(), v(P(t), {
					key: 0,
					type: "error",
					closable: !1,
					description: ve.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(P(c), {
				modelValue: Q.value,
				"onUpdate:modelValue": r[14] ||= (e) => Q.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [C(P(d), { onClick: r[13] ||= (e) => Q.value = !1 }, {
					default: R(() => [...r[20] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(d), {
					variant: "primary",
					onClick: Oe
				}, {
					default: R(() => [...r[21] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-99f0ce2d"]]), yn = ["aria-busy"], bn = { class: "article-editor__header" }, xn = { class: "article-editor__heading" }, Sn = { class: "article-editor__commands" }, Cn = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, wn = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Tn = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, En = {
	key: 1,
	class: "article-editor__failure"
}, Dn = {
	key: 0,
	class: "article-editor__error"
}, On = { class: "article-editor__body" }, kn = { class: "article-editor__settings" }, An = { class: "article-editor__content" }, jn = ["aria-invalid", "disabled"], Mn = ["aria-invalid", "disabled"], Nn = {
	class: "announcement-delete-dialog__icon",
	"aria-hidden": "true"
}, Pn = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(e, { emit: n }) {
		let { hasPermission: ee } = he(), { announcementError: u, announcementCategoryLabel: f, deleteAnnouncement: te, getAnnouncementDetail: ne, getAnnouncementMetadata: ie, saveAnnouncement: ae, uploadAnnouncementCover: oe } = dn(), se = e, m = n, w = j(!0), T = j(!1), E = j(!1), D = j(""), O = j(!1), A = j(!1), de = j(!1), M = j(!1), fe = j(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), I = j(), L = j("draft"), z = j(!1), B = _(() => ee(["cms_announcement:publish"])), H = _(() => !ee([`cms_announcement:${se.articleId ? "edit" : "add"}`]) || !B.value && L.value !== "draft"), U = _(() => ee(["cms_announcement:delete"]) && (B.value || L.value === "draft"));
		async function W() {
			if (!(!U.value || T.value || w.value || E.value)) {
				T.value = !0, D.value = "";
				try {
					await te("articles", K.id, K.row_version), $ = JSON.stringify(K), a.success("公告已删除"), m("saved");
				} catch (e) {
					D.value = u(e), M.value = !1;
				} finally {
					T.value = !1;
				}
			}
		}
		let G = _(() => H.value || T.value), K = ue({
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
		}), { editorRoot: q, seoInput: J, fieldRules: ge, fieldErrors: Y, pendingCount: _e, saveError: X, validateSave: Z, setSaveFailure: ve, focusFirstError: ye, focusSeoError: be } = De(K, () => I.value?.categories || [], "announcement", O), Q = _(() => (I.value?.categories || []).filter((e) => e.parent_id != null).map((e) => ({
			label: f(I.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), xe = _(() => I.value?.categories.find((e) => e.id === K.category_id && e.parent_id == null)), Se = _({
			get: () => xe.value ? "" : K.category_id,
			set: (e) => {
				K.category_id = e;
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
			w.value = !0, E.value = !1, D.value = "";
			try {
				if (I.value = await ie(e.signal, { cms_source_type: "platform" }), se.articleId) {
					let t = await ne("articles", se.articleId, e.signal);
					if (I.value = await ie(e.signal, { space_id: String(t.space_id) }), fe.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"sort_order",
						"is_enabled"
					]) Object.assign(K, { [e]: t[e] });
					K.category_id = t.category_id || "", K.helpful_enabled = t.helpful_enabled ?? !0;
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url",
						"content_source",
						"author_name"
					]) K[e] = t[e] || "";
					K.scheduled_local = t.publish_status === "scheduled" ? we(t.scheduled_at) : "", L.value = t.publish_status;
				}
				$ = JSON.stringify(K);
			} catch (t) {
				e.signal.aborted || (D.value = u(t), E.value = !0);
			} finally {
				e.signal.aborted || (w.value = !1);
			}
		}
		let Ee = () => !w.value && !E.value && $ !== JSON.stringify(K);
		function Oe() {
			Ee() ? A.value = !0 : m("close");
		}
		function ke() {
			L.value === "draft" ? je("draft") : de.value = !0;
		}
		function Ae() {
			de.value = !1, je("draft");
		}
		async function je(e) {
			if (G.value || w.value || E.value || z.value || (D.value = "", !await Z(e))) return;
			let t = K.scheduled_local ? new Date(K.scheduled_local) : null;
			T.value = !0, D.value = "";
			try {
				await ae("articles", {
					...K,
					id: K.id || void 0,
					row_version: K.id ? K.row_version : void 0,
					category_id: K.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), $ = JSON.stringify(K), a.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "公告已发布"), m("saved");
			} catch (e) {
				ve(e);
			} finally {
				T.value = !1;
			}
			_e.value && await ye();
		}
		function Me(e) {
			D.value = u(e);
		}
		let Ne = (e) => {
			Ee() && (e.preventDefault(), e.returnValue = "");
		};
		return V(() => !T.value && !z.value && (!Ee() || window.confirm("公告有未保存的修改，确定离开？"))), le(() => {
			Te(), window.addEventListener("beforeunload", Ne);
		}), ce(() => {
			Ce?.abort(), window.removeEventListener("beforeunload", Ne);
		}), (n, a) => (k(), b("section", {
			ref_key: "editorRoot",
			ref: q,
			class: "article-editor",
			"aria-busy": w.value || T.value
		}, [
			x("header", bn, [
				C(P(d), {
					"icon-only": "",
					title: "返回公告列表",
					"aria-label": "返回公告列表",
					disabled: T.value || z.value,
					onClick: Oe
				}, {
					default: R(() => [C(P(h), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", xn, [x("h2", null, N(e.articleId ? "编辑公告" : "新增公告"), 1), x("span", null, N(I.value?.source_locale || "zh-CN") + " · " + N(fe.value), 1)]),
				x("div", Sn, [
					e.articleId && U.value ? (k(), v(P(d), {
						key: 0,
						size: "sm",
						disabled: w.value || E.value || T.value || z.value,
						onClick: a[0] ||= (e) => M.value = !0
					}, {
						default: R(() => [...a[29] ||= [S("删除公告", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(d), {
						size: "sm",
						disabled: w.value || E.value,
						onClick: a[1] ||= (e) => O.value = !0
					}, {
						icon: R(() => [C(P(h), {
							name: "search",
							size: 14
						})]),
						default: R(() => [a[30] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					H.value ? y("", !0) : (k(), v(P(d), {
						key: 1,
						size: "sm",
						disabled: w.value || E.value || T.value || z.value,
						onClick: ke
					}, {
						icon: R(() => [C(P(h), {
							name: "save",
							size: 14
						})]),
						default: R(() => [a[31] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					P(X) ? (k(), b("span", Cn, N(P(X)), 1)) : y("", !0),
					!H.value && P(_e) ? (k(), b("span", wn, "还有 " + N(P(_e)) + " 项待完善", 1)) : y("", !0),
					!H.value && B.value ? (k(), v(P(d), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: w.value || E.value || z.value,
						loading: T.value,
						onClick: a[2] ||= (e) => je(K.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [C(P(h), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [S(N(K.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)
				])
			]),
			w.value ? (k(), b("div", Tn, [C(P(h), {
				name: "loader-circle",
				class: "announcement-spin",
				size: 28
			}), a[32] ||= x("span", null, "正在读取公告资料...", -1)])) : E.value ? (k(), b("div", En, [C(P(t), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"]), C(P(d), { onClick: Te }, {
				default: R(() => [...a[33] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (k(), b(g, { key: 2 }, [D.value ? (k(), b("div", Dn, [C(P(t), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"])])) : y("", !0), x("div", On, [x("aside", kn, [C(P(o), {
				model: K,
				rules: P(ge),
				"label-position": "top",
				onSubmit: a[13] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					C(P(i), {
						label: "公告分类",
						prop: "category_id",
						error: P(Y).category_id,
						required: ""
					}, {
						default: R(() => [C(P(l), {
							modelValue: Se.value,
							"onUpdate:modelValue": a[3] ||= (e) => Se.value = e,
							options: Q.value,
							placeholder: xe.value ? "原分类：" + xe.value.name + "（一级）" : "请选择二级分类",
							clearable: "",
							disabled: G.value,
							"aria-label": "公告分类"
						}, null, 8, [
							"modelValue",
							"options",
							"placeholder",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					a[34] ||= x("h3", null, "公告设置", -1),
					C(P(i), {
						label: "公告封面",
						prop: "cover_url",
						error: P(Y).cover_url
					}, {
						default: R(() => [C(s, {
							modelValue: K.cover_url,
							"onUpdate:modelValue": a[4] ||= (e) => K.cover_url = e,
							label: "公告封面",
							disabled: G.value,
							upload: P(oe),
							onBusyChange: a[5] ||= (e) => z.value = e,
							onStart: a[6] ||= (e) => D.value = "",
							onError: Me
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "内容来源",
						prop: "content_source",
						error: P(Y).content_source
					}, {
						default: R(() => [C(P(p), {
							modelValue: K.content_source,
							"onUpdate:modelValue": a[7] ||= (e) => K.content_source = e,
							maxlength: 160,
							disabled: G.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "作者署名",
						prop: "author_name",
						error: P(Y).author_name
					}, {
						default: R(() => [C(P(p), {
							modelValue: K.author_name,
							"onUpdate:modelValue": a[8] ||= (e) => K.author_name = e,
							maxlength: 120,
							disabled: G.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "前端排序",
						prop: "sort_order",
						error: P(Y).sort_order
					}, {
						default: R(() => [C(P(re), {
							modelValue: K.sort_order,
							"onUpdate:modelValue": a[9] ||= (e) => K.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: G.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[35] ||= x("h3", null, "发布设置", -1),
					C(P(i), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: P(Y).helpful_enabled
					}, {
						default: R(() => [C(Et, {
							modelValue: K.helpful_enabled,
							"onUpdate:modelValue": a[10] ||= (e) => K.helpful_enabled = e,
							disabled: G.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "启用状态",
						prop: "is_enabled",
						error: P(Y).is_enabled
					}, {
						default: R(() => [C(Et, {
							modelValue: K.is_enabled,
							"onUpdate:modelValue": a[11] ||= (e) => K.is_enabled = e,
							disabled: G.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: P(Y).scheduled_local
					}, {
						default: R(() => [C(P(p), {
							modelValue: K.scheduled_local,
							"onUpdate:modelValue": a[12] ||= (e) => K.scheduled_local = e,
							type: "datetime-local",
							disabled: G.value || !B.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[36] ||= x("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", An, [C(P(o), {
				model: K,
				rules: P(ge),
				"label-position": "top",
				onSubmit: a[17] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					C(P(i), {
						label: "标题",
						prop: "title",
						error: P(Y).title,
						required: ""
					}, {
						default: R(() => [C(P(p), {
							modelValue: K.title,
							"onUpdate:modelValue": a[14] ||= (e) => K.title = e,
							maxlength: 255,
							disabled: G.value,
							placeholder: "输入公告标题",
							"aria-label": "公告标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "摘要",
						prop: "summary",
						error: P(Y).summary
					}, {
						default: R(() => [pe(x("textarea", {
							"onUpdate:modelValue": a[15] ||= (e) => K.summary = e,
							"aria-invalid": !!P(Y).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: G.value,
							"aria-label": "公告摘要"
						}, null, 8, jn), [[F, K.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(P(i), {
						label: "正文",
						prop: "body_html",
						error: P(Y).body_html
					}, {
						default: R(() => [C(P(r), {
							modelValue: K.body_html,
							"onUpdate:modelValue": a[16] ||= (e) => K.body_html = e,
							readonly: H.value,
							disabled: T.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "公告正文"
						}, {
							"image-upload": R(({ url: e, setUrl: t, setBusy: n }) => [C(s, {
								label: "正文图片",
								"model-value": e,
								upload: P(oe),
								"onUpdate:modelValue": t,
								onBusyChange: n,
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
			C(P(c), {
				modelValue: O.value,
				"onUpdate:modelValue": a[21] ||= (e) => O.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: R(() => [C(P(d), {
					variant: "primary",
					onClick: a[20] ||= (e) => O.value = !1
				}, {
					default: R(() => [...a[37] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [C(P(o), {
					model: K,
					rules: P(ge),
					"label-position": "top",
					onSubmit: a[19] ||= me(() => {}, ["prevent"])
				}, {
					default: R(() => [C(P(i), {
						label: "SEO 描述",
						prop: "seo_description",
						error: P(Y).seo_description
					}, {
						default: R(() => [pe(x("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": a[18] ||= (e) => K.seo_description = e,
							"aria-invalid": !!P(Y).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: G.value,
							"aria-label": "SEO 描述"
						}, null, 8, Mn), [[F, K.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(c), {
				modelValue: M.value,
				"onUpdate:modelValue": a[23] ||= (e) => M.value = e,
				title: "确认删除",
				subtitle: `操作对象：${K.title || "未命名公告"}`,
				width: "460px",
				"panel-class": "announcement-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !T.value
			}, {
				"header-actions": R(() => [x("span", Nn, [C(P(h), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [C(P(d), {
					disabled: T.value,
					onClick: a[22] ||= (e) => M.value = !1
				}, {
					default: R(() => [...a[38] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(d), {
					variant: "warning",
					loading: T.value,
					onClick: W
				}, {
					default: R(() => [...a[39] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [C(P(t), {
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
			C(P(c), {
				modelValue: A.value,
				"onUpdate:modelValue": a[26] ||= (e) => A.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [C(P(d), { onClick: a[24] ||= (e) => A.value = !1 }, {
					default: R(() => [...a[40] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(d), {
					variant: "primary",
					onClick: a[25] ||= (e) => m("close")
				}, {
					default: R(() => [...a[41] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(c), {
				modelValue: de.value,
				"onUpdate:modelValue": a[28] ||= (e) => de.value = e,
				title: "将公告转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [C(P(d), { onClick: a[27] ||= (e) => de.value = !1 }, {
					default: R(() => [...a[42] ||= [S("取消", -1)]]),
					_: 1
				}), C(P(d), {
					variant: "primary",
					onClick: Ae
				}, {
					default: R(() => [...a[43] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, yn));
	}
}), [["__scopeId", "data-v-6f468168"]]), Fn = { class: "announcement-articles" }, In = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = he(), { formatDateTime: r } = he(), { announcementPublishStates: i, announcementCategoryLabel: a, getAnnouncementList: o, getAnnouncementMetadata: s } = dn(), c = j(!1), l = j(), u = (e) => t([`cms_announcement:${e}`]), f = j(), te = ge(s, (e) => {
			f.value = e;
		}), re = [
			...J(),
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
				formatter: (e) => a(f.value, e)
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
		], ie = _(() => [
			...te.fields,
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
				}, ...(f.value?.categories || []).map((e) => ({
					label: a(f.value, e.id),
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
		]), { proTableBindings: ae, reload: oe } = te.bindTable(ee({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: ie,
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([e, t]) => e !== "publish_range" && t !== "" && t != null)), a = e.publish_range;
				Array.isArray(a) && a.length === 2 && (i.published_from = (/* @__PURE__ */ new Date(`${a[0]}T00:00:00`)).toISOString(), i.published_to = (/* @__PURE__ */ new Date(`${a[1]}T23:59:59.999`)).toISOString());
				let s = await o("articles", {
					...i,
					page_no: t,
					page_size: n
				}, r);
				return {
					rows: s.lists,
					total: s.count
				};
			}
		})), se = te.loadMetadata;
		function p(e) {
			l.value = e, c.value = !0;
		}
		function m() {
			c.value = !1, oe(), se();
		}
		return (e, t) => (k(), b("div", Fn, [c.value ? (k(), v(Pn, {
			key: 0,
			"article-id": l.value,
			onClose: t[0] ||= (e) => c.value = !1,
			onSaved: m
		}, null, 8, ["article-id"])) : y("", !0), pe(C(P(n), E(P(ae), {
			"auto-refreshable": !1,
			columns: re,
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
			"cell-cms_source_type": R(({ row: e }) => [C(Y, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": R(() => [u("add") ? (k(), v(P(d), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => p()
			}, {
				icon: R(() => [C(P(h), {
					name: "plus",
					size: 14
				})]),
				default: R(() => [t[2] ||= S("新增公告", -1)]),
				_: 1
			})) : y("", !0)]),
			"cell-publish_status": R(({ row: e }) => [C(P(ne), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: R(() => [S(N(P(i).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": R(({ row: e }) => [C(P(ne), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: R(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": R(({ row: e }) => [S(N(P(r)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": R(({ row: e }) => [C(P(d), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑公告" : "公告详情",
				"aria-label": u("edit") ? "编辑公告" : "公告详情",
				onClick: (t) => p(e.id)
			}, {
				default: R(() => [C(P(h), {
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
function Ln() {
	let e = he().request, t = "/cms/translations";
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
var Rn = (e, t) => t > 0 ? Math.min(100, Math.round(e / t * 100)) : 0, zn = (e, t) => `${e}:${t}`;
function Bn(e, t) {
	return e ? e.fields.flatMap((e) => e.translations.flatMap((n) => {
		let r = t[zn(e.key, n.locale)] ?? n.text;
		return r === n.text ? [] : [{
			field_name: e.key,
			locale: n.locale,
			text: r,
			source_hash: e.source_hash,
			row_version: n.row_version
		}];
	})) : [];
}
function Vn(e) {
	return Object.fromEntries(e.fields.flatMap((e) => e.translations.map((t) => [zn(e.key, t.locale), t.text])));
}
function Hn(e) {
	return e?.translations.filter((e) => e.status === "ready").length ?? 0;
}
var Un = (e) => !!e && ["queued", "running"].includes(e.status), Wn = {
	queued: "等待处理",
	running: "翻译中",
	succeeded: "翻译完成",
	partial_failed: "部分未完成",
	failed: "翻译未完成",
	cancelled: "已取消"
}, Gn = {
	draft: "草稿",
	scheduled: "定时发布",
	published: "已发布"
};
function Kn(e) {
	if (e && typeof e == "object") {
		let t = e;
		return Object.values(t.errors || {}).flat()[0] || t.msg || t.message || "操作失败，请稍后重试";
	}
	return "操作失败，请稍后重试";
}
//#endregion
//#region src/cms/views/content/localization/translations/index.vue?vue&type=script&setup=true&lang.ts
var qn = ["aria-busy"], Jn = { class: "translation-toolbar surface" }, Yn = { class: "translation-title" }, Xn = { class: "translation-title__icon" }, Zn = { class: "translation-progress" }, Qn = { class: "translation-toolbar__actions" }, $n = { class: "source-language" }, er = {
	key: 3,
	class: "translation-job surface",
	role: "status"
}, tr = { key: 0 }, nr = { key: 1 }, rr = ["title"], ir = {
	class: "language-overview surface",
	"aria-label": "目标语言完成度"
}, ar = [
	"disabled",
	"title",
	"onClick"
], or = {
	class: "module-bar surface",
	"aria-label": "翻译内容模块"
}, sr = { class: "module-count" }, cr = { class: "translation-workspace surface" }, lr = { class: "content-browser" }, ur = { class: "content-browser__header" }, dr = ["aria-busy"], fr = {
	key: 0,
	class: "region-status",
	role: "status"
}, pr = [
	"aria-current",
	"disabled",
	"onClick"
], mr = { class: "content-item__text" }, hr = ["title"], gr = {
	key: 0,
	class: "region-status"
}, _r = { class: "content-browser__footer" }, vr = ["aria-busy"], yr = {
	key: 0,
	class: "editor-state",
	role: "status"
}, br = { class: "translation-editor__header" }, xr = { class: "translation-editor__title" }, Sr = { key: 0 }, Cr = ["title"], wr = { class: "source-field" }, Tr = { class: "section-heading" }, Er = [
	"value",
	"rows",
	"aria-label"
], Dr = { class: "section-heading target-heading" }, Or = {
	key: 0,
	class: "empty-source"
}, kr = {
	key: 1,
	class: "empty-source"
}, Ar = ["data-locale"], jr = { class: "target-field__heading" }, Mr = ["for"], Nr = {
	key: 0,
	class: "status-stale"
}, Pr = {
	key: 1,
	class: "status-ready"
}, Fr = [
	"id",
	"onUpdate:modelValue",
	"rows",
	"maxlength",
	"disabled",
	"dir",
	"placeholder"
], Ir = { class: "target-field__count" }, Lr = {
	key: 2,
	class: "editor-state"
}, Rr = { class: "job-confirm" }, zr = /*#__PURE__*/ m(/* @__PURE__ */ w({
	__name: "index",
	setup(n) {
		let { cancelTranslationJob: r, createTranslationJob: o, getTranslationDetail: s, getTranslationJob: ee, getTranslationList: f, getTranslationMetadata: te, getTranslationSettings: re, saveTranslations: m, saveTranslationSettings: w, testTranslationConnection: T } = Ln(), { hasPermission: E } = he(), A = j(), ue = j(""), M = j("news:content"), fe = j([]), I = j(), L = j(""), me = j("title"), B = j(""), H = j(""), U = j(1), W = j(0), G = j({}), K = j(!1), q = j(!1), J = j(!1), ge = j(!1), Y = j(""), _e = j(""), X = j(), Z = j(null), ve = j(!1), ye = j(!1), be = {
			load: () => re(ue.value, Ae.signal),
			save: (e, t) => {
				if (Le.value) throw Error("请先保存或放弃当前译文修改，再修改配置。");
				return w(e, t);
			},
			testConnection: (e, t) => T(e.space_id, e.space_revision, t)
		}, Q = j(!1), xe = j("field"), Se = j([]), $ = j(""), Ce = j(!1), we = j(!1), Te, Ee, De, Oe, ke, Ae = new AbortController(), je, Me = "", Ne = _(() => E(["cms_translation:edit"])), Pe = _(() => E(["cms_translation:config"])), Fe = _(() => E(["cms_translation:translate"])), Ie = _(() => ge.value || ye.value || Ce.value), Le = _(() => Bn(I.value, G.value).length > 0), Re = _(() => Rn(A.value?.done || 0, A.value?.total || 0)), ze = _(() => ({
			space_id: ue.value,
			module: M.value.split(":")[0],
			kind: M.value.endsWith(":category") ? "category" : "content"
		})), Be = _(() => A.value?.spaces.map((e) => ({
			label: e.label + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		})) || []), Ve = _(() => A.value?.locales.filter((e) => e.code !== A.value?.source_locale) || []), He = _(() => Ve.value.map((e) => ({
			label: `${e.flag} ${e.label}`,
			value: e.code
		}))), Ue = _(() => A.value?.locales.map((e) => ({
			label: `${e.label} · ${e.code}`,
			value: e.code
		})) || []), We = _(() => He.value.filter((e) => Ze(String(e.value)))), Ge = _(() => A.value?.locales.find((e) => e.code === A.value?.source_locale)?.label || A.value?.source_locale || "简体中文"), Ke = _(() => I.value?.fields.find((e) => e.key === me.value)), qe = _(() => {
			let e = A.value?.modules.find((e) => e.key === M.value);
			return e?.kind === "category" ? `${A.value?.modules.find((t) => t.module === e.module && t.kind === "content")?.label || ""}分类` : e?.label || "新闻";
		}), Je = _(() => {
			let e = [];
			for (let t of A.value?.modules || []) {
				let n = e.find((e) => e[0].module === t.module);
				n ? n.push(t) : e.push([t]);
			}
			return e;
		}), Ye = _(() => !!ue.value && A.value?.space_enabled && !!A.value.target_locales.length && !Un(Z.value) && !Ie.value && !Le.value && !K.value && !q.value), Xe = _(() => Z.value ? Rn([
			"succeeded",
			"skipped",
			"cancelled"
		].reduce((e, t) => e + (Z.value?.counts[t] || 0), 0) + (Un(Z.value) ? 0 : Z.value.counts.failed || 0), Z.value.total) : 0), Ze = (e) => A.value?.target_locales.includes(e) ?? !1, Qe = (e) => A.value?.locales.find((t) => t.code === e), $e = (e) => ({
			news: "file-text",
			academy: "landmark",
			help: "info",
			announcement: "megaphone"
		})[e] || "info";
		function et(e) {
			Ie.value || (Le.value ? (Te = e, we.value = !0) : e());
		}
		function tt() {
			let e = Te;
			Te = void 0, we.value = !1, G.value = I.value ? Vn(I.value) : {}, e?.();
		}
		function nt() {
			we.value = !1, Te = void 0, ke?.(!1), ke = void 0;
		}
		function rt(e) {
			e !== ue.value && et(() => {
				ue.value = e, B.value = "", H.value = "", U.value = 1, Z.value = null, ct();
			});
		}
		function it(e) {
			e.available && M.value !== e.key && et(() => {
				M.value = e.key, B.value = "", H.value = "", U.value = 1, ut();
			});
		}
		function at(e) {
			et(() => {
				U.value = e, ut();
			});
		}
		function ot() {
			et(() => {
				H.value = B.value.trim(), U.value = 1, ut();
			});
		}
		function st(e) {
			e !== L.value && et(() => {
				dt(e);
			});
		}
		async function ct() {
			Oe?.abort();
			let e = Oe = new AbortController();
			K.value = !0, Y.value = "";
			try {
				let t = await te(ue.value || void 0, e.signal);
				if (e.signal.aborted) return;
				A.value = t, ue.value = t.space_id || "", await ut(), vt();
			} catch (t) {
				e.signal.aborted || (Y.value = Kn(t));
			} finally {
				e.signal.aborted || (K.value = !1);
			}
		}
		async function lt() {
			let e = ue.value;
			if (e) try {
				let t = await te(e, Ae.signal);
				e === ue.value && (A.value = t);
			} catch {}
		}
		async function ut() {
			Ee?.abort(), De?.abort();
			let e = Ee = new AbortController();
			if (q.value = !0, J.value = !1, I.value = void 0, L.value = "", G.value = {}, Y.value = "", !ue.value) {
				fe.value = [], W.value = 0, q.value = !1;
				return;
			}
			let t = { ...ze.value };
			try {
				let n = await f(t, H.value, U.value, e.signal);
				if (e.signal.aborted) return;
				fe.value = n.lists, W.value = n.count, fe.value[0] && await dt(fe.value[0].id);
			} catch (t) {
				e.signal.aborted || (fe.value = [], W.value = 0, Y.value = Kn(t));
			} finally {
				e.signal.aborted || (q.value = !1);
			}
		}
		async function dt(e) {
			De?.abort();
			let t = De = new AbortController();
			J.value = !0, L.value = e, I.value = void 0, G.value = {}, Y.value = "";
			try {
				let n = await s({ ...ze.value }, e, t.signal);
				if (t.signal.aborted) return;
				I.value = n, G.value = Vn(n), n.fields.some((e) => e.key === me.value) || (me.value = n.fields[0]?.key || ""), X.value?.scrollTo({ top: 0 });
			} catch (e) {
				t.signal.aborted || (Y.value = Kn(e));
			} finally {
				t.signal.aborted || (J.value = !1);
			}
		}
		async function ft() {
			if (!I.value || !Ne.value || Ie.value) return;
			let e = Bn(I.value, G.value);
			if (e.length) {
				if (e.some((e) => !e.text.trim())) {
					Y.value = "译文不能为空；未翻译的语言请保持未填写。";
					return;
				}
				ge.value = !0, Y.value = "";
				try {
					let t = await m({ ...ze.value }, I.value.id, e);
					I.value = t, G.value = Vn(t);
					let n = fe.value.findIndex((e) => e.id === t.id);
					n >= 0 && (fe.value[n] = t), a.success("翻译已保存"), lt();
				} catch (e) {
					Y.value = Kn(e);
				} finally {
					ge.value = !1;
				}
			}
		}
		async function pt(e) {
			_e.value = e, await D();
			let t = X.value?.querySelector(`[data-locale="${e}"]`);
			t?.scrollIntoView({
				block: "nearest",
				behavior: "smooth"
			}), t?.querySelector("textarea")?.focus();
		}
		function mt() {
			Pe.value && ue.value && !Le.value ? ve.value = !0 : Le.value && a.warning("请先保存或放弃当前译文修改，再修改配置。");
		}
		function ht(e) {
			xe.value = e, Se.value = [...A.value?.target_locales || []], $.value = "", Me = crypto.randomUUID(), Q.value = !0;
		}
		async function gt() {
			if (!(!Se.value.length || Ce.value)) {
				Ce.value = !0, $.value = "";
				try {
					let e = await o({ ...ze.value }, {
						request_key: Me,
						target_locales: Se.value,
						...xe.value === "field" ? {
							id: L.value,
							field_name: me.value
						} : { keyword: H.value }
					});
					Z.value = e.job, Q.value = !1, a.success("翻译任务已提交"), _t();
				} catch (e) {
					$.value = Kn(e);
				} finally {
					Ce.value = !1;
				}
			}
		}
		function _t() {
			clearTimeout(je), Un(Z.value) && (je = setTimeout(() => {
				vt();
			}, 3e3));
		}
		async function vt() {
			let e = ue.value;
			if (!e || Ae.signal.aborted) return;
			let t = Un(Z.value);
			try {
				let n = await ee(e, Ae.signal);
				if (e !== ue.value) return;
				Z.value = n.job, t && !Un(Z.value) && (await lt(), !Le.value && !Ie.value && L.value && await dt(L.value));
			} catch {}
			_t();
		}
		async function yt() {
			if (Z.value) try {
				let e = await r(ue.value, Z.value.id);
				Z.value = e.job, clearTimeout(je), lt();
			} catch (e) {
				Y.value = Kn(e);
			}
		}
		function bt(e) {
			(Le.value || Ie.value) && (e.preventDefault(), e.returnValue = "");
		}
		return V(() => !Le.value && !Ie.value || !Ie.value && new Promise((e) => {
			ke?.(!1), ke = e, Te = () => {
				ke = void 0, e(!0);
			}, we.value = !0;
		})), le(() => {
			window.addEventListener("beforeunload", bt), ct();
		}), ce(() => {
			ke?.(!1), Ae.abort(), Ee?.abort(), De?.abort(), Oe?.abort(), clearTimeout(je), window.removeEventListener("beforeunload", bt);
		}), (n, r) => (k(), b("section", {
			class: "translations-page",
			"aria-label": "多语言翻译管理",
			"aria-busy": K.value
		}, [
			x("header", Jn, [x("div", Yn, [x("span", Xn, [C(P(h), {
				name: "globe",
				size: 21
			})]), x("div", null, [r[15] ||= x("h1", null, "语言翻译管理", -1), x("div", Zn, [
				x("strong", null, N(Re.value) + "%", 1),
				C(P(ae), {
					percentage: Re.value,
					"show-text": !1,
					"stroke-width": 4,
					"aria-label": "全部翻译完成度"
				}, null, 8, ["percentage"]),
				x("span", null, N(A.value?.done.toLocaleString() || 0) + " / " + N(A.value?.total.toLocaleString() || 0) + " 个目标字段", 1)
			])])]), x("div", Qn, [
				C(P(l), {
					"model-value": ue.value,
					options: Be.value,
					size: "sm",
					disabled: K.value || Ie.value,
					placeholder: "内容空间",
					"aria-label": "内容空间",
					"onUpdate:modelValue": r[0] ||= (e) => rt(String(e))
				}, null, 8, [
					"model-value",
					"options",
					"disabled"
				]),
				x("span", $n, [r[16] ||= S("内容源语言 ", -1), x("b", null, N(Ge.value), 1)]),
				Pe.value ? (k(), v(P(ie), {
					key: 0,
					disabled: !ue.value || Ie.value,
					onClick: mt
				}, null, 8, ["disabled"])) : y("", !0),
				Fe.value ? (k(), v(P(d), {
					key: 1,
					size: "sm",
					disabled: !Ye.value,
					onClick: r[1] ||= (e) => ht("batch")
				}, {
					icon: R(() => [C(P(h), {
						name: "rocket",
						size: 14
					})]),
					default: R(() => [r[17] ||= S("批量翻译", -1)]),
					_: 1
				}, 8, ["disabled"])) : y("", !0),
				Fe.value ? (k(), v(P(d), {
					key: 2,
					size: "sm",
					disabled: !Ye.value || !I.value || !Ke.value?.translatable,
					onClick: r[2] ||= (e) => ht("field")
				}, {
					icon: R(() => [C(P(h), {
						name: "globe",
						size: 14
					})]),
					default: R(() => [r[18] ||= S("翻译当前字段", -1)]),
					_: 1
				}, 8, ["disabled"])) : y("", !0),
				Ne.value ? (k(), v(P(d), {
					key: 3,
					size: "sm",
					variant: "primary",
					loading: ge.value,
					disabled: !Le.value || Ie.value || !A.value?.space_enabled,
					onClick: ft
				}, {
					icon: R(() => [C(P(h), {
						name: "save",
						size: 14
					})]),
					default: R(() => [r[19] ||= S("保存翻译", -1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : y("", !0)
			])]),
			Y.value ? (k(), v(P(t), {
				key: 0,
				type: "error",
				closable: !0,
				onClose: r[3] ||= (e) => Y.value = ""
			}, {
				default: R(() => [S(N(Y.value), 1)]),
				_: 1
			})) : y("", !0),
			A.value && !A.value.space_enabled && ue.value ? (k(), v(P(t), {
				key: 1,
				type: "warning"
			}, {
				default: R(() => [...r[20] ||= [S("当前内容空间已停用，仅可查看翻译。", -1)]]),
				_: 1
			})) : y("", !0),
			A.value && !A.value.target_locales.length && ue.value ? (k(), v(P(t), {
				key: 2,
				type: "info"
			}, {
				default: R(() => [...r[21] ||= [S("尚未启用目标语言，请在“翻译配置”中选择语言后开始翻译。", -1)]]),
				_: 1
			})) : y("", !0),
			Z.value ? (k(), b("div", er, [
				C(P(h), {
					name: P(Un)(Z.value) ? "loader-circle" : "info",
					size: 15
				}, null, 8, ["name"]),
				x("strong", null, N(P(Wn)[Z.value.status] || Z.value.status), 1),
				x("span", null, "任务 #" + N(Z.value.id), 1),
				C(P(ae), {
					percentage: Xe.value,
					"show-text": !1,
					"stroke-width": 4
				}, null, 8, ["percentage"]),
				x("span", null, [
					S(N(Z.value.counts.succeeded || 0) + " / " + N(Z.value.total) + " 已完成", 1),
					Z.value.counts.failed ? (k(), b("span", tr, " · " + N(Z.value.counts.failed) + " 失败", 1)) : y("", !0),
					Z.value.counts.skipped ? (k(), b("span", nr, " · " + N(Z.value.counts.skipped) + " 冲突跳过", 1)) : y("", !0)
				]),
				P(Un)(Z.value) && Fe.value ? (k(), v(P(d), {
					key: 0,
					size: "sm",
					variant: "text",
					disabled: Ie.value,
					onClick: yt
				}, {
					default: R(() => [...r[22] ||= [S("取消任务", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (k(), v(P(d), {
					key: 1,
					size: "sm",
					variant: "text",
					onClick: r[4] ||= (e) => Z.value = null
				}, {
					default: R(() => [...r[23] ||= [S("收起", -1)]]),
					_: 1
				})),
				Z.value.errors.length ? (k(), b("span", {
					key: 2,
					class: "translation-job__error",
					title: Z.value.errors.map((e) => `${e.target_locale}: ${e.error_code}`).join("；")
				}, N(Z.value.errors[0].error_code) + "（可重新提交补翻）", 9, rr)) : y("", !0)
			])) : y("", !0),
			x("div", ir, [(k(!0), b(g, null, de(Ve.value, (e) => (k(), b("button", {
				key: e.code,
				type: "button",
				class: O(["language-card", {
					"is-active": _e.value === e.code,
					"is-disabled": !Ze(e.code)
				}]),
				disabled: !Ze(e.code),
				title: Ze(e.code) ? `${e.native}：${e.done} / ${e.total}` : "请在翻译配置中启用",
				onClick: (t) => pt(e.code)
			}, [
				x("span", null, N(e.flag), 1),
				x("span", null, N(e.label), 1),
				x("strong", null, N(Ze(e.code) ? P(Rn)(e.done, e.total) + "%" : "未启用"), 1),
				C(P(ae), {
					percentage: P(Rn)(e.done, e.total),
					"show-text": !1,
					"stroke-width": 2
				}, null, 8, ["percentage"])
			], 10, ar))), 128))]),
			x("nav", or, [(k(!0), b(g, null, de(Je.value, (e) => (k(), b("div", {
				key: e[0].module,
				class: "module-group"
			}, [(k(!0), b(g, null, de(e, (e) => (k(), v(P(d), {
				key: e.key,
				variant: M.value === e.key ? "primary" : "text",
				plain: M.value === e.key,
				size: "sm",
				disabled: !e.available || Ie.value,
				title: e.reason,
				"aria-pressed": M.value === e.key,
				onClick: (t) => it(e)
			}, {
				default: R(() => [
					e.kind === "category" ? y("", !0) : (k(), v(P(h), {
						key: 0,
						name: $e(e.module),
						size: 14
					}, null, 8, ["name"])),
					S(N(e.label), 1),
					x("span", sr, N(e.count), 1)
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
			x("main", cr, [x("aside", lr, [
				x("div", ur, [x("div", null, [x("strong", null, N(qe.value), 1), x("span", null, N(W.value) + " 条" + N(ze.value.kind === "category" ? "分类" : "内容"), 1)]), C(P(p), {
					modelValue: B.value,
					"onUpdate:modelValue": r[5] ||= (e) => B.value = e,
					size: "sm",
					clearable: "",
					placeholder: "搜索内容",
					"aria-label": "搜索内容",
					onKeydown: z(ot, ["enter"])
				}, {
					prefix: R(() => [C(P(h), {
						name: "search",
						size: 14
					})]),
					_: 1
				}, 8, ["modelValue"])]),
				x("div", {
					class: "content-browser__list",
					"aria-busy": q.value
				}, [q.value ? (k(), b("p", fr, "加载内容中…")) : (k(), b(g, { key: 1 }, [(k(!0), b(g, null, de(fe.value, (e) => (k(), b("button", {
					key: e.id,
					type: "button",
					class: O(["content-item", { "is-selected": L.value === e.id }]),
					"aria-current": L.value === e.id ? "true" : void 0,
					disabled: Ie.value,
					onClick: (t) => st(e.id)
				}, [x("span", mr, [x("strong", { title: e.title }, N(e.title), 9, hr), x("small", null, N(P(Gn)[e.publish_status || ""] || "分类") + " · " + N(e.done) + "/" + N(e.total), 1)]), C(P(ae), {
					type: "circle",
					percentage: P(Rn)(e.done, e.total),
					"show-text": !1,
					size: 16,
					"stroke-width": 2,
					status: e.total && e.done === e.total ? "success" : "warning"
				}, null, 8, ["percentage", "status"])], 10, pr))), 128)), fe.value.length ? y("", !0) : (k(), b("p", gr, N(H.value ? "没有匹配的内容" : "暂无可翻译内容"), 1))], 64))], 8, dr),
				x("footer", _r, [
					C(P(d), {
						size: "sm",
						"icon-only": "",
						"aria-label": "上一页",
						disabled: U.value <= 1 || q.value || Ie.value,
						onClick: r[6] ||= (e) => at(U.value - 1)
					}, {
						default: R(() => [C(P(h), {
							name: "chevron-left",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"]),
					x("span", null, N(U.value) + " / " + N(Math.max(1, Math.ceil(W.value / 30))), 1),
					C(P(d), {
						size: "sm",
						"icon-only": "",
						"aria-label": "下一页",
						disabled: U.value * 30 >= W.value || q.value || Ie.value,
						onClick: r[7] ||= (e) => at(U.value + 1)
					}, {
						default: R(() => [C(P(h), {
							name: "chevron-right",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"])
				])
			]), x("section", {
				class: "translation-editor",
				"aria-busy": J.value
			}, [J.value ? (k(), b("div", yr, [C(P(h), {
				name: "loader-circle",
				size: 28
			}), r[24] ||= x("p", null, "加载译文中…", -1)])) : I.value ? (k(), b(g, { key: 1 }, [x("header", br, [x("div", xr, [x("span", null, [S(N(qe.value) + " ", 1), Le.value ? (k(), b("em", Sr, "有未保存修改")) : y("", !0)]), x("h2", { title: I.value.title }, N(I.value.title), 9, Cr)]), C(P(oe), {
				modelValue: me.value,
				"onUpdate:modelValue": r[8] ||= (e) => me.value = e
			}, {
				default: R(() => [(k(!0), b(g, null, de(I.value.fields, (t) => (k(), v(P(e), {
					key: t.key,
					name: t.key,
					label: `${t.label} ${t.translatable ? P(Hn)(t) + "/" + t.translations.length : "—"}`
				}, null, 8, ["name", "label"]))), 128))]),
				_: 1
			}, 8, ["modelValue"])]), Ke.value ? (k(), b("div", {
				key: 0,
				class: "translation-editor__body",
				ref_key: "editorBody",
				ref: X
			}, [
				x("section", wr, [x("div", Tr, [x("strong", null, [S(N(Ge.value) + " ", 1), C(P(ne), {
					size: "sm",
					type: "primary",
					effect: "soft"
				}, {
					default: R(() => [...r[25] ||= [S("内容源语言", -1)]]),
					_: 1
				})]), r[26] ||= x("span", null, "只读原文", -1)]), x("textarea", {
					value: Ke.value.source,
					readonly: "",
					rows: Ke.value.key === "body_html" ? 5 : 2,
					class: "translation-textarea source-textarea",
					"aria-label": `原文${Ke.value.label}`
				}, null, 8, Er)]),
				x("div", Dr, [r[27] ||= x("strong", null, "目标语言", -1), x("span", null, N(I.value.fields.find((e) => e.key === me.value)?.translations.length || 0) + " 种语言 · 手工修改后请保存", 1)]),
				Ke.value.translatable ? Ke.value.translations.length ? (k(), b("div", {
					key: 2,
					class: O(["target-grid", { "is-body": me.value === "body_html" }])
				}, [(k(!0), b(g, null, de(Ke.value.translations, (e) => (k(), b("div", {
					key: e.locale,
					class: O(["target-field", { "is-focused": _e.value === e.locale }]),
					"data-locale": e.locale
				}, [
					x("div", jr, [x("label", { for: `translation-${me.value}-${e.locale}` }, [S(N(Qe(e.locale)?.native || e.locale) + " ", 1), x("small", null, N(e.locale), 1)], 8, Mr), e.status === "stale" ? (k(), b("span", Nr, "原文已更新")) : e.status === "ready" ? (k(), b("span", Pr, N(e.method === "machine" ? "机器翻译" : "已保存"), 1)) : y("", !0)]),
					pe(x("textarea", {
						id: `translation-${me.value}-${e.locale}`,
						"onUpdate:modelValue": (t) => G.value[P(zn)(me.value, e.locale)] = t,
						class: "translation-textarea",
						rows: me.value === "body_html" ? 10 : 2,
						maxlength: Ke.value.max_length,
						disabled: !Ne.value || !A.value?.space_enabled || Ie.value,
						dir: e.locale === "ar" ? "rtl" : "auto",
						placeholder: `请输入${Qe(e.locale)?.native || e.locale}翻译${me.value === "body_html" ? "（HTML）" : ""}`
					}, null, 8, Fr), [[F, G.value[P(zn)(me.value, e.locale)]]]),
					x("div", Ir, N((G.value[P(zn)(me.value, e.locale)] || "").length.toLocaleString()) + " / " + N(Ke.value.max_length.toLocaleString()), 1)
				], 10, Ar))), 128))], 2)) : (k(), b("div", kr, " 请先在“翻译配置”中启用目标语言。 ")) : (k(), b("div", Or, [C(P(h), {
					name: "info",
					size: 18
				}), r[28] ||= S("原文字段为空，不参与翻译和完成度统计。 ", -1)]))
			], 512)) : y("", !0)], 64)) : (k(), b("div", Lr, [C(P(se), { description: Y.value ? "内容加载失败，可点击刷新重试" : "选择左侧内容开始翻译" }, null, 8, ["description"]), Y.value ? (k(), v(P(d), {
				key: 0,
				size: "sm",
				onClick: ct
			}, {
				default: R(() => [...r[29] ||= [S("重新加载", -1)]]),
				_: 1
			})) : y("", !0)]))], 8, vr)]),
			C(P(u), {
				modelValue: ve.value,
				"onUpdate:modelValue": r[9] ||= (e) => ve.value = e,
				actions: be,
				locales: Ue.value,
				onBusy: r[10] ||= (e) => ye.value = e,
				onSaved: ct
			}, null, 8, ["modelValue", "locales"]),
			C(P(c), {
				modelValue: Q.value,
				"onUpdate:modelValue": r[13] ||= (e) => Q.value = e,
				title: xe.value === "field" ? "翻译当前字段" : "批量翻译",
				subtitle: "Google Translate · 仅补齐缺失及原文已更新的译文",
				width: "520px",
				"close-on-click-modal": !1,
				"before-close": () => !Ce.value
			}, {
				footer: R(() => [C(P(d), {
					size: "sm",
					disabled: Ce.value,
					onClick: r[12] ||= (e) => Q.value = !1
				}, {
					default: R(() => [...r[31] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(d), {
					variant: "primary",
					size: "sm",
					loading: Ce.value,
					disabled: !Se.value.length,
					onClick: gt
				}, {
					default: R(() => [...r[32] ||= [S("确认翻译", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])]),
				default: R(() => [x("div", Rr, [
					x("p", null, N(xe.value === "field" ? `当前内容的「${Ke.value?.label}」` : `当前空间「${qe.value}」${H.value ? "中匹配搜索条件的内容" : "全部内容"}`), 1),
					C(P(i), { label: "目标语言" }, {
						default: R(() => [C(P(l), {
							modelValue: Se.value,
							"onUpdate:modelValue": r[11] ||= (e) => Se.value = e,
							options: We.value,
							multiple: "",
							filterable: "",
							"max-tag-count": 5,
							disabled: Ce.value
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}),
					C(P(t), { type: "warning" }, {
						default: R(() => [...r[30] ||= [S("内容将发送至 Google Translate，并可能产生翻译费用。已有有效译文不会覆盖；单次最多 200 条内容、5,000 个字段任务。后台任务需要已启动翻译 worker。", -1)]]),
						_: 1
					}),
					$.value ? (k(), v(P(t), {
						key: 0,
						type: "error"
					}, {
						default: R(() => [S(N($.value), 1)]),
						_: 1
					})) : y("", !0)
				])]),
				_: 1
			}, 8, [
				"modelValue",
				"title",
				"before-close"
			]),
			C(P(c), {
				modelValue: we.value,
				"onUpdate:modelValue": r[14] ||= (e) => we.value = e,
				title: "有未保存的翻译",
				subtitle: "切换后将丢弃当前修改，是否继续？",
				width: "380px",
				onClose: nt
			}, {
				footer: R(() => [C(P(d), {
					size: "sm",
					onClick: nt
				}, {
					default: R(() => [...r[33] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(d), {
					size: "sm",
					variant: "warning",
					onClick: tt
				}, {
					default: R(() => [...r[34] ||= [S("放弃修改并继续", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, qn));
	}
}), [["__scopeId", "data-v-b88318ee"]]), Br = {
	key: 0,
	class: "mm-cms-site"
}, Vr = ["disabled"], Hr = ["value"], Ur = {
	key: 1,
	role: "alert"
}, Wr = {
	key: 2,
	role: "status"
}, Gr = { key: 3 }, Kr = ["disabled"], qr = /*#__PURE__*/ m(/* @__PURE__ */ w({
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
			"news/categories": $,
			"news/list": Ge,
			"academy/categories": $e,
			"academy/courses": Ct,
			"help/categories": Nt,
			"help/articles": $t,
			"feedback/list": un,
			"announcement/categories": vn,
			"announcement/list": In,
			"localization/translations": zr
		}, r = t.runtime.mode === "white_label" && !!t.runtime.resolveSiteInRequest, i = j(!1), a = j(0), o = j([]), s = j(""), c = j(""), l = j(t.runtime.mode === "white_label" && !r), ee = j(!1), u = _(() => o.value.find((e) => e.site_id === s.value)), d = _(() => n[t.page]), f = _(() => t.runtime.hasPermission([
			"cms_news:add",
			"cms_academy:add",
			"cms_help:add",
			"cms_announcement:add"
		])), te = new AbortController(), ne = !0, re = !1;
		function ie(e) {
			re = !0;
			try {
				o.value = e.sites, s.value = e.site_id ?? "", i.value = !0;
			} finally {
				re = !1;
			}
		}
		let ae = H(t.runtime, ie);
		L(s, () => {
			!r || re || (ae.invalidate(), ae = H(t.runtime, ie, u.value?.space_id ?? null), a.value++);
		}, { flush: "sync" });
		function oe(e, n) {
			if (!ne || t.runtime.mode === "white_label" && u.value?.space_id !== n) throw Error("站点已切换，请重新操作");
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
		A(B, {
			get mode() {
				return t.runtime.mode;
			},
			hasPermission: (e) => t.runtime.hasPermission(e),
			formatDateTime: (e) => t.runtime.formatDateTime(e),
			registerBeforeLeave: (e) => t.runtime.registerBeforeLeave?.(e),
			get request() {
				if (r) return ae.request;
				let e = u.value?.space_id;
				return {
					get: (n, r) => t.runtime.request.get(oe(n, e), r),
					post: (n, r) => t.runtime.request.post(oe(n, e), r)
				};
			}
		});
		async function se() {
			let e = await t.runtime.request.get({
				url: "/cms/sites",
				signal: te.signal
			});
			te.signal.aborted || (o.value = e.sites, o.value.some((e) => e.site_id === s.value) || (s.value = o.value[0]?.site_id ?? ""));
		}
		async function p() {
			if (!u.value || ee.value) return;
			let e = a.value;
			ee.value = !0;
			try {
				let n = await t.runtime.request.post({
					url: "/cms/initialize",
					params: { site_id: u.value.site_id }
				}, { isOpenRetry: !1 });
				if (!ne || r && e !== a.value) return;
				if (r) {
					if (!n.cms_context) throw Error("初始化接口未返回站点信息");
					ae.invalidate(), ae = H(t.runtime, ie, n.cms_context.space_id), ie(n.cms_context), a.value++;
				} else await se();
			} catch (e) {
				c.value = e instanceof Error ? e.message : "初始化失败";
			} finally {
				ee.value = !1;
			}
		}
		return le(async () => {
			if (t.runtime.mode === "white_label" && !r) try {
				await se();
			} catch {
				te.signal.aborted || (c.value = "加载站点失败，请刷新重试");
			} finally {
				l.value = !1;
			}
		}), ce(() => {
			ne = !1, ae.invalidate(), te.abort();
		}), (t, n) => (k(), b("section", { class: O(["mm-cms-page", { "is-viewport": e.viewport }]) }, [e.runtime.mode === "white_label" && e.showSiteSelector && (!P(r) || i.value) ? (k(), b("header", Br, [x("label", null, [n[1] ||= S("内容站点 ", -1), pe(x("select", {
			"onUpdate:modelValue": n[0] ||= (e) => s.value = e,
			disabled: l.value
		}, [(k(!0), b(g, null, de(o.value, (e) => (k(), b("option", {
			key: e.site_id,
			value: e.site_id
		}, N(e.label), 9, Hr))), 128))], 8, Vr), [[fe, s.value]])]), n[2] ||= x("span", null, "各站点内容独立管理", -1)])) : y("", !0), c.value ? (k(), b("p", Ur, N(c.value), 1)) : l.value ? (k(), b("p", Wr, "正在加载站点…")) : e.runtime.mode === "white_label" && (!P(r) || i.value) && !u.value?.space_id ? (k(), b("div", Gr, [x("p", null, N(u.value ? "该站点尚未初始化内容空间。" : "暂无可管理的内容站点。"), 1), u.value && f.value ? (k(), b("button", {
			key: 0,
			type: "button",
			disabled: ee.value,
			onClick: p
		}, "初始化空内容空间", 8, Kr)) : y("", !0)])) : (k(), v(M(d.value), { key: `${e.page}:${e.identityKey}:${P(r) ? a.value : u.value?.space_id ?? "platform"}` }))], 2));
	}
}), [["__scopeId", "data-v-f447749a"]]);
//#endregion
//#region src/cms/permission-tree.ts
function Jr(e, t, n = "", r = 0) {
	let i = e.children ?? [], a = e.type === "C" && !!(e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:")), o = t(e), s = n ? `${n} / ${o}` : o, c = a || e.type === "M" && r > 0 ? s : n;
	return [...!i.length || a ? [{
		id: e.id,
		name: a || e.type === "A" && e.perms?.startsWith("cms_") ? s : o
	}] : [], ...i.flatMap((e) => Jr(e, t, c, r + 1))];
}
function Yr(e, t) {
	let n = new Set(t.map(String)), r = /* @__PURE__ */ new Set(), i = [];
	function a(e) {
		let t = e.children ?? [], o = (!t.length || e.type === "C" && (e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:"))) && n.has(String(e.id));
		for (let e of t) a(e) && (o = !0);
		return o && !r.has(String(e.id)) && (r.add(String(e.id)), i.push(e.id)), !!o;
	}
	return e.forEach(a), i;
}
//#endregion
export { qr as MmCmsPage, s as MmMediaUpload, Jr as cmsPermissionItems, Yr as cmsPermissionSubmission, f as createMediaUploader };

//# sourceMappingURL=cms.js.map