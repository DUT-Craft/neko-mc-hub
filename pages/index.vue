<template>
  <main class="page">
    <section class="page-title home-title">
      <span class="page-kicker">入口大厅</span>
      <h1>猫娘社服务器大厅入口</h1>
      <p class="lead">马上开玩先进入今日大厅；查看规则、申请和值班安排可以直接选择下面的告示牌。</p>
    </section>

    <section class="entry-concourse">
      <NCard class="entry-primary" :bordered="false" role="link" tabindex="0" @click="navigateTo('/home')" @keydown.enter="navigateTo('/home')">
        <span class="pixi pixi-lobby" aria-hidden="true"></span>
        <div><NTag type="success" round>推荐入口</NTag><h2>进入今日服务器大厅</h2><p>今晚去哪一个服、谁在线、地址复制，都先在这里确认。</p></div>
      </NCard>
      <div class="entry-status-board">
        <div><strong class="num">{{ totalOnline }}</strong><span>演示在线</span></div>
        <div><strong class="num">{{ servers.length }}</strong><span>服务器</span></div>
        <div><strong class="num">{{ activeActivities }}</strong><span>进行中活动</span></div>
        <div><strong class="num">3</strong><span>申请类型</span></div>
      </div>
    </section>

    <section class="quiet-dock">
      <NuxtLink class="dock-sign" to="/servers"><span>状态终端</span><strong>服务器、在线、版本、地址</strong></NuxtLink>
      <NuxtLink class="dock-sign" to="/activities"><span>任务板</span><strong>速通、小游戏、冒险组</strong></NuxtLink>
      <NuxtLink class="dock-sign" to="/announcements"><span>告示牌墙</span><strong>公告、维护和值班管理</strong></NuxtLink>
      <NuxtLink class="dock-sign" to="/applications"><span>委托板</span><strong>邀请码、开服和值班申请</strong></NuxtLink>
      <NuxtLink class="dock-sign" to="/wiki"><span>工具箱</span><strong>启动器、皮肤站、规则</strong></NuxtLink>
      <NuxtLink class="dock-sign" to="/history"><span>展示廊</span><strong>截图墙和活动回顾</strong></NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
import { NCard, NTag } from "naive-ui";
import { useDemoContent } from "~/composables/useDemoContent";
const { servers, totalOnline, longTermActivities, limitedActivities } = useDemoContent();
const activeActivities = computed(() => longTermActivities.value.length + limitedActivities.value.length + 1);
useHead({ title: "猫娘社 MC 主站入口" });
</script>
