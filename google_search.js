// ==UserScript==
// @name         Google_search
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在谷歌搜索页面的右侧面板放置按钮，支持快捷操作
// @author       ChatGPT
// @match        https://www.google.com/search*
// @icon         https://www.google.com/favicon.ico
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/google_search.js
// @downloadURL  https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/google_search.js
// ==/UserScript==

(function () {
    'use strict';

    window.onload = function () {
        const query = new URLSearchParams(window.location.search).get('q');
        const searchResults = document.getElementById('rcnt');
        if (!searchResults) return;  // 如果没有 #rcnt，就退出

        // 查找或创建右侧面板
        let rhsPanel = document.getElementById('rhs');
        if (!rhsPanel) {
            rhsPanel = document.createElement('div');
            rhsPanel.id = 'rhs';
            searchResults.appendChild(rhsPanel);
        }

        // 创建一个新的 div 来容纳按钮
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'button-container';

        // 快捷操作配置
        const actions = [
            { label: '中文', action: () => changeSearchQuery('中文') },
            { label: 'jav', action: () => changeSearchQuery('jav') },
            { label: '字幕', action: () => changeSearchQuery('字幕') },
            { label: 'subtitle', action: () => changeSearchQuery('subtitle') },
        ];

        // 动态创建按钮
        actions.forEach(({ label, action }) => {
            const button = document.createElement('button');
            button.classList.add('custom-button');
            button.innerText = label;
            button.onclick = action;

            buttonContainer.appendChild(button); // 将按钮加入到按钮容器中
        });

        // 将按钮容器添加到右侧面板
        rhsPanel.insertBefore(buttonContainer, rhsPanel.firstChild);

        // 搜索内容转换并跳转
        function changeSearchQuery(suffix) {
            if (query) {
                const newQuery = query + ' ' + suffix;
                window.location.href = `https://www.google.com/search?q=${encodeURIComponent(newQuery)}`;
            }
        }

        // 使用 GM_addStyle 添加按钮样式
        GM_addStyle(`
            .custom-button {
                border-radius: 5px;
                margin-right: 10px;
                font-size: 12px;
                cursor: pointer;
                height: 21px;
                background-color: #f1f1f1;
                border: 1px solid #ccc;
                transition: background-color 0.3s, transform 0.3s;
            }

            .custom-button:hover {
                background-color: #e0e0e0;  /* 悬停时背景色变化 */
            }
        `);
    };
})();
