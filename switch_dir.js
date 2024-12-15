// ==UserScript==
// @name         双击视频切换横竖屏
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  全屏状态下双击视频切换横竖屏。支持：抖音，YouTube，B站，斗鱼。
// @author       ChatGPT
// @match        https://www.douyin.com/?recommend=1
// @match        https://www.douyin.com/?is_from_mobile_home=1&recommend=1
// @match        https://www.youtube.com/*
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.douyu.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/switch_dir.js
// @downloadURL  https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/switch_dir.js
// ==/UserScript==

(function () {
    'use strict';

    // 切换屏幕方向
    const toggleOrientation = () => {
        const orientation = screen.orientation.type.startsWith("landscape") ? "portrait-primary" : "landscape-primary";
        screen.orientation.lock(orientation).catch(() => { });
    };

    // 触发一个自定义点击事件
    const triggerClickEvent = (element) => {
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        element.dispatchEvent(clickEvent);
    };

    let lastTouchTime = 0;
    const doubleTapThreshold = 300; // 双击最大时间间隔

    document.addEventListener('touchend', function (event) {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - lastTouchTime;

        if (timeDifference <= doubleTapThreshold && document.fullscreenElement) {
            // 延时第二次点击，相当于两次单击，防止触发默认双击事件
            event.preventDefault();
            event.stopPropagation();
            setTimeout(() => {
                triggerClickEvent(event.target);
            }, doubleTapThreshold);

            toggleOrientation();
        }

        lastTouchTime = currentTime; // 更新最后触摸时间
    });

})();
