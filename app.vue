<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <NGlobalStyle />
    <NMessageProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <div class="app-shell" :class="{ 'admin-app-shell': isAdminRoute }">
            <header v-if="!isAdminRoute" class="site-header">
              <div class="nav-shell">
                <NuxtLink class="brand" to="/home">
                  <span class="block-logo" aria-hidden="true"></span>
                  <span>猫娘社 MC 主站</span>
                </NuxtLink>
                <nav class="nav-scroll" aria-label="主导航">
                  <NButton
                    v-for="item in navItems"
                    :key="item.to"
                    text
                    tag="a"
                    :href="sitePath(item.to)"
                    class="nav-link"
                    :class="{ 'is-active': isActive(item.to) }"
                  >
                    <img class="nav-link__icon" :src="minecraftIconUrl(item.icon)" alt="" aria-hidden="true" />
                    {{ item.label }}
                  </NButton>
                </nav>
                <NTag class="online-pill" type="success" round>
                  <span class="online-dot" aria-hidden="true"></span>在线 {{ totalOnline }} 人
                </NTag>
              </div>
            </header>

            <NAlert v-if="!isAdminRoute && isUnavailable" class="site-data-alert" type="error" :show-icon="false">
              实时数据暂时无法读取，服务器与活动状态可能不可用。
            </NAlert>
            <NAlert v-else-if="!isAdminRoute && isDemo" class="site-data-alert" type="warning" :show-icon="false">
              当前显示演示数据，不代表服务器的实时状态。
            </NAlert>

            <NuxtPage />

            <footer v-if="!isAdminRoute" class="footer">
              <span>猫娘社 MC 主站</span>
              <span>服务器、活动与入服信息</span>
            </footer>
          </div>
        </NNotificationProvider>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import {
  NAlert,
  NButton,
  NConfigProvider,
  NDialogProvider,
  NGlobalStyle,
  NMessageProvider,
  NNotificationProvider,
  NTag,
  type GlobalThemeOverrides
} from "naive-ui";
import { useDemoContent } from "~/composables/useDemoContent";
import { useSitePath } from "~/composables/useSitePath";
import { minecraftIconUrl } from "~/utils/minecraftIcons";

const route = useRoute();
const { totalOnline, isDemo, isUnavailable } = useDemoContent();
const sitePath = useSitePath();
const isAdminRoute = computed(() => route.path.startsWith("/admin"));

const navItems = [
  { label: "首页", to: "/home", icon: "lobby" },
  { label: "服务器", to: "/servers", icon: "server" },
  { label: "活动", to: "/activities", icon: "event" },
  { label: "公告", to: "/announcements", icon: "announce" },
  { label: "Wiki", to: "/wiki", icon: "wiki" },
  { label: "历史活动", to: "/history", icon: "history" },
  { label: "申请", to: "/applications", icon: "apply" }
];

const themeOverrides: GlobalThemeOverrides = {
  common: {
    bodyColor: "#edf5ef",
    textColorBase: "#183124",
    cardColor: "#f9fbf7",
    popoverColor: "#ffffff",
    primaryColor: "#347c4d",
    primaryColorHover: "#2b6b42",
    primaryColorPressed: "#245d39",
    primaryColorSuppl: "#347c4d",
    infoColor: "#347eaa",
    successColor: "#347c4d",
    warningColor: "#c99625",
    errorColor: "#b95c48",
    borderRadius: "6px",
    fontFamily: '"HarmonyOS Sans SC", "MiSans", "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif'
  },
  Button: {
    heightMedium: "40px",
    heightSmall: "34px",
    borderRadiusMedium: "6px",
    fontWeight: "500"
  },
  Card: {
    borderRadius: "8px",
    paddingMedium: "20px"
  },
  Tag: {
    borderRadius: "999px"
  },
  Input: {
    borderRadius: "6px"
  }
};

function isActive(to: string) {
  return to === "/" ? route.path === "/" : route.path.startsWith(to);
}
</script>
