import { Cn as e, Er as t, Hi as n, M as r, Nr as i, P as a, Xn as o, _i as s, _r as c, a as l, bi as u, gi as d, hi as ee, ii as f, ni as p, p as te, ri as m, ti as ne, vi as re, wn as ie, xr as h } from "./src-D28mL1tZ.js";
import { d as g, f as _, n as v, u as y } from "./Loading-NM70IAOz.js";
import { Fragment as b, computed as x, createBlock as S, createCommentVNode as C, createElementBlock as w, createElementVNode as T, createTextVNode as E, createVNode as D, defineComponent as O, inject as k, mergeProps as A, nextTick as ae, normalizeClass as oe, onBeforeUnmount as se, onMounted as ce, openBlock as j, provide as M, reactive as le, ref as N, renderList as P, resolveDynamicComponent as F, shallowRef as I, toDisplayString as L, unref as R, vModelSelect as z, vModelText as ue, vShow as B, watch as V, withCtx as H, withDirectives as U, withKeys as de, withModifiers as fe } from "vue";
//#region src/cms/runtime.ts
var W = Symbol("MmCms");
function pe() {
	let e = k(W);
	if (!e) throw Error("CMS host adapter is missing");
	return e;
}
function me(e) {
	pe().registerBeforeLeave?.(e);
}
//#endregion
//#region src/cms/site-transport.ts
function G(e, t, n) {
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
	if (pe().mode === "white_label") return {
		fields: [],
		bindFilters: (e) => {}
	};
	let n = le([{
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
	}]), r = new AbortController(), i;
	return ce(async () => {
		try {
			let t = await e(r.signal);
			!r.signal.aborted && n[1].type === "select" && (n[1].options = [{
				label: "全部白标",
				value: ""
			}, ...t.cms_source_options || []]);
		} catch {
			n[1].type === "select" && (n[1].disabled = !0);
		}
	}), se(() => {
		r.abort(), i?.abort();
	}), {
		fields: n,
		bindFilters: (r) => {
			V(() => r.value.cms_source_type, (e) => {
				e === "platform" && (r.value.cms_tenant_id = ""), n[1].disabled = e === "platform";
			}, {
				immediate: !0,
				flush: "sync"
			}), t && V(() => [r.value.cms_source_type, r.value.cms_tenant_id], () => {
				for (let e of [
					"parent_id",
					"category_id",
					"scene_id",
					"issue_category_id"
				]) e in r.value && (r.value[e] = "");
				i?.abort();
				let n = i = new AbortController();
				e(n.signal, {
					cms_source_type: String(r.value.cms_source_type || ""),
					cms_tenant_id: String(r.value.cms_tenant_id || "")
				}).then((e) => {
					n.signal.aborted || t(e);
				}).catch(() => {});
			});
		}
	};
}
//#endregion
//#region src/cms/components/source-type-tag/index.vue
var J = /* @__PURE__ */ O({
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
		}, i = x(() => t.sourceType ? n[t.sourceType] : "-"), a = x(() => t.sourceType ? r[t.sourceType] : "default");
		return (e, t) => (j(), S(R(ee), {
			effect: "soft",
			round: "",
			size: "sm",
			type: a.value
		}, {
			default: H(() => [E(L(i.value), 1)]),
			_: 1
		}, 8, ["type"]));
	}
});
//#endregion
//#region src/cms/api/content/news.ts
function he() {
	let e = pe().request, t = "/cms/news", n = (n, r = {}) => e.get({
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
var Y = ["aria-checked", "disabled"], ge = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "EnabledToggle",
	props: {
		modelValue: { type: Boolean },
		disabled: { type: Boolean }
	},
	emits: ["update:modelValue"],
	setup(e) {
		return (t, n) => (j(), w("button", {
			type: "button",
			role: "switch",
			class: oe(["news-toggle", { "is-on": e.modelValue }]),
			"aria-checked": e.modelValue,
			"aria-label": "启用状态",
			disabled: e.disabled,
			onClick: n[0] ||= (n) => t.$emit("update:modelValue", !e.modelValue)
		}, [n[1] ||= T("span", {
			class: "news-toggle__track",
			"aria-hidden": "true"
		}, [T("span")], -1), T("span", null, L(e.modelValue ? "已启用" : "已停用"), 1)], 10, Y));
	}
}), [["__scopeId", "data-v-8b527db1"]]), X = { class: "news-categories" }, _e = ["aria-busy"], ve = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Z = { class: "taxonomy-editor__field" }, ye = { class: "taxonomy-editor__row" }, Q = "分类", be = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "index",
	setup(t) {
		let { newsError: r, deleteNews: a, getNewsMetadata: o, getNewsList: s, getNewsDetail: l, saveNews: d } = he(), { hasPermission: p } = pe(), { formatDateTime: te } = pe(), h = (e) => p([`cms_news_category:${e}`]), _ = N(), y = N(), b = q(o, (e) => {
			_.value = e;
		}), O = [
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
				key: "parent_id",
				dataIndex: "parent_id",
				title: "父分类",
				width: 180,
				formatter: (e) => _.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
		], { proTableBindings: k, reload: ae, filters: oe } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: [
				...b.fields,
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
			],
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), a = await s("categories", {
					...i,
					page_no: t,
					page_size: n
				}, r);
				return {
					rows: a.lists,
					total: a.count
				};
			}
		});
		b.bindFilters(oe);
		let M = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), P = le(M()), F = N(!1), I = N(!1), z = N(!1), ue = N(!1), B = N(!1), V = N(""), U = N(!1), de = N(""), W = N(!1), me = x(() => !h(P.id ? "edit" : "add")), G = x(() => z.value || ue.value), Y = "", be;
		async function $(e) {
			be?.abort(), be = new AbortController();
			let t = be;
			Object.assign(P, M(), { id: e || "" }), de.value = "", B.value = !1, V.value = "", U.value = !1, F.value = !0, I.value = !0, Y = JSON.stringify(P);
			try {
				if (y.value = await o(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await l("categories", e, t.signal);
				if (y.value = await o(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(P, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), Y = JSON.stringify(P);
			} catch (e) {
				t.signal.aborted || (U.value = !0, de.value = r(e));
			} finally {
				t.signal.aborted || (I.value = !1);
			}
		}
		function xe() {
			return G.value ? !1 : !I.value && !U.value && JSON.stringify(P) !== Y ? (W.value = !0, !1) : (be?.abort(), !0);
		}
		function Se() {
			G.value || (be?.abort(), F.value = !1);
		}
		function Ce() {
			W.value = !1, F.value = !1;
		}
		async function we() {
			if (!(me.value || G.value || I.value || U.value)) {
				if (!P.name.trim() || P.sort_order === null) {
					de.value = "请填写分类名称和排序";
					return;
				}
				z.value = !0, de.value = "";
				try {
					await d("categories", {
						name: P.name,
						parent_id: P.parent_id || null,
						sort_order: P.sort_order,
						is_enabled: P.is_enabled,
						id: P.id || void 0,
						row_version: P.id ? P.row_version : void 0
					}), F.value = !1, f.success("保存成功"), await Promise.all([ae(), ke()]);
				} catch (e) {
					de.value = r(e);
				} finally {
					z.value = !1;
				}
			}
		}
		function Te() {
			!P.id || !h("delete") || G.value || I.value || U.value || (V.value = "", B.value = !0);
		}
		async function Ee() {
			if (!(!B.value || !P.id || !h("delete") || G.value || I.value || U.value)) {
				ue.value = !0, V.value = "";
				try {
					await a("categories", P.id, P.row_version), B.value = !1, F.value = !1, f.success("分类已删除"), await Promise.all([ae(), ke()]);
				} catch (e) {
					V.value = r(e);
				} finally {
					ue.value = !1;
				}
			}
		}
		let De = x(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(y.value?.categories || []).filter((e) => !e.parent_id && e.id !== P.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Oe = new AbortController();
		async function ke() {
			try {
				_.value = await o(Oe.signal);
			} catch {}
		}
		return ce(ke), se(() => {
			be?.abort(), Oe.abort();
		}), (t, r) => (j(), w("div", X, [
			D(R(c), A(R(k), {
				"auto-refreshable": !1,
				columns: O,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Q}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": H(({ row: e }) => [D(J, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": H(() => [h("add") ? (j(), S(R(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => $()
				}, {
					icon: H(() => [D(R(g), {
						name: "plus",
						size: 14
					})]),
					default: H(() => [E("新增" + L(Q))]),
					_: 1
				})) : C("", !0)]),
				"cell-is_enabled": H(({ row: e }) => [D(R(ee), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: H(() => [E(L(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": H(({ row: e }) => [D(R(n), {
					size: "sm",
					"icon-only": "",
					title: h("edit") ? `编辑${Q}` : `${Q}详情`,
					"aria-label": `编辑${Q}`,
					onClick: (t) => $(e.id)
				}, {
					default: H(() => [D(R(g), {
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
			}, 16, ["aria-label"]),
			D(R(u), {
				modelValue: F.value,
				"onUpdate:modelValue": r[5] ||= (e) => F.value = e,
				title: `${P.id ? "编辑" : "新增"}新闻${Q}`,
				width: "680px",
				subtitle: "新闻分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": xe
			}, {
				footer: H(() => [
					P.id && h("delete") ? (j(), S(R(n), {
						key: 0,
						variant: "danger",
						disabled: I.value || U.value || G.value,
						onClick: Te
					}, {
						icon: H(() => [D(R(g), {
							name: "trash-2",
							size: 14
						})]),
						default: H(() => [r[11] ||= E("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : C("", !0),
					D(R(n), {
						disabled: G.value,
						onClick: Se
					}, {
						default: H(() => [...r[12] ||= [E("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					me.value ? C("", !0) : (j(), S(R(n), {
						key: 1,
						variant: "primary",
						loading: z.value,
						disabled: I.value || U.value || ue.value,
						onClick: we
					}, {
						default: H(() => [E("保存" + L(Q))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: H(() => [T("div", {
					class: "taxonomy-editor",
					"aria-busy": I.value
				}, [
					I.value ? (j(), w("div", ve, [D(R(g), {
						name: "loader-circle",
						class: "news-spin",
						size: 24
					}), T("span", null, "正在读取" + L(Q) + "...")])) : C("", !0),
					de.value ? (j(), S(R(m), {
						key: 1,
						type: "error",
						closable: !1,
						description: de.value
					}, null, 8, ["description"])) : C("", !0),
					!I.value && !U.value ? (j(), S(R(ie), {
						key: 2,
						model: P,
						"label-position": "top",
						onSubmit: fe(we, ["prevent"])
					}, {
						default: H(() => [
							P.id ? (j(), S(R(e), {
								key: 0,
								label: "分类ID"
							}, {
								default: H(() => [D(R(v), {
									"model-value": P.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : C("", !0),
							D(R(e), {
								label: `${Q}名称`,
								required: ""
							}, {
								default: H(() => [D(R(v), {
									modelValue: P.name,
									"onUpdate:modelValue": r[1] ||= (e) => P.name = e,
									maxlength: 120,
									disabled: me.value || G.value,
									"aria-label": `${Q}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							D(R(e), { label: "父分类" }, {
								default: H(() => [T("div", Z, [D(R(re), {
									modelValue: P.parent_id,
									"onUpdate:modelValue": r[2] ||= (e) => P.parent_id = e,
									options: De.value,
									disabled: me.value || G.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), r[10] ||= T("p", { class: "news-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类新闻。 ", -1)])]),
								_: 1
							}),
							T("div", ye, [D(R(e), {
								label: "前端排序",
								required: ""
							}, {
								default: H(() => [D(R(ne), {
									modelValue: P.sort_order,
									"onUpdate:modelValue": r[3] ||= (e) => P.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: me.value || G.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), D(R(e), { label: "启用状态" }, {
								default: H(() => [D(ge, {
									modelValue: P.is_enabled,
									"onUpdate:modelValue": r[4] ||= (e) => P.is_enabled = e,
									disabled: me.value || G.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : C("", !0)
				], 8, _e)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			D(R(u), {
				modelValue: B.value,
				"onUpdate:modelValue": r[7] ||= (e) => B.value = e,
				title: "删除新闻分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !ue.value
			}, {
				footer: H(() => [D(R(n), {
					disabled: ue.value,
					onClick: r[6] ||= (e) => B.value = !1
				}, {
					default: H(() => [...r[13] ||= [E("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), D(R(n), {
					variant: "danger",
					loading: ue.value,
					onClick: Ee
				}, {
					default: H(() => [...r[14] ||= [E("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: H(() => [T("p", null, "确认删除分类“" + L(P.name) + "”？有关联新闻或子分类的分类无法删除。", 1), V.value ? (j(), S(R(m), {
					key: 0,
					type: "error",
					closable: !1,
					description: V.value
				}, null, 8, ["description"])) : C("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			D(R(u), {
				modelValue: W.value,
				"onUpdate:modelValue": r[9] ||= (e) => W.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: H(() => [D(R(n), { onClick: r[8] ||= (e) => W.value = !1 }, {
					default: H(() => [...r[15] ||= [E("继续编辑", -1)]]),
					_: 1
				}), D(R(n), {
					variant: "primary",
					onClick: Ce
				}, {
					default: H(() => [...r[16] ||= [E("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-30abf45a"]]), $ = {
	news: "新闻",
	help: "文章",
	announcement: "公告"
}, xe = [
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
function Se(e, t, n, r, i = Date.now()) {
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
	if (e.category_id && !s && (a.category_id = "所选分类已不可用，请重新选择"), r !== "draft" && (e.category_id ? s && !s.effective_enabled && (a.category_id = `发布${o}的分类及父分类必须已启用`) : a.category_id = `请选择${o}分类`, e.body_html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "").replace(/&nbsp;|&#0*(?:160|9|10|13|32);|&#x0*(?:a0|9|a|d|20);/gi, " ").trim() || (a.body_html = `请填写${o}正文`)), (e.related_content_ids?.length || 0) > 20 && (a.related_content_ids = `相关${o}最多选择 20 篇`), r === "scheduled") {
		let t = new Date(e.scheduled_local).getTime();
		(!Number.isFinite(t) || t <= i) && (a.scheduled_local = "计划发布时间必须晚于当前时间");
	}
	return a;
}
function Ce(e, t) {
	let n = {}, r = [], i = $[t], a = {
		[`${i}标题不能为空`]: "title",
		[`发布${i}必须选择分类`]: "category_id",
		[`发布${i}的分类及父分类必须已启用`]: "category_id",
		[`发布${i}需要填写正文`]: "body_html",
		"封面地址必须为 HTTP(S) 或站内绝对路径": "cover_url",
		计划发布时间必须晚于当前时间: "scheduled_local"
	}, o = e && typeof e == "object" ? e : {};
	for (let [e, i] of Object.entries(o.errors || {})) {
		let o = e.split(".")[0], s = o === "scheduled_at" ? "scheduled_local" : o;
		for (let o of Array.isArray(i) ? i : [i]) {
			if (typeof o != "string" || !o) continue;
			let i = xe.includes(s) ? s : e === t ? a[o] : void 0;
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
function we(e, t, n, r) {
	let i = N(), a = N(), o = N(null), s = N(Date.now()), c = le({}), l = N(""), u = Object.fromEntries(xe.map((e) => [e, {
		required: e === "title" || e === "category_id",
		trigger: "submit"
	}])), d = x(() => o.value ? Se(e, t(), n, o.value === "draft" ? "draft" : e.scheduled_local ? "scheduled" : "published", s.value) : {}), ee = x(() => ({
		...c,
		...d.value
	})), f = x(() => Object.keys(ee.value).length);
	for (let t of xe) V(() => e[t], () => {
		delete c[t], l.value = "", s.value = Date.now();
	}, { deep: !0 });
	function p() {
		ee.value.seo_description && a.value?.focus();
	}
	async function te() {
		await ae();
		let e = [...i.value?.querySelectorAll("[data-prop]") || []].find((e) => ee.value[e.dataset.prop]);
		if (!e && ee.value.seo_description) {
			r.value ? p() : r.value = !0;
			return;
		}
		e && (e.scrollIntoView({
			block: "center",
			behavior: "auto"
		}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
	}
	async function m(e) {
		o.value = e === "draft" ? "draft" : "publish", s.value = Date.now(), l.value = "";
		for (let e of xe) delete c[e];
		return f.value ? (await te(), !1) : !0;
	}
	function ne(e) {
		let t = Ce(e, n);
		Object.assign(c, t.fields), l.value = t.general;
	}
	return {
		editorRoot: i,
		seoInput: a,
		fieldRules: u,
		fieldErrors: ee,
		pendingCount: f,
		saveError: l,
		validateSave: m,
		setSaveFailure: ne,
		focusFirstError: te,
		focusSeoError: p
	};
}
//#endregion
//#region src/cms/views/content/components/CoverFileItem.vue?vue&type=script&setup=true&lang.ts
var Te = {
	class: "file-list",
	"aria-label": "封面文件"
}, Ee = { class: "file-item" }, De = { class: "file-icon" }, Oe = ["src"], ke = [
	"href",
	"download",
	"title",
	"aria-busy",
	"aria-disabled"
], Ae = { class: "file-size" }, je = ["disabled"], Me = {
	key: 0,
	class: "file-error",
	role: "alert"
}, Ne = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "CoverFileItem",
	props: {
		url: {},
		file: {},
		disabled: { type: Boolean }
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = N(null), a = N(!1), o = N(!1), s = N(""), c, l = x(() => {
			try {
				let e = new URL(n.url, window.location.href);
				return ["http:", "https:"].includes(e.protocol) ? e.href : "";
			} catch {
				return "";
			}
		}), u = x(() => {
			if (n.file) return n.file.name;
			let e = l.value ? new URL(l.value).pathname.split("/").pop() : "";
			if (!e) return "封面图片";
			try {
				return decodeURIComponent(e);
			} catch {
				return e;
			}
		}), d = x(() => i.value === null ? "大小未知" : i.value < 1024 ? `${i.value} B` : i.value < 1024 * 1024 ? `${(i.value / 1024).toFixed(1)} KB` : `${(i.value / (1024 * 1024)).toFixed(1)} MB`);
		V(() => [n.url, n.file], async (e, t, r) => {
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
		async function ee() {
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
		}), (t, n) => (j(), w("div", Te, [T("div", Ee, [
			T("span", De, [a.value ? (j(), S(R(g), {
				key: 1,
				name: "image",
				size: 20
			})) : (j(), w("img", {
				key: 0,
				src: e.url,
				alt: "封面缩略图",
				onError: n[0] ||= (e) => a.value = !0
			}, null, 40, Oe))]),
			T("a", {
				class: "file-name",
				href: l.value || void 0,
				download: u.value,
				title: u.value,
				"aria-busy": o.value,
				"aria-disabled": o.value || !l.value,
				onClick: fe(ee, ["prevent", "stop"])
			}, L(u.value), 9, ke),
			T("span", Ae, L(d.value), 1),
			T("button", {
				class: "file-remove",
				type: "button",
				"aria-label": "移除封面",
				title: "移除封面",
				disabled: e.disabled,
				onClick: n[1] ||= fe((e) => r("remove"), ["stop"])
			}, [D(R(g), {
				name: "close",
				size: 14
			})], 8, je)
		]), s.value ? (j(), w("span", Me, L(s.value), 1)) : C("", !0)]));
	}
}), [["__scopeId", "data-v-389015f1"]]), Pe = { class: "content-cover" }, Fe = { class: "content-cover__preview" }, Ie = ["src", "alt"], Le = {
	key: 1,
	class: "content-cover__empty"
}, Re = {
	key: 2,
	class: "content-cover__hint"
}, ze = {
	key: 0,
	class: "content-cover__error",
	role: "status"
}, Be = /*#__PURE__*/ y(/* @__PURE__ */ O({
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
		let n = e, r = t, i = N(), a = I(), o = N(!1), s = N(!1), c;
		V(() => n.modelValue, (e) => {
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
			ae(() => i.value?.clearFiles());
		}
		function d() {
			r("success"), u();
		}
		function ee(e, t) {
			r("error", c ? c.error : t), c = void 0, u();
		}
		function f() {
			n.disabled || o.value || (a.value = void 0, s.value = !1, r("update:modelValue", ""), r("update:mediaId", null));
		}
		return (t, n) => (j(), w("div", Pe, [
			D(R(te), {
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
				onError: ee,
				onExceed: n[2] ||= (e) => r("error", /* @__PURE__ */ Error("一次只能上传一张封面图片"))
			}, {
				default: H(() => [T("div", Fe, [e.modelValue ? (j(), w("img", {
					key: 0,
					src: e.modelValue,
					alt: e.label,
					draggable: "false",
					onError: n[0] ||= (e) => s.value = !0,
					onLoad: n[1] ||= (e) => s.value = !1
				}, null, 40, Ie)) : (j(), w("div", Le, [D(R(g), {
					name: "image",
					size: 28
				})])), e.modelValue ? C("", !0) : (j(), w("span", Re, [E(L(o.value ? "正在上传…" : "拖动图片到此处，或点击上传") + " ", 1), n[3] ||= T("span", { class: "content-cover__types" }, "JPG / PNG / WebP，最大 5 MB", -1)]))])]),
				_: 1
			}, 8, ["disabled"]),
			s.value ? (j(), w("span", ze, " 封面无法加载，请重新上传 ")) : C("", !0),
			e.modelValue ? (j(), S(Ne, {
				key: 1,
				url: e.modelValue,
				file: a.value?.url === e.modelValue ? a.value.file : void 0,
				disabled: e.disabled || o.value,
				onRemove: f
			}, null, 8, [
				"url",
				"file",
				"disabled"
			])) : C("", !0)
		]));
	}
}), [["__scopeId", "data-v-46fbc9a4"]]), Ve = ["aria-busy"], He = { class: "article-editor__header" }, Ue = { class: "article-editor__heading" }, We = { class: "article-editor__commands" }, Ge = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, Ke = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, qe = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, Je = {
	key: 1,
	class: "article-editor__failure"
}, Ye = {
	key: 0,
	class: "article-editor__error"
}, Xe = { class: "article-editor__body" }, Ze = { class: "article-editor__settings" }, Qe = { class: "article-editor__content" }, $e = ["aria-invalid", "disabled"], et = ["aria-invalid", "disabled"], tt = {
	class: "news-delete-dialog__icon",
	"aria-hidden": "true"
}, nt = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: i }) {
		let { newsError: a, newsCategoryLabel: o, deleteNews: s, getNewsDetail: c, getNewsMetadata: l, saveNews: d, uploadNewsCover: ee } = he(), { hasPermission: p } = pe(), te = t, h = i, _ = N(!0), y = N(!1), O = N(!1), k = N(""), A = N(!1), ae = N(!1), oe = N(!1), M = N(!1), P = N(pe().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), F = N(), I = N("draft"), z = N(!1), B = x(() => p(["cms_news:publish"])), V = x(() => !p([`cms_news:${te.articleId ? "edit" : "add"}`]) || !B.value && I.value !== "draft"), de = x(() => p(["cms_news:delete"]) && (B.value || I.value === "draft"));
		async function W() {
			if (!(!de.value || y.value || _.value || O.value)) {
				y.value = !0, k.value = "";
				try {
					await s("articles", K.id, K.row_version), xe = JSON.stringify(K), f.success("新闻已删除"), h("saved");
				} catch (e) {
					k.value = a(e), M.value = !1;
				} finally {
					y.value = !1;
				}
			}
		}
		let G = x(() => V.value || y.value), K = le({
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
		}), { editorRoot: q, seoInput: J, fieldRules: Y, fieldErrors: X, pendingCount: _e, saveError: ve, validateSave: Z, setSaveFailure: ye, focusFirstError: Q, focusSeoError: be } = we(K, () => F.value?.categories || [], "news", A), $ = x(() => (F.value?.categories || []).map((e) => ({
			label: o(F.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), xe = "", Se;
		function Ce(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Te() {
			Se?.abort(), Se = new AbortController();
			let e = Se;
			_.value = !0, O.value = !1, k.value = "";
			try {
				if (F.value = await l(e.signal, { cms_source_type: "platform" }), te.articleId) {
					let t = await c("articles", te.articleId, e.signal);
					if (F.value = await l(e.signal, { space_id: String(t.space_id) }), P.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					K.scheduled_local = t.publish_status === "scheduled" ? Ce(t.scheduled_at) : "", I.value = t.publish_status;
				}
				xe = JSON.stringify(K);
			} catch (t) {
				e.signal.aborted || (k.value = a(t), O.value = !0);
			} finally {
				e.signal.aborted || (_.value = !1);
			}
		}
		let Ee = () => !_.value && !O.value && xe !== JSON.stringify(K);
		function De() {
			Ee() ? ae.value = !0 : h("close");
		}
		function Oe() {
			I.value === "draft" ? Ae("draft") : oe.value = !0;
		}
		function ke() {
			oe.value = !1, Ae("draft");
		}
		async function Ae(e) {
			if (G.value || _.value || O.value || z.value || (k.value = "", !await Z(e))) return;
			let t = K.scheduled_local ? new Date(K.scheduled_local) : null;
			y.value = !0, k.value = "";
			try {
				await d("articles", {
					...K,
					id: K.id || void 0,
					row_version: K.id ? K.row_version : void 0,
					category_id: K.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), xe = JSON.stringify(K), f.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "新闻已发布"), h("saved");
			} catch (e) {
				ye(e);
			} finally {
				y.value = !1;
			}
			_e.value && await Q();
		}
		function je(e) {
			k.value = a(e);
		}
		let Me = (e) => {
			Ee() && (e.preventDefault(), e.returnValue = "");
		};
		return me(() => !y.value && !z.value && (!Ee() || window.confirm("新闻有未保存的修改，确定离开？"))), ce(() => {
			Te(), window.addEventListener("beforeunload", Me);
		}), se(() => {
			Se?.abort(), window.removeEventListener("beforeunload", Me);
		}), (i, a) => (j(), w("section", {
			ref_key: "editorRoot",
			ref: q,
			class: "article-editor",
			"aria-busy": _.value || y.value
		}, [
			T("header", He, [
				D(R(n), {
					"icon-only": "",
					title: "返回新闻列表",
					"aria-label": "返回新闻列表",
					disabled: y.value || z.value,
					onClick: De
				}, {
					default: H(() => [D(R(g), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				T("div", Ue, [T("h2", null, L(t.articleId ? "编辑新闻" : "新增新闻"), 1), T("span", null, L(F.value?.source_locale || "zh-CN") + " · " + L(P.value), 1)]),
				T("div", We, [
					t.articleId && de.value ? (j(), S(R(n), {
						key: 0,
						size: "sm",
						disabled: _.value || O.value || y.value || z.value,
						onClick: a[0] ||= (e) => M.value = !0
					}, {
						default: H(() => [...a[28] ||= [E("删除新闻", -1)]]),
						_: 1
					}, 8, ["disabled"])) : C("", !0),
					D(R(n), {
						size: "sm",
						disabled: _.value || O.value,
						onClick: a[1] ||= (e) => A.value = !0
					}, {
						icon: H(() => [D(R(g), {
							name: "search",
							size: 14
						})]),
						default: H(() => [a[29] ||= E("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					V.value ? C("", !0) : (j(), S(R(n), {
						key: 1,
						size: "sm",
						disabled: _.value || O.value || y.value || z.value,
						onClick: Oe
					}, {
						icon: H(() => [D(R(g), {
							name: "save",
							size: 14
						})]),
						default: H(() => [a[30] ||= E("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					R(ve) ? (j(), w("span", Ge, L(R(ve)), 1)) : C("", !0),
					!V.value && R(_e) ? (j(), w("span", Ke, "还有 " + L(R(_e)) + " 项待完善", 1)) : C("", !0),
					!V.value && B.value ? (j(), S(R(n), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: _.value || O.value || z.value,
						loading: y.value,
						onClick: a[2] ||= (e) => Ae(K.scheduled_local ? "scheduled" : "published")
					}, {
						icon: H(() => [D(R(g), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: H(() => [E(L(K.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : C("", !0)
				])
			]),
			_.value ? (j(), w("div", qe, [D(R(g), {
				name: "loader-circle",
				class: "news-spin",
				size: 28
			}), a[31] ||= T("span", null, "正在读取新闻资料...", -1)])) : O.value ? (j(), w("div", Je, [D(R(m), {
				type: "error",
				description: k.value,
				closable: !1
			}, null, 8, ["description"]), D(R(n), { onClick: Te }, {
				default: H(() => [...a[32] ||= [E("重新加载", -1)]]),
				_: 1
			})])) : (j(), w(b, { key: 2 }, [k.value ? (j(), w("div", Ye, [D(R(m), {
				type: "error",
				description: k.value,
				closable: !1
			}, null, 8, ["description"])])) : C("", !0), T("div", Xe, [T("aside", Ze, [D(R(ie), {
				model: K,
				rules: R(Y),
				"label-position": "top",
				onSubmit: a[12] ||= fe(() => {}, ["prevent"])
			}, {
				default: H(() => [
					D(R(e), {
						label: "新闻分类",
						prop: "category_id",
						error: R(X).category_id,
						required: ""
					}, {
						default: H(() => [D(R(re), {
							modelValue: K.category_id,
							"onUpdate:modelValue": a[3] ||= (e) => K.category_id = e,
							options: $.value,
							clearable: "",
							disabled: G.value,
							"aria-label": "新闻分类"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					a[33] ||= T("h3", null, "新闻设置", -1),
					D(R(e), {
						label: "新闻封面",
						prop: "cover_url",
						error: R(X).cover_url
					}, {
						default: H(() => [D(Be, {
							modelValue: K.cover_url,
							"onUpdate:modelValue": a[4] ||= (e) => K.cover_url = e,
							label: "新闻封面",
							disabled: G.value,
							upload: R(ee),
							onBusyChange: a[5] ||= (e) => z.value = e,
							onStart: a[6] ||= (e) => k.value = "",
							onError: je
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "内容来源",
						prop: "content_source",
						error: R(X).content_source
					}, {
						default: H(() => [D(R(v), {
							modelValue: K.content_source,
							"onUpdate:modelValue": a[7] ||= (e) => K.content_source = e,
							maxlength: 160,
							disabled: G.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "作者署名",
						prop: "author_name",
						error: R(X).author_name
					}, {
						default: H(() => [D(R(v), {
							modelValue: K.author_name,
							"onUpdate:modelValue": a[8] ||= (e) => K.author_name = e,
							maxlength: 120,
							disabled: G.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "前端排序",
						prop: "sort_order",
						error: R(X).sort_order
					}, {
						default: H(() => [D(R(ne), {
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
					a[34] ||= T("h3", null, "发布设置", -1),
					D(R(e), {
						label: "启用状态",
						prop: "is_enabled",
						error: R(X).is_enabled
					}, {
						default: H(() => [D(ge, {
							modelValue: K.is_enabled,
							"onUpdate:modelValue": a[10] ||= (e) => K.is_enabled = e,
							disabled: G.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: R(X).scheduled_local
					}, {
						default: H(() => [D(R(v), {
							modelValue: K.scheduled_local,
							"onUpdate:modelValue": a[11] ||= (e) => K.scheduled_local = e,
							type: "datetime-local",
							disabled: G.value || !B.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[35] ||= T("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), T("main", Qe, [D(R(ie), {
				model: K,
				rules: R(Y),
				"label-position": "top",
				onSubmit: a[16] ||= fe(() => {}, ["prevent"])
			}, {
				default: H(() => [
					D(R(e), {
						label: "标题",
						prop: "title",
						error: R(X).title,
						required: ""
					}, {
						default: H(() => [D(R(v), {
							modelValue: K.title,
							"onUpdate:modelValue": a[13] ||= (e) => K.title = e,
							maxlength: 255,
							disabled: G.value,
							placeholder: "输入新闻标题",
							"aria-label": "新闻标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "摘要",
						prop: "summary",
						error: R(X).summary
					}, {
						default: H(() => [U(T("textarea", {
							"onUpdate:modelValue": a[14] ||= (e) => K.summary = e,
							"aria-invalid": !!R(X).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: G.value,
							"aria-label": "新闻摘要"
						}, null, 8, $e), [[ue, K.summary]])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "正文",
						prop: "body_html",
						error: R(X).body_html
					}, {
						default: H(() => [D(R(r), {
							modelValue: K.body_html,
							"onUpdate:modelValue": a[15] ||= (e) => K.body_html = e,
							readonly: V.value,
							disabled: y.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "新闻正文"
						}, {
							"image-upload": H(({ url: e, setUrl: t, setBusy: n }) => [D(Be, {
								label: "正文图片",
								"model-value": e,
								upload: R(ee),
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
			D(R(u), {
				modelValue: A.value,
				"onUpdate:modelValue": a[20] ||= (e) => A.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: H(() => [D(R(n), {
					variant: "primary",
					onClick: a[19] ||= (e) => A.value = !1
				}, {
					default: H(() => [...a[36] ||= [E("确定", -1)]]),
					_: 1
				})]),
				default: H(() => [D(R(ie), {
					model: K,
					rules: R(Y),
					"label-position": "top",
					onSubmit: a[18] ||= fe(() => {}, ["prevent"])
				}, {
					default: H(() => [D(R(e), {
						label: "SEO 描述",
						prop: "seo_description",
						error: R(X).seo_description
					}, {
						default: H(() => [U(T("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": a[17] ||= (e) => K.seo_description = e,
							"aria-invalid": !!R(X).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: G.value,
							"aria-label": "SEO 描述"
						}, null, 8, et), [[ue, K.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			D(R(u), {
				modelValue: M.value,
				"onUpdate:modelValue": a[22] ||= (e) => M.value = e,
				title: "确认删除",
				subtitle: `操作对象：${K.title || "未命名新闻"}`,
				width: "460px",
				"panel-class": "news-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !y.value
			}, {
				"header-actions": H(() => [T("span", tt, [D(R(g), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: H(() => [D(R(n), {
					disabled: y.value,
					onClick: a[21] ||= (e) => M.value = !1
				}, {
					default: H(() => [...a[37] ||= [E("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), D(R(n), {
					variant: "warning",
					loading: y.value,
					onClick: W
				}, {
					default: H(() => [...a[38] ||= [E("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: H(() => [D(R(m), {
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
			D(R(u), {
				modelValue: ae.value,
				"onUpdate:modelValue": a[25] ||= (e) => ae.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: H(() => [D(R(n), { onClick: a[23] ||= (e) => ae.value = !1 }, {
					default: H(() => [...a[39] ||= [E("继续编辑", -1)]]),
					_: 1
				}), D(R(n), {
					variant: "primary",
					onClick: a[24] ||= (e) => h("close")
				}, {
					default: H(() => [...a[40] ||= [E("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			D(R(u), {
				modelValue: oe.value,
				"onUpdate:modelValue": a[27] ||= (e) => oe.value = e,
				title: "将新闻转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: H(() => [D(R(n), { onClick: a[26] ||= (e) => oe.value = !1 }, {
					default: H(() => [...a[41] ||= [E("取消", -1)]]),
					_: 1
				}), D(R(n), {
					variant: "primary",
					onClick: ke
				}, {
					default: H(() => [...a[42] ||= [E("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Ve));
	}
}), [["__scopeId", "data-v-25e3e2bb"]]), rt = { class: "news-articles" }, it = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "index",
	setup(e) {
		let { newsPublishStates: t, newsCategoryLabel: r, getNewsList: a, getNewsMetadata: o } = he(), { hasPermission: s } = pe(), { formatDateTime: l } = pe(), u = N(!1), d = N(), f = (e) => s([`cms_news:${e}`]), p = N(), te = q(o, (e) => {
			p.value = e;
		}), m = [
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
				formatter: (e) => r(p.value, e)
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
		], { proTableBindings: ne, reload: re, filters: ie } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: x(() => [
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
					}, ...(p.value?.categories || []).map((e) => ({
						label: r(p.value, e.id),
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
			]),
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
		});
		te.bindFilters(ie);
		let h = new AbortController();
		async function _() {
			try {
				p.value = await o(h.signal);
			} catch {}
		}
		function v(e) {
			d.value = e, u.value = !0;
		}
		function y() {
			u.value = !1, re(), _();
		}
		return ce(_), se(() => h.abort()), (e, r) => (j(), w("div", rt, [u.value ? (j(), S(nt, {
			key: 0,
			"article-id": d.value,
			onClose: r[0] ||= (e) => u.value = !1,
			onSaved: y
		}, null, 8, ["article-id"])) : C("", !0), U(D(R(c), A(R(ne), {
			"auto-refreshable": !1,
			columns: m,
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
			"cell-cms_source_type": H(({ row: e }) => [D(J, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": H(() => [f("add") ? (j(), S(R(n), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: r[1] ||= (e) => v()
			}, {
				icon: H(() => [D(R(g), {
					name: "plus",
					size: 14
				})]),
				default: H(() => [r[2] ||= E("新增新闻", -1)]),
				_: 1
			})) : C("", !0)]),
			"cell-publish_status": H(({ row: e }) => [D(R(ee), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: H(() => [E(L(R(t).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": H(({ row: e }) => [D(R(ee), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: H(() => [E(L(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": H(({ row: e }) => [E(L(R(l)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": H(({ row: e }) => [D(R(n), {
				size: "sm",
				"icon-only": "",
				title: f("edit") ? "编辑新闻" : "新闻详情",
				"aria-label": f("edit") ? "编辑新闻" : "新闻详情",
				onClick: (t) => v(e.id)
			}, {
				default: H(() => [D(R(g), {
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
		}, 16), [[B, !u.value]])]));
	}
}), [["__scopeId", "data-v-aef51e21"]]);
//#endregion
//#region src/cms/api/content/academy.ts
function at() {
	let e = pe().request, t = "/cms/academy";
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
var ot = ["aria-busy"], st = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, ct = { class: "taxonomy-editor__row" }, lt = "分类", ut = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "CategoryTable",
	setup(t) {
		let { hasPermission: r } = pe(), { formatDateTime: a } = pe(), { academyDifficulties: s, academyError: l, getAcademyList: d, getAcademyMetadata: p, getAcademyDetail: te, saveAcademy: h, deleteAcademyCategory: _ } = at(), y = (e) => r([`cms_academy_category:${e}`]), O = q(p), k = [
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
				key: "difficulty_levels",
				dataIndex: "difficulty_levels",
				title: "难度范围",
				width: 170,
				formatter: (e) => (e || []).map((e) => s.find((t) => t.value === e)?.label).join(" / ")
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
		], { proTableBindings: ae, reload: oe, currentPage: ce, pageSize: M, total: P, filters: F } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: [
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
			],
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), a = await d("categories", {
					...i,
					page_no: t,
					page_size: n
				}, r);
				return {
					rows: a.lists,
					total: a.count
				};
			}
		});
		O.bindFilters(F);
		let I = () => ({
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
		}), z = le(I()), ue = N(!1), B = N(!1), V = N(!1), U = N(!1), de = N(!1), W = N(""), me = N(!1), G = N(""), he = N(!1), Y = x(() => !y(z.id ? "edit" : "add")), ge = x(() => V.value || U.value), X = "", _e;
		async function ve(e) {
			_e?.abort(), _e = new AbortController();
			let t = _e;
			if (Object.assign(z, I(), { id: e || "" }), G.value = "", de.value = !1, W.value = "", me.value = !1, ue.value = !0, B.value = !!e, X = JSON.stringify(z), e) try {
				let n = await te("categories", e, t.signal);
				if (t.signal.aborted) return;
				Object.assign(z, {
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
				}), X = JSON.stringify(z);
			} catch (e) {
				t.signal.aborted || (me.value = !0, G.value = l(e));
			} finally {
				t.signal.aborted || (B.value = !1);
			}
		}
		function Z() {
			return ge.value ? !1 : !B.value && !me.value && JSON.stringify(z) !== X ? (he.value = !0, !1) : (_e?.abort(), !0);
		}
		function ye() {
			ge.value || (_e?.abort(), ue.value = !1);
		}
		function Q() {
			he.value = !1, ue.value = !1;
		}
		async function be() {
			if (!(Y.value || ge.value || B.value || me.value)) {
				if (!z.name.trim() || z.sort_order === null || !z.difficulty_levels.length) {
					G.value = "请填写名称、排序和适用难度";
					return;
				}
				V.value = !0, G.value = "";
				try {
					await h("categories", {
						...z,
						id: z.id || void 0,
						row_version: z.id ? z.row_version : void 0
					}), ue.value = !1, f.success("保存成功"), await oe();
				} catch (e) {
					G.value = l(e);
				} finally {
					V.value = !1;
				}
			}
		}
		function $() {
			!z.id || !y("delete") || ge.value || B.value || me.value || (W.value = "", de.value = !0);
		}
		async function xe() {
			if (!(!de.value || !z.id || !y("delete") || ge.value || B.value || me.value)) {
				U.value = !0, W.value = "";
				try {
					await _({
						id: z.id,
						row_version: z.row_version
					}), de.value = !1, ue.value = !1, f.success("分类已删除"), await oe(), ce.value = Math.min(ce.value, Math.max(1, Math.ceil(P.value / M.value)));
				} catch (e) {
					W.value = l(e);
				} finally {
					U.value = !1;
				}
			}
		}
		return se(() => _e?.abort()), (t, r) => (j(), w(b, null, [
			D(R(c), A(R(ae), {
				"auto-refreshable": !1,
				columns: k,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${lt}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": H(({ row: e }) => [D(J, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": H(() => [y("add") ? (j(), S(R(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => ve()
				}, {
					icon: H(() => [D(R(g), {
						name: "plus",
						size: 14
					})]),
					default: H(() => [E("新增" + L(lt))]),
					_: 1
				})) : C("", !0)]),
				"cell-is_enabled": H(({ row: e }) => [D(R(ee), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: H(() => [E(L(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": H(({ row: e }) => [D(R(n), {
					size: "sm",
					"icon-only": "",
					title: y("edit") ? `编辑${lt}` : `${lt}详情`,
					"aria-label": `编辑${lt}`,
					onClick: (t) => ve(e.id)
				}, {
					default: H(() => [D(R(g), {
						name: y("edit") ? "square-pen" : "panel-right-open",
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
			D(R(u), {
				modelValue: ue.value,
				"onUpdate:modelValue": r[5] ||= (e) => ue.value = e,
				title: `${z.id ? "编辑" : "新增"}课程${lt}`,
				width: "620px",
				"close-on-click-modal": !1,
				"before-close": Z
			}, {
				footer: H(() => [
					z.id && y("delete") ? (j(), S(R(n), {
						key: 0,
						variant: "danger",
						disabled: B.value || me.value || ge.value,
						onClick: $
					}, {
						icon: H(() => [D(R(g), {
							name: "trash-2",
							size: 14
						})]),
						default: H(() => [r[10] ||= E("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : C("", !0),
					D(R(n), {
						disabled: ge.value,
						onClick: ye
					}, {
						default: H(() => [...r[11] ||= [E("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Y.value ? C("", !0) : (j(), S(R(n), {
						key: 1,
						variant: "primary",
						loading: V.value,
						disabled: B.value || me.value || U.value,
						onClick: be
					}, {
						default: H(() => [E("保存" + L(lt))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: H(() => [T("div", {
					class: "taxonomy-editor",
					"aria-busy": B.value
				}, [
					B.value ? (j(), w("div", st, [D(R(g), {
						name: "loader-circle",
						class: "academy-spin",
						size: 24
					}), T("span", null, "正在读取" + L(lt) + "...")])) : C("", !0),
					G.value ? (j(), S(R(m), {
						key: 1,
						type: "error",
						closable: !1,
						description: G.value
					}, null, 8, ["description"])) : C("", !0),
					!B.value && !me.value ? (j(), S(R(ie), {
						key: 2,
						model: z,
						"label-position": "top",
						onSubmit: fe(be, ["prevent"])
					}, {
						default: H(() => [
							D(R(e), {
								label: `${lt}名称`,
								required: ""
							}, {
								default: H(() => [D(R(v), {
									modelValue: z.name,
									"onUpdate:modelValue": r[1] ||= (e) => z.name = e,
									maxlength: 120,
									disabled: Y.value || ge.value,
									"aria-label": `${lt}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							D(R(e), {
								label: "适用难度",
								required: ""
							}, {
								default: H(() => [D(R(re), {
									modelValue: z.difficulty_levels,
									"onUpdate:modelValue": r[2] ||= (e) => z.difficulty_levels = e,
									multiple: "",
									options: R(s),
									disabled: Y.value || ge.value,
									"aria-label": "适用难度"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								])]),
								_: 1
							}),
							T("div", ct, [D(R(e), {
								label: "前端排序",
								required: ""
							}, {
								default: H(() => [D(R(ne), {
									modelValue: z.sort_order,
									"onUpdate:modelValue": r[3] ||= (e) => z.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Y.value || ge.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), D(R(e), { label: "启用状态" }, {
								default: H(() => [D(R(o), {
									modelValue: z.is_enabled,
									"onUpdate:modelValue": r[4] ||= (e) => z.is_enabled = e,
									disabled: Y.value || ge.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : C("", !0)
				], 8, ot)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			D(R(u), {
				modelValue: de.value,
				"onUpdate:modelValue": r[7] ||= (e) => de.value = e,
				title: "删除课程分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !U.value
			}, {
				footer: H(() => [D(R(n), {
					disabled: U.value,
					onClick: r[6] ||= (e) => de.value = !1
				}, {
					default: H(() => [...r[12] ||= [E("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), D(R(n), {
					variant: "danger",
					loading: U.value,
					onClick: xe
				}, {
					default: H(() => [...r[13] ||= [E("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: H(() => [T("p", null, "确认删除分类“" + L(z.name) + "”？有关联课程的分类无法删除。", 1), W.value ? (j(), S(R(m), {
					key: 0,
					type: "error",
					closable: !1,
					description: W.value
				}, null, 8, ["description"])) : C("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			D(R(u), {
				modelValue: he.value,
				"onUpdate:modelValue": r[9] ||= (e) => he.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: H(() => [D(R(n), { onClick: r[8] ||= (e) => he.value = !1 }, {
					default: H(() => [...r[14] ||= [E("继续编辑", -1)]]),
					_: 1
				}), D(R(n), {
					variant: "primary",
					onClick: Q
				}, {
					default: H(() => [...r[15] ||= [E("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 64));
	}
}), [["__scopeId", "data-v-b7830575"]]), dt = { class: "academy-categories" }, ft = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "index",
	setup(e) {
		return (e, t) => (j(), w("div", dt, [D(ut)]));
	}
}), [["__scopeId", "data-v-8f5e5114"]]), pt = [
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
function mt(e) {
	if (/[\x00-\x20\\]/.test(e)) return !1;
	if (e.startsWith("/") && !e.startsWith("//")) return !0;
	try {
		let t = new URL(e);
		return /^https?:\/\//i.test(e) && ["http:", "https:"].includes(t.protocol);
	} catch {
		return !1;
	}
}
function ht(e) {
	return e.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "").replace(/&nbsp;|&#0*(?:160|9|10|13|32);|&#x0*(?:a0|9|a|d|20);/gi, " ").trim().length > 0;
}
function gt(e, t, n, r = Date.now()) {
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
	(e.sort_order === null || !Number.isInteger(e.sort_order) || e.sort_order < 0 || e.sort_order > 2147483647) && (i.sort_order = "请填写 0–2147483647 之间的整数"), e.cover_url && !mt(e.cover_url) && (i.cover_url = "封面地址必须为 HTTP(S) 或站内绝对路径");
	let o = e.category_ids.map((e) => t.find((t) => t.id === e));
	if (a && !o.length ? i.category_ids = "请选择课程分类" : o.some((e) => !e) ? i.category_ids = "所选分类已不可用，请重新选择" : a && o.some((e) => !e?.is_enabled) ? i.category_ids = "发布课程必须选择已启用的分类" : o.length > 50 && (i.category_ids = "最多选择 50 个课程分类"), a && !e.difficulty_level ? i.difficulty_level = "请选择课程难度" : e.difficulty_level !== "" && ![
		1,
		2,
		3
	].includes(e.difficulty_level) ? i.difficulty_level = "请选择有效的课程难度" : e.difficulty_level && o.some((t) => t && !t.difficulty_levels.includes(Number(e.difficulty_level))) && (i.difficulty_level = "课程难度不在所选分类的适用范围内"), a && e.estimated_minutes === null ? i.estimated_minutes = "请填写预计课时" : e.estimated_minutes !== null && (!Number.isInteger(e.estimated_minutes) || e.estimated_minutes < 1 || e.estimated_minutes > 1e5) && (i.estimated_minutes = "预计课时须为 1–100000 之间的整数"), a && !ht(e.body_html) && (i.body_html = "请填写课程正文"), n === "scheduled") {
		let t = new Date(e.scheduled_local).getTime();
		(!Number.isFinite(t) || t <= r) && (i.scheduled_local = "计划发布时间必须晚于当前时间");
	}
	return i;
}
var _t = {
	课程标题不能为空: "title",
	"封面地址必须为 HTTP(S) 或站内绝对路径": "cover_url",
	计划发布时间必须晚于当前时间: "scheduled_local",
	发布课程必须选择分类: "category_ids",
	所选分类不存在或不属于当前学院模板: "category_ids",
	"发布课程必须选择已启用的分类，存在已停用分类": "category_ids",
	课程难度不在所选分类的适用范围内: "difficulty_level",
	"发布课程需要填写正文、课程难度及预计课时": "body_html"
};
function vt(e) {
	let t = {}, n = [], r = e && typeof e == "object" ? e : {};
	for (let [e, i] of Object.entries(r.errors || {})) {
		let r = e.split(".")[0], a = r === "scheduled_at" ? "scheduled_local" : r;
		for (let r of Array.isArray(i) ? i : [i]) {
			if (typeof r != "string" || !r) continue;
			let i = pt.includes(a) ? a : e === "academy" ? _t[r] : void 0;
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
var yt = ["aria-busy"], bt = { class: "course-editor__header" }, xt = { class: "course-editor__heading" }, St = { class: "course-editor__commands" }, Ct = {
	key: 2,
	class: "course-editor__save-error",
	role: "alert"
}, wt = {
	key: 3,
	class: "course-editor__publish-actions"
}, Tt = {
	key: 0,
	class: "course-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Et = {
	key: 0,
	class: "course-editor__loading",
	role: "status"
}, Dt = {
	key: 1,
	class: "course-editor__failure"
}, Ot = {
	key: 2,
	class: "course-editor__body"
}, kt = { class: "course-editor__settings" }, At = { class: "course-editor__content" }, jt = ["disabled", "aria-invalid"], Mt = ["disabled", "aria-invalid"], Nt = {
	class: "course-delete-dialog__icon",
	"aria-hidden": "true"
}, Pt = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "CourseEditor",
	props: { courseId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: i }) {
		let { hasPermission: a } = pe(), { academyDifficulties: s, academyError: c, deleteAcademyCourse: l, getAcademyDetail: d, getAcademyMetadata: ee, saveAcademy: p, uploadAcademyCover: te } = at(), h = t, _ = i, y = N(!0), b = N(!1), O = N(!1), k = N(""), A = N(!1), oe = N(!1), M = N(!1), P = N(pe().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), F = N(), I = N("draft"), z = N(!1), B = N(!1), de = N(""), W = x(() => a(["cms_academy:publish"])), G = x(() => !!h.courseId && a(["cms_academy:delete"]) && (W.value || I.value === "draft")), K = x(() => !a([`cms_academy:${h.courseId ? "edit" : "add"}`]) || !W.value && I.value !== "draft"), q = x(() => K.value || b.value), J = le({
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
		}), he = N(), Y = N(), ge = N(null), X = N(Date.now()), _e = le({}), ve = N(""), Z = Object.fromEntries(pt.map((e) => [e, {
			required: e === "title" || e === "category_ids",
			trigger: "submit"
		}])), ye = x(() => ge.value ? gt(J, F.value?.categories || [], ge.value === "draft" ? "draft" : J.scheduled_local ? "scheduled" : "published", X.value) : {}), Q = x(() => ({
			..._e,
			...ye.value
		})), be = x(() => Object.keys(Q.value).length);
		for (let e of pt) V(() => J[e], () => {
			delete _e[e], e === "category_ids" && delete _e.difficulty_level, ve.value = "", X.value = Date.now();
		}, { deep: !0 });
		function $() {
			Q.value.seo_description && Y.value?.focus();
		}
		async function xe() {
			await ae();
			let e = [...he.value?.querySelectorAll("[data-prop]") || []].find((e) => Q.value[e.dataset.prop]);
			if (!e && Q.value.seo_description) {
				A.value ? $() : A.value = !0;
				return;
			}
			e && (e.scrollIntoView({
				block: "center",
				behavior: "auto"
			}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
		}
		let Se = x(() => (F.value?.categories || []).map((e) => ({
			label: e.name + (e.is_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.is_enabled
		}))), Ce = x(() => {
			let e = (F.value?.categories || []).filter((e) => J.category_ids.includes(e.id));
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
			y.value = !0, O.value = !1, k.value = "";
			try {
				if (F.value = await ee(e.signal, { cms_source_type: "platform" }), h.courseId) {
					let t = await d("courses", h.courseId, e.signal);
					if (F.value = await ee(e.signal, { space_id: String(t.space_id) }), P.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"category_ids",
						"estimated_minutes",
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
					J.scheduled_local = t.publish_status === "scheduled" ? Ee(t.scheduled_at) : "", I.value = t.publish_status;
				}
				we = JSON.stringify(J);
			} catch (t) {
				e.signal.aborted || (k.value = c(t), O.value = !0);
			} finally {
				e.signal.aborted || (y.value = !1);
			}
		}
		let Oe = () => !y.value && !O.value && we !== JSON.stringify(J);
		function ke() {
			Oe() ? oe.value = !0 : _("close");
		}
		function Ae() {
			I.value === "draft" ? Me("draft") : M.value = !0;
		}
		function je() {
			M.value = !1, Me("draft");
		}
		async function Me(e) {
			if (q.value || y.value || O.value || z.value) return;
			ge.value = e === "draft" ? "draft" : "publish", X.value = Date.now(), ve.value = "";
			for (let e of pt) delete _e[e];
			if (be.value) {
				await xe();
				return;
			}
			let t = J.scheduled_local ? new Date(J.scheduled_local) : null;
			b.value = !0, k.value = "";
			try {
				await p("courses", {
					...J,
					id: J.id || void 0,
					row_version: J.id ? J.row_version : void 0,
					difficulty_level: J.difficulty_level || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), we = JSON.stringify(J), f.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "课程已发布"), _("saved");
			} catch (e) {
				let t = vt(e);
				Object.assign(_e, t.fields), ve.value = t.general;
			} finally {
				b.value = !1;
			}
			be.value && await xe();
		}
		function Ne() {
			de.value = "", B.value = !0;
		}
		async function Pe() {
			if (!(!G.value || y.value || O.value || b.value || z.value)) {
				b.value = !0, de.value = "";
				try {
					await l({
						id: J.id,
						row_version: J.row_version
					}), we = JSON.stringify(J), B.value = !1, f.success("课程已删除"), _("saved");
				} catch (e) {
					de.value = c(e);
				} finally {
					b.value = !1;
				}
			}
		}
		function Fe(e) {
			_e.cover_url = c(e);
		}
		function Ie() {
			delete _e.cover_url;
		}
		let Le = (e) => {
			Oe() && (e.preventDefault(), e.returnValue = "");
		};
		return me(() => !b.value && !z.value && (!Oe() || window.confirm("课程有未保存的修改，确定离开？"))), ce(() => {
			De(), window.addEventListener("beforeunload", Le);
		}), se(() => {
			Te?.abort(), window.removeEventListener("beforeunload", Le);
		}), (i, a) => (j(), w("section", {
			ref_key: "editorRoot",
			ref: he,
			class: "course-editor",
			"aria-busy": y.value || b.value
		}, [
			T("header", bt, [
				D(R(n), {
					"icon-only": "",
					title: "返回课程列表",
					"aria-label": "返回课程列表",
					disabled: b.value || z.value,
					onClick: ke
				}, {
					default: H(() => [D(R(g), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				T("div", xt, [T("h2", null, L(t.courseId ? "编辑课程" : "新增课程"), 1), T("span", null, L(F.value?.source_locale || "zh-CN") + " · " + L(P.value), 1)]),
				T("div", St, [
					G.value ? (j(), S(R(n), {
						key: 0,
						variant: "danger",
						size: "sm",
						disabled: y.value || O.value || b.value || z.value,
						onClick: Ne
					}, {
						default: H(() => [...a[27] ||= [E("删除课程", -1)]]),
						_: 1
					}, 8, ["disabled"])) : C("", !0),
					D(R(n), {
						size: "sm",
						disabled: y.value || O.value,
						onClick: a[0] ||= (e) => A.value = !0
					}, {
						icon: H(() => [D(R(g), {
							name: "search",
							size: 14
						})]),
						default: H(() => [a[28] ||= E("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					K.value ? C("", !0) : (j(), S(R(n), {
						key: 1,
						size: "sm",
						disabled: y.value || O.value || b.value || z.value,
						onClick: Ae
					}, {
						icon: H(() => [D(R(g), {
							name: "save",
							size: 14
						})]),
						default: H(() => [a[29] ||= E("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					ve.value ? (j(), w("span", Ct, L(ve.value), 1)) : C("", !0),
					K.value ? C("", !0) : (j(), w("div", wt, [be.value ? (j(), w("span", Tt, "还有 " + L(be.value) + " 项待完善", 1)) : C("", !0), W.value ? (j(), S(R(n), {
						key: 1,
						variant: "primary",
						size: "sm",
						disabled: y.value || O.value || z.value,
						loading: b.value,
						onClick: a[1] ||= (e) => Me(J.scheduled_local ? "scheduled" : "published")
					}, {
						icon: H(() => [D(R(g), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: H(() => [E(L(J.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : C("", !0)]))
				])
			]),
			y.value ? (j(), w("div", Et, [D(R(g), {
				name: "loader-circle",
				class: "academy-spin",
				size: 28
			}), a[30] ||= T("span", null, "正在读取课程资料...", -1)])) : O.value ? (j(), w("div", Dt, [D(R(m), {
				type: "error",
				description: k.value,
				closable: !1
			}, null, 8, ["description"]), D(R(n), { onClick: De }, {
				default: H(() => [...a[31] ||= [E("重新加载", -1)]]),
				_: 1
			})])) : (j(), w("div", Ot, [T("aside", kt, [D(R(ie), {
				model: J,
				rules: R(Z),
				"label-position": "top",
				onSubmit: a[11] ||= fe(() => {}, ["prevent"])
			}, {
				default: H(() => [
					D(R(e), {
						label: "课程分类",
						prop: "category_ids",
						error: Q.value.category_ids,
						required: ""
					}, {
						default: H(() => [D(R(re), {
							modelValue: J.category_ids,
							"onUpdate:modelValue": a[2] ||= (e) => J.category_ids = e,
							options: Se.value,
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
					a[32] ||= T("h3", null, "课程设置", -1),
					D(R(e), {
						label: "课程封面",
						prop: "cover_url",
						error: Q.value.cover_url
					}, {
						default: H(() => [D(Be, {
							modelValue: J.cover_url,
							"onUpdate:modelValue": a[3] ||= (e) => J.cover_url = e,
							label: "课程封面",
							disabled: q.value,
							upload: R(te),
							onBusyChange: a[4] ||= (e) => z.value = e,
							onStart: a[5] ||= (e) => k.value = "",
							onError: Fe,
							onSuccess: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "课程难度",
						prop: "difficulty_level",
						error: Q.value.difficulty_level
					}, {
						default: H(() => [D(R(re), {
							modelValue: J.difficulty_level,
							"onUpdate:modelValue": a[6] ||= (e) => J.difficulty_level = e,
							options: Ce.value,
							disabled: q.value,
							"aria-label": "课程难度"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "预计课时(分钟)",
						prop: "estimated_minutes",
						error: Q.value.estimated_minutes
					}, {
						default: H(() => [D(R(ne), {
							modelValue: J.estimated_minutes,
							"onUpdate:modelValue": a[7] ||= (e) => J.estimated_minutes = e,
							min: 1,
							max: 1e5,
							precision: 0,
							disabled: q.value,
							"aria-label": "预计课时"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "前端排序",
						prop: "sort_order",
						error: Q.value.sort_order
					}, {
						default: H(() => [D(R(ne), {
							modelValue: J.sort_order,
							"onUpdate:modelValue": a[8] ||= (e) => J.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: q.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[33] ||= T("h3", null, "发布设置", -1),
					D(R(e), {
						label: "启用状态",
						prop: "is_enabled",
						error: Q.value.is_enabled
					}, {
						default: H(() => [D(R(o), {
							modelValue: J.is_enabled,
							"onUpdate:modelValue": a[9] ||= (e) => J.is_enabled = e,
							disabled: q.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "计划发布时间",
						prop: "scheduled_local",
						error: Q.value.scheduled_local
					}, {
						default: H(() => [D(R(v), {
							modelValue: J.scheduled_local,
							"onUpdate:modelValue": a[10] ||= (e) => J.scheduled_local = e,
							type: "datetime-local",
							disabled: q.value || !W.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])]), T("main", At, [D(R(ie), {
				model: J,
				rules: R(Z),
				"label-position": "top",
				onSubmit: a[15] ||= fe(() => {}, ["prevent"])
			}, {
				default: H(() => [
					D(R(e), {
						label: "标题",
						prop: "title",
						error: Q.value.title,
						required: ""
					}, {
						default: H(() => [D(R(v), {
							modelValue: J.title,
							"onUpdate:modelValue": a[12] ||= (e) => J.title = e,
							maxlength: 255,
							disabled: q.value,
							placeholder: "输入课程标题",
							"aria-label": "课程标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "摘要",
						prop: "summary",
						error: Q.value.summary
					}, {
						default: H(() => [U(T("textarea", {
							"onUpdate:modelValue": a[13] ||= (e) => J.summary = e,
							class: "course-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: q.value,
							"aria-invalid": !!Q.value.summary,
							"aria-label": "课程摘要"
						}, null, 8, jt), [[ue, J.summary]])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "正文",
						prop: "body_html",
						error: Q.value.body_html
					}, {
						default: H(() => [D(R(r), {
							modelValue: J.body_html,
							"onUpdate:modelValue": a[14] ||= (e) => J.body_html = e,
							readonly: K.value,
							disabled: b.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "课程正文"
						}, {
							"image-upload": H(({ url: e, setUrl: t, setBusy: n }) => [D(Be, {
								label: "正文图片",
								"model-value": e,
								upload: R(te),
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
			D(R(u), {
				modelValue: A.value,
				"onUpdate:modelValue": a[19] ||= (e) => A.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1,
				onOpened: $
			}, {
				footer: H(() => [D(R(n), {
					variant: "primary",
					onClick: a[18] ||= (e) => A.value = !1
				}, {
					default: H(() => [...a[34] ||= [E("确定", -1)]]),
					_: 1
				})]),
				default: H(() => [D(R(ie), {
					model: J,
					rules: R(Z),
					"label-position": "top",
					onSubmit: a[17] ||= fe(() => {}, ["prevent"])
				}, {
					default: H(() => [D(R(e), {
						label: "SEO 描述",
						prop: "seo_description",
						error: Q.value.seo_description
					}, {
						default: H(() => [U(T("textarea", {
							ref_key: "seoInput",
							ref: Y,
							"onUpdate:modelValue": a[16] ||= (e) => J.seo_description = e,
							class: "course-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: q.value,
							"aria-invalid": !!Q.value.seo_description,
							"aria-label": "SEO 描述"
						}, null, 8, Mt), [[ue, J.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			D(R(u), {
				modelValue: B.value,
				"onUpdate:modelValue": a[21] ||= (e) => B.value = e,
				title: "确认删除",
				subtitle: `操作对象：${J.title || "未命名课程"}`,
				width: "460px",
				"panel-class": "course-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !b.value
			}, {
				"header-actions": H(() => [T("span", Nt, [D(R(g), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: H(() => [D(R(n), {
					disabled: b.value,
					onClick: a[20] ||= (e) => B.value = !1
				}, {
					default: H(() => [...a[35] ||= [E("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), D(R(n), {
					variant: "warning",
					loading: b.value,
					onClick: Pe
				}, {
					default: H(() => [...a[36] ||= [E("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: H(() => [D(R(m), {
					class: "course-delete-dialog__notice",
					type: "warning",
					closable: !1,
					"show-icon": !1,
					description: "确定删除这门课程吗？删除后将不再展示，请谨慎操作。"
				}), de.value ? (j(), S(R(m), {
					key: 0,
					type: "error",
					closable: !1,
					description: de.value
				}, null, 8, ["description"])) : C("", !0)]),
				_: 1
			}, 8, [
				"modelValue",
				"subtitle",
				"before-close"
			]),
			D(R(u), {
				modelValue: oe.value,
				"onUpdate:modelValue": a[24] ||= (e) => oe.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: H(() => [D(R(n), { onClick: a[22] ||= (e) => oe.value = !1 }, {
					default: H(() => [...a[37] ||= [E("继续编辑", -1)]]),
					_: 1
				}), D(R(n), {
					variant: "primary",
					onClick: a[23] ||= (e) => _("close")
				}, {
					default: H(() => [...a[38] ||= [E("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			D(R(u), {
				modelValue: M.value,
				"onUpdate:modelValue": a[26] ||= (e) => M.value = e,
				title: "将课程转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: H(() => [D(R(n), { onClick: a[25] ||= (e) => M.value = !1 }, {
					default: H(() => [...a[39] ||= [E("取消", -1)]]),
					_: 1
				}), D(R(n), {
					variant: "primary",
					onClick: je
				}, {
					default: H(() => [...a[40] ||= [E("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, yt));
	}
}), [["__scopeId", "data-v-5c9105db"]]), Ft = { class: "academy-courses" }, It = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = pe(), { formatDateTime: r } = pe(), { academyDifficulties: a, academyPublishStates: o, getAcademyList: s, getAcademyMetadata: l } = at(), u = N(!1), d = N(), f = (e) => t([`cms_academy:${e}`]), p = N(), te = q(l, (e) => {
			p.value = e;
		}), m = [
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
		], { proTableBindings: ne, reload: re, filters: ie } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: x(() => [
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
					}, ...(p.value?.categories || []).map((e) => ({
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
			]),
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
		});
		te.bindFilters(ie);
		let h = new AbortController();
		async function _() {
			try {
				p.value = await l(h.signal);
			} catch {}
		}
		function v(e) {
			d.value = e, u.value = !0;
		}
		function y() {
			u.value = !1, re(), _();
		}
		return ce(_), se(() => h.abort()), (e, t) => (j(), w("div", Ft, [u.value ? (j(), S(Pt, {
			key: 0,
			"course-id": d.value,
			onClose: t[0] ||= (e) => u.value = !1,
			onSaved: y
		}, null, 8, ["course-id"])) : C("", !0), U(D(R(c), A(R(ne), {
			"auto-refreshable": !1,
			columns: m,
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
			"cell-cms_source_type": H(({ row: e }) => [D(J, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": H(() => [f("add") ? (j(), S(R(n), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => v()
			}, {
				icon: H(() => [D(R(g), {
					name: "plus",
					size: 14
				})]),
				default: H(() => [t[2] ||= E("新增课程", -1)]),
				_: 1
			})) : C("", !0)]),
			"cell-publish_status": H(({ row: e }) => [D(R(ee), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: H(() => [E(L(R(o).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": H(({ row: e }) => [D(R(ee), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: H(() => [E(L(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": H(({ row: e }) => [E(L(R(r)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": H(({ row: e }) => [D(R(n), {
				size: "sm",
				"icon-only": "",
				title: f("edit") ? "编辑课程" : "课程详情",
				"aria-label": f("edit") ? "编辑课程" : "课程详情",
				onClick: (t) => v(e.id)
			}, {
				default: H(() => [D(R(g), {
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
		}, 16), [[B, !u.value]])]));
	}
}), [["__scopeId", "data-v-0a52bb25"]]);
//#endregion
//#region src/cms/api/content/help.ts
function Lt() {
	let e = pe().request, t = "/cms/help", n = (n, r = {}) => e.get({
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
	}, { isOpenRetry: !1 }), s = l(e, "/cms/help/upload"), c = [
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
		uploadHelpCover: s,
		helpPublishStates: c,
		helpCategoryLabel: u,
		helpError: d
	};
}
//#endregion
//#region src/cms/views/content/help/EnabledToggle.vue?vue&type=script&setup=true&lang.ts
var Rt = ["aria-checked", "disabled"], zt = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "EnabledToggle",
	props: {
		modelValue: { type: Boolean },
		disabled: { type: Boolean }
	},
	emits: ["update:modelValue"],
	setup(e) {
		return (t, n) => (j(), w("button", {
			type: "button",
			role: "switch",
			class: oe(["help-toggle", { "is-on": e.modelValue }]),
			"aria-checked": e.modelValue,
			"aria-label": "启用状态",
			disabled: e.disabled,
			onClick: n[0] ||= (n) => t.$emit("update:modelValue", !e.modelValue)
		}, [n[1] ||= T("span", {
			class: "help-toggle__track",
			"aria-hidden": "true"
		}, [T("span")], -1), T("span", null, L(e.modelValue ? "已启用" : "已停用"), 1)], 10, Rt));
	}
}), [["__scopeId", "data-v-5cfe8693"]]), Bt = { class: "help-categories" }, Vt = ["aria-busy"], Ht = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Ut = { class: "taxonomy-editor__field" }, Wt = { class: "taxonomy-editor__field" }, Gt = { class: "taxonomy-editor__icon-control" }, Kt = ["title"], qt = ["aria-label"], Jt = { key: 1 }, Yt = {
	key: 0,
	class: "help-hint"
}, Xt = { class: "taxonomy-editor__row" }, Zt = "分类", Qt = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "index",
	setup(r) {
		let { helpError: a, deleteHelp: o, getHelpMetadata: s, getHelpList: l, getHelpDetail: d, saveHelp: p } = Lt(), { hasPermission: te } = pe(), { formatDateTime: h } = pe(), y = (e) => te([`cms_help_category:${e}`]), b = N(), O = N(), k = q(s, (e) => {
			b.value = e;
		}), ae = [
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
				key: "parent_id",
				dataIndex: "parent_id",
				title: "父分类",
				width: 180,
				formatter: (e) => b.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
		], { proTableBindings: oe, reload: M, filters: P } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: x(() => [
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
					}, ...(b.value?.categories || []).filter((e) => !e.parent_id).map((e) => ({
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
			]),
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), a = await l("categories", {
					...i,
					page_no: t,
					page_size: n
				}, r);
				return {
					rows: a.lists,
					total: a.count
				};
			}
		});
		k.bindFilters(P);
		let F = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			icon_key: "",
			sort_order: 10,
			is_enabled: !0
		}), I = le(F()), z = [..._], ue = new Set(z), B = x(() => ue.has(I.icon_key) ? I.icon_key : void 0), V = N(!1), U = N(!1), de = N(!1), W = N(!1), me = N(!1), G = N(""), he = N(!1), Y = N(""), ge = x(() => !y(I.id ? "edit" : "add")), X = x(() => de.value || W.value), _e;
		async function ve(e) {
			_e?.abort(), _e = new AbortController();
			let t = _e;
			Object.assign(I, F(), { id: e || "" }), Y.value = "", me.value = !1, G.value = "", he.value = !1, V.value = !0, U.value = !0;
			try {
				if (O.value = await s(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await d("categories", e, t.signal);
				if (O.value = await s(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(I, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					icon_key: n.icon_key || "",
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				});
			} catch (e) {
				t.signal.aborted || (he.value = !0, Y.value = a(e));
			} finally {
				t.signal.aborted || (U.value = !1);
			}
		}
		function Z() {
			return X.value ? !1 : (_e?.abort(), !0);
		}
		function ye() {
			Z() && (V.value = !1);
		}
		async function Q() {
			if (!(ge.value || X.value || U.value || he.value)) {
				if (!I.name.trim() || I.sort_order === null) {
					Y.value = "请填写分类名称和排序";
					return;
				}
				if (I.icon_key.length > 128) {
					Y.value = "图标标识最多 128 个字符";
					return;
				}
				de.value = !0, Y.value = "";
				try {
					await p("categories", {
						name: I.name,
						parent_id: I.parent_id || null,
						icon_key: I.icon_key || null,
						sort_order: I.sort_order,
						is_enabled: I.is_enabled,
						id: I.id || void 0,
						row_version: I.id ? I.row_version : void 0
					}), V.value = !1, f.success("保存成功"), await Promise.all([M(), Ce()]);
				} catch (e) {
					Y.value = a(e);
				} finally {
					de.value = !1;
				}
			}
		}
		function be() {
			!I.id || !y("delete") || X.value || U.value || he.value || (G.value = "", me.value = !0);
		}
		async function $() {
			if (!(!me.value || !I.id || !y("delete") || X.value || U.value || he.value)) {
				W.value = !0, G.value = "";
				try {
					await o("categories", I.id, I.row_version), me.value = !1, V.value = !1, f.success("分类已删除"), await Promise.all([M(), Ce()]);
				} catch (e) {
					G.value = a(e);
				} finally {
					W.value = !1;
				}
			}
		}
		let xe = x(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(O.value?.categories || []).filter((e) => !e.parent_id && e.id !== I.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Se = new AbortController();
		async function Ce() {
			try {
				b.value = await s(Se.signal);
			} catch {}
		}
		return ce(Ce), se(() => {
			_e?.abort(), Se.abort();
		}), (r, i) => (j(), w("div", Bt, [
			D(R(c), A(R(oe), {
				"auto-refreshable": !1,
				columns: ae,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Zt}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": H(({ row: e }) => [D(J, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": H(() => [y("add") ? (j(), S(R(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: i[0] ||= (e) => ve()
				}, {
					icon: H(() => [D(R(g), {
						name: "plus",
						size: 14
					})]),
					default: H(() => [E("新增" + L(Zt))]),
					_: 1
				})) : C("", !0)]),
				"cell-is_enabled": H(({ row: e }) => [D(R(ee), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: H(() => [E(L(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": H(({ row: e }) => [D(R(n), {
					size: "sm",
					"icon-only": "",
					title: y("edit") ? `编辑${Zt}` : `${Zt}详情`,
					"aria-label": `编辑${Zt}`,
					onClick: (t) => ve(e.id)
				}, {
					default: H(() => [D(R(g), {
						name: y("edit") ? "square-pen" : "panel-right-open",
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
			D(R(u), {
				modelValue: V.value,
				"onUpdate:modelValue": i[6] ||= (e) => V.value = e,
				title: `${I.id ? "编辑" : "新增"}帮助${Zt}`,
				width: "680px",
				subtitle: "帮助分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Z
			}, {
				footer: H(() => [
					I.id && y("delete") ? (j(), S(R(n), {
						key: 0,
						variant: "danger",
						disabled: U.value || he.value || X.value,
						onClick: be
					}, {
						icon: H(() => [D(R(g), {
							name: "trash-2",
							size: 14
						})]),
						default: H(() => [i[11] ||= E("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : C("", !0),
					D(R(n), {
						disabled: X.value,
						onClick: ye
					}, {
						default: H(() => [...i[12] ||= [E("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					ge.value ? C("", !0) : (j(), S(R(n), {
						key: 1,
						variant: "primary",
						loading: de.value,
						disabled: U.value || he.value || W.value,
						onClick: Q
					}, {
						default: H(() => [E("保存" + L(Zt))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: H(() => [T("div", {
					class: "taxonomy-editor",
					"aria-busy": U.value
				}, [
					U.value ? (j(), w("div", Ht, [D(R(g), {
						name: "loader-circle",
						class: "help-spin",
						size: 24
					}), T("span", null, "正在读取" + L(Zt) + "...")])) : C("", !0),
					Y.value ? (j(), S(R(m), {
						key: 1,
						type: "error",
						closable: !1,
						description: Y.value
					}, null, 8, ["description"])) : C("", !0),
					!U.value && !he.value ? (j(), S(R(ie), {
						key: 2,
						model: I,
						"label-position": "top",
						onSubmit: fe(Q, ["prevent"])
					}, {
						default: H(() => [
							I.id ? (j(), S(R(e), {
								key: 0,
								label: "分类ID"
							}, {
								default: H(() => [D(R(v), {
									"model-value": I.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : C("", !0),
							D(R(e), {
								label: `${Zt}名称`,
								required: ""
							}, {
								default: H(() => [D(R(v), {
									modelValue: I.name,
									"onUpdate:modelValue": i[1] ||= (e) => I.name = e,
									maxlength: 120,
									disabled: ge.value || X.value,
									"aria-label": `${Zt}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							D(R(e), { label: "父分类" }, {
								default: H(() => [T("div", Ut, [D(R(re), {
									modelValue: I.parent_id,
									"onUpdate:modelValue": i[2] ||= (e) => I.parent_id = e,
									options: xe.value,
									disabled: ge.value || X.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), i[9] ||= T("p", { class: "help-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类文章。 ", -1)])]),
								_: 1
							}),
							D(R(e), { label: "图标标识" }, {
								default: H(() => [T("div", Wt, [
									T("div", Gt, [D(R(t), {
										modelValue: I.icon_key,
										"onUpdate:modelValue": i[3] ||= (e) => I.icon_key = e,
										suggestions: z,
										"min-length": 0,
										disabled: ge.value || X.value,
										clearable: "",
										placeholder: "输入或下拉选择 6mm 图标，例如 circle-help"
									}, {
										option: H(({ option: e }) => [T("span", {
											class: "taxonomy-editor__icon-option",
											title: String(e)
										}, [D(R(g), {
											name: String(e),
											size: 18
										}, null, 8, ["name"]), T("span", null, L(e), 1)], 8, Kt)]),
										_: 1
									}, 8, ["modelValue", "disabled"]), T("span", {
										class: "taxonomy-editor__icon-preview",
										role: "img",
										"aria-label": B.value ? `图标预览：${B.value}` : "暂无图标预览"
									}, [B.value ? (j(), S(R(g), {
										key: 0,
										name: B.value,
										size: 20
									}, null, 8, ["name"])) : (j(), w("span", Jt, "—"))], 8, qt)]),
									i[10] ||= T("p", { class: "help-hint" }, " 支持直接输入名称或从下拉列表选择；不填写 SVG 或 HTML。 ", -1),
									I.icon_key && !B.value ? (j(), w("p", Yt, " 当前名称不在已安装的 6mm 图标库中，暂无法预览。 ")) : C("", !0)
								])]),
								_: 1
							}),
							T("div", Xt, [D(R(e), {
								label: "前端排序",
								required: ""
							}, {
								default: H(() => [D(R(ne), {
									modelValue: I.sort_order,
									"onUpdate:modelValue": i[4] ||= (e) => I.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: ge.value || X.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), D(R(e), { label: "启用状态" }, {
								default: H(() => [D(zt, {
									modelValue: I.is_enabled,
									"onUpdate:modelValue": i[5] ||= (e) => I.is_enabled = e,
									disabled: ge.value || X.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : C("", !0)
				], 8, Vt)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			D(R(u), {
				modelValue: me.value,
				"onUpdate:modelValue": i[8] ||= (e) => me.value = e,
				title: "删除帮助分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !W.value
			}, {
				footer: H(() => [D(R(n), {
					disabled: W.value,
					onClick: i[7] ||= (e) => me.value = !1
				}, {
					default: H(() => [...i[13] ||= [E("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), D(R(n), {
					variant: "danger",
					loading: W.value,
					onClick: $
				}, {
					default: H(() => [...i[14] ||= [E("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: H(() => [T("p", null, "确认删除分类“" + L(I.name) + "”？有关联文章或子分类的分类无法删除。", 1), G.value ? (j(), S(R(m), {
					key: 0,
					type: "error",
					closable: !1,
					description: G.value
				}, null, 8, ["description"])) : C("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"])
		]));
	}
}), [["__scopeId", "data-v-d876a44a"]]), $t = ["aria-busy"], en = { class: "article-editor__header" }, tn = { class: "article-editor__heading" }, nn = { class: "article-editor__commands" }, rn = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, an = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, on = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, sn = {
	key: 1,
	class: "article-editor__failure"
}, cn = {
	key: 0,
	class: "article-editor__error"
}, ln = { class: "article-editor__body" }, un = { class: "article-editor__settings" }, dn = { class: "article-editor__related" }, fn = { class: "article-editor__content" }, pn = ["aria-invalid", "disabled"], mn = ["aria-invalid", "disabled"], hn = {
	class: "help-delete-dialog__icon",
	"aria-hidden": "true"
}, gn = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: i }) {
		let { helpError: a, helpCategoryLabel: o, deleteHelp: s, getHelpDetail: c, getHelpMetadata: l, getHelpList: d, saveHelp: ee, uploadHelpCover: p } = Lt(), { hasPermission: te } = pe(), h = t, _ = i, y = N(!0), O = N(!1), k = N(!1), A = N(""), ae = N(!1), oe = N(!1), M = N(!1), P = N(!1), F = N(pe().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), I = N(), z = N("draft"), B = N(!1), V = x(() => te(["cms_help:publish"])), W = x(() => !te([`cms_help:${h.articleId ? "edit" : "add"}`]) || !V.value && z.value !== "draft"), G = x(() => te(["cms_help:delete"]) && (V.value || z.value === "draft"));
		async function K() {
			if (!(!G.value || O.value || y.value || k.value)) {
				O.value = !0, A.value = "";
				try {
					await s("articles", J.id, J.row_version), De = JSON.stringify(J), f.success("文章已删除"), _("saved");
				} catch (e) {
					A.value = a(e), P.value = !1;
				} finally {
					O.value = !1;
				}
			}
		}
		let q = x(() => W.value || O.value), J = le({
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
		}), { editorRoot: he, seoInput: Y, fieldRules: ge, fieldErrors: X, pendingCount: _e, saveError: ve, validateSave: Z, setSaveFailure: ye, focusFirstError: Q, focusSeoError: be } = we(J, () => I.value?.categories || [], "help", ae), $ = N(""), xe = N(!1), Se = N([]), Ce = x(() => Se.value.filter((e) => e.id !== h.articleId).map((e) => ({
			label: `${e.title} · ${e.code}`,
			value: e.id
		})));
		async function Te() {
			if (!(q.value || xe.value)) {
				xe.value = !0;
				try {
					let e = await d("articles", {
						keyword: $.value,
						page_size: 100
					}, Oe?.signal), t = Se.value.filter((e) => J.related_content_ids.includes(e.id));
					Se.value = [...new Map([...t, ...e.lists].map((e) => [e.id, e])).values()];
				} catch (e) {
					Oe?.signal.aborted || (A.value = a(e));
				} finally {
					xe.value = !1;
				}
			}
		}
		let Ee = x(() => (I.value?.categories || []).map((e) => ({
			label: o(I.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), De = "", Oe;
		function ke(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Ae() {
			Oe?.abort(), Oe = new AbortController();
			let e = Oe;
			y.value = !0, k.value = !1, A.value = "";
			try {
				if (I.value = await l(e.signal, { cms_source_type: "platform" }), h.articleId) {
					let t = await c("articles", h.articleId, e.signal);
					if (I.value = await l(e.signal, { space_id: String(t.space_id) }), F.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"sort_order",
						"is_enabled"
					]) Object.assign(J, { [e]: t[e] });
					J.category_id = t.category_id || "", J.search_keywords = t.search_keywords || "", J.helpful_enabled = t.helpful_enabled ?? !0, J.related_content_ids = t.related_content_ids || [], Se.value = t.related_articles || [];
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url",
						"content_source",
						"author_name"
					]) J[e] = t[e] || "";
					J.scheduled_local = t.publish_status === "scheduled" ? ke(t.scheduled_at) : "", z.value = t.publish_status;
				}
				De = JSON.stringify(J);
			} catch (t) {
				e.signal.aborted || (A.value = a(t), k.value = !0);
			} finally {
				e.signal.aborted || (y.value = !1);
			}
		}
		let je = () => !y.value && !k.value && De !== JSON.stringify(J);
		function Me() {
			je() ? oe.value = !0 : _("close");
		}
		function Ne() {
			z.value === "draft" ? Fe("draft") : M.value = !0;
		}
		function Pe() {
			M.value = !1, Fe("draft");
		}
		async function Fe(e) {
			if (q.value || y.value || k.value || B.value || (A.value = "", !await Z(e))) return;
			let t = J.scheduled_local ? new Date(J.scheduled_local) : null;
			O.value = !0, A.value = "";
			try {
				await ee("articles", {
					...J,
					id: J.id || void 0,
					row_version: J.id ? J.row_version : void 0,
					category_id: J.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), De = JSON.stringify(J), f.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "文章已发布"), _("saved");
			} catch (e) {
				ye(e);
			} finally {
				O.value = !1;
			}
			_e.value && await Q();
		}
		function Ie(e) {
			A.value = a(e);
		}
		let Le = (e) => {
			je() && (e.preventDefault(), e.returnValue = "");
		};
		return me(() => !O.value && !B.value && (!je() || window.confirm("文章有未保存的修改，确定离开？"))), ce(() => {
			Ae(), window.addEventListener("beforeunload", Le);
		}), se(() => {
			Oe?.abort(), window.removeEventListener("beforeunload", Le);
		}), (i, a) => (j(), w("section", {
			ref_key: "editorRoot",
			ref: he,
			class: "article-editor",
			"aria-busy": y.value || O.value
		}, [
			T("header", en, [
				D(R(n), {
					"icon-only": "",
					title: "返回文章列表",
					"aria-label": "返回文章列表",
					disabled: O.value || B.value,
					onClick: Me
				}, {
					default: H(() => [D(R(g), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				T("div", tn, [T("h2", null, L(t.articleId ? "编辑文章" : "新增文章"), 1), T("span", null, L(I.value?.source_locale || "zh-CN") + " · " + L(F.value), 1)]),
				T("div", nn, [
					t.articleId && G.value ? (j(), S(R(n), {
						key: 0,
						size: "sm",
						disabled: y.value || k.value || O.value || B.value,
						onClick: a[0] ||= (e) => P.value = !0
					}, {
						default: H(() => [...a[32] ||= [E("删除文章", -1)]]),
						_: 1
					}, 8, ["disabled"])) : C("", !0),
					D(R(n), {
						size: "sm",
						disabled: y.value || k.value,
						onClick: a[1] ||= (e) => ae.value = !0
					}, {
						icon: H(() => [D(R(g), {
							name: "search",
							size: 14
						})]),
						default: H(() => [a[33] ||= E("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					W.value ? C("", !0) : (j(), S(R(n), {
						key: 1,
						size: "sm",
						disabled: y.value || k.value || O.value || B.value,
						onClick: Ne
					}, {
						icon: H(() => [D(R(g), {
							name: "save",
							size: 14
						})]),
						default: H(() => [a[34] ||= E("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					R(ve) ? (j(), w("span", rn, L(R(ve)), 1)) : C("", !0),
					!W.value && R(_e) ? (j(), w("span", an, "还有 " + L(R(_e)) + " 项待完善", 1)) : C("", !0),
					!W.value && V.value ? (j(), S(R(n), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: y.value || k.value || B.value,
						loading: O.value,
						onClick: a[2] ||= (e) => Fe(J.scheduled_local ? "scheduled" : "published")
					}, {
						icon: H(() => [D(R(g), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: H(() => [E(L(J.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : C("", !0)
				])
			]),
			y.value ? (j(), w("div", on, [D(R(g), {
				name: "loader-circle",
				class: "help-spin",
				size: 28
			}), a[35] ||= T("span", null, "正在读取文章资料...", -1)])) : k.value ? (j(), w("div", sn, [D(R(m), {
				type: "error",
				description: A.value,
				closable: !1
			}, null, 8, ["description"]), D(R(n), { onClick: Ae }, {
				default: H(() => [...a[36] ||= [E("重新加载", -1)]]),
				_: 1
			})])) : (j(), w(b, { key: 2 }, [A.value ? (j(), w("div", cn, [D(R(m), {
				type: "error",
				description: A.value,
				closable: !1
			}, null, 8, ["description"])])) : C("", !0), T("div", ln, [T("aside", un, [D(R(ie), {
				model: J,
				rules: R(ge),
				"label-position": "top",
				onSubmit: a[16] ||= fe(() => {}, ["prevent"])
			}, {
				default: H(() => [
					D(R(e), {
						label: "文章分类",
						prop: "category_id",
						error: R(X).category_id,
						required: ""
					}, {
						default: H(() => [D(R(re), {
							modelValue: J.category_id,
							"onUpdate:modelValue": a[3] ||= (e) => J.category_id = e,
							options: Ee.value,
							clearable: "",
							disabled: q.value,
							"aria-label": "文章分类"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					a[39] ||= T("h3", null, "文章设置", -1),
					D(R(e), {
						label: "文章封面",
						prop: "cover_url",
						error: R(X).cover_url
					}, {
						default: H(() => [D(Be, {
							modelValue: J.cover_url,
							"onUpdate:modelValue": a[4] ||= (e) => J.cover_url = e,
							label: "文章封面",
							disabled: q.value,
							upload: R(p),
							onBusyChange: a[5] ||= (e) => B.value = e,
							onStart: a[6] ||= (e) => A.value = "",
							onError: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "内容来源",
						prop: "content_source",
						error: R(X).content_source
					}, {
						default: H(() => [D(R(v), {
							modelValue: J.content_source,
							"onUpdate:modelValue": a[7] ||= (e) => J.content_source = e,
							maxlength: 160,
							disabled: q.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "作者署名",
						prop: "author_name",
						error: R(X).author_name
					}, {
						default: H(() => [D(R(v), {
							modelValue: J.author_name,
							"onUpdate:modelValue": a[8] ||= (e) => J.author_name = e,
							maxlength: 120,
							disabled: q.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "前端排序",
						prop: "sort_order",
						error: R(X).sort_order
					}, {
						default: H(() => [D(R(ne), {
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
					a[40] ||= T("h3", null, "发布设置", -1),
					D(R(e), {
						label: "搜索关键词",
						prop: "search_keywords",
						error: R(X).search_keywords
					}, {
						default: H(() => [D(R(v), {
							modelValue: J.search_keywords,
							"onUpdate:modelValue": a[10] ||= (e) => J.search_keywords = e,
							maxlength: 2e3,
							disabled: q.value,
							placeholder: "使用空格或逗号分隔",
							"aria-label": "搜索关键词"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: R(X).helpful_enabled
					}, {
						default: H(() => [D(zt, {
							modelValue: J.helpful_enabled,
							"onUpdate:modelValue": a[11] ||= (e) => J.helpful_enabled = e,
							disabled: q.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "相关文章",
						prop: "related_content_ids",
						error: R(X).related_content_ids
					}, {
						default: H(() => [T("div", dn, [
							D(R(v), {
								modelValue: $.value,
								"onUpdate:modelValue": a[12] ||= (e) => $.value = e,
								disabled: q.value,
								placeholder: "搜索文章标题",
								"aria-label": "搜索相关文章",
								onKeydown: de(fe(Te, ["prevent"]), ["enter"])
							}, null, 8, [
								"modelValue",
								"disabled",
								"onKeydown"
							]),
							D(R(n), {
								size: "sm",
								disabled: q.value,
								loading: xe.value,
								onClick: Te
							}, {
								default: H(() => [...a[37] ||= [E("查找文章", -1)]]),
								_: 1
							}, 8, ["disabled", "loading"]),
							D(R(re), {
								modelValue: J.related_content_ids,
								"onUpdate:modelValue": a[13] ||= (e) => J.related_content_ids = e,
								options: Ce.value,
								multiple: "",
								clearable: "",
								disabled: q.value,
								"aria-label": "相关文章"
							}, null, 8, [
								"modelValue",
								"options",
								"disabled"
							]),
							a[38] ||= T("p", { class: "article-editor__hint" }, " 最多 20 篇，按选择顺序展示。可关联草稿，前台须按发布状态过滤。 ", -1)
						])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "启用状态",
						prop: "is_enabled",
						error: R(X).is_enabled
					}, {
						default: H(() => [D(zt, {
							modelValue: J.is_enabled,
							"onUpdate:modelValue": a[14] ||= (e) => J.is_enabled = e,
							disabled: q.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: R(X).scheduled_local
					}, {
						default: H(() => [D(R(v), {
							modelValue: J.scheduled_local,
							"onUpdate:modelValue": a[15] ||= (e) => J.scheduled_local = e,
							type: "datetime-local",
							disabled: q.value || !V.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[41] ||= T("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), T("main", fn, [D(R(ie), {
				model: J,
				rules: R(ge),
				"label-position": "top",
				onSubmit: a[20] ||= fe(() => {}, ["prevent"])
			}, {
				default: H(() => [
					D(R(e), {
						label: "标题",
						prop: "title",
						error: R(X).title,
						required: ""
					}, {
						default: H(() => [D(R(v), {
							modelValue: J.title,
							"onUpdate:modelValue": a[17] ||= (e) => J.title = e,
							maxlength: 255,
							disabled: q.value,
							placeholder: "输入文章标题",
							"aria-label": "文章标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "摘要",
						prop: "summary",
						error: R(X).summary
					}, {
						default: H(() => [U(T("textarea", {
							"onUpdate:modelValue": a[18] ||= (e) => J.summary = e,
							"aria-invalid": !!R(X).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: q.value,
							"aria-label": "文章摘要"
						}, null, 8, pn), [[ue, J.summary]])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "正文",
						prop: "body_html",
						error: R(X).body_html
					}, {
						default: H(() => [D(R(r), {
							modelValue: J.body_html,
							"onUpdate:modelValue": a[19] ||= (e) => J.body_html = e,
							readonly: W.value,
							disabled: O.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "文章正文"
						}, {
							"image-upload": H(({ url: e, setUrl: t, setBusy: n }) => [D(Be, {
								label: "正文图片",
								"model-value": e,
								upload: R(p),
								"onUpdate:modelValue": t,
								onBusyChange: n,
								onError: Ie
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
			D(R(u), {
				modelValue: ae.value,
				"onUpdate:modelValue": a[24] ||= (e) => ae.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: H(() => [D(R(n), {
					variant: "primary",
					onClick: a[23] ||= (e) => ae.value = !1
				}, {
					default: H(() => [...a[42] ||= [E("确定", -1)]]),
					_: 1
				})]),
				default: H(() => [D(R(ie), {
					model: J,
					rules: R(ge),
					"label-position": "top",
					onSubmit: a[22] ||= fe(() => {}, ["prevent"])
				}, {
					default: H(() => [D(R(e), {
						label: "SEO 描述",
						prop: "seo_description",
						error: R(X).seo_description
					}, {
						default: H(() => [U(T("textarea", {
							ref_key: "seoInput",
							ref: Y,
							"onUpdate:modelValue": a[21] ||= (e) => J.seo_description = e,
							"aria-invalid": !!R(X).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: q.value,
							"aria-label": "SEO 描述"
						}, null, 8, mn), [[ue, J.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			D(R(u), {
				modelValue: P.value,
				"onUpdate:modelValue": a[26] ||= (e) => P.value = e,
				title: "确认删除",
				subtitle: `操作对象：${J.title || "未命名文章"}`,
				width: "460px",
				"panel-class": "help-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !O.value
			}, {
				"header-actions": H(() => [T("span", hn, [D(R(g), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: H(() => [D(R(n), {
					disabled: O.value,
					onClick: a[25] ||= (e) => P.value = !1
				}, {
					default: H(() => [...a[43] ||= [E("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), D(R(n), {
					variant: "warning",
					loading: O.value,
					onClick: K
				}, {
					default: H(() => [...a[44] ||= [E("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: H(() => [D(R(m), {
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
			D(R(u), {
				modelValue: oe.value,
				"onUpdate:modelValue": a[29] ||= (e) => oe.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: H(() => [D(R(n), { onClick: a[27] ||= (e) => oe.value = !1 }, {
					default: H(() => [...a[45] ||= [E("继续编辑", -1)]]),
					_: 1
				}), D(R(n), {
					variant: "primary",
					onClick: a[28] ||= (e) => _("close")
				}, {
					default: H(() => [...a[46] ||= [E("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			D(R(u), {
				modelValue: M.value,
				"onUpdate:modelValue": a[31] ||= (e) => M.value = e,
				title: "将文章转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: H(() => [D(R(n), { onClick: a[30] ||= (e) => M.value = !1 }, {
					default: H(() => [...a[47] ||= [E("取消", -1)]]),
					_: 1
				}), D(R(n), {
					variant: "primary",
					onClick: Pe
				}, {
					default: H(() => [...a[48] ||= [E("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, $t));
	}
}), [["__scopeId", "data-v-c0c3d256"]]), _n = { class: "help-articles" }, vn = {
	key: 0,
	class: "help-statistics-note"
}, yn = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "index",
	setup(e) {
		let t = pe(), { helpPublishStates: r, helpCategoryLabel: a, getHelpList: o, getHelpMetadata: s } = Lt(), { hasPermission: l } = pe(), { formatDateTime: u } = pe(), d = N(!1), f = N(), p = (e) => l([`cms_help:${e}`]), te = N(), m = q(s, (e) => {
			te.value = e;
		}), ne = [
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
				formatter: (e) => a(te.value, e)
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
		], { proTableBindings: re, reload: ie, filters: h } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: x(() => [
				...m.fields,
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
						label: a(te.value, e.id),
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
			]),
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
		});
		m.bindFilters(h);
		let _ = new AbortController();
		async function v() {
			try {
				te.value = await s(_.signal);
			} catch {}
		}
		function y(e) {
			f.value = e, d.value = !0;
		}
		function b() {
			d.value = !1, ie(), v();
		}
		return ce(v), se(() => _.abort()), (e, i) => (j(), w("div", _n, [
			!d.value && R(t).mode === "platform" ? (j(), w("p", vn, " 当前管理平台默认模板。浏览量、评价数及有帮助率属于站点运行数据，此处显示“—”，不汇总白标站点。 ")) : C("", !0),
			d.value ? (j(), S(gn, {
				key: 1,
				"article-id": f.value,
				onClose: i[0] ||= (e) => d.value = !1,
				onSaved: b
			}, null, 8, ["article-id"])) : C("", !0),
			U(D(R(c), A(R(re), {
				"auto-refreshable": !1,
				columns: ne,
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
				"cell-cms_source_type": H(({ row: e }) => [D(J, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": H(() => [p("add") ? (j(), S(R(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: i[1] ||= (e) => y()
				}, {
					icon: H(() => [D(R(g), {
						name: "plus",
						size: 14
					})]),
					default: H(() => [i[2] ||= E("新增文章", -1)]),
					_: 1
				})) : C("", !0)]),
				"cell-publish_status": H(({ row: e }) => [D(R(ee), {
					size: "sm",
					effect: "soft",
					type: e.publish_status === "published" ? "success" : "warning"
				}, {
					default: H(() => [E(L(R(r).find((t) => t.value === e.publish_status)?.label), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-is_enabled": H(({ row: e }) => [D(R(ee), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: H(() => [E(L(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-publish_time": H(({ row: e }) => [E(L(R(u)(e.published_at || e.scheduled_at)), 1)]),
				"cell-actions": H(({ row: e }) => [D(R(n), {
					size: "sm",
					"icon-only": "",
					title: p("edit") ? "编辑文章" : "文章详情",
					"aria-label": p("edit") ? "编辑文章" : "文章详情",
					onClick: (t) => y(e.id)
				}, {
					default: H(() => [D(R(g), {
						name: p("edit") ? "square-pen" : "panel-right-open",
						size: 15
					}, null, 8, ["name"])]),
					_: 1
				}, 8, [
					"title",
					"aria-label",
					"onClick"
				])]),
				_: 1
			}, 16), [[B, !d.value]])
		]));
	}
}), [["__scopeId", "data-v-e3373337"]]);
//#endregion
//#region src/cms/api/content/feedback.ts
function bn() {
	let e = pe().request, t = "/cms/feedback", n = (n, r) => e.get({
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
var xn = { class: "feedback-page" }, Sn = ["aria-busy"], Cn = {
	key: 0,
	role: "status"
}, wn = { class: "feedback-info" }, Tn = { class: "feedback-content" }, En = {
	key: 0,
	class: "muted"
}, Dn = { class: "attachment-title" }, On = ["src", "alt"], kn = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "index",
	setup(e) {
		let { getFeedbackList: t, getFeedbackMetadata: r, getFeedbackDetail: a, getFeedbackAttachment: o, feedbackSourceTypes: s, feedbackSourceLabel: l, feedbackError: d } = bn(), { formatDateTime: f } = pe(), p = N({
			scenes: [],
			issues: []
		}), te = q(r, (e) => {
			p.value = e;
		}), ne = [
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
		], { proTableBindings: re, filters: ie } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: x(() => [
				...te.fields,
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
					}, ...p.value.scenes.map((e) => ({
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
					}, ...p.value.issues.map((e) => ({
						label: `${p.value.scenes.find((t) => t.id === e.scene_id)?.name || "—"} / ${e.name}`,
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
			]),
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
		});
		te.bindFilters(ie);
		let h = N(!1), _ = N(!1), v = N(""), y = N(), O = N({}), k = N(""), ae, oe = new AbortController();
		async function M(e) {
			ae?.abort();
			let t = new AbortController();
			ae = t, y.value = void 0, O.value = {}, v.value = "", k.value = "", h.value = !0, _.value = !0;
			try {
				let n = await a(e, t.signal);
				t.signal.aborted || (y.value = n);
			} catch (e) {
				t.signal.aborted || (v.value = d(e));
			} finally {
				t.signal.aborted || (_.value = !1);
			}
		}
		async function le(e) {
			let t = ae, n = y.value?.id;
			if (!(!t || !n || k.value)) {
				k.value = e, v.value = "";
				try {
					let r = await o(n, e, t.signal);
					!t.signal.aborted && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(r.data_url) && (O.value[e] = r.data_url);
				} catch (e) {
					t.signal.aborted || (v.value = d(e));
				} finally {
					t.signal.aborted || (k.value = "");
				}
			}
		}
		return V(h, (e) => {
			e || (ae?.abort(), y.value = void 0, O.value = {}, v.value = "");
		}), ce(async () => {
			try {
				p.value = await r(oe.signal);
			} catch {}
		}), se(() => {
			oe.abort(), ae?.abort();
		}), (e, t) => (j(), w("div", xn, [D(R(c), A(R(re), {
			"auto-refreshable": !1,
			columns: ne,
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
			"cell-cms_source_type": H(({ row: e }) => [D(J, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"cell-source_type": H(({ row: e }) => [D(R(ee), {
				size: "sm",
				effect: "soft",
				type: e.source_type === "merchant" ? "warning" : e.source_type === "platform" ? "success" : "primary"
			}, {
				default: H(() => [E(L(R(l)(e.source_type)), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-actions": H(({ row: e }) => [D(R(n), {
				size: "sm",
				"icon-only": "",
				title: "查看反馈",
				"aria-label": "查看反馈",
				onClick: (t) => M(e.id)
			}, {
				default: H(() => [D(R(g), {
					name: "eye",
					size: 15
				})]),
				_: 1
			}, 8, ["onClick"])]),
			_: 1
		}, 16), D(R(u), {
			modelValue: h.value,
			"onUpdate:modelValue": t[1] ||= (e) => h.value = e,
			title: "反馈详情",
			subtitle: y.value?.code || "查看用户正式提交的意见反馈",
			width: "760px",
			"close-on-click-modal": !1
		}, {
			footer: H(() => [D(R(n), { onClick: t[0] ||= (e) => h.value = !1 }, {
				default: H(() => [...t[14] ||= [E("关闭", -1)]]),
				_: 1
			})]),
			default: H(() => [T("div", {
				class: "feedback-detail",
				"aria-busy": _.value
			}, [
				_.value ? (j(), w("p", Cn, "正在读取反馈…")) : C("", !0),
				v.value ? (j(), S(R(m), {
					key: 1,
					type: "error",
					closable: !1,
					description: v.value
				}, null, 8, ["description"])) : C("", !0),
				y.value && !_.value ? (j(), w(b, { key: 2 }, [
					T("dl", wn, [
						T("div", null, [t[2] ||= T("dt", null, "UID", -1), T("dd", null, L(y.value.public_user_id_snapshot), 1)]),
						T("div", null, [t[3] ||= T("dt", null, "用户账号", -1), T("dd", null, L(y.value.username_snapshot || "—"), 1)]),
						T("div", null, [t[4] ||= T("dt", null, "来源类型", -1), T("dd", null, L(R(l)(y.value.source_type)), 1)]),
						T("div", null, [t[5] ||= T("dt", null, "来源名称", -1), T("dd", null, L(y.value.source_name_snapshot || "—"), 1)]),
						T("div", null, [t[6] ||= T("dt", null, "业务场景", -1), T("dd", null, L(y.value.scene_name_snapshot), 1)]),
						T("div", null, [t[7] ||= T("dt", null, "问题分类", -1), T("dd", null, L(y.value.issue_category_name_snapshot), 1)]),
						T("div", null, [t[8] ||= T("dt", null, "联系方式（脱敏）", -1), T("dd", null, L(y.value.contact_display), 1)]),
						T("div", null, [t[9] ||= T("dt", null, "提交时间", -1), T("dd", null, L(R(f)(y.value.submitted_at)), 1)])
					]),
					T("section", null, [t[10] ||= T("h3", null, "反馈内容", -1), T("div", Tn, L(y.value.content), 1)]),
					T("section", null, [
						T("h3", null, [t[11] ||= E(" 附件 ", -1), T("span", null, L(y.value.attachments?.length || 0), 1)]),
						y.value.attachments?.length ? C("", !0) : (j(), w("p", En, "暂无附件")),
						(j(!0), w(b, null, P(y.value.attachments, (e) => (j(), w("div", {
							key: e.id,
							class: "feedback-attachment"
						}, [T("div", Dn, [T("span", null, L(e.original_name || "图片附件") + " · " + L(Math.ceil(e.byte_size / 1024)) + " KB", 1), D(R(n), {
							size: "sm",
							loading: k.value === e.id,
							onClick: (t) => le(e.id)
						}, {
							default: H(() => [...t[12] ||= [E("查看图片", -1)]]),
							_: 1
						}, 8, ["loading", "onClick"])]), O.value[e.id] ? (j(), w("img", {
							key: 0,
							src: O.value[e.id],
							alt: e.original_name || "反馈图片"
						}, null, 8, On)) : C("", !0)]))), 128))
					]),
					t[13] ||= T("p", { class: "muted" }, "来源和分类为提交时快照；此页面仅查看，不修改用户原始反馈。", -1)
				], 64)) : C("", !0)
			], 8, Sn)]),
			_: 1
		}, 8, ["modelValue", "subtitle"])]));
	}
}), [["__scopeId", "data-v-ed508c88"]]);
//#endregion
//#region src/cms/api/content/announcement.ts
function An() {
	let e = pe().request, t = "/cms/announcement", n = (n, r = {}) => e.get({
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
	}, { isOpenRetry: !1 }), s = l(e, "/cms/announcement/upload"), c = [
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
		announcementPublishStates: c,
		announcementCategoryLabel: u,
		announcementError: d
	};
}
//#endregion
//#region src/cms/views/content/announcement/categories/index.vue?vue&type=script&setup=true&lang.ts
var jn = { class: "announcement-categories" }, Mn = ["aria-busy"], Nn = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Pn = { class: "taxonomy-editor__field" }, Fn = { class: "taxonomy-editor__row" }, In = "分类", Ln = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "index",
	setup(t) {
		let { hasPermission: r } = pe(), { formatDateTime: a } = pe(), { announcementError: o, deleteAnnouncement: s, getAnnouncementMetadata: l, getAnnouncementList: d, getAnnouncementDetail: p, saveAnnouncement: te } = An(), h = (e) => r([`cms_announcement_category:${e}`]), _ = N(), y = N(), b = q(l, (e) => {
			_.value = e;
		}), O = [
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
				key: "parent_id",
				dataIndex: "parent_id",
				title: "父分类",
				width: 180,
				formatter: (e) => _.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
		], { proTableBindings: k, reload: ae, filters: oe } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: [
				...b.fields,
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
			],
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), a = await d("categories", {
					...i,
					page_no: t,
					page_size: n
				}, r);
				return {
					rows: a.lists,
					total: a.count
				};
			}
		});
		b.bindFilters(oe);
		let M = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), P = le(M()), F = N(!1), I = N(!1), z = N(!1), ue = N(!1), B = N(!1), V = N(""), U = N(!1), de = N(""), W = N(!1), me = x(() => !h(P.id ? "edit" : "add")), G = x(() => z.value || ue.value), he = "", Y;
		async function X(e) {
			Y?.abort(), Y = new AbortController();
			let t = Y;
			Object.assign(P, M(), { id: e || "" }), de.value = "", B.value = !1, V.value = "", U.value = !1, F.value = !0, I.value = !0, he = JSON.stringify(P);
			try {
				if (y.value = await l(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await p("categories", e, t.signal);
				if (y.value = await l(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(P, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), he = JSON.stringify(P);
			} catch (e) {
				t.signal.aborted || (U.value = !0, de.value = o(e));
			} finally {
				t.signal.aborted || (I.value = !1);
			}
		}
		function _e() {
			return G.value ? !1 : !I.value && !U.value && JSON.stringify(P) !== he ? (W.value = !0, !1) : (Y?.abort(), !0);
		}
		function ve() {
			_e() && (F.value = !1);
		}
		function Z() {
			Y?.abort(), W.value = !1, F.value = !1;
		}
		async function ye() {
			if (!(me.value || G.value || I.value || U.value)) {
				if (!P.name.trim() || P.sort_order === null) {
					de.value = "请填写分类名称和排序";
					return;
				}
				z.value = !0, de.value = "";
				try {
					await te("categories", {
						name: P.name,
						parent_id: P.parent_id || null,
						sort_order: P.sort_order,
						is_enabled: P.is_enabled,
						id: P.id || void 0,
						row_version: P.id ? P.row_version : void 0
					}), F.value = !1, f.success("保存成功"), await Promise.all([ae(), Se()]);
				} catch (e) {
					de.value = o(e);
				} finally {
					z.value = !1;
				}
			}
		}
		function Q() {
			!P.id || !h("delete") || G.value || I.value || U.value || (V.value = "", B.value = !0);
		}
		async function be() {
			if (!(!B.value || !P.id || !h("delete") || G.value || I.value || U.value)) {
				ue.value = !0, V.value = "";
				try {
					await s("categories", P.id, P.row_version), B.value = !1, F.value = !1, f.success("分类已删除"), await Promise.all([ae(), Se()]);
				} catch (e) {
					V.value = o(e);
				} finally {
					ue.value = !1;
				}
			}
		}
		let $ = x(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(y.value?.categories || []).filter((e) => !e.parent_id && e.id !== P.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), xe = new AbortController();
		async function Se() {
			try {
				_.value = await l(xe.signal);
			} catch {}
		}
		return ce(Se), se(() => {
			Y?.abort(), xe.abort();
		}), (t, r) => (j(), w("div", jn, [
			D(R(c), A(R(k), {
				"auto-refreshable": !1,
				columns: O,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${In}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": H(({ row: e }) => [D(J, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": H(() => [h("add") ? (j(), S(R(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => X()
				}, {
					icon: H(() => [D(R(g), {
						name: "plus",
						size: 14
					})]),
					default: H(() => [E("新增" + L(In))]),
					_: 1
				})) : C("", !0)]),
				"cell-is_enabled": H(({ row: e }) => [D(R(ee), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: H(() => [E(L(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": H(({ row: e }) => [D(R(n), {
					size: "sm",
					"icon-only": "",
					title: h("edit") ? `编辑${In}` : `${In}详情`,
					"aria-label": h("edit") ? `编辑${In}` : `${In}详情`,
					onClick: (t) => X(e.id)
				}, {
					default: H(() => [D(R(g), {
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
			}, 16, ["aria-label"]),
			D(R(u), {
				modelValue: F.value,
				"onUpdate:modelValue": r[5] ||= (e) => F.value = e,
				title: `${P.id ? "编辑" : "新增"}公告${In}`,
				width: "680px",
				subtitle: "公告分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": _e
			}, {
				footer: H(() => [
					P.id && h("delete") ? (j(), S(R(n), {
						key: 0,
						variant: "danger",
						disabled: I.value || U.value || G.value,
						onClick: Q
					}, {
						icon: H(() => [D(R(g), {
							name: "trash-2",
							size: 14
						})]),
						default: H(() => [r[11] ||= E("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : C("", !0),
					D(R(n), {
						disabled: G.value,
						onClick: ve
					}, {
						default: H(() => [...r[12] ||= [E("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					me.value ? C("", !0) : (j(), S(R(n), {
						key: 1,
						variant: "primary",
						loading: z.value,
						disabled: I.value || U.value || ue.value,
						onClick: ye
					}, {
						default: H(() => [E("保存" + L(In))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: H(() => [T("div", {
					class: "taxonomy-editor",
					"aria-busy": I.value
				}, [
					I.value ? (j(), w("div", Nn, [D(R(g), {
						name: "loader-circle",
						class: "announcement-spin",
						size: 24
					}), T("span", null, "正在读取" + L(In) + "...")])) : C("", !0),
					de.value ? (j(), S(R(m), {
						key: 1,
						type: "error",
						closable: !1,
						description: de.value
					}, null, 8, ["description"])) : C("", !0),
					!I.value && !U.value ? (j(), S(R(ie), {
						key: 2,
						model: P,
						"label-position": "top",
						onSubmit: fe(ye, ["prevent"])
					}, {
						default: H(() => [
							P.id ? (j(), S(R(e), {
								key: 0,
								label: "分类ID"
							}, {
								default: H(() => [D(R(v), {
									"model-value": P.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : C("", !0),
							D(R(e), {
								label: `${In}名称`,
								required: ""
							}, {
								default: H(() => [D(R(v), {
									modelValue: P.name,
									"onUpdate:modelValue": r[1] ||= (e) => P.name = e,
									maxlength: 120,
									disabled: me.value || G.value,
									"aria-label": `${In}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							D(R(e), { label: "父分类" }, {
								default: H(() => [T("div", Pn, [D(R(re), {
									modelValue: P.parent_id,
									"onUpdate:modelValue": r[2] ||= (e) => P.parent_id = e,
									options: $.value,
									disabled: me.value || G.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), r[10] ||= T("p", { class: "announcement-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类公告。 ", -1)])]),
								_: 1
							}),
							T("div", Fn, [D(R(e), {
								label: "前端排序",
								required: ""
							}, {
								default: H(() => [D(R(ne), {
									modelValue: P.sort_order,
									"onUpdate:modelValue": r[3] ||= (e) => P.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: me.value || G.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), D(R(e), { label: "启用状态" }, {
								default: H(() => [D(ge, {
									modelValue: P.is_enabled,
									"onUpdate:modelValue": r[4] ||= (e) => P.is_enabled = e,
									disabled: me.value || G.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : C("", !0)
				], 8, Mn)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			D(R(u), {
				modelValue: B.value,
				"onUpdate:modelValue": r[7] ||= (e) => B.value = e,
				title: "删除公告分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !ue.value
			}, {
				footer: H(() => [D(R(n), {
					disabled: ue.value,
					onClick: r[6] ||= (e) => B.value = !1
				}, {
					default: H(() => [...r[13] ||= [E("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), D(R(n), {
					variant: "danger",
					loading: ue.value,
					onClick: be
				}, {
					default: H(() => [...r[14] ||= [E("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: H(() => [T("p", null, "确认删除分类“" + L(P.name) + "”？有关联公告或子分类的分类无法删除。", 1), V.value ? (j(), S(R(m), {
					key: 0,
					type: "error",
					closable: !1,
					description: V.value
				}, null, 8, ["description"])) : C("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			D(R(u), {
				modelValue: W.value,
				"onUpdate:modelValue": r[9] ||= (e) => W.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: H(() => [D(R(n), { onClick: r[8] ||= (e) => W.value = !1 }, {
					default: H(() => [...r[15] ||= [E("继续编辑", -1)]]),
					_: 1
				}), D(R(n), {
					variant: "primary",
					onClick: Z
				}, {
					default: H(() => [...r[16] ||= [E("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-1b5aec70"]]), Rn = ["aria-busy"], zn = { class: "article-editor__header" }, Bn = { class: "article-editor__heading" }, Vn = { class: "article-editor__commands" }, Hn = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, Un = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Wn = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, Gn = {
	key: 1,
	class: "article-editor__failure"
}, Kn = {
	key: 0,
	class: "article-editor__error"
}, qn = { class: "article-editor__body" }, Jn = { class: "article-editor__settings" }, Yn = { class: "article-editor__content" }, Xn = ["aria-invalid", "disabled"], Zn = ["aria-invalid", "disabled"], Qn = {
	class: "announcement-delete-dialog__icon",
	"aria-hidden": "true"
}, $n = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: i }) {
		let { hasPermission: a } = pe(), { announcementError: o, announcementCategoryLabel: s, deleteAnnouncement: c, getAnnouncementDetail: l, getAnnouncementMetadata: d, saveAnnouncement: ee, uploadAnnouncementCover: p } = An(), te = t, h = i, _ = N(!0), y = N(!1), O = N(!1), k = N(""), A = N(!1), ae = N(!1), oe = N(!1), M = N(!1), P = N(pe().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), F = N(), I = N("draft"), z = N(!1), B = x(() => a(["cms_announcement:publish"])), V = x(() => !a([`cms_announcement:${te.articleId ? "edit" : "add"}`]) || !B.value && I.value !== "draft"), de = x(() => a(["cms_announcement:delete"]) && (B.value || I.value === "draft"));
		async function W() {
			if (!(!de.value || y.value || _.value || O.value)) {
				y.value = !0, k.value = "";
				try {
					await c("articles", K.id, K.row_version), be = JSON.stringify(K), f.success("公告已删除"), h("saved");
				} catch (e) {
					k.value = o(e), M.value = !1;
				} finally {
					y.value = !1;
				}
			}
		}
		let G = x(() => V.value || y.value), K = le({
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
		}), { editorRoot: q, seoInput: J, fieldRules: he, fieldErrors: Y, pendingCount: ge, saveError: X, validateSave: _e, setSaveFailure: ve, focusFirstError: Z, focusSeoError: ye } = we(K, () => F.value?.categories || [], "announcement", A), Q = x(() => (F.value?.categories || []).map((e) => ({
			label: s(F.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), be = "", $;
		function xe(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Se() {
			$?.abort(), $ = new AbortController();
			let e = $;
			_.value = !0, O.value = !1, k.value = "";
			try {
				if (F.value = await d(e.signal, { cms_source_type: "platform" }), te.articleId) {
					let t = await l("articles", te.articleId, e.signal);
					if (F.value = await d(e.signal, { space_id: String(t.space_id) }), P.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					K.scheduled_local = t.publish_status === "scheduled" ? xe(t.scheduled_at) : "", I.value = t.publish_status;
				}
				be = JSON.stringify(K);
			} catch (t) {
				e.signal.aborted || (k.value = o(t), O.value = !0);
			} finally {
				e.signal.aborted || (_.value = !1);
			}
		}
		let Ce = () => !_.value && !O.value && be !== JSON.stringify(K);
		function Te() {
			Ce() ? ae.value = !0 : h("close");
		}
		function Ee() {
			I.value === "draft" ? Oe("draft") : oe.value = !0;
		}
		function De() {
			oe.value = !1, Oe("draft");
		}
		async function Oe(e) {
			if (G.value || _.value || O.value || z.value || (k.value = "", !await _e(e))) return;
			let t = K.scheduled_local ? new Date(K.scheduled_local) : null;
			y.value = !0, k.value = "";
			try {
				await ee("articles", {
					...K,
					id: K.id || void 0,
					row_version: K.id ? K.row_version : void 0,
					category_id: K.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), be = JSON.stringify(K), f.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "公告已发布"), h("saved");
			} catch (e) {
				ve(e);
			} finally {
				y.value = !1;
			}
			ge.value && await Z();
		}
		function ke(e) {
			k.value = o(e);
		}
		let Ae = (e) => {
			Ce() && (e.preventDefault(), e.returnValue = "");
		};
		return me(() => !y.value && !z.value && (!Ce() || window.confirm("公告有未保存的修改，确定离开？"))), ce(() => {
			Se(), window.addEventListener("beforeunload", Ae);
		}), se(() => {
			$?.abort(), window.removeEventListener("beforeunload", Ae);
		}), (i, a) => (j(), w("section", {
			ref_key: "editorRoot",
			ref: q,
			class: "article-editor",
			"aria-busy": _.value || y.value
		}, [
			T("header", zn, [
				D(R(n), {
					"icon-only": "",
					title: "返回公告列表",
					"aria-label": "返回公告列表",
					disabled: y.value || z.value,
					onClick: Te
				}, {
					default: H(() => [D(R(g), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				T("div", Bn, [T("h2", null, L(t.articleId ? "编辑公告" : "新增公告"), 1), T("span", null, L(F.value?.source_locale || "zh-CN") + " · " + L(P.value), 1)]),
				T("div", Vn, [
					t.articleId && de.value ? (j(), S(R(n), {
						key: 0,
						size: "sm",
						disabled: _.value || O.value || y.value || z.value,
						onClick: a[0] ||= (e) => M.value = !0
					}, {
						default: H(() => [...a[29] ||= [E("删除公告", -1)]]),
						_: 1
					}, 8, ["disabled"])) : C("", !0),
					D(R(n), {
						size: "sm",
						disabled: _.value || O.value,
						onClick: a[1] ||= (e) => A.value = !0
					}, {
						icon: H(() => [D(R(g), {
							name: "search",
							size: 14
						})]),
						default: H(() => [a[30] ||= E("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					V.value ? C("", !0) : (j(), S(R(n), {
						key: 1,
						size: "sm",
						disabled: _.value || O.value || y.value || z.value,
						onClick: Ee
					}, {
						icon: H(() => [D(R(g), {
							name: "save",
							size: 14
						})]),
						default: H(() => [a[31] ||= E("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					R(X) ? (j(), w("span", Hn, L(R(X)), 1)) : C("", !0),
					!V.value && R(ge) ? (j(), w("span", Un, "还有 " + L(R(ge)) + " 项待完善", 1)) : C("", !0),
					!V.value && B.value ? (j(), S(R(n), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: _.value || O.value || z.value,
						loading: y.value,
						onClick: a[2] ||= (e) => Oe(K.scheduled_local ? "scheduled" : "published")
					}, {
						icon: H(() => [D(R(g), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: H(() => [E(L(K.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : C("", !0)
				])
			]),
			_.value ? (j(), w("div", Wn, [D(R(g), {
				name: "loader-circle",
				class: "announcement-spin",
				size: 28
			}), a[32] ||= T("span", null, "正在读取公告资料...", -1)])) : O.value ? (j(), w("div", Gn, [D(R(m), {
				type: "error",
				description: k.value,
				closable: !1
			}, null, 8, ["description"]), D(R(n), { onClick: Se }, {
				default: H(() => [...a[33] ||= [E("重新加载", -1)]]),
				_: 1
			})])) : (j(), w(b, { key: 2 }, [k.value ? (j(), w("div", Kn, [D(R(m), {
				type: "error",
				description: k.value,
				closable: !1
			}, null, 8, ["description"])])) : C("", !0), T("div", qn, [T("aside", Jn, [D(R(ie), {
				model: K,
				rules: R(he),
				"label-position": "top",
				onSubmit: a[13] ||= fe(() => {}, ["prevent"])
			}, {
				default: H(() => [
					D(R(e), {
						label: "公告分类",
						prop: "category_id",
						error: R(Y).category_id,
						required: ""
					}, {
						default: H(() => [D(R(re), {
							modelValue: K.category_id,
							"onUpdate:modelValue": a[3] ||= (e) => K.category_id = e,
							options: Q.value,
							clearable: "",
							disabled: G.value,
							"aria-label": "公告分类"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					a[34] ||= T("h3", null, "公告设置", -1),
					D(R(e), {
						label: "公告封面",
						prop: "cover_url",
						error: R(Y).cover_url
					}, {
						default: H(() => [D(Be, {
							modelValue: K.cover_url,
							"onUpdate:modelValue": a[4] ||= (e) => K.cover_url = e,
							label: "公告封面",
							disabled: G.value,
							upload: R(p),
							onBusyChange: a[5] ||= (e) => z.value = e,
							onStart: a[6] ||= (e) => k.value = "",
							onError: ke
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "内容来源",
						prop: "content_source",
						error: R(Y).content_source
					}, {
						default: H(() => [D(R(v), {
							modelValue: K.content_source,
							"onUpdate:modelValue": a[7] ||= (e) => K.content_source = e,
							maxlength: 160,
							disabled: G.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "作者署名",
						prop: "author_name",
						error: R(Y).author_name
					}, {
						default: H(() => [D(R(v), {
							modelValue: K.author_name,
							"onUpdate:modelValue": a[8] ||= (e) => K.author_name = e,
							maxlength: 120,
							disabled: G.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "前端排序",
						prop: "sort_order",
						error: R(Y).sort_order
					}, {
						default: H(() => [D(R(ne), {
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
					a[35] ||= T("h3", null, "发布设置", -1),
					D(R(e), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: R(Y).helpful_enabled
					}, {
						default: H(() => [D(zt, {
							modelValue: K.helpful_enabled,
							"onUpdate:modelValue": a[10] ||= (e) => K.helpful_enabled = e,
							disabled: G.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "启用状态",
						prop: "is_enabled",
						error: R(Y).is_enabled
					}, {
						default: H(() => [D(zt, {
							modelValue: K.is_enabled,
							"onUpdate:modelValue": a[11] ||= (e) => K.is_enabled = e,
							disabled: G.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: R(Y).scheduled_local
					}, {
						default: H(() => [D(R(v), {
							modelValue: K.scheduled_local,
							"onUpdate:modelValue": a[12] ||= (e) => K.scheduled_local = e,
							type: "datetime-local",
							disabled: G.value || !B.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[36] ||= T("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), T("main", Yn, [D(R(ie), {
				model: K,
				rules: R(he),
				"label-position": "top",
				onSubmit: a[17] ||= fe(() => {}, ["prevent"])
			}, {
				default: H(() => [
					D(R(e), {
						label: "标题",
						prop: "title",
						error: R(Y).title,
						required: ""
					}, {
						default: H(() => [D(R(v), {
							modelValue: K.title,
							"onUpdate:modelValue": a[14] ||= (e) => K.title = e,
							maxlength: 255,
							disabled: G.value,
							placeholder: "输入公告标题",
							"aria-label": "公告标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "摘要",
						prop: "summary",
						error: R(Y).summary
					}, {
						default: H(() => [U(T("textarea", {
							"onUpdate:modelValue": a[15] ||= (e) => K.summary = e,
							"aria-invalid": !!R(Y).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: G.value,
							"aria-label": "公告摘要"
						}, null, 8, Xn), [[ue, K.summary]])]),
						_: 1
					}, 8, ["error"]),
					D(R(e), {
						label: "正文",
						prop: "body_html",
						error: R(Y).body_html
					}, {
						default: H(() => [D(R(r), {
							modelValue: K.body_html,
							"onUpdate:modelValue": a[16] ||= (e) => K.body_html = e,
							readonly: V.value,
							disabled: y.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "公告正文"
						}, {
							"image-upload": H(({ url: e, setUrl: t, setBusy: n }) => [D(Be, {
								label: "正文图片",
								"model-value": e,
								upload: R(p),
								"onUpdate:modelValue": t,
								onBusyChange: n,
								onError: ke
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
			D(R(u), {
				modelValue: A.value,
				"onUpdate:modelValue": a[21] ||= (e) => A.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: H(() => [D(R(n), {
					variant: "primary",
					onClick: a[20] ||= (e) => A.value = !1
				}, {
					default: H(() => [...a[37] ||= [E("确定", -1)]]),
					_: 1
				})]),
				default: H(() => [D(R(ie), {
					model: K,
					rules: R(he),
					"label-position": "top",
					onSubmit: a[19] ||= fe(() => {}, ["prevent"])
				}, {
					default: H(() => [D(R(e), {
						label: "SEO 描述",
						prop: "seo_description",
						error: R(Y).seo_description
					}, {
						default: H(() => [U(T("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": a[18] ||= (e) => K.seo_description = e,
							"aria-invalid": !!R(Y).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: G.value,
							"aria-label": "SEO 描述"
						}, null, 8, Zn), [[ue, K.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			D(R(u), {
				modelValue: M.value,
				"onUpdate:modelValue": a[23] ||= (e) => M.value = e,
				title: "确认删除",
				subtitle: `操作对象：${K.title || "未命名公告"}`,
				width: "460px",
				"panel-class": "announcement-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !y.value
			}, {
				"header-actions": H(() => [T("span", Qn, [D(R(g), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: H(() => [D(R(n), {
					disabled: y.value,
					onClick: a[22] ||= (e) => M.value = !1
				}, {
					default: H(() => [...a[38] ||= [E("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), D(R(n), {
					variant: "warning",
					loading: y.value,
					onClick: W
				}, {
					default: H(() => [...a[39] ||= [E("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: H(() => [D(R(m), {
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
			D(R(u), {
				modelValue: ae.value,
				"onUpdate:modelValue": a[26] ||= (e) => ae.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: H(() => [D(R(n), { onClick: a[24] ||= (e) => ae.value = !1 }, {
					default: H(() => [...a[40] ||= [E("继续编辑", -1)]]),
					_: 1
				}), D(R(n), {
					variant: "primary",
					onClick: a[25] ||= (e) => h("close")
				}, {
					default: H(() => [...a[41] ||= [E("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			D(R(u), {
				modelValue: oe.value,
				"onUpdate:modelValue": a[28] ||= (e) => oe.value = e,
				title: "将公告转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: H(() => [D(R(n), { onClick: a[27] ||= (e) => oe.value = !1 }, {
					default: H(() => [...a[42] ||= [E("取消", -1)]]),
					_: 1
				}), D(R(n), {
					variant: "primary",
					onClick: De
				}, {
					default: H(() => [...a[43] ||= [E("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Rn));
	}
}), [["__scopeId", "data-v-d210b47b"]]), er = { class: "announcement-articles" }, tr = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = pe(), { formatDateTime: r } = pe(), { announcementPublishStates: a, announcementCategoryLabel: o, getAnnouncementList: s, getAnnouncementMetadata: l } = An(), u = N(!1), d = N(), f = (e) => t([`cms_announcement:${e}`]), p = N(), te = q(l, (e) => {
			p.value = e;
		}), m = [
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
				formatter: (e) => o(p.value, e)
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
		], { proTableBindings: ne, reload: re, filters: ie } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: x(() => [
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
					}, ...(p.value?.categories || []).map((e) => ({
						label: o(p.value, e.id),
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
			]),
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
		});
		te.bindFilters(ie);
		let h = new AbortController();
		async function _() {
			try {
				p.value = await l(h.signal);
			} catch {}
		}
		function v(e) {
			d.value = e, u.value = !0;
		}
		function y() {
			u.value = !1, re(), _();
		}
		return ce(_), se(() => h.abort()), (e, t) => (j(), w("div", er, [u.value ? (j(), S($n, {
			key: 0,
			"article-id": d.value,
			onClose: t[0] ||= (e) => u.value = !1,
			onSaved: y
		}, null, 8, ["article-id"])) : C("", !0), U(D(R(c), A(R(ne), {
			"auto-refreshable": !1,
			columns: m,
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
			"cell-cms_source_type": H(({ row: e }) => [D(J, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": H(() => [f("add") ? (j(), S(R(n), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => v()
			}, {
				icon: H(() => [D(R(g), {
					name: "plus",
					size: 14
				})]),
				default: H(() => [t[2] ||= E("新增公告", -1)]),
				_: 1
			})) : C("", !0)]),
			"cell-publish_status": H(({ row: e }) => [D(R(ee), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: H(() => [E(L(R(a).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": H(({ row: e }) => [D(R(ee), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: H(() => [E(L(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": H(({ row: e }) => [E(L(R(r)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": H(({ row: e }) => [D(R(n), {
				size: "sm",
				"icon-only": "",
				title: f("edit") ? "编辑公告" : "公告详情",
				"aria-label": f("edit") ? "编辑公告" : "公告详情",
				onClick: (t) => v(e.id)
			}, {
				default: H(() => [D(R(g), {
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
		}, 16), [[B, !u.value]])]));
	}
}), [["__scopeId", "data-v-9f055b06"]]);
//#endregion
//#region src/cms/api/content/translations.ts
function nr() {
	let e = pe().request, t = "/cms/translations";
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
var rr = (e, t) => t > 0 ? Math.min(100, Math.round(e / t * 100)) : 0, ir = (e, t) => `${e}:${t}`;
function ar(e, t) {
	return e ? e.fields.flatMap((e) => e.translations.flatMap((n) => {
		let r = t[ir(e.key, n.locale)] ?? n.text;
		return r === n.text ? [] : [{
			field_name: e.key,
			locale: n.locale,
			text: r,
			source_hash: e.source_hash,
			row_version: n.row_version
		}];
	})) : [];
}
function or(e) {
	return Object.fromEntries(e.fields.flatMap((e) => e.translations.map((t) => [ir(e.key, t.locale), t.text])));
}
function sr(e) {
	return e?.translations.filter((e) => e.status === "ready").length ?? 0;
}
var cr = (e) => !!e && ["queued", "running"].includes(e.status), lr = {
	queued: "等待处理",
	running: "翻译中",
	succeeded: "翻译完成",
	partial_failed: "部分未完成",
	failed: "翻译未完成",
	cancelled: "已取消"
}, ur = {
	draft: "草稿",
	scheduled: "定时发布",
	published: "已发布"
};
function dr(e) {
	if (e && typeof e == "object") {
		let t = e;
		return Object.values(t.errors || {}).flat()[0] || t.msg || t.message || "操作失败，请稍后重试";
	}
	return "操作失败，请稍后重试";
}
//#endregion
//#region src/cms/views/content/localization/translations/index.vue?vue&type=script&setup=true&lang.ts
var fr = ["aria-busy"], pr = { class: "translation-toolbar surface" }, mr = { class: "translation-title" }, hr = { class: "translation-title__icon" }, gr = { class: "translation-progress" }, _r = { class: "translation-toolbar__actions" }, vr = { class: "source-language" }, yr = {
	key: 3,
	class: "translation-job surface",
	role: "status"
}, br = { key: 0 }, xr = { key: 1 }, Sr = ["title"], Cr = {
	class: "language-overview surface",
	"aria-label": "目标语言完成度"
}, wr = [
	"disabled",
	"title",
	"onClick"
], Tr = {
	class: "module-bar surface",
	"aria-label": "翻译内容模块"
}, Er = { class: "module-count" }, Dr = { class: "translation-workspace surface" }, Or = { class: "content-browser" }, kr = { class: "content-browser__header" }, Ar = ["aria-busy"], jr = {
	key: 0,
	class: "region-status",
	role: "status"
}, Mr = [
	"aria-current",
	"disabled",
	"onClick"
], Nr = { class: "content-item__text" }, Pr = ["title"], Fr = {
	key: 0,
	class: "region-status"
}, Ir = { class: "content-browser__footer" }, Lr = ["aria-busy"], Rr = {
	key: 0,
	class: "editor-state",
	role: "status"
}, zr = { class: "translation-editor__header" }, Br = { class: "translation-editor__title" }, Vr = { key: 0 }, Hr = ["title"], Ur = { class: "source-field" }, Wr = { class: "section-heading" }, Gr = [
	"value",
	"rows",
	"aria-label"
], Kr = { class: "section-heading target-heading" }, qr = {
	key: 0,
	class: "empty-source"
}, Jr = {
	key: 1,
	class: "empty-source"
}, Yr = ["data-locale"], Xr = { class: "target-field__heading" }, Zr = ["for"], Qr = {
	key: 0,
	class: "status-stale"
}, $r = {
	key: 1,
	class: "status-ready"
}, ei = [
	"id",
	"onUpdate:modelValue",
	"rows",
	"maxlength",
	"disabled",
	"dir",
	"placeholder"
], ti = { class: "target-field__count" }, ni = {
	key: 2,
	class: "editor-state"
}, ri = {
	key: 1,
	class: "region-status"
}, ii = {
	key: 2,
	class: "mm-translation-settings"
}, ai = { class: "mm-translation-settings__credential" }, oi = { key: 0 }, si = { key: 1 }, ci = { key: 2 }, li = { class: "mm-translation-settings__grid" }, ui = { class: "job-confirm" }, di = /*#__PURE__*/ y(/* @__PURE__ */ O({
	__name: "index",
	setup(t) {
		let { cancelTranslationJob: r, createTranslationJob: i, getTranslationDetail: o, getTranslationJob: c, getTranslationList: l, getTranslationMetadata: te, getTranslationSettings: ie, saveTranslations: _, saveTranslationSettings: y, testTranslationConnection: O } = nr(), { hasPermission: k } = pe(), A = N(), M = N(""), le = N("news:content"), F = N([]), I = N(), z = N(""), B = N("title"), fe = N(""), W = N(""), G = N(1), K = N(0), q = N({}), J = N(!1), he = N(!1), Y = N(!1), ge = N(!1), X = N(""), _e = N(""), ve = N(), Z = N(null), ye = N(!1), Q = N(""), be = N(!1), $ = N(), xe = N(""), Se = N(!1), Ce = N(!1), we = N(!1), Te = N("field"), Ee = N([]), De = N(""), Oe = N(!1), ke = N(!1);
		V(ye, (e) => {
			e || (Q.value = "");
		});
		let Ae, je, Me, Ne, Pe, Fe = new AbortController(), Ie, Le = "", Re = x(() => k(["cms_translation:edit"])), ze = x(() => k(["cms_translation:config"])), Be = x(() => k(["cms_translation:translate"])), Ve = x(() => ge.value || Se.value || Oe.value), He = x(() => ar(I.value, q.value).length > 0), Ue = x(() => rr(A.value?.done || 0, A.value?.total || 0)), We = x(() => ({
			space_id: M.value,
			module: le.value.split(":")[0],
			kind: le.value.endsWith(":category") ? "category" : "content"
		})), Ge = x(() => A.value?.spaces.map((e) => ({
			label: e.label + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		})) || []), Ke = x(() => A.value?.locales.filter((e) => e.code !== A.value?.source_locale) || []), qe = x(() => Ke.value.map((e) => ({
			label: `${e.flag} ${e.label}`,
			value: e.code
		}))), Je = x(() => Ke.value.map((e) => ({
			label: `${e.label} · ${e.code}`,
			value: e.code
		}))), Ye = x(() => qe.value.filter((e) => nt(String(e.value)))), Xe = x(() => A.value?.locales.find((e) => e.code === A.value?.source_locale)?.label || A.value?.source_locale || "简体中文"), Ze = x(() => I.value?.fields.find((e) => e.key === B.value)), Qe = x(() => {
			let e = A.value?.modules.find((e) => e.key === le.value);
			return e?.kind === "category" ? `${A.value?.modules.find((t) => t.module === e.module && t.kind === "content")?.label || ""}分类` : e?.label || "新闻";
		}), $e = x(() => {
			let e = [];
			for (let t of A.value?.modules || []) {
				let n = e.find((e) => e[0].module === t.module);
				n ? n.push(t) : e.push([t]);
			}
			return e;
		}), et = x(() => !!M.value && A.value?.space_enabled && !!A.value.target_locales.length && !cr(Z.value) && !Ve.value && !He.value && !J.value && !he.value), tt = x(() => Z.value ? rr([
			"succeeded",
			"skipped",
			"cancelled"
		].reduce((e, t) => e + (Z.value?.counts[t] || 0), 0) + (cr(Z.value) ? 0 : Z.value.counts.failed || 0), Z.value.total) : 0), nt = (e) => A.value?.target_locales.includes(e) ?? !1, rt = (e) => A.value?.locales.find((t) => t.code === e), it = (e) => ({
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
			Ae = void 0, ke.value = !1, q.value = I.value ? or(I.value) : {}, e?.();
		}
		function st() {
			ke.value = !1, Ae = void 0, Pe?.(!1), Pe = void 0;
		}
		function ct(e) {
			e !== M.value && at(() => {
				M.value = e, fe.value = "", W.value = "", G.value = 1, Z.value = null, pt();
			});
		}
		function lt(e) {
			e.available && le.value !== e.key && at(() => {
				le.value = e.key, fe.value = "", W.value = "", G.value = 1, ht();
			});
		}
		function ut(e) {
			at(() => {
				G.value = e, ht();
			});
		}
		function dt() {
			at(() => {
				W.value = fe.value.trim(), G.value = 1, ht();
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
			J.value = !0, X.value = "";
			try {
				let t = await te(M.value || void 0, e.signal);
				if (e.signal.aborted) return;
				A.value = t, M.value = t.space_id || "", await ht(), Tt();
			} catch (t) {
				e.signal.aborted || (X.value = dr(t));
			} finally {
				e.signal.aborted || (J.value = !1);
			}
		}
		async function mt() {
			let e = M.value;
			if (e) try {
				let t = await te(e, Fe.signal);
				e === M.value && (A.value = t);
			} catch {}
		}
		async function ht() {
			je?.abort(), Me?.abort();
			let e = je = new AbortController();
			if (he.value = !0, Y.value = !1, I.value = void 0, z.value = "", q.value = {}, X.value = "", !M.value) {
				F.value = [], K.value = 0, he.value = !1;
				return;
			}
			let t = { ...We.value };
			try {
				let n = await l(t, W.value, G.value, e.signal);
				if (e.signal.aborted) return;
				F.value = n.lists, K.value = n.count, F.value[0] && await gt(F.value[0].id);
			} catch (t) {
				e.signal.aborted || (F.value = [], K.value = 0, X.value = dr(t));
			} finally {
				e.signal.aborted || (he.value = !1);
			}
		}
		async function gt(e) {
			Me?.abort();
			let t = Me = new AbortController();
			Y.value = !0, z.value = e, I.value = void 0, q.value = {}, X.value = "";
			try {
				let n = await o({ ...We.value }, e, t.signal);
				if (t.signal.aborted) return;
				I.value = n, q.value = or(n), n.fields.some((e) => e.key === B.value) || (B.value = n.fields[0]?.key || ""), ve.value?.scrollTo({ top: 0 });
			} catch (e) {
				t.signal.aborted || (X.value = dr(e));
			} finally {
				t.signal.aborted || (Y.value = !1);
			}
		}
		async function _t() {
			if (!I.value || !Re.value || Ve.value) return;
			let e = ar(I.value, q.value);
			if (e.length) {
				if (e.some((e) => !e.text.trim())) {
					X.value = "译文不能为空；未翻译的语言请保持未填写。";
					return;
				}
				ge.value = !0, X.value = "";
				try {
					let t = await _({ ...We.value }, I.value.id, e);
					I.value = t, q.value = or(t);
					let n = F.value.findIndex((e) => e.id === t.id);
					n >= 0 && (F.value[n] = t), f.success("翻译已保存"), mt();
				} catch (e) {
					X.value = dr(e);
				} finally {
					ge.value = !1;
				}
			}
		}
		async function vt(e) {
			_e.value = e, await ae();
			let t = ve.value?.querySelector(`[data-locale="${e}"]`);
			t?.scrollIntoView({
				block: "nearest",
				behavior: "smooth"
			}), t?.querySelector("textarea")?.focus();
		}
		async function yt() {
			if (!(!ze.value || !M.value)) {
				ye.value = !0, be.value = !0, xe.value = "", $.value = void 0, Q.value = "";
				try {
					$.value = await ie(M.value, Fe.signal);
				} catch (e) {
					xe.value = dr(e);
				} finally {
					be.value = !1;
				}
			}
		}
		async function bt() {
			if (!(!$.value || Se.value)) {
				if (He.value) {
					xe.value = "请先保存或放弃当前译文修改，再修改配置。";
					return;
				}
				Se.value = !0, xe.value = "";
				try {
					await y($.value, Q.value.trim()), Q.value = "", ye.value = !1, f.success("翻译配置已保存"), await pt();
				} catch (e) {
					xe.value = dr(e);
				} finally {
					Se.value = !1;
				}
			}
		}
		async function xt() {
			if (!(!$.value || Ce.value || Se.value)) {
				Ce.value = !0, xe.value = "";
				try {
					await O($.value.space_id, $.value.space_revision, Q.value.trim()), f.success("Google Translate 连接成功");
				} catch (e) {
					xe.value = dr(e);
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
					let e = await i({ ...We.value }, {
						request_key: Le,
						target_locales: Ee.value,
						...Te.value === "field" ? {
							id: z.value,
							field_name: B.value
						} : { keyword: W.value }
					});
					Z.value = e.job, we.value = !1, f.success("翻译任务已提交"), wt();
				} catch (e) {
					De.value = dr(e);
				} finally {
					Oe.value = !1;
				}
			}
		}
		function wt() {
			clearTimeout(Ie), cr(Z.value) && (Ie = setTimeout(() => {
				Tt();
			}, 3e3));
		}
		async function Tt() {
			let e = M.value;
			if (!e || Fe.signal.aborted) return;
			let t = cr(Z.value);
			try {
				let n = await c(e, Fe.signal);
				if (e !== M.value) return;
				Z.value = n.job, t && !cr(Z.value) && (await mt(), !He.value && !Ve.value && z.value && await gt(z.value));
			} catch {}
			wt();
		}
		async function Et() {
			if (Z.value) try {
				let e = await r(M.value, Z.value.id);
				Z.value = e.job, clearTimeout(Ie), mt();
			} catch (e) {
				X.value = dr(e);
			}
		}
		function Dt(e) {
			(He.value || Ve.value) && (e.preventDefault(), e.returnValue = "");
		}
		return me(() => !He.value && !Ve.value || !Ve.value && new Promise((e) => {
			Pe?.(!1), Pe = e, Ae = () => {
				Pe = void 0, e(!0);
			}, ke.value = !0;
		})), ce(() => {
			window.addEventListener("beforeunload", Dt), pt();
		}), se(() => {
			Q.value = "", Pe?.(!1), Fe.abort(), je?.abort(), Me?.abort(), Ne?.abort(), clearTimeout(Ie), window.removeEventListener("beforeunload", Dt);
		}), (t, r) => (j(), w("section", {
			class: "translations-page",
			"aria-label": "多语言翻译管理",
			"aria-busy": J.value
		}, [
			T("header", pr, [T("div", mr, [T("span", hr, [D(R(g), {
				name: "globe",
				size: 21
			})]), T("div", null, [r[21] ||= T("h1", null, "语言翻译管理", -1), T("div", gr, [
				T("strong", null, L(Ue.value) + "%", 1),
				D(R(a), {
					percentage: Ue.value,
					"show-text": !1,
					"stroke-width": 4,
					"aria-label": "全部翻译完成度"
				}, null, 8, ["percentage"]),
				T("span", null, L(A.value?.done.toLocaleString() || 0) + " / " + L(A.value?.total.toLocaleString() || 0) + " 个目标字段", 1)
			])])]), T("div", _r, [
				D(R(re), {
					"model-value": M.value,
					options: Ge.value,
					size: "sm",
					disabled: J.value || Ve.value,
					placeholder: "内容空间",
					"aria-label": "内容空间",
					"onUpdate:modelValue": r[0] ||= (e) => ct(String(e))
				}, null, 8, [
					"model-value",
					"options",
					"disabled"
				]),
				T("span", vr, [r[22] ||= E("内容源语言 ", -1), T("b", null, L(Xe.value), 1)]),
				ze.value ? (j(), S(R(n), {
					key: 0,
					size: "sm",
					disabled: !M.value || Ve.value,
					onClick: yt
				}, {
					icon: H(() => [D(R(g), {
						name: "sliders-horizontal",
						size: 14
					})]),
					default: H(() => [r[23] ||= E("翻译配置", -1)]),
					_: 1
				}, 8, ["disabled"])) : C("", !0),
				Be.value ? (j(), S(R(n), {
					key: 1,
					size: "sm",
					disabled: !et.value,
					onClick: r[1] ||= (e) => St("batch")
				}, {
					icon: H(() => [D(R(g), {
						name: "rocket",
						size: 14
					})]),
					default: H(() => [r[24] ||= E("批量翻译", -1)]),
					_: 1
				}, 8, ["disabled"])) : C("", !0),
				Be.value ? (j(), S(R(n), {
					key: 2,
					size: "sm",
					disabled: !et.value || !I.value || !Ze.value?.translatable,
					onClick: r[2] ||= (e) => St("field")
				}, {
					icon: H(() => [D(R(g), {
						name: "globe",
						size: 14
					})]),
					default: H(() => [r[25] ||= E("翻译当前字段", -1)]),
					_: 1
				}, 8, ["disabled"])) : C("", !0),
				Re.value ? (j(), S(R(n), {
					key: 3,
					size: "sm",
					variant: "primary",
					loading: ge.value,
					disabled: !He.value || Ve.value || !A.value?.space_enabled,
					onClick: _t
				}, {
					icon: H(() => [D(R(g), {
						name: "save",
						size: 14
					})]),
					default: H(() => [r[26] ||= E("保存翻译", -1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : C("", !0)
			])]),
			X.value ? (j(), S(R(m), {
				key: 0,
				type: "error",
				closable: !0,
				onClose: r[3] ||= (e) => X.value = ""
			}, {
				default: H(() => [E(L(X.value), 1)]),
				_: 1
			})) : C("", !0),
			A.value && !A.value.space_enabled && M.value ? (j(), S(R(m), {
				key: 1,
				type: "warning"
			}, {
				default: H(() => [...r[27] ||= [E("当前内容空间已停用，仅可查看翻译。", -1)]]),
				_: 1
			})) : C("", !0),
			A.value && !A.value.target_locales.length && M.value ? (j(), S(R(m), {
				key: 2,
				type: "info"
			}, {
				default: H(() => [...r[28] ||= [E("尚未启用目标语言，请在“翻译配置”中选择语言后开始翻译。", -1)]]),
				_: 1
			})) : C("", !0),
			Z.value ? (j(), w("div", yr, [
				D(R(g), {
					name: R(cr)(Z.value) ? "loader-circle" : "info",
					size: 15
				}, null, 8, ["name"]),
				T("strong", null, L(R(lr)[Z.value.status] || Z.value.status), 1),
				T("span", null, "任务 #" + L(Z.value.id), 1),
				D(R(a), {
					percentage: tt.value,
					"show-text": !1,
					"stroke-width": 4
				}, null, 8, ["percentage"]),
				T("span", null, [
					E(L(Z.value.counts.succeeded || 0) + " / " + L(Z.value.total) + " 已完成", 1),
					Z.value.counts.failed ? (j(), w("span", br, " · " + L(Z.value.counts.failed) + " 失败", 1)) : C("", !0),
					Z.value.counts.skipped ? (j(), w("span", xr, " · " + L(Z.value.counts.skipped) + " 冲突跳过", 1)) : C("", !0)
				]),
				R(cr)(Z.value) && Be.value ? (j(), S(R(n), {
					key: 0,
					size: "sm",
					variant: "text",
					disabled: Ve.value,
					onClick: Et
				}, {
					default: H(() => [...r[29] ||= [E("取消任务", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (j(), S(R(n), {
					key: 1,
					size: "sm",
					variant: "text",
					onClick: r[4] ||= (e) => Z.value = null
				}, {
					default: H(() => [...r[30] ||= [E("收起", -1)]]),
					_: 1
				})),
				Z.value.errors.length ? (j(), w("span", {
					key: 2,
					class: "translation-job__error",
					title: Z.value.errors.map((e) => `${e.target_locale}: ${e.error_code}`).join("；")
				}, L(Z.value.errors[0].error_code) + "（可重新提交补翻）", 9, Sr)) : C("", !0)
			])) : C("", !0),
			T("div", Cr, [(j(!0), w(b, null, P(Ke.value, (e) => (j(), w("button", {
				key: e.code,
				type: "button",
				class: oe(["language-card", {
					"is-active": _e.value === e.code,
					"is-disabled": !nt(e.code)
				}]),
				disabled: !nt(e.code),
				title: nt(e.code) ? `${e.native}：${e.done} / ${e.total}` : "请在翻译配置中启用",
				onClick: (t) => vt(e.code)
			}, [
				T("span", null, L(e.flag), 1),
				T("span", null, L(e.label), 1),
				T("strong", null, L(nt(e.code) ? R(rr)(e.done, e.total) + "%" : "未启用"), 1),
				D(R(a), {
					percentage: R(rr)(e.done, e.total),
					"show-text": !1,
					"stroke-width": 2
				}, null, 8, ["percentage"])
			], 10, wr))), 128))]),
			T("nav", Tr, [(j(!0), w(b, null, P($e.value, (e) => (j(), w("div", {
				key: e[0].module,
				class: "module-group"
			}, [(j(!0), w(b, null, P(e, (e) => (j(), S(R(n), {
				key: e.key,
				variant: le.value === e.key ? "primary" : "text",
				plain: le.value === e.key,
				size: "sm",
				disabled: !e.available || Ve.value,
				title: e.reason,
				"aria-pressed": le.value === e.key,
				onClick: (t) => lt(e)
			}, {
				default: H(() => [
					e.kind === "category" ? C("", !0) : (j(), S(R(g), {
						key: 0,
						name: it(e.module),
						size: 14
					}, null, 8, ["name"])),
					E(L(e.label), 1),
					T("span", Er, L(e.count), 1)
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
			T("main", Dr, [T("aside", Or, [
				T("div", kr, [T("div", null, [T("strong", null, L(Qe.value), 1), T("span", null, L(K.value) + " 条" + L(We.value.kind === "category" ? "分类" : "内容"), 1)]), D(R(v), {
					modelValue: fe.value,
					"onUpdate:modelValue": r[5] ||= (e) => fe.value = e,
					size: "sm",
					clearable: "",
					placeholder: "搜索内容",
					"aria-label": "搜索内容",
					onKeydown: de(dt, ["enter"])
				}, {
					prefix: H(() => [D(R(g), {
						name: "search",
						size: 14
					})]),
					_: 1
				}, 8, ["modelValue"])]),
				T("div", {
					class: "content-browser__list",
					"aria-busy": he.value
				}, [he.value ? (j(), w("p", jr, "加载内容中…")) : (j(), w(b, { key: 1 }, [(j(!0), w(b, null, P(F.value, (e) => (j(), w("button", {
					key: e.id,
					type: "button",
					class: oe(["content-item", { "is-selected": z.value === e.id }]),
					"aria-current": z.value === e.id ? "true" : void 0,
					disabled: Ve.value,
					onClick: (t) => ft(e.id)
				}, [T("span", Nr, [T("strong", { title: e.title }, L(e.title), 9, Pr), T("small", null, L(R(ur)[e.publish_status || ""] || "分类") + " · " + L(e.done) + "/" + L(e.total), 1)]), D(R(a), {
					type: "circle",
					percentage: R(rr)(e.done, e.total),
					"show-text": !1,
					size: 16,
					"stroke-width": 2,
					status: e.total && e.done === e.total ? "success" : "warning"
				}, null, 8, ["percentage", "status"])], 10, Mr))), 128)), F.value.length ? C("", !0) : (j(), w("p", Fr, L(W.value ? "没有匹配的内容" : "暂无可翻译内容"), 1))], 64))], 8, Ar),
				T("footer", Ir, [
					D(R(n), {
						size: "sm",
						"icon-only": "",
						"aria-label": "上一页",
						disabled: G.value <= 1 || he.value || Ve.value,
						onClick: r[6] ||= (e) => ut(G.value - 1)
					}, {
						default: H(() => [D(R(g), {
							name: "chevron-left",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"]),
					T("span", null, L(G.value) + " / " + L(Math.max(1, Math.ceil(K.value / 30))), 1),
					D(R(n), {
						size: "sm",
						"icon-only": "",
						"aria-label": "下一页",
						disabled: G.value * 30 >= K.value || he.value || Ve.value,
						onClick: r[7] ||= (e) => ut(G.value + 1)
					}, {
						default: H(() => [D(R(g), {
							name: "chevron-right",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"])
				])
			]), T("section", {
				class: "translation-editor",
				"aria-busy": Y.value
			}, [Y.value ? (j(), w("div", Rr, [D(R(g), {
				name: "loader-circle",
				size: 28
			}), r[31] ||= T("p", null, "加载译文中…", -1)])) : I.value ? (j(), w(b, { key: 1 }, [T("header", zr, [T("div", Br, [T("span", null, [E(L(Qe.value) + " ", 1), He.value ? (j(), w("em", Vr, "有未保存修改")) : C("", !0)]), T("h2", { title: I.value.title }, L(I.value.title), 9, Hr)]), D(R(d), {
				modelValue: B.value,
				"onUpdate:modelValue": r[8] ||= (e) => B.value = e
			}, {
				default: H(() => [(j(!0), w(b, null, P(I.value.fields, (e) => (j(), S(R(s), {
					key: e.key,
					name: e.key,
					label: `${e.label} ${e.translatable ? R(sr)(e) + "/" + e.translations.length : "—"}`
				}, null, 8, ["name", "label"]))), 128))]),
				_: 1
			}, 8, ["modelValue"])]), Ze.value ? (j(), w("div", {
				key: 0,
				class: "translation-editor__body",
				ref_key: "editorBody",
				ref: ve
			}, [
				T("section", Ur, [T("div", Wr, [T("strong", null, [E(L(Xe.value) + " ", 1), D(R(ee), {
					size: "sm",
					type: "primary",
					effect: "soft"
				}, {
					default: H(() => [...r[32] ||= [E("内容源语言", -1)]]),
					_: 1
				})]), r[33] ||= T("span", null, "只读原文", -1)]), T("textarea", {
					value: Ze.value.source,
					readonly: "",
					rows: Ze.value.key === "body_html" ? 5 : 2,
					class: "translation-textarea source-textarea",
					"aria-label": `原文${Ze.value.label}`
				}, null, 8, Gr)]),
				T("div", Kr, [r[34] ||= T("strong", null, "目标语言", -1), T("span", null, L(I.value.fields.find((e) => e.key === B.value)?.translations.length || 0) + " 种语言 · 手工修改后请保存", 1)]),
				Ze.value.translatable ? Ze.value.translations.length ? (j(), w("div", {
					key: 2,
					class: oe(["target-grid", { "is-body": B.value === "body_html" }])
				}, [(j(!0), w(b, null, P(Ze.value.translations, (e) => (j(), w("div", {
					key: e.locale,
					class: oe(["target-field", { "is-focused": _e.value === e.locale }]),
					"data-locale": e.locale
				}, [
					T("div", Xr, [T("label", { for: `translation-${B.value}-${e.locale}` }, [E(L(rt(e.locale)?.native || e.locale) + " ", 1), T("small", null, L(e.locale), 1)], 8, Zr), e.status === "stale" ? (j(), w("span", Qr, "原文已更新")) : e.status === "ready" ? (j(), w("span", $r, L(e.method === "machine" ? "机器翻译" : "已保存"), 1)) : C("", !0)]),
					U(T("textarea", {
						id: `translation-${B.value}-${e.locale}`,
						"onUpdate:modelValue": (t) => q.value[R(ir)(B.value, e.locale)] = t,
						class: "translation-textarea",
						rows: B.value === "body_html" ? 10 : 2,
						maxlength: Ze.value.max_length,
						disabled: !Re.value || !A.value?.space_enabled || Ve.value,
						dir: e.locale === "ar" ? "rtl" : "auto",
						placeholder: `请输入${rt(e.locale)?.native || e.locale}翻译${B.value === "body_html" ? "（HTML）" : ""}`
					}, null, 8, ei), [[ue, q.value[R(ir)(B.value, e.locale)]]]),
					T("div", ti, L((q.value[R(ir)(B.value, e.locale)] || "").length.toLocaleString()) + " / " + L(Ze.value.max_length.toLocaleString()), 1)
				], 10, Yr))), 128))], 2)) : (j(), w("div", Jr, " 请先在“翻译配置”中启用目标语言。 ")) : (j(), w("div", qr, [D(R(g), {
					name: "info",
					size: 18
				}), r[35] ||= E("原文字段为空，不参与翻译和完成度统计。 ", -1)]))
			], 512)) : C("", !0)], 64)) : (j(), w("div", ni, [D(R(h), { description: X.value ? "内容加载失败，可点击刷新重试" : "选择左侧内容开始翻译" }, null, 8, ["description"]), X.value ? (j(), S(R(n), {
				key: 0,
				size: "sm",
				onClick: pt
			}, {
				default: H(() => [...r[36] ||= [E("重新加载", -1)]]),
				_: 1
			})) : C("", !0)]))], 8, Lr)]),
			D(R(u), {
				modelValue: ye.value,
				"onUpdate:modelValue": r[16] ||= (e) => ye.value = e,
				title: "翻译配置",
				subtitle: "当前内容空间共用 · Google Cloud Translation Basic v2",
				width: "560px",
				"close-on-click-modal": !1,
				"before-close": () => !Se.value && !Ce.value
			}, {
				footer: H(() => [
					D(R(n), {
						loading: Ce.value,
						disabled: !$.value?.credential_configured && !Q.value.trim() || Se.value || be.value,
						onClick: xt
					}, {
						default: H(() => [...r[43] ||= [E("测试连接", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"]),
					D(R(n), {
						disabled: Se.value || Ce.value,
						onClick: r[15] ||= (e) => ye.value = !1
					}, {
						default: H(() => [...r[44] ||= [E("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					D(R(n), {
						variant: "primary",
						loading: Se.value,
						disabled: !$.value || be.value || Ce.value,
						onClick: bt
					}, {
						default: H(() => [...r[45] ||= [E("保存翻译配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])
				]),
				default: H(() => [xe.value ? (j(), S(R(m), {
					key: 0,
					type: "error"
				}, {
					default: H(() => [E(L(xe.value), 1)]),
					_: 1
				})) : C("", !0), be.value ? (j(), w("div", ri, "加载配置中…")) : $.value ? (j(), w("div", ii, [
					T("label", null, [r[37] ||= E(" 目标语言 ", -1), D(R(re), {
						modelValue: $.value.target_locales,
						"onUpdate:modelValue": r[9] ||= (e) => $.value.target_locales = e,
						options: Je.value,
						multiple: "",
						filterable: "",
						"max-tag-count": 4,
						placeholder: "选择需要维护的目标语言",
						disabled: Se.value || Ce.value,
						"aria-label": "翻译目标语言"
					}, null, 8, [
						"modelValue",
						"options",
						"disabled"
					])]),
					D(p, {
						modelValue: $.value.is_enabled,
						"onUpdate:modelValue": r[10] ||= (e) => $.value.is_enabled = e,
						disabled: Se.value || Ce.value,
						"credential-ready": !!$.value.credential_configured || !!Q.value.trim()
					}, null, 8, [
						"modelValue",
						"disabled",
						"credential-ready"
					]),
					T("div", ai, [
						T("label", null, [r[38] ||= E(" Google API Key ", -1), D(R(v), {
							modelValue: Q.value,
							"onUpdate:modelValue": r[11] ||= (e) => Q.value = e,
							type: "password",
							autocomplete: "new-password",
							disabled: Se.value || Ce.value,
							placeholder: $.value.credential_configured ? "已配置，留空保留原密钥；输入新密钥替换" : "请输入 Google Cloud Translation API Key"
						}, null, 8, [
							"modelValue",
							"disabled",
							"placeholder"
						])]),
						$.value.api_key_mask ? (j(), w("small", oi, L($.value.credential_source === "database" ? "数据库密钥" : "环境配置密钥") + "：" + L($.value.api_key_mask), 1)) : C("", !0),
						$.value.credential_error === "GOOGLE_CREDENTIAL_DECRYPT_FAILED" ? (j(), w("small", si, "数据库密钥无法解密，请检查两套后台的专用加密配置，或输入新密钥替换。")) : (j(), w("small", ci, "密钥加密保存，不回显原文；留空保留原值。未配置密钥时仍可人工翻译。"))
					]),
					T("div", li, [
						T("label", null, [r[39] ||= E(" 并发上限 ", -1), D(R(ne), {
							modelValue: $.value.concurrency_limit,
							"onUpdate:modelValue": r[12] ||= (e) => $.value.concurrency_limit = e,
							min: 1,
							max: 20,
							disabled: Se.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])]),
						T("label", null, [r[40] ||= E(" 请求超时（秒） ", -1), D(R(ne), {
							modelValue: $.value.request_timeout_seconds,
							"onUpdate:modelValue": r[13] ||= (e) => $.value.request_timeout_seconds = e,
							min: 1,
							max: 120,
							disabled: Se.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])]),
						T("label", null, [r[41] ||= E(" 最大尝试次数 ", -1), D(R(ne), {
							modelValue: $.value.max_attempts,
							"onUpdate:modelValue": r[14] ||= (e) => $.value.max_attempts = e,
							min: 1,
							max: 10,
							disabled: Se.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])])
					]),
					$.value.supported ? C("", !0) : (j(), S(R(m), {
						key: 0,
						type: "warning"
					}, {
						default: H(() => [...r[42] ||= [E("当前空间关联了其他版本的翻译配置。保存将为该空间创建独立的 Google v2 配置，不修改其他空间。", -1)]]),
						_: 1
					}))
				])) : C("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			D(R(u), {
				modelValue: we.value,
				"onUpdate:modelValue": r[19] ||= (e) => we.value = e,
				title: Te.value === "field" ? "翻译当前字段" : "批量翻译",
				subtitle: "Google Translate · 仅补齐缺失及原文已更新的译文",
				width: "520px",
				"close-on-click-modal": !1,
				"before-close": () => !Oe.value
			}, {
				footer: H(() => [D(R(n), {
					size: "sm",
					disabled: Oe.value,
					onClick: r[18] ||= (e) => we.value = !1
				}, {
					default: H(() => [...r[47] ||= [E("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), D(R(n), {
					variant: "primary",
					size: "sm",
					loading: Oe.value,
					disabled: !Ee.value.length,
					onClick: Ct
				}, {
					default: H(() => [...r[48] ||= [E("确认翻译", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])]),
				default: H(() => [T("div", ui, [
					T("p", null, L(Te.value === "field" ? `当前内容的「${Ze.value?.label}」` : `当前空间「${Qe.value}」${W.value ? "中匹配搜索条件的内容" : "全部内容"}`), 1),
					D(R(e), { label: "目标语言" }, {
						default: H(() => [D(R(re), {
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
					D(R(m), { type: "warning" }, {
						default: H(() => [...r[46] ||= [E("内容将发送至 Google Translate，并可能产生翻译费用。已有有效译文不会覆盖；单次最多 200 条内容、5,000 个字段任务。后台任务需要已启动翻译 worker。", -1)]]),
						_: 1
					}),
					De.value ? (j(), S(R(m), {
						key: 0,
						type: "error"
					}, {
						default: H(() => [E(L(De.value), 1)]),
						_: 1
					})) : C("", !0)
				])]),
				_: 1
			}, 8, [
				"modelValue",
				"title",
				"before-close"
			]),
			D(R(u), {
				modelValue: ke.value,
				"onUpdate:modelValue": r[20] ||= (e) => ke.value = e,
				title: "有未保存的翻译",
				subtitle: "切换后将丢弃当前修改，是否继续？",
				width: "380px",
				onClose: st
			}, {
				footer: H(() => [D(R(n), {
					size: "sm",
					onClick: st
				}, {
					default: H(() => [...r[49] ||= [E("继续编辑", -1)]]),
					_: 1
				}), D(R(n), {
					size: "sm",
					variant: "warning",
					onClick: ot
				}, {
					default: H(() => [...r[50] ||= [E("放弃修改并继续", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, fr));
	}
}), [["__scopeId", "data-v-1430b3cb"]]), fi = {
	key: 0,
	class: "mm-cms-site"
}, pi = ["disabled"], mi = ["value"], hi = {
	key: 1,
	role: "alert"
}, gi = {
	key: 2,
	role: "status"
}, _i = { key: 3 }, vi = ["disabled"], yi = /*#__PURE__*/ y(/* @__PURE__ */ O({
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
			"news/categories": be,
			"news/list": it,
			"academy/categories": ft,
			"academy/courses": It,
			"help/categories": Qt,
			"help/articles": yn,
			"feedback/list": kn,
			"announcement/categories": Ln,
			"announcement/list": tr,
			"localization/translations": di
		}, r = t.runtime.mode === "white_label" && !!t.runtime.resolveSiteInRequest, i = N(!1), a = N(0), o = N([]), s = N(""), c = N(""), l = N(t.runtime.mode === "white_label" && !r), u = N(!1), d = x(() => o.value.find((e) => e.site_id === s.value)), ee = x(() => n[t.page]), f = x(() => t.runtime.hasPermission([
			"cms_news:add",
			"cms_academy:add",
			"cms_help:add",
			"cms_announcement:add"
		])), p = new AbortController(), te = !0, m = !1;
		function ne(e) {
			m = !0;
			try {
				o.value = e.sites, s.value = e.site_id ?? "", i.value = !0;
			} finally {
				m = !1;
			}
		}
		let re = G(t.runtime, ne);
		V(s, () => {
			!r || m || (re.invalidate(), re = G(t.runtime, ne, d.value?.space_id ?? null), a.value++);
		}, { flush: "sync" });
		function ie(e, n) {
			if (!te || t.runtime.mode === "white_label" && d.value?.space_id !== n) throw Error("站点已切换，请重新操作");
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
		M(W, {
			get mode() {
				return t.runtime.mode;
			},
			hasPermission: (e) => t.runtime.hasPermission(e),
			formatDateTime: (e) => t.runtime.formatDateTime(e),
			registerBeforeLeave: (e) => t.runtime.registerBeforeLeave?.(e),
			get request() {
				if (r) return re.request;
				let e = d.value?.space_id;
				return {
					get: (n, r) => t.runtime.request.get(ie(n, e), r),
					post: (n, r) => t.runtime.request.post(ie(n, e), r)
				};
			}
		});
		async function h() {
			let e = await t.runtime.request.get({
				url: "/cms/sites",
				signal: p.signal
			});
			p.signal.aborted || (o.value = e.sites, o.value.some((e) => e.site_id === s.value) || (s.value = o.value[0]?.site_id ?? ""));
		}
		async function g() {
			if (!d.value || u.value) return;
			let e = a.value;
			u.value = !0;
			try {
				let n = await t.runtime.request.post({
					url: "/cms/initialize",
					params: { site_id: d.value.site_id }
				}, { isOpenRetry: !1 });
				if (!te || r && e !== a.value) return;
				if (r) {
					if (!n.cms_context) throw Error("初始化接口未返回站点信息");
					re.invalidate(), re = G(t.runtime, ne, n.cms_context.space_id), ne(n.cms_context), a.value++;
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
				p.signal.aborted || (c.value = "加载站点失败，请刷新重试");
			} finally {
				l.value = !1;
			}
		}), se(() => {
			te = !1, re.invalidate(), p.abort();
		}), (t, n) => (j(), w("section", { class: oe(["mm-cms-page", { "is-viewport": e.viewport }]) }, [e.runtime.mode === "white_label" && e.showSiteSelector && (!R(r) || i.value) ? (j(), w("header", fi, [T("label", null, [n[1] ||= E("内容站点 ", -1), U(T("select", {
			"onUpdate:modelValue": n[0] ||= (e) => s.value = e,
			disabled: l.value
		}, [(j(!0), w(b, null, P(o.value, (e) => (j(), w("option", {
			key: e.site_id,
			value: e.site_id
		}, L(e.label), 9, mi))), 128))], 8, pi), [[z, s.value]])]), n[2] ||= T("span", null, "各站点内容独立管理", -1)])) : C("", !0), c.value ? (j(), w("p", hi, L(c.value), 1)) : l.value ? (j(), w("p", gi, "正在加载站点…")) : e.runtime.mode === "white_label" && (!R(r) || i.value) && !d.value?.space_id ? (j(), w("div", _i, [T("p", null, L(d.value ? "该站点尚未初始化内容空间。" : "暂无可管理的内容站点。"), 1), d.value && f.value ? (j(), w("button", {
			key: 0,
			type: "button",
			disabled: u.value,
			onClick: g
		}, "初始化空内容空间", 8, vi)) : C("", !0)])) : (j(), S(F(ee.value), { key: `${e.page}:${e.identityKey}:${R(r) ? a.value : d.value?.space_id ?? "platform"}` }))], 2));
	}
}), [["__scopeId", "data-v-f447749a"]]);
//#endregion
//#region src/cms/permission-tree.ts
function bi(e, t, n = "", r = 0) {
	let i = e.children ?? [], a = e.type === "C" && !!(e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:")), o = t(e), s = n ? `${n} / ${o}` : o, c = a || e.type === "M" && r > 0 ? s : n;
	return [...!i.length || a ? [{
		id: e.id,
		name: a || e.type === "A" && e.perms?.startsWith("cms_") ? s : o
	}] : [], ...i.flatMap((e) => bi(e, t, c, r + 1))];
}
function xi(e, t) {
	let n = new Set(t.map(String)), r = /* @__PURE__ */ new Set(), i = [];
	function a(e) {
		let t = e.children ?? [], o = (!t.length || e.type === "C" && (e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:"))) && n.has(String(e.id));
		for (let e of t) a(e) && (o = !0);
		return o && !r.has(String(e.id)) && (r.add(String(e.id)), i.push(e.id)), !!o;
	}
	return e.forEach(a), i;
}
//#endregion
export { yi as MmCmsPage, Be as MmMediaUpload, bi as cmsPermissionItems, xi as cmsPermissionSubmission, l as createMediaUploader };

//# sourceMappingURL=cms.js.map