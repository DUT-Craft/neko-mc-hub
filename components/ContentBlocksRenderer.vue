<template>
  <div class="content-renderer site-document">
    <template v-for="(block, index) in blocks" :key="block.id || block.type + '-' + index">
      <h2 v-if="block.type === 'heading' && Number(block.level) === 2" :style="textAlign(block.align)"><ContentInlineRenderer v-if="block.content?.length" :nodes="block.content" /><template v-else>{{ block.text }}</template></h2>
      <h3 v-else-if="block.type === 'heading'" :style="textAlign(block.align)"><ContentInlineRenderer v-if="block.content?.length" :nodes="block.content" /><template v-else>{{ block.text }}</template></h3>
      <p v-else-if="block.type === 'paragraph'" :style="textAlign(block.align)"><ContentInlineRenderer v-if="block.content?.length" :nodes="block.content" /><template v-else>{{ block.text }}</template></p>
      <ul v-else-if="block.type === 'bulletList'">
        <li v-for="(item, itemIndex) in listItems(block)" :key="itemIndex">
          <ContentInlineRenderer v-if="typeof item !== 'string' && item.content?.length" :nodes="item.content" />
          <template v-else>{{ typeof item === "string" ? item : item.text }}</template>
        </li>
      </ul>
      <ol v-else-if="block.type === 'stepList'">
        <li v-for="(item, itemIndex) in listItems(block)" :key="itemIndex">
          <ContentInlineRenderer v-if="typeof item !== 'string' && item.content?.length" :nodes="item.content" />
          <template v-else>{{ typeof item === "string" ? item : item.text }}</template>
        </li>
      </ol>
      <figure v-else-if="block.type === 'image' && safeImageSource(block.src)">
        <img :src="safeImageSource(block.src)" :alt="block.alt || '内容图片'" loading="lazy" />
        <figcaption v-if="block.caption">{{ block.caption }}</figcaption>
      </figure>
      <div v-else-if="block.type === 'gallery' && mediaItems(block).length" class="content-renderer__gallery">
        <figure v-for="(item, itemIndex) in mediaItems(block)" :key="item.mediaId || item.src || itemIndex">
          <img :src="safeImageSource(item.src)" :alt="item.alt || '活动图片'" loading="lazy" />
          <figcaption v-if="item.caption">{{ item.caption }}</figcaption>
        </figure>
      </div>
      <div v-else-if="block.type === 'callout'" class="content-renderer__callout" :class="'is-' + (block.tone || 'info')"><ContentInlineRenderer v-if="block.content?.length" :nodes="block.content" /><template v-else>{{ block.text }}</template></div>
      <pre v-else-if="block.type === 'code'"><code>{{ block.text }}</code></pre>
      <a
        v-else-if="block.type === 'link' && safeHref(block.url)"
        :href="safeHref(block.url)"
        :target="isExternal(block.url) ? '_blank' : undefined"
        :rel="isExternal(block.url) ? 'noopener noreferrer' : undefined"
      >{{ block.label || block.url }}</a>
      <NButton
        v-else-if="block.type === 'action' && safeHref(block.url)"
        class="content-renderer__action"
        type="primary"
        tag="a"
        :href="safeHref(block.url)"
        :target="isExternal(block.url) ? '_blank' : undefined"
        :rel="isExternal(block.url) ? 'noopener noreferrer' : undefined"
      >{{ block.label || "打开链接" }}</NButton>
    </template>
  </div>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import { useSitePath } from "~/composables/useSitePath";
import ContentInlineRenderer from "~/components/ContentInlineRenderer";
import type { ContentBlock, ContentListItem, ContentMediaItem } from "~/types/view-models";

defineProps<{ blocks: ContentBlock[] }>();
const sitePath = useSitePath();

function listItems(block: ContentBlock): Array<string | ContentListItem> {
  return (block.items || []).filter((item): item is string | ContentListItem =>
    typeof item === "string" || (
      typeof item === "object" && item !== null && ("text" in item || "content" in item)
    )
  );
}

function mediaItems(block: ContentBlock): ContentMediaItem[] {
  return (block.items || []).filter((item): item is ContentMediaItem =>
    typeof item === "object" && item !== null && "src" in item && Boolean(safeImageSource(item.src))
  );
}

function safeHref(value: unknown) {
  const url = String(value || "").trim();
  if (url.startsWith("https://") || url.startsWith("http://")) return url;
  if (url.startsWith("/") && !url.startsWith("//")) return sitePath(url);
  return "";
}

function safeImageSource(value: unknown) {
  return safeHref(value);
}

function isExternal(value: unknown) {
  const url = String(value || "").trim();
  return url.startsWith("https://") || url.startsWith("http://");
}

function textAlign(value: unknown) {
  const align = String(value || "");
  return ["left", "center", "right", "justify"].includes(align) ? { textAlign: align as any } : undefined;
}
</script>

<style scoped>
.content-renderer { min-width: 0; }
.content-renderer figure { margin: 0; display: grid; gap: 6px; }
.content-renderer__gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.content-renderer__gallery figure { align-content: start; }
.content-renderer__gallery img { aspect-ratio: 16 / 10; object-fit: cover; }
.content-renderer__callout.is-warning { border-color: var(--yellow); background: rgb(214 162 40 / 12%); }
.content-renderer__action { justify-self: start; }
@media (max-width: 640px) { .content-renderer__gallery { grid-template-columns: 1fr; } }
</style>
