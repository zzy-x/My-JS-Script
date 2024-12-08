// ==UserScript==
// @name         抖音优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  抖音评论中间展开，双击打开评论且取消点赞
// @author       zzy
// @match        https://www.douyin.com/*
// @icon         https://www.douyin.com/favicon.ico
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/douyin.js
// @downloadURL  https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/douyin.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
    /* 隐藏全屏退出，右侧展开，右侧点赞评论等，全屏上下切换，评论区上方大家都在搜，触摸屏优化脚本，播放时进度条，评论下方回复点赞，评论区顶部等等按钮 */
    .PysK8uyn, .zNBuJls_, div.I6U7FiE8, .xgplayer-playswitch.NGNo484y.filter-bg, .comment-header-with-search, .TouchGesture_Btn.TouchGestureForbidScroll, .xgplayer-playing:not(.xgplayer-pause) > xg-controls, .vXZJEXVc, .FDYan0Fo.lMX0vxiU.semi-always-dark.YbzuqE5j.BrYiovk2{
        display:none; !important;
    }
    /* 左下角视频信息靠底部显示 */
    .U0RTp0k8{
        bottom:0px !important;
    }
    /* 视频铺满，使评论不从右侧展开 */
    #sliderVideo[data-e2e] .playerContainer{
        width: 100% !important;
    }
    /* 点开评论时，使视频往上提，隐藏左下角视频信息 */
    #sliderVideo[data-e2e] .playerContainer[class~='Yyf8NWk0']{
        height: 45% !important;
    }
    #sliderVideo[data-e2e] .playerContainer[class~='Yyf8NWk0'] .U0RTp0k8{
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
    `);

    // 双击
    document.addEventListener('dblclick', function (e) {
        let v = document.querySelector("#sliderVideo[data-e2e='feed-active-video']");
        v.querySelector(".jp8u3iov").click(); //打开评论

        setTimeout(() => {
            let a = document.querySelector('#videoSideCard'); //评论区
            var svg = a.querySelector('svg'); //关闭评论区按钮
            svg.firstChild.setAttribute("fill", "white");
            let b = a.querySelector('span.kXqO4xu2');
            b.parentNode.appendChild(svg);
        }, 100);

        setTimeout(() => {
            v.querySelector(".UIQajZAR").click(); //取消点赞
        }, 1000);
    });

    // 全屏，取消静音
    let t = setInterval(() => {
        let c = document.querySelector("#sliderVideo xg-icon.xgplayer-volume");
        if (c == null) return;
        clearInterval(t);

        setTimeout(() => {
            if (c.dataset.state == 'mute') {
                c.firstElementChild.click();
            }
            document.querySelector("#sliderVideo xg-icon.xgplayer-fullscreen").click();
        }, 50);
    }, 200);

})();














