<template>
  <main class="page">
    <section class="page-title compact-title">
      <span class="page-kicker">服务器</span>
      <h1>服务器状态终端</h1>
      <p class="lead">有人在线的服务器自动排在前面，维护和无人服务器也不会隐藏。</p>
    </section>

    <section class="server-console">
      <div class="filters terminal-filters" role="group" aria-label="服务器筛选">
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
      </div>

      <div class="server-terminal">
        <ServerList :servers="filteredServers" :selected-id="selectedId" @select="selectedId = $event" />

        <NCard v-if="selectedServer" class="terminal-panel" :bordered="false">
          <div class="terminal-topline"><span class="paw-dot" aria-hidden="true"></span><span>选中服务器</span></div>
          <div class="terminal-hero">
            <span class="pixi" :class="`pixi-${selectedServer.icon}`" aria-hidden="true"></span>
            <div><h2>{{ selectedServer.name }}</h2><p>{{ selectedServer.description }}</p></div>
          </div>
          <dl class="status-grid">
            <div><dt>状态</dt><dd>{{ selectedServer.statusLabel }}</dd></div>
            <div><dt>在线</dt><dd>{{ selectedServer.online }}/{{ selectedServer.capacity }} 人</dd></div>
            <div><dt>版本</dt><dd>{{ selectedServer.version }}</dd></div>
            <div><dt>整合包</dt><dd>{{ selectedServer.pack }}</dd></div>
          </dl>
          <div class="terminal-address"><span>地址</span><strong>{{ selectedServer.address }}</strong></div>
          <p class="terminal-rules">{{ selectedServer.rules }}</p>
          <NSpace wrap>
            <CopyButton v-if="selectedServer.status !== 'maintenance'" :value="selectedServer.address" primary />
            <NButton secondary tag="a" :href="sitePath('/announcements')">查看规则</NButton>
          </NSpace>
        </NCard>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { NButton, NCard, NSpace } from "naive-ui";
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
