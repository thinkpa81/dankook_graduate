// Centralized data store using localStorage for persistence

export interface FileAttachment {
  name: string;
  type: string;
  size: number;
  url?: string;
}

export interface Comment {
  id: number;
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
  files: FileAttachment[];
  isImportant: boolean;
  comments: Comment[];
}

export interface Paper {
  id: number;
  title: string;
  authors: string;
  firstAuthor?: string;
  correspondingAuthor?: string;
  websiteUrl?: string;
  venue?: string;
  journal?: string;
  year: string;
  volume?: string;
  files: FileAttachment[];
  comments: Comment[];
}

export interface TalentEntry {
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

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  registeredAt: string;
  registeredTime: string;
}

const STORAGE_KEYS = {
  NOTICES: 'dku_notices',
  PAPERS: 'dku_papers',
  TALENTS: 'dku_talents',
  USERS: 'dku_users',
};

// Initial data
const initialNotices: Notice[] = [
  { id: 1, title: "2024학년도 2학기 학위논문 심사 일정 안내", content: "학위논문 심사 일정을 안내드립니다.\n\n1. 제출 기간: 2024년 1월 8일 ~ 1월 20일\n2. 심사 기간: 2024년 1월 25일 ~ 2월 5일\n3. 최종 제출: 2024년 2월 10일까지\n\n자세한 사항은 첨부파일을 참고해주세요.", date: "2024.01.05", views: 234, files: [{ name: "심사일정.docx", type: "docx", size: 245000 }], isImportant: true, comments: [] },
  { id: 2, title: "겨울학기 수강신청 안내", content: "겨울학기 수강신청 관련 안내입니다.", date: "2024.01.03", views: 189, files: [{ name: "수강신청안내.xlsx", type: "xlsx", size: 128000 }], isImportant: true, comments: [] },
  { id: 3, title: "대학원 장학금 신청 안내", content: "장학금 신청 안내입니다.", date: "2024.01.02", views: 156, files: [{ name: "장학금신청서.docx", type: "docx", size: 89000 }], isImportant: false, comments: [] },
  { id: 4, title: "연구실 안전교육 이수 안내", content: "안전교육 이수 안내입니다.", date: "2023.12.28", views: 142, files: [], isImportant: false, comments: [] },
  { id: 5, title: "2024학년도 1학기 대학원 신입생 모집 안내", content: "신입생 모집 안내입니다.", date: "2023.12.20", views: 312, files: [{ name: "모집요강.pptx", type: "pptx", size: 2450000 }], isImportant: false, comments: [] },
  { id: 6, title: "학과 세미나 일정 안내", content: "2024년도 학과 세미나 일정입니다.", date: "2023.12.15", views: 98, files: [], isImportant: false, comments: [] },
  { id: 7, title: "연구윤리 교육 이수 안내", content: "연구윤리 교육 이수 안내입니다.", date: "2023.12.10", views: 87, files: [], isImportant: false, comments: [] },
];

const initialPapers: Record<string, Paper[]> = {
  "domestic-conference": [
    { id: 1, title: "빅데이터 분석을 활용한 소비자 행동 예측 모델 연구", authors: "김철수, 이영희", firstAuthor: "김철수", correspondingAuthor: "이영희", venue: "한국정보과학회 학술대회", year: "2024", files: [{ name: "논문.pdf", type: "pdf", size: 245000 }], comments: [] },
    { id: 2, title: "자연어 처리 기반 감성 분석 시스템 개발", authors: "박지민, 최수진", firstAuthor: "박지민", correspondingAuthor: "최수진", venue: "한국데이터베이스학회 학술대회", year: "2023", files: [], comments: [] },
    { id: 3, title: "클라우드 컴퓨팅 환경에서의 데이터 보안 연구", authors: "정민수, 김하늘", firstAuthor: "정민수", correspondingAuthor: "김하늘", venue: "한국정보보호학회 학술대회", year: "2023", files: [{ name: "발표자료.pptx", type: "pptx", size: 1250000 }], comments: [] },
  ],
  "international-conference": [
    { id: 1, title: "Deep Learning Approach for Time Series Prediction", authors: "Kim, J., Lee, H.", firstAuthor: "Kim, J.", correspondingAuthor: "Lee, H.", venue: "IEEE International Conference on Data Mining", year: "2024", files: [], comments: [] },
    { id: 2, title: "A Novel Framework for Knowledge Graph Construction", authors: "Park, S., Choi, M.", firstAuthor: "Park, S.", correspondingAuthor: "Choi, M.", venue: "ACM SIGKDD Conference", year: "2023", files: [], comments: [] },
  ],
  "domestic-journal": [
    { id: 1, title: "인공지능 기반 의료 데이터 분석 플랫폼 설계", authors: "이민호, 김서연", firstAuthor: "이민호", correspondingAuthor: "김서연", journal: "한국정보과학회논문지", year: "2024", volume: "51(3)", files: [], comments: [] },
    { id: 2, title: "메타버스 환경에서의 사용자 경험 분석", authors: "정유진, 박현우", firstAuthor: "정유진", correspondingAuthor: "박현우", journal: "한국HCI학회논문지", year: "2023", volume: "18(4)", files: [], comments: [] },
  ],
  "international-journal": [
    { id: 1, title: "Machine Learning for Predictive Analytics in Healthcare", authors: "Kim, Y., Lee, J.", firstAuthor: "Kim, Y.", correspondingAuthor: "Lee, J.", journal: "IEEE Transactions on Knowledge and Data Engineering", year: "2024", volume: "36(2)", files: [], comments: [] },
    { id: 2, title: "Efficient Data Mining Algorithms for Big Data Processing", authors: "Park, H., Choi, S.", firstAuthor: "Park, H.", correspondingAuthor: "Choi, S.", journal: "ACM Computing Surveys", year: "2023", volume: "55(4)", files: [], comments: [] },
  ],
  "main-journal": [
    { id: 1, title: "데이터지식서비스공학과 연구 동향 분석", authors: "학과 연구팀", firstAuthor: "학과 연구팀", journal: "단국대학교 대학원 논문집", year: "2024", volume: "12(1)", files: [], comments: [] },
  ],
  "paper-review": [
    { id: 1, title: "최신 딥러닝 트렌드 리뷰", authors: "김철수", firstAuthor: "김철수", journal: "학과 세미나", year: "2024", volume: "", files: [], comments: [{ id: 1, author: "이영희", content: "좋은 리뷰 감사합니다!", date: "2024.01.05" }] },
  ]
};

const initialTalents: TalentEntry[] = [
  { id: 1, name: "김철수", email: "kim@email.com", phone: "010-1234-5678", education: "학사 졸업(예정)", major: "컴퓨터공학", interestedMajor: "데이터사이언스", motivation: "데이터 분석 분야에 관심이 많습니다.", registeredAt: "2024.01.05", registeredTime: "14:32" },
  { id: 2, name: "이영희", email: "lee@email.com", phone: "010-2345-6789", education: "석사 졸업(예정)", major: "통계학", interestedMajor: "데이터사이언스", motivation: "통계 기반 머신러닝 연구를 하고 싶습니다.", registeredAt: "2024.01.03", registeredTime: "09:15" },
  { id: 3, name: "박지민", email: "park@email.com", phone: "010-3456-7890", education: "학사 졸업(예정)", major: "경영학", interestedMajor: "메타버스융합", motivation: "메타버스 비즈니스에 관심이 있습니다.", registeredAt: "2024.01.02", registeredTime: "16:48" },
];

const initialUsers: User[] = [];

// Get data from localStorage or return initial data
export function getNotices(): Notice[] {
  const stored = localStorage.getItem(STORAGE_KEYS.NOTICES);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(initialNotices));
  return initialNotices;
}

export function setNotices(notices: Notice[]) {
  localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
}

export function getPapers(): Record<string, Paper[]> {
  const stored = localStorage.getItem(STORAGE_KEYS.PAPERS);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(initialPapers));
  return initialPapers;
}

export function setPapers(papers: Record<string, Paper[]>) {
  localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(papers));
}

export function getTalents(): TalentEntry[] {
  const stored = localStorage.getItem(STORAGE_KEYS.TALENTS);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEYS.TALENTS, JSON.stringify(initialTalents));
  return initialTalents;
}

export function setTalents(talents: TalentEntry[]) {
  localStorage.setItem(STORAGE_KEYS.TALENTS, JSON.stringify(talents));
}

export function getUsers(): User[] {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
  return initialUsers;
}

export function setUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function addUser(user: Omit<User, 'id' | 'registeredAt' | 'registeredTime'>): User {
  const users = getUsers();
  const now = new Date();
  const newUser: User = {
    ...user,
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    registeredAt: now.toISOString().split('T')[0].replace(/-/g, '.'),
    registeredTime: now.toTimeString().slice(0, 5),
  };
  setUsers([...users, newUser]);
  return newUser;
}

export function resetUserPassword(userId: number, newPassword: string) {
  const users = getUsers();
  setUsers(users.map(u => u.id === userId ? { ...u, password: newPassword } : u));
}

export function deleteUser(userId: number) {
  const users = getUsers();
  setUsers(users.filter(u => u.id !== userId));
}

export function findUserByUsername(username: string): User | undefined {
  return getUsers().find(u => u.username === username);
}

export function validateUser(username: string, password: string): User | null {
  const user = findUserByUsername(username);
  if (user && user.password === password) {
    return user;
  }
  return null;
}