<script lang="ts" setup>
import { computed } from "vue";

import accountlessAccessImage from "./assets/accountless-access.png";
import assetSyncImage from "./assets/asset-sync.png";
import contractSystemImage from "./assets/contract-system.png";
import dashboardAnalyticsImage from "./assets/dashboard-analytics.png";
import embeddedCapabilityImage from "./assets/embedded-capability.png";
import institutionalRiskImage from "./assets/institutional-risk.png";
import internationalLanguageImage from "./assets/international-language.png";
import matchingCoreImage from "./assets/matching-core.png";
import mobileExperienceImage from "./assets/mobile-experience.png";
import partnerChainalysisImage from "./assets/partner-chainalysis.svg";
import partnerCoinmarketcapImage from "./assets/partner-coinmarketcap.svg";
import partnerCoinwImage from "./assets/partner-coinw.svg";
import partnerEcosystemImage from "./assets/partner-ecosystem.png";
import partnerHyperpayImage from "./assets/partner-hyperpay.svg";
import partnerMatrixportImage from "./assets/partner-matrixport.svg";
import partnerOkxImage from "./assets/partner-okx.svg";
import partnerSimplifyImage from "./assets/partner-simplify.svg";
import partnerTokenpostImage from "./assets/partner-tokenpost.svg";
import partnerVonageImage from "./assets/partner-vonage.svg";
import partnerW2140Image from "./assets/partner-w2140.svg";
import perpetualEngineImage from "./assets/perpetual-engine.png";
import positionRiskManagementImage from "./assets/position-risk-management.png";
import type {
  AdminLoginPartner,
  AdminLoginShellProps,
  AdminLoginShowcaseCard,
} from "./types";

defineOptions({ name: "MmAdminLoginShell" });

const props = withDefaults(defineProps<AdminLoginShellProps>(), {
  accentColor: "#1677ff",
  accentRgb: "22, 119, 255",
  brandLogo: "/favicon.svg",
  brandLogoAlt: "6MM",
  brandTitle: "6MM 管理后台",
  partnerTrustText: "深受全球合作伙伴信赖",
  partners: undefined,
  showcaseAriaLabel: "6MM 产品与合作生态",
  showcaseLanes: undefined,
  subtitle: "管理员安全登录",
});

const defaultShowcaseLanes: AdminLoginShowcaseCard[][] = [
  [
    {
      image: contractSystemImage,
      title: "合约交易系统",
      description:
        "支持本位永续合约（BTC、ETH、SOL、BNB 等），提供流畅的下单体验与实时行情反馈",
    },
    {
      image: mobileExperienceImage,
      title: "移动端体验",
      description: "支持原生 App 与 H5 响应式页面，全球用户无缝接入",
    },
    {
      image: internationalLanguageImage,
      title: "多语言国际化界面",
      description: "前端全局多语言支持，自动根据地区切换界面",
    },
    {
      image: dashboardAnalyticsImage,
      title: "仪表盘与数据分析",
      description: "实时展示成交量、资金流、盈亏比与系统运行状态",
    },
    {
      image: positionRiskManagementImage,
      title: "仓位风险管理",
      description: "实时监控用户持仓风险，支持仓位调控与强平预警",
    },
    {
      image: assetSyncImage,
      title: "自动结算与资产同步",
      description: "自动计算用户盈亏与资金划转，实时同步资金变动",
    },
  ],
  [
    {
      image: embeddedCapabilityImage,
      title: "嵌入式交易能力",
      description: "通过 API 与 SDK 无缝集成至合作伙伴平台，实现轻量级交易转化",
    },
    {
      image: accountlessAccessImage,
      title: "无需用户注册",
      description: "用户无需在 6MM 创建账户，即可在授权后进入交易体验",
    },
    {
      image: partnerEcosystemImage,
      title: "合作伙伴主导的生态体系",
      description: "用户关系、资产管理及交易流转均由合作伙伴统一掌控",
    },
    {
      image: perpetualEngineImage,
      title: "专注永续合约引擎",
      description: "为永续合约场景打造专用交易基础设施，专注且高效",
    },
    {
      image: matchingCoreImage,
      title: "性能核心系统",
      description:
        "面向高频交易场景设计的撮合、风控与清算系统，稳定运行于复杂行情环境",
    },
    {
      image: institutionalRiskImage,
      title: "机构级风控控制",
      description:
        "实时保证金计算、强平机制与系统级风控管理，满足专业及机构交易需求",
    },
  ],
];

const defaultPartners: AdminLoginPartner[] = [
  { name: "Simplify", slug: "simplify", image: partnerSimplifyImage },
  { name: "Matrixport", slug: "matrixport", image: partnerMatrixportImage },
  { name: "Chainalysis", slug: "chainalysis", image: partnerChainalysisImage },
  { name: "CoinW", slug: "coinw", image: partnerCoinwImage },
  { name: "HyperPay", slug: "hyperpay", image: partnerHyperpayImage },
  { name: "OKX", slug: "okx", image: partnerOkxImage, showName: false },
  { name: "VONAGE", slug: "vonage", image: partnerVonageImage },
  {
    name: "CoinMarketCap",
    slug: "coinmarketcap",
    image: partnerCoinmarketcapImage,
  },
  { name: "TOKENPOST", slug: "tokenpost", image: partnerTokenpostImage },
  {
    name: "W2140",
    slug: "w2140",
    image: partnerW2140Image,
    caption: "W2140.com",
  },
];

const defaultPartnerImages = new Map(
  defaultPartners.map((partner) => [partner.slug, partner.image]),
);

const resolvedShowcaseLanes = computed(() => {
  const lanes = props.showcaseLanes?.length
    ? props.showcaseLanes
    : defaultShowcaseLanes;

  return lanes.map((lane, laneIndex) =>
    lane.map((card, cardIndex) => ({
      ...card,
      image:
        card.image || defaultShowcaseLanes[laneIndex]?.[cardIndex]?.image || "",
    })),
  );
});

const resolvedPartners = computed(() => {
  const partners = props.partners?.length ? props.partners : defaultPartners;
  return partners.map((partner) => ({
    ...partner,
    image: partner.image || defaultPartnerImages.get(partner.slug) || "",
  }));
});

const shellStyle = computed(() => ({
  "--mm-admin-login-accent": props.accentColor,
  "--mm-admin-login-accent-rgb": props.accentRgb,
}));
</script>

<template>
  <main
    class="mm-admin-login-shell"
    data-mm-component="admin-login-shell"
    data-mm-theme="dark"
    :style="shellStyle"
  >
    <div class="mm-admin-login-shell__layout">
      <aside
        class="mm-admin-login-shell__showcase"
        :aria-label="showcaseAriaLabel"
      >
        <div class="mm-admin-login-shell__gallery" aria-hidden="true">
          <div
            v-for="(lane, laneIndex) in resolvedShowcaseLanes"
            :key="`lane-${laneIndex}`"
            class="mm-admin-login-shell__lane"
          >
            <div
              class="mm-admin-login-shell__track"
              :class="laneIndex === 0 ? 'is-up' : 'is-down'"
            >
              <template
                v-for="copyIndex in 2"
                :key="`lane-${laneIndex}-copy-${copyIndex}`"
              >
                <article
                  v-for="card in lane"
                  :key="`${laneIndex}-${copyIndex}-${card.title}`"
                  class="mm-admin-login-shell__card"
                >
                  <img
                    class="mm-admin-login-shell__card-image"
                    :src="card.image"
                    alt=""
                    decoding="async"
                    loading="eager"
                  />
                  <div class="mm-admin-login-shell__card-content">
                    <strong>{{ card.title }}</strong>
                    <span>{{ card.description }}</span>
                  </div>
                </article>
              </template>
            </div>
          </div>
        </div>

        <footer class="mm-admin-login-shell__partners" aria-hidden="true">
          <span>{{ partnerTrustText }}</span>
          <div class="mm-admin-login-shell__partner-marquee">
            <div class="mm-admin-login-shell__partner-track">
              <div
                v-for="copyIndex in 2"
                :key="`partner-copy-${copyIndex}`"
                class="mm-admin-login-shell__partner-sequence"
              >
                <span
                  v-for="partner in resolvedPartners"
                  :key="`${copyIndex}-${partner.slug}`"
                  class="mm-admin-login-shell__partner-brand"
                  :class="`is-${partner.slug}`"
                  :title="partner.name"
                >
                  <img
                    v-if="partner.image"
                    class="mm-admin-login-shell__partner-symbol"
                    :src="partner.image"
                    alt=""
                    decoding="async"
                    loading="eager"
                  />
                  <span
                    v-if="partner.showName !== false"
                    class="mm-admin-login-shell__partner-wordmark"
                  >
                    <strong>{{ partner.name }}</strong>
                    <small v-if="partner.caption">{{ partner.caption }}</small>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </footer>
      </aside>

      <section class="mm-admin-login-shell__auth">
        <div v-if="$slots.tools" class="mm-admin-login-shell__tools">
          <slot name="tools" />
        </div>

        <div class="mm-admin-login-shell__form-card">
          <slot name="brand">
            <header class="mm-admin-login-shell__brand">
              <img :src="brandLogo" :alt="brandLogoAlt" />
              <div>
                <h1>{{ brandTitle }}</h1>
                <p>{{ subtitle }}</p>
              </div>
            </header>
          </slot>

          <slot name="form"><slot /></slot>
        </div>
      </section>
    </div>
  </main>
</template>

<style src="./admin-login-shell.css"></style>
