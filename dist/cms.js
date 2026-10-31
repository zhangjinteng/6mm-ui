import { A as e, Ht as t, Jr as n, Mr as r, On as i, Or as a, P as o, X as s, Z as c, _r as l, ai as u, d, ei as f, kn as ee, tr as te, ui as ne, wr as re, xr as ie, xt as ae } from "./src-CpdqL-SF.js";
import { d as oe, n as p, r as m, u as h } from "./Loading-BKO1YKDw.js";
import { Fragment as se, computed as g, createBlock as _, createCommentVNode as v, createElementBlock as y, createElementVNode as b, createTextVNode as x, createVNode as S, defineComponent as C, inject as w, mergeProps as T, nextTick as E, normalizeClass as D, onBeforeUnmount as ce, onMounted as le, openBlock as O, provide as ue, reactive as de, ref as k, renderList as fe, resolveDynamicComponent as A, shallowRef as j, toDisplayString as M, unref as N, vModelSelect as P, vModelText as F, vShow as I, watch as L, withCtx as R, withDirectives as z, withKeys as B, withModifiers as pe } from "vue";
//#region src/cms/runtime.ts
var V = Symbol("MmCms");
function H() {
	let e = w(V);
	if (!e) throw Error("CMS host adapter is missing");
	return e;
}
function me(e) {
	H().registerBeforeLeave?.(e);
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
function ge(e, t) {
	if (H().mode === "white_label") return {
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
var U = /* @__PURE__ */ C({
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
function W() {
	let e = H().request, t = "/cms/news", n = (n, r = {}) => e.get({
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
var G = ["aria-checked", "disabled"], K = /*#__PURE__*/ p(/* @__PURE__ */ C({
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
		}, [b("span")], -1), b("span", null, M(e.modelValue ? "已启用" : "已停用"), 1)], 10, G));
	}
}), [["__scopeId", "data-v-8b527db1"]]), q = { class: "news-categories" }, J = ["aria-busy"], Y = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, X = { class: "taxonomy-editor__field" }, _e = { class: "taxonomy-editor__row" }, ve = "分类", Z = /*#__PURE__*/ p(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let { newsError: n, deleteNews: a, getNewsMetadata: o, getNewsList: s, getNewsDetail: c, saveNews: d } = W(), { hasPermission: te } = H(), { formatDateTime: oe } = H(), p = (e) => te([`cms_news_category:${e}`]), se = k(), C = k(), w = ge(o, (e) => {
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
		], { proTableBindings: D, reload: ue, filters: fe } = ne({
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
		w.bindFilters(fe);
		let A = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), j = de(A()), P = k(!1), F = k(!1), I = k(!1), L = k(!1), z = k(!1), B = k(""), V = k(!1), me = k(""), G = k(!1), Z = g(() => !p(j.id ? "edit" : "add")), ye = g(() => I.value || L.value), Q = "", $;
		async function be(e) {
			$?.abort(), $ = new AbortController();
			let t = $;
			Object.assign(j, A(), { id: e || "" }), me.value = "", z.value = !1, B.value = "", V.value = !1, P.value = !0, F.value = !0, Q = JSON.stringify(j);
			try {
				if (C.value = await o(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await c("categories", e, t.signal);
				if (C.value = await o(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
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
				t.signal.aborted || (V.value = !0, me.value = n(e));
			} finally {
				t.signal.aborted || (F.value = !1);
			}
		}
		function xe() {
			return ye.value ? !1 : !F.value && !V.value && JSON.stringify(j) !== Q ? (G.value = !0, !1) : ($?.abort(), !0);
		}
		function Se() {
			ye.value || ($?.abort(), P.value = !1);
		}
		function Ce() {
			G.value = !1, P.value = !1;
		}
		async function we() {
			if (!(Z.value || ye.value || F.value || V.value)) {
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
					me.value = n(e);
				} finally {
					I.value = !1;
				}
			}
		}
		function Te() {
			!j.id || !p("delete") || ye.value || F.value || V.value || (B.value = "", z.value = !0);
		}
		async function Ee() {
			if (!(!z.value || !j.id || !p("delete") || ye.value || F.value || V.value)) {
				L.value = !0, B.value = "";
				try {
					await a("categories", j.id, j.row_version), z.value = !1, P.value = !1, ae.success("分类已删除"), await Promise.all([ue(), ke()]);
				} catch (e) {
					B.value = n(e);
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
				se.value = await o(Oe.signal);
			} catch {}
		}
		return le(ke), ce(() => {
			$?.abort(), Oe.abort();
		}), (e, n) => (O(), y("div", q, [
			S(N(re), T(N(D), {
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
				"cell-cms_source_type": R(({ row: e }) => [S(U, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [p("add") ? (O(), _(N(u), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: n[0] ||= (e) => be()
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
				"cell-actions": R(({ row: e }) => [S(N(u), {
					size: "sm",
					"icon-only": "",
					title: p("edit") ? `编辑${ve}` : `${ve}详情`,
					"aria-label": `编辑${ve}`,
					onClick: (t) => be(e.id)
				}, {
					default: R(() => [S(N(h), {
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
			S(N(f), {
				modelValue: P.value,
				"onUpdate:modelValue": n[5] ||= (e) => P.value = e,
				title: `${j.id ? "编辑" : "新增"}新闻${ve}`,
				width: "680px",
				subtitle: "新闻分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": xe
			}, {
				footer: R(() => [
					j.id && p("delete") ? (O(), _(N(u), {
						key: 0,
						variant: "danger",
						disabled: F.value || V.value || ye.value,
						onClick: Te
					}, {
						icon: R(() => [S(N(h), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [n[11] ||= x("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : v("", !0),
					S(N(u), {
						disabled: ye.value,
						onClick: Se
					}, {
						default: R(() => [...n[12] ||= [x("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Z.value ? v("", !0) : (O(), _(N(u), {
						key: 1,
						variant: "primary",
						loading: I.value,
						disabled: F.value || V.value || L.value,
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
					F.value ? (O(), y("div", Y, [S(N(h), {
						name: "loader-circle",
						class: "news-spin",
						size: 24
					}), b("span", null, "正在读取" + M(ve) + "...")])) : v("", !0),
					me.value ? (O(), _(N(l), {
						key: 1,
						type: "error",
						closable: !1,
						description: me.value
					}, null, 8, ["description"])) : v("", !0),
					!F.value && !V.value ? (O(), _(N(ee), {
						key: 2,
						model: j,
						"label-position": "top",
						onSubmit: pe(we, ["prevent"])
					}, {
						default: R(() => [
							j.id ? (O(), _(N(i), {
								key: 0,
								label: "分类ID"
							}, {
								default: R(() => [S(N(m), {
									"model-value": j.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : v("", !0),
							S(N(i), {
								label: `${ve}名称`,
								required: ""
							}, {
								default: R(() => [S(N(m), {
									modelValue: j.name,
									"onUpdate:modelValue": n[1] ||= (e) => j.name = e,
									maxlength: 120,
									disabled: Z.value || ye.value,
									"aria-label": `${ve}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							S(N(i), { label: "父分类" }, {
								default: R(() => [b("div", X, [S(N(r), {
									modelValue: j.parent_id,
									"onUpdate:modelValue": n[2] ||= (e) => j.parent_id = e,
									options: De.value,
									disabled: Z.value || ye.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), n[10] ||= b("p", { class: "news-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类新闻。 ", -1)])]),
								_: 1
							}),
							b("div", _e, [S(N(i), {
								label: "前端排序",
								required: ""
							}, {
								default: R(() => [S(N(t), {
									modelValue: j.sort_order,
									"onUpdate:modelValue": n[3] ||= (e) => j.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Z.value || ye.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), S(N(i), { label: "启用状态" }, {
								default: R(() => [S(K, {
									modelValue: j.is_enabled,
									"onUpdate:modelValue": n[4] ||= (e) => j.is_enabled = e,
									disabled: Z.value || ye.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : v("", !0)
				], 8, J)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			S(N(f), {
				modelValue: z.value,
				"onUpdate:modelValue": n[7] ||= (e) => z.value = e,
				title: "删除新闻分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !L.value
			}, {
				footer: R(() => [S(N(u), {
					disabled: L.value,
					onClick: n[6] ||= (e) => z.value = !1
				}, {
					default: R(() => [...n[13] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(u), {
					variant: "danger",
					loading: L.value,
					onClick: Ee
				}, {
					default: R(() => [...n[14] ||= [x("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [b("p", null, "确认删除分类“" + M(j.name) + "”？有关联新闻或子分类的分类无法删除。", 1), B.value ? (O(), _(N(l), {
					key: 0,
					type: "error",
					closable: !1,
					description: B.value
				}, null, 8, ["description"])) : v("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			S(N(f), {
				modelValue: G.value,
				"onUpdate:modelValue": n[9] ||= (e) => G.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [S(N(u), { onClick: n[8] ||= (e) => G.value = !1 }, {
					default: R(() => [...n[15] ||= [x("继续编辑", -1)]]),
					_: 1
				}), S(N(u), {
					variant: "primary",
					onClick: Ce
				}, {
					default: R(() => [...n[16] ||= [x("放弃修改", -1)]]),
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
}, Q = [
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
function be(e, t) {
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
			let i = Q.includes(s) ? s : e === t ? a[o] : void 0;
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
function xe(e, t, n, r) {
	let i = k(), a = k(), o = k(null), s = k(Date.now()), c = de({}), l = k(""), u = Object.fromEntries(Q.map((e) => [e, {
		required: e === "title" || e === "category_id",
		trigger: "submit"
	}])), d = g(() => o.value ? $(e, t(), n, o.value === "draft" ? "draft" : e.scheduled_local ? "scheduled" : "published", s.value) : {}), f = g(() => ({
		...c,
		...d.value
	})), ee = g(() => Object.keys(f.value).length);
	for (let t of Q) L(() => e[t], () => {
		delete c[t], l.value = "", s.value = Date.now();
	}, { deep: !0 });
	function te() {
		f.value.seo_description && a.value?.focus();
	}
	async function ne() {
		await E();
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
	async function re(e) {
		o.value = e === "draft" ? "draft" : "publish", s.value = Date.now(), l.value = "";
		for (let e of Q) delete c[e];
		return ee.value ? (await ne(), !1) : !0;
	}
	function ie(e) {
		let t = be(e, n);
		Object.assign(c, t.fields), l.value = t.general;
	}
	return {
		editorRoot: i,
		seoInput: a,
		fieldRules: u,
		fieldErrors: f,
		pendingCount: ee,
		saveError: l,
		validateSave: re,
		setSaveFailure: ie,
		focusFirstError: ne,
		focusSeoError: te
	};
}
//#endregion
//#region src/cms/views/content/components/CoverFileItem.vue?vue&type=script&setup=true&lang.ts
var Se = {
	class: "file-list",
	"aria-label": "封面文件"
}, Ce = { class: "file-item" }, we = { class: "file-icon" }, Te = ["src"], Ee = [
	"href",
	"download",
	"title",
	"aria-busy",
	"aria-disabled"
], De = { class: "file-size" }, Oe = ["disabled"], ke = {
	key: 0,
	class: "file-error",
	role: "alert"
}, Ae = /*#__PURE__*/ p(/* @__PURE__ */ C({
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
		}), d = g(() => i.value === null ? "大小未知" : i.value < 1024 ? `${i.value} B` : i.value < 1024 * 1024 ? `${(i.value / 1024).toFixed(1)} KB` : `${(i.value / (1024 * 1024)).toFixed(1)} MB`);
		L(() => [n.url, n.file], async (e, t, r) => {
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
		return ce(() => {
			c?.abort(), c = void 0;
		}), (t, n) => (O(), y("div", Se, [b("div", Ce, [
			b("span", we, [a.value ? (O(), _(N(h), {
				key: 1,
				name: "image",
				size: 20
			})) : (O(), y("img", {
				key: 0,
				src: e.url,
				alt: "封面缩略图",
				onError: n[0] ||= (e) => a.value = !0
			}, null, 40, Te))]),
			b("a", {
				class: "file-name",
				href: l.value || void 0,
				download: u.value,
				title: u.value,
				"aria-busy": o.value,
				"aria-disabled": o.value || !l.value,
				onClick: pe(f, ["prevent", "stop"])
			}, M(u.value), 9, Ee),
			b("span", De, M(d.value), 1),
			b("button", {
				class: "file-remove",
				type: "button",
				"aria-label": "移除封面",
				title: "移除封面",
				disabled: e.disabled,
				onClick: n[1] ||= pe((e) => r("remove"), ["stop"])
			}, [S(N(h), {
				name: "close",
				size: 14
			})], 8, Oe)
		]), s.value ? (O(), y("span", ke, M(s.value), 1)) : v("", !0)]));
	}
}), [["__scopeId", "data-v-389015f1"]]), je = { class: "content-cover" }, Me = { class: "content-cover__preview" }, Ne = ["src", "alt"], Pe = {
	key: 1,
	class: "content-cover__empty"
}, Fe = {
	key: 2,
	class: "content-cover__hint"
}, Ie = {
	key: 0,
	class: "content-cover__error",
	role: "status"
}, Le = /*#__PURE__*/ p(/* @__PURE__ */ C({
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
		function f() {
			r("success"), u();
		}
		function ee(e, t) {
			r("error", c ? c.error : t), c = void 0, u();
		}
		function te() {
			n.disabled || o.value || (a.value = void 0, s.value = !1, r("update:modelValue", ""));
		}
		return (t, n) => (O(), y("div", je, [
			S(N(d), {
				ref_key: "uploadRef",
				ref: i,
				class: "content-cover__upload",
				drag: "",
				accept: "image/jpeg,image/png,image/webp",
				limit: 1,
				"max-size": 5242880,
				disabled: e.disabled || o.value,
				request: l,
				onSuccess: f,
				onError: ee,
				onExceed: n[2] ||= (e) => r("error", /* @__PURE__ */ Error("一次只能上传一张封面图片"))
			}, {
				default: R(() => [b("div", Me, [e.modelValue ? (O(), y("img", {
					key: 0,
					src: e.modelValue,
					alt: e.label,
					draggable: "false",
					onError: n[0] ||= (e) => s.value = !0,
					onLoad: n[1] ||= (e) => s.value = !1
				}, null, 40, Ne)) : (O(), y("div", Pe, [S(N(h), {
					name: "image",
					size: 28
				})])), e.modelValue ? v("", !0) : (O(), y("span", Fe, [x(M(o.value ? "正在上传…" : "拖动图片到此处，或点击上传") + " ", 1), n[3] ||= b("span", { class: "content-cover__types" }, "JPG / PNG / WebP，最大 5 MB", -1)]))])]),
				_: 1
			}, 8, ["disabled"]),
			s.value ? (O(), y("span", Ie, " 封面无法加载，请重新上传 ")) : v("", !0),
			e.modelValue ? (O(), _(Ae, {
				key: 1,
				url: e.modelValue,
				file: a.value?.url === e.modelValue ? a.value.file : void 0,
				disabled: e.disabled || o.value,
				onRemove: te
			}, null, 8, [
				"url",
				"file",
				"disabled"
			])) : v("", !0)
		]));
	}
}), [["__scopeId", "data-v-8f5070ba"]]), Re = ["aria-busy"], ze = { class: "article-editor__header" }, Be = { class: "article-editor__heading" }, Ve = { class: "article-editor__commands" }, He = {
	key: 2,
	class: "article-editor__save-error",
	role: "alert"
}, Ue = {
	key: 3,
	class: "article-editor__pending",
	role: "status",
	"aria-live": "polite"
}, We = {
	key: 0,
	class: "article-editor__loading",
	role: "status"
}, Ge = {
	key: 1,
	class: "article-editor__failure"
}, Ke = {
	key: 0,
	class: "article-editor__error"
}, qe = { class: "article-editor__body" }, Je = { class: "article-editor__settings" }, Ye = { class: "article-editor__content" }, Xe = ["aria-invalid", "disabled"], Ze = ["aria-invalid", "disabled"], Qe = {
	class: "news-delete-dialog__icon",
	"aria-hidden": "true"
}, $e = /*#__PURE__*/ p(/* @__PURE__ */ C({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(n, { emit: a }) {
		let { newsError: o, newsCategoryLabel: s, deleteNews: c, getNewsDetail: d, getNewsMetadata: te, saveNews: ne, uploadNewsCover: re } = W(), { hasPermission: ie } = H(), oe = n, p = a, C = k(!0), w = k(!1), T = k(!1), E = k(""), D = k(!1), ue = k(!1), fe = k(!1), A = k(!1), j = k(H().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), P = k(), I = k("draft"), L = k(!1), B = g(() => ie(["cms_news:publish"])), V = g(() => !ie([`cms_news:${oe.articleId ? "edit" : "add"}`]) || !B.value && I.value !== "draft"), he = g(() => ie(["cms_news:delete"]) && (B.value || I.value === "draft"));
		async function ge() {
			if (!(!he.value || w.value || C.value || T.value)) {
				w.value = !0, E.value = "";
				try {
					await c("articles", G.id, G.row_version), Se = JSON.stringify(G), ae.success("新闻已删除"), p("saved");
				} catch (e) {
					E.value = o(e), A.value = !1;
				} finally {
					w.value = !1;
				}
			}
		}
		let U = g(() => V.value || w.value), G = de({
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
		}), { editorRoot: q, seoInput: J, fieldRules: Y, fieldErrors: X, pendingCount: _e, saveError: ve, validateSave: Z, setSaveFailure: ye, focusFirstError: Q, focusSeoError: $ } = xe(G, () => P.value?.categories || [], "news", D), be = g(() => (P.value?.categories || []).map((e) => ({
			label: s(P.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), Se = "", Ce;
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
					let t = await d("articles", oe.articleId, e.signal);
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
				Se = JSON.stringify(G);
			} catch (t) {
				e.signal.aborted || (E.value = o(t), T.value = !0);
			} finally {
				e.signal.aborted || (C.value = !1);
			}
		}
		let Ee = () => !C.value && !T.value && Se !== JSON.stringify(G);
		function De() {
			Ee() ? ue.value = !0 : p("close");
		}
		function Oe() {
			I.value === "draft" ? Ae("draft") : fe.value = !0;
		}
		function ke() {
			fe.value = !1, Ae("draft");
		}
		async function Ae(e) {
			if (U.value || C.value || T.value || L.value || (E.value = "", !await Z(e))) return;
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
				}), Se = JSON.stringify(G), ae.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "新闻已发布"), p("saved");
			} catch (e) {
				ye(e);
			} finally {
				w.value = !1;
			}
			_e.value && await Q();
		}
		function je(e) {
			E.value = o(e);
		}
		let Me = (e) => {
			Ee() && (e.preventDefault(), e.returnValue = "");
		};
		return me(() => !w.value && !L.value && (!Ee() || window.confirm("新闻有未保存的修改，确定离开？"))), le(() => {
			Te(), window.addEventListener("beforeunload", Me);
		}), ce(() => {
			Ce?.abort(), window.removeEventListener("beforeunload", Me);
		}), (a, o) => (O(), y("section", {
			ref_key: "editorRoot",
			ref: q,
			class: "article-editor",
			"aria-busy": C.value || w.value
		}, [
			b("header", ze, [
				S(N(u), {
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
				b("div", Be, [b("h2", null, M(n.articleId ? "编辑新闻" : "新增新闻"), 1), b("span", null, M(P.value?.source_locale || "zh-CN") + " · " + M(j.value), 1)]),
				b("div", Ve, [
					n.articleId && he.value ? (O(), _(N(u), {
						key: 0,
						size: "sm",
						disabled: C.value || T.value || w.value || L.value,
						onClick: o[0] ||= (e) => A.value = !0
					}, {
						default: R(() => [...o[28] ||= [x("删除新闻", -1)]]),
						_: 1
					}, 8, ["disabled"])) : v("", !0),
					S(N(u), {
						size: "sm",
						disabled: C.value || T.value,
						onClick: o[1] ||= (e) => D.value = !0
					}, {
						icon: R(() => [S(N(h), {
							name: "search",
							size: 14
						})]),
						default: R(() => [o[29] ||= x("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					V.value ? v("", !0) : (O(), _(N(u), {
						key: 1,
						size: "sm",
						disabled: C.value || T.value || w.value || L.value,
						onClick: Oe
					}, {
						icon: R(() => [S(N(h), {
							name: "save",
							size: 14
						})]),
						default: R(() => [o[30] ||= x("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					N(ve) ? (O(), y("span", He, M(N(ve)), 1)) : v("", !0),
					!V.value && N(_e) ? (O(), y("span", Ue, "还有 " + M(N(_e)) + " 项待完善", 1)) : v("", !0),
					!V.value && B.value ? (O(), _(N(u), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: C.value || T.value || L.value,
						loading: w.value,
						onClick: o[2] ||= (e) => Ae(G.scheduled_local ? "scheduled" : "published")
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
			C.value ? (O(), y("div", We, [S(N(h), {
				name: "loader-circle",
				class: "news-spin",
				size: 28
			}), o[31] ||= b("span", null, "正在读取新闻资料...", -1)])) : T.value ? (O(), y("div", Ge, [S(N(l), {
				type: "error",
				description: E.value,
				closable: !1
			}, null, 8, ["description"]), S(N(u), { onClick: Te }, {
				default: R(() => [...o[32] ||= [x("重新加载", -1)]]),
				_: 1
			})])) : (O(), y(se, { key: 2 }, [E.value ? (O(), y("div", Ke, [S(N(l), {
				type: "error",
				description: E.value,
				closable: !1
			}, null, 8, ["description"])])) : v("", !0), b("div", qe, [b("aside", Je, [S(N(ee), {
				model: G,
				rules: N(Y),
				"label-position": "top",
				onSubmit: o[12] ||= pe(() => {}, ["prevent"])
			}, {
				default: R(() => [
					S(N(i), {
						label: "新闻分类",
						prop: "category_id",
						error: N(X).category_id,
						required: ""
					}, {
						default: R(() => [S(N(r), {
							modelValue: G.category_id,
							"onUpdate:modelValue": o[3] ||= (e) => G.category_id = e,
							options: be.value,
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
					o[33] ||= b("h3", null, "新闻设置", -1),
					S(N(i), {
						label: "新闻封面",
						prop: "cover_url",
						error: N(X).cover_url
					}, {
						default: R(() => [S(Le, {
							modelValue: G.cover_url,
							"onUpdate:modelValue": o[4] ||= (e) => G.cover_url = e,
							label: "新闻封面",
							disabled: U.value,
							upload: N(re),
							onBusyChange: o[5] ||= (e) => L.value = e,
							onStart: o[6] ||= (e) => E.value = "",
							onError: je
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "内容来源",
						prop: "content_source",
						error: N(X).content_source
					}, {
						default: R(() => [S(N(m), {
							modelValue: G.content_source,
							"onUpdate:modelValue": o[7] ||= (e) => G.content_source = e,
							maxlength: 160,
							disabled: U.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "作者署名",
						prop: "author_name",
						error: N(X).author_name
					}, {
						default: R(() => [S(N(m), {
							modelValue: G.author_name,
							"onUpdate:modelValue": o[8] ||= (e) => G.author_name = e,
							maxlength: 120,
							disabled: U.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "前端排序",
						prop: "sort_order",
						error: N(X).sort_order
					}, {
						default: R(() => [S(N(t), {
							modelValue: G.sort_order,
							"onUpdate:modelValue": o[9] ||= (e) => G.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: U.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[34] ||= b("h3", null, "发布设置", -1),
					S(N(i), {
						label: "启用状态",
						prop: "is_enabled",
						error: N(X).is_enabled
					}, {
						default: R(() => [S(K, {
							modelValue: G.is_enabled,
							"onUpdate:modelValue": o[10] ||= (e) => G.is_enabled = e,
							disabled: U.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: N(X).scheduled_local
					}, {
						default: R(() => [S(N(m), {
							modelValue: G.scheduled_local,
							"onUpdate:modelValue": o[11] ||= (e) => G.scheduled_local = e,
							type: "datetime-local",
							disabled: U.value || !B.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[35] ||= b("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), b("main", Ye, [S(N(ee), {
				model: G,
				rules: N(Y),
				"label-position": "top",
				onSubmit: o[16] ||= pe(() => {}, ["prevent"])
			}, {
				default: R(() => [
					S(N(i), {
						label: "标题",
						prop: "title",
						error: N(X).title,
						required: ""
					}, {
						default: R(() => [S(N(m), {
							modelValue: G.title,
							"onUpdate:modelValue": o[13] ||= (e) => G.title = e,
							maxlength: 255,
							disabled: U.value,
							placeholder: "输入新闻标题",
							"aria-label": "新闻标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "摘要",
						prop: "summary",
						error: N(X).summary
					}, {
						default: R(() => [z(b("textarea", {
							"onUpdate:modelValue": o[14] ||= (e) => G.summary = e,
							"aria-invalid": !!N(X).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: U.value,
							"aria-label": "新闻摘要"
						}, null, 8, Xe), [[F, G.summary]])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "正文",
						prop: "body_html",
						error: N(X).body_html
					}, {
						default: R(() => [S(N(e), {
							modelValue: G.body_html,
							"onUpdate:modelValue": o[15] ||= (e) => G.body_html = e,
							readonly: V.value,
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
			S(N(f), {
				modelValue: D.value,
				"onUpdate:modelValue": o[20] ||= (e) => D.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: R(() => [S(N(u), {
					variant: "primary",
					onClick: o[19] ||= (e) => D.value = !1
				}, {
					default: R(() => [...o[36] ||= [x("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [S(N(ee), {
					model: G,
					rules: N(Y),
					"label-position": "top",
					onSubmit: o[18] ||= pe(() => {}, ["prevent"])
				}, {
					default: R(() => [S(N(i), {
						label: "SEO 描述",
						prop: "seo_description",
						error: N(X).seo_description
					}, {
						default: R(() => [z(b("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": o[17] ||= (e) => G.seo_description = e,
							"aria-invalid": !!N(X).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: U.value,
							"aria-label": "SEO 描述"
						}, null, 8, Ze), [[F, G.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			S(N(f), {
				modelValue: A.value,
				"onUpdate:modelValue": o[22] ||= (e) => A.value = e,
				title: "确认删除",
				subtitle: `操作对象：${G.title || "未命名新闻"}`,
				width: "460px",
				"panel-class": "news-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !w.value
			}, {
				"header-actions": R(() => [b("span", Qe, [S(N(h), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [S(N(u), {
					disabled: w.value,
					onClick: o[21] ||= (e) => A.value = !1
				}, {
					default: R(() => [...o[37] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(u), {
					variant: "warning",
					loading: w.value,
					onClick: ge
				}, {
					default: R(() => [...o[38] ||= [x("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [S(N(l), {
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
			S(N(f), {
				modelValue: ue.value,
				"onUpdate:modelValue": o[25] ||= (e) => ue.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [S(N(u), { onClick: o[23] ||= (e) => ue.value = !1 }, {
					default: R(() => [...o[39] ||= [x("继续编辑", -1)]]),
					_: 1
				}), S(N(u), {
					variant: "primary",
					onClick: o[24] ||= (e) => p("close")
				}, {
					default: R(() => [...o[40] ||= [x("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			S(N(f), {
				modelValue: fe.value,
				"onUpdate:modelValue": o[27] ||= (e) => fe.value = e,
				title: "将新闻转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [S(N(u), { onClick: o[26] ||= (e) => fe.value = !1 }, {
					default: R(() => [...o[41] ||= [x("取消", -1)]]),
					_: 1
				}), S(N(u), {
					variant: "primary",
					onClick: ke
				}, {
					default: R(() => [...o[42] ||= [x("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Re));
	}
}), [["__scopeId", "data-v-9ad8501f"]]), et = { class: "news-articles" }, tt = /*#__PURE__*/ p(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let { newsPublishStates: t, newsCategoryLabel: n, getNewsList: r, getNewsMetadata: i } = W(), { hasPermission: a } = H(), { formatDateTime: o } = H(), s = k(!1), c = k(), l = (e) => a([`cms_news:${e}`]), d = k(), f = ge(i, (e) => {
			d.value = e;
		}), ee = [
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
		], { proTableBindings: te, reload: ae, filters: oe } = ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: g(() => [
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
		f.bindFilters(oe);
		let p = new AbortController();
		async function m() {
			try {
				d.value = await i(p.signal);
			} catch {}
		}
		function se(e) {
			c.value = e, s.value = !0;
		}
		function b() {
			s.value = !1, ae(), m();
		}
		return le(m), ce(() => p.abort()), (e, n) => (O(), y("div", et, [s.value ? (O(), _($e, {
			key: 0,
			"article-id": c.value,
			onClose: n[0] ||= (e) => s.value = !1,
			onSaved: b
		}, null, 8, ["article-id"])) : v("", !0), z(S(N(re), T(N(te), {
			"auto-refreshable": !1,
			columns: ee,
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
			"cell-cms_source_type": R(({ row: e }) => [S(U, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": R(() => [l("add") ? (O(), _(N(u), {
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
			"cell-publish_time": R(({ row: e }) => [x(M(N(o)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": R(({ row: e }) => [S(N(u), {
				size: "sm",
				"icon-only": "",
				title: l("edit") ? "编辑新闻" : "新闻详情",
				"aria-label": l("edit") ? "编辑新闻" : "新闻详情",
				onClick: (t) => se(e.id)
			}, {
				default: R(() => [S(N(h), {
					name: l("edit") ? "square-pen" : "panel-right-open",
					size: 15
				}, null, 8, ["name"])]),
				_: 1
			}, 8, [
				"title",
				"aria-label",
				"onClick"
			])]),
			_: 1
		}, 16), [[I, !s.value]])]));
	}
}), [["__scopeId", "data-v-aef51e21"]]);
//#endregion
//#region src/cms/api/content/academy.ts
function nt() {
	let e = H().request, t = "/cms/academy";
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
var rt = ["aria-busy"], it = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, at = { class: "taxonomy-editor__row" }, ot = "分类", st = /*#__PURE__*/ p(/* @__PURE__ */ C({
	__name: "CategoryTable",
	setup(e) {
		let { hasPermission: n } = H(), { formatDateTime: a } = H(), { academyDifficulties: o, academyError: s, getAcademyList: c, getAcademyMetadata: d, getAcademyDetail: oe, saveAcademy: p, deleteAcademyCategory: C } = nt(), w = (e) => n([`cms_academy_category:${e}`]), E = ge(d), D = [
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
				formatter: (e) => (e || []).map((e) => o.find((t) => t.value === e)?.label).join(" / ")
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
		], { proTableBindings: le, reload: ue, currentPage: fe, pageSize: A, total: j, filters: P } = ne({
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
					}, ...o]
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
		}), I = de(F()), L = k(!1), z = k(!1), B = k(!1), V = k(!1), me = k(!1), W = k(""), G = k(!1), K = k(""), q = k(!1), J = g(() => !w(I.id ? "edit" : "add")), Y = g(() => B.value || V.value), X = "", _e;
		async function ve(e) {
			_e?.abort(), _e = new AbortController();
			let t = _e;
			if (Object.assign(I, F(), { id: e || "" }), K.value = "", me.value = !1, W.value = "", G.value = !1, L.value = !0, z.value = !!e, X = JSON.stringify(I), e) try {
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
				t.signal.aborted || (G.value = !0, K.value = s(e));
			} finally {
				t.signal.aborted || (z.value = !1);
			}
		}
		function Z() {
			return Y.value ? !1 : !z.value && !G.value && JSON.stringify(I) !== X ? (q.value = !0, !1) : (_e?.abort(), !0);
		}
		function ye() {
			Y.value || (_e?.abort(), L.value = !1);
		}
		function Q() {
			q.value = !1, L.value = !1;
		}
		async function $() {
			if (!(J.value || Y.value || z.value || G.value)) {
				if (!I.name.trim() || I.sort_order === null || !I.difficulty_levels.length) {
					K.value = "请填写名称、排序和适用难度";
					return;
				}
				B.value = !0, K.value = "";
				try {
					await p("categories", {
						...I,
						id: I.id || void 0,
						row_version: I.id ? I.row_version : void 0
					}), L.value = !1, ae.success("保存成功"), await ue();
				} catch (e) {
					K.value = s(e);
				} finally {
					B.value = !1;
				}
			}
		}
		function be() {
			!I.id || !w("delete") || Y.value || z.value || G.value || (W.value = "", me.value = !0);
		}
		async function xe() {
			if (!(!me.value || !I.id || !w("delete") || Y.value || z.value || G.value)) {
				V.value = !0, W.value = "";
				try {
					await C({
						id: I.id,
						row_version: I.row_version
					}), me.value = !1, L.value = !1, ae.success("分类已删除"), await ue(), fe.value = Math.min(fe.value, Math.max(1, Math.ceil(j.value / A.value)));
				} catch (e) {
					W.value = s(e);
				} finally {
					V.value = !1;
				}
			}
		}
		return ce(() => _e?.abort()), (e, n) => (O(), y(se, null, [
			S(N(re), T(N(le), {
				"auto-refreshable": !1,
				columns: D,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${ot}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": R(({ row: e }) => [S(U, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [w("add") ? (O(), _(N(u), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: n[0] ||= (e) => ve()
				}, {
					icon: R(() => [S(N(h), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [x("新增" + M(ot))]),
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
				"cell-actions": R(({ row: e }) => [S(N(u), {
					size: "sm",
					"icon-only": "",
					title: w("edit") ? `编辑${ot}` : `${ot}详情`,
					"aria-label": `编辑${ot}`,
					onClick: (t) => ve(e.id)
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
			S(N(f), {
				modelValue: L.value,
				"onUpdate:modelValue": n[5] ||= (e) => L.value = e,
				title: `${I.id ? "编辑" : "新增"}课程${ot}`,
				width: "620px",
				"close-on-click-modal": !1,
				"before-close": Z
			}, {
				footer: R(() => [
					I.id && w("delete") ? (O(), _(N(u), {
						key: 0,
						variant: "danger",
						disabled: z.value || G.value || Y.value,
						onClick: be
					}, {
						icon: R(() => [S(N(h), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [n[10] ||= x("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : v("", !0),
					S(N(u), {
						disabled: Y.value,
						onClick: ye
					}, {
						default: R(() => [...n[11] ||= [x("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					J.value ? v("", !0) : (O(), _(N(u), {
						key: 1,
						variant: "primary",
						loading: B.value,
						disabled: z.value || G.value || V.value,
						onClick: $
					}, {
						default: R(() => [x("保存" + M(ot))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [b("div", {
					class: "taxonomy-editor",
					"aria-busy": z.value
				}, [
					z.value ? (O(), y("div", it, [S(N(h), {
						name: "loader-circle",
						class: "academy-spin",
						size: 24
					}), b("span", null, "正在读取" + M(ot) + "...")])) : v("", !0),
					K.value ? (O(), _(N(l), {
						key: 1,
						type: "error",
						closable: !1,
						description: K.value
					}, null, 8, ["description"])) : v("", !0),
					!z.value && !G.value ? (O(), _(N(ee), {
						key: 2,
						model: I,
						"label-position": "top",
						onSubmit: pe($, ["prevent"])
					}, {
						default: R(() => [
							S(N(i), {
								label: `${ot}名称`,
								required: ""
							}, {
								default: R(() => [S(N(m), {
									modelValue: I.name,
									"onUpdate:modelValue": n[1] ||= (e) => I.name = e,
									maxlength: 120,
									disabled: J.value || Y.value,
									"aria-label": `${ot}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							S(N(i), {
								label: "适用难度",
								required: ""
							}, {
								default: R(() => [S(N(r), {
									modelValue: I.difficulty_levels,
									"onUpdate:modelValue": n[2] ||= (e) => I.difficulty_levels = e,
									multiple: "",
									options: N(o),
									disabled: J.value || Y.value,
									"aria-label": "适用难度"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								])]),
								_: 1
							}),
							b("div", at, [S(N(i), {
								label: "前端排序",
								required: ""
							}, {
								default: R(() => [S(N(t), {
									modelValue: I.sort_order,
									"onUpdate:modelValue": n[3] ||= (e) => I.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: J.value || Y.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), S(N(i), { label: "启用状态" }, {
								default: R(() => [S(N(te), {
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
					}, 8, ["model"])) : v("", !0)
				], 8, rt)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			S(N(f), {
				modelValue: me.value,
				"onUpdate:modelValue": n[7] ||= (e) => me.value = e,
				title: "删除课程分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !V.value
			}, {
				footer: R(() => [S(N(u), {
					disabled: V.value,
					onClick: n[6] ||= (e) => me.value = !1
				}, {
					default: R(() => [...n[12] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(u), {
					variant: "danger",
					loading: V.value,
					onClick: xe
				}, {
					default: R(() => [...n[13] ||= [x("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [b("p", null, "确认删除分类“" + M(I.name) + "”？有关联课程的分类无法删除。", 1), W.value ? (O(), _(N(l), {
					key: 0,
					type: "error",
					closable: !1,
					description: W.value
				}, null, 8, ["description"])) : v("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			S(N(f), {
				modelValue: q.value,
				"onUpdate:modelValue": n[9] ||= (e) => q.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [S(N(u), { onClick: n[8] ||= (e) => q.value = !1 }, {
					default: R(() => [...n[14] ||= [x("继续编辑", -1)]]),
					_: 1
				}), S(N(u), {
					variant: "primary",
					onClick: Q
				}, {
					default: R(() => [...n[15] ||= [x("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 64));
	}
}), [["__scopeId", "data-v-b7830575"]]), ct = { class: "academy-categories" }, lt = /*#__PURE__*/ p(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		return (e, t) => (O(), y("div", ct, [S(st)]));
	}
}), [["__scopeId", "data-v-8f5e5114"]]), ut = [
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
function dt(e) {
	if (/[\x00-\x20\\]/.test(e)) return !1;
	if (e.startsWith("/") && !e.startsWith("//")) return !0;
	try {
		let t = new URL(e);
		return /^https?:\/\//i.test(e) && ["http:", "https:"].includes(t.protocol);
	} catch {
		return !1;
	}
}
function ft(e) {
	return e.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "").replace(/&nbsp;|&#0*(?:160|9|10|13|32);|&#x0*(?:a0|9|a|d|20);/gi, " ").trim().length > 0;
}
function pt(e, t, n, r = Date.now()) {
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
	(e.sort_order === null || !Number.isInteger(e.sort_order) || e.sort_order < 0 || e.sort_order > 2147483647) && (i.sort_order = "请填写 0–2147483647 之间的整数"), e.cover_url && !dt(e.cover_url) && (i.cover_url = "封面地址必须为 HTTP(S) 或站内绝对路径");
	let o = e.category_ids.map((e) => t.find((t) => t.id === e));
	if (a && !o.length ? i.category_ids = "请选择课程分类" : o.some((e) => !e) ? i.category_ids = "所选分类已不可用，请重新选择" : a && o.some((e) => !e?.is_enabled) ? i.category_ids = "发布课程必须选择已启用的分类" : o.length > 50 && (i.category_ids = "最多选择 50 个课程分类"), a && !e.difficulty_level ? i.difficulty_level = "请选择课程难度" : e.difficulty_level !== "" && ![
		1,
		2,
		3
	].includes(e.difficulty_level) ? i.difficulty_level = "请选择有效的课程难度" : e.difficulty_level && o.some((t) => t && !t.difficulty_levels.includes(Number(e.difficulty_level))) && (i.difficulty_level = "课程难度不在所选分类的适用范围内"), a && e.estimated_minutes === null ? i.estimated_minutes = "请填写预计课时" : e.estimated_minutes !== null && (!Number.isInteger(e.estimated_minutes) || e.estimated_minutes < 1 || e.estimated_minutes > 1e5) && (i.estimated_minutes = "预计课时须为 1–100000 之间的整数"), a && !ft(e.body_html) && (i.body_html = "请填写课程正文"), n === "scheduled") {
		let t = new Date(e.scheduled_local).getTime();
		(!Number.isFinite(t) || t <= r) && (i.scheduled_local = "计划发布时间必须晚于当前时间");
	}
	return i;
}
var mt = {
	课程标题不能为空: "title",
	"封面地址必须为 HTTP(S) 或站内绝对路径": "cover_url",
	计划发布时间必须晚于当前时间: "scheduled_local",
	发布课程必须选择分类: "category_ids",
	所选分类不存在或不属于当前学院模板: "category_ids",
	"发布课程必须选择已启用的分类，存在已停用分类": "category_ids",
	课程难度不在所选分类的适用范围内: "difficulty_level",
	"发布课程需要填写正文、课程难度及预计课时": "body_html"
};
function ht(e) {
	let t = {}, n = [], r = e && typeof e == "object" ? e : {};
	for (let [e, i] of Object.entries(r.errors || {})) {
		let r = e.split(".")[0], a = r === "scheduled_at" ? "scheduled_local" : r;
		for (let r of Array.isArray(i) ? i : [i]) {
			if (typeof r != "string" || !r) continue;
			let i = ut.includes(a) ? a : e === "academy" ? mt[r] : void 0;
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
var gt = ["aria-busy"], _t = { class: "course-editor__header" }, vt = { class: "course-editor__heading" }, yt = { class: "course-editor__commands" }, bt = {
	key: 2,
	class: "course-editor__save-error",
	role: "alert"
}, xt = {
	key: 3,
	class: "course-editor__publish-actions"
}, St = {
	key: 0,
	class: "course-editor__pending",
	role: "status",
	"aria-live": "polite"
}, Ct = {
	key: 0,
	class: "course-editor__loading",
	role: "status"
}, wt = {
	key: 1,
	class: "course-editor__failure"
}, Tt = {
	key: 2,
	class: "course-editor__body"
}, Et = { class: "course-editor__settings" }, Dt = { class: "course-editor__content" }, Ot = ["disabled", "aria-invalid"], kt = ["disabled", "aria-invalid"], At = {
	class: "course-delete-dialog__icon",
	"aria-hidden": "true"
}, jt = /*#__PURE__*/ p(/* @__PURE__ */ C({
	__name: "CourseEditor",
	props: { courseId: {} },
	emits: ["close", "saved"],
	setup(n, { emit: a }) {
		let { hasPermission: o } = H(), { academyDifficulties: s, academyError: c, deleteAcademyCourse: d, getAcademyDetail: ne, getAcademyMetadata: re, saveAcademy: ie, uploadAcademyCover: oe } = nt(), p = n, se = a, C = k(!0), w = k(!1), T = k(!1), D = k(""), ue = k(!1), fe = k(!1), A = k(!1), j = k(H().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), P = k(), I = k("draft"), B = k(!1), V = k(!1), he = k(""), ge = g(() => o(["cms_academy:publish"])), U = g(() => !!p.courseId && o(["cms_academy:delete"]) && (ge.value || I.value === "draft")), W = g(() => !o([`cms_academy:${p.courseId ? "edit" : "add"}`]) || !ge.value && I.value !== "draft"), G = g(() => W.value || w.value), K = de({
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
		}), q = k(), J = k(), Y = k(null), X = k(Date.now()), _e = de({}), ve = k(""), Z = Object.fromEntries(ut.map((e) => [e, {
			required: e === "title" || e === "category_ids",
			trigger: "submit"
		}])), ye = g(() => Y.value ? pt(K, P.value?.categories || [], Y.value === "draft" ? "draft" : K.scheduled_local ? "scheduled" : "published", X.value) : {}), Q = g(() => ({
			..._e,
			...ye.value
		})), $ = g(() => Object.keys(Q.value).length);
		for (let e of ut) L(() => K[e], () => {
			delete _e[e], e === "category_ids" && delete _e.difficulty_level, ve.value = "", X.value = Date.now();
		}, { deep: !0 });
		function be() {
			Q.value.seo_description && J.value?.focus();
		}
		async function xe() {
			await E();
			let e = [...q.value?.querySelectorAll("[data-prop]") || []].find((e) => Q.value[e.dataset.prop]);
			if (!e && Q.value.seo_description) {
				ue.value ? be() : ue.value = !0;
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
			let e = (P.value?.categories || []).filter((e) => K.category_ids.includes(e.id));
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
			C.value = !0, T.value = !1, D.value = "";
			try {
				if (P.value = await re(e.signal, { cms_source_type: "platform" }), p.courseId) {
					let t = await ne("courses", p.courseId, e.signal);
					if (P.value = await re(e.signal, { space_id: String(t.space_id) }), j.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					K.scheduled_local = t.publish_status === "scheduled" ? Ee(t.scheduled_at) : "", I.value = t.publish_status;
				}
				we = JSON.stringify(K);
			} catch (t) {
				e.signal.aborted || (D.value = c(t), T.value = !0);
			} finally {
				e.signal.aborted || (C.value = !1);
			}
		}
		let Oe = () => !C.value && !T.value && we !== JSON.stringify(K);
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
			if (G.value || C.value || T.value || B.value) return;
			Y.value = e === "draft" ? "draft" : "publish", X.value = Date.now(), ve.value = "";
			for (let e of ut) delete _e[e];
			if ($.value) {
				await xe();
				return;
			}
			let t = K.scheduled_local ? new Date(K.scheduled_local) : null;
			w.value = !0, D.value = "";
			try {
				await ie("courses", {
					...K,
					id: K.id || void 0,
					row_version: K.id ? K.row_version : void 0,
					difficulty_level: K.difficulty_level || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), we = JSON.stringify(K), ae.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "课程已发布"), se("saved");
			} catch (e) {
				let t = ht(e);
				Object.assign(_e, t.fields), ve.value = t.general;
			} finally {
				w.value = !1;
			}
			$.value && await xe();
		}
		function Ne() {
			he.value = "", V.value = !0;
		}
		async function Pe() {
			if (!(!U.value || C.value || T.value || w.value || B.value)) {
				w.value = !0, he.value = "";
				try {
					await d({
						id: K.id,
						row_version: K.row_version
					}), we = JSON.stringify(K), V.value = !1, ae.success("课程已删除"), se("saved");
				} catch (e) {
					he.value = c(e);
				} finally {
					w.value = !1;
				}
			}
		}
		function Fe(e) {
			_e.cover_url = c(e);
		}
		function Ie() {
			delete _e.cover_url;
		}
		let Re = (e) => {
			Oe() && (e.preventDefault(), e.returnValue = "");
		};
		return me(() => !w.value && !B.value && (!Oe() || window.confirm("课程有未保存的修改，确定离开？"))), le(() => {
			De(), window.addEventListener("beforeunload", Re);
		}), ce(() => {
			Te?.abort(), window.removeEventListener("beforeunload", Re);
		}), (a, o) => (O(), y("section", {
			ref_key: "editorRoot",
			ref: q,
			class: "course-editor",
			"aria-busy": C.value || w.value
		}, [
			b("header", _t, [
				S(N(u), {
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
				b("div", vt, [b("h2", null, M(n.courseId ? "编辑课程" : "新增课程"), 1), b("span", null, M(P.value?.source_locale || "zh-CN") + " · " + M(j.value), 1)]),
				b("div", yt, [
					U.value ? (O(), _(N(u), {
						key: 0,
						variant: "danger",
						size: "sm",
						disabled: C.value || T.value || w.value || B.value,
						onClick: Ne
					}, {
						default: R(() => [...o[27] ||= [x("删除课程", -1)]]),
						_: 1
					}, 8, ["disabled"])) : v("", !0),
					S(N(u), {
						size: "sm",
						disabled: C.value || T.value,
						onClick: o[0] ||= (e) => ue.value = !0
					}, {
						icon: R(() => [S(N(h), {
							name: "search",
							size: 14
						})]),
						default: R(() => [o[28] ||= x("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					W.value ? v("", !0) : (O(), _(N(u), {
						key: 1,
						size: "sm",
						disabled: C.value || T.value || w.value || B.value,
						onClick: Ae
					}, {
						icon: R(() => [S(N(h), {
							name: "save",
							size: 14
						})]),
						default: R(() => [o[29] ||= x("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					ve.value ? (O(), y("span", bt, M(ve.value), 1)) : v("", !0),
					W.value ? v("", !0) : (O(), y("div", xt, [$.value ? (O(), y("span", St, "还有 " + M($.value) + " 项待完善", 1)) : v("", !0), ge.value ? (O(), _(N(u), {
						key: 1,
						variant: "primary",
						size: "sm",
						disabled: C.value || T.value || B.value,
						loading: w.value,
						onClick: o[1] ||= (e) => Me(K.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [S(N(h), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [x(M(K.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : v("", !0)]))
				])
			]),
			C.value ? (O(), y("div", Ct, [S(N(h), {
				name: "loader-circle",
				class: "academy-spin",
				size: 28
			}), o[30] ||= b("span", null, "正在读取课程资料...", -1)])) : T.value ? (O(), y("div", wt, [S(N(l), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"]), S(N(u), { onClick: De }, {
				default: R(() => [...o[31] ||= [x("重新加载", -1)]]),
				_: 1
			})])) : (O(), y("div", Tt, [b("aside", Et, [S(N(ee), {
				model: K,
				rules: N(Z),
				"label-position": "top",
				onSubmit: o[11] ||= pe(() => {}, ["prevent"])
			}, {
				default: R(() => [
					S(N(i), {
						label: "课程分类",
						prop: "category_ids",
						error: Q.value.category_ids,
						required: ""
					}, {
						default: R(() => [S(N(r), {
							modelValue: K.category_ids,
							"onUpdate:modelValue": o[2] ||= (e) => K.category_ids = e,
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
					o[32] ||= b("h3", null, "课程设置", -1),
					S(N(i), {
						label: "课程封面",
						prop: "cover_url",
						error: Q.value.cover_url
					}, {
						default: R(() => [S(Le, {
							modelValue: K.cover_url,
							"onUpdate:modelValue": o[3] ||= (e) => K.cover_url = e,
							label: "课程封面",
							disabled: G.value,
							upload: N(oe),
							onBusyChange: o[4] ||= (e) => B.value = e,
							onStart: o[5] ||= (e) => D.value = "",
							onError: Fe,
							onSuccess: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "课程难度",
						prop: "difficulty_level",
						error: Q.value.difficulty_level
					}, {
						default: R(() => [S(N(r), {
							modelValue: K.difficulty_level,
							"onUpdate:modelValue": o[6] ||= (e) => K.difficulty_level = e,
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
					S(N(i), {
						label: "预计课时(分钟)",
						prop: "estimated_minutes",
						error: Q.value.estimated_minutes
					}, {
						default: R(() => [S(N(t), {
							modelValue: K.estimated_minutes,
							"onUpdate:modelValue": o[7] ||= (e) => K.estimated_minutes = e,
							min: 1,
							max: 1e5,
							precision: 0,
							disabled: G.value,
							"aria-label": "预计课时"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "前端排序",
						prop: "sort_order",
						error: Q.value.sort_order
					}, {
						default: R(() => [S(N(t), {
							modelValue: K.sort_order,
							"onUpdate:modelValue": o[8] ||= (e) => K.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: G.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[33] ||= b("h3", null, "发布设置", -1),
					S(N(i), {
						label: "启用状态",
						prop: "is_enabled",
						error: Q.value.is_enabled
					}, {
						default: R(() => [S(N(te), {
							modelValue: K.is_enabled,
							"onUpdate:modelValue": o[9] ||= (e) => K.is_enabled = e,
							disabled: G.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "计划发布时间",
						prop: "scheduled_local",
						error: Q.value.scheduled_local
					}, {
						default: R(() => [S(N(m), {
							modelValue: K.scheduled_local,
							"onUpdate:modelValue": o[10] ||= (e) => K.scheduled_local = e,
							type: "datetime-local",
							disabled: G.value || !ge.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])]), b("main", Dt, [S(N(ee), {
				model: K,
				rules: N(Z),
				"label-position": "top",
				onSubmit: o[15] ||= pe(() => {}, ["prevent"])
			}, {
				default: R(() => [
					S(N(i), {
						label: "标题",
						prop: "title",
						error: Q.value.title,
						required: ""
					}, {
						default: R(() => [S(N(m), {
							modelValue: K.title,
							"onUpdate:modelValue": o[12] ||= (e) => K.title = e,
							maxlength: 255,
							disabled: G.value,
							placeholder: "输入课程标题",
							"aria-label": "课程标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "摘要",
						prop: "summary",
						error: Q.value.summary
					}, {
						default: R(() => [z(b("textarea", {
							"onUpdate:modelValue": o[13] ||= (e) => K.summary = e,
							class: "course-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: G.value,
							"aria-invalid": !!Q.value.summary,
							"aria-label": "课程摘要"
						}, null, 8, Ot), [[F, K.summary]])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "正文",
						prop: "body_html",
						error: Q.value.body_html
					}, {
						default: R(() => [S(N(e), {
							modelValue: K.body_html,
							"onUpdate:modelValue": o[14] ||= (e) => K.body_html = e,
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
			S(N(f), {
				modelValue: ue.value,
				"onUpdate:modelValue": o[19] ||= (e) => ue.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1,
				onOpened: be
			}, {
				footer: R(() => [S(N(u), {
					variant: "primary",
					onClick: o[18] ||= (e) => ue.value = !1
				}, {
					default: R(() => [...o[34] ||= [x("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [S(N(ee), {
					model: K,
					rules: N(Z),
					"label-position": "top",
					onSubmit: o[17] ||= pe(() => {}, ["prevent"])
				}, {
					default: R(() => [S(N(i), {
						label: "SEO 描述",
						prop: "seo_description",
						error: Q.value.seo_description
					}, {
						default: R(() => [z(b("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": o[16] ||= (e) => K.seo_description = e,
							class: "course-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: G.value,
							"aria-invalid": !!Q.value.seo_description,
							"aria-label": "SEO 描述"
						}, null, 8, kt), [[F, K.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			S(N(f), {
				modelValue: V.value,
				"onUpdate:modelValue": o[21] ||= (e) => V.value = e,
				title: "确认删除",
				subtitle: `操作对象：${K.title || "未命名课程"}`,
				width: "460px",
				"panel-class": "course-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !w.value
			}, {
				"header-actions": R(() => [b("span", At, [S(N(h), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [S(N(u), {
					disabled: w.value,
					onClick: o[20] ||= (e) => V.value = !1
				}, {
					default: R(() => [...o[35] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(u), {
					variant: "warning",
					loading: w.value,
					onClick: Pe
				}, {
					default: R(() => [...o[36] ||= [x("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [S(N(l), {
					class: "course-delete-dialog__notice",
					type: "warning",
					closable: !1,
					"show-icon": !1,
					description: "确定删除这门课程吗？删除后将不再展示，请谨慎操作。"
				}), he.value ? (O(), _(N(l), {
					key: 0,
					type: "error",
					closable: !1,
					description: he.value
				}, null, 8, ["description"])) : v("", !0)]),
				_: 1
			}, 8, [
				"modelValue",
				"subtitle",
				"before-close"
			]),
			S(N(f), {
				modelValue: fe.value,
				"onUpdate:modelValue": o[24] ||= (e) => fe.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [S(N(u), { onClick: o[22] ||= (e) => fe.value = !1 }, {
					default: R(() => [...o[37] ||= [x("继续编辑", -1)]]),
					_: 1
				}), S(N(u), {
					variant: "primary",
					onClick: o[23] ||= (e) => se("close")
				}, {
					default: R(() => [...o[38] ||= [x("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			S(N(f), {
				modelValue: A.value,
				"onUpdate:modelValue": o[26] ||= (e) => A.value = e,
				title: "将课程转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [S(N(u), { onClick: o[25] ||= (e) => A.value = !1 }, {
					default: R(() => [...o[39] ||= [x("取消", -1)]]),
					_: 1
				}), S(N(u), {
					variant: "primary",
					onClick: je
				}, {
					default: R(() => [...o[40] ||= [x("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, gt));
	}
}), [["__scopeId", "data-v-4bde73b0"]]), Mt = { class: "academy-courses" }, Nt = /*#__PURE__*/ p(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = H(), { formatDateTime: n } = H(), { academyDifficulties: r, academyPublishStates: i, getAcademyList: a, getAcademyMetadata: o } = nt(), s = k(!1), c = k(), l = (e) => t([`cms_academy:${e}`]), d = k(), f = ge(o, (e) => {
			d.value = e;
		}), ee = [
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
		], { proTableBindings: te, reload: ae, filters: oe } = ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: g(() => [
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
		f.bindFilters(oe);
		let p = new AbortController();
		async function m() {
			try {
				d.value = await o(p.signal);
			} catch {}
		}
		function se(e) {
			c.value = e, s.value = !0;
		}
		function b() {
			s.value = !1, ae(), m();
		}
		return le(m), ce(() => p.abort()), (e, t) => (O(), y("div", Mt, [s.value ? (O(), _(jt, {
			key: 0,
			"course-id": c.value,
			onClose: t[0] ||= (e) => s.value = !1,
			onSaved: b
		}, null, 8, ["course-id"])) : v("", !0), z(S(N(re), T(N(te), {
			"auto-refreshable": !1,
			columns: ee,
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
			"cell-cms_source_type": R(({ row: e }) => [S(U, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": R(() => [l("add") ? (O(), _(N(u), {
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
				default: R(() => [x(M(N(i).find((t) => t.value === e.publish_status)?.label), 1)]),
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
			"cell-actions": R(({ row: e }) => [S(N(u), {
				size: "sm",
				"icon-only": "",
				title: l("edit") ? "编辑课程" : "课程详情",
				"aria-label": l("edit") ? "编辑课程" : "课程详情",
				onClick: (t) => se(e.id)
			}, {
				default: R(() => [S(N(h), {
					name: l("edit") ? "square-pen" : "panel-right-open",
					size: 15
				}, null, 8, ["name"])]),
				_: 1
			}, 8, [
				"title",
				"aria-label",
				"onClick"
			])]),
			_: 1
		}, 16), [[I, !s.value]])]));
	}
}), [["__scopeId", "data-v-0a52bb25"]]);
//#endregion
//#region src/cms/api/content/help.ts
function Pt() {
	let e = H().request, t = "/cms/help", n = (n, r = {}) => e.get({
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
var Ft = ["aria-checked", "disabled"], It = /*#__PURE__*/ p(/* @__PURE__ */ C({
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
		}, [b("span")], -1), b("span", null, M(e.modelValue ? "已启用" : "已停用"), 1)], 10, Ft));
	}
}), [["__scopeId", "data-v-5cfe8693"]]), Lt = { class: "help-categories" }, Rt = ["aria-busy"], zt = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Bt = { class: "taxonomy-editor__field" }, Vt = { class: "taxonomy-editor__field" }, Ht = { class: "taxonomy-editor__icon-control" }, Ut = ["title"], Wt = ["aria-label"], Gt = { key: 1 }, Kt = {
	key: 0,
	class: "help-hint"
}, qt = { class: "taxonomy-editor__row" }, Jt = "分类", Yt = /*#__PURE__*/ p(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let { helpError: a, deleteHelp: o, getHelpMetadata: s, getHelpList: c, getHelpDetail: d, saveHelp: te } = Pt(), { hasPermission: p } = H(), { formatDateTime: se } = H(), C = (e) => p([`cms_help_category:${e}`]), w = k(), E = k(), D = ge(s, (e) => {
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
		], { proTableBindings: fe, reload: A, filters: j } = ne({
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
		}), F = de(P()), I = [...oe], L = new Set(I), z = g(() => L.has(F.icon_key) ? F.icon_key : void 0), B = k(!1), V = k(!1), me = k(!1), W = k(!1), G = k(!1), K = k(""), q = k(!1), J = k(""), Y = g(() => !C(F.id ? "edit" : "add")), X = g(() => me.value || W.value), _e;
		async function ve(e) {
			_e?.abort(), _e = new AbortController();
			let t = _e;
			Object.assign(F, P(), { id: e || "" }), J.value = "", G.value = !1, K.value = "", q.value = !1, B.value = !0, V.value = !0;
			try {
				if (E.value = await s(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await d("categories", e, t.signal);
				if (E.value = await s(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
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
				t.signal.aborted || (q.value = !0, J.value = a(e));
			} finally {
				t.signal.aborted || (V.value = !1);
			}
		}
		function Z() {
			return X.value ? !1 : (_e?.abort(), !0);
		}
		function ye() {
			Z() && (B.value = !1);
		}
		async function Q() {
			if (!(Y.value || X.value || V.value || q.value)) {
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
					await te("categories", {
						name: F.name,
						parent_id: F.parent_id || null,
						icon_key: F.icon_key || null,
						sort_order: F.sort_order,
						is_enabled: F.is_enabled,
						id: F.id || void 0,
						row_version: F.id ? F.row_version : void 0
					}), B.value = !1, ae.success("保存成功"), await Promise.all([A(), Ce()]);
				} catch (e) {
					J.value = a(e);
				} finally {
					me.value = !1;
				}
			}
		}
		function $() {
			!F.id || !C("delete") || X.value || V.value || q.value || (K.value = "", G.value = !0);
		}
		async function be() {
			if (!(!G.value || !F.id || !C("delete") || X.value || V.value || q.value)) {
				W.value = !0, K.value = "";
				try {
					await o("categories", F.id, F.row_version), G.value = !1, B.value = !1, ae.success("分类已删除"), await Promise.all([A(), Ce()]);
				} catch (e) {
					K.value = a(e);
				} finally {
					W.value = !1;
				}
			}
		}
		let xe = g(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(E.value?.categories || []).filter((e) => !e.parent_id && e.id !== F.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Se = new AbortController();
		async function Ce() {
			try {
				w.value = await s(Se.signal);
			} catch {}
		}
		return le(Ce), ce(() => {
			_e?.abort(), Se.abort();
		}), (e, a) => (O(), y("div", Lt, [
			S(N(re), T(N(fe), {
				"auto-refreshable": !1,
				columns: ue,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Jt}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": R(({ row: e }) => [S(U, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [C("add") ? (O(), _(N(u), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: a[0] ||= (e) => ve()
				}, {
					icon: R(() => [S(N(h), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [x("新增" + M(Jt))]),
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
				"cell-actions": R(({ row: e }) => [S(N(u), {
					size: "sm",
					"icon-only": "",
					title: C("edit") ? `编辑${Jt}` : `${Jt}详情`,
					"aria-label": `编辑${Jt}`,
					onClick: (t) => ve(e.id)
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
			S(N(f), {
				modelValue: B.value,
				"onUpdate:modelValue": a[6] ||= (e) => B.value = e,
				title: `${F.id ? "编辑" : "新增"}帮助${Jt}`,
				width: "680px",
				subtitle: "帮助分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Z
			}, {
				footer: R(() => [
					F.id && C("delete") ? (O(), _(N(u), {
						key: 0,
						variant: "danger",
						disabled: V.value || q.value || X.value,
						onClick: $
					}, {
						icon: R(() => [S(N(h), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [a[11] ||= x("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : v("", !0),
					S(N(u), {
						disabled: X.value,
						onClick: ye
					}, {
						default: R(() => [...a[12] ||= [x("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Y.value ? v("", !0) : (O(), _(N(u), {
						key: 1,
						variant: "primary",
						loading: me.value,
						disabled: V.value || q.value || W.value,
						onClick: Q
					}, {
						default: R(() => [x("保存" + M(Jt))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [b("div", {
					class: "taxonomy-editor",
					"aria-busy": V.value
				}, [
					V.value ? (O(), y("div", zt, [S(N(h), {
						name: "loader-circle",
						class: "help-spin",
						size: 24
					}), b("span", null, "正在读取" + M(Jt) + "...")])) : v("", !0),
					J.value ? (O(), _(N(l), {
						key: 1,
						type: "error",
						closable: !1,
						description: J.value
					}, null, 8, ["description"])) : v("", !0),
					!V.value && !q.value ? (O(), _(N(ee), {
						key: 2,
						model: F,
						"label-position": "top",
						onSubmit: pe(Q, ["prevent"])
					}, {
						default: R(() => [
							F.id ? (O(), _(N(i), {
								key: 0,
								label: "分类ID"
							}, {
								default: R(() => [S(N(m), {
									"model-value": F.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : v("", !0),
							S(N(i), {
								label: `${Jt}名称`,
								required: ""
							}, {
								default: R(() => [S(N(m), {
									modelValue: F.name,
									"onUpdate:modelValue": a[1] ||= (e) => F.name = e,
									maxlength: 120,
									disabled: Y.value || X.value,
									"aria-label": `${Jt}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							S(N(i), { label: "父分类" }, {
								default: R(() => [b("div", Bt, [S(N(r), {
									modelValue: F.parent_id,
									"onUpdate:modelValue": a[2] ||= (e) => F.parent_id = e,
									options: xe.value,
									disabled: Y.value || X.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), a[9] ||= b("p", { class: "help-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类文章。 ", -1)])]),
								_: 1
							}),
							S(N(i), { label: "图标标识" }, {
								default: R(() => [b("div", Vt, [
									b("div", Ht, [S(N(n), {
										modelValue: F.icon_key,
										"onUpdate:modelValue": a[3] ||= (e) => F.icon_key = e,
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
										}, null, 8, ["name"]), b("span", null, M(e), 1)], 8, Ut)]),
										_: 1
									}, 8, ["modelValue", "disabled"]), b("span", {
										class: "taxonomy-editor__icon-preview",
										role: "img",
										"aria-label": z.value ? `图标预览：${z.value}` : "暂无图标预览"
									}, [z.value ? (O(), _(N(h), {
										key: 0,
										name: z.value,
										size: 20
									}, null, 8, ["name"])) : (O(), y("span", Gt, "—"))], 8, Wt)]),
									a[10] ||= b("p", { class: "help-hint" }, " 支持直接输入名称或从下拉列表选择；不填写 SVG 或 HTML。 ", -1),
									F.icon_key && !z.value ? (O(), y("p", Kt, " 当前名称不在已安装的 6mm 图标库中，暂无法预览。 ")) : v("", !0)
								])]),
								_: 1
							}),
							b("div", qt, [S(N(i), {
								label: "前端排序",
								required: ""
							}, {
								default: R(() => [S(N(t), {
									modelValue: F.sort_order,
									"onUpdate:modelValue": a[4] ||= (e) => F.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Y.value || X.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), S(N(i), { label: "启用状态" }, {
								default: R(() => [S(It, {
									modelValue: F.is_enabled,
									"onUpdate:modelValue": a[5] ||= (e) => F.is_enabled = e,
									disabled: Y.value || X.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : v("", !0)
				], 8, Rt)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			S(N(f), {
				modelValue: G.value,
				"onUpdate:modelValue": a[8] ||= (e) => G.value = e,
				title: "删除帮助分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !W.value
			}, {
				footer: R(() => [S(N(u), {
					disabled: W.value,
					onClick: a[7] ||= (e) => G.value = !1
				}, {
					default: R(() => [...a[13] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(u), {
					variant: "danger",
					loading: W.value,
					onClick: be
				}, {
					default: R(() => [...a[14] ||= [x("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [b("p", null, "确认删除分类“" + M(F.name) + "”？有关联文章或子分类的分类无法删除。", 1), K.value ? (O(), _(N(l), {
					key: 0,
					type: "error",
					closable: !1,
					description: K.value
				}, null, 8, ["description"])) : v("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"])
		]));
	}
}), [["__scopeId", "data-v-d876a44a"]]), Xt = ["aria-busy"], Zt = { class: "article-editor__header" }, Qt = { class: "article-editor__heading" }, $t = { class: "article-editor__commands" }, en = {
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
}, pn = /*#__PURE__*/ p(/* @__PURE__ */ C({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(n, { emit: a }) {
		let { helpError: o, helpCategoryLabel: s, deleteHelp: c, getHelpDetail: d, getHelpMetadata: te, getHelpList: ne, saveHelp: re, uploadHelpCover: ie } = Pt(), { hasPermission: oe } = H(), p = n, C = a, w = k(!0), T = k(!1), E = k(!1), D = k(""), ue = k(!1), fe = k(!1), A = k(!1), j = k(!1), P = k(H().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), I = k(), L = k("draft"), V = k(!1), he = g(() => oe(["cms_help:publish"])), ge = g(() => !oe([`cms_help:${p.articleId ? "edit" : "add"}`]) || !he.value && L.value !== "draft"), U = g(() => oe(["cms_help:delete"]) && (he.value || L.value === "draft"));
		async function W() {
			if (!(!U.value || T.value || w.value || E.value)) {
				T.value = !0, D.value = "";
				try {
					await c("articles", K.id, K.row_version), De = JSON.stringify(K), ae.success("文章已删除"), C("saved");
				} catch (e) {
					D.value = o(e), j.value = !1;
				} finally {
					T.value = !1;
				}
			}
		}
		let G = g(() => ge.value || T.value), K = de({
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
		}), { editorRoot: q, seoInput: J, fieldRules: Y, fieldErrors: X, pendingCount: _e, saveError: ve, validateSave: Z, setSaveFailure: ye, focusFirstError: Q, focusSeoError: $ } = xe(K, () => I.value?.categories || [], "help", ue), be = k(""), Se = k(!1), Ce = k([]), we = g(() => Ce.value.filter((e) => e.id !== p.articleId).map((e) => ({
			label: `${e.title} · ${e.code}`,
			value: e.id
		})));
		async function Te() {
			if (!(G.value || Se.value)) {
				Se.value = !0;
				try {
					let e = await ne("articles", {
						keyword: be.value,
						page_size: 100
					}, Oe?.signal), t = Ce.value.filter((e) => K.related_content_ids.includes(e.id));
					Ce.value = [...new Map([...t, ...e.lists].map((e) => [e.id, e])).values()];
				} catch (e) {
					Oe?.signal.aborted || (D.value = o(e));
				} finally {
					Se.value = !1;
				}
			}
		}
		let Ee = g(() => (I.value?.categories || []).map((e) => ({
			label: s(I.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
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
				if (I.value = await te(e.signal, { cms_source_type: "platform" }), p.articleId) {
					let t = await d("articles", p.articleId, e.signal);
					if (I.value = await te(e.signal, { space_id: String(t.space_id) }), P.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					K.scheduled_local = t.publish_status === "scheduled" ? ke(t.scheduled_at) : "", L.value = t.publish_status;
				}
				De = JSON.stringify(K);
			} catch (t) {
				e.signal.aborted || (D.value = o(t), E.value = !0);
			} finally {
				e.signal.aborted || (w.value = !1);
			}
		}
		let je = () => !w.value && !E.value && De !== JSON.stringify(K);
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
			if (G.value || w.value || E.value || V.value || (D.value = "", !await Z(e))) return;
			let t = K.scheduled_local ? new Date(K.scheduled_local) : null;
			T.value = !0, D.value = "";
			try {
				await re("articles", {
					...K,
					id: K.id || void 0,
					row_version: K.id ? K.row_version : void 0,
					category_id: K.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), De = JSON.stringify(K), ae.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "文章已发布"), C("saved");
			} catch (e) {
				ye(e);
			} finally {
				T.value = !1;
			}
			_e.value && await Q();
		}
		function Ie(e) {
			D.value = o(e);
		}
		let Re = (e) => {
			je() && (e.preventDefault(), e.returnValue = "");
		};
		return me(() => !T.value && !V.value && (!je() || window.confirm("文章有未保存的修改，确定离开？"))), le(() => {
			Ae(), window.addEventListener("beforeunload", Re);
		}), ce(() => {
			Oe?.abort(), window.removeEventListener("beforeunload", Re);
		}), (a, o) => (O(), y("section", {
			ref_key: "editorRoot",
			ref: q,
			class: "article-editor",
			"aria-busy": w.value || T.value
		}, [
			b("header", Zt, [
				S(N(u), {
					"icon-only": "",
					title: "返回文章列表",
					"aria-label": "返回文章列表",
					disabled: T.value || V.value,
					onClick: Me
				}, {
					default: R(() => [S(N(h), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				b("div", Qt, [b("h2", null, M(n.articleId ? "编辑文章" : "新增文章"), 1), b("span", null, M(I.value?.source_locale || "zh-CN") + " · " + M(P.value), 1)]),
				b("div", $t, [
					n.articleId && U.value ? (O(), _(N(u), {
						key: 0,
						size: "sm",
						disabled: w.value || E.value || T.value || V.value,
						onClick: o[0] ||= (e) => j.value = !0
					}, {
						default: R(() => [...o[32] ||= [x("删除文章", -1)]]),
						_: 1
					}, 8, ["disabled"])) : v("", !0),
					S(N(u), {
						size: "sm",
						disabled: w.value || E.value,
						onClick: o[1] ||= (e) => ue.value = !0
					}, {
						icon: R(() => [S(N(h), {
							name: "search",
							size: 14
						})]),
						default: R(() => [o[33] ||= x("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					ge.value ? v("", !0) : (O(), _(N(u), {
						key: 1,
						size: "sm",
						disabled: w.value || E.value || T.value || V.value,
						onClick: Ne
					}, {
						icon: R(() => [S(N(h), {
							name: "save",
							size: 14
						})]),
						default: R(() => [o[34] ||= x("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					N(ve) ? (O(), y("span", en, M(N(ve)), 1)) : v("", !0),
					!ge.value && N(_e) ? (O(), y("span", tn, "还有 " + M(N(_e)) + " 项待完善", 1)) : v("", !0),
					!ge.value && he.value ? (O(), _(N(u), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: w.value || E.value || V.value,
						loading: T.value,
						onClick: o[2] ||= (e) => Fe(K.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [S(N(h), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [x(M(K.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : v("", !0)
				])
			]),
			w.value ? (O(), y("div", nn, [S(N(h), {
				name: "loader-circle",
				class: "help-spin",
				size: 28
			}), o[35] ||= b("span", null, "正在读取文章资料...", -1)])) : E.value ? (O(), y("div", rn, [S(N(l), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"]), S(N(u), { onClick: Ae }, {
				default: R(() => [...o[36] ||= [x("重新加载", -1)]]),
				_: 1
			})])) : (O(), y(se, { key: 2 }, [D.value ? (O(), y("div", an, [S(N(l), {
				type: "error",
				description: D.value,
				closable: !1
			}, null, 8, ["description"])])) : v("", !0), b("div", on, [b("aside", sn, [S(N(ee), {
				model: K,
				rules: N(Y),
				"label-position": "top",
				onSubmit: o[16] ||= pe(() => {}, ["prevent"])
			}, {
				default: R(() => [
					S(N(i), {
						label: "文章分类",
						prop: "category_id",
						error: N(X).category_id,
						required: ""
					}, {
						default: R(() => [S(N(r), {
							modelValue: K.category_id,
							"onUpdate:modelValue": o[3] ||= (e) => K.category_id = e,
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
					o[39] ||= b("h3", null, "文章设置", -1),
					S(N(i), {
						label: "文章封面",
						prop: "cover_url",
						error: N(X).cover_url
					}, {
						default: R(() => [S(Le, {
							modelValue: K.cover_url,
							"onUpdate:modelValue": o[4] ||= (e) => K.cover_url = e,
							label: "文章封面",
							disabled: G.value,
							upload: N(ie),
							onBusyChange: o[5] ||= (e) => V.value = e,
							onStart: o[6] ||= (e) => D.value = "",
							onError: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "内容来源",
						prop: "content_source",
						error: N(X).content_source
					}, {
						default: R(() => [S(N(m), {
							modelValue: K.content_source,
							"onUpdate:modelValue": o[7] ||= (e) => K.content_source = e,
							maxlength: 160,
							disabled: G.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "作者署名",
						prop: "author_name",
						error: N(X).author_name
					}, {
						default: R(() => [S(N(m), {
							modelValue: K.author_name,
							"onUpdate:modelValue": o[8] ||= (e) => K.author_name = e,
							maxlength: 120,
							disabled: G.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "前端排序",
						prop: "sort_order",
						error: N(X).sort_order
					}, {
						default: R(() => [S(N(t), {
							modelValue: K.sort_order,
							"onUpdate:modelValue": o[9] ||= (e) => K.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: G.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[40] ||= b("h3", null, "发布设置", -1),
					S(N(i), {
						label: "搜索关键词",
						prop: "search_keywords",
						error: N(X).search_keywords
					}, {
						default: R(() => [S(N(m), {
							modelValue: K.search_keywords,
							"onUpdate:modelValue": o[10] ||= (e) => K.search_keywords = e,
							maxlength: 2e3,
							disabled: G.value,
							placeholder: "使用空格或逗号分隔",
							"aria-label": "搜索关键词"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: N(X).helpful_enabled
					}, {
						default: R(() => [S(It, {
							modelValue: K.helpful_enabled,
							"onUpdate:modelValue": o[11] ||= (e) => K.helpful_enabled = e,
							disabled: G.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "相关文章",
						prop: "related_content_ids",
						error: N(X).related_content_ids
					}, {
						default: R(() => [b("div", cn, [
							S(N(m), {
								modelValue: be.value,
								"onUpdate:modelValue": o[12] ||= (e) => be.value = e,
								disabled: G.value,
								placeholder: "搜索文章标题",
								"aria-label": "搜索相关文章",
								onKeydown: B(pe(Te, ["prevent"]), ["enter"])
							}, null, 8, [
								"modelValue",
								"disabled",
								"onKeydown"
							]),
							S(N(u), {
								size: "sm",
								disabled: G.value,
								loading: Se.value,
								onClick: Te
							}, {
								default: R(() => [...o[37] ||= [x("查找文章", -1)]]),
								_: 1
							}, 8, ["disabled", "loading"]),
							S(N(r), {
								modelValue: K.related_content_ids,
								"onUpdate:modelValue": o[13] ||= (e) => K.related_content_ids = e,
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
							o[38] ||= b("p", { class: "article-editor__hint" }, " 最多 20 篇，按选择顺序展示。可关联草稿，前台须按发布状态过滤。 ", -1)
						])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "启用状态",
						prop: "is_enabled",
						error: N(X).is_enabled
					}, {
						default: R(() => [S(It, {
							modelValue: K.is_enabled,
							"onUpdate:modelValue": o[14] ||= (e) => K.is_enabled = e,
							disabled: G.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: N(X).scheduled_local
					}, {
						default: R(() => [S(N(m), {
							modelValue: K.scheduled_local,
							"onUpdate:modelValue": o[15] ||= (e) => K.scheduled_local = e,
							type: "datetime-local",
							disabled: G.value || !he.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[41] ||= b("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), b("main", ln, [S(N(ee), {
				model: K,
				rules: N(Y),
				"label-position": "top",
				onSubmit: o[20] ||= pe(() => {}, ["prevent"])
			}, {
				default: R(() => [
					S(N(i), {
						label: "标题",
						prop: "title",
						error: N(X).title,
						required: ""
					}, {
						default: R(() => [S(N(m), {
							modelValue: K.title,
							"onUpdate:modelValue": o[17] ||= (e) => K.title = e,
							maxlength: 255,
							disabled: G.value,
							placeholder: "输入文章标题",
							"aria-label": "文章标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "摘要",
						prop: "summary",
						error: N(X).summary
					}, {
						default: R(() => [z(b("textarea", {
							"onUpdate:modelValue": o[18] ||= (e) => K.summary = e,
							"aria-invalid": !!N(X).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: G.value,
							"aria-label": "文章摘要"
						}, null, 8, un), [[F, K.summary]])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "正文",
						prop: "body_html",
						error: N(X).body_html
					}, {
						default: R(() => [S(N(e), {
							modelValue: K.body_html,
							"onUpdate:modelValue": o[19] ||= (e) => K.body_html = e,
							readonly: ge.value,
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
			S(N(f), {
				modelValue: ue.value,
				"onUpdate:modelValue": o[24] ||= (e) => ue.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: R(() => [S(N(u), {
					variant: "primary",
					onClick: o[23] ||= (e) => ue.value = !1
				}, {
					default: R(() => [...o[42] ||= [x("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [S(N(ee), {
					model: K,
					rules: N(Y),
					"label-position": "top",
					onSubmit: o[22] ||= pe(() => {}, ["prevent"])
				}, {
					default: R(() => [S(N(i), {
						label: "SEO 描述",
						prop: "seo_description",
						error: N(X).seo_description
					}, {
						default: R(() => [z(b("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": o[21] ||= (e) => K.seo_description = e,
							"aria-invalid": !!N(X).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: G.value,
							"aria-label": "SEO 描述"
						}, null, 8, dn), [[F, K.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			S(N(f), {
				modelValue: j.value,
				"onUpdate:modelValue": o[26] ||= (e) => j.value = e,
				title: "确认删除",
				subtitle: `操作对象：${K.title || "未命名文章"}`,
				width: "460px",
				"panel-class": "help-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !T.value
			}, {
				"header-actions": R(() => [b("span", fn, [S(N(h), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [S(N(u), {
					disabled: T.value,
					onClick: o[25] ||= (e) => j.value = !1
				}, {
					default: R(() => [...o[43] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(u), {
					variant: "warning",
					loading: T.value,
					onClick: W
				}, {
					default: R(() => [...o[44] ||= [x("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [S(N(l), {
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
			S(N(f), {
				modelValue: fe.value,
				"onUpdate:modelValue": o[29] ||= (e) => fe.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [S(N(u), { onClick: o[27] ||= (e) => fe.value = !1 }, {
					default: R(() => [...o[45] ||= [x("继续编辑", -1)]]),
					_: 1
				}), S(N(u), {
					variant: "primary",
					onClick: o[28] ||= (e) => C("close")
				}, {
					default: R(() => [...o[46] ||= [x("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			S(N(f), {
				modelValue: A.value,
				"onUpdate:modelValue": o[31] ||= (e) => A.value = e,
				title: "将文章转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [S(N(u), { onClick: o[30] ||= (e) => A.value = !1 }, {
					default: R(() => [...o[47] ||= [x("取消", -1)]]),
					_: 1
				}), S(N(u), {
					variant: "primary",
					onClick: Pe
				}, {
					default: R(() => [...o[48] ||= [x("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Xt));
	}
}), [["__scopeId", "data-v-16f68391"]]), mn = { class: "help-articles" }, hn = {
	key: 0,
	class: "help-statistics-note"
}, gn = /*#__PURE__*/ p(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let t = H(), { helpPublishStates: n, helpCategoryLabel: r, getHelpList: i, getHelpMetadata: a } = Pt(), { hasPermission: o } = H(), { formatDateTime: s } = H(), c = k(!1), l = k(), d = (e) => o([`cms_help:${e}`]), f = k(), ee = ge(a, (e) => {
			f.value = e;
		}), te = [
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
		], { proTableBindings: ae, reload: oe, filters: p } = ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: g(() => [
				...ee.fields,
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
		ee.bindFilters(p);
		let m = new AbortController();
		async function se() {
			try {
				f.value = await a(m.signal);
			} catch {}
		}
		function b(e) {
			l.value = e, c.value = !0;
		}
		function C() {
			c.value = !1, oe(), se();
		}
		return le(se), ce(() => m.abort()), (e, r) => (O(), y("div", mn, [
			!c.value && N(t).mode === "platform" ? (O(), y("p", hn, " 当前管理平台默认模板。浏览量、评价数及有帮助率属于站点运行数据，此处显示“—”，不汇总白标站点。 ")) : v("", !0),
			c.value ? (O(), _(pn, {
				key: 1,
				"article-id": l.value,
				onClose: r[0] ||= (e) => c.value = !1,
				onSaved: C
			}, null, 8, ["article-id"])) : v("", !0),
			z(S(N(re), T(N(ae), {
				"auto-refreshable": !1,
				columns: te,
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
				"cell-cms_source_type": R(({ row: e }) => [S(U, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [d("add") ? (O(), _(N(u), {
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
				"cell-publish_time": R(({ row: e }) => [x(M(N(s)(e.published_at || e.scheduled_at)), 1)]),
				"cell-actions": R(({ row: e }) => [S(N(u), {
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
			}, 16), [[I, !c.value]])
		]));
	}
}), [["__scopeId", "data-v-e3373337"]]);
//#endregion
//#region src/cms/api/content/feedback.ts
function _n() {
	let e = H().request, t = "/cms/feedback", n = (n, r) => e.get({
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
}, wn = { class: "attachment-title" }, Tn = ["src", "alt"], En = /*#__PURE__*/ p(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let { getFeedbackList: t, getFeedbackMetadata: n, getFeedbackDetail: r, getFeedbackAttachment: i, feedbackSourceTypes: a, feedbackSourceLabel: o, feedbackError: s } = _n(), { formatDateTime: c } = H(), d = k({
			scenes: [],
			issues: []
		}), ee = ge(n, (e) => {
			d.value = e;
		}), te = [
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
				formatter: c
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				fixed: "right",
				align: "center",
				hideable: !1
			}
		], { proTableBindings: ae, filters: oe } = ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: g(() => [
				...ee.fields,
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
		ee.bindFilters(oe);
		let p = k(!1), m = k(!1), C = k(""), w = k(), E = k({}), D = k(""), ue, de = new AbortController();
		async function A(e) {
			ue?.abort();
			let t = new AbortController();
			ue = t, w.value = void 0, E.value = {}, C.value = "", D.value = "", p.value = !0, m.value = !0;
			try {
				let n = await r(e, t.signal);
				t.signal.aborted || (w.value = n);
			} catch (e) {
				t.signal.aborted || (C.value = s(e));
			} finally {
				t.signal.aborted || (m.value = !1);
			}
		}
		async function j(e) {
			let t = ue, n = w.value?.id;
			if (!(!t || !n || D.value)) {
				D.value = e, C.value = "";
				try {
					let r = await i(n, e, t.signal);
					!t.signal.aborted && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(r.data_url) && (E.value[e] = r.data_url);
				} catch (e) {
					t.signal.aborted || (C.value = s(e));
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
		}), (e, t) => (O(), y("div", vn, [S(N(re), T(N(ae), {
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
			"cell-cms_source_type": R(({ row: e }) => [S(U, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"cell-source_type": R(({ row: e }) => [S(N(ie), {
				size: "sm",
				effect: "soft",
				type: e.source_type === "merchant" ? "warning" : e.source_type === "platform" ? "success" : "primary"
			}, {
				default: R(() => [x(M(N(o)(e.source_type)), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-actions": R(({ row: e }) => [S(N(u), {
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
		}, 16), S(N(f), {
			modelValue: p.value,
			"onUpdate:modelValue": t[1] ||= (e) => p.value = e,
			title: "反馈详情",
			subtitle: w.value?.code || "查看用户正式提交的意见反馈",
			width: "760px",
			"close-on-click-modal": !1
		}, {
			footer: R(() => [S(N(u), { onClick: t[0] ||= (e) => p.value = !1 }, {
				default: R(() => [...t[14] ||= [x("关闭", -1)]]),
				_: 1
			})]),
			default: R(() => [b("div", {
				class: "feedback-detail",
				"aria-busy": m.value
			}, [
				m.value ? (O(), y("p", bn, "正在读取反馈…")) : v("", !0),
				C.value ? (O(), _(N(l), {
					key: 1,
					type: "error",
					closable: !1,
					description: C.value
				}, null, 8, ["description"])) : v("", !0),
				w.value && !m.value ? (O(), y(se, { key: 2 }, [
					b("dl", xn, [
						b("div", null, [t[2] ||= b("dt", null, "UID", -1), b("dd", null, M(w.value.public_user_id_snapshot), 1)]),
						b("div", null, [t[3] ||= b("dt", null, "用户账号", -1), b("dd", null, M(w.value.username_snapshot || "—"), 1)]),
						b("div", null, [t[4] ||= b("dt", null, "来源类型", -1), b("dd", null, M(N(o)(w.value.source_type)), 1)]),
						b("div", null, [t[5] ||= b("dt", null, "来源名称", -1), b("dd", null, M(w.value.source_name_snapshot || "—"), 1)]),
						b("div", null, [t[6] ||= b("dt", null, "业务场景", -1), b("dd", null, M(w.value.scene_name_snapshot), 1)]),
						b("div", null, [t[7] ||= b("dt", null, "问题分类", -1), b("dd", null, M(w.value.issue_category_name_snapshot), 1)]),
						b("div", null, [t[8] ||= b("dt", null, "联系方式（脱敏）", -1), b("dd", null, M(w.value.contact_display), 1)]),
						b("div", null, [t[9] ||= b("dt", null, "提交时间", -1), b("dd", null, M(N(c)(w.value.submitted_at)), 1)])
					]),
					b("section", null, [t[10] ||= b("h3", null, "反馈内容", -1), b("div", Sn, M(w.value.content), 1)]),
					b("section", null, [
						b("h3", null, [t[11] ||= x(" 附件 ", -1), b("span", null, M(w.value.attachments?.length || 0), 1)]),
						w.value.attachments?.length ? v("", !0) : (O(), y("p", Cn, "暂无附件")),
						(O(!0), y(se, null, fe(w.value.attachments, (e) => (O(), y("div", {
							key: e.id,
							class: "feedback-attachment"
						}, [b("div", wn, [b("span", null, M(e.original_name || "图片附件") + " · " + M(Math.ceil(e.byte_size / 1024)) + " KB", 1), S(N(u), {
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
						}, null, 8, Tn)) : v("", !0)]))), 128))
					]),
					t[13] ||= b("p", { class: "muted" }, "来源和分类为提交时快照；此页面仅查看，不修改用户原始反馈。", -1)
				], 64)) : v("", !0)
			], 8, yn)]),
			_: 1
		}, 8, ["modelValue", "subtitle"])]));
	}
}), [["__scopeId", "data-v-ed508c88"]]);
//#endregion
//#region src/cms/api/content/announcement.ts
function Dn() {
	let e = H().request, t = "/cms/announcement", n = (n, r = {}) => e.get({
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
var On = { class: "announcement-categories" }, kn = ["aria-busy"], An = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, jn = { class: "taxonomy-editor__field" }, Mn = { class: "taxonomy-editor__row" }, Nn = "分类", Pn = /*#__PURE__*/ p(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let { hasPermission: n } = H(), { formatDateTime: a } = H(), { announcementError: o, deleteAnnouncement: s, getAnnouncementMetadata: c, getAnnouncementList: d, getAnnouncementDetail: te, saveAnnouncement: oe } = Dn(), p = (e) => n([`cms_announcement_category:${e}`]), se = k(), C = k(), w = ge(c, (e) => {
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
		], { proTableBindings: D, reload: ue, filters: fe } = ne({
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
		}), j = de(A()), P = k(!1), F = k(!1), I = k(!1), L = k(!1), z = k(!1), B = k(""), V = k(!1), me = k(""), W = k(!1), G = g(() => !p(j.id ? "edit" : "add")), q = g(() => I.value || L.value), J = "", Y;
		async function X(e) {
			Y?.abort(), Y = new AbortController();
			let t = Y;
			Object.assign(j, A(), { id: e || "" }), me.value = "", z.value = !1, B.value = "", V.value = !1, P.value = !0, F.value = !0, J = JSON.stringify(j);
			try {
				if (C.value = await c(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await te("categories", e, t.signal);
				if (C.value = await c(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
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
				t.signal.aborted || (V.value = !0, me.value = o(e));
			} finally {
				t.signal.aborted || (F.value = !1);
			}
		}
		function _e() {
			return q.value ? !1 : !F.value && !V.value && JSON.stringify(j) !== J ? (W.value = !0, !1) : (Y?.abort(), !0);
		}
		function ve() {
			_e() && (P.value = !1);
		}
		function Z() {
			Y?.abort(), W.value = !1, P.value = !1;
		}
		async function ye() {
			if (!(G.value || q.value || F.value || V.value)) {
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
					me.value = o(e);
				} finally {
					I.value = !1;
				}
			}
		}
		function Q() {
			!j.id || !p("delete") || q.value || F.value || V.value || (B.value = "", z.value = !0);
		}
		async function $() {
			if (!(!z.value || !j.id || !p("delete") || q.value || F.value || V.value)) {
				L.value = !0, B.value = "";
				try {
					await s("categories", j.id, j.row_version), z.value = !1, P.value = !1, ae.success("分类已删除"), await Promise.all([ue(), Se()]);
				} catch (e) {
					B.value = o(e);
				} finally {
					L.value = !1;
				}
			}
		}
		let be = g(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(C.value?.categories || []).filter((e) => !e.parent_id && e.id !== j.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), xe = new AbortController();
		async function Se() {
			try {
				se.value = await c(xe.signal);
			} catch {}
		}
		return le(Se), ce(() => {
			Y?.abort(), xe.abort();
		}), (e, n) => (O(), y("div", On, [
			S(N(re), T(N(D), {
				"auto-refreshable": !1,
				columns: E,
				"row-key": "id",
				"fill-height": "",
				"columns-configurable": "",
				"show-cell-title": "",
				"aria-label": `${Nn}管理`,
				"page-sizes": [
					20,
					50,
					100
				]
			}), {
				"cell-cms_source_type": R(({ row: e }) => [S(U, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": R(() => [p("add") ? (O(), _(N(u), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: n[0] ||= (e) => X()
				}, {
					icon: R(() => [S(N(h), {
						name: "plus",
						size: 14
					})]),
					default: R(() => [x("新增" + M(Nn))]),
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
				"cell-actions": R(({ row: e }) => [S(N(u), {
					size: "sm",
					"icon-only": "",
					title: p("edit") ? `编辑${Nn}` : `${Nn}详情`,
					"aria-label": p("edit") ? `编辑${Nn}` : `${Nn}详情`,
					onClick: (t) => X(e.id)
				}, {
					default: R(() => [S(N(h), {
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
			S(N(f), {
				modelValue: P.value,
				"onUpdate:modelValue": n[5] ||= (e) => P.value = e,
				title: `${j.id ? "编辑" : "新增"}公告${Nn}`,
				width: "680px",
				subtitle: "公告分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": _e
			}, {
				footer: R(() => [
					j.id && p("delete") ? (O(), _(N(u), {
						key: 0,
						variant: "danger",
						disabled: F.value || V.value || q.value,
						onClick: Q
					}, {
						icon: R(() => [S(N(h), {
							name: "trash-2",
							size: 14
						})]),
						default: R(() => [n[11] ||= x("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : v("", !0),
					S(N(u), {
						disabled: q.value,
						onClick: ve
					}, {
						default: R(() => [...n[12] ||= [x("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					G.value ? v("", !0) : (O(), _(N(u), {
						key: 1,
						variant: "primary",
						loading: I.value,
						disabled: F.value || V.value || L.value,
						onClick: ye
					}, {
						default: R(() => [x("保存" + M(Nn))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: R(() => [b("div", {
					class: "taxonomy-editor",
					"aria-busy": F.value
				}, [
					F.value ? (O(), y("div", An, [S(N(h), {
						name: "loader-circle",
						class: "announcement-spin",
						size: 24
					}), b("span", null, "正在读取" + M(Nn) + "...")])) : v("", !0),
					me.value ? (O(), _(N(l), {
						key: 1,
						type: "error",
						closable: !1,
						description: me.value
					}, null, 8, ["description"])) : v("", !0),
					!F.value && !V.value ? (O(), _(N(ee), {
						key: 2,
						model: j,
						"label-position": "top",
						onSubmit: pe(ye, ["prevent"])
					}, {
						default: R(() => [
							j.id ? (O(), _(N(i), {
								key: 0,
								label: "分类ID"
							}, {
								default: R(() => [S(N(m), {
									"model-value": j.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : v("", !0),
							S(N(i), {
								label: `${Nn}名称`,
								required: ""
							}, {
								default: R(() => [S(N(m), {
									modelValue: j.name,
									"onUpdate:modelValue": n[1] ||= (e) => j.name = e,
									maxlength: 120,
									disabled: G.value || q.value,
									"aria-label": `${Nn}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							S(N(i), { label: "父分类" }, {
								default: R(() => [b("div", jn, [S(N(r), {
									modelValue: j.parent_id,
									"onUpdate:modelValue": n[2] ||= (e) => j.parent_id = e,
									options: be.value,
									disabled: G.value || q.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), n[10] ||= b("p", { class: "announcement-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类公告。 ", -1)])]),
								_: 1
							}),
							b("div", Mn, [S(N(i), {
								label: "前端排序",
								required: ""
							}, {
								default: R(() => [S(N(t), {
									modelValue: j.sort_order,
									"onUpdate:modelValue": n[3] ||= (e) => j.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: G.value || q.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), S(N(i), { label: "启用状态" }, {
								default: R(() => [S(K, {
									modelValue: j.is_enabled,
									"onUpdate:modelValue": n[4] ||= (e) => j.is_enabled = e,
									disabled: G.value || q.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : v("", !0)
				], 8, kn)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			S(N(f), {
				modelValue: z.value,
				"onUpdate:modelValue": n[7] ||= (e) => z.value = e,
				title: "删除公告分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !L.value
			}, {
				footer: R(() => [S(N(u), {
					disabled: L.value,
					onClick: n[6] ||= (e) => z.value = !1
				}, {
					default: R(() => [...n[13] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(u), {
					variant: "danger",
					loading: L.value,
					onClick: $
				}, {
					default: R(() => [...n[14] ||= [x("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [b("p", null, "确认删除分类“" + M(j.name) + "”？有关联公告或子分类的分类无法删除。", 1), B.value ? (O(), _(N(l), {
					key: 0,
					type: "error",
					closable: !1,
					description: B.value
				}, null, 8, ["description"])) : v("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			S(N(f), {
				modelValue: W.value,
				"onUpdate:modelValue": n[9] ||= (e) => W.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [S(N(u), { onClick: n[8] ||= (e) => W.value = !1 }, {
					default: R(() => [...n[15] ||= [x("继续编辑", -1)]]),
					_: 1
				}), S(N(u), {
					variant: "primary",
					onClick: Z
				}, {
					default: R(() => [...n[16] ||= [x("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		]));
	}
}), [["__scopeId", "data-v-1b5aec70"]]), Fn = ["aria-busy"], In = { class: "article-editor__header" }, Ln = { class: "article-editor__heading" }, Rn = { class: "article-editor__commands" }, zn = {
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
}, Xn = /*#__PURE__*/ p(/* @__PURE__ */ C({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(n, { emit: a }) {
		let { hasPermission: o } = H(), { announcementError: s, announcementCategoryLabel: c, deleteAnnouncement: d, getAnnouncementDetail: te, getAnnouncementMetadata: ne, saveAnnouncement: re, uploadAnnouncementCover: ie } = Dn(), oe = n, p = a, C = k(!0), w = k(!1), T = k(!1), E = k(""), D = k(!1), ue = k(!1), fe = k(!1), A = k(!1), j = k(H().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), P = k(), I = k("draft"), L = k(!1), B = g(() => o(["cms_announcement:publish"])), V = g(() => !o([`cms_announcement:${oe.articleId ? "edit" : "add"}`]) || !B.value && I.value !== "draft"), he = g(() => o(["cms_announcement:delete"]) && (B.value || I.value === "draft"));
		async function ge() {
			if (!(!he.value || w.value || C.value || T.value)) {
				w.value = !0, E.value = "";
				try {
					await d("articles", W.id, W.row_version), $ = JSON.stringify(W), ae.success("公告已删除"), p("saved");
				} catch (e) {
					E.value = s(e), A.value = !1;
				} finally {
					w.value = !1;
				}
			}
		}
		let U = g(() => V.value || w.value), W = de({
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
		}), { editorRoot: G, seoInput: K, fieldRules: q, fieldErrors: J, pendingCount: Y, saveError: X, validateSave: _e, setSaveFailure: ve, focusFirstError: Z, focusSeoError: ye } = xe(W, () => P.value?.categories || [], "announcement", D), Q = g(() => (P.value?.categories || []).map((e) => ({
			label: c(P.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), $ = "", be;
		function Se(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Ce() {
			be?.abort(), be = new AbortController();
			let e = be;
			C.value = !0, T.value = !1, E.value = "";
			try {
				if (P.value = await ne(e.signal, { cms_source_type: "platform" }), oe.articleId) {
					let t = await te("articles", oe.articleId, e.signal);
					if (P.value = await ne(e.signal, { space_id: String(t.space_id) }), j.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					W.scheduled_local = t.publish_status === "scheduled" ? Se(t.scheduled_at) : "", I.value = t.publish_status;
				}
				$ = JSON.stringify(W);
			} catch (t) {
				e.signal.aborted || (E.value = s(t), T.value = !0);
			} finally {
				e.signal.aborted || (C.value = !1);
			}
		}
		let we = () => !C.value && !T.value && $ !== JSON.stringify(W);
		function Te() {
			we() ? ue.value = !0 : p("close");
		}
		function Ee() {
			I.value === "draft" ? Oe("draft") : fe.value = !0;
		}
		function De() {
			fe.value = !1, Oe("draft");
		}
		async function Oe(e) {
			if (U.value || C.value || T.value || L.value || (E.value = "", !await _e(e))) return;
			let t = W.scheduled_local ? new Date(W.scheduled_local) : null;
			w.value = !0, E.value = "";
			try {
				await re("articles", {
					...W,
					id: W.id || void 0,
					row_version: W.id ? W.row_version : void 0,
					category_id: W.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), $ = JSON.stringify(W), ae.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "公告已发布"), p("saved");
			} catch (e) {
				ve(e);
			} finally {
				w.value = !1;
			}
			Y.value && await Z();
		}
		function ke(e) {
			E.value = s(e);
		}
		let Ae = (e) => {
			we() && (e.preventDefault(), e.returnValue = "");
		};
		return me(() => !w.value && !L.value && (!we() || window.confirm("公告有未保存的修改，确定离开？"))), le(() => {
			Ce(), window.addEventListener("beforeunload", Ae);
		}), ce(() => {
			be?.abort(), window.removeEventListener("beforeunload", Ae);
		}), (a, o) => (O(), y("section", {
			ref_key: "editorRoot",
			ref: G,
			class: "article-editor",
			"aria-busy": C.value || w.value
		}, [
			b("header", In, [
				S(N(u), {
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
				b("div", Ln, [b("h2", null, M(n.articleId ? "编辑公告" : "新增公告"), 1), b("span", null, M(P.value?.source_locale || "zh-CN") + " · " + M(j.value), 1)]),
				b("div", Rn, [
					n.articleId && he.value ? (O(), _(N(u), {
						key: 0,
						size: "sm",
						disabled: C.value || T.value || w.value || L.value,
						onClick: o[0] ||= (e) => A.value = !0
					}, {
						default: R(() => [...o[29] ||= [x("删除公告", -1)]]),
						_: 1
					}, 8, ["disabled"])) : v("", !0),
					S(N(u), {
						size: "sm",
						disabled: C.value || T.value,
						onClick: o[1] ||= (e) => D.value = !0
					}, {
						icon: R(() => [S(N(h), {
							name: "search",
							size: 14
						})]),
						default: R(() => [o[30] ||= x("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					V.value ? v("", !0) : (O(), _(N(u), {
						key: 1,
						size: "sm",
						disabled: C.value || T.value || w.value || L.value,
						onClick: Ee
					}, {
						icon: R(() => [S(N(h), {
							name: "save",
							size: 14
						})]),
						default: R(() => [o[31] ||= x("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					N(X) ? (O(), y("span", zn, M(N(X)), 1)) : v("", !0),
					!V.value && N(Y) ? (O(), y("span", Bn, "还有 " + M(N(Y)) + " 项待完善", 1)) : v("", !0),
					!V.value && B.value ? (O(), _(N(u), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: C.value || T.value || L.value,
						loading: w.value,
						onClick: o[2] ||= (e) => Oe(W.scheduled_local ? "scheduled" : "published")
					}, {
						icon: R(() => [S(N(h), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: R(() => [x(M(W.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : v("", !0)
				])
			]),
			C.value ? (O(), y("div", Vn, [S(N(h), {
				name: "loader-circle",
				class: "announcement-spin",
				size: 28
			}), o[32] ||= b("span", null, "正在读取公告资料...", -1)])) : T.value ? (O(), y("div", Hn, [S(N(l), {
				type: "error",
				description: E.value,
				closable: !1
			}, null, 8, ["description"]), S(N(u), { onClick: Ce }, {
				default: R(() => [...o[33] ||= [x("重新加载", -1)]]),
				_: 1
			})])) : (O(), y(se, { key: 2 }, [E.value ? (O(), y("div", Un, [S(N(l), {
				type: "error",
				description: E.value,
				closable: !1
			}, null, 8, ["description"])])) : v("", !0), b("div", Wn, [b("aside", Gn, [S(N(ee), {
				model: W,
				rules: N(q),
				"label-position": "top",
				onSubmit: o[13] ||= pe(() => {}, ["prevent"])
			}, {
				default: R(() => [
					S(N(i), {
						label: "公告分类",
						prop: "category_id",
						error: N(J).category_id,
						required: ""
					}, {
						default: R(() => [S(N(r), {
							modelValue: W.category_id,
							"onUpdate:modelValue": o[3] ||= (e) => W.category_id = e,
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
					o[34] ||= b("h3", null, "公告设置", -1),
					S(N(i), {
						label: "公告封面",
						prop: "cover_url",
						error: N(J).cover_url
					}, {
						default: R(() => [S(Le, {
							modelValue: W.cover_url,
							"onUpdate:modelValue": o[4] ||= (e) => W.cover_url = e,
							label: "公告封面",
							disabled: U.value,
							upload: N(ie),
							onBusyChange: o[5] ||= (e) => L.value = e,
							onStart: o[6] ||= (e) => E.value = "",
							onError: ke
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "内容来源",
						prop: "content_source",
						error: N(J).content_source
					}, {
						default: R(() => [S(N(m), {
							modelValue: W.content_source,
							"onUpdate:modelValue": o[7] ||= (e) => W.content_source = e,
							maxlength: 160,
							disabled: U.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "作者署名",
						prop: "author_name",
						error: N(J).author_name
					}, {
						default: R(() => [S(N(m), {
							modelValue: W.author_name,
							"onUpdate:modelValue": o[8] ||= (e) => W.author_name = e,
							maxlength: 120,
							disabled: U.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "前端排序",
						prop: "sort_order",
						error: N(J).sort_order
					}, {
						default: R(() => [S(N(t), {
							modelValue: W.sort_order,
							"onUpdate:modelValue": o[9] ||= (e) => W.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: U.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[35] ||= b("h3", null, "发布设置", -1),
					S(N(i), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: N(J).helpful_enabled
					}, {
						default: R(() => [S(It, {
							modelValue: W.helpful_enabled,
							"onUpdate:modelValue": o[10] ||= (e) => W.helpful_enabled = e,
							disabled: U.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "启用状态",
						prop: "is_enabled",
						error: N(J).is_enabled
					}, {
						default: R(() => [S(It, {
							modelValue: W.is_enabled,
							"onUpdate:modelValue": o[11] ||= (e) => W.is_enabled = e,
							disabled: U.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: N(J).scheduled_local
					}, {
						default: R(() => [S(N(m), {
							modelValue: W.scheduled_local,
							"onUpdate:modelValue": o[12] ||= (e) => W.scheduled_local = e,
							type: "datetime-local",
							disabled: U.value || !B.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[36] ||= b("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), b("main", Kn, [S(N(ee), {
				model: W,
				rules: N(q),
				"label-position": "top",
				onSubmit: o[17] ||= pe(() => {}, ["prevent"])
			}, {
				default: R(() => [
					S(N(i), {
						label: "标题",
						prop: "title",
						error: N(J).title,
						required: ""
					}, {
						default: R(() => [S(N(m), {
							modelValue: W.title,
							"onUpdate:modelValue": o[14] ||= (e) => W.title = e,
							maxlength: 255,
							disabled: U.value,
							placeholder: "输入公告标题",
							"aria-label": "公告标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "摘要",
						prop: "summary",
						error: N(J).summary
					}, {
						default: R(() => [z(b("textarea", {
							"onUpdate:modelValue": o[15] ||= (e) => W.summary = e,
							"aria-invalid": !!N(J).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: U.value,
							"aria-label": "公告摘要"
						}, null, 8, qn), [[F, W.summary]])]),
						_: 1
					}, 8, ["error"]),
					S(N(i), {
						label: "正文",
						prop: "body_html",
						error: N(J).body_html
					}, {
						default: R(() => [S(N(e), {
							modelValue: W.body_html,
							"onUpdate:modelValue": o[16] ||= (e) => W.body_html = e,
							readonly: V.value,
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
			S(N(f), {
				modelValue: D.value,
				"onUpdate:modelValue": o[21] ||= (e) => D.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: R(() => [S(N(u), {
					variant: "primary",
					onClick: o[20] ||= (e) => D.value = !1
				}, {
					default: R(() => [...o[37] ||= [x("确定", -1)]]),
					_: 1
				})]),
				default: R(() => [S(N(ee), {
					model: W,
					rules: N(q),
					"label-position": "top",
					onSubmit: o[19] ||= pe(() => {}, ["prevent"])
				}, {
					default: R(() => [S(N(i), {
						label: "SEO 描述",
						prop: "seo_description",
						error: N(J).seo_description
					}, {
						default: R(() => [z(b("textarea", {
							ref_key: "seoInput",
							ref: K,
							"onUpdate:modelValue": o[18] ||= (e) => W.seo_description = e,
							"aria-invalid": !!N(J).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: U.value,
							"aria-label": "SEO 描述"
						}, null, 8, Jn), [[F, W.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			S(N(f), {
				modelValue: A.value,
				"onUpdate:modelValue": o[23] ||= (e) => A.value = e,
				title: "确认删除",
				subtitle: `操作对象：${W.title || "未命名公告"}`,
				width: "460px",
				"panel-class": "announcement-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !w.value
			}, {
				"header-actions": R(() => [b("span", Yn, [S(N(h), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: R(() => [S(N(u), {
					disabled: w.value,
					onClick: o[22] ||= (e) => A.value = !1
				}, {
					default: R(() => [...o[38] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(u), {
					variant: "warning",
					loading: w.value,
					onClick: ge
				}, {
					default: R(() => [...o[39] ||= [x("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: R(() => [S(N(l), {
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
			S(N(f), {
				modelValue: ue.value,
				"onUpdate:modelValue": o[26] ||= (e) => ue.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: R(() => [S(N(u), { onClick: o[24] ||= (e) => ue.value = !1 }, {
					default: R(() => [...o[40] ||= [x("继续编辑", -1)]]),
					_: 1
				}), S(N(u), {
					variant: "primary",
					onClick: o[25] ||= (e) => p("close")
				}, {
					default: R(() => [...o[41] ||= [x("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			S(N(f), {
				modelValue: fe.value,
				"onUpdate:modelValue": o[28] ||= (e) => fe.value = e,
				title: "将公告转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: R(() => [S(N(u), { onClick: o[27] ||= (e) => fe.value = !1 }, {
					default: R(() => [...o[42] ||= [x("取消", -1)]]),
					_: 1
				}), S(N(u), {
					variant: "primary",
					onClick: De
				}, {
					default: R(() => [...o[43] ||= [x("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Fn));
	}
}), [["__scopeId", "data-v-525a2f73"]]), Zn = { class: "announcement-articles" }, Qn = /*#__PURE__*/ p(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = H(), { formatDateTime: n } = H(), { announcementPublishStates: r, announcementCategoryLabel: i, getAnnouncementList: a, getAnnouncementMetadata: o } = Dn(), s = k(!1), c = k(), l = (e) => t([`cms_announcement:${e}`]), d = k(), f = ge(o, (e) => {
			d.value = e;
		}), ee = [
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
		], { proTableBindings: te, reload: ae, filters: oe } = ne({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: g(() => [
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
		f.bindFilters(oe);
		let p = new AbortController();
		async function m() {
			try {
				d.value = await o(p.signal);
			} catch {}
		}
		function se(e) {
			c.value = e, s.value = !0;
		}
		function b() {
			s.value = !1, ae(), m();
		}
		return le(m), ce(() => p.abort()), (e, t) => (O(), y("div", Zn, [s.value ? (O(), _(Xn, {
			key: 0,
			"article-id": c.value,
			onClose: t[0] ||= (e) => s.value = !1,
			onSaved: b
		}, null, 8, ["article-id"])) : v("", !0), z(S(N(re), T(N(te), {
			"auto-refreshable": !1,
			columns: ee,
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
			"cell-cms_source_type": R(({ row: e }) => [S(U, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": R(() => [l("add") ? (O(), _(N(u), {
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
			"cell-actions": R(({ row: e }) => [S(N(u), {
				size: "sm",
				"icon-only": "",
				title: l("edit") ? "编辑公告" : "公告详情",
				"aria-label": l("edit") ? "编辑公告" : "公告详情",
				onClick: (t) => se(e.id)
			}, {
				default: R(() => [S(N(h), {
					name: l("edit") ? "square-pen" : "panel-right-open",
					size: 15
				}, null, 8, ["name"])]),
				_: 1
			}, 8, [
				"title",
				"aria-label",
				"onClick"
			])]),
			_: 1
		}, 16), [[I, !s.value]])]));
	}
}), [["__scopeId", "data-v-9f055b06"]]);
//#endregion
//#region src/cms/api/content/translations.ts
function $n() {
	let e = H().request, t = "/cms/translations";
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
		saveTranslationSettings: (n) => e.post({
			url: `${t}/saveSettings`,
			params: n
		}, { isOpenRetry: !1 }),
		testTranslationConnection: (n) => e.post({
			url: `${t}/testConnection`,
			params: { space_id: n }
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
}, ti = { class: "config-service" }, ni = { key: 0 }, ri = { class: "config-grid" }, ii = { class: "job-confirm" }, ai = /*#__PURE__*/ p(/* @__PURE__ */ C({
	__name: "index",
	setup(e) {
		let { cancelTranslationJob: n, createTranslationJob: d, getTranslationDetail: ne, getTranslationJob: re, getTranslationList: oe, getTranslationMetadata: p, getTranslationSettings: C, saveTranslations: w, saveTranslationSettings: T, testTranslationConnection: ue } = $n(), { hasPermission: de } = H(), A = k(), j = k(""), P = k("news:content"), I = k([]), L = k(), pe = k(""), V = k("title"), he = k(""), ge = k(""), U = k(1), W = k(0), G = k({}), K = k(!1), q = k(!1), J = k(!1), Y = k(!1), X = k(""), _e = k(""), ve = k(), Z = k(null), ye = k(!1), Q = k(!1), $ = k(), be = k(""), xe = k(!1), Se = k(!1), Ce = k(!1), we = k("field"), Te = k([]), Ee = k(""), De = k(!1), Oe = k(!1), ke, Ae, je, Me, Ne, Pe = new AbortController(), Fe, Ie = "", Le = g(() => de(["cms_translation:edit"])), Re = g(() => de(["cms_translation:config"])), ze = g(() => de(["cms_translation:translate"])), Be = g(() => Y.value || xe.value || De.value), Ve = g(() => nr(L.value, G.value).length > 0), He = g(() => er(A.value?.done || 0, A.value?.total || 0)), Ue = g(() => ({
			space_id: j.value,
			module: P.value.split(":")[0],
			kind: P.value.endsWith(":category") ? "category" : "content"
		})), We = g(() => A.value?.spaces.map((e) => ({
			label: e.label + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		})) || []), Ge = g(() => A.value?.locales.filter((e) => e.code !== A.value?.source_locale) || []), Ke = g(() => Ge.value.map((e) => ({
			label: `${e.flag} ${e.label}`,
			value: e.code
		}))), qe = g(() => Ke.value.filter((e) => et(String(e.value)))), Je = g(() => A.value?.locales.find((e) => e.code === A.value?.source_locale)?.label || A.value?.source_locale || "简体中文"), Ye = g(() => L.value?.fields.find((e) => e.key === V.value)), Xe = g(() => {
			let e = A.value?.modules.find((e) => e.key === P.value);
			return e?.kind === "category" ? `${A.value?.modules.find((t) => t.module === e.module && t.kind === "content")?.label || ""}分类` : e?.label || "新闻";
		}), Ze = g(() => {
			let e = [];
			for (let t of A.value?.modules || []) {
				let n = e.find((e) => e[0].module === t.module);
				n ? n.push(t) : e.push([t]);
			}
			return e;
		}), Qe = g(() => !!j.value && A.value?.space_enabled && !!A.value.target_locales.length && !ar(Z.value) && !Be.value && !Ve.value && !K.value && !q.value), $e = g(() => Z.value ? er([
			"succeeded",
			"skipped",
			"cancelled"
		].reduce((e, t) => e + (Z.value?.counts[t] || 0), 0) + (ar(Z.value) ? 0 : Z.value.counts.failed || 0), Z.value.total) : 0), et = (e) => A.value?.target_locales.includes(e) ?? !1, tt = (e) => A.value?.locales.find((t) => t.code === e), nt = (e) => ({
			news: "file-text",
			academy: "landmark",
			help: "info",
			announcement: "megaphone"
		})[e] || "info";
		function rt(e) {
			Be.value || (Ve.value ? (ke = e, Oe.value = !0) : e());
		}
		function it() {
			let e = ke;
			ke = void 0, Oe.value = !1, G.value = L.value ? rr(L.value) : {}, e?.();
		}
		function at() {
			Oe.value = !1, ke = void 0, Ne?.(!1), Ne = void 0;
		}
		function ot(e) {
			e !== j.value && rt(() => {
				j.value = e, he.value = "", ge.value = "", U.value = 1, Z.value = null, dt();
			});
		}
		function st(e) {
			e.available && P.value !== e.key && rt(() => {
				P.value = e.key, he.value = "", ge.value = "", U.value = 1, pt();
			});
		}
		function ct(e) {
			rt(() => {
				U.value = e, pt();
			});
		}
		function lt() {
			rt(() => {
				ge.value = he.value.trim(), U.value = 1, pt();
			});
		}
		function ut(e) {
			e !== pe.value && rt(() => {
				mt(e);
			});
		}
		async function dt() {
			Me?.abort();
			let e = Me = new AbortController();
			K.value = !0, X.value = "";
			try {
				let t = await p(j.value || void 0, e.signal);
				if (e.signal.aborted) return;
				A.value = t, j.value = t.space_id || "", await pt(), Ct();
			} catch (t) {
				e.signal.aborted || (X.value = cr(t));
			} finally {
				e.signal.aborted || (K.value = !1);
			}
		}
		async function ft() {
			let e = j.value;
			if (e) try {
				let t = await p(e, Pe.signal);
				e === j.value && (A.value = t);
			} catch {}
		}
		async function pt() {
			Ae?.abort(), je?.abort();
			let e = Ae = new AbortController();
			if (q.value = !0, J.value = !1, L.value = void 0, pe.value = "", G.value = {}, X.value = "", !j.value) {
				I.value = [], W.value = 0, q.value = !1;
				return;
			}
			let t = { ...Ue.value };
			try {
				let n = await oe(t, ge.value, U.value, e.signal);
				if (e.signal.aborted) return;
				I.value = n.lists, W.value = n.count, I.value[0] && await mt(I.value[0].id);
			} catch (t) {
				e.signal.aborted || (I.value = [], W.value = 0, X.value = cr(t));
			} finally {
				e.signal.aborted || (q.value = !1);
			}
		}
		async function mt(e) {
			je?.abort();
			let t = je = new AbortController();
			J.value = !0, pe.value = e, L.value = void 0, G.value = {}, X.value = "";
			try {
				let n = await ne({ ...Ue.value }, e, t.signal);
				if (t.signal.aborted) return;
				L.value = n, G.value = rr(n), n.fields.some((e) => e.key === V.value) || (V.value = n.fields[0]?.key || ""), ve.value?.scrollTo({ top: 0 });
			} catch (e) {
				t.signal.aborted || (X.value = cr(e));
			} finally {
				t.signal.aborted || (J.value = !1);
			}
		}
		async function ht() {
			if (!L.value || !Le.value || Be.value) return;
			let e = nr(L.value, G.value);
			if (e.length) {
				if (e.some((e) => !e.text.trim())) {
					X.value = "译文不能为空；未翻译的语言请保持未填写。";
					return;
				}
				Y.value = !0, X.value = "";
				try {
					let t = await w({ ...Ue.value }, L.value.id, e);
					L.value = t, G.value = rr(t);
					let n = I.value.findIndex((e) => e.id === t.id);
					n >= 0 && (I.value[n] = t), ae.success("翻译已保存"), ft();
				} catch (e) {
					X.value = cr(e);
				} finally {
					Y.value = !1;
				}
			}
		}
		async function gt(e) {
			_e.value = e, await E();
			let t = ve.value?.querySelector(`[data-locale="${e}"]`);
			t?.scrollIntoView({
				block: "nearest",
				behavior: "smooth"
			}), t?.querySelector("textarea")?.focus();
		}
		async function _t() {
			if (!(!Re.value || !j.value)) {
				ye.value = !0, Q.value = !0, be.value = "", $.value = void 0;
				try {
					$.value = await C(j.value, Pe.signal);
				} catch (e) {
					be.value = cr(e);
				} finally {
					Q.value = !1;
				}
			}
		}
		async function vt() {
			if (!(!$.value || xe.value)) {
				if (Ve.value) {
					be.value = "请先保存或放弃当前译文修改，再修改配置。";
					return;
				}
				xe.value = !0, be.value = "";
				try {
					await T($.value), ye.value = !1, ae.success("翻译配置已保存"), await dt();
				} catch (e) {
					be.value = cr(e);
				} finally {
					xe.value = !1;
				}
			}
		}
		async function yt() {
			if (j.value) {
				Se.value = !0, be.value = "";
				try {
					await ue(j.value), ae.success("Google Translate 连接成功");
				} catch (e) {
					be.value = cr(e);
				} finally {
					Se.value = !1;
				}
			}
		}
		function bt(e) {
			we.value = e, Te.value = [...A.value?.target_locales || []], Ee.value = "", Ie = crypto.randomUUID(), Ce.value = !0;
		}
		async function xt() {
			if (!(!Te.value.length || De.value)) {
				De.value = !0, Ee.value = "";
				try {
					let e = await d({ ...Ue.value }, {
						request_key: Ie,
						target_locales: Te.value,
						...we.value === "field" ? {
							id: pe.value,
							field_name: V.value
						} : { keyword: ge.value }
					});
					Z.value = e.job, Ce.value = !1, ae.success("翻译任务已提交"), St();
				} catch (e) {
					Ee.value = cr(e);
				} finally {
					De.value = !1;
				}
			}
		}
		function St() {
			clearTimeout(Fe), ar(Z.value) && (Fe = setTimeout(() => {
				Ct();
			}, 3e3));
		}
		async function Ct() {
			let e = j.value;
			if (!e || Pe.signal.aborted) return;
			let t = ar(Z.value);
			try {
				let n = await re(e, Pe.signal);
				if (e !== j.value) return;
				Z.value = n.job, t && !ar(Z.value) && (await ft(), !Ve.value && !Be.value && pe.value && await mt(pe.value));
			} catch {}
			St();
		}
		async function wt() {
			if (Z.value) try {
				let e = await n(j.value, Z.value.id);
				Z.value = e.job, clearTimeout(Fe), ft();
			} catch (e) {
				X.value = cr(e);
			}
		}
		function Tt(e) {
			(Ve.value || Be.value) && (e.preventDefault(), e.returnValue = "");
		}
		return me(() => !Ve.value && !Be.value || !Be.value && new Promise((e) => {
			Ne?.(!1), Ne = e, ke = () => {
				Ne = void 0, e(!0);
			}, Oe.value = !0;
		})), le(() => {
			window.addEventListener("beforeunload", Tt), dt();
		}), ce(() => {
			Ne?.(!1), Pe.abort(), Ae?.abort(), je?.abort(), Me?.abort(), clearTimeout(Fe), window.removeEventListener("beforeunload", Tt);
		}), (e, n) => (O(), y("section", {
			class: "translations-page",
			"aria-label": "多语言翻译管理",
			"aria-busy": K.value
		}, [
			b("header", ur, [b("div", dr, [b("span", fr, [S(N(h), {
				name: "globe",
				size: 21
			})]), b("div", null, [n[20] ||= b("h1", null, "语言翻译管理", -1), b("div", pr, [
				b("strong", null, M(He.value) + "%", 1),
				S(N(o), {
					percentage: He.value,
					"show-text": !1,
					"stroke-width": 4,
					"aria-label": "全部翻译完成度"
				}, null, 8, ["percentage"]),
				b("span", null, M(A.value?.done.toLocaleString() || 0) + " / " + M(A.value?.total.toLocaleString() || 0) + " 个目标字段", 1)
			])])]), b("div", mr, [
				S(N(r), {
					"model-value": j.value,
					options: We.value,
					size: "sm",
					disabled: K.value || Be.value,
					placeholder: "内容空间",
					"aria-label": "内容空间",
					"onUpdate:modelValue": n[0] ||= (e) => ot(String(e))
				}, null, 8, [
					"model-value",
					"options",
					"disabled"
				]),
				b("span", hr, [n[21] ||= x("内容源语言 ", -1), b("b", null, M(Je.value), 1)]),
				Re.value ? (O(), _(N(u), {
					key: 0,
					size: "sm",
					disabled: !j.value || Be.value,
					onClick: _t
				}, {
					icon: R(() => [S(N(h), {
						name: "sliders-horizontal",
						size: 14
					})]),
					default: R(() => [n[22] ||= x("翻译配置", -1)]),
					_: 1
				}, 8, ["disabled"])) : v("", !0),
				ze.value ? (O(), _(N(u), {
					key: 1,
					size: "sm",
					disabled: !Qe.value,
					onClick: n[1] ||= (e) => bt("batch")
				}, {
					icon: R(() => [S(N(h), {
						name: "rocket",
						size: 14
					})]),
					default: R(() => [n[23] ||= x("批量翻译", -1)]),
					_: 1
				}, 8, ["disabled"])) : v("", !0),
				ze.value ? (O(), _(N(u), {
					key: 2,
					size: "sm",
					disabled: !Qe.value || !L.value || !Ye.value?.translatable,
					onClick: n[2] ||= (e) => bt("field")
				}, {
					icon: R(() => [S(N(h), {
						name: "globe",
						size: 14
					})]),
					default: R(() => [n[24] ||= x("翻译当前字段", -1)]),
					_: 1
				}, 8, ["disabled"])) : v("", !0),
				Le.value ? (O(), _(N(u), {
					key: 3,
					size: "sm",
					variant: "primary",
					loading: Y.value,
					disabled: !Ve.value || Be.value || !A.value?.space_enabled,
					onClick: ht
				}, {
					icon: R(() => [S(N(h), {
						name: "save",
						size: 14
					})]),
					default: R(() => [n[25] ||= x("保存翻译", -1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : v("", !0)
			])]),
			X.value ? (O(), _(N(l), {
				key: 0,
				type: "error",
				closable: !0,
				onClose: n[3] ||= (e) => X.value = ""
			}, {
				default: R(() => [x(M(X.value), 1)]),
				_: 1
			})) : v("", !0),
			A.value && !A.value.space_enabled && j.value ? (O(), _(N(l), {
				key: 1,
				type: "warning"
			}, {
				default: R(() => [...n[26] ||= [x("当前内容空间已停用，仅可查看翻译。", -1)]]),
				_: 1
			})) : v("", !0),
			A.value && !A.value.target_locales.length && j.value ? (O(), _(N(l), {
				key: 2,
				type: "info"
			}, {
				default: R(() => [...n[27] ||= [x("尚未启用目标语言，请在“翻译配置”中选择语言后开始翻译。", -1)]]),
				_: 1
			})) : v("", !0),
			Z.value ? (O(), y("div", gr, [
				S(N(h), {
					name: N(ar)(Z.value) ? "loader-circle" : "info",
					size: 15
				}, null, 8, ["name"]),
				b("strong", null, M(N(or)[Z.value.status] || Z.value.status), 1),
				b("span", null, "任务 #" + M(Z.value.id), 1),
				S(N(o), {
					percentage: $e.value,
					"show-text": !1,
					"stroke-width": 4
				}, null, 8, ["percentage"]),
				b("span", null, [
					x(M(Z.value.counts.succeeded || 0) + " / " + M(Z.value.total) + " 已完成", 1),
					Z.value.counts.failed ? (O(), y("span", _r, " · " + M(Z.value.counts.failed) + " 失败", 1)) : v("", !0),
					Z.value.counts.skipped ? (O(), y("span", vr, " · " + M(Z.value.counts.skipped) + " 冲突跳过", 1)) : v("", !0)
				]),
				N(ar)(Z.value) && ze.value ? (O(), _(N(u), {
					key: 0,
					size: "sm",
					variant: "text",
					disabled: Be.value,
					onClick: wt
				}, {
					default: R(() => [...n[28] ||= [x("取消任务", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (O(), _(N(u), {
					key: 1,
					size: "sm",
					variant: "text",
					onClick: n[4] ||= (e) => Z.value = null
				}, {
					default: R(() => [...n[29] ||= [x("收起", -1)]]),
					_: 1
				})),
				Z.value.errors.length ? (O(), y("span", {
					key: 2,
					class: "translation-job__error",
					title: Z.value.errors.map((e) => `${e.target_locale}: ${e.error_code}`).join("；")
				}, M(Z.value.errors[0].error_code) + "（可重新提交补翻）", 9, yr)) : v("", !0)
			])) : v("", !0),
			b("div", br, [(O(!0), y(se, null, fe(Ge.value, (e) => (O(), y("button", {
				key: e.code,
				type: "button",
				class: D(["language-card", {
					"is-active": _e.value === e.code,
					"is-disabled": !et(e.code)
				}]),
				disabled: !et(e.code),
				title: et(e.code) ? `${e.native}：${e.done} / ${e.total}` : "请在翻译配置中启用",
				onClick: (t) => gt(e.code)
			}, [
				b("span", null, M(e.flag), 1),
				b("span", null, M(e.label), 1),
				b("strong", null, M(et(e.code) ? N(er)(e.done, e.total) + "%" : "未启用"), 1),
				S(N(o), {
					percentage: N(er)(e.done, e.total),
					"show-text": !1,
					"stroke-width": 2
				}, null, 8, ["percentage"])
			], 10, xr))), 128))]),
			b("nav", Sr, [(O(!0), y(se, null, fe(Ze.value, (e) => (O(), y("div", {
				key: e[0].module,
				class: "module-group"
			}, [(O(!0), y(se, null, fe(e, (e) => (O(), _(N(u), {
				key: e.key,
				variant: P.value === e.key ? "primary" : "text",
				plain: P.value === e.key,
				size: "sm",
				disabled: !e.available || Be.value,
				title: e.reason,
				"aria-pressed": P.value === e.key,
				onClick: (t) => st(e)
			}, {
				default: R(() => [
					e.kind === "category" ? v("", !0) : (O(), _(N(h), {
						key: 0,
						name: nt(e.module),
						size: 14
					}, null, 8, ["name"])),
					x(M(e.label), 1),
					b("span", Cr, M(e.count), 1)
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
			b("main", wr, [b("aside", Tr, [
				b("div", Er, [b("div", null, [b("strong", null, M(Xe.value), 1), b("span", null, M(W.value) + " 条" + M(Ue.value.kind === "category" ? "分类" : "内容"), 1)]), S(N(m), {
					modelValue: he.value,
					"onUpdate:modelValue": n[5] ||= (e) => he.value = e,
					size: "sm",
					clearable: "",
					placeholder: "搜索内容",
					"aria-label": "搜索内容",
					onKeydown: B(lt, ["enter"])
				}, {
					prefix: R(() => [S(N(h), {
						name: "search",
						size: 14
					})]),
					_: 1
				}, 8, ["modelValue"])]),
				b("div", {
					class: "content-browser__list",
					"aria-busy": q.value
				}, [q.value ? (O(), y("p", Or, "加载内容中…")) : (O(), y(se, { key: 1 }, [(O(!0), y(se, null, fe(I.value, (e) => (O(), y("button", {
					key: e.id,
					type: "button",
					class: D(["content-item", { "is-selected": pe.value === e.id }]),
					"aria-current": pe.value === e.id ? "true" : void 0,
					disabled: Be.value,
					onClick: (t) => ut(e.id)
				}, [b("span", Ar, [b("strong", { title: e.title }, M(e.title), 9, jr), b("small", null, M(N(sr)[e.publish_status || ""] || "分类") + " · " + M(e.done) + "/" + M(e.total), 1)]), S(N(o), {
					type: "circle",
					percentage: N(er)(e.done, e.total),
					"show-text": !1,
					size: 16,
					"stroke-width": 2,
					status: e.total && e.done === e.total ? "success" : "warning"
				}, null, 8, ["percentage", "status"])], 10, kr))), 128)), I.value.length ? v("", !0) : (O(), y("p", Mr, M(ge.value ? "没有匹配的内容" : "暂无可翻译内容"), 1))], 64))], 8, Dr),
				b("footer", Nr, [
					S(N(u), {
						size: "sm",
						"icon-only": "",
						"aria-label": "上一页",
						disabled: U.value <= 1 || q.value || Be.value,
						onClick: n[6] ||= (e) => ct(U.value - 1)
					}, {
						default: R(() => [S(N(h), {
							name: "chevron-left",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"]),
					b("span", null, M(U.value) + " / " + M(Math.max(1, Math.ceil(W.value / 30))), 1),
					S(N(u), {
						size: "sm",
						"icon-only": "",
						"aria-label": "下一页",
						disabled: U.value * 30 >= W.value || q.value || Be.value,
						onClick: n[7] ||= (e) => ct(U.value + 1)
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
				"aria-busy": J.value
			}, [J.value ? (O(), y("div", Fr, [S(N(h), {
				name: "loader-circle",
				size: 28
			}), n[30] ||= b("p", null, "加载译文中…", -1)])) : L.value ? (O(), y(se, { key: 1 }, [b("header", Ir, [b("div", Lr, [b("span", null, [x(M(Xe.value) + " ", 1), Ve.value ? (O(), y("em", Rr, "有未保存修改")) : v("", !0)]), b("h2", { title: L.value.title }, M(L.value.title), 9, zr)]), S(N(s), {
				modelValue: V.value,
				"onUpdate:modelValue": n[8] ||= (e) => V.value = e
			}, {
				default: R(() => [(O(!0), y(se, null, fe(L.value.fields, (e) => (O(), _(N(c), {
					key: e.key,
					name: e.key,
					label: `${e.label} ${e.translatable ? N(ir)(e) + "/" + e.translations.length : "—"}`
				}, null, 8, ["name", "label"]))), 128))]),
				_: 1
			}, 8, ["modelValue"])]), Ye.value ? (O(), y("div", {
				key: 0,
				class: "translation-editor__body",
				ref_key: "editorBody",
				ref: ve
			}, [
				b("section", Br, [b("div", Vr, [b("strong", null, [x(M(Je.value) + " ", 1), S(N(ie), {
					size: "sm",
					type: "primary",
					effect: "soft"
				}, {
					default: R(() => [...n[31] ||= [x("内容源语言", -1)]]),
					_: 1
				})]), n[32] ||= b("span", null, "只读原文", -1)]), b("textarea", {
					value: Ye.value.source,
					readonly: "",
					rows: Ye.value.key === "body_html" ? 5 : 2,
					class: "translation-textarea source-textarea",
					"aria-label": `原文${Ye.value.label}`
				}, null, 8, Hr)]),
				b("div", Ur, [n[33] ||= b("strong", null, "目标语言", -1), b("span", null, M(L.value.fields.find((e) => e.key === V.value)?.translations.length || 0) + " 种语言 · 手工修改后请保存", 1)]),
				Ye.value.translatable ? Ye.value.translations.length ? (O(), y("div", {
					key: 2,
					class: D(["target-grid", { "is-body": V.value === "body_html" }])
				}, [(O(!0), y(se, null, fe(Ye.value.translations, (e) => (O(), y("div", {
					key: e.locale,
					class: D(["target-field", { "is-focused": _e.value === e.locale }]),
					"data-locale": e.locale
				}, [
					b("div", qr, [b("label", { for: `translation-${V.value}-${e.locale}` }, [x(M(tt(e.locale)?.native || e.locale) + " ", 1), b("small", null, M(e.locale), 1)], 8, Jr), e.status === "stale" ? (O(), y("span", Yr, "原文已更新")) : e.status === "ready" ? (O(), y("span", Xr, M(e.method === "machine" ? "机器翻译" : "已保存"), 1)) : v("", !0)]),
					z(b("textarea", {
						id: `translation-${V.value}-${e.locale}`,
						"onUpdate:modelValue": (t) => G.value[N(tr)(V.value, e.locale)] = t,
						class: "translation-textarea",
						rows: V.value === "body_html" ? 10 : 2,
						maxlength: Ye.value.max_length,
						disabled: !Le.value || !A.value?.space_enabled || Be.value,
						dir: e.locale === "ar" ? "rtl" : "auto",
						placeholder: `请输入${tt(e.locale)?.native || e.locale}翻译${V.value === "body_html" ? "（HTML）" : ""}`
					}, null, 8, Zr), [[F, G.value[N(tr)(V.value, e.locale)]]]),
					b("div", Qr, M((G.value[N(tr)(V.value, e.locale)] || "").length.toLocaleString()) + " / " + M(Ye.value.max_length.toLocaleString()), 1)
				], 10, Kr))), 128))], 2)) : (O(), y("div", Gr, " 请先在“翻译配置”中启用目标语言。 ")) : (O(), y("div", Wr, [S(N(h), {
					name: "info",
					size: 18
				}), n[34] ||= x("原文字段为空，不参与翻译和完成度统计。 ", -1)]))
			], 512)) : v("", !0)], 64)) : (O(), y("div", $r, [S(N(a), { description: X.value ? "内容加载失败，可点击刷新重试" : "选择左侧内容开始翻译" }, null, 8, ["description"]), X.value ? (O(), _(N(u), {
				key: 0,
				size: "sm",
				onClick: dt
			}, {
				default: R(() => [...n[35] ||= [x("重新加载", -1)]]),
				_: 1
			})) : v("", !0)]))], 8, Pr)]),
			S(N(f), {
				modelValue: ye.value,
				"onUpdate:modelValue": n[15] ||= (e) => ye.value = e,
				title: "翻译配置",
				subtitle: "当前内容空间共用 · Google Cloud Translation Basic v2",
				width: "560px",
				"close-on-click-modal": !1,
				"before-close": () => !xe.value
			}, {
				footer: R(() => [
					S(N(u), {
						size: "sm",
						loading: Se.value,
						disabled: !$.value?.credential_configured || xe.value || Q.value,
						onClick: yt
					}, {
						default: R(() => [...n[39] ||= [x("测试连接", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"]),
					n[42] ||= b("span", { class: "footer-spacer" }, null, -1),
					S(N(u), {
						size: "sm",
						disabled: xe.value,
						onClick: n[14] ||= (e) => ye.value = !1
					}, {
						default: R(() => [...n[40] ||= [x("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					S(N(u), {
						size: "sm",
						variant: "primary",
						loading: xe.value,
						disabled: !$.value || Q.value || Se.value,
						onClick: vt
					}, {
						default: R(() => [...n[41] ||= [x("保存配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])
				]),
				default: R(() => [be.value ? (O(), _(N(l), {
					key: 0,
					type: "error"
				}, {
					default: R(() => [x(M(be.value), 1)]),
					_: 1
				})) : v("", !0), Q.value ? (O(), y("div", ei, "加载配置中…")) : $.value ? (O(), _(N(ee), {
					key: 2,
					model: $.value,
					class: "translation-config",
					"label-position": "top"
				}, {
					default: R(() => [
						S(N(i), { label: "目标语言" }, {
							default: R(() => [S(N(r), {
								modelValue: $.value.target_locales,
								"onUpdate:modelValue": n[9] ||= (e) => $.value.target_locales = e,
								options: Ke.value,
								multiple: "",
								filterable: "",
								"max-tag-count": 4,
								placeholder: "选择需要维护的目标语言",
								disabled: xe.value
							}, null, 8, [
								"modelValue",
								"options",
								"disabled"
							])]),
							_: 1
						}),
						S(N(i), { label: "Google Translate" }, {
							default: R(() => [b("div", ti, [n[37] ||= b("strong", null, "Google Cloud Translation · Basic v2", -1), S(N(te), {
								modelValue: $.value.is_enabled,
								"onUpdate:modelValue": n[10] ||= (e) => $.value.is_enabled = e,
								disabled: xe.value || !$.value.credential_configured
							}, {
								default: R(() => [...n[36] ||= [x("开启自动翻译", -1)]]),
								_: 1
							}, 8, ["modelValue", "disabled"])])]),
							_: 1
						}),
						S(N(i), { label: "服务端密钥引用" }, {
							default: R(() => [S(N(m), {
								"model-value": $.value.credential_ref,
								readonly: ""
							}, null, 8, ["model-value"]), $.value.credential_configured ? v("", !0) : (O(), y("small", ni, "服务端尚未配置 GOOGLE_TRANSLATE_API_KEY，人工翻译仍可正常使用。"))]),
							_: 1
						}),
						b("div", ri, [
							S(N(i), { label: "并发上限" }, {
								default: R(() => [S(N(t), {
									modelValue: $.value.concurrency_limit,
									"onUpdate:modelValue": n[11] ||= (e) => $.value.concurrency_limit = e,
									min: 1,
									max: 20,
									disabled: xe.value
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}),
							S(N(i), { label: "请求超时（秒）" }, {
								default: R(() => [S(N(t), {
									modelValue: $.value.request_timeout_seconds,
									"onUpdate:modelValue": n[12] ||= (e) => $.value.request_timeout_seconds = e,
									min: 1,
									max: 120,
									disabled: xe.value
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}),
							S(N(i), { label: "最大尝试次数" }, {
								default: R(() => [S(N(t), {
									modelValue: $.value.max_attempts,
									"onUpdate:modelValue": n[13] ||= (e) => $.value.max_attempts = e,
									min: 1,
									max: 10,
									disabled: xe.value
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})
						]),
						$.value.supported ? v("", !0) : (O(), _(N(l), {
							key: 0,
							type: "warning"
						}, {
							default: R(() => [...n[38] ||= [x("当前空间关联了其他版本的翻译配置。保存将为该空间创建独立的 Google v2 配置，不修改其他空间。", -1)]]),
							_: 1
						}))
					]),
					_: 1
				}, 8, ["model"])) : v("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			S(N(f), {
				modelValue: Ce.value,
				"onUpdate:modelValue": n[18] ||= (e) => Ce.value = e,
				title: we.value === "field" ? "翻译当前字段" : "批量翻译",
				subtitle: "Google Translate · 仅补齐缺失及原文已更新的译文",
				width: "520px",
				"close-on-click-modal": !1,
				"before-close": () => !De.value
			}, {
				footer: R(() => [S(N(u), {
					size: "sm",
					disabled: De.value,
					onClick: n[17] ||= (e) => Ce.value = !1
				}, {
					default: R(() => [...n[44] ||= [x("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), S(N(u), {
					variant: "primary",
					size: "sm",
					loading: De.value,
					disabled: !Te.value.length,
					onClick: xt
				}, {
					default: R(() => [...n[45] ||= [x("确认翻译", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])]),
				default: R(() => [b("div", ii, [
					b("p", null, M(we.value === "field" ? `当前内容的「${Ye.value?.label}」` : `当前空间「${Xe.value}」${ge.value ? "中匹配搜索条件的内容" : "全部内容"}`), 1),
					S(N(i), { label: "目标语言" }, {
						default: R(() => [S(N(r), {
							modelValue: Te.value,
							"onUpdate:modelValue": n[16] ||= (e) => Te.value = e,
							options: qe.value,
							multiple: "",
							filterable: "",
							"max-tag-count": 5,
							disabled: De.value
						}, null, 8, [
							"modelValue",
							"options",
							"disabled"
						])]),
						_: 1
					}),
					S(N(l), { type: "warning" }, {
						default: R(() => [...n[43] ||= [x("内容将发送至 Google Translate，并可能产生翻译费用。已有有效译文不会覆盖；单次最多 200 条内容、5,000 个字段任务。后台任务需要已启动翻译 worker。", -1)]]),
						_: 1
					}),
					Ee.value ? (O(), _(N(l), {
						key: 0,
						type: "error"
					}, {
						default: R(() => [x(M(Ee.value), 1)]),
						_: 1
					})) : v("", !0)
				])]),
				_: 1
			}, 8, [
				"modelValue",
				"title",
				"before-close"
			]),
			S(N(f), {
				modelValue: Oe.value,
				"onUpdate:modelValue": n[19] ||= (e) => Oe.value = e,
				title: "有未保存的翻译",
				subtitle: "切换后将丢弃当前修改，是否继续？",
				width: "380px",
				onClose: at
			}, {
				footer: R(() => [S(N(u), {
					size: "sm",
					onClick: at
				}, {
					default: R(() => [...n[46] ||= [x("继续编辑", -1)]]),
					_: 1
				}), S(N(u), {
					size: "sm",
					variant: "warning",
					onClick: it
				}, {
					default: R(() => [...n[47] ||= [x("放弃修改并继续", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, lr));
	}
}), [["__scopeId", "data-v-85b2a00f"]]), oi = { class: "mm-cms-page" }, si = {
	key: 0,
	class: "mm-cms-site"
}, ci = ["disabled"], li = ["value"], ui = {
	key: 1,
	role: "alert"
}, di = {
	key: 2,
	role: "status"
}, fi = { key: 3 }, pi = ["disabled"], mi = /*#__PURE__*/ p(/* @__PURE__ */ C({
	__name: "MmCmsPage",
	props: {
		page: {},
		runtime: {},
		identityKey: {}
	},
	setup(e) {
		let t = e, n = {
			"news/categories": Z,
			"news/list": tt,
			"academy/categories": lt,
			"academy/courses": Nt,
			"help/categories": Yt,
			"help/articles": gn,
			"feedback/list": En,
			"announcement/categories": Pn,
			"announcement/list": Qn,
			"localization/translations": ai
		}, r = k([]), i = k(""), a = k(""), o = k(t.runtime.mode === "white_label"), s = k(!1), c = g(() => r.value.find((e) => e.site_id === i.value)), l = g(() => n[t.page]), u = g(() => t.runtime.hasPermission([
			"cms_news:add",
			"cms_academy:add",
			"cms_help:add",
			"cms_announcement:add"
		])), d = new AbortController(), f = !0;
		function ee(e, n) {
			if (!f || t.runtime.mode === "white_label" && c.value?.space_id !== n) throw Error("站点已切换，请重新操作");
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
		ue(V, {
			get mode() {
				return t.runtime.mode;
			},
			hasPermission: (e) => t.runtime.hasPermission(e),
			formatDateTime: (e) => t.runtime.formatDateTime(e),
			registerBeforeLeave: (e) => t.runtime.registerBeforeLeave?.(e),
			get request() {
				let e = c.value?.space_id;
				return {
					get: (n, r) => t.runtime.request.get(ee(n, e), r),
					post: (n, r) => t.runtime.request.post(ee(n, e), r)
				};
			}
		});
		async function te() {
			let e = await t.runtime.request.get({
				url: "/cms/sites",
				signal: d.signal
			});
			d.signal.aborted || (r.value = e.sites, r.value.some((e) => e.site_id === i.value) || (i.value = r.value[0]?.site_id ?? ""));
		}
		async function ne() {
			if (!(!c.value || s.value)) {
				s.value = !0;
				try {
					await t.runtime.request.post({
						url: "/cms/initialize",
						params: { site_id: c.value.site_id }
					}, { isOpenRetry: !1 }), await te();
				} catch (e) {
					a.value = e instanceof Error ? e.message : "初始化失败";
				} finally {
					s.value = !1;
				}
			}
		}
		return le(async () => {
			if (t.runtime.mode === "white_label") try {
				await te();
			} catch {
				d.signal.aborted || (a.value = "加载站点失败，请刷新重试");
			} finally {
				o.value = !1;
			}
		}), ce(() => {
			f = !1, d.abort();
		}), (t, n) => (O(), y("section", oi, [e.runtime.mode === "white_label" ? (O(), y("header", si, [b("label", null, [n[1] ||= x("内容站点 ", -1), z(b("select", {
			"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
			disabled: o.value
		}, [(O(!0), y(se, null, fe(r.value, (e) => (O(), y("option", {
			key: e.site_id,
			value: e.site_id
		}, M(e.label), 9, li))), 128))], 8, ci), [[P, i.value]])]), n[2] ||= b("span", null, "各站点内容独立管理", -1)])) : v("", !0), a.value ? (O(), y("p", ui, M(a.value), 1)) : o.value ? (O(), y("p", di, "正在加载站点…")) : e.runtime.mode === "white_label" && !c.value?.space_id ? (O(), y("div", fi, [n[3] ||= b("p", null, "该站点尚未初始化内容空间。", -1), c.value && u.value ? (O(), y("button", {
			key: 0,
			type: "button",
			disabled: s.value,
			onClick: ne
		}, "初始化空内容空间", 8, pi)) : v("", !0)])) : (O(), _(A(l.value), { key: `${e.page}:${e.identityKey}:${c.value?.space_id ?? "platform"}` }))]));
	}
}), [["__scopeId", "data-v-e30f9db5"]]);
//#endregion
export { mi as MmCmsPage };

//# sourceMappingURL=cms.js.map