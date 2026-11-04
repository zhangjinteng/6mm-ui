import { $r as e, A as t, Jn as n, M as r, Qr as i, Sn as a, _i as o, d as s, ei as c, fi as l, hi as u, hr as ee, jr as te, mi as ne, pi as re, ti as ie, wr as ae, xn as d, yr as oe, zi as f } from "./src--cx3jFOw.js";
import { d as p, f as m, n as h, u as g } from "./Loading-NM70IAOz.js";
import { Fragment as _, computed as v, createBlock as y, createCommentVNode as b, createElementBlock as x, createElementVNode as S, createTextVNode as C, createVNode as w, defineComponent as T, inject as E, mergeProps as D, nextTick as se, normalizeClass as ce, onBeforeUnmount as le, onMounted as ue, openBlock as O, provide as k, reactive as de, ref as A, renderList as fe, resolveDynamicComponent as j, shallowRef as M, toDisplayString as N, unref as P, vModelSelect as F, vModelText as I, vShow as L, watch as R, withCtx as z, withDirectives as pe, withKeys as B, withModifiers as me } from "vue";
//#region src/cms/runtime.ts
var V = Symbol("MmCms");
function he() {
	let e = E(V);
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
var G = /* @__PURE__ */ T({
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
		return (e, t) => (O(), y(P(l), {
			effect: "soft",
			round: "",
			size: "sm",
			type: a.value
		}, {
			default: z(() => [C(N(i.value), 1)]),
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
var q = ["aria-checked", "disabled"], J = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "EnabledToggle",
	props: {
		modelValue: { type: Boolean },
		disabled: { type: Boolean }
	},
	emits: ["update:modelValue"],
	setup(e) {
		return (t, n) => (O(), x("button", {
			type: "button",
			role: "switch",
			class: ce(["news-toggle", { "is-on": e.modelValue }]),
			"aria-checked": e.modelValue,
			"aria-label": "启用状态",
			disabled: e.disabled,
			onClick: n[0] ||= (n) => t.$emit("update:modelValue", !e.modelValue)
		}, [n[1] ||= S("span", {
			class: "news-toggle__track",
			"aria-hidden": "true"
		}, [S("span")], -1), S("span", null, N(e.modelValue ? "已启用" : "已停用"), 1)], 10, q));
	}
}), [["__scopeId", "data-v-8b527db1"]]), Y = { class: "news-categories" }, X = ["aria-busy"], _e = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, ve = { class: "taxonomy-editor__field" }, Z = { class: "taxonomy-editor__row" }, ye = "分类", Q = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { newsError: t, deleteNews: n, getNewsMetadata: r, getNewsList: s, getNewsDetail: ne, saveNews: re } = K(), { hasPermission: ae } = he(), { formatDateTime: oe } = he(), m = (e) => ae([`cms_news_category:${e}`]), g = A(), _ = A(), T = W(r, (e) => {
			g.value = e;
		}), E = [
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
		], { proTableBindings: se, reload: ce, filters: k } = te({
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
		T.bindFilters(k);
		let fe = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), j = de(fe()), M = A(!1), F = A(!1), I = A(!1), L = A(!1), R = A(!1), pe = A(""), B = A(!1), V = A(""), ge = A(!1), H = v(() => !m(j.id ? "edit" : "add")), q = v(() => I.value || L.value), Q = "", be;
		async function $(e) {
			be?.abort(), be = new AbortController();
			let n = be;
			Object.assign(j, fe(), { id: e || "" }), V.value = "", R.value = !1, pe.value = "", B.value = !1, M.value = !0, F.value = !0, Q = JSON.stringify(j);
			try {
				if (_.value = await r(n.signal, { cms_source_type: "platform" }), !e || n.signal.aborted) return;
				let t = await ne("categories", e, n.signal);
				if (_.value = await r(n.signal, { space_id: String(t.space_id) }), n.signal.aborted) return;
				Object.assign(j, {
					id: t.id,
					row_version: t.row_version,
					name: t.name,
					code: t.code,
					parent_id: t.parent_id || "",
					sort_order: t.sort_order,
					is_enabled: t.is_enabled
				}), Q = JSON.stringify(j);
			} catch (e) {
				n.signal.aborted || (B.value = !0, V.value = t(e));
			} finally {
				n.signal.aborted || (F.value = !1);
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
					await re("categories", {
						name: j.name,
						parent_id: j.parent_id || null,
						sort_order: j.sort_order,
						is_enabled: j.is_enabled,
						id: j.id || void 0,
						row_version: j.id ? j.row_version : void 0
					}), M.value = !1, ie.success("保存成功"), await Promise.all([ce(), ke()]);
				} catch (e) {
					V.value = t(e);
				} finally {
					I.value = !1;
				}
			}
		}
		function Te() {
			!j.id || !m("delete") || q.value || F.value || B.value || (pe.value = "", R.value = !0);
		}
		async function Ee() {
			if (!(!R.value || !j.id || !m("delete") || q.value || F.value || B.value)) {
				L.value = !0, pe.value = "";
				try {
					await n("categories", j.id, j.row_version), R.value = !1, M.value = !1, ie.success("分类已删除"), await Promise.all([ce(), ke()]);
				} catch (e) {
					pe.value = t(e);
				} finally {
					L.value = !1;
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
				g.value = await r(Oe.signal);
			} catch {}
		}
		return ue(ke), le(() => {
			be?.abort(), Oe.abort();
		}), (e, t) => (O(), x("div", Y, [
			w(P(ee), D(P(se), {
				"auto-refreshable": !1,
				columns: E,
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
				"cell-cms_source_type": z(({ row: e }) => [w(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": z(() => [m("add") ? (O(), y(P(f), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: t[0] ||= (e) => $()
				}, {
					icon: z(() => [w(P(p), {
						name: "plus",
						size: 14
					})]),
					default: z(() => [C("新增" + N(ye))]),
					_: 1
				})) : b("", !0)]),
				"cell-is_enabled": z(({ row: e }) => [w(P(l), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: z(() => [C(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": z(({ row: e }) => [w(P(f), {
					size: "sm",
					"icon-only": "",
					title: m("edit") ? `编辑${ye}` : `${ye}详情`,
					"aria-label": `编辑${ye}`,
					onClick: (t) => $(e.id)
				}, {
					default: z(() => [w(P(p), {
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
			w(P(o), {
				modelValue: M.value,
				"onUpdate:modelValue": t[5] ||= (e) => M.value = e,
				title: `${j.id ? "编辑" : "新增"}新闻${ye}`,
				width: "680px",
				subtitle: "新闻分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": xe
			}, {
				footer: z(() => [
					j.id && m("delete") ? (O(), y(P(f), {
						key: 0,
						variant: "danger",
						disabled: F.value || B.value || q.value,
						onClick: Te
					}, {
						icon: z(() => [w(P(p), {
							name: "trash-2",
							size: 14
						})]),
						default: z(() => [t[11] ||= C("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(P(f), {
						disabled: q.value,
						onClick: Se
					}, {
						default: z(() => [...t[12] ||= [C("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					H.value ? b("", !0) : (O(), y(P(f), {
						key: 1,
						variant: "primary",
						loading: I.value,
						disabled: F.value || B.value || L.value,
						onClick: we
					}, {
						default: z(() => [C("保存" + N(ye))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: z(() => [S("div", {
					class: "taxonomy-editor",
					"aria-busy": F.value
				}, [
					F.value ? (O(), x("div", _e, [w(P(p), {
						name: "loader-circle",
						class: "news-spin",
						size: 24
					}), S("span", null, "正在读取" + N(ye) + "...")])) : b("", !0),
					V.value ? (O(), y(P(c), {
						key: 1,
						type: "error",
						closable: !1,
						description: V.value
					}, null, 8, ["description"])) : b("", !0),
					!F.value && !B.value ? (O(), y(P(a), {
						key: 2,
						model: j,
						"label-position": "top",
						onSubmit: me(we, ["prevent"])
					}, {
						default: z(() => [
							j.id ? (O(), y(P(d), {
								key: 0,
								label: "分类ID"
							}, {
								default: z(() => [w(P(h), {
									"model-value": j.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : b("", !0),
							w(P(d), {
								label: `${ye}名称`,
								required: ""
							}, {
								default: z(() => [w(P(h), {
									modelValue: j.name,
									"onUpdate:modelValue": t[1] ||= (e) => j.name = e,
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
							w(P(d), { label: "父分类" }, {
								default: z(() => [S("div", ve, [w(P(u), {
									modelValue: j.parent_id,
									"onUpdate:modelValue": t[2] ||= (e) => j.parent_id = e,
									options: De.value,
									disabled: H.value || q.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), t[10] ||= S("p", { class: "news-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类新闻。 ", -1)])]),
								_: 1
							}),
							S("div", Z, [w(P(d), {
								label: "前端排序",
								required: ""
							}, {
								default: z(() => [w(P(i), {
									modelValue: j.sort_order,
									"onUpdate:modelValue": t[3] ||= (e) => j.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: H.value || q.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), w(P(d), { label: "启用状态" }, {
								default: z(() => [w(J, {
									modelValue: j.is_enabled,
									"onUpdate:modelValue": t[4] ||= (e) => j.is_enabled = e,
									disabled: H.value || q.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : b("", !0)
				], 8, X)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			w(P(o), {
				modelValue: R.value,
				"onUpdate:modelValue": t[7] ||= (e) => R.value = e,
				title: "删除新闻分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !L.value
			}, {
				footer: z(() => [w(P(f), {
					disabled: L.value,
					onClick: t[6] ||= (e) => R.value = !1
				}, {
					default: z(() => [...t[13] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(f), {
					variant: "danger",
					loading: L.value,
					onClick: Ee
				}, {
					default: z(() => [...t[14] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: z(() => [S("p", null, "确认删除分类“" + N(j.name) + "”？有关联新闻或子分类的分类无法删除。", 1), pe.value ? (O(), y(P(c), {
					key: 0,
					type: "error",
					closable: !1,
					description: pe.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			w(P(o), {
				modelValue: ge.value,
				"onUpdate:modelValue": t[9] ||= (e) => ge.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: z(() => [w(P(f), { onClick: t[8] ||= (e) => ge.value = !1 }, {
					default: z(() => [...t[15] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(P(f), {
					variant: "primary",
					onClick: Ce
				}, {
					default: z(() => [...t[16] ||= [C("放弃修改", -1)]]),
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
	}])), ee = v(() => o.value ? xe(e, t(), n, o.value === "draft" ? "draft" : e.scheduled_local ? "scheduled" : "published", s.value) : {}), te = v(() => ({
		...c,
		...ee.value
	})), ne = v(() => Object.keys(te.value).length);
	for (let t of $) R(() => e[t], () => {
		delete c[t], l.value = "", s.value = Date.now();
	}, { deep: !0 });
	function re() {
		te.value.seo_description && a.value?.focus();
	}
	async function ie() {
		await se();
		let e = [...i.value?.querySelectorAll("[data-prop]") || []].find((e) => te.value[e.dataset.prop]);
		if (!e && te.value.seo_description) {
			r.value ? re() : r.value = !0;
			return;
		}
		e && (e.scrollIntoView({
			block: "center",
			behavior: "auto"
		}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
	}
	async function ae(e) {
		o.value = e === "draft" ? "draft" : "publish", s.value = Date.now(), l.value = "";
		for (let e of $) delete c[e];
		return ne.value ? (await ie(), !1) : !0;
	}
	function d(e) {
		let t = Se(e, n);
		Object.assign(c, t.fields), l.value = t.general;
	}
	return {
		editorRoot: i,
		seoInput: a,
		fieldRules: u,
		fieldErrors: te,
		pendingCount: ne,
		saveError: l,
		validateSave: ae,
		setSaveFailure: d,
		focusFirstError: ie,
		focusSeoError: re
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
}, Me = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "CoverFileItem",
	props: {
		url: {},
		file: {},
		disabled: { type: Boolean }
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = A(null), a = A(!1), o = A(!1), s = A(""), c, l = v(() => {
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
		R(() => [n.url, n.file], async (e, t, r) => {
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
		}), (t, n) => (O(), x("div", we, [S("div", Te, [
			S("span", Ee, [a.value ? (O(), y(P(p), {
				key: 1,
				name: "image",
				size: 20
			})) : (O(), x("img", {
				key: 0,
				src: e.url,
				alt: "封面缩略图",
				onError: n[0] ||= (e) => a.value = !0
			}, null, 40, De))]),
			S("a", {
				class: "file-name",
				href: l.value || void 0,
				download: u.value,
				title: u.value,
				"aria-busy": o.value,
				"aria-disabled": o.value || !l.value,
				onClick: me(te, ["prevent", "stop"])
			}, N(u.value), 9, Oe),
			S("span", ke, N(ee.value), 1),
			S("button", {
				class: "file-remove",
				type: "button",
				"aria-label": "移除封面",
				title: "移除封面",
				disabled: e.disabled,
				onClick: n[1] ||= me((e) => r("remove"), ["stop"])
			}, [w(P(p), {
				name: "close",
				size: 14
			})], 8, Ae)
		]), s.value ? (O(), x("span", je, N(s.value), 1)) : b("", !0)]));
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
}, ze = /*#__PURE__*/ g(/* @__PURE__ */ T({
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
		let n = e, r = t, i = A(), a = M(), o = A(!1), c = A(!1), l;
		R(() => n.modelValue, (e) => {
			c.value = !1, a.value?.url !== e && (a.value = void 0);
		});
		async function u({ file: e, signal: t }) {
			l = void 0, o.value = !0, r("busy-change", !0), r("start");
			try {
				let i = await n.upload(e, t);
				return t.aborted || (a.value = {
					url: i.url,
					file: e
				}, c.value = !1, r("update:modelValue", i.url)), i;
			} catch (e) {
				throw t.aborted || (l = { error: e }), e;
			} finally {
				o.value = !1, r("busy-change", !1);
			}
		}
		function ee() {
			se(() => i.value?.clearFiles());
		}
		function te() {
			r("success"), ee();
		}
		function ne(e, t) {
			r("error", l ? l.error : t), l = void 0, ee();
		}
		function re() {
			n.disabled || o.value || (a.value = void 0, c.value = !1, r("update:modelValue", ""));
		}
		return (t, n) => (O(), x("div", Ne, [
			w(P(s), {
				ref_key: "uploadRef",
				ref: i,
				class: "content-cover__upload",
				drag: "",
				accept: "image/jpeg,image/png,image/webp",
				limit: 1,
				"max-size": 5242880,
				disabled: e.disabled || o.value,
				request: u,
				onSuccess: te,
				onError: ne,
				onExceed: n[2] ||= (e) => r("error", /* @__PURE__ */ Error("一次只能上传一张封面图片"))
			}, {
				default: z(() => [S("div", Pe, [e.modelValue ? (O(), x("img", {
					key: 0,
					src: e.modelValue,
					alt: e.label,
					draggable: "false",
					onError: n[0] ||= (e) => c.value = !0,
					onLoad: n[1] ||= (e) => c.value = !1
				}, null, 40, Fe)) : (O(), x("div", Ie, [w(P(p), {
					name: "image",
					size: 28
				})])), e.modelValue ? b("", !0) : (O(), x("span", Le, [C(N(o.value ? "正在上传…" : "拖动图片到此处，或点击上传") + " ", 1), n[3] ||= S("span", { class: "content-cover__types" }, "JPG / PNG / WebP，最大 5 MB", -1)]))])]),
				_: 1
			}, 8, ["disabled"]),
			c.value ? (O(), x("span", Re, " 封面无法加载，请重新上传 ")) : b("", !0),
			e.modelValue ? (O(), y(Me, {
				key: 1,
				url: e.modelValue,
				file: a.value?.url === e.modelValue ? a.value.file : void 0,
				disabled: e.disabled || o.value,
				onRemove: re
			}, null, 8, [
				"url",
				"file",
				"disabled"
			])) : b("", !0)
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
}, tt = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(e, { emit: n }) {
		let { newsError: r, newsCategoryLabel: s, deleteNews: l, getNewsDetail: ee, getNewsMetadata: te, saveNews: ne, uploadNewsCover: re } = K(), { hasPermission: ae } = he(), oe = e, m = n, g = A(!0), T = A(!1), E = A(!1), D = A(""), se = A(!1), ce = A(!1), k = A(!1), fe = A(!1), j = A(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), M = A(), F = A("draft"), L = A(!1), R = v(() => ae(["cms_news:publish"])), B = v(() => !ae([`cms_news:${oe.articleId ? "edit" : "add"}`]) || !R.value && F.value !== "draft"), V = v(() => ae(["cms_news:delete"]) && (R.value || F.value === "draft"));
		async function H() {
			if (!(!V.value || T.value || g.value || E.value)) {
				T.value = !0, D.value = "";
				try {
					await l("articles", W.id, W.row_version), xe = JSON.stringify(W), ie.success("新闻已删除"), m("saved");
				} catch (e) {
					D.value = r(e), fe.value = !1;
				} finally {
					T.value = !1;
				}
			}
		}
		let U = v(() => B.value || T.value), W = de({
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
		}), { editorRoot: G, seoInput: q, fieldRules: Y, fieldErrors: X, pendingCount: _e, saveError: ve, validateSave: Z, setSaveFailure: ye, focusFirstError: Q, focusSeoError: be } = Ce(W, () => M.value?.categories || [], "news", se), $ = v(() => (M.value?.categories || []).map((e) => ({
			label: s(M.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
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
			g.value = !0, E.value = !1, D.value = "";
			try {
				if (M.value = await te(e.signal, { cms_source_type: "platform" }), oe.articleId) {
					let t = await ee("articles", oe.articleId, e.signal);
					if (M.value = await te(e.signal, { space_id: String(t.space_id) }), j.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
				e.signal.aborted || (D.value = r(t), E.value = !0);
			} finally {
				e.signal.aborted || (g.value = !1);
			}
		}
		let Ee = () => !g.value && !E.value && xe !== JSON.stringify(W);
		function De() {
			Ee() ? ce.value = !0 : m("close");
		}
		function Oe() {
			F.value === "draft" ? Ae("draft") : k.value = !0;
		}
		function ke() {
			k.value = !1, Ae("draft");
		}
		async function Ae(e) {
			if (U.value || g.value || E.value || L.value || (D.value = "", !await Z(e))) return;
			let t = W.scheduled_local ? new Date(W.scheduled_local) : null;
			T.value = !0, D.value = "";
			try {
				await ne("articles", {
					...W,
					id: W.id || void 0,
					row_version: W.id ? W.row_version : void 0,
					category_id: W.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), xe = JSON.stringify(W), ie.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "新闻已发布"), m("saved");
			} catch (e) {
				ye(e);
			} finally {
				T.value = !1;
			}
			_e.value && await Q();
		}
		function je(e) {
			D.value = r(e);
		}
		let Me = (e) => {
			Ee() && (e.preventDefault(), e.returnValue = "");
		};
		return ge(() => !T.value && !L.value && (!Ee() || window.confirm("新闻有未保存的修改，确定离开？"))), ue(() => {
			Te(), window.addEventListener("beforeunload", Me);
		}), le(() => {
			Se?.abort(), window.removeEventListener("beforeunload", Me);
		}), (n, r) => (O(), x("section", {
			ref_key: "editorRoot",
			ref: G,
			class: "article-editor",
			"aria-busy": g.value || T.value
		}, [
			S("header", Ve, [
				w(P(f), {
					"icon-only": "",
					title: "返回新闻列表",
					"aria-label": "返回新闻列表",
					disabled: T.value || L.value,
					onClick: De
				}, {
					default: z(() => [w(P(p), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				S("div", He, [S("h2", null, N(e.articleId ? "编辑新闻" : "新增新闻"), 1), S("span", null, N(M.value?.source_locale || "zh-CN") + " · " + N(j.value), 1)]),
				S("div", Ue, [
					e.articleId && V.value ? (O(), y(P(f), {
						key: 0,
						size: "sm",
						disabled: g.value || E.value || T.value || L.value,
						onClick: r[0] ||= (e) => fe.value = !0
					}, {
						default: z(() => [...r[28] ||= [C("删除新闻", -1)]]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(P(f), {
						size: "sm",
						disabled: g.value || E.value,
						onClick: r[1] ||= (e) => se.value = !0
					}, {
						icon: z(() => [w(P(p), {
							name: "search",
							size: 14
						})]),
						default: z(() => [r[29] ||= C("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					B.value ? b("", !0) : (O(), y(P(f), {
						key: 1,
						size: "sm",
						disabled: g.value || E.value || T.value || L.value,
						onClick: Oe
					}, {
						icon: z(() => [w(P(p), {
							name: "save",
							size: 14
						})]),
						default: z(() => [r[30] ||= C("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					P(ve) ? (O(), x("span", We, N(P(ve)), 1)) : b("", !0),
					!B.value && P(_e) ? (O(), x("span", Ge, "还有 " + N(P(_e)) + " 项待完善", 1)) : b("", !0),
					!B.value && R.value ? (O(), y(P(f), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: g.value || E.value || L.value,
						loading: T.value,
						onClick: r[2] ||= (e) => Ae(W.scheduled_local ? "scheduled" : "published")
					}, {
						icon: z(() => [w(P(p), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: z(() => [C(N(W.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : b("", !0)
				])
			]),
			g.value ? (O(), x("div", Ke, [w(P(p), {
				name: "loader-circle",
				class: "news-spin",
				size: 28
			}), r[31] ||= S("span", null, "正在读取新闻资料...", -1)])) : E.value ? (O(), x("div", qe, [w(P(c), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"]), w(P(f), { onClick: Te }, {
				default: z(() => [...r[32] ||= [C("重新加载", -1)]]),
				_: 1
			})])) : (O(), x(_, { key: 2 }, [D.value ? (O(), x("div", Je, [w(P(c), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"])])) : b("", !0), S("div", Ye, [S("aside", Xe, [w(P(a), {
				model: W,
				rules: P(Y),
				"label-position": "top",
				onSubmit: r[12] ||= me(() => {}, ["prevent"])
			}, {
				default: z(() => [
					w(P(d), {
						label: "新闻分类",
						prop: "category_id",
						error: P(X).category_id,
						required: ""
					}, {
						default: z(() => [w(P(u), {
							modelValue: W.category_id,
							"onUpdate:modelValue": r[3] ||= (e) => W.category_id = e,
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
					r[33] ||= S("h3", null, "新闻设置", -1),
					w(P(d), {
						label: "新闻封面",
						prop: "cover_url",
						error: P(X).cover_url
					}, {
						default: z(() => [w(ze, {
							modelValue: W.cover_url,
							"onUpdate:modelValue": r[4] ||= (e) => W.cover_url = e,
							label: "新闻封面",
							disabled: U.value,
							upload: P(re),
							onBusyChange: r[5] ||= (e) => L.value = e,
							onStart: r[6] ||= (e) => D.value = "",
							onError: je
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "内容来源",
						prop: "content_source",
						error: P(X).content_source
					}, {
						default: z(() => [w(P(h), {
							modelValue: W.content_source,
							"onUpdate:modelValue": r[7] ||= (e) => W.content_source = e,
							maxlength: 160,
							disabled: U.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "作者署名",
						prop: "author_name",
						error: P(X).author_name
					}, {
						default: z(() => [w(P(h), {
							modelValue: W.author_name,
							"onUpdate:modelValue": r[8] ||= (e) => W.author_name = e,
							maxlength: 120,
							disabled: U.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "前端排序",
						prop: "sort_order",
						error: P(X).sort_order
					}, {
						default: z(() => [w(P(i), {
							modelValue: W.sort_order,
							"onUpdate:modelValue": r[9] ||= (e) => W.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: U.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					r[34] ||= S("h3", null, "发布设置", -1),
					w(P(d), {
						label: "启用状态",
						prop: "is_enabled",
						error: P(X).is_enabled
					}, {
						default: z(() => [w(J, {
							modelValue: W.is_enabled,
							"onUpdate:modelValue": r[10] ||= (e) => W.is_enabled = e,
							disabled: U.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: P(X).scheduled_local
					}, {
						default: z(() => [w(P(h), {
							modelValue: W.scheduled_local,
							"onUpdate:modelValue": r[11] ||= (e) => W.scheduled_local = e,
							type: "datetime-local",
							disabled: U.value || !R.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					r[35] ||= S("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), S("main", Ze, [w(P(a), {
				model: W,
				rules: P(Y),
				"label-position": "top",
				onSubmit: r[16] ||= me(() => {}, ["prevent"])
			}, {
				default: z(() => [
					w(P(d), {
						label: "标题",
						prop: "title",
						error: P(X).title,
						required: ""
					}, {
						default: z(() => [w(P(h), {
							modelValue: W.title,
							"onUpdate:modelValue": r[13] ||= (e) => W.title = e,
							maxlength: 255,
							disabled: U.value,
							placeholder: "输入新闻标题",
							"aria-label": "新闻标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "摘要",
						prop: "summary",
						error: P(X).summary
					}, {
						default: z(() => [pe(S("textarea", {
							"onUpdate:modelValue": r[14] ||= (e) => W.summary = e,
							"aria-invalid": !!P(X).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: U.value,
							"aria-label": "新闻摘要"
						}, null, 8, Qe), [[I, W.summary]])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "正文",
						prop: "body_html",
						error: P(X).body_html
					}, {
						default: z(() => [w(P(t), {
							modelValue: W.body_html,
							"onUpdate:modelValue": r[15] ||= (e) => W.body_html = e,
							readonly: B.value,
							disabled: T.value,
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
			w(P(o), {
				modelValue: se.value,
				"onUpdate:modelValue": r[20] ||= (e) => se.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: z(() => [w(P(f), {
					variant: "primary",
					onClick: r[19] ||= (e) => se.value = !1
				}, {
					default: z(() => [...r[36] ||= [C("确定", -1)]]),
					_: 1
				})]),
				default: z(() => [w(P(a), {
					model: W,
					rules: P(Y),
					"label-position": "top",
					onSubmit: r[18] ||= me(() => {}, ["prevent"])
				}, {
					default: z(() => [w(P(d), {
						label: "SEO 描述",
						prop: "seo_description",
						error: P(X).seo_description
					}, {
						default: z(() => [pe(S("textarea", {
							ref_key: "seoInput",
							ref: q,
							"onUpdate:modelValue": r[17] ||= (e) => W.seo_description = e,
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
			w(P(o), {
				modelValue: fe.value,
				"onUpdate:modelValue": r[22] ||= (e) => fe.value = e,
				title: "确认删除",
				subtitle: `操作对象：${W.title || "未命名新闻"}`,
				width: "460px",
				"panel-class": "news-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !T.value
			}, {
				"header-actions": z(() => [S("span", et, [w(P(p), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: z(() => [w(P(f), {
					disabled: T.value,
					onClick: r[21] ||= (e) => fe.value = !1
				}, {
					default: z(() => [...r[37] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(f), {
					variant: "warning",
					loading: T.value,
					onClick: H
				}, {
					default: z(() => [...r[38] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: z(() => [w(P(c), {
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
			w(P(o), {
				modelValue: ce.value,
				"onUpdate:modelValue": r[25] ||= (e) => ce.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: z(() => [w(P(f), { onClick: r[23] ||= (e) => ce.value = !1 }, {
					default: z(() => [...r[39] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(P(f), {
					variant: "primary",
					onClick: r[24] ||= (e) => m("close")
				}, {
					default: z(() => [...r[40] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			w(P(o), {
				modelValue: k.value,
				"onUpdate:modelValue": r[27] ||= (e) => k.value = e,
				title: "将新闻转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: z(() => [w(P(f), { onClick: r[26] ||= (e) => k.value = !1 }, {
					default: z(() => [...r[41] ||= [C("取消", -1)]]),
					_: 1
				}), w(P(f), {
					variant: "primary",
					onClick: ke
				}, {
					default: z(() => [...r[42] ||= [C("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Be));
	}
}), [["__scopeId", "data-v-9ad8501f"]]), nt = { class: "news-articles" }, rt = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { newsPublishStates: t, newsCategoryLabel: n, getNewsList: r, getNewsMetadata: i } = K(), { hasPermission: a } = he(), { formatDateTime: o } = he(), s = A(!1), c = A(), u = (e) => a([`cms_news:${e}`]), ne = A(), re = W(i, (e) => {
			ne.value = e;
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
				formatter: (e) => n(ne.value, e)
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
		], { proTableBindings: ae, reload: d, filters: oe } = te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
				...re.fields,
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
					}, ...(ne.value?.categories || []).map((e) => ({
						label: n(ne.value, e.id),
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
		});
		re.bindFilters(oe);
		let m = new AbortController();
		async function h() {
			try {
				ne.value = await i(m.signal);
			} catch {}
		}
		function g(e) {
			c.value = e, s.value = !0;
		}
		function _() {
			s.value = !1, d(), h();
		}
		return ue(h), le(() => m.abort()), (e, n) => (O(), x("div", nt, [s.value ? (O(), y(tt, {
			key: 0,
			"article-id": c.value,
			onClose: n[0] ||= (e) => s.value = !1,
			onSaved: _
		}, null, 8, ["article-id"])) : b("", !0), pe(w(P(ee), D(P(ae), {
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
			"cell-cms_source_type": z(({ row: e }) => [w(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": z(() => [u("add") ? (O(), y(P(f), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: n[1] ||= (e) => g()
			}, {
				icon: z(() => [w(P(p), {
					name: "plus",
					size: 14
				})]),
				default: z(() => [n[2] ||= C("新增新闻", -1)]),
				_: 1
			})) : b("", !0)]),
			"cell-publish_status": z(({ row: e }) => [w(P(l), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: z(() => [C(N(P(t).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": z(({ row: e }) => [w(P(l), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: z(() => [C(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": z(({ row: e }) => [C(N(P(o)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": z(({ row: e }) => [w(P(f), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑新闻" : "新闻详情",
				"aria-label": u("edit") ? "编辑新闻" : "新闻详情",
				onClick: (t) => g(e.id)
			}, {
				default: z(() => [w(P(p), {
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
		}, 16), [[L, !s.value]])]));
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
}, st = { class: "taxonomy-editor__row" }, ct = "分类", lt = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "CategoryTable",
	setup(e) {
		let { hasPermission: t } = he(), { formatDateTime: r } = he(), { academyDifficulties: s, academyError: ne, getAcademyList: re, getAcademyMetadata: ae, getAcademyDetail: oe, saveAcademy: m, deleteAcademyCategory: g } = it(), T = (e) => t([`cms_academy_category:${e}`]), E = W(ae), se = [
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
		], { proTableBindings: ce, reload: ue, currentPage: k, pageSize: fe, total: j, filters: M } = te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: [
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
			],
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), a = await re("categories", {
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
		E.bindFilters(M);
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
		}), I = de(F()), L = A(!1), R = A(!1), pe = A(!1), B = A(!1), V = A(!1), ge = A(""), H = A(!1), K = A(""), q = A(!1), J = v(() => !T(I.id ? "edit" : "add")), Y = v(() => pe.value || B.value), X = "", _e;
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
				t.signal.aborted || (H.value = !0, K.value = ne(e));
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
					await m("categories", {
						...I,
						id: I.id || void 0,
						row_version: I.id ? I.row_version : void 0
					}), L.value = !1, ie.success("保存成功"), await ue();
				} catch (e) {
					K.value = ne(e);
				} finally {
					pe.value = !1;
				}
			}
		}
		function $() {
			!I.id || !T("delete") || Y.value || R.value || H.value || (ge.value = "", V.value = !0);
		}
		async function xe() {
			if (!(!V.value || !I.id || !T("delete") || Y.value || R.value || H.value)) {
				B.value = !0, ge.value = "";
				try {
					await g({
						id: I.id,
						row_version: I.row_version
					}), V.value = !1, L.value = !1, ie.success("分类已删除"), await ue(), k.value = Math.min(k.value, Math.max(1, Math.ceil(j.value / fe.value)));
				} catch (e) {
					ge.value = ne(e);
				} finally {
					B.value = !1;
				}
			}
		}
		return le(() => _e?.abort()), (e, t) => (O(), x(_, null, [
			w(P(ee), D(P(ce), {
				"auto-refreshable": !1,
				columns: se,
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
				"cell-cms_source_type": z(({ row: e }) => [w(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": z(() => [T("add") ? (O(), y(P(f), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: t[0] ||= (e) => ve()
				}, {
					icon: z(() => [w(P(p), {
						name: "plus",
						size: 14
					})]),
					default: z(() => [C("新增" + N(ct))]),
					_: 1
				})) : b("", !0)]),
				"cell-is_enabled": z(({ row: e }) => [w(P(l), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: z(() => [C(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": z(({ row: e }) => [w(P(f), {
					size: "sm",
					"icon-only": "",
					title: T("edit") ? `编辑${ct}` : `${ct}详情`,
					"aria-label": `编辑${ct}`,
					onClick: (t) => ve(e.id)
				}, {
					default: z(() => [w(P(p), {
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
			w(P(o), {
				modelValue: L.value,
				"onUpdate:modelValue": t[5] ||= (e) => L.value = e,
				title: `${I.id ? "编辑" : "新增"}课程${ct}`,
				width: "620px",
				"close-on-click-modal": !1,
				"before-close": Z
			}, {
				footer: z(() => [
					I.id && T("delete") ? (O(), y(P(f), {
						key: 0,
						variant: "danger",
						disabled: R.value || H.value || Y.value,
						onClick: $
					}, {
						icon: z(() => [w(P(p), {
							name: "trash-2",
							size: 14
						})]),
						default: z(() => [t[10] ||= C("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(P(f), {
						disabled: Y.value,
						onClick: ye
					}, {
						default: z(() => [...t[11] ||= [C("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					J.value ? b("", !0) : (O(), y(P(f), {
						key: 1,
						variant: "primary",
						loading: pe.value,
						disabled: R.value || H.value || B.value,
						onClick: be
					}, {
						default: z(() => [C("保存" + N(ct))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: z(() => [S("div", {
					class: "taxonomy-editor",
					"aria-busy": R.value
				}, [
					R.value ? (O(), x("div", ot, [w(P(p), {
						name: "loader-circle",
						class: "academy-spin",
						size: 24
					}), S("span", null, "正在读取" + N(ct) + "...")])) : b("", !0),
					K.value ? (O(), y(P(c), {
						key: 1,
						type: "error",
						closable: !1,
						description: K.value
					}, null, 8, ["description"])) : b("", !0),
					!R.value && !H.value ? (O(), y(P(a), {
						key: 2,
						model: I,
						"label-position": "top",
						onSubmit: me(be, ["prevent"])
					}, {
						default: z(() => [
							w(P(d), {
								label: `${ct}名称`,
								required: ""
							}, {
								default: z(() => [w(P(h), {
									modelValue: I.name,
									"onUpdate:modelValue": t[1] ||= (e) => I.name = e,
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
							w(P(d), {
								label: "适用难度",
								required: ""
							}, {
								default: z(() => [w(P(u), {
									modelValue: I.difficulty_levels,
									"onUpdate:modelValue": t[2] ||= (e) => I.difficulty_levels = e,
									multiple: "",
									options: P(s),
									disabled: J.value || Y.value,
									"aria-label": "适用难度"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								])]),
								_: 1
							}),
							S("div", st, [w(P(d), {
								label: "前端排序",
								required: ""
							}, {
								default: z(() => [w(P(i), {
									modelValue: I.sort_order,
									"onUpdate:modelValue": t[3] ||= (e) => I.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: J.value || Y.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), w(P(d), { label: "启用状态" }, {
								default: z(() => [w(P(n), {
									modelValue: I.is_enabled,
									"onUpdate:modelValue": t[4] ||= (e) => I.is_enabled = e,
									disabled: J.value || Y.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : b("", !0)
				], 8, at)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			w(P(o), {
				modelValue: V.value,
				"onUpdate:modelValue": t[7] ||= (e) => V.value = e,
				title: "删除课程分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !B.value
			}, {
				footer: z(() => [w(P(f), {
					disabled: B.value,
					onClick: t[6] ||= (e) => V.value = !1
				}, {
					default: z(() => [...t[12] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(f), {
					variant: "danger",
					loading: B.value,
					onClick: xe
				}, {
					default: z(() => [...t[13] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: z(() => [S("p", null, "确认删除分类“" + N(I.name) + "”？有关联课程的分类无法删除。", 1), ge.value ? (O(), y(P(c), {
					key: 0,
					type: "error",
					closable: !1,
					description: ge.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			w(P(o), {
				modelValue: q.value,
				"onUpdate:modelValue": t[9] ||= (e) => q.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: z(() => [w(P(f), { onClick: t[8] ||= (e) => q.value = !1 }, {
					default: z(() => [...t[14] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(P(f), {
					variant: "primary",
					onClick: Q
				}, {
					default: z(() => [...t[15] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 64));
	}
}), [["__scopeId", "data-v-b7830575"]]), ut = { class: "academy-categories" }, dt = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		return (e, t) => (O(), x("div", ut, [w(lt)]));
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
}, Nt = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "CourseEditor",
	props: { courseId: {} },
	emits: ["close", "saved"],
	setup(e, { emit: r }) {
		let { hasPermission: s } = he(), { academyDifficulties: l, academyError: ee, deleteAcademyCourse: te, getAcademyDetail: ne, getAcademyMetadata: re, saveAcademy: ae, uploadAcademyCover: oe } = it(), m = e, g = r, _ = A(!0), T = A(!1), E = A(!1), D = A(""), ce = A(!1), k = A(!1), fe = A(!1), j = A(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), M = A(), F = A("draft"), L = A(!1), B = A(!1), V = A(""), H = v(() => s(["cms_academy:publish"])), U = v(() => !!m.courseId && s(["cms_academy:delete"]) && (H.value || F.value === "draft")), W = v(() => !s([`cms_academy:${m.courseId ? "edit" : "add"}`]) || !H.value && F.value !== "draft"), G = v(() => W.value || T.value), K = de({
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
		}])), ye = v(() => Y.value ? ht(K, M.value?.categories || [], Y.value === "draft" ? "draft" : K.scheduled_local ? "scheduled" : "published", X.value) : {}), Q = v(() => ({
			..._e,
			...ye.value
		})), be = v(() => Object.keys(Q.value).length);
		for (let e of ft) R(() => K[e], () => {
			delete _e[e], e === "category_ids" && delete _e.difficulty_level, ve.value = "", X.value = Date.now();
		}, { deep: !0 });
		function $() {
			Q.value.seo_description && J.value?.focus();
		}
		async function xe() {
			await se();
			let e = [...q.value?.querySelectorAll("[data-prop]") || []].find((e) => Q.value[e.dataset.prop]);
			if (!e && Q.value.seo_description) {
				ce.value ? $() : ce.value = !0;
				return;
			}
			e && (e.scrollIntoView({
				block: "center",
				behavior: "auto"
			}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
		}
		let Se = v(() => (M.value?.categories || []).map((e) => ({
			label: e.name + (e.is_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.is_enabled
		}))), Ce = v(() => {
			let e = (M.value?.categories || []).filter((e) => K.category_ids.includes(e.id));
			return l.map((t) => ({
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
			_.value = !0, E.value = !1, D.value = "";
			try {
				if (M.value = await re(e.signal, { cms_source_type: "platform" }), m.courseId) {
					let t = await ne("courses", m.courseId, e.signal);
					if (M.value = await re(e.signal, { space_id: String(t.space_id) }), j.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
				e.signal.aborted || (D.value = ee(t), E.value = !0);
			} finally {
				e.signal.aborted || (_.value = !1);
			}
		}
		let Oe = () => !_.value && !E.value && we !== JSON.stringify(K);
		function ke() {
			Oe() ? k.value = !0 : g("close");
		}
		function Ae() {
			F.value === "draft" ? Me("draft") : fe.value = !0;
		}
		function je() {
			fe.value = !1, Me("draft");
		}
		async function Me(e) {
			if (G.value || _.value || E.value || L.value) return;
			Y.value = e === "draft" ? "draft" : "publish", X.value = Date.now(), ve.value = "";
			for (let e of ft) delete _e[e];
			if (be.value) {
				await xe();
				return;
			}
			let t = K.scheduled_local ? new Date(K.scheduled_local) : null;
			T.value = !0, D.value = "";
			try {
				await ae("courses", {
					...K,
					id: K.id || void 0,
					row_version: K.id ? K.row_version : void 0,
					difficulty_level: K.difficulty_level || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), we = JSON.stringify(K), ie.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "课程已发布"), g("saved");
			} catch (e) {
				let t = _t(e);
				Object.assign(_e, t.fields), ve.value = t.general;
			} finally {
				T.value = !1;
			}
			be.value && await xe();
		}
		function Ne() {
			V.value = "", B.value = !0;
		}
		async function Pe() {
			if (!(!U.value || _.value || E.value || T.value || L.value)) {
				T.value = !0, V.value = "";
				try {
					await te({
						id: K.id,
						row_version: K.row_version
					}), we = JSON.stringify(K), B.value = !1, ie.success("课程已删除"), g("saved");
				} catch (e) {
					V.value = ee(e);
				} finally {
					T.value = !1;
				}
			}
		}
		function Fe(e) {
			_e.cover_url = ee(e);
		}
		function Ie() {
			delete _e.cover_url;
		}
		let Le = (e) => {
			Oe() && (e.preventDefault(), e.returnValue = "");
		};
		return ge(() => !T.value && !L.value && (!Oe() || window.confirm("课程有未保存的修改，确定离开？"))), ue(() => {
			De(), window.addEventListener("beforeunload", Le);
		}), le(() => {
			Te?.abort(), window.removeEventListener("beforeunload", Le);
		}), (r, s) => (O(), x("section", {
			ref_key: "editorRoot",
			ref: q,
			class: "course-editor",
			"aria-busy": _.value || T.value
		}, [
			S("header", yt, [
				w(P(f), {
					"icon-only": "",
					title: "返回课程列表",
					"aria-label": "返回课程列表",
					disabled: T.value || L.value,
					onClick: ke
				}, {
					default: z(() => [w(P(p), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				S("div", bt, [S("h2", null, N(e.courseId ? "编辑课程" : "新增课程"), 1), S("span", null, N(M.value?.source_locale || "zh-CN") + " · " + N(j.value), 1)]),
				S("div", xt, [
					U.value ? (O(), y(P(f), {
						key: 0,
						variant: "danger",
						size: "sm",
						disabled: _.value || E.value || T.value || L.value,
						onClick: Ne
					}, {
						default: z(() => [...s[27] ||= [C("删除课程", -1)]]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(P(f), {
						size: "sm",
						disabled: _.value || E.value,
						onClick: s[0] ||= (e) => ce.value = !0
					}, {
						icon: z(() => [w(P(p), {
							name: "search",
							size: 14
						})]),
						default: z(() => [s[28] ||= C("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					W.value ? b("", !0) : (O(), y(P(f), {
						key: 1,
						size: "sm",
						disabled: _.value || E.value || T.value || L.value,
						onClick: Ae
					}, {
						icon: z(() => [w(P(p), {
							name: "save",
							size: 14
						})]),
						default: z(() => [s[29] ||= C("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					ve.value ? (O(), x("span", St, N(ve.value), 1)) : b("", !0),
					W.value ? b("", !0) : (O(), x("div", Ct, [be.value ? (O(), x("span", wt, "还有 " + N(be.value) + " 项待完善", 1)) : b("", !0), H.value ? (O(), y(P(f), {
						key: 1,
						variant: "primary",
						size: "sm",
						disabled: _.value || E.value || L.value,
						loading: T.value,
						onClick: s[1] ||= (e) => Me(K.scheduled_local ? "scheduled" : "published")
					}, {
						icon: z(() => [w(P(p), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: z(() => [C(N(K.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : b("", !0)]))
				])
			]),
			_.value ? (O(), x("div", Tt, [w(P(p), {
				name: "loader-circle",
				class: "academy-spin",
				size: 28
			}), s[30] ||= S("span", null, "正在读取课程资料...", -1)])) : E.value ? (O(), x("div", Et, [w(P(c), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"]), w(P(f), { onClick: De }, {
				default: z(() => [...s[31] ||= [C("重新加载", -1)]]),
				_: 1
			})])) : (O(), x("div", Dt, [S("aside", Ot, [w(P(a), {
				model: K,
				rules: P(Z),
				"label-position": "top",
				onSubmit: s[11] ||= me(() => {}, ["prevent"])
			}, {
				default: z(() => [
					w(P(d), {
						label: "课程分类",
						prop: "category_ids",
						error: Q.value.category_ids,
						required: ""
					}, {
						default: z(() => [w(P(u), {
							modelValue: K.category_ids,
							"onUpdate:modelValue": s[2] ||= (e) => K.category_ids = e,
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
					s[32] ||= S("h3", null, "课程设置", -1),
					w(P(d), {
						label: "课程封面",
						prop: "cover_url",
						error: Q.value.cover_url
					}, {
						default: z(() => [w(ze, {
							modelValue: K.cover_url,
							"onUpdate:modelValue": s[3] ||= (e) => K.cover_url = e,
							label: "课程封面",
							disabled: G.value,
							upload: P(oe),
							onBusyChange: s[4] ||= (e) => L.value = e,
							onStart: s[5] ||= (e) => D.value = "",
							onError: Fe,
							onSuccess: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "课程难度",
						prop: "difficulty_level",
						error: Q.value.difficulty_level
					}, {
						default: z(() => [w(P(u), {
							modelValue: K.difficulty_level,
							"onUpdate:modelValue": s[6] ||= (e) => K.difficulty_level = e,
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
					w(P(d), {
						label: "预计课时(分钟)",
						prop: "estimated_minutes",
						error: Q.value.estimated_minutes
					}, {
						default: z(() => [w(P(i), {
							modelValue: K.estimated_minutes,
							"onUpdate:modelValue": s[7] ||= (e) => K.estimated_minutes = e,
							min: 1,
							max: 1e5,
							precision: 0,
							disabled: G.value,
							"aria-label": "预计课时"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "前端排序",
						prop: "sort_order",
						error: Q.value.sort_order
					}, {
						default: z(() => [w(P(i), {
							modelValue: K.sort_order,
							"onUpdate:modelValue": s[8] ||= (e) => K.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: G.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					s[33] ||= S("h3", null, "发布设置", -1),
					w(P(d), {
						label: "启用状态",
						prop: "is_enabled",
						error: Q.value.is_enabled
					}, {
						default: z(() => [w(P(n), {
							modelValue: K.is_enabled,
							"onUpdate:modelValue": s[9] ||= (e) => K.is_enabled = e,
							disabled: G.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "计划发布时间",
						prop: "scheduled_local",
						error: Q.value.scheduled_local
					}, {
						default: z(() => [w(P(h), {
							modelValue: K.scheduled_local,
							"onUpdate:modelValue": s[10] ||= (e) => K.scheduled_local = e,
							type: "datetime-local",
							disabled: G.value || !H.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])]), S("main", kt, [w(P(a), {
				model: K,
				rules: P(Z),
				"label-position": "top",
				onSubmit: s[15] ||= me(() => {}, ["prevent"])
			}, {
				default: z(() => [
					w(P(d), {
						label: "标题",
						prop: "title",
						error: Q.value.title,
						required: ""
					}, {
						default: z(() => [w(P(h), {
							modelValue: K.title,
							"onUpdate:modelValue": s[12] ||= (e) => K.title = e,
							maxlength: 255,
							disabled: G.value,
							placeholder: "输入课程标题",
							"aria-label": "课程标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "摘要",
						prop: "summary",
						error: Q.value.summary
					}, {
						default: z(() => [pe(S("textarea", {
							"onUpdate:modelValue": s[13] ||= (e) => K.summary = e,
							class: "course-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: G.value,
							"aria-invalid": !!Q.value.summary,
							"aria-label": "课程摘要"
						}, null, 8, At), [[I, K.summary]])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "正文",
						prop: "body_html",
						error: Q.value.body_html
					}, {
						default: z(() => [w(P(t), {
							modelValue: K.body_html,
							"onUpdate:modelValue": s[14] ||= (e) => K.body_html = e,
							readonly: W.value,
							disabled: T.value,
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
			w(P(o), {
				modelValue: ce.value,
				"onUpdate:modelValue": s[19] ||= (e) => ce.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1,
				onOpened: $
			}, {
				footer: z(() => [w(P(f), {
					variant: "primary",
					onClick: s[18] ||= (e) => ce.value = !1
				}, {
					default: z(() => [...s[34] ||= [C("确定", -1)]]),
					_: 1
				})]),
				default: z(() => [w(P(a), {
					model: K,
					rules: P(Z),
					"label-position": "top",
					onSubmit: s[17] ||= me(() => {}, ["prevent"])
				}, {
					default: z(() => [w(P(d), {
						label: "SEO 描述",
						prop: "seo_description",
						error: Q.value.seo_description
					}, {
						default: z(() => [pe(S("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": s[16] ||= (e) => K.seo_description = e,
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
			w(P(o), {
				modelValue: B.value,
				"onUpdate:modelValue": s[21] ||= (e) => B.value = e,
				title: "确认删除",
				subtitle: `操作对象：${K.title || "未命名课程"}`,
				width: "460px",
				"panel-class": "course-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !T.value
			}, {
				"header-actions": z(() => [S("span", Mt, [w(P(p), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: z(() => [w(P(f), {
					disabled: T.value,
					onClick: s[20] ||= (e) => B.value = !1
				}, {
					default: z(() => [...s[35] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(f), {
					variant: "warning",
					loading: T.value,
					onClick: Pe
				}, {
					default: z(() => [...s[36] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: z(() => [w(P(c), {
					class: "course-delete-dialog__notice",
					type: "warning",
					closable: !1,
					"show-icon": !1,
					description: "确定删除这门课程吗？删除后将不再展示，请谨慎操作。"
				}), V.value ? (O(), y(P(c), {
					key: 0,
					type: "error",
					closable: !1,
					description: V.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, [
				"modelValue",
				"subtitle",
				"before-close"
			]),
			w(P(o), {
				modelValue: k.value,
				"onUpdate:modelValue": s[24] ||= (e) => k.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: z(() => [w(P(f), { onClick: s[22] ||= (e) => k.value = !1 }, {
					default: z(() => [...s[37] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(P(f), {
					variant: "primary",
					onClick: s[23] ||= (e) => g("close")
				}, {
					default: z(() => [...s[38] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			w(P(o), {
				modelValue: fe.value,
				"onUpdate:modelValue": s[26] ||= (e) => fe.value = e,
				title: "将课程转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: z(() => [w(P(f), { onClick: s[25] ||= (e) => fe.value = !1 }, {
					default: z(() => [...s[39] ||= [C("取消", -1)]]),
					_: 1
				}), w(P(f), {
					variant: "primary",
					onClick: je
				}, {
					default: z(() => [...s[40] ||= [C("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, vt));
	}
}), [["__scopeId", "data-v-4bde73b0"]]), Pt = { class: "academy-courses" }, Ft = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = he(), { formatDateTime: n } = he(), { academyDifficulties: r, academyPublishStates: i, getAcademyList: a, getAcademyMetadata: o } = it(), s = A(!1), c = A(), u = (e) => t([`cms_academy:${e}`]), ne = A(), re = W(o, (e) => {
			ne.value = e;
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
				formatter: (e) => r.find((t) => t.value === Number(e))?.label || "-"
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
		], { proTableBindings: ae, reload: d, filters: oe } = te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
				...re.fields,
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
					}, ...(ne.value?.categories || []).map((e) => ({
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
			]),
			request: async ({ filters: e, page: t, pageSize: n, signal: r }) => {
				let i = Object.fromEntries(Object.entries(e).filter(([e, t]) => e !== "publish_range" && t !== "" && t != null)), o = e.publish_range;
				Array.isArray(o) && o.length === 2 && (i.published_from = (/* @__PURE__ */ new Date(`${o[0]}T00:00:00`)).toISOString(), i.published_to = (/* @__PURE__ */ new Date(`${o[1]}T23:59:59.999`)).toISOString());
				let s = await a("courses", {
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
		re.bindFilters(oe);
		let m = new AbortController();
		async function h() {
			try {
				ne.value = await o(m.signal);
			} catch {}
		}
		function g(e) {
			c.value = e, s.value = !0;
		}
		function _() {
			s.value = !1, d(), h();
		}
		return ue(h), le(() => m.abort()), (e, t) => (O(), x("div", Pt, [s.value ? (O(), y(Nt, {
			key: 0,
			"course-id": c.value,
			onClose: t[0] ||= (e) => s.value = !1,
			onSaved: _
		}, null, 8, ["course-id"])) : b("", !0), pe(w(P(ee), D(P(ae), {
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
			"cell-cms_source_type": z(({ row: e }) => [w(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": z(() => [u("add") ? (O(), y(P(f), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => g()
			}, {
				icon: z(() => [w(P(p), {
					name: "plus",
					size: 14
				})]),
				default: z(() => [t[2] ||= C("新增课程", -1)]),
				_: 1
			})) : b("", !0)]),
			"cell-publish_status": z(({ row: e }) => [w(P(l), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: z(() => [C(N(P(i).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": z(({ row: e }) => [w(P(l), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: z(() => [C(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": z(({ row: e }) => [C(N(P(n)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": z(({ row: e }) => [w(P(f), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑课程" : "课程详情",
				"aria-label": u("edit") ? "编辑课程" : "课程详情",
				onClick: (t) => g(e.id)
			}, {
				default: z(() => [w(P(p), {
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
		}, 16), [[L, !s.value]])]));
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
var Lt = ["aria-checked", "disabled"], Rt = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "EnabledToggle",
	props: {
		modelValue: { type: Boolean },
		disabled: { type: Boolean }
	},
	emits: ["update:modelValue"],
	setup(e) {
		return (t, n) => (O(), x("button", {
			type: "button",
			role: "switch",
			class: ce(["help-toggle", { "is-on": e.modelValue }]),
			"aria-checked": e.modelValue,
			"aria-label": "启用状态",
			disabled: e.disabled,
			onClick: n[0] ||= (n) => t.$emit("update:modelValue", !e.modelValue)
		}, [n[1] ||= S("span", {
			class: "help-toggle__track",
			"aria-hidden": "true"
		}, [S("span")], -1), S("span", null, N(e.modelValue ? "已启用" : "已停用"), 1)], 10, Lt));
	}
}), [["__scopeId", "data-v-5cfe8693"]]), zt = { class: "help-categories" }, Bt = ["aria-busy"], Vt = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Ht = { class: "taxonomy-editor__field" }, Ut = { class: "taxonomy-editor__field" }, Wt = { class: "taxonomy-editor__icon-control" }, Gt = ["title"], Kt = ["aria-label"], qt = { key: 1 }, Jt = {
	key: 0,
	class: "help-hint"
}, Yt = { class: "taxonomy-editor__row" }, Xt = "分类", Zt = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { helpError: t, deleteHelp: n, getHelpMetadata: r, getHelpList: s, getHelpDetail: ne, saveHelp: re } = It(), { hasPermission: oe } = he(), { formatDateTime: g } = he(), _ = (e) => oe([`cms_help_category:${e}`]), T = A(), E = A(), se = W(r, (e) => {
			T.value = e;
		}), ce = [
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
				formatter: g
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], { proTableBindings: k, reload: fe, filters: j } = te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
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
			]),
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
		se.bindFilters(j);
		let M = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			icon_key: "",
			sort_order: 10,
			is_enabled: !0
		}), F = de(M()), I = [...m], L = new Set(I), R = v(() => L.has(F.icon_key) ? F.icon_key : void 0), pe = A(!1), B = A(!1), V = A(!1), ge = A(!1), H = A(!1), K = A(""), q = A(!1), J = A(""), Y = v(() => !_(F.id ? "edit" : "add")), X = v(() => V.value || ge.value), _e;
		async function ve(e) {
			_e?.abort(), _e = new AbortController();
			let n = _e;
			Object.assign(F, M(), { id: e || "" }), J.value = "", H.value = !1, K.value = "", q.value = !1, pe.value = !0, B.value = !0;
			try {
				if (E.value = await r(n.signal, { cms_source_type: "platform" }), !e || n.signal.aborted) return;
				let t = await ne("categories", e, n.signal);
				if (E.value = await r(n.signal, { space_id: String(t.space_id) }), n.signal.aborted) return;
				Object.assign(F, {
					id: t.id,
					row_version: t.row_version,
					name: t.name,
					code: t.code,
					parent_id: t.parent_id || "",
					icon_key: t.icon_key || "",
					sort_order: t.sort_order,
					is_enabled: t.is_enabled
				});
			} catch (e) {
				n.signal.aborted || (q.value = !0, J.value = t(e));
			} finally {
				n.signal.aborted || (B.value = !1);
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
					await re("categories", {
						name: F.name,
						parent_id: F.parent_id || null,
						icon_key: F.icon_key || null,
						sort_order: F.sort_order,
						is_enabled: F.is_enabled,
						id: F.id || void 0,
						row_version: F.id ? F.row_version : void 0
					}), pe.value = !1, ie.success("保存成功"), await Promise.all([fe(), Ce()]);
				} catch (e) {
					J.value = t(e);
				} finally {
					V.value = !1;
				}
			}
		}
		function be() {
			!F.id || !_("delete") || X.value || B.value || q.value || (K.value = "", H.value = !0);
		}
		async function $() {
			if (!(!H.value || !F.id || !_("delete") || X.value || B.value || q.value)) {
				ge.value = !0, K.value = "";
				try {
					await n("categories", F.id, F.row_version), H.value = !1, pe.value = !1, ie.success("分类已删除"), await Promise.all([fe(), Ce()]);
				} catch (e) {
					K.value = t(e);
				} finally {
					ge.value = !1;
				}
			}
		}
		let xe = v(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(E.value?.categories || []).filter((e) => !e.parent_id && e.id !== F.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Se = new AbortController();
		async function Ce() {
			try {
				T.value = await r(Se.signal);
			} catch {}
		}
		return ue(Ce), le(() => {
			_e?.abort(), Se.abort();
		}), (e, t) => (O(), x("div", zt, [
			w(P(ee), D(P(k), {
				"auto-refreshable": !1,
				columns: ce,
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
				"cell-cms_source_type": z(({ row: e }) => [w(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": z(() => [_("add") ? (O(), y(P(f), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: t[0] ||= (e) => ve()
				}, {
					icon: z(() => [w(P(p), {
						name: "plus",
						size: 14
					})]),
					default: z(() => [C("新增" + N(Xt))]),
					_: 1
				})) : b("", !0)]),
				"cell-is_enabled": z(({ row: e }) => [w(P(l), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: z(() => [C(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": z(({ row: e }) => [w(P(f), {
					size: "sm",
					"icon-only": "",
					title: _("edit") ? `编辑${Xt}` : `${Xt}详情`,
					"aria-label": `编辑${Xt}`,
					onClick: (t) => ve(e.id)
				}, {
					default: z(() => [w(P(p), {
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
			w(P(o), {
				modelValue: pe.value,
				"onUpdate:modelValue": t[6] ||= (e) => pe.value = e,
				title: `${F.id ? "编辑" : "新增"}帮助${Xt}`,
				width: "680px",
				subtitle: "帮助分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Z
			}, {
				footer: z(() => [
					F.id && _("delete") ? (O(), y(P(f), {
						key: 0,
						variant: "danger",
						disabled: B.value || q.value || X.value,
						onClick: be
					}, {
						icon: z(() => [w(P(p), {
							name: "trash-2",
							size: 14
						})]),
						default: z(() => [t[11] ||= C("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(P(f), {
						disabled: X.value,
						onClick: ye
					}, {
						default: z(() => [...t[12] ||= [C("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Y.value ? b("", !0) : (O(), y(P(f), {
						key: 1,
						variant: "primary",
						loading: V.value,
						disabled: B.value || q.value || ge.value,
						onClick: Q
					}, {
						default: z(() => [C("保存" + N(Xt))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: z(() => [S("div", {
					class: "taxonomy-editor",
					"aria-busy": B.value
				}, [
					B.value ? (O(), x("div", Vt, [w(P(p), {
						name: "loader-circle",
						class: "help-spin",
						size: 24
					}), S("span", null, "正在读取" + N(Xt) + "...")])) : b("", !0),
					J.value ? (O(), y(P(c), {
						key: 1,
						type: "error",
						closable: !1,
						description: J.value
					}, null, 8, ["description"])) : b("", !0),
					!B.value && !q.value ? (O(), y(P(a), {
						key: 2,
						model: F,
						"label-position": "top",
						onSubmit: me(Q, ["prevent"])
					}, {
						default: z(() => [
							F.id ? (O(), y(P(d), {
								key: 0,
								label: "分类ID"
							}, {
								default: z(() => [w(P(h), {
									"model-value": F.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : b("", !0),
							w(P(d), {
								label: `${Xt}名称`,
								required: ""
							}, {
								default: z(() => [w(P(h), {
									modelValue: F.name,
									"onUpdate:modelValue": t[1] ||= (e) => F.name = e,
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
							w(P(d), { label: "父分类" }, {
								default: z(() => [S("div", Ht, [w(P(u), {
									modelValue: F.parent_id,
									"onUpdate:modelValue": t[2] ||= (e) => F.parent_id = e,
									options: xe.value,
									disabled: Y.value || X.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), t[9] ||= S("p", { class: "help-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类文章。 ", -1)])]),
								_: 1
							}),
							w(P(d), { label: "图标标识" }, {
								default: z(() => [S("div", Ut, [
									S("div", Wt, [w(P(ae), {
										modelValue: F.icon_key,
										"onUpdate:modelValue": t[3] ||= (e) => F.icon_key = e,
										suggestions: I,
										"min-length": 0,
										disabled: Y.value || X.value,
										clearable: "",
										placeholder: "输入或下拉选择 6mm 图标，例如 circle-help"
									}, {
										option: z(({ option: e }) => [S("span", {
											class: "taxonomy-editor__icon-option",
											title: String(e)
										}, [w(P(p), {
											name: String(e),
											size: 18
										}, null, 8, ["name"]), S("span", null, N(e), 1)], 8, Gt)]),
										_: 1
									}, 8, ["modelValue", "disabled"]), S("span", {
										class: "taxonomy-editor__icon-preview",
										role: "img",
										"aria-label": R.value ? `图标预览：${R.value}` : "暂无图标预览"
									}, [R.value ? (O(), y(P(p), {
										key: 0,
										name: R.value,
										size: 20
									}, null, 8, ["name"])) : (O(), x("span", qt, "—"))], 8, Kt)]),
									t[10] ||= S("p", { class: "help-hint" }, " 支持直接输入名称或从下拉列表选择；不填写 SVG 或 HTML。 ", -1),
									F.icon_key && !R.value ? (O(), x("p", Jt, " 当前名称不在已安装的 6mm 图标库中，暂无法预览。 ")) : b("", !0)
								])]),
								_: 1
							}),
							S("div", Yt, [w(P(d), {
								label: "前端排序",
								required: ""
							}, {
								default: z(() => [w(P(i), {
									modelValue: F.sort_order,
									"onUpdate:modelValue": t[4] ||= (e) => F.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Y.value || X.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), w(P(d), { label: "启用状态" }, {
								default: z(() => [w(Rt, {
									modelValue: F.is_enabled,
									"onUpdate:modelValue": t[5] ||= (e) => F.is_enabled = e,
									disabled: Y.value || X.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : b("", !0)
				], 8, Bt)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			w(P(o), {
				modelValue: H.value,
				"onUpdate:modelValue": t[8] ||= (e) => H.value = e,
				title: "删除帮助分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !ge.value
			}, {
				footer: z(() => [w(P(f), {
					disabled: ge.value,
					onClick: t[7] ||= (e) => H.value = !1
				}, {
					default: z(() => [...t[13] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(f), {
					variant: "danger",
					loading: ge.value,
					onClick: $
				}, {
					default: z(() => [...t[14] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: z(() => [S("p", null, "确认删除分类“" + N(F.name) + "”？有关联文章或子分类的分类无法删除。", 1), K.value ? (O(), y(P(c), {
					key: 0,
					type: "error",
					closable: !1,
					description: K.value
				}, null, 8, ["description"])) : b("", !0)]),
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
}, hn = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(e, { emit: n }) {
		let { helpError: r, helpCategoryLabel: s, deleteHelp: l, getHelpDetail: ee, getHelpMetadata: te, getHelpList: ne, saveHelp: re, uploadHelpCover: ae } = It(), { hasPermission: oe } = he(), m = e, g = n, T = A(!0), E = A(!1), D = A(!1), se = A(""), ce = A(!1), k = A(!1), fe = A(!1), j = A(!1), M = A(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), F = A(), L = A("draft"), R = A(!1), V = v(() => oe(["cms_help:publish"])), H = v(() => !oe([`cms_help:${m.articleId ? "edit" : "add"}`]) || !V.value && L.value !== "draft"), U = v(() => oe(["cms_help:delete"]) && (V.value || L.value === "draft"));
		async function W() {
			if (!(!U.value || E.value || T.value || D.value)) {
				E.value = !0, se.value = "";
				try {
					await l("articles", K.id, K.row_version), De = JSON.stringify(K), ie.success("文章已删除"), g("saved");
				} catch (e) {
					se.value = r(e), j.value = !1;
				} finally {
					E.value = !1;
				}
			}
		}
		let G = v(() => H.value || E.value), K = de({
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
		}), { editorRoot: q, seoInput: J, fieldRules: Y, fieldErrors: X, pendingCount: _e, saveError: ve, validateSave: Z, setSaveFailure: ye, focusFirstError: Q, focusSeoError: be } = Ce(K, () => F.value?.categories || [], "help", ce), $ = A(""), xe = A(!1), Se = A([]), we = v(() => Se.value.filter((e) => e.id !== m.articleId).map((e) => ({
			label: `${e.title} · ${e.code}`,
			value: e.id
		})));
		async function Te() {
			if (!(G.value || xe.value)) {
				xe.value = !0;
				try {
					let e = await ne("articles", {
						keyword: $.value,
						page_size: 100
					}, Oe?.signal), t = Se.value.filter((e) => K.related_content_ids.includes(e.id));
					Se.value = [...new Map([...t, ...e.lists].map((e) => [e.id, e])).values()];
				} catch (e) {
					Oe?.signal.aborted || (se.value = r(e));
				} finally {
					xe.value = !1;
				}
			}
		}
		let Ee = v(() => (F.value?.categories || []).map((e) => ({
			label: s(F.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
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
			T.value = !0, D.value = !1, se.value = "";
			try {
				if (F.value = await te(e.signal, { cms_source_type: "platform" }), m.articleId) {
					let t = await ee("articles", m.articleId, e.signal);
					if (F.value = await te(e.signal, { space_id: String(t.space_id) }), M.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
				e.signal.aborted || (se.value = r(t), D.value = !0);
			} finally {
				e.signal.aborted || (T.value = !1);
			}
		}
		let je = () => !T.value && !D.value && De !== JSON.stringify(K);
		function Me() {
			je() ? k.value = !0 : g("close");
		}
		function Ne() {
			L.value === "draft" ? Fe("draft") : fe.value = !0;
		}
		function Pe() {
			fe.value = !1, Fe("draft");
		}
		async function Fe(e) {
			if (G.value || T.value || D.value || R.value || (se.value = "", !await Z(e))) return;
			let t = K.scheduled_local ? new Date(K.scheduled_local) : null;
			E.value = !0, se.value = "";
			try {
				await re("articles", {
					...K,
					id: K.id || void 0,
					row_version: K.id ? K.row_version : void 0,
					category_id: K.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), De = JSON.stringify(K), ie.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "文章已发布"), g("saved");
			} catch (e) {
				ye(e);
			} finally {
				E.value = !1;
			}
			_e.value && await Q();
		}
		function Ie(e) {
			se.value = r(e);
		}
		let Le = (e) => {
			je() && (e.preventDefault(), e.returnValue = "");
		};
		return ge(() => !E.value && !R.value && (!je() || window.confirm("文章有未保存的修改，确定离开？"))), ue(() => {
			Ae(), window.addEventListener("beforeunload", Le);
		}), le(() => {
			Oe?.abort(), window.removeEventListener("beforeunload", Le);
		}), (n, r) => (O(), x("section", {
			ref_key: "editorRoot",
			ref: q,
			class: "article-editor",
			"aria-busy": T.value || E.value
		}, [
			S("header", $t, [
				w(P(f), {
					"icon-only": "",
					title: "返回文章列表",
					"aria-label": "返回文章列表",
					disabled: E.value || R.value,
					onClick: Me
				}, {
					default: z(() => [w(P(p), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				S("div", en, [S("h2", null, N(e.articleId ? "编辑文章" : "新增文章"), 1), S("span", null, N(F.value?.source_locale || "zh-CN") + " · " + N(M.value), 1)]),
				S("div", tn, [
					e.articleId && U.value ? (O(), y(P(f), {
						key: 0,
						size: "sm",
						disabled: T.value || D.value || E.value || R.value,
						onClick: r[0] ||= (e) => j.value = !0
					}, {
						default: z(() => [...r[32] ||= [C("删除文章", -1)]]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(P(f), {
						size: "sm",
						disabled: T.value || D.value,
						onClick: r[1] ||= (e) => ce.value = !0
					}, {
						icon: z(() => [w(P(p), {
							name: "search",
							size: 14
						})]),
						default: z(() => [r[33] ||= C("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					H.value ? b("", !0) : (O(), y(P(f), {
						key: 1,
						size: "sm",
						disabled: T.value || D.value || E.value || R.value,
						onClick: Ne
					}, {
						icon: z(() => [w(P(p), {
							name: "save",
							size: 14
						})]),
						default: z(() => [r[34] ||= C("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					P(ve) ? (O(), x("span", nn, N(P(ve)), 1)) : b("", !0),
					!H.value && P(_e) ? (O(), x("span", rn, "还有 " + N(P(_e)) + " 项待完善", 1)) : b("", !0),
					!H.value && V.value ? (O(), y(P(f), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: T.value || D.value || R.value,
						loading: E.value,
						onClick: r[2] ||= (e) => Fe(K.scheduled_local ? "scheduled" : "published")
					}, {
						icon: z(() => [w(P(p), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: z(() => [C(N(K.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : b("", !0)
				])
			]),
			T.value ? (O(), x("div", an, [w(P(p), {
				name: "loader-circle",
				class: "help-spin",
				size: 28
			}), r[35] ||= S("span", null, "正在读取文章资料...", -1)])) : D.value ? (O(), x("div", on, [w(P(c), {
				type: "error",
				description: se.value,
				closable: !1
			}, null, 8, ["description"]), w(P(f), { onClick: Ae }, {
				default: z(() => [...r[36] ||= [C("重新加载", -1)]]),
				_: 1
			})])) : (O(), x(_, { key: 2 }, [se.value ? (O(), x("div", sn, [w(P(c), {
				type: "error",
				description: se.value,
				closable: !1
			}, null, 8, ["description"])])) : b("", !0), S("div", cn, [S("aside", ln, [w(P(a), {
				model: K,
				rules: P(Y),
				"label-position": "top",
				onSubmit: r[16] ||= me(() => {}, ["prevent"])
			}, {
				default: z(() => [
					w(P(d), {
						label: "文章分类",
						prop: "category_id",
						error: P(X).category_id,
						required: ""
					}, {
						default: z(() => [w(P(u), {
							modelValue: K.category_id,
							"onUpdate:modelValue": r[3] ||= (e) => K.category_id = e,
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
					r[39] ||= S("h3", null, "文章设置", -1),
					w(P(d), {
						label: "文章封面",
						prop: "cover_url",
						error: P(X).cover_url
					}, {
						default: z(() => [w(ze, {
							modelValue: K.cover_url,
							"onUpdate:modelValue": r[4] ||= (e) => K.cover_url = e,
							label: "文章封面",
							disabled: G.value,
							upload: P(ae),
							onBusyChange: r[5] ||= (e) => R.value = e,
							onStart: r[6] ||= (e) => se.value = "",
							onError: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "内容来源",
						prop: "content_source",
						error: P(X).content_source
					}, {
						default: z(() => [w(P(h), {
							modelValue: K.content_source,
							"onUpdate:modelValue": r[7] ||= (e) => K.content_source = e,
							maxlength: 160,
							disabled: G.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "作者署名",
						prop: "author_name",
						error: P(X).author_name
					}, {
						default: z(() => [w(P(h), {
							modelValue: K.author_name,
							"onUpdate:modelValue": r[8] ||= (e) => K.author_name = e,
							maxlength: 120,
							disabled: G.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "前端排序",
						prop: "sort_order",
						error: P(X).sort_order
					}, {
						default: z(() => [w(P(i), {
							modelValue: K.sort_order,
							"onUpdate:modelValue": r[9] ||= (e) => K.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: G.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					r[40] ||= S("h3", null, "发布设置", -1),
					w(P(d), {
						label: "搜索关键词",
						prop: "search_keywords",
						error: P(X).search_keywords
					}, {
						default: z(() => [w(P(h), {
							modelValue: K.search_keywords,
							"onUpdate:modelValue": r[10] ||= (e) => K.search_keywords = e,
							maxlength: 2e3,
							disabled: G.value,
							placeholder: "使用空格或逗号分隔",
							"aria-label": "搜索关键词"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: P(X).helpful_enabled
					}, {
						default: z(() => [w(Rt, {
							modelValue: K.helpful_enabled,
							"onUpdate:modelValue": r[11] ||= (e) => K.helpful_enabled = e,
							disabled: G.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "相关文章",
						prop: "related_content_ids",
						error: P(X).related_content_ids
					}, {
						default: z(() => [S("div", un, [
							w(P(h), {
								modelValue: $.value,
								"onUpdate:modelValue": r[12] ||= (e) => $.value = e,
								disabled: G.value,
								placeholder: "搜索文章标题",
								"aria-label": "搜索相关文章",
								onKeydown: B(me(Te, ["prevent"]), ["enter"])
							}, null, 8, [
								"modelValue",
								"disabled",
								"onKeydown"
							]),
							w(P(f), {
								size: "sm",
								disabled: G.value,
								loading: xe.value,
								onClick: Te
							}, {
								default: z(() => [...r[37] ||= [C("查找文章", -1)]]),
								_: 1
							}, 8, ["disabled", "loading"]),
							w(P(u), {
								modelValue: K.related_content_ids,
								"onUpdate:modelValue": r[13] ||= (e) => K.related_content_ids = e,
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
							r[38] ||= S("p", { class: "article-editor__hint" }, " 最多 20 篇，按选择顺序展示。可关联草稿，前台须按发布状态过滤。 ", -1)
						])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "启用状态",
						prop: "is_enabled",
						error: P(X).is_enabled
					}, {
						default: z(() => [w(Rt, {
							modelValue: K.is_enabled,
							"onUpdate:modelValue": r[14] ||= (e) => K.is_enabled = e,
							disabled: G.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: P(X).scheduled_local
					}, {
						default: z(() => [w(P(h), {
							modelValue: K.scheduled_local,
							"onUpdate:modelValue": r[15] ||= (e) => K.scheduled_local = e,
							type: "datetime-local",
							disabled: G.value || !V.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					r[41] ||= S("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), S("main", dn, [w(P(a), {
				model: K,
				rules: P(Y),
				"label-position": "top",
				onSubmit: r[20] ||= me(() => {}, ["prevent"])
			}, {
				default: z(() => [
					w(P(d), {
						label: "标题",
						prop: "title",
						error: P(X).title,
						required: ""
					}, {
						default: z(() => [w(P(h), {
							modelValue: K.title,
							"onUpdate:modelValue": r[17] ||= (e) => K.title = e,
							maxlength: 255,
							disabled: G.value,
							placeholder: "输入文章标题",
							"aria-label": "文章标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "摘要",
						prop: "summary",
						error: P(X).summary
					}, {
						default: z(() => [pe(S("textarea", {
							"onUpdate:modelValue": r[18] ||= (e) => K.summary = e,
							"aria-invalid": !!P(X).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: G.value,
							"aria-label": "文章摘要"
						}, null, 8, fn), [[I, K.summary]])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "正文",
						prop: "body_html",
						error: P(X).body_html
					}, {
						default: z(() => [w(P(t), {
							modelValue: K.body_html,
							"onUpdate:modelValue": r[19] ||= (e) => K.body_html = e,
							readonly: H.value,
							disabled: E.value,
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
			w(P(o), {
				modelValue: ce.value,
				"onUpdate:modelValue": r[24] ||= (e) => ce.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: z(() => [w(P(f), {
					variant: "primary",
					onClick: r[23] ||= (e) => ce.value = !1
				}, {
					default: z(() => [...r[42] ||= [C("确定", -1)]]),
					_: 1
				})]),
				default: z(() => [w(P(a), {
					model: K,
					rules: P(Y),
					"label-position": "top",
					onSubmit: r[22] ||= me(() => {}, ["prevent"])
				}, {
					default: z(() => [w(P(d), {
						label: "SEO 描述",
						prop: "seo_description",
						error: P(X).seo_description
					}, {
						default: z(() => [pe(S("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": r[21] ||= (e) => K.seo_description = e,
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
			w(P(o), {
				modelValue: j.value,
				"onUpdate:modelValue": r[26] ||= (e) => j.value = e,
				title: "确认删除",
				subtitle: `操作对象：${K.title || "未命名文章"}`,
				width: "460px",
				"panel-class": "help-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !E.value
			}, {
				"header-actions": z(() => [S("span", mn, [w(P(p), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: z(() => [w(P(f), {
					disabled: E.value,
					onClick: r[25] ||= (e) => j.value = !1
				}, {
					default: z(() => [...r[43] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(f), {
					variant: "warning",
					loading: E.value,
					onClick: W
				}, {
					default: z(() => [...r[44] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: z(() => [w(P(c), {
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
			w(P(o), {
				modelValue: k.value,
				"onUpdate:modelValue": r[29] ||= (e) => k.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: z(() => [w(P(f), { onClick: r[27] ||= (e) => k.value = !1 }, {
					default: z(() => [...r[45] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(P(f), {
					variant: "primary",
					onClick: r[28] ||= (e) => g("close")
				}, {
					default: z(() => [...r[46] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			w(P(o), {
				modelValue: fe.value,
				"onUpdate:modelValue": r[31] ||= (e) => fe.value = e,
				title: "将文章转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: z(() => [w(P(f), { onClick: r[30] ||= (e) => fe.value = !1 }, {
					default: z(() => [...r[47] ||= [C("取消", -1)]]),
					_: 1
				}), w(P(f), {
					variant: "primary",
					onClick: Pe
				}, {
					default: z(() => [...r[48] ||= [C("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Qt));
	}
}), [["__scopeId", "data-v-16f68391"]]), gn = { class: "help-articles" }, _n = {
	key: 0,
	class: "help-statistics-note"
}, vn = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let t = he(), { helpPublishStates: n, helpCategoryLabel: r, getHelpList: i, getHelpMetadata: a } = It(), { hasPermission: o } = he(), { formatDateTime: s } = he(), c = A(!1), u = A(), ne = (e) => o([`cms_help:${e}`]), re = A(), ie = W(a, (e) => {
			re.value = e;
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
				formatter: (e) => r(re.value, e)
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
		], { proTableBindings: d, reload: oe, filters: m } = te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
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
					}, ...(re.value?.categories || []).map((e) => ({
						label: r(re.value, e.id),
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
		ie.bindFilters(m);
		let h = new AbortController();
		async function g() {
			try {
				re.value = await a(h.signal);
			} catch {}
		}
		function _(e) {
			u.value = e, c.value = !0;
		}
		function S() {
			c.value = !1, oe(), g();
		}
		return ue(g), le(() => h.abort()), (e, r) => (O(), x("div", gn, [
			!c.value && P(t).mode === "platform" ? (O(), x("p", _n, " 当前管理平台默认模板。浏览量、评价数及有帮助率属于站点运行数据，此处显示“—”，不汇总白标站点。 ")) : b("", !0),
			c.value ? (O(), y(hn, {
				key: 1,
				"article-id": u.value,
				onClose: r[0] ||= (e) => c.value = !1,
				onSaved: S
			}, null, 8, ["article-id"])) : b("", !0),
			pe(w(P(ee), D(P(d), {
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
				"cell-cms_source_type": z(({ row: e }) => [w(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": z(() => [ne("add") ? (O(), y(P(f), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[1] ||= (e) => _()
				}, {
					icon: z(() => [w(P(p), {
						name: "plus",
						size: 14
					})]),
					default: z(() => [r[2] ||= C("新增文章", -1)]),
					_: 1
				})) : b("", !0)]),
				"cell-publish_status": z(({ row: e }) => [w(P(l), {
					size: "sm",
					effect: "soft",
					type: e.publish_status === "published" ? "success" : "warning"
				}, {
					default: z(() => [C(N(P(n).find((t) => t.value === e.publish_status)?.label), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-is_enabled": z(({ row: e }) => [w(P(l), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: z(() => [C(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-publish_time": z(({ row: e }) => [C(N(P(s)(e.published_at || e.scheduled_at)), 1)]),
				"cell-actions": z(({ row: e }) => [w(P(f), {
					size: "sm",
					"icon-only": "",
					title: ne("edit") ? "编辑文章" : "文章详情",
					"aria-label": ne("edit") ? "编辑文章" : "文章详情",
					onClick: (t) => _(e.id)
				}, {
					default: z(() => [w(P(p), {
						name: ne("edit") ? "square-pen" : "panel-right-open",
						size: 15
					}, null, 8, ["name"])]),
					_: 1
				}, 8, [
					"title",
					"aria-label",
					"onClick"
				])]),
				_: 1
			}, 16), [[L, !c.value]])
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
}, En = { class: "attachment-title" }, Dn = ["src", "alt"], On = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { getFeedbackList: t, getFeedbackMetadata: n, getFeedbackDetail: r, getFeedbackAttachment: i, feedbackSourceTypes: a, feedbackSourceLabel: s, feedbackError: u } = yn(), { formatDateTime: ne } = he(), re = A({
			scenes: [],
			issues: []
		}), ie = W(n, (e) => {
			re.value = e;
		}), ae = [
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
				formatter: ne
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				fixed: "right",
				align: "center",
				hideable: !1
			}
		], { proTableBindings: d, filters: oe } = te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
				...ie.fields,
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
					}, ...a]
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
					}, ...re.value.scenes.map((e) => ({
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
					}, ...re.value.issues.map((e) => ({
						label: `${re.value.scenes.find((t) => t.id === e.scene_id)?.name || "—"} / ${e.name}`,
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
		ie.bindFilters(oe);
		let m = A(!1), h = A(!1), g = A(""), T = A(), E = A({}), se = A(""), ce, k = new AbortController();
		async function de(e) {
			ce?.abort();
			let t = new AbortController();
			ce = t, T.value = void 0, E.value = {}, g.value = "", se.value = "", m.value = !0, h.value = !0;
			try {
				let n = await r(e, t.signal);
				t.signal.aborted || (T.value = n);
			} catch (e) {
				t.signal.aborted || (g.value = u(e));
			} finally {
				t.signal.aborted || (h.value = !1);
			}
		}
		async function j(e) {
			let t = ce, n = T.value?.id;
			if (!(!t || !n || se.value)) {
				se.value = e, g.value = "";
				try {
					let r = await i(n, e, t.signal);
					!t.signal.aborted && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(r.data_url) && (E.value[e] = r.data_url);
				} catch (e) {
					t.signal.aborted || (g.value = u(e));
				} finally {
					t.signal.aborted || (se.value = "");
				}
			}
		}
		return R(m, (e) => {
			e || (ce?.abort(), T.value = void 0, E.value = {}, g.value = "");
		}), ue(async () => {
			try {
				re.value = await n(k.signal);
			} catch {}
		}), le(() => {
			k.abort(), ce?.abort();
		}), (e, t) => (O(), x("div", bn, [w(P(ee), D(P(d), {
			"auto-refreshable": !1,
			columns: ae,
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
			"cell-cms_source_type": z(({ row: e }) => [w(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"cell-source_type": z(({ row: e }) => [w(P(l), {
				size: "sm",
				effect: "soft",
				type: e.source_type === "merchant" ? "warning" : e.source_type === "platform" ? "success" : "primary"
			}, {
				default: z(() => [C(N(P(s)(e.source_type)), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-actions": z(({ row: e }) => [w(P(f), {
				size: "sm",
				"icon-only": "",
				title: "查看反馈",
				"aria-label": "查看反馈",
				onClick: (t) => de(e.id)
			}, {
				default: z(() => [w(P(p), {
					name: "eye",
					size: 15
				})]),
				_: 1
			}, 8, ["onClick"])]),
			_: 1
		}, 16), w(P(o), {
			modelValue: m.value,
			"onUpdate:modelValue": t[1] ||= (e) => m.value = e,
			title: "反馈详情",
			subtitle: T.value?.code || "查看用户正式提交的意见反馈",
			width: "760px",
			"close-on-click-modal": !1
		}, {
			footer: z(() => [w(P(f), { onClick: t[0] ||= (e) => m.value = !1 }, {
				default: z(() => [...t[14] ||= [C("关闭", -1)]]),
				_: 1
			})]),
			default: z(() => [S("div", {
				class: "feedback-detail",
				"aria-busy": h.value
			}, [
				h.value ? (O(), x("p", Sn, "正在读取反馈…")) : b("", !0),
				g.value ? (O(), y(P(c), {
					key: 1,
					type: "error",
					closable: !1,
					description: g.value
				}, null, 8, ["description"])) : b("", !0),
				T.value && !h.value ? (O(), x(_, { key: 2 }, [
					S("dl", Cn, [
						S("div", null, [t[2] ||= S("dt", null, "UID", -1), S("dd", null, N(T.value.public_user_id_snapshot), 1)]),
						S("div", null, [t[3] ||= S("dt", null, "用户账号", -1), S("dd", null, N(T.value.username_snapshot || "—"), 1)]),
						S("div", null, [t[4] ||= S("dt", null, "来源类型", -1), S("dd", null, N(P(s)(T.value.source_type)), 1)]),
						S("div", null, [t[5] ||= S("dt", null, "来源名称", -1), S("dd", null, N(T.value.source_name_snapshot || "—"), 1)]),
						S("div", null, [t[6] ||= S("dt", null, "业务场景", -1), S("dd", null, N(T.value.scene_name_snapshot), 1)]),
						S("div", null, [t[7] ||= S("dt", null, "问题分类", -1), S("dd", null, N(T.value.issue_category_name_snapshot), 1)]),
						S("div", null, [t[8] ||= S("dt", null, "联系方式（脱敏）", -1), S("dd", null, N(T.value.contact_display), 1)]),
						S("div", null, [t[9] ||= S("dt", null, "提交时间", -1), S("dd", null, N(P(ne)(T.value.submitted_at)), 1)])
					]),
					S("section", null, [t[10] ||= S("h3", null, "反馈内容", -1), S("div", wn, N(T.value.content), 1)]),
					S("section", null, [
						S("h3", null, [t[11] ||= C(" 附件 ", -1), S("span", null, N(T.value.attachments?.length || 0), 1)]),
						T.value.attachments?.length ? b("", !0) : (O(), x("p", Tn, "暂无附件")),
						(O(!0), x(_, null, fe(T.value.attachments, (e) => (O(), x("div", {
							key: e.id,
							class: "feedback-attachment"
						}, [S("div", En, [S("span", null, N(e.original_name || "图片附件") + " · " + N(Math.ceil(e.byte_size / 1024)) + " KB", 1), w(P(f), {
							size: "sm",
							loading: se.value === e.id,
							onClick: (t) => j(e.id)
						}, {
							default: z(() => [...t[12] ||= [C("查看图片", -1)]]),
							_: 1
						}, 8, ["loading", "onClick"])]), E.value[e.id] ? (O(), x("img", {
							key: 0,
							src: E.value[e.id],
							alt: e.original_name || "反馈图片"
						}, null, 8, Dn)) : b("", !0)]))), 128))
					]),
					t[13] ||= S("p", { class: "muted" }, "来源和分类为提交时快照；此页面仅查看，不修改用户原始反馈。", -1)
				], 64)) : b("", !0)
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
}, Nn = { class: "taxonomy-editor__field" }, Pn = { class: "taxonomy-editor__row" }, Fn = "分类", In = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = he(), { formatDateTime: n } = he(), { announcementError: r, deleteAnnouncement: s, getAnnouncementMetadata: ne, getAnnouncementList: re, getAnnouncementDetail: ae, saveAnnouncement: oe } = kn(), m = (e) => t([`cms_announcement_category:${e}`]), g = A(), _ = A(), T = W(ne, (e) => {
			g.value = e;
		}), E = [
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
				formatter: (e) => g.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
		], { proTableBindings: se, reload: ce, filters: k } = te({
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
				let i = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), a = await re("categories", {
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
		T.bindFilters(k);
		let fe = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), j = de(fe()), M = A(!1), F = A(!1), I = A(!1), L = A(!1), R = A(!1), pe = A(""), B = A(!1), V = A(""), ge = A(!1), H = v(() => !m(j.id ? "edit" : "add")), K = v(() => I.value || L.value), q = "", Y;
		async function X(e) {
			Y?.abort(), Y = new AbortController();
			let t = Y;
			Object.assign(j, fe(), { id: e || "" }), V.value = "", R.value = !1, pe.value = "", B.value = !1, M.value = !0, F.value = !0, q = JSON.stringify(j);
			try {
				if (_.value = await ne(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await ae("categories", e, t.signal);
				if (_.value = await ne(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
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
				t.signal.aborted || (B.value = !0, V.value = r(e));
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
					}), M.value = !1, ie.success("保存成功"), await Promise.all([ce(), Se()]);
				} catch (e) {
					V.value = r(e);
				} finally {
					I.value = !1;
				}
			}
		}
		function Q() {
			!j.id || !m("delete") || K.value || F.value || B.value || (pe.value = "", R.value = !0);
		}
		async function be() {
			if (!(!R.value || !j.id || !m("delete") || K.value || F.value || B.value)) {
				L.value = !0, pe.value = "";
				try {
					await s("categories", j.id, j.row_version), R.value = !1, M.value = !1, ie.success("分类已删除"), await Promise.all([ce(), Se()]);
				} catch (e) {
					pe.value = r(e);
				} finally {
					L.value = !1;
				}
			}
		}
		let $ = v(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(_.value?.categories || []).filter((e) => !e.parent_id && e.id !== j.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), xe = new AbortController();
		async function Se() {
			try {
				g.value = await ne(xe.signal);
			} catch {}
		}
		return ue(Se), le(() => {
			Y?.abort(), xe.abort();
		}), (e, t) => (O(), x("div", An, [
			w(P(ee), D(P(se), {
				"auto-refreshable": !1,
				columns: E,
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
				"cell-cms_source_type": z(({ row: e }) => [w(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": z(() => [m("add") ? (O(), y(P(f), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: t[0] ||= (e) => X()
				}, {
					icon: z(() => [w(P(p), {
						name: "plus",
						size: 14
					})]),
					default: z(() => [C("新增" + N(Fn))]),
					_: 1
				})) : b("", !0)]),
				"cell-is_enabled": z(({ row: e }) => [w(P(l), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: z(() => [C(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": z(({ row: e }) => [w(P(f), {
					size: "sm",
					"icon-only": "",
					title: m("edit") ? `编辑${Fn}` : `${Fn}详情`,
					"aria-label": m("edit") ? `编辑${Fn}` : `${Fn}详情`,
					onClick: (t) => X(e.id)
				}, {
					default: z(() => [w(P(p), {
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
			w(P(o), {
				modelValue: M.value,
				"onUpdate:modelValue": t[5] ||= (e) => M.value = e,
				title: `${j.id ? "编辑" : "新增"}公告${Fn}`,
				width: "680px",
				subtitle: "公告分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": _e
			}, {
				footer: z(() => [
					j.id && m("delete") ? (O(), y(P(f), {
						key: 0,
						variant: "danger",
						disabled: F.value || B.value || K.value,
						onClick: Q
					}, {
						icon: z(() => [w(P(p), {
							name: "trash-2",
							size: 14
						})]),
						default: z(() => [t[11] ||= C("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(P(f), {
						disabled: K.value,
						onClick: ve
					}, {
						default: z(() => [...t[12] ||= [C("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					H.value ? b("", !0) : (O(), y(P(f), {
						key: 1,
						variant: "primary",
						loading: I.value,
						disabled: F.value || B.value || L.value,
						onClick: ye
					}, {
						default: z(() => [C("保存" + N(Fn))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: z(() => [S("div", {
					class: "taxonomy-editor",
					"aria-busy": F.value
				}, [
					F.value ? (O(), x("div", Mn, [w(P(p), {
						name: "loader-circle",
						class: "announcement-spin",
						size: 24
					}), S("span", null, "正在读取" + N(Fn) + "...")])) : b("", !0),
					V.value ? (O(), y(P(c), {
						key: 1,
						type: "error",
						closable: !1,
						description: V.value
					}, null, 8, ["description"])) : b("", !0),
					!F.value && !B.value ? (O(), y(P(a), {
						key: 2,
						model: j,
						"label-position": "top",
						onSubmit: me(ye, ["prevent"])
					}, {
						default: z(() => [
							j.id ? (O(), y(P(d), {
								key: 0,
								label: "分类ID"
							}, {
								default: z(() => [w(P(h), {
									"model-value": j.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : b("", !0),
							w(P(d), {
								label: `${Fn}名称`,
								required: ""
							}, {
								default: z(() => [w(P(h), {
									modelValue: j.name,
									"onUpdate:modelValue": t[1] ||= (e) => j.name = e,
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
							w(P(d), { label: "父分类" }, {
								default: z(() => [S("div", Nn, [w(P(u), {
									modelValue: j.parent_id,
									"onUpdate:modelValue": t[2] ||= (e) => j.parent_id = e,
									options: $.value,
									disabled: H.value || K.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), t[10] ||= S("p", { class: "announcement-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类公告。 ", -1)])]),
								_: 1
							}),
							S("div", Pn, [w(P(d), {
								label: "前端排序",
								required: ""
							}, {
								default: z(() => [w(P(i), {
									modelValue: j.sort_order,
									"onUpdate:modelValue": t[3] ||= (e) => j.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: H.value || K.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), w(P(d), { label: "启用状态" }, {
								default: z(() => [w(J, {
									modelValue: j.is_enabled,
									"onUpdate:modelValue": t[4] ||= (e) => j.is_enabled = e,
									disabled: H.value || K.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : b("", !0)
				], 8, jn)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			w(P(o), {
				modelValue: R.value,
				"onUpdate:modelValue": t[7] ||= (e) => R.value = e,
				title: "删除公告分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !L.value
			}, {
				footer: z(() => [w(P(f), {
					disabled: L.value,
					onClick: t[6] ||= (e) => R.value = !1
				}, {
					default: z(() => [...t[13] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(f), {
					variant: "danger",
					loading: L.value,
					onClick: be
				}, {
					default: z(() => [...t[14] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: z(() => [S("p", null, "确认删除分类“" + N(j.name) + "”？有关联公告或子分类的分类无法删除。", 1), pe.value ? (O(), y(P(c), {
					key: 0,
					type: "error",
					closable: !1,
					description: pe.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			w(P(o), {
				modelValue: ge.value,
				"onUpdate:modelValue": t[9] ||= (e) => ge.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: z(() => [w(P(f), { onClick: t[8] ||= (e) => ge.value = !1 }, {
					default: z(() => [...t[15] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(P(f), {
					variant: "primary",
					onClick: Z
				}, {
					default: z(() => [...t[16] ||= [C("放弃修改", -1)]]),
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
}, Qn = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(e, { emit: n }) {
		let { hasPermission: r } = he(), { announcementError: s, announcementCategoryLabel: l, deleteAnnouncement: ee, getAnnouncementDetail: te, getAnnouncementMetadata: ne, saveAnnouncement: re, uploadAnnouncementCover: ae } = kn(), oe = e, m = n, g = A(!0), T = A(!1), E = A(!1), D = A(""), se = A(!1), ce = A(!1), k = A(!1), fe = A(!1), j = A(he().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), M = A(), F = A("draft"), L = A(!1), R = v(() => r(["cms_announcement:publish"])), B = v(() => !r([`cms_announcement:${oe.articleId ? "edit" : "add"}`]) || !R.value && F.value !== "draft"), V = v(() => r(["cms_announcement:delete"]) && (R.value || F.value === "draft"));
		async function H() {
			if (!(!V.value || T.value || g.value || E.value)) {
				T.value = !0, D.value = "";
				try {
					await ee("articles", W.id, W.row_version), be = JSON.stringify(W), ie.success("公告已删除"), m("saved");
				} catch (e) {
					D.value = s(e), fe.value = !1;
				} finally {
					T.value = !1;
				}
			}
		}
		let U = v(() => B.value || T.value), W = de({
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
		}), { editorRoot: G, seoInput: K, fieldRules: q, fieldErrors: J, pendingCount: Y, saveError: X, validateSave: _e, setSaveFailure: ve, focusFirstError: Z, focusSeoError: ye } = Ce(W, () => M.value?.categories || [], "announcement", se), Q = v(() => (M.value?.categories || []).map((e) => ({
			label: l(M.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
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
			g.value = !0, E.value = !1, D.value = "";
			try {
				if (M.value = await ne(e.signal, { cms_source_type: "platform" }), oe.articleId) {
					let t = await te("articles", oe.articleId, e.signal);
					if (M.value = await ne(e.signal, { space_id: String(t.space_id) }), j.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
				e.signal.aborted || (D.value = s(t), E.value = !0);
			} finally {
				e.signal.aborted || (g.value = !1);
			}
		}
		let we = () => !g.value && !E.value && be !== JSON.stringify(W);
		function Te() {
			we() ? ce.value = !0 : m("close");
		}
		function Ee() {
			F.value === "draft" ? Oe("draft") : k.value = !0;
		}
		function De() {
			k.value = !1, Oe("draft");
		}
		async function Oe(e) {
			if (U.value || g.value || E.value || L.value || (D.value = "", !await _e(e))) return;
			let t = W.scheduled_local ? new Date(W.scheduled_local) : null;
			T.value = !0, D.value = "";
			try {
				await re("articles", {
					...W,
					id: W.id || void 0,
					row_version: W.id ? W.row_version : void 0,
					category_id: W.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), be = JSON.stringify(W), ie.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "公告已发布"), m("saved");
			} catch (e) {
				ve(e);
			} finally {
				T.value = !1;
			}
			Y.value && await Z();
		}
		function ke(e) {
			D.value = s(e);
		}
		let Ae = (e) => {
			we() && (e.preventDefault(), e.returnValue = "");
		};
		return ge(() => !T.value && !L.value && (!we() || window.confirm("公告有未保存的修改，确定离开？"))), ue(() => {
			Se(), window.addEventListener("beforeunload", Ae);
		}), le(() => {
			$?.abort(), window.removeEventListener("beforeunload", Ae);
		}), (n, r) => (O(), x("section", {
			ref_key: "editorRoot",
			ref: G,
			class: "article-editor",
			"aria-busy": g.value || T.value
		}, [
			S("header", Rn, [
				w(P(f), {
					"icon-only": "",
					title: "返回公告列表",
					"aria-label": "返回公告列表",
					disabled: T.value || L.value,
					onClick: Te
				}, {
					default: z(() => [w(P(p), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				S("div", zn, [S("h2", null, N(e.articleId ? "编辑公告" : "新增公告"), 1), S("span", null, N(M.value?.source_locale || "zh-CN") + " · " + N(j.value), 1)]),
				S("div", Bn, [
					e.articleId && V.value ? (O(), y(P(f), {
						key: 0,
						size: "sm",
						disabled: g.value || E.value || T.value || L.value,
						onClick: r[0] ||= (e) => fe.value = !0
					}, {
						default: z(() => [...r[29] ||= [C("删除公告", -1)]]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(P(f), {
						size: "sm",
						disabled: g.value || E.value,
						onClick: r[1] ||= (e) => se.value = !0
					}, {
						icon: z(() => [w(P(p), {
							name: "search",
							size: 14
						})]),
						default: z(() => [r[30] ||= C("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					B.value ? b("", !0) : (O(), y(P(f), {
						key: 1,
						size: "sm",
						disabled: g.value || E.value || T.value || L.value,
						onClick: Ee
					}, {
						icon: z(() => [w(P(p), {
							name: "save",
							size: 14
						})]),
						default: z(() => [r[31] ||= C("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					P(X) ? (O(), x("span", Vn, N(P(X)), 1)) : b("", !0),
					!B.value && P(Y) ? (O(), x("span", Hn, "还有 " + N(P(Y)) + " 项待完善", 1)) : b("", !0),
					!B.value && R.value ? (O(), y(P(f), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: g.value || E.value || L.value,
						loading: T.value,
						onClick: r[2] ||= (e) => Oe(W.scheduled_local ? "scheduled" : "published")
					}, {
						icon: z(() => [w(P(p), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: z(() => [C(N(W.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : b("", !0)
				])
			]),
			g.value ? (O(), x("div", Un, [w(P(p), {
				name: "loader-circle",
				class: "announcement-spin",
				size: 28
			}), r[32] ||= S("span", null, "正在读取公告资料...", -1)])) : E.value ? (O(), x("div", Wn, [w(P(c), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"]), w(P(f), { onClick: Se }, {
				default: z(() => [...r[33] ||= [C("重新加载", -1)]]),
				_: 1
			})])) : (O(), x(_, { key: 2 }, [D.value ? (O(), x("div", Gn, [w(P(c), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"])])) : b("", !0), S("div", Kn, [S("aside", qn, [w(P(a), {
				model: W,
				rules: P(q),
				"label-position": "top",
				onSubmit: r[13] ||= me(() => {}, ["prevent"])
			}, {
				default: z(() => [
					w(P(d), {
						label: "公告分类",
						prop: "category_id",
						error: P(J).category_id,
						required: ""
					}, {
						default: z(() => [w(P(u), {
							modelValue: W.category_id,
							"onUpdate:modelValue": r[3] ||= (e) => W.category_id = e,
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
					r[34] ||= S("h3", null, "公告设置", -1),
					w(P(d), {
						label: "公告封面",
						prop: "cover_url",
						error: P(J).cover_url
					}, {
						default: z(() => [w(ze, {
							modelValue: W.cover_url,
							"onUpdate:modelValue": r[4] ||= (e) => W.cover_url = e,
							label: "公告封面",
							disabled: U.value,
							upload: P(ae),
							onBusyChange: r[5] ||= (e) => L.value = e,
							onStart: r[6] ||= (e) => D.value = "",
							onError: ke
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "内容来源",
						prop: "content_source",
						error: P(J).content_source
					}, {
						default: z(() => [w(P(h), {
							modelValue: W.content_source,
							"onUpdate:modelValue": r[7] ||= (e) => W.content_source = e,
							maxlength: 160,
							disabled: U.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "作者署名",
						prop: "author_name",
						error: P(J).author_name
					}, {
						default: z(() => [w(P(h), {
							modelValue: W.author_name,
							"onUpdate:modelValue": r[8] ||= (e) => W.author_name = e,
							maxlength: 120,
							disabled: U.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "前端排序",
						prop: "sort_order",
						error: P(J).sort_order
					}, {
						default: z(() => [w(P(i), {
							modelValue: W.sort_order,
							"onUpdate:modelValue": r[9] ||= (e) => W.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: U.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					r[35] ||= S("h3", null, "发布设置", -1),
					w(P(d), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: P(J).helpful_enabled
					}, {
						default: z(() => [w(Rt, {
							modelValue: W.helpful_enabled,
							"onUpdate:modelValue": r[10] ||= (e) => W.helpful_enabled = e,
							disabled: U.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "启用状态",
						prop: "is_enabled",
						error: P(J).is_enabled
					}, {
						default: z(() => [w(Rt, {
							modelValue: W.is_enabled,
							"onUpdate:modelValue": r[11] ||= (e) => W.is_enabled = e,
							disabled: U.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: P(J).scheduled_local
					}, {
						default: z(() => [w(P(h), {
							modelValue: W.scheduled_local,
							"onUpdate:modelValue": r[12] ||= (e) => W.scheduled_local = e,
							type: "datetime-local",
							disabled: U.value || !R.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					r[36] ||= S("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), S("main", Jn, [w(P(a), {
				model: W,
				rules: P(q),
				"label-position": "top",
				onSubmit: r[17] ||= me(() => {}, ["prevent"])
			}, {
				default: z(() => [
					w(P(d), {
						label: "标题",
						prop: "title",
						error: P(J).title,
						required: ""
					}, {
						default: z(() => [w(P(h), {
							modelValue: W.title,
							"onUpdate:modelValue": r[14] ||= (e) => W.title = e,
							maxlength: 255,
							disabled: U.value,
							placeholder: "输入公告标题",
							"aria-label": "公告标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "摘要",
						prop: "summary",
						error: P(J).summary
					}, {
						default: z(() => [pe(S("textarea", {
							"onUpdate:modelValue": r[15] ||= (e) => W.summary = e,
							"aria-invalid": !!P(J).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: U.value,
							"aria-label": "公告摘要"
						}, null, 8, Yn), [[I, W.summary]])]),
						_: 1
					}, 8, ["error"]),
					w(P(d), {
						label: "正文",
						prop: "body_html",
						error: P(J).body_html
					}, {
						default: z(() => [w(P(t), {
							modelValue: W.body_html,
							"onUpdate:modelValue": r[16] ||= (e) => W.body_html = e,
							readonly: B.value,
							disabled: T.value,
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
			w(P(o), {
				modelValue: se.value,
				"onUpdate:modelValue": r[21] ||= (e) => se.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: z(() => [w(P(f), {
					variant: "primary",
					onClick: r[20] ||= (e) => se.value = !1
				}, {
					default: z(() => [...r[37] ||= [C("确定", -1)]]),
					_: 1
				})]),
				default: z(() => [w(P(a), {
					model: W,
					rules: P(q),
					"label-position": "top",
					onSubmit: r[19] ||= me(() => {}, ["prevent"])
				}, {
					default: z(() => [w(P(d), {
						label: "SEO 描述",
						prop: "seo_description",
						error: P(J).seo_description
					}, {
						default: z(() => [pe(S("textarea", {
							ref_key: "seoInput",
							ref: K,
							"onUpdate:modelValue": r[18] ||= (e) => W.seo_description = e,
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
			w(P(o), {
				modelValue: fe.value,
				"onUpdate:modelValue": r[23] ||= (e) => fe.value = e,
				title: "确认删除",
				subtitle: `操作对象：${W.title || "未命名公告"}`,
				width: "460px",
				"panel-class": "announcement-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !T.value
			}, {
				"header-actions": z(() => [S("span", Zn, [w(P(p), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: z(() => [w(P(f), {
					disabled: T.value,
					onClick: r[22] ||= (e) => fe.value = !1
				}, {
					default: z(() => [...r[38] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(f), {
					variant: "warning",
					loading: T.value,
					onClick: H
				}, {
					default: z(() => [...r[39] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: z(() => [w(P(c), {
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
			w(P(o), {
				modelValue: ce.value,
				"onUpdate:modelValue": r[26] ||= (e) => ce.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: z(() => [w(P(f), { onClick: r[24] ||= (e) => ce.value = !1 }, {
					default: z(() => [...r[40] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(P(f), {
					variant: "primary",
					onClick: r[25] ||= (e) => m("close")
				}, {
					default: z(() => [...r[41] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			w(P(o), {
				modelValue: k.value,
				"onUpdate:modelValue": r[28] ||= (e) => k.value = e,
				title: "将公告转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: z(() => [w(P(f), { onClick: r[27] ||= (e) => k.value = !1 }, {
					default: z(() => [...r[42] ||= [C("取消", -1)]]),
					_: 1
				}), w(P(f), {
					variant: "primary",
					onClick: De
				}, {
					default: z(() => [...r[43] ||= [C("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Ln));
	}
}), [["__scopeId", "data-v-525a2f73"]]), $n = { class: "announcement-articles" }, er = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = he(), { formatDateTime: n } = he(), { announcementPublishStates: r, announcementCategoryLabel: i, getAnnouncementList: a, getAnnouncementMetadata: o } = kn(), s = A(!1), c = A(), u = (e) => t([`cms_announcement:${e}`]), ne = A(), re = W(o, (e) => {
			ne.value = e;
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
				formatter: (e) => i(ne.value, e)
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
		], { proTableBindings: ae, reload: d, filters: oe } = te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
				...re.fields,
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
		re.bindFilters(oe);
		let m = new AbortController();
		async function h() {
			try {
				ne.value = await o(m.signal);
			} catch {}
		}
		function g(e) {
			c.value = e, s.value = !0;
		}
		function _() {
			s.value = !1, d(), h();
		}
		return ue(h), le(() => m.abort()), (e, t) => (O(), x("div", $n, [s.value ? (O(), y(Qn, {
			key: 0,
			"article-id": c.value,
			onClose: t[0] ||= (e) => s.value = !1,
			onSaved: _
		}, null, 8, ["article-id"])) : b("", !0), pe(w(P(ee), D(P(ae), {
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
			"cell-cms_source_type": z(({ row: e }) => [w(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": z(() => [u("add") ? (O(), y(P(f), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => g()
			}, {
				icon: z(() => [w(P(p), {
					name: "plus",
					size: 14
				})]),
				default: z(() => [t[2] ||= C("新增公告", -1)]),
				_: 1
			})) : b("", !0)]),
			"cell-publish_status": z(({ row: e }) => [w(P(l), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: z(() => [C(N(P(r).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": z(({ row: e }) => [w(P(l), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: z(() => [C(N(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": z(({ row: e }) => [C(N(P(n)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": z(({ row: e }) => [w(P(f), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑公告" : "公告详情",
				"aria-label": u("edit") ? "编辑公告" : "公告详情",
				onClick: (t) => g(e.id)
			}, {
				default: z(() => [w(P(p), {
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
		}, 16), [[L, !s.value]])]));
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
}, ii = { class: "mm-translation-settings__credential" }, ai = { key: 0 }, oi = { key: 1 }, si = { key: 2 }, ci = { class: "mm-translation-settings__grid" }, li = { class: "job-confirm" }, ui = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(t) {
		let { cancelTranslationJob: n, createTranslationJob: a, getTranslationDetail: s, getTranslationJob: ee, getTranslationList: te, getTranslationMetadata: ae, getTranslationSettings: m, saveTranslations: g, saveTranslationSettings: T, testTranslationConnection: E } = tr(), { hasPermission: D } = he(), k = A(), de = A(""), j = A("news:content"), M = A([]), F = A(), L = A(""), me = A("title"), V = A(""), H = A(""), U = A(1), W = A(0), G = A({}), K = A(!1), q = A(!1), J = A(!1), Y = A(!1), X = A(""), _e = A(""), ve = A(), Z = A(null), ye = A(!1), Q = A(""), be = A(!1), $ = A(), xe = A(""), Se = A(!1), Ce = A(!1), we = A(!1), Te = A("field"), Ee = A([]), De = A(""), Oe = A(!1), ke = A(!1);
		R(ye, (e) => {
			e || (Q.value = "");
		});
		let Ae, je, Me, Ne, Pe, Fe = new AbortController(), Ie, Le = "", Re = v(() => D(["cms_translation:edit"])), ze = v(() => D(["cms_translation:config"])), Be = v(() => D(["cms_translation:translate"])), Ve = v(() => Y.value || Se.value || Oe.value), He = v(() => ir(F.value, G.value).length > 0), Ue = v(() => nr(k.value?.done || 0, k.value?.total || 0)), We = v(() => ({
			space_id: de.value,
			module: j.value.split(":")[0],
			kind: j.value.endsWith(":category") ? "category" : "content"
		})), Ge = v(() => k.value?.spaces.map((e) => ({
			label: e.label + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		})) || []), Ke = v(() => k.value?.locales.filter((e) => e.code !== k.value?.source_locale) || []), qe = v(() => Ke.value.map((e) => ({
			label: `${e.flag} ${e.label}`,
			value: e.code
		}))), Je = v(() => Ke.value.map((e) => ({
			label: `${e.label} · ${e.code}`,
			value: e.code
		}))), Ye = v(() => qe.value.filter((e) => nt(String(e.value)))), Xe = v(() => k.value?.locales.find((e) => e.code === k.value?.source_locale)?.label || k.value?.source_locale || "简体中文"), Ze = v(() => F.value?.fields.find((e) => e.key === me.value)), Qe = v(() => {
			let e = k.value?.modules.find((e) => e.key === j.value);
			return e?.kind === "category" ? `${k.value?.modules.find((t) => t.module === e.module && t.kind === "content")?.label || ""}分类` : e?.label || "新闻";
		}), $e = v(() => {
			let e = [];
			for (let t of k.value?.modules || []) {
				let n = e.find((e) => e[0].module === t.module);
				n ? n.push(t) : e.push([t]);
			}
			return e;
		}), et = v(() => !!de.value && k.value?.space_enabled && !!k.value.target_locales.length && !sr(Z.value) && !Ve.value && !He.value && !K.value && !q.value), tt = v(() => Z.value ? nr([
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
				let t = await ae(de.value || void 0, e.signal);
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
				let t = await ae(e, Fe.signal);
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
				let n = await te(t, H.value, U.value, e.signal);
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
				let n = await s({ ...We.value }, e, t.signal);
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
					let t = await g({ ...We.value }, F.value.id, e);
					F.value = t, G.value = ar(t);
					let n = M.value.findIndex((e) => e.id === t.id);
					n >= 0 && (M.value[n] = t), ie.success("翻译已保存"), mt();
				} catch (e) {
					X.value = ur(e);
				} finally {
					Y.value = !1;
				}
			}
		}
		async function vt(e) {
			_e.value = e, await se();
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
					$.value = await m(de.value, Fe.signal);
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
					await T($.value, Q.value.trim()), Q.value = "", ye.value = !1, ie.success("翻译配置已保存"), await pt();
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
					await E($.value.space_id, $.value.space_revision, Q.value.trim()), ie.success("Google Translate 连接成功");
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
					let e = await a({ ...We.value }, {
						request_key: Le,
						target_locales: Ee.value,
						...Te.value === "field" ? {
							id: L.value,
							field_name: me.value
						} : { keyword: H.value }
					});
					Z.value = e.job, we.value = !1, ie.success("翻译任务已提交"), wt();
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
				let n = await ee(e, Fe.signal);
				if (e !== de.value) return;
				Z.value = n.job, t && !sr(Z.value) && (await mt(), !He.value && !Ve.value && L.value && await gt(L.value));
			} catch {}
			wt();
		}
		async function Et() {
			if (Z.value) try {
				let e = await n(de.value, Z.value.id);
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
		}), (t, n) => (O(), x("section", {
			class: "translations-page",
			"aria-label": "多语言翻译管理",
			"aria-busy": K.value
		}, [
			S("header", fr, [S("div", pr, [S("span", mr, [w(P(p), {
				name: "globe",
				size: 21
			})]), S("div", null, [n[21] ||= S("h1", null, "语言翻译管理", -1), S("div", hr, [
				S("strong", null, N(Ue.value) + "%", 1),
				w(P(r), {
					percentage: Ue.value,
					"show-text": !1,
					"stroke-width": 4,
					"aria-label": "全部翻译完成度"
				}, null, 8, ["percentage"]),
				S("span", null, N(k.value?.done.toLocaleString() || 0) + " / " + N(k.value?.total.toLocaleString() || 0) + " 个目标字段", 1)
			])])]), S("div", gr, [
				w(P(u), {
					"model-value": de.value,
					options: Ge.value,
					size: "sm",
					disabled: K.value || Ve.value,
					placeholder: "内容空间",
					"aria-label": "内容空间",
					"onUpdate:modelValue": n[0] ||= (e) => ct(String(e))
				}, null, 8, [
					"model-value",
					"options",
					"disabled"
				]),
				S("span", _r, [n[22] ||= C("内容源语言 ", -1), S("b", null, N(Xe.value), 1)]),
				ze.value ? (O(), y(P(f), {
					key: 0,
					size: "sm",
					disabled: !de.value || Ve.value,
					onClick: yt
				}, {
					icon: z(() => [w(P(p), {
						name: "sliders-horizontal",
						size: 14
					})]),
					default: z(() => [n[23] ||= C("翻译配置", -1)]),
					_: 1
				}, 8, ["disabled"])) : b("", !0),
				Be.value ? (O(), y(P(f), {
					key: 1,
					size: "sm",
					disabled: !et.value,
					onClick: n[1] ||= (e) => St("batch")
				}, {
					icon: z(() => [w(P(p), {
						name: "rocket",
						size: 14
					})]),
					default: z(() => [n[24] ||= C("批量翻译", -1)]),
					_: 1
				}, 8, ["disabled"])) : b("", !0),
				Be.value ? (O(), y(P(f), {
					key: 2,
					size: "sm",
					disabled: !et.value || !F.value || !Ze.value?.translatable,
					onClick: n[2] ||= (e) => St("field")
				}, {
					icon: z(() => [w(P(p), {
						name: "globe",
						size: 14
					})]),
					default: z(() => [n[25] ||= C("翻译当前字段", -1)]),
					_: 1
				}, 8, ["disabled"])) : b("", !0),
				Re.value ? (O(), y(P(f), {
					key: 3,
					size: "sm",
					variant: "primary",
					loading: Y.value,
					disabled: !He.value || Ve.value || !k.value?.space_enabled,
					onClick: _t
				}, {
					icon: z(() => [w(P(p), {
						name: "save",
						size: 14
					})]),
					default: z(() => [n[26] ||= C("保存翻译", -1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : b("", !0)
			])]),
			X.value ? (O(), y(P(c), {
				key: 0,
				type: "error",
				closable: !0,
				onClose: n[3] ||= (e) => X.value = ""
			}, {
				default: z(() => [C(N(X.value), 1)]),
				_: 1
			})) : b("", !0),
			k.value && !k.value.space_enabled && de.value ? (O(), y(P(c), {
				key: 1,
				type: "warning"
			}, {
				default: z(() => [...n[27] ||= [C("当前内容空间已停用，仅可查看翻译。", -1)]]),
				_: 1
			})) : b("", !0),
			k.value && !k.value.target_locales.length && de.value ? (O(), y(P(c), {
				key: 2,
				type: "info"
			}, {
				default: z(() => [...n[28] ||= [C("尚未启用目标语言，请在“翻译配置”中选择语言后开始翻译。", -1)]]),
				_: 1
			})) : b("", !0),
			Z.value ? (O(), x("div", vr, [
				w(P(p), {
					name: P(sr)(Z.value) ? "loader-circle" : "info",
					size: 15
				}, null, 8, ["name"]),
				S("strong", null, N(P(cr)[Z.value.status] || Z.value.status), 1),
				S("span", null, "任务 #" + N(Z.value.id), 1),
				w(P(r), {
					percentage: tt.value,
					"show-text": !1,
					"stroke-width": 4
				}, null, 8, ["percentage"]),
				S("span", null, [
					C(N(Z.value.counts.succeeded || 0) + " / " + N(Z.value.total) + " 已完成", 1),
					Z.value.counts.failed ? (O(), x("span", yr, " · " + N(Z.value.counts.failed) + " 失败", 1)) : b("", !0),
					Z.value.counts.skipped ? (O(), x("span", br, " · " + N(Z.value.counts.skipped) + " 冲突跳过", 1)) : b("", !0)
				]),
				P(sr)(Z.value) && Be.value ? (O(), y(P(f), {
					key: 0,
					size: "sm",
					variant: "text",
					disabled: Ve.value,
					onClick: Et
				}, {
					default: z(() => [...n[29] ||= [C("取消任务", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (O(), y(P(f), {
					key: 1,
					size: "sm",
					variant: "text",
					onClick: n[4] ||= (e) => Z.value = null
				}, {
					default: z(() => [...n[30] ||= [C("收起", -1)]]),
					_: 1
				})),
				Z.value.errors.length ? (O(), x("span", {
					key: 2,
					class: "translation-job__error",
					title: Z.value.errors.map((e) => `${e.target_locale}: ${e.error_code}`).join("；")
				}, N(Z.value.errors[0].error_code) + "（可重新提交补翻）", 9, xr)) : b("", !0)
			])) : b("", !0),
			S("div", Sr, [(O(!0), x(_, null, fe(Ke.value, (e) => (O(), x("button", {
				key: e.code,
				type: "button",
				class: ce(["language-card", {
					"is-active": _e.value === e.code,
					"is-disabled": !nt(e.code)
				}]),
				disabled: !nt(e.code),
				title: nt(e.code) ? `${e.native}：${e.done} / ${e.total}` : "请在翻译配置中启用",
				onClick: (t) => vt(e.code)
			}, [
				S("span", null, N(e.flag), 1),
				S("span", null, N(e.label), 1),
				S("strong", null, N(nt(e.code) ? P(nr)(e.done, e.total) + "%" : "未启用"), 1),
				w(P(r), {
					percentage: P(nr)(e.done, e.total),
					"show-text": !1,
					"stroke-width": 2
				}, null, 8, ["percentage"])
			], 10, Cr))), 128))]),
			S("nav", wr, [(O(!0), x(_, null, fe($e.value, (e) => (O(), x("div", {
				key: e[0].module,
				class: "module-group"
			}, [(O(!0), x(_, null, fe(e, (e) => (O(), y(P(f), {
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
					e.kind === "category" ? b("", !0) : (O(), y(P(p), {
						key: 0,
						name: it(e.module),
						size: 14
					}, null, 8, ["name"])),
					C(N(e.label), 1),
					S("span", Tr, N(e.count), 1)
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
			S("main", Er, [S("aside", Dr, [
				S("div", Or, [S("div", null, [S("strong", null, N(Qe.value), 1), S("span", null, N(W.value) + " 条" + N(We.value.kind === "category" ? "分类" : "内容"), 1)]), w(P(h), {
					modelValue: V.value,
					"onUpdate:modelValue": n[5] ||= (e) => V.value = e,
					size: "sm",
					clearable: "",
					placeholder: "搜索内容",
					"aria-label": "搜索内容",
					onKeydown: B(dt, ["enter"])
				}, {
					prefix: z(() => [w(P(p), {
						name: "search",
						size: 14
					})]),
					_: 1
				}, 8, ["modelValue"])]),
				S("div", {
					class: "content-browser__list",
					"aria-busy": q.value
				}, [q.value ? (O(), x("p", Ar, "加载内容中…")) : (O(), x(_, { key: 1 }, [(O(!0), x(_, null, fe(M.value, (e) => (O(), x("button", {
					key: e.id,
					type: "button",
					class: ce(["content-item", { "is-selected": L.value === e.id }]),
					"aria-current": L.value === e.id ? "true" : void 0,
					disabled: Ve.value,
					onClick: (t) => ft(e.id)
				}, [S("span", Mr, [S("strong", { title: e.title }, N(e.title), 9, Nr), S("small", null, N(P(lr)[e.publish_status || ""] || "分类") + " · " + N(e.done) + "/" + N(e.total), 1)]), w(P(r), {
					type: "circle",
					percentage: P(nr)(e.done, e.total),
					"show-text": !1,
					size: 16,
					"stroke-width": 2,
					status: e.total && e.done === e.total ? "success" : "warning"
				}, null, 8, ["percentage", "status"])], 10, jr))), 128)), M.value.length ? b("", !0) : (O(), x("p", Pr, N(H.value ? "没有匹配的内容" : "暂无可翻译内容"), 1))], 64))], 8, kr),
				S("footer", Fr, [
					w(P(f), {
						size: "sm",
						"icon-only": "",
						"aria-label": "上一页",
						disabled: U.value <= 1 || q.value || Ve.value,
						onClick: n[6] ||= (e) => ut(U.value - 1)
					}, {
						default: z(() => [w(P(p), {
							name: "chevron-left",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"]),
					S("span", null, N(U.value) + " / " + N(Math.max(1, Math.ceil(W.value / 30))), 1),
					w(P(f), {
						size: "sm",
						"icon-only": "",
						"aria-label": "下一页",
						disabled: U.value * 30 >= W.value || q.value || Ve.value,
						onClick: n[7] ||= (e) => ut(U.value + 1)
					}, {
						default: z(() => [w(P(p), {
							name: "chevron-right",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"])
				])
			]), S("section", {
				class: "translation-editor",
				"aria-busy": J.value
			}, [J.value ? (O(), x("div", Lr, [w(P(p), {
				name: "loader-circle",
				size: 28
			}), n[31] ||= S("p", null, "加载译文中…", -1)])) : F.value ? (O(), x(_, { key: 1 }, [S("header", Rr, [S("div", zr, [S("span", null, [C(N(Qe.value) + " ", 1), He.value ? (O(), x("em", Br, "有未保存修改")) : b("", !0)]), S("h2", { title: F.value.title }, N(F.value.title), 9, Vr)]), w(P(re), {
				modelValue: me.value,
				"onUpdate:modelValue": n[8] ||= (e) => me.value = e
			}, {
				default: z(() => [(O(!0), x(_, null, fe(F.value.fields, (e) => (O(), y(P(ne), {
					key: e.key,
					name: e.key,
					label: `${e.label} ${e.translatable ? P(or)(e) + "/" + e.translations.length : "—"}`
				}, null, 8, ["name", "label"]))), 128))]),
				_: 1
			}, 8, ["modelValue"])]), Ze.value ? (O(), x("div", {
				key: 0,
				class: "translation-editor__body",
				ref_key: "editorBody",
				ref: ve
			}, [
				S("section", Hr, [S("div", Ur, [S("strong", null, [C(N(Xe.value) + " ", 1), w(P(l), {
					size: "sm",
					type: "primary",
					effect: "soft"
				}, {
					default: z(() => [...n[32] ||= [C("内容源语言", -1)]]),
					_: 1
				})]), n[33] ||= S("span", null, "只读原文", -1)]), S("textarea", {
					value: Ze.value.source,
					readonly: "",
					rows: Ze.value.key === "body_html" ? 5 : 2,
					class: "translation-textarea source-textarea",
					"aria-label": `原文${Ze.value.label}`
				}, null, 8, Wr)]),
				S("div", Gr, [n[34] ||= S("strong", null, "目标语言", -1), S("span", null, N(F.value.fields.find((e) => e.key === me.value)?.translations.length || 0) + " 种语言 · 手工修改后请保存", 1)]),
				Ze.value.translatable ? Ze.value.translations.length ? (O(), x("div", {
					key: 2,
					class: ce(["target-grid", { "is-body": me.value === "body_html" }])
				}, [(O(!0), x(_, null, fe(Ze.value.translations, (e) => (O(), x("div", {
					key: e.locale,
					class: ce(["target-field", { "is-focused": _e.value === e.locale }]),
					"data-locale": e.locale
				}, [
					S("div", Yr, [S("label", { for: `translation-${me.value}-${e.locale}` }, [C(N(rt(e.locale)?.native || e.locale) + " ", 1), S("small", null, N(e.locale), 1)], 8, Xr), e.status === "stale" ? (O(), x("span", Zr, "原文已更新")) : e.status === "ready" ? (O(), x("span", Qr, N(e.method === "machine" ? "机器翻译" : "已保存"), 1)) : b("", !0)]),
					pe(S("textarea", {
						id: `translation-${me.value}-${e.locale}`,
						"onUpdate:modelValue": (t) => G.value[P(rr)(me.value, e.locale)] = t,
						class: "translation-textarea",
						rows: me.value === "body_html" ? 10 : 2,
						maxlength: Ze.value.max_length,
						disabled: !Re.value || !k.value?.space_enabled || Ve.value,
						dir: e.locale === "ar" ? "rtl" : "auto",
						placeholder: `请输入${rt(e.locale)?.native || e.locale}翻译${me.value === "body_html" ? "（HTML）" : ""}`
					}, null, 8, $r), [[I, G.value[P(rr)(me.value, e.locale)]]]),
					S("div", ei, N((G.value[P(rr)(me.value, e.locale)] || "").length.toLocaleString()) + " / " + N(Ze.value.max_length.toLocaleString()), 1)
				], 10, Jr))), 128))], 2)) : (O(), x("div", qr, " 请先在“翻译配置”中启用目标语言。 ")) : (O(), x("div", Kr, [w(P(p), {
					name: "info",
					size: 18
				}), n[35] ||= C("原文字段为空，不参与翻译和完成度统计。 ", -1)]))
			], 512)) : b("", !0)], 64)) : (O(), x("div", ti, [w(P(oe), { description: X.value ? "内容加载失败，可点击刷新重试" : "选择左侧内容开始翻译" }, null, 8, ["description"]), X.value ? (O(), y(P(f), {
				key: 0,
				size: "sm",
				onClick: pt
			}, {
				default: z(() => [...n[36] ||= [C("重新加载", -1)]]),
				_: 1
			})) : b("", !0)]))], 8, Ir)]),
			w(P(o), {
				modelValue: ye.value,
				"onUpdate:modelValue": n[16] ||= (e) => ye.value = e,
				title: "翻译配置",
				subtitle: "当前内容空间共用 · Google Cloud Translation Basic v2",
				width: "560px",
				"close-on-click-modal": !1,
				"before-close": () => !Se.value && !Ce.value
			}, {
				footer: z(() => [
					w(P(f), {
						loading: Ce.value,
						disabled: !$.value?.credential_configured && !Q.value.trim() || Se.value || be.value,
						onClick: xt
					}, {
						default: z(() => [...n[43] ||= [C("测试连接", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"]),
					w(P(f), {
						disabled: Se.value || Ce.value,
						onClick: n[15] ||= (e) => ye.value = !1
					}, {
						default: z(() => [...n[44] ||= [C("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					w(P(f), {
						variant: "primary",
						loading: Se.value,
						disabled: !$.value || be.value || Ce.value,
						onClick: bt
					}, {
						default: z(() => [...n[45] ||= [C("保存翻译配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])
				]),
				default: z(() => [xe.value ? (O(), y(P(c), {
					key: 0,
					type: "error"
				}, {
					default: z(() => [C(N(xe.value), 1)]),
					_: 1
				})) : b("", !0), be.value ? (O(), x("div", ni, "加载配置中…")) : $.value ? (O(), x("div", ri, [
					S("label", null, [n[37] ||= C(" 目标语言 ", -1), w(P(u), {
						modelValue: $.value.target_locales,
						"onUpdate:modelValue": n[9] ||= (e) => $.value.target_locales = e,
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
					w(e, {
						modelValue: $.value.is_enabled,
						"onUpdate:modelValue": n[10] ||= (e) => $.value.is_enabled = e,
						disabled: Se.value || Ce.value,
						"credential-ready": !!$.value.credential_configured || !!Q.value.trim()
					}, null, 8, [
						"modelValue",
						"disabled",
						"credential-ready"
					]),
					S("div", ii, [
						S("label", null, [n[38] ||= C(" Google API Key ", -1), w(P(h), {
							modelValue: Q.value,
							"onUpdate:modelValue": n[11] ||= (e) => Q.value = e,
							type: "password",
							autocomplete: "new-password",
							disabled: Se.value || Ce.value,
							placeholder: $.value.credential_configured ? "已配置，留空保留原密钥；输入新密钥替换" : "请输入 Google Cloud Translation API Key"
						}, null, 8, [
							"modelValue",
							"disabled",
							"placeholder"
						])]),
						$.value.api_key_mask ? (O(), x("small", ai, N($.value.credential_source === "database" ? "数据库密钥" : "环境配置密钥") + "：" + N($.value.api_key_mask), 1)) : b("", !0),
						$.value.credential_error === "GOOGLE_CREDENTIAL_DECRYPT_FAILED" ? (O(), x("small", oi, "数据库密钥无法解密，请检查两套后台的专用加密配置，或输入新密钥替换。")) : (O(), x("small", si, "密钥加密保存，不回显原文；留空保留原值。未配置密钥时仍可人工翻译。"))
					]),
					S("div", ci, [
						S("label", null, [n[39] ||= C(" 并发上限 ", -1), w(P(i), {
							modelValue: $.value.concurrency_limit,
							"onUpdate:modelValue": n[12] ||= (e) => $.value.concurrency_limit = e,
							min: 1,
							max: 20,
							disabled: Se.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])]),
						S("label", null, [n[40] ||= C(" 请求超时（秒） ", -1), w(P(i), {
							modelValue: $.value.request_timeout_seconds,
							"onUpdate:modelValue": n[13] ||= (e) => $.value.request_timeout_seconds = e,
							min: 1,
							max: 120,
							disabled: Se.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])]),
						S("label", null, [n[41] ||= C(" 最大尝试次数 ", -1), w(P(i), {
							modelValue: $.value.max_attempts,
							"onUpdate:modelValue": n[14] ||= (e) => $.value.max_attempts = e,
							min: 1,
							max: 10,
							disabled: Se.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])])
					]),
					$.value.supported ? b("", !0) : (O(), y(P(c), {
						key: 0,
						type: "warning"
					}, {
						default: z(() => [...n[42] ||= [C("当前空间关联了其他版本的翻译配置。保存将为该空间创建独立的 Google v2 配置，不修改其他空间。", -1)]]),
						_: 1
					}))
				])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			w(P(o), {
				modelValue: we.value,
				"onUpdate:modelValue": n[19] ||= (e) => we.value = e,
				title: Te.value === "field" ? "翻译当前字段" : "批量翻译",
				subtitle: "Google Translate · 仅补齐缺失及原文已更新的译文",
				width: "520px",
				"close-on-click-modal": !1,
				"before-close": () => !Oe.value
			}, {
				footer: z(() => [w(P(f), {
					size: "sm",
					disabled: Oe.value,
					onClick: n[18] ||= (e) => we.value = !1
				}, {
					default: z(() => [...n[47] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(P(f), {
					variant: "primary",
					size: "sm",
					loading: Oe.value,
					disabled: !Ee.value.length,
					onClick: Ct
				}, {
					default: z(() => [...n[48] ||= [C("确认翻译", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])]),
				default: z(() => [S("div", li, [
					S("p", null, N(Te.value === "field" ? `当前内容的「${Ze.value?.label}」` : `当前空间「${Qe.value}」${H.value ? "中匹配搜索条件的内容" : "全部内容"}`), 1),
					w(P(d), { label: "目标语言" }, {
						default: z(() => [w(P(u), {
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
					w(P(c), { type: "warning" }, {
						default: z(() => [...n[46] ||= [C("内容将发送至 Google Translate，并可能产生翻译费用。已有有效译文不会覆盖；单次最多 200 条内容、5,000 个字段任务。后台任务需要已启动翻译 worker。", -1)]]),
						_: 1
					}),
					De.value ? (O(), y(P(c), {
						key: 0,
						type: "error"
					}, {
						default: z(() => [C(N(De.value), 1)]),
						_: 1
					})) : b("", !0)
				])]),
				_: 1
			}, 8, [
				"modelValue",
				"title",
				"before-close"
			]),
			w(P(o), {
				modelValue: ke.value,
				"onUpdate:modelValue": n[20] ||= (e) => ke.value = e,
				title: "有未保存的翻译",
				subtitle: "切换后将丢弃当前修改，是否继续？",
				width: "380px",
				onClose: st
			}, {
				footer: z(() => [w(P(f), {
					size: "sm",
					onClick: st
				}, {
					default: z(() => [...n[49] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(P(f), {
					size: "sm",
					variant: "warning",
					onClick: ot
				}, {
					default: z(() => [...n[50] ||= [C("放弃修改并继续", -1)]]),
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
}, gi = { key: 3 }, _i = ["disabled"], vi = /*#__PURE__*/ g(/* @__PURE__ */ T({
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
		}, r = t.runtime.mode === "white_label" && !!t.runtime.resolveSiteInRequest, i = A(!1), a = A(0), o = A([]), s = A(""), c = A(""), l = A(t.runtime.mode === "white_label" && !r), u = A(!1), ee = v(() => o.value.find((e) => e.site_id === s.value)), te = v(() => n[t.page]), ne = v(() => t.runtime.hasPermission([
			"cms_news:add",
			"cms_academy:add",
			"cms_help:add",
			"cms_announcement:add"
		])), re = new AbortController(), ie = !0, ae = !1;
		function d(e) {
			ae = !0;
			try {
				o.value = e.sites, s.value = e.site_id ?? "", i.value = !0;
			} finally {
				ae = !1;
			}
		}
		let oe = H(t.runtime, d);
		R(s, () => {
			!r || ae || (oe.invalidate(), oe = H(t.runtime, d, ee.value?.space_id ?? null), a.value++);
		}, { flush: "sync" });
		function f(e, n) {
			if (!ie || t.runtime.mode === "white_label" && ee.value?.space_id !== n) throw Error("站点已切换，请重新操作");
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
				let e = ee.value?.space_id;
				return {
					get: (n, r) => t.runtime.request.get(f(n, e), r),
					post: (n, r) => t.runtime.request.post(f(n, e), r)
				};
			}
		});
		async function p() {
			let e = await t.runtime.request.get({
				url: "/cms/sites",
				signal: re.signal
			});
			re.signal.aborted || (o.value = e.sites, o.value.some((e) => e.site_id === s.value) || (s.value = o.value[0]?.site_id ?? ""));
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
				if (!ie || r && e !== a.value) return;
				if (r) {
					if (!n.cms_context) throw Error("初始化接口未返回站点信息");
					oe.invalidate(), oe = H(t.runtime, d, n.cms_context.space_id), d(n.cms_context), a.value++;
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
				re.signal.aborted || (c.value = "加载站点失败，请刷新重试");
			} finally {
				l.value = !1;
			}
		}), le(() => {
			ie = !1, oe.invalidate(), re.abort();
		}), (t, n) => (O(), x("section", { class: ce(["mm-cms-page", { "is-viewport": e.viewport }]) }, [e.runtime.mode === "white_label" && e.showSiteSelector && (!P(r) || i.value) ? (O(), x("header", di, [S("label", null, [n[1] ||= C("内容站点 ", -1), pe(S("select", {
			"onUpdate:modelValue": n[0] ||= (e) => s.value = e,
			disabled: l.value
		}, [(O(!0), x(_, null, fe(o.value, (e) => (O(), x("option", {
			key: e.site_id,
			value: e.site_id
		}, N(e.label), 9, pi))), 128))], 8, fi), [[F, s.value]])]), n[2] ||= S("span", null, "各站点内容独立管理", -1)])) : b("", !0), c.value ? (O(), x("p", mi, N(c.value), 1)) : l.value ? (O(), x("p", hi, "正在加载站点…")) : e.runtime.mode === "white_label" && (!P(r) || i.value) && !ee.value?.space_id ? (O(), x("div", gi, [S("p", null, N(ee.value ? "该站点尚未初始化内容空间。" : "暂无可管理的内容站点。"), 1), ee.value && ne.value ? (O(), x("button", {
			key: 0,
			type: "button",
			disabled: u.value,
			onClick: m
		}, "初始化空内容空间", 8, _i)) : b("", !0)])) : (O(), y(j(te.value), { key: `${e.page}:${e.identityKey}:${P(r) ? a.value : ee.value?.space_id ?? "platform"}` }))], 2));
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