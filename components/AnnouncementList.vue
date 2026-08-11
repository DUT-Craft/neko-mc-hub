<template>
  <NList class="announcement-list" :bordered="false">
    <NListItem v-for="announcement in announcements" :key="announcement.id" class="announcement-card">
      <NuxtLink class="announcement-card__link" :to="`/announcements/${announcement.id}`">
        <div class="announcement-card__meta">
          <NTag :type="tagType(announcement.category)" round>{{ announcement.categoryLabel }}</NTag>
          <time>{{ announcement.publishedAt }}</time>
        </div>
        <div class="announcement-card__body">
          <span class="pixi pixi-announce" aria-hidden="true"></span>
          <div>
            <h3>{{ announcement.title }}</h3>
            <p>{{ announcement.summary }}</p>
          </div>
        </div>
      </NuxtLink>
    </NListItem>
    <NEmpty v-if="announcements.length === 0" description="当前没有更多公告" />
  </NList>
</template>

<script setup lang="ts">
import { NEmpty, NList, NListItem, NTag } from "naive-ui";
import type { AnnouncementViewModel } from "~/types/view-models";

defineProps<{ announcements: AnnouncementViewModel[] }>();

function tagType(category: AnnouncementViewModel["category"]) {
  const types: Record<string, "info" | "warning" | "success" | "default"> = {
    event: "info",
    maintenance: "warning",
    update: "success",
    club: "default"
  };
  return types[category] || "default";
}
</script>
