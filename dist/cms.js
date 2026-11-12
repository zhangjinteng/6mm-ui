import { $r as e, A as t, Hi as n, Kn as r, O as i, Qr as a, Wi as o, Zr as s, _i as ee, _r as c, a as l, ai as u, bi as d, bn as f, gi as te, ii as p, kr as ne, pr as re, vi as ie, yn as m } from "./src-CkRBJhTq.js";
import { a as ae, i as h, n as g } from "./Loading-Djhi-Drb.js";
import { Fragment as oe, computed as _, createBlock as v, createCommentVNode as y, createElementBlock as b, createElementVNode as x, createTextVNode as S, createVNode as C, defineComponent as w, inject as T, mergeProps as E, nextTick as D, normalizeClass as O, onBeforeUnmount as se, onMounted as ce, openBlock as k, provide as A, reactive as j, ref as M, renderList as le, resolveDynamicComponent as N, toDisplayString as P, unref as F, vModelSelect as I, vModelText as ue, vShow as L, watch as de, withCtx as R, withDirectives as fe, withKeys as pe, withModifiers as me } from "vue";
//#region src/cms/runtime.ts
var z = Symbol("MmCms");
function he() {
	let e = T(z);
	if (!e) throw Error("CMS host adapter is missing");
	return e;
}
function ge(e) {
	he().registerBeforeLeave?.(e);
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
}, _e = /*#__PURE__*/ h(/* @__PURE__ */ w({
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
		}, [C(F(g), {
			name: e.expanded ? "chevron-down" : "chevron-right",
			size: 14
		}, null, 8, ["name"])], 8, V)) : (k(), b("span", H)), x("span", null, P(e.name), 1)], 2));
	}
}), [["__scopeId", "data-v-dd16b37d"]]);
//#endregion
//#region src/cms/views/content/categoryTree.ts
async function U(e, t) {
	let n = await e(1, 100), r = [...n.lists];
	for (let i = 2; i <= Math.ceil(n.count / 100); i++) t.throwIfAborted(), r.push(...(await e(i, 100)).lists);
	return {
		rows: r,
		total: r.length
	};
}
function W(e) {
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
function G() {
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
	let n = he().mode === "platform", r = j(n ? [{
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
	ce(() => {
		if (n || t) return l();
	}), se(() => {
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
		return de(() => t.value.cms_source_type, (e) => {
			e === "platform" && (t.value.cms_tenant_id = ""), r[1].disabled = e === "platform";
		}, {
			immediate: !0,
			flush: "sync"
		}), de([() => String(t.value.cms_source_type || ""), () => String(t.value.cms_tenant_id || "")], () => {
			c(t.value), l(), D(() => {
				!o && !ee(a, s(t.value)) && d();
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
		loadMetadata: l
	};
}
//#endregion
//#region src/cms/components/source-type-tag/index.vue
var ve = /* @__PURE__ */ w({
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
		return (e, t) => (k(), v(F(o), {
			effect: "soft",
			round: "",
			size: "sm",
			type: a.value
		}, {
			default: R(() => [S(P(i.value), 1)]),
			_: 1
		}, 8, ["type"]));
	}
});
//#endregion
//#region src/cms/api/content/news.ts
function q() {
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
var J = ["aria-checked", "disabled"], ye = /*#__PURE__*/ h(/* @__PURE__ */ w({
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
		}, [x("span")], -1), x("span", null, P(e.modelValue ? "已启用" : "已停用"), 1)], 10, J));
	}
}), [["__scopeId", "data-v-8b527db1"]]), be = { class: "news-categories" }, Y = ["aria-busy"], xe = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Se = { class: "taxonomy-editor__field" }, X = { class: "taxonomy-editor__row" }, Z = "分类", Ce = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { newsError: t, deleteNews: r, getNewsMetadata: i, getNewsList: a, getNewsDetail: ee, saveNews: c } = q(), { hasPermission: l } = he(), { formatDateTime: te } = he(), h = (e) => l([`cms_news_category:${e}`]), oe = M(), w = M(), T = K(i, (e) => {
			oe.value = e;
		}), D = [
			{
				key: "name",
				dataIndex: "name",
				title: "分类名称",
				width: 210,
				hideable: !1
			},
			...G(),
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
		], { proTableBindings: ce, rows: A, reload: le } = T.bindTable(ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: O,
			request: async ({ filters: e, signal: t, reason: n }) => {
				let r = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), i = await U((e, n) => a("categories", {
					...r,
					page_no: e,
					page_size: n
				}, t), t);
				return !t.aborted && (n === "query" || n === "reset") && (I.value = Object.keys(r).length ? new Set(i.rows.filter((e) => e.parent_id != null).map((e) => String(e.parent_id))) : /* @__PURE__ */ new Set()), i;
			}
		})), { visibleRows: N, expanded: I, groups: ue, allExpanded: L, toggle: de, toggleAll: fe } = W(A), pe = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), z = j(pe()), ge = M(!1), B = M(!1), V = M(!1), H = M(!1), J = M(!1), Ce = M(""), Q = M(!1), $ = M(""), we = M(!1), Te = _(() => !h(z.id ? "edit" : "add")), Ee = _(() => V.value || H.value), De = "", Oe;
		async function ke(e) {
			Oe?.abort(), Oe = new AbortController();
			let n = Oe;
			Object.assign(z, pe(), { id: e || "" }), $.value = "", J.value = !1, Ce.value = "", Q.value = !1, ge.value = !0, B.value = !0, De = JSON.stringify(z);
			try {
				if (w.value = await i(n.signal, { cms_source_type: "platform" }), !e || n.signal.aborted) return;
				let t = await ee("categories", e, n.signal);
				if (w.value = await i(n.signal, { space_id: String(t.space_id) }), n.signal.aborted) return;
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
				n.signal.aborted || (Q.value = !0, $.value = t(e));
			} finally {
				n.signal.aborted || (B.value = !1);
			}
		}
		function Ae() {
			return Ee.value ? !1 : !B.value && !Q.value && JSON.stringify(z) !== De ? (we.value = !0, !1) : (Oe?.abort(), !0);
		}
		function je() {
			Ee.value || (Oe?.abort(), ge.value = !1);
		}
		function Me() {
			we.value = !1, ge.value = !1;
		}
		async function Ne() {
			if (!(Te.value || Ee.value || B.value || Q.value)) {
				if (!z.name.trim() || z.sort_order === null) {
					$.value = "请填写分类名称和排序";
					return;
				}
				V.value = !0, $.value = "";
				try {
					await c("categories", {
						name: z.name,
						parent_id: z.parent_id || null,
						sort_order: z.sort_order,
						is_enabled: z.is_enabled,
						id: z.id || void 0,
						row_version: z.id ? z.row_version : void 0
					}), ge.value = !1, u.success("保存成功"), await Promise.all([le(), Le()]);
				} catch (e) {
					$.value = t(e);
				} finally {
					V.value = !1;
				}
			}
		}
		function Pe() {
			!z.id || !h("delete") || Ee.value || B.value || Q.value || (Ce.value = "", J.value = !0);
		}
		async function Fe() {
			if (!(!J.value || !z.id || !h("delete") || Ee.value || B.value || Q.value)) {
				H.value = !0, Ce.value = "";
				try {
					await r("categories", z.id, z.row_version), J.value = !1, ge.value = !1, u.success("分类已删除"), await Promise.all([le(), Le()]);
				} catch (e) {
					Ce.value = t(e);
				} finally {
					H.value = !1;
				}
			}
		}
		let Ie = _(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(w.value?.categories || []).filter((e) => !e.parent_id && e.id !== z.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Le = T.loadMetadata;
		return se(() => {
			Oe?.abort();
		}), (e, t) => (k(), b("div", be, [
			C(F(re), E(F(ce), {
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
				"cell-cms_source_type": R(({ row: e }) => [C(ve, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [h("add") ? (k(), v(F(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: t[0] ||= (e) => ke()
				}, {
					icon: R(() => [C(F(g), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [S("新增" + P(Z))]),
					_: 1
				})) : y("", !0), C(F(n), {
					size: "sm",
					disabled: !F(ue).children.size,
					onClick: F(fe)
				}, {
					icon: R(() => [C(F(g), {
						name: F(L) ? "chevron-up" : "chevron-down",
						size: 14
					}, null, 8, ["name"])]),
					default: R(() => [S(" " + P(F(L) ? "全部收起" : "全部展开"), 1)]),
					_: 1
				}, 8, ["disabled", "onClick"])]),
				"cell-name": R(({ row: e }) => [C(_e, {
					name: e.name,
					child: e.parent_id != null,
					branch: F(ue).children.has(e.id),
					expanded: F(I).has(e.id),
					onToggle: (t) => F(de)(e.id)
				}, null, 8, [
					"name",
					"child",
					"branch",
					"expanded",
					"onToggle"
				])]),
				"cell-is_enabled": R(({ row: e }) => [C(F(o), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [S(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": R(({ row: e }) => [C(F(n), {
					size: "sm",
					"icon-only": "",
					title: h("edit") ? `编辑${Z}` : `${Z}详情`,
					"aria-label": `编辑${Z}`,
					onClick: (t) => ke(e.id)
				}, {
					default: R(() => [C(F(g), {
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
			C(F(d), {
				modelValue: ge.value,
				"onUpdate:modelValue": t[5] ||= (e) => ge.value = e,
				title: `${z.id ? "编辑" : "新增"}新闻${Z}`,
				width: "680px",
				subtitle: "新闻分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Ae
			}, {
				footer: R(() => [
					z.id && h("delete") ? (k(), v(F(n), {
						key: 0,
						variant: "danger",
						disabled: B.value || Q.value || Ee.value,
						onClick: Pe
					}, {
						icon: R(() => [C(F(g), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [t[11] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(F(n), {
						disabled: Ee.value,
						onClick: je
					}, {
						default: R(() => [...t[12] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Te.value ? y("", !0) : (k(), v(F(n), {
						key: 1,
						variant: "primary",
						loading: V.value,
						disabled: B.value || Q.value || H.value,
						onClick: Ne
					}, {
						default: R(() => [S("保存" + P(Z))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": B.value
				}, [
					B.value ? (k(), b("div", xe, [C(F(g), {
						name: "loader-circle",
						class: "news-spin",
						size: 24
					}), x("span", null, "正在读取" + P(Z) + "...")])) : y("", !0),
					$.value ? (k(), v(F(p), {
						key: 1,
						type: "error",
						closable: !1,
						description: $.value
					}, null, 8, ["description"])) : y("", !0),
					!B.value && !Q.value ? (k(), v(F(f), {
						key: 2,
						model: z,
						"label-position": "top",
						onSubmit: me(Ne, ["prevent"])
					}, {
						default: R(() => [
							z.id ? (k(), v(F(m), {
								key: 0,
								label: "分类ID"
							}, {
								default: R(() => [C(F(ae), {
									"model-value": z.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : y("", !0),
							C(F(m), {
								label: `${Z}名称`,
								required: ""
							}, {
								default: R(() => [C(F(ae), {
									modelValue: z.name,
									"onUpdate:modelValue": t[1] ||= (e) => z.name = e,
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
								default: R(() => [x("div", Se, [C(F(ie), {
									modelValue: z.parent_id,
									"onUpdate:modelValue": t[2] ||= (e) => z.parent_id = e,
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
								default: R(() => [C(F(s), {
									modelValue: z.sort_order,
									"onUpdate:modelValue": t[3] ||= (e) => z.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Te.value || Ee.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(F(m), { label: "启用状态" }, {
								default: R(() => [C(ye, {
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
					}, 8, ["model"])) : y("", !0)
				], 8, Y)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(F(d), {
				modelValue: J.value,
				"onUpdate:modelValue": t[7] ||= (e) => J.value = e,
				title: "删除新闻分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !H.value
			}, {
				footer: R(() => [C(F(n), {
					disabled: H.value,
					onClick: t[6] ||= (e) => J.value = !1
				}, {
					default: R(() => [...t[13] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(n), {
					variant: "danger",
					loading: H.value,
					onClick: Fe
				}, {
					default: R(() => [...t[14] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [x("p", null, "确认删除分类“" + P(z.name) + "”？有关联新闻或子分类的分类无法删除。", 1), Ce.value ? (k(), v(F(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: Ce.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(F(d), {
				modelValue: we.value,
				"onUpdate:modelValue": t[9] ||= (e) => we.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [C(F(n), { onClick: t[8] ||= (e) => we.value = !1 }, {
					default: R(() => [...t[15] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(F(n), {
					variant: "primary",
					onClick: Me
				}, {
					default: R(() => [...t[16] ||= [S("放弃修改", -1)]]),
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
	let i = M(), a = M(), o = M(null), s = M(Date.now()), ee = j({}), c = M(""), l = Object.fromEntries($.map((e) => [e, {
		required: e === "title" || e === "category_id",
		trigger: "submit"
	}])), u = _(() => o.value ? we(e, t(), n, o.value === "draft" ? "draft" : e.scheduled_local ? "scheduled" : "published", s.value) : {}), d = _(() => ({
		...ee,
		...u.value
	})), f = _(() => Object.keys(d.value).length);
	for (let t of $) de(() => e[t], () => {
		delete ee[t], c.value = "", s.value = Date.now();
	}, { deep: !0 });
	function te() {
		d.value.seo_description && a.value?.focus();
	}
	async function p() {
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
	async function ne(e) {
		o.value = e === "draft" ? "draft" : "publish", s.value = Date.now(), c.value = "";
		for (let e of $) delete ee[e];
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
}, He = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: r }) {
		let { newsError: a, newsCategoryLabel: o, deleteNews: ee, getNewsDetail: c, getNewsMetadata: l, saveNews: te, uploadNewsCover: ne } = q(), { hasPermission: re } = he(), h = t, w = r, T = M(!0), E = M(!1), D = M(!1), O = M(""), A = M(!1), le = M(!1), N = M(!1), I = M(!1), L = M(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), de = M(), pe = M("draft"), z = M(!1), B = _(() => re(["cms_news:publish"])), V = _(() => !re([`cms_news:${h.articleId ? "edit" : "add"}`]) || !B.value && pe.value !== "draft"), H = _(() => re(["cms_news:delete"]) && (B.value || pe.value === "draft"));
		async function _e() {
			if (!(!H.value || E.value || T.value || D.value)) {
				E.value = !0, O.value = "";
				try {
					await ee("articles", W.id, W.row_version), we = JSON.stringify(W), u.success("新闻已删除"), w("saved");
				} catch (e) {
					O.value = a(e), I.value = !1;
				} finally {
					E.value = !1;
				}
			}
		}
		let U = _(() => V.value || E.value), W = j({
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
		}), { editorRoot: G, seoInput: K, fieldRules: ve, fieldErrors: J, pendingCount: be, saveError: Y, validateSave: xe, setSaveFailure: Se, focusFirstError: X, focusSeoError: Z } = Ee(W, () => de.value?.categories || [], "news", A), Ce = _(() => (de.value?.categories || []).filter((e) => e.parent_id != null).map((e) => ({
			label: o(de.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), Q = _(() => de.value?.categories.find((e) => e.id === W.category_id && e.parent_id == null)), $ = _({
			get: () => Q.value ? "" : W.category_id,
			set: (e) => {
				W.category_id = e;
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
				if (de.value = await l(e.signal, { cms_source_type: "platform" }), h.articleId) {
					let t = await c("articles", h.articleId, e.signal);
					if (de.value = await l(e.signal, { space_id: String(t.space_id) }), L.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"sort_order",
						"is_enabled"
					]) Object.assign(W, { [e]: t[e] });
					W.category_id = t.category_id || "";
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url",
						"content_source",
						"author_name"
					]) W[e] = t[e] || "";
					W.scheduled_local = t.publish_status === "scheduled" ? He(t.scheduled_at) : "", pe.value = t.publish_status;
				}
				we = JSON.stringify(W);
			} catch (t) {
				e.signal.aborted || (O.value = a(t), D.value = !0);
			} finally {
				e.signal.aborted || (T.value = !1);
			}
		}
		let We = () => !T.value && !D.value && we !== JSON.stringify(W);
		function Ge() {
			We() ? le.value = !0 : w("close");
		}
		function Ke() {
			pe.value === "draft" ? Je("draft") : N.value = !0;
		}
		function qe() {
			N.value = !1, Je("draft");
		}
		async function Je(e) {
			if (U.value || T.value || D.value || z.value || (O.value = "", !await xe(e))) return;
			let t = W.scheduled_local ? new Date(W.scheduled_local) : null;
			E.value = !0, O.value = "";
			try {
				await te("articles", {
					...W,
					id: W.id || void 0,
					row_version: W.id ? W.row_version : void 0,
					category_id: W.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), we = JSON.stringify(W), u.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "新闻已发布"), w("saved");
			} catch (e) {
				Se(e);
			} finally {
				E.value = !1;
			}
			be.value && await X();
		}
		function Ye(e) {
			O.value = a(e);
		}
		let Xe = (e) => {
			We() && (e.preventDefault(), e.returnValue = "");
		};
		return ge(() => !E.value && !z.value && (!We() || window.confirm("新闻有未保存的修改，确定离开？"))), ce(() => {
			Ue(), window.addEventListener("beforeunload", Xe);
		}), se(() => {
			Te?.abort(), window.removeEventListener("beforeunload", Xe);
		}), (r, a) => (k(), b("section", {
			ref_key: "editorRoot",
			ref: G,
			class: "article-editor",
			"aria-busy": T.value || E.value
		}, [
			x("header", Oe, [
				C(F(n), {
					"icon-only": "",
					title: "返回新闻列表",
					"aria-label": "返回新闻列表",
					disabled: E.value || z.value,
					onClick: Ge
				}, {
					default: R(() => [C(F(g), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", ke, [x("h2", null, P(t.articleId ? "编辑新闻" : "新增新闻"), 1), x("span", null, P(de.value?.source_locale || "zh-CN") + " · " + P(L.value), 1)]),
				x("div", Ae, [
					t.articleId && H.value ? (k(), v(F(n), {
						key: 0,
						size: "sm",
						disabled: T.value || D.value || E.value || z.value,
						onClick: a[0] ||= (e) => I.value = !0
					}, {
						default: R(() => [...a[28] ||= [S("删除新闻", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(F(n), {
						size: "sm",
						disabled: T.value || D.value,
						onClick: a[1] ||= (e) => A.value = !0
					}, {
						icon: R(() => [C(F(g), {
							name: "search",
							size: 14
						})]),
						default: R(() => [a[29] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					V.value ? y("", !0) : (k(), v(F(n), {
						key: 1,
						size: "sm",
						disabled: T.value || D.value || E.value || z.value,
						onClick: Ke
					}, {
						icon: R(() => [C(F(g), {
							name: "save",
							size: 14
						})]),
						default: R(() => [a[30] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					F(Y) ? (k(), b("span", je, P(F(Y)), 1)) : y("", !0),
					!V.value && F(be) ? (k(), b("span", Me, "还有 " + P(F(be)) + " 项待完善", 1)) : y("", !0),
					!V.value && B.value ? (k(), v(F(n), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: T.value || D.value || z.value,
						loading: E.value,
						onClick: a[2] ||= (e) => Je(W.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [C(F(g), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [S(P(W.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)
				])
			]),
			T.value ? (k(), b("div", Ne, [C(F(g), {
				name: "loader-circle",
				class: "news-spin",
				size: 28
			}), a[31] ||= x("span", null, "正在读取新闻资料...", -1)])) : D.value ? (k(), b("div", Pe, [C(F(p), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"]), C(F(n), { onClick: Ue }, {
				default: R(() => [...a[32] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (k(), b(oe, { key: 2 }, [O.value ? (k(), b("div", Fe, [C(F(p), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"])])) : y("", !0), x("div", Ie, [x("aside", Le, [C(F(f), {
				model: W,
				rules: F(ve),
				"label-position": "top",
				onSubmit: a[12] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					C(F(m), {
						label: "新闻分类",
						prop: "category_id",
						error: F(J).category_id,
						required: ""
					}, {
						default: R(() => [C(F(ie), {
							modelValue: $.value,
							"onUpdate:modelValue": a[3] ||= (e) => $.value = e,
							options: Ce.value,
							placeholder: Q.value ? "原分类：" + Q.value.name + "（请选择二级分类）" : "请选择二级分类",
							clearable: "",
							disabled: U.value,
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
					C(F(m), {
						label: "新闻封面",
						prop: "cover_url",
						error: F(J).cover_url
					}, {
						default: R(() => [C(e, {
							modelValue: W.cover_url,
							"onUpdate:modelValue": a[4] ||= (e) => W.cover_url = e,
							label: "新闻封面",
							disabled: U.value,
							upload: F(ne),
							onBusyChange: a[5] ||= (e) => z.value = e,
							onStart: a[6] ||= (e) => O.value = "",
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
						error: F(J).content_source
					}, {
						default: R(() => [C(F(ae), {
							modelValue: W.content_source,
							"onUpdate:modelValue": a[7] ||= (e) => W.content_source = e,
							maxlength: 160,
							disabled: U.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "作者署名",
						prop: "author_name",
						error: F(J).author_name
					}, {
						default: R(() => [C(F(ae), {
							modelValue: W.author_name,
							"onUpdate:modelValue": a[8] ||= (e) => W.author_name = e,
							maxlength: 120,
							disabled: U.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "前端排序",
						prop: "sort_order",
						error: F(J).sort_order
					}, {
						default: R(() => [C(F(s), {
							modelValue: W.sort_order,
							"onUpdate:modelValue": a[9] ||= (e) => W.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: U.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[34] ||= x("h3", null, "发布设置", -1),
					C(F(m), {
						label: "启用状态",
						prop: "is_enabled",
						error: F(J).is_enabled
					}, {
						default: R(() => [C(ye, {
							modelValue: W.is_enabled,
							"onUpdate:modelValue": a[10] ||= (e) => W.is_enabled = e,
							disabled: U.value,
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
						default: R(() => [C(F(ae), {
							modelValue: W.scheduled_local,
							"onUpdate:modelValue": a[11] ||= (e) => W.scheduled_local = e,
							type: "datetime-local",
							disabled: U.value || !B.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[35] ||= x("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", Re, [C(F(f), {
				model: W,
				rules: F(ve),
				"label-position": "top",
				onSubmit: a[16] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					C(F(m), {
						label: "标题",
						prop: "title",
						error: F(J).title,
						required: ""
					}, {
						default: R(() => [C(F(ae), {
							modelValue: W.title,
							"onUpdate:modelValue": a[13] ||= (e) => W.title = e,
							maxlength: 255,
							disabled: U.value,
							placeholder: "输入新闻标题",
							"aria-label": "新闻标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "摘要",
						prop: "summary",
						error: F(J).summary
					}, {
						default: R(() => [fe(x("textarea", {
							"onUpdate:modelValue": a[14] ||= (e) => W.summary = e,
							"aria-invalid": !!F(J).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: U.value,
							"aria-label": "新闻摘要"
						}, null, 8, ze), [[ue, W.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "正文",
						prop: "body_html",
						error: F(J).body_html
					}, {
						default: R(() => [C(F(i), {
							modelValue: W.body_html,
							"onUpdate:modelValue": a[15] ||= (e) => W.body_html = e,
							readonly: V.value,
							disabled: E.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "新闻正文"
						}, {
							"image-upload": R(({ url: t, setUrl: n, setBusy: r }) => [C(e, {
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
			C(F(d), {
				modelValue: A.value,
				"onUpdate:modelValue": a[20] ||= (e) => A.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: R(() => [C(F(n), {
					variant: "primary",
					onClick: a[19] ||= (e) => A.value = !1
				}, {
					default: R(() => [...a[36] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [C(F(f), {
					model: W,
					rules: F(ve),
					"label-position": "top",
					onSubmit: a[18] ||= me(() => {}, ["prevent"])
				}, {
					default: R(() => [C(F(m), {
						label: "SEO 描述",
						prop: "seo_description",
						error: F(J).seo_description
					}, {
						default: R(() => [fe(x("textarea", {
							ref_key: "seoInput",
							ref: K,
							"onUpdate:modelValue": a[17] ||= (e) => W.seo_description = e,
							"aria-invalid": !!F(J).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: U.value,
							"aria-label": "SEO 描述"
						}, null, 8, Be), [[ue, W.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(F(d), {
				modelValue: I.value,
				"onUpdate:modelValue": a[22] ||= (e) => I.value = e,
				title: "确认删除",
				subtitle: `操作对象：${W.title || "未命名新闻"}`,
				width: "460px",
				"panel-class": "news-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !E.value
			}, {
				"header-actions": R(() => [x("span", Ve, [C(F(g), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [C(F(n), {
					disabled: E.value,
					onClick: a[21] ||= (e) => I.value = !1
				}, {
					default: R(() => [...a[37] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(n), {
					variant: "warning",
					loading: E.value,
					onClick: _e
				}, {
					default: R(() => [...a[38] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [C(F(p), {
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
			C(F(d), {
				modelValue: le.value,
				"onUpdate:modelValue": a[25] ||= (e) => le.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [C(F(n), { onClick: a[23] ||= (e) => le.value = !1 }, {
					default: R(() => [...a[39] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(F(n), {
					variant: "primary",
					onClick: a[24] ||= (e) => w("close")
				}, {
					default: R(() => [...a[40] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(F(d), {
				modelValue: N.value,
				"onUpdate:modelValue": a[27] ||= (e) => N.value = e,
				title: "将新闻转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [C(F(n), { onClick: a[26] ||= (e) => N.value = !1 }, {
					default: R(() => [...a[41] ||= [S("取消", -1)]]),
					_: 1
				}), C(F(n), {
					variant: "primary",
					onClick: qe
				}, {
					default: R(() => [...a[42] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, De));
	}
}), [["__scopeId", "data-v-33394e7e"]]), Ue = { class: "news-articles" }, We = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { newsPublishStates: t, newsCategoryLabel: r, getNewsList: i, getNewsMetadata: a } = q(), { hasPermission: s } = he(), { formatDateTime: ee } = he(), c = M(!1), l = M(), u = (e) => s([`cms_news:${e}`]), d = M(), f = K(a, (e) => {
			d.value = e;
		}), te = [
			...G(),
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
		})), ae = f.loadMetadata;
		function h(e) {
			l.value = e, c.value = !0;
		}
		function oe() {
			c.value = !1, m(), ae();
		}
		return (e, r) => (k(), b("div", Ue, [c.value ? (k(), v(He, {
			key: 0,
			"article-id": l.value,
			onClose: r[0] ||= (e) => c.value = !1,
			onSaved: oe
		}, null, 8, ["article-id"])) : y("", !0), fe(C(F(re), E(F(ie), {
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
			"cell-cms_source_type": R(({ row: e }) => [C(ve, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": R(() => [u("add") ? (k(), v(F(n), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: r[1] ||= (e) => h()
			}, {
				icon: R(() => [C(F(g), {
					name: "plus",
					size: 14
				})]),
				default: R(() => [r[2] ||= S("新增新闻", -1)]),
				_: 1
			})) : y("", !0)]),
			"cell-publish_status": R(({ row: e }) => [C(F(o), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: R(() => [S(P(F(t).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": R(({ row: e }) => [C(F(o), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: R(() => [S(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": R(({ row: e }) => [S(P(F(ee)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": R(({ row: e }) => [C(F(n), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑新闻" : "新闻详情",
				"aria-label": u("edit") ? "编辑新闻" : "新闻详情",
				onClick: (t) => h(e.id)
			}, {
				default: R(() => [C(F(g), {
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
		}, 16), [[L, !c.value]])]));
	}
}), [["__scopeId", "data-v-15e6f2c5"]]);
//#endregion
//#region src/cms/api/content/academy.ts
function Ge() {
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
}, Je = { class: "taxonomy-editor__row" }, Ye = "分类", Xe = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "CategoryTable",
	setup(e) {
		let { hasPermission: t } = he(), { formatDateTime: i } = he(), { academyDifficulties: a, academyError: ee, getAcademyList: c, getAcademyMetadata: l, getAcademyDetail: te, saveAcademy: ie, deleteAcademyCategory: h } = Ge(), w = (e) => t([`cms_academy_category:${e}`]), T = K(l), D = [
			...G(),
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
				}, ...a]
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
		], { proTableBindings: ce, reload: A, currentPage: le, pageSize: N, total: I } = T.bindTable(ne({
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
		})), ue = () => ({
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
		}), L = j(ue()), de = M(!1), fe = M(!1), pe = M(!1), z = M(!1), ge = M(!1), B = M(""), V = M(!1), H = M(""), _e = M(!1), U = _(() => !w(L.id ? "edit" : "add")), W = _(() => pe.value || z.value), q = "", J;
		async function ye(e) {
			J?.abort(), J = new AbortController();
			let t = J;
			if (Object.assign(L, ue(), { id: e || "" }), H.value = "", ge.value = !1, B.value = "", V.value = !1, de.value = !0, fe.value = !!e, q = JSON.stringify(L), e) try {
				let n = await te("categories", e, t.signal);
				if (t.signal.aborted) return;
				Object.assign(L, {
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
				}), q = JSON.stringify(L);
			} catch (e) {
				t.signal.aborted || (V.value = !0, H.value = ee(e));
			} finally {
				t.signal.aborted || (fe.value = !1);
			}
		}
		function be() {
			return W.value ? !1 : !fe.value && !V.value && JSON.stringify(L) !== q ? (_e.value = !0, !1) : (J?.abort(), !0);
		}
		function Y() {
			W.value || (J?.abort(), de.value = !1);
		}
		function xe() {
			_e.value = !1, de.value = !1;
		}
		async function Se() {
			if (!(U.value || W.value || fe.value || V.value)) {
				if (!L.name.trim() || L.sort_order === null) {
					H.value = "请填写名称和排序";
					return;
				}
				pe.value = !0, H.value = "";
				try {
					await ie("categories", {
						...L,
						id: L.id || void 0,
						row_version: L.id ? L.row_version : void 0
					}), de.value = !1, u.success("保存成功"), await A();
				} catch (e) {
					H.value = ee(e);
				} finally {
					pe.value = !1;
				}
			}
		}
		function X() {
			!L.id || !w("delete") || W.value || fe.value || V.value || (B.value = "", ge.value = !0);
		}
		async function Z() {
			if (!(!ge.value || !L.id || !w("delete") || W.value || fe.value || V.value)) {
				z.value = !0, B.value = "";
				try {
					await h({
						id: L.id,
						row_version: L.row_version
					}), ge.value = !1, de.value = !1, u.success("分类已删除"), await A(), le.value = Math.min(le.value, Math.max(1, Math.ceil(I.value / N.value)));
				} catch (e) {
					B.value = ee(e);
				} finally {
					z.value = !1;
				}
			}
		}
		return se(() => J?.abort()), (e, t) => (k(), b(oe, null, [
			C(F(re), E(F(ce), {
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
				"cell-cms_source_type": R(({ row: e }) => [C(ve, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [w("add") ? (k(), v(F(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: t[0] ||= (e) => ye()
				}, {
					icon: R(() => [C(F(g), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [S("新增" + P(Ye))]),
					_: 1
				})) : y("", !0)]),
				"cell-is_enabled": R(({ row: e }) => [C(F(o), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [S(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": R(({ row: e }) => [C(F(n), {
					size: "sm",
					"icon-only": "",
					title: w("edit") ? `编辑${Ye}` : `${Ye}详情`,
					"aria-label": `编辑${Ye}`,
					onClick: (t) => ye(e.id)
				}, {
					default: R(() => [C(F(g), {
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
			C(F(d), {
				modelValue: de.value,
				"onUpdate:modelValue": t[4] ||= (e) => de.value = e,
				title: `${L.id ? "编辑" : "新增"}课程${Ye}`,
				width: "620px",
				"close-on-click-modal": !1,
				"before-close": be
			}, {
				footer: R(() => [
					L.id && w("delete") ? (k(), v(F(n), {
						key: 0,
						variant: "danger",
						disabled: fe.value || V.value || W.value,
						onClick: X
					}, {
						icon: R(() => [C(F(g), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [t[9] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(F(n), {
						disabled: W.value,
						onClick: Y
					}, {
						default: R(() => [...t[10] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					U.value ? y("", !0) : (k(), v(F(n), {
						key: 1,
						variant: "primary",
						loading: pe.value,
						disabled: fe.value || V.value || z.value,
						onClick: Se
					}, {
						default: R(() => [S("保存" + P(Ye))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": fe.value
				}, [
					fe.value ? (k(), b("div", qe, [C(F(g), {
						name: "loader-circle",
						class: "academy-spin",
						size: 24
					}), x("span", null, "正在读取" + P(Ye) + "...")])) : y("", !0),
					H.value ? (k(), v(F(p), {
						key: 1,
						type: "error",
						closable: !1,
						description: H.value
					}, null, 8, ["description"])) : y("", !0),
					!fe.value && !V.value ? (k(), v(F(f), {
						key: 2,
						model: L,
						"label-position": "top",
						onSubmit: me(Se, ["prevent"])
					}, {
						default: R(() => [C(F(m), {
							label: `${Ye}名称`,
							required: ""
						}, {
							default: R(() => [C(F(ae), {
								modelValue: L.name,
								"onUpdate:modelValue": t[1] ||= (e) => L.name = e,
								maxlength: 120,
								disabled: U.value || W.value,
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
							default: R(() => [C(F(s), {
								modelValue: L.sort_order,
								"onUpdate:modelValue": t[2] ||= (e) => L.sort_order = e,
								min: 0,
								max: 2147483647,
								precision: 0,
								disabled: U.value || W.value,
								"aria-label": "前端排序"
							}, null, 8, ["modelValue", "disabled"])]),
							_: 1
						}), C(F(m), { label: "启用状态" }, {
							default: R(() => [C(F(r), {
								modelValue: L.is_enabled,
								"onUpdate:modelValue": t[3] ||= (e) => L.is_enabled = e,
								disabled: U.value || W.value,
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
			C(F(d), {
				modelValue: ge.value,
				"onUpdate:modelValue": t[6] ||= (e) => ge.value = e,
				title: "删除课程分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !z.value
			}, {
				footer: R(() => [C(F(n), {
					disabled: z.value,
					onClick: t[5] ||= (e) => ge.value = !1
				}, {
					default: R(() => [...t[11] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(n), {
					variant: "danger",
					loading: z.value,
					onClick: Z
				}, {
					default: R(() => [...t[12] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [x("p", null, "确认删除分类“" + P(L.name) + "”？有关联课程的分类无法删除。", 1), B.value ? (k(), v(F(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: B.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(F(d), {
				modelValue: _e.value,
				"onUpdate:modelValue": t[8] ||= (e) => _e.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [C(F(n), { onClick: t[7] ||= (e) => _e.value = !1 }, {
					default: R(() => [...t[13] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(F(n), {
					variant: "primary",
					onClick: xe
				}, {
					default: R(() => [...t[14] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 64));
	}
}), [["__scopeId", "data-v-e36abb56"]]), Ze = { class: "academy-categories" }, Qe = /*#__PURE__*/ h(/* @__PURE__ */ w({
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
}, bt = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "CourseEditor",
	props: { courseId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: a }) {
		let { hasPermission: o } = he(), { academyDifficulties: ee, academyError: c, deleteAcademyCourse: l, getAcademyDetail: te, getAcademyMetadata: ne, saveAcademy: re, uploadAcademyCover: h } = Ge(), oe = t, w = a, T = M(!0), E = M(!1), O = M(!1), A = M(""), le = M(!1), N = M(!1), I = M(!1), L = M(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), pe = M(), z = M("draft"), B = M(!1), V = M(!1), H = M(""), _e = _(() => o(["cms_academy:publish"])), U = _(() => !!oe.courseId && o(["cms_academy:delete"]) && (_e.value || z.value === "draft")), W = _(() => !o([`cms_academy:${oe.courseId ? "edit" : "add"}`]) || !_e.value && z.value !== "draft"), G = _(() => W.value || E.value), K = j({
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
		}), ve = M(), q = M(), J = M(null), ye = M(Date.now()), be = j({}), Y = M(""), xe = Object.fromEntries($e.map((e) => [e, {
			required: e === "title" || e === "category_ids",
			trigger: "submit"
		}])), Se = _(() => J.value ? nt(K, pe.value?.categories || [], J.value === "draft" ? "draft" : K.scheduled_local ? "scheduled" : "published", ye.value) : {}), X = _(() => ({
			...be,
			...Se.value
		})), Z = _(() => Object.keys(X.value).length);
		for (let e of $e) de(() => K[e], () => {
			delete be[e], Y.value = "", ye.value = Date.now();
		}, { deep: !0 });
		function Ce() {
			X.value.seo_description && q.value?.focus();
		}
		async function Q() {
			await D();
			let e = [...ve.value?.querySelectorAll("[data-prop]") || []].find((e) => X.value[e.dataset.prop]);
			if (!e && X.value.seo_description) {
				le.value ? Ce() : le.value = !0;
				return;
			}
			e && (e.scrollIntoView({
				block: "center",
				behavior: "auto"
			}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
		}
		let $ = _(() => (pe.value?.categories || []).map((e) => ({
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
				if (pe.value = await ne(e.signal, { cms_source_type: "platform" }), oe.courseId) {
					let t = await te("courses", oe.courseId, e.signal);
					if (pe.value = await ne(e.signal, { space_id: String(t.space_id) }), L.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"category_ids",
						"sort_order",
						"is_enabled"
					]) Object.assign(K, { [e]: t[e] });
					K.difficulty_level = t.difficulty_level || "";
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url"
					]) K[e] = t[e] || "";
					K.scheduled_local = t.publish_status === "scheduled" ? Ee(t.scheduled_at) : "", z.value = t.publish_status;
				}
				we = JSON.stringify(K);
			} catch (t) {
				e.signal.aborted || (A.value = c(t), O.value = !0);
			} finally {
				e.signal.aborted || (T.value = !1);
			}
		}
		let Oe = () => !T.value && !O.value && we !== JSON.stringify(K);
		function ke() {
			Oe() ? N.value = !0 : w("close");
		}
		function Ae() {
			z.value === "draft" ? Me("draft") : I.value = !0;
		}
		function je() {
			I.value = !1, Me("draft");
		}
		async function Me(e) {
			if (G.value || T.value || O.value || B.value) return;
			J.value = e === "draft" ? "draft" : "publish", ye.value = Date.now(), Y.value = "";
			for (let e of $e) delete be[e];
			if (Z.value) {
				await Q();
				return;
			}
			let t = K.scheduled_local ? new Date(K.scheduled_local) : null;
			E.value = !0, A.value = "";
			try {
				await re("courses", {
					...K,
					id: K.id || void 0,
					row_version: K.id ? K.row_version : void 0,
					difficulty_level: K.difficulty_level || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), we = JSON.stringify(K), u.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "课程已发布"), w("saved");
			} catch (e) {
				let t = it(e);
				Object.assign(be, t.fields), Y.value = t.general;
			} finally {
				E.value = !1;
			}
			Z.value && await Q();
		}
		function Ne() {
			H.value = "", V.value = !0;
		}
		async function Pe() {
			if (!(!U.value || T.value || O.value || E.value || B.value)) {
				E.value = !0, H.value = "";
				try {
					await l({
						id: K.id,
						row_version: K.row_version
					}), we = JSON.stringify(K), V.value = !1, u.success("课程已删除"), w("saved");
				} catch (e) {
					H.value = c(e);
				} finally {
					E.value = !1;
				}
			}
		}
		function Fe(e) {
			be.cover_url = c(e);
		}
		function Ie() {
			delete be.cover_url;
		}
		let Le = (e) => {
			Oe() && (e.preventDefault(), e.returnValue = "");
		};
		return ge(() => !E.value && !B.value && (!Oe() || window.confirm("课程有未保存的修改，确定离开？"))), ce(() => {
			De(), window.addEventListener("beforeunload", Le);
		}), se(() => {
			Te?.abort(), window.removeEventListener("beforeunload", Le);
		}), (a, o) => (k(), b("section", {
			ref_key: "editorRoot",
			ref: ve,
			class: "course-editor",
			"aria-busy": T.value || E.value
		}, [
			x("header", ot, [
				C(F(n), {
					"icon-only": "",
					title: "返回课程列表",
					"aria-label": "返回课程列表",
					disabled: E.value || B.value,
					onClick: ke
				}, {
					default: R(() => [C(F(g), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", st, [x("h2", null, P(t.courseId ? "编辑课程" : "新增课程"), 1), x("span", null, P(pe.value?.source_locale || "zh-CN") + " · " + P(L.value), 1)]),
				x("div", ct, [
					U.value ? (k(), v(F(n), {
						key: 0,
						variant: "danger",
						size: "sm",
						disabled: T.value || O.value || E.value || B.value,
						onClick: Ne
					}, {
						default: R(() => [...o[26] ||= [S("删除课程", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(F(n), {
						size: "sm",
						disabled: T.value || O.value,
						onClick: o[0] ||= (e) => le.value = !0
					}, {
						icon: R(() => [C(F(g), {
							name: "search",
							size: 14
						})]),
						default: R(() => [o[27] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					W.value ? y("", !0) : (k(), v(F(n), {
						key: 1,
						size: "sm",
						disabled: T.value || O.value || E.value || B.value,
						onClick: Ae
					}, {
						icon: R(() => [C(F(g), {
							name: "save",
							size: 14
						})]),
						default: R(() => [o[28] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					Y.value ? (k(), b("span", lt, P(Y.value), 1)) : y("", !0),
					W.value ? y("", !0) : (k(), b("div", ut, [Z.value ? (k(), b("span", dt, "还有 " + P(Z.value) + " 项待完善", 1)) : y("", !0), _e.value ? (k(), v(F(n), {
						key: 1,
						variant: "primary",
						size: "sm",
						disabled: T.value || O.value || B.value,
						loading: E.value,
						onClick: o[1] ||= (e) => Me(K.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [C(F(g), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [S(P(K.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)]))
				])
			]),
			T.value ? (k(), b("div", ft, [C(F(g), {
				name: "loader-circle",
				class: "academy-spin",
				size: 28
			}), o[29] ||= x("span", null, "正在读取课程资料...", -1)])) : O.value ? (k(), b("div", pt, [C(F(p), {
				type: "error",
				description: A.value,
				closable: !1
			}, null, 8, ["description"]), C(F(n), { onClick: De }, {
				default: R(() => [...o[30] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (k(), b("div", mt, [x("aside", ht, [C(F(f), {
				model: K,
				rules: F(xe),
				"label-position": "top",
				onSubmit: o[10] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					C(F(m), {
						label: "课程分类",
						prop: "category_ids",
						error: X.value.category_ids,
						required: ""
					}, {
						default: R(() => [C(F(ie), {
							modelValue: K.category_ids,
							"onUpdate:modelValue": o[2] ||= (e) => K.category_ids = e,
							options: $.value,
							multiple: "",
							filterable: "",
							clearable: "",
							disabled: G.value,
							"aria-label": "课程分类"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					o[31] ||= x("h3", null, "课程设置", -1),
					C(F(m), {
						label: "课程封面",
						prop: "cover_url",
						error: X.value.cover_url
					}, {
						default: R(() => [C(e, {
							modelValue: K.cover_url,
							"onUpdate:modelValue": o[3] ||= (e) => K.cover_url = e,
							label: "课程封面",
							disabled: G.value,
							upload: F(h),
							onBusyChange: o[4] ||= (e) => B.value = e,
							onStart: o[5] ||= (e) => A.value = "",
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
						default: R(() => [C(F(ie), {
							modelValue: K.difficulty_level,
							"onUpdate:modelValue": o[6] ||= (e) => K.difficulty_level = e,
							options: F(ee),
							disabled: G.value,
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
						default: R(() => [C(F(s), {
							modelValue: K.sort_order,
							"onUpdate:modelValue": o[7] ||= (e) => K.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: G.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[32] ||= x("h3", null, "发布设置", -1),
					C(F(m), {
						label: "启用状态",
						prop: "is_enabled",
						error: X.value.is_enabled
					}, {
						default: R(() => [C(F(r), {
							modelValue: K.is_enabled,
							"onUpdate:modelValue": o[8] ||= (e) => K.is_enabled = e,
							disabled: G.value,
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
						default: R(() => [C(F(ae), {
							modelValue: K.scheduled_local,
							"onUpdate:modelValue": o[9] ||= (e) => K.scheduled_local = e,
							type: "datetime-local",
							disabled: G.value || !_e.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", gt, [C(F(f), {
				model: K,
				rules: F(xe),
				"label-position": "top",
				onSubmit: o[14] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					C(F(m), {
						label: "标题",
						prop: "title",
						error: X.value.title,
						required: ""
					}, {
						default: R(() => [C(F(ae), {
							modelValue: K.title,
							"onUpdate:modelValue": o[11] ||= (e) => K.title = e,
							maxlength: 255,
							disabled: G.value,
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
						default: R(() => [fe(x("textarea", {
							"onUpdate:modelValue": o[12] ||= (e) => K.summary = e,
							class: "course-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: G.value,
							"aria-invalid": !!X.value.summary,
							"aria-label": "课程摘要"
						}, null, 8, _t), [[ue, K.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "正文",
						prop: "body_html",
						error: X.value.body_html
					}, {
						default: R(() => [C(F(i), {
							modelValue: K.body_html,
							"onUpdate:modelValue": o[13] ||= (e) => K.body_html = e,
							readonly: W.value,
							disabled: E.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "课程正文"
						}, {
							"image-upload": R(({ url: t, setUrl: n, setBusy: r }) => [C(e, {
								label: "正文图片",
								"model-value": t,
								upload: F(h),
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
			C(F(d), {
				modelValue: le.value,
				"onUpdate:modelValue": o[18] ||= (e) => le.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1,
				onOpened: Ce
			}, {
				footer: R(() => [C(F(n), {
					variant: "primary",
					onClick: o[17] ||= (e) => le.value = !1
				}, {
					default: R(() => [...o[33] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [C(F(f), {
					model: K,
					rules: F(xe),
					"label-position": "top",
					onSubmit: o[16] ||= me(() => {}, ["prevent"])
				}, {
					default: R(() => [C(F(m), {
						label: "SEO 描述",
						prop: "seo_description",
						error: X.value.seo_description
					}, {
						default: R(() => [fe(x("textarea", {
							ref_key: "seoInput",
							ref: q,
							"onUpdate:modelValue": o[15] ||= (e) => K.seo_description = e,
							class: "course-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: G.value,
							"aria-invalid": !!X.value.seo_description,
							"aria-label": "SEO 描述"
						}, null, 8, vt), [[ue, K.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(F(d), {
				modelValue: V.value,
				"onUpdate:modelValue": o[20] ||= (e) => V.value = e,
				title: "确认删除",
				subtitle: `操作对象：${K.title || "未命名课程"}`,
				width: "460px",
				"panel-class": "course-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !E.value
			}, {
				"header-actions": R(() => [x("span", yt, [C(F(g), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [C(F(n), {
					disabled: E.value,
					onClick: o[19] ||= (e) => V.value = !1
				}, {
					default: R(() => [...o[34] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(n), {
					variant: "warning",
					loading: E.value,
					onClick: Pe
				}, {
					default: R(() => [...o[35] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [C(F(p), {
					class: "course-delete-dialog__notice",
					type: "warning",
					closable: !1,
					"show-icon": !1,
					description: "确定删除这门课程吗？删除后将不再展示，请谨慎操作。"
				}), H.value ? (k(), v(F(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: H.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, [
				"modelValue",
				"subtitle",
				"before-close"
			]),
			C(F(d), {
				modelValue: N.value,
				"onUpdate:modelValue": o[23] ||= (e) => N.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [C(F(n), { onClick: o[21] ||= (e) => N.value = !1 }, {
					default: R(() => [...o[36] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(F(n), {
					variant: "primary",
					onClick: o[22] ||= (e) => w("close")
				}, {
					default: R(() => [...o[37] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(F(d), {
				modelValue: I.value,
				"onUpdate:modelValue": o[25] ||= (e) => I.value = e,
				title: "将课程转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [C(F(n), { onClick: o[24] ||= (e) => I.value = !1 }, {
					default: R(() => [...o[38] ||= [S("取消", -1)]]),
					_: 1
				}), C(F(n), {
					variant: "primary",
					onClick: je
				}, {
					default: R(() => [...o[39] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, at));
	}
}), [["__scopeId", "data-v-5463d19a"]]), xt = { class: "academy-courses" }, St = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = he(), { formatDateTime: r } = he(), { academyDifficulties: i, academyPublishStates: a, getAcademyList: s, getAcademyMetadata: ee } = Ge(), c = M(!1), l = M(), u = (e) => t([`cms_academy:${e}`]), d = M(), f = K(ee, (e) => {
			d.value = e;
		}), te = [
			...G(),
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
		})), ae = f.loadMetadata;
		function h(e) {
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
		}, null, 8, ["course-id"])) : y("", !0), fe(C(F(re), E(F(ie), {
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
			"cell-cms_source_type": R(({ row: e }) => [C(ve, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": R(() => [u("add") ? (k(), v(F(n), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => h()
			}, {
				icon: R(() => [C(F(g), {
					name: "plus",
					size: 14
				})]),
				default: R(() => [t[2] ||= S("新增课程", -1)]),
				_: 1
			})) : y("", !0)]),
			"cell-publish_status": R(({ row: e }) => [C(F(o), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: R(() => [S(P(F(a).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": R(({ row: e }) => [C(F(o), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: R(() => [S(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": R(({ row: e }) => [S(P(F(r)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": R(({ row: e }) => [C(F(n), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑课程" : "课程详情",
				"aria-label": u("edit") ? "编辑课程" : "课程详情",
				onClick: (t) => h(e.id)
			}, {
				default: R(() => [C(F(g), {
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
		}, 16), [[L, !c.value]])]));
	}
}), [["__scopeId", "data-v-8efe9924"]]);
//#endregion
//#region src/cms/api/content/help.ts
function Ct() {
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
var wt = ["aria-checked", "disabled"], Tt = /*#__PURE__*/ h(/* @__PURE__ */ w({
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
}, kt = { class: "taxonomy-editor__field" }, At = { class: "taxonomy-editor__row" }, jt = "分类", Mt = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(t) {
		let { helpError: r, deleteHelp: i, getHelpMetadata: a, getHelpList: ee, getHelpDetail: c, saveHelp: l, uploadHelpCategoryImage: te } = Ct(), { hasPermission: h } = he(), { formatDateTime: oe } = he(), w = (e) => h([`cms_help_category:${e}`]), T = M(), D = M(), O = K(a, (e) => {
			T.value = e;
		}), ce = [
			{
				key: "name",
				dataIndex: "name",
				title: "分类名称",
				width: 210,
				hideable: !1
			},
			...G(),
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
		]), { proTableBindings: le, rows: N, reload: I } = O.bindTable(ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: A,
			request: async ({ filters: e, signal: t, reason: n }) => {
				let r = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), i = await U((e, n) => ee("categories", {
					...r,
					page_no: e,
					page_size: n
				}, t), t);
				return !t.aborted && (n === "query" || n === "reset") && (L.value = Object.keys(r).length ? new Set(i.rows.filter((e) => e.parent_id != null).map((e) => String(e.parent_id))) : /* @__PURE__ */ new Set()), i;
			}
		})), { visibleRows: ue, expanded: L, groups: de, allExpanded: fe, toggle: pe, toggleAll: z } = W(N), ge = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			image_url: "",
			image_media_id: null,
			sort_order: 10,
			is_enabled: !0
		}), B = j(ge()), V = M(!1), H = M(!1), q = M(!1), J = M(!1), ye = M(!1), be = M(!1), Y = M(""), xe = M(!1), Se = M(""), X = _(() => !w(B.id ? "edit" : "add")), Z = _(() => J.value || ye.value || V.value), Ce;
		async function Q(e) {
			Ce?.abort(), Ce = new AbortController();
			let t = Ce;
			Object.assign(B, ge(), { id: e || "" }), Se.value = "", be.value = !1, Y.value = "", xe.value = !1, H.value = !0, q.value = !0;
			try {
				if (D.value = await a(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await c("categories", e, t.signal);
				if (D.value = await a(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(B, {
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
				t.signal.aborted || (xe.value = !0, Se.value = r(e));
			} finally {
				t.signal.aborted || (q.value = !1);
			}
		}
		function $() {
			return Z.value ? !1 : (Ce?.abort(), !0);
		}
		function we() {
			$() && (H.value = !1);
		}
		async function Te() {
			if (!(X.value || Z.value || q.value || xe.value)) {
				if (!B.name.trim() || B.sort_order === null) {
					Se.value = "请填写分类名称和排序";
					return;
				}
				J.value = !0, Se.value = "";
				try {
					await l("categories", {
						name: B.name,
						parent_id: B.parent_id || null,
						image_media_id: B.image_media_id,
						sort_order: B.sort_order,
						is_enabled: B.is_enabled,
						id: B.id || void 0,
						row_version: B.id ? B.row_version : void 0
					}), H.value = !1, u.success("保存成功"), await Promise.all([I(), ke()]);
				} catch (e) {
					Se.value = r(e);
				} finally {
					J.value = !1;
				}
			}
		}
		function Ee() {
			!B.id || !w("delete") || Z.value || q.value || xe.value || (Y.value = "", be.value = !0);
		}
		async function De() {
			if (!(!be.value || !B.id || !w("delete") || Z.value || q.value || xe.value)) {
				ye.value = !0, Y.value = "";
				try {
					await i("categories", B.id, B.row_version), be.value = !1, H.value = !1, u.success("分类已删除"), await Promise.all([I(), ke()]);
				} catch (e) {
					Y.value = r(e);
				} finally {
					ye.value = !1;
				}
			}
		}
		let Oe = _(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(D.value?.categories || []).filter((e) => !e.parent_id && e.id !== B.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), ke = O.loadMetadata;
		return se(() => {
			Ce?.abort();
		}), (t, i) => (k(), b("div", Et, [
			C(F(re), E(F(le), {
				"auto-refreshable": !1,
				columns: ce,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${jt}管理`,
				data: F(ue),
				"show-pagination": !1
			}), {
				"cell-cms_source_type": R(({ row: e }) => [C(ve, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [w("add") ? (k(), v(F(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: i[0] ||= (e) => Q()
				}, {
					icon: R(() => [C(F(g), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [S("新增" + P(jt))]),
					_: 1
				})) : y("", !0), C(F(n), {
					size: "sm",
					disabled: !F(de).children.size,
					onClick: F(z)
				}, {
					icon: R(() => [C(F(g), {
						name: F(fe) ? "chevron-up" : "chevron-down",
						size: 14
					}, null, 8, ["name"])]),
					default: R(() => [S(" " + P(F(fe) ? "全部收起" : "全部展开"), 1)]),
					_: 1
				}, 8, ["disabled", "onClick"])]),
				"cell-name": R(({ row: e }) => [C(_e, {
					name: e.name,
					child: e.parent_id != null,
					branch: F(de).children.has(e.id),
					expanded: F(L).has(e.id),
					onToggle: (t) => F(pe)(e.id)
				}, null, 8, [
					"name",
					"child",
					"branch",
					"expanded",
					"onToggle"
				])]),
				"cell-is_enabled": R(({ row: e }) => [C(F(o), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [S(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": R(({ row: e }) => [C(F(n), {
					size: "sm",
					"icon-only": "",
					title: w("edit") ? `编辑${jt}` : `${jt}详情`,
					"aria-label": `编辑${jt}`,
					onClick: (t) => Q(e.id)
				}, {
					default: R(() => [C(F(g), {
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
			C(F(d), {
				modelValue: H.value,
				"onUpdate:modelValue": i[10] ||= (e) => H.value = e,
				title: `${B.id ? "编辑" : "新增"}帮助${jt}`,
				width: "680px",
				subtitle: "帮助分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": $
			}, {
				footer: R(() => [
					B.id && w("delete") ? (k(), v(F(n), {
						key: 0,
						variant: "danger",
						disabled: q.value || xe.value || Z.value,
						onClick: Ee
					}, {
						icon: R(() => [C(F(g), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [i[14] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(F(n), {
						disabled: Z.value,
						onClick: we
					}, {
						default: R(() => [...i[15] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					X.value ? y("", !0) : (k(), v(F(n), {
						key: 1,
						variant: "primary",
						loading: J.value,
						disabled: q.value || xe.value || ye.value || V.value,
						onClick: Te
					}, {
						default: R(() => [S("保存" + P(jt))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": q.value
				}, [
					q.value ? (k(), b("div", Ot, [C(F(g), {
						name: "loader-circle",
						class: "help-spin",
						size: 24
					}), x("span", null, "正在读取" + P(jt) + "...")])) : y("", !0),
					Se.value ? (k(), v(F(p), {
						key: 1,
						type: "error",
						closable: !1,
						description: Se.value
					}, null, 8, ["description"])) : y("", !0),
					!q.value && !xe.value ? (k(), v(F(f), {
						key: 2,
						model: B,
						"label-position": "top",
						onSubmit: me(Te, ["prevent"])
					}, {
						default: R(() => [
							B.id ? (k(), v(F(m), {
								key: 0,
								label: "分类ID"
							}, {
								default: R(() => [C(F(ae), {
									"model-value": B.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : y("", !0),
							C(F(m), {
								label: `${jt}名称`,
								required: ""
							}, {
								default: R(() => [C(F(ae), {
									modelValue: B.name,
									"onUpdate:modelValue": i[1] ||= (e) => B.name = e,
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
								default: R(() => [x("div", kt, [C(F(ie), {
									modelValue: B.parent_id,
									"onUpdate:modelValue": i[2] ||= (e) => B.parent_id = e,
									options: Oe.value,
									disabled: X.value || Z.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), i[13] ||= x("p", { class: "help-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类文章。 ", -1)])]),
								_: 1
							}),
							C(F(m), { label: "分类图片" }, {
								default: R(() => [C(e, {
									class: "taxonomy-editor__image",
									modelValue: B.image_url,
									"onUpdate:modelValue": i[3] ||= (e) => B.image_url = e,
									label: "分类图片",
									upload: F(te),
									disabled: X.value || Z.value,
									"onUpdate:mediaId": i[4] ||= (e) => B.image_media_id = e,
									onBusyChange: i[5] ||= (e) => V.value = e,
									onStart: i[6] ||= (e) => Se.value = "",
									onError: i[7] ||= (e) => Se.value = F(r)(e)
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
								default: R(() => [C(F(s), {
									modelValue: B.sort_order,
									"onUpdate:modelValue": i[8] ||= (e) => B.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: X.value || Z.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(F(m), { label: "启用状态" }, {
								default: R(() => [C(Tt, {
									modelValue: B.is_enabled,
									"onUpdate:modelValue": i[9] ||= (e) => B.is_enabled = e,
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
			C(F(d), {
				modelValue: be.value,
				"onUpdate:modelValue": i[12] ||= (e) => be.value = e,
				title: "删除帮助分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !ye.value
			}, {
				footer: R(() => [C(F(n), {
					disabled: ye.value,
					onClick: i[11] ||= (e) => be.value = !1
				}, {
					default: R(() => [...i[16] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(n), {
					variant: "danger",
					loading: ye.value,
					onClick: De
				}, {
					default: R(() => [...i[17] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [x("p", null, "确认删除分类“" + P(B.name) + "”？有关联文章或子分类的分类无法删除。", 1), Y.value ? (k(), v(F(p), {
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
}, Yt = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: r }) {
		let { helpError: a, helpCategoryLabel: o, deleteHelp: ee, getHelpDetail: c, getHelpMetadata: l, getHelpList: te, saveHelp: ne, uploadHelpCover: re } = Ct(), { hasPermission: h } = he(), w = t, T = r, E = M(!0), D = M(!1), O = M(!1), A = M(""), le = M(!1), N = M(!1), I = M(!1), L = M(!1), de = M(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), z = M(), B = M("draft"), V = M(!1), H = _(() => h(["cms_help:publish"])), _e = _(() => !h([`cms_help:${w.articleId ? "edit" : "add"}`]) || !H.value && B.value !== "draft"), U = _(() => h(["cms_help:delete"]) && (H.value || B.value === "draft"));
		async function W() {
			if (!(!U.value || D.value || E.value || O.value)) {
				D.value = !0, A.value = "";
				try {
					await ee("articles", K.id, K.row_version), Ae = JSON.stringify(K), u.success("文章已删除"), T("saved");
				} catch (e) {
					A.value = a(e), L.value = !1;
				} finally {
					D.value = !1;
				}
			}
		}
		let G = _(() => _e.value || D.value), K = j({
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
		}), { editorRoot: ve, seoInput: q, fieldRules: J, fieldErrors: ye, pendingCount: be, saveError: Y, validateSave: xe, setSaveFailure: Se, focusFirstError: X, focusSeoError: Z } = Ee(K, () => z.value?.categories || [], "help", le), Ce = M(""), Q = M(!1), $ = M([]), we = _(() => $.value.filter((e) => e.id !== w.articleId).map((e) => ({
			label: `${e.title} · ${e.code}`,
			value: e.id
		})));
		async function Te() {
			if (!(G.value || Q.value)) {
				Q.value = !0;
				try {
					let e = await te("articles", {
						keyword: Ce.value,
						page_size: 100
					}, je?.signal), t = $.value.filter((e) => K.related_content_ids.includes(e.id));
					$.value = [...new Map([...t, ...e.lists].map((e) => [e.id, e])).values()];
				} catch (e) {
					je?.signal.aborted || (A.value = a(e));
				} finally {
					Q.value = !1;
				}
			}
		}
		let De = _(() => (z.value?.categories || []).filter((e) => e.parent_id != null).map((e) => ({
			label: o(z.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), Oe = _(() => z.value?.categories.find((e) => e.id === K.category_id && e.parent_id == null)), ke = _({
			get: () => Oe.value ? "" : K.category_id,
			set: (e) => {
				K.category_id = e;
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
				if (z.value = await l(e.signal, { cms_source_type: "platform" }), w.articleId) {
					let t = await c("articles", w.articleId, e.signal);
					if (z.value = await l(e.signal, { space_id: String(t.space_id) }), de.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"sort_order",
						"is_enabled"
					]) Object.assign(K, { [e]: t[e] });
					K.category_id = t.category_id || "", K.search_keywords = t.search_keywords || "", K.helpful_enabled = t.helpful_enabled ?? !0, K.related_content_ids = t.related_content_ids || [], $.value = t.related_articles || [];
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url",
						"content_source",
						"author_name"
					]) K[e] = t[e] || "";
					K.scheduled_local = t.publish_status === "scheduled" ? Me(t.scheduled_at) : "", B.value = t.publish_status;
				}
				Ae = JSON.stringify(K);
			} catch (t) {
				e.signal.aborted || (A.value = a(t), O.value = !0);
			} finally {
				e.signal.aborted || (E.value = !1);
			}
		}
		let Pe = () => !E.value && !O.value && Ae !== JSON.stringify(K);
		function Fe() {
			Pe() ? N.value = !0 : T("close");
		}
		function Ie() {
			B.value === "draft" ? Re("draft") : I.value = !0;
		}
		function Le() {
			I.value = !1, Re("draft");
		}
		async function Re(e) {
			if (G.value || E.value || O.value || V.value || (A.value = "", !await xe(e))) return;
			let t = K.scheduled_local ? new Date(K.scheduled_local) : null;
			D.value = !0, A.value = "";
			try {
				await ne("articles", {
					...K,
					id: K.id || void 0,
					row_version: K.id ? K.row_version : void 0,
					category_id: K.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), Ae = JSON.stringify(K), u.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "文章已发布"), T("saved");
			} catch (e) {
				Se(e);
			} finally {
				D.value = !1;
			}
			be.value && await X();
		}
		function ze(e) {
			A.value = a(e);
		}
		let Be = (e) => {
			Pe() && (e.preventDefault(), e.returnValue = "");
		};
		return ge(() => !D.value && !V.value && (!Pe() || window.confirm("文章有未保存的修改，确定离开？"))), ce(() => {
			Ne(), window.addEventListener("beforeunload", Be);
		}), se(() => {
			je?.abort(), window.removeEventListener("beforeunload", Be);
		}), (r, a) => (k(), b("section", {
			ref_key: "editorRoot",
			ref: ve,
			class: "article-editor",
			"aria-busy": E.value || D.value
		}, [
			x("header", Pt, [
				C(F(n), {
					"icon-only": "",
					title: "返回文章列表",
					"aria-label": "返回文章列表",
					disabled: D.value || V.value,
					onClick: Fe
				}, {
					default: R(() => [C(F(g), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", Ft, [x("h2", null, P(t.articleId ? "编辑文章" : "新增文章"), 1), x("span", null, P(z.value?.source_locale || "zh-CN") + " · " + P(de.value), 1)]),
				x("div", It, [
					t.articleId && U.value ? (k(), v(F(n), {
						key: 0,
						size: "sm",
						disabled: E.value || O.value || D.value || V.value,
						onClick: a[0] ||= (e) => L.value = !0
					}, {
						default: R(() => [...a[32] ||= [S("删除文章", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(F(n), {
						size: "sm",
						disabled: E.value || O.value,
						onClick: a[1] ||= (e) => le.value = !0
					}, {
						icon: R(() => [C(F(g), {
							name: "search",
							size: 14
						})]),
						default: R(() => [a[33] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					_e.value ? y("", !0) : (k(), v(F(n), {
						key: 1,
						size: "sm",
						disabled: E.value || O.value || D.value || V.value,
						onClick: Ie
					}, {
						icon: R(() => [C(F(g), {
							name: "save",
							size: 14
						})]),
						default: R(() => [a[34] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					F(Y) ? (k(), b("span", Lt, P(F(Y)), 1)) : y("", !0),
					!_e.value && F(be) ? (k(), b("span", Rt, "还有 " + P(F(be)) + " 项待完善", 1)) : y("", !0),
					!_e.value && H.value ? (k(), v(F(n), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: E.value || O.value || V.value,
						loading: D.value,
						onClick: a[2] ||= (e) => Re(K.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [C(F(g), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [S(P(K.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)
				])
			]),
			E.value ? (k(), b("div", zt, [C(F(g), {
				name: "loader-circle",
				class: "help-spin",
				size: 28
			}), a[35] ||= x("span", null, "正在读取文章资料...", -1)])) : O.value ? (k(), b("div", Bt, [C(F(p), {
				type: "error",
				description: A.value,
				closable: !1
			}, null, 8, ["description"]), C(F(n), { onClick: Ne }, {
				default: R(() => [...a[36] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (k(), b(oe, { key: 2 }, [A.value ? (k(), b("div", Vt, [C(F(p), {
				type: "error",
				description: A.value,
				closable: !1
			}, null, 8, ["description"])])) : y("", !0), x("div", Ht, [x("aside", Ut, [C(F(f), {
				model: K,
				rules: F(J),
				"label-position": "top",
				onSubmit: a[16] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					C(F(m), {
						label: "文章分类",
						prop: "category_id",
						error: F(ye).category_id,
						required: ""
					}, {
						default: R(() => [C(F(ie), {
							modelValue: ke.value,
							"onUpdate:modelValue": a[3] ||= (e) => ke.value = e,
							options: De.value,
							placeholder: Oe.value ? "原分类：" + Oe.value.name + "（请选择二级分类）" : "请选择二级分类",
							clearable: "",
							disabled: G.value,
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
					C(F(m), {
						label: "文章封面",
						prop: "cover_url",
						error: F(ye).cover_url
					}, {
						default: R(() => [C(e, {
							modelValue: K.cover_url,
							"onUpdate:modelValue": a[4] ||= (e) => K.cover_url = e,
							label: "文章封面",
							disabled: G.value,
							upload: F(re),
							onBusyChange: a[5] ||= (e) => V.value = e,
							onStart: a[6] ||= (e) => A.value = "",
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
						error: F(ye).content_source
					}, {
						default: R(() => [C(F(ae), {
							modelValue: K.content_source,
							"onUpdate:modelValue": a[7] ||= (e) => K.content_source = e,
							maxlength: 160,
							disabled: G.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "作者署名",
						prop: "author_name",
						error: F(ye).author_name
					}, {
						default: R(() => [C(F(ae), {
							modelValue: K.author_name,
							"onUpdate:modelValue": a[8] ||= (e) => K.author_name = e,
							maxlength: 120,
							disabled: G.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "前端排序",
						prop: "sort_order",
						error: F(ye).sort_order
					}, {
						default: R(() => [C(F(s), {
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
					a[40] ||= x("h3", null, "发布设置", -1),
					C(F(m), {
						label: "搜索关键词",
						prop: "search_keywords",
						error: F(ye).search_keywords
					}, {
						default: R(() => [C(F(ae), {
							modelValue: K.search_keywords,
							"onUpdate:modelValue": a[10] ||= (e) => K.search_keywords = e,
							maxlength: 2e3,
							disabled: G.value,
							placeholder: "使用空格或逗号分隔",
							"aria-label": "搜索关键词"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: F(ye).helpful_enabled
					}, {
						default: R(() => [C(Tt, {
							modelValue: K.helpful_enabled,
							"onUpdate:modelValue": a[11] ||= (e) => K.helpful_enabled = e,
							disabled: G.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "相关文章",
						prop: "related_content_ids",
						error: F(ye).related_content_ids
					}, {
						default: R(() => [x("div", Wt, [
							C(F(ae), {
								modelValue: Ce.value,
								"onUpdate:modelValue": a[12] ||= (e) => Ce.value = e,
								disabled: G.value,
								placeholder: "搜索文章标题",
								"aria-label": "搜索相关文章",
								onKeydown: pe(me(Te, ["prevent"]), ["enter"])
							}, null, 8, [
								"modelValue",
								"disabled",
								"onKeydown"
							]),
							C(F(n), {
								size: "sm",
								disabled: G.value,
								loading: Q.value,
								onClick: Te
							}, {
								default: R(() => [...a[37] ||= [S("查找文章", -1)]]),
								_: 1
							}, 8, ["disabled", "loading"]),
							C(F(ie), {
								modelValue: K.related_content_ids,
								"onUpdate:modelValue": a[13] ||= (e) => K.related_content_ids = e,
								options: we.value,
								multiple: "",
								clearable: "",
								disabled: G.value,
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
					C(F(m), {
						label: "启用状态",
						prop: "is_enabled",
						error: F(ye).is_enabled
					}, {
						default: R(() => [C(Tt, {
							modelValue: K.is_enabled,
							"onUpdate:modelValue": a[14] ||= (e) => K.is_enabled = e,
							disabled: G.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: F(ye).scheduled_local
					}, {
						default: R(() => [C(F(ae), {
							modelValue: K.scheduled_local,
							"onUpdate:modelValue": a[15] ||= (e) => K.scheduled_local = e,
							type: "datetime-local",
							disabled: G.value || !H.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[41] ||= x("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", Gt, [C(F(f), {
				model: K,
				rules: F(J),
				"label-position": "top",
				onSubmit: a[20] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					C(F(m), {
						label: "标题",
						prop: "title",
						error: F(ye).title,
						required: ""
					}, {
						default: R(() => [C(F(ae), {
							modelValue: K.title,
							"onUpdate:modelValue": a[17] ||= (e) => K.title = e,
							maxlength: 255,
							disabled: G.value,
							placeholder: "输入文章标题",
							"aria-label": "文章标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "摘要",
						prop: "summary",
						error: F(ye).summary
					}, {
						default: R(() => [fe(x("textarea", {
							"onUpdate:modelValue": a[18] ||= (e) => K.summary = e,
							"aria-invalid": !!F(ye).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: G.value,
							"aria-label": "文章摘要"
						}, null, 8, Kt), [[ue, K.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "正文",
						prop: "body_html",
						error: F(ye).body_html
					}, {
						default: R(() => [C(F(i), {
							modelValue: K.body_html,
							"onUpdate:modelValue": a[19] ||= (e) => K.body_html = e,
							readonly: _e.value,
							disabled: D.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "文章正文"
						}, {
							"image-upload": R(({ url: t, setUrl: n, setBusy: r }) => [C(e, {
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
			C(F(d), {
				modelValue: le.value,
				"onUpdate:modelValue": a[24] ||= (e) => le.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: R(() => [C(F(n), {
					variant: "primary",
					onClick: a[23] ||= (e) => le.value = !1
				}, {
					default: R(() => [...a[42] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [C(F(f), {
					model: K,
					rules: F(J),
					"label-position": "top",
					onSubmit: a[22] ||= me(() => {}, ["prevent"])
				}, {
					default: R(() => [C(F(m), {
						label: "SEO 描述",
						prop: "seo_description",
						error: F(ye).seo_description
					}, {
						default: R(() => [fe(x("textarea", {
							ref_key: "seoInput",
							ref: q,
							"onUpdate:modelValue": a[21] ||= (e) => K.seo_description = e,
							"aria-invalid": !!F(ye).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: G.value,
							"aria-label": "SEO 描述"
						}, null, 8, qt), [[ue, K.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(F(d), {
				modelValue: L.value,
				"onUpdate:modelValue": a[26] ||= (e) => L.value = e,
				title: "确认删除",
				subtitle: `操作对象：${K.title || "未命名文章"}`,
				width: "460px",
				"panel-class": "help-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !D.value
			}, {
				"header-actions": R(() => [x("span", Jt, [C(F(g), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [C(F(n), {
					disabled: D.value,
					onClick: a[25] ||= (e) => L.value = !1
				}, {
					default: R(() => [...a[43] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(n), {
					variant: "warning",
					loading: D.value,
					onClick: W
				}, {
					default: R(() => [...a[44] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [C(F(p), {
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
			C(F(d), {
				modelValue: N.value,
				"onUpdate:modelValue": a[29] ||= (e) => N.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [C(F(n), { onClick: a[27] ||= (e) => N.value = !1 }, {
					default: R(() => [...a[45] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(F(n), {
					variant: "primary",
					onClick: a[28] ||= (e) => T("close")
				}, {
					default: R(() => [...a[46] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(F(d), {
				modelValue: I.value,
				"onUpdate:modelValue": a[31] ||= (e) => I.value = e,
				title: "将文章转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [C(F(n), { onClick: a[30] ||= (e) => I.value = !1 }, {
					default: R(() => [...a[47] ||= [S("取消", -1)]]),
					_: 1
				}), C(F(n), {
					variant: "primary",
					onClick: Le
				}, {
					default: R(() => [...a[48] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Nt));
	}
}), [["__scopeId", "data-v-438b969d"]]), Xt = { class: "help-articles" }, Zt = {
	key: 0,
	class: "help-statistics-note"
}, Qt = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let t = he(), { helpPublishStates: r, helpCategoryLabel: i, getHelpList: a, getHelpMetadata: s } = Ct(), { hasPermission: ee } = he(), { formatDateTime: c } = he(), l = M(!1), u = M(), d = (e) => ee([`cms_help:${e}`]), f = M(), te = K(s, (e) => {
			f.value = e;
		}), p = [
			...G(),
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
		], ie = _(() => [
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
		]), { proTableBindings: m, reload: ae } = te.bindTable(ne({
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
		})), h = te.loadMetadata;
		function oe(e) {
			u.value = e, l.value = !0;
		}
		function x() {
			l.value = !1, ae(), h();
		}
		return (e, i) => (k(), b("div", Xt, [
			!l.value && F(t).mode === "platform" ? (k(), b("p", Zt, " 当前管理平台默认模板。浏览量、评价数及有帮助率属于站点运行数据，此处显示“—”，不汇总白标站点。 ")) : y("", !0),
			l.value ? (k(), v(Yt, {
				key: 1,
				"article-id": u.value,
				onClose: i[0] ||= (e) => l.value = !1,
				onSaved: x
			}, null, 8, ["article-id"])) : y("", !0),
			fe(C(F(re), E(F(m), {
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
				"cell-cms_source_type": R(({ row: e }) => [C(ve, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [d("add") ? (k(), v(F(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: i[1] ||= (e) => oe()
				}, {
					icon: R(() => [C(F(g), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [i[2] ||= S("新增文章", -1)]),
					_: 1
				})) : y("", !0)]),
				"cell-publish_status": R(({ row: e }) => [C(F(o), {
					size: "sm",
					effect: "soft",
					type: e.publish_status === "published" ? "success" : "warning"
				}, {
					default: R(() => [S(P(F(r).find((t) => t.value === e.publish_status)?.label), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-is_enabled": R(({ row: e }) => [C(F(o), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [S(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-publish_time": R(({ row: e }) => [S(P(F(c)(e.published_at || e.scheduled_at)), 1)]),
				"cell-actions": R(({ row: e }) => [C(F(n), {
					size: "sm",
					"icon-only": "",
					title: d("edit") ? "编辑文章" : "文章详情",
					"aria-label": d("edit") ? "编辑文章" : "文章详情",
					onClick: (t) => oe(e.id)
				}, {
					default: R(() => [C(F(g), {
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
			}, 16), [[L, !l.value]])
		]));
	}
}), [["__scopeId", "data-v-9671264b"]]);
//#endregion
//#region src/cms/api/content/feedback.ts
function $t() {
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
}, sn = { class: "attachment-title" }, cn = ["src", "alt"], ln = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { getFeedbackList: t, getFeedbackMetadata: r, getFeedbackDetail: i, getFeedbackAttachment: a, feedbackSourceTypes: s, feedbackSourceLabel: ee, feedbackError: c } = $t(), { formatDateTime: l } = he(), u = M({
			scenes: [],
			issues: []
		}), f = K(r, (e) => {
			u.value = e;
		}), te = [
			...G(),
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
		})), ae = M(!1), h = M(!1), w = M(""), T = M(), D = M({}), O = M(""), ce;
		async function A(e) {
			ce?.abort();
			let t = new AbortController();
			ce = t, T.value = void 0, D.value = {}, w.value = "", O.value = "", ae.value = !0, h.value = !0;
			try {
				let n = await i(e, t.signal);
				t.signal.aborted || (T.value = n);
			} catch (e) {
				t.signal.aborted || (w.value = c(e));
			} finally {
				t.signal.aborted || (h.value = !1);
			}
		}
		async function j(e) {
			let t = ce, n = T.value?.id;
			if (!(!t || !n || O.value)) {
				O.value = e, w.value = "";
				try {
					let r = await a(n, e, t.signal);
					!t.signal.aborted && /^data:image\/(png|jpeg|webp|svg\+xml|x-icon|vnd\.microsoft\.icon);base64,[A-Za-z0-9+/=]+$/.test(r.data_url) && (D.value[e] = r.data_url);
				} catch (e) {
					t.signal.aborted || (w.value = c(e));
				} finally {
					t.signal.aborted || (O.value = "");
				}
			}
		}
		return de(ae, (e) => {
			e || (ce?.abort(), T.value = void 0, D.value = {}, w.value = "");
		}), se(() => {
			ce?.abort();
		}), (e, t) => (k(), b("div", en, [C(F(re), E(F(m), {
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
			"cell-cms_source_type": R(({ row: e }) => [C(ve, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"cell-source_type": R(({ row: e }) => [C(F(o), {
				size: "sm",
				effect: "soft",
				type: e.source_type === "merchant" ? "warning" : e.source_type === "platform" ? "success" : "primary"
			}, {
				default: R(() => [S(P(F(ee)(e.source_type)), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-actions": R(({ row: e }) => [C(F(n), {
				size: "sm",
				"icon-only": "",
				title: "查看反馈",
				"aria-label": "查看反馈",
				onClick: (t) => A(e.id)
			}, {
				default: R(() => [C(F(g), {
					name: "eye",
					size: 15
				})]),
				_: 1
			}, 8, ["onClick"])]),
			_: 1
		}, 16), C(F(d), {
			modelValue: ae.value,
			"onUpdate:modelValue": t[1] ||= (e) => ae.value = e,
			title: "反馈详情",
			subtitle: T.value?.code || "查看用户正式提交的意见反馈",
			width: "760px",
			"close-on-click-modal": !1
		}, {
			footer: R(() => [C(F(n), { onClick: t[0] ||= (e) => ae.value = !1 }, {
				default: R(() => [...t[14] ||= [S("关闭", -1)]]),
				_: 1
			})]),
			default: R(() => [x("div", {
				class: "feedback-detail",
				"aria-busy": h.value
			}, [
				h.value ? (k(), b("p", nn, "正在读取反馈…")) : y("", !0),
				w.value ? (k(), v(F(p), {
					key: 1,
					type: "error",
					closable: !1,
					description: w.value
				}, null, 8, ["description"])) : y("", !0),
				T.value && !h.value ? (k(), b(oe, { key: 2 }, [
					x("dl", rn, [
						x("div", null, [t[2] ||= x("dt", null, "UID", -1), x("dd", null, P(T.value.public_user_id_snapshot), 1)]),
						x("div", null, [t[3] ||= x("dt", null, "用户账号", -1), x("dd", null, P(T.value.username_snapshot || "—"), 1)]),
						x("div", null, [t[4] ||= x("dt", null, "来源类型", -1), x("dd", null, P(F(ee)(T.value.source_type)), 1)]),
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
						}, [x("div", sn, [x("span", null, P(e.original_name || "图片附件") + " · " + P(Math.ceil(e.byte_size / 1024)) + " KB", 1), C(F(n), {
							size: "sm",
							loading: O.value === e.id,
							onClick: (t) => j(e.id)
						}, {
							default: R(() => [...t[12] ||= [S("查看图片", -1)]]),
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
}), [["__scopeId", "data-v-750f3a8a"]]);
//#endregion
//#region src/cms/api/content/announcement.ts
function un() {
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
}, mn = { class: "taxonomy-editor__field" }, hn = { class: "taxonomy-editor__row" }, gn = "分类", _n = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(t) {
		let { hasPermission: r } = he(), { formatDateTime: i } = he(), { announcementError: a, deleteAnnouncement: ee, getAnnouncementMetadata: c, getAnnouncementList: l, getAnnouncementDetail: te, saveAnnouncement: h, uploadAnnouncementCategoryImage: oe } = un(), w = (e) => r([`cms_announcement_category:${e}`]), T = M(), D = M(), O = K(c, (e) => {
			T.value = e;
		}), ce = [
			{
				key: "name",
				dataIndex: "name",
				title: "分类名称",
				width: 210,
				hideable: !1
			},
			...G(),
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
		], { proTableBindings: le, rows: N, reload: I } = O.bindTable(ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: A,
			request: async ({ filters: e, signal: t, reason: n }) => {
				let r = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), i = await U((e, n) => l("categories", {
					...r,
					page_no: e,
					page_size: n
				}, t), t);
				return !t.aborted && (n === "query" || n === "reset") && (L.value = Object.keys(r).length ? new Set(i.rows.filter((e) => e.parent_id != null).map((e) => String(e.parent_id))) : /* @__PURE__ */ new Set()), i;
			}
		})), { visibleRows: ue, expanded: L, groups: de, allExpanded: fe, toggle: pe, toggleAll: z } = W(N), ge = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			image_url: "",
			image_media_id: null,
			sort_order: 10,
			is_enabled: !0
		}), B = j(ge()), V = M(!1), H = M(!1), q = M(!1), J = M(!1), be = M(!1), Y = M(""), xe = M(!1), Se = M(""), X = M(!1), Z = _(() => !w(B.id ? "edit" : "add")), Ce = M(!1), Q = _(() => q.value || J.value || Ce.value), $ = "", we;
		async function Te(e) {
			we?.abort(), we = new AbortController();
			let t = we;
			Object.assign(B, ge(), { id: e || "" }), Se.value = "", be.value = !1, Y.value = "", xe.value = !1, V.value = !0, H.value = !0, $ = JSON.stringify(B);
			try {
				if (D.value = await c(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await te("categories", e, t.signal);
				if (D.value = await c(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(B, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					image_url: n.image_url || "",
					image_media_id: n.image_media_id || null,
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), $ = JSON.stringify(B);
			} catch (e) {
				t.signal.aborted || (xe.value = !0, Se.value = a(e));
			} finally {
				t.signal.aborted || (H.value = !1);
			}
		}
		function Ee() {
			return Q.value ? !1 : !H.value && !xe.value && JSON.stringify(B) !== $ ? (X.value = !0, !1) : (we?.abort(), !0);
		}
		function De() {
			Ee() && (V.value = !1);
		}
		function Oe() {
			we?.abort(), X.value = !1, V.value = !1;
		}
		async function ke() {
			if (!(Z.value || Q.value || H.value || xe.value)) {
				if (!B.name.trim() || B.sort_order === null) {
					Se.value = "请填写分类名称和排序";
					return;
				}
				q.value = !0, Se.value = "";
				try {
					await h("categories", {
						name: B.name,
						parent_id: B.parent_id || null,
						image_media_id: B.image_media_id,
						sort_order: B.sort_order,
						is_enabled: B.is_enabled,
						id: B.id || void 0,
						row_version: B.id ? B.row_version : void 0
					}), V.value = !1, u.success("保存成功"), await Promise.all([I(), Ne()]);
				} catch (e) {
					Se.value = a(e);
				} finally {
					q.value = !1;
				}
			}
		}
		function Ae() {
			!B.id || !w("delete") || Q.value || H.value || xe.value || (Y.value = "", be.value = !0);
		}
		async function je() {
			if (!(!be.value || !B.id || !w("delete") || Q.value || H.value || xe.value)) {
				J.value = !0, Y.value = "";
				try {
					await ee("categories", B.id, B.row_version), be.value = !1, V.value = !1, u.success("分类已删除"), await Promise.all([I(), Ne()]);
				} catch (e) {
					Y.value = a(e);
				} finally {
					J.value = !1;
				}
			}
		}
		let Me = _(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(D.value?.categories || []).filter((e) => !e.parent_id && e.id !== B.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Ne = O.loadMetadata;
		return se(() => {
			we?.abort();
		}), (t, r) => (k(), b("div", dn, [
			C(F(re), E(F(le), {
				"auto-refreshable": !1,
				columns: ce,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${gn}管理`,
				data: F(ue),
				"show-pagination": !1
			}), {
				"cell-cms_source_type": R(({ row: e }) => [C(ve, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [w("add") ? (k(), v(F(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => Te()
				}, {
					icon: R(() => [C(F(g), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [S("新增" + P(gn))]),
					_: 1
				})) : y("", !0), C(F(n), {
					size: "sm",
					disabled: !F(de).children.size,
					onClick: F(z)
				}, {
					icon: R(() => [C(F(g), {
						name: F(fe) ? "chevron-up" : "chevron-down",
						size: 14
					}, null, 8, ["name"])]),
					default: R(() => [S(" " + P(F(fe) ? "全部收起" : "全部展开"), 1)]),
					_: 1
				}, 8, ["disabled", "onClick"])]),
				"cell-name": R(({ row: e }) => [C(_e, {
					name: e.name,
					child: e.parent_id != null,
					branch: F(de).children.has(e.id),
					expanded: F(L).has(e.id),
					onToggle: (t) => F(pe)(e.id)
				}, null, 8, [
					"name",
					"child",
					"branch",
					"expanded",
					"onToggle"
				])]),
				"cell-is_enabled": R(({ row: e }) => [C(F(o), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [S(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": R(({ row: e }) => [C(F(n), {
					size: "sm",
					"icon-only": "",
					title: w("edit") ? `编辑${gn}` : `${gn}详情`,
					"aria-label": w("edit") ? `编辑${gn}` : `${gn}详情`,
					onClick: (t) => Te(e.id)
				}, {
					default: R(() => [C(F(g), {
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
			C(F(d), {
				modelValue: V.value,
				"onUpdate:modelValue": r[10] ||= (e) => V.value = e,
				title: `${B.id ? "编辑" : "新增"}公告${gn}`,
				width: "680px",
				subtitle: "公告分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Ee
			}, {
				footer: R(() => [
					B.id && w("delete") ? (k(), v(F(n), {
						key: 0,
						variant: "danger",
						disabled: H.value || xe.value || Q.value,
						onClick: Ae
					}, {
						icon: R(() => [C(F(g), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [r[16] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(F(n), {
						disabled: Q.value,
						onClick: De
					}, {
						default: R(() => [...r[17] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Z.value ? y("", !0) : (k(), v(F(n), {
						key: 1,
						variant: "primary",
						loading: q.value,
						disabled: H.value || xe.value || J.value || Ce.value,
						onClick: ke
					}, {
						default: R(() => [S("保存" + P(gn))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": H.value
				}, [
					H.value ? (k(), b("div", pn, [C(F(g), {
						name: "loader-circle",
						class: "announcement-spin",
						size: 24
					}), x("span", null, "正在读取" + P(gn) + "...")])) : y("", !0),
					Se.value ? (k(), v(F(p), {
						key: 1,
						type: "error",
						closable: !1,
						description: Se.value
					}, null, 8, ["description"])) : y("", !0),
					!H.value && !xe.value ? (k(), v(F(f), {
						key: 2,
						model: B,
						"label-position": "top",
						onSubmit: me(ke, ["prevent"])
					}, {
						default: R(() => [
							B.id ? (k(), v(F(m), {
								key: 0,
								label: "分类ID"
							}, {
								default: R(() => [C(F(ae), {
									"model-value": B.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : y("", !0),
							C(F(m), {
								label: `${gn}名称`,
								required: ""
							}, {
								default: R(() => [C(F(ae), {
									modelValue: B.name,
									"onUpdate:modelValue": r[1] ||= (e) => B.name = e,
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
								default: R(() => [x("div", mn, [C(F(ie), {
									modelValue: B.parent_id,
									"onUpdate:modelValue": r[2] ||= (e) => B.parent_id = e,
									options: Me.value,
									disabled: Z.value || Q.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), r[15] ||= x("p", { class: "announcement-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类公告。 ", -1)])]),
								_: 1
							}),
							C(F(m), { label: "分类图片" }, {
								default: R(() => [C(e, {
									class: "taxonomy-editor__image",
									modelValue: B.image_url,
									"onUpdate:modelValue": r[3] ||= (e) => B.image_url = e,
									label: "分类图片",
									upload: F(oe),
									disabled: Z.value || Q.value,
									"onUpdate:mediaId": r[4] ||= (e) => B.image_media_id = e,
									onBusyChange: r[5] ||= (e) => Ce.value = e,
									onStart: r[6] ||= (e) => Se.value = "",
									onError: r[7] ||= (e) => Se.value = F(a)(e)
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
								default: R(() => [C(F(s), {
									modelValue: B.sort_order,
									"onUpdate:modelValue": r[8] ||= (e) => B.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Z.value || Q.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(F(m), { label: "启用状态" }, {
								default: R(() => [C(ye, {
									modelValue: B.is_enabled,
									"onUpdate:modelValue": r[9] ||= (e) => B.is_enabled = e,
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
			C(F(d), {
				modelValue: be.value,
				"onUpdate:modelValue": r[12] ||= (e) => be.value = e,
				title: "删除公告分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !J.value
			}, {
				footer: R(() => [C(F(n), {
					disabled: J.value,
					onClick: r[11] ||= (e) => be.value = !1
				}, {
					default: R(() => [...r[18] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(n), {
					variant: "danger",
					loading: J.value,
					onClick: je
				}, {
					default: R(() => [...r[19] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [x("p", null, "确认删除分类“" + P(B.name) + "”？有关联公告或子分类的分类无法删除。", 1), Y.value ? (k(), v(F(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: Y.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(F(d), {
				modelValue: X.value,
				"onUpdate:modelValue": r[14] ||= (e) => X.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [C(F(n), { onClick: r[13] ||= (e) => X.value = !1 }, {
					default: R(() => [...r[20] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(F(n), {
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
}, Nn = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: r }) {
		let { hasPermission: a } = he(), { announcementError: o, announcementCategoryLabel: ee, deleteAnnouncement: c, getAnnouncementDetail: l, getAnnouncementMetadata: te, saveAnnouncement: ne, uploadAnnouncementCover: re } = un(), h = t, w = r, T = M(!0), E = M(!1), D = M(!1), O = M(""), A = M(!1), le = M(!1), N = M(!1), I = M(!1), L = M(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), de = M(), pe = M("draft"), z = M(!1), B = _(() => a(["cms_announcement:publish"])), V = _(() => !a([`cms_announcement:${h.articleId ? "edit" : "add"}`]) || !B.value && pe.value !== "draft"), H = _(() => a(["cms_announcement:delete"]) && (B.value || pe.value === "draft"));
		async function _e() {
			if (!(!H.value || E.value || T.value || D.value)) {
				E.value = !0, O.value = "";
				try {
					await c("articles", W.id, W.row_version), Q = JSON.stringify(W), u.success("公告已删除"), w("saved");
				} catch (e) {
					O.value = o(e), I.value = !1;
				} finally {
					E.value = !1;
				}
			}
		}
		let U = _(() => V.value || E.value), W = j({
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
		}), { editorRoot: G, seoInput: K, fieldRules: ve, fieldErrors: q, pendingCount: J, saveError: ye, validateSave: be, setSaveFailure: Y, focusFirstError: xe, focusSeoError: Se } = Ee(W, () => de.value?.categories || [], "announcement", A), X = _(() => (de.value?.categories || []).filter((e) => e.parent_id != null).map((e) => ({
			label: ee(de.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), Z = _(() => de.value?.categories.find((e) => e.id === W.category_id && e.parent_id == null)), Ce = _({
			get: () => Z.value ? "" : W.category_id,
			set: (e) => {
				W.category_id = e;
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
				if (de.value = await te(e.signal, { cms_source_type: "platform" }), h.articleId) {
					let t = await l("articles", h.articleId, e.signal);
					if (de.value = await te(e.signal, { space_id: String(t.space_id) }), L.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"sort_order",
						"is_enabled"
					]) Object.assign(W, { [e]: t[e] });
					W.category_id = t.category_id || "", W.helpful_enabled = t.helpful_enabled ?? !0;
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url",
						"content_source",
						"author_name"
					]) W[e] = t[e] || "";
					W.scheduled_local = t.publish_status === "scheduled" ? we(t.scheduled_at) : "", pe.value = t.publish_status;
				}
				Q = JSON.stringify(W);
			} catch (t) {
				e.signal.aborted || (O.value = o(t), D.value = !0);
			} finally {
				e.signal.aborted || (T.value = !1);
			}
		}
		let De = () => !T.value && !D.value && Q !== JSON.stringify(W);
		function Oe() {
			De() ? le.value = !0 : w("close");
		}
		function ke() {
			pe.value === "draft" ? je("draft") : N.value = !0;
		}
		function Ae() {
			N.value = !1, je("draft");
		}
		async function je(e) {
			if (U.value || T.value || D.value || z.value || (O.value = "", !await be(e))) return;
			let t = W.scheduled_local ? new Date(W.scheduled_local) : null;
			E.value = !0, O.value = "";
			try {
				await ne("articles", {
					...W,
					id: W.id || void 0,
					row_version: W.id ? W.row_version : void 0,
					category_id: W.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), Q = JSON.stringify(W), u.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "公告已发布"), w("saved");
			} catch (e) {
				Y(e);
			} finally {
				E.value = !1;
			}
			J.value && await xe();
		}
		function Me(e) {
			O.value = o(e);
		}
		let Ne = (e) => {
			De() && (e.preventDefault(), e.returnValue = "");
		};
		return ge(() => !E.value && !z.value && (!De() || window.confirm("公告有未保存的修改，确定离开？"))), ce(() => {
			Te(), window.addEventListener("beforeunload", Ne);
		}), se(() => {
			$?.abort(), window.removeEventListener("beforeunload", Ne);
		}), (r, a) => (k(), b("section", {
			ref_key: "editorRoot",
			ref: G,
			class: "article-editor",
			"aria-busy": T.value || E.value
		}, [
			x("header", yn, [
				C(F(n), {
					"icon-only": "",
					title: "返回公告列表",
					"aria-label": "返回公告列表",
					disabled: E.value || z.value,
					onClick: Oe
				}, {
					default: R(() => [C(F(g), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", bn, [x("h2", null, P(t.articleId ? "编辑公告" : "新增公告"), 1), x("span", null, P(de.value?.source_locale || "zh-CN") + " · " + P(L.value), 1)]),
				x("div", xn, [
					t.articleId && H.value ? (k(), v(F(n), {
						key: 0,
						size: "sm",
						disabled: T.value || D.value || E.value || z.value,
						onClick: a[0] ||= (e) => I.value = !0
					}, {
						default: R(() => [...a[29] ||= [S("删除公告", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(F(n), {
						size: "sm",
						disabled: T.value || D.value,
						onClick: a[1] ||= (e) => A.value = !0
					}, {
						icon: R(() => [C(F(g), {
							name: "search",
							size: 14
						})]),
						default: R(() => [a[30] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					V.value ? y("", !0) : (k(), v(F(n), {
						key: 1,
						size: "sm",
						disabled: T.value || D.value || E.value || z.value,
						onClick: ke
					}, {
						icon: R(() => [C(F(g), {
							name: "save",
							size: 14
						})]),
						default: R(() => [a[31] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					F(ye) ? (k(), b("span", Sn, P(F(ye)), 1)) : y("", !0),
					!V.value && F(J) ? (k(), b("span", Cn, "还有 " + P(F(J)) + " 项待完善", 1)) : y("", !0),
					!V.value && B.value ? (k(), v(F(n), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: T.value || D.value || z.value,
						loading: E.value,
						onClick: a[2] ||= (e) => je(W.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [C(F(g), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [S(P(W.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)
				])
			]),
			T.value ? (k(), b("div", wn, [C(F(g), {
				name: "loader-circle",
				class: "announcement-spin",
				size: 28
			}), a[32] ||= x("span", null, "正在读取公告资料...", -1)])) : D.value ? (k(), b("div", Tn, [C(F(p), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"]), C(F(n), { onClick: Te }, {
				default: R(() => [...a[33] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (k(), b(oe, { key: 2 }, [O.value ? (k(), b("div", En, [C(F(p), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"])])) : y("", !0), x("div", Dn, [x("aside", On, [C(F(f), {
				model: W,
				rules: F(ve),
				"label-position": "top",
				onSubmit: a[13] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					C(F(m), {
						label: "公告分类",
						prop: "category_id",
						error: F(q).category_id,
						required: ""
					}, {
						default: R(() => [C(F(ie), {
							modelValue: Ce.value,
							"onUpdate:modelValue": a[3] ||= (e) => Ce.value = e,
							options: X.value,
							placeholder: Z.value ? "原分类：" + Z.value.name + "（一级）" : "请选择二级分类",
							clearable: "",
							disabled: U.value,
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
					C(F(m), {
						label: "公告封面",
						prop: "cover_url",
						error: F(q).cover_url
					}, {
						default: R(() => [C(e, {
							modelValue: W.cover_url,
							"onUpdate:modelValue": a[4] ||= (e) => W.cover_url = e,
							label: "公告封面",
							disabled: U.value,
							upload: F(re),
							onBusyChange: a[5] ||= (e) => z.value = e,
							onStart: a[6] ||= (e) => O.value = "",
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
						error: F(q).content_source
					}, {
						default: R(() => [C(F(ae), {
							modelValue: W.content_source,
							"onUpdate:modelValue": a[7] ||= (e) => W.content_source = e,
							maxlength: 160,
							disabled: U.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "作者署名",
						prop: "author_name",
						error: F(q).author_name
					}, {
						default: R(() => [C(F(ae), {
							modelValue: W.author_name,
							"onUpdate:modelValue": a[8] ||= (e) => W.author_name = e,
							maxlength: 120,
							disabled: U.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "前端排序",
						prop: "sort_order",
						error: F(q).sort_order
					}, {
						default: R(() => [C(F(s), {
							modelValue: W.sort_order,
							"onUpdate:modelValue": a[9] ||= (e) => W.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: U.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[35] ||= x("h3", null, "发布设置", -1),
					C(F(m), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: F(q).helpful_enabled
					}, {
						default: R(() => [C(Tt, {
							modelValue: W.helpful_enabled,
							"onUpdate:modelValue": a[10] ||= (e) => W.helpful_enabled = e,
							disabled: U.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "启用状态",
						prop: "is_enabled",
						error: F(q).is_enabled
					}, {
						default: R(() => [C(Tt, {
							modelValue: W.is_enabled,
							"onUpdate:modelValue": a[11] ||= (e) => W.is_enabled = e,
							disabled: U.value,
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
						default: R(() => [C(F(ae), {
							modelValue: W.scheduled_local,
							"onUpdate:modelValue": a[12] ||= (e) => W.scheduled_local = e,
							type: "datetime-local",
							disabled: U.value || !B.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[36] ||= x("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", kn, [C(F(f), {
				model: W,
				rules: F(ve),
				"label-position": "top",
				onSubmit: a[17] ||= me(() => {}, ["prevent"])
			}, {
				default: R(() => [
					C(F(m), {
						label: "标题",
						prop: "title",
						error: F(q).title,
						required: ""
					}, {
						default: R(() => [C(F(ae), {
							modelValue: W.title,
							"onUpdate:modelValue": a[14] ||= (e) => W.title = e,
							maxlength: 255,
							disabled: U.value,
							placeholder: "输入公告标题",
							"aria-label": "公告标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "摘要",
						prop: "summary",
						error: F(q).summary
					}, {
						default: R(() => [fe(x("textarea", {
							"onUpdate:modelValue": a[15] ||= (e) => W.summary = e,
							"aria-invalid": !!F(q).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: U.value,
							"aria-label": "公告摘要"
						}, null, 8, An), [[ue, W.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(F(m), {
						label: "正文",
						prop: "body_html",
						error: F(q).body_html
					}, {
						default: R(() => [C(F(i), {
							modelValue: W.body_html,
							"onUpdate:modelValue": a[16] ||= (e) => W.body_html = e,
							readonly: V.value,
							disabled: E.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "公告正文"
						}, {
							"image-upload": R(({ url: t, setUrl: n, setBusy: r }) => [C(e, {
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
			C(F(d), {
				modelValue: A.value,
				"onUpdate:modelValue": a[21] ||= (e) => A.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: R(() => [C(F(n), {
					variant: "primary",
					onClick: a[20] ||= (e) => A.value = !1
				}, {
					default: R(() => [...a[37] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [C(F(f), {
					model: W,
					rules: F(ve),
					"label-position": "top",
					onSubmit: a[19] ||= me(() => {}, ["prevent"])
				}, {
					default: R(() => [C(F(m), {
						label: "SEO 描述",
						prop: "seo_description",
						error: F(q).seo_description
					}, {
						default: R(() => [fe(x("textarea", {
							ref_key: "seoInput",
							ref: K,
							"onUpdate:modelValue": a[18] ||= (e) => W.seo_description = e,
							"aria-invalid": !!F(q).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: U.value,
							"aria-label": "SEO 描述"
						}, null, 8, jn), [[ue, W.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(F(d), {
				modelValue: I.value,
				"onUpdate:modelValue": a[23] ||= (e) => I.value = e,
				title: "确认删除",
				subtitle: `操作对象：${W.title || "未命名公告"}`,
				width: "460px",
				"panel-class": "announcement-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !E.value
			}, {
				"header-actions": R(() => [x("span", Mn, [C(F(g), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [C(F(n), {
					disabled: E.value,
					onClick: a[22] ||= (e) => I.value = !1
				}, {
					default: R(() => [...a[38] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(n), {
					variant: "warning",
					loading: E.value,
					onClick: _e
				}, {
					default: R(() => [...a[39] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [C(F(p), {
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
			C(F(d), {
				modelValue: le.value,
				"onUpdate:modelValue": a[26] ||= (e) => le.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [C(F(n), { onClick: a[24] ||= (e) => le.value = !1 }, {
					default: R(() => [...a[40] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(F(n), {
					variant: "primary",
					onClick: a[25] ||= (e) => w("close")
				}, {
					default: R(() => [...a[41] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(F(d), {
				modelValue: N.value,
				"onUpdate:modelValue": a[28] ||= (e) => N.value = e,
				title: "将公告转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [C(F(n), { onClick: a[27] ||= (e) => N.value = !1 }, {
					default: R(() => [...a[42] ||= [S("取消", -1)]]),
					_: 1
				}), C(F(n), {
					variant: "primary",
					onClick: Ae
				}, {
					default: R(() => [...a[43] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, vn));
	}
}), [["__scopeId", "data-v-6f468168"]]), Pn = { class: "announcement-articles" }, Fn = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = he(), { formatDateTime: r } = he(), { announcementPublishStates: i, announcementCategoryLabel: a, getAnnouncementList: s, getAnnouncementMetadata: ee } = un(), c = M(!1), l = M(), u = (e) => t([`cms_announcement:${e}`]), d = M(), f = K(ee, (e) => {
			d.value = e;
		}), te = [
			...G(),
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
		})), ae = f.loadMetadata;
		function h(e) {
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
		}, null, 8, ["article-id"])) : y("", !0), fe(C(F(re), E(F(ie), {
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
			"cell-cms_source_type": R(({ row: e }) => [C(ve, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": R(() => [u("add") ? (k(), v(F(n), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => h()
			}, {
				icon: R(() => [C(F(g), {
					name: "plus",
					size: 14
				})]),
				default: R(() => [t[2] ||= S("新增公告", -1)]),
				_: 1
			})) : y("", !0)]),
			"cell-publish_status": R(({ row: e }) => [C(F(o), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: R(() => [S(P(F(i).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": R(({ row: e }) => [C(F(o), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: R(() => [S(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": R(({ row: e }) => [S(P(F(r)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": R(({ row: e }) => [C(F(n), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑公告" : "公告详情",
				"aria-label": u("edit") ? "编辑公告" : "公告详情",
				onClick: (t) => h(e.id)
			}, {
				default: R(() => [C(F(g), {
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
		}, 16), [[L, !c.value]])]));
	}
}), [["__scopeId", "data-v-3d615d55"]]);
//#endregion
//#region src/cms/api/content/translations.ts
function In() {
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
}, zr = { class: "mm-translation-settings__credential" }, Br = { key: 0 }, Vr = { key: 1 }, Hr = { key: 2 }, Ur = { class: "mm-translation-settings__grid" }, Wr = { class: "job-confirm" }, Gr = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { cancelTranslationJob: r, createTranslationJob: i, getTranslationDetail: l, getTranslationJob: f, getTranslationList: ne, getTranslationMetadata: re, getTranslationSettings: h, saveTranslations: w, saveTranslationSettings: T, testTranslationConnection: E } = In(), { hasPermission: A } = he(), j = M(), N = M(""), I = M("news:content"), L = M([]), me = M(), z = M(""), B = M("title"), V = M(""), H = M(""), _e = M(1), U = M(0), W = M({}), G = M(!1), K = M(!1), ve = M(!1), q = M(!1), J = M(""), ye = M(""), be = M(), Y = M(null), xe = M(!1), Se = M(""), X = M(!1), Z = M(), Ce = M(""), Q = M(!1), $ = M(!1), we = M(!1), Te = M("field"), Ee = M([]), De = M(""), Oe = M(!1), ke = M(!1);
		de(xe, (e) => {
			e || (Se.value = "");
		});
		let Ae, je, Me, Ne, Pe, Fe = new AbortController(), Ie, Le = "", Re = _(() => A(["cms_translation:edit"])), ze = _(() => A(["cms_translation:config"])), Be = _(() => A(["cms_translation:translate"])), Ve = _(() => q.value || Q.value || Oe.value), He = _(() => zn(me.value, W.value).length > 0), Ue = _(() => Ln(j.value?.done || 0, j.value?.total || 0)), We = _(() => ({
			space_id: N.value,
			module: I.value.split(":")[0],
			kind: I.value.endsWith(":category") ? "category" : "content"
		})), Ge = _(() => j.value?.spaces.map((e) => ({
			label: e.label + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		})) || []), Ke = _(() => j.value?.locales.filter((e) => e.code !== j.value?.source_locale) || []), qe = _(() => Ke.value.map((e) => ({
			label: `${e.flag} ${e.label}`,
			value: e.code
		}))), Je = _(() => Ke.value.map((e) => ({
			label: `${e.label} · ${e.code}`,
			value: e.code
		}))), Ye = _(() => qe.value.filter((e) => nt(String(e.value)))), Xe = _(() => j.value?.locales.find((e) => e.code === j.value?.source_locale)?.label || j.value?.source_locale || "简体中文"), Ze = _(() => me.value?.fields.find((e) => e.key === B.value)), Qe = _(() => {
			let e = j.value?.modules.find((e) => e.key === I.value);
			return e?.kind === "category" ? `${j.value?.modules.find((t) => t.module === e.module && t.kind === "content")?.label || ""}分类` : e?.label || "新闻";
		}), $e = _(() => {
			let e = [];
			for (let t of j.value?.modules || []) {
				let n = e.find((e) => e[0].module === t.module);
				n ? n.push(t) : e.push([t]);
			}
			return e;
		}), et = _(() => !!N.value && j.value?.space_enabled && !!j.value.target_locales.length && !Hn(Y.value) && !Ve.value && !He.value && !G.value && !K.value), tt = _(() => Y.value ? Ln([
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
			Ae = void 0, ke.value = !1, W.value = me.value ? Bn(me.value) : {}, e?.();
		}
		function st() {
			ke.value = !1, Ae = void 0, Pe?.(!1), Pe = void 0;
		}
		function ct(e) {
			e !== N.value && at(() => {
				N.value = e, V.value = "", H.value = "", _e.value = 1, Y.value = null, pt();
			});
		}
		function lt(e) {
			e.available && I.value !== e.key && at(() => {
				I.value = e.key, V.value = "", H.value = "", _e.value = 1, ht();
			});
		}
		function ut(e) {
			at(() => {
				_e.value = e, ht();
			});
		}
		function dt() {
			at(() => {
				H.value = V.value.trim(), _e.value = 1, ht();
			});
		}
		function ft(e) {
			e !== z.value && at(() => {
				gt(e);
			});
		}
		async function pt() {
			Ne?.abort();
			let e = Ne = new AbortController();
			G.value = !0, J.value = "";
			try {
				let t = await re(N.value || void 0, e.signal);
				if (e.signal.aborted) return;
				j.value = t, N.value = t.space_id || "", await ht(), Tt();
			} catch (t) {
				e.signal.aborted || (J.value = Gn(t));
			} finally {
				e.signal.aborted || (G.value = !1);
			}
		}
		async function mt() {
			let e = N.value;
			if (e) try {
				let t = await re(e, Fe.signal);
				e === N.value && (j.value = t);
			} catch {}
		}
		async function ht() {
			je?.abort(), Me?.abort();
			let e = je = new AbortController();
			if (K.value = !0, ve.value = !1, me.value = void 0, z.value = "", W.value = {}, J.value = "", !N.value) {
				L.value = [], U.value = 0, K.value = !1;
				return;
			}
			let t = { ...We.value };
			try {
				let n = await ne(t, H.value, _e.value, e.signal);
				if (e.signal.aborted) return;
				L.value = n.lists, U.value = n.count, L.value[0] && await gt(L.value[0].id);
			} catch (t) {
				e.signal.aborted || (L.value = [], U.value = 0, J.value = Gn(t));
			} finally {
				e.signal.aborted || (K.value = !1);
			}
		}
		async function gt(e) {
			Me?.abort();
			let t = Me = new AbortController();
			ve.value = !0, z.value = e, me.value = void 0, W.value = {}, J.value = "";
			try {
				let n = await l({ ...We.value }, e, t.signal);
				if (t.signal.aborted) return;
				me.value = n, W.value = Bn(n), n.fields.some((e) => e.key === B.value) || (B.value = n.fields[0]?.key || ""), be.value?.scrollTo({ top: 0 });
			} catch (e) {
				t.signal.aborted || (J.value = Gn(e));
			} finally {
				t.signal.aborted || (ve.value = !1);
			}
		}
		async function _t() {
			if (!me.value || !Re.value || Ve.value) return;
			let e = zn(me.value, W.value);
			if (e.length) {
				if (e.some((e) => !e.text.trim())) {
					J.value = "译文不能为空；未翻译的语言请保持未填写。";
					return;
				}
				q.value = !0, J.value = "";
				try {
					let t = await w({ ...We.value }, me.value.id, e);
					me.value = t, W.value = Bn(t);
					let n = L.value.findIndex((e) => e.id === t.id);
					n >= 0 && (L.value[n] = t), u.success("翻译已保存"), mt();
				} catch (e) {
					J.value = Gn(e);
				} finally {
					q.value = !1;
				}
			}
		}
		async function vt(e) {
			ye.value = e, await D();
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
					Z.value = await h(N.value, Fe.signal);
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
					let e = await i({ ...We.value }, {
						request_key: Le,
						target_locales: Ee.value,
						...Te.value === "field" ? {
							id: z.value,
							field_name: B.value
						} : { keyword: H.value }
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
				let n = await f(e, Fe.signal);
				if (e !== N.value) return;
				Y.value = n.job, t && !Hn(Y.value) && (await mt(), !He.value && !Ve.value && z.value && await gt(z.value));
			} catch {}
			wt();
		}
		async function Et() {
			if (Y.value) try {
				let e = await r(N.value, Y.value.id);
				Y.value = e.job, clearTimeout(Ie), mt();
			} catch (e) {
				J.value = Gn(e);
			}
		}
		function Dt(e) {
			(He.value || Ve.value) && (e.preventDefault(), e.returnValue = "");
		}
		return ge(() => !He.value && !Ve.value || !Ve.value && new Promise((e) => {
			Pe?.(!1), Pe = e, Ae = () => {
				Pe = void 0, e(!0);
			}, ke.value = !0;
		})), ce(() => {
			window.addEventListener("beforeunload", Dt), pt();
		}), se(() => {
			Se.value = "", Pe?.(!1), Fe.abort(), je?.abort(), Me?.abort(), Ne?.abort(), clearTimeout(Ie), window.removeEventListener("beforeunload", Dt);
		}), (e, r) => (k(), b("section", {
			class: "translations-page",
			"aria-label": "多语言翻译管理",
			"aria-busy": G.value
		}, [
			x("header", qn, [x("div", Jn, [x("span", Yn, [C(F(g), {
				name: "globe",
				size: 21
			})]), x("div", null, [r[21] ||= x("h1", null, "语言翻译管理", -1), x("div", Xn, [
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
					disabled: G.value || Ve.value,
					placeholder: "内容空间",
					"aria-label": "内容空间",
					"onUpdate:modelValue": r[0] ||= (e) => ct(String(e))
				}, null, 8, [
					"model-value",
					"options",
					"disabled"
				]),
				x("span", Qn, [r[22] ||= S("内容源语言 ", -1), x("b", null, P(Xe.value), 1)]),
				ze.value ? (k(), v(F(n), {
					key: 0,
					size: "sm",
					disabled: !N.value || Ve.value,
					onClick: yt
				}, {
					icon: R(() => [C(F(g), {
						name: "sliders-horizontal",
						size: 14
					})]),
					default: R(() => [r[23] ||= S("翻译配置", -1)]),
					_: 1
				}, 8, ["disabled"])) : y("", !0),
				Be.value ? (k(), v(F(n), {
					key: 1,
					size: "sm",
					disabled: !et.value,
					onClick: r[1] ||= (e) => St("batch")
				}, {
					icon: R(() => [C(F(g), {
						name: "rocket",
						size: 14
					})]),
					default: R(() => [r[24] ||= S("批量翻译", -1)]),
					_: 1
				}, 8, ["disabled"])) : y("", !0),
				Be.value ? (k(), v(F(n), {
					key: 2,
					size: "sm",
					disabled: !et.value || !me.value || !Ze.value?.translatable,
					onClick: r[2] ||= (e) => St("field")
				}, {
					icon: R(() => [C(F(g), {
						name: "globe",
						size: 14
					})]),
					default: R(() => [r[25] ||= S("翻译当前字段", -1)]),
					_: 1
				}, 8, ["disabled"])) : y("", !0),
				Re.value ? (k(), v(F(n), {
					key: 3,
					size: "sm",
					variant: "primary",
					loading: q.value,
					disabled: !He.value || Ve.value || !j.value?.space_enabled,
					onClick: _t
				}, {
					icon: R(() => [C(F(g), {
						name: "save",
						size: 14
					})]),
					default: R(() => [r[26] ||= S("保存翻译", -1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : y("", !0)
			])]),
			J.value ? (k(), v(F(p), {
				key: 0,
				type: "error",
				closable: !0,
				onClose: r[3] ||= (e) => J.value = ""
			}, {
				default: R(() => [S(P(J.value), 1)]),
				_: 1
			})) : y("", !0),
			j.value && !j.value.space_enabled && N.value ? (k(), v(F(p), {
				key: 1,
				type: "warning"
			}, {
				default: R(() => [...r[27] ||= [S("当前内容空间已停用，仅可查看翻译。", -1)]]),
				_: 1
			})) : y("", !0),
			j.value && !j.value.target_locales.length && N.value ? (k(), v(F(p), {
				key: 2,
				type: "info"
			}, {
				default: R(() => [...r[28] ||= [S("尚未启用目标语言，请在“翻译配置”中选择语言后开始翻译。", -1)]]),
				_: 1
			})) : y("", !0),
			Y.value ? (k(), b("div", $n, [
				C(F(g), {
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
				F(Hn)(Y.value) && Be.value ? (k(), v(F(n), {
					key: 0,
					size: "sm",
					variant: "text",
					disabled: Ve.value,
					onClick: Et
				}, {
					default: R(() => [...r[29] ||= [S("取消任务", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (k(), v(F(n), {
					key: 1,
					size: "sm",
					variant: "text",
					onClick: r[4] ||= (e) => Y.value = null
				}, {
					default: R(() => [...r[30] ||= [S("收起", -1)]]),
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
					"is-active": ye.value === e.code,
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
			}, [(k(!0), b(oe, null, le(e, (e) => (k(), v(F(n), {
				key: e.key,
				variant: I.value === e.key ? "primary" : "text",
				plain: I.value === e.key,
				size: "sm",
				disabled: !e.available || Ve.value,
				title: e.reason,
				"aria-pressed": I.value === e.key,
				onClick: (t) => lt(e)
			}, {
				default: R(() => [
					e.kind === "category" ? y("", !0) : (k(), v(F(g), {
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
				x("div", lr, [x("div", null, [x("strong", null, P(Qe.value), 1), x("span", null, P(U.value) + " 条" + P(We.value.kind === "category" ? "分类" : "内容"), 1)]), C(F(ae), {
					modelValue: V.value,
					"onUpdate:modelValue": r[5] ||= (e) => V.value = e,
					size: "sm",
					clearable: "",
					placeholder: "搜索内容",
					"aria-label": "搜索内容",
					onKeydown: pe(dt, ["enter"])
				}, {
					prefix: R(() => [C(F(g), {
						name: "search",
						size: 14
					})]),
					_: 1
				}, 8, ["modelValue"])]),
				x("div", {
					class: "content-browser__list",
					"aria-busy": K.value
				}, [K.value ? (k(), b("p", dr, "加载内容中…")) : (k(), b(oe, { key: 1 }, [(k(!0), b(oe, null, le(L.value, (e) => (k(), b("button", {
					key: e.id,
					type: "button",
					class: O(["content-item", { "is-selected": z.value === e.id }]),
					"aria-current": z.value === e.id ? "true" : void 0,
					disabled: Ve.value,
					onClick: (t) => ft(e.id)
				}, [x("span", pr, [x("strong", { title: e.title }, P(e.title), 9, mr), x("small", null, P(F(Wn)[e.publish_status || ""] || "分类") + " · " + P(e.done) + "/" + P(e.total), 1)]), C(F(t), {
					type: "circle",
					percentage: F(Ln)(e.done, e.total),
					"show-text": !1,
					size: 16,
					"stroke-width": 2,
					status: e.total && e.done === e.total ? "success" : "warning"
				}, null, 8, ["percentage", "status"])], 10, fr))), 128)), L.value.length ? y("", !0) : (k(), b("p", hr, P(H.value ? "没有匹配的内容" : "暂无可翻译内容"), 1))], 64))], 8, ur),
				x("footer", gr, [
					C(F(n), {
						size: "sm",
						"icon-only": "",
						"aria-label": "上一页",
						disabled: _e.value <= 1 || K.value || Ve.value,
						onClick: r[6] ||= (e) => ut(_e.value - 1)
					}, {
						default: R(() => [C(F(g), {
							name: "chevron-left",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"]),
					x("span", null, P(_e.value) + " / " + P(Math.max(1, Math.ceil(U.value / 30))), 1),
					C(F(n), {
						size: "sm",
						"icon-only": "",
						"aria-label": "下一页",
						disabled: _e.value * 30 >= U.value || K.value || Ve.value,
						onClick: r[7] ||= (e) => ut(_e.value + 1)
					}, {
						default: R(() => [C(F(g), {
							name: "chevron-right",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"])
				])
			]), x("section", {
				class: "translation-editor",
				"aria-busy": ve.value
			}, [ve.value ? (k(), b("div", vr, [C(F(g), {
				name: "loader-circle",
				size: 28
			}), r[31] ||= x("p", null, "加载译文中…", -1)])) : me.value ? (k(), b(oe, { key: 1 }, [x("header", yr, [x("div", br, [x("span", null, [S(P(Qe.value) + " ", 1), He.value ? (k(), b("em", xr, "有未保存修改")) : y("", !0)]), x("h2", { title: me.value.title }, P(me.value.title), 9, Sr)]), C(F(te), {
				modelValue: B.value,
				"onUpdate:modelValue": r[8] ||= (e) => B.value = e
			}, {
				default: R(() => [(k(!0), b(oe, null, le(me.value.fields, (e) => (k(), v(F(ee), {
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
				x("section", Cr, [x("div", wr, [x("strong", null, [S(P(Xe.value) + " ", 1), C(F(o), {
					size: "sm",
					type: "primary",
					effect: "soft"
				}, {
					default: R(() => [...r[32] ||= [S("内容源语言", -1)]]),
					_: 1
				})]), r[33] ||= x("span", null, "只读原文", -1)]), x("textarea", {
					value: Ze.value.source,
					readonly: "",
					rows: Ze.value.key === "body_html" ? 5 : 2,
					class: "translation-textarea source-textarea",
					"aria-label": `原文${Ze.value.label}`
				}, null, 8, Tr)]),
				x("div", Er, [r[34] ||= x("strong", null, "目标语言", -1), x("span", null, P(me.value.fields.find((e) => e.key === B.value)?.translations.length || 0) + " 种语言 · 手工修改后请保存", 1)]),
				Ze.value.translatable ? Ze.value.translations.length ? (k(), b("div", {
					key: 2,
					class: O(["target-grid", { "is-body": B.value === "body_html" }])
				}, [(k(!0), b(oe, null, le(Ze.value.translations, (e) => (k(), b("div", {
					key: e.locale,
					class: O(["target-field", { "is-focused": ye.value === e.locale }]),
					"data-locale": e.locale
				}, [
					x("div", Ar, [x("label", { for: `translation-${B.value}-${e.locale}` }, [S(P(rt(e.locale)?.native || e.locale) + " ", 1), x("small", null, P(e.locale), 1)], 8, jr), e.status === "stale" ? (k(), b("span", Mr, "原文已更新")) : e.status === "ready" ? (k(), b("span", Nr, P(e.method === "machine" ? "机器翻译" : "已保存"), 1)) : y("", !0)]),
					fe(x("textarea", {
						id: `translation-${B.value}-${e.locale}`,
						"onUpdate:modelValue": (t) => W.value[F(Rn)(B.value, e.locale)] = t,
						class: "translation-textarea",
						rows: B.value === "body_html" ? 10 : 2,
						maxlength: Ze.value.max_length,
						disabled: !Re.value || !j.value?.space_enabled || Ve.value,
						dir: e.locale === "ar" ? "rtl" : "auto",
						placeholder: `请输入${rt(e.locale)?.native || e.locale}翻译${B.value === "body_html" ? "（HTML）" : ""}`
					}, null, 8, Pr), [[ue, W.value[F(Rn)(B.value, e.locale)]]]),
					x("div", Fr, P((W.value[F(Rn)(B.value, e.locale)] || "").length.toLocaleString()) + " / " + P(Ze.value.max_length.toLocaleString()), 1)
				], 10, kr))), 128))], 2)) : (k(), b("div", Or, " 请先在“翻译配置”中启用目标语言。 ")) : (k(), b("div", Dr, [C(F(g), {
					name: "info",
					size: 18
				}), r[35] ||= S("原文字段为空，不参与翻译和完成度统计。 ", -1)]))
			], 512)) : y("", !0)], 64)) : (k(), b("div", Ir, [C(F(c), { description: J.value ? "内容加载失败，可点击刷新重试" : "选择左侧内容开始翻译" }, null, 8, ["description"]), J.value ? (k(), v(F(n), {
				key: 0,
				size: "sm",
				onClick: pt
			}, {
				default: R(() => [...r[36] ||= [S("重新加载", -1)]]),
				_: 1
			})) : y("", !0)]))], 8, _r)]),
			C(F(d), {
				modelValue: xe.value,
				"onUpdate:modelValue": r[16] ||= (e) => xe.value = e,
				title: "翻译配置",
				subtitle: "当前内容空间共用 · Google Cloud Translation Basic v2",
				width: "560px",
				"close-on-click-modal": !1,
				"before-close": () => !Q.value && !$.value
			}, {
				footer: R(() => [
					C(F(n), {
						loading: $.value,
						disabled: !Z.value?.credential_configured && !Se.value.trim() || Q.value || X.value,
						onClick: xt
					}, {
						default: R(() => [...r[43] ||= [S("测试连接", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"]),
					C(F(n), {
						disabled: Q.value || $.value,
						onClick: r[15] ||= (e) => xe.value = !1
					}, {
						default: R(() => [...r[44] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					C(F(n), {
						variant: "primary",
						loading: Q.value,
						disabled: !Z.value || X.value || $.value,
						onClick: bt
					}, {
						default: R(() => [...r[45] ||= [S("保存翻译配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])
				]),
				default: R(() => [Ce.value ? (k(), v(F(p), {
					key: 0,
					type: "error"
				}, {
					default: R(() => [S(P(Ce.value), 1)]),
					_: 1
				})) : y("", !0), X.value ? (k(), b("div", Lr, "加载配置中…")) : Z.value ? (k(), b("div", Rr, [
					x("label", null, [r[37] ||= S(" 目标语言 ", -1), C(F(ie), {
						modelValue: Z.value.target_locales,
						"onUpdate:modelValue": r[9] ||= (e) => Z.value.target_locales = e,
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
					C(a, {
						modelValue: Z.value.is_enabled,
						"onUpdate:modelValue": r[10] ||= (e) => Z.value.is_enabled = e,
						disabled: Q.value || $.value,
						"credential-ready": !!Z.value.credential_configured || !!Se.value.trim()
					}, null, 8, [
						"modelValue",
						"disabled",
						"credential-ready"
					]),
					x("div", zr, [
						x("label", null, [r[38] ||= S(" Google API Key ", -1), C(F(ae), {
							modelValue: Se.value,
							"onUpdate:modelValue": r[11] ||= (e) => Se.value = e,
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
						x("label", null, [r[39] ||= S(" 并发上限 ", -1), C(F(s), {
							modelValue: Z.value.concurrency_limit,
							"onUpdate:modelValue": r[12] ||= (e) => Z.value.concurrency_limit = e,
							min: 1,
							max: 20,
							disabled: Q.value || $.value
						}, null, 8, ["modelValue", "disabled"])]),
						x("label", null, [r[40] ||= S(" 请求超时（秒） ", -1), C(F(s), {
							modelValue: Z.value.request_timeout_seconds,
							"onUpdate:modelValue": r[13] ||= (e) => Z.value.request_timeout_seconds = e,
							min: 1,
							max: 120,
							disabled: Q.value || $.value
						}, null, 8, ["modelValue", "disabled"])]),
						x("label", null, [r[41] ||= S(" 最大尝试次数 ", -1), C(F(s), {
							modelValue: Z.value.max_attempts,
							"onUpdate:modelValue": r[14] ||= (e) => Z.value.max_attempts = e,
							min: 1,
							max: 10,
							disabled: Q.value || $.value
						}, null, 8, ["modelValue", "disabled"])])
					]),
					Z.value.supported ? y("", !0) : (k(), v(F(p), {
						key: 0,
						type: "warning"
					}, {
						default: R(() => [...r[42] ||= [S("当前空间关联了其他版本的翻译配置。保存将为该空间创建独立的 Google v2 配置，不修改其他空间。", -1)]]),
						_: 1
					}))
				])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(F(d), {
				modelValue: we.value,
				"onUpdate:modelValue": r[19] ||= (e) => we.value = e,
				title: Te.value === "field" ? "翻译当前字段" : "批量翻译",
				subtitle: "Google Translate · 仅补齐缺失及原文已更新的译文",
				width: "520px",
				"close-on-click-modal": !1,
				"before-close": () => !Oe.value
			}, {
				footer: R(() => [C(F(n), {
					size: "sm",
					disabled: Oe.value,
					onClick: r[18] ||= (e) => we.value = !1
				}, {
					default: R(() => [...r[47] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(F(n), {
					variant: "primary",
					size: "sm",
					loading: Oe.value,
					disabled: !Ee.value.length,
					onClick: Ct
				}, {
					default: R(() => [...r[48] ||= [S("确认翻译", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])]),
				default: R(() => [x("div", Wr, [
					x("p", null, P(Te.value === "field" ? `当前内容的「${Ze.value?.label}」` : `当前空间「${Qe.value}」${H.value ? "中匹配搜索条件的内容" : "全部内容"}`), 1),
					C(F(m), { label: "目标语言" }, {
						default: R(() => [C(F(ie), {
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
					C(F(p), { type: "warning" }, {
						default: R(() => [...r[46] ||= [S("内容将发送至 Google Translate，并可能产生翻译费用。已有有效译文不会覆盖；单次最多 200 条内容、5,000 个字段任务。后台任务需要已启动翻译 worker。", -1)]]),
						_: 1
					}),
					De.value ? (k(), v(F(p), {
						key: 0,
						type: "error"
					}, {
						default: R(() => [S(P(De.value), 1)]),
						_: 1
					})) : y("", !0)
				])]),
				_: 1
			}, 8, [
				"modelValue",
				"title",
				"before-close"
			]),
			C(F(d), {
				modelValue: ke.value,
				"onUpdate:modelValue": r[20] ||= (e) => ke.value = e,
				title: "有未保存的翻译",
				subtitle: "切换后将丢弃当前修改，是否继续？",
				width: "380px",
				onClose: st
			}, {
				footer: R(() => [C(F(n), {
					size: "sm",
					onClick: st
				}, {
					default: R(() => [...r[49] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(F(n), {
					size: "sm",
					variant: "warning",
					onClick: ot
				}, {
					default: R(() => [...r[50] ||= [S("放弃修改并继续", -1)]]),
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
}, Zr = { key: 3 }, Qr = ["disabled"], $r = /*#__PURE__*/ h(/* @__PURE__ */ w({
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
		}, r = t.runtime.mode === "white_label" && !!t.runtime.resolveSiteInRequest, i = M(!1), a = M(0), o = M([]), s = M(""), ee = M(""), c = M(t.runtime.mode === "white_label" && !r), l = M(!1), u = _(() => o.value.find((e) => e.site_id === s.value)), d = _(() => n[t.page]), f = _(() => t.runtime.hasPermission([
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
		de(s, () => {
			!r || ne || (ie.invalidate(), ie = B(t.runtime, re, u.value?.space_id ?? null), a.value++);
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
		A(z, {
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
		async function ae() {
			let e = await t.runtime.request.get({
				url: "/cms/sites",
				signal: te.signal
			});
			te.signal.aborted || (o.value = e.sites, o.value.some((e) => e.site_id === s.value) || (s.value = o.value[0]?.site_id ?? ""));
		}
		async function h() {
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
					ie.invalidate(), ie = B(t.runtime, re, n.cms_context.space_id), re(n.cms_context), a.value++;
				} else await ae();
			} catch (e) {
				ee.value = e instanceof Error ? e.message : "初始化失败";
			} finally {
				l.value = !1;
			}
		}
		return ce(async () => {
			if (t.runtime.mode === "white_label" && !r) try {
				await ae();
			} catch {
				te.signal.aborted || (ee.value = "加载站点失败，请刷新重试");
			} finally {
				c.value = !1;
			}
		}), se(() => {
			p = !1, ie.invalidate(), te.abort();
		}), (t, n) => (k(), b("section", { class: O(["mm-cms-page", { "is-viewport": e.viewport }]) }, [e.runtime.mode === "white_label" && e.showSiteSelector && (!F(r) || i.value) ? (k(), b("header", Kr, [x("label", null, [n[1] ||= S("内容站点 ", -1), fe(x("select", {
			"onUpdate:modelValue": n[0] ||= (e) => s.value = e,
			disabled: c.value
		}, [(k(!0), b(oe, null, le(o.value, (e) => (k(), b("option", {
			key: e.site_id,
			value: e.site_id
		}, P(e.label), 9, Jr))), 128))], 8, qr), [[I, s.value]])]), n[2] ||= x("span", null, "各站点内容独立管理", -1)])) : y("", !0), ee.value ? (k(), b("p", Yr, P(ee.value), 1)) : c.value ? (k(), b("p", Xr, "正在加载站点…")) : e.runtime.mode === "white_label" && (!F(r) || i.value) && !u.value?.space_id ? (k(), b("div", Zr, [x("p", null, P(u.value ? "该站点尚未初始化内容空间。" : "暂无可管理的内容站点。"), 1), u.value && f.value ? (k(), b("button", {
			key: 0,
			type: "button",
			disabled: l.value,
			onClick: h
		}, "初始化空内容空间", 8, Qr)) : y("", !0)])) : (k(), v(N(d.value), { key: `${e.page}:${e.identityKey}:${F(r) ? a.value : u.value?.space_id ?? "platform"}` }))], 2));
	}
}), [["__scopeId", "data-v-f447749a"]]);
//#endregion
//#region src/cms/permission-tree.ts
function ei(e, t, n = "", r = 0) {
	let i = e.children ?? [], a = e.type === "C" && !!(e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:")), o = t(e), s = n ? `${n} / ${o}` : o, ee = a || e.type === "M" && r > 0 ? s : n;
	return [...!i.length || a ? [{
		id: e.id,
		name: a || e.type === "A" && e.perms?.startsWith("cms_") ? s : o
	}] : [], ...i.flatMap((e) => ei(e, t, ee, r + 1))];
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