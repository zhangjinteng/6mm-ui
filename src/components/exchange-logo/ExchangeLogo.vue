<script setup lang="ts">
import { computed } from "vue";

import sixMmLogo from "./assets/6mm-logo.svg";
import type { ExchangeLogoProps } from "./types";

defineOptions({ name: "MmExchangeLogo" });

const props = withDefaults(defineProps<ExchangeLogoProps>(), { size: "md" });

const normalizedName = computed(() => props.name.trim().toLowerCase().replace(/[^a-z0-9]/g, ""));
const exchange = computed(() => {
  const name = normalizedName.value;
  if (name === "6mm" || name.includes("freedex") || name.includes("sixmm")) return "6mm";
  if (name.includes("binance")) return "binance";
  if (name.includes("bybit")) return "bybit";
  if (name.includes("bitget")) return "bitget";
  if (name.includes("gate")) return "gate";
  return "fallback";
});
const fallback = computed(() => props.name.trim().charAt(0) || "?");
const numericSize = computed(() => typeof props.size === "number" ? `${props.size}px` : undefined);
const rootStyle = computed(() => numericSize.value ? { "--mm-exchange-logo-size": numericSize.value } : undefined);
</script>

<template>
  <span
    class="mm-exchange-logo"
    :class="[`is-${exchange}`, typeof size === 'string' && `mm-exchange-logo--${size}`]"
    :data-exchange="exchange"
    data-mm-component="exchange-logo"
    role="img"
    :aria-label="`${name || 'Unknown exchange'} logo`"
    :style="rootStyle"
  >
    <img v-if="exchange === '6mm'" class="mm-exchange-logo__image" :src="sixMmLogo" alt="" />
    <svg v-else-if="exchange !== 'fallback'" class="mm-exchange-logo__svg" viewBox="0 0 24 24" aria-hidden="true">
      <path v-if="exchange === 'binance'" d="m16.624 13.92 2.718 2.716-7.353 7.353-7.353-7.352 2.717-2.717 4.636 4.66zm4.637-4.636L24 12l-2.715 2.716L18.568 12zm-9.272 0 2.716 2.692-2.717 2.717L9.272 12zm-9.273 0L5.41 12l-2.692 2.692L0 12zM11.99.012l7.35 7.328-2.717 2.715L11.99 5.42l-4.636 4.66-2.717-2.716z" />
      <template v-else-if="exchange === 'bybit'">
        <path class="bybit-accent" d="M15.829 13.626V9h.93v4.626z" />
        <path d="M4.993 15H3v-4.626h1.913c.93 0 1.471.507 1.471 1.3 0 .513-.348.845-.588.955.287.13.655.423.655 1.04 0 .863-.609 1.33-1.458 1.33m-.154-3.82h-.91v1.065h.91c.395 0 .615-.214.615-.533 0-.317-.22-.532-.615-.532m.06 1.877h-.97v1.137h.97c.42 0 .622-.259.622-.571s-.201-.565-.622-.565zm4.388.046V15h-.923v-1.898l-1.431-2.728h1.01l.889 1.864.877-1.864h1.01zM13.355 15h-1.993v-4.626h1.913c.93 0 1.47.507 1.47 1.3 0 .513-.347.845-.588.955.287.13.655.423.655 1.04 0 .863-.608 1.33-1.457 1.33m-.155-3.82h-.91v1.065h.91c.395 0 .616-.214.616-.533 0-.317-.22-.532-.616-.532m.06 1.877h-.97v1.137h.97c.422 0 .622-.259.622-.571s-.2-.565-.622-.565zm6.495-1.876V15h-.929v-3.82h-1.245v-.806H21v.806z" />
      </template>
      <template v-else-if="exchange === 'bitget'">
        <path d="M11.121 9.46h4.283l4.381 4.555a.785.785 0 0 1 .003 1.076L14.17 21H9.757l1.334-1.357 4.898-5.092-4.836-5.092" />
        <path d="M12.879 14.54H8.596L4.215 9.986a.785.785 0 0 1-.003-1.076L9.83 3h4.412l-1.334 1.357L8.01 9.449l4.836 5.092" />
      </template>
      <template v-else-if="exchange === 'gate'">
        <path class="gate-ring" d="M12 16.95a4.95 4.95 0 1 1 0-9.9V3a9 9 0 1 0 9 9h-4.05A4.95 4.95 0 0 1 12 16.95" />
        <path class="gate-mark" d="M16.95 7.05H12V12h4.95z" />
      </template>
    </svg>
    <span v-else class="mm-exchange-logo__fallback">{{ fallback }}</span>
  </span>
</template>

<style src="./exchange-logo.css"></style>
