<template>
  <main class="page">
    <section class="page-title compact-title">
      <span class="page-kicker">活动</span>
      <h1>活动任务板</h1>
      <p class="lead">先确认时间、服务器和参与方式，再决定今晚去哪里。</p>
    </section>

    <section class="task-board-layout">
      <WeeklyEvent
        :activity="weeklyActivity"
        :server="weeklyServer"
        :loading="pending"
        :image="weeklyActivity?.coverImageUrl || '/assets_activity-speedrun-image2.webp'"
        image-alt="Minecraft 校园活动入口与任务告示牌"
      />

      <NCard class="prep-board" :bordered="false">
        <div class="prep-board__head">
          <span class="pixi pixi-guide" aria-hidden="true"></span>
          <div><span>本周安排</span><h2>活动信息</h2></div>
        </div>
        <NDescriptions v-if="weeklyActivity" :column="1" size="small" label-placement="left" bordered>
          <NDescriptionsItem label="时间">{{ weeklyActivity.time }}</NDescriptionsItem>
          <NDescriptionsItem label="服务器">{{ weeklyServer?.name || "关联服务器暂不可用" }}</NDescriptionsItem>
          <NDescriptionsItem label="参与">{{ weeklyActivity.participation }}</NDescriptionsItem>
          <NDescriptionsItem label="整合包">{{ weeklyActivity.requiresPack ? "需要提前安装" : "不需要" }}</NDescriptionsItem>
        </NDescriptions>
        <NSpin v-else-if="pending" size="small" description="正在读取活动安排..." />
        <NEmpty v-else description="当前没有本周活动安排" />
      </NCard>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <span class="section-label">长期项目</span>
          <h2>持续招募</h2>
          <p>这些项目没有截止时间，可以随时加入。</p>
        </div>
      </div>
      <ActivitySection :activities="longTermActivities" />
    </section>

    <section v-if="limitedActivities.length" class="section">
      <div class="section-head">
        <div>
          <span class="section-label">近期安排</span>
          <h2>即将开始</h2>
          <p>限时活动按开始时间和优先级排列。</p>
        </div>
      </div>
      <ActivitySection :activities="limitedActivities" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { NCard, NDescriptions, NDescriptionsItem, NEmpty, NSpin } from "naive-ui";
import { useDemoContent } from "~/composables/useDemoContent";

const { servers, weeklyActivity, longTermActivities, limitedActivities, pending } = useDemoContent();
const weeklyServer = computed(() => servers.value.find((server) => server.id === weeklyActivity.value?.serverId));

useHead({ title: "限时活动与小组服务器 - 猫娘社 MC 主站" });
</script>
