<template>
  <main class="page">
    <section class="page-title compact-title">
      <span class="page-kicker">申请</span>
      <h1>任务委托板</h1>
      <p class="lead">选择申请类型，按顺序填写资料并检查必填项。</p>
    </section>

    <section class="application-shell">
      <NCard class="application-switcher" :bordered="false" size="small">
        <span>申请类型</span>
        <NRadioGroup v-model:value="activeTab" class="application-mode" name="application-kind">
          <NRadioButton value="skin">皮肤站邀请码</NRadioButton>
          <NRadioButton value="server">开服申请</NRadioButton>
          <NRadioButton value="duty">值班申请</NRadioButton>
        </NRadioGroup>
      </NCard>

      <MemberSessionPanel ref="sessionPanel" prompt="登录后可以提交申请、建议、点赞和私密反馈" />

      <div class="commission-board">
        <NCard class="application-context" :bordered="false" content-style="padding: 0">
          <template #cover>
            <img :src="sitePath('/assets/bg-neko-corner-soft.webp')" alt="猫娘社成员在 Minecraft 大厅告示牌前集合" width="900" height="675" />
          </template>
          <div class="application-context__body">
            <NTag :type="activeTab === 'server' ? 'info' : activeTab === 'duty' ? 'warning' : 'success'" round>
              {{ activeMeta.tag }}
            </NTag>
            <h2>{{ activeMeta.title }}</h2>
            <p>{{ activeMeta.note }}</p>
            <div class="application-checklist">
              <span>提交前准备</span>
              <NList class="application-checklist-list" :bordered="false">
                <NListItem v-for="item in activeMeta.requirements" :key="item">{{ item }}</NListItem>
              </NList>
            </div>
          </div>
        </NCard>

        <NCard class="commission-form" :bordered="false">
          <div class="quest-head">
            <span class="pixi pixi-apply" aria-hidden="true"></span>
            <div>
              <span class="section-label">填写资料</span>
              <h2>{{ activeMeta.title }}</h2>
            </div>
          </div>
          <ApplicationForm :key="activeTab" :kind="activeTab" @login-required="openMemberLogin" />
        </NCard>
      </div>
    </section>

    <CommunityParticipation :ideas="ideas || []" @refresh="refreshIdeas" @login-required="openMemberLogin" />
  </main>
</template>

<script setup lang="ts">
import { NCard, NList, NListItem, NRadioButton, NRadioGroup, NTag } from "naive-ui";
import type { ApplicationKind, IdeaViewModel } from "~/types/view-models";
import { usePublicApi } from "~/composables/usePublicApi";
import { useSitePath } from "~/composables/useSitePath";

const activeTab = ref<ApplicationKind>("skin");
const sessionPanel = ref<{ openLogin: () => void } | null>(null);
const sitePath = useSitePath();
const publicApi = usePublicApi();
const { data: ideas, refresh: refreshIdeas } = await useAsyncData<IdeaViewModel[]>(
  "public-ideas",
  () => publicApi.request<IdeaViewModel[]>("/api/public/ideas"),
  { default: () => [] }
);
const meta = {
  skin: {
    tag: "注册账号",
    title: "皮肤站邀请码申请",
    note: "用于核对社团身份并创建皮肤站账号。",
    requirements: ["姓名或常用昵称", "学号与 Minecraft ID", "可以联系到你的 QQ"]
  },
  server: {
    tag: "临时服务器",
    title: "开服申请",
    note: "用于活动、小组玩法或临时测试服务器。",
    requirements: ["预计参与人数", "开服时间与用途", "插件或整合包需求"]
  },
  duty: {
    tag: "协助社员",
    title: "值班申请",
    note: "适合愿意协助新人、活动或技术排障的社员。",
    requirements: ["可值班时间", "擅长处理的事项", "可以联系到你的 QQ"]
  }
};

const activeMeta = computed(() => meta[activeTab.value]);
function openMemberLogin() {
  sessionPanel.value?.openLogin();
}
useHead({ title: "申请中心 - 猫娘社 MC 主站" });
</script>
