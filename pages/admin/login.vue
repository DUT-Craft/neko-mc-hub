<template>
  <main class="admin-login-page">
    <NCard class="admin-login-panel" :bordered="false">
      <div class="admin-login-brand">
        <span class="admin-brand__mark"><img :src="minecraftIconUrl('neko-avatar')" alt="" /></span>
        <div><span class="admin-kicker">猫娘社 MC 主站</span><strong>管理员登录</strong></div>
      </div>
      <p class="admin-login-lead">登录后管理服务器、活动、公告和审核内容。</p>

      <NAlert v-if="errorMessage" type="error" :show-icon="false" class="admin-login-alert">{{ errorMessage }}</NAlert>
      <NForm label-placement="top" @submit.prevent="submit">
        <NFormItem label="管理员账号">
          <NInput
            v-model:value="username"
            size="large"
            placeholder="输入管理员账号"
            :input-props="{ autocomplete: 'username' }"
            autofocus
          />
        </NFormItem>
        <NFormItem label="密码">
          <NInput
            v-model:value="password"
            size="large"
            type="password"
            show-password-on="click"
            placeholder="输入管理员密码"
            :input-props="{ autocomplete: 'current-password' }"
            @keyup.enter="submit"
          />
        </NFormItem>
        <NButton type="primary" size="large" block :loading="submitting" attr-type="submit">登录后台</NButton>
      </NForm>
      <NButton class="admin-login-back" text block tag="a" :href="sitePath('/home')">返回主站</NButton>
    </NCard>
  </main>
</template>

<script setup lang="ts">
import { NAlert, NButton, NCard, NForm, NFormItem, NInput, useMessage } from "naive-ui";
import { useAdminSession } from "~/composables/useAdminSession";
import { useSitePath } from "~/composables/useSitePath";
import { minecraftIconUrl } from "~/utils/minecraftIcons";

const route = useRoute();
const message = useMessage();
const sitePath = useSitePath();
const { restore, isAdmin, login } = useAdminSession();
const username = ref("");
const password = ref("");
const submitting = ref(false);
const errorMessage = ref("");

onMounted(async () => {
  if (await restore() && isAdmin.value) await navigateTo("/admin");
});

async function submit() {
  if (!username.value.trim() || !password.value) {
    errorMessage.value = "请输入管理员账号和密码";
    return;
  }
  submitting.value = true;
  errorMessage.value = "";
  try {
    await login(username.value, password.value);
    message.success("登录成功");
    const redirect = typeof route.query.redirect === "string" && route.query.redirect.startsWith("/admin") ? route.query.redirect : "/admin";
    await navigateTo(redirect);
  } catch (error: unknown) {
    errorMessage.value = errorMessageFrom(error);
  } finally {
    submitting.value = false;
  }
}

function errorMessageFrom(error: unknown) {
  if (error && typeof error === "object") {
    const item = error as { data?: { message?: string }; message?: string };
    return item.data?.message || item.message || "登录失败，请检查账号、密码和后端服务";
  }
  return "登录失败，请检查账号、密码和后端服务";
}

useHead({ title: "管理员登录 - 猫娘社 MC 主站" });
</script>
