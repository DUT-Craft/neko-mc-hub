import { describe, expect, it } from "vitest";
import { blocksToRichDocument, richDocumentToBlocks } from "./richText";
import type { ContentBlock } from "../types/view-models";

describe("Word document conversion", () => {
  it("preserves structured blocks and list formatting across a round trip", () => {
    const blocks: ContentBlock[] = [
      {
        id: "list-1",
        type: "bulletList",
        items: [
          "普通列表项",
          {
            text: "查看规则",
            content: [
              { type: "text", text: "查看", marks: [{ type: "bold" }] },
              { type: "text", text: "规则", marks: [{ type: "link", attrs: { href: "/wiki/rules" } }] }
            ]
          }
        ]
      },
      {
        id: "gallery-1",
        type: "gallery",
        items: [
          { mediaId: 7, src: "/api/public/media/one.webp", alt: "第一张", caption: "说明" },
          { mediaId: 8, src: "/api/public/media/two.webp", alt: "第二张" }
        ]
      },
      { id: "warning-1", type: "callout", tone: "warning", text: "维护前请退出服务器" },
      { id: "action-1", type: "action", label: "查看规则", url: "/wiki/rules" },
      { id: "link-1", type: "link", label: "外部文档", url: "https://example.com/docs" }
    ];

    const restored = richDocumentToBlocks(blocksToRichDocument(blocks));

    expect(restored).toEqual(blocks);
  });

  it("keeps inline marks added inside a list item", () => {
    const document = blocksToRichDocument([{ type: "bulletList", items: ["新列表项"] }]);
    document.content[0]!.content[0]!.content[0]!.content[0]!.marks = [{ type: "bold" }];

    expect(richDocumentToBlocks(document)[0]!.items).toEqual([
      { text: "新列表项", content: [{ type: "text", text: "新列表项", marks: [{ type: "bold" }] }] }
    ]);
  });

  it("preserves legacy images that have a URL but no managed media ID", () => {
    const blocks: ContentBlock[] = [
      {
        id: "legacy-image",
        type: "image",
        src: "/legacy/announcement.webp",
        alt: "旧公告图片",
        caption: "历史内容"
      },
      {
        id: "legacy-gallery",
        type: "gallery",
        items: [
          { src: "/legacy/one.webp", alt: "第一张" },
          { src: "/legacy/two.webp", alt: "第二张", caption: "保留说明" }
        ]
      }
    ];

    expect(richDocumentToBlocks(blocksToRichDocument(blocks))).toEqual(blocks);
  });
});
