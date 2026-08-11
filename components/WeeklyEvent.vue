<template>
  <NCard v-if="activity && server" class="weekly-event" :bordered="false">
    <div class="weekly-event__media">
      <img
        :src="resolveImage(image)"
        :alt="imageAlt"
        width="1600"
        height="900"
        loading="eager"
      />
    </div>

    <div class="weekly-event__content">
      <div class="weekly-event__tags">
        <NTag type="success" round>{{ activity.statusLabel }}</NTag>
        <NTag round>{{ server.online }}/{{ server.capacity }} 人在线</NTag>
      </div>

      <div class="weekly-event__heading">
        <p class="eyebrow">本周活动</p>
        <h2>{{ activity.name }}</h2>
        <p class="weekly-event__time">{{ activity.time }}</p>
      </div>

      <p class="weekly-event__description">{{ activity.description }}</p>

      <NDescriptions class="event-facts" :column="1" size="small" label-placement="left">
        <NDescriptionsItem label="服务器">{{ server.name }} · {{ server.version }}</NDescriptionsItem>
        <NDescriptionsItem label="参与方式">{{ activity.participation }}</NDescriptionsItem>
      </NDescriptions>

      <div class="address-line">
        <span>服务器地址</span>
        <strong>{{ server.address }}</strong>
      </div>

      <div class="button-row">
        <CopyButton :value="server.address" label="复制活动服地址" primary />
        <NButton secondary tag="a" :href="sitePath(`/activities/${activity.id}`)">查看活动详情</NButton>
      </div>
    </div>
  </NCard>
  <NCard v-else class="weekly-event weekly-event--empty" :bordered="false">
    <NSpin v-if="loading" size="small" description="正在读取本周活动..." />
    <NEmpty v-else :description="activity ? '活动关联的服务器暂不可用' : '当前没有正在进行或即将开始的每周活动'" />
  </NCard>
</template>

<script setup lang="ts">
import { NButton, NCard, NDescriptions, NDescriptionsItem, NEmpty, NSpin, NTag } from "naive-ui";
import type { ActivityViewModel, ServerViewModel } from "~/types/view-models";
import { useSitePath } from "~/composables/useSitePath";

withDefaults(defineProps<{
  activity?: ActivityViewModel;
  server?: ServerViewModel;
  image?: string;
  imageAlt?: string;
  loading?: boolean;
}>(), {
  image: "/image-gpt-image-2-mr831dx0.webp",
  imageAlt: "猫娘社 Minecraft 活动场景",
  loading: false
});

const sitePath = useSitePath();

function resolveImage(path: string) {
  return path.startsWith("http://") || path.startsWith("https://") ? path : sitePath(path);
}
</script>
