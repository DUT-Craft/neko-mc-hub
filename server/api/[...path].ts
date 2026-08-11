import { getRequestURL, proxyRequest } from "h3";

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const backendBase = String(config.apiBaseInternal).replace(/\/$/, "");
  const requestUrl = getRequestURL(event);

  return proxyRequest(
    event,
    `${backendBase}${requestUrl.pathname}${requestUrl.search}`,
  );
});
