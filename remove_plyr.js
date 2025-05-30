// ==UserScript==
// @name         去除Plyr播放器
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  选择最高画质。移除 Plyr 播放器并用原生视频替代，避免字幕被挡住
// @author       ChatGPT
// @match        https://missav.com/*
// @match        https://javplayer.me/e/*
// @icon         https://missav.com/favicon.ico
// @grant        none
// @updateURL    https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/remove_plyr.js
// @downloadURL  https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/remove_plyr.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {
        // 点开设置，选择最高画质
        document.querySelector('button[data-plyr="settings"]')?.click();
        document.querySelector('button[data-plyr="settings"] + button')?.click();
        setTimeout(() => {
            document.querySelector('button[data-plyr="quality"]')?.click();
        }, 1000);

        // 移除 Plyr 播放器
        setTimeout(() => {
            const plyrElements = document.querySelectorAll('.plyr');

            plyrElements.forEach(plyrElement => {
                const videoElement = plyrElement.querySelector('video');
                if (videoElement) {
                    videoElement.controls = true;  // 启用原生控件
                    videoElement.style.width = '100%';  // 设置视频宽度为 100%
                    videoElement.style.height = 'auto';  // 保持视频比例
                    plyrElement.parentNode.replaceChild(videoElement, plyrElement);  // 替换 Plyr 播放器
                }
            });
        }, 1100);
    });

})();
