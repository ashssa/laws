// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // 引入新的 glob loader

// 定義 'act' (法規) 集合
const act = defineCollection({
  // 使用 glob loader 來載入檔案
  // pattern: 匹配所有 .md 檔案
  // base: 指定檔案所在的資料夾路徑 (這裡設定為我們建議的 src/content/act)
  loader: glob({ pattern: "**/*.md", base: "./src/content/act" }),

  // 定義資料驗證架構 (Schema)
  schema: z.object({
    title: z.string(), // 標題為必填字串
    // 如果未來 Markdown 開頭有其他欄位 (如 date, tags)，請在這裡補上
    abbr: z.string().optional(),
    url: z.string().optional(),
  }),
});

// 匯出集合
export const collections = { act };