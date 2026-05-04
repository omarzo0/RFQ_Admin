/* ═══════════════════════════════════════════
   TICKETS FEATURE — TYPES
   Matches 8 admin ticket endpoints
   ═══════════════════════════════════════════ */

/* ──────── Shared ──────── */

export interface TicketPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/* ──────── 1. GET /tickets — List ──────── */

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  companyId: string;
  companyName: string;
  assignedTo: string | null;
  assignedAdminName: string | null;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface TicketsSummary {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

export interface TicketsResponse {
  tickets: Ticket[];
  pagination: TicketPagination;
  summary: TicketsSummary;
}

export type TicketsParams = {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: string;
  companyId?: string;
  search?: string;
};

/* ──────── 2. GET /tickets/:id — Detail ──────── */

export interface TicketComment {
  id: string;
  content: string;
  author: string;
  authorName: string;
  isInternal: boolean;
  createdAt: string;
}

export interface TicketAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export interface TicketDetail {
  ticket: Ticket;
  comments: TicketComment[];
  attachments: TicketAttachment[];
}

/* ──────── 3. PUT /tickets/:id/status — Update Status ──────── */

export interface UpdateStatusData {
  status: string;
  comment?: string;
}

export interface UpdateStatusResponse {
  id: string;
  status: string;
  updatedAt: string;
  comment?: TicketComment;
}

/* ──────── 4. PUT /tickets/:id/assign — Assign ──────── */

export interface AssignTicketData {
  assignedTo: string;
  comment?: string;
}

export interface AssignTicketResponse {
  id: string;
  assignedTo: string;
  assignedAdminName: string;
  updatedAt: string;
  comment?: TicketComment;
}

/* ──────── 5. POST /tickets/:id/comments — Add Comment ──────── */

export interface AddCommentData {
  content: string;
  isInternal: boolean;
}

export interface AddCommentResponse {
  comment: TicketComment;
}

/* ──────── 6. PUT /tickets/:id/resolve — Resolve ──────── */

export interface ResolveTicketData {
  resolution: string;
  comment?: string;
}

export interface ResolveTicketResponse {
  id: string;
  status: string;
  resolvedAt: string;
  resolution: string;
  updatedAt: string;
  comment?: TicketComment;
}

/* ──────── 7. PUT /tickets/:id/close — Close ──────── */

export interface CloseTicketData {
  comment?: string;
}

export interface CloseTicketResponse {
  id: string;
  status: string;
  closedAt: string;
  updatedAt: string;
  comment?: TicketComment;
}

/* ──────── 8. GET /tickets/statistics — Statistics ──────── */

export interface TicketStatisticsOverview {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

export interface TicketTimeMetric {
  average: number;
  median: number;
  target: number;
}

export interface TicketByPriority {
  priority: string;
  count: number;
  averageResolutionTime: number;
}

export interface TicketByCategory {
  category: string;
  count: number;
  percentage: number;
}

export interface TicketStatisticsResponse {
  overview: TicketStatisticsOverview;
  responseTime: TicketTimeMetric;
  resolutionTime: TicketTimeMetric;
  byPriority: TicketByPriority[];
  byCategory: TicketByCategory[];
}
