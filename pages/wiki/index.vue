<template>
  <main class="page">
    <section class="page-title compact-title">
      <span class="page-kicker">Wiki</span>
      <h1>入服工具箱</h1>
      <p class="lead">从大厅地址开始，按需要查找账号、整合包和服务器规则。</p>
    </section>

    <NCard class="wiki-entry" :bordered="false" content-style="padding: 0">
      <div class="wiki-entry__grid">
        <div v-if="lobby" class="wiki-entry__content">
          <span class="section-label">新人第一步</span>
          <h2>先进入大厅服</h2>
          <p>进入后查看传送牌，再前往活动服、生电服或其他长期服务器。</p>
          <div class="address-line">
            <span>大厅服地址</span>
            <strong>{{ lobby?.address }}</strong>
          </div>
          <CopyButton :value="lobby?.address || ''" label="复制大厅服地址" primary />
        </div>
        <div v-else class="wiki-entry__content"><NEmpty description="大厅服信息暂不可用" /></div>
        <img :src="sitePath('/assets/bg-neko-portal-soft.webp')" alt="猫娘社 Minecraft 大厅传送门" width="900" height="675" />
      </div>
    </NCard>

    <section class="section wiki-directory">
      <NCard v-for="group in toolGroups" :key="group.title" class="wiki-group" :bordered="false">
        <template #header>
          <div class="wiki-group__header">
            <span v-if="group.iconUrl" class="media-pixi" aria-hidden="true"><img :src="group.iconUrl" :alt="`${group.title} 图标`" /></span>
            <span v-else class="pixi" :class="'pixi-' + group.icon" aria-hidden="true"></span>
            <div><h2>{{ group.title }}</h2><p>{{ group.description }}</p></div>
          </div>
        </template>
        <NList class="wiki-links" :bordered="false">
          <NListItem v-for="item in group.items" :key="item.id || item.title">
            <NuxtLink :to="item.to">
              <span v-if="item.iconUrl" class="media-pixi" aria-hidden="true"><img :src="item.iconUrl" :alt="`${item.title} 图标`" /></span>
              <span v-else class="pixi" :class="'pixi-' + item.icon" aria-hidden="true"></span>
              <span><strong>{{ item.title }}</strong><small>{{ item.note }}</small></span>
              <NButton text size="small">打开</NButton>
            </NuxtLink>
          </NListItem>
        </NList>
      </NCard>
      <NEmpty v-if="!toolGroups.length" description="当前没有已发布的 Wiki 条目" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { NButton, NCard, NEmpty, NList, NListItem } from "naive-ui";
import { useDemoContent } from "~/composables/useDemoContent";
import { useSitePath } from "~/composables/useSitePath";

const { servers, wiki, isRemote, isDemo } = useDemoContent();
const sitePath = useSitePath();
const lobby = computed(() => servers.value.find((server) => server.id === "lobby"));

const staticToolGroups = [
  {
    title: "入服与状态",
    description: "查地址、在线人数和维护情况。",
    icon: "lobby",
    iconUrl: null,
    items: [
      { id: "quick-start", title: "快速入服", note: "大厅服与传送入口", icon: "lobby", iconUrl: null, to: "/home" },
      { id: "server-status", title: "服务器状态", note: "在线、维护与版本", icon: "server", iconUrl: null, to: "/servers" }
    ]
  },
  {
    title: "账号与申请",
    description: "处理皮肤站和社团申请。",
    icon: "apply",
    iconUrl: null,
    items: [
      { id: "skin-invite", title: "皮肤站邀请码", note: "在线填写并提交申请", icon: "apply", iconUrl: null, to: "/applications" }
    ]
  },
  {
    title: "玩法与资源",
    description: "查看活动、整合包与往期记录。",
    icon: "pack",
    iconUrl: null,
    items: [
      { id: "packs", title: "整合包说明", note: "冒险组与小组服", icon: "pack", iconUrl: null, to: "/activities" },
      { id: "history", title: "活动展示廊", note: "截图与往期记录", icon: "history", iconUrl: null, to: "/history" }
    ]
  },
  {
    title: "规则与通知",
    description: "了解活动安排和公共规则。",
    icon: "rules",
    iconUrl: null,
    items: [
      { id: "rules", title: "服务器规则", note: "公共资源与活动说明", icon: "rules", iconUrl: null, to: "/announcements" }
    ]
  }
];

const toolGroups = computed(() => {
  if (!isRemote.value) return isDemo.value ? staticToolGroups : [];
  const groups = new Map<string, { title: string; description: string; icon: string; iconUrl: string | null | undefined; items: Array<{ id: string; title: string; note: string; icon: string; iconUrl?: string | null; to: string }> }>();
  for (const item of wiki.value) {
    const title = item.group?.trim() || "其他指南";
    const group = groups.get(title) || { title, description: "已发布的入服与玩法指南", icon: item.icon, iconUrl: item.iconUrl, items: [] };
    group.items.push({ id: item.id, title: item.title, note: item.note, icon: item.icon, iconUrl: item.iconUrl, to: `/wiki/${item.id}` });
    groups.set(title, group);
  }
  return [...groups.values()];
});

useHead({ title: "社团 Wiki 与入服指南 - 猫娘社 MC 主站" });
</script>
