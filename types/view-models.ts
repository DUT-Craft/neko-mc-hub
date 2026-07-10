export type ServerStatus = "online" | "available" | "maintenance" | "offline";
export type ServerCategory = "activity" | "permanent";

export interface ServerViewModel {
  id: string;
  name: string;
  gameplay: string;
  category: ServerCategory;
  status: ServerStatus;
  statusLabel: string;
  online: number;
  capacity: number;
  address: string;
  version: string;
  pack: string;
  description: string;
  rules: string;
  icon: string;
  featured?: boolean;
}

export interface ActivityViewModel {
  id: string;
  name: string;
  kind: "weekly" | "long-term" | "limited";
  status: "active" | "upcoming" | "ongoing" | "paused";
  statusLabel: string;
  serverId: string;
  time: string;
  participation: string;
  description: string;
  icon: string;
  requiresPack?: boolean;
  priority: number;
}

export interface AnnouncementViewModel {
  id: string;
  title: string;
  category: "event" | "maintenance" | "update" | "club";
  categoryLabel: string;
  publishedAt: string;
  summary: string;
  priority: number;
}

export interface ManagerViewModel {
  id: string;
  name: string;
  contact: string;
  responsibilities: string;
}

export type ApplicationKind = "skin" | "server" | "duty";

export interface ApplicationFormModel {
  kind: ApplicationKind;
  name: string;
  studentId?: string;
  qq: string;
  minecraftId?: string;
  reason?: string;
  participantCount?: string;
  purpose?: string;
  expectedTime?: string;
  requirements?: string;
  availableTime?: string;
  skill?: string;
}

export interface GalleryItemViewModel {
  id: string;
  title: string;
  meta: string;
  image: string;
  alt: string;
  featured?: boolean;
}
