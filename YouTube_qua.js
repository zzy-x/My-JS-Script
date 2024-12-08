// ==UserScript==
// @name         YouTube默认优先1440p或最高画质
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动将YouTube视频画质优先设置为1440p，如果没有1440p，则选择最高可用画质。
// @author       ChatGPT
// @match        *://www.youtube.com/watch*
// @match        *://m.youtube.com/watch*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @updateURL    https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/YouTube_qua.js
// @downloadURL  https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/YouTube_qua.js
// ==/UserScript==

(function () {
    'use strict';

    const preferredQuality = 'hd1440'; // 首选分辨率

    // 设置视频画质的函数
    function setQuality() {
        const player = document.querySelector('.html5-video-player'); // 获取视频播放器对象

        if (player && player.getAvailableQualityLevels) {
            const availableQualities = player.getAvailableQualityLevels(); // 获取当前视频的可用分辨率
            console.log('可用分辨率:', availableQualities); // 打印可用分辨率，方便调试

            const qualityToSet = availableQualities.includes(preferredQuality)
                ? preferredQuality
                : availableQualities[0] || null; // 如果没有可用的画质，设置为 null

            if (qualityToSet) {
                player.setPlaybackQualityRange(qualityToSet);
                player.setPlaybackQuality(qualityToSet);
                console.log(`已设置画质为: ${qualityToSet}`);
            } else {
                console.warn('没有可用分辨率！');
            }
        }
    }

    // 等待视频播放器加载完毕后调用
    function waitForPlayer() {
        const player = document.querySelector('.html5-video-player'); // 检查播放器是否已加载
        console.log('检测播放器');

        if (player && player.getAvailableQualityLevels) {
            console.log('检测到播放器，开始设置画质...');
            setQuality(); // 设置画质，仅执行一次
        } else {
            setTimeout(waitForPlayer, 1000); // 如果播放器未加载，延迟后重试
        }
    }

    // 仅在视频播放页面运行脚本
    if (location.pathname === '/watch') {
        waitForPlayer();
    }
})();
