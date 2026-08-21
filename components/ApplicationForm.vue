<template>
  <div class="application-form-shell">
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="top" @submit.prevent="submit">
      <div class="application-form-grid">
        <NFormItem label="姓名或常用昵称" path="name">
          <NInput v-model:value="model.name" placeholder="用于值班管理核对" />
        </NFormItem>
        <NFormItem label="QQ" path="qq">
          <NInput v-model:value="model.qq" placeholder="例如 12345678" />
        </NFormItem>
        <NFormItem v-if="kind === 'skin'" label="学号" path="studentId">
          <NInput v-model:value="model.studentId" placeholder="用于社团身份核对" />
        </NFormItem>
        <NFormItem v-if="kind === 'skin'" label="Minecraft ID" path="minecraftId">
          <NInput v-model:value="model.minecraftId" placeholder="游戏内 ID" />
        </NFormItem>
        <NFormItem v-if="kind === 'server'" label="参与人数" path="participantCount">
          <NInput v-model:value="model.participantCount" placeholder="例如 8 人" />
        </NFormItem>
        <NFormItem v-if="kind === 'server'" label="服务器用途" path="purpose">
          <NSelect v-model:value="model.purpose" :options="purposeOptions" placeholder="选择用途" />
        </NFormItem>
        <NFormItem v-if="kind === 'server'" class="form-field--full" label="预计时间" path="expectedTime">
          <NInput v-model:value="model.expectedTime" placeholder="例如 本周六晚" />
        </NFormItem>
        <NFormItem v-if="kind === 'duty'" label="可值班时间" path="availableTime">
          <NInput v-model:value="model.availableTime" placeholder="例如 周五晚 / 周末下午" />
        </NFormItem>
        <NFormItem v-if="kind === 'duty'" label="擅长内容" path="skill">
          <NSelect v-model:value="model.skill" :options="skillOptions" placeholder="选择擅长内容" />
        </NFormItem>
        <NFormItem
          class="form-field--full"
          :label="kind === 'server' ? '插件 / 整合包需求' : '申请说明'"
          :path="kind === 'server' ? 'requirements' : 'reason'"
        >
          <NInput
            v-model:value="details"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            placeholder="填写管理需要了解的信息"
          />
        </NFormItem>
      </div>
      <NSpace align="center" wrap>
        <NButton type="primary" attr-type="submit" :loading="submitting" :disabled="restoring">{{ submitLabel }}</NButton>
        <span class="form-disclaimer">请勿填写账号密码；QQ 和学号仅用于申请核对。</span>
      </NSpace>
    </NForm>

  </div>
</template>

<script setup lang="ts">
import {
  NButton,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NSpace,
  useMessage,
  type FormInst,
  type FormRules
} from "naive-ui";
import { getApiErrorMessage } from "~/composables/useApiClient";
import { useMemberSession } from "~/composables/useMemberSession";
import type { ApplicationFormModel, ApplicationKind } from "~/types/view-models";

const props = defineProps<{ kind: ApplicationKind }>();
const emit = defineEmits<{ loginRequired: []; submitted: [] }>();
const message = useMessage();
const formRef = ref<FormInst | null>(null);
const submitting = ref(false);

const { isAuthenticated, initialized, restoring, restore, request } = useMemberSession();

const model = reactive<ApplicationFormModel>(emptyModel());

const rules: FormRules = {
  name: { required: true, message: "请填写姓名或常用昵称", trigger: ["input", "blur"] },
  qq: { required: true, pattern: /^\d{5,12}$/, message: "请填写 5-12 位 QQ 号", trigger: ["input", "blur"] },
  studentId: props.kind === "skin" ? { required: true, message: "请填写学号", trigger: ["input", "blur"] } : {},
  minecraftId: props.kind === "skin" ? { required: true, pattern: /^[A-Za-z0-9_]{3,16}$/, message: "Minecraft ID 应为 3-16 位字母、数字或下划线", trigger: ["input", "blur"] } : {},
  participantCount: props.kind === "server" ? { required: true, message: "请填写参与人数", trigger: ["input", "blur"] } : {},
  purpose: props.kind === "server" ? { required: true, message: "请选择服务器用途", trigger: "change" } : {},
  expectedTime: props.kind === "server" ? { required: true, message: "请填写预计时间", trigger: ["input", "blur"] } : {},
  requirements: props.kind === "server" ? { required: true, message: "请填写插件或整合包需求；没有时填写无", trigger: ["input", "blur"] } : {},
  availableTime: props.kind === "duty" ? { required: true, message: "请填写可值班时间", trigger: ["input", "blur"] } : {},
  skill: props.kind === "duty" ? { required: true, message: "请选择擅长内容", trigger: "change" } : {}
};

const purposeOptions = ["速通活动", "小游戏", "冒险组", "建筑测试"].map((label) => ({ label, value: label }));
const skillOptions = ["新人引导", "活动组织", "技术排障", "规则维护"].map((label) => ({ label, value: label }));
const submitLabel = computed(() => ({ skin: "提交邀请码申请", server: "提交开服申请", duty: "提交值班申请" }[props.kind]));
const details = computed({
  get: () => props.kind === "server" ? model.requirements || "" : model.reason || "",
  set: (value: string) => {
    if (props.kind === "server") model.requirements = value;
    else model.reason = value;
  }
});

async function submit() {
  try {
    await formRef.value?.validate();
  } catch {
    message.error("请先补全标红的必填项。");
    return;
  }

  if (!initialized.value) await restore();
  if (!isAuthenticated.value) {
    emit("loginRequired");
    message.warning("请先登录成员账号，再提交申请。", { duration: 3500 });
    return;
  }

  submitting.value = true;
  try {
    const result = await request<{ id: number; status: string }>("/api/public/applications", {
      method: "POST",
      body: submissionPayload()
    });
    message.success(`申请已提交，编号 #${result.id}`);
    Object.assign(model, emptyModel());
    formRef.value?.restoreValidation();
    emit("submitted");
  } catch (error: unknown) {
    message.error(getApiErrorMessage(error, "提交失败，请稍后重试"));
  } finally {
    submitting.value = false;
  }
}

function submissionPayload() {
  return {
    kind: props.kind,
    name: model.name.trim(),
    qq: model.qq.trim(),
    studentId: clean(model.studentId),
    minecraftId: clean(model.minecraftId),
    reason: clean(model.reason),
    participantCount: clean(model.participantCount),
    purpose: clean(model.purpose),
    expectedTime: clean(model.expectedTime),
    requirements: clean(model.requirements),
    availableTime: clean(model.availableTime),
    skill: clean(model.skill)
  };
}

function emptyModel(): ApplicationFormModel {
  return {
    kind: props.kind,
    name: "",
    qq: "",
    studentId: "",
    minecraftId: "",
    participantCount: "",
    purpose: undefined,
    expectedTime: "",
    requirements: "",
    availableTime: "",
    skill: undefined,
    reason: ""
  };
}

function clean(value?: string) {
  return value?.trim() || undefined;
}
</script>
