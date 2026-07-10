<template>
  <main class="page">
    <section class="page-title compact-title">
      <span class="page-kicker">活动</span>
      <h1>活动任务板</h1>
      <p class="lead">先看时间、服务器、整合包和参与方式，再决定今晚去哪里。</p>
    </section>

    <section class="task-board-layout">
      <WeeklyEvent :activity="weeklyActivity" :server="weeklyServer" />
      <NCard class="prep-board" :bordered="false">
        <h2>出发前检查</h2>
        <NTimeline>
          <NTimelineItem time="19:45" title="大厅集合">确认分组和是否需要补位。</NTimelineItem>
          <NTimelineItem time="19:55" title="规则提醒">队长发布路线和注意事项。</NTimelineItem>
          <NTimelineItem time="20:00" title="统一开局" type="success">活动服正式开始。</NTimelineItem>
        </NTimeline>
      </NCard>
    </section>

    <section class="section">
      <div class="section-head"><div><span class="page-kicker">长期活动</span><h2>持续招募</h2></div><p>长期项目紧跟本周活动展示。</p></div>
      <ActivitySection :activities="longTermActivities" />
    </section>

    <section class="section">
      <div class="section-head"><div><span class="page-kicker">限时任务</span><h2>即将发生</h2></div><p>活动状态按优先级排列。</p></div>
      <ActivitySection :activities="limitedActivities" />
    </section>

    <section class="section pack-shelf">
      <NCard class="inventory-slot" :bordered="false"><span class="pixi pixi-pack" aria-hidden="true"></span><strong>冒险组整合包</strong><em>QQ群文件为准</em></NCard>
      <NCard class="inventory-slot" :bordered="false"><span class="pixi pixi-guide" aria-hidden="true"></span><strong>HMCL 下载</strong><em>链接等待真实内容</em></NCard>
      <NCard class="inventory-slot" :bordered="false"><span class="pixi pixi-guide" aria-hidden="true"></span><strong>PCL 下载</strong><em>链接等待真实内容</em></NCard>
    </section>
  </main>
</template>

<script setup lang="ts">
import { NCard, NTimeline, NTimelineItem } from "naive-ui";
import { useDemoContent } from "~/composables/useDemoContent";
const { servers, weeklyActivity, longTermActivities, limitedActivities } = useDemoContent();
const weeklyServer = computed(() => servers.value.find((server) => server.id === weeklyActivity.value?.serverId));
useHead({ title: "限时活动与小组服务器 - 猫娘社 MC 主站" });
</script>
