import { Cn as e, Mr as t, N as n, Sn as r, Tr as i, Vi as a, Yn as o, _i as s, br as c, ei as l, f as u, gi as d, gr as ee, hi as te, j as ne, mi as re, ni as ie, ri as ae, ti as oe, yi as se } from "./src-BIXBCd37.js";
import { d as f, f as p, n as m, u as h } from "./Loading-NM70IAOz.js";
import { Fragment as g, computed as _, createBlock as v, createCommentVNode as y, createElementBlock as b, createElementVNode as x, createTextVNode as S, createVNode as C, defineComponent as w, inject as T, mergeProps as E, nextTick as ce, normalizeClass as D, onBeforeUnmount as le, onMounted as ue, openBlock as O, provide as k, reactive as de, ref as A, renderList as fe, resolveDynamicComponent as j, shallowRef as M, toDisplayString as N, unref as P, vModelSelect as F, vModelText as I, vShow as L, watch as R, withCtx as z, withDirectives as pe, withKeys as B, withModifiers as me } from "vue";
//#region src/cms/runtime.ts
var V = Symbol("MmCms");
function he() {
	let e = T(V);
	if (!e) throw Error("CMS host adapter is missing");
	return e;
}
function ge(e) {
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
//#region src/cms/views/content/cmsSources.ts
function U() {
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
function W(e, t) {
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
			R(() => r.value.cms_source_type, (e) => {
				e === "platform" && (r.value.cms_tenant_id = ""), n[1].disabled = e === "platform";
			}, {
				immediate: !0,
				flush: "sync"
			}), t && R(() => [r.value.cms_source_type, r.value.cms_tenant_id], () => {
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
var G = /* @__PURE__ */ w({
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
		return (e, t) => (O(), v(P(re), {
			effect: "soft",
			round: "",
			size: "sm",
			type: a.value
		}, {
			default: z(() => [S(N(i.value), 1)]),
			_: 1
		}, 8, ["type"]));
	}
});
//#endregion
//#region src/cms/api/content/news.ts
function K() {
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
		getNewsMetadata: n,
		getNewsList: r,
		getNewsDetail: i,
		saveNews: a,
		deleteNews: o,
		uploadNewsCover: s,
		newsPublishStates: c,
		newsCategoryLabel: l,
		newsError: u
	};
}
//#endregion
//#region src/cms/views/content/news/EnabledToggle.vue?vue&type=script&setup=true&lang.ts
var q = ["aria-checked", "disabled"], J = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "EnabledToggle",
	props: {
		modelValue: { type: Boolean },
		disabled: { type: Boolean }
	},
	emits: ["update:modelValue"],
	setup(e) {
		return (t, n) => (O(), b("button", {
			type: "button",
			role: "switch",
			class: D(["news-toggle", { "is-on": e.modelValue }]),
			"aria-checked": e.modelValue,
			"aria-label": "启用状态",
			disabled: e.disabled,
			onClick: n[0] ||= (n) => t.$emit("update:modelValue", !e.modelValue)
		}, [n[1] ||= x("span", {
			class: "news-toggle__track",
			"aria-hidden": "true"
		}, [x("span")], -1), x("span", null, N(e.modelValue ? "已启用" : "已停用"), 1)], 10, q));
	}
}), [["__scopeId", "data-v-8b527db1"]]), Y = { class: "news-categories" }, X = ["aria-busy"], _e = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, ve = { class: "taxonomy-editor__field" }, Z = { class: "taxonomy-editor__row" }, ye = "分类", Q = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(n) {
		let { newsError: i, deleteNews: o, getNewsMetadata: c, getNewsList: u, getNewsDetail: d, saveNews: te } = K(), { hasPermission: ne } = he(), { formatDateTime: oe } = he(), p = (e) => ne([`cms_news_category:${e}`]), h = A(), g = A(), w = W(c, (e) => {
			h.value = e;
		}), T = [
			...U(),
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
		], { proTableBindings: ce, reload: D, filters: k } = t({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: [
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
			],
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), a = await u("categories", {
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
		w.bindFilters(k);
		let fe = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), j = de(fe()), M = A(!1), F = A(!1), I = A(!1), L = A(!1), R = A(!1), pe = A(""), B = A(!1), V = A(""), ge = A(!1), H = _(() => !p(j.id ? "edit" : "add")), q = _(() => I.value || L.value), Q = "", be;
		async function $(e) {
			be?.abort(), be = new AbortController();
			let t = be;
			Object.assign(j, fe(), { id: e || "" }), V.value = "", R.value = !1, pe.value = "", B.value = !1, M.value = !0, F.value = !0, Q = JSON.stringify(j);
			try {
				if (g.value = await c(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await d("categories", e, t.signal);
				if (g.value = await c(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(j, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), Q = JSON.stringify(j);
			} catch (e) {
				t.signal.aborted || (B.value = !0, V.value = i(e));
			} finally {
				t.signal.aborted || (F.value = !1);
			}
		}
		function xe() {
			return q.value ? !1 : !F.value && !B.value && JSON.stringify(j) !== Q ? (ge.value = !0, !1) : (be?.abort(), !0);
		}
		function Se() {
			q.value || (be?.abort(), M.value = !1);
		}
		function Ce() {
			ge.value = !1, M.value = !1;
		}
		async function we() {
			if (!(H.value || q.value || F.value || B.value)) {
				if (!j.name.trim() || j.sort_order === null) {
					V.value = "请填写分类名称和排序";
					return;
				}
				I.value = !0, V.value = "";
				try {
					await te("categories", {
						name: j.name,
						parent_id: j.parent_id || null,
						sort_order: j.sort_order,
						is_enabled: j.is_enabled,
						id: j.id || void 0,
						row_version: j.id ? j.row_version : void 0
					}), M.value = !1, ae.success("保存成功"), await Promise.all([D(), ke()]);
				} catch (e) {
					V.value = i(e);
				} finally {
					I.value = !1;
				}
			}
		}
		function Te() {
			!j.id || !p("delete") || q.value || F.value || B.value || (pe.value = "", R.value = !0);
		}
		async function Ee() {
			if (!(!R.value || !j.id || !p("delete") || q.value || F.value || B.value)) {
				L.value = !0, pe.value = "";
				try {
					await o("categories", j.id, j.row_version), R.value = !1, M.value = !1, ae.success("分类已删除"), await Promise.all([D(), ke()]);
				} catch (e) {
					pe.value = i(e);
				} finally {
					L.value = !1;
				}
			}
		}
		let De = _(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(g.value?.categories || []).filter((e) => !e.parent_id && e.id !== j.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Oe = new AbortController();
		async function ke() {
			try {
				h.value = await c(Oe.signal);
			} catch {}
		}
		return ue(ke), le(() => {
			be?.abort(), Oe.abort();
		}), (t, n) => (O(), b("div", Y, [
			C(P(ee), E(P(ce), {
				"auto-refreshable": !1,
				columns: T,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${ye}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": z(({ row: e }) => [C(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": z(() => [p("add") ? (O(), v(P(a), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: n[0] ||= (e) => $()
				}, {
					icon: z(() => [C(P(f), {
						name: "plus",
						size: 14
					})]),
					default: z(() => [S("新增" + N(ye))]),
					_: 1
				})) : y("", !0)]),
				"cell-is_enabled": z(({ row: e }) => [C(P(re), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: z(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": z(({ row: e }) => [C(P(a), {
					size: "sm",
					"icon-only": "",
					title: p("edit") ? `编辑${ye}` : `${ye}详情`,
					"aria-label": `编辑${ye}`,
					onClick: (t) => $(e.id)
				}, {
					default: z(() => [C(P(f), {
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
			C(P(se), {
				modelValue: M.value,
				"onUpdate:modelValue": n[5] ||= (e) => M.value = e,
				title: `${j.id ? "编辑" : "新增"}新闻${ye}`,
				width: "680px",
				subtitle: "新闻分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": xe
			}, {
				footer: z(() => [
					j.id && p("delete") ? (O(), v(P(a), {
						key: 0,
						variant: "danger",
						disabled: F.value || B.value || q.value,
						onClick: Te
					}, {
						icon: z(() => [C(P(f), {
							name: "trash-2",
							size: 14
						})]),
						default: z(() => [n[11] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(a), {
						disabled: q.value,
						onClick: Se
					}, {
						default: z(() => [...n[12] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					H.value ? y("", !0) : (O(), v(P(a), {
						key: 1,
						variant: "primary",
						loading: I.value,
						disabled: F.value || B.value || L.value,
						onClick: we
					}, {
						default: z(() => [S("保存" + N(ye))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: z(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": F.value
				}, [
					F.value ? (O(), b("div", _e, [C(P(f), {
						name: "loader-circle",
						class: "news-spin",
						size: 24
					}), x("span", null, "正在读取" + N(ye) + "...")])) : y("", !0),
					V.value ? (O(), v(P(ie), {
						key: 1,
						type: "error",
						closable: !1,
						description: V.value
					}, null, 8, ["description"])) : y("", !0),
					!F.value && !B.value ? (O(), v(P(e), {
						key: 2,
						model: j,
						"label-position": "top",
						onSubmit: me(we, ["prevent"])
					}, {
						default: z(() => [
							j.id ? (O(), v(P(r), {
								key: 0,
								label: "分类ID"
							}, {
								default: z(() => [C(P(m), {
									"model-value": j.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : y("", !0),
							C(P(r), {
								label: `${ye}名称`,
								required: ""
							}, {
								default: z(() => [C(P(m), {
									modelValue: j.name,
									"onUpdate:modelValue": n[1] ||= (e) => j.name = e,
									maxlength: 120,
									disabled: H.value || q.value,
									"aria-label": `${ye}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							C(P(r), { label: "父分类" }, {
								default: z(() => [x("div", ve, [C(P(s), {
									modelValue: j.parent_id,
									"onUpdate:modelValue": n[2] ||= (e) => j.parent_id = e,
									options: De.value,
									disabled: H.value || q.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), n[10] ||= x("p", { class: "news-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类新闻。 ", -1)])]),
								_: 1
							}),
							x("div", Z, [C(P(r), {
								label: "前端排序",
								required: ""
							}, {
								default: z(() => [C(P(l), {
									modelValue: j.sort_order,
									"onUpdate:modelValue": n[3] ||= (e) => j.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: H.value || q.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(P(r), { label: "启用状态" }, {
								default: z(() => [C(J, {
									modelValue: j.is_enabled,
									"onUpdate:modelValue": n[4] ||= (e) => j.is_enabled = e,
									disabled: H.value || q.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : y("", !0)
				], 8, X)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(P(se), {
				modelValue: R.value,
				"onUpdate:modelValue": n[7] ||= (e) => R.value = e,
				title: "删除新闻分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !L.value
			}, {
				footer: z(() => [C(P(a), {
					disabled: L.value,
					onClick: n[6] ||= (e) => R.value = !1
				}, {
					default: z(() => [...n[13] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(a), {
					variant: "danger",
					loading: L.value,
					onClick: Ee
				}, {
					default: z(() => [...n[14] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: z(() => [x("p", null, "确认删除分类“" + N(j.name) + "”？有关联新闻或子分类的分类无法删除。", 1), pe.value ? (O(), v(P(ie), {
					key: 0,
					type: "error",
					closable: !1,
					description: pe.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(P(se), {
				modelValue: ge.value,
				"onUpdate:modelValue": n[9] ||= (e) => ge.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: z(() => [C(P(a), { onClick: n[8] ||= (e) => ge.value = !1 }, {
					default: z(() => [...n[15] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(a), {
					variant: "primary",
					onClick: Ce
				}, {
					default: z(() => [...n[16] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-30abf45a"]]), be = {
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
function xe(e, t, n, r, i = Date.now()) {
	let a = {}, o = be[n];
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
function Se(e, t) {
	let n = {}, r = [], i = be[t], a = {
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
function Ce(e, t, n, r) {
	let i = A(), a = A(), o = A(null), s = A(Date.now()), c = de({}), l = A(""), u = Object.fromEntries($.map((e) => [e, {
		required: e === "title" || e === "category_id",
		trigger: "submit"
	}])), d = _(() => o.value ? xe(e, t(), n, o.value === "draft" ? "draft" : e.scheduled_local ? "scheduled" : "published", s.value) : {}), ee = _(() => ({
		...c,
		...d.value
	})), te = _(() => Object.keys(ee.value).length);
	for (let t of $) R(() => e[t], () => {
		delete c[t], l.value = "", s.value = Date.now();
	}, { deep: !0 });
	function ne() {
		ee.value.seo_description && a.value?.focus();
	}
	async function re() {
		await ce();
		let e = [...i.value?.querySelectorAll("[data-prop]") || []].find((e) => ee.value[e.dataset.prop]);
		if (!e && ee.value.seo_description) {
			r.value ? ne() : r.value = !0;
			return;
		}
		e && (e.scrollIntoView({
			block: "center",
			behavior: "auto"
		}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
	}
	async function ie(e) {
		o.value = e === "draft" ? "draft" : "publish", s.value = Date.now(), l.value = "";
		for (let e of $) delete c[e];
		return te.value ? (await re(), !1) : !0;
	}
	function ae(e) {
		let t = Se(e, n);
		Object.assign(c, t.fields), l.value = t.general;
	}
	return {
		editorRoot: i,
		seoInput: a,
		fieldRules: u,
		fieldErrors: ee,
		pendingCount: te,
		saveError: l,
		validateSave: ie,
		setSaveFailure: ae,
		focusFirstError: re,
		focusSeoError: ne
	};
}
//#endregion
//#region src/cms/views/content/components/CoverFileItem.vue?vue&type=script&setup=true&lang.ts
var we = {
	class: "file-list",
	"aria-label": "封面文件"
}, Te = { class: "file-item" }, Ee = { class: "file-icon" }, De = ["src"], Oe = [
	"href",
	"download",
	"title",
	"aria-busy",
	"aria-disabled"
], ke = { class: "file-size" }, Ae = ["disabled"], je = {
	key: 0,
	class: "file-error",
	role: "alert"
}, Me = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "CoverFileItem",
	props: {
		url: {},
		file: {},
		disabled: { type: Boolean }
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = A(null), a = A(!1), o = A(!1), s = A(""), c, l = _(() => {
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
		R(() => [n.url, n.file], async (e, t, r) => {
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
		return le(() => {
			c?.abort(), c = void 0;
		}), (t, n) => (O(), b("div", we, [x("div", Te, [
			x("span", Ee, [a.value ? (O(), v(P(f), {
				key: 1,
				name: "image",
				size: 20
			})) : (O(), b("img", {
				key: 0,
				src: e.url,
				alt: "封面缩略图",
				onError: n[0] ||= (e) => a.value = !0
			}, null, 40, De))]),
			x("a", {
				class: "file-name",
				href: l.value || void 0,
				download: u.value,
				title: u.value,
				"aria-busy": o.value,
				"aria-disabled": o.value || !l.value,
				onClick: me(ee, ["prevent", "stop"])
			}, N(u.value), 9, Oe),
			x("span", ke, N(d.value), 1),
			x("button", {
				class: "file-remove",
				type: "button",
				"aria-label": "移除封面",
				title: "移除封面",
				disabled: e.disabled,
				onClick: n[1] ||= me((e) => r("remove"), ["stop"])
			}, [C(P(f), {
				name: "close",
				size: 14
			})], 8, Ae)
		]), s.value ? (O(), b("span", je, N(s.value), 1)) : y("", !0)]));
	}
}), [["__scopeId", "data-v-389015f1"]]), Ne = { class: "content-cover" }, Pe = { class: "content-cover__preview" }, Fe = ["src", "alt"], Ie = {
	key: 1,
	class: "content-cover__empty"
}, Le = {
	key: 2,
	class: "content-cover__hint"
}, Re = {
	key: 0,
	class: "content-cover__error",
	role: "status"
}, ze = /*#__PURE__*/ h(/* @__PURE__ */ w({
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
		"busy-change",
		"start",
		"success",
		"error"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = A(), a = M(), o = A(!1), s = A(!1), c;
		R(() => n.modelValue, (e) => {
			s.value = !1, a.value?.url !== e && (a.value = void 0);
		});
		async function l({ file: e, signal: t }) {
			c = void 0, o.value = !0, r("busy-change", !0), r("start");
			try {
				let i = await n.upload(e, t);
				return t.aborted || (a.value = {
					url: i.url,
					file: e
				}, s.value = !1, r("update:modelValue", i.url)), i;
			} catch (e) {
				throw t.aborted || (c = { error: e }), e;
			} finally {
				o.value = !1, r("busy-change", !1);
			}
		}
		function d() {
			ce(() => i.value?.clearFiles());
		}
		function ee() {
			r("success"), d();
		}
		function te(e, t) {
			r("error", c ? c.error : t), c = void 0, d();
		}
		function ne() {
			n.disabled || o.value || (a.value = void 0, s.value = !1, r("update:modelValue", ""));
		}
		return (t, n) => (O(), b("div", Ne, [
			C(P(u), {
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
				default: z(() => [x("div", Pe, [e.modelValue ? (O(), b("img", {
					key: 0,
					src: e.modelValue,
					alt: e.label,
					draggable: "false",
					onError: n[0] ||= (e) => s.value = !0,
					onLoad: n[1] ||= (e) => s.value = !1
				}, null, 40, Fe)) : (O(), b("div", Ie, [C(P(f), {
					name: "image",
					size: 28
				})])), e.modelValue ? y("", !0) : (O(), b("span", Le, [S(N(o.value ? "正在上传…" : "拖动图片到此处，或点击上传") + " ", 1), n[3] ||= x("span", { class: "content-cover__types" }, "JPG / PNG / WebP，最大 5 MB", -1)]))])]),
				_: 1
			}, 8, ["disabled"]),
			s.value ? (O(), b("span", Re, " 封面无法加载，请重新上传 ")) : y("", !0),
			e.modelValue ? (O(), v(Me, {
				key: 1,
				url: e.modelValue,
				file: a.value?.url === e.modelValue ? a.value.file : void 0,
				disabled: e.disabled || o.value,
				onRemove: ne
			}, null, 8, [
				"url",
				"file",
				"disabled"
			])) : y("", !0)
		]));
	}
}), [["__scopeId", "data-v-8f5070ba"]]), Be = ["aria-busy"], Ve = { class: "article-editor__header" }, He = { class: "article-editor__heading" }, Ue = { class: "article-editor__commands" }, We = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, Ge = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Ke = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, qe = {
	key: 1,
	class: "article-editor__failure"
}, Je = {
	key: 0,
	class: "article-editor__error"
}, Ye = { class: "article-editor__body" }, Xe = { class: "article-editor__settings" }, Ze = { class: "article-editor__content" }, Qe = ["aria-invalid", "disabled"], $e = ["aria-invalid", "disabled"], et = {
	class: "news-delete-dialog__icon",
	"aria-hidden": "true"
}, tt = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: n }) {
		let { newsError: i, newsCategoryLabel: o, deleteNews: c, getNewsDetail: u, getNewsMetadata: d, saveNews: ee, uploadNewsCover: te } = K(), { hasPermission: re } = he(), oe = t, p = n, h = A(!0), w = A(!1), T = A(!1), E = A(""), ce = A(!1), D = A(!1), k = A(!1), fe = A(!1), j = A(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), M = A(), F = A("draft"), L = A(!1), R = _(() => re(["cms_news:publish"])), B = _(() => !re([`cms_news:${oe.articleId ? "edit" : "add"}`]) || !R.value && F.value !== "draft"), V = _(() => re(["cms_news:delete"]) && (R.value || F.value === "draft"));
		async function H() {
			if (!(!V.value || w.value || h.value || T.value)) {
				w.value = !0, E.value = "";
				try {
					await c("articles", W.id, W.row_version), xe = JSON.stringify(W), ae.success("新闻已删除"), p("saved");
				} catch (e) {
					E.value = i(e), fe.value = !1;
				} finally {
					w.value = !1;
				}
			}
		}
		let U = _(() => B.value || w.value), W = de({
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
		}), { editorRoot: G, seoInput: q, fieldRules: Y, fieldErrors: X, pendingCount: _e, saveError: ve, validateSave: Z, setSaveFailure: ye, focusFirstError: Q, focusSeoError: be } = Ce(W, () => M.value?.categories || [], "news", ce), $ = _(() => (M.value?.categories || []).map((e) => ({
			label: o(M.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), xe = "", Se;
		function we(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Te() {
			Se?.abort(), Se = new AbortController();
			let e = Se;
			h.value = !0, T.value = !1, E.value = "";
			try {
				if (M.value = await d(e.signal, { cms_source_type: "platform" }), oe.articleId) {
					let t = await u("articles", oe.articleId, e.signal);
					if (M.value = await d(e.signal, { space_id: String(t.space_id) }), j.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					W.scheduled_local = t.publish_status === "scheduled" ? we(t.scheduled_at) : "", F.value = t.publish_status;
				}
				xe = JSON.stringify(W);
			} catch (t) {
				e.signal.aborted || (E.value = i(t), T.value = !0);
			} finally {
				e.signal.aborted || (h.value = !1);
			}
		}
		let Ee = () => !h.value && !T.value && xe !== JSON.stringify(W);
		function De() {
			Ee() ? D.value = !0 : p("close");
		}
		function Oe() {
			F.value === "draft" ? Ae("draft") : k.value = !0;
		}
		function ke() {
			k.value = !1, Ae("draft");
		}
		async function Ae(e) {
			if (U.value || h.value || T.value || L.value || (E.value = "", !await Z(e))) return;
			let t = W.scheduled_local ? new Date(W.scheduled_local) : null;
			w.value = !0, E.value = "";
			try {
				await ee("articles", {
					...W,
					id: W.id || void 0,
					row_version: W.id ? W.row_version : void 0,
					category_id: W.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), xe = JSON.stringify(W), ae.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "新闻已发布"), p("saved");
			} catch (e) {
				ye(e);
			} finally {
				w.value = !1;
			}
			_e.value && await Q();
		}
		function je(e) {
			E.value = i(e);
		}
		let Me = (e) => {
			Ee() && (e.preventDefault(), e.returnValue = "");
		};
		return ge(() => !w.value && !L.value && (!Ee() || window.confirm("新闻有未保存的修改，确定离开？"))), ue(() => {
			Te(), window.addEventListener("beforeunload", Me);
		}), le(() => {
			Se?.abort(), window.removeEventListener("beforeunload", Me);
		}), (n, i) => (O(), b("section", {
			ref_key: "editorRoot",
			ref: G,
			class: "article-editor",
			"aria-busy": h.value || w.value
		}, [
			x("header", Ve, [
				C(P(a), {
					"icon-only": "",
					title: "返回新闻列表",
					"aria-label": "返回新闻列表",
					disabled: w.value || L.value,
					onClick: De
				}, {
					default: z(() => [C(P(f), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", He, [x("h2", null, N(t.articleId ? "编辑新闻" : "新增新闻"), 1), x("span", null, N(M.value?.source_locale || "zh-CN") + " · " + N(j.value), 1)]),
				x("div", Ue, [
					t.articleId && V.value ? (O(), v(P(a), {
						key: 0,
						size: "sm",
						disabled: h.value || T.value || w.value || L.value,
						onClick: i[0] ||= (e) => fe.value = !0
					}, {
						default: z(() => [...i[28] ||= [S("删除新闻", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(a), {
						size: "sm",
						disabled: h.value || T.value,
						onClick: i[1] ||= (e) => ce.value = !0
					}, {
						icon: z(() => [C(P(f), {
							name: "search",
							size: 14
						})]),
						default: z(() => [i[29] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					B.value ? y("", !0) : (O(), v(P(a), {
						key: 1,
						size: "sm",
						disabled: h.value || T.value || w.value || L.value,
						onClick: Oe
					}, {
						icon: z(() => [C(P(f), {
							name: "save",
							size: 14
						})]),
						default: z(() => [i[30] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					P(ve) ? (O(), b("span", We, N(P(ve)), 1)) : y("", !0),
					!B.value && P(_e) ? (O(), b("span", Ge, "还有 " + N(P(_e)) + " 项待完善", 1)) : y("", !0),
					!B.value && R.value ? (O(), v(P(a), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: h.value || T.value || L.value,
						loading: w.value,
						onClick: i[2] ||= (e) => Ae(W.scheduled_local ? "scheduled" : "published")
					}, {
						icon: z(() => [C(P(f), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: z(() => [S(N(W.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)
				])
			]),
			h.value ? (O(), b("div", Ke, [C(P(f), {
				name: "loader-circle",
				class: "news-spin",
				size: 28
			}), i[31] ||= x("span", null, "正在读取新闻资料...", -1)])) : T.value ? (O(), b("div", qe, [C(P(ie), {
				type: "error",
				description: E.value,
				closable: !1
			}, null, 8, ["description"]), C(P(a), { onClick: Te }, {
				default: z(() => [...i[32] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (O(), b(g, { key: 2 }, [E.value ? (O(), b("div", Je, [C(P(ie), {
				type: "error",
				description: E.value,
				closable: !1
			}, null, 8, ["description"])])) : y("", !0), x("div", Ye, [x("aside", Xe, [C(P(e), {
				model: W,
				rules: P(Y),
				"label-position": "top",
				onSubmit: i[12] ||= me(() => {}, ["prevent"])
			}, {
				default: z(() => [
					C(P(r), {
						label: "新闻分类",
						prop: "category_id",
						error: P(X).category_id,
						required: ""
					}, {
						default: z(() => [C(P(s), {
							modelValue: W.category_id,
							"onUpdate:modelValue": i[3] ||= (e) => W.category_id = e,
							options: $.value,
							clearable: "",
							disabled: U.value,
							"aria-label": "新闻分类"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					i[33] ||= x("h3", null, "新闻设置", -1),
					C(P(r), {
						label: "新闻封面",
						prop: "cover_url",
						error: P(X).cover_url
					}, {
						default: z(() => [C(ze, {
							modelValue: W.cover_url,
							"onUpdate:modelValue": i[4] ||= (e) => W.cover_url = e,
							label: "新闻封面",
							disabled: U.value,
							upload: P(te),
							onBusyChange: i[5] ||= (e) => L.value = e,
							onStart: i[6] ||= (e) => E.value = "",
							onError: je
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "内容来源",
						prop: "content_source",
						error: P(X).content_source
					}, {
						default: z(() => [C(P(m), {
							modelValue: W.content_source,
							"onUpdate:modelValue": i[7] ||= (e) => W.content_source = e,
							maxlength: 160,
							disabled: U.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "作者署名",
						prop: "author_name",
						error: P(X).author_name
					}, {
						default: z(() => [C(P(m), {
							modelValue: W.author_name,
							"onUpdate:modelValue": i[8] ||= (e) => W.author_name = e,
							maxlength: 120,
							disabled: U.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "前端排序",
						prop: "sort_order",
						error: P(X).sort_order
					}, {
						default: z(() => [C(P(l), {
							modelValue: W.sort_order,
							"onUpdate:modelValue": i[9] ||= (e) => W.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: U.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[34] ||= x("h3", null, "发布设置", -1),
					C(P(r), {
						label: "启用状态",
						prop: "is_enabled",
						error: P(X).is_enabled
					}, {
						default: z(() => [C(J, {
							modelValue: W.is_enabled,
							"onUpdate:modelValue": i[10] ||= (e) => W.is_enabled = e,
							disabled: U.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: P(X).scheduled_local
					}, {
						default: z(() => [C(P(m), {
							modelValue: W.scheduled_local,
							"onUpdate:modelValue": i[11] ||= (e) => W.scheduled_local = e,
							type: "datetime-local",
							disabled: U.value || !R.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[35] ||= x("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", Ze, [C(P(e), {
				model: W,
				rules: P(Y),
				"label-position": "top",
				onSubmit: i[16] ||= me(() => {}, ["prevent"])
			}, {
				default: z(() => [
					C(P(r), {
						label: "标题",
						prop: "title",
						error: P(X).title,
						required: ""
					}, {
						default: z(() => [C(P(m), {
							modelValue: W.title,
							"onUpdate:modelValue": i[13] ||= (e) => W.title = e,
							maxlength: 255,
							disabled: U.value,
							placeholder: "输入新闻标题",
							"aria-label": "新闻标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "摘要",
						prop: "summary",
						error: P(X).summary
					}, {
						default: z(() => [pe(x("textarea", {
							"onUpdate:modelValue": i[14] ||= (e) => W.summary = e,
							"aria-invalid": !!P(X).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: U.value,
							"aria-label": "新闻摘要"
						}, null, 8, Qe), [[I, W.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "正文",
						prop: "body_html",
						error: P(X).body_html
					}, {
						default: z(() => [C(P(ne), {
							modelValue: W.body_html,
							"onUpdate:modelValue": i[15] ||= (e) => W.body_html = e,
							readonly: B.value,
							disabled: w.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "新闻正文"
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
			C(P(se), {
				modelValue: ce.value,
				"onUpdate:modelValue": i[20] ||= (e) => ce.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: z(() => [C(P(a), {
					variant: "primary",
					onClick: i[19] ||= (e) => ce.value = !1
				}, {
					default: z(() => [...i[36] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: z(() => [C(P(e), {
					model: W,
					rules: P(Y),
					"label-position": "top",
					onSubmit: i[18] ||= me(() => {}, ["prevent"])
				}, {
					default: z(() => [C(P(r), {
						label: "SEO 描述",
						prop: "seo_description",
						error: P(X).seo_description
					}, {
						default: z(() => [pe(x("textarea", {
							ref_key: "seoInput",
							ref: q,
							"onUpdate:modelValue": i[17] ||= (e) => W.seo_description = e,
							"aria-invalid": !!P(X).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: U.value,
							"aria-label": "SEO 描述"
						}, null, 8, $e), [[I, W.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(se), {
				modelValue: fe.value,
				"onUpdate:modelValue": i[22] ||= (e) => fe.value = e,
				title: "确认删除",
				subtitle: `操作对象：${W.title || "未命名新闻"}`,
				width: "460px",
				"panel-class": "news-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !w.value
			}, {
				"header-actions": z(() => [x("span", et, [C(P(f), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: z(() => [C(P(a), {
					disabled: w.value,
					onClick: i[21] ||= (e) => fe.value = !1
				}, {
					default: z(() => [...i[37] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(a), {
					variant: "warning",
					loading: w.value,
					onClick: H
				}, {
					default: z(() => [...i[38] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: z(() => [C(P(ie), {
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
			C(P(se), {
				modelValue: D.value,
				"onUpdate:modelValue": i[25] ||= (e) => D.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: z(() => [C(P(a), { onClick: i[23] ||= (e) => D.value = !1 }, {
					default: z(() => [...i[39] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(a), {
					variant: "primary",
					onClick: i[24] ||= (e) => p("close")
				}, {
					default: z(() => [...i[40] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(se), {
				modelValue: k.value,
				"onUpdate:modelValue": i[27] ||= (e) => k.value = e,
				title: "将新闻转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: z(() => [C(P(a), { onClick: i[26] ||= (e) => k.value = !1 }, {
					default: z(() => [...i[41] ||= [S("取消", -1)]]),
					_: 1
				}), C(P(a), {
					variant: "primary",
					onClick: ke
				}, {
					default: z(() => [...i[42] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Be));
	}
}), [["__scopeId", "data-v-9ad8501f"]]), nt = { class: "news-articles" }, rt = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { newsPublishStates: n, newsCategoryLabel: r, getNewsList: i, getNewsMetadata: o } = K(), { hasPermission: s } = he(), { formatDateTime: c } = he(), l = A(!1), u = A(), d = (e) => s([`cms_news:${e}`]), te = A(), ne = W(o, (e) => {
			te.value = e;
		}), ie = [
			...U(),
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
				formatter: (e) => r(te.value, e)
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
		], { proTableBindings: ae, reload: oe, filters: se } = t({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: _(() => [
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
					}, ...(te.value?.categories || []).map((e) => ({
						label: r(te.value, e.id),
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
			]),
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
		});
		ne.bindFilters(se);
		let p = new AbortController();
		async function m() {
			try {
				te.value = await o(p.signal);
			} catch {}
		}
		function h(e) {
			u.value = e, l.value = !0;
		}
		function g() {
			l.value = !1, oe(), m();
		}
		return ue(m), le(() => p.abort()), (e, t) => (O(), b("div", nt, [l.value ? (O(), v(tt, {
			key: 0,
			"article-id": u.value,
			onClose: t[0] ||= (e) => l.value = !1,
			onSaved: g
		}, null, 8, ["article-id"])) : y("", !0), pe(C(P(ee), E(P(ae), {
			"auto-refreshable": !1,
			columns: ie,
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
			"cell-cms_source_type": z(({ row: e }) => [C(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": z(() => [d("add") ? (O(), v(P(a), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => h()
			}, {
				icon: z(() => [C(P(f), {
					name: "plus",
					size: 14
				})]),
				default: z(() => [t[2] ||= S("新增新闻", -1)]),
				_: 1
			})) : y("", !0)]),
			"cell-publish_status": z(({ row: e }) => [C(P(re), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: z(() => [S(N(P(n).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": z(({ row: e }) => [C(P(re), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: z(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": z(({ row: e }) => [S(N(P(c)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": z(({ row: e }) => [C(P(a), {
				size: "sm",
				"icon-only": "",
				title: d("edit") ? "编辑新闻" : "新闻详情",
				"aria-label": d("edit") ? "编辑新闻" : "新闻详情",
				onClick: (t) => h(e.id)
			}, {
				default: z(() => [C(P(f), {
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
		}, 16), [[L, !l.value]])]));
	}
}), [["__scopeId", "data-v-aef51e21"]]);
//#endregion
//#region src/cms/api/content/academy.ts
function it() {
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
var at = ["aria-busy"], ot = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, st = { class: "taxonomy-editor__row" }, ct = "分类", lt = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "CategoryTable",
	setup(n) {
		let { hasPermission: i } = he(), { formatDateTime: c } = he(), { academyDifficulties: u, academyError: d, getAcademyList: te, getAcademyMetadata: ne, getAcademyDetail: oe, saveAcademy: p, deleteAcademyCategory: h } = it(), w = (e) => i([`cms_academy_category:${e}`]), T = W(ne), ce = [
			...U(),
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
				formatter: (e) => (e || []).map((e) => u.find((t) => t.value === e)?.label).join(" / ")
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
		], { proTableBindings: D, reload: ue, currentPage: k, pageSize: fe, total: j, filters: M } = t({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: [
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
					}, ...u]
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
				let i = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), a = await te("categories", {
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
		T.bindFilters(M);
		let F = () => ({
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
		}), I = de(F()), L = A(!1), R = A(!1), pe = A(!1), B = A(!1), V = A(!1), ge = A(""), H = A(!1), K = A(""), q = A(!1), J = _(() => !w(I.id ? "edit" : "add")), Y = _(() => pe.value || B.value), X = "", _e;
		async function ve(e) {
			_e?.abort(), _e = new AbortController();
			let t = _e;
			if (Object.assign(I, F(), { id: e || "" }), K.value = "", V.value = !1, ge.value = "", H.value = !1, L.value = !0, R.value = !!e, X = JSON.stringify(I), e) try {
				let n = await oe("categories", e, t.signal);
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
				}), X = JSON.stringify(I);
			} catch (e) {
				t.signal.aborted || (H.value = !0, K.value = d(e));
			} finally {
				t.signal.aborted || (R.value = !1);
			}
		}
		function Z() {
			return Y.value ? !1 : !R.value && !H.value && JSON.stringify(I) !== X ? (q.value = !0, !1) : (_e?.abort(), !0);
		}
		function ye() {
			Y.value || (_e?.abort(), L.value = !1);
		}
		function Q() {
			q.value = !1, L.value = !1;
		}
		async function be() {
			if (!(J.value || Y.value || R.value || H.value)) {
				if (!I.name.trim() || I.sort_order === null || !I.difficulty_levels.length) {
					K.value = "请填写名称、排序和适用难度";
					return;
				}
				pe.value = !0, K.value = "";
				try {
					await p("categories", {
						...I,
						id: I.id || void 0,
						row_version: I.id ? I.row_version : void 0
					}), L.value = !1, ae.success("保存成功"), await ue();
				} catch (e) {
					K.value = d(e);
				} finally {
					pe.value = !1;
				}
			}
		}
		function $() {
			!I.id || !w("delete") || Y.value || R.value || H.value || (ge.value = "", V.value = !0);
		}
		async function xe() {
			if (!(!V.value || !I.id || !w("delete") || Y.value || R.value || H.value)) {
				B.value = !0, ge.value = "";
				try {
					await h({
						id: I.id,
						row_version: I.row_version
					}), V.value = !1, L.value = !1, ae.success("分类已删除"), await ue(), k.value = Math.min(k.value, Math.max(1, Math.ceil(j.value / fe.value)));
				} catch (e) {
					ge.value = d(e);
				} finally {
					B.value = !1;
				}
			}
		}
		return le(() => _e?.abort()), (t, n) => (O(), b(g, null, [
			C(P(ee), E(P(D), {
				"auto-refreshable": !1,
				columns: ce,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${ct}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": z(({ row: e }) => [C(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": z(() => [w("add") ? (O(), v(P(a), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: n[0] ||= (e) => ve()
				}, {
					icon: z(() => [C(P(f), {
						name: "plus",
						size: 14
					})]),
					default: z(() => [S("新增" + N(ct))]),
					_: 1
				})) : y("", !0)]),
				"cell-is_enabled": z(({ row: e }) => [C(P(re), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: z(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": z(({ row: e }) => [C(P(a), {
					size: "sm",
					"icon-only": "",
					title: w("edit") ? `编辑${ct}` : `${ct}详情`,
					"aria-label": `编辑${ct}`,
					onClick: (t) => ve(e.id)
				}, {
					default: z(() => [C(P(f), {
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
			C(P(se), {
				modelValue: L.value,
				"onUpdate:modelValue": n[5] ||= (e) => L.value = e,
				title: `${I.id ? "编辑" : "新增"}课程${ct}`,
				width: "620px",
				"close-on-click-modal": !1,
				"before-close": Z
			}, {
				footer: z(() => [
					I.id && w("delete") ? (O(), v(P(a), {
						key: 0,
						variant: "danger",
						disabled: R.value || H.value || Y.value,
						onClick: $
					}, {
						icon: z(() => [C(P(f), {
							name: "trash-2",
							size: 14
						})]),
						default: z(() => [n[10] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(a), {
						disabled: Y.value,
						onClick: ye
					}, {
						default: z(() => [...n[11] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					J.value ? y("", !0) : (O(), v(P(a), {
						key: 1,
						variant: "primary",
						loading: pe.value,
						disabled: R.value || H.value || B.value,
						onClick: be
					}, {
						default: z(() => [S("保存" + N(ct))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: z(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": R.value
				}, [
					R.value ? (O(), b("div", ot, [C(P(f), {
						name: "loader-circle",
						class: "academy-spin",
						size: 24
					}), x("span", null, "正在读取" + N(ct) + "...")])) : y("", !0),
					K.value ? (O(), v(P(ie), {
						key: 1,
						type: "error",
						closable: !1,
						description: K.value
					}, null, 8, ["description"])) : y("", !0),
					!R.value && !H.value ? (O(), v(P(e), {
						key: 2,
						model: I,
						"label-position": "top",
						onSubmit: me(be, ["prevent"])
					}, {
						default: z(() => [
							C(P(r), {
								label: `${ct}名称`,
								required: ""
							}, {
								default: z(() => [C(P(m), {
									modelValue: I.name,
									"onUpdate:modelValue": n[1] ||= (e) => I.name = e,
									maxlength: 120,
									disabled: J.value || Y.value,
									"aria-label": `${ct}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							C(P(r), {
								label: "适用难度",
								required: ""
							}, {
								default: z(() => [C(P(s), {
									modelValue: I.difficulty_levels,
									"onUpdate:modelValue": n[2] ||= (e) => I.difficulty_levels = e,
									multiple: "",
									options: P(u),
									disabled: J.value || Y.value,
									"aria-label": "适用难度"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								])]),
								_: 1
							}),
							x("div", st, [C(P(r), {
								label: "前端排序",
								required: ""
							}, {
								default: z(() => [C(P(l), {
									modelValue: I.sort_order,
									"onUpdate:modelValue": n[3] ||= (e) => I.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: J.value || Y.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(P(r), { label: "启用状态" }, {
								default: z(() => [C(P(o), {
									modelValue: I.is_enabled,
									"onUpdate:modelValue": n[4] ||= (e) => I.is_enabled = e,
									disabled: J.value || Y.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : y("", !0)
				], 8, at)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(P(se), {
				modelValue: V.value,
				"onUpdate:modelValue": n[7] ||= (e) => V.value = e,
				title: "删除课程分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !B.value
			}, {
				footer: z(() => [C(P(a), {
					disabled: B.value,
					onClick: n[6] ||= (e) => V.value = !1
				}, {
					default: z(() => [...n[12] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(a), {
					variant: "danger",
					loading: B.value,
					onClick: xe
				}, {
					default: z(() => [...n[13] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: z(() => [x("p", null, "确认删除分类“" + N(I.name) + "”？有关联课程的分类无法删除。", 1), ge.value ? (O(), v(P(ie), {
					key: 0,
					type: "error",
					closable: !1,
					description: ge.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(P(se), {
				modelValue: q.value,
				"onUpdate:modelValue": n[9] ||= (e) => q.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: z(() => [C(P(a), { onClick: n[8] ||= (e) => q.value = !1 }, {
					default: z(() => [...n[14] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(a), {
					variant: "primary",
					onClick: Q
				}, {
					default: z(() => [...n[15] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 64));
	}
}), [["__scopeId", "data-v-b7830575"]]), ut = { class: "academy-categories" }, dt = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		return (e, t) => (O(), b("div", ut, [C(lt)]));
	}
}), [["__scopeId", "data-v-8f5e5114"]]), ft = [
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
function pt(e) {
	if (/[\x00-\x20\\]/.test(e)) return !1;
	if (e.startsWith("/") && !e.startsWith("//")) return !0;
	try {
		let t = new URL(e);
		return /^https?:\/\//i.test(e) && ["http:", "https:"].includes(t.protocol);
	} catch {
		return !1;
	}
}
function mt(e) {
	return e.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "").replace(/&nbsp;|&#0*(?:160|9|10|13|32);|&#x0*(?:a0|9|a|d|20);/gi, " ").trim().length > 0;
}
function ht(e, t, n, r = Date.now()) {
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
	(e.sort_order === null || !Number.isInteger(e.sort_order) || e.sort_order < 0 || e.sort_order > 2147483647) && (i.sort_order = "请填写 0–2147483647 之间的整数"), e.cover_url && !pt(e.cover_url) && (i.cover_url = "封面地址必须为 HTTP(S) 或站内绝对路径");
	let o = e.category_ids.map((e) => t.find((t) => t.id === e));
	if (a && !o.length ? i.category_ids = "请选择课程分类" : o.some((e) => !e) ? i.category_ids = "所选分类已不可用，请重新选择" : a && o.some((e) => !e?.is_enabled) ? i.category_ids = "发布课程必须选择已启用的分类" : o.length > 50 && (i.category_ids = "最多选择 50 个课程分类"), a && !e.difficulty_level ? i.difficulty_level = "请选择课程难度" : e.difficulty_level !== "" && ![
		1,
		2,
		3
	].includes(e.difficulty_level) ? i.difficulty_level = "请选择有效的课程难度" : e.difficulty_level && o.some((t) => t && !t.difficulty_levels.includes(Number(e.difficulty_level))) && (i.difficulty_level = "课程难度不在所选分类的适用范围内"), a && e.estimated_minutes === null ? i.estimated_minutes = "请填写预计课时" : e.estimated_minutes !== null && (!Number.isInteger(e.estimated_minutes) || e.estimated_minutes < 1 || e.estimated_minutes > 1e5) && (i.estimated_minutes = "预计课时须为 1–100000 之间的整数"), a && !mt(e.body_html) && (i.body_html = "请填写课程正文"), n === "scheduled") {
		let t = new Date(e.scheduled_local).getTime();
		(!Number.isFinite(t) || t <= r) && (i.scheduled_local = "计划发布时间必须晚于当前时间");
	}
	return i;
}
var gt = {
	课程标题不能为空: "title",
	"封面地址必须为 HTTP(S) 或站内绝对路径": "cover_url",
	计划发布时间必须晚于当前时间: "scheduled_local",
	发布课程必须选择分类: "category_ids",
	所选分类不存在或不属于当前学院模板: "category_ids",
	"发布课程必须选择已启用的分类，存在已停用分类": "category_ids",
	课程难度不在所选分类的适用范围内: "difficulty_level",
	"发布课程需要填写正文、课程难度及预计课时": "body_html"
};
function _t(e) {
	let t = {}, n = [], r = e && typeof e == "object" ? e : {};
	for (let [e, i] of Object.entries(r.errors || {})) {
		let r = e.split(".")[0], a = r === "scheduled_at" ? "scheduled_local" : r;
		for (let r of Array.isArray(i) ? i : [i]) {
			if (typeof r != "string" || !r) continue;
			let i = ft.includes(a) ? a : e === "academy" ? gt[r] : void 0;
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
var vt = ["aria-busy"], yt = { class: "course-editor__header" }, bt = { class: "course-editor__heading" }, xt = { class: "course-editor__commands" }, St = {
	key: 2,
	class: "course-editor__save-error",
	role: "alert"
}, Ct = {
	key: 3,
	class: "course-editor__publish-actions"
}, wt = {
	key: 0,
	class: "course-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Tt = {
	key: 0,
	class: "course-editor__loading",
	role: "status"
}, Et = {
	key: 1,
	class: "course-editor__failure"
}, Dt = {
	key: 2,
	class: "course-editor__body"
}, Ot = { class: "course-editor__settings" }, kt = { class: "course-editor__content" }, At = ["disabled", "aria-invalid"], jt = ["disabled", "aria-invalid"], Mt = {
	class: "course-delete-dialog__icon",
	"aria-hidden": "true"
}, Nt = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "CourseEditor",
	props: { courseId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: n }) {
		let { hasPermission: i } = he(), { academyDifficulties: c, academyError: u, deleteAcademyCourse: d, getAcademyDetail: ee, getAcademyMetadata: te, saveAcademy: re, uploadAcademyCover: oe } = it(), p = t, h = n, g = A(!0), w = A(!1), T = A(!1), E = A(""), D = A(!1), k = A(!1), fe = A(!1), j = A(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), M = A(), F = A("draft"), L = A(!1), B = A(!1), V = A(""), H = _(() => i(["cms_academy:publish"])), U = _(() => !!p.courseId && i(["cms_academy:delete"]) && (H.value || F.value === "draft")), W = _(() => !i([`cms_academy:${p.courseId ? "edit" : "add"}`]) || !H.value && F.value !== "draft"), G = _(() => W.value || w.value), K = de({
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
		}), q = A(), J = A(), Y = A(null), X = A(Date.now()), _e = de({}), ve = A(""), Z = Object.fromEntries(ft.map((e) => [e, {
			required: e === "title" || e === "category_ids",
			trigger: "submit"
		}])), ye = _(() => Y.value ? ht(K, M.value?.categories || [], Y.value === "draft" ? "draft" : K.scheduled_local ? "scheduled" : "published", X.value) : {}), Q = _(() => ({
			..._e,
			...ye.value
		})), be = _(() => Object.keys(Q.value).length);
		for (let e of ft) R(() => K[e], () => {
			delete _e[e], e === "category_ids" && delete _e.difficulty_level, ve.value = "", X.value = Date.now();
		}, { deep: !0 });
		function $() {
			Q.value.seo_description && J.value?.focus();
		}
		async function xe() {
			await ce();
			let e = [...q.value?.querySelectorAll("[data-prop]") || []].find((e) => Q.value[e.dataset.prop]);
			if (!e && Q.value.seo_description) {
				D.value ? $() : D.value = !0;
				return;
			}
			e && (e.scrollIntoView({
				block: "center",
				behavior: "auto"
			}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
		}
		let Se = _(() => (M.value?.categories || []).map((e) => ({
			label: e.name + (e.is_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.is_enabled
		}))), Ce = _(() => {
			let e = (M.value?.categories || []).filter((e) => K.category_ids.includes(e.id));
			return c.map((t) => ({
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
			g.value = !0, T.value = !1, E.value = "";
			try {
				if (M.value = await te(e.signal, { cms_source_type: "platform" }), p.courseId) {
					let t = await ee("courses", p.courseId, e.signal);
					if (M.value = await te(e.signal, { space_id: String(t.space_id) }), j.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"category_ids",
						"estimated_minutes",
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
					K.scheduled_local = t.publish_status === "scheduled" ? Ee(t.scheduled_at) : "", F.value = t.publish_status;
				}
				we = JSON.stringify(K);
			} catch (t) {
				e.signal.aborted || (E.value = u(t), T.value = !0);
			} finally {
				e.signal.aborted || (g.value = !1);
			}
		}
		let Oe = () => !g.value && !T.value && we !== JSON.stringify(K);
		function ke() {
			Oe() ? k.value = !0 : h("close");
		}
		function Ae() {
			F.value === "draft" ? Me("draft") : fe.value = !0;
		}
		function je() {
			fe.value = !1, Me("draft");
		}
		async function Me(e) {
			if (G.value || g.value || T.value || L.value) return;
			Y.value = e === "draft" ? "draft" : "publish", X.value = Date.now(), ve.value = "";
			for (let e of ft) delete _e[e];
			if (be.value) {
				await xe();
				return;
			}
			let t = K.scheduled_local ? new Date(K.scheduled_local) : null;
			w.value = !0, E.value = "";
			try {
				await re("courses", {
					...K,
					id: K.id || void 0,
					row_version: K.id ? K.row_version : void 0,
					difficulty_level: K.difficulty_level || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), we = JSON.stringify(K), ae.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "课程已发布"), h("saved");
			} catch (e) {
				let t = _t(e);
				Object.assign(_e, t.fields), ve.value = t.general;
			} finally {
				w.value = !1;
			}
			be.value && await xe();
		}
		function Ne() {
			V.value = "", B.value = !0;
		}
		async function Pe() {
			if (!(!U.value || g.value || T.value || w.value || L.value)) {
				w.value = !0, V.value = "";
				try {
					await d({
						id: K.id,
						row_version: K.row_version
					}), we = JSON.stringify(K), B.value = !1, ae.success("课程已删除"), h("saved");
				} catch (e) {
					V.value = u(e);
				} finally {
					w.value = !1;
				}
			}
		}
		function Fe(e) {
			_e.cover_url = u(e);
		}
		function Ie() {
			delete _e.cover_url;
		}
		let Le = (e) => {
			Oe() && (e.preventDefault(), e.returnValue = "");
		};
		return ge(() => !w.value && !L.value && (!Oe() || window.confirm("课程有未保存的修改，确定离开？"))), ue(() => {
			De(), window.addEventListener("beforeunload", Le);
		}), le(() => {
			Te?.abort(), window.removeEventListener("beforeunload", Le);
		}), (n, i) => (O(), b("section", {
			ref_key: "editorRoot",
			ref: q,
			class: "course-editor",
			"aria-busy": g.value || w.value
		}, [
			x("header", yt, [
				C(P(a), {
					"icon-only": "",
					title: "返回课程列表",
					"aria-label": "返回课程列表",
					disabled: w.value || L.value,
					onClick: ke
				}, {
					default: z(() => [C(P(f), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", bt, [x("h2", null, N(t.courseId ? "编辑课程" : "新增课程"), 1), x("span", null, N(M.value?.source_locale || "zh-CN") + " · " + N(j.value), 1)]),
				x("div", xt, [
					U.value ? (O(), v(P(a), {
						key: 0,
						variant: "danger",
						size: "sm",
						disabled: g.value || T.value || w.value || L.value,
						onClick: Ne
					}, {
						default: z(() => [...i[27] ||= [S("删除课程", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(a), {
						size: "sm",
						disabled: g.value || T.value,
						onClick: i[0] ||= (e) => D.value = !0
					}, {
						icon: z(() => [C(P(f), {
							name: "search",
							size: 14
						})]),
						default: z(() => [i[28] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					W.value ? y("", !0) : (O(), v(P(a), {
						key: 1,
						size: "sm",
						disabled: g.value || T.value || w.value || L.value,
						onClick: Ae
					}, {
						icon: z(() => [C(P(f), {
							name: "save",
							size: 14
						})]),
						default: z(() => [i[29] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					ve.value ? (O(), b("span", St, N(ve.value), 1)) : y("", !0),
					W.value ? y("", !0) : (O(), b("div", Ct, [be.value ? (O(), b("span", wt, "还有 " + N(be.value) + " 项待完善", 1)) : y("", !0), H.value ? (O(), v(P(a), {
						key: 1,
						variant: "primary",
						size: "sm",
						disabled: g.value || T.value || L.value,
						loading: w.value,
						onClick: i[1] ||= (e) => Me(K.scheduled_local ? "scheduled" : "published")
					}, {
						icon: z(() => [C(P(f), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: z(() => [S(N(K.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)]))
				])
			]),
			g.value ? (O(), b("div", Tt, [C(P(f), {
				name: "loader-circle",
				class: "academy-spin",
				size: 28
			}), i[30] ||= x("span", null, "正在读取课程资料...", -1)])) : T.value ? (O(), b("div", Et, [C(P(ie), {
				type: "error",
				description: E.value,
				closable: !1
			}, null, 8, ["description"]), C(P(a), { onClick: De }, {
				default: z(() => [...i[31] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (O(), b("div", Dt, [x("aside", Ot, [C(P(e), {
				model: K,
				rules: P(Z),
				"label-position": "top",
				onSubmit: i[11] ||= me(() => {}, ["prevent"])
			}, {
				default: z(() => [
					C(P(r), {
						label: "课程分类",
						prop: "category_ids",
						error: Q.value.category_ids,
						required: ""
					}, {
						default: z(() => [C(P(s), {
							modelValue: K.category_ids,
							"onUpdate:modelValue": i[2] ||= (e) => K.category_ids = e,
							options: Se.value,
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
					i[32] ||= x("h3", null, "课程设置", -1),
					C(P(r), {
						label: "课程封面",
						prop: "cover_url",
						error: Q.value.cover_url
					}, {
						default: z(() => [C(ze, {
							modelValue: K.cover_url,
							"onUpdate:modelValue": i[3] ||= (e) => K.cover_url = e,
							label: "课程封面",
							disabled: G.value,
							upload: P(oe),
							onBusyChange: i[4] ||= (e) => L.value = e,
							onStart: i[5] ||= (e) => E.value = "",
							onError: Fe,
							onSuccess: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "课程难度",
						prop: "difficulty_level",
						error: Q.value.difficulty_level
					}, {
						default: z(() => [C(P(s), {
							modelValue: K.difficulty_level,
							"onUpdate:modelValue": i[6] ||= (e) => K.difficulty_level = e,
							options: Ce.value,
							disabled: G.value,
							"aria-label": "课程难度"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "预计课时(分钟)",
						prop: "estimated_minutes",
						error: Q.value.estimated_minutes
					}, {
						default: z(() => [C(P(l), {
							modelValue: K.estimated_minutes,
							"onUpdate:modelValue": i[7] ||= (e) => K.estimated_minutes = e,
							min: 1,
							max: 1e5,
							precision: 0,
							disabled: G.value,
							"aria-label": "预计课时"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "前端排序",
						prop: "sort_order",
						error: Q.value.sort_order
					}, {
						default: z(() => [C(P(l), {
							modelValue: K.sort_order,
							"onUpdate:modelValue": i[8] ||= (e) => K.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: G.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[33] ||= x("h3", null, "发布设置", -1),
					C(P(r), {
						label: "启用状态",
						prop: "is_enabled",
						error: Q.value.is_enabled
					}, {
						default: z(() => [C(P(o), {
							modelValue: K.is_enabled,
							"onUpdate:modelValue": i[9] ||= (e) => K.is_enabled = e,
							disabled: G.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "计划发布时间",
						prop: "scheduled_local",
						error: Q.value.scheduled_local
					}, {
						default: z(() => [C(P(m), {
							modelValue: K.scheduled_local,
							"onUpdate:modelValue": i[10] ||= (e) => K.scheduled_local = e,
							type: "datetime-local",
							disabled: G.value || !H.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", kt, [C(P(e), {
				model: K,
				rules: P(Z),
				"label-position": "top",
				onSubmit: i[15] ||= me(() => {}, ["prevent"])
			}, {
				default: z(() => [
					C(P(r), {
						label: "标题",
						prop: "title",
						error: Q.value.title,
						required: ""
					}, {
						default: z(() => [C(P(m), {
							modelValue: K.title,
							"onUpdate:modelValue": i[12] ||= (e) => K.title = e,
							maxlength: 255,
							disabled: G.value,
							placeholder: "输入课程标题",
							"aria-label": "课程标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "摘要",
						prop: "summary",
						error: Q.value.summary
					}, {
						default: z(() => [pe(x("textarea", {
							"onUpdate:modelValue": i[13] ||= (e) => K.summary = e,
							class: "course-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: G.value,
							"aria-invalid": !!Q.value.summary,
							"aria-label": "课程摘要"
						}, null, 8, At), [[I, K.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "正文",
						prop: "body_html",
						error: Q.value.body_html
					}, {
						default: z(() => [C(P(ne), {
							modelValue: K.body_html,
							"onUpdate:modelValue": i[14] ||= (e) => K.body_html = e,
							readonly: W.value,
							disabled: w.value,
							"min-height": 420,
							"max-height": 760,
							"aria-label": "课程正文"
						}, null, 8, [
							"modelValue",
							"readonly",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])])])),
			C(P(se), {
				modelValue: D.value,
				"onUpdate:modelValue": i[19] ||= (e) => D.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1,
				onOpened: $
			}, {
				footer: z(() => [C(P(a), {
					variant: "primary",
					onClick: i[18] ||= (e) => D.value = !1
				}, {
					default: z(() => [...i[34] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: z(() => [C(P(e), {
					model: K,
					rules: P(Z),
					"label-position": "top",
					onSubmit: i[17] ||= me(() => {}, ["prevent"])
				}, {
					default: z(() => [C(P(r), {
						label: "SEO 描述",
						prop: "seo_description",
						error: Q.value.seo_description
					}, {
						default: z(() => [pe(x("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": i[16] ||= (e) => K.seo_description = e,
							class: "course-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: G.value,
							"aria-invalid": !!Q.value.seo_description,
							"aria-label": "SEO 描述"
						}, null, 8, jt), [[I, K.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(se), {
				modelValue: B.value,
				"onUpdate:modelValue": i[21] ||= (e) => B.value = e,
				title: "确认删除",
				subtitle: `操作对象：${K.title || "未命名课程"}`,
				width: "460px",
				"panel-class": "course-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !w.value
			}, {
				"header-actions": z(() => [x("span", Mt, [C(P(f), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: z(() => [C(P(a), {
					disabled: w.value,
					onClick: i[20] ||= (e) => B.value = !1
				}, {
					default: z(() => [...i[35] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(a), {
					variant: "warning",
					loading: w.value,
					onClick: Pe
				}, {
					default: z(() => [...i[36] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: z(() => [C(P(ie), {
					class: "course-delete-dialog__notice",
					type: "warning",
					closable: !1,
					"show-icon": !1,
					description: "确定删除这门课程吗？删除后将不再展示，请谨慎操作。"
				}), V.value ? (O(), v(P(ie), {
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
			C(P(se), {
				modelValue: k.value,
				"onUpdate:modelValue": i[24] ||= (e) => k.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: z(() => [C(P(a), { onClick: i[22] ||= (e) => k.value = !1 }, {
					default: z(() => [...i[37] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(a), {
					variant: "primary",
					onClick: i[23] ||= (e) => h("close")
				}, {
					default: z(() => [...i[38] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(se), {
				modelValue: fe.value,
				"onUpdate:modelValue": i[26] ||= (e) => fe.value = e,
				title: "将课程转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: z(() => [C(P(a), { onClick: i[25] ||= (e) => fe.value = !1 }, {
					default: z(() => [...i[39] ||= [S("取消", -1)]]),
					_: 1
				}), C(P(a), {
					variant: "primary",
					onClick: je
				}, {
					default: z(() => [...i[40] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, vt));
	}
}), [["__scopeId", "data-v-4bde73b0"]]), Pt = { class: "academy-courses" }, Ft = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { hasPermission: n } = he(), { formatDateTime: r } = he(), { academyDifficulties: i, academyPublishStates: o, getAcademyList: s, getAcademyMetadata: c } = it(), l = A(!1), u = A(), d = (e) => n([`cms_academy:${e}`]), te = A(), ne = W(c, (e) => {
			te.value = e;
		}), ie = [
			...U(),
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
		], { proTableBindings: ae, reload: oe, filters: se } = t({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: _(() => [
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
		ne.bindFilters(se);
		let p = new AbortController();
		async function m() {
			try {
				te.value = await c(p.signal);
			} catch {}
		}
		function h(e) {
			u.value = e, l.value = !0;
		}
		function g() {
			l.value = !1, oe(), m();
		}
		return ue(m), le(() => p.abort()), (e, t) => (O(), b("div", Pt, [l.value ? (O(), v(Nt, {
			key: 0,
			"course-id": u.value,
			onClose: t[0] ||= (e) => l.value = !1,
			onSaved: g
		}, null, 8, ["course-id"])) : y("", !0), pe(C(P(ee), E(P(ae), {
			"auto-refreshable": !1,
			columns: ie,
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
			"cell-cms_source_type": z(({ row: e }) => [C(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": z(() => [d("add") ? (O(), v(P(a), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => h()
			}, {
				icon: z(() => [C(P(f), {
					name: "plus",
					size: 14
				})]),
				default: z(() => [t[2] ||= S("新增课程", -1)]),
				_: 1
			})) : y("", !0)]),
			"cell-publish_status": z(({ row: e }) => [C(P(re), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: z(() => [S(N(P(o).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": z(({ row: e }) => [C(P(re), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: z(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": z(({ row: e }) => [S(N(P(r)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": z(({ row: e }) => [C(P(a), {
				size: "sm",
				"icon-only": "",
				title: d("edit") ? "编辑课程" : "课程详情",
				"aria-label": d("edit") ? "编辑课程" : "课程详情",
				onClick: (t) => h(e.id)
			}, {
				default: z(() => [C(P(f), {
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
		}, 16), [[L, !l.value]])]));
	}
}), [["__scopeId", "data-v-0a52bb25"]]);
//#endregion
//#region src/cms/api/content/help.ts
function It() {
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
var Lt = ["aria-checked", "disabled"], Rt = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "EnabledToggle",
	props: {
		modelValue: { type: Boolean },
		disabled: { type: Boolean }
	},
	emits: ["update:modelValue"],
	setup(e) {
		return (t, n) => (O(), b("button", {
			type: "button",
			role: "switch",
			class: D(["help-toggle", { "is-on": e.modelValue }]),
			"aria-checked": e.modelValue,
			"aria-label": "启用状态",
			disabled: e.disabled,
			onClick: n[0] ||= (n) => t.$emit("update:modelValue", !e.modelValue)
		}, [n[1] ||= x("span", {
			class: "help-toggle__track",
			"aria-hidden": "true"
		}, [x("span")], -1), x("span", null, N(e.modelValue ? "已启用" : "已停用"), 1)], 10, Lt));
	}
}), [["__scopeId", "data-v-5cfe8693"]]), zt = { class: "help-categories" }, Bt = ["aria-busy"], Vt = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Ht = { class: "taxonomy-editor__field" }, Ut = { class: "taxonomy-editor__field" }, Wt = { class: "taxonomy-editor__icon-control" }, Gt = ["title"], Kt = ["aria-label"], qt = { key: 1 }, Jt = {
	key: 0,
	class: "help-hint"
}, Yt = { class: "taxonomy-editor__row" }, Xt = "分类", Zt = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(n) {
		let { helpError: o, deleteHelp: c, getHelpMetadata: u, getHelpList: d, getHelpDetail: te, saveHelp: ne } = It(), { hasPermission: oe } = he(), { formatDateTime: h } = he(), g = (e) => oe([`cms_help_category:${e}`]), w = A(), T = A(), ce = W(u, (e) => {
			w.value = e;
		}), D = [
			...U(),
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
		], { proTableBindings: k, reload: fe, filters: j } = t({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: _(() => [
				...ce.fields,
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
			]),
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
		ce.bindFilters(j);
		let M = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			icon_key: "",
			sort_order: 10,
			is_enabled: !0
		}), F = de(M()), I = [...p], L = new Set(I), R = _(() => L.has(F.icon_key) ? F.icon_key : void 0), pe = A(!1), B = A(!1), V = A(!1), ge = A(!1), H = A(!1), K = A(""), q = A(!1), J = A(""), Y = _(() => !g(F.id ? "edit" : "add")), X = _(() => V.value || ge.value), _e;
		async function ve(e) {
			_e?.abort(), _e = new AbortController();
			let t = _e;
			Object.assign(F, M(), { id: e || "" }), J.value = "", H.value = !1, K.value = "", q.value = !1, pe.value = !0, B.value = !0;
			try {
				if (T.value = await u(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await te("categories", e, t.signal);
				if (T.value = await u(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(F, {
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
				t.signal.aborted || (q.value = !0, J.value = o(e));
			} finally {
				t.signal.aborted || (B.value = !1);
			}
		}
		function Z() {
			return X.value ? !1 : (_e?.abort(), !0);
		}
		function ye() {
			Z() && (pe.value = !1);
		}
		async function Q() {
			if (!(Y.value || X.value || B.value || q.value)) {
				if (!F.name.trim() || F.sort_order === null) {
					J.value = "请填写分类名称和排序";
					return;
				}
				if (F.icon_key.length > 128) {
					J.value = "图标标识最多 128 个字符";
					return;
				}
				V.value = !0, J.value = "";
				try {
					await ne("categories", {
						name: F.name,
						parent_id: F.parent_id || null,
						icon_key: F.icon_key || null,
						sort_order: F.sort_order,
						is_enabled: F.is_enabled,
						id: F.id || void 0,
						row_version: F.id ? F.row_version : void 0
					}), pe.value = !1, ae.success("保存成功"), await Promise.all([fe(), Ce()]);
				} catch (e) {
					J.value = o(e);
				} finally {
					V.value = !1;
				}
			}
		}
		function be() {
			!F.id || !g("delete") || X.value || B.value || q.value || (K.value = "", H.value = !0);
		}
		async function $() {
			if (!(!H.value || !F.id || !g("delete") || X.value || B.value || q.value)) {
				ge.value = !0, K.value = "";
				try {
					await c("categories", F.id, F.row_version), H.value = !1, pe.value = !1, ae.success("分类已删除"), await Promise.all([fe(), Ce()]);
				} catch (e) {
					K.value = o(e);
				} finally {
					ge.value = !1;
				}
			}
		}
		let xe = _(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(T.value?.categories || []).filter((e) => !e.parent_id && e.id !== F.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Se = new AbortController();
		async function Ce() {
			try {
				w.value = await u(Se.signal);
			} catch {}
		}
		return ue(Ce), le(() => {
			_e?.abort(), Se.abort();
		}), (t, n) => (O(), b("div", zt, [
			C(P(ee), E(P(k), {
				"auto-refreshable": !1,
				columns: D,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Xt}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": z(({ row: e }) => [C(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": z(() => [g("add") ? (O(), v(P(a), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: n[0] ||= (e) => ve()
				}, {
					icon: z(() => [C(P(f), {
						name: "plus",
						size: 14
					})]),
					default: z(() => [S("新增" + N(Xt))]),
					_: 1
				})) : y("", !0)]),
				"cell-is_enabled": z(({ row: e }) => [C(P(re), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: z(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": z(({ row: e }) => [C(P(a), {
					size: "sm",
					"icon-only": "",
					title: g("edit") ? `编辑${Xt}` : `${Xt}详情`,
					"aria-label": `编辑${Xt}`,
					onClick: (t) => ve(e.id)
				}, {
					default: z(() => [C(P(f), {
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
			}, 16, ["aria-label"]),
			C(P(se), {
				modelValue: pe.value,
				"onUpdate:modelValue": n[6] ||= (e) => pe.value = e,
				title: `${F.id ? "编辑" : "新增"}帮助${Xt}`,
				width: "680px",
				subtitle: "帮助分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Z
			}, {
				footer: z(() => [
					F.id && g("delete") ? (O(), v(P(a), {
						key: 0,
						variant: "danger",
						disabled: B.value || q.value || X.value,
						onClick: be
					}, {
						icon: z(() => [C(P(f), {
							name: "trash-2",
							size: 14
						})]),
						default: z(() => [n[11] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(a), {
						disabled: X.value,
						onClick: ye
					}, {
						default: z(() => [...n[12] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Y.value ? y("", !0) : (O(), v(P(a), {
						key: 1,
						variant: "primary",
						loading: V.value,
						disabled: B.value || q.value || ge.value,
						onClick: Q
					}, {
						default: z(() => [S("保存" + N(Xt))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: z(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": B.value
				}, [
					B.value ? (O(), b("div", Vt, [C(P(f), {
						name: "loader-circle",
						class: "help-spin",
						size: 24
					}), x("span", null, "正在读取" + N(Xt) + "...")])) : y("", !0),
					J.value ? (O(), v(P(ie), {
						key: 1,
						type: "error",
						closable: !1,
						description: J.value
					}, null, 8, ["description"])) : y("", !0),
					!B.value && !q.value ? (O(), v(P(e), {
						key: 2,
						model: F,
						"label-position": "top",
						onSubmit: me(Q, ["prevent"])
					}, {
						default: z(() => [
							F.id ? (O(), v(P(r), {
								key: 0,
								label: "分类ID"
							}, {
								default: z(() => [C(P(m), {
									"model-value": F.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : y("", !0),
							C(P(r), {
								label: `${Xt}名称`,
								required: ""
							}, {
								default: z(() => [C(P(m), {
									modelValue: F.name,
									"onUpdate:modelValue": n[1] ||= (e) => F.name = e,
									maxlength: 120,
									disabled: Y.value || X.value,
									"aria-label": `${Xt}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							C(P(r), { label: "父分类" }, {
								default: z(() => [x("div", Ht, [C(P(s), {
									modelValue: F.parent_id,
									"onUpdate:modelValue": n[2] ||= (e) => F.parent_id = e,
									options: xe.value,
									disabled: Y.value || X.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), n[9] ||= x("p", { class: "help-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类文章。 ", -1)])]),
								_: 1
							}),
							C(P(r), { label: "图标标识" }, {
								default: z(() => [x("div", Ut, [
									x("div", Wt, [C(P(i), {
										modelValue: F.icon_key,
										"onUpdate:modelValue": n[3] ||= (e) => F.icon_key = e,
										suggestions: I,
										"min-length": 0,
										disabled: Y.value || X.value,
										clearable: "",
										placeholder: "输入或下拉选择 6mm 图标，例如 circle-help"
									}, {
										option: z(({ option: e }) => [x("span", {
											class: "taxonomy-editor__icon-option",
											title: String(e)
										}, [C(P(f), {
											name: String(e),
											size: 18
										}, null, 8, ["name"]), x("span", null, N(e), 1)], 8, Gt)]),
										_: 1
									}, 8, ["modelValue", "disabled"]), x("span", {
										class: "taxonomy-editor__icon-preview",
										role: "img",
										"aria-label": R.value ? `图标预览：${R.value}` : "暂无图标预览"
									}, [R.value ? (O(), v(P(f), {
										key: 0,
										name: R.value,
										size: 20
									}, null, 8, ["name"])) : (O(), b("span", qt, "—"))], 8, Kt)]),
									n[10] ||= x("p", { class: "help-hint" }, " 支持直接输入名称或从下拉列表选择；不填写 SVG 或 HTML。 ", -1),
									F.icon_key && !R.value ? (O(), b("p", Jt, " 当前名称不在已安装的 6mm 图标库中，暂无法预览。 ")) : y("", !0)
								])]),
								_: 1
							}),
							x("div", Yt, [C(P(r), {
								label: "前端排序",
								required: ""
							}, {
								default: z(() => [C(P(l), {
									modelValue: F.sort_order,
									"onUpdate:modelValue": n[4] ||= (e) => F.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Y.value || X.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(P(r), { label: "启用状态" }, {
								default: z(() => [C(Rt, {
									modelValue: F.is_enabled,
									"onUpdate:modelValue": n[5] ||= (e) => F.is_enabled = e,
									disabled: Y.value || X.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : y("", !0)
				], 8, Bt)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(P(se), {
				modelValue: H.value,
				"onUpdate:modelValue": n[8] ||= (e) => H.value = e,
				title: "删除帮助分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !ge.value
			}, {
				footer: z(() => [C(P(a), {
					disabled: ge.value,
					onClick: n[7] ||= (e) => H.value = !1
				}, {
					default: z(() => [...n[13] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(a), {
					variant: "danger",
					loading: ge.value,
					onClick: $
				}, {
					default: z(() => [...n[14] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: z(() => [x("p", null, "确认删除分类“" + N(F.name) + "”？有关联文章或子分类的分类无法删除。", 1), K.value ? (O(), v(P(ie), {
					key: 0,
					type: "error",
					closable: !1,
					description: K.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"])
		]));
	}
}), [["__scopeId", "data-v-d876a44a"]]), Qt = ["aria-busy"], $t = { class: "article-editor__header" }, en = { class: "article-editor__heading" }, tn = { class: "article-editor__commands" }, nn = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, rn = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, an = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, on = {
	key: 1,
	class: "article-editor__failure"
}, sn = {
	key: 0,
	class: "article-editor__error"
}, cn = { class: "article-editor__body" }, ln = { class: "article-editor__settings" }, un = { class: "article-editor__related" }, dn = { class: "article-editor__content" }, fn = ["aria-invalid", "disabled"], pn = ["aria-invalid", "disabled"], mn = {
	class: "help-delete-dialog__icon",
	"aria-hidden": "true"
}, hn = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: n }) {
		let { helpError: i, helpCategoryLabel: o, deleteHelp: c, getHelpDetail: u, getHelpMetadata: d, getHelpList: ee, saveHelp: te, uploadHelpCover: re } = It(), { hasPermission: oe } = he(), p = t, h = n, w = A(!0), T = A(!1), E = A(!1), ce = A(""), D = A(!1), k = A(!1), fe = A(!1), j = A(!1), M = A(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), F = A(), L = A("draft"), R = A(!1), V = _(() => oe(["cms_help:publish"])), H = _(() => !oe([`cms_help:${p.articleId ? "edit" : "add"}`]) || !V.value && L.value !== "draft"), U = _(() => oe(["cms_help:delete"]) && (V.value || L.value === "draft"));
		async function W() {
			if (!(!U.value || T.value || w.value || E.value)) {
				T.value = !0, ce.value = "";
				try {
					await c("articles", K.id, K.row_version), De = JSON.stringify(K), ae.success("文章已删除"), h("saved");
				} catch (e) {
					ce.value = i(e), j.value = !1;
				} finally {
					T.value = !1;
				}
			}
		}
		let G = _(() => H.value || T.value), K = de({
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
		}), { editorRoot: q, seoInput: J, fieldRules: Y, fieldErrors: X, pendingCount: _e, saveError: ve, validateSave: Z, setSaveFailure: ye, focusFirstError: Q, focusSeoError: be } = Ce(K, () => F.value?.categories || [], "help", D), $ = A(""), xe = A(!1), Se = A([]), we = _(() => Se.value.filter((e) => e.id !== p.articleId).map((e) => ({
			label: `${e.title} · ${e.code}`,
			value: e.id
		})));
		async function Te() {
			if (!(G.value || xe.value)) {
				xe.value = !0;
				try {
					let e = await ee("articles", {
						keyword: $.value,
						page_size: 100
					}, Oe?.signal), t = Se.value.filter((e) => K.related_content_ids.includes(e.id));
					Se.value = [...new Map([...t, ...e.lists].map((e) => [e.id, e])).values()];
				} catch (e) {
					Oe?.signal.aborted || (ce.value = i(e));
				} finally {
					xe.value = !1;
				}
			}
		}
		let Ee = _(() => (F.value?.categories || []).map((e) => ({
			label: o(F.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
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
			w.value = !0, E.value = !1, ce.value = "";
			try {
				if (F.value = await d(e.signal, { cms_source_type: "platform" }), p.articleId) {
					let t = await u("articles", p.articleId, e.signal);
					if (F.value = await d(e.signal, { space_id: String(t.space_id) }), M.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"sort_order",
						"is_enabled"
					]) Object.assign(K, { [e]: t[e] });
					K.category_id = t.category_id || "", K.search_keywords = t.search_keywords || "", K.helpful_enabled = t.helpful_enabled ?? !0, K.related_content_ids = t.related_content_ids || [], Se.value = t.related_articles || [];
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url",
						"content_source",
						"author_name"
					]) K[e] = t[e] || "";
					K.scheduled_local = t.publish_status === "scheduled" ? ke(t.scheduled_at) : "", L.value = t.publish_status;
				}
				De = JSON.stringify(K);
			} catch (t) {
				e.signal.aborted || (ce.value = i(t), E.value = !0);
			} finally {
				e.signal.aborted || (w.value = !1);
			}
		}
		let je = () => !w.value && !E.value && De !== JSON.stringify(K);
		function Me() {
			je() ? k.value = !0 : h("close");
		}
		function Ne() {
			L.value === "draft" ? Fe("draft") : fe.value = !0;
		}
		function Pe() {
			fe.value = !1, Fe("draft");
		}
		async function Fe(e) {
			if (G.value || w.value || E.value || R.value || (ce.value = "", !await Z(e))) return;
			let t = K.scheduled_local ? new Date(K.scheduled_local) : null;
			T.value = !0, ce.value = "";
			try {
				await te("articles", {
					...K,
					id: K.id || void 0,
					row_version: K.id ? K.row_version : void 0,
					category_id: K.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), De = JSON.stringify(K), ae.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "文章已发布"), h("saved");
			} catch (e) {
				ye(e);
			} finally {
				T.value = !1;
			}
			_e.value && await Q();
		}
		function Ie(e) {
			ce.value = i(e);
		}
		let Le = (e) => {
			je() && (e.preventDefault(), e.returnValue = "");
		};
		return ge(() => !T.value && !R.value && (!je() || window.confirm("文章有未保存的修改，确定离开？"))), ue(() => {
			Ae(), window.addEventListener("beforeunload", Le);
		}), le(() => {
			Oe?.abort(), window.removeEventListener("beforeunload", Le);
		}), (n, i) => (O(), b("section", {
			ref_key: "editorRoot",
			ref: q,
			class: "article-editor",
			"aria-busy": w.value || T.value
		}, [
			x("header", $t, [
				C(P(a), {
					"icon-only": "",
					title: "返回文章列表",
					"aria-label": "返回文章列表",
					disabled: T.value || R.value,
					onClick: Me
				}, {
					default: z(() => [C(P(f), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", en, [x("h2", null, N(t.articleId ? "编辑文章" : "新增文章"), 1), x("span", null, N(F.value?.source_locale || "zh-CN") + " · " + N(M.value), 1)]),
				x("div", tn, [
					t.articleId && U.value ? (O(), v(P(a), {
						key: 0,
						size: "sm",
						disabled: w.value || E.value || T.value || R.value,
						onClick: i[0] ||= (e) => j.value = !0
					}, {
						default: z(() => [...i[32] ||= [S("删除文章", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(a), {
						size: "sm",
						disabled: w.value || E.value,
						onClick: i[1] ||= (e) => D.value = !0
					}, {
						icon: z(() => [C(P(f), {
							name: "search",
							size: 14
						})]),
						default: z(() => [i[33] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					H.value ? y("", !0) : (O(), v(P(a), {
						key: 1,
						size: "sm",
						disabled: w.value || E.value || T.value || R.value,
						onClick: Ne
					}, {
						icon: z(() => [C(P(f), {
							name: "save",
							size: 14
						})]),
						default: z(() => [i[34] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					P(ve) ? (O(), b("span", nn, N(P(ve)), 1)) : y("", !0),
					!H.value && P(_e) ? (O(), b("span", rn, "还有 " + N(P(_e)) + " 项待完善", 1)) : y("", !0),
					!H.value && V.value ? (O(), v(P(a), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: w.value || E.value || R.value,
						loading: T.value,
						onClick: i[2] ||= (e) => Fe(K.scheduled_local ? "scheduled" : "published")
					}, {
						icon: z(() => [C(P(f), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: z(() => [S(N(K.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)
				])
			]),
			w.value ? (O(), b("div", an, [C(P(f), {
				name: "loader-circle",
				class: "help-spin",
				size: 28
			}), i[35] ||= x("span", null, "正在读取文章资料...", -1)])) : E.value ? (O(), b("div", on, [C(P(ie), {
				type: "error",
				description: ce.value,
				closable: !1
			}, null, 8, ["description"]), C(P(a), { onClick: Ae }, {
				default: z(() => [...i[36] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (O(), b(g, { key: 2 }, [ce.value ? (O(), b("div", sn, [C(P(ie), {
				type: "error",
				description: ce.value,
				closable: !1
			}, null, 8, ["description"])])) : y("", !0), x("div", cn, [x("aside", ln, [C(P(e), {
				model: K,
				rules: P(Y),
				"label-position": "top",
				onSubmit: i[16] ||= me(() => {}, ["prevent"])
			}, {
				default: z(() => [
					C(P(r), {
						label: "文章分类",
						prop: "category_id",
						error: P(X).category_id,
						required: ""
					}, {
						default: z(() => [C(P(s), {
							modelValue: K.category_id,
							"onUpdate:modelValue": i[3] ||= (e) => K.category_id = e,
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
					i[39] ||= x("h3", null, "文章设置", -1),
					C(P(r), {
						label: "文章封面",
						prop: "cover_url",
						error: P(X).cover_url
					}, {
						default: z(() => [C(ze, {
							modelValue: K.cover_url,
							"onUpdate:modelValue": i[4] ||= (e) => K.cover_url = e,
							label: "文章封面",
							disabled: G.value,
							upload: P(re),
							onBusyChange: i[5] ||= (e) => R.value = e,
							onStart: i[6] ||= (e) => ce.value = "",
							onError: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "内容来源",
						prop: "content_source",
						error: P(X).content_source
					}, {
						default: z(() => [C(P(m), {
							modelValue: K.content_source,
							"onUpdate:modelValue": i[7] ||= (e) => K.content_source = e,
							maxlength: 160,
							disabled: G.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "作者署名",
						prop: "author_name",
						error: P(X).author_name
					}, {
						default: z(() => [C(P(m), {
							modelValue: K.author_name,
							"onUpdate:modelValue": i[8] ||= (e) => K.author_name = e,
							maxlength: 120,
							disabled: G.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "前端排序",
						prop: "sort_order",
						error: P(X).sort_order
					}, {
						default: z(() => [C(P(l), {
							modelValue: K.sort_order,
							"onUpdate:modelValue": i[9] ||= (e) => K.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: G.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[40] ||= x("h3", null, "发布设置", -1),
					C(P(r), {
						label: "搜索关键词",
						prop: "search_keywords",
						error: P(X).search_keywords
					}, {
						default: z(() => [C(P(m), {
							modelValue: K.search_keywords,
							"onUpdate:modelValue": i[10] ||= (e) => K.search_keywords = e,
							maxlength: 2e3,
							disabled: G.value,
							placeholder: "使用空格或逗号分隔",
							"aria-label": "搜索关键词"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: P(X).helpful_enabled
					}, {
						default: z(() => [C(Rt, {
							modelValue: K.helpful_enabled,
							"onUpdate:modelValue": i[11] ||= (e) => K.helpful_enabled = e,
							disabled: G.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "相关文章",
						prop: "related_content_ids",
						error: P(X).related_content_ids
					}, {
						default: z(() => [x("div", un, [
							C(P(m), {
								modelValue: $.value,
								"onUpdate:modelValue": i[12] ||= (e) => $.value = e,
								disabled: G.value,
								placeholder: "搜索文章标题",
								"aria-label": "搜索相关文章",
								onKeydown: B(me(Te, ["prevent"]), ["enter"])
							}, null, 8, [
								"modelValue",
								"disabled",
								"onKeydown"
							]),
							C(P(a), {
								size: "sm",
								disabled: G.value,
								loading: xe.value,
								onClick: Te
							}, {
								default: z(() => [...i[37] ||= [S("查找文章", -1)]]),
								_: 1
							}, 8, ["disabled", "loading"]),
							C(P(s), {
								modelValue: K.related_content_ids,
								"onUpdate:modelValue": i[13] ||= (e) => K.related_content_ids = e,
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
							i[38] ||= x("p", { class: "article-editor__hint" }, " 最多 20 篇，按选择顺序展示。可关联草稿，前台须按发布状态过滤。 ", -1)
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "启用状态",
						prop: "is_enabled",
						error: P(X).is_enabled
					}, {
						default: z(() => [C(Rt, {
							modelValue: K.is_enabled,
							"onUpdate:modelValue": i[14] ||= (e) => K.is_enabled = e,
							disabled: G.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: P(X).scheduled_local
					}, {
						default: z(() => [C(P(m), {
							modelValue: K.scheduled_local,
							"onUpdate:modelValue": i[15] ||= (e) => K.scheduled_local = e,
							type: "datetime-local",
							disabled: G.value || !V.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[41] ||= x("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", dn, [C(P(e), {
				model: K,
				rules: P(Y),
				"label-position": "top",
				onSubmit: i[20] ||= me(() => {}, ["prevent"])
			}, {
				default: z(() => [
					C(P(r), {
						label: "标题",
						prop: "title",
						error: P(X).title,
						required: ""
					}, {
						default: z(() => [C(P(m), {
							modelValue: K.title,
							"onUpdate:modelValue": i[17] ||= (e) => K.title = e,
							maxlength: 255,
							disabled: G.value,
							placeholder: "输入文章标题",
							"aria-label": "文章标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "摘要",
						prop: "summary",
						error: P(X).summary
					}, {
						default: z(() => [pe(x("textarea", {
							"onUpdate:modelValue": i[18] ||= (e) => K.summary = e,
							"aria-invalid": !!P(X).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: G.value,
							"aria-label": "文章摘要"
						}, null, 8, fn), [[I, K.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "正文",
						prop: "body_html",
						error: P(X).body_html
					}, {
						default: z(() => [C(P(ne), {
							modelValue: K.body_html,
							"onUpdate:modelValue": i[19] ||= (e) => K.body_html = e,
							readonly: H.value,
							disabled: T.value,
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
			C(P(se), {
				modelValue: D.value,
				"onUpdate:modelValue": i[24] ||= (e) => D.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: z(() => [C(P(a), {
					variant: "primary",
					onClick: i[23] ||= (e) => D.value = !1
				}, {
					default: z(() => [...i[42] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: z(() => [C(P(e), {
					model: K,
					rules: P(Y),
					"label-position": "top",
					onSubmit: i[22] ||= me(() => {}, ["prevent"])
				}, {
					default: z(() => [C(P(r), {
						label: "SEO 描述",
						prop: "seo_description",
						error: P(X).seo_description
					}, {
						default: z(() => [pe(x("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": i[21] ||= (e) => K.seo_description = e,
							"aria-invalid": !!P(X).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: G.value,
							"aria-label": "SEO 描述"
						}, null, 8, pn), [[I, K.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(se), {
				modelValue: j.value,
				"onUpdate:modelValue": i[26] ||= (e) => j.value = e,
				title: "确认删除",
				subtitle: `操作对象：${K.title || "未命名文章"}`,
				width: "460px",
				"panel-class": "help-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !T.value
			}, {
				"header-actions": z(() => [x("span", mn, [C(P(f), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: z(() => [C(P(a), {
					disabled: T.value,
					onClick: i[25] ||= (e) => j.value = !1
				}, {
					default: z(() => [...i[43] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(a), {
					variant: "warning",
					loading: T.value,
					onClick: W
				}, {
					default: z(() => [...i[44] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: z(() => [C(P(ie), {
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
			C(P(se), {
				modelValue: k.value,
				"onUpdate:modelValue": i[29] ||= (e) => k.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: z(() => [C(P(a), { onClick: i[27] ||= (e) => k.value = !1 }, {
					default: z(() => [...i[45] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(a), {
					variant: "primary",
					onClick: i[28] ||= (e) => h("close")
				}, {
					default: z(() => [...i[46] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(se), {
				modelValue: fe.value,
				"onUpdate:modelValue": i[31] ||= (e) => fe.value = e,
				title: "将文章转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: z(() => [C(P(a), { onClick: i[30] ||= (e) => fe.value = !1 }, {
					default: z(() => [...i[47] ||= [S("取消", -1)]]),
					_: 1
				}), C(P(a), {
					variant: "primary",
					onClick: Pe
				}, {
					default: z(() => [...i[48] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Qt));
	}
}), [["__scopeId", "data-v-16f68391"]]), gn = { class: "help-articles" }, _n = {
	key: 0,
	class: "help-statistics-note"
}, vn = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let n = he(), { helpPublishStates: r, helpCategoryLabel: i, getHelpList: o, getHelpMetadata: s } = It(), { hasPermission: c } = he(), { formatDateTime: l } = he(), u = A(!1), d = A(), te = (e) => c([`cms_help:${e}`]), ne = A(), ie = W(s, (e) => {
			ne.value = e;
		}), ae = [
			...U(),
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
				formatter: (e) => i(ne.value, e)
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
		], { proTableBindings: oe, reload: se, filters: p } = t({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: _(() => [
				...ie.fields,
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
						label: i(ne.value, e.id),
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
		ie.bindFilters(p);
		let m = new AbortController();
		async function h() {
			try {
				ne.value = await s(m.signal);
			} catch {}
		}
		function g(e) {
			d.value = e, u.value = !0;
		}
		function x() {
			u.value = !1, se(), h();
		}
		return ue(h), le(() => m.abort()), (e, t) => (O(), b("div", gn, [
			!u.value && P(n).mode === "platform" ? (O(), b("p", _n, " 当前管理平台默认模板。浏览量、评价数及有帮助率属于站点运行数据，此处显示“—”，不汇总白标站点。 ")) : y("", !0),
			u.value ? (O(), v(hn, {
				key: 1,
				"article-id": d.value,
				onClose: t[0] ||= (e) => u.value = !1,
				onSaved: x
			}, null, 8, ["article-id"])) : y("", !0),
			pe(C(P(ee), E(P(oe), {
				"auto-refreshable": !1,
				columns: ae,
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
				"cell-cms_source_type": z(({ row: e }) => [C(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": z(() => [te("add") ? (O(), v(P(a), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: t[1] ||= (e) => g()
				}, {
					icon: z(() => [C(P(f), {
						name: "plus",
						size: 14
					})]),
					default: z(() => [t[2] ||= S("新增文章", -1)]),
					_: 1
				})) : y("", !0)]),
				"cell-publish_status": z(({ row: e }) => [C(P(re), {
					size: "sm",
					effect: "soft",
					type: e.publish_status === "published" ? "success" : "warning"
				}, {
					default: z(() => [S(N(P(r).find((t) => t.value === e.publish_status)?.label), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-is_enabled": z(({ row: e }) => [C(P(re), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: z(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-publish_time": z(({ row: e }) => [S(N(P(l)(e.published_at || e.scheduled_at)), 1)]),
				"cell-actions": z(({ row: e }) => [C(P(a), {
					size: "sm",
					"icon-only": "",
					title: te("edit") ? "编辑文章" : "文章详情",
					"aria-label": te("edit") ? "编辑文章" : "文章详情",
					onClick: (t) => g(e.id)
				}, {
					default: z(() => [C(P(f), {
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
			}, 16), [[L, !u.value]])
		]));
	}
}), [["__scopeId", "data-v-e3373337"]]);
//#endregion
//#region src/cms/api/content/feedback.ts
function yn() {
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
var bn = { class: "feedback-page" }, xn = ["aria-busy"], Sn = {
	key: 0,
	role: "status"
}, Cn = { class: "feedback-info" }, wn = { class: "feedback-content" }, Tn = {
	key: 0,
	class: "muted"
}, En = { class: "attachment-title" }, Dn = ["src", "alt"], On = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { getFeedbackList: n, getFeedbackMetadata: r, getFeedbackDetail: i, getFeedbackAttachment: o, feedbackSourceTypes: s, feedbackSourceLabel: c, feedbackError: l } = yn(), { formatDateTime: u } = he(), d = A({
			scenes: [],
			issues: []
		}), te = W(r, (e) => {
			d.value = e;
		}), ne = [
			...U(),
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
				formatter: u
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				fixed: "right",
				align: "center",
				hideable: !1
			}
		], { proTableBindings: ae, filters: oe } = t({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: _(() => [
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
					}, ...d.value.scenes.map((e) => ({
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
					}, ...d.value.issues.map((e) => ({
						label: `${d.value.scenes.find((t) => t.id === e.scene_id)?.name || "—"} / ${e.name}`,
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
		});
		te.bindFilters(oe);
		let p = A(!1), m = A(!1), h = A(""), w = A(), T = A({}), ce = A(""), D, k = new AbortController();
		async function de(e) {
			D?.abort();
			let t = new AbortController();
			D = t, w.value = void 0, T.value = {}, h.value = "", ce.value = "", p.value = !0, m.value = !0;
			try {
				let n = await i(e, t.signal);
				t.signal.aborted || (w.value = n);
			} catch (e) {
				t.signal.aborted || (h.value = l(e));
			} finally {
				t.signal.aborted || (m.value = !1);
			}
		}
		async function j(e) {
			let t = D, n = w.value?.id;
			if (!(!t || !n || ce.value)) {
				ce.value = e, h.value = "";
				try {
					let r = await o(n, e, t.signal);
					!t.signal.aborted && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(r.data_url) && (T.value[e] = r.data_url);
				} catch (e) {
					t.signal.aborted || (h.value = l(e));
				} finally {
					t.signal.aborted || (ce.value = "");
				}
			}
		}
		return R(p, (e) => {
			e || (D?.abort(), w.value = void 0, T.value = {}, h.value = "");
		}), ue(async () => {
			try {
				d.value = await r(k.signal);
			} catch {}
		}), le(() => {
			k.abort(), D?.abort();
		}), (e, t) => (O(), b("div", bn, [C(P(ee), E(P(ae), {
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
			"cell-cms_source_type": z(({ row: e }) => [C(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"cell-source_type": z(({ row: e }) => [C(P(re), {
				size: "sm",
				effect: "soft",
				type: e.source_type === "merchant" ? "warning" : e.source_type === "platform" ? "success" : "primary"
			}, {
				default: z(() => [S(N(P(c)(e.source_type)), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-actions": z(({ row: e }) => [C(P(a), {
				size: "sm",
				"icon-only": "",
				title: "查看反馈",
				"aria-label": "查看反馈",
				onClick: (t) => de(e.id)
			}, {
				default: z(() => [C(P(f), {
					name: "eye",
					size: 15
				})]),
				_: 1
			}, 8, ["onClick"])]),
			_: 1
		}, 16), C(P(se), {
			modelValue: p.value,
			"onUpdate:modelValue": t[1] ||= (e) => p.value = e,
			title: "反馈详情",
			subtitle: w.value?.code || "查看用户正式提交的意见反馈",
			width: "760px",
			"close-on-click-modal": !1
		}, {
			footer: z(() => [C(P(a), { onClick: t[0] ||= (e) => p.value = !1 }, {
				default: z(() => [...t[14] ||= [S("关闭", -1)]]),
				_: 1
			})]),
			default: z(() => [x("div", {
				class: "feedback-detail",
				"aria-busy": m.value
			}, [
				m.value ? (O(), b("p", Sn, "正在读取反馈…")) : y("", !0),
				h.value ? (O(), v(P(ie), {
					key: 1,
					type: "error",
					closable: !1,
					description: h.value
				}, null, 8, ["description"])) : y("", !0),
				w.value && !m.value ? (O(), b(g, { key: 2 }, [
					x("dl", Cn, [
						x("div", null, [t[2] ||= x("dt", null, "UID", -1), x("dd", null, N(w.value.public_user_id_snapshot), 1)]),
						x("div", null, [t[3] ||= x("dt", null, "用户账号", -1), x("dd", null, N(w.value.username_snapshot || "—"), 1)]),
						x("div", null, [t[4] ||= x("dt", null, "来源类型", -1), x("dd", null, N(P(c)(w.value.source_type)), 1)]),
						x("div", null, [t[5] ||= x("dt", null, "来源名称", -1), x("dd", null, N(w.value.source_name_snapshot || "—"), 1)]),
						x("div", null, [t[6] ||= x("dt", null, "业务场景", -1), x("dd", null, N(w.value.scene_name_snapshot), 1)]),
						x("div", null, [t[7] ||= x("dt", null, "问题分类", -1), x("dd", null, N(w.value.issue_category_name_snapshot), 1)]),
						x("div", null, [t[8] ||= x("dt", null, "联系方式（脱敏）", -1), x("dd", null, N(w.value.contact_display), 1)]),
						x("div", null, [t[9] ||= x("dt", null, "提交时间", -1), x("dd", null, N(P(u)(w.value.submitted_at)), 1)])
					]),
					x("section", null, [t[10] ||= x("h3", null, "反馈内容", -1), x("div", wn, N(w.value.content), 1)]),
					x("section", null, [
						x("h3", null, [t[11] ||= S(" 附件 ", -1), x("span", null, N(w.value.attachments?.length || 0), 1)]),
						w.value.attachments?.length ? y("", !0) : (O(), b("p", Tn, "暂无附件")),
						(O(!0), b(g, null, fe(w.value.attachments, (e) => (O(), b("div", {
							key: e.id,
							class: "feedback-attachment"
						}, [x("div", En, [x("span", null, N(e.original_name || "图片附件") + " · " + N(Math.ceil(e.byte_size / 1024)) + " KB", 1), C(P(a), {
							size: "sm",
							loading: ce.value === e.id,
							onClick: (t) => j(e.id)
						}, {
							default: z(() => [...t[12] ||= [S("查看图片", -1)]]),
							_: 1
						}, 8, ["loading", "onClick"])]), T.value[e.id] ? (O(), b("img", {
							key: 0,
							src: T.value[e.id],
							alt: e.original_name || "反馈图片"
						}, null, 8, Dn)) : y("", !0)]))), 128))
					]),
					t[13] ||= x("p", { class: "muted" }, "来源和分类为提交时快照；此页面仅查看，不修改用户原始反馈。", -1)
				], 64)) : y("", !0)
			], 8, xn)]),
			_: 1
		}, 8, ["modelValue", "subtitle"])]));
	}
}), [["__scopeId", "data-v-ed508c88"]]);
//#endregion
//#region src/cms/api/content/announcement.ts
function kn() {
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
var An = { class: "announcement-categories" }, jn = ["aria-busy"], Mn = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Nn = { class: "taxonomy-editor__field" }, Pn = { class: "taxonomy-editor__row" }, Fn = "分类", In = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(n) {
		let { hasPermission: i } = he(), { formatDateTime: o } = he(), { announcementError: c, deleteAnnouncement: u, getAnnouncementMetadata: d, getAnnouncementList: te, getAnnouncementDetail: ne, saveAnnouncement: oe } = kn(), p = (e) => i([`cms_announcement_category:${e}`]), h = A(), g = A(), w = W(d, (e) => {
			h.value = e;
		}), T = [
			...U(),
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
		], { proTableBindings: ce, reload: D, filters: k } = t({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: [
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
			],
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), a = await te("categories", {
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
		w.bindFilters(k);
		let fe = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), j = de(fe()), M = A(!1), F = A(!1), I = A(!1), L = A(!1), R = A(!1), pe = A(""), B = A(!1), V = A(""), ge = A(!1), H = _(() => !p(j.id ? "edit" : "add")), K = _(() => I.value || L.value), q = "", Y;
		async function X(e) {
			Y?.abort(), Y = new AbortController();
			let t = Y;
			Object.assign(j, fe(), { id: e || "" }), V.value = "", R.value = !1, pe.value = "", B.value = !1, M.value = !0, F.value = !0, q = JSON.stringify(j);
			try {
				if (g.value = await d(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await ne("categories", e, t.signal);
				if (g.value = await d(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(j, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), q = JSON.stringify(j);
			} catch (e) {
				t.signal.aborted || (B.value = !0, V.value = c(e));
			} finally {
				t.signal.aborted || (F.value = !1);
			}
		}
		function _e() {
			return K.value ? !1 : !F.value && !B.value && JSON.stringify(j) !== q ? (ge.value = !0, !1) : (Y?.abort(), !0);
		}
		function ve() {
			_e() && (M.value = !1);
		}
		function Z() {
			Y?.abort(), ge.value = !1, M.value = !1;
		}
		async function ye() {
			if (!(H.value || K.value || F.value || B.value)) {
				if (!j.name.trim() || j.sort_order === null) {
					V.value = "请填写分类名称和排序";
					return;
				}
				I.value = !0, V.value = "";
				try {
					await oe("categories", {
						name: j.name,
						parent_id: j.parent_id || null,
						sort_order: j.sort_order,
						is_enabled: j.is_enabled,
						id: j.id || void 0,
						row_version: j.id ? j.row_version : void 0
					}), M.value = !1, ae.success("保存成功"), await Promise.all([D(), Se()]);
				} catch (e) {
					V.value = c(e);
				} finally {
					I.value = !1;
				}
			}
		}
		function Q() {
			!j.id || !p("delete") || K.value || F.value || B.value || (pe.value = "", R.value = !0);
		}
		async function be() {
			if (!(!R.value || !j.id || !p("delete") || K.value || F.value || B.value)) {
				L.value = !0, pe.value = "";
				try {
					await u("categories", j.id, j.row_version), R.value = !1, M.value = !1, ae.success("分类已删除"), await Promise.all([D(), Se()]);
				} catch (e) {
					pe.value = c(e);
				} finally {
					L.value = !1;
				}
			}
		}
		let $ = _(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(g.value?.categories || []).filter((e) => !e.parent_id && e.id !== j.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), xe = new AbortController();
		async function Se() {
			try {
				h.value = await d(xe.signal);
			} catch {}
		}
		return ue(Se), le(() => {
			Y?.abort(), xe.abort();
		}), (t, n) => (O(), b("div", An, [
			C(P(ee), E(P(ce), {
				"auto-refreshable": !1,
				columns: T,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Fn}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": z(({ row: e }) => [C(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": z(() => [p("add") ? (O(), v(P(a), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: n[0] ||= (e) => X()
				}, {
					icon: z(() => [C(P(f), {
						name: "plus",
						size: 14
					})]),
					default: z(() => [S("新增" + N(Fn))]),
					_: 1
				})) : y("", !0)]),
				"cell-is_enabled": z(({ row: e }) => [C(P(re), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: z(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": z(({ row: e }) => [C(P(a), {
					size: "sm",
					"icon-only": "",
					title: p("edit") ? `编辑${Fn}` : `${Fn}详情`,
					"aria-label": p("edit") ? `编辑${Fn}` : `${Fn}详情`,
					onClick: (t) => X(e.id)
				}, {
					default: z(() => [C(P(f), {
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
			C(P(se), {
				modelValue: M.value,
				"onUpdate:modelValue": n[5] ||= (e) => M.value = e,
				title: `${j.id ? "编辑" : "新增"}公告${Fn}`,
				width: "680px",
				subtitle: "公告分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": _e
			}, {
				footer: z(() => [
					j.id && p("delete") ? (O(), v(P(a), {
						key: 0,
						variant: "danger",
						disabled: F.value || B.value || K.value,
						onClick: Q
					}, {
						icon: z(() => [C(P(f), {
							name: "trash-2",
							size: 14
						})]),
						default: z(() => [n[11] ||= S("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(a), {
						disabled: K.value,
						onClick: ve
					}, {
						default: z(() => [...n[12] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					H.value ? y("", !0) : (O(), v(P(a), {
						key: 1,
						variant: "primary",
						loading: I.value,
						disabled: F.value || B.value || L.value,
						onClick: ye
					}, {
						default: z(() => [S("保存" + N(Fn))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: z(() => [x("div", {
					class: "taxonomy-editor",
					"aria-busy": F.value
				}, [
					F.value ? (O(), b("div", Mn, [C(P(f), {
						name: "loader-circle",
						class: "announcement-spin",
						size: 24
					}), x("span", null, "正在读取" + N(Fn) + "...")])) : y("", !0),
					V.value ? (O(), v(P(ie), {
						key: 1,
						type: "error",
						closable: !1,
						description: V.value
					}, null, 8, ["description"])) : y("", !0),
					!F.value && !B.value ? (O(), v(P(e), {
						key: 2,
						model: j,
						"label-position": "top",
						onSubmit: me(ye, ["prevent"])
					}, {
						default: z(() => [
							j.id ? (O(), v(P(r), {
								key: 0,
								label: "分类ID"
							}, {
								default: z(() => [C(P(m), {
									"model-value": j.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : y("", !0),
							C(P(r), {
								label: `${Fn}名称`,
								required: ""
							}, {
								default: z(() => [C(P(m), {
									modelValue: j.name,
									"onUpdate:modelValue": n[1] ||= (e) => j.name = e,
									maxlength: 120,
									disabled: H.value || K.value,
									"aria-label": `${Fn}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							C(P(r), { label: "父分类" }, {
								default: z(() => [x("div", Nn, [C(P(s), {
									modelValue: j.parent_id,
									"onUpdate:modelValue": n[2] ||= (e) => j.parent_id = e,
									options: $.value,
									disabled: H.value || K.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), n[10] ||= x("p", { class: "announcement-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类公告。 ", -1)])]),
								_: 1
							}),
							x("div", Pn, [C(P(r), {
								label: "前端排序",
								required: ""
							}, {
								default: z(() => [C(P(l), {
									modelValue: j.sort_order,
									"onUpdate:modelValue": n[3] ||= (e) => j.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: H.value || K.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), C(P(r), { label: "启用状态" }, {
								default: z(() => [C(J, {
									modelValue: j.is_enabled,
									"onUpdate:modelValue": n[4] ||= (e) => j.is_enabled = e,
									disabled: H.value || K.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : y("", !0)
				], 8, jn)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			C(P(se), {
				modelValue: R.value,
				"onUpdate:modelValue": n[7] ||= (e) => R.value = e,
				title: "删除公告分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !L.value
			}, {
				footer: z(() => [C(P(a), {
					disabled: L.value,
					onClick: n[6] ||= (e) => R.value = !1
				}, {
					default: z(() => [...n[13] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(a), {
					variant: "danger",
					loading: L.value,
					onClick: be
				}, {
					default: z(() => [...n[14] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: z(() => [x("p", null, "确认删除分类“" + N(j.name) + "”？有关联公告或子分类的分类无法删除。", 1), pe.value ? (O(), v(P(ie), {
					key: 0,
					type: "error",
					closable: !1,
					description: pe.value
				}, null, 8, ["description"])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(P(se), {
				modelValue: ge.value,
				"onUpdate:modelValue": n[9] ||= (e) => ge.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: z(() => [C(P(a), { onClick: n[8] ||= (e) => ge.value = !1 }, {
					default: z(() => [...n[15] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(a), {
					variant: "primary",
					onClick: Z
				}, {
					default: z(() => [...n[16] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-1b5aec70"]]), Ln = ["aria-busy"], Rn = { class: "article-editor__header" }, zn = { class: "article-editor__heading" }, Bn = { class: "article-editor__commands" }, Vn = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, Hn = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Un = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, Wn = {
	key: 1,
	class: "article-editor__failure"
}, Gn = {
	key: 0,
	class: "article-editor__error"
}, Kn = { class: "article-editor__body" }, qn = { class: "article-editor__settings" }, Jn = { class: "article-editor__content" }, Yn = ["aria-invalid", "disabled"], Xn = ["aria-invalid", "disabled"], Zn = {
	class: "announcement-delete-dialog__icon",
	"aria-hidden": "true"
}, Qn = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(t, { emit: n }) {
		let { hasPermission: i } = he(), { announcementError: o, announcementCategoryLabel: c, deleteAnnouncement: u, getAnnouncementDetail: d, getAnnouncementMetadata: ee, saveAnnouncement: te, uploadAnnouncementCover: re } = kn(), oe = t, p = n, h = A(!0), w = A(!1), T = A(!1), E = A(""), ce = A(!1), D = A(!1), k = A(!1), fe = A(!1), j = A(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), M = A(), F = A("draft"), L = A(!1), R = _(() => i(["cms_announcement:publish"])), B = _(() => !i([`cms_announcement:${oe.articleId ? "edit" : "add"}`]) || !R.value && F.value !== "draft"), V = _(() => i(["cms_announcement:delete"]) && (R.value || F.value === "draft"));
		async function H() {
			if (!(!V.value || w.value || h.value || T.value)) {
				w.value = !0, E.value = "";
				try {
					await u("articles", W.id, W.row_version), be = JSON.stringify(W), ae.success("公告已删除"), p("saved");
				} catch (e) {
					E.value = o(e), fe.value = !1;
				} finally {
					w.value = !1;
				}
			}
		}
		let U = _(() => B.value || w.value), W = de({
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
		}), { editorRoot: G, seoInput: K, fieldRules: q, fieldErrors: J, pendingCount: Y, saveError: X, validateSave: _e, setSaveFailure: ve, focusFirstError: Z, focusSeoError: ye } = Ce(W, () => M.value?.categories || [], "announcement", ce), Q = _(() => (M.value?.categories || []).map((e) => ({
			label: c(M.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
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
			h.value = !0, T.value = !1, E.value = "";
			try {
				if (M.value = await ee(e.signal, { cms_source_type: "platform" }), oe.articleId) {
					let t = await d("articles", oe.articleId, e.signal);
					if (M.value = await ee(e.signal, { space_id: String(t.space_id) }), j.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					W.scheduled_local = t.publish_status === "scheduled" ? xe(t.scheduled_at) : "", F.value = t.publish_status;
				}
				be = JSON.stringify(W);
			} catch (t) {
				e.signal.aborted || (E.value = o(t), T.value = !0);
			} finally {
				e.signal.aborted || (h.value = !1);
			}
		}
		let we = () => !h.value && !T.value && be !== JSON.stringify(W);
		function Te() {
			we() ? D.value = !0 : p("close");
		}
		function Ee() {
			F.value === "draft" ? Oe("draft") : k.value = !0;
		}
		function De() {
			k.value = !1, Oe("draft");
		}
		async function Oe(e) {
			if (U.value || h.value || T.value || L.value || (E.value = "", !await _e(e))) return;
			let t = W.scheduled_local ? new Date(W.scheduled_local) : null;
			w.value = !0, E.value = "";
			try {
				await te("articles", {
					...W,
					id: W.id || void 0,
					row_version: W.id ? W.row_version : void 0,
					category_id: W.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), be = JSON.stringify(W), ae.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "公告已发布"), p("saved");
			} catch (e) {
				ve(e);
			} finally {
				w.value = !1;
			}
			Y.value && await Z();
		}
		function ke(e) {
			E.value = o(e);
		}
		let Ae = (e) => {
			we() && (e.preventDefault(), e.returnValue = "");
		};
		return ge(() => !w.value && !L.value && (!we() || window.confirm("公告有未保存的修改，确定离开？"))), ue(() => {
			Se(), window.addEventListener("beforeunload", Ae);
		}), le(() => {
			$?.abort(), window.removeEventListener("beforeunload", Ae);
		}), (n, i) => (O(), b("section", {
			ref_key: "editorRoot",
			ref: G,
			class: "article-editor",
			"aria-busy": h.value || w.value
		}, [
			x("header", Rn, [
				C(P(a), {
					"icon-only": "",
					title: "返回公告列表",
					"aria-label": "返回公告列表",
					disabled: w.value || L.value,
					onClick: Te
				}, {
					default: z(() => [C(P(f), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				x("div", zn, [x("h2", null, N(t.articleId ? "编辑公告" : "新增公告"), 1), x("span", null, N(M.value?.source_locale || "zh-CN") + " · " + N(j.value), 1)]),
				x("div", Bn, [
					t.articleId && V.value ? (O(), v(P(a), {
						key: 0,
						size: "sm",
						disabled: h.value || T.value || w.value || L.value,
						onClick: i[0] ||= (e) => fe.value = !0
					}, {
						default: z(() => [...i[29] ||= [S("删除公告", -1)]]),
						_: 1
					}, 8, ["disabled"])) : y("", !0),
					C(P(a), {
						size: "sm",
						disabled: h.value || T.value,
						onClick: i[1] ||= (e) => ce.value = !0
					}, {
						icon: z(() => [C(P(f), {
							name: "search",
							size: 14
						})]),
						default: z(() => [i[30] ||= S("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					B.value ? y("", !0) : (O(), v(P(a), {
						key: 1,
						size: "sm",
						disabled: h.value || T.value || w.value || L.value,
						onClick: Ee
					}, {
						icon: z(() => [C(P(f), {
							name: "save",
							size: 14
						})]),
						default: z(() => [i[31] ||= S("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					P(X) ? (O(), b("span", Vn, N(P(X)), 1)) : y("", !0),
					!B.value && P(Y) ? (O(), b("span", Hn, "还有 " + N(P(Y)) + " 项待完善", 1)) : y("", !0),
					!B.value && R.value ? (O(), v(P(a), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: h.value || T.value || L.value,
						loading: w.value,
						onClick: i[2] ||= (e) => Oe(W.scheduled_local ? "scheduled" : "published")
					}, {
						icon: z(() => [C(P(f), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: z(() => [S(N(W.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : y("", !0)
				])
			]),
			h.value ? (O(), b("div", Un, [C(P(f), {
				name: "loader-circle",
				class: "announcement-spin",
				size: 28
			}), i[32] ||= x("span", null, "正在读取公告资料...", -1)])) : T.value ? (O(), b("div", Wn, [C(P(ie), {
				type: "error",
				description: E.value,
				closable: !1
			}, null, 8, ["description"]), C(P(a), { onClick: Se }, {
				default: z(() => [...i[33] ||= [S("重新加载", -1)]]),
				_: 1
			})])) : (O(), b(g, { key: 2 }, [E.value ? (O(), b("div", Gn, [C(P(ie), {
				type: "error",
				description: E.value,
				closable: !1
			}, null, 8, ["description"])])) : y("", !0), x("div", Kn, [x("aside", qn, [C(P(e), {
				model: W,
				rules: P(q),
				"label-position": "top",
				onSubmit: i[13] ||= me(() => {}, ["prevent"])
			}, {
				default: z(() => [
					C(P(r), {
						label: "公告分类",
						prop: "category_id",
						error: P(J).category_id,
						required: ""
					}, {
						default: z(() => [C(P(s), {
							modelValue: W.category_id,
							"onUpdate:modelValue": i[3] ||= (e) => W.category_id = e,
							options: Q.value,
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
					i[34] ||= x("h3", null, "公告设置", -1),
					C(P(r), {
						label: "公告封面",
						prop: "cover_url",
						error: P(J).cover_url
					}, {
						default: z(() => [C(ze, {
							modelValue: W.cover_url,
							"onUpdate:modelValue": i[4] ||= (e) => W.cover_url = e,
							label: "公告封面",
							disabled: U.value,
							upload: P(re),
							onBusyChange: i[5] ||= (e) => L.value = e,
							onStart: i[6] ||= (e) => E.value = "",
							onError: ke
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "内容来源",
						prop: "content_source",
						error: P(J).content_source
					}, {
						default: z(() => [C(P(m), {
							modelValue: W.content_source,
							"onUpdate:modelValue": i[7] ||= (e) => W.content_source = e,
							maxlength: 160,
							disabled: U.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "作者署名",
						prop: "author_name",
						error: P(J).author_name
					}, {
						default: z(() => [C(P(m), {
							modelValue: W.author_name,
							"onUpdate:modelValue": i[8] ||= (e) => W.author_name = e,
							maxlength: 120,
							disabled: U.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "前端排序",
						prop: "sort_order",
						error: P(J).sort_order
					}, {
						default: z(() => [C(P(l), {
							modelValue: W.sort_order,
							"onUpdate:modelValue": i[9] ||= (e) => W.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: U.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[35] ||= x("h3", null, "发布设置", -1),
					C(P(r), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: P(J).helpful_enabled
					}, {
						default: z(() => [C(Rt, {
							modelValue: W.helpful_enabled,
							"onUpdate:modelValue": i[10] ||= (e) => W.helpful_enabled = e,
							disabled: U.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "启用状态",
						prop: "is_enabled",
						error: P(J).is_enabled
					}, {
						default: z(() => [C(Rt, {
							modelValue: W.is_enabled,
							"onUpdate:modelValue": i[11] ||= (e) => W.is_enabled = e,
							disabled: U.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: P(J).scheduled_local
					}, {
						default: z(() => [C(P(m), {
							modelValue: W.scheduled_local,
							"onUpdate:modelValue": i[12] ||= (e) => W.scheduled_local = e,
							type: "datetime-local",
							disabled: U.value || !R.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[36] ||= x("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), x("main", Jn, [C(P(e), {
				model: W,
				rules: P(q),
				"label-position": "top",
				onSubmit: i[17] ||= me(() => {}, ["prevent"])
			}, {
				default: z(() => [
					C(P(r), {
						label: "标题",
						prop: "title",
						error: P(J).title,
						required: ""
					}, {
						default: z(() => [C(P(m), {
							modelValue: W.title,
							"onUpdate:modelValue": i[14] ||= (e) => W.title = e,
							maxlength: 255,
							disabled: U.value,
							placeholder: "输入公告标题",
							"aria-label": "公告标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "摘要",
						prop: "summary",
						error: P(J).summary
					}, {
						default: z(() => [pe(x("textarea", {
							"onUpdate:modelValue": i[15] ||= (e) => W.summary = e,
							"aria-invalid": !!P(J).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: U.value,
							"aria-label": "公告摘要"
						}, null, 8, Yn), [[I, W.summary]])]),
						_: 1
					}, 8, ["error"]),
					C(P(r), {
						label: "正文",
						prop: "body_html",
						error: P(J).body_html
					}, {
						default: z(() => [C(P(ne), {
							modelValue: W.body_html,
							"onUpdate:modelValue": i[16] ||= (e) => W.body_html = e,
							readonly: B.value,
							disabled: w.value,
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
			C(P(se), {
				modelValue: ce.value,
				"onUpdate:modelValue": i[21] ||= (e) => ce.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: z(() => [C(P(a), {
					variant: "primary",
					onClick: i[20] ||= (e) => ce.value = !1
				}, {
					default: z(() => [...i[37] ||= [S("确定", -1)]]),
					_: 1
				})]),
				default: z(() => [C(P(e), {
					model: W,
					rules: P(q),
					"label-position": "top",
					onSubmit: i[19] ||= me(() => {}, ["prevent"])
				}, {
					default: z(() => [C(P(r), {
						label: "SEO 描述",
						prop: "seo_description",
						error: P(J).seo_description
					}, {
						default: z(() => [pe(x("textarea", {
							ref_key: "seoInput",
							ref: K,
							"onUpdate:modelValue": i[18] ||= (e) => W.seo_description = e,
							"aria-invalid": !!P(J).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: U.value,
							"aria-label": "SEO 描述"
						}, null, 8, Xn), [[I, W.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(se), {
				modelValue: fe.value,
				"onUpdate:modelValue": i[23] ||= (e) => fe.value = e,
				title: "确认删除",
				subtitle: `操作对象：${W.title || "未命名公告"}`,
				width: "460px",
				"panel-class": "announcement-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !w.value
			}, {
				"header-actions": z(() => [x("span", Zn, [C(P(f), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: z(() => [C(P(a), {
					disabled: w.value,
					onClick: i[22] ||= (e) => fe.value = !1
				}, {
					default: z(() => [...i[38] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(a), {
					variant: "warning",
					loading: w.value,
					onClick: H
				}, {
					default: z(() => [...i[39] ||= [S("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: z(() => [C(P(ie), {
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
			C(P(se), {
				modelValue: D.value,
				"onUpdate:modelValue": i[26] ||= (e) => D.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: z(() => [C(P(a), { onClick: i[24] ||= (e) => D.value = !1 }, {
					default: z(() => [...i[40] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(a), {
					variant: "primary",
					onClick: i[25] ||= (e) => p("close")
				}, {
					default: z(() => [...i[41] ||= [S("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			C(P(se), {
				modelValue: k.value,
				"onUpdate:modelValue": i[28] ||= (e) => k.value = e,
				title: "将公告转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: z(() => [C(P(a), { onClick: i[27] ||= (e) => k.value = !1 }, {
					default: z(() => [...i[42] ||= [S("取消", -1)]]),
					_: 1
				}), C(P(a), {
					variant: "primary",
					onClick: De
				}, {
					default: z(() => [...i[43] ||= [S("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Ln));
	}
}), [["__scopeId", "data-v-525a2f73"]]), $n = { class: "announcement-articles" }, er = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { hasPermission: n } = he(), { formatDateTime: r } = he(), { announcementPublishStates: i, announcementCategoryLabel: o, getAnnouncementList: s, getAnnouncementMetadata: c } = kn(), l = A(!1), u = A(), d = (e) => n([`cms_announcement:${e}`]), te = A(), ne = W(c, (e) => {
			te.value = e;
		}), ie = [
			...U(),
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
		], { proTableBindings: ae, reload: oe, filters: se } = t({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: _(() => [
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
		ne.bindFilters(se);
		let p = new AbortController();
		async function m() {
			try {
				te.value = await c(p.signal);
			} catch {}
		}
		function h(e) {
			u.value = e, l.value = !0;
		}
		function g() {
			l.value = !1, oe(), m();
		}
		return ue(m), le(() => p.abort()), (e, t) => (O(), b("div", $n, [l.value ? (O(), v(Qn, {
			key: 0,
			"article-id": u.value,
			onClose: t[0] ||= (e) => l.value = !1,
			onSaved: g
		}, null, 8, ["article-id"])) : y("", !0), pe(C(P(ee), E(P(ae), {
			"auto-refreshable": !1,
			columns: ie,
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
			"cell-cms_source_type": z(({ row: e }) => [C(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": z(() => [d("add") ? (O(), v(P(a), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => h()
			}, {
				icon: z(() => [C(P(f), {
					name: "plus",
					size: 14
				})]),
				default: z(() => [t[2] ||= S("新增公告", -1)]),
				_: 1
			})) : y("", !0)]),
			"cell-publish_status": z(({ row: e }) => [C(P(re), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: z(() => [S(N(P(i).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": z(({ row: e }) => [C(P(re), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: z(() => [S(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": z(({ row: e }) => [S(N(P(r)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": z(({ row: e }) => [C(P(a), {
				size: "sm",
				"icon-only": "",
				title: d("edit") ? "编辑公告" : "公告详情",
				"aria-label": d("edit") ? "编辑公告" : "公告详情",
				onClick: (t) => h(e.id)
			}, {
				default: z(() => [C(P(f), {
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
		}, 16), [[L, !l.value]])]));
	}
}), [["__scopeId", "data-v-9f055b06"]]);
//#endregion
//#region src/cms/api/content/translations.ts
function tr() {
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
var nr = (e, t) => t > 0 ? Math.min(100, Math.round(e / t * 100)) : 0, rr = (e, t) => `${e}:${t}`;
function ir(e, t) {
	return e ? e.fields.flatMap((e) => e.translations.flatMap((n) => {
		let r = t[rr(e.key, n.locale)] ?? n.text;
		return r === n.text ? [] : [{
			field_name: e.key,
			locale: n.locale,
			text: r,
			source_hash: e.source_hash,
			row_version: n.row_version
		}];
	})) : [];
}
function ar(e) {
	return Object.fromEntries(e.fields.flatMap((e) => e.translations.map((t) => [rr(e.key, t.locale), t.text])));
}
function or(e) {
	return e?.translations.filter((e) => e.status === "ready").length ?? 0;
}
var sr = (e) => !!e && ["queued", "running"].includes(e.status), cr = {
	queued: "等待处理",
	running: "翻译中",
	succeeded: "翻译完成",
	partial_failed: "部分未完成",
	failed: "翻译未完成",
	cancelled: "已取消"
}, lr = {
	draft: "草稿",
	scheduled: "定时发布",
	published: "已发布"
};
function ur(e) {
	if (e && typeof e == "object") {
		let t = e;
		return Object.values(t.errors || {}).flat()[0] || t.msg || t.message || "操作失败，请稍后重试";
	}
	return "操作失败，请稍后重试";
}
//#endregion
//#region src/cms/views/content/localization/translations/index.vue?vue&type=script&setup=true&lang.ts
var dr = ["aria-busy"], fr = { class: "translation-toolbar surface" }, pr = { class: "translation-title" }, mr = { class: "translation-title__icon" }, hr = { class: "translation-progress" }, gr = { class: "translation-toolbar__actions" }, _r = { class: "source-language" }, vr = {
	key: 3,
	class: "translation-job surface",
	role: "status"
}, yr = { key: 0 }, br = { key: 1 }, xr = ["title"], Sr = {
	class: "language-overview surface",
	"aria-label": "目标语言完成度"
}, Cr = [
	"disabled",
	"title",
	"onClick"
], wr = {
	class: "module-bar surface",
	"aria-label": "翻译内容模块"
}, Tr = { class: "module-count" }, Er = { class: "translation-workspace surface" }, Dr = { class: "content-browser" }, Or = { class: "content-browser__header" }, kr = ["aria-busy"], Ar = {
	key: 0,
	class: "region-status",
	role: "status"
}, jr = [
	"aria-current",
	"disabled",
	"onClick"
], Mr = { class: "content-item__text" }, Nr = ["title"], Pr = {
	key: 0,
	class: "region-status"
}, Fr = { class: "content-browser__footer" }, Ir = ["aria-busy"], Lr = {
	key: 0,
	class: "editor-state",
	role: "status"
}, Rr = { class: "translation-editor__header" }, zr = { class: "translation-editor__title" }, Br = { key: 0 }, Vr = ["title"], Hr = { class: "source-field" }, Ur = { class: "section-heading" }, Wr = [
	"value",
	"rows",
	"aria-label"
], Gr = { class: "section-heading target-heading" }, Kr = {
	key: 0,
	class: "empty-source"
}, qr = {
	key: 1,
	class: "empty-source"
}, Jr = ["data-locale"], Yr = { class: "target-field__heading" }, Xr = ["for"], Zr = {
	key: 0,
	class: "status-stale"
}, Qr = {
	key: 1,
	class: "status-ready"
}, $r = [
	"id",
	"onUpdate:modelValue",
	"rows",
	"maxlength",
	"disabled",
	"dir",
	"placeholder"
], ei = { class: "target-field__count" }, ti = {
	key: 2,
	class: "editor-state"
}, ni = {
	key: 1,
	class: "region-status"
}, ri = {
	key: 2,
	class: "mm-translation-settings"
}, ii = { class: "mm-translation-settings__credential" }, ai = { key: 0 }, oi = { key: 1 }, si = { key: 2 }, ci = { class: "mm-translation-settings__grid" }, li = { class: "job-confirm" }, ui = /*#__PURE__*/ h(/* @__PURE__ */ w({
	__name: "index",
	setup(e) {
		let { cancelTranslationJob: t, createTranslationJob: i, getTranslationDetail: o, getTranslationJob: u, getTranslationList: ee, getTranslationMetadata: ne, getTranslationSettings: p, saveTranslations: h, saveTranslationSettings: w, testTranslationConnection: T } = tr(), { hasPermission: E } = he(), k = A(), de = A(""), j = A("news:content"), M = A([]), F = A(), L = A(""), me = A("title"), V = A(""), H = A(""), U = A(1), W = A(0), G = A({}), K = A(!1), q = A(!1), J = A(!1), Y = A(!1), X = A(""), _e = A(""), ve = A(), Z = A(null), ye = A(!1), Q = A(""), be = A(!1), $ = A(), xe = A(""), Se = A(!1), Ce = A(!1), we = A(!1), Te = A("field"), Ee = A([]), De = A(""), Oe = A(!1), ke = A(!1);
		R(ye, (e) => {
			e || (Q.value = "");
		});
		let Ae, je, Me, Ne, Pe, Fe = new AbortController(), Ie, Le = "", Re = _(() => E(["cms_translation:edit"])), ze = _(() => E(["cms_translation:config"])), Be = _(() => E(["cms_translation:translate"])), Ve = _(() => Y.value || Se.value || Oe.value), He = _(() => ir(F.value, G.value).length > 0), Ue = _(() => nr(k.value?.done || 0, k.value?.total || 0)), We = _(() => ({
			space_id: de.value,
			module: j.value.split(":")[0],
			kind: j.value.endsWith(":category") ? "category" : "content"
		})), Ge = _(() => k.value?.spaces.map((e) => ({
			label: e.label + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		})) || []), Ke = _(() => k.value?.locales.filter((e) => e.code !== k.value?.source_locale) || []), qe = _(() => Ke.value.map((e) => ({
			label: `${e.flag} ${e.label}`,
			value: e.code
		}))), Je = _(() => Ke.value.map((e) => ({
			label: `${e.label} · ${e.code}`,
			value: e.code
		}))), Ye = _(() => qe.value.filter((e) => nt(String(e.value)))), Xe = _(() => k.value?.locales.find((e) => e.code === k.value?.source_locale)?.label || k.value?.source_locale || "简体中文"), Ze = _(() => F.value?.fields.find((e) => e.key === me.value)), Qe = _(() => {
			let e = k.value?.modules.find((e) => e.key === j.value);
			return e?.kind === "category" ? `${k.value?.modules.find((t) => t.module === e.module && t.kind === "content")?.label || ""}分类` : e?.label || "新闻";
		}), $e = _(() => {
			let e = [];
			for (let t of k.value?.modules || []) {
				let n = e.find((e) => e[0].module === t.module);
				n ? n.push(t) : e.push([t]);
			}
			return e;
		}), et = _(() => !!de.value && k.value?.space_enabled && !!k.value.target_locales.length && !sr(Z.value) && !Ve.value && !He.value && !K.value && !q.value), tt = _(() => Z.value ? nr([
			"succeeded",
			"skipped",
			"cancelled"
		].reduce((e, t) => e + (Z.value?.counts[t] || 0), 0) + (sr(Z.value) ? 0 : Z.value.counts.failed || 0), Z.value.total) : 0), nt = (e) => k.value?.target_locales.includes(e) ?? !1, rt = (e) => k.value?.locales.find((t) => t.code === e), it = (e) => ({
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
			Ae = void 0, ke.value = !1, G.value = F.value ? ar(F.value) : {}, e?.();
		}
		function st() {
			ke.value = !1, Ae = void 0, Pe?.(!1), Pe = void 0;
		}
		function ct(e) {
			e !== de.value && at(() => {
				de.value = e, V.value = "", H.value = "", U.value = 1, Z.value = null, pt();
			});
		}
		function lt(e) {
			e.available && j.value !== e.key && at(() => {
				j.value = e.key, V.value = "", H.value = "", U.value = 1, ht();
			});
		}
		function ut(e) {
			at(() => {
				U.value = e, ht();
			});
		}
		function dt() {
			at(() => {
				H.value = V.value.trim(), U.value = 1, ht();
			});
		}
		function ft(e) {
			e !== L.value && at(() => {
				gt(e);
			});
		}
		async function pt() {
			Ne?.abort();
			let e = Ne = new AbortController();
			K.value = !0, X.value = "";
			try {
				let t = await ne(de.value || void 0, e.signal);
				if (e.signal.aborted) return;
				k.value = t, de.value = t.space_id || "", await ht(), Tt();
			} catch (t) {
				e.signal.aborted || (X.value = ur(t));
			} finally {
				e.signal.aborted || (K.value = !1);
			}
		}
		async function mt() {
			let e = de.value;
			if (e) try {
				let t = await ne(e, Fe.signal);
				e === de.value && (k.value = t);
			} catch {}
		}
		async function ht() {
			je?.abort(), Me?.abort();
			let e = je = new AbortController();
			if (q.value = !0, J.value = !1, F.value = void 0, L.value = "", G.value = {}, X.value = "", !de.value) {
				M.value = [], W.value = 0, q.value = !1;
				return;
			}
			let t = { ...We.value };
			try {
				let n = await ee(t, H.value, U.value, e.signal);
				if (e.signal.aborted) return;
				M.value = n.lists, W.value = n.count, M.value[0] && await gt(M.value[0].id);
			} catch (t) {
				e.signal.aborted || (M.value = [], W.value = 0, X.value = ur(t));
			} finally {
				e.signal.aborted || (q.value = !1);
			}
		}
		async function gt(e) {
			Me?.abort();
			let t = Me = new AbortController();
			J.value = !0, L.value = e, F.value = void 0, G.value = {}, X.value = "";
			try {
				let n = await o({ ...We.value }, e, t.signal);
				if (t.signal.aborted) return;
				F.value = n, G.value = ar(n), n.fields.some((e) => e.key === me.value) || (me.value = n.fields[0]?.key || ""), ve.value?.scrollTo({ top: 0 });
			} catch (e) {
				t.signal.aborted || (X.value = ur(e));
			} finally {
				t.signal.aborted || (J.value = !1);
			}
		}
		async function _t() {
			if (!F.value || !Re.value || Ve.value) return;
			let e = ir(F.value, G.value);
			if (e.length) {
				if (e.some((e) => !e.text.trim())) {
					X.value = "译文不能为空；未翻译的语言请保持未填写。";
					return;
				}
				Y.value = !0, X.value = "";
				try {
					let t = await h({ ...We.value }, F.value.id, e);
					F.value = t, G.value = ar(t);
					let n = M.value.findIndex((e) => e.id === t.id);
					n >= 0 && (M.value[n] = t), ae.success("翻译已保存"), mt();
				} catch (e) {
					X.value = ur(e);
				} finally {
					Y.value = !1;
				}
			}
		}
		async function vt(e) {
			_e.value = e, await ce();
			let t = ve.value?.querySelector(`[data-locale="${e}"]`);
			t?.scrollIntoView({
				block: "nearest",
				behavior: "smooth"
			}), t?.querySelector("textarea")?.focus();
		}
		async function yt() {
			if (!(!ze.value || !de.value)) {
				ye.value = !0, be.value = !0, xe.value = "", $.value = void 0, Q.value = "";
				try {
					$.value = await p(de.value, Fe.signal);
				} catch (e) {
					xe.value = ur(e);
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
					await w($.value, Q.value.trim()), Q.value = "", ye.value = !1, ae.success("翻译配置已保存"), await pt();
				} catch (e) {
					xe.value = ur(e);
				} finally {
					Se.value = !1;
				}
			}
		}
		async function xt() {
			if (!(!$.value || Ce.value || Se.value)) {
				Ce.value = !0, xe.value = "";
				try {
					await T($.value.space_id, $.value.space_revision, Q.value.trim()), ae.success("Google Translate 连接成功");
				} catch (e) {
					xe.value = ur(e);
				} finally {
					Ce.value = !1;
				}
			}
		}
		function St(e) {
			Te.value = e, Ee.value = [...k.value?.target_locales || []], De.value = "", Le = crypto.randomUUID(), we.value = !0;
		}
		async function Ct() {
			if (!(!Ee.value.length || Oe.value)) {
				Oe.value = !0, De.value = "";
				try {
					let e = await i({ ...We.value }, {
						request_key: Le,
						target_locales: Ee.value,
						...Te.value === "field" ? {
							id: L.value,
							field_name: me.value
						} : { keyword: H.value }
					});
					Z.value = e.job, we.value = !1, ae.success("翻译任务已提交"), wt();
				} catch (e) {
					De.value = ur(e);
				} finally {
					Oe.value = !1;
				}
			}
		}
		function wt() {
			clearTimeout(Ie), sr(Z.value) && (Ie = setTimeout(() => {
				Tt();
			}, 3e3));
		}
		async function Tt() {
			let e = de.value;
			if (!e || Fe.signal.aborted) return;
			let t = sr(Z.value);
			try {
				let n = await u(e, Fe.signal);
				if (e !== de.value) return;
				Z.value = n.job, t && !sr(Z.value) && (await mt(), !He.value && !Ve.value && L.value && await gt(L.value));
			} catch {}
			wt();
		}
		async function Et() {
			if (Z.value) try {
				let e = await t(de.value, Z.value.id);
				Z.value = e.job, clearTimeout(Ie), mt();
			} catch (e) {
				X.value = ur(e);
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
			Q.value = "", Pe?.(!1), Fe.abort(), je?.abort(), Me?.abort(), Ne?.abort(), clearTimeout(Ie), window.removeEventListener("beforeunload", Dt);
		}), (e, t) => (O(), b("section", {
			class: "translations-page",
			"aria-label": "多语言翻译管理",
			"aria-busy": K.value
		}, [
			x("header", fr, [x("div", pr, [x("span", mr, [C(P(f), {
				name: "globe",
				size: 21
			})]), x("div", null, [t[21] ||= x("h1", null, "语言翻译管理", -1), x("div", hr, [
				x("strong", null, N(Ue.value) + "%", 1),
				C(P(n), {
					percentage: Ue.value,
					"show-text": !1,
					"stroke-width": 4,
					"aria-label": "全部翻译完成度"
				}, null, 8, ["percentage"]),
				x("span", null, N(k.value?.done.toLocaleString() || 0) + " / " + N(k.value?.total.toLocaleString() || 0) + " 个目标字段", 1)
			])])]), x("div", gr, [
				C(P(s), {
					"model-value": de.value,
					options: Ge.value,
					size: "sm",
					disabled: K.value || Ve.value,
					placeholder: "内容空间",
					"aria-label": "内容空间",
					"onUpdate:modelValue": t[0] ||= (e) => ct(String(e))
				}, null, 8, [
					"model-value",
					"options",
					"disabled"
				]),
				x("span", _r, [t[22] ||= S("内容源语言 ", -1), x("b", null, N(Xe.value), 1)]),
				ze.value ? (O(), v(P(a), {
					key: 0,
					size: "sm",
					disabled: !de.value || Ve.value,
					onClick: yt
				}, {
					icon: z(() => [C(P(f), {
						name: "sliders-horizontal",
						size: 14
					})]),
					default: z(() => [t[23] ||= S("翻译配置", -1)]),
					_: 1
				}, 8, ["disabled"])) : y("", !0),
				Be.value ? (O(), v(P(a), {
					key: 1,
					size: "sm",
					disabled: !et.value,
					onClick: t[1] ||= (e) => St("batch")
				}, {
					icon: z(() => [C(P(f), {
						name: "rocket",
						size: 14
					})]),
					default: z(() => [t[24] ||= S("批量翻译", -1)]),
					_: 1
				}, 8, ["disabled"])) : y("", !0),
				Be.value ? (O(), v(P(a), {
					key: 2,
					size: "sm",
					disabled: !et.value || !F.value || !Ze.value?.translatable,
					onClick: t[2] ||= (e) => St("field")
				}, {
					icon: z(() => [C(P(f), {
						name: "globe",
						size: 14
					})]),
					default: z(() => [t[25] ||= S("翻译当前字段", -1)]),
					_: 1
				}, 8, ["disabled"])) : y("", !0),
				Re.value ? (O(), v(P(a), {
					key: 3,
					size: "sm",
					variant: "primary",
					loading: Y.value,
					disabled: !He.value || Ve.value || !k.value?.space_enabled,
					onClick: _t
				}, {
					icon: z(() => [C(P(f), {
						name: "save",
						size: 14
					})]),
					default: z(() => [t[26] ||= S("保存翻译", -1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : y("", !0)
			])]),
			X.value ? (O(), v(P(ie), {
				key: 0,
				type: "error",
				closable: !0,
				onClose: t[3] ||= (e) => X.value = ""
			}, {
				default: z(() => [S(N(X.value), 1)]),
				_: 1
			})) : y("", !0),
			k.value && !k.value.space_enabled && de.value ? (O(), v(P(ie), {
				key: 1,
				type: "warning"
			}, {
				default: z(() => [...t[27] ||= [S("当前内容空间已停用，仅可查看翻译。", -1)]]),
				_: 1
			})) : y("", !0),
			k.value && !k.value.target_locales.length && de.value ? (O(), v(P(ie), {
				key: 2,
				type: "info"
			}, {
				default: z(() => [...t[28] ||= [S("尚未启用目标语言，请在“翻译配置”中选择语言后开始翻译。", -1)]]),
				_: 1
			})) : y("", !0),
			Z.value ? (O(), b("div", vr, [
				C(P(f), {
					name: P(sr)(Z.value) ? "loader-circle" : "info",
					size: 15
				}, null, 8, ["name"]),
				x("strong", null, N(P(cr)[Z.value.status] || Z.value.status), 1),
				x("span", null, "任务 #" + N(Z.value.id), 1),
				C(P(n), {
					percentage: tt.value,
					"show-text": !1,
					"stroke-width": 4
				}, null, 8, ["percentage"]),
				x("span", null, [
					S(N(Z.value.counts.succeeded || 0) + " / " + N(Z.value.total) + " 已完成", 1),
					Z.value.counts.failed ? (O(), b("span", yr, " · " + N(Z.value.counts.failed) + " 失败", 1)) : y("", !0),
					Z.value.counts.skipped ? (O(), b("span", br, " · " + N(Z.value.counts.skipped) + " 冲突跳过", 1)) : y("", !0)
				]),
				P(sr)(Z.value) && Be.value ? (O(), v(P(a), {
					key: 0,
					size: "sm",
					variant: "text",
					disabled: Ve.value,
					onClick: Et
				}, {
					default: z(() => [...t[29] ||= [S("取消任务", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (O(), v(P(a), {
					key: 1,
					size: "sm",
					variant: "text",
					onClick: t[4] ||= (e) => Z.value = null
				}, {
					default: z(() => [...t[30] ||= [S("收起", -1)]]),
					_: 1
				})),
				Z.value.errors.length ? (O(), b("span", {
					key: 2,
					class: "translation-job__error",
					title: Z.value.errors.map((e) => `${e.target_locale}: ${e.error_code}`).join("；")
				}, N(Z.value.errors[0].error_code) + "（可重新提交补翻）", 9, xr)) : y("", !0)
			])) : y("", !0),
			x("div", Sr, [(O(!0), b(g, null, fe(Ke.value, (e) => (O(), b("button", {
				key: e.code,
				type: "button",
				class: D(["language-card", {
					"is-active": _e.value === e.code,
					"is-disabled": !nt(e.code)
				}]),
				disabled: !nt(e.code),
				title: nt(e.code) ? `${e.native}：${e.done} / ${e.total}` : "请在翻译配置中启用",
				onClick: (t) => vt(e.code)
			}, [
				x("span", null, N(e.flag), 1),
				x("span", null, N(e.label), 1),
				x("strong", null, N(nt(e.code) ? P(nr)(e.done, e.total) + "%" : "未启用"), 1),
				C(P(n), {
					percentage: P(nr)(e.done, e.total),
					"show-text": !1,
					"stroke-width": 2
				}, null, 8, ["percentage"])
			], 10, Cr))), 128))]),
			x("nav", wr, [(O(!0), b(g, null, fe($e.value, (e) => (O(), b("div", {
				key: e[0].module,
				class: "module-group"
			}, [(O(!0), b(g, null, fe(e, (e) => (O(), v(P(a), {
				key: e.key,
				variant: j.value === e.key ? "primary" : "text",
				plain: j.value === e.key,
				size: "sm",
				disabled: !e.available || Ve.value,
				title: e.reason,
				"aria-pressed": j.value === e.key,
				onClick: (t) => lt(e)
			}, {
				default: z(() => [
					e.kind === "category" ? y("", !0) : (O(), v(P(f), {
						key: 0,
						name: it(e.module),
						size: 14
					}, null, 8, ["name"])),
					S(N(e.label), 1),
					x("span", Tr, N(e.count), 1)
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
			x("main", Er, [x("aside", Dr, [
				x("div", Or, [x("div", null, [x("strong", null, N(Qe.value), 1), x("span", null, N(W.value) + " 条" + N(We.value.kind === "category" ? "分类" : "内容"), 1)]), C(P(m), {
					modelValue: V.value,
					"onUpdate:modelValue": t[5] ||= (e) => V.value = e,
					size: "sm",
					clearable: "",
					placeholder: "搜索内容",
					"aria-label": "搜索内容",
					onKeydown: B(dt, ["enter"])
				}, {
					prefix: z(() => [C(P(f), {
						name: "search",
						size: 14
					})]),
					_: 1
				}, 8, ["modelValue"])]),
				x("div", {
					class: "content-browser__list",
					"aria-busy": q.value
				}, [q.value ? (O(), b("p", Ar, "加载内容中…")) : (O(), b(g, { key: 1 }, [(O(!0), b(g, null, fe(M.value, (e) => (O(), b("button", {
					key: e.id,
					type: "button",
					class: D(["content-item", { "is-selected": L.value === e.id }]),
					"aria-current": L.value === e.id ? "true" : void 0,
					disabled: Ve.value,
					onClick: (t) => ft(e.id)
				}, [x("span", Mr, [x("strong", { title: e.title }, N(e.title), 9, Nr), x("small", null, N(P(lr)[e.publish_status || ""] || "分类") + " · " + N(e.done) + "/" + N(e.total), 1)]), C(P(n), {
					type: "circle",
					percentage: P(nr)(e.done, e.total),
					"show-text": !1,
					size: 16,
					"stroke-width": 2,
					status: e.total && e.done === e.total ? "success" : "warning"
				}, null, 8, ["percentage", "status"])], 10, jr))), 128)), M.value.length ? y("", !0) : (O(), b("p", Pr, N(H.value ? "没有匹配的内容" : "暂无可翻译内容"), 1))], 64))], 8, kr),
				x("footer", Fr, [
					C(P(a), {
						size: "sm",
						"icon-only": "",
						"aria-label": "上一页",
						disabled: U.value <= 1 || q.value || Ve.value,
						onClick: t[6] ||= (e) => ut(U.value - 1)
					}, {
						default: z(() => [C(P(f), {
							name: "chevron-left",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"]),
					x("span", null, N(U.value) + " / " + N(Math.max(1, Math.ceil(W.value / 30))), 1),
					C(P(a), {
						size: "sm",
						"icon-only": "",
						"aria-label": "下一页",
						disabled: U.value * 30 >= W.value || q.value || Ve.value,
						onClick: t[7] ||= (e) => ut(U.value + 1)
					}, {
						default: z(() => [C(P(f), {
							name: "chevron-right",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"])
				])
			]), x("section", {
				class: "translation-editor",
				"aria-busy": J.value
			}, [J.value ? (O(), b("div", Lr, [C(P(f), {
				name: "loader-circle",
				size: 28
			}), t[31] ||= x("p", null, "加载译文中…", -1)])) : F.value ? (O(), b(g, { key: 1 }, [x("header", Rr, [x("div", zr, [x("span", null, [S(N(Qe.value) + " ", 1), He.value ? (O(), b("em", Br, "有未保存修改")) : y("", !0)]), x("h2", { title: F.value.title }, N(F.value.title), 9, Vr)]), C(P(te), {
				modelValue: me.value,
				"onUpdate:modelValue": t[8] ||= (e) => me.value = e
			}, {
				default: z(() => [(O(!0), b(g, null, fe(F.value.fields, (e) => (O(), v(P(d), {
					key: e.key,
					name: e.key,
					label: `${e.label} ${e.translatable ? P(or)(e) + "/" + e.translations.length : "—"}`
				}, null, 8, ["name", "label"]))), 128))]),
				_: 1
			}, 8, ["modelValue"])]), Ze.value ? (O(), b("div", {
				key: 0,
				class: "translation-editor__body",
				ref_key: "editorBody",
				ref: ve
			}, [
				x("section", Hr, [x("div", Ur, [x("strong", null, [S(N(Xe.value) + " ", 1), C(P(re), {
					size: "sm",
					type: "primary",
					effect: "soft"
				}, {
					default: z(() => [...t[32] ||= [S("内容源语言", -1)]]),
					_: 1
				})]), t[33] ||= x("span", null, "只读原文", -1)]), x("textarea", {
					value: Ze.value.source,
					readonly: "",
					rows: Ze.value.key === "body_html" ? 5 : 2,
					class: "translation-textarea source-textarea",
					"aria-label": `原文${Ze.value.label}`
				}, null, 8, Wr)]),
				x("div", Gr, [t[34] ||= x("strong", null, "目标语言", -1), x("span", null, N(F.value.fields.find((e) => e.key === me.value)?.translations.length || 0) + " 种语言 · 手工修改后请保存", 1)]),
				Ze.value.translatable ? Ze.value.translations.length ? (O(), b("div", {
					key: 2,
					class: D(["target-grid", { "is-body": me.value === "body_html" }])
				}, [(O(!0), b(g, null, fe(Ze.value.translations, (e) => (O(), b("div", {
					key: e.locale,
					class: D(["target-field", { "is-focused": _e.value === e.locale }]),
					"data-locale": e.locale
				}, [
					x("div", Yr, [x("label", { for: `translation-${me.value}-${e.locale}` }, [S(N(rt(e.locale)?.native || e.locale) + " ", 1), x("small", null, N(e.locale), 1)], 8, Xr), e.status === "stale" ? (O(), b("span", Zr, "原文已更新")) : e.status === "ready" ? (O(), b("span", Qr, N(e.method === "machine" ? "机器翻译" : "已保存"), 1)) : y("", !0)]),
					pe(x("textarea", {
						id: `translation-${me.value}-${e.locale}`,
						"onUpdate:modelValue": (t) => G.value[P(rr)(me.value, e.locale)] = t,
						class: "translation-textarea",
						rows: me.value === "body_html" ? 10 : 2,
						maxlength: Ze.value.max_length,
						disabled: !Re.value || !k.value?.space_enabled || Ve.value,
						dir: e.locale === "ar" ? "rtl" : "auto",
						placeholder: `请输入${rt(e.locale)?.native || e.locale}翻译${me.value === "body_html" ? "（HTML）" : ""}`
					}, null, 8, $r), [[I, G.value[P(rr)(me.value, e.locale)]]]),
					x("div", ei, N((G.value[P(rr)(me.value, e.locale)] || "").length.toLocaleString()) + " / " + N(Ze.value.max_length.toLocaleString()), 1)
				], 10, Jr))), 128))], 2)) : (O(), b("div", qr, " 请先在“翻译配置”中启用目标语言。 ")) : (O(), b("div", Kr, [C(P(f), {
					name: "info",
					size: 18
				}), t[35] ||= S("原文字段为空，不参与翻译和完成度统计。 ", -1)]))
			], 512)) : y("", !0)], 64)) : (O(), b("div", ti, [C(P(c), { description: X.value ? "内容加载失败，可点击刷新重试" : "选择左侧内容开始翻译" }, null, 8, ["description"]), X.value ? (O(), v(P(a), {
				key: 0,
				size: "sm",
				onClick: pt
			}, {
				default: z(() => [...t[36] ||= [S("重新加载", -1)]]),
				_: 1
			})) : y("", !0)]))], 8, Ir)]),
			C(P(se), {
				modelValue: ye.value,
				"onUpdate:modelValue": t[16] ||= (e) => ye.value = e,
				title: "翻译配置",
				subtitle: "当前内容空间共用 · Google Cloud Translation Basic v2",
				width: "560px",
				"close-on-click-modal": !1,
				"before-close": () => !Se.value && !Ce.value
			}, {
				footer: z(() => [
					C(P(a), {
						loading: Ce.value,
						disabled: !$.value?.credential_configured && !Q.value.trim() || Se.value || be.value,
						onClick: xt
					}, {
						default: z(() => [...t[43] ||= [S("测试连接", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"]),
					C(P(a), {
						disabled: Se.value || Ce.value,
						onClick: t[15] ||= (e) => ye.value = !1
					}, {
						default: z(() => [...t[44] ||= [S("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					C(P(a), {
						variant: "primary",
						loading: Se.value,
						disabled: !$.value || be.value || Ce.value,
						onClick: bt
					}, {
						default: z(() => [...t[45] ||= [S("保存翻译配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])
				]),
				default: z(() => [xe.value ? (O(), v(P(ie), {
					key: 0,
					type: "error"
				}, {
					default: z(() => [S(N(xe.value), 1)]),
					_: 1
				})) : y("", !0), be.value ? (O(), b("div", ni, "加载配置中…")) : $.value ? (O(), b("div", ri, [
					x("label", null, [t[37] ||= S(" 目标语言 ", -1), C(P(s), {
						modelValue: $.value.target_locales,
						"onUpdate:modelValue": t[9] ||= (e) => $.value.target_locales = e,
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
					C(oe, {
						modelValue: $.value.is_enabled,
						"onUpdate:modelValue": t[10] ||= (e) => $.value.is_enabled = e,
						disabled: Se.value || Ce.value,
						"credential-ready": !!$.value.credential_configured || !!Q.value.trim()
					}, null, 8, [
						"modelValue",
						"disabled",
						"credential-ready"
					]),
					x("div", ii, [
						x("label", null, [t[38] ||= S(" Google API Key ", -1), C(P(m), {
							modelValue: Q.value,
							"onUpdate:modelValue": t[11] ||= (e) => Q.value = e,
							type: "password",
							autocomplete: "new-password",
							disabled: Se.value || Ce.value,
							placeholder: $.value.credential_configured ? "已配置，留空保留原密钥；输入新密钥替换" : "请输入 Google Cloud Translation API Key"
						}, null, 8, [
							"modelValue",
							"disabled",
							"placeholder"
						])]),
						$.value.api_key_mask ? (O(), b("small", ai, N($.value.credential_source === "database" ? "数据库密钥" : "环境配置密钥") + "：" + N($.value.api_key_mask), 1)) : y("", !0),
						$.value.credential_error === "GOOGLE_CREDENTIAL_DECRYPT_FAILED" ? (O(), b("small", oi, "数据库密钥无法解密，请检查两套后台的专用加密配置，或输入新密钥替换。")) : (O(), b("small", si, "密钥加密保存，不回显原文；留空保留原值。未配置密钥时仍可人工翻译。"))
					]),
					x("div", ci, [
						x("label", null, [t[39] ||= S(" 并发上限 ", -1), C(P(l), {
							modelValue: $.value.concurrency_limit,
							"onUpdate:modelValue": t[12] ||= (e) => $.value.concurrency_limit = e,
							min: 1,
							max: 20,
							disabled: Se.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])]),
						x("label", null, [t[40] ||= S(" 请求超时（秒） ", -1), C(P(l), {
							modelValue: $.value.request_timeout_seconds,
							"onUpdate:modelValue": t[13] ||= (e) => $.value.request_timeout_seconds = e,
							min: 1,
							max: 120,
							disabled: Se.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])]),
						x("label", null, [t[41] ||= S(" 最大尝试次数 ", -1), C(P(l), {
							modelValue: $.value.max_attempts,
							"onUpdate:modelValue": t[14] ||= (e) => $.value.max_attempts = e,
							min: 1,
							max: 10,
							disabled: Se.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])])
					]),
					$.value.supported ? y("", !0) : (O(), v(P(ie), {
						key: 0,
						type: "warning"
					}, {
						default: z(() => [...t[42] ||= [S("当前空间关联了其他版本的翻译配置。保存将为该空间创建独立的 Google v2 配置，不修改其他空间。", -1)]]),
						_: 1
					}))
				])) : y("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			C(P(se), {
				modelValue: we.value,
				"onUpdate:modelValue": t[19] ||= (e) => we.value = e,
				title: Te.value === "field" ? "翻译当前字段" : "批量翻译",
				subtitle: "Google Translate · 仅补齐缺失及原文已更新的译文",
				width: "520px",
				"close-on-click-modal": !1,
				"before-close": () => !Oe.value
			}, {
				footer: z(() => [C(P(a), {
					size: "sm",
					disabled: Oe.value,
					onClick: t[18] ||= (e) => we.value = !1
				}, {
					default: z(() => [...t[47] ||= [S("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), C(P(a), {
					variant: "primary",
					size: "sm",
					loading: Oe.value,
					disabled: !Ee.value.length,
					onClick: Ct
				}, {
					default: z(() => [...t[48] ||= [S("确认翻译", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])]),
				default: z(() => [x("div", li, [
					x("p", null, N(Te.value === "field" ? `当前内容的「${Ze.value?.label}」` : `当前空间「${Qe.value}」${H.value ? "中匹配搜索条件的内容" : "全部内容"}`), 1),
					C(P(r), { label: "目标语言" }, {
						default: z(() => [C(P(s), {
							modelValue: Ee.value,
							"onUpdate:modelValue": t[17] ||= (e) => Ee.value = e,
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
					C(P(ie), { type: "warning" }, {
						default: z(() => [...t[46] ||= [S("内容将发送至 Google Translate，并可能产生翻译费用。已有有效译文不会覆盖；单次最多 200 条内容、5,000 个字段任务。后台任务需要已启动翻译 worker。", -1)]]),
						_: 1
					}),
					De.value ? (O(), v(P(ie), {
						key: 0,
						type: "error"
					}, {
						default: z(() => [S(N(De.value), 1)]),
						_: 1
					})) : y("", !0)
				])]),
				_: 1
			}, 8, [
				"modelValue",
				"title",
				"before-close"
			]),
			C(P(se), {
				modelValue: ke.value,
				"onUpdate:modelValue": t[20] ||= (e) => ke.value = e,
				title: "有未保存的翻译",
				subtitle: "切换后将丢弃当前修改，是否继续？",
				width: "380px",
				onClose: st
			}, {
				footer: z(() => [C(P(a), {
					size: "sm",
					onClick: st
				}, {
					default: z(() => [...t[49] ||= [S("继续编辑", -1)]]),
					_: 1
				}), C(P(a), {
					size: "sm",
					variant: "warning",
					onClick: ot
				}, {
					default: z(() => [...t[50] ||= [S("放弃修改并继续", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, dr));
	}
}), [["__scopeId", "data-v-1430b3cb"]]), di = {
	key: 0,
	class: "mm-cms-site"
}, fi = ["disabled"], pi = ["value"], mi = {
	key: 1,
	role: "alert"
}, hi = {
	key: 2,
	role: "status"
}, gi = { key: 3 }, _i = ["disabled"], vi = /*#__PURE__*/ h(/* @__PURE__ */ w({
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
			"news/list": rt,
			"academy/categories": dt,
			"academy/courses": Ft,
			"help/categories": Zt,
			"help/articles": vn,
			"feedback/list": On,
			"announcement/categories": In,
			"announcement/list": er,
			"localization/translations": ui
		}, r = t.runtime.mode === "white_label" && !!t.runtime.resolveSiteInRequest, i = A(!1), a = A(0), o = A([]), s = A(""), c = A(""), l = A(t.runtime.mode === "white_label" && !r), u = A(!1), d = _(() => o.value.find((e) => e.site_id === s.value)), ee = _(() => n[t.page]), te = _(() => t.runtime.hasPermission([
			"cms_news:add",
			"cms_academy:add",
			"cms_help:add",
			"cms_announcement:add"
		])), ne = new AbortController(), re = !0, ie = !1;
		function ae(e) {
			ie = !0;
			try {
				o.value = e.sites, s.value = e.site_id ?? "", i.value = !0;
			} finally {
				ie = !1;
			}
		}
		let oe = H(t.runtime, ae);
		R(s, () => {
			!r || ie || (oe.invalidate(), oe = H(t.runtime, ae, d.value?.space_id ?? null), a.value++);
		}, { flush: "sync" });
		function se(e, n) {
			if (!re || t.runtime.mode === "white_label" && d.value?.space_id !== n) throw Error("站点已切换，请重新操作");
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
		k(V, {
			get mode() {
				return t.runtime.mode;
			},
			hasPermission: (e) => t.runtime.hasPermission(e),
			formatDateTime: (e) => t.runtime.formatDateTime(e),
			registerBeforeLeave: (e) => t.runtime.registerBeforeLeave?.(e),
			get request() {
				if (r) return oe.request;
				let e = d.value?.space_id;
				return {
					get: (n, r) => t.runtime.request.get(se(n, e), r),
					post: (n, r) => t.runtime.request.post(se(n, e), r)
				};
			}
		});
		async function f() {
			let e = await t.runtime.request.get({
				url: "/cms/sites",
				signal: ne.signal
			});
			ne.signal.aborted || (o.value = e.sites, o.value.some((e) => e.site_id === s.value) || (s.value = o.value[0]?.site_id ?? ""));
		}
		async function p() {
			if (!d.value || u.value) return;
			let e = a.value;
			u.value = !0;
			try {
				let n = await t.runtime.request.post({
					url: "/cms/initialize",
					params: { site_id: d.value.site_id }
				}, { isOpenRetry: !1 });
				if (!re || r && e !== a.value) return;
				if (r) {
					if (!n.cms_context) throw Error("初始化接口未返回站点信息");
					oe.invalidate(), oe = H(t.runtime, ae, n.cms_context.space_id), ae(n.cms_context), a.value++;
				} else await f();
			} catch (e) {
				c.value = e instanceof Error ? e.message : "初始化失败";
			} finally {
				u.value = !1;
			}
		}
		return ue(async () => {
			if (t.runtime.mode === "white_label" && !r) try {
				await f();
			} catch {
				ne.signal.aborted || (c.value = "加载站点失败，请刷新重试");
			} finally {
				l.value = !1;
			}
		}), le(() => {
			re = !1, oe.invalidate(), ne.abort();
		}), (t, n) => (O(), b("section", { class: D(["mm-cms-page", { "is-viewport": e.viewport }]) }, [e.runtime.mode === "white_label" && e.showSiteSelector && (!P(r) || i.value) ? (O(), b("header", di, [x("label", null, [n[1] ||= S("内容站点 ", -1), pe(x("select", {
			"onUpdate:modelValue": n[0] ||= (e) => s.value = e,
			disabled: l.value
		}, [(O(!0), b(g, null, fe(o.value, (e) => (O(), b("option", {
			key: e.site_id,
			value: e.site_id
		}, N(e.label), 9, pi))), 128))], 8, fi), [[F, s.value]])]), n[2] ||= x("span", null, "各站点内容独立管理", -1)])) : y("", !0), c.value ? (O(), b("p", mi, N(c.value), 1)) : l.value ? (O(), b("p", hi, "正在加载站点…")) : e.runtime.mode === "white_label" && (!P(r) || i.value) && !d.value?.space_id ? (O(), b("div", gi, [x("p", null, N(d.value ? "该站点尚未初始化内容空间。" : "暂无可管理的内容站点。"), 1), d.value && te.value ? (O(), b("button", {
			key: 0,
			type: "button",
			disabled: u.value,
			onClick: p
		}, "初始化空内容空间", 8, _i)) : y("", !0)])) : (O(), v(j(ee.value), { key: `${e.page}:${e.identityKey}:${P(r) ? a.value : d.value?.space_id ?? "platform"}` }))], 2));
	}
}), [["__scopeId", "data-v-f447749a"]]);
//#endregion
//#region src/cms/permission-tree.ts
function yi(e, t, n = "", r = 0) {
	let i = e.children ?? [], a = e.type === "C" && !!(e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:")), o = t(e), s = n ? `${n} / ${o}` : o, c = a || e.type === "M" && r > 0 ? s : n;
	return [...!i.length || a ? [{
		id: e.id,
		name: a || e.type === "A" && e.perms?.startsWith("cms_") ? s : o
	}] : [], ...i.flatMap((e) => yi(e, t, c, r + 1))];
}
function bi(e, t) {
	let n = new Set(t.map(String)), r = /* @__PURE__ */ new Set(), i = [];
	function a(e) {
		let t = e.children ?? [], o = (!t.length || e.type === "C" && (e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:"))) && n.has(String(e.id));
		for (let e of t) a(e) && (o = !0);
		return o && !r.has(String(e.id)) && (r.add(String(e.id)), i.push(e.id)), !!o;
	}
	return e.forEach(a), i;
}
//#endregion
export { vi as MmCmsPage, yi as cmsPermissionItems, bi as cmsPermissionSubmission };

//# sourceMappingURL=cms.js.map