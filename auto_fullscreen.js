// ==UserScript==
// @name         自动全屏
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  自动在B站、斗鱼全屏并且横屏。
// @author       ChatGPT
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.douyu.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/auto_fullscreen.js
// @downloadURL  https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/auto_fullscreen.js
// ==/UserScript==

(function () {
    'use strict';

    // 判断当前是否是B站或斗鱼
    const currentUrl = location.href;
    const isBilibili = location.host.includes('bilibili.com');
    const isDouyu = /^https:\/\/www\.douyu\.com\/\d+/.test(currentUrl) || currentUrl.startsWith('https://www.douyu.com/topic/');

    // 全屏按钮和音量按钮的类名选择器
    // 点击按钮，不然是原生视频，没有弹幕
    const selectors = {
        bilibili: {
            player: '#bilibili-player',
            fullscreenBtn: '.bpx-player-ctrl-full',
        },
        douyu: {
            player: '#js-player-video-case',
            fullscreenBtn: '.fs-781153',
        },
    };

    // 自动执行全屏和横屏操作
    function autoFullscreenAndLandscape() {
        const config = isBilibili ? selectors.bilibili : (isDouyu ? selectors.douyu : null);
        if (!config) return;

        const videoPlayer = document.querySelector(config.player);
        if (!videoPlayer) return;

        // 定时查找全屏按钮并点击
        const checkInterval = 500;
        let buttonCheckCount = 0;
        const maxChecks = 20;

        const fullscreenBtnCheckInterval = setInterval(() => {
            const fullscreenButton = videoPlayer.querySelector(config.fullscreenBtn);
            if (fullscreenButton) {
                fullscreenButton.click();

                // 执行横屏操作（B站和斗鱼）
                setTimeout(() => {
                    screen.orientation.lock('landscape');
                }, 500);

                clearInterval(fullscreenBtnCheckInterval); // 找到后停止检查
            } else {
                if (++buttonCheckCount >= maxChecks)
                    clearInterval(fullscreenBtnCheckInterval); // 达到最大尝试次数停止检查
            }
        }, checkInterval);
    }

    // 页面加载完成后自动执行全屏和横屏
    window.addEventListener('load', autoFullscreenAndLandscape);
})();
