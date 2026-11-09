import { $r as e, A as t, Kn as n, O as r, Qr as i, Ui as a, Zr as o, _i as s, _r as c, a as l, ai as u, bn as d, gi as ee, ii as f, kr as te, pr as ne, vi as re, xi as p, yi as ie, yn as m } from "./src-BgBruoz9.js";
import { d as h, n as ae, u as g } from "./Loading-NM70IAOz.js";
import { Fragment as oe, computed as _, createBlock as v, createCommentVNode as y, createElementBlock as b, createElementVNode as x, createTextVNode as S, createVNode as C, defineComponent as w, inject as T, mergeProps as E, nextTick as D, normalizeClass as O, onBeforeUnmount as se, onMounted as ce, openBlock as k, provide as A, reactive as j, ref as M, renderList as le, resolveDynamicComponent as N, toDisplayString as P, unref as F, vModelSelect as ue, vModelText as de, vShow as I, watch as fe, withCtx as L, withDirectives as pe, withKeys as me, withModifiers as he } from "vue";
//#region src/cms/runtime.ts
var R = Symbol("MmCms");
function ge() {
	let e = T(R);
	if (!e) throw Error("CMS host adapter is missing");
	return e;
}
function _e(e) {
	ge().registerBeforeLeave?.(e);
}
//#endregion
//#region src/cms/site-transport.ts
function z(e, t, n) {
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
var B = ["aria-expanded", "aria-label"], V = {
	key: 1,
	class: "spacer",
	"aria-hidden": "true"
}, ve = /*#__PURE__*/ g(/* @__PURE__ */ w({
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
		}, [C(F(h), {
			name: e.expanded ? "chevron-down" : "chevron-right",
			size: 14
		}, null, 8, ["name"])], 8, B)) : (k(), b("span", V)), x("span", null, P(e.name), 1)], 2));
	}
}), [["__scopeId", "data-v-dd16b37d"]]);
//#endregion
//#region src/cms/views/content/categoryTree.ts
async function H(e, t) {
	let n = await e(1, 100), r = [...n.lists];
	for (let i = 2; i <= Math.ceil(n.count / 100); i++) t.throwIfAborted(), r.push(...(await e(i, 100)).lists);
	return {
		rows: r,
		total: r.length
	};
}
function U(e) {
	let t = M(/* @__PURE__ */ new Set()), n = _(() => {
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
function W() {
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
function G(e, t) {
	let n = ge().mode === "platform", r = j(n ? [{
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
		}, ee = (n = t.value) => {
			let r = d(n);
			a = s(r), e.query(r);
		}, f = (n) => {
			e.reset(n === void 0 ? void 0 : d(n)), a = s(t.value);
		};
		return fe(() => t.value.cms_source_type, (e) => {
			e === "platform" && (t.value.cms_tenant_id = ""), r[1].disabled = e === "platform";
		}, {
			immediate: !0,
			flush: "sync"
		}), fe([() => String(t.value.cms_source_type || ""), () => String(t.value.cms_tenant_id || "")], () => {
			l(t.value), u(), D(() => {
				!o && !c(a, s(t.value)) && ee();
			});
		}), {
			...e,
			query: ee,
			reset: f,
			proTableBindings: _(() => ({
				...e.proTableBindings.value,
				onQuery: ee,
				onReset: f
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
		return (e, t) => (k(), v(F(ee), {
			effect: "soft",
			round: "",
			size: "sm",
			type: a.value
		}, {
			default: L(() => [S(P(i.value), 1)]),
			_: 1
		}, 8, ["type"]));
	}
});
//#endregion
//#region src/cms/api/content/news.ts
function K() {
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
	}, { isOpenRetry: !1 }), s = l(e, `${t}/upload`), c = [
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
		newsPublishStates: c,
		newsCategoryLabel: u,
		newsError: d
	};
}
//#endregion
//#region src/cms/views/content/news/EnabledToggle.vue?vue&type=script&setup=true&lang.ts
var q = ["aria-checked", "disabled"], J = /*#__PURE__*/ g(/* @__PURE__ */ w({
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
		}, [x("span")], -1), x("span", null, P(e.modelValue ? "已启用" : "已停用"), 1)], 10, q));
	}
}), [["__scopeId", "data-v-8b527db1"]]), be = { class: "news-categories" }, Y = ["aria-busy"], xe = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Se = { class: "taxonomy-editor__field" }, X = { class: "taxonomy-editor__row" }, Z = "分类", Ce = /*#__PURE__*/ g(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { newsError: t, deleteNews: n, getNewsMetadata: r, getNewsList: i, getNewsDetail: s, saveNews: c } = K(), { hasPermission: l } = ge(), { formatDateTime: re } = ge(), g = (e) => l([`cms_news_category:${e}`]), oe = M(), w = M(), T = G(r, (e) => {
			oe.value = e;
		}), D = [
			{
				key: "name",
				dataIndex: "name",
				title: "分类名称",
				width: 210,
				hideable: !1
			},
			...W(),
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
				formatter: (e) => oe.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
				formatter: re
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
		], { proTableBindings: ce, rows: A, reload: le } = T.bindTable(te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: O,
			request: async ({ filters: e, signal: t, reason: n }) => {
				let r = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), a = await H((e, n) => i("categories", {
					...r,
					page_no: e,
					page_size: n
				}, t), t);
				return !t.aborted && (n === "query" || n === "reset") && (ue.value = Object.keys(r).length ? new Set(a.rows.filter((e) => e.parent_id != null).map((e) => String(e.parent_id))) : /* @__PURE__ */ new Set()), a;
			}
		})), { visibleRows: N, expanded: ue, groups: de, allExpanded: I, toggle: fe, toggleAll: pe } = U(A), me = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), R = j(me()), _e = M(!1), z = M(!1), B = M(!1), V = M(!1), q = M(!1), Ce = M(""), Q = M(!1), $ = M(""), we = M(!1), Te = _(() => !g(R.id ? "edit" : "add")), Ee = _(() => B.value || V.value), De = "", Oe;
		async function ke(e) {
			Oe?.abort(), Oe = new AbortController();
			let n = Oe;
			Object.assign(R, me(), { id: e || "" }), $.value = "", q.value = !1, Ce.value = "", Q.value = !1, _e.value = !0, z.value = !0, De = JSON.stringify(R);
			try {
				if (w.value = await r(n.signal, { cms_source_type: "platform" }), !e || n.signal.aborted) return;
				let t = await s("categories", e, n.signal);
				if (w.value = await r(n.signal, { space_id: String(t.space_id) }), n.signal.aborted) return;
				Object.assign(R, {
					id: t.id,
					row_version: t.row_version,
					name: t.name,
					code: t.code,
					parent_id: t.parent_id || "",
					sort_order: t.sort_order,
					is_enabled: t.is_enabled
				}), De = JSON.stringify(R);
			} catch (e) {
				n.signal.aborted || (Q.value = !0, $.value = t(e));
			} finally {
				n.signal.aborted || (z.value = !1);
			}
		}
		function Ae() {
			return Ee.value ? !1 : !z.value && !Q.value && JSON.stringify(R) !== De ? (we.value = !0, !1) : (Oe?.abort(), !0);
		}
		function je() {
			Ee.value || (Oe?.abort(), _e.value = !1);
		}
		function Me() {
			we.value = !1, _e.value = !1;
		}
		async function Ne() {
			if (!(Te.value || Ee.value || z.value || Q.value)) {
				if (!R.name.trim() || R.sort_order === null) {
					$.value = "请填写分类名称和排序";
					return;
				}
				B.value = !0, $.value = "";
				try {
					await c("categories", {
						name: R.name,
						parent_id: R.parent_id || null,
						sort_order: R.sort_order,
						is_enabled: R.is_enabled,
						id: R.id || void 0,
						row_version: R.id ? R.row_version : void 0
					}), _e.value = !1, u.success("保存成功"), await Promise.all([le(), Le()]);
				} catch (e) {
					$.value = t(e);
				} finally {
					B.value = !1;
				}
			}
		}
		function Pe() {
			!R.id || !g("delete") || Ee.value || z.value || Q.value || (Ce.value = "", q.value = !0);
		}
		async function Fe() {
			if (!(!q.value || !R.id || !g("delete") || Ee.value || z.value || Q.value)) {
				V.value = !0, Ce.value = "";
				try {
					await n("categories", R.id, R.row_version), q.value = !1, _e.value = !1, u.success("分类已删除"), await Promise.all([le(), Le()]);
				} catch (e) {
					Ce.value = t(e);
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
		}), (e, t) => (k(), b("div", be, [
			C(F(ne), E(F(ce), {
				"auto-refreshable": !1,
				columns: D,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Z}管理`,
				data: F(N),
				"show-pagination": !1
			}), {
				"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": L(() => [g("add") ? (k(), v(F(a), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: t[0] ||= (e) => ke()
				}, {
					icon: L(() => [C(F(h), {
						name: "plus",
						size: 14
					})]),
					default: L(() => [S("新增" + P(Z))]),
					_: 1
				})) : y("", !0), C(F(a), {
					size: "sm",
					disabled: !F(de).children.size,
					onClick: F(pe)
				}, {
					icon: L(() => [C(F(h), {
						name: F(I) ? "chevron-up" : "chevron-down",
						size: 14
					}, null, 8, ["name"])]),
					default: L(() => [S(" " + P(F(I) ? "全部收起" : "全部展开"), 1)]),
					_: 1
				}, 8, ["disabled", "onClick"])]),
				"cell-name": L(({ row: e }) => [C(ve, {
					name: e.name,
					child: e.parent_id != null,
					branch: F(de).children.has(e.id),
					expanded: F(ue).has(e.id),
					onToggle: (t) => F(fe)(e.id)
				}, null, 8, [
					"name",
					"child",
					"branch",
					"expanded",
					"onToggle"
				])]),
				"cell-is_enabled": L(({ row: e }) => [C(F(ee), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: L(() => [S(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": L(({ row: e }) => [C(F(a), {
					size: "sm",
					"icon-only": "",
					title: g("edit") ? `编辑${Z}` : `${Z}详情`,
					"aria-label": `编辑${Z}`,
					onClick: (t) => ke(e.id)
				}, {
					default: L(() => [C(F(h), {
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
			C(F(p), {
				modelValue: _e.value,
				"onUpdate:modelValue": t[5] ||= (e) => _e.value = e,
				title: `${R.id ? "编辑" : "新增"}新闻${Z}`,
				width: "680px",
				subtitle: "新闻分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Ae
			}, {
				footer: L(() => [
					R.id && g("delete") ? (k(), v(F(a), {
						key: 0,
						variant: "danger",
						disabled: z.value || Q.value || Ee.value,
						onClick: Pe
					}, {
						icon: L(() => [C(F(h), {
							name: "trash-2",
							size: 14
						})]),
						default: L(() => [t[11] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(F(a), {
						disabled: Ee.value,
						onClick: je
					}, {
						default: L(() => [...t[12] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Te.value ? y("", !0) : (k(), v(F(a), {
						key: 1,
						variant: "primary",
						loading: B.value,
						disabled: z.value || Q.value || V.value,
						onClick: Ne
					}, {
						default: L(() => [S("保存" + P(Z))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: L(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": z.value
				}, [
					z.value ? (k(), b("div", xe, [C(F(h), {
						name: "loader-circle",
						class: "news-spin",
						size: 24
					}), x("span", null, "正在读取" + P(Z) + "...")])) : y("", !0),
					$.value ? (k(), v(F(f), {
						key: 1,
						type: "error",
						closable: !1,
						description: $.value
					}, null, 8, ["description"])) : y("", !0),
					!z.value && !Q.value ? (k(), v(F(d), {
						key: 2,
						model: R,
						"label-position": "top",
						onSubmit: he(Ne, ["prevent"])
					}, {
						default: L(() => [
							R.id ? (k(), v(F(m), {
								key: 0,
								label: "分类ID"
							}, {
								default: L(() => [C(F(ae), {
									"model-value": R.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : y("", !0),
							C(F(m), {
								label: `${Z}名称`,
								required: ""
							}, {
								default: L(() => [C(F(ae), {
									modelValue: R.name,
									"onUpdate:modelValue": t[1] ||= (e) => R.name = e,
									maxlength: 120,
									disabled: Te.value || Ee.value,
									"aria-label": `${Z}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							C(F(m), { label: "父分类" }, {
								default: L(() => [x("div", Se, [C(F(ie), {
									modelValue: R.parent_id,
									"onUpdate:modelValue": t[2] ||= (e) => R.parent_id = e,
									options: Ie.value,
									disabled: Te.value || Ee.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), t[10] ||= x("p", { class: "news-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类新闻。 ", -1)])]),
								_: 1
							}),
							x("div", X, [C(F(m), {
								label: "前端排序",
								required: ""
							}, {
								default: L(() => [C(F(o), {
									modelValue: R.sort_order,
									"onUpdate:modelValue": t[3] ||= (e) => R.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Te.value || Ee.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(F(m), { label: "启用状态" }, {
								default: L(() => [C(J, {
									modelValue: R.is_enabled,
									"onUpdate:modelValue": t[4] ||= (e) => R.is_enabled = e,
									disabled: Te.value || Ee.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : y("", !0)
				], 8, Y)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(F(p), {
				modelValue: q.value,
				"onUpdate:modelValue": t[7] ||= (e) => q.value = e,
				title: "删除新闻分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !V.value
			}, {
				footer: L(() => [C(F(a), {
					disabled: V.value,
					onClick: t[6] ||= (e) => q.value = !1
				}, {
					default: L(() => [...t[13] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(a), {
					variant: "danger",
					loading: V.value,
					onClick: Fe
				}, {
					default: L(() => [...t[14] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: L(() => [x("p", null, "确认删除分类“" + P(R.name) + "”？有关联新闻或子分类的分类无法删除。", 1), Ce.value ? (k(), v(F(f), {
					key: 0,
					type: "error",
					closable: !1,
					description: Ce.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(F(p), {
				modelValue: we.value,
				"onUpdate:modelValue": t[9] ||= (e) => we.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: L(() => [C(F(a), { onClick: t[8] ||= (e) => we.value = !1 }, {
					default: L(() => [...t[15] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(F(a), {
					variant: "primary",
					onClick: Me
				}, {
					default: L(() => [...t[16] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-ae27f13a"]]), Q = {
	news: "新闻",
	help: "文章",
	announcement: "公告"
}, $ = [
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
	let a = {}, o = Q[n];
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
	let n = {}, r = [], i = Q[t], a = {
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
			let i = $.includes(s) ? s : e === t ? a[o] : void 0;
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
	let i = M(), a = M(), o = M(null), s = M(Date.now()), c = j({}), l = M(""), u = Object.fromEntries($.map((e) => [e, {
		required: e === "title" || e === "category_id",
		trigger: "submit"
	}])), d = _(() => o.value ? we(e, t(), n, o.value === "draft" ? "draft" : e.scheduled_local ? "scheduled" : "published", s.value) : {}), ee = _(() => ({
		...c,
		...d.value
	})), f = _(() => Object.keys(ee.value).length);
	for (let t of $) fe(() => e[t], () => {
		delete c[t], l.value = "", s.value = Date.now();
	}, { deep: !0 });
	function te() {
		ee.value.seo_description && a.value?.focus();
	}
	async function ne() {
		await D();
		let e = [...i.value?.querySelectorAll("[data-prop]") || []].find((e) => ee.value[e.dataset.prop]);
		if (!e && ee.value.seo_description) {
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
		for (let e of $) delete c[e];
		return f.value ? (await ne(), !1) : !0;
	}
	function p(e) {
		let t = Te(e, n);
		Object.assign(c, t.fields), l.value = t.general;
	}
	return {
		editorRoot: i,
		seoInput: a,
		fieldRules: u,
		fieldErrors: ee,
		pendingCount: f,
		saveError: l,
		validateSave: re,
		setSaveFailure: p,
		focusFirstError: ne,
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
}, He = /*#__PURE__*/ g(/* @__PURE__ */ w({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: n }) {
		let { newsError: i, newsCategoryLabel: s, deleteNews: c, getNewsDetail: l, getNewsMetadata: ee, saveNews: te, uploadNewsCover: ne } = K(), { hasPermission: re } = ge(), g = t, w = n, T = M(!0), E = M(!1), D = M(!1), O = M(""), A = M(!1), le = M(!1), N = M(!1), ue = M(!1), I = M(ge().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), fe = M(), me = M("draft"), R = M(!1), z = _(() => re(["cms_news:publish"])), B = _(() => !re([`cms_news:${g.articleId ? "edit" : "add"}`]) || !z.value && me.value !== "draft"), V = _(() => re(["cms_news:delete"]) && (z.value || me.value === "draft"));
		async function ve() {
			if (!(!V.value || E.value || T.value || D.value)) {
				E.value = !0, O.value = "";
				try {
					await c("articles", U.id, U.row_version), we = JSON.stringify(U), u.success("新闻已删除"), w("saved");
				} catch (e) {
					O.value = i(e), ue.value = !1;
				} finally {
					E.value = !1;
				}
			}
		}
		let H = _(() => B.value || E.value), U = j({
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
		}), { editorRoot: W, seoInput: G, fieldRules: ye, fieldErrors: q, pendingCount: be, saveError: Y, validateSave: xe, setSaveFailure: Se, focusFirstError: X, focusSeoError: Z } = Ee(U, () => fe.value?.categories || [], "news", A), Ce = _(() => (fe.value?.categories || []).filter((e) => e.parent_id != null).map((e) => ({
			label: s(fe.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), Q = _(() => fe.value?.categories.find((e) => e.id === U.category_id && e.parent_id == null)), $ = _({
			get: () => Q.value ? "" : U.category_id,
			set: (e) => {
				U.category_id = e;
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
			T.value = !0, D.value = !1, O.value = "";
			try {
				if (fe.value = await ee(e.signal, { cms_source_type: "platform" }), g.articleId) {
					let t = await l("articles", g.articleId, e.signal);
					if (fe.value = await ee(e.signal, { space_id: String(t.space_id) }), I.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					U.scheduled_local = t.publish_status === "scheduled" ? He(t.scheduled_at) : "", me.value = t.publish_status;
				}
				we = JSON.stringify(U);
			} catch (t) {
				e.signal.aborted || (O.value = i(t), D.value = !0);
			} finally {
				e.signal.aborted || (T.value = !1);
			}
		}
		let We = () => !T.value && !D.value && we !== JSON.stringify(U);
		function Ge() {
			We() ? le.value = !0 : w("close");
		}
		function Ke() {
			me.value === "draft" ? Je("draft") : N.value = !0;
		}
		function qe() {
			N.value = !1, Je("draft");
		}
		async function Je(e) {
			if (H.value || T.value || D.value || R.value || (O.value = "", !await xe(e))) return;
			let t = U.scheduled_local ? new Date(U.scheduled_local) : null;
			E.value = !0, O.value = "";
			try {
				await te("articles", {
					...U,
					id: U.id || void 0,
					row_version: U.id ? U.row_version : void 0,
					category_id: U.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), we = JSON.stringify(U), u.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "新闻已发布"), w("saved");
			} catch (e) {
				Se(e);
			} finally {
				E.value = !1;
			}
			be.value && await X();
		}
		function Ye(e) {
			O.value = i(e);
		}
		let Xe = (e) => {
			We() && (e.preventDefault(), e.returnValue = "");
		};
		return _e(() => !E.value && !R.value && (!We() || window.confirm("新闻有未保存的修改，确定离开？"))), ce(() => {
			Ue(), window.addEventListener("beforeunload", Xe);
		}), se(() => {
			Te?.abort(), window.removeEventListener("beforeunload", Xe);
		}), (n, i) => (k(), b("section", {
			ref_key: "editorRoot",
			ref: W,
			class: "article-editor",
			"aria-busy": T.value || E.value
		}, [
			x("header", Oe, [
				C(F(a), {
					"icon-only": "",
					title: "返回新闻列表",
					"aria-label": "返回新闻列表",
					disabled: E.value || R.value,
					onClick: Ge
				}, {
					default: L(() => [C(F(h), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", ke, [x("h2", null, P(t.articleId ? "编辑新闻" : "新增新闻"), 1), x("span", null, P(fe.value?.source_locale || "zh-CN") + " · " + P(I.value), 1)]),
				x("div", Ae, [
					t.articleId && V.value ? (k(), v(F(a), {
						key: 0,
						size: "sm",
						disabled: T.value || D.value || E.value || R.value,
						onClick: i[0] ||= (e) => ue.value = !0
					}, {
						default: L(() => [...i[28] ||= [S("删除新闻", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(F(a), {
						size: "sm",
						disabled: T.value || D.value,
						onClick: i[1] ||= (e) => A.value = !0
					}, {
						icon: L(() => [C(F(h), {
							name: "search",
							size: 14
						})]),
						default: L(() => [i[29] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					B.value ? y("", !0) : (k(), v(F(a), {
						key: 1,
						size: "sm",
						disabled: T.value || D.value || E.value || R.value,
						onClick: Ke
					}, {
						icon: L(() => [C(F(h), {
							name: "save",
							size: 14
						})]),
						default: L(() => [i[30] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					F(Y) ? (k(), b("span", je, P(F(Y)), 1)) : y("", !0),
					!B.value && F(be) ? (k(), b("span", Me, "还有 " + P(F(be)) + " 项待完善", 1)) : y("", !0),
					!B.value && z.value ? (k(), v(F(a), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: T.value || D.value || R.value,
						loading: E.value,
						onClick: i[2] ||= (e) => Je(U.scheduled_local ? "scheduled" : "published")
					}, {
						icon: L(() => [C(F(h), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: L(() => [S(P(U.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)
				])
			]),
			T.value ? (k(), b("div", Ne, [C(F(h), {
				name: "loader-circle",
				class: "news-spin",
				size: 28
			}), i[31] ||= x("span", null, "正在读取新闻资料...", -1)])) : D.value ? (k(), b("div", Pe, [C(F(f), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"]), C(F(a), { onClick: Ue }, {
				default: L(() => [...i[32] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (k(), b(oe, { key: 2 }, [O.value ? (k(), b("div", Fe, [C(F(f), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"])])) : y("", !0), x("div", Ie, [x("aside", Le, [C(F(d), {
				model: U,
				rules: F(ye),
				"label-position": "top",
				onSubmit: i[12] ||= he(() => {}, ["prevent"])
			}, {
				default: L(() => [
					C(F(m), {
						label: "新闻分类",
						prop: "category_id",
						error: F(q).category_id,
						required: ""
					}, {
						default: L(() => [C(F(ie), {
							modelValue: $.value,
							"onUpdate:modelValue": i[3] ||= (e) => $.value = e,
							options: Ce.value,
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
					i[33] ||= x("h3", null, "新闻设置", -1),
					C(F(m), {
						label: "新闻封面",
						prop: "cover_url",
						error: F(q).cover_url
					}, {
						default: L(() => [C(e, {
							modelValue: U.cover_url,
							"onUpdate:modelValue": i[4] ||= (e) => U.cover_url = e,
							label: "新闻封面",
							disabled: H.value,
							upload: F(ne),
							onBusyChange: i[5] ||= (e) => R.value = e,
							onStart: i[6] ||= (e) => O.value = "",
							onError: Ye
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "内容来源",
						prop: "content_source",
						error: F(q).content_source
					}, {
						default: L(() => [C(F(ae), {
							modelValue: U.content_source,
							"onUpdate:modelValue": i[7] ||= (e) => U.content_source = e,
							maxlength: 160,
							disabled: H.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "作者署名",
						prop: "author_name",
						error: F(q).author_name
					}, {
						default: L(() => [C(F(ae), {
							modelValue: U.author_name,
							"onUpdate:modelValue": i[8] ||= (e) => U.author_name = e,
							maxlength: 120,
							disabled: H.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "前端排序",
						prop: "sort_order",
						error: F(q).sort_order
					}, {
						default: L(() => [C(F(o), {
							modelValue: U.sort_order,
							"onUpdate:modelValue": i[9] ||= (e) => U.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: H.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[34] ||= x("h3", null, "发布设置", -1),
					C(F(m), {
						label: "启用状态",
						prop: "is_enabled",
						error: F(q).is_enabled
					}, {
						default: L(() => [C(J, {
							modelValue: U.is_enabled,
							"onUpdate:modelValue": i[10] ||= (e) => U.is_enabled = e,
							disabled: H.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: F(q).scheduled_local
					}, {
						default: L(() => [C(F(ae), {
							modelValue: U.scheduled_local,
							"onUpdate:modelValue": i[11] ||= (e) => U.scheduled_local = e,
							type: "datetime-local",
							disabled: H.value || !z.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[35] ||= x("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", Re, [C(F(d), {
				model: U,
				rules: F(ye),
				"label-position": "top",
				onSubmit: i[16] ||= he(() => {}, ["prevent"])
			}, {
				default: L(() => [
					C(F(m), {
						label: "标题",
						prop: "title",
						error: F(q).title,
						required: ""
					}, {
						default: L(() => [C(F(ae), {
							modelValue: U.title,
							"onUpdate:modelValue": i[13] ||= (e) => U.title = e,
							maxlength: 255,
							disabled: H.value,
							placeholder: "输入新闻标题",
							"aria-label": "新闻标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "摘要",
						prop: "summary",
						error: F(q).summary
					}, {
						default: L(() => [pe(x("textarea", {
							"onUpdate:modelValue": i[14] ||= (e) => U.summary = e,
							"aria-invalid": !!F(q).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: H.value,
							"aria-label": "新闻摘要"
						}, null, 8, ze), [[de, U.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "正文",
						prop: "body_html",
						error: F(q).body_html
					}, {
						default: L(() => [C(F(r), {
							modelValue: U.body_html,
							"onUpdate:modelValue": i[15] ||= (e) => U.body_html = e,
							readonly: B.value,
							disabled: E.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "新闻正文"
						}, {
							"image-upload": L(({ url: t, setUrl: n, setBusy: r }) => [C(e, {
								label: "正文图片",
								"model-value": t,
								upload: F(ne),
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
			C(F(p), {
				modelValue: A.value,
				"onUpdate:modelValue": i[20] ||= (e) => A.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: L(() => [C(F(a), {
					variant: "primary",
					onClick: i[19] ||= (e) => A.value = !1
				}, {
					default: L(() => [...i[36] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: L(() => [C(F(d), {
					model: U,
					rules: F(ye),
					"label-position": "top",
					onSubmit: i[18] ||= he(() => {}, ["prevent"])
				}, {
					default: L(() => [C(F(m), {
						label: "SEO 描述",
						prop: "seo_description",
						error: F(q).seo_description
					}, {
						default: L(() => [pe(x("textarea", {
							ref_key: "seoInput",
							ref: G,
							"onUpdate:modelValue": i[17] ||= (e) => U.seo_description = e,
							"aria-invalid": !!F(q).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: H.value,
							"aria-label": "SEO 描述"
						}, null, 8, Be), [[de, U.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(F(p), {
				modelValue: ue.value,
				"onUpdate:modelValue": i[22] ||= (e) => ue.value = e,
				title: "确认删除",
				subtitle: `操作对象：${U.title || "未命名新闻"}`,
				width: "460px",
				"panel-class": "news-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !E.value
			}, {
				"header-actions": L(() => [x("span", Ve, [C(F(h), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: L(() => [C(F(a), {
					disabled: E.value,
					onClick: i[21] ||= (e) => ue.value = !1
				}, {
					default: L(() => [...i[37] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(a), {
					variant: "warning",
					loading: E.value,
					onClick: ve
				}, {
					default: L(() => [...i[38] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: L(() => [C(F(f), {
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
			C(F(p), {
				modelValue: le.value,
				"onUpdate:modelValue": i[25] ||= (e) => le.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: L(() => [C(F(a), { onClick: i[23] ||= (e) => le.value = !1 }, {
					default: L(() => [...i[39] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(F(a), {
					variant: "primary",
					onClick: i[24] ||= (e) => w("close")
				}, {
					default: L(() => [...i[40] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(F(p), {
				modelValue: N.value,
				"onUpdate:modelValue": i[27] ||= (e) => N.value = e,
				title: "将新闻转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: L(() => [C(F(a), { onClick: i[26] ||= (e) => N.value = !1 }, {
					default: L(() => [...i[41] ||= [S("取消", -1)]]),
					_: 1
				}), C(F(a), {
					variant: "primary",
					onClick: qe
				}, {
					default: L(() => [...i[42] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, De));
	}
}), [["__scopeId", "data-v-33394e7e"]]), Ue = { class: "news-articles" }, We = /*#__PURE__*/ g(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { newsPublishStates: t, newsCategoryLabel: n, getNewsList: r, getNewsMetadata: i } = K(), { hasPermission: o } = ge(), { formatDateTime: s } = ge(), c = M(!1), l = M(), u = (e) => o([`cms_news:${e}`]), d = M(), f = G(i, (e) => {
			d.value = e;
		}), re = [
			...W(),
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
				formatter: (e) => n(d.value, e)
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
		], p = _(() => [
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
					label: n(d.value, e.id),
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
		]), { proTableBindings: ie, reload: m } = f.bindTable(te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: p,
			request: async ({ filters: e, page: t, pageSize: n, signal: i }) => {
				let a = Object.fromEntries(Object.entries(e).filter(([e, t]) => e !== "publish_range" && t !== "" && t != null)), o = e.publish_range;
				Array.isArray(o) && o.length === 2 && (a.published_from = (/* @__PURE__ */ new Date(`${o[0]}T00:00:00`)).toISOString(), a.published_to = (/* @__PURE__ */ new Date(`${o[1]}T23:59:59.999`)).toISOString());
				let s = await r("articles", {
					...a,
					page_no: t,
					page_size: n
				}, i);
				return {
					rows: s.lists,
					total: s.count
				};
			}
		})), ae = f.loadMetadata;
		function g(e) {
			l.value = e, c.value = !0;
		}
		function oe() {
			c.value = !1, m(), ae();
		}
		return (e, n) => (k(), b("div", Ue, [c.value ? (k(), v(He, {
			key: 0,
			"article-id": l.value,
			onClose: n[0] ||= (e) => c.value = !1,
			onSaved: oe
		}, null, 8, ["article-id"])) : y("", !0), pe(C(F(ne), E(F(ie), {
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
			"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": L(() => [u("add") ? (k(), v(F(a), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: n[1] ||= (e) => g()
			}, {
				icon: L(() => [C(F(h), {
					name: "plus",
					size: 14
				})]),
				default: L(() => [n[2] ||= S("新增新闻", -1)]),
				_: 1
			})) : y("", !0)]),
			"cell-publish_status": L(({ row: e }) => [C(F(ee), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: L(() => [S(P(F(t).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": L(({ row: e }) => [C(F(ee), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: L(() => [S(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": L(({ row: e }) => [S(P(F(s)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": L(({ row: e }) => [C(F(a), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑新闻" : "新闻详情",
				"aria-label": u("edit") ? "编辑新闻" : "新闻详情",
				onClick: (t) => g(e.id)
			}, {
				default: L(() => [C(F(h), {
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
}, Je = { class: "taxonomy-editor__row" }, Ye = "分类", Xe = /*#__PURE__*/ g(/* @__PURE__ */ w({
	__name: "CategoryTable",
	setup(e) {
		let { hasPermission: t } = ge(), { formatDateTime: r } = ge(), { academyDifficulties: i, academyError: s, getAcademyList: c, getAcademyMetadata: l, getAcademyDetail: re, saveAcademy: ie, deleteAcademyCategory: g } = Ge(), w = (e) => t([`cms_academy_category:${e}`]), T = G(l), D = [
			...W(),
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
				key: "difficulty_level",
				label: "难度范围",
				type: "select",
				width: 160,
				defaultValue: "",
				options: [{
					label: "全部",
					value: ""
				}, ...i]
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
		], { proTableBindings: ce, reload: A, currentPage: le, pageSize: N, total: ue } = T.bindTable(te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: O,
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
		}), I = j(de()), fe = M(!1), pe = M(!1), me = M(!1), R = M(!1), _e = M(!1), z = M(""), B = M(!1), V = M(""), ve = M(!1), H = _(() => !w(I.id ? "edit" : "add")), U = _(() => me.value || R.value), K = "", q;
		async function J(e) {
			q?.abort(), q = new AbortController();
			let t = q;
			if (Object.assign(I, de(), { id: e || "" }), V.value = "", _e.value = !1, z.value = "", B.value = !1, fe.value = !0, pe.value = !!e, K = JSON.stringify(I), e) try {
				let n = await re("categories", e, t.signal);
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
				}), K = JSON.stringify(I);
			} catch (e) {
				t.signal.aborted || (B.value = !0, V.value = s(e));
			} finally {
				t.signal.aborted || (pe.value = !1);
			}
		}
		function be() {
			return U.value ? !1 : !pe.value && !B.value && JSON.stringify(I) !== K ? (ve.value = !0, !1) : (q?.abort(), !0);
		}
		function Y() {
			U.value || (q?.abort(), fe.value = !1);
		}
		function xe() {
			ve.value = !1, fe.value = !1;
		}
		async function Se() {
			if (!(H.value || U.value || pe.value || B.value)) {
				if (!I.name.trim() || I.sort_order === null) {
					V.value = "请填写名称和排序";
					return;
				}
				me.value = !0, V.value = "";
				try {
					await ie("categories", {
						...I,
						id: I.id || void 0,
						row_version: I.id ? I.row_version : void 0
					}), fe.value = !1, u.success("保存成功"), await A();
				} catch (e) {
					V.value = s(e);
				} finally {
					me.value = !1;
				}
			}
		}
		function X() {
			!I.id || !w("delete") || U.value || pe.value || B.value || (z.value = "", _e.value = !0);
		}
		async function Z() {
			if (!(!_e.value || !I.id || !w("delete") || U.value || pe.value || B.value)) {
				R.value = !0, z.value = "";
				try {
					await g({
						id: I.id,
						row_version: I.row_version
					}), _e.value = !1, fe.value = !1, u.success("分类已删除"), await A(), le.value = Math.min(le.value, Math.max(1, Math.ceil(ue.value / N.value)));
				} catch (e) {
					z.value = s(e);
				} finally {
					R.value = !1;
				}
			}
		}
		return se(() => q?.abort()), (e, t) => (k(), b(oe, null, [
			C(F(ne), E(F(ce), {
				"auto-refreshable": !1,
				columns: D,
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
				"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": L(() => [w("add") ? (k(), v(F(a), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: t[0] ||= (e) => J()
				}, {
					icon: L(() => [C(F(h), {
						name: "plus",
						size: 14
					})]),
					default: L(() => [S("新增" + P(Ye))]),
					_: 1
				})) : y("", !0)]),
				"cell-is_enabled": L(({ row: e }) => [C(F(ee), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: L(() => [S(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": L(({ row: e }) => [C(F(a), {
					size: "sm",
					"icon-only": "",
					title: w("edit") ? `编辑${Ye}` : `${Ye}详情`,
					"aria-label": `编辑${Ye}`,
					onClick: (t) => J(e.id)
				}, {
					default: L(() => [C(F(h), {
						name: w("edit") ? "square-pen" : "panel-right-open",
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
			C(F(p), {
				modelValue: fe.value,
				"onUpdate:modelValue": t[4] ||= (e) => fe.value = e,
				title: `${I.id ? "编辑" : "新增"}课程${Ye}`,
				width: "620px",
				"close-on-click-modal": !1,
				"before-close": be
			}, {
				footer: L(() => [
					I.id && w("delete") ? (k(), v(F(a), {
						key: 0,
						variant: "danger",
						disabled: pe.value || B.value || U.value,
						onClick: X
					}, {
						icon: L(() => [C(F(h), {
							name: "trash-2",
							size: 14
						})]),
						default: L(() => [t[9] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(F(a), {
						disabled: U.value,
						onClick: Y
					}, {
						default: L(() => [...t[10] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					H.value ? y("", !0) : (k(), v(F(a), {
						key: 1,
						variant: "primary",
						loading: me.value,
						disabled: pe.value || B.value || R.value,
						onClick: Se
					}, {
						default: L(() => [S("保存" + P(Ye))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: L(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": pe.value
				}, [
					pe.value ? (k(), b("div", qe, [C(F(h), {
						name: "loader-circle",
						class: "academy-spin",
						size: 24
					}), x("span", null, "正在读取" + P(Ye) + "...")])) : y("", !0),
					V.value ? (k(), v(F(f), {
						key: 1,
						type: "error",
						closable: !1,
						description: V.value
					}, null, 8, ["description"])) : y("", !0),
					!pe.value && !B.value ? (k(), v(F(d), {
						key: 2,
						model: I,
						"label-position": "top",
						onSubmit: he(Se, ["prevent"])
					}, {
						default: L(() => [C(F(m), {
							label: `${Ye}名称`,
							required: ""
						}, {
							default: L(() => [C(F(ae), {
								modelValue: I.name,
								"onUpdate:modelValue": t[1] ||= (e) => I.name = e,
								maxlength: 120,
								disabled: H.value || U.value,
								"aria-label": `${Ye}名称`
							}, null, 8, [
								"modelValue",
								"disabled",
								"aria-label"
							])]),
							_: 1
						}, 8, ["label"]), x("div", Je, [C(F(m), {
							label: "前端排序",
							required: ""
						}, {
							default: L(() => [C(F(o), {
								modelValue: I.sort_order,
								"onUpdate:modelValue": t[2] ||= (e) => I.sort_order = e,
								min: 0,
								max: 2147483647,
								precision: 0,
								disabled: H.value || U.value,
								"aria-label": "前端排序"
							}, null, 8, ["modelValue", "disabled"])]),
							_: 1
						}), C(F(m), { label: "启用状态" }, {
							default: L(() => [C(F(n), {
								modelValue: I.is_enabled,
								"onUpdate:modelValue": t[3] ||= (e) => I.is_enabled = e,
								disabled: H.value || U.value,
								label: "已启用",
								"aria-label": "启用状态"
							}, null, 8, ["modelValue", "disabled"])]),
							_: 1
						})])]),
						_: 1
					}, 8, ["model"])) : y("", !0)
				], 8, Ke)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(F(p), {
				modelValue: _e.value,
				"onUpdate:modelValue": t[6] ||= (e) => _e.value = e,
				title: "删除课程分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !R.value
			}, {
				footer: L(() => [C(F(a), {
					disabled: R.value,
					onClick: t[5] ||= (e) => _e.value = !1
				}, {
					default: L(() => [...t[11] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(a), {
					variant: "danger",
					loading: R.value,
					onClick: Z
				}, {
					default: L(() => [...t[12] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: L(() => [x("p", null, "确认删除分类“" + P(I.name) + "”？有关联课程的分类无法删除。", 1), z.value ? (k(), v(F(f), {
					key: 0,
					type: "error",
					closable: !1,
					description: z.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(F(p), {
				modelValue: ve.value,
				"onUpdate:modelValue": t[8] ||= (e) => ve.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: L(() => [C(F(a), { onClick: t[7] ||= (e) => ve.value = !1 }, {
					default: L(() => [...t[13] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(F(a), {
					variant: "primary",
					onClick: xe
				}, {
					default: L(() => [...t[14] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 64));
	}
}), [["__scopeId", "data-v-e36abb56"]]), Ze = { class: "academy-categories" }, Qe = /*#__PURE__*/ g(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		return (e, t) => (k(), b("div", Ze, [C(Xe)]));
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
}, bt = /*#__PURE__*/ g(/* @__PURE__ */ w({
	__name: "CourseEditor",
	props: { courseId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: i }) {
		let { hasPermission: s } = ge(), { academyDifficulties: c, academyError: l, deleteAcademyCourse: ee, getAcademyDetail: te, getAcademyMetadata: ne, saveAcademy: re, uploadAcademyCover: g } = Ge(), oe = t, w = i, T = M(!0), E = M(!1), O = M(!1), A = M(""), le = M(!1), N = M(!1), ue = M(!1), I = M(ge().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), me = M(), R = M("draft"), z = M(!1), B = M(!1), V = M(""), ve = _(() => s(["cms_academy:publish"])), H = _(() => !!oe.courseId && s(["cms_academy:delete"]) && (ve.value || R.value === "draft")), U = _(() => !s([`cms_academy:${oe.courseId ? "edit" : "add"}`]) || !ve.value && R.value !== "draft"), W = _(() => U.value || E.value), G = j({
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
		}), ye = M(), K = M(), q = M(null), J = M(Date.now()), be = j({}), Y = M(""), xe = Object.fromEntries($e.map((e) => [e, {
			required: e === "title" || e === "category_ids",
			trigger: "submit"
		}])), Se = _(() => q.value ? nt(G, me.value?.categories || [], q.value === "draft" ? "draft" : G.scheduled_local ? "scheduled" : "published", J.value) : {}), X = _(() => ({
			...be,
			...Se.value
		})), Z = _(() => Object.keys(X.value).length);
		for (let e of $e) fe(() => G[e], () => {
			delete be[e], Y.value = "", J.value = Date.now();
		}, { deep: !0 });
		function Ce() {
			X.value.seo_description && K.value?.focus();
		}
		async function Q() {
			await D();
			let e = [...ye.value?.querySelectorAll("[data-prop]") || []].find((e) => X.value[e.dataset.prop]);
			if (!e && X.value.seo_description) {
				le.value ? Ce() : le.value = !0;
				return;
			}
			e && (e.scrollIntoView({
				block: "center",
				behavior: "auto"
			}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
		}
		let $ = _(() => (me.value?.categories || []).map((e) => ({
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
			T.value = !0, O.value = !1, A.value = "";
			try {
				if (me.value = await ne(e.signal, { cms_source_type: "platform" }), oe.courseId) {
					let t = await te("courses", oe.courseId, e.signal);
					if (me.value = await ne(e.signal, { space_id: String(t.space_id) }), I.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"category_ids",
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
					G.scheduled_local = t.publish_status === "scheduled" ? Ee(t.scheduled_at) : "", R.value = t.publish_status;
				}
				we = JSON.stringify(G);
			} catch (t) {
				e.signal.aborted || (A.value = l(t), O.value = !0);
			} finally {
				e.signal.aborted || (T.value = !1);
			}
		}
		let Oe = () => !T.value && !O.value && we !== JSON.stringify(G);
		function ke() {
			Oe() ? N.value = !0 : w("close");
		}
		function Ae() {
			R.value === "draft" ? Me("draft") : ue.value = !0;
		}
		function je() {
			ue.value = !1, Me("draft");
		}
		async function Me(e) {
			if (W.value || T.value || O.value || z.value) return;
			q.value = e === "draft" ? "draft" : "publish", J.value = Date.now(), Y.value = "";
			for (let e of $e) delete be[e];
			if (Z.value) {
				await Q();
				return;
			}
			let t = G.scheduled_local ? new Date(G.scheduled_local) : null;
			E.value = !0, A.value = "";
			try {
				await re("courses", {
					...G,
					id: G.id || void 0,
					row_version: G.id ? G.row_version : void 0,
					difficulty_level: G.difficulty_level || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), we = JSON.stringify(G), u.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "课程已发布"), w("saved");
			} catch (e) {
				let t = it(e);
				Object.assign(be, t.fields), Y.value = t.general;
			} finally {
				E.value = !1;
			}
			Z.value && await Q();
		}
		function Ne() {
			V.value = "", B.value = !0;
		}
		async function Pe() {
			if (!(!H.value || T.value || O.value || E.value || z.value)) {
				E.value = !0, V.value = "";
				try {
					await ee({
						id: G.id,
						row_version: G.row_version
					}), we = JSON.stringify(G), B.value = !1, u.success("课程已删除"), w("saved");
				} catch (e) {
					V.value = l(e);
				} finally {
					E.value = !1;
				}
			}
		}
		function Fe(e) {
			be.cover_url = l(e);
		}
		function Ie() {
			delete be.cover_url;
		}
		let Le = (e) => {
			Oe() && (e.preventDefault(), e.returnValue = "");
		};
		return _e(() => !E.value && !z.value && (!Oe() || window.confirm("课程有未保存的修改，确定离开？"))), ce(() => {
			De(), window.addEventListener("beforeunload", Le);
		}), se(() => {
			Te?.abort(), window.removeEventListener("beforeunload", Le);
		}), (i, s) => (k(), b("section", {
			ref_key: "editorRoot",
			ref: ye,
			class: "course-editor",
			"aria-busy": T.value || E.value
		}, [
			x("header", ot, [
				C(F(a), {
					"icon-only": "",
					title: "返回课程列表",
					"aria-label": "返回课程列表",
					disabled: E.value || z.value,
					onClick: ke
				}, {
					default: L(() => [C(F(h), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", st, [x("h2", null, P(t.courseId ? "编辑课程" : "新增课程"), 1), x("span", null, P(me.value?.source_locale || "zh-CN") + " · " + P(I.value), 1)]),
				x("div", ct, [
					H.value ? (k(), v(F(a), {
						key: 0,
						variant: "danger",
						size: "sm",
						disabled: T.value || O.value || E.value || z.value,
						onClick: Ne
					}, {
						default: L(() => [...s[26] ||= [S("删除课程", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(F(a), {
						size: "sm",
						disabled: T.value || O.value,
						onClick: s[0] ||= (e) => le.value = !0
					}, {
						icon: L(() => [C(F(h), {
							name: "search",
							size: 14
						})]),
						default: L(() => [s[27] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					U.value ? y("", !0) : (k(), v(F(a), {
						key: 1,
						size: "sm",
						disabled: T.value || O.value || E.value || z.value,
						onClick: Ae
					}, {
						icon: L(() => [C(F(h), {
							name: "save",
							size: 14
						})]),
						default: L(() => [s[28] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					Y.value ? (k(), b("span", lt, P(Y.value), 1)) : y("", !0),
					U.value ? y("", !0) : (k(), b("div", ut, [Z.value ? (k(), b("span", dt, "还有 " + P(Z.value) + " 项待完善", 1)) : y("", !0), ve.value ? (k(), v(F(a), {
						key: 1,
						variant: "primary",
						size: "sm",
						disabled: T.value || O.value || z.value,
						loading: E.value,
						onClick: s[1] ||= (e) => Me(G.scheduled_local ? "scheduled" : "published")
					}, {
						icon: L(() => [C(F(h), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: L(() => [S(P(G.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)]))
				])
			]),
			T.value ? (k(), b("div", ft, [C(F(h), {
				name: "loader-circle",
				class: "academy-spin",
				size: 28
			}), s[29] ||= x("span", null, "正在读取课程资料...", -1)])) : O.value ? (k(), b("div", pt, [C(F(f), {
				type: "error",
				description: A.value,
				closable: !1
			}, null, 8, ["description"]), C(F(a), { onClick: De }, {
				default: L(() => [...s[30] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (k(), b("div", mt, [x("aside", ht, [C(F(d), {
				model: G,
				rules: F(xe),
				"label-position": "top",
				onSubmit: s[10] ||= he(() => {}, ["prevent"])
			}, {
				default: L(() => [
					C(F(m), {
						label: "课程分类",
						prop: "category_ids",
						error: X.value.category_ids,
						required: ""
					}, {
						default: L(() => [C(F(ie), {
							modelValue: G.category_ids,
							"onUpdate:modelValue": s[2] ||= (e) => G.category_ids = e,
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
					s[31] ||= x("h3", null, "课程设置", -1),
					C(F(m), {
						label: "课程封面",
						prop: "cover_url",
						error: X.value.cover_url
					}, {
						default: L(() => [C(e, {
							modelValue: G.cover_url,
							"onUpdate:modelValue": s[3] ||= (e) => G.cover_url = e,
							label: "课程封面",
							disabled: W.value,
							upload: F(g),
							onBusyChange: s[4] ||= (e) => z.value = e,
							onStart: s[5] ||= (e) => A.value = "",
							onError: Fe,
							onSuccess: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "课程难度",
						prop: "difficulty_level",
						error: X.value.difficulty_level
					}, {
						default: L(() => [C(F(ie), {
							modelValue: G.difficulty_level,
							"onUpdate:modelValue": s[6] ||= (e) => G.difficulty_level = e,
							options: F(c),
							disabled: W.value,
							"aria-label": "课程难度"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "前端排序",
						prop: "sort_order",
						error: X.value.sort_order
					}, {
						default: L(() => [C(F(o), {
							modelValue: G.sort_order,
							"onUpdate:modelValue": s[7] ||= (e) => G.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: W.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					s[32] ||= x("h3", null, "发布设置", -1),
					C(F(m), {
						label: "启用状态",
						prop: "is_enabled",
						error: X.value.is_enabled
					}, {
						default: L(() => [C(F(n), {
							modelValue: G.is_enabled,
							"onUpdate:modelValue": s[8] ||= (e) => G.is_enabled = e,
							disabled: W.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "计划发布时间",
						prop: "scheduled_local",
						error: X.value.scheduled_local
					}, {
						default: L(() => [C(F(ae), {
							modelValue: G.scheduled_local,
							"onUpdate:modelValue": s[9] ||= (e) => G.scheduled_local = e,
							type: "datetime-local",
							disabled: W.value || !ve.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", gt, [C(F(d), {
				model: G,
				rules: F(xe),
				"label-position": "top",
				onSubmit: s[14] ||= he(() => {}, ["prevent"])
			}, {
				default: L(() => [
					C(F(m), {
						label: "标题",
						prop: "title",
						error: X.value.title,
						required: ""
					}, {
						default: L(() => [C(F(ae), {
							modelValue: G.title,
							"onUpdate:modelValue": s[11] ||= (e) => G.title = e,
							maxlength: 255,
							disabled: W.value,
							placeholder: "输入课程标题",
							"aria-label": "课程标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "摘要",
						prop: "summary",
						error: X.value.summary
					}, {
						default: L(() => [pe(x("textarea", {
							"onUpdate:modelValue": s[12] ||= (e) => G.summary = e,
							class: "course-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: W.value,
							"aria-invalid": !!X.value.summary,
							"aria-label": "课程摘要"
						}, null, 8, _t), [[de, G.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "正文",
						prop: "body_html",
						error: X.value.body_html
					}, {
						default: L(() => [C(F(r), {
							modelValue: G.body_html,
							"onUpdate:modelValue": s[13] ||= (e) => G.body_html = e,
							readonly: U.value,
							disabled: E.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "课程正文"
						}, {
							"image-upload": L(({ url: t, setUrl: n, setBusy: r }) => [C(e, {
								label: "正文图片",
								"model-value": t,
								upload: F(g),
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
			C(F(p), {
				modelValue: le.value,
				"onUpdate:modelValue": s[18] ||= (e) => le.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1,
				onOpened: Ce
			}, {
				footer: L(() => [C(F(a), {
					variant: "primary",
					onClick: s[17] ||= (e) => le.value = !1
				}, {
					default: L(() => [...s[33] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: L(() => [C(F(d), {
					model: G,
					rules: F(xe),
					"label-position": "top",
					onSubmit: s[16] ||= he(() => {}, ["prevent"])
				}, {
					default: L(() => [C(F(m), {
						label: "SEO 描述",
						prop: "seo_description",
						error: X.value.seo_description
					}, {
						default: L(() => [pe(x("textarea", {
							ref_key: "seoInput",
							ref: K,
							"onUpdate:modelValue": s[15] ||= (e) => G.seo_description = e,
							class: "course-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: W.value,
							"aria-invalid": !!X.value.seo_description,
							"aria-label": "SEO 描述"
						}, null, 8, vt), [[de, G.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(F(p), {
				modelValue: B.value,
				"onUpdate:modelValue": s[20] ||= (e) => B.value = e,
				title: "确认删除",
				subtitle: `操作对象：${G.title || "未命名课程"}`,
				width: "460px",
				"panel-class": "course-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !E.value
			}, {
				"header-actions": L(() => [x("span", yt, [C(F(h), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: L(() => [C(F(a), {
					disabled: E.value,
					onClick: s[19] ||= (e) => B.value = !1
				}, {
					default: L(() => [...s[34] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(a), {
					variant: "warning",
					loading: E.value,
					onClick: Pe
				}, {
					default: L(() => [...s[35] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: L(() => [C(F(f), {
					class: "course-delete-dialog__notice",
					type: "warning",
					closable: !1,
					"show-icon": !1,
					description: "确定删除这门课程吗？删除后将不再展示，请谨慎操作。"
				}), V.value ? (k(), v(F(f), {
					key: 0,
					type: "error",
					closable: !1,
					description: V.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, [
				"modelValue",
				"subtitle",
				"before-close"
			]),
			C(F(p), {
				modelValue: N.value,
				"onUpdate:modelValue": s[23] ||= (e) => N.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: L(() => [C(F(a), { onClick: s[21] ||= (e) => N.value = !1 }, {
					default: L(() => [...s[36] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(F(a), {
					variant: "primary",
					onClick: s[22] ||= (e) => w("close")
				}, {
					default: L(() => [...s[37] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(F(p), {
				modelValue: ue.value,
				"onUpdate:modelValue": s[25] ||= (e) => ue.value = e,
				title: "将课程转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: L(() => [C(F(a), { onClick: s[24] ||= (e) => ue.value = !1 }, {
					default: L(() => [...s[38] ||= [S("取消", -1)]]),
					_: 1
				}), C(F(a), {
					variant: "primary",
					onClick: je
				}, {
					default: L(() => [...s[39] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, at));
	}
}), [["__scopeId", "data-v-5463d19a"]]), xt = { class: "academy-courses" }, St = /*#__PURE__*/ g(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = ge(), { formatDateTime: n } = ge(), { academyDifficulties: r, academyPublishStates: i, getAcademyList: o, getAcademyMetadata: s } = Ge(), c = M(!1), l = M(), u = (e) => t([`cms_academy:${e}`]), d = M(), f = G(s, (e) => {
			d.value = e;
		}), re = [
			...W(),
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
				formatter: (e) => r.find((t) => t.value === Number(e))?.label || "-"
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
				formatter: n
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], p = _(() => [
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
				}, ...r]
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
		]), { proTableBindings: ie, reload: m } = f.bindTable(te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: p,
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
		})), ae = f.loadMetadata;
		function g(e) {
			l.value = e, c.value = !0;
		}
		function oe() {
			c.value = !1, m(), ae();
		}
		return (e, t) => (k(), b("div", xt, [c.value ? (k(), v(bt, {
			key: 0,
			"course-id": l.value,
			onClose: t[0] ||= (e) => c.value = !1,
			onSaved: oe
		}, null, 8, ["course-id"])) : y("", !0), pe(C(F(ne), E(F(ie), {
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
			"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": L(() => [u("add") ? (k(), v(F(a), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => g()
			}, {
				icon: L(() => [C(F(h), {
					name: "plus",
					size: 14
				})]),
				default: L(() => [t[2] ||= S("新增课程", -1)]),
				_: 1
			})) : y("", !0)]),
			"cell-publish_status": L(({ row: e }) => [C(F(ee), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: L(() => [S(P(F(i).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": L(({ row: e }) => [C(F(ee), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: L(() => [S(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": L(({ row: e }) => [S(P(F(n)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": L(({ row: e }) => [C(F(a), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑课程" : "课程详情",
				"aria-label": u("edit") ? "编辑课程" : "课程详情",
				onClick: (t) => g(e.id)
			}, {
				default: L(() => [C(F(h), {
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
	}, { isOpenRetry: !1 }), s = l(e, "/cms/help/categories/upload"), c = l(e, "/cms/help/upload"), u = [
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
	function ee(e) {
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
		helpPublishStates: u,
		helpCategoryLabel: d,
		helpError: ee
	};
}
//#endregion
//#region src/cms/views/content/help/EnabledToggle.vue?vue&type=script&setup=true&lang.ts
var wt = ["aria-checked", "disabled"], Tt = /*#__PURE__*/ g(/* @__PURE__ */ w({
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
		}, [x("span")], -1), x("span", null, P(e.modelValue ? "已启用" : "已停用"), 1)], 10, wt));
	}
}), [["__scopeId", "data-v-5cfe8693"]]), Et = { class: "help-categories" }, Dt = ["aria-busy"], Ot = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, kt = { class: "taxonomy-editor__field" }, At = { class: "taxonomy-editor__row" }, jt = "分类", Mt = /*#__PURE__*/ g(/* @__PURE__ */ w({
	__name: "index",
	setup(t) {
		let { helpError: n, deleteHelp: r, getHelpMetadata: i, getHelpList: s, getHelpDetail: c, saveHelp: l, uploadHelpCategoryImage: re } = Ct(), { hasPermission: g } = ge(), { formatDateTime: oe } = ge(), w = (e) => g([`cms_help_category:${e}`]), T = M(), D = M(), O = G(i, (e) => {
			T.value = e;
		}), ce = [
			{
				key: "name",
				dataIndex: "name",
				title: "分类名称",
				width: 210,
				hideable: !1
			},
			...W(),
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
				formatter: (e) => T.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
		], A = _(() => [
			...O.fields,
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
				}, ...(T.value?.categories || []).filter((e) => !e.parent_id).map((e) => ({
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
		]), { proTableBindings: le, rows: N, reload: ue } = O.bindTable(te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: A,
			request: async ({ filters: e, signal: t, reason: n }) => {
				let r = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), i = await H((e, n) => s("categories", {
					...r,
					page_no: e,
					page_size: n
				}, t), t);
				return !t.aborted && (n === "query" || n === "reset") && (I.value = Object.keys(r).length ? new Set(i.rows.filter((e) => e.parent_id != null).map((e) => String(e.parent_id))) : /* @__PURE__ */ new Set()), i;
			}
		})), { visibleRows: de, expanded: I, groups: fe, allExpanded: pe, toggle: me, toggleAll: R } = U(N), _e = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			image_url: "",
			image_media_id: null,
			sort_order: 10,
			is_enabled: !0
		}), z = j(_e()), B = M(!1), V = M(!1), K = M(!1), q = M(!1), J = M(!1), be = M(!1), Y = M(""), xe = M(!1), Se = M(""), X = _(() => !w(z.id ? "edit" : "add")), Z = _(() => q.value || J.value || B.value), Ce;
		async function Q(e) {
			Ce?.abort(), Ce = new AbortController();
			let t = Ce;
			Object.assign(z, _e(), { id: e || "" }), Se.value = "", be.value = !1, Y.value = "", xe.value = !1, V.value = !0, K.value = !0;
			try {
				if (D.value = await i(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await c("categories", e, t.signal);
				if (D.value = await i(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
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
				t.signal.aborted || (xe.value = !0, Se.value = n(e));
			} finally {
				t.signal.aborted || (K.value = !1);
			}
		}
		function $() {
			return Z.value ? !1 : (Ce?.abort(), !0);
		}
		function we() {
			$() && (V.value = !1);
		}
		async function Te() {
			if (!(X.value || Z.value || K.value || xe.value)) {
				if (!z.name.trim() || z.sort_order === null) {
					Se.value = "请填写分类名称和排序";
					return;
				}
				q.value = !0, Se.value = "";
				try {
					await l("categories", {
						name: z.name,
						parent_id: z.parent_id || null,
						image_media_id: z.image_media_id,
						sort_order: z.sort_order,
						is_enabled: z.is_enabled,
						id: z.id || void 0,
						row_version: z.id ? z.row_version : void 0
					}), V.value = !1, u.success("保存成功"), await Promise.all([ue(), ke()]);
				} catch (e) {
					Se.value = n(e);
				} finally {
					q.value = !1;
				}
			}
		}
		function Ee() {
			!z.id || !w("delete") || Z.value || K.value || xe.value || (Y.value = "", be.value = !0);
		}
		async function De() {
			if (!(!be.value || !z.id || !w("delete") || Z.value || K.value || xe.value)) {
				J.value = !0, Y.value = "";
				try {
					await r("categories", z.id, z.row_version), be.value = !1, V.value = !1, u.success("分类已删除"), await Promise.all([ue(), ke()]);
				} catch (e) {
					Y.value = n(e);
				} finally {
					J.value = !1;
				}
			}
		}
		let Oe = _(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(D.value?.categories || []).filter((e) => !e.parent_id && e.id !== z.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), ke = O.loadMetadata;
		return se(() => {
			Ce?.abort();
		}), (t, r) => (k(), b("div", Et, [
			C(F(ne), E(F(le), {
				"auto-refreshable": !1,
				columns: ce,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${jt}管理`,
				data: F(de),
				"show-pagination": !1
			}), {
				"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": L(() => [w("add") ? (k(), v(F(a), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => Q()
				}, {
					icon: L(() => [C(F(h), {
						name: "plus",
						size: 14
					})]),
					default: L(() => [S("新增" + P(jt))]),
					_: 1
				})) : y("", !0), C(F(a), {
					size: "sm",
					disabled: !F(fe).children.size,
					onClick: F(R)
				}, {
					icon: L(() => [C(F(h), {
						name: F(pe) ? "chevron-up" : "chevron-down",
						size: 14
					}, null, 8, ["name"])]),
					default: L(() => [S(" " + P(F(pe) ? "全部收起" : "全部展开"), 1)]),
					_: 1
				}, 8, ["disabled", "onClick"])]),
				"cell-name": L(({ row: e }) => [C(ve, {
					name: e.name,
					child: e.parent_id != null,
					branch: F(fe).children.has(e.id),
					expanded: F(I).has(e.id),
					onToggle: (t) => F(me)(e.id)
				}, null, 8, [
					"name",
					"child",
					"branch",
					"expanded",
					"onToggle"
				])]),
				"cell-is_enabled": L(({ row: e }) => [C(F(ee), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: L(() => [S(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": L(({ row: e }) => [C(F(a), {
					size: "sm",
					"icon-only": "",
					title: w("edit") ? `编辑${jt}` : `${jt}详情`,
					"aria-label": `编辑${jt}`,
					onClick: (t) => Q(e.id)
				}, {
					default: L(() => [C(F(h), {
						name: w("edit") ? "square-pen" : "panel-right-open",
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
			C(F(p), {
				modelValue: V.value,
				"onUpdate:modelValue": r[10] ||= (e) => V.value = e,
				title: `${z.id ? "编辑" : "新增"}帮助${jt}`,
				width: "680px",
				subtitle: "帮助分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": $
			}, {
				footer: L(() => [
					z.id && w("delete") ? (k(), v(F(a), {
						key: 0,
						variant: "danger",
						disabled: K.value || xe.value || Z.value,
						onClick: Ee
					}, {
						icon: L(() => [C(F(h), {
							name: "trash-2",
							size: 14
						})]),
						default: L(() => [r[14] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(F(a), {
						disabled: Z.value,
						onClick: we
					}, {
						default: L(() => [...r[15] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					X.value ? y("", !0) : (k(), v(F(a), {
						key: 1,
						variant: "primary",
						loading: q.value,
						disabled: K.value || xe.value || J.value || B.value,
						onClick: Te
					}, {
						default: L(() => [S("保存" + P(jt))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: L(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": K.value
				}, [
					K.value ? (k(), b("div", Ot, [C(F(h), {
						name: "loader-circle",
						class: "help-spin",
						size: 24
					}), x("span", null, "正在读取" + P(jt) + "...")])) : y("", !0),
					Se.value ? (k(), v(F(f), {
						key: 1,
						type: "error",
						closable: !1,
						description: Se.value
					}, null, 8, ["description"])) : y("", !0),
					!K.value && !xe.value ? (k(), v(F(d), {
						key: 2,
						model: z,
						"label-position": "top",
						onSubmit: he(Te, ["prevent"])
					}, {
						default: L(() => [
							z.id ? (k(), v(F(m), {
								key: 0,
								label: "分类ID"
							}, {
								default: L(() => [C(F(ae), {
									"model-value": z.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : y("", !0),
							C(F(m), {
								label: `${jt}名称`,
								required: ""
							}, {
								default: L(() => [C(F(ae), {
									modelValue: z.name,
									"onUpdate:modelValue": r[1] ||= (e) => z.name = e,
									maxlength: 120,
									disabled: X.value || Z.value,
									"aria-label": `${jt}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							C(F(m), { label: "父分类" }, {
								default: L(() => [x("div", kt, [C(F(ie), {
									modelValue: z.parent_id,
									"onUpdate:modelValue": r[2] ||= (e) => z.parent_id = e,
									options: Oe.value,
									disabled: X.value || Z.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), r[13] ||= x("p", { class: "help-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类文章。 ", -1)])]),
								_: 1
							}),
							C(F(m), { label: "分类图片" }, {
								default: L(() => [C(e, {
									class: "taxonomy-editor__image",
									modelValue: z.image_url,
									"onUpdate:modelValue": r[3] ||= (e) => z.image_url = e,
									label: "分类图片",
									upload: F(re),
									disabled: X.value || Z.value,
									"onUpdate:mediaId": r[4] ||= (e) => z.image_media_id = e,
									onBusyChange: r[5] ||= (e) => B.value = e,
									onStart: r[6] ||= (e) => Se.value = "",
									onError: r[7] ||= (e) => Se.value = F(n)(e)
								}, null, 8, [
									"modelValue",
									"upload",
									"disabled"
								])]),
								_: 1
							}),
							x("div", At, [C(F(m), {
								label: "前端排序",
								required: ""
							}, {
								default: L(() => [C(F(o), {
									modelValue: z.sort_order,
									"onUpdate:modelValue": r[8] ||= (e) => z.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: X.value || Z.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(F(m), { label: "启用状态" }, {
								default: L(() => [C(Tt, {
									modelValue: z.is_enabled,
									"onUpdate:modelValue": r[9] ||= (e) => z.is_enabled = e,
									disabled: X.value || Z.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : y("", !0)
				], 8, Dt)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(F(p), {
				modelValue: be.value,
				"onUpdate:modelValue": r[12] ||= (e) => be.value = e,
				title: "删除帮助分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !J.value
			}, {
				footer: L(() => [C(F(a), {
					disabled: J.value,
					onClick: r[11] ||= (e) => be.value = !1
				}, {
					default: L(() => [...r[16] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(a), {
					variant: "danger",
					loading: J.value,
					onClick: De
				}, {
					default: L(() => [...r[17] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: L(() => [x("p", null, "确认删除分类“" + P(z.name) + "”？有关联文章或子分类的分类无法删除。", 1), Y.value ? (k(), v(F(f), {
					key: 0,
					type: "error",
					closable: !1,
					description: Y.value
				}, null, 8, ["description"])) : y("", !0)]),
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
}, Yt = /*#__PURE__*/ g(/* @__PURE__ */ w({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: n }) {
		let { helpError: i, helpCategoryLabel: s, deleteHelp: c, getHelpDetail: l, getHelpMetadata: ee, getHelpList: te, saveHelp: ne, uploadHelpCover: re } = Ct(), { hasPermission: g } = ge(), w = t, T = n, E = M(!0), D = M(!1), O = M(!1), A = M(""), le = M(!1), N = M(!1), ue = M(!1), I = M(!1), fe = M(ge().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), R = M(), z = M("draft"), B = M(!1), V = _(() => g(["cms_help:publish"])), ve = _(() => !g([`cms_help:${w.articleId ? "edit" : "add"}`]) || !V.value && z.value !== "draft"), H = _(() => g(["cms_help:delete"]) && (V.value || z.value === "draft"));
		async function U() {
			if (!(!H.value || D.value || E.value || O.value)) {
				D.value = !0, A.value = "";
				try {
					await c("articles", G.id, G.row_version), Ae = JSON.stringify(G), u.success("文章已删除"), T("saved");
				} catch (e) {
					A.value = i(e), I.value = !1;
				} finally {
					D.value = !1;
				}
			}
		}
		let W = _(() => ve.value || D.value), G = j({
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
		}), { editorRoot: ye, seoInput: K, fieldRules: q, fieldErrors: J, pendingCount: be, saveError: Y, validateSave: xe, setSaveFailure: Se, focusFirstError: X, focusSeoError: Z } = Ee(G, () => R.value?.categories || [], "help", le), Ce = M(""), Q = M(!1), $ = M([]), we = _(() => $.value.filter((e) => e.id !== w.articleId).map((e) => ({
			label: `${e.title} · ${e.code}`,
			value: e.id
		})));
		async function Te() {
			if (!(W.value || Q.value)) {
				Q.value = !0;
				try {
					let e = await te("articles", {
						keyword: Ce.value,
						page_size: 100
					}, je?.signal), t = $.value.filter((e) => G.related_content_ids.includes(e.id));
					$.value = [...new Map([...t, ...e.lists].map((e) => [e.id, e])).values()];
				} catch (e) {
					je?.signal.aborted || (A.value = i(e));
				} finally {
					Q.value = !1;
				}
			}
		}
		let De = _(() => (R.value?.categories || []).filter((e) => e.parent_id != null).map((e) => ({
			label: s(R.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), Oe = _(() => R.value?.categories.find((e) => e.id === G.category_id && e.parent_id == null)), ke = _({
			get: () => Oe.value ? "" : G.category_id,
			set: (e) => {
				G.category_id = e;
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
			E.value = !0, O.value = !1, A.value = "";
			try {
				if (R.value = await ee(e.signal, { cms_source_type: "platform" }), w.articleId) {
					let t = await l("articles", w.articleId, e.signal);
					if (R.value = await ee(e.signal, { space_id: String(t.space_id) }), fe.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					G.scheduled_local = t.publish_status === "scheduled" ? Me(t.scheduled_at) : "", z.value = t.publish_status;
				}
				Ae = JSON.stringify(G);
			} catch (t) {
				e.signal.aborted || (A.value = i(t), O.value = !0);
			} finally {
				e.signal.aborted || (E.value = !1);
			}
		}
		let Pe = () => !E.value && !O.value && Ae !== JSON.stringify(G);
		function Fe() {
			Pe() ? N.value = !0 : T("close");
		}
		function Ie() {
			z.value === "draft" ? Re("draft") : ue.value = !0;
		}
		function Le() {
			ue.value = !1, Re("draft");
		}
		async function Re(e) {
			if (W.value || E.value || O.value || B.value || (A.value = "", !await xe(e))) return;
			let t = G.scheduled_local ? new Date(G.scheduled_local) : null;
			D.value = !0, A.value = "";
			try {
				await ne("articles", {
					...G,
					id: G.id || void 0,
					row_version: G.id ? G.row_version : void 0,
					category_id: G.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), Ae = JSON.stringify(G), u.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "文章已发布"), T("saved");
			} catch (e) {
				Se(e);
			} finally {
				D.value = !1;
			}
			be.value && await X();
		}
		function ze(e) {
			A.value = i(e);
		}
		let Be = (e) => {
			Pe() && (e.preventDefault(), e.returnValue = "");
		};
		return _e(() => !D.value && !B.value && (!Pe() || window.confirm("文章有未保存的修改，确定离开？"))), ce(() => {
			Ne(), window.addEventListener("beforeunload", Be);
		}), se(() => {
			je?.abort(), window.removeEventListener("beforeunload", Be);
		}), (n, i) => (k(), b("section", {
			ref_key: "editorRoot",
			ref: ye,
			class: "article-editor",
			"aria-busy": E.value || D.value
		}, [
			x("header", Pt, [
				C(F(a), {
					"icon-only": "",
					title: "返回文章列表",
					"aria-label": "返回文章列表",
					disabled: D.value || B.value,
					onClick: Fe
				}, {
					default: L(() => [C(F(h), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", Ft, [x("h2", null, P(t.articleId ? "编辑文章" : "新增文章"), 1), x("span", null, P(R.value?.source_locale || "zh-CN") + " · " + P(fe.value), 1)]),
				x("div", It, [
					t.articleId && H.value ? (k(), v(F(a), {
						key: 0,
						size: "sm",
						disabled: E.value || O.value || D.value || B.value,
						onClick: i[0] ||= (e) => I.value = !0
					}, {
						default: L(() => [...i[32] ||= [S("删除文章", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(F(a), {
						size: "sm",
						disabled: E.value || O.value,
						onClick: i[1] ||= (e) => le.value = !0
					}, {
						icon: L(() => [C(F(h), {
							name: "search",
							size: 14
						})]),
						default: L(() => [i[33] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					ve.value ? y("", !0) : (k(), v(F(a), {
						key: 1,
						size: "sm",
						disabled: E.value || O.value || D.value || B.value,
						onClick: Ie
					}, {
						icon: L(() => [C(F(h), {
							name: "save",
							size: 14
						})]),
						default: L(() => [i[34] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					F(Y) ? (k(), b("span", Lt, P(F(Y)), 1)) : y("", !0),
					!ve.value && F(be) ? (k(), b("span", Rt, "还有 " + P(F(be)) + " 项待完善", 1)) : y("", !0),
					!ve.value && V.value ? (k(), v(F(a), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: E.value || O.value || B.value,
						loading: D.value,
						onClick: i[2] ||= (e) => Re(G.scheduled_local ? "scheduled" : "published")
					}, {
						icon: L(() => [C(F(h), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: L(() => [S(P(G.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)
				])
			]),
			E.value ? (k(), b("div", zt, [C(F(h), {
				name: "loader-circle",
				class: "help-spin",
				size: 28
			}), i[35] ||= x("span", null, "正在读取文章资料...", -1)])) : O.value ? (k(), b("div", Bt, [C(F(f), {
				type: "error",
				description: A.value,
				closable: !1
			}, null, 8, ["description"]), C(F(a), { onClick: Ne }, {
				default: L(() => [...i[36] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (k(), b(oe, { key: 2 }, [A.value ? (k(), b("div", Vt, [C(F(f), {
				type: "error",
				description: A.value,
				closable: !1
			}, null, 8, ["description"])])) : y("", !0), x("div", Ht, [x("aside", Ut, [C(F(d), {
				model: G,
				rules: F(q),
				"label-position": "top",
				onSubmit: i[16] ||= he(() => {}, ["prevent"])
			}, {
				default: L(() => [
					C(F(m), {
						label: "文章分类",
						prop: "category_id",
						error: F(J).category_id,
						required: ""
					}, {
						default: L(() => [C(F(ie), {
							modelValue: ke.value,
							"onUpdate:modelValue": i[3] ||= (e) => ke.value = e,
							options: De.value,
							placeholder: Oe.value ? "原分类：" + Oe.value.name + "（请选择二级分类）" : "请选择二级分类",
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
					i[39] ||= x("h3", null, "文章设置", -1),
					C(F(m), {
						label: "文章封面",
						prop: "cover_url",
						error: F(J).cover_url
					}, {
						default: L(() => [C(e, {
							modelValue: G.cover_url,
							"onUpdate:modelValue": i[4] ||= (e) => G.cover_url = e,
							label: "文章封面",
							disabled: W.value,
							upload: F(re),
							onBusyChange: i[5] ||= (e) => B.value = e,
							onStart: i[6] ||= (e) => A.value = "",
							onError: ze
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "内容来源",
						prop: "content_source",
						error: F(J).content_source
					}, {
						default: L(() => [C(F(ae), {
							modelValue: G.content_source,
							"onUpdate:modelValue": i[7] ||= (e) => G.content_source = e,
							maxlength: 160,
							disabled: W.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "作者署名",
						prop: "author_name",
						error: F(J).author_name
					}, {
						default: L(() => [C(F(ae), {
							modelValue: G.author_name,
							"onUpdate:modelValue": i[8] ||= (e) => G.author_name = e,
							maxlength: 120,
							disabled: W.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "前端排序",
						prop: "sort_order",
						error: F(J).sort_order
					}, {
						default: L(() => [C(F(o), {
							modelValue: G.sort_order,
							"onUpdate:modelValue": i[9] ||= (e) => G.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: W.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[40] ||= x("h3", null, "发布设置", -1),
					C(F(m), {
						label: "搜索关键词",
						prop: "search_keywords",
						error: F(J).search_keywords
					}, {
						default: L(() => [C(F(ae), {
							modelValue: G.search_keywords,
							"onUpdate:modelValue": i[10] ||= (e) => G.search_keywords = e,
							maxlength: 2e3,
							disabled: W.value,
							placeholder: "使用空格或逗号分隔",
							"aria-label": "搜索关键词"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: F(J).helpful_enabled
					}, {
						default: L(() => [C(Tt, {
							modelValue: G.helpful_enabled,
							"onUpdate:modelValue": i[11] ||= (e) => G.helpful_enabled = e,
							disabled: W.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "相关文章",
						prop: "related_content_ids",
						error: F(J).related_content_ids
					}, {
						default: L(() => [x("div", Wt, [
							C(F(ae), {
								modelValue: Ce.value,
								"onUpdate:modelValue": i[12] ||= (e) => Ce.value = e,
								disabled: W.value,
								placeholder: "搜索文章标题",
								"aria-label": "搜索相关文章",
								onKeydown: me(he(Te, ["prevent"]), ["enter"])
							}, null, 8, [
								"modelValue",
								"disabled",
								"onKeydown"
							]),
							C(F(a), {
								size: "sm",
								disabled: W.value,
								loading: Q.value,
								onClick: Te
							}, {
								default: L(() => [...i[37] ||= [S("查找文章", -1)]]),
								_: 1
							}, 8, ["disabled", "loading"]),
							C(F(ie), {
								modelValue: G.related_content_ids,
								"onUpdate:modelValue": i[13] ||= (e) => G.related_content_ids = e,
								options: we.value,
								multiple: "",
								clearable: "",
								disabled: W.value,
								"aria-label": "相关文章"
							}, null, 8, [
								"modelValue",
								"options",
								"disabled"
							]),
							i[38] ||= x("p", { class: "article-editor__hint" }, " 最多 20 篇，按选择顺序展示。可关联草稿，前台须按发布状态过滤。 ", -1)
						])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "启用状态",
						prop: "is_enabled",
						error: F(J).is_enabled
					}, {
						default: L(() => [C(Tt, {
							modelValue: G.is_enabled,
							"onUpdate:modelValue": i[14] ||= (e) => G.is_enabled = e,
							disabled: W.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: F(J).scheduled_local
					}, {
						default: L(() => [C(F(ae), {
							modelValue: G.scheduled_local,
							"onUpdate:modelValue": i[15] ||= (e) => G.scheduled_local = e,
							type: "datetime-local",
							disabled: W.value || !V.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[41] ||= x("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", Gt, [C(F(d), {
				model: G,
				rules: F(q),
				"label-position": "top",
				onSubmit: i[20] ||= he(() => {}, ["prevent"])
			}, {
				default: L(() => [
					C(F(m), {
						label: "标题",
						prop: "title",
						error: F(J).title,
						required: ""
					}, {
						default: L(() => [C(F(ae), {
							modelValue: G.title,
							"onUpdate:modelValue": i[17] ||= (e) => G.title = e,
							maxlength: 255,
							disabled: W.value,
							placeholder: "输入文章标题",
							"aria-label": "文章标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "摘要",
						prop: "summary",
						error: F(J).summary
					}, {
						default: L(() => [pe(x("textarea", {
							"onUpdate:modelValue": i[18] ||= (e) => G.summary = e,
							"aria-invalid": !!F(J).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: W.value,
							"aria-label": "文章摘要"
						}, null, 8, Kt), [[de, G.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "正文",
						prop: "body_html",
						error: F(J).body_html
					}, {
						default: L(() => [C(F(r), {
							modelValue: G.body_html,
							"onUpdate:modelValue": i[19] ||= (e) => G.body_html = e,
							readonly: ve.value,
							disabled: D.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "文章正文"
						}, {
							"image-upload": L(({ url: t, setUrl: n, setBusy: r }) => [C(e, {
								label: "正文图片",
								"model-value": t,
								upload: F(re),
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
			C(F(p), {
				modelValue: le.value,
				"onUpdate:modelValue": i[24] ||= (e) => le.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: L(() => [C(F(a), {
					variant: "primary",
					onClick: i[23] ||= (e) => le.value = !1
				}, {
					default: L(() => [...i[42] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: L(() => [C(F(d), {
					model: G,
					rules: F(q),
					"label-position": "top",
					onSubmit: i[22] ||= he(() => {}, ["prevent"])
				}, {
					default: L(() => [C(F(m), {
						label: "SEO 描述",
						prop: "seo_description",
						error: F(J).seo_description
					}, {
						default: L(() => [pe(x("textarea", {
							ref_key: "seoInput",
							ref: K,
							"onUpdate:modelValue": i[21] ||= (e) => G.seo_description = e,
							"aria-invalid": !!F(J).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: W.value,
							"aria-label": "SEO 描述"
						}, null, 8, qt), [[de, G.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(F(p), {
				modelValue: I.value,
				"onUpdate:modelValue": i[26] ||= (e) => I.value = e,
				title: "确认删除",
				subtitle: `操作对象：${G.title || "未命名文章"}`,
				width: "460px",
				"panel-class": "help-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !D.value
			}, {
				"header-actions": L(() => [x("span", Jt, [C(F(h), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: L(() => [C(F(a), {
					disabled: D.value,
					onClick: i[25] ||= (e) => I.value = !1
				}, {
					default: L(() => [...i[43] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(a), {
					variant: "warning",
					loading: D.value,
					onClick: U
				}, {
					default: L(() => [...i[44] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: L(() => [C(F(f), {
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
			C(F(p), {
				modelValue: N.value,
				"onUpdate:modelValue": i[29] ||= (e) => N.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: L(() => [C(F(a), { onClick: i[27] ||= (e) => N.value = !1 }, {
					default: L(() => [...i[45] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(F(a), {
					variant: "primary",
					onClick: i[28] ||= (e) => T("close")
				}, {
					default: L(() => [...i[46] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(F(p), {
				modelValue: ue.value,
				"onUpdate:modelValue": i[31] ||= (e) => ue.value = e,
				title: "将文章转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: L(() => [C(F(a), { onClick: i[30] ||= (e) => ue.value = !1 }, {
					default: L(() => [...i[47] ||= [S("取消", -1)]]),
					_: 1
				}), C(F(a), {
					variant: "primary",
					onClick: Le
				}, {
					default: L(() => [...i[48] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Nt));
	}
}), [["__scopeId", "data-v-438b969d"]]), Xt = { class: "help-articles" }, Zt = {
	key: 0,
	class: "help-statistics-note"
}, Qt = /*#__PURE__*/ g(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let t = ge(), { helpPublishStates: n, helpCategoryLabel: r, getHelpList: i, getHelpMetadata: o } = Ct(), { hasPermission: s } = ge(), { formatDateTime: c } = ge(), l = M(!1), u = M(), d = (e) => s([`cms_help:${e}`]), f = M(), re = G(o, (e) => {
			f.value = e;
		}), p = [
			...W(),
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
				formatter: (e) => r(f.value, e)
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
		], ie = _(() => [
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
		]), { proTableBindings: m, reload: ae } = re.bindTable(te({
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
		})), g = re.loadMetadata;
		function oe(e) {
			u.value = e, l.value = !0;
		}
		function x() {
			l.value = !1, ae(), g();
		}
		return (e, r) => (k(), b("div", Xt, [
			!l.value && F(t).mode === "platform" ? (k(), b("p", Zt, " 当前管理平台默认模板。浏览量、评价数及有帮助率属于站点运行数据，此处显示“—”，不汇总白标站点。 ")) : y("", !0),
			l.value ? (k(), v(Yt, {
				key: 1,
				"article-id": u.value,
				onClose: r[0] ||= (e) => l.value = !1,
				onSaved: x
			}, null, 8, ["article-id"])) : y("", !0),
			pe(C(F(ne), E(F(m), {
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
				"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": L(() => [d("add") ? (k(), v(F(a), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[1] ||= (e) => oe()
				}, {
					icon: L(() => [C(F(h), {
						name: "plus",
						size: 14
					})]),
					default: L(() => [r[2] ||= S("新增文章", -1)]),
					_: 1
				})) : y("", !0)]),
				"cell-publish_status": L(({ row: e }) => [C(F(ee), {
					size: "sm",
					effect: "soft",
					type: e.publish_status === "published" ? "success" : "warning"
				}, {
					default: L(() => [S(P(F(n).find((t) => t.value === e.publish_status)?.label), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-is_enabled": L(({ row: e }) => [C(F(ee), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: L(() => [S(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-publish_time": L(({ row: e }) => [S(P(F(c)(e.published_at || e.scheduled_at)), 1)]),
				"cell-actions": L(({ row: e }) => [C(F(a), {
					size: "sm",
					"icon-only": "",
					title: d("edit") ? "编辑文章" : "文章详情",
					"aria-label": d("edit") ? "编辑文章" : "文章详情",
					onClick: (t) => oe(e.id)
				}, {
					default: L(() => [C(F(h), {
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
var en = { class: "feedback-page" }, tn = ["aria-busy"], nn = {
	key: 0,
	role: "status"
}, rn = { class: "feedback-info" }, an = { class: "feedback-content" }, on = {
	key: 0,
	class: "muted"
}, sn = { class: "attachment-title" }, cn = ["src", "alt"], ln = /*#__PURE__*/ g(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { getFeedbackList: t, getFeedbackMetadata: n, getFeedbackDetail: r, getFeedbackAttachment: i, feedbackSourceTypes: o, feedbackSourceLabel: s, feedbackError: c } = $t(), { formatDateTime: l } = ge(), u = M({
			scenes: [],
			issues: []
		}), d = G(n, (e) => {
			u.value = e;
		}), re = [
			...W(),
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
		], ie = _(() => [
			...d.fields,
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
				}, ...o]
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
		]), { proTableBindings: m } = d.bindTable(te({
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
		})), ae = M(!1), g = M(!1), w = M(""), T = M(), D = M({}), O = M(""), ce;
		async function A(e) {
			ce?.abort();
			let t = new AbortController();
			ce = t, T.value = void 0, D.value = {}, w.value = "", O.value = "", ae.value = !0, g.value = !0;
			try {
				let n = await r(e, t.signal);
				t.signal.aborted || (T.value = n);
			} catch (e) {
				t.signal.aborted || (w.value = c(e));
			} finally {
				t.signal.aborted || (g.value = !1);
			}
		}
		async function j(e) {
			let t = ce, n = T.value?.id;
			if (!(!t || !n || O.value)) {
				O.value = e, w.value = "";
				try {
					let r = await i(n, e, t.signal);
					!t.signal.aborted && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(r.data_url) && (D.value[e] = r.data_url);
				} catch (e) {
					t.signal.aborted || (w.value = c(e));
				} finally {
					t.signal.aborted || (O.value = "");
				}
			}
		}
		return fe(ae, (e) => {
			e || (ce?.abort(), T.value = void 0, D.value = {}, w.value = "");
		}), se(() => {
			ce?.abort();
		}), (e, t) => (k(), b("div", en, [C(F(ne), E(F(m), {
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
			"cell-source_type": L(({ row: e }) => [C(F(ee), {
				size: "sm",
				effect: "soft",
				type: e.source_type === "merchant" ? "warning" : e.source_type === "platform" ? "success" : "primary"
			}, {
				default: L(() => [S(P(F(s)(e.source_type)), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-actions": L(({ row: e }) => [C(F(a), {
				size: "sm",
				"icon-only": "",
				title: "查看反馈",
				"aria-label": "查看反馈",
				onClick: (t) => A(e.id)
			}, {
				default: L(() => [C(F(h), {
					name: "eye",
					size: 15
				})]),
				_: 1
			}, 8, ["onClick"])]),
			_: 1
		}, 16), C(F(p), {
			modelValue: ae.value,
			"onUpdate:modelValue": t[1] ||= (e) => ae.value = e,
			title: "反馈详情",
			subtitle: T.value?.code || "查看用户正式提交的意见反馈",
			width: "760px",
			"close-on-click-modal": !1
		}, {
			footer: L(() => [C(F(a), { onClick: t[0] ||= (e) => ae.value = !1 }, {
				default: L(() => [...t[14] ||= [S("关闭", -1)]]),
				_: 1
			})]),
			default: L(() => [x("div", {
				class: "feedback-detail",
				"aria-busy": g.value
			}, [
				g.value ? (k(), b("p", nn, "正在读取反馈…")) : y("", !0),
				w.value ? (k(), v(F(f), {
					key: 1,
					type: "error",
					closable: !1,
					description: w.value
				}, null, 8, ["description"])) : y("", !0),
				T.value && !g.value ? (k(), b(oe, { key: 2 }, [
					x("dl", rn, [
						x("div", null, [t[2] ||= x("dt", null, "UID", -1), x("dd", null, P(T.value.public_user_id_snapshot), 1)]),
						x("div", null, [t[3] ||= x("dt", null, "用户账号", -1), x("dd", null, P(T.value.username_snapshot || "—"), 1)]),
						x("div", null, [t[4] ||= x("dt", null, "来源类型", -1), x("dd", null, P(F(s)(T.value.source_type)), 1)]),
						x("div", null, [t[5] ||= x("dt", null, "来源名称", -1), x("dd", null, P(T.value.source_name_snapshot || "—"), 1)]),
						x("div", null, [t[6] ||= x("dt", null, "业务场景", -1), x("dd", null, P(T.value.scene_name_snapshot), 1)]),
						x("div", null, [t[7] ||= x("dt", null, "问题分类", -1), x("dd", null, P(T.value.issue_category_name_snapshot), 1)]),
						x("div", null, [t[8] ||= x("dt", null, "联系方式（脱敏）", -1), x("dd", null, P(T.value.contact_display), 1)]),
						x("div", null, [t[9] ||= x("dt", null, "提交时间", -1), x("dd", null, P(F(l)(T.value.submitted_at)), 1)])
					]),
					x("section", null, [t[10] ||= x("h3", null, "反馈内容", -1), x("div", an, P(T.value.content), 1)]),
					x("section", null, [
						x("h3", null, [t[11] ||= S(" 附件 ", -1), x("span", null, P(T.value.attachments?.length || 0), 1)]),
						T.value.attachments?.length ? y("", !0) : (k(), b("p", on, "暂无附件")),
						(k(!0), b(oe, null, le(T.value.attachments, (e) => (k(), b("div", {
							key: e.id,
							class: "feedback-attachment"
						}, [x("div", sn, [x("span", null, P(e.original_name || "图片附件") + " · " + P(Math.ceil(e.byte_size / 1024)) + " KB", 1), C(F(a), {
							size: "sm",
							loading: O.value === e.id,
							onClick: (t) => j(e.id)
						}, {
							default: L(() => [...t[12] ||= [S("查看图片", -1)]]),
							_: 1
						}, 8, ["loading", "onClick"])]), D.value[e.id] ? (k(), b("img", {
							key: 0,
							src: D.value[e.id],
							alt: e.original_name || "反馈图片"
						}, null, 8, cn)) : y("", !0)]))), 128))
					]),
					t[13] ||= x("p", { class: "muted" }, "来源和分类为提交时快照；此页面仅查看，不修改用户原始反馈。", -1)
				], 64)) : y("", !0)
			], 8, tn)]),
			_: 1
		}, 8, ["modelValue", "subtitle"])]));
	}
}), [["__scopeId", "data-v-5420cdfa"]]);
//#endregion
//#region src/cms/api/content/announcement.ts
function un() {
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
	}, { isOpenRetry: !1 }), s = l(e, "/cms/announcement/upload"), c = l(e, "/cms/announcement/categories/upload"), u = [
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
	function ee(e) {
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
		announcementPublishStates: u,
		announcementCategoryLabel: d,
		announcementError: ee
	};
}
//#endregion
//#region src/cms/views/content/announcement/categories/index.vue?vue&type=script&setup=true&lang.ts
var dn = { class: "announcement-categories" }, fn = ["aria-busy"], pn = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, mn = { class: "taxonomy-editor__field" }, hn = { class: "taxonomy-editor__row" }, gn = "分类", _n = /*#__PURE__*/ g(/* @__PURE__ */ w({
	__name: "index",
	setup(t) {
		let { hasPermission: n } = ge(), { formatDateTime: r } = ge(), { announcementError: i, deleteAnnouncement: s, getAnnouncementMetadata: c, getAnnouncementList: l, getAnnouncementDetail: re, saveAnnouncement: g, uploadAnnouncementCategoryImage: oe } = un(), w = (e) => n([`cms_announcement_category:${e}`]), T = M(), D = M(), O = G(c, (e) => {
			T.value = e;
		}), ce = [
			{
				key: "name",
				dataIndex: "name",
				title: "分类名称",
				width: 210,
				hideable: !1
			},
			...W(),
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
				formatter: (e) => T.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
		], A = [
			...O.fields,
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
		], { proTableBindings: le, rows: N, reload: ue } = O.bindTable(te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: A,
			request: async ({ filters: e, signal: t, reason: n }) => {
				let r = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), i = await H((e, n) => l("categories", {
					...r,
					page_no: e,
					page_size: n
				}, t), t);
				return !t.aborted && (n === "query" || n === "reset") && (I.value = Object.keys(r).length ? new Set(i.rows.filter((e) => e.parent_id != null).map((e) => String(e.parent_id))) : /* @__PURE__ */ new Set()), i;
			}
		})), { visibleRows: de, expanded: I, groups: fe, allExpanded: pe, toggle: me, toggleAll: R } = U(N), _e = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			image_url: "",
			image_media_id: null,
			sort_order: 10,
			is_enabled: !0
		}), z = j(_e()), B = M(!1), V = M(!1), K = M(!1), q = M(!1), be = M(!1), Y = M(""), xe = M(!1), Se = M(""), X = M(!1), Z = _(() => !w(z.id ? "edit" : "add")), Ce = M(!1), Q = _(() => K.value || q.value || Ce.value), $ = "", we;
		async function Te(e) {
			we?.abort(), we = new AbortController();
			let t = we;
			Object.assign(z, _e(), { id: e || "" }), Se.value = "", be.value = !1, Y.value = "", xe.value = !1, B.value = !0, V.value = !0, $ = JSON.stringify(z);
			try {
				if (D.value = await c(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await re("categories", e, t.signal);
				if (D.value = await c(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
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
				t.signal.aborted || (xe.value = !0, Se.value = i(e));
			} finally {
				t.signal.aborted || (V.value = !1);
			}
		}
		function Ee() {
			return Q.value ? !1 : !V.value && !xe.value && JSON.stringify(z) !== $ ? (X.value = !0, !1) : (we?.abort(), !0);
		}
		function De() {
			Ee() && (B.value = !1);
		}
		function Oe() {
			we?.abort(), X.value = !1, B.value = !1;
		}
		async function ke() {
			if (!(Z.value || Q.value || V.value || xe.value)) {
				if (!z.name.trim() || z.sort_order === null) {
					Se.value = "请填写分类名称和排序";
					return;
				}
				K.value = !0, Se.value = "";
				try {
					await g("categories", {
						name: z.name,
						parent_id: z.parent_id || null,
						image_media_id: z.image_media_id,
						sort_order: z.sort_order,
						is_enabled: z.is_enabled,
						id: z.id || void 0,
						row_version: z.id ? z.row_version : void 0
					}), B.value = !1, u.success("保存成功"), await Promise.all([ue(), Ne()]);
				} catch (e) {
					Se.value = i(e);
				} finally {
					K.value = !1;
				}
			}
		}
		function Ae() {
			!z.id || !w("delete") || Q.value || V.value || xe.value || (Y.value = "", be.value = !0);
		}
		async function je() {
			if (!(!be.value || !z.id || !w("delete") || Q.value || V.value || xe.value)) {
				q.value = !0, Y.value = "";
				try {
					await s("categories", z.id, z.row_version), be.value = !1, B.value = !1, u.success("分类已删除"), await Promise.all([ue(), Ne()]);
				} catch (e) {
					Y.value = i(e);
				} finally {
					q.value = !1;
				}
			}
		}
		let Me = _(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(D.value?.categories || []).filter((e) => !e.parent_id && e.id !== z.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Ne = O.loadMetadata;
		return se(() => {
			we?.abort();
		}), (t, n) => (k(), b("div", dn, [
			C(F(ne), E(F(le), {
				"auto-refreshable": !1,
				columns: ce,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${gn}管理`,
				data: F(de),
				"show-pagination": !1
			}), {
				"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": L(() => [w("add") ? (k(), v(F(a), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: n[0] ||= (e) => Te()
				}, {
					icon: L(() => [C(F(h), {
						name: "plus",
						size: 14
					})]),
					default: L(() => [S("新增" + P(gn))]),
					_: 1
				})) : y("", !0), C(F(a), {
					size: "sm",
					disabled: !F(fe).children.size,
					onClick: F(R)
				}, {
					icon: L(() => [C(F(h), {
						name: F(pe) ? "chevron-up" : "chevron-down",
						size: 14
					}, null, 8, ["name"])]),
					default: L(() => [S(" " + P(F(pe) ? "全部收起" : "全部展开"), 1)]),
					_: 1
				}, 8, ["disabled", "onClick"])]),
				"cell-name": L(({ row: e }) => [C(ve, {
					name: e.name,
					child: e.parent_id != null,
					branch: F(fe).children.has(e.id),
					expanded: F(I).has(e.id),
					onToggle: (t) => F(me)(e.id)
				}, null, 8, [
					"name",
					"child",
					"branch",
					"expanded",
					"onToggle"
				])]),
				"cell-is_enabled": L(({ row: e }) => [C(F(ee), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: L(() => [S(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": L(({ row: e }) => [C(F(a), {
					size: "sm",
					"icon-only": "",
					title: w("edit") ? `编辑${gn}` : `${gn}详情`,
					"aria-label": w("edit") ? `编辑${gn}` : `${gn}详情`,
					onClick: (t) => Te(e.id)
				}, {
					default: L(() => [C(F(h), {
						name: w("edit") ? "square-pen" : "panel-right-open",
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
			C(F(p), {
				modelValue: B.value,
				"onUpdate:modelValue": n[10] ||= (e) => B.value = e,
				title: `${z.id ? "编辑" : "新增"}公告${gn}`,
				width: "680px",
				subtitle: "公告分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Ee
			}, {
				footer: L(() => [
					z.id && w("delete") ? (k(), v(F(a), {
						key: 0,
						variant: "danger",
						disabled: V.value || xe.value || Q.value,
						onClick: Ae
					}, {
						icon: L(() => [C(F(h), {
							name: "trash-2",
							size: 14
						})]),
						default: L(() => [n[16] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(F(a), {
						disabled: Q.value,
						onClick: De
					}, {
						default: L(() => [...n[17] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Z.value ? y("", !0) : (k(), v(F(a), {
						key: 1,
						variant: "primary",
						loading: K.value,
						disabled: V.value || xe.value || q.value || Ce.value,
						onClick: ke
					}, {
						default: L(() => [S("保存" + P(gn))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: L(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": V.value
				}, [
					V.value ? (k(), b("div", pn, [C(F(h), {
						name: "loader-circle",
						class: "announcement-spin",
						size: 24
					}), x("span", null, "正在读取" + P(gn) + "...")])) : y("", !0),
					Se.value ? (k(), v(F(f), {
						key: 1,
						type: "error",
						closable: !1,
						description: Se.value
					}, null, 8, ["description"])) : y("", !0),
					!V.value && !xe.value ? (k(), v(F(d), {
						key: 2,
						model: z,
						"label-position": "top",
						onSubmit: he(ke, ["prevent"])
					}, {
						default: L(() => [
							z.id ? (k(), v(F(m), {
								key: 0,
								label: "分类ID"
							}, {
								default: L(() => [C(F(ae), {
									"model-value": z.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : y("", !0),
							C(F(m), {
								label: `${gn}名称`,
								required: ""
							}, {
								default: L(() => [C(F(ae), {
									modelValue: z.name,
									"onUpdate:modelValue": n[1] ||= (e) => z.name = e,
									maxlength: 120,
									disabled: Z.value || Q.value,
									"aria-label": `${gn}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							C(F(m), { label: "父分类" }, {
								default: L(() => [x("div", mn, [C(F(ie), {
									modelValue: z.parent_id,
									"onUpdate:modelValue": n[2] ||= (e) => z.parent_id = e,
									options: Me.value,
									disabled: Z.value || Q.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), n[15] ||= x("p", { class: "announcement-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类公告。 ", -1)])]),
								_: 1
							}),
							C(F(m), { label: "分类图片" }, {
								default: L(() => [C(e, {
									class: "taxonomy-editor__image",
									modelValue: z.image_url,
									"onUpdate:modelValue": n[3] ||= (e) => z.image_url = e,
									label: "分类图片",
									upload: F(oe),
									disabled: Z.value || Q.value,
									"onUpdate:mediaId": n[4] ||= (e) => z.image_media_id = e,
									onBusyChange: n[5] ||= (e) => Ce.value = e,
									onStart: n[6] ||= (e) => Se.value = "",
									onError: n[7] ||= (e) => Se.value = F(i)(e)
								}, null, 8, [
									"modelValue",
									"upload",
									"disabled"
								])]),
								_: 1
							}),
							x("div", hn, [C(F(m), {
								label: "前端排序",
								required: ""
							}, {
								default: L(() => [C(F(o), {
									modelValue: z.sort_order,
									"onUpdate:modelValue": n[8] ||= (e) => z.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Z.value || Q.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(F(m), { label: "启用状态" }, {
								default: L(() => [C(J, {
									modelValue: z.is_enabled,
									"onUpdate:modelValue": n[9] ||= (e) => z.is_enabled = e,
									disabled: Z.value || Q.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : y("", !0)
				], 8, fn)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(F(p), {
				modelValue: be.value,
				"onUpdate:modelValue": n[12] ||= (e) => be.value = e,
				title: "删除公告分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !q.value
			}, {
				footer: L(() => [C(F(a), {
					disabled: q.value,
					onClick: n[11] ||= (e) => be.value = !1
				}, {
					default: L(() => [...n[18] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(a), {
					variant: "danger",
					loading: q.value,
					onClick: je
				}, {
					default: L(() => [...n[19] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: L(() => [x("p", null, "确认删除分类“" + P(z.name) + "”？有关联公告或子分类的分类无法删除。", 1), Y.value ? (k(), v(F(f), {
					key: 0,
					type: "error",
					closable: !1,
					description: Y.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(F(p), {
				modelValue: X.value,
				"onUpdate:modelValue": n[14] ||= (e) => X.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: L(() => [C(F(a), { onClick: n[13] ||= (e) => X.value = !1 }, {
					default: L(() => [...n[20] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(F(a), {
					variant: "primary",
					onClick: Oe
				}, {
					default: L(() => [...n[21] ||= [S("放弃修改", -1)]]),
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
}, Nn = /*#__PURE__*/ g(/* @__PURE__ */ w({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: n }) {
		let { hasPermission: i } = ge(), { announcementError: s, announcementCategoryLabel: c, deleteAnnouncement: l, getAnnouncementDetail: ee, getAnnouncementMetadata: te, saveAnnouncement: ne, uploadAnnouncementCover: re } = un(), g = t, w = n, T = M(!0), E = M(!1), D = M(!1), O = M(""), A = M(!1), le = M(!1), N = M(!1), ue = M(!1), I = M(ge().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), fe = M(), me = M("draft"), R = M(!1), z = _(() => i(["cms_announcement:publish"])), B = _(() => !i([`cms_announcement:${g.articleId ? "edit" : "add"}`]) || !z.value && me.value !== "draft"), V = _(() => i(["cms_announcement:delete"]) && (z.value || me.value === "draft"));
		async function ve() {
			if (!(!V.value || E.value || T.value || D.value)) {
				E.value = !0, O.value = "";
				try {
					await l("articles", U.id, U.row_version), Q = JSON.stringify(U), u.success("公告已删除"), w("saved");
				} catch (e) {
					O.value = s(e), ue.value = !1;
				} finally {
					E.value = !1;
				}
			}
		}
		let H = _(() => B.value || E.value), U = j({
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
		}), { editorRoot: W, seoInput: G, fieldRules: ye, fieldErrors: K, pendingCount: q, saveError: J, validateSave: be, setSaveFailure: Y, focusFirstError: xe, focusSeoError: Se } = Ee(U, () => fe.value?.categories || [], "announcement", A), X = _(() => (fe.value?.categories || []).filter((e) => e.parent_id != null).map((e) => ({
			label: c(fe.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), Z = _(() => fe.value?.categories.find((e) => e.id === U.category_id && e.parent_id == null)), Ce = _({
			get: () => Z.value ? "" : U.category_id,
			set: (e) => {
				U.category_id = e;
			}
		}), Q = "", $;
		function we(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Te() {
			$?.abort(), $ = new AbortController();
			let e = $;
			T.value = !0, D.value = !1, O.value = "";
			try {
				if (fe.value = await te(e.signal, { cms_source_type: "platform" }), g.articleId) {
					let t = await ee("articles", g.articleId, e.signal);
					if (fe.value = await te(e.signal, { space_id: String(t.space_id) }), I.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					U.scheduled_local = t.publish_status === "scheduled" ? we(t.scheduled_at) : "", me.value = t.publish_status;
				}
				Q = JSON.stringify(U);
			} catch (t) {
				e.signal.aborted || (O.value = s(t), D.value = !0);
			} finally {
				e.signal.aborted || (T.value = !1);
			}
		}
		let De = () => !T.value && !D.value && Q !== JSON.stringify(U);
		function Oe() {
			De() ? le.value = !0 : w("close");
		}
		function ke() {
			me.value === "draft" ? je("draft") : N.value = !0;
		}
		function Ae() {
			N.value = !1, je("draft");
		}
		async function je(e) {
			if (H.value || T.value || D.value || R.value || (O.value = "", !await be(e))) return;
			let t = U.scheduled_local ? new Date(U.scheduled_local) : null;
			E.value = !0, O.value = "";
			try {
				await ne("articles", {
					...U,
					id: U.id || void 0,
					row_version: U.id ? U.row_version : void 0,
					category_id: U.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), Q = JSON.stringify(U), u.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "公告已发布"), w("saved");
			} catch (e) {
				Y(e);
			} finally {
				E.value = !1;
			}
			q.value && await xe();
		}
		function Me(e) {
			O.value = s(e);
		}
		let Ne = (e) => {
			De() && (e.preventDefault(), e.returnValue = "");
		};
		return _e(() => !E.value && !R.value && (!De() || window.confirm("公告有未保存的修改，确定离开？"))), ce(() => {
			Te(), window.addEventListener("beforeunload", Ne);
		}), se(() => {
			$?.abort(), window.removeEventListener("beforeunload", Ne);
		}), (n, i) => (k(), b("section", {
			ref_key: "editorRoot",
			ref: W,
			class: "article-editor",
			"aria-busy": T.value || E.value
		}, [
			x("header", yn, [
				C(F(a), {
					"icon-only": "",
					title: "返回公告列表",
					"aria-label": "返回公告列表",
					disabled: E.value || R.value,
					onClick: Oe
				}, {
					default: L(() => [C(F(h), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", bn, [x("h2", null, P(t.articleId ? "编辑公告" : "新增公告"), 1), x("span", null, P(fe.value?.source_locale || "zh-CN") + " · " + P(I.value), 1)]),
				x("div", xn, [
					t.articleId && V.value ? (k(), v(F(a), {
						key: 0,
						size: "sm",
						disabled: T.value || D.value || E.value || R.value,
						onClick: i[0] ||= (e) => ue.value = !0
					}, {
						default: L(() => [...i[29] ||= [S("删除公告", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(F(a), {
						size: "sm",
						disabled: T.value || D.value,
						onClick: i[1] ||= (e) => A.value = !0
					}, {
						icon: L(() => [C(F(h), {
							name: "search",
							size: 14
						})]),
						default: L(() => [i[30] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					B.value ? y("", !0) : (k(), v(F(a), {
						key: 1,
						size: "sm",
						disabled: T.value || D.value || E.value || R.value,
						onClick: ke
					}, {
						icon: L(() => [C(F(h), {
							name: "save",
							size: 14
						})]),
						default: L(() => [i[31] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					F(J) ? (k(), b("span", Sn, P(F(J)), 1)) : y("", !0),
					!B.value && F(q) ? (k(), b("span", Cn, "还有 " + P(F(q)) + " 项待完善", 1)) : y("", !0),
					!B.value && z.value ? (k(), v(F(a), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: T.value || D.value || R.value,
						loading: E.value,
						onClick: i[2] ||= (e) => je(U.scheduled_local ? "scheduled" : "published")
					}, {
						icon: L(() => [C(F(h), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: L(() => [S(P(U.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)
				])
			]),
			T.value ? (k(), b("div", wn, [C(F(h), {
				name: "loader-circle",
				class: "announcement-spin",
				size: 28
			}), i[32] ||= x("span", null, "正在读取公告资料...", -1)])) : D.value ? (k(), b("div", Tn, [C(F(f), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"]), C(F(a), { onClick: Te }, {
				default: L(() => [...i[33] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (k(), b(oe, { key: 2 }, [O.value ? (k(), b("div", En, [C(F(f), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"])])) : y("", !0), x("div", Dn, [x("aside", On, [C(F(d), {
				model: U,
				rules: F(ye),
				"label-position": "top",
				onSubmit: i[13] ||= he(() => {}, ["prevent"])
			}, {
				default: L(() => [
					C(F(m), {
						label: "公告分类",
						prop: "category_id",
						error: F(K).category_id,
						required: ""
					}, {
						default: L(() => [C(F(ie), {
							modelValue: Ce.value,
							"onUpdate:modelValue": i[3] ||= (e) => Ce.value = e,
							options: X.value,
							placeholder: Z.value ? "原分类：" + Z.value.name + "（一级）" : "请选择二级分类",
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
					i[34] ||= x("h3", null, "公告设置", -1),
					C(F(m), {
						label: "公告封面",
						prop: "cover_url",
						error: F(K).cover_url
					}, {
						default: L(() => [C(e, {
							modelValue: U.cover_url,
							"onUpdate:modelValue": i[4] ||= (e) => U.cover_url = e,
							label: "公告封面",
							disabled: H.value,
							upload: F(re),
							onBusyChange: i[5] ||= (e) => R.value = e,
							onStart: i[6] ||= (e) => O.value = "",
							onError: Me
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "内容来源",
						prop: "content_source",
						error: F(K).content_source
					}, {
						default: L(() => [C(F(ae), {
							modelValue: U.content_source,
							"onUpdate:modelValue": i[7] ||= (e) => U.content_source = e,
							maxlength: 160,
							disabled: H.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "作者署名",
						prop: "author_name",
						error: F(K).author_name
					}, {
						default: L(() => [C(F(ae), {
							modelValue: U.author_name,
							"onUpdate:modelValue": i[8] ||= (e) => U.author_name = e,
							maxlength: 120,
							disabled: H.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "前端排序",
						prop: "sort_order",
						error: F(K).sort_order
					}, {
						default: L(() => [C(F(o), {
							modelValue: U.sort_order,
							"onUpdate:modelValue": i[9] ||= (e) => U.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: H.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[35] ||= x("h3", null, "发布设置", -1),
					C(F(m), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: F(K).helpful_enabled
					}, {
						default: L(() => [C(Tt, {
							modelValue: U.helpful_enabled,
							"onUpdate:modelValue": i[10] ||= (e) => U.helpful_enabled = e,
							disabled: H.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "启用状态",
						prop: "is_enabled",
						error: F(K).is_enabled
					}, {
						default: L(() => [C(Tt, {
							modelValue: U.is_enabled,
							"onUpdate:modelValue": i[11] ||= (e) => U.is_enabled = e,
							disabled: H.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: F(K).scheduled_local
					}, {
						default: L(() => [C(F(ae), {
							modelValue: U.scheduled_local,
							"onUpdate:modelValue": i[12] ||= (e) => U.scheduled_local = e,
							type: "datetime-local",
							disabled: H.value || !z.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[36] ||= x("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", kn, [C(F(d), {
				model: U,
				rules: F(ye),
				"label-position": "top",
				onSubmit: i[17] ||= he(() => {}, ["prevent"])
			}, {
				default: L(() => [
					C(F(m), {
						label: "标题",
						prop: "title",
						error: F(K).title,
						required: ""
					}, {
						default: L(() => [C(F(ae), {
							modelValue: U.title,
							"onUpdate:modelValue": i[14] ||= (e) => U.title = e,
							maxlength: 255,
							disabled: H.value,
							placeholder: "输入公告标题",
							"aria-label": "公告标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "摘要",
						prop: "summary",
						error: F(K).summary
					}, {
						default: L(() => [pe(x("textarea", {
							"onUpdate:modelValue": i[15] ||= (e) => U.summary = e,
							"aria-invalid": !!F(K).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: H.value,
							"aria-label": "公告摘要"
						}, null, 8, An), [[de, U.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "正文",
						prop: "body_html",
						error: F(K).body_html
					}, {
						default: L(() => [C(F(r), {
							modelValue: U.body_html,
							"onUpdate:modelValue": i[16] ||= (e) => U.body_html = e,
							readonly: B.value,
							disabled: E.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "公告正文"
						}, {
							"image-upload": L(({ url: t, setUrl: n, setBusy: r }) => [C(e, {
								label: "正文图片",
								"model-value": t,
								upload: F(re),
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
			C(F(p), {
				modelValue: A.value,
				"onUpdate:modelValue": i[21] ||= (e) => A.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: L(() => [C(F(a), {
					variant: "primary",
					onClick: i[20] ||= (e) => A.value = !1
				}, {
					default: L(() => [...i[37] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: L(() => [C(F(d), {
					model: U,
					rules: F(ye),
					"label-position": "top",
					onSubmit: i[19] ||= he(() => {}, ["prevent"])
				}, {
					default: L(() => [C(F(m), {
						label: "SEO 描述",
						prop: "seo_description",
						error: F(K).seo_description
					}, {
						default: L(() => [pe(x("textarea", {
							ref_key: "seoInput",
							ref: G,
							"onUpdate:modelValue": i[18] ||= (e) => U.seo_description = e,
							"aria-invalid": !!F(K).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: H.value,
							"aria-label": "SEO 描述"
						}, null, 8, jn), [[de, U.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(F(p), {
				modelValue: ue.value,
				"onUpdate:modelValue": i[23] ||= (e) => ue.value = e,
				title: "确认删除",
				subtitle: `操作对象：${U.title || "未命名公告"}`,
				width: "460px",
				"panel-class": "announcement-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !E.value
			}, {
				"header-actions": L(() => [x("span", Mn, [C(F(h), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: L(() => [C(F(a), {
					disabled: E.value,
					onClick: i[22] ||= (e) => ue.value = !1
				}, {
					default: L(() => [...i[38] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(a), {
					variant: "warning",
					loading: E.value,
					onClick: ve
				}, {
					default: L(() => [...i[39] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: L(() => [C(F(f), {
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
			C(F(p), {
				modelValue: le.value,
				"onUpdate:modelValue": i[26] ||= (e) => le.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: L(() => [C(F(a), { onClick: i[24] ||= (e) => le.value = !1 }, {
					default: L(() => [...i[40] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(F(a), {
					variant: "primary",
					onClick: i[25] ||= (e) => w("close")
				}, {
					default: L(() => [...i[41] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(F(p), {
				modelValue: N.value,
				"onUpdate:modelValue": i[28] ||= (e) => N.value = e,
				title: "将公告转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: L(() => [C(F(a), { onClick: i[27] ||= (e) => N.value = !1 }, {
					default: L(() => [...i[42] ||= [S("取消", -1)]]),
					_: 1
				}), C(F(a), {
					variant: "primary",
					onClick: Ae
				}, {
					default: L(() => [...i[43] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, vn));
	}
}), [["__scopeId", "data-v-6f468168"]]), Pn = { class: "announcement-articles" }, Fn = /*#__PURE__*/ g(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = ge(), { formatDateTime: n } = ge(), { announcementPublishStates: r, announcementCategoryLabel: i, getAnnouncementList: o, getAnnouncementMetadata: s } = un(), c = M(!1), l = M(), u = (e) => t([`cms_announcement:${e}`]), d = M(), f = G(s, (e) => {
			d.value = e;
		}), re = [
			...W(),
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
				formatter: (e) => i(d.value, e)
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
				formatter: n
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], p = _(() => [
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
					label: i(d.value, e.id),
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
		]), { proTableBindings: ie, reload: m } = f.bindTable(te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: p,
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
		})), ae = f.loadMetadata;
		function g(e) {
			l.value = e, c.value = !0;
		}
		function oe() {
			c.value = !1, m(), ae();
		}
		return (e, t) => (k(), b("div", Pn, [c.value ? (k(), v(Nn, {
			key: 0,
			"article-id": l.value,
			onClose: t[0] ||= (e) => c.value = !1,
			onSaved: oe
		}, null, 8, ["article-id"])) : y("", !0), pe(C(F(ne), E(F(ie), {
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
			"cell-cms_source_type": L(({ row: e }) => [C(ye, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": L(() => [u("add") ? (k(), v(F(a), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => g()
			}, {
				icon: L(() => [C(F(h), {
					name: "plus",
					size: 14
				})]),
				default: L(() => [t[2] ||= S("新增公告", -1)]),
				_: 1
			})) : y("", !0)]),
			"cell-publish_status": L(({ row: e }) => [C(F(ee), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: L(() => [S(P(F(r).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": L(({ row: e }) => [C(F(ee), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: L(() => [S(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": L(({ row: e }) => [S(P(F(n)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": L(({ row: e }) => [C(F(a), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑公告" : "公告详情",
				"aria-label": u("edit") ? "编辑公告" : "公告详情",
				onClick: (t) => g(e.id)
			}, {
				default: L(() => [C(F(h), {
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
}, Lr = {
	key: 1,
	class: "region-status"
}, Rr = {
	key: 2,
	class: "mm-translation-settings"
}, zr = { class: "mm-translation-settings__credential" }, Br = { key: 0 }, Vr = { key: 1 }, Hr = { key: 2 }, Ur = { class: "mm-translation-settings__grid" }, Wr = { class: "job-confirm" }, Gr = /*#__PURE__*/ g(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { cancelTranslationJob: n, createTranslationJob: r, getTranslationDetail: l, getTranslationJob: d, getTranslationList: te, getTranslationMetadata: ne, getTranslationSettings: g, saveTranslations: w, saveTranslationSettings: T, testTranslationConnection: E } = In(), { hasPermission: A } = ge(), j = M(), N = M(""), ue = M("news:content"), I = M([]), he = M(), R = M(""), z = M("title"), B = M(""), V = M(""), ve = M(1), H = M(0), U = M({}), W = M(!1), G = M(!1), ye = M(!1), K = M(!1), q = M(""), J = M(""), be = M(), Y = M(null), xe = M(!1), Se = M(""), X = M(!1), Z = M(), Ce = M(""), Q = M(!1), $ = M(!1), we = M(!1), Te = M("field"), Ee = M([]), De = M(""), Oe = M(!1), ke = M(!1);
		fe(xe, (e) => {
			e || (Se.value = "");
		});
		let Ae, je, Me, Ne, Pe, Fe = new AbortController(), Ie, Le = "", Re = _(() => A(["cms_translation:edit"])), ze = _(() => A(["cms_translation:config"])), Be = _(() => A(["cms_translation:translate"])), Ve = _(() => K.value || Q.value || Oe.value), He = _(() => zn(he.value, U.value).length > 0), Ue = _(() => Ln(j.value?.done || 0, j.value?.total || 0)), We = _(() => ({
			space_id: N.value,
			module: ue.value.split(":")[0],
			kind: ue.value.endsWith(":category") ? "category" : "content"
		})), Ge = _(() => j.value?.spaces.map((e) => ({
			label: e.label + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		})) || []), Ke = _(() => j.value?.locales.filter((e) => e.code !== j.value?.source_locale) || []), qe = _(() => Ke.value.map((e) => ({
			label: `${e.flag} ${e.label}`,
			value: e.code
		}))), Je = _(() => Ke.value.map((e) => ({
			label: `${e.label} · ${e.code}`,
			value: e.code
		}))), Ye = _(() => qe.value.filter((e) => nt(String(e.value)))), Xe = _(() => j.value?.locales.find((e) => e.code === j.value?.source_locale)?.label || j.value?.source_locale || "简体中文"), Ze = _(() => he.value?.fields.find((e) => e.key === z.value)), Qe = _(() => {
			let e = j.value?.modules.find((e) => e.key === ue.value);
			return e?.kind === "category" ? `${j.value?.modules.find((t) => t.module === e.module && t.kind === "content")?.label || ""}分类` : e?.label || "新闻";
		}), $e = _(() => {
			let e = [];
			for (let t of j.value?.modules || []) {
				let n = e.find((e) => e[0].module === t.module);
				n ? n.push(t) : e.push([t]);
			}
			return e;
		}), et = _(() => !!N.value && j.value?.space_enabled && !!j.value.target_locales.length && !Hn(Y.value) && !Ve.value && !He.value && !W.value && !G.value), tt = _(() => Y.value ? Ln([
			"succeeded",
			"skipped",
			"cancelled"
		].reduce((e, t) => e + (Y.value?.counts[t] || 0), 0) + (Hn(Y.value) ? 0 : Y.value.counts.failed || 0), Y.value.total) : 0), nt = (e) => j.value?.target_locales.includes(e) ?? !1, rt = (e) => j.value?.locales.find((t) => t.code === e), it = (e) => ({
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
			Ae = void 0, ke.value = !1, U.value = he.value ? Bn(he.value) : {}, e?.();
		}
		function st() {
			ke.value = !1, Ae = void 0, Pe?.(!1), Pe = void 0;
		}
		function ct(e) {
			e !== N.value && at(() => {
				N.value = e, B.value = "", V.value = "", ve.value = 1, Y.value = null, pt();
			});
		}
		function lt(e) {
			e.available && ue.value !== e.key && at(() => {
				ue.value = e.key, B.value = "", V.value = "", ve.value = 1, ht();
			});
		}
		function ut(e) {
			at(() => {
				ve.value = e, ht();
			});
		}
		function dt() {
			at(() => {
				V.value = B.value.trim(), ve.value = 1, ht();
			});
		}
		function ft(e) {
			e !== R.value && at(() => {
				gt(e);
			});
		}
		async function pt() {
			Ne?.abort();
			let e = Ne = new AbortController();
			W.value = !0, q.value = "";
			try {
				let t = await ne(N.value || void 0, e.signal);
				if (e.signal.aborted) return;
				j.value = t, N.value = t.space_id || "", await ht(), Tt();
			} catch (t) {
				e.signal.aborted || (q.value = Gn(t));
			} finally {
				e.signal.aborted || (W.value = !1);
			}
		}
		async function mt() {
			let e = N.value;
			if (e) try {
				let t = await ne(e, Fe.signal);
				e === N.value && (j.value = t);
			} catch {}
		}
		async function ht() {
			je?.abort(), Me?.abort();
			let e = je = new AbortController();
			if (G.value = !0, ye.value = !1, he.value = void 0, R.value = "", U.value = {}, q.value = "", !N.value) {
				I.value = [], H.value = 0, G.value = !1;
				return;
			}
			let t = { ...We.value };
			try {
				let n = await te(t, V.value, ve.value, e.signal);
				if (e.signal.aborted) return;
				I.value = n.lists, H.value = n.count, I.value[0] && await gt(I.value[0].id);
			} catch (t) {
				e.signal.aborted || (I.value = [], H.value = 0, q.value = Gn(t));
			} finally {
				e.signal.aborted || (G.value = !1);
			}
		}
		async function gt(e) {
			Me?.abort();
			let t = Me = new AbortController();
			ye.value = !0, R.value = e, he.value = void 0, U.value = {}, q.value = "";
			try {
				let n = await l({ ...We.value }, e, t.signal);
				if (t.signal.aborted) return;
				he.value = n, U.value = Bn(n), n.fields.some((e) => e.key === z.value) || (z.value = n.fields[0]?.key || ""), be.value?.scrollTo({ top: 0 });
			} catch (e) {
				t.signal.aborted || (q.value = Gn(e));
			} finally {
				t.signal.aborted || (ye.value = !1);
			}
		}
		async function _t() {
			if (!he.value || !Re.value || Ve.value) return;
			let e = zn(he.value, U.value);
			if (e.length) {
				if (e.some((e) => !e.text.trim())) {
					q.value = "译文不能为空；未翻译的语言请保持未填写。";
					return;
				}
				K.value = !0, q.value = "";
				try {
					let t = await w({ ...We.value }, he.value.id, e);
					he.value = t, U.value = Bn(t);
					let n = I.value.findIndex((e) => e.id === t.id);
					n >= 0 && (I.value[n] = t), u.success("翻译已保存"), mt();
				} catch (e) {
					q.value = Gn(e);
				} finally {
					K.value = !1;
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
			if (!(!ze.value || !N.value)) {
				xe.value = !0, X.value = !0, Ce.value = "", Z.value = void 0, Se.value = "";
				try {
					Z.value = await g(N.value, Fe.signal);
				} catch (e) {
					Ce.value = Gn(e);
				} finally {
					X.value = !1;
				}
			}
		}
		async function bt() {
			if (!(!Z.value || Q.value)) {
				if (He.value) {
					Ce.value = "请先保存或放弃当前译文修改，再修改配置。";
					return;
				}
				Q.value = !0, Ce.value = "";
				try {
					await T(Z.value, Se.value.trim()), Se.value = "", xe.value = !1, u.success("翻译配置已保存"), await pt();
				} catch (e) {
					Ce.value = Gn(e);
				} finally {
					Q.value = !1;
				}
			}
		}
		async function xt() {
			if (!(!Z.value || $.value || Q.value)) {
				$.value = !0, Ce.value = "";
				try {
					await E(Z.value.space_id, Z.value.space_revision, Se.value.trim()), u.success("Google Translate 连接成功");
				} catch (e) {
					Ce.value = Gn(e);
				} finally {
					$.value = !1;
				}
			}
		}
		function St(e) {
			Te.value = e, Ee.value = [...j.value?.target_locales || []], De.value = "", Le = crypto.randomUUID(), we.value = !0;
		}
		async function Ct() {
			if (!(!Ee.value.length || Oe.value)) {
				Oe.value = !0, De.value = "";
				try {
					let e = await r({ ...We.value }, {
						request_key: Le,
						target_locales: Ee.value,
						...Te.value === "field" ? {
							id: R.value,
							field_name: z.value
						} : { keyword: V.value }
					});
					Y.value = e.job, we.value = !1, u.success("翻译任务已提交"), wt();
				} catch (e) {
					De.value = Gn(e);
				} finally {
					Oe.value = !1;
				}
			}
		}
		function wt() {
			clearTimeout(Ie), Hn(Y.value) && (Ie = setTimeout(() => {
				Tt();
			}, 3e3));
		}
		async function Tt() {
			let e = N.value;
			if (!e || Fe.signal.aborted) return;
			let t = Hn(Y.value);
			try {
				let n = await d(e, Fe.signal);
				if (e !== N.value) return;
				Y.value = n.job, t && !Hn(Y.value) && (await mt(), !He.value && !Ve.value && R.value && await gt(R.value));
			} catch {}
			wt();
		}
		async function Et() {
			if (Y.value) try {
				let e = await n(N.value, Y.value.id);
				Y.value = e.job, clearTimeout(Ie), mt();
			} catch (e) {
				q.value = Gn(e);
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
			Se.value = "", Pe?.(!1), Fe.abort(), je?.abort(), Me?.abort(), Ne?.abort(), clearTimeout(Ie), window.removeEventListener("beforeunload", Dt);
		}), (e, n) => (k(), b("section", {
			class: "translations-page",
			"aria-label": "多语言翻译管理",
			"aria-busy": W.value
		}, [
			x("header", qn, [x("div", Jn, [x("span", Yn, [C(F(h), {
				name: "globe",
				size: 21
			})]), x("div", null, [n[21] ||= x("h1", null, "语言翻译管理", -1), x("div", Xn, [
				x("strong", null, P(Ue.value) + "%", 1),
				C(F(t), {
					percentage: Ue.value,
					"show-text": !1,
					"stroke-width": 4,
					"aria-label": "全部翻译完成度"
				}, null, 8, ["percentage"]),
				x("span", null, P(j.value?.done.toLocaleString() || 0) + " / " + P(j.value?.total.toLocaleString() || 0) + " 个目标字段", 1)
			])])]), x("div", Zn, [
				C(F(ie), {
					"model-value": N.value,
					options: Ge.value,
					size: "sm",
					disabled: W.value || Ve.value,
					placeholder: "内容空间",
					"aria-label": "内容空间",
					"onUpdate:modelValue": n[0] ||= (e) => ct(String(e))
				}, null, 8, [
					"model-value",
					"options",
					"disabled"
				]),
				x("span", Qn, [n[22] ||= S("内容源语言 ", -1), x("b", null, P(Xe.value), 1)]),
				ze.value ? (k(), v(F(a), {
					key: 0,
					size: "sm",
					disabled: !N.value || Ve.value,
					onClick: yt
				}, {
					icon: L(() => [C(F(h), {
						name: "sliders-horizontal",
						size: 14
					})]),
					default: L(() => [n[23] ||= S("翻译配置", -1)]),
					_: 1
				}, 8, ["disabled"])) : y("", !0),
				Be.value ? (k(), v(F(a), {
					key: 1,
					size: "sm",
					disabled: !et.value,
					onClick: n[1] ||= (e) => St("batch")
				}, {
					icon: L(() => [C(F(h), {
						name: "rocket",
						size: 14
					})]),
					default: L(() => [n[24] ||= S("批量翻译", -1)]),
					_: 1
				}, 8, ["disabled"])) : y("", !0),
				Be.value ? (k(), v(F(a), {
					key: 2,
					size: "sm",
					disabled: !et.value || !he.value || !Ze.value?.translatable,
					onClick: n[2] ||= (e) => St("field")
				}, {
					icon: L(() => [C(F(h), {
						name: "globe",
						size: 14
					})]),
					default: L(() => [n[25] ||= S("翻译当前字段", -1)]),
					_: 1
				}, 8, ["disabled"])) : y("", !0),
				Re.value ? (k(), v(F(a), {
					key: 3,
					size: "sm",
					variant: "primary",
					loading: K.value,
					disabled: !He.value || Ve.value || !j.value?.space_enabled,
					onClick: _t
				}, {
					icon: L(() => [C(F(h), {
						name: "save",
						size: 14
					})]),
					default: L(() => [n[26] ||= S("保存翻译", -1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : y("", !0)
			])]),
			q.value ? (k(), v(F(f), {
				key: 0,
				type: "error",
				closable: !0,
				onClose: n[3] ||= (e) => q.value = ""
			}, {
				default: L(() => [S(P(q.value), 1)]),
				_: 1
			})) : y("", !0),
			j.value && !j.value.space_enabled && N.value ? (k(), v(F(f), {
				key: 1,
				type: "warning"
			}, {
				default: L(() => [...n[27] ||= [S("当前内容空间已停用，仅可查看翻译。", -1)]]),
				_: 1
			})) : y("", !0),
			j.value && !j.value.target_locales.length && N.value ? (k(), v(F(f), {
				key: 2,
				type: "info"
			}, {
				default: L(() => [...n[28] ||= [S("尚未启用目标语言，请在“翻译配置”中选择语言后开始翻译。", -1)]]),
				_: 1
			})) : y("", !0),
			Y.value ? (k(), b("div", $n, [
				C(F(h), {
					name: F(Hn)(Y.value) ? "loader-circle" : "info",
					size: 15
				}, null, 8, ["name"]),
				x("strong", null, P(F(Un)[Y.value.status] || Y.value.status), 1),
				x("span", null, "任务 #" + P(Y.value.id), 1),
				C(F(t), {
					percentage: tt.value,
					"show-text": !1,
					"stroke-width": 4
				}, null, 8, ["percentage"]),
				x("span", null, [
					S(P(Y.value.counts.succeeded || 0) + " / " + P(Y.value.total) + " 已完成", 1),
					Y.value.counts.failed ? (k(), b("span", er, " · " + P(Y.value.counts.failed) + " 失败", 1)) : y("", !0),
					Y.value.counts.skipped ? (k(), b("span", tr, " · " + P(Y.value.counts.skipped) + " 冲突跳过", 1)) : y("", !0)
				]),
				F(Hn)(Y.value) && Be.value ? (k(), v(F(a), {
					key: 0,
					size: "sm",
					variant: "text",
					disabled: Ve.value,
					onClick: Et
				}, {
					default: L(() => [...n[29] ||= [S("取消任务", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (k(), v(F(a), {
					key: 1,
					size: "sm",
					variant: "text",
					onClick: n[4] ||= (e) => Y.value = null
				}, {
					default: L(() => [...n[30] ||= [S("收起", -1)]]),
					_: 1
				})),
				Y.value.errors.length ? (k(), b("span", {
					key: 2,
					class: "translation-job__error",
					title: Y.value.errors.map((e) => `${e.target_locale}: ${e.error_code}`).join("；")
				}, P(Y.value.errors[0].error_code) + "（可重新提交补翻）", 9, nr)) : y("", !0)
			])) : y("", !0),
			x("div", rr, [(k(!0), b(oe, null, le(Ke.value, (e) => (k(), b("button", {
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
				x("span", null, P(e.flag), 1),
				x("span", null, P(e.label), 1),
				x("strong", null, P(nt(e.code) ? F(Ln)(e.done, e.total) + "%" : "未启用"), 1),
				C(F(t), {
					percentage: F(Ln)(e.done, e.total),
					"show-text": !1,
					"stroke-width": 2
				}, null, 8, ["percentage"])
			], 10, ir))), 128))]),
			x("nav", ar, [(k(!0), b(oe, null, le($e.value, (e) => (k(), b("div", {
				key: e[0].module,
				class: "module-group"
			}, [(k(!0), b(oe, null, le(e, (e) => (k(), v(F(a), {
				key: e.key,
				variant: ue.value === e.key ? "primary" : "text",
				plain: ue.value === e.key,
				size: "sm",
				disabled: !e.available || Ve.value,
				title: e.reason,
				"aria-pressed": ue.value === e.key,
				onClick: (t) => lt(e)
			}, {
				default: L(() => [
					e.kind === "category" ? y("", !0) : (k(), v(F(h), {
						key: 0,
						name: it(e.module),
						size: 14
					}, null, 8, ["name"])),
					S(P(e.label), 1),
					x("span", or, P(e.count), 1)
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
			x("main", sr, [x("aside", cr, [
				x("div", lr, [x("div", null, [x("strong", null, P(Qe.value), 1), x("span", null, P(H.value) + " 条" + P(We.value.kind === "category" ? "分类" : "内容"), 1)]), C(F(ae), {
					modelValue: B.value,
					"onUpdate:modelValue": n[5] ||= (e) => B.value = e,
					size: "sm",
					clearable: "",
					placeholder: "搜索内容",
					"aria-label": "搜索内容",
					onKeydown: me(dt, ["enter"])
				}, {
					prefix: L(() => [C(F(h), {
						name: "search",
						size: 14
					})]),
					_: 1
				}, 8, ["modelValue"])]),
				x("div", {
					class: "content-browser__list",
					"aria-busy": G.value
				}, [G.value ? (k(), b("p", dr, "加载内容中…")) : (k(), b(oe, { key: 1 }, [(k(!0), b(oe, null, le(I.value, (e) => (k(), b("button", {
					key: e.id,
					type: "button",
					class: O(["content-item", { "is-selected": R.value === e.id }]),
					"aria-current": R.value === e.id ? "true" : void 0,
					disabled: Ve.value,
					onClick: (t) => ft(e.id)
				}, [x("span", pr, [x("strong", { title: e.title }, P(e.title), 9, mr), x("small", null, P(F(Wn)[e.publish_status || ""] || "分类") + " · " + P(e.done) + "/" + P(e.total), 1)]), C(F(t), {
					type: "circle",
					percentage: F(Ln)(e.done, e.total),
					"show-text": !1,
					size: 16,
					"stroke-width": 2,
					status: e.total && e.done === e.total ? "success" : "warning"
				}, null, 8, ["percentage", "status"])], 10, fr))), 128)), I.value.length ? y("", !0) : (k(), b("p", hr, P(V.value ? "没有匹配的内容" : "暂无可翻译内容"), 1))], 64))], 8, ur),
				x("footer", gr, [
					C(F(a), {
						size: "sm",
						"icon-only": "",
						"aria-label": "上一页",
						disabled: ve.value <= 1 || G.value || Ve.value,
						onClick: n[6] ||= (e) => ut(ve.value - 1)
					}, {
						default: L(() => [C(F(h), {
							name: "chevron-left",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"]),
					x("span", null, P(ve.value) + " / " + P(Math.max(1, Math.ceil(H.value / 30))), 1),
					C(F(a), {
						size: "sm",
						"icon-only": "",
						"aria-label": "下一页",
						disabled: ve.value * 30 >= H.value || G.value || Ve.value,
						onClick: n[7] ||= (e) => ut(ve.value + 1)
					}, {
						default: L(() => [C(F(h), {
							name: "chevron-right",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"])
				])
			]), x("section", {
				class: "translation-editor",
				"aria-busy": ye.value
			}, [ye.value ? (k(), b("div", vr, [C(F(h), {
				name: "loader-circle",
				size: 28
			}), n[31] ||= x("p", null, "加载译文中…", -1)])) : he.value ? (k(), b(oe, { key: 1 }, [x("header", yr, [x("div", br, [x("span", null, [S(P(Qe.value) + " ", 1), He.value ? (k(), b("em", xr, "有未保存修改")) : y("", !0)]), x("h2", { title: he.value.title }, P(he.value.title), 9, Sr)]), C(F(s), {
				modelValue: z.value,
				"onUpdate:modelValue": n[8] ||= (e) => z.value = e
			}, {
				default: L(() => [(k(!0), b(oe, null, le(he.value.fields, (e) => (k(), v(F(re), {
					key: e.key,
					name: e.key,
					label: `${e.label} ${e.translatable ? F(Vn)(e) + "/" + e.translations.length : "—"}`
				}, null, 8, ["name", "label"]))), 128))]),
				_: 1
			}, 8, ["modelValue"])]), Ze.value ? (k(), b("div", {
				key: 0,
				class: "translation-editor__body",
				ref_key: "editorBody",
				ref: be
			}, [
				x("section", Cr, [x("div", wr, [x("strong", null, [S(P(Xe.value) + " ", 1), C(F(ee), {
					size: "sm",
					type: "primary",
					effect: "soft"
				}, {
					default: L(() => [...n[32] ||= [S("内容源语言", -1)]]),
					_: 1
				})]), n[33] ||= x("span", null, "只读原文", -1)]), x("textarea", {
					value: Ze.value.source,
					readonly: "",
					rows: Ze.value.key === "body_html" ? 5 : 2,
					class: "translation-textarea source-textarea",
					"aria-label": `原文${Ze.value.label}`
				}, null, 8, Tr)]),
				x("div", Er, [n[34] ||= x("strong", null, "目标语言", -1), x("span", null, P(he.value.fields.find((e) => e.key === z.value)?.translations.length || 0) + " 种语言 · 手工修改后请保存", 1)]),
				Ze.value.translatable ? Ze.value.translations.length ? (k(), b("div", {
					key: 2,
					class: O(["target-grid", { "is-body": z.value === "body_html" }])
				}, [(k(!0), b(oe, null, le(Ze.value.translations, (e) => (k(), b("div", {
					key: e.locale,
					class: O(["target-field", { "is-focused": J.value === e.locale }]),
					"data-locale": e.locale
				}, [
					x("div", Ar, [x("label", { for: `translation-${z.value}-${e.locale}` }, [S(P(rt(e.locale)?.native || e.locale) + " ", 1), x("small", null, P(e.locale), 1)], 8, jr), e.status === "stale" ? (k(), b("span", Mr, "原文已更新")) : e.status === "ready" ? (k(), b("span", Nr, P(e.method === "machine" ? "机器翻译" : "已保存"), 1)) : y("", !0)]),
					pe(x("textarea", {
						id: `translation-${z.value}-${e.locale}`,
						"onUpdate:modelValue": (t) => U.value[F(Rn)(z.value, e.locale)] = t,
						class: "translation-textarea",
						rows: z.value === "body_html" ? 10 : 2,
						maxlength: Ze.value.max_length,
						disabled: !Re.value || !j.value?.space_enabled || Ve.value,
						dir: e.locale === "ar" ? "rtl" : "auto",
						placeholder: `请输入${rt(e.locale)?.native || e.locale}翻译${z.value === "body_html" ? "（HTML）" : ""}`
					}, null, 8, Pr), [[de, U.value[F(Rn)(z.value, e.locale)]]]),
					x("div", Fr, P((U.value[F(Rn)(z.value, e.locale)] || "").length.toLocaleString()) + " / " + P(Ze.value.max_length.toLocaleString()), 1)
				], 10, kr))), 128))], 2)) : (k(), b("div", Or, " 请先在“翻译配置”中启用目标语言。 ")) : (k(), b("div", Dr, [C(F(h), {
					name: "info",
					size: 18
				}), n[35] ||= S("原文字段为空，不参与翻译和完成度统计。 ", -1)]))
			], 512)) : y("", !0)], 64)) : (k(), b("div", Ir, [C(F(c), { description: q.value ? "内容加载失败，可点击刷新重试" : "选择左侧内容开始翻译" }, null, 8, ["description"]), q.value ? (k(), v(F(a), {
				key: 0,
				size: "sm",
				onClick: pt
			}, {
				default: L(() => [...n[36] ||= [S("重新加载", -1)]]),
				_: 1
			})) : y("", !0)]))], 8, _r)]),
			C(F(p), {
				modelValue: xe.value,
				"onUpdate:modelValue": n[16] ||= (e) => xe.value = e,
				title: "翻译配置",
				subtitle: "当前内容空间共用 · Google Cloud Translation Basic v2",
				width: "560px",
				"close-on-click-modal": !1,
				"before-close": () => !Q.value && !$.value
			}, {
				footer: L(() => [
					C(F(a), {
						loading: $.value,
						disabled: !Z.value?.credential_configured && !Se.value.trim() || Q.value || X.value,
						onClick: xt
					}, {
						default: L(() => [...n[43] ||= [S("测试连接", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"]),
					C(F(a), {
						disabled: Q.value || $.value,
						onClick: n[15] ||= (e) => xe.value = !1
					}, {
						default: L(() => [...n[44] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					C(F(a), {
						variant: "primary",
						loading: Q.value,
						disabled: !Z.value || X.value || $.value,
						onClick: bt
					}, {
						default: L(() => [...n[45] ||= [S("保存翻译配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])
				]),
				default: L(() => [Ce.value ? (k(), v(F(f), {
					key: 0,
					type: "error"
				}, {
					default: L(() => [S(P(Ce.value), 1)]),
					_: 1
				})) : y("", !0), X.value ? (k(), b("div", Lr, "加载配置中…")) : Z.value ? (k(), b("div", Rr, [
					x("label", null, [n[37] ||= S(" 目标语言 ", -1), C(F(ie), {
						modelValue: Z.value.target_locales,
						"onUpdate:modelValue": n[9] ||= (e) => Z.value.target_locales = e,
						options: Je.value,
						multiple: "",
						filterable: "",
						"max-tag-count": 4,
						placeholder: "选择需要维护的目标语言",
						disabled: Q.value || $.value,
						"aria-label": "翻译目标语言"
					}, null, 8, [
						"modelValue",
						"options",
						"disabled"
					])]),
					C(i, {
						modelValue: Z.value.is_enabled,
						"onUpdate:modelValue": n[10] ||= (e) => Z.value.is_enabled = e,
						disabled: Q.value || $.value,
						"credential-ready": !!Z.value.credential_configured || !!Se.value.trim()
					}, null, 8, [
						"modelValue",
						"disabled",
						"credential-ready"
					]),
					x("div", zr, [
						x("label", null, [n[38] ||= S(" Google API Key ", -1), C(F(ae), {
							modelValue: Se.value,
							"onUpdate:modelValue": n[11] ||= (e) => Se.value = e,
							type: "password",
							autocomplete: "new-password",
							disabled: Q.value || $.value,
							placeholder: Z.value.credential_configured ? "已配置，留空保留原密钥；输入新密钥替换" : "请输入 Google Cloud Translation API Key"
						}, null, 8, [
							"modelValue",
							"disabled",
							"placeholder"
						])]),
						Z.value.api_key_mask ? (k(), b("small", Br, P(Z.value.credential_source === "database" ? "数据库密钥" : "环境配置密钥") + "：" + P(Z.value.api_key_mask), 1)) : y("", !0),
						Z.value.credential_error === "GOOGLE_CREDENTIAL_DECRYPT_FAILED" ? (k(), b("small", Vr, "数据库密钥无法解密，请检查两套后台的专用加密配置，或输入新密钥替换。")) : (k(), b("small", Hr, "密钥加密保存，不回显原文；留空保留原值。未配置密钥时仍可人工翻译。"))
					]),
					x("div", Ur, [
						x("label", null, [n[39] ||= S(" 并发上限 ", -1), C(F(o), {
							modelValue: Z.value.concurrency_limit,
							"onUpdate:modelValue": n[12] ||= (e) => Z.value.concurrency_limit = e,
							min: 1,
							max: 20,
							disabled: Q.value || $.value
						}, null, 8, ["modelValue", "disabled"])]),
						x("label", null, [n[40] ||= S(" 请求超时（秒） ", -1), C(F(o), {
							modelValue: Z.value.request_timeout_seconds,
							"onUpdate:modelValue": n[13] ||= (e) => Z.value.request_timeout_seconds = e,
							min: 1,
							max: 120,
							disabled: Q.value || $.value
						}, null, 8, ["modelValue", "disabled"])]),
						x("label", null, [n[41] ||= S(" 最大尝试次数 ", -1), C(F(o), {
							modelValue: Z.value.max_attempts,
							"onUpdate:modelValue": n[14] ||= (e) => Z.value.max_attempts = e,
							min: 1,
							max: 10,
							disabled: Q.value || $.value
						}, null, 8, ["modelValue", "disabled"])])
					]),
					Z.value.supported ? y("", !0) : (k(), v(F(f), {
						key: 0,
						type: "warning"
					}, {
						default: L(() => [...n[42] ||= [S("当前空间关联了其他版本的翻译配置。保存将为该空间创建独立的 Google v2 配置，不修改其他空间。", -1)]]),
						_: 1
					}))
				])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(F(p), {
				modelValue: we.value,
				"onUpdate:modelValue": n[19] ||= (e) => we.value = e,
				title: Te.value === "field" ? "翻译当前字段" : "批量翻译",
				subtitle: "Google Translate · 仅补齐缺失及原文已更新的译文",
				width: "520px",
				"close-on-click-modal": !1,
				"before-close": () => !Oe.value
			}, {
				footer: L(() => [C(F(a), {
					size: "sm",
					disabled: Oe.value,
					onClick: n[18] ||= (e) => we.value = !1
				}, {
					default: L(() => [...n[47] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(a), {
					variant: "primary",
					size: "sm",
					loading: Oe.value,
					disabled: !Ee.value.length,
					onClick: Ct
				}, {
					default: L(() => [...n[48] ||= [S("确认翻译", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])]),
				default: L(() => [x("div", Wr, [
					x("p", null, P(Te.value === "field" ? `当前内容的「${Ze.value?.label}」` : `当前空间「${Qe.value}」${V.value ? "中匹配搜索条件的内容" : "全部内容"}`), 1),
					C(F(m), { label: "目标语言" }, {
						default: L(() => [C(F(ie), {
							modelValue: Ee.value,
							"onUpdate:modelValue": n[17] ||= (e) => Ee.value = e,
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
					C(F(f), { type: "warning" }, {
						default: L(() => [...n[46] ||= [S("内容将发送至 Google Translate，并可能产生翻译费用。已有有效译文不会覆盖；单次最多 200 条内容、5,000 个字段任务。后台任务需要已启动翻译 worker。", -1)]]),
						_: 1
					}),
					De.value ? (k(), v(F(f), {
						key: 0,
						type: "error"
					}, {
						default: L(() => [S(P(De.value), 1)]),
						_: 1
					})) : y("", !0)
				])]),
				_: 1
			}, 8, [
				"modelValue",
				"title",
				"before-close"
			]),
			C(F(p), {
				modelValue: ke.value,
				"onUpdate:modelValue": n[20] ||= (e) => ke.value = e,
				title: "有未保存的翻译",
				subtitle: "切换后将丢弃当前修改，是否继续？",
				width: "380px",
				onClose: st
			}, {
				footer: L(() => [C(F(a), {
					size: "sm",
					onClick: st
				}, {
					default: L(() => [...n[49] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(F(a), {
					size: "sm",
					variant: "warning",
					onClick: ot
				}, {
					default: L(() => [...n[50] ||= [S("放弃修改并继续", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Kn));
	}
}), [["__scopeId", "data-v-1430b3cb"]]), Kr = {
	key: 0,
	class: "mm-cms-site"
}, qr = ["disabled"], Jr = ["value"], Yr = {
	key: 1,
	role: "alert"
}, Xr = {
	key: 2,
	role: "status"
}, Zr = { key: 3 }, Qr = ["disabled"], $r = /*#__PURE__*/ g(/* @__PURE__ */ w({
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
			"news/categories": Ce,
			"news/list": We,
			"academy/categories": Qe,
			"academy/courses": St,
			"help/categories": Mt,
			"help/articles": Qt,
			"feedback/list": ln,
			"announcement/categories": _n,
			"announcement/list": Fn,
			"localization/translations": Gr
		}, r = t.runtime.mode === "white_label" && !!t.runtime.resolveSiteInRequest, i = M(!1), a = M(0), o = M([]), s = M(""), c = M(""), l = M(t.runtime.mode === "white_label" && !r), u = M(!1), d = _(() => o.value.find((e) => e.site_id === s.value)), ee = _(() => n[t.page]), f = _(() => t.runtime.hasPermission([
			"cms_news:add",
			"cms_academy:add",
			"cms_help:add",
			"cms_announcement:add"
		])), te = new AbortController(), ne = !0, re = !1;
		function p(e) {
			re = !0;
			try {
				o.value = e.sites, s.value = e.site_id ?? "", i.value = !0;
			} finally {
				re = !1;
			}
		}
		let ie = z(t.runtime, p);
		fe(s, () => {
			!r || re || (ie.invalidate(), ie = z(t.runtime, p, d.value?.space_id ?? null), a.value++);
		}, { flush: "sync" });
		function m(e, n) {
			if (!ne || t.runtime.mode === "white_label" && d.value?.space_id !== n) throw Error("站点已切换，请重新操作");
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
		A(R, {
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
		async function ae() {
			if (!d.value || u.value) return;
			let e = a.value;
			u.value = !0;
			try {
				let n = await t.runtime.request.post({
					url: "/cms/initialize",
					params: { site_id: d.value.site_id }
				}, { isOpenRetry: !1 });
				if (!ne || r && e !== a.value) return;
				if (r) {
					if (!n.cms_context) throw Error("初始化接口未返回站点信息");
					ie.invalidate(), ie = z(t.runtime, p, n.cms_context.space_id), p(n.cms_context), a.value++;
				} else await h();
			} catch (e) {
				c.value = e instanceof Error ? e.message : "初始化失败";
			} finally {
				u.value = !1;
			}
		}
		return ce(async () => {
			if (t.runtime.mode === "white_label" && !r) try {
				await h();
			} catch {
				te.signal.aborted || (c.value = "加载站点失败，请刷新重试");
			} finally {
				l.value = !1;
			}
		}), se(() => {
			ne = !1, ie.invalidate(), te.abort();
		}), (t, n) => (k(), b("section", { class: O(["mm-cms-page", { "is-viewport": e.viewport }]) }, [e.runtime.mode === "white_label" && e.showSiteSelector && (!F(r) || i.value) ? (k(), b("header", Kr, [x("label", null, [n[1] ||= S("内容站点 ", -1), pe(x("select", {
			"onUpdate:modelValue": n[0] ||= (e) => s.value = e,
			disabled: l.value
		}, [(k(!0), b(oe, null, le(o.value, (e) => (k(), b("option", {
			key: e.site_id,
			value: e.site_id
		}, P(e.label), 9, Jr))), 128))], 8, qr), [[ue, s.value]])]), n[2] ||= x("span", null, "各站点内容独立管理", -1)])) : y("", !0), c.value ? (k(), b("p", Yr, P(c.value), 1)) : l.value ? (k(), b("p", Xr, "正在加载站点…")) : e.runtime.mode === "white_label" && (!F(r) || i.value) && !d.value?.space_id ? (k(), b("div", Zr, [x("p", null, P(d.value ? "该站点尚未初始化内容空间。" : "暂无可管理的内容站点。"), 1), d.value && f.value ? (k(), b("button", {
			key: 0,
			type: "button",
			disabled: u.value,
			onClick: ae
		}, "初始化空内容空间", 8, Qr)) : y("", !0)])) : (k(), v(N(ee.value), { key: `${e.page}:${e.identityKey}:${F(r) ? a.value : d.value?.space_id ?? "platform"}` }))], 2));
	}
}), [["__scopeId", "data-v-f447749a"]]);
//#endregion
//#region src/cms/permission-tree.ts
function ei(e, t, n = "", r = 0) {
	let i = e.children ?? [], a = e.type === "C" && !!(e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:")), o = t(e), s = n ? `${n} / ${o}` : o, c = a || e.type === "M" && r > 0 ? s : n;
	return [...!i.length || a ? [{
		id: e.id,
		name: a || e.type === "A" && e.perms?.startsWith("cms_") ? s : o
	}] : [], ...i.flatMap((e) => ei(e, t, c, r + 1))];
}
function ti(e, t) {
	let n = new Set(t.map(String)), r = /* @__PURE__ */ new Set(), i = [];
	function a(e) {
		let t = e.children ?? [], o = (!t.length || e.type === "C" && (e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:"))) && n.has(String(e.id));
		for (let e of t) a(e) && (o = !0);
		return o && !r.has(String(e.id)) && (r.add(String(e.id)), i.push(e.id)), !!o;
	}
	return e.forEach(a), i;
}
//#endregion
export { $r as MmCmsPage, e as MmMediaUpload, ei as cmsPermissionItems, ti as cmsPermissionSubmission, l as createMediaUploader };

//# sourceMappingURL=cms.js.map