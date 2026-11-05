import { Cn as e, Er as t, Hi as n, M as r, Nr as i, P as a, Xn as o, _i as s, _r as c, a as l, bi as u, gi as ee, hi as te, ii as d, ni as f, p as ne, ri as re, ti as ie, vi as ae, wn as oe, xr as p } from "./src-D28mL1tZ.js";
import { d as m, f as h, n as g, u as _ } from "./Loading-NM70IAOz.js";
import { Fragment as se, computed as v, createBlock as y, createCommentVNode as b, createElementBlock as x, createElementVNode as S, createSlots as C, createTextVNode as w, createVNode as T, defineComponent as E, inject as D, mergeProps as O, nextTick as ce, normalizeClass as k, onBeforeUnmount as le, onMounted as ue, openBlock as A, provide as j, reactive as de, ref as M, renderList as N, resolveDynamicComponent as P, shallowRef as F, toDisplayString as I, unref as L, vModelSelect as R, vModelText as z, vShow as B, watch as V, withCtx as H, withDirectives as fe, withKeys as pe, withModifiers as me } from "vue";
//#region src/cms/runtime.ts
var U = Symbol("MmCms");
function he() {
	let e = D(U);
	if (!e) throw Error("CMS host adapter is missing");
	return e;
}
function ge(e) {
	he().registerBeforeLeave?.(e);
}
//#endregion
//#region src/cms/site-transport.ts
function W(e, t, n) {
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
	if (he().mode === "white_label") return {
		fields: [],
		bindFilters: (e) => {}
	};
	let n = de([{
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
	return ue(async () => {
		try {
			let t = await e(r.signal);
			!r.signal.aborted && n[1].type === "select" && (n[1].options = [{
				label: "全部白标",
				value: ""
			}, ...t.cms_source_options || []]);
		} catch {
			n[1].type === "select" && (n[1].disabled = !0);
		}
	}), le(() => {
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
var _e = /* @__PURE__ */ E({
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
		return (e, t) => (A(), y(L(te), {
			effect: "soft",
			round: "",
			size: "sm",
			type: a.value
		}, {
			default: H(() => [w(I(i.value), 1)]),
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
		newsCategoryLabel: u,
		newsError: ee
	};
}
//#endregion
//#region src/cms/views/content/news/EnabledToggle.vue?vue&type=script&setup=true&lang.ts
var J = ["aria-checked", "disabled"], Y = /*#__PURE__*/ _(/* @__PURE__ */ E({
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
		}, [S("span")], -1), S("span", null, I(e.modelValue ? "已启用" : "已停用"), 1)], 10, J));
	}
}), [["__scopeId", "data-v-8b527db1"]]), X = { class: "news-categories" }, ve = ["aria-busy"], Z = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, ye = { class: "taxonomy-editor__field" }, be = { class: "taxonomy-editor__row" }, xe = "分类", Q = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(t) {
		let { newsError: r, deleteNews: a, getNewsMetadata: o, getNewsList: s, getNewsDetail: l, saveNews: ee } = q(), { hasPermission: f } = he(), { formatDateTime: ne } = he(), p = (e) => f([`cms_news_category:${e}`]), h = M(), _ = M(), se = K(o, (e) => {
			h.value = e;
		}), C = [
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
				key: "parent_id",
				dataIndex: "parent_id",
				title: "父分类",
				width: 180,
				formatter: (e) => h.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
				formatter: ne
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], { proTableBindings: E, reload: D, filters: ce } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: [
				...se.fields,
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
		se.bindFilters(ce);
		let k = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), j = de(k()), N = M(!1), P = M(!1), F = M(!1), R = M(!1), z = M(!1), B = M(""), V = M(!1), fe = M(""), pe = M(!1), U = v(() => !p(j.id ? "edit" : "add")), ge = v(() => F.value || R.value), W = "", J;
		async function Q(e) {
			J?.abort(), J = new AbortController();
			let t = J;
			Object.assign(j, k(), { id: e || "" }), fe.value = "", z.value = !1, B.value = "", V.value = !1, N.value = !0, P.value = !0, W = JSON.stringify(j);
			try {
				if (_.value = await o(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await l("categories", e, t.signal);
				if (_.value = await o(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(j, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), W = JSON.stringify(j);
			} catch (e) {
				t.signal.aborted || (V.value = !0, fe.value = r(e));
			} finally {
				t.signal.aborted || (P.value = !1);
			}
		}
		function Se() {
			return ge.value ? !1 : !P.value && !V.value && JSON.stringify(j) !== W ? (pe.value = !0, !1) : (J?.abort(), !0);
		}
		function Ce() {
			ge.value || (J?.abort(), N.value = !1);
		}
		function $() {
			pe.value = !1, N.value = !1;
		}
		async function we() {
			if (!(U.value || ge.value || P.value || V.value)) {
				if (!j.name.trim() || j.sort_order === null) {
					fe.value = "请填写分类名称和排序";
					return;
				}
				F.value = !0, fe.value = "";
				try {
					await ee("categories", {
						name: j.name,
						parent_id: j.parent_id || null,
						sort_order: j.sort_order,
						is_enabled: j.is_enabled,
						id: j.id || void 0,
						row_version: j.id ? j.row_version : void 0
					}), N.value = !1, d.success("保存成功"), await Promise.all([D(), ke()]);
				} catch (e) {
					fe.value = r(e);
				} finally {
					F.value = !1;
				}
			}
		}
		function Te() {
			!j.id || !p("delete") || ge.value || P.value || V.value || (B.value = "", z.value = !0);
		}
		async function Ee() {
			if (!(!z.value || !j.id || !p("delete") || ge.value || P.value || V.value)) {
				R.value = !0, B.value = "";
				try {
					await a("categories", j.id, j.row_version), z.value = !1, N.value = !1, d.success("分类已删除"), await Promise.all([D(), ke()]);
				} catch (e) {
					B.value = r(e);
				} finally {
					R.value = !1;
				}
			}
		}
		let De = v(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(_.value?.categories || []).filter((e) => !e.parent_id && e.id !== j.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Oe = new AbortController();
		async function ke() {
			try {
				h.value = await o(Oe.signal);
			} catch {}
		}
		return ue(ke), le(() => {
			J?.abort(), Oe.abort();
		}), (t, r) => (A(), x("div", X, [
			T(L(c), O(L(E), {
				"auto-refreshable": !1,
				columns: C,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${xe}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": H(({ row: e }) => [T(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": H(() => [p("add") ? (A(), y(L(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => Q()
				}, {
					icon: H(() => [T(L(m), {
						name: "plus",
						size: 14
					})]),
					default: H(() => [w("新增" + I(xe))]),
					_: 1
				})) : b("", !0)]),
				"cell-is_enabled": H(({ row: e }) => [T(L(te), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: H(() => [w(I(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": H(({ row: e }) => [T(L(n), {
					size: "sm",
					"icon-only": "",
					title: p("edit") ? `编辑${xe}` : `${xe}详情`,
					"aria-label": `编辑${xe}`,
					onClick: (t) => Q(e.id)
				}, {
					default: H(() => [T(L(m), {
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
			}, 16, ["aria-label"]),
			T(L(u), {
				modelValue: N.value,
				"onUpdate:modelValue": r[5] ||= (e) => N.value = e,
				title: `${j.id ? "编辑" : "新增"}新闻${xe}`,
				width: "680px",
				subtitle: "新闻分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Se
			}, {
				footer: H(() => [
					j.id && p("delete") ? (A(), y(L(n), {
						key: 0,
						variant: "danger",
						disabled: P.value || V.value || ge.value,
						onClick: Te
					}, {
						icon: H(() => [T(L(m), {
							name: "trash-2",
							size: 14
						})]),
						default: H(() => [r[11] ||= w("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					T(L(n), {
						disabled: ge.value,
						onClick: Ce
					}, {
						default: H(() => [...r[12] ||= [w("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					U.value ? b("", !0) : (A(), y(L(n), {
						key: 1,
						variant: "primary",
						loading: F.value,
						disabled: P.value || V.value || R.value,
						onClick: we
					}, {
						default: H(() => [w("保存" + I(xe))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: H(() => [S("div", {
					class: "taxonomy-editor",
					"aria-busy": P.value
				}, [
					P.value ? (A(), x("div", Z, [T(L(m), {
						name: "loader-circle",
						class: "news-spin",
						size: 24
					}), S("span", null, "正在读取" + I(xe) + "...")])) : b("", !0),
					fe.value ? (A(), y(L(re), {
						key: 1,
						type: "error",
						closable: !1,
						description: fe.value
					}, null, 8, ["description"])) : b("", !0),
					!P.value && !V.value ? (A(), y(L(oe), {
						key: 2,
						model: j,
						"label-position": "top",
						onSubmit: me(we, ["prevent"])
					}, {
						default: H(() => [
							j.id ? (A(), y(L(e), {
								key: 0,
								label: "分类ID"
							}, {
								default: H(() => [T(L(g), {
									"model-value": j.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : b("", !0),
							T(L(e), {
								label: `${xe}名称`,
								required: ""
							}, {
								default: H(() => [T(L(g), {
									modelValue: j.name,
									"onUpdate:modelValue": r[1] ||= (e) => j.name = e,
									maxlength: 120,
									disabled: U.value || ge.value,
									"aria-label": `${xe}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							T(L(e), { label: "父分类" }, {
								default: H(() => [S("div", ye, [T(L(ae), {
									modelValue: j.parent_id,
									"onUpdate:modelValue": r[2] ||= (e) => j.parent_id = e,
									options: De.value,
									disabled: U.value || ge.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), r[10] ||= S("p", { class: "news-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类新闻。 ", -1)])]),
								_: 1
							}),
							S("div", be, [T(L(e), {
								label: "前端排序",
								required: ""
							}, {
								default: H(() => [T(L(ie), {
									modelValue: j.sort_order,
									"onUpdate:modelValue": r[3] ||= (e) => j.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: U.value || ge.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), T(L(e), { label: "启用状态" }, {
								default: H(() => [T(Y, {
									modelValue: j.is_enabled,
									"onUpdate:modelValue": r[4] ||= (e) => j.is_enabled = e,
									disabled: U.value || ge.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : b("", !0)
				], 8, ve)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			T(L(u), {
				modelValue: z.value,
				"onUpdate:modelValue": r[7] ||= (e) => z.value = e,
				title: "删除新闻分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !R.value
			}, {
				footer: H(() => [T(L(n), {
					disabled: R.value,
					onClick: r[6] ||= (e) => z.value = !1
				}, {
					default: H(() => [...r[13] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(L(n), {
					variant: "danger",
					loading: R.value,
					onClick: Ee
				}, {
					default: H(() => [...r[14] ||= [w("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: H(() => [S("p", null, "确认删除分类“" + I(j.name) + "”？有关联新闻或子分类的分类无法删除。", 1), B.value ? (A(), y(L(re), {
					key: 0,
					type: "error",
					closable: !1,
					description: B.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			T(L(u), {
				modelValue: pe.value,
				"onUpdate:modelValue": r[9] ||= (e) => pe.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: H(() => [T(L(n), { onClick: r[8] ||= (e) => pe.value = !1 }, {
					default: H(() => [...r[15] ||= [w("继续编辑", -1)]]),
					_: 1
				}), T(L(n), {
					variant: "primary",
					onClick: $
				}, {
					default: H(() => [...r[16] ||= [w("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-30abf45a"]]), Se = {
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
function $(e, t, n, r, i = Date.now()) {
	let a = {}, o = Se[n];
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
function we(e, t) {
	let n = {}, r = [], i = Se[t], a = {
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
function Te(e, t, n, r) {
	let i = M(), a = M(), o = M(null), s = M(Date.now()), c = de({}), l = M(""), u = Object.fromEntries(Ce.map((e) => [e, {
		required: e === "title" || e === "category_id",
		trigger: "submit"
	}])), ee = v(() => o.value ? $(e, t(), n, o.value === "draft" ? "draft" : e.scheduled_local ? "scheduled" : "published", s.value) : {}), te = v(() => ({
		...c,
		...ee.value
	})), d = v(() => Object.keys(te.value).length);
	for (let t of Ce) V(() => e[t], () => {
		delete c[t], l.value = "", s.value = Date.now();
	}, { deep: !0 });
	function f() {
		te.value.seo_description && a.value?.focus();
	}
	async function ne() {
		await ce();
		let e = [...i.value?.querySelectorAll("[data-prop]") || []].find((e) => te.value[e.dataset.prop]);
		if (!e && te.value.seo_description) {
			r.value ? f() : r.value = !0;
			return;
		}
		e && (e.scrollIntoView({
			block: "center",
			behavior: "auto"
		}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
	}
	async function re(e) {
		o.value = e === "draft" ? "draft" : "publish", s.value = Date.now(), l.value = "";
		for (let e of Ce) delete c[e];
		return d.value ? (await ne(), !1) : !0;
	}
	function ie(e) {
		let t = we(e, n);
		Object.assign(c, t.fields), l.value = t.general;
	}
	return {
		editorRoot: i,
		seoInput: a,
		fieldRules: u,
		fieldErrors: te,
		pendingCount: d,
		saveError: l,
		validateSave: re,
		setSaveFailure: ie,
		focusFirstError: ne,
		focusSeoError: f
	};
}
//#endregion
//#region src/cms/views/content/components/CoverFileItem.vue?vue&type=script&setup=true&lang.ts
var Ee = {
	class: "file-list",
	"aria-label": "封面文件"
}, De = { class: "file-item" }, Oe = { class: "file-icon" }, ke = ["src"], Ae = [
	"href",
	"download",
	"title",
	"aria-busy",
	"aria-disabled"
], je = { class: "file-size" }, Me = ["disabled"], Ne = {
	key: 0,
	class: "file-error",
	role: "alert"
}, Pe = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "CoverFileItem",
	props: {
		url: {},
		file: {},
		disabled: { type: Boolean }
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = M(null), a = M(!1), o = M(!1), s = M(""), c, l = v(() => {
			try {
				let e = new URL(n.url, window.location.href);
				return ["http:", "https:"].includes(e.protocol) ? e.href : "";
			} catch {
				return "";
			}
		}), u = v(() => {
			if (n.file) return n.file.name;
			let e = l.value ? new URL(l.value).pathname.split("/").pop() : "";
			if (!e) return "封面图片";
			try {
				return decodeURIComponent(e);
			} catch {
				return e;
			}
		}), ee = v(() => i.value === null ? "大小未知" : i.value < 1024 ? `${i.value} B` : i.value < 1024 * 1024 ? `${(i.value / 1024).toFixed(1)} KB` : `${(i.value / (1024 * 1024)).toFixed(1)} MB`);
		V(() => [n.url, n.file], async (e, t, r) => {
			if (c?.abort(), c = void 0, o.value = !1, s.value = "", a.value = !1, i.value = n.file?.size ?? null, n.file || !l.value) return;
			let u = new AbortController(), ee = window.setTimeout(() => u.abort(), 5e3);
			r(() => {
				u.abort(), window.clearTimeout(ee);
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
				window.clearTimeout(ee);
			}
		}, { immediate: !0 });
		async function te() {
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
		return le(() => {
			c?.abort(), c = void 0;
		}), (t, n) => (A(), x("div", Ee, [S("div", De, [
			S("span", Oe, [a.value ? (A(), y(L(m), {
				key: 1,
				name: "image",
				size: 20
			})) : (A(), x("img", {
				key: 0,
				src: e.url,
				alt: "封面缩略图",
				onError: n[0] ||= (e) => a.value = !0
			}, null, 40, ke))]),
			S("a", {
				class: "file-name",
				href: l.value || void 0,
				download: u.value,
				title: u.value,
				"aria-busy": o.value,
				"aria-disabled": o.value || !l.value,
				onClick: me(te, ["prevent", "stop"])
			}, I(u.value), 9, Ae),
			S("span", je, I(ee.value), 1),
			S("button", {
				class: "file-remove",
				type: "button",
				"aria-label": "移除封面",
				title: "移除封面",
				disabled: e.disabled,
				onClick: n[1] ||= me((e) => r("remove"), ["stop"])
			}, [T(L(m), {
				name: "close",
				size: 14
			})], 8, Me)
		]), s.value ? (A(), x("span", Ne, I(s.value), 1)) : b("", !0)]));
	}
}), [["__scopeId", "data-v-389015f1"]]), Fe = { class: "content-cover" }, Ie = { class: "content-cover__preview" }, Le = ["src", "alt"], Re = {
	key: 1,
	class: "content-cover__empty"
}, ze = {
	key: 2,
	class: "content-cover__hint"
}, Be = {
	key: 0,
	class: "content-cover__error",
	role: "status"
}, Ve = /*#__PURE__*/ _(/* @__PURE__ */ E({
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
		let n = e, r = t, i = M(), a = F(), o = M(!1), s = M(!1), c;
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
			ce(() => i.value?.clearFiles());
		}
		function ee() {
			r("success"), u();
		}
		function te(e, t) {
			r("error", c ? c.error : t), c = void 0, u();
		}
		function d() {
			n.disabled || o.value || (a.value = void 0, s.value = !1, r("update:modelValue", ""), r("update:mediaId", null));
		}
		return (t, n) => (A(), x("div", Fe, [
			T(L(ne), {
				ref_key: "uploadRef",
				ref: i,
				class: "content-cover__upload",
				drag: "",
				accept: "image/jpeg,image/png,image/webp",
				limit: 1,
				"max-size": 5242880,
				disabled: e.disabled || o.value,
				request: l,
				onSuccess: ee,
				onError: te,
				onExceed: n[2] ||= (e) => r("error", /* @__PURE__ */ Error("一次只能上传一张封面图片"))
			}, {
				default: H(() => [S("div", Ie, [e.modelValue ? (A(), x("img", {
					key: 0,
					src: e.modelValue,
					alt: e.label,
					draggable: "false",
					onError: n[0] ||= (e) => s.value = !0,
					onLoad: n[1] ||= (e) => s.value = !1
				}, null, 40, Le)) : (A(), x("div", Re, [T(L(m), {
					name: "image",
					size: 28
				})])), e.modelValue ? b("", !0) : (A(), x("span", ze, [w(I(o.value ? "正在上传…" : "拖动图片到此处，或点击上传") + " ", 1), n[3] ||= S("span", { class: "content-cover__types" }, "JPG / PNG / WebP，最大 5 MB", -1)]))])]),
				_: 1
			}, 8, ["disabled"]),
			s.value ? (A(), x("span", Be, " 封面无法加载，请重新上传 ")) : b("", !0),
			e.modelValue ? (A(), y(Pe, {
				key: 1,
				url: e.modelValue,
				file: a.value?.url === e.modelValue ? a.value.file : void 0,
				disabled: e.disabled || o.value,
				onRemove: d
			}, null, 8, [
				"url",
				"file",
				"disabled"
			])) : b("", !0)
		]));
	}
}), [["__scopeId", "data-v-46fbc9a4"]]), He = ["aria-busy"], Ue = { class: "article-editor__header" }, We = { class: "article-editor__heading" }, Ge = { class: "article-editor__commands" }, Ke = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, qe = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Je = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, Ye = {
	key: 1,
	class: "article-editor__failure"
}, Xe = {
	key: 0,
	class: "article-editor__error"
}, Ze = { class: "article-editor__body" }, Qe = { class: "article-editor__settings" }, $e = { class: "article-editor__content" }, et = ["aria-invalid", "disabled"], tt = ["aria-invalid", "disabled"], nt = {
	class: "news-delete-dialog__icon",
	"aria-hidden": "true"
}, rt = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: i }) {
		let { newsError: a, newsCategoryLabel: o, deleteNews: s, getNewsDetail: c, getNewsMetadata: l, saveNews: ee, uploadNewsCover: te } = q(), { hasPermission: f, mode: ne } = he(), p = t, h = i, _ = M(!0), E = M(!1), D = M(!1), O = M(""), ce = M(!1), k = M(!1), j = M(!1), N = M(!1), P = M(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), F = M(), R = M("draft"), B = M(!1), V = v(() => f(["cms_news:publish"])), pe = v(() => !f([`cms_news:${p.articleId ? "edit" : "add"}`]) || !V.value && R.value !== "draft"), U = v(() => f(["cms_news:delete"]) && (V.value || R.value === "draft"));
		async function W() {
			if (!(!U.value || E.value || _.value || D.value)) {
				E.value = !0, O.value = "";
				try {
					await s("articles", K.id, K.row_version), $ = JSON.stringify(K), d.success("新闻已删除"), h("saved");
				} catch (e) {
					O.value = a(e), N.value = !1;
				} finally {
					E.value = !1;
				}
			}
		}
		let G = v(() => pe.value || E.value), K = de({
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
		}), { editorRoot: _e, seoInput: J, fieldRules: X, fieldErrors: ve, pendingCount: Z, saveError: ye, validateSave: be, setSaveFailure: xe, focusFirstError: Q, focusSeoError: Se } = Te(K, () => F.value?.categories || [], "news", ce), Ce = v(() => (F.value?.categories || []).map((e) => ({
			label: o(F.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), $ = "", we;
		function Ee(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function De() {
			we?.abort(), we = new AbortController();
			let e = we;
			_.value = !0, D.value = !1, O.value = "";
			try {
				if (F.value = await l(e.signal, { cms_source_type: "platform" }), p.articleId) {
					let t = await c("articles", p.articleId, e.signal);
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
					K.scheduled_local = t.publish_status === "scheduled" ? Ee(t.scheduled_at) : "", R.value = t.publish_status;
				}
				$ = JSON.stringify(K);
			} catch (t) {
				e.signal.aborted || (O.value = a(t), D.value = !0);
			} finally {
				e.signal.aborted || (_.value = !1);
			}
		}
		let Oe = () => !_.value && !D.value && $ !== JSON.stringify(K);
		function ke() {
			Oe() ? k.value = !0 : h("close");
		}
		function Ae() {
			R.value === "draft" ? Me("draft") : j.value = !0;
		}
		function je() {
			j.value = !1, Me("draft");
		}
		async function Me(e) {
			if (G.value || _.value || D.value || B.value || (O.value = "", !await be(e))) return;
			let t = K.scheduled_local ? new Date(K.scheduled_local) : null;
			E.value = !0, O.value = "";
			try {
				await ee("articles", {
					...K,
					id: K.id || void 0,
					row_version: K.id ? K.row_version : void 0,
					category_id: K.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), $ = JSON.stringify(K), d.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "新闻已发布"), h("saved");
			} catch (e) {
				xe(e);
			} finally {
				E.value = !1;
			}
			Z.value && await Q();
		}
		function Ne(e) {
			O.value = a(e);
		}
		let Pe = (e) => {
			Oe() && (e.preventDefault(), e.returnValue = "");
		};
		return ge(() => !E.value && !B.value && (!Oe() || window.confirm("新闻有未保存的修改，确定离开？"))), ue(() => {
			De(), window.addEventListener("beforeunload", Pe);
		}), le(() => {
			we?.abort(), window.removeEventListener("beforeunload", Pe);
		}), (i, a) => (A(), x("section", {
			ref_key: "editorRoot",
			ref: _e,
			class: "article-editor",
			"aria-busy": _.value || E.value
		}, [
			S("header", Ue, [
				T(L(n), {
					"icon-only": "",
					title: "返回新闻列表",
					"aria-label": "返回新闻列表",
					disabled: E.value || B.value,
					onClick: ke
				}, {
					default: H(() => [T(L(m), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				S("div", We, [S("h2", null, I(t.articleId ? "编辑新闻" : "新增新闻"), 1), S("span", null, I(F.value?.source_locale || "zh-CN") + " · " + I(P.value), 1)]),
				S("div", Ge, [
					t.articleId && U.value ? (A(), y(L(n), {
						key: 0,
						size: "sm",
						disabled: _.value || D.value || E.value || B.value,
						onClick: a[0] ||= (e) => N.value = !0
					}, {
						default: H(() => [...a[28] ||= [w("删除新闻", -1)]]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					T(L(n), {
						size: "sm",
						disabled: _.value || D.value,
						onClick: a[1] ||= (e) => ce.value = !0
					}, {
						icon: H(() => [T(L(m), {
							name: "search",
							size: 14
						})]),
						default: H(() => [a[29] ||= w("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					pe.value ? b("", !0) : (A(), y(L(n), {
						key: 1,
						size: "sm",
						disabled: _.value || D.value || E.value || B.value,
						onClick: Ae
					}, {
						icon: H(() => [T(L(m), {
							name: "save",
							size: 14
						})]),
						default: H(() => [a[30] ||= w("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					L(ye) ? (A(), x("span", Ke, I(L(ye)), 1)) : b("", !0),
					!pe.value && L(Z) ? (A(), x("span", qe, "还有 " + I(L(Z)) + " 项待完善", 1)) : b("", !0),
					!pe.value && V.value ? (A(), y(L(n), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: _.value || D.value || B.value,
						loading: E.value,
						onClick: a[2] ||= (e) => Me(K.scheduled_local ? "scheduled" : "published")
					}, {
						icon: H(() => [T(L(m), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: H(() => [w(I(K.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : b("", !0)
				])
			]),
			_.value ? (A(), x("div", Je, [T(L(m), {
				name: "loader-circle",
				class: "news-spin",
				size: 28
			}), a[31] ||= S("span", null, "正在读取新闻资料...", -1)])) : D.value ? (A(), x("div", Ye, [T(L(re), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"]), T(L(n), { onClick: De }, {
				default: H(() => [...a[32] ||= [w("重新加载", -1)]]),
				_: 1
			})])) : (A(), x(se, { key: 2 }, [O.value ? (A(), x("div", Xe, [T(L(re), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"])])) : b("", !0), S("div", Ze, [S("aside", Qe, [T(L(oe), {
				model: K,
				rules: L(X),
				"label-position": "top",
				onSubmit: a[12] ||= me(() => {}, ["prevent"])
			}, {
				default: H(() => [
					T(L(e), {
						label: "新闻分类",
						prop: "category_id",
						error: L(ve).category_id,
						required: ""
					}, {
						default: H(() => [T(L(ae), {
							modelValue: K.category_id,
							"onUpdate:modelValue": a[3] ||= (e) => K.category_id = e,
							options: Ce.value,
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
					a[33] ||= S("h3", null, "新闻设置", -1),
					T(L(e), {
						label: "新闻封面",
						prop: "cover_url",
						error: L(ve).cover_url
					}, {
						default: H(() => [T(Ve, {
							modelValue: K.cover_url,
							"onUpdate:modelValue": a[4] ||= (e) => K.cover_url = e,
							label: "新闻封面",
							disabled: G.value,
							upload: L(te),
							onBusyChange: a[5] ||= (e) => B.value = e,
							onStart: a[6] ||= (e) => O.value = "",
							onError: Ne
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "内容来源",
						prop: "content_source",
						error: L(ve).content_source
					}, {
						default: H(() => [T(L(g), {
							modelValue: K.content_source,
							"onUpdate:modelValue": a[7] ||= (e) => K.content_source = e,
							maxlength: 160,
							disabled: G.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "作者署名",
						prop: "author_name",
						error: L(ve).author_name
					}, {
						default: H(() => [T(L(g), {
							modelValue: K.author_name,
							"onUpdate:modelValue": a[8] ||= (e) => K.author_name = e,
							maxlength: 120,
							disabled: G.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "前端排序",
						prop: "sort_order",
						error: L(ve).sort_order
					}, {
						default: H(() => [T(L(ie), {
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
					a[34] ||= S("h3", null, "发布设置", -1),
					T(L(e), {
						label: "启用状态",
						prop: "is_enabled",
						error: L(ve).is_enabled
					}, {
						default: H(() => [T(Y, {
							modelValue: K.is_enabled,
							"onUpdate:modelValue": a[10] ||= (e) => K.is_enabled = e,
							disabled: G.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: L(ve).scheduled_local
					}, {
						default: H(() => [T(L(g), {
							modelValue: K.scheduled_local,
							"onUpdate:modelValue": a[11] ||= (e) => K.scheduled_local = e,
							type: "datetime-local",
							disabled: G.value || !V.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[35] ||= S("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), S("main", $e, [T(L(oe), {
				model: K,
				rules: L(X),
				"label-position": "top",
				onSubmit: a[16] ||= me(() => {}, ["prevent"])
			}, {
				default: H(() => [
					T(L(e), {
						label: "标题",
						prop: "title",
						error: L(ve).title,
						required: ""
					}, {
						default: H(() => [T(L(g), {
							modelValue: K.title,
							"onUpdate:modelValue": a[13] ||= (e) => K.title = e,
							maxlength: 255,
							disabled: G.value,
							placeholder: "输入新闻标题",
							"aria-label": "新闻标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "摘要",
						prop: "summary",
						error: L(ve).summary
					}, {
						default: H(() => [fe(S("textarea", {
							"onUpdate:modelValue": a[14] ||= (e) => K.summary = e,
							"aria-invalid": !!L(ve).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: G.value,
							"aria-label": "新闻摘要"
						}, null, 8, et), [[z, K.summary]])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "正文",
						prop: "body_html",
						error: L(ve).body_html
					}, {
						default: H(() => [T(L(r), {
							modelValue: K.body_html,
							"onUpdate:modelValue": a[15] ||= (e) => K.body_html = e,
							readonly: pe.value,
							disabled: E.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "新闻正文"
						}, C({ _: 2 }, [L(ne) === "platform" ? {
							name: "image-upload",
							fn: H(({ url: e, setUrl: t, setBusy: n }) => [T(Ve, {
								label: "正文图片",
								"model-value": e,
								upload: L(te),
								"onUpdate:modelValue": t,
								onBusyChange: n,
								onError: Ne
							}, null, 8, [
								"model-value",
								"upload",
								"onUpdate:modelValue",
								"onBusyChange"
							])]),
							key: "0"
						} : void 0]), 1032, [
							"modelValue",
							"readonly",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])])])], 64)),
			T(L(u), {
				modelValue: ce.value,
				"onUpdate:modelValue": a[20] ||= (e) => ce.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: H(() => [T(L(n), {
					variant: "primary",
					onClick: a[19] ||= (e) => ce.value = !1
				}, {
					default: H(() => [...a[36] ||= [w("确定", -1)]]),
					_: 1
				})]),
				default: H(() => [T(L(oe), {
					model: K,
					rules: L(X),
					"label-position": "top",
					onSubmit: a[18] ||= me(() => {}, ["prevent"])
				}, {
					default: H(() => [T(L(e), {
						label: "SEO 描述",
						prop: "seo_description",
						error: L(ve).seo_description
					}, {
						default: H(() => [fe(S("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": a[17] ||= (e) => K.seo_description = e,
							"aria-invalid": !!L(ve).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: G.value,
							"aria-label": "SEO 描述"
						}, null, 8, tt), [[z, K.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			T(L(u), {
				modelValue: N.value,
				"onUpdate:modelValue": a[22] ||= (e) => N.value = e,
				title: "确认删除",
				subtitle: `操作对象：${K.title || "未命名新闻"}`,
				width: "460px",
				"panel-class": "news-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !E.value
			}, {
				"header-actions": H(() => [S("span", nt, [T(L(m), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: H(() => [T(L(n), {
					disabled: E.value,
					onClick: a[21] ||= (e) => N.value = !1
				}, {
					default: H(() => [...a[37] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(L(n), {
					variant: "warning",
					loading: E.value,
					onClick: W
				}, {
					default: H(() => [...a[38] ||= [w("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: H(() => [T(L(re), {
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
			T(L(u), {
				modelValue: k.value,
				"onUpdate:modelValue": a[25] ||= (e) => k.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: H(() => [T(L(n), { onClick: a[23] ||= (e) => k.value = !1 }, {
					default: H(() => [...a[39] ||= [w("继续编辑", -1)]]),
					_: 1
				}), T(L(n), {
					variant: "primary",
					onClick: a[24] ||= (e) => h("close")
				}, {
					default: H(() => [...a[40] ||= [w("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			T(L(u), {
				modelValue: j.value,
				"onUpdate:modelValue": a[27] ||= (e) => j.value = e,
				title: "将新闻转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: H(() => [T(L(n), { onClick: a[26] ||= (e) => j.value = !1 }, {
					default: H(() => [...a[41] ||= [w("取消", -1)]]),
					_: 1
				}), T(L(n), {
					variant: "primary",
					onClick: je
				}, {
					default: H(() => [...a[42] ||= [w("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, He));
	}
}), [["__scopeId", "data-v-9f68916a"]]), it = { class: "news-articles" }, at = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(e) {
		let { newsPublishStates: t, newsCategoryLabel: r, getNewsList: a, getNewsMetadata: o } = q(), { hasPermission: s } = he(), { formatDateTime: l } = he(), u = M(!1), ee = M(), d = (e) => s([`cms_news:${e}`]), f = M(), ne = K(o, (e) => {
			f.value = e;
		}), re = [
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
		], { proTableBindings: ie, reload: ae, filters: oe } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
				...ne.fields,
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
		ne.bindFilters(oe);
		let p = new AbortController();
		async function h() {
			try {
				f.value = await o(p.signal);
			} catch {}
		}
		function g(e) {
			ee.value = e, u.value = !0;
		}
		function _() {
			u.value = !1, ae(), h();
		}
		return ue(h), le(() => p.abort()), (e, r) => (A(), x("div", it, [u.value ? (A(), y(rt, {
			key: 0,
			"article-id": ee.value,
			onClose: r[0] ||= (e) => u.value = !1,
			onSaved: _
		}, null, 8, ["article-id"])) : b("", !0), fe(T(L(c), O(L(ie), {
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
			"cell-cms_source_type": H(({ row: e }) => [T(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": H(() => [d("add") ? (A(), y(L(n), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: r[1] ||= (e) => g()
			}, {
				icon: H(() => [T(L(m), {
					name: "plus",
					size: 14
				})]),
				default: H(() => [r[2] ||= w("新增新闻", -1)]),
				_: 1
			})) : b("", !0)]),
			"cell-publish_status": H(({ row: e }) => [T(L(te), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: H(() => [w(I(L(t).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": H(({ row: e }) => [T(L(te), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: H(() => [w(I(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": H(({ row: e }) => [w(I(L(l)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": H(({ row: e }) => [T(L(n), {
				size: "sm",
				"icon-only": "",
				title: d("edit") ? "编辑新闻" : "新闻详情",
				"aria-label": d("edit") ? "编辑新闻" : "新闻详情",
				onClick: (t) => g(e.id)
			}, {
				default: H(() => [T(L(m), {
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
		}, 16), [[B, !u.value]])]));
	}
}), [["__scopeId", "data-v-aef51e21"]]);
//#endregion
//#region src/cms/api/content/academy.ts
function ot() {
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
		uploadAcademyCover: (n, r) => {
			let i = new FormData();
			return i.append("file", n), e.post({
				url: `${t}/upload`,
				data: i,
				signal: r,
				headers: { "Content-Type": "multipart/form-data" }
			}, { isOpenRetry: !1 });
		},
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
var st = ["aria-busy"], ct = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, lt = { class: "taxonomy-editor__row" }, ut = "分类", dt = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "CategoryTable",
	setup(t) {
		let { hasPermission: r } = he(), { formatDateTime: a } = he(), { academyDifficulties: s, academyError: l, getAcademyList: ee, getAcademyMetadata: f, getAcademyDetail: ne, saveAcademy: p, deleteAcademyCategory: h } = ot(), _ = (e) => r([`cms_academy_category:${e}`]), C = K(f), E = [
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
		], { proTableBindings: D, reload: ce, currentPage: k, pageSize: ue, total: j, filters: N } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: [
				...C.fields,
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
		});
		C.bindFilters(N);
		let P = () => ({
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
		}), F = de(P()), R = M(!1), z = M(!1), B = M(!1), V = M(!1), fe = M(!1), pe = M(""), U = M(!1), ge = M(""), W = M(!1), q = v(() => !_(F.id ? "edit" : "add")), J = v(() => B.value || V.value), Y = "", X;
		async function ve(e) {
			X?.abort(), X = new AbortController();
			let t = X;
			if (Object.assign(F, P(), { id: e || "" }), ge.value = "", fe.value = !1, pe.value = "", U.value = !1, R.value = !0, z.value = !!e, Y = JSON.stringify(F), e) try {
				let n = await ne("categories", e, t.signal);
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
				}), Y = JSON.stringify(F);
			} catch (e) {
				t.signal.aborted || (U.value = !0, ge.value = l(e));
			} finally {
				t.signal.aborted || (z.value = !1);
			}
		}
		function Z() {
			return J.value ? !1 : !z.value && !U.value && JSON.stringify(F) !== Y ? (W.value = !0, !1) : (X?.abort(), !0);
		}
		function ye() {
			J.value || (X?.abort(), R.value = !1);
		}
		function be() {
			W.value = !1, R.value = !1;
		}
		async function xe() {
			if (!(q.value || J.value || z.value || U.value)) {
				if (!F.name.trim() || F.sort_order === null || !F.difficulty_levels.length) {
					ge.value = "请填写名称、排序和适用难度";
					return;
				}
				B.value = !0, ge.value = "";
				try {
					await p("categories", {
						...F,
						id: F.id || void 0,
						row_version: F.id ? F.row_version : void 0
					}), R.value = !1, d.success("保存成功"), await ce();
				} catch (e) {
					ge.value = l(e);
				} finally {
					B.value = !1;
				}
			}
		}
		function Q() {
			!F.id || !_("delete") || J.value || z.value || U.value || (pe.value = "", fe.value = !0);
		}
		async function Se() {
			if (!(!fe.value || !F.id || !_("delete") || J.value || z.value || U.value)) {
				V.value = !0, pe.value = "";
				try {
					await h({
						id: F.id,
						row_version: F.row_version
					}), fe.value = !1, R.value = !1, d.success("分类已删除"), await ce(), k.value = Math.min(k.value, Math.max(1, Math.ceil(j.value / ue.value)));
				} catch (e) {
					pe.value = l(e);
				} finally {
					V.value = !1;
				}
			}
		}
		return le(() => X?.abort()), (t, r) => (A(), x(se, null, [
			T(L(c), O(L(D), {
				"auto-refreshable": !1,
				columns: E,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${ut}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": H(({ row: e }) => [T(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": H(() => [_("add") ? (A(), y(L(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => ve()
				}, {
					icon: H(() => [T(L(m), {
						name: "plus",
						size: 14
					})]),
					default: H(() => [w("新增" + I(ut))]),
					_: 1
				})) : b("", !0)]),
				"cell-is_enabled": H(({ row: e }) => [T(L(te), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: H(() => [w(I(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": H(({ row: e }) => [T(L(n), {
					size: "sm",
					"icon-only": "",
					title: _("edit") ? `编辑${ut}` : `${ut}详情`,
					"aria-label": `编辑${ut}`,
					onClick: (t) => ve(e.id)
				}, {
					default: H(() => [T(L(m), {
						name: _("edit") ? "square-pen" : "panel-right-open",
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
			T(L(u), {
				modelValue: R.value,
				"onUpdate:modelValue": r[5] ||= (e) => R.value = e,
				title: `${F.id ? "编辑" : "新增"}课程${ut}`,
				width: "620px",
				"close-on-click-modal": !1,
				"before-close": Z
			}, {
				footer: H(() => [
					F.id && _("delete") ? (A(), y(L(n), {
						key: 0,
						variant: "danger",
						disabled: z.value || U.value || J.value,
						onClick: Q
					}, {
						icon: H(() => [T(L(m), {
							name: "trash-2",
							size: 14
						})]),
						default: H(() => [r[10] ||= w("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					T(L(n), {
						disabled: J.value,
						onClick: ye
					}, {
						default: H(() => [...r[11] ||= [w("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					q.value ? b("", !0) : (A(), y(L(n), {
						key: 1,
						variant: "primary",
						loading: B.value,
						disabled: z.value || U.value || V.value,
						onClick: xe
					}, {
						default: H(() => [w("保存" + I(ut))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: H(() => [S("div", {
					class: "taxonomy-editor",
					"aria-busy": z.value
				}, [
					z.value ? (A(), x("div", ct, [T(L(m), {
						name: "loader-circle",
						class: "academy-spin",
						size: 24
					}), S("span", null, "正在读取" + I(ut) + "...")])) : b("", !0),
					ge.value ? (A(), y(L(re), {
						key: 1,
						type: "error",
						closable: !1,
						description: ge.value
					}, null, 8, ["description"])) : b("", !0),
					!z.value && !U.value ? (A(), y(L(oe), {
						key: 2,
						model: F,
						"label-position": "top",
						onSubmit: me(xe, ["prevent"])
					}, {
						default: H(() => [
							T(L(e), {
								label: `${ut}名称`,
								required: ""
							}, {
								default: H(() => [T(L(g), {
									modelValue: F.name,
									"onUpdate:modelValue": r[1] ||= (e) => F.name = e,
									maxlength: 120,
									disabled: q.value || J.value,
									"aria-label": `${ut}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							T(L(e), {
								label: "适用难度",
								required: ""
							}, {
								default: H(() => [T(L(ae), {
									modelValue: F.difficulty_levels,
									"onUpdate:modelValue": r[2] ||= (e) => F.difficulty_levels = e,
									multiple: "",
									options: L(s),
									disabled: q.value || J.value,
									"aria-label": "适用难度"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								])]),
								_: 1
							}),
							S("div", lt, [T(L(e), {
								label: "前端排序",
								required: ""
							}, {
								default: H(() => [T(L(ie), {
									modelValue: F.sort_order,
									"onUpdate:modelValue": r[3] ||= (e) => F.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: q.value || J.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), T(L(e), { label: "启用状态" }, {
								default: H(() => [T(L(o), {
									modelValue: F.is_enabled,
									"onUpdate:modelValue": r[4] ||= (e) => F.is_enabled = e,
									disabled: q.value || J.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : b("", !0)
				], 8, st)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			T(L(u), {
				modelValue: fe.value,
				"onUpdate:modelValue": r[7] ||= (e) => fe.value = e,
				title: "删除课程分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !V.value
			}, {
				footer: H(() => [T(L(n), {
					disabled: V.value,
					onClick: r[6] ||= (e) => fe.value = !1
				}, {
					default: H(() => [...r[12] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(L(n), {
					variant: "danger",
					loading: V.value,
					onClick: Se
				}, {
					default: H(() => [...r[13] ||= [w("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: H(() => [S("p", null, "确认删除分类“" + I(F.name) + "”？有关联课程的分类无法删除。", 1), pe.value ? (A(), y(L(re), {
					key: 0,
					type: "error",
					closable: !1,
					description: pe.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			T(L(u), {
				modelValue: W.value,
				"onUpdate:modelValue": r[9] ||= (e) => W.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: H(() => [T(L(n), { onClick: r[8] ||= (e) => W.value = !1 }, {
					default: H(() => [...r[14] ||= [w("继续编辑", -1)]]),
					_: 1
				}), T(L(n), {
					variant: "primary",
					onClick: be
				}, {
					default: H(() => [...r[15] ||= [w("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 64));
	}
}), [["__scopeId", "data-v-b7830575"]]), ft = { class: "academy-categories" }, pt = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(e) {
		return (e, t) => (A(), x("div", ft, [T(dt)]));
	}
}), [["__scopeId", "data-v-8f5e5114"]]), mt = [
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
function ht(e) {
	if (/[\x00-\x20\\]/.test(e)) return !1;
	if (e.startsWith("/") && !e.startsWith("//")) return !0;
	try {
		let t = new URL(e);
		return /^https?:\/\//i.test(e) && ["http:", "https:"].includes(t.protocol);
	} catch {
		return !1;
	}
}
function gt(e) {
	return e.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "").replace(/&nbsp;|&#0*(?:160|9|10|13|32);|&#x0*(?:a0|9|a|d|20);/gi, " ").trim().length > 0;
}
function _t(e, t, n, r = Date.now()) {
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
	(e.sort_order === null || !Number.isInteger(e.sort_order) || e.sort_order < 0 || e.sort_order > 2147483647) && (i.sort_order = "请填写 0–2147483647 之间的整数"), e.cover_url && !ht(e.cover_url) && (i.cover_url = "封面地址必须为 HTTP(S) 或站内绝对路径");
	let o = e.category_ids.map((e) => t.find((t) => t.id === e));
	if (a && !o.length ? i.category_ids = "请选择课程分类" : o.some((e) => !e) ? i.category_ids = "所选分类已不可用，请重新选择" : a && o.some((e) => !e?.is_enabled) ? i.category_ids = "发布课程必须选择已启用的分类" : o.length > 50 && (i.category_ids = "最多选择 50 个课程分类"), a && !e.difficulty_level ? i.difficulty_level = "请选择课程难度" : e.difficulty_level !== "" && ![
		1,
		2,
		3
	].includes(e.difficulty_level) ? i.difficulty_level = "请选择有效的课程难度" : e.difficulty_level && o.some((t) => t && !t.difficulty_levels.includes(Number(e.difficulty_level))) && (i.difficulty_level = "课程难度不在所选分类的适用范围内"), a && e.estimated_minutes === null ? i.estimated_minutes = "请填写预计课时" : e.estimated_minutes !== null && (!Number.isInteger(e.estimated_minutes) || e.estimated_minutes < 1 || e.estimated_minutes > 1e5) && (i.estimated_minutes = "预计课时须为 1–100000 之间的整数"), a && !gt(e.body_html) && (i.body_html = "请填写课程正文"), n === "scheduled") {
		let t = new Date(e.scheduled_local).getTime();
		(!Number.isFinite(t) || t <= r) && (i.scheduled_local = "计划发布时间必须晚于当前时间");
	}
	return i;
}
var vt = {
	课程标题不能为空: "title",
	"封面地址必须为 HTTP(S) 或站内绝对路径": "cover_url",
	计划发布时间必须晚于当前时间: "scheduled_local",
	发布课程必须选择分类: "category_ids",
	所选分类不存在或不属于当前学院模板: "category_ids",
	"发布课程必须选择已启用的分类，存在已停用分类": "category_ids",
	课程难度不在所选分类的适用范围内: "difficulty_level",
	"发布课程需要填写正文、课程难度及预计课时": "body_html"
};
function yt(e) {
	let t = {}, n = [], r = e && typeof e == "object" ? e : {};
	for (let [e, i] of Object.entries(r.errors || {})) {
		let r = e.split(".")[0], a = r === "scheduled_at" ? "scheduled_local" : r;
		for (let r of Array.isArray(i) ? i : [i]) {
			if (typeof r != "string" || !r) continue;
			let i = mt.includes(a) ? a : e === "academy" ? vt[r] : void 0;
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
var bt = ["aria-busy"], xt = { class: "course-editor__header" }, St = { class: "course-editor__heading" }, Ct = { class: "course-editor__commands" }, wt = {
	key: 2,
	class: "course-editor__save-error",
	role: "alert"
}, Tt = {
	key: 3,
	class: "course-editor__publish-actions"
}, Et = {
	key: 0,
	class: "course-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Dt = {
	key: 0,
	class: "course-editor__loading",
	role: "status"
}, Ot = {
	key: 1,
	class: "course-editor__failure"
}, kt = {
	key: 2,
	class: "course-editor__body"
}, At = { class: "course-editor__settings" }, jt = { class: "course-editor__content" }, Mt = ["disabled", "aria-invalid"], Nt = ["disabled", "aria-invalid"], Pt = {
	class: "course-delete-dialog__icon",
	"aria-hidden": "true"
}, Ft = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "CourseEditor",
	props: { courseId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: i }) {
		let { hasPermission: a, mode: s, request: c } = he(), ee = l(c, "/cms/academy/body-image/upload"), { academyDifficulties: te, academyError: f, deleteAcademyCourse: ne, getAcademyDetail: p, getAcademyMetadata: h, saveAcademy: _, uploadAcademyCover: se } = ot(), E = t, D = i, O = M(!0), k = M(!1), j = M(!1), N = M(""), P = M(!1), F = M(!1), R = M(!1), B = M(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), pe = M(), U = M("draft"), W = M(!1), G = M(!1), K = M(""), _e = v(() => a(["cms_academy:publish"])), q = v(() => !!E.courseId && a(["cms_academy:delete"]) && (_e.value || U.value === "draft")), J = v(() => !a([`cms_academy:${E.courseId ? "edit" : "add"}`]) || !_e.value && U.value !== "draft"), Y = v(() => J.value || k.value), X = de({
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
		}), ve = M(), Z = M(), ye = M(null), be = M(Date.now()), xe = de({}), Q = M(""), Se = Object.fromEntries(mt.map((e) => [e, {
			required: e === "title" || e === "category_ids",
			trigger: "submit"
		}])), Ce = v(() => ye.value ? _t(X, pe.value?.categories || [], ye.value === "draft" ? "draft" : X.scheduled_local ? "scheduled" : "published", be.value) : {}), $ = v(() => ({
			...xe,
			...Ce.value
		})), we = v(() => Object.keys($.value).length);
		for (let e of mt) V(() => X[e], () => {
			delete xe[e], e === "category_ids" && delete xe.difficulty_level, Q.value = "", be.value = Date.now();
		}, { deep: !0 });
		function Te() {
			$.value.seo_description && Z.value?.focus();
		}
		async function Ee() {
			await ce();
			let e = [...ve.value?.querySelectorAll("[data-prop]") || []].find((e) => $.value[e.dataset.prop]);
			if (!e && $.value.seo_description) {
				P.value ? Te() : P.value = !0;
				return;
			}
			e && (e.scrollIntoView({
				block: "center",
				behavior: "auto"
			}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
		}
		let De = v(() => (pe.value?.categories || []).map((e) => ({
			label: e.name + (e.is_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.is_enabled
		}))), Oe = v(() => {
			let e = (pe.value?.categories || []).filter((e) => X.category_ids.includes(e.id));
			return te.map((t) => ({
				...t,
				disabled: e.some((e) => !e.difficulty_levels.includes(t.value))
			}));
		}), ke = "", Ae;
		function je(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Me() {
			Ae?.abort(), Ae = new AbortController();
			let e = Ae;
			O.value = !0, j.value = !1, N.value = "";
			try {
				if (pe.value = await h(e.signal, { cms_source_type: "platform" }), E.courseId) {
					let t = await p("courses", E.courseId, e.signal);
					if (pe.value = await h(e.signal, { space_id: String(t.space_id) }), B.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"category_ids",
						"estimated_minutes",
						"sort_order",
						"is_enabled"
					]) Object.assign(X, { [e]: t[e] });
					X.difficulty_level = t.difficulty_level || "";
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url"
					]) X[e] = t[e] || "";
					X.scheduled_local = t.publish_status === "scheduled" ? je(t.scheduled_at) : "", U.value = t.publish_status;
				}
				ke = JSON.stringify(X);
			} catch (t) {
				e.signal.aborted || (N.value = f(t), j.value = !0);
			} finally {
				e.signal.aborted || (O.value = !1);
			}
		}
		let Ne = () => !O.value && !j.value && ke !== JSON.stringify(X);
		function Pe() {
			Ne() ? F.value = !0 : D("close");
		}
		function Fe() {
			U.value === "draft" ? Le("draft") : R.value = !0;
		}
		function Ie() {
			R.value = !1, Le("draft");
		}
		async function Le(e) {
			if (Y.value || O.value || j.value || W.value) return;
			ye.value = e === "draft" ? "draft" : "publish", be.value = Date.now(), Q.value = "";
			for (let e of mt) delete xe[e];
			if (we.value) {
				await Ee();
				return;
			}
			let t = X.scheduled_local ? new Date(X.scheduled_local) : null;
			k.value = !0, N.value = "";
			try {
				await _("courses", {
					...X,
					id: X.id || void 0,
					row_version: X.id ? X.row_version : void 0,
					difficulty_level: X.difficulty_level || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), ke = JSON.stringify(X), d.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "课程已发布"), D("saved");
			} catch (e) {
				let t = yt(e);
				Object.assign(xe, t.fields), Q.value = t.general;
			} finally {
				k.value = !1;
			}
			we.value && await Ee();
		}
		function Re() {
			K.value = "", G.value = !0;
		}
		async function ze() {
			if (!(!q.value || O.value || j.value || k.value || W.value)) {
				k.value = !0, K.value = "";
				try {
					await ne({
						id: X.id,
						row_version: X.row_version
					}), ke = JSON.stringify(X), G.value = !1, d.success("课程已删除"), D("saved");
				} catch (e) {
					K.value = f(e);
				} finally {
					k.value = !1;
				}
			}
		}
		function Be(e) {
			xe.cover_url = f(e);
		}
		function He() {
			delete xe.cover_url;
		}
		let Ue = (e) => {
			Ne() && (e.preventDefault(), e.returnValue = "");
		};
		return ge(() => !k.value && !W.value && (!Ne() || window.confirm("课程有未保存的修改，确定离开？"))), ue(() => {
			Me(), window.addEventListener("beforeunload", Ue);
		}), le(() => {
			Ae?.abort(), window.removeEventListener("beforeunload", Ue);
		}), (i, a) => (A(), x("section", {
			ref_key: "editorRoot",
			ref: ve,
			class: "course-editor",
			"aria-busy": O.value || k.value
		}, [
			S("header", xt, [
				T(L(n), {
					"icon-only": "",
					title: "返回课程列表",
					"aria-label": "返回课程列表",
					disabled: k.value || W.value,
					onClick: Pe
				}, {
					default: H(() => [T(L(m), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				S("div", St, [S("h2", null, I(t.courseId ? "编辑课程" : "新增课程"), 1), S("span", null, I(pe.value?.source_locale || "zh-CN") + " · " + I(B.value), 1)]),
				S("div", Ct, [
					q.value ? (A(), y(L(n), {
						key: 0,
						variant: "danger",
						size: "sm",
						disabled: O.value || j.value || k.value || W.value,
						onClick: Re
					}, {
						default: H(() => [...a[27] ||= [w("删除课程", -1)]]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					T(L(n), {
						size: "sm",
						disabled: O.value || j.value,
						onClick: a[0] ||= (e) => P.value = !0
					}, {
						icon: H(() => [T(L(m), {
							name: "search",
							size: 14
						})]),
						default: H(() => [a[28] ||= w("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					J.value ? b("", !0) : (A(), y(L(n), {
						key: 1,
						size: "sm",
						disabled: O.value || j.value || k.value || W.value,
						onClick: Fe
					}, {
						icon: H(() => [T(L(m), {
							name: "save",
							size: 14
						})]),
						default: H(() => [a[29] ||= w("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					Q.value ? (A(), x("span", wt, I(Q.value), 1)) : b("", !0),
					J.value ? b("", !0) : (A(), x("div", Tt, [we.value ? (A(), x("span", Et, "还有 " + I(we.value) + " 项待完善", 1)) : b("", !0), _e.value ? (A(), y(L(n), {
						key: 1,
						variant: "primary",
						size: "sm",
						disabled: O.value || j.value || W.value,
						loading: k.value,
						onClick: a[1] ||= (e) => Le(X.scheduled_local ? "scheduled" : "published")
					}, {
						icon: H(() => [T(L(m), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: H(() => [w(I(X.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : b("", !0)]))
				])
			]),
			O.value ? (A(), x("div", Dt, [T(L(m), {
				name: "loader-circle",
				class: "academy-spin",
				size: 28
			}), a[30] ||= S("span", null, "正在读取课程资料...", -1)])) : j.value ? (A(), x("div", Ot, [T(L(re), {
				type: "error",
				description: N.value,
				closable: !1
			}, null, 8, ["description"]), T(L(n), { onClick: Me }, {
				default: H(() => [...a[31] ||= [w("重新加载", -1)]]),
				_: 1
			})])) : (A(), x("div", kt, [S("aside", At, [T(L(oe), {
				model: X,
				rules: L(Se),
				"label-position": "top",
				onSubmit: a[11] ||= me(() => {}, ["prevent"])
			}, {
				default: H(() => [
					T(L(e), {
						label: "课程分类",
						prop: "category_ids",
						error: $.value.category_ids,
						required: ""
					}, {
						default: H(() => [T(L(ae), {
							modelValue: X.category_ids,
							"onUpdate:modelValue": a[2] ||= (e) => X.category_ids = e,
							options: De.value,
							multiple: "",
							filterable: "",
							clearable: "",
							disabled: Y.value,
							"aria-label": "课程分类"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					a[32] ||= S("h3", null, "课程设置", -1),
					T(L(e), {
						label: "课程封面",
						prop: "cover_url",
						error: $.value.cover_url
					}, {
						default: H(() => [T(Ve, {
							modelValue: X.cover_url,
							"onUpdate:modelValue": a[3] ||= (e) => X.cover_url = e,
							label: "课程封面",
							disabled: Y.value,
							upload: L(se),
							onBusyChange: a[4] ||= (e) => W.value = e,
							onStart: a[5] ||= (e) => N.value = "",
							onError: Be,
							onSuccess: He
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "课程难度",
						prop: "difficulty_level",
						error: $.value.difficulty_level
					}, {
						default: H(() => [T(L(ae), {
							modelValue: X.difficulty_level,
							"onUpdate:modelValue": a[6] ||= (e) => X.difficulty_level = e,
							options: Oe.value,
							disabled: Y.value,
							"aria-label": "课程难度"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "预计课时(分钟)",
						prop: "estimated_minutes",
						error: $.value.estimated_minutes
					}, {
						default: H(() => [T(L(ie), {
							modelValue: X.estimated_minutes,
							"onUpdate:modelValue": a[7] ||= (e) => X.estimated_minutes = e,
							min: 1,
							max: 1e5,
							precision: 0,
							disabled: Y.value,
							"aria-label": "预计课时"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "前端排序",
						prop: "sort_order",
						error: $.value.sort_order
					}, {
						default: H(() => [T(L(ie), {
							modelValue: X.sort_order,
							"onUpdate:modelValue": a[8] ||= (e) => X.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: Y.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[33] ||= S("h3", null, "发布设置", -1),
					T(L(e), {
						label: "启用状态",
						prop: "is_enabled",
						error: $.value.is_enabled
					}, {
						default: H(() => [T(L(o), {
							modelValue: X.is_enabled,
							"onUpdate:modelValue": a[9] ||= (e) => X.is_enabled = e,
							disabled: Y.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "计划发布时间",
						prop: "scheduled_local",
						error: $.value.scheduled_local
					}, {
						default: H(() => [T(L(g), {
							modelValue: X.scheduled_local,
							"onUpdate:modelValue": a[10] ||= (e) => X.scheduled_local = e,
							type: "datetime-local",
							disabled: Y.value || !_e.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])]), S("main", jt, [T(L(oe), {
				model: X,
				rules: L(Se),
				"label-position": "top",
				onSubmit: a[15] ||= me(() => {}, ["prevent"])
			}, {
				default: H(() => [
					T(L(e), {
						label: "标题",
						prop: "title",
						error: $.value.title,
						required: ""
					}, {
						default: H(() => [T(L(g), {
							modelValue: X.title,
							"onUpdate:modelValue": a[12] ||= (e) => X.title = e,
							maxlength: 255,
							disabled: Y.value,
							placeholder: "输入课程标题",
							"aria-label": "课程标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "摘要",
						prop: "summary",
						error: $.value.summary
					}, {
						default: H(() => [fe(S("textarea", {
							"onUpdate:modelValue": a[13] ||= (e) => X.summary = e,
							class: "course-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: Y.value,
							"aria-invalid": !!$.value.summary,
							"aria-label": "课程摘要"
						}, null, 8, Mt), [[z, X.summary]])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "正文",
						prop: "body_html",
						error: $.value.body_html
					}, {
						default: H(() => [T(L(r), {
							modelValue: X.body_html,
							"onUpdate:modelValue": a[14] ||= (e) => X.body_html = e,
							readonly: J.value,
							disabled: k.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "课程正文"
						}, C({ _: 2 }, [L(s) === "platform" ? {
							name: "image-upload",
							fn: H(({ url: e, setUrl: t, setBusy: n }) => [T(Ve, {
								label: "正文图片",
								"model-value": e,
								upload: L(ee),
								"onUpdate:modelValue": t,
								onBusyChange: n,
								onError: Be
							}, null, 8, [
								"model-value",
								"upload",
								"onUpdate:modelValue",
								"onBusyChange"
							])]),
							key: "0"
						} : void 0]), 1032, [
							"modelValue",
							"readonly",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])])])),
			T(L(u), {
				modelValue: P.value,
				"onUpdate:modelValue": a[19] ||= (e) => P.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1,
				onOpened: Te
			}, {
				footer: H(() => [T(L(n), {
					variant: "primary",
					onClick: a[18] ||= (e) => P.value = !1
				}, {
					default: H(() => [...a[34] ||= [w("确定", -1)]]),
					_: 1
				})]),
				default: H(() => [T(L(oe), {
					model: X,
					rules: L(Se),
					"label-position": "top",
					onSubmit: a[17] ||= me(() => {}, ["prevent"])
				}, {
					default: H(() => [T(L(e), {
						label: "SEO 描述",
						prop: "seo_description",
						error: $.value.seo_description
					}, {
						default: H(() => [fe(S("textarea", {
							ref_key: "seoInput",
							ref: Z,
							"onUpdate:modelValue": a[16] ||= (e) => X.seo_description = e,
							class: "course-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: Y.value,
							"aria-invalid": !!$.value.seo_description,
							"aria-label": "SEO 描述"
						}, null, 8, Nt), [[z, X.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			T(L(u), {
				modelValue: G.value,
				"onUpdate:modelValue": a[21] ||= (e) => G.value = e,
				title: "确认删除",
				subtitle: `操作对象：${X.title || "未命名课程"}`,
				width: "460px",
				"panel-class": "course-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !k.value
			}, {
				"header-actions": H(() => [S("span", Pt, [T(L(m), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: H(() => [T(L(n), {
					disabled: k.value,
					onClick: a[20] ||= (e) => G.value = !1
				}, {
					default: H(() => [...a[35] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(L(n), {
					variant: "warning",
					loading: k.value,
					onClick: ze
				}, {
					default: H(() => [...a[36] ||= [w("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: H(() => [T(L(re), {
					class: "course-delete-dialog__notice",
					type: "warning",
					closable: !1,
					"show-icon": !1,
					description: "确定删除这门课程吗？删除后将不再展示，请谨慎操作。"
				}), K.value ? (A(), y(L(re), {
					key: 0,
					type: "error",
					closable: !1,
					description: K.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, [
				"modelValue",
				"subtitle",
				"before-close"
			]),
			T(L(u), {
				modelValue: F.value,
				"onUpdate:modelValue": a[24] ||= (e) => F.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: H(() => [T(L(n), { onClick: a[22] ||= (e) => F.value = !1 }, {
					default: H(() => [...a[37] ||= [w("继续编辑", -1)]]),
					_: 1
				}), T(L(n), {
					variant: "primary",
					onClick: a[23] ||= (e) => D("close")
				}, {
					default: H(() => [...a[38] ||= [w("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			T(L(u), {
				modelValue: R.value,
				"onUpdate:modelValue": a[26] ||= (e) => R.value = e,
				title: "将课程转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: H(() => [T(L(n), { onClick: a[25] ||= (e) => R.value = !1 }, {
					default: H(() => [...a[39] ||= [w("取消", -1)]]),
					_: 1
				}), T(L(n), {
					variant: "primary",
					onClick: Ie
				}, {
					default: H(() => [...a[40] ||= [w("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, bt));
	}
}), [["__scopeId", "data-v-04e582c1"]]), It = { class: "academy-courses" }, Lt = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = he(), { formatDateTime: r } = he(), { academyDifficulties: a, academyPublishStates: o, getAcademyList: s, getAcademyMetadata: l } = ot(), u = M(!1), ee = M(), d = (e) => t([`cms_academy:${e}`]), f = M(), ne = K(l, (e) => {
			f.value = e;
		}), re = [
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
		], { proTableBindings: ie, reload: ae, filters: oe } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
				...ne.fields,
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
		ne.bindFilters(oe);
		let p = new AbortController();
		async function h() {
			try {
				f.value = await l(p.signal);
			} catch {}
		}
		function g(e) {
			ee.value = e, u.value = !0;
		}
		function _() {
			u.value = !1, ae(), h();
		}
		return ue(h), le(() => p.abort()), (e, t) => (A(), x("div", It, [u.value ? (A(), y(Ft, {
			key: 0,
			"course-id": ee.value,
			onClose: t[0] ||= (e) => u.value = !1,
			onSaved: _
		}, null, 8, ["course-id"])) : b("", !0), fe(T(L(c), O(L(ie), {
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
			"cell-cms_source_type": H(({ row: e }) => [T(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": H(() => [d("add") ? (A(), y(L(n), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => g()
			}, {
				icon: H(() => [T(L(m), {
					name: "plus",
					size: 14
				})]),
				default: H(() => [t[2] ||= w("新增课程", -1)]),
				_: 1
			})) : b("", !0)]),
			"cell-publish_status": H(({ row: e }) => [T(L(te), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: H(() => [w(I(L(o).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": H(({ row: e }) => [T(L(te), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: H(() => [w(I(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": H(({ row: e }) => [w(I(L(r)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": H(({ row: e }) => [T(L(n), {
				size: "sm",
				"icon-only": "",
				title: d("edit") ? "编辑课程" : "课程详情",
				"aria-label": d("edit") ? "编辑课程" : "课程详情",
				onClick: (t) => g(e.id)
			}, {
				default: H(() => [T(L(m), {
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
		}, 16), [[B, !u.value]])]));
	}
}), [["__scopeId", "data-v-0a52bb25"]]);
//#endregion
//#region src/cms/api/content/help.ts
function Rt() {
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
	}, { isOpenRetry: !1 }), s = (n, r) => {
		let i = new FormData();
		return i.append("file", n), e.post({
			url: `${t}/upload`,
			data: i,
			signal: r,
			headers: { "Content-Type": "multipart/form-data" }
		}, { isOpenRetry: !1 });
	}, c = [
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
		uploadHelpCover: s,
		helpPublishStates: c,
		helpCategoryLabel: l,
		helpError: u
	};
}
//#endregion
//#region src/cms/views/content/help/EnabledToggle.vue?vue&type=script&setup=true&lang.ts
var zt = ["aria-checked", "disabled"], Bt = /*#__PURE__*/ _(/* @__PURE__ */ E({
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
		}, [S("span")], -1), S("span", null, I(e.modelValue ? "已启用" : "已停用"), 1)], 10, zt));
	}
}), [["__scopeId", "data-v-5cfe8693"]]), Vt = { class: "help-categories" }, Ht = ["aria-busy"], Ut = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Wt = { class: "taxonomy-editor__field" }, Gt = { class: "taxonomy-editor__field" }, Kt = { class: "taxonomy-editor__icon-control" }, qt = ["title"], Jt = ["aria-label"], Yt = { key: 1 }, Xt = {
	key: 0,
	class: "help-hint"
}, Zt = { class: "taxonomy-editor__row" }, Qt = "分类", $t = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(r) {
		let { helpError: a, deleteHelp: o, getHelpMetadata: s, getHelpList: l, getHelpDetail: ee, saveHelp: f } = Rt(), { hasPermission: ne } = he(), { formatDateTime: p } = he(), _ = (e) => ne([`cms_help_category:${e}`]), se = M(), C = M(), E = K(s, (e) => {
			se.value = e;
		}), D = [
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
				key: "parent_id",
				dataIndex: "parent_id",
				title: "父分类",
				width: 180,
				formatter: (e) => se.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
				formatter: p
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], { proTableBindings: ce, reload: k, filters: j } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
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
					key: "parent_id",
					label: "父级分类",
					type: "select",
					width: 180,
					defaultValue: "",
					options: [{
						label: "全部",
						value: ""
					}, ...(se.value?.categories || []).filter((e) => !e.parent_id).map((e) => ({
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
		E.bindFilters(j);
		let N = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			icon_key: "",
			sort_order: 10,
			is_enabled: !0
		}), P = de(N()), F = [...h], R = new Set(F), z = v(() => R.has(P.icon_key) ? P.icon_key : void 0), B = M(!1), V = M(!1), fe = M(!1), pe = M(!1), U = M(!1), ge = M(""), W = M(!1), q = M(""), J = v(() => !_(P.id ? "edit" : "add")), Y = v(() => fe.value || pe.value), X;
		async function ve(e) {
			X?.abort(), X = new AbortController();
			let t = X;
			Object.assign(P, N(), { id: e || "" }), q.value = "", U.value = !1, ge.value = "", W.value = !1, B.value = !0, V.value = !0;
			try {
				if (C.value = await s(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await ee("categories", e, t.signal);
				if (C.value = await s(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(P, {
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
				t.signal.aborted || (W.value = !0, q.value = a(e));
			} finally {
				t.signal.aborted || (V.value = !1);
			}
		}
		function Z() {
			return Y.value ? !1 : (X?.abort(), !0);
		}
		function ye() {
			Z() && (B.value = !1);
		}
		async function be() {
			if (!(J.value || Y.value || V.value || W.value)) {
				if (!P.name.trim() || P.sort_order === null) {
					q.value = "请填写分类名称和排序";
					return;
				}
				if (P.icon_key.length > 128) {
					q.value = "图标标识最多 128 个字符";
					return;
				}
				fe.value = !0, q.value = "";
				try {
					await f("categories", {
						name: P.name,
						parent_id: P.parent_id || null,
						icon_key: P.icon_key || null,
						sort_order: P.sort_order,
						is_enabled: P.is_enabled,
						id: P.id || void 0,
						row_version: P.id ? P.row_version : void 0
					}), B.value = !1, d.success("保存成功"), await Promise.all([k(), $()]);
				} catch (e) {
					q.value = a(e);
				} finally {
					fe.value = !1;
				}
			}
		}
		function xe() {
			!P.id || !_("delete") || Y.value || V.value || W.value || (ge.value = "", U.value = !0);
		}
		async function Q() {
			if (!(!U.value || !P.id || !_("delete") || Y.value || V.value || W.value)) {
				pe.value = !0, ge.value = "";
				try {
					await o("categories", P.id, P.row_version), U.value = !1, B.value = !1, d.success("分类已删除"), await Promise.all([k(), $()]);
				} catch (e) {
					ge.value = a(e);
				} finally {
					pe.value = !1;
				}
			}
		}
		let Se = v(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(C.value?.categories || []).filter((e) => !e.parent_id && e.id !== P.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Ce = new AbortController();
		async function $() {
			try {
				se.value = await s(Ce.signal);
			} catch {}
		}
		return ue($), le(() => {
			X?.abort(), Ce.abort();
		}), (r, i) => (A(), x("div", Vt, [
			T(L(c), O(L(ce), {
				"auto-refreshable": !1,
				columns: D,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Qt}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": H(({ row: e }) => [T(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": H(() => [_("add") ? (A(), y(L(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: i[0] ||= (e) => ve()
				}, {
					icon: H(() => [T(L(m), {
						name: "plus",
						size: 14
					})]),
					default: H(() => [w("新增" + I(Qt))]),
					_: 1
				})) : b("", !0)]),
				"cell-is_enabled": H(({ row: e }) => [T(L(te), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: H(() => [w(I(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": H(({ row: e }) => [T(L(n), {
					size: "sm",
					"icon-only": "",
					title: _("edit") ? `编辑${Qt}` : `${Qt}详情`,
					"aria-label": `编辑${Qt}`,
					onClick: (t) => ve(e.id)
				}, {
					default: H(() => [T(L(m), {
						name: _("edit") ? "square-pen" : "panel-right-open",
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
			T(L(u), {
				modelValue: B.value,
				"onUpdate:modelValue": i[6] ||= (e) => B.value = e,
				title: `${P.id ? "编辑" : "新增"}帮助${Qt}`,
				width: "680px",
				subtitle: "帮助分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Z
			}, {
				footer: H(() => [
					P.id && _("delete") ? (A(), y(L(n), {
						key: 0,
						variant: "danger",
						disabled: V.value || W.value || Y.value,
						onClick: xe
					}, {
						icon: H(() => [T(L(m), {
							name: "trash-2",
							size: 14
						})]),
						default: H(() => [i[11] ||= w("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					T(L(n), {
						disabled: Y.value,
						onClick: ye
					}, {
						default: H(() => [...i[12] ||= [w("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					J.value ? b("", !0) : (A(), y(L(n), {
						key: 1,
						variant: "primary",
						loading: fe.value,
						disabled: V.value || W.value || pe.value,
						onClick: be
					}, {
						default: H(() => [w("保存" + I(Qt))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: H(() => [S("div", {
					class: "taxonomy-editor",
					"aria-busy": V.value
				}, [
					V.value ? (A(), x("div", Ut, [T(L(m), {
						name: "loader-circle",
						class: "help-spin",
						size: 24
					}), S("span", null, "正在读取" + I(Qt) + "...")])) : b("", !0),
					q.value ? (A(), y(L(re), {
						key: 1,
						type: "error",
						closable: !1,
						description: q.value
					}, null, 8, ["description"])) : b("", !0),
					!V.value && !W.value ? (A(), y(L(oe), {
						key: 2,
						model: P,
						"label-position": "top",
						onSubmit: me(be, ["prevent"])
					}, {
						default: H(() => [
							P.id ? (A(), y(L(e), {
								key: 0,
								label: "分类ID"
							}, {
								default: H(() => [T(L(g), {
									"model-value": P.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : b("", !0),
							T(L(e), {
								label: `${Qt}名称`,
								required: ""
							}, {
								default: H(() => [T(L(g), {
									modelValue: P.name,
									"onUpdate:modelValue": i[1] ||= (e) => P.name = e,
									maxlength: 120,
									disabled: J.value || Y.value,
									"aria-label": `${Qt}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							T(L(e), { label: "父分类" }, {
								default: H(() => [S("div", Wt, [T(L(ae), {
									modelValue: P.parent_id,
									"onUpdate:modelValue": i[2] ||= (e) => P.parent_id = e,
									options: Se.value,
									disabled: J.value || Y.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), i[9] ||= S("p", { class: "help-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类文章。 ", -1)])]),
								_: 1
							}),
							T(L(e), { label: "图标标识" }, {
								default: H(() => [S("div", Gt, [
									S("div", Kt, [T(L(t), {
										modelValue: P.icon_key,
										"onUpdate:modelValue": i[3] ||= (e) => P.icon_key = e,
										suggestions: F,
										"min-length": 0,
										disabled: J.value || Y.value,
										clearable: "",
										placeholder: "输入或下拉选择 6mm 图标，例如 circle-help"
									}, {
										option: H(({ option: e }) => [S("span", {
											class: "taxonomy-editor__icon-option",
											title: String(e)
										}, [T(L(m), {
											name: String(e),
											size: 18
										}, null, 8, ["name"]), S("span", null, I(e), 1)], 8, qt)]),
										_: 1
									}, 8, ["modelValue", "disabled"]), S("span", {
										class: "taxonomy-editor__icon-preview",
										role: "img",
										"aria-label": z.value ? `图标预览：${z.value}` : "暂无图标预览"
									}, [z.value ? (A(), y(L(m), {
										key: 0,
										name: z.value,
										size: 20
									}, null, 8, ["name"])) : (A(), x("span", Yt, "—"))], 8, Jt)]),
									i[10] ||= S("p", { class: "help-hint" }, " 支持直接输入名称或从下拉列表选择；不填写 SVG 或 HTML。 ", -1),
									P.icon_key && !z.value ? (A(), x("p", Xt, " 当前名称不在已安装的 6mm 图标库中，暂无法预览。 ")) : b("", !0)
								])]),
								_: 1
							}),
							S("div", Zt, [T(L(e), {
								label: "前端排序",
								required: ""
							}, {
								default: H(() => [T(L(ie), {
									modelValue: P.sort_order,
									"onUpdate:modelValue": i[4] ||= (e) => P.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: J.value || Y.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), T(L(e), { label: "启用状态" }, {
								default: H(() => [T(Bt, {
									modelValue: P.is_enabled,
									"onUpdate:modelValue": i[5] ||= (e) => P.is_enabled = e,
									disabled: J.value || Y.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : b("", !0)
				], 8, Ht)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			T(L(u), {
				modelValue: U.value,
				"onUpdate:modelValue": i[8] ||= (e) => U.value = e,
				title: "删除帮助分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !pe.value
			}, {
				footer: H(() => [T(L(n), {
					disabled: pe.value,
					onClick: i[7] ||= (e) => U.value = !1
				}, {
					default: H(() => [...i[13] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(L(n), {
					variant: "danger",
					loading: pe.value,
					onClick: Q
				}, {
					default: H(() => [...i[14] ||= [w("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: H(() => [S("p", null, "确认删除分类“" + I(P.name) + "”？有关联文章或子分类的分类无法删除。", 1), ge.value ? (A(), y(L(re), {
					key: 0,
					type: "error",
					closable: !1,
					description: ge.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"])
		]));
	}
}), [["__scopeId", "data-v-d876a44a"]]), en = ["aria-busy"], tn = { class: "article-editor__header" }, nn = { class: "article-editor__heading" }, rn = { class: "article-editor__commands" }, an = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, on = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, sn = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, cn = {
	key: 1,
	class: "article-editor__failure"
}, ln = {
	key: 0,
	class: "article-editor__error"
}, un = { class: "article-editor__body" }, dn = { class: "article-editor__settings" }, fn = { class: "article-editor__related" }, pn = { class: "article-editor__content" }, mn = ["aria-invalid", "disabled"], hn = ["aria-invalid", "disabled"], gn = {
	class: "help-delete-dialog__icon",
	"aria-hidden": "true"
}, _n = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: i }) {
		let { helpError: a, helpCategoryLabel: o, deleteHelp: s, getHelpDetail: c, getHelpMetadata: l, getHelpList: ee, saveHelp: te, uploadHelpCover: f } = Rt(), { hasPermission: ne } = he(), p = t, h = i, _ = M(!0), C = M(!1), E = M(!1), D = M(""), O = M(!1), ce = M(!1), k = M(!1), j = M(!1), N = M(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), P = M(), F = M("draft"), R = M(!1), B = v(() => ne(["cms_help:publish"])), V = v(() => !ne([`cms_help:${p.articleId ? "edit" : "add"}`]) || !B.value && F.value !== "draft"), U = v(() => ne(["cms_help:delete"]) && (B.value || F.value === "draft"));
		async function W() {
			if (!(!U.value || C.value || _.value || E.value)) {
				C.value = !0, D.value = "";
				try {
					await s("articles", K.id, K.row_version), De = JSON.stringify(K), d.success("文章已删除"), h("saved");
				} catch (e) {
					D.value = a(e), j.value = !1;
				} finally {
					C.value = !1;
				}
			}
		}
		let G = v(() => V.value || C.value), K = de({
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
		}), { editorRoot: _e, seoInput: q, fieldRules: J, fieldErrors: Y, pendingCount: X, saveError: ve, validateSave: Z, setSaveFailure: ye, focusFirstError: be, focusSeoError: xe } = Te(K, () => P.value?.categories || [], "help", O), Q = M(""), Se = M(!1), Ce = M([]), $ = v(() => Ce.value.filter((e) => e.id !== p.articleId).map((e) => ({
			label: `${e.title} · ${e.code}`,
			value: e.id
		})));
		async function we() {
			if (!(G.value || Se.value)) {
				Se.value = !0;
				try {
					let e = await ee("articles", {
						keyword: Q.value,
						page_size: 100
					}, Oe?.signal), t = Ce.value.filter((e) => K.related_content_ids.includes(e.id));
					Ce.value = [...new Map([...t, ...e.lists].map((e) => [e.id, e])).values()];
				} catch (e) {
					Oe?.signal.aborted || (D.value = a(e));
				} finally {
					Se.value = !1;
				}
			}
		}
		let Ee = v(() => (P.value?.categories || []).map((e) => ({
			label: o(P.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
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
			_.value = !0, E.value = !1, D.value = "";
			try {
				if (P.value = await l(e.signal, { cms_source_type: "platform" }), p.articleId) {
					let t = await c("articles", p.articleId, e.signal);
					if (P.value = await l(e.signal, { space_id: String(t.space_id) }), N.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"sort_order",
						"is_enabled"
					]) Object.assign(K, { [e]: t[e] });
					K.category_id = t.category_id || "", K.search_keywords = t.search_keywords || "", K.helpful_enabled = t.helpful_enabled ?? !0, K.related_content_ids = t.related_content_ids || [], Ce.value = t.related_articles || [];
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url",
						"content_source",
						"author_name"
					]) K[e] = t[e] || "";
					K.scheduled_local = t.publish_status === "scheduled" ? ke(t.scheduled_at) : "", F.value = t.publish_status;
				}
				De = JSON.stringify(K);
			} catch (t) {
				e.signal.aborted || (D.value = a(t), E.value = !0);
			} finally {
				e.signal.aborted || (_.value = !1);
			}
		}
		let je = () => !_.value && !E.value && De !== JSON.stringify(K);
		function Me() {
			je() ? ce.value = !0 : h("close");
		}
		function Ne() {
			F.value === "draft" ? Fe("draft") : k.value = !0;
		}
		function Pe() {
			k.value = !1, Fe("draft");
		}
		async function Fe(e) {
			if (G.value || _.value || E.value || R.value || (D.value = "", !await Z(e))) return;
			let t = K.scheduled_local ? new Date(K.scheduled_local) : null;
			C.value = !0, D.value = "";
			try {
				await te("articles", {
					...K,
					id: K.id || void 0,
					row_version: K.id ? K.row_version : void 0,
					category_id: K.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), De = JSON.stringify(K), d.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "文章已发布"), h("saved");
			} catch (e) {
				ye(e);
			} finally {
				C.value = !1;
			}
			X.value && await be();
		}
		function Ie(e) {
			D.value = a(e);
		}
		let Le = (e) => {
			je() && (e.preventDefault(), e.returnValue = "");
		};
		return ge(() => !C.value && !R.value && (!je() || window.confirm("文章有未保存的修改，确定离开？"))), ue(() => {
			Ae(), window.addEventListener("beforeunload", Le);
		}), le(() => {
			Oe?.abort(), window.removeEventListener("beforeunload", Le);
		}), (i, a) => (A(), x("section", {
			ref_key: "editorRoot",
			ref: _e,
			class: "article-editor",
			"aria-busy": _.value || C.value
		}, [
			S("header", tn, [
				T(L(n), {
					"icon-only": "",
					title: "返回文章列表",
					"aria-label": "返回文章列表",
					disabled: C.value || R.value,
					onClick: Me
				}, {
					default: H(() => [T(L(m), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				S("div", nn, [S("h2", null, I(t.articleId ? "编辑文章" : "新增文章"), 1), S("span", null, I(P.value?.source_locale || "zh-CN") + " · " + I(N.value), 1)]),
				S("div", rn, [
					t.articleId && U.value ? (A(), y(L(n), {
						key: 0,
						size: "sm",
						disabled: _.value || E.value || C.value || R.value,
						onClick: a[0] ||= (e) => j.value = !0
					}, {
						default: H(() => [...a[32] ||= [w("删除文章", -1)]]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					T(L(n), {
						size: "sm",
						disabled: _.value || E.value,
						onClick: a[1] ||= (e) => O.value = !0
					}, {
						icon: H(() => [T(L(m), {
							name: "search",
							size: 14
						})]),
						default: H(() => [a[33] ||= w("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					V.value ? b("", !0) : (A(), y(L(n), {
						key: 1,
						size: "sm",
						disabled: _.value || E.value || C.value || R.value,
						onClick: Ne
					}, {
						icon: H(() => [T(L(m), {
							name: "save",
							size: 14
						})]),
						default: H(() => [a[34] ||= w("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					L(ve) ? (A(), x("span", an, I(L(ve)), 1)) : b("", !0),
					!V.value && L(X) ? (A(), x("span", on, "还有 " + I(L(X)) + " 项待完善", 1)) : b("", !0),
					!V.value && B.value ? (A(), y(L(n), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: _.value || E.value || R.value,
						loading: C.value,
						onClick: a[2] ||= (e) => Fe(K.scheduled_local ? "scheduled" : "published")
					}, {
						icon: H(() => [T(L(m), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: H(() => [w(I(K.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : b("", !0)
				])
			]),
			_.value ? (A(), x("div", sn, [T(L(m), {
				name: "loader-circle",
				class: "help-spin",
				size: 28
			}), a[35] ||= S("span", null, "正在读取文章资料...", -1)])) : E.value ? (A(), x("div", cn, [T(L(re), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"]), T(L(n), { onClick: Ae }, {
				default: H(() => [...a[36] ||= [w("重新加载", -1)]]),
				_: 1
			})])) : (A(), x(se, { key: 2 }, [D.value ? (A(), x("div", ln, [T(L(re), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"])])) : b("", !0), S("div", un, [S("aside", dn, [T(L(oe), {
				model: K,
				rules: L(J),
				"label-position": "top",
				onSubmit: a[16] ||= me(() => {}, ["prevent"])
			}, {
				default: H(() => [
					T(L(e), {
						label: "文章分类",
						prop: "category_id",
						error: L(Y).category_id,
						required: ""
					}, {
						default: H(() => [T(L(ae), {
							modelValue: K.category_id,
							"onUpdate:modelValue": a[3] ||= (e) => K.category_id = e,
							options: Ee.value,
							clearable: "",
							disabled: G.value,
							"aria-label": "文章分类"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					a[39] ||= S("h3", null, "文章设置", -1),
					T(L(e), {
						label: "文章封面",
						prop: "cover_url",
						error: L(Y).cover_url
					}, {
						default: H(() => [T(Ve, {
							modelValue: K.cover_url,
							"onUpdate:modelValue": a[4] ||= (e) => K.cover_url = e,
							label: "文章封面",
							disabled: G.value,
							upload: L(f),
							onBusyChange: a[5] ||= (e) => R.value = e,
							onStart: a[6] ||= (e) => D.value = "",
							onError: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "内容来源",
						prop: "content_source",
						error: L(Y).content_source
					}, {
						default: H(() => [T(L(g), {
							modelValue: K.content_source,
							"onUpdate:modelValue": a[7] ||= (e) => K.content_source = e,
							maxlength: 160,
							disabled: G.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "作者署名",
						prop: "author_name",
						error: L(Y).author_name
					}, {
						default: H(() => [T(L(g), {
							modelValue: K.author_name,
							"onUpdate:modelValue": a[8] ||= (e) => K.author_name = e,
							maxlength: 120,
							disabled: G.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "前端排序",
						prop: "sort_order",
						error: L(Y).sort_order
					}, {
						default: H(() => [T(L(ie), {
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
					a[40] ||= S("h3", null, "发布设置", -1),
					T(L(e), {
						label: "搜索关键词",
						prop: "search_keywords",
						error: L(Y).search_keywords
					}, {
						default: H(() => [T(L(g), {
							modelValue: K.search_keywords,
							"onUpdate:modelValue": a[10] ||= (e) => K.search_keywords = e,
							maxlength: 2e3,
							disabled: G.value,
							placeholder: "使用空格或逗号分隔",
							"aria-label": "搜索关键词"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: L(Y).helpful_enabled
					}, {
						default: H(() => [T(Bt, {
							modelValue: K.helpful_enabled,
							"onUpdate:modelValue": a[11] ||= (e) => K.helpful_enabled = e,
							disabled: G.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "相关文章",
						prop: "related_content_ids",
						error: L(Y).related_content_ids
					}, {
						default: H(() => [S("div", fn, [
							T(L(g), {
								modelValue: Q.value,
								"onUpdate:modelValue": a[12] ||= (e) => Q.value = e,
								disabled: G.value,
								placeholder: "搜索文章标题",
								"aria-label": "搜索相关文章",
								onKeydown: pe(me(we, ["prevent"]), ["enter"])
							}, null, 8, [
								"modelValue",
								"disabled",
								"onKeydown"
							]),
							T(L(n), {
								size: "sm",
								disabled: G.value,
								loading: Se.value,
								onClick: we
							}, {
								default: H(() => [...a[37] ||= [w("查找文章", -1)]]),
								_: 1
							}, 8, ["disabled", "loading"]),
							T(L(ae), {
								modelValue: K.related_content_ids,
								"onUpdate:modelValue": a[13] ||= (e) => K.related_content_ids = e,
								options: $.value,
								multiple: "",
								clearable: "",
								disabled: G.value,
								"aria-label": "相关文章"
							}, null, 8, [
								"modelValue",
								"options",
								"disabled"
							]),
							a[38] ||= S("p", { class: "article-editor__hint" }, " 最多 20 篇，按选择顺序展示。可关联草稿，前台须按发布状态过滤。 ", -1)
						])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "启用状态",
						prop: "is_enabled",
						error: L(Y).is_enabled
					}, {
						default: H(() => [T(Bt, {
							modelValue: K.is_enabled,
							"onUpdate:modelValue": a[14] ||= (e) => K.is_enabled = e,
							disabled: G.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: L(Y).scheduled_local
					}, {
						default: H(() => [T(L(g), {
							modelValue: K.scheduled_local,
							"onUpdate:modelValue": a[15] ||= (e) => K.scheduled_local = e,
							type: "datetime-local",
							disabled: G.value || !B.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[41] ||= S("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), S("main", pn, [T(L(oe), {
				model: K,
				rules: L(J),
				"label-position": "top",
				onSubmit: a[20] ||= me(() => {}, ["prevent"])
			}, {
				default: H(() => [
					T(L(e), {
						label: "标题",
						prop: "title",
						error: L(Y).title,
						required: ""
					}, {
						default: H(() => [T(L(g), {
							modelValue: K.title,
							"onUpdate:modelValue": a[17] ||= (e) => K.title = e,
							maxlength: 255,
							disabled: G.value,
							placeholder: "输入文章标题",
							"aria-label": "文章标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "摘要",
						prop: "summary",
						error: L(Y).summary
					}, {
						default: H(() => [fe(S("textarea", {
							"onUpdate:modelValue": a[18] ||= (e) => K.summary = e,
							"aria-invalid": !!L(Y).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: G.value,
							"aria-label": "文章摘要"
						}, null, 8, mn), [[z, K.summary]])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "正文",
						prop: "body_html",
						error: L(Y).body_html
					}, {
						default: H(() => [T(L(r), {
							modelValue: K.body_html,
							"onUpdate:modelValue": a[19] ||= (e) => K.body_html = e,
							readonly: V.value,
							disabled: C.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "文章正文"
						}, null, 8, [
							"modelValue",
							"readonly",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])])])], 64)),
			T(L(u), {
				modelValue: O.value,
				"onUpdate:modelValue": a[24] ||= (e) => O.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: H(() => [T(L(n), {
					variant: "primary",
					onClick: a[23] ||= (e) => O.value = !1
				}, {
					default: H(() => [...a[42] ||= [w("确定", -1)]]),
					_: 1
				})]),
				default: H(() => [T(L(oe), {
					model: K,
					rules: L(J),
					"label-position": "top",
					onSubmit: a[22] ||= me(() => {}, ["prevent"])
				}, {
					default: H(() => [T(L(e), {
						label: "SEO 描述",
						prop: "seo_description",
						error: L(Y).seo_description
					}, {
						default: H(() => [fe(S("textarea", {
							ref_key: "seoInput",
							ref: q,
							"onUpdate:modelValue": a[21] ||= (e) => K.seo_description = e,
							"aria-invalid": !!L(Y).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: G.value,
							"aria-label": "SEO 描述"
						}, null, 8, hn), [[z, K.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			T(L(u), {
				modelValue: j.value,
				"onUpdate:modelValue": a[26] ||= (e) => j.value = e,
				title: "确认删除",
				subtitle: `操作对象：${K.title || "未命名文章"}`,
				width: "460px",
				"panel-class": "help-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !C.value
			}, {
				"header-actions": H(() => [S("span", gn, [T(L(m), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: H(() => [T(L(n), {
					disabled: C.value,
					onClick: a[25] ||= (e) => j.value = !1
				}, {
					default: H(() => [...a[43] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(L(n), {
					variant: "warning",
					loading: C.value,
					onClick: W
				}, {
					default: H(() => [...a[44] ||= [w("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: H(() => [T(L(re), {
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
			T(L(u), {
				modelValue: ce.value,
				"onUpdate:modelValue": a[29] ||= (e) => ce.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: H(() => [T(L(n), { onClick: a[27] ||= (e) => ce.value = !1 }, {
					default: H(() => [...a[45] ||= [w("继续编辑", -1)]]),
					_: 1
				}), T(L(n), {
					variant: "primary",
					onClick: a[28] ||= (e) => h("close")
				}, {
					default: H(() => [...a[46] ||= [w("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			T(L(u), {
				modelValue: k.value,
				"onUpdate:modelValue": a[31] ||= (e) => k.value = e,
				title: "将文章转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: H(() => [T(L(n), { onClick: a[30] ||= (e) => k.value = !1 }, {
					default: H(() => [...a[47] ||= [w("取消", -1)]]),
					_: 1
				}), T(L(n), {
					variant: "primary",
					onClick: Pe
				}, {
					default: H(() => [...a[48] ||= [w("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, en));
	}
}), [["__scopeId", "data-v-16f68391"]]), vn = { class: "help-articles" }, yn = {
	key: 0,
	class: "help-statistics-note"
}, bn = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(e) {
		let t = he(), { helpPublishStates: r, helpCategoryLabel: a, getHelpList: o, getHelpMetadata: s } = Rt(), { hasPermission: l } = he(), { formatDateTime: u } = he(), ee = M(!1), d = M(), f = (e) => l([`cms_help:${e}`]), ne = M(), re = K(s, (e) => {
			ne.value = e;
		}), ie = [
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
				formatter: (e) => a(ne.value, e)
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
		], { proTableBindings: ae, reload: oe, filters: p } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
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
					}, ...(ne.value?.categories || []).map((e) => ({
						label: a(ne.value, e.id),
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
		re.bindFilters(p);
		let h = new AbortController();
		async function g() {
			try {
				ne.value = await s(h.signal);
			} catch {}
		}
		function _(e) {
			d.value = e, ee.value = !0;
		}
		function se() {
			ee.value = !1, oe(), g();
		}
		return ue(g), le(() => h.abort()), (e, i) => (A(), x("div", vn, [
			!ee.value && L(t).mode === "platform" ? (A(), x("p", yn, " 当前管理平台默认模板。浏览量、评价数及有帮助率属于站点运行数据，此处显示“—”，不汇总白标站点。 ")) : b("", !0),
			ee.value ? (A(), y(_n, {
				key: 1,
				"article-id": d.value,
				onClose: i[0] ||= (e) => ee.value = !1,
				onSaved: se
			}, null, 8, ["article-id"])) : b("", !0),
			fe(T(L(c), O(L(ae), {
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
				"cell-cms_source_type": H(({ row: e }) => [T(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": H(() => [f("add") ? (A(), y(L(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: i[1] ||= (e) => _()
				}, {
					icon: H(() => [T(L(m), {
						name: "plus",
						size: 14
					})]),
					default: H(() => [i[2] ||= w("新增文章", -1)]),
					_: 1
				})) : b("", !0)]),
				"cell-publish_status": H(({ row: e }) => [T(L(te), {
					size: "sm",
					effect: "soft",
					type: e.publish_status === "published" ? "success" : "warning"
				}, {
					default: H(() => [w(I(L(r).find((t) => t.value === e.publish_status)?.label), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-is_enabled": H(({ row: e }) => [T(L(te), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: H(() => [w(I(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-publish_time": H(({ row: e }) => [w(I(L(u)(e.published_at || e.scheduled_at)), 1)]),
				"cell-actions": H(({ row: e }) => [T(L(n), {
					size: "sm",
					"icon-only": "",
					title: f("edit") ? "编辑文章" : "文章详情",
					"aria-label": f("edit") ? "编辑文章" : "文章详情",
					onClick: (t) => _(e.id)
				}, {
					default: H(() => [T(L(m), {
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
			}, 16), [[B, !ee.value]])
		]));
	}
}), [["__scopeId", "data-v-e3373337"]]);
//#endregion
//#region src/cms/api/content/feedback.ts
function xn() {
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
var Sn = { class: "feedback-page" }, Cn = ["aria-busy"], wn = {
	key: 0,
	role: "status"
}, Tn = { class: "feedback-info" }, En = { class: "feedback-content" }, Dn = {
	key: 0,
	class: "muted"
}, On = { class: "attachment-title" }, kn = ["src", "alt"], An = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(e) {
		let { getFeedbackList: t, getFeedbackMetadata: r, getFeedbackDetail: a, getFeedbackAttachment: o, feedbackSourceTypes: s, feedbackSourceLabel: l, feedbackError: ee } = xn(), { formatDateTime: d } = he(), f = M({
			scenes: [],
			issues: []
		}), ne = K(r, (e) => {
			f.value = e;
		}), ie = [
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
				formatter: d
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				fixed: "right",
				align: "center",
				hideable: !1
			}
		], { proTableBindings: ae, filters: oe } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
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
					}, ...f.value.scenes.map((e) => ({
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
					}, ...f.value.issues.map((e) => ({
						label: `${f.value.scenes.find((t) => t.id === e.scene_id)?.name || "—"} / ${e.name}`,
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
		ne.bindFilters(oe);
		let p = M(!1), h = M(!1), g = M(""), _ = M(), C = M({}), E = M(""), D, ce = new AbortController();
		async function k(e) {
			D?.abort();
			let t = new AbortController();
			D = t, _.value = void 0, C.value = {}, g.value = "", E.value = "", p.value = !0, h.value = !0;
			try {
				let n = await a(e, t.signal);
				t.signal.aborted || (_.value = n);
			} catch (e) {
				t.signal.aborted || (g.value = ee(e));
			} finally {
				t.signal.aborted || (h.value = !1);
			}
		}
		async function j(e) {
			let t = D, n = _.value?.id;
			if (!(!t || !n || E.value)) {
				E.value = e, g.value = "";
				try {
					let r = await o(n, e, t.signal);
					!t.signal.aborted && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(r.data_url) && (C.value[e] = r.data_url);
				} catch (e) {
					t.signal.aborted || (g.value = ee(e));
				} finally {
					t.signal.aborted || (E.value = "");
				}
			}
		}
		return V(p, (e) => {
			e || (D?.abort(), _.value = void 0, C.value = {}, g.value = "");
		}), ue(async () => {
			try {
				f.value = await r(ce.signal);
			} catch {}
		}), le(() => {
			ce.abort(), D?.abort();
		}), (e, t) => (A(), x("div", Sn, [T(L(c), O(L(ae), {
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
			"cell-cms_source_type": H(({ row: e }) => [T(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"cell-source_type": H(({ row: e }) => [T(L(te), {
				size: "sm",
				effect: "soft",
				type: e.source_type === "merchant" ? "warning" : e.source_type === "platform" ? "success" : "primary"
			}, {
				default: H(() => [w(I(L(l)(e.source_type)), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-actions": H(({ row: e }) => [T(L(n), {
				size: "sm",
				"icon-only": "",
				title: "查看反馈",
				"aria-label": "查看反馈",
				onClick: (t) => k(e.id)
			}, {
				default: H(() => [T(L(m), {
					name: "eye",
					size: 15
				})]),
				_: 1
			}, 8, ["onClick"])]),
			_: 1
		}, 16), T(L(u), {
			modelValue: p.value,
			"onUpdate:modelValue": t[1] ||= (e) => p.value = e,
			title: "反馈详情",
			subtitle: _.value?.code || "查看用户正式提交的意见反馈",
			width: "760px",
			"close-on-click-modal": !1
		}, {
			footer: H(() => [T(L(n), { onClick: t[0] ||= (e) => p.value = !1 }, {
				default: H(() => [...t[14] ||= [w("关闭", -1)]]),
				_: 1
			})]),
			default: H(() => [S("div", {
				class: "feedback-detail",
				"aria-busy": h.value
			}, [
				h.value ? (A(), x("p", wn, "正在读取反馈…")) : b("", !0),
				g.value ? (A(), y(L(re), {
					key: 1,
					type: "error",
					closable: !1,
					description: g.value
				}, null, 8, ["description"])) : b("", !0),
				_.value && !h.value ? (A(), x(se, { key: 2 }, [
					S("dl", Tn, [
						S("div", null, [t[2] ||= S("dt", null, "UID", -1), S("dd", null, I(_.value.public_user_id_snapshot), 1)]),
						S("div", null, [t[3] ||= S("dt", null, "用户账号", -1), S("dd", null, I(_.value.username_snapshot || "—"), 1)]),
						S("div", null, [t[4] ||= S("dt", null, "来源类型", -1), S("dd", null, I(L(l)(_.value.source_type)), 1)]),
						S("div", null, [t[5] ||= S("dt", null, "来源名称", -1), S("dd", null, I(_.value.source_name_snapshot || "—"), 1)]),
						S("div", null, [t[6] ||= S("dt", null, "业务场景", -1), S("dd", null, I(_.value.scene_name_snapshot), 1)]),
						S("div", null, [t[7] ||= S("dt", null, "问题分类", -1), S("dd", null, I(_.value.issue_category_name_snapshot), 1)]),
						S("div", null, [t[8] ||= S("dt", null, "联系方式（脱敏）", -1), S("dd", null, I(_.value.contact_display), 1)]),
						S("div", null, [t[9] ||= S("dt", null, "提交时间", -1), S("dd", null, I(L(d)(_.value.submitted_at)), 1)])
					]),
					S("section", null, [t[10] ||= S("h3", null, "反馈内容", -1), S("div", En, I(_.value.content), 1)]),
					S("section", null, [
						S("h3", null, [t[11] ||= w(" 附件 ", -1), S("span", null, I(_.value.attachments?.length || 0), 1)]),
						_.value.attachments?.length ? b("", !0) : (A(), x("p", Dn, "暂无附件")),
						(A(!0), x(se, null, N(_.value.attachments, (e) => (A(), x("div", {
							key: e.id,
							class: "feedback-attachment"
						}, [S("div", On, [S("span", null, I(e.original_name || "图片附件") + " · " + I(Math.ceil(e.byte_size / 1024)) + " KB", 1), T(L(n), {
							size: "sm",
							loading: E.value === e.id,
							onClick: (t) => j(e.id)
						}, {
							default: H(() => [...t[12] ||= [w("查看图片", -1)]]),
							_: 1
						}, 8, ["loading", "onClick"])]), C.value[e.id] ? (A(), x("img", {
							key: 0,
							src: C.value[e.id],
							alt: e.original_name || "反馈图片"
						}, null, 8, kn)) : b("", !0)]))), 128))
					]),
					t[13] ||= S("p", { class: "muted" }, "来源和分类为提交时快照；此页面仅查看，不修改用户原始反馈。", -1)
				], 64)) : b("", !0)
			], 8, Cn)]),
			_: 1
		}, 8, ["modelValue", "subtitle"])]));
	}
}), [["__scopeId", "data-v-ed508c88"]]);
//#endregion
//#region src/cms/api/content/announcement.ts
function jn() {
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
	}, { isOpenRetry: !1 }), s = (n, r) => {
		let i = new FormData();
		return i.append("file", n), e.post({
			url: `${t}/upload`,
			data: i,
			signal: r,
			headers: { "Content-Type": "multipart/form-data" }
		}, { isOpenRetry: !1 });
	}, c = [
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
		announcementPublishStates: c,
		announcementCategoryLabel: l,
		announcementError: u
	};
}
//#endregion
//#region src/cms/views/content/announcement/categories/index.vue?vue&type=script&setup=true&lang.ts
var Mn = { class: "announcement-categories" }, Nn = ["aria-busy"], Pn = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Fn = { class: "taxonomy-editor__field" }, In = { class: "taxonomy-editor__row" }, Ln = "分类", Rn = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(t) {
		let { hasPermission: r } = he(), { formatDateTime: a } = he(), { announcementError: o, deleteAnnouncement: s, getAnnouncementMetadata: l, getAnnouncementList: ee, getAnnouncementDetail: f, saveAnnouncement: ne } = jn(), p = (e) => r([`cms_announcement_category:${e}`]), h = M(), _ = M(), se = K(l, (e) => {
			h.value = e;
		}), C = [
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
				key: "parent_id",
				dataIndex: "parent_id",
				title: "父分类",
				width: 180,
				formatter: (e) => h.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
		], { proTableBindings: E, reload: D, filters: ce } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: [
				...se.fields,
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
		});
		se.bindFilters(ce);
		let k = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), j = de(k()), N = M(!1), P = M(!1), F = M(!1), R = M(!1), z = M(!1), B = M(""), V = M(!1), fe = M(""), pe = M(!1), U = v(() => !p(j.id ? "edit" : "add")), ge = v(() => F.value || R.value), W = "", q;
		async function J(e) {
			q?.abort(), q = new AbortController();
			let t = q;
			Object.assign(j, k(), { id: e || "" }), fe.value = "", z.value = !1, B.value = "", V.value = !1, N.value = !0, P.value = !0, W = JSON.stringify(j);
			try {
				if (_.value = await l(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await f("categories", e, t.signal);
				if (_.value = await l(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(j, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), W = JSON.stringify(j);
			} catch (e) {
				t.signal.aborted || (V.value = !0, fe.value = o(e));
			} finally {
				t.signal.aborted || (P.value = !1);
			}
		}
		function X() {
			return ge.value ? !1 : !P.value && !V.value && JSON.stringify(j) !== W ? (pe.value = !0, !1) : (q?.abort(), !0);
		}
		function ve() {
			X() && (N.value = !1);
		}
		function Z() {
			q?.abort(), pe.value = !1, N.value = !1;
		}
		async function ye() {
			if (!(U.value || ge.value || P.value || V.value)) {
				if (!j.name.trim() || j.sort_order === null) {
					fe.value = "请填写分类名称和排序";
					return;
				}
				F.value = !0, fe.value = "";
				try {
					await ne("categories", {
						name: j.name,
						parent_id: j.parent_id || null,
						sort_order: j.sort_order,
						is_enabled: j.is_enabled,
						id: j.id || void 0,
						row_version: j.id ? j.row_version : void 0
					}), N.value = !1, d.success("保存成功"), await Promise.all([D(), Ce()]);
				} catch (e) {
					fe.value = o(e);
				} finally {
					F.value = !1;
				}
			}
		}
		function be() {
			!j.id || !p("delete") || ge.value || P.value || V.value || (B.value = "", z.value = !0);
		}
		async function xe() {
			if (!(!z.value || !j.id || !p("delete") || ge.value || P.value || V.value)) {
				R.value = !0, B.value = "";
				try {
					await s("categories", j.id, j.row_version), z.value = !1, N.value = !1, d.success("分类已删除"), await Promise.all([D(), Ce()]);
				} catch (e) {
					B.value = o(e);
				} finally {
					R.value = !1;
				}
			}
		}
		let Q = v(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(_.value?.categories || []).filter((e) => !e.parent_id && e.id !== j.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Se = new AbortController();
		async function Ce() {
			try {
				h.value = await l(Se.signal);
			} catch {}
		}
		return ue(Ce), le(() => {
			q?.abort(), Se.abort();
		}), (t, r) => (A(), x("div", Mn, [
			T(L(c), O(L(E), {
				"auto-refreshable": !1,
				columns: C,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Ln}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": H(({ row: e }) => [T(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": H(() => [p("add") ? (A(), y(L(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => J()
				}, {
					icon: H(() => [T(L(m), {
						name: "plus",
						size: 14
					})]),
					default: H(() => [w("新增" + I(Ln))]),
					_: 1
				})) : b("", !0)]),
				"cell-is_enabled": H(({ row: e }) => [T(L(te), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: H(() => [w(I(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": H(({ row: e }) => [T(L(n), {
					size: "sm",
					"icon-only": "",
					title: p("edit") ? `编辑${Ln}` : `${Ln}详情`,
					"aria-label": p("edit") ? `编辑${Ln}` : `${Ln}详情`,
					onClick: (t) => J(e.id)
				}, {
					default: H(() => [T(L(m), {
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
			}, 16, ["aria-label"]),
			T(L(u), {
				modelValue: N.value,
				"onUpdate:modelValue": r[5] ||= (e) => N.value = e,
				title: `${j.id ? "编辑" : "新增"}公告${Ln}`,
				width: "680px",
				subtitle: "公告分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": X
			}, {
				footer: H(() => [
					j.id && p("delete") ? (A(), y(L(n), {
						key: 0,
						variant: "danger",
						disabled: P.value || V.value || ge.value,
						onClick: be
					}, {
						icon: H(() => [T(L(m), {
							name: "trash-2",
							size: 14
						})]),
						default: H(() => [r[11] ||= w("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					T(L(n), {
						disabled: ge.value,
						onClick: ve
					}, {
						default: H(() => [...r[12] ||= [w("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					U.value ? b("", !0) : (A(), y(L(n), {
						key: 1,
						variant: "primary",
						loading: F.value,
						disabled: P.value || V.value || R.value,
						onClick: ye
					}, {
						default: H(() => [w("保存" + I(Ln))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: H(() => [S("div", {
					class: "taxonomy-editor",
					"aria-busy": P.value
				}, [
					P.value ? (A(), x("div", Pn, [T(L(m), {
						name: "loader-circle",
						class: "announcement-spin",
						size: 24
					}), S("span", null, "正在读取" + I(Ln) + "...")])) : b("", !0),
					fe.value ? (A(), y(L(re), {
						key: 1,
						type: "error",
						closable: !1,
						description: fe.value
					}, null, 8, ["description"])) : b("", !0),
					!P.value && !V.value ? (A(), y(L(oe), {
						key: 2,
						model: j,
						"label-position": "top",
						onSubmit: me(ye, ["prevent"])
					}, {
						default: H(() => [
							j.id ? (A(), y(L(e), {
								key: 0,
								label: "分类ID"
							}, {
								default: H(() => [T(L(g), {
									"model-value": j.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : b("", !0),
							T(L(e), {
								label: `${Ln}名称`,
								required: ""
							}, {
								default: H(() => [T(L(g), {
									modelValue: j.name,
									"onUpdate:modelValue": r[1] ||= (e) => j.name = e,
									maxlength: 120,
									disabled: U.value || ge.value,
									"aria-label": `${Ln}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							T(L(e), { label: "父分类" }, {
								default: H(() => [S("div", Fn, [T(L(ae), {
									modelValue: j.parent_id,
									"onUpdate:modelValue": r[2] ||= (e) => j.parent_id = e,
									options: Q.value,
									disabled: U.value || ge.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), r[10] ||= S("p", { class: "announcement-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类公告。 ", -1)])]),
								_: 1
							}),
							S("div", In, [T(L(e), {
								label: "前端排序",
								required: ""
							}, {
								default: H(() => [T(L(ie), {
									modelValue: j.sort_order,
									"onUpdate:modelValue": r[3] ||= (e) => j.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: U.value || ge.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), T(L(e), { label: "启用状态" }, {
								default: H(() => [T(Y, {
									modelValue: j.is_enabled,
									"onUpdate:modelValue": r[4] ||= (e) => j.is_enabled = e,
									disabled: U.value || ge.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : b("", !0)
				], 8, Nn)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			T(L(u), {
				modelValue: z.value,
				"onUpdate:modelValue": r[7] ||= (e) => z.value = e,
				title: "删除公告分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !R.value
			}, {
				footer: H(() => [T(L(n), {
					disabled: R.value,
					onClick: r[6] ||= (e) => z.value = !1
				}, {
					default: H(() => [...r[13] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(L(n), {
					variant: "danger",
					loading: R.value,
					onClick: xe
				}, {
					default: H(() => [...r[14] ||= [w("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: H(() => [S("p", null, "确认删除分类“" + I(j.name) + "”？有关联公告或子分类的分类无法删除。", 1), B.value ? (A(), y(L(re), {
					key: 0,
					type: "error",
					closable: !1,
					description: B.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			T(L(u), {
				modelValue: pe.value,
				"onUpdate:modelValue": r[9] ||= (e) => pe.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: H(() => [T(L(n), { onClick: r[8] ||= (e) => pe.value = !1 }, {
					default: H(() => [...r[15] ||= [w("继续编辑", -1)]]),
					_: 1
				}), T(L(n), {
					variant: "primary",
					onClick: Z
				}, {
					default: H(() => [...r[16] ||= [w("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-1b5aec70"]]), zn = ["aria-busy"], Bn = { class: "article-editor__header" }, Vn = { class: "article-editor__heading" }, Hn = { class: "article-editor__commands" }, Un = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, Wn = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Gn = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, Kn = {
	key: 1,
	class: "article-editor__failure"
}, qn = {
	key: 0,
	class: "article-editor__error"
}, Jn = { class: "article-editor__body" }, Yn = { class: "article-editor__settings" }, Xn = { class: "article-editor__content" }, Zn = ["aria-invalid", "disabled"], Qn = ["aria-invalid", "disabled"], $n = {
	class: "announcement-delete-dialog__icon",
	"aria-hidden": "true"
}, er = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: i }) {
		let { hasPermission: a } = he(), { announcementError: o, announcementCategoryLabel: s, deleteAnnouncement: c, getAnnouncementDetail: l, getAnnouncementMetadata: ee, saveAnnouncement: te, uploadAnnouncementCover: f } = jn(), ne = t, p = i, h = M(!0), _ = M(!1), C = M(!1), E = M(""), D = M(!1), O = M(!1), ce = M(!1), k = M(!1), j = M(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), N = M(), P = M("draft"), F = M(!1), R = v(() => a(["cms_announcement:publish"])), B = v(() => !a([`cms_announcement:${ne.articleId ? "edit" : "add"}`]) || !R.value && P.value !== "draft"), V = v(() => a(["cms_announcement:delete"]) && (R.value || P.value === "draft"));
		async function pe() {
			if (!(!V.value || _.value || h.value || C.value)) {
				_.value = !0, E.value = "";
				try {
					await c("articles", W.id, W.row_version), xe = JSON.stringify(W), d.success("公告已删除"), p("saved");
				} catch (e) {
					E.value = o(e), k.value = !1;
				} finally {
					_.value = !1;
				}
			}
		}
		let U = v(() => B.value || _.value), W = de({
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
		}), { editorRoot: G, seoInput: K, fieldRules: _e, fieldErrors: q, pendingCount: J, saveError: Y, validateSave: X, setSaveFailure: ve, focusFirstError: Z, focusSeoError: ye } = Te(W, () => N.value?.categories || [], "announcement", D), be = v(() => (N.value?.categories || []).map((e) => ({
			label: s(N.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), xe = "", Q;
		function Se(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Ce() {
			Q?.abort(), Q = new AbortController();
			let e = Q;
			h.value = !0, C.value = !1, E.value = "";
			try {
				if (N.value = await ee(e.signal, { cms_source_type: "platform" }), ne.articleId) {
					let t = await l("articles", ne.articleId, e.signal);
					if (N.value = await ee(e.signal, { space_id: String(t.space_id) }), j.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					W.scheduled_local = t.publish_status === "scheduled" ? Se(t.scheduled_at) : "", P.value = t.publish_status;
				}
				xe = JSON.stringify(W);
			} catch (t) {
				e.signal.aborted || (E.value = o(t), C.value = !0);
			} finally {
				e.signal.aborted || (h.value = !1);
			}
		}
		let $ = () => !h.value && !C.value && xe !== JSON.stringify(W);
		function we() {
			$() ? O.value = !0 : p("close");
		}
		function Ee() {
			P.value === "draft" ? Oe("draft") : ce.value = !0;
		}
		function De() {
			ce.value = !1, Oe("draft");
		}
		async function Oe(e) {
			if (U.value || h.value || C.value || F.value || (E.value = "", !await X(e))) return;
			let t = W.scheduled_local ? new Date(W.scheduled_local) : null;
			_.value = !0, E.value = "";
			try {
				await te("articles", {
					...W,
					id: W.id || void 0,
					row_version: W.id ? W.row_version : void 0,
					category_id: W.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), xe = JSON.stringify(W), d.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "公告已发布"), p("saved");
			} catch (e) {
				ve(e);
			} finally {
				_.value = !1;
			}
			J.value && await Z();
		}
		function ke(e) {
			E.value = o(e);
		}
		let Ae = (e) => {
			$() && (e.preventDefault(), e.returnValue = "");
		};
		return ge(() => !_.value && !F.value && (!$() || window.confirm("公告有未保存的修改，确定离开？"))), ue(() => {
			Ce(), window.addEventListener("beforeunload", Ae);
		}), le(() => {
			Q?.abort(), window.removeEventListener("beforeunload", Ae);
		}), (i, a) => (A(), x("section", {
			ref_key: "editorRoot",
			ref: G,
			class: "article-editor",
			"aria-busy": h.value || _.value
		}, [
			S("header", Bn, [
				T(L(n), {
					"icon-only": "",
					title: "返回公告列表",
					"aria-label": "返回公告列表",
					disabled: _.value || F.value,
					onClick: we
				}, {
					default: H(() => [T(L(m), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				S("div", Vn, [S("h2", null, I(t.articleId ? "编辑公告" : "新增公告"), 1), S("span", null, I(N.value?.source_locale || "zh-CN") + " · " + I(j.value), 1)]),
				S("div", Hn, [
					t.articleId && V.value ? (A(), y(L(n), {
						key: 0,
						size: "sm",
						disabled: h.value || C.value || _.value || F.value,
						onClick: a[0] ||= (e) => k.value = !0
					}, {
						default: H(() => [...a[29] ||= [w("删除公告", -1)]]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					T(L(n), {
						size: "sm",
						disabled: h.value || C.value,
						onClick: a[1] ||= (e) => D.value = !0
					}, {
						icon: H(() => [T(L(m), {
							name: "search",
							size: 14
						})]),
						default: H(() => [a[30] ||= w("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					B.value ? b("", !0) : (A(), y(L(n), {
						key: 1,
						size: "sm",
						disabled: h.value || C.value || _.value || F.value,
						onClick: Ee
					}, {
						icon: H(() => [T(L(m), {
							name: "save",
							size: 14
						})]),
						default: H(() => [a[31] ||= w("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					L(Y) ? (A(), x("span", Un, I(L(Y)), 1)) : b("", !0),
					!B.value && L(J) ? (A(), x("span", Wn, "还有 " + I(L(J)) + " 项待完善", 1)) : b("", !0),
					!B.value && R.value ? (A(), y(L(n), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: h.value || C.value || F.value,
						loading: _.value,
						onClick: a[2] ||= (e) => Oe(W.scheduled_local ? "scheduled" : "published")
					}, {
						icon: H(() => [T(L(m), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: H(() => [w(I(W.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : b("", !0)
				])
			]),
			h.value ? (A(), x("div", Gn, [T(L(m), {
				name: "loader-circle",
				class: "announcement-spin",
				size: 28
			}), a[32] ||= S("span", null, "正在读取公告资料...", -1)])) : C.value ? (A(), x("div", Kn, [T(L(re), {
				type: "error",
				description: E.value,
				closable: !1
			}, null, 8, ["description"]), T(L(n), { onClick: Ce }, {
				default: H(() => [...a[33] ||= [w("重新加载", -1)]]),
				_: 1
			})])) : (A(), x(se, { key: 2 }, [E.value ? (A(), x("div", qn, [T(L(re), {
				type: "error",
				description: E.value,
				closable: !1
			}, null, 8, ["description"])])) : b("", !0), S("div", Jn, [S("aside", Yn, [T(L(oe), {
				model: W,
				rules: L(_e),
				"label-position": "top",
				onSubmit: a[13] ||= me(() => {}, ["prevent"])
			}, {
				default: H(() => [
					T(L(e), {
						label: "公告分类",
						prop: "category_id",
						error: L(q).category_id,
						required: ""
					}, {
						default: H(() => [T(L(ae), {
							modelValue: W.category_id,
							"onUpdate:modelValue": a[3] ||= (e) => W.category_id = e,
							options: be.value,
							clearable: "",
							disabled: U.value,
							"aria-label": "公告分类"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					a[34] ||= S("h3", null, "公告设置", -1),
					T(L(e), {
						label: "公告封面",
						prop: "cover_url",
						error: L(q).cover_url
					}, {
						default: H(() => [T(Ve, {
							modelValue: W.cover_url,
							"onUpdate:modelValue": a[4] ||= (e) => W.cover_url = e,
							label: "公告封面",
							disabled: U.value,
							upload: L(f),
							onBusyChange: a[5] ||= (e) => F.value = e,
							onStart: a[6] ||= (e) => E.value = "",
							onError: ke
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "内容来源",
						prop: "content_source",
						error: L(q).content_source
					}, {
						default: H(() => [T(L(g), {
							modelValue: W.content_source,
							"onUpdate:modelValue": a[7] ||= (e) => W.content_source = e,
							maxlength: 160,
							disabled: U.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "作者署名",
						prop: "author_name",
						error: L(q).author_name
					}, {
						default: H(() => [T(L(g), {
							modelValue: W.author_name,
							"onUpdate:modelValue": a[8] ||= (e) => W.author_name = e,
							maxlength: 120,
							disabled: U.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "前端排序",
						prop: "sort_order",
						error: L(q).sort_order
					}, {
						default: H(() => [T(L(ie), {
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
					a[35] ||= S("h3", null, "发布设置", -1),
					T(L(e), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: L(q).helpful_enabled
					}, {
						default: H(() => [T(Bt, {
							modelValue: W.helpful_enabled,
							"onUpdate:modelValue": a[10] ||= (e) => W.helpful_enabled = e,
							disabled: U.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "启用状态",
						prop: "is_enabled",
						error: L(q).is_enabled
					}, {
						default: H(() => [T(Bt, {
							modelValue: W.is_enabled,
							"onUpdate:modelValue": a[11] ||= (e) => W.is_enabled = e,
							disabled: U.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: L(q).scheduled_local
					}, {
						default: H(() => [T(L(g), {
							modelValue: W.scheduled_local,
							"onUpdate:modelValue": a[12] ||= (e) => W.scheduled_local = e,
							type: "datetime-local",
							disabled: U.value || !R.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					a[36] ||= S("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), S("main", Xn, [T(L(oe), {
				model: W,
				rules: L(_e),
				"label-position": "top",
				onSubmit: a[17] ||= me(() => {}, ["prevent"])
			}, {
				default: H(() => [
					T(L(e), {
						label: "标题",
						prop: "title",
						error: L(q).title,
						required: ""
					}, {
						default: H(() => [T(L(g), {
							modelValue: W.title,
							"onUpdate:modelValue": a[14] ||= (e) => W.title = e,
							maxlength: 255,
							disabled: U.value,
							placeholder: "输入公告标题",
							"aria-label": "公告标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "摘要",
						prop: "summary",
						error: L(q).summary
					}, {
						default: H(() => [fe(S("textarea", {
							"onUpdate:modelValue": a[15] ||= (e) => W.summary = e,
							"aria-invalid": !!L(q).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: U.value,
							"aria-label": "公告摘要"
						}, null, 8, Zn), [[z, W.summary]])]),
						_: 1
					}, 8, ["error"]),
					T(L(e), {
						label: "正文",
						prop: "body_html",
						error: L(q).body_html
					}, {
						default: H(() => [T(L(r), {
							modelValue: W.body_html,
							"onUpdate:modelValue": a[16] ||= (e) => W.body_html = e,
							readonly: B.value,
							disabled: _.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "公告正文"
						}, null, 8, [
							"modelValue",
							"readonly",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])])])], 64)),
			T(L(u), {
				modelValue: D.value,
				"onUpdate:modelValue": a[21] ||= (e) => D.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: H(() => [T(L(n), {
					variant: "primary",
					onClick: a[20] ||= (e) => D.value = !1
				}, {
					default: H(() => [...a[37] ||= [w("确定", -1)]]),
					_: 1
				})]),
				default: H(() => [T(L(oe), {
					model: W,
					rules: L(_e),
					"label-position": "top",
					onSubmit: a[19] ||= me(() => {}, ["prevent"])
				}, {
					default: H(() => [T(L(e), {
						label: "SEO 描述",
						prop: "seo_description",
						error: L(q).seo_description
					}, {
						default: H(() => [fe(S("textarea", {
							ref_key: "seoInput",
							ref: K,
							"onUpdate:modelValue": a[18] ||= (e) => W.seo_description = e,
							"aria-invalid": !!L(q).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: U.value,
							"aria-label": "SEO 描述"
						}, null, 8, Qn), [[z, W.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			T(L(u), {
				modelValue: k.value,
				"onUpdate:modelValue": a[23] ||= (e) => k.value = e,
				title: "确认删除",
				subtitle: `操作对象：${W.title || "未命名公告"}`,
				width: "460px",
				"panel-class": "announcement-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !_.value
			}, {
				"header-actions": H(() => [S("span", $n, [T(L(m), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: H(() => [T(L(n), {
					disabled: _.value,
					onClick: a[22] ||= (e) => k.value = !1
				}, {
					default: H(() => [...a[38] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(L(n), {
					variant: "warning",
					loading: _.value,
					onClick: pe
				}, {
					default: H(() => [...a[39] ||= [w("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: H(() => [T(L(re), {
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
			T(L(u), {
				modelValue: O.value,
				"onUpdate:modelValue": a[26] ||= (e) => O.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: H(() => [T(L(n), { onClick: a[24] ||= (e) => O.value = !1 }, {
					default: H(() => [...a[40] ||= [w("继续编辑", -1)]]),
					_: 1
				}), T(L(n), {
					variant: "primary",
					onClick: a[25] ||= (e) => p("close")
				}, {
					default: H(() => [...a[41] ||= [w("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			T(L(u), {
				modelValue: ce.value,
				"onUpdate:modelValue": a[28] ||= (e) => ce.value = e,
				title: "将公告转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: H(() => [T(L(n), { onClick: a[27] ||= (e) => ce.value = !1 }, {
					default: H(() => [...a[42] ||= [w("取消", -1)]]),
					_: 1
				}), T(L(n), {
					variant: "primary",
					onClick: De
				}, {
					default: H(() => [...a[43] ||= [w("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, zn));
	}
}), [["__scopeId", "data-v-525a2f73"]]), tr = { class: "announcement-articles" }, nr = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = he(), { formatDateTime: r } = he(), { announcementPublishStates: a, announcementCategoryLabel: o, getAnnouncementList: s, getAnnouncementMetadata: l } = jn(), u = M(!1), ee = M(), d = (e) => t([`cms_announcement:${e}`]), f = M(), ne = K(l, (e) => {
			f.value = e;
		}), re = [
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
				formatter: (e) => o(f.value, e)
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
		], { proTableBindings: ie, reload: ae, filters: oe } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
				...ne.fields,
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
						label: o(f.value, e.id),
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
		ne.bindFilters(oe);
		let p = new AbortController();
		async function h() {
			try {
				f.value = await l(p.signal);
			} catch {}
		}
		function g(e) {
			ee.value = e, u.value = !0;
		}
		function _() {
			u.value = !1, ae(), h();
		}
		return ue(h), le(() => p.abort()), (e, t) => (A(), x("div", tr, [u.value ? (A(), y(er, {
			key: 0,
			"article-id": ee.value,
			onClose: t[0] ||= (e) => u.value = !1,
			onSaved: _
		}, null, 8, ["article-id"])) : b("", !0), fe(T(L(c), O(L(ie), {
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
			"cell-cms_source_type": H(({ row: e }) => [T(_e, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": H(() => [d("add") ? (A(), y(L(n), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => g()
			}, {
				icon: H(() => [T(L(m), {
					name: "plus",
					size: 14
				})]),
				default: H(() => [t[2] ||= w("新增公告", -1)]),
				_: 1
			})) : b("", !0)]),
			"cell-publish_status": H(({ row: e }) => [T(L(te), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: H(() => [w(I(L(a).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": H(({ row: e }) => [T(L(te), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: H(() => [w(I(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": H(({ row: e }) => [w(I(L(r)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": H(({ row: e }) => [T(L(n), {
				size: "sm",
				"icon-only": "",
				title: d("edit") ? "编辑公告" : "公告详情",
				"aria-label": d("edit") ? "编辑公告" : "公告详情",
				onClick: (t) => g(e.id)
			}, {
				default: H(() => [T(L(m), {
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
		}, 16), [[B, !u.value]])]));
	}
}), [["__scopeId", "data-v-9f055b06"]]);
//#endregion
//#region src/cms/api/content/translations.ts
function rr() {
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
var ir = (e, t) => t > 0 ? Math.min(100, Math.round(e / t * 100)) : 0, ar = (e, t) => `${e}:${t}`;
function or(e, t) {
	return e ? e.fields.flatMap((e) => e.translations.flatMap((n) => {
		let r = t[ar(e.key, n.locale)] ?? n.text;
		return r === n.text ? [] : [{
			field_name: e.key,
			locale: n.locale,
			text: r,
			source_hash: e.source_hash,
			row_version: n.row_version
		}];
	})) : [];
}
function sr(e) {
	return Object.fromEntries(e.fields.flatMap((e) => e.translations.map((t) => [ar(e.key, t.locale), t.text])));
}
function cr(e) {
	return e?.translations.filter((e) => e.status === "ready").length ?? 0;
}
var lr = (e) => !!e && ["queued", "running"].includes(e.status), ur = {
	queued: "等待处理",
	running: "翻译中",
	succeeded: "翻译完成",
	partial_failed: "部分未完成",
	failed: "翻译未完成",
	cancelled: "已取消"
}, dr = {
	draft: "草稿",
	scheduled: "定时发布",
	published: "已发布"
};
function fr(e) {
	if (e && typeof e == "object") {
		let t = e;
		return Object.values(t.errors || {}).flat()[0] || t.msg || t.message || "操作失败，请稍后重试";
	}
	return "操作失败，请稍后重试";
}
//#endregion
//#region src/cms/views/content/localization/translations/index.vue?vue&type=script&setup=true&lang.ts
var pr = ["aria-busy"], mr = { class: "translation-toolbar surface" }, hr = { class: "translation-title" }, gr = { class: "translation-title__icon" }, _r = { class: "translation-progress" }, vr = { class: "translation-toolbar__actions" }, yr = { class: "source-language" }, br = {
	key: 3,
	class: "translation-job surface",
	role: "status"
}, xr = { key: 0 }, Sr = { key: 1 }, Cr = ["title"], wr = {
	class: "language-overview surface",
	"aria-label": "目标语言完成度"
}, Tr = [
	"disabled",
	"title",
	"onClick"
], Er = {
	class: "module-bar surface",
	"aria-label": "翻译内容模块"
}, Dr = { class: "module-count" }, Or = { class: "translation-workspace surface" }, kr = { class: "content-browser" }, Ar = { class: "content-browser__header" }, jr = ["aria-busy"], Mr = {
	key: 0,
	class: "region-status",
	role: "status"
}, Nr = [
	"aria-current",
	"disabled",
	"onClick"
], Pr = { class: "content-item__text" }, Fr = ["title"], Ir = {
	key: 0,
	class: "region-status"
}, Lr = { class: "content-browser__footer" }, Rr = ["aria-busy"], zr = {
	key: 0,
	class: "editor-state",
	role: "status"
}, Br = { class: "translation-editor__header" }, Vr = { class: "translation-editor__title" }, Hr = { key: 0 }, Ur = ["title"], Wr = { class: "source-field" }, Gr = { class: "section-heading" }, Kr = [
	"value",
	"rows",
	"aria-label"
], qr = { class: "section-heading target-heading" }, Jr = {
	key: 0,
	class: "empty-source"
}, Yr = {
	key: 1,
	class: "empty-source"
}, Xr = ["data-locale"], Zr = { class: "target-field__heading" }, Qr = ["for"], $r = {
	key: 0,
	class: "status-stale"
}, ei = {
	key: 1,
	class: "status-ready"
}, ti = [
	"id",
	"onUpdate:modelValue",
	"rows",
	"maxlength",
	"disabled",
	"dir",
	"placeholder"
], ni = { class: "target-field__count" }, ri = {
	key: 2,
	class: "editor-state"
}, ii = {
	key: 1,
	class: "region-status"
}, ai = {
	key: 2,
	class: "mm-translation-settings"
}, oi = { class: "mm-translation-settings__credential" }, si = { key: 0 }, ci = { key: 1 }, li = { key: 2 }, ui = { class: "mm-translation-settings__grid" }, di = { class: "job-confirm" }, fi = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(t) {
		let { cancelTranslationJob: r, createTranslationJob: i, getTranslationDetail: o, getTranslationJob: c, getTranslationList: l, getTranslationMetadata: ne, getTranslationSettings: oe, saveTranslations: h, saveTranslationSettings: _, testTranslationConnection: C } = rr(), { hasPermission: E } = he(), D = M(), O = M(""), j = M("news:content"), de = M([]), P = M(), F = M(""), R = M("title"), B = M(""), me = M(""), U = M(1), W = M(0), G = M({}), K = M(!1), _e = M(!1), q = M(!1), J = M(!1), Y = M(""), X = M(""), ve = M(), Z = M(null), ye = M(!1), be = M(""), xe = M(!1), Q = M(), Se = M(""), Ce = M(!1), $ = M(!1), we = M(!1), Te = M("field"), Ee = M([]), De = M(""), Oe = M(!1), ke = M(!1);
		V(ye, (e) => {
			e || (be.value = "");
		});
		let Ae, je, Me, Ne, Pe, Fe = new AbortController(), Ie, Le = "", Re = v(() => E(["cms_translation:edit"])), ze = v(() => E(["cms_translation:config"])), Be = v(() => E(["cms_translation:translate"])), Ve = v(() => J.value || Ce.value || Oe.value), He = v(() => or(P.value, G.value).length > 0), Ue = v(() => ir(D.value?.done || 0, D.value?.total || 0)), We = v(() => ({
			space_id: O.value,
			module: j.value.split(":")[0],
			kind: j.value.endsWith(":category") ? "category" : "content"
		})), Ge = v(() => D.value?.spaces.map((e) => ({
			label: e.label + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		})) || []), Ke = v(() => D.value?.locales.filter((e) => e.code !== D.value?.source_locale) || []), qe = v(() => Ke.value.map((e) => ({
			label: `${e.flag} ${e.label}`,
			value: e.code
		}))), Je = v(() => Ke.value.map((e) => ({
			label: `${e.label} · ${e.code}`,
			value: e.code
		}))), Ye = v(() => qe.value.filter((e) => nt(String(e.value)))), Xe = v(() => D.value?.locales.find((e) => e.code === D.value?.source_locale)?.label || D.value?.source_locale || "简体中文"), Ze = v(() => P.value?.fields.find((e) => e.key === R.value)), Qe = v(() => {
			let e = D.value?.modules.find((e) => e.key === j.value);
			return e?.kind === "category" ? `${D.value?.modules.find((t) => t.module === e.module && t.kind === "content")?.label || ""}分类` : e?.label || "新闻";
		}), $e = v(() => {
			let e = [];
			for (let t of D.value?.modules || []) {
				let n = e.find((e) => e[0].module === t.module);
				n ? n.push(t) : e.push([t]);
			}
			return e;
		}), et = v(() => !!O.value && D.value?.space_enabled && !!D.value.target_locales.length && !lr(Z.value) && !Ve.value && !He.value && !K.value && !_e.value), tt = v(() => Z.value ? ir([
			"succeeded",
			"skipped",
			"cancelled"
		].reduce((e, t) => e + (Z.value?.counts[t] || 0), 0) + (lr(Z.value) ? 0 : Z.value.counts.failed || 0), Z.value.total) : 0), nt = (e) => D.value?.target_locales.includes(e) ?? !1, rt = (e) => D.value?.locales.find((t) => t.code === e), it = (e) => ({
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
			Ae = void 0, ke.value = !1, G.value = P.value ? sr(P.value) : {}, e?.();
		}
		function st() {
			ke.value = !1, Ae = void 0, Pe?.(!1), Pe = void 0;
		}
		function ct(e) {
			e !== O.value && at(() => {
				O.value = e, B.value = "", me.value = "", U.value = 1, Z.value = null, pt();
			});
		}
		function lt(e) {
			e.available && j.value !== e.key && at(() => {
				j.value = e.key, B.value = "", me.value = "", U.value = 1, ht();
			});
		}
		function ut(e) {
			at(() => {
				U.value = e, ht();
			});
		}
		function dt() {
			at(() => {
				me.value = B.value.trim(), U.value = 1, ht();
			});
		}
		function ft(e) {
			e !== F.value && at(() => {
				gt(e);
			});
		}
		async function pt() {
			Ne?.abort();
			let e = Ne = new AbortController();
			K.value = !0, Y.value = "";
			try {
				let t = await ne(O.value || void 0, e.signal);
				if (e.signal.aborted) return;
				D.value = t, O.value = t.space_id || "", await ht(), Tt();
			} catch (t) {
				e.signal.aborted || (Y.value = fr(t));
			} finally {
				e.signal.aborted || (K.value = !1);
			}
		}
		async function mt() {
			let e = O.value;
			if (e) try {
				let t = await ne(e, Fe.signal);
				e === O.value && (D.value = t);
			} catch {}
		}
		async function ht() {
			je?.abort(), Me?.abort();
			let e = je = new AbortController();
			if (_e.value = !0, q.value = !1, P.value = void 0, F.value = "", G.value = {}, Y.value = "", !O.value) {
				de.value = [], W.value = 0, _e.value = !1;
				return;
			}
			let t = { ...We.value };
			try {
				let n = await l(t, me.value, U.value, e.signal);
				if (e.signal.aborted) return;
				de.value = n.lists, W.value = n.count, de.value[0] && await gt(de.value[0].id);
			} catch (t) {
				e.signal.aborted || (de.value = [], W.value = 0, Y.value = fr(t));
			} finally {
				e.signal.aborted || (_e.value = !1);
			}
		}
		async function gt(e) {
			Me?.abort();
			let t = Me = new AbortController();
			q.value = !0, F.value = e, P.value = void 0, G.value = {}, Y.value = "";
			try {
				let n = await o({ ...We.value }, e, t.signal);
				if (t.signal.aborted) return;
				P.value = n, G.value = sr(n), n.fields.some((e) => e.key === R.value) || (R.value = n.fields[0]?.key || ""), ve.value?.scrollTo({ top: 0 });
			} catch (e) {
				t.signal.aborted || (Y.value = fr(e));
			} finally {
				t.signal.aborted || (q.value = !1);
			}
		}
		async function _t() {
			if (!P.value || !Re.value || Ve.value) return;
			let e = or(P.value, G.value);
			if (e.length) {
				if (e.some((e) => !e.text.trim())) {
					Y.value = "译文不能为空；未翻译的语言请保持未填写。";
					return;
				}
				J.value = !0, Y.value = "";
				try {
					let t = await h({ ...We.value }, P.value.id, e);
					P.value = t, G.value = sr(t);
					let n = de.value.findIndex((e) => e.id === t.id);
					n >= 0 && (de.value[n] = t), d.success("翻译已保存"), mt();
				} catch (e) {
					Y.value = fr(e);
				} finally {
					J.value = !1;
				}
			}
		}
		async function vt(e) {
			X.value = e, await ce();
			let t = ve.value?.querySelector(`[data-locale="${e}"]`);
			t?.scrollIntoView({
				block: "nearest",
				behavior: "smooth"
			}), t?.querySelector("textarea")?.focus();
		}
		async function yt() {
			if (!(!ze.value || !O.value)) {
				ye.value = !0, xe.value = !0, Se.value = "", Q.value = void 0, be.value = "";
				try {
					Q.value = await oe(O.value, Fe.signal);
				} catch (e) {
					Se.value = fr(e);
				} finally {
					xe.value = !1;
				}
			}
		}
		async function bt() {
			if (!(!Q.value || Ce.value)) {
				if (He.value) {
					Se.value = "请先保存或放弃当前译文修改，再修改配置。";
					return;
				}
				Ce.value = !0, Se.value = "";
				try {
					await _(Q.value, be.value.trim()), be.value = "", ye.value = !1, d.success("翻译配置已保存"), await pt();
				} catch (e) {
					Se.value = fr(e);
				} finally {
					Ce.value = !1;
				}
			}
		}
		async function xt() {
			if (!(!Q.value || $.value || Ce.value)) {
				$.value = !0, Se.value = "";
				try {
					await C(Q.value.space_id, Q.value.space_revision, be.value.trim()), d.success("Google Translate 连接成功");
				} catch (e) {
					Se.value = fr(e);
				} finally {
					$.value = !1;
				}
			}
		}
		function St(e) {
			Te.value = e, Ee.value = [...D.value?.target_locales || []], De.value = "", Le = crypto.randomUUID(), we.value = !0;
		}
		async function Ct() {
			if (!(!Ee.value.length || Oe.value)) {
				Oe.value = !0, De.value = "";
				try {
					let e = await i({ ...We.value }, {
						request_key: Le,
						target_locales: Ee.value,
						...Te.value === "field" ? {
							id: F.value,
							field_name: R.value
						} : { keyword: me.value }
					});
					Z.value = e.job, we.value = !1, d.success("翻译任务已提交"), wt();
				} catch (e) {
					De.value = fr(e);
				} finally {
					Oe.value = !1;
				}
			}
		}
		function wt() {
			clearTimeout(Ie), lr(Z.value) && (Ie = setTimeout(() => {
				Tt();
			}, 3e3));
		}
		async function Tt() {
			let e = O.value;
			if (!e || Fe.signal.aborted) return;
			let t = lr(Z.value);
			try {
				let n = await c(e, Fe.signal);
				if (e !== O.value) return;
				Z.value = n.job, t && !lr(Z.value) && (await mt(), !He.value && !Ve.value && F.value && await gt(F.value));
			} catch {}
			wt();
		}
		async function Et() {
			if (Z.value) try {
				let e = await r(O.value, Z.value.id);
				Z.value = e.job, clearTimeout(Ie), mt();
			} catch (e) {
				Y.value = fr(e);
			}
		}
		function Dt(e) {
			(He.value || Ve.value) && (e.preventDefault(), e.returnValue = "");
		}
		return ge(() => !He.value && !Ve.value || !Ve.value && new Promise((e) => {
			Pe?.(!1), Pe = e, Ae = () => {
				Pe = void 0, e(!0);
			}, ke.value = !0;
		})), ue(() => {
			window.addEventListener("beforeunload", Dt), pt();
		}), le(() => {
			be.value = "", Pe?.(!1), Fe.abort(), je?.abort(), Me?.abort(), Ne?.abort(), clearTimeout(Ie), window.removeEventListener("beforeunload", Dt);
		}), (t, r) => (A(), x("section", {
			class: "translations-page",
			"aria-label": "多语言翻译管理",
			"aria-busy": K.value
		}, [
			S("header", mr, [S("div", hr, [S("span", gr, [T(L(m), {
				name: "globe",
				size: 21
			})]), S("div", null, [r[21] ||= S("h1", null, "语言翻译管理", -1), S("div", _r, [
				S("strong", null, I(Ue.value) + "%", 1),
				T(L(a), {
					percentage: Ue.value,
					"show-text": !1,
					"stroke-width": 4,
					"aria-label": "全部翻译完成度"
				}, null, 8, ["percentage"]),
				S("span", null, I(D.value?.done.toLocaleString() || 0) + " / " + I(D.value?.total.toLocaleString() || 0) + " 个目标字段", 1)
			])])]), S("div", vr, [
				T(L(ae), {
					"model-value": O.value,
					options: Ge.value,
					size: "sm",
					disabled: K.value || Ve.value,
					placeholder: "内容空间",
					"aria-label": "内容空间",
					"onUpdate:modelValue": r[0] ||= (e) => ct(String(e))
				}, null, 8, [
					"model-value",
					"options",
					"disabled"
				]),
				S("span", yr, [r[22] ||= w("内容源语言 ", -1), S("b", null, I(Xe.value), 1)]),
				ze.value ? (A(), y(L(n), {
					key: 0,
					size: "sm",
					disabled: !O.value || Ve.value,
					onClick: yt
				}, {
					icon: H(() => [T(L(m), {
						name: "sliders-horizontal",
						size: 14
					})]),
					default: H(() => [r[23] ||= w("翻译配置", -1)]),
					_: 1
				}, 8, ["disabled"])) : b("", !0),
				Be.value ? (A(), y(L(n), {
					key: 1,
					size: "sm",
					disabled: !et.value,
					onClick: r[1] ||= (e) => St("batch")
				}, {
					icon: H(() => [T(L(m), {
						name: "rocket",
						size: 14
					})]),
					default: H(() => [r[24] ||= w("批量翻译", -1)]),
					_: 1
				}, 8, ["disabled"])) : b("", !0),
				Be.value ? (A(), y(L(n), {
					key: 2,
					size: "sm",
					disabled: !et.value || !P.value || !Ze.value?.translatable,
					onClick: r[2] ||= (e) => St("field")
				}, {
					icon: H(() => [T(L(m), {
						name: "globe",
						size: 14
					})]),
					default: H(() => [r[25] ||= w("翻译当前字段", -1)]),
					_: 1
				}, 8, ["disabled"])) : b("", !0),
				Re.value ? (A(), y(L(n), {
					key: 3,
					size: "sm",
					variant: "primary",
					loading: J.value,
					disabled: !He.value || Ve.value || !D.value?.space_enabled,
					onClick: _t
				}, {
					icon: H(() => [T(L(m), {
						name: "save",
						size: 14
					})]),
					default: H(() => [r[26] ||= w("保存翻译", -1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : b("", !0)
			])]),
			Y.value ? (A(), y(L(re), {
				key: 0,
				type: "error",
				closable: !0,
				onClose: r[3] ||= (e) => Y.value = ""
			}, {
				default: H(() => [w(I(Y.value), 1)]),
				_: 1
			})) : b("", !0),
			D.value && !D.value.space_enabled && O.value ? (A(), y(L(re), {
				key: 1,
				type: "warning"
			}, {
				default: H(() => [...r[27] ||= [w("当前内容空间已停用，仅可查看翻译。", -1)]]),
				_: 1
			})) : b("", !0),
			D.value && !D.value.target_locales.length && O.value ? (A(), y(L(re), {
				key: 2,
				type: "info"
			}, {
				default: H(() => [...r[28] ||= [w("尚未启用目标语言，请在“翻译配置”中选择语言后开始翻译。", -1)]]),
				_: 1
			})) : b("", !0),
			Z.value ? (A(), x("div", br, [
				T(L(m), {
					name: L(lr)(Z.value) ? "loader-circle" : "info",
					size: 15
				}, null, 8, ["name"]),
				S("strong", null, I(L(ur)[Z.value.status] || Z.value.status), 1),
				S("span", null, "任务 #" + I(Z.value.id), 1),
				T(L(a), {
					percentage: tt.value,
					"show-text": !1,
					"stroke-width": 4
				}, null, 8, ["percentage"]),
				S("span", null, [
					w(I(Z.value.counts.succeeded || 0) + " / " + I(Z.value.total) + " 已完成", 1),
					Z.value.counts.failed ? (A(), x("span", xr, " · " + I(Z.value.counts.failed) + " 失败", 1)) : b("", !0),
					Z.value.counts.skipped ? (A(), x("span", Sr, " · " + I(Z.value.counts.skipped) + " 冲突跳过", 1)) : b("", !0)
				]),
				L(lr)(Z.value) && Be.value ? (A(), y(L(n), {
					key: 0,
					size: "sm",
					variant: "text",
					disabled: Ve.value,
					onClick: Et
				}, {
					default: H(() => [...r[29] ||= [w("取消任务", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (A(), y(L(n), {
					key: 1,
					size: "sm",
					variant: "text",
					onClick: r[4] ||= (e) => Z.value = null
				}, {
					default: H(() => [...r[30] ||= [w("收起", -1)]]),
					_: 1
				})),
				Z.value.errors.length ? (A(), x("span", {
					key: 2,
					class: "translation-job__error",
					title: Z.value.errors.map((e) => `${e.target_locale}: ${e.error_code}`).join("；")
				}, I(Z.value.errors[0].error_code) + "（可重新提交补翻）", 9, Cr)) : b("", !0)
			])) : b("", !0),
			S("div", wr, [(A(!0), x(se, null, N(Ke.value, (e) => (A(), x("button", {
				key: e.code,
				type: "button",
				class: k(["language-card", {
					"is-active": X.value === e.code,
					"is-disabled": !nt(e.code)
				}]),
				disabled: !nt(e.code),
				title: nt(e.code) ? `${e.native}：${e.done} / ${e.total}` : "请在翻译配置中启用",
				onClick: (t) => vt(e.code)
			}, [
				S("span", null, I(e.flag), 1),
				S("span", null, I(e.label), 1),
				S("strong", null, I(nt(e.code) ? L(ir)(e.done, e.total) + "%" : "未启用"), 1),
				T(L(a), {
					percentage: L(ir)(e.done, e.total),
					"show-text": !1,
					"stroke-width": 2
				}, null, 8, ["percentage"])
			], 10, Tr))), 128))]),
			S("nav", Er, [(A(!0), x(se, null, N($e.value, (e) => (A(), x("div", {
				key: e[0].module,
				class: "module-group"
			}, [(A(!0), x(se, null, N(e, (e) => (A(), y(L(n), {
				key: e.key,
				variant: j.value === e.key ? "primary" : "text",
				plain: j.value === e.key,
				size: "sm",
				disabled: !e.available || Ve.value,
				title: e.reason,
				"aria-pressed": j.value === e.key,
				onClick: (t) => lt(e)
			}, {
				default: H(() => [
					e.kind === "category" ? b("", !0) : (A(), y(L(m), {
						key: 0,
						name: it(e.module),
						size: 14
					}, null, 8, ["name"])),
					w(I(e.label), 1),
					S("span", Dr, I(e.count), 1)
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
			S("main", Or, [S("aside", kr, [
				S("div", Ar, [S("div", null, [S("strong", null, I(Qe.value), 1), S("span", null, I(W.value) + " 条" + I(We.value.kind === "category" ? "分类" : "内容"), 1)]), T(L(g), {
					modelValue: B.value,
					"onUpdate:modelValue": r[5] ||= (e) => B.value = e,
					size: "sm",
					clearable: "",
					placeholder: "搜索内容",
					"aria-label": "搜索内容",
					onKeydown: pe(dt, ["enter"])
				}, {
					prefix: H(() => [T(L(m), {
						name: "search",
						size: 14
					})]),
					_: 1
				}, 8, ["modelValue"])]),
				S("div", {
					class: "content-browser__list",
					"aria-busy": _e.value
				}, [_e.value ? (A(), x("p", Mr, "加载内容中…")) : (A(), x(se, { key: 1 }, [(A(!0), x(se, null, N(de.value, (e) => (A(), x("button", {
					key: e.id,
					type: "button",
					class: k(["content-item", { "is-selected": F.value === e.id }]),
					"aria-current": F.value === e.id ? "true" : void 0,
					disabled: Ve.value,
					onClick: (t) => ft(e.id)
				}, [S("span", Pr, [S("strong", { title: e.title }, I(e.title), 9, Fr), S("small", null, I(L(dr)[e.publish_status || ""] || "分类") + " · " + I(e.done) + "/" + I(e.total), 1)]), T(L(a), {
					type: "circle",
					percentage: L(ir)(e.done, e.total),
					"show-text": !1,
					size: 16,
					"stroke-width": 2,
					status: e.total && e.done === e.total ? "success" : "warning"
				}, null, 8, ["percentage", "status"])], 10, Nr))), 128)), de.value.length ? b("", !0) : (A(), x("p", Ir, I(me.value ? "没有匹配的内容" : "暂无可翻译内容"), 1))], 64))], 8, jr),
				S("footer", Lr, [
					T(L(n), {
						size: "sm",
						"icon-only": "",
						"aria-label": "上一页",
						disabled: U.value <= 1 || _e.value || Ve.value,
						onClick: r[6] ||= (e) => ut(U.value - 1)
					}, {
						default: H(() => [T(L(m), {
							name: "chevron-left",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"]),
					S("span", null, I(U.value) + " / " + I(Math.max(1, Math.ceil(W.value / 30))), 1),
					T(L(n), {
						size: "sm",
						"icon-only": "",
						"aria-label": "下一页",
						disabled: U.value * 30 >= W.value || _e.value || Ve.value,
						onClick: r[7] ||= (e) => ut(U.value + 1)
					}, {
						default: H(() => [T(L(m), {
							name: "chevron-right",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"])
				])
			]), S("section", {
				class: "translation-editor",
				"aria-busy": q.value
			}, [q.value ? (A(), x("div", zr, [T(L(m), {
				name: "loader-circle",
				size: 28
			}), r[31] ||= S("p", null, "加载译文中…", -1)])) : P.value ? (A(), x(se, { key: 1 }, [S("header", Br, [S("div", Vr, [S("span", null, [w(I(Qe.value) + " ", 1), He.value ? (A(), x("em", Hr, "有未保存修改")) : b("", !0)]), S("h2", { title: P.value.title }, I(P.value.title), 9, Ur)]), T(L(ee), {
				modelValue: R.value,
				"onUpdate:modelValue": r[8] ||= (e) => R.value = e
			}, {
				default: H(() => [(A(!0), x(se, null, N(P.value.fields, (e) => (A(), y(L(s), {
					key: e.key,
					name: e.key,
					label: `${e.label} ${e.translatable ? L(cr)(e) + "/" + e.translations.length : "—"}`
				}, null, 8, ["name", "label"]))), 128))]),
				_: 1
			}, 8, ["modelValue"])]), Ze.value ? (A(), x("div", {
				key: 0,
				class: "translation-editor__body",
				ref_key: "editorBody",
				ref: ve
			}, [
				S("section", Wr, [S("div", Gr, [S("strong", null, [w(I(Xe.value) + " ", 1), T(L(te), {
					size: "sm",
					type: "primary",
					effect: "soft"
				}, {
					default: H(() => [...r[32] ||= [w("内容源语言", -1)]]),
					_: 1
				})]), r[33] ||= S("span", null, "只读原文", -1)]), S("textarea", {
					value: Ze.value.source,
					readonly: "",
					rows: Ze.value.key === "body_html" ? 5 : 2,
					class: "translation-textarea source-textarea",
					"aria-label": `原文${Ze.value.label}`
				}, null, 8, Kr)]),
				S("div", qr, [r[34] ||= S("strong", null, "目标语言", -1), S("span", null, I(P.value.fields.find((e) => e.key === R.value)?.translations.length || 0) + " 种语言 · 手工修改后请保存", 1)]),
				Ze.value.translatable ? Ze.value.translations.length ? (A(), x("div", {
					key: 2,
					class: k(["target-grid", { "is-body": R.value === "body_html" }])
				}, [(A(!0), x(se, null, N(Ze.value.translations, (e) => (A(), x("div", {
					key: e.locale,
					class: k(["target-field", { "is-focused": X.value === e.locale }]),
					"data-locale": e.locale
				}, [
					S("div", Zr, [S("label", { for: `translation-${R.value}-${e.locale}` }, [w(I(rt(e.locale)?.native || e.locale) + " ", 1), S("small", null, I(e.locale), 1)], 8, Qr), e.status === "stale" ? (A(), x("span", $r, "原文已更新")) : e.status === "ready" ? (A(), x("span", ei, I(e.method === "machine" ? "机器翻译" : "已保存"), 1)) : b("", !0)]),
					fe(S("textarea", {
						id: `translation-${R.value}-${e.locale}`,
						"onUpdate:modelValue": (t) => G.value[L(ar)(R.value, e.locale)] = t,
						class: "translation-textarea",
						rows: R.value === "body_html" ? 10 : 2,
						maxlength: Ze.value.max_length,
						disabled: !Re.value || !D.value?.space_enabled || Ve.value,
						dir: e.locale === "ar" ? "rtl" : "auto",
						placeholder: `请输入${rt(e.locale)?.native || e.locale}翻译${R.value === "body_html" ? "（HTML）" : ""}`
					}, null, 8, ti), [[z, G.value[L(ar)(R.value, e.locale)]]]),
					S("div", ni, I((G.value[L(ar)(R.value, e.locale)] || "").length.toLocaleString()) + " / " + I(Ze.value.max_length.toLocaleString()), 1)
				], 10, Xr))), 128))], 2)) : (A(), x("div", Yr, " 请先在“翻译配置”中启用目标语言。 ")) : (A(), x("div", Jr, [T(L(m), {
					name: "info",
					size: 18
				}), r[35] ||= w("原文字段为空，不参与翻译和完成度统计。 ", -1)]))
			], 512)) : b("", !0)], 64)) : (A(), x("div", ri, [T(L(p), { description: Y.value ? "内容加载失败，可点击刷新重试" : "选择左侧内容开始翻译" }, null, 8, ["description"]), Y.value ? (A(), y(L(n), {
				key: 0,
				size: "sm",
				onClick: pt
			}, {
				default: H(() => [...r[36] ||= [w("重新加载", -1)]]),
				_: 1
			})) : b("", !0)]))], 8, Rr)]),
			T(L(u), {
				modelValue: ye.value,
				"onUpdate:modelValue": r[16] ||= (e) => ye.value = e,
				title: "翻译配置",
				subtitle: "当前内容空间共用 · Google Cloud Translation Basic v2",
				width: "560px",
				"close-on-click-modal": !1,
				"before-close": () => !Ce.value && !$.value
			}, {
				footer: H(() => [
					T(L(n), {
						loading: $.value,
						disabled: !Q.value?.credential_configured && !be.value.trim() || Ce.value || xe.value,
						onClick: xt
					}, {
						default: H(() => [...r[43] ||= [w("测试连接", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"]),
					T(L(n), {
						disabled: Ce.value || $.value,
						onClick: r[15] ||= (e) => ye.value = !1
					}, {
						default: H(() => [...r[44] ||= [w("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					T(L(n), {
						variant: "primary",
						loading: Ce.value,
						disabled: !Q.value || xe.value || $.value,
						onClick: bt
					}, {
						default: H(() => [...r[45] ||= [w("保存翻译配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])
				]),
				default: H(() => [Se.value ? (A(), y(L(re), {
					key: 0,
					type: "error"
				}, {
					default: H(() => [w(I(Se.value), 1)]),
					_: 1
				})) : b("", !0), xe.value ? (A(), x("div", ii, "加载配置中…")) : Q.value ? (A(), x("div", ai, [
					S("label", null, [r[37] ||= w(" 目标语言 ", -1), T(L(ae), {
						modelValue: Q.value.target_locales,
						"onUpdate:modelValue": r[9] ||= (e) => Q.value.target_locales = e,
						options: Je.value,
						multiple: "",
						filterable: "",
						"max-tag-count": 4,
						placeholder: "选择需要维护的目标语言",
						disabled: Ce.value || $.value,
						"aria-label": "翻译目标语言"
					}, null, 8, [
						"modelValue",
						"options",
						"disabled"
					])]),
					T(f, {
						modelValue: Q.value.is_enabled,
						"onUpdate:modelValue": r[10] ||= (e) => Q.value.is_enabled = e,
						disabled: Ce.value || $.value,
						"credential-ready": !!Q.value.credential_configured || !!be.value.trim()
					}, null, 8, [
						"modelValue",
						"disabled",
						"credential-ready"
					]),
					S("div", oi, [
						S("label", null, [r[38] ||= w(" Google API Key ", -1), T(L(g), {
							modelValue: be.value,
							"onUpdate:modelValue": r[11] ||= (e) => be.value = e,
							type: "password",
							autocomplete: "new-password",
							disabled: Ce.value || $.value,
							placeholder: Q.value.credential_configured ? "已配置，留空保留原密钥；输入新密钥替换" : "请输入 Google Cloud Translation API Key"
						}, null, 8, [
							"modelValue",
							"disabled",
							"placeholder"
						])]),
						Q.value.api_key_mask ? (A(), x("small", si, I(Q.value.credential_source === "database" ? "数据库密钥" : "环境配置密钥") + "：" + I(Q.value.api_key_mask), 1)) : b("", !0),
						Q.value.credential_error === "GOOGLE_CREDENTIAL_DECRYPT_FAILED" ? (A(), x("small", ci, "数据库密钥无法解密，请检查两套后台的专用加密配置，或输入新密钥替换。")) : (A(), x("small", li, "密钥加密保存，不回显原文；留空保留原值。未配置密钥时仍可人工翻译。"))
					]),
					S("div", ui, [
						S("label", null, [r[39] ||= w(" 并发上限 ", -1), T(L(ie), {
							modelValue: Q.value.concurrency_limit,
							"onUpdate:modelValue": r[12] ||= (e) => Q.value.concurrency_limit = e,
							min: 1,
							max: 20,
							disabled: Ce.value || $.value
						}, null, 8, ["modelValue", "disabled"])]),
						S("label", null, [r[40] ||= w(" 请求超时（秒） ", -1), T(L(ie), {
							modelValue: Q.value.request_timeout_seconds,
							"onUpdate:modelValue": r[13] ||= (e) => Q.value.request_timeout_seconds = e,
							min: 1,
							max: 120,
							disabled: Ce.value || $.value
						}, null, 8, ["modelValue", "disabled"])]),
						S("label", null, [r[41] ||= w(" 最大尝试次数 ", -1), T(L(ie), {
							modelValue: Q.value.max_attempts,
							"onUpdate:modelValue": r[14] ||= (e) => Q.value.max_attempts = e,
							min: 1,
							max: 10,
							disabled: Ce.value || $.value
						}, null, 8, ["modelValue", "disabled"])])
					]),
					Q.value.supported ? b("", !0) : (A(), y(L(re), {
						key: 0,
						type: "warning"
					}, {
						default: H(() => [...r[42] ||= [w("当前空间关联了其他版本的翻译配置。保存将为该空间创建独立的 Google v2 配置，不修改其他空间。", -1)]]),
						_: 1
					}))
				])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			T(L(u), {
				modelValue: we.value,
				"onUpdate:modelValue": r[19] ||= (e) => we.value = e,
				title: Te.value === "field" ? "翻译当前字段" : "批量翻译",
				subtitle: "Google Translate · 仅补齐缺失及原文已更新的译文",
				width: "520px",
				"close-on-click-modal": !1,
				"before-close": () => !Oe.value
			}, {
				footer: H(() => [T(L(n), {
					size: "sm",
					disabled: Oe.value,
					onClick: r[18] ||= (e) => we.value = !1
				}, {
					default: H(() => [...r[47] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(L(n), {
					variant: "primary",
					size: "sm",
					loading: Oe.value,
					disabled: !Ee.value.length,
					onClick: Ct
				}, {
					default: H(() => [...r[48] ||= [w("确认翻译", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])]),
				default: H(() => [S("div", di, [
					S("p", null, I(Te.value === "field" ? `当前内容的「${Ze.value?.label}」` : `当前空间「${Qe.value}」${me.value ? "中匹配搜索条件的内容" : "全部内容"}`), 1),
					T(L(e), { label: "目标语言" }, {
						default: H(() => [T(L(ae), {
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
					T(L(re), { type: "warning" }, {
						default: H(() => [...r[46] ||= [w("内容将发送至 Google Translate，并可能产生翻译费用。已有有效译文不会覆盖；单次最多 200 条内容、5,000 个字段任务。后台任务需要已启动翻译 worker。", -1)]]),
						_: 1
					}),
					De.value ? (A(), y(L(re), {
						key: 0,
						type: "error"
					}, {
						default: H(() => [w(I(De.value), 1)]),
						_: 1
					})) : b("", !0)
				])]),
				_: 1
			}, 8, [
				"modelValue",
				"title",
				"before-close"
			]),
			T(L(u), {
				modelValue: ke.value,
				"onUpdate:modelValue": r[20] ||= (e) => ke.value = e,
				title: "有未保存的翻译",
				subtitle: "切换后将丢弃当前修改，是否继续？",
				width: "380px",
				onClose: st
			}, {
				footer: H(() => [T(L(n), {
					size: "sm",
					onClick: st
				}, {
					default: H(() => [...r[49] ||= [w("继续编辑", -1)]]),
					_: 1
				}), T(L(n), {
					size: "sm",
					variant: "warning",
					onClick: ot
				}, {
					default: H(() => [...r[50] ||= [w("放弃修改并继续", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, pr));
	}
}), [["__scopeId", "data-v-1430b3cb"]]), pi = {
	key: 0,
	class: "mm-cms-site"
}, mi = ["disabled"], hi = ["value"], gi = {
	key: 1,
	role: "alert"
}, _i = {
	key: 2,
	role: "status"
}, vi = { key: 3 }, yi = ["disabled"], bi = /*#__PURE__*/ _(/* @__PURE__ */ E({
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
			"news/categories": Q,
			"news/list": at,
			"academy/categories": pt,
			"academy/courses": Lt,
			"help/categories": $t,
			"help/articles": bn,
			"feedback/list": An,
			"announcement/categories": Rn,
			"announcement/list": nr,
			"localization/translations": fi
		}, r = t.runtime.mode === "white_label" && !!t.runtime.resolveSiteInRequest, i = M(!1), a = M(0), o = M([]), s = M(""), c = M(""), l = M(t.runtime.mode === "white_label" && !r), u = M(!1), ee = v(() => o.value.find((e) => e.site_id === s.value)), te = v(() => n[t.page]), d = v(() => t.runtime.hasPermission([
			"cms_news:add",
			"cms_academy:add",
			"cms_help:add",
			"cms_announcement:add"
		])), f = new AbortController(), ne = !0, re = !1;
		function ie(e) {
			re = !0;
			try {
				o.value = e.sites, s.value = e.site_id ?? "", i.value = !0;
			} finally {
				re = !1;
			}
		}
		let ae = W(t.runtime, ie);
		V(s, () => {
			!r || re || (ae.invalidate(), ae = W(t.runtime, ie, ee.value?.space_id ?? null), a.value++);
		}, { flush: "sync" });
		function oe(e, n) {
			if (!ne || t.runtime.mode === "white_label" && ee.value?.space_id !== n) throw Error("站点已切换，请重新操作");
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
		j(U, {
			get mode() {
				return t.runtime.mode;
			},
			hasPermission: (e) => t.runtime.hasPermission(e),
			formatDateTime: (e) => t.runtime.formatDateTime(e),
			registerBeforeLeave: (e) => t.runtime.registerBeforeLeave?.(e),
			get request() {
				if (r) return ae.request;
				let e = ee.value?.space_id;
				return {
					get: (n, r) => t.runtime.request.get(oe(n, e), r),
					post: (n, r) => t.runtime.request.post(oe(n, e), r)
				};
			}
		});
		async function p() {
			let e = await t.runtime.request.get({
				url: "/cms/sites",
				signal: f.signal
			});
			f.signal.aborted || (o.value = e.sites, o.value.some((e) => e.site_id === s.value) || (s.value = o.value[0]?.site_id ?? ""));
		}
		async function m() {
			if (!ee.value || u.value) return;
			let e = a.value;
			u.value = !0;
			try {
				let n = await t.runtime.request.post({
					url: "/cms/initialize",
					params: { site_id: ee.value.site_id }
				}, { isOpenRetry: !1 });
				if (!ne || r && e !== a.value) return;
				if (r) {
					if (!n.cms_context) throw Error("初始化接口未返回站点信息");
					ae.invalidate(), ae = W(t.runtime, ie, n.cms_context.space_id), ie(n.cms_context), a.value++;
				} else await p();
			} catch (e) {
				c.value = e instanceof Error ? e.message : "初始化失败";
			} finally {
				u.value = !1;
			}
		}
		return ue(async () => {
			if (t.runtime.mode === "white_label" && !r) try {
				await p();
			} catch {
				f.signal.aborted || (c.value = "加载站点失败，请刷新重试");
			} finally {
				l.value = !1;
			}
		}), le(() => {
			ne = !1, ae.invalidate(), f.abort();
		}), (t, n) => (A(), x("section", { class: k(["mm-cms-page", { "is-viewport": e.viewport }]) }, [e.runtime.mode === "white_label" && e.showSiteSelector && (!L(r) || i.value) ? (A(), x("header", pi, [S("label", null, [n[1] ||= w("内容站点 ", -1), fe(S("select", {
			"onUpdate:modelValue": n[0] ||= (e) => s.value = e,
			disabled: l.value
		}, [(A(!0), x(se, null, N(o.value, (e) => (A(), x("option", {
			key: e.site_id,
			value: e.site_id
		}, I(e.label), 9, hi))), 128))], 8, mi), [[R, s.value]])]), n[2] ||= S("span", null, "各站点内容独立管理", -1)])) : b("", !0), c.value ? (A(), x("p", gi, I(c.value), 1)) : l.value ? (A(), x("p", _i, "正在加载站点…")) : e.runtime.mode === "white_label" && (!L(r) || i.value) && !ee.value?.space_id ? (A(), x("div", vi, [S("p", null, I(ee.value ? "该站点尚未初始化内容空间。" : "暂无可管理的内容站点。"), 1), ee.value && d.value ? (A(), x("button", {
			key: 0,
			type: "button",
			disabled: u.value,
			onClick: m
		}, "初始化空内容空间", 8, yi)) : b("", !0)])) : (A(), y(P(te.value), { key: `${e.page}:${e.identityKey}:${L(r) ? a.value : ee.value?.space_id ?? "platform"}` }))], 2));
	}
}), [["__scopeId", "data-v-f447749a"]]);
//#endregion
//#region src/cms/permission-tree.ts
function xi(e, t, n = "", r = 0) {
	let i = e.children ?? [], a = e.type === "C" && !!(e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:")), o = t(e), s = n ? `${n} / ${o}` : o, c = a || e.type === "M" && r > 0 ? s : n;
	return [...!i.length || a ? [{
		id: e.id,
		name: a || e.type === "A" && e.perms?.startsWith("cms_") ? s : o
	}] : [], ...i.flatMap((e) => xi(e, t, c, r + 1))];
}
function Si(e, t) {
	let n = new Set(t.map(String)), r = /* @__PURE__ */ new Set(), i = [];
	function a(e) {
		let t = e.children ?? [], o = (!t.length || e.type === "C" && (e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:"))) && n.has(String(e.id));
		for (let e of t) a(e) && (o = !0);
		return o && !r.has(String(e.id)) && (r.add(String(e.id)), i.push(e.id)), !!o;
	}
	return e.forEach(a), i;
}
//#endregion
export { bi as MmCmsPage, Ve as MmMediaUpload, xi as cmsPermissionItems, Si as cmsPermissionSubmission, l as createMediaUploader };

//# sourceMappingURL=cms.js.map