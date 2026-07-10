<template>
  <NAlert class="demo-banner" type="info" :show-icon="true" :bordered="false">
    <template #header>演示数据</template>
    当前服务器地址、在线人数、活动时间和管理联系方式仅用于前端预览，真实数据将在后端接口接入后替换。
  </NAlert>
</template>

<script setup lang="ts">
import { NAlert } from "naive-ui";
</script>
