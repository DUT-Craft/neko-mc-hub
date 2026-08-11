<template>
  <main class="page">
    <section class="page-title compact-title">
      <span class="page-kicker">服务器</span>
      <h1>服务器状态终端</h1>
      <p class="lead">有人在线的服务器自动排在前面，维护和无人服务器也不会隐藏。</p>
    </section>

    <section class="server-console">
      <NCard class="terminal-filters" :bordered="false" size="small" role="group" aria-label="服务器筛选">
        <NSpace :size="6" wrap>
          <NButton
            v-for="option in filterOptions"
            :key="option.value"
            size="small"
            :type="filter === option.value ? 'primary' : 'default'"
            :secondary="filter !== option.value"
            :aria-pressed="filter === option.value"
            @click="filter = option.value"
          >
            {{ option.label }}
          </NButton>
        </NSpace>
      </NCard>

      <div class="server-terminal">
        <ServerList
          :servers="filteredServers"
          :selected-id="selectedId"
          selectable
          @select="selectedId = $event"
        />

        <NCard v-if="selectedServer" class="terminal-panel" :bordered="false" aria-live="polite">
          <div class="terminal-topline"><span class="status-dot" aria-hidden="true"></span><span>当前选中</span></div>
          <div class="terminal-hero">
            <span v-if="selectedServer.iconUrl" class="media-pixi" aria-hidden="true"><img :src="selectedServer.iconUrl" :alt="`${selectedServer.name} 图标`" /></span>
            <span v-else class="pixi" :class="`pixi-${selectedServer.icon}`" aria-hidden="true"></span>
            <div><h2>{{ selectedServer.name }}</h2><p>{{ selectedServer.description }}</p></div>
          </div>
          <NDescriptions class="status-grid" :column="2" size="small" label-placement="top" bordered>
            <NDescriptionsItem label="状态">{{ selectedServer.statusLabel }}</NDescriptionsItem>
            <NDescriptionsItem label="在线">{{ selectedServer.online }}/{{ selectedServer.capacity }} 人</NDescriptionsItem>
            <NDescriptionsItem label="版本">{{ selectedServer.version }}</NDescriptionsItem>
            <NDescriptionsItem label="整合包">{{ selectedServer.pack }}</NDescriptionsItem>
          </NDescriptions>
          <div class="terminal-address"><span>地址</span><strong>{{ selectedServer.address }}</strong></div>
          <p class="terminal-rules">{{ selectedServer.rules }}</p>
          <NSpace wrap>
            <CopyButton v-if="selectedServer.status !== 'maintenance' && selectedServer.status !== 'offline'" :value="selectedServer.address" primary />
            <NButton secondary tag="a" :href="sitePath('/announcements')">查看公告</NButton>
          </NSpace>
        </NCard>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { NButton, NCard, NDescriptions, NDescriptionsItem, NSpace } from "naive-ui";
import { useDemoContent } from "~/composables/useDemoContent";
import { useSitePath } from "~/composables/useSitePath";

type FilterValue = "all" | "activity" | "permanent" | "pack" | "maintenance" | "online";
const route = useRoute();
const sitePath = useSitePath();
const { servers } = useDemoContent();
const filter = ref<FilterValue>("all");
const selectedId = ref(typeof route.query.selected === "string" ? route.query.selected : servers.value[0]?.id);

const filterOptions: Array<{ label: string; value: FilterValue }> = [
  { label: "全部", value: "all" }, { label: "活动服", value: "activity" },
  { label: "常驻", value: "permanent" }, { label: "整合包", value: "pack" },
  { label: "维护中", value: "maintenance" }, { label: "有人在线", value: "online" }
];

const filteredServers = computed(() => servers.value.filter((server) => {
  if (filter.value === "all") return true;
  if (filter.value === "activity" || filter.value === "permanent") return server.category === filter.value;
  if (filter.value === "pack") return server.pack !== "不需要整合包";
  if (filter.value === "maintenance") return server.status === "maintenance";
  return server.online > 0;
}));

const selectedServer = computed(() => servers.value.find((server) => server.id === selectedId.value) || filteredServers.value[0]);
watch(filteredServers, (items) => { if (!items.some((item) => item.id === selectedId.value)) selectedId.value = items[0]?.id; });
useHead({ title: "全部服务器 - 猫娘社 MC 主站" });
</script>
