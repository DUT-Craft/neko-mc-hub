import { Fragment, defineComponent, h, type PropType, type VNodeChild } from "vue";
import { useSitePath } from "~/composables/useSitePath";
import { safeUrl } from "~/utils/richText";
import type { ContentInlineNode, ContentMark } from "~/types/view-models";

export default defineComponent({
  name: "ContentInlineRenderer",
  props: {
    nodes: {
      type: Array as PropType<ContentInlineNode[]>,
      default: () => []
    }
  },
  setup(props) {
    const sitePath = useSitePath();

    function applyMark(child: VNodeChild, mark: ContentMark): VNodeChild {
      if (mark.type === "bold") return h("strong", null, [child] as any);
      if (mark.type === "italic") return h("em", null, [child] as any);
      if (mark.type === "underline") return h("u", null, [child] as any);
      if (mark.type === "strike") return h("s", null, [child] as any);
      if (mark.type === "code") return h("code", { class: "content-inline-code" }, [child] as any);
      if (mark.type === "link") {
        const href = safeUrl(mark.attrs?.href);
        if (!href) return child;
        const external = href.startsWith("http://") || href.startsWith("https://");
        return h("a", {
          href: external ? href : sitePath(href),
          target: external ? "_blank" : undefined,
          rel: external ? "noopener noreferrer" : undefined
        }, [child] as any);
      }
      return child;
    }

    function renderNode(node: ContentInlineNode, index: number): VNodeChild {
      if (node.type === "hardBreak") return h("br", { key: `br-${index}` });
      let child: VNodeChild = node.text || "";
      for (const mark of node.marks || []) child = applyMark(child, mark);
      return h(Fragment, { key: `text-${index}` }, [child]);
    }

    return () => h(Fragment, null, props.nodes.map(renderNode));
  }
});
