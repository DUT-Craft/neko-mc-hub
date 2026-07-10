<template>
  <main class="page">
    <section class="page-title compact-title"><span class="page-kicker">回顾</span><h1>活动照片展示廊</h1><p class="lead">速通、小游戏、冒险组和建筑活动用截图墙保存。</p></section>

    <section class="gallery-wall">
      <NCard v-for="item in galleryItems" :key="item.id" class="polaroid" :class="{ 'polaroid-large': item.featured }" :bordered="false">
        <img :src="withBase(item.image)" :alt="item.alt" width="960" height="540" :loading="item.featured ? 'eager' : 'lazy'" />
        <div><strong>{{ item.title }}</strong><span>{{ item.meta }}</span></div>
      </NCard>
    </section>

    <section class="section record-rail">
      <div class="section-head"><div><span class="page-kicker">最近记录</span><h2>活动时间线</h2></div><p>演示版本只展示摘要，详情等待真实活动资料。</p></div>
      <NTimeline>
        <NTimelineItem v-for="item in galleryItems" :key="item.id" :title="item.title" :time="item.meta" type="success">活动记录详情待补充。</NTimelineItem>
      </NTimeline>
    </section>
  </main>
</template>

<script setup lang="ts">
import { NCard, NTimeline, NTimelineItem } from "naive-ui";
import { useDemoContent } from "~/composables/useDemoContent";
import { useSitePath } from "~/composables/useSitePath";
const sitePath = useSitePath();
const { galleryItems } = useDemoContent();
function withBase(path: string) { return sitePath(path); }
useHead({ title: "历史活动记录 - 猫娘社 MC 主站" });
</script>
