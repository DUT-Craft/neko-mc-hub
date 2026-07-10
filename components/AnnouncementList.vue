<template>
  <div class="announcement-list">
    <NCard v-for="announcement in announcements" :key="announcement.id" class="announcement-card" :bordered="false">
      <NSpace justify="space-between" align="center" :wrap="true">
        <NTag :type="tagType(announcement.category)" round>{{ announcement.categoryLabel }}</NTag>
        <time>{{ announcement.publishedAt }}</time>
      </NSpace>
      <h3>{{ announcement.title }}</h3>
      <p>{{ announcement.summary }}</p>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard, NSpace, NTag } from "naive-ui";
import type { AnnouncementViewModel } from "~/types/view-models";

defineProps<{ announcements: AnnouncementViewModel[] }>();

function tagType(category: AnnouncementViewModel["category"]) {
  return ({ event: "info", maintenance: "warning", update: "success", club: "default" }[category] || "default") as "info" | "warning" | "success" | "default";
}
</script>
