// script.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded 事件已觸發，程式碼開始執行。');

    // --- 常數定義 ---
    const HEADER_FILE = '../components/header.html'; // 頁首檔案路徑
    const FOOTER_FILE = '../components/footer.html'; // 頁尾檔案路徑
    const BUTTONS_FILE = '../components/buttons.html'; // 功能列表檔案路徑
    const HEADER_PLACEHOLDER_ID = 'main-header'; // 頁首佔位符 ID
    const FOOTER_PLACEHOLDER_ID = 'main-footer'; // 頁尾佔位符 ID
    const BUTTONS_PLACEHOLDER_ID = 'button-container'; // 功能列表佔位符 ID
    const CURRENT_YEAR_SPAN_ID = 'current-year'; // 頁尾年份 span ID
    const LAST_UPDATED_SPAN_ID = 'last-updated'; // 頁尾更新日期 span ID
    const SCROLL_TO_TOP_BTN_ID = 'scrollToTopBtn'; // 返回頂部按鈕的 ID 常數
    // --- 搜尋功能相關常數 ---
    const REGULATION_CONTENT_SELECTOR = 'article.regulation-content'; // 內容容器選擇器
    const SEARCH_TEXT_ID = 'searchText'; // 搜尋輸入框 ID
    const SEARCH_BTN_ID = 'searchButton'; // 搜尋按鈕 ID
    const SEARCH_COUNT_ID = 'searchCount'; // 搜尋結果計數 ID
    const NEXT_MATCH_BTN_ID = 'nextMatchBtn'; // 下一個按鈕 ID
    const PREV_MATCH_BTN_ID = 'prevMatchBtn'; // 上一個按鈕 ID
    const HIGHLIGHT_CLASS = 'highlight'; // 高亮 CSS 類別
    const CURRENT_MATCH_CLASS = 'current-match'; // 當前匹配項 CSS 類別
    const SEARCH_CONTAINER_ID = 'searchContainer'; // 搜尋面板 ID
    const TOGGLE_SEARCH_BTN_ID = 'toggleSearchBtn'; // 切換搜尋面板顯示的按鈕 ID
    let originalContent = ''; // 用於儲存未被高亮包裹的原始內容
    let matchNodes = []; // 儲存所有匹配項的 Node 列表
    let currentMatchIndex = -1; // 當前聚焦的匹配項索引
    // --- 取得元素 ---
    const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
    const footerPlaceholder = document.getElementById(FOOTER_PLACEHOLDER_ID);
    const buttonsPlaceholder = document.getElementById(BUTTONS_PLACEHOLDER_ID); // **取得功能列表佔位符**
    const scrollToTopBtn = document.getElementById(SCROLL_TO_TOP_BTN_ID); // 獲取返回頂部按鈕元素**
    const regulationContent = document.querySelector(REGULATION_CONTENT_SELECTOR); // 內容容器

    // --- 函數：載入 HTML 片段 ---
    /**
     * 使用 Fetch API 異步載入 HTML 片段並插入到指定的佔位符元素中
     * @param {string} filePath - 要載入的 HTML 檔案路徑
     * @param {HTMLElement} placeholder - 要插入內容的目標元素
     * @param {string} placeholderName - 佔位符的描述性名稱 (用於錯誤訊息)
     * @returns {Promise<string|null>} - 成功時解析為載入的 HTML 字串，失敗時為 null
     */
    async function loadHtmlFragment(filePath, placeholder, placeholderName) {
        if (!placeholder) {
            console.warn(`找不到 ID 為 "${placeholderName}" 的 ${placeholderName} 佔位符元素。`);
            return null; // 找不到元素，直接返回
        }

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`網路回應錯誤: ${response.status} ${response.statusText}`);
            }
            const html = await response.text();
            placeholder.innerHTML = html;
            console.log(`${placeholderName} (${filePath}) 已成功載入。`);
            return html; // 返回載入的 HTML
        } catch (error) {
            console.error(`無法載入 ${placeholderName} (${filePath}):`, error);
            placeholder.innerHTML = `<p style="color:red; text-align:center;">${placeholderName} 載入失敗！請檢查檔案路徑或網路連線。</p>`;
            return null; // 返回 null 表示失敗
        }
    }

    // --- 函數：更新頁尾資訊 ---
    /**
     * 更新頁尾中的動態內容 (目前年份和最後更新日期)
     * @param {HTMLElement} footerElement - 頁尾容器元素
     */
    function updateFooterInfo(footerElement) {
        if (!footerElement) return;

        const yearSpan = footerElement.querySelector(`#${CURRENT_YEAR_SPAN_ID}`);
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        } else {
            console.warn(`在頁尾中找不到 ID 為 "${CURRENT_YEAR_SPAN_ID}" 的年份 span 元素。`);
        }

        const lastUpdatedSpan = footerElement.querySelector(`#${LAST_UPDATED_SPAN_ID}`);
        if (lastUpdatedSpan) {
            const now = new Date();
            const formattedDateTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            lastUpdatedSpan.textContent = formattedDateTime;
        } else {
            console.warn(`在頁尾中找不到 ID 為 "${LAST_UPDATED_SPAN_ID}" 的最後更新日期 span 元素。`);
        }
    }

        // --- 函數：處理 span.art 並加上錨點與連結 ---
    /*
     * 遍歷所有 class 為 "art" 的 span 元素，為其加上錨點 ID 並將其內容包裝成連結。
     */
    function addAnchorAndLinkToArtSpans() {
    console.group(`開始執行 addAnchorAndLinkToArtSpans 函數`);

    const artSpans = document.querySelectorAll('span.art');
    console.log(`偵測到 ${artSpans.length} 個 .art 元素。`);

    console.groupCollapsed("錨點生成詳情");
    artSpans.forEach((span, index) => {
        const spanText = span.textContent.trim();
        let anchorId = '';
        const match = spanText.match(/^第(\d+)條(?:之(\d+))?$/);

        if (match) {
            const n = match[1];
            const m = match[2];
            anchorId = `article-${n}${m ? `-${m}` : ''}`;
            console.log(`[Span ${index}] "${spanText}" 格式正確，生成錨點 ID: ${anchorId}`);
        } else {
            anchorId = `article-no-${index+1}`;
            console.warn(`[Span ${index}] "${spanText}" 格式不符，使用索引生成錨點 ID: ${anchorId}`);
        }

        // 創建錨點元素 (<a>)
        const anchor = document.createElement('a');
        // anchor.setAttribute('id', anchorId);
        anchor.setAttribute('href', `#${anchorId}`); // href 屬性對於錨點本身通常不是必需的，除非你想讓它能被點擊跳轉到自己。不過呢，這裡確實就是要讓他被點擊能跳轉到自己
        anchor.classList.add('law-btn-anchor');
        anchor.textContent = '＃'; // 錨點的顯示文字

        // 將錨點插入到 span 的內部第一個元素之前
        if (span.firstChild) {
            span.insertBefore(anchor, span.firstChild);
            console.log(`[Span ${index}] 將錨點 <a id="${anchorId}">#</a> 插入到 span 的第一個子元素前。`);
        } else {
            // 如果 span 是空的，直接將錨點 append 到 span 裡面
            span.appendChild(anchor);
            console.log(`[Span ${index}] span 為空，將錨點 <a id="${anchorId}">#</a> 直接插入到 span 內部。`);
        }

        // 移除之前在 span 前插入連結的邏輯，因為現在是將錨點插入到 span 內部
        if (!span.id) {
            span.id = anchorId;
            console.log(`[Span ${index}] 為 span 設定 ID: ${anchorId}`);
        } else {
            console.log(`[Span ${index}] span 已有 ID "${span.id}"，未重複設定。`);
        }
    });
    console.groupEnd("錨點生成詳情");
    console.log('.art 元素的錨點處理完成。');
    console.groupEnd(`開始執行 addAnchorAndLinkToArtSpans 函數`);
}

// 在 article.regulation-content 之後插入搜尋按鈕區塊
(async () => {
    // 1. 常數定義 (為避免與主程式碼衝突，在這裡重新定義)
    const SEARCH_BUTTONS_FILE = '../components/seach-btn.html'; 
    const SEARCH_BUTTONS_PLACEHOLDER_SELECTOR = 'article.regulation-content'; 
    const PLACEHOLDER_NAME = '搜尋按鈕功能區塊';

    // 2. 尋找目標元素
    const targetElement = document.querySelector(SEARCH_BUTTONS_PLACEHOLDER_SELECTOR);
    
    if (!targetElement) {
        console.warn(`[${PLACEHOLDER_NAME}] 找不到指定的目標元素來插入 (${SEARCH_BUTTONS_PLACEHOLDER_SELECTOR})。`);
        return; 
    }

    // 3. 核心載入及插入邏輯
    try {
        const response = await fetch(SEARCH_BUTTONS_FILE);
        
        if (!response.ok) {
            throw new Error(`網路回應錯誤: ${response.status} ${response.statusText}`);
        }
        
        const html = await response.text();
        
        // 創建一個臨時的 div 來解析 HTML 字串
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // 將臨時 div 裡的所有子節點插入到目標元素之後 (使用 insertBefore 和 nextSibling)
        while (tempDiv.firstChild) {
            targetElement.parentNode.insertBefore(tempDiv.firstChild, targetElement.nextSibling);
        }

        console.log(`[${PLACEHOLDER_NAME}] (${SEARCH_BUTTONS_FILE}) 已成功載入並插入到目標元素之後。`);
        
    } catch (error) {
        console.error(`[${PLACEHOLDER_NAME}] 無法載入 (${SEARCH_BUTTONS_FILE}):`, error);
        // 如果您的 toastr 在此處已經初始化，可以加上錯誤提示
        // toastr.error(`${PLACEHOLDER_NAME} 載入失敗！`); 
    }
})();


    // --- 函數：移除所有高亮標記 ---
    function removeHighlights() {
        if (!regulationContent) return;

        // 1. 清除目前的匹配索引和 Node 列表
        currentMatchIndex = -1;
        matchNodes = [];
        const searchCountSpan = document.getElementById(SEARCH_COUNT_ID);
        if (searchCountSpan) searchCountSpan.textContent = '';
        
        // 隱藏導航按鈕
        const nextBtn = document.getElementById(NEXT_MATCH_BTN_ID);
        const prevBtn = document.getElementById(PREV_MATCH_BTN_ID);
        // if (nextBtn) nextBtn.style.display = 'none';
        // if (prevBtn) prevBtn.style.display = 'none';

        // 2. 將內容恢復到原始狀態 (移除 <mark> 標籤)
        if (originalContent) {
            regulationContent.innerHTML = originalContent;
            originalContent = ''; // 清除原始內容，表示目前沒有高亮
            console.log('高亮標記已移除，內容已恢復。');
        }
    }

    // --- 函數：切換搜尋面板顯示狀態 ---
    function toggleSearchVisibility() {
    const searchContainer = document.getElementById(SEARCH_CONTAINER_ID);
    if (!searchContainer) {
        console.error(`找不到 ID 為 "${SEARCH_CONTAINER_ID}" 的搜尋容器。`);
        return;
    }

    // if (searchContainer.style.display === 'none' || searchContainer.style.display === '') {
    if (searchContainer.classList.contains('hidden')) {
        // 顯示容器
        // searchContainer.style.display = 'flex'; // 或 'block'，取決於您的 CSS 佈局
        searchContainer.classList.remove("hidden");
        searchContainer.classList.add("show");
        // toastr.info('搜尋功能已開啟。');
    } else {
        // 隱藏容器
        // searchContainer.style.display = 'none';
        searchContainer.classList.remove("show");
        searchContainer.classList.add("hidden");
        
        // 【重要】當關閉搜尋容器時，同時移除所有高亮標記
        removeHighlights(); 
        
        // 清空輸入框
        const searchInput = document.getElementById(SEARCH_TEXT_ID);
        if (searchInput) searchInput.value = '';

        // toastr.info('搜尋功能已關閉並清除標記。');
    }
}

    // --- 函數：執行搜尋並高亮 ---
    /**
     * 搜尋並高亮特定文字，並初始化匹配項導航。
     * @param {string} searchText - 要搜尋的文字。
     */
    function performSearch(searchText) {
        if (!regulationContent || !searchText) {
            removeHighlights();
            toastr.info('請輸入要搜尋的關鍵字。');
            return;
        }

        // 1. 移除先前的高亮
        removeHighlights();

        // 2. 儲存原始內容
        originalContent = regulationContent.innerHTML;

        // 3. 執行高亮替換
        const regex = new RegExp(`(${searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        // 使用 <mark> 標籤進行替換，並加上高亮類別
        const highlightedHtml = originalContent.replace(regex, `<mark class="${HIGHLIGHT_CLASS}">$1</mark>`);

        // 4. 插入高亮後的 HTML
        regulationContent.innerHTML = highlightedHtml;

        // 5. 獲取所有匹配項並更新狀態
        matchNodes = Array.from(regulationContent.querySelectorAll(`mark.${HIGHLIGHT_CLASS}`));
        const matchCount = matchNodes.length;
        const searchCountSpan = document.getElementById(SEARCH_COUNT_ID);

        if (searchCountSpan) {
            searchCountSpan.textContent = matchCount > 0 ? `找到 ${matchCount} 個結果` : '找不到結果';
        }

        if (matchCount > 0) {
            // 顯示導航按鈕
            const nextBtn = document.getElementById(NEXT_MATCH_BTN_ID);
            const prevBtn = document.getElementById(PREV_MATCH_BTN_ID);
            if (nextBtn) nextBtn.style.display = 'inline-block';
            if (prevBtn) prevBtn.style.display = 'inline-block';
            
            // 定位到第一個匹配項
            currentMatchIndex = -1; // 確保從第一個開始
            toastr.success(`找到 ${matchCount} 個結果。`);
            scrollToMatch(0);
        } else {
            toastr.info('找不到結果。');
        }
    }

    // --- 函數：捲動到特定匹配項並標記 ---
    /**
     * 捲動到指定索引的匹配項並加上 `current-match` 標記。
     * @param {number} index - 要捲動到的匹配項索引。
     */
    function scrollToMatch(index) {
        if (matchNodes.length === 0) return;

        // 1. 清除舊的 current-match 標記
        if (currentMatchIndex >= 0 && currentMatchIndex < matchNodes.length) {
            matchNodes[currentMatchIndex].classList.remove(CURRENT_MATCH_CLASS);
        }

        // 2. 處理索引循環 (確保 index 在 [0, length-1] 範圍內)
        currentMatchIndex = (index % matchNodes.length + matchNodes.length) % matchNodes.length;

        // 3. 標記新的 current-match
        const targetNode = matchNodes[currentMatchIndex];
        targetNode.classList.add(CURRENT_MATCH_CLASS);

        // 4. 更新計數顯示 (可選)
        const searchCountSpan = document.getElementById(SEARCH_COUNT_ID);
        if (searchCountSpan) {
            searchCountSpan.textContent = `第（${currentMatchIndex + 1}/${matchNodes.length}）個結果`;
        }

        // 5. 平滑捲動到目標節點
        targetNode.scrollIntoView({
            behavior: 'smooth',
            block: 'center' // 捲動到中間會更易於查看
        });
    }

    // --- 函數：處理搜尋按鈕點擊 ---
    function handleSearchClick() {
        const searchInput = document.getElementById(SEARCH_TEXT_ID);
        if (searchInput) {
            const searchText = searchInput.value.trim();
            performSearch(searchText);
        }
    }

    // --- 函數：處理導航按鈕點擊 ---
    function handleNavigation(direction) {
        if (matchNodes.length === 0) return;

        let nextIndex = currentMatchIndex + direction;
        scrollToMatch(nextIndex);
    }

    // --- 執行載入 ---
    Promise.allSettled([
        loadHtmlFragment(HEADER_FILE, headerPlaceholder, '頁首'),
        loadHtmlFragment(FOOTER_FILE, footerPlaceholder, '頁尾'),
        loadHtmlFragment(BUTTONS_FILE, buttonsPlaceholder, '功能列表') // **載入功能列表**
    ]).then(results => {
        const footerResult = results[1];
        if (footerResult.status === 'fulfilled' && footerResult.value !== null) {
            updateFooterInfo(footerPlaceholder);
        }

        console.log('頁首、頁尾與功能列表載入流程完成。');

        addAnchorAndLinkToArtSpans(); // 處理 span.art 元素

        // addAnchorAndLinkToArtSpans 執行完畢，處理頁面載入後的平滑捲動
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                console.log(`找到錨點 ${hash}，準備捲動。`);
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // 'start' 使元素的頂部與視口的頂部對齊
                });
            } else {
                console.warn(`找不到 ID 為 ${hash} 的元素。`);
            }
        }

// --- 函數：初始化搜尋功能 ---
        function initializeSearch() {
            console.log('initializeSearch 函數開始執行。');

            // 取得切換按鈕
            const toggleSearchBtn = document.getElementById(TOGGLE_SEARCH_BTN_ID);
            
            // 1. 綁定搜尋切換按鈕事件
            if (toggleSearchBtn) {
                toggleSearchBtn.addEventListener('click', toggleSearchVisibility);
                console.log('搜尋切換按鈕事件已綁定。');
            } else {
                console.warn('找不到搜尋切換按鈕元素 (ID: toggleSearchBtn)！');
            }

            // 2. 綁定搜尋、導航事件
            const searchBtn = document.getElementById(SEARCH_BTN_ID);
            const searchInput = document.getElementById(SEARCH_TEXT_ID);
            const nextMatchBtn = document.getElementById(NEXT_MATCH_BTN_ID);
            const prevMatchBtn = document.getElementById(PREV_MATCH_BTN_ID);
            
            if (searchBtn && searchInput) {
                searchBtn.addEventListener('click', handleSearchClick);
                searchInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        handleSearchClick();
                        e.preventDefault(); 
                    }
                });
                searchInput.addEventListener('input', function() {
                    if (searchInput.value.trim() === '' && originalContent) {
                        removeHighlights();
                    }
                });
                console.log('搜尋按鈕與輸入框事件已綁定。');
            } else {
                console.warn('找不到搜尋按鈕或輸入框元素！');
            }

            if (nextMatchBtn) {
                nextMatchBtn.addEventListener('click', () => handleNavigation(1));
            }
            
            if (prevMatchBtn) {
                prevMatchBtn.addEventListener('click', () => handleNavigation(-1));
            }
        }
    
        initializeSearch();
        // --- 搜尋功能初始化結束 ---

    const backBtn = document.getElementById('backBtn');
    console.log('即將啟動myBtn（回上頁按鈕）');
    if (backBtn) {
        console.log('myButton 元素已找到（',backBtn,'），添加點擊事件監聽器。');
        backBtn.addEventListener('click', function() {
            window.location.href = '../';
        });
    }

    // --- 新增：初始化主題切換邏輯的函數 ---
    function initializeThemeSwitcher() {
        console.log('initializeThemeSwitcher 函數開始執行。');
        const themeRadios = document.querySelectorAll('.theme-controller');
        const htmlElement = document.documentElement; // 獲取 <html> 元素
        const localStorageKey = 'daisyuiTheme'; // 儲存主題的 localStorage 鍵名

        // 1. 頁面載入時，從 localStorage 讀取並應用主題
        const savedTheme = localStorage.getItem(localStorageKey);
        if (savedTheme) {
            htmlElement.setAttribute('data-theme', savedTheme); // 設定 <html> 的 data-theme 屬性
            // 同步更新 radio 按鈕的選中狀態
            const savedRadio = document.querySelector(`input[value="${savedTheme}"]`);
            if (savedRadio) {
                savedRadio.checked = true;
                console.log(`已從 localStorage 載入主題: ${savedTheme}`);
            } else {
                console.warn(`localStorage 中儲存的主題 '${savedTheme}' 找不到對應的 radio 按鈕。`);
            }
        } else {
            // 如果 localStorage 沒有儲存，預設使用第一個主題或 'default' 主題
            const defaultThemeRadio = document.querySelector('input[name="theme-dropdown"]:checked') || document.querySelector('input[value="default"]');
            if (defaultThemeRadio) {
                htmlElement.setAttribute('data-theme', defaultThemeRadio.value);
                localStorage.setItem(localStorageKey, defaultThemeRadio.value);
                defaultThemeRadio.checked = true;
                console.log(`localStorage 無主題，設定預設主題: ${defaultThemeRadio.value}`);
            } else {
                console.warn('找不到預設主題的 radio 按鈕或任何選中的主題。');
            }
        }

        // 2. 監聽 radio 按鈕的變更事件，儲存新主題並應用
        if (themeRadios.length > 0) {
            themeRadios.forEach(radio => {
                radio.addEventListener('change', (event) => {
                    const selectedTheme = event.target.value; // 取得被選中的主題值
                    htmlElement.setAttribute('data-theme', selectedTheme);
                    localStorage.setItem(localStorageKey, selectedTheme);
                    console.log(`主題已切換並儲存: ${selectedTheme}`);
                });
            });
            console.log('主題切換監聽器已成功綁定。');
        } else {
            console.warn('未找到任何主題切換 radio 按鈕 (.theme-controller)。');
        }
    }
        console.log('initializeThemeSwitcher 函數預備執行');
        initializeThemeSwitcher();

        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": true,
            "onclick": null,
            "showDuration": "250",
            "hideDuration": "1500",
            "timeOut": "1500",
            "extendedTimeOut": "0",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "slideDown",
            "hideMethod": "fadeOut",
            "onShown": function() {
                const toastElement = this;
                toastElement.style.opacity = '1';
            }
        };

        // --- 加入複製連結的程式碼 ---
        if (buttonsPlaceholder) {
            const copyLinkButtons = buttonsPlaceholder.querySelectorAll('button[type="copy_link"]');
            console.log('找到的複製連結按鈕 (在容器內):', copyLinkButtons);
            copyLinkButtons.forEach(button => {
                button.addEventListener('click', function() {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href)
                            .then(() => {
                                toastr.success('網址已複製！');
                            })
                            .catch(err => {
                                console.error('複製網址失敗:', err);
                                toastr.error('複製網址失敗，請另開新視窗，或手動複製。');
                            });
                    } else {
                        alert('您的瀏覽器不支援複製到剪貼簿的功能，請手動複製。');
                    }
                });
            });
        } else {
            console.warn('找不到按鈕容器元素！');
        }
        // --- 複製連結的程式碼結束 ---

        // 將條內單一「項」par加上 only-one-par 類別
        const artDataElements = document.querySelectorAll('.art-data');
        artDataElements.forEach(artData => {
            const parElements = artData.querySelectorAll('.par');
            const firstPar = artData.querySelector('.par');

            if (parElements.length === 1 && firstPar) {
                firstPar.classList.add('only-one-par');
            } else if (firstPar) {
                firstPar.classList.remove('only-one-par');
            }
        });

        console.log('DOMContentLoaded 事件中的程式碼執行完畢。');
    });

    // --- 新增：返回頂部按鈕的邏輯 ---
    if (scrollToTopBtn) {
        window.onscroll = function() {
            scrollFunction();
        };

        function scrollFunction() {
            if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
                // scrollToTopBtn.style.display = "block";
                scrollToTopBtn.classList.add("show");
            } else {
                // scrollToTopBtn.style.display = "none";
                scrollToTopBtn.classList.remove("show");
            }
        }

        scrollToTopBtn.addEventListener("click", function() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
        console.log('「返回頂部」按鈕功能已初始化。');
    }
});