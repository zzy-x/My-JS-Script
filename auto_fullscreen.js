// ==UserScript==
// @name         自动全屏
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  自动在B站、斗鱼和抖音全屏。抖音点击音量按钮，B站、斗鱼横屏
// @author       ChatGPT
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.douyu.com/*
// @match        https://www.douyin.com/?recommend=1
// @match        https://www.douyin.com/?is_from_mobile_home=1&recommend=1
// @grant        none
// @updateURL    https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/auto_fullscreen.js
// @downloadURL  https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/auto_fullscreen.js
// ==/UserScript==

(function () {
    'use strict';

    // 判断当前是否是B站、斗鱼或抖音
    const currentUrl = location.href;
    const isBilibili = location.host.includes('bilibili.com');
    const isDouyu = /^https:\/\/www\.douyu\.com\/\d+/.test(currentUrl) || currentUrl.startsWith('https://www.douyu.com/topic/');
    const isDouyin = location.host.includes('douyin.com');

    // 全屏按钮和音量按钮的类名选择器
    const selectors = {
        bilibili: {
            player: '#bilibili-player',
            fullscreenBtn: '.bpx-player-ctrl-full',
        },
        douyu: {
            player: '#js-player-video-case',
            fullscreenBtn: '.fs-781153',
        },
        douyin: {
            player: '#sliderVideo',
            fullscreenBtn: '.xgplayer-fullscreen',
            volumeBtn: '.xgplayer-volume',
        },
    };

    // 自动执行全屏和横屏操作
    function autoFullscreenAndLandscape() {
        const config = isBilibili ? selectors.bilibili : (isDouyu ? selectors.douyu : (isDouyin ? selectors.douyin : null));
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

                // 判断是否为抖音，执行相应操作
                if (isDouyin) {
                    document.querySelector(selectors.douyin.volumeBtn)?.firstElementChild?.click();
                } else {
                    setTimeout(screen.orientation.lock('landscape'), 500); // 执行横屏操作（B站和斗鱼）
                }

                clearInterval(fullscreenBtnCheckInterval); // 找到后停止检查
            } else {
                buttonCheckCount++;
                if (buttonCheckCount >= maxChecks) {
                    clearInterval(fullscreenBtnCheckInterval); // 达到最大尝试次数停止检查
                }
            }
        }, checkInterval);
    }

    // 页面加载完成后自动执行全屏和横屏
    window.addEventListener('load', autoFullscreenAndLandscape);
})();
