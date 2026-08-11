import type { ContentBlock, ContentListItem, ContentMediaItem } from "~/types/view-models";

export function normalizeContentBlocks(blocks: ContentBlock[] | null | undefined, fallbackText = ""): ContentBlock[] {
  const source = blocks?.length ? blocks : (fallbackText ? [{ type: "paragraph", text: fallbackText }] : []);
  return source.map((block, index) => {
    const normalized: ContentBlock = { ...block, id: block.id || `${block.type}-${index}` };
    if (block.type === "bulletList" || block.type === "stepList") normalized.items = listItems(block);
    if (block.type === "gallery") normalized.items = (block.items || []).filter(isMediaItem).map((item) => ({ ...item }));
    return normalized;
  });
}

function listItems(block: ContentBlock): Array<string | ContentListItem> {
  const fromItems = (block.items || []).filter((item): item is string | ContentListItem =>
    typeof item === "string" || isListItem(item)
  );
  if (fromItems.length) return fromItems;
  return String(block.itemsText || "").split("\n").map((item) => item.trim()).filter(Boolean);
}

function isListItem(value: unknown): value is ContentListItem {
  return typeof value === "object" && value !== null && ("text" in value || "content" in value);
}

function isMediaItem(value: unknown): value is ContentMediaItem {
  return typeof value === "object" && value !== null && ("mediaId" in value || "src" in value);
}
