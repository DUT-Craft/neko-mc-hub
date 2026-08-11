<template>
  <section class="section community-participation" aria-labelledby="community-participation-title">
    <div class="section-head">
      <div>
        <span class="section-label">交流与反馈</span>
        <h2 id="community-participation-title">提出建议或私下反馈</h2>
        <p>建议会公开展示并允许成员点赞；私密反馈只会出现在管理后台。</p>
      </div>
    </div>

    <div class="community-participation__forms">
      <NCard class="community-action-card" :bordered="false">
        <div class="community-action-card__heading">
          <span class="pixi pixi-sign" aria-hidden="true"></span>
          <div><span class="section-label">公开建议</span><h3>让大家一起讨论</h3></div>
        </div>
        <NForm ref="ideaFormRef" :model="ideaModel" :rules="ideaRules" label-placement="top" @submit.prevent="submitIdea">
          <NFormItem label="标题" path="title">
            <NInput v-model:value="ideaModel.title" :maxlength="180" show-count placeholder="一句话说明建议" />
          </NFormItem>
          <NFormItem label="分类" path="category">
            <NSelect v-model:value="ideaModel.category" :options="ideaCategories" placeholder="选择建议分类" />
          </NFormItem>
          <NFormItem label="详细说明" path="description">
            <NInput
              v-model:value="ideaModel.description"
              type="textarea"
              :maxlength="5000"
              :autosize="{ minRows: 4, maxRows: 8 }"
              show-count
              placeholder="说明想解决的问题、使用场景和期望结果"
            />
          </NFormItem>
          <NButton type="primary" attr-type="submit" :loading="submittingIdea">提交公开建议</NButton>
        </NForm>
      </NCard>

      <NCard class="community-action-card" :bordered="false">
        <div class="community-action-card__heading">
          <span class="pixi pixi-guide" aria-hidden="true"></span>
          <div><span class="section-label">私密反馈</span><h3>只交给管理员处理</h3></div>
        </div>
        <NAlert type="info" :show-icon="false">适合账号、冲突、隐私或不方便公开讨论的问题。</NAlert>
        <NForm ref="feedbackFormRef" :model="feedbackModel" :rules="feedbackRules" label-placement="top" @submit.prevent="submitFeedback">
          <NFormItem label="反馈内容" path="body">
            <NInput
              v-model:value="feedbackModel.body"
              type="textarea"
              :maxlength="5000"
              :autosize="{ minRows: 7, maxRows: 12 }"
              show-count
              placeholder="请写清发生了什么，以及希望管理员如何联系或处理"
            />
          </NFormItem>
          <NButton type="primary" attr-type="submit" :loading="submittingFeedback">发送私密反馈</NButton>
        </NForm>
      </NCard>
    </div>

    <NCard class="idea-board" :bordered="false">
      <div class="idea-board__heading">
        <div><span class="section-label">建议墙</span><h3>最近的公开建议</h3></div>
        <NTag round>{{ ideas.length }} 条</NTag>
      </div>
      <NList v-if="ideas.length" class="idea-board__list" :bordered="false">
        <NListItem v-for="idea in ideas" :key="idea.id">
          <article class="idea-board__item">
            <div class="idea-board__meta">
              <NTag size="small" :type="idea.status === 'ADOPTED' ? 'success' : 'default'" round>
                {{ idea.status === "ADOPTED" ? "已采纳" : "讨论中" }}
              </NTag>
              <span>{{ idea.category }}</span>
              <span>{{ idea.nickname }}</span>
              <time>{{ stableDate(idea.createdAt) }}</time>
            </div>
            <h4>{{ idea.title }}</h4>
            <p>{{ idea.description }}</p>
            <blockquote v-if="idea.publicReply">管理员回复：{{ idea.publicReply }}</blockquote>
            <NButton text type="primary" :loading="likingId === idea.id" @click="likeIdea(idea.id)">
              点赞 {{ idea.likes }}
            </NButton>
          </article>
        </NListItem>
      </NList>
      <NEmpty v-else description="还没有公开建议" />
    </NCard>
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
  NSelect,
  NTag,
  useMessage,
  type FormInst,
  type FormRules
} from "naive-ui";
import { getApiErrorMessage } from "~/composables/useApiClient";
import { useMemberSession } from "~/composables/useMemberSession";
import type { IdeaViewModel } from "~/types/view-models";

defineProps<{ ideas: IdeaViewModel[] }>();
const emit = defineEmits<{ refresh: []; loginRequired: [] }>();
const message = useMessage();
const ideaFormRef = ref<FormInst | null>(null);
const feedbackFormRef = ref<FormInst | null>(null);
const submittingIdea = ref(false);
const submittingFeedback = ref(false);
const likingId = ref<number | null>(null);
const ideaModel = reactive({ title: "", category: "", description: "" });
const feedbackModel = reactive({ body: "" });
const { isAuthenticated, initialized, restore, request } = useMemberSession();

const ideaCategories = ["每周活动", "长期活动", "服务器", "Wiki", "其他"].map((label) => ({ label, value: label }));
const ideaRules: FormRules = {
  title: { required: true, message: "请填写建议标题", trigger: ["input", "blur"] },
  category: { required: true, message: "请选择建议分类", trigger: "change" },
  description: { required: true, message: "请填写建议说明", trigger: ["input", "blur"] }
};
const feedbackRules: FormRules = {
  body: { required: true, message: "请填写反馈内容", trigger: ["input", "blur"] }
};

async function ensureAuthenticated() {
  if (!initialized.value) await restore();
  if (isAuthenticated.value) return true;
  emit("loginRequired");
  message.warning("请先登录成员账号。");
  return false;
}

async function submitIdea() {
  if (!await ensureAuthenticated()) return;
  try {
    await ideaFormRef.value?.validate();
  } catch {
    message.error("请补全公开建议。");
    return;
  }
  submittingIdea.value = true;
  try {
    const result = await request<{ id: number; status: string }>("/api/public/ideas", {
      method: "POST",
      body: { ...ideaModel }
    });
    message.success(`建议已提交，编号 #${result.id}`);
    ideaModel.title = "";
    ideaModel.category = "";
    ideaModel.description = "";
    ideaFormRef.value?.restoreValidation();
    emit("refresh");
  } catch (error: unknown) {
    message.error(getApiErrorMessage(error, "建议提交失败，请稍后重试"));
  } finally {
    submittingIdea.value = false;
  }
}

async function submitFeedback() {
  if (!await ensureAuthenticated()) return;
  try {
    await feedbackFormRef.value?.validate();
  } catch {
    message.error("请填写反馈内容。");
    return;
  }
  submittingFeedback.value = true;
  try {
    const result = await request<{ id: number; status: string }>("/api/public/feedback", {
      method: "POST",
      body: { body: feedbackModel.body }
    });
    message.success(`反馈已发送，编号 #${result.id}`);
    feedbackModel.body = "";
    feedbackFormRef.value?.restoreValidation();
  } catch (error: unknown) {
    message.error(getApiErrorMessage(error, "反馈发送失败，请稍后重试"));
  } finally {
    submittingFeedback.value = false;
  }
}

async function likeIdea(id: number) {
  if (!await ensureAuthenticated()) return;
  likingId.value = id;
  try {
    await request(`/api/public/ideas/${id}/like`, { method: "POST" });
    message.success("点赞成功");
    emit("refresh");
  } catch (error: unknown) {
    message.error(getApiErrorMessage(error, "点赞失败，请稍后重试"));
  } finally {
    likingId.value = null;
  }
}

function stableDate(value: string) {
  return value.slice(0, 10);
}
</script>

<style scoped>
.community-participation {
  display: grid;
  gap: 14px;
}

.community-participation > .section-head {
  margin-bottom: 0;
}

.community-participation__forms {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.community-action-card,
.idea-board {
  min-width: 0;
  border: 1px solid var(--line);
  background: var(--surface-soft);
}

.community-action-card > :deep(.n-card-content),
.idea-board > :deep(.n-card-content) {
  display: grid;
  gap: 15px;
}

.community-action-card__heading {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding-bottom: 13px;
  border-bottom: 1px solid var(--line);
}

.community-action-card__heading h3,
.idea-board__heading h3 {
  margin: 0;
  color: var(--ink);
}

.idea-board__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.idea-board__list {
  --n-color: transparent !important;
}

.idea-board__item {
  min-width: 0;
  width: 100%;
  display: grid;
  gap: 7px;
  padding-block: 5px;
}

.idea-board__item h4,
.idea-board__item p,
.idea-board__item blockquote {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
}

.idea-board__item h4 {
  color: var(--ink);
  font-size: 17px;
}

.idea-board__item p {
  color: var(--ink-soft);
  white-space: pre-wrap;
}

.idea-board__item blockquote {
  padding: 9px 11px;
  border-left: 3px solid var(--green);
  color: var(--ink-soft);
  background: var(--green-soft);
}

.idea-board__meta {
  min-width: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 10px;
  color: var(--muted);
  font-size: 11px;
}

@media (max-width: 800px) {
  .community-participation__forms {
    grid-template-columns: 1fr;
  }
}
</style>
