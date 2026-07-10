<template>
  <main class="page">
    <section class="page-title compact-title"><span class="page-kicker">Wiki</span><h1>工具箱与物品栏</h1><p class="lead">启动器、皮肤站、规则和整合包入口集中放在一个物品栏里。</p></section>

    <section class="toolbox-layout">
      <NCard class="toolbox-note" :bordered="false">
        <span class="paw-dot" aria-hidden="true"></span><h2>值班提示</h2><p>新人先复制大厅服地址，再按传送牌去目标服务器。</p>
        <CopyButton :value="lobby?.address || ''" label="复制大厅服地址" primary />
      </NCard>

      <NCard class="inventory-panel" :bordered="false" aria-label="Wiki 工具箱">
        <NSpace class="inventory-bar" wrap><NTag type="success" round>新人推荐</NTag><NTag type="info" round>指南</NTag><NTag type="warning" round>整合包</NTag></NSpace>
        <div class="inventory-grid">
          <NCard v-for="item in tools" :key="item.title" class="inventory-slot" :bordered="false">
            <span class="pixi" :class="`pixi-${item.icon}`" aria-hidden="true"></span><strong>{{ item.title }}</strong><em>{{ item.note }}</em>
            <NButton v-if="item.to" text tag="a" :href="sitePath(item.to)">打开</NButton><NTag v-else size="small">等待真实链接</NTag>
          </NCard>
        </div>
      </NCard>
    </section>
  </main>
</template>

<script setup lang="ts">
import { NButton, NCard, NSpace, NTag } from "naive-ui";
import { useDemoContent } from "~/composables/useDemoContent";
import { useSitePath } from "~/composables/useSitePath";
const { servers } = useDemoContent();
const sitePath = useSitePath();
const lobby = computed(() => servers.value.find((server) => server.id === "lobby"));
const tools = [
  { title: "快速入服", note: "大厅服 → 传送牌 → 目标服务器", icon: "lobby", to: "/home" },
  { title: "HMCL 下载", note: "推荐启动器", icon: "guide" },
  { title: "PCL 下载", note: "备用启动器", icon: "guide" },
  { title: "皮肤站注册", note: "需要邀请码", icon: "apply", to: "/applications" },
  { title: "整合包安装", note: "冒险组 / 小组服", icon: "pack", to: "/activities" },
  { title: "服务器规则", note: "公共资源与活动规则", icon: "rules", to: "/announcements" },
  { title: "服务器状态", note: "在线 / 维护 / 地址", icon: "server", to: "/servers" },
  { title: "活动展示廊", note: "截图与记录", icon: "history", to: "/history" }
];
useHead({ title: "社团 Wiki 与入服指南 - 猫娘社 MC 主站" });
</script>
