export type ServerStatus = "online" | "available" | "maintenance" | "offline";
export type ServerCategory = "activity" | "permanent";

export interface ContentMediaItem {
  mediaId?: number;
  src?: string;
  alt?: string;
  caption?: string;
}

export interface ContentMark {
  type: "bold" | "italic" | "underline" | "strike" | "code" | "link";
  attrs?: {
    href?: string;
    target?: string;
  };
}

export interface ContentInlineNode {
  type: "text" | "hardBreak";
  text?: string;
  marks?: ContentMark[];
}

export interface ContentListItem {
  text?: string;
  content?: ContentInlineNode[];
}

export interface ContentBlock {
  id?: string;
  type: string;
  level?: number | string;
  text?: string;
  items?: Array<string | ContentMediaItem | ContentListItem>;
  itemsText?: string;
  mediaId?: number;
  src?: string;
  alt?: string;
  caption?: string;
  tone?: string;
  label?: string;
  url?: string;
  content?: ContentInlineNode[];
  align?: "left" | "center" | "right" | "justify";
}

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
  iconUrl?: string | null;
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
  iconUrl?: string | null;
  coverImageUrl?: string | null;
  blocks?: ContentBlock[] | null;
}

export interface AnnouncementViewModel {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  publishedAt: string | null;
  summary: string;
  priority: number;
  pinned?: boolean;
  coverImageUrl?: string | null;
  blocks?: ContentBlock[] | null;
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
  image?: string | null;
  alt: string;
  featured?: boolean;
  coverImageUrl?: string | null;
  blocks?: ContentBlock[] | null;
}

export interface WikiViewModel {
  id: string;
  title: string;
  note: string;
  icon: string;
  group?: string;
  linkUrl?: string | null;
  content: string;
  iconUrl?: string | null;
  blocks?: ContentBlock[] | null;
}

export interface IdeaViewModel {
  id: number;
  nickname: string;
  title: string;
  category: string;
  description: string;
  status: string;
  publicReply?: string | null;
  relatedSlug?: string | null;
  likes: number;
  createdAt: string;
}
