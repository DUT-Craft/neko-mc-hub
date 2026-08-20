import { activities, announcements, galleryItems, managers, servers } from "~/data/demo-content";
import { computed, readonly } from "vue";
import type { ApiEnvelope } from "~/types/admin";
import type { ActivityViewModel, AnnouncementViewModel, GalleryItemViewModel, ManagerViewModel, ServerViewModel, WikiViewModel } from "~/types/view-models";

interface PublicHomePayload {
  servers: ServerViewModel[];
  activities: ActivityViewModel[];
  announcements: Array<AnnouncementViewModel & { content?: string; publishedAt: string | null }>;
  managers: ManagerViewModel[];
  history: GalleryItemViewModel[];
  totalOnline: number;
  wiki: WikiViewModel[];
}

const fallbackContent: PublicHomePayload = {
  servers,
  activities,
  announcements,
  managers,
  history: galleryItems,
  wiki: [],
  totalOnline: servers.reduce((sum, server) => sum + server.online, 0)
};

const emptyContent: PublicHomePayload = {
  servers: [], activities: [], announcements: [], managers: [], history: [], wiki: [], totalOnline: 0
};

export function useDemoContent() {
  const config = useRuntimeConfig();
  const demoFallbackEnabled = config.public.demoFallback === true;
  const hydrated = useState("public-content-hydrated", () => false);
  const { data, pending: requestPending, error, refresh } = useAsyncData<PublicHomePayload | null>("public-home-content", async () => {
    const apiBase = String(import.meta.server ? config.apiBaseInternal : config.public.apiBase || "").replace(/\/$/, "");
    const response = await $fetch<ApiEnvelope<PublicHomePayload>>(`${apiBase}/api/public/home`, {
      credentials: "include",
      timeout: 5000
    });
    if (response.status >= 400) throw new Error(response.message || "实时数据读取失败");
    return response.data;
  }, { default: () => null });

  onMounted(() => { hydrated.value = true; });

  const content = computed(() => data.value || (demoFallbackEnabled ? fallbackContent : emptyContent));
  const sortedServers = computed(() => [...content.value.servers].sort((a, b) => {
    const aOnline = a.online > 0 ? 1 : 0;
    const bOnline = b.online > 0 ? 1 : 0;
    return bOnline - aOnline || Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.online - a.online;
  }));

  const onlineServers = computed(() => sortedServers.value.filter((server) => server.online > 0));
  const sortedActivities = computed(() => [...content.value.activities].sort((a, b) =>
    activityStatusRank(a.status) - activityStatusRank(b.status) || b.priority - a.priority
  ));
  const weeklyActivity = computed(() => sortedActivities.value.find((activity) => activity.kind === "weekly" && activity.status !== "paused"));
  const longTermActivities = computed(() => sortedActivities.value.filter((activity) => activity.kind === "long-term"));
  const limitedActivities = computed(() => sortedActivities.value.filter((activity) => activity.kind === "limited"));
  const sortedAnnouncements = computed(() => [...content.value.announcements]
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || b.priority - a.priority)
    .map((item) => ({ ...item, publishedAt: formatPublishedAt(item.publishedAt) })));
  const totalOnline = computed(() => content.value.totalOnline ?? sortedServers.value.reduce((sum, server) => sum + server.online, 0));

  return {
    servers: sortedServers,
    onlineServers,
    activities: sortedActivities,
    weeklyActivity,
    longTermActivities,
    limitedActivities,
    announcements: sortedAnnouncements,
    managers: computed(() => readonly(content.value.managers)),
    galleryItems: computed(() => readonly(content.value.history)),
    wiki: computed(() => readonly(content.value.wiki || [])),
    totalOnline,
    isRemote: computed(() => Boolean(data.value)),
    isDemo: computed(() => hydrated.value && !data.value && demoFallbackEnabled && !requestPending.value),
    isUnavailable: computed(() => hydrated.value && !data.value && !demoFallbackEnabled && !requestPending.value),
    pending: computed(() => hydrated.value && requestPending.value),
    error,
    refresh
  };
}

function formatPublishedAt(value: string | null) {
  if (!value) return "未标注时间";
  if (!value.includes("T")) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "时间格式错误" : date.toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Shanghai"
  });
}

function activityStatusRank(status: ActivityViewModel["status"]) {
  return ({ active: 0, ongoing: 1, upcoming: 2, paused: 3 } as const)[status];
}
