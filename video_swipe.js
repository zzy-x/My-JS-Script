// ==UserScript==
// @name         滑动视频调整进度
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  移动端视频左右滑动调整进度。B站，抖音，YouTube，
// @author       ChatGPT, zzy
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.douyin.com/?recommend=1
// @match        https://www.douyin.com/?is_from_mobile_home=1&recommend=1
// @match        https://www.youtube.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/video_swipe.js
// @downloadURL  https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/video_swipe.js
// ==/UserScript==

(function () {
    'use strict';

    let startX = 0; // 触摸起点的 X 坐标
    let startY = 0; // 触摸起点的 Y 坐标
    let startTime = 0; // 记录开始时的视频时间
    let formattedStartTime = null; // 缓存的已格式化的startTime
    let timeChange = 0; // 滑动调整的时间
    let tmpTimeChange;
    const swipeThreshold = 10; // 滑动的最小阈值 (px)

    // 全局缓存 tooltip 的尺寸
    let tooltipWidth = 0;
    let tooltipHeight = 0;

    // 创建tooltip并返回
    function createTooltip(video) {
        const tooltip = document.createElement('div');
        tooltip.classList.add('video-tooltip'); // 给tooltip加一个类名
        tooltip.style.cssText = `
            position: absolute;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            font-size: 16px;
            padding: 5px 10px;
            border-radius: 5px;
            pointer-events: none;
            visibility: hidden;
            display: block;
        `;
        video.parentElement.insertBefore(tooltip, video);

        // 临时设置内容，确保 tooltip 的尺寸被计算出来
        tooltip.textContent = '0:00:00 +0s';
        // 缓存 tooltip 的尺寸
        if (tooltipWidth === 0 && tooltipHeight === 0) {
            tooltipWidth = tooltip.offsetWidth;
            tooltipHeight = tooltip.offsetHeight;
        }

        return tooltip;
    }

    // 显示提示框
    function showTooltip(tooltip, currentTime, adjustedTime) {
        tooltip.textContent = `${currentTime} ${adjustedTime > 0 ? `+${adjustedTime}s` : `${adjustedTime}s`}`;
        tooltip.style.visibility = 'visible';
    }

    // 格式化时间为 MM:SS 或 HH:MM:SS 格式
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600); // 计算小时
        const mins = Math.floor((seconds % 3600) / 60); // 计算分钟
        const secs = Math.floor(seconds % 60); // 计算秒数

        if (hours > 0) {
            return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        } else {
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    }

    // 添加视频滑动控制事件
    function addSwipeHandler(video) {
        if (video.__hasSwipeHandler) return; // 防止重复绑定
        video.__hasSwipeHandler = true;

        // 为每个视频创建独立的tooltip
        const tooltip = createTooltip(video);

        video.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = video.currentTime;
            formattedStartTime = formatTime(startTime);

            let newL = (video.offsetWidth - tooltipWidth) / 2;
            let newT = (video.offsetHeight - tooltipHeight) / 2;
            tooltip.style.transform = `translate(${newL}px, ${newT}px)`;
        });

        video.addEventListener('touchmove', (e) => {
            e.preventDefault(); // 阻止页面滚动行为

            const deltaX = e.touches[0].clientX - startX; // 计算水平滑动距离
            const deltaY = e.touches[0].clientY - startY; // 计算垂直滑动距离

            // 水平滑动
            if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
                timeChange = Math.floor(Math.pow(deltaX / 10, 1.3)); // 使得滑动更快
                if (timeChange !== tmpTimeChange) { //timeChange改变
                    showTooltip(tooltip, formattedStartTime, timeChange);
                    tmpTimeChange = timeChange;
                }
            }
        });

        video.addEventListener('touchend', (e) => {
            // 防止单击触发，改变视频进度
            if (timeChange !== 0) {
                const newTime = Math.max(0, Math.min(video.duration, startTime + timeChange));
                video.currentTime = newTime;
            }
            timeChange = 0;

            tooltip.style.visibility = 'hidden';
        });
    }

    // 监听页面中所有的视频元素（包括新添加的）
    function observeVideos() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'VIDEO') {
                        addSwipeHandler(node);
                    }

                    if (node.nodeType === 1) {
                        const videos = node.querySelectorAll('video');
                        videos.forEach((video) => addSwipeHandler(video));
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始化扫描已有的视频元素
        document.querySelectorAll('video').forEach((video) => {
            addSwipeHandler(video);
        });
    }

    // 等待页面资源加载完成后执行操作
    window.onload = function () {
        setTimeout(() => {
            observeVideos(); // 启动 MutationObserver 和初始扫描
        }, 3000);
    };
})();


