<template>
  <header class="site-header" data-od-id="site-header">
    <div class="nav-shell">
      <a class="brand" href="/" data-od-id="brand-link">
        <span class="block-logo" aria-hidden="true">
          <span class="brand-face"><i></i><i></i></span>
        </span>
        <span>猫娘社 MC 主站</span>
      </a>
      <nav class="nav-scroll" aria-label="主导航" data-od-id="main-nav">
        <a
          v-for="item in navItems"
          :key="item.to"
          class="nav-link"
          :class="{ 'is-active': isActive(item.to) }"
          :href="item.to"
        >
          {{ item.label }}
        </a>
      </nav>
      <span class="online-pill" data-od-id="online-pill">
        <span class="online-dot" aria-hidden="true"></span>在线 18 人
      </span>
    </div>
  </header>

  <NuxtPage />

  <footer class="footer" data-od-id="site-footer">猫娘社 MC 主站，今晚也有人在挖方块。</footer>
</template>

<script setup lang="ts">
const route = useRoute();

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

function isActive(to: string) {
  return to === "/" ? route.path === "/" : route.path.startsWith(to);
}
</script>
