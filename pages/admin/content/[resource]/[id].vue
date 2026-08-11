<template>
  <AdminShell
    :active-key="resource"
    :display-name="session.user.value?.displayName || session.user.value?.username || '管理员'"
    :pending-count="0"
    @logout="logout"
  >
    <section class="admin-content-editor">
      <div class="admin-page-intro">
        <div>
          <span class="admin-kicker">内容编辑</span>
          <h2>{{ meta.title }}</h2>
          <p>{{ isNew ? "创建一份新的草稿，发布前不会影响主站。" : "修改只保存到草稿，确认预览后再发布。" }}</p>
        </div>
        <NSpace wrap>
          <NButton secondary @click="goBack">返回列表</NButton>
          <NTag :type="dirty ? 'warning' : 'success'" round>{{ dirty ? "有未保存修改" : "草稿已保存" }}</NTag>
        </NSpace>
      </div>

      <NAlert v-if="errorMessage" type="error" :show-icon="false" closable @close="errorMessage = ''">{{ errorMessage }}</NAlert>

      <div v-if="loading" class="admin-editor-loading"><NSpin size="small" description="正在读取草稿..." /></div>
      <template v-else-if="draft">
        <div class="admin-editor-layout">
          <NCard class="admin-panel" :bordered="false">
            <div class="admin-panel__heading admin-editor-section-heading">
              <h3>基本信息</h3>
              <p>这些内容用于列表、搜索和首页摘要，正文在下方文档编辑器中填写。</p>
            </div>
            <NForm label-placement="top">
              <div class="admin-editor-grid">
                <NFormItem v-for="field in meta.fields" :key="field.key" :label="field.label" :class="{ 'admin-field--full': field.full }" :required="field.required">
                  <NInput v-if="field.type === 'text'" v-model:value="payload[field.key]" :disabled="busy" :placeholder="field.placeholder" :maxlength="field.maxLength" :show-count="Boolean(field.maxLength)" @update:value="handleFieldUpdate(field.key)" />
                  <NInput v-else-if="field.type === 'textarea'" v-model:value="payload[field.key]" :disabled="busy" type="textarea" :autosize="{ minRows: 3, maxRows: 8 }" :maxlength="field.maxLength" :show-count="Boolean(field.maxLength)" @update:value="handleFieldUpdate(field.key)" />
                  <NInputNumber v-else-if="field.type === 'number'" v-model:value="payload[field.key]" :disabled="busy" class="admin-field-control" @update:value="handleFieldUpdate(field.key)" />
                  <NSelect v-else-if="field.type === 'select'" v-model:value="payload[field.key]" :disabled="busy" :options="fieldOptions(field.key, field.options)" @update:value="handleFieldUpdate(field.key)" />
                  <NSwitch v-else-if="field.type === 'boolean'" v-model:value="payload[field.key]" :disabled="busy" @update:value="handleFieldUpdate(field.key)" />
                </NFormItem>
              </div>
            </NForm>

            <div v-if="meta.cover" class="admin-media-picker">
              <div class="admin-panel__heading"><span class="admin-kicker">封面图片</span><h3>当前内容封面</h3></div>
              <div v-if="coverMedia" class="admin-media-preview"><img :src="coverMedia.url" alt="当前封面预览" /><NButton tertiary type="error" size="small" :disabled="busy" @click="clearCover">移除封面</NButton></div>
              <NButton v-else secondary :disabled="busy" @click="openFilePicker('COVER')">上传 16:9 封面</NButton>
            </div>

            <div v-if="meta.icon" class="admin-media-picker">
              <div class="admin-panel__heading"><span class="admin-kicker">图标</span><h3>选择图标</h3></div>
              <div v-if="iconMedia" class="admin-media-preview admin-media-preview--icon">
                <img :src="iconMedia.url" alt="当前自定义图标预览" />
                <NButton tertiary type="warning" size="small" :disabled="busy" @click="clearIcon">改用内置图标</NButton>
              </div>
              <div class="admin-icon-grid">
                <button v-for="icon in iconOptions" :key="icon" type="button" :disabled="busy" :class="{ 'is-selected': payload.icon === icon && !payload.iconMediaId }" @click="selectBuiltinIcon(icon)">
                  <img :src="minecraftIconUrl(icon)" alt="" /><span>{{ icon }}</span>
                </button>
              </div>
              <NButton secondary :disabled="busy" @click="openFilePicker('ICON')">上传自定义图标</NButton>
            </div>

            <AdminWordEditor
              v-if="meta.blocks !== false"
              ref="wordEditorRef"
              v-model="payload.blocks"
              :disabled="busy"
              @change="markDirty"
              @request-image="openFilePicker('CONTENT')"
            />
          </NCard>

          <NCard class="admin-panel admin-live-preview" :bordered="false">
            <div class="admin-panel__heading">
              <span class="admin-kicker">玩家端正文预览</span>
              <h3>{{ payload.title || payload.name || "未命名内容" }}</h3>
              <p>这里使用与发布后相同的网站文档样式。</p>
            </div>
            <div v-if="coverMedia" class="admin-preview-cover"><img :src="coverMedia.url" alt="封面预览" /></div>
            <p class="admin-preview-summary">{{ payload.summary || payload.description || payload.meta || "暂无摘要" }}</p>
            <ContentBlocksRenderer v-if="meta.blocks !== false" :blocks="normalizedBlocks" />
          </NCard>
        </div>

        <div class="admin-editor-actions">
          <NSpace wrap>
            <NButton secondary :loading="saving" :disabled="busy" @click="saveDraft()">保存草稿</NButton>
            <NButton type="primary" :loading="publishing" :disabled="busy" @click="publishDraft">发布到主站</NButton>
            <NButton v-if="draft.hasPreviousVersion && draft.resourceId" secondary :loading="publishing" :disabled="busy" @click="restorePrevious">恢复上一版本</NButton>
            <NButton v-if="draft.resourceId" tertiary type="warning" :loading="publishing" :disabled="busy" @click="unpublish">下线</NButton>
            <NButton tertiary type="error" :loading="saving" :disabled="busy" @click="deleteDraft">删除草稿</NButton>
          </NSpace>
          <span>草稿版本 {{ draft.version }} · 最近保存 {{ formatDate(draft.updatedAt) }}</span>
        </div>
      </template>
    </section>
    <AdminImageCropper
      v-model:show="cropperVisible"
      :file="cropperFile"
      :aspect-ratio="cropperAspectRatio"
      :output-type="cropperOutputType"
      :title="cropperPurpose === 'ICON' ? '调整 1:1 图标' : '调整 16:9 封面'"
      @confirm="handleCroppedFile"
      @cancel="cropperFile = null"
    />
    <input ref="fileInput" class="admin-hidden-file" type="file" accept="image/jpeg,image/png,image/webp" @change="handleFile" />
  </AdminShell>
</template>

<script setup lang="ts">
import { NAlert, NButton, NCard, NForm, NFormItem, NInput, NInputNumber, NSelect, NSpace, NSpin, NSwitch, NTag, useMessage } from "naive-ui";
import AdminShell from "~/components/admin/AdminShell.vue";
import AdminWordEditor from "~/components/admin/AdminWordEditor.vue";
import ContentBlocksRenderer from "~/components/ContentBlocksRenderer.vue";
import AdminImageCropper from "~/components/admin/AdminImageCropper.vue";
import { useAdminApi } from "~/composables/useAdminApi";
import { useAdminSession } from "~/composables/useAdminSession";
import { minecraftIconUrl } from "~/utils/minecraftIcons";
import type { AdminDraft, AdminMedia, AdminFieldOption } from "~/types/admin";

definePageMeta({ middleware: "admin" });

const route = useRoute();
const api = useAdminApi();
const session = useAdminSession();
const message = useMessage();
const router = useRouter();
const resource = String(route.params.resource || "");
const recordId = String(route.params.id || "new");
const isNew = ref(recordId === "new");
const draft = ref<AdminDraft | null>(null);
const payload = reactive<Record<string, any>>({ blocks: [] });
const loading = ref(true);
const saving = ref(false);
const publishing = ref(false);
const dirty = ref(false);
const editRevision = ref(0);
const errorMessage = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const uploadPurpose = ref("CONTENT");
const cropperVisible = ref(false);
const cropperFile = ref<File | null>(null);
const cropperPurpose = ref("COVER");
const uploading = ref(false);
const serverOptions = ref<AdminFieldOption[]>([]);
const wordEditorRef = ref<InstanceType<typeof AdminWordEditor> | null>(null);
const busy = computed(() => saving.value || publishing.value || uploading.value);

const iconOptions = ["server", "event", "lobby", "adventure", "redstone", "build", "resource", "pack", "wiki", "guide", "rules", "history", "announce", "apply"];
const select = (options: AdminFieldOption[]) => options;
function selectOptions(options?: AdminFieldOption[]) { return (options || []) as any[]; }
function fieldOptions(key: string, options?: AdminFieldOption[]) {
  return key === "serverSlug" ? serverOptions.value : selectOptions(options);
}
interface ContentField {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  full?: boolean;
  placeholder?: string;
  maxLength?: number;
  options?: AdminFieldOption[];
}

const metaMap: Record<string, { title: string; icon?: boolean; cover?: boolean; blocks?: boolean; fields: ContentField[] }> = {
  servers: { title: "服务器", icon: true, blocks: false, fields: [
    { key: "slug", label: "唯一标识", type: "text", required: true, maxLength: 50 }, { key: "name", label: "名称", type: "text", required: true, maxLength: 100 }, { key: "gameplay", label: "玩法类型", type: "text", required: true, maxLength: 160 },
    { key: "category", label: "分类", type: "select", required: true, options: select([{ label: "常驻服", value: "PERMANENT" }, { label: "活动服", value: "ACTIVITY" }]) },
    { key: "address", label: "服务器地址", type: "text", required: true, maxLength: 255 }, { key: "version", label: "版本", type: "text", required: true, maxLength: 80 }, { key: "pack", label: "整合包说明", type: "text", maxLength: 255 },
    { key: "description", label: "简介", type: "textarea", full: true, maxLength: 50000 }, { key: "rules", label: "规则", type: "textarea", full: true, maxLength: 50000 },
    { key: "featured", label: "首页优先", type: "boolean" }
  ] },
  activities: { title: "活动", icon: true, cover: true, fields: [
    { key: "slug", label: "唯一标识", type: "text", required: true, maxLength: 80 }, { key: "name", label: "名称", type: "text", required: true, maxLength: 140 },
    { key: "kind", label: "活动类型", type: "select", required: true, options: select([{ label: "每周活动", value: "WEEKLY" }, { label: "长期项目", value: "LONG_TERM" }, { label: "限时活动", value: "LIMITED" }]) },
    { key: "status", label: "状态", type: "select", required: true, options: select([{ label: "进行中", value: "ACTIVE" }, { label: "即将开始", value: "UPCOMING" }, { label: "长期进行", value: "ONGOING" }, { label: "暂停", value: "PAUSED" }]) },
    { key: "statusLabel", label: "状态文字", type: "text", maxLength: 60 }, { key: "serverSlug", label: "关联服务器", type: "select", required: true }, { key: "timeText", label: "时间", type: "text", required: true, maxLength: 255 }, { key: "participation", label: "参与方式", type: "text", required: true, maxLength: 255 },
    { key: "description", label: "简介", type: "textarea", required: true, full: true, maxLength: 50000 }, { key: "requiresPack", label: "需要整合包", type: "boolean" }, { key: "priority", label: "排序优先级", type: "number" }
  ] },
  announcements: { title: "公告", cover: true, fields: [
    { key: "slug", label: "唯一标识", type: "text", required: true, maxLength: 80 }, { key: "title", label: "标题", type: "text", required: true, maxLength: 180 }, { key: "category", label: "分类标识", type: "text", maxLength: 30 }, { key: "categoryLabel", label: "分类名称", type: "text", maxLength: 80 },
    { key: "summary", label: "摘要", type: "textarea", required: true, full: true, maxLength: 500 }, { key: "priority", label: "排序优先级", type: "number" }, { key: "pinned", label: "置顶", type: "boolean" }
  ] },
  wiki: { title: "Wiki", icon: true, fields: [
    { key: "slug", label: "唯一标识", type: "text", required: true, maxLength: 80 }, { key: "title", label: "标题", type: "text", required: true, maxLength: 140 }, { key: "summary", label: "摘要", type: "textarea", required: true, full: true, maxLength: 255 },
    { key: "groupName", label: "分组名称", type: "text", maxLength: 80 }, { key: "linkUrl", label: "相关链接", type: "text", maxLength: 500 }, { key: "sortOrder", label: "排序", type: "number" }
  ] },
  history: { title: "历史活动", cover: true, fields: [
    { key: "slug", label: "唯一标识", type: "text", required: true, maxLength: 80 }, { key: "title", label: "标题", type: "text", required: true, maxLength: 160 }, { key: "meta", label: "时间与服务器", type: "text", required: true, maxLength: 255 },
    { key: "altText", label: "封面说明", type: "text", required: true, maxLength: 255 }, { key: "happenedAt", label: "发生时间", type: "text", placeholder: "ISO 时间，可留空" }, { key: "featured", label: "精选展示", type: "boolean" }
  ] }
};
const meta = computed(() => metaMap[resource] || { title: "内容", fields: [] });
const normalizedBlocks = computed(() => (payload.blocks || []).map((block: any) => ({ ...block, items: block.items || String(block.itemsText || "").split("\n").map((item) => item.trim()).filter(Boolean) })));
const coverMedia = computed<AdminMedia | undefined>(() => draft.value?.media.find((item) => item.id === payload.coverMediaId));
const iconMedia = computed<AdminMedia | undefined>(() => draft.value?.media.find((item) => item.id === payload.iconMediaId));
const cropperAspectRatio = computed(() => cropperPurpose.value === "ICON" ? 1 : 16 / 9);
const cropperOutputType = computed(() => cropperPurpose.value === "ICON" ? "image/png" as const : "image/jpeg" as const);

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
  void loadDraft();
});
onBeforeUnmount(() => window.removeEventListener("beforeunload", handleBeforeUnload));
onBeforeRouteLeave(() => {
  if (dirty.value && !window.confirm("还有未保存的修改，确定离开吗？")) return false;
});

function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (!dirty.value) return;
  event.preventDefault();
  event.returnValue = "";
}

async function loadDraft() {
  if (!metaMap[resource]) { errorMessage.value = "不支持的内容类型"; loading.value = false; return; }
  try {
    if (resource === "activities") await loadServerOptions();
    const draftRouteId = recordId.startsWith("draft-") ? recordId.slice(6) : null;
    const data = draftRouteId
      ? await api.request<AdminDraft>(`/api/admin/content/drafts/${draftRouteId}`)
      : isNew.value
        ? await api.request<AdminDraft>(`/api/admin/content/${resource}/drafts`, { method: "POST", body: {} })
        : await api.request<AdminDraft>(`/api/admin/content/${resource}/${recordId}/draft`, { method: "POST" });
    draft.value = data;
    replacePayload(data.payload);
    if (isNew.value) {
      isNew.value = false;
      await router.replace(`/admin/content/${resource}/draft-${data.id}`);
    }
  } catch (error) { setError(error); } finally { loading.value = false; }
}

async function loadServerOptions() {
  const rows = await api.request<Array<{ id?: number | null; slug?: string; title?: string }>>("/api/admin/content/servers");
  const seen = new Set<string>();
  serverOptions.value = rows.flatMap((row) => {
    const slug = String(row.slug || "").trim();
    if (row.id == null || !slug || seen.has(slug)) return [];
    seen.add(slug);
    return [{ label: `${row.title || slug} (${slug})`, value: slug }];
  });
}

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)); }
function replacePayload(value: Record<string, any>) {
  Object.keys(payload).forEach((key) => delete payload[key]);
  Object.assign(payload, clone(value));
  payload.blocks = (payload.blocks || []).map(normalizeBlock);
}
function normalizeBlock(block: any) {
  const items = Array.isArray(block.items) ? block.items : [];
  const normalized = { id: block.id || crypto.randomUUID(), ...block };
  if (["bulletList", "stepList"].includes(block.type)) {
    normalized.items = items;
    normalized.itemsText = items.every((item: unknown) => typeof item === "string") ? items.join("\n") : block.itemsText || "";
  } else if (block.type === "gallery") {
    normalized.items = items;
    delete normalized.itemsText;
  } else {
    delete normalized.items;
    delete normalized.itemsText;
  }
  return normalized;
}
function markDirty() {
  editRevision.value += 1;
  dirty.value = true;
}
function handleFieldUpdate(key: string) {
  if (resource === "activities" && key === "status") {
    payload.statusLabel = ({ ACTIVE: "进行中", UPCOMING: "即将开始", ONGOING: "长期进行", PAUSED: "暂停" } as Record<string, string>)[payload.status] || payload.statusLabel;
  }
  markDirty();
}
function selectBuiltinIcon(icon: string) { payload.icon = icon; payload.iconMediaId = null; markDirty(); }
function clearIcon() { payload.iconMediaId = null; markDirty(); }
function blockLabel(type: string) {
  const labels: Record<string, string> = {
    paragraph: "段落", heading: "标题", bulletList: "项目列表", stepList: "编号列表",
    image: "图片", callout: "引用", code: "代码", link: "链接", action: "操作按钮", gallery: "画廊"
  };
  return labels[type] || "正文内容";
}

function openFilePicker(purpose: string) {
  if (busy.value) return;
  uploadPurpose.value = purpose;
  fileInput.value?.click();
}
async function handleFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file || !draft.value) return;
  (event.target as HTMLInputElement).value = "";
  if (uploadPurpose.value === "COVER" || uploadPurpose.value === "ICON") {
    cropperPurpose.value = uploadPurpose.value;
    cropperFile.value = file;
    cropperVisible.value = true;
    return;
  }
  await uploadFile(file);
}

async function handleCroppedFile(file: File) {
  cropperFile.value = null;
  cropperVisible.value = false;
  await uploadFile(file);
}

async function uploadFile(file: File) {
  if (!draft.value) return;
  uploading.value = true;
  const form = new FormData(); form.append("file", file);
  const query = new URLSearchParams({ purpose: uploadPurpose.value });
  if (uploadPurpose.value === "COVER") query.set("altText", String(payload.altText || "内容封面"));
  try {
    const media = await api.upload<AdminMedia>(`/api/admin/content/drafts/${draft.value.id}/media?${query.toString()}`, form);
    draft.value.media.push(media);
    if (uploadPurpose.value === "COVER") payload.coverMediaId = media.id;
    else if (uploadPurpose.value === "ICON") payload.iconMediaId = media.id;
    else if (uploadPurpose.value === "CONTENT") wordEditorRef.value?.insertImage(media);
    markDirty(); message.success("图片已加入当前草稿");
  } catch (error) { setError(error); } finally { uploading.value = false; }
}

function clearCover() { payload.coverMediaId = null; markDirty(); }
function preparedPayload() {
  const value = clone(payload);
  value.blocks = (value.blocks || []).map((block: Record<string, any>) => {
    const cleaned = { ...block };
    delete cleaned.itemsText;
    if (!["bulletList", "stepList", "gallery"].includes(String(cleaned.type))) delete cleaned.items;
    return cleaned;
  });
  return value;
}

function validationError(requireComplete: boolean): string {
  for (const field of meta.value.fields) {
    const value = String(payload[field.key] ?? "").trim();
    if (requireComplete && field.required && !value) return `请填写${field.label}`;
    if (field.maxLength && value.length > field.maxLength) return `${field.label}不能超过 ${field.maxLength} 个字符`;
  }
  const slug = String(payload.slug || "").trim();
  if (slug && !/^[a-z0-9][a-z0-9-]*$/.test(slug)) return "唯一标识只能使用小写字母、数字和连字符";
  const happenedAt = String(payload.happenedAt || "").trim();
  if (happenedAt && (!/^\d{4}-\d{2}-\d{2}T.+(?:Z|[+-]\d{2}:\d{2})$/.test(happenedAt) || Number.isNaN(Date.parse(happenedAt)))) {
    return "发生时间必须填写带时区的 ISO 时间";
  }
  const linkUrlError = urlError(String(payload.linkUrl || ""));
  if (linkUrlError) return linkUrlError;

  const blocks = Array.isArray(payload.blocks) ? payload.blocks : [];
  if (blocks.length > 200) return "正文最多包含 200 个内容块";
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const label = `第 ${index + 1} 个${blockLabel(block.type)}`;
    if (String(block.text || "").length > 50000) return `${label}内容不能超过 50000 个字符`;
    if (String(block.label || "").length > 200) return `${label}显示文字不能超过 200 个字符`;
    if (String(block.url || "").length > 500) return `${label}链接不能超过 500 个字符`;
    const blockUrlError = urlError(String(block.url || ""));
    if (blockUrlError) return `${label}：${blockUrlError}`;
    if (["bulletList", "stepList"].includes(block.type)) {
      const items = Array.isArray(block.items) ? block.items : [];
      if (items.length > 100) return `${label}最多包含 100 项`;
      if (items.some((item: unknown) => listItemText(item).length > 1000)) return `${label}中每项不能超过 1000 个字符`;
    }
    if (block.type === "image" && requireComplete) {
      if (!block.mediaId || !String(block.src || "").trim()) return `${label}尚未上传图片`;
      if (!String(block.alt || "").trim()) return `${label}必须填写图片替代文字`;
    }
    if (block.type === "gallery") {
      const items = Array.isArray(block.items) ? block.items : [];
      if (items.length > 24) return `${label}最多包含 24 张图片`;
      if (requireComplete && !items.length) return `${label}不能为空`;
      if (requireComplete && items.some((item: any) => !item.mediaId || !String(item.src || "").trim())) return `${label}中存在未上传的图片`;
      if (requireComplete && items.some((item: any) => !String(item.alt || "").trim())) return `${label}中的每张图片都必须填写替代文字`;
    }
  }
  return "";
}

function listItemText(item: unknown): string {
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object") return "";
  const candidate = item as { text?: string; content?: Array<{ type?: string; text?: string }> };
  if (candidate.text) return candidate.text;
  return (candidate.content || []).map((node) => node.type === "hardBreak" ? "\n" : node.text || "").join("");
}

function urlError(value: string): string {
  const url = value.trim();
  if (!url) return "";
  if (url.startsWith("https://") || url.startsWith("http://") || (url.startsWith("/") && !url.startsWith("//"))) return "";
  return "链接只允许使用 http、https 或站内路径";
}

async function saveDraft(showSuccess = true): Promise<boolean> {
  if (!draft.value || saving.value) return false;
  const invalid = validationError(false);
  if (invalid) { errorMessage.value = invalid; message.error(invalid); return false; }
  const revisionAtStart = editRevision.value;
  const payloadAtStart = preparedPayload();
  saving.value = true;
  try {
    const savedDraft = await api.request<AdminDraft>(`/api/admin/content/drafts/${draft.value.id}`, { method: "PUT", body: { version: draft.value.version, payload: payloadAtStart } });
    draft.value = savedDraft;
    const fullySaved = editRevision.value === revisionAtStart;
    if (fullySaved) {
      replacePayload(savedDraft.payload);
      dirty.value = false;
    }
    errorMessage.value = "";
    if (showSuccess) {
      if (fullySaved) message.success("草稿已保存");
      else message.warning("草稿已保存，但保存期间又有新修改，请再次保存");
    }
    return fullySaved;
  } catch (error) {
    setError(error);
    return false;
  } finally { saving.value = false; }
}
async function publishDraft() {
  if (!draft.value || publishing.value || saving.value) return;
  const invalid = validationError(true);
  if (invalid) { errorMessage.value = invalid; message.error(invalid); return; }
  publishing.value = true;
  try {
    if (dirty.value && !(await saveDraft(false))) {
      message.warning("保存期间内容发生了变化，请再次点击发布");
      return;
    }
    if (!draft.value) return;
    await api.request(`/api/admin/content/drafts/${draft.value.id}/publish`, { method: "POST", body: { version: draft.value.version } }); message.success("内容已发布"); await navigateTo(`/admin?section=${resource}`);
  }
  catch (error) { setError(error); } finally { publishing.value = false; }
}
async function unpublish() {
  if (publishing.value || saving.value || !draft.value?.resourceId || !window.confirm("确定下线这条内容吗？下线后可以重新编辑发布。")) return;
  publishing.value = true;
  try { await api.request(`/api/admin/content/${resource}/${draft.value.resourceId}/unpublish`, { method: "POST" }); message.success("内容已下线"); await goBack(); } catch (error) { setError(error); } finally { publishing.value = false; }
}
async function restorePrevious() {
  if (publishing.value || saving.value || !draft.value?.resourceId || !window.confirm("将上一版本载入当前草稿吗？公开页面不会立即改变，重新发布后才会生效。")) return;
  publishing.value = true;
  try {
    draft.value = await api.request<AdminDraft>(`/api/admin/content/${resource}/${draft.value.resourceId}/restore-previous`, { method: "POST" });
    replacePayload(draft.value.payload);
    dirty.value = false;
    message.success("上一版本已恢复到草稿，请预览后重新发布");
  } catch (error) { setError(error); } finally { publishing.value = false; }
}
async function deleteDraft() {
  if (saving.value || publishing.value || !draft.value || !window.confirm(draft.value.resourceId ? "确定删除当前编辑草稿吗？已发布内容不会被删除。" : "确定删除这份未发布草稿吗？")) return;
  saving.value = true;
  try {
    await api.request(`/api/admin/content/drafts/${draft.value.id}`, { method: "DELETE" });
    dirty.value = false;
    message.success("草稿已删除");
    await goBack();
  } catch (error) { setError(error); } finally { saving.value = false; }
}
async function goBack() { await navigateTo(`/admin?section=${resource}`); }
async function logout() { await session.logout(); await navigateTo("/admin/login"); }
function setError(error: unknown) { errorMessage.value = error && typeof error === "object" ? ((error as any).data?.message || (error as any).message || "请求失败") : "请求失败"; }
function formatDate(value: string) { return value ? new Date(value).toLocaleString("zh-CN") : "未保存"; }

useHead(() => ({ title: `${meta.value.title}编辑 - 猫娘社后台` }));
</script>

<style scoped>
.admin-content-editor { min-width: 0; display: grid; gap: 16px; }
.admin-editor-layout { display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(300px, .7fr); gap: 18px; align-items: start; }
.admin-editor-layout > .n-card { min-width: 0; }
.admin-editor-section-heading { margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid var(--line); }
.admin-editor-section-heading p { max-width: 62ch; margin: 5px 0 0; color: var(--muted); font-size: 12px; line-height: 1.55; }
.admin-media-picker { display: grid; gap: 12px; margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--line); }
.admin-media-preview, .admin-block-image { display: grid; gap: 10px; }
.admin-media-preview img, .admin-block-image img, .admin-preview-cover img { display: block; width: 100%; max-height: 260px; object-fit: contain; border: 1px solid var(--line); border-radius: 6px; background: var(--surface-soft); }
.admin-icon-grid { display: grid; grid-template-columns: repeat(7, minmax(48px, 1fr)); gap: 7px; }
.admin-icon-grid button { display: grid; gap: 4px; place-items: center; padding: 6px 3px; color: var(--muted); background: transparent; border: 1px solid var(--line); border-radius: 6px; cursor: pointer; }
.admin-icon-grid button.is-selected { color: var(--green-strong); border-color: var(--green); background: var(--green-soft); }
.admin-icon-grid img { width: 32px; height: 32px; image-rendering: pixelated; }
.admin-icon-grid span { overflow: hidden; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.admin-preview-summary { color: var(--muted); line-height: 1.65; }
.admin-live-preview { position: sticky; top: 94px; max-height: calc(100dvh - 118px); overflow: auto; }
.admin-editor-actions { position: sticky; bottom: 12px; z-index: 30; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border: 1px solid var(--line-strong); border-radius: 8px; background: rgb(249 251 247 / 96%); backdrop-filter: blur(14px); box-shadow: var(--shadow-md); }
.admin-editor-actions .n-button { white-space: nowrap; }
.admin-editor-actions > span { color: var(--muted); font-size: 12px; }
.admin-hidden-file { display: none; }
.admin-editor-loading { display: grid; min-height: 240px; place-items: center; }
@media (max-width: 1120px) { .admin-editor-layout { grid-template-columns: 1fr; } .admin-live-preview { position: static; max-height: none; } }
@media (max-width: 900px) { .admin-icon-grid { grid-template-columns: repeat(7, minmax(40px, 1fr)); } }
@media (max-width: 640px) { .admin-editor-actions { align-items: stretch; flex-direction: column; } .admin-icon-grid { grid-template-columns: repeat(5, minmax(40px, 1fr)); } }
</style>
