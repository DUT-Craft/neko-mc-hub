<template>
  <main class="page">
    <section class="page-title home-title">
      <span class="page-kicker">今日大厅</span>
      <h1>今晚去哪一服？</h1>
      <p class="lead">先看本周活动和长期项目，再选当前有人在线的服务器。</p>
    </section>

    <section class="lobby-shell">
      <div class="lobby-column lobby-column-left">
        <WeeklyEvent :activity="weeklyActivity" :server="weeklyServer" />
      </div>

      <div class="lobby-column lobby-column-right">
        <div class="lobby-map" aria-label="服务器大厅地图">
          <div class="map-path path-x" aria-hidden="true"></div>
          <div class="map-path path-y" aria-hidden="true"></div>
          <NuxtLink
            v-for="server in mapServers"
            :key="server.id"
            class="map-node portal-node"
            :class="[`portal-${server.id}`, { 'is-muted': server.status === 'maintenance' }]"
            :to="`/servers?selected=${server.id}`"
          >
            <span class="pixi" :class="`pixi-${server.icon}`" aria-hidden="true"></span>
            <strong>{{ server.name }}传送门</strong>
            <em>{{ server.online }}/{{ server.capacity }} · {{ server.statusLabel }}</em>
          </NuxtLink>
          <NuxtLink class="map-node sign-node" to="/announcements">
            <span class="pixi pixi-sign" aria-hidden="true"></span>
            <strong>告示牌</strong><em>公告 / 规则</em>
          </NuxtLink>
          <NuxtLink class="map-node chest-node" to="/wiki">
            <span class="pixi pixi-chest" aria-hidden="true"></span>
            <strong>箱子</strong><em>Wiki / 整合包</em>
          </NuxtLink>
          <div class="map-core">
            <span class="paw-dot" aria-hidden="true"></span>
            <strong>大厅中央</strong><em>先看今晚动线</em>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div><span class="page-kicker">长期活动</span><h2>持续进行的项目</h2></div>
        <p>生电、冒险组和建筑展示都在这里长期招募。</p>
      </div>
      <ActivitySection :activities="longTermActivities" />
    </section>

    <section class="section">
      <div class="section-head">
        <div><span class="page-kicker">当前有人</span><h2>现在适合加入</h2></div>
        <p>按当前演示在线人数排序。</p>
      </div>
      <ServerList :servers="onlineServers" :selected-id="selectedId" @select="selectedId = $event" />
    </section>

    <section class="section">
      <div class="section-head">
        <div><span class="page-kicker">全部服务器</span><h2>所有入口</h2></div>
        <NButton secondary tag="a" :href="sitePath('/servers')">打开状态终端</NButton>
      </div>
      <ServerList :servers="servers" :selected-id="selectedId" @select="selectedId = $event" />
    </section>

    <section class="section quiet-dock">
      <NuxtLink class="dock-sign" to="/announcements"><span>公告墙</span><strong>活动、维护和值班安排</strong></NuxtLink>
      <NuxtLink class="dock-sign" to="/applications"><span>申请台</span><strong>邀请码、开服和值班申请</strong></NuxtLink>
      <NuxtLink class="dock-sign" to="/wiki"><span>工具箱</span><strong>启动器、规则与整合包</strong></NuxtLink>
      <NuxtLink class="dock-sign" to="/history"><span>展示廊</span><strong>历史截图与活动记录</strong></NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import { useDemoContent } from "~/composables/useDemoContent";
import { useSitePath } from "~/composables/useSitePath";

const sitePath = useSitePath();
const { servers, onlineServers, weeklyActivity, longTermActivities } = useDemoContent();
const selectedId = ref(onlineServers.value[0]?.id);
const weeklyServer = computed(() => servers.value.find((server) => server.id === weeklyActivity.value?.serverId));
const mapServers = computed(() => servers.value.filter((server) => ["event", "redstone", "lobby", "resource"].includes(server.id)));

useHead({ title: "今日服务器大厅 - 猫娘社 MC 主站" });
</script>
