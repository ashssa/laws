# **高師大附中學生會自治法規共用系統**

![SaLaws]([Preview-3.png](https://ashssa.github.io/laws/img/Preview-3.png))

本專案乃採用 [Astro](https://astro.build) 框架所建構之高效能靜態網站系統，其核心宗旨在於將國立高雄師範大學附屬高級中學學生會之所有自治法規進行數位化彙編、系統性展示與長期保存。本系統導入現代化前端技術堆疊，除確保在各式裝置上皆能提供響應式之最佳瀏覽體驗外，亦支援深色模式切換功能，致力於建構一個資訊透明、檢索便捷且具備優良閱讀體驗的法規發布平台，以落實校園自治之精神。

Logo 部分使用「SA」二字意象，套用湛藍晴空顏色，用於網站圖示（Favicon）、PWA 縮圖及導覽列等。

## **🚀 技術堆疊 (Tech Stack)**

本專案在技術選型上，經審慎評估開發效率、網站效能優化與後續維護之便利性，採用以下核心技術：

* **核心框架**: [Astro](https://astro.build) (v5+)  
  * 採用其獨特的 "Island Architecture" (群島架構)，透過減少客戶端 JavaScript 的傳輸量，提供極致的靜態頁面生成 (SSG) 效能，確保以文字內容為主的法規頁面能達到毫秒級的載入速度。  
* **樣式框架**: [Tailwind CSS](https://tailwindcss.com) (v4)  
  * 應用 "Utility-first" (功能優先) 的 CSS 開發模式，大幅縮減樣式表體積，加速介面開發流程，並確保全站設計語彙的一致性與可維護性。  
* **UI 組件庫**: [DaisyUI](https://daisyui.com) (v5)  
  * 導入基於 Tailwind CSS 建構的語義化組件庫，提供美觀、統一且易於擴充的介面元件（如響應式導覽列、按鈕模組），以提升開發效率。  
* **套件管理**: [pnpm](https://pnpm.io)  
  * 選用高效能且具備嚴格依賴管理的套件管理器，透過其內容可定址儲存機制節省磁碟空間，並確保團隊協作環境中依賴版本的一致性與穩定性。  
* **部署平台**: GitHub Pages  
  * 整合 GitHub Actions 建立自動化 CI/CD (持續整合/持續部署) 流程，確保每次程式碼提交皆能自動觸發建置並發布至線上環境，降低人工部署之錯誤風險。

## **📂 專案結構與目錄說明**

深入理解本專案之目錄結構與檔案配置，對於開發者進行維護作業及功能擴充至關重要。以下為主要目錄之功能解析：

```ascii
laws/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Pages 自動化部署 Actions 設定檔
├── public/                      # 靜態資源存放區 (此目錄下檔案將原樣複製至 build 根目錄)
│   ├── appendix/                # 法規 PDF 附件存放處 (建議於文中使用絕對路徑引用)  
│   ├── config/                  # 網站核心設定檔 (如 manifest.json, robot.txt 等 SEO 相關配置)
│   ├── fonts/                   # 自訂網頁字體檔案  
│   └── img/                     # 網站圖示 (Favicon) 與靜態圖片資源
├── src/
│   ├── assets/                  # 需經 Vite 建置工具優化處理之圖片/影音資源
│   ├── components/              # 可重複使用之 Astro UI 元件 (模組化設計) 
│   │   ├── ActionButtons.astro  # 法規頁面功能按鈕組件 (回目錄、法規沿革、複製本頁網址)
│   │   ├── BaseHead.astro       # HTML 標頭元件 (含 SEO Meta、ClientRouter、主題切換與 PWA 註冊)
│   │   ├── CornerMarquee.astro  # 頁面右上角懸浮跑馬燈公告組件
│   │   ├── Footer.astro         # 網頁頁尾組件 (包含學生會版權、最後建置時間與聯絡連結)
│   │   ├── HomePageRemarks.astro # 首頁聲明與備註事項解析組件
│   │   ├── LawListSection.astro # 首頁法規分類列表渲染組件
│   │   ├── Navbar.astro         # 頂部響應式導覽列與主題切換下拉選單組件
│   │   ├── PageSearch.astro     # 頁面懸浮搜尋與關鍵字無損高亮顯示組件
│   │   ├── ScrollToTop.astro    # 懸浮式平滑滾動至頂部按鈕組件
│   │   └── TableOfContents.astro # 響應式法規目次側邊欄與 ScrollSpy 滾動定位組件
│   ├── content/                 # 內容集合 (Content Collections) - 系統主要資料庫來源
│   │   ├── act/                 # 存放現行自治法規的原始 Markdown (.md) 檔案
│   │   └── amendments/          # 存放修法歷程對照的原始 Markdown (.md) 檔案
│   ├── layouts/
│   │   ├── LawLayout.astro      # 專為法規內頁設計之閱讀佈局 (包含目次、搜尋、回到頂部等組件)
│   │   └── MainLayout.astro     # 首頁與通用頁面之基礎佈局
│   ├── pages/                   # 路由頁面目錄 (採用 Astro 檔案系統路由機制)
│   │   ├── act/
│   │   │   └── [slug].astro     # 動態路由，根據 Markdown 內容即時解析並渲染法規頁面
│   │   ├── amendments/
│   │   │   ├── [act_id]/
│   │   │   │   ├── [version].astro # 特定法規特定版本的修法條文對照頁面
│   │   │   │   └── index.astro    # 特定法規的所有修法版本列表頁面
│   │   │   └── index.astro      # 修法沿革/歷程總覽頁面
│   │   ├── direction/           # 學校校務章則專區 (因格式複雜，不採用 Markdown 動態解析)
│   │   │   ├── direction01.astro # 學校會議旁聽要點頁面
│   │   │   ├── direction02.astro # 教育部高級中等以下學校校園行動載具使用原則頁面
│   │   │   └── overview.html    # 自治法規架構圖 (傳統 HTML 頁面)
│   │   ├── information/         # 網站輔助資訊頁面
│   │   │   ├── contact-us.astro # 聯絡我們頁面
│   │   │   └── sources.astro    # 資料來源說明頁面
│   │   ├── old-act/             # 已廢止法規專區 (使用 Astro 靜態頁面呈現)
│   │   │   ├── old-act01.astro  # 學生會組織辦法 (已廢止)
│   │   │   ├── old-act02.astro  # 學生議員選舉及罷免辦法 (已廢止)
│   │   │   ├── old-act03.astro  # 111學年學生代表產生遞補臨時要點 (已廢止)
│   │   │   └── old-act04.astro  # 議會會議彈性運作臨時條例 (已廢止)
│   │   ├── 404.astro            # 404 找不到網頁錯誤提示頁面
│   │   └── index.astro          # 系統首頁入口頁面
│   ├── plugins/
│   │   └── remark-amendment.js  # 自訂 Remark 插件，用於解析修法對照 Markdown 並生成三欄對照表樣式
│   ├── scripts/
│   │   └── main.js              # 客戶端全域 JavaScript 邏輯 (如 Toastr 提示初始化設定)
│   ├── styles/                  # CSS 樣式目錄 (含 01-base, 02-layout, 03-components, 04-utilities 模組樣式)
│   │   └── global.css           # 全域 CSS 樣式表，整合 Tailwind CSS v4 與 DaisyUI v5 的樣式與自訂變數
│   ├── utils/
│   │   └── lawParser.js         # 自定義法規 Markdown 解析器，將法規本文轉換為結構化 JSON 資料
│   ├── content.config.ts        # Astro Content Collections 集合載入與結構驗證設定檔
│   └── laws.js                  # 定義並匯出首頁法規分類選單與路徑的設定檔
├── astro.config.mjs             # Astro 核心設定檔 (整合 Tailwind、Base Path 及 PWA 等套件設定)
├── MAINTENANCE_GUIDE.md         # 供一般維護人員 (無程式基礎) 閱讀的日常維護說明書
├── package.json                 # 專案套件依賴與執行腳本 (Scripts) 設定檔
├── pnpm-lock.yaml               # pnpm 套件管理器的依賴版本鎖定檔
├── README.md                    # 本說明文件
└── tsconfig.json                # TypeScript 編譯與路徑別名 (Alias) 設定檔
```

## **🛠️ 本地開發指南**

若需於本機環境進行系統開發、除錯或內容預覽，請務必遵循以下標準作業程序：

### **前置需求 (Prerequisites)**

請確認您的開發環境已正確安裝並配置以下工具：

* [Node.js](https://nodejs.org/) (建議採用 v20 LTS 或更高版本以確保相容性)  
* [pnpm](https://pnpm.io/) (本專案強制指定使用 pnpm，以利用其 lockfile 機制鎖定依賴版本)

### **安裝依賴 (Installation)**

下載或複製專案儲存庫後，請於終端機執行以下指令，以安裝所有必要之依賴套件：

```terminal
pnpm install

```

### **啟動開發伺服器 (Development Server)**

執行以下指令以啟動本地開發伺服器。此模式支援熱重載 (Hot Reload) 機制，當原始碼或內容檔案發生變更時，瀏覽器將自動重新整理以即時顯示最新結果：

```terminal
pnpm run dev

```

伺服器啟動成功後，請開啟瀏覽器並連結至終端機顯示之網址（預設通常為 http://localhost:4321/laws/）進行預覽與測試。

### **建置生產版本 (Production Build)**

若需生成最終上線使用之最佳化靜態檔案 (輸出至 dist/ 目錄)，請執行以下建置指令：

```terminal
pnpm run build
```

## **📝 法規內容管理規範 (Content Management)**

本系統之內容管理機制，係採用 **Markdown** 標記語言結合 **自定義解析器 (lawParser.js)** 之架構。為確保法規文本經解析後能呈現正確之 HTML 結構與樣式，撰寫或修訂法規時請嚴格遵循以下規範。

### **1. 建立檔案**

請於 src/content/act/ 資料夾路徑下建立或編輯 .md 檔案。為利於檔案管理，檔名建議採用 actXX.md 之命名規則（例如 act09.md）。

### **2. 檔案開頭設定 (Frontmatter Configuration)**

每個 Markdown 檔案之首部必須包含 Frontmatter 區塊，利用 YAML 語法定義法規之詮釋資料 (Metadata)：

```markdown
---  
title: 國立高雄師範大學附屬高級中學學生會組織章程 # 法規全名  
abbr: 組織章程  # (選填) 用於瀏覽器標籤頁顯示之簡稱，避免標題過長影響閱讀  
url: 該法規的沿革資料夾網址
---
```

### **3. 撰寫內容規範**

系統解析器依賴特定的標題層級與文字格式來生成對應的 HTML 結構，請務必依循以下規則進行撰寫：

* 修法歷程區塊：  
  必須使用 `## 修法歷程` 作為二級標題。其下方請直接列出歷次修法之日期與摘要事項，每行僅列出一項紀錄，無需額外符號。  

```markdown

  ## 修法歷程

  107.01.08 自治幹部會議制定  
  114.02.27 學生議會修正通過
```

* 法規內文區塊：  
  必須使用 `## 法規內容` 作為二級標題，此區塊為法規之主體內容。  
  * **章節標題**：請直接使用 第一章、第一節 等標準中文數字格式，系統將自動識別並轉換為相應的章節標題樣式。  
  * **條文格式**：請使用 第XX條（標題） 之格式（建議使用全形括號 （ 與 ） 以確保排版美觀）。解析器將自動識別此模式並進行特殊的條文排版。  
  * **項次縮排規則**：  
    * **一般項**：直接換行書寫文字即可。  
    * **款 (1, 2, 3...)**：以半形阿拉伯數字不加點開頭 (如 `1`)，系統解析後將自動套用第一層縮排樣式。  
    * **目 ((1), (2)...)**：以括號包覆數字開頭 (如 `(1)` 或全形 `（1）`)，系統解析後將自動套用第二層（更深層）的縮排樣式。  
* 附件區塊：  
  使用 `## 本法附件` 開頭，格式為 `附件X [檔案名稱](檔案路徑)`。

### **完整範例格式**

```markdown
---  
title: 國立高雄師範大學附屬高級中學學生會組織章程  
abbr: 組織章程  
url: https://drive.google.com/drive/folders/1yDKfKzalxR36okyYRL2_QIbYyDbaGjV7
---

## 修法歷程

107.01.08 自治幹部會議制定  
114.03.10 學生議會修正通過

## 法規內容

第一章 總則

第1條（名稱）  
本會定名為國立高雄師範大學附屬高級中學學生會（以下簡稱本會）。

第2條（會員）  
會員分為：  
1. 在校生：凡本校高中部註冊之在學學生，均為本會當然會員。  
2. 榮譽會員：凡對本會有特殊貢獻者。

## 本法附件

附件1 [學生會行政中心辭職書](/laws/appendix/03%20行政中心組織及運作法%20附件1%20學生會行政中心辭職書.pdf)
```

## **🚢 部署流程 (Deployment Workflow)**

本專案已配置完善的 GitHub Actions 自動化工作流程。  
僅需將程式碼推送 (Push) 至 GitHub 儲存庫的 main 分支，系統即會自動觸發建置流程，並將生成的靜態網站部署至 GitHub Pages，無需任何手動介入。

* **Workflow 設定檔**: .github/workflows/deploy.yml  
* **線上存取網址**: https://ashssa.github.io/laws/

### **部署排錯建議**

若發生部署失敗之情形，請前往 GitHub Repository 的 "Actions" 頁籤查閱詳細的錯誤日誌 (Logs)。常見之錯誤原因通常與 astro.config.mjs 中的 base 路徑設定錯誤，或 pnpm-lock.yaml 與 package.json 版本定義衝突有關。

## **⚠️ 注意事項與最佳實踐**

為確保系統穩定運作與資源連結之正確性，請注意以下事項：

* **Base Path 設定**: 由於本專案部署於 GitHub Pages 的子路徑下，astro.config.mjs 中的 base 參數必須設定為 /laws。在撰寫內部連結或引用圖片資源時，請務必包含此路徑前綴（例如：/laws/img/logo.png），以避免產生 404 連結錯誤。  
* **PDF 檔案管理**: 所有法規相關之 PDF 附件檔案，建議統一存放於 public/appendix/ 資料夾中，並在 Markdown 文件中使用絕對路徑進行引用，以確保下載連結之有效性。  
* **圖片資源優化**: 網站介面使用之圖片（如 Logo、背景圖）請放置於 src/assets/，以利用 Astro 的影像最佳化功能；若為法規內容需直接引用之圖片，則建議放置於 public/ 資料夾。

## **📄 授權聲明 (License)**

本專案係為國立高雄師範大學附屬高級中學學生會所開發之專用系統，網站內之所有內容與法規文本版權均歸學生會所有。專案之程式碼部分則開放供學術交流、技術研究及會內技術傳承使用。

## 收錄內容注意事項

* 本會自治法規，將於整理後陸續公告上網。
* 尚未上傳之法規，歡迎點擊本會學生議會網站查詢。
* 本網站之內容不定期更新，最新公告施行法規，將於完成法規整編作業後更新上線。
* 本網站自治法規資料，係由本會學生議會提供之電子檔或書面文字登打製作，若與會長令或學生議會之公布文字有所不同，仍以該法規會長令或學生議會之公布資料為準。
