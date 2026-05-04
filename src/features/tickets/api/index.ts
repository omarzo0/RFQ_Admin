import { authRequests } from "@/shared/api/request";
import { ticketUrls } from "./urls";
import type {
  TicketsParams,
  UpdateStatusData,
  AssignTicketData,
  AddCommentData,
  ResolveTicketData,
  CloseTicketData,
} from "@/features/tickets/types";

/* ──────── 1. GET /tickets — paginated list ──────── */
export const getTickets = (params?: TicketsParams) => {
  return authRequests.get(null, false, ticketUrls.list, params);
};

/* ──────── 2. GET /tickets/:id — detail ──────── */
export const getTicket = (id: string) => {
  return authRequests.get(null, false, ticketUrls.detail(id));
};

/* ──────── 3. PUT /tickets/:id/status — update status ──────── */
export const updateTicketStatus = (id: string, data: UpdateStatusData) => {
  return authRequests.put(null, false, ticketUrls.updateStatus(id), data);
};

/* ──────── 4. PUT /tickets/:id/assign — assign ticket ──────── */
export const assignTicket = (id: string, data: AssignTicketData) => {
  return authRequests.put(null, false, ticketUrls.assign(id), data);
};

/* ──────── 5. POST /tickets/:id/comments — add comment ──────── */
export const addTicketComment = (id: string, data: AddCommentData) => {
  return authRequests.post(null, false, ticketUrls.addComment(id), data);
};

/* ──────── 6. PUT /tickets/:id/resolve — resolve ticket ──────── */
export const resolveTicket = (id: string, data: ResolveTicketData) => {
  return authRequests.put(null, false, ticketUrls.resolve(id), data);
};

/* ──────── 7. PUT /tickets/:id/close — close ticket ──────── */
export const closeTicket = (id: string, data: CloseTicketData) => {
  return authRequests.put(null, false, ticketUrls.close(id), data);
};

/* ──────── 8. GET /tickets/statistics ──────── */
export const getTicketStatistics = () => {
  return authRequests.get(null, false, ticketUrls.statistics);
};
