<template>
  <NButton :type="primary ? 'primary' : 'default'" :secondary="!primary" :size="size" @click="copy">
    {{ copied ? "已复制" : label }}
  </NButton>
</template>

<script setup lang="ts">
import { NButton, useMessage } from "naive-ui";

const props = withDefaults(defineProps<{
  value: string;
  label?: string;
  primary?: boolean;
  size?: "tiny" | "small" | "medium" | "large";
}>(), {
  label: "复制地址",
  primary: false,
  size: "medium"
});

const message = useMessage();
const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

async function copy() {
  try {
    await navigator.clipboard.writeText(props.value);
    copied.value = true;
    message.success(`已复制：${props.value}`);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { copied.value = false; }, 1400);
  } catch {
    message.info(`请手动复制：${props.value}`);
  }
}

onBeforeUnmount(() => timer && clearTimeout(timer));
</script>
