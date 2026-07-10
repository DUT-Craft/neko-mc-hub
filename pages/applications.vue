<template>
  <main class="page">
    <section class="page-title compact-title">
      <span class="page-kicker">申请</span><h1>任务委托板</h1><p class="lead">选择申请类型并检查必填信息；演示环境不会发送或保存内容。</p>
    </section>

    <section class="commission-board">
      <NCard class="task-menu" :bordered="false">
        <h2>申请类型</h2>
        <NRadioGroup v-model:value="activeTab" class="application-mode" name="application-kind">
          <NRadioButton value="skin">皮肤站邀请码</NRadioButton>
          <NRadioButton value="server">开服申请</NRadioButton>
          <NRadioButton value="duty">值班申请</NRadioButton>
        </NRadioGroup>
        <p class="form-note">真实提交入口将在后端接口和隐私说明确认后开放。</p>
      </NCard>

      <NCard class="commission-form" :bordered="false">
        <div class="quest-head">
          <NTag :type="activeTab === 'server' ? 'info' : activeTab === 'duty' ? 'warning' : 'success'" round>{{ activeMeta.tag }}</NTag>
          <h2>{{ activeMeta.title }}</h2><p class="form-note">{{ activeMeta.note }}</p>
        </div>
        <ApplicationForm :key="activeTab" :kind="activeTab" />
      </NCard>
    </section>
  </main>
</template>

<script setup lang="ts">
import { NCard, NRadioButton, NRadioGroup, NTag } from "naive-ui";
import type { ApplicationKind } from "~/types/view-models";
const activeTab = ref<ApplicationKind>("skin");
const meta = {
  skin: { tag: "注册账号", title: "皮肤站邀请码申请", note: "填写身份和 Minecraft ID，方便值班管理核对。" },
  server: { tag: "临时服务器", title: "开服申请", note: "用于活动、小组玩法或临时服务器申请。" },
  duty: { tag: "协助社员", title: "值班申请", note: "适合愿意协助新人、活动或技术排障的社员。" }
};
const activeMeta = computed(() => meta[activeTab.value]);
useHead({ title: "申请中心 - 猫娘社 MC 主站" });
</script>
