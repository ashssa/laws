// src/utils/lawParser.js

export function parseLawMarkdown(mdContent) {
  const lines = mdContent.split('\n');
  
  const result = {
    history: [],
    articles: [], // 包含章節標題與條文
    attachments: []
  };

  let currentSection = 'none'; // 'history', 'content', 'attachments'
  let currentArticle = null; // 暫存當前處理的條文

  // 輔助函數：將暫存的條文推入結果
  const flushArticle = () => {
    if (currentArticle) {
      result.articles.push({ type: 'article', ...currentArticle });
      currentArticle = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // 跳過空行

    // 1. 偵測區塊標題
    if (line.includes('## 修法歷程')) {
      currentSection = 'history';
      continue;
    }
    if (line.includes('## 法規內容')) {
      currentSection = 'content';
      continue;
    }
    if (line.includes('## 本法附件')) { // 偵測到附件區塊開始
        flushArticle(); // 結束最後一條條文
        currentSection = 'attachments';
        continue;
    }

    // 2. 根據當前區塊處理內容
    if (currentSection === 'history') {
      // 簡單的日期偵測，假設格式為 "107.01.08 ..."
      if (/^\d{3}\.\d{2}\.\d{2}/.test(line)) {
        result.history.push(line);
      }
    } 
    else if (currentSection === 'content') {
      // 偵測章節 (Header 3 / 4)
      if (line.startsWith('第一章') || line.startsWith('第二章') || line.match(/^第[一二三四五六七八九十]+章/)) {
        flushArticle();
        result.articles.push({ type: 'chapter', text: line });
      } 
      else if (line.match(/^第[一二三四五六七八九十]+節/)) {
        flushArticle();
        result.articles.push({ type: 'section', text: line });
      }
      // 偵測條文 (關鍵邏輯)
      // Regex: 第(數字)條之(數子)[(備註)]
      else if (line.match(/^第\s*(\d+(?:-\d+)?)\s*條(?:之\s*\d+)?/)) {
        flushArticle(); // 存入上一條
        
        const match = line.match(/^第\s*(\d+(?:-\d+)?)\s*條(?:之\s*(\d+))?(?:\s*[（(](.*?)[）)])?/);
        currentArticle = {
          number: match[1], // 條號主體 (例如 12)
          subNumber: match[2] || null, // 「之幾」的數字 (例如 1)
          note: match[3] || null, // 備註 (括號內的字)
          paragraphs: [] // 內文段落
        };
      } 
      else {
        // 如果是普通文字
        if (currentArticle) {
          // 如果正在處理某一條，這行就是該條的段落 (.par)
          currentArticle.paragraphs.push(line);
        } else {
          // 如果不在條文內 (例如章節下的前言)，可視需求處理
        }
      }
    }
    else if (currentSection === 'attachments') {
      // 偵測附件格式: 附件1 [標題](連結)
      const match = line.match(/(附件\d+(?:-\d+)?)\s*\[(.*?)\]\((.*?)\)/);
      if (match) {
        result.attachments.push({
          no: match[1],
          title: match[2],
          url: match[3]
        });
      }
    }
  }
  
  flushArticle(); // 迴圈結束，確保最後一條有存入
  return result;
}

export function parseAmendmentMarkdown(mdContent) {
  // 1. 徹底剃除 Frontmatter (確保不影響總說明)
  const lines = mdContent.split(/\r?\n/);
  let startIndex = 0;
  if (lines[0]?.trim() === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        startIndex = i + 1;
        break;
      }
    }
  }
  const actualLines = lines.slice(startIndex);

  const result = { globalDescription: [], amendments: [] };
  let currentAmendment = null;
  let currentField = 'globalDescription'; // 預設先抓總說明

  const getIndentClass = (text, isGlobal = false) => {
    if (/^[一二三四五六七八九十]+、/.test(text)) return 'pl-[2em] -indent-[2em] font-medium';
    if (/^[(（][一二三四五六七八九十]+[)）]/.test(text)) return 'ml-[2em] pl-[2em] -indent-[2em] text-base-content/90';
    if (/^\d+[\s\.、]/.test(text)) return 'ml-[4em] pl-[1.5em] -indent-[1.5em] text-base-content/80';
    // 總說明一般段落：首行縮排 2 字
    return isGlobal ? 'indent-[2em]' : '';
  };

  for (let line of actualLines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // 偵測條文標題
    if (trimmedLine.startsWith('### ')) {
      currentAmendment = {
        title: trimmedLine.replace('### ', '').trim(),
        proposed: [], current: [], reason: []
      };
      result.amendments.push(currentAmendment);
      currentField = null;
      continue;
    }

    // 處理總說明 (位於第一個 ### 之前)
    if (currentField === 'globalDescription') {
      if (trimmedLine.startsWith('#')) continue;
      result.globalDescription.push({
        text: trimmedLine,
        indentClass: getIndentClass(trimmedLine, true)
      });
      continue;
    }

    // 處理對照表內容
    if (!currentAmendment) continue;
    if (trimmedLine.startsWith('【修正條文】')) { currentField = 'proposed'; continue; }
    if (trimmedLine.startsWith('【現行條文】')) { currentField = 'current'; continue; }
    if (trimmedLine.startsWith('【說明】')) { currentField = 'reason'; continue; }

    if (currentField) {
      const isPlaceholder = trimmedLine === '（無）' || trimmedLine === '（刪除）';
      currentAmendment[currentField].push({
        text: trimmedLine,
        isPlaceholder,
        indentClass: !isPlaceholder ? getIndentClass(trimmedLine) : ''
      });
    }
  }
  return result;
}