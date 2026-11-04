import { $n as e, A as t, Bt as n, Ci as r, Di as i, Dn as a, En as o, Er as s, Gr as c, J as l, M as u, Qr as ee, Sr as te, Y as d, d as ne, hr as f, vi as re, yr as ie, yt as ae } from "./src-Dvpw8nlM.js";
import { d as oe, n as p, t as m, u as h } from "./_plugin-vue_export-helper-DsPr7-pr.js";
import { Fragment as se, computed as g, createBlock as _, createCommentVNode as v, createElementBlock as y, createElementVNode as b, createTextVNode as x, createVNode as S, defineComponent as C, inject as w, mergeProps as T, nextTick as E, normalizeClass as D, onBeforeUnmount as ce, onMounted as le, openBlock as O, provide as ue, reactive as de, ref as k, renderList as fe, resolveDynamicComponent as A, shallowRef as j, toDisplayString as M, unref as N, vModelSelect as P, vModelText as F, vShow as I, watch as L, withCtx as R, withDirectives as z, withKeys as B, withModifiers as V } from "vue";
//#region src/cms/runtime.ts
var H = Symbol("MmCms");
function pe() {
	let e = w(H);
	if (!e) throw Error("CMS host adapter is missing");
	return e;
}
function me(e) {
	pe().registerBeforeLeave?.(e);
}
//#endregion
//#region src/cms/site-transport.ts
function U(e, t, n) {
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
function he() {
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
	if (pe().mode === "white_label") return {
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
	return le(async () => {
		try {
			let t = await e(r.signal);
			!r.signal.aborted && n[1].type === "select" && (n[1].options = [{
				label: "全部白标",
				value: ""
			}, ...t.cms_source_options || []]);
		} catch {
			n[1].type === "select" && (n[1].disabled = !0);
		}
	}), ce(() => {
		r.abort(), i?.abort();
	}), {
		fields: n,
		bindFilters: (r) => {
			L(() => r.value.cms_source_type, (e) => {
				e === "platform" && (r.value.cms_tenant_id = ""), n[1].disabled = e === "platform";
			}, {
				immediate: !0,
				flush: "sync"
			}), t && L(() => [r.value.cms_source_type, r.value.cms_tenant_id], () => {
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
var G = /* @__PURE__ */ C({
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
		}, i = g(() => t.sourceType ? n[t.sourceType] : "-"), a = g(() => t.sourceType ? r[t.sourceType] : "default");
		return (e, t) => (O(), _(N(ie), {
			effect: "soft",
			round: "",
			size: "sm",
			type: a.value
		}, {
			default: R(() => [x(M(i.value), 1)]),
			_: 1
		}, 8, ["type"]));
	}
});
//#endregion
//#region src/cms/api/content/news.ts
function K() {
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
var q = ["aria-checked", "disabled"], ge = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "EnabledToggle",
	props: {
		modelValue: { type: Boolean },
		disabled: { type: Boolean }
	},
	emits: ["update:modelValue"],
	setup(e) {
		return (t, n) => (O(), y("button", {
			type: "button",
			role: "switch",
			class: D(["news-toggle", { "is-on": e.modelValue }]),
			"aria-checked": e.modelValue,
			"aria-label": "启用状态",
			disabled: e.disabled,
			onClick: n[0] ||= (n) => t.$emit("update:modelValue", !e.modelValue)
		}, [n[1] ||= b("span", {
			class: "news-toggle__track",
			"aria-hidden": "true"
		}, [b("span")], -1), b("span", null, M(e.modelValue ? "已启用" : "已停用"), 1)], 10, q));
	}
}), [["__scopeId", "data-v-8b527db1"]]), J = { class: "news-categories" }, Y = ["aria-busy"], X = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Z = { class: "taxonomy-editor__field" }, _e = { class: "taxonomy-editor__row" }, ve = "分类", Q = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let { newsError: t, deleteNews: s, getNewsMetadata: c, getNewsList: l, getNewsDetail: u, saveNews: d } = K(), { hasPermission: ne } = pe(), { formatDateTime: oe } = pe(), m = (e) => ne([`cms_news_category:${e}`]), se = k(), C = k(), w = W(c, (e) => {
			se.value = e;
		}), E = [
			...he(),
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
		], { proTableBindings: D, reload: ue, filters: fe } = ee({
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
		w.bindFilters(fe);
		let A = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), j = de(A()), P = k(!1), F = k(!1), I = k(!1), L = k(!1), z = k(!1), B = k(""), H = k(!1), me = k(""), U = k(!1), q = g(() => !m(j.id ? "edit" : "add")), Q = g(() => I.value || L.value), ye = "", be;
		async function xe(e) {
			be?.abort(), be = new AbortController();
			let n = be;
			Object.assign(j, A(), { id: e || "" }), me.value = "", z.value = !1, B.value = "", H.value = !1, P.value = !0, F.value = !0, ye = JSON.stringify(j);
			try {
				if (C.value = await c(n.signal, { cms_source_type: "platform" }), !e || n.signal.aborted) return;
				let t = await u("categories", e, n.signal);
				if (C.value = await c(n.signal, { space_id: String(t.space_id) }), n.signal.aborted) return;
				Object.assign(j, {
					id: t.id,
					row_version: t.row_version,
					name: t.name,
					code: t.code,
					parent_id: t.parent_id || "",
					sort_order: t.sort_order,
					is_enabled: t.is_enabled
				}), ye = JSON.stringify(j);
			} catch (e) {
				n.signal.aborted || (H.value = !0, me.value = t(e));
			} finally {
				n.signal.aborted || (F.value = !1);
			}
		}
		function $() {
			return Q.value ? !1 : !F.value && !H.value && JSON.stringify(j) !== ye ? (U.value = !0, !1) : (be?.abort(), !0);
		}
		function Se() {
			Q.value || (be?.abort(), P.value = !1);
		}
		function Ce() {
			U.value = !1, P.value = !1;
		}
		async function we() {
			if (!(q.value || Q.value || F.value || H.value)) {
				if (!j.name.trim() || j.sort_order === null) {
					me.value = "请填写分类名称和排序";
					return;
				}
				I.value = !0, me.value = "";
				try {
					await d("categories", {
						name: j.name,
						parent_id: j.parent_id || null,
						sort_order: j.sort_order,
						is_enabled: j.is_enabled,
						id: j.id || void 0,
						row_version: j.id ? j.row_version : void 0
					}), P.value = !1, ae.success("保存成功"), await Promise.all([ue(), ke()]);
				} catch (e) {
					me.value = t(e);
				} finally {
					I.value = !1;
				}
			}
		}
		function Te() {
			!j.id || !m("delete") || Q.value || F.value || H.value || (B.value = "", z.value = !0);
		}
		async function Ee() {
			if (!(!z.value || !j.id || !m("delete") || Q.value || F.value || H.value)) {
				L.value = !0, B.value = "";
				try {
					await s("categories", j.id, j.row_version), z.value = !1, P.value = !1, ae.success("分类已删除"), await Promise.all([ue(), ke()]);
				} catch (e) {
					B.value = t(e);
				} finally {
					L.value = !1;
				}
			}
		}
		let De = g(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(C.value?.categories || []).filter((e) => !e.parent_id && e.id !== j.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Oe = new AbortController();
		async function ke() {
			try {
				se.value = await c(Oe.signal);
			} catch {}
		}
		return le(ke), ce(() => {
			be?.abort(), Oe.abort();
		}), (e, t) => (O(), y("div", J, [
			S(N(te), T(N(D), {
				"auto-refreshable": !1,
				columns: E,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${ve}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": R(({ row: e }) => [S(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [m("add") ? (O(), _(N(i), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: t[0] ||= (e) => xe()
				}, {
					icon: R(() => [S(N(h), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [x("新增" + M(ve))]),
					_: 1
				})) : v("", !0)]),
				"cell-is_enabled": R(({ row: e }) => [S(N(ie), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [x(M(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": R(({ row: e }) => [S(N(i), {
					size: "sm",
					"icon-only": "",
					title: m("edit") ? `编辑${ve}` : `${ve}详情`,
					"aria-label": `编辑${ve}`,
					onClick: (t) => xe(e.id)
				}, {
					default: R(() => [S(N(h), {
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
			S(N(r), {
				modelValue: P.value,
				"onUpdate:modelValue": t[5] ||= (e) => P.value = e,
				title: `${j.id ? "编辑" : "新增"}新闻${ve}`,
				width: "680px",
				subtitle: "新闻分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": $
			}, {
				footer: R(() => [
					j.id && m("delete") ? (O(), _(N(i), {
						key: 0,
						variant: "danger",
						disabled: F.value || H.value || Q.value,
						onClick: Te
					}, {
						icon: R(() => [S(N(h), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [t[11] ||= x("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : v("", !0),
					S(N(i), {
						disabled: Q.value,
						onClick: Se
					}, {
						default: R(() => [...t[12] ||= [x("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					q.value ? v("", !0) : (O(), _(N(i), {
						key: 1,
						variant: "primary",
						loading: I.value,
						disabled: F.value || H.value || L.value,
						onClick: we
					}, {
						default: R(() => [x("保存" + M(ve))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [b("div", {
					class: "taxonomy-editor",
					"aria-busy": F.value
				}, [
					F.value ? (O(), y("div", X, [S(N(h), {
						name: "loader-circle",
						class: "news-spin",
						size: 24
					}), b("span", null, "正在读取" + M(ve) + "...")])) : v("", !0),
					me.value ? (O(), _(N(f), {
						key: 1,
						type: "error",
						closable: !1,
						description: me.value
					}, null, 8, ["description"])) : v("", !0),
					!F.value && !H.value ? (O(), _(N(a), {
						key: 2,
						model: j,
						"label-position": "top",
						onSubmit: V(we, ["prevent"])
					}, {
						default: R(() => [
							j.id ? (O(), _(N(o), {
								key: 0,
								label: "分类ID"
							}, {
								default: R(() => [S(N(p), {
									"model-value": j.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : v("", !0),
							S(N(o), {
								label: `${ve}名称`,
								required: ""
							}, {
								default: R(() => [S(N(p), {
									modelValue: j.name,
									"onUpdate:modelValue": t[1] ||= (e) => j.name = e,
									maxlength: 120,
									disabled: q.value || Q.value,
									"aria-label": `${ve}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							S(N(o), { label: "父分类" }, {
								default: R(() => [b("div", Z, [S(N(re), {
									modelValue: j.parent_id,
									"onUpdate:modelValue": t[2] ||= (e) => j.parent_id = e,
									options: De.value,
									disabled: q.value || Q.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), t[10] ||= b("p", { class: "news-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类新闻。 ", -1)])]),
								_: 1
							}),
							b("div", _e, [S(N(o), {
								label: "前端排序",
								required: ""
							}, {
								default: R(() => [S(N(n), {
									modelValue: j.sort_order,
									"onUpdate:modelValue": t[3] ||= (e) => j.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: q.value || Q.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), S(N(o), { label: "启用状态" }, {
								default: R(() => [S(ge, {
									modelValue: j.is_enabled,
									"onUpdate:modelValue": t[4] ||= (e) => j.is_enabled = e,
									disabled: q.value || Q.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : v("", !0)
				], 8, Y)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			S(N(r), {
				modelValue: z.value,
				"onUpdate:modelValue": t[7] ||= (e) => z.value = e,
				title: "删除新闻分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !L.value
			}, {
				footer: R(() => [S(N(i), {
					disabled: L.value,
					onClick: t[6] ||= (e) => z.value = !1
				}, {
					default: R(() => [...t[13] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(i), {
					variant: "danger",
					loading: L.value,
					onClick: Ee
				}, {
					default: R(() => [...t[14] ||= [x("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [b("p", null, "确认删除分类“" + M(j.name) + "”？有关联新闻或子分类的分类无法删除。", 1), B.value ? (O(), _(N(f), {
					key: 0,
					type: "error",
					closable: !1,
					description: B.value
				}, null, 8, ["description"])) : v("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			S(N(r), {
				modelValue: U.value,
				"onUpdate:modelValue": t[9] ||= (e) => U.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [S(N(i), { onClick: t[8] ||= (e) => U.value = !1 }, {
					default: R(() => [...t[15] ||= [x("继续编辑", -1)]]),
					_: 1
				}), S(N(i), {
					variant: "primary",
					onClick: Ce
				}, {
					default: R(() => [...t[16] ||= [x("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-30abf45a"]]), ye = {
	news: "新闻",
	help: "文章",
	announcement: "公告"
}, be = [
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
	let a = {}, o = ye[n];
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
function $(e, t) {
	let n = {}, r = [], i = ye[t], a = {
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
			let i = be.includes(s) ? s : e === t ? a[o] : void 0;
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
function Se(e, t, n, r) {
	let i = k(), a = k(), o = k(null), s = k(Date.now()), c = de({}), l = k(""), u = Object.fromEntries(be.map((e) => [e, {
		required: e === "title" || e === "category_id",
		trigger: "submit"
	}])), ee = g(() => o.value ? xe(e, t(), n, o.value === "draft" ? "draft" : e.scheduled_local ? "scheduled" : "published", s.value) : {}), te = g(() => ({
		...c,
		...ee.value
	})), d = g(() => Object.keys(te.value).length);
	for (let t of be) L(() => e[t], () => {
		delete c[t], l.value = "", s.value = Date.now();
	}, { deep: !0 });
	function ne() {
		te.value.seo_description && a.value?.focus();
	}
	async function f() {
		await E();
		let e = [...i.value?.querySelectorAll("[data-prop]") || []].find((e) => te.value[e.dataset.prop]);
		if (!e && te.value.seo_description) {
			r.value ? ne() : r.value = !0;
			return;
		}
		e && (e.scrollIntoView({
			block: "center",
			behavior: "auto"
		}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
	}
	async function re(e) {
		o.value = e === "draft" ? "draft" : "publish", s.value = Date.now(), l.value = "";
		for (let e of be) delete c[e];
		return d.value ? (await f(), !1) : !0;
	}
	function ie(e) {
		let t = $(e, n);
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
		focusFirstError: f,
		focusSeoError: ne
	};
}
//#endregion
//#region src/cms/views/content/components/CoverFileItem.vue?vue&type=script&setup=true&lang.ts
var Ce = {
	class: "file-list",
	"aria-label": "封面文件"
}, we = { class: "file-item" }, Te = { class: "file-icon" }, Ee = ["src"], De = [
	"href",
	"download",
	"title",
	"aria-busy",
	"aria-disabled"
], Oe = { class: "file-size" }, ke = ["disabled"], Ae = {
	key: 0,
	class: "file-error",
	role: "alert"
}, je = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "CoverFileItem",
	props: {
		url: {},
		file: {},
		disabled: { type: Boolean }
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = k(null), a = k(!1), o = k(!1), s = k(""), c, l = g(() => {
			try {
				let e = new URL(n.url, window.location.href);
				return ["http:", "https:"].includes(e.protocol) ? e.href : "";
			} catch {
				return "";
			}
		}), u = g(() => {
			if (n.file) return n.file.name;
			let e = l.value ? new URL(l.value).pathname.split("/").pop() : "";
			if (!e) return "封面图片";
			try {
				return decodeURIComponent(e);
			} catch {
				return e;
			}
		}), ee = g(() => i.value === null ? "大小未知" : i.value < 1024 ? `${i.value} B` : i.value < 1024 * 1024 ? `${(i.value / 1024).toFixed(1)} KB` : `${(i.value / (1024 * 1024)).toFixed(1)} MB`);
		L(() => [n.url, n.file], async (e, t, r) => {
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
		return ce(() => {
			c?.abort(), c = void 0;
		}), (t, n) => (O(), y("div", Ce, [b("div", we, [
			b("span", Te, [a.value ? (O(), _(N(h), {
				key: 1,
				name: "image",
				size: 20
			})) : (O(), y("img", {
				key: 0,
				src: e.url,
				alt: "封面缩略图",
				onError: n[0] ||= (e) => a.value = !0
			}, null, 40, Ee))]),
			b("a", {
				class: "file-name",
				href: l.value || void 0,
				download: u.value,
				title: u.value,
				"aria-busy": o.value,
				"aria-disabled": o.value || !l.value,
				onClick: V(te, ["prevent", "stop"])
			}, M(u.value), 9, De),
			b("span", Oe, M(ee.value), 1),
			b("button", {
				class: "file-remove",
				type: "button",
				"aria-label": "移除封面",
				title: "移除封面",
				disabled: e.disabled,
				onClick: n[1] ||= V((e) => r("remove"), ["stop"])
			}, [S(N(h), {
				name: "close",
				size: 14
			})], 8, ke)
		]), s.value ? (O(), y("span", Ae, M(s.value), 1)) : v("", !0)]));
	}
}), [["__scopeId", "data-v-389015f1"]]), Me = { class: "content-cover" }, Ne = { class: "content-cover__preview" }, Pe = ["src", "alt"], Fe = {
	key: 1,
	class: "content-cover__empty"
}, Ie = {
	key: 2,
	class: "content-cover__hint"
}, Le = {
	key: 0,
	class: "content-cover__error",
	role: "status"
}, Re = /*#__PURE__*/ m(/* @__PURE__ */ C({
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
		let n = e, r = t, i = k(), a = j(), o = k(!1), s = k(!1), c;
		L(() => n.modelValue, (e) => {
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
		function u() {
			E(() => i.value?.clearFiles());
		}
		function ee() {
			r("success"), u();
		}
		function te(e, t) {
			r("error", c ? c.error : t), c = void 0, u();
		}
		function d() {
			n.disabled || o.value || (a.value = void 0, s.value = !1, r("update:modelValue", ""));
		}
		return (t, n) => (O(), y("div", Me, [
			S(N(ne), {
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
				default: R(() => [b("div", Ne, [e.modelValue ? (O(), y("img", {
					key: 0,
					src: e.modelValue,
					alt: e.label,
					draggable: "false",
					onError: n[0] ||= (e) => s.value = !0,
					onLoad: n[1] ||= (e) => s.value = !1
				}, null, 40, Pe)) : (O(), y("div", Fe, [S(N(h), {
					name: "image",
					size: 28
				})])), e.modelValue ? v("", !0) : (O(), y("span", Ie, [x(M(o.value ? "正在上传…" : "拖动图片到此处，或点击上传") + " ", 1), n[3] ||= b("span", { class: "content-cover__types" }, "JPG / PNG / WebP，最大 5 MB", -1)]))])]),
				_: 1
			}, 8, ["disabled"]),
			s.value ? (O(), y("span", Le, " 封面无法加载，请重新上传 ")) : v("", !0),
			e.modelValue ? (O(), _(je, {
				key: 1,
				url: e.modelValue,
				file: a.value?.url === e.modelValue ? a.value.file : void 0,
				disabled: e.disabled || o.value,
				onRemove: d
			}, null, 8, [
				"url",
				"file",
				"disabled"
			])) : v("", !0)
		]));
	}
}), [["__scopeId", "data-v-8f5070ba"]]), ze = ["aria-busy"], Be = { class: "article-editor__header" }, Ve = { class: "article-editor__heading" }, He = { class: "article-editor__commands" }, Ue = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, We = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Ge = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, Ke = {
	key: 1,
	class: "article-editor__failure"
}, qe = {
	key: 0,
	class: "article-editor__error"
}, Je = { class: "article-editor__body" }, Ye = { class: "article-editor__settings" }, Xe = { class: "article-editor__content" }, Ze = ["aria-invalid", "disabled"], Qe = ["aria-invalid", "disabled"], $e = {
	class: "news-delete-dialog__icon",
	"aria-hidden": "true"
}, et = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(e, { emit: s }) {
		let { newsError: c, newsCategoryLabel: l, deleteNews: u, getNewsDetail: ee, getNewsMetadata: te, saveNews: d, uploadNewsCover: ne } = K(), { hasPermission: ie } = pe(), oe = e, m = s, C = k(!0), w = k(!1), T = k(!1), E = k(""), D = k(!1), ue = k(!1), fe = k(!1), A = k(!1), j = k(pe().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), P = k(), I = k("draft"), L = k(!1), B = g(() => ie(["cms_news:publish"])), H = g(() => !ie([`cms_news:${oe.articleId ? "edit" : "add"}`]) || !B.value && I.value !== "draft"), U = g(() => ie(["cms_news:delete"]) && (B.value || I.value === "draft"));
		async function he() {
			if (!(!U.value || w.value || C.value || T.value)) {
				w.value = !0, E.value = "";
				try {
					await u("articles", G.id, G.row_version), $ = JSON.stringify(G), ae.success("新闻已删除"), m("saved");
				} catch (e) {
					E.value = c(e), A.value = !1;
				} finally {
					w.value = !1;
				}
			}
		}
		let W = g(() => H.value || w.value), G = de({
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
		}), { editorRoot: q, seoInput: J, fieldRules: Y, fieldErrors: X, pendingCount: Z, saveError: _e, validateSave: ve, setSaveFailure: Q, focusFirstError: ye, focusSeoError: be } = Se(G, () => P.value?.categories || [], "news", D), xe = g(() => (P.value?.categories || []).map((e) => ({
			label: l(P.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), $ = "", Ce;
		function we(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Te() {
			Ce?.abort(), Ce = new AbortController();
			let e = Ce;
			C.value = !0, T.value = !1, E.value = "";
			try {
				if (P.value = await te(e.signal, { cms_source_type: "platform" }), oe.articleId) {
					let t = await ee("articles", oe.articleId, e.signal);
					if (P.value = await te(e.signal, { space_id: String(t.space_id) }), j.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					G.scheduled_local = t.publish_status === "scheduled" ? we(t.scheduled_at) : "", I.value = t.publish_status;
				}
				$ = JSON.stringify(G);
			} catch (t) {
				e.signal.aborted || (E.value = c(t), T.value = !0);
			} finally {
				e.signal.aborted || (C.value = !1);
			}
		}
		let Ee = () => !C.value && !T.value && $ !== JSON.stringify(G);
		function De() {
			Ee() ? ue.value = !0 : m("close");
		}
		function Oe() {
			I.value === "draft" ? Ae("draft") : fe.value = !0;
		}
		function ke() {
			fe.value = !1, Ae("draft");
		}
		async function Ae(e) {
			if (W.value || C.value || T.value || L.value || (E.value = "", !await ve(e))) return;
			let t = G.scheduled_local ? new Date(G.scheduled_local) : null;
			w.value = !0, E.value = "";
			try {
				await d("articles", {
					...G,
					id: G.id || void 0,
					row_version: G.id ? G.row_version : void 0,
					category_id: G.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), $ = JSON.stringify(G), ae.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "新闻已发布"), m("saved");
			} catch (e) {
				Q(e);
			} finally {
				w.value = !1;
			}
			Z.value && await ye();
		}
		function je(e) {
			E.value = c(e);
		}
		let Me = (e) => {
			Ee() && (e.preventDefault(), e.returnValue = "");
		};
		return me(() => !w.value && !L.value && (!Ee() || window.confirm("新闻有未保存的修改，确定离开？"))), le(() => {
			Te(), window.addEventListener("beforeunload", Me);
		}), ce(() => {
			Ce?.abort(), window.removeEventListener("beforeunload", Me);
		}), (s, c) => (O(), y("section", {
			ref_key: "editorRoot",
			ref: q,
			class: "article-editor",
			"aria-busy": C.value || w.value
		}, [
			b("header", Be, [
				S(N(i), {
					"icon-only": "",
					title: "返回新闻列表",
					"aria-label": "返回新闻列表",
					disabled: w.value || L.value,
					onClick: De
				}, {
					default: R(() => [S(N(h), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				b("div", Ve, [b("h2", null, M(e.articleId ? "编辑新闻" : "新增新闻"), 1), b("span", null, M(P.value?.source_locale || "zh-CN") + " · " + M(j.value), 1)]),
				b("div", He, [
					e.articleId && U.value ? (O(), _(N(i), {
						key: 0,
						size: "sm",
						disabled: C.value || T.value || w.value || L.value,
						onClick: c[0] ||= (e) => A.value = !0
					}, {
						default: R(() => [...c[28] ||= [x("删除新闻", -1)]]),
						_: 1
					}, 8, ["disabled"])) : v("", !0),
					S(N(i), {
						size: "sm",
						disabled: C.value || T.value,
						onClick: c[1] ||= (e) => D.value = !0
					}, {
						icon: R(() => [S(N(h), {
							name: "search",
							size: 14
						})]),
						default: R(() => [c[29] ||= x("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					H.value ? v("", !0) : (O(), _(N(i), {
						key: 1,
						size: "sm",
						disabled: C.value || T.value || w.value || L.value,
						onClick: Oe
					}, {
						icon: R(() => [S(N(h), {
							name: "save",
							size: 14
						})]),
						default: R(() => [c[30] ||= x("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					N(_e) ? (O(), y("span", Ue, M(N(_e)), 1)) : v("", !0),
					!H.value && N(Z) ? (O(), y("span", We, "还有 " + M(N(Z)) + " 项待完善", 1)) : v("", !0),
					!H.value && B.value ? (O(), _(N(i), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: C.value || T.value || L.value,
						loading: w.value,
						onClick: c[2] ||= (e) => Ae(G.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [S(N(h), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [x(M(G.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : v("", !0)
				])
			]),
			C.value ? (O(), y("div", Ge, [S(N(h), {
				name: "loader-circle",
				class: "news-spin",
				size: 28
			}), c[31] ||= b("span", null, "正在读取新闻资料...", -1)])) : T.value ? (O(), y("div", Ke, [S(N(f), {
				type: "error",
				description: E.value,
				closable: !1
			}, null, 8, ["description"]), S(N(i), { onClick: Te }, {
				default: R(() => [...c[32] ||= [x("重新加载", -1)]]),
				_: 1
			})])) : (O(), y(se, { key: 2 }, [E.value ? (O(), y("div", qe, [S(N(f), {
				type: "error",
				description: E.value,
				closable: !1
			}, null, 8, ["description"])])) : v("", !0), b("div", Je, [b("aside", Ye, [S(N(a), {
				model: G,
				rules: N(Y),
				"label-position": "top",
				onSubmit: c[12] ||= V(() => {}, ["prevent"])
			}, {
				default: R(() => [
					S(N(o), {
						label: "新闻分类",
						prop: "category_id",
						error: N(X).category_id,
						required: ""
					}, {
						default: R(() => [S(N(re), {
							modelValue: G.category_id,
							"onUpdate:modelValue": c[3] ||= (e) => G.category_id = e,
							options: xe.value,
							clearable: "",
							disabled: W.value,
							"aria-label": "新闻分类"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					c[33] ||= b("h3", null, "新闻设置", -1),
					S(N(o), {
						label: "新闻封面",
						prop: "cover_url",
						error: N(X).cover_url
					}, {
						default: R(() => [S(Re, {
							modelValue: G.cover_url,
							"onUpdate:modelValue": c[4] ||= (e) => G.cover_url = e,
							label: "新闻封面",
							disabled: W.value,
							upload: N(ne),
							onBusyChange: c[5] ||= (e) => L.value = e,
							onStart: c[6] ||= (e) => E.value = "",
							onError: je
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "内容来源",
						prop: "content_source",
						error: N(X).content_source
					}, {
						default: R(() => [S(N(p), {
							modelValue: G.content_source,
							"onUpdate:modelValue": c[7] ||= (e) => G.content_source = e,
							maxlength: 160,
							disabled: W.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "作者署名",
						prop: "author_name",
						error: N(X).author_name
					}, {
						default: R(() => [S(N(p), {
							modelValue: G.author_name,
							"onUpdate:modelValue": c[8] ||= (e) => G.author_name = e,
							maxlength: 120,
							disabled: W.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "前端排序",
						prop: "sort_order",
						error: N(X).sort_order
					}, {
						default: R(() => [S(N(n), {
							modelValue: G.sort_order,
							"onUpdate:modelValue": c[9] ||= (e) => G.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: W.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					c[34] ||= b("h3", null, "发布设置", -1),
					S(N(o), {
						label: "启用状态",
						prop: "is_enabled",
						error: N(X).is_enabled
					}, {
						default: R(() => [S(ge, {
							modelValue: G.is_enabled,
							"onUpdate:modelValue": c[10] ||= (e) => G.is_enabled = e,
							disabled: W.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: N(X).scheduled_local
					}, {
						default: R(() => [S(N(p), {
							modelValue: G.scheduled_local,
							"onUpdate:modelValue": c[11] ||= (e) => G.scheduled_local = e,
							type: "datetime-local",
							disabled: W.value || !B.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					c[35] ||= b("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), b("main", Xe, [S(N(a), {
				model: G,
				rules: N(Y),
				"label-position": "top",
				onSubmit: c[16] ||= V(() => {}, ["prevent"])
			}, {
				default: R(() => [
					S(N(o), {
						label: "标题",
						prop: "title",
						error: N(X).title,
						required: ""
					}, {
						default: R(() => [S(N(p), {
							modelValue: G.title,
							"onUpdate:modelValue": c[13] ||= (e) => G.title = e,
							maxlength: 255,
							disabled: W.value,
							placeholder: "输入新闻标题",
							"aria-label": "新闻标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "摘要",
						prop: "summary",
						error: N(X).summary
					}, {
						default: R(() => [z(b("textarea", {
							"onUpdate:modelValue": c[14] ||= (e) => G.summary = e,
							"aria-invalid": !!N(X).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: W.value,
							"aria-label": "新闻摘要"
						}, null, 8, Ze), [[F, G.summary]])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "正文",
						prop: "body_html",
						error: N(X).body_html
					}, {
						default: R(() => [S(N(t), {
							modelValue: G.body_html,
							"onUpdate:modelValue": c[15] ||= (e) => G.body_html = e,
							readonly: H.value,
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
			S(N(r), {
				modelValue: D.value,
				"onUpdate:modelValue": c[20] ||= (e) => D.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: R(() => [S(N(i), {
					variant: "primary",
					onClick: c[19] ||= (e) => D.value = !1
				}, {
					default: R(() => [...c[36] ||= [x("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [S(N(a), {
					model: G,
					rules: N(Y),
					"label-position": "top",
					onSubmit: c[18] ||= V(() => {}, ["prevent"])
				}, {
					default: R(() => [S(N(o), {
						label: "SEO 描述",
						prop: "seo_description",
						error: N(X).seo_description
					}, {
						default: R(() => [z(b("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": c[17] ||= (e) => G.seo_description = e,
							"aria-invalid": !!N(X).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: W.value,
							"aria-label": "SEO 描述"
						}, null, 8, Qe), [[F, G.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			S(N(r), {
				modelValue: A.value,
				"onUpdate:modelValue": c[22] ||= (e) => A.value = e,
				title: "确认删除",
				subtitle: `操作对象：${G.title || "未命名新闻"}`,
				width: "460px",
				"panel-class": "news-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !w.value
			}, {
				"header-actions": R(() => [b("span", $e, [S(N(h), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [S(N(i), {
					disabled: w.value,
					onClick: c[21] ||= (e) => A.value = !1
				}, {
					default: R(() => [...c[37] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(i), {
					variant: "warning",
					loading: w.value,
					onClick: he
				}, {
					default: R(() => [...c[38] ||= [x("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [S(N(f), {
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
			S(N(r), {
				modelValue: ue.value,
				"onUpdate:modelValue": c[25] ||= (e) => ue.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [S(N(i), { onClick: c[23] ||= (e) => ue.value = !1 }, {
					default: R(() => [...c[39] ||= [x("继续编辑", -1)]]),
					_: 1
				}), S(N(i), {
					variant: "primary",
					onClick: c[24] ||= (e) => m("close")
				}, {
					default: R(() => [...c[40] ||= [x("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			S(N(r), {
				modelValue: fe.value,
				"onUpdate:modelValue": c[27] ||= (e) => fe.value = e,
				title: "将新闻转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [S(N(i), { onClick: c[26] ||= (e) => fe.value = !1 }, {
					default: R(() => [...c[41] ||= [x("取消", -1)]]),
					_: 1
				}), S(N(i), {
					variant: "primary",
					onClick: ke
				}, {
					default: R(() => [...c[42] ||= [x("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, ze));
	}
}), [["__scopeId", "data-v-9ad8501f"]]), tt = { class: "news-articles" }, nt = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let { newsPublishStates: t, newsCategoryLabel: n, getNewsList: r, getNewsMetadata: a } = K(), { hasPermission: o } = pe(), { formatDateTime: s } = pe(), c = k(!1), l = k(), u = (e) => o([`cms_news:${e}`]), d = k(), ne = W(a, (e) => {
			d.value = e;
		}), f = [
			...he(),
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
		], { proTableBindings: re, reload: ae, filters: oe } = ee({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: g(() => [
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
		ne.bindFilters(oe);
		let p = new AbortController();
		async function m() {
			try {
				d.value = await a(p.signal);
			} catch {}
		}
		function se(e) {
			l.value = e, c.value = !0;
		}
		function b() {
			c.value = !1, ae(), m();
		}
		return le(m), ce(() => p.abort()), (e, n) => (O(), y("div", tt, [c.value ? (O(), _(et, {
			key: 0,
			"article-id": l.value,
			onClose: n[0] ||= (e) => c.value = !1,
			onSaved: b
		}, null, 8, ["article-id"])) : v("", !0), z(S(N(te), T(N(re), {
			"auto-refreshable": !1,
			columns: f,
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
			"cell-cms_source_type": R(({ row: e }) => [S(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": R(() => [u("add") ? (O(), _(N(i), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: n[1] ||= (e) => se()
			}, {
				icon: R(() => [S(N(h), {
					name: "plus",
					size: 14
				})]),
				default: R(() => [n[2] ||= x("新增新闻", -1)]),
				_: 1
			})) : v("", !0)]),
			"cell-publish_status": R(({ row: e }) => [S(N(ie), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: R(() => [x(M(N(t).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": R(({ row: e }) => [S(N(ie), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: R(() => [x(M(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": R(({ row: e }) => [x(M(N(s)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": R(({ row: e }) => [S(N(i), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑新闻" : "新闻详情",
				"aria-label": u("edit") ? "编辑新闻" : "新闻详情",
				onClick: (t) => se(e.id)
			}, {
				default: R(() => [S(N(h), {
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
}), [["__scopeId", "data-v-aef51e21"]]);
//#endregion
//#region src/cms/api/content/academy.ts
function rt() {
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
var it = ["aria-busy"], at = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, ot = { class: "taxonomy-editor__row" }, st = "分类", ct = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "CategoryTable",
	setup(t) {
		let { hasPermission: s } = pe(), { formatDateTime: c } = pe(), { academyDifficulties: l, academyError: u, getAcademyList: d, getAcademyMetadata: ne, getAcademyDetail: oe, saveAcademy: m, deleteAcademyCategory: C } = rt(), w = (e) => s([`cms_academy_category:${e}`]), E = W(ne), D = [
			...he(),
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
				formatter: (e) => (e || []).map((e) => l.find((t) => t.value === e)?.label).join(" / ")
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
		], { proTableBindings: le, reload: ue, currentPage: fe, pageSize: A, total: j, filters: P } = ee({
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
		E.bindFilters(P);
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
		}), I = de(F()), L = k(!1), z = k(!1), B = k(!1), H = k(!1), me = k(!1), U = k(""), K = k(!1), q = k(""), ge = k(!1), J = g(() => !w(I.id ? "edit" : "add")), Y = g(() => B.value || H.value), X = "", Z;
		async function _e(e) {
			Z?.abort(), Z = new AbortController();
			let t = Z;
			if (Object.assign(I, F(), { id: e || "" }), q.value = "", me.value = !1, U.value = "", K.value = !1, L.value = !0, z.value = !!e, X = JSON.stringify(I), e) try {
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
				t.signal.aborted || (K.value = !0, q.value = u(e));
			} finally {
				t.signal.aborted || (z.value = !1);
			}
		}
		function ve() {
			return Y.value ? !1 : !z.value && !K.value && JSON.stringify(I) !== X ? (ge.value = !0, !1) : (Z?.abort(), !0);
		}
		function Q() {
			Y.value || (Z?.abort(), L.value = !1);
		}
		function ye() {
			ge.value = !1, L.value = !1;
		}
		async function be() {
			if (!(J.value || Y.value || z.value || K.value)) {
				if (!I.name.trim() || I.sort_order === null || !I.difficulty_levels.length) {
					q.value = "请填写名称、排序和适用难度";
					return;
				}
				B.value = !0, q.value = "";
				try {
					await m("categories", {
						...I,
						id: I.id || void 0,
						row_version: I.id ? I.row_version : void 0
					}), L.value = !1, ae.success("保存成功"), await ue();
				} catch (e) {
					q.value = u(e);
				} finally {
					B.value = !1;
				}
			}
		}
		function xe() {
			!I.id || !w("delete") || Y.value || z.value || K.value || (U.value = "", me.value = !0);
		}
		async function $() {
			if (!(!me.value || !I.id || !w("delete") || Y.value || z.value || K.value)) {
				H.value = !0, U.value = "";
				try {
					await C({
						id: I.id,
						row_version: I.row_version
					}), me.value = !1, L.value = !1, ae.success("分类已删除"), await ue(), fe.value = Math.min(fe.value, Math.max(1, Math.ceil(j.value / A.value)));
				} catch (e) {
					U.value = u(e);
				} finally {
					H.value = !1;
				}
			}
		}
		return ce(() => Z?.abort()), (t, s) => (O(), y(se, null, [
			S(N(te), T(N(le), {
				"auto-refreshable": !1,
				columns: D,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${st}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": R(({ row: e }) => [S(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [w("add") ? (O(), _(N(i), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: s[0] ||= (e) => _e()
				}, {
					icon: R(() => [S(N(h), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [x("新增" + M(st))]),
					_: 1
				})) : v("", !0)]),
				"cell-is_enabled": R(({ row: e }) => [S(N(ie), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [x(M(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": R(({ row: e }) => [S(N(i), {
					size: "sm",
					"icon-only": "",
					title: w("edit") ? `编辑${st}` : `${st}详情`,
					"aria-label": `编辑${st}`,
					onClick: (t) => _e(e.id)
				}, {
					default: R(() => [S(N(h), {
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
			S(N(r), {
				modelValue: L.value,
				"onUpdate:modelValue": s[5] ||= (e) => L.value = e,
				title: `${I.id ? "编辑" : "新增"}课程${st}`,
				width: "620px",
				"close-on-click-modal": !1,
				"before-close": ve
			}, {
				footer: R(() => [
					I.id && w("delete") ? (O(), _(N(i), {
						key: 0,
						variant: "danger",
						disabled: z.value || K.value || Y.value,
						onClick: xe
					}, {
						icon: R(() => [S(N(h), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [s[10] ||= x("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : v("", !0),
					S(N(i), {
						disabled: Y.value,
						onClick: Q
					}, {
						default: R(() => [...s[11] ||= [x("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					J.value ? v("", !0) : (O(), _(N(i), {
						key: 1,
						variant: "primary",
						loading: B.value,
						disabled: z.value || K.value || H.value,
						onClick: be
					}, {
						default: R(() => [x("保存" + M(st))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [b("div", {
					class: "taxonomy-editor",
					"aria-busy": z.value
				}, [
					z.value ? (O(), y("div", at, [S(N(h), {
						name: "loader-circle",
						class: "academy-spin",
						size: 24
					}), b("span", null, "正在读取" + M(st) + "...")])) : v("", !0),
					q.value ? (O(), _(N(f), {
						key: 1,
						type: "error",
						closable: !1,
						description: q.value
					}, null, 8, ["description"])) : v("", !0),
					!z.value && !K.value ? (O(), _(N(a), {
						key: 2,
						model: I,
						"label-position": "top",
						onSubmit: V(be, ["prevent"])
					}, {
						default: R(() => [
							S(N(o), {
								label: `${st}名称`,
								required: ""
							}, {
								default: R(() => [S(N(p), {
									modelValue: I.name,
									"onUpdate:modelValue": s[1] ||= (e) => I.name = e,
									maxlength: 120,
									disabled: J.value || Y.value,
									"aria-label": `${st}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							S(N(o), {
								label: "适用难度",
								required: ""
							}, {
								default: R(() => [S(N(re), {
									modelValue: I.difficulty_levels,
									"onUpdate:modelValue": s[2] ||= (e) => I.difficulty_levels = e,
									multiple: "",
									options: N(l),
									disabled: J.value || Y.value,
									"aria-label": "适用难度"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								])]),
								_: 1
							}),
							b("div", ot, [S(N(o), {
								label: "前端排序",
								required: ""
							}, {
								default: R(() => [S(N(n), {
									modelValue: I.sort_order,
									"onUpdate:modelValue": s[3] ||= (e) => I.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: J.value || Y.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), S(N(o), { label: "启用状态" }, {
								default: R(() => [S(N(e), {
									modelValue: I.is_enabled,
									"onUpdate:modelValue": s[4] ||= (e) => I.is_enabled = e,
									disabled: J.value || Y.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : v("", !0)
				], 8, it)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			S(N(r), {
				modelValue: me.value,
				"onUpdate:modelValue": s[7] ||= (e) => me.value = e,
				title: "删除课程分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !H.value
			}, {
				footer: R(() => [S(N(i), {
					disabled: H.value,
					onClick: s[6] ||= (e) => me.value = !1
				}, {
					default: R(() => [...s[12] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(i), {
					variant: "danger",
					loading: H.value,
					onClick: $
				}, {
					default: R(() => [...s[13] ||= [x("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [b("p", null, "确认删除分类“" + M(I.name) + "”？有关联课程的分类无法删除。", 1), U.value ? (O(), _(N(f), {
					key: 0,
					type: "error",
					closable: !1,
					description: U.value
				}, null, 8, ["description"])) : v("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			S(N(r), {
				modelValue: ge.value,
				"onUpdate:modelValue": s[9] ||= (e) => ge.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [S(N(i), { onClick: s[8] ||= (e) => ge.value = !1 }, {
					default: R(() => [...s[14] ||= [x("继续编辑", -1)]]),
					_: 1
				}), S(N(i), {
					variant: "primary",
					onClick: ye
				}, {
					default: R(() => [...s[15] ||= [x("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 64));
	}
}), [["__scopeId", "data-v-b7830575"]]), lt = { class: "academy-categories" }, ut = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		return (e, t) => (O(), y("div", lt, [S(ct)]));
	}
}), [["__scopeId", "data-v-8f5e5114"]]), dt = [
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
function ft(e) {
	if (/[\x00-\x20\\]/.test(e)) return !1;
	if (e.startsWith("/") && !e.startsWith("//")) return !0;
	try {
		let t = new URL(e);
		return /^https?:\/\//i.test(e) && ["http:", "https:"].includes(t.protocol);
	} catch {
		return !1;
	}
}
function pt(e) {
	return e.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "").replace(/&nbsp;|&#0*(?:160|9|10|13|32);|&#x0*(?:a0|9|a|d|20);/gi, " ").trim().length > 0;
}
function mt(e, t, n, r = Date.now()) {
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
	(e.sort_order === null || !Number.isInteger(e.sort_order) || e.sort_order < 0 || e.sort_order > 2147483647) && (i.sort_order = "请填写 0–2147483647 之间的整数"), e.cover_url && !ft(e.cover_url) && (i.cover_url = "封面地址必须为 HTTP(S) 或站内绝对路径");
	let o = e.category_ids.map((e) => t.find((t) => t.id === e));
	if (a && !o.length ? i.category_ids = "请选择课程分类" : o.some((e) => !e) ? i.category_ids = "所选分类已不可用，请重新选择" : a && o.some((e) => !e?.is_enabled) ? i.category_ids = "发布课程必须选择已启用的分类" : o.length > 50 && (i.category_ids = "最多选择 50 个课程分类"), a && !e.difficulty_level ? i.difficulty_level = "请选择课程难度" : e.difficulty_level !== "" && ![
		1,
		2,
		3
	].includes(e.difficulty_level) ? i.difficulty_level = "请选择有效的课程难度" : e.difficulty_level && o.some((t) => t && !t.difficulty_levels.includes(Number(e.difficulty_level))) && (i.difficulty_level = "课程难度不在所选分类的适用范围内"), a && e.estimated_minutes === null ? i.estimated_minutes = "请填写预计课时" : e.estimated_minutes !== null && (!Number.isInteger(e.estimated_minutes) || e.estimated_minutes < 1 || e.estimated_minutes > 1e5) && (i.estimated_minutes = "预计课时须为 1–100000 之间的整数"), a && !pt(e.body_html) && (i.body_html = "请填写课程正文"), n === "scheduled") {
		let t = new Date(e.scheduled_local).getTime();
		(!Number.isFinite(t) || t <= r) && (i.scheduled_local = "计划发布时间必须晚于当前时间");
	}
	return i;
}
var ht = {
	课程标题不能为空: "title",
	"封面地址必须为 HTTP(S) 或站内绝对路径": "cover_url",
	计划发布时间必须晚于当前时间: "scheduled_local",
	发布课程必须选择分类: "category_ids",
	所选分类不存在或不属于当前学院模板: "category_ids",
	"发布课程必须选择已启用的分类，存在已停用分类": "category_ids",
	课程难度不在所选分类的适用范围内: "difficulty_level",
	"发布课程需要填写正文、课程难度及预计课时": "body_html"
};
function gt(e) {
	let t = {}, n = [], r = e && typeof e == "object" ? e : {};
	for (let [e, i] of Object.entries(r.errors || {})) {
		let r = e.split(".")[0], a = r === "scheduled_at" ? "scheduled_local" : r;
		for (let r of Array.isArray(i) ? i : [i]) {
			if (typeof r != "string" || !r) continue;
			let i = dt.includes(a) ? a : e === "academy" ? ht[r] : void 0;
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
var _t = ["aria-busy"], vt = { class: "course-editor__header" }, yt = { class: "course-editor__heading" }, bt = { class: "course-editor__commands" }, xt = {
	key: 2,
	class: "course-editor__save-error",
	role: "alert"
}, St = {
	key: 3,
	class: "course-editor__publish-actions"
}, Ct = {
	key: 0,
	class: "course-editor__pending",
	role: "status",
	"aria-live": "polite"
}, wt = {
	key: 0,
	class: "course-editor__loading",
	role: "status"
}, Tt = {
	key: 1,
	class: "course-editor__failure"
}, Et = {
	key: 2,
	class: "course-editor__body"
}, Dt = { class: "course-editor__settings" }, Ot = { class: "course-editor__content" }, kt = ["disabled", "aria-invalid"], At = ["disabled", "aria-invalid"], jt = {
	class: "course-delete-dialog__icon",
	"aria-hidden": "true"
}, Mt = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "CourseEditor",
	props: { courseId: {} },
	emits: ["close", "saved"],
	setup(s, { emit: c }) {
		let { hasPermission: l } = pe(), { academyDifficulties: u, academyError: ee, deleteAcademyCourse: te, getAcademyDetail: d, getAcademyMetadata: ne, saveAcademy: ie, uploadAcademyCover: oe } = rt(), m = s, se = c, C = k(!0), w = k(!1), T = k(!1), D = k(""), ue = k(!1), fe = k(!1), A = k(!1), j = k(pe().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), P = k(), I = k("draft"), B = k(!1), H = k(!1), U = k(""), he = g(() => l(["cms_academy:publish"])), W = g(() => !!m.courseId && l(["cms_academy:delete"]) && (he.value || I.value === "draft")), G = g(() => !l([`cms_academy:${m.courseId ? "edit" : "add"}`]) || !he.value && I.value !== "draft"), K = g(() => G.value || w.value), q = de({
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
		}), ge = k(), J = k(), Y = k(null), X = k(Date.now()), Z = de({}), _e = k(""), ve = Object.fromEntries(dt.map((e) => [e, {
			required: e === "title" || e === "category_ids",
			trigger: "submit"
		}])), Q = g(() => Y.value ? mt(q, P.value?.categories || [], Y.value === "draft" ? "draft" : q.scheduled_local ? "scheduled" : "published", X.value) : {}), ye = g(() => ({
			...Z,
			...Q.value
		})), be = g(() => Object.keys(ye.value).length);
		for (let e of dt) L(() => q[e], () => {
			delete Z[e], e === "category_ids" && delete Z.difficulty_level, _e.value = "", X.value = Date.now();
		}, { deep: !0 });
		function xe() {
			ye.value.seo_description && J.value?.focus();
		}
		async function $() {
			await E();
			let e = [...ge.value?.querySelectorAll("[data-prop]") || []].find((e) => ye.value[e.dataset.prop]);
			if (!e && ye.value.seo_description) {
				ue.value ? xe() : ue.value = !0;
				return;
			}
			e && (e.scrollIntoView({
				block: "center",
				behavior: "auto"
			}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
		}
		let Se = g(() => (P.value?.categories || []).map((e) => ({
			label: e.name + (e.is_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.is_enabled
		}))), Ce = g(() => {
			let e = (P.value?.categories || []).filter((e) => q.category_ids.includes(e.id));
			return u.map((t) => ({
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
			C.value = !0, T.value = !1, D.value = "";
			try {
				if (P.value = await ne(e.signal, { cms_source_type: "platform" }), m.courseId) {
					let t = await d("courses", m.courseId, e.signal);
					if (P.value = await ne(e.signal, { space_id: String(t.space_id) }), j.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"category_ids",
						"estimated_minutes",
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
					q.scheduled_local = t.publish_status === "scheduled" ? Ee(t.scheduled_at) : "", I.value = t.publish_status;
				}
				we = JSON.stringify(q);
			} catch (t) {
				e.signal.aborted || (D.value = ee(t), T.value = !0);
			} finally {
				e.signal.aborted || (C.value = !1);
			}
		}
		let Oe = () => !C.value && !T.value && we !== JSON.stringify(q);
		function ke() {
			Oe() ? fe.value = !0 : se("close");
		}
		function Ae() {
			I.value === "draft" ? Me("draft") : A.value = !0;
		}
		function je() {
			A.value = !1, Me("draft");
		}
		async function Me(e) {
			if (K.value || C.value || T.value || B.value) return;
			Y.value = e === "draft" ? "draft" : "publish", X.value = Date.now(), _e.value = "";
			for (let e of dt) delete Z[e];
			if (be.value) {
				await $();
				return;
			}
			let t = q.scheduled_local ? new Date(q.scheduled_local) : null;
			w.value = !0, D.value = "";
			try {
				await ie("courses", {
					...q,
					id: q.id || void 0,
					row_version: q.id ? q.row_version : void 0,
					difficulty_level: q.difficulty_level || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), we = JSON.stringify(q), ae.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "课程已发布"), se("saved");
			} catch (e) {
				let t = gt(e);
				Object.assign(Z, t.fields), _e.value = t.general;
			} finally {
				w.value = !1;
			}
			be.value && await $();
		}
		function Ne() {
			U.value = "", H.value = !0;
		}
		async function Pe() {
			if (!(!W.value || C.value || T.value || w.value || B.value)) {
				w.value = !0, U.value = "";
				try {
					await te({
						id: q.id,
						row_version: q.row_version
					}), we = JSON.stringify(q), H.value = !1, ae.success("课程已删除"), se("saved");
				} catch (e) {
					U.value = ee(e);
				} finally {
					w.value = !1;
				}
			}
		}
		function Fe(e) {
			Z.cover_url = ee(e);
		}
		function Ie() {
			delete Z.cover_url;
		}
		let Le = (e) => {
			Oe() && (e.preventDefault(), e.returnValue = "");
		};
		return me(() => !w.value && !B.value && (!Oe() || window.confirm("课程有未保存的修改，确定离开？"))), le(() => {
			De(), window.addEventListener("beforeunload", Le);
		}), ce(() => {
			Te?.abort(), window.removeEventListener("beforeunload", Le);
		}), (c, l) => (O(), y("section", {
			ref_key: "editorRoot",
			ref: ge,
			class: "course-editor",
			"aria-busy": C.value || w.value
		}, [
			b("header", vt, [
				S(N(i), {
					"icon-only": "",
					title: "返回课程列表",
					"aria-label": "返回课程列表",
					disabled: w.value || B.value,
					onClick: ke
				}, {
					default: R(() => [S(N(h), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				b("div", yt, [b("h2", null, M(s.courseId ? "编辑课程" : "新增课程"), 1), b("span", null, M(P.value?.source_locale || "zh-CN") + " · " + M(j.value), 1)]),
				b("div", bt, [
					W.value ? (O(), _(N(i), {
						key: 0,
						variant: "danger",
						size: "sm",
						disabled: C.value || T.value || w.value || B.value,
						onClick: Ne
					}, {
						default: R(() => [...l[27] ||= [x("删除课程", -1)]]),
						_: 1
					}, 8, ["disabled"])) : v("", !0),
					S(N(i), {
						size: "sm",
						disabled: C.value || T.value,
						onClick: l[0] ||= (e) => ue.value = !0
					}, {
						icon: R(() => [S(N(h), {
							name: "search",
							size: 14
						})]),
						default: R(() => [l[28] ||= x("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					G.value ? v("", !0) : (O(), _(N(i), {
						key: 1,
						size: "sm",
						disabled: C.value || T.value || w.value || B.value,
						onClick: Ae
					}, {
						icon: R(() => [S(N(h), {
							name: "save",
							size: 14
						})]),
						default: R(() => [l[29] ||= x("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					_e.value ? (O(), y("span", xt, M(_e.value), 1)) : v("", !0),
					G.value ? v("", !0) : (O(), y("div", St, [be.value ? (O(), y("span", Ct, "还有 " + M(be.value) + " 项待完善", 1)) : v("", !0), he.value ? (O(), _(N(i), {
						key: 1,
						variant: "primary",
						size: "sm",
						disabled: C.value || T.value || B.value,
						loading: w.value,
						onClick: l[1] ||= (e) => Me(q.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [S(N(h), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [x(M(q.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : v("", !0)]))
				])
			]),
			C.value ? (O(), y("div", wt, [S(N(h), {
				name: "loader-circle",
				class: "academy-spin",
				size: 28
			}), l[30] ||= b("span", null, "正在读取课程资料...", -1)])) : T.value ? (O(), y("div", Tt, [S(N(f), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"]), S(N(i), { onClick: De }, {
				default: R(() => [...l[31] ||= [x("重新加载", -1)]]),
				_: 1
			})])) : (O(), y("div", Et, [b("aside", Dt, [S(N(a), {
				model: q,
				rules: N(ve),
				"label-position": "top",
				onSubmit: l[11] ||= V(() => {}, ["prevent"])
			}, {
				default: R(() => [
					S(N(o), {
						label: "课程分类",
						prop: "category_ids",
						error: ye.value.category_ids,
						required: ""
					}, {
						default: R(() => [S(N(re), {
							modelValue: q.category_ids,
							"onUpdate:modelValue": l[2] ||= (e) => q.category_ids = e,
							options: Se.value,
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
					l[32] ||= b("h3", null, "课程设置", -1),
					S(N(o), {
						label: "课程封面",
						prop: "cover_url",
						error: ye.value.cover_url
					}, {
						default: R(() => [S(Re, {
							modelValue: q.cover_url,
							"onUpdate:modelValue": l[3] ||= (e) => q.cover_url = e,
							label: "课程封面",
							disabled: K.value,
							upload: N(oe),
							onBusyChange: l[4] ||= (e) => B.value = e,
							onStart: l[5] ||= (e) => D.value = "",
							onError: Fe,
							onSuccess: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "课程难度",
						prop: "difficulty_level",
						error: ye.value.difficulty_level
					}, {
						default: R(() => [S(N(re), {
							modelValue: q.difficulty_level,
							"onUpdate:modelValue": l[6] ||= (e) => q.difficulty_level = e,
							options: Ce.value,
							disabled: K.value,
							"aria-label": "课程难度"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "预计课时(分钟)",
						prop: "estimated_minutes",
						error: ye.value.estimated_minutes
					}, {
						default: R(() => [S(N(n), {
							modelValue: q.estimated_minutes,
							"onUpdate:modelValue": l[7] ||= (e) => q.estimated_minutes = e,
							min: 1,
							max: 1e5,
							precision: 0,
							disabled: K.value,
							"aria-label": "预计课时"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "前端排序",
						prop: "sort_order",
						error: ye.value.sort_order
					}, {
						default: R(() => [S(N(n), {
							modelValue: q.sort_order,
							"onUpdate:modelValue": l[8] ||= (e) => q.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: K.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					l[33] ||= b("h3", null, "发布设置", -1),
					S(N(o), {
						label: "启用状态",
						prop: "is_enabled",
						error: ye.value.is_enabled
					}, {
						default: R(() => [S(N(e), {
							modelValue: q.is_enabled,
							"onUpdate:modelValue": l[9] ||= (e) => q.is_enabled = e,
							disabled: K.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "计划发布时间",
						prop: "scheduled_local",
						error: ye.value.scheduled_local
					}, {
						default: R(() => [S(N(p), {
							modelValue: q.scheduled_local,
							"onUpdate:modelValue": l[10] ||= (e) => q.scheduled_local = e,
							type: "datetime-local",
							disabled: K.value || !he.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])]), b("main", Ot, [S(N(a), {
				model: q,
				rules: N(ve),
				"label-position": "top",
				onSubmit: l[15] ||= V(() => {}, ["prevent"])
			}, {
				default: R(() => [
					S(N(o), {
						label: "标题",
						prop: "title",
						error: ye.value.title,
						required: ""
					}, {
						default: R(() => [S(N(p), {
							modelValue: q.title,
							"onUpdate:modelValue": l[12] ||= (e) => q.title = e,
							maxlength: 255,
							disabled: K.value,
							placeholder: "输入课程标题",
							"aria-label": "课程标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "摘要",
						prop: "summary",
						error: ye.value.summary
					}, {
						default: R(() => [z(b("textarea", {
							"onUpdate:modelValue": l[13] ||= (e) => q.summary = e,
							class: "course-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: K.value,
							"aria-invalid": !!ye.value.summary,
							"aria-label": "课程摘要"
						}, null, 8, kt), [[F, q.summary]])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "正文",
						prop: "body_html",
						error: ye.value.body_html
					}, {
						default: R(() => [S(N(t), {
							modelValue: q.body_html,
							"onUpdate:modelValue": l[14] ||= (e) => q.body_html = e,
							readonly: G.value,
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
			S(N(r), {
				modelValue: ue.value,
				"onUpdate:modelValue": l[19] ||= (e) => ue.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1,
				onOpened: xe
			}, {
				footer: R(() => [S(N(i), {
					variant: "primary",
					onClick: l[18] ||= (e) => ue.value = !1
				}, {
					default: R(() => [...l[34] ||= [x("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [S(N(a), {
					model: q,
					rules: N(ve),
					"label-position": "top",
					onSubmit: l[17] ||= V(() => {}, ["prevent"])
				}, {
					default: R(() => [S(N(o), {
						label: "SEO 描述",
						prop: "seo_description",
						error: ye.value.seo_description
					}, {
						default: R(() => [z(b("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": l[16] ||= (e) => q.seo_description = e,
							class: "course-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: K.value,
							"aria-invalid": !!ye.value.seo_description,
							"aria-label": "SEO 描述"
						}, null, 8, At), [[F, q.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			S(N(r), {
				modelValue: H.value,
				"onUpdate:modelValue": l[21] ||= (e) => H.value = e,
				title: "确认删除",
				subtitle: `操作对象：${q.title || "未命名课程"}`,
				width: "460px",
				"panel-class": "course-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !w.value
			}, {
				"header-actions": R(() => [b("span", jt, [S(N(h), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [S(N(i), {
					disabled: w.value,
					onClick: l[20] ||= (e) => H.value = !1
				}, {
					default: R(() => [...l[35] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(i), {
					variant: "warning",
					loading: w.value,
					onClick: Pe
				}, {
					default: R(() => [...l[36] ||= [x("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [S(N(f), {
					class: "course-delete-dialog__notice",
					type: "warning",
					closable: !1,
					"show-icon": !1,
					description: "确定删除这门课程吗？删除后将不再展示，请谨慎操作。"
				}), U.value ? (O(), _(N(f), {
					key: 0,
					type: "error",
					closable: !1,
					description: U.value
				}, null, 8, ["description"])) : v("", !0)]),
				_: 1
			}, 8, [
				"modelValue",
				"subtitle",
				"before-close"
			]),
			S(N(r), {
				modelValue: fe.value,
				"onUpdate:modelValue": l[24] ||= (e) => fe.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [S(N(i), { onClick: l[22] ||= (e) => fe.value = !1 }, {
					default: R(() => [...l[37] ||= [x("继续编辑", -1)]]),
					_: 1
				}), S(N(i), {
					variant: "primary",
					onClick: l[23] ||= (e) => se("close")
				}, {
					default: R(() => [...l[38] ||= [x("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			S(N(r), {
				modelValue: A.value,
				"onUpdate:modelValue": l[26] ||= (e) => A.value = e,
				title: "将课程转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [S(N(i), { onClick: l[25] ||= (e) => A.value = !1 }, {
					default: R(() => [...l[39] ||= [x("取消", -1)]]),
					_: 1
				}), S(N(i), {
					variant: "primary",
					onClick: je
				}, {
					default: R(() => [...l[40] ||= [x("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, _t));
	}
}), [["__scopeId", "data-v-4bde73b0"]]), Nt = { class: "academy-courses" }, Pt = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = pe(), { formatDateTime: n } = pe(), { academyDifficulties: r, academyPublishStates: a, getAcademyList: o, getAcademyMetadata: s } = rt(), c = k(!1), l = k(), u = (e) => t([`cms_academy:${e}`]), d = k(), ne = W(s, (e) => {
			d.value = e;
		}), f = [
			...he(),
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
		], { proTableBindings: re, reload: ae, filters: oe } = ee({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: g(() => [
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
		});
		ne.bindFilters(oe);
		let p = new AbortController();
		async function m() {
			try {
				d.value = await s(p.signal);
			} catch {}
		}
		function se(e) {
			l.value = e, c.value = !0;
		}
		function b() {
			c.value = !1, ae(), m();
		}
		return le(m), ce(() => p.abort()), (e, t) => (O(), y("div", Nt, [c.value ? (O(), _(Mt, {
			key: 0,
			"course-id": l.value,
			onClose: t[0] ||= (e) => c.value = !1,
			onSaved: b
		}, null, 8, ["course-id"])) : v("", !0), z(S(N(te), T(N(re), {
			"auto-refreshable": !1,
			columns: f,
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
			"cell-cms_source_type": R(({ row: e }) => [S(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": R(() => [u("add") ? (O(), _(N(i), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => se()
			}, {
				icon: R(() => [S(N(h), {
					name: "plus",
					size: 14
				})]),
				default: R(() => [t[2] ||= x("新增课程", -1)]),
				_: 1
			})) : v("", !0)]),
			"cell-publish_status": R(({ row: e }) => [S(N(ie), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: R(() => [x(M(N(a).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": R(({ row: e }) => [S(N(ie), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: R(() => [x(M(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": R(({ row: e }) => [x(M(N(n)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": R(({ row: e }) => [S(N(i), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑课程" : "课程详情",
				"aria-label": u("edit") ? "编辑课程" : "课程详情",
				onClick: (t) => se(e.id)
			}, {
				default: R(() => [S(N(h), {
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
}), [["__scopeId", "data-v-0a52bb25"]]);
//#endregion
//#region src/cms/api/content/help.ts
function Ft() {
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
var It = ["aria-checked", "disabled"], Lt = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "EnabledToggle",
	props: {
		modelValue: { type: Boolean },
		disabled: { type: Boolean }
	},
	emits: ["update:modelValue"],
	setup(e) {
		return (t, n) => (O(), y("button", {
			type: "button",
			role: "switch",
			class: D(["help-toggle", { "is-on": e.modelValue }]),
			"aria-checked": e.modelValue,
			"aria-label": "启用状态",
			disabled: e.disabled,
			onClick: n[0] ||= (n) => t.$emit("update:modelValue", !e.modelValue)
		}, [n[1] ||= b("span", {
			class: "help-toggle__track",
			"aria-hidden": "true"
		}, [b("span")], -1), b("span", null, M(e.modelValue ? "已启用" : "已停用"), 1)], 10, It));
	}
}), [["__scopeId", "data-v-5cfe8693"]]), Rt = { class: "help-categories" }, zt = ["aria-busy"], Bt = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Vt = { class: "taxonomy-editor__field" }, Ht = { class: "taxonomy-editor__field" }, Ut = { class: "taxonomy-editor__icon-control" }, Wt = ["title"], Gt = ["aria-label"], Kt = { key: 1 }, qt = {
	key: 0,
	class: "help-hint"
}, Jt = { class: "taxonomy-editor__row" }, Yt = "分类", Xt = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let { helpError: t, deleteHelp: s, getHelpMetadata: l, getHelpList: u, getHelpDetail: d, saveHelp: ne } = Ft(), { hasPermission: m } = pe(), { formatDateTime: se } = pe(), C = (e) => m([`cms_help_category:${e}`]), w = k(), E = k(), D = W(l, (e) => {
			w.value = e;
		}), ue = [
			...he(),
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
				formatter: se
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], { proTableBindings: fe, reload: A, filters: j } = ee({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: g(() => [
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
			]),
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
		D.bindFilters(j);
		let P = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			icon_key: "",
			sort_order: 10,
			is_enabled: !0
		}), F = de(P()), I = [...oe], L = new Set(I), z = g(() => L.has(F.icon_key) ? F.icon_key : void 0), B = k(!1), H = k(!1), me = k(!1), U = k(!1), K = k(!1), q = k(""), ge = k(!1), J = k(""), Y = g(() => !C(F.id ? "edit" : "add")), X = g(() => me.value || U.value), Z;
		async function _e(e) {
			Z?.abort(), Z = new AbortController();
			let n = Z;
			Object.assign(F, P(), { id: e || "" }), J.value = "", K.value = !1, q.value = "", ge.value = !1, B.value = !0, H.value = !0;
			try {
				if (E.value = await l(n.signal, { cms_source_type: "platform" }), !e || n.signal.aborted) return;
				let t = await d("categories", e, n.signal);
				if (E.value = await l(n.signal, { space_id: String(t.space_id) }), n.signal.aborted) return;
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
				n.signal.aborted || (ge.value = !0, J.value = t(e));
			} finally {
				n.signal.aborted || (H.value = !1);
			}
		}
		function ve() {
			return X.value ? !1 : (Z?.abort(), !0);
		}
		function Q() {
			ve() && (B.value = !1);
		}
		async function ye() {
			if (!(Y.value || X.value || H.value || ge.value)) {
				if (!F.name.trim() || F.sort_order === null) {
					J.value = "请填写分类名称和排序";
					return;
				}
				if (F.icon_key.length > 128) {
					J.value = "图标标识最多 128 个字符";
					return;
				}
				me.value = !0, J.value = "";
				try {
					await ne("categories", {
						name: F.name,
						parent_id: F.parent_id || null,
						icon_key: F.icon_key || null,
						sort_order: F.sort_order,
						is_enabled: F.is_enabled,
						id: F.id || void 0,
						row_version: F.id ? F.row_version : void 0
					}), B.value = !1, ae.success("保存成功"), await Promise.all([A(), Ce()]);
				} catch (e) {
					J.value = t(e);
				} finally {
					me.value = !1;
				}
			}
		}
		function be() {
			!F.id || !C("delete") || X.value || H.value || ge.value || (q.value = "", K.value = !0);
		}
		async function xe() {
			if (!(!K.value || !F.id || !C("delete") || X.value || H.value || ge.value)) {
				U.value = !0, q.value = "";
				try {
					await s("categories", F.id, F.row_version), K.value = !1, B.value = !1, ae.success("分类已删除"), await Promise.all([A(), Ce()]);
				} catch (e) {
					q.value = t(e);
				} finally {
					U.value = !1;
				}
			}
		}
		let $ = g(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(E.value?.categories || []).filter((e) => !e.parent_id && e.id !== F.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Se = new AbortController();
		async function Ce() {
			try {
				w.value = await l(Se.signal);
			} catch {}
		}
		return le(Ce), ce(() => {
			Z?.abort(), Se.abort();
		}), (e, t) => (O(), y("div", Rt, [
			S(N(te), T(N(fe), {
				"auto-refreshable": !1,
				columns: ue,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Yt}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": R(({ row: e }) => [S(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [C("add") ? (O(), _(N(i), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: t[0] ||= (e) => _e()
				}, {
					icon: R(() => [S(N(h), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [x("新增" + M(Yt))]),
					_: 1
				})) : v("", !0)]),
				"cell-is_enabled": R(({ row: e }) => [S(N(ie), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [x(M(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": R(({ row: e }) => [S(N(i), {
					size: "sm",
					"icon-only": "",
					title: C("edit") ? `编辑${Yt}` : `${Yt}详情`,
					"aria-label": `编辑${Yt}`,
					onClick: (t) => _e(e.id)
				}, {
					default: R(() => [S(N(h), {
						name: C("edit") ? "square-pen" : "panel-right-open",
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
			S(N(r), {
				modelValue: B.value,
				"onUpdate:modelValue": t[6] ||= (e) => B.value = e,
				title: `${F.id ? "编辑" : "新增"}帮助${Yt}`,
				width: "680px",
				subtitle: "帮助分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": ve
			}, {
				footer: R(() => [
					F.id && C("delete") ? (O(), _(N(i), {
						key: 0,
						variant: "danger",
						disabled: H.value || ge.value || X.value,
						onClick: be
					}, {
						icon: R(() => [S(N(h), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [t[11] ||= x("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : v("", !0),
					S(N(i), {
						disabled: X.value,
						onClick: Q
					}, {
						default: R(() => [...t[12] ||= [x("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Y.value ? v("", !0) : (O(), _(N(i), {
						key: 1,
						variant: "primary",
						loading: me.value,
						disabled: H.value || ge.value || U.value,
						onClick: ye
					}, {
						default: R(() => [x("保存" + M(Yt))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [b("div", {
					class: "taxonomy-editor",
					"aria-busy": H.value
				}, [
					H.value ? (O(), y("div", Bt, [S(N(h), {
						name: "loader-circle",
						class: "help-spin",
						size: 24
					}), b("span", null, "正在读取" + M(Yt) + "...")])) : v("", !0),
					J.value ? (O(), _(N(f), {
						key: 1,
						type: "error",
						closable: !1,
						description: J.value
					}, null, 8, ["description"])) : v("", !0),
					!H.value && !ge.value ? (O(), _(N(a), {
						key: 2,
						model: F,
						"label-position": "top",
						onSubmit: V(ye, ["prevent"])
					}, {
						default: R(() => [
							F.id ? (O(), _(N(o), {
								key: 0,
								label: "分类ID"
							}, {
								default: R(() => [S(N(p), {
									"model-value": F.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : v("", !0),
							S(N(o), {
								label: `${Yt}名称`,
								required: ""
							}, {
								default: R(() => [S(N(p), {
									modelValue: F.name,
									"onUpdate:modelValue": t[1] ||= (e) => F.name = e,
									maxlength: 120,
									disabled: Y.value || X.value,
									"aria-label": `${Yt}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							S(N(o), { label: "父分类" }, {
								default: R(() => [b("div", Vt, [S(N(re), {
									modelValue: F.parent_id,
									"onUpdate:modelValue": t[2] ||= (e) => F.parent_id = e,
									options: $.value,
									disabled: Y.value || X.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), t[9] ||= b("p", { class: "help-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类文章。 ", -1)])]),
								_: 1
							}),
							S(N(o), { label: "图标标识" }, {
								default: R(() => [b("div", Ht, [
									b("div", Ut, [S(N(c), {
										modelValue: F.icon_key,
										"onUpdate:modelValue": t[3] ||= (e) => F.icon_key = e,
										suggestions: I,
										"min-length": 0,
										disabled: Y.value || X.value,
										clearable: "",
										placeholder: "输入或下拉选择 6mm 图标，例如 circle-help"
									}, {
										option: R(({ option: e }) => [b("span", {
											class: "taxonomy-editor__icon-option",
											title: String(e)
										}, [S(N(h), {
											name: String(e),
											size: 18
										}, null, 8, ["name"]), b("span", null, M(e), 1)], 8, Wt)]),
										_: 1
									}, 8, ["modelValue", "disabled"]), b("span", {
										class: "taxonomy-editor__icon-preview",
										role: "img",
										"aria-label": z.value ? `图标预览：${z.value}` : "暂无图标预览"
									}, [z.value ? (O(), _(N(h), {
										key: 0,
										name: z.value,
										size: 20
									}, null, 8, ["name"])) : (O(), y("span", Kt, "—"))], 8, Gt)]),
									t[10] ||= b("p", { class: "help-hint" }, " 支持直接输入名称或从下拉列表选择；不填写 SVG 或 HTML。 ", -1),
									F.icon_key && !z.value ? (O(), y("p", qt, " 当前名称不在已安装的 6mm 图标库中，暂无法预览。 ")) : v("", !0)
								])]),
								_: 1
							}),
							b("div", Jt, [S(N(o), {
								label: "前端排序",
								required: ""
							}, {
								default: R(() => [S(N(n), {
									modelValue: F.sort_order,
									"onUpdate:modelValue": t[4] ||= (e) => F.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Y.value || X.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), S(N(o), { label: "启用状态" }, {
								default: R(() => [S(Lt, {
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
					}, 8, ["model"])) : v("", !0)
				], 8, zt)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			S(N(r), {
				modelValue: K.value,
				"onUpdate:modelValue": t[8] ||= (e) => K.value = e,
				title: "删除帮助分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !U.value
			}, {
				footer: R(() => [S(N(i), {
					disabled: U.value,
					onClick: t[7] ||= (e) => K.value = !1
				}, {
					default: R(() => [...t[13] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(i), {
					variant: "danger",
					loading: U.value,
					onClick: xe
				}, {
					default: R(() => [...t[14] ||= [x("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [b("p", null, "确认删除分类“" + M(F.name) + "”？有关联文章或子分类的分类无法删除。", 1), q.value ? (O(), _(N(f), {
					key: 0,
					type: "error",
					closable: !1,
					description: q.value
				}, null, 8, ["description"])) : v("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"])
		]));
	}
}), [["__scopeId", "data-v-d876a44a"]]), Zt = ["aria-busy"], Qt = { class: "article-editor__header" }, $t = { class: "article-editor__heading" }, en = { class: "article-editor__commands" }, tn = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, nn = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, rn = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, an = {
	key: 1,
	class: "article-editor__failure"
}, on = {
	key: 0,
	class: "article-editor__error"
}, sn = { class: "article-editor__body" }, cn = { class: "article-editor__settings" }, ln = { class: "article-editor__related" }, un = { class: "article-editor__content" }, dn = ["aria-invalid", "disabled"], fn = ["aria-invalid", "disabled"], pn = {
	class: "help-delete-dialog__icon",
	"aria-hidden": "true"
}, mn = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(e, { emit: s }) {
		let { helpError: c, helpCategoryLabel: l, deleteHelp: u, getHelpDetail: ee, getHelpMetadata: te, getHelpList: d, saveHelp: ne, uploadHelpCover: ie } = Ft(), { hasPermission: oe } = pe(), m = e, C = s, w = k(!0), T = k(!1), E = k(!1), D = k(""), ue = k(!1), fe = k(!1), A = k(!1), j = k(!1), P = k(pe().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), I = k(), L = k("draft"), H = k(!1), U = g(() => oe(["cms_help:publish"])), he = g(() => !oe([`cms_help:${m.articleId ? "edit" : "add"}`]) || !U.value && L.value !== "draft"), W = g(() => oe(["cms_help:delete"]) && (U.value || L.value === "draft"));
		async function G() {
			if (!(!W.value || T.value || w.value || E.value)) {
				T.value = !0, D.value = "";
				try {
					await u("articles", q.id, q.row_version), De = JSON.stringify(q), ae.success("文章已删除"), C("saved");
				} catch (e) {
					D.value = c(e), j.value = !1;
				} finally {
					T.value = !1;
				}
			}
		}
		let K = g(() => he.value || T.value), q = de({
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
		}), { editorRoot: ge, seoInput: J, fieldRules: Y, fieldErrors: X, pendingCount: Z, saveError: _e, validateSave: ve, setSaveFailure: Q, focusFirstError: ye, focusSeoError: be } = Se(q, () => I.value?.categories || [], "help", ue), xe = k(""), $ = k(!1), Ce = k([]), we = g(() => Ce.value.filter((e) => e.id !== m.articleId).map((e) => ({
			label: `${e.title} · ${e.code}`,
			value: e.id
		})));
		async function Te() {
			if (!(K.value || $.value)) {
				$.value = !0;
				try {
					let e = await d("articles", {
						keyword: xe.value,
						page_size: 100
					}, Oe?.signal), t = Ce.value.filter((e) => q.related_content_ids.includes(e.id));
					Ce.value = [...new Map([...t, ...e.lists].map((e) => [e.id, e])).values()];
				} catch (e) {
					Oe?.signal.aborted || (D.value = c(e));
				} finally {
					$.value = !1;
				}
			}
		}
		let Ee = g(() => (I.value?.categories || []).map((e) => ({
			label: l(I.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
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
			w.value = !0, E.value = !1, D.value = "";
			try {
				if (I.value = await te(e.signal, { cms_source_type: "platform" }), m.articleId) {
					let t = await ee("articles", m.articleId, e.signal);
					if (I.value = await te(e.signal, { space_id: String(t.space_id) }), P.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					q.scheduled_local = t.publish_status === "scheduled" ? ke(t.scheduled_at) : "", L.value = t.publish_status;
				}
				De = JSON.stringify(q);
			} catch (t) {
				e.signal.aborted || (D.value = c(t), E.value = !0);
			} finally {
				e.signal.aborted || (w.value = !1);
			}
		}
		let je = () => !w.value && !E.value && De !== JSON.stringify(q);
		function Me() {
			je() ? fe.value = !0 : C("close");
		}
		function Ne() {
			L.value === "draft" ? Fe("draft") : A.value = !0;
		}
		function Pe() {
			A.value = !1, Fe("draft");
		}
		async function Fe(e) {
			if (K.value || w.value || E.value || H.value || (D.value = "", !await ve(e))) return;
			let t = q.scheduled_local ? new Date(q.scheduled_local) : null;
			T.value = !0, D.value = "";
			try {
				await ne("articles", {
					...q,
					id: q.id || void 0,
					row_version: q.id ? q.row_version : void 0,
					category_id: q.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), De = JSON.stringify(q), ae.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "文章已发布"), C("saved");
			} catch (e) {
				Q(e);
			} finally {
				T.value = !1;
			}
			Z.value && await ye();
		}
		function Ie(e) {
			D.value = c(e);
		}
		let Le = (e) => {
			je() && (e.preventDefault(), e.returnValue = "");
		};
		return me(() => !T.value && !H.value && (!je() || window.confirm("文章有未保存的修改，确定离开？"))), le(() => {
			Ae(), window.addEventListener("beforeunload", Le);
		}), ce(() => {
			Oe?.abort(), window.removeEventListener("beforeunload", Le);
		}), (s, c) => (O(), y("section", {
			ref_key: "editorRoot",
			ref: ge,
			class: "article-editor",
			"aria-busy": w.value || T.value
		}, [
			b("header", Qt, [
				S(N(i), {
					"icon-only": "",
					title: "返回文章列表",
					"aria-label": "返回文章列表",
					disabled: T.value || H.value,
					onClick: Me
				}, {
					default: R(() => [S(N(h), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				b("div", $t, [b("h2", null, M(e.articleId ? "编辑文章" : "新增文章"), 1), b("span", null, M(I.value?.source_locale || "zh-CN") + " · " + M(P.value), 1)]),
				b("div", en, [
					e.articleId && W.value ? (O(), _(N(i), {
						key: 0,
						size: "sm",
						disabled: w.value || E.value || T.value || H.value,
						onClick: c[0] ||= (e) => j.value = !0
					}, {
						default: R(() => [...c[32] ||= [x("删除文章", -1)]]),
						_: 1
					}, 8, ["disabled"])) : v("", !0),
					S(N(i), {
						size: "sm",
						disabled: w.value || E.value,
						onClick: c[1] ||= (e) => ue.value = !0
					}, {
						icon: R(() => [S(N(h), {
							name: "search",
							size: 14
						})]),
						default: R(() => [c[33] ||= x("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					he.value ? v("", !0) : (O(), _(N(i), {
						key: 1,
						size: "sm",
						disabled: w.value || E.value || T.value || H.value,
						onClick: Ne
					}, {
						icon: R(() => [S(N(h), {
							name: "save",
							size: 14
						})]),
						default: R(() => [c[34] ||= x("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					N(_e) ? (O(), y("span", tn, M(N(_e)), 1)) : v("", !0),
					!he.value && N(Z) ? (O(), y("span", nn, "还有 " + M(N(Z)) + " 项待完善", 1)) : v("", !0),
					!he.value && U.value ? (O(), _(N(i), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: w.value || E.value || H.value,
						loading: T.value,
						onClick: c[2] ||= (e) => Fe(q.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [S(N(h), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [x(M(q.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : v("", !0)
				])
			]),
			w.value ? (O(), y("div", rn, [S(N(h), {
				name: "loader-circle",
				class: "help-spin",
				size: 28
			}), c[35] ||= b("span", null, "正在读取文章资料...", -1)])) : E.value ? (O(), y("div", an, [S(N(f), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"]), S(N(i), { onClick: Ae }, {
				default: R(() => [...c[36] ||= [x("重新加载", -1)]]),
				_: 1
			})])) : (O(), y(se, { key: 2 }, [D.value ? (O(), y("div", on, [S(N(f), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"])])) : v("", !0), b("div", sn, [b("aside", cn, [S(N(a), {
				model: q,
				rules: N(Y),
				"label-position": "top",
				onSubmit: c[16] ||= V(() => {}, ["prevent"])
			}, {
				default: R(() => [
					S(N(o), {
						label: "文章分类",
						prop: "category_id",
						error: N(X).category_id,
						required: ""
					}, {
						default: R(() => [S(N(re), {
							modelValue: q.category_id,
							"onUpdate:modelValue": c[3] ||= (e) => q.category_id = e,
							options: Ee.value,
							clearable: "",
							disabled: K.value,
							"aria-label": "文章分类"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					c[39] ||= b("h3", null, "文章设置", -1),
					S(N(o), {
						label: "文章封面",
						prop: "cover_url",
						error: N(X).cover_url
					}, {
						default: R(() => [S(Re, {
							modelValue: q.cover_url,
							"onUpdate:modelValue": c[4] ||= (e) => q.cover_url = e,
							label: "文章封面",
							disabled: K.value,
							upload: N(ie),
							onBusyChange: c[5] ||= (e) => H.value = e,
							onStart: c[6] ||= (e) => D.value = "",
							onError: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "内容来源",
						prop: "content_source",
						error: N(X).content_source
					}, {
						default: R(() => [S(N(p), {
							modelValue: q.content_source,
							"onUpdate:modelValue": c[7] ||= (e) => q.content_source = e,
							maxlength: 160,
							disabled: K.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "作者署名",
						prop: "author_name",
						error: N(X).author_name
					}, {
						default: R(() => [S(N(p), {
							modelValue: q.author_name,
							"onUpdate:modelValue": c[8] ||= (e) => q.author_name = e,
							maxlength: 120,
							disabled: K.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "前端排序",
						prop: "sort_order",
						error: N(X).sort_order
					}, {
						default: R(() => [S(N(n), {
							modelValue: q.sort_order,
							"onUpdate:modelValue": c[9] ||= (e) => q.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: K.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					c[40] ||= b("h3", null, "发布设置", -1),
					S(N(o), {
						label: "搜索关键词",
						prop: "search_keywords",
						error: N(X).search_keywords
					}, {
						default: R(() => [S(N(p), {
							modelValue: q.search_keywords,
							"onUpdate:modelValue": c[10] ||= (e) => q.search_keywords = e,
							maxlength: 2e3,
							disabled: K.value,
							placeholder: "使用空格或逗号分隔",
							"aria-label": "搜索关键词"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: N(X).helpful_enabled
					}, {
						default: R(() => [S(Lt, {
							modelValue: q.helpful_enabled,
							"onUpdate:modelValue": c[11] ||= (e) => q.helpful_enabled = e,
							disabled: K.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "相关文章",
						prop: "related_content_ids",
						error: N(X).related_content_ids
					}, {
						default: R(() => [b("div", ln, [
							S(N(p), {
								modelValue: xe.value,
								"onUpdate:modelValue": c[12] ||= (e) => xe.value = e,
								disabled: K.value,
								placeholder: "搜索文章标题",
								"aria-label": "搜索相关文章",
								onKeydown: B(V(Te, ["prevent"]), ["enter"])
							}, null, 8, [
								"modelValue",
								"disabled",
								"onKeydown"
							]),
							S(N(i), {
								size: "sm",
								disabled: K.value,
								loading: $.value,
								onClick: Te
							}, {
								default: R(() => [...c[37] ||= [x("查找文章", -1)]]),
								_: 1
							}, 8, ["disabled", "loading"]),
							S(N(re), {
								modelValue: q.related_content_ids,
								"onUpdate:modelValue": c[13] ||= (e) => q.related_content_ids = e,
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
							c[38] ||= b("p", { class: "article-editor__hint" }, " 最多 20 篇，按选择顺序展示。可关联草稿，前台须按发布状态过滤。 ", -1)
						])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "启用状态",
						prop: "is_enabled",
						error: N(X).is_enabled
					}, {
						default: R(() => [S(Lt, {
							modelValue: q.is_enabled,
							"onUpdate:modelValue": c[14] ||= (e) => q.is_enabled = e,
							disabled: K.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: N(X).scheduled_local
					}, {
						default: R(() => [S(N(p), {
							modelValue: q.scheduled_local,
							"onUpdate:modelValue": c[15] ||= (e) => q.scheduled_local = e,
							type: "datetime-local",
							disabled: K.value || !U.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					c[41] ||= b("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), b("main", un, [S(N(a), {
				model: q,
				rules: N(Y),
				"label-position": "top",
				onSubmit: c[20] ||= V(() => {}, ["prevent"])
			}, {
				default: R(() => [
					S(N(o), {
						label: "标题",
						prop: "title",
						error: N(X).title,
						required: ""
					}, {
						default: R(() => [S(N(p), {
							modelValue: q.title,
							"onUpdate:modelValue": c[17] ||= (e) => q.title = e,
							maxlength: 255,
							disabled: K.value,
							placeholder: "输入文章标题",
							"aria-label": "文章标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "摘要",
						prop: "summary",
						error: N(X).summary
					}, {
						default: R(() => [z(b("textarea", {
							"onUpdate:modelValue": c[18] ||= (e) => q.summary = e,
							"aria-invalid": !!N(X).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: K.value,
							"aria-label": "文章摘要"
						}, null, 8, dn), [[F, q.summary]])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "正文",
						prop: "body_html",
						error: N(X).body_html
					}, {
						default: R(() => [S(N(t), {
							modelValue: q.body_html,
							"onUpdate:modelValue": c[19] ||= (e) => q.body_html = e,
							readonly: he.value,
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
			S(N(r), {
				modelValue: ue.value,
				"onUpdate:modelValue": c[24] ||= (e) => ue.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: R(() => [S(N(i), {
					variant: "primary",
					onClick: c[23] ||= (e) => ue.value = !1
				}, {
					default: R(() => [...c[42] ||= [x("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [S(N(a), {
					model: q,
					rules: N(Y),
					"label-position": "top",
					onSubmit: c[22] ||= V(() => {}, ["prevent"])
				}, {
					default: R(() => [S(N(o), {
						label: "SEO 描述",
						prop: "seo_description",
						error: N(X).seo_description
					}, {
						default: R(() => [z(b("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": c[21] ||= (e) => q.seo_description = e,
							"aria-invalid": !!N(X).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: K.value,
							"aria-label": "SEO 描述"
						}, null, 8, fn), [[F, q.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			S(N(r), {
				modelValue: j.value,
				"onUpdate:modelValue": c[26] ||= (e) => j.value = e,
				title: "确认删除",
				subtitle: `操作对象：${q.title || "未命名文章"}`,
				width: "460px",
				"panel-class": "help-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !T.value
			}, {
				"header-actions": R(() => [b("span", pn, [S(N(h), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [S(N(i), {
					disabled: T.value,
					onClick: c[25] ||= (e) => j.value = !1
				}, {
					default: R(() => [...c[43] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(i), {
					variant: "warning",
					loading: T.value,
					onClick: G
				}, {
					default: R(() => [...c[44] ||= [x("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [S(N(f), {
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
			S(N(r), {
				modelValue: fe.value,
				"onUpdate:modelValue": c[29] ||= (e) => fe.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [S(N(i), { onClick: c[27] ||= (e) => fe.value = !1 }, {
					default: R(() => [...c[45] ||= [x("继续编辑", -1)]]),
					_: 1
				}), S(N(i), {
					variant: "primary",
					onClick: c[28] ||= (e) => C("close")
				}, {
					default: R(() => [...c[46] ||= [x("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			S(N(r), {
				modelValue: A.value,
				"onUpdate:modelValue": c[31] ||= (e) => A.value = e,
				title: "将文章转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [S(N(i), { onClick: c[30] ||= (e) => A.value = !1 }, {
					default: R(() => [...c[47] ||= [x("取消", -1)]]),
					_: 1
				}), S(N(i), {
					variant: "primary",
					onClick: Pe
				}, {
					default: R(() => [...c[48] ||= [x("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Zt));
	}
}), [["__scopeId", "data-v-16f68391"]]), hn = { class: "help-articles" }, gn = {
	key: 0,
	class: "help-statistics-note"
}, _n = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let t = pe(), { helpPublishStates: n, helpCategoryLabel: r, getHelpList: a, getHelpMetadata: o } = Ft(), { hasPermission: s } = pe(), { formatDateTime: c } = pe(), l = k(!1), u = k(), d = (e) => s([`cms_help:${e}`]), ne = k(), f = W(o, (e) => {
			ne.value = e;
		}), re = [
			...he(),
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
				formatter: (e) => r(ne.value, e)
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
		], { proTableBindings: ae, reload: oe, filters: p } = ee({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: g(() => [
				...f.fields,
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
						label: r(ne.value, e.id),
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
		f.bindFilters(p);
		let m = new AbortController();
		async function se() {
			try {
				ne.value = await o(m.signal);
			} catch {}
		}
		function b(e) {
			u.value = e, l.value = !0;
		}
		function C() {
			l.value = !1, oe(), se();
		}
		return le(se), ce(() => m.abort()), (e, r) => (O(), y("div", hn, [
			!l.value && N(t).mode === "platform" ? (O(), y("p", gn, " 当前管理平台默认模板。浏览量、评价数及有帮助率属于站点运行数据，此处显示“—”，不汇总白标站点。 ")) : v("", !0),
			l.value ? (O(), _(mn, {
				key: 1,
				"article-id": u.value,
				onClose: r[0] ||= (e) => l.value = !1,
				onSaved: C
			}, null, 8, ["article-id"])) : v("", !0),
			z(S(N(te), T(N(ae), {
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
				"cell-cms_source_type": R(({ row: e }) => [S(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [d("add") ? (O(), _(N(i), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[1] ||= (e) => b()
				}, {
					icon: R(() => [S(N(h), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [r[2] ||= x("新增文章", -1)]),
					_: 1
				})) : v("", !0)]),
				"cell-publish_status": R(({ row: e }) => [S(N(ie), {
					size: "sm",
					effect: "soft",
					type: e.publish_status === "published" ? "success" : "warning"
				}, {
					default: R(() => [x(M(N(n).find((t) => t.value === e.publish_status)?.label), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-is_enabled": R(({ row: e }) => [S(N(ie), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [x(M(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-publish_time": R(({ row: e }) => [x(M(N(c)(e.published_at || e.scheduled_at)), 1)]),
				"cell-actions": R(({ row: e }) => [S(N(i), {
					size: "sm",
					"icon-only": "",
					title: d("edit") ? "编辑文章" : "文章详情",
					"aria-label": d("edit") ? "编辑文章" : "文章详情",
					onClick: (t) => b(e.id)
				}, {
					default: R(() => [S(N(h), {
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
}), [["__scopeId", "data-v-e3373337"]]);
//#endregion
//#region src/cms/api/content/feedback.ts
function vn() {
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
var yn = { class: "feedback-page" }, bn = ["aria-busy"], xn = {
	key: 0,
	role: "status"
}, Sn = { class: "feedback-info" }, Cn = { class: "feedback-content" }, wn = {
	key: 0,
	class: "muted"
}, Tn = { class: "attachment-title" }, En = ["src", "alt"], Dn = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let { getFeedbackList: t, getFeedbackMetadata: n, getFeedbackDetail: a, getFeedbackAttachment: o, feedbackSourceTypes: s, feedbackSourceLabel: c, feedbackError: l } = vn(), { formatDateTime: u } = pe(), d = k({
			scenes: [],
			issues: []
		}), ne = W(n, (e) => {
			d.value = e;
		}), re = [
			...he(),
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
		], { proTableBindings: ae, filters: oe } = ee({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: g(() => [
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
		let p = k(!1), m = k(!1), C = k(""), w = k(), E = k({}), D = k(""), ue, de = new AbortController();
		async function A(e) {
			ue?.abort();
			let t = new AbortController();
			ue = t, w.value = void 0, E.value = {}, C.value = "", D.value = "", p.value = !0, m.value = !0;
			try {
				let n = await a(e, t.signal);
				t.signal.aborted || (w.value = n);
			} catch (e) {
				t.signal.aborted || (C.value = l(e));
			} finally {
				t.signal.aborted || (m.value = !1);
			}
		}
		async function j(e) {
			let t = ue, n = w.value?.id;
			if (!(!t || !n || D.value)) {
				D.value = e, C.value = "";
				try {
					let r = await o(n, e, t.signal);
					!t.signal.aborted && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(r.data_url) && (E.value[e] = r.data_url);
				} catch (e) {
					t.signal.aborted || (C.value = l(e));
				} finally {
					t.signal.aborted || (D.value = "");
				}
			}
		}
		return L(p, (e) => {
			e || (ue?.abort(), w.value = void 0, E.value = {}, C.value = "");
		}), le(async () => {
			try {
				d.value = await n(de.signal);
			} catch {}
		}), ce(() => {
			de.abort(), ue?.abort();
		}), (e, t) => (O(), y("div", yn, [S(N(te), T(N(ae), {
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
			"cell-cms_source_type": R(({ row: e }) => [S(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"cell-source_type": R(({ row: e }) => [S(N(ie), {
				size: "sm",
				effect: "soft",
				type: e.source_type === "merchant" ? "warning" : e.source_type === "platform" ? "success" : "primary"
			}, {
				default: R(() => [x(M(N(c)(e.source_type)), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-actions": R(({ row: e }) => [S(N(i), {
				size: "sm",
				"icon-only": "",
				title: "查看反馈",
				"aria-label": "查看反馈",
				onClick: (t) => A(e.id)
			}, {
				default: R(() => [S(N(h), {
					name: "eye",
					size: 15
				})]),
				_: 1
			}, 8, ["onClick"])]),
			_: 1
		}, 16), S(N(r), {
			modelValue: p.value,
			"onUpdate:modelValue": t[1] ||= (e) => p.value = e,
			title: "反馈详情",
			subtitle: w.value?.code || "查看用户正式提交的意见反馈",
			width: "760px",
			"close-on-click-modal": !1
		}, {
			footer: R(() => [S(N(i), { onClick: t[0] ||= (e) => p.value = !1 }, {
				default: R(() => [...t[14] ||= [x("关闭", -1)]]),
				_: 1
			})]),
			default: R(() => [b("div", {
				class: "feedback-detail",
				"aria-busy": m.value
			}, [
				m.value ? (O(), y("p", xn, "正在读取反馈…")) : v("", !0),
				C.value ? (O(), _(N(f), {
					key: 1,
					type: "error",
					closable: !1,
					description: C.value
				}, null, 8, ["description"])) : v("", !0),
				w.value && !m.value ? (O(), y(se, { key: 2 }, [
					b("dl", Sn, [
						b("div", null, [t[2] ||= b("dt", null, "UID", -1), b("dd", null, M(w.value.public_user_id_snapshot), 1)]),
						b("div", null, [t[3] ||= b("dt", null, "用户账号", -1), b("dd", null, M(w.value.username_snapshot || "—"), 1)]),
						b("div", null, [t[4] ||= b("dt", null, "来源类型", -1), b("dd", null, M(N(c)(w.value.source_type)), 1)]),
						b("div", null, [t[5] ||= b("dt", null, "来源名称", -1), b("dd", null, M(w.value.source_name_snapshot || "—"), 1)]),
						b("div", null, [t[6] ||= b("dt", null, "业务场景", -1), b("dd", null, M(w.value.scene_name_snapshot), 1)]),
						b("div", null, [t[7] ||= b("dt", null, "问题分类", -1), b("dd", null, M(w.value.issue_category_name_snapshot), 1)]),
						b("div", null, [t[8] ||= b("dt", null, "联系方式（脱敏）", -1), b("dd", null, M(w.value.contact_display), 1)]),
						b("div", null, [t[9] ||= b("dt", null, "提交时间", -1), b("dd", null, M(N(u)(w.value.submitted_at)), 1)])
					]),
					b("section", null, [t[10] ||= b("h3", null, "反馈内容", -1), b("div", Cn, M(w.value.content), 1)]),
					b("section", null, [
						b("h3", null, [t[11] ||= x(" 附件 ", -1), b("span", null, M(w.value.attachments?.length || 0), 1)]),
						w.value.attachments?.length ? v("", !0) : (O(), y("p", wn, "暂无附件")),
						(O(!0), y(se, null, fe(w.value.attachments, (e) => (O(), y("div", {
							key: e.id,
							class: "feedback-attachment"
						}, [b("div", Tn, [b("span", null, M(e.original_name || "图片附件") + " · " + M(Math.ceil(e.byte_size / 1024)) + " KB", 1), S(N(i), {
							size: "sm",
							loading: D.value === e.id,
							onClick: (t) => j(e.id)
						}, {
							default: R(() => [...t[12] ||= [x("查看图片", -1)]]),
							_: 1
						}, 8, ["loading", "onClick"])]), E.value[e.id] ? (O(), y("img", {
							key: 0,
							src: E.value[e.id],
							alt: e.original_name || "反馈图片"
						}, null, 8, En)) : v("", !0)]))), 128))
					]),
					t[13] ||= b("p", { class: "muted" }, "来源和分类为提交时快照；此页面仅查看，不修改用户原始反馈。", -1)
				], 64)) : v("", !0)
			], 8, bn)]),
			_: 1
		}, 8, ["modelValue", "subtitle"])]));
	}
}), [["__scopeId", "data-v-ed508c88"]]);
//#endregion
//#region src/cms/api/content/announcement.ts
function On() {
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
var kn = { class: "announcement-categories" }, An = ["aria-busy"], jn = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Mn = { class: "taxonomy-editor__field" }, Nn = { class: "taxonomy-editor__row" }, Pn = "分类", Fn = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = pe(), { formatDateTime: s } = pe(), { announcementError: c, deleteAnnouncement: l, getAnnouncementMetadata: u, getAnnouncementList: d, getAnnouncementDetail: ne, saveAnnouncement: oe } = On(), m = (e) => t([`cms_announcement_category:${e}`]), se = k(), C = k(), w = W(u, (e) => {
			se.value = e;
		}), E = [
			...he(),
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
		], { proTableBindings: D, reload: ue, filters: fe } = ee({
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
		w.bindFilters(fe);
		let A = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), j = de(A()), P = k(!1), F = k(!1), I = k(!1), L = k(!1), z = k(!1), B = k(""), H = k(!1), me = k(""), U = k(!1), K = g(() => !m(j.id ? "edit" : "add")), q = g(() => I.value || L.value), J = "", Y;
		async function X(e) {
			Y?.abort(), Y = new AbortController();
			let t = Y;
			Object.assign(j, A(), { id: e || "" }), me.value = "", z.value = !1, B.value = "", H.value = !1, P.value = !0, F.value = !0, J = JSON.stringify(j);
			try {
				if (C.value = await u(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await ne("categories", e, t.signal);
				if (C.value = await u(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(j, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), J = JSON.stringify(j);
			} catch (e) {
				t.signal.aborted || (H.value = !0, me.value = c(e));
			} finally {
				t.signal.aborted || (F.value = !1);
			}
		}
		function Z() {
			return q.value ? !1 : !F.value && !H.value && JSON.stringify(j) !== J ? (U.value = !0, !1) : (Y?.abort(), !0);
		}
		function _e() {
			Z() && (P.value = !1);
		}
		function ve() {
			Y?.abort(), U.value = !1, P.value = !1;
		}
		async function Q() {
			if (!(K.value || q.value || F.value || H.value)) {
				if (!j.name.trim() || j.sort_order === null) {
					me.value = "请填写分类名称和排序";
					return;
				}
				I.value = !0, me.value = "";
				try {
					await oe("categories", {
						name: j.name,
						parent_id: j.parent_id || null,
						sort_order: j.sort_order,
						is_enabled: j.is_enabled,
						id: j.id || void 0,
						row_version: j.id ? j.row_version : void 0
					}), P.value = !1, ae.success("保存成功"), await Promise.all([ue(), Se()]);
				} catch (e) {
					me.value = c(e);
				} finally {
					I.value = !1;
				}
			}
		}
		function ye() {
			!j.id || !m("delete") || q.value || F.value || H.value || (B.value = "", z.value = !0);
		}
		async function be() {
			if (!(!z.value || !j.id || !m("delete") || q.value || F.value || H.value)) {
				L.value = !0, B.value = "";
				try {
					await l("categories", j.id, j.row_version), z.value = !1, P.value = !1, ae.success("分类已删除"), await Promise.all([ue(), Se()]);
				} catch (e) {
					B.value = c(e);
				} finally {
					L.value = !1;
				}
			}
		}
		let xe = g(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(C.value?.categories || []).filter((e) => !e.parent_id && e.id !== j.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), $ = new AbortController();
		async function Se() {
			try {
				se.value = await u($.signal);
			} catch {}
		}
		return le(Se), ce(() => {
			Y?.abort(), $.abort();
		}), (e, t) => (O(), y("div", kn, [
			S(N(te), T(N(D), {
				"auto-refreshable": !1,
				columns: E,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Pn}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": R(({ row: e }) => [S(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [m("add") ? (O(), _(N(i), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: t[0] ||= (e) => X()
				}, {
					icon: R(() => [S(N(h), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [x("新增" + M(Pn))]),
					_: 1
				})) : v("", !0)]),
				"cell-is_enabled": R(({ row: e }) => [S(N(ie), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: R(() => [x(M(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": R(({ row: e }) => [S(N(i), {
					size: "sm",
					"icon-only": "",
					title: m("edit") ? `编辑${Pn}` : `${Pn}详情`,
					"aria-label": m("edit") ? `编辑${Pn}` : `${Pn}详情`,
					onClick: (t) => X(e.id)
				}, {
					default: R(() => [S(N(h), {
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
			S(N(r), {
				modelValue: P.value,
				"onUpdate:modelValue": t[5] ||= (e) => P.value = e,
				title: `${j.id ? "编辑" : "新增"}公告${Pn}`,
				width: "680px",
				subtitle: "公告分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Z
			}, {
				footer: R(() => [
					j.id && m("delete") ? (O(), _(N(i), {
						key: 0,
						variant: "danger",
						disabled: F.value || H.value || q.value,
						onClick: ye
					}, {
						icon: R(() => [S(N(h), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [t[11] ||= x("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : v("", !0),
					S(N(i), {
						disabled: q.value,
						onClick: _e
					}, {
						default: R(() => [...t[12] ||= [x("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					K.value ? v("", !0) : (O(), _(N(i), {
						key: 1,
						variant: "primary",
						loading: I.value,
						disabled: F.value || H.value || L.value,
						onClick: Q
					}, {
						default: R(() => [x("保存" + M(Pn))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [b("div", {
					class: "taxonomy-editor",
					"aria-busy": F.value
				}, [
					F.value ? (O(), y("div", jn, [S(N(h), {
						name: "loader-circle",
						class: "announcement-spin",
						size: 24
					}), b("span", null, "正在读取" + M(Pn) + "...")])) : v("", !0),
					me.value ? (O(), _(N(f), {
						key: 1,
						type: "error",
						closable: !1,
						description: me.value
					}, null, 8, ["description"])) : v("", !0),
					!F.value && !H.value ? (O(), _(N(a), {
						key: 2,
						model: j,
						"label-position": "top",
						onSubmit: V(Q, ["prevent"])
					}, {
						default: R(() => [
							j.id ? (O(), _(N(o), {
								key: 0,
								label: "分类ID"
							}, {
								default: R(() => [S(N(p), {
									"model-value": j.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : v("", !0),
							S(N(o), {
								label: `${Pn}名称`,
								required: ""
							}, {
								default: R(() => [S(N(p), {
									modelValue: j.name,
									"onUpdate:modelValue": t[1] ||= (e) => j.name = e,
									maxlength: 120,
									disabled: K.value || q.value,
									"aria-label": `${Pn}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							S(N(o), { label: "父分类" }, {
								default: R(() => [b("div", Mn, [S(N(re), {
									modelValue: j.parent_id,
									"onUpdate:modelValue": t[2] ||= (e) => j.parent_id = e,
									options: xe.value,
									disabled: K.value || q.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), t[10] ||= b("p", { class: "announcement-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类公告。 ", -1)])]),
								_: 1
							}),
							b("div", Nn, [S(N(o), {
								label: "前端排序",
								required: ""
							}, {
								default: R(() => [S(N(n), {
									modelValue: j.sort_order,
									"onUpdate:modelValue": t[3] ||= (e) => j.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: K.value || q.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), S(N(o), { label: "启用状态" }, {
								default: R(() => [S(ge, {
									modelValue: j.is_enabled,
									"onUpdate:modelValue": t[4] ||= (e) => j.is_enabled = e,
									disabled: K.value || q.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : v("", !0)
				], 8, An)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			S(N(r), {
				modelValue: z.value,
				"onUpdate:modelValue": t[7] ||= (e) => z.value = e,
				title: "删除公告分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !L.value
			}, {
				footer: R(() => [S(N(i), {
					disabled: L.value,
					onClick: t[6] ||= (e) => z.value = !1
				}, {
					default: R(() => [...t[13] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(i), {
					variant: "danger",
					loading: L.value,
					onClick: be
				}, {
					default: R(() => [...t[14] ||= [x("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [b("p", null, "确认删除分类“" + M(j.name) + "”？有关联公告或子分类的分类无法删除。", 1), B.value ? (O(), _(N(f), {
					key: 0,
					type: "error",
					closable: !1,
					description: B.value
				}, null, 8, ["description"])) : v("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			S(N(r), {
				modelValue: U.value,
				"onUpdate:modelValue": t[9] ||= (e) => U.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [S(N(i), { onClick: t[8] ||= (e) => U.value = !1 }, {
					default: R(() => [...t[15] ||= [x("继续编辑", -1)]]),
					_: 1
				}), S(N(i), {
					variant: "primary",
					onClick: ve
				}, {
					default: R(() => [...t[16] ||= [x("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-1b5aec70"]]), In = ["aria-busy"], Ln = { class: "article-editor__header" }, Rn = { class: "article-editor__heading" }, zn = { class: "article-editor__commands" }, Bn = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, Vn = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Hn = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, Un = {
	key: 1,
	class: "article-editor__failure"
}, Wn = {
	key: 0,
	class: "article-editor__error"
}, Gn = { class: "article-editor__body" }, Kn = { class: "article-editor__settings" }, qn = { class: "article-editor__content" }, Jn = ["aria-invalid", "disabled"], Yn = ["aria-invalid", "disabled"], Xn = {
	class: "announcement-delete-dialog__icon",
	"aria-hidden": "true"
}, Zn = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(e, { emit: s }) {
		let { hasPermission: c } = pe(), { announcementError: l, announcementCategoryLabel: u, deleteAnnouncement: ee, getAnnouncementDetail: te, getAnnouncementMetadata: d, saveAnnouncement: ne, uploadAnnouncementCover: ie } = On(), oe = e, m = s, C = k(!0), w = k(!1), T = k(!1), E = k(""), D = k(!1), ue = k(!1), fe = k(!1), A = k(!1), j = k(pe().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), P = k(), I = k("draft"), L = k(!1), B = g(() => c(["cms_announcement:publish"])), H = g(() => !c([`cms_announcement:${oe.articleId ? "edit" : "add"}`]) || !B.value && I.value !== "draft"), U = g(() => c(["cms_announcement:delete"]) && (B.value || I.value === "draft"));
		async function he() {
			if (!(!U.value || w.value || C.value || T.value)) {
				w.value = !0, E.value = "";
				try {
					await ee("articles", G.id, G.row_version), be = JSON.stringify(G), ae.success("公告已删除"), m("saved");
				} catch (e) {
					E.value = l(e), A.value = !1;
				} finally {
					w.value = !1;
				}
			}
		}
		let W = g(() => H.value || w.value), G = de({
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
		}), { editorRoot: K, seoInput: q, fieldRules: ge, fieldErrors: J, pendingCount: Y, saveError: X, validateSave: Z, setSaveFailure: _e, focusFirstError: ve, focusSeoError: Q } = Se(G, () => P.value?.categories || [], "announcement", D), ye = g(() => (P.value?.categories || []).map((e) => ({
			label: u(P.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), be = "", xe;
		function $(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Ce() {
			xe?.abort(), xe = new AbortController();
			let e = xe;
			C.value = !0, T.value = !1, E.value = "";
			try {
				if (P.value = await d(e.signal, { cms_source_type: "platform" }), oe.articleId) {
					let t = await te("articles", oe.articleId, e.signal);
					if (P.value = await d(e.signal, { space_id: String(t.space_id) }), j.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					G.scheduled_local = t.publish_status === "scheduled" ? $(t.scheduled_at) : "", I.value = t.publish_status;
				}
				be = JSON.stringify(G);
			} catch (t) {
				e.signal.aborted || (E.value = l(t), T.value = !0);
			} finally {
				e.signal.aborted || (C.value = !1);
			}
		}
		let we = () => !C.value && !T.value && be !== JSON.stringify(G);
		function Te() {
			we() ? ue.value = !0 : m("close");
		}
		function Ee() {
			I.value === "draft" ? Oe("draft") : fe.value = !0;
		}
		function De() {
			fe.value = !1, Oe("draft");
		}
		async function Oe(e) {
			if (W.value || C.value || T.value || L.value || (E.value = "", !await Z(e))) return;
			let t = G.scheduled_local ? new Date(G.scheduled_local) : null;
			w.value = !0, E.value = "";
			try {
				await ne("articles", {
					...G,
					id: G.id || void 0,
					row_version: G.id ? G.row_version : void 0,
					category_id: G.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), be = JSON.stringify(G), ae.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "公告已发布"), m("saved");
			} catch (e) {
				_e(e);
			} finally {
				w.value = !1;
			}
			Y.value && await ve();
		}
		function ke(e) {
			E.value = l(e);
		}
		let Ae = (e) => {
			we() && (e.preventDefault(), e.returnValue = "");
		};
		return me(() => !w.value && !L.value && (!we() || window.confirm("公告有未保存的修改，确定离开？"))), le(() => {
			Ce(), window.addEventListener("beforeunload", Ae);
		}), ce(() => {
			xe?.abort(), window.removeEventListener("beforeunload", Ae);
		}), (s, c) => (O(), y("section", {
			ref_key: "editorRoot",
			ref: K,
			class: "article-editor",
			"aria-busy": C.value || w.value
		}, [
			b("header", Ln, [
				S(N(i), {
					"icon-only": "",
					title: "返回公告列表",
					"aria-label": "返回公告列表",
					disabled: w.value || L.value,
					onClick: Te
				}, {
					default: R(() => [S(N(h), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				b("div", Rn, [b("h2", null, M(e.articleId ? "编辑公告" : "新增公告"), 1), b("span", null, M(P.value?.source_locale || "zh-CN") + " · " + M(j.value), 1)]),
				b("div", zn, [
					e.articleId && U.value ? (O(), _(N(i), {
						key: 0,
						size: "sm",
						disabled: C.value || T.value || w.value || L.value,
						onClick: c[0] ||= (e) => A.value = !0
					}, {
						default: R(() => [...c[29] ||= [x("删除公告", -1)]]),
						_: 1
					}, 8, ["disabled"])) : v("", !0),
					S(N(i), {
						size: "sm",
						disabled: C.value || T.value,
						onClick: c[1] ||= (e) => D.value = !0
					}, {
						icon: R(() => [S(N(h), {
							name: "search",
							size: 14
						})]),
						default: R(() => [c[30] ||= x("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					H.value ? v("", !0) : (O(), _(N(i), {
						key: 1,
						size: "sm",
						disabled: C.value || T.value || w.value || L.value,
						onClick: Ee
					}, {
						icon: R(() => [S(N(h), {
							name: "save",
							size: 14
						})]),
						default: R(() => [c[31] ||= x("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					N(X) ? (O(), y("span", Bn, M(N(X)), 1)) : v("", !0),
					!H.value && N(Y) ? (O(), y("span", Vn, "还有 " + M(N(Y)) + " 项待完善", 1)) : v("", !0),
					!H.value && B.value ? (O(), _(N(i), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: C.value || T.value || L.value,
						loading: w.value,
						onClick: c[2] ||= (e) => Oe(G.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [S(N(h), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [x(M(G.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : v("", !0)
				])
			]),
			C.value ? (O(), y("div", Hn, [S(N(h), {
				name: "loader-circle",
				class: "announcement-spin",
				size: 28
			}), c[32] ||= b("span", null, "正在读取公告资料...", -1)])) : T.value ? (O(), y("div", Un, [S(N(f), {
				type: "error",
				description: E.value,
				closable: !1
			}, null, 8, ["description"]), S(N(i), { onClick: Ce }, {
				default: R(() => [...c[33] ||= [x("重新加载", -1)]]),
				_: 1
			})])) : (O(), y(se, { key: 2 }, [E.value ? (O(), y("div", Wn, [S(N(f), {
				type: "error",
				description: E.value,
				closable: !1
			}, null, 8, ["description"])])) : v("", !0), b("div", Gn, [b("aside", Kn, [S(N(a), {
				model: G,
				rules: N(ge),
				"label-position": "top",
				onSubmit: c[13] ||= V(() => {}, ["prevent"])
			}, {
				default: R(() => [
					S(N(o), {
						label: "公告分类",
						prop: "category_id",
						error: N(J).category_id,
						required: ""
					}, {
						default: R(() => [S(N(re), {
							modelValue: G.category_id,
							"onUpdate:modelValue": c[3] ||= (e) => G.category_id = e,
							options: ye.value,
							clearable: "",
							disabled: W.value,
							"aria-label": "公告分类"
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}, 8, ["error"]),
					c[34] ||= b("h3", null, "公告设置", -1),
					S(N(o), {
						label: "公告封面",
						prop: "cover_url",
						error: N(J).cover_url
					}, {
						default: R(() => [S(Re, {
							modelValue: G.cover_url,
							"onUpdate:modelValue": c[4] ||= (e) => G.cover_url = e,
							label: "公告封面",
							disabled: W.value,
							upload: N(ie),
							onBusyChange: c[5] ||= (e) => L.value = e,
							onStart: c[6] ||= (e) => E.value = "",
							onError: ke
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "内容来源",
						prop: "content_source",
						error: N(J).content_source
					}, {
						default: R(() => [S(N(p), {
							modelValue: G.content_source,
							"onUpdate:modelValue": c[7] ||= (e) => G.content_source = e,
							maxlength: 160,
							disabled: W.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "作者署名",
						prop: "author_name",
						error: N(J).author_name
					}, {
						default: R(() => [S(N(p), {
							modelValue: G.author_name,
							"onUpdate:modelValue": c[8] ||= (e) => G.author_name = e,
							maxlength: 120,
							disabled: W.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "前端排序",
						prop: "sort_order",
						error: N(J).sort_order
					}, {
						default: R(() => [S(N(n), {
							modelValue: G.sort_order,
							"onUpdate:modelValue": c[9] ||= (e) => G.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: W.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					c[35] ||= b("h3", null, "发布设置", -1),
					S(N(o), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: N(J).helpful_enabled
					}, {
						default: R(() => [S(Lt, {
							modelValue: G.helpful_enabled,
							"onUpdate:modelValue": c[10] ||= (e) => G.helpful_enabled = e,
							disabled: W.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "启用状态",
						prop: "is_enabled",
						error: N(J).is_enabled
					}, {
						default: R(() => [S(Lt, {
							modelValue: G.is_enabled,
							"onUpdate:modelValue": c[11] ||= (e) => G.is_enabled = e,
							disabled: W.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: N(J).scheduled_local
					}, {
						default: R(() => [S(N(p), {
							modelValue: G.scheduled_local,
							"onUpdate:modelValue": c[12] ||= (e) => G.scheduled_local = e,
							type: "datetime-local",
							disabled: W.value || !B.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					c[36] ||= b("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), b("main", qn, [S(N(a), {
				model: G,
				rules: N(ge),
				"label-position": "top",
				onSubmit: c[17] ||= V(() => {}, ["prevent"])
			}, {
				default: R(() => [
					S(N(o), {
						label: "标题",
						prop: "title",
						error: N(J).title,
						required: ""
					}, {
						default: R(() => [S(N(p), {
							modelValue: G.title,
							"onUpdate:modelValue": c[14] ||= (e) => G.title = e,
							maxlength: 255,
							disabled: W.value,
							placeholder: "输入公告标题",
							"aria-label": "公告标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "摘要",
						prop: "summary",
						error: N(J).summary
					}, {
						default: R(() => [z(b("textarea", {
							"onUpdate:modelValue": c[15] ||= (e) => G.summary = e,
							"aria-invalid": !!N(J).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: W.value,
							"aria-label": "公告摘要"
						}, null, 8, Jn), [[F, G.summary]])]),
						_: 1
					}, 8, ["error"]),
					S(N(o), {
						label: "正文",
						prop: "body_html",
						error: N(J).body_html
					}, {
						default: R(() => [S(N(t), {
							modelValue: G.body_html,
							"onUpdate:modelValue": c[16] ||= (e) => G.body_html = e,
							readonly: H.value,
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
			S(N(r), {
				modelValue: D.value,
				"onUpdate:modelValue": c[21] ||= (e) => D.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: R(() => [S(N(i), {
					variant: "primary",
					onClick: c[20] ||= (e) => D.value = !1
				}, {
					default: R(() => [...c[37] ||= [x("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [S(N(a), {
					model: G,
					rules: N(ge),
					"label-position": "top",
					onSubmit: c[19] ||= V(() => {}, ["prevent"])
				}, {
					default: R(() => [S(N(o), {
						label: "SEO 描述",
						prop: "seo_description",
						error: N(J).seo_description
					}, {
						default: R(() => [z(b("textarea", {
							ref_key: "seoInput",
							ref: q,
							"onUpdate:modelValue": c[18] ||= (e) => G.seo_description = e,
							"aria-invalid": !!N(J).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: W.value,
							"aria-label": "SEO 描述"
						}, null, 8, Yn), [[F, G.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			S(N(r), {
				modelValue: A.value,
				"onUpdate:modelValue": c[23] ||= (e) => A.value = e,
				title: "确认删除",
				subtitle: `操作对象：${G.title || "未命名公告"}`,
				width: "460px",
				"panel-class": "announcement-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !w.value
			}, {
				"header-actions": R(() => [b("span", Xn, [S(N(h), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [S(N(i), {
					disabled: w.value,
					onClick: c[22] ||= (e) => A.value = !1
				}, {
					default: R(() => [...c[38] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(i), {
					variant: "warning",
					loading: w.value,
					onClick: he
				}, {
					default: R(() => [...c[39] ||= [x("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [S(N(f), {
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
			S(N(r), {
				modelValue: ue.value,
				"onUpdate:modelValue": c[26] ||= (e) => ue.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [S(N(i), { onClick: c[24] ||= (e) => ue.value = !1 }, {
					default: R(() => [...c[40] ||= [x("继续编辑", -1)]]),
					_: 1
				}), S(N(i), {
					variant: "primary",
					onClick: c[25] ||= (e) => m("close")
				}, {
					default: R(() => [...c[41] ||= [x("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			S(N(r), {
				modelValue: fe.value,
				"onUpdate:modelValue": c[28] ||= (e) => fe.value = e,
				title: "将公告转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [S(N(i), { onClick: c[27] ||= (e) => fe.value = !1 }, {
					default: R(() => [...c[42] ||= [x("取消", -1)]]),
					_: 1
				}), S(N(i), {
					variant: "primary",
					onClick: De
				}, {
					default: R(() => [...c[43] ||= [x("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, In));
	}
}), [["__scopeId", "data-v-525a2f73"]]), Qn = { class: "announcement-articles" }, $n = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = pe(), { formatDateTime: n } = pe(), { announcementPublishStates: r, announcementCategoryLabel: a, getAnnouncementList: o, getAnnouncementMetadata: s } = On(), c = k(!1), l = k(), u = (e) => t([`cms_announcement:${e}`]), d = k(), ne = W(s, (e) => {
			d.value = e;
		}), f = [
			...he(),
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
		], { proTableBindings: re, reload: ae, filters: oe } = ee({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: g(() => [
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
		ne.bindFilters(oe);
		let p = new AbortController();
		async function m() {
			try {
				d.value = await s(p.signal);
			} catch {}
		}
		function se(e) {
			l.value = e, c.value = !0;
		}
		function b() {
			c.value = !1, ae(), m();
		}
		return le(m), ce(() => p.abort()), (e, t) => (O(), y("div", Qn, [c.value ? (O(), _(Zn, {
			key: 0,
			"article-id": l.value,
			onClose: t[0] ||= (e) => c.value = !1,
			onSaved: b
		}, null, 8, ["article-id"])) : v("", !0), z(S(N(te), T(N(re), {
			"auto-refreshable": !1,
			columns: f,
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
			"cell-cms_source_type": R(({ row: e }) => [S(G, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": R(() => [u("add") ? (O(), _(N(i), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => se()
			}, {
				icon: R(() => [S(N(h), {
					name: "plus",
					size: 14
				})]),
				default: R(() => [t[2] ||= x("新增公告", -1)]),
				_: 1
			})) : v("", !0)]),
			"cell-publish_status": R(({ row: e }) => [S(N(ie), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: R(() => [x(M(N(r).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": R(({ row: e }) => [S(N(ie), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: R(() => [x(M(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": R(({ row: e }) => [x(M(N(n)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": R(({ row: e }) => [S(N(i), {
				size: "sm",
				"icon-only": "",
				title: u("edit") ? "编辑公告" : "公告详情",
				"aria-label": u("edit") ? "编辑公告" : "公告详情",
				onClick: (t) => se(e.id)
			}, {
				default: R(() => [S(N(h), {
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
}), [["__scopeId", "data-v-9f055b06"]]);
//#endregion
//#region src/cms/api/content/translations.ts
function er() {
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
var tr = (e, t) => t > 0 ? Math.min(100, Math.round(e / t * 100)) : 0, nr = (e, t) => `${e}:${t}`;
function rr(e, t) {
	return e ? e.fields.flatMap((e) => e.translations.flatMap((n) => {
		let r = t[nr(e.key, n.locale)] ?? n.text;
		return r === n.text ? [] : [{
			field_name: e.key,
			locale: n.locale,
			text: r,
			source_hash: e.source_hash,
			row_version: n.row_version
		}];
	})) : [];
}
function ir(e) {
	return Object.fromEntries(e.fields.flatMap((e) => e.translations.map((t) => [nr(e.key, t.locale), t.text])));
}
function ar(e) {
	return e?.translations.filter((e) => e.status === "ready").length ?? 0;
}
var or = (e) => !!e && ["queued", "running"].includes(e.status), sr = {
	queued: "等待处理",
	running: "翻译中",
	succeeded: "翻译完成",
	partial_failed: "部分未完成",
	failed: "翻译未完成",
	cancelled: "已取消"
}, cr = {
	draft: "草稿",
	scheduled: "定时发布",
	published: "已发布"
};
function lr(e) {
	if (e && typeof e == "object") {
		let t = e;
		return Object.values(t.errors || {}).flat()[0] || t.msg || t.message || "操作失败，请稍后重试";
	}
	return "操作失败，请稍后重试";
}
//#endregion
//#region src/cms/views/content/localization/translations/index.vue?vue&type=script&setup=true&lang.ts
var ur = ["aria-busy"], dr = { class: "translation-toolbar surface" }, fr = { class: "translation-title" }, pr = { class: "translation-title__icon" }, mr = { class: "translation-progress" }, hr = { class: "translation-toolbar__actions" }, gr = { class: "source-language" }, _r = {
	key: 3,
	class: "translation-job surface",
	role: "status"
}, vr = { key: 0 }, yr = { key: 1 }, br = ["title"], xr = {
	class: "language-overview surface",
	"aria-label": "目标语言完成度"
}, Sr = [
	"disabled",
	"title",
	"onClick"
], Cr = {
	class: "module-bar surface",
	"aria-label": "翻译内容模块"
}, wr = { class: "module-count" }, Tr = { class: "translation-workspace surface" }, Er = { class: "content-browser" }, Dr = { class: "content-browser__header" }, Or = ["aria-busy"], kr = {
	key: 0,
	class: "region-status",
	role: "status"
}, Ar = [
	"aria-current",
	"disabled",
	"onClick"
], jr = { class: "content-item__text" }, Mr = ["title"], Nr = {
	key: 0,
	class: "region-status"
}, Pr = { class: "content-browser__footer" }, Fr = ["aria-busy"], Ir = {
	key: 0,
	class: "editor-state",
	role: "status"
}, Lr = { class: "translation-editor__header" }, Rr = { class: "translation-editor__title" }, zr = { key: 0 }, Br = ["title"], Vr = { class: "source-field" }, Hr = { class: "section-heading" }, Ur = [
	"value",
	"rows",
	"aria-label"
], Wr = { class: "section-heading target-heading" }, Gr = {
	key: 0,
	class: "empty-source"
}, Kr = {
	key: 1,
	class: "empty-source"
}, qr = ["data-locale"], Jr = { class: "target-field__heading" }, Yr = ["for"], Xr = {
	key: 0,
	class: "status-stale"
}, Zr = {
	key: 1,
	class: "status-ready"
}, Qr = [
	"id",
	"onUpdate:modelValue",
	"rows",
	"maxlength",
	"disabled",
	"dir",
	"placeholder"
], $r = { class: "target-field__count" }, ei = {
	key: 2,
	class: "editor-state"
}, ti = {
	key: 1,
	class: "region-status"
}, ni = { class: "config-service" }, ri = { key: 0 }, ii = { key: 1 }, ai = { key: 2 }, oi = { class: "config-grid" }, si = { class: "job-confirm" }, ci = /*#__PURE__*/ m(/* @__PURE__ */ C({
	__name: "index",
	setup(t) {
		let { cancelTranslationJob: c, createTranslationJob: ee, getTranslationDetail: te, getTranslationJob: ne, getTranslationList: oe, getTranslationMetadata: m, getTranslationSettings: C, saveTranslations: w, saveTranslationSettings: T, testTranslationConnection: ue } = er(), { hasPermission: de } = pe(), A = k(), j = k(""), P = k("news:content"), I = k([]), V = k(), H = k(""), U = k("title"), he = k(""), W = k(""), G = k(1), K = k(0), q = k({}), ge = k(!1), J = k(!1), Y = k(!1), X = k(!1), Z = k(""), _e = k(""), ve = k(), Q = k(null), ye = k(!1), be = k(""), xe = k(!1), $ = k(), Se = k(""), Ce = k(!1), we = k(!1), Te = k(!1), Ee = k("field"), De = k([]), Oe = k(""), ke = k(!1), Ae = k(!1);
		L(ye, (e) => {
			e || (be.value = "");
		});
		let je, Me, Ne, Pe, Fe, Ie = new AbortController(), Le, Re = "", ze = g(() => de(["cms_translation:edit"])), Be = g(() => de(["cms_translation:config"])), Ve = g(() => de(["cms_translation:translate"])), He = g(() => X.value || Ce.value || ke.value), Ue = g(() => rr(V.value, q.value).length > 0), We = g(() => tr(A.value?.done || 0, A.value?.total || 0)), Ge = g(() => ({
			space_id: j.value,
			module: P.value.split(":")[0],
			kind: P.value.endsWith(":category") ? "category" : "content"
		})), Ke = g(() => A.value?.spaces.map((e) => ({
			label: e.label + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		})) || []), qe = g(() => A.value?.locales.filter((e) => e.code !== A.value?.source_locale) || []), Je = g(() => qe.value.map((e) => ({
			label: `${e.flag} ${e.label}`,
			value: e.code
		}))), Ye = g(() => Je.value.filter((e) => nt(String(e.value)))), Xe = g(() => A.value?.locales.find((e) => e.code === A.value?.source_locale)?.label || A.value?.source_locale || "简体中文"), Ze = g(() => V.value?.fields.find((e) => e.key === U.value)), Qe = g(() => {
			let e = A.value?.modules.find((e) => e.key === P.value);
			return e?.kind === "category" ? `${A.value?.modules.find((t) => t.module === e.module && t.kind === "content")?.label || ""}分类` : e?.label || "新闻";
		}), $e = g(() => {
			let e = [];
			for (let t of A.value?.modules || []) {
				let n = e.find((e) => e[0].module === t.module);
				n ? n.push(t) : e.push([t]);
			}
			return e;
		}), et = g(() => !!j.value && A.value?.space_enabled && !!A.value.target_locales.length && !or(Q.value) && !He.value && !Ue.value && !ge.value && !J.value), tt = g(() => Q.value ? tr([
			"succeeded",
			"skipped",
			"cancelled"
		].reduce((e, t) => e + (Q.value?.counts[t] || 0), 0) + (or(Q.value) ? 0 : Q.value.counts.failed || 0), Q.value.total) : 0), nt = (e) => A.value?.target_locales.includes(e) ?? !1, rt = (e) => A.value?.locales.find((t) => t.code === e), it = (e) => ({
			news: "file-text",
			academy: "landmark",
			help: "info",
			announcement: "megaphone"
		})[e] || "info";
		function at(e) {
			He.value || (Ue.value ? (je = e, Ae.value = !0) : e());
		}
		function ot() {
			let e = je;
			je = void 0, Ae.value = !1, q.value = V.value ? ir(V.value) : {}, e?.();
		}
		function st() {
			Ae.value = !1, je = void 0, Fe?.(!1), Fe = void 0;
		}
		function ct(e) {
			e !== j.value && at(() => {
				j.value = e, he.value = "", W.value = "", G.value = 1, Q.value = null, pt();
			});
		}
		function lt(e) {
			e.available && P.value !== e.key && at(() => {
				P.value = e.key, he.value = "", W.value = "", G.value = 1, ht();
			});
		}
		function ut(e) {
			at(() => {
				G.value = e, ht();
			});
		}
		function dt() {
			at(() => {
				W.value = he.value.trim(), G.value = 1, ht();
			});
		}
		function ft(e) {
			e !== H.value && at(() => {
				gt(e);
			});
		}
		async function pt() {
			Pe?.abort();
			let e = Pe = new AbortController();
			ge.value = !0, Z.value = "";
			try {
				let t = await m(j.value || void 0, e.signal);
				if (e.signal.aborted) return;
				A.value = t, j.value = t.space_id || "", await ht(), Tt();
			} catch (t) {
				e.signal.aborted || (Z.value = lr(t));
			} finally {
				e.signal.aborted || (ge.value = !1);
			}
		}
		async function mt() {
			let e = j.value;
			if (e) try {
				let t = await m(e, Ie.signal);
				e === j.value && (A.value = t);
			} catch {}
		}
		async function ht() {
			Me?.abort(), Ne?.abort();
			let e = Me = new AbortController();
			if (J.value = !0, Y.value = !1, V.value = void 0, H.value = "", q.value = {}, Z.value = "", !j.value) {
				I.value = [], K.value = 0, J.value = !1;
				return;
			}
			let t = { ...Ge.value };
			try {
				let n = await oe(t, W.value, G.value, e.signal);
				if (e.signal.aborted) return;
				I.value = n.lists, K.value = n.count, I.value[0] && await gt(I.value[0].id);
			} catch (t) {
				e.signal.aborted || (I.value = [], K.value = 0, Z.value = lr(t));
			} finally {
				e.signal.aborted || (J.value = !1);
			}
		}
		async function gt(e) {
			Ne?.abort();
			let t = Ne = new AbortController();
			Y.value = !0, H.value = e, V.value = void 0, q.value = {}, Z.value = "";
			try {
				let n = await te({ ...Ge.value }, e, t.signal);
				if (t.signal.aborted) return;
				V.value = n, q.value = ir(n), n.fields.some((e) => e.key === U.value) || (U.value = n.fields[0]?.key || ""), ve.value?.scrollTo({ top: 0 });
			} catch (e) {
				t.signal.aborted || (Z.value = lr(e));
			} finally {
				t.signal.aborted || (Y.value = !1);
			}
		}
		async function _t() {
			if (!V.value || !ze.value || He.value) return;
			let e = rr(V.value, q.value);
			if (e.length) {
				if (e.some((e) => !e.text.trim())) {
					Z.value = "译文不能为空；未翻译的语言请保持未填写。";
					return;
				}
				X.value = !0, Z.value = "";
				try {
					let t = await w({ ...Ge.value }, V.value.id, e);
					V.value = t, q.value = ir(t);
					let n = I.value.findIndex((e) => e.id === t.id);
					n >= 0 && (I.value[n] = t), ae.success("翻译已保存"), mt();
				} catch (e) {
					Z.value = lr(e);
				} finally {
					X.value = !1;
				}
			}
		}
		async function vt(e) {
			_e.value = e, await E();
			let t = ve.value?.querySelector(`[data-locale="${e}"]`);
			t?.scrollIntoView({
				block: "nearest",
				behavior: "smooth"
			}), t?.querySelector("textarea")?.focus();
		}
		async function yt() {
			if (!(!Be.value || !j.value)) {
				ye.value = !0, xe.value = !0, Se.value = "", $.value = void 0, be.value = "";
				try {
					$.value = await C(j.value, Ie.signal);
				} catch (e) {
					Se.value = lr(e);
				} finally {
					xe.value = !1;
				}
			}
		}
		async function bt() {
			if (!(!$.value || Ce.value)) {
				if (Ue.value) {
					Se.value = "请先保存或放弃当前译文修改，再修改配置。";
					return;
				}
				Ce.value = !0, Se.value = "";
				try {
					await T($.value, be.value.trim()), be.value = "", ye.value = !1, ae.success("翻译配置已保存"), await pt();
				} catch (e) {
					Se.value = lr(e);
				} finally {
					Ce.value = !1;
				}
			}
		}
		async function xt() {
			if (!(!$.value || we.value || Ce.value)) {
				we.value = !0, Se.value = "";
				try {
					await ue($.value.space_id, $.value.space_revision, be.value.trim()), ae.success("Google Translate 连接成功");
				} catch (e) {
					Se.value = lr(e);
				} finally {
					we.value = !1;
				}
			}
		}
		function St(e) {
			Ee.value = e, De.value = [...A.value?.target_locales || []], Oe.value = "", Re = crypto.randomUUID(), Te.value = !0;
		}
		async function Ct() {
			if (!(!De.value.length || ke.value)) {
				ke.value = !0, Oe.value = "";
				try {
					let e = await ee({ ...Ge.value }, {
						request_key: Re,
						target_locales: De.value,
						...Ee.value === "field" ? {
							id: H.value,
							field_name: U.value
						} : { keyword: W.value }
					});
					Q.value = e.job, Te.value = !1, ae.success("翻译任务已提交"), wt();
				} catch (e) {
					Oe.value = lr(e);
				} finally {
					ke.value = !1;
				}
			}
		}
		function wt() {
			clearTimeout(Le), or(Q.value) && (Le = setTimeout(() => {
				Tt();
			}, 3e3));
		}
		async function Tt() {
			let e = j.value;
			if (!e || Ie.signal.aborted) return;
			let t = or(Q.value);
			try {
				let n = await ne(e, Ie.signal);
				if (e !== j.value) return;
				Q.value = n.job, t && !or(Q.value) && (await mt(), !Ue.value && !He.value && H.value && await gt(H.value));
			} catch {}
			wt();
		}
		async function Et() {
			if (Q.value) try {
				let e = await c(j.value, Q.value.id);
				Q.value = e.job, clearTimeout(Le), mt();
			} catch (e) {
				Z.value = lr(e);
			}
		}
		function Dt(e) {
			(Ue.value || He.value) && (e.preventDefault(), e.returnValue = "");
		}
		return me(() => !Ue.value && !He.value || !He.value && new Promise((e) => {
			Fe?.(!1), Fe = e, je = () => {
				Fe = void 0, e(!0);
			}, Ae.value = !0;
		})), le(() => {
			window.addEventListener("beforeunload", Dt), pt();
		}), ce(() => {
			be.value = "", Fe?.(!1), Ie.abort(), Me?.abort(), Ne?.abort(), Pe?.abort(), clearTimeout(Le), window.removeEventListener("beforeunload", Dt);
		}), (t, c) => (O(), y("section", {
			class: "translations-page",
			"aria-label": "多语言翻译管理",
			"aria-busy": ge.value
		}, [
			b("header", dr, [b("div", fr, [b("span", pr, [S(N(h), {
				name: "globe",
				size: 21
			})]), b("div", null, [c[21] ||= b("h1", null, "语言翻译管理", -1), b("div", mr, [
				b("strong", null, M(We.value) + "%", 1),
				S(N(u), {
					percentage: We.value,
					"show-text": !1,
					"stroke-width": 4,
					"aria-label": "全部翻译完成度"
				}, null, 8, ["percentage"]),
				b("span", null, M(A.value?.done.toLocaleString() || 0) + " / " + M(A.value?.total.toLocaleString() || 0) + " 个目标字段", 1)
			])])]), b("div", hr, [
				S(N(re), {
					"model-value": j.value,
					options: Ke.value,
					size: "sm",
					disabled: ge.value || He.value,
					placeholder: "内容空间",
					"aria-label": "内容空间",
					"onUpdate:modelValue": c[0] ||= (e) => ct(String(e))
				}, null, 8, [
					"model-value",
					"options",
					"disabled"
				]),
				b("span", gr, [c[22] ||= x("内容源语言 ", -1), b("b", null, M(Xe.value), 1)]),
				Be.value ? (O(), _(N(i), {
					key: 0,
					size: "sm",
					disabled: !j.value || He.value,
					onClick: yt
				}, {
					icon: R(() => [S(N(h), {
						name: "sliders-horizontal",
						size: 14
					})]),
					default: R(() => [c[23] ||= x("翻译配置", -1)]),
					_: 1
				}, 8, ["disabled"])) : v("", !0),
				Ve.value ? (O(), _(N(i), {
					key: 1,
					size: "sm",
					disabled: !et.value,
					onClick: c[1] ||= (e) => St("batch")
				}, {
					icon: R(() => [S(N(h), {
						name: "rocket",
						size: 14
					})]),
					default: R(() => [c[24] ||= x("批量翻译", -1)]),
					_: 1
				}, 8, ["disabled"])) : v("", !0),
				Ve.value ? (O(), _(N(i), {
					key: 2,
					size: "sm",
					disabled: !et.value || !V.value || !Ze.value?.translatable,
					onClick: c[2] ||= (e) => St("field")
				}, {
					icon: R(() => [S(N(h), {
						name: "globe",
						size: 14
					})]),
					default: R(() => [c[25] ||= x("翻译当前字段", -1)]),
					_: 1
				}, 8, ["disabled"])) : v("", !0),
				ze.value ? (O(), _(N(i), {
					key: 3,
					size: "sm",
					variant: "primary",
					loading: X.value,
					disabled: !Ue.value || He.value || !A.value?.space_enabled,
					onClick: _t
				}, {
					icon: R(() => [S(N(h), {
						name: "save",
						size: 14
					})]),
					default: R(() => [c[26] ||= x("保存翻译", -1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : v("", !0)
			])]),
			Z.value ? (O(), _(N(f), {
				key: 0,
				type: "error",
				closable: !0,
				onClose: c[3] ||= (e) => Z.value = ""
			}, {
				default: R(() => [x(M(Z.value), 1)]),
				_: 1
			})) : v("", !0),
			A.value && !A.value.space_enabled && j.value ? (O(), _(N(f), {
				key: 1,
				type: "warning"
			}, {
				default: R(() => [...c[27] ||= [x("当前内容空间已停用，仅可查看翻译。", -1)]]),
				_: 1
			})) : v("", !0),
			A.value && !A.value.target_locales.length && j.value ? (O(), _(N(f), {
				key: 2,
				type: "info"
			}, {
				default: R(() => [...c[28] ||= [x("尚未启用目标语言，请在“翻译配置”中选择语言后开始翻译。", -1)]]),
				_: 1
			})) : v("", !0),
			Q.value ? (O(), y("div", _r, [
				S(N(h), {
					name: N(or)(Q.value) ? "loader-circle" : "info",
					size: 15
				}, null, 8, ["name"]),
				b("strong", null, M(N(sr)[Q.value.status] || Q.value.status), 1),
				b("span", null, "任务 #" + M(Q.value.id), 1),
				S(N(u), {
					percentage: tt.value,
					"show-text": !1,
					"stroke-width": 4
				}, null, 8, ["percentage"]),
				b("span", null, [
					x(M(Q.value.counts.succeeded || 0) + " / " + M(Q.value.total) + " 已完成", 1),
					Q.value.counts.failed ? (O(), y("span", vr, " · " + M(Q.value.counts.failed) + " 失败", 1)) : v("", !0),
					Q.value.counts.skipped ? (O(), y("span", yr, " · " + M(Q.value.counts.skipped) + " 冲突跳过", 1)) : v("", !0)
				]),
				N(or)(Q.value) && Ve.value ? (O(), _(N(i), {
					key: 0,
					size: "sm",
					variant: "text",
					disabled: He.value,
					onClick: Et
				}, {
					default: R(() => [...c[29] ||= [x("取消任务", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (O(), _(N(i), {
					key: 1,
					size: "sm",
					variant: "text",
					onClick: c[4] ||= (e) => Q.value = null
				}, {
					default: R(() => [...c[30] ||= [x("收起", -1)]]),
					_: 1
				})),
				Q.value.errors.length ? (O(), y("span", {
					key: 2,
					class: "translation-job__error",
					title: Q.value.errors.map((e) => `${e.target_locale}: ${e.error_code}`).join("；")
				}, M(Q.value.errors[0].error_code) + "（可重新提交补翻）", 9, br)) : v("", !0)
			])) : v("", !0),
			b("div", xr, [(O(!0), y(se, null, fe(qe.value, (e) => (O(), y("button", {
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
				b("span", null, M(e.flag), 1),
				b("span", null, M(e.label), 1),
				b("strong", null, M(nt(e.code) ? N(tr)(e.done, e.total) + "%" : "未启用"), 1),
				S(N(u), {
					percentage: N(tr)(e.done, e.total),
					"show-text": !1,
					"stroke-width": 2
				}, null, 8, ["percentage"])
			], 10, Sr))), 128))]),
			b("nav", Cr, [(O(!0), y(se, null, fe($e.value, (e) => (O(), y("div", {
				key: e[0].module,
				class: "module-group"
			}, [(O(!0), y(se, null, fe(e, (e) => (O(), _(N(i), {
				key: e.key,
				variant: P.value === e.key ? "primary" : "text",
				plain: P.value === e.key,
				size: "sm",
				disabled: !e.available || He.value,
				title: e.reason,
				"aria-pressed": P.value === e.key,
				onClick: (t) => lt(e)
			}, {
				default: R(() => [
					e.kind === "category" ? v("", !0) : (O(), _(N(h), {
						key: 0,
						name: it(e.module),
						size: 14
					}, null, 8, ["name"])),
					x(M(e.label), 1),
					b("span", wr, M(e.count), 1)
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
			b("main", Tr, [b("aside", Er, [
				b("div", Dr, [b("div", null, [b("strong", null, M(Qe.value), 1), b("span", null, M(K.value) + " 条" + M(Ge.value.kind === "category" ? "分类" : "内容"), 1)]), S(N(p), {
					modelValue: he.value,
					"onUpdate:modelValue": c[5] ||= (e) => he.value = e,
					size: "sm",
					clearable: "",
					placeholder: "搜索内容",
					"aria-label": "搜索内容",
					onKeydown: B(dt, ["enter"])
				}, {
					prefix: R(() => [S(N(h), {
						name: "search",
						size: 14
					})]),
					_: 1
				}, 8, ["modelValue"])]),
				b("div", {
					class: "content-browser__list",
					"aria-busy": J.value
				}, [J.value ? (O(), y("p", kr, "加载内容中…")) : (O(), y(se, { key: 1 }, [(O(!0), y(se, null, fe(I.value, (e) => (O(), y("button", {
					key: e.id,
					type: "button",
					class: D(["content-item", { "is-selected": H.value === e.id }]),
					"aria-current": H.value === e.id ? "true" : void 0,
					disabled: He.value,
					onClick: (t) => ft(e.id)
				}, [b("span", jr, [b("strong", { title: e.title }, M(e.title), 9, Mr), b("small", null, M(N(cr)[e.publish_status || ""] || "分类") + " · " + M(e.done) + "/" + M(e.total), 1)]), S(N(u), {
					type: "circle",
					percentage: N(tr)(e.done, e.total),
					"show-text": !1,
					size: 16,
					"stroke-width": 2,
					status: e.total && e.done === e.total ? "success" : "warning"
				}, null, 8, ["percentage", "status"])], 10, Ar))), 128)), I.value.length ? v("", !0) : (O(), y("p", Nr, M(W.value ? "没有匹配的内容" : "暂无可翻译内容"), 1))], 64))], 8, Or),
				b("footer", Pr, [
					S(N(i), {
						size: "sm",
						"icon-only": "",
						"aria-label": "上一页",
						disabled: G.value <= 1 || J.value || He.value,
						onClick: c[6] ||= (e) => ut(G.value - 1)
					}, {
						default: R(() => [S(N(h), {
							name: "chevron-left",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"]),
					b("span", null, M(G.value) + " / " + M(Math.max(1, Math.ceil(K.value / 30))), 1),
					S(N(i), {
						size: "sm",
						"icon-only": "",
						"aria-label": "下一页",
						disabled: G.value * 30 >= K.value || J.value || He.value,
						onClick: c[7] ||= (e) => ut(G.value + 1)
					}, {
						default: R(() => [S(N(h), {
							name: "chevron-right",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"])
				])
			]), b("section", {
				class: "translation-editor",
				"aria-busy": Y.value
			}, [Y.value ? (O(), y("div", Ir, [S(N(h), {
				name: "loader-circle",
				size: 28
			}), c[31] ||= b("p", null, "加载译文中…", -1)])) : V.value ? (O(), y(se, { key: 1 }, [b("header", Lr, [b("div", Rr, [b("span", null, [x(M(Qe.value) + " ", 1), Ue.value ? (O(), y("em", zr, "有未保存修改")) : v("", !0)]), b("h2", { title: V.value.title }, M(V.value.title), 9, Br)]), S(N(l), {
				modelValue: U.value,
				"onUpdate:modelValue": c[8] ||= (e) => U.value = e
			}, {
				default: R(() => [(O(!0), y(se, null, fe(V.value.fields, (e) => (O(), _(N(d), {
					key: e.key,
					name: e.key,
					label: `${e.label} ${e.translatable ? N(ar)(e) + "/" + e.translations.length : "—"}`
				}, null, 8, ["name", "label"]))), 128))]),
				_: 1
			}, 8, ["modelValue"])]), Ze.value ? (O(), y("div", {
				key: 0,
				class: "translation-editor__body",
				ref_key: "editorBody",
				ref: ve
			}, [
				b("section", Vr, [b("div", Hr, [b("strong", null, [x(M(Xe.value) + " ", 1), S(N(ie), {
					size: "sm",
					type: "primary",
					effect: "soft"
				}, {
					default: R(() => [...c[32] ||= [x("内容源语言", -1)]]),
					_: 1
				})]), c[33] ||= b("span", null, "只读原文", -1)]), b("textarea", {
					value: Ze.value.source,
					readonly: "",
					rows: Ze.value.key === "body_html" ? 5 : 2,
					class: "translation-textarea source-textarea",
					"aria-label": `原文${Ze.value.label}`
				}, null, 8, Ur)]),
				b("div", Wr, [c[34] ||= b("strong", null, "目标语言", -1), b("span", null, M(V.value.fields.find((e) => e.key === U.value)?.translations.length || 0) + " 种语言 · 手工修改后请保存", 1)]),
				Ze.value.translatable ? Ze.value.translations.length ? (O(), y("div", {
					key: 2,
					class: D(["target-grid", { "is-body": U.value === "body_html" }])
				}, [(O(!0), y(se, null, fe(Ze.value.translations, (e) => (O(), y("div", {
					key: e.locale,
					class: D(["target-field", { "is-focused": _e.value === e.locale }]),
					"data-locale": e.locale
				}, [
					b("div", Jr, [b("label", { for: `translation-${U.value}-${e.locale}` }, [x(M(rt(e.locale)?.native || e.locale) + " ", 1), b("small", null, M(e.locale), 1)], 8, Yr), e.status === "stale" ? (O(), y("span", Xr, "原文已更新")) : e.status === "ready" ? (O(), y("span", Zr, M(e.method === "machine" ? "机器翻译" : "已保存"), 1)) : v("", !0)]),
					z(b("textarea", {
						id: `translation-${U.value}-${e.locale}`,
						"onUpdate:modelValue": (t) => q.value[N(nr)(U.value, e.locale)] = t,
						class: "translation-textarea",
						rows: U.value === "body_html" ? 10 : 2,
						maxlength: Ze.value.max_length,
						disabled: !ze.value || !A.value?.space_enabled || He.value,
						dir: e.locale === "ar" ? "rtl" : "auto",
						placeholder: `请输入${rt(e.locale)?.native || e.locale}翻译${U.value === "body_html" ? "（HTML）" : ""}`
					}, null, 8, Qr), [[F, q.value[N(nr)(U.value, e.locale)]]]),
					b("div", $r, M((q.value[N(nr)(U.value, e.locale)] || "").length.toLocaleString()) + " / " + M(Ze.value.max_length.toLocaleString()), 1)
				], 10, qr))), 128))], 2)) : (O(), y("div", Kr, " 请先在“翻译配置”中启用目标语言。 ")) : (O(), y("div", Gr, [S(N(h), {
					name: "info",
					size: 18
				}), c[35] ||= x("原文字段为空，不参与翻译和完成度统计。 ", -1)]))
			], 512)) : v("", !0)], 64)) : (O(), y("div", ei, [S(N(s), { description: Z.value ? "内容加载失败，可点击刷新重试" : "选择左侧内容开始翻译" }, null, 8, ["description"]), Z.value ? (O(), _(N(i), {
				key: 0,
				size: "sm",
				onClick: pt
			}, {
				default: R(() => [...c[36] ||= [x("重新加载", -1)]]),
				_: 1
			})) : v("", !0)]))], 8, Fr)]),
			S(N(r), {
				modelValue: ye.value,
				"onUpdate:modelValue": c[16] ||= (e) => ye.value = e,
				title: "翻译配置",
				subtitle: "当前内容空间共用 · Google Cloud Translation Basic v2",
				width: "560px",
				"close-on-click-modal": !1,
				"before-close": () => !Ce.value
			}, {
				footer: R(() => [
					S(N(i), {
						size: "sm",
						loading: we.value,
						disabled: !$.value?.credential_configured && !be.value.trim() || Ce.value || xe.value,
						onClick: xt
					}, {
						default: R(() => [...c[40] ||= [x("测试连接", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"]),
					c[43] ||= b("span", { class: "footer-spacer" }, null, -1),
					S(N(i), {
						size: "sm",
						disabled: Ce.value,
						onClick: c[15] ||= (e) => ye.value = !1
					}, {
						default: R(() => [...c[41] ||= [x("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					S(N(i), {
						size: "sm",
						variant: "primary",
						loading: Ce.value,
						disabled: !$.value || xe.value || we.value,
						onClick: bt
					}, {
						default: R(() => [...c[42] ||= [x("保存配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])
				]),
				default: R(() => [Se.value ? (O(), _(N(f), {
					key: 0,
					type: "error"
				}, {
					default: R(() => [x(M(Se.value), 1)]),
					_: 1
				})) : v("", !0), xe.value ? (O(), y("div", ti, "加载配置中…")) : $.value ? (O(), _(N(a), {
					key: 2,
					model: $.value,
					class: "translation-config",
					"label-position": "top"
				}, {
					default: R(() => [
						S(N(o), { label: "目标语言" }, {
							default: R(() => [S(N(re), {
								modelValue: $.value.target_locales,
								"onUpdate:modelValue": c[9] ||= (e) => $.value.target_locales = e,
								options: Je.value,
								multiple: "",
								filterable: "",
								"max-tag-count": 4,
								placeholder: "选择需要维护的目标语言",
								disabled: Ce.value
							}, null, 8, [
								"modelValue",
								"options",
								"disabled"
							])]),
							_: 1
						}),
						S(N(o), { label: "Google Translate" }, {
							default: R(() => [b("div", ni, [c[38] ||= b("strong", null, "Google Cloud Translation · Basic v2", -1), S(N(e), {
								modelValue: $.value.is_enabled,
								"onUpdate:modelValue": c[10] ||= (e) => $.value.is_enabled = e,
								disabled: Ce.value || we.value || !$.value.credential_configured && !be.value.trim()
							}, {
								default: R(() => [...c[37] ||= [x("开启自动翻译", -1)]]),
								_: 1
							}, 8, ["modelValue", "disabled"])])]),
							_: 1
						}),
						S(N(o), { label: "Google API Key" }, {
							default: R(() => [
								S(N(p), {
									modelValue: be.value,
									"onUpdate:modelValue": c[11] ||= (e) => be.value = e,
									type: "password",
									autocomplete: "new-password",
									disabled: Ce.value || we.value,
									placeholder: $.value.credential_configured ? "已配置，留空保留原密钥；输入新密钥替换" : "请输入 Google Cloud Translation API Key"
								}, null, 8, [
									"modelValue",
									"disabled",
									"placeholder"
								]),
								$.value.api_key_mask ? (O(), y("small", ri, M($.value.credential_source === "database" ? "数据库密钥" : "环境配置密钥") + "：" + M($.value.api_key_mask), 1)) : v("", !0),
								$.value.credential_error === "GOOGLE_CREDENTIAL_DECRYPT_FAILED" ? (O(), y("small", ii, "数据库密钥无法解密，请检查两套后台的专用加密配置，或输入新密钥替换。")) : (O(), y("small", ai, "密钥加密保存，不回显原文；留空保留原值。未配置密钥时仍可人工翻译。"))
							]),
							_: 1
						}),
						b("div", oi, [
							S(N(o), { label: "并发上限" }, {
								default: R(() => [S(N(n), {
									modelValue: $.value.concurrency_limit,
									"onUpdate:modelValue": c[12] ||= (e) => $.value.concurrency_limit = e,
									min: 1,
									max: 20,
									disabled: Ce.value
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}),
							S(N(o), { label: "请求超时（秒）" }, {
								default: R(() => [S(N(n), {
									modelValue: $.value.request_timeout_seconds,
									"onUpdate:modelValue": c[13] ||= (e) => $.value.request_timeout_seconds = e,
									min: 1,
									max: 120,
									disabled: Ce.value
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}),
							S(N(o), { label: "最大尝试次数" }, {
								default: R(() => [S(N(n), {
									modelValue: $.value.max_attempts,
									"onUpdate:modelValue": c[14] ||= (e) => $.value.max_attempts = e,
									min: 1,
									max: 10,
									disabled: Ce.value
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})
						]),
						$.value.supported ? v("", !0) : (O(), _(N(f), {
							key: 0,
							type: "warning"
						}, {
							default: R(() => [...c[39] ||= [x("当前空间关联了其他版本的翻译配置。保存将为该空间创建独立的 Google v2 配置，不修改其他空间。", -1)]]),
							_: 1
						}))
					]),
					_: 1
				}, 8, ["model"])) : v("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			S(N(r), {
				modelValue: Te.value,
				"onUpdate:modelValue": c[19] ||= (e) => Te.value = e,
				title: Ee.value === "field" ? "翻译当前字段" : "批量翻译",
				subtitle: "Google Translate · 仅补齐缺失及原文已更新的译文",
				width: "520px",
				"close-on-click-modal": !1,
				"before-close": () => !ke.value
			}, {
				footer: R(() => [S(N(i), {
					size: "sm",
					disabled: ke.value,
					onClick: c[18] ||= (e) => Te.value = !1
				}, {
					default: R(() => [...c[45] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(i), {
					variant: "primary",
					size: "sm",
					loading: ke.value,
					disabled: !De.value.length,
					onClick: Ct
				}, {
					default: R(() => [...c[46] ||= [x("确认翻译", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])]),
				default: R(() => [b("div", si, [
					b("p", null, M(Ee.value === "field" ? `当前内容的「${Ze.value?.label}」` : `当前空间「${Qe.value}」${W.value ? "中匹配搜索条件的内容" : "全部内容"}`), 1),
					S(N(o), { label: "目标语言" }, {
						default: R(() => [S(N(re), {
							modelValue: De.value,
							"onUpdate:modelValue": c[17] ||= (e) => De.value = e,
							options: Ye.value,
							multiple: "",
							filterable: "",
							"max-tag-count": 5,
							disabled: ke.value
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}),
					S(N(f), { type: "warning" }, {
						default: R(() => [...c[44] ||= [x("内容将发送至 Google Translate，并可能产生翻译费用。已有有效译文不会覆盖；单次最多 200 条内容、5,000 个字段任务。后台任务需要已启动翻译 worker。", -1)]]),
						_: 1
					}),
					Oe.value ? (O(), _(N(f), {
						key: 0,
						type: "error"
					}, {
						default: R(() => [x(M(Oe.value), 1)]),
						_: 1
					})) : v("", !0)
				])]),
				_: 1
			}, 8, [
				"modelValue",
				"title",
				"before-close"
			]),
			S(N(r), {
				modelValue: Ae.value,
				"onUpdate:modelValue": c[20] ||= (e) => Ae.value = e,
				title: "有未保存的翻译",
				subtitle: "切换后将丢弃当前修改，是否继续？",
				width: "380px",
				onClose: st
			}, {
				footer: R(() => [S(N(i), {
					size: "sm",
					onClick: st
				}, {
					default: R(() => [...c[47] ||= [x("继续编辑", -1)]]),
					_: 1
				}), S(N(i), {
					size: "sm",
					variant: "warning",
					onClick: ot
				}, {
					default: R(() => [...c[48] ||= [x("放弃修改并继续", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, ur));
	}
}), [["__scopeId", "data-v-7e34bf16"]]), li = {
	key: 0,
	class: "mm-cms-site"
}, ui = ["disabled"], di = ["value"], fi = {
	key: 1,
	role: "alert"
}, pi = {
	key: 2,
	role: "status"
}, mi = { key: 3 }, hi = ["disabled"], gi = /*#__PURE__*/ m(/* @__PURE__ */ C({
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
			"news/list": nt,
			"academy/categories": ut,
			"academy/courses": Pt,
			"help/categories": Xt,
			"help/articles": _n,
			"feedback/list": Dn,
			"announcement/categories": Fn,
			"announcement/list": $n,
			"localization/translations": ci
		}, r = t.runtime.mode === "white_label" && !!t.runtime.resolveSiteInRequest, i = k(!1), a = k(0), o = k([]), s = k(""), c = k(""), l = k(t.runtime.mode === "white_label" && !r), u = k(!1), ee = g(() => o.value.find((e) => e.site_id === s.value)), te = g(() => n[t.page]), d = g(() => t.runtime.hasPermission([
			"cms_news:add",
			"cms_academy:add",
			"cms_help:add",
			"cms_announcement:add"
		])), ne = new AbortController(), f = !0, re = !1;
		function ie(e) {
			re = !0;
			try {
				o.value = e.sites, s.value = e.site_id ?? "", i.value = !0;
			} finally {
				re = !1;
			}
		}
		let ae = U(t.runtime, ie);
		L(s, () => {
			!r || re || (ae.invalidate(), ae = U(t.runtime, ie, ee.value?.space_id ?? null), a.value++);
		}, { flush: "sync" });
		function oe(e, n) {
			if (!f || t.runtime.mode === "white_label" && ee.value?.space_id !== n) throw Error("站点已切换，请重新操作");
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
		ue(H, {
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
				signal: ne.signal
			});
			ne.signal.aborted || (o.value = e.sites, o.value.some((e) => e.site_id === s.value) || (s.value = o.value[0]?.site_id ?? ""));
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
				if (!f || r && e !== a.value) return;
				if (r) {
					if (!n.cms_context) throw Error("初始化接口未返回站点信息");
					ae.invalidate(), ae = U(t.runtime, ie, n.cms_context.space_id), ie(n.cms_context), a.value++;
				} else await p();
			} catch (e) {
				c.value = e instanceof Error ? e.message : "初始化失败";
			} finally {
				u.value = !1;
			}
		}
		return le(async () => {
			if (t.runtime.mode === "white_label" && !r) try {
				await p();
			} catch {
				ne.signal.aborted || (c.value = "加载站点失败，请刷新重试");
			} finally {
				l.value = !1;
			}
		}), ce(() => {
			f = !1, ae.invalidate(), ne.abort();
		}), (t, n) => (O(), y("section", { class: D(["mm-cms-page", { "is-viewport": e.viewport }]) }, [e.runtime.mode === "white_label" && e.showSiteSelector && (!N(r) || i.value) ? (O(), y("header", li, [b("label", null, [n[1] ||= x("内容站点 ", -1), z(b("select", {
			"onUpdate:modelValue": n[0] ||= (e) => s.value = e,
			disabled: l.value
		}, [(O(!0), y(se, null, fe(o.value, (e) => (O(), y("option", {
			key: e.site_id,
			value: e.site_id
		}, M(e.label), 9, di))), 128))], 8, ui), [[P, s.value]])]), n[2] ||= b("span", null, "各站点内容独立管理", -1)])) : v("", !0), c.value ? (O(), y("p", fi, M(c.value), 1)) : l.value ? (O(), y("p", pi, "正在加载站点…")) : e.runtime.mode === "white_label" && (!N(r) || i.value) && !ee.value?.space_id ? (O(), y("div", mi, [b("p", null, M(ee.value ? "该站点尚未初始化内容空间。" : "暂无可管理的内容站点。"), 1), ee.value && d.value ? (O(), y("button", {
			key: 0,
			type: "button",
			disabled: u.value,
			onClick: m
		}, "初始化空内容空间", 8, hi)) : v("", !0)])) : (O(), _(A(te.value), { key: `${e.page}:${e.identityKey}:${N(r) ? a.value : ee.value?.space_id ?? "platform"}` }))], 2));
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
export { gi as MmCmsPage, _i as cmsPermissionItems, vi as cmsPermissionSubmission };

//# sourceMappingURL=cms.js.map