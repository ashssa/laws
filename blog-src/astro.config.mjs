import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

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
      name: 'pagefind',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const { execSync } = await import('child_process');
          execSync(`npx pagefind --site ${dir}`, { stdio: 'inherit' });
        },
      },
    },
  ],
});
