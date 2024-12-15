// ==UserScript==
// @name         YouTube 自动选择画质和全屏
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  自动将YouTube视频画质优先设置为1440p或最高，确保视频在适当的横屏或竖屏模式下播放。
// @author       ChatGPT
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @updateURL    https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/YouTube.js
// @downloadURL  https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/YouTube.js
// ==/UserScript==

(function () {
    'use strict';

    const preferredQuality = 'hd1440'; // 首选分辨率

    function setVideo() {
        const player = document.querySelector('.html5-video-player');
        if (player && player.getAvailableQualityLevels) {

            const availableQualities = player.getAvailableQualityLevels();
            const qualityToSet = availableQualities.includes(preferredQuality)
                ? preferredQuality
                : availableQualities[0] || null;

            if (qualityToSet) {
                player.setPlaybackQualityRange(qualityToSet);
                player.setPlaybackQuality(qualityToSet);

                if (!document.fullscreenElement && player.requestFullscreen) {
                    player.requestFullscreen();

                    if (player.getVideoAspectRatio() > 1.5) {
                        screen.orientation.lock('landscape');
                    }
                }
            }
        }
    }

    function onPageUpdated() {
        if (location.pathname === '/watch') {
            setVideo();
        }
    }

    document.addEventListener('yt-page-data-updated', onPageUpdated);
})();
