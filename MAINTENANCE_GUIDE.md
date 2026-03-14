# 📝 法規系統日常維護指南 (無程式基礎適用)

這份指南將教你如何在 **不需要懂任何程式語言** 的情況下，新增或修改學生會法規。
本系統會自動把你寫的「純文字」變成漂亮的網頁！

## 📂 法規檔案在哪裡？
所有的現行法規都放在這個資料夾裡：
👉 `src/content/act/`

你會看到很多像 `act01.md`、`act02.md` 的檔案，這就是法規的本體。

---

## ✏️ 如何修改現有法規？

1. 在 GitHub 上或你的電腦裡，打開你要修改的 `.md` 檔案（例如 `act05.md`）。
2. 直接修改裡面的文字。
3. 修改完後，儲存並把檔案上傳 (Commit & Push) 到 GitHub 的 `main` 分支。
4. **系統會自動更新！** (大約需要等 1~2 分鐘)。

---

## 📖 法規編寫語法教學 (Markdown)

為了讓系統看得懂哪裡是「第幾條」、哪裡是「章節」，請務必遵守以下簡單的打字規則：

### 1. 檔案開頭的設定區 (Frontmatter)
每個法規檔案的「最上面」都會有由 `---` 包起來的區塊，用來設定標題與附件。
```yaml
---
id: act01
title: "國立高雄師範大學附屬高級中學學生會組織章程"
date: 2025-06-03
url: "[https://sites.google.com/](https://sites.google.com/)..."
attachments:
  - no: "附件一"
    title: "表單下載"
    url: "/appendix/form.pdf"
---
```

### 2. 章與節 (大標題)
寫「章」請在前面加上兩個井字號與空白：`## 第一章 總則`

寫「節」請在前面加上三個井字號與空白：`### 第一節 學生會會員`

### 3. 法條 (最重要！)
**請一定要以「第 X 條」開頭**（數字用阿拉伯數字或國字皆可），系統才抓得到！
如果要寫「之幾」，請寫成「第 X 條之 Y」。

**正確示範：**
```Plaintext
第 12 條
學生會會長之職權如下：
一、對外代表學生會。
二、召集並主持行政中心會議。

第 12 條之 1
副會長襄助會長處理會務。
```

### 4. 數學公式
如果法規裡面有數學公式，請用 $ 符號把它包起來：

- 行內公式包一個金錢符號：`門檻為 $Q = \frac{V}{S}$`
- 獨立成行的公式包兩個金錢符號：
```Plaintext
$$
Q = \frac{V}{S+1} + 1
$$
```
---

## ➕ 如何新增一部全新的法規？

1. 在 `src/content/act/` 資料夾內，建立一個新的檔案，例如 act10.md。
2. 把其他法規的開頭設定區 (`---`) 複製過來改一改，然後貼上你的法規內文。
3. **重要**： 打開 `src/laws.js` 這個檔案，在裡面把你的新法規資訊加上去，這樣「首頁」才看得到你的新法規連結！

## 🗑️ 特殊法規 (已廢止、校務章則)
如果你要修改的是「格式非常奇怪、無法用上述規則打出來」的已廢止法規或學校章則：

- 它們不放在 `src/content/act/`。
- 它們放在 `src/pages/old-act/` 或 `src/pages/direction/` 裡面。
- 這些檔案是 `.astro` 結尾，裡面包著傳統的 HTML 表格與排版，請直接替換裡面的中文字即可。

---

### 3. 給 LLM (AI) 的系統架構與維護指南
這份文件請儲存為 `LLM_MAINTENANCE_GUIDE.md`。這是一份「系統提示詞（System Prompt）」，當未來您需要請 ChatGPT、Claude 或 Gemini 幫忙改 Code 時，可以直接把這份文件餵給它，它就能瞬間理解整個專案的坑與邏輯。

```markdown
# 🤖 LLM System Maintenance & Architecture Guide

Dear AI Assistant / Developer,
Welcome to the `laws` (formerly `concentric-law`) repository. This is an Astro-based SSG application for managing and displaying student council regulations. Before making any code modifications or debugging, please read this architecture and context guide carefully to avoid breaking the delicate custom parsers or Astro's lifecycle events.

## 🛠️ Tech Stack
* **Framework:** Astro 5 (Static Site Generation mode)
* **Styling:** Tailwind CSS v4 + DaisyUI v5
* **Math Rendering:** KaTeX (installed via npm, imported directly in components)
* **PWA:** `@vite-pwa/astro` integration
* **Package Manager:** `pnpm`

## 📁 Repository Structure & Routing
1. **Standard Laws (`src/content/act/*.md` & `src/pages/act/[slug].astro`):**
   * Standard laws are strictly written in Markdown and parsed dynamically.
   * **CRITICAL:** We DO NOT use Astro's default `Content Collections` markdown renderer (`<Content />`) for standard laws. Instead, we read `entry.body` as a raw string and pass it to a custom parser.
2. **Custom Parser (`src/utils/lawParser.js`):**
   * This parser uses highly specific Regex to scan raw text and convert it into a structured JSON array (`type: 'chapter' | 'section' | 'article'`).
   * *Do not modify this parser's regex without explicit instruction and rigorous testing, as it supports full-width/half-width numbers, `第X條`, `第X條之Y`, and indented sub-paragraphs.*
3. **Legacy/Irregular Laws (`src/pages/old-act/*.astro` & `src/pages/direction/*.astro`):**
   * Older laws or university directions have extremely irregular formatting (complex `rowspan`/`colspan` HTML tables) that Markdown cannot handle.
   * These are implemented as pure `.astro` static pages using raw HTML wrapped inside the `<LawLayout>` component. Do not attempt to move these into `src/content/`.
4. **Homepage Data (`src/laws.js`):**
   * The index page lists are NOT generated dynamically from file trees. They are statically defined in `src/laws.js`. If a new law is added, this JSON-like file must be updated.

## ⚠️ Known Gotchas & Lifecycle Rules (MUST READ)

When adding or modifying interactivity (JS), you MUST adhere to the following rules due to Astro's build optimizations and View Transitions:

### 1. JavaScript Event Binding
Astro scripts (`<script>`) are deferred and executed only once. Navigation between pages does not trigger `DOMContentLoaded` again.
* **Rule:** ALL interactive components (TOC, Search, ScrollToTop, ActionButtons) must be wrapped in an initialization function and bound to BOTH `DOMContentLoaded` and `astro:page-load`.
* **Pattern:**
  ```javascript
  function initFeature() { ... }
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initFeature);
  } else { initFeature(); }
  document.addEventListener('astro:page-load', () => {
      if (document.readyState !== 'loading') initFeature();
  });
  ```
### 2. Table of Contents (TOC) & Headroom Logic (`TableOfContents.astro`)
* The TOC logic relies on querying main `h2, main h3, main h4`.
* Mobile toggle button uses Tailwind translate classes (`translate-x-0` vs `-translate-x-full`).
* **Rule**: Do not toggle classes blindly. Explicitly `add()` and `remove()` specific translate classes to avoid Tailwind specificity conflicts. Include a scroll delta (e.g., `10px`) to prevent iOS overscroll-bounce from triggering the headroom visibility.

### 3. In-page Search (`PageSearch.astro`)
* **Rule**: NEVER use `innerHTML` replacement for search highlighting. Doing so destroys KaTeX nodes and Astro component bindings.
* The current implementation uses `document.createTreeWalker` to extract purely `NodeFilter.SHOW_TEXT` nodes, skipping any parent with `.katex` class, and wraps matches in `<mark>` tags. Maintain this strict DOM manipulation approach.

### 4. Path and Base URL (`astro.config.mjs`)
* The project is deployed on GitHub Pages under a subpath (e.g., `base: '/laws'`).
* **Rule**: When rendering links to assets (like PDFs in `/public/appendix/`), you must prepend the base URL dynamically using `import.meta.env.BASE_URL` to prevent 404 errors in production.

By following these guidelines, you will ensure the application remains robust, fast, and bug-free.
```