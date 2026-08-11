<template>
  <main class="page detail-page">
    <section v-if="announcement" class="detail-header">
      <NuxtLink class="detail-back" to="/announcements">返回公告列表</NuxtLink>
      <span class="page-kicker">{{ announcement.categoryLabel }}</span>
      <h1>{{ announcement.title }}</h1>
      <p class="lead">{{ announcement.summary }}</p>
      <time>{{ formatPublishedAt(announcement.publishedAt) }}</time>
      <img v-if="announcement.coverImageUrl" class="detail-cover" :src="announcement.coverImageUrl" :alt="`${announcement.title} 封面`" />
    </section>
    <NCard v-if="announcement" class="detail-body" :bordered="false"><ContentBlocksRenderer :blocks="normalizedBlocks" /></NCard>
    <NEmpty v-else-if="error" description="公告不存在或已下线" />
    <NSpin v-else />
  </main>
</template>

<script setup lang="ts">
import { NCard, NEmpty, NSpin } from "naive-ui";
import ContentBlocksRenderer from "~/components/ContentBlocksRenderer.vue";
import { usePublicApi } from "~/composables/usePublicApi";
import { normalizeContentBlocks } from "~/utils/contentBlocks";
import type { AnnouncementViewModel } from "~/types/view-models";

const route = useRoute();
const api = usePublicApi();
const { data: announcement, error } = await useAsyncData<AnnouncementViewModel>(`announcement-${route.params.slug}`, () => api.request<AnnouncementViewModel>(`/api/public/announcements/${route.params.slug}`));
const normalizedBlocks = computed(() => normalizeContentBlocks(announcement.value?.blocks, announcement.value?.summary || ""));
function formatPublishedAt(value: string | null) {
  if (!value) return "未标注时间";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("zh-CN", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
useHead(() => ({ title: `${announcement.value?.title || "公告详情"} - 猫娘社 MC 主站` }));
</script>
