// src/plugins/remark-amendment.js

import { visit } from 'unist-util-visit';

export default function remarkAmendment() {
  return (tree) => {
    let i = 0;
    while (i < tree.children.length) {
      const node = tree.children[i];

      // 偵測條文標題 (例如：### 第9條)
      if (node.type === 'heading' && node.depth === 3) {
        let j = i + 1;
        // 尋找下一個同級或更高層級的標題，界定這個條文區塊的範圍
        while (j < tree.children.length && !(tree.children[j].type === 'heading' && tree.children[j].depth <= 3)) {
          j++;
        }
        
        const siblings = tree.children.slice(i + 1, j);

        // 建立響應式三欄網格容器 (含列印支援)
        const gridDiv = {
          type: 'html',
          data: {
            hName: 'div',
            hProperties: { 
              class: 'grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-base-300 border border-base-300 rounded-xl my-8 overflow-hidden shadow-sm bg-base-100 print:table print:border-collapse print:rounded-none' 
            }
          },
          children: []
        };

        const createCol = (type, title) => {
          let styleClass = 'p-5 prose prose-sm max-w-none print:table-cell print:border print:border-black ';
          let borderColor = '';
          let bgColor = '';
          let titleColor = '';

          // 依據欄位類型設定狀態色
          if (type === 'proposed') {
             borderColor = 'border-success'; bgColor = 'bg-success/5'; titleColor = 'text-success';
          } else if (type === 'current') {
             borderColor = 'border-error'; bgColor = 'bg-error/5'; titleColor = 'text-error';
          } else if (type === 'reason') {
             borderColor = 'border-info'; bgColor = 'bg-info/5'; titleColor = 'text-info';
          }

          styleClass += `${bgColor} border-l-4 ${borderColor}`;

          return {
            type: 'paragraph',
            data: { hName: 'div', hProperties: { class: styleClass } },
            children: [
              {
                type: 'html',
                value: `<h4 class="font-bold mb-3 ${titleColor} text-base border-b border-base-300/50 pb-2 print:text-black print:border-black">${title}</h4>`
              }
            ]
          };
        };

        let currentCol = null;

        siblings.forEach(sib => {
          if (sib.type === 'paragraph' && sib.children && sib.children[0] && sib.children[0].type === 'text') {
            const textVal = sib.children[0].value;
            
            // 判斷標記並初始化欄位
            if (textVal.startsWith('【修正條文】')) {
              currentCol = createCol('proposed', '修正條文');
              gridDiv.children.push(currentCol);
              sib.children[0].value = textVal.replace('【修正條文】', '').trim();
            } else if (textVal.startsWith('【現行條文】')) {
              currentCol = createCol('current', '現行條文');
              gridDiv.children.push(currentCol);
              sib.children[0].value = textVal.replace('【現行條文】', '').trim();
            } else if (textVal.startsWith('【說明】')) {
              currentCol = createCol('reason', '說明');
              gridDiv.children.push(currentCol);
              sib.children[0].value = textVal.replace('【說明】', '').trim();
            }
          }

          if (currentCol && sib.type === 'paragraph') {
             const textNodeVal = sib.children[0]?.value || '';
             
             // 處理「（無）」與「（刪除）」佔位符
             if (textNodeVal === '（本條新增）' || textNodeVal === '（刪除）') {
                sib.data = { hProperties: { class: 'italic opacity-50 bg-base-200/30 p-2 rounded' } };
             }
            //  TODO: 更寬鬆的匹配方式？

             // 處理「說明」欄位的層級縮排與凸排
             if (currentCol.data.hProperties.class.includes('bg-info/5')) {
                let indentClass = '';
                if (/^[一二三四五六七八九十]+、/.test(textNodeVal)) {
                    indentClass = ' pl-[2em] -indent-[2em]';
                } else if (/^[(（][一二三四五六七八九十]+[)）]/.test(textNodeVal)) {
                    indentClass = ' ml-[2em] pl-[2em] -indent-[2em] text-base-content/80';
                } else if (/^\d+[\.、]/.test(textNodeVal)) {
                    indentClass = ' ml-[4em] pl-[1.5em] -indent-[1.5em] text-base-content/70';
                }

                if (indentClass) {
                    sib.data = sib.data || {};
                    sib.data.hProperties = sib.data.hProperties || {};
                    sib.data.hProperties.class = (sib.data.hProperties.class || '') + indentClass;
                }
             }
             currentCol.children.push(sib);
          }
        });

        // 替換原有的 Markdown 節點為渲染好的 HTML 結構
        tree.children.splice(i + 1, j - i - 1, gridDiv);
        i += 2;
      } else {
        i++;
      }
    }
  };
}