<template>
  <section class="section member-application-history" aria-labelledby="member-application-history-title">
    <div class="section-head section-head--action">
      <div>
        <span class="section-label">处理进度</span>
        <h2 id="member-application-history-title">我的申请与回复</h2>
        <p>管理员处理后，状态和回复会显示在这里。</p>
      </div>
      <NButton secondary :loading="loading" @click="$emit('refresh')">刷新进度</NButton>
    </div>

    <NCard class="member-application-board" :bordered="false">
      <NSpin v-if="loading" size="small" description="正在读取申请进度..." />
      <NAlert v-else-if="error" type="error" :show-icon="false">{{ error }}</NAlert>
      <NEmpty v-else-if="!items.length" description="还没有提交过申请" />
      <NList v-else class="member-application-list" :bordered="false">
        <NListItem v-for="item in items" :key="item.id" class="member-application-item">
          <article>
            <div class="member-application-item__top">
              <span class="member-application-item__id">#{{ item.id }}</span>
              <NTag :type="statusType(item.status)" size="small" round>{{ statusLabel(item.status) }}</NTag>
              <time>更新于 {{ formatDate(item.updatedAt) }}</time>
            </div>
            <h3>{{ kindLabel(item.kind) }} · {{ item.name }}</h3>
            <div class="member-application-reply" :class="{ 'is-pending': !item.adminNote }">
              <span>管理员回复</span>
              <p>{{ item.adminNote || "管理员尚未回复，请稍后刷新查看。" }}</p>
            </div>
            <small>提交于 {{ formatDate(item.createdAt) }}</small>
          </article>
        </NListItem>
      </NList>
    </NCard>
  </section>
</template>

<script setup lang="ts">
import { NAlert, NButton, NCard, NEmpty, NList, NListItem, NSpin, NTag } from "naive-ui";
import type { MemberApplicationViewModel } from "~/types/view-models";

defineProps<{ items: MemberApplicationViewModel[]; loading: boolean; error?: string }>();
defineEmits<{ refresh: [] }>();

function kindLabel(value: MemberApplicationViewModel["kind"]) {
  return { SKIN: "皮肤站邀请码", SERVER: "开服申请", DUTY: "值班申请" }[value];
}

function statusLabel(value: MemberApplicationViewModel["status"]) {
  return { PENDING: "待处理", ADOPTED: "已通过", HIDDEN: "未通过" }[value];
}

function statusType(value: MemberApplicationViewModel["status"]) {
  if (value === "ADOPTED") return "success" as const;
  if (value === "HIDDEN") return "error" as const;
  return "warning" as const;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("zh-CN", { dateStyle: "short", timeStyle: "short" });
}
</script>

<style scoped>
.member-application-board {
  border: 1px solid var(--line);
  background: var(--surface);
}

.member-application-list {
  --n-color: transparent !important;
}

.member-application-item {
  padding-block: 16px;
}

.member-application-item article {
  min-width: 0;
  width: 100%;
  display: grid;
  gap: 9px;
}

.member-application-item__top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
}

.member-application-item__top time,
.member-application-item small {
  color: var(--muted);
  font-size: 12px;
}

.member-application-item__id {
  padding: 3px 6px;
  border-radius: 4px;
  color: var(--muted);
  background: var(--surface-soft);
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.2;
}

.member-application-item__top time {
  margin-left: auto;
}

.member-application-item h3,
.member-application-reply p {
  margin: 0;
  overflow-wrap: anywhere;
}

.member-application-reply {
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  border-left: 3px solid var(--green);
  background: var(--green-soft);
}

.member-application-reply.is-pending {
  border-left-color: var(--yellow);
  background: var(--yellow-soft);
}

.member-application-reply span {
  color: var(--muted);
  font-size: 11px;
  font-weight: 750;
}

.member-application-reply p {
  color: var(--ink-soft);
  line-height: 1.6;
  white-space: pre-wrap;
}

@media (max-width: 600px) {
  .member-application-item__top time {
    width: 100%;
    margin-left: 0;
  }
}
</style>
