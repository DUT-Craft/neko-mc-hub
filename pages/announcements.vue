<template>
  <main class="page">
    <section class="page-title compact-title">
      <span class="page-kicker">公告</span><h1>告示牌墙</h1><p class="lead">活动、维护、规则和值班管理都贴在这里。</p>
    </section>

    <section class="notice-wall">
      <NCard v-if="latest" class="notice-sign notice-sign-large" :bordered="false">
        <NSpace wrap><NTag type="warning" round>最新公告</NTag><NTag type="info" round>{{ latest.categoryLabel }}</NTag><NTag round>{{ latest.publishedAt }}</NTag></NSpace>
        <h2>{{ latest.title }}</h2><p>{{ latest.summary }}</p>
        <NSpace wrap><NButton type="primary" tag="a" :href="sitePath('/activities')">查看活动页</NButton><CopyButton value="event.neko-mc.club" label="复制活动服地址" /></NSpace>
      </NCard>

      <AnnouncementList :announcements="announcements" />

      <NCard class="duty-board" :bordered="false">
        <NTag type="success" round>值班管理 · 演示联系方式</NTag>
        <h2>不知道找谁？先找本周值班。</h2>
        <p>申请和技术问题请带上 Minecraft ID，活动问题带上服务器名。</p>
        <NList>
          <NListItem v-for="manager in managers" :key="manager.id">
            <strong>{{ manager.name }}</strong>
            <template #suffix>{{ manager.contact }} · {{ manager.responsibilities }}</template>
          </NListItem>
        </NList>
      </NCard>
    </section>
  </main>
</template>

<script setup lang="ts">
import { NButton, NCard, NList, NListItem, NSpace, NTag } from "naive-ui";
import { useDemoContent } from "~/composables/useDemoContent";
import { useSitePath } from "~/composables/useSitePath";
const { announcements, managers } = useDemoContent();
const sitePath = useSitePath();
const latest = computed(() => announcements.value[0]);
useHead({ title: "公告栏 - 猫娘社 MC 主站" });
</script>
