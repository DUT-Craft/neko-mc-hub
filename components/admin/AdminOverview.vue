<template>
  <section class="admin-overview">
    <div class="admin-page-intro">
      <div>
        <span class="admin-kicker">今天要处理什么</span>
        <h2>主站运营总览</h2>
        <p>在这里快速查看服务器状态、待审核内容和最近需要处理的事项。</p>
      </div>
      <NButton secondary :loading="loading" @click="$emit('refresh')">刷新数据</NButton>
    </div>

    <div class="admin-stat-grid">
      <NCard v-for="stat in stats" :key="stat.label" class="admin-stat-card" :class="`is-${stat.tone}`" :bordered="false" size="small">
        <NStatistic :label="stat.label" :value="stat.value" />
        <small>{{ stat.note }}</small>
      </NCard>
    </div>

    <section class="admin-overview-grid">
      <NCard class="admin-panel admin-quick-panel" :bordered="false">
        <div class="admin-panel__heading"><span class="admin-kicker">常用操作</span><h3>直接进入</h3></div>
        <NList class="admin-quick-links" :bordered="false" :show-divider="false">
          <NListItem v-for="item in quickLinks" :key="item.to">
            <NuxtLink :to="item.to" class="admin-quick-link">
              <img :src="minecraftIconUrl(item.icon)" alt="" aria-hidden="true" />
              <span><strong>{{ item.label }}</strong><small>{{ item.note }}</small></span>
            </NuxtLink>
          </NListItem>
        </NList>
      </NCard>

      <NCard class="admin-panel admin-rule-panel" :bordered="false">
        <div class="admin-panel__heading"><span class="admin-kicker">运营原则</span><h3>发布前快速检查</h3></div>
        <NList class="admin-rule-list" :bordered="false">
          <NListItem>首页活动、服务器状态和参与方式要能一眼看懂。</NListItem>
          <NListItem>公告先保存为草稿，确认文字后再发布。</NListItem>
          <NListItem>申请、报名和反馈中的 QQ 只在后台显示。</NListItem>
        </NList>
      </NCard>
    </section>
  </section>
</template>

<script setup lang="ts">
import { NButton, NCard, NList, NListItem, NStatistic } from "naive-ui";
import type { AdminOverview as Overview } from "~/types/admin";
import { minecraftIconUrl } from "~/utils/minecraftIcons";

const props = defineProps<{ overview: Overview; loading: boolean }>();
defineEmits<{ refresh: [] }>();

const stats = computed(() => [
  { label: "公开服务器", value: props.overview.servers, note: `${props.overview.maintenanceServers} 个维护中`, tone: "green" },
  { label: "待审申请", value: props.overview.pendingApplications, note: "身份、开服和值班", tone: "yellow" },
  { label: "待审建议", value: props.overview.pendingIdeas, note: "可回复或采纳", tone: "blue" },
  { label: "待处理事项", value: props.overview.openFeedback + props.overview.pendingRegistrations, note: `${props.overview.openFeedback} 条反馈 · ${props.overview.pendingRegistrations} 个报名`, tone: "red" },
  { label: "已发布公告", value: props.overview.publishedAnnouncements, note: "当前公开显示", tone: "green" }
]);

const quickLinks = [
  { label: "编辑服务器", note: "状态、地址和玩法", icon: "server", to: "/admin?section=servers" },
  { label: "发布公告", note: "新建或修改告示", icon: "announce", to: "/admin?section=announcements" },
  { label: "处理审核", note: "申请、建议和反馈", icon: "apply", to: "/admin?section=reviews" },
  { label: "编辑 Wiki", note: "规则、整合包与入口", icon: "wiki", to: "/admin?section=wiki" }
];
</script>
