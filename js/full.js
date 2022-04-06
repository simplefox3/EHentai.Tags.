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
function setOldSearchDivVisible(visible) {
	localStorage.setItem(dbOldSearchDivVisibleKey, visible);
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
		height: 48px;
		float: left;
		padding: 0 4px;
		overflow-y: auto;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input {
		border: 0;
		outline: none;
		padding-left: 5px;
		padding-right: 15px;
		height: 15px;
		margin-top: 2px;
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
		padding: 0 5px;
		height: 16px;
		line-height: 16px;
		font-size: 10px;
		background-color: #f5cc9c;
		cursor: pointer;
		border: 1px solid #f5cc9c;
		color: black;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item {
		margin-right: 4px;
    	margin-top: 4px;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item {
		margin-left: 5px;
		padding: 4px 6px;
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
	
	#div_ee8413b2 #favorites_list .favorite_items_div,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_items_div {
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
		background-color: #e3e0d1;
		max-height: 500px;
		overflow-y: scroll;
		position: relative;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items {
		font-size: 10px;
		cursor: pointer;
		padding: 2px 5px;
		min-height: 20px;
    	line-height: 20px;
		overflow: auto;
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
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar-track,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar-track,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar-track,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar-track,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar-track {
		background-color: #cdcaba;
		border-radius: 10px;
	}
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar-thumb,
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
		height: 48px;
		float: left;
		padding: 0 4px;
		overflow-y: auto;
	}
	
	#div_ee8413b2 #category_search_input #input_info #user_input {
		border: 0;
		outline: none;
		padding-left: 5px;
		padding-right: 15px;
		height: 15px;
		margin-top: 2px;
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
		padding: 0 5px;
		height: 16px;
		line-height: 16px;
		font-size: 10px;
		background-color: #f5cc9c;
		cursor: pointer;
		border: 1px solid #f5cc9c;
		color: black;
	}
	
	#div_ee8413b2 #category_search_input #input_info .input_item {
		margin-right: 4px;
    	margin-top: 4px;
	}
	
	#div_ee8413b2 #category_favorites_div #favorites_edit_list .f_edit_item {
		margin-left: 5px;
		padding: 4px 6px;
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
	
	#div_ee8413b2 #favorites_list .favorite_items_div,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_items_div {
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
		background-color: #40454B;
		max-height: 500px;
		overflow-y: scroll;
		position: relative;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items {
		font-size: 10px;
		cursor: pointer;
		padding: 2px 5px;
		color: #ffde74;
		min-height: 20px;
    	line-height: 20px;
		overflow: auto;
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
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar-track,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar-track,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar-track,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar-track,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
	#div_ee8413b2 #category_search_input #input_info::-webkit-scrollbar-thumb,
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar-thumb,
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
const table_Settings_key_OldSearchDiv_Visible = "f_oldSearchDivVisible";
const table_settings_key_TranslateFrontPageTags = "f_translateFrontPageTags";
const table_Settings_key_TranslateDetailPageTags = "f_translateDetailPageTags";
const table_Settings_key_TranslateFrontPageTitles = "f_translateFrontPageTitles";
const table_Settings_key_TranslateDetailPageTitles = "f_translateDetailPageTitles";
const table_Settings_key_FavoriteList = "f_favoriteList";
const table_Settings_key_FavoriteList_Html = "f_favoriteListHtml";
const table_Settings_Key_FavoriteList_Extend = "f_favoriteListExtend";


// fetishList 全部类别 - 父子信息表
const table_fetishListSubItems = "t_fetishListSubItems";
const table_fetishListSubItems_key = "ps_en";
const table_fetishListSubItems_index_subEn = "sub_en";
const table_fetishListSubItems_index_searchKey = "search_key";

// EhTag 全部类别 - 父子信息表
const table_EhTagSubItems = "t_ehTagSubItems";
const table_EhTagSubItems_key = "ps_en";
const table_EhTagSubItems_index_subEn = "sub_en";
const table_EhTagSubItems_index_searchKey = "search_key";

// FavoriteList 本地收藏表
const table_favoriteSubItems = "t_favoriteSubItems";
const table_favoriteSubItems_key = "ps_en";
const table_favoriteSubItems_index_parentEn = "parent_en";

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
		objectStore.createIndex(table_fetishListSubItems_index_subEn, table_fetishListSubItems_index_subEn, { unique: false });
		objectStore.createIndex(table_fetishListSubItems_index_searchKey, table_fetishListSubItems_index_searchKey, { unique: true });
	}

	// EhTag 父子标签表
	if (!db.objectStoreNames.contains(table_EhTagSubItems)) {
		var objectStore = db.createObjectStore(table_EhTagSubItems, { keyPath: table_EhTagSubItems_key });
		objectStore.createIndex(table_EhTagSubItems_index_subEn, table_EhTagSubItems_index_subEn, { unique: false });
		objectStore.createIndex(table_EhTagSubItems_index_searchKey, table_EhTagSubItems_index_searchKey, { unique: true });
	}

	// 本地收藏表
	if (!db.objectStoreNames.contains(table_favoriteSubItems)) {
		var objectStore = db.createObjectStore(table_favoriteSubItems, { keyPath: table_favoriteSubItems_key });
		objectStore.createIndex(table_favoriteSubItems_index_parentEn, table_favoriteSubItems_index_parentEn, { unique: false });
	}
}

function read(tableName, key, func_success, func_error) {
	var transaction = db.transaction(tableName);
	var objectStore = transaction.objectStore(tableName);
	var request = objectStore.get(key);

	request.onerror = function (event) {
		console.log('读取事务失败', event);
		func_error();
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

// 按照索引的值查询：等于
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

// 按照索引的值查询：模糊搜索
function readByCursorIndexFuzzy(tableName, indexName, indexValue, func_success) {
	const IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
	var transaction = db.transaction([tableName], 'readonly');
	var store = transaction.objectStore(tableName);
	var index = store.index(indexName);
	var c = index.openCursor();
	var data = [];
	c.onsuccess = function (event) {
		var cursor = event.target.result;
		if (cursor) {
			if (cursor.value[indexName].indexOf(indexValue) != -1) {
				data.push(cursor.value);
			}
			cursor.continue();
		}
		else {
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
	var transaction = db.transaction([tableName], 'readwrite');
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
							categoryFetishListHtml += `<h4>${item.parent_zh}<span data-category="${item.parent_en}" class="category_extend category_extend_fetish">-</span></h4>`;
							categoryFetishListHtml += `<div id="items_div_${item.parent_en}" class="category_items_div">`;
						}

						// 添加子级
						categoryFetishListHtml += `<span class="c_item c_item_fetish" data-item="${item.sub_en}" data-parent_en="${item.parent_en}" data-parent_zh="${item.parent_zh}" data-sub_desc="${item.sub_desc}" title="[${item.sub_en}] ${item.sub_desc}">${item.sub_zh}</span>`;
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
							categoryEhTagHtml += `<h4>${item.parent_zh}<span data-category="${item.parent_en}" class="category_extend category_extend_ehTag">-</span></h4>`;
							categoryEhTagHtml += `<div id="items_div_${item.parent_en}" class="category_items_div">`;
						}

						// 添加子级
						categoryEhTagHtml += `<span class="c_item c_item_ehTag" data-item="${item.sub_en}" data-parent_en="${item.parent_en}" data-parent_zh="${item.parent_zh}" data-sub_desc="${item.sub_desc}" title="[${item.sub_en}] ${item.sub_desc}">${item.sub_zh}</span>`;
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
	// 删除恋物版本号、类别html、收藏折叠数据
	removeVersion();
	removeCategoryListHtml();
	removeFavoriteListExpend();

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


		// 头部搜索菜单显示隐藏开关，这个不需要删除
		var oldSearchDivVisible = getOldSearchDivVisible();
		if (oldSearchDivVisible != null) {
			var settings_oldSearchDivVisible = {
				item: table_Settings_key_OldSearchDiv_Visible,
				value: oldSearchDivVisible == 1
			};
			update(table_Settings, settings_oldSearchDivVisible, () => {
				complete2 = true;
			}, error => { complete2 = true; });
		} else {
			complete2 = true;
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
				complete3 = true;
			}, error => { complete3 = true; });
		} else {
			complete3 = true;
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
				complete4 = true;
			}, error => { complete4 = true; });
		} else {
			complete4 = true;
		}

		// 用户收藏标签
		var favoriteList = getFavoriteDicts();
		if (favoriteList != null) {
			var settings_favoriteListDict = {
				item: table_Settings_key_FavoriteList,
				value: favoriteList
			};
			update(table_Settings, settings_favoriteListDict, () => {
				removeFavoriteDicts();
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

//#region step3.1.frontTranslate.js 首页谷歌翻译

var translateDict = {};

// 谷歌翻译:标签，通用方法
function translateClick() {
	// 根据是否选中来翻译或者正常
	var translateCheckbox = document.getElementById("googleTranslateCheckbox");
	var isChecked = translateCheckbox.checked;
	var needTranslateArray = document.getElementsByClassName("needTranslate");

	if (isChecked) {
		// 翻译
		var translateArray = [];
		if (!checkDictNull(translateDict)) {
			// 已经请求过接口，直接翻译
			TranslateByDict();
		} else {
			// 请求接口，更新字典，翻译标签
			for (const i in needTranslateArray) {
				if (Object.hasOwnProperty.call(needTranslateArray, i)) {
					const item = needTranslateArray[i].title;
					translateArray.push(item);
				}
			}

			if (translateArray.length > 0) {
				// 请求接口
				var text = translateArray.join("|");
				getGoogleTranslate(text, function (data) {
					var sentences = data.sentences;
					var longtext = '';
					for (const i in sentences) {
						if (Object.hasOwnProperty.call(sentences, i)) {
							const sentence = sentences[i];
							longtext += sentence.trans;
						}
					}

					var categoryZhArray = longtext.split("|");
					for (const i in translateArray) {
						if (Object.hasOwnProperty.call(translateArray, i)) {
							const enKey = translateArray[i];
							if (!translateDict[enKey]) {
								translateDict[enKey] = categoryZhArray[i];
							}
						}
					}

					// 替换文本文件，并添加原文
					TranslateByDict();
				});
			}

		}
		// 翻译
		function TranslateByDict() {
			for (const i in needTranslateArray) {
				if (Object.hasOwnProperty.call(needTranslateArray, i)) {
					const divItem = needTranslateArray[i];
					divItem.dataset.old_inner_text = divItem.innerText;
					var enKey = divItem.title;
					divItem.innerText = translateDict[enKey]?.replace("：", ":") ?? enKey;
				}
			}
		}

	}
	else {
		// 不翻译，使用原文
		if (!checkDictNull(translateDict)) {
			// 已经翻译过，从 data 原文中返回
			for (const i in needTranslateArray) {
				if (Object.hasOwnProperty.call(needTranslateArray, i)) {
					const divItem = needTranslateArray[i];
					divItem.innerText = divItem.dataset.old_inner_text;
				}
			}
		}
	}

	return isChecked;
}

// 首页谷歌翻译：标签
function translateClickMainPage() {
	var isChecked = translateClick();

	// 更新存储
	var settings_translateFrontPageTags = {
		item: table_settings_key_TranslateFrontPageTags,
		value: isChecked
	};
	update(table_Settings, settings_translateFrontPageTags, () => { }, () => { });
}

function mainPageTranslate() {
	// 首页添加 Meta
	var meta = document.createElement("meta");
	meta.httpEquiv = "Content-Security-Policy";
	meta.content = "upgrade-insecure-requests";
	document.getElementsByTagName("head")[0].appendChild(meta);

	// 展示总数量
	var ip = document.getElementsByClassName("ip");
	if (ip.length > 0) {
		var ipElement = ip[0];
		var totalCount = ipElement.innerText.replace("Showing ", "").replace(" results", "");
		ipElement.innerText = `共 ${totalCount} 条记录`;
	}
	// 预览下拉框
	const dropData = {
		"Minimal": "标题 + 悬浮图",
		"Minimal+": "标题 + 悬浮图 + 账号收藏标签",
		"Compact": "标题 + 悬浮图 + 标签",
		"Extended": "标题 + 图片 + 标签",
		"Thumbnail": "标题 + 缩略图",
	}

	var dms = document.getElementById("dms");
	if (!dms) {
		// 没有搜索到记录
		var iw = document.getElementById("iw");
		if (iw) {
			getGoogleTranslate(iw.innerText, function (data) {

				var sentences = data.sentences;
				var longtext = '';
				for (const i in sentences) {
					if (Object.hasOwnProperty.call(sentences, i)) {
						const sentence = sentences[i];
						longtext += sentence.trans;
					}
				}

				iw.innerText = longtext;
			});
		}

		var ido = document.getElementsByClassName("ido");
		if (ido.length > 0) {
			var nullInfo = ido[0].lastChild.lastChild;
			if (nullInfo) {
				getGoogleTranslate(nullInfo.innerText, function (data) {

					var sentences = data.sentences;
					var longtext = '';
					for (const i in sentences) {
						if (Object.hasOwnProperty.call(sentences, i)) {
							const sentence = sentences[i];
							longtext += sentence.trans;
						}
					}
					nullInfo.innerText = longtext;
				});
			}
		}

		return;
	}
	var select = dms.querySelectorAll("select");
	if (select.length > 0) {
		var selectElement = select[0];
		var options = selectElement.options;
		for (const i in options) {
			if (Object.hasOwnProperty.call(options, i)) {
				const option = options[i];
				option.innerText = dropData[option.innerText] ?? option.innerText;
			}
		}
	}

	// 表格头部左侧添加勾选 谷歌机翻
	var translateDiv = document.createElement("div");
	translateDiv.id = "googleTranslateDiv";
	var translateCheckbox = document.createElement("input");
	translateCheckbox.setAttribute("type", "checkbox");
	translateCheckbox.id = "googleTranslateCheckbox";
	translateDiv.appendChild(translateCheckbox);
	var translateLabel = document.createElement("label");
	translateLabel.setAttribute("for", translateCheckbox.id);
	translateLabel.id = "translateLabel";
	translateLabel.innerText = "谷歌机翻 : 标签";

	// 读取是否选中
	read(table_Settings, table_settings_key_TranslateFrontPageTags, result => {
		if (result && result.value) {
			translateCheckbox.setAttribute("checked", true);
		}
	}, () => { });

	translateDiv.appendChild(translateLabel);

	translateCheckbox.addEventListener("click", translateClickMainPage);

	var dms = document.getElementById("dms");
	dms.insertBefore(translateDiv, dms.lastChild);





	// 根据右侧预览下拉框显示和隐藏
	var rightSelect = select[0];
	if (rightSelect.value == "l" || rightSelect.value == "e") {
		// 显示
		translateDiv.style.display = "block";
	} else {
		// 隐藏
		translateDiv.style.display = "none";
	}

	// 表头
	const thData = {
		"": "作品类型",
		"Published": "上传日期",
		"Title": "标题",
		"Uploader": "上传人员"
	};
	var table = document.getElementsByClassName("itg");
	if (table.length > 0) {
		var theads = table[0].querySelectorAll("th");
		for (const i in theads) {
			if (Object.hasOwnProperty.call(theads, i)) {
				const th = theads[i];
				th.innerText = thData[th.innerText] ?? th.innerText;
				if ((i == 2 || i == 4) && th.innerText == "作品类型") {
					th.innerText = "";
				}
			}
		}
	}

	// 作品类型
	var cs = document.getElementsByClassName("cs");
	for (const i in cs) {
		if (Object.hasOwnProperty.call(cs, i)) {
			const item = cs[i];
			if (!item.innerText) {
				var classList = item.classList;
				for (const i in classList) {
					if (Object.hasOwnProperty.call(classList, i)) {
						const className = classList[i];
						if (bookClassTypeData[className]) {
							item.innerText = bookClassTypeData[className];
						}
					}
				}
			} else {
				item.innerText = bookTypeData[item.innerText] ?? item.innerText;
			}
		}
	}
	var cn = document.getElementsByClassName("cn");
	for (const i in cn) {
		if (Object.hasOwnProperty.call(cn, i)) {
			const item = cn[i];
			if (!item.innerText) {
				var classList = item.classList;
				for (const i in classList) {
					if (Object.hasOwnProperty.call(classList, i)) {
						const className = classList[i];
						if (bookClassTypeData[className]) {
							item.innerText = bookClassTypeData[className];
						}
					}
				}
			} else {
				item.innerText = bookTypeData[item.innerText] ?? item.innerText;
			}
		}
	}




	// 作品标签
	var tc = document.getElementsByClassName("tc");
	for (const i in tc) {
		if (Object.hasOwnProperty.call(tc, i)) {
			const item = tc[i];
			var cateEn = item.innerText.replace(":", "");
			if (detailParentData[cateEn]) {
				item.innerText = detailParentData[cateEn];
			} else {
				item.classList.add("needTranslate");
			}
		}
	}

	// 翻译数量
	var translateCount = 0;

	var gt = document.getElementsByClassName("gt");
	for (const i in gt) {
		if (Object.hasOwnProperty.call(gt, i)) {
			const item = gt[i];
			var innerText = item.innerText;
			if (innerText.indexOf(":") != -1) {
				// 父子标签
				var split = item.title.split(":");
				var parentEn = split[0];
				var subEn = split[1];
				var parentZh = detailParentData[parentEn] ?? parentEn;

				getSubZh(subEn, subZh => {
					item.innerText = `${parentZh}:${subZh}`;
					translateCount++;
				}, () => {
					item.classList.add("needTranslate");
					translateCount++;
				});
			}
			else {
				// 只有子标签
				var subEn = innerText;
				getSubZh(subEn, subZh => {
					item.innerText = subZh;
					translateCount++;
				}, () => {
					item.classList.add("needTranslate");
					translateCount++;
				});
			}
		}
	}
	var gtl = document.getElementsByClassName("gtl");
	for (const i in gtl) {
		if (Object.hasOwnProperty.call(gtl, i)) {
			const item = gtl[i];
			var subEn = item.innerText;
			getSubZh(subEn, subZh => {
				item.innerText = subZh;
				translateCount++;
			}, () => {
				item.classList.add("needTranslate");
				translateCount++;
			});
		}
	}

	var allCount = gt.length + gtl.length;

	var t = setInterval(() => {
		if (translateCount == allCount) {
			t && clearInterval(t);
			// 判断一开始是否选中
			read(table_Settings, table_settings_key_TranslateFrontPageTags, result => {
				if (result && result.value) {
					translateClickMainPage();
				}
			}, () => { });
		}

	}, 50);

	function getSubZh(subEn, func_hasData, func_none) {
		// 先从 恋物父子表尝试取出数据，如果不能找到再从EhTag表取数据
		readByIndex(table_fetishListSubItems, table_fetishListSubItems_index_subEn, subEn, result1 => {
			func_hasData(result1.sub_zh);
		}, () => {
			readByIndex(table_EhTagSubItems, table_EhTagSubItems_index_subEn, subEn, result2 => {
				func_hasData(result2.sub_zh);
			}, () => { func_none(); });
		});
	}

}

//#endregion

//#region step3.2.frontPageTopStyle 首页头部搜索显示隐藏

// 添加样式和逻辑，从 localstroage 中读取显示隐藏
function frontPageTopStyleStep01() {
	// 调整头部样式
	var searchBoxDiv = document.getElementById("searchbox");
	searchBoxDiv.style.width = "auto";
	searchBoxDiv.style.border = "0";

	// 头部添加隐藏按钮和显示按钮
	var hiddenOldDiv = document.createElement("div");
	hiddenOldDiv.id = "div_old_hidden_btn";
	var hiddenOldText = document.createTextNode("隐藏");
	hiddenOldDiv.appendChild(hiddenOldText);
	hiddenOldDiv.addEventListener("click", hideOldSearchDiv);
	searchBoxDiv.appendChild(hiddenOldDiv);
	var showOldDiv = document.createElement("div");
	showOldDiv.id = "div_old_show_btn";
	var showOldText = document.createTextNode("显示");
	showOldDiv.appendChild(showOldText);
	showOldDiv.addEventListener("click", showOldSearchDiv);
	searchBoxDiv.appendChild(showOldDiv);

	function hideOldSearchDiv() {
		searchBoxDiv.children[0].style.display = "none";
		hiddenOldDiv.style.display = "none";
		showOldDiv.style.display = "block";
		setOldSearchDivVisible(0);
	}
	function showOldSearchDiv() {
		searchBoxDiv.children[0].style.display = "block";
		hiddenOldDiv.style.display = "block";
		showOldDiv.style.display = "none";
		setOldSearchDivVisible(1);
	}

	// 读取头部是否隐藏，并应用到页面中
	var oldSearchDivVisible = getOldSearchDivVisible();
	if (oldSearchDivVisible == 0) {
		searchBoxDiv.children[0].style.display = "none";
		hiddenOldDiv.style.display = "none";
		showOldDiv.style.display = "block";
	}
}

// 从indexedDB 中读取隐藏折叠
function frontPageTopStyleStep02() {
	var searchBoxDiv = document.getElementById("searchbox");
	var hiddenOldDiv = document.getElementById("div_old_hidden_btn");
	var showOldDiv = document.getElementById("div_old_show_btn");

	var oldSearchDivVisible = getOldSearchDivVisible();
	if (oldSearchDivVisible == null) {
		// 尝试从 indexedDB 中读取配置，如果存在则说明 localstroage 配置丢失，需要补充，页面对应隐藏折叠
		read(table_Settings, table_Settings_key_OldSearchDiv_Visible, result => {
			if (result) {
				if (!result.value) {
					searchBoxDiv.children[0].style.display = "none";
					hiddenOldDiv.style.display = "none";
					showOldDiv.style.display = "block";
				}
				setOldSearchDivVisible(result.value ? 1 : 0);
			}
		}, () => { });

	}

	// 添加按钮点击事件，用于将配置存储到 indexDB 中
	hiddenOldDiv.addEventListener("click", hiddenTopIndexedDb);
	showOldDiv.addEventListener("click", showTopIndexedDb);
	function hiddenTopIndexedDb() {
		var settings_oldSearchDivVisible = {
			item: table_Settings_key_OldSearchDiv_Visible,
			value: false
		};
		update(table_Settings, settings_oldSearchDivVisible, () => { }, error => { });
	}

	function showTopIndexedDb() {
		var settings_oldSearchDivVisible = {
			item: table_Settings_key_OldSearchDiv_Visible,
			value: true
		};
		update(table_Settings, settings_oldSearchDivVisible, () => { }, error => { });
	}
}

//#endregion

//#region step3.3.frontHtml.js 首页HTML 

// 首页代码
const category_html = `
<div id="search_wrapper">
	<div id="search_top">
		<div id="category_all_button">全部类别</div>
		<div id="category_favorites_button">本地收藏</div>
		<div id="search_close">收起</div>
		<div id="category_search_input">
			<div id="input_info">
				<span id="readonly_div"></span>
				<input type="text" id="user_input">
				<span id="user_input_enter" title="按回车键添加">↵</span>
			</div>
			<div id="category_enter_button">首页</div>
			<div id="input_clear">X</div>
			<div id="category_user_input_recommend"></div>
		</div>
		<div id="category_addFavorites_button">加入收藏</div>
		<div id="category_addFavorites_button_disabled">加入收藏</div>
	</div>
	<div id="display_div">
		<div id="category_all_div">
			<div id="category_editor">
				<div id="all_collapse">折叠</div>
				<div id="all_expand">展开</div>
			</div>
			<div id="category_list">
                <div id="category_list_fetishList"></div>
                <div id="category_list_ehTag"></div>
            </div>
		</div>
		<div id="category_favorites_div">
			<div id="favorites_editor">
				<div id="favorites_all_collapse">折叠</div>
				<div id="favorites_all_expand">展开</div>
				<div id="favorites_edit">编辑</div>
				<div id="favorites_clear">清空</div>
				<div id="favorites_save">保存</div>
				<div id="favorites_cancel">取消</div>
				<input type="file" id="favorite_upload_files" accept=".json">
				<div id="favorites_recover" title="从备份文件恢复收藏数据">恢复</div>
				<div id="favorites_export" title="备份收藏数据">备份</div>
			</div>
			<div id="favorites_list"></div>
			<div id="favorites_edit_list"></div>
		</div>
	</div>
</div>
`;

function frontPageHtml() {
	// 基本框架代码插入，先创建包裹层div，然后构造包裹层内容
	var webdiv = document.createElement("div");
	webdiv.id = "div_ee8413b2";
	var searchBoxDiv = document.getElementById("searchbox");
	searchBoxDiv.appendChild(webdiv);
	//searchBoxDiv.insertBefore(webdiv, searchBoxDiv.children[0]);
	webdiv.innerHTML = category_html;
}

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
	mainPageCategory();
}

function mainPageCategory() {
	// 头部菜单汉化
	topMenuTranslateZh();

	// 从localstroge 读取，头部隐藏折叠
	frontPageTopStyleStep01();

	// TODO 头部高度伸缩功能
	// 首页框架搭建
	frontPageHtml();

	// 初始化用户配置信息
	initUserSettings(() => {
		console.log('初始化用户配置信息完毕');

		// TODO 不同语种的翻译
		// TODO 首页谷歌翻译：标题

		// 首页头部样式调整，补充事件
		frontPageTopStyleStep02();

		// 列举可用元素
		//#region step3.4.frontPageAllElements.js 列出首页全部可操作元素
		// 全部类别按钮、收藏按钮
		var allCategoryBtn = document.getElementById("category_all_button");
		var categoryFavoritesBtn = document.getElementById("category_favorites_button");

		// 搜索框标签收集栏、输入框、回车按钮、候选div、可用按钮、清空按钮、搜索按钮
		var searchInput = document.getElementById("input_info");
		var readonlyDiv = document.getElementById("readonly_div");
		var userInput = document.getElementById("user_input");
		var userInputEnterBtn = document.getElementById("user_input_enter");
		var userInputRecommendDiv = document.getElementById("category_user_input_recommend");
		var inputClearBtn = document.getElementById("input_clear");
		var searchBtn = document.getElementById("category_enter_button");

		// 加入收藏按钮、不可用的加入收藏按钮、收起按钮
		var addFavoritesBtn = document.getElementById("category_addFavorites_button");
		var addFavoritesDisabledBtn = document.getElementById("category_addFavorites_button_disabled");
		var searchCloseBtn = document.getElementById("search_close");

		// 展示区包裹层div、全部类别Div、收藏Div、类别列表div、类别_恋物列表div、类别_ehtag列表div、收藏列表div
		var displayDiv = document.getElementById("display_div");
		var categoryDisplayDiv = document.getElementById("category_all_div");
		var favoritesDisplayDiv = document.getElementById("category_favorites_div");
		var categoryListDiv = document.getElementById("category_list");
		var categoryList_fetishDiv = document.getElementById("category_list_fetishList");
		var categoryList_ehTagDiv = document.getElementById("category_list_ehTag");
		var favoriteListDiv = document.getElementById("favorites_list");

		// [标签 + 收藏] 全部展开按钮、标签全部折叠按钮、标签展开折叠按钮、标签
		var allExtend = document.getElementById("all_expand");
		var allCollapse = document.getElementById("all_collapse");
		var categoryExtends = document.getElementsByClassName("category_extend");
		var favoriteAllExtend = document.getElementById("favorites_all_expand");
		var favoriteAllCollapse = document.getElementById("favorites_all_collapse");
		var favoriteExtends = document.getElementsByClassName("favorite_extend");
		var cItems = document.getElementsByClassName("c_item");

		// 收藏编辑div、收藏编辑按钮、收藏保存按钮、收藏取消按钮、收藏清空按钮
		var favoriteEditDiv = document.getElementById("favorites_edit_list");
		var favoriteEdit = document.getElementById("favorites_edit");
		var favoriteSave = document.getElementById("favorites_save");
		var favoriteCancel = document.getElementById("favorites_cancel");
		var favoriteClear = document.getElementById("favorites_clear");

		// 备份收藏按钮、恢复收藏按钮、上传按钮
		var favoriteExport = document.getElementById("favorites_export");
		var favoriteRecover = document.getElementById("favorites_recover");
		var favoriteUploadFiles = document.getElementById("favorite_upload_files");

		//#endregion

		var searchItemDict = {}; // 搜索框字典

		// 本地列表、本地收藏、收起按钮点击事件
		//#region step3.5.frontPageBtnEvents.js 首页插件的按钮点击事件
		// 全部类别按钮
		allCategoryBtn.onclick = function () {
			var isDisplay = displayDiv.clientHeight != 537;
			allCategoryBtn.classList.add("chooseTab");
			categoryFavoritesBtn.classList.remove("chooseTab");
			categoryDisplayDiv.style.display = "block";
			favoritesDisplayDiv.style.display = "none";
			if (checkDictNull(searchItemDict)) {
				addFavoritesBtn.style.display = "none";
				addFavoritesDisabledBtn.style.display = "block";
			}
			else {
				addFavoritesBtn.style.display = "block";
				addFavoritesDisabledBtn.style.display = "none";
			}

			// 展开动画
			if (isDisplay) {
				slideDown(displayDiv, 537, 15, function () {
					searchCloseBtn.style.display = "block";
				});
			}
		};

		// 本地收藏按钮
		categoryFavoritesBtn.onclick = function () {
			var isDisplay = displayDiv.clientHeight != 537;
			categoryFavoritesBtn.classList.add("chooseTab");
			allCategoryBtn.classList.remove("chooseTab");
			favoritesDisplayDiv.style.display = "block";
			categoryDisplayDiv.style.display = "none";

			if (favoriteSave.style.display == "block" || checkDictNull(searchItemDict)) {
				addFavoritesBtn.style.display = "none";
				addFavoritesDisabledBtn.style.display = "block";
			}
			else {
				addFavoritesBtn.style.display = "block";
				addFavoritesDisabledBtn.style.display = "none";
			}

			// 展开动画
			if (isDisplay) {
				slideDown(displayDiv, 537, 15, function () {
					searchCloseBtn.style.display = "block";
				});
			}
		}


		// 收起按钮
		searchCloseBtn.onclick = function () {
			categoryFavoritesBtn.classList.remove("chooseTab");
			allCategoryBtn.classList.remove("chooseTab");

			// 折叠动画
			slideUp(displayDiv, 15, function () {
				categoryDisplayDiv.style.display = "none";
				favoritesDisplayDiv.style.display = "none";
				searchCloseBtn.style.display = "none";
			});
		}


		// 搜索按钮

		// 加入收藏按钮



		//#endregion


		// indexedDB 数据存储初始化
		tagDataDispose(() => {
			console.log('初始化完毕');

			// 首页谷歌翻译：标签
			mainPageTranslate();

			// 本地列表Html + 功能
			//#region step3.6.category.js 本地列表模块

			// 折叠方法
			function extendDiv(extendSpans, extendArray) {
				for (const i in extendSpans) {
					if (Object.hasOwnProperty.call(extendSpans, i)) {
						const span = extendSpans[i];
						var parent_en = span.dataset.category;
						if (extendArray.indexOf(parent_en) != -1) {
							span.innerText = "+";
							var itemDiv = document.getElementById("items_div_" + parent_en);
							itemDiv.style.display = "none";
						}
					}
				}
			}

			// 单个折叠、展开
			function parentItemsExtend(extendSpans) {
				for (const i in extendSpans) {
					if (Object.hasOwnProperty.call(extendSpans, i)) {
						const item = extendSpans[i];
						item.addEventListener("click", function () {
							// 获取存储折叠信息
							read(table_Settings, table_Settings_key_CategoryList_Extend, result => {
								var extendData = [];
								if (result) {
									extendData = result.value;
								}

								var cateDivName = item.dataset.category;
								if (item.innerHTML == "+") {
									// 需要展开
									item.innerHTML = "-";
									document.getElementById("items_div_" + cateDivName).style.display = "block";
									if (extendData.indexOf(cateDivName) != -1) {
										extendData.remove(cateDivName);
									}
								}
								else {
									// 需要折叠
									item.innerHTML = "+";
									document.getElementById("items_div_" + cateDivName).style.display = "none";
									if (extendData.indexOf(cateDivName) == -1) {
										extendData.push(cateDivName);
									}
								}

								// 保存存储信息
								var setting_categoryExtend = {
									item: table_Settings_key_CategoryList_Extend,
									value: extendData
								}
								update(table_Settings, setting_categoryExtend, () => { }, () => { });

							}, () => { });
						});
					}
				}
			}

			// 添加小项到搜索框
			function addItemToInput(parent_en, parent_zh, sub_en, sub_zh, sub_desc) {
				if (searchItemDict[`${parent_en}:${sub_en}`] == undefined) {
					if (checkDictNull(searchItemDict)) {
						inputClearBtn.style.display = "block";
						searchBtn.innerText = "搜索";
					}

					var newSearchInputItem = document.createElement("span");
					newSearchInputItem.classList.add("input_item");
					newSearchInputItem.id = `input_item_${parent_en}_${sub_en}`;
					newSearchInputItem.title = sub_en;

					const key = `${parent_en}:${sub_en}`;
					newSearchInputItem.dataset.item = key;
					searchItemDict[key] = { parent_en, parent_zh, sub_en, sub_zh, sub_desc };

					var searchItemText = document.createTextNode(`${parent_zh} : ${sub_zh} X`);
					newSearchInputItem.appendChild(searchItemText);
					newSearchInputItem.addEventListener("click", removeSearchItem);
					readonlyDiv.appendChild(newSearchInputItem);

					addFavoritesBtn.style.display = "block";
					addFavoritesDisabledBtn.style.display = "none";

					// 滚动条滚动到底部
					searchInput.scrollTop = searchInput.scrollHeight;
				}
			}


			// 点击小项加入到搜索框
			function cItemJsonSearchInput(cItems) {
				for (const i in cItems) {
					if (Object.hasOwnProperty.call(cItems, i)) {
						const searchItem = cItems[i];
						searchItem.addEventListener("click", function () {
							var parentEn = searchItem.dataset.parent_en;
							var parentZh = searchItem.dataset.parent_zh;
							var subDesc = searchItem.dataset.sub_desc;
							var enItem = searchItem.dataset.item;
							var zhItem = searchItem.innerHTML;

							addItemToInput(parentEn, parentZh, enItem, zhItem, subDesc);
						});
					}
				}
			}


			// 恋物列表模块
			read(table_Settings, table_Settings_key_FetishList_Html, result => {
				// 生成 html 代码
				categoryList_fetishDiv.innerHTML = result.value;
				// 读取折叠并设置
				var extendSpans = document.getElementsByClassName("category_extend_fetish");
				read(table_Settings, table_Settings_key_CategoryList_Extend, extendResult => {
					if (extendResult) {
						extendDiv(extendSpans, extendResult.value);
					}
				}, () => { });
				// 单个展开折叠
				parentItemsExtend(extendSpans);
				// 具体小项点击加入搜索框
				var cItems = document.getElementsByClassName("c_item_fetish");
				cItemJsonSearchInput(cItems);
			}, () => { });

			// EhTag列表模块
			read(table_Settings, table_Settings_key_EhTag_Html, result => {
				// 生成 html 代码
				categoryList_ehTagDiv.innerHTML = result.value;
				// 读取折叠并设置
				var extendSpans = document.getElementsByClassName("category_extend_ehTag");
				read(table_Settings, table_Settings_key_CategoryList_Extend, extendResult => {
					if (extendResult) {
						extendDiv(extendSpans, extendResult.value);
					}
				}, () => { });
				// 单个展开折叠
				parentItemsExtend(extendSpans);
				// 具体小项点击加入搜索框
				var cItems = document.getElementsByClassName("c_item_ehTag");
				cItemJsonSearchInput(cItems);
			}, () => { });

			// 全部折叠
			allCollapse.onclick = function () {
				var extendBtns = document.getElementsByClassName("category_extend");
				for (const i in extendBtns) {
					if (Object.hasOwnProperty.call(extendBtns, i)) {
						const btn = extendBtns[i];
						if (btn.innerHTML != "+") {
							btn.innerHTML = "+";
						}
					}
				}

				var categoryItemsDiv = document.getElementsByClassName("category_items_div");
				for (const i in categoryItemsDiv) {
					if (Object.hasOwnProperty.call(categoryItemsDiv, i)) {
						const div = categoryItemsDiv[i];
						if (div.style.display != "none") {
							div.style.display = "none";
						}
					}
				}

				// 存储全部父级
				var allParentDataArray = [];

				// 并更新存储全部的父级名称
				read(table_Settings, table_Settings_key_FetishList_ParentEnArray, fetishParentData => {
					allParentDataArray = fetishParentData.value;
					read(table_Settings, table_Settings_key_EhTag_ParentEnArray, ehTagParentData => {
						allParentDataArray = allParentDataArray.concat(ehTagParentData.value);
						// 存储全部
						var setting_categoryExtend = {
							item: table_Settings_key_CategoryList_Extend,
							value: allParentDataArray
						}
						update(table_Settings, setting_categoryExtend, () => { }, () => { });
					}, () => { });
				}, () => { });
			}

			// 全部展开
			allExtend.onclick = function () {
				var extendBtns = document.getElementsByClassName("category_extend");
				for (const i in extendBtns) {
					if (Object.hasOwnProperty.call(extendBtns, i)) {
						const btn = extendBtns[i];
						if (btn.innerHTML != "-") {
							btn.innerHTML = "-";
						}
					}
				}

				var categoryItemsDiv = document.getElementsByClassName("category_items_div");
				for (const i in categoryItemsDiv) {
					if (Object.hasOwnProperty.call(categoryItemsDiv, i)) {
						const div = categoryItemsDiv[i];
						if (div.style.display != "block") {
							div.style.display = "block";
						}
					}
				}

				// 清空折叠记录
				remove(table_Settings, table_Settings_key_CategoryList_Extend, () => { }, () => { });
			}

			//#endregion


			//#region step3.7.search.js 搜索框功能

			// 进入页面，根据地址栏信息生成搜索栏标签
			var f_searchs = GetQueryString("f_search");
			if (f_searchs) {
				var searchArray = f_searchs.split("\"+\"");
				for (const i in searchArray) {
					if (Object.hasOwnProperty.call(searchArray, i)) {

						var items = searchArray[i].replace(/\+/g, " ").replace(/\"/g, "");
						var itemArray = items.split(":");
						searchItem(itemArray);

						function searchItem(itemArray) {
							if (itemArray.length == 2) {
								var parentEn = itemArray[0];
								var subEn = itemArray[1];
								// 从EhTag中查询，看是否存在
								readByIndex(table_EhTagSubItems, table_EhTagSubItems_index_subEn, subEn, ehTagData => {
									addItemToInput(ehTagData.parent_en, ehTagData.parent_zh, ehTagData.sub_en, ehTagData.sub_zh);
								}, () => {
									addItemToInput(parentEn, subEn, subEn, subEn);
								});
							}
							else {
								// 从恋物列表中查询，看是否存在
								readByIndex(table_fetishListSubItems, table_fetishListSubItems_index_subEn, itemArray[0], fetishData => {
									addItemToInput(fetishData.parent_en, fetishData.parent_zh, fetishData.sub_en, fetishData.sub_zh);
								}, () => {
									// 用户自定义搜索关键字
									addItemToInput("userCustom", "自定义", itemArray[0], itemArray[0]);
								});
							}
						}
					}
				}
			}

			// 删除搜索框子项
			function removeSearchItem(e) {
				var id = e.path[0].id;
				var item = document.getElementById(id);
				var cateItem = item.dataset.item;
				delete searchItemDict[cateItem];
				console.log(cateItem);
				console.log(searchItemDict);

				if (checkDictNull(searchItemDict)) {
					inputClearBtn.style.display = "none";
					searchBtn.innerText = "首页";
					addFavoritesBtn.style.display = "none";
					addFavoritesDisabledBtn.style.display = "block";
				}

				item.parentNode.removeChild(item);
			}

			// 清空选择
			inputClearBtn.onclick = function () {
				searchItemDict = {};
				readonlyDiv.innerHTML = "";
				inputClearBtn.style.display = "none";
				searchBtn.innerText = "首页";
				addFavoritesBtn.style.display = "none";
				addFavoritesDisabledBtn.style.display = "block";
			}

			// 搜索包含父级
			function SearchWithParentEn(fetishParentArray) {
				var enItemArray = [];
				for (const i in searchItemDict) {
					if (Object.hasOwnProperty.call(searchItemDict, i)) {
						var item = searchItemDict[i];
						if (fetishParentArray.indexOf(item.parent_en) != -1) {
							enItemArray.push(`"${item.sub_en}"`);
						}
						else if (item.parent_en == "userCustom") {
							enItemArray.push(`"${item.sub_en}"`);
						} else {
							enItemArray.push(`"${item.parent_en}:${item.sub_en}"`);
						}
					}
				}
				searchBtn.innerText = "···";
				// 构建请求链接
				var searchLink = `https://${webHost}/?f_search=${enItemArray.join("+")}`;
				window.location.href = searchLink;
			}

			// 搜索只有子级
			function SearchWithoutParentEn() {
				var enItemArray = [];
				for (const i in searchItemDict) {
					if (Object.hasOwnProperty.call(searchItemDict, i)) {
						var item = searchItemDict[i];
						if (item.parent_en == "userCustom") {
							enItemArray.push(`"${item.sub_en}"`);
						} else if (enItemArray.indexOf(item.sub_en) == -1) {
							enItemArray.push(`"${item.sub_en}"`);
						}
					}
				}
				searchBtn.innerText = "···";
				// 构建请求链接
				var searchLink = `https://${webHost}/?f_search=${enItemArray.join("+")}`;
				window.location.href = searchLink;
			}

			// 搜索按钮 or 首页按钮
			searchBtn.onclick = function () {
				if (searchBtn.innerText == "首页") {
					searchBtn.innerText = "···";
					window.location.href = `https://${webHost}`;
				}
				else if (searchBtn.innerText == "搜索") {
					read(table_Settings, table_Settings_key_FetishList_ParentEnArray, fetishParentResult => {
						if (fetishParentResult) {
							SearchWithParentEn(fetishParentResult.value);
						} else {
							SearchWithoutParentEn();
						}
					}, () => {
						SearchWithoutParentEn();
					});
				}
			}

			// 搜索按钮，点击后如果鼠标悬浮指针改为转圈
			searchBtn.onmouseover = function () {
				if (searchBtn.innerText == "···") {
					searchBtn.style.cursor = "wait";
				}
			}

			// 鼠标悬浮显示输入框
			searchInput.onmouseover = function () {
				if (userInput.value == "") {
					userInput.classList.add("user_input_null_backcolor");
				} else {
					userInput.classList.add("user_input_value_backColor");
				}

			}

			// 鼠标移出移除输入框
			searchInput.onmouseout = function () {
				if (userInput.value == "") {
					userInput.classList.remove("user_input_null_backcolor");
					userInput.classList.remove("user_input_value_backColor");
				}
			}

			// 输入框输入时候选
			userInput.oninput = function () {
				var inputValue = userInput.value;
				userInputOnInputEvent(inputValue);
			}

			function userInputOnInputEvent(inputValue) {
				// 清空候选项
				userInputRecommendDiv.innerHTML = "";
				userInputRecommendDiv.style.display = "block";
				var tempDiv = document.createElement("div");
				userInputRecommendDiv.appendChild(tempDiv);

				if (!inputValue) {
					userInputRecommendDiv.style.display = "none";
					return;
				}



				// 添加搜索候选
				function addInputSearchItems(foundArrays) {
					for (const i in foundArrays) {
						if (Object.hasOwnProperty.call(foundArrays, i)) {
							const item = foundArrays[i];
							var commendDiv = document.createElement("div");
							commendDiv.classList.add("category_user_input_recommend_items");
							commendDiv.title = item.sub_desc;

							var chTextDiv = document.createElement("div");
							chTextDiv.style.float = "left";
							var chTextNode = document.createTextNode(`${item.parent_zh} : ${item.sub_zh}`);
							chTextDiv.appendChild(chTextNode);

							var enTextDiv = document.createElement("div");
							enTextDiv.style.float = "right";
							var enTextNode = document.createTextNode(`${item.parent_en} : ${item.sub_en}`);
							enTextDiv.appendChild(enTextNode);

							commendDiv.appendChild(chTextDiv);
							commendDiv.appendChild(enTextDiv);

							commendDiv.addEventListener("click", function () {
								addItemToInput(item.parent_en, item.parent_zh, item.sub_en, item.sub_zh);
								userInputRecommendDiv.innerHTML = "";
								userInput.value = "";
								userInput.focus();
							});
							tempDiv.appendChild(commendDiv);
						}
					}
				}

				// 从恋物表中模糊搜索，绑定数据
				readByCursorIndexFuzzy(table_fetishListSubItems, table_fetishListSubItems_index_searchKey, inputValue, foundArrays => {
					addInputSearchItems(foundArrays);
				});

				// 从EhTag中模糊搜索，绑定数据
				readByCursorIndexFuzzy(table_EhTagSubItems, table_EhTagSubItems_index_searchKey, inputValue, foundArrays => {
					addInputSearchItems(foundArrays);
				});

			}

			// 输入框检测回车事件
			userInput.onkeydown = function (e) {
				var theEvent = window.event || e;
				var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
				if (code == 13) {
					userInputEnter();
				}
			}

			userInputEnterBtn.onclick = userInputEnter;

			function userInputEnter() {
				var inputValue = userInput.value.replace(/(^\s*)|(\s*$)/g, '');
				if (!inputValue) return;


				var recommendItems = document.getElementsByClassName("category_user_input_recommend_items");
				if (recommendItems.length > 0) {
					// 从候选下拉列表中匹配，如果有相同的，使用匹配内容，否则直接新增自定义文本
					var isFound = false;
					for (const i in recommendItems) {
						if (Object.hasOwnProperty.call(recommendItems, i)) {
							const recommendItem = recommendItems[i];
							var zhDiv = recommendItem.firstChild;
							var enDiv = recommendItem.lastChild;
							var zhArray = zhDiv.innerText.split(" : ");
							var enArray = enDiv.innerText.split(" : ");
							var sub_zh = zhArray[1];
							var sub_en = enArray[1];
							if (sub_zh == inputValue || sub_en == inputValue) {
								// 符合条件
								var parent_zh = zhArray[0];
								var parent_en = enArray[0];
								addItemToInput(parent_en, parent_zh, sub_en, sub_zh);
								isFound = true;
								break;
							}
						}
					}

					if (!isFound) {
						// 没有找到符合条件的
						addItemToInput("userCustom", "自定义", inputValue, inputValue);
					}

				} else {
					// 如果没有下拉列表，直接新增自定义文本
					addItemToInput("userCustom", "自定义", inputValue, inputValue);
				}

				// 清空文本框
				userInput.value = "";
				userInputRecommendDiv.style.display = "none";
			}

			//#endregion


			//#region step3.8.favorite.js 收藏功能

			// 读取转换本地收藏数据
			read(table_Settings, table_Settings_key_FavoriteList, result => {
				if (result && result.value) {
					// 首次使用，需要转换收藏数据，更新本地收藏表，更新收藏Html
					reBuildFavoriteByOldData(result.value);
				} else {
					// 读取收藏 Html 数据，存在则更新页面
					generalFavoriteListDiv(false, () => {
						// 设置收藏折叠
						setFavoriteExpend();
						// 更新按钮状态
						updateFavoriteListBtnStatus();
					});
				}
			}, () => { });

			// 根据旧收藏数据重新生成收藏列表
			function reBuildFavoriteByOldData(favoriteDict) {

				var favoriteSubItems = {};
				// var example = { ps_en: "male:bo", parent_en: "male", parent_zh: "男性", sub_en: "bo", sub_zh: "波", sub_desc: "波波" };

				function setFavoriteDict(result) {
					var parent_en = result.parent_en;
					var parent_zh = result.parent_zh;
					var sub_en = result.sub_en;
					var sub_zh = result.sub_zh;
					var sub_desc = result.sub_desc;
					var ps_en = `${parent_en}:${sub_en}`;
					favoriteSubItems[ps_en] = { ps_en, parent_en, parent_zh, sub_en, sub_zh, sub_desc };
				}

				function setFavoriteDictCustom(subEn, subZh) {
					var parent_en = "userCustom";
					var parent_zh = "自定义";
					var sub_en = subEn;
					var sub_zh = subZh;
					var sub_desc = "";
					var ps_en = `${parent_en}:${sub_en}`;
					favoriteSubItems[ps_en] = { ps_en, parent_en, parent_zh, sub_en, sub_zh, sub_desc };
				}

				var foundTotalCount = 0; // 总数
				var foundIndex = 0; // 执行完个数

				for (const parentEn in favoriteDict) {
					if (Object.hasOwnProperty.call(favoriteDict, parentEn)) {
						const subData = favoriteDict[parentEn];
						var subItems = subData[1];
						if (parentEn == "localFavorites") {
							// 恋物数据
							for (const subEn in subItems) {
								if (Object.hasOwnProperty.call(subItems, subEn)) {
									const subZh = subItems[subEn];
									foundTotalCount++;
									readByIndex(table_fetishListSubItems, table_fetishListSubItems_index_subEn, subEn, fetishResult => {
										setFavoriteDict(fetishResult);
										foundIndex++;
									}, () => {
										setFavoriteDictCustom(subEn, subZh);
										foundIndex++;
									});
								}
							}

						} else {
							// Ehtag 数据
							for (const subEn in subItems) {
								if (Object.hasOwnProperty.call(subItems, subEn)) {
									const subZh = subItems[subEn];
									foundTotalCount++;
									var ps_en = `${parentEn}:${subEn}`;
									read(table_EhTagSubItems, ps_en, ehTagResult => {
										if (ehTagResult) {
											setFavoriteDict(ehTagResult);
											foundIndex++;
										} else {
											setFavoriteDictCustom(subEn, subZh);
											foundIndex++;
										}
									}, () => {
										setFavoriteDictCustom(subEn, subZh);
										foundIndex++;
									});
								}
							}
						}
					}
				}

				var t = setInterval(() => {
					if (foundTotalCount == foundIndex) {
						t && clearInterval(t);
						// 首次更新本地收藏列表
						firstUpdateFavoriteSubItems(favoriteSubItems, foundTotalCount);
					}
				}, 50);
			}

			// 首次更新本地收藏列表
			function firstUpdateFavoriteSubItems(favoriteSubItems, foundTotalCount) {
				// 更新本地收藏表
				batchAdd(table_favoriteSubItems, table_favoriteSubItems_key, favoriteSubItems, foundTotalCount, () => {
					console.log('批量添加本地收藏表完成');
					// 稳妥起见，更新完之后再删除本地的原始收藏列表
					remove(table_Settings, table_Settings_key_FavoriteList, () => { }, () => { });
				});

				// 生成 html 和 同步
				var favoritesListHtml = ``;
				var lastParentEn = ``;
				if (!checkDictNull(favoriteSubItems)) {
					// 新版收藏，只可能增加，原有的不变
					for (const ps_en in favoriteSubItems) {
						if (Object.hasOwnProperty.call(favoriteSubItems, ps_en)) {
							var item = favoriteSubItems[ps_en];
							if (item.parent_en != lastParentEn) {
								if (lastParentEn != '') {
									favoritesListHtml += `</div>`;
								}
								lastParentEn = item.parent_en;
								// 新建父级
								favoritesListHtml += `<h4 id="favorite_h4_${item.parent_en}">${item.parent_zh}<span data-category="${item.parent_en}"
                        class="favorite_extend">-</span></h4>`;
								favoritesListHtml += `<div id="favorite_div_${item.parent_en}" class="favorite_items_div">`;
							}

							// 添加子级
							favoritesListHtml += `<span class="c_item c_item_favorite" title="[${item.sub_en}] ${item.sub_desc}" data-item="${item.sub_en}" 
                            data-parent_en="${item.parent_en}" data-parent_zh="${item.parent_zh}" data-sub_desc="${item.sub_desc}">${item.sub_zh}</span>`;
						}
					}

					if (favoritesListHtml != ``) {
						favoritesListHtml += `</div>`;
					}

					// 页面附加Html
					favoriteListDiv.innerHTML = favoritesListHtml;

					// 存储收藏Html
					saveFavoriteListHtml(favoritesListHtml);

					// 小项添加点击事件
					favoriteItemsClick();

					// 折叠菜单添加点击事件
					favoriteExtendClick();

					// 折叠的菜单显示隐藏
					setFavoriteExpend();

				}

				// 更新按钮状态
				updateFavoriteListBtnStatus();
			}

			// 设置收藏折叠
			function setFavoriteExpend() {
				read(table_Settings, table_Settings_Key_FavoriteList_Extend, result => {
					if (result && result.value) {
						var expendArray = result.value;
						var expendBtns = document.getElementsByClassName("favorite_extend");
						for (const i in expendBtns) {
							if (Object.hasOwnProperty.call(expendBtns, i)) {
								const btn = expendBtns[i];
								var category = btn.dataset.category;
								if (expendArray.indexOf(category) != -1) {
									btn.innerText = "+";
									var itemDiv = document.getElementById("favorite_div_" + category);
									itemDiv.style.display = "none";
								}
							}
						}
					}
				}, () => { });
			}

			// 更新收藏列表Html存储
			function saveFavoriteListHtml(favoritesListHtml) {
				var settings_favoriteList_html = {
					item: table_Settings_key_FavoriteList_Html,
					value: favoritesListHtml
				};

				update(table_Settings, settings_favoriteList_html, () => { }, () => { });
			}

			// 为每个收藏子项添加点击事件
			function favoriteItemsClick() {
				var favoriteItems = document.getElementsByClassName("c_item_favorite");
				for (const i in favoriteItems) {
					if (Object.hasOwnProperty.call(favoriteItems, i)) {
						const item = favoriteItems[i];
						item.addEventListener("click", function () {
							var parentEn = item.dataset.parent_en;
							var parentZh = item.dataset.parent_zh;
							var subDesc = item.dataset.sub_desc;
							var enItem = item.dataset.item;
							var zhItem = item.innerHTML;

							addItemToInput(parentEn, parentZh, enItem, zhItem, subDesc);
						});
					}
				}
			}

			// 为每个折叠按钮添加点击事件
			function favoriteExtendClick() {
				var favoriteExtends = document.getElementsByClassName("favorite_extend");
				for (const i in favoriteExtends) {
					if (Object.hasOwnProperty.call(favoriteExtends, i)) {
						const item = favoriteExtends[i];
						item.addEventListener("click", function () {
							// 获取存储折叠信息
							read(table_Settings, table_Settings_Key_FavoriteList_Extend, result => {
								var expendData = [];
								if (result && result.value) {
									expendData = result.value;
								}

								var favoriteName = item.dataset.category;
								if (item.innerHTML == "+") {
									// 需要展开
									item.innerHTML = "-";
									document.getElementById("favorite_div_" + favoriteName).style.display = "block";
									if (expendData.indexOf(favoriteName) != -1) {
										expendData.remove(favoriteName);
									}
								} else {
									// 需要折叠
									item.innerHTML = "+";
									document.getElementById("favorite_div_" + favoriteName).style.display = "none";
									if (expendData.indexOf(favoriteName) == -1) {
										expendData.push(favoriteName);
									}
								}

								// 更新存储折叠信息
								var settings_favoriteList_extend = {
									item: table_Settings_Key_FavoriteList_Extend,
									value: expendData
								};

								update(table_Settings, settings_favoriteList_extend, () => { }, () => { });

							}, () => { });
						});

					}
				}
			}

			// 加入收藏
			addFavoritesBtn.onclick = function () {
				// 输入框标签，判断非空
				if (checkDictNull(searchItemDict)) {
					alert("收藏前请选择至少一个标签");
					return;
				}

				addFavoritesBtn.innerText = "收藏中...";

				var favoriteDicts = {}; // 原始收藏
				var newFavoriteDicts = {}; // 新增收藏

				// 读取存储收藏全部
				readAll(table_favoriteSubItems, (k, v) => {
					favoriteDicts[k] = v;
				}, () => {
					// 全部读取完毕，过滤出新增数据
					var newFavoritesCount = filterNewFavorites();

					// 如果有新数据就更新存储和页面
					updateDbAndPage(newFavoritesCount);
				});

				function filterNewFavorites() {
					var newFavoritesCount = 0;
					for (const ps_en in searchItemDict) {
						if (Object.hasOwnProperty.call(searchItemDict, ps_en)) {
							const item = searchItemDict[ps_en];
							if (!favoriteDicts[ps_en]) {
								newFavoriteDicts[ps_en] = item;
								newFavoritesCount++;
							}
						}
					}
					return newFavoritesCount;
				}

				function updateDbAndPage(newFavoritesCount) {
					if (newFavoritesCount > 0) {
						// 更新收藏表
						batchAdd(table_favoriteSubItems, table_favoriteSubItems_key, newFavoriteDicts, newFavoritesCount, () => {
							// 更新页面html 和 事件
							for (const ps_en in newFavoriteDicts) {
								if (Object.hasOwnProperty.call(newFavoriteDicts, ps_en)) {
									const item = newFavoriteDicts[ps_en];

									var favoriteH4Id = "favorite_h4_" + item.parent_en;
									var favoriteH4 = document.getElementById(favoriteH4Id);
									if (!favoriteH4) {
										var h4 = document.createElement("h4");
										h4.id = favoriteH4Id;
										var h4text = document.createTextNode(item.parent_zh);
										h4.appendChild(h4text);
										var spanExtend = document.createElement("span");
										spanExtend.dataset.category = item.parent_en;
										spanExtend.classList.add("favorite_extend");
										var spanExtendText = document.createTextNode("-");
										spanExtend.appendChild(spanExtendText);

										spanExtend.addEventListener("click", function () {
											favoriteExend(item.parent_en);
										});

										h4.appendChild(spanExtend);
										favoriteListDiv.appendChild(h4);
									}

									var favoriteDivId = "favorite_div_" + item.parent_en;
									var favoriteDiv = document.getElementById(favoriteDivId);
									if (!favoriteDiv) {
										var div = document.createElement("div");
										div.id = favoriteDivId;
										div.classList.add("favorite_items_div");
										favoriteListDiv.appendChild(div);
										favoriteDiv = document.getElementById(favoriteDivId);
									}

									var newFavoriteItem = document.createElement("span");
									newFavoriteItem.classList.add("c_item");
									newFavoriteItem.classList.add("c_item_favorite");
									newFavoriteItem.dataset.item = item.sub_en;
									newFavoriteItem.dataset.parent_en = item.parent_en;
									newFavoriteItem.dataset.parent_zh = item.parent_zh;
									newFavoriteItem.dataset.sub_desc = item.sub_desc;
									newFavoriteItem.title = `[${item.sub_en}] ${item.sub_desc}`;

									var itemText = document.createTextNode(item.sub_zh);
									newFavoriteItem.appendChild(itemText);

									newFavoriteItem.addEventListener("click", function () {
										addItemToInput(item.parent_en, item.parent_zh, item.sub_en, item.sub_zh, item.sub_desc);
									});

									favoriteDiv.appendChild(newFavoriteItem);

								}
							}

							// 获取html并更新收藏html
							saveFavoriteListHtml(favoriteListDiv.innerHTML);

							// 设置折叠
							setFavoriteExpend();

							// 完成
							finishFavorite();
						})
					} else {
						// 无更新
						finishFavorite();
					}
				}

				// 指定折叠
				function favoriteExend(parentEn) {
					var h4 = document.getElementById("favorite_h4_" + parentEn);
					var span = h4.querySelector("span");
					read(table_Settings, table_Settings_Key_FavoriteList_Extend, result => {
						var expendData = [];
						if (result && result.value) {
							expendData = result.value;
						}

						if (span.innerHTML == "+") {
							// 需要展开
							span.innerHTML = "-";
							document.getElementById("favorite_div_" + favoriteName).style.display = "block";
							if (expendData.indexOf(favoriteName) != -1) {
								expendData.remove(favoriteName);
							}
						} else {
							// 需要折叠
							span.innerHTML = "+";
							document.getElementById("favorite_div_" + favoriteName).style.display = "none";
							if (expendData.indexOf(favoriteName) == -1) {
								expendData.push(favoriteName);
							}
						}

						// 更新存储折叠信息
						var settings_favoriteList_extend = {
							item: table_Settings_Key_FavoriteList_Extend,
							value: expendData
						};

						update(table_Settings, settings_favoriteList_extend, () => { }, () => { });

					}, () => { });
				}

				// 收尾工作
				function finishFavorite() {
					// 更新按钮状态
					updateFavoriteListBtnStatus();

					setTimeout(function () {
						addFavoritesBtn.innerText = "完成 √";
					}, 250);
					setTimeout(function () {
						addFavoritesBtn.innerText = "加入收藏";
					}, 500);
				}
			}

			// 全部展开
			favoriteAllExtend.onclick = function () {
				var extendBtns = document.getElementsByClassName("favorite_extend");
				for (const i in extendBtns) {
					if (Object.hasOwnProperty.call(extendBtns, i)) {
						const btn = extendBtns[i];
						if (btn.innerHTML != "-") {
							btn.innerHTML = "-";
						}
					}
				}

				var favoriteItemsDiv = document.getElementsByClassName("favorite_items_div");
				for (const i in favoriteItemsDiv) {
					if (Object.hasOwnProperty.call(favoriteItemsDiv, i)) {
						const div = favoriteItemsDiv[i];
						if (div.style.display != "block") {
							div.style.display = "block";
						}
					}
				}

				// 清空折叠记录
				remove(table_Settings, table_Settings_Key_FavoriteList_Extend, () => { }, () => { });
			}

			// 全部折叠
			favoriteAllCollapse.onclick = function () {
				var extendBtns = document.getElementsByClassName("favorite_extend");
				for (const i in extendBtns) {
					if (Object.hasOwnProperty.call(extendBtns, i)) {
						const btn = extendBtns[i];
						if (btn.innerHTML != "+") {
							btn.innerHTML = "+";
						}
					}
				}

				var favoriteParentData = [];
				var favoriteItemsDiv = document.getElementsByClassName("favorite_items_div");
				for (const i in favoriteItemsDiv) {
					if (Object.hasOwnProperty.call(favoriteItemsDiv, i)) {
						const div = favoriteItemsDiv[i];
						if (div.style.display != "none") {
							div.style.display = "none";
						}
						favoriteParentData.push(div.id.replace("favorite_div_", ""));
					}
				}

				// 并更新存储全部的父级名称
				var settings_favoriteList_extend = {
					item: table_Settings_Key_FavoriteList_Extend,
					value: favoriteParentData
				};

				update(table_Settings, settings_favoriteList_extend, () => { }, () => { });
			}

			// 编辑
			var favoriteRemoveKeys = []; // 删除记录
			var favoriteDict = {}; // 当前存储记录
			favoriteEdit.onclick = function () {
				// 显示保存和取消按钮，隐藏编辑和清空按钮，以及展开折叠按钮和加入收藏按钮
				favoriteAllExtend.style.display = "none";
				favoriteAllCollapse.style.display = "none";
				favoriteSave.style.display = "block";
				favoriteCancel.style.display = "block";
				favoriteEdit.style.display = "none";
				favoriteClear.style.display = "none";
				addFavoritesBtn.style.display = "none";
				addFavoritesDisabledBtn.style.display = "block";

				// 隐藏备份和恢复按钮
				favoriteExport.style.display = "none";
				favoriteRecover.style.display = "none";

				// 隐藏收藏列表，方便用户取消时直接还原
				favoriteListDiv.style.display = "none";

				// 显示编辑列表, 读取本地收藏, 生成可删除的标签
				favoriteEditDiv.style.display = "block";

				var lastParentEn = '';
				var favoriteEditParentDiv;
				readAll(table_favoriteSubItems, (k, v) => {
					favoriteDict[k] = v;
					if (lastParentEn != v.parent_en) {
						// 新建父级标签
						lastParentEn = v.parent_en;
						var h4 = document.createElement("h4");
						h4.id = "favorite_edit_h4_" + v.parent_en;
						var h4text = document.createTextNode(v.parent_zh);
						h4.appendChild(h4text);
						var spanClear = document.createElement("span");
						spanClear.dataset.category = v.parent_en;
						spanClear.classList.add("favorite_edit_clear");
						var spanClearText = document.createTextNode("x");
						spanClear.appendChild(spanClearText);
						spanClear.addEventListener("click", function () {
							// 清空父项和子项
							removeEditorParent(v.parent_en);
						});
						h4.appendChild(spanClear);
						favoriteEditDiv.appendChild(h4);

						var div = document.createElement("div");
						div.id = "favorite_edit_div_" + v.parent_en;
						div.classList.add("favorite_edit_items_div");
						favoriteEditDiv.appendChild(div);

						favoriteEditParentDiv = document.getElementById(div.id);
					}

					var newEditorItem = document.createElement("span");
					newEditorItem.classList.add("f_edit_item");
					newEditorItem.id = "f_edit_item_" + v.sub_en;
					newEditorItem.dataset.item = v.sub_en;
					newEditorItem.dataset.parent_en = v.parent_en;
					newEditorItem.dataset.parent_zh = v.parent_zh;
					newEditorItem.title = v.sub_en;

					var editorItemText = document.createTextNode(v.sub_zh + " X");
					newEditorItem.appendChild(editorItemText);
					favoriteEditDiv.appendChild(newEditorItem);

					newEditorItem.addEventListener("click", function () {
						removeEditorItem(v.parent_en, v.sub_en);
					});

					favoriteEditParentDiv.appendChild(newEditorItem);


				}, () => { });

				// 删除父子项
				function removeEditorParent(parentEn) {
					var h4 = document.getElementById("favorite_edit_h4_" + parentEn);
					h4.parentNode.removeChild(h4);
					var div = document.getElementById("favorite_edit_div_" + parentEn);
					div.parentNode.removeChild(div);

					for (const key in favoriteDict) {
						if (Object.hasOwnProperty.call(favoriteDict, key)) {
							const item = favoriteDict[key];
							if (item.parent_en == parentEn && favoriteRemoveKeys.indexOf(key) == -1) {
								favoriteRemoveKeys.push(key);
							}
						}
					}
				}

				// 删除子项
				function removeEditorItem(parentEn, subEn) {
					// 如果没有子项了，就删除包裹的div，以及对应的标题h4
					var item = document.getElementById("f_edit_item_" + subEn);
					var editDiv = item.parentNode;
					item.parentNode.removeChild(item);

					if (editDiv.childNodes.length == 0) {
						editDiv.parentNode.removeChild(editDiv);
						var h4 = document.getElementById("favorite_edit_h4_" + parentEn);
						h4.parentNode.removeChild(h4);
					}

					var key = `${parentEn}:${subEn}`;
					if (favoriteRemoveKeys.indexOf(key) == -1) {
						favoriteRemoveKeys.push(key);
					}
				}

			}

			// 更新收藏模块按钮的显示隐藏
			function updateFavoriteListBtnStatus() {
				var favoriteItems = favoriteListDiv.querySelectorAll("span");
				if (favoriteItems.length == 0) {
					favoriteAllExtend.style.display = "none";
					favoriteAllCollapse.style.display = "none";
					favoriteEdit.style.display = "none";
					favoriteClear.style.display = "none";
					favoriteSave.style.display = "none";
					favoriteCancel.style.display = "none";
					favoriteExport.style.display = "none";
				}
				else {
					favoriteAllExtend.style.display = "block";
					favoriteAllCollapse.style.display = "block";
					favoriteEdit.style.display = "block";
					favoriteClear.style.display = "block";
					favoriteExport.style.display = "block";
				}
			}

			// 退出编辑模式，先改变按钮样式
			function editToFavoriteBtnStatus() {
				// 是否允许加入收藏
				if (checkDictNull(searchItemDict)) {
					addFavoritesBtn.style.display = "none";
					addFavoritesDisabledBtn.style.display = "block";
				}
				else {
					addFavoritesBtn.style.display = "block";
					addFavoritesDisabledBtn.style.display = "none";
				}

				// 更新收藏模块按钮的显示隐藏
				updateFavoriteListBtnStatus();

				// 隐藏保存和取消按钮
				favoriteSave.style.display = "none";
				favoriteCancel.style.display = "none";

				// 显示恢复按钮
				favoriteRecover.style.display = "block";
			}

			// 退出编辑模式
			function editToFavorite() {
				editToFavoriteBtnStatus();

				// 显示收藏列表
				favoriteListDiv.style.display = "block";

				// 隐藏并清空收藏编辑列表
				favoriteEditDiv.style.display = "none";
				favoriteEditDiv.innerHTML = "";
			}

			// 保存
			favoriteSave.onclick = function () {
				// 编辑删除
				var removeTotalCount = favoriteRemoveKeys.length;
				var removeIndex = 0;
				for (const i in favoriteRemoveKeys) {
					if (Object.hasOwnProperty.call(favoriteRemoveKeys, i)) {
						const removeKey = favoriteRemoveKeys[i];
						remove(table_favoriteSubItems, removeKey, () => { removeIndex++; }, () => { removeIndex++; });
					}
				}

				var t = setInterval(() => {
					if (removeTotalCount == removeIndex) {
						t && clearInterval(t);
						// 更新收藏折叠
						updateFavoriteExtend();
					}
				}, 50);

				// 获取折叠菜单，然后依次从收藏表取一条数据，看能否找到，找不到一条就删掉折叠菜单
				function updateFavoriteExtend() {
					read(table_Settings, table_Settings_Key_FavoriteList_Extend, result => {
						if (result && result.value) {
							var delArray = [];
							var extendArray = result.value;
							var foundTotalCount = extendArray.length;
							var foundIndex = 0;
							for (const i in extendArray) {
								if (Object.hasOwnProperty.call(extendArray, i)) {
									const parentEn = extendArray[i];
									readByIndex(table_favoriteSubItems, table_favoriteSubItems_index_parentEn, parentEn, result => {
										foundIndex++;
									}, () => {
										// 没找到
										delArray.push(parentEn);
										foundIndex++;
									});
								}
							}

							var t = setInterval(() => {
								if (foundTotalCount == foundIndex) {
									t && clearInterval(t);

									// 更新折叠数据
									var newExtendArray = getDiffSet(extendArray, delArray);
									var settings_favoriteList_extend = {
										item: table_Settings_Key_FavoriteList_Extend,
										value: newExtendArray
									};
									update(table_Settings, settings_favoriteList_extend, () => {
										// 重新生成收藏列表
										reBuildFavoriteList();
									}, () => {
									});
								}
							}, 50);
						} else {
							// 重新生成收藏列表
							reBuildFavoriteList();
						}
					}, () => { });
				}


				function reBuildFavoriteList() {
					// 清空收藏列表，根据编辑生成收藏列表
					favoriteListDiv.innerHTML = "";

					// 生成收藏列表
					generalFavoriteListDiv(true, () => {
						// 编辑列表清空
						favoriteRemoveKeys = [];
						favoriteDict = {};

						// 设置收藏折叠
						setFavoriteExpend();

						// 退出编辑模式
						editToFavorite();
					});

				}
			}

			// 生成收藏列表、包含各种子项点击事件
			function generalFavoriteListDiv(isUpdateFavoriteHtml, func_compelete) {
				// 读取收藏表，生成 页面html
				var favoritesListHtml = ``;
				var lastParentEn = ``;
				readAll(table_favoriteSubItems, (k, v) => {
					if (v.parent_en != lastParentEn) {
						if (lastParentEn != '') {
							favoritesListHtml += `</div>`;
						}
						lastParentEn = v.parent_en;
						// 新建父级
						favoritesListHtml += `<h4 id="favorite_h4_${v.parent_en}">${v.parent_zh}<span data-category="${v.parent_en}"
                class="favorite_extend">-</span></h4>`;
						favoritesListHtml += `<div id="favorite_div_${v.parent_en}" class="favorite_items_div">`;
					}

					// 添加子级
					favoritesListHtml += `<span class="c_item c_item_favorite" title="[${v.sub_en}] ${v.sub_desc}" data-item="${v.sub_en}" 
                    data-parent_en="${v.parent_en}" data-parent_zh="${v.parent_zh}">${v.sub_zh}</span>`;
				}, () => {
					// 读完后操作
					if (favoritesListHtml != ``) {
						favoritesListHtml += `</div>`;
					}

					// 页面附加Html
					favoriteListDiv.innerHTML = favoritesListHtml;

					// 小项添加点击事件
					favoriteItemsClick();

					// 折叠菜单添加点击事件
					favoriteExtendClick();

					// 存储收藏Html
					if (isUpdateFavoriteHtml) {
						saveFavoriteListHtml(favoritesListHtml);
					}

					func_compelete();
				})
			}

			// 取消
			favoriteCancel.onclick = editToFavorite;

			// 清空
			favoriteClear.onclick = function () {
				var confirmResult = confirm("是否清空本地收藏?");
				if (confirmResult) {
					favoriteListDiv.innerHTML = "";
					// 清空收藏数据
					clearTable(table_favoriteSubItems, () => { });

					// 清空收藏折叠
					remove(table_Settings, table_Settings_Key_FavoriteList_Extend, () => { }, () => { });

					// 更新收藏按钮
					updateFavoriteListBtnStatus();
				}
			}

			// 备份
			favoriteExport.onclick = function () {
				var data = {};
				var count = 0;
				readAll(table_favoriteSubItems, (k, v) => {
					data[k] = v;
					count++;
				}, () => {
					if (count == 0) {
						alert("导出前，请先收藏标签");
						return;
					}

					var result = {
						count,
						data
					};

					func_eh_ex(() => {
						saveJSON(result, `EH收藏数据备份_${getCurrentDate(2)}.json`);
					}, () => {
						saveJSON(result, `EX收藏数据备份_${getCurrentDate(2)}.json`);
					});
				});
			}

			// 恢复
			favoriteRecover.onclick = function () {
				favoriteUploadFiles.click();
			}

			// 上传
			favoriteUploadFiles.onchange = function () {
				var resultFile = favoriteUploadFiles.files[0];
				if (resultFile) {
					var reader = new FileReader();
					reader.readAsText(resultFile, 'UTF-8');

					reader.onload = function (e) {
						var fileContent = e.target.result;

						// 判断是旧版本收藏列表，还是新版本收藏列表
						var favoriteDb = JSON.parse(fileContent);
						if (favoriteDb.data) {
							// 检查数据完整性
							if (favoriteDb.count == 0 || checkDictNull(favoriteDb.data)) {
								alert('导入失败，备份数据为空');
								return;
							}

							// 清空收藏列表数据
							clearTable(table_favoriteSubItems, () => {
								// 清空收藏列表
								favoriteListDiv.innerHTML = "";
								// 重新生成
								firstUpdateFavoriteSubItems(favoriteDb.data, favoriteDb.count);
							});

						} else {
							if (checkDictNull(favoriteDb)) {
								alert('导入失败，备份数据为空');
								return;
							}


							// 清空收藏列表数据
							clearTable(table_favoriteSubItems, () => {
								// 清空收藏列表
								favoriteListDiv.innerHTML = "";
								// 重新生成收藏列表
								reBuildFavoriteByOldData(favoriteDb);
							});
						}

						// 上传置空
						favoriteUploadFiles.value = "";
					}
				}
			}

			//#endregion



			// TODO 输入框搜索，加上本地收藏的检索（自定义模块）

			// TODO 读取转换本地收藏数据，更新并生成本地收藏，包含事件

			// 生成收藏列表，包含事件

			// 数据同步

		});
	})
}

//#endregion





