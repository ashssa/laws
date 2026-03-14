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