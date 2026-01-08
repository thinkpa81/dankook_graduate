const API_BASE = "/api";

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  registeredAt: string;
  registeredTime: string;
}

export interface NoticeComment {
  id: number;
  noticeId: number;
  author: string;
  content: string;
  date: string;
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

export interface PaperComment {
  id: number;
  paperId: number;
  author: string;
  content: string;
  date: string;
}

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
  comments: PaperComment[];
}

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
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
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

export const api = {
  users: {
    list: () => fetchApi<User[]>("/users"),
    create: (data: { username: string; password: string; name: string; email: string; registeredAt: string; registeredTime: string }) =>
      fetchApi<User>("/users", { method: "POST", body: JSON.stringify(data) }),
    login: (username: string, password: string) =>
      fetchApi<User>("/users/login", { method: "POST", body: JSON.stringify({ username, password }) }),
    resetPassword: (id: number, password: string) =>
      fetchApi<{ success: boolean }>(`/users/${id}/password`, { method: "PATCH", body: JSON.stringify({ password }) }),
    delete: (id: number) => fetchApi<{ success: boolean }>(`/users/${id}`, { method: "DELETE" }),
  },
  notices: {
    list: () => fetchApi<Notice[]>("/notices"),
    get: (id: number) => fetchApi<Notice>(`/notices/${id}`),
    create: (data: Omit<Notice, "id" | "comments">) =>
      fetchApi<Notice>("/notices", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Notice>) =>
      fetchApi<Notice>(`/notices/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) => fetchApi<{ success: boolean }>(`/notices/${id}`, { method: "DELETE" }),
    incrementViews: (id: number) => fetchApi<{ success: boolean }>(`/notices/${id}/views`, { method: "PATCH" }),
    addComment: (noticeId: number, data: { author: string; content: string; date: string }) =>
      fetchApi<NoticeComment>(`/notices/${noticeId}/comments`, { method: "POST", body: JSON.stringify(data) }),
    updateComment: (commentId: number, content: string) =>
      fetchApi<NoticeComment>(`/notice-comments/${commentId}`, { method: "PATCH", body: JSON.stringify({ content }) }),
    deleteComment: (commentId: number) =>
      fetchApi<{ success: boolean }>(`/notice-comments/${commentId}`, { method: "DELETE" }),
  },
  papers: {
    list: () => fetchApi<Paper[]>("/papers"),
    get: (id: number) => fetchApi<Paper>(`/papers/${id}`),
    create: (data: Omit<Paper, "id" | "comments">) =>
      fetchApi<Paper>("/papers", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Paper>) =>
      fetchApi<Paper>(`/papers/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) => fetchApi<{ success: boolean }>(`/papers/${id}`, { method: "DELETE" }),
    incrementViews: (id: number) => fetchApi<{ success: boolean }>(`/papers/${id}/views`, { method: "PATCH" }),
    addComment: (paperId: number, data: { author: string; content: string; date: string }) =>
      fetchApi<PaperComment>(`/papers/${paperId}/comments`, { method: "POST", body: JSON.stringify(data) }),
    updateComment: (commentId: number, content: string) =>
      fetchApi<PaperComment>(`/paper-comments/${commentId}`, { method: "PATCH", body: JSON.stringify({ content }) }),
    deleteComment: (commentId: number) =>
      fetchApi<{ success: boolean }>(`/paper-comments/${commentId}`, { method: "DELETE" }),
  },
  talents: {
    list: () => fetchApi<Talent[]>("/talents"),
    get: (id: number) => fetchApi<Talent>(`/talents/${id}`),
    create: (data: Omit<Talent, "id">) =>
      fetchApi<Talent>("/talents", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Talent>) =>
      fetchApi<Talent>(`/talents/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) => fetchApi<{ success: boolean }>(`/talents/${id}`, { method: "DELETE" }),
  },
};
