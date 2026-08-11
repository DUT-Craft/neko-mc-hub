export interface ApiEnvelope<T> {
  status: number;
  message: string;
  data: T;
}

export interface SessionUser {
  authenticated: boolean;
  id?: number;
  username?: string;
  displayName?: string;
  role?: string;
  authSource?: string;
}

export type AdminMe = SessionUser;

export interface AdminOverview {
  servers: number;
  maintenanceServers: number;
  pendingApplications: number;
  pendingIdeas: number;
  pendingRegistrations: number;
  openFeedback: number;
  publishedAnnouncements: number;
}

export interface AdminApplication {
  id: number;
  userId?: number | null;
  kind: string;
  name: string;
  studentId?: string | null;
  qq: string;
  minecraftId?: string | null;
  reason?: string | null;
  participantCount?: string | null;
  purpose?: string | null;
  expectedTime?: string | null;
  requirements?: string | null;
  availableTime?: string | null;
  skill?: string | null;
  status: string;
  adminNote?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminIdea {
  id: number;
  userId?: number | null;
  nickname: string;
  title: string;
  category: string;
  description: string;
  status: string;
  publicReply?: string | null;
  relatedSlug?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminRegistration {
  id: number;
  activitySlug: string;
  userId?: number | null;
  minecraftId: string;
  qq: string;
  status: string;
  adminNote?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminFeedback {
  id: number;
  userId?: number | null;
  body: string;
  status: string;
  adminNote?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuditLog {
  id: number;
  operatorUserId: number;
  resourceType: string;
  resourceId: string;
  action: string;
  createdAt: string;
}

export type AdminRow = Record<string, unknown> & { id?: number | string };

export type AdminFieldType = "text" | "textarea" | "number" | "select" | "boolean";

export interface AdminFieldOption {
  label: string;
  value: string;
}

export interface AdminField {
  key: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  full?: boolean;
  placeholder?: string;
  options?: AdminFieldOption[];
  help?: string;
  maxLength?: number;
}

export interface AdminColumn {
  key: string;
  label: string;
  fallback?: string;
}

export interface AdminResourceDefinition {
  key: string;
  title: string;
  description: string;
  endpoint: string;
  columns: AdminColumn[];
  fields: AdminField[];
  readOnly?: boolean;
  dedicatedEditor?: boolean;
}

export interface AdminMedia {
  id: number;
  url: string;
  purpose: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
  caption?: string | null;
}

export interface AdminDraft {
  id: string;
  resourceType: string;
  resourceId?: number | null;
  version: number;
  payload: Record<string, any>;
  media: AdminMedia[];
  hasPreviousVersion: boolean;
  updatedAt: string;
}

export interface AdminReviewItem {
  id: number;
  title: string;
  person: string;
  detail: string;
  createdAt: string;
  status: string;
  note?: string | null;
  privateDetail?: string;
}
