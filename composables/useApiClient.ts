import type { ApiEnvelope } from "~/types/admin";

export type ApiRequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions {
  method?: ApiRequestMethod;
  body?: unknown;
}

interface ApiClientOptions {
  onUnauthorized?: () => void;
}

export function useApiClient(options: ApiClientOptions = {}) {
  const config = useRuntimeConfig();

  function baseUrl() {
    return String(config.public.apiBase || "").replace(/\/$/, "");
  }

  async function request<T>(path: string, requestOptions: ApiRequestOptions = {}): Promise<T> {
    try {
      const response = await $fetch<ApiEnvelope<T>>(`${baseUrl()}${path}`, {
        method: requestOptions.method || "GET",
        body: requestOptions.body as Record<string, any> | undefined,
        headers: { Accept: "application/json" },
        credentials: "include",
        timeout: 12000
      });
      if (response.status >= 400) throw new Error(response.message || "请求失败");
      return response.data;
    } catch (error: unknown) {
      handleAuthError(error);
      throw error;
    }
  }

  async function upload<T>(path: string, body: FormData): Promise<T> {
    try {
      const response = await $fetch<ApiEnvelope<T>>(`${baseUrl()}${path}`, {
        method: "POST",
        body,
        headers: { Accept: "application/json" },
        credentials: "include",
        timeout: 30000
      });
      if (response.status >= 400) throw new Error(response.message || "上传失败");
      return response.data;
    } catch (error: unknown) {
      handleAuthError(error);
      throw error;
    }
  }

  function handleAuthError(error: unknown) {
    const status = getApiErrorStatus(error);
    if (status === 401 || status === 403) options.onUnauthorized?.();
  }

  return { request, upload };
}

export function getApiErrorStatus(error: unknown) {
  if (!error || typeof error !== "object") return undefined;
  const candidate = error as { status?: number; statusCode?: number; response?: { status?: number } };
  return candidate.status || candidate.statusCode || candidate.response?.status;
}

export function getApiErrorMessage(error: unknown, fallback = "请求失败") {
  if (!error || typeof error !== "object") return fallback;
  const candidate = error as { data?: { message?: string }; message?: string };
  const responseMessage = candidate.data?.message?.trim();
  if (responseMessage) return responseMessage;

  const message = candidate.message?.trim();
  if (!message || isTechnicalTransportMessage(message)) return fallback;
  return message;
}

function isTechnicalTransportMessage(message: string) {
  return (
    /^\[(?:GET|POST|PUT|PATCH|DELETE)\]\s/i.test(message) ||
    /\b(?:fetch failed|failed to fetch|network(?:error| request failed)?|load failed|timeout|timed out|abort(?:ed|error)?)\b/i.test(
      message
    )
  );
}
