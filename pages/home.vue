<template>
  <main class="page page-home">
    <section class="page-title home-title">
      <span class="page-kicker">今日大厅</span>
      <h1>今晚去哪一服？</h1>
      <p class="lead">先看本周活动，再从当前在线的服务器里选一个直接加入。</p>
    </section>

    <section class="home-weekly" aria-label="本周活动">
      <WeeklyEvent
        :activity="weeklyActivity"
        :server="weeklyServer"
        :loading="pending"
        :image="weeklyActivity?.coverImageUrl || '/image-gpt-image-2-mr831dx0.webp'"
        image-alt="猫娘社成员在 Minecraft 服务器大厅集合"
      />
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <span class="section-label">长期项目</span>
          <h2>随时可以加入</h2>
          <p>生电、冒险与建筑小组持续招募。</p>
        </div>
      </div>
      <ActivitySection :activities="longTermActivities" />
    </section>

    <section class="section home-online-section" aria-label="当前有人在线的服务器">
      <NCard class="online-now" :bordered="false">
        <div class="online-now__head">
          <div>
            <span class="status-line"><i aria-hidden="true"></i>实时概览</span>
            <h2>现在有人在玩</h2>
          </div>
          <NStatistic class="online-total" :value="totalOnline" label="人在线" />
        </div>

        <NList class="online-now__list" :bordered="false">
          <NListItem v-for="server in onlineServers" :key="server.id">
            <NuxtLink :to="'/servers?selected=' + server.id">
              <span v-if="server.iconUrl" class="media-pixi" aria-hidden="true"><img :src="server.iconUrl" :alt="`${server.name} 图标`" /></span>
              <span v-else class="pixi" :class="'pixi-' + server.icon" aria-hidden="true"></span>
              <span class="online-now__identity">
                <strong>{{ server.name }}</strong>
                <small>{{ server.gameplay }}</small>
              </span>
              <span class="online-now__count"><strong>{{ server.online }}</strong>/{{ server.capacity }}</span>
            </NuxtLink>
          </NListItem>
          <NListItem v-if="pending" class="online-now__state"><NSpin size="small" description="正在读取服务器状态..." /></NListItem>
          <NListItem v-else-if="!onlineServers.length" class="online-now__state"><NEmpty description="当前没有检测到在线玩家" /></NListItem>
        </NList>

        <div class="online-now__foot">
          <span>{{ onlineServers.length }} 个服务器当前有人</span>
          <NButton text tag="a" :href="sitePath('/servers')">查看全部状态</NButton>
        </div>
      </NCard>
    </section>

    <section class="section">
      <div class="section-head section-head--action">
        <div>
          <span class="section-label">服务器总览</span>
          <h2>所有服务器</h2>
          <p>在线、空闲、维护中的入口都会显示。</p>
        </div>
        <NButton secondary tag="a" :href="sitePath('/servers')">打开状态终端</NButton>
      </div>
      <ServerList :servers="servers" />
    </section>

  </main>
</template>

<script setup lang="ts">
import { NButton, NCard, NEmpty, NList, NListItem, NSpin, NStatistic } from "naive-ui";
import { useDemoContent } from "~/composables/useDemoContent";
import { useSitePath } from "~/composables/useSitePath";

const sitePath = useSitePath();
const { servers, onlineServers, weeklyActivity, longTermActivities, totalOnline, pending } = useDemoContent();
const weeklyServer = computed(() => servers.value.find((server) => server.id === weeklyActivity.value?.serverId));

useHead({ title: "今日服务器大厅 - 猫娘社 MC 主站" });
</script>
