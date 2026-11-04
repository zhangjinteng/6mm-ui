import { $r as e, A as t, Bi as n, Jn as r, M as i, Sn as a, d as o, ei as s, gi as c, hi as l, hr as ee, jr as te, mi as ne, ni as u, pi as re, ti as d, vi as f, wr as ie, xn as p, yr as ae } from "./src-D9gwl4U-.js";
import { d as m, f as h, n as g, u as _ } from "./Loading-NM70IAOz.js";
import { Fragment as v, computed as y, createBlock as b, createCommentVNode as x, createElementBlock as S, createElementVNode as C, createTextVNode as w, createVNode as T, defineComponent as E, inject as D, mergeProps as O, nextTick as oe, normalizeClass as se, onBeforeUnmount as ce, onMounted as le, openBlock as k, provide as A, reactive as ue, ref as j, renderList as de, resolveDynamicComponent as M, shallowRef as N, toDisplayString as P, unref as F, vModelSelect as I, vModelText as L, vShow as R, watch as z, withCtx as B, withDirectives as fe, withKeys as V, withModifiers as pe } from "vue";
//#region src/cms/runtime.ts
var H = Symbol("MmCms");
function me() {
	let e = D(H);
	if (!e) throw Error("CMS host adapter is missing");
	return e;
}
function he(e) {
	me().registerBeforeLeave?.(e);
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
	if (me().mode === "white_label") return {
		fields: [],
		bindFilters: (e) => {}
	};
	let n = ue([{
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
var K = /* @__PURE__ */ E({
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
		}, i = y(() => t.sourceType ? n[t.sourceType] : "-"), a = y(() => t.sourceType ? r[t.sourceType] : "default");
		return (e, t) => (k(), b(F(re), {
			effect: "soft",
			round: "",
			size: "sm",
			type: a.value
		}, {
			default: B(() => [w(P(i.value), 1)]),
			_: 1
		}, 8, ["type"]));
	}
});
//#endregion
//#region src/cms/api/content/news.ts
function q() {
	let e = me().request, t = "/cms/news", n = (n, r = {}) => e.get({
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
		newsCategoryLabel: l,
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
		return (t, n) => (k(), S("button", {
			type: "button",
			role: "switch",
			class: se(["news-toggle", { "is-on": e.modelValue }]),
			"aria-checked": e.modelValue,
			"aria-label": "启用状态",
			disabled: e.disabled,
			onClick: n[0] ||= (n) => t.$emit("update:modelValue", !e.modelValue)
		}, [n[1] ||= C("span", {
			class: "news-toggle__track",
			"aria-hidden": "true"
		}, [C("span")], -1), C("span", null, P(e.modelValue ? "已启用" : "已停用"), 1)], 10, J));
	}
}), [["__scopeId", "data-v-8b527db1"]]), X = { class: "news-categories" }, Z = ["aria-busy"], ge = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, _e = { class: "taxonomy-editor__field" }, Q = { class: "taxonomy-editor__row" }, ve = "分类", ye = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(t) {
		let { newsError: r, deleteNews: i, getNewsMetadata: o, getNewsList: s, getNewsDetail: l, saveNews: ne } = q(), { hasPermission: ie } = me(), { formatDateTime: ae } = me(), h = (e) => ie([`cms_news_category:${e}`]), _ = j(), v = j(), E = G(o, (e) => {
			_.value = e;
		}), D = [
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
		], { proTableBindings: oe, reload: se, filters: A } = te({
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
		E.bindFilters(A);
		let de = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), M = ue(de()), N = j(!1), I = j(!1), L = j(!1), R = j(!1), z = j(!1), fe = j(""), V = j(!1), H = j(""), he = j(!1), U = y(() => !h(M.id ? "edit" : "add")), J = y(() => L.value || R.value), ye = "", be;
		async function $(e) {
			be?.abort(), be = new AbortController();
			let t = be;
			Object.assign(M, de(), { id: e || "" }), H.value = "", z.value = !1, fe.value = "", V.value = !1, N.value = !0, I.value = !0, ye = JSON.stringify(M);
			try {
				if (v.value = await o(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await l("categories", e, t.signal);
				if (v.value = await o(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(M, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), ye = JSON.stringify(M);
			} catch (e) {
				t.signal.aborted || (V.value = !0, H.value = r(e));
			} finally {
				t.signal.aborted || (I.value = !1);
			}
		}
		function xe() {
			return J.value ? !1 : !I.value && !V.value && JSON.stringify(M) !== ye ? (he.value = !0, !1) : (be?.abort(), !0);
		}
		function Se() {
			J.value || (be?.abort(), N.value = !1);
		}
		function Ce() {
			he.value = !1, N.value = !1;
		}
		async function we() {
			if (!(U.value || J.value || I.value || V.value)) {
				if (!M.name.trim() || M.sort_order === null) {
					H.value = "请填写分类名称和排序";
					return;
				}
				L.value = !0, H.value = "";
				try {
					await ne("categories", {
						name: M.name,
						parent_id: M.parent_id || null,
						sort_order: M.sort_order,
						is_enabled: M.is_enabled,
						id: M.id || void 0,
						row_version: M.id ? M.row_version : void 0
					}), N.value = !1, u.success("保存成功"), await Promise.all([se(), ke()]);
				} catch (e) {
					H.value = r(e);
				} finally {
					L.value = !1;
				}
			}
		}
		function Te() {
			!M.id || !h("delete") || J.value || I.value || V.value || (fe.value = "", z.value = !0);
		}
		async function Ee() {
			if (!(!z.value || !M.id || !h("delete") || J.value || I.value || V.value)) {
				R.value = !0, fe.value = "";
				try {
					await i("categories", M.id, M.row_version), z.value = !1, N.value = !1, u.success("分类已删除"), await Promise.all([se(), ke()]);
				} catch (e) {
					fe.value = r(e);
				} finally {
					R.value = !1;
				}
			}
		}
		let De = y(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(v.value?.categories || []).filter((e) => !e.parent_id && e.id !== M.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Oe = new AbortController();
		async function ke() {
			try {
				_.value = await o(Oe.signal);
			} catch {}
		}
		return le(ke), ce(() => {
			be?.abort(), Oe.abort();
		}), (t, r) => (k(), S("div", X, [
			T(F(ee), O(F(oe), {
				"auto-refreshable": !1,
				columns: D,
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
				"cell-cms_source_type": B(({ row: e }) => [T(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": B(() => [h("add") ? (k(), b(F(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => $()
				}, {
					icon: B(() => [T(F(m), {
						name: "plus",
						size: 14
					})]),
					default: B(() => [w("新增" + P(ve))]),
					_: 1
				})) : x("", !0)]),
				"cell-is_enabled": B(({ row: e }) => [T(F(re), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: B(() => [w(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": B(({ row: e }) => [T(F(n), {
					size: "sm",
					"icon-only": "",
					title: h("edit") ? `编辑${ve}` : `${ve}详情`,
					"aria-label": `编辑${ve}`,
					onClick: (t) => $(e.id)
				}, {
					default: B(() => [T(F(m), {
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
			T(F(f), {
				modelValue: N.value,
				"onUpdate:modelValue": r[5] ||= (e) => N.value = e,
				title: `${M.id ? "编辑" : "新增"}新闻${ve}`,
				width: "680px",
				subtitle: "新闻分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": xe
			}, {
				footer: B(() => [
					M.id && h("delete") ? (k(), b(F(n), {
						key: 0,
						variant: "danger",
						disabled: I.value || V.value || J.value,
						onClick: Te
					}, {
						icon: B(() => [T(F(m), {
							name: "trash-2",
							size: 14
						})]),
						default: B(() => [r[11] ||= w("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : x("", !0),
					T(F(n), {
						disabled: J.value,
						onClick: Se
					}, {
						default: B(() => [...r[12] ||= [w("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					U.value ? x("", !0) : (k(), b(F(n), {
						key: 1,
						variant: "primary",
						loading: L.value,
						disabled: I.value || V.value || R.value,
						onClick: we
					}, {
						default: B(() => [w("保存" + P(ve))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: B(() => [C("div", {
					class: "taxonomy-editor",
					"aria-busy": I.value
				}, [
					I.value ? (k(), S("div", ge, [T(F(m), {
						name: "loader-circle",
						class: "news-spin",
						size: 24
					}), C("span", null, "正在读取" + P(ve) + "...")])) : x("", !0),
					H.value ? (k(), b(F(d), {
						key: 1,
						type: "error",
						closable: !1,
						description: H.value
					}, null, 8, ["description"])) : x("", !0),
					!I.value && !V.value ? (k(), b(F(a), {
						key: 2,
						model: M,
						"label-position": "top",
						onSubmit: pe(we, ["prevent"])
					}, {
						default: B(() => [
							M.id ? (k(), b(F(p), {
								key: 0,
								label: "分类ID"
							}, {
								default: B(() => [T(F(g), {
									"model-value": M.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : x("", !0),
							T(F(p), {
								label: `${ve}名称`,
								required: ""
							}, {
								default: B(() => [T(F(g), {
									modelValue: M.name,
									"onUpdate:modelValue": r[1] ||= (e) => M.name = e,
									maxlength: 120,
									disabled: U.value || J.value,
									"aria-label": `${ve}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							T(F(p), { label: "父分类" }, {
								default: B(() => [C("div", _e, [T(F(c), {
									modelValue: M.parent_id,
									"onUpdate:modelValue": r[2] ||= (e) => M.parent_id = e,
									options: De.value,
									disabled: U.value || J.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), r[10] ||= C("p", { class: "news-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类新闻。 ", -1)])]),
								_: 1
							}),
							C("div", Q, [T(F(p), {
								label: "前端排序",
								required: ""
							}, {
								default: B(() => [T(F(e), {
									modelValue: M.sort_order,
									"onUpdate:modelValue": r[3] ||= (e) => M.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: U.value || J.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), T(F(p), { label: "启用状态" }, {
								default: B(() => [T(Y, {
									modelValue: M.is_enabled,
									"onUpdate:modelValue": r[4] ||= (e) => M.is_enabled = e,
									disabled: U.value || J.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : x("", !0)
				], 8, Z)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			T(F(f), {
				modelValue: z.value,
				"onUpdate:modelValue": r[7] ||= (e) => z.value = e,
				title: "删除新闻分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !R.value
			}, {
				footer: B(() => [T(F(n), {
					disabled: R.value,
					onClick: r[6] ||= (e) => z.value = !1
				}, {
					default: B(() => [...r[13] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(F(n), {
					variant: "danger",
					loading: R.value,
					onClick: Ee
				}, {
					default: B(() => [...r[14] ||= [w("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: B(() => [C("p", null, "确认删除分类“" + P(M.name) + "”？有关联新闻或子分类的分类无法删除。", 1), fe.value ? (k(), b(F(d), {
					key: 0,
					type: "error",
					closable: !1,
					description: fe.value
				}, null, 8, ["description"])) : x("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			T(F(f), {
				modelValue: he.value,
				"onUpdate:modelValue": r[9] ||= (e) => he.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: B(() => [T(F(n), { onClick: r[8] ||= (e) => he.value = !1 }, {
					default: B(() => [...r[15] ||= [w("继续编辑", -1)]]),
					_: 1
				}), T(F(n), {
					variant: "primary",
					onClick: Ce
				}, {
					default: B(() => [...r[16] ||= [w("放弃修改", -1)]]),
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
	let i = j(), a = j(), o = j(null), s = j(Date.now()), c = ue({}), l = j(""), ee = Object.fromEntries($.map((e) => [e, {
		required: e === "title" || e === "category_id",
		trigger: "submit"
	}])), te = y(() => o.value ? xe(e, t(), n, o.value === "draft" ? "draft" : e.scheduled_local ? "scheduled" : "published", s.value) : {}), ne = y(() => ({
		...c,
		...te.value
	})), u = y(() => Object.keys(ne.value).length);
	for (let t of $) z(() => e[t], () => {
		delete c[t], l.value = "", s.value = Date.now();
	}, { deep: !0 });
	function re() {
		ne.value.seo_description && a.value?.focus();
	}
	async function d() {
		await oe();
		let e = [...i.value?.querySelectorAll("[data-prop]") || []].find((e) => ne.value[e.dataset.prop]);
		if (!e && ne.value.seo_description) {
			r.value ? re() : r.value = !0;
			return;
		}
		e && (e.scrollIntoView({
			block: "center",
			behavior: "auto"
		}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
	}
	async function f(e) {
		o.value = e === "draft" ? "draft" : "publish", s.value = Date.now(), l.value = "";
		for (let e of $) delete c[e];
		return u.value ? (await d(), !1) : !0;
	}
	function ie(e) {
		let t = Se(e, n);
		Object.assign(c, t.fields), l.value = t.general;
	}
	return {
		editorRoot: i,
		seoInput: a,
		fieldRules: ee,
		fieldErrors: ne,
		pendingCount: u,
		saveError: l,
		validateSave: f,
		setSaveFailure: ie,
		focusFirstError: d,
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
}, Me = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "CoverFileItem",
	props: {
		url: {},
		file: {},
		disabled: { type: Boolean }
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = j(null), a = j(!1), o = j(!1), s = j(""), c, l = y(() => {
			try {
				let e = new URL(n.url, window.location.href);
				return ["http:", "https:"].includes(e.protocol) ? e.href : "";
			} catch {
				return "";
			}
		}), ee = y(() => {
			if (n.file) return n.file.name;
			let e = l.value ? new URL(l.value).pathname.split("/").pop() : "";
			if (!e) return "封面图片";
			try {
				return decodeURIComponent(e);
			} catch {
				return e;
			}
		}), te = y(() => i.value === null ? "大小未知" : i.value < 1024 ? `${i.value} B` : i.value < 1024 * 1024 ? `${(i.value / 1024).toFixed(1)} KB` : `${(i.value / (1024 * 1024)).toFixed(1)} MB`);
		z(() => [n.url, n.file], async (e, t, r) => {
			if (c?.abort(), c = void 0, o.value = !1, s.value = "", a.value = !1, i.value = n.file?.size ?? null, n.file || !l.value) return;
			let ee = new AbortController(), te = window.setTimeout(() => ee.abort(), 5e3);
			r(() => {
				ee.abort(), window.clearTimeout(te);
			});
			try {
				let e = await fetch(l.value, {
					method: "HEAD",
					signal: ee.signal,
					credentials: "omit",
					referrerPolicy: "no-referrer"
				}), t = e.headers.get("content-length"), n = t && /^\d+$/.test(t) ? Number(t) : NaN;
				e.ok && !ee.signal.aborted && Number.isFinite(n) && n >= 0 && (i.value = n);
			} catch {} finally {
				window.clearTimeout(te);
			}
		}, { immediate: !0 });
		async function ne() {
			if (o.value || !l.value) return;
			let e = new AbortController();
			c = e;
			let t = window.setTimeout(() => e.abort(), 15e3), r = ee.value;
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
		}), (t, n) => (k(), S("div", we, [C("div", Te, [
			C("span", Ee, [a.value ? (k(), b(F(m), {
				key: 1,
				name: "image",
				size: 20
			})) : (k(), S("img", {
				key: 0,
				src: e.url,
				alt: "封面缩略图",
				onError: n[0] ||= (e) => a.value = !0
			}, null, 40, De))]),
			C("a", {
				class: "file-name",
				href: l.value || void 0,
				download: ee.value,
				title: ee.value,
				"aria-busy": o.value,
				"aria-disabled": o.value || !l.value,
				onClick: pe(ne, ["prevent", "stop"])
			}, P(ee.value), 9, Oe),
			C("span", ke, P(te.value), 1),
			C("button", {
				class: "file-remove",
				type: "button",
				"aria-label": "移除封面",
				title: "移除封面",
				disabled: e.disabled,
				onClick: n[1] ||= pe((e) => r("remove"), ["stop"])
			}, [T(F(m), {
				name: "close",
				size: 14
			})], 8, Ae)
		]), s.value ? (k(), S("span", je, P(s.value), 1)) : x("", !0)]));
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
}, ze = /*#__PURE__*/ _(/* @__PURE__ */ E({
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
		let n = e, r = t, i = j(), a = N(), s = j(!1), c = j(!1), l;
		z(() => n.modelValue, (e) => {
			c.value = !1, a.value?.url !== e && (a.value = void 0);
		});
		async function ee({ file: e, signal: t }) {
			l = void 0, s.value = !0, r("busy-change", !0), r("start");
			try {
				let i = await n.upload(e, t);
				return t.aborted || (a.value = {
					url: i.url,
					file: e
				}, c.value = !1, r("update:modelValue", i.url)), i;
			} catch (e) {
				throw t.aborted || (l = { error: e }), e;
			} finally {
				s.value = !1, r("busy-change", !1);
			}
		}
		function te() {
			oe(() => i.value?.clearFiles());
		}
		function ne() {
			r("success"), te();
		}
		function u(e, t) {
			r("error", l ? l.error : t), l = void 0, te();
		}
		function re() {
			n.disabled || s.value || (a.value = void 0, c.value = !1, r("update:modelValue", ""));
		}
		return (t, n) => (k(), S("div", Ne, [
			T(F(o), {
				ref_key: "uploadRef",
				ref: i,
				class: "content-cover__upload",
				drag: "",
				accept: "image/jpeg,image/png,image/webp",
				limit: 1,
				"max-size": 5242880,
				disabled: e.disabled || s.value,
				request: ee,
				onSuccess: ne,
				onError: u,
				onExceed: n[2] ||= (e) => r("error", /* @__PURE__ */ Error("一次只能上传一张封面图片"))
			}, {
				default: B(() => [C("div", Pe, [e.modelValue ? (k(), S("img", {
					key: 0,
					src: e.modelValue,
					alt: e.label,
					draggable: "false",
					onError: n[0] ||= (e) => c.value = !0,
					onLoad: n[1] ||= (e) => c.value = !1
				}, null, 40, Fe)) : (k(), S("div", Ie, [T(F(m), {
					name: "image",
					size: 28
				})])), e.modelValue ? x("", !0) : (k(), S("span", Le, [w(P(s.value ? "正在上传…" : "拖动图片到此处，或点击上传") + " ", 1), n[3] ||= C("span", { class: "content-cover__types" }, "JPG / PNG / WebP，最大 5 MB", -1)]))])]),
				_: 1
			}, 8, ["disabled"]),
			c.value ? (k(), S("span", Re, " 封面无法加载，请重新上传 ")) : x("", !0),
			e.modelValue ? (k(), b(Me, {
				key: 1,
				url: e.modelValue,
				file: a.value?.url === e.modelValue ? a.value.file : void 0,
				disabled: e.disabled || s.value,
				onRemove: re
			}, null, 8, [
				"url",
				"file",
				"disabled"
			])) : x("", !0)
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
}, tt = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(r, { emit: i }) {
		let { newsError: o, newsCategoryLabel: s, deleteNews: l, getNewsDetail: ee, getNewsMetadata: te, saveNews: ne, uploadNewsCover: re } = q(), { hasPermission: ie } = me(), ae = r, h = i, _ = j(!0), E = j(!1), D = j(!1), O = j(""), oe = j(!1), se = j(!1), A = j(!1), de = j(!1), M = j(me().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), N = j(), I = j("draft"), R = j(!1), z = y(() => ie(["cms_news:publish"])), V = y(() => !ie([`cms_news:${ae.articleId ? "edit" : "add"}`]) || !z.value && I.value !== "draft"), H = y(() => ie(["cms_news:delete"]) && (z.value || I.value === "draft"));
		async function U() {
			if (!(!H.value || E.value || _.value || D.value)) {
				E.value = !0, O.value = "";
				try {
					await l("articles", G.id, G.row_version), xe = JSON.stringify(G), u.success("新闻已删除"), h("saved");
				} catch (e) {
					O.value = o(e), de.value = !1;
				} finally {
					E.value = !1;
				}
			}
		}
		let W = y(() => V.value || E.value), G = ue({
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
		}), { editorRoot: K, seoInput: J, fieldRules: X, fieldErrors: Z, pendingCount: ge, saveError: _e, validateSave: Q, setSaveFailure: ve, focusFirstError: ye, focusSeoError: be } = Ce(G, () => N.value?.categories || [], "news", oe), $ = y(() => (N.value?.categories || []).map((e) => ({
			label: s(N.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
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
			_.value = !0, D.value = !1, O.value = "";
			try {
				if (N.value = await te(e.signal, { cms_source_type: "platform" }), ae.articleId) {
					let t = await ee("articles", ae.articleId, e.signal);
					if (N.value = await te(e.signal, { space_id: String(t.space_id) }), M.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
				xe = JSON.stringify(G);
			} catch (t) {
				e.signal.aborted || (O.value = o(t), D.value = !0);
			} finally {
				e.signal.aborted || (_.value = !1);
			}
		}
		let Ee = () => !_.value && !D.value && xe !== JSON.stringify(G);
		function De() {
			Ee() ? se.value = !0 : h("close");
		}
		function Oe() {
			I.value === "draft" ? Ae("draft") : A.value = !0;
		}
		function ke() {
			A.value = !1, Ae("draft");
		}
		async function Ae(e) {
			if (W.value || _.value || D.value || R.value || (O.value = "", !await Q(e))) return;
			let t = G.scheduled_local ? new Date(G.scheduled_local) : null;
			E.value = !0, O.value = "";
			try {
				await ne("articles", {
					...G,
					id: G.id || void 0,
					row_version: G.id ? G.row_version : void 0,
					category_id: G.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), xe = JSON.stringify(G), u.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "新闻已发布"), h("saved");
			} catch (e) {
				ve(e);
			} finally {
				E.value = !1;
			}
			ge.value && await ye();
		}
		function je(e) {
			O.value = o(e);
		}
		let Me = (e) => {
			Ee() && (e.preventDefault(), e.returnValue = "");
		};
		return he(() => !E.value && !R.value && (!Ee() || window.confirm("新闻有未保存的修改，确定离开？"))), le(() => {
			Te(), window.addEventListener("beforeunload", Me);
		}), ce(() => {
			Se?.abort(), window.removeEventListener("beforeunload", Me);
		}), (i, o) => (k(), S("section", {
			ref_key: "editorRoot",
			ref: K,
			class: "article-editor",
			"aria-busy": _.value || E.value
		}, [
			C("header", Ve, [
				T(F(n), {
					"icon-only": "",
					title: "返回新闻列表",
					"aria-label": "返回新闻列表",
					disabled: E.value || R.value,
					onClick: De
				}, {
					default: B(() => [T(F(m), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				C("div", He, [C("h2", null, P(r.articleId ? "编辑新闻" : "新增新闻"), 1), C("span", null, P(N.value?.source_locale || "zh-CN") + " · " + P(M.value), 1)]),
				C("div", Ue, [
					r.articleId && H.value ? (k(), b(F(n), {
						key: 0,
						size: "sm",
						disabled: _.value || D.value || E.value || R.value,
						onClick: o[0] ||= (e) => de.value = !0
					}, {
						default: B(() => [...o[28] ||= [w("删除新闻", -1)]]),
						_: 1
					}, 8, ["disabled"])) : x("", !0),
					T(F(n), {
						size: "sm",
						disabled: _.value || D.value,
						onClick: o[1] ||= (e) => oe.value = !0
					}, {
						icon: B(() => [T(F(m), {
							name: "search",
							size: 14
						})]),
						default: B(() => [o[29] ||= w("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					V.value ? x("", !0) : (k(), b(F(n), {
						key: 1,
						size: "sm",
						disabled: _.value || D.value || E.value || R.value,
						onClick: Oe
					}, {
						icon: B(() => [T(F(m), {
							name: "save",
							size: 14
						})]),
						default: B(() => [o[30] ||= w("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					F(_e) ? (k(), S("span", We, P(F(_e)), 1)) : x("", !0),
					!V.value && F(ge) ? (k(), S("span", Ge, "还有 " + P(F(ge)) + " 项待完善", 1)) : x("", !0),
					!V.value && z.value ? (k(), b(F(n), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: _.value || D.value || R.value,
						loading: E.value,
						onClick: o[2] ||= (e) => Ae(G.scheduled_local ? "scheduled" : "published")
					}, {
						icon: B(() => [T(F(m), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: B(() => [w(P(G.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : x("", !0)
				])
			]),
			_.value ? (k(), S("div", Ke, [T(F(m), {
				name: "loader-circle",
				class: "news-spin",
				size: 28
			}), o[31] ||= C("span", null, "正在读取新闻资料...", -1)])) : D.value ? (k(), S("div", qe, [T(F(d), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"]), T(F(n), { onClick: Te }, {
				default: B(() => [...o[32] ||= [w("重新加载", -1)]]),
				_: 1
			})])) : (k(), S(v, { key: 2 }, [O.value ? (k(), S("div", Je, [T(F(d), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"])])) : x("", !0), C("div", Ye, [C("aside", Xe, [T(F(a), {
				model: G,
				rules: F(X),
				"label-position": "top",
				onSubmit: o[12] ||= pe(() => {}, ["prevent"])
			}, {
				default: B(() => [
					T(F(p), {
						label: "新闻分类",
						prop: "category_id",
						error: F(Z).category_id,
						required: ""
					}, {
						default: B(() => [T(F(c), {
							modelValue: G.category_id,
							"onUpdate:modelValue": o[3] ||= (e) => G.category_id = e,
							options: $.value,
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
					o[33] ||= C("h3", null, "新闻设置", -1),
					T(F(p), {
						label: "新闻封面",
						prop: "cover_url",
						error: F(Z).cover_url
					}, {
						default: B(() => [T(ze, {
							modelValue: G.cover_url,
							"onUpdate:modelValue": o[4] ||= (e) => G.cover_url = e,
							label: "新闻封面",
							disabled: W.value,
							upload: F(re),
							onBusyChange: o[5] ||= (e) => R.value = e,
							onStart: o[6] ||= (e) => O.value = "",
							onError: je
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "内容来源",
						prop: "content_source",
						error: F(Z).content_source
					}, {
						default: B(() => [T(F(g), {
							modelValue: G.content_source,
							"onUpdate:modelValue": o[7] ||= (e) => G.content_source = e,
							maxlength: 160,
							disabled: W.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "作者署名",
						prop: "author_name",
						error: F(Z).author_name
					}, {
						default: B(() => [T(F(g), {
							modelValue: G.author_name,
							"onUpdate:modelValue": o[8] ||= (e) => G.author_name = e,
							maxlength: 120,
							disabled: W.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "前端排序",
						prop: "sort_order",
						error: F(Z).sort_order
					}, {
						default: B(() => [T(F(e), {
							modelValue: G.sort_order,
							"onUpdate:modelValue": o[9] ||= (e) => G.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: W.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[34] ||= C("h3", null, "发布设置", -1),
					T(F(p), {
						label: "启用状态",
						prop: "is_enabled",
						error: F(Z).is_enabled
					}, {
						default: B(() => [T(Y, {
							modelValue: G.is_enabled,
							"onUpdate:modelValue": o[10] ||= (e) => G.is_enabled = e,
							disabled: W.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: F(Z).scheduled_local
					}, {
						default: B(() => [T(F(g), {
							modelValue: G.scheduled_local,
							"onUpdate:modelValue": o[11] ||= (e) => G.scheduled_local = e,
							type: "datetime-local",
							disabled: W.value || !z.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[35] ||= C("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), C("main", Ze, [T(F(a), {
				model: G,
				rules: F(X),
				"label-position": "top",
				onSubmit: o[16] ||= pe(() => {}, ["prevent"])
			}, {
				default: B(() => [
					T(F(p), {
						label: "标题",
						prop: "title",
						error: F(Z).title,
						required: ""
					}, {
						default: B(() => [T(F(g), {
							modelValue: G.title,
							"onUpdate:modelValue": o[13] ||= (e) => G.title = e,
							maxlength: 255,
							disabled: W.value,
							placeholder: "输入新闻标题",
							"aria-label": "新闻标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "摘要",
						prop: "summary",
						error: F(Z).summary
					}, {
						default: B(() => [fe(C("textarea", {
							"onUpdate:modelValue": o[14] ||= (e) => G.summary = e,
							"aria-invalid": !!F(Z).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: W.value,
							"aria-label": "新闻摘要"
						}, null, 8, Qe), [[L, G.summary]])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "正文",
						prop: "body_html",
						error: F(Z).body_html
					}, {
						default: B(() => [T(F(t), {
							modelValue: G.body_html,
							"onUpdate:modelValue": o[15] ||= (e) => G.body_html = e,
							readonly: V.value,
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
			T(F(f), {
				modelValue: oe.value,
				"onUpdate:modelValue": o[20] ||= (e) => oe.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: B(() => [T(F(n), {
					variant: "primary",
					onClick: o[19] ||= (e) => oe.value = !1
				}, {
					default: B(() => [...o[36] ||= [w("确定", -1)]]),
					_: 1
				})]),
				default: B(() => [T(F(a), {
					model: G,
					rules: F(X),
					"label-position": "top",
					onSubmit: o[18] ||= pe(() => {}, ["prevent"])
				}, {
					default: B(() => [T(F(p), {
						label: "SEO 描述",
						prop: "seo_description",
						error: F(Z).seo_description
					}, {
						default: B(() => [fe(C("textarea", {
							ref_key: "seoInput",
							ref: J,
							"onUpdate:modelValue": o[17] ||= (e) => G.seo_description = e,
							"aria-invalid": !!F(Z).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: W.value,
							"aria-label": "SEO 描述"
						}, null, 8, $e), [[L, G.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			T(F(f), {
				modelValue: de.value,
				"onUpdate:modelValue": o[22] ||= (e) => de.value = e,
				title: "确认删除",
				subtitle: `操作对象：${G.title || "未命名新闻"}`,
				width: "460px",
				"panel-class": "news-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !E.value
			}, {
				"header-actions": B(() => [C("span", et, [T(F(m), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: B(() => [T(F(n), {
					disabled: E.value,
					onClick: o[21] ||= (e) => de.value = !1
				}, {
					default: B(() => [...o[37] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(F(n), {
					variant: "warning",
					loading: E.value,
					onClick: U
				}, {
					default: B(() => [...o[38] ||= [w("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: B(() => [T(F(d), {
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
			T(F(f), {
				modelValue: se.value,
				"onUpdate:modelValue": o[25] ||= (e) => se.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: B(() => [T(F(n), { onClick: o[23] ||= (e) => se.value = !1 }, {
					default: B(() => [...o[39] ||= [w("继续编辑", -1)]]),
					_: 1
				}), T(F(n), {
					variant: "primary",
					onClick: o[24] ||= (e) => h("close")
				}, {
					default: B(() => [...o[40] ||= [w("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			T(F(f), {
				modelValue: A.value,
				"onUpdate:modelValue": o[27] ||= (e) => A.value = e,
				title: "将新闻转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: B(() => [T(F(n), { onClick: o[26] ||= (e) => A.value = !1 }, {
					default: B(() => [...o[41] ||= [w("取消", -1)]]),
					_: 1
				}), T(F(n), {
					variant: "primary",
					onClick: ke
				}, {
					default: B(() => [...o[42] ||= [w("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Be));
	}
}), [["__scopeId", "data-v-9ad8501f"]]), nt = { class: "news-articles" }, rt = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(e) {
		let { newsPublishStates: t, newsCategoryLabel: r, getNewsList: i, getNewsMetadata: a } = q(), { hasPermission: o } = me(), { formatDateTime: s } = me(), c = j(!1), l = j(), ne = (e) => o([`cms_news:${e}`]), u = j(), d = G(a, (e) => {
			u.value = e;
		}), f = [
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
				formatter: (e) => r(u.value, e)
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
		], { proTableBindings: ie, reload: p, filters: ae } = te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: y(() => [
				...d.fields,
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
					}, ...(u.value?.categories || []).map((e) => ({
						label: r(u.value, e.id),
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
		d.bindFilters(ae);
		let h = new AbortController();
		async function g() {
			try {
				u.value = await a(h.signal);
			} catch {}
		}
		function _(e) {
			l.value = e, c.value = !0;
		}
		function v() {
			c.value = !1, p(), g();
		}
		return le(g), ce(() => h.abort()), (e, r) => (k(), S("div", nt, [c.value ? (k(), b(tt, {
			key: 0,
			"article-id": l.value,
			onClose: r[0] ||= (e) => c.value = !1,
			onSaved: v
		}, null, 8, ["article-id"])) : x("", !0), fe(T(F(ee), O(F(ie), {
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
			"cell-cms_source_type": B(({ row: e }) => [T(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": B(() => [ne("add") ? (k(), b(F(n), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: r[1] ||= (e) => _()
			}, {
				icon: B(() => [T(F(m), {
					name: "plus",
					size: 14
				})]),
				default: B(() => [r[2] ||= w("新增新闻", -1)]),
				_: 1
			})) : x("", !0)]),
			"cell-publish_status": B(({ row: e }) => [T(F(re), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: B(() => [w(P(F(t).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": B(({ row: e }) => [T(F(re), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: B(() => [w(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": B(({ row: e }) => [w(P(F(s)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": B(({ row: e }) => [T(F(n), {
				size: "sm",
				"icon-only": "",
				title: ne("edit") ? "编辑新闻" : "新闻详情",
				"aria-label": ne("edit") ? "编辑新闻" : "新闻详情",
				onClick: (t) => _(e.id)
			}, {
				default: B(() => [T(F(m), {
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
		}, 16), [[R, !c.value]])]));
	}
}), [["__scopeId", "data-v-aef51e21"]]);
//#endregion
//#region src/cms/api/content/academy.ts
function it() {
	let e = me().request, t = "/cms/academy";
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
}, st = { class: "taxonomy-editor__row" }, ct = "分类", lt = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "CategoryTable",
	setup(t) {
		let { hasPermission: i } = me(), { formatDateTime: o } = me(), { academyDifficulties: s, academyError: l, getAcademyList: ne, getAcademyMetadata: ie, getAcademyDetail: ae, saveAcademy: h, deleteAcademyCategory: _ } = it(), E = (e) => i([`cms_academy_category:${e}`]), D = G(ie), oe = [
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
		], { proTableBindings: se, reload: le, currentPage: A, pageSize: de, total: M, filters: N } = te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: [
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
				let i = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), a = await ne("categories", {
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
		D.bindFilters(N);
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
		}), L = ue(I()), R = j(!1), z = j(!1), fe = j(!1), V = j(!1), H = j(!1), he = j(""), U = j(!1), q = j(""), J = j(!1), Y = y(() => !E(L.id ? "edit" : "add")), X = y(() => fe.value || V.value), Z = "", ge;
		async function _e(e) {
			ge?.abort(), ge = new AbortController();
			let t = ge;
			if (Object.assign(L, I(), { id: e || "" }), q.value = "", H.value = !1, he.value = "", U.value = !1, R.value = !0, z.value = !!e, Z = JSON.stringify(L), e) try {
				let n = await ae("categories", e, t.signal);
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
				}), Z = JSON.stringify(L);
			} catch (e) {
				t.signal.aborted || (U.value = !0, q.value = l(e));
			} finally {
				t.signal.aborted || (z.value = !1);
			}
		}
		function Q() {
			return X.value ? !1 : !z.value && !U.value && JSON.stringify(L) !== Z ? (J.value = !0, !1) : (ge?.abort(), !0);
		}
		function ve() {
			X.value || (ge?.abort(), R.value = !1);
		}
		function ye() {
			J.value = !1, R.value = !1;
		}
		async function be() {
			if (!(Y.value || X.value || z.value || U.value)) {
				if (!L.name.trim() || L.sort_order === null || !L.difficulty_levels.length) {
					q.value = "请填写名称、排序和适用难度";
					return;
				}
				fe.value = !0, q.value = "";
				try {
					await h("categories", {
						...L,
						id: L.id || void 0,
						row_version: L.id ? L.row_version : void 0
					}), R.value = !1, u.success("保存成功"), await le();
				} catch (e) {
					q.value = l(e);
				} finally {
					fe.value = !1;
				}
			}
		}
		function $() {
			!L.id || !E("delete") || X.value || z.value || U.value || (he.value = "", H.value = !0);
		}
		async function xe() {
			if (!(!H.value || !L.id || !E("delete") || X.value || z.value || U.value)) {
				V.value = !0, he.value = "";
				try {
					await _({
						id: L.id,
						row_version: L.row_version
					}), H.value = !1, R.value = !1, u.success("分类已删除"), await le(), A.value = Math.min(A.value, Math.max(1, Math.ceil(M.value / de.value)));
				} catch (e) {
					he.value = l(e);
				} finally {
					V.value = !1;
				}
			}
		}
		return ce(() => ge?.abort()), (t, i) => (k(), S(v, null, [
			T(F(ee), O(F(se), {
				"auto-refreshable": !1,
				columns: oe,
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
				"cell-cms_source_type": B(({ row: e }) => [T(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": B(() => [E("add") ? (k(), b(F(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: i[0] ||= (e) => _e()
				}, {
					icon: B(() => [T(F(m), {
						name: "plus",
						size: 14
					})]),
					default: B(() => [w("新增" + P(ct))]),
					_: 1
				})) : x("", !0)]),
				"cell-is_enabled": B(({ row: e }) => [T(F(re), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: B(() => [w(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": B(({ row: e }) => [T(F(n), {
					size: "sm",
					"icon-only": "",
					title: E("edit") ? `编辑${ct}` : `${ct}详情`,
					"aria-label": `编辑${ct}`,
					onClick: (t) => _e(e.id)
				}, {
					default: B(() => [T(F(m), {
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
			T(F(f), {
				modelValue: R.value,
				"onUpdate:modelValue": i[5] ||= (e) => R.value = e,
				title: `${L.id ? "编辑" : "新增"}课程${ct}`,
				width: "620px",
				"close-on-click-modal": !1,
				"before-close": Q
			}, {
				footer: B(() => [
					L.id && E("delete") ? (k(), b(F(n), {
						key: 0,
						variant: "danger",
						disabled: z.value || U.value || X.value,
						onClick: $
					}, {
						icon: B(() => [T(F(m), {
							name: "trash-2",
							size: 14
						})]),
						default: B(() => [i[10] ||= w("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : x("", !0),
					T(F(n), {
						disabled: X.value,
						onClick: ve
					}, {
						default: B(() => [...i[11] ||= [w("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					Y.value ? x("", !0) : (k(), b(F(n), {
						key: 1,
						variant: "primary",
						loading: fe.value,
						disabled: z.value || U.value || V.value,
						onClick: be
					}, {
						default: B(() => [w("保存" + P(ct))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: B(() => [C("div", {
					class: "taxonomy-editor",
					"aria-busy": z.value
				}, [
					z.value ? (k(), S("div", ot, [T(F(m), {
						name: "loader-circle",
						class: "academy-spin",
						size: 24
					}), C("span", null, "正在读取" + P(ct) + "...")])) : x("", !0),
					q.value ? (k(), b(F(d), {
						key: 1,
						type: "error",
						closable: !1,
						description: q.value
					}, null, 8, ["description"])) : x("", !0),
					!z.value && !U.value ? (k(), b(F(a), {
						key: 2,
						model: L,
						"label-position": "top",
						onSubmit: pe(be, ["prevent"])
					}, {
						default: B(() => [
							T(F(p), {
								label: `${ct}名称`,
								required: ""
							}, {
								default: B(() => [T(F(g), {
									modelValue: L.name,
									"onUpdate:modelValue": i[1] ||= (e) => L.name = e,
									maxlength: 120,
									disabled: Y.value || X.value,
									"aria-label": `${ct}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							T(F(p), {
								label: "适用难度",
								required: ""
							}, {
								default: B(() => [T(F(c), {
									modelValue: L.difficulty_levels,
									"onUpdate:modelValue": i[2] ||= (e) => L.difficulty_levels = e,
									multiple: "",
									options: F(s),
									disabled: Y.value || X.value,
									"aria-label": "适用难度"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								])]),
								_: 1
							}),
							C("div", st, [T(F(p), {
								label: "前端排序",
								required: ""
							}, {
								default: B(() => [T(F(e), {
									modelValue: L.sort_order,
									"onUpdate:modelValue": i[3] ||= (e) => L.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: Y.value || X.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), T(F(p), { label: "启用状态" }, {
								default: B(() => [T(F(r), {
									modelValue: L.is_enabled,
									"onUpdate:modelValue": i[4] ||= (e) => L.is_enabled = e,
									disabled: Y.value || X.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : x("", !0)
				], 8, at)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			T(F(f), {
				modelValue: H.value,
				"onUpdate:modelValue": i[7] ||= (e) => H.value = e,
				title: "删除课程分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !V.value
			}, {
				footer: B(() => [T(F(n), {
					disabled: V.value,
					onClick: i[6] ||= (e) => H.value = !1
				}, {
					default: B(() => [...i[12] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(F(n), {
					variant: "danger",
					loading: V.value,
					onClick: xe
				}, {
					default: B(() => [...i[13] ||= [w("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: B(() => [C("p", null, "确认删除分类“" + P(L.name) + "”？有关联课程的分类无法删除。", 1), he.value ? (k(), b(F(d), {
					key: 0,
					type: "error",
					closable: !1,
					description: he.value
				}, null, 8, ["description"])) : x("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			T(F(f), {
				modelValue: J.value,
				"onUpdate:modelValue": i[9] ||= (e) => J.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: B(() => [T(F(n), { onClick: i[8] ||= (e) => J.value = !1 }, {
					default: B(() => [...i[14] ||= [w("继续编辑", -1)]]),
					_: 1
				}), T(F(n), {
					variant: "primary",
					onClick: ye
				}, {
					default: B(() => [...i[15] ||= [w("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 64));
	}
}), [["__scopeId", "data-v-b7830575"]]), ut = { class: "academy-categories" }, dt = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(e) {
		return (e, t) => (k(), S("div", ut, [T(lt)]));
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
}, Nt = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "CourseEditor",
	props: { courseId: {} },
	emits: ["close", "saved"],
	setup(i, { emit: o }) {
		let { hasPermission: s } = me(), { academyDifficulties: l, academyError: ee, deleteAcademyCourse: te, getAcademyDetail: ne, getAcademyMetadata: re, saveAcademy: ie, uploadAcademyCover: ae } = it(), h = i, _ = o, v = j(!0), E = j(!1), D = j(!1), O = j(""), se = j(!1), A = j(!1), de = j(!1), M = j(me().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), N = j(), I = j("draft"), R = j(!1), V = j(!1), H = j(""), U = y(() => s(["cms_academy:publish"])), W = y(() => !!h.courseId && s(["cms_academy:delete"]) && (U.value || I.value === "draft")), G = y(() => !s([`cms_academy:${h.courseId ? "edit" : "add"}`]) || !U.value && I.value !== "draft"), K = y(() => G.value || E.value), q = ue({
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
		}), J = j(), Y = j(), X = j(null), Z = j(Date.now()), ge = ue({}), _e = j(""), Q = Object.fromEntries(ft.map((e) => [e, {
			required: e === "title" || e === "category_ids",
			trigger: "submit"
		}])), ve = y(() => X.value ? ht(q, N.value?.categories || [], X.value === "draft" ? "draft" : q.scheduled_local ? "scheduled" : "published", Z.value) : {}), ye = y(() => ({
			...ge,
			...ve.value
		})), be = y(() => Object.keys(ye.value).length);
		for (let e of ft) z(() => q[e], () => {
			delete ge[e], e === "category_ids" && delete ge.difficulty_level, _e.value = "", Z.value = Date.now();
		}, { deep: !0 });
		function $() {
			ye.value.seo_description && Y.value?.focus();
		}
		async function xe() {
			await oe();
			let e = [...J.value?.querySelectorAll("[data-prop]") || []].find((e) => ye.value[e.dataset.prop]);
			if (!e && ye.value.seo_description) {
				se.value ? $() : se.value = !0;
				return;
			}
			e && (e.scrollIntoView({
				block: "center",
				behavior: "auto"
			}), (e.querySelector("[contenteditable=\"true\"], [role=\"combobox\"]:not([aria-disabled=\"true\"])") || e.querySelector("input:not(:disabled), textarea:not(:disabled), button:not(:disabled)"))?.focus({ preventScroll: !0 }));
		}
		let Se = y(() => (N.value?.categories || []).map((e) => ({
			label: e.name + (e.is_enabled ? "" : " (已停用)"),
			value: e.id,
			disabled: !e.is_enabled
		}))), Ce = y(() => {
			let e = (N.value?.categories || []).filter((e) => q.category_ids.includes(e.id));
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
			v.value = !0, D.value = !1, O.value = "";
			try {
				if (N.value = await re(e.signal, { cms_source_type: "platform" }), h.courseId) {
					let t = await ne("courses", h.courseId, e.signal);
					if (N.value = await re(e.signal, { space_id: String(t.space_id) }), M.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
				e.signal.aborted || (O.value = ee(t), D.value = !0);
			} finally {
				e.signal.aborted || (v.value = !1);
			}
		}
		let Oe = () => !v.value && !D.value && we !== JSON.stringify(q);
		function ke() {
			Oe() ? A.value = !0 : _("close");
		}
		function Ae() {
			I.value === "draft" ? Me("draft") : de.value = !0;
		}
		function je() {
			de.value = !1, Me("draft");
		}
		async function Me(e) {
			if (K.value || v.value || D.value || R.value) return;
			X.value = e === "draft" ? "draft" : "publish", Z.value = Date.now(), _e.value = "";
			for (let e of ft) delete ge[e];
			if (be.value) {
				await xe();
				return;
			}
			let t = q.scheduled_local ? new Date(q.scheduled_local) : null;
			E.value = !0, O.value = "";
			try {
				await ie("courses", {
					...q,
					id: q.id || void 0,
					row_version: q.id ? q.row_version : void 0,
					difficulty_level: q.difficulty_level || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), we = JSON.stringify(q), u.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "课程已发布"), _("saved");
			} catch (e) {
				let t = _t(e);
				Object.assign(ge, t.fields), _e.value = t.general;
			} finally {
				E.value = !1;
			}
			be.value && await xe();
		}
		function Ne() {
			H.value = "", V.value = !0;
		}
		async function Pe() {
			if (!(!W.value || v.value || D.value || E.value || R.value)) {
				E.value = !0, H.value = "";
				try {
					await te({
						id: q.id,
						row_version: q.row_version
					}), we = JSON.stringify(q), V.value = !1, u.success("课程已删除"), _("saved");
				} catch (e) {
					H.value = ee(e);
				} finally {
					E.value = !1;
				}
			}
		}
		function Fe(e) {
			ge.cover_url = ee(e);
		}
		function Ie() {
			delete ge.cover_url;
		}
		let Le = (e) => {
			Oe() && (e.preventDefault(), e.returnValue = "");
		};
		return he(() => !E.value && !R.value && (!Oe() || window.confirm("课程有未保存的修改，确定离开？"))), le(() => {
			De(), window.addEventListener("beforeunload", Le);
		}), ce(() => {
			Te?.abort(), window.removeEventListener("beforeunload", Le);
		}), (o, s) => (k(), S("section", {
			ref_key: "editorRoot",
			ref: J,
			class: "course-editor",
			"aria-busy": v.value || E.value
		}, [
			C("header", yt, [
				T(F(n), {
					"icon-only": "",
					title: "返回课程列表",
					"aria-label": "返回课程列表",
					disabled: E.value || R.value,
					onClick: ke
				}, {
					default: B(() => [T(F(m), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				C("div", bt, [C("h2", null, P(i.courseId ? "编辑课程" : "新增课程"), 1), C("span", null, P(N.value?.source_locale || "zh-CN") + " · " + P(M.value), 1)]),
				C("div", xt, [
					W.value ? (k(), b(F(n), {
						key: 0,
						variant: "danger",
						size: "sm",
						disabled: v.value || D.value || E.value || R.value,
						onClick: Ne
					}, {
						default: B(() => [...s[27] ||= [w("删除课程", -1)]]),
						_: 1
					}, 8, ["disabled"])) : x("", !0),
					T(F(n), {
						size: "sm",
						disabled: v.value || D.value,
						onClick: s[0] ||= (e) => se.value = !0
					}, {
						icon: B(() => [T(F(m), {
							name: "search",
							size: 14
						})]),
						default: B(() => [s[28] ||= w("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					G.value ? x("", !0) : (k(), b(F(n), {
						key: 1,
						size: "sm",
						disabled: v.value || D.value || E.value || R.value,
						onClick: Ae
					}, {
						icon: B(() => [T(F(m), {
							name: "save",
							size: 14
						})]),
						default: B(() => [s[29] ||= w("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					_e.value ? (k(), S("span", St, P(_e.value), 1)) : x("", !0),
					G.value ? x("", !0) : (k(), S("div", Ct, [be.value ? (k(), S("span", wt, "还有 " + P(be.value) + " 项待完善", 1)) : x("", !0), U.value ? (k(), b(F(n), {
						key: 1,
						variant: "primary",
						size: "sm",
						disabled: v.value || D.value || R.value,
						loading: E.value,
						onClick: s[1] ||= (e) => Me(q.scheduled_local ? "scheduled" : "published")
					}, {
						icon: B(() => [T(F(m), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: B(() => [w(P(q.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : x("", !0)]))
				])
			]),
			v.value ? (k(), S("div", Tt, [T(F(m), {
				name: "loader-circle",
				class: "academy-spin",
				size: 28
			}), s[30] ||= C("span", null, "正在读取课程资料...", -1)])) : D.value ? (k(), S("div", Et, [T(F(d), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"]), T(F(n), { onClick: De }, {
				default: B(() => [...s[31] ||= [w("重新加载", -1)]]),
				_: 1
			})])) : (k(), S("div", Dt, [C("aside", Ot, [T(F(a), {
				model: q,
				rules: F(Q),
				"label-position": "top",
				onSubmit: s[11] ||= pe(() => {}, ["prevent"])
			}, {
				default: B(() => [
					T(F(p), {
						label: "课程分类",
						prop: "category_ids",
						error: ye.value.category_ids,
						required: ""
					}, {
						default: B(() => [T(F(c), {
							modelValue: q.category_ids,
							"onUpdate:modelValue": s[2] ||= (e) => q.category_ids = e,
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
					s[32] ||= C("h3", null, "课程设置", -1),
					T(F(p), {
						label: "课程封面",
						prop: "cover_url",
						error: ye.value.cover_url
					}, {
						default: B(() => [T(ze, {
							modelValue: q.cover_url,
							"onUpdate:modelValue": s[3] ||= (e) => q.cover_url = e,
							label: "课程封面",
							disabled: K.value,
							upload: F(ae),
							onBusyChange: s[4] ||= (e) => R.value = e,
							onStart: s[5] ||= (e) => O.value = "",
							onError: Fe,
							onSuccess: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "课程难度",
						prop: "difficulty_level",
						error: ye.value.difficulty_level
					}, {
						default: B(() => [T(F(c), {
							modelValue: q.difficulty_level,
							"onUpdate:modelValue": s[6] ||= (e) => q.difficulty_level = e,
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
					T(F(p), {
						label: "预计课时(分钟)",
						prop: "estimated_minutes",
						error: ye.value.estimated_minutes
					}, {
						default: B(() => [T(F(e), {
							modelValue: q.estimated_minutes,
							"onUpdate:modelValue": s[7] ||= (e) => q.estimated_minutes = e,
							min: 1,
							max: 1e5,
							precision: 0,
							disabled: K.value,
							"aria-label": "预计课时"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "前端排序",
						prop: "sort_order",
						error: ye.value.sort_order
					}, {
						default: B(() => [T(F(e), {
							modelValue: q.sort_order,
							"onUpdate:modelValue": s[8] ||= (e) => q.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: K.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					s[33] ||= C("h3", null, "发布设置", -1),
					T(F(p), {
						label: "启用状态",
						prop: "is_enabled",
						error: ye.value.is_enabled
					}, {
						default: B(() => [T(F(r), {
							modelValue: q.is_enabled,
							"onUpdate:modelValue": s[9] ||= (e) => q.is_enabled = e,
							disabled: K.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "计划发布时间",
						prop: "scheduled_local",
						error: ye.value.scheduled_local
					}, {
						default: B(() => [T(F(g), {
							modelValue: q.scheduled_local,
							"onUpdate:modelValue": s[10] ||= (e) => q.scheduled_local = e,
							type: "datetime-local",
							disabled: K.value || !U.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"])
				]),
				_: 1
			}, 8, ["model", "rules"])]), C("main", kt, [T(F(a), {
				model: q,
				rules: F(Q),
				"label-position": "top",
				onSubmit: s[15] ||= pe(() => {}, ["prevent"])
			}, {
				default: B(() => [
					T(F(p), {
						label: "标题",
						prop: "title",
						error: ye.value.title,
						required: ""
					}, {
						default: B(() => [T(F(g), {
							modelValue: q.title,
							"onUpdate:modelValue": s[12] ||= (e) => q.title = e,
							maxlength: 255,
							disabled: K.value,
							placeholder: "输入课程标题",
							"aria-label": "课程标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "摘要",
						prop: "summary",
						error: ye.value.summary
					}, {
						default: B(() => [fe(C("textarea", {
							"onUpdate:modelValue": s[13] ||= (e) => q.summary = e,
							class: "course-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: K.value,
							"aria-invalid": !!ye.value.summary,
							"aria-label": "课程摘要"
						}, null, 8, At), [[L, q.summary]])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "正文",
						prop: "body_html",
						error: ye.value.body_html
					}, {
						default: B(() => [T(F(t), {
							modelValue: q.body_html,
							"onUpdate:modelValue": s[14] ||= (e) => q.body_html = e,
							readonly: G.value,
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
			T(F(f), {
				modelValue: se.value,
				"onUpdate:modelValue": s[19] ||= (e) => se.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1,
				onOpened: $
			}, {
				footer: B(() => [T(F(n), {
					variant: "primary",
					onClick: s[18] ||= (e) => se.value = !1
				}, {
					default: B(() => [...s[34] ||= [w("确定", -1)]]),
					_: 1
				})]),
				default: B(() => [T(F(a), {
					model: q,
					rules: F(Q),
					"label-position": "top",
					onSubmit: s[17] ||= pe(() => {}, ["prevent"])
				}, {
					default: B(() => [T(F(p), {
						label: "SEO 描述",
						prop: "seo_description",
						error: ye.value.seo_description
					}, {
						default: B(() => [fe(C("textarea", {
							ref_key: "seoInput",
							ref: Y,
							"onUpdate:modelValue": s[16] ||= (e) => q.seo_description = e,
							class: "course-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: K.value,
							"aria-invalid": !!ye.value.seo_description,
							"aria-label": "SEO 描述"
						}, null, 8, jt), [[L, q.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			T(F(f), {
				modelValue: V.value,
				"onUpdate:modelValue": s[21] ||= (e) => V.value = e,
				title: "确认删除",
				subtitle: `操作对象：${q.title || "未命名课程"}`,
				width: "460px",
				"panel-class": "course-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !E.value
			}, {
				"header-actions": B(() => [C("span", Mt, [T(F(m), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: B(() => [T(F(n), {
					disabled: E.value,
					onClick: s[20] ||= (e) => V.value = !1
				}, {
					default: B(() => [...s[35] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(F(n), {
					variant: "warning",
					loading: E.value,
					onClick: Pe
				}, {
					default: B(() => [...s[36] ||= [w("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: B(() => [T(F(d), {
					class: "course-delete-dialog__notice",
					type: "warning",
					closable: !1,
					"show-icon": !1,
					description: "确定删除这门课程吗？删除后将不再展示，请谨慎操作。"
				}), H.value ? (k(), b(F(d), {
					key: 0,
					type: "error",
					closable: !1,
					description: H.value
				}, null, 8, ["description"])) : x("", !0)]),
				_: 1
			}, 8, [
				"modelValue",
				"subtitle",
				"before-close"
			]),
			T(F(f), {
				modelValue: A.value,
				"onUpdate:modelValue": s[24] ||= (e) => A.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: B(() => [T(F(n), { onClick: s[22] ||= (e) => A.value = !1 }, {
					default: B(() => [...s[37] ||= [w("继续编辑", -1)]]),
					_: 1
				}), T(F(n), {
					variant: "primary",
					onClick: s[23] ||= (e) => _("close")
				}, {
					default: B(() => [...s[38] ||= [w("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			T(F(f), {
				modelValue: de.value,
				"onUpdate:modelValue": s[26] ||= (e) => de.value = e,
				title: "将课程转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: B(() => [T(F(n), { onClick: s[25] ||= (e) => de.value = !1 }, {
					default: B(() => [...s[39] ||= [w("取消", -1)]]),
					_: 1
				}), T(F(n), {
					variant: "primary",
					onClick: je
				}, {
					default: B(() => [...s[40] ||= [w("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, vt));
	}
}), [["__scopeId", "data-v-4bde73b0"]]), Pt = { class: "academy-courses" }, Ft = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = me(), { formatDateTime: r } = me(), { academyDifficulties: i, academyPublishStates: a, getAcademyList: o, getAcademyMetadata: s } = it(), c = j(!1), l = j(), ne = (e) => t([`cms_academy:${e}`]), u = j(), d = G(s, (e) => {
			u.value = e;
		}), f = [
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
		], { proTableBindings: ie, reload: p, filters: ae } = te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: y(() => [
				...d.fields,
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
					}, ...(u.value?.categories || []).map((e) => ({
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
		d.bindFilters(ae);
		let h = new AbortController();
		async function g() {
			try {
				u.value = await s(h.signal);
			} catch {}
		}
		function _(e) {
			l.value = e, c.value = !0;
		}
		function v() {
			c.value = !1, p(), g();
		}
		return le(g), ce(() => h.abort()), (e, t) => (k(), S("div", Pt, [c.value ? (k(), b(Nt, {
			key: 0,
			"course-id": l.value,
			onClose: t[0] ||= (e) => c.value = !1,
			onSaved: v
		}, null, 8, ["course-id"])) : x("", !0), fe(T(F(ee), O(F(ie), {
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
			"cell-cms_source_type": B(({ row: e }) => [T(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": B(() => [ne("add") ? (k(), b(F(n), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => _()
			}, {
				icon: B(() => [T(F(m), {
					name: "plus",
					size: 14
				})]),
				default: B(() => [t[2] ||= w("新增课程", -1)]),
				_: 1
			})) : x("", !0)]),
			"cell-publish_status": B(({ row: e }) => [T(F(re), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: B(() => [w(P(F(a).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": B(({ row: e }) => [T(F(re), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: B(() => [w(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": B(({ row: e }) => [w(P(F(r)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": B(({ row: e }) => [T(F(n), {
				size: "sm",
				"icon-only": "",
				title: ne("edit") ? "编辑课程" : "课程详情",
				"aria-label": ne("edit") ? "编辑课程" : "课程详情",
				onClick: (t) => _(e.id)
			}, {
				default: B(() => [T(F(m), {
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
		}, 16), [[R, !c.value]])]));
	}
}), [["__scopeId", "data-v-0a52bb25"]]);
//#endregion
//#region src/cms/api/content/help.ts
function It() {
	let e = me().request, t = "/cms/help", n = (n, r = {}) => e.get({
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
		uploadHelpCover: s,
		helpPublishStates: c,
		helpCategoryLabel: l,
		helpError: ee
	};
}
//#endregion
//#region src/cms/views/content/help/EnabledToggle.vue?vue&type=script&setup=true&lang.ts
var Lt = ["aria-checked", "disabled"], Rt = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "EnabledToggle",
	props: {
		modelValue: { type: Boolean },
		disabled: { type: Boolean }
	},
	emits: ["update:modelValue"],
	setup(e) {
		return (t, n) => (k(), S("button", {
			type: "button",
			role: "switch",
			class: se(["help-toggle", { "is-on": e.modelValue }]),
			"aria-checked": e.modelValue,
			"aria-label": "启用状态",
			disabled: e.disabled,
			onClick: n[0] ||= (n) => t.$emit("update:modelValue", !e.modelValue)
		}, [n[1] ||= C("span", {
			class: "help-toggle__track",
			"aria-hidden": "true"
		}, [C("span")], -1), C("span", null, P(e.modelValue ? "已启用" : "已停用"), 1)], 10, Lt));
	}
}), [["__scopeId", "data-v-5cfe8693"]]), zt = { class: "help-categories" }, Bt = ["aria-busy"], Vt = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Ht = { class: "taxonomy-editor__field" }, Ut = { class: "taxonomy-editor__field" }, Wt = { class: "taxonomy-editor__icon-control" }, Gt = ["title"], Kt = ["aria-label"], qt = { key: 1 }, Jt = {
	key: 0,
	class: "help-hint"
}, Yt = { class: "taxonomy-editor__row" }, Xt = "分类", Zt = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(t) {
		let { helpError: r, deleteHelp: i, getHelpMetadata: o, getHelpList: s, getHelpDetail: l, saveHelp: ne } = It(), { hasPermission: ae } = me(), { formatDateTime: _ } = me(), v = (e) => ae([`cms_help_category:${e}`]), E = j(), D = j(), oe = G(o, (e) => {
			E.value = e;
		}), se = [
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
				formatter: _
			},
			{
				key: "actions",
				title: "操作",
				width: 64,
				align: "center",
				fixed: "right",
				hideable: !1
			}
		], { proTableBindings: A, reload: de, filters: M } = te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: y(() => [
				...oe.fields,
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
		oe.bindFilters(M);
		let N = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			icon_key: "",
			sort_order: 10,
			is_enabled: !0
		}), I = ue(N()), L = [...h], R = new Set(L), z = y(() => R.has(I.icon_key) ? I.icon_key : void 0), fe = j(!1), V = j(!1), H = j(!1), he = j(!1), U = j(!1), q = j(""), J = j(!1), Y = j(""), X = y(() => !v(I.id ? "edit" : "add")), Z = y(() => H.value || he.value), ge;
		async function _e(e) {
			ge?.abort(), ge = new AbortController();
			let t = ge;
			Object.assign(I, N(), { id: e || "" }), Y.value = "", U.value = !1, q.value = "", J.value = !1, fe.value = !0, V.value = !0;
			try {
				if (D.value = await o(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await l("categories", e, t.signal);
				if (D.value = await o(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
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
				t.signal.aborted || (J.value = !0, Y.value = r(e));
			} finally {
				t.signal.aborted || (V.value = !1);
			}
		}
		function Q() {
			return Z.value ? !1 : (ge?.abort(), !0);
		}
		function ve() {
			Q() && (fe.value = !1);
		}
		async function ye() {
			if (!(X.value || Z.value || V.value || J.value)) {
				if (!I.name.trim() || I.sort_order === null) {
					Y.value = "请填写分类名称和排序";
					return;
				}
				if (I.icon_key.length > 128) {
					Y.value = "图标标识最多 128 个字符";
					return;
				}
				H.value = !0, Y.value = "";
				try {
					await ne("categories", {
						name: I.name,
						parent_id: I.parent_id || null,
						icon_key: I.icon_key || null,
						sort_order: I.sort_order,
						is_enabled: I.is_enabled,
						id: I.id || void 0,
						row_version: I.id ? I.row_version : void 0
					}), fe.value = !1, u.success("保存成功"), await Promise.all([de(), Ce()]);
				} catch (e) {
					Y.value = r(e);
				} finally {
					H.value = !1;
				}
			}
		}
		function be() {
			!I.id || !v("delete") || Z.value || V.value || J.value || (q.value = "", U.value = !0);
		}
		async function $() {
			if (!(!U.value || !I.id || !v("delete") || Z.value || V.value || J.value)) {
				he.value = !0, q.value = "";
				try {
					await i("categories", I.id, I.row_version), U.value = !1, fe.value = !1, u.success("分类已删除"), await Promise.all([de(), Ce()]);
				} catch (e) {
					q.value = r(e);
				} finally {
					he.value = !1;
				}
			}
		}
		let xe = y(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(D.value?.categories || []).filter((e) => !e.parent_id && e.id !== I.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), Se = new AbortController();
		async function Ce() {
			try {
				E.value = await o(Se.signal);
			} catch {}
		}
		return le(Ce), ce(() => {
			ge?.abort(), Se.abort();
		}), (t, r) => (k(), S("div", zt, [
			T(F(ee), O(F(A), {
				"auto-refreshable": !1,
				columns: se,
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
				"cell-cms_source_type": B(({ row: e }) => [T(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": B(() => [v("add") ? (k(), b(F(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => _e()
				}, {
					icon: B(() => [T(F(m), {
						name: "plus",
						size: 14
					})]),
					default: B(() => [w("新增" + P(Xt))]),
					_: 1
				})) : x("", !0)]),
				"cell-is_enabled": B(({ row: e }) => [T(F(re), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: B(() => [w(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": B(({ row: e }) => [T(F(n), {
					size: "sm",
					"icon-only": "",
					title: v("edit") ? `编辑${Xt}` : `${Xt}详情`,
					"aria-label": `编辑${Xt}`,
					onClick: (t) => _e(e.id)
				}, {
					default: B(() => [T(F(m), {
						name: v("edit") ? "square-pen" : "panel-right-open",
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
			T(F(f), {
				modelValue: fe.value,
				"onUpdate:modelValue": r[6] ||= (e) => fe.value = e,
				title: `${I.id ? "编辑" : "新增"}帮助${Xt}`,
				width: "680px",
				subtitle: "帮助分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": Q
			}, {
				footer: B(() => [
					I.id && v("delete") ? (k(), b(F(n), {
						key: 0,
						variant: "danger",
						disabled: V.value || J.value || Z.value,
						onClick: be
					}, {
						icon: B(() => [T(F(m), {
							name: "trash-2",
							size: 14
						})]),
						default: B(() => [r[11] ||= w("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : x("", !0),
					T(F(n), {
						disabled: Z.value,
						onClick: ve
					}, {
						default: B(() => [...r[12] ||= [w("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					X.value ? x("", !0) : (k(), b(F(n), {
						key: 1,
						variant: "primary",
						loading: H.value,
						disabled: V.value || J.value || he.value,
						onClick: ye
					}, {
						default: B(() => [w("保存" + P(Xt))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: B(() => [C("div", {
					class: "taxonomy-editor",
					"aria-busy": V.value
				}, [
					V.value ? (k(), S("div", Vt, [T(F(m), {
						name: "loader-circle",
						class: "help-spin",
						size: 24
					}), C("span", null, "正在读取" + P(Xt) + "...")])) : x("", !0),
					Y.value ? (k(), b(F(d), {
						key: 1,
						type: "error",
						closable: !1,
						description: Y.value
					}, null, 8, ["description"])) : x("", !0),
					!V.value && !J.value ? (k(), b(F(a), {
						key: 2,
						model: I,
						"label-position": "top",
						onSubmit: pe(ye, ["prevent"])
					}, {
						default: B(() => [
							I.id ? (k(), b(F(p), {
								key: 0,
								label: "分类ID"
							}, {
								default: B(() => [T(F(g), {
									"model-value": I.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : x("", !0),
							T(F(p), {
								label: `${Xt}名称`,
								required: ""
							}, {
								default: B(() => [T(F(g), {
									modelValue: I.name,
									"onUpdate:modelValue": r[1] ||= (e) => I.name = e,
									maxlength: 120,
									disabled: X.value || Z.value,
									"aria-label": `${Xt}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							T(F(p), { label: "父分类" }, {
								default: B(() => [C("div", Ht, [T(F(c), {
									modelValue: I.parent_id,
									"onUpdate:modelValue": r[2] ||= (e) => I.parent_id = e,
									options: xe.value,
									disabled: X.value || Z.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), r[9] ||= C("p", { class: "help-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类文章。 ", -1)])]),
								_: 1
							}),
							T(F(p), { label: "图标标识" }, {
								default: B(() => [C("div", Ut, [
									C("div", Wt, [T(F(ie), {
										modelValue: I.icon_key,
										"onUpdate:modelValue": r[3] ||= (e) => I.icon_key = e,
										suggestions: L,
										"min-length": 0,
										disabled: X.value || Z.value,
										clearable: "",
										placeholder: "输入或下拉选择 6mm 图标，例如 circle-help"
									}, {
										option: B(({ option: e }) => [C("span", {
											class: "taxonomy-editor__icon-option",
											title: String(e)
										}, [T(F(m), {
											name: String(e),
											size: 18
										}, null, 8, ["name"]), C("span", null, P(e), 1)], 8, Gt)]),
										_: 1
									}, 8, ["modelValue", "disabled"]), C("span", {
										class: "taxonomy-editor__icon-preview",
										role: "img",
										"aria-label": z.value ? `图标预览：${z.value}` : "暂无图标预览"
									}, [z.value ? (k(), b(F(m), {
										key: 0,
										name: z.value,
										size: 20
									}, null, 8, ["name"])) : (k(), S("span", qt, "—"))], 8, Kt)]),
									r[10] ||= C("p", { class: "help-hint" }, " 支持直接输入名称或从下拉列表选择；不填写 SVG 或 HTML。 ", -1),
									I.icon_key && !z.value ? (k(), S("p", Jt, " 当前名称不在已安装的 6mm 图标库中，暂无法预览。 ")) : x("", !0)
								])]),
								_: 1
							}),
							C("div", Yt, [T(F(p), {
								label: "前端排序",
								required: ""
							}, {
								default: B(() => [T(F(e), {
									modelValue: I.sort_order,
									"onUpdate:modelValue": r[4] ||= (e) => I.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: X.value || Z.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), T(F(p), { label: "启用状态" }, {
								default: B(() => [T(Rt, {
									modelValue: I.is_enabled,
									"onUpdate:modelValue": r[5] ||= (e) => I.is_enabled = e,
									disabled: X.value || Z.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : x("", !0)
				], 8, Bt)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			T(F(f), {
				modelValue: U.value,
				"onUpdate:modelValue": r[8] ||= (e) => U.value = e,
				title: "删除帮助分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !he.value
			}, {
				footer: B(() => [T(F(n), {
					disabled: he.value,
					onClick: r[7] ||= (e) => U.value = !1
				}, {
					default: B(() => [...r[13] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(F(n), {
					variant: "danger",
					loading: he.value,
					onClick: $
				}, {
					default: B(() => [...r[14] ||= [w("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: B(() => [C("p", null, "确认删除分类“" + P(I.name) + "”？有关联文章或子分类的分类无法删除。", 1), q.value ? (k(), b(F(d), {
					key: 0,
					type: "error",
					closable: !1,
					description: q.value
				}, null, 8, ["description"])) : x("", !0)]),
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
}, hn = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(r, { emit: i }) {
		let { helpError: o, helpCategoryLabel: s, deleteHelp: l, getHelpDetail: ee, getHelpMetadata: te, getHelpList: ne, saveHelp: re, uploadHelpCover: ie } = It(), { hasPermission: ae } = me(), h = r, _ = i, E = j(!0), D = j(!1), O = j(!1), oe = j(""), se = j(!1), A = j(!1), de = j(!1), M = j(!1), N = j(me().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), I = j(), R = j("draft"), z = j(!1), H = y(() => ae(["cms_help:publish"])), U = y(() => !ae([`cms_help:${h.articleId ? "edit" : "add"}`]) || !H.value && R.value !== "draft"), W = y(() => ae(["cms_help:delete"]) && (H.value || R.value === "draft"));
		async function G() {
			if (!(!W.value || D.value || E.value || O.value)) {
				D.value = !0, oe.value = "";
				try {
					await l("articles", q.id, q.row_version), De = JSON.stringify(q), u.success("文章已删除"), _("saved");
				} catch (e) {
					oe.value = o(e), M.value = !1;
				} finally {
					D.value = !1;
				}
			}
		}
		let K = y(() => U.value || D.value), q = ue({
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
		}), { editorRoot: J, seoInput: Y, fieldRules: X, fieldErrors: Z, pendingCount: ge, saveError: _e, validateSave: Q, setSaveFailure: ve, focusFirstError: ye, focusSeoError: be } = Ce(q, () => I.value?.categories || [], "help", se), $ = j(""), xe = j(!1), Se = j([]), we = y(() => Se.value.filter((e) => e.id !== h.articleId).map((e) => ({
			label: `${e.title} · ${e.code}`,
			value: e.id
		})));
		async function Te() {
			if (!(K.value || xe.value)) {
				xe.value = !0;
				try {
					let e = await ne("articles", {
						keyword: $.value,
						page_size: 100
					}, Oe?.signal), t = Se.value.filter((e) => q.related_content_ids.includes(e.id));
					Se.value = [...new Map([...t, ...e.lists].map((e) => [e.id, e])).values()];
				} catch (e) {
					Oe?.signal.aborted || (oe.value = o(e));
				} finally {
					xe.value = !1;
				}
			}
		}
		let Ee = y(() => (I.value?.categories || []).map((e) => ({
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
			E.value = !0, O.value = !1, oe.value = "";
			try {
				if (I.value = await te(e.signal, { cms_source_type: "platform" }), h.articleId) {
					let t = await ee("articles", h.articleId, e.signal);
					if (I.value = await te(e.signal, { space_id: String(t.space_id) }), N.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
					for (let e of [
						"id",
						"row_version",
						"title",
						"sort_order",
						"is_enabled"
					]) Object.assign(q, { [e]: t[e] });
					q.category_id = t.category_id || "", q.search_keywords = t.search_keywords || "", q.helpful_enabled = t.helpful_enabled ?? !0, q.related_content_ids = t.related_content_ids || [], Se.value = t.related_articles || [];
					for (let e of [
						"summary",
						"body_html",
						"seo_description",
						"cover_url",
						"content_source",
						"author_name"
					]) q[e] = t[e] || "";
					q.scheduled_local = t.publish_status === "scheduled" ? ke(t.scheduled_at) : "", R.value = t.publish_status;
				}
				De = JSON.stringify(q);
			} catch (t) {
				e.signal.aborted || (oe.value = o(t), O.value = !0);
			} finally {
				e.signal.aborted || (E.value = !1);
			}
		}
		let je = () => !E.value && !O.value && De !== JSON.stringify(q);
		function Me() {
			je() ? A.value = !0 : _("close");
		}
		function Ne() {
			R.value === "draft" ? Fe("draft") : de.value = !0;
		}
		function Pe() {
			de.value = !1, Fe("draft");
		}
		async function Fe(e) {
			if (K.value || E.value || O.value || z.value || (oe.value = "", !await Q(e))) return;
			let t = q.scheduled_local ? new Date(q.scheduled_local) : null;
			D.value = !0, oe.value = "";
			try {
				await re("articles", {
					...q,
					id: q.id || void 0,
					row_version: q.id ? q.row_version : void 0,
					category_id: q.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), De = JSON.stringify(q), u.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "文章已发布"), _("saved");
			} catch (e) {
				ve(e);
			} finally {
				D.value = !1;
			}
			ge.value && await ye();
		}
		function Ie(e) {
			oe.value = o(e);
		}
		let Le = (e) => {
			je() && (e.preventDefault(), e.returnValue = "");
		};
		return he(() => !D.value && !z.value && (!je() || window.confirm("文章有未保存的修改，确定离开？"))), le(() => {
			Ae(), window.addEventListener("beforeunload", Le);
		}), ce(() => {
			Oe?.abort(), window.removeEventListener("beforeunload", Le);
		}), (i, o) => (k(), S("section", {
			ref_key: "editorRoot",
			ref: J,
			class: "article-editor",
			"aria-busy": E.value || D.value
		}, [
			C("header", $t, [
				T(F(n), {
					"icon-only": "",
					title: "返回文章列表",
					"aria-label": "返回文章列表",
					disabled: D.value || z.value,
					onClick: Me
				}, {
					default: B(() => [T(F(m), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				C("div", en, [C("h2", null, P(r.articleId ? "编辑文章" : "新增文章"), 1), C("span", null, P(I.value?.source_locale || "zh-CN") + " · " + P(N.value), 1)]),
				C("div", tn, [
					r.articleId && W.value ? (k(), b(F(n), {
						key: 0,
						size: "sm",
						disabled: E.value || O.value || D.value || z.value,
						onClick: o[0] ||= (e) => M.value = !0
					}, {
						default: B(() => [...o[32] ||= [w("删除文章", -1)]]),
						_: 1
					}, 8, ["disabled"])) : x("", !0),
					T(F(n), {
						size: "sm",
						disabled: E.value || O.value,
						onClick: o[1] ||= (e) => se.value = !0
					}, {
						icon: B(() => [T(F(m), {
							name: "search",
							size: 14
						})]),
						default: B(() => [o[33] ||= w("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					U.value ? x("", !0) : (k(), b(F(n), {
						key: 1,
						size: "sm",
						disabled: E.value || O.value || D.value || z.value,
						onClick: Ne
					}, {
						icon: B(() => [T(F(m), {
							name: "save",
							size: 14
						})]),
						default: B(() => [o[34] ||= w("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					F(_e) ? (k(), S("span", nn, P(F(_e)), 1)) : x("", !0),
					!U.value && F(ge) ? (k(), S("span", rn, "还有 " + P(F(ge)) + " 项待完善", 1)) : x("", !0),
					!U.value && H.value ? (k(), b(F(n), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: E.value || O.value || z.value,
						loading: D.value,
						onClick: o[2] ||= (e) => Fe(q.scheduled_local ? "scheduled" : "published")
					}, {
						icon: B(() => [T(F(m), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: B(() => [w(P(q.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : x("", !0)
				])
			]),
			E.value ? (k(), S("div", an, [T(F(m), {
				name: "loader-circle",
				class: "help-spin",
				size: 28
			}), o[35] ||= C("span", null, "正在读取文章资料...", -1)])) : O.value ? (k(), S("div", on, [T(F(d), {
				type: "error",
				description: oe.value,
				closable: !1
			}, null, 8, ["description"]), T(F(n), { onClick: Ae }, {
				default: B(() => [...o[36] ||= [w("重新加载", -1)]]),
				_: 1
			})])) : (k(), S(v, { key: 2 }, [oe.value ? (k(), S("div", sn, [T(F(d), {
				type: "error",
				description: oe.value,
				closable: !1
			}, null, 8, ["description"])])) : x("", !0), C("div", cn, [C("aside", ln, [T(F(a), {
				model: q,
				rules: F(X),
				"label-position": "top",
				onSubmit: o[16] ||= pe(() => {}, ["prevent"])
			}, {
				default: B(() => [
					T(F(p), {
						label: "文章分类",
						prop: "category_id",
						error: F(Z).category_id,
						required: ""
					}, {
						default: B(() => [T(F(c), {
							modelValue: q.category_id,
							"onUpdate:modelValue": o[3] ||= (e) => q.category_id = e,
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
					o[39] ||= C("h3", null, "文章设置", -1),
					T(F(p), {
						label: "文章封面",
						prop: "cover_url",
						error: F(Z).cover_url
					}, {
						default: B(() => [T(ze, {
							modelValue: q.cover_url,
							"onUpdate:modelValue": o[4] ||= (e) => q.cover_url = e,
							label: "文章封面",
							disabled: K.value,
							upload: F(ie),
							onBusyChange: o[5] ||= (e) => z.value = e,
							onStart: o[6] ||= (e) => oe.value = "",
							onError: Ie
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "内容来源",
						prop: "content_source",
						error: F(Z).content_source
					}, {
						default: B(() => [T(F(g), {
							modelValue: q.content_source,
							"onUpdate:modelValue": o[7] ||= (e) => q.content_source = e,
							maxlength: 160,
							disabled: K.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "作者署名",
						prop: "author_name",
						error: F(Z).author_name
					}, {
						default: B(() => [T(F(g), {
							modelValue: q.author_name,
							"onUpdate:modelValue": o[8] ||= (e) => q.author_name = e,
							maxlength: 120,
							disabled: K.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "前端排序",
						prop: "sort_order",
						error: F(Z).sort_order
					}, {
						default: B(() => [T(F(e), {
							modelValue: q.sort_order,
							"onUpdate:modelValue": o[9] ||= (e) => q.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: K.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[40] ||= C("h3", null, "发布设置", -1),
					T(F(p), {
						label: "搜索关键词",
						prop: "search_keywords",
						error: F(Z).search_keywords
					}, {
						default: B(() => [T(F(g), {
							modelValue: q.search_keywords,
							"onUpdate:modelValue": o[10] ||= (e) => q.search_keywords = e,
							maxlength: 2e3,
							disabled: K.value,
							placeholder: "使用空格或逗号分隔",
							"aria-label": "搜索关键词"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: F(Z).helpful_enabled
					}, {
						default: B(() => [T(Rt, {
							modelValue: q.helpful_enabled,
							"onUpdate:modelValue": o[11] ||= (e) => q.helpful_enabled = e,
							disabled: K.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "相关文章",
						prop: "related_content_ids",
						error: F(Z).related_content_ids
					}, {
						default: B(() => [C("div", un, [
							T(F(g), {
								modelValue: $.value,
								"onUpdate:modelValue": o[12] ||= (e) => $.value = e,
								disabled: K.value,
								placeholder: "搜索文章标题",
								"aria-label": "搜索相关文章",
								onKeydown: V(pe(Te, ["prevent"]), ["enter"])
							}, null, 8, [
								"modelValue",
								"disabled",
								"onKeydown"
							]),
							T(F(n), {
								size: "sm",
								disabled: K.value,
								loading: xe.value,
								onClick: Te
							}, {
								default: B(() => [...o[37] ||= [w("查找文章", -1)]]),
								_: 1
							}, 8, ["disabled", "loading"]),
							T(F(c), {
								modelValue: q.related_content_ids,
								"onUpdate:modelValue": o[13] ||= (e) => q.related_content_ids = e,
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
							o[38] ||= C("p", { class: "article-editor__hint" }, " 最多 20 篇，按选择顺序展示。可关联草稿，前台须按发布状态过滤。 ", -1)
						])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "启用状态",
						prop: "is_enabled",
						error: F(Z).is_enabled
					}, {
						default: B(() => [T(Rt, {
							modelValue: q.is_enabled,
							"onUpdate:modelValue": o[14] ||= (e) => q.is_enabled = e,
							disabled: K.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: F(Z).scheduled_local
					}, {
						default: B(() => [T(F(g), {
							modelValue: q.scheduled_local,
							"onUpdate:modelValue": o[15] ||= (e) => q.scheduled_local = e,
							type: "datetime-local",
							disabled: K.value || !H.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[41] ||= C("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), C("main", dn, [T(F(a), {
				model: q,
				rules: F(X),
				"label-position": "top",
				onSubmit: o[20] ||= pe(() => {}, ["prevent"])
			}, {
				default: B(() => [
					T(F(p), {
						label: "标题",
						prop: "title",
						error: F(Z).title,
						required: ""
					}, {
						default: B(() => [T(F(g), {
							modelValue: q.title,
							"onUpdate:modelValue": o[17] ||= (e) => q.title = e,
							maxlength: 255,
							disabled: K.value,
							placeholder: "输入文章标题",
							"aria-label": "文章标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "摘要",
						prop: "summary",
						error: F(Z).summary
					}, {
						default: B(() => [fe(C("textarea", {
							"onUpdate:modelValue": o[18] ||= (e) => q.summary = e,
							"aria-invalid": !!F(Z).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: K.value,
							"aria-label": "文章摘要"
						}, null, 8, fn), [[L, q.summary]])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "正文",
						prop: "body_html",
						error: F(Z).body_html
					}, {
						default: B(() => [T(F(t), {
							modelValue: q.body_html,
							"onUpdate:modelValue": o[19] ||= (e) => q.body_html = e,
							readonly: U.value,
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
			T(F(f), {
				modelValue: se.value,
				"onUpdate:modelValue": o[24] ||= (e) => se.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: B(() => [T(F(n), {
					variant: "primary",
					onClick: o[23] ||= (e) => se.value = !1
				}, {
					default: B(() => [...o[42] ||= [w("确定", -1)]]),
					_: 1
				})]),
				default: B(() => [T(F(a), {
					model: q,
					rules: F(X),
					"label-position": "top",
					onSubmit: o[22] ||= pe(() => {}, ["prevent"])
				}, {
					default: B(() => [T(F(p), {
						label: "SEO 描述",
						prop: "seo_description",
						error: F(Z).seo_description
					}, {
						default: B(() => [fe(C("textarea", {
							ref_key: "seoInput",
							ref: Y,
							"onUpdate:modelValue": o[21] ||= (e) => q.seo_description = e,
							"aria-invalid": !!F(Z).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: K.value,
							"aria-label": "SEO 描述"
						}, null, 8, pn), [[L, q.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			T(F(f), {
				modelValue: M.value,
				"onUpdate:modelValue": o[26] ||= (e) => M.value = e,
				title: "确认删除",
				subtitle: `操作对象：${q.title || "未命名文章"}`,
				width: "460px",
				"panel-class": "help-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !D.value
			}, {
				"header-actions": B(() => [C("span", mn, [T(F(m), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: B(() => [T(F(n), {
					disabled: D.value,
					onClick: o[25] ||= (e) => M.value = !1
				}, {
					default: B(() => [...o[43] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(F(n), {
					variant: "warning",
					loading: D.value,
					onClick: G
				}, {
					default: B(() => [...o[44] ||= [w("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: B(() => [T(F(d), {
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
			T(F(f), {
				modelValue: A.value,
				"onUpdate:modelValue": o[29] ||= (e) => A.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: B(() => [T(F(n), { onClick: o[27] ||= (e) => A.value = !1 }, {
					default: B(() => [...o[45] ||= [w("继续编辑", -1)]]),
					_: 1
				}), T(F(n), {
					variant: "primary",
					onClick: o[28] ||= (e) => _("close")
				}, {
					default: B(() => [...o[46] ||= [w("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			T(F(f), {
				modelValue: de.value,
				"onUpdate:modelValue": o[31] ||= (e) => de.value = e,
				title: "将文章转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: B(() => [T(F(n), { onClick: o[30] ||= (e) => de.value = !1 }, {
					default: B(() => [...o[47] ||= [w("取消", -1)]]),
					_: 1
				}), T(F(n), {
					variant: "primary",
					onClick: Pe
				}, {
					default: B(() => [...o[48] ||= [w("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Qt));
	}
}), [["__scopeId", "data-v-16f68391"]]), gn = { class: "help-articles" }, _n = {
	key: 0,
	class: "help-statistics-note"
}, vn = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(e) {
		let t = me(), { helpPublishStates: r, helpCategoryLabel: i, getHelpList: a, getHelpMetadata: o } = It(), { hasPermission: s } = me(), { formatDateTime: c } = me(), l = j(!1), ne = j(), u = (e) => s([`cms_help:${e}`]), d = j(), f = G(o, (e) => {
			d.value = e;
		}), ie = [
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
				formatter: (e) => i(d.value, e)
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
		], { proTableBindings: p, reload: ae, filters: h } = te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: y(() => [
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
		f.bindFilters(h);
		let g = new AbortController();
		async function _() {
			try {
				d.value = await o(g.signal);
			} catch {}
		}
		function v(e) {
			ne.value = e, l.value = !0;
		}
		function C() {
			l.value = !1, ae(), _();
		}
		return le(_), ce(() => g.abort()), (e, i) => (k(), S("div", gn, [
			!l.value && F(t).mode === "platform" ? (k(), S("p", _n, " 当前管理平台默认模板。浏览量、评价数及有帮助率属于站点运行数据，此处显示“—”，不汇总白标站点。 ")) : x("", !0),
			l.value ? (k(), b(hn, {
				key: 1,
				"article-id": ne.value,
				onClose: i[0] ||= (e) => l.value = !1,
				onSaved: C
			}, null, 8, ["article-id"])) : x("", !0),
			fe(T(F(ee), O(F(p), {
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
				"cell-cms_source_type": B(({ row: e }) => [T(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": B(() => [u("add") ? (k(), b(F(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: i[1] ||= (e) => v()
				}, {
					icon: B(() => [T(F(m), {
						name: "plus",
						size: 14
					})]),
					default: B(() => [i[2] ||= w("新增文章", -1)]),
					_: 1
				})) : x("", !0)]),
				"cell-publish_status": B(({ row: e }) => [T(F(re), {
					size: "sm",
					effect: "soft",
					type: e.publish_status === "published" ? "success" : "warning"
				}, {
					default: B(() => [w(P(F(r).find((t) => t.value === e.publish_status)?.label), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-is_enabled": B(({ row: e }) => [T(F(re), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: B(() => [w(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-publish_time": B(({ row: e }) => [w(P(F(c)(e.published_at || e.scheduled_at)), 1)]),
				"cell-actions": B(({ row: e }) => [T(F(n), {
					size: "sm",
					"icon-only": "",
					title: u("edit") ? "编辑文章" : "文章详情",
					"aria-label": u("edit") ? "编辑文章" : "文章详情",
					onClick: (t) => v(e.id)
				}, {
					default: B(() => [T(F(m), {
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
			}, 16), [[R, !l.value]])
		]));
	}
}), [["__scopeId", "data-v-e3373337"]]);
//#endregion
//#region src/cms/api/content/feedback.ts
function yn() {
	let e = me().request, t = "/cms/feedback", n = (n, r) => e.get({
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
}, En = { class: "attachment-title" }, Dn = ["src", "alt"], On = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(e) {
		let { getFeedbackList: t, getFeedbackMetadata: r, getFeedbackDetail: i, getFeedbackAttachment: a, feedbackSourceTypes: o, feedbackSourceLabel: s, feedbackError: c } = yn(), { formatDateTime: l } = me(), ne = j({
			scenes: [],
			issues: []
		}), u = G(r, (e) => {
			ne.value = e;
		}), ie = [
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
		], { proTableBindings: p, filters: ae } = te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: y(() => [
				...u.fields,
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
					}, ...ne.value.scenes.map((e) => ({
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
					}, ...ne.value.issues.map((e) => ({
						label: `${ne.value.scenes.find((t) => t.id === e.scene_id)?.name || "—"} / ${e.name}`,
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
		u.bindFilters(ae);
		let h = j(!1), g = j(!1), _ = j(""), E = j(), D = j({}), oe = j(""), se, A = new AbortController();
		async function ue(e) {
			se?.abort();
			let t = new AbortController();
			se = t, E.value = void 0, D.value = {}, _.value = "", oe.value = "", h.value = !0, g.value = !0;
			try {
				let n = await i(e, t.signal);
				t.signal.aborted || (E.value = n);
			} catch (e) {
				t.signal.aborted || (_.value = c(e));
			} finally {
				t.signal.aborted || (g.value = !1);
			}
		}
		async function M(e) {
			let t = se, n = E.value?.id;
			if (!(!t || !n || oe.value)) {
				oe.value = e, _.value = "";
				try {
					let r = await a(n, e, t.signal);
					!t.signal.aborted && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(r.data_url) && (D.value[e] = r.data_url);
				} catch (e) {
					t.signal.aborted || (_.value = c(e));
				} finally {
					t.signal.aborted || (oe.value = "");
				}
			}
		}
		return z(h, (e) => {
			e || (se?.abort(), E.value = void 0, D.value = {}, _.value = "");
		}), le(async () => {
			try {
				ne.value = await r(A.signal);
			} catch {}
		}), ce(() => {
			A.abort(), se?.abort();
		}), (e, t) => (k(), S("div", bn, [T(F(ee), O(F(p), {
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
			"cell-cms_source_type": B(({ row: e }) => [T(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"cell-source_type": B(({ row: e }) => [T(F(re), {
				size: "sm",
				effect: "soft",
				type: e.source_type === "merchant" ? "warning" : e.source_type === "platform" ? "success" : "primary"
			}, {
				default: B(() => [w(P(F(s)(e.source_type)), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-actions": B(({ row: e }) => [T(F(n), {
				size: "sm",
				"icon-only": "",
				title: "查看反馈",
				"aria-label": "查看反馈",
				onClick: (t) => ue(e.id)
			}, {
				default: B(() => [T(F(m), {
					name: "eye",
					size: 15
				})]),
				_: 1
			}, 8, ["onClick"])]),
			_: 1
		}, 16), T(F(f), {
			modelValue: h.value,
			"onUpdate:modelValue": t[1] ||= (e) => h.value = e,
			title: "反馈详情",
			subtitle: E.value?.code || "查看用户正式提交的意见反馈",
			width: "760px",
			"close-on-click-modal": !1
		}, {
			footer: B(() => [T(F(n), { onClick: t[0] ||= (e) => h.value = !1 }, {
				default: B(() => [...t[14] ||= [w("关闭", -1)]]),
				_: 1
			})]),
			default: B(() => [C("div", {
				class: "feedback-detail",
				"aria-busy": g.value
			}, [
				g.value ? (k(), S("p", Sn, "正在读取反馈…")) : x("", !0),
				_.value ? (k(), b(F(d), {
					key: 1,
					type: "error",
					closable: !1,
					description: _.value
				}, null, 8, ["description"])) : x("", !0),
				E.value && !g.value ? (k(), S(v, { key: 2 }, [
					C("dl", Cn, [
						C("div", null, [t[2] ||= C("dt", null, "UID", -1), C("dd", null, P(E.value.public_user_id_snapshot), 1)]),
						C("div", null, [t[3] ||= C("dt", null, "用户账号", -1), C("dd", null, P(E.value.username_snapshot || "—"), 1)]),
						C("div", null, [t[4] ||= C("dt", null, "来源类型", -1), C("dd", null, P(F(s)(E.value.source_type)), 1)]),
						C("div", null, [t[5] ||= C("dt", null, "来源名称", -1), C("dd", null, P(E.value.source_name_snapshot || "—"), 1)]),
						C("div", null, [t[6] ||= C("dt", null, "业务场景", -1), C("dd", null, P(E.value.scene_name_snapshot), 1)]),
						C("div", null, [t[7] ||= C("dt", null, "问题分类", -1), C("dd", null, P(E.value.issue_category_name_snapshot), 1)]),
						C("div", null, [t[8] ||= C("dt", null, "联系方式（脱敏）", -1), C("dd", null, P(E.value.contact_display), 1)]),
						C("div", null, [t[9] ||= C("dt", null, "提交时间", -1), C("dd", null, P(F(l)(E.value.submitted_at)), 1)])
					]),
					C("section", null, [t[10] ||= C("h3", null, "反馈内容", -1), C("div", wn, P(E.value.content), 1)]),
					C("section", null, [
						C("h3", null, [t[11] ||= w(" 附件 ", -1), C("span", null, P(E.value.attachments?.length || 0), 1)]),
						E.value.attachments?.length ? x("", !0) : (k(), S("p", Tn, "暂无附件")),
						(k(!0), S(v, null, de(E.value.attachments, (e) => (k(), S("div", {
							key: e.id,
							class: "feedback-attachment"
						}, [C("div", En, [C("span", null, P(e.original_name || "图片附件") + " · " + P(Math.ceil(e.byte_size / 1024)) + " KB", 1), T(F(n), {
							size: "sm",
							loading: oe.value === e.id,
							onClick: (t) => M(e.id)
						}, {
							default: B(() => [...t[12] ||= [w("查看图片", -1)]]),
							_: 1
						}, 8, ["loading", "onClick"])]), D.value[e.id] ? (k(), S("img", {
							key: 0,
							src: D.value[e.id],
							alt: e.original_name || "反馈图片"
						}, null, 8, Dn)) : x("", !0)]))), 128))
					]),
					t[13] ||= C("p", { class: "muted" }, "来源和分类为提交时快照；此页面仅查看，不修改用户原始反馈。", -1)
				], 64)) : x("", !0)
			], 8, xn)]),
			_: 1
		}, 8, ["modelValue", "subtitle"])]));
	}
}), [["__scopeId", "data-v-ed508c88"]]);
//#endregion
//#region src/cms/api/content/announcement.ts
function kn() {
	let e = me().request, t = "/cms/announcement", n = (n, r = {}) => e.get({
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
		announcementPublishStates: c,
		announcementCategoryLabel: l,
		announcementError: ee
	};
}
//#endregion
//#region src/cms/views/content/announcement/categories/index.vue?vue&type=script&setup=true&lang.ts
var An = { class: "announcement-categories" }, jn = ["aria-busy"], Mn = {
	key: 0,
	class: "taxonomy-editor__loading",
	role: "status"
}, Nn = { class: "taxonomy-editor__field" }, Pn = { class: "taxonomy-editor__row" }, Fn = "分类", In = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(t) {
		let { hasPermission: r } = me(), { formatDateTime: i } = me(), { announcementError: o, deleteAnnouncement: s, getAnnouncementMetadata: l, getAnnouncementList: ne, getAnnouncementDetail: ie, saveAnnouncement: ae } = kn(), h = (e) => r([`cms_announcement_category:${e}`]), _ = j(), v = j(), E = G(l, (e) => {
			_.value = e;
		}), D = [
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
		], { proTableBindings: oe, reload: se, filters: A } = te({
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
				let i = Object.fromEntries(Object.entries(e).filter(([, e]) => e !== "" && e != null)), a = await ne("categories", {
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
		E.bindFilters(A);
		let de = () => ({
			id: "",
			row_version: "",
			name: "",
			code: "",
			parent_id: "",
			sort_order: 10,
			is_enabled: !0
		}), M = ue(de()), N = j(!1), I = j(!1), L = j(!1), R = j(!1), z = j(!1), fe = j(""), V = j(!1), H = j(""), he = j(!1), U = y(() => !h(M.id ? "edit" : "add")), q = y(() => L.value || R.value), J = "", X;
		async function Z(e) {
			X?.abort(), X = new AbortController();
			let t = X;
			Object.assign(M, de(), { id: e || "" }), H.value = "", z.value = !1, fe.value = "", V.value = !1, N.value = !0, I.value = !0, J = JSON.stringify(M);
			try {
				if (v.value = await l(t.signal, { cms_source_type: "platform" }), !e || t.signal.aborted) return;
				let n = await ie("categories", e, t.signal);
				if (v.value = await l(t.signal, { space_id: String(n.space_id) }), t.signal.aborted) return;
				Object.assign(M, {
					id: n.id,
					row_version: n.row_version,
					name: n.name,
					code: n.code,
					parent_id: n.parent_id || "",
					sort_order: n.sort_order,
					is_enabled: n.is_enabled
				}), J = JSON.stringify(M);
			} catch (e) {
				t.signal.aborted || (V.value = !0, H.value = o(e));
			} finally {
				t.signal.aborted || (I.value = !1);
			}
		}
		function ge() {
			return q.value ? !1 : !I.value && !V.value && JSON.stringify(M) !== J ? (he.value = !0, !1) : (X?.abort(), !0);
		}
		function _e() {
			ge() && (N.value = !1);
		}
		function Q() {
			X?.abort(), he.value = !1, N.value = !1;
		}
		async function ve() {
			if (!(U.value || q.value || I.value || V.value)) {
				if (!M.name.trim() || M.sort_order === null) {
					H.value = "请填写分类名称和排序";
					return;
				}
				L.value = !0, H.value = "";
				try {
					await ae("categories", {
						name: M.name,
						parent_id: M.parent_id || null,
						sort_order: M.sort_order,
						is_enabled: M.is_enabled,
						id: M.id || void 0,
						row_version: M.id ? M.row_version : void 0
					}), N.value = !1, u.success("保存成功"), await Promise.all([se(), Se()]);
				} catch (e) {
					H.value = o(e);
				} finally {
					L.value = !1;
				}
			}
		}
		function ye() {
			!M.id || !h("delete") || q.value || I.value || V.value || (fe.value = "", z.value = !0);
		}
		async function be() {
			if (!(!z.value || !M.id || !h("delete") || q.value || I.value || V.value)) {
				R.value = !0, fe.value = "";
				try {
					await s("categories", M.id, M.row_version), z.value = !1, N.value = !1, u.success("分类已删除"), await Promise.all([se(), Se()]);
				} catch (e) {
					fe.value = o(e);
				} finally {
					R.value = !1;
				}
			}
		}
		let $ = y(() => [{
			label: "无（一级分类）",
			value: ""
		}, ...(v.value?.categories || []).filter((e) => !e.parent_id && e.id !== M.id).map((e) => ({
			label: e.name + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		}))]), xe = new AbortController();
		async function Se() {
			try {
				_.value = await l(xe.signal);
			} catch {}
		}
		return le(Se), ce(() => {
			X?.abort(), xe.abort();
		}), (t, r) => (k(), S("div", An, [
			T(F(ee), O(F(oe), {
				"auto-refreshable": !1,
				columns: D,
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
				"cell-cms_source_type": B(({ row: e }) => [T(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
				"toolbar-actions": B(() => [h("add") ? (k(), b(F(n), {
					key: 0,
					variant: "primary",
					size: "sm",
					onClick: r[0] ||= (e) => Z()
				}, {
					icon: B(() => [T(F(m), {
						name: "plus",
						size: 14
					})]),
					default: B(() => [w("新增" + P(Fn))]),
					_: 1
				})) : x("", !0)]),
				"cell-is_enabled": B(({ row: e }) => [T(F(re), {
					size: "sm",
					effect: "soft",
					type: e.is_enabled ? "success" : "danger"
				}, {
					default: B(() => [w(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
					_: 2
				}, 1032, ["type"])]),
				"cell-actions": B(({ row: e }) => [T(F(n), {
					size: "sm",
					"icon-only": "",
					title: h("edit") ? `编辑${Fn}` : `${Fn}详情`,
					"aria-label": h("edit") ? `编辑${Fn}` : `${Fn}详情`,
					onClick: (t) => Z(e.id)
				}, {
					default: B(() => [T(F(m), {
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
			T(F(f), {
				modelValue: N.value,
				"onUpdate:modelValue": r[5] ||= (e) => N.value = e,
				title: `${M.id ? "编辑" : "新增"}公告${Fn}`,
				width: "680px",
				subtitle: "公告分类用于前端导航与内容归档，最多支持两级",
				"close-on-click-modal": !1,
				"before-close": ge
			}, {
				footer: B(() => [
					M.id && h("delete") ? (k(), b(F(n), {
						key: 0,
						variant: "danger",
						disabled: I.value || V.value || q.value,
						onClick: ye
					}, {
						icon: B(() => [T(F(m), {
							name: "trash-2",
							size: 14
						})]),
						default: B(() => [r[11] ||= w("删除分类", -1)]),
						_: 1
					}, 8, ["disabled"])) : x("", !0),
					T(F(n), {
						disabled: q.value,
						onClick: _e
					}, {
						default: B(() => [...r[12] ||= [w("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					U.value ? x("", !0) : (k(), b(F(n), {
						key: 1,
						variant: "primary",
						loading: L.value,
						disabled: I.value || V.value || R.value,
						onClick: ve
					}, {
						default: B(() => [w("保存" + P(Fn))]),
						_: 1
					}, 8, ["loading", "disabled"]))
				]),
				default: B(() => [C("div", {
					class: "taxonomy-editor",
					"aria-busy": I.value
				}, [
					I.value ? (k(), S("div", Mn, [T(F(m), {
						name: "loader-circle",
						class: "announcement-spin",
						size: 24
					}), C("span", null, "正在读取" + P(Fn) + "...")])) : x("", !0),
					H.value ? (k(), b(F(d), {
						key: 1,
						type: "error",
						closable: !1,
						description: H.value
					}, null, 8, ["description"])) : x("", !0),
					!I.value && !V.value ? (k(), b(F(a), {
						key: 2,
						model: M,
						"label-position": "top",
						onSubmit: pe(ve, ["prevent"])
					}, {
						default: B(() => [
							M.id ? (k(), b(F(p), {
								key: 0,
								label: "分类ID"
							}, {
								default: B(() => [T(F(g), {
									"model-value": M.code,
									disabled: ""
								}, null, 8, ["model-value"])]),
								_: 1
							})) : x("", !0),
							T(F(p), {
								label: `${Fn}名称`,
								required: ""
							}, {
								default: B(() => [T(F(g), {
									modelValue: M.name,
									"onUpdate:modelValue": r[1] ||= (e) => M.name = e,
									maxlength: 120,
									disabled: U.value || q.value,
									"aria-label": `${Fn}名称`
								}, null, 8, [
									"modelValue",
									"disabled",
									"aria-label"
								])]),
								_: 1
							}, 8, ["label"]),
							T(F(p), { label: "父分类" }, {
								default: B(() => [C("div", Nn, [T(F(c), {
									modelValue: M.parent_id,
									"onUpdate:modelValue": r[2] ||= (e) => M.parent_id = e,
									options: $.value,
									disabled: U.value || q.value,
									"aria-label": "父分类"
								}, null, 8, [
									"modelValue",
									"options",
									"disabled"
								]), r[10] ||= C("p", { class: "announcement-hint" }, " 选择“无”创建一级分类；一级分类数量包含其子分类公告。 ", -1)])]),
								_: 1
							}),
							C("div", Pn, [T(F(p), {
								label: "前端排序",
								required: ""
							}, {
								default: B(() => [T(F(e), {
									modelValue: M.sort_order,
									"onUpdate:modelValue": r[3] ||= (e) => M.sort_order = e,
									min: 0,
									max: 2147483647,
									precision: 0,
									disabled: U.value || q.value,
									"aria-label": "前端排序"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							}), T(F(p), { label: "启用状态" }, {
								default: B(() => [T(Y, {
									modelValue: M.is_enabled,
									"onUpdate:modelValue": r[4] ||= (e) => M.is_enabled = e,
									disabled: U.value || q.value,
									label: "已启用",
									"aria-label": "启用状态"
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})])
						]),
						_: 1
					}, 8, ["model"])) : x("", !0)
				], 8, jn)]),
				_: 1
			}, 8, ["modelValue", "title"]),
			T(F(f), {
				modelValue: z.value,
				"onUpdate:modelValue": r[7] ||= (e) => z.value = e,
				title: "删除公告分类",
				width: "420px",
				"close-on-click-modal": !1,
				"before-close": () => !R.value
			}, {
				footer: B(() => [T(F(n), {
					disabled: R.value,
					onClick: r[6] ||= (e) => z.value = !1
				}, {
					default: B(() => [...r[13] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(F(n), {
					variant: "danger",
					loading: R.value,
					onClick: be
				}, {
					default: B(() => [...r[14] ||= [w("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: B(() => [C("p", null, "确认删除分类“" + P(M.name) + "”？有关联公告或子分类的分类无法删除。", 1), fe.value ? (k(), b(F(d), {
					key: 0,
					type: "error",
					closable: !1,
					description: fe.value
				}, null, 8, ["description"])) : x("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			T(F(f), {
				modelValue: he.value,
				"onUpdate:modelValue": r[9] ||= (e) => he.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: B(() => [T(F(n), { onClick: r[8] ||= (e) => he.value = !1 }, {
					default: B(() => [...r[15] ||= [w("继续编辑", -1)]]),
					_: 1
				}), T(F(n), {
					variant: "primary",
					onClick: Q
				}, {
					default: B(() => [...r[16] ||= [w("放弃修改", -1)]]),
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
}, Qn = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "ArticleEditor",
	props: { articleId: {} },
	emits: ["close", "saved"],
	setup(r, { emit: i }) {
		let { hasPermission: o } = me(), { announcementError: s, announcementCategoryLabel: l, deleteAnnouncement: ee, getAnnouncementDetail: te, getAnnouncementMetadata: ne, saveAnnouncement: re, uploadAnnouncementCover: ie } = kn(), ae = r, h = i, _ = j(!0), E = j(!1), D = j(!1), O = j(""), oe = j(!1), se = j(!1), A = j(!1), de = j(!1), M = j(me().mode === "white_label" ? "当前站点内容" : "平台默认内容模板"), N = j(), I = j("draft"), R = j(!1), z = y(() => o(["cms_announcement:publish"])), V = y(() => !o([`cms_announcement:${ae.articleId ? "edit" : "add"}`]) || !z.value && I.value !== "draft"), H = y(() => o(["cms_announcement:delete"]) && (z.value || I.value === "draft"));
		async function U() {
			if (!(!H.value || E.value || _.value || D.value)) {
				E.value = !0, O.value = "";
				try {
					await ee("articles", G.id, G.row_version), be = JSON.stringify(G), u.success("公告已删除"), h("saved");
				} catch (e) {
					O.value = s(e), de.value = !1;
				} finally {
					E.value = !1;
				}
			}
		}
		let W = y(() => V.value || E.value), G = ue({
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
		}), { editorRoot: K, seoInput: q, fieldRules: J, fieldErrors: Y, pendingCount: X, saveError: Z, validateSave: ge, setSaveFailure: _e, focusFirstError: Q, focusSeoError: ve } = Ce(G, () => N.value?.categories || [], "announcement", oe), ye = y(() => (N.value?.categories || []).map((e) => ({
			label: l(N.value, e.id) + (e.effective_enabled ? "" : " (已停用)"),
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
			_.value = !0, D.value = !1, O.value = "";
			try {
				if (N.value = await ne(e.signal, { cms_source_type: "platform" }), ae.articleId) {
					let t = await te("articles", ae.articleId, e.signal);
					if (N.value = await ne(e.signal, { space_id: String(t.space_id) }), M.value = String(t.cms_source_name || "—"), e.signal.aborted) return;
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
					G.scheduled_local = t.publish_status === "scheduled" ? xe(t.scheduled_at) : "", I.value = t.publish_status;
				}
				be = JSON.stringify(G);
			} catch (t) {
				e.signal.aborted || (O.value = s(t), D.value = !0);
			} finally {
				e.signal.aborted || (_.value = !1);
			}
		}
		let we = () => !_.value && !D.value && be !== JSON.stringify(G);
		function Te() {
			we() ? se.value = !0 : h("close");
		}
		function Ee() {
			I.value === "draft" ? Oe("draft") : A.value = !0;
		}
		function De() {
			A.value = !1, Oe("draft");
		}
		async function Oe(e) {
			if (W.value || _.value || D.value || R.value || (O.value = "", !await ge(e))) return;
			let t = G.scheduled_local ? new Date(G.scheduled_local) : null;
			E.value = !0, O.value = "";
			try {
				await re("articles", {
					...G,
					id: G.id || void 0,
					row_version: G.id ? G.row_version : void 0,
					category_id: G.category_id || null,
					publish_status: e,
					scheduled_at: e === "scheduled" ? t.toISOString() : null
				}), be = JSON.stringify(G), u.success(e === "draft" ? "草稿已保存" : e === "scheduled" ? "已安排定时发布" : "公告已发布"), h("saved");
			} catch (e) {
				_e(e);
			} finally {
				E.value = !1;
			}
			X.value && await Q();
		}
		function ke(e) {
			O.value = s(e);
		}
		let Ae = (e) => {
			we() && (e.preventDefault(), e.returnValue = "");
		};
		return he(() => !E.value && !R.value && (!we() || window.confirm("公告有未保存的修改，确定离开？"))), le(() => {
			Se(), window.addEventListener("beforeunload", Ae);
		}), ce(() => {
			$?.abort(), window.removeEventListener("beforeunload", Ae);
		}), (i, o) => (k(), S("section", {
			ref_key: "editorRoot",
			ref: K,
			class: "article-editor",
			"aria-busy": _.value || E.value
		}, [
			C("header", Rn, [
				T(F(n), {
					"icon-only": "",
					title: "返回公告列表",
					"aria-label": "返回公告列表",
					disabled: E.value || R.value,
					onClick: Te
				}, {
					default: B(() => [T(F(m), {
						name: "arrow-left",
						size: 16
					})]),
					_: 1
				}, 8, ["disabled"]),
				C("div", zn, [C("h2", null, P(r.articleId ? "编辑公告" : "新增公告"), 1), C("span", null, P(N.value?.source_locale || "zh-CN") + " · " + P(M.value), 1)]),
				C("div", Bn, [
					r.articleId && H.value ? (k(), b(F(n), {
						key: 0,
						size: "sm",
						disabled: _.value || D.value || E.value || R.value,
						onClick: o[0] ||= (e) => de.value = !0
					}, {
						default: B(() => [...o[29] ||= [w("删除公告", -1)]]),
						_: 1
					}, 8, ["disabled"])) : x("", !0),
					T(F(n), {
						size: "sm",
						disabled: _.value || D.value,
						onClick: o[1] ||= (e) => oe.value = !0
					}, {
						icon: B(() => [T(F(m), {
							name: "search",
							size: 14
						})]),
						default: B(() => [o[30] ||= w("SEO 设置", -1)]),
						_: 1
					}, 8, ["disabled"]),
					V.value ? x("", !0) : (k(), b(F(n), {
						key: 1,
						size: "sm",
						disabled: _.value || D.value || E.value || R.value,
						onClick: Ee
					}, {
						icon: B(() => [T(F(m), {
							name: "save",
							size: 14
						})]),
						default: B(() => [o[31] ||= w("保存草稿", -1)]),
						_: 1
					}, 8, ["disabled"])),
					F(Z) ? (k(), S("span", Vn, P(F(Z)), 1)) : x("", !0),
					!V.value && F(X) ? (k(), S("span", Hn, "还有 " + P(F(X)) + " 项待完善", 1)) : x("", !0),
					!V.value && z.value ? (k(), b(F(n), {
						key: 4,
						variant: "primary",
						size: "sm",
						disabled: _.value || D.value || R.value,
						loading: E.value,
						onClick: o[2] ||= (e) => Oe(G.scheduled_local ? "scheduled" : "published")
					}, {
						icon: B(() => [T(F(m), {
							name: "arrow-up-to-line",
							size: 14
						})]),
						default: B(() => [w(P(G.scheduled_local ? "定时发布" : "发布"), 1)]),
						_: 1
					}, 8, ["disabled", "loading"])) : x("", !0)
				])
			]),
			_.value ? (k(), S("div", Un, [T(F(m), {
				name: "loader-circle",
				class: "announcement-spin",
				size: 28
			}), o[32] ||= C("span", null, "正在读取公告资料...", -1)])) : D.value ? (k(), S("div", Wn, [T(F(d), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"]), T(F(n), { onClick: Se }, {
				default: B(() => [...o[33] ||= [w("重新加载", -1)]]),
				_: 1
			})])) : (k(), S(v, { key: 2 }, [O.value ? (k(), S("div", Gn, [T(F(d), {
				type: "error",
				description: O.value,
				closable: !1
			}, null, 8, ["description"])])) : x("", !0), C("div", Kn, [C("aside", qn, [T(F(a), {
				model: G,
				rules: F(J),
				"label-position": "top",
				onSubmit: o[13] ||= pe(() => {}, ["prevent"])
			}, {
				default: B(() => [
					T(F(p), {
						label: "公告分类",
						prop: "category_id",
						error: F(Y).category_id,
						required: ""
					}, {
						default: B(() => [T(F(c), {
							modelValue: G.category_id,
							"onUpdate:modelValue": o[3] ||= (e) => G.category_id = e,
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
					o[34] ||= C("h3", null, "公告设置", -1),
					T(F(p), {
						label: "公告封面",
						prop: "cover_url",
						error: F(Y).cover_url
					}, {
						default: B(() => [T(ze, {
							modelValue: G.cover_url,
							"onUpdate:modelValue": o[4] ||= (e) => G.cover_url = e,
							label: "公告封面",
							disabled: W.value,
							upload: F(ie),
							onBusyChange: o[5] ||= (e) => R.value = e,
							onStart: o[6] ||= (e) => O.value = "",
							onError: ke
						}, null, 8, [
							"modelValue",
							"disabled",
							"upload"
						])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "内容来源",
						prop: "content_source",
						error: F(Y).content_source
					}, {
						default: B(() => [T(F(g), {
							modelValue: G.content_source,
							"onUpdate:modelValue": o[7] ||= (e) => G.content_source = e,
							maxlength: 160,
							disabled: W.value,
							"aria-label": "内容来源"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "作者署名",
						prop: "author_name",
						error: F(Y).author_name
					}, {
						default: B(() => [T(F(g), {
							modelValue: G.author_name,
							"onUpdate:modelValue": o[8] ||= (e) => G.author_name = e,
							maxlength: 120,
							disabled: W.value,
							"aria-label": "作者署名"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "前端排序",
						prop: "sort_order",
						error: F(Y).sort_order
					}, {
						default: B(() => [T(F(e), {
							modelValue: G.sort_order,
							"onUpdate:modelValue": o[9] ||= (e) => G.sort_order = e,
							min: 0,
							max: 2147483647,
							precision: 0,
							disabled: W.value,
							"aria-label": "前端排序"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[35] ||= C("h3", null, "发布设置", -1),
					T(F(p), {
						label: "允许有帮助评价",
						prop: "helpful_enabled",
						error: F(Y).helpful_enabled
					}, {
						default: B(() => [T(Rt, {
							modelValue: G.helpful_enabled,
							"onUpdate:modelValue": o[10] ||= (e) => G.helpful_enabled = e,
							disabled: W.value,
							label: "允许评价",
							"aria-label": "允许有帮助评价"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "启用状态",
						prop: "is_enabled",
						error: F(Y).is_enabled
					}, {
						default: B(() => [T(Rt, {
							modelValue: G.is_enabled,
							"onUpdate:modelValue": o[11] ||= (e) => G.is_enabled = e,
							disabled: W.value,
							label: "已启用",
							"aria-label": "启用状态"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "计划发布时间（本地时区）",
						prop: "scheduled_local",
						error: F(Y).scheduled_local
					}, {
						default: B(() => [T(F(g), {
							modelValue: G.scheduled_local,
							"onUpdate:modelValue": o[12] ||= (e) => G.scheduled_local = e,
							type: "datetime-local",
							disabled: W.value || !z.value,
							"aria-label": "计划发布时间"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					o[36] ||= C("p", { class: "article-editor__hint" }, " 不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。 ", -1)
				]),
				_: 1
			}, 8, ["model", "rules"])]), C("main", Jn, [T(F(a), {
				model: G,
				rules: F(J),
				"label-position": "top",
				onSubmit: o[17] ||= pe(() => {}, ["prevent"])
			}, {
				default: B(() => [
					T(F(p), {
						label: "标题",
						prop: "title",
						error: F(Y).title,
						required: ""
					}, {
						default: B(() => [T(F(g), {
							modelValue: G.title,
							"onUpdate:modelValue": o[14] ||= (e) => G.title = e,
							maxlength: 255,
							disabled: W.value,
							placeholder: "输入公告标题",
							"aria-label": "公告标题"
						}, null, 8, ["modelValue", "disabled"])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "摘要",
						prop: "summary",
						error: F(Y).summary
					}, {
						default: B(() => [fe(C("textarea", {
							"onUpdate:modelValue": o[15] ||= (e) => G.summary = e,
							"aria-invalid": !!F(Y).summary,
							class: "article-editor__textarea",
							rows: 3,
							maxlength: 1e4,
							disabled: W.value,
							"aria-label": "公告摘要"
						}, null, 8, Yn), [[L, G.summary]])]),
						_: 1
					}, 8, ["error"]),
					T(F(p), {
						label: "正文",
						prop: "body_html",
						error: F(Y).body_html
					}, {
						default: B(() => [T(F(t), {
							modelValue: G.body_html,
							"onUpdate:modelValue": o[16] ||= (e) => G.body_html = e,
							readonly: V.value,
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
			T(F(f), {
				modelValue: oe.value,
				"onUpdate:modelValue": o[21] ||= (e) => oe.value = e,
				title: "SEO 设置",
				width: "540px",
				"close-on-click-modal": !1
			}, {
				footer: B(() => [T(F(n), {
					variant: "primary",
					onClick: o[20] ||= (e) => oe.value = !1
				}, {
					default: B(() => [...o[37] ||= [w("确定", -1)]]),
					_: 1
				})]),
				default: B(() => [T(F(a), {
					model: G,
					rules: F(J),
					"label-position": "top",
					onSubmit: o[19] ||= pe(() => {}, ["prevent"])
				}, {
					default: B(() => [T(F(p), {
						label: "SEO 描述",
						prop: "seo_description",
						error: F(Y).seo_description
					}, {
						default: B(() => [fe(C("textarea", {
							ref_key: "seoInput",
							ref: q,
							"onUpdate:modelValue": o[18] ||= (e) => G.seo_description = e,
							"aria-invalid": !!F(Y).seo_description,
							class: "article-editor__textarea",
							rows: 5,
							maxlength: 2e3,
							disabled: W.value,
							"aria-label": "SEO 描述"
						}, null, 8, Xn), [[L, G.seo_description]])]),
						_: 1
					}, 8, ["error"])]),
					_: 1
				}, 8, ["model", "rules"])]),
				_: 1
			}, 8, ["modelValue"]),
			T(F(f), {
				modelValue: de.value,
				"onUpdate:modelValue": o[23] ||= (e) => de.value = e,
				title: "确认删除",
				subtitle: `操作对象：${G.title || "未命名公告"}`,
				width: "460px",
				"panel-class": "announcement-delete-dialog",
				"close-on-click-modal": !1,
				"before-close": () => !E.value
			}, {
				"header-actions": B(() => [C("span", Zn, [T(F(m), {
					name: "shield-alert",
					size: 18,
					color: "var(--mm-color-danger)"
				})])]),
				footer: B(() => [T(F(n), {
					disabled: E.value,
					onClick: o[22] ||= (e) => de.value = !1
				}, {
					default: B(() => [...o[38] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(F(n), {
					variant: "warning",
					loading: E.value,
					onClick: U
				}, {
					default: B(() => [...o[39] ||= [w("确认删除", -1)]]),
					_: 1
				}, 8, ["loading"])]),
				default: B(() => [T(F(d), {
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
			T(F(f), {
				modelValue: se.value,
				"onUpdate:modelValue": o[26] ||= (e) => se.value = e,
				title: "放弃未保存的修改？",
				width: "360px"
			}, {
				footer: B(() => [T(F(n), { onClick: o[24] ||= (e) => se.value = !1 }, {
					default: B(() => [...o[40] ||= [w("继续编辑", -1)]]),
					_: 1
				}), T(F(n), {
					variant: "primary",
					onClick: o[25] ||= (e) => h("close")
				}, {
					default: B(() => [...o[41] ||= [w("放弃修改", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"]),
			T(F(f), {
				modelValue: A.value,
				"onUpdate:modelValue": o[28] ||= (e) => A.value = e,
				title: "将公告转为草稿？",
				subtitle: "当前发布或定时发布状态将被取消。",
				width: "420px"
			}, {
				footer: B(() => [T(F(n), { onClick: o[27] ||= (e) => A.value = !1 }, {
					default: B(() => [...o[42] ||= [w("取消", -1)]]),
					_: 1
				}), T(F(n), {
					variant: "primary",
					onClick: De
				}, {
					default: B(() => [...o[43] ||= [w("转为草稿", -1)]]),
					_: 1
				})]),
				_: 1
			}, 8, ["modelValue"])
		], 8, Ln));
	}
}), [["__scopeId", "data-v-525a2f73"]]), $n = { class: "announcement-articles" }, er = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(e) {
		let { hasPermission: t } = me(), { formatDateTime: r } = me(), { announcementPublishStates: i, announcementCategoryLabel: a, getAnnouncementList: o, getAnnouncementMetadata: s } = kn(), c = j(!1), l = j(), ne = (e) => t([`cms_announcement:${e}`]), u = j(), d = G(s, (e) => {
			u.value = e;
		}), f = [
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
				formatter: (e) => a(u.value, e)
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
		], { proTableBindings: ie, reload: p, filters: ae } = te({
			initialAutoRefreshSeconds: 0,
			initialPageSize: 20,
			queryFields: y(() => [
				...d.fields,
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
					}, ...(u.value?.categories || []).map((e) => ({
						label: a(u.value, e.id),
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
		d.bindFilters(ae);
		let h = new AbortController();
		async function g() {
			try {
				u.value = await s(h.signal);
			} catch {}
		}
		function _(e) {
			l.value = e, c.value = !0;
		}
		function v() {
			c.value = !1, p(), g();
		}
		return le(g), ce(() => h.abort()), (e, t) => (k(), S("div", $n, [c.value ? (k(), b(Qn, {
			key: 0,
			"article-id": l.value,
			onClose: t[0] ||= (e) => c.value = !1,
			onSaved: v
		}, null, 8, ["article-id"])) : x("", !0), fe(T(F(ee), O(F(ie), {
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
			"cell-cms_source_type": B(({ row: e }) => [T(K, { "source-type": e.cms_source_type ?? null }, null, 8, ["source-type"])]),
			"toolbar-actions": B(() => [ne("add") ? (k(), b(F(n), {
				key: 0,
				variant: "primary",
				size: "sm",
				onClick: t[1] ||= (e) => _()
			}, {
				icon: B(() => [T(F(m), {
					name: "plus",
					size: 14
				})]),
				default: B(() => [t[2] ||= w("新增公告", -1)]),
				_: 1
			})) : x("", !0)]),
			"cell-publish_status": B(({ row: e }) => [T(F(re), {
				size: "sm",
				effect: "soft",
				type: e.publish_status === "published" ? "success" : "warning"
			}, {
				default: B(() => [w(P(F(i).find((t) => t.value === e.publish_status)?.label), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-is_enabled": B(({ row: e }) => [T(F(re), {
				size: "sm",
				effect: "soft",
				type: e.is_enabled ? "success" : "danger"
			}, {
				default: B(() => [w(P(e.is_enabled ? "已启用" : "已停用"), 1)]),
				_: 2
			}, 1032, ["type"])]),
			"cell-publish_time": B(({ row: e }) => [w(P(F(r)(e.published_at || e.scheduled_at)), 1)]),
			"cell-actions": B(({ row: e }) => [T(F(n), {
				size: "sm",
				"icon-only": "",
				title: ne("edit") ? "编辑公告" : "公告详情",
				"aria-label": ne("edit") ? "编辑公告" : "公告详情",
				onClick: (t) => _(e.id)
			}, {
				default: B(() => [T(F(m), {
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
		}, 16), [[R, !c.value]])]));
	}
}), [["__scopeId", "data-v-9f055b06"]]);
//#endregion
//#region src/cms/api/content/translations.ts
function tr() {
	let e = me().request, t = "/cms/translations";
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
}, ii = { class: "mm-translation-settings__credential" }, ai = { key: 0 }, oi = { key: 1 }, si = { key: 2 }, ci = { class: "mm-translation-settings__grid" }, li = { class: "job-confirm" }, ui = /*#__PURE__*/ _(/* @__PURE__ */ E({
	__name: "index",
	setup(t) {
		let { cancelTranslationJob: r, createTranslationJob: a, getTranslationDetail: o, getTranslationJob: ee, getTranslationList: te, getTranslationMetadata: ie, getTranslationSettings: h, saveTranslations: _, saveTranslationSettings: E, testTranslationConnection: D } = tr(), { hasPermission: O } = me(), A = j(), ue = j(""), M = j("news:content"), N = j([]), I = j(), R = j(""), pe = j("title"), H = j(""), U = j(""), W = j(1), G = j(0), K = j({}), q = j(!1), J = j(!1), Y = j(!1), X = j(!1), Z = j(""), ge = j(""), _e = j(), Q = j(null), ve = j(!1), ye = j(""), be = j(!1), $ = j(), xe = j(""), Se = j(!1), Ce = j(!1), we = j(!1), Te = j("field"), Ee = j([]), De = j(""), Oe = j(!1), ke = j(!1);
		z(ve, (e) => {
			e || (ye.value = "");
		});
		let Ae, je, Me, Ne, Pe, Fe = new AbortController(), Ie, Le = "", Re = y(() => O(["cms_translation:edit"])), ze = y(() => O(["cms_translation:config"])), Be = y(() => O(["cms_translation:translate"])), Ve = y(() => X.value || Se.value || Oe.value), He = y(() => ir(I.value, K.value).length > 0), Ue = y(() => nr(A.value?.done || 0, A.value?.total || 0)), We = y(() => ({
			space_id: ue.value,
			module: M.value.split(":")[0],
			kind: M.value.endsWith(":category") ? "category" : "content"
		})), Ge = y(() => A.value?.spaces.map((e) => ({
			label: e.label + (e.is_enabled ? "" : "（已停用）"),
			value: e.id
		})) || []), Ke = y(() => A.value?.locales.filter((e) => e.code !== A.value?.source_locale) || []), qe = y(() => Ke.value.map((e) => ({
			label: `${e.flag} ${e.label}`,
			value: e.code
		}))), Je = y(() => Ke.value.map((e) => ({
			label: `${e.label} · ${e.code}`,
			value: e.code
		}))), Ye = y(() => qe.value.filter((e) => nt(String(e.value)))), Xe = y(() => A.value?.locales.find((e) => e.code === A.value?.source_locale)?.label || A.value?.source_locale || "简体中文"), Ze = y(() => I.value?.fields.find((e) => e.key === pe.value)), Qe = y(() => {
			let e = A.value?.modules.find((e) => e.key === M.value);
			return e?.kind === "category" ? `${A.value?.modules.find((t) => t.module === e.module && t.kind === "content")?.label || ""}分类` : e?.label || "新闻";
		}), $e = y(() => {
			let e = [];
			for (let t of A.value?.modules || []) {
				let n = e.find((e) => e[0].module === t.module);
				n ? n.push(t) : e.push([t]);
			}
			return e;
		}), et = y(() => !!ue.value && A.value?.space_enabled && !!A.value.target_locales.length && !sr(Q.value) && !Ve.value && !He.value && !q.value && !J.value), tt = y(() => Q.value ? nr([
			"succeeded",
			"skipped",
			"cancelled"
		].reduce((e, t) => e + (Q.value?.counts[t] || 0), 0) + (sr(Q.value) ? 0 : Q.value.counts.failed || 0), Q.value.total) : 0), nt = (e) => A.value?.target_locales.includes(e) ?? !1, rt = (e) => A.value?.locales.find((t) => t.code === e), it = (e) => ({
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
			Ae = void 0, ke.value = !1, K.value = I.value ? ar(I.value) : {}, e?.();
		}
		function st() {
			ke.value = !1, Ae = void 0, Pe?.(!1), Pe = void 0;
		}
		function ct(e) {
			e !== ue.value && at(() => {
				ue.value = e, H.value = "", U.value = "", W.value = 1, Q.value = null, pt();
			});
		}
		function lt(e) {
			e.available && M.value !== e.key && at(() => {
				M.value = e.key, H.value = "", U.value = "", W.value = 1, ht();
			});
		}
		function ut(e) {
			at(() => {
				W.value = e, ht();
			});
		}
		function dt() {
			at(() => {
				U.value = H.value.trim(), W.value = 1, ht();
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
			q.value = !0, Z.value = "";
			try {
				let t = await ie(ue.value || void 0, e.signal);
				if (e.signal.aborted) return;
				A.value = t, ue.value = t.space_id || "", await ht(), Tt();
			} catch (t) {
				e.signal.aborted || (Z.value = ur(t));
			} finally {
				e.signal.aborted || (q.value = !1);
			}
		}
		async function mt() {
			let e = ue.value;
			if (e) try {
				let t = await ie(e, Fe.signal);
				e === ue.value && (A.value = t);
			} catch {}
		}
		async function ht() {
			je?.abort(), Me?.abort();
			let e = je = new AbortController();
			if (J.value = !0, Y.value = !1, I.value = void 0, R.value = "", K.value = {}, Z.value = "", !ue.value) {
				N.value = [], G.value = 0, J.value = !1;
				return;
			}
			let t = { ...We.value };
			try {
				let n = await te(t, U.value, W.value, e.signal);
				if (e.signal.aborted) return;
				N.value = n.lists, G.value = n.count, N.value[0] && await gt(N.value[0].id);
			} catch (t) {
				e.signal.aborted || (N.value = [], G.value = 0, Z.value = ur(t));
			} finally {
				e.signal.aborted || (J.value = !1);
			}
		}
		async function gt(e) {
			Me?.abort();
			let t = Me = new AbortController();
			Y.value = !0, R.value = e, I.value = void 0, K.value = {}, Z.value = "";
			try {
				let n = await o({ ...We.value }, e, t.signal);
				if (t.signal.aborted) return;
				I.value = n, K.value = ar(n), n.fields.some((e) => e.key === pe.value) || (pe.value = n.fields[0]?.key || ""), _e.value?.scrollTo({ top: 0 });
			} catch (e) {
				t.signal.aborted || (Z.value = ur(e));
			} finally {
				t.signal.aborted || (Y.value = !1);
			}
		}
		async function _t() {
			if (!I.value || !Re.value || Ve.value) return;
			let e = ir(I.value, K.value);
			if (e.length) {
				if (e.some((e) => !e.text.trim())) {
					Z.value = "译文不能为空；未翻译的语言请保持未填写。";
					return;
				}
				X.value = !0, Z.value = "";
				try {
					let t = await _({ ...We.value }, I.value.id, e);
					I.value = t, K.value = ar(t);
					let n = N.value.findIndex((e) => e.id === t.id);
					n >= 0 && (N.value[n] = t), u.success("翻译已保存"), mt();
				} catch (e) {
					Z.value = ur(e);
				} finally {
					X.value = !1;
				}
			}
		}
		async function vt(e) {
			ge.value = e, await oe();
			let t = _e.value?.querySelector(`[data-locale="${e}"]`);
			t?.scrollIntoView({
				block: "nearest",
				behavior: "smooth"
			}), t?.querySelector("textarea")?.focus();
		}
		async function yt() {
			if (!(!ze.value || !ue.value)) {
				ve.value = !0, be.value = !0, xe.value = "", $.value = void 0, ye.value = "";
				try {
					$.value = await h(ue.value, Fe.signal);
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
					await E($.value, ye.value.trim()), ye.value = "", ve.value = !1, u.success("翻译配置已保存"), await pt();
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
					await D($.value.space_id, $.value.space_revision, ye.value.trim()), u.success("Google Translate 连接成功");
				} catch (e) {
					xe.value = ur(e);
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
							id: R.value,
							field_name: pe.value
						} : { keyword: U.value }
					});
					Q.value = e.job, we.value = !1, u.success("翻译任务已提交"), wt();
				} catch (e) {
					De.value = ur(e);
				} finally {
					Oe.value = !1;
				}
			}
		}
		function wt() {
			clearTimeout(Ie), sr(Q.value) && (Ie = setTimeout(() => {
				Tt();
			}, 3e3));
		}
		async function Tt() {
			let e = ue.value;
			if (!e || Fe.signal.aborted) return;
			let t = sr(Q.value);
			try {
				let n = await ee(e, Fe.signal);
				if (e !== ue.value) return;
				Q.value = n.job, t && !sr(Q.value) && (await mt(), !He.value && !Ve.value && R.value && await gt(R.value));
			} catch {}
			wt();
		}
		async function Et() {
			if (Q.value) try {
				let e = await r(ue.value, Q.value.id);
				Q.value = e.job, clearTimeout(Ie), mt();
			} catch (e) {
				Z.value = ur(e);
			}
		}
		function Dt(e) {
			(He.value || Ve.value) && (e.preventDefault(), e.returnValue = "");
		}
		return he(() => !He.value && !Ve.value || !Ve.value && new Promise((e) => {
			Pe?.(!1), Pe = e, Ae = () => {
				Pe = void 0, e(!0);
			}, ke.value = !0;
		})), le(() => {
			window.addEventListener("beforeunload", Dt), pt();
		}), ce(() => {
			ye.value = "", Pe?.(!1), Fe.abort(), je?.abort(), Me?.abort(), Ne?.abort(), clearTimeout(Ie), window.removeEventListener("beforeunload", Dt);
		}), (t, r) => (k(), S("section", {
			class: "translations-page",
			"aria-label": "多语言翻译管理",
			"aria-busy": q.value
		}, [
			C("header", fr, [C("div", pr, [C("span", mr, [T(F(m), {
				name: "globe",
				size: 21
			})]), C("div", null, [r[21] ||= C("h1", null, "语言翻译管理", -1), C("div", hr, [
				C("strong", null, P(Ue.value) + "%", 1),
				T(F(i), {
					percentage: Ue.value,
					"show-text": !1,
					"stroke-width": 4,
					"aria-label": "全部翻译完成度"
				}, null, 8, ["percentage"]),
				C("span", null, P(A.value?.done.toLocaleString() || 0) + " / " + P(A.value?.total.toLocaleString() || 0) + " 个目标字段", 1)
			])])]), C("div", gr, [
				T(F(c), {
					"model-value": ue.value,
					options: Ge.value,
					size: "sm",
					disabled: q.value || Ve.value,
					placeholder: "内容空间",
					"aria-label": "内容空间",
					"onUpdate:modelValue": r[0] ||= (e) => ct(String(e))
				}, null, 8, [
					"model-value",
					"options",
					"disabled"
				]),
				C("span", _r, [r[22] ||= w("内容源语言 ", -1), C("b", null, P(Xe.value), 1)]),
				ze.value ? (k(), b(F(n), {
					key: 0,
					size: "sm",
					disabled: !ue.value || Ve.value,
					onClick: yt
				}, {
					icon: B(() => [T(F(m), {
						name: "sliders-horizontal",
						size: 14
					})]),
					default: B(() => [r[23] ||= w("翻译配置", -1)]),
					_: 1
				}, 8, ["disabled"])) : x("", !0),
				Be.value ? (k(), b(F(n), {
					key: 1,
					size: "sm",
					disabled: !et.value,
					onClick: r[1] ||= (e) => St("batch")
				}, {
					icon: B(() => [T(F(m), {
						name: "rocket",
						size: 14
					})]),
					default: B(() => [r[24] ||= w("批量翻译", -1)]),
					_: 1
				}, 8, ["disabled"])) : x("", !0),
				Be.value ? (k(), b(F(n), {
					key: 2,
					size: "sm",
					disabled: !et.value || !I.value || !Ze.value?.translatable,
					onClick: r[2] ||= (e) => St("field")
				}, {
					icon: B(() => [T(F(m), {
						name: "globe",
						size: 14
					})]),
					default: B(() => [r[25] ||= w("翻译当前字段", -1)]),
					_: 1
				}, 8, ["disabled"])) : x("", !0),
				Re.value ? (k(), b(F(n), {
					key: 3,
					size: "sm",
					variant: "primary",
					loading: X.value,
					disabled: !He.value || Ve.value || !A.value?.space_enabled,
					onClick: _t
				}, {
					icon: B(() => [T(F(m), {
						name: "save",
						size: 14
					})]),
					default: B(() => [r[26] ||= w("保存翻译", -1)]),
					_: 1
				}, 8, ["loading", "disabled"])) : x("", !0)
			])]),
			Z.value ? (k(), b(F(d), {
				key: 0,
				type: "error",
				closable: !0,
				onClose: r[3] ||= (e) => Z.value = ""
			}, {
				default: B(() => [w(P(Z.value), 1)]),
				_: 1
			})) : x("", !0),
			A.value && !A.value.space_enabled && ue.value ? (k(), b(F(d), {
				key: 1,
				type: "warning"
			}, {
				default: B(() => [...r[27] ||= [w("当前内容空间已停用，仅可查看翻译。", -1)]]),
				_: 1
			})) : x("", !0),
			A.value && !A.value.target_locales.length && ue.value ? (k(), b(F(d), {
				key: 2,
				type: "info"
			}, {
				default: B(() => [...r[28] ||= [w("尚未启用目标语言，请在“翻译配置”中选择语言后开始翻译。", -1)]]),
				_: 1
			})) : x("", !0),
			Q.value ? (k(), S("div", vr, [
				T(F(m), {
					name: F(sr)(Q.value) ? "loader-circle" : "info",
					size: 15
				}, null, 8, ["name"]),
				C("strong", null, P(F(cr)[Q.value.status] || Q.value.status), 1),
				C("span", null, "任务 #" + P(Q.value.id), 1),
				T(F(i), {
					percentage: tt.value,
					"show-text": !1,
					"stroke-width": 4
				}, null, 8, ["percentage"]),
				C("span", null, [
					w(P(Q.value.counts.succeeded || 0) + " / " + P(Q.value.total) + " 已完成", 1),
					Q.value.counts.failed ? (k(), S("span", yr, " · " + P(Q.value.counts.failed) + " 失败", 1)) : x("", !0),
					Q.value.counts.skipped ? (k(), S("span", br, " · " + P(Q.value.counts.skipped) + " 冲突跳过", 1)) : x("", !0)
				]),
				F(sr)(Q.value) && Be.value ? (k(), b(F(n), {
					key: 0,
					size: "sm",
					variant: "text",
					disabled: Ve.value,
					onClick: Et
				}, {
					default: B(() => [...r[29] ||= [w("取消任务", -1)]]),
					_: 1
				}, 8, ["disabled"])) : (k(), b(F(n), {
					key: 1,
					size: "sm",
					variant: "text",
					onClick: r[4] ||= (e) => Q.value = null
				}, {
					default: B(() => [...r[30] ||= [w("收起", -1)]]),
					_: 1
				})),
				Q.value.errors.length ? (k(), S("span", {
					key: 2,
					class: "translation-job__error",
					title: Q.value.errors.map((e) => `${e.target_locale}: ${e.error_code}`).join("；")
				}, P(Q.value.errors[0].error_code) + "（可重新提交补翻）", 9, xr)) : x("", !0)
			])) : x("", !0),
			C("div", Sr, [(k(!0), S(v, null, de(Ke.value, (e) => (k(), S("button", {
				key: e.code,
				type: "button",
				class: se(["language-card", {
					"is-active": ge.value === e.code,
					"is-disabled": !nt(e.code)
				}]),
				disabled: !nt(e.code),
				title: nt(e.code) ? `${e.native}：${e.done} / ${e.total}` : "请在翻译配置中启用",
				onClick: (t) => vt(e.code)
			}, [
				C("span", null, P(e.flag), 1),
				C("span", null, P(e.label), 1),
				C("strong", null, P(nt(e.code) ? F(nr)(e.done, e.total) + "%" : "未启用"), 1),
				T(F(i), {
					percentage: F(nr)(e.done, e.total),
					"show-text": !1,
					"stroke-width": 2
				}, null, 8, ["percentage"])
			], 10, Cr))), 128))]),
			C("nav", wr, [(k(!0), S(v, null, de($e.value, (e) => (k(), S("div", {
				key: e[0].module,
				class: "module-group"
			}, [(k(!0), S(v, null, de(e, (e) => (k(), b(F(n), {
				key: e.key,
				variant: M.value === e.key ? "primary" : "text",
				plain: M.value === e.key,
				size: "sm",
				disabled: !e.available || Ve.value,
				title: e.reason,
				"aria-pressed": M.value === e.key,
				onClick: (t) => lt(e)
			}, {
				default: B(() => [
					e.kind === "category" ? x("", !0) : (k(), b(F(m), {
						key: 0,
						name: it(e.module),
						size: 14
					}, null, 8, ["name"])),
					w(P(e.label), 1),
					C("span", Tr, P(e.count), 1)
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
			C("main", Er, [C("aside", Dr, [
				C("div", Or, [C("div", null, [C("strong", null, P(Qe.value), 1), C("span", null, P(G.value) + " 条" + P(We.value.kind === "category" ? "分类" : "内容"), 1)]), T(F(g), {
					modelValue: H.value,
					"onUpdate:modelValue": r[5] ||= (e) => H.value = e,
					size: "sm",
					clearable: "",
					placeholder: "搜索内容",
					"aria-label": "搜索内容",
					onKeydown: V(dt, ["enter"])
				}, {
					prefix: B(() => [T(F(m), {
						name: "search",
						size: 14
					})]),
					_: 1
				}, 8, ["modelValue"])]),
				C("div", {
					class: "content-browser__list",
					"aria-busy": J.value
				}, [J.value ? (k(), S("p", Ar, "加载内容中…")) : (k(), S(v, { key: 1 }, [(k(!0), S(v, null, de(N.value, (e) => (k(), S("button", {
					key: e.id,
					type: "button",
					class: se(["content-item", { "is-selected": R.value === e.id }]),
					"aria-current": R.value === e.id ? "true" : void 0,
					disabled: Ve.value,
					onClick: (t) => ft(e.id)
				}, [C("span", Mr, [C("strong", { title: e.title }, P(e.title), 9, Nr), C("small", null, P(F(lr)[e.publish_status || ""] || "分类") + " · " + P(e.done) + "/" + P(e.total), 1)]), T(F(i), {
					type: "circle",
					percentage: F(nr)(e.done, e.total),
					"show-text": !1,
					size: 16,
					"stroke-width": 2,
					status: e.total && e.done === e.total ? "success" : "warning"
				}, null, 8, ["percentage", "status"])], 10, jr))), 128)), N.value.length ? x("", !0) : (k(), S("p", Pr, P(U.value ? "没有匹配的内容" : "暂无可翻译内容"), 1))], 64))], 8, kr),
				C("footer", Fr, [
					T(F(n), {
						size: "sm",
						"icon-only": "",
						"aria-label": "上一页",
						disabled: W.value <= 1 || J.value || Ve.value,
						onClick: r[6] ||= (e) => ut(W.value - 1)
					}, {
						default: B(() => [T(F(m), {
							name: "chevron-left",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"]),
					C("span", null, P(W.value) + " / " + P(Math.max(1, Math.ceil(G.value / 30))), 1),
					T(F(n), {
						size: "sm",
						"icon-only": "",
						"aria-label": "下一页",
						disabled: W.value * 30 >= G.value || J.value || Ve.value,
						onClick: r[7] ||= (e) => ut(W.value + 1)
					}, {
						default: B(() => [T(F(m), {
							name: "chevron-right",
							size: 14
						})]),
						_: 1
					}, 8, ["disabled"])
				])
			]), C("section", {
				class: "translation-editor",
				"aria-busy": Y.value
			}, [Y.value ? (k(), S("div", Lr, [T(F(m), {
				name: "loader-circle",
				size: 28
			}), r[31] ||= C("p", null, "加载译文中…", -1)])) : I.value ? (k(), S(v, { key: 1 }, [C("header", Rr, [C("div", zr, [C("span", null, [w(P(Qe.value) + " ", 1), He.value ? (k(), S("em", Br, "有未保存修改")) : x("", !0)]), C("h2", { title: I.value.title }, P(I.value.title), 9, Vr)]), T(F(ne), {
				modelValue: pe.value,
				"onUpdate:modelValue": r[8] ||= (e) => pe.value = e
			}, {
				default: B(() => [(k(!0), S(v, null, de(I.value.fields, (e) => (k(), b(F(l), {
					key: e.key,
					name: e.key,
					label: `${e.label} ${e.translatable ? F(or)(e) + "/" + e.translations.length : "—"}`
				}, null, 8, ["name", "label"]))), 128))]),
				_: 1
			}, 8, ["modelValue"])]), Ze.value ? (k(), S("div", {
				key: 0,
				class: "translation-editor__body",
				ref_key: "editorBody",
				ref: _e
			}, [
				C("section", Hr, [C("div", Ur, [C("strong", null, [w(P(Xe.value) + " ", 1), T(F(re), {
					size: "sm",
					type: "primary",
					effect: "soft"
				}, {
					default: B(() => [...r[32] ||= [w("内容源语言", -1)]]),
					_: 1
				})]), r[33] ||= C("span", null, "只读原文", -1)]), C("textarea", {
					value: Ze.value.source,
					readonly: "",
					rows: Ze.value.key === "body_html" ? 5 : 2,
					class: "translation-textarea source-textarea",
					"aria-label": `原文${Ze.value.label}`
				}, null, 8, Wr)]),
				C("div", Gr, [r[34] ||= C("strong", null, "目标语言", -1), C("span", null, P(I.value.fields.find((e) => e.key === pe.value)?.translations.length || 0) + " 种语言 · 手工修改后请保存", 1)]),
				Ze.value.translatable ? Ze.value.translations.length ? (k(), S("div", {
					key: 2,
					class: se(["target-grid", { "is-body": pe.value === "body_html" }])
				}, [(k(!0), S(v, null, de(Ze.value.translations, (e) => (k(), S("div", {
					key: e.locale,
					class: se(["target-field", { "is-focused": ge.value === e.locale }]),
					"data-locale": e.locale
				}, [
					C("div", Yr, [C("label", { for: `translation-${pe.value}-${e.locale}` }, [w(P(rt(e.locale)?.native || e.locale) + " ", 1), C("small", null, P(e.locale), 1)], 8, Xr), e.status === "stale" ? (k(), S("span", Zr, "原文已更新")) : e.status === "ready" ? (k(), S("span", Qr, P(e.method === "machine" ? "机器翻译" : "已保存"), 1)) : x("", !0)]),
					fe(C("textarea", {
						id: `translation-${pe.value}-${e.locale}`,
						"onUpdate:modelValue": (t) => K.value[F(rr)(pe.value, e.locale)] = t,
						class: "translation-textarea",
						rows: pe.value === "body_html" ? 10 : 2,
						maxlength: Ze.value.max_length,
						disabled: !Re.value || !A.value?.space_enabled || Ve.value,
						dir: e.locale === "ar" ? "rtl" : "auto",
						placeholder: `请输入${rt(e.locale)?.native || e.locale}翻译${pe.value === "body_html" ? "（HTML）" : ""}`
					}, null, 8, $r), [[L, K.value[F(rr)(pe.value, e.locale)]]]),
					C("div", ei, P((K.value[F(rr)(pe.value, e.locale)] || "").length.toLocaleString()) + " / " + P(Ze.value.max_length.toLocaleString()), 1)
				], 10, Jr))), 128))], 2)) : (k(), S("div", qr, " 请先在“翻译配置”中启用目标语言。 ")) : (k(), S("div", Kr, [T(F(m), {
					name: "info",
					size: 18
				}), r[35] ||= w("原文字段为空，不参与翻译和完成度统计。 ", -1)]))
			], 512)) : x("", !0)], 64)) : (k(), S("div", ti, [T(F(ae), { description: Z.value ? "内容加载失败，可点击刷新重试" : "选择左侧内容开始翻译" }, null, 8, ["description"]), Z.value ? (k(), b(F(n), {
				key: 0,
				size: "sm",
				onClick: pt
			}, {
				default: B(() => [...r[36] ||= [w("重新加载", -1)]]),
				_: 1
			})) : x("", !0)]))], 8, Ir)]),
			T(F(f), {
				modelValue: ve.value,
				"onUpdate:modelValue": r[16] ||= (e) => ve.value = e,
				title: "翻译配置",
				subtitle: "当前内容空间共用 · Google Cloud Translation Basic v2",
				width: "560px",
				"close-on-click-modal": !1,
				"before-close": () => !Se.value && !Ce.value
			}, {
				footer: B(() => [
					T(F(n), {
						loading: Ce.value,
						disabled: !$.value?.credential_configured && !ye.value.trim() || Se.value || be.value,
						onClick: xt
					}, {
						default: B(() => [...r[43] ||= [w("测试连接", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"]),
					T(F(n), {
						disabled: Se.value || Ce.value,
						onClick: r[15] ||= (e) => ve.value = !1
					}, {
						default: B(() => [...r[44] ||= [w("取消", -1)]]),
						_: 1
					}, 8, ["disabled"]),
					T(F(n), {
						variant: "primary",
						loading: Se.value,
						disabled: !$.value || be.value || Ce.value,
						onClick: bt
					}, {
						default: B(() => [...r[45] ||= [w("保存翻译配置", -1)]]),
						_: 1
					}, 8, ["loading", "disabled"])
				]),
				default: B(() => [xe.value ? (k(), b(F(d), {
					key: 0,
					type: "error"
				}, {
					default: B(() => [w(P(xe.value), 1)]),
					_: 1
				})) : x("", !0), be.value ? (k(), S("div", ni, "加载配置中…")) : $.value ? (k(), S("div", ri, [
					C("label", null, [r[37] ||= w(" 目标语言 ", -1), T(F(c), {
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
					T(s, {
						modelValue: $.value.is_enabled,
						"onUpdate:modelValue": r[10] ||= (e) => $.value.is_enabled = e,
						disabled: Se.value || Ce.value,
						"credential-ready": !!$.value.credential_configured || !!ye.value.trim()
					}, null, 8, [
						"modelValue",
						"disabled",
						"credential-ready"
					]),
					C("div", ii, [
						C("label", null, [r[38] ||= w(" Google API Key ", -1), T(F(g), {
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
						$.value.api_key_mask ? (k(), S("small", ai, P($.value.credential_source === "database" ? "数据库密钥" : "环境配置密钥") + "：" + P($.value.api_key_mask), 1)) : x("", !0),
						$.value.credential_error === "GOOGLE_CREDENTIAL_DECRYPT_FAILED" ? (k(), S("small", oi, "数据库密钥无法解密，请检查两套后台的专用加密配置，或输入新密钥替换。")) : (k(), S("small", si, "密钥加密保存，不回显原文；留空保留原值。未配置密钥时仍可人工翻译。"))
					]),
					C("div", ci, [
						C("label", null, [r[39] ||= w(" 并发上限 ", -1), T(F(e), {
							modelValue: $.value.concurrency_limit,
							"onUpdate:modelValue": r[12] ||= (e) => $.value.concurrency_limit = e,
							min: 1,
							max: 20,
							disabled: Se.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])]),
						C("label", null, [r[40] ||= w(" 请求超时（秒） ", -1), T(F(e), {
							modelValue: $.value.request_timeout_seconds,
							"onUpdate:modelValue": r[13] ||= (e) => $.value.request_timeout_seconds = e,
							min: 1,
							max: 120,
							disabled: Se.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])]),
						C("label", null, [r[41] ||= w(" 最大尝试次数 ", -1), T(F(e), {
							modelValue: $.value.max_attempts,
							"onUpdate:modelValue": r[14] ||= (e) => $.value.max_attempts = e,
							min: 1,
							max: 10,
							disabled: Se.value || Ce.value
						}, null, 8, ["modelValue", "disabled"])])
					]),
					$.value.supported ? x("", !0) : (k(), b(F(d), {
						key: 0,
						type: "warning"
					}, {
						default: B(() => [...r[42] ||= [w("当前空间关联了其他版本的翻译配置。保存将为该空间创建独立的 Google v2 配置，不修改其他空间。", -1)]]),
						_: 1
					}))
				])) : x("", !0)]),
				_: 1
			}, 8, ["modelValue", "before-close"]),
			T(F(f), {
				modelValue: we.value,
				"onUpdate:modelValue": r[19] ||= (e) => we.value = e,
				title: Te.value === "field" ? "翻译当前字段" : "批量翻译",
				subtitle: "Google Translate · 仅补齐缺失及原文已更新的译文",
				width: "520px",
				"close-on-click-modal": !1,
				"before-close": () => !Oe.value
			}, {
				footer: B(() => [T(F(n), {
					size: "sm",
					disabled: Oe.value,
					onClick: r[18] ||= (e) => we.value = !1
				}, {
					default: B(() => [...r[47] ||= [w("取消", -1)]]),
					_: 1
				}, 8, ["disabled"]), T(F(n), {
					variant: "primary",
					size: "sm",
					loading: Oe.value,
					disabled: !Ee.value.length,
					onClick: Ct
				}, {
					default: B(() => [...r[48] ||= [w("确认翻译", -1)]]),
					_: 1
				}, 8, ["loading", "disabled"])]),
				default: B(() => [C("div", li, [
					C("p", null, P(Te.value === "field" ? `当前内容的「${Ze.value?.label}」` : `当前空间「${Qe.value}」${U.value ? "中匹配搜索条件的内容" : "全部内容"}`), 1),
					T(F(p), { label: "目标语言" }, {
						default: B(() => [T(F(c), {
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
					T(F(d), { type: "warning" }, {
						default: B(() => [...r[46] ||= [w("内容将发送至 Google Translate，并可能产生翻译费用。已有有效译文不会覆盖；单次最多 200 条内容、5,000 个字段任务。后台任务需要已启动翻译 worker。", -1)]]),
						_: 1
					}),
					De.value ? (k(), b(F(d), {
						key: 0,
						type: "error"
					}, {
						default: B(() => [w(P(De.value), 1)]),
						_: 1
					})) : x("", !0)
				])]),
				_: 1
			}, 8, [
				"modelValue",
				"title",
				"before-close"
			]),
			T(F(f), {
				modelValue: ke.value,
				"onUpdate:modelValue": r[20] ||= (e) => ke.value = e,
				title: "有未保存的翻译",
				subtitle: "切换后将丢弃当前修改，是否继续？",
				width: "380px",
				onClose: st
			}, {
				footer: B(() => [T(F(n), {
					size: "sm",
					onClick: st
				}, {
					default: B(() => [...r[49] ||= [w("继续编辑", -1)]]),
					_: 1
				}), T(F(n), {
					size: "sm",
					variant: "warning",
					onClick: ot
				}, {
					default: B(() => [...r[50] ||= [w("放弃修改并继续", -1)]]),
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
}, gi = { key: 3 }, _i = ["disabled"], vi = /*#__PURE__*/ _(/* @__PURE__ */ E({
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
			"news/categories": ye,
			"news/list": rt,
			"academy/categories": dt,
			"academy/courses": Ft,
			"help/categories": Zt,
			"help/articles": vn,
			"feedback/list": On,
			"announcement/categories": In,
			"announcement/list": er,
			"localization/translations": ui
		}, r = t.runtime.mode === "white_label" && !!t.runtime.resolveSiteInRequest, i = j(!1), a = j(0), o = j([]), s = j(""), c = j(""), l = j(t.runtime.mode === "white_label" && !r), ee = j(!1), te = y(() => o.value.find((e) => e.site_id === s.value)), ne = y(() => n[t.page]), u = y(() => t.runtime.hasPermission([
			"cms_news:add",
			"cms_academy:add",
			"cms_help:add",
			"cms_announcement:add"
		])), re = new AbortController(), d = !0, f = !1;
		function ie(e) {
			f = !0;
			try {
				o.value = e.sites, s.value = e.site_id ?? "", i.value = !0;
			} finally {
				f = !1;
			}
		}
		let p = U(t.runtime, ie);
		z(s, () => {
			!r || f || (p.invalidate(), p = U(t.runtime, ie, te.value?.space_id ?? null), a.value++);
		}, { flush: "sync" });
		function ae(e, n) {
			if (!d || t.runtime.mode === "white_label" && te.value?.space_id !== n) throw Error("站点已切换，请重新操作");
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
		A(H, {
			get mode() {
				return t.runtime.mode;
			},
			hasPermission: (e) => t.runtime.hasPermission(e),
			formatDateTime: (e) => t.runtime.formatDateTime(e),
			registerBeforeLeave: (e) => t.runtime.registerBeforeLeave?.(e),
			get request() {
				if (r) return p.request;
				let e = te.value?.space_id;
				return {
					get: (n, r) => t.runtime.request.get(ae(n, e), r),
					post: (n, r) => t.runtime.request.post(ae(n, e), r)
				};
			}
		});
		async function m() {
			let e = await t.runtime.request.get({
				url: "/cms/sites",
				signal: re.signal
			});
			re.signal.aborted || (o.value = e.sites, o.value.some((e) => e.site_id === s.value) || (s.value = o.value[0]?.site_id ?? ""));
		}
		async function h() {
			if (!te.value || ee.value) return;
			let e = a.value;
			ee.value = !0;
			try {
				let n = await t.runtime.request.post({
					url: "/cms/initialize",
					params: { site_id: te.value.site_id }
				}, { isOpenRetry: !1 });
				if (!d || r && e !== a.value) return;
				if (r) {
					if (!n.cms_context) throw Error("初始化接口未返回站点信息");
					p.invalidate(), p = U(t.runtime, ie, n.cms_context.space_id), ie(n.cms_context), a.value++;
				} else await m();
			} catch (e) {
				c.value = e instanceof Error ? e.message : "初始化失败";
			} finally {
				ee.value = !1;
			}
		}
		return le(async () => {
			if (t.runtime.mode === "white_label" && !r) try {
				await m();
			} catch {
				re.signal.aborted || (c.value = "加载站点失败，请刷新重试");
			} finally {
				l.value = !1;
			}
		}), ce(() => {
			d = !1, p.invalidate(), re.abort();
		}), (t, n) => (k(), S("section", { class: se(["mm-cms-page", { "is-viewport": e.viewport }]) }, [e.runtime.mode === "white_label" && e.showSiteSelector && (!F(r) || i.value) ? (k(), S("header", di, [C("label", null, [n[1] ||= w("内容站点 ", -1), fe(C("select", {
			"onUpdate:modelValue": n[0] ||= (e) => s.value = e,
			disabled: l.value
		}, [(k(!0), S(v, null, de(o.value, (e) => (k(), S("option", {
			key: e.site_id,
			value: e.site_id
		}, P(e.label), 9, pi))), 128))], 8, fi), [[I, s.value]])]), n[2] ||= C("span", null, "各站点内容独立管理", -1)])) : x("", !0), c.value ? (k(), S("p", mi, P(c.value), 1)) : l.value ? (k(), S("p", hi, "正在加载站点…")) : e.runtime.mode === "white_label" && (!F(r) || i.value) && !te.value?.space_id ? (k(), S("div", gi, [C("p", null, P(te.value ? "该站点尚未初始化内容空间。" : "暂无可管理的内容站点。"), 1), te.value && u.value ? (k(), S("button", {
			key: 0,
			type: "button",
			disabled: ee.value,
			onClick: h
		}, "初始化空内容空间", 8, _i)) : x("", !0)])) : (k(), b(M(ne.value), { key: `${e.page}:${e.identityKey}:${F(r) ? a.value : te.value?.space_id ?? "platform"}` }))], 2));
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