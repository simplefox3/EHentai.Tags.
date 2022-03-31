// ==UserScript==
// @name         ExHentai 中文标签助手_测试版
// @namespace    ExHentai 中文标签助手_DYZYFTS_beta
// @license		 MIT
// @version      3.1
// @icon         http://exhentai.org/favicon.ico
// @description  E-hentai + ExHentai 丰富的本地中文标签库 + 自定义管理收藏库，搜索时支持点击选择标签或者手动输入，页面翻译英文标签时支持本地标签库匹配和谷歌机翻。
// @author       地狱天使
// @match        *://e-hentai.org/*
// @match        *://www.e-hentai.org/*
// @match        *://exhentai.org/*
// @match        *://www.exhentai.org/*
// @grant        none
// @note         添加脚本地址
// @run-at       document-end
// @homepageURL  https://sleazyfork.org/zh-CN/scripts/441232
// ==/UserScript==

'use strict';

//#region step0.commonFunc.js 通用方法

// 检查字典是否为空
function checkDictNull(dict) {
    for (const n in dict) {
        return false;
    }
    return true;
}

// 获取地址参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substring(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}

// 数组删除元素
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

// 数组差集
function getDiffSet(array1, array2) {
    return array1.filter(item => !new Set(array2).has(item));
}

// 导出json文件
function saveJSON(data, filename) {
    if (!data) return;
    if (!filename) filename = "json.json";
    if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4);
    }
    // 要创建一个 blob 数据
    let blob = new Blob([data], { type: "text/json" }),
        a = document.createElement("a");
    a.download = filename;

    // 将blob转换为地址
    // 创建 URL 的 Blob 对象
    a.href = window.URL.createObjectURL(blob);

    // 标签 data- 嵌入自定义属性  屏蔽后也可正常下载
    a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");

    // 添加鼠标事件
    let event = new MouseEvent("click", {});

    // 向一个指定的事件目标派发一个事件
    a.dispatchEvent(event);
}

// 获取当前时间
function getCurrentDate(format) {
    var now = new Date();
    var year = now.getFullYear(); //年份
    var month = now.getMonth();//月份
    var date = now.getDate();//日期
    var day = now.getDay();//周几
    var hour = now.getHours();//小时
    var minu = now.getMinutes();//分钟
    var sec = now.getSeconds();//秒
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    var time = "";
    //精确到天
    if (format == 1) {
        time = year + "-" + month + "-" + date;
    }
    //精确到分
    else if (format == 2) {
        time = year + "/" + month + "/" + date + " " + hour + ":" + minu + ":" + sec;
    }
    return time;
}

// 调用谷歌翻译接口
function getGoogleTranslate(text, func) {
    var httpRequest = new XMLHttpRequest();
    var url = `http://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dj=1&dt=t&q=${text}`;
    httpRequest.open("GET", url, true);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            func(json);
        }
    }
}

// 展开折叠动画
var slideTimer = null;
function slideDown(element, realHeight, speed, func) {
    clearInterval(slideTimer);
    var h = 0;
    slideTimer = setInterval(function () {
        // 但目标高度与实际高度小于10px时，以1px的速度步进
        var step = (realHeight - h) / 10;
        step = Math.ceil(step);
        h += step;
        if (Math.abs(realHeight - h) <= Math.abs(step)) {
            h = realHeight;
            element.style.height = `${realHeight}px`;
            func();
            clearInterval(slideTimer);
        } else {
            element.style.height = `${h}px`;
        }
    }, speed);
}
function slideUp(element, speed, func) {
    clearInterval(slideTimer);
    slideTimer = setInterval(function () {
        var step = (0 - element.clientHeight) / 10;
        step = Math.floor(step);
        element.style.height = `${element.clientHeight + step}px`;
        if (Math.abs(0 - element.clientHeight) <= Math.abs(step)) {
            element.style.height = "0px";
            func();
            clearInterval(slideTimer);
        }
    }, speed);
}

// 页面样式注入
function styleInject(css, ref) {
	if (ref === void 0) ref = {};
	var insertAt = ref.insertAt;

	if (!css || typeof document === 'undefined') { return; }

	var head = document.head || document.getElementsByTagName('head')[0];
	var style = document.createElement('style');
	style.type = 'text/css';

	if (insertAt === 'top') {
		if (head.firstChild) {
			head.insertBefore(style, head.firstChild);
		} else {
			head.appendChild(style);
		}
	} else {
		head.appendChild(style);
	}

	if (style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}
}

//#endregion

//#region step0.constDatas.js 数据字典

// 详情页父级
const detailParentData = {
	"reclass": "重新分类",
	"parody": "二创",
	"male": "男性",
	"female": "女性",
	"mixed": "混合",
	"character": "角色",
	"artist": "作者",
	"other": "其他",
	"language": "语言",
	"group": "分组",
	"temp": "临时"
};

// 作品分类 01
const bookTypeData = {
	"Doujinshi": "同人志",
	"Manga": "漫画",
	"Artist CG": "艺术家 CG",
	"Game CG": "游戏 CG",
	"Western": "西方风格",
	"Non-H": "无 H 内容",
	"Image Set": "图像集",
	"Cosplay": "角色扮演",
	"Asian Porn": "亚洲色情",
	"Misc": "杂项"
}

// 作品分类02
const bookClassTypeData = {
	"ct2": "同人志",
	"ct3": "漫画",
	"ct4": "艺术家 CG",
	"ct5": "游戏 CG",
	"cta": "西方风格",
	"ct9": "无 H 内容",
	"ct6": "图像集",
	"ct7": "角色扮演",
	"ct8": "亚洲色情",
	"ct1": "杂项"
}

//#endregion

//#region step0.localstorage.js localstorage 数据方法，迁入 indexdb，如无特殊需要，删除之前存储的数据

// 版本号数据 读取、删除
var dbVersionKey = "categoryVersion";
function getVersion() {
    return localStorage.getItem(dbVersionKey);
}
function removeVersion() {
    localStorage.removeItem(dbVersionKey);
}

// 全部列表数据 读取、删除
var dbCategoryListHtmlKey = "categoryListHtml";
function getCategoryListHtml() {
    return localStorage.getItem(dbCategoryListHtmlKey);
}
function removeCategoryListHtml() {
    localStorage.removeItem(dbCategoryListHtmlKey);
}

// 折叠按钮位置 读取、删除
var dbCategoryListExpendKey = "categoryListExpendArray";
function getCategoryListExpend() {
    return JSON.parse(localStorage.getItem(dbCategoryListExpendKey));
}
function removeCategoryListExpend() {
    localStorage.removeItem(dbCategoryListExpendKey);
}

// 收藏列表数据 读取、删除
var dbFavoriteKey = "favoriteDict";
function getFavoriteDicts() {
    return JSON.parse(localStorage.getItem(dbFavoriteKey))
}
function removeFavoriteDicts() {
    localStorage.removeItem(dbFavoriteKey);
}

// 收藏列表折叠 读取、删除
var dbFavoriteListExpendKey = "favoriteListExpendArray";
function getFavoriteListExpend() {
    return JSON.parse(localStorage.getItem(dbFavoriteListExpendKey));
}
function removeFavoriteListExpend() {
    localStorage.removeItem(dbFavoriteListExpendKey);
}

// 头部搜索菜单显示隐藏开关
var dbOldSearchDivVisibleKey = "oldSearchDivVisibleKey";
function getOldSearchDivVisible() {
    return localStorage.getItem(dbOldSearchDivVisibleKey);
}
function removeOldSearchDivVisible() {
    localStorage.removeItem(dbOldSearchDivVisibleKey);
}

// 标签谷歌机翻_首页开关
var dbGoogleTranslateCategoryFontPage = "googleTranslateCategoryFontPage";
function getGoogleTranslateCategoryFontPage() {
    return localStorage.getItem(dbGoogleTranslateCategoryFontPage);
}
function removeGoogleTranslateCategoryFontPage() {
    localStorage.removeItem(dbGoogleTranslateCategoryFontPage);
}

// 标签谷歌机翻_详情页开关
var dbGoogleTranslateCategoryDetail = "googleTranslateCategoryDetail";
function getGoogleTranslateCategoryDetail() {
    return localStorage.getItem(dbGoogleTranslateCategoryDetail);
}
function removeGoogleTranslateCategoryDetail() {
    localStorage.removeItem(dbGoogleTranslateCategoryDetail);
}

//#endregion

//#region step0.switch.js 判断域名选择 exhentai 还是 e-henatai
const webHost = window.location.host;
function func_eh_ex(ehFunc, exFunc) {
	if (webHost == "e-hentai.org") {
		ehFunc();
	}
	else if (webHost == "exhentai.org") {
		exFunc();
	}
}

//#endregion

//#region step1.styleInject.js 样式注入
func_eh_ex(() => {
	// e-hentai 样式 eh.css
	const category_style = `#searchbox #div_old_hidden_btn {
		position: absolute;
		right: 20px;
		top: 22px;
		width: 100px;
		height: 48px;
		line-height: 48px;
		background-color: #edebdf;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		font-size: 18px;
		border: 1px solid #5c0d12;
	}
	
	#searchbox #div_old_show_btn {
		position: absolute;
		right: 0;
		top: 0;
		width: 40px;
		height: 15px;
		line-height: 15px;
		background-color: #e3e0d1;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		font-size: 10px;
		display: none;
		border: 1px solid #5c0d12;
	}
	
	#searchbox #div_old_show_btn {
		margin-top: -1px;
		margin-right: -1px;
	}
	
	#searchbox #div_old_hidden_btn:hover,
	#searchbox #div_old_show_btn:hover {
		background-color: #e0ded3;
	}
	
	#div_ee8413b2 {
		padding-right: 3px;
		text-align: left;
		margin-top: 10px;
		position: relative;
		z-index: 3;
	}
	
	#div_ee8413b2 #search_wrapper {
		width: calc(100% - 20px);
		min-height: 50px;
		background-color: #e3e0d1;
		border: 1px solid #5c0d12;
		margin: 0 auto;
		padding: 10px;
	}
	
	#div_ee8413b2 #search_wrapper #search_close {
		border: 1px solid #5c0d12;
		border-left: 0;
		float: left;
		margin-right: -11px;
		width: 20px;
		height: 42px;
		line-height: 20px;
		text-align: center;
		font-size: 14px;
		cursor: pointer;
		padding: 3px;
	}
	
	/* 头部按钮 */
	#div_ee8413b2 #search_wrapper #search_top {
		width: 100%;
		height: 50px;
	}
	
	#div_ee8413b2 #search_top #category_all_button,
	#div_ee8413b2 #search_top #category_favorites_button {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #5c0d12;
		text-align: center;
		vertical-align: middle;
		float: left;
		cursor: pointer;
		font-size: 18px;
	}
	
	#div_ee8413b2 #search_top #category_favorites_button {
		border-left: 0;
	}
	
	#div_ee8413b2 #search_top #category_addFavorites_button {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #5c0d12;
		text-align: center;
		vertical-align: middle;
		float: right;
		cursor: pointer;
		font-size: 18px;
		display: none;
	}
	
	#div_ee8413b2 #search_top #category_addFavorites_button_disabled {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #5c0d1245;
		text-align: center;
		vertical-align: middle;
		float: right;
		cursor: not-allowed;
		font-size: 18px;
		color: #5c0d1245;
	}
	
	#div_ee8413b2 #search_top #category_search_input {
		width: calc(100% - 392px);
		height: 48px;
		border: 1px solid #5c0d12;
		float: left;
		margin: 0 10px 0 40px;
	}
	
	#div_ee8413b2 #category_search_input #input_info {
		width: calc(100% - 104px);
		height: 40px;
		float: left;
		padding: 4px;
	}
	
	#div_ee8413b2 #category_search_input #input_info #readonly_div {
		float: left;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input {
		border: 0;
		outline: none;
		padding-left: 5px;
		padding-right: 15px;
		height: 21px;
		margin: 0;
		background-color: transparent;
		caret-color: black;
		color: black;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input_enter {
		margin-left: -15px;
		cursor: pointer;
		display: inline-block;
		color: #e3e0d1;
	}
	
	.user_input_null_backcolor {
		background-color: #f5cc9c80 !important;
	}
	
	.user_input_value_backColor {
		background-color: #f5cc9c !important;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input:focus,
	#div_ee8413b2 #category_search_input #input_info #user_input:hover {
		background-color: #f5cc9c !important;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item {
		display: inline-block;
		padding: 0 6px;
		height: 20px;
		line-height: 20px;
		font-size: 10px;
		background-color: #f5cc9c;
		cursor: pointer;
		border: 1px solid #f5cc9c;
		color: black;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item {
		margin-right: 5px;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item {
		margin-left: 5px;
	}
	
	
	#div_ee8413b2 #category_search_input #input_info .input_item:hover,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item:hover {
		border: 1px solid red;
	}
	
	#div_ee8413b2 #category_search_input #category_enter_button,
	#div_ee8413b2 #category_search_input #input_clear {
		width: 47px;
		height: 48px;
		line-height: 48px;
		float: right;
		cursor: pointer;
		font-size: 18px;
		text-align: center;
	}
	
	#div_ee8413b2 #category_search_input #input_clear {
		display: none;
	}
	
	#div_ee8413b2 #category_search_input #category_enter_button {
		border-left: 1px solid #5c0d12;
	}
	
	#div_ee8413b2 #category_search_input #input_clear {
		border-left: 0;
	}
	
	#div_ee8413b2 #search_wrapper #display_div {
		overflow: hidden;
	}
	
	#div_ee8413b2 #search_wrapper #category_favorites_div,
	#div_ee8413b2 #search_wrapper #category_all_div {
		width: calc(100% - 2px);
		border: 1px solid #5c0d12;
		margin-top: 10px;
		overflow: hidden;
	}
	
	#div_ee8413b2 #search_wrapper #search_close,
	#div_ee8413b2 #search_wrapper #category_all_div,
	#div_ee8413b2 #search_wrapper #category_favorites_div {
		display: none;
	}
	
	#div_ee8413b2 #favorites_list .favorite_items_div {
		padding-bottom: 20px;
	}
	
	#div_ee8413b2 #category_all_div h4,
	#div_ee8413b2 #favorites_list h4,
	#div_ee8413b2 #favorites_edit_list h4 {
		padding: 0;
		margin: 10px;
		color: #5c0d11;
	}
	
	#div_ee8413b2 #category_all_div .c_item,
	#div_ee8413b2 #category_favorites_div #favorites_list .c_item {
		margin: 3px 0 3px 10px;
		font-size: 15px;
		cursor: pointer;
		display: inline-block;
		color: #5c0d11;
	}
	
	#div_ee8413b2 #category_all_div .c_item:hover,
	#div_ee8413b2 #category_favorites_div #favorites_list .c_item:hover {
		color: #ff4500;
	}
	
	#div_ee8413b2 #category_all_div .category_extend,
	#div_ee8413b2 #favorites_list .favorite_extend,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear {
		margin: 3px 0 3px 10px;
		border: 1px solid #5c0d11;
		width: 13px;
		display: inline-block;
		text-align: center;
		line-height: 13px;
		height: 13px;
		font-size: 12px;
		cursor: pointer;
		color: #5c0d11;
	}
	
	.chooseTab {
		background-color: #f2efdf;
	}
	
	#div_ee8413b2 #category_all_div #category_editor,
	#div_ee8413b2 #category_favorites_div #favorites_editor {
		width: 100%;
		height: 25px;
	}
	
	#div_ee8413b2 #category_editor #all_expand,
	#div_ee8413b2 #category_editor #all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_expand,
	#div_ee8413b2 #favorites_editor #favorites_edit,
	#div_ee8413b2 #favorites_editor #favorites_clear,
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel {
		border-bottom: 1px solid #5c0d12;
		border-right: 1px solid #5c0d12;
		width: 49.5px;
		float: left;
		text-align: center;
		height: 24px;
		line-height: 24px;
		cursor: pointer;
	}
	
	#div_ee8413b2 #favorites_editor #favorites_export,
	#div_ee8413b2 #favorites_editor #favorites_recover {
		border-bottom: 1px solid #5c0d12;
		border-left: 1px solid #5c0d12;
		width: 49.5px;
		float: right;
		text-align: center;
		height: 24px;
		line-height: 24px;
		cursor: pointer;
	}
	
	#div_ee8413b2 #favorites_editor #favorite_upload_files {
		display: none;
	}
	
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend {
		width: calc(100% - 48px);
		margin-left: -1px;
		border: 1px solid #5c0d12;
		border-top: 0;
		padding-top: 48px;
		background-color: #e3e0d1;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items {
		font-size: 10px;
		cursor: pointer;
		padding: 2px 5px;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:first-child {
		border-top: 1px solid #5c0d12;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:not(:first-child) {
		border-top: 1px dashed #85868b;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:hover {
		background-color: #c5c3b8;
	}
	
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel {
		display: none;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_list,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		min-height: 90px;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		display: none;
	}
	
	#div_ee8413b2 #category_all_div #category_list .category_items_div {
		padding-bottom: 20px;
	}
	
	#div_ee8413b2 #category_all_div #category_list h4,
	#div_ee8413b2 #category_favorites_div #favorites_list h4,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list h4 {
		font-size: 16px;
	}
	
	#div_ee8413b2 #category_all_div #category_list,
	#div_ee8413b2 #category_favorites_div #favorites_list,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		height: 500px;
		overflow-y: auto;
	}
	
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar-track,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar-track,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar-track {
		background-color: #cdcaba;
		border-radius: 10px;
	}
	
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar-thumb {
		background-color: #b5a297;
		border-radius: 10px;
	}
	
	#div_ee8413b2 #search_top #search_close,
	#div_ee8413b2 #search_top #category_all_button,
	#div_ee8413b2 #search_top #category_favorites_button,
	#div_ee8413b2 #category_search_input #input_clear,
	#div_ee8413b2 #category_search_input #category_enter_button,
	#div_ee8413b2 #search_top #category_addFavorites_button,
	#div_ee8413b2 #category_editor #all_collapse,
	#div_ee8413b2 #category_editor #all_expand,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_expand,
	#div_ee8413b2 #favorites_editor #favorites_edit,
	#div_ee8413b2 #favorites_editor #favorites_clear,
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel,
	#div_ee8413b2 #favorites_editor #favorites_export,
	#div_ee8413b2 #favorites_editor #favorites_recover,
	#div_ee8413b2 #category_list .category_extend,
	#div_ee8413b2 #favorites_list .favorite_extend,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear,
	#div_ee8413b2 #category_search_input #input_info .input_item,
	#div_ee8413b2 #favorites_edit_list .f_edit_item {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#div_ee8413b2 #search_wrapper #search_close:hover,
	#div_ee8413b2 #search_top #category_all_button:hover,
	#div_ee8413b2 #search_top #category_favorites_button:hover,
	#div_ee8413b2 #category_search_input #input_clear:hover,
	#div_ee8413b2 #category_search_input #category_enter_button:hover,
	#div_ee8413b2 #search_top #category_addFavorites_button:hover,
	#div_ee8413b2 #category_editor #all_collapse:hover,
	#div_ee8413b2 #category_editor #all_expand:hover,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse:hover,
	#div_ee8413b2 #favorites_editor #favorites_all_expand:hover,
	#div_ee8413b2 #favorites_editor #favorites_edit:hover,
	#div_ee8413b2 #favorites_editor #favorites_clear:hover,
	#div_ee8413b2 #favorites_editor #favorites_save:hover,
	#div_ee8413b2 #favorites_editor #favorites_cancel:hover,
	#div_ee8413b2 #favorites_editor #favorites_export:hover,
	#div_ee8413b2 #favorites_editor #favorites_recover:hover {
		background-color: rgba(255, 246, 246, 0.397);
	}
	
	#div_ee8413b2 #category_list .category_extend:hover,
	#div_ee8413b2 #favorites_list .favorite_extend:hover,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear:hover,
	#div_ee8413b2 #category_list .c_item:hover,
	#div_ee8413b2 #favorites_list .c_item:hover {
		transform: scale(1.2);
	}
	
	#dms #googleTranslateDiv {
		float: left;
		background-color: #edebdf;
		padding: 2px 3px 6px 7px;
		margin-left: 10px;
		width: 120px;
		position: absolute;
		margin-top: -13px;
		border: 1px solid #8d8d8d;
		border-radius: 3px;
	}
	
	
	#dms #translateLabel {
		padding-left: 5px;
		font-weight: bold;
		font-size: 13px;
		padding-left: 2px;
	}
	
	#dms,
	#dms #googleTranslateCheckbox,
	#dms #translateLabel {
		cursor: pointer;
	}
	
	
	.div_ee8413b2_category_checked {
		background-color: darkred !important;
	}
	
	.div_ee8413b2_category_checked a {
		color: white;
	}
	
	
	#gd5 #googleTranslateDiv {
		background-color: #edebdf;
		padding: 2px 3px 6px 7px;
		margin-left: 10px;
		width: 120px;
		border: 1px solid #8d8d8d;
		border-radius: 3px;
		margin-bottom: 15px;
	}
	
	#gd5 #googleTranslateDiv #translateLabel {
		padding-left: 5px;
		font-weight: bold;
		font-size: 13px;
		padding-left: 2px;
	}
	
	#gd5 #googleTranslateDiv,
	#gd5 #googleTranslateDiv #googleTranslateCheckbox,
	#gd5 #googleTranslateDiv #translateLabel {
		cursor: pointer;
	}
	
	#div_ee8413b2_detail_clearBtn,
	#div_ee8413b2_detail_addFavoriteBtn,
	#div_ee8413b2_detail_searchBtn {
		width: 130px;
		height: 25px;
		line-height: 25px;
		font-weight: bold;
		font-size: 13px;
		border: 1px solid #8d8d8d;
		background-color: #edebdf;
		border-radius: 3px;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		margin: 0 auto;
		margin-bottom: 15px;
		display: none;
	}
	
	#gd5 #googleTranslateDiv:hover,
	#div_ee8413b2_detail_clearBtn:hover,
	#div_ee8413b2_detail_addFavoriteBtn:hover,
	#div_ee8413b2_detail_searchBtn:hover {
		background-color: rgba(255, 246, 246, 0.397);
	}
	
	#nb {
		font-size: 17px;
		padding-top: 8px;
	}
	
	#nb>div {
		background-image: none;
	}
	
	#nb div a:hover {
		color: red;
	}
	
	#dms>div>select {
		left: -87px;
		width: 206px;
	}
	
	table.itg>tbody>tr>th {
		text-align: center;
		font-size: 13px;
	}
	
	table td.tc {
		min-width: 30px;
	}
	
	table.itg tr:not(:first-child):hover {
		background-color: #e0ded3;
	}
	
	table.itg tr:first-child:hover,
	div.itg .gl1t:hover {
		background-color: #e0ded3;
	}
	
	div#gdf a {
		text-decoration: underline;
	}
	
	#taglist::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#taglist::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	#taglist::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}
	
	#gmid #gd5 .g3,
	#gmid #gd5 .g2 {
		padding-bottom: 10px;
	}`;
	styleInject(category_style);
}, () => {
	// exhentai 样式 ex.css
	const category_style = `#searchbox #div_old_hidden_btn {
		position: absolute;
		right: 20px;
		top: 22px;
		width: 100px;
		height: 48px;
		line-height: 48px;
		background-color: #34353b;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		font-size: 18px;
	}
	
	#searchbox #div_old_show_btn {
		position: absolute;
		right: 0;
		top: 0;
		width: 40px;
		height: 15px;
		line-height: 15px;
		background-color: #34353b;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		font-size: 10px;
		display: none;
	}
	
	#searchbox #div_old_hidden_btn:hover,
	#searchbox #div_old_show_btn:hover {
		background-color: #43464e;
	}
	
	#div_ee8413b2 {
		padding-right: 3px;
		text-align: left;
		margin-top: 10px;
		position: relative;
		z-index: 3;
	}
	
	#div_ee8413b2 #search_wrapper {
		width: calc(100% - 20px);
		min-height: 50px;
		background-color: #40454B;
		border: 1px solid black;
		margin: 0 auto;
		padding: 10px;
		color: #F1F1F1;
	}
	
	#div_ee8413b2 #search_wrapper #search_close {
		background-color: #40454B;
		border: 1px solid #f1f1f1;
		border-left: 0;
		float: left;
		margin-right: -11px;
		width: 20px;
		height: 42px;
		line-height: 20px;
		text-align: center;
		font-size: 14px;
		cursor: pointer;
		padding: 3px;
	}
	
	/* 头部按钮 */
	#div_ee8413b2 #search_wrapper #search_top {
		width: 100%;
		height: 50px;
	}
	
	#div_ee8413b2 #search_top #category_all_button,
	#div_ee8413b2 #search_top #category_favorites_button {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #F1F1F1;
		text-align: center;
		vertical-align: middle;
		float: left;
		cursor: pointer;
		font-size: 18px;
	}
	
	#div_ee8413b2 #search_top #category_favorites_button {
		border-left: 0;
	}
	
	#div_ee8413b2 #search_top #category_addFavorites_button {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #F1F1F1;
		text-align: center;
		vertical-align: middle;
		float: right;
		cursor: pointer;
		font-size: 18px;
		display: none;
	}
	
	#div_ee8413b2 #search_top #category_addFavorites_button_disabled {
		width: 100px;
		height: 48px;
		line-height: 48px;
		border: 1px solid #f1f1f145;
		text-align: center;
		vertical-align: middle;
		float: right;
		cursor: not-allowed;
		font-size: 18px;
		color: #f1f1f145;
	}
	
	#div_ee8413b2 #search_top #category_search_input {
		width: calc(100% - 392px);
		height: 48px;
		border: 1px solid #F1F1F1;
		float: left;
		margin: 0 10px 0 40px;
	}
	
	#div_ee8413b2 #category_search_input #input_info {
		width: calc(100% - 104px);
		height: 40px;
		float: left;
		padding: 4px;
	}
	
	#div_ee8413b2 #category_search_input #input_info #readonly_div {
		float: left;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input {
		border: 0;
		outline: none;
		padding-left: 5px;
		padding-right: 15px;
		height: 21px;
		margin: 0;
		background-color: transparent;
		caret-color: black;
		color: black;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input_enter {
		margin-left: -15px;
		cursor: pointer;
		display: inline-block;
		color: #40454b;
	}
	
	.user_input_null_backcolor {
		background-color: #f5cc9c80 !important;
	}
	
	.user_input_value_backColor {
		background-color: #f5cc9c !important;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input:focus,
	#div_ee8413b2 #category_search_input #input_info #user_input:hover {
		background-color: #f5cc9c !important;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item {
		display: inline-block;
		padding: 0 6px;
		height: 20px;
		line-height: 20px;
		font-size: 10px;
		background-color: #f5cc9c;
		cursor: pointer;
		border: 1px solid #f5cc9c;
		color: black;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item {
		margin-right: 5px;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item {
		margin-left: 5px;
	}
	
	
	#div_ee8413b2 #category_search_input #input_info .input_item:hover,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item:hover {
		border: 1px solid red;
	}
	
	#div_ee8413b2 #category_search_input #category_enter_button,
	#div_ee8413b2 #category_search_input #input_clear {
		width: 47px;
		height: 48px;
		line-height: 48px;
		float: right;
		cursor: pointer;
		font-size: 18px;
		text-align: center;
	}
	
	#div_ee8413b2 #category_search_input #input_clear {
		display: none;
	}
	
	#div_ee8413b2 #category_search_input #category_enter_button {
		border-left: 1px solid #F1F1F1;
	}
	
	#div_ee8413b2 #category_search_input #input_clear {
		border-left: 0;
	}
	
	#div_ee8413b2 #search_wrapper #display_div {
		overflow: hidden;
	}
	
	#div_ee8413b2 #search_wrapper #category_favorites_div,
	#div_ee8413b2 #search_wrapper #category_all_div {
		width: calc(100% - 2px);
		border: 1px solid #F1F1F1;
		margin-top: 10px;
		overflow: hidden;
	}
	
	#div_ee8413b2 #search_wrapper #search_close,
	#div_ee8413b2 #search_wrapper #category_all_div,
	#div_ee8413b2 #search_wrapper #category_favorites_div {
		display: none;
	}
	
	#div_ee8413b2 #favorites_list .favorite_items_div {
		padding-bottom: 20px;
	}
	
	#div_ee8413b2 #category_all_div h4,
	#div_ee8413b2 #favorites_list h4,
	#div_ee8413b2 #favorites_edit_list h4 {
		padding: 0;
		margin: 10px;
		color: #fadfc0;
	}
	
	#div_ee8413b2 #category_all_div .c_item,
	#div_ee8413b2 #category_favorites_div #favorites_list .c_item {
		margin: 3px 0 3px 10px;
		font-size: 15px;
		cursor: pointer;
		display: inline-block;
		color: #F5CC9C;
	}
	
	#div_ee8413b2 #category_all_div .c_item:hover,
	#div_ee8413b2 #category_favorites_div #favorites_list .c_item:hover {
		color: gold;
	}
	
	#div_ee8413b2 #category_all_div .category_extend,
	#div_ee8413b2 #favorites_list .favorite_extend,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear {
		margin: 3px 0 3px 10px;
		border: 1px solid #F5CC9C;
		width: 13px;
		display: inline-block;
		text-align: center;
		line-height: 13px;
		height: 13px;
		font-size: 12px;
		cursor: pointer;
		color: #F5CC9C;
	}
	
	.chooseTab {
		background-color: #7b7e85c2;
	}
	
	#div_ee8413b2 #category_all_div #category_editor,
	#div_ee8413b2 #category_favorites_div #favorites_editor {
		width: 100%;
		height: 25px;
	}
	
	#div_ee8413b2 #category_editor #all_expand,
	#div_ee8413b2 #category_editor #all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_expand,
	#div_ee8413b2 #favorites_editor #favorites_edit,
	#div_ee8413b2 #favorites_editor #favorites_clear,
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel {
		border-bottom: 1px solid #F1F1F1;
		border-right: 1px solid #F1F1F1;
		width: 49.5px;
		float: left;
		text-align: center;
		height: 24px;
		line-height: 24px;
		cursor: pointer;
	}
	
	#div_ee8413b2 #favorites_editor #favorites_export,
	#div_ee8413b2 #favorites_editor #favorites_recover {
		border-bottom: 1px solid #F1F1F1;
		border-left: 1px solid #F1F1F1;
		width: 49.5px;
		float: right;
		text-align: center;
		height: 24px;
		line-height: 24px;
		cursor: pointer;
	}
	
	#div_ee8413b2 #favorites_editor #favorite_upload_files {
		display: none;
	}
	
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend {
		width: calc(100% - 48px);
		margin-left: -1px;
		border: 1px solid #F1F1F1;
		border-top: 0;
		padding-top: 48px;
		background-color: #40454B;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items {
		font-size: 10px;
		cursor: pointer;
		padding: 2px 5px;
		color: #ffde74;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:first-child {
		border-top: 1px solid #f1f1f1;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:not(:first-child) {
		border-top: 1px dashed #85868b;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items:hover {
		background-color: #7b7e85c2;
	}
	
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel {
		display: none;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_list,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		min-height: 90px;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		display: none;
	}
	
	#div_ee8413b2 #category_all_div #category_list .category_items_div {
		padding-bottom: 20px;
	}
	
	#div_ee8413b2 #category_all_div #category_list h4,
	#div_ee8413b2 #category_favorites_div #favorites_list h4,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list h4 {
		font-size: 16px;
	}
	
	#div_ee8413b2 #category_all_div #category_list,
	#div_ee8413b2 #category_favorites_div #favorites_list,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list {
		height: 500px;
		overflow-y: auto;
	}
	
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar-track,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar-track,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}
	
	#div_ee8413b2 #search_top #search_close,
	#div_ee8413b2 #search_top #category_all_button,
	#div_ee8413b2 #search_top #category_favorites_button,
	#div_ee8413b2 #category_search_input #input_clear,
	#div_ee8413b2 #category_search_input #category_enter_button,
	#div_ee8413b2 #search_top #category_addFavorites_button,
	#div_ee8413b2 #category_editor #all_collapse,
	#div_ee8413b2 #category_editor #all_expand,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse,
	#div_ee8413b2 #favorites_editor #favorites_all_expand,
	#div_ee8413b2 #favorites_editor #favorites_edit,
	#div_ee8413b2 #favorites_editor #favorites_clear,
	#div_ee8413b2 #favorites_editor #favorites_save,
	#div_ee8413b2 #favorites_editor #favorites_cancel,
	#div_ee8413b2 #favorites_editor #favorites_export,
	#div_ee8413b2 #favorites_editor #favorites_recover,
	#div_ee8413b2 #category_list .category_extend,
	#div_ee8413b2 #favorites_list .favorite_extend,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear,
	#div_ee8413b2 #category_search_input #input_info .input_item,
	#div_ee8413b2 #favorites_edit_list .f_edit_item {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#div_ee8413b2 #search_wrapper #search_close:hover,
	#div_ee8413b2 #search_top #category_all_button:hover,
	#div_ee8413b2 #search_top #category_favorites_button:hover,
	#div_ee8413b2 #category_search_input #input_clear:hover,
	#div_ee8413b2 #category_search_input #category_enter_button:hover,
	#div_ee8413b2 #search_top #category_addFavorites_button:hover,
	#div_ee8413b2 #category_editor #all_collapse:hover,
	#div_ee8413b2 #category_editor #all_expand:hover,
	#div_ee8413b2 #favorites_editor #favorites_all_collapse:hover,
	#div_ee8413b2 #favorites_editor #favorites_all_expand:hover,
	#div_ee8413b2 #favorites_editor #favorites_edit:hover,
	#div_ee8413b2 #favorites_editor #favorites_clear:hover,
	#div_ee8413b2 #favorites_editor #favorites_save:hover,
	#div_ee8413b2 #favorites_editor #favorites_cancel:hover,
	#div_ee8413b2 #favorites_editor #favorites_export:hover,
	#div_ee8413b2 #favorites_editor #favorites_recover:hover {
		background-color: rgba(255, 246, 246, 0.397);
	}
	
	#div_ee8413b2 #category_list .category_extend:hover,
	#div_ee8413b2 #favorites_list .favorite_extend:hover,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear:hover,
	#div_ee8413b2 #category_list .c_item:hover,
	#div_ee8413b2 #favorites_list .c_item:hover {
		transform: scale(1.2);
	}
	
	#dms #googleTranslateDiv {
		float: left;
		background-color: #34353b;
		padding: 2px 3px 6px 7px;
		margin-left: 10px;
		width: 120px;
		position: absolute;
		margin-top: -13px;
		border: 1px solid #8d8d8d;
		border-radius: 3px;
	}
	
	
	#dms #translateLabel {
		padding-left: 5px;
		font-weight: bold;
		font-size: 13px;
		padding-left: 2px;
	}
	
	#dms,
	#dms #googleTranslateCheckbox,
	#dms #translateLabel {
		cursor: pointer;
	}
	
	
	.div_ee8413b2_category_checked {
		background-color: darkred !important;
	}
	
	#gd5 #googleTranslateDiv {
		background-color: #34353b;
		padding: 2px 3px 6px 7px;
		margin-left: 10px;
		width: 120px;
		border: 1px solid #8d8d8d;
		border-radius: 3px;
		margin-bottom: 15px;
	}
	
	#gd5 #googleTranslateDiv #translateLabel {
		padding-left: 5px;
		font-weight: bold;
		font-size: 13px;
		padding-left: 2px;
	}
	
	#gd5 #googleTranslateDiv,
	#gd5 #googleTranslateDiv #googleTranslateCheckbox,
	#gd5 #googleTranslateDiv #translateLabel {
		cursor: pointer;
	}
	
	#div_ee8413b2_detail_clearBtn,
	#div_ee8413b2_detail_addFavoriteBtn,
	#div_ee8413b2_detail_searchBtn {
		width: 130px;
		height: 25px;
		line-height: 25px;
		font-weight: bold;
		font-size: 13px;
		border: 1px solid #8d8d8d;
		background-color: #34353b;
		border-radius: 3px;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		margin: 0 auto;
		margin-bottom: 15px;
		display: none;
	}
	
	#gd5 #googleTranslateDiv:hover,
	#div_ee8413b2_detail_clearBtn:hover,
	#div_ee8413b2_detail_addFavoriteBtn:hover,
	#div_ee8413b2_detail_searchBtn:hover {
		background-color: rgba(255, 246, 246, 0.397);
	}
	
	#nb {
		font-size: 17px;
		padding-top: 8px;
	}
	
	#nb>div {
		background-image: none;
	}
	
	#nb div a:hover {
		color: gold;
	}
	
	#dms>div>select {
		left: -87px;
		width: 206px;
	}
	
	table.itg>tbody>tr>th {
		text-align: center;
		font-size: 13px;
	}
	
	table td.tc {
		min-width: 30px;
	}
	
	table.itg tr:not(:first-child):hover {
		background-color: #4f535b;
	}
	
	table.itg tr:first-child:hover,
	div.itg .gl1t:hover {
		background-color: #4f535b;
	}
	
	div#gdf a {
		text-decoration: underline;
	}
	
	#taglist::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#taglist::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	#taglist::-webkit-scrollbar-thumb {
		background-color: #a5a5a5;
		border-radius: 10px;
	}
	
	#gmid #gd5 .g2 {
		padding-bottom: 15px;
	}`;
	styleInject(category_style);
});

//#endregion

//#region step1.2.translateTopMenu.js 头部菜单翻译
function topMenuTranslateZh() {
	const fontMenusData = {
		"Front Page": "首页",
		"Watched": "已观看",
		"Popular": "热门",
		"Torrents": "种子",
		"Favorites": "收藏",
		"Settings": "设置",
		"My Uploads": "我的上传",
		"My Tags": "我的标签",
		"My Home": "我的主页",
		"Toplists": "排行榜",
		"Bounties": "悬赏",
		"News": "新闻",
		"Forums": "论坛",
		"Wiki": "维基百科",
		"HentaiVerse": "變態之道(游戏)"
	};
	var menus = document.getElementById("nb").querySelectorAll("a");
	for (const i in menus) {
		if (Object.hasOwnProperty.call(menus, i)) {
			const a = menus[i];
			a.innerText = fontMenusData[a.innerText] ?? a.innerText;
		}
	}
}

//#endregion

//#region step2.getTagDatas.js 获取标签数据

//#region 恋物数据和ehTag数据
function getFetishListGitHubReleaseVersion(func) {
    var httpRequest = new XMLHttpRequest();
    var url = `https://api.github.com/repos/SunBrook/ehWiki.fetishListing.translate.zh_CN/branches/master`;
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            var version = json.commit.sha;
            func(version);
        }
    }
}

function getEhTagGitHubReleaseVersion(func) {
    var httpRequest = new XMLHttpRequest();
    var url = `https://api.github.com/repos/EhTagTranslation/DatabaseReleases/branches/master`;
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            var version = json.commit.sha;
            func(version);
        }
    }
}

function getFetishListTranslate(version, func) {
    var httpRequest = new XMLHttpRequest();
    var url = `https://cdn.jsdelivr.net/gh/SunBrook/ehWiki.fetishListing.translate.zh_CN@${version}/fetish.oneLevel.withoutLang.searchKey.json`;
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            func(json);
        }
    }
}

function getEhTagTranslate(version, func) {
    var httpRequest = new XMLHttpRequest();
    var url = `https://cdn.jsdelivr.net/gh/EhTagTranslation/DatabaseReleases@${version}/db.text.json`;
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            func(json);
        }
    }
}
//#endregion


//#region indexdb 模块

var request = window.indexedDB.open("EXH_DYZYFTS", 1);
var db;

// 设置表
const table_Settings = "t_settings";
const table_Settings_key_FetishListVersion = "f_fetishListVersion";
const table_Settings_key_EhTagVersion = "f_ehTagVersion";
const table_Settings_key_FetishList_ParentEnArray = "f_fetish_parentEnArray";
const table_Settings_key_EhTag_ParentEnArray = "f_ehTag_parentEnArray";
const table_Settings_key_FetishList_Html = "f_fetishListHtml";
const table_Settings_key_EhTag_Html = "f_ehTagHtml";
const table_Settings_key_CategoryList_Extend = "f_categoryListExtend";
const table_Settings_key_FavoriteList_Extend = "f_favoriteListExtend";
const table_Settings_key_OldSearchDiv_Visible = "f_oldSearchDivVisible";
const table_settings_key_TranslateFrontPageTags = "f_translateFrontPageTags";
const table_Settings_key_TranslateDetailPageTags = "f_translateDetailPageTags";
const table_Settings_key_TranslateFrontPageTitles = "f_translateFrontPageTitles";
const table_Settings_key_TranslateDetailPageTitles = "f_translateDetailPageTitles";


// fetishList 父子信息表
const table_fetishListSubItems = "t_fetishListSubItems";
const table_fetishListSubItems_key = "ps_en";

// EhTag 父子信息表
const table_EhTagSubItems = "t_ehTagSubItems";
const table_EhTagSubItems_key = "ps_en";

function indexDbInit(func_start_use) {
    if (request.readyState == "done") {
        db = request.result;
        func_start_use();
    } else {
        request.onsuccess = function () {
            db = request.result;
            console.log("数据库打开成功", db);
            func_start_use();
        }
    }
}

request.onerror = function (event) {
    console.log("数据库打开报错", event);
}

request.onupgradeneeded = function (event) {
    db = event.target.result;
    console.log("升级数据库", db);

    // 对象仓库 Settings
    // 
    // EhTag子菜单

    // 设置表
    // 包含：FetishList版本号、父子数据、父标签、页面Html
    // 包含：EhTag版本号、总数据、父标签、页面Html
    if (!db.objectStoreNames.contains(table_Settings)) {
        var objectStore = db.createObjectStore(table_Settings, { keyPath: 'item' });
    }

    // FetishList 父子标签表
    if (!db.objectStoreNames.contains(table_fetishListSubItems)) {
        var objectStore = db.createObjectStore(table_fetishListSubItems, { keyPath: table_fetishListSubItems_key });
        // objectStore.createIndex('parent_en', 'parent_en', { unique: false });
        // objectStore.createIndex('parent_zh', 'parent_zh', { unique: false });
        // objectStore.createIndex('sub_en', 'sub_en', { unique: false });
        // objectStore.createIndex('sub_zh', 'sub_zh', { unique: false });
        objectStore.createIndex('search_key', 'search_key', { unique: true });
    }

    // EhTag 父子标签表
    if (!db.objectStoreNames.contains(table_EhTagSubItems)) {
        var objectStore = db.createObjectStore(table_EhTagSubItems, { keyPath: table_EhTagSubItems_key });
        // objectStore.createIndex('parent_en', 'parent_en', { unique: false });
        // objectStore.createIndex('parent_zh', 'parent_zh', { unique: false });
        // objectStore.createIndex('sub_en', 'sub_en', { unique: false });
        // objectStore.createIndex('sub_zh', 'sub_zh', { unique: false });
        objectStore.createIndex('search_key', 'search_key', { unique: true });
    }
}

function read(tableName, key, func_success, func_error) {
    var transaction = db.transaction(tableName);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.get(key);

    request.onerror = function (event) {
        console.log('读取事务失败', event);
        func_error(event);
    }

    request.onsuccess = function (event) {
        func_success(request.result);
    }
}

function readAll(tableName, func_success, func_end) {
    var objectStore = db.transaction(tableName).objectStore(tableName);
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            func_success(cursor.key, cursor.value);
            cursor.continue();
        } else {
            console.log('没有更多数据了');
            func_end();
        }
    }
}

function readByIndex(tableName, indexName, indexValue, func_success, func_none) {
    var transaction = db.transaction([tableName], 'readonly');
    var store = transaction.objectStore(tableName);
    var index = store.index(indexName);
    var request = index.get(indexValue);
    request.onsuccess = function (e) {
        var result = e.target.result;
        if (result) {
            func_success(result);
        } else {
            console.log('没找到');
            func_none();
        }
    }
}

function readByCursorIndex(tableName, indexName, indexValue, func_success) {
    const IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
    var transaction = db.transaction([tableName], 'readonly');
    var store = transaction.objectStore(tableName);
    var index = store.index(indexName);
    var c = index.openCursor(IDBKeyRange.only(indexValue));
    var data = [];
    c.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            data.push(cursor.value);
            cursor.continue();
        }
        else {
            func_success(data);
        }
    }

}

function fuzzySearch(tableName, field, keyword, func_success) {
    var objectStore = db.transaction(tableName).objectStore(tableName);
    const data = [];
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            if (cursor.value[field].indexOf(keyword) != -1) {
                data.push(cursor.value);
            }
            cursor.continue;
        } else {
            console.log('没有更多数据了');
            func_success(data);
        }
    }
}

function add(tableName, data, func_success, func_error) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .add(data);

    request.onsuccess = function (event) {
        console.log('数据写入成功', event);
        func_success(event);
    }

    request.onerror = function (event) {
        console.log('数据写入失败', event);
        func_error(event);
    }
}

function batchAdd(tableName, keyName, dataList, count, func_compelete) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName);

    var index = 0;
    for (const key in dataList) {
        if (Object.hasOwnProperty.call(dataList, key)) {
            const item = dataList[key];
            item[keyName] = key;
            request.add(item);
            index++;
        }
    }

    var t = setInterval(() => {
        if (count == index) {
            t && clearInterval(t);
            func_compelete();
        }
    }, 10);
}

function update(tableName, data, func_success, func_error) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .put(data);

    request.onsuccess = function (event) {
        console.log("数据更新成功", event);
        func_success();
    }

    request.onerror = function (event) {
        console.log("数据更新失败");
        func_error(event);
    }
}

function remove(tableName, key, func_success, func_error) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .delete(key);
    request.onsuccess = function (event) {
        console.log("数据删除成功", event);
        func_success();
    }
    request.onerror = function (event) {
        console.log('数据删除失败', event);
        func_error(event);
    }
}

function checkTableEmpty(tableName, func_empty, func_hasData) {
    var transaction = db.transaction(tableName);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.count();

    request.onsuccess = function (event) {
        if (request.result == 0) {
            // 数量为空
            func_empty();
        } else {
            // 存在数据
            func_hasData();
        }
    }
}

function checkFieldEmpty(tableName, filedName, func_empty, func_hasData) {
    var transaction = db.transaction(tableName);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.get(filedName);

    request.onsuccess = function (event) {
        if (!request.result) {
            // 数据为空
            func_empty();
        } else {
            // 存在数据
            func_hasData();
        }
    }
}

function clearTable(tableName, func_clear) {
    var transaction = db.transaction(tableName);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.clear();
    request.onsuccess = function (event) {
        func_clear();
    }
}
//#endregion

function fetishListDataInit(update_func, local_func) {
    // fetishList 获取本地版本号
    read(table_Settings, table_Settings_key_FetishListVersion, localVersion => {
        getFetishListGitHubReleaseVersion(version => {
            // 和本地的版本号进行比较，如果不同就进行更新
            if (!localVersion || version != localVersion.value) {
                getFetishListTranslate(version, json => {
                    update_func(json);
                    // 更新版本号
                    var settings_fetishList_version = {
                        item: table_Settings_key_FetishListVersion,
                        value: version
                    };
                    update(table_Settings, settings_fetishList_version, () => { }, error => { });
                });
            } else {
                local_func();
            }
        });
    }, error => {
        console.log('error', error);
    })
}

function ehTagDataInit(update_func, local_func) {
    // Ehtag 获取本地版本号
    read(table_Settings, table_Settings_key_EhTagVersion, localVersion => {
        getEhTagGitHubReleaseVersion(version => {
            // 和本地的版本号进行比较，如果不同就进行更新
            if (!localVersion || version != localVersion.value) {
                getEhTagTranslate(version, json => {
                    update_func(json.data);
                    // 更新版本号
                    var settings_ehTag_version = {
                        item: table_Settings_key_EhTagVersion,
                        value: version
                    };
                    update(table_Settings, settings_ehTag_version, () => { }, error => { });
                });
            } else {
                local_func();
            }
        });

    }, error => {
        console.log('error', error);
    });
}

// 验证数据完整性
function checkDataIntact(func_compelete) {
    // 如果数据表数据为空，则清空存储数据

    var complete1 = false;
    var complete2 = false;
    var complete3 = false;
    var complete4 = false;

    checkTableEmpty(table_fetishListSubItems, () => {
        // 为空
        remove(table_Settings, table_Settings_key_FetishListVersion, () => { complete1 = true; }, () => { complete1 = true; });
    }, () => {
        // 存在数据
        complete1 = true;
    });
    checkTableEmpty(table_EhTagSubItems, () => {
        // 为空
        remove(table_Settings, table_Settings_key_EhTagVersion, () => { complete2 = true; }, () => { complete2 = true; });
    }, () => {
        // 存在数据
        complete2 = true;
    });

    checkFieldEmpty(table_Settings, table_Settings_key_FetishList_Html, () => {
        // 为空
        remove(table_Settings, table_Settings_key_FetishListVersion, () => { complete3 = true; }, () => { complete3 = true; });
    }, () => {
        // 存在数据
        complete3 = true;
    });
    checkFieldEmpty(table_Settings, table_Settings_key_EhTag_Html, () => {
        // 为空
        remove(table_Settings, table_Settings_key_EhTagVersion, () => { complete4 = true; }, () => { complete4 = true; });
    }, () => {
        // 存在数据
        complete4 = true;
    });

    var t = setInterval(() => {
        if (complete1 && complete2 && complete3 && complete4) {
            t && clearInterval(t);
            func_compelete();
        }
    }, 60);
}

// 准备关键数据
function tagDataDispose(func_compelete) {
    // 获取数据
    indexDbInit(() => {

        // 验证数据完整性
        checkDataIntact(() => {

            var complete1 = false;
            var complete2 = false;
            var complete3 = false;
            var complete4 = false;
            var complete5 = false;
            var complete6 = false;

            // 获取并更新恋物的父子项、父级信息
            fetishListDataInit(newData => {

                // 批量添加父子项
                batchAdd(table_fetishListSubItems, table_fetishListSubItems_key, newData.data, newData.count, () => {
                    complete1 = true;
                    console.log('批量添加完成');
                });

                // 更新父级信息
                var settings_fetishList_parentEnArray = {
                    item: table_Settings_key_FetishList_ParentEnArray,
                    value: newData.parent_en_array
                };
                update(table_Settings, settings_fetishList_parentEnArray, () => { complete2 = true; }, error => { complete2 = true; });

                // 生成页面 html，并保存
                var categoryFetishListHtml = ``;
                var lastParentEn = '';
                for (const i in newData.data) {
                    if (Object.hasOwnProperty.call(newData.data, i)) {
                        const item = newData.data[i];
                        if (item.parent_en != lastParentEn) {
                            if (lastParentEn != '') {
                                categoryFetishListHtml += `</div>`;
                            }
                            lastParentEn = item.parent_en;
                            // 新建父级
                            categoryFetishListHtml += `<h4>${item.parent_zh}<span data-category="${item.parent_en}" class="category_extend">-</span></h4>`;
                            categoryFetishListHtml += `<div id="items_div_${item.parent_en}" class="category_items_div">`;
                        }

                        // 添加子级
                        categoryFetishListHtml += `<span class="c_item" data-item="${item.sub_en}" data-favorite_parent_en="${item.parent_en}" data-favorite_parent_zh="${item.parent_zh}" title="[${item.sub_en}] ${item.sub_desc}">${item.sub_zh}</span>`;
                    }
                }
                if (categoryFetishListHtml != ``) {
                    categoryFetishListHtml += `</div>`;
                }

                // 存储恋物列表Html
                var settings_fetish_html = {
                    item: table_Settings_key_FetishList_Html,
                    value: categoryFetishListHtml
                };
                update(table_Settings, settings_fetish_html, () => { complete3 = true; }, error => { complete3 = true; });

                var category_list_fetishList = document.getElementById("category_list_fetishList");
                category_list_fetishList.innerHTML = categoryFetishListHtml;

            }, () => {
                complete1 = true;
                complete2 = true;
                complete3 = true;
                console.log('fet', "没有新数据");
            });

            // 获取并更新EhTag的父子项、父级信息
            ehTagDataInit(newData => {
                // 更新本地数据库 indexDB
                // 存储完成之后，更新版本号

                // 需要过滤的项
                var filterParents = ["rows", "reclass"];

                var psDict = {};
                var psDictCount = 0;
                var parentEnArray = [];

                for (const index in newData) {
                    if (Object.hasOwnProperty.call(newData, index)) {
                        // var example = { ps_en: "male:bo", search_key: "male,男性,bo,波", parent_en: "male", parent_zh: "男性", sub_en: "bo", sub_zh: "波", sub_desc: "波波" };

                        const element = newData[index];
                        var parent_en = element.namespace;
                        if (filterParents.indexOf(parent_en) != -1) continue;
                        parentEnArray.push(parent_en);

                        var parent_zh = element.frontMatters.name;

                        var subItems = element.data;
                        for (const sub_en in subItems) {
                            if (Object.hasOwnProperty.call(subItems, sub_en)) {
                                const subItem = subItems[sub_en];
                                var sub_zh = subItem.name;
                                var sub_desc = subItem.intro;
                                var search_key = `${parent_en},${parent_zh},${sub_en},${sub_zh}`;
                                var ps_en = `${parent_en}:${sub_en}`;
                                psDict[ps_en] = { search_key, parent_en, parent_zh, sub_en, sub_zh, sub_desc };
                                psDictCount++;
                            }
                        }
                    }
                }

                // 批量添加父子项
                batchAdd(table_EhTagSubItems, table_EhTagSubItems_key, psDict, psDictCount, () => {
                    complete4 = true;
                    console.log("批量添加完成");
                });

                var settings_ehTag_parentEnArray = {
                    item: table_Settings_key_EhTag_ParentEnArray,
                    value: parentEnArray
                };

                // 更新父级信息
                update(table_Settings, settings_ehTag_parentEnArray, () => { complete5 = true; }, error => { complete5 = true; });

                // 生成页面 html
                var categoryEhTagHtml = ``;
                var lastParentEn = '';
                for (const i in psDict) {
                    if (Object.hasOwnProperty.call(psDict, i)) {
                        const item = psDict[i];
                        if (item.parent_en != lastParentEn) {
                            if (lastParentEn != '') {
                                categoryEhTagHtml += `</div>`;
                            }
                            lastParentEn = item.parent_en;
                            // 新建父级
                            categoryEhTagHtml += `<h4>${item.parent_zh}<span data-category="${item.parent_en}" class="category_extend">-</span></h4>`;
                            categoryEhTagHtml += `<div id="items_div_${item.parent_en}" class="category_items_div">`;
                        }

                        // 添加子级
                        categoryEhTagHtml += `<span class="c_item" data-item="${item.sub_en}" data-favorite_parent_en="${item.parent_en}" data-favorite_parent_zh="${item.parent_zh}" title="[${item.sub_en}] ${item.sub_desc}">${item.sub_zh}</span>`;
                    }
                }
                if (categoryEhTagHtml != ``) {
                    categoryEhTagHtml += `</div>`;
                }

                // 存储页面 html
                var settings_ehTag_html = {
                    item: table_Settings_key_EhTag_Html,
                    value: categoryEhTagHtml
                };
                update(table_Settings, settings_ehTag_html, () => { complete6 = true; }, error => { complete6 = true; });

                var category_list_ehTag = document.getElementById("category_list_ehTag");
                category_list_ehTag.innerHTML = categoryEhTagHtml;

            }, () => {
                complete4 = true;
                complete5 = true;
                complete6 = true;
                console.log('ehtag', "没有新数据");
            });


            var t = setInterval(() => {
                if (complete1 && complete2 && complete3 && complete4 && complete5 && complete6) {
                    t && clearInterval(t);
                    func_compelete();
                }
            }, 50);

        });
    });
}

// 准备用户存储的关键信息，此为过渡功能，将localstroage 上的存储的配置数据存储到 indexedDB 中，然后清空 localstroage
function initUserSettings(func_compelete) {
    indexDbInit(() => {
        var complete1 = false;
        var complete2 = false;
        var complete3 = false;
        var complete4 = false;
        var complete5 = false;

        // 本地折叠按钮
        var categoryListExpendArray = getCategoryListExpend();
        if (categoryListExpendArray != null) {
            var settings_categoryListExpendArray = {
                item: table_Settings_key_CategoryList_Extend,
                value: categoryListExpendArray
            };
            update(table_Settings, settings_categoryListExpendArray, () => {
                removeCategoryListExpend();
                complete1 = true;
            }, error => { complete1 = true; });
        } else {
            complete1 = true;
        }



        // 收藏折叠按钮
        var favoriteListExpendArray = getFavoriteDicts();
        if (favoriteListExpendArray != null) {
            var settings_favoriteListExpendArray = {
                item: table_Settings_key_FavoriteList_Extend,
                value: favoriteListExpendArray
            };
            update(table_Settings, settings_favoriteListExpendArray, () => {
                removeFavoriteDicts();
                complete2 = true;
            }, error => { complete2 = true; });
        } else {
            complete2 = true;
        }



        // 头部搜索菜单显示隐藏开关
        var oldSearchDivVisible = getOldSearchDivVisible();
        if (oldSearchDivVisible != null) {
            var settings_oldSearchDivVisible = {
                item: table_Settings_key_OldSearchDiv_Visible,
                value: oldSearchDivVisible == 1
            };
            update(table_Settings, settings_oldSearchDivVisible, () => {
                removeOldSearchDivVisible();
                complete3 = true;
            }, error => { complete3 = true; });
        } else {
            complete3 = true;
        }


        // 标签谷歌机翻_首页开关
        var translateCategoryFrontPage = getGoogleTranslateCategoryFontPage();
        if (translateCategoryFrontPage != null) {
            var settings_translateCategoryFontPage = {
                item: table_settings_key_TranslateFrontPageTags,
                value: translateCategoryFrontPage == 1
            };
            update(table_Settings, settings_translateCategoryFontPage, () => {
                removeGoogleTranslateCategoryFontPage();
                complete4 = true;
            }, error => { complete4 = true; });
        } else {
            complete4 = true;
        }


        // 标签谷歌机翻_详情页开关
        var translateCategoryDetailPage = getGoogleTranslateCategoryDetail();
        if (translateCategoryDetailPage != null) {
            var settings_translateCategoryDetailPage = {
                item: table_Settings_key_TranslateDetailPageTags,
                value: translateCategoryDetailPage == 1
            };
            update(table_Settings, settings_translateCategoryDetailPage, () => {
                removeGoogleTranslateCategoryDetail();
                complete5 = true;
            }, error => { complete5 = true; });
        } else {
            complete5 = true;
        }

        var t = setInterval(() => {
            if (complete1 && complete2 && complete3 && complete4 && complete5) {
                t && clearInterval(t);
                func_compelete();
            }
        }, 50);
    })
}

// TODO 用户收藏列表 等待转换 (本地从本地读取，网络从EhTag读取)

//#endregion





//#region main.js
// 主方法
// 根据地址链接判断当前是首页还是详情页
if (window.location.pathname.indexOf("/g/") != -1) {
    // 详情页
    // detailPageTranslate();
    // detailPageFavorite();
}
else if (window.location.pathname.length == 1) {
    // 首页
    //mainPageTranslate();
    mainPageCategory();
}

function mainPageCategory() {
    // 头部菜单汉化
    topMenuTranslateZh();

    // 初始化用户配置信息
    initUserSettings(() => {
        console.log('初始化用户配置信息完毕');



        // 首页框架搭建，列举可用元素，可见按钮事件实现


        // 首页谷歌翻译：标题

        // indexedDB 数据存储初始化
        tagDataDispose(() => {
            console.log('初始化完毕');

            // 首页谷歌翻译：标签

            // TODO 读取转换本地收藏数据，更新并生成本地收藏，包含事件

            // 生成本地列表，包含事件

            // 数据同步

        });
    })
}

//#endregion





