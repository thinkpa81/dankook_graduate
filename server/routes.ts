import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { getStorage } from "./storage";
import { 
  insertUserSchema, insertNoticeSchema, insertPaperSchema, 
  insertTalentSchema, insertNoticeCommentSchema, insertPaperCommentSchema 
} from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.hwp', '.hwpx', '.zip'];
const ALLOWED_MIMETYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/x-hwp',
  'application/haansofthwp',
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream'
];

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = Buffer.from(file.originalname, 'latin1').toString('utf8').replace(ext, '');
    cb(null, `${uniqueSuffix}-${baseName}${ext}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`허용되지 않는 파일 형식입니다: ${ext}`));
  }
};

const upload = multer({ 
  storage: storage_multer,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const storage = getStorage();

  app.use('/uploads', (req, res, next) => {
    res.setHeader('Content-Disposition', 'attachment');
    next();
  }, express.static(uploadsDir));

  const ADMIN_USERNAME = "thinkpa";
  
  app.post("/api/upload", async (req, res, next) => {
    upload.array('files', 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: "파일 크기가 50MB를 초과합니다" });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
          return res.status(400).json({ error: "파일이 업로드되지 않았습니다" });
        }
        const uploadedFiles = files.map(file => ({
          name: Buffer.from(file.originalname, 'latin1').toString('utf8'),
          url: `/uploads/${file.filename}`,
          size: file.size,
          type: path.extname(file.originalname).slice(1)
        }));
        res.json({ files: uploadedFiles });
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    });
  });

  app.get("/api/users", async (req, res) => {
    const users = await storage.getUsers();
    res.json(users.map(u => ({ ...u, password: undefined })));
  });

  app.post("/api/users", async (req, res) => {
    try {
      const parsed = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByUsername(parsed.username);
      if (existing) {
        return res.status(400).json({ error: "Username already exists" });
      }
      const user = await storage.createUser(parsed);
      res.json({ ...user, password: undefined });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/users/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.session.user = { id: user.id, username: user.username };
    res.json({ ...user, password: undefined });
  });

  app.post("/api/users/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "로그아웃 실패" });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });

  app.get("/api/users/me", (req, res) => {
    if (req.session.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  app.patch("/api/users/:id/password", async (req, res) => {
    const id = parseInt(req.params.id);
    const { password } = req.body;
    await storage.updateUserPassword(id, password);
    res.json({ success: true });
  });

  app.delete("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteUser(id);
    res.json({ success: true });
  });

  app.get("/api/notices", async (req, res) => {
    try {
      const noticesList = await storage.getNotices();
      const result = await Promise.all(noticesList.map(async (n) => {
        const comments = await storage.getNoticeComments(n.id);
        return { ...n, comments };
      }));
      res.json(result);
    } catch (e: any) {
      console.error("GET /api/notices error:", e);
      res.status(500).json({ error: e.message || "Database error" });
    }
  });

  app.get("/api/notices/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const notice = await storage.getNotice(id);
    if (!notice) return res.status(404).json({ error: "Not found" });
    const comments = await storage.getNoticeComments(id);
    res.json({ ...notice, comments });
  });

  app.post("/api/notices", async (req, res) => {
    try {
      const parsed = insertNoticeSchema.parse(req.body);
      const notice = await storage.createNotice(parsed);
      res.json({ ...notice, comments: [] });
    } catch (e: any) {
      console.error("POST /api/notices error:", e);
      res.status(400).json({ error: e.message || "공지사항 등록에 실패했습니다" });
    }
  });

  app.patch("/api/notices/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const notice = await storage.updateNotice(id, req.body);
    if (!notice) return res.status(404).json({ error: "Not found" });
    const comments = await storage.getNoticeComments(id);
    res.json({ ...notice, comments });
  });

  app.delete("/api/notices/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteNotice(id);
    res.json({ success: true });
  });

  app.patch("/api/notices/:id/views", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.incrementNoticeViews(id);
    res.json({ success: true });
  });

  app.post("/api/notices/:id/comments", async (req, res) => {
    const noticeId = parseInt(req.params.id);
    try {
      const parsed = insertNoticeCommentSchema.parse({ ...req.body, noticeId });
      const comment = await storage.createNoticeComment(parsed);
      res.json(comment);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/notice-comments/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { content } = req.body;
    const comment = await storage.updateNoticeComment(id, content);
    if (!comment) return res.status(404).json({ error: "Not found" });
    res.json(comment);
  });

  app.delete("/api/notice-comments/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteNoticeComment(id);
    res.json({ success: true });
  });

  app.get("/api/papers", async (req, res) => {
    const papersList = await storage.getPapers();
    const result = await Promise.all(papersList.map(async (p) => {
      const comments = await storage.getPaperComments(p.id);
      return { ...p, comments };
    }));
    res.json(result);
  });

  app.get("/api/papers/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const paper = await storage.getPaper(id);
    if (!paper) return res.status(404).json({ error: "Not found" });
    const comments = await storage.getPaperComments(id);
    res.json({ ...paper, comments });
  });

  app.post("/api/papers", async (req, res) => {
    try {
      const parsed = insertPaperSchema.parse(req.body);
      const paper = await storage.createPaper(parsed);
      res.json({ ...paper, comments: [] });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/papers/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const paper = await storage.updatePaper(id, req.body);
    if (!paper) return res.status(404).json({ error: "Not found" });
    const comments = await storage.getPaperComments(id);
    res.json({ ...paper, comments });
  });

  app.delete("/api/papers/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deletePaper(id);
    res.json({ success: true });
  });

  app.patch("/api/papers/:id/views", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.incrementPaperViews(id);
    res.json({ success: true });
  });

  app.post("/api/papers/:id/comments", async (req, res) => {
    const paperId = parseInt(req.params.id);
    try {
      const parsed = insertPaperCommentSchema.parse({ ...req.body, paperId });
      const comment = await storage.createPaperComment(parsed);
      res.json(comment);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/paper-comments/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { content } = req.body;
    const comment = await storage.updatePaperComment(id, content);
    if (!comment) return res.status(404).json({ error: "Not found" });
    res.json(comment);
  });

  app.delete("/api/paper-comments/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deletePaperComment(id);
    res.json({ success: true });
  });

  app.get("/api/talents", async (req, res) => {
    const talentsList = await storage.getTalents();
    res.json(talentsList);
  });

  app.get("/api/talents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const talent = await storage.getTalent(id);
    if (!talent) return res.status(404).json({ error: "Not found" });
    res.json(talent);
  });

  app.post("/api/talents", async (req, res) => {
    try {
      const parsed = insertTalentSchema.parse(req.body);
      const talent = await storage.createTalent(parsed);
      res.json(talent);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/talents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const talent = await storage.updateTalent(id, req.body);
    if (!talent) return res.status(404).json({ error: "Not found" });
    res.json(talent);
  });

  app.delete("/api/talents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteTalent(id);
    res.json({ success: true });
  });

  return httpServer;
}
