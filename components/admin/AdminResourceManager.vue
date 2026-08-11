<template>
  <section class="admin-resource">
    <div class="admin-page-intro">
      <div>
        <span class="admin-kicker">内容管理</span>
        <h2>{{ definition.title }}</h2>
        <p>{{ definition.description }}</p>
      </div>
      <div class="admin-intro-actions">
        <NButton secondary :loading="loading" @click="$emit('refresh')">刷新</NButton>
        <NButton v-if="!definition.readOnly" type="primary" @click="openCreate">新建内容</NButton>
      </div>
    </div>

    <div class="admin-toolbar">
      <NInput v-model:value="search" clearable placeholder="搜索名称、标题或状态" />
      <span class="admin-toolbar__count">共 {{ filteredRows.length }} 条</span>
    </div>

    <NCard v-if="loading" class="admin-panel admin-loading" :bordered="false">
      <NSpin size="small" description="正在读取内容..." />
    </NCard>
    <NCard v-else-if="!filteredRows.length" class="admin-panel admin-empty" :bordered="false">
      <NEmpty description="没有匹配的内容" />
    </NCard>
    <NList v-else class="admin-record-list" :bordered="false" :show-divider="false">
      <NListItem v-for="row in filteredRows" :key="String(row.draftId || row.id)" class="admin-record-card" :data-status="String(row.status || '')">
        <div class="admin-record-card__main">
          <div class="admin-record-card__title">
            <span class="admin-record-card__id">{{ row.id === null || row.id === undefined ? "新草稿" : `#${row.id}` }}</span>
            <h3>{{ displayValue(row, definition.columns[0]?.key || "name") }}</h3>
            <NTag :type="statusType(row)" size="small">{{ statusLabel(row) }}</NTag>
          </div>
          <div class="admin-record-card__facts">
            <span v-for="column in definition.columns.slice(1)" :key="column.key" :title="displayValue(row, column.key, column.fallback)">
              <b>{{ column.label }}</b>{{ displayValue(row, column.key, column.fallback) }}
            </span>
          </div>
        </div>
        <template v-if="!definition.readOnly" #suffix>
          <NSpace class="admin-record-card__actions" :size="6" wrap>
            <NButton v-if="definition.key === 'servers' && hasPublishedRecord(row)" secondary size="small" :type="row.maintenance ? 'warning' : 'default'" :disabled="saving" @click="$emit('toggle-maintenance', row)">{{ row.maintenance ? "结束维护" : "设为维护" }}</NButton>
            <NButton v-if="definition.key === 'servers' && hasPublishedRecord(row)" secondary size="small" :disabled="saving" @click="$emit('refresh-status', row)">检测状态</NButton>
            <NButton secondary size="small" :disabled="saving" @click="openEdit(row)">{{ row.draftId && row.hasUnpublishedChanges ? "编辑草稿" : "编辑" }}</NButton>
            <NButton v-if="hasPublishedRecord(row) && row.published !== false" tertiary size="small" type="warning" :disabled="saving" @click="$emit('hide', row)">下线</NButton>
            <NButton v-if="hasPublishedRecord(row) && row.published === false" tertiary size="small" type="error" :disabled="saving" @click="$emit('delete-resource', row)">永久删除</NButton>
            <NButton v-if="!hasPublishedRecord(row) && row.draftId" tertiary size="small" type="error" :disabled="saving" @click="$emit('delete-draft', row)">删除草稿</NButton>
          </NSpace>
        </template>
      </NListItem>
    </NList>

    <NModal v-model:show="showEditor" preset="card" class="admin-editor-modal" :title="editingId ? `编辑 ${definition.title}` : `新建 ${definition.title}`">
      <NForm label-placement="top" :show-feedback="false">
        <div class="admin-editor-grid">
          <NFormItem v-for="field in definition.fields" :key="field.key" :class="{ 'admin-field--full': field.full }" :label="field.label" :required="field.required">
            <NInput v-if="field.type === 'text'" v-model:value="draft[field.key]" :placeholder="field.placeholder" :maxlength="field.maxLength" :show-count="Boolean(field.maxLength)" />
            <NInput v-else-if="field.type === 'textarea'" v-model:value="draft[field.key]" type="textarea" :autosize="{ minRows: 3, maxRows: 8 }" :placeholder="field.placeholder" :maxlength="field.maxLength" :show-count="Boolean(field.maxLength)" />
            <NInputNumber v-else-if="field.type === 'number'" v-model:value="draft[field.key]" class="admin-field-control" :min="-99999" :max="99999" />
            <NSelect v-else-if="field.type === 'select'" v-model:value="draft[field.key]" :options="selectOptions(field.options)" :placeholder="field.placeholder" />
            <NSwitch v-else v-model:value="draft[field.key]" />
            <small v-if="field.help" class="admin-field-help">{{ field.help }}</small>
          </NFormItem>
        </div>
      </NForm>
      <template #footer>
        <div class="admin-modal-footer">
          <NButton secondary @click="showEditor = false">取消</NButton>
          <NButton type="primary" :loading="saving" :disabled="!canSave" @click="submit">保存</NButton>
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
  NInput,
  NInputNumber,
  NList,
  NListItem,
  NModal,
  NSelect,
  NSpace,
  NSpin,
  NSwitch,
  NTag
} from "naive-ui";
import type { AdminField, AdminResourceDefinition, AdminRow } from "~/types/admin";

const props = defineProps<{
  definition: AdminResourceDefinition;
  rows: AdminRow[];
  loading: boolean;
  saving: boolean;
}>();

const emit = defineEmits<{
  refresh: [];
  save: [row: AdminRow, isNew: boolean, done: () => void];
  hide: [row: AdminRow];
  "delete-resource": [row: AdminRow];
  "delete-draft": [row: AdminRow];
  "toggle-maintenance": [row: AdminRow];
  "refresh-status": [row: AdminRow];
}>();

const search = ref("");
const showEditor = ref(false);
const editingId = ref<number | string | undefined>();
const draft = ref<Record<string, any>>({});

const filteredRows = computed(() => {
  const query = search.value.trim().toLowerCase();
  if (!query) return props.rows;
  return props.rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query));
});

const canSave = computed(() => props.definition.fields.every((field) => {
  const value = String(draft.value[field.key] ?? "").trim();
  if (field.required && !value) return false;
  return !field.maxLength || value.length <= field.maxLength;
}));

function blankValue(field: AdminField) {
  if (field.type === "boolean") return false;
  if (field.type === "number") return 0;
  return field.options?.[0]?.value || "";
}

function selectOptions(options?: AdminField["options"]) {
  return (options || []) as any[];
}

function openCreate() {
  if (props.definition.dedicatedEditor) {
    navigateTo(`/admin/content/${props.definition.key}/new`);
    return;
  }
  editingId.value = undefined;
  draft.value = Object.fromEntries(props.definition.fields.map((field) => [field.key, blankValue(field)]));
  showEditor.value = true;
}

function openEdit(row: AdminRow) {
  if (props.definition.dedicatedEditor && typeof row.draftId === "string") {
    navigateTo(`/admin/content/${props.definition.key}/draft-${row.draftId}`);
    return;
  }
  if (props.definition.dedicatedEditor && hasPublishedRecord(row)) {
    navigateTo(`/admin/content/${props.definition.key}/${row.id}`);
    return;
  }
  editingId.value = row.id;
  draft.value = JSON.parse(JSON.stringify(row)) as Record<string, any>;
  showEditor.value = true;
}

function hasPublishedRecord(row: AdminRow) {
  return row.id !== null && row.id !== undefined;
}

function submit() {
  if (!canSave.value) return;
  emit(
    "save",
    { ...draft.value, ...(editingId.value === undefined ? {} : { id: editingId.value }) },
    editingId.value === undefined,
    () => { showEditor.value = false; }
  );
}

function displayValue(row: AdminRow, key: string, fallback = "未填写") {
  const value = row[key];
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "boolean") return value ? "是" : "否";
  return formatDate(String(value), key);
}

function formatDate(value: string, key: string) {
  if (!/(At|_at)$/.test(key) || !value.includes("T")) return value;
  return new Date(value).toLocaleString("zh-CN", { dateStyle: "short", timeStyle: "short" });
}

function statusLabel(row: AdminRow) {
  const value = row.status ?? (row.published === false ? "HIDDEN" : "PUBLISHED");
  const labels: Record<string, string> = {
    ONLINE: "在线", AVAILABLE: "可进入", MAINTENANCE: "维护中", OFFLINE: "离线",
    ACTIVE: "进行中", UPCOMING: "即将开始", ONGOING: "长期进行", PAUSED: "暂停",
    DRAFT: "草稿", PUBLISHED: "已发布", HIDDEN: "已隐藏",
    PENDING: "待处理", ADOPTED: "已采纳", OPEN: "待处理", PROCESSING: "处理中", CLOSED: "已关闭"
  };
  return labels[String(value)] || String(value);
}

function statusType(row: AdminRow) {
  const value = String(row.status ?? (row.published === false ? "HIDDEN" : "PUBLISHED"));
  if (["ONLINE", "ACTIVE", "ONGOING", "PUBLISHED", "ADOPTED"].includes(value)) return "success" as const;
  if (["MAINTENANCE", "UPCOMING", "PENDING", "PROCESSING", "DRAFT"].includes(value)) return "warning" as const;
  if (["OFFLINE", "HIDDEN", "CLOSED", "PAUSED"].includes(value)) return "error" as const;
  return "info" as const;
}
</script>
