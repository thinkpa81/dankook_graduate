import { 
  users, notices, papers, talents, noticeComments, paperComments,
  type User, type InsertUser,
  type Notice, type InsertNotice,
  type Paper, type InsertPaper,
  type Talent, type InsertTalent,
  type NoticeComment, type InsertNoticeComment,
  type PaperComment, type InsertPaperComment
} from "@shared/schema";
import { db } from "./db";
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

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.id));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserPassword(id: number, password: string): Promise<void> {
    await db.update(users).set({ password }).where(eq(users.id, id));
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getNotices(): Promise<Notice[]> {
    return await db.select().from(notices).orderBy(desc(notices.id));
  }

  async getNotice(id: number): Promise<Notice | undefined> {
    const [notice] = await db.select().from(notices).where(eq(notices.id, id));
    return notice || undefined;
  }

  async createNotice(notice: InsertNotice): Promise<Notice> {
    const [created] = await db.insert(notices).values(notice).returning();
    return created;
  }

  async updateNotice(id: number, notice: Partial<InsertNotice>): Promise<Notice | undefined> {
    const [updated] = await db.update(notices).set(notice).where(eq(notices.id, id)).returning();
    return updated || undefined;
  }

  async deleteNotice(id: number): Promise<void> {
    await db.delete(noticeComments).where(eq(noticeComments.noticeId, id));
    await db.delete(notices).where(eq(notices.id, id));
  }

  async incrementNoticeViews(id: number): Promise<void> {
    const notice = await this.getNotice(id);
    if (notice) {
      await db.update(notices).set({ views: notice.views + 1 }).where(eq(notices.id, id));
    }
  }

  async getNoticeComments(noticeId: number): Promise<NoticeComment[]> {
    return await db.select().from(noticeComments).where(eq(noticeComments.noticeId, noticeId)).orderBy(desc(noticeComments.id));
  }

  async createNoticeComment(comment: InsertNoticeComment): Promise<NoticeComment> {
    const [created] = await db.insert(noticeComments).values(comment).returning();
    return created;
  }

  async updateNoticeComment(id: number, content: string): Promise<NoticeComment | undefined> {
    const [updated] = await db.update(noticeComments).set({ content }).where(eq(noticeComments.id, id)).returning();
    return updated || undefined;
  }

  async deleteNoticeComment(id: number): Promise<void> {
    await db.delete(noticeComments).where(eq(noticeComments.id, id));
  }

  async getPapers(): Promise<Paper[]> {
    return await db.select().from(papers).orderBy(desc(papers.id));
  }

  async getPaper(id: number): Promise<Paper | undefined> {
    const [paper] = await db.select().from(papers).where(eq(papers.id, id));
    return paper || undefined;
  }

  async createPaper(paper: InsertPaper): Promise<Paper> {
    const [created] = await db.insert(papers).values(paper).returning();
    return created;
  }

  async updatePaper(id: number, paper: Partial<InsertPaper>): Promise<Paper | undefined> {
    const [updated] = await db.update(papers).set(paper).where(eq(papers.id, id)).returning();
    return updated || undefined;
  }

  async deletePaper(id: number): Promise<void> {
    await db.delete(paperComments).where(eq(paperComments.paperId, id));
    await db.delete(papers).where(eq(papers.id, id));
  }

  async incrementPaperViews(id: number): Promise<void> {
    const paper = await this.getPaper(id);
    if (paper) {
      await db.update(papers).set({ views: paper.views + 1 }).where(eq(papers.id, id));
    }
  }

  async getPaperComments(paperId: number): Promise<PaperComment[]> {
    return await db.select().from(paperComments).where(eq(paperComments.paperId, paperId)).orderBy(desc(paperComments.id));
  }

  async createPaperComment(comment: InsertPaperComment): Promise<PaperComment> {
    const [created] = await db.insert(paperComments).values(comment).returning();
    return created;
  }

  async updatePaperComment(id: number, content: string): Promise<PaperComment | undefined> {
    const [updated] = await db.update(paperComments).set({ content }).where(eq(paperComments.id, id)).returning();
    return updated || undefined;
  }

  async deletePaperComment(id: number): Promise<void> {
    await db.delete(paperComments).where(eq(paperComments.id, id));
  }

  async getTalents(): Promise<Talent[]> {
    return await db.select().from(talents).orderBy(desc(talents.id));
  }

  async getTalent(id: number): Promise<Talent | undefined> {
    const [talent] = await db.select().from(talents).where(eq(talents.id, id));
    return talent || undefined;
  }

  async createTalent(talent: InsertTalent): Promise<Talent> {
    const [created] = await db.insert(talents).values(talent).returning();
    return created;
  }

  async updateTalent(id: number, talent: Partial<InsertTalent>): Promise<Talent | undefined> {
    const [updated] = await db.update(talents).set(talent).where(eq(talents.id, id)).returning();
    return updated || undefined;
  }

  async deleteTalent(id: number): Promise<void> {
    await db.delete(talents).where(eq(talents.id, id));
  }
}

export const storage = new DatabaseStorage();
