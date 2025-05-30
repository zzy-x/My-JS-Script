// ==UserScript==
// @name         抖音优化
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  自动全屏(需先用户有操作)，取消静音，抖音评论中间展开，点击右侧打开评论，去除无关元素，全屏横屏时隐藏左下角信息
// @author       zzy
// @match        https://www.douyin.com/?recommend=1
// @match        https://www.douyin.com/?is_from_mobile_home=1&recommend=1
// @icon         https://www.douyin.com/favicon.ico
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/douyin.js
// @downloadURL  https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/douyin.js
// ==/UserScript==

(function () {
    'use strict';

    const video_info = '.AXQAavwp'; //左下角视频信息
    const foo = 'Kk4V1N2A'; //点开评论增加的class属性

    GM_addStyle(`
    /* 隐藏全屏退出，右侧展开，右侧点赞评论等，全屏上下切换，评论区上方大家都在搜，触摸屏优化脚本，播放时进度条，评论下方回复点赞，评论区顶部等等按钮 */
    .TNfGqxTO, .zNBuJls_, div.jkfSVWLT, .xgplayer-playswitch.NGNo484y.filter-bg, .comment-header-with-search, .TouchGesture_Btn.TouchGestureForbidScroll, .xgplayer-playing:not(.xgplayer-pause) > xg-controls, .vXZJEXVc, .FDYan0Fo.lMX0vxiU.semi-always-dark.YbzuqE5j.BrYiovk2{
        display:none; !important;
    }
    /* 左下角视频信息靠底部显示 */
    ${video_info}{
        bottom:0px !important;
    }
    /* 视频铺满，使评论不从右侧展开 */
    #sliderVideo[data-e2e] .playerContainer{
        width: 100% !important;
    }
    /* 点开评论时，使视频往上提，隐藏左下角视频信息 */
    #sliderVideo[data-e2e] .playerContainer[class~="${foo}"]{
        height: 45% !important;
    }
    #sliderVideo[data-e2e] .playerContainer[class~="${foo}"] ${video_info}{
        height: 0px !important;
    }
    /* 使评论区从中间铺满 */
    #sliderVideo[data-e2e="feed-active-video"] #videoSideCard{
        width: 100%;
        height: 75%;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.9);
        transition: height .15s linear !important;
        position: absolute;
    }
    /* 评论区隐形按钮 */
    .my-comment-button {
        position: fixed;
        right: 10px;
        bottom: 50px;
        width: 50px;
        height: 100px;
        opacity: 0;     /* 设置为完全透明 */
    }
    `);

    let slideList;
    window.addEventListener('load', () => {
        setTimeout(() => {
            slideList = document.querySelector('#slidelist');
            slideList.appendChild(button);
            //player.muted = false;
            player.getFullscreen();
        }, 1500);
    });


    // 全屏时，横屏隐藏左下角信息
    function updateVisibility() {
        if (!document.fullscreenElement) return; // 如果非全屏模式，直接退出

        const targetElements = slideList.querySelectorAll(video_info);
        targetElements.forEach(targetElement => {
            // 检测到的是旋转之前的状态
            targetElement.style.display = window.matchMedia("(orientation: landscape)").matches ? 'block' : 'none';
        });
    }
    window.addEventListener('orientationchange', updateVisibility);


    // 创建一个透明按钮开关评论区
    const button = document.createElement('button');
    button.classList.add('my-comment-button'); // 添加类名

    button.addEventListener('click', function () {
        const v = slideList.querySelector("#sliderVideo[data-e2e='feed-active-video']");
        v?.querySelector(".kT7icnwc")?.click();
    });

})();
