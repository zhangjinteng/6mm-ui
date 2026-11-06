import { Cn as e, Hi as t, M as n, Nr as r, P as i, Xn as a, _i as o, _r as s, a as c, bi as l, gi as u, hi as d, ii as f, ni as ee, p as te, ri as p, ti as ne, vi as re, wn as ie, xr as ae } from "./src-BnyqQm4T.js";
import { d as m, n as oe, u as h } from "./Loading-NM70IAOz.js";
import { Fragment as g, computed as _, createBlock as v, createCommentVNode as y, createElementBlock as b, createElementVNode as x, createTextVNode as S, createVNode as C, defineComponent as w, inject as T, mergeProps as E, nextTick as D, normalizeClass as O, onBeforeUnmount as se, onMounted as ce, openBlock as k, provide as le, reactive as A, ref as j, renderList as ue, resolveDynamicComponent as M, shallowRef as de, toDisplayString as N, unref as P, vModelSelect as F, vModelText as fe, vShow as I, watch as pe, withCtx as L, withDirectives as me, withKeys as R, withModifiers as he } from "vue";
//#region src/cms/runtime.ts
var z = Symbol("MmCms");
function ge() {
	let e = T(z);
	if (!e) throw Error("CMS host adapter is missing");
	return e;
}
function _e(e) {
	ge().registerBeforeLeave?.(e);
}
//#endregion
//#region src/cms/site-transport.ts
function B(e, t, n) {
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
var V = ["aria-expanded", "aria-label"], H = {
	key: 1,
	class: "spacer",
	"aria-hidden": "true"
}, U = /*#__PURE__*/ h(/* @__PURE__ */ w({
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
			onClick: n[0] ||= he((e) => t.$emit("toggle"), ["stop"])
		}, [C(P(m), {
			name: e.expanded ? "chevron-down" : "chevron-right",
			size: 14
		}, null, 8, ["name"])], 8, V)) : (k(), b("span", H)), x("span", null, N(e.name), 1)], 2));
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
function ve() {
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
function K(e, t) {
	let n = ge().mode === "platform", r = A(n ? [{
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
	async function u() {
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
	ce(() => {
		if (n || t) return u();
	}), se(() => {
		o = !0, a?.abort();
	});
	function d(e) {
		if (!n) return e;
		let t = e.filters;
		i = t;
		let a = s(t.value), d = (e) => {
			let t = { ...e };
			return t.cms_source_type === "platform" && (t.cms_tenant_id = ""), c(a, s(t)) || l(t), t;
		}, f = (n = t.value) => {
			let r = d(n);
			a = s(r), e.query(r);
		}, ee = (n) => {
			e.reset(n === void 0 ? void 0 : d(n)), a = s(t.value);
		};
		return pe(() => t.value.cms_source_type, (e) => {
			e === "platform" && (t.value.cms_tenant_id = ""), r[1].disabled = e === "platform";
		}, {
			immediate: !0,
			flush: "sync"
		}), pe([() => String(t.value.cms_source_type || ""), () => String(t.value.cms_tenant_id || "")], () => {
			l(t.value), u(), D(() => {
				!o && !c(a, s(t.value)) && f();
			});
		}), {
			...e,
			query: f,
			reset: ee,
			proTableBindings: _(() => ({
				...e.proTableBindings.value,
				onQuery: f,
				onReset: ee
			}))
		};
	}
	return {
		fields: r,
		bindTable: d,
		loadMetadata: u
	};
}
//#endregion
//#region src/cms/components/source-type-tag/index.vue
var ye = /* @__PURE__ */ w({
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
		return (e, t) => (k(), v(P(d), {
			effect: "soft",
			round: "",
			size: "sm",
			type: a.value
		}, {
			default: L(() => [S(N(i.value), 1)]),
			_: 1
		}, 8, ["type"]));
	}
});
//#endregion
//#region src/cms/api/content/news.ts
function q() {
	let e = ge().request, t = "/cms/news", n = (n, r = {}) => e.get({
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
	}, { isOpenRetry: !1 }), s = c(e, `${t}/upload`), l = [
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
		getNewsMetadata: n,
		getNewsList: r,
		getNewsDetail: i,
		saveNews: a,
		deleteNews: o,
		uploadNewsCover: s,
		newsPublishStates: l,
		newsCategoryLabel: u,
		newsError: d
	};
}
//#endregion
//#region src/cms/views/content/news/EnabledToggle.vue?vue&type=script&setup=true&lang.ts
var J = ["aria-checked", "disabled"], be = /*#__PURE__*/ h(/* @__PURE__ */ w({
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
		}, [x("span")], -1), x("span", null, N(e.modelValue ? "已启用" : "已停用"), 1)], 10, J));
	}
}), [["__scopeId", "data-v-8b527db1"]]), Y = { class: "news-categories" }, xe = ["aria-busy"], X = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Se = { class: "taxonomy-editor__field" }, Z = { class: "taxonomy-editor__row" }, Q = "分类", $ = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(n) {
		let { newsError: i, deleteNews: a, getNewsMetadata: o, getNewsList: c, getNewsDetail: u, saveNews: ee } = q(), { hasPermission: te } = ge(), { formatDateTime: ae } = ge(), h = (e) => te([`cms_news_category:${e}`]), g = j(), w = j(), T = K(o, (e) => {
			g.value = e;
		}), D = [
			{
				key: "name",
				dataIndex: "name",
				title: "分类名称",
				width: 210,
				hideable: !1
			},
			...ve(),
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
				formatter: (e) => g.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
		], O = [
			...T.fields,
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
		], { proTableBindings: ce, rows: le, reload: ue } = T.bindTable(r({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: O,
			request: async ({ filters: e, signal: t, reason: n }) => {
				let r = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), i = await W((e, n) => c("categories", {
					...r,
					page_no: e,
					page_size: n
				}, t), t);
				return !t.aborted && (n === "query" || n === "reset") && (de.value = Object.keys(r).length ? new Set(i.rows.filter((e) => e.parent_id != null).map((e) => String(e.parent_id))) : /* @__PURE__ */ new Set()), i;
			}
		})), { visibleRows: M, expanded: de, groups: F, allExpanded: fe, toggle: I, toggleAll: pe } = G(le), me = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), R = A(me()), z = j(!1), _e = j(!1), B = j(!1), V = j(!1), H = j(!1), J = j(""), $ = j(!1), Ce = j(""), we = j(!1), Te = _(() => !h(R.id ? "edit" : "add")), Ee = _(() => B.value || V.value), De = "", Oe;
		async function ke(e) {
			Oe?.abort(), Oe = new AbortController();
			let t = Oe;
			Object.assign(R, me(), { id: e || "" }), Ce.value = "", H.value = !1, J.value = "", $.value = !1, z.value = !0, _e.value = !0, De = JSON.stringify(R);
			try {
				if (w.value = await o(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await u("categories", e, t.signal);
				if (w.value = await o(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(R, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), De = JSON.stringify(R);
			} catch (e) {
				t.signal.aborted || ($.value = !0, Ce.value = i(e));
			} finally {
				t.signal.aborted || (_e.value = !1);
			}
		}
		function Ae() {
			return Ee.value ? !1 : !_e.value && !$.value && JSON.stringify(R) !== De ? (we.value = !0, !1) : (Oe?.abort(), !0);
		}
		function je() {
			Ee.value || (Oe?.abort(), z.value = !1);
		}
		function Me() {
			we.value = !1, z.value = !1;
		}
		async function Ne() {
			if (!(Te.value || Ee.value || _e.value || $.value)) {
				if (!R.name.trim() || R.sort_order === null) {
					Ce.value = "请填写分类名称和排序";
					return;
				}
				B.value = !0, Ce.value = "";
				try {
					await ee("categories", {
						name: R.name,
						parent_id: R.parent_id || null,
						sort_order: R.sort_order,
						is_enabled: R.is_enabled,
						id: R.id || void 0,
						row_version: R.id ? R.row_version : void 0
					}), z.value = !1, f.success("保存成功"), await Promise.all([ue(), Le()]);
				} catch (e) {
					Ce.value = i(e);
				} finally {
					B.value = !1;
				}
			}
		}
		function Pe() {
			!R.id || !h("delete") || Ee.value || _e.value || $.value || (J.value = "", H.value = !0);
		}
		async function Fe() {
			if (!(!H.value || !R.id || !h("delete") || Ee.value || _e.value || $.value)) {
				V.value = !0, J.value = "";
				try {
					await a("categories", R.id, R.row_version), H.value = !1, z.value = !1, f.success("分类已删除"), await Promise.all([ue(), Le()]);
				} catch (e) {
					J.value = i(e);
				} finally {
					V.value = !1;
				}
			}
		}
		let Ie = _(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(w.value?.categories || []).filter((e) => !e.parent_id && e.id !== R.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Le = T.loadMetadata;
		return se(() => {
			Oe?.abort();
		}), (n, r) => (k(), b("div", Y, [
			C(P(s), E(P(ce), {
				"auto-refreshable": !1,
				columns: D,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Q}管理`,
				data: P(M),
				"show-pagination": !1
			}), {
				"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": L(() => [h("add") ? (k(), v(P(t), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => ke()
				}, {
					icon: L(() => [C(P(m), {
						name: "plus",
						size: 14
					})]),
					default: L(() => [S("新增" + N(Q))]),
					_: 1
				})) : y("", !0), C(P(t), {
					size: "sm",
					disabled: !P(F).children.size,
					onClick: P(pe)
				}, {
					icon: L(() => [C(P(m), {
						name: P(fe) ? "chevron-up" : "chevron-down",
						size: 14
					}, null, 8, ["name"])]),
					default: L(() => [S(" " + N(P(fe) ? "全部收起" : "全部展开"), 1)]),
					_: 1
				}, 8, ["disabled", "onClick"])]),
				"cell-name": L(({ row: e }) => [C(U, {
					name: e.name,
					child: e.parent_id != null,
					branch: P(F).children.has(e.id),
					expanded: P(de).has(e.id),
					onToggle: (t) => P(I)(e.id)
				}, null, 8, [
					"name",
					"child",
					"branch",
					"expanded",
					"onToggle"
				])]),
				"cell-is_enabled": L(({ row: e }) => [C(P(d), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: L(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": L(({ row: e }) => [C(P(t), {
					size: "sm",
					"icon-only": "",
					title: h("edit") ? `编辑${Q}` : `${Q}详情`,
					"aria-label": `编辑${Q}`,
					onClick: (t) => ke(e.id)
				}, {
					default: L(() => [C(P(m), {
						name: h("edit") ? "square-pen" : "panel-right-open",
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
			C(P(l), {
				modelValue: z.value,
				"onUpdate:modelValue": r[5] ||= (e) => z.value = e,
				title: `${R.id ? "编辑" : "新增"}新闻${Q}`,
				width: "680px",
				subtitle: "新闻分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Ae
			}, {
				footer: L(() => [
					R.id && h("delete") ? (k(), v(P(t), {
						key: 0,
						variant: "danger",
						disabled: _e.value || $.value || Ee.value,
						onClick: Pe
					}, {
						icon: L(() => [C(P(m), {
							name: "trash-2",
							size: 14
						})]),
						default: L(() => [r[11] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(t), {
						disabled: Ee.value,
						onClick: je
					}, {
						default: L(() => [...r[12] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Te.value ? y("", !0) : (k(), v(P(t), {
						key: 1,
						variant: "primary",
						loading: B.value,
						disabled: _e.value || $.value || V.value,
						onClick: Ne
					}, {
						default: L(() => [S("保存" + N(Q))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: L(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": _e.value
				}, [
					_e.value ? (k(), b("div", X, [C(P(m), {
						name: "loader-circle",
						class: "news-spin",
						size: 24
					}), x("span", null, "正在读取" + N(Q) + "...")])) : y("", !0),
					Ce.value ? (k(), v(P(p), {
						key: 1,
						type: "error",
						closable: !1,
						description: Ce.value
					}, null, 8, ["description"])) : y("", !0),
					!_e.value && !$.value ? (k(), v(P(ie), {
						key: 2,
						model: R,
						"label-position": "top",
						onSubmit: he(Ne, ["prevent"])
					}, {
						default: L(() => [
							R.id ? (k(), v(P(e), {
								key: 0,
								label: "分类ID"
							}, {
								default: L(() => [C(P(oe), {
									"model-value": R.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : y("", !0),
							C(P(e), {
								label: `${Q}名称`,
								required: ""
							}, {
								default: L(() => [C(P(oe), {
									modelValue: R.name,
									"onUpdate:modelValue": r[1] ||= (e) => R.name = e,
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
							C(P(e), { label: "父分类" }, {
								default: L(() => [x("div", Se, [C(P(re), {
									modelValue: R.parent_id,
									"onUpdate:modelValue": r[2] ||= (e) => R.parent_id = e,
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
							x("div", Z, [C(P(e), {
								label: "前端排序",
								required: ""
							}, {
								default: L(() => [C(P(ne), {
									modelValue: R.sort_order,
									"onUpdate:modelValue": r[3] ||= (e) => R.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Te.value || Ee.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(P(e), { label: "启用状态" }, {
								default: L(() => [C(be, {
									modelValue: R.is_enabled,
									"onUpdate:modelValue": r[4] ||= (e) => R.is_enabled = e,
									disabled: Te.value || Ee.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : y("", !0)
				], 8, xe)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(P(l), {
				modelValue: H.value,
				"onUpdate:modelValue": r[7] ||= (e) => H.value = e,
				title: "删除新闻分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !V.value
			}, {
				footer: L(() => [C(P(t), {
					disabled: V.value,
					onClick: r[6] ||= (e) => H.value = !1
				}, {
					default: L(() => [...r[13] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(t), {
					variant: "danger",
					loading: V.value,
					onClick: Fe
				}, {
					default: L(() => [...r[14] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: L(() => [x("p", null, "确认删除分类“" + N(R.name) + "”？有关联新闻或子分类的分类无法删除。", 1), J.value ? (k(), v(P(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: J.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(P(l), {
				modelValue: we.value,
				"onUpdate:modelValue": r[9] ||= (e) => we.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: L(() => [C(P(t), { onClick: r[8] ||= (e) => we.value = !1 }, {
					default: L(() => [...r[15] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(t), {
					variant: "primary",
					onClick: Me
				}, {
					default: L(() => [...r[16] ||= [S("放弃修改", -1)]]),
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
	let i = j(), a = j(), o = j(null), s = j(Date.now()), c = A({}), l = j(""), u = Object.fromEntries(we.map((e) => [e, {
		required: e === "title" || e === "category_id",
		trigger: "submit"
	}])), d = _(() => o.value ? Te(e, t(), n, o.value === "draft" ? "draft" : e.scheduled_local ? "scheduled" : "published", s.value) : {}), f = _(() => ({
		...c,
		...d.value
	})), ee = _(() => Object.keys(f.value).length);
	for (let t of we) pe(() => e[t], () => {
		delete c[t], l.value = "", s.value = Date.now();
	}, { deep: !0 });
	function te() {
		f.value.seo_description && a.value?.focus();
	}
	async function p() {
		await D();
		let e = [...i.value?.querySelectorAll("[data-prop]") || []].find((e) => f.value[e.dataset.prop]);
		if (!e && f.value.seo_description) {
			r.value ? te() : r.value = !0;
			return;
		}
		e && (e.scrollIntoView({
			block: "center",
			behavior: "auto"
		}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
	}
	async function ne(e) {
		o.value = e === "draft" ? "draft" : "publish", s.value = Date.now(), l.value = "";
		for (let e of we) delete c[e];
		return ee.value ? (await p(), !1) : !0;
	}
	function re(e) {
		let t = Ee(e, n);
		Object.assign(c, t.fields), l.value = t.general;
	}
	return {
		editorRoot: i,
		seoInput: a,
		fieldRules: u,
		fieldErrors: f,
		pendingCount: ee,
		saveError: l,
		validateSave: ne,
		setSaveFailure: re,
		focusFirstError: p,
		focusSeoError: te
	};
}
//#endregion
//#region src/cms/views/content/components/CoverFileItem.vue?vue&type=script&setup=true&lang.ts
var Oe = {
	class: "file-list",
	"aria-label": "封面文件"
}, ke = { class: "file-item" }, Ae = { class: "file-icon" }, je = ["src"], Me = [
	"href",
	"download",
	"title",
	"aria-busy",
	"aria-disabled"
], Ne = { class: "file-size" }, Pe = ["disabled"], Fe = {
	key: 0,
	class: "file-error",
	role: "alert"
}, Ie = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "CoverFileItem",
	props: {
		url: {},
		file: {},
		disabled: { type: Boolean }
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = j(null), a = j(!1), o = j(!1), s = j(""), c, l = _(() => {
			try {
				let e = new URL(n.url, window.location.href);
				return ["http:", "https:"].includes(e.protocol) ? e.href : "";
			} catch {
				return "";
			}
		}), u = _(() => {
			if (n.file) return n.file.name;
			let e = l.value ? new URL(l.value).pathname.split("/").pop() : "";
			if (!e) return "封面图片";
			try {
				return decodeURIComponent(e);
			} catch {
				return e;
			}
		}), d = _(() => i.value === null ? "大小未知" : i.value < 1024 ? `${i.value} B` : i.value < 1024 * 1024 ? `${(i.value / 1024).toFixed(1)} KB` : `${(i.value / (1024 * 1024)).toFixed(1)} MB`);
		pe(() => [n.url, n.file], async (e, t, r) => {
			if (c?.abort(), c = void 0, o.value = !1, s.value = "", a.value = !1, i.value = n.file?.size ?? null, n.file || !l.value) return;
			let u = new AbortController(), d = window.setTimeout(() => u.abort(), 5e3);
			r(() => {
				u.abort(), window.clearTimeout(d);
			});
			try {
				let e = await fetch(l.value, {
					method: "HEAD",
					signal: u.signal,
					credentials: "omit",
					referrerPolicy: "no-referrer"
				}), t = e.headers.get("content-length"), n = t && /^\d+$/.test(t) ? Number(t) : NaN;
				e.ok && !u.signal.aborted && Number.isFinite(n) && n >= 0 && (i.value = n);
			} catch {} finally {
				window.clearTimeout(d);
			}
		}, { immediate: !0 });
		async function f() {
			if (o.value || !l.value) return;
			let e = new AbortController();
			c = e;
			let t = window.setTimeout(() => e.abort(), 15e3), r = u.value;
			o.value = !0, s.value = "";
			try {
				let t = n.file;
				if (!t) {
					let n = await fetch(l.value, {
						signal: e.signal,
						credentials: "omit",
						referrerPolicy: "no-referrer"
					});
					if (!n.ok) throw Error("Download failed");
					t = await n.blob();
				}
				if (e.signal.aborted) return;
				i.value = t.size;
				let a = URL.createObjectURL(t), o = document.createElement("a");
				o.href = a, o.download = r, o.click(), window.setTimeout(() => URL.revokeObjectURL(a), 1e3);
			} catch {
				c === e && (s.value = "图片下载失败，请稍后重试");
			} finally {
				window.clearTimeout(t), c === e && (o.value = !1);
			}
		}
		return se(() => {
			c?.abort(), c = void 0;
		}), (t, n) => (k(), b("div", Oe, [x("div", ke, [
			x("span", Ae, [a.value ? (k(), v(P(m), {
				key: 1,
				name: "image",
				size: 20
			})) : (k(), b("img", {
				key: 0,
				src: e.url,
				alt: "封面缩略图",
				onError: n[0] ||= (e) => a.value = !0
			}, null, 40, je))]),
			x("a", {
				class: "file-name",
				href: l.value || void 0,
				download: u.value,
				title: u.value,
				"aria-busy": o.value,
				"aria-disabled": o.value || !l.value,
				onClick: he(f, ["prevent", "stop"])
			}, N(u.value), 9, Me),
			x("span", Ne, N(d.value), 1),
			x("button", {
				class: "file-remove",
				type: "button",
				"aria-label": "移除封面",
				title: "移除封面",
				disabled: e.disabled,
				onClick: n[1] ||= he((e) => r("remove"), ["stop"])
			}, [C(P(m), {
				name: "close",
				size: 14
			})], 8, Pe)
		]), s.value ? (k(), b("span", Fe, N(s.value), 1)) : y("", !0)]));
	}
}), [["__scopeId", "data-v-389015f1"]]), Le = { class: "content-cover" }, Re = { class: "content-cover__preview" }, ze = ["src", "alt"], Be = {
	key: 1,
	class: "content-cover__empty"
}, Ve = {
	key: 2,
	class: "content-cover__hint"
}, He = {
	key: 0,
	class: "content-cover__error",
	role: "status"
}, Ue = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "ContentCoverUpload",
	props: {
		modelValue: {},
		label: { default: "文章封面" },
		disabled: {
			type: Boolean,
			default: !1
		},
		upload: {}
	},
	emits: [
		"update:modelValue",
		"update:mediaId",
		"busy-change",
		"start",
		"success",
		"error"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = j(), a = de(), o = j(!1), s = j(!1), c;
		pe(() => n.modelValue, (e) => {
			s.value = !1, a.value?.url !== e && (a.value = void 0);
		});
		async function l({ file: e, signal: t }) {
			c = void 0, o.value = !0, r("busy-change", !0), r("start");
			try {
				let i = await n.upload(e, t);
				return t.aborted || (a.value = {
					url: i.url,
					file: e
				}, s.value = !1, r("update:modelValue", i.url), r("update:mediaId", i.media_id ?? null)), i;
			} catch (e) {
				throw t.aborted || (c = { error: e }), e;
			} finally {
				o.value = !1, r("busy-change", !1);
			}
		}
		function u() {
			D(() => i.value?.clearFiles());
		}
		function d() {
			r("success"), u();
		}
		function f(e, t) {
			r("error", c ? c.error : t), c = void 0, u();
		}
		function ee() {
			n.disabled || o.value || (a.value = void 0, s.value = !1, r("update:modelValue", ""), r("update:mediaId", null));
		}
		return (t, n) => (k(), b("div", Le, [
			C(P(te), {
				ref_key: "uploadRef",
				ref: i,
				class: "content-cover__upload",
				drag: "",
				accept: "image/jpeg,image/png,image/webp",
				limit: 1,
				"max-size": 5242880,
				disabled: e.disabled || o.value,
				request: l,
				onSuccess: d,
				onError: f,
				onExceed: n[2] ||= (e) => r("error", /* @__PURE__ */ Error("一次只能上传一张封面图片"))
			}, {
				default: L(() => [x("div", Re, [e.modelValue ? (k(), b("img", {
					key: 0,
					src: e.modelValue,
					alt: e.label,
					draggable: "false",
					onError: n[0] ||= (e) => s.value = !0,
					onLoad: n[1] ||= (e) => s.value = !1
				}, null, 40, ze)) : (k(), b("div", Be, [C(P(m), {
					name: "image",
					size: 28
				})])), e.modelValue ? y("", !0) : (k(), b("span", Ve, [S(N(o.value ? "正在上传…" : "拖动图片到此处，或点击上传") + " ", 1), n[3] ||= x("span", { class: "content-cover__types" }, "JPG / PNG / WebP，最大 5 MB", -1)]))])]),
				_: 1
			}, 8, ["disabled"]),
			s.value ? (k(), b("span", He, " 封面无法加载，请重新上传 ")) : y("", !0),
			e.modelValue ? (k(), v(Ie, {
				key: 1,
				url: e.modelValue,
				file: a.value?.url === e.modelValue ? a.value.file : void 0,
				disabled: e.disabled || o.value,
				onRemove: ee
			}, null, 8, [
				"url",
				"file",
				"disabled"
			])) : y("", !0)
		]));
	}
}), [["__scopeId", "data-v-46fbc9a4"]]), We = ["aria-busy"], Ge = { class: "article-editor__header" }, Ke = { class: "article-editor__heading" }, qe = { class: "article-editor__commands" }, Je = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, Ye = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Xe = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, Ze = {
	key: 1,
	class: "article-editor__failure"
}, Qe = {
	key: 0,
	class: "article-editor__error"
}, $e = { class: "article-editor__body" }, et = { class: "article-editor__settings" }, tt = { class: "article-editor__content" }, nt = ["aria-invalid", "disabled"], rt = ["aria-invalid", "disabled"], it = {
	class: "news-delete-dialog__icon",
	"aria-hidden": "true"
}, at = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(r, { emit: i }) {
		let { newsError: a, newsCategoryLabel: o, deleteNews: s, getNewsDetail: c, getNewsMetadata: u, saveNews: d, uploadNewsCover: ee } = q(), { hasPermission: te } = ge(), ae = r, h = i, w = j(!0), T = j(!1), E = j(!1), D = j(""), O = j(!1), le = j(!1), ue = j(!1), M = j(!1), de = j(ge().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), F = j(), I = j("draft"), pe = j(!1), R = _(() => te(["cms_news:publish"])), z = _(() => !te([`cms_news:${ae.articleId ? "edit" : "add"}`]) || !R.value && I.value !== "draft"), B = _(() => te(["cms_news:delete"]) && (R.value || I.value === "draft"));
		async function V() {
			if (!(!B.value || T.value || w.value || E.value)) {
				T.value = !0, D.value = "";
				try {
					await s("articles", U.id, U.row_version), Ce = JSON.stringify(U), f.success("新闻已删除"), h("saved");
				} catch (e) {
					D.value = a(e), M.value = !1;
				} finally {
					T.value = !1;
				}
			}
		}
		let H = _(() => z.value || T.value), U = A({
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
		}), { editorRoot: W, seoInput: G, fieldRules: ve, fieldErrors: K, pendingCount: ye, saveError: J, validateSave: Y, setSaveFailure: xe, focusFirstError: X, focusSeoError: Se } = De(U, () => F.value?.categories || [], "news", O), Z = _(() => (F.value?.categories || []).filter((e) => e.parent_id != null).map((e) => ({
			label: o(F.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), Q = _(() => F.value?.categories.find((e) => e.id === U.category_id && e.parent_id == null)), $ = _({
			get: () => Q.value ? "" : U.category_id,
			set: (e) => {
				U.category_id = e;
			}
		}), Ce = "", we;
		function Te(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Ee() {
			we?.abort(), we = new AbortController();
			let e = we;
			w.value = !0, E.value = !1, D.value = "";
			try {
				if (F.value = await u(e.signal, { cms_source_type: "platform" }), ae.articleId) {
					let t = await c("articles", ae.articleId, e.signal);
					if (F.value = await u(e.signal, { space_id: String(t.space_id) }), de.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"sort_order",
						"is_enabled"
					]) Object.assign(U, { [e]: t[e] });
					U.category_id = t.category_id || "";
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url",
						"content_source",
						"author_name"
					]) U[e] = t[e] || "";
					U.scheduled_local = t.publish_status === "scheduled" ? Te(t.scheduled_at) : "", I.value = t.publish_status;
				}
				Ce = JSON.stringify(U);
			} catch (t) {
				e.signal.aborted || (D.value = a(t), E.value = !0);
			} finally {
				e.signal.aborted || (w.value = !1);
			}
		}
		let Oe = () => !w.value && !E.value && Ce !== JSON.stringify(U);
		function ke() {
			Oe() ? le.value = !0 : h("close");
		}
		function Ae() {
			I.value === "draft" ? Me("draft") : ue.value = !0;
		}
		function je() {
			ue.value = !1, Me("draft");
		}
		async function Me(e) {
			if (H.value || w.value || E.value || pe.value || (D.value = "", !await Y(e))) return;
			let t = U.scheduled_local ? new Date(U.scheduled_local) : null;
			T.value = !0, D.value = "";
			try {
				await d("articles", {
					...U,
					id: U.id || void 0,
					row_version: U.id ? U.row_version : void 0,
					category_id: U.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), Ce = JSON.stringify(U), f.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "新闻已发布"), h("saved");
			} catch (e) {
				xe(e);
			} finally {
				T.value = !1;
			}
			ye.value && await X();
		}
		function Ne(e) {
			D.value = a(e);
		}
		let Pe = (e) => {
			Oe() && (e.preventDefault(), e.returnValue = "");
		};
		return _e(() => !T.value && !pe.value && (!Oe() || window.confirm("新闻有未保存的修改，确定离开？"))), ce(() => {
			Ee(), window.addEventListener("beforeunload", Pe);
		}), se(() => {
			we?.abort(), window.removeEventListener("beforeunload", Pe);
		}), (i, a) => (k(), b("section", {
			ref_key: "editorRoot",
			ref: W,
			class: "article-editor",
			"aria-busy": w.value || T.value
		}, [
			x("header", Ge, [
				C(P(t), {
					"icon-only": "",
					title: "返回新闻列表",
					"aria-label": "返回新闻列表",
					disabled: T.value || pe.value,
					onClick: ke
				}, {
					default: L(() => [C(P(m), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", Ke, [x("h2", null, N(r.articleId ? "编辑新闻" : "新增新闻"), 1), x("span", null, N(F.value?.source_locale || "zh-CN") + " · " + N(de.value), 1)]),
				x("div", qe, [
					r.articleId && B.value ? (k(), v(P(t), {
						key: 0,
						size: "sm",
						disabled: w.value || E.value || T.value || pe.value,
						onClick: a[0] ||= (e) => M.value = !0
					}, {
						default: L(() => [...a[28] ||= [S("删除新闻", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(t), {
						size: "sm",
						disabled: w.value || E.value,
						onClick: a[1] ||= (e) => O.value = !0
					}, {
						icon: L(() => [C(P(m), {
							name: "search",
							size: 14
						})]),
						default: L(() => [a[29] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					z.value ? y("", !0) : (k(), v(P(t), {
						key: 1,
						size: "sm",
						disabled: w.value || E.value || T.value || pe.value,
						onClick: Ae
					}, {
						icon: L(() => [C(P(m), {
							name: "save",
							size: 14
						})]),
						default: L(() => [a[30] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					P(J) ? (k(), b("span", Je, N(P(J)), 1)) : y("", !0),
					!z.value && P(ye) ? (k(), b("span", Ye, "还有 " + N(P(ye)) + " 项待完善", 1)) : y("", !0),
					!z.value && R.value ? (k(), v(P(t), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: w.value || E.value || pe.value,
						loading: T.value,
						onClick: a[2] ||= (e) => Me(U.scheduled_local ? "scheduled" : "published")
					}, {
						icon: L(() => [C(P(m), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: L(() => [S(N(U.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)
				])
			]),
			w.value ? (k(), b("div", Xe, [C(P(m), {
				name: "loader-circle",
				class: "news-spin",
				size: 28
			}), a[31] ||= x("span", null, "正在读取新闻资料...", -1)])) : E.value ? (k(), b("div", Ze, [C(P(p), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"]), C(P(t), { onClick: Ee }, {
				default: L(() => [...a[32] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (k(), b(g, { key: 2 }, [D.value ? (k(), b("div", Qe, [C(P(p), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"])])) : y("", !0), x("div", $e, [x("aside", et, [C(P(ie), {
				model: U,
				rules: P(ve),
				"label-position": "top",
				onSubmit: a[12] ||= he(() => {}, ["prevent"])
			}, {
				default: L(() => [
					C(P(e), {
						label: "新闻分类",
						prop: "category_id",
						error: P(K).category_id,
						required: ""
					}, {
						default: L(() => [C(P(re), {
							modelValue: $.value,
							"onUpdate:modelValue": a[3] ||= (e) => $.value = e,
							options: Z.value,
							placeholder: Q.value ? "原分类：" + Q.value.name + "（请选择二级分类）" : "请选择二级分类",
							clearable: "",
							disabled: H.value,
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
					C(P(e), {
						label: "新闻封面",
						prop: "cover_url",
						error: P(K).cover_url
					}, {
						default: L(() => [C(Ue, {
							modelValue: U.cover_url,
							"onUpdate:modelValue": a[4] ||= (e) => U.cover_url = e,
							label: "新闻封面",
							disabled: H.value,
							upload: P(ee),
							onBusyChange: a[5] ||= (e) => pe.value = e,
							onStart: a[6] ||= (e) => D.value = "",
							onError: Ne
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "内容来源",
						prop: "content_source",
						error: P(K).content_source
					}, {
						default: L(() => [C(P(oe), {
							modelValue: U.content_source,
							"onUpdate:modelValue": a[7] ||= (e) => U.content_source = e,
							maxlength: 160,
							disabled: H.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "作者署名",
						prop: "author_name",
						error: P(K).author_name
					}, {
						default: L(() => [C(P(oe), {
							modelValue: U.author_name,
							"onUpdate:modelValue": a[8] ||= (e) => U.author_name = e,
							maxlength: 120,
							disabled: H.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "前端排序",
						prop: "sort_order",
						error: P(K).sort_order
					}, {
						default: L(() => [C(P(ne), {
							modelValue: U.sort_order,
							"onUpdate:modelValue": a[9] ||= (e) => U.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: H.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[34] ||= x("h3", null, "发布设置", -1),
					C(P(e), {
						label: "启用状态",
						prop: "is_enabled",
						error: P(K).is_enabled
					}, {
						default: L(() => [C(be, {
							modelValue: U.is_enabled,
							"onUpdate:modelValue": a[10] ||= (e) => U.is_enabled = e,
							disabled: H.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: P(K).scheduled_local
					}, {
						default: L(() => [C(P(oe), {
							modelValue: U.scheduled_local,
							"onUpdate:modelValue": a[11] ||= (e) => U.scheduled_local = e,
							type: "datetime-local",
							disabled: H.value || !R.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[35] ||= x("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", tt, [C(P(ie), {
				model: U,
				rules: P(ve),
				"label-position": "top",
				onSubmit: a[16] ||= he(() => {}, ["prevent"])
			}, {
				default: L(() => [
					C(P(e), {
						label: "标题",
						prop: "title",
						error: P(K).title,
						required: ""
					}, {
						default: L(() => [C(P(oe), {
							modelValue: U.title,
							"onUpdate:modelValue": a[13] ||= (e) => U.title = e,
							maxlength: 255,
							disabled: H.value,
							placeholder: "输入新闻标题",
							"aria-label": "新闻标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "摘要",
						prop: "summary",
						error: P(K).summary
					}, {
						default: L(() => [me(x("textarea", {
							"onUpdate:modelValue": a[14] ||= (e) => U.summary = e,
							"aria-invalid": !!P(K).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: H.value,
							"aria-label": "新闻摘要"
						}, null, 8, nt), [[fe, U.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "正文",
						prop: "body_html",
						error: P(K).body_html
					}, {
						default: L(() => [C(P(n), {
							modelValue: U.body_html,
							"onUpdate:modelValue": a[15] ||= (e) => U.body_html = e,
							readonly: z.value,
							disabled: T.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "新闻正文"
						}, {
							"image-upload": L(({ url: e, setUrl: t, setBusy: n }) => [C(Ue, {
								label: "正文图片",
								"model-value": e,
								upload: P(ee),
								"onUpdate:modelValue": t,
								onBusyChange: n,
								onError: Ne
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
			C(P(l), {
				modelValue: O.value,
				"onUpdate:modelValue": a[20] ||= (e) => O.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: L(() => [C(P(t), {
					variant: "primary",
					onClick: a[19] ||= (e) => O.value = !1
				}, {
					default: L(() => [...a[36] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: L(() => [C(P(ie), {
					model: U,
					rules: P(ve),
					"label-position": "top",
					onSubmit: a[18] ||= he(() => {}, ["prevent"])
				}, {
					default: L(() => [C(P(e), {
						label: "SEO 描述",
						prop: "seo_description",
						error: P(K).seo_description
					}, {
						default: L(() => [me(x("textarea", {
							ref_key: "seoInput",
							ref: G,
							"onUpdate:modelValue": a[17] ||= (e) => U.seo_description = e,
							"aria-invalid": !!P(K).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: H.value,
							"aria-label": "SEO 描述"
						}, null, 8, rt), [[fe, U.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(l), {
				modelValue: M.value,
				"onUpdate:modelValue": a[22] ||= (e) => M.value = e,
				title: "确认删除",
				subtitle: `操作对象：${U.title || "未命名新闻"}`,
				width: "460px",
				"panel-class": "news-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !T.value
			}, {
				"header-actions": L(() => [x("span", it, [C(P(m), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: L(() => [C(P(t), {
					disabled: T.value,
					onClick: a[21] ||= (e) => M.value = !1
				}, {
					default: L(() => [...a[37] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(t), {
					variant: "warning",
					loading: T.value,
					onClick: V
				}, {
					default: L(() => [...a[38] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: L(() => [C(P(p), {
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
			C(P(l), {
				modelValue: le.value,
				"onUpdate:modelValue": a[25] ||= (e) => le.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: L(() => [C(P(t), { onClick: a[23] ||= (e) => le.value = !1 }, {
					default: L(() => [...a[39] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(t), {
					variant: "primary",
					onClick: a[24] ||= (e) => h("close")
				}, {
					default: L(() => [...a[40] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(l), {
				modelValue: ue.value,
				"onUpdate:modelValue": a[27] ||= (e) => ue.value = e,
				title: "将新闻转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: L(() => [C(P(t), { onClick: a[26] ||= (e) => ue.value = !1 }, {
					default: L(() => [...a[41] ||= [S("取消", -1)]]),
					_: 1
				}), C(P(t), {
					variant: "primary",
					onClick: je
				}, {
					default: L(() => [...a[42] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, We));
	}
}), [["__scopeId", "data-v-33394e7e"]]), ot = { class: "news-articles" }, st = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { newsPublishStates: n, newsCategoryLabel: i, getNewsList: a, getNewsMetadata: o } = q(), { hasPermission: c } = ge(), { formatDateTime: l } = ge(), u = j(!1), f = j(), ee = (e) => c([`cms_news:${e}`]), te = j(), p = K(o, (e) => {
			te.value = e;
		}), ne = [
			...ve(),
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
				formatter: (e) => i(te.value, e)
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
				formatter: l
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], re = _(() => [
			...p.fields,
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
				}, ...n]
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
		]), { proTableBindings: ie, reload: ae } = p.bindTable(r({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: re,
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
		})), oe = p.loadMetadata;
		function h(e) {
			f.value = e, u.value = !0;
		}
		function g() {
			u.value = !1, ae(), oe();
		}
		return (e, r) => (k(), b("div", ot, [u.value ? (k(), v(at, {
			key: 0,
			"article-id": f.value,
			onClose: r[0] ||= (e) => u.value = !1,
			onSaved: g
		}, null, 8, ["article-id"])) : y("", !0), me(C(P(s), E(P(ie), {
			"auto-refreshable": !1,
			columns: ne,
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
			"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": L(() => [ee("add") ? (k(), v(P(t), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: r[1] ||= (e) => h()
			}, {
				icon: L(() => [C(P(m), {
					name: "plus",
					size: 14
				})]),
				default: L(() => [r[2] ||= S("新增新闻", -1)]),
				_: 1
			})) : y("", !0)]),
			"cell-publish_status": L(({ row: e }) => [C(P(d), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: L(() => [S(N(P(n).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": L(({ row: e }) => [C(P(d), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: L(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": L(({ row: e }) => [S(N(P(l)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": L(({ row: e }) => [C(P(t), {
				size: "sm",
				"icon-only": "",
				title: ee("edit") ? "编辑新闻" : "新闻详情",
				"aria-label": ee("edit") ? "编辑新闻" : "新闻详情",
				onClick: (t) => h(e.id)
			}, {
				default: L(() => [C(P(m), {
					name: ee("edit") ? "square-pen" : "panel-right-open",
					size: 15
				}, null, 8, ["name"])]),
				_: 1
			}, 8, [
				"title",
				"aria-label",
				"onClick"
			])]),
			_: 1
		}, 16), [[I, !u.value]])]));
	}
}), [["__scopeId", "data-v-15e6f2c5"]]);
//#endregion
//#region src/cms/api/content/academy.ts
function ct() {
	let e = ge().request, t = "/cms/academy";
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
		uploadAcademyCover: c(e, "/cms/academy/upload"),
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
var lt = ["aria-busy"], ut = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, dt = { class: "taxonomy-editor__row" }, ft = "分类", pt = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "CategoryTable",
	setup(n) {
		let { hasPermission: i } = ge(), { formatDateTime: o } = ge(), { academyDifficulties: c, academyError: u, getAcademyList: ee, getAcademyMetadata: te, getAcademyDetail: ae, saveAcademy: h, deleteAcademyCategory: w } = ct(), T = (e) => i([`cms_academy_category:${e}`]), D = K(te), O = [
			...ve(),
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
				key: "difficulty_levels",
				dataIndex: "difficulty_levels",
				title: "难度范围",
				width: 170,
				formatter: (e) => (e || []).map((e) => c.find((t) => t.value === e)?.label).join(" / ")
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
				formatter: o
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], ce = [
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
				key: "difficulty_level",
				label: "难度范围",
				type: "select",
				width: 160,
				defaultValue: "",
				options: [{
					label: "全部",
					value: ""
				}, ...c]
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
		], { proTableBindings: le, reload: ue, currentPage: M, pageSize: de, total: F } = D.bindTable(r({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: ce,
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), a = await ee("categories", {
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
		}), I = A(fe()), pe = j(!1), me = j(!1), R = j(!1), z = j(!1), _e = j(!1), B = j(""), V = j(!1), H = j(""), U = j(!1), W = _(() => !T(I.id ? "edit" : "add")), G = _(() => R.value || z.value), q = "", J;
		async function be(e) {
			J?.abort(), J = new AbortController();
			let t = J;
			if (Object.assign(I, fe(), { id: e || "" }), H.value = "", _e.value = !1, B.value = "", V.value = !1, pe.value = !0, me.value = !!e, q = JSON.stringify(I), e) try {
				let n = await ae("categories", e, t.signal);
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
				}), q = JSON.stringify(I);
			} catch (e) {
				t.signal.aborted || (V.value = !0, H.value = u(e));
			} finally {
				t.signal.aborted || (me.value = !1);
			}
		}
		function Y() {
			return G.value ? !1 : !me.value && !V.value && JSON.stringify(I) !== q ? (U.value = !0, !1) : (J?.abort(), !0);
		}
		function xe() {
			G.value || (J?.abort(), pe.value = !1);
		}
		function X() {
			U.value = !1, pe.value = !1;
		}
		async function Se() {
			if (!(W.value || G.value || me.value || V.value)) {
				if (!I.name.trim() || I.sort_order === null || !I.difficulty_levels.length) {
					H.value = "请填写名称、排序和适用难度";
					return;
				}
				R.value = !0, H.value = "";
				try {
					await h("categories", {
						...I,
						id: I.id || void 0,
						row_version: I.id ? I.row_version : void 0
					}), pe.value = !1, f.success("保存成功"), await ue();
				} catch (e) {
					H.value = u(e);
				} finally {
					R.value = !1;
				}
			}
		}
		function Z() {
			!I.id || !T("delete") || G.value || me.value || V.value || (B.value = "", _e.value = !0);
		}
		async function Q() {
			if (!(!_e.value || !I.id || !T("delete") || G.value || me.value || V.value)) {
				z.value = !0, B.value = "";
				try {
					await w({
						id: I.id,
						row_version: I.row_version
					}), _e.value = !1, pe.value = !1, f.success("分类已删除"), await ue(), M.value = Math.min(M.value, Math.max(1, Math.ceil(F.value / de.value)));
				} catch (e) {
					B.value = u(e);
				} finally {
					z.value = !1;
				}
			}
		}
		return se(() => J?.abort()), (n, r) => (k(), b(g, null, [
			C(P(s), E(P(le), {
				"auto-refreshable": !1,
				columns: O,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${ft}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": L(() => [T("add") ? (k(), v(P(t), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => be()
				}, {
					icon: L(() => [C(P(m), {
						name: "plus",
						size: 14
					})]),
					default: L(() => [S("新增" + N(ft))]),
					_: 1
				})) : y("", !0)]),
				"cell-is_enabled": L(({ row: e }) => [C(P(d), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: L(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": L(({ row: e }) => [C(P(t), {
					size: "sm",
					"icon-only": "",
					title: T("edit") ? `编辑${ft}` : `${ft}详情`,
					"aria-label": `编辑${ft}`,
					onClick: (t) => be(e.id)
				}, {
					default: L(() => [C(P(m), {
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
			C(P(l), {
				modelValue: pe.value,
				"onUpdate:modelValue": r[5] ||= (e) => pe.value = e,
				title: `${I.id ? "编辑" : "新增"}课程${ft}`,
				width: "620px",
				"close-on-click-modal": !1,
				"before-close": Y
			}, {
				footer: L(() => [
					I.id && T("delete") ? (k(), v(P(t), {
						key: 0,
						variant: "danger",
						disabled: me.value || V.value || G.value,
						onClick: Z
					}, {
						icon: L(() => [C(P(m), {
							name: "trash-2",
							size: 14
						})]),
						default: L(() => [r[10] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(t), {
						disabled: G.value,
						onClick: xe
					}, {
						default: L(() => [...r[11] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					W.value ? y("", !0) : (k(), v(P(t), {
						key: 1,
						variant: "primary",
						loading: R.value,
						disabled: me.value || V.value || z.value,
						onClick: Se
					}, {
						default: L(() => [S("保存" + N(ft))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: L(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": me.value
				}, [
					me.value ? (k(), b("div", ut, [C(P(m), {
						name: "loader-circle",
						class: "academy-spin",
						size: 24
					}), x("span", null, "正在读取" + N(ft) + "...")])) : y("", !0),
					H.value ? (k(), v(P(p), {
						key: 1,
						type: "error",
						closable: !1,
						description: H.value
					}, null, 8, ["description"])) : y("", !0),
					!me.value && !V.value ? (k(), v(P(ie), {
						key: 2,
						model: I,
						"label-position": "top",
						onSubmit: he(Se, ["prevent"])
					}, {
						default: L(() => [
							C(P(e), {
								label: `${ft}名称`,
								required: ""
							}, {
								default: L(() => [C(P(oe), {
									modelValue: I.name,
									"onUpdate:modelValue": r[1] ||= (e) => I.name = e,
									maxlength: 120,
									disabled: W.value || G.value,
									"aria-label": `${ft}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							C(P(e), {
								label: "适用难度",
								required: ""
							}, {
								default: L(() => [C(P(re), {
									modelValue: I.difficulty_levels,
									"onUpdate:modelValue": r[2] ||= (e) => I.difficulty_levels = e,
									multiple: "",
									options: P(c),
									disabled: W.value || G.value,
									"aria-label": "适用难度"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								])]),
								_: 1
							}),
							x("div", dt, [C(P(e), {
								label: "前端排序",
								required: ""
							}, {
								default: L(() => [C(P(ne), {
									modelValue: I.sort_order,
									"onUpdate:modelValue": r[3] ||= (e) => I.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: W.value || G.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(P(e), { label: "启用状态" }, {
								default: L(() => [C(P(a), {
									modelValue: I.is_enabled,
									"onUpdate:modelValue": r[4] ||= (e) => I.is_enabled = e,
									disabled: W.value || G.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : y("", !0)
				], 8, lt)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(P(l), {
				modelValue: _e.value,
				"onUpdate:modelValue": r[7] ||= (e) => _e.value = e,
				title: "删除课程分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !z.value
			}, {
				footer: L(() => [C(P(t), {
					disabled: z.value,
					onClick: r[6] ||= (e) => _e.value = !1
				}, {
					default: L(() => [...r[12] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(t), {
					variant: "danger",
					loading: z.value,
					onClick: Q
				}, {
					default: L(() => [...r[13] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: L(() => [x("p", null, "确认删除分类“" + N(I.name) + "”？有关联课程的分类无法删除。", 1), B.value ? (k(), v(P(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: B.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(P(l), {
				modelValue: U.value,
				"onUpdate:modelValue": r[9] ||= (e) => U.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: L(() => [C(P(t), { onClick: r[8] ||= (e) => U.value = !1 }, {
					default: L(() => [...r[14] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(t), {
					variant: "primary",
					onClick: X
				}, {
					default: L(() => [...r[15] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 64));
	}
}), [["__scopeId", "data-v-843ce4a1"]]), mt = { class: "academy-categories" }, ht = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		return (e, t) => (k(), b("div", mt, [C(pt)]));
	}
}), [["__scopeId", "data-v-8f5e5114"]]), gt = [
	"category_ids",
	"cover_url",
	"difficulty_level",
	"estimated_minutes",
	"sort_order",
	"is_enabled",
	"scheduled_local",
	"title",
	"summary",
	"body_html",
	"seo_description"
];
function _t(e) {
	if (/[\x00-\x20\\]/.test(e)) return !1;
	if (e.startsWith("/") && !e.startsWith("//")) return !0;
	try {
		let t = new URL(e);
		return /^https?:\/\//i.test(e) && ["http:", "https:"].includes(t.protocol);
	} catch {
		return !1;
	}
}
function vt(e) {
	return e.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "").replace(/&nbsp;|&#0*(?:160|9|10|13|32);|&#x0*(?:a0|9|a|d|20);/gi, " ").trim().length > 0;
}
function yt(e, t, n, r = Date.now()) {
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
	(e.sort_order === null || !Number.isInteger(e.sort_order) || e.sort_order < 0 || e.sort_order > 2147483647) && (i.sort_order = "请填写 0–2147483647 之间的整数"), e.cover_url && !_t(e.cover_url) && (i.cover_url = "封面地址必须为 HTTP(S) 或站内绝对路径");
	let o = e.category_ids.map((e) => t.find((t) => t.id === e));
	if (a && !o.length ? i.category_ids = "请选择课程分类" : o.some((e) => !e) ? i.category_ids = "所选分类已不可用，请重新选择" : a && o.some((e) => !e?.is_enabled) ? i.category_ids = "发布课程必须选择已启用的分类" : o.length > 50 && (i.category_ids = "最多选择 50 个课程分类"), a && !e.difficulty_level ? i.difficulty_level = "请选择课程难度" : e.difficulty_level !== "" && ![
		1,
		2,
		3
	].includes(e.difficulty_level) ? i.difficulty_level = "请选择有效的课程难度" : e.difficulty_level && o.some((t) => t && !t.difficulty_levels.includes(Number(e.difficulty_level))) && (i.difficulty_level = "课程难度不在所选分类的适用范围内"), a && e.estimated_minutes === null ? i.estimated_minutes = "请填写预计课时" : e.estimated_minutes !== null && (!Number.isInteger(e.estimated_minutes) || e.estimated_minutes < 1 || e.estimated_minutes > 1e5) && (i.estimated_minutes = "预计课时须为 1–100000 之间的整数"), a && !vt(e.body_html) && (i.body_html = "请填写课程正文"), n === "scheduled") {
		let t = new Date(e.scheduled_local).getTime();
		(!Number.isFinite(t) || t <= r) && (i.scheduled_local = "计划发布时间必须晚于当前时间");
	}
	return i;
}
var bt = {
	课程标题不能为空: "title",
	"封面地址必须为 HTTP(S) 或站内绝对路径": "cover_url",
	计划发布时间必须晚于当前时间: "scheduled_local",
	发布课程必须选择分类: "category_ids",
	所选分类不存在或不属于当前学院模板: "category_ids",
	"发布课程必须选择已启用的分类，存在已停用分类": "category_ids",
	课程难度不在所选分类的适用范围内: "difficulty_level",
	"发布课程需要填写正文、课程难度及预计课时": "body_html"
};
function xt(e) {
	let t = {}, n = [], r = e && typeof e == "object" ? e : {};
	for (let [e, i] of Object.entries(r.errors || {})) {
		let r = e.split(".")[0], a = r === "scheduled_at" ? "scheduled_local" : r;
		for (let r of Array.isArray(i) ? i : [i]) {
			if (typeof r != "string" || !r) continue;
			let i = gt.includes(a) ? a : e === "academy" ? bt[r] : void 0;
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
var St = ["aria-busy"], Ct = { class: "course-editor__header" }, wt = { class: "course-editor__heading" }, Tt = { class: "course-editor__commands" }, Et = {
	key: 2,
	class: "course-editor__save-error",
	role: "alert"
}, Dt = {
	key: 3,
	class: "course-editor__publish-actions"
}, Ot = {
	key: 0,
	class: "course-editor__pending",
	role: "status",
	"aria-live": "polite"
}, kt = {
	key: 0,
	class: "course-editor__loading",
	role: "status"
}, At = {
	key: 1,
	class: "course-editor__failure"
}, jt = {
	key: 2,
	class: "course-editor__body"
}, Mt = { class: "course-editor__settings" }, Nt = { class: "course-editor__content" }, Pt = ["disabled", "aria-invalid"], Ft = ["disabled", "aria-invalid"], It = {
	class: "course-delete-dialog__icon",
	"aria-hidden": "true"
}, Lt = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "CourseEditor",
	props: { courseId: {} },
	emits: ["close", "saved"],
	setup(r, { emit: i }) {
		let { hasPermission: o } = ge(), { academyDifficulties: s, academyError: c, deleteAcademyCourse: u, getAcademyDetail: d, getAcademyMetadata: ee, saveAcademy: te, uploadAcademyCover: ae } = ct(), h = r, g = i, w = j(!0), T = j(!1), E = j(!1), O = j(""), le = j(!1), ue = j(!1), M = j(!1), de = j(ge().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), F = j(), I = j("draft"), R = j(!1), z = j(!1), B = j(""), V = _(() => o(["cms_academy:publish"])), H = _(() => !!h.courseId && o(["cms_academy:delete"]) && (V.value || I.value === "draft")), U = _(() => !o([`cms_academy:${h.courseId ? "edit" : "add"}`]) || !V.value && I.value !== "draft"), W = _(() => U.value || T.value), G = A({
			id: "",
			row_version: "",
			title: "",
			category_ids: [],
			summary: "",
			body_html: "",
			seo_description: "",
			cover_url: "",
			difficulty_level: 1,
			estimated_minutes: 6,
			sort_order: 10,
			is_enabled: !0,
			scheduled_local: ""
		}), ve = j(), K = j(), ye = j(null), q = j(Date.now()), J = A({}), be = j(""), Y = Object.fromEntries(gt.map((e) => [e, {
			required: e === "title" || e === "category_ids",
			trigger: "submit"
		}])), xe = _(() => ye.value ? yt(G, F.value?.categories || [], ye.value === "draft" ? "draft" : G.scheduled_local ? "scheduled" : "published", q.value) : {}), X = _(() => ({
			...J,
			...xe.value
		})), Se = _(() => Object.keys(X.value).length);
		for (let e of gt) pe(() => G[e], () => {
			delete J[e], e === "category_ids" && delete J.difficulty_level, be.value = "", q.value = Date.now();
		}, { deep: !0 });
		function Z() {
			X.value.seo_description && K.value?.focus();
		}
		async function Q() {
			await D();
			let e = [...ve.value?.querySelectorAll("[data-prop]") || []].find((e) => X.value[e.dataset.prop]);
			if (!e && X.value.seo_description) {
				le.value ? Z() : le.value = !0;
				return;
			}
			e && (e.scrollIntoView({
				block: "center",
				behavior: "auto"
			}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
		}
		let $ = _(() => (F.value?.categories || []).map((e) => ({
			label: e.name + (e.is_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.is_enabled
		}))), Ce = _(() => {
			let e = (F.value?.categories || []).filter((e) => G.category_ids.includes(e.id));
			return s.map((t) => ({
				...t,
				disabled: e.some((e) => !e.difficulty_levels.includes(t.value))
			}));
		}), we = "", Te;
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
				if (F.value = await ee(e.signal, { cms_source_type: "platform" }), h.courseId) {
					let t = await d("courses", h.courseId, e.signal);
					if (F.value = await ee(e.signal, { space_id: String(t.space_id) }), de.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"category_ids",
						"estimated_minutes",
						"sort_order",
						"is_enabled"
					]) Object.assign(G, { [e]: t[e] });
					G.difficulty_level = t.difficulty_level || "";
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url"
					]) G[e] = t[e] || "";
					G.scheduled_local = t.publish_status === "scheduled" ? Ee(t.scheduled_at) : "", I.value = t.publish_status;
				}
				we = JSON.stringify(G);
			} catch (t) {
				e.signal.aborted || (O.value = c(t), E.value = !0);
			} finally {
				e.signal.aborted || (w.value = !1);
			}
		}
		let Oe = () => !w.value && !E.value && we !== JSON.stringify(G);
		function ke() {
			Oe() ? ue.value = !0 : g("close");
		}
		function Ae() {
			I.value === "draft" ? Me("draft") : M.value = !0;
		}
		function je() {
			M.value = !1, Me("draft");
		}
		async function Me(e) {
			if (W.value || w.value || E.value || R.value) return;
			ye.value = e === "draft" ? "draft" : "publish", q.value = Date.now(), be.value = "";
			for (let e of gt) delete J[e];
			if (Se.value) {
				await Q();
				return;
			}
			let t = G.scheduled_local ? new Date(G.scheduled_local) : null;
			T.value = !0, O.value = "";
			try {
				await te("courses", {
					...G,
					id: G.id || void 0,
					row_version: G.id ? G.row_version : void 0,
					difficulty_level: G.difficulty_level || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), we = JSON.stringify(G), f.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "课程已发布"), g("saved");
			} catch (e) {
				let t = xt(e);
				Object.assign(J, t.fields), be.value = t.general;
			} finally {
				T.value = !1;
			}
			Se.value && await Q();
		}
		function Ne() {
			B.value = "", z.value = !0;
		}
		async function Pe() {
			if (!(!H.value || w.value || E.value || T.value || R.value)) {
				T.value = !0, B.value = "";
				try {
					await u({
						id: G.id,
						row_version: G.row_version
					}), we = JSON.stringify(G), z.value = !1, f.success("课程已删除"), g("saved");
				} catch (e) {
					B.value = c(e);
				} finally {
					T.value = !1;
				}
			}
		}
		function Fe(e) {
			J.cover_url = c(e);
		}
		function Ie() {
			delete J.cover_url;
		}
		let Le = (e) => {
			Oe() && (e.preventDefault(), e.returnValue = "");
		};
		return _e(() => !T.value && !R.value && (!Oe() || window.confirm("课程有未保存的修改，确定离开？"))), ce(() => {
			De(), window.addEventListener("beforeunload", Le);
		}), se(() => {
			Te?.abort(), window.removeEventListener("beforeunload", Le);
		}), (i, o) => (k(), b("section", {
			ref_key: "editorRoot",
			ref: ve,
			class: "course-editor",
			"aria-busy": w.value || T.value
		}, [
			x("header", Ct, [
				C(P(t), {
					"icon-only": "",
					title: "返回课程列表",
					"aria-label": "返回课程列表",
					disabled: T.value || R.value,
					onClick: ke
				}, {
					default: L(() => [C(P(m), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", wt, [x("h2", null, N(r.courseId ? "编辑课程" : "新增课程"), 1), x("span", null, N(F.value?.source_locale || "zh-CN") + " · " + N(de.value), 1)]),
				x("div", Tt, [
					H.value ? (k(), v(P(t), {
						key: 0,
						variant: "danger",
						size: "sm",
						disabled: w.value || E.value || T.value || R.value,
						onClick: Ne
					}, {
						default: L(() => [...o[27] ||= [S("删除课程", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(t), {
						size: "sm",
						disabled: w.value || E.value,
						onClick: o[0] ||= (e) => le.value = !0
					}, {
						icon: L(() => [C(P(m), {
							name: "search",
							size: 14
						})]),
						default: L(() => [o[28] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					U.value ? y("", !0) : (k(), v(P(t), {
						key: 1,
						size: "sm",
						disabled: w.value || E.value || T.value || R.value,
						onClick: Ae
					}, {
						icon: L(() => [C(P(m), {
							name: "save",
							size: 14
						})]),
						default: L(() => [o[29] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					be.value ? (k(), b("span", Et, N(be.value), 1)) : y("", !0),
					U.value ? y("", !0) : (k(), b("div", Dt, [Se.value ? (k(), b("span", Ot, "还有 " + N(Se.value) + " 项待完善", 1)) : y("", !0), V.value ? (k(), v(P(t), {
						key: 1,
						variant: "primary",
						size: "sm",
						disabled: w.value || E.value || R.value,
						loading: T.value,
						onClick: o[1] ||= (e) => Me(G.scheduled_local ? "scheduled" : "published")
					}, {
						icon: L(() => [C(P(m), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: L(() => [S(N(G.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)]))
				])
			]),
			w.value ? (k(), b("div", kt, [C(P(m), {
				name: "loader-circle",
				class: "academy-spin",
				size: 28
			}), o[30] ||= x("span", null, "正在读取课程资料...", -1)])) : E.value ? (k(), b("div", At, [C(P(p), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"]), C(P(t), { onClick: De }, {
				default: L(() => [...o[31] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (k(), b("div", jt, [x("aside", Mt, [C(P(ie), {
				model: G,
				rules: P(Y),
				"label-position": "top",
				onSubmit: o[11] ||= he(() => {}, ["prevent"])
			}, {
				default: L(() => [
					C(P(e), {
						label: "课程分类",
						prop: "category_ids",
						error: X.value.category_ids,
						required: ""
					}, {
						default: L(() => [C(P(re), {
							modelValue: G.category_ids,
							"onUpdate:modelValue": o[2] ||= (e) => G.category_ids = e,
							options: $.value,
							multiple: "",
							filterable: "",
							clearable: "",
							disabled: W.value,
							"aria-label": "课程分类"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					o[32] ||= x("h3", null, "课程设置", -1),
					C(P(e), {
						label: "课程封面",
						prop: "cover_url",
						error: X.value.cover_url
					}, {
						default: L(() => [C(Ue, {
							modelValue: G.cover_url,
							"onUpdate:modelValue": o[3] ||= (e) => G.cover_url = e,
							label: "课程封面",
							disabled: W.value,
							upload: P(ae),
							onBusyChange: o[4] ||= (e) => R.value = e,
							onStart: o[5] ||= (e) => O.value = "",
							onError: Fe,
							onSuccess: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "课程难度",
						prop: "difficulty_level",
						error: X.value.difficulty_level
					}, {
						default: L(() => [C(P(re), {
							modelValue: G.difficulty_level,
							"onUpdate:modelValue": o[6] ||= (e) => G.difficulty_level = e,
							options: Ce.value,
							disabled: W.value,
							"aria-label": "课程难度"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "预计课时(分钟)",
						prop: "estimated_minutes",
						error: X.value.estimated_minutes
					}, {
						default: L(() => [C(P(ne), {
							modelValue: G.estimated_minutes,
							"onUpdate:modelValue": o[7] ||= (e) => G.estimated_minutes = e,
							min: 1,
							max: 1e5,
							precision: 0,
							disabled: W.value,
							"aria-label": "预计课时"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "前端排序",
						prop: "sort_order",
						error: X.value.sort_order
					}, {
						default: L(() => [C(P(ne), {
							modelValue: G.sort_order,
							"onUpdate:modelValue": o[8] ||= (e) => G.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: W.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[33] ||= x("h3", null, "发布设置", -1),
					C(P(e), {
						label: "启用状态",
						prop: "is_enabled",
						error: X.value.is_enabled
					}, {
						default: L(() => [C(P(a), {
							modelValue: G.is_enabled,
							"onUpdate:modelValue": o[9] ||= (e) => G.is_enabled = e,
							disabled: W.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "计划发布时间",
						prop: "scheduled_local",
						error: X.value.scheduled_local
					}, {
						default: L(() => [C(P(oe), {
							modelValue: G.scheduled_local,
							"onUpdate:modelValue": o[10] ||= (e) => G.scheduled_local = e,
							type: "datetime-local",
							disabled: W.value || !V.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", Nt, [C(P(ie), {
				model: G,
				rules: P(Y),
				"label-position": "top",
				onSubmit: o[15] ||= he(() => {}, ["prevent"])
			}, {
				default: L(() => [
					C(P(e), {
						label: "标题",
						prop: "title",
						error: X.value.title,
						required: ""
					}, {
						default: L(() => [C(P(oe), {
							modelValue: G.title,
							"onUpdate:modelValue": o[12] ||= (e) => G.title = e,
							maxlength: 255,
							disabled: W.value,
							placeholder: "输入课程标题",
							"aria-label": "课程标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "摘要",
						prop: "summary",
						error: X.value.summary
					}, {
						default: L(() => [me(x("textarea", {
							"onUpdate:modelValue": o[13] ||= (e) => G.summary = e,
							class: "course-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: W.value,
							"aria-invalid": !!X.value.summary,
							"aria-label": "课程摘要"
						}, null, 8, Pt), [[fe, G.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "正文",
						prop: "body_html",
						error: X.value.body_html
					}, {
						default: L(() => [C(P(n), {
							modelValue: G.body_html,
							"onUpdate:modelValue": o[14] ||= (e) => G.body_html = e,
							readonly: U.value,
							disabled: T.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "课程正文"
						}, {
							"image-upload": L(({ url: e, setUrl: t, setBusy: n }) => [C(Ue, {
								label: "正文图片",
								"model-value": e,
								upload: P(ae),
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
			C(P(l), {
				modelValue: le.value,
				"onUpdate:modelValue": o[19] ||= (e) => le.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1,
				onOpened: Z
			}, {
				footer: L(() => [C(P(t), {
					variant: "primary",
					onClick: o[18] ||= (e) => le.value = !1
				}, {
					default: L(() => [...o[34] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: L(() => [C(P(ie), {
					model: G,
					rules: P(Y),
					"label-position": "top",
					onSubmit: o[17] ||= he(() => {}, ["prevent"])
				}, {
					default: L(() => [C(P(e), {
						label: "SEO 描述",
						prop: "seo_description",
						error: X.value.seo_description
					}, {
						default: L(() => [me(x("textarea", {
							ref_key: "seoInput",
							ref: K,
							"onUpdate:modelValue": o[16] ||= (e) => G.seo_description = e,
							class: "course-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: W.value,
							"aria-invalid": !!X.value.seo_description,
							"aria-label": "SEO 描述"
						}, null, 8, Ft), [[fe, G.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(l), {
				modelValue: z.value,
				"onUpdate:modelValue": o[21] ||= (e) => z.value = e,
				title: "确认删除",
				subtitle: `操作对象：${G.title || "未命名课程"}`,
				width: "460px",
				"panel-class": "course-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !T.value
			}, {
				"header-actions": L(() => [x("span", It, [C(P(m), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: L(() => [C(P(t), {
					disabled: T.value,
					onClick: o[20] ||= (e) => z.value = !1
				}, {
					default: L(() => [...o[35] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(t), {
					variant: "warning",
					loading: T.value,
					onClick: Pe
				}, {
					default: L(() => [...o[36] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: L(() => [C(P(p), {
					class: "course-delete-dialog__notice",
					type: "warning",
					closable: !1,
					"show-icon": !1,
					description: "确定删除这门课程吗？删除后将不再展示，请谨慎操作。"
				}), B.value ? (k(), v(P(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: B.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, [
				"modelValue",
				"subtitle",
				"before-close"
			]),
			C(P(l), {
				modelValue: ue.value,
				"onUpdate:modelValue": o[24] ||= (e) => ue.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: L(() => [C(P(t), { onClick: o[22] ||= (e) => ue.value = !1 }, {
					default: L(() => [...o[37] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(t), {
					variant: "primary",
					onClick: o[23] ||= (e) => g("close")
				}, {
					default: L(() => [...o[38] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(l), {
				modelValue: M.value,
				"onUpdate:modelValue": o[26] ||= (e) => M.value = e,
				title: "将课程转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: L(() => [C(P(t), { onClick: o[25] ||= (e) => M.value = !1 }, {
					default: L(() => [...o[39] ||= [S("取消", -1)]]),
					_: 1
				}), C(P(t), {
					variant: "primary",
					onClick: je
				}, {
					default: L(() => [...o[40] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, St));
	}
}), [["__scopeId", "data-v-5c9105db"]]), Rt = { class: "academy-courses" }, zt = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { hasPermission: n } = ge(), { formatDateTime: i } = ge(), { academyDifficulties: a, academyPublishStates: o, getAcademyList: c, getAcademyMetadata: l } = ct(), u = j(!1), f = j(), ee = (e) => n([`cms_academy:${e}`]), te = j(), p = K(l, (e) => {
			te.value = e;
		}), ne = [
			...ve(),
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
				formatter: (e) => a.find((t) => t.value === Number(e))?.label || "-"
			},
			{
				key: "estimated_minutes",
				dataIndex: "estimated_minutes",
				title: "预计课时(分钟)",
				width: 120,
				formatter: (e) => e == null ? "-" : String(e)
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
		], re = _(() => [
			...p.fields,
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
				}, ...(te.value?.categories || []).map((e) => ({
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
				}, ...a]
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
				}, ...o]
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
		]), { proTableBindings: ie, reload: ae } = p.bindTable(r({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: re,
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([e, t]) => e !== "publish_range" && t !== "" && t != null)), a = e.publish_range;
				Array.isArray(a) && a.length === 2 && (i.published_from = (/* @__PURE__ */ new Date(`${a[0]}T00:00:00`)).toISOString(), i.published_to = (/* @__PURE__ */ new Date(`${a[1]}T23:59:59.999`)).toISOString());
				let o = await c("courses", {
					...i,
					page_no: t,
					page_size: n
				}, r);
				return {
					rows: o.lists,
					total: o.count
				};
			}
		})), oe = p.loadMetadata;
		function h(e) {
			f.value = e, u.value = !0;
		}
		function g() {
			u.value = !1, ae(), oe();
		}
		return (e, n) => (k(), b("div", Rt, [u.value ? (k(), v(Lt, {
			key: 0,
			"course-id": f.value,
			onClose: n[0] ||= (e) => u.value = !1,
			onSaved: g
		}, null, 8, ["course-id"])) : y("", !0), me(C(P(s), E(P(ie), {
			"auto-refreshable": !1,
			columns: ne,
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
			"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": L(() => [ee("add") ? (k(), v(P(t), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: n[1] ||= (e) => h()
			}, {
				icon: L(() => [C(P(m), {
					name: "plus",
					size: 14
				})]),
				default: L(() => [n[2] ||= S("新增课程", -1)]),
				_: 1
			})) : y("", !0)]),
			"cell-publish_status": L(({ row: e }) => [C(P(d), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: L(() => [S(N(P(o).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": L(({ row: e }) => [C(P(d), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: L(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": L(({ row: e }) => [S(N(P(i)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": L(({ row: e }) => [C(P(t), {
				size: "sm",
				"icon-only": "",
				title: ee("edit") ? "编辑课程" : "课程详情",
				"aria-label": ee("edit") ? "编辑课程" : "课程详情",
				onClick: (t) => h(e.id)
			}, {
				default: L(() => [C(P(m), {
					name: ee("edit") ? "square-pen" : "panel-right-open",
					size: 15
				}, null, 8, ["name"])]),
				_: 1
			}, 8, [
				"title",
				"aria-label",
				"onClick"
			])]),
			_: 1
		}, 16), [[I, !u.value]])]));
	}
}), [["__scopeId", "data-v-1b38d3e6"]]);
//#endregion
//#region src/cms/api/content/help.ts
function Bt() {
	let e = ge().request, t = "/cms/help", n = (n, r = {}) => e.get({
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
	}, { isOpenRetry: !1 }), s = c(e, "/cms/help/categories/upload"), l = c(e, "/cms/help/upload"), u = [
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
	function d(e, t) {
		let n = e?.categories.find((e) => e.id === String(t));
		if (!n) return "—";
		let r = e?.categories.find((e) => e.id === n.parent_id);
		return r ? `${r.name} / ${n.name}` : n.name;
	}
	function f(e) {
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
		uploadHelpCover: l,
		helpPublishStates: u,
		helpCategoryLabel: d,
		helpError: f
	};
}
//#endregion
//#region src/cms/views/content/help/EnabledToggle.vue?vue&type=script&setup=true&lang.ts
var Vt = ["aria-checked", "disabled"], Ht = /*#__PURE__*/ h(/* @__PURE__ */ w({
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
		}, [x("span")], -1), x("span", null, N(e.modelValue ? "已启用" : "已停用"), 1)], 10, Vt));
	}
}), [["__scopeId", "data-v-5cfe8693"]]), Ut = { class: "help-categories" }, Wt = ["aria-busy"], Gt = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Kt = { class: "taxonomy-editor__field" }, qt = { class: "taxonomy-editor__row" }, Jt = "分类", Yt = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(n) {
		let { helpError: i, deleteHelp: a, getHelpMetadata: o, getHelpList: c, getHelpDetail: u, saveHelp: ee, uploadHelpCategoryImage: te } = Bt(), { hasPermission: ae } = ge(), { formatDateTime: h } = ge(), g = (e) => ae([`cms_help_category:${e}`]), w = j(), T = j(), D = K(o, (e) => {
			w.value = e;
		}), O = [
			{
				key: "name",
				dataIndex: "name",
				title: "分类名称",
				width: 210,
				hideable: !1
			},
			...ve(),
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
				formatter: h
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], ce = _(() => [
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
		]), { proTableBindings: le, rows: ue, reload: M } = D.bindTable(r({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: ce,
			request: async ({ filters: e, signal: t, reason: n }) => {
				let r = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), i = await W((e, n) => c("categories", {
					...r,
					page_no: e,
					page_size: n
				}, t), t);
				return !t.aborted && (n === "query" || n === "reset") && (F.value = Object.keys(r).length ? new Set(i.rows.filter((e) => e.parent_id != null).map((e) => String(e.parent_id))) : /* @__PURE__ */ new Set()), i;
			}
		})), { visibleRows: de, expanded: F, groups: fe, allExpanded: I, toggle: pe, toggleAll: me } = G(ue), R = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			image_url: "",
			image_media_id: null,
			sort_order: 10,
			is_enabled: !0
		}), z = A(R()), _e = j(!1), B = j(!1), V = j(!1), H = j(!1), q = j(!1), J = j(!1), be = j(""), Y = j(!1), xe = j(""), X = _(() => !g(z.id ? "edit" : "add")), Se = _(() => H.value || q.value || _e.value), Z;
		async function Q(e) {
			Z?.abort(), Z = new AbortController();
			let t = Z;
			Object.assign(z, R(), { id: e || "" }), xe.value = "", J.value = !1, be.value = "", Y.value = !1, B.value = !0, V.value = !0;
			try {
				if (T.value = await o(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await u("categories", e, t.signal);
				if (T.value = await o(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(z, {
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
				t.signal.aborted || (Y.value = !0, xe.value = i(e));
			} finally {
				t.signal.aborted || (V.value = !1);
			}
		}
		function $() {
			return Se.value ? !1 : (Z?.abort(), !0);
		}
		function Ce() {
			$() && (B.value = !1);
		}
		async function we() {
			if (!(X.value || Se.value || V.value || Y.value)) {
				if (!z.name.trim() || z.sort_order === null) {
					xe.value = "请填写分类名称和排序";
					return;
				}
				H.value = !0, xe.value = "";
				try {
					await ee("categories", {
						name: z.name,
						parent_id: z.parent_id || null,
						image_media_id: z.image_media_id,
						sort_order: z.sort_order,
						is_enabled: z.is_enabled,
						id: z.id || void 0,
						row_version: z.id ? z.row_version : void 0
					}), B.value = !1, f.success("保存成功"), await Promise.all([M(), Oe()]);
				} catch (e) {
					xe.value = i(e);
				} finally {
					H.value = !1;
				}
			}
		}
		function Te() {
			!z.id || !g("delete") || Se.value || V.value || Y.value || (be.value = "", J.value = !0);
		}
		async function Ee() {
			if (!(!J.value || !z.id || !g("delete") || Se.value || V.value || Y.value)) {
				q.value = !0, be.value = "";
				try {
					await a("categories", z.id, z.row_version), J.value = !1, B.value = !1, f.success("分类已删除"), await Promise.all([M(), Oe()]);
				} catch (e) {
					be.value = i(e);
				} finally {
					q.value = !1;
				}
			}
		}
		let De = _(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(T.value?.categories || []).filter((e) => !e.parent_id && e.id !== z.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Oe = D.loadMetadata;
		return se(() => {
			Z?.abort();
		}), (n, r) => (k(), b("div", Ut, [
			C(P(s), E(P(le), {
				"auto-refreshable": !1,
				columns: O,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Jt}管理`,
				data: P(de),
				"show-pagination": !1
			}), {
				"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": L(() => [g("add") ? (k(), v(P(t), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => Q()
				}, {
					icon: L(() => [C(P(m), {
						name: "plus",
						size: 14
					})]),
					default: L(() => [S("新增" + N(Jt))]),
					_: 1
				})) : y("", !0), C(P(t), {
					size: "sm",
					disabled: !P(fe).children.size,
					onClick: P(me)
				}, {
					icon: L(() => [C(P(m), {
						name: P(I) ? "chevron-up" : "chevron-down",
						size: 14
					}, null, 8, ["name"])]),
					default: L(() => [S(" " + N(P(I) ? "全部收起" : "全部展开"), 1)]),
					_: 1
				}, 8, ["disabled", "onClick"])]),
				"cell-name": L(({ row: e }) => [C(U, {
					name: e.name,
					child: e.parent_id != null,
					branch: P(fe).children.has(e.id),
					expanded: P(F).has(e.id),
					onToggle: (t) => P(pe)(e.id)
				}, null, 8, [
					"name",
					"child",
					"branch",
					"expanded",
					"onToggle"
				])]),
				"cell-is_enabled": L(({ row: e }) => [C(P(d), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: L(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": L(({ row: e }) => [C(P(t), {
					size: "sm",
					"icon-only": "",
					title: g("edit") ? `编辑${Jt}` : `${Jt}详情`,
					"aria-label": `编辑${Jt}`,
					onClick: (t) => Q(e.id)
				}, {
					default: L(() => [C(P(m), {
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
			C(P(l), {
				modelValue: B.value,
				"onUpdate:modelValue": r[10] ||= (e) => B.value = e,
				title: `${z.id ? "编辑" : "新增"}帮助${Jt}`,
				width: "680px",
				subtitle: "帮助分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": $
			}, {
				footer: L(() => [
					z.id && g("delete") ? (k(), v(P(t), {
						key: 0,
						variant: "danger",
						disabled: V.value || Y.value || Se.value,
						onClick: Te
					}, {
						icon: L(() => [C(P(m), {
							name: "trash-2",
							size: 14
						})]),
						default: L(() => [r[14] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(t), {
						disabled: Se.value,
						onClick: Ce
					}, {
						default: L(() => [...r[15] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					X.value ? y("", !0) : (k(), v(P(t), {
						key: 1,
						variant: "primary",
						loading: H.value,
						disabled: V.value || Y.value || q.value || _e.value,
						onClick: we
					}, {
						default: L(() => [S("保存" + N(Jt))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: L(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": V.value
				}, [
					V.value ? (k(), b("div", Gt, [C(P(m), {
						name: "loader-circle",
						class: "help-spin",
						size: 24
					}), x("span", null, "正在读取" + N(Jt) + "...")])) : y("", !0),
					xe.value ? (k(), v(P(p), {
						key: 1,
						type: "error",
						closable: !1,
						description: xe.value
					}, null, 8, ["description"])) : y("", !0),
					!V.value && !Y.value ? (k(), v(P(ie), {
						key: 2,
						model: z,
						"label-position": "top",
						onSubmit: he(we, ["prevent"])
					}, {
						default: L(() => [
							z.id ? (k(), v(P(e), {
								key: 0,
								label: "分类ID"
							}, {
								default: L(() => [C(P(oe), {
									"model-value": z.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : y("", !0),
							C(P(e), {
								label: `${Jt}名称`,
								required: ""
							}, {
								default: L(() => [C(P(oe), {
									modelValue: z.name,
									"onUpdate:modelValue": r[1] ||= (e) => z.name = e,
									maxlength: 120,
									disabled: X.value || Se.value,
									"aria-label": `${Jt}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							C(P(e), { label: "父分类" }, {
								default: L(() => [x("div", Kt, [C(P(re), {
									modelValue: z.parent_id,
									"onUpdate:modelValue": r[2] ||= (e) => z.parent_id = e,
									options: De.value,
									disabled: X.value || Se.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), r[13] ||= x("p", { class: "help-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类文章。 ", -1)])]),
								_: 1
							}),
							C(P(e), { label: "分类图片" }, {
								default: L(() => [C(Ue, {
									class: "taxonomy-editor__image",
									modelValue: z.image_url,
									"onUpdate:modelValue": r[3] ||= (e) => z.image_url = e,
									label: "分类图片",
									upload: P(te),
									disabled: X.value || Se.value,
									"onUpdate:mediaId": r[4] ||= (e) => z.image_media_id = e,
									onBusyChange: r[5] ||= (e) => _e.value = e,
									onStart: r[6] ||= (e) => xe.value = "",
									onError: r[7] ||= (e) => xe.value = P(i)(e)
								}, null, 8, [
									"modelValue",
									"upload",
									"disabled"
								])]),
								_: 1
							}),
							x("div", qt, [C(P(e), {
								label: "前端排序",
								required: ""
							}, {
								default: L(() => [C(P(ne), {
									modelValue: z.sort_order,
									"onUpdate:modelValue": r[8] ||= (e) => z.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: X.value || Se.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(P(e), { label: "启用状态" }, {
								default: L(() => [C(Ht, {
									modelValue: z.is_enabled,
									"onUpdate:modelValue": r[9] ||= (e) => z.is_enabled = e,
									disabled: X.value || Se.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : y("", !0)
				], 8, Wt)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(P(l), {
				modelValue: J.value,
				"onUpdate:modelValue": r[12] ||= (e) => J.value = e,
				title: "删除帮助分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !q.value
			}, {
				footer: L(() => [C(P(t), {
					disabled: q.value,
					onClick: r[11] ||= (e) => J.value = !1
				}, {
					default: L(() => [...r[16] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(t), {
					variant: "danger",
					loading: q.value,
					onClick: Ee
				}, {
					default: L(() => [...r[17] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: L(() => [x("p", null, "确认删除分类“" + N(z.name) + "”？有关联文章或子分类的分类无法删除。", 1), be.value ? (k(), v(P(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: be.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"])
		]));
	}
}), [["__scopeId", "data-v-52a5768d"]]), Xt = ["aria-busy"], Zt = { class: "article-editor__header" }, Qt = { class: "article-editor__heading" }, $t = { class: "article-editor__commands" }, en = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, tn = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, nn = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, rn = {
	key: 1,
	class: "article-editor__failure"
}, an = {
	key: 0,
	class: "article-editor__error"
}, on = { class: "article-editor__body" }, sn = { class: "article-editor__settings" }, cn = { class: "article-editor__related" }, ln = { class: "article-editor__content" }, un = ["aria-invalid", "disabled"], dn = ["aria-invalid", "disabled"], fn = {
	class: "help-delete-dialog__icon",
	"aria-hidden": "true"
}, pn = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(r, { emit: i }) {
		let { helpError: a, helpCategoryLabel: o, deleteHelp: s, getHelpDetail: c, getHelpMetadata: u, getHelpList: d, saveHelp: ee, uploadHelpCover: te } = Bt(), { hasPermission: ae } = ge(), h = r, w = i, T = j(!0), E = j(!1), D = j(!1), O = j(""), le = j(!1), ue = j(!1), M = j(!1), de = j(!1), F = j(ge().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), I = j(), pe = j("draft"), z = j(!1), B = _(() => ae(["cms_help:publish"])), V = _(() => !ae([`cms_help:${h.articleId ? "edit" : "add"}`]) || !B.value && pe.value !== "draft"), H = _(() => ae(["cms_help:delete"]) && (B.value || pe.value === "draft"));
		async function U() {
			if (!(!H.value || E.value || T.value || D.value)) {
				E.value = !0, O.value = "";
				try {
					await s("articles", G.id, G.row_version), ke = JSON.stringify(G), f.success("文章已删除"), w("saved");
				} catch (e) {
					O.value = a(e), de.value = !1;
				} finally {
					E.value = !1;
				}
			}
		}
		let W = _(() => V.value || E.value), G = A({
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
		}), { editorRoot: ve, seoInput: K, fieldRules: ye, fieldErrors: q, pendingCount: J, saveError: be, validateSave: Y, setSaveFailure: xe, focusFirstError: X, focusSeoError: Se } = De(G, () => I.value?.categories || [], "help", le), Z = j(""), Q = j(!1), $ = j([]), Ce = _(() => $.value.filter((e) => e.id !== h.articleId).map((e) => ({
			label: `${e.title} · ${e.code}`,
			value: e.id
		})));
		async function we() {
			if (!(W.value || Q.value)) {
				Q.value = !0;
				try {
					let e = await d("articles", {
						keyword: Z.value,
						page_size: 100
					}, Ae?.signal), t = $.value.filter((e) => G.related_content_ids.includes(e.id));
					$.value = [...new Map([...t, ...e.lists].map((e) => [e.id, e])).values()];
				} catch (e) {
					Ae?.signal.aborted || (O.value = a(e));
				} finally {
					Q.value = !1;
				}
			}
		}
		let Te = _(() => (I.value?.categories || []).filter((e) => e.parent_id != null).map((e) => ({
			label: o(I.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), Ee = _(() => I.value?.categories.find((e) => e.id === G.category_id && e.parent_id == null)), Oe = _({
			get: () => Ee.value ? "" : G.category_id,
			set: (e) => {
				G.category_id = e;
			}
		}), ke = "", Ae;
		function je(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Me() {
			Ae?.abort(), Ae = new AbortController();
			let e = Ae;
			T.value = !0, D.value = !1, O.value = "";
			try {
				if (I.value = await u(e.signal, { cms_source_type: "platform" }), h.articleId) {
					let t = await c("articles", h.articleId, e.signal);
					if (I.value = await u(e.signal, { space_id: String(t.space_id) }), F.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"sort_order",
						"is_enabled"
					]) Object.assign(G, { [e]: t[e] });
					G.category_id = t.category_id || "", G.search_keywords = t.search_keywords || "", G.helpful_enabled = t.helpful_enabled ?? !0, G.related_content_ids = t.related_content_ids || [], $.value = t.related_articles || [];
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url",
						"content_source",
						"author_name"
					]) G[e] = t[e] || "";
					G.scheduled_local = t.publish_status === "scheduled" ? je(t.scheduled_at) : "", pe.value = t.publish_status;
				}
				ke = JSON.stringify(G);
			} catch (t) {
				e.signal.aborted || (O.value = a(t), D.value = !0);
			} finally {
				e.signal.aborted || (T.value = !1);
			}
		}
		let Ne = () => !T.value && !D.value && ke !== JSON.stringify(G);
		function Pe() {
			Ne() ? ue.value = !0 : w("close");
		}
		function Fe() {
			pe.value === "draft" ? Le("draft") : M.value = !0;
		}
		function Ie() {
			M.value = !1, Le("draft");
		}
		async function Le(e) {
			if (W.value || T.value || D.value || z.value || (O.value = "", !await Y(e))) return;
			let t = G.scheduled_local ? new Date(G.scheduled_local) : null;
			E.value = !0, O.value = "";
			try {
				await ee("articles", {
					...G,
					id: G.id || void 0,
					row_version: G.id ? G.row_version : void 0,
					category_id: G.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), ke = JSON.stringify(G), f.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "文章已发布"), w("saved");
			} catch (e) {
				xe(e);
			} finally {
				E.value = !1;
			}
			J.value && await X();
		}
		function Re(e) {
			O.value = a(e);
		}
		let ze = (e) => {
			Ne() && (e.preventDefault(), e.returnValue = "");
		};
		return _e(() => !E.value && !z.value && (!Ne() || window.confirm("文章有未保存的修改，确定离开？"))), ce(() => {
			Me(), window.addEventListener("beforeunload", ze);
		}), se(() => {
			Ae?.abort(), window.removeEventListener("beforeunload", ze);
		}), (i, a) => (k(), b("section", {
			ref_key: "editorRoot",
			ref: ve,
			class: "article-editor",
			"aria-busy": T.value || E.value
		}, [
			x("header", Zt, [
				C(P(t), {
					"icon-only": "",
					title: "返回文章列表",
					"aria-label": "返回文章列表",
					disabled: E.value || z.value,
					onClick: Pe
				}, {
					default: L(() => [C(P(m), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", Qt, [x("h2", null, N(r.articleId ? "编辑文章" : "新增文章"), 1), x("span", null, N(I.value?.source_locale || "zh-CN") + " · " + N(F.value), 1)]),
				x("div", $t, [
					r.articleId && H.value ? (k(), v(P(t), {
						key: 0,
						size: "sm",
						disabled: T.value || D.value || E.value || z.value,
						onClick: a[0] ||= (e) => de.value = !0
					}, {
						default: L(() => [...a[32] ||= [S("删除文章", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(t), {
						size: "sm",
						disabled: T.value || D.value,
						onClick: a[1] ||= (e) => le.value = !0
					}, {
						icon: L(() => [C(P(m), {
							name: "search",
							size: 14
						})]),
						default: L(() => [a[33] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					V.value ? y("", !0) : (k(), v(P(t), {
						key: 1,
						size: "sm",
						disabled: T.value || D.value || E.value || z.value,
						onClick: Fe
					}, {
						icon: L(() => [C(P(m), {
							name: "save",
							size: 14
						})]),
						default: L(() => [a[34] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					P(be) ? (k(), b("span", en, N(P(be)), 1)) : y("", !0),
					!V.value && P(J) ? (k(), b("span", tn, "还有 " + N(P(J)) + " 项待完善", 1)) : y("", !0),
					!V.value && B.value ? (k(), v(P(t), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: T.value || D.value || z.value,
						loading: E.value,
						onClick: a[2] ||= (e) => Le(G.scheduled_local ? "scheduled" : "published")
					}, {
						icon: L(() => [C(P(m), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: L(() => [S(N(G.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)
				])
			]),
			T.value ? (k(), b("div", nn, [C(P(m), {
				name: "loader-circle",
				class: "help-spin",
				size: 28
			}), a[35] ||= x("span", null, "正在读取文章资料...", -1)])) : D.value ? (k(), b("div", rn, [C(P(p), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"]), C(P(t), { onClick: Me }, {
				default: L(() => [...a[36] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (k(), b(g, { key: 2 }, [O.value ? (k(), b("div", an, [C(P(p), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"])])) : y("", !0), x("div", on, [x("aside", sn, [C(P(ie), {
				model: G,
				rules: P(ye),
				"label-position": "top",
				onSubmit: a[16] ||= he(() => {}, ["prevent"])
			}, {
				default: L(() => [
					C(P(e), {
						label: "文章分类",
						prop: "category_id",
						error: P(q).category_id,
						required: ""
					}, {
						default: L(() => [C(P(re), {
							modelValue: Oe.value,
							"onUpdate:modelValue": a[3] ||= (e) => Oe.value = e,
							options: Te.value,
							placeholder: Ee.value ? "原分类：" + Ee.value.name + "（请选择二级分类）" : "请选择二级分类",
							clearable: "",
							disabled: W.value,
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
					C(P(e), {
						label: "文章封面",
						prop: "cover_url",
						error: P(q).cover_url
					}, {
						default: L(() => [C(Ue, {
							modelValue: G.cover_url,
							"onUpdate:modelValue": a[4] ||= (e) => G.cover_url = e,
							label: "文章封面",
							disabled: W.value,
							upload: P(te),
							onBusyChange: a[5] ||= (e) => z.value = e,
							onStart: a[6] ||= (e) => O.value = "",
							onError: Re
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "内容来源",
						prop: "content_source",
						error: P(q).content_source
					}, {
						default: L(() => [C(P(oe), {
							modelValue: G.content_source,
							"onUpdate:modelValue": a[7] ||= (e) => G.content_source = e,
							maxlength: 160,
							disabled: W.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "作者署名",
						prop: "author_name",
						error: P(q).author_name
					}, {
						default: L(() => [C(P(oe), {
							modelValue: G.author_name,
							"onUpdate:modelValue": a[8] ||= (e) => G.author_name = e,
							maxlength: 120,
							disabled: W.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "前端排序",
						prop: "sort_order",
						error: P(q).sort_order
					}, {
						default: L(() => [C(P(ne), {
							modelValue: G.sort_order,
							"onUpdate:modelValue": a[9] ||= (e) => G.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: W.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[40] ||= x("h3", null, "发布设置", -1),
					C(P(e), {
						label: "搜索关键词",
						prop: "search_keywords",
						error: P(q).search_keywords
					}, {
						default: L(() => [C(P(oe), {
							modelValue: G.search_keywords,
							"onUpdate:modelValue": a[10] ||= (e) => G.search_keywords = e,
							maxlength: 2e3,
							disabled: W.value,
							placeholder: "使用空格或逗号分隔",
							"aria-label": "搜索关键词"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: P(q).helpful_enabled
					}, {
						default: L(() => [C(Ht, {
							modelValue: G.helpful_enabled,
							"onUpdate:modelValue": a[11] ||= (e) => G.helpful_enabled = e,
							disabled: W.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "相关文章",
						prop: "related_content_ids",
						error: P(q).related_content_ids
					}, {
						default: L(() => [x("div", cn, [
							C(P(oe), {
								modelValue: Z.value,
								"onUpdate:modelValue": a[12] ||= (e) => Z.value = e,
								disabled: W.value,
								placeholder: "搜索文章标题",
								"aria-label": "搜索相关文章",
								onKeydown: R(he(we, ["prevent"]), ["enter"])
							}, null, 8, [
								"modelValue",
								"disabled",
								"onKeydown"
							]),
							C(P(t), {
								size: "sm",
								disabled: W.value,
								loading: Q.value,
								onClick: we
							}, {
								default: L(() => [...a[37] ||= [S("查找文章", -1)]]),
								_: 1
							}, 8, ["disabled", "loading"]),
							C(P(re), {
								modelValue: G.related_content_ids,
								"onUpdate:modelValue": a[13] ||= (e) => G.related_content_ids = e,
								options: Ce.value,
								multiple: "",
								clearable: "",
								disabled: W.value,
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
					C(P(e), {
						label: "启用状态",
						prop: "is_enabled",
						error: P(q).is_enabled
					}, {
						default: L(() => [C(Ht, {
							modelValue: G.is_enabled,
							"onUpdate:modelValue": a[14] ||= (e) => G.is_enabled = e,
							disabled: W.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: P(q).scheduled_local
					}, {
						default: L(() => [C(P(oe), {
							modelValue: G.scheduled_local,
							"onUpdate:modelValue": a[15] ||= (e) => G.scheduled_local = e,
							type: "datetime-local",
							disabled: W.value || !B.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[41] ||= x("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", ln, [C(P(ie), {
				model: G,
				rules: P(ye),
				"label-position": "top",
				onSubmit: a[20] ||= he(() => {}, ["prevent"])
			}, {
				default: L(() => [
					C(P(e), {
						label: "标题",
						prop: "title",
						error: P(q).title,
						required: ""
					}, {
						default: L(() => [C(P(oe), {
							modelValue: G.title,
							"onUpdate:modelValue": a[17] ||= (e) => G.title = e,
							maxlength: 255,
							disabled: W.value,
							placeholder: "输入文章标题",
							"aria-label": "文章标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "摘要",
						prop: "summary",
						error: P(q).summary
					}, {
						default: L(() => [me(x("textarea", {
							"onUpdate:modelValue": a[18] ||= (e) => G.summary = e,
							"aria-invalid": !!P(q).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: W.value,
							"aria-label": "文章摘要"
						}, null, 8, un), [[fe, G.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "正文",
						prop: "body_html",
						error: P(q).body_html
					}, {
						default: L(() => [C(P(n), {
							modelValue: G.body_html,
							"onUpdate:modelValue": a[19] ||= (e) => G.body_html = e,
							readonly: V.value,
							disabled: E.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "文章正文"
						}, {
							"image-upload": L(({ url: e, setUrl: t, setBusy: n }) => [C(Ue, {
								label: "正文图片",
								"model-value": e,
								upload: P(te),
								"onUpdate:modelValue": t,
								onBusyChange: n,
								onError: Re
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
			C(P(l), {
				modelValue: le.value,
				"onUpdate:modelValue": a[24] ||= (e) => le.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: L(() => [C(P(t), {
					variant: "primary",
					onClick: a[23] ||= (e) => le.value = !1
				}, {
					default: L(() => [...a[42] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: L(() => [C(P(ie), {
					model: G,
					rules: P(ye),
					"label-position": "top",
					onSubmit: a[22] ||= he(() => {}, ["prevent"])
				}, {
					default: L(() => [C(P(e), {
						label: "SEO 描述",
						prop: "seo_description",
						error: P(q).seo_description
					}, {
						default: L(() => [me(x("textarea", {
							ref_key: "seoInput",
							ref: K,
							"onUpdate:modelValue": a[21] ||= (e) => G.seo_description = e,
							"aria-invalid": !!P(q).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: W.value,
							"aria-label": "SEO 描述"
						}, null, 8, dn), [[fe, G.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(l), {
				modelValue: de.value,
				"onUpdate:modelValue": a[26] ||= (e) => de.value = e,
				title: "确认删除",
				subtitle: `操作对象：${G.title || "未命名文章"}`,
				width: "460px",
				"panel-class": "help-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !E.value
			}, {
				"header-actions": L(() => [x("span", fn, [C(P(m), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: L(() => [C(P(t), {
					disabled: E.value,
					onClick: a[25] ||= (e) => de.value = !1
				}, {
					default: L(() => [...a[43] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(t), {
					variant: "warning",
					loading: E.value,
					onClick: U
				}, {
					default: L(() => [...a[44] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: L(() => [C(P(p), {
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
			C(P(l), {
				modelValue: ue.value,
				"onUpdate:modelValue": a[29] ||= (e) => ue.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: L(() => [C(P(t), { onClick: a[27] ||= (e) => ue.value = !1 }, {
					default: L(() => [...a[45] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(t), {
					variant: "primary",
					onClick: a[28] ||= (e) => w("close")
				}, {
					default: L(() => [...a[46] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(l), {
				modelValue: M.value,
				"onUpdate:modelValue": a[31] ||= (e) => M.value = e,
				title: "将文章转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: L(() => [C(P(t), { onClick: a[30] ||= (e) => M.value = !1 }, {
					default: L(() => [...a[47] ||= [S("取消", -1)]]),
					_: 1
				}), C(P(t), {
					variant: "primary",
					onClick: Ie
				}, {
					default: L(() => [...a[48] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Xt));
	}
}), [["__scopeId", "data-v-438b969d"]]), mn = { class: "help-articles" }, hn = {
	key: 0,
	class: "help-statistics-note"
}, gn = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let n = ge(), { helpPublishStates: i, helpCategoryLabel: a, getHelpList: o, getHelpMetadata: c } = Bt(), { hasPermission: l } = ge(), { formatDateTime: u } = ge(), f = j(!1), ee = j(), te = (e) => l([`cms_help:${e}`]), p = j(), ne = K(c, (e) => {
			p.value = e;
		}), re = [
			...ve(),
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
				formatter: (e) => a(p.value, e)
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
		], ie = _(() => [
			...ne.fields,
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
				}, ...(p.value?.categories || []).map((e) => ({
					label: a(p.value, e.id),
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
		]), { proTableBindings: ae, reload: oe } = ne.bindTable(r({
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
		})), h = ne.loadMetadata;
		function g(e) {
			ee.value = e, f.value = !0;
		}
		function x() {
			f.value = !1, oe(), h();
		}
		return (e, r) => (k(), b("div", mn, [
			!f.value && P(n).mode === "platform" ? (k(), b("p", hn, " 当前管理平台默认模板。浏览量、评价数及有帮助率属于站点运行数据，此处显示“—”，不汇总白标站点。 ")) : y("", !0),
			f.value ? (k(), v(pn, {
				key: 1,
				"article-id": ee.value,
				onClose: r[0] ||= (e) => f.value = !1,
				onSaved: x
			}, null, 8, ["article-id"])) : y("", !0),
			me(C(P(s), E(P(ae), {
				"auto-refreshable": !1,
				columns: re,
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
				"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": L(() => [te("add") ? (k(), v(P(t), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[1] ||= (e) => g()
				}, {
					icon: L(() => [C(P(m), {
						name: "plus",
						size: 14
					})]),
					default: L(() => [r[2] ||= S("新增文章", -1)]),
					_: 1
				})) : y("", !0)]),
				"cell-publish_status": L(({ row: e }) => [C(P(d), {
					size: "sm",
					effect: "soft",
					type: e.publish_status === "published" ? "success" : "warning"
				}, {
					default: L(() => [S(N(P(i).find((t) => t.value === e.publish_status)?.label), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-is_enabled": L(({ row: e }) => [C(P(d), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: L(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-publish_time": L(({ row: e }) => [S(N(P(u)(e.published_at || e.scheduled_at)), 1)]),
				"cell-actions": L(({ row: e }) => [C(P(t), {
					size: "sm",
					"icon-only": "",
					title: te("edit") ? "编辑文章" : "文章详情",
					"aria-label": te("edit") ? "编辑文章" : "文章详情",
					onClick: (t) => g(e.id)
				}, {
					default: L(() => [C(P(m), {
						name: te("edit") ? "square-pen" : "panel-right-open",
						size: 15
					}, null, 8, ["name"])]),
					_: 1
				}, 8, [
					"title",
					"aria-label",
					"onClick"
				])]),
				_: 1
			}, 16), [[I, !f.value]])
		]));
	}
}), [["__scopeId", "data-v-9671264b"]]);
//#endregion
//#region src/cms/api/content/feedback.ts
function _n() {
	let e = ge().request, t = "/cms/feedback", n = (n, r) => e.get({
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
var vn = { class: "feedback-page" }, yn = ["aria-busy"], bn = {
	key: 0,
	role: "status"
}, xn = { class: "feedback-info" }, Sn = { class: "feedback-content" }, Cn = {
	key: 0,
	class: "muted"
}, wn = { class: "attachment-title" }, Tn = ["src", "alt"], En = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { getFeedbackList: n, getFeedbackMetadata: i, getFeedbackDetail: a, getFeedbackAttachment: o, feedbackSourceTypes: c, feedbackSourceLabel: u, feedbackError: f } = _n(), { formatDateTime: ee } = ge(), te = j({
			scenes: [],
			issues: []
		}), ne = K(i, (e) => {
			te.value = e;
		}), re = [
			...ve(),
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
				formatter: ee
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				fixed: "right",
				align: "center",
				hideable: !1
			}
		], ie = _(() => [
			...ne.fields,
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
				}, ...c]
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
		]), { proTableBindings: ae } = ne.bindTable(r({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: ie,
			request: async ({ filters: e, page: t, pageSize: r, signal: i }) => {
				let a = Object.fromEntries(Object.entries(e).filter(([e, t]) => e !== "submitted_range" && t !== "" && t != null)), o = e.submitted_range;
				Array.isArray(o) && o.length === 2 && (a.submitted_from = (/* @__PURE__ */ new Date(`${o[0]}T00:00:00`)).toISOString(), a.submitted_to = (/* @__PURE__ */ new Date(`${o[1]}T23:59:59.999`)).toISOString());
				let s = await n({
					...a,
					page_no: t,
					page_size: r
				}, i);
				return {
					rows: s.lists,
					total: s.count
				};
			}
		})), oe = j(!1), h = j(!1), w = j(""), T = j(), D = j({}), O = j(""), ce;
		async function le(e) {
			ce?.abort();
			let t = new AbortController();
			ce = t, T.value = void 0, D.value = {}, w.value = "", O.value = "", oe.value = !0, h.value = !0;
			try {
				let n = await a(e, t.signal);
				t.signal.aborted || (T.value = n);
			} catch (e) {
				t.signal.aborted || (w.value = f(e));
			} finally {
				t.signal.aborted || (h.value = !1);
			}
		}
		async function A(e) {
			let t = ce, n = T.value?.id;
			if (!(!t || !n || O.value)) {
				O.value = e, w.value = "";
				try {
					let r = await o(n, e, t.signal);
					!t.signal.aborted && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(r.data_url) && (D.value[e] = r.data_url);
				} catch (e) {
					t.signal.aborted || (w.value = f(e));
				} finally {
					t.signal.aborted || (O.value = "");
				}
			}
		}
		return pe(oe, (e) => {
			e || (ce?.abort(), T.value = void 0, D.value = {}, w.value = "");
		}), se(() => {
			ce?.abort();
		}), (e, n) => (k(), b("div", vn, [C(P(s), E(P(ae), {
			"auto-refreshable": !1,
			columns: re,
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
			"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"cell-source_type": L(({ row: e }) => [C(P(d), {
				size: "sm",
				effect: "soft",
				type: e.source_type === "merchant" ? "warning" : e.source_type === "platform" ? "success" : "primary"
			}, {
				default: L(() => [S(N(P(u)(e.source_type)), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-actions": L(({ row: e }) => [C(P(t), {
				size: "sm",
				"icon-only": "",
				title: "查看反馈",
				"aria-label": "查看反馈",
				onClick: (t) => le(e.id)
			}, {
				default: L(() => [C(P(m), {
					name: "eye",
					size: 15
				})]),
				_: 1
			}, 8, ["onClick"])]),
			_: 1
		}, 16), C(P(l), {
			modelValue: oe.value,
			"onUpdate:modelValue": n[1] ||= (e) => oe.value = e,
			title: "反馈详情",
			subtitle: T.value?.code || "查看用户正式提交的意见反馈",
			width: "760px",
			"close-on-click-modal": !1
		}, {
			footer: L(() => [C(P(t), { onClick: n[0] ||= (e) => oe.value = !1 }, {
				default: L(() => [...n[14] ||= [S("关闭", -1)]]),
				_: 1
			})]),
			default: L(() => [x("div", {
				class: "feedback-detail",
				"aria-busy": h.value
			}, [
				h.value ? (k(), b("p", bn, "正在读取反馈…")) : y("", !0),
				w.value ? (k(), v(P(p), {
					key: 1,
					type: "error",
					closable: !1,
					description: w.value
				}, null, 8, ["description"])) : y("", !0),
				T.value && !h.value ? (k(), b(g, { key: 2 }, [
					x("dl", xn, [
						x("div", null, [n[2] ||= x("dt", null, "UID", -1), x("dd", null, N(T.value.public_user_id_snapshot), 1)]),
						x("div", null, [n[3] ||= x("dt", null, "用户账号", -1), x("dd", null, N(T.value.username_snapshot || "—"), 1)]),
						x("div", null, [n[4] ||= x("dt", null, "来源类型", -1), x("dd", null, N(P(u)(T.value.source_type)), 1)]),
						x("div", null, [n[5] ||= x("dt", null, "来源名称", -1), x("dd", null, N(T.value.source_name_snapshot || "—"), 1)]),
						x("div", null, [n[6] ||= x("dt", null, "业务场景", -1), x("dd", null, N(T.value.scene_name_snapshot), 1)]),
						x("div", null, [n[7] ||= x("dt", null, "问题分类", -1), x("dd", null, N(T.value.issue_category_name_snapshot), 1)]),
						x("div", null, [n[8] ||= x("dt", null, "联系方式（脱敏）", -1), x("dd", null, N(T.value.contact_display), 1)]),
						x("div", null, [n[9] ||= x("dt", null, "提交时间", -1), x("dd", null, N(P(ee)(T.value.submitted_at)), 1)])
					]),
					x("section", null, [n[10] ||= x("h3", null, "反馈内容", -1), x("div", Sn, N(T.value.content), 1)]),
					x("section", null, [
						x("h3", null, [n[11] ||= S(" 附件 ", -1), x("span", null, N(T.value.attachments?.length || 0), 1)]),
						T.value.attachments?.length ? y("", !0) : (k(), b("p", Cn, "暂无附件")),
						(k(!0), b(g, null, ue(T.value.attachments, (e) => (k(), b("div", {
							key: e.id,
							class: "feedback-attachment"
						}, [x("div", wn, [x("span", null, N(e.original_name || "图片附件") + " · " + N(Math.ceil(e.byte_size / 1024)) + " KB", 1), C(P(t), {
							size: "sm",
							loading: O.value === e.id,
							onClick: (t) => A(e.id)
						}, {
							default: L(() => [...n[12] ||= [S("查看图片", -1)]]),
							_: 1
						}, 8, ["loading", "onClick"])]), D.value[e.id] ? (k(), b("img", {
							key: 0,
							src: D.value[e.id],
							alt: e.original_name || "反馈图片"
						}, null, 8, Tn)) : y("", !0)]))), 128))
					]),
					n[13] ||= x("p", { class: "muted" }, "来源和分类为提交时快照；此页面仅查看，不修改用户原始反馈。", -1)
				], 64)) : y("", !0)
			], 8, yn)]),
			_: 1
		}, 8, ["modelValue", "subtitle"])]));
	}
}), [["__scopeId", "data-v-5420cdfa"]]);
//#endregion
//#region src/cms/api/content/announcement.ts
function Dn() {
	let e = ge().request, t = "/cms/announcement", n = (n, r = {}) => e.get({
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
	}, { isOpenRetry: !1 }), s = c(e, "/cms/announcement/upload"), l = c(e, "/cms/announcement/categories/upload"), u = [
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
	function d(e, t) {
		let n = e?.categories.find((e) => e.id === String(t));
		if (!n) return "—";
		let r = e?.categories.find((e) => e.id === n.parent_id);
		return r ? `${r.name} / ${n.name}` : n.name;
	}
	function f(e) {
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
		uploadAnnouncementCategoryImage: l,
		announcementPublishStates: u,
		announcementCategoryLabel: d,
		announcementError: f
	};
}
//#endregion
//#region src/cms/views/content/announcement/categories/index.vue?vue&type=script&setup=true&lang.ts
var On = { class: "announcement-categories" }, kn = ["aria-busy"], An = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, jn = { class: "taxonomy-editor__field" }, Mn = { class: "taxonomy-editor__row" }, Nn = "分类", Pn = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(n) {
		let { hasPermission: i } = ge(), { formatDateTime: a } = ge(), { announcementError: o, deleteAnnouncement: c, getAnnouncementMetadata: u, getAnnouncementList: ee, getAnnouncementDetail: te, saveAnnouncement: ae, uploadAnnouncementCategoryImage: h } = Dn(), g = (e) => i([`cms_announcement_category:${e}`]), w = j(), T = j(), D = K(u, (e) => {
			w.value = e;
		}), O = [
			{
				key: "name",
				dataIndex: "name",
				title: "分类名称",
				width: 210,
				hideable: !1
			},
			...ve(),
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
				formatter: a
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], ce = [
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
		], { proTableBindings: le, rows: ue, reload: M } = D.bindTable(r({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: ce,
			request: async ({ filters: e, signal: t, reason: n }) => {
				let r = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), i = await W((e, n) => ee("categories", {
					...r,
					page_no: e,
					page_size: n
				}, t), t);
				return !t.aborted && (n === "query" || n === "reset") && (F.value = Object.keys(r).length ? new Set(i.rows.filter((e) => e.parent_id != null).map((e) => String(e.parent_id))) : /* @__PURE__ */ new Set()), i;
			}
		})), { visibleRows: de, expanded: F, groups: fe, allExpanded: I, toggle: pe, toggleAll: me } = G(ue), R = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			image_url: "",
			image_media_id: null,
			sort_order: 10,
			is_enabled: !0
		}), z = A(R()), _e = j(!1), B = j(!1), V = j(!1), H = j(!1), q = j(!1), J = j(""), Y = j(!1), xe = j(""), X = j(!1), Se = _(() => !g(z.id ? "edit" : "add")), Z = j(!1), Q = _(() => V.value || H.value || Z.value), $ = "", Ce;
		async function we(e) {
			Ce?.abort(), Ce = new AbortController();
			let t = Ce;
			Object.assign(z, R(), { id: e || "" }), xe.value = "", q.value = !1, J.value = "", Y.value = !1, _e.value = !0, B.value = !0, $ = JSON.stringify(z);
			try {
				if (T.value = await u(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await te("categories", e, t.signal);
				if (T.value = await u(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(z, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					image_url: n.image_url || "",
					image_media_id: n.image_media_id || null,
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), $ = JSON.stringify(z);
			} catch (e) {
				t.signal.aborted || (Y.value = !0, xe.value = o(e));
			} finally {
				t.signal.aborted || (B.value = !1);
			}
		}
		function Te() {
			return Q.value ? !1 : !B.value && !Y.value && JSON.stringify(z) !== $ ? (X.value = !0, !1) : (Ce?.abort(), !0);
		}
		function Ee() {
			Te() && (_e.value = !1);
		}
		function De() {
			Ce?.abort(), X.value = !1, _e.value = !1;
		}
		async function Oe() {
			if (!(Se.value || Q.value || B.value || Y.value)) {
				if (!z.name.trim() || z.sort_order === null) {
					xe.value = "请填写分类名称和排序";
					return;
				}
				V.value = !0, xe.value = "";
				try {
					await ae("categories", {
						name: z.name,
						parent_id: z.parent_id || null,
						image_media_id: z.image_media_id,
						sort_order: z.sort_order,
						is_enabled: z.is_enabled,
						id: z.id || void 0,
						row_version: z.id ? z.row_version : void 0
					}), _e.value = !1, f.success("保存成功"), await Promise.all([M(), Me()]);
				} catch (e) {
					xe.value = o(e);
				} finally {
					V.value = !1;
				}
			}
		}
		function ke() {
			!z.id || !g("delete") || Q.value || B.value || Y.value || (J.value = "", q.value = !0);
		}
		async function Ae() {
			if (!(!q.value || !z.id || !g("delete") || Q.value || B.value || Y.value)) {
				H.value = !0, J.value = "";
				try {
					await c("categories", z.id, z.row_version), q.value = !1, _e.value = !1, f.success("分类已删除"), await Promise.all([M(), Me()]);
				} catch (e) {
					J.value = o(e);
				} finally {
					H.value = !1;
				}
			}
		}
		let je = _(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(T.value?.categories || []).filter((e) => !e.parent_id && e.id !== z.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Me = D.loadMetadata;
		return se(() => {
			Ce?.abort();
		}), (n, r) => (k(), b("div", On, [
			C(P(s), E(P(le), {
				"auto-refreshable": !1,
				columns: O,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Nn}管理`,
				data: P(de),
				"show-pagination": !1
			}), {
				"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": L(() => [g("add") ? (k(), v(P(t), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => we()
				}, {
					icon: L(() => [C(P(m), {
						name: "plus",
						size: 14
					})]),
					default: L(() => [S("新增" + N(Nn))]),
					_: 1
				})) : y("", !0), C(P(t), {
					size: "sm",
					disabled: !P(fe).children.size,
					onClick: P(me)
				}, {
					icon: L(() => [C(P(m), {
						name: P(I) ? "chevron-up" : "chevron-down",
						size: 14
					}, null, 8, ["name"])]),
					default: L(() => [S(" " + N(P(I) ? "全部收起" : "全部展开"), 1)]),
					_: 1
				}, 8, ["disabled", "onClick"])]),
				"cell-name": L(({ row: e }) => [C(U, {
					name: e.name,
					child: e.parent_id != null,
					branch: P(fe).children.has(e.id),
					expanded: P(F).has(e.id),
					onToggle: (t) => P(pe)(e.id)
				}, null, 8, [
					"name",
					"child",
					"branch",
					"expanded",
					"onToggle"
				])]),
				"cell-is_enabled": L(({ row: e }) => [C(P(d), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: L(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": L(({ row: e }) => [C(P(t), {
					size: "sm",
					"icon-only": "",
					title: g("edit") ? `编辑${Nn}` : `${Nn}详情`,
					"aria-label": g("edit") ? `编辑${Nn}` : `${Nn}详情`,
					onClick: (t) => we(e.id)
				}, {
					default: L(() => [C(P(m), {
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
			C(P(l), {
				modelValue: _e.value,
				"onUpdate:modelValue": r[10] ||= (e) => _e.value = e,
				title: `${z.id ? "编辑" : "新增"}公告${Nn}`,
				width: "680px",
				subtitle: "公告分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Te
			}, {
				footer: L(() => [
					z.id && g("delete") ? (k(), v(P(t), {
						key: 0,
						variant: "danger",
						disabled: B.value || Y.value || Q.value,
						onClick: ke
					}, {
						icon: L(() => [C(P(m), {
							name: "trash-2",
							size: 14
						})]),
						default: L(() => [r[16] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(t), {
						disabled: Q.value,
						onClick: Ee
					}, {
						default: L(() => [...r[17] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Se.value ? y("", !0) : (k(), v(P(t), {
						key: 1,
						variant: "primary",
						loading: V.value,
						disabled: B.value || Y.value || H.value || Z.value,
						onClick: Oe
					}, {
						default: L(() => [S("保存" + N(Nn))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: L(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": B.value
				}, [
					B.value ? (k(), b("div", An, [C(P(m), {
						name: "loader-circle",
						class: "announcement-spin",
						size: 24
					}), x("span", null, "正在读取" + N(Nn) + "...")])) : y("", !0),
					xe.value ? (k(), v(P(p), {
						key: 1,
						type: "error",
						closable: !1,
						description: xe.value
					}, null, 8, ["description"])) : y("", !0),
					!B.value && !Y.value ? (k(), v(P(ie), {
						key: 2,
						model: z,
						"label-position": "top",
						onSubmit: he(Oe, ["prevent"])
					}, {
						default: L(() => [
							z.id ? (k(), v(P(e), {
								key: 0,
								label: "分类ID"
							}, {
								default: L(() => [C(P(oe), {
									"model-value": z.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : y("", !0),
							C(P(e), {
								label: `${Nn}名称`,
								required: ""
							}, {
								default: L(() => [C(P(oe), {
									modelValue: z.name,
									"onUpdate:modelValue": r[1] ||= (e) => z.name = e,
									maxlength: 120,
									disabled: Se.value || Q.value,
									"aria-label": `${Nn}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							C(P(e), { label: "父分类" }, {
								default: L(() => [x("div", jn, [C(P(re), {
									modelValue: z.parent_id,
									"onUpdate:modelValue": r[2] ||= (e) => z.parent_id = e,
									options: je.value,
									disabled: Se.value || Q.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), r[15] ||= x("p", { class: "announcement-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类公告。 ", -1)])]),
								_: 1
							}),
							C(P(e), { label: "分类图片" }, {
								default: L(() => [C(Ue, {
									class: "taxonomy-editor__image",
									modelValue: z.image_url,
									"onUpdate:modelValue": r[3] ||= (e) => z.image_url = e,
									label: "分类图片",
									upload: P(h),
									disabled: Se.value || Q.value,
									"onUpdate:mediaId": r[4] ||= (e) => z.image_media_id = e,
									onBusyChange: r[5] ||= (e) => Z.value = e,
									onStart: r[6] ||= (e) => xe.value = "",
									onError: r[7] ||= (e) => xe.value = P(o)(e)
								}, null, 8, [
									"modelValue",
									"upload",
									"disabled"
								])]),
								_: 1
							}),
							x("div", Mn, [C(P(e), {
								label: "前端排序",
								required: ""
							}, {
								default: L(() => [C(P(ne), {
									modelValue: z.sort_order,
									"onUpdate:modelValue": r[8] ||= (e) => z.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Se.value || Q.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(P(e), { label: "启用状态" }, {
								default: L(() => [C(be, {
									modelValue: z.is_enabled,
									"onUpdate:modelValue": r[9] ||= (e) => z.is_enabled = e,
									disabled: Se.value || Q.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : y("", !0)
				], 8, kn)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(P(l), {
				modelValue: q.value,
				"onUpdate:modelValue": r[12] ||= (e) => q.value = e,
				title: "删除公告分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !H.value
			}, {
				footer: L(() => [C(P(t), {
					disabled: H.value,
					onClick: r[11] ||= (e) => q.value = !1
				}, {
					default: L(() => [...r[18] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(t), {
					variant: "danger",
					loading: H.value,
					onClick: Ae
				}, {
					default: L(() => [...r[19] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: L(() => [x("p", null, "确认删除分类“" + N(z.name) + "”？有关联公告或子分类的分类无法删除。", 1), J.value ? (k(), v(P(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: J.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(P(l), {
				modelValue: X.value,
				"onUpdate:modelValue": r[14] ||= (e) => X.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: L(() => [C(P(t), { onClick: r[13] ||= (e) => X.value = !1 }, {
					default: L(() => [...r[20] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(t), {
					variant: "primary",
					onClick: De
				}, {
					default: L(() => [...r[21] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-99f0ce2d"]]), Fn = ["aria-busy"], In = { class: "article-editor__header" }, Ln = { class: "article-editor__heading" }, Rn = { class: "article-editor__commands" }, zn = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, Bn = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Vn = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, Hn = {
	key: 1,
	class: "article-editor__failure"
}, Un = {
	key: 0,
	class: "article-editor__error"
}, Wn = { class: "article-editor__body" }, Gn = { class: "article-editor__settings" }, Kn = { class: "article-editor__content" }, qn = ["aria-invalid", "disabled"], Jn = ["aria-invalid", "disabled"], Yn = {
	class: "announcement-delete-dialog__icon",
	"aria-hidden": "true"
}, Xn = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(r, { emit: i }) {
		let { hasPermission: a } = ge(), { announcementError: o, announcementCategoryLabel: s, deleteAnnouncement: c, getAnnouncementDetail: u, getAnnouncementMetadata: d, saveAnnouncement: ee, uploadAnnouncementCover: te } = Dn(), ae = r, h = i, w = j(!0), T = j(!1), E = j(!1), D = j(""), O = j(!1), le = j(!1), ue = j(!1), M = j(!1), de = j(ge().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), F = j(), I = j("draft"), pe = j(!1), R = _(() => a(["cms_announcement:publish"])), z = _(() => !a([`cms_announcement:${ae.articleId ? "edit" : "add"}`]) || !R.value && I.value !== "draft"), B = _(() => a(["cms_announcement:delete"]) && (R.value || I.value === "draft"));
		async function V() {
			if (!(!B.value || T.value || w.value || E.value)) {
				T.value = !0, D.value = "";
				try {
					await c("articles", U.id, U.row_version), Q = JSON.stringify(U), f.success("公告已删除"), h("saved");
				} catch (e) {
					D.value = o(e), M.value = !1;
				} finally {
					T.value = !1;
				}
			}
		}
		let H = _(() => z.value || T.value), U = A({
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
		}), { editorRoot: W, seoInput: G, fieldRules: ve, fieldErrors: K, pendingCount: ye, saveError: q, validateSave: J, setSaveFailure: be, focusFirstError: Y, focusSeoError: xe } = De(U, () => F.value?.categories || [], "announcement", O), X = _(() => (F.value?.categories || []).filter((e) => e.parent_id != null).map((e) => ({
			label: s(F.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), Se = _(() => F.value?.categories.find((e) => e.id === U.category_id && e.parent_id == null)), Z = _({
			get: () => Se.value ? "" : U.category_id,
			set: (e) => {
				U.category_id = e;
			}
		}), Q = "", $;
		function Ce(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function we() {
			$?.abort(), $ = new AbortController();
			let e = $;
			w.value = !0, E.value = !1, D.value = "";
			try {
				if (F.value = await d(e.signal, { cms_source_type: "platform" }), ae.articleId) {
					let t = await u("articles", ae.articleId, e.signal);
					if (F.value = await d(e.signal, { space_id: String(t.space_id) }), de.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"sort_order",
						"is_enabled"
					]) Object.assign(U, { [e]: t[e] });
					U.category_id = t.category_id || "", U.helpful_enabled = t.helpful_enabled ?? !0;
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url",
						"content_source",
						"author_name"
					]) U[e] = t[e] || "";
					U.scheduled_local = t.publish_status === "scheduled" ? Ce(t.scheduled_at) : "", I.value = t.publish_status;
				}
				Q = JSON.stringify(U);
			} catch (t) {
				e.signal.aborted || (D.value = o(t), E.value = !0);
			} finally {
				e.signal.aborted || (w.value = !1);
			}
		}
		let Te = () => !w.value && !E.value && Q !== JSON.stringify(U);
		function Ee() {
			Te() ? le.value = !0 : h("close");
		}
		function Oe() {
			I.value === "draft" ? Ae("draft") : ue.value = !0;
		}
		function ke() {
			ue.value = !1, Ae("draft");
		}
		async function Ae(e) {
			if (H.value || w.value || E.value || pe.value || (D.value = "", !await J(e))) return;
			let t = U.scheduled_local ? new Date(U.scheduled_local) : null;
			T.value = !0, D.value = "";
			try {
				await ee("articles", {
					...U,
					id: U.id || void 0,
					row_version: U.id ? U.row_version : void 0,
					category_id: U.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), Q = JSON.stringify(U), f.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "公告已发布"), h("saved");
			} catch (e) {
				be(e);
			} finally {
				T.value = !1;
			}
			ye.value && await Y();
		}
		function je(e) {
			D.value = o(e);
		}
		let Me = (e) => {
			Te() && (e.preventDefault(), e.returnValue = "");
		};
		return _e(() => !T.value && !pe.value && (!Te() || window.confirm("公告有未保存的修改，确定离开？"))), ce(() => {
			we(), window.addEventListener("beforeunload", Me);
		}), se(() => {
			$?.abort(), window.removeEventListener("beforeunload", Me);
		}), (i, a) => (k(), b("section", {
			ref_key: "editorRoot",
			ref: W,
			class: "article-editor",
			"aria-busy": w.value || T.value
		}, [
			x("header", In, [
				C(P(t), {
					"icon-only": "",
					title: "返回公告列表",
					"aria-label": "返回公告列表",
					disabled: T.value || pe.value,
					onClick: Ee
				}, {
					default: L(() => [C(P(m), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", Ln, [x("h2", null, N(r.articleId ? "编辑公告" : "新增公告"), 1), x("span", null, N(F.value?.source_locale || "zh-CN") + " · " + N(de.value), 1)]),
				x("div", Rn, [
					r.articleId && B.value ? (k(), v(P(t), {
						key: 0,
						size: "sm",
						disabled: w.value || E.value || T.value || pe.value,
						onClick: a[0] ||= (e) => M.value = !0
					}, {
						default: L(() => [...a[29] ||= [S("删除公告", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(t), {
						size: "sm",
						disabled: w.value || E.value,
						onClick: a[1] ||= (e) => O.value = !0
					}, {
						icon: L(() => [C(P(m), {
							name: "search",
							size: 14
						})]),
						default: L(() => [a[30] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					z.value ? y("", !0) : (k(), v(P(t), {
						key: 1,
						size: "sm",
						disabled: w.value || E.value || T.value || pe.value,
						onClick: Oe
					}, {
						icon: L(() => [C(P(m), {
							name: "save",
							size: 14
						})]),
						default: L(() => [a[31] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					P(q) ? (k(), b("span", zn, N(P(q)), 1)) : y("", !0),
					!z.value && P(ye) ? (k(), b("span", Bn, "还有 " + N(P(ye)) + " 项待完善", 1)) : y("", !0),
					!z.value && R.value ? (k(), v(P(t), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: w.value || E.value || pe.value,
						loading: T.value,
						onClick: a[2] ||= (e) => Ae(U.scheduled_local ? "scheduled" : "published")
					}, {
						icon: L(() => [C(P(m), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: L(() => [S(N(U.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)
				])
			]),
			w.value ? (k(), b("div", Vn, [C(P(m), {
				name: "loader-circle",
				class: "announcement-spin",
				size: 28
			}), a[32] ||= x("span", null, "正在读取公告资料...", -1)])) : E.value ? (k(), b("div", Hn, [C(P(p), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"]), C(P(t), { onClick: we }, {
				default: L(() => [...a[33] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (k(), b(g, { key: 2 }, [D.value ? (k(), b("div", Un, [C(P(p), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"])])) : y("", !0), x("div", Wn, [x("aside", Gn, [C(P(ie), {
				model: U,
				rules: P(ve),
				"label-position": "top",
				onSubmit: a[13] ||= he(() => {}, ["prevent"])
			}, {
				default: L(() => [
					C(P(e), {
						label: "公告分类",
						prop: "category_id",
						error: P(K).category_id,
						required: ""
					}, {
						default: L(() => [C(P(re), {
							modelValue: Z.value,
							"onUpdate:modelValue": a[3] ||= (e) => Z.value = e,
							options: X.value,
							placeholder: Se.value ? "原分类：" + Se.value.name + "（一级）" : "请选择二级分类",
							clearable: "",
							disabled: H.value,
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
					C(P(e), {
						label: "公告封面",
						prop: "cover_url",
						error: P(K).cover_url
					}, {
						default: L(() => [C(Ue, {
							modelValue: U.cover_url,
							"onUpdate:modelValue": a[4] ||= (e) => U.cover_url = e,
							label: "公告封面",
							disabled: H.value,
							upload: P(te),
							onBusyChange: a[5] ||= (e) => pe.value = e,
							onStart: a[6] ||= (e) => D.value = "",
							onError: je
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "内容来源",
						prop: "content_source",
						error: P(K).content_source
					}, {
						default: L(() => [C(P(oe), {
							modelValue: U.content_source,
							"onUpdate:modelValue": a[7] ||= (e) => U.content_source = e,
							maxlength: 160,
							disabled: H.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "作者署名",
						prop: "author_name",
						error: P(K).author_name
					}, {
						default: L(() => [C(P(oe), {
							modelValue: U.author_name,
							"onUpdate:modelValue": a[8] ||= (e) => U.author_name = e,
							maxlength: 120,
							disabled: H.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "前端排序",
						prop: "sort_order",
						error: P(K).sort_order
					}, {
						default: L(() => [C(P(ne), {
							modelValue: U.sort_order,
							"onUpdate:modelValue": a[9] ||= (e) => U.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: H.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[35] ||= x("h3", null, "发布设置", -1),
					C(P(e), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: P(K).helpful_enabled
					}, {
						default: L(() => [C(Ht, {
							modelValue: U.helpful_enabled,
							"onUpdate:modelValue": a[10] ||= (e) => U.helpful_enabled = e,
							disabled: H.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "启用状态",
						prop: "is_enabled",
						error: P(K).is_enabled
					}, {
						default: L(() => [C(Ht, {
							modelValue: U.is_enabled,
							"onUpdate:modelValue": a[11] ||= (e) => U.is_enabled = e,
							disabled: H.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: P(K).scheduled_local
					}, {
						default: L(() => [C(P(oe), {
							modelValue: U.scheduled_local,
							"onUpdate:modelValue": a[12] ||= (e) => U.scheduled_local = e,
							type: "datetime-local",
							disabled: H.value || !R.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[36] ||= x("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", Kn, [C(P(ie), {
				model: U,
				rules: P(ve),
				"label-position": "top",
				onSubmit: a[17] ||= he(() => {}, ["prevent"])
			}, {
				default: L(() => [
					C(P(e), {
						label: "标题",
						prop: "title",
						error: P(K).title,
						required: ""
					}, {
						default: L(() => [C(P(oe), {
							modelValue: U.title,
							"onUpdate:modelValue": a[14] ||= (e) => U.title = e,
							maxlength: 255,
							disabled: H.value,
							placeholder: "输入公告标题",
							"aria-label": "公告标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "摘要",
						prop: "summary",
						error: P(K).summary
					}, {
						default: L(() => [me(x("textarea", {
							"onUpdate:modelValue": a[15] ||= (e) => U.summary = e,
							"aria-invalid": !!P(K).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: H.value,
							"aria-label": "公告摘要"
						}, null, 8, qn), [[fe, U.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(P(e), {
						label: "正文",
						prop: "body_html",
						error: P(K).body_html
					}, {
						default: L(() => [C(P(n), {
							modelValue: U.body_html,
							"onUpdate:modelValue": a[16] ||= (e) => U.body_html = e,
							readonly: z.value,
							disabled: T.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "公告正文"
						}, {
							"image-upload": L(({ url: e, setUrl: t, setBusy: n }) => [C(Ue, {
								label: "正文图片",
								"model-value": e,
								upload: P(te),
								"onUpdate:modelValue": t,
								onBusyChange: n,
								onError: je
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
			C(P(l), {
				modelValue: O.value,
				"onUpdate:modelValue": a[21] ||= (e) => O.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: L(() => [C(P(t), {
					variant: "primary",
					onClick: a[20] ||= (e) => O.value = !1
				}, {
					default: L(() => [...a[37] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: L(() => [C(P(ie), {
					model: U,
					rules: P(ve),
					"label-position": "top",
					onSubmit: a[19] ||= he(() => {}, ["prevent"])
				}, {
					default: L(() => [C(P(e), {
						label: "SEO 描述",
						prop: "seo_description",
						error: P(K).seo_description
					}, {
						default: L(() => [me(x("textarea", {
							ref_key: "seoInput",
							ref: G,
							"onUpdate:modelValue": a[18] ||= (e) => U.seo_description = e,
							"aria-invalid": !!P(K).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: H.value,
							"aria-label": "SEO 描述"
						}, null, 8, Jn), [[fe, U.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(l), {
				modelValue: M.value,
				"onUpdate:modelValue": a[23] ||= (e) => M.value = e,
				title: "确认删除",
				subtitle: `操作对象：${U.title || "未命名公告"}`,
				width: "460px",
				"panel-class": "announcement-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !T.value
			}, {
				"header-actions": L(() => [x("span", Yn, [C(P(m), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: L(() => [C(P(t), {
					disabled: T.value,
					onClick: a[22] ||= (e) => M.value = !1
				}, {
					default: L(() => [...a[38] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(t), {
					variant: "warning",
					loading: T.value,
					onClick: V
				}, {
					default: L(() => [...a[39] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: L(() => [C(P(p), {
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
			C(P(l), {
				modelValue: le.value,
				"onUpdate:modelValue": a[26] ||= (e) => le.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: L(() => [C(P(t), { onClick: a[24] ||= (e) => le.value = !1 }, {
					default: L(() => [...a[40] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(t), {
					variant: "primary",
					onClick: a[25] ||= (e) => h("close")
				}, {
					default: L(() => [...a[41] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(l), {
				modelValue: ue.value,
				"onUpdate:modelValue": a[28] ||= (e) => ue.value = e,
				title: "将公告转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: L(() => [C(P(t), { onClick: a[27] ||= (e) => ue.value = !1 }, {
					default: L(() => [...a[42] ||= [S("取消", -1)]]),
					_: 1
				}), C(P(t), {
					variant: "primary",
					onClick: ke
				}, {
					default: L(() => [...a[43] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Fn));
	}
}), [["__scopeId", "data-v-6f468168"]]), Zn = { class: "announcement-articles" }, Qn = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { hasPermission: n } = ge(), { formatDateTime: i } = ge(), { announcementPublishStates: a, announcementCategoryLabel: o, getAnnouncementList: c, getAnnouncementMetadata: l } = Dn(), u = j(!1), f = j(), ee = (e) => n([`cms_announcement:${e}`]), te = j(), p = K(l, (e) => {
			te.value = e;
		}), ne = [
			...ve(),
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
				formatter: (e) => o(te.value, e)
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
		], re = _(() => [
			...p.fields,
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
				}, ...(te.value?.categories || []).map((e) => ({
					label: o(te.value, e.id),
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
		]), { proTableBindings: ie, reload: ae } = p.bindTable(r({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: re,
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([e, t]) => e !== "publish_range" && t !== "" && t != null)), a = e.publish_range;
				Array.isArray(a) && a.length === 2 && (i.published_from = (/* @__PURE__ */ new Date(`${a[0]}T00:00:00`)).toISOString(), i.published_to = (/* @__PURE__ */ new Date(`${a[1]}T23:59:59.999`)).toISOString());
				let o = await c("articles", {
					...i,
					page_no: t,
					page_size: n
				}, r);
				return {
					rows: o.lists,
					total: o.count
				};
			}
		})), oe = p.loadMetadata;
		function h(e) {
			f.value = e, u.value = !0;
		}
		function g() {
			u.value = !1, ae(), oe();
		}
		return (e, n) => (k(), b("div", Zn, [u.value ? (k(), v(Xn, {
			key: 0,
			"article-id": f.value,
			onClose: n[0] ||= (e) => u.value = !1,
			onSaved: g
		}, null, 8, ["article-id"])) : y("", !0), me(C(P(s), E(P(ie), {
			"auto-refreshable": !1,
			columns: ne,
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
			"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": L(() => [ee("add") ? (k(), v(P(t), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: n[1] ||= (e) => h()
			}, {
				icon: L(() => [C(P(m), {
					name: "plus",
					size: 14
				})]),
				default: L(() => [n[2] ||= S("新增公告", -1)]),
				_: 1
			})) : y("", !0)]),
			"cell-publish_status": L(({ row: e }) => [C(P(d), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: L(() => [S(N(P(a).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": L(({ row: e }) => [C(P(d), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: L(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": L(({ row: e }) => [S(N(P(i)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": L(({ row: e }) => [C(P(t), {
				size: "sm",
				"icon-only": "",
				title: ee("edit") ? "编辑公告" : "公告详情",
				"aria-label": ee("edit") ? "编辑公告" : "公告详情",
				onClick: (t) => h(e.id)
			}, {
				default: L(() => [C(P(m), {
					name: ee("edit") ? "square-pen" : "panel-right-open",
					size: 15
				}, null, 8, ["name"])]),
				_: 1
			}, 8, [
				"title",
				"aria-label",
				"onClick"
			])]),
			_: 1
		}, 16), [[I, !u.value]])]));
	}
}), [["__scopeId", "data-v-3d615d55"]]);
//#endregion
//#region src/cms/api/content/translations.ts
function $n() {
	let e = ge().request, t = "/cms/translations";
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
var er = (e, t) => t > 0 ? Math.min(100, Math.round(e / t * 100)) : 0, tr = (e, t) => `${e}:${t}`;
function nr(e, t) {
	return e ? e.fields.flatMap((e) => e.translations.flatMap((n) => {
		let r = t[tr(e.key, n.locale)] ?? n.text;
		return r === n.text ? [] : [{
			field_name: e.key,
			locale: n.locale,
			text: r,
			source_hash: e.source_hash,
			row_version: n.row_version
		}];
	})) : [];
}
function rr(e) {
	return Object.fromEntries(e.fields.flatMap((e) => e.translations.map((t) => [tr(e.key, t.locale), t.text])));
}
function ir(e) {
	return e?.translations.filter((e) => e.status === "ready").length ?? 0;
}
var ar = (e) => !!e && ["queued", "running"].includes(e.status), or = {
	queued: "等待处理",
	running: "翻译中",
	succeeded: "翻译完成",
	partial_failed: "部分未完成",
	failed: "翻译未完成",
	cancelled: "已取消"
}, sr = {
	draft: "草稿",
	scheduled: "定时发布",
	published: "已发布"
};
function cr(e) {
	if (e && typeof e == "object") {
		let t = e;
		return Object.values(t.errors || {}).flat()[0] || t.msg || t.message || "操作失败，请稍后重试";
	}
	return "操作失败，请稍后重试";
}
//#endregion
//#region src/cms/views/content/localization/translations/index.vue?vue&type=script&setup=true&lang.ts
var lr = ["aria-busy"], ur = { class: "translation-toolbar surface" }, dr = { class: "translation-title" }, fr = { class: "translation-title__icon" }, pr = { class: "translation-progress" }, mr = { class: "translation-toolbar__actions" }, hr = { class: "source-language" }, gr = {
	key: 3,
	class: "translation-job surface",
	role: "status"
}, _r = { key: 0 }, vr = { key: 1 }, yr = ["title"], br = {
	class: "language-overview surface",
	"aria-label": "目标语言完成度"
}, xr = [
	"disabled",
	"title",
	"onClick"
], Sr = {
	class: "module-bar surface",
	"aria-label": "翻译内容模块"
}, Cr = { class: "module-count" }, wr = { class: "translation-workspace surface" }, Tr = { class: "content-browser" }, Er = { class: "content-browser__header" }, Dr = ["aria-busy"], Or = {
	key: 0,
	class: "region-status",
	role: "status"
}, kr = [
	"aria-current",
	"disabled",
	"onClick"
], Ar = { class: "content-item__text" }, jr = ["title"], Mr = {
	key: 0,
	class: "region-status"
}, Nr = { class: "content-browser__footer" }, Pr = ["aria-busy"], Fr = {
	key: 0,
	class: "editor-state",
	role: "status"
}, Ir = { class: "translation-editor__header" }, Lr = { class: "translation-editor__title" }, Rr = { key: 0 }, zr = ["title"], Br = { class: "source-field" }, Vr = { class: "section-heading" }, Hr = [
	"value",
	"rows",
	"aria-label"
], Ur = { class: "section-heading target-heading" }, Wr = {
	key: 0,
	class: "empty-source"
}, Gr = {
	key: 1,
	class: "empty-source"
}, Kr = ["data-locale"], qr = { class: "target-field__heading" }, Jr = ["for"], Yr = {
	key: 0,
	class: "status-stale"
}, Xr = {
	key: 1,
	class: "status-ready"
}, Zr = [
	"id",
	"onUpdate:modelValue",
	"rows",
	"maxlength",
	"disabled",
	"dir",
	"placeholder"
], Qr = { class: "target-field__count" }, $r = {
	key: 2,
	class: "editor-state"
}, ei = {
	key: 1,
	class: "region-status"
}, ti = {
	key: 2,
	class: "mm-translation-settings"
}, ni = { class: "mm-translation-settings__credential" }, ri = { key: 0 }, ii = { key: 1 }, ai = { key: 2 }, oi = { class: "mm-translation-settings__grid" }, si = { class: "job-confirm" }, ci = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(n) {
		let { cancelTranslationJob: r, createTranslationJob: a, getTranslationDetail: s, getTranslationJob: c, getTranslationList: te, getTranslationMetadata: ie, getTranslationSettings: h, saveTranslations: w, saveTranslationSettings: T, testTranslationConnection: E } = $n(), { hasPermission: le } = ge(), A = j(), M = j(""), de = j("news:content"), F = j([]), I = j(), he = j(""), z = j("title"), B = j(""), V = j(""), H = j(1), U = j(0), W = j({}), G = j(!1), ve = j(!1), K = j(!1), ye = j(!1), q = j(""), J = j(""), be = j(), Y = j(null), xe = j(!1), X = j(""), Se = j(!1), Z = j(), Q = j(""), $ = j(!1), Ce = j(!1), we = j(!1), Te = j("field"), Ee = j([]), De = j(""), Oe = j(!1), ke = j(!1);
		pe(xe, (e) => {
			e || (X.value = "");
		});
		let Ae, je, Me, Ne, Pe, Fe = new AbortController(), Ie, Le = "", Re = _(() => le(["cms_translation:edit"])), ze = _(() => le(["cms_translation:config"])), Be = _(() => le(["cms_translation:translate"])), Ve = _(() => ye.value || $.value || Oe.value), He = _(() => nr(I.value, W.value).length > 0), Ue = _(() => er(A.value?.done || 0, A.value?.total || 0)), We = _(() => ({
			space_id: M.value,
			module: de.value.split(":")[0],
			kind: de.value.endsWith(":category") ? "category" : "content"
		})), Ge = _(() => A.value?.spaces.map((e) => ({
			label: e.label + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		})) || []), Ke = _(() => A.value?.locales.filter((e) => e.code !== A.value?.source_locale) || []), qe = _(() => Ke.value.map((e) => ({
			label: `${e.flag} ${e.label}`,
			value: e.code
		}))), Je = _(() => Ke.value.map((e) => ({
			label: `${e.label} · ${e.code}`,
			value: e.code
		}))), Ye = _(() => qe.value.filter((e) => nt(String(e.value)))), Xe = _(() => A.value?.locales.find((e) => e.code === A.value?.source_locale)?.label || A.value?.source_locale || "简体中文"), Ze = _(() => I.value?.fields.find((e) => e.key === z.value)), Qe = _(() => {
			let e = A.value?.modules.find((e) => e.key === de.value);
			return e?.kind === "category" ? `${A.value?.modules.find((t) => t.module === e.module && t.kind === "content")?.label || ""}分类` : e?.label || "新闻";
		}), $e = _(() => {
			let e = [];
			for (let t of A.value?.modules || []) {
				let n = e.find((e) => e[0].module === t.module);
				n ? n.push(t) : e.push([t]);
			}
			return e;
		}), et = _(() => !!M.value && A.value?.space_enabled && !!A.value.target_locales.length && !ar(Y.value) && !Ve.value && !He.value && !G.value && !ve.value), tt = _(() => Y.value ? er([
			"succeeded",
			"skipped",
			"cancelled"
		].reduce((e, t) => e + (Y.value?.counts[t] || 0), 0) + (ar(Y.value) ? 0 : Y.value.counts.failed || 0), Y.value.total) : 0), nt = (e) => A.value?.target_locales.includes(e) ?? !1, rt = (e) => A.value?.locales.find((t) => t.code === e), it = (e) => ({
			news: "file-text",
			academy: "landmark",
			help: "info",
			announcement: "megaphone"
		})[e] || "info";
		function at(e) {
			Ve.value || (He.value ? (Ae = e, ke.value = !0) : e());
		}
		function ot() {
			let e = Ae;
			Ae = void 0, ke.value = !1, W.value = I.value ? rr(I.value) : {}, e?.();
		}
		function st() {
			ke.value = !1, Ae = void 0, Pe?.(!1), Pe = void 0;
		}
		function ct(e) {
			e !== M.value && at(() => {
				M.value = e, B.value = "", V.value = "", H.value = 1, Y.value = null, pt();
			});
		}
		function lt(e) {
			e.available && de.value !== e.key && at(() => {
				de.value = e.key, B.value = "", V.value = "", H.value = 1, ht();
			});
		}
		function ut(e) {
			at(() => {
				H.value = e, ht();
			});
		}
		function dt() {
			at(() => {
				V.value = B.value.trim(), H.value = 1, ht();
			});
		}
		function ft(e) {
			e !== he.value && at(() => {
				gt(e);
			});
		}
		async function pt() {
			Ne?.abort();
			let e = Ne = new AbortController();
			G.value = !0, q.value = "";
			try {
				let t = await ie(M.value || void 0, e.signal);
				if (e.signal.aborted) return;
				A.value = t, M.value = t.space_id || "", await ht(), Tt();
			} catch (t) {
				e.signal.aborted || (q.value = cr(t));
			} finally {
				e.signal.aborted || (G.value = !1);
			}
		}
		async function mt() {
			let e = M.value;
			if (e) try {
				let t = await ie(e, Fe.signal);
				e === M.value && (A.value = t);
			} catch {}
		}
		async function ht() {
			je?.abort(), Me?.abort();
			let e = je = new AbortController();
			if (ve.value = !0, K.value = !1, I.value = void 0, he.value = "", W.value = {}, q.value = "", !M.value) {
				F.value = [], U.value = 0, ve.value = !1;
				return;
			}
			let t = { ...We.value };
			try {
				let n = await te(t, V.value, H.value, e.signal);
				if (e.signal.aborted) return;
				F.value = n.lists, U.value = n.count, F.value[0] && await gt(F.value[0].id);
			} catch (t) {
				e.signal.aborted || (F.value = [], U.value = 0, q.value = cr(t));
			} finally {
				e.signal.aborted || (ve.value = !1);
			}
		}
		async function gt(e) {
			Me?.abort();
			let t = Me = new AbortController();
			K.value = !0, he.value = e, I.value = void 0, W.value = {}, q.value = "";
			try {
				let n = await s({ ...We.value }, e, t.signal);
				if (t.signal.aborted) return;
				I.value = n, W.value = rr(n), n.fields.some((e) => e.key === z.value) || (z.value = n.fields[0]?.key || ""), be.value?.scrollTo({ top: 0 });
			} catch (e) {
				t.signal.aborted || (q.value = cr(e));
			} finally {
				t.signal.aborted || (K.value = !1);
			}
		}
		async function _t() {
			if (!I.value || !Re.value || Ve.value) return;
			let e = nr(I.value, W.value);
			if (e.length) {
				if (e.some((e) => !e.text.trim())) {
					q.value = "译文不能为空；未翻译的语言请保持未填写。";
					return;
				}
				ye.value = !0, q.value = "";
				try {
					let t = await w({ ...We.value }, I.value.id, e);
					I.value = t, W.value = rr(t);
					let n = F.value.findIndex((e) => e.id === t.id);
					n >= 0 && (F.value[n] = t), f.success("翻译已保存"), mt();
				} catch (e) {
					q.value = cr(e);
				} finally {
					ye.value = !1;
				}
			}
		}
		async function vt(e) {
			J.value = e, await D();
			let t = be.value?.querySelector(`[data-locale="${e}"]`);
			t?.scrollIntoView({
				block: "nearest",
				behavior: "smooth"
			}), t?.querySelector("textarea")?.focus();
		}
		async function yt() {
			if (!(!ze.value || !M.value)) {
				xe.value = !0, Se.value = !0, Q.value = "", Z.value = void 0, X.value = "";
				try {
					Z.value = await h(M.value, Fe.signal);
				} catch (e) {
					Q.value = cr(e);
				} finally {
					Se.value = !1;
				}
			}
		}
		async function bt() {
			if (!(!Z.value || $.value)) {
				if (He.value) {
					Q.value = "请先保存或放弃当前译文修改，再修改配置。";
					return;
				}
				$.value = !0, Q.value = "";
				try {
					await T(Z.value, X.value.trim()), X.value = "", xe.value = !1, f.success("翻译配置已保存"), await pt();
				} catch (e) {
					Q.value = cr(e);
				} finally {
					$.value = !1;
				}
			}
		}
		async function xt() {
			if (!(!Z.value || Ce.value || $.value)) {
				Ce.value = !0, Q.value = "";
				try {
					await E(Z.value.space_id, Z.value.space_revision, X.value.trim()), f.success("Google Translate 连接成功");
				} catch (e) {
					Q.value = cr(e);
				} finally {
					Ce.value = !1;
				}
			}
		}
		function St(e) {
			Te.value = e, Ee.value = [...A.value?.target_locales || []], De.value = "", Le = crypto.randomUUID(), we.value = !0;
		}
		async function Ct() {
			if (!(!Ee.value.length || Oe.value)) {
				Oe.value = !0, De.value = "";
				try {
					let e = await a({ ...We.value }, {
						request_key: Le,
						target_locales: Ee.value,
						...Te.value === "field" ? {
							id: he.value,
							field_name: z.value
						} : { keyword: V.value }
					});
					Y.value = e.job, we.value = !1, f.success("翻译任务已提交"), wt();
				} catch (e) {
					De.value = cr(e);
				} finally {
					Oe.value = !1;
				}
			}
		}
		function wt() {
			clearTimeout(Ie), ar(Y.value) && (Ie = setTimeout(() => {
				Tt();
			}, 3e3));
		}
		async function Tt() {
			let e = M.value;
			if (!e || Fe.signal.aborted) return;
			let t = ar(Y.value);
			try {
				let n = await c(e, Fe.signal);
				if (e !== M.value) return;
				Y.value = n.job, t && !ar(Y.value) && (await mt(), !He.value && !Ve.value && he.value && await gt(he.value));
			} catch {}
			wt();
		}
		async function Et() {
			if (Y.value) try {
				let e = await r(M.value, Y.value.id);
				Y.value = e.job, clearTimeout(Ie), mt();
			} catch (e) {
				q.value = cr(e);
			}
		}
		function Dt(e) {
			(He.value || Ve.value) && (e.preventDefault(), e.returnValue = "");
		}
		return _e(() => !He.value && !Ve.value || !Ve.value && new Promise((e) => {
			Pe?.(!1), Pe = e, Ae = () => {
				Pe = void 0, e(!0);
			}, ke.value = !0;
		})), ce(() => {
			window.addEventListener("beforeunload", Dt), pt();
		}), se(() => {
			X.value = "", Pe?.(!1), Fe.abort(), je?.abort(), Me?.abort(), Ne?.abort(), clearTimeout(Ie), window.removeEventListener("beforeunload", Dt);
		}), (n, r) => (k(), b("section", {
			class: "translations-page",
			"aria-label": "多语言翻译管理",
			"aria-busy": G.value
		}, [
			x("header", ur, [x("div", dr, [x("span", fr, [C(P(m), {
				name: "globe",
				size: 21
			})]), x("div", null, [r[21] ||= x("h1", null, "语言翻译管理", -1), x("div", pr, [
				x("strong", null, N(Ue.value) + "%", 1),
				C(P(i), {
					percentage: Ue.value,
					"show-text": !1,
					"stroke-width": 4,
					"aria-label": "全部翻译完成度"
				}, null, 8, ["percentage"]),
				x("span", null, N(A.value?.done.toLocaleString() || 0) + " / " + N(A.value?.total.toLocaleString() || 0) + " 个目标字段", 1)
			])])]), x("div", mr, [
				C(P(re), {
					"model-value": M.value,
					options: Ge.value,
					size: "sm",
					disabled: G.value || Ve.value,
					placeholder: "内容空间",
					"aria-label": "内容空间",
					"onUpdate:modelValue": r[0] ||= (e) => ct(String(e))
				}, null, 8, [
					"model-value",
					"options",
					"disabled"
				]),
				x("span", hr, [r[22] ||= S("内容源语言 ", -1), x("b", null, N(Xe.value), 1)]),
				ze.value ? (k(), v(P(t), {
					key: 0,
					size: "sm",
					disabled: !M.value || Ve.value,
					onClick: yt
				}, {
					icon: L(() => [C(P(m), {
						name: "sliders-horizontal",
						size: 14
					})]),
					default: L(() => [r[23] ||= S("翻译配置", -1)]),
					_: 1
				}, 8, ["disabled"])) : y("", !0),
				Be.value ? (k(), v(P(t), {
					key: 1,
					size: "sm",
					disabled: !et.value,
					onClick: r[1] ||= (e) => St("batch")
				}, {
					icon: L(() => [C(P(m), {
						name: "rocket",
						size: 14
					})]),
					default: L(() => [r[24] ||= S("批量翻译", -1)]),
					_: 1
				}, 8, ["disabled"])) : y("", !0),
				Be.value ? (k(), v(P(t), {
					key: 2,
					size: "sm",
					disabled: !et.value || !I.value || !Ze.value?.translatable,
					onClick: r[2] ||= (e) => St("field")
				}, {
					icon: L(() => [C(P(m), {
						name: "globe",
						size: 14
					})]),
					default: L(() => [r[25] ||= S("翻译当前字段", -1)]),
					_: 1
				}, 8, ["disabled"])) : y("", !0),
				Re.value ? (k(), v(P(t), {
					key: 3,
					size: "sm",
					variant: "primary",
					loading: ye.value,
					disabled: !He.value || Ve.value || !A.value?.space_enabled,
					onClick: _t
				}, {
					icon: L(() => [C(P(m), {
						name: "save",
						size: 14
					})]),
					default: L(() => [r[26] ||= S("保存翻译", -1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : y("", !0)
			])]),
			q.value ? (k(), v(P(p), {
				key: 0,
				type: "error",
				closable: !0,
				onClose: r[3] ||= (e) => q.value = ""
			}, {
				default: L(() => [S(N(q.value), 1)]),
				_: 1
			})) : y("", !0),
			A.value && !A.value.space_enabled && M.value ? (k(), v(P(p), {
				key: 1,
				type: "warning"
			}, {
				default: L(() => [...r[27] ||= [S("当前内容空间已停用，仅可查看翻译。", -1)]]),
				_: 1
			})) : y("", !0),
			A.value && !A.value.target_locales.length && M.value ? (k(), v(P(p), {
				key: 2,
				type: "info"
			}, {
				default: L(() => [...r[28] ||= [S("尚未启用目标语言，请在“翻译配置”中选择语言后开始翻译。", -1)]]),
				_: 1
			})) : y("", !0),
			Y.value ? (k(), b("div", gr, [
				C(P(m), {
					name: P(ar)(Y.value) ? "loader-circle" : "info",
					size: 15
				}, null, 8, ["name"]),
				x("strong", null, N(P(or)[Y.value.status] || Y.value.status), 1),
				x("span", null, "任务 #" + N(Y.value.id), 1),
				C(P(i), {
					percentage: tt.value,
					"show-text": !1,
					"stroke-width": 4
				}, null, 8, ["percentage"]),
				x("span", null, [
					S(N(Y.value.counts.succeeded || 0) + " / " + N(Y.value.total) + " 已完成", 1),
					Y.value.counts.failed ? (k(), b("span", _r, " · " + N(Y.value.counts.failed) + " 失败", 1)) : y("", !0),
					Y.value.counts.skipped ? (k(), b("span", vr, " · " + N(Y.value.counts.skipped) + " 冲突跳过", 1)) : y("", !0)
				]),
				P(ar)(Y.value) && Be.value ? (k(), v(P(t), {
					key: 0,
					size: "sm",
					variant: "text",
					disabled: Ve.value,
					onClick: Et
				}, {
					default: L(() => [...r[29] ||= [S("取消任务", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (k(), v(P(t), {
					key: 1,
					size: "sm",
					variant: "text",
					onClick: r[4] ||= (e) => Y.value = null
				}, {
					default: L(() => [...r[30] ||= [S("收起", -1)]]),
					_: 1
				})),
				Y.value.errors.length ? (k(), b("span", {
					key: 2,
					class: "translation-job__error",
					title: Y.value.errors.map((e) => `${e.target_locale}: ${e.error_code}`).join("；")
				}, N(Y.value.errors[0].error_code) + "（可重新提交补翻）", 9, yr)) : y("", !0)
			])) : y("", !0),
			x("div", br, [(k(!0), b(g, null, ue(Ke.value, (e) => (k(), b("button", {
				key: e.code,
				type: "button",
				class: O(["language-card", {
					"is-active": J.value === e.code,
					"is-disabled": !nt(e.code)
				}]),
				disabled: !nt(e.code),
				title: nt(e.code) ? `${e.native}：${e.done} / ${e.total}` : "请在翻译配置中启用",
				onClick: (t) => vt(e.code)
			}, [
				x("span", null, N(e.flag), 1),
				x("span", null, N(e.label), 1),
				x("strong", null, N(nt(e.code) ? P(er)(e.done, e.total) + "%" : "未启用"), 1),
				C(P(i), {
					percentage: P(er)(e.done, e.total),
					"show-text": !1,
					"stroke-width": 2
				}, null, 8, ["percentage"])
			], 10, xr))), 128))]),
			x("nav", Sr, [(k(!0), b(g, null, ue($e.value, (e) => (k(), b("div", {
				key: e[0].module,
				class: "module-group"
			}, [(k(!0), b(g, null, ue(e, (e) => (k(), v(P(t), {
				key: e.key,
				variant: de.value === e.key ? "primary" : "text",
				plain: de.value === e.key,
				size: "sm",
				disabled: !e.available || Ve.value,
				title: e.reason,
				"aria-pressed": de.value === e.key,
				onClick: (t) => lt(e)
			}, {
				default: L(() => [
					e.kind === "category" ? y("", !0) : (k(), v(P(m), {
						key: 0,
						name: it(e.module),
						size: 14
					}, null, 8, ["name"])),
					S(N(e.label), 1),
					x("span", Cr, N(e.count), 1)
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
			x("main", wr, [x("aside", Tr, [
				x("div", Er, [x("div", null, [x("strong", null, N(Qe.value), 1), x("span", null, N(U.value) + " 条" + N(We.value.kind === "category" ? "分类" : "内容"), 1)]), C(P(oe), {
					modelValue: B.value,
					"onUpdate:modelValue": r[5] ||= (e) => B.value = e,
					size: "sm",
					clearable: "",
					placeholder: "搜索内容",
					"aria-label": "搜索内容",
					onKeydown: R(dt, ["enter"])
				}, {
					prefix: L(() => [C(P(m), {
						name: "search",
						size: 14
					})]),
					_: 1
				}, 8, ["modelValue"])]),
				x("div", {
					class: "content-browser__list",
					"aria-busy": ve.value
				}, [ve.value ? (k(), b("p", Or, "加载内容中…")) : (k(), b(g, { key: 1 }, [(k(!0), b(g, null, ue(F.value, (e) => (k(), b("button", {
					key: e.id,
					type: "button",
					class: O(["content-item", { "is-selected": he.value === e.id }]),
					"aria-current": he.value === e.id ? "true" : void 0,
					disabled: Ve.value,
					onClick: (t) => ft(e.id)
				}, [x("span", Ar, [x("strong", { title: e.title }, N(e.title), 9, jr), x("small", null, N(P(sr)[e.publish_status || ""] || "分类") + " · " + N(e.done) + "/" + N(e.total), 1)]), C(P(i), {
					type: "circle",
					percentage: P(er)(e.done, e.total),
					"show-text": !1,
					size: 16,
					"stroke-width": 2,
					status: e.total && e.done === e.total ? "success" : "warning"
				}, null, 8, ["percentage", "status"])], 10, kr))), 128)), F.value.length ? y("", !0) : (k(), b("p", Mr, N(V.value ? "没有匹配的内容" : "暂无可翻译内容"), 1))], 64))], 8, Dr),
				x("footer", Nr, [
					C(P(t), {
						size: "sm",
						"icon-only": "",
						"aria-label": "上一页",
						disabled: H.value <= 1 || ve.value || Ve.value,
						onClick: r[6] ||= (e) => ut(H.value - 1)
					}, {
						default: L(() => [C(P(m), {
							name: "chevron-left",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"]),
					x("span", null, N(H.value) + " / " + N(Math.max(1, Math.ceil(U.value / 30))), 1),
					C(P(t), {
						size: "sm",
						"icon-only": "",
						"aria-label": "下一页",
						disabled: H.value * 30 >= U.value || ve.value || Ve.value,
						onClick: r[7] ||= (e) => ut(H.value + 1)
					}, {
						default: L(() => [C(P(m), {
							name: "chevron-right",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"])
				])
			]), x("section", {
				class: "translation-editor",
				"aria-busy": K.value
			}, [K.value ? (k(), b("div", Fr, [C(P(m), {
				name: "loader-circle",
				size: 28
			}), r[31] ||= x("p", null, "加载译文中…", -1)])) : I.value ? (k(), b(g, { key: 1 }, [x("header", Ir, [x("div", Lr, [x("span", null, [S(N(Qe.value) + " ", 1), He.value ? (k(), b("em", Rr, "有未保存修改")) : y("", !0)]), x("h2", { title: I.value.title }, N(I.value.title), 9, zr)]), C(P(u), {
				modelValue: z.value,
				"onUpdate:modelValue": r[8] ||= (e) => z.value = e
			}, {
				default: L(() => [(k(!0), b(g, null, ue(I.value.fields, (e) => (k(), v(P(o), {
					key: e.key,
					name: e.key,
					label: `${e.label} ${e.translatable ? P(ir)(e) + "/" + e.translations.length : "—"}`
				}, null, 8, ["name", "label"]))), 128))]),
				_: 1
			}, 8, ["modelValue"])]), Ze.value ? (k(), b("div", {
				key: 0,
				class: "translation-editor__body",
				ref_key: "editorBody",
				ref: be
			}, [
				x("section", Br, [x("div", Vr, [x("strong", null, [S(N(Xe.value) + " ", 1), C(P(d), {
					size: "sm",
					type: "primary",
					effect: "soft"
				}, {
					default: L(() => [...r[32] ||= [S("内容源语言", -1)]]),
					_: 1
				})]), r[33] ||= x("span", null, "只读原文", -1)]), x("textarea", {
					value: Ze.value.source,
					readonly: "",
					rows: Ze.value.key === "body_html" ? 5 : 2,
					class: "translation-textarea source-textarea",
					"aria-label": `原文${Ze.value.label}`
				}, null, 8, Hr)]),
				x("div", Ur, [r[34] ||= x("strong", null, "目标语言", -1), x("span", null, N(I.value.fields.find((e) => e.key === z.value)?.translations.length || 0) + " 种语言 · 手工修改后请保存", 1)]),
				Ze.value.translatable ? Ze.value.translations.length ? (k(), b("div", {
					key: 2,
					class: O(["target-grid", { "is-body": z.value === "body_html" }])
				}, [(k(!0), b(g, null, ue(Ze.value.translations, (e) => (k(), b("div", {
					key: e.locale,
					class: O(["target-field", { "is-focused": J.value === e.locale }]),
					"data-locale": e.locale
				}, [
					x("div", qr, [x("label", { for: `translation-${z.value}-${e.locale}` }, [S(N(rt(e.locale)?.native || e.locale) + " ", 1), x("small", null, N(e.locale), 1)], 8, Jr), e.status === "stale" ? (k(), b("span", Yr, "原文已更新")) : e.status === "ready" ? (k(), b("span", Xr, N(e.method === "machine" ? "机器翻译" : "已保存"), 1)) : y("", !0)]),
					me(x("textarea", {
						id: `translation-${z.value}-${e.locale}`,
						"onUpdate:modelValue": (t) => W.value[P(tr)(z.value, e.locale)] = t,
						class: "translation-textarea",
						rows: z.value === "body_html" ? 10 : 2,
						maxlength: Ze.value.max_length,
						disabled: !Re.value || !A.value?.space_enabled || Ve.value,
						dir: e.locale === "ar" ? "rtl" : "auto",
						placeholder: `请输入${rt(e.locale)?.native || e.locale}翻译${z.value === "body_html" ? "（HTML）" : ""}`
					}, null, 8, Zr), [[fe, W.value[P(tr)(z.value, e.locale)]]]),
					x("div", Qr, N((W.value[P(tr)(z.value, e.locale)] || "").length.toLocaleString()) + " / " + N(Ze.value.max_length.toLocaleString()), 1)
				], 10, Kr))), 128))], 2)) : (k(), b("div", Gr, " 请先在“翻译配置”中启用目标语言。 ")) : (k(), b("div", Wr, [C(P(m), {
					name: "info",
					size: 18
				}), r[35] ||= S("原文字段为空，不参与翻译和完成度统计。 ", -1)]))
			], 512)) : y("", !0)], 64)) : (k(), b("div", $r, [C(P(ae), { description: q.value ? "内容加载失败，可点击刷新重试" : "选择左侧内容开始翻译" }, null, 8, ["description"]), q.value ? (k(), v(P(t), {
				key: 0,
				size: "sm",
				onClick: pt
			}, {
				default: L(() => [...r[36] ||= [S("重新加载", -1)]]),
				_: 1
			})) : y("", !0)]))], 8, Pr)]),
			C(P(l), {
				modelValue: xe.value,
				"onUpdate:modelValue": r[16] ||= (e) => xe.value = e,
				title: "翻译配置",
				subtitle: "当前内容空间共用 · Google Cloud Translation Basic v2",
				width: "560px",
				"close-on-click-modal": !1,
				"before-close": () => !$.value && !Ce.value
			}, {
				footer: L(() => [
					C(P(t), {
						loading: Ce.value,
						disabled: !Z.value?.credential_configured && !X.value.trim() || $.value || Se.value,
						onClick: xt
					}, {
						default: L(() => [...r[43] ||= [S("测试连接", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"]),
					C(P(t), {
						disabled: $.value || Ce.value,
						onClick: r[15] ||= (e) => xe.value = !1
					}, {
						default: L(() => [...r[44] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					C(P(t), {
						variant: "primary",
						loading: $.value,
						disabled: !Z.value || Se.value || Ce.value,
						onClick: bt
					}, {
						default: L(() => [...r[45] ||= [S("保存翻译配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])
				]),
				default: L(() => [Q.value ? (k(), v(P(p), {
					key: 0,
					type: "error"
				}, {
					default: L(() => [S(N(Q.value), 1)]),
					_: 1
				})) : y("", !0), Se.value ? (k(), b("div", ei, "加载配置中…")) : Z.value ? (k(), b("div", ti, [
					x("label", null, [r[37] ||= S(" 目标语言 ", -1), C(P(re), {
						modelValue: Z.value.target_locales,
						"onUpdate:modelValue": r[9] ||= (e) => Z.value.target_locales = e,
						options: Je.value,
						multiple: "",
						filterable: "",
						"max-tag-count": 4,
						placeholder: "选择需要维护的目标语言",
						disabled: $.value || Ce.value,
						"aria-label": "翻译目标语言"
					}, null, 8, [
						"modelValue",
						"options",
						"disabled"
					])]),
					C(ee, {
						modelValue: Z.value.is_enabled,
						"onUpdate:modelValue": r[10] ||= (e) => Z.value.is_enabled = e,
						disabled: $.value || Ce.value,
						"credential-ready": !!Z.value.credential_configured || !!X.value.trim()
					}, null, 8, [
						"modelValue",
						"disabled",
						"credential-ready"
					]),
					x("div", ni, [
						x("label", null, [r[38] ||= S(" Google API Key ", -1), C(P(oe), {
							modelValue: X.value,
							"onUpdate:modelValue": r[11] ||= (e) => X.value = e,
							type: "password",
							autocomplete: "new-password",
							disabled: $.value || Ce.value,
							placeholder: Z.value.credential_configured ? "已配置，留空保留原密钥；输入新密钥替换" : "请输入 Google Cloud Translation API Key"
						}, null, 8, [
							"modelValue",
							"disabled",
							"placeholder"
						])]),
						Z.value.api_key_mask ? (k(), b("small", ri, N(Z.value.credential_source === "database" ? "数据库密钥" : "环境配置密钥") + "：" + N(Z.value.api_key_mask), 1)) : y("", !0),
						Z.value.credential_error === "GOOGLE_CREDENTIAL_DECRYPT_FAILED" ? (k(), b("small", ii, "数据库密钥无法解密，请检查两套后台的专用加密配置，或输入新密钥替换。")) : (k(), b("small", ai, "密钥加密保存，不回显原文；留空保留原值。未配置密钥时仍可人工翻译。"))
					]),
					x("div", oi, [
						x("label", null, [r[39] ||= S(" 并发上限 ", -1), C(P(ne), {
							modelValue: Z.value.concurrency_limit,
							"onUpdate:modelValue": r[12] ||= (e) => Z.value.concurrency_limit = e,
							min: 1,
							max: 20,
							disabled: $.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])]),
						x("label", null, [r[40] ||= S(" 请求超时（秒） ", -1), C(P(ne), {
							modelValue: Z.value.request_timeout_seconds,
							"onUpdate:modelValue": r[13] ||= (e) => Z.value.request_timeout_seconds = e,
							min: 1,
							max: 120,
							disabled: $.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])]),
						x("label", null, [r[41] ||= S(" 最大尝试次数 ", -1), C(P(ne), {
							modelValue: Z.value.max_attempts,
							"onUpdate:modelValue": r[14] ||= (e) => Z.value.max_attempts = e,
							min: 1,
							max: 10,
							disabled: $.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])])
					]),
					Z.value.supported ? y("", !0) : (k(), v(P(p), {
						key: 0,
						type: "warning"
					}, {
						default: L(() => [...r[42] ||= [S("当前空间关联了其他版本的翻译配置。保存将为该空间创建独立的 Google v2 配置，不修改其他空间。", -1)]]),
						_: 1
					}))
				])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(P(l), {
				modelValue: we.value,
				"onUpdate:modelValue": r[19] ||= (e) => we.value = e,
				title: Te.value === "field" ? "翻译当前字段" : "批量翻译",
				subtitle: "Google Translate · 仅补齐缺失及原文已更新的译文",
				width: "520px",
				"close-on-click-modal": !1,
				"before-close": () => !Oe.value
			}, {
				footer: L(() => [C(P(t), {
					size: "sm",
					disabled: Oe.value,
					onClick: r[18] ||= (e) => we.value = !1
				}, {
					default: L(() => [...r[47] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(t), {
					variant: "primary",
					size: "sm",
					loading: Oe.value,
					disabled: !Ee.value.length,
					onClick: Ct
				}, {
					default: L(() => [...r[48] ||= [S("确认翻译", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])]),
				default: L(() => [x("div", si, [
					x("p", null, N(Te.value === "field" ? `当前内容的「${Ze.value?.label}」` : `当前空间「${Qe.value}」${V.value ? "中匹配搜索条件的内容" : "全部内容"}`), 1),
					C(P(e), { label: "目标语言" }, {
						default: L(() => [C(P(re), {
							modelValue: Ee.value,
							"onUpdate:modelValue": r[17] ||= (e) => Ee.value = e,
							options: Ye.value,
							multiple: "",
							filterable: "",
							"max-tag-count": 5,
							disabled: Oe.value
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}),
					C(P(p), { type: "warning" }, {
						default: L(() => [...r[46] ||= [S("内容将发送至 Google Translate，并可能产生翻译费用。已有有效译文不会覆盖；单次最多 200 条内容、5,000 个字段任务。后台任务需要已启动翻译 worker。", -1)]]),
						_: 1
					}),
					De.value ? (k(), v(P(p), {
						key: 0,
						type: "error"
					}, {
						default: L(() => [S(N(De.value), 1)]),
						_: 1
					})) : y("", !0)
				])]),
				_: 1
			}, 8, [
				"modelValue",
				"title",
				"before-close"
			]),
			C(P(l), {
				modelValue: ke.value,
				"onUpdate:modelValue": r[20] ||= (e) => ke.value = e,
				title: "有未保存的翻译",
				subtitle: "切换后将丢弃当前修改，是否继续？",
				width: "380px",
				onClose: st
			}, {
				footer: L(() => [C(P(t), {
					size: "sm",
					onClick: st
				}, {
					default: L(() => [...r[49] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(t), {
					size: "sm",
					variant: "warning",
					onClick: ot
				}, {
					default: L(() => [...r[50] ||= [S("放弃修改并继续", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, lr));
	}
}), [["__scopeId", "data-v-1430b3cb"]]), li = {
	key: 0,
	class: "mm-cms-site"
}, ui = ["disabled"], di = ["value"], fi = {
	key: 1,
	role: "alert"
}, pi = {
	key: 2,
	role: "status"
}, mi = { key: 3 }, hi = ["disabled"], gi = /*#__PURE__*/ h(/* @__PURE__ */ w({
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
			"news/list": st,
			"academy/categories": ht,
			"academy/courses": zt,
			"help/categories": Yt,
			"help/articles": gn,
			"feedback/list": En,
			"announcement/categories": Pn,
			"announcement/list": Qn,
			"localization/translations": ci
		}, r = t.runtime.mode === "white_label" && !!t.runtime.resolveSiteInRequest, i = j(!1), a = j(0), o = j([]), s = j(""), c = j(""), l = j(t.runtime.mode === "white_label" && !r), u = j(!1), d = _(() => o.value.find((e) => e.site_id === s.value)), f = _(() => n[t.page]), ee = _(() => t.runtime.hasPermission([
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
		let ie = B(t.runtime, re);
		pe(s, () => {
			!r || ne || (ie.invalidate(), ie = B(t.runtime, re, d.value?.space_id ?? null), a.value++);
		}, { flush: "sync" });
		function ae(e, n) {
			if (!p || t.runtime.mode === "white_label" && d.value?.space_id !== n) throw Error("站点已切换，请重新操作");
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
		le(z, {
			get mode() {
				return t.runtime.mode;
			},
			hasPermission: (e) => t.runtime.hasPermission(e),
			formatDateTime: (e) => t.runtime.formatDateTime(e),
			registerBeforeLeave: (e) => t.runtime.registerBeforeLeave?.(e),
			get request() {
				if (r) return ie.request;
				let e = d.value?.space_id;
				return {
					get: (n, r) => t.runtime.request.get(ae(n, e), r),
					post: (n, r) => t.runtime.request.post(ae(n, e), r)
				};
			}
		});
		async function m() {
			let e = await t.runtime.request.get({
				url: "/cms/sites",
				signal: te.signal
			});
			te.signal.aborted || (o.value = e.sites, o.value.some((e) => e.site_id === s.value) || (s.value = o.value[0]?.site_id ?? ""));
		}
		async function oe() {
			if (!d.value || u.value) return;
			let e = a.value;
			u.value = !0;
			try {
				let n = await t.runtime.request.post({
					url: "/cms/initialize",
					params: { site_id: d.value.site_id }
				}, { isOpenRetry: !1 });
				if (!p || r && e !== a.value) return;
				if (r) {
					if (!n.cms_context) throw Error("初始化接口未返回站点信息");
					ie.invalidate(), ie = B(t.runtime, re, n.cms_context.space_id), re(n.cms_context), a.value++;
				} else await m();
			} catch (e) {
				c.value = e instanceof Error ? e.message : "初始化失败";
			} finally {
				u.value = !1;
			}
		}
		return ce(async () => {
			if (t.runtime.mode === "white_label" && !r) try {
				await m();
			} catch {
				te.signal.aborted || (c.value = "加载站点失败，请刷新重试");
			} finally {
				l.value = !1;
			}
		}), se(() => {
			p = !1, ie.invalidate(), te.abort();
		}), (t, n) => (k(), b("section", { class: O(["mm-cms-page", { "is-viewport": e.viewport }]) }, [e.runtime.mode === "white_label" && e.showSiteSelector && (!P(r) || i.value) ? (k(), b("header", li, [x("label", null, [n[1] ||= S("内容站点 ", -1), me(x("select", {
			"onUpdate:modelValue": n[0] ||= (e) => s.value = e,
			disabled: l.value
		}, [(k(!0), b(g, null, ue(o.value, (e) => (k(), b("option", {
			key: e.site_id,
			value: e.site_id
		}, N(e.label), 9, di))), 128))], 8, ui), [[F, s.value]])]), n[2] ||= x("span", null, "各站点内容独立管理", -1)])) : y("", !0), c.value ? (k(), b("p", fi, N(c.value), 1)) : l.value ? (k(), b("p", pi, "正在加载站点…")) : e.runtime.mode === "white_label" && (!P(r) || i.value) && !d.value?.space_id ? (k(), b("div", mi, [x("p", null, N(d.value ? "该站点尚未初始化内容空间。" : "暂无可管理的内容站点。"), 1), d.value && ee.value ? (k(), b("button", {
			key: 0,
			type: "button",
			disabled: u.value,
			onClick: oe
		}, "初始化空内容空间", 8, hi)) : y("", !0)])) : (k(), v(M(f.value), { key: `${e.page}:${e.identityKey}:${P(r) ? a.value : d.value?.space_id ?? "platform"}` }))], 2));
	}
}), [["__scopeId", "data-v-f447749a"]]);
//#endregion
//#region src/cms/permission-tree.ts
function _i(e, t, n = "", r = 0) {
	let i = e.children ?? [], a = e.type === "C" && !!(e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:")), o = t(e), s = n ? `${n} / ${o}` : o, c = a || e.type === "M" && r > 0 ? s : n;
	return [...!i.length || a ? [{
		id: e.id,
		name: a || e.type === "A" && e.perms?.startsWith("cms_") ? s : o
	}] : [], ...i.flatMap((e) => _i(e, t, c, r + 1))];
}
function vi(e, t) {
	let n = new Set(t.map(String)), r = /* @__PURE__ */ new Set(), i = [];
	function a(e) {
		let t = e.children ?? [], o = (!t.length || e.type === "C" && (e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:"))) && n.has(String(e.id));
		for (let e of t) a(e) && (o = !0);
		return o && !r.has(String(e.id)) && (r.add(String(e.id)), i.push(e.id)), !!o;
	}
	return e.forEach(a), i;
}
//#endregion
export { gi as MmCmsPage, Ue as MmMediaUpload, _i as cmsPermissionItems, vi as cmsPermissionSubmission, c as createMediaUploader };

//# sourceMappingURL=cms.js.map