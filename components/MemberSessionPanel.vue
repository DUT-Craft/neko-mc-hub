<template>
  <div class="application-account" :class="{ 'is-authenticated': isAuthenticated }">
    <div class="application-account__text">
      <span>{{ restoring ? "正在检查登录状态" : isAuthenticated ? "已登录成员" : "需要成员登录" }}</span>
      <strong>{{ isAuthenticated ? accountName : prompt }}</strong>
    </div>
    <NButton v-if="isAuthenticated" quaternary size="small" :loading="loggingOut" @click="signOut">退出</NButton>
    <NButton v-else secondary size="small" @click="openLogin">成员登录</NButton>
  </div>

  <NModal v-model:show="showLogin" preset="card" title="成员登录" class="member-login-modal" :bordered="false">
    <NAlert v-if="loginError" type="error" :show-icon="false" class="member-login-alert">{{ loginError }}</NAlert>
    <NForm label-placement="top" @submit.prevent="submitLogin">
      <NFormItem label="账号">
        <NInput
          v-model:value="loginUsername"
          placeholder="输入社团账号"
          :input-props="{ autocomplete: 'username' }"
          autofocus
        />
      </NFormItem>
      <NFormItem label="密码">
        <NInput
          v-model:value="loginPassword"
          type="password"
          show-password-on="click"
          placeholder="输入密码"
          :input-props="{ autocomplete: 'current-password' }"
          @keyup.enter="submitLogin"
        />
      </NFormItem>
      <NButton type="primary" block attr-type="submit" :loading="loggingIn">登录</NButton>
    </NForm>
  </NModal>
</template>

<script setup lang="ts">
import { NAlert, NButton, NForm, NFormItem, NInput, NModal, useMessage } from "naive-ui";
import { getApiErrorMessage } from "~/composables/useApiClient";
import { useMemberSession } from "~/composables/useMemberSession";

withDefaults(defineProps<{ prompt?: string }>(), {
  prompt: "使用社团账号登录后即可继续"
});

const message = useMessage();
const showLogin = ref(false);
const loginUsername = ref("");
const loginPassword = ref("");
const loginError = ref("");
const loggingIn = ref(false);
const loggingOut = ref(false);
const { user, isAuthenticated, restoring, restore, login, logout } = useMemberSession();
const accountName = computed(() => user.value?.displayName || user.value?.username || "成员");

onMounted(() => {
  void restore();
});

function openLogin() {
  loginError.value = "";
  showLogin.value = true;
}

async function submitLogin() {
  if (!loginUsername.value.trim() || !loginPassword.value) {
    loginError.value = "请输入账号和密码";
    return;
  }
  loggingIn.value = true;
  loginError.value = "";
  try {
    await login(loginUsername.value.trim(), loginPassword.value);
    loginPassword.value = "";
    showLogin.value = false;
    message.success("登录成功");
  } catch (error: unknown) {
    loginError.value = getApiErrorMessage(error, "登录失败，请检查账号和密码");
  } finally {
    loggingIn.value = false;
  }
}

async function signOut() {
  loggingOut.value = true;
  try {
    await logout();
    message.success("已退出登录");
  } finally {
    loggingOut.value = false;
  }
}

defineExpose({ openLogin });
</script>
