<template>
  <NForm ref="formRef" :model="model" :rules="rules" label-placement="top" @submit.prevent="submit">
    <NGrid :cols="2" :x-gap="16" responsive="screen" item-responsive>
      <NFormItemGi span="2 m:1" label="姓名或常用昵称" path="name">
        <NInput v-model:value="model.name" placeholder="用于值班管理核对" />
      </NFormItemGi>
      <NFormItemGi span="2 m:1" label="QQ" path="qq">
        <NInput v-model:value="model.qq" placeholder="例如 12345678" />
      </NFormItemGi>
      <NFormItemGi v-if="kind === 'skin'" span="2 m:1" label="学号" path="studentId">
        <NInput v-model:value="model.studentId" placeholder="用于社团身份核对" />
      </NFormItemGi>
      <NFormItemGi v-if="kind === 'skin'" span="2 m:1" label="Minecraft ID" path="minecraftId">
        <NInput v-model:value="model.minecraftId" placeholder="游戏内 ID" />
      </NFormItemGi>
      <NFormItemGi v-if="kind === 'server'" span="2 m:1" label="参与人数" path="participantCount">
        <NInput v-model:value="model.participantCount" placeholder="例如 8 人" />
      </NFormItemGi>
      <NFormItemGi v-if="kind === 'server'" span="2 m:1" label="服务器用途" path="purpose">
        <NSelect v-model:value="model.purpose" :options="purposeOptions" placeholder="选择用途" />
      </NFormItemGi>
      <NFormItemGi v-if="kind === 'server'" span="2" label="预计时间">
        <NInput v-model:value="model.expectedTime" placeholder="例如 本周六晚" />
      </NFormItemGi>
      <NFormItemGi v-if="kind === 'duty'" span="2 m:1" label="可值班时间">
        <NInput v-model:value="model.availableTime" placeholder="例如 周五晚 / 周末下午" />
      </NFormItemGi>
      <NFormItemGi v-if="kind === 'duty'" span="2 m:1" label="擅长内容" path="skill">
        <NSelect v-model:value="model.skill" :options="skillOptions" placeholder="选择擅长内容" />
      </NFormItemGi>
      <NFormItemGi span="2" :label="kind === 'server' ? '插件 / 整合包需求' : '申请说明'">
        <NInput v-model:value="model.reason" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" placeholder="填写管理需要了解的信息" />
      </NFormItemGi>
    </NGrid>
    <NSpace align="center" wrap>
      <NButton type="primary" attr-type="submit">{{ submitLabel }}</NButton>
      <span class="form-disclaimer">演示环境只校验表单，不会发送或保存个人信息。</span>
    </NSpace>
  </NForm>
</template>

<script setup lang="ts">
import {
  NButton,
  NForm,
  NFormItemGi,
  NGrid,
  NInput,
  NSelect,
  NSpace,
  useMessage,
  type FormInst,
  type FormRules
} from "naive-ui";
import type { ApplicationFormModel, ApplicationKind } from "~/types/view-models";

const props = defineProps<{ kind: ApplicationKind }>();
const message = useMessage();
const formRef = ref<FormInst | null>(null);

const model = reactive<ApplicationFormModel>({
  kind: props.kind,
  name: "",
  qq: "",
  studentId: "",
  minecraftId: "",
  participantCount: "",
  purpose: null as unknown as string,
  expectedTime: "",
  availableTime: "",
  skill: null as unknown as string,
  reason: ""
});

const rules: FormRules = {
  name: { required: true, message: "请填写姓名或常用昵称", trigger: ["input", "blur"] },
  qq: { required: true, pattern: /^\d{5,12}$/, message: "请填写 5-12 位 QQ 号", trigger: ["input", "blur"] },
  studentId: props.kind === "skin" ? { required: true, message: "请填写学号", trigger: ["input", "blur"] } : {},
  minecraftId: props.kind === "skin" ? { required: true, pattern: /^[A-Za-z0-9_]{3,16}$/, message: "Minecraft ID 应为 3-16 位字母、数字或下划线", trigger: ["input", "blur"] } : {},
  participantCount: props.kind === "server" ? { required: true, message: "请填写参与人数", trigger: ["input", "blur"] } : {},
  purpose: props.kind === "server" ? { required: true, message: "请选择服务器用途", trigger: "change" } : {},
  skill: props.kind === "duty" ? { required: true, message: "请选择擅长内容", trigger: "change" } : {}
};

const purposeOptions = ["速通活动", "小游戏", "冒险组", "建筑测试"].map((label) => ({ label, value: label }));
const skillOptions = ["新人引导", "活动组织", "技术排障", "规则维护"].map((label) => ({ label, value: label }));
const submitLabel = computed(() => ({ skin: "检查邀请码申请", server: "检查开服申请", duty: "检查值班申请" }[props.kind]));

async function submit() {
  try {
    await formRef.value?.validate();
    message.warning("演示环境，提交功能暂未开放；表单内容没有被发送或保存。", { duration: 4500 });
  } catch {
    message.error("请先补全标红的必填项。")
  }
}
</script>
