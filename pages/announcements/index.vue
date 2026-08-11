<template>
  <main class="page">
    <section class="page-title compact-title">
      <span class="page-kicker">公告</span>
      <h1>告示牌墙</h1>
      <p class="lead">活动、维护、规则和值班安排都集中在这里。</p>
    </section>

    <section class="notice-wall">
      <NCard v-if="latest" class="notice-sign notice-sign-large" :bordered="false">
        <img
          class="notice-sign__image"
          :src="latest?.coverImageUrl || sitePath('/assets_activity-speedrun-image2.webp')"
          alt="Minecraft 校园速通活动入口"
          width="1600"
          height="900"
        />
        <div class="notice-sign__content">
          <div class="notice-sign__top">
            <span class="pixi pixi-announce" aria-hidden="true"></span>
            <div>
              <span class="section-label">最新公告</span>
              <div class="notice-sign__meta">
                <NTag type="info" round>{{ latest.categoryLabel }}</NTag>
                <time>{{ latest.publishedAt }}</time>
              </div>
            </div>
          </div>
          <h2>{{ latest.title }}</h2>
          <p>{{ latest.summary }}</p>
          <div class="button-row">
            <NButton type="primary" tag="a" :href="sitePath(`/announcements/${latest.id}`)">阅读该公告</NButton>
          </div>
        </div>
      </NCard>
      <NCard v-else class="notice-sign notice-sign-large" :bordered="false">
        <NSpin v-if="pending" size="small" description="正在读取公告..." />
        <NEmpty v-else description="当前没有已发布的公告" />
      </NCard>

      <NCard class="notice-feed" :bordered="false">
        <div class="panel-heading">
          <span class="section-label">更多消息</span>
          <h2>最近公告</h2>
        </div>
        <AnnouncementList :announcements="otherAnnouncements" />
      </NCard>
    </section>

    <NCard class="duty-board section" :bordered="false">
      <div class="duty-board__intro">
        <span class="pixi pixi-lobby" aria-hidden="true"></span>
        <div>
          <span class="section-label">本周值班</span>
          <h2>不知道找谁？按事项联系。</h2>
          <p>申请和技术问题请带上 Minecraft ID，活动问题请说明服务器名称。</p>
        </div>
      </div>
      <NList class="duty-manager-list" :bordered="false">
        <NListItem v-for="manager in managers" :key="manager.id">
          <NThing :title="manager.name" :description="manager.responsibilities" />
          <template #suffix><NText code>{{ manager.contact }}</NText></template>
        </NListItem>
        <NListItem v-if="!managers.length"><NEmpty description="当前没有公开的值班联系人" /></NListItem>
      </NList>
    </NCard>
  </main>
</template>

<script setup lang="ts">
import { NButton, NCard, NEmpty, NList, NListItem, NSpin, NTag, NText, NThing } from "naive-ui";
import { useDemoContent } from "~/composables/useDemoContent";
import { useSitePath } from "~/composables/useSitePath";

const { announcements, managers, pending } = useDemoContent();
const sitePath = useSitePath();
const latest = computed(() => announcements.value[0]);
const otherAnnouncements = computed(() => announcements.value.slice(1));

useHead({ title: "公告栏 - 猫娘社 MC 主站" });
</script>
