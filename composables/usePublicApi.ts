import type { ApiEnvelope } from "~/types/admin";
import { activities, announcements, galleryItems } from "~/data/demo-content";

export function usePublicApi() {
  const config = useRuntimeConfig();
  const demoFallbackEnabled = config.public.demoFallback === true;

  function baseUrl() {
    const configured = import.meta.server ? config.apiBaseInternal : config.public.apiBase;
    return String(configured || "").replace(/\/$/, "");
  }

  async function request<T>(path: string) {
    try {
      const response = await $fetch<ApiEnvelope<T>>(`${baseUrl()}${path}`, {
        credentials: "include",
        timeout: 8000
      });
      if (response.status >= 400) throw new Error(response.message || "内容读取失败");
      return response.data;
    } catch (error) {
      const fallback = demoFallbackEnabled ? demoDetail(path) : undefined;
      if (fallback) return fallback as T;
      throw error;
    }
  }

  return { request };
}

function demoDetail(path: string) {
  if (path === "/api/public/ideas") return [];
  const match = /^\/api\/public\/(activities|announcements|history)\/([^/?#]+)$/.exec(path);
  if (!match) return undefined;
  const resource = match[1];
  const encodedSlug = match[2];
  if (!resource || !encodedSlug) return undefined;
  const slug = decodeURIComponent(encodedSlug);
  const sources = { activities, announcements, history: galleryItems };
  return sources[resource as keyof typeof sources].find((item) => item.id === slug);
}
