<template>
  <NLayout class="admin-console" has-sider>
    <NLayoutSider
      class="admin-sidebar"
      :class="{ 'is-open': sidebarOpen }"
      :width="238"
      :native-scrollbar="false"
      bordered
    >
      <div class="admin-brand">
        <span class="admin-brand__mark"><img :src="minecraftIconUrl('neko-avatar')" alt="" /></span>
        <span><strong>猫娘社后台</strong><small>内容运营台</small></span>
      </div>

      <NMenu
        class="admin-nav"
        :value="activeKey"
        :options="navOptions"
        :indent="14"
        @update:value="handleMenuSelect"
      />

      <div class="admin-sidebar__foot">
        <NButton secondary block tag="a" :href="sitePath('/home')">返回主站</NButton>
        <NButton quaternary block @click="$emit('logout')">退出登录</NButton>
      </div>
    </NLayoutSider>

    <div v-if="sidebarOpen" class="admin-sidebar__scrim" aria-hidden="true" @click="sidebarOpen = false"></div>

    <NLayout class="admin-main">
      <NLayoutHeader class="admin-topbar" bordered>
        <NButton class="admin-menu-button" quaternary aria-label="打开后台导航" @click="sidebarOpen = true">菜单</NButton>
        <div class="admin-topbar__title">
          <span class="admin-kicker">管理员工作区</span>
          <h1>{{ currentLabel }}</h1>
        </div>
        <div class="admin-topbar__user">
          <span class="admin-status-dot"></span>
          <span>{{ visibleDisplayName }}</span>
        </div>
      </NLayoutHeader>
      <NLayoutContent>
        <main class="admin-content"><slot /></main>
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>

<script setup lang="ts">
import { h } from "vue";
import {
  NBadge,
  NButton,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NLayoutSider,
  NMenu,
  type MenuOption
} from "naive-ui";
import { useSitePath } from "~/composables/useSitePath";
import { minecraftIconUrl } from "~/utils/minecraftIcons";

const props = defineProps<{
  activeKey: string;
  displayName: string;
  pendingCounts: {
    reviews: number;
    registrations: number;
    feedback: number;
  };
}>();

defineEmits<{ logout: [] }>();

const route = useRoute();
const sitePath = useSitePath();
const sidebarOpen = ref(false);
const hydrated = ref(false);
const visibleDisplayName = computed(() => hydrated.value ? props.displayName : "管理员");

onMounted(() => { hydrated.value = true; });

const navItems = [
  { key: "overview", label: "总览", icon: "lobby" },
  { key: "servers", label: "服务器", icon: "server" },
  { key: "activities", label: "活动", icon: "event" },
  { key: "announcements", label: "公告", icon: "announce" },
  { key: "wiki", label: "Wiki", icon: "wiki" },
  { key: "history", label: "历史活动", icon: "history" },
  { key: "contacts", label: "联系人", icon: "sign" },
  { key: "reviews", label: "审核队列", icon: "apply" },
  { key: "registrations", label: "活动报名", icon: "chest" },
  { key: "feedback", label: "私密反馈", icon: "guide" },
  { key: "audit", label: "操作记录", icon: "rules" },
  { key: "users", label: "用户账号", icon: "pack" }
];

const navOptions = computed<MenuOption[]>(() => navItems.map((item) => ({
  key: item.key,
  label: item.label,
  icon: () => h("img", {
    src: minecraftIconUrl(item.icon),
    alt: "",
    "aria-hidden": "true"
  }),
  extra: pendingCountFor(item.key) > 0
    ? () => h(NBadge, { value: pendingCountFor(item.key), max: 99, type: "warning" })
    : undefined
})));

function pendingCountFor(key: string): number {
  if (!hydrated.value || !(key in props.pendingCounts)) return 0;
  return props.pendingCounts[key as keyof typeof props.pendingCounts];
}

const currentLabel = computed(() => navItems.find((item) => item.key === props.activeKey)?.label || "总览");
watch(() => route.fullPath, () => { sidebarOpen.value = false; });

async function handleMenuSelect(value: string | number) {
  sidebarOpen.value = false;
  await navigateTo({ path: "/admin", query: { section: String(value) } });
}
</script>
