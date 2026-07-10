import { activities, announcements, galleryItems, managers, servers } from "~/data/demo-content";
import { computed, readonly } from "vue";

export function useDemoContent() {
  const sortedServers = computed(() => [...servers].sort((a, b) => {
    const aOnline = a.online > 0 ? 1 : 0;
    const bOnline = b.online > 0 ? 1 : 0;
    return bOnline - aOnline || Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.online - a.online;
  }));

  const onlineServers = computed(() => sortedServers.value.filter((server) => server.online > 0));
  const weeklyActivity = computed(() => [...activities].sort((a, b) => b.priority - a.priority).find((activity) => activity.kind === "weekly"));
  const longTermActivities = computed(() => activities.filter((activity) => activity.kind === "long-term").sort((a, b) => b.priority - a.priority));
  const limitedActivities = computed(() => activities.filter((activity) => activity.kind === "limited").sort((a, b) => b.priority - a.priority));
  const sortedAnnouncements = computed(() => [...announcements].sort((a, b) => b.priority - a.priority));
  const totalOnline = computed(() => servers.reduce((sum, server) => sum + server.online, 0));

  return {
    servers: sortedServers,
    onlineServers,
    weeklyActivity,
    longTermActivities,
    limitedActivities,
    announcements: sortedAnnouncements,
    managers: readonly(managers),
    galleryItems: readonly(galleryItems),
    totalOnline
  };
}
