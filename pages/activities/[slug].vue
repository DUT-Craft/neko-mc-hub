<template>
  <main class="page detail-page">
    <section v-if="activity" class="detail-header">
      <NuxtLink class="detail-back" to="/activities">返回活动列表</NuxtLink>
      <div class="detail-heading">
        <span v-if="activity.iconUrl" class="media-pixi" aria-hidden="true"><img :src="activity.iconUrl" :alt="`${activity.name} 图标`" /></span>
        <span v-else class="pixi" :class="`pixi-${activity.icon}`" aria-hidden="true"></span>
        <div><span class="page-kicker">活动详情</span><h1>{{ activity.name }}</h1><p class="lead">{{ activity.description }}</p></div>
      </div>
      <div class="detail-meta"><NTag type="success" round>{{ activity.statusLabel }}</NTag><span>{{ activity.time }}</span><span>{{ activity.participation }}</span></div>
      <img v-if="activity.coverImageUrl" class="detail-cover" :src="activity.coverImageUrl" :alt="`${activity.name} 封面`" />
    </section>
    <NCard v-if="activity" class="detail-body" :bordered="false"><ContentBlocksRenderer :blocks="normalizedBlocks" /></NCard>
    <ActivityRegistrationForm
      v-if="activity"
      :activity-slug="activity.id"
      :status="activity.status"
    />
    <NEmpty v-else-if="error" description="活动不存在或已下线" />
    <NSpin v-else />
  </main>
</template>

<script setup lang="ts">
import { NCard, NEmpty, NSpin, NTag } from "naive-ui";
import ContentBlocksRenderer from "~/components/ContentBlocksRenderer.vue";
import { usePublicApi } from "~/composables/usePublicApi";
import { normalizeContentBlocks } from "~/utils/contentBlocks";
import type { ActivityViewModel } from "~/types/view-models";

const route = useRoute();
const api = usePublicApi();
const { data: activity, error } = await useAsyncData<ActivityViewModel>(`activity-${route.params.slug}`, () => api.request<ActivityViewModel>(`/api/public/activities/${route.params.slug}`));
const normalizedBlocks = computed(() => normalizeContentBlocks(activity.value?.blocks, activity.value?.description || ""));
useHead(() => ({ title: `${activity.value?.name || "活动详情"} - 猫娘社 MC 主站` }));
</script>
