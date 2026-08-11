<template>
  <NCard class="activity-registration-card" :bordered="false">
    <div class="activity-registration-card__heading">
      <span class="pixi pixi-chest" aria-hidden="true"></span>
      <div>
        <span class="section-label">活动报名</span>
        <h2>预留活动名额</h2>
        <p>填写 Minecraft ID 和 QQ，管理员会在后台确认报名。</p>
      </div>
    </div>

    <MemberSessionPanel ref="sessionPanel" prompt="登录后才能提交活动报名" />
    <NAlert v-if="status === 'paused'" type="warning" :show-icon="false">该活动当前暂停报名。</NAlert>

    <NForm ref="formRef" :model="model" :rules="rules" label-placement="top" @submit.prevent="submit">
      <div class="activity-registration-card__fields">
        <NFormItem label="Minecraft ID" path="minecraftId">
          <NInput v-model:value="model.minecraftId" maxlength="40" placeholder="游戏内 ID" />
        </NFormItem>
        <NFormItem label="QQ" path="qq">
          <NInput v-model:value="model.qq" maxlength="12" placeholder="例如 12345678" />
        </NFormItem>
      </div>
      <NSpace align="center" wrap>
        <NButton type="primary" attr-type="submit" :loading="submitting" :disabled="status === 'paused' || restoring">
          提交报名
        </NButton>
        <span class="form-disclaimer">联系方式只在后台报名队列中显示。</span>
      </NSpace>
    </NForm>
  </NCard>
</template>

<script setup lang="ts">
import { NAlert, NButton, NCard, NForm, NFormItem, NInput, NSpace, useMessage, type FormInst, type FormRules } from "naive-ui";
import { getApiErrorMessage } from "~/composables/useApiClient";
import { useMemberSession } from "~/composables/useMemberSession";
import type { ActivityViewModel } from "~/types/view-models";

const props = defineProps<{
  activitySlug: string;
  status: ActivityViewModel["status"];
}>();

const message = useMessage();
const formRef = ref<FormInst | null>(null);
const sessionPanel = ref<{ openLogin: () => void } | null>(null);
const submitting = ref(false);
const model = reactive({ minecraftId: "", qq: "" });
const { isAuthenticated, initialized, restoring, restore, request } = useMemberSession();
const rules: FormRules = {
  minecraftId: {
    required: true,
    pattern: /^[A-Za-z0-9_]{3,16}$/,
    message: "Minecraft ID 应为 3-16 位字母、数字或下划线",
    trigger: ["input", "blur"]
  },
  qq: {
    required: true,
    pattern: /^\d{5,12}$/,
    message: "请填写 5-12 位 QQ 号",
    trigger: ["input", "blur"]
  }
};

async function submit() {
  if (props.status === "paused") return;
  try {
    await formRef.value?.validate();
  } catch {
    message.error("请先补全报名信息。");
    return;
  }
  if (!initialized.value) await restore();
  if (!isAuthenticated.value) {
    sessionPanel.value?.openLogin();
    message.warning("请先登录成员账号，再提交报名。");
    return;
  }

  submitting.value = true;
  try {
    const result = await request<{ id: number; status: string }>(
      `/api/public/activities/${encodeURIComponent(props.activitySlug)}/registrations`,
      { method: "POST", body: { ...model } }
    );
    message.success(`报名已提交，编号 #${result.id}`);
    model.minecraftId = "";
    model.qq = "";
    formRef.value?.restoreValidation();
  } catch (error: unknown) {
    message.error(getApiErrorMessage(error, "报名失败，请稍后重试"));
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.activity-registration-card {
  margin-top: 18px;
  border: 1px solid var(--line);
  background: var(--surface-soft);
}

.activity-registration-card > :deep(.n-card-content) {
  display: grid;
  gap: 16px;
}

.activity-registration-card__heading {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
}

.activity-registration-card__heading h2,
.activity-registration-card__heading p {
  margin: 0;
}

.activity-registration-card__heading p {
  color: var(--muted);
  font-size: 13px;
}

.activity-registration-card__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;
}

@media (max-width: 640px) {
  .activity-registration-card__fields {
    grid-template-columns: 1fr;
  }
}
</style>
