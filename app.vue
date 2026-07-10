<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <NMessageProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <div class="app-shell">
            <header class="site-header">
              <div class="nav-shell">
                <NuxtLink class="brand" to="/">
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
                    {{ item.label }}
                  </NButton>
                </nav>
                <NTag class="online-pill" type="success" round>
                  <span class="online-dot" aria-hidden="true"></span>演示在线 {{ totalOnline }} 人
                </NTag>
              </div>
            </header>

            <div class="demo-banner-shell">
              <DemoBanner />
            </div>

            <NuxtPage />

            <footer class="footer">猫娘社 MC 主站 · 当前为前端演示数据</footer>
          </div>
        </NNotificationProvider>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import {
  NButton,
  NConfigProvider,
  NDialogProvider,
  NMessageProvider,
  NNotificationProvider,
  NTag,
  type GlobalThemeOverrides
} from "naive-ui";
import { useDemoContent } from "~/composables/useDemoContent";
import { useSitePath } from "~/composables/useSitePath";

const route = useRoute();
const { totalOnline } = useDemoContent();
const sitePath = useSitePath();

const navItems = [
  { label: "入口", to: "/" },
  { label: "首页", to: "/home" },
  { label: "服务器", to: "/servers" },
  { label: "活动", to: "/activities" },
  { label: "公告", to: "/announcements" },
  { label: "申请", to: "/applications" },
  { label: "Wiki", to: "/wiki" },
  { label: "历史活动", to: "/history" }
];

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#41985d",
    primaryColorHover: "#337d4a",
    primaryColorPressed: "#28683c",
    primaryColorSuppl: "#41985d",
    infoColor: "#4f92c9",
    successColor: "#41985d",
    warningColor: "#d6a228",
    errorColor: "#c95745",
    borderRadius: "6px",
    fontFamily: '"HarmonyOS Sans SC", "MiSans", "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif'
  },
  Button: {
    heightMedium: "46px",
    borderRadiusMedium: "6px",
    fontWeight: "600"
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
