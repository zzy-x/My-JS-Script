// ==UserScript==
// @name         去除Plyr播放器
// @namespace    https://example.com/
// @version      0.1.0
// @description  移除 Plyr 播放器并用原生视频替代，避免字幕被挡住
// @author       ChatGPT
// @match        https://missav.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/remove_plyr.js
// @downloadURL  https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/remove_plyr.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {
        const plyrElements = document.querySelectorAll('.plyr');

        plyrElements.forEach(plyrElement => {
            const videoElement = plyrElement.querySelector('video');
            if (videoElement) {
                videoElement.controls = true;  // 启用原生控件
                plyrElement.parentNode.replaceChild(videoElement, plyrElement);  // 替换 Plyr 播放器
            }
        });
    });

})();
