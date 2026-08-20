<template>
  <AdminShell
    :active-key="activeSection"
    :display-name="session.user.value?.displayName || session.user.value?.username || '管理员'"
    :pending-counts="pendingCounts"
    @logout="logout"
  >
    <NAlert v-if="errorMessage" type="error" :show-icon="false" class="admin-page-alert" closable @close="errorMessage = ''">{{ errorMessage }}</NAlert>

    <AdminOverview v-if="activeSection === 'overview'" :overview="overview" :loading="loadingOverview" @refresh="loadOverview" />

    <AdminResourceManager
      v-else-if="resourceDefinition"
      :definition="resourceDefinition"
      :rows="resourceRows[activeSection] || []"
      :loading="Boolean(resourceLoading[activeSection])"
      :saving="saving"
      @refresh="loadResource(activeSection)"
      @save="saveResource"
      @hide="hideResource"
      @delete-resource="deleteResource"
      @delete-draft="deleteDraft"
      @toggle-maintenance="toggleServerMaintenance"
      @refresh-status="refreshServerStatus"
    />

    <section v-else-if="activeSection === 'reviews'" class="admin-review-stack">
      <AdminReviewQueue
        title="申请审核"
        description="查看皮肤站、开服和值班申请，处理结果会保留在后台记录中。"
        :items="applicationReviewItems"
        :status-options="applicationOptions"
        :loading="reviewLoading"
        :saving="saving"
        note-label="管理员备注"
        @refresh="loadReviews"
        :on-save="(id, status, note) => saveReview('applications', id, status, note)"
      />
      <AdminReviewQueue
        title="项目建议审核"
        description="回复建议、标记采纳，或隐藏不再适合公开展示的内容。"
        :items="ideaReviewItems"
        :status-options="ideaOptions"
        :loading="reviewLoading"
        :saving="saving"
        note-label="公开回复"
        note-placeholder="这段文字会显示在建议详情中"
        @refresh="loadReviews"
        :on-save="(id, status, note) => saveReview('ideas', id, status, note)"
      />
    </section>

    <AdminReviewQueue
      v-else-if="activeSection === 'registrations'"
      title="活动报名"
      description="查看玩家填写的 Minecraft ID 和 QQ，确认或取消活动报名。"
      :items="registrationReviewItems"
      :status-options="registrationOptions"
      :loading="reviewLoading"
      :saving="saving"
      @refresh="loadReviews"
      :on-save="(id, status, note) => saveReview('registrations', id, status, note)"
    />

    <AdminReviewQueue
      v-else-if="activeSection === 'feedback'"
      title="私密反馈"
      description="只有管理员能看到这些内容；处理后可以留下内部备注。"
      :items="feedbackReviewItems"
      :status-options="feedbackOptions"
      :loading="reviewLoading"
      :saving="saving"
      note-label="内部备注"
      @refresh="loadReviews"
      :on-save="(id, status, note) => saveReview('feedback', id, status, note)"
    />

    <AdminUserManager
      v-else-if="activeSection === 'users'"
      ref="userManagerRef"
      :users="users"
      :current-user-id="session.user.value?.id"
      :loading="userLoading"
      :saving="saving"
      @refresh="loadUsers"
      @save="saveUser"
      @disable="disableUser"
    />

    <NResult v-else status="404" title="无法识别这个后台栏目" description="请从左侧重新选择。" />
  </AdminShell>
</template>

<script setup lang="ts">
import { NAlert, NResult, useMessage } from "naive-ui";
import AdminOverview from "~/components/admin/AdminOverview.vue";
import AdminResourceManager from "~/components/admin/AdminResourceManager.vue";
import AdminReviewQueue from "~/components/admin/AdminReviewQueue.vue";
import AdminShell from "~/components/admin/AdminShell.vue";
import AdminUserManager, { type AdminUserRow } from "~/components/admin/AdminUserManager.vue";
import { useAdminApi } from "~/composables/useAdminApi";
import { useAdminSession } from "~/composables/useAdminSession";
import type {
  AdminApplication,
  AdminAuditLog,
  AdminFeedback,
  AdminFieldOption,
  AdminIdea,
  AdminOverview as Overview,
  AdminRegistration,
  AdminResourceDefinition,
  AdminReviewItem,
  AdminRow
} from "~/types/admin";

definePageMeta({ middleware: "admin" });

const route = useRoute();
const message = useMessage();
const api = useAdminApi();
const session = useAdminSession();

const sections = ["overview", "servers", "activities", "announcements", "wiki", "history", "contacts", "reviews", "registrations", "feedback", "audit", "users"];
const activeSection = computed(() => {
  const value = typeof route.query.section === "string" ? route.query.section : "overview";
  return sections.includes(value) ? value : "overview";
});

const overview = ref<Overview>({ servers: 0, maintenanceServers: 0, pendingApplications: 0, pendingIdeas: 0, pendingRegistrations: 0, openFeedback: 0, publishedAnnouncements: 0 });
const loadingOverview = ref(false);
const reviewLoading = ref(false);
const saving = ref(false);
const errorMessage = ref("");
const resourceRows = reactive<Record<string, AdminRow[]>>({ servers: [], activities: [], announcements: [], wiki: [], history: [], contacts: [], audit: [] });
const resourceLoading = reactive<Record<string, boolean>>({});
const users = ref<AdminUserRow[]>([]);
const userLoading = ref(false);
const userManagerRef = ref<{ setError: (message: string) => void } | null>(null);

const applications = ref<AdminApplication[]>([]);
const ideas = ref<AdminIdea[]>([]);
const registrations = ref<AdminRegistration[]>([]);
const feedback = ref<AdminFeedback[]>([]);

const applicationOptions: AdminFieldOption[] = [
  { label: "待处理", value: "PENDING" }, { label: "已通过", value: "ADOPTED" }, { label: "未通过", value: "HIDDEN" }
];
const ideaOptions: AdminFieldOption[] = [
  { label: "待处理", value: "PENDING" }, { label: "已采纳", value: "ADOPTED" }, { label: "已隐藏", value: "HIDDEN" }
];
const registrationOptions: AdminFieldOption[] = [
  { label: "待处理", value: "PENDING" }, { label: "已确认", value: "CONFIRMED" }, { label: "已取消", value: "CANCELLED" }
];
const feedbackOptions: AdminFieldOption[] = [
  { label: "待处理", value: "OPEN" }, { label: "处理中", value: "PROCESSING" }, { label: "已关闭", value: "CLOSED" }
];

const resourceDefinitions: Record<string, AdminResourceDefinition> = {
  servers: {
    key: "servers", title: "服务器", description: "维护服务器名称、玩法、状态、地址和首页展示开关。", endpoint: "/api/admin/content/servers", dedicatedEditor: true,
    columns: [
      { key: "title", label: "服务器" }, { key: "status", label: "状态" },
      { key: "onlineCount", label: "在线人数", fallback: "0" }, { key: "capacity", label: "人数上限", fallback: "0" },
      { key: "maintenance", label: "人工维护", fallback: "否" }, { key: "lastCheckedAt", label: "最近检测", fallback: "尚未检测" }
    ],
    fields: []
  },
  activities: {
    key: "activities", title: "活动", description: "管理每周活动、长期项目和限时活动的展示内容。", endpoint: "/api/admin/content/activities", dedicatedEditor: true,
    columns: contentColumns("活动"),
    fields: []
  },
  announcements: {
    key: "announcements", title: "公告", description: "先保存草稿，确认内容后再切换为已发布。", endpoint: "/api/admin/content/announcements", dedicatedEditor: true,
    columns: contentColumns("公告"),
    fields: []
  },
  wiki: {
    key: "wiki", title: "Wiki", description: "维护入服指南、规则、启动器和整合包入口。", endpoint: "/api/admin/content/wiki", dedicatedEditor: true,
    columns: contentColumns("栏目"),
    fields: []
  },
  history: {
    key: "history", title: "历史活动", description: "整理活动照片、时间和记录内容，支持隐藏旧条目。", endpoint: "/api/admin/content/history", dedicatedEditor: true,
    columns: contentColumns("活动"),
    fields: []
  },
  contacts: {
    key: "contacts", title: "联系人", description: "维护公告页显示的值班、技术和活动联系人。", endpoint: "/api/admin/contacts",
    columns: [{ key: "name", label: "联系人" }, { key: "responsibilities", label: "负责事项" }, { key: "contact", label: "联系方式" }, { key: "published", label: "公开" }],
    fields: [text("slug", "唯一标识", 60), text("name", "称呼", 80), text("contact", "联系方式", 160), text("responsibilities", "负责事项", 255), number("sortOrder", "排序"), booleanField("published", "公开显示")]
  },
  audit: {
    key: "audit", title: "操作记录", description: "最近的发布、下线、审核和维护操作（最多显示 200 条），便于追踪后台变更。", endpoint: "/api/admin/audit-logs", readOnly: true,
    columns: [{ key: "resourceType", label: "对象" }, { key: "resourceId", label: "编号" }, { key: "action", label: "操作" }, { key: "operatorUserId", label: "操作者" }, { key: "createdAt", label: "时间" }], fields: []
  }
};

const resourceDefinition = computed(() => resourceDefinitions[activeSection.value]);
const pendingCounts = computed(() => ({
  reviews: overview.value.pendingApplications + overview.value.pendingIdeas,
  registrations: overview.value.pendingRegistrations,
  feedback: overview.value.openFeedback
}));
const applicationReviewItems = computed(() => applications.value.map((item) => ({ id: item.id, title: `${applicationKindLabel(item.kind)} · ${item.name}`, person: `QQ ${item.qq}${item.minecraftId ? ` · MC ${item.minecraftId}` : ""}`, detail: [item.reason, item.purpose, item.expectedTime, item.availableTime, item.skill].filter(Boolean).join(" / ") || "未填写补充说明", privateDetail: [item.studentId ? `学号：${item.studentId}` : "", item.requirements ? `需求：${item.requirements}` : ""].filter(Boolean).join("\n"), createdAt: item.createdAt, status: item.status, note: item.adminNote })) as AdminReviewItem[]);
const ideaReviewItems = computed(() => ideas.value.map((item) => ({ id: item.id, title: item.title, person: item.nickname, detail: item.description, createdAt: item.createdAt, status: item.status, note: item.publicReply })) as AdminReviewItem[]);
const registrationReviewItems = computed(() => registrations.value.map((item) => ({ id: item.id, title: `活动报名 · ${item.activitySlug}`, person: `MC ${item.minecraftId} · QQ ${item.qq}`, detail: "玩家已提交活动报名，请确认名额和活动安排。", createdAt: item.createdAt, status: item.status, note: item.adminNote })) as AdminReviewItem[]);
const feedbackReviewItems = computed(() => feedback.value.map((item) => ({ id: item.id, title: "私密反馈", person: item.userId ? `玩家 #${item.userId}` : "未关联玩家", detail: item.body, privateDetail: item.body, createdAt: item.createdAt, status: item.status, note: item.adminNote })) as AdminReviewItem[]);

onMounted(() => {
  const tasks: Promise<void>[] = [loadOverview()];
  if (activeSection.value !== "overview") tasks.push(loadActiveSection(activeSection.value));
  void Promise.all(tasks);
});

watch(activeSection, (section) => {
  void loadActiveSection(section);
});

function loadActiveSection(section: string): Promise<void> {
  if (section === "overview") return loadOverview();
  if (section === "users") return loadUsers();
  if (resourceDefinitions[section]) return loadResource(section);
  if (["reviews", "registrations", "feedback"].includes(section)) return loadReviews(section);
  return Promise.resolve();
}

async function loadUsers() {
  clearError();
  userLoading.value = true;
  try { users.value = await api.request<AdminUserRow[]>("/api/users"); }
  catch (error) { setError(error); }
  finally { userLoading.value = false; }
}

async function saveUser(payload: Record<string, unknown>, id: number | null, done: () => void) {
  clearError();
  saving.value = true;
  try {
    await api.request(id === null ? "/api/users/Register" : `/api/users/${id}`, {
      method: id === null ? "POST" : "PUT",
      body: payload
    });
    message.success(id === null ? "账号已创建" : "账号已更新");
    await loadUsers();
    done();
  } catch (error) {
    setError(error);
    userManagerRef.value?.setError(errorMessage.value);
    message.error(errorMessage.value);
  } finally { saving.value = false; }
}

async function disableUser(user: AdminUserRow) {
  clearError();
  saving.value = true;
  try {
    await api.request(`/api/users/${user.id}`, { method: "DELETE" });
    message.success("账号已停用");
    await loadUsers();
  } catch (error) { setError(error); } finally { saving.value = false; }
}

async function loadOverview() {
  clearError();
  loadingOverview.value = true;
  try { overview.value = await api.request<Overview>("/api/admin/overview"); } catch (error) { setError(error); } finally { loadingOverview.value = false; }
}

async function loadResource(key: string) {
  const definition = resourceDefinitions[key];
  if (!definition) return;
  clearError();
  resourceLoading[key] = true;
  try {
    const rows = await api.request<AdminRow[]>(definition.endpoint);
    resourceRows[key] = key === "audit" ? rows.map(localizeAuditRow) : rows;
  } catch (error) { setError(error); } finally { resourceLoading[key] = false; }
}

const auditResourceLabels: Record<string, string> = {
  SERVER: "服务器", ACTIVITY: "活动", ANNOUNCEMENT: "公告", WIKI: "Wiki", HISTORY: "历史活动",
  CONTACT: "联系人", IDEA: "建议", APPLICATION: "申请", FEEDBACK: "反馈", REGISTRATION: "报名", USER: "用户", MEDIA: "图片"
};
const auditActionLabels: Record<string, string> = {
  PUBLISH: "发布", UNPUBLISH: "下线", RESTORE_PREVIOUS: "恢复上一版本", DELETE: "永久删除",
  DRAFT_CREATE: "创建草稿", DRAFT_DELETE: "删除草稿",
  MEDIA_UPLOAD: "上传图片", MEDIA_UPDATE: "更新图片", MEDIA_DELETE: "删除图片",
  MODERATE_PENDING: "标记待处理", MODERATE_ADOPTED: "通过 / 采纳", MODERATE_HIDDEN: "驳回 / 隐藏",
  MODERATE_OPEN: "标记待处理", MODERATE_PROCESSING: "标记处理中", MODERATE_CLOSED: "关闭反馈",
  MODERATE_CONFIRMED: "确认报名", MODERATE_CANCELLED: "取消报名",
  STATUS_REFRESH: "刷新状态", MAINTENANCE_START: "开始维护", MAINTENANCE_END: "结束维护",
  CREATE: "新建", UPDATE: "更新"
};

function localizeAuditRow(row: AdminRow): AdminRow {
  const type = String(row.resourceType || "");
  const action = String(row.action || "");
  return {
    ...row,
    resourceType: auditResourceLabels[type] || type,
    action: auditActionLabels[action] || action,
    createdAt: row.createdAt ? new Date(String(row.createdAt)).toLocaleString("zh-CN", { dateStyle: "short", timeStyle: "medium" }) : ""
  };
}

async function loadReviews(section = activeSection.value) {
  clearError();
  reviewLoading.value = true;
  try {
    if (section === "reviews") {
      const [applicationData, ideaData] = await Promise.all([
        api.request<AdminApplication[]>("/api/admin/applications"),
        api.request<AdminIdea[]>("/api/admin/ideas")
      ]);
      applications.value = applicationData;
      ideas.value = ideaData;
    } else if (section === "registrations") {
      registrations.value = await api.request<AdminRegistration[]>("/api/admin/registrations");
    } else if (section === "feedback") {
      feedback.value = await api.request<AdminFeedback[]>("/api/admin/feedback");
    }
  } catch (error) { setError(error); } finally { reviewLoading.value = false; }
}

async function saveResource(row: AdminRow, isNew: boolean, done: () => void) {
  const definition = resourceDefinitions[activeSection.value];
  if (!definition || definition.readOnly) return;
  clearError();
  saving.value = true;
  try {
    const payload = cleanPayload(row);
    await api.request(isNew ? definition.endpoint : `${definition.endpoint}/${row.id}`, { method: isNew ? "POST" : "PUT", body: payload });
    message.success("内容已保存");
    await loadResource(activeSection.value);
    done();
  } catch (error) {
    setError(error);
    message.error(errorMessage.value);
  } finally { saving.value = false; }
}

async function hideResource(row: AdminRow) {
  const definition = resourceDefinitions[activeSection.value];
  if (!definition || row.id === undefined || !window.confirm("确定将这条内容下线吗？下线后仍可在后台恢复。")) return;
  clearError();
  saving.value = true;
  try {
    const path = definition.dedicatedEditor
      ? `/api/admin/content/${definition.key}/${row.id}/unpublish`
      : `${definition.endpoint}/${row.id}`;
    await api.request(path, { method: definition.dedicatedEditor ? "POST" : "DELETE" });
    message.success("内容已下线");
    await loadResource(activeSection.value);
  } catch (error) { setError(error); } finally { saving.value = false; }
}

async function deleteDraft(row: AdminRow) {
  if (typeof row.draftId !== "string" || !window.confirm("确定删除这份未发布草稿吗？草稿中的新图片也会进入回收站。")) return;
  clearError();
  saving.value = true;
  try {
    await api.request(`/api/admin/content/drafts/${row.draftId}`, { method: "DELETE" });
    message.success("草稿已删除");
    await loadResource(activeSection.value);
  } catch (error) { setError(error); } finally { saving.value = false; }
}

async function deleteResource(row: AdminRow) {
  const definition = resourceDefinitions[activeSection.value];
  if (!definition?.dedicatedEditor || row.id === null || row.id === undefined) return;
  if (!window.confirm("确定永久删除这条已下线内容吗？草稿、上一版本和关联图片也会被清理，此操作无法恢复。")) return;
  clearError();
  saving.value = true;
  try {
    await api.request(`/api/admin/content/${definition.key}/${row.id}/permanent`, { method: "DELETE" });
    message.success("内容已永久删除");
    await Promise.all([loadResource(activeSection.value), loadOverview()]);
  } catch (error) { setError(error); } finally { saving.value = false; }
}

async function toggleServerMaintenance(row: AdminRow) {
  if (row.id === null || row.id === undefined) return;
  const maintenance = !Boolean(row.maintenance);
  const action = maintenance ? "进入维护" : "结束维护";
  if (!window.confirm(`确定让这台服务器${action}吗？这个操作会立即生效。`)) return;
  clearError();
  saving.value = true;
  try {
    await api.request(`/api/admin/servers/${row.id}/maintenance`, { method: "PATCH", body: { maintenance } });
    message.success(`服务器已${action}`);
    await Promise.all([loadResource("servers"), loadOverview()]);
  } catch (error) { setError(error); } finally { saving.value = false; }
}

async function refreshServerStatus(row: AdminRow) {
  if (row.id === null || row.id === undefined) return;
  clearError();
  saving.value = true;
  try {
    await api.request(`/api/admin/servers/${row.id}/refresh`, { method: "POST" });
    message.success("服务器状态已检测");
    await loadResource("servers");
  } catch (error) { setError(error); } finally { saving.value = false; }
}

async function saveReview(kind: "applications" | "ideas" | "registrations" | "feedback", id: number, status: string, note: string): Promise<boolean> {
  clearError();
  saving.value = true;
  try {
    await api.request(`/api/admin/${kind}/${id}`, { method: "PATCH", body: { status, note: note.trim() || null } });
    message.success("处理结果已保存");
    await Promise.all([loadReviews(), loadOverview()]);
    return true;
  } catch (error) {
    setError(error);
    message.error(errorMessage.value);
    return false;
  } finally { saving.value = false; }
}

async function logout() { await session.logout(); await navigateTo("/admin/login"); }

function cleanPayload(row: AdminRow) {
  const payload = { ...row } as Record<string, unknown>;
  delete payload.id;
  for (const key of ["publishedAt", "happenedAt", "imageUrl", "linkUrl"]) if (payload[key] === "") payload[key] = null;
  return payload;
}

function setError(error: unknown) {
  if (error && typeof error === "object") {
    const item = error as { data?: { message?: string }; message?: string };
    errorMessage.value = item.data?.message || item.message || "请求失败，请确认后端服务正在运行";
  } else errorMessage.value = "请求失败，请确认后端服务正在运行";
}

function clearError() { errorMessage.value = ""; }

function applicationKindLabel(value: string) { return ({ SKIN: "皮肤站邀请码", SERVER: "开服申请", DUTY: "值班申请" } as Record<string, string>)[value] || value; }
function text(key: string, label: string, maxLength: number) { return { key, label, type: "text" as const, required: true, maxLength }; }
function number(key: string, label: string) { return { key, label, type: "number" as const }; }
function booleanField(key: string, label: string) { return { key, label, type: "boolean" as const }; }
function contentColumns(firstLabel: string) { return [{ key: "title", label: firstLabel }, { key: "slug", label: "标识", fallback: "尚未填写" }, { key: "status", label: "状态" }, { key: "updatedAt", label: "更新时间" }]; }

useHead({ title: "管理员后台 - 猫娘社 MC 主站" });
</script>
