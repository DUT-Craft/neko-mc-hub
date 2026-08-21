<template>
  <section class="admin-review">
    <div class="admin-page-intro">
      <div>
        <span class="admin-kicker">运营审核</span>
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
      </div>
      <NButton secondary :loading="loading" @click="$emit('refresh')">刷新队列</NButton>
    </div>

    <NCard v-if="loading" class="admin-panel admin-loading" :bordered="false">
      <NSpin size="small" description="正在读取审核内容..." />
    </NCard>
    <NCard v-else-if="!items.length" class="admin-panel admin-empty" :bordered="false">
      <NEmpty description="当前没有待处理内容" />
    </NCard>
    <NGrid v-else class="admin-review-list" cols="1 m:2" responsive="screen" :x-gap="12" :y-gap="12">
      <NGridItem v-for="item in items" :key="item.id">
        <NCard class="admin-review-card" :bordered="false" size="small">
          <div class="admin-review-card__top">
            <span class="admin-record-card__id">#{{ item.id }}</span>
            <NTag :type="statusType(item.status)" size="small">{{ statusLabel(item.status) }}</NTag>
            <time>{{ formatDate(item.createdAt) }}</time>
          </div>
          <h3>{{ item.title }}</h3>
          <p class="admin-review-card__person">{{ item.person }}</p>
          <p class="admin-review-card__detail">{{ item.detail }}</p>
          <pre v-if="item.privateDetail" class="admin-private-detail">{{ item.privateDetail }}</pre>
          <div class="admin-review-card__actions">
            <NButton
              v-if="onDelete"
              type="error"
              secondary
              size="small"
              :loading="deletingId === item.id"
              :disabled="saving && deletingId !== item.id"
              @click="deleteItem(item)"
            >
              删除
            </NButton>
            <NButton type="primary" size="small" :disabled="saving" @click="openReview(item)">处理</NButton>
          </div>
        </NCard>
      </NGridItem>
    </NGrid>

    <NModal
      v-model:show="showModal"
      preset="card"
      class="admin-review-modal"
      title="处理这条记录"
      :closable="!saving"
      :mask-closable="!saving"
      :close-on-esc="!saving"
    >
      <div v-if="selected" class="admin-review-modal__summary">
        <strong>{{ selected.title }}</strong>
        <span>{{ selected.person }}</span>
        <p>{{ selected.detail }}</p>
      </div>
      <NForm label-placement="top">
        <NFormItem label="处理状态">
          <NSelect v-model:value="draftStatus" :options="selectOptions(statusOptions)" />
        </NFormItem>
        <NFormItem :label="noteLabel">
          <NInput v-model:value="draftNote" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" :placeholder="notePlaceholder" :maxlength="5000" show-count />
        </NFormItem>
      </NForm>
      <template #footer>
        <div class="admin-modal-footer">
          <NButton secondary :disabled="saving" @click="showModal = false">取消</NButton>
          <NButton type="primary" :loading="saving" @click="submitReview">保存处理结果</NButton>
        </div>
      </template>
    </NModal>
  </section>
</template>

<script setup lang="ts">
import {
  NButton,
  NCard,
  NEmpty,
  NForm,
  NFormItem,
  NGrid,
  NGridItem,
  NInput,
  NModal,
  NSelect,
  NSpin,
  NTag
} from "naive-ui";
import type { AdminFieldOption, AdminReviewItem } from "~/types/admin";

const props = defineProps<{
  title: string;
  description: string;
  items: AdminReviewItem[];
  statusOptions: AdminFieldOption[];
  loading: boolean;
  saving: boolean;
  noteLabel?: string;
  notePlaceholder?: string;
  onSave: (id: number, status: string, note: string) => Promise<boolean>;
  onDelete?: (id: number) => Promise<boolean>;
}>();

defineEmits<{ refresh: [] }>();
const selected = ref<AdminReviewItem | null>(null);
const showModal = ref(false);
const draftStatus = ref("");
const draftNote = ref("");
const deletingId = ref<number | null>(null);
const noteLabel = computed(() => props.noteLabel || "管理员备注");
const notePlaceholder = computed(() => props.notePlaceholder || "记录处理说明，公开回复请注意措辞");

function openReview(item: AdminReviewItem) {
  selected.value = item;
  draftStatus.value = item.status;
  draftNote.value = item.note || "";
  showModal.value = true;
}

async function submitReview() {
  if (!selected.value || props.saving) return;
  const saved = await props.onSave(selected.value.id, draftStatus.value, draftNote.value);
  if (saved) showModal.value = false;
}

async function deleteItem(item: AdminReviewItem) {
  if (!props.onDelete || props.saving) return;
  if (!window.confirm(`确定永久删除申请 #${item.id} 吗？删除后无法恢复。`)) return;
  deletingId.value = item.id;
  try {
    await props.onDelete(item.id);
  } finally {
    deletingId.value = null;
  }
}

function formatDate(value: string) {
  if (!value) return "时间未知";
  return new Date(value).toLocaleString("zh-CN", { dateStyle: "short", timeStyle: "short" });
}

function statusLabel(value: string) {
  const contextualLabel = props.statusOptions.find((option) => option.value === value)?.label;
  if (contextualLabel) return contextualLabel;
  return ({ PENDING: "待处理", ADOPTED: "已采纳", HIDDEN: "已隐藏", OPEN: "待处理", PROCESSING: "处理中", CLOSED: "已关闭", CONFIRMED: "已确认", CANCELLED: "已取消" } as Record<string, string>)[value] || value;
}

function statusType(value: string) {
  if (["ADOPTED", "CONFIRMED"].includes(value)) return "success" as const;
  if (["PENDING", "OPEN", "PROCESSING"].includes(value)) return "warning" as const;
  if (["HIDDEN", "CLOSED", "CANCELLED"].includes(value)) return "error" as const;
  return "info" as const;
}

function selectOptions(options: AdminFieldOption[]) {
  return options as any[];
}
</script>
