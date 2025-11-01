import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { fileURLToPath } from "url";

export default defineConfig({
  site: "https://ashssa.github.io/",
  base: "/blog/",
  outDir: "../public/blog",
  integrations: [mdx()],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: { theme: "github-light" },
  },
  integrations: [
    {
      name: "pagefind",
      hooks: {
        "astro:build:done": async ({ dir }) => {
          const { execSync } = await import("child_process");
          // 如果 dir 是 URL，需要轉成一般檔案路徑
          const path =
            dir instanceof URL ? fileURLToPath(dir) : dir.toString();
          execSync(`npx pagefind --site "${path}"`, { stdio: "inherit" });
        },
      },
    },
  ],
});
