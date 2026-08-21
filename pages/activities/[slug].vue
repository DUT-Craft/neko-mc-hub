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
    <section v-if="activity && siblingActivities.length" class="detail-siblings">
      <div class="section-head">
        <div>
          <span class="section-label">同一台服务器</span>
          <h2>还可以参加</h2>
        </div>
      </div>
      <NList :bordered="false">
        <NListItem v-for="item in siblingActivities" :key="item.id">
          <NuxtLink class="detail-sibling-link" :to="`/activities/${item.id}`">
            <NTag size="small" round :type="item.status === 'active' || item.status === 'ongoing' ? 'success' : 'default'">{{ item.statusLabel }}</NTag>
            <span class="detail-sibling-link__title">{{ item.name }}</span>
            <small>{{ item.time }}</small>
          </NuxtLink>
        </NListItem>
      </NList>
    </section>
    <NEmpty v-if="!activity && error" description="活动不存在或已下线" />
    <NSpin v-if="!activity && !error" />
  </main>
</template>

<script setup lang="ts">
import { NCard, NEmpty, NListItem, NList, NSpin, NTag } from "naive-ui";
import ContentBlocksRenderer from "~/components/ContentBlocksRenderer.vue";
import { useDemoContent } from "~/composables/useDemoContent";
import { usePublicApi } from "~/composables/usePublicApi";
import { normalizeContentBlocks } from "~/utils/contentBlocks";
import type { ActivityViewModel } from "~/types/view-models";

const route = useRoute();
const api = usePublicApi();
const { activities } = useDemoContent();
const { data: activity, error } = await useAsyncData<ActivityViewModel>(`activity-${route.params.slug}`, () => api.request<ActivityViewModel>(`/api/public/activities/${route.params.slug}`));
const normalizedBlocks = computed(() => normalizeContentBlocks(activity.value?.blocks, activity.value?.description || ""));
const siblingActivities = computed(() =>
  activities.value
    .filter((item) => item.serverId === activity.value?.serverId && item.id !== activity.value?.id && item.status !== "paused")
    .slice(0, 4)
);
useHead(() => ({ title: `${activity.value?.name || "活动详情"} - 猫娘社 MC 主站` }));
</script>

<style scoped>
.detail-siblings { display: grid; gap: 10px; }
.detail-sibling-link { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; min-width: 0; }
.detail-sibling-link__title { color: var(--ink); font-weight: 600; }
.detail-sibling-link small { color: var(--muted); }
</style>
