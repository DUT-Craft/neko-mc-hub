<template>
  <section class="admin-users">
    <div class="admin-page-intro">
      <div>
        <span class="admin-kicker">账号管理</span>
        <h2>用户账号</h2>
        <p>创建社团账号、调整角色和启用状态；被禁用的账号无法登录。</p>
      </div>
      <div class="admin-intro-actions">
        <NButton secondary :loading="loading" @click="$emit('refresh')">刷新</NButton>
        <NButton type="primary" @click="openCreate">新建账号</NButton>
      </div>
    </div>

    <div class="admin-toolbar">
      <NInput v-model:value="search" clearable placeholder="搜索用户名、昵称或邮箱" />
      <span class="admin-toolbar__count">共 {{ filteredUsers.length }} 个账号</span>
    </div>

    <NCard v-if="loading" class="admin-panel admin-loading" :bordered="false">
      <NSpin size="small" description="正在读取账号..." />
    </NCard>
    <NCard v-else-if="!filteredUsers.length" class="admin-panel admin-empty" :bordered="false">
      <NEmpty description="没有匹配的账号" />
    </NCard>
    <NList v-else class="admin-record-list" :bordered="false" :show-divider="false">
      <NListItem v-for="user in filteredUsers" :key="user.id" class="admin-record-card">
        <div class="admin-record-card__main">
          <div class="admin-record-card__title">
            <span class="admin-record-card__id">#{{ user.id }}</span>
            <h3>{{ user.displayName || user.username }}</h3>
            <NTag v-if="user.id === currentUserId" type="success" size="small" round>当前账号</NTag>
            <NTag :type="user.enabled ? (user.role === 'ADMIN' ? 'success' : 'info') : 'error'" size="small" round>
              {{ user.enabled ? (user.role === "ADMIN" ? "管理员" : "成员") : "已停用" }}
            </NTag>
          </div>
          <div class="admin-record-card__facts">
            <span><b>用户名</b>{{ user.username }}</span>
            <span><b>邮箱</b>{{ user.email }}</span>
            <span><b>来源</b>{{ authSourceLabel(user.authSource) }}</span>
            <span><b>创建时间</b>{{ formatDate(user.createdAt) }}</span>
          </div>
        </div>
        <template #suffix>
          <NSpace :size="6" wrap>
            <NButton secondary size="small" :disabled="saving" @click="openEdit(user)">编辑</NButton>
            <NButton v-if="user.enabled && user.id !== currentUserId" tertiary size="small" type="warning" :disabled="saving" @click="disableUser(user)">停用</NButton>
          </NSpace>
        </template>
      </NListItem>
    </NList>

    <NModal v-model:show="showEditor" preset="card" class="admin-editor-modal" :title="editingId ? '编辑账号' : '新建账号'">
      <NAlert v-if="editorError" type="error" :show-icon="false" class="admin-users-alert">{{ editorError }}</NAlert>
      <NForm label-placement="top" :show-feedback="false">
        <div class="admin-editor-grid">
          <NFormItem label="用户名" required>
            <NInput v-model:value="draft.username" placeholder="3-50 位字母、数字、点、下划线或连字符" :disabled="saving" />
          </NFormItem>
          <NFormItem label="邮箱" required>
            <NInput v-model:value="draft.email" placeholder="用于区分账号的有效邮箱" :disabled="saving" />
          </NFormItem>
          <NFormItem :label="editingId ? '重置密码（留空不修改）' : '密码'" :required="!editingId">
            <NInput v-model:value="draft.password" type="password" show-password-on="click" :placeholder="editingId ? '留空保持当前密码' : '至少 10 位'" :disabled="saving" />
          </NFormItem>
          <NFormItem label="显示昵称">
            <NInput v-model:value="draft.displayName" placeholder="玩家看到的称呼（可选）" :disabled="saving" />
          </NFormItem>
          <NFormItem label="角色" required>
            <NSelect v-model:value="draft.role" :options="roleOptions" :disabled="saving || editingId === currentUserId" />
            <small v-if="editingId === currentUserId" class="admin-field-help">当前登录账号不能移除自己的管理员权限</small>
          </NFormItem>
          <NFormItem label="启用">
            <NSwitch v-model:value="draft.enabled" :disabled="saving || editingId === currentUserId" />
          </NFormItem>
        </div>
      </NForm>
      <template #footer>
        <div class="admin-modal-footer">
          <NButton secondary :disabled="saving" @click="showEditor = false">取消</NButton>
          <NButton type="primary" :loading="saving" :disabled="!canSave" @click="submit">{{ editingId ? "保存修改" : "创建账号" }}</NButton>
        </div>
      </template>
    </NModal>
  </section>
</template>

<script setup lang="ts">
import {
  NAlert,
  NButton,
  NCard,
  NEmpty,
  NForm,
  NFormItem,
  NInput,
  NList,
  NListItem,
  NModal,
  NSelect,
  NSpace,
  NSpin,
  NSwitch,
  NTag
} from "naive-ui";

export interface AdminUserRow {
  id: number;
  username: string;
  email: string;
  role: string;
  authSource: string;
  displayName?: string | null;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

const props = defineProps<{ users: AdminUserRow[]; currentUserId?: number; loading: boolean; saving: boolean }>();
const emit = defineEmits<{ refresh: []; save: [payload: Record<string, unknown>, id: number | null, done: () => void]; disable: [user: AdminUserRow] }>();

const search = ref("");
const showEditor = ref(false);
const editingId = ref<number | null>(null);
const editorError = ref("");
const draft = reactive({
  username: "",
  email: "",
  password: "",
  displayName: "",
  role: "USER",
  enabled: true
});

const roleOptions = [
  { label: "成员", value: "USER" },
  { label: "管理员", value: "ADMIN" }
];

const filteredUsers = computed(() => {
  const query = search.value.trim().toLowerCase();
  if (!query) return props.users;
  return props.users.filter((user) =>
    [user.username, user.email, user.displayName || ""].some((field) => field.toLowerCase().includes(query))
  );
});

const canSave = computed(() => {
  if (!draft.username.trim() || !draft.email.trim()) return false;
  if (!editingId.value && draft.password.length < 10) return false;
  if (editingId.value && draft.password && draft.password.length < 10) return false;
  return true;
});

function openCreate() {
  editingId.value = null;
  editorError.value = "";
  Object.assign(draft, { username: "", email: "", password: "", displayName: "", role: "USER", enabled: true });
  showEditor.value = true;
}

function openEdit(user: AdminUserRow) {
  editingId.value = user.id;
  editorError.value = "";
  Object.assign(draft, {
    username: user.username,
    email: user.email,
    password: "",
    displayName: user.displayName || "",
    role: user.role,
    enabled: user.enabled
  });
  showEditor.value = true;
}

function submit() {
  if (!canSave.value || props.saving) return;
  editorError.value = "";
  const payload: Record<string, unknown> = {
    username: draft.username.trim(),
    email: draft.email.trim(),
    role: draft.role,
    displayName: draft.displayName.trim() || null,
    enabled: draft.enabled
  };
  if (draft.password) (payload as Record<string, unknown>).password = draft.password;
  emit("save", payload, editingId.value, () => { showEditor.value = false; });
}

function disableUser(user: AdminUserRow) {
  if (!window.confirm(`确定停用账号 ${user.username} 吗？停用后该账号将无法登录。`)) return;
  emit("disable", user);
}

function authSourceLabel(value: string) {
  return value === "BLESSING_SKIN" ? "皮肤站登录" : "本站账号";
}

function formatDate(value: string) {
  if (!value) return "未知";
  return new Date(value).toLocaleString("zh-CN", { dateStyle: "short", timeStyle: "short" });
}

function setError(message: string) { editorError.value = message; }
defineExpose({ setError });
</script>

<style scoped>
.admin-users { min-width: 0; display: grid; gap: 14px; }
.admin-users-alert { margin-bottom: 12px; }
</style>
