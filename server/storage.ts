import { 
  users, notices, papers, talents, noticeComments, paperComments,
  type User, type InsertUser,
  type Notice, type InsertNotice,
  type Paper, type InsertPaper,
  type Talent, type InsertTalent,
  type NoticeComment, type InsertNoticeComment,
  type PaperComment, type InsertPaperComment
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: number, password: string): Promise<void>;
  deleteUser(id: number): Promise<void>;

  getNotices(): Promise<Notice[]>;
  getNotice(id: number): Promise<Notice | undefined>;
  createNotice(notice: InsertNotice): Promise<Notice>;
  updateNotice(id: number, notice: Partial<InsertNotice>): Promise<Notice | undefined>;
  deleteNotice(id: number): Promise<void>;
  incrementNoticeViews(id: number): Promise<void>;

  getNoticeComments(noticeId: number): Promise<NoticeComment[]>;
  createNoticeComment(comment: InsertNoticeComment): Promise<NoticeComment>;
  updateNoticeComment(id: number, content: string): Promise<NoticeComment | undefined>;
  deleteNoticeComment(id: number): Promise<void>;

  getPapers(): Promise<Paper[]>;
  getPaper(id: number): Promise<Paper | undefined>;
  createPaper(paper: InsertPaper): Promise<Paper>;
  updatePaper(id: number, paper: Partial<InsertPaper>): Promise<Paper | undefined>;
  deletePaper(id: number): Promise<void>;
  incrementPaperViews(id: number): Promise<void>;

  getPaperComments(paperId: number): Promise<PaperComment[]>;
  createPaperComment(comment: InsertPaperComment): Promise<PaperComment>;
  updatePaperComment(id: number, content: string): Promise<PaperComment | undefined>;
  deletePaperComment(id: number): Promise<void>;

  getTalents(): Promise<Talent[]>;
  getTalent(id: number): Promise<Talent | undefined>;
  createTalent(talent: InsertTalent): Promise<Talent>;
  updateTalent(id: number, talent: Partial<InsertTalent>): Promise<Talent | undefined>;
  deleteTalent(id: number): Promise<void>;
}

export class MemoryStorage implements IStorage {
  private users: User[] = [];
  private notices: Notice[] = [];
  private papers: Paper[] = [];
  private talents: Talent[] = [];
  private noticeComments: NoticeComment[] = [];
  private paperComments: PaperComment[] = [];
  private nextId = { users: 1, notices: 1, papers: 1, talents: 1, noticeComments: 1, paperComments: 1 };

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }
  async getUsers(): Promise<User[]> {
    return [...this.users].reverse();
  }
  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = { ...user, id: this.nextId.users++ };
    this.users.push(newUser);
    return newUser;
  }
  async updateUserPassword(id: number, password: string): Promise<void> {
    const user = this.users.find(u => u.id === id);
    if (user) user.password = password;
  }
  async deleteUser(id: number): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }

  async getNotices(): Promise<Notice[]> {
    return [...this.notices].reverse();
  }
  async getNotice(id: number): Promise<Notice | undefined> {
    return this.notices.find(n => n.id === id);
  }
  async createNotice(notice: InsertNotice): Promise<Notice> {
    const newNotice: Notice = { 
      id: this.nextId.notices++,
      title: notice.title,
      content: notice.content,
      date: notice.date,
      views: notice.views ?? 0,
      isImportant: notice.isImportant ?? false,
      files: notice.files ?? []
    };
    this.notices.push(newNotice);
    return newNotice;
  }
  async updateNotice(id: number, notice: Partial<InsertNotice>): Promise<Notice | undefined> {
    const existing = this.notices.find(n => n.id === id);
    if (existing) Object.assign(existing, notice);
    return existing;
  }
  async deleteNotice(id: number): Promise<void> {
    this.notices = this.notices.filter(n => n.id !== id);
    this.noticeComments = this.noticeComments.filter(c => c.noticeId !== id);
  }
  async incrementNoticeViews(id: number): Promise<void> {
    const notice = this.notices.find(n => n.id === id);
    if (notice) notice.views++;
  }

  async getNoticeComments(noticeId: number): Promise<NoticeComment[]> {
    return this.noticeComments.filter(c => c.noticeId === noticeId).reverse();
  }
  async createNoticeComment(comment: InsertNoticeComment): Promise<NoticeComment> {
    const newComment: NoticeComment = { ...comment, id: this.nextId.noticeComments++ };
    this.noticeComments.push(newComment);
    return newComment;
  }
  async updateNoticeComment(id: number, content: string): Promise<NoticeComment | undefined> {
    const comment = this.noticeComments.find(c => c.id === id);
    if (comment) comment.content = content;
    return comment;
  }
  async deleteNoticeComment(id: number): Promise<void> {
    this.noticeComments = this.noticeComments.filter(c => c.id !== id);
  }

  async getPapers(): Promise<Paper[]> {
    return [...this.papers].reverse();
  }
  async getPaper(id: number): Promise<Paper | undefined> {
    return this.papers.find(p => p.id === id);
  }
  async createPaper(paper: InsertPaper): Promise<Paper> {
    const newPaper: Paper = { 
      id: this.nextId.papers++,
      category: paper.category ?? 'domestic-conference',
      title: paper.title,
      authors: paper.authors,
      firstAuthor: paper.firstAuthor ?? null,
      correspondingAuthor: paper.correspondingAuthor ?? null,
      venue: paper.venue ?? null,
      journal: paper.journal ?? null,
      volume: paper.volume ?? null,
      year: paper.year,
      abstract: paper.abstract ?? null,
      keywords: paper.keywords ?? [],
      files: paper.files ?? [],
      websiteUrl: paper.websiteUrl ?? null,
      date: paper.date,
      views: paper.views ?? 0
    };
    this.papers.push(newPaper);
    return newPaper;
  }
  async updatePaper(id: number, paper: Partial<InsertPaper>): Promise<Paper | undefined> {
    const existing = this.papers.find(p => p.id === id);
    if (existing) Object.assign(existing, paper);
    return existing;
  }
  async deletePaper(id: number): Promise<void> {
    this.papers = this.papers.filter(p => p.id !== id);
    this.paperComments = this.paperComments.filter(c => c.paperId !== id);
  }
  async incrementPaperViews(id: number): Promise<void> {
    const paper = this.papers.find(p => p.id === id);
    if (paper) paper.views++;
  }

  async getPaperComments(paperId: number): Promise<PaperComment[]> {
    return this.paperComments.filter(c => c.paperId === paperId).reverse();
  }
  async createPaperComment(comment: InsertPaperComment): Promise<PaperComment> {
    const newComment: PaperComment = { ...comment, id: this.nextId.paperComments++ };
    this.paperComments.push(newComment);
    return newComment;
  }
  async updatePaperComment(id: number, content: string): Promise<PaperComment | undefined> {
    const comment = this.paperComments.find(c => c.id === id);
    if (comment) comment.content = content;
    return comment;
  }
  async deletePaperComment(id: number): Promise<void> {
    this.paperComments = this.paperComments.filter(c => c.id !== id);
  }

  async getTalents(): Promise<Talent[]> {
    return [...this.talents].reverse();
  }
  async getTalent(id: number): Promise<Talent | undefined> {
    return this.talents.find(t => t.id === id);
  }
  async createTalent(talent: InsertTalent): Promise<Talent> {
    const newTalent: Talent = { ...talent, id: this.nextId.talents++ };
    this.talents.push(newTalent);
    return newTalent;
  }
  async updateTalent(id: number, talent: Partial<InsertTalent>): Promise<Talent | undefined> {
    const existing = this.talents.find(t => t.id === id);
    if (existing) Object.assign(existing, talent);
    return existing;
  }
  async deleteTalent(id: number): Promise<void> {
    this.talents = this.talents.filter(t => t.id !== id);
  }
}

export class DatabaseStorage implements IStorage {
  private db: any;
  
  constructor(db: any) {
    this.db = db;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUsers(): Promise<User[]> {
    return await this.db.select().from(users).orderBy(desc(users.id));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserPassword(id: number, password: string): Promise<void> {
    await this.db.update(users).set({ password }).where(eq(users.id, id));
  }

  async deleteUser(id: number): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }

  async getNotices(): Promise<Notice[]> {
    return await this.db.select().from(notices).orderBy(desc(notices.id));
  }

  async getNotice(id: number): Promise<Notice | undefined> {
    const [notice] = await this.db.select().from(notices).where(eq(notices.id, id));
    return notice || undefined;
  }

  async createNotice(notice: InsertNotice): Promise<Notice> {
    const [created] = await this.db.insert(notices).values(notice).returning();
    return created;
  }

  async updateNotice(id: number, notice: Partial<InsertNotice>): Promise<Notice | undefined> {
    const [updated] = await this.db.update(notices).set(notice).where(eq(notices.id, id)).returning();
    return updated || undefined;
  }

  async deleteNotice(id: number): Promise<void> {
    await this.db.delete(noticeComments).where(eq(noticeComments.noticeId, id));
    await this.db.delete(notices).where(eq(notices.id, id));
  }

  async incrementNoticeViews(id: number): Promise<void> {
    const notice = await this.getNotice(id);
    if (notice) {
      await this.db.update(notices).set({ views: notice.views + 1 }).where(eq(notices.id, id));
    }
  }

  async getNoticeComments(noticeId: number): Promise<NoticeComment[]> {
    return await this.db.select().from(noticeComments).where(eq(noticeComments.noticeId, noticeId)).orderBy(desc(noticeComments.id));
  }

  async createNoticeComment(comment: InsertNoticeComment): Promise<NoticeComment> {
    const [created] = await this.db.insert(noticeComments).values(comment).returning();
    return created;
  }

  async updateNoticeComment(id: number, content: string): Promise<NoticeComment | undefined> {
    const [updated] = await this.db.update(noticeComments).set({ content }).where(eq(noticeComments.id, id)).returning();
    return updated || undefined;
  }

  async deleteNoticeComment(id: number): Promise<void> {
    await this.db.delete(noticeComments).where(eq(noticeComments.id, id));
  }

  async getPapers(): Promise<Paper[]> {
    return await this.db.select().from(papers).orderBy(desc(papers.id));
  }

  async getPaper(id: number): Promise<Paper | undefined> {
    const [paper] = await this.db.select().from(papers).where(eq(papers.id, id));
    return paper || undefined;
  }

  async createPaper(paper: InsertPaper): Promise<Paper> {
    const [created] = await this.db.insert(papers).values(paper).returning();
    return created;
  }

  async updatePaper(id: number, paper: Partial<InsertPaper>): Promise<Paper | undefined> {
    const [updated] = await this.db.update(papers).set(paper).where(eq(papers.id, id)).returning();
    return updated || undefined;
  }

  async deletePaper(id: number): Promise<void> {
    await this.db.delete(paperComments).where(eq(paperComments.paperId, id));
    await this.db.delete(papers).where(eq(papers.id, id));
  }

  async incrementPaperViews(id: number): Promise<void> {
    const paper = await this.getPaper(id);
    if (paper) {
      await this.db.update(papers).set({ views: paper.views + 1 }).where(eq(papers.id, id));
    }
  }

  async getPaperComments(paperId: number): Promise<PaperComment[]> {
    return await this.db.select().from(paperComments).where(eq(paperComments.paperId, paperId)).orderBy(desc(paperComments.id));
  }

  async createPaperComment(comment: InsertPaperComment): Promise<PaperComment> {
    const [created] = await this.db.insert(paperComments).values(comment).returning();
    return created;
  }

  async updatePaperComment(id: number, content: string): Promise<PaperComment | undefined> {
    const [updated] = await this.db.update(paperComments).set({ content }).where(eq(paperComments.id, id)).returning();
    return updated || undefined;
  }

  async deletePaperComment(id: number): Promise<void> {
    await this.db.delete(paperComments).where(eq(paperComments.id, id));
  }

  async getTalents(): Promise<Talent[]> {
    return await this.db.select().from(talents).orderBy(desc(talents.id));
  }

  async getTalent(id: number): Promise<Talent | undefined> {
    const [talent] = await this.db.select().from(talents).where(eq(talents.id, id));
    return talent || undefined;
  }

  async createTalent(talent: InsertTalent): Promise<Talent> {
    const [created] = await this.db.insert(talents).values(talent).returning();
    return created;
  }

  async updateTalent(id: number, talent: Partial<InsertTalent>): Promise<Talent | undefined> {
    const [updated] = await this.db.update(talents).set(talent).where(eq(talents.id, id)).returning();
    return updated || undefined;
  }

  async deleteTalent(id: number): Promise<void> {
    await this.db.delete(talents).where(eq(talents.id, id));
  }
}

let storage: IStorage;

export async function initializeStorage(): Promise<IStorage> {
  const isProduction = process.env.REPLIT_DEPLOYMENT === '1';
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log("No DATABASE_URL found, using memory storage");
    storage = new MemoryStorage();
    return storage;
  }

  if (databaseUrl.includes('helium') && isProduction) {
    console.log("Production environment with internal hostname detected, using memory storage");
    storage = new MemoryStorage();
    return storage;
  }

  try {
    const { db, ensureTablesExist } = await import("./db");
    await ensureTablesExist();
    storage = new DatabaseStorage(db);
    console.log("Database storage initialized successfully");
    return storage;
  } catch (error: any) {
    console.error("Failed to initialize database, falling back to memory storage:", error.message);
    storage = new MemoryStorage();
    return storage;
  }
}

export function getStorage(): IStorage {
  if (!storage) {
    throw new Error("Storage not initialized. Call initializeStorage() first.");
  }
  return storage;
}

export { storage };
