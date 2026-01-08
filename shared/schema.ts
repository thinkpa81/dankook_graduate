import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  registeredAt: text("registered_at").notNull(),
  registeredTime: text("registered_time").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
}));

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
  views: integer("views").notNull().default(0),
  isImportant: boolean("is_important").notNull().default(false),
  files: text("files").array().notNull().default(sql`'{}'::text[]`),
});

export const noticesRelations = relations(notices, ({ many }) => ({
  comments: many(noticeComments),
}));

export const insertNoticeSchema = createInsertSchema(notices).omit({ id: true });
export type InsertNotice = z.infer<typeof insertNoticeSchema>;
export type Notice = typeof notices.$inferSelect;

export const noticeComments = pgTable("notice_comments", {
  id: serial("id").primaryKey(),
  noticeId: integer("notice_id").notNull(),
  author: text("author").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
});

export const noticeCommentsRelations = relations(noticeComments, ({ one }) => ({
  notice: one(notices, { fields: [noticeComments.noticeId], references: [notices.id] }),
}));

export const insertNoticeCommentSchema = createInsertSchema(noticeComments).omit({ id: true });
export type InsertNoticeComment = z.infer<typeof insertNoticeCommentSchema>;
export type NoticeComment = typeof noticeComments.$inferSelect;

export const papers = pgTable("papers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  authors: text("authors").notNull(),
  firstAuthor: text("first_author"),
  correspondingAuthor: text("corresponding_author"),
  journal: text("journal").notNull(),
  year: text("year").notNull(),
  abstract: text("abstract"),
  keywords: text("keywords").array().notNull().default(sql`'{}'::text[]`),
  files: text("files").array().notNull().default(sql`'{}'::text[]`),
  websiteUrl: text("website_url"),
  date: text("date").notNull(),
  views: integer("views").notNull().default(0),
});

export const papersRelations = relations(papers, ({ many }) => ({
  comments: many(paperComments),
}));

export const insertPaperSchema = createInsertSchema(papers).omit({ id: true });
export type InsertPaper = z.infer<typeof insertPaperSchema>;
export type Paper = typeof papers.$inferSelect;

export const paperComments = pgTable("paper_comments", {
  id: serial("id").primaryKey(),
  paperId: integer("paper_id").notNull(),
  author: text("author").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
});

export const paperCommentsRelations = relations(paperComments, ({ one }) => ({
  paper: one(papers, { fields: [paperComments.paperId], references: [papers.id] }),
}));

export const insertPaperCommentSchema = createInsertSchema(paperComments).omit({ id: true });
export type InsertPaperComment = z.infer<typeof insertPaperCommentSchema>;
export type PaperComment = typeof paperComments.$inferSelect;

export const talents = pgTable("talents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  education: text("education").notNull(),
  major: text("major").notNull(),
  interestedMajor: text("interested_major").notNull(),
  motivation: text("motivation").notNull(),
  registeredAt: text("registered_at").notNull(),
  registeredTime: text("registered_time").notNull(),
});

export const insertTalentSchema = createInsertSchema(talents).omit({ id: true });
export type InsertTalent = z.infer<typeof insertTalentSchema>;
export type Talent = typeof talents.$inferSelect;
