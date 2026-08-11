<template>
  <main class="page detail-page">
    <section v-if="entry" class="detail-header">
      <NuxtLink class="detail-back" to="/wiki">返回 Wiki 列表</NuxtLink>
      <div class="detail-heading">
        <span v-if="entry.iconUrl" class="media-pixi" aria-hidden="true"><img :src="entry.iconUrl" :alt="`${entry.title} 图标`" /></span>
        <span v-else class="pixi" :class="`pixi-${entry.icon}`" aria-hidden="true"></span>
        <div><span class="page-kicker">Wiki</span><h1>{{ entry.title }}</h1><p class="lead">{{ entry.note }}</p></div>
      </div>
    </section>
    <NCard v-if="entry" class="detail-body" :bordered="false">
      <ContentBlocksRenderer :blocks="normalizedBlocks" />
      <NButton v-if="safeLink(entry.linkUrl)" secondary tag="a" :href="safeLink(entry.linkUrl)" :target="isExternal(entry.linkUrl) ? '_blank' : undefined" :rel="isExternal(entry.linkUrl) ? 'noopener noreferrer' : undefined">打开相关链接</NButton>
    </NCard>
    <NEmpty v-else-if="error" description="Wiki 条目不存在或已下线" />
    <NSpin v-else />
  </main>
</template>

<script setup lang="ts">
import { NButton, NCard, NEmpty, NSpin } from "naive-ui";
import ContentBlocksRenderer from "~/components/ContentBlocksRenderer.vue";
import { usePublicApi } from "~/composables/usePublicApi";
import { useSitePath } from "~/composables/useSitePath";
import { normalizeContentBlocks } from "~/utils/contentBlocks";
import type { WikiViewModel } from "~/types/view-models";

const route = useRoute();
const api = usePublicApi();
const sitePath = useSitePath();
const { data: entry, error } = await useAsyncData<WikiViewModel>(`wiki-${route.params.slug}`, () => api.request<WikiViewModel>(`/api/public/wiki/${route.params.slug}`));
const normalizedBlocks = computed(() => normalizeContentBlocks(entry.value?.blocks, entry.value?.content || ""));
function safeLink(value: unknown) {
  const link = String(value || "").trim();
  if (link.startsWith("http://") || link.startsWith("https://")) return link;
  return link.startsWith("/") && !link.startsWith("//") ? sitePath(link) : "";
}
function isExternal(value: unknown) { return /^https?:\/\//.test(String(value || "")); }
useHead(() => ({ title: `${entry.value?.title || "Wiki"} - 猫娘社 MC 主站` }));
</script>
