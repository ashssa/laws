// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import AstroPWA from "@vite-pwa/astro";
import remarkAmendment from "./src/plugins/remark-amendment.js";
import rehypeExternalLinks from "rehype-external-links";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import vercel from "@astrojs/vercel/serverless";

const isVercel = process.env.VERCEL === "1";

// https://astro.build/config
export default defineConfig({
  // 設定 GitHub Pages 網址
  site: isVercel ? process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://ashssa-laws-admin.vercel.app" : "https://ashssa.github.io",
  base: isVercel ? "/" : (process.env.NODE_ENV === "production" ? "/laws" : "/"),
  output: isVercel ? "server" : "static",
  adapter: isVercel ? vercel() : undefined,
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    // 註冊套件至 Markdown 編譯流程
    // remarkPlugins: [remarkAmendment],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] },
      ],
    ],
  },
  integrations: [
    react(),
    keystatic(),
    AstroPWA({
      registerType: "autoUpdate", // 當有新版本時自動更新快取
      workbox: {
        maximumFileSizeToCacheInBytes: 5000000, // 增加到 5MB，避免 Keystatic 超大檔案導致錯誤
        // 自動捕捉 dist 目錄下所有的資源進行離線快取
        globDirectory: "dist",
        globPatterns: ["**/*.{html,js,css,ico,png,svg,woff,woff2,ttf,pdf}"],
        navigateFallback: null,
      },
      manifest: {
        name: "高師大附中學生會自治法規共用系統",
        short_name: "SA Law",
        description:
          "高師大附中自治法規共用系統，彙編高師大附中學生會所有自治法規的展示網站。",
        start_url: "/laws/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/laws/img/icon-194.png",
            sizes: "194x194",
            type: "image/png",
          },
          {
            src: "/laws/img/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        // shortcuts: [
        //   {
        //     name: "組織章程",
        //     short_name: "組織章程",
        //     description: "閱讀本會組織章程",
        //     url: "/laws/act/act01",
        //     icons: [{ src: "/laws/img/shortcuts01-512.png", sizes: "512x512" }]
        //   },
        //   {
        //     name: "學生會官網",
        //     short_name: "SA 官網",
        //     description: "前往學生會官方網站！",
        //     url: "https://sites.google.com/stu.nknush.kh.edu.tw/ashssa",
        //     icons: [{ src: "/laws/img/shortcuts02-512.png", sizes: "512x512" }]
        //   }
        // ]
      },
    }),
  ],
});
