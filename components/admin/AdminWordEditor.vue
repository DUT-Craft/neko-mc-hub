<template>
  <section class="admin-word-editor" aria-label="正文编辑器">
    <header class="admin-word-editor__header">
      <div>
        <span class="admin-kicker">正文</span>
        <h3>网站文档编辑器</h3>
      </div>
      <span class="admin-word-editor__count">{{ wordCount }} 字</span>
    </header>

    <div class="admin-word-editor__workbench">
      <div class="admin-word-toolbar" role="toolbar" aria-label="文字格式工具栏">
        <div class="admin-word-toolbar__group">
          <button class="is-icon" type="button" aria-label="撤销" title="撤销" :disabled="!canUndo" @click="run('undo')"><Undo2 /></button>
          <button class="is-icon" type="button" aria-label="重做" title="重做" :disabled="!canRedo" @click="run('redo')"><Redo2 /></button>
        </div>
        <div class="admin-word-toolbar__group">
          <button type="button" :class="{ 'is-active': active('paragraph') }" @click="setParagraph">正文</button>
          <button type="button" :class="{ 'is-active': active('heading', { level: 2 }) }" @click="setHeading(2)">标题 2</button>
          <button type="button" :class="{ 'is-active': active('heading', { level: 3 }) }" @click="setHeading(3)">标题 3</button>
        </div>
        <div class="admin-word-toolbar__group admin-word-toolbar__format">
          <button class="is-icon" type="button" aria-label="加粗" title="加粗" :class="{ 'is-active': active('bold') }" @click="toggle('bold')"><strong>B</strong></button>
          <button class="is-icon" type="button" aria-label="斜体" title="斜体" :class="{ 'is-active': active('italic') }" @click="toggle('italic')"><em>I</em></button>
          <button class="is-icon" type="button" aria-label="下划线" title="下划线" :class="{ 'is-active': active('underline') }" @click="toggle('underline')"><u>U</u></button>
          <button class="is-icon" type="button" aria-label="删除线" title="删除线" :class="{ 'is-active': active('strike') }" @click="toggle('strike')"><s>S</s></button>
        </div>
        <div class="admin-word-toolbar__group">
          <button class="is-icon" type="button" aria-label="左对齐" title="左对齐" :class="{ 'is-active': active({ textAlign: 'left' }) }" @click="align('left')"><AlignLeft /></button>
          <button class="is-icon" type="button" aria-label="居中" title="居中" :class="{ 'is-active': active({ textAlign: 'center' }) }" @click="align('center')"><AlignCenter /></button>
          <button class="is-icon" type="button" aria-label="右对齐" title="右对齐" :class="{ 'is-active': active({ textAlign: 'right' }) }" @click="align('right')"><AlignRight /></button>
        </div>
        <div class="admin-word-toolbar__group">
          <button class="is-icon" type="button" aria-label="项目列表" title="项目列表" :class="{ 'is-active': active('bulletList') }" @click="toggle('bulletList')"><List /></button>
          <button class="is-icon" type="button" aria-label="编号列表" title="编号列表" :class="{ 'is-active': active('orderedList') }" @click="toggle('orderedList')"><ListOrdered /></button>
          <button class="is-icon" type="button" aria-label="引用" title="引用" :class="{ 'is-active': active('blockquote') }" @click="toggle('blockquote')"><Quote /></button>
          <button class="is-icon" type="button" aria-label="代码块" title="代码块" :class="{ 'is-active': active('codeBlock') }" @click="toggle('codeBlock')"><Code2 /></button>
        </div>
        <div class="admin-word-toolbar__group">
          <button class="is-icon" type="button" aria-label="插入链接" title="插入链接" :class="{ 'is-active': active('link') }" @click="openLinkEditor"><Link2 /></button>
          <button class="is-icon" type="button" aria-label="取消链接" title="取消链接" :disabled="!active('link')" @click="removeLink"><Unlink2 /></button>
          <button class="is-icon" type="button" aria-label="插入图片" title="插入图片" @click="$emit('request-image')"><ImagePlus /></button>
        </div>
      </div>

      <div v-if="showLinkEditor" class="admin-word-link-editor">
        <NInput v-model:value="linkValue" placeholder="https://example.com 或 /站内路径" @keyup.enter="applyLink" />
        <NButton type="primary" size="small" @click="applyLink">应用链接</NButton>
        <NButton secondary size="small" @click="showLinkEditor = false">取消</NButton>
        <span v-if="linkError" role="alert">{{ linkError }}</span>
      </div>

      <div class="admin-word-paper-wrap">
        <EditorContent :editor="editor" class="admin-word-paper" />
      </div>

      <div v-if="selectedImage" class="admin-word-image-fields">
        <div>
          <strong>图片信息</strong>
        </div>
        <NInput :value="selectedImage.alt" placeholder="图片替代文字" maxlength="255" show-count @update:value="updateImageAttribute('alt', $event)" />
        <NInput :value="selectedImage.caption" placeholder="图片下方说明（可选）" maxlength="500" show-count @update:value="updateImageAttribute('caption', $event)" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { EditorContent, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Extension, Node as TiptapNode, mergeAttributes } from "@tiptap/core";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Code2,
  ImagePlus,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
  Unlink2
} from "@lucide/vue";
import { NButton, NInput } from "naive-ui";
import { blocksToRichDocument, richDocumentToBlocks, safeUrl } from "~/utils/richText";
import type { AdminMedia } from "~/types/admin";
import type { ContentBlock } from "~/types/view-models";

const props = defineProps<{
  modelValue: ContentBlock[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: ContentBlock[]];
  change: [];
  "request-image": [];
}>();

const RichImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      mediaId: { default: null, renderHTML: () => ({}) },
      caption: { default: "", renderHTML: (attrs) => attrs.caption ? { "data-caption": attrs.caption } : {} }
    };
  }
});

const ContentMetadata = Extension.create({
  name: "contentMetadata",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading", "bulletList", "orderedList", "blockquote", "codeBlock", "image"],
        attributes: {
          blockId: {
            default: null,
            renderHTML: (attrs) => attrs.blockId ? { "data-block-id": attrs.blockId } : {}
          }
        }
      },
      {
        types: ["paragraph", "heading", "blockquote"],
        attributes: {
          hadInlineContent: { default: false, renderHTML: () => ({}) }
        }
      },
      {
        types: ["blockquote"],
        attributes: {
          tone: {
            default: "info",
            renderHTML: (attrs) => ({ "data-tone": attrs.tone || "info" })
          }
        }
      }
    ];
  }
});

const ContentGallery = TiptapNode.create({
  name: "contentGallery",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      blockId: { default: null },
      items: { default: [] }
    };
  },
  parseHTML() {
    return [{ tag: "section[data-content-block='gallery']" }];
  },
  renderHTML({ node }) {
    const items = Array.isArray(node.attrs.items) ? node.attrs.items : [];
    const images = items.slice(0, 6).flatMap((item: any) => {
      const src = safeUrl(item?.src);
      return src ? [["img", { src, alt: String(item?.alt || "正文图片") }]] : [];
    });
    return [
      "section",
      mergeAttributes({
        class: "admin-word-gallery-block",
        "data-content-block": "gallery",
        "data-block-id": node.attrs.blockId || undefined,
        contenteditable: "false"
      }),
      ["strong", {}, `图片画廊 · ${items.length} 张`],
      ["div", { class: "admin-word-gallery-block__grid" }, ...images]
    ] as any;
  }
});

const ContentLink = TiptapNode.create({
  name: "contentLink",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      blockId: { default: null },
      blockType: { default: "link" },
      label: { default: "" },
      url: { default: "" }
    };
  },
  parseHTML() {
    return [{ tag: "div[data-content-block='link']" }];
  },
  renderHTML({ node }) {
    const kind = node.attrs.blockType === "action" ? "操作按钮" : "链接";
    return [
      "div",
      mergeAttributes({
        class: "admin-word-link-block",
        "data-content-block": "link",
        "data-block-id": node.attrs.blockId || undefined,
        contenteditable: "false"
      }),
      ["span", { class: "admin-word-link-block__kind" }, kind],
      ["strong", {}, String(node.attrs.label || node.attrs.url || "未命名链接")],
      ["code", {}, String(node.attrs.url || "")]
    ] as any;
  }
});

const revision = ref(0);
const showLinkEditor = ref(false);
const linkValue = ref("");
const linkError = ref("");
const selectedImage = ref<{ alt: string; caption: string } | null>(null);
let syncingFromParent = false;

const editor = useEditor({
  editable: !props.disabled,
  content: blocksToRichDocument(props.modelValue) as any,
  extensions: [
    StarterKit.configure({ link: false, underline: false, heading: { levels: [2, 3] } }),
    Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
    Underline,
    TextAlign.configure({ types: ["heading", "paragraph"], alignments: ["left", "center", "right", "justify"] }),
    Placeholder.configure({ placeholder: "开始写正文..." }),
    ContentMetadata,
    ContentGallery,
    ContentLink,
    RichImage.configure({ inline: false, allowBase64: false })
  ],
  editorProps: {
    attributes: {
      class: "admin-word-document site-document",
      spellcheck: "true"
    },
    // Persisted content intentionally supports one list level, so block unsupported indentation.
    handleKeyDown: (view, event) => {
      if (event.key !== "Tab") return false;
      const { $from } = view.state.selection;
      for (let depth = $from.depth; depth > 0; depth -= 1) {
        if ($from.node(depth).type.name === "listItem") {
          event.preventDefault();
          return true;
        }
      }
      return false;
    }
  },
  onUpdate: ({ editor: activeEditor }) => {
    revision.value += 1;
    refreshSelectedImage(activeEditor);
    if (syncingFromParent) return;
    emit("update:modelValue", richDocumentToBlocks(activeEditor.getJSON()));
    emit("change");
  },
  onSelectionUpdate: ({ editor: activeEditor }) => {
    revision.value += 1;
    refreshSelectedImage(activeEditor);
  },
  onTransaction: () => { revision.value += 1; }
});

watch(() => props.disabled, (value) => editor.value?.setEditable(!value, false));
watch(() => props.modelValue, (value) => {
  if (!editor.value) return;
  const current = richDocumentToBlocks(editor.value.getJSON());
  if (JSON.stringify(current) === JSON.stringify(value)) return;
  syncingFromParent = true;
  editor.value.commands.setContent(blocksToRichDocument(value) as any, { emitUpdate: false });
  syncingFromParent = false;
  revision.value += 1;
}, { deep: true });

const wordCount = computed(() => {
  void revision.value;
  return editor.value?.getText().replace(/\s/g, "").length || 0;
});
const canUndo = computed(() => {
  void revision.value;
  return Boolean(editor.value?.can().chain().focus().undo().run());
});
const canRedo = computed(() => {
  void revision.value;
  return Boolean(editor.value?.can().chain().focus().redo().run());
});

function active(nameOrAttrs: string | Record<string, unknown>, attrs?: Record<string, unknown>) {
  void revision.value;
  if (!editor.value) return false;
  return typeof nameOrAttrs === "string" ? editor.value.isActive(nameOrAttrs, attrs) : editor.value.isActive(nameOrAttrs);
}

function run(command: "undo" | "redo") {
  if (command === "undo") editor.value?.chain().focus().undo().run();
  else editor.value?.chain().focus().redo().run();
}

function toggle(command: "bold" | "italic" | "underline" | "strike" | "bulletList" | "orderedList" | "blockquote" | "codeBlock") {
  const chain = editor.value?.chain().focus();
  if (!chain) return;
  if (command === "bold") chain.toggleBold().run();
  else if (command === "italic") chain.toggleItalic().run();
  else if (command === "underline") chain.toggleUnderline().run();
  else if (command === "strike") chain.toggleStrike().run();
  else if (command === "bulletList") chain.toggleBulletList().run();
  else if (command === "orderedList") chain.toggleOrderedList().run();
  else if (command === "blockquote") chain.toggleBlockquote().run();
  else chain.toggleCodeBlock().run();
}

function setParagraph() { editor.value?.chain().focus().setParagraph().run(); }
function setHeading(level: 2 | 3) { editor.value?.chain().focus().toggleHeading({ level }).run(); }
function align(value: "left" | "center" | "right") { editor.value?.chain().focus().setTextAlign(value).run(); }

function openLinkEditor() {
  linkValue.value = String(editor.value?.getAttributes("link").href || "");
  linkError.value = "";
  showLinkEditor.value = true;
}

function applyLink() {
  const href = safeUrl(linkValue.value);
  if (!href) {
    linkError.value = "链接只允许使用 http、https 或站内路径";
    return;
  }
  editor.value?.chain().focus().extendMarkRange("link").setLink({ href }).run();
  showLinkEditor.value = false;
  linkError.value = "";
}

function removeLink() { editor.value?.chain().focus().extendMarkRange("link").unsetLink().run(); }

function refreshSelectedImage(activeEditor: any = editor.value) {
  if (!activeEditor) { selectedImage.value = null; return; }
  const selection = activeEditor.state.selection as any;
  if (selection.node?.type?.name !== "image") { selectedImage.value = null; return; }
  selectedImage.value = {
    alt: String(selection.node.attrs.alt || ""),
    caption: String(selection.node.attrs.caption || "")
  };
}

function updateImageAttribute(key: "alt" | "caption", value: string) {
  editor.value?.chain().focus().updateAttributes("image", { [key]: value }).run();
  if (selectedImage.value) selectedImage.value = { ...selectedImage.value, [key]: value };
}

function insertImage(media: AdminMedia) {
  editor.value?.chain().focus().insertContent({
    type: "image",
    attrs: {
      src: media.url,
      alt: media.altText || "正文图片",
      caption: media.caption || "",
      mediaId: media.id
    }
  }).run();
}

defineExpose({ insertImage });
</script>

<style scoped>
.admin-word-editor { min-width: 0; display: grid; gap: 12px; margin-top: 22px; padding-top: 20px; border-top: 1px solid var(--line); }
.admin-word-editor__header { display: flex; align-items: end; justify-content: space-between; gap: 16px; }
.admin-word-editor__header h3 { margin: 3px 0 0; font-size: 20px; }
.admin-word-editor__count { flex: 0 0 auto; color: var(--muted); font: 12px/1 var(--font-mono); }
.admin-word-editor__workbench { min-width: 0; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface-soft); box-shadow: var(--shadow-sm); }
.admin-word-toolbar { max-width: 100%; display: flex; flex-wrap: wrap; gap: 6px; padding: 10px; border-bottom: 1px solid var(--line); background: var(--surface); }
.admin-word-toolbar__group { min-width: 0; display: flex; align-items: center; gap: 2px; padding: 2px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface-soft); }
.admin-word-toolbar button { min-height: 30px; padding: 5px 8px; border: 0; border-radius: 4px; color: var(--ink-soft); background: transparent; font: 700 12px/1 var(--font-body); white-space: nowrap; cursor: pointer; }
.admin-word-toolbar button.is-icon { width: 30px; display: inline-grid; place-items: center; padding: 0; }
.admin-word-toolbar button :deep(svg) { width: 16px; height: 16px; stroke-width: 2; }
.admin-word-toolbar button:hover:not(:disabled) { color: var(--green-strong); background: var(--green-soft); }
.admin-word-toolbar button.is-active { color: #fff; background: var(--green); box-shadow: inset 0 0 0 1px var(--green-strong); }
.admin-word-toolbar button:disabled { opacity: .35; cursor: not-allowed; }
.admin-word-toolbar button:focus-visible { outline: 2px solid var(--green); outline-offset: 1px; }
.admin-word-link-editor { display: grid; grid-template-columns: minmax(180px, 1fr) auto auto; gap: 8px; align-items: center; padding: 10px; border-bottom: 1px solid var(--line); background: var(--surface-warm); }
.admin-word-link-editor > span { grid-column: 1 / -1; color: var(--red); font-size: 12px; }
.admin-word-paper-wrap { min-width: 0; padding: clamp(14px, 3vw, 30px); background: var(--surface-soft); }
.admin-word-paper { width: min(100%, 840px); min-height: 520px; margin: 0 auto; padding: clamp(28px, 5vw, 50px); overflow: hidden; border: 1px solid var(--line-strong); border-top: 3px solid var(--green-strong); border-radius: 7px; color: var(--ink); background: var(--surface); box-shadow: var(--shadow-md); }
.admin-word-paper :deep(.admin-word-document) { min-height: 390px; outline: none; }
.admin-word-paper :deep(img) { cursor: pointer; }
.admin-word-paper :deep(.ProseMirror-selectednode) { outline: 3px solid var(--green); outline-offset: 3px; }
.admin-word-paper :deep(.is-editor-empty:first-child::before) { height: 0; float: left; color: var(--muted); content: attr(data-placeholder); pointer-events: none; }
.admin-word-paper :deep(.admin-word-gallery-block), .admin-word-paper :deep(.admin-word-link-block) { margin: 1em 0; padding: 12px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface-soft); }
.admin-word-paper :deep(.admin-word-gallery-block__grid) { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; margin-top: 8px; }
.admin-word-paper :deep(.admin-word-gallery-block__grid img) { width: 100%; aspect-ratio: 16 / 10; margin: 0; object-fit: cover; }
.admin-word-paper :deep(.admin-word-link-block) { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 5px 9px; align-items: center; }
.admin-word-paper :deep(.admin-word-link-block__kind) { grid-row: 1 / span 2; padding: 4px 7px; border-radius: 4px; color: var(--green-strong); background: var(--green-soft); font-size: 11px; font-weight: 800; }
.admin-word-paper :deep(.admin-word-link-block code) { overflow: hidden; color: var(--muted); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.admin-word-image-fields { display: grid; grid-template-columns: minmax(170px, .8fr) minmax(0, 1fr) minmax(0, 1fr); gap: 10px; align-items: start; padding: 12px; border-top: 1px solid var(--line); background: var(--surface); }
.admin-word-image-fields strong, .admin-word-image-fields span { display: block; }
.admin-word-image-fields strong { color: var(--ink); font-size: 13px; }
.admin-word-image-fields span { margin-top: 3px; color: var(--muted); font-size: 11px; line-height: 1.45; }
@media (max-width: 720px) {
  .admin-word-editor__header { align-items: start; flex-direction: column; gap: 6px; }
  .admin-word-toolbar { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: thin; }
  .admin-word-toolbar__group { flex: 0 0 auto; }
  .admin-word-link-editor, .admin-word-image-fields { grid-template-columns: 1fr; }
  .admin-word-paper-wrap { padding: 10px; }
  .admin-word-paper { min-height: 430px; padding: 24px 18px; }
  .admin-word-paper :deep(.admin-word-document) { min-height: 360px; font-size: 15px; }
}
</style>
