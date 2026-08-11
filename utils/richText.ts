import type {
  ContentBlock,
  ContentInlineNode,
  ContentListItem,
  ContentMark,
  ContentMediaItem
} from "~/types/view-models";

type RichNode = Record<string, any>;

const markTypes = new Set<ContentMark["type"]>(["bold", "italic", "underline", "strike", "code", "link"]);

export function blocksToRichDocument(blocks: ContentBlock[] | null | undefined): RichNode {
  const content = (blocks || []).flatMap(blockToNodes);
  return {
    type: "doc",
    content: content.length ? content : [{ type: "paragraph" }]
  };
}

export function richDocumentToBlocks(document: RichNode): ContentBlock[] {
  return (document.content || []).flatMap(nodeToBlocks).slice(0, 200);
}

function blockToNodes(block: ContentBlock): RichNode[] {
  const inline = block.content?.length ? inlineToRich(block.content) : textToRich(block.text || "");
  const textAlign = validAlign(block.align) ? block.align : undefined;
  const hadInlineContent = Boolean(block.content?.length);
  switch (block.type) {
    case "heading":
      return [{
        type: "heading",
        attrs: nodeAttrs(block, {
          level: Number(block.level) === 3 ? 3 : 2,
          textAlign,
          hadInlineContent
        }),
        content: inline
      }];
    case "paragraph":
      return [{
        type: "paragraph",
        attrs: nodeAttrs(block, { textAlign, hadInlineContent }),
        content: inline
      }];
    case "bulletList":
      return [listNode("bulletList", listItems(block), block.id)];
    case "stepList":
      return [listNode("orderedList", listItems(block), block.id)];
    case "image":
      return block.src ? [imageNode(block, block.id)] : [];
    case "gallery": {
      const items = mediaItems(block).filter((item) => item.src).map(copyMediaItem);
      return items.length ? [{ type: "contentGallery", attrs: nodeAttrs(block, { items }) }] : [];
    }
    case "callout":
      return [{
        type: "blockquote",
        attrs: nodeAttrs(block, { tone: block.tone || "info", hadInlineContent }),
        content: [{ type: "paragraph", content: inline }]
      }];
    case "code":
      return [{ type: "codeBlock", attrs: nodeAttrs(block), content: textToRich(block.text || "") }];
    case "link":
    case "action": {
      const label = String(block.label || block.url || "").trim();
      return label ? [{
        type: "contentLink",
        attrs: nodeAttrs(block, { blockType: block.type, label, url: String(block.url || "").trim() })
      }] : [];
    }
    default:
      return [];
  }
}

function nodeToBlocks(node: RichNode): ContentBlock[] {
  const align = validAlign(node.attrs?.textAlign) ? node.attrs.textAlign as ContentBlock["align"] : undefined;
  switch (node.type) {
    case "heading":
      return textNodeBlock(node, "heading", {
        level: Number(node.attrs?.level) === 3 ? 3 : 2,
        ...(align ? { align } : {})
      });
    case "paragraph":
      return textNodeBlock(node, "paragraph", align ? { align } : {});
    case "bulletList":
      return listBlock("bulletList", node);
    case "orderedList":
      return listBlock("stepList", node);
    case "blockquote": {
      const inline = richToInline(flattenInline(node));
      const text = inlineText(inline);
      if (!text) return [];
      const block = withBlockId(node, {
        type: "callout",
        tone: String(node.attrs?.tone || "info"),
        text
      });
      if (node.attrs?.hadInlineContent || hasRichInline(inline)) block.content = inline;
      return [block];
    }
    case "codeBlock": {
      const text = richText(node);
      return text ? [withBlockId(node, { type: "code", text })] : [];
    }
    case "image": {
      const src = String(node.attrs?.src || "").trim();
      const mediaId = Number(node.attrs?.mediaId);
      if (!src) return [];
      const block = withBlockId(node, {
        type: "image",
        src,
        alt: String(node.attrs?.alt || "正文图片").trim() || "正文图片",
        caption: String(node.attrs?.caption || "").trim()
      });
      if (Number.isSafeInteger(mediaId) && mediaId > 0) block.mediaId = mediaId;
      return [block];
    }
    case "contentGallery": {
      const items = Array.isArray(node.attrs?.items)
        ? node.attrs.items.filter(isMediaItem).map(copyMediaItem)
        : [];
      return items.length ? [withBlockId(node, { type: "gallery", items })] : [];
    }
    case "contentLink": {
      const blockType = node.attrs?.blockType === "action" ? "action" : "link";
      const label = String(node.attrs?.label || "").trim();
      const url = String(node.attrs?.url || "").trim();
      return label ? [withBlockId(node, { type: blockType, label, url })] : [];
    }
    default:
      return [];
  }
}

function textNodeBlock(node: RichNode, type: "heading" | "paragraph", extra: Partial<ContentBlock>): ContentBlock[] {
  const inline = richToInline(node.content || []);
  const text = richText(node);
  if (!text) return [];
  const block = withBlockId(node, { type, text, ...extra });
  if (node.attrs?.hadInlineContent || hasRichInline(inline)) block.content = inline;
  return [block];
}

function inlineToRich(nodes: ContentInlineNode[]): RichNode[] {
  const result: RichNode[] = [];
  for (const node of nodes) {
    if (node.type === "hardBreak") result.push({ type: "hardBreak" });
    else if (node.type === "text" && node.text) {
      result.push({ type: "text", text: node.text, marks: (node.marks || []).flatMap(markToRich) });
    }
  }
  return result;
}

function richToInline(nodes: RichNode[]): ContentInlineNode[] {
  const result: ContentInlineNode[] = [];
  for (const node of nodes) {
    if (node.type === "hardBreak") result.push({ type: "hardBreak" });
    else if (node.type === "text" && node.text) {
      const marks = (node.marks || []).flatMap(markFromRich);
      result.push({ type: "text", text: node.text, ...(marks.length ? { marks } : {}) });
    }
  }
  return result;
}

function markToRich(mark: ContentMark): RichNode[] {
  if (!markTypes.has(mark.type)) return [];
  if (mark.type === "link") {
    const href = safeUrl(mark.attrs?.href);
    if (!href) return [];
    return [{
      type: "link",
      attrs: {
        href,
        ...(mark.attrs?.target ? { target: mark.attrs.target } : {}),
        rel: "noopener noreferrer"
      }
    }];
  }
  return [{ type: mark.type }];
}

function markFromRich(mark: { type?: string; attrs?: Record<string, unknown> }): ContentMark[] {
  const type = mark.type as ContentMark["type"];
  if (!markTypes.has(type)) return [];
  if (type === "link") {
    const href = safeUrl(mark.attrs?.href);
    if (!href) return [];
    const target = typeof mark.attrs?.target === "string" ? mark.attrs.target : undefined;
    return [{ type, attrs: { href, ...(target ? { target } : {}) } }];
  }
  return [{ type }];
}

function textToRich(value: string): RichNode[] {
  if (!value) return [];
  const lines = value.split("\n");
  return lines.flatMap((line, index) => [
    ...(index ? [{ type: "hardBreak" }] : []),
    ...(line ? [{ type: "text", text: line }] : [])
  ]);
}

function listNode(type: "bulletList" | "orderedList", items: Array<string | ContentListItem>, blockId?: string): RichNode {
  return {
    type,
    attrs: blockId ? { blockId } : {},
    content: items.map((item) => {
      const content = typeof item === "string"
        ? textToRich(item)
        : item.content?.length ? inlineToRich(item.content) : textToRich(item.text || "");
      return { type: "listItem", content: [{ type: "paragraph", content }] };
    })
  };
}

function listBlock(type: "bulletList" | "stepList", node: RichNode): ContentBlock[] {
  const items = (node.content || []).flatMap((item: RichNode) => {
    const inline = richToInline(flattenInline(item));
    const text = inlineText(inline).trim();
    if (!text) return [];
    return [hasRichInline(inline) ? { text, content: inline } : text];
  }).slice(0, 100) as Array<string | ContentListItem>;
  return items.length ? [withBlockId(node, { type, items })] : [];
}

function imageNode(item: ContentBlock | ContentMediaItem, blockId?: string): RichNode {
  return {
    type: "image",
    attrs: {
      ...(blockId ? { blockId } : {}),
      src: item.src,
      alt: item.alt || "正文图片",
      caption: item.caption || "",
      mediaId: item.mediaId || null
    }
  };
}

function listItems(block: ContentBlock): Array<string | ContentListItem> {
  const items = (block.items || []).filter((item): item is string | ContentListItem =>
    typeof item === "string" || isListItem(item)
  );
  return items.length
    ? items
    : String(block.itemsText || "").split("\n").map((item) => item.trim()).filter(Boolean);
}

function mediaItems(block: ContentBlock): ContentMediaItem[] {
  return (block.items || []).filter(isMediaItem);
}

function isListItem(item: unknown): item is ContentListItem {
  return typeof item === "object" && item !== null && ("text" in item || "content" in item);
}

function isMediaItem(item: unknown): item is ContentMediaItem {
  return typeof item === "object" && item !== null && ("mediaId" in item || "src" in item);
}

function copyMediaItem(item: ContentMediaItem): ContentMediaItem {
  return {
    ...(item.mediaId ? { mediaId: item.mediaId } : {}),
    ...(item.src ? { src: item.src } : {}),
    ...(item.alt ? { alt: item.alt } : {}),
    ...(item.caption ? { caption: item.caption } : {})
  };
}

function richText(node: RichNode): string {
  if (node.type === "text") return node.text || "";
  if (node.type === "hardBreak") return "\n";
  return (node.content || []).map(richText).join(node.type === "listItem" ? " " : "");
}

function flattenInline(node: RichNode): RichNode[] {
  return (node.content || []).flatMap((child: RichNode, index: number) => {
    if (child.type === "paragraph" || child.type === "heading") {
      return [...(index ? [{ type: "hardBreak" }] : []), ...(child.content || [])];
    }
    return child.content?.length ? flattenInline(child) : [child];
  });
}

function inlineText(nodes: ContentInlineNode[]): string {
  return nodes.map((node) => node.type === "hardBreak" ? "\n" : node.text || "").join("");
}

function hasRichInline(nodes: ContentInlineNode[]): boolean {
  return nodes.some((node) => node.type === "hardBreak" || Boolean(node.marks?.length));
}

function nodeAttrs(block: ContentBlock, extra: Record<string, unknown> = {}): Record<string, unknown> {
  return Object.fromEntries(Object.entries({
    ...(block.id ? { blockId: block.id } : {}),
    ...extra
  }).filter(([, value]) => value !== undefined));
}

function withBlockId(node: RichNode, block: ContentBlock): ContentBlock {
  const blockId = String(node.attrs?.blockId || "").trim();
  return blockId ? { id: blockId, ...block } : block;
}

function validAlign(value: unknown): value is NonNullable<ContentBlock["align"]> {
  return ["left", "center", "right", "justify"].includes(String(value));
}

export function safeUrl(value: unknown): string {
  const url = String(value || "").trim();
  if (url.startsWith("https://") || url.startsWith("http://")) return url;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  return "";
}
