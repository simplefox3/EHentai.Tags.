// ==UserScript==
// @name         ExHentai 中文标签助手
// @namespace    ExHentai 中文标签助手_DYZYFTS
// @license		 MIT
// @compatible  firefox >= 60
// @compatible  edge >= 16
// @compatible  chrome >= 61
// @compatible  safari >= 11
// @compatible  opera >= 48
// @version      3.3.0
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
	var url = `http://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dj=1&dt=t&q=${text}`;
	httpRequest.open("GET", url, true);
	httpRequest.send();

	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			var json = JSON.parse(httpRequest.responseText);
			func(json);
		}
	}
}

// 展开折叠动画 (下上)
var slideTimer = null;
function slideDown(element, realHeight, speed, func) {
	clearInterval(slideTimer);
	var h = 0;
	slideTimer = setInterval(function () {
		// 当目标高度与实际高度小于10px时，以1px的速度步进
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

// 展开折叠动画 (右左)
var slideTimer2 = null;
function slideRight(element, realWidth, speed, func) {
	clearInterval(slideTimer2);
	var w = 0;
	slideTimer2 = setInterval(function () {
		// 当目标宽度与实际宽度小于10px, 以 1px 的速度步进
		var step = (realWidth - w) / 10;
		step = Math.ceil(step);
		w += step;
		if (Math.abs(realWidth - w) <= Math.abs(step)) {
			w = realWidth;
			element.style.width = `${realWidth}px`;
			func();
			clearInterval(slideTimer2);
		} else {
			element.style.width = `${w}px`;
		}
	}, speed);
}
function slideLeft(element, speed, func) {
	clearInterval(slideTimer2);
	slideTimer2 = setInterval(function () {
		var step = (0 - element.clientWidth) / 10;
		step = Math.floor(step);
		element.style.width = `${element.clientWidth + step}px`;
		if (Math.abs(0 - element.clientWidth) <= Math.abs(step)) {
			element.style.width = "0px";
			func();
			clearInterval(slideTimer2);
		}
	})
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

// UrlEncode
function urlEncode(str) {
	str = (str + '').toString();

	return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
		replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

//#endregion

//#region step0.constDatas.js 数据字典

//#region 头部菜单

const fontMenusData = {
	"Front Page": "首页",
	"Watched": "偏好",
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

//#endregion

//#region 作品分类

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

//#region 预览下拉框

const dropData = {
	"Minimal": "标题 + 悬浮图",
	"Minimal+": "标题 + 悬浮图 + 账号收藏标签",
	"Compact": "标题 + 悬浮图 + 标签",
	"Extended": "标题 + 图片 + 标签",
	"Thumbnail": "标题 + 缩略图",
}

//#endregion

//#region 表头翻译字典

const thData = {
	"": "作品类型",
	"Published": "上传日期",
	"Title": "标题",
	"Uploader": "上传人员"
};

//#endregion

//#region 详情页右侧链接翻译

const gd5aDict = {
	"Report Gallery": "举报",
	"Archive Download": "档案下载",
	"Petition to Expunge": "申请删除",
	"Petition to Rename": "申请改名",
	"Show Gallery Stats": "画廊统计",
};

//#endregion

//#region localstroage 键名

// 版本号
const dbVersionKey = "categoryVersion";

// 全部列表Html
const dbCategoryListHtmlKey = "categoryListHtml";

// 全部列表折叠
const dbCategoryListExpendKey = "categoryListExpendArray";

// 本地收藏折叠
const dbFavoriteListExpendKey = "favoriteListExpendArray";

// 本地收藏列表
const dbFavoriteKey = "favoriteDict";

// 头部搜索菜单显示隐藏
const dbOldSearchDivVisibleKey = "oldSearchDivVisibleKey";

// 标签谷歌机翻_首页开关
const dbGoogleTranslateCategoryFontPage = "googleTranslateCategoryFontPage";

// 标签谷歌机翻_详情页开关
const dbGoogleTranslateCategoryDetail = "googleTranslateCategoryDetail";

// 消息通知页面同步
const dbSyncMessageKey = "dbSyncMessage";

//#endregion

//#region indexedDB 数据表、索引、键

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
const table_Settings_Key_Bg_ImgBase64 = "f_bgImageBase64";
const table_Settings_Key_Bg_Opacity = "f_bgOpacity";
const table_Settings_Key_Bg_Mask = "f_bgMask";
const table_Settings_key_FrontPageFontParentColor = "f_frontPageFontParentColor";
const table_Settings_key_FrontPageFontSubColor = "f_frontPageFontSubColor";
const table_Settings_Key_FrontPageFontSubHoverColor = "f_frontPageFontSubHoverColor";

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

// DetailParentItems 详情页父级表
const table_detailParentItems = "t_detailParentItems";
const table_detailParentItems_key = "row";

//#endregion

//#region 消息通知 dbSyncMessageKey 值

const sync_oldSearchTopVisible = 'syncOldSearchTopVisible';
const sync_categoryList = 'syncCategoryList';
const sync_favoriteList = 'syncFavoriteList';
const sync_categoryList_Extend = 'syncCategoryListExtend';
const sync_favoriteList_Extend = 'syncFavoriteListExtend';
const sync_googleTranslate_frontPage_title = 'syncGoogleTranslateFrontPageTitle';
const sync_googleTranslate_detailPage_title = 'syncGoogleTranslateDetailPageTitle';
const sync_setting_backgroundImage = 'syncSettingBackgroundImage';
const sync_setting_frontPageFontColor = 'syncSettingFrontPageFontColor';

//#endregion

//#region 背景图片、字体颜色默认值

// 默认不透明度
const defaultSetting_Opacity = 0.5;
// 默认遮罩浓度
const defaultSetting_Mask = 0;

// 默认父级字体颜色 - ex
const defaultFontParentColor_EX = "#fadfc0";
// 默认子级字体颜色 - ex
const defaultFontSubColor_EX = "#f5cc9c";
// 默认子级悬浮颜色 - ex
const defaultFontSubHoverColor_EX = "#ffd700";
// 默认父级字体颜色 - eh
const defaultFontParentColor_EH = "#5c0d11";
// 默认子级字体颜色 - eh
const defaultFontSubColor_EH = "#5c0d11";
// 默认子级悬浮颜色 - eh
const defaultFontSubHoverColor_EH = "#ff4500";


//#endregion


//#endregion

//#region step0.localstorage.js localstorage 数据方法，迁入 indexdb，如无特殊需要，删除之前存储的数据

// 版本号数据 读取、删除
function getVersion() {
	return localStorage.getItem(dbVersionKey);
}
function removeVersion() {
	localStorage.removeItem(dbVersionKey);
}

// 全部列表数据 读取、删除
function getCategoryListHtml() {
	return localStorage.getItem(dbCategoryListHtmlKey);
}
function removeCategoryListHtml() {
	localStorage.removeItem(dbCategoryListHtmlKey);
}

// 折叠按钮位置 读取、删除
function getCategoryListExpend() {
	return JSON.parse(localStorage.getItem(dbCategoryListExpendKey));
}
function removeCategoryListExpend() {
	localStorage.removeItem(dbCategoryListExpendKey);
}

// 收藏列表数据 读取、删除
function getFavoriteDicts() {
	return JSON.parse(localStorage.getItem(dbFavoriteKey))
}
function removeFavoriteDicts() {
	localStorage.removeItem(dbFavoriteKey);
}

// 收藏列表折叠 读取、删除
function getFavoriteListExpend() {
	return JSON.parse(localStorage.getItem(dbFavoriteListExpendKey));
}
function removeFavoriteListExpend() {
	localStorage.removeItem(dbFavoriteListExpendKey);
}

// 头部搜索菜单显示隐藏开关
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
function getGoogleTranslateCategoryFontPage() {
	return localStorage.getItem(dbGoogleTranslateCategoryFontPage);
}
function removeGoogleTranslateCategoryFontPage() {
	localStorage.removeItem(dbGoogleTranslateCategoryFontPage);
}

// 标签谷歌机翻_详情页开关
function getGoogleTranslateCategoryDetail() {
	return localStorage.getItem(dbGoogleTranslateCategoryDetail);
}
function removeGoogleTranslateCategoryDetail() {
	localStorage.removeItem(dbGoogleTranslateCategoryDetail);
}

// 消息通知页面同步
function getDbSyncMessage() {
	return localStorage.getItem(dbSyncMessageKey);
}
function setDbSyncMessage(msg) {
	removeDbSyncMessage();
	localStorage.setItem(dbSyncMessageKey, msg);
}
function removeDbSyncMessage() {
	localStorage.removeItem(dbSyncMessageKey);
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

//#region step1.1.styleInject.js 样式注入
func_eh_ex(() => {
	// e-hentai 样式 eh.css
	const category_style = `#searchbox #data_update_tip,
	#gd2 #data_update_tip,
	.t_popular_toppane #data_update_tip {
		position: absolute;
		width: 100px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		vertical-align: middle;
		font-size: 10px;
		border: 1px solid #5c0d12;
		margin-top: -1px;
		margin-left: -1px;
		background-color: #edebdf;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		display: none;
	}
	
	#searchbox #data_update_tip {
		top: 0;
		left: 0;
	}
	
	#gd2 #data_update_tip {
		top: 2px;
		right: 15px;
	}
	
	.t_popular_toppane {
		padding: 10px 0;
	}
	
	.t_popular_dms div select {
		margin-top: -6px;
	}
	
	.t_popular_toppane #data_update_tip {
		top: 16px;
		left: 180px;
	}
	
	
	#searchbox #div_fontColor_btn,
	#searchbox #div_background_btn,
	#searchbox #div_top_visible_btn {
		position: absolute;
		top: 0;
		width: 70px;
		height: 20px;
		line-height: 20px;
		background-color: #e3e0d1;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		font-size: 10px;
		border: 1px solid #5c0d12;
		margin-top: -1px;
		margin-right: -1px;
	}
	
	#searchbox #div_fontColor_btn {
		right: 140px;
	}
	
	#searchbox #div_background_btn {
		right: 70px;
	}
	
	#searchbox #div_top_visible_btn {
		right: 0;
	}
	
	#searchbox #div_fontColor_btn:hover,
	#searchbox #div_background_btn:hover,
	#searchbox #div_top_visible_btn:hover {
		background-color: #5c0d12a1;
		color: #e3e0d1;
	}
	
	#div_ee8413b2 {
		padding-right: 3px;
		text-align: left;
		margin-top: 10px;
		position: relative;
		z-index: 3;
		background-color: #e3e0d1;
	}
	
	#div_ee8413b2 #category_loading_div{
		height: 527px;
		width: 100%;
		line-height: 527px;
		text-align: center;
		font-size: 20px;
	}
	
	#div_ee8413b2_bg::before {
		background-size: 100%;
		opacity: 0.5;
	}
	
	#div_ee8413b2_bg {
		z-index: -9999;
		overflow: hidden;
		position: absolute;
		width: 100%;
		height: 100%;
	}
	
	#div_ee8413b2_bg::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		filter: blur(2px);
	
	}
	
	#div_ee8413b2 #background_form,
	#div_ee8413b2 #frontPage_listFontColor {
		border: 1px solid #5c0d12;
		width: 340px;
		height: 270px;
		background-color: #e3e0d1;
		position: absolute;
		color: #5c0d12;
		padding-top: 30px;
		display: none;
	}
	
	#div_ee8413b2 #background_form {
		left: calc(50% - 170px);
		top: 100px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor {
		left: calc(50% - 255px);
		top: 190px;
	}
	
	#div_ee8413b2 #background_form #background_form_top,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_top {
		height: 30px;
		width: 310px;
		position: absolute;
		top: 0;
		cursor: move;
	}
	
	#div_ee8413b2 #background_form #bg_upload_file {
		display: none;
	}
	
	#div_ee8413b2 #background_form #background_form_close,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close {
		float: right;
		cursor: pointer;
		text-align: center;
		border-left: 1px solid black;
		border-bottom: 1px solid black;
		width: 30px;
		height: 30px;
		line-height: 30px;
		position: absolute;
		right: 0;
		top: 0;
		font-size: 17px;
		color: #5c0d12;
	}
	
	#div_ee8413b2 #background_form .background_form_item,
	#div_ee8413b2 #frontPage_listFontColor .frontPage_listFontColor_item {
		padding: 15px 0 15px 40px;
		min-height: 30px;
	}
	
	#div_ee8413b2 #background_form label,
	#div_ee8413b2 #frontPage_listFontColor label {
		float: left;
		height: 30px;
		line-height: 30px;
		min-width: 90px;
	}
	
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #background_form #bgUploadBtn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		border: 1px solid black;
		width: 60px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		padding: 0 10px;
		background-color: #3a3939;
		cursor: pointer;
		float: left;
		color: #e3e0d1;
	}
	
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn {
		background-color: darkred;
		margin-right: 8px;
	}
	
	#div_ee8413b2 #background_form #bgImg_clear_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn:hover {
		background-color: red;
	}
	
	
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn {
		background-color: darkgreen;
		margin-right: 8px;
	}
	
	#div_ee8413b2 #background_form #bgImg_save_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn:hover {
		background-color: green;
	}
	
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		background-color: darkslateblue;
	}
	
	#div_ee8413b2 #background_form #bgImg_cancel_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #bgImg_cancel_btn:hover {
		background-color: slateblue;
	}
	
	#div_ee8413b2 #background_form #bgUploadBtn {
		width: 100px;
		margin-left: 5px;
		background-color: #5c0d12;
	}
	
	#div_ee8413b2 #background_form #background_form_close:hover,
	#div_ee8413b2 #background_form #bgUploadBtn:hover,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close:hover {
		background-color: #5c0d12a1;
		color: #e3e0d1;
	}
	
	#div_ee8413b2 #background_form #opacity_range,
	#div_ee8413b2 #background_form #mask_range,
	#div_ee8413b2 #frontPage_listFontColor #parent_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color {
		float: left;
	}
	
	#div_ee8413b2 #background_form #opacity_range,
	#div_ee8413b2 #background_form #mask_range {
		height: 27px;
		margin-right: 10px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor #parent_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color {
		height: 30px;
		width: 80px;
		margin: 0 12px;
	}
	
	#div_ee8413b2 #background_form #opacity_val,
	#div_ee8413b2 #background_form #mask_val,
	#div_ee8413b2 #frontPage_listFontColor #parent_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color_val {
		float: left;
		height: 30px;
		line-height: 30px;
		text-align: center;
	}
	
	#div_ee8413b2 #background_form #opacity_val,
	#div_ee8413b2 #background_form #mask_val {
		width: 50px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor #parent_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color_val {
		width: 80px;
	}
	
	
	#div_ee8413b2 #background_form #background_form_close,
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #background_form #bgUploadBtn,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#div_ee8413b2 #search_wrapper {
		width: calc(100% - 20px);
		min-height: 50px;
		border: 1px solid #5c0d12;
		margin: 0 auto;
		padding: 10px;
	}
	
	#div_ee8413b2 #search_wrapper #search_close {
		border: 1px solid #5c0d12;
		border-left: 0;
		float: left;
		margin-right: -11px;
		width: 0;
		height: 48px;
		line-height: 42px;
		text-align: center;
		font-size: 20px;
		cursor: pointer;
		overflow: hidden;
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
		margin: 3px 3px 3px 10px;
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
		background-color: #5c0d12;
		color: #e3e0d1;
	}
	
	#div_ee8413b2 #category_all_div #category_editor,
	#div_ee8413b2 #category_all_div #category_list {
		display: none;
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
		font-size: 15px;
		padding: 5px;
		font-weight: bold;
		cursor: pointer;
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
	
	#div_ee8413b2 #search_top #search_close,
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
	
	#div_ee8413b2 #category_loading_div,
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
		background-color: #5c0d12a1;
		color: #e3e0d1;
	}
	
	#div_ee8413b2 #category_list .category_extend:hover,
	#div_ee8413b2 #favorites_list .favorite_extend:hover,
	#div_ee8413b2 #favorites_edit_list .favorite_edit_clear:hover,
	#div_ee8413b2 #category_list .c_item:hover,
	#div_ee8413b2 #favorites_list .c_item:hover {
		transform: scale(2);
	}
	
	#dms #googleTranslateDiv,
	.t_popular_toppane #googleTranslateDiv {
		float: left;
		background-color: #edebdf;
		padding: 2px 3px 6px 7px;
		margin-left: 10px;
		width: 120px;
		position: absolute;
		border: 1px solid #8d8d8d;
		border-radius: 3px;
	}
	
	#dms #googleTranslateDiv {
		margin-top: -13px;
	}
	
	.t_popular_toppane #googleTranslateDiv {
		margin-top: -30px;
	}
	
	#dms #translateLabel,
	.t_popular_toppane #translateLabel {
		padding-left: 5px;
		font-weight: bold;
		font-size: 13px;
		padding-left: 2px;
	}
	
	#dms,
	#dms #googleTranslateCheckbox,
	#dms #translateLabel,
	.t_popular_toppane #googleTranslateDiv,
	.t_popular_toppane #translateLabel {
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
	#div_ee8413b2_detail_searchBtn:hover,
	.t_popular_toppane #googleTranslateDiv:hover {
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
	
	.glname table td.tc,
	#taglist table td.tc {
		min-width: 50px;
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
	}
	
	table .gt,
	table .gtl,
	table .gtw {
		height: 18px;
		line-height: 18px;
	}
	
	.headMenu_check {
		border-top: 2px solid #070101;
		padding-top: 6px !important;
		margin-top: -8px;
	}`;
	styleInject(category_style);
}, () => {
	// exhentai 样式 ex.css
	const category_style = `#searchbox #data_update_tip,
	#gd2 #data_update_tip,
	.t_popular_toppane #data_update_tip {
		position: absolute;
		width: 100px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		vertical-align: middle;
		font-size: 10px;
		background-color: #34353b;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		display: none;
	}
	
	#searchbox #data_update_tip {
		top: 0;
		left: 0;
	}
	
	#gd2 #data_update_tip {
		top: 2px;
		right: 15px;
	}
	
	.t_popular_toppane {
		padding: 10px 0;
	}
	
	.t_popular_dms div select {
		margin-top: -6px;
	}
	
	.t_popular_toppane #data_update_tip {
		top: 16px;
		left: 180px;
	}
	
	#searchbox #div_fontColor_btn,
	#searchbox #div_background_btn,
	#searchbox #div_top_visible_btn {
		position: absolute;
		top: 0;
		width: 70px;
		height: 20px;
		line-height: 20px;
		background-color: #34353b;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		font-size: 10px;
	}
	
	#searchbox #div_fontColor_btn {
		right: 140px;
	}
	
	#searchbox #div_background_btn {
		right: 70px;
	}
	
	#searchbox #div_top_visible_btn {
		right: 0;
	}
	
	#searchbox #div_fontColor_btn:hover,
	#searchbox #div_background_btn:hover,
	#searchbox #div_top_visible_btn:hover {
		background-color: #43464e;
	}
	
	#div_ee8413b2 {
		padding-right: 3px;
		text-align: left;
		margin-top: 10px;
		position: relative;
		z-index: 3;
		background-color: #40454B;
	}
	
	#div_ee8413b2 #category_loading_div {
		height: 527px;
		width: 100%;
		line-height: 527px;
		text-align: center;
		font-size: 20px;
	}
	
	#div_ee8413b2_bg::before {
		background-size: 100%;
		opacity: 0.5;
	}
	
	#div_ee8413b2_bg {
		z-index: -9999;
		overflow: hidden;
		position: absolute;
		width: 100%;
		height: 100%;
	}
	
	#div_ee8413b2_bg::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		filter: blur(2px);
	
	}
	
	
	#div_ee8413b2 #background_form,
	#div_ee8413b2 #frontPage_listFontColor {
		border: 1px solid black;
		width: 340px;
		height: 270px;
		background-color: #40454b;
		position: absolute;
		color: white;
		padding-top: 30px;
		display: none;
	}
	
	#div_ee8413b2 #background_form {
		left: calc(50% - 170px);
		top: 100px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor {
		left: calc(50% - 255px);
		top: 190px;
	}
	
	#div_ee8413b2 #background_form #background_form_top,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_top {
		height: 30px;
		width: 310px;
		position: absolute;
		top: 0;
		cursor: move;
	}
	
	#div_ee8413b2 #background_form #bg_upload_file {
		display: none;
	}
	
	#div_ee8413b2 #background_form #background_form_close,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close {
		float: right;
		cursor: pointer;
		text-align: center;
		border-left: 1px solid black;
		border-bottom: 1px solid black;
		width: 30px;
		height: 30px;
		line-height: 30px;
		position: absolute;
		right: 0;
		top: 0;
		font-size: 17px;
	}
	
	#div_ee8413b2 #background_form .background_form_item,
	#div_ee8413b2 #frontPage_listFontColor .frontPage_listFontColor_item {
		padding: 15px 0 15px 40px;
		min-height: 30px;
	}
	
	#div_ee8413b2 #background_form label,
	#div_ee8413b2 #frontPage_listFontColor label {
		float: left;
		height: 30px;
		line-height: 30px;
		min-width: 90px;
	}
	
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #background_form #bgUploadBtn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		border: 1px solid black;
		width: 60px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		padding: 0 10px;
		background-color: #3a3939;
		cursor: pointer;
		float: left;
	}
	
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn {
		background-color: darkred;
		margin-right: 8px;
	}
	
	#div_ee8413b2 #background_form #bgImg_clear_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn:hover {
		background-color: red;
	}
	
	
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn {
		background-color: darkgreen;
		margin-right: 8px;
	}
	
	#div_ee8413b2 #background_form #bgImg_save_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn:hover {
		background-color: green;
	}
	
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		background-color: darkslateblue;
	}
	
	#div_ee8413b2 #background_form #bgImg_cancel_btn:hover,
	#div_ee8413b2 #frontPage_listFontColor #bgImg_cancel_btn:hover {
		background-color: slateblue;
	}
	
	#div_ee8413b2 #background_form #bgUploadBtn {
		width: 100px;
		margin-left: 5px;
	}
	
	#div_ee8413b2 #background_form #background_form_close:hover,
	#div_ee8413b2 #background_form #bgUploadBtn:hover,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close:hover {
		background-color: #4e4e4e;
	}
	
	#div_ee8413b2 #background_form #opacity_range,
	#div_ee8413b2 #background_form #mask_range,
	#div_ee8413b2 #frontPage_listFontColor #parent_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color {
		float: left;
	}
	
	#div_ee8413b2 #background_form #opacity_range,
	#div_ee8413b2 #background_form #mask_range {
		height: 27px;
		margin-right: 10px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor #parent_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_color,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color {
		height: 30px;
		width: 80px;
		margin: 0 12px;
	}
	
	#div_ee8413b2 #background_form #opacity_val,
	#div_ee8413b2 #background_form #mask_val,
	#div_ee8413b2 #frontPage_listFontColor #parent_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color_val {
		float: left;
		height: 30px;
		line-height: 30px;
		text-align: center;
	}
	
	#div_ee8413b2 #background_form #opacity_val,
	#div_ee8413b2 #background_form #mask_val {
		width: 50px;
	}
	
	#div_ee8413b2 #frontPage_listFontColor #parent_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_color_val,
	#div_ee8413b2 #frontPage_listFontColor #sub_hover_color_val {
		width: 80px;
	}
	
	
	#div_ee8413b2 #background_form #background_form_close,
	#div_ee8413b2 #background_form #bgImg_save_btn,
	#div_ee8413b2 #background_form #bgImg_clear_btn,
	#div_ee8413b2 #background_form #bgImg_cancel_btn,
	#div_ee8413b2 #background_form #bgUploadBtn,
	#div_ee8413b2 #frontPage_listFontColor #frontPage_listFontColor_close,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_clear_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_save_btn,
	#div_ee8413b2 #frontPage_listFontColor #listFontColor_cancel_btn {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#div_ee8413b2 #search_wrapper {
		width: calc(100% - 20px);
		min-height: 50px;
		border: 1px solid black;
		margin: 0 auto;
		padding: 10px;
		color: #F1F1F1;
	}
	
	#div_ee8413b2 #search_wrapper #search_close {
		border: 1px solid #f1f1f1;
		border-left: 0;
		float: left;
		margin-right: -11px;
		width: 0;
		height: 48px;
		line-height: 42px;
		text-align: center;
		font-size: 20px;
		cursor: pointer;
		overflow: hidden;
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
		margin: 3px 3px 3px 10px;
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
		border: 1px solid #fadfc0;
		width: 13px;
		display: inline-block;
		text-align: center;
		line-height: 13px;
		height: 13px;
		font-size: 12px;
		cursor: pointer;
		color: #fadfc0;
	}
	
	.chooseTab {
		background-color: #7b7e85c2;
	}
	
	#div_ee8413b2 #category_all_div #category_editor,
	#div_ee8413b2 #category_all_div #category_list {
		display: none;
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
		font-size: 15px;
		padding: 5px;
		cursor: pointer;
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
	
	#div_ee8413b2 #search_top #search_close,
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
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar-track {
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
	
	#div_ee8413b2 #category_loading_div,
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
		transform: scale(2);
	}
	
	#dms #googleTranslateDiv,
	.t_popular_toppane #googleTranslateDiv {
		float: left;
		background-color: #34353b;
		padding: 2px 3px 6px 7px;
		margin-left: 10px;
		width: 120px;
		position: absolute;
		border: 1px solid #8d8d8d;
		border-radius: 3px;
	}
	
	#dms #googleTranslateDiv {
		margin-top: -13px;
	}
	
	.t_popular_toppane #googleTranslateDiv {
		margin-top: -30px;
	}
	
	#dms #translateLabel,
	.t_popular_toppane #translateLabel {
		padding-left: 5px;
		font-weight: bold;
		font-size: 13px;
		padding-left: 2px;
	}
	
	#dms,
	#dms #googleTranslateCheckbox,
	#dms #translateLabel,
	.t_popular_toppane #googleTranslateDiv,
	.t_popular_toppane #translateLabel {
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
	#div_ee8413b2_detail_searchBtn:hover,
	.t_popular_toppane #googleTranslateDiv:hover {
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
	
	.glname table td.tc,
	#taglist table td.tc {
		min-width: 50px;
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
	}
	
	table .gt,
	table .gtl,
	table .gtw {
		height: 18px;
		line-height: 18px;
	}
	
	.headMenu_check {
		border-top: 2px solid #f1f1f1;
		padding-top: 6px !important;
		margin-top: -8px;
	}
	
	.t_favorite_ido .nosel {
		border-radius: 10px;
		margin-top: 20px !important;
		padding-top: 20px;
		padding-left: 30px;
		height: 65px;
		border: 1px solid #C2C1C1;
	}
	
	.t_favorite_ido .nosel .fp:last-child {
		background-color: #4f535b;
		top: -87px;
	}`;
	styleInject(category_style);
});

//#endregion

//#region step1.2.translateTopMenu.js 头部菜单翻译

function topMenuTranslateZh() {
	var menus = document.getElementById("nb").querySelectorAll("a");
	var pathname = window.location.pathname;
	var isFoundCheck = false;
	for (const i in menus) {
		if (Object.hasOwnProperty.call(menus, i)) {
			const a = menus[i];
			if ((!isFoundCheck) &&
				(
					(pathname == '/' && a.innerText == 'Front Page') ||
					(pathname == '/watched' && a.innerText == 'Watched') ||
					(pathname == '/popular' && a.innerText == 'Popular') ||
					(pathname == '/torrents.php' && a.innerText == 'Torrents') ||
					(pathname == '/favorites.php' && a.innerText == 'Favorites') ||
					(pathname == '/home.php' && a.innerText == 'My Home') ||
					(pathname == '/toplist.php' && a.innerText == 'Toplists') ||
					(pathname == '/bounty.php' && a.innerText == 'Bounties') ||
					(pathname == '/news.php' && a.innerText == 'News') ||
					(pathname == '/uconfig.php' && a.innerText == 'Settings') ||
					(pathname == '/upld/manage' && a.innerText == 'My Uploads') ||
					(pathname == '/mytags' && a.innerText == 'My Tags')
				)) {
				a.parentNode.classList.add('headMenu_check');
				isFoundCheck = true;
			}

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

function indexDbInit(func_start_use) {
	if (request.readyState == "done") {
		db = request.result;
		func_start_use();
	} else {
		request.onsuccess = function () {
			db = request.result;
			func_start_use();
		}
	}
}

request.onerror = function (event) {
}

request.onupgradeneeded = function (event) {
	db = event.target.result;

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

	// FavoriteList 本地收藏表
	if (!db.objectStoreNames.contains(table_favoriteSubItems)) {
		var objectStore = db.createObjectStore(table_favoriteSubItems, { keyPath: table_favoriteSubItems_key });
		objectStore.createIndex(table_favoriteSubItems_index_parentEn, table_favoriteSubItems_index_parentEn, { unique: false });
	}

	// DetailParentItems 详情页父级表
	if (!db.objectStoreNames.contains(table_detailParentItems)) {
		var objectStore = db.createObjectStore(table_detailParentItems, { keyPath: table_detailParentItems_key });
	}
}

function read(tableName, key, func_success, func_error) {
	var transaction = db.transaction(tableName);
	var objectStore = transaction.objectStore(tableName);
	var request = objectStore.get(key);

	request.onerror = function (event) {
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
		func_success(event);
	}

	request.onerror = function (event) {
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
		func_success();
	}

	request.onerror = function (event) {
		func_error(event);
	}
}

function remove(tableName, key, func_success, func_error) {
	var request = db.transaction([tableName], 'readwrite')
		.objectStore(tableName)
		.delete(key);
	request.onsuccess = function (event) {
		func_success();
	}
	request.onerror = function (event) {
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
					update_func(json, version);
				});
			} else {
				local_func();
			}
		});
	}, error => {
	})
}

function ehTagDataInit(update_func, local_func) {
	// Ehtag 获取本地版本号
	read(table_Settings, table_Settings_key_EhTagVersion, localVersion => {
		getEhTagGitHubReleaseVersion(version => {
			// 和本地的版本号进行比较，如果不同就进行更新
			if (!localVersion || version != localVersion.value) {
				getEhTagTranslate(version, json => {
					update_func(json.data, version);
				});
			} else {
				local_func();
			}
		});

	}, error => {
	});
}

// 验证数据完整性
function checkDataIntact(func_compelete) {
	// 如果数据表数据为空，则清空存储数据

	var complete1 = false;
	var complete2 = false;
	var complete3 = false;
	var complete4 = false;
	var complete5 = false;

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

	checkTableEmpty(table_detailParentItems, () => {
		// 为空
		remove(table_Settings, table_Settings_key_EhTagVersion, () => { complete5 = true; }, () => { complete5 = true; });
	}, () => {
		// 存在数据
		complete5 = true;
	});

	var t = setInterval(() => {
		if (complete1 && complete2 && complete3 && complete4 && complete5) {
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
			var complete7 = false;
			var complete8 = false;
			var complete9 = false;
			var complete10 = false;
			var complete11 = false;

			var isFetishUpdate = false;
			var isEhTagUpdate = false;

			var updateDataTip = document.getElementById("data_update_tip");

			// 获取并更新恋物的父子项、父级信息，详情页父级信息
			fetishListDataInit((newData, newVersion) => {

				// 显示更新提示
				updateDataTip.style.display = "block";

				// 存在更新
				isFetishUpdate = true;

				// 直接清空存储库，然后批量添加，这样速度最快
				clearTable(table_fetishListSubItems, () => {
					complete1 = true;
					batchAdd(table_fetishListSubItems, table_fetishListSubItems_key, newData.data, newData.count, () => {
						complete2 = true;
					});
				});

				// 更新父级信息
				var settings_fetishList_parentEnArray = {
					item: table_Settings_key_FetishList_ParentEnArray,
					value: newData.parent_en_array
				};
				update(table_Settings, settings_fetishList_parentEnArray, () => { complete3 = true; }, () => { complete3 = true; });

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
						categoryFetishListHtml += `<span class="c_item c_item_fetish" data-item="${item.sub_en}" data-parent_en="${item.parent_en}" data-parent_zh="${item.parent_zh}" data-sub_desc="${item.sub_desc}" title="${item.sub_zh} [${item.sub_en}]&#10;&#13;${item.sub_desc}">${item.sub_zh}</span>`;
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
				update(table_Settings, settings_fetish_html, () => { complete4 = true; }, () => { complete4 = true; });

				// 更新版本号
				var settings_fetishList_version = {
					item: table_Settings_key_FetishListVersion,
					value: newVersion
				};
				update(table_Settings, settings_fetishList_version, () => { complete5 = true; }, () => { complete5 = true; });

			}, () => {
				complete1 = true;
				complete2 = true;
				complete3 = true;
				complete4 = true;
				complete5 = true;
			});

			// 如果 EhTag 版本更新，这尝试更新用户收藏（可能没有翻译过的标签进行翻译）
			// 获取并更新EhTag的父子项、父级信息
			ehTagDataInit((newData, newVersion) => {
				// 更新本地数据库 indexDB
				// 存储完成之后，更新版本号

				// 显示更新提示
				updateDataTip.style.display = "block";

				// 存在更新
				isEhTagUpdate = true;

				var psDict = {}; // 过滤适合的全部数据
				var psDictCount = 0;
				var parentEnArray = [];

				var detailDict = {};
				var detailDictCount = 0;

				for (const index in newData) {
					if (Object.hasOwnProperty.call(newData, index)) {
						// var example = { ps_en: "male:bo", search_key: "male,男性,bo,波", parent_en: "male", parent_zh: "男性", sub_en: "bo", sub_zh: "波", sub_desc: "波波" };

						const element = newData[index];
						var parent_en = element.namespace;
						if (parent_en == "rows") {
							// 详情页父级信息
							var parentItems = element.data;
							for (const key in parentItems) {
								if (Object.hasOwnProperty.call(parentItems, key)) {
									const parentItem = parentItems[key];
									detailDict[key] = { row: key, name: parentItem.name, desc: parentItem.intro };
									detailDictCount++;
								}
							}
							continue;
						}

						// 过滤重新分类
						if (parent_en == "reclass") continue;

						// 普通 EhTag 数据
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

				// 直接清空存储库，然后批量添加，这样速度最快
				clearTable(table_EhTagSubItems, () => {
					complete6 = true;
					batchAdd(table_EhTagSubItems, table_EhTagSubItems_key, psDict, psDictCount, () => {
						complete7 = true;
					});
				});

				// 批量添加详情页父级信息
				batchAdd(table_detailParentItems, table_detailParentItems_key, detailDict, detailDictCount, () => {
					complete8 = true;
				});

				var settings_ehTag_parentEnArray = {
					item: table_Settings_key_EhTag_ParentEnArray,
					value: parentEnArray
				};

				// 更新父级信息
				update(table_Settings, settings_ehTag_parentEnArray, () => { complete9 = true; }, () => { complete9 = true; });

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
						categoryEhTagHtml += `<span class="c_item c_item_ehTag" data-item="${item.sub_en}" data-parent_en="${item.parent_en}" data-parent_zh="${item.parent_zh}" data-sub_desc="${item.sub_desc}" title="${item.sub_zh} [${item.sub_en}]&#10;&#13;${item.sub_desc}">${item.sub_zh}</span>`;
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
				update(table_Settings, settings_ehTag_html, () => { complete10 = true; }, () => { complete10 = true; });

				// 更新版本号
				var settings_ehTag_version = {
					item: table_Settings_key_EhTagVersion,
					value: newVersion
				};
				update(table_Settings, settings_ehTag_version, () => { complete11 = true; }, () => { complete11 = true; });

			}, () => {
				complete6 = true;
				complete7 = true;
				complete8 = true;
				complete9 = true;
				complete10 = true;
				complete11 = true;
			});

			// 用户收藏更新
			function updateFavoriteList(func_end) {
				var favoriteUpdateDict = {};
				var favoriteUpdateCount = 0;
				var indexCount = 0;

				var isNewUpdate = false; // 是否存在更新的收藏数据
				readAll(table_favoriteSubItems, (k, v) => {
					if (v.sub_en == v.sub_zh) {
						favoriteUpdateDict[k] = v;
						favoriteUpdateCount++;
					}
				}, () => {
					if (favoriteUpdateCount > 0) {
						for (const ps_en in favoriteUpdateDict) {
							if (Object.hasOwnProperty.call(favoriteUpdateDict, ps_en)) {
								const item = favoriteUpdateDict[ps_en];
								read(table_EhTagSubItems, ps_en, result => {
									if (result) {
										if (result.sub_zh != item.sub_zh) {
											// 需要更新
											isNewUpdate = true;
											var updateFavorite = {
												parent_en: result.parent_en,
												parent_zh: result.parent_zh,
												ps_en: result.ps_en,
												sub_en: result.sub_en,
												sub_zh: result.sub_zh,
												sub_desc: result.sub_desc
											};
											update(table_favoriteSubItems, updateFavorite, () => { indexCount++; }, () => { indexCount++; });
										} else {
											indexCount++;
										}
									} else {
										indexCount++;
									}
								}, () => { indexCount++; });
							}
						}

						function getFavoriteListHtml(favoriteSubItems) {
							var favoritesListHtml = ``;
							var lastParentEn = ``;
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
									favoritesListHtml += `<span class="c_item c_item_favorite" title="${item.sub_zh} [${item.sub_en}]&#10;&#13;${item.sub_desc}" data-item="${item.sub_en}" 
                                                data-parent_en="${item.parent_en}" data-parent_zh="${item.parent_zh}" data-sub_desc="${item.sub_desc}">${item.sub_zh}</span>`;
								}
							}

							if (favoritesListHtml != ``) {
								favoritesListHtml += `</div>`;
							}

							return favoritesListHtml;
						}

						function saveFavoriteListHtml(favoritesListHtml, func_compelete) {
							var settings_favoriteList_html = {
								item: table_Settings_key_FavoriteList_Html,
								value: favoritesListHtml
							};

							update(table_Settings, settings_favoriteList_html, () => { func_compelete(); }, () => { });
						}

						var t1 = setInterval(() => {
							if (favoriteUpdateCount == indexCount) {
								t1 && clearInterval(t1);
								if (isNewUpdate) {
									// 收藏存在更新，需要更新收藏html，并通知其他页面更新
									var favoriteDict = {};
									readAll(table_favoriteSubItems, (k, v) => {
										favoriteDict[k] = v;
									}, () => {
										var favoritesListHtml = getFavoriteListHtml(favoriteDict);
										saveFavoriteListHtml(favoritesListHtml, () => {
											// 通知页面更新
											setDbSyncMessage(sync_favoriteList);
											func_end();
										});
									});
								} else {
									func_end();
								}
							}
						}, 50);
					} else {
						func_end();
					}
				});
			}

			var t = setInterval(() => {
				if (isFetishUpdate || isEhTagUpdate) {
					var step = 0;
					if (complete1) step += 10;
					if (complete2) step += 10;
					if (complete3) step += 10;
					if (complete4) step += 10;
					if (complete5) step += 5;
					if (complete6) step += 10;
					if (complete7) step += 10;
					if (complete8) step += 10;
					if (complete9) step += 10;
					if (complete10) step += 10;
					if (complete11) step += 5;
					updateDataTip.innerText = `词库升级中 ${step}%`;
				}

				if (complete1 && complete2 && complete3 && complete4 && complete5 && complete6 && complete7 && complete8 && complete9 && complete10 && complete11) {
					t && clearInterval(t);
					if (isFetishUpdate || isEhTagUpdate) {
						// 通知本地列表更新
						setDbSyncMessage(sync_categoryList);

						// 隐藏更新提示
						updateDataTip.innerText = `词库升级完成`;
						setTimeout(() => {
							updateDataTip.style.display = "none";
							updateDataTip.innerText = "词库升级中...";
						}, 500);
					}

					// 看看是否需要更新用户收藏表数据
					if (isEhTagUpdate) {
						updateFavoriteList(() => { func_compelete(); });
					} else {
						func_compelete();
					}
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
			}, () => { complete1 = true; });
		} else {
			complete1 = true;
		}


		// 头部搜索菜单显示隐藏开关，这个不需要删除
		var oldSearchDivVisible = getOldSearchDivVisible();
		if (oldSearchDivVisible != null) {
			read(table_Settings, table_Settings_key_OldSearchDiv_Visible, result => {
				var visibleBoolean = oldSearchDivVisible == 1;
				if (result && result.value == visibleBoolean) {
					complete2 = true;
				} else {
					// 更新
					var settings_oldSearchDivVisible = {
						item: table_Settings_key_OldSearchDiv_Visible,
						value: visibleBoolean
					};
					update(table_Settings, settings_oldSearchDivVisible, () => {
						complete2 = true;
					}, () => { complete2 = true; });
				}
			}, () => { complete2 = true; });
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
			}, () => { complete3 = true; });
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
			}, () => { complete4 = true; });
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
			}, () => { complete5 = true; });
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

//#endregion

//#region step3.1.frontTranslate.js 首页谷歌翻译

// 首页谷歌翻译：标签
function translateMainPageTitle() {
	var isChecked = document.getElementById("googleTranslateCheckbox").checked;

	// 更新存储
	var settings_translateFrontPageTitles = {
		item: table_Settings_key_TranslateFrontPageTitles,
		value: isChecked
	};
	update(table_Settings, settings_translateFrontPageTitles, () => {
		// 通知通知，翻译标题
		setDbSyncMessage(sync_googleTranslate_frontPage_title);
		translateMainPageTitleDisplay();
	}, () => { });
}

function translateMainPageTitleDisplay() {
	var isChecked = document.getElementById("googleTranslateCheckbox").checked;
	var titleDivs = document.getElementsByClassName("glink");
	if (isChecked) {
		// 翻译标题
		for (const i in titleDivs) {
			if (Object.hasOwnProperty.call(titleDivs, i)) {
				const div = titleDivs[i];
				if (div.dataset.translate) {
					// 已经翻译过
					div.innerText = div.dataset.translate;

				} else {
					// 需要翻译
					div.title = div.innerText;

					var encodeText = urlEncode(div.innerText);
					// 单条翻译
					getGoogleTranslate(encodeText, function (data) {
						var sentences = data.sentences;
						var longtext = '';
						for (const i in sentences) {
							if (Object.hasOwnProperty.call(sentences, i)) {
								const sentence = sentences[i];
								longtext += sentence.trans;
							}
						}

						div.innerText = longtext;
						div.dataset.translate = longtext;
					});
				}
			}
		}

	} else {
		// 显示原文
		for (const i in titleDivs) {
			if (Object.hasOwnProperty.call(titleDivs, i)) {
				const div = titleDivs[i];
				if (div.title) {
					div.innerText = div.title;
				}
			}
		}
	}
}

// 下拉列表翻译
function dropDownlistTranslate() {
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
}

// 表头翻译
function tableHeadTranslate() {
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
}

// 作品类型翻译
function bookTypeTranslate() {
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
}

// 表格标签翻译
function tableTagTranslate() {
	// 父项
	var tc = document.getElementsByClassName("tc");
	for (const i in tc) {
		if (Object.hasOwnProperty.call(tc, i)) {
			const item = tc[i];
			var cateEn = item.innerText.replace(":", "");
			read(table_detailParentItems, cateEn, result => {
				if (result) {
					item.innerText = `${result.name}: `;
				}
			}, () => { });
		}
	}

	// 父项:子项，偶尔出现单个子项
	var select = dms.querySelectorAll("select");
	var rightSelect = select[0];
	var gt = document.getElementsByClassName("gt");
	function translate(gt, i) {
		const item = gt[i];
		var ps_en = item.title;
		read(table_EhTagSubItems, ps_en, result => {
			if (result) {
				if (rightSelect.value == "e") {
					// 标题 + 图片 + 标签，单个子项
					item.innerText = result.sub_zh;
				} else {
					// 父子项
					item.innerText = `${result.parent_zh}:${result.sub_zh}`;
				}
				if (result.sub_desc) {
					item.title = `${item.title}\r\n${result.sub_desc}`;
				}
			} else {
				// 没有找到，翻译父项，子项保留
				if (rightSelect.value != "e") {
					var array = ps_en.split(":");
					if (array.length == 2) {
						var parent_en = array[0];
						var sub_en = array[1];
						read(table_detailParentItems, parent_en, result => {
							if (result) {
								item.innerText = `${result.name}:${sub_en}`;
								if (result.sub_desc) {
									item.title = `${item.title}\r\n${result.sub_desc}`;
								}
							}
						}, () => { });
					}
				}
			}
		}, () => { });
	}
	for (const i in gt) {
		if (Object.hasOwnProperty.call(gt, i)) {
			translate(gt, i);
		}
	}

	// 子项
	var gtl = document.getElementsByClassName("gtl");
	for (const i in gtl) {
		if (Object.hasOwnProperty.call(gtl, i)) {
			const item = gtl[i];
			var ps_en = item.title;
			read(table_EhTagSubItems, ps_en, result => {
				if (result) {
					item.innerText = result.sub_zh;
					if (result.sub_desc) {
						item.title = `${item.title}\r\n${result.sub_desc}`;
					}
				}
			}, () => { });

		}
	}
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

	// 翻译下拉菜单
	dropDownlistTranslate();

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
	translateLabel.innerText = "谷歌机翻 : 标题";

	translateDiv.appendChild(translateLabel);
	translateCheckbox.addEventListener("click", translateMainPageTitle);
	var dms = document.getElementById("dms");
	dms.insertBefore(translateDiv, dms.lastChild);

	// 读取是否选中
	read(table_Settings, table_Settings_key_TranslateFrontPageTitles, result => {
		if (result && result.value) {
			translateCheckbox.setAttribute("checked", true);
			translateMainPageTitleDisplay();
		}
	}, () => { });

	// 表头翻译
	tableHeadTranslate();

	// 作品类型翻译
	bookTypeTranslate();

	// 表格标签翻译
	tableTagTranslate();
}

//#endregion

//#region step3.2.frontPageTopStyle 首页头部搜索显示隐藏

// 添加样式和逻辑，从 localstroage 中读取显示隐藏
function frontPageTopStyleStep01() {
	// 调整头部样式
	var searchBoxDiv = document.getElementById("searchbox");
	searchBoxDiv.style.width = "auto";
	searchBoxDiv.style.border = "0";

	// 头部添加词库更新提示
	var dataUpdateDiv = document.createElement("div");
	dataUpdateDiv.id = "data_update_tip";
	var dataUpdateText = document.createTextNode("词库升级中...");
	dataUpdateDiv.appendChild(dataUpdateText);
	searchBoxDiv.appendChild(dataUpdateDiv);

	// 头部添加字体颜色按钮
	var fontColorDiv = document.createElement("div");
	fontColorDiv.id = "div_fontColor_btn";
	var fontColorText = document.createTextNode("字体颜色");
	fontColorDiv.appendChild(fontColorText);
	searchBoxDiv.appendChild(fontColorDiv);

	// 头部添加背景图片按钮
	var bgDiv = document.createElement("div");
	bgDiv.id = "div_background_btn";
	var bgText = document.createTextNode("背景图片");
	bgDiv.appendChild(bgText);
	searchBoxDiv.appendChild(bgDiv);

	// 头部显示隐藏按钮
	var topVisibleDiv = document.createElement("div");
	topVisibleDiv.id = "div_top_visible_btn";
	topVisibleDiv.addEventListener("click", topVisibleChange);
	searchBoxDiv.appendChild(topVisibleDiv);

	function topVisibleChange() {
		if (topVisibleDiv.innerText == "头部显示") {
			// 头部显示
			searchBoxDiv.children[0].style.display = "block";
			topVisibleDiv.innerText = "头部隐藏";
			setOldSearchDivVisible(1);

		} else {
			// 头部隐藏
			searchBoxDiv.children[0].style.display = "none";
			topVisibleDiv.innerText = "头部显示";
			setOldSearchDivVisible(0);
		}
	}

	// 读取头部是否隐藏，并应用到页面中
	var oldSearchDivVisible = getOldSearchDivVisible();
	if (oldSearchDivVisible == 0) {
		topVisibleDiv.innerText = "头部显示";
		searchBoxDiv.children[0].style.display = "none";
	} else {
		topVisibleDiv.innerText = "头部隐藏";
	}
}

// 从indexedDB 中读取隐藏折叠
function frontPageTopStyleStep02() {
	var searchBoxDiv = document.getElementById("searchbox");
	var topVisibleDiv = document.getElementById("div_top_visible_btn");

	var oldSearchDivVisible = getOldSearchDivVisible();
	if (oldSearchDivVisible == null) {
		// 尝试从 indexedDB 中读取配置，如果存在则说明 localstroage 配置丢失，需要补充，页面对应隐藏折叠
		read(table_Settings, table_Settings_key_OldSearchDiv_Visible, result => {
			if (result) {
				if (!result.value) {
					searchBoxDiv.children[0].style.display = "none";
				}
				setOldSearchDivVisible(result.value ? 1 : 0);
			}
		}, () => { });

	}

	// 添加按钮点击事件，用于将配置存储到 indexDB 中
	topVisibleDiv.addEventListener("click", () => {
		var settings_oldSearchDivVisible = {
			item: table_Settings_key_OldSearchDiv_Visible,
			value: topVisibleDiv.innerText == "头部隐藏"
		};
		update(table_Settings, settings_oldSearchDivVisible, () => {
			setDbSyncMessage(sync_oldSearchTopVisible);
		}, () => { });
	});
}

//#endregion

//#region step3.3.frontPageHtml.js 首页HTML 

// 首页代码
const category_html = `
<div id="div_ee8413b2_bg"></div>
<div id="search_wrapper">
	<div id="search_top">
		<div id="category_all_button">全部类别</div>
		<div id="category_favorites_button">本地收藏</div>
		<div id="search_close">↑</div>
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
			<div id="category_loading_div">💕 请等待一小会儿，马上就好 💕</div>
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
<div id="background_form">
	<div id="background_form_top"></div>
	<div id="background_form_close" title="关闭">X</div>
	<div class="background_form_item">
		<label>背景图片：</label>
		<input type="file" id="bg_upload_file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" />
		<div id="bgUploadBtn"> + 上传图片</div>
	</div>
	<div class="background_form_item">
		<label>不透明度：</label>
		<input id="opacity_range" type="range" max="1" min="0.1" id="range" step="0.1" value="0.5">
		<div id="opacity_val">0.5</div>
	</div>
	<div class="background_form_item">
		<label>模糊程度：</label>
		<input id="mask_range" type="range" max="100" min="0" id="range" step="0.1" value="0">
		<div id="mask_val">0</div>
	</div>
	<div class="background_form_item">
		<div id="bgImg_clear_btn">重置 !</div>
		<div id="bgImg_save_btn">保存 √</div>
		<div id="bgImg_cancel_btn">取消 X</div>
	</div>
</div>
<div id="frontPage_listFontColor">
	<div id="frontPage_listFontColor_top"></div>
	<div id="frontPage_listFontColor_close" title="关闭">X</div>
	<div class="frontPage_listFontColor_item">
		<label>父级字体颜色：</label>
		<input type="color" id="parent_color" />
		<div id="parent_color_val">#000000</div>
	</div>
	<div class="frontPage_listFontColor_item">
		<label>子级字体颜色：</label>
		<input type="color" id="sub_color" />
		<div id="sub_color_val">#000000</div>
	</div>
	<div class="frontPage_listFontColor_item">
		<label>子级悬浮颜色：</label>
		<input type="color" id="sub_hover_color" />
		<div id="sub_hover_color_val">#000000</div>
	</div>
	<div class="frontPage_listFontColor_item">
		<div id="listFontColor_clear_btn">重置 !</div>
		<div id="listFontColor_save_btn">保存 √</div>
		<div id="listFontColor_cancel_btn">取消 X</div>
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

//#region step4.1.detailTranslate.js 详情页翻译

// 头部添加词库更新提示
function detailDataUpdate() {
	var dataUpdateDiv = document.createElement("div");
	dataUpdateDiv.id = "data_update_tip";
	var dataUpdateText = document.createTextNode("词库升级中...");
	dataUpdateDiv.appendChild(dataUpdateText);
	var gd2Div = document.getElementById("gd2");
	gd2Div.appendChild(dataUpdateDiv);
}

// 详情页翻译
function detailPageTranslate() {

	// 详情页添加 Meta
	var meta = document.createElement("meta");
	meta.httpEquiv = "Content-Security-Policy";
	meta.content = "upgrade-insecure-requests";
	document.getElementsByTagName("head")[0].appendChild(meta);

	//#region 左侧作品详情

	// 类型
	var bookType = document.getElementsByClassName("cs");
	if (bookType.length > 0) {
		bookType[0].innerText = bookTypeData[bookType[0].innerText] ?? bookType[0].innerText;
	}

	// 上传人员
	var uploder = document.getElementById("gdn");
	if (uploder) {
		var up = uploder.innerHTML;
		var newInnerHtml = `由 ${up} 上传`;
		uploder.innerHTML = newInnerHtml;
	}


	var trList = document.getElementById("gdd").querySelectorAll("tr");

	// 上传时间
	trList[0].firstChild.innerText = "上传:";

	// 父级
	trList[1].firstChild.innerText = "父级:";

	// 是否可见
	trList[2].firstChild.innerText = "可见:";
	trList[2].lastChild.innerText = trList[2].lastChild.innerText == "Yes" ? "是" : "否";

	// 语言
	trList[3].firstChild.innerText = "语言:";
	var language = trList[3].lastChild.innerText.toLowerCase().replace(/(\s*$)/g, "");
	readByIndex(table_EhTagSubItems, table_EhTagSubItems_index_subEn, language, result => {
		trList[3].lastChild.innerText = result.sub_zh;
	}, () => { });

	// 文件大小
	trList[4].firstChild.innerText = "大小:";

	// 篇幅
	trList[5].firstChild.innerText = "篇幅:";
	trList[5].lastChild.innerText = trList[5].lastChild.innerText.replace("pages", "张图");

	// 收藏
	trList[6].firstChild.innerText = "收藏:";
	var favoriteText = trList[6].lastChild.innerText;
	if (favoriteText == "None") {
		trList[6].lastChild.innerText = "0 次";
	}
	else if (favoriteText == "Once") {
		trList[6].lastChild.innerText = "1 次";
	}
	else {
		trList[6].lastChild.innerText = favoriteText.replace("times", "次");
	}

	// 评分
	var trRateList = document.getElementById("gdr").querySelectorAll("tr");
	trRateList[0].firstChild.innerText = "评分:";
	trRateList[1].firstChild.innerText = trRateList[1].firstChild.innerText.replace("Average", "平均分");

	// 添加到收藏(Ex 账号)
	document.getElementById("favoritelink").innerText = "收藏到 (Ex 账号)";

	//#endregion

	// 文本框提示
	document.getElementById("newtagfield").placeholder = "添加新标签，用逗号分隔";
	document.getElementById("newtagbutton").value = "添加";

	// 右侧五个菜单
	var gd5a = document.getElementById("gd5").querySelectorAll("a");
	for (const i in gd5a) {
		if (Object.hasOwnProperty.call(gd5a, i)) {
			const a = gd5a[i];
			if (a.innerText.indexOf("Torrent Download") != -1) {
				a.innerText = a.innerText.replace("Torrent Download", "种子下载");
			} else {
				a.innerText = gd5aDict[a.innerText] ?? a.innerText;
			}
		}
	}

	// 展示数量
	var gpc = document.getElementsByClassName("gpc")[0];
	gpc.innerText = gpc.innerText.replace("Showing", "展示").replace("of", "共").replace("images", "张");

	// 展示行数
	var gdo2 = document.getElementById("gdo2").querySelectorAll("div");
	for (const i in gdo2) {
		if (Object.hasOwnProperty.call(gdo2, i)) {
			const div = gdo2[i];
			div.innerText = div.innerText.replace("rows", "行");
		}
	}

	// 图片尺寸
	var gdo4 = document.getElementById("gdo4").querySelectorAll("div");
	gdo4[0].innerText = "小图";
	gdo4[1].innerText = "大图";

}

//#endregion

//#region step4.2.detailbtn.js 详情页主要按钮功能

// 详情页选中的标签信息
var detailCheckedDict = {};

// 谷歌机翻
function translateDetailPageTitle() {
	var isChecked = document.getElementById("googleTranslateCheckbox").checked;

	// 更新存储
	var settings_translateDetailPageTitles = {
		item: table_Settings_key_TranslateDetailPageTitles,
		value: isChecked
	};
	update(table_Settings, settings_translateDetailPageTitles, () => {
		setDbSyncMessage(sync_googleTranslate_detailPage_title);
		translateDetailPageTitleDisplay();
	}, () => { });
}

function translateDetailPageTitleDisplay() {
	var isChecked = document.getElementById("googleTranslateCheckbox").checked;
	var h1 = document.getElementById("gj");
	if (!h1.innerText) {
		h1 = document.getElementById("gn");
	}


	var signDictArray = [];
	var txtArray = [];
	var translateDict = {};
	var specialChars = [
		'(', ')', '（', '）',
		'[', ']', '【', '】',
		'{', '}', '｛', '｝',
		'<', '>', '《', '》',
		'|', '&', '!', '@', '#', '$', '￥', '%', '^', '*', '`', '~', ' '
	];

	if (isChecked) {
		// 翻译标题
		if (h1.dataset.translate) {
			// 已经翻译过
			h1.innerText = h1.dataset.translate;
		} else {
			// 需要翻译
			h1.title = h1.innerText;

			var cstr = '';
			for (let i = 0; i < h1.title.length; i++) {
				const c = h1.title[i];

				if (specialChars.indexOf(c) != -1) {
					signDictArray.push({ i, c });
					if (cstr != '') {
						txtArray.push(cstr);
						cstr = '';
					}
				} else {
					cstr += c;
				}
			}

			if (cstr != '') {
				txtArray.push(cstr);
			}

			var totalCount = txtArray.length;
			var indexCount = 0;
			for (const i in txtArray) {
				if (Object.hasOwnProperty.call(txtArray, i)) {
					const text = txtArray[i];
					getTranslate(text, i);
				}
			}

			function getTranslate(text, i) {
				getGoogleTranslate(text, function (data) {
					var sentences = data.sentences;
					var longtext = '';
					for (const i in sentences) {
						if (Object.hasOwnProperty.call(sentences, i)) {
							const sentence = sentences[i];
							longtext += sentence.trans;
						}
					}
					translateDict[i] = longtext;
					indexCount++;
				});
			}

			var t = setInterval(() => {
				if (totalCount == indexCount) {
					t && clearInterval(t);
					translateCompelete();
				}
			}, 50);

			function translateCompelete() {
				if (signDictArray.length == 0 && txtArray.length > 0) {
					// 纯文字
					var str = '';
					for (const i in translateDict) {
						if (Object.hasOwnProperty.call(translateDict, i)) {
							str += translateDict[i];
						}
					}
					h1.innerText = str;
					h1.dataset.translate = h1.innerText;

				} else if (signDictArray.length > 0 && txtArray.length == 0) {
					// 纯符号
					var str = '';
					for (const i in signDictArray) {
						if (Object.hasOwnProperty.call(signDictArray, i)) {
							const item = signDictArray[i];
							str += item.c;
						}
					}
					h1.innerText = str;
					h1.dataset.translate = h1.innerText;

				} else if (signDictArray.length > 0 || txtArray.length > 0) {
					// 文字 + 符号
					var signIndex = 0;
					var translateIndex = 0;
					var str = '';
					var lastSignIndex = -2;
					if (signDictArray[0].i == 0) {
						// 符号在前
						while (signIndex < signDictArray.length ||
							translateIndex < txtArray.length) {
							// 符号索引间隔是否为1
							if (signIndex < signDictArray.length) {
								str += signDictArray[signIndex].c;
								lastSignIndex = signDictArray[signIndex].i;
								signIndex++;
							}

							if (signDictArray[signIndex] && signDictArray[signIndex].i == lastSignIndex + 1) {
								// 符号连续
								continue;
							}

							if (translateIndex < txtArray.length) {
								str += translateDict[translateIndex];
								translateIndex++;
							}
						}
					} else {
						// 文字在前 
						while (signIndex < signDictArray.length ||
							translateIndex < txtArray.length) {
							// 符号索引间隔是否为1
							if (signDictArray[signIndex] && signDictArray[signIndex].i == lastSignIndex + 1) {
								// 符号连续
								if (signIndex < signDictArray.length) {
									str += signDictArray[signIndex].c;
									lastSignIndex = signDictArray[signIndex].i;
									signIndex++;
								}
								continue;
							}

							if (translateIndex < txtArray.length) {
								str += translateDict[translateIndex];
								translateIndex++;
							}

							if (signIndex < signDictArray.length) {
								str += signDictArray[signIndex].c;
								lastSignIndex = signDictArray[signIndex].i;
								signIndex++;
							}
						}
					}

					h1.innerText = str;
					h1.dataset.translate = h1.innerText;
				}
			}
		}

	} else {
		// 显示原文
		if (h1.title) {
			h1.innerText = h1.title;
		}
	}
}

function detailPageFavorite() {
	// 右侧操作列
	var rightDiv = document.getElementById("gd5");

	// 标签谷歌机翻按钮
	var translateDiv = document.createElement("div");
	translateDiv.id = "googleTranslateDiv";
	var translateCheckbox = document.createElement("input");
	translateCheckbox.setAttribute("type", "checkbox");
	translateCheckbox.id = "googleTranslateCheckbox";
	translateDiv.appendChild(translateCheckbox);
	var translateLabel = document.createElement("label");
	translateLabel.setAttribute("for", translateCheckbox.id);
	translateLabel.id = "translateLabel";
	translateLabel.innerText = "谷歌机翻 : 标题";

	translateDiv.appendChild(translateLabel);
	rightDiv.appendChild(translateDiv);
	translateCheckbox.addEventListener("click", translateDetailPageTitle);

	// 读取是否选中
	read(table_Settings, table_Settings_key_TranslateDetailPageTitles, result => {
		if (result && result.value) {
			translateCheckbox.setAttribute("checked", true);
			translateDetailPageTitleDisplay();
		}
	}, () => { });

	// 清空选择按钮
	var clearBtn = document.createElement("div");
	clearBtn.id = "div_ee8413b2_detail_clearBtn";
	var clearTxt = document.createTextNode("清空选择");
	clearBtn.appendChild(clearTxt);
	clearBtn.addEventListener("click", categoryCheckClear);
	rightDiv.appendChild(clearBtn);

	// 加入收藏按钮
	var addFavoriteBtn = document.createElement("div");
	addFavoriteBtn.id = "div_ee8413b2_detail_addFavoriteBtn";
	var addFavoriteTxt = document.createTextNode("加入收藏");
	addFavoriteBtn.appendChild(addFavoriteTxt);
	addFavoriteBtn.addEventListener("click", categoryAddFavorite);
	rightDiv.appendChild(addFavoriteBtn);

	// 查询按钮
	var searchBtn = document.createElement("div");
	searchBtn.id = "div_ee8413b2_detail_searchBtn";
	var searchBtnTxt = document.createTextNode("搜索");
	searchBtn.appendChild(searchBtnTxt);
	searchBtn.addEventListener("click", categorySearch);
	rightDiv.appendChild(searchBtn);

	// 详情页右侧标签样式修改
	var rightP = rightDiv.querySelectorAll("p");
	for (const i in rightP) {
		if (Object.hasOwnProperty.call(rightP, i)) {
			const p = rightP[i];
			p.classList.remove("gsp");
		}
	}

	// 翻译标签父级
	var tcList = document.getElementsByClassName("tc");
	for (const i in tcList) {
		if (Object.hasOwnProperty.call(tcList, i)) {
			const tc = tcList[i];
			var parentEn = tc.innerText.replace(":", "");
			read(table_detailParentItems, parentEn, result => {
				if (result) {
					tc.innerText = `${result.name}:`;
				}
			}, () => { });
		}
	}

	// 翻译标签子项
	var aList = document.getElementById("taglist").querySelectorAll("a");
	for (const i in aList) {
		if (Object.hasOwnProperty.call(aList, i)) {
			const a = aList[i];

			// 查询父级和子级
			var splitStr = a.id.split("ta_")[1].split(":");
			var parent_en = splitStr[0];
			var sub_en;
			var parentId;

			if (splitStr.length == 2) {
				sub_en = splitStr[1].replace(new RegExp(/(_)/g), " ");
				parentId = `td_${parent_en}:${sub_en}`;
			} else {
				sub_en = parent_en;
				parent_en = "temp";
				parentId = `td_${sub_en}`;
			}

			a.dataset.ps_en = `${parent_en}:${sub_en}`;
			a.dataset.parent_en = parent_en;
			a.dataset.sub_en = sub_en;
			a.dataset.parent_id = parentId;

			// 点击添加事件，附带颜色
			a.addEventListener("click", detailCategoryClick);
			// 翻译标签
			read(table_EhTagSubItems, a.dataset.ps_en, result => {
				if (result) {
					a.innerText = result.sub_zh;
					a.title = `${result.sub_en}\r\n${result.sub_desc}`;
				}
			}, () => { });
		}
	}

	// 标签选中事件
	function detailCategoryClick(e) {
		var dataset = e.target.dataset;
		var parentId = dataset.parent_id;
		var ps_en = dataset.ps_en;
		var parent_en = dataset.parent_en;
		var sub_en = dataset.sub_en;

		var parentDiv = document.getElementById(`${parentId.replace(new RegExp(/( )/g), "_")}`);
		// 标签颜色改为黄色
		var alink = parentDiv.querySelectorAll("a")[0];
		if (alink.style.color == "blue") {
			func_eh_ex(() => {
				alink.style.color = "darkorange";
			}, () => {
				alink.style.color = "yellow";
			})
		}
		else {
			alink.style.color = "";
		}

		if (!detailCheckedDict[ps_en]) {
			// 添加选中
			detailCheckedDict[ps_en] = { parent_en, sub_en };
			parentDiv.classList.add("div_ee8413b2_category_checked");
		} else {
			// 移除选中
			delete detailCheckedDict[ps_en];
			parentDiv.classList.remove("div_ee8413b2_category_checked");
		}

		// 检查如果没有一个选中的，隐藏操作按钮
		if (checkDictNull(detailCheckedDict)) {
		}
		else {
			clearBtn.style.display = "block";
			addFavoriteBtn.style.display = "block";
			searchBtn.style.display = "block";
		}
	}


	// 清空选择
	function categoryCheckClear() {
		for (const ps_en in detailCheckedDict) {
			if (Object.hasOwnProperty.call(detailCheckedDict, ps_en)) {
				var parentDiv = document.getElementById(`td_${ps_en.replace(new RegExp(/( )/g), "_")}`);
				parentDiv.classList.remove("div_ee8413b2_category_checked");
			}
		}

		detailCheckedDict = {};
		hideDetailBtn();
	}

	// 隐藏按钮
	function hideDetailBtn() {
		clearBtn.style.display = "none";
		addFavoriteBtn.style.display = "none";
		searchBtn.style.display = "none";
	}

	// 加入收藏
	function categoryAddFavorite() {
		addFavoriteBtn.innerText = "收藏中...";

		var favoriteDict = {};
		var favoriteCount = 0;
		var checkDictCount = 0;
		var indexCount = 0;
		// 先从 收藏表中查询，是否存在，如果存在则不添加
		// 再从 EhTag表中查询，看是否存在，如果不存则更新父级 + 子级同名
		// 最后批量插入收藏表中，然后通知其他页面进行同步
		for (const ps_en in detailCheckedDict) {
			if (Object.hasOwnProperty.call(detailCheckedDict, ps_en)) {
				const item = detailCheckedDict[ps_en];
				read(table_favoriteSubItems, ps_en, favoriteResult => {
					if (!favoriteResult) {
						// 收藏表不存在
						read(table_EhTagSubItems, ps_en, ehTagResult => {
							if (ehTagResult) {
								// Ehtag表存在
								favoriteDict[ps_en] = {
									parent_en: ehTagResult.parent_en,
									parent_zh: ehTagResult.parent_zh,
									sub_en: ehTagResult.sub_en,
									sub_zh: ehTagResult.sub_zh,
									sub_desc: ehTagResult.sub_desc
								};
								favoriteCount++;
								indexCount++;
							} else {
								// EhTag表不存在
								read(table_detailParentItems, item.parent_en, parentResult => {
									if (parentResult) {
										// 父级存在
										favoriteDict[ps_en] = {
											parent_en: parentResult.row,
											parent_zh: parentResult.name,
											sub_en: item.sub_en,
											sub_zh: item.sub_en,
											sub_desc: ''
										};
										favoriteCount++;
										indexCount++;
									} else {
										// 父级不存在
										var custom_parent_en = 'userCustom';
										var custom_sub_en = item.parent_en;
										var custom_ps_en = `${custom_parent_en}:${custom_sub_en}`;
										// 再查收藏表是否存在
										read(table_favoriteSubItems, custom_ps_en, customFavoriteResult => {
											if (!customFavoriteResult) {
												// 不存在
												favoriteDict[custom_ps_en] = {
													parent_en: custom_parent_en,
													parent_zh: '自定义',
													sub_en: item.sub_en,
													sub_zh: item.sub_en,
													sub_desc: ''
												};
												favoriteCount++;
											}
											indexCount++;
										}, () => { indexCount++; });
									}
								}, () => { indexCount++; });
							}
						}, () => { indexCount++; });
					} else {
						indexCount++;
					}
				}, () => { indexCount++; });
				checkDictCount++;
			}
		}

		var t = setInterval(() => {
			if (indexCount == checkDictCount) {
				t && clearInterval(t);
				// 批量插入新增收藏，完成后通知同步
				batchAddFavoriteAndMessage();
			}
		}, 50);


		function batchAddFavoriteAndMessage() {
			batchAdd(table_favoriteSubItems, table_favoriteSubItems_key, favoriteDict, favoriteCount, () => {
				// 读取收藏表，更新收藏列表html
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

					// 存储收藏 Html
					var settings_favoriteList_html = {
						item: table_Settings_key_FavoriteList_Html,
						value: favoritesListHtml
					};
					update(table_Settings, settings_favoriteList_html, () => {
						// localstroage 消息通知
						setDbSyncMessage(sync_favoriteList);
						// 显示完成
						setTimeout(function () {
							addFavoriteBtn.innerText = "完成 √";
						}, 250);
						setTimeout(function () {
							addFavoriteBtn.innerText = "加入收藏";
						}, 500);
					}, () => {
						setTimeout(function () {
							addFavoriteBtn.innerText = "完成 ×";
						}, 250);
						setTimeout(function () {
							addFavoriteBtn.innerText = "加入收藏";
						}, 500);
					});
				});
			});
		}


	}

	// 搜索
	function categorySearch() {
		var searchArray = [];
		for (const ps_en in detailCheckedDict) {
			if (Object.hasOwnProperty.call(detailCheckedDict, ps_en)) {
				searchArray.push(`"${ps_en}"`);
			}
		}

		// 构建请求链接
		var searchLink = `https://${webHost}/?f_search=${searchArray.join("+")}`;
		window.location.href = searchLink;
	}
}

//#endregion

//#region step5.3.datasync.common.translateTitle.js 热门页数据同步

function DataSyncCommonTranslateTitle() {
	// 谷歌机翻：标题
	window.onstorage = function (e) {
		try {
			switch (e.newValue) {
				case sync_googleTranslate_frontPage_title:
					updateGoogleTranslateFrontPageTitle();
					break;
			}
		} catch (error) {
			removeDbSyncMessage();
		}
	}

	// 热门谷歌翻译标题
	function updateGoogleTranslateFrontPageTitle() {
		indexDbInit(() => {
			read(table_Settings, table_Settings_key_TranslateFrontPageTitles, result => {
				var translateCheckbox = document.getElementById("googleTranslateCheckbox");
				translateCheckbox.checked = result && result.value;
				translateMainPageTitleDisplay();
				removeDbSyncMessage();
			}, () => { removeDbSyncMessage(); });
		})
	}
}

//#endregion

//#region 7.1.popular.js 热门

function popularPage() {

	// 跨域
	var meta = document.createElement("meta");
	meta.httpEquiv = "Content-Security-Policy";
	meta.content = "upgrade-insecure-requests";
	document.getElementsByTagName("head")[0].appendChild(meta);

	// 头部标题改成中文
	var ihTitle = document.getElementsByClassName("ih");
	if (ihTitle.length > 0) {
		ihTitle[0].innerText = "近期热门作品";
	}

	var toppane = document.getElementById("toppane");
	toppane.classList.add("t_popular_toppane"); // 添加样式避免干扰其他页面

	// 标题机翻
	var translateDiv = document.createElement("div");
	translateDiv.id = "googleTranslateDiv";
	var translateCheckbox = document.createElement("input");
	translateCheckbox.setAttribute("type", "checkbox");
	translateCheckbox.id = "googleTranslateCheckbox";
	translateDiv.appendChild(translateCheckbox);
	var translateLabel = document.createElement("label");
	translateLabel.setAttribute("for", translateCheckbox.id);
	translateLabel.id = "translateLabel";
	translateLabel.innerText = "谷歌机翻 : 标题";

	translateDiv.appendChild(translateLabel);
	translateCheckbox.addEventListener("click", translateMainPageTitle);
	toppane.insertBefore(translateDiv, toppane.lastChild);

	// 头部添加词库升级提示
	var dataUpdateDiv = document.createElement("div");
	dataUpdateDiv.id = "data_update_tip";
	var dataUpdateText = document.createTextNode("词库升级中...");
	dataUpdateDiv.appendChild(dataUpdateText);
	toppane.insertBefore(dataUpdateDiv, toppane.lastChild);


	// 翻译下拉折叠菜单
	var dms = document.getElementById("dms");
	dms.classList.add("t_popular_dms"); // 添加样式避免干扰其他页面
	dropDownlistTranslate();

	// 表头翻译
	tableHeadTranslate();

	// 作品类型翻译
	bookTypeTranslate();


	indexDbInit(() => {
		// 谷歌机翻标题
		read(table_Settings, table_Settings_key_TranslateFrontPageTitles, result => {
			if (result && result.value) {
				translateCheckbox.setAttribute("checked", true);
				translateMainPageTitleDisplay();
			}
		}, () => { });

		// 确保存在标签数据
		tagDataDispose(() => {
			// 表格标签翻译
			tableTagTranslate();
		})
	});

	// 同步谷歌机翻标题
	DataSyncCommonTranslateTitle();
}



//#endregion

//#region step7.2.favorite.js 收藏列表

function favoritePage() {

	// 标题添加类 t_favorite_ido，方便添加样式
	var ido = document.getElementsByClassName("ido");
	if (ido.length > 0) {
		ido[0].classList.add("t_favorite_ido");
	}

	// 标题直接删除
	var h1 = document.getElementsByTagName("h1");
	if (h1.length > 0) {
		var pageTitle = h1[0];
		pageTitle.parentNode.removeChild(pageTitle);
	}

	// 显示全部按钮改名
	var favoriteBtns = document.getElementsByClassName("fp");
	if (favoriteBtns.length > 0) {
		var showAllFavorites = favoriteBtns[favoriteBtns.length - 1];
		showAllFavorites.innerText = "点我显示：全部收藏";
	}

	// 搜索框大小调整，搜索按钮清空按钮翻译，筛选文本框排成一行

	// 排序翻译、搜索行数翻译（包含没有搜索结果）

	// 谷歌机翻标题

	// 折叠按钮翻译

	// 表头翻译、表格标签翻译

	// 底部删除选中翻译


}



//#endregion


// 主方法

// 标记可用浏览器版本
// 头部菜单汉化
topMenuTranslateZh();

// 根据地址链接判断当前是首页还是详情页
if (window.location.pathname.indexOf("/g/") != -1) {
	// 详情页
	detailPage();
}
else {
	switch (window.location.pathname) {
		case '/':				// 首页
			mainPageCategory();
			break;
		case '/watched':		// 偏好
			break;
		case '/popular':		// 热门
			popularPage();
			break;
		case '/torrents.php':	// 种子
			break;
		case '/favorites.php':	// 收藏
			//favoritePage();
			break;
		// 设置、我的标签、排行榜、悬赏
	}
}

function mainPageCategory() {

	// 从localstroge 读取，头部隐藏折叠
	frontPageTopStyleStep01();

	// 首页框架搭建
	frontPageHtml();

	// 消息通知提前，只要数据改变就应该马上通知，方便快速其他页面快速反应	
	// 初始化用户配置信息
	initUserSettings(() => {

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

		// 展示区包裹层div、全部类别Div、收藏Div、类别列表div、类别_恋物列表div、类别_ehtag列表div、收藏列表div、加载词库等待div
		var displayDiv = document.getElementById("display_div");
		var categoryDisplayDiv = document.getElementById("category_all_div");
		var favoritesDisplayDiv = document.getElementById("category_favorites_div");
		var categoryEditor = document.getElementById("category_editor");
		var categoryListDiv = document.getElementById("category_list");
		var categoryList_fetishDiv = document.getElementById("category_list_fetishList");
		var categoryList_ehTagDiv = document.getElementById("category_list_ehTag");
		var favoriteListDiv = document.getElementById("favorites_list");
		var categoryLoadingDiv = document.getElementById("category_loading_div");

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

		// 背景图片包裹层div、头部div、上传图片按钮、不透明度、不透明度值、模糊程度、模糊程度值、重置按钮、保存按钮、取消按钮、关闭按钮
		var backgroundFormDiv = document.getElementById("background_form");
		var backgroundFormTop = document.getElementById("background_form_top");
		var bgUploadBtn = document.getElementById("bgUploadBtn");
		var bgUploadFile = document.getElementById("bg_upload_file");
		var opacityRange = document.getElementById("opacity_range");
		var opacityVal = document.getElementById("opacity_val");
		var maskRange = document.getElementById("mask_range");
		var maskVal = document.getElementById("mask_val");
		var bgImgClearBtn = document.getElementById("bgImg_clear_btn");
		var bgImgSaveBtn = document.getElementById("bgImg_save_btn");
		var bgImgCancelBtn = document.getElementById("bgImg_cancel_btn");
		var bgImgCloseBtn = document.getElementById("background_form_close");

		// 列表字体颜色包裹层div、头部div、父级字体调色板、父级字体颜色、子级字体调色板、子级字体颜色、子级悬浮调色板、子级悬浮颜色、重置按钮、保存按钮、取消按钮、关闭按钮
		var listFontColorDiv = document.getElementById("frontPage_listFontColor");
		var listFontColorTop = document.getElementById("frontPage_listFontColor_top");
		var listFontColorParentColor = document.getElementById("parent_color");
		var listFontColorParentColorVal = document.getElementById("parent_color_val");
		var listFontColorSubColor = document.getElementById("sub_color");
		var listFontColorSubColorVal = document.getElementById("sub_color_val");
		var listFontColorSubHoverColor = document.getElementById("sub_hover_color");
		var listFontColorSubHoverColorVal = document.getElementById("sub_hover_color_val");
		var listFontColorClearBtn = document.getElementById("listFontColor_clear_btn");
		var listFontColorSaveBtn = document.getElementById("listFontColor_save_btn");
		var listFontColorCancelBtn = document.getElementById("listFontColor_cancel_btn");
		var listFontColorCloseBtn = document.getElementById("frontPage_listFontColor_close");
		//#endregion



		//#region step6.1.backgroundImage.js 设置背景图片

		var t_imgBase64 = ''; // 背景图片
		var t_opacity = defaultSetting_Opacity; // 透明度
		var t_mask = defaultSetting_Mask; // 遮罩浓度


		// 头部按钮点击事件
		var bgDiv = document.getElementById("div_background_btn");
		bgDiv.onclick = function () {
			backgroundFormDiv.style.display = "block";
			bgDiv.style.display = "none";
		}

		// 读取存储设置值，读取完成前，隐藏头部按钮，读取完成在显示出来
		function initBackground(func_compelete) {
			bgDiv.style.display = "none";
			var completeGetImg = false;
			var completeGetOpacity = false;
			var completeGetMask = false;
			read(table_Settings, table_Settings_Key_Bg_ImgBase64, result => {
				if (result && result.value) {
					t_imgBase64 = result.value;
				} else {
					t_imgBase64 = '';
				}
				// 设置页面背景
				setListBackgroundImage(t_imgBase64);
				completeGetImg = true;
			}, () => { completeGetImg = true; });
			read(table_Settings, table_Settings_Key_Bg_Opacity, result => {
				if (result && result.value) {
					t_opacity = result.value;
				} else {
					t_opacity = defaultSetting_Opacity;
				}
				// 设置背景不透明度
				setListOpacity(t_opacity);
				// 设置弹窗不透明度数值
				setDialogOpacityValue(t_opacity);
				completeGetOpacity = true;
			}, () => { completeGetOpacity = true; });
			read(table_Settings, table_Settings_Key_Bg_Mask, result => {
				if (result && result.value) {
					t_mask = result.value;
				} else {
					t_mask = defaultSetting_Mask;
				}
				// 设置背景遮罩浓度
				setListMask(t_mask);
				// 设置弹窗遮罩浓度数值
				setDialogMaskValue(t_mask);
				completeGetMask = true;
			}, () => { completeGetMask = true; });

			var tInit = setInterval(() => {
				if (completeGetImg && completeGetOpacity && completeGetMask) {
					tInit && clearInterval(tInit);
					bgDiv.style.display = "block";
					func_compelete();
				}
			}, 50);
		}

		initBackground(() => { });

		// 点击上传图片
		bgUploadBtn.onclick = function () {
			bgUploadFile.click();
		}
		bgUploadFile.onchange = function () {
			var resultFile = bgUploadFile.files[0];
			if (resultFile) {
				var reader = new FileReader();
				reader.readAsDataURL(resultFile);
				reader.onload = function (e) {
					var fileContent = e.target.result;
					t_imgBase64 = fileContent;
					setListBackgroundImage(t_imgBase64);

					// 上传置空
					bgUploadFile.value = "";
				}
			}
		}

		// 设置列表背景图片
		function setListBackgroundImage(imageBase64) {
			var bg = `url(${imageBase64}) 0 / cover`;
			var style = document.createElement('style');
			style.innerHTML = `#div_ee8413b2_bg::before{background:${bg}}`;
			document.head.appendChild(style);
		}


		// 不透明度
		opacityRange.oninput = function () {
			t_opacity = opacityRange.value;
			opacityVal.innerText = t_opacity;
			setListOpacity(t_opacity);
		}
		// 设置不透明度效果
		function setListOpacity(opacityValue) {
			var style = document.createElement('style');
			style.innerHTML = `#div_ee8413b2_bg::before{opacity:${opacityValue}}`;
			document.head.appendChild(style);
		}
		// 设置弹窗不透明度数值
		function setDialogOpacityValue(opacityValue) {
			opacityRange.value = opacityValue;
			opacityVal.innerText = opacityValue;
		}


		// 遮罩浓度
		maskRange.oninput = function () {
			t_mask = maskRange.value;
			maskVal.innerText = t_mask;
			setListMask(t_mask);
		}
		// 设置遮罩浓度效果
		function setListMask(maskValue) {
			var style = document.createElement('style');
			style.innerHTML = `#div_ee8413b2_bg::before{filter:blur(${maskValue}px)}`;
			document.head.appendChild(style);
		}
		// 设置弹窗遮罩浓度数值
		function setDialogMaskValue(maskValue) {
			maskRange.value = maskValue;
			maskVal.innerText = maskValue;
		}

		// 点击关闭 + 取消关闭
		function closeBgSetDialog() {
			// 初始化设置
			initBackground(() => {
				backgroundFormDiv.style.display = "none";
				bgDiv.style.display = "block";
			});
		}
		bgImgCancelBtn.onclick = closeBgSetDialog;
		bgImgCloseBtn.onclick = closeBgSetDialog;

		// 重置
		bgImgClearBtn.onclick = function () {
			var confirmResult = confirm("是否删除背景图片，重置相关参数?");
			if (confirmResult) {
				bgImgClearBtn.innerText = "重置中...";
				var clearcomplete1 = false;
				var clearcomplete2 = false;
				var clearcomplete3 = false;
				remove(table_Settings, table_Settings_Key_Bg_ImgBase64, () => {
					t_imgBase64 = '';
					setListBackgroundImage(t_imgBase64);
					clearcomplete1 = true;
				}, () => { clearcomplete1 = true; });
				remove(table_Settings, table_Settings_Key_Bg_Opacity, () => {
					t_opacity = defaultSetting_Opacity;
					setListOpacity(t_opacity);
					setDialogOpacityValue(t_opacity);
					clearcomplete2 = true;
				}, () => { clearcomplete2 = true; });
				remove(table_Settings, table_Settings_Key_Bg_Mask, () => {
					t_mask = defaultSetting_Mask;
					setListMask(t_mask);
					setDialogMaskValue(t_mask);
					clearcomplete3 = true;
				}, () => { clearcomplete3 = true; });

				var tClear = setInterval(() => {
					if (clearcomplete1 && clearcomplete2 && clearcomplete3) {
						tClear && clearInterval(tClear);
						setDbSyncMessage(sync_setting_backgroundImage);
						setTimeout(function () {
							bgImgClearBtn.innerText = "重置成功";
						}, 250);
						setTimeout(function () {
							bgImgClearBtn.innerText = "重置 !";
						}, 500);
					}
				}, 50);
			}
		}

		// 保存
		bgImgSaveBtn.onclick = function () {
			bgImgSaveBtn.innerText = "保存中...";

			// 存储
			var complete1 = false;
			var complete2 = false;
			var complete3 = false;

			// 背景图片
			var settings_Key_Bg_ImgBase64 = {
				item: table_Settings_Key_Bg_ImgBase64,
				value: t_imgBase64
			};
			update(table_Settings, settings_Key_Bg_ImgBase64, () => { complete1 = true }, () => { complete1 = true });

			// 不透明度
			var settings_Key_Bg_Opacity = {
				item: table_Settings_Key_Bg_Opacity,
				value: t_opacity
			};
			update(table_Settings, settings_Key_Bg_Opacity, () => { complete2 = true }, () => { complete2 = true });

			// 遮罩浓度
			var settings_Key_Bg_Mask = {
				item: table_Settings_Key_Bg_Mask,
				value: t_mask
			};
			update(table_Settings, settings_Key_Bg_Mask, () => { complete3 = true }, () => { complete3 = true });

			var t = setInterval(() => {
				if (complete1 && complete2 && complete3) {
					t && clearInterval(t);
					setDbSyncMessage(sync_setting_backgroundImage);
					setTimeout(function () {
						bgImgSaveBtn.innerText = "保存成功";
					}, 250);
					setTimeout(function () {
						bgImgSaveBtn.innerText = "保存 √";
					}, 500);
				}
			}, 50);
		}

		//#endregion

		//#region step6.2.listFontColor.js 列表字体颜色设置

		var defaultFrontParentColor;
		var defaultFrontSubColor;
		var defaultFrontSubHoverColor;

		func_eh_ex(() => {
			defaultFrontParentColor = defaultFontParentColor_EH;
			defaultFrontSubColor = defaultFontSubColor_EH;
			defaultFrontSubHoverColor = defaultFontSubHoverColor_EH;
		}, () => {
			defaultFrontParentColor = defaultFontParentColor_EX;
			defaultFrontSubColor = defaultFontSubColor_EX;
			defaultFrontSubHoverColor = defaultFontSubHoverColor_EX;
		});

		var t_parentColor = defaultFrontParentColor;
		var t_subColor = defaultFrontSubColor;
		var t_subHoverColor = defaultFrontSubHoverColor;

		// 头部按钮点击事件
		var frontDiv = document.getElementById("div_fontColor_btn");
		frontDiv.onclick = function () {
			listFontColorDiv.style.display = "block";
			frontDiv.style.display = "none";
		}

		// 读取存储的值，读取完成前，隐藏头部按钮，读取完成在显示出来
		function initFontColor(func_compelete) {
			frontDiv.style.display = "none";
			var completeParentColor = false;
			var completeSubColor = false;
			var completeSubHoverColor = false;
			read(table_Settings, table_Settings_key_FrontPageFontParentColor, result => {
				if (result && result.value) {
					t_parentColor = result.value;
				} else {
					t_parentColor = defaultFrontParentColor;
				}
				// 设置父级颜色
				setFontPrentColor(t_parentColor);
				setDialogFontParentColor(t_parentColor);
				completeParentColor = true;
			}, () => { completeParentColor = true; });
			read(table_Settings, table_Settings_key_FrontPageFontSubColor, result => {
				if (result && result.value) {
					t_subColor = result.value;
				} else {
					t_subColor = defaultFrontSubColor;
				}
				// 设置子级颜色
				setFontSubColor(t_subColor);
				setDialogFontSubColor(t_subColor);
				completeSubColor = true;
			}, () => { completeSubColor = true; });
			read(table_Settings, table_Settings_Key_FrontPageFontSubHoverColor, result => {
				if (result && result.value) {
					t_subHoverColor = result.value;
				} else {
					t_subHoverColor = defaultFrontSubHoverColor;
				}
				// 设置子级悬浮颜色
				setFontSubHoverColor(t_subHoverColor);
				setDialogFontSubHoverColor(t_subHoverColor);
				completeSubHoverColor = true;
			}, () => { completeSubHoverColor = true; });

			var tInit = setInterval(() => {
				if (completeParentColor && completeSubColor && completeSubHoverColor) {
					tInit && clearInterval(tInit);
					frontDiv.style.display = "block";
					func_compelete();
				}
			}, 50);
		}

		initFontColor(() => { });

		// 父级颜色
		listFontColorParentColor.onchange = function () {
			t_parentColor = listFontColorParentColor.value;
			listFontColorParentColorVal.innerText = t_parentColor;
			setFontPrentColor(t_parentColor);
		}
		// 设置父级颜色效果
		function setFontPrentColor(parentColor) {
			var style = document.createElement('style');
			style.innerHTML = `#div_ee8413b2 #category_all_div h4, 
    #div_ee8413b2 #favorites_list h4, 
    #div_ee8413b2 #favorites_edit_list h4
    {color:${parentColor}}
    
    #div_ee8413b2 #category_all_div .category_extend, 
    #div_ee8413b2 #favorites_list .favorite_extend, 
    #div_ee8413b2 #favorites_edit_list .favorite_edit_clear
    {border: 1px solid ${parentColor}; color:${parentColor};}`;
			document.head.appendChild(style);
		}

		// 设置弹窗页父级颜色数值
		function setDialogFontParentColor(parentColor) {
			listFontColorParentColor.value = parentColor;
			listFontColorParentColorVal.innerText = parentColor;
		}

		// 子级颜色
		listFontColorSubColor.onchange = function () {
			t_subColor = listFontColorSubColor.value;
			listFontColorSubColorVal.innerText = t_subColor;
			setFontSubColor(t_subColor);
		}
		// 设置子级颜色效果
		function setFontSubColor(subColor) {
			var style = document.createElement('style');
			style.innerHTML = `#div_ee8413b2 #category_all_div .c_item, 
    #div_ee8413b2 #category_favorites_div #favorites_list .c_item
    {color:${subColor}}`;
			document.head.appendChild(style);
		}
		// 设置弹窗页子级颜色数值
		function setDialogFontSubColor(subColor) {
			listFontColorSubColor.value = subColor;
			listFontColorSubColorVal.innerText = subColor;
		}

		// 子级悬浮颜色
		listFontColorSubHoverColor.onchange = function () {
			t_subHoverColor = listFontColorSubHoverColor.value;
			listFontColorSubHoverColorVal.innerText = t_subHoverColor;
			setFontSubHoverColor(t_subHoverColor);
		}
		// 设置子级悬浮颜色效果
		function setFontSubHoverColor(subHoverColor) {
			var style = document.createElement('style');
			style.innerHTML = `#div_ee8413b2 #category_all_div .c_item:hover,
    #div_ee8413b2 #category_favorites_div #favorites_list .c_item:hover
    {color:${subHoverColor}}`;
			document.head.appendChild(style);
		}

		// 设置弹窗页子级悬浮颜色数值
		function setDialogFontSubHoverColor(subHoverColor) {
			listFontColorSubHoverColor.value = subHoverColor;
			listFontColorSubHoverColorVal.innerText = subHoverColor;
		}

		// 点击关闭 + 取消关闭
		function closeFontColorDialog() {
			// 初始化设置
			initFontColor(() => {
				listFontColorDiv.style.display = "none";
				frontDiv.style.display = "block";
			});
		}
		listFontColorCancelBtn.onclick = closeFontColorDialog;
		listFontColorCloseBtn.onclick = closeFontColorDialog;


		// 重置
		listFontColorClearBtn.onclick = function () {
			var confirmResult = confirm("是否重置字体颜色相关参数?");
			if (confirmResult) {
				listFontColorClearBtn.innerText = "重置中...";
				var clearcomplete1 = false;
				var clearcomplete2 = false;
				var clearcomplete3 = false;
				remove(table_Settings, table_Settings_key_FrontPageFontParentColor, () => {
					t_parentColor = defaultFrontParentColor;
					setFontPrentColor(t_parentColor);
					setDialogFontParentColor(t_parentColor);
					clearcomplete1 = true;
				}, () => { clearcomplete1 = true; });
				remove(table_Settings, table_Settings_key_FrontPageFontSubColor, () => {
					t_subColor = defaultFrontSubColor;
					setFontSubColor(t_subColor);
					setDialogFontSubColor(t_subColor);
					clearcomplete2 = true;
				}, () => { clearcomplete2 = true; });
				remove(table_Settings, table_Settings_Key_FrontPageFontSubHoverColor, () => {
					t_subHoverColor = defaultFrontSubHoverColor;
					setFontSubHoverColor(t_subHoverColor);
					setDialogFontSubHoverColor(t_subHoverColor);
					clearcomplete3 = true;
				}, () => { clearcomplete3 = true; });

				var tClear = setInterval(() => {
					if (clearcomplete1 && clearcomplete2 && clearcomplete3) {
						tClear && clearInterval(tClear);
						setDbSyncMessage(sync_setting_frontPageFontColor);
						setTimeout(function () {
							listFontColorClearBtn.innerText = "重置成功";
						}, 250);
						setTimeout(function () {
							listFontColorClearBtn.innerText = "重置 !";
						}, 500);
					}
				}, 50);
			}
		}

		// 保存
		listFontColorSaveBtn.onclick = function () {
			listFontColorSaveBtn.innerText = "保存中...";

			// 存储
			var complete1 = false;
			var complete2 = false;
			var complete3 = false;

			// 父级颜色
			var settings_Key_FrontPageFontParentColor = {
				item: table_Settings_key_FrontPageFontParentColor,
				value: t_parentColor
			};
			update(table_Settings, settings_Key_FrontPageFontParentColor, () => { complete1 = true; }, () => { complete1 = true; });

			// 子级颜色
			var settings_Key_FrontPageFontSubColor = {
				item: table_Settings_key_FrontPageFontSubColor,
				value: t_subColor
			};
			update(table_Settings, settings_Key_FrontPageFontSubColor, () => { complete2 = true; }, () => { complete2 = true; });

			// 子级悬浮颜色
			var settings_Key_FrontPageFontSubHoverColor = {
				item: table_Settings_Key_FrontPageFontSubHoverColor,
				value: t_subHoverColor
			};
			update(table_Settings, settings_Key_FrontPageFontSubHoverColor, () => { complete3 = true; }, () => { complete3 = true; });

			var t = setInterval(() => {
				if (complete1 && complete2 && complete3) {
					t && clearInterval(t);
					setDbSyncMessage(sync_setting_frontPageFontColor);
					setTimeout(function () {
						listFontColorSaveBtn.innerText = "保存成功";
					}, 250);
					setTimeout(function () {
						listFontColorSaveBtn.innerText = "保存 √";
					}, 500);
				}
			}, 50);
		}

		//#endregion

		//#region step6.3.drugDialog.js 鼠标拖拽设置对话框

		var x = 0, y = 0;
		var left = 0, top = 0;
		var isMouseDown = false;

		var x1 = 0, y1 = 0;
		var left1 = 0, top1 = 0;
		var isMouseDown1 = false;

		// 背景对话框 鼠标按下事件
		backgroundFormTop.onmousedown = function (e) {
			// 获取坐标xy
			x = e.clientX;
			y = e.clientY;

			// 获取左和头的偏移量
			left = backgroundFormDiv.offsetLeft;
			top = backgroundFormDiv.offsetTop;

			// 鼠标按下
			isMouseDown = true;
		}

		// 字体对话框 鼠标按下事件
		listFontColorTop.onmousedown = function (e) {
			//获取坐标x1,y1
			x1 = e.clientX;
			y1 = e.clientY;

			// 获取左和头的偏移量
			left1 = listFontColorDiv.offsetLeft;
			top1 = listFontColorDiv.offsetTop;

			// 鼠标按下
			isMouseDown1 = true;
		}

		// 鼠标移动
		window.onmousemove = function (e) {
			if (isMouseDown) {
				var nLeft = e.clientX - (x - left);
				var nTop = e.clientY - (y - top);
				backgroundFormDiv.style.left = `${nLeft}px`;
				backgroundFormDiv.style.top = `${nTop}px`;
			}

			if (isMouseDown1) {
				var nLeft1 = e.clientX - (x1 - left1);
				var nTop1 = e.clientY - (y1 - top1);
				listFontColorDiv.style.left = `${nLeft1}px`;
				listFontColorDiv.style.top = `${nTop1}px`;
			}
		}

		// 鼠标抬起
		backgroundFormTop.onmouseup = function () {
			isMouseDown = false;
		}

		listFontColorDiv.onmouseup = function () {
			isMouseDown1 = false;
		}

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
				slideDown(displayDiv, 537, 15, function () { });

				searchCloseBtn.style.display = "block";
				slideRight(searchCloseBtn, 20, 10, function () { });
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
				slideDown(displayDiv, 537, 15, function () { });

				searchCloseBtn.style.display = "block";
				slideRight(searchCloseBtn, 20, 10, function () {
				});
			}
		}


		// 收起按钮
		searchCloseBtn.onclick = function () {
			categoryFavoritesBtn.classList.remove("chooseTab");
			allCategoryBtn.classList.remove("chooseTab");

			slideLeft(searchCloseBtn, 10, function () {
				searchCloseBtn.style.display = "none";
			});

			// 折叠动画
			slideUp(displayDiv, 15, function () {
				categoryDisplayDiv.style.display = "none";
				favoritesDisplayDiv.style.display = "none";
			});
		}


		//#endregion

		// indexedDB 数据存储初始化
		tagDataDispose(() => {

			// 首页谷歌翻译：标签
			mainPageTranslate();

			// 本地列表Html + 功能
			//#region step3.6.category.js 本地列表模块

			// 折叠方法
			function extendDiv(extendSpans, extendArray) {
				if (extendArray.length > 0) {
					for (const i in extendSpans) {
						if (Object.hasOwnProperty.call(extendSpans, i)) {
							const span = extendSpans[i];
							var parent_en = span.dataset.category;
							var itemDiv = document.getElementById("items_div_" + parent_en);
							if (extendArray.indexOf(parent_en) != -1) {
								span.innerText = "+";
								itemDiv.style.display = "none";
							} else {
								span.innerText = "-";
								itemDiv.style.display = "block";
							}
						}
					}
				} else {
					for (const i in extendSpans) {
						if (Object.hasOwnProperty.call(extendSpans, i)) {
							const span = extendSpans[i];
							var parent_en = span.dataset.category;
							var itemDiv = document.getElementById("items_div_" + parent_en);
							span.innerText = "-";
							itemDiv.style.display = "block";
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
								update(table_Settings, setting_categoryExtend, () => {
									// 通知折叠
									setDbSyncMessage(sync_categoryList_Extend);
								}, () => { });

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

			// 初始化本地列表页面
			function categoryInit() {
				var complete1 = false;
				var complete2 = false;
				var complete3 = false;
				var complete4 = false;

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
						complete2 = true;
					}, () => { complete2 = true; });
					// 单个展开折叠
					parentItemsExtend(extendSpans);
					// 具体小项点击加入搜索框
					var cItems = document.getElementsByClassName("c_item_fetish");
					cItemJsonSearchInput(cItems);
					complete1 = true;
				}, () => {
					complete1 = true;
					complete2 = true;
				});

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
						complete4 = true;
					}, () => { complete4 = true; });
					// 单个展开折叠
					parentItemsExtend(extendSpans);
					// 具体小项点击加入搜索框
					var cItems = document.getElementsByClassName("c_item_ehTag");
					cItemJsonSearchInput(cItems);
					complete3 = true;
				}, () => {
					complete3 = true;
					complete4 = true;
				});

				var t = setInterval(() => {
					if (complete1 && complete2 && complete3 && complete4) {
						t && clearInterval(t);
						// 隐藏等待div
						categoryLoadingDiv.style.display = "none";
						// 展示列表
						categoryEditor.style.display = "block";
						categoryListDiv.style.display = "block";
					}
				}, 10);
			}
			categoryInit();

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
						update(table_Settings, setting_categoryExtend, () => {
							// 通知折叠
							setDbSyncMessage(sync_categoryList_Extend);
						}, () => { });
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
				remove(table_Settings, table_Settings_key_CategoryList_Extend, () => {
					// 通知折叠
					setDbSyncMessage(sync_categoryList_Extend);
				}, () => { });
			}

			//#endregion

			//#region step3.7.search.js 搜索框功能

// 进入页面，根据地址栏信息生成搜索栏标签
function readSearchParentAndInput(parentEn, subEn) {
    read(table_detailParentItems, parentEn, result => {
        if (result) {
            addItemToInput(result.row, result.name, subEn, subEn, '');
        } else {
            addItemToInput(parentEn, parentEn, subEn, subEn, '');
        }
    }, () => {
        addItemToInput(parentEn, parentEn, subEn, subEn, '');
    });
}

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
                    read(table_EhTagSubItems, items, ehTagData => {
                        if (ehTagData) {
                            addItemToInput(ehTagData.parent_en, ehTagData.parent_zh, ehTagData.sub_en, ehTagData.sub_zh, ehTagData.sub_desc);
                        } else {
                            // 尝试翻译父级
                            readSearchParentAndInput(parentEn, subEn);
                        }
                    }, () => {
                        // 尝试翻译父级
                        readSearchParentAndInput(parentEn, subEn);
                    });
                }
                else {
                    // 从恋物列表中查询，看是否存在
                    readByIndex(table_fetishListSubItems, table_fetishListSubItems_index_subEn, itemArray[0], fetishData => {
                        if (fetishData) {
                            addItemToInput(fetishData.parent_en, fetishData.parent_zh, fetishData.sub_en, fetishData.sub_zh, fetishData.sub_desc);
                        } else {
                            addItemToInput("userCustom", "自定义", itemArray[0], itemArray[0], '');
                        }
                    }, () => {
                        // 用户自定义搜索关键字
                        addItemToInput("userCustom", "自定义", itemArray[0], itemArray[0], '');
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
                    addItemToInput(item.parent_en, item.parent_zh, item.sub_en, item.sub_zh, item.sub_desc);
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

    // 从收藏中的用户自定义中模糊搜索，绑定数据
    readByCursorIndex(table_favoriteSubItems, table_favoriteSubItems_index_parentEn, "userCustom", customArray => {
        if (customArray.length > 0) {
            var foundArrays = [];
            for (const i in customArray) {
                if (Object.hasOwnProperty.call(customArray, i)) {
                    const item = customArray[i];
                    if (item.sub_en.indexOf(inputValue) != -1) {
                        foundArrays.push(item);
                    }
                }
            }

            if (foundArrays.length > 0) {
                addInputSearchItems(foundArrays);
            }
        }
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
                var sub_desc = recommendItem.title;
                if (sub_zh == inputValue || sub_en == inputValue) {
                    // 符合条件
                    var parent_zh = zhArray[0];
                    var parent_en = enArray[0];
                    addItemToInput(parent_en, parent_zh, sub_en, sub_zh, sub_desc);
                    isFound = true;
                    break;
                }
            }
        }

        if (!isFound) {
            // 没有找到符合条件的
            addItemToInput("userCustom", "自定义", inputValue, inputValue, '');
        }

    } else {
        // 如果没有下拉列表，直接新增自定义文本
        addItemToInput("userCustom", "自定义", inputValue, inputValue, '');
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
					// 读取收藏HTML，如果存在，则直接生成页面，否则从收藏表读取数据手动生成
					read(table_Settings, table_Settings_key_FavoriteList_Html, result => {
						if (result && result.value) {
							// 存在收藏 html
							// 页面附加Html
							favoriteListDiv.innerHTML = result.value;
							// 小项添加点击事件
							favoriteItemsClick();
							// 折叠菜单添加点击事件
							favoriteExtendClick();
							// 设置收藏折叠
							setFavoriteExpend();
							// 更新按钮状态
							updateFavoriteListBtnStatus();
						} else {
							// 不存在收藏 html
							// 根据收藏表生成html
							generalFavoriteListDiv(() => {
								// 设置收藏折叠
								setFavoriteExpend();
								// 更新按钮状态
								updateFavoriteListBtnStatus();
							});
						}
					}, () => { });
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

			function getFavoriteListHtml(favoriteSubItems) {
				var favoritesListHtml = ``;
				var lastParentEn = ``;
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
						favoritesListHtml += `<span class="c_item c_item_favorite" title="${item.sub_zh} [${item.sub_en}]&#10;&#13;${item.sub_desc}" data-item="${item.sub_en}" 
                        data-parent_en="${item.parent_en}" data-parent_zh="${item.parent_zh}" data-sub_desc="${item.sub_desc}">${item.sub_zh}</span>`;
					}
				}

				if (favoritesListHtml != ``) {
					favoritesListHtml += `</div>`;
				}

				return favoritesListHtml;
			}

			// 首次更新本地收藏列表
			function firstUpdateFavoriteSubItems(favoriteSubItems, foundTotalCount) {
				// 更新本地收藏表
				batchAdd(table_favoriteSubItems, table_favoriteSubItems_key, favoriteSubItems, foundTotalCount, () => {
					// 稳妥起见，更新完之后再删除本地的原始收藏列表
					remove(table_Settings, table_Settings_key_FavoriteList, () => { }, () => { });
				});

				// 生成 html 和 同步
				if (!checkDictNull(favoriteSubItems)) {
					// 新版收藏，只可能增加，原有的不变
					var favoritesListHtml = getFavoriteListHtml(favoriteSubItems);

					// 页面附加Html
					favoriteListDiv.innerHTML = favoritesListHtml;

					// 存储收藏Html
					saveFavoriteListHtml(favoritesListHtml, () => {
						// 通知页面更新
						setDbSyncMessage(sync_favoriteList);
					});

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
					var expendBtns = document.getElementsByClassName("favorite_extend");
					if (result && result.value) {
						var expendArray = result.value;
						for (const i in expendBtns) {
							if (Object.hasOwnProperty.call(expendBtns, i)) {
								const btn = expendBtns[i];
								var category = btn.dataset.category;
								var itemDiv = document.getElementById("favorite_div_" + category);
								if (expendArray.indexOf(category) != -1) {
									btn.innerText = "+";
									itemDiv.style.display = "none";
								} else {
									btn.innerText = "-";
									itemDiv.style.display = "block";
								}
							}
						}
					} else {
						for (const i in expendBtns) {
							if (Object.hasOwnProperty.call(expendBtns, i)) {
								const btn = expendBtns[i];
								btn.innerText = "-";
								var category = btn.dataset.category;
								var itemDiv = document.getElementById("favorite_div_" + category);
								itemDiv.style.display = "block";
							}
						}
					}
				}, () => { });
			}

			// 更新收藏列表Html存储
			function saveFavoriteListHtml(favoritesListHtml, func_compelete) {
				var settings_favoriteList_html = {
					item: table_Settings_key_FavoriteList_Html,
					value: favoritesListHtml
				};

				update(table_Settings, settings_favoriteList_html, () => { func_compelete(); }, () => { });
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

								update(table_Settings, settings_favoriteList_extend, () => {
									// 通知折叠
									setDbSyncMessage(sync_favoriteList_Extend);
								}, () => { });

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
									newFavoriteItem.title = `${item.sub_zh} [${item.sub_en}]\n\n${item.sub_desc}`;

									var itemText = document.createTextNode(item.sub_zh);
									newFavoriteItem.appendChild(itemText);

									newFavoriteItem.addEventListener("click", function () {
										addItemToInput(item.parent_en, item.parent_zh, item.sub_en, item.sub_zh, item.sub_desc);
									});

									favoriteDiv.appendChild(newFavoriteItem);

								}
							}

							// 获取html并更新收藏html
							saveFavoriteListHtml(favoriteListDiv.innerHTML, () => {
								// 通知更新收藏列表
								setDbSyncMessage(sync_favoriteList);

								// 设置折叠
								setFavoriteExpend();

								// 完成
								finishFavorite();
							});
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
							document.getElementById("favorite_div_" + parentEn).style.display = "block";
							if (expendData.indexOf(parentEn) != -1) {
								expendData.remove(parentEn);
							}
						} else {
							// 需要折叠
							span.innerHTML = "+";
							document.getElementById("favorite_div_" + parentEn).style.display = "none";
							if (expendData.indexOf(parentEn) == -1) {
								expendData.push(parentEn);
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
				remove(table_Settings, table_Settings_Key_FavoriteList_Extend, () => {
					// 通知折叠
					setDbSyncMessage(sync_favoriteList_Extend);
				}, () => { });
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

				update(table_Settings, settings_favoriteList_extend, () => {
					// 通知折叠
					setDbSyncMessage(sync_favoriteList_Extend);
				}, () => { });
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
					generalFavoriteListDiv(() => {
						// 通知页面刷新
						setDbSyncMessage(sync_favoriteList);

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
			function generalFavoriteListDiv(func_compelete) {
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
					saveFavoriteListHtml(favoritesListHtml, () => {
						func_compelete();
					});
				})
			}

			// 取消
			favoriteCancel.onclick = editToFavorite;

			// 清空
			favoriteClear.onclick = function () {
				var confirmResult = confirm("是否清空本地收藏?");
				if (confirmResult) {
					favoriteListDiv.innerHTML = "";

					// 清空收藏Html
					remove(table_Settings, table_Settings_key_FavoriteList_Html, () => {
						// 通知收藏页面更新
						setDbSyncMessage(sync_favoriteList);
						// 更新收藏按钮
						updateFavoriteListBtnStatus();
					}, () => { });

					// 清空收藏数据
					clearTable(table_favoriteSubItems, () => { });

					// 清空收藏折叠
					remove(table_Settings, table_Settings_Key_FavoriteList_Extend, () => { }, () => { });
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

			//#region step5.1.dataSync.frontPage.js 首页数据同步

			window.onstorage = function (e) {
				try {
					switch (e.newValue) {
						case sync_oldSearchTopVisible:
							updatePageTopVisible();
							break;
						case sync_categoryList:
							updatePageCategoryList();
							break;
						case sync_favoriteList:
							updatePageFavoriteList();
							break;
						case sync_categoryList_Extend:
							updatePageCategoryListExtend();
							break;
						case sync_favoriteList_Extend:
							updatePageFavoriteListExtend();
							break;
						case sync_googleTranslate_frontPage_title:
							updateGoogleTranslateFrontPageTitle();
							break;
						case sync_setting_backgroundImage:
							updateSettingBackgroundImage();
							break;
						case sync_setting_frontPageFontColor:
							updateSettingFrontPageFontColor();
							break;
					}
				} catch (error) {
					removeDbSyncMessage();
				}
			}

			// 头部搜索折叠隐藏
			function updatePageTopVisible() {
				indexDbInit(() => {
					read(table_Settings, table_Settings_key_OldSearchDiv_Visible, result => {
						var searchBoxDiv = document.getElementById("searchbox");
						var topVisibleDiv = document.getElementById("div_top_visible_btn");
						if (result && result.value) {
							// 显示
							searchBoxDiv.children[0].style.display = "block";
							topVisibleDiv.innerText = "头部隐藏";
						} else {
							// 隐藏
							searchBoxDiv.children[0].style.display = "none";
							topVisibleDiv.innerText = "头部显示";
						}
						removeDbSyncMessage();
					}, () => {
						removeDbSyncMessage();
					});
				});
			}

			// 本地列表更新
			function updatePageCategoryList() {
				indexDbInit(() => {
					categoryInit();
					removeDbSyncMessage();
				});
			}

			// 本地收藏更新
			function updatePageFavoriteList() {
				// 读取收藏 html 应用到页面，如果为空，直接清空收藏页面即可
				// 读取收藏折叠并应用，每个收藏项的点击事件
				indexDbInit(() => {
					var favoriteListDiv = document.getElementById("favorites_list");
					// 退出编辑模式
					editToFavorite();

					read(table_Settings, table_Settings_key_FavoriteList_Html, result => {
						if (result && result.value) {
							// 存在收藏 html
							// 页面附加Html
							favoriteListDiv.innerHTML = result.value;
							// 小项添加点击事件
							favoriteItemsClick();
							// 折叠菜单添加点击事件
							favoriteExtendClick();
							// 设置收藏折叠
							setFavoriteExpend();
							// 更新按钮状态
							updateFavoriteListBtnStatus();
						} else {
							// 不存在收藏 html
							// 清理收藏页面
							favoriteListDiv.innerHTML = '';
							// 更新按钮状态
							updateFavoriteListBtnStatus();
						}
						// 清理通知
						removeDbSyncMessage();
					}, () => {
						// 清理通知
						removeDbSyncMessage();
					});
				});

			}

			// 本地列表折叠更新
			function updatePageCategoryListExtend() {
				indexDbInit(() => {
					var ehTagExtendSpans = document.getElementsByClassName("category_extend_ehTag");
					read(table_Settings, table_Settings_key_CategoryList_Extend, extendResult => {
						if (extendResult) {
							extendDiv(ehTagExtendSpans, extendResult.value);
						} else {
							extendDiv(ehTagExtendSpans, []);
						};
					}, () => {
					});

					var fetishExtendSpans = document.getElementsByClassName("category_extend_fetish");
					read(table_Settings, table_Settings_key_CategoryList_Extend, extendResult => {
						if (extendResult) {
							extendDiv(fetishExtendSpans, extendResult.value);
						} else {
							extendDiv(fetishExtendSpans, []);
						}
					}, () => { });

					// 清理通知
					removeDbSyncMessage();
				});
			}

			// 本地收藏折叠更新
			function updatePageFavoriteListExtend() {
				indexDbInit(() => {
					// 退出编辑模式
					editToFavorite();
					// 设置收藏折叠
					setFavoriteExpend();
					// 更新按钮状态
					updateFavoriteListBtnStatus();
					// 清理通知
					removeDbSyncMessage();
				});
			}

			// 首页谷歌翻译标题
			function updateGoogleTranslateFrontPageTitle() {
				indexDbInit(() => {
					read(table_Settings, table_Settings_key_TranslateFrontPageTitles, result => {
						var translateCheckbox = document.getElementById("googleTranslateCheckbox");
						translateCheckbox.checked = result && result.value;
						translateMainPageTitleDisplay();
						removeDbSyncMessage();
					}, () => { removeDbSyncMessage(); });
				})
			}

			// 首页背景图片更新
			function updateSettingBackgroundImage() {
				indexDbInit(() => {
					initBackground(() => {
						if (backgroundFormDiv.style.display == "block") {
							var bgDiv = document.getElementById("div_background_btn");
							bgDiv.style.display = "none";
						}
					});
				});
			}

			// 首页列表字体颜色
			function updateSettingFrontPageFontColor() {
				indexDbInit(() => {
					initFontColor(() => {
						if (listFontColorDiv.style.display == "block") {
							var frontDiv = document.getElementById("div_fontColor_btn");
							frontDiv.style.display = "none";
						}
					});
				});
			}

			//#endregion

		});
	});



}

function detailPage() {
	// 初始化用户配置信息
	initUserSettings(() => {
		// 头部数据更新
		detailDataUpdate();

		// 保证完整数据
		tagDataDispose(() => {
			detailPageTranslate();
			detailPageFavorite();
		});

		//#region step5.2.dataSync.detailPage.js 详情页数据同步

		window.onstorage = function (e) {
			try {
				switch (e.newValue) {
					case sync_googleTranslate_detailPage_title:
						updateGoogleTranslateDetailPageTitle();
						break;
				}
			} catch (error) {
				removeDbSyncMessage();
			}
		}

		// 详情页谷歌翻译标题
		function updateGoogleTranslateDetailPageTitle() {
			indexDbInit(() => {
				read(table_Settings, table_Settings_key_TranslateDetailPageTitles, result => {
					var translateCheckbox = document.getElementById("googleTranslateCheckbox");
					translateCheckbox.checked = result && result.value;
					translateDetailPageTitleDisplay();
					removeDbSyncMessage();
				}, () => { removeDbSyncMessage(); });
			})
		}

		//#endregion

	});
}

//#endregion
