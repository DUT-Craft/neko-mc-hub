export function useSitePath() {
  const config = useRuntimeConfig();
  const base = config.app.baseURL.endsWith("/") ? config.app.baseURL : `${config.app.baseURL}/`;
  return (path: string) => `${base}${path.replace(/^\//, "")}`;
}
