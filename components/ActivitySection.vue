<template>
  <NList class="activity-list" :bordered="false">
    <NListItem v-for="activity in activities" :key="activity.id" class="activity-item">
      <template #prefix>
        <span v-if="activity.iconUrl" class="media-pixi" aria-hidden="true"><img :src="activity.iconUrl" :alt="`${activity.name} 图标`" /></span>
        <span v-else class="pixi" :class="'pixi-' + activity.icon" aria-hidden="true"></span>
      </template>

      <div class="activity-item__main">
        <div class="activity-item__title">
          <h3><NuxtLink :to="`/activities/${activity.id}`">{{ activity.name }}</NuxtLink></h3>
          <NTag :type="activity.status === 'active' || activity.status === 'ongoing' ? 'success' : 'info'" round>
            {{ activity.statusLabel }}
          </NTag>
        </div>
        <p>{{ activity.description }}</p>
      </div>

      <template #suffix>
        <div class="activity-item__facts">
          <div class="activity-item__fact">
            <span>时间</span>
            <strong>{{ activity.time }}</strong>
          </div>
          <div class="activity-item__fact activity-item__participation">
            <span>参与</span>
            <strong>{{ activity.participation }}</strong>
          </div>
          <NTag v-if="activity.requiresPack" class="activity-item__pack" type="warning" round>需要整合包</NTag>
        </div>
      </template>
    </NListItem>
    <NEmpty v-if="activities.length === 0" description="当前没有已发布的活动" />
  </NList>
</template>

<script setup lang="ts">
import { NEmpty, NList, NListItem, NTag } from "naive-ui";
import type { ActivityViewModel } from "~/types/view-models";

defineProps<{ activities: ActivityViewModel[] }>();
</script>
