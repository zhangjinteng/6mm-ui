import { A as e, Di as t, Ei as n, Fr as r, Hr as i, Li as a, M as o, Ni as s, Sn as c, Ti as l, _r as u, d, di as f, fi as p, li as ee, pi as te, pr as ne, wi as re, xn as m } from "./src-B8Klwhqt.js";
import { d as ie, r as h, t as g, u as _ } from "./_plugin-vue_export-helper-CPGXPSGF.js";
import { Fragment as ae, computed as v, createBlock as y, createCommentVNode as b, createElementBlock as x, createElementVNode as S, createTextVNode as C, createVNode as w, defineComponent as T, inject as E, mergeProps as D, nextTick as O, normalizeClass as k, onBeforeUnmount as oe, onMounted as se, openBlock as A, provide as ce, reactive as le, ref as j, renderList as ue, resolveDynamicComponent as M, shallowRef as N, toDisplayString as P, unref as F, vModelSelect as I, vModelText as L, vShow as R, watch as z, withCtx as B, withDirectives as V, withKeys as H, withModifiers as de } from "vue";
//#region src/cms/runtime.ts
var U = Symbol("MmCms");
function fe() {
	let e = E(U);
	if (!e) throw Error("CMS host adapter is missing");
	return e;
}
function pe(e) {
	fe().registerBeforeLeave?.(e);
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
function me() {
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
	if (fe().mode === "white_label") return {
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
	return se(async () => {
		try {
			let t = await e(r.signal);
			!r.signal.aborted && n[1].type === "select" && (n[1].options = [{
				label: "全部白标",
				value: ""
			}, ...t.cms_source_options || []]);
		} catch {
			n[1].type === "select" && (n[1].disabled = !0);
		}
	}), oe(() => {
		r.abort(), i?.abort();
	}), {
		fields: n,
		bindFilters: (r) => {
			z(() => r.value.cms_source_type, (e) => {
				e === "platform" && (r.value.cms_tenant_id = ""), n[1].disabled = e === "platform";
			}, {
				immediate: !0,
				flush: "sync"
			}), t && z(() => [r.value.cms_source_type, r.value.cms_tenant_id], () => {
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
var K = /* @__PURE__ */ T({
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
		return (e, t) => (A(), y(F(re), {
			effect: "soft",
			round: "",
			size: "sm",
			type: a.value
		}, {
			default: B(() => [C(P(i.value), 1)]),
			_: 1
		}, 8, ["type"]));
	}
});
//#endregion
//#region src/cms/api/content/news.ts
function q() {
	let e = fe().request, t = "/cms/news", n = (n, r = {}) => e.get({
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
var J = ["aria-checked", "disabled"], he = /*#__PURE__*/ g(/* @__PURE__ */ T({
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
		}, [S("span")], -1), S("span", null, P(e.modelValue ? "已启用" : "已停用"), 1)], 10, J));
	}
}), [["__scopeId", "data-v-8b527db1"]]), Y = { class: "news-categories" }, X = ["aria-busy"], Z = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, ge = { class: "taxonomy-editor__field" }, _e = { class: "taxonomy-editor__row" }, Q = "分类", ve = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { newsError: n, deleteNews: r, getNewsMetadata: o, getNewsList: l, getNewsDetail: u, saveNews: d } = q(), { hasPermission: f } = fe(), { formatDateTime: ie } = fe(), g = (e) => f([`cms_news_category:${e}`]), ae = j(), T = j(), E = G(o, (e) => {
			ae.value = e;
		}), O = [
			...me(),
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
				formatter: (e) => ae.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
				formatter: ie
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], { proTableBindings: k, reload: ce, filters: ue } = i({
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
		E.bindFilters(ue);
		let M = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), N = le(M()), I = j(!1), L = j(!1), R = j(!1), z = j(!1), V = j(!1), H = j(""), U = j(!1), pe = j(""), W = j(!1), J = v(() => !g(N.id ? "edit" : "add")), ve = v(() => R.value || z.value), ye = "", be;
		async function $(e) {
			be?.abort(), be = new AbortController();
			let t = be;
			Object.assign(N, M(), { id: e || "" }), pe.value = "", V.value = !1, H.value = "", U.value = !1, I.value = !0, L.value = !0, ye = JSON.stringify(N);
			try {
				if (T.value = await o(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await u("categories", e, t.signal);
				if (T.value = await o(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(N, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), ye = JSON.stringify(N);
			} catch (e) {
				t.signal.aborted || (U.value = !0, pe.value = n(e));
			} finally {
				t.signal.aborted || (L.value = !1);
			}
		}
		function xe() {
			return ve.value ? !1 : !L.value && !U.value && JSON.stringify(N) !== ye ? (W.value = !0, !1) : (be?.abort(), !0);
		}
		function Se() {
			ve.value || (be?.abort(), I.value = !1);
		}
		function Ce() {
			W.value = !1, I.value = !1;
		}
		async function we() {
			if (!(J.value || ve.value || L.value || U.value)) {
				if (!N.name.trim() || N.sort_order === null) {
					pe.value = "请填写分类名称和排序";
					return;
				}
				R.value = !0, pe.value = "";
				try {
					await d("categories", {
						name: N.name,
						parent_id: N.parent_id || null,
						sort_order: N.sort_order,
						is_enabled: N.is_enabled,
						id: N.id || void 0,
						row_version: N.id ? N.row_version : void 0
					}), I.value = !1, te.success("保存成功"), await Promise.all([ce(), ke()]);
				} catch (e) {
					pe.value = n(e);
				} finally {
					R.value = !1;
				}
			}
		}
		function Te() {
			!N.id || !g("delete") || ve.value || L.value || U.value || (H.value = "", V.value = !0);
		}
		async function Ee() {
			if (!(!V.value || !N.id || !g("delete") || ve.value || L.value || U.value)) {
				z.value = !0, H.value = "";
				try {
					await r("categories", N.id, N.row_version), V.value = !1, I.value = !1, te.success("分类已删除"), await Promise.all([ce(), ke()]);
				} catch (e) {
					H.value = n(e);
				} finally {
					z.value = !1;
				}
			}
		}
		let De = v(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(T.value?.categories || []).filter((e) => !e.parent_id && e.id !== N.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Oe = new AbortController();
		async function ke() {
			try {
				ae.value = await o(Oe.signal);
			} catch {}
		}
		return se(ke), oe(() => {
			be?.abort(), Oe.abort();
		}), (e, n) => (A(), x("div", Y, [
			w(F(ne), D(F(k), {
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
				"cell-cms_source_type": B(({ row: e }) => [w(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": B(() => [g("add") ? (A(), y(F(a), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: n[0] ||= (e) => $()
				}, {
					icon: B(() => [w(F(_), {
						name: "plus",
						size: 14
					})]),
					default: B(() => [C("新增" + P(Q))]),
					_: 1
				})) : b("", !0)]),
				"cell-is_enabled": B(({ row: e }) => [w(F(re), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: B(() => [C(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": B(({ row: e }) => [w(F(a), {
					size: "sm",
					"icon-only": "",
					title: g("edit") ? `编辑${Q}` : `${Q}详情`,
					"aria-label": `编辑${Q}`,
					onClick: (t) => $(e.id)
				}, {
					default: B(() => [w(F(_), {
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
			w(F(s), {
				modelValue: I.value,
				"onUpdate:modelValue": n[5] ||= (e) => I.value = e,
				title: `${N.id ? "编辑" : "新增"}新闻${Q}`,
				width: "680px",
				subtitle: "新闻分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": xe
			}, {
				footer: B(() => [
					N.id && g("delete") ? (A(), y(F(a), {
						key: 0,
						variant: "danger",
						disabled: L.value || U.value || ve.value,
						onClick: Te
					}, {
						icon: B(() => [w(F(_), {
							name: "trash-2",
							size: 14
						})]),
						default: B(() => [n[11] ||= C("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(F(a), {
						disabled: ve.value,
						onClick: Se
					}, {
						default: B(() => [...n[12] ||= [C("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					J.value ? b("", !0) : (A(), y(F(a), {
						key: 1,
						variant: "primary",
						loading: R.value,
						disabled: L.value || U.value || z.value,
						onClick: we
					}, {
						default: B(() => [C("保存" + P(Q))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: B(() => [S("div", {
					class: "taxonomy-editor",
					"aria-busy": L.value
				}, [
					L.value ? (A(), x("div", Z, [w(F(_), {
						name: "loader-circle",
						class: "news-spin",
						size: 24
					}), S("span", null, "正在读取" + P(Q) + "...")])) : b("", !0),
					pe.value ? (A(), y(F(p), {
						key: 1,
						type: "error",
						closable: !1,
						description: pe.value
					}, null, 8, ["description"])) : b("", !0),
					!L.value && !U.value ? (A(), y(F(c), {
						key: 2,
						model: N,
						"label-position": "top",
						onSubmit: de(we, ["prevent"])
					}, {
						default: B(() => [
							N.id ? (A(), y(F(m), {
								key: 0,
								label: "分类ID"
							}, {
								default: B(() => [w(F(h), {
									"model-value": N.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : b("", !0),
							w(F(m), {
								label: `${Q}名称`,
								required: ""
							}, {
								default: B(() => [w(F(h), {
									modelValue: N.name,
									"onUpdate:modelValue": n[1] ||= (e) => N.name = e,
									maxlength: 120,
									disabled: J.value || ve.value,
									"aria-label": `${Q}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							w(F(m), { label: "父分类" }, {
								default: B(() => [S("div", ge, [w(F(t), {
									modelValue: N.parent_id,
									"onUpdate:modelValue": n[2] ||= (e) => N.parent_id = e,
									options: De.value,
									disabled: J.value || ve.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), n[10] ||= S("p", { class: "news-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类新闻。 ", -1)])]),
								_: 1
							}),
							S("div", _e, [w(F(m), {
								label: "前端排序",
								required: ""
							}, {
								default: B(() => [w(F(ee), {
									modelValue: N.sort_order,
									"onUpdate:modelValue": n[3] ||= (e) => N.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: J.value || ve.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), w(F(m), { label: "启用状态" }, {
								default: B(() => [w(he, {
									modelValue: N.is_enabled,
									"onUpdate:modelValue": n[4] ||= (e) => N.is_enabled = e,
									disabled: J.value || ve.value,
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
			w(F(s), {
				modelValue: V.value,
				"onUpdate:modelValue": n[7] ||= (e) => V.value = e,
				title: "删除新闻分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !z.value
			}, {
				footer: B(() => [w(F(a), {
					disabled: z.value,
					onClick: n[6] ||= (e) => V.value = !1
				}, {
					default: B(() => [...n[13] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(F(a), {
					variant: "danger",
					loading: z.value,
					onClick: Ee
				}, {
					default: B(() => [...n[14] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: B(() => [S("p", null, "确认删除分类“" + P(N.name) + "”？有关联新闻或子分类的分类无法删除。", 1), H.value ? (A(), y(F(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: H.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			w(F(s), {
				modelValue: W.value,
				"onUpdate:modelValue": n[9] ||= (e) => W.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: B(() => [w(F(a), { onClick: n[8] ||= (e) => W.value = !1 }, {
					default: B(() => [...n[15] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(F(a), {
					variant: "primary",
					onClick: Ce
				}, {
					default: B(() => [...n[16] ||= [C("放弃修改", -1)]]),
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
function xe(e, t) {
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
	let i = j(), a = j(), o = j(null), s = j(Date.now()), c = le({}), l = j(""), u = Object.fromEntries(be.map((e) => [e, {
		required: e === "title" || e === "category_id",
		trigger: "submit"
	}])), d = v(() => o.value ? $(e, t(), n, o.value === "draft" ? "draft" : e.scheduled_local ? "scheduled" : "published", s.value) : {}), f = v(() => ({
		...c,
		...d.value
	})), p = v(() => Object.keys(f.value).length);
	for (let t of be) z(() => e[t], () => {
		delete c[t], l.value = "", s.value = Date.now();
	}, { deep: !0 });
	function ee() {
		f.value.seo_description && a.value?.focus();
	}
	async function te() {
		await O();
		let e = [...i.value?.querySelectorAll("[data-prop]") || []].find((e) => f.value[e.dataset.prop]);
		if (!e && f.value.seo_description) {
			r.value ? ee() : r.value = !0;
			return;
		}
		e && (e.scrollIntoView({
			block: "center",
			behavior: "auto"
		}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
	}
	async function ne(e) {
		o.value = e === "draft" ? "draft" : "publish", s.value = Date.now(), l.value = "";
		for (let e of be) delete c[e];
		return p.value ? (await te(), !1) : !0;
	}
	function re(e) {
		let t = xe(e, n);
		Object.assign(c, t.fields), l.value = t.general;
	}
	return {
		editorRoot: i,
		seoInput: a,
		fieldRules: u,
		fieldErrors: f,
		pendingCount: p,
		saveError: l,
		validateSave: ne,
		setSaveFailure: re,
		focusFirstError: te,
		focusSeoError: ee
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
}, je = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "CoverFileItem",
	props: {
		url: {},
		file: {},
		disabled: { type: Boolean }
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = j(null), a = j(!1), o = j(!1), s = j(""), c, l = v(() => {
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
		}), d = v(() => i.value === null ? "大小未知" : i.value < 1024 ? `${i.value} B` : i.value < 1024 * 1024 ? `${(i.value / 1024).toFixed(1)} KB` : `${(i.value / (1024 * 1024)).toFixed(1)} MB`);
		z(() => [n.url, n.file], async (e, t, r) => {
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
		return oe(() => {
			c?.abort(), c = void 0;
		}), (t, n) => (A(), x("div", Ce, [S("div", we, [
			S("span", Te, [a.value ? (A(), y(F(_), {
				key: 1,
				name: "image",
				size: 20
			})) : (A(), x("img", {
				key: 0,
				src: e.url,
				alt: "封面缩略图",
				onError: n[0] ||= (e) => a.value = !0
			}, null, 40, Ee))]),
			S("a", {
				class: "file-name",
				href: l.value || void 0,
				download: u.value,
				title: u.value,
				"aria-busy": o.value,
				"aria-disabled": o.value || !l.value,
				onClick: de(f, ["prevent", "stop"])
			}, P(u.value), 9, De),
			S("span", Oe, P(d.value), 1),
			S("button", {
				class: "file-remove",
				type: "button",
				"aria-label": "移除封面",
				title: "移除封面",
				disabled: e.disabled,
				onClick: n[1] ||= de((e) => r("remove"), ["stop"])
			}, [w(F(_), {
				name: "close",
				size: 14
			})], 8, ke)
		]), s.value ? (A(), x("span", Ae, P(s.value), 1)) : b("", !0)]));
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
}, Re = /*#__PURE__*/ g(/* @__PURE__ */ T({
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
		let n = e, r = t, i = j(), a = N(), o = j(!1), s = j(!1), c;
		z(() => n.modelValue, (e) => {
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
			O(() => i.value?.clearFiles());
		}
		function f() {
			r("success"), u();
		}
		function p(e, t) {
			r("error", c ? c.error : t), c = void 0, u();
		}
		function ee() {
			n.disabled || o.value || (a.value = void 0, s.value = !1, r("update:modelValue", ""));
		}
		return (t, n) => (A(), x("div", Me, [
			w(F(d), {
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
				onError: p,
				onExceed: n[2] ||= (e) => r("error", /* @__PURE__ */ Error("一次只能上传一张封面图片"))
			}, {
				default: B(() => [S("div", Ne, [e.modelValue ? (A(), x("img", {
					key: 0,
					src: e.modelValue,
					alt: e.label,
					draggable: "false",
					onError: n[0] ||= (e) => s.value = !0,
					onLoad: n[1] ||= (e) => s.value = !1
				}, null, 40, Pe)) : (A(), x("div", Fe, [w(F(_), {
					name: "image",
					size: 28
				})])), e.modelValue ? b("", !0) : (A(), x("span", Ie, [C(P(o.value ? "正在上传…" : "拖动图片到此处，或点击上传") + " ", 1), n[3] ||= S("span", { class: "content-cover__types" }, "JPG / PNG / WebP，最大 5 MB", -1)]))])]),
				_: 1
			}, 8, ["disabled"]),
			s.value ? (A(), x("span", Le, " 封面无法加载，请重新上传 ")) : b("", !0),
			e.modelValue ? (A(), y(je, {
				key: 1,
				url: e.modelValue,
				file: a.value?.url === e.modelValue ? a.value.file : void 0,
				disabled: e.disabled || o.value,
				onRemove: ee
			}, null, 8, [
				"url",
				"file",
				"disabled"
			])) : b("", !0)
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
}, et = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(n, { emit: r }) {
		let { newsError: i, newsCategoryLabel: o, deleteNews: l, getNewsDetail: u, getNewsMetadata: d, saveNews: f, uploadNewsCover: ne } = q(), { hasPermission: re } = fe(), ie = n, g = r, T = j(!0), E = j(!1), D = j(!1), O = j(""), k = j(!1), ce = j(!1), ue = j(!1), M = j(!1), N = j(fe().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), I = j(), R = j("draft"), z = j(!1), H = v(() => re(["cms_news:publish"])), U = v(() => !re([`cms_news:${ie.articleId ? "edit" : "add"}`]) || !H.value && R.value !== "draft"), W = v(() => re(["cms_news:delete"]) && (H.value || R.value === "draft"));
		async function me() {
			if (!(!W.value || E.value || T.value || D.value)) {
				E.value = !0, O.value = "";
				try {
					await l("articles", K.id, K.row_version), xe = JSON.stringify(K), te.success("新闻已删除"), g("saved");
				} catch (e) {
					O.value = i(e), M.value = !1;
				} finally {
					E.value = !1;
				}
			}
		}
		let G = v(() => U.value || E.value), K = le({
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
		}), { editorRoot: J, seoInput: Y, fieldRules: X, fieldErrors: Z, pendingCount: ge, saveError: _e, validateSave: Q, setSaveFailure: ve, focusFirstError: ye, focusSeoError: be } = Se(K, () => I.value?.categories || [], "news", k), $ = v(() => (I.value?.categories || []).map((e) => ({
			label: o(I.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), xe = "", Ce;
		function we(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Te() {
			Ce?.abort(), Ce = new AbortController();
			let e = Ce;
			T.value = !0, D.value = !1, O.value = "";
			try {
				if (I.value = await d(e.signal, { cms_source_type: "platform" }), ie.articleId) {
					let t = await u("articles", ie.articleId, e.signal);
					if (I.value = await d(e.signal, { space_id: String(t.space_id) }), N.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					K.scheduled_local = t.publish_status === "scheduled" ? we(t.scheduled_at) : "", R.value = t.publish_status;
				}
				xe = JSON.stringify(K);
			} catch (t) {
				e.signal.aborted || (O.value = i(t), D.value = !0);
			} finally {
				e.signal.aborted || (T.value = !1);
			}
		}
		let Ee = () => !T.value && !D.value && xe !== JSON.stringify(K);
		function De() {
			Ee() ? ce.value = !0 : g("close");
		}
		function Oe() {
			R.value === "draft" ? Ae("draft") : ue.value = !0;
		}
		function ke() {
			ue.value = !1, Ae("draft");
		}
		async function Ae(e) {
			if (G.value || T.value || D.value || z.value || (O.value = "", !await Q(e))) return;
			let t = K.scheduled_local ? new Date(K.scheduled_local) : null;
			E.value = !0, O.value = "";
			try {
				await f("articles", {
					...K,
					id: K.id || void 0,
					row_version: K.id ? K.row_version : void 0,
					category_id: K.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), xe = JSON.stringify(K), te.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "新闻已发布"), g("saved");
			} catch (e) {
				ve(e);
			} finally {
				E.value = !1;
			}
			ge.value && await ye();
		}
		function je(e) {
			O.value = i(e);
		}
		let Me = (e) => {
			Ee() && (e.preventDefault(), e.returnValue = "");
		};
		return pe(() => !E.value && !z.value && (!Ee() || window.confirm("新闻有未保存的修改，确定离开？"))), se(() => {
			Te(), window.addEventListener("beforeunload", Me);
		}), oe(() => {
			Ce?.abort(), window.removeEventListener("beforeunload", Me);
		}), (r, i) => (A(), x("section", {
			ref_key: "editorRoot",
			ref: J,
			class: "article-editor",
			"aria-busy": T.value || E.value
		}, [
			S("header", Be, [
				w(F(a), {
					"icon-only": "",
					title: "返回新闻列表",
					"aria-label": "返回新闻列表",
					disabled: E.value || z.value,
					onClick: De
				}, {
					default: B(() => [w(F(_), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				S("div", Ve, [S("h2", null, P(n.articleId ? "编辑新闻" : "新增新闻"), 1), S("span", null, P(I.value?.source_locale || "zh-CN") + " · " + P(N.value), 1)]),
				S("div", He, [
					n.articleId && W.value ? (A(), y(F(a), {
						key: 0,
						size: "sm",
						disabled: T.value || D.value || E.value || z.value,
						onClick: i[0] ||= (e) => M.value = !0
					}, {
						default: B(() => [...i[28] ||= [C("删除新闻", -1)]]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(F(a), {
						size: "sm",
						disabled: T.value || D.value,
						onClick: i[1] ||= (e) => k.value = !0
					}, {
						icon: B(() => [w(F(_), {
							name: "search",
							size: 14
						})]),
						default: B(() => [i[29] ||= C("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					U.value ? b("", !0) : (A(), y(F(a), {
						key: 1,
						size: "sm",
						disabled: T.value || D.value || E.value || z.value,
						onClick: Oe
					}, {
						icon: B(() => [w(F(_), {
							name: "save",
							size: 14
						})]),
						default: B(() => [i[30] ||= C("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					F(_e) ? (A(), x("span", Ue, P(F(_e)), 1)) : b("", !0),
					!U.value && F(ge) ? (A(), x("span", We, "还有 " + P(F(ge)) + " 项待完善", 1)) : b("", !0),
					!U.value && H.value ? (A(), y(F(a), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: T.value || D.value || z.value,
						loading: E.value,
						onClick: i[2] ||= (e) => Ae(K.scheduled_local ? "scheduled" : "published")
					}, {
						icon: B(() => [w(F(_), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: B(() => [C(P(K.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : b("", !0)
				])
			]),
			T.value ? (A(), x("div", Ge, [w(F(_), {
				name: "loader-circle",
				class: "news-spin",
				size: 28
			}), i[31] ||= S("span", null, "正在读取新闻资料...", -1)])) : D.value ? (A(), x("div", Ke, [w(F(p), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"]), w(F(a), { onClick: Te }, {
				default: B(() => [...i[32] ||= [C("重新加载", -1)]]),
				_: 1
			})])) : (A(), x(ae, { key: 2 }, [O.value ? (A(), x("div", qe, [w(F(p), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"])])) : b("", !0), S("div", Je, [S("aside", Ye, [w(F(c), {
				model: K,
				rules: F(X),
				"label-position": "top",
				onSubmit: i[12] ||= de(() => {}, ["prevent"])
			}, {
				default: B(() => [
					w(F(m), {
						label: "新闻分类",
						prop: "category_id",
						error: F(Z).category_id,
						required: ""
					}, {
						default: B(() => [w(F(t), {
							modelValue: K.category_id,
							"onUpdate:modelValue": i[3] ||= (e) => K.category_id = e,
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
					i[33] ||= S("h3", null, "新闻设置", -1),
					w(F(m), {
						label: "新闻封面",
						prop: "cover_url",
						error: F(Z).cover_url
					}, {
						default: B(() => [w(Re, {
							modelValue: K.cover_url,
							"onUpdate:modelValue": i[4] ||= (e) => K.cover_url = e,
							label: "新闻封面",
							disabled: G.value,
							upload: F(ne),
							onBusyChange: i[5] ||= (e) => z.value = e,
							onStart: i[6] ||= (e) => O.value = "",
							onError: je
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "内容来源",
						prop: "content_source",
						error: F(Z).content_source
					}, {
						default: B(() => [w(F(h), {
							modelValue: K.content_source,
							"onUpdate:modelValue": i[7] ||= (e) => K.content_source = e,
							maxlength: 160,
							disabled: G.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "作者署名",
						prop: "author_name",
						error: F(Z).author_name
					}, {
						default: B(() => [w(F(h), {
							modelValue: K.author_name,
							"onUpdate:modelValue": i[8] ||= (e) => K.author_name = e,
							maxlength: 120,
							disabled: G.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "前端排序",
						prop: "sort_order",
						error: F(Z).sort_order
					}, {
						default: B(() => [w(F(ee), {
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
					i[34] ||= S("h3", null, "发布设置", -1),
					w(F(m), {
						label: "启用状态",
						prop: "is_enabled",
						error: F(Z).is_enabled
					}, {
						default: B(() => [w(he, {
							modelValue: K.is_enabled,
							"onUpdate:modelValue": i[10] ||= (e) => K.is_enabled = e,
							disabled: G.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: F(Z).scheduled_local
					}, {
						default: B(() => [w(F(h), {
							modelValue: K.scheduled_local,
							"onUpdate:modelValue": i[11] ||= (e) => K.scheduled_local = e,
							type: "datetime-local",
							disabled: G.value || !H.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[35] ||= S("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), S("main", Xe, [w(F(c), {
				model: K,
				rules: F(X),
				"label-position": "top",
				onSubmit: i[16] ||= de(() => {}, ["prevent"])
			}, {
				default: B(() => [
					w(F(m), {
						label: "标题",
						prop: "title",
						error: F(Z).title,
						required: ""
					}, {
						default: B(() => [w(F(h), {
							modelValue: K.title,
							"onUpdate:modelValue": i[13] ||= (e) => K.title = e,
							maxlength: 255,
							disabled: G.value,
							placeholder: "输入新闻标题",
							"aria-label": "新闻标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "摘要",
						prop: "summary",
						error: F(Z).summary
					}, {
						default: B(() => [V(S("textarea", {
							"onUpdate:modelValue": i[14] ||= (e) => K.summary = e,
							"aria-invalid": !!F(Z).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: G.value,
							"aria-label": "新闻摘要"
						}, null, 8, Ze), [[L, K.summary]])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "正文",
						prop: "body_html",
						error: F(Z).body_html
					}, {
						default: B(() => [w(F(e), {
							modelValue: K.body_html,
							"onUpdate:modelValue": i[15] ||= (e) => K.body_html = e,
							readonly: U.value,
							disabled: E.value,
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
			w(F(s), {
				modelValue: k.value,
				"onUpdate:modelValue": i[20] ||= (e) => k.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: B(() => [w(F(a), {
					variant: "primary",
					onClick: i[19] ||= (e) => k.value = !1
				}, {
					default: B(() => [...i[36] ||= [C("确定", -1)]]),
					_: 1
				})]),
				default: B(() => [w(F(c), {
					model: K,
					rules: F(X),
					"label-position": "top",
					onSubmit: i[18] ||= de(() => {}, ["prevent"])
				}, {
					default: B(() => [w(F(m), {
						label: "SEO 描述",
						prop: "seo_description",
						error: F(Z).seo_description
					}, {
						default: B(() => [V(S("textarea", {
							ref_key: "seoInput",
							ref: Y,
							"onUpdate:modelValue": i[17] ||= (e) => K.seo_description = e,
							"aria-invalid": !!F(Z).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: G.value,
							"aria-label": "SEO 描述"
						}, null, 8, Qe), [[L, K.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			w(F(s), {
				modelValue: M.value,
				"onUpdate:modelValue": i[22] ||= (e) => M.value = e,
				title: "确认删除",
				subtitle: `操作对象：${K.title || "未命名新闻"}`,
				width: "460px",
				"panel-class": "news-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !E.value
			}, {
				"header-actions": B(() => [S("span", $e, [w(F(_), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: B(() => [w(F(a), {
					disabled: E.value,
					onClick: i[21] ||= (e) => M.value = !1
				}, {
					default: B(() => [...i[37] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(F(a), {
					variant: "warning",
					loading: E.value,
					onClick: me
				}, {
					default: B(() => [...i[38] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: B(() => [w(F(p), {
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
			w(F(s), {
				modelValue: ce.value,
				"onUpdate:modelValue": i[25] ||= (e) => ce.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: B(() => [w(F(a), { onClick: i[23] ||= (e) => ce.value = !1 }, {
					default: B(() => [...i[39] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(F(a), {
					variant: "primary",
					onClick: i[24] ||= (e) => g("close")
				}, {
					default: B(() => [...i[40] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			w(F(s), {
				modelValue: ue.value,
				"onUpdate:modelValue": i[27] ||= (e) => ue.value = e,
				title: "将新闻转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: B(() => [w(F(a), { onClick: i[26] ||= (e) => ue.value = !1 }, {
					default: B(() => [...i[41] ||= [C("取消", -1)]]),
					_: 1
				}), w(F(a), {
					variant: "primary",
					onClick: ke
				}, {
					default: B(() => [...i[42] ||= [C("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, ze));
	}
}), [["__scopeId", "data-v-9ad8501f"]]), tt = { class: "news-articles" }, nt = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { newsPublishStates: t, newsCategoryLabel: n, getNewsList: r, getNewsMetadata: o } = q(), { hasPermission: s } = fe(), { formatDateTime: c } = fe(), l = j(!1), u = j(), d = (e) => s([`cms_news:${e}`]), f = j(), p = G(o, (e) => {
			f.value = e;
		}), ee = [
			...me(),
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
				formatter: (e) => n(f.value, e)
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
		], { proTableBindings: te, reload: m, filters: ie } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
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
					}, ...(f.value?.categories || []).map((e) => ({
						label: n(f.value, e.id),
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
		p.bindFilters(ie);
		let h = new AbortController();
		async function g() {
			try {
				f.value = await o(h.signal);
			} catch {}
		}
		function ae(e) {
			u.value = e, l.value = !0;
		}
		function S() {
			l.value = !1, m(), g();
		}
		return se(g), oe(() => h.abort()), (e, n) => (A(), x("div", tt, [l.value ? (A(), y(et, {
			key: 0,
			"article-id": u.value,
			onClose: n[0] ||= (e) => l.value = !1,
			onSaved: S
		}, null, 8, ["article-id"])) : b("", !0), V(w(F(ne), D(F(te), {
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
			"cell-cms_source_type": B(({ row: e }) => [w(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": B(() => [d("add") ? (A(), y(F(a), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: n[1] ||= (e) => ae()
			}, {
				icon: B(() => [w(F(_), {
					name: "plus",
					size: 14
				})]),
				default: B(() => [n[2] ||= C("新增新闻", -1)]),
				_: 1
			})) : b("", !0)]),
			"cell-publish_status": B(({ row: e }) => [w(F(re), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: B(() => [C(P(F(t).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": B(({ row: e }) => [w(F(re), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: B(() => [C(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": B(({ row: e }) => [C(P(F(c)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": B(({ row: e }) => [w(F(a), {
				size: "sm",
				"icon-only": "",
				title: d("edit") ? "编辑新闻" : "新闻详情",
				"aria-label": d("edit") ? "编辑新闻" : "新闻详情",
				onClick: (t) => ae(e.id)
			}, {
				default: B(() => [w(F(_), {
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
		}, 16), [[R, !l.value]])]));
	}
}), [["__scopeId", "data-v-aef51e21"]]);
//#endregion
//#region src/cms/api/content/academy.ts
function rt() {
	let e = fe().request, t = "/cms/academy";
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
}, ot = { class: "taxonomy-editor__row" }, st = "分类", ct = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "CategoryTable",
	setup(e) {
		let { hasPermission: n } = fe(), { formatDateTime: r } = fe(), { academyDifficulties: o, academyError: l, getAcademyList: u, getAcademyMetadata: d, getAcademyDetail: ie, saveAcademy: g, deleteAcademyCategory: T } = rt(), E = (e) => n([`cms_academy_category:${e}`]), O = G(d), k = [
			...me(),
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
		], { proTableBindings: se, reload: ce, currentPage: ue, pageSize: M, total: N, filters: I } = i({
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
		O.bindFilters(I);
		let L = () => ({
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
		}), R = le(L()), z = j(!1), V = j(!1), H = j(!1), U = j(!1), pe = j(!1), W = j(""), q = j(!1), J = j(""), he = j(!1), Y = v(() => !E(R.id ? "edit" : "add")), X = v(() => H.value || U.value), Z = "", ge;
		async function _e(e) {
			ge?.abort(), ge = new AbortController();
			let t = ge;
			if (Object.assign(R, L(), { id: e || "" }), J.value = "", pe.value = !1, W.value = "", q.value = !1, z.value = !0, V.value = !!e, Z = JSON.stringify(R), e) try {
				let n = await ie("categories", e, t.signal);
				if (t.signal.aborted) return;
				Object.assign(R, {
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
				}), Z = JSON.stringify(R);
			} catch (e) {
				t.signal.aborted || (q.value = !0, J.value = l(e));
			} finally {
				t.signal.aborted || (V.value = !1);
			}
		}
		function Q() {
			return X.value ? !1 : !V.value && !q.value && JSON.stringify(R) !== Z ? (he.value = !0, !1) : (ge?.abort(), !0);
		}
		function ve() {
			X.value || (ge?.abort(), z.value = !1);
		}
		function ye() {
			he.value = !1, z.value = !1;
		}
		async function be() {
			if (!(Y.value || X.value || V.value || q.value)) {
				if (!R.name.trim() || R.sort_order === null || !R.difficulty_levels.length) {
					J.value = "请填写名称、排序和适用难度";
					return;
				}
				H.value = !0, J.value = "";
				try {
					await g("categories", {
						...R,
						id: R.id || void 0,
						row_version: R.id ? R.row_version : void 0
					}), z.value = !1, te.success("保存成功"), await ce();
				} catch (e) {
					J.value = l(e);
				} finally {
					H.value = !1;
				}
			}
		}
		function $() {
			!R.id || !E("delete") || X.value || V.value || q.value || (W.value = "", pe.value = !0);
		}
		async function xe() {
			if (!(!pe.value || !R.id || !E("delete") || X.value || V.value || q.value)) {
				U.value = !0, W.value = "";
				try {
					await T({
						id: R.id,
						row_version: R.row_version
					}), pe.value = !1, z.value = !1, te.success("分类已删除"), await ce(), ue.value = Math.min(ue.value, Math.max(1, Math.ceil(N.value / M.value)));
				} catch (e) {
					W.value = l(e);
				} finally {
					U.value = !1;
				}
			}
		}
		return oe(() => ge?.abort()), (e, n) => (A(), x(ae, null, [
			w(F(ne), D(F(se), {
				"auto-refreshable": !1,
				columns: k,
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
				"cell-cms_source_type": B(({ row: e }) => [w(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": B(() => [E("add") ? (A(), y(F(a), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: n[0] ||= (e) => _e()
				}, {
					icon: B(() => [w(F(_), {
						name: "plus",
						size: 14
					})]),
					default: B(() => [C("新增" + P(st))]),
					_: 1
				})) : b("", !0)]),
				"cell-is_enabled": B(({ row: e }) => [w(F(re), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: B(() => [C(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": B(({ row: e }) => [w(F(a), {
					size: "sm",
					"icon-only": "",
					title: E("edit") ? `编辑${st}` : `${st}详情`,
					"aria-label": `编辑${st}`,
					onClick: (t) => _e(e.id)
				}, {
					default: B(() => [w(F(_), {
						name: E("edit") ? "square-pen" : "panel-right-open",
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
			w(F(s), {
				modelValue: z.value,
				"onUpdate:modelValue": n[5] ||= (e) => z.value = e,
				title: `${R.id ? "编辑" : "新增"}课程${st}`,
				width: "620px",
				"close-on-click-modal": !1,
				"before-close": Q
			}, {
				footer: B(() => [
					R.id && E("delete") ? (A(), y(F(a), {
						key: 0,
						variant: "danger",
						disabled: V.value || q.value || X.value,
						onClick: $
					}, {
						icon: B(() => [w(F(_), {
							name: "trash-2",
							size: 14
						})]),
						default: B(() => [n[10] ||= C("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(F(a), {
						disabled: X.value,
						onClick: ve
					}, {
						default: B(() => [...n[11] ||= [C("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Y.value ? b("", !0) : (A(), y(F(a), {
						key: 1,
						variant: "primary",
						loading: H.value,
						disabled: V.value || q.value || U.value,
						onClick: be
					}, {
						default: B(() => [C("保存" + P(st))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: B(() => [S("div", {
					class: "taxonomy-editor",
					"aria-busy": V.value
				}, [
					V.value ? (A(), x("div", at, [w(F(_), {
						name: "loader-circle",
						class: "academy-spin",
						size: 24
					}), S("span", null, "正在读取" + P(st) + "...")])) : b("", !0),
					J.value ? (A(), y(F(p), {
						key: 1,
						type: "error",
						closable: !1,
						description: J.value
					}, null, 8, ["description"])) : b("", !0),
					!V.value && !q.value ? (A(), y(F(c), {
						key: 2,
						model: R,
						"label-position": "top",
						onSubmit: de(be, ["prevent"])
					}, {
						default: B(() => [
							w(F(m), {
								label: `${st}名称`,
								required: ""
							}, {
								default: B(() => [w(F(h), {
									modelValue: R.name,
									"onUpdate:modelValue": n[1] ||= (e) => R.name = e,
									maxlength: 120,
									disabled: Y.value || X.value,
									"aria-label": `${st}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							w(F(m), {
								label: "适用难度",
								required: ""
							}, {
								default: B(() => [w(F(t), {
									modelValue: R.difficulty_levels,
									"onUpdate:modelValue": n[2] ||= (e) => R.difficulty_levels = e,
									multiple: "",
									options: F(o),
									disabled: Y.value || X.value,
									"aria-label": "适用难度"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								])]),
								_: 1
							}),
							S("div", ot, [w(F(m), {
								label: "前端排序",
								required: ""
							}, {
								default: B(() => [w(F(ee), {
									modelValue: R.sort_order,
									"onUpdate:modelValue": n[3] ||= (e) => R.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Y.value || X.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), w(F(m), { label: "启用状态" }, {
								default: B(() => [w(F(f), {
									modelValue: R.is_enabled,
									"onUpdate:modelValue": n[4] ||= (e) => R.is_enabled = e,
									disabled: Y.value || X.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : b("", !0)
				], 8, it)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			w(F(s), {
				modelValue: pe.value,
				"onUpdate:modelValue": n[7] ||= (e) => pe.value = e,
				title: "删除课程分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !U.value
			}, {
				footer: B(() => [w(F(a), {
					disabled: U.value,
					onClick: n[6] ||= (e) => pe.value = !1
				}, {
					default: B(() => [...n[12] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(F(a), {
					variant: "danger",
					loading: U.value,
					onClick: xe
				}, {
					default: B(() => [...n[13] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: B(() => [S("p", null, "确认删除分类“" + P(R.name) + "”？有关联课程的分类无法删除。", 1), W.value ? (A(), y(F(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: W.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			w(F(s), {
				modelValue: he.value,
				"onUpdate:modelValue": n[9] ||= (e) => he.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: B(() => [w(F(a), { onClick: n[8] ||= (e) => he.value = !1 }, {
					default: B(() => [...n[14] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(F(a), {
					variant: "primary",
					onClick: ye
				}, {
					default: B(() => [...n[15] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 64));
	}
}), [["__scopeId", "data-v-b7830575"]]), lt = { class: "academy-categories" }, ut = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		return (e, t) => (A(), x("div", lt, [w(ct)]));
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
}, Mt = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "CourseEditor",
	props: { courseId: {} },
	emits: ["close", "saved"],
	setup(n, { emit: r }) {
		let { hasPermission: i } = fe(), { academyDifficulties: o, academyError: l, deleteAcademyCourse: u, getAcademyDetail: d, getAcademyMetadata: ne, saveAcademy: re, uploadAcademyCover: ie } = rt(), g = n, ae = r, T = j(!0), E = j(!1), D = j(!1), k = j(""), ce = j(!1), ue = j(!1), M = j(!1), N = j(fe().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), I = j(), R = j("draft"), H = j(!1), U = j(!1), W = j(""), me = v(() => i(["cms_academy:publish"])), G = v(() => !!g.courseId && i(["cms_academy:delete"]) && (me.value || R.value === "draft")), K = v(() => !i([`cms_academy:${g.courseId ? "edit" : "add"}`]) || !me.value && R.value !== "draft"), q = v(() => K.value || E.value), J = le({
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
		}), he = j(), Y = j(), X = j(null), Z = j(Date.now()), ge = le({}), _e = j(""), Q = Object.fromEntries(dt.map((e) => [e, {
			required: e === "title" || e === "category_ids",
			trigger: "submit"
		}])), ve = v(() => X.value ? mt(J, I.value?.categories || [], X.value === "draft" ? "draft" : J.scheduled_local ? "scheduled" : "published", Z.value) : {}), ye = v(() => ({
			...ge,
			...ve.value
		})), be = v(() => Object.keys(ye.value).length);
		for (let e of dt) z(() => J[e], () => {
			delete ge[e], e === "category_ids" && delete ge.difficulty_level, _e.value = "", Z.value = Date.now();
		}, { deep: !0 });
		function $() {
			ye.value.seo_description && Y.value?.focus();
		}
		async function xe() {
			await O();
			let e = [...he.value?.querySelectorAll("[data-prop]") || []].find((e) => ye.value[e.dataset.prop]);
			if (!e && ye.value.seo_description) {
				ce.value ? $() : ce.value = !0;
				return;
			}
			e && (e.scrollIntoView({
				block: "center",
				behavior: "auto"
			}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
		}
		let Se = v(() => (I.value?.categories || []).map((e) => ({
			label: e.name + (e.is_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.is_enabled
		}))), Ce = v(() => {
			let e = (I.value?.categories || []).filter((e) => J.category_ids.includes(e.id));
			return o.map((t) => ({
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
			T.value = !0, D.value = !1, k.value = "";
			try {
				if (I.value = await ne(e.signal, { cms_source_type: "platform" }), g.courseId) {
					let t = await d("courses", g.courseId, e.signal);
					if (I.value = await ne(e.signal, { space_id: String(t.space_id) }), N.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					J.scheduled_local = t.publish_status === "scheduled" ? Ee(t.scheduled_at) : "", R.value = t.publish_status;
				}
				we = JSON.stringify(J);
			} catch (t) {
				e.signal.aborted || (k.value = l(t), D.value = !0);
			} finally {
				e.signal.aborted || (T.value = !1);
			}
		}
		let Oe = () => !T.value && !D.value && we !== JSON.stringify(J);
		function ke() {
			Oe() ? ue.value = !0 : ae("close");
		}
		function Ae() {
			R.value === "draft" ? Me("draft") : M.value = !0;
		}
		function je() {
			M.value = !1, Me("draft");
		}
		async function Me(e) {
			if (q.value || T.value || D.value || H.value) return;
			X.value = e === "draft" ? "draft" : "publish", Z.value = Date.now(), _e.value = "";
			for (let e of dt) delete ge[e];
			if (be.value) {
				await xe();
				return;
			}
			let t = J.scheduled_local ? new Date(J.scheduled_local) : null;
			E.value = !0, k.value = "";
			try {
				await re("courses", {
					...J,
					id: J.id || void 0,
					row_version: J.id ? J.row_version : void 0,
					difficulty_level: J.difficulty_level || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), we = JSON.stringify(J), te.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "课程已发布"), ae("saved");
			} catch (e) {
				let t = gt(e);
				Object.assign(ge, t.fields), _e.value = t.general;
			} finally {
				E.value = !1;
			}
			be.value && await xe();
		}
		function Ne() {
			W.value = "", U.value = !0;
		}
		async function Pe() {
			if (!(!G.value || T.value || D.value || E.value || H.value)) {
				E.value = !0, W.value = "";
				try {
					await u({
						id: J.id,
						row_version: J.row_version
					}), we = JSON.stringify(J), U.value = !1, te.success("课程已删除"), ae("saved");
				} catch (e) {
					W.value = l(e);
				} finally {
					E.value = !1;
				}
			}
		}
		function Fe(e) {
			ge.cover_url = l(e);
		}
		function Ie() {
			delete ge.cover_url;
		}
		let Le = (e) => {
			Oe() && (e.preventDefault(), e.returnValue = "");
		};
		return pe(() => !E.value && !H.value && (!Oe() || window.confirm("课程有未保存的修改，确定离开？"))), se(() => {
			De(), window.addEventListener("beforeunload", Le);
		}), oe(() => {
			Te?.abort(), window.removeEventListener("beforeunload", Le);
		}), (r, i) => (A(), x("section", {
			ref_key: "editorRoot",
			ref: he,
			class: "course-editor",
			"aria-busy": T.value || E.value
		}, [
			S("header", vt, [
				w(F(a), {
					"icon-only": "",
					title: "返回课程列表",
					"aria-label": "返回课程列表",
					disabled: E.value || H.value,
					onClick: ke
				}, {
					default: B(() => [w(F(_), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				S("div", yt, [S("h2", null, P(n.courseId ? "编辑课程" : "新增课程"), 1), S("span", null, P(I.value?.source_locale || "zh-CN") + " · " + P(N.value), 1)]),
				S("div", bt, [
					G.value ? (A(), y(F(a), {
						key: 0,
						variant: "danger",
						size: "sm",
						disabled: T.value || D.value || E.value || H.value,
						onClick: Ne
					}, {
						default: B(() => [...i[27] ||= [C("删除课程", -1)]]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(F(a), {
						size: "sm",
						disabled: T.value || D.value,
						onClick: i[0] ||= (e) => ce.value = !0
					}, {
						icon: B(() => [w(F(_), {
							name: "search",
							size: 14
						})]),
						default: B(() => [i[28] ||= C("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					K.value ? b("", !0) : (A(), y(F(a), {
						key: 1,
						size: "sm",
						disabled: T.value || D.value || E.value || H.value,
						onClick: Ae
					}, {
						icon: B(() => [w(F(_), {
							name: "save",
							size: 14
						})]),
						default: B(() => [i[29] ||= C("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					_e.value ? (A(), x("span", xt, P(_e.value), 1)) : b("", !0),
					K.value ? b("", !0) : (A(), x("div", St, [be.value ? (A(), x("span", Ct, "还有 " + P(be.value) + " 项待完善", 1)) : b("", !0), me.value ? (A(), y(F(a), {
						key: 1,
						variant: "primary",
						size: "sm",
						disabled: T.value || D.value || H.value,
						loading: E.value,
						onClick: i[1] ||= (e) => Me(J.scheduled_local ? "scheduled" : "published")
					}, {
						icon: B(() => [w(F(_), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: B(() => [C(P(J.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : b("", !0)]))
				])
			]),
			T.value ? (A(), x("div", wt, [w(F(_), {
				name: "loader-circle",
				class: "academy-spin",
				size: 28
			}), i[30] ||= S("span", null, "正在读取课程资料...", -1)])) : D.value ? (A(), x("div", Tt, [w(F(p), {
				type: "error",
				description: k.value,
				closable: !1
			}, null, 8, ["description"]), w(F(a), { onClick: De }, {
				default: B(() => [...i[31] ||= [C("重新加载", -1)]]),
				_: 1
			})])) : (A(), x("div", Et, [S("aside", Dt, [w(F(c), {
				model: J,
				rules: F(Q),
				"label-position": "top",
				onSubmit: i[11] ||= de(() => {}, ["prevent"])
			}, {
				default: B(() => [
					w(F(m), {
						label: "课程分类",
						prop: "category_ids",
						error: ye.value.category_ids,
						required: ""
					}, {
						default: B(() => [w(F(t), {
							modelValue: J.category_ids,
							"onUpdate:modelValue": i[2] ||= (e) => J.category_ids = e,
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
					i[32] ||= S("h3", null, "课程设置", -1),
					w(F(m), {
						label: "课程封面",
						prop: "cover_url",
						error: ye.value.cover_url
					}, {
						default: B(() => [w(Re, {
							modelValue: J.cover_url,
							"onUpdate:modelValue": i[3] ||= (e) => J.cover_url = e,
							label: "课程封面",
							disabled: q.value,
							upload: F(ie),
							onBusyChange: i[4] ||= (e) => H.value = e,
							onStart: i[5] ||= (e) => k.value = "",
							onError: Fe,
							onSuccess: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "课程难度",
						prop: "difficulty_level",
						error: ye.value.difficulty_level
					}, {
						default: B(() => [w(F(t), {
							modelValue: J.difficulty_level,
							"onUpdate:modelValue": i[6] ||= (e) => J.difficulty_level = e,
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
					w(F(m), {
						label: "预计课时(分钟)",
						prop: "estimated_minutes",
						error: ye.value.estimated_minutes
					}, {
						default: B(() => [w(F(ee), {
							modelValue: J.estimated_minutes,
							"onUpdate:modelValue": i[7] ||= (e) => J.estimated_minutes = e,
							min: 1,
							max: 1e5,
							precision: 0,
							disabled: q.value,
							"aria-label": "预计课时"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "前端排序",
						prop: "sort_order",
						error: ye.value.sort_order
					}, {
						default: B(() => [w(F(ee), {
							modelValue: J.sort_order,
							"onUpdate:modelValue": i[8] ||= (e) => J.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: q.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[33] ||= S("h3", null, "发布设置", -1),
					w(F(m), {
						label: "启用状态",
						prop: "is_enabled",
						error: ye.value.is_enabled
					}, {
						default: B(() => [w(F(f), {
							modelValue: J.is_enabled,
							"onUpdate:modelValue": i[9] ||= (e) => J.is_enabled = e,
							disabled: q.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "计划发布时间",
						prop: "scheduled_local",
						error: ye.value.scheduled_local
					}, {
						default: B(() => [w(F(h), {
							modelValue: J.scheduled_local,
							"onUpdate:modelValue": i[10] ||= (e) => J.scheduled_local = e,
							type: "datetime-local",
							disabled: q.value || !me.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])]), S("main", Ot, [w(F(c), {
				model: J,
				rules: F(Q),
				"label-position": "top",
				onSubmit: i[15] ||= de(() => {}, ["prevent"])
			}, {
				default: B(() => [
					w(F(m), {
						label: "标题",
						prop: "title",
						error: ye.value.title,
						required: ""
					}, {
						default: B(() => [w(F(h), {
							modelValue: J.title,
							"onUpdate:modelValue": i[12] ||= (e) => J.title = e,
							maxlength: 255,
							disabled: q.value,
							placeholder: "输入课程标题",
							"aria-label": "课程标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "摘要",
						prop: "summary",
						error: ye.value.summary
					}, {
						default: B(() => [V(S("textarea", {
							"onUpdate:modelValue": i[13] ||= (e) => J.summary = e,
							class: "course-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: q.value,
							"aria-invalid": !!ye.value.summary,
							"aria-label": "课程摘要"
						}, null, 8, kt), [[L, J.summary]])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "正文",
						prop: "body_html",
						error: ye.value.body_html
					}, {
						default: B(() => [w(F(e), {
							modelValue: J.body_html,
							"onUpdate:modelValue": i[14] ||= (e) => J.body_html = e,
							readonly: K.value,
							disabled: E.value,
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
			w(F(s), {
				modelValue: ce.value,
				"onUpdate:modelValue": i[19] ||= (e) => ce.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1,
				onOpened: $
			}, {
				footer: B(() => [w(F(a), {
					variant: "primary",
					onClick: i[18] ||= (e) => ce.value = !1
				}, {
					default: B(() => [...i[34] ||= [C("确定", -1)]]),
					_: 1
				})]),
				default: B(() => [w(F(c), {
					model: J,
					rules: F(Q),
					"label-position": "top",
					onSubmit: i[17] ||= de(() => {}, ["prevent"])
				}, {
					default: B(() => [w(F(m), {
						label: "SEO 描述",
						prop: "seo_description",
						error: ye.value.seo_description
					}, {
						default: B(() => [V(S("textarea", {
							ref_key: "seoInput",
							ref: Y,
							"onUpdate:modelValue": i[16] ||= (e) => J.seo_description = e,
							class: "course-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: q.value,
							"aria-invalid": !!ye.value.seo_description,
							"aria-label": "SEO 描述"
						}, null, 8, At), [[L, J.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			w(F(s), {
				modelValue: U.value,
				"onUpdate:modelValue": i[21] ||= (e) => U.value = e,
				title: "确认删除",
				subtitle: `操作对象：${J.title || "未命名课程"}`,
				width: "460px",
				"panel-class": "course-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !E.value
			}, {
				"header-actions": B(() => [S("span", jt, [w(F(_), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: B(() => [w(F(a), {
					disabled: E.value,
					onClick: i[20] ||= (e) => U.value = !1
				}, {
					default: B(() => [...i[35] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(F(a), {
					variant: "warning",
					loading: E.value,
					onClick: Pe
				}, {
					default: B(() => [...i[36] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: B(() => [w(F(p), {
					class: "course-delete-dialog__notice",
					type: "warning",
					closable: !1,
					"show-icon": !1,
					description: "确定删除这门课程吗？删除后将不再展示，请谨慎操作。"
				}), W.value ? (A(), y(F(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: W.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, [
				"modelValue",
				"subtitle",
				"before-close"
			]),
			w(F(s), {
				modelValue: ue.value,
				"onUpdate:modelValue": i[24] ||= (e) => ue.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: B(() => [w(F(a), { onClick: i[22] ||= (e) => ue.value = !1 }, {
					default: B(() => [...i[37] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(F(a), {
					variant: "primary",
					onClick: i[23] ||= (e) => ae("close")
				}, {
					default: B(() => [...i[38] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			w(F(s), {
				modelValue: M.value,
				"onUpdate:modelValue": i[26] ||= (e) => M.value = e,
				title: "将课程转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: B(() => [w(F(a), { onClick: i[25] ||= (e) => M.value = !1 }, {
					default: B(() => [...i[39] ||= [C("取消", -1)]]),
					_: 1
				}), w(F(a), {
					variant: "primary",
					onClick: je
				}, {
					default: B(() => [...i[40] ||= [C("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, _t));
	}
}), [["__scopeId", "data-v-4bde73b0"]]), Nt = { class: "academy-courses" }, Pt = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = fe(), { formatDateTime: n } = fe(), { academyDifficulties: r, academyPublishStates: o, getAcademyList: s, getAcademyMetadata: c } = rt(), l = j(!1), u = j(), d = (e) => t([`cms_academy:${e}`]), f = j(), p = G(c, (e) => {
			f.value = e;
		}), ee = [
			...me(),
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
		], { proTableBindings: te, reload: m, filters: ie } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
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
		p.bindFilters(ie);
		let h = new AbortController();
		async function g() {
			try {
				f.value = await c(h.signal);
			} catch {}
		}
		function ae(e) {
			u.value = e, l.value = !0;
		}
		function S() {
			l.value = !1, m(), g();
		}
		return se(g), oe(() => h.abort()), (e, t) => (A(), x("div", Nt, [l.value ? (A(), y(Mt, {
			key: 0,
			"course-id": u.value,
			onClose: t[0] ||= (e) => l.value = !1,
			onSaved: S
		}, null, 8, ["course-id"])) : b("", !0), V(w(F(ne), D(F(te), {
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
			"cell-cms_source_type": B(({ row: e }) => [w(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": B(() => [d("add") ? (A(), y(F(a), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => ae()
			}, {
				icon: B(() => [w(F(_), {
					name: "plus",
					size: 14
				})]),
				default: B(() => [t[2] ||= C("新增课程", -1)]),
				_: 1
			})) : b("", !0)]),
			"cell-publish_status": B(({ row: e }) => [w(F(re), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: B(() => [C(P(F(o).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": B(({ row: e }) => [w(F(re), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: B(() => [C(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": B(({ row: e }) => [C(P(F(n)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": B(({ row: e }) => [w(F(a), {
				size: "sm",
				"icon-only": "",
				title: d("edit") ? "编辑课程" : "课程详情",
				"aria-label": d("edit") ? "编辑课程" : "课程详情",
				onClick: (t) => ae(e.id)
			}, {
				default: B(() => [w(F(_), {
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
		}, 16), [[R, !l.value]])]));
	}
}), [["__scopeId", "data-v-0a52bb25"]]);
//#endregion
//#region src/cms/api/content/help.ts
function Ft() {
	let e = fe().request, t = "/cms/help", n = (n, r = {}) => e.get({
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
var It = ["aria-checked", "disabled"], Lt = /*#__PURE__*/ g(/* @__PURE__ */ T({
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
		}, [S("span")], -1), S("span", null, P(e.modelValue ? "已启用" : "已停用"), 1)], 10, It));
	}
}), [["__scopeId", "data-v-5cfe8693"]]), Rt = { class: "help-categories" }, zt = ["aria-busy"], Bt = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Vt = { class: "taxonomy-editor__field" }, Ht = { class: "taxonomy-editor__field" }, Ut = { class: "taxonomy-editor__icon-control" }, Wt = ["title"], Gt = ["aria-label"], Kt = { key: 1 }, qt = {
	key: 0,
	class: "help-hint"
}, Jt = { class: "taxonomy-editor__row" }, Yt = "分类", Xt = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { helpError: n, deleteHelp: o, getHelpMetadata: l, getHelpList: u, getHelpDetail: d, saveHelp: f } = Ft(), { hasPermission: g } = fe(), { formatDateTime: ae } = fe(), T = (e) => g([`cms_help_category:${e}`]), E = j(), O = j(), k = G(l, (e) => {
			E.value = e;
		}), ce = [
			...me(),
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
				formatter: (e) => E.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
		], { proTableBindings: ue, reload: M, filters: N } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
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
					}, ...(E.value?.categories || []).filter((e) => !e.parent_id).map((e) => ({
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
		k.bindFilters(N);
		let I = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			icon_key: "",
			sort_order: 10,
			is_enabled: !0
		}), L = le(I()), R = [...ie], z = new Set(R), V = v(() => z.has(L.icon_key) ? L.icon_key : void 0), H = j(!1), U = j(!1), pe = j(!1), W = j(!1), q = j(!1), J = j(""), he = j(!1), Y = j(""), X = v(() => !T(L.id ? "edit" : "add")), Z = v(() => pe.value || W.value), ge;
		async function _e(e) {
			ge?.abort(), ge = new AbortController();
			let t = ge;
			Object.assign(L, I(), { id: e || "" }), Y.value = "", q.value = !1, J.value = "", he.value = !1, H.value = !0, U.value = !0;
			try {
				if (O.value = await l(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await d("categories", e, t.signal);
				if (O.value = await l(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(L, {
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
				t.signal.aborted || (he.value = !0, Y.value = n(e));
			} finally {
				t.signal.aborted || (U.value = !1);
			}
		}
		function Q() {
			return Z.value ? !1 : (ge?.abort(), !0);
		}
		function ve() {
			Q() && (H.value = !1);
		}
		async function ye() {
			if (!(X.value || Z.value || U.value || he.value)) {
				if (!L.name.trim() || L.sort_order === null) {
					Y.value = "请填写分类名称和排序";
					return;
				}
				if (L.icon_key.length > 128) {
					Y.value = "图标标识最多 128 个字符";
					return;
				}
				pe.value = !0, Y.value = "";
				try {
					await f("categories", {
						name: L.name,
						parent_id: L.parent_id || null,
						icon_key: L.icon_key || null,
						sort_order: L.sort_order,
						is_enabled: L.is_enabled,
						id: L.id || void 0,
						row_version: L.id ? L.row_version : void 0
					}), H.value = !1, te.success("保存成功"), await Promise.all([M(), Ce()]);
				} catch (e) {
					Y.value = n(e);
				} finally {
					pe.value = !1;
				}
			}
		}
		function be() {
			!L.id || !T("delete") || Z.value || U.value || he.value || (J.value = "", q.value = !0);
		}
		async function $() {
			if (!(!q.value || !L.id || !T("delete") || Z.value || U.value || he.value)) {
				W.value = !0, J.value = "";
				try {
					await o("categories", L.id, L.row_version), q.value = !1, H.value = !1, te.success("分类已删除"), await Promise.all([M(), Ce()]);
				} catch (e) {
					J.value = n(e);
				} finally {
					W.value = !1;
				}
			}
		}
		let xe = v(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(O.value?.categories || []).filter((e) => !e.parent_id && e.id !== L.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Se = new AbortController();
		async function Ce() {
			try {
				E.value = await l(Se.signal);
			} catch {}
		}
		return se(Ce), oe(() => {
			ge?.abort(), Se.abort();
		}), (e, n) => (A(), x("div", Rt, [
			w(F(ne), D(F(ue), {
				"auto-refreshable": !1,
				columns: ce,
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
				"cell-cms_source_type": B(({ row: e }) => [w(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": B(() => [T("add") ? (A(), y(F(a), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: n[0] ||= (e) => _e()
				}, {
					icon: B(() => [w(F(_), {
						name: "plus",
						size: 14
					})]),
					default: B(() => [C("新增" + P(Yt))]),
					_: 1
				})) : b("", !0)]),
				"cell-is_enabled": B(({ row: e }) => [w(F(re), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: B(() => [C(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": B(({ row: e }) => [w(F(a), {
					size: "sm",
					"icon-only": "",
					title: T("edit") ? `编辑${Yt}` : `${Yt}详情`,
					"aria-label": `编辑${Yt}`,
					onClick: (t) => _e(e.id)
				}, {
					default: B(() => [w(F(_), {
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
			w(F(s), {
				modelValue: H.value,
				"onUpdate:modelValue": n[6] ||= (e) => H.value = e,
				title: `${L.id ? "编辑" : "新增"}帮助${Yt}`,
				width: "680px",
				subtitle: "帮助分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Q
			}, {
				footer: B(() => [
					L.id && T("delete") ? (A(), y(F(a), {
						key: 0,
						variant: "danger",
						disabled: U.value || he.value || Z.value,
						onClick: be
					}, {
						icon: B(() => [w(F(_), {
							name: "trash-2",
							size: 14
						})]),
						default: B(() => [n[11] ||= C("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(F(a), {
						disabled: Z.value,
						onClick: ve
					}, {
						default: B(() => [...n[12] ||= [C("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					X.value ? b("", !0) : (A(), y(F(a), {
						key: 1,
						variant: "primary",
						loading: pe.value,
						disabled: U.value || he.value || W.value,
						onClick: ye
					}, {
						default: B(() => [C("保存" + P(Yt))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: B(() => [S("div", {
					class: "taxonomy-editor",
					"aria-busy": U.value
				}, [
					U.value ? (A(), x("div", Bt, [w(F(_), {
						name: "loader-circle",
						class: "help-spin",
						size: 24
					}), S("span", null, "正在读取" + P(Yt) + "...")])) : b("", !0),
					Y.value ? (A(), y(F(p), {
						key: 1,
						type: "error",
						closable: !1,
						description: Y.value
					}, null, 8, ["description"])) : b("", !0),
					!U.value && !he.value ? (A(), y(F(c), {
						key: 2,
						model: L,
						"label-position": "top",
						onSubmit: de(ye, ["prevent"])
					}, {
						default: B(() => [
							L.id ? (A(), y(F(m), {
								key: 0,
								label: "分类ID"
							}, {
								default: B(() => [w(F(h), {
									"model-value": L.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : b("", !0),
							w(F(m), {
								label: `${Yt}名称`,
								required: ""
							}, {
								default: B(() => [w(F(h), {
									modelValue: L.name,
									"onUpdate:modelValue": n[1] ||= (e) => L.name = e,
									maxlength: 120,
									disabled: X.value || Z.value,
									"aria-label": `${Yt}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							w(F(m), { label: "父分类" }, {
								default: B(() => [S("div", Vt, [w(F(t), {
									modelValue: L.parent_id,
									"onUpdate:modelValue": n[2] ||= (e) => L.parent_id = e,
									options: xe.value,
									disabled: X.value || Z.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), n[9] ||= S("p", { class: "help-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类文章。 ", -1)])]),
								_: 1
							}),
							w(F(m), { label: "图标标识" }, {
								default: B(() => [S("div", Ht, [
									S("div", Ut, [w(F(r), {
										modelValue: L.icon_key,
										"onUpdate:modelValue": n[3] ||= (e) => L.icon_key = e,
										suggestions: R,
										"min-length": 0,
										disabled: X.value || Z.value,
										clearable: "",
										placeholder: "输入或下拉选择 6mm 图标，例如 circle-help"
									}, {
										option: B(({ option: e }) => [S("span", {
											class: "taxonomy-editor__icon-option",
											title: String(e)
										}, [w(F(_), {
											name: String(e),
											size: 18
										}, null, 8, ["name"]), S("span", null, P(e), 1)], 8, Wt)]),
										_: 1
									}, 8, ["modelValue", "disabled"]), S("span", {
										class: "taxonomy-editor__icon-preview",
										role: "img",
										"aria-label": V.value ? `图标预览：${V.value}` : "暂无图标预览"
									}, [V.value ? (A(), y(F(_), {
										key: 0,
										name: V.value,
										size: 20
									}, null, 8, ["name"])) : (A(), x("span", Kt, "—"))], 8, Gt)]),
									n[10] ||= S("p", { class: "help-hint" }, " 支持直接输入名称或从下拉列表选择；不填写 SVG 或 HTML。 ", -1),
									L.icon_key && !V.value ? (A(), x("p", qt, " 当前名称不在已安装的 6mm 图标库中，暂无法预览。 ")) : b("", !0)
								])]),
								_: 1
							}),
							S("div", Jt, [w(F(m), {
								label: "前端排序",
								required: ""
							}, {
								default: B(() => [w(F(ee), {
									modelValue: L.sort_order,
									"onUpdate:modelValue": n[4] ||= (e) => L.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: X.value || Z.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), w(F(m), { label: "启用状态" }, {
								default: B(() => [w(Lt, {
									modelValue: L.is_enabled,
									"onUpdate:modelValue": n[5] ||= (e) => L.is_enabled = e,
									disabled: X.value || Z.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : b("", !0)
				], 8, zt)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			w(F(s), {
				modelValue: q.value,
				"onUpdate:modelValue": n[8] ||= (e) => q.value = e,
				title: "删除帮助分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !W.value
			}, {
				footer: B(() => [w(F(a), {
					disabled: W.value,
					onClick: n[7] ||= (e) => q.value = !1
				}, {
					default: B(() => [...n[13] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(F(a), {
					variant: "danger",
					loading: W.value,
					onClick: $
				}, {
					default: B(() => [...n[14] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: B(() => [S("p", null, "确认删除分类“" + P(L.name) + "”？有关联文章或子分类的分类无法删除。", 1), J.value ? (A(), y(F(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: J.value
				}, null, 8, ["description"])) : b("", !0)]),
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
}, mn = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(n, { emit: r }) {
		let { helpError: i, helpCategoryLabel: o, deleteHelp: l, getHelpDetail: u, getHelpMetadata: d, getHelpList: f, saveHelp: ne, uploadHelpCover: re } = Ft(), { hasPermission: ie } = fe(), g = n, T = r, E = j(!0), D = j(!1), O = j(!1), k = j(""), ce = j(!1), ue = j(!1), M = j(!1), N = j(!1), I = j(fe().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), R = j(), z = j("draft"), U = j(!1), W = v(() => ie(["cms_help:publish"])), me = v(() => !ie([`cms_help:${g.articleId ? "edit" : "add"}`]) || !W.value && z.value !== "draft"), G = v(() => ie(["cms_help:delete"]) && (W.value || z.value === "draft"));
		async function K() {
			if (!(!G.value || D.value || E.value || O.value)) {
				D.value = !0, k.value = "";
				try {
					await l("articles", J.id, J.row_version), De = JSON.stringify(J), te.success("文章已删除"), T("saved");
				} catch (e) {
					k.value = i(e), N.value = !1;
				} finally {
					D.value = !1;
				}
			}
		}
		let q = v(() => me.value || D.value), J = le({
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
		}), { editorRoot: he, seoInput: Y, fieldRules: X, fieldErrors: Z, pendingCount: ge, saveError: _e, validateSave: Q, setSaveFailure: ve, focusFirstError: ye, focusSeoError: be } = Se(J, () => R.value?.categories || [], "help", ce), $ = j(""), xe = j(!1), Ce = j([]), we = v(() => Ce.value.filter((e) => e.id !== g.articleId).map((e) => ({
			label: `${e.title} · ${e.code}`,
			value: e.id
		})));
		async function Te() {
			if (!(q.value || xe.value)) {
				xe.value = !0;
				try {
					let e = await f("articles", {
						keyword: $.value,
						page_size: 100
					}, Oe?.signal), t = Ce.value.filter((e) => J.related_content_ids.includes(e.id));
					Ce.value = [...new Map([...t, ...e.lists].map((e) => [e.id, e])).values()];
				} catch (e) {
					Oe?.signal.aborted || (k.value = i(e));
				} finally {
					xe.value = !1;
				}
			}
		}
		let Ee = v(() => (R.value?.categories || []).map((e) => ({
			label: o(R.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
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
			E.value = !0, O.value = !1, k.value = "";
			try {
				if (R.value = await d(e.signal, { cms_source_type: "platform" }), g.articleId) {
					let t = await u("articles", g.articleId, e.signal);
					if (R.value = await d(e.signal, { space_id: String(t.space_id) }), I.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					J.scheduled_local = t.publish_status === "scheduled" ? ke(t.scheduled_at) : "", z.value = t.publish_status;
				}
				De = JSON.stringify(J);
			} catch (t) {
				e.signal.aborted || (k.value = i(t), O.value = !0);
			} finally {
				e.signal.aborted || (E.value = !1);
			}
		}
		let je = () => !E.value && !O.value && De !== JSON.stringify(J);
		function Me() {
			je() ? ue.value = !0 : T("close");
		}
		function Ne() {
			z.value === "draft" ? Fe("draft") : M.value = !0;
		}
		function Pe() {
			M.value = !1, Fe("draft");
		}
		async function Fe(e) {
			if (q.value || E.value || O.value || U.value || (k.value = "", !await Q(e))) return;
			let t = J.scheduled_local ? new Date(J.scheduled_local) : null;
			D.value = !0, k.value = "";
			try {
				await ne("articles", {
					...J,
					id: J.id || void 0,
					row_version: J.id ? J.row_version : void 0,
					category_id: J.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), De = JSON.stringify(J), te.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "文章已发布"), T("saved");
			} catch (e) {
				ve(e);
			} finally {
				D.value = !1;
			}
			ge.value && await ye();
		}
		function Ie(e) {
			k.value = i(e);
		}
		let Le = (e) => {
			je() && (e.preventDefault(), e.returnValue = "");
		};
		return pe(() => !D.value && !U.value && (!je() || window.confirm("文章有未保存的修改，确定离开？"))), se(() => {
			Ae(), window.addEventListener("beforeunload", Le);
		}), oe(() => {
			Oe?.abort(), window.removeEventListener("beforeunload", Le);
		}), (r, i) => (A(), x("section", {
			ref_key: "editorRoot",
			ref: he,
			class: "article-editor",
			"aria-busy": E.value || D.value
		}, [
			S("header", Qt, [
				w(F(a), {
					"icon-only": "",
					title: "返回文章列表",
					"aria-label": "返回文章列表",
					disabled: D.value || U.value,
					onClick: Me
				}, {
					default: B(() => [w(F(_), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				S("div", $t, [S("h2", null, P(n.articleId ? "编辑文章" : "新增文章"), 1), S("span", null, P(R.value?.source_locale || "zh-CN") + " · " + P(I.value), 1)]),
				S("div", en, [
					n.articleId && G.value ? (A(), y(F(a), {
						key: 0,
						size: "sm",
						disabled: E.value || O.value || D.value || U.value,
						onClick: i[0] ||= (e) => N.value = !0
					}, {
						default: B(() => [...i[32] ||= [C("删除文章", -1)]]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(F(a), {
						size: "sm",
						disabled: E.value || O.value,
						onClick: i[1] ||= (e) => ce.value = !0
					}, {
						icon: B(() => [w(F(_), {
							name: "search",
							size: 14
						})]),
						default: B(() => [i[33] ||= C("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					me.value ? b("", !0) : (A(), y(F(a), {
						key: 1,
						size: "sm",
						disabled: E.value || O.value || D.value || U.value,
						onClick: Ne
					}, {
						icon: B(() => [w(F(_), {
							name: "save",
							size: 14
						})]),
						default: B(() => [i[34] ||= C("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					F(_e) ? (A(), x("span", tn, P(F(_e)), 1)) : b("", !0),
					!me.value && F(ge) ? (A(), x("span", nn, "还有 " + P(F(ge)) + " 项待完善", 1)) : b("", !0),
					!me.value && W.value ? (A(), y(F(a), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: E.value || O.value || U.value,
						loading: D.value,
						onClick: i[2] ||= (e) => Fe(J.scheduled_local ? "scheduled" : "published")
					}, {
						icon: B(() => [w(F(_), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: B(() => [C(P(J.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : b("", !0)
				])
			]),
			E.value ? (A(), x("div", rn, [w(F(_), {
				name: "loader-circle",
				class: "help-spin",
				size: 28
			}), i[35] ||= S("span", null, "正在读取文章资料...", -1)])) : O.value ? (A(), x("div", an, [w(F(p), {
				type: "error",
				description: k.value,
				closable: !1
			}, null, 8, ["description"]), w(F(a), { onClick: Ae }, {
				default: B(() => [...i[36] ||= [C("重新加载", -1)]]),
				_: 1
			})])) : (A(), x(ae, { key: 2 }, [k.value ? (A(), x("div", on, [w(F(p), {
				type: "error",
				description: k.value,
				closable: !1
			}, null, 8, ["description"])])) : b("", !0), S("div", sn, [S("aside", cn, [w(F(c), {
				model: J,
				rules: F(X),
				"label-position": "top",
				onSubmit: i[16] ||= de(() => {}, ["prevent"])
			}, {
				default: B(() => [
					w(F(m), {
						label: "文章分类",
						prop: "category_id",
						error: F(Z).category_id,
						required: ""
					}, {
						default: B(() => [w(F(t), {
							modelValue: J.category_id,
							"onUpdate:modelValue": i[3] ||= (e) => J.category_id = e,
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
					i[39] ||= S("h3", null, "文章设置", -1),
					w(F(m), {
						label: "文章封面",
						prop: "cover_url",
						error: F(Z).cover_url
					}, {
						default: B(() => [w(Re, {
							modelValue: J.cover_url,
							"onUpdate:modelValue": i[4] ||= (e) => J.cover_url = e,
							label: "文章封面",
							disabled: q.value,
							upload: F(re),
							onBusyChange: i[5] ||= (e) => U.value = e,
							onStart: i[6] ||= (e) => k.value = "",
							onError: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "内容来源",
						prop: "content_source",
						error: F(Z).content_source
					}, {
						default: B(() => [w(F(h), {
							modelValue: J.content_source,
							"onUpdate:modelValue": i[7] ||= (e) => J.content_source = e,
							maxlength: 160,
							disabled: q.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "作者署名",
						prop: "author_name",
						error: F(Z).author_name
					}, {
						default: B(() => [w(F(h), {
							modelValue: J.author_name,
							"onUpdate:modelValue": i[8] ||= (e) => J.author_name = e,
							maxlength: 120,
							disabled: q.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "前端排序",
						prop: "sort_order",
						error: F(Z).sort_order
					}, {
						default: B(() => [w(F(ee), {
							modelValue: J.sort_order,
							"onUpdate:modelValue": i[9] ||= (e) => J.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: q.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[40] ||= S("h3", null, "发布设置", -1),
					w(F(m), {
						label: "搜索关键词",
						prop: "search_keywords",
						error: F(Z).search_keywords
					}, {
						default: B(() => [w(F(h), {
							modelValue: J.search_keywords,
							"onUpdate:modelValue": i[10] ||= (e) => J.search_keywords = e,
							maxlength: 2e3,
							disabled: q.value,
							placeholder: "使用空格或逗号分隔",
							"aria-label": "搜索关键词"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: F(Z).helpful_enabled
					}, {
						default: B(() => [w(Lt, {
							modelValue: J.helpful_enabled,
							"onUpdate:modelValue": i[11] ||= (e) => J.helpful_enabled = e,
							disabled: q.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "相关文章",
						prop: "related_content_ids",
						error: F(Z).related_content_ids
					}, {
						default: B(() => [S("div", ln, [
							w(F(h), {
								modelValue: $.value,
								"onUpdate:modelValue": i[12] ||= (e) => $.value = e,
								disabled: q.value,
								placeholder: "搜索文章标题",
								"aria-label": "搜索相关文章",
								onKeydown: H(de(Te, ["prevent"]), ["enter"])
							}, null, 8, [
								"modelValue",
								"disabled",
								"onKeydown"
							]),
							w(F(a), {
								size: "sm",
								disabled: q.value,
								loading: xe.value,
								onClick: Te
							}, {
								default: B(() => [...i[37] ||= [C("查找文章", -1)]]),
								_: 1
							}, 8, ["disabled", "loading"]),
							w(F(t), {
								modelValue: J.related_content_ids,
								"onUpdate:modelValue": i[13] ||= (e) => J.related_content_ids = e,
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
							i[38] ||= S("p", { class: "article-editor__hint" }, " 最多 20 篇，按选择顺序展示。可关联草稿，前台须按发布状态过滤。 ", -1)
						])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "启用状态",
						prop: "is_enabled",
						error: F(Z).is_enabled
					}, {
						default: B(() => [w(Lt, {
							modelValue: J.is_enabled,
							"onUpdate:modelValue": i[14] ||= (e) => J.is_enabled = e,
							disabled: q.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: F(Z).scheduled_local
					}, {
						default: B(() => [w(F(h), {
							modelValue: J.scheduled_local,
							"onUpdate:modelValue": i[15] ||= (e) => J.scheduled_local = e,
							type: "datetime-local",
							disabled: q.value || !W.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[41] ||= S("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), S("main", un, [w(F(c), {
				model: J,
				rules: F(X),
				"label-position": "top",
				onSubmit: i[20] ||= de(() => {}, ["prevent"])
			}, {
				default: B(() => [
					w(F(m), {
						label: "标题",
						prop: "title",
						error: F(Z).title,
						required: ""
					}, {
						default: B(() => [w(F(h), {
							modelValue: J.title,
							"onUpdate:modelValue": i[17] ||= (e) => J.title = e,
							maxlength: 255,
							disabled: q.value,
							placeholder: "输入文章标题",
							"aria-label": "文章标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "摘要",
						prop: "summary",
						error: F(Z).summary
					}, {
						default: B(() => [V(S("textarea", {
							"onUpdate:modelValue": i[18] ||= (e) => J.summary = e,
							"aria-invalid": !!F(Z).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: q.value,
							"aria-label": "文章摘要"
						}, null, 8, dn), [[L, J.summary]])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "正文",
						prop: "body_html",
						error: F(Z).body_html
					}, {
						default: B(() => [w(F(e), {
							modelValue: J.body_html,
							"onUpdate:modelValue": i[19] ||= (e) => J.body_html = e,
							readonly: me.value,
							disabled: D.value,
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
			w(F(s), {
				modelValue: ce.value,
				"onUpdate:modelValue": i[24] ||= (e) => ce.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: B(() => [w(F(a), {
					variant: "primary",
					onClick: i[23] ||= (e) => ce.value = !1
				}, {
					default: B(() => [...i[42] ||= [C("确定", -1)]]),
					_: 1
				})]),
				default: B(() => [w(F(c), {
					model: J,
					rules: F(X),
					"label-position": "top",
					onSubmit: i[22] ||= de(() => {}, ["prevent"])
				}, {
					default: B(() => [w(F(m), {
						label: "SEO 描述",
						prop: "seo_description",
						error: F(Z).seo_description
					}, {
						default: B(() => [V(S("textarea", {
							ref_key: "seoInput",
							ref: Y,
							"onUpdate:modelValue": i[21] ||= (e) => J.seo_description = e,
							"aria-invalid": !!F(Z).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: q.value,
							"aria-label": "SEO 描述"
						}, null, 8, fn), [[L, J.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			w(F(s), {
				modelValue: N.value,
				"onUpdate:modelValue": i[26] ||= (e) => N.value = e,
				title: "确认删除",
				subtitle: `操作对象：${J.title || "未命名文章"}`,
				width: "460px",
				"panel-class": "help-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !D.value
			}, {
				"header-actions": B(() => [S("span", pn, [w(F(_), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: B(() => [w(F(a), {
					disabled: D.value,
					onClick: i[25] ||= (e) => N.value = !1
				}, {
					default: B(() => [...i[43] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(F(a), {
					variant: "warning",
					loading: D.value,
					onClick: K
				}, {
					default: B(() => [...i[44] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: B(() => [w(F(p), {
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
			w(F(s), {
				modelValue: ue.value,
				"onUpdate:modelValue": i[29] ||= (e) => ue.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: B(() => [w(F(a), { onClick: i[27] ||= (e) => ue.value = !1 }, {
					default: B(() => [...i[45] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(F(a), {
					variant: "primary",
					onClick: i[28] ||= (e) => T("close")
				}, {
					default: B(() => [...i[46] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			w(F(s), {
				modelValue: M.value,
				"onUpdate:modelValue": i[31] ||= (e) => M.value = e,
				title: "将文章转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: B(() => [w(F(a), { onClick: i[30] ||= (e) => M.value = !1 }, {
					default: B(() => [...i[47] ||= [C("取消", -1)]]),
					_: 1
				}), w(F(a), {
					variant: "primary",
					onClick: Pe
				}, {
					default: B(() => [...i[48] ||= [C("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Zt));
	}
}), [["__scopeId", "data-v-16f68391"]]), hn = { class: "help-articles" }, gn = {
	key: 0,
	class: "help-statistics-note"
}, _n = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let t = fe(), { helpPublishStates: n, helpCategoryLabel: r, getHelpList: o, getHelpMetadata: s } = Ft(), { hasPermission: c } = fe(), { formatDateTime: l } = fe(), u = j(!1), d = j(), f = (e) => c([`cms_help:${e}`]), p = j(), ee = G(s, (e) => {
			p.value = e;
		}), te = [
			...me(),
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
				formatter: (e) => r(p.value, e)
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
		], { proTableBindings: m, reload: ie, filters: h } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
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
		ee.bindFilters(h);
		let g = new AbortController();
		async function ae() {
			try {
				p.value = await s(g.signal);
			} catch {}
		}
		function S(e) {
			d.value = e, u.value = !0;
		}
		function T() {
			u.value = !1, ie(), ae();
		}
		return se(ae), oe(() => g.abort()), (e, r) => (A(), x("div", hn, [
			!u.value && F(t).mode === "platform" ? (A(), x("p", gn, " 当前管理平台默认模板。浏览量、评价数及有帮助率属于站点运行数据，此处显示“—”，不汇总白标站点。 ")) : b("", !0),
			u.value ? (A(), y(mn, {
				key: 1,
				"article-id": d.value,
				onClose: r[0] ||= (e) => u.value = !1,
				onSaved: T
			}, null, 8, ["article-id"])) : b("", !0),
			V(w(F(ne), D(F(m), {
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
				"cell-cms_source_type": B(({ row: e }) => [w(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": B(() => [f("add") ? (A(), y(F(a), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[1] ||= (e) => S()
				}, {
					icon: B(() => [w(F(_), {
						name: "plus",
						size: 14
					})]),
					default: B(() => [r[2] ||= C("新增文章", -1)]),
					_: 1
				})) : b("", !0)]),
				"cell-publish_status": B(({ row: e }) => [w(F(re), {
					size: "sm",
					effect: "soft",
					type: e.publish_status === "published" ? "success" : "warning"
				}, {
					default: B(() => [C(P(F(n).find((t) => t.value === e.publish_status)?.label), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-is_enabled": B(({ row: e }) => [w(F(re), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: B(() => [C(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-publish_time": B(({ row: e }) => [C(P(F(l)(e.published_at || e.scheduled_at)), 1)]),
				"cell-actions": B(({ row: e }) => [w(F(a), {
					size: "sm",
					"icon-only": "",
					title: f("edit") ? "编辑文章" : "文章详情",
					"aria-label": f("edit") ? "编辑文章" : "文章详情",
					onClick: (t) => S(e.id)
				}, {
					default: B(() => [w(F(_), {
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
			}, 16), [[R, !u.value]])
		]));
	}
}), [["__scopeId", "data-v-e3373337"]]);
//#endregion
//#region src/cms/api/content/feedback.ts
function vn() {
	let e = fe().request, t = "/cms/feedback", n = (n, r) => e.get({
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
}, Tn = { class: "attachment-title" }, En = ["src", "alt"], Dn = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { getFeedbackList: t, getFeedbackMetadata: n, getFeedbackDetail: r, getFeedbackAttachment: o, feedbackSourceTypes: c, feedbackSourceLabel: l, feedbackError: u } = vn(), { formatDateTime: d } = fe(), f = j({
			scenes: [],
			issues: []
		}), ee = G(n, (e) => {
			f.value = e;
		}), te = [
			...me(),
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
		], { proTableBindings: m, filters: ie } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
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
		ee.bindFilters(ie);
		let h = j(!1), g = j(!1), T = j(""), E = j(), O = j({}), k = j(""), ce, le = new AbortController();
		async function M(e) {
			ce?.abort();
			let t = new AbortController();
			ce = t, E.value = void 0, O.value = {}, T.value = "", k.value = "", h.value = !0, g.value = !0;
			try {
				let n = await r(e, t.signal);
				t.signal.aborted || (E.value = n);
			} catch (e) {
				t.signal.aborted || (T.value = u(e));
			} finally {
				t.signal.aborted || (g.value = !1);
			}
		}
		async function N(e) {
			let t = ce, n = E.value?.id;
			if (!(!t || !n || k.value)) {
				k.value = e, T.value = "";
				try {
					let r = await o(n, e, t.signal);
					!t.signal.aborted && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(r.data_url) && (O.value[e] = r.data_url);
				} catch (e) {
					t.signal.aborted || (T.value = u(e));
				} finally {
					t.signal.aborted || (k.value = "");
				}
			}
		}
		return z(h, (e) => {
			e || (ce?.abort(), E.value = void 0, O.value = {}, T.value = "");
		}), se(async () => {
			try {
				f.value = await n(le.signal);
			} catch {}
		}), oe(() => {
			le.abort(), ce?.abort();
		}), (e, t) => (A(), x("div", yn, [w(F(ne), D(F(m), {
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
			"cell-cms_source_type": B(({ row: e }) => [w(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"cell-source_type": B(({ row: e }) => [w(F(re), {
				size: "sm",
				effect: "soft",
				type: e.source_type === "merchant" ? "warning" : e.source_type === "platform" ? "success" : "primary"
			}, {
				default: B(() => [C(P(F(l)(e.source_type)), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-actions": B(({ row: e }) => [w(F(a), {
				size: "sm",
				"icon-only": "",
				title: "查看反馈",
				"aria-label": "查看反馈",
				onClick: (t) => M(e.id)
			}, {
				default: B(() => [w(F(_), {
					name: "eye",
					size: 15
				})]),
				_: 1
			}, 8, ["onClick"])]),
			_: 1
		}, 16), w(F(s), {
			modelValue: h.value,
			"onUpdate:modelValue": t[1] ||= (e) => h.value = e,
			title: "反馈详情",
			subtitle: E.value?.code || "查看用户正式提交的意见反馈",
			width: "760px",
			"close-on-click-modal": !1
		}, {
			footer: B(() => [w(F(a), { onClick: t[0] ||= (e) => h.value = !1 }, {
				default: B(() => [...t[14] ||= [C("关闭", -1)]]),
				_: 1
			})]),
			default: B(() => [S("div", {
				class: "feedback-detail",
				"aria-busy": g.value
			}, [
				g.value ? (A(), x("p", xn, "正在读取反馈…")) : b("", !0),
				T.value ? (A(), y(F(p), {
					key: 1,
					type: "error",
					closable: !1,
					description: T.value
				}, null, 8, ["description"])) : b("", !0),
				E.value && !g.value ? (A(), x(ae, { key: 2 }, [
					S("dl", Sn, [
						S("div", null, [t[2] ||= S("dt", null, "UID", -1), S("dd", null, P(E.value.public_user_id_snapshot), 1)]),
						S("div", null, [t[3] ||= S("dt", null, "用户账号", -1), S("dd", null, P(E.value.username_snapshot || "—"), 1)]),
						S("div", null, [t[4] ||= S("dt", null, "来源类型", -1), S("dd", null, P(F(l)(E.value.source_type)), 1)]),
						S("div", null, [t[5] ||= S("dt", null, "来源名称", -1), S("dd", null, P(E.value.source_name_snapshot || "—"), 1)]),
						S("div", null, [t[6] ||= S("dt", null, "业务场景", -1), S("dd", null, P(E.value.scene_name_snapshot), 1)]),
						S("div", null, [t[7] ||= S("dt", null, "问题分类", -1), S("dd", null, P(E.value.issue_category_name_snapshot), 1)]),
						S("div", null, [t[8] ||= S("dt", null, "联系方式（脱敏）", -1), S("dd", null, P(E.value.contact_display), 1)]),
						S("div", null, [t[9] ||= S("dt", null, "提交时间", -1), S("dd", null, P(F(d)(E.value.submitted_at)), 1)])
					]),
					S("section", null, [t[10] ||= S("h3", null, "反馈内容", -1), S("div", Cn, P(E.value.content), 1)]),
					S("section", null, [
						S("h3", null, [t[11] ||= C(" 附件 ", -1), S("span", null, P(E.value.attachments?.length || 0), 1)]),
						E.value.attachments?.length ? b("", !0) : (A(), x("p", wn, "暂无附件")),
						(A(!0), x(ae, null, ue(E.value.attachments, (e) => (A(), x("div", {
							key: e.id,
							class: "feedback-attachment"
						}, [S("div", Tn, [S("span", null, P(e.original_name || "图片附件") + " · " + P(Math.ceil(e.byte_size / 1024)) + " KB", 1), w(F(a), {
							size: "sm",
							loading: k.value === e.id,
							onClick: (t) => N(e.id)
						}, {
							default: B(() => [...t[12] ||= [C("查看图片", -1)]]),
							_: 1
						}, 8, ["loading", "onClick"])]), O.value[e.id] ? (A(), x("img", {
							key: 0,
							src: O.value[e.id],
							alt: e.original_name || "反馈图片"
						}, null, 8, En)) : b("", !0)]))), 128))
					]),
					t[13] ||= S("p", { class: "muted" }, "来源和分类为提交时快照；此页面仅查看，不修改用户原始反馈。", -1)
				], 64)) : b("", !0)
			], 8, bn)]),
			_: 1
		}, 8, ["modelValue", "subtitle"])]));
	}
}), [["__scopeId", "data-v-ed508c88"]]);
//#endregion
//#region src/cms/api/content/announcement.ts
function On() {
	let e = fe().request, t = "/cms/announcement", n = (n, r = {}) => e.get({
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
}, Mn = { class: "taxonomy-editor__field" }, Nn = { class: "taxonomy-editor__row" }, Pn = "分类", Fn = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { hasPermission: n } = fe(), { formatDateTime: r } = fe(), { announcementError: o, deleteAnnouncement: l, getAnnouncementMetadata: u, getAnnouncementList: d, getAnnouncementDetail: f, saveAnnouncement: ie } = On(), g = (e) => n([`cms_announcement_category:${e}`]), ae = j(), T = j(), E = G(u, (e) => {
			ae.value = e;
		}), O = [
			...me(),
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
				formatter: (e) => ae.value?.categories.find((t) => t.id === e)?.name || "一级分类"
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
		], { proTableBindings: k, reload: ce, filters: ue } = i({
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
		E.bindFilters(ue);
		let M = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), N = le(M()), I = j(!1), L = j(!1), R = j(!1), z = j(!1), V = j(!1), H = j(""), U = j(!1), pe = j(""), W = j(!1), q = v(() => !g(N.id ? "edit" : "add")), J = v(() => R.value || z.value), Y = "", X;
		async function Z(e) {
			X?.abort(), X = new AbortController();
			let t = X;
			Object.assign(N, M(), { id: e || "" }), pe.value = "", V.value = !1, H.value = "", U.value = !1, I.value = !0, L.value = !0, Y = JSON.stringify(N);
			try {
				if (T.value = await u(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await f("categories", e, t.signal);
				if (T.value = await u(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(N, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), Y = JSON.stringify(N);
			} catch (e) {
				t.signal.aborted || (U.value = !0, pe.value = o(e));
			} finally {
				t.signal.aborted || (L.value = !1);
			}
		}
		function ge() {
			return J.value ? !1 : !L.value && !U.value && JSON.stringify(N) !== Y ? (W.value = !0, !1) : (X?.abort(), !0);
		}
		function _e() {
			ge() && (I.value = !1);
		}
		function Q() {
			X?.abort(), W.value = !1, I.value = !1;
		}
		async function ve() {
			if (!(q.value || J.value || L.value || U.value)) {
				if (!N.name.trim() || N.sort_order === null) {
					pe.value = "请填写分类名称和排序";
					return;
				}
				R.value = !0, pe.value = "";
				try {
					await ie("categories", {
						name: N.name,
						parent_id: N.parent_id || null,
						sort_order: N.sort_order,
						is_enabled: N.is_enabled,
						id: N.id || void 0,
						row_version: N.id ? N.row_version : void 0
					}), I.value = !1, te.success("保存成功"), await Promise.all([ce(), Se()]);
				} catch (e) {
					pe.value = o(e);
				} finally {
					R.value = !1;
				}
			}
		}
		function ye() {
			!N.id || !g("delete") || J.value || L.value || U.value || (H.value = "", V.value = !0);
		}
		async function be() {
			if (!(!V.value || !N.id || !g("delete") || J.value || L.value || U.value)) {
				z.value = !0, H.value = "";
				try {
					await l("categories", N.id, N.row_version), V.value = !1, I.value = !1, te.success("分类已删除"), await Promise.all([ce(), Se()]);
				} catch (e) {
					H.value = o(e);
				} finally {
					z.value = !1;
				}
			}
		}
		let $ = v(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(T.value?.categories || []).filter((e) => !e.parent_id && e.id !== N.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), xe = new AbortController();
		async function Se() {
			try {
				ae.value = await u(xe.signal);
			} catch {}
		}
		return se(Se), oe(() => {
			X?.abort(), xe.abort();
		}), (e, n) => (A(), x("div", kn, [
			w(F(ne), D(F(k), {
				"auto-refreshable": !1,
				columns: O,
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
				"cell-cms_source_type": B(({ row: e }) => [w(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": B(() => [g("add") ? (A(), y(F(a), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: n[0] ||= (e) => Z()
				}, {
					icon: B(() => [w(F(_), {
						name: "plus",
						size: 14
					})]),
					default: B(() => [C("新增" + P(Pn))]),
					_: 1
				})) : b("", !0)]),
				"cell-is_enabled": B(({ row: e }) => [w(F(re), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: B(() => [C(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": B(({ row: e }) => [w(F(a), {
					size: "sm",
					"icon-only": "",
					title: g("edit") ? `编辑${Pn}` : `${Pn}详情`,
					"aria-label": g("edit") ? `编辑${Pn}` : `${Pn}详情`,
					onClick: (t) => Z(e.id)
				}, {
					default: B(() => [w(F(_), {
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
			w(F(s), {
				modelValue: I.value,
				"onUpdate:modelValue": n[5] ||= (e) => I.value = e,
				title: `${N.id ? "编辑" : "新增"}公告${Pn}`,
				width: "680px",
				subtitle: "公告分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": ge
			}, {
				footer: B(() => [
					N.id && g("delete") ? (A(), y(F(a), {
						key: 0,
						variant: "danger",
						disabled: L.value || U.value || J.value,
						onClick: ye
					}, {
						icon: B(() => [w(F(_), {
							name: "trash-2",
							size: 14
						})]),
						default: B(() => [n[11] ||= C("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(F(a), {
						disabled: J.value,
						onClick: _e
					}, {
						default: B(() => [...n[12] ||= [C("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					q.value ? b("", !0) : (A(), y(F(a), {
						key: 1,
						variant: "primary",
						loading: R.value,
						disabled: L.value || U.value || z.value,
						onClick: ve
					}, {
						default: B(() => [C("保存" + P(Pn))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: B(() => [S("div", {
					class: "taxonomy-editor",
					"aria-busy": L.value
				}, [
					L.value ? (A(), x("div", jn, [w(F(_), {
						name: "loader-circle",
						class: "announcement-spin",
						size: 24
					}), S("span", null, "正在读取" + P(Pn) + "...")])) : b("", !0),
					pe.value ? (A(), y(F(p), {
						key: 1,
						type: "error",
						closable: !1,
						description: pe.value
					}, null, 8, ["description"])) : b("", !0),
					!L.value && !U.value ? (A(), y(F(c), {
						key: 2,
						model: N,
						"label-position": "top",
						onSubmit: de(ve, ["prevent"])
					}, {
						default: B(() => [
							N.id ? (A(), y(F(m), {
								key: 0,
								label: "分类ID"
							}, {
								default: B(() => [w(F(h), {
									"model-value": N.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : b("", !0),
							w(F(m), {
								label: `${Pn}名称`,
								required: ""
							}, {
								default: B(() => [w(F(h), {
									modelValue: N.name,
									"onUpdate:modelValue": n[1] ||= (e) => N.name = e,
									maxlength: 120,
									disabled: q.value || J.value,
									"aria-label": `${Pn}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							w(F(m), { label: "父分类" }, {
								default: B(() => [S("div", Mn, [w(F(t), {
									modelValue: N.parent_id,
									"onUpdate:modelValue": n[2] ||= (e) => N.parent_id = e,
									options: $.value,
									disabled: q.value || J.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), n[10] ||= S("p", { class: "announcement-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类公告。 ", -1)])]),
								_: 1
							}),
							S("div", Nn, [w(F(m), {
								label: "前端排序",
								required: ""
							}, {
								default: B(() => [w(F(ee), {
									modelValue: N.sort_order,
									"onUpdate:modelValue": n[3] ||= (e) => N.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: q.value || J.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), w(F(m), { label: "启用状态" }, {
								default: B(() => [w(he, {
									modelValue: N.is_enabled,
									"onUpdate:modelValue": n[4] ||= (e) => N.is_enabled = e,
									disabled: q.value || J.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : b("", !0)
				], 8, An)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			w(F(s), {
				modelValue: V.value,
				"onUpdate:modelValue": n[7] ||= (e) => V.value = e,
				title: "删除公告分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !z.value
			}, {
				footer: B(() => [w(F(a), {
					disabled: z.value,
					onClick: n[6] ||= (e) => V.value = !1
				}, {
					default: B(() => [...n[13] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(F(a), {
					variant: "danger",
					loading: z.value,
					onClick: be
				}, {
					default: B(() => [...n[14] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: B(() => [S("p", null, "确认删除分类“" + P(N.name) + "”？有关联公告或子分类的分类无法删除。", 1), H.value ? (A(), y(F(p), {
					key: 0,
					type: "error",
					closable: !1,
					description: H.value
				}, null, 8, ["description"])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			w(F(s), {
				modelValue: W.value,
				"onUpdate:modelValue": n[9] ||= (e) => W.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: B(() => [w(F(a), { onClick: n[8] ||= (e) => W.value = !1 }, {
					default: B(() => [...n[15] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(F(a), {
					variant: "primary",
					onClick: Q
				}, {
					default: B(() => [...n[16] ||= [C("放弃修改", -1)]]),
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
}, Zn = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(n, { emit: r }) {
		let { hasPermission: i } = fe(), { announcementError: o, announcementCategoryLabel: l, deleteAnnouncement: u, getAnnouncementDetail: d, getAnnouncementMetadata: f, saveAnnouncement: ne, uploadAnnouncementCover: re } = On(), ie = n, g = r, T = j(!0), E = j(!1), D = j(!1), O = j(""), k = j(!1), ce = j(!1), ue = j(!1), M = j(!1), N = j(fe().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), I = j(), R = j("draft"), z = j(!1), H = v(() => i(["cms_announcement:publish"])), U = v(() => !i([`cms_announcement:${ie.articleId ? "edit" : "add"}`]) || !H.value && R.value !== "draft"), W = v(() => i(["cms_announcement:delete"]) && (H.value || R.value === "draft"));
		async function me() {
			if (!(!W.value || E.value || T.value || D.value)) {
				E.value = !0, O.value = "";
				try {
					await u("articles", K.id, K.row_version), be = JSON.stringify(K), te.success("公告已删除"), g("saved");
				} catch (e) {
					O.value = o(e), M.value = !1;
				} finally {
					E.value = !1;
				}
			}
		}
		let G = v(() => U.value || E.value), K = le({
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
		}), { editorRoot: q, seoInput: J, fieldRules: he, fieldErrors: Y, pendingCount: X, saveError: Z, validateSave: ge, setSaveFailure: _e, focusFirstError: Q, focusSeoError: ve } = Se(K, () => I.value?.categories || [], "announcement", k), ye = v(() => (I.value?.categories || []).map((e) => ({
			label: l(I.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.effective_enabled
		}))), be = "", $;
		function xe(e) {
			if (!e) return "";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "" : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
		}
		async function Ce() {
			$?.abort(), $ = new AbortController();
			let e = $;
			T.value = !0, D.value = !1, O.value = "";
			try {
				if (I.value = await f(e.signal, { cms_source_type: "platform" }), ie.articleId) {
					let t = await d("articles", ie.articleId, e.signal);
					if (I.value = await f(e.signal, { space_id: String(t.space_id) }), N.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					K.scheduled_local = t.publish_status === "scheduled" ? xe(t.scheduled_at) : "", R.value = t.publish_status;
				}
				be = JSON.stringify(K);
			} catch (t) {
				e.signal.aborted || (O.value = o(t), D.value = !0);
			} finally {
				e.signal.aborted || (T.value = !1);
			}
		}
		let we = () => !T.value && !D.value && be !== JSON.stringify(K);
		function Te() {
			we() ? ce.value = !0 : g("close");
		}
		function Ee() {
			R.value === "draft" ? Oe("draft") : ue.value = !0;
		}
		function De() {
			ue.value = !1, Oe("draft");
		}
		async function Oe(e) {
			if (G.value || T.value || D.value || z.value || (O.value = "", !await ge(e))) return;
			let t = K.scheduled_local ? new Date(K.scheduled_local) : null;
			E.value = !0, O.value = "";
			try {
				await ne("articles", {
					...K,
					id: K.id || void 0,
					row_version: K.id ? K.row_version : void 0,
					category_id: K.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), be = JSON.stringify(K), te.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "公告已发布"), g("saved");
			} catch (e) {
				_e(e);
			} finally {
				E.value = !1;
			}
			X.value && await Q();
		}
		function ke(e) {
			O.value = o(e);
		}
		let Ae = (e) => {
			we() && (e.preventDefault(), e.returnValue = "");
		};
		return pe(() => !E.value && !z.value && (!we() || window.confirm("公告有未保存的修改，确定离开？"))), se(() => {
			Ce(), window.addEventListener("beforeunload", Ae);
		}), oe(() => {
			$?.abort(), window.removeEventListener("beforeunload", Ae);
		}), (r, i) => (A(), x("section", {
			ref_key: "editorRoot",
			ref: q,
			class: "article-editor",
			"aria-busy": T.value || E.value
		}, [
			S("header", Ln, [
				w(F(a), {
					"icon-only": "",
					title: "返回公告列表",
					"aria-label": "返回公告列表",
					disabled: E.value || z.value,
					onClick: Te
				}, {
					default: B(() => [w(F(_), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				S("div", Rn, [S("h2", null, P(n.articleId ? "编辑公告" : "新增公告"), 1), S("span", null, P(I.value?.source_locale || "zh-CN") + " · " + P(N.value), 1)]),
				S("div", zn, [
					n.articleId && W.value ? (A(), y(F(a), {
						key: 0,
						size: "sm",
						disabled: T.value || D.value || E.value || z.value,
						onClick: i[0] ||= (e) => M.value = !0
					}, {
						default: B(() => [...i[29] ||= [C("删除公告", -1)]]),
						_: 1
					}, 8, ["disabled"])) : b("", !0),
					w(F(a), {
						size: "sm",
						disabled: T.value || D.value,
						onClick: i[1] ||= (e) => k.value = !0
					}, {
						icon: B(() => [w(F(_), {
							name: "search",
							size: 14
						})]),
						default: B(() => [i[30] ||= C("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					U.value ? b("", !0) : (A(), y(F(a), {
						key: 1,
						size: "sm",
						disabled: T.value || D.value || E.value || z.value,
						onClick: Ee
					}, {
						icon: B(() => [w(F(_), {
							name: "save",
							size: 14
						})]),
						default: B(() => [i[31] ||= C("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					F(Z) ? (A(), x("span", Bn, P(F(Z)), 1)) : b("", !0),
					!U.value && F(X) ? (A(), x("span", Vn, "还有 " + P(F(X)) + " 项待完善", 1)) : b("", !0),
					!U.value && H.value ? (A(), y(F(a), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: T.value || D.value || z.value,
						loading: E.value,
						onClick: i[2] ||= (e) => Oe(K.scheduled_local ? "scheduled" : "published")
					}, {
						icon: B(() => [w(F(_), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: B(() => [C(P(K.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : b("", !0)
				])
			]),
			T.value ? (A(), x("div", Hn, [w(F(_), {
				name: "loader-circle",
				class: "announcement-spin",
				size: 28
			}), i[32] ||= S("span", null, "正在读取公告资料...", -1)])) : D.value ? (A(), x("div", Un, [w(F(p), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"]), w(F(a), { onClick: Ce }, {
				default: B(() => [...i[33] ||= [C("重新加载", -1)]]),
				_: 1
			})])) : (A(), x(ae, { key: 2 }, [O.value ? (A(), x("div", Wn, [w(F(p), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"])])) : b("", !0), S("div", Gn, [S("aside", Kn, [w(F(c), {
				model: K,
				rules: F(he),
				"label-position": "top",
				onSubmit: i[13] ||= de(() => {}, ["prevent"])
			}, {
				default: B(() => [
					w(F(m), {
						label: "公告分类",
						prop: "category_id",
						error: F(Y).category_id,
						required: ""
					}, {
						default: B(() => [w(F(t), {
							modelValue: K.category_id,
							"onUpdate:modelValue": i[3] ||= (e) => K.category_id = e,
							options: ye.value,
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
					i[34] ||= S("h3", null, "公告设置", -1),
					w(F(m), {
						label: "公告封面",
						prop: "cover_url",
						error: F(Y).cover_url
					}, {
						default: B(() => [w(Re, {
							modelValue: K.cover_url,
							"onUpdate:modelValue": i[4] ||= (e) => K.cover_url = e,
							label: "公告封面",
							disabled: G.value,
							upload: F(re),
							onBusyChange: i[5] ||= (e) => z.value = e,
							onStart: i[6] ||= (e) => O.value = "",
							onError: ke
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "内容来源",
						prop: "content_source",
						error: F(Y).content_source
					}, {
						default: B(() => [w(F(h), {
							modelValue: K.content_source,
							"onUpdate:modelValue": i[7] ||= (e) => K.content_source = e,
							maxlength: 160,
							disabled: G.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "作者署名",
						prop: "author_name",
						error: F(Y).author_name
					}, {
						default: B(() => [w(F(h), {
							modelValue: K.author_name,
							"onUpdate:modelValue": i[8] ||= (e) => K.author_name = e,
							maxlength: 120,
							disabled: G.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "前端排序",
						prop: "sort_order",
						error: F(Y).sort_order
					}, {
						default: B(() => [w(F(ee), {
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
					i[35] ||= S("h3", null, "发布设置", -1),
					w(F(m), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: F(Y).helpful_enabled
					}, {
						default: B(() => [w(Lt, {
							modelValue: K.helpful_enabled,
							"onUpdate:modelValue": i[10] ||= (e) => K.helpful_enabled = e,
							disabled: G.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "启用状态",
						prop: "is_enabled",
						error: F(Y).is_enabled
					}, {
						default: B(() => [w(Lt, {
							modelValue: K.is_enabled,
							"onUpdate:modelValue": i[11] ||= (e) => K.is_enabled = e,
							disabled: G.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: F(Y).scheduled_local
					}, {
						default: B(() => [w(F(h), {
							modelValue: K.scheduled_local,
							"onUpdate:modelValue": i[12] ||= (e) => K.scheduled_local = e,
							type: "datetime-local",
							disabled: G.value || !H.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					i[36] ||= S("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), S("main", qn, [w(F(c), {
				model: K,
				rules: F(he),
				"label-position": "top",
				onSubmit: i[17] ||= de(() => {}, ["prevent"])
			}, {
				default: B(() => [
					w(F(m), {
						label: "标题",
						prop: "title",
						error: F(Y).title,
						required: ""
					}, {
						default: B(() => [w(F(h), {
							modelValue: K.title,
							"onUpdate:modelValue": i[14] ||= (e) => K.title = e,
							maxlength: 255,
							disabled: G.value,
							placeholder: "输入公告标题",
							"aria-label": "公告标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "摘要",
						prop: "summary",
						error: F(Y).summary
					}, {
						default: B(() => [V(S("textarea", {
							"onUpdate:modelValue": i[15] ||= (e) => K.summary = e,
							"aria-invalid": !!F(Y).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: G.value,
							"aria-label": "公告摘要"
						}, null, 8, Jn), [[L, K.summary]])]),
						_: 1
					}, 8, ["error"]),
					w(F(m), {
						label: "正文",
						prop: "body_html",
						error: F(Y).body_html
					}, {
						default: B(() => [w(F(e), {
							modelValue: K.body_html,
							"onUpdate:modelValue": i[16] ||= (e) => K.body_html = e,
							readonly: U.value,
							disabled: E.value,
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
			w(F(s), {
				modelValue: k.value,
				"onUpdate:modelValue": i[21] ||= (e) => k.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: B(() => [w(F(a), {
					variant: "primary",
					onClick: i[20] ||= (e) => k.value = !1
				}, {
					default: B(() => [...i[37] ||= [C("确定", -1)]]),
					_: 1
				})]),
				default: B(() => [w(F(c), {
					model: K,
					rules: F(he),
					"label-position": "top",
					onSubmit: i[19] ||= de(() => {}, ["prevent"])
				}, {
					default: B(() => [w(F(m), {
						label: "SEO 描述",
						prop: "seo_description",
						error: F(Y).seo_description
					}, {
						default: B(() => [V(S("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": i[18] ||= (e) => K.seo_description = e,
							"aria-invalid": !!F(Y).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: G.value,
							"aria-label": "SEO 描述"
						}, null, 8, Yn), [[L, K.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			w(F(s), {
				modelValue: M.value,
				"onUpdate:modelValue": i[23] ||= (e) => M.value = e,
				title: "确认删除",
				subtitle: `操作对象：${K.title || "未命名公告"}`,
				width: "460px",
				"panel-class": "announcement-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !E.value
			}, {
				"header-actions": B(() => [S("span", Xn, [w(F(_), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: B(() => [w(F(a), {
					disabled: E.value,
					onClick: i[22] ||= (e) => M.value = !1
				}, {
					default: B(() => [...i[38] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(F(a), {
					variant: "warning",
					loading: E.value,
					onClick: me
				}, {
					default: B(() => [...i[39] ||= [C("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: B(() => [w(F(p), {
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
			w(F(s), {
				modelValue: ce.value,
				"onUpdate:modelValue": i[26] ||= (e) => ce.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: B(() => [w(F(a), { onClick: i[24] ||= (e) => ce.value = !1 }, {
					default: B(() => [...i[40] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(F(a), {
					variant: "primary",
					onClick: i[25] ||= (e) => g("close")
				}, {
					default: B(() => [...i[41] ||= [C("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			w(F(s), {
				modelValue: ue.value,
				"onUpdate:modelValue": i[28] ||= (e) => ue.value = e,
				title: "将公告转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: B(() => [w(F(a), { onClick: i[27] ||= (e) => ue.value = !1 }, {
					default: B(() => [...i[42] ||= [C("取消", -1)]]),
					_: 1
				}), w(F(a), {
					variant: "primary",
					onClick: De
				}, {
					default: B(() => [...i[43] ||= [C("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, In));
	}
}), [["__scopeId", "data-v-525a2f73"]]), Qn = { class: "announcement-articles" }, $n = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = fe(), { formatDateTime: n } = fe(), { announcementPublishStates: r, announcementCategoryLabel: o, getAnnouncementList: s, getAnnouncementMetadata: c } = On(), l = j(!1), u = j(), d = (e) => t([`cms_announcement:${e}`]), f = j(), p = G(c, (e) => {
			f.value = e;
		}), ee = [
			...me(),
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
		], { proTableBindings: te, reload: m, filters: ie } = i({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: v(() => [
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
		p.bindFilters(ie);
		let h = new AbortController();
		async function g() {
			try {
				f.value = await c(h.signal);
			} catch {}
		}
		function ae(e) {
			u.value = e, l.value = !0;
		}
		function S() {
			l.value = !1, m(), g();
		}
		return se(g), oe(() => h.abort()), (e, t) => (A(), x("div", Qn, [l.value ? (A(), y(Zn, {
			key: 0,
			"article-id": u.value,
			onClose: t[0] ||= (e) => l.value = !1,
			onSaved: S
		}, null, 8, ["article-id"])) : b("", !0), V(w(F(ne), D(F(te), {
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
			"cell-cms_source_type": B(({ row: e }) => [w(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": B(() => [d("add") ? (A(), y(F(a), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => ae()
			}, {
				icon: B(() => [w(F(_), {
					name: "plus",
					size: 14
				})]),
				default: B(() => [t[2] ||= C("新增公告", -1)]),
				_: 1
			})) : b("", !0)]),
			"cell-publish_status": B(({ row: e }) => [w(F(re), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: B(() => [C(P(F(r).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": B(({ row: e }) => [w(F(re), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: B(() => [C(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": B(({ row: e }) => [C(P(F(n)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": B(({ row: e }) => [w(F(a), {
				size: "sm",
				"icon-only": "",
				title: d("edit") ? "编辑公告" : "公告详情",
				"aria-label": d("edit") ? "编辑公告" : "公告详情",
				onClick: (t) => ae(e.id)
			}, {
				default: B(() => [w(F(_), {
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
		}, 16), [[R, !l.value]])]));
	}
}), [["__scopeId", "data-v-9f055b06"]]);
//#endregion
//#region src/cms/api/content/translations.ts
function er() {
	let e = fe().request, t = "/cms/translations";
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
}, ni = {
	key: 2,
	class: "mm-translation-settings"
}, ri = { class: "mm-translation-settings__credential" }, ii = { key: 0 }, ai = { key: 1 }, oi = { key: 2 }, si = { class: "mm-translation-settings__grid" }, ci = { class: "job-confirm" }, li = /*#__PURE__*/ g(/* @__PURE__ */ T({
	__name: "index",
	setup(e) {
		let { cancelTranslationJob: r, createTranslationJob: i, getTranslationDetail: c, getTranslationJob: d, getTranslationList: ne, getTranslationMetadata: ie, getTranslationSettings: g, saveTranslations: T, saveTranslationSettings: E, testTranslationConnection: D } = er(), { hasPermission: ce } = fe(), le = j(), M = j(""), N = j("news:content"), I = j([]), R = j(), de = j(""), U = j("title"), W = j(""), me = j(""), G = j(1), K = j(0), q = j({}), J = j(!1), he = j(!1), Y = j(!1), X = j(!1), Z = j(""), ge = j(""), _e = j(), Q = j(null), ve = j(!1), ye = j(""), be = j(!1), $ = j(), xe = j(""), Se = j(!1), Ce = j(!1), we = j(!1), Te = j("field"), Ee = j([]), De = j(""), Oe = j(!1), ke = j(!1);
		z(ve, (e) => {
			e || (ye.value = "");
		});
		let Ae, je, Me, Ne, Pe, Fe = new AbortController(), Ie, Le = "", Re = v(() => ce(["cms_translation:edit"])), ze = v(() => ce(["cms_translation:config"])), Be = v(() => ce(["cms_translation:translate"])), Ve = v(() => X.value || Se.value || Oe.value), He = v(() => rr(R.value, q.value).length > 0), Ue = v(() => tr(le.value?.done || 0, le.value?.total || 0)), We = v(() => ({
			space_id: M.value,
			module: N.value.split(":")[0],
			kind: N.value.endsWith(":category") ? "category" : "content"
		})), Ge = v(() => le.value?.spaces.map((e) => ({
			label: e.label + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		})) || []), Ke = v(() => le.value?.locales.filter((e) => e.code !== le.value?.source_locale) || []), qe = v(() => Ke.value.map((e) => ({
			label: `${e.flag} ${e.label}`,
			value: e.code
		}))), Je = v(() => Ke.value.map((e) => ({
			label: `${e.label} · ${e.code}`,
			value: e.code
		}))), Ye = v(() => qe.value.filter((e) => nt(String(e.value)))), Xe = v(() => le.value?.locales.find((e) => e.code === le.value?.source_locale)?.label || le.value?.source_locale || "简体中文"), Ze = v(() => R.value?.fields.find((e) => e.key === U.value)), Qe = v(() => {
			let e = le.value?.modules.find((e) => e.key === N.value);
			return e?.kind === "category" ? `${le.value?.modules.find((t) => t.module === e.module && t.kind === "content")?.label || ""}分类` : e?.label || "新闻";
		}), $e = v(() => {
			let e = [];
			for (let t of le.value?.modules || []) {
				let n = e.find((e) => e[0].module === t.module);
				n ? n.push(t) : e.push([t]);
			}
			return e;
		}), et = v(() => !!M.value && le.value?.space_enabled && !!le.value.target_locales.length && !or(Q.value) && !Ve.value && !He.value && !J.value && !he.value), tt = v(() => Q.value ? tr([
			"succeeded",
			"skipped",
			"cancelled"
		].reduce((e, t) => e + (Q.value?.counts[t] || 0), 0) + (or(Q.value) ? 0 : Q.value.counts.failed || 0), Q.value.total) : 0), nt = (e) => le.value?.target_locales.includes(e) ?? !1, rt = (e) => le.value?.locales.find((t) => t.code === e), it = (e) => ({
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
			Ae = void 0, ke.value = !1, q.value = R.value ? ir(R.value) : {}, e?.();
		}
		function st() {
			ke.value = !1, Ae = void 0, Pe?.(!1), Pe = void 0;
		}
		function ct(e) {
			e !== M.value && at(() => {
				M.value = e, W.value = "", me.value = "", G.value = 1, Q.value = null, pt();
			});
		}
		function lt(e) {
			e.available && N.value !== e.key && at(() => {
				N.value = e.key, W.value = "", me.value = "", G.value = 1, ht();
			});
		}
		function ut(e) {
			at(() => {
				G.value = e, ht();
			});
		}
		function dt() {
			at(() => {
				me.value = W.value.trim(), G.value = 1, ht();
			});
		}
		function ft(e) {
			e !== de.value && at(() => {
				gt(e);
			});
		}
		async function pt() {
			Ne?.abort();
			let e = Ne = new AbortController();
			J.value = !0, Z.value = "";
			try {
				let t = await ie(M.value || void 0, e.signal);
				if (e.signal.aborted) return;
				le.value = t, M.value = t.space_id || "", await ht(), Tt();
			} catch (t) {
				e.signal.aborted || (Z.value = lr(t));
			} finally {
				e.signal.aborted || (J.value = !1);
			}
		}
		async function mt() {
			let e = M.value;
			if (e) try {
				let t = await ie(e, Fe.signal);
				e === M.value && (le.value = t);
			} catch {}
		}
		async function ht() {
			je?.abort(), Me?.abort();
			let e = je = new AbortController();
			if (he.value = !0, Y.value = !1, R.value = void 0, de.value = "", q.value = {}, Z.value = "", !M.value) {
				I.value = [], K.value = 0, he.value = !1;
				return;
			}
			let t = { ...We.value };
			try {
				let n = await ne(t, me.value, G.value, e.signal);
				if (e.signal.aborted) return;
				I.value = n.lists, K.value = n.count, I.value[0] && await gt(I.value[0].id);
			} catch (t) {
				e.signal.aborted || (I.value = [], K.value = 0, Z.value = lr(t));
			} finally {
				e.signal.aborted || (he.value = !1);
			}
		}
		async function gt(e) {
			Me?.abort();
			let t = Me = new AbortController();
			Y.value = !0, de.value = e, R.value = void 0, q.value = {}, Z.value = "";
			try {
				let n = await c({ ...We.value }, e, t.signal);
				if (t.signal.aborted) return;
				R.value = n, q.value = ir(n), n.fields.some((e) => e.key === U.value) || (U.value = n.fields[0]?.key || ""), _e.value?.scrollTo({ top: 0 });
			} catch (e) {
				t.signal.aborted || (Z.value = lr(e));
			} finally {
				t.signal.aborted || (Y.value = !1);
			}
		}
		async function _t() {
			if (!R.value || !Re.value || Ve.value) return;
			let e = rr(R.value, q.value);
			if (e.length) {
				if (e.some((e) => !e.text.trim())) {
					Z.value = "译文不能为空；未翻译的语言请保持未填写。";
					return;
				}
				X.value = !0, Z.value = "";
				try {
					let t = await T({ ...We.value }, R.value.id, e);
					R.value = t, q.value = ir(t);
					let n = I.value.findIndex((e) => e.id === t.id);
					n >= 0 && (I.value[n] = t), te.success("翻译已保存"), mt();
				} catch (e) {
					Z.value = lr(e);
				} finally {
					X.value = !1;
				}
			}
		}
		async function vt(e) {
			ge.value = e, await O();
			let t = _e.value?.querySelector(`[data-locale="${e}"]`);
			t?.scrollIntoView({
				block: "nearest",
				behavior: "smooth"
			}), t?.querySelector("textarea")?.focus();
		}
		async function yt() {
			if (!(!ze.value || !M.value)) {
				ve.value = !0, be.value = !0, xe.value = "", $.value = void 0, ye.value = "";
				try {
					$.value = await g(M.value, Fe.signal);
				} catch (e) {
					xe.value = lr(e);
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
					await E($.value, ye.value.trim()), ye.value = "", ve.value = !1, te.success("翻译配置已保存"), await pt();
				} catch (e) {
					xe.value = lr(e);
				} finally {
					Se.value = !1;
				}
			}
		}
		async function xt() {
			if (!(!$.value || Ce.value || Se.value)) {
				Ce.value = !0, xe.value = "";
				try {
					await D($.value.space_id, $.value.space_revision, ye.value.trim()), te.success("Google Translate 连接成功");
				} catch (e) {
					xe.value = lr(e);
				} finally {
					Ce.value = !1;
				}
			}
		}
		function St(e) {
			Te.value = e, Ee.value = [...le.value?.target_locales || []], De.value = "", Le = crypto.randomUUID(), we.value = !0;
		}
		async function Ct() {
			if (!(!Ee.value.length || Oe.value)) {
				Oe.value = !0, De.value = "";
				try {
					let e = await i({ ...We.value }, {
						request_key: Le,
						target_locales: Ee.value,
						...Te.value === "field" ? {
							id: de.value,
							field_name: U.value
						} : { keyword: me.value }
					});
					Q.value = e.job, we.value = !1, te.success("翻译任务已提交"), wt();
				} catch (e) {
					De.value = lr(e);
				} finally {
					Oe.value = !1;
				}
			}
		}
		function wt() {
			clearTimeout(Ie), or(Q.value) && (Ie = setTimeout(() => {
				Tt();
			}, 3e3));
		}
		async function Tt() {
			let e = M.value;
			if (!e || Fe.signal.aborted) return;
			let t = or(Q.value);
			try {
				let n = await d(e, Fe.signal);
				if (e !== M.value) return;
				Q.value = n.job, t && !or(Q.value) && (await mt(), !He.value && !Ve.value && de.value && await gt(de.value));
			} catch {}
			wt();
		}
		async function Et() {
			if (Q.value) try {
				let e = await r(M.value, Q.value.id);
				Q.value = e.job, clearTimeout(Ie), mt();
			} catch (e) {
				Z.value = lr(e);
			}
		}
		function Dt(e) {
			(He.value || Ve.value) && (e.preventDefault(), e.returnValue = "");
		}
		return pe(() => !He.value && !Ve.value || !Ve.value && new Promise((e) => {
			Pe?.(!1), Pe = e, Ae = () => {
				Pe = void 0, e(!0);
			}, ke.value = !0;
		})), se(() => {
			window.addEventListener("beforeunload", Dt), pt();
		}), oe(() => {
			ye.value = "", Pe?.(!1), Fe.abort(), je?.abort(), Me?.abort(), Ne?.abort(), clearTimeout(Ie), window.removeEventListener("beforeunload", Dt);
		}), (e, r) => (A(), x("section", {
			class: "translations-page",
			"aria-label": "多语言翻译管理",
			"aria-busy": J.value
		}, [
			S("header", dr, [S("div", fr, [S("span", pr, [w(F(_), {
				name: "globe",
				size: 21
			})]), S("div", null, [r[21] ||= S("h1", null, "语言翻译管理", -1), S("div", mr, [
				S("strong", null, P(Ue.value) + "%", 1),
				w(F(o), {
					percentage: Ue.value,
					"show-text": !1,
					"stroke-width": 4,
					"aria-label": "全部翻译完成度"
				}, null, 8, ["percentage"]),
				S("span", null, P(le.value?.done.toLocaleString() || 0) + " / " + P(le.value?.total.toLocaleString() || 0) + " 个目标字段", 1)
			])])]), S("div", hr, [
				w(F(t), {
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
				S("span", gr, [r[22] ||= C("内容源语言 ", -1), S("b", null, P(Xe.value), 1)]),
				ze.value ? (A(), y(F(a), {
					key: 0,
					size: "sm",
					disabled: !M.value || Ve.value,
					onClick: yt
				}, {
					icon: B(() => [w(F(_), {
						name: "sliders-horizontal",
						size: 14
					})]),
					default: B(() => [r[23] ||= C("翻译配置", -1)]),
					_: 1
				}, 8, ["disabled"])) : b("", !0),
				Be.value ? (A(), y(F(a), {
					key: 1,
					size: "sm",
					disabled: !et.value,
					onClick: r[1] ||= (e) => St("batch")
				}, {
					icon: B(() => [w(F(_), {
						name: "rocket",
						size: 14
					})]),
					default: B(() => [r[24] ||= C("批量翻译", -1)]),
					_: 1
				}, 8, ["disabled"])) : b("", !0),
				Be.value ? (A(), y(F(a), {
					key: 2,
					size: "sm",
					disabled: !et.value || !R.value || !Ze.value?.translatable,
					onClick: r[2] ||= (e) => St("field")
				}, {
					icon: B(() => [w(F(_), {
						name: "globe",
						size: 14
					})]),
					default: B(() => [r[25] ||= C("翻译当前字段", -1)]),
					_: 1
				}, 8, ["disabled"])) : b("", !0),
				Re.value ? (A(), y(F(a), {
					key: 3,
					size: "sm",
					variant: "primary",
					loading: X.value,
					disabled: !He.value || Ve.value || !le.value?.space_enabled,
					onClick: _t
				}, {
					icon: B(() => [w(F(_), {
						name: "save",
						size: 14
					})]),
					default: B(() => [r[26] ||= C("保存翻译", -1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : b("", !0)
			])]),
			Z.value ? (A(), y(F(p), {
				key: 0,
				type: "error",
				closable: !0,
				onClose: r[3] ||= (e) => Z.value = ""
			}, {
				default: B(() => [C(P(Z.value), 1)]),
				_: 1
			})) : b("", !0),
			le.value && !le.value.space_enabled && M.value ? (A(), y(F(p), {
				key: 1,
				type: "warning"
			}, {
				default: B(() => [...r[27] ||= [C("当前内容空间已停用，仅可查看翻译。", -1)]]),
				_: 1
			})) : b("", !0),
			le.value && !le.value.target_locales.length && M.value ? (A(), y(F(p), {
				key: 2,
				type: "info"
			}, {
				default: B(() => [...r[28] ||= [C("尚未启用目标语言，请在“翻译配置”中选择语言后开始翻译。", -1)]]),
				_: 1
			})) : b("", !0),
			Q.value ? (A(), x("div", _r, [
				w(F(_), {
					name: F(or)(Q.value) ? "loader-circle" : "info",
					size: 15
				}, null, 8, ["name"]),
				S("strong", null, P(F(sr)[Q.value.status] || Q.value.status), 1),
				S("span", null, "任务 #" + P(Q.value.id), 1),
				w(F(o), {
					percentage: tt.value,
					"show-text": !1,
					"stroke-width": 4
				}, null, 8, ["percentage"]),
				S("span", null, [
					C(P(Q.value.counts.succeeded || 0) + " / " + P(Q.value.total) + " 已完成", 1),
					Q.value.counts.failed ? (A(), x("span", vr, " · " + P(Q.value.counts.failed) + " 失败", 1)) : b("", !0),
					Q.value.counts.skipped ? (A(), x("span", yr, " · " + P(Q.value.counts.skipped) + " 冲突跳过", 1)) : b("", !0)
				]),
				F(or)(Q.value) && Be.value ? (A(), y(F(a), {
					key: 0,
					size: "sm",
					variant: "text",
					disabled: Ve.value,
					onClick: Et
				}, {
					default: B(() => [...r[29] ||= [C("取消任务", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (A(), y(F(a), {
					key: 1,
					size: "sm",
					variant: "text",
					onClick: r[4] ||= (e) => Q.value = null
				}, {
					default: B(() => [...r[30] ||= [C("收起", -1)]]),
					_: 1
				})),
				Q.value.errors.length ? (A(), x("span", {
					key: 2,
					class: "translation-job__error",
					title: Q.value.errors.map((e) => `${e.target_locale}: ${e.error_code}`).join("；")
				}, P(Q.value.errors[0].error_code) + "（可重新提交补翻）", 9, br)) : b("", !0)
			])) : b("", !0),
			S("div", xr, [(A(!0), x(ae, null, ue(Ke.value, (e) => (A(), x("button", {
				key: e.code,
				type: "button",
				class: k(["language-card", {
					"is-active": ge.value === e.code,
					"is-disabled": !nt(e.code)
				}]),
				disabled: !nt(e.code),
				title: nt(e.code) ? `${e.native}：${e.done} / ${e.total}` : "请在翻译配置中启用",
				onClick: (t) => vt(e.code)
			}, [
				S("span", null, P(e.flag), 1),
				S("span", null, P(e.label), 1),
				S("strong", null, P(nt(e.code) ? F(tr)(e.done, e.total) + "%" : "未启用"), 1),
				w(F(o), {
					percentage: F(tr)(e.done, e.total),
					"show-text": !1,
					"stroke-width": 2
				}, null, 8, ["percentage"])
			], 10, Sr))), 128))]),
			S("nav", Cr, [(A(!0), x(ae, null, ue($e.value, (e) => (A(), x("div", {
				key: e[0].module,
				class: "module-group"
			}, [(A(!0), x(ae, null, ue(e, (e) => (A(), y(F(a), {
				key: e.key,
				variant: N.value === e.key ? "primary" : "text",
				plain: N.value === e.key,
				size: "sm",
				disabled: !e.available || Ve.value,
				title: e.reason,
				"aria-pressed": N.value === e.key,
				onClick: (t) => lt(e)
			}, {
				default: B(() => [
					e.kind === "category" ? b("", !0) : (A(), y(F(_), {
						key: 0,
						name: it(e.module),
						size: 14
					}, null, 8, ["name"])),
					C(P(e.label), 1),
					S("span", wr, P(e.count), 1)
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
			S("main", Tr, [S("aside", Er, [
				S("div", Dr, [S("div", null, [S("strong", null, P(Qe.value), 1), S("span", null, P(K.value) + " 条" + P(We.value.kind === "category" ? "分类" : "内容"), 1)]), w(F(h), {
					modelValue: W.value,
					"onUpdate:modelValue": r[5] ||= (e) => W.value = e,
					size: "sm",
					clearable: "",
					placeholder: "搜索内容",
					"aria-label": "搜索内容",
					onKeydown: H(dt, ["enter"])
				}, {
					prefix: B(() => [w(F(_), {
						name: "search",
						size: 14
					})]),
					_: 1
				}, 8, ["modelValue"])]),
				S("div", {
					class: "content-browser__list",
					"aria-busy": he.value
				}, [he.value ? (A(), x("p", kr, "加载内容中…")) : (A(), x(ae, { key: 1 }, [(A(!0), x(ae, null, ue(I.value, (e) => (A(), x("button", {
					key: e.id,
					type: "button",
					class: k(["content-item", { "is-selected": de.value === e.id }]),
					"aria-current": de.value === e.id ? "true" : void 0,
					disabled: Ve.value,
					onClick: (t) => ft(e.id)
				}, [S("span", jr, [S("strong", { title: e.title }, P(e.title), 9, Mr), S("small", null, P(F(cr)[e.publish_status || ""] || "分类") + " · " + P(e.done) + "/" + P(e.total), 1)]), w(F(o), {
					type: "circle",
					percentage: F(tr)(e.done, e.total),
					"show-text": !1,
					size: 16,
					"stroke-width": 2,
					status: e.total && e.done === e.total ? "success" : "warning"
				}, null, 8, ["percentage", "status"])], 10, Ar))), 128)), I.value.length ? b("", !0) : (A(), x("p", Nr, P(me.value ? "没有匹配的内容" : "暂无可翻译内容"), 1))], 64))], 8, Or),
				S("footer", Pr, [
					w(F(a), {
						size: "sm",
						"icon-only": "",
						"aria-label": "上一页",
						disabled: G.value <= 1 || he.value || Ve.value,
						onClick: r[6] ||= (e) => ut(G.value - 1)
					}, {
						default: B(() => [w(F(_), {
							name: "chevron-left",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"]),
					S("span", null, P(G.value) + " / " + P(Math.max(1, Math.ceil(K.value / 30))), 1),
					w(F(a), {
						size: "sm",
						"icon-only": "",
						"aria-label": "下一页",
						disabled: G.value * 30 >= K.value || he.value || Ve.value,
						onClick: r[7] ||= (e) => ut(G.value + 1)
					}, {
						default: B(() => [w(F(_), {
							name: "chevron-right",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"])
				])
			]), S("section", {
				class: "translation-editor",
				"aria-busy": Y.value
			}, [Y.value ? (A(), x("div", Ir, [w(F(_), {
				name: "loader-circle",
				size: 28
			}), r[31] ||= S("p", null, "加载译文中…", -1)])) : R.value ? (A(), x(ae, { key: 1 }, [S("header", Lr, [S("div", Rr, [S("span", null, [C(P(Qe.value) + " ", 1), He.value ? (A(), x("em", zr, "有未保存修改")) : b("", !0)]), S("h2", { title: R.value.title }, P(R.value.title), 9, Br)]), w(F(l), {
				modelValue: U.value,
				"onUpdate:modelValue": r[8] ||= (e) => U.value = e
			}, {
				default: B(() => [(A(!0), x(ae, null, ue(R.value.fields, (e) => (A(), y(F(n), {
					key: e.key,
					name: e.key,
					label: `${e.label} ${e.translatable ? F(ar)(e) + "/" + e.translations.length : "—"}`
				}, null, 8, ["name", "label"]))), 128))]),
				_: 1
			}, 8, ["modelValue"])]), Ze.value ? (A(), x("div", {
				key: 0,
				class: "translation-editor__body",
				ref_key: "editorBody",
				ref: _e
			}, [
				S("section", Vr, [S("div", Hr, [S("strong", null, [C(P(Xe.value) + " ", 1), w(F(re), {
					size: "sm",
					type: "primary",
					effect: "soft"
				}, {
					default: B(() => [...r[32] ||= [C("内容源语言", -1)]]),
					_: 1
				})]), r[33] ||= S("span", null, "只读原文", -1)]), S("textarea", {
					value: Ze.value.source,
					readonly: "",
					rows: Ze.value.key === "body_html" ? 5 : 2,
					class: "translation-textarea source-textarea",
					"aria-label": `原文${Ze.value.label}`
				}, null, 8, Ur)]),
				S("div", Wr, [r[34] ||= S("strong", null, "目标语言", -1), S("span", null, P(R.value.fields.find((e) => e.key === U.value)?.translations.length || 0) + " 种语言 · 手工修改后请保存", 1)]),
				Ze.value.translatable ? Ze.value.translations.length ? (A(), x("div", {
					key: 2,
					class: k(["target-grid", { "is-body": U.value === "body_html" }])
				}, [(A(!0), x(ae, null, ue(Ze.value.translations, (e) => (A(), x("div", {
					key: e.locale,
					class: k(["target-field", { "is-focused": ge.value === e.locale }]),
					"data-locale": e.locale
				}, [
					S("div", Jr, [S("label", { for: `translation-${U.value}-${e.locale}` }, [C(P(rt(e.locale)?.native || e.locale) + " ", 1), S("small", null, P(e.locale), 1)], 8, Yr), e.status === "stale" ? (A(), x("span", Xr, "原文已更新")) : e.status === "ready" ? (A(), x("span", Zr, P(e.method === "machine" ? "机器翻译" : "已保存"), 1)) : b("", !0)]),
					V(S("textarea", {
						id: `translation-${U.value}-${e.locale}`,
						"onUpdate:modelValue": (t) => q.value[F(nr)(U.value, e.locale)] = t,
						class: "translation-textarea",
						rows: U.value === "body_html" ? 10 : 2,
						maxlength: Ze.value.max_length,
						disabled: !Re.value || !le.value?.space_enabled || Ve.value,
						dir: e.locale === "ar" ? "rtl" : "auto",
						placeholder: `请输入${rt(e.locale)?.native || e.locale}翻译${U.value === "body_html" ? "（HTML）" : ""}`
					}, null, 8, Qr), [[L, q.value[F(nr)(U.value, e.locale)]]]),
					S("div", $r, P((q.value[F(nr)(U.value, e.locale)] || "").length.toLocaleString()) + " / " + P(Ze.value.max_length.toLocaleString()), 1)
				], 10, qr))), 128))], 2)) : (A(), x("div", Kr, " 请先在“翻译配置”中启用目标语言。 ")) : (A(), x("div", Gr, [w(F(_), {
					name: "info",
					size: 18
				}), r[35] ||= C("原文字段为空，不参与翻译和完成度统计。 ", -1)]))
			], 512)) : b("", !0)], 64)) : (A(), x("div", ei, [w(F(u), { description: Z.value ? "内容加载失败，可点击刷新重试" : "选择左侧内容开始翻译" }, null, 8, ["description"]), Z.value ? (A(), y(F(a), {
				key: 0,
				size: "sm",
				onClick: pt
			}, {
				default: B(() => [...r[36] ||= [C("重新加载", -1)]]),
				_: 1
			})) : b("", !0)]))], 8, Fr)]),
			w(F(s), {
				modelValue: ve.value,
				"onUpdate:modelValue": r[16] ||= (e) => ve.value = e,
				title: "翻译配置",
				subtitle: "当前内容空间共用 · Google Cloud Translation Basic v2",
				width: "560px",
				"close-on-click-modal": !1,
				"before-close": () => !Se.value && !Ce.value
			}, {
				footer: B(() => [
					w(F(a), {
						loading: Ce.value,
						disabled: !$.value?.credential_configured && !ye.value.trim() || Se.value || be.value,
						onClick: xt
					}, {
						default: B(() => [...r[44] ||= [C("测试连接", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"]),
					w(F(a), {
						disabled: Se.value || Ce.value,
						onClick: r[15] ||= (e) => ve.value = !1
					}, {
						default: B(() => [...r[45] ||= [C("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					w(F(a), {
						variant: "primary",
						loading: Se.value,
						disabled: !$.value || be.value || Ce.value,
						onClick: bt
					}, {
						default: B(() => [...r[46] ||= [C("保存翻译配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])
				]),
				default: B(() => [xe.value ? (A(), y(F(p), {
					key: 0,
					type: "error"
				}, {
					default: B(() => [C(P(xe.value), 1)]),
					_: 1
				})) : b("", !0), be.value ? (A(), x("div", ti, "加载配置中…")) : $.value ? (A(), x("div", ni, [
					S("label", null, [r[37] ||= C(" 目标语言 ", -1), w(F(t), {
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
					w(F(f), {
						modelValue: $.value.is_enabled,
						"onUpdate:modelValue": r[10] ||= (e) => $.value.is_enabled = e,
						disabled: Se.value || Ce.value || !$.value.credential_configured && !ye.value.trim()
					}, {
						default: B(() => [...r[38] ||= [C("开启自动翻译", -1)]]),
						_: 1
					}, 8, ["modelValue", "disabled"]),
					S("div", ri, [
						S("label", null, [r[39] ||= C(" Google API Key ", -1), w(F(h), {
							modelValue: ye.value,
							"onUpdate:modelValue": r[11] ||= (e) => ye.value = e,
							type: "password",
							autocomplete: "new-password",
							disabled: Se.value || Ce.value,
							placeholder: $.value.credential_configured ? "已配置，留空保留原密钥；输入新密钥替换" : "请输入 Google Cloud Translation API Key"
						}, null, 8, [
							"modelValue",
							"disabled",
							"placeholder"
						])]),
						$.value.api_key_mask ? (A(), x("small", ii, P($.value.credential_source === "database" ? "数据库密钥" : "环境配置密钥") + "：" + P($.value.api_key_mask), 1)) : b("", !0),
						$.value.credential_error === "GOOGLE_CREDENTIAL_DECRYPT_FAILED" ? (A(), x("small", ai, "数据库密钥无法解密，请检查两套后台的专用加密配置，或输入新密钥替换。")) : (A(), x("small", oi, "密钥加密保存，不回显原文；留空保留原值。未配置密钥时仍可人工翻译。"))
					]),
					S("div", si, [
						S("label", null, [r[40] ||= C(" 并发上限 ", -1), w(F(ee), {
							modelValue: $.value.concurrency_limit,
							"onUpdate:modelValue": r[12] ||= (e) => $.value.concurrency_limit = e,
							min: 1,
							max: 20,
							disabled: Se.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])]),
						S("label", null, [r[41] ||= C(" 请求超时（秒） ", -1), w(F(ee), {
							modelValue: $.value.request_timeout_seconds,
							"onUpdate:modelValue": r[13] ||= (e) => $.value.request_timeout_seconds = e,
							min: 1,
							max: 120,
							disabled: Se.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])]),
						S("label", null, [r[42] ||= C(" 最大尝试次数 ", -1), w(F(ee), {
							modelValue: $.value.max_attempts,
							"onUpdate:modelValue": r[14] ||= (e) => $.value.max_attempts = e,
							min: 1,
							max: 10,
							disabled: Se.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])])
					]),
					$.value.supported ? b("", !0) : (A(), y(F(p), {
						key: 0,
						type: "warning"
					}, {
						default: B(() => [...r[43] ||= [C("当前空间关联了其他版本的翻译配置。保存将为该空间创建独立的 Google v2 配置，不修改其他空间。", -1)]]),
						_: 1
					}))
				])) : b("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			w(F(s), {
				modelValue: we.value,
				"onUpdate:modelValue": r[19] ||= (e) => we.value = e,
				title: Te.value === "field" ? "翻译当前字段" : "批量翻译",
				subtitle: "Google Translate · 仅补齐缺失及原文已更新的译文",
				width: "520px",
				"close-on-click-modal": !1,
				"before-close": () => !Oe.value
			}, {
				footer: B(() => [w(F(a), {
					size: "sm",
					disabled: Oe.value,
					onClick: r[18] ||= (e) => we.value = !1
				}, {
					default: B(() => [...r[48] ||= [C("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), w(F(a), {
					variant: "primary",
					size: "sm",
					loading: Oe.value,
					disabled: !Ee.value.length,
					onClick: Ct
				}, {
					default: B(() => [...r[49] ||= [C("确认翻译", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])]),
				default: B(() => [S("div", ci, [
					S("p", null, P(Te.value === "field" ? `当前内容的「${Ze.value?.label}」` : `当前空间「${Qe.value}」${me.value ? "中匹配搜索条件的内容" : "全部内容"}`), 1),
					w(F(m), { label: "目标语言" }, {
						default: B(() => [w(F(t), {
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
					w(F(p), { type: "warning" }, {
						default: B(() => [...r[47] ||= [C("内容将发送至 Google Translate，并可能产生翻译费用。已有有效译文不会覆盖；单次最多 200 条内容、5,000 个字段任务。后台任务需要已启动翻译 worker。", -1)]]),
						_: 1
					}),
					De.value ? (A(), y(F(p), {
						key: 0,
						type: "error"
					}, {
						default: B(() => [C(P(De.value), 1)]),
						_: 1
					})) : b("", !0)
				])]),
				_: 1
			}, 8, [
				"modelValue",
				"title",
				"before-close"
			]),
			w(F(s), {
				modelValue: ke.value,
				"onUpdate:modelValue": r[20] ||= (e) => ke.value = e,
				title: "有未保存的翻译",
				subtitle: "切换后将丢弃当前修改，是否继续？",
				width: "380px",
				onClose: st
			}, {
				footer: B(() => [w(F(a), {
					size: "sm",
					onClick: st
				}, {
					default: B(() => [...r[50] ||= [C("继续编辑", -1)]]),
					_: 1
				}), w(F(a), {
					size: "sm",
					variant: "warning",
					onClick: ot
				}, {
					default: B(() => [...r[51] ||= [C("放弃修改并继续", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, ur));
	}
}), [["__scopeId", "data-v-6e6ebf99"]]), ui = {
	key: 0,
	class: "mm-cms-site"
}, di = ["disabled"], fi = ["value"], pi = {
	key: 1,
	role: "alert"
}, mi = {
	key: 2,
	role: "status"
}, hi = { key: 3 }, gi = ["disabled"], _i = /*#__PURE__*/ g(/* @__PURE__ */ T({
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
			"news/categories": ve,
			"news/list": nt,
			"academy/categories": ut,
			"academy/courses": Pt,
			"help/categories": Xt,
			"help/articles": _n,
			"feedback/list": Dn,
			"announcement/categories": Fn,
			"announcement/list": $n,
			"localization/translations": li
		}, r = t.runtime.mode === "white_label" && !!t.runtime.resolveSiteInRequest, i = j(!1), a = j(0), o = j([]), s = j(""), c = j(""), l = j(t.runtime.mode === "white_label" && !r), u = j(!1), d = v(() => o.value.find((e) => e.site_id === s.value)), f = v(() => n[t.page]), p = v(() => t.runtime.hasPermission([
			"cms_news:add",
			"cms_academy:add",
			"cms_help:add",
			"cms_announcement:add"
		])), ee = new AbortController(), te = !0, ne = !1;
		function re(e) {
			ne = !0;
			try {
				o.value = e.sites, s.value = e.site_id ?? "", i.value = !0;
			} finally {
				ne = !1;
			}
		}
		let m = W(t.runtime, re);
		z(s, () => {
			!r || ne || (m.invalidate(), m = W(t.runtime, re, d.value?.space_id ?? null), a.value++);
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
		ce(U, {
			get mode() {
				return t.runtime.mode;
			},
			hasPermission: (e) => t.runtime.hasPermission(e),
			formatDateTime: (e) => t.runtime.formatDateTime(e),
			registerBeforeLeave: (e) => t.runtime.registerBeforeLeave?.(e),
			get request() {
				if (r) return m.request;
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
				signal: ee.signal
			});
			ee.signal.aborted || (o.value = e.sites, o.value.some((e) => e.site_id === s.value) || (s.value = o.value[0]?.site_id ?? ""));
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
					m.invalidate(), m = W(t.runtime, re, n.cms_context.space_id), re(n.cms_context), a.value++;
				} else await h();
			} catch (e) {
				c.value = e instanceof Error ? e.message : "初始化失败";
			} finally {
				u.value = !1;
			}
		}
		return se(async () => {
			if (t.runtime.mode === "white_label" && !r) try {
				await h();
			} catch {
				ee.signal.aborted || (c.value = "加载站点失败，请刷新重试");
			} finally {
				l.value = !1;
			}
		}), oe(() => {
			te = !1, m.invalidate(), ee.abort();
		}), (t, n) => (A(), x("section", { class: k(["mm-cms-page", { "is-viewport": e.viewport }]) }, [e.runtime.mode === "white_label" && e.showSiteSelector && (!F(r) || i.value) ? (A(), x("header", ui, [S("label", null, [n[1] ||= C("内容站点 ", -1), V(S("select", {
			"onUpdate:modelValue": n[0] ||= (e) => s.value = e,
			disabled: l.value
		}, [(A(!0), x(ae, null, ue(o.value, (e) => (A(), x("option", {
			key: e.site_id,
			value: e.site_id
		}, P(e.label), 9, fi))), 128))], 8, di), [[I, s.value]])]), n[2] ||= S("span", null, "各站点内容独立管理", -1)])) : b("", !0), c.value ? (A(), x("p", pi, P(c.value), 1)) : l.value ? (A(), x("p", mi, "正在加载站点…")) : e.runtime.mode === "white_label" && (!F(r) || i.value) && !d.value?.space_id ? (A(), x("div", hi, [S("p", null, P(d.value ? "该站点尚未初始化内容空间。" : "暂无可管理的内容站点。"), 1), d.value && p.value ? (A(), x("button", {
			key: 0,
			type: "button",
			disabled: u.value,
			onClick: g
		}, "初始化空内容空间", 8, gi)) : b("", !0)])) : (A(), y(M(f.value), { key: `${e.page}:${e.identityKey}:${F(r) ? a.value : d.value?.space_id ?? "platform"}` }))], 2));
	}
}), [["__scopeId", "data-v-f447749a"]]);
//#endregion
//#region src/cms/permission-tree.ts
function vi(e, t, n = "", r = 0) {
	let i = e.children ?? [], a = e.type === "C" && !!(e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:")), o = t(e), s = n ? `${n} / ${o}` : o, c = a || e.type === "M" && r > 0 ? s : n;
	return [...!i.length || a ? [{
		id: e.id,
		name: a || e.type === "A" && e.perms?.startsWith("cms_") ? s : o
	}] : [], ...i.flatMap((e) => vi(e, t, c, r + 1))];
}
function yi(e, t) {
	let n = new Set(t.map(String)), r = /* @__PURE__ */ new Set(), i = [];
	function a(e) {
		let t = e.children ?? [], o = (!t.length || e.type === "C" && (e.perms?.startsWith("cms_") || e.perms?.startsWith("whiteLabel:site:"))) && n.has(String(e.id));
		for (let e of t) a(e) && (o = !0);
		return o && !r.has(String(e.id)) && (r.add(String(e.id)), i.push(e.id)), !!o;
	}
	return e.forEach(a), i;
}
//#endregion
export { _i as MmCmsPage, vi as cmsPermissionItems, yi as cmsPermissionSubmission };

//# sourceMappingURL=cms.js.map