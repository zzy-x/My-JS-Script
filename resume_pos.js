// ==UserScript==
// @name         ins回到浏览位置
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @author       ChatGPT
// @description  记住Instagram浏览位置，返回时回到位置
// @match        https://www.instagram.com/*
// @exclude      https://www.instagram.com/*/*/*
// @icon         https://www.instagram.com/favicon.ico
// @grant        none
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/resume_pos.js
// @downloadURL  https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/resume_pos.js
// ==/UserScript==

(function () {
    // 获取当前页面的滚动位置键名，用于区分不同页面
    let scrollPositionKey = getScrollPositionKey();

    // 根据当前页面路径获取唯一的滚动位置键
    function getScrollPositionKey() {
        return `insta_scroll_position_${window.location.pathname}`;
    }

    // 恢复滚动位置
    function restoreScrollPosition() {
        const targetPosition = Number(sessionStorage.getItem(scrollPositionKey || '')) || 0;
        if (!targetPosition) return;

        window.scrollTo(0, 0); // 清空当前滚动位置

        // 滚动到目标位置
        const scrollToPosition = () => {
            if (Math.abs(window.scrollY - targetPosition) < 5) return;
            window.scrollTo(0, targetPosition);
            setTimeout(() => requestAnimationFrame(scrollToPosition), 500);
        };

        requestAnimationFrame(scrollToPosition);
    }


    // 在页面加载完成时恢复滚动位置
    window.addEventListener('load', restoreScrollPosition);

    // 监听浏览器的返回前进事件（popstate）
    window.addEventListener('popstate', () => {
        sessionStorage.setItem(scrollPositionKey, window.scrollY);  // 保存当前滚动位置
        scrollPositionKey = getScrollPositionKey();  // 更新滚动位置键
        restoreScrollPosition();  // 恢复滚动位置
    });

    // 处理pushState事件
    const originalPushState = history.pushState;
    history.pushState = function (state, title, url) {
        sessionStorage.setItem(scrollPositionKey, window.scrollY);  // 保存当前滚动位置
        const result = originalPushState.apply(history, arguments);  // 调用原始的 pushState 方法
        scrollPositionKey = getScrollPositionKey();  // 更新滚动位置键
        restoreScrollPosition();  // 恢复滚动位置
        return result;
    };
})();
