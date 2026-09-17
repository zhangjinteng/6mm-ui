<script setup lang="ts">
import { computed } from "vue";

import { useLocale } from "../../composables/use-locale";
import { MmIcon } from "../icon";
import type { IconName } from "../icon";
import { MmTooltip } from "../tooltip";
import type { IpLocationProps } from "./types";

defineOptions({ name: "MmIpLocation" });

const props = withDefaults(defineProps<IpLocationProps>(), {
  countryFirst: false,
  emptyText: "-",
  fallbackAddress: "",
  info: null,
  ip: "",
  locationFirst: false,
  showIp: true,
  showIpLabel: false,
  showTooltip: true,
  useEmojiFlag: true,
});

const { locale, messages } = useLocale();

function normalizeText(value: unknown): string {
  return String(value ?? "").trim();
}

function uniqueParts(parts: string[]): string[] {
  const seen = new Set<string>();
  return parts.filter((part) => {
    const value = part.trim();
    const key = value.toLocaleLowerCase();
    if (!value || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function localizedName(
  names: { en?: string | null; zh?: string | null } | null | undefined,
): string {
  const preferred = locale.value.startsWith("zh") ? names?.zh : names?.en;
  const fallback = locale.value.startsWith("zh") ? names?.en : names?.zh;
  return normalizeText(preferred) || normalizeText(fallback);
}

const ipText = computed(
  () => normalizeText(props.ip) || normalizeText(props.info?.ip),
);
const ipDisplayText = computed(() => {
  if (!props.showIpLabel || !ipText.value) return ipText.value;
  return `IP: ${ipText.value}`;
});
const countryCode = computed(() =>
  normalizeText(props.info?.country_code).toUpperCase(),
);
const flagEmoji = computed(() => {
  if (!/^[A-Z]{2}$/.test(countryCode.value)) return "";
  return Array.from(countryCode.value)
    .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join("");
});
const fallbackAddress = computed(
  () =>
    normalizeText(props.info?.address) || normalizeText(props.fallbackAddress),
);
const isPrivate = computed(() => {
  const address = fallbackAddress.value.toLocaleLowerCase();
  return (
    props.info?.kind === "private" ||
    ["本地/内网地址", "内网地址", "local/private address"].includes(address)
  );
});

const countryName = computed(() => {
  const translatedName = localizedName(props.info?.country_names);
  if (translatedName) return translatedName;

  if (/^[A-Z]{2}$/.test(countryCode.value)) {
    try {
      return (
        new Intl.DisplayNames([locale.value], { type: "region" }).of(
          countryCode.value,
        ) ||
        normalizeText(props.info?.country) ||
        normalizeText(props.info?.country_name) ||
        countryCode.value
      );
    } catch {
      // Older webviews may not provide Intl.DisplayNames.
    }
  }

  return (
    normalizeText(props.info?.country) ||
    normalizeText(props.info?.country_name)
  );
});
const regionName = computed(
  () =>
    localizedName(props.info?.region_names) ||
    normalizeText(props.info?.region),
);
const cityName = computed(
  () =>
    localizedName(props.info?.city_names) || normalizeText(props.info?.city),
);

const locationText = computed(() => {
  if (isPrivate.value) return messages.value.ipLocation.privateAddress;

  const details = uniqueParts([
    cityName.value,
    regionName.value,
    countryName.value,
  ]);
  if (props.countryFirst) details.reverse();
  if (details.length > 0) return details.join(" / ");
  if (fallbackAddress.value && fallbackAddress.value !== "-")
    return fallbackAddress.value;
  return props.info?.kind === "unavailable"
    ? messages.value.ipLocation.unavailable
    : "";
});
const tooltipText = computed(() => {
  const timezone = normalizeText(props.info?.timezone);
  return timezone ? `${locationText.value} / ${timezone}` : locationText.value;
});
const iconName = computed<IconName>(() =>
  isPrivate.value ? "monitor-smartphone" : "globe",
);
const shouldRender = computed(() =>
  Boolean((props.showIp && ipText.value) || locationText.value),
);
</script>

<template>
  <div
    v-if="shouldRender"
    class="mm-ip-location"
    :class="{
      'mm-ip-location--address-only': !showIp,
      'mm-ip-location--location-first': locationFirst,
    }"
    data-mm-component="ip-location"
  >
    <div v-if="showIp && ipText" class="mm-ip-location__ip" data-ip-location-ip>
      {{ ipDisplayText }}
    </div>

    <MmTooltip
      v-if="locationText"
      :content="tooltipText"
      :disabled="!showTooltip"
      placement="top"
    >
      <template #default="{ triggerAttrs }">
        <div class="mm-ip-location__meta" v-bind="triggerAttrs">
          <span
            v-if="useEmojiFlag && flagEmoji && !isPrivate"
            class="mm-ip-location__flag"
            aria-hidden="true"
            data-ip-location-flag
          >
            {{ flagEmoji }}
          </span>
          <MmIcon
            v-else
            class="mm-ip-location__icon"
            :name="iconName"
            :size="14"
          />
          <span class="mm-ip-location__address" data-ip-location-address>{{
            locationText
          }}</span>
        </div>
      </template>
    </MmTooltip>
  </div>
  <span v-else class="mm-ip-location__empty">{{ emptyText }}</span>
</template>

<style src="./ip-location.css"></style>
