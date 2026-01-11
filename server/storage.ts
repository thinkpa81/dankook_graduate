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
  private notices: Notice[] = [
    {
      id: 1,
      title: "2025학년도 봄학기 신입생 모집 안내",
      content: "단국대학교 일반대학원 데이터지식서비스공학과에서 2025학년도 봄학기 신입생을 모집합니다.\n\n주요 모집 분야:\n- 데이터사이언스 전공\n- AI/머신러닝 전공\n- 메타버스융합 전공\n\n지원 자격:\n- 학사 학위 소지자 (예정자 포함)\n- 관련 분야 경력자 우대\n\n제출 서류:\n- 입학지원서\n- 학부 성적증명서\n- 자기소개서 및 연구계획서\n\n문의: 데이터지식서비스공학과 행정실 (031-8005-XXXX)",
      date: "2025-01-10",
      views: 156,
      isImportant: true,
      files: []
    },
    {
      id: 2,
      title: "2025년 1월 학위논문 제출 일정 안내",
      content: "2025년 2월 학위수여를 희망하는 석·박사 과정 학생은 아래 일정에 따라 학위논문을 제출해 주시기 바랍니다.\n\n학위논문 제출 일정:\n- 논문 심사 신청: 2025년 1월 5일 ~ 1월 15일\n- 논문 심사: 2025년 1월 20일 ~ 2월 5일\n- 최종 논문 제출: 2025년 2월 10일까지\n- 학위수여식: 2025년 2월 20일\n\n제출 방법:\n- 온라인 제출 시스템 이용\n- 인쇄본 3부 행정실 제출\n\n문의: 학사관리팀",
      date: "2025-01-08",
      views: 89,
      isImportant: true,
      files: []
    },
    {
      id: 3,
      title: "AI/머신러닝 특강 안내 - ChatGPT와 대화형 AI",
      content: "AI 전문가를 초청하여 특강을 개최합니다.\n\n주제: ChatGPT와 대화형 AI의 최신 동향\n강사: 김AI 교수 (서울대학교 AI연구소)\n일시: 2025년 1월 25일 (토) 14:00-16:00\n장소: 단국대학교 산학협력관 301호\n\n참가 신청:\n- 신청 기간: 1월 15일까지\n- 신청 방법: 학과 홈페이지 또는 이메일\n- 정원: 50명 (선착순)\n\n참가비: 무료\n수료증 발급: 참석자 전원",
      date: "2025-01-05",
      views: 124,
      isImportant: false,
      files: []
    },
    {
      id: 4,
      title: "메타버스 프로젝트 발표회 개최",
      content: "메타버스융합 전공 학생들의 학기 프로젝트 발표회를 개최합니다.\n\n일시: 2025년 1월 30일 (목) 13:00-17:00\n장소: 메타버스 연구실 (공학관 5층)\n\n발표 주제:\n- 가상 캠퍼스 구축 프로젝트\n- NFT 기반 디지털 아트 플랫폼\n- VR/AR 교육 콘텐츠 개발\n- 메타버스 전자상거래 시스템\n\n참관 환영: 학부생, 대학원생, 교수님 모두 환영합니다.",
      date: "2025-01-03",
      views: 67,
      isImportant: false,
      files: []
    }
  ];
  private papers: Paper[] = [
    {
      id: 1,
      category: 'international-journal',
      title: "Deep Learning-Based Sentiment Analysis in Metaverse Social Platforms",
      authors: "김철수, 이영희, 박민수",
      firstAuthor: "김철수",
      correspondingAuthor: "박민수",
      venue: null,
      journal: "IEEE Transactions on Computational Social Systems",
      volume: "Vol.11, No.2",
      year: 2024,
      abstract: "This paper presents a novel deep learning approach for sentiment analysis in metaverse social platforms. We propose a multi-modal transformer architecture that processes text, audio, and avatar expressions to accurately predict user emotions in virtual environments.",
      keywords: ["Deep Learning", "Sentiment Analysis", "Metaverse", "Social Computing"],
      files: [],
      websiteUrl: "https://ieeexplore.ieee.org/document/example",
      date: "2024-12-15",
      views: 234
    },
    {
      id: 2,
      category: 'domestic-journal',
      title: "메타버스 환경에서의 사용자 행동 패턴 분석 연구",
      authors: "장순호, 홍길동, 김AI",
      firstAuthor: "장순호",
      correspondingAuthor: "김AI",
      venue: null,
      journal: "한국정보과학회 논문지",
      volume: "제51권 제12호",
      year: 2024,
      abstract: "본 연구는 메타버스 플랫폼에서 사용자들의 행동 패턴을 데이터 마이닝 기법을 통해 분석하였다. 로그 데이터 분석 결과, 사용자들의 가상공간 이동 패턴과 소셜 인터랙션 간 유의미한 상관관계를 발견하였다.",
      keywords: ["메타버스", "사용자 행동 분석", "데이터 마이닝", "소셜 네트워크"],
      files: [],
      websiteUrl: null,
      date: "2024-12-01",
      views: 156
    },
    {
      id: 3,
      category: 'international-conference',
      title: "AI-Powered Recommendation System for Virtual Reality Content",
      authors: "박데이터, 이머신, Smith, J.",
      firstAuthor: "박데이터",
      correspondingAuthor: "Smith, J.",
      venue: "ACM International Conference on Multimedia (ACM MM 2024)",
      journal: null,
      volume: null,
      year: 2024,
      abstract: "We propose an AI-powered recommendation system specifically designed for VR content. Our system uses collaborative filtering combined with deep reinforcement learning to provide personalized content recommendations based on user interaction patterns in 3D environments.",
      keywords: ["VR", "Recommendation System", "Deep Learning", "User Experience"],
      files: [],
      websiteUrl: "https://dl.acm.org/doi/example",
      date: "2024-11-20",
      views: 189
    },
    {
      id: 4,
      category: 'domestic-conference',
      title: "블록체인 기반 메타버스 디지털 자산 거래 시스템",
      authors: "최블록, 강체인, 서메타",
      firstAuthor: "최블록",
      correspondingAuthor: "서메타",
      venue: "한국정보과학회 학술발표논문집",
      journal: null,
      volume: null,
      year: 2024,
      abstract: "메타버스 환경에서 디지털 자산의 안전한 거래를 위한 블록체인 기반 시스템을 제안한다. 스마트 컨트랙트를 활용하여 거래의 투명성과 보안을 보장하며, NFT 기술을 통해 디지털 자산의 소유권을 명확히 한다.",
      keywords: ["블록체인", "메타버스", "NFT", "스마트 컨트랙트", "디지털 자산"],
      files: [],
      websiteUrl: null,
      date: "2024-11-15",
      views: 142
    },
    {
      id: 5,
      category: 'international-journal',
      title: "Federated Learning for Privacy-Preserving Data Analysis in IoT Networks",
      authors: "이프라이버시, Johnson, M., 김보안",
      firstAuthor: "이프라이버시",
      correspondingAuthor: "김보안",
      venue: null,
      journal: "IEEE Internet of Things Journal",
      volume: "Vol.11, No.24",
      year: 2024,
      abstract: "This paper proposes a federated learning framework for privacy-preserving data analysis in IoT networks. Our approach enables collaborative model training across distributed IoT devices without sharing raw data, ensuring user privacy while maintaining model accuracy.",
      keywords: ["Federated Learning", "IoT", "Privacy", "Machine Learning", "Data Security"],
      files: [],
      websiteUrl: "https://ieeexplore.ieee.org/document/iot-example",
      date: "2024-10-30",
      views: 201
    },
    {
      id: 6,
      category: 'domestic-journal',
      title: "자연어 처리 기반 한국어 감성 분석 시스템 개발",
      authors: "정자연어, 한글처리, 감성분석",
      firstAuthor: "정자연어",
      correspondingAuthor: "감성분석",
      venue: null,
      journal: "정보과학회논문지",
      volume: "제50권 제10호",
      year: 2024,
      abstract: "한국어 텍스트의 감성을 정확하게 분석하기 위한 딥러닝 기반 시스템을 개발하였다. BERT 모델을 한국어 데이터로 사전학습하고, 감성 라벨링된 데이터셋으로 파인튜닝하여 기존 방법 대비 15% 향상된 성능을 달성하였다.",
      keywords: ["자연어 처리", "감성 분석", "BERT", "한국어", "딥러닝"],
      files: [],
      websiteUrl: null,
      date: "2024-10-15",
      views: 178
    }
  ];
  private talents: Talent[] = [];
  private noticeComments: NoticeComment[] = [];
  private paperComments: PaperComment[] = [];
  private nextId = { users: 1, notices: 5, papers: 7, talents: 1, noticeComments: 1, paperComments: 1 };

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
  const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log("No database URL found, using memory storage");
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
