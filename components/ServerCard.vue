<template>
  <NCard
    class="server-card"
    :class="['server-card--' + server.status, { 'server-card--selected': selected }]"
    :bordered="false"
  >
    <div class="server-card__row">
      <span v-if="server.iconUrl" class="media-pixi" aria-hidden="true"><img :src="server.iconUrl" :alt="`${server.name} 图标`" /></span>
      <span v-else class="pixi" :class="'pixi-' + server.icon" aria-hidden="true"></span>

      <div class="server-card__identity">
        <h3>{{ server.name }}</h3>
        <p>{{ server.gameplay }}</p>
      </div>

      <div class="server-card__status">
        <NTag :type="statusType" round>{{ server.statusLabel }}</NTag>
        <span class="server-card__players"><strong>{{ server.online }}</strong>/{{ server.capacity }} 人</span>
      </div>

      <NText code>{{ server.address }}</NText>

      <NSpace class="server-card__actions" :size="6" wrap>
        <NButton v-if="selectable" size="small" secondary @click="$emit('select', server.id)">查看详情</NButton>
        <NButton v-else size="small" secondary tag="a" :href="sitePath('/servers?selected=' + server.id)">查看详情</NButton>
        <CopyButton
          v-if="server.status !== 'maintenance' && server.status !== 'offline'"
          :value="server.address"
          size="small"
        />
        <NButton v-else size="small" secondary tag="a" :href="sitePath('/announcements')">查看说明</NButton>
      </NSpace>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { NButton, NCard, NSpace, NTag, NText } from "naive-ui";
import type { ServerViewModel } from "~/types/view-models";
import { useSitePath } from "~/composables/useSitePath";

const props = defineProps<{ server: ServerViewModel; selected?: boolean; selectable?: boolean }>();
defineEmits<{ select: [id: string] }>();
const sitePath = useSitePath();

const statusType = computed(() => ({
  online: "success",
  available: "info",
  maintenance: "warning",
  offline: "error"
}[props.server.status] as "success" | "info" | "warning" | "error"));
</script>
