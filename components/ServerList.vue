<template>
  <div class="server-list">
    <ServerCard
      v-for="server in servers"
      :key="server.id"
      :server="server"
      :selected="server.id === selectedId"
      @select="$emit('select', $event)"
    />
    <NEmpty v-if="servers.length === 0" description="当前筛选下没有服务器" />
  </div>
</template>

<script setup lang="ts">
import { NEmpty } from "naive-ui";
import type { ServerViewModel } from "~/types/view-models";

defineProps<{ servers: ServerViewModel[]; selectedId?: string }>();
defineEmits<{ select: [id: string] }>();
</script>
