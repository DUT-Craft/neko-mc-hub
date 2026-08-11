<template>
  <main class="page detail-page">
    <section v-if="item" class="detail-header">
      <NuxtLink class="detail-back" to="/history">返回活动回顾</NuxtLink>
      <span class="page-kicker">活动回顾</span>
      <h1>{{ item.title }}</h1>
      <p class="lead">{{ item.meta }}</p>
      <img v-if="item.coverImageUrl || item.image" class="detail-cover" :src="item.coverImageUrl || sitePath(item.image || '')" :alt="item.alt" />
    </section>
    <NCard v-if="item" class="detail-body" :bordered="false"><ContentBlocksRenderer :blocks="normalizedBlocks" /></NCard>
    <NEmpty v-else-if="error" description="活动回顾不存在或已下线" />
    <NSpin v-else />
  </main>
</template>

<script setup lang="ts">
import { NCard, NEmpty, NSpin } from "naive-ui";
import ContentBlocksRenderer from "~/components/ContentBlocksRenderer.vue";
import { usePublicApi } from "~/composables/usePublicApi";
import { useSitePath } from "~/composables/useSitePath";
import { normalizeContentBlocks } from "~/utils/contentBlocks";
import type { GalleryItemViewModel } from "~/types/view-models";

const route = useRoute();
const api = usePublicApi();
const sitePath = useSitePath();
const { data: item, error } = await useAsyncData<GalleryItemViewModel>(`history-${route.params.slug}`, () => api.request<GalleryItemViewModel>(`/api/public/history/${route.params.slug}`));
const normalizedBlocks = computed(() => normalizeContentBlocks(item.value?.blocks));
useHead(() => ({ title: `${item.value?.title || "活动回顾"} - 猫娘社 MC 主站` }));
</script>
