// ==UserScript==
// @name        禁漫天堂网页优化
// @name:zh-CN  禁漫天堂网页优化
// @name:zh-TW  禁漫天堂網頁優化 
// @name:zh-HK  禁漫天堂網頁優化
// @namespace   https://greasyfork.org/zh-CN/users/862042-cktime
// @author      cktime
// @version     1.0.5
// @description         繁简体自适应，去除广告和烦人的通知提示，移动端和桌面端通用
// @description:zh-CN   繁简体自适应，去除广告和烦人的通知提示，移动端和桌面端通用 
// @description:zh-TW   繁簡體自適應，去除廣告和煩人的通知提示，移動端和桌面端通用 
// @description:zh-HK   繁簡體自適應，去除廣告和煩人的通知提示，移動端和桌面端通用 
// @match       *://jmcomic1.mobi/*
// @match       *://18comic.org/*
// @match       *://18comic.vip/*
// @icon        https://s2.loli.net/2022/01/07/G2TCPjh8fsqSJte.png
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-body
// ==/UserScript==
 
(function () {
    const success = 'color:#4EE04E',
        error = 'color:#f91b1b',
        warning = 'color:#ffc107';
    //禁漫域名
    var hosts = [
        '18comic.vip',
        '18comic.cc',
        '18comic.org'
    ]
    if (!hosts.includes(location.hostname)) {
        console.log('%cThe current domain name is not in the scope of this script!', error);
        return false;
    }
    var config = {
        'setChar': true,
        'hideNotice': true
    }
    const character = {
        traditional: ['zh-TW', 'zh-HK', 'zh-Hant', 'zh-MO'].includes(navigator.language),
        simplified: ['zh-CN', 'zh-Hans', 'zh-SG', 'zh-MY'].includes(navigator.language),
        char: ['zh-CN', 'zh-Hans', 'zh-SG', 'zh-MY'].includes(navigator.language) ? 's' : 't'
    }
    const menus = {
        't': {
            'setChar': '繁簡體自適應',
            'hideNotice': '隱藏提示和通知'
        },
        's': {
            'setChar': '繁简体自适应',
            'hideNotice': '隐藏提示和通知'
        }
    };
    const menu = menus[character.char];
    function handleCookies(instruct) {
        switch (instruct) {
            case 'set-hide-notice':
                document.cookie = "cover=1; expires=Fri, 31 Dec 2222 23:59:59 GMT; path=/;samesite=strict";
                document.cookie = "guide=1; expires=Fri, 31 Dec 2222 23:59:59 GMT; path=/;samesite=strict";
                break;
            case 'rm-hide-notice':
                document.cookie = "cover=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;samesite=strict";
                document.cookie = "guide=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;samesite=strict";
                break;
            case 'rm-char':
                document.cookie = "AVS=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;samesite=strict";
                break;
        }
    }
    function addCSS(style) {
        let styleTag = document.createElement('style');
        styleTag.innerHTML = style;
        document.head ? document.head.append(styleTag) : document.documentElement.appendChild(styleTag);
    }
    function characterAdaptation() {
        const changeChar = (setChar) => {
            //获取可以更改的字体
            const another = document.querySelector("a.change-language[href='#']")?.id;
            //判断setChar是否等于可以更改的字体
            if (setChar == another) {
                const form = document.querySelector("form#languageSelect");
                if (form) {
                    document.querySelector("input#language").value = setChar;
                    console.log('%cSet character successfully', success);
                    form.submit()
                } else {
                    console.log('%cNot Found Tag form', error);
                }
            }
        }
        //判断简体或繁体
        if (character.traditional) {
            //设置繁体字
            changeChar('cn_CT');
            console.log('%cNow the character is ' + navigator.language, success);
        } else if (character.simplified) {
            //设置简体字
            changeChar('cn_CS');
            console.log('%cNow the character is ' + navigator.language, success);
        } else {
            console.log('%cUnrecognized character', warning);
        }
    }
    function register() {
        if ("undefined" == typeof GM_registerMenuCommand || "undefined" == typeof GM_getValue || "undefined" == typeof GM_setValue) {
            console.log("%cGM函数不存在，无法注册菜单", warning);
            return false;
        }
        if (!GM_getValue('config')) {
            GM_setValue("config", JSON.stringify(config))
        } else {
            let savedConfig = JSON.parse(GM_getValue("config"));
            //维护和更新已保存的config
            for (let key in config) {
                if ('undefined' == typeof savedConfig[key]) {
                    savedConfig[key] = config[key];
                }
                else {
                    config[key] = savedConfig[key];
                }
            }
            GM_setValue("config", JSON.stringify(config));
        }
        for (let key in config) {
            let w = config[key] == true ? `✅ ${menu[key]}` : `❌ ${menu[key]}`;
            GM_registerMenuCommand(w, function () {
                config[key] = !config[key];
                GM_setValue("config", JSON.stringify(config));
                //按钮触发事件
                switch (key) {
                    case 'setChar':
                        config['setChar'] ? false : handleCookies('rm-char');
                        break;
                    case 'hideNotice':
                        config['hideNotice'] ? false : handleCookies('rm-hide-notice');
                        break;
                }
                if (location.search.length <= 0)
                    location.href = location.href + '?cktime-js';
                else
                    location.href = location.href + '&cktime-js';
            });
        }
    }
    //注册菜单
    register();
    //自适应
    if (config['setChar']) {
        //兼容
        let i = setTimeout(characterAdaptation, 200);
        document.addEventListener('DOMContentLoaded', () => {
            clearTimeout(i);
            characterAdaptation();
        });
    }
    //提示和公告
    if (config['hideNotice'])
        handleCookies('set-hide-notice');
    //广告
    addCSS(`
        div[class='well e2ce-20_b']{
            display:none !important;
        }
        .pull-left > li.top-menu-link:nth-child(-n+5){
            display:none !important;
        }
        .pull-left > li.top-menu-link:nth-child(7){
            display:none !important;
        }
        .e2ce-20_b{
        display:none !important;
        }
        .bot-per-times, .bot-per-back{
            display:none !important;
        }
        .bot-per-context{
            display:none !important;
        }
        .d18912-2_43.top-a2db{
            display:none !important;
        } 
        .d18912-2_43{
            display:none !important;
        }
    `);
})();
