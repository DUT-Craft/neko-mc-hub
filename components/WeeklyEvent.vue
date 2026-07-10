<template>
  <NCard v-if="activity && server" class="weekly-event" :bordered="false">
    <div class="minecraft-strip" aria-hidden="true"></div>
    <div class="weekly-event__content">
      <NSpace :size="8" wrap>
        <NTag type="success" round>{{ activity.statusLabel }}</NTag>
        <NTag type="info" round>速通挑战</NTag>
        <NTag type="warning" round>20:00 开局</NTag>
        <NTag round>{{ server.online }}/{{ server.capacity }} 人</NTag>
      </NSpace>
      <div>
        <p class="eyebrow">本周活动</p>
        <h2>19:45 到大厅，20:00 进活动服</h2>
        <p class="lead">{{ activity.description }}</p>
      </div>
      <ol class="route-ribbon" aria-label="今晚开服动线">
        <li><span>01</span><strong>复制地址</strong></li>
        <li><span>02</span><strong>大厅集合</strong></li>
        <li><span>03</span><strong>进传送门</strong></li>
      </ol>
      <div class="address-line">
        <span>服务器地址</span>
        <strong>{{ server.address }}</strong>
      </div>
      <NSpace wrap>
        <CopyButton :value="server.address" label="复制活动服地址" primary />
        <NButton secondary tag="a" :href="sitePath('/activities')">查看活动</NButton>
      </NSpace>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { NButton, NCard, NSpace, NTag } from "naive-ui";
import type { ActivityViewModel, ServerViewModel } from "~/types/view-models";
import { useSitePath } from "~/composables/useSitePath";

defineProps<{ activity?: ActivityViewModel; server?: ServerViewModel }>();
const sitePath = useSitePath();
</script>
