// ==UserScript==
// @name         加载本地字幕
// @version      0.1.1
// @description  加载本地srt字幕到在线视频
// @author       ChatGPT
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/add_subtitle.js
// @downloadURL  https://raw.githubusercontent.com/zzy-x/My-JS-Script/main/add_subtitle.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待remove_plyr.js完成再执行脚本
    setTimeout(() => {

        // 查找没有 'gifVideo' 和 'hidden' 类名且 display 内联样式不为 none 的第一个视频元素
        const videos = Array.from(document.querySelectorAll('video'));
        const video = videos.find(v => 
            !v.classList.contains('gifVideo') && 
            !v.classList.contains('hidden') && 
            v.style.display !== 'none'
        );
        if (!video) return;

        // 创建文件输入框，用于选择字幕文件
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.srt'; // 只允许选择.srt格式的文件
        input.style.opacity = '0'; // 隐藏文件输入框
        document.body.appendChild(input); // 将文件输入框添加到页面中

        // 创建按钮，点击时触发文件选择
        const button = document.createElement('button');
        button.textContent = '选择字幕';
        button.className = 'subtitle-button';  // 为按钮添加类名，方便CSS样式管理
        video.parentElement.appendChild(button); // 将按钮添加到视频的父元素中

        // 按钮点击事件，触发文件选择框
        button.addEventListener('click', () => input.click());

        // 5秒后隐藏按钮
        // const hideButtonTimeout = setTimeout(() => {
            // button.style.display = 'none'; // 隐藏按钮
        // }, 5000);

        // 处理文件选择事件
        input.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (!file || !file.name.endsWith('.srt')) return;

            // 使用FileReader读取字幕文件内容
            const reader = new FileReader();
            reader.onload = function (e) {
                const subtitles = parseSubtitles(e.target.result); // 解析字幕内容
                addSubtitlesToVideo(subtitles); // 将字幕添加到视频

                // 加载字幕成功后，隐藏按钮
                // button.style.display = 'none';
            };
            reader.readAsText(file); // 读取文件内容为文本
        });

        // 解析SRT字幕文件的内容，返回字幕条目
        function parseSubtitles(text) {
            const subtitles = [];
            const lines = text.split('\n'); // 按行分割字幕文件
            let startTime = 0, endTime = 0, captionText = ''; // 定义时间戳和字幕文本
            let isTimestampLine = false; // 标记是否是时间戳行

            lines.forEach(line => {
                // 匹配时间戳格式：hh:mm:ss,SSS --> hh:mm:ss,SSS
                const timeMatch = line.trim().match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})$/);

                if (timeMatch) {
                    // 如果当前有字幕文本，保存它到字幕数组
                    if (captionText) {
                        subtitles.push({ startTime, endTime, captionText });
                    }

                    // 解析时间戳
                    startTime = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
                    endTime = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;
                    captionText = ''; // 清空字幕文本
                    isTimestampLine = true; // 标记已找到时间戳
                } else if (line.trim() && isTimestampLine) {
                    // 如果是字幕文本行（时间戳后面的文本）
                    captionText += line + '\n'; // 累加字幕文本
                    isTimestampLine = false; // 标记文本已经处理完
                }
            });

            // 确保最后的字幕条目被添加
            if (captionText) {
                subtitles.push({ startTime, endTime, captionText });
            }

            return subtitles; // 返回所有字幕条目
        }

        // 将字幕添加到视频的字幕轨道
        function addSubtitlesToVideo(subtitles) {
            const track = video.addTextTrack('subtitles', 'English', 'en'); // 添加字幕轨道
            track.mode = 'showing'; // 设置字幕轨道显示模式
            subtitles.forEach(sub => {
                const cue = new VTTCue(sub.startTime, sub.endTime, sub.captionText); // 创建字幕提示
                track.addCue(cue); // 将字幕添加到轨道
            });
        }

        // 统一样式：使用GM_addStyle添加自定义样式
        GM_addStyle(`
        /* 按钮样式 */
        .subtitle-button {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 0px;
            width: 65px;          /* 固定按钮宽度 */
            height: 20px;         /* 固定按钮高度 */
            font-size: 12px;      /* 文字大小 */
            background: linear-gradient(135deg, #6e7dff, #4d58f7);  /* 使用渐变背景色 */
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10000;
            text-align: center;   /* 确保文字居中 */
            line-height: 12px;    /* 调整行高，使文字垂直居中 */
        }

        /* 按钮悬浮效果 */
        .subtitle-button:hover {
            background: linear-gradient(135deg, #4d58f7, #6e7dff);  /* 悬浮时交换渐变方向 */
        }

        /* 字幕显示样式（去掉黑色背景） */
        ::cue {
            background: transparent !important;  /* 确保没有背景色 */
        }
    `);

    }, 2000);
})();
