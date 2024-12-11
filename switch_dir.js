// ==UserScript==
// @name         双击视频切换横竖屏
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  全屏状态下双击视频切换横竖屏。支持：抖音，YouTube。
// @author       ChatGPT
// @match        https://www.douyin.com/?recommend=1
// @match        https://www.douyin.com/?is_from_mobile_home=1&recommend=1
// @match        https://*.youtube.com/watch*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/switch_dir.js
// @downloadURL  https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/switch_dir.js
// ==/UserScript==

(function () {
    'use strict';

    // 检查是否是全屏状态
    const isFullScreen = () => {
        return document.fullscreenElement || document.webkitFullscreenElement;
    };

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
    let singleTapTimeout = null; // 单击延时处理的 Timeout

    document.addEventListener('touchend', function (event) {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - lastTouchTime;

        // 阻止默认行为
        event.preventDefault();
        event.stopPropagation();

        if (timeDifference <= doubleTapThreshold) {
            // 双击事件处理
            clearTimeout(singleTapTimeout); // 清除单击的延时处理
            if (isFullScreen()) {
                toggleOrientation(); // 双击切换屏幕方向
            }
        } else {
            // 单击事件处理
            singleTapTimeout = setTimeout(() => {
                triggerClickEvent(event.target); // 生成并触发自定义点击事件
            }, doubleTapThreshold);
        }

        lastTouchTime = currentTime; // 更新最后触摸时间
    });

})();
