<template>
  <div class="activity-grid">
    <NCard v-for="activity in activities" :key="activity.id" class="activity-card" :bordered="false">
      <div class="activity-card__head">
        <span class="pixi" :class="`pixi-${activity.icon}`" aria-hidden="true"></span>
        <NTag :type="activity.status === 'active' || activity.status === 'ongoing' ? 'success' : 'info'" round>
          {{ activity.statusLabel }}
        </NTag>
      </div>
      <h3>{{ activity.name }}</h3>
      <p>{{ activity.description }}</p>
      <dl>
        <div><dt>时间</dt><dd>{{ activity.time }}</dd></div>
        <div><dt>参与</dt><dd>{{ activity.participation }}</dd></div>
      </dl>
      <NTag v-if="activity.requiresPack" type="warning" round>需要整合包</NTag>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard, NTag } from "naive-ui";
import type { ActivityViewModel } from "~/types/view-models";

defineProps<{ activities: ActivityViewModel[] }>();
</script>
