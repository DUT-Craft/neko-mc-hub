<template>
  <NCard
    class="server-card"
    :class="[`server-card--${server.status}`, { 'server-card--selected': selected }]"
    :bordered="false"
  >
    <div class="server-card__row">
      <span class="pixi" :class="`pixi-${server.icon}`" aria-hidden="true"></span>
      <div class="server-card__identity">
        <h3>{{ server.name }}</h3>
        <p>{{ server.gameplay }}</p>
      </div>
      <NSpace :size="6" wrap>
        <NTag :type="statusType" round>{{ server.statusLabel }}</NTag>
        <NTag round>{{ server.online }}/{{ server.capacity }} 人</NTag>
      </NSpace>
      <code>{{ server.address }}</code>
      <NSpace class="server-card__actions" :size="8" wrap>
        <NButton secondary @click="$emit('select', server.id)">查看详情</NButton>
        <CopyButton v-if="server.status !== 'maintenance' && server.status !== 'offline'" :value="server.address" />
        <NButton v-else secondary tag="a" :href="sitePath('/announcements')">查看说明</NButton>
      </NSpace>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { NButton, NCard, NSpace, NTag } from "naive-ui";
import type { ServerViewModel } from "~/types/view-models";
import { useSitePath } from "~/composables/useSitePath";

const props = defineProps<{ server: ServerViewModel; selected?: boolean }>();
defineEmits<{ select: [id: string] }>();
const sitePath = useSitePath();

const statusType = computed(() => ({
  online: "success",
  available: "info",
  maintenance: "warning",
  offline: "error"
}[props.server.status] as "success" | "info" | "warning" | "error"));
</script>
