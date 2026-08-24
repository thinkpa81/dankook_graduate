const API_BASE = "/api";

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  registeredAt: string;
  registeredTime: string;
  role: string;
  status: string;
  passwordResetRequired: boolean;
}

export interface AdminAccount {
  id: number;
  username: string;
  name: string;
  role: string;
  status: string;
  passwordResetRequired: boolean;
  registeredAt: string;
  registeredTime: string;
}

export interface AdminBootstrapStatus {
  required: boolean;
  expiresAt: string | null;
}

export interface AdmissionGuideline {
  id: number;
  title: string;
  content: string;
  organization: string;
  date: string;
  views: number;
  attachmentUrl: string | null;
  attachmentName: string | null;
}

export type AdmissionGuidelineInput = Pick<
  AdmissionGuideline,
  "title" | "content" | "organization" | "date" | "attachmentUrl" | "attachmentName"
>;

export interface SessionUser {
  id: number;
  username: string;
  name: string;
  role: "ADMIN" | "USER";
}

export interface NoticeComment {
  id: number;
  noticeId: number;
  author: string;
  content: string;
  date: string;
  canEdit?: boolean;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  views: number;
  isImportant: boolean;
  files: string[];
  comments: NoticeComment[];
}

export type NoticeCreateInput = Pick<Notice, "title" | "content" | "date" | "isImportant" | "files">;
export type NoticeUpdateInput = Partial<Omit<NoticeCreateInput, "date">>;

export interface Paper {
  id: number;
  category: string;
  title: string;
  authors: string;
  firstAuthor: string | null;
  correspondingAuthor: string | null;
  venue: string | null;
  journal: string | null;
  volume: string | null;
  year: string;
  abstract: string | null;
  keywords: string[];
  files: string[];
  websiteUrl: string | null;
  date: string;
  views: number;
}

export type PaperCreateInput = Omit<Paper, "id" | "views">;
export type PaperUpdateInput = Partial<Omit<PaperCreateInput, "date">>;

export interface Talent {
  id: number;
  name: string;
  email: string;
  phone: string;
  education: string;
  major: string;
  interestedMajor: string;
  motivation: string;
  registeredAt: string;
  registeredTime: string;
  consentAt?: string;
  retentionUntil?: string;
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    let errorMessage = `서버 오류 (${res.status})`;
    try {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        errorMessage = json.error || json.message || errorMessage;
      } catch {
        if (text) errorMessage = text.substring(0, 200);
      }
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

async function uploadFiles(files: File[]): Promise<UploadedFile[]> {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  
  if (!res.ok) {
    let errorMessage = '파일 업로드에 실패했습니다';
    try {
      const json = await res.json();
      errorMessage = json.error || errorMessage;
    } catch (e) {}
    throw new Error(errorMessage);
  }
  
  const data = await res.json();
  return data.files;
}

async function logout(): Promise<void> {
  await fetch(`${API_BASE}/users/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

async function checkSession(): Promise<SessionUser | null> {
  try {
    const res = await fetch(`${API_BASE}/users/me`, {
      credentials: 'include',
    });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch {
    return null;
  }
}

export const api = {
  uploadFiles,
  logout,
  checkSession,
  users: {
    list: () => fetchApi<User[]>("/users"),
    create: (data: { username: string; password: string; name: string; email: string }) =>
      fetchApi<User>("/users", { method: "POST", body: JSON.stringify(data) }),
    login: async (username: string, password: string) => {
      return fetchApi<SessionUser>("/users/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
    },
    resetPassword: (id: number, password: string) =>
      fetchApi<{ success: boolean }>(`/users/${id}/password`, { method: "PATCH", body: JSON.stringify({ password }) }),
    delete: (id: number) => fetchApi<{ success: boolean }>(`/users/${id}`, { method: "DELETE" }),
  },
  admins: {
    list: () => fetchApi<AdminAccount[]>("/admins"),
    create: (data: { username: string; name: string; password: string }) =>
      fetchApi<AdminAccount>("/admins", { method: "POST", body: JSON.stringify(data) }),
    resetPassword: (id: number, password: string) =>
      fetchApi<{ success: boolean }>(`/admins/${id}/password`, { method: "PATCH", body: JSON.stringify({ password }) }),
    delete: (id: number) => fetchApi<{ success: boolean }>(`/admins/${id}`, { method: "DELETE" }),
  },
  adminBootstrap: {
    status: () => fetchApi<AdminBootstrapStatus>("/admin-bootstrap/status"),
    setup: (data: { setupCode: string; username: string; name: string; password: string }) =>
      fetchApi<AdminAccount>("/admin-bootstrap/setup", { method: "POST", body: JSON.stringify(data) }),
  },
  admissions: {
    list: () => fetchApi<AdmissionGuideline[]>("/admissions"),
    get: (id: number) => fetchApi<AdmissionGuideline>(`/admissions/${id}`),
    create: (data: AdmissionGuidelineInput) =>
      fetchApi<AdmissionGuideline>("/admissions", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<AdmissionGuidelineInput>) =>
      fetchApi<AdmissionGuideline>(`/admissions/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) => fetchApi<{ success: boolean }>(`/admissions/${id}`, { method: "DELETE" }),
    incrementViews: (id: number) =>
      fetchApi<{ success: boolean; views: number }>(`/admissions/${id}/views`, { method: "PATCH" }),
  },
  notices: {
    list: () => fetchApi<Notice[]>("/notices"),
    get: (id: number) => fetchApi<Notice>(`/notices/${id}`),
    create: (data: NoticeCreateInput) =>
      fetchApi<Notice>("/notices", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: NoticeUpdateInput) =>
      fetchApi<Notice>(`/notices/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) => fetchApi<{ success: boolean }>(`/notices/${id}`, { method: "DELETE" }),
    incrementViews: (id: number) => fetchApi<{ success: boolean }>(`/notices/${id}/views`, { method: "PATCH" }),
    addComment: (noticeId: number, data: { content: string }) =>
      fetchApi<NoticeComment>(`/notices/${noticeId}/comments`, { method: "POST", body: JSON.stringify(data) }),
    updateComment: (commentId: number, content: string) =>
      fetchApi<NoticeComment>(`/notice-comments/${commentId}`, { method: "PATCH", body: JSON.stringify({ content }) }),
    deleteComment: (commentId: number) =>
      fetchApi<{ success: boolean }>(`/notice-comments/${commentId}`, { method: "DELETE" }),
  },
  papers: {
    list: () => fetchApi<Paper[]>("/papers"),
    get: (id: number) => fetchApi<Paper>(`/papers/${id}`),
    create: (data: PaperCreateInput) =>
      fetchApi<Paper>("/papers", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: PaperUpdateInput) =>
      fetchApi<Paper>(`/papers/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) => fetchApi<{ success: boolean }>(`/papers/${id}`, { method: "DELETE" }),
    incrementViews: (id: number) => fetchApi<{ success: boolean }>(`/papers/${id}/views`, { method: "PATCH" }),
  },
  talents: {
    list: () => fetchApi<Talent[]>("/talents"),
    get: (id: number) => fetchApi<Talent>(`/talents/${id}`),
    create: (data: Omit<Talent, "id" | "registeredAt" | "registeredTime" | "consentAt" | "retentionUntil"> & { consent: true }) =>
      fetchApi<{ success: boolean; id: number }>("/talents", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Talent>) =>
      fetchApi<Talent>(`/talents/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) => fetchApi<{ success: boolean }>(`/talents/${id}`, { method: "DELETE" }),
  },
};
