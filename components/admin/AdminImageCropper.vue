<template>
  <NModal :show="show" preset="card" :title="title" class="admin-cropper-modal" :mask-closable="false" @update:show="onUpdateShow">
    <div class="admin-cropper-stage">
      <img ref="imageElement" :src="previewUrl" alt="待裁剪图片" />
    </div>
    <p class="admin-cropper-help">拖动图片调整位置，滚轮或触控板调整缩放。</p>
    <template #footer>
      <NSpace justify="end">
        <NButton secondary @click="cancel">取消</NButton>
        <NButton type="primary" :loading="processing" @click="confirm">确认裁剪</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<script setup lang="ts">
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { NButton, NModal, NSpace } from "naive-ui";

const props = withDefaults(defineProps<{
  show: boolean;
  file: File | null;
  aspectRatio: number;
  title?: string;
  outputType?: "image/jpeg" | "image/png";
}>(), {
  title: "调整图片",
  outputType: "image/jpeg"
});

const emit = defineEmits<{
  "update:show": [value: boolean];
  confirm: [file: File];
  cancel: [];
}>();

const imageElement = shallowRef<HTMLImageElement | null>(null);
const previewUrl = ref("");
const processing = ref(false);
let cropper: Cropper | null = null;
let objectUrl = "";

watch(() => [props.show, props.file] as const, async ([show, file]) => {
  if (!show || !file) {
    cropper?.destroy();
    cropper = null;
    releasePreview();
    return;
  }
  releasePreview();
  objectUrl = URL.createObjectURL(file);
  previewUrl.value = objectUrl;
  await nextTick();
  if (!imageElement.value) return;
  cropper?.destroy();
  cropper = new Cropper(imageElement.value, {
    aspectRatio: props.aspectRatio,
    viewMode: 1,
    dragMode: "move",
    autoCropArea: 0.92,
    responsive: true,
    background: false,
    guides: true,
    center: true,
    zoomable: true,
    movable: true,
  });
}, { immediate: true });

onBeforeUnmount(() => {
  cropper?.destroy();
  releasePreview();
});

function releasePreview() {
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = "";
  previewUrl.value = "";
}

function onUpdateShow(value: boolean) {
  if (!value) cancel();
}

function cancel() {
  cropper?.destroy();
  cropper = null;
  releasePreview();
  emit("update:show", false);
  emit("cancel");
}

async function confirm() {
  if (!cropper || !props.file) return;
  processing.value = true;
  try {
    const canvas = cropper.getCroppedCanvas({
      maxWidth: 4096,
      maxHeight: 4096,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high"
    });
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, props.outputType, 0.92));
    if (!blob) throw new Error("图片裁剪失败，请重新选择图片");
    const extension = props.outputType === "image/png" ? "png" : "jpg";
    emit("confirm", new File([blob], `cropped-${Date.now()}.${extension}`, { type: props.outputType }));
    emit("update:show", false);
    cropper.destroy();
    cropper = null;
    releasePreview();
  } finally {
    processing.value = false;
  }
}
</script>

<style scoped>
.admin-cropper-modal { width: min(760px, calc(100vw - 28px)); }
.admin-cropper-stage { min-height: 260px; max-height: 62vh; overflow: hidden; background: #16231b; }
.admin-cropper-stage img { display: block; max-width: 100%; max-height: 62vh; }
.admin-cropper-help { margin: 12px 0 0; color: var(--muted); font-size: 12px; }
</style>
