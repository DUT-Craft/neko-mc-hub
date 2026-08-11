<template>
  <main class="page">
    <section class="page-title compact-title">
      <span class="page-kicker">历史活动</span>
      <h1>活动照片展示廊</h1>
      <p class="lead">速通、冒险、建筑和小游戏的精彩瞬间都保存在这里。</p>
    </section>

    <section class="gallery-wall" aria-label="历史活动照片">
      <NuxtLink v-for="item in galleryItems" :key="item.id" class="polaroid-link" :class="{ 'polaroid-link--large': item.featured }" :to="`/history/${item.id}`">
        <NCard
          class="polaroid"
          :class="{ 'polaroid-large': item.featured }"
          :bordered="false"
          hoverable
        >
          <template v-if="historyImage(item)" #cover>
            <img
              :src="historyImage(item)"
              :alt="item.alt"
              width="960"
              height="540"
              :loading="item.featured ? 'eager' : 'lazy'"
            />
          </template>
          <div class="polaroid-caption">
            <strong>{{ item.title }}</strong>
            <span>{{ item.meta }}</span>
          </div>
        </NCard>
      </NuxtLink>
      <NEmpty v-if="galleryItems.length === 0" description="当前没有已发布的活动回顾" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { NCard, NEmpty } from "naive-ui";
import { useDemoContent } from "~/composables/useDemoContent";
import { useSitePath } from "~/composables/useSitePath";

const sitePath = useSitePath();
const { galleryItems } = useDemoContent();

function historyImage(item: { coverImageUrl?: string | null; image?: string | null }) {
  return item.coverImageUrl || (item.image ? sitePath(item.image) : "");
}

useHead({ title: "历史活动记录 - 猫娘社 MC 主站" });
</script>
