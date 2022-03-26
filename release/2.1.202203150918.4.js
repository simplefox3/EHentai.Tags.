// ==UserScript==
// @name         ExHentai 中文标签助手
// @namespace    ExHentai 中文标签助手_DYZYFTS
// @license		 MIT
// @version      2.1.202203150918.4
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

const webHost = window.location.host;
function func_eh_ex(ehFunc, exFunc) {
	if (webHost == "e-hentai.org") {
		ehFunc();
	}
	else if (webHost == "exhentai.org") {
		exFunc();
	}
}


//#region [首页样式注入]
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

// 样式注入
func_eh_ex(() => {
	// e-hentai 样式
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
	// exhentai 样式
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

//#region [首页html代码]
const category_html = `
<div id="search_wrapper">
	<div id="search_top">
		<div id="category_all_button">全部类别</div>
		<div id="category_favorites_button">本地收藏</div>
		<div id="search_close">收起</div>
		<div id="category_search_input">
			<div id="input_info">
				<div id="readonly_div"></div>
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
			<div id="category_list"></div>
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
//#endregion

//#region [全部标签原始数据、子项数据、父项数据、详情父级标签、作品分类]

var categoryData;
func_eh_ex(() => {
	// ehentai 总数据
	categoryData = {
		"Age": ["年龄", {
			"age progression": ["年龄增长", "一个人迅速变老。"],
			"age regression": ["年龄回归", "一名参与者迅速变年轻。瞬时更改不符合条件。"],
			"dilf": ["熟男", "任何年龄在 30-50 岁之间的老年人。不需要当父亲"],
			"infantilism": ["幼稚", "涉及将非儿童伴侣视为婴儿的性活动。可能包括尿布"],
			"milf": ["熟女", "任何年龄在 30-50 岁之间的老年妇女。不需要当妈妈。"],
			"old lady": ["老太太", "明显年老的女性，通常有面部皱纹。如果要估计他们的年龄，至少应该是 50 岁。"],
			"old man": ["老人", "一个明显老年的男性，通常有面部皱纹。如果要估计他们的年龄，至少应该是 50 岁。"]
		}],
		"Body": ["身体", {
			"adventitious penis": ["不定阴茎", "至少有一个阴茎在身体上意想不到的地方（例如手、嘴、尾巴）。"],
			"adventitious vagina": ["不定阴道", "在身体意想不到的地方（例如手、嘴、上身）有阴道。"],
			"amputee": ["截肢者", "一个人失去一个或多个肢体。可以调用血腥标签。"],
			"big muscles": ["大肌肉", "明显的大肌肉。肌肉发达的手臂必须与头部一样宽，或者肌肉发达的大腿与头部一样宽 1.5 倍。"],
			"body modification": ["身体改造", "以某种人工方式改变身体部位，例如非有机增强、身体部位添加或移除以及不寻常的身体部位放置。"],
			"conjoined": ["连体", "两个或多个头共享同一个身体。"],
			"doll joints": ["娃娃关节", "具有明显的圆形或凹形关节。"],
			"gijinka": ["非人类", "一个具有人类/完全拟人化形式的角色，但规范上没有。也可以作为非人形角色进行角色扮演。"],
			"invisible": ["隐形", "一个看不见的参与者。"],
			"multiple arms": ["多臂", "一个人身上有两条以上的手臂。"],
			"multiple breasts": ["多乳房", "单个角色上的任何超过 2 个乳房。"],
			"multiple nipples": ["多乳头", "每个乳房有超过 1 个的任意数量的乳头。包括乳房。"],
			"multiple penises": ["多阴茎", "拥有不止一个阴茎。不适用于触手式阴茎。"],
			"multiple vaginas": ["多阴道", "拥有多个阴道。"],
			"muscle": ["肌肉", "一个明显肌肉发达的参与者。"],
			"muscle growth": ["肌肉生长", "肌肉出现在以前没有的地方或现有的肌肉变大。"],
			"pregnant": ["怀孕", "涉及明显怀孕的参与者的性活动或裸体。"],
			"shapening": ["塑形", "参与者将其压扁、融化或以其他方式变成几何形状，例如球体或立方体。"],
			"stretching": ["伸展", "超出正常人所能做的伸展（例如四肢）。"],
			"tailjob": ["尾交", "用尾巴刺激生殖器区域。"],
			"wingjob": ["翼交", "使用翅膀刺激生殖器区域。"],
			"wings": ["翅膀", "人形生物上任何突出的翅膀。"]
		}],
		"change": ["改变", {
			"absorption": ["吸收", "吸收某物或某人的行为。可能被丸吞或反向出生调用。"],
			"age progression": ["年龄进展", "一个人迅速变老。"],
			"age regression": ["年龄回归", "一名参与者迅速变年轻。瞬时更改不符合条件。"],
			"ass expansion": ["屁股扩张", "臀部因任何原因而增长。很可能招惹大屁股。"],
			"balls expansion": ["睾丸扩张", "睾丸变大。可能导致大球。"],
			"body swap": ["身体交换", "与另一个参与者交换身体。"],
			"breast expansion": ["乳房扩张", "乳房大小的任何显着增加。很可能会引起大乳房，也可能是巨大的乳房。"],
			"breast reduction": ["乳房缩小", "乳房大小的任何显着减少。可唤起小乳房。"],
			"clit growth": ["阴蒂生长", "阴蒂的生长，通常会导致一个大阴蒂。"],
			"corruption": ["腐败", "用魔法或其他超自然力量强行腐蚀参与者的思想，剥夺他们的纯洁。"],
			"dick growth": ["鸡巴生长", "阴茎异常生长。可能会导致阴茎变大。"],
			"feminization": ["女性化", "男性将他的生活方式改变为变装者的生活方式（例如通过训练或精神控制），或者将他的身体改变为人妖/双胞胎。在任何一种情况下，这个人都必须表现得更加女性化或被视为更加女性化。"],
			"gender change": ["性别变化", "角色通过任何方式（例如，性别变形、占有和身体交换）改变其通常的性别。"],
			"gender morph": ["性别变形", "角色的身体通过身体转变从原来的身体改变性别。如果显示为序列而不是突然变化，则可能会调用转换。"],
			"growth": ["成长", "长高了。可能导致女巨人或巨人。"],
			"moral degeneration": ["道德退化", "消除一个人对性的道德立场。必须在不使用强力物质或超自然影响的情况下完成。可能会引发精神崩溃。"],
			"muscle growth": ["肌肉生长", "肌肉出现在以前没有的地方或现有的肌肉变大。"],
			"nipple expansion": ["乳头扩张", "乳头明显增大。可能导致乳头变大。"],
			"personality excretion": ["个性排泄", "参与者将他们的灵魂转移到一个物品中（例如果冻、人造阴道 或精液），然后排出体外，使他们的身体变成一个空壳。"],
			"petrification": ["石化", "成为雕像/岩石般的形态。"],
			"shrinking": ["萎缩", "参与者变小。可能会导致迷你女孩或迷你男孩。不需要转型。"],
			"transformation": ["转化", "显示某种物理、生物学变化的序列。"],
			"weight gain": ["体重增加", "过摄取食物变胖。很可能会调用女胖子或男胖子。"]
		}],
		"Creature": ["生物", {
			"alien": ["外星人", "任何具有强烈特征的男性，旨在唤起非地球起源的存在。通常为人形，缺乏任何真实或神话生物的特征（例如眼柄、无虹膜、球状头部、触手身体部位）。"],
			"alien girl": ["外星女孩", "任何具有强烈特征的女性，旨在唤起非地球起源的存在。通常为人形，缺乏任何真实或神话生物的特征（例如眼柄、无虹膜、球状头部、触手身体部位）。"],
			"angel": ["天使", "有大的，典型的白色翅膀。通常也具有光环。"],
			"bat boy": ["蝙蝠男孩", "男版蝙蝠女。"],
			"bat girl": ["蝙蝠女孩", "一种女性类人生物，有翅膀、耳朵，有时还有尾巴或蝙蝠的其他显着特征。"],
			"bear boy": ["熊男孩", "男版熊女。"],
			"bear girl": ["熊女孩", "一个有着圆耳朵的雌性，可能还有熊的其他特征。男版见熊男孩。"],
			"bee boy": ["蜜蜂男孩", "男版蜂女。"],
			"bee girl": ["蜜蜂女孩", "具有蜜蜂特征的雌性。"],
			"bunny boy": ["兔子男孩", "男版兔女郎。"],
			"bunny girl": ["兔子女孩", "兔耳朵，偶尔也有蓬松的尾巴。"],
			"catboy": ["猫男孩", "男版猫娘。"],
			"catgirl": ["猫女孩", "有耳朵，通常有尾巴或猫的其他特征。"],
			"centaur": ["人马", "半马半人。"],
			"cowgirl": ["牛女孩", "有牛耳朵、牛角，可能还有尾巴和牛铃。可能有荷斯坦图案（白色带黑色斑点）。常与大胸搭配。"],
			"cowman": ["牛男", "男版女牛仔。"],
			"deer boy": ["鹿男孩", "男版鹿女。"],
			"deer girl": ["鹿女孩", "具有鹿或驯鹿的尾巴和角的雌性。男性版本见鹿男孩。"],
			"demon": ["恶魔", "具有强烈恶魔外观（翅膀、角、尖尾巴、皮肤图案/标记等）的男性人形生物，偶尔也有异常的皮肤颜色和眼睛。"],
			"demon girl": ["恶魔女孩", "具有强烈恶魔外观（翅膀、角、尖尾巴、皮肤图案/标记等）的女性人形生物，偶尔也会有异常的皮肤颜色和眼睛。"],
			"dog boy": ["狗男孩", "男版狗女。"],
			"dog girl": ["狗女孩", "一个有狗的尾巴和耳朵的女性。"],
			"draenei": ["魔兽蓝色恶魔", "来自魔兽世界的恶魔类人形生物。蓝色的皮肤，有蹄子和发光的眼睛。"],
			"fairy": ["仙女", "一种小型类人生物，其翅膀通常类似于昆虫或蝴蝶的翅膀。"],
			"fox boy": ["狐狸男孩", "男版狐女。"],
			"fox girl": ["狐狸女孩", "一个长着狐狸耳朵和尾巴的���孩，通常很浓密，有黑色的尖端。男版见狐童。"],
			"frog boy": ["青蛙男孩", "男版蛙女。"],
			"frog girl": ["青蛙女孩", "一个女性，身体矮矮，皮肤光滑，爬虫类的附肢长。可能有长舌头。"],
			"furry": ["福瑞", "具有某些人类个性或特征的拟人化动物角色。"],
			"giraffe boy": ["长颈鹿男孩", "男版长颈鹿少女。"],
			"giraffe girl": ["长颈鹿女孩", "长颈鹿耳朵和尾巴的女孩，衣服或皮毛上通常有黄色和棕色斑点。可能有一个长脖子。"],
			"ghost": ["幽灵", "与非物质的存在发生性关系。"],
			"goblin": ["哥布林", "幻想生物，通常约为正常人身高的 1/2 至 3/4。通常有宽鼻子、尖耳朵、宽嘴和小而锋利的獠牙。"],
			"harpy": ["哈比", "一种鸟人和人类的混血儿，经常有融合的翅膀作为手臂。"],
			"horse boy": ["马男孩", "男版马女。"],
			"horse girl": ["马女孩", "有马的尾巴和其他特征。"],
			"human on furry": ["人类x福瑞", "人形生物和拟人生物之间的性活动。"],
			"insect boy": ["昆虫男孩", "男版虫女"],
			"insect girl": ["昆虫女孩", "有触角，通常有壳或甲壳躯干。"],
			"kemonomimi": ["兽耳", "具有动物耳朵和尾巴但几乎没有其他动物部位的类人生物。"],
			"kappa": ["河童", "乌龟与人类的混血儿。"],
			"lizard girl": ["蜥蜴少女", "一个长着爬行动物鳞片和尾巴的女孩。"],
			"lizard guy": ["蜥蜴人", "男版蜥蜴女。"],
			"mermaid": ["美人鱼", "一种鱼人混合体，鱼的部分位于身体的下半部分。男性版本见人鱼。"],
			"merman": ["人鱼", "男性美人鱼。"],
			"minotaur": ["牛头怪", "任何公牛与人类的混合体。可能会召唤毛茸茸或在极少数情况下是怪物。"],
			"monkey boy": ["猴子男孩", "男版猴女。"],
			"monkey girl": ["猴子女孩", "有耳朵，通常有尾巴或猴子的其他特征。"],
			"monoeye": ["单眼", "一个独眼的类人生物。因任何原因（变形除外）失去一只眼睛的双眼角色不符合资格。"],
			"monster": ["怪物", "任何不是人类、外星人、天使、机器人、恶魔、动物、吸血鬼、仙女、精灵或毛茸茸的东西。"],
			"monster girl": ["怪物女孩", "任何不是人类、外星人、天使、机器人、恶魔、动物、吸血鬼、仙女、精灵或毛茸茸的东西。"],
			"mouse boy": ["老鼠男孩", "男版老鼠娘。"],
			"mouse girl": ["老鼠女孩", "定义特征是大而圆的老鼠耳朵和长长的啮齿动物般的尾巴。通常非常喜欢奶酪。"],
			"necrophilia": ["恋尸癖", "涉及尸体的性行为。"],
			"oni": ["鬼", "一个头上有1-2个角和可能尖耳朵的类人生物。没有翅膀或尾巴。"],
			"orc": ["兽人", "与人类一样高或略高的幻想生物。通常有倾斜的前额、突出的下巴、突出的牙齿和粗大的体毛。"],
			"otter boy": ["水獭男孩", "男版水獭女。"],
			"otter girl": ["水獭女孩", "雌性长着长矛状的长尾巴、圆耳朵和水獭的其他特征。口吻、颈部和躯干通常颜色较浅。"],
			"panda boy": ["熊猫男孩", "男版熊猫女。"],
			"panda girl": ["熊猫女孩", "耳朵圆圆，眼睛周围和身体其他部位有黑色斑块。"],
			"pig girl": ["猪女孩", "有耳朵，通常还有鼻子、卷曲的尾巴或猪的其他特征。"],
			"pig man": ["猪人", "有耳朵，通常还有鼻子、卷曲的尾巴或猪的其他特征。"],
			"plant boy": ["植物男孩", "男版植物少女。"],
			"plant girl": ["植物女孩", "一种雌性植物-人类杂交种。"],
			"raccoon boy": ["浣熊男孩", "男版浣熊女。"],
			"raccoon girl": ["浣熊女孩", "有耳朵，通常有尾巴或浣熊的其他特征。"],
			"robot": ["机器人", "一个机械人形机器人（例如：cyborg、android、fembot）。通常具有可见的金属身体部位或肢体关节。"],
			"shark boy": ["鲨鱼男孩", "雄性以尾鳍作为尾巴而不是身体的下半部分。通常也有锋利的牙齿。"],
			"shark girl": ["鲨鱼女孩", "一种以尾鳍为尾巴而不是下半身的雌性。通常也有锋利的牙齿。男性版本见鲨鱼男孩。"],
			"sheep boy": ["绵羊男孩", "男版羊女。"],
			"sheep girl": ["绵羊女孩", "一个有羊毛和可能是羊角的女性。"],
			"slime": ["史莱姆", "任何与性有关的粘稠/凝胶状物质。基于粘液的生物需要这个和怪物标签。"],
			"slime boy": ["史莱姆男孩", "一个男孩，他的身体完全是用粘液制成的。"],
			"slime girl": ["史莱姆女孩", "一个身体主要由粘液制成的女孩。"],
			"snake boy": ["蛇男孩", "男版蛇女。"],
			"snake girl": ["蛇女孩", "蛇-雌性混合体的任何变体。"],
			"spider boy": ["蜘蛛男孩", "男版蜘蛛女。"],
			"spider girl": ["蜘蛛女孩", "身体是蜘蛛的少女。"],
			"squid boy": ["鱿鱼男孩", "男版鱿鱼娘。"],
			"squid girl": ["鱿鱼女孩", "有许多小触手，可能是鱿鱼或章鱼的尖头。"],
			"squirrel boy": ["松鼠男孩", "男版松鼠少女。"],
			"squirrel girl": ["松鼠少女", "有松鼠的尾巴和其他特征。"],
			"skunk boy": ["臭鼬少年", "男版臭鼬少女。"],
			"skunk girl": ["臭鼬少女", "雌性，具有臭鼬的尾巴和其他显着特征。"],
			"tentacles": ["触手", "用于性目的的长而柔韧的卷须。"],
			"vampire": ["吸血鬼", "有尖牙，喝血。必须使用吸血鬼能力或露出尖牙来展示。"],
			"wolf boy": ["狼少年", "男版狼女。"],
			"wolf girl": ["狼少女", "有尖耳朵，通常有浓密的尾巴或狼的其他特征。"],
			"yukkuri": ["尤库里", "圆形斑点状生物，其面孔基于东方 Project中的角色。经常参与血腥或酷刑。"],
			"zombie": ["僵尸", "一种肉质的不死生物。"]
		}],
		"Animal": ["动物", {
			"animal on animal": ["动物x动物", ""],
			"animal on furry": ["动物x福瑞", ""],
			"bear": ["熊", ""],
			"bestiality": ["兽交", "与动物或昆虫发生性关系的人。"],
			"bull": ["公牛", ""],
			"camel": ["骆驼", ""],
			"cat": ["猫", ""],
			"cow": ["牛", ""],
			"crab": ["螃蟹", ""],
			"deer": ["鹿", ""],
			"dinosaur": ["恐龙", ""],
			"dog": ["狗", ""],
			"dolphin": ["海豚", ""],
			"donkey": ["驴", ""],
			"dragon": ["龙", ""],
			"eel": ["鳗鱼", ""],
			"elephant": ["大象", ""],
			"fish": ["鱼", ""],
			"fox": ["狐狸", ""],
			"frog": ["青蛙", ""],
			"goat": ["山羊", ""],
			"gorilla": ["大猩猩", ""],
			"horse": ["马", ""],
			"insect": ["昆虫", ""],
			"kangaroo": ["袋鼠", ""],
			"lion": ["狮子", ""],
			"lioness": ["母狮", ""],
			"maggot": ["蛆", ""],
			"monkey": ["猴子", ""],
			"mouse": ["老鼠", ""],
			"octopus": ["章鱼", ""],
			"panther": ["豹", ""],
			"pig": ["猪", ""],
			"rabbit": ["兔子", ""],
			"reptile": ["爬行动物", ""],
			"rhinoceros": ["犀牛", ""],
			"sheep": ["羊", ""],
			"shark": ["鲨鱼", ""],
			"slug": ["蛞蝓", "任何类型的腹足类软体动物，即使是那些有壳的。"],
			"snake": ["蛇", ""],
			"spider": ["蜘蛛", ""],
			"tiger": ["老虎", ""],
			"turtle": ["乌龟", ""],
			"unicorn": ["独角兽", ""],
			"whale": ["鲸鱼", ""],
			"wolf": ["狼", ""],
			"worm": ["蠕虫", ""],
			"zebra": ["斑马", ""]
		}],
		"Height": ["身高", {
			"giant": ["巨人", "男版女巨人。使用环境线索来确定角色是大还是小。"],
			"giantess": ["女巨人", "高高在上的女性参与者。她应该能够一只手握住一个正常大小的人。使用环境线索来确定角色是大还是小。"],
			"growth": ["成长", "长高了。可能导致女巨人或巨人。"],
			"midget": ["侏儒", "一个很矮的人。看起来应该等于或小于伴侣的腰高。如果不存在伴侣，请使用环境提示。"],
			"minigirl": ["迷你女孩", "一只手掌大小的女性。使用环境提示来确定角色是小还是大。"],
			"miniguy": ["迷你男孩", "男版迷你女孩。使用环境提示来确定角色是小还是大。"],
			"shrinking": ["缩小", "参与者变小。可能会导致小女孩或小男孩。不需要转型。"],
			"tall girl": ["高个女孩", "一个明显高大的女人。应该看起来至少比她的伴侣高一个头。如果没有伴侣，或者伴侣是正太控、萝莉控、迷你女孩/男孩或侏儒，请使用环境线索。"],
			"tall man": ["高个子", "一个明显高大的男人。应该看起来至少比他的搭档高一个头。如果没有伴侣，或者伴侣是正太控、萝莉控、迷你女孩/男孩或侏儒，请使用环境线索。"]
		}],
		"Skin": ["皮肤", {
			"albino": ["白化病", "红眼睛与非常浅的皮肤相结合。"],
			"body writing": ["身体写字", "在人的身体上制���的各种文字或图画，通常包括贬义词，例如“荡妇”或“精液垃圾箱”。"],
			"body painting": ["人体彩绘", "油漆不仅仅在脸上或身体的一小块区域上。"],
			"crotch tattoo": ["胯部纹身", "下腹部和胯部之间区域的任何明显图案/标志。"],
			"dark skin": ["深色皮肤", "棕色或黑色肤色。"],
			"freckles": ["雀斑", "皮肤表面有许多相互靠近的小色素沉着点。通常出现在脸上，但也可以出现在身体的任何部位。"],
			"gyaru": ["日式辣妹", "各种时装过去尽可能地显得不像日本人，包括人造棕褐色、漂白头发、装饰指甲、浓妆、假睫毛等。"],
			"gyaru-oh": ["日式辣男", "各种时装过去尽可能地显得非日本化，包括人造棕褐色、漂白的头发、浓妆、坚韧的衣服等。"],
			"large tattoo": ["大纹身", "皮肤上的永久性标记/图案，通常用墨水完成。必须足够突出以覆盖至少半个肢体/脸。对于累积满足相同最小值的许多小型设备也可以接受。"],
			"oil": ["油", "参与者至少部分覆盖有润滑剂，如身体油，以赋予其皮肤光滑的质地/光滑的外观。"],
			"scar": ["疤痕", "皮肤上的痕迹或烧伤。必须非常突出。"],
			"skinsuit": ["紧身衣", "穿着另一个人的皮肤，有效地成为佩戴者的皮肤。"],
			"sweating": ["出汗", "参与者身上有大量汗水滴落。"],
			"tanlines": ["晒痕", "较浅的线条，通常来自晒黑后的衣服。"]
		}],
		"Weight": ["重量", {
			"anorexic": ["厌食症", "体重过轻以至于一个人的皮肤凹陷或他们的骨骼结构的任何部分都与他们的皮肤相适应。"],
			"bbm": ["胖子", "胖子。中腹部必须有褶皱。"],
			"bbw": ["女胖子", "胖女人。中腹部必须有褶皱。"],
			"ssbbm": ["男大胖子", "由于体脂而比身高更宽的男性。"],
			"ssbbw": ["女大胖子", "由于体脂而比身高更宽的女性。"],
			"weight gain": ["体重增加", "通过摄取食物变胖。很可能会调用女胖子或男胖子。"]
		}],
		"Head": ["头", {
			"ahegao": ["阿嘿颜", "表示愉悦的夸张面部表情，通常包括卷起的眼睛、张开的嘴巴和伸出的舌头。常发生在性高潮期间。"],
			"beauty mark": ["美人痣", "一种深色的面部痣，通常靠近眼睛。不包括装饰性面部附加物，例如面带、穿孔、纹身或印章。"],
			"brain fuck": ["脑交", "涉及大脑的性行为。"],
			"cockslapping": ["脸交", "用阴茎敲打一个人（通常是在脸上）。"],
			"crown": ["皇冠", "用于头顶的圆形礼仪头饰。多为君主佩戴。"],
			"ear fuck": ["耳交", "涉及穿透耳朵的性行为。"],
			"elf": ["精灵", "有长而尖的耳朵和典型的细长身体。"],
			"facesitting": ["颜面骑乘", "坐在另一位参与者的脸上或上方。可能用于部分窒息它们或用于与肛门/生殖器区域的口腔接触。有时与调教或性虐待配对。"],
			"facial hair": ["胡子", "下巴、脸颊或上唇有明显的毛发。"],
			"gasmask": ["防毒面具", "一种覆盖面部并包括呼吸管或过滤器的塑料面罩。"],
			"headless": ["无头", "任何在预期中缺少头部的生物。"],
			"hood": ["兜帽", "带有开口的头饰，通常附在外套或衬衫上。"],
			"horns": ["角", "人形生物头部的一个或多个角。"],
			"makeup": ["化妆", "涂在嘴唇、脸颊、睫毛或其他面部区域以突出它们的可见颜色。"],
			"masked face": ["蒙面", "完全覆盖参与者面部的不透明面具，通常用于隐藏他们的身份。这包括典型的巴拉克拉法帽式面具。"],
			"thick eyebrows": ["浓眉", "眉毛至少和主人的手指一样粗。"],
			"tiara": ["头饰", "半圆形礼仪头带，款式可能不同，但靠近前额放置。经常被君主和魔法少女佩戴。"]
		}],
		"Hair": ["头发", {
			"afro": ["黑人头型", "蓬松或浓密的毛发，主要向上呈球状、苔藓状或云状，并围绕主人的头部。"],
			"bald": ["秃头", "头皮上很少或没有头发的头部。"],
			"drill hair": ["钻头发型", "大卷曲/盘绕的头发看起来类似于垂直缠绕或锥形钻头。"],
			"eye-covering bang": ["遮眼刘海", "从头皮前发际线垂下的头发始终覆盖至少一只眼睛。头发上的小裂缝是可以接受的。只要眼睛被遮盖，透视眼也可以接受。"],
			"hair_buns": ["发髻", "将大量头发聚集并固定成一个或多个圆形束。"],
			"hairjob": ["头发交", "使用生殖器上的毛发来创造性快感。"],
			"pixie cut": ["小精灵剪裁", "短发发型，一般顶部梳向脸部，两侧剪短，不低于耳朵，而背部可能会达到颈部。"],
			"ponytail": ["马尾辫", "将大量头发收集并固定在头部后部或侧面的一束尾状中，然后自由悬挂。"],
			"prehensile hair": ["卷发", "参与者有能力控制他或她的头发，就像它是一个肢体一样。"],
			"shaved head": ["剃光头", "只有头发茬的头。"],
			"twintails": ["双马尾", "将大量头发聚集并固定在头部相对两侧的两个尾巴状的束中，然后自由悬挂。"],
			"very long hair": ["很长的头发", "参与者的大部分头发足够长到肚脐以下或附近。由于被捆绑而无法达到该长度的头发不符合条件。"]
		}],
		"Mind": ["大脑", {
			"body swap": ["身体交换", "与另一个参与者交换身体。"],
			"chloroform": ["失去知觉", "任何用于在没有物理力量的情况下使某人失去知觉的物质。可能导致强奸和睡觉。"],
			"corruption": ["腐败", "用魔法或其他超自然力量强行腐蚀参与者的思想，剥夺他们的纯洁。"],
			"drugs": ["药物", "任何用于鼓励滥交或享乐的化学物质。"],
			"drunk": ["醉酒", "一名参与者在性交之前或期间饮酒。应该明显改变他们的情绪和/或行为。通常会导致脸颊发红、眼睛朦胧或迷醉，以及对性的态度更加放松。"],
			"emotionless sex": ["没有感情的性爱", "没有表现出来自性活动的情绪。"],
			"mind break": ["精神失常", "训练/将某人精神上变成性奴隶，通常是通过长时间或严格的性刺激。"],
			"mind control": ["精神控制", "强迫参与者自己做某事，但违背自己的意愿。"],
			"moral degeneration": ["道德堕落", "消除一个人对性的道德立场。必须在不使用强力物质或超自然影响的情况下完成。可能会引发精神崩溃。"],
			"parasite": ["寄生虫", "一种感染宿主的小有机体，通常会引起性刺激。在某些情况下可能被视为拥有。"],
			"personality excretion": ["人格排泄", "参与者将他们的灵魂转移到一个物品中（例如果冻、人造阴道 或精液），然后排出体外，使他们的身体变成一个空壳。"],
			"possession": ["占有", "参与者的身体被外部思想接管，实际上被剥夺了自己的意志。"],
			"shared senses": ["共享感官", "某人与某物或其他人分享他们的感官的情况。"],
			"sleeping": ["睡觉", "与不清醒的人发生性关系。视情况而定，可能算作强奸。"],
			"yandere": ["病娇", "由痴迷的爱所激发的精神病行为。这包括跟踪或绑架感兴趣的人或恐吓或伤害被认为的竞争对手。如果有任何性活动，疯狂的参与者必须在某个时候直接参与其中。"]
		}],
		"Eyes": ["眼睛", {
			"blind": ["盲人", "眼睛完全不能工作的人。"],
			"blindfold": ["眼罩（失去视力）", "一种旨在使人失去视力的眼罩。"],
			"closed eyes": ["闭眼", "一个闭着眼睛或假装睡着的角色。"],
			"cum in eye": ["眼睛里的精液", "射入人的眼睛。"],
			"dark sclera": ["深色眼白", "一个人的眼白是深色的。"],
			"eye penetration": ["眼睛穿透", "眼睛或眼窝中的性行为。"],
			"eyemask": ["眼罩", "眼睛周围区域的覆盖物，仍然使脸部的其余部分暴露在外。"],
			"eyepatch": ["遮住眼睛", "一块布或其他材料覆盖一只眼睛。"],
			"glasses": ["眼镜", "任何带框的透明眼镜戴在双眼前面以改善视力。"],
			"heterochromia": ["异色症", "参与者的虹膜颜色不同。"],
			"monoeye": ["单眼", "一个独眼的类人生物。因任何原因（变形除外）失去一只眼睛的双眼角色不符合资格。"],
			"sunglasses": ["太阳镜", "任何用于在阳光下改善视力的带框、不透明眼镜。"],
			"unusual pupils": ["爱心眼", "学生是或包含奇怪的形状，如心形或星星。"]
		}],
		"Nose": ["鼻子", {
			"nose fuck": ["鼻交", "涉及鼻孔的性行为。"],
			"nose hook": ["鼻钩", "一个钩子用来把鼻孔向上拉开。"],
			"smell": ["气味", "发出强烈的、耸人听闻的气味的行为。"]
		}],
		"Mouth": ["嘴巴", {
			"adventitious mouth": ["嘴巴位置不固定", "至少有一张嘴在身体意想不到的地方（例如手、躯干、尾巴）。"],
			"autofellatio": ["自我口交", "对自己进行口交。"],
			"ball sucking": ["吸睾丸", "用嘴在睾丸上取乐。"],
			"big lips": ["大嘴唇", "嘴巴异常大的嘴唇。嘴唇的高度必须超过人眼的高度才有资格。"],
			"blowjob": ["口交", "涉及口腔和阴茎的性行为。"],
			"blowjob face": ["口交脸", "在口交过程中，在阴茎或物体上以管状方式拉长嘴唇和嘴巴区域。"],
			"braces": ["牙套", "用于对齐和拉直牙齿的装置。"],
			"burping": ["打嗝", "可见的打嗝。"],
			"coprophagia": ["食粪", "吃粪便。"],
			"cunnilingus": ["舔阴", "口服刺激阴道引起性唤起。"],
			"deepthroat": ["深喉", "阴茎进入喉咙的口交。"],
			"double blowjob": ["双根单口交", "两个阴茎插入同一个嘴里。"],
			"foot licking": ["舔脚", "用舌头在脚上引起唤醒。"],
			"gag": ["堵嘴", "任何绑在某人嘴上的东西，部分或完全塞住它。几乎总是涉及束缚。"],
			"gokkun": ["吞精", "饮用或吞咽精液。"],
			"kissing": ["接吻", "两个人将嘴唇压在一起的行为，也可能将他们的舌头伸入对方的嘴里或吮吸对方的嘴巴。"],
			"long tongue": ["长舌头", "参与者的舌头，其长度至少应该能够从嘴巴延伸到参与者的眉毛。"],
			"multimouth blowjob": ["单根多口交", "涉及阴茎和两个或更多嘴巴的性行为。"],
			"piss drinking": ["饮尿", "喝尿液。"],
			"rimjob": ["毒龙", "口服刺激肛门引起性唤起。"],
			"saliva": ["唾液", "将大量口腔分泌物用于性目的。舔或吐不质量。"],
			"smoking": ["吸烟", "一种物质，通常是烟草，在性交过程中被燃烧并品尝或吸入烟雾。"],
			"tooth brushing": ["刷牙", "刷牙以引起性唤起。"],
			"unusual teeth": ["不寻常的牙齿", "牙齿非常锋利、凹陷、张开或缺失。"],
			"vampire": ["吸血鬼", "有尖牙，喝血。必须使用吸血鬼能力或露出尖牙来展示。"],
			"vomit": ["呕吐物", "胃内容物通过嘴或鼻子反流。"],
			"vore": ["丸吞", "通过嘴被整个吞下。"]
		}],
		"Neck": ["脖子", {
			"asphyxiation": ["窒息", "故意限制大脑供氧，通常是为了性唤起。"],
			"collar": ["项圈", "用悬吊的绞索或绕在脖子上的结扎线勒死脖子。人本身不必悬挂在地面上。可能会调用杀戮。"],
			"hanging": ["绞刑", "用悬吊的绞索或绕在脖子上的结扎线勒死脖子。人本身不必悬挂在地面上。可能会调用杀戮。"],
			"leash": ["皮带", "通常系在衣领上或缠绕在脖子上的带子、绳索或链条。经常参与性虐待或宠物游戏活动。"]
		}],
		"Arms": ["腋窝", {
			"armpit licking": ["舔腋窝", "舔参与者腋窝的行为。只舔手臂是不可接受的。"],
			"armpit sex": ["腋窝性爱", "使用腋窝区域刺激阴茎。"],
			"hairy armpits": ["多毛腋窝", "参与者的腋下区域毛发过多。必须足够至少是一团毛发。"]
		}],
		"Hands": ["手", {
			"fingering": ["指交", "用手指创造性快感。"],
			"fisting": ["拳交", "将拳头插入阴道或肛门。"],
			"gloves": ["手套", "衣服覆盖手掌，通​​常是手指。可以将手臂向上延伸至肩部。"],
			"handjob": ["打手枪", "手淫另一个参与者的阴茎。"],
			"multiple handjob": ["单根多人打手枪", "多人同时手淫另一名参与者的阴茎。"]
		}],
		"Breasts": ["乳房", {
			"autopaizuri": ["自我乳交", "对自己进行乳交。"],
			"big areolae": ["大乳晕", "乳头周围有明显的大面积。应至少为乳房表面积的 1/3 才符合条件。"],
			"big breasts": ["大乳", "通常是大乳房。每个乳房应该至少和人的头部一样大。对于Cosplay，这需要D罩杯或更大。"],
			"breast expansion": ["乳房扩张", "乳房大小的任何显着增加。很可能会引起大乳房，也可能是巨大的乳房。"],
			"breast feeding": ["喂奶", "直接吸吮乳房。不需要任何牛奶可见。"],
			"breast reduction": ["乳房缩小", "乳房大小的任何显着减少。可唤起小乳房。"],
			"clothed paizuri": ["穿衣服乳交", "当衣服覆盖了大部分乳房时，进行乳交的动作。必须完全覆盖乳头和乳晕。"],
			"gigantic breasts": ["超巨大乳房", "不可能的大乳房。必须等于或大于人身体其他部分的大小。"],
			"huge breasts": ["巨乳", "异常大的乳房。必须至少是主人头部大小的两倍。"],
			"lactation": ["哺乳期", "乳房喷出液体（通常是牛奶）。"],
			"milking": ["挤奶", "用手或机器拉动乳房排出乳汁。不是为了任何阴茎拉动。"],
			"multiple breasts": ["多个乳房", "单个角色上的任何超过 2 个乳房。"],
			"multiple paizuri": ["多个乳交", "超过一对乳房用于乳交，无论数量多少。"],
			"paizuri": ["乳交", "将阴茎（或类似物体）插入乳房之间的行为。"],
			"small breasts": ["小乳房", "必须足够小才能合理地称女孩为“扁平”。"]
		}],
		"Nipples": ["乳头", {
			"big nipples": ["大乳头", "长到可以用一只手抓住的大乳头。"],
			"dark nipples": ["深色乳头", "颜色较深的乳头，有时与怀孕有关。"],
			"dicknipples": ["鸡巴乳头", "出现或表现得像阴茎的乳头。"],
			"inverted nipples": ["乳头内陷", "缩回乳房内的乳头。通常通过刺激或拉动而被带出。"],
			"multiple nipples": ["多个乳头", "每个乳房有超过 1 个的任意数量的乳头。包括乳房。"],
			"nipple birth": ["乳头出生", "通过乳头出生的生物的行为。"],
			"nipple expansion": ["乳头扩张", "乳头明显增大。可能导致乳头变大。"],
			"nipple fuck": ["乳头交", "阴茎物体刺入乳头或乳房。"]
		}],
		"Torso": ["躯干", {
			"cumflation": ["肚子充满精液肿胀", "胃部由于充满精液而像气球一样向外扩张。"],
			"inflation": ["肚子膨胀", "胃部区域像气球一样向外扩张。通常是由于充满了气体、触手、卵、液体，或者来自食肉或未出生的行为。"],
			"navel fuck": ["肚脐交", "穿透肚脐。"],
			"pregnant": ["怀孕", "涉及明显怀孕的参与者的性活动或裸体。"],
			"stomach deformation": ["胃变形", "一个固体物体从内部推向胃并产生可见的突起。通常由大插入或大阴茎引起。"]
		}],
		"Crotch": ["裆部", {
			"bike shorts": ["自行车短裤", "短款、有弹性、紧身裤（但更多地作为内衣穿着），旨在提高骑车时的舒适度。"],
			"bloomers": ["灯笼裤", "主要为日本女学生设计的健身服。通常为蓝色或红色。"],
			"chastity belt": ["贞操带", "用于防止性交或手淫的锁定衣物。有时与性虐待配对。"],
			"crotch tattoo": ["胯部纹身", "下腹部和胯部之间区域的任何明显图案/标志。"],
			"diaper": ["尿布", "一种用于谨慎排便或小便的内衣；经常被婴儿佩戴。通常与年龄退化、粪便、幼稚或排尿配对。"],
			"fundoshi": ["传统日式内衣", "一种传统的日本内衣，由一段棉制成。"],
			"gymshorts": ["运动短裤", "短款运动裤，颜色和长度可能会有所不同。"],
			"hairy": ["大量阴毛", "明显大量的阴毛。"],
			"hotpants": ["热裤", "用于强调臀部和腿部的短裤。"],
			"mesuiki": ["自发高潮", "对象在没有任何物理刺激阴茎或阴道的情况下达到高潮的性行为。"],
			"multiple orgasms": ["多重高潮", "参与者在同一会话中连续达到三个以上的高潮。"],
			"pantyjob": ["内裤交", "在生殖器上摩擦内裤。"],
			"pubic stubble": ["阴毛茬", "剃光的阴部，留有可见的发茬。"],
			"shimapan": ["条纹内裤", "shima pantsu 的缩写，意为条纹内裤。"],
			"urethra insertion": ["尿道插入", "将任何东西引入尿液排出体外的管中。"]
		}],
		"Penile": ["阴茎", {
			"adventitious penis": ["阴茎位置不固定", "至少有一个阴茎在身体上意想不到的地方（例如手、嘴、尾巴）。"],
			"balls expansion": ["睾丸扩张", "睾丸变大。可能导致大球。"],
			"ball sucking": ["吸睾丸", "用嘴在睾丸上取乐。"],
			"balljob": ["睾丸交", "睾丸的使用方式与乳交相同。"],
			"big balls": ["大睾丸", "异常大的睾丸。一个球至少和一只手一样大就足够了。"],
			"big penis": ["大阴茎", "一个异常大的阴茎，至少和主人的前臂一样大。"],
			"cbt": ["折磨阴茎睾丸", "阴茎和睾丸的折磨。旨在以任何方式折磨阴茎区域的行为。"],
			"cockphagia": ["阴茎吞下", "通过阴茎整个吞下。可能会引起大阴茎和尿道插入。"],
			"cuntboy": ["只有屄男孩", "男性有阴道而没有阴茎。"],
			"cock ring": ["阴茎环", "戴在阴茎和/或阴囊轴上的戒指。不要与贞操带混淆，但不会取消它的资格。用作虫洞的环不符合条件。"],
			"cockslapping": ["用阴茎敲打", "用阴茎敲打一个人（通常是在脸上）。"],
			"dick growth": ["阴茎增长", "阴茎异常生长。可能会导致阴茎变大。"],
			"dickgirl on male": ["扶她/人妖x男", "女性阴茎插入男性，无论是肛门还是口腔。"],
			"dickgirls only": ["只有扶她", "画廊中的所有性、恋物或亲密互动都仅限于扶她之间。需要至少两个扶她互动。"],
			"frottage": ["阴茎互相摩擦", "两个或多个阴茎相互摩擦。"],
			"futanari": ["扶她有阴道", "参与者既有阴茎又有阴道。"],
			"horse cock": ["马阴茎", "马形阴茎。很可能会调用大阴茎标签。"],
			"huge penis": ["巨大阴茎", "一个巨大的阴茎；至少与主人的躯干长度或周长相等."],
			"multiple penises": ["多根阴茎", "拥有不止一个阴茎。不适用于触手式阴茎。"],
			"penis birth": ["阴茎分娩", "通过阴茎出生的生物的行为。"],
			"phimosis": ["包茎", "阴茎包皮覆盖度非常高。即使它是直立的，也应该几乎完全覆盖。"],
			"prostate massage": ["前列腺按摩", "摩擦肛门内壁，靠近睾丸。"],
			"shemale": ["人妖", "有男性生殖器但没有阴道的女孩。"],
			"scrotal lingerie": ["阴囊内衣", "在阴茎生殖器上穿的色情服装。"],
			"small penis": ["小阴茎", "异常娇小的阴茎；必须小于其主人的食指。对于正太控，请使用小指。"],
			"smegma": ["包皮垢", "各种物质聚集在龟头和包皮之间或阴蒂和小阴唇周围的潮湿区域。"]
		}],
		"Vaginal": ["阴道", {
			"adventitious vagina": ["阴道位置不固定", "在身体意想不到的地方（例如手、嘴、上身）有阴道。"],
			"big clit": ["大阴蒂", "异常大的阴蒂。"],
			"big vagina": ["大阴道", "异常大的阴道，有时只是嘴唇。"],
			"birth": ["分娩", "一个活生生的生物出生的行为。通常在怀孕之前。"],
			"cervix penetration": ["子宫颈穿透", "女性的子宫颈/子宫被明显穿透。很可能与X 射线标签一起调用。"],
			"cervix prolapse": ["子宫颈脱垂", "阴道壁从阴道外扩张。有时前面会张开。"],
			"clit growth": ["阴蒂增长", "阴蒂的生长，通常会导致一个大阴蒂。"],
			"clit insertion": ["阴蒂插入", "插入阴道或肛门的阴蒂。通常涉及一个大阴蒂。"],
			"clit stimulation": ["阴蒂刺激", "刺激阴蒂。"],
			"cunnilingus": ["舔阴", "口服刺激阴道引起性唤起。"],
			"cuntbusting": ["折磨阴道", "物理攻击阴道的行为。"],
			"defloration": ["破瓜", "女性失去童贞的行为。通常包括轻微出血。"],
			"double vaginal": ["双阴道", "两个阴茎插入同一个阴道。"],
			"multiple vaginas": ["多个阴道", "拥有多个阴道。"],
			"squirting": ["潮吹", "女性射精强烈。"],
			"strap-on": ["绑戴假阳具", "一个可连接的假阳具。很可能是男性被肛交或百合的一部分。"],
			"tribadism": ["磨镜", "涉及女性互相摩擦外阴的性行为。很可能会调用百合。"],
			"triple vaginal": ["三重阴道", "三个阴茎、性玩具或其他物体插入同一个阴道。"],
			"unbirth": ["反向出生", "一名参与者被阴道吞食。基本上是反向出生（因此不需要它或怀孕标签）。"],
			"vaginal sticker": ["阴道贴", "用粘合剂或其他方式覆盖阴道区域的任何类型的贴片。"]
		}],
		"Buttocks": ["臀部", {
			"anal": ["肛门", "穿透肛门。任何方法都可以接受（性玩具、触手等）"],
			"anal birth": ["肛门分娩", "通过肛门出生的生物的行为。通常���怀孕之前。"],
			"anal intercourse": ["肛交", "参与者用阴茎或穿戴的绑带刺入另一参与者的肛门。"],
			"analphagia": ["肛吞", "通过肛门整个吞下。"],
			"anal prolapse": ["脱肛", "肛门壁从肛门扩张。有时前面会张开。"],
			"ass expansion": ["屁股扩张", "臀部因任何原因而增长。很可能招惹大屁股。"],
			"assjob": ["屁股缝交", "在两颊之间摩擦阴茎。"],
			"big ass": ["大屁股", "臀部明显宽或大。"],
			"double anal": ["双根肛门", "两个阴茎插入同一个肛门。"],
			"enema": ["灌肠", "液体或空气注入肛门。可能引起通货膨胀。存在包括所有图像，其中液体在参与者的身体内或流入/流出参与者的身体。"],
			"farting": ["放屁", "可见的胀气。"],
			"multiple assjob": ["多个屁股缝交", "不止一个人在他们的屁股颊之间摩擦阴茎。"],
			"pegging": ["男性被肛交", "男性被绑带或性玩具肛门穿透。"],
			"rimjob": ["毒龙", "口服刺激肛门引起性唤起。"],
			"scat": ["排便", "排便（拉屎）。"],
			"spanking": ["打屁股", "打屁股是一种折磨或性快感。"],
			"tail": ["尾巴", "一个或多个突出的柔性附肢，是身体的一部分，通常从躯干后部突出。没有腿的身体不符合条件。"],
			"tail plug": ["尾巴性玩具", "任何类型的尾巴性玩具。"],
			"tailphagia": ["尾吞", "被一条尾巴整个吞下。"],
			"triple anal": ["三根肛门", "三个阴茎插入同一个肛门。"]
		}],
		"Either Hole": ["任意洞", {
			"eggs": ["鸡蛋", "在自己体内产卵或产卵的行为。经常引发通货膨胀。"],
			"gaping": ["张开", "性交后明显伸展的阴道或肛门。通常由大插入、拳交、大或巨大的阴茎引起。"],
			"large insertions": ["大插入", "将性玩具或其他似乎不太可能舒适地放入接收所述物体的物体中。"],
			"nakadashi": ["中出", "射精停留在嘴以外的任何孔道内。通常包括外部精液池。"],
			"prolapse": ["脱垂", "阴道壁或肛门壁从各自的孔中扩张出来。有时前面会张开。"],
			"sex toys": ["性玩具", "任何用于性目的的玩具。"],
			"speculum": ["窥器", "一种用于扩张开放体腔（如肛门或阴道）的医疗器械。经常调用张开。"],
			"unusual insertions": ["不寻常的插入", "将通常不用于性活动或医疗检查的无生命物体插入生殖器或肛门的行为。"]
		}],
		"Legs": ["腿", {
			"garter belt": ["吊袜带", "一种带夹子的腰带状内衣，用来夹住长袜。"],
			"kneepit sex": ["膝盖性爱", "使用膝盖下方刺激阴茎或类似物体。"],
			"leg lock": ["锁腿", "用双腿抱住性伴侣。"],
			"legjob": ["腿交", "用腿刺激另一个人。"],
			"pantyhose": ["连裤袜", "一种通常透明的单件内衣，能够完全覆盖腿部和生殖器区域。"],
			"stirrup legwear": ["马镫护腿", "覆盖脚踝但不完全覆盖脚底的裤袜。需要长袜或连裤袜标签。"],
			"stockings": ["丝袜", "一种通常透明的弹性服装，覆盖脚部和腿部下部，但不到达生殖器区域。"],
			"sumata": ["素股", "使用大腿刺激阴茎物体的性爱。"]
		}],
		"Feet": ["脚", {
			"denki anma": ["電気按摩", "一名参与者用他们的脚强烈地压迫另一名参与者的胯部区域，通常是同时握住他们的腿。如果这对被压迫的人产生性刺激，则会调用脚交。可能会引发性虐待、两女格斗、调教或摔跤"],
			"foot insertion": ["脚插入", "将一只或多只脚插入阴道等孔口。"],
			"foot licking": ["舔脚", "用舌头在脚上引起唤醒。"],
			"footjob": ["脚交", "用脚对另一名参与者进行性刺激。"],
			"multiple footjob": ["多重脚交", "多人同时使用脚对同一参与者进行性刺激。"],
			"sockjob": ["袜交", "涉及在生殖器上摩擦袜子的性行为。"],
			"stirrup legwear": ["马镫腿装", "覆盖脚踝但不完全覆盖脚底的裤袜。需要长袜或连裤袜标签。"],
			"thigh high boots": ["大腿高筒靴", "超过膝盖的靴子。"]
		}],
		"Costume": ["戏服", {
			"animegao": ["全身动漫服装", "一种全身服装，包括一个全面罩或头部，描绘了一个模仿角色，通常由角色扮演者穿着。"],
			"apparel bukkake": ["精液服装", "旧衣服或其他配饰被精液覆盖或充满。"],
			"apron": ["围裙", "做饭时常穿的保护衣服。通常出于色情目的而穿着。"],
			"bandages": ["绷带", "布条或类似材料缠绕在至少 10% 的人体上并且可见。"],
			"bandaid": ["创可贴", "将创可贴放置在阴部或乳头上。"],
			"bat boy": ["蝙蝠男孩", "男版蝙蝠女。"],
			"bat girl": ["蝙蝠女孩", "一种女性类人生物，有翅膀、耳朵，有时还有尾巴或蝙蝠的其他显着特征。"],
			"bike shorts": ["自行车短裤", "短款、有弹性、紧身裤（但更多地作为内衣穿着），旨在提高骑车时的舒适度。"],
			"bikini": ["比基尼", "覆盖生殖器和乳房的两件式泳装。这两件可以用绳子（又名弹弓比基尼）连接，但更常见的是完全分开。"],
			"blindfold": ["眼罩", "一种旨在使人失去视力的眼罩。"],
			"bloomers": ["灯笼裤", "主要为日本女学生设计的健身服。通常为蓝色或红色。"],
			"bodystocking": ["紧身连衣裤", "一种覆盖大部分身体的长袜。"],
			"bodysuit": ["紧身衣裤", "任何合身的全身套装；必须遮住胳膊和腿。"],
			"bride": ["新娘", "一个穿着婚纱的人。"],
			"bunny boy": ["兔男孩", "男版兔女郎。"],
			"bunny girl": ["兔女郎", "兔耳朵，偶尔也有蓬松的尾巴。"],
			"business suit": ["西装", "一个穿着职业装的人。"],
			"butler": ["管家", "一名家庭佣工，经常为大家庭的富裕家庭服务。穿燕尾服，系领带或领结。"],
			"cashier": ["收银员", "站在柜台后面或在商店工作的人，穿着制服，上面系着围裙。"],
			"catboy": ["猫男孩", "男版猫娘。"],
			"catgirl": ["猫女孩", "有耳朵，通常有尾巴或猫的其他特征。"],
			"cheerleader": ["啦啦队长", "啦啦队制服，通常搭配短裙和配套配饰。"],
			"chinese dress": ["中国装", "一件紧身连体连衣裙，通常带有简单或花卉图案。"],
			"christmas": ["圣诞节", "通常与圣诞老人相关的服装，主要使用红色织物和白色饰边。"],
			"clothed female nude male": ["穿衣女x裸男", "男性的生殖器完全暴露给非裸体女性。"],
			"clothed male nude female": ["穿衣男x裸女", "女性的生殖器完全暴露在非裸体男性面前。"],
			"clown": ["小丑", "带有褶边衣领和衣服的白脸。通常强调面部特征，例如大红鼻子和嘴唇以及颜色醒目的头发。"],
			"cock ring": ["阴茎环", "戴在阴茎和/或阴囊轴上的戒指。不要与贞操带混淆，但不会取消它的资格。用作虫洞的环不符合条件。"],
			"collar": ["衣领", "系在脖子上或围住脖子的衣服。经常在性虐待或宠物游戏活动中佩戴，可能包括皮带。"],
			"condom": ["避孕套", "一种塑料包装，旨在保护用户和伴侣免受不必要的性病和怀孕的伤害。"],
			"corset": ["紧身胸衣", "用来固定和塑造躯干的衣服，通常是沙漏形。"],
			"cosplaying": ["角色扮演", "一个参与者装扮成一个模仿系列中的另一个角色。不包括通用角色扮演，例如学校、护士或女仆制服。"],
			"cowgirl": ["牛女孩", "有牛耳朵、牛角，可能还有尾巴和牛铃。可能有荷斯坦图案（白色带黑色斑点）。常与大胸搭配。"],
			"cowman": ["牛男孩", "男版女牛仔。"],
			"crossdressing": ["变装", "通常男性穿着女性服装，但也可能相反。对于后者，只有在有明确意图让女性穿得像个男人的情况下才应该标记它。"],
			"diaper": ["尿布", "一种用于谨慎排便或小便的内衣；经常被婴儿佩戴。通常与年龄退化、粪便、幼稚或排尿配对。"],
			"dougi": ["武术训练服装", "通常用于各种武术课程和训练的服装。通常单色搭配腰带。"],
			"exposed clothing": ["衣着暴露", "任何一种带有开口的衣服，使他人可以看到生殖器区域、肛门或乳头。"],
			"eyemask": ["眼罩", "眼睛周围区域的覆盖物，仍然使脸部的其余部分暴露在外。"],
			"eyepatch": ["布料遮眼", "一块布或其他材料覆盖一只眼睛。"],
			"fishnets": ["渔网", "由带有开口菱形针织图案的材料制成的服装制品。必须在至少一半的躯干或肢体（例如大腿、前臂等）上可见"],
			"fundoshi": ["传统日式内衣", "一种传统的日本内衣，由一段棉制成。"],
			"gag": ["堵嘴", "任何绑在某人嘴上的东西，部分或完全塞住它。几乎总是涉及束缚。"],
			"garter belt": ["吊袜带", "一种带夹子的腰带状内衣，用来夹住长袜。"],
			"gasmask": ["防毒面具", "一种覆盖面部并包括呼吸管或过滤器的塑料面罩。"],
			"glasses": ["眼镜", "任何带框的透明眼镜戴在双眼前面以改善视力。"],
			"gloves": ["手套", "衣服覆盖手掌，通​​常是手指。可以将手臂向上延伸至肩部。"],
			"gymshorts": ["运动短裤", "短款运动裤，颜色和长度可能会有所不同。"],
			"haigure": ["紧身衣女孩", "一个穿着紧身衣服的女孩，手臂和腿弯曲，强调胯部区域。"],
			"headphones": ["耳机", "将耳机戴在头上或脖子上的人。耳机罩必须足够大以覆盖耳朵。"],
			"hijab": ["头巾", "一种面纱，覆盖头部，通常是胸部，主要隐藏头发。"],
			"hotpants": ["热裤", "用于强调臀部和腿部的短裤。"],
			"kemonomimi": ["兽耳", "具有动物耳朵和尾巴但几乎没有其他动物部位的类人生物。"],
			"kigurumi pajama": ["兽耳睡衣", "带有兜帽的连体衣，描绘了一种动物。"],
			"kimono": ["和服", "带有大丝带和不同图案的传统日本服装。"],
			"kindergarten uniform": ["幼儿园制服", "一个人穿着一件带有假领的简单浅蓝色套头衫，通常搭配黄色无檐小便帽或校帽。"],
			"kunoichi": ["女忍者服装", "女忍者服装。通常是深色长袍和/或带有一些轻型盔甲的渔网。"],
			"lab coat": ["实验服", "一件白色的长外套。医生、科学家或学校护士经常佩戴。"],
			"latex": ["乳胶", "任何基于橡胶或塑料的衣服，通常是紧身的。"],
			"leash": ["皮带", "通常系在衣领上或缠绕在脖子上的带子、绳索或链条。经常参与性虐待或宠物游戏活动。"],
			"leotard": ["紧身衣", "常用于体操、兔女郎和摔跤的塑料服装。"],
			"lingerie": ["内衣", "为了增加性感而穿着的轻薄或性感的内衣；与普通内衣相反。还包括睡衣。"],
			"living clothes": ["生活服", "根据自己的意愿移动的衣服。"],
			"magical girl": ["魔法少女", "一种服装，包括该类型常见的裙子和褶边制服。"],
			"maid": ["女仆", "一种女仆制服，通常由各种长度的连衣裙或裙子和围裙组成。单独的头带不符合条件。"],
			"mecha boy": ["机甲男孩", "男版机甲少女。"],
			"mecha girl": ["机甲女孩", "一名穿着机械零件的女性。"],
			"metal armor": ["金属盔甲", "在中世纪或中世纪幻想时代穿着的金属盔甲。"],
			"miko": ["巫女", "神社少女；一位年轻的女祭司。通常穿着红色长裤或带蝴蝶结的红色略带褶皱的长裙和带有一些白色或红色发带的白色羽织（和服夹克）。"],
			"military": ["军事", "任何常见的军装，如迷彩服或军官制服。"],
			"mouth mask": ["口罩", "只覆盖眼睛下方的面具。"],
			"nazi": ["纳粹", "佩戴任何纳粹用具。"],
			"ninja": ["忍者", "男忍者服装。通常是深色衣服和一些轻型盔甲。"],
			"nose hook": ["鼻钩", "一个钩子用来把鼻孔向上拉开。"],
			"nun": ["修女", "穿着典型的黑色布长袍，按照罗马天主教的命令穿着。也可能戴着头巾、念珠和面纱。"],
			"nurse": ["护士", "穿着常见的白色/粉色套装或磨砂，通常有帽子。"],
			"pantyhose": ["连裤袜", "一种通常透明的单件内衣，能够完全覆盖腿部和生殖器区域。"],
			"pasties": ["馅饼", "贴有粘合剂的覆盖乳头和乳晕的贴片。"],
			"piercing": ["穿孔", "除了耳朵上的任何形式的穿孔。通常在阴蒂或乳头上放置戒指。"],
			"pirate": ["海盗", "海盗装。通常是带有角帽或大手帕的飘逸背心。通常有腰带、马裤和带有蓬松袖子的紧身衣。"],
			"policeman": ["警察", "男版女警。"],
			"policewoman": ["女警察", "穿着典型的警察制服。通常有徽章、衬衫上的小袋和枪套。男性版本见警察。"],
			"ponygirl": ["小马女", "一个女人穿着齿轮，如钻头/缰绳、眼罩、缰绳或马尾。可以骑在身上或以其他方式像动物一样对待。"],
			"priest": ["牧师", "任何宗教团体的神职人员所穿的服装。通常是白领长袍或西装。"],
			"race queen": ["赛车皇后", "一种紧身且通常很轻薄的制服，带有公司标志。可能会调用紧身衣裤或乳胶。"],
			"randoseru": ["皮革背包", "由皮革或类似皮革的合成材料制成的背包，最常用于小学生。"],
			"sarashi": ["束胸", "一种缠在腹部/胸部区域的长而类似绷带的布。对于男性，它通常覆盖女性的腹部和胸部。"],
			"scrotal lingerie": ["阴囊内衣", "在阴茎生殖器上穿的色情服装。"],
			"shimapan": ["条纹内裤", "shima pantsu 的缩写，意为条纹内裤。"],
			"stewardess": ["空姐制服", "在公共汽车、电梯或飞机上工作的人的制服。"],
			"steward": ["管家制服", "在公共汽车、电梯或飞机上工作的人的制服。"],
			"stirrup legwear": ["马镫腿裤", "覆盖脚踝但不完全覆盖脚底的裤袜。需要长袜或连裤袜标签。"],
			"stockings": ["丝袜", "一种通常透明的弹性服装，覆盖脚部和腿部下部，但不到达生殖器区域。"],
			"straitjacket": ["紧身衣", "一种躯干服装，长袖，超过穿着者的手臂，可以系在一起以限制他们的运动。"],
			"swimsuit": ["泳装", "专为游泳或其他水上活动而穿着的服装，通常覆盖整个躯干。"],
			"sundress": ["背心裙", "一种轻质面料的非正式连衣裙，通常是宽松的，没有分层上衣。"],
			"sunglasses": ["太阳镜", "任何用于在阳光下改善视力的带框、不透明眼镜。"],
			"thigh high boots": ["大腿高筒靴", "超过膝盖的靴子。"],
			"tiara": ["头饰", "半圆形礼仪头带，款式可能不同，但靠近前额放置。经常被君主和魔法少女佩戴。"],
			"tights": ["紧身衣", "西方超级英雄经常穿的紧身衣服。既可以用于腿，也可以用于身体。"],
			"tracksuit": ["运动服", "由合成材料制成的配套衬衫和裤子，用于在运动或运动中产生出汗。性交时只需要穿上衣服的一部分。"],
			"transparent clothing": ["透明衣", "任何一种在穿着时覆盖胯部或胸部的透明衣服。仅当服装在这些区域中的任何一个设计为透明时才适用。"],
			"vaginal sticker": ["阴道贴", "用粘合剂或其他方式覆盖阴道区域的任何类型的贴片。"],
			"waiter": ["服务员", "男版女服务员。"],
			"waitress": ["女服务员", "在餐厅工作的女孩穿的制服；通常是浅色连衣裙，有时包括围裙或裙子。"],
			"wet clothes": ["湿衣服", "穿着的衣服因水或其他液体而潮湿和透明。"],
			"witch": ["女巫", "一顶宽檐高尖帽，通常穿着布袍。"]
		}],
		"Multiple Activities": ["多人运动", {
			"bisexual": ["双性恋", "在整个画廊中与同性和异性进行性活动的参与者。"],
			"double anal": ["双根单肛门", "两个阴茎插入同一个肛门。"],
			"double blowjob": ["双根单口交", "两个阴茎插入同一个嘴里。"],
			"double vaginal": ["双阴道", "两个阴茎插入同一个阴道。"],
			"fff threesome": ["三女", "包含三名女性的三人组。"],
			"ffm threesome": ["两女一男", "一个三人组，包含两个女性和一个男性。"],
			"fft threesome": ["两女一变性", "三人组包含两名女性和一名变性人（双性人或人妖）。"],
			"group": ["群交", "两个以上的参与者同时进行性行为。"],
			"harem": ["后宫", "1 ��被至少 3 人追求，所有人同时进行自愿性行为。"],
			"layer cake": ["千层蛋糕", "阴茎在两个阴道之间摩擦。可能涉及每个阴道之间的交替渗透。"],
			"mmf threesome": ["两男一女", "包含两男一女的三人组。"],
			"mmm threesome": ["三男", "三人组包含三名男性。"],
			"mmt threesome": ["两男一变性", "三人组，包含两名男性和一名变性人（双性人或人妖）。"],
			"mtf threesome": ["一男一女一变性", "三人组包含一名男性、一名变性人（双性人或人妖）和一名女性。"],
			"multimouth blowjob": ["多口口交", "涉及阴茎和两个或更多嘴巴的性行为。"],
			"multiple assjob": ["多屁股交", "不止一个人在他们的屁股颊之间摩擦阴茎。"],
			"multiple footjob": ["单根多足交", "多人同时使用脚对同一参与者进行性刺激。"],
			"multiple handjob": ["单根多手交", "多人同时手淫另一名参与者的阴茎。"],
			"multiple paizuri": ["多乳交", "超过一对乳房用于乳交，无论数量多少。"],
			"multiple straddling": ["多跨骑", "多人同时跨骑并与同一参与者发生性关系。可能会调用颜面骑乘。"],
			"oyakodon": ["母娘丼", "一组父母和他们的一个（或多个）孩子同时与同一个伴侣进行性活动。"],
			"shimaidon": ["姉妹丼", "一群兄弟姐妹同时与同一个伴侣进行性活动。"],
			"triple anal": ["三重肛门", "三个阴茎插入同一个肛门。"],
			"triple vaginal": ["三重阴道", "三个阴茎、性玩具或其他物体插入同一个阴道。"],
			"ttf threesome": ["两变性一女", "三人组包含两名变性人（双性人或人妖）和一名女性。"],
			"ttm threesome": ["两变性一男", "三人组包含两名变性人（双性人或人妖）和一名男性。"],
			"ttt threesome": ["三变性", "三人组包含三个扶她或人妖的任意组合。"],
			"twins": ["双胞胎", "一对长相相似的兄弟姐妹与第三人或彼此发生性关系。可能会调用群交和姉妹丼标签。"]
		}],
		"Multiple Holes": ["多个洞", {
			"all the way through": ["全身挿入", "有东西从人的嘴巴穿过人的身体后孔，反之亦然。很可能是通过大插入或触手完成的。"],
			"double penetration": ["二穴", "同时插入两个孔（嘴、阴道或屁股）。很可能调用组标签。"],
			"triple penetration": ["三穴", "三个插入同时发生在一个人身上。组合通常是双渗透，其余孔也被渗透，或双阴道/双肛门，另一个后孔被渗透。"]
		}],
		"Tools": ["工具", {
			"blindfold": ["眼罩（失去视力）", "一种旨在使人失去视力的眼罩。"],
			"clamp": ["夹子", "一个或多个夹在身体上以引起疼痛和/或性快感。通常是指专门用于束缚游戏的乳头或阴蒂夹，但也可能涉及常见的家居用品，如衣夹或纸扣。"],
			"dakimakura": ["动漫抱枕", "一个全身印有人物图案的身体枕头。对于抱枕风格的图像也可以接受。"],
			"gag": ["堵嘴", "任何绑在某人嘴上的东西，部分或完全塞住它。几乎总是涉及束缚。"],
			"glory hole": ["墙洞", "墙上的一个洞是用来进行性活动的。"],
			"machine": ["机器", "具有机械结构的性爱。"],
			"onahole": ["人造阴道", "用于手淫阴茎的人造阴道。"],
			"pillory": ["颈手枷", "通常是木制外壳或专门限制头部和手部运动的装置。"],
			"pole dancing": ["钢管舞", "为了色情目的，带着或绕着一根垂直杆跳舞。"],
			"real doll": ["真人娃娃", "现实生活中的人形娃娃，用于性目的。"],
			"sex toys": ["性玩具", "任何用于性目的的玩具。"],
			"speculum": ["窥镜", "一种用于扩张开放体腔（如肛门或阴道）的医疗器械。经常调用张开。"],
			"strap-on": ["绑带式", "一个可连接的假阳具。很可能是男性被肛交或百合的一部分。"],
			"syringe": ["注射器", "一种由管子、柱塞和连接的针头组成的工具。用于向参与者注射不同种类的液体或气体。"],
			"table masturbation": ["桌上自慰", "使用桌子作为自慰工具，用生殖器摩擦桌子。"],
			"tail plug": ["尾塞", "需要性玩具和肛门标签。不要与真正的尾巴���淆。"],
			"tube": ["管子", "任何插入口腔以输送液体或身体物质的圆柱形管道。"],
			"unusual insertions": ["不寻常的插入", "将通常不用于性活动或医疗检查的无生命物体插入生殖器或肛门的行为。"],
			"vacbed": ["真空床", "用于性虐待或束缚游戏的真空床。"],
			"whip": ["鞭子", "一种鞭打或打击动物或人以造成中等程度疼痛的工具。以这种方式使用任何性对象也很重要。极有可能涉及性虐待。"],
			"wooden horse": ["木马", "任何具有三角形向上指向的装置，受害者被要求跨骑/安装在顶部，通常将他们的体重放在他们的生殖器上。"],
			"wormhole": ["虫洞", "连接两个遥远位置的一个或多个对象。通常表现为“移动荣耀洞”的一种形式，男性或女性可以通过虫洞获得各自的生殖器。"]
		}],
		"Fluids": ["流体", {
			"oil": ["油", "参与者至少部分覆盖有润滑剂，如身体油，以赋予其皮肤光滑的质地/光滑的外观。"],
			"slime": ["史莱姆", "任何与性有关的粘稠/凝胶状物质。基于粘液的生物需要这个和怪物标签。"],
			"slime boy": ["史莱姆男孩", "一个男孩，他的身体完全是用粘液制成的。"],
			"slime girl": ["史莱姆女孩", "一个身体主要由粘液制成的女孩。"],
			"underwater": ["水下", "参与者在性交过程中大部分或完全浸没在液体中。"]
		}],
		"Bodily Fluids": ["体液", {
			"blood": ["血液", "描绘大量血液，例如从身体伤口流出的血液。"],
			"lactation": ["哺乳", "乳房喷出液体（通常是牛奶）。"],
			"milking": ["挤奶", "用手或机器拉动乳房排出乳汁。不是为了任何阴茎拉动。"],
			"saliva": ["唾液", "将大量口腔分泌物用于性目的。舔或吐不质量。"],
			"squirting": ["喷出", "女性射精强烈。"]
		}],
		"Semen": ["精液", {
			"apparel bukkake": ["精液服装", "旧衣服或其他配饰被精液覆盖或充满。"],
			"bukkake": ["颜射", "被精液覆盖的行为，通常不止一个人。"],
			"cum bath": ["精子浴", "浴缸、水池或另一个装满精液的大容器，其中至少有一个人部分浸没在其中。"],
			"cum in eye": ["射在眼睛", "射入人的眼睛。"],
			"cum swap": ["精液交换", "在 2 名或更多参与者之间交换已经射精的精液。"],
			"cumflation": ["胃充满精液像气球", "胃部由于充满精液而像气球一样向外扩张。"],
			"giant sperm": ["肉眼可见精子", "肉眼可见的单个精子细胞，无需任何放大。"],
			"gokkun": ["吞精", "饮用或吞咽精液。"],
			"nakadashi": ["中出", "射精停留在嘴以外的任何孔道内。通常包括外部精液池。"]
		}],
		"Waste": ["排泄", {
			"coprophagia": ["食粪", "吃粪便。"],
			"internal urination": ["小便", "另一名参与者的尿液在除嘴巴外的任何孔口内徘徊。通常包括排尿后。"],
			"menstruation": ["月经", "作为女性月经周期的副产品，阴道流血；不是外伤引起的。与卫生棉条和卫生巾密切相关。"],
			"omorashi": ["漏尿", "一个角色拿着一个充满膀胱，要么弄湿自己，要么靠近。"],
			"piss drinking": ["饮尿", "喝尿液。"],
			"public use": ["肉便器", "一个人保持静止并公开进行性行为，通常与多个伴侣一起。经常涉及它们被用作生活厕所/小便池。可能包括或导致正文写作。"],
			"scat": ["便便", "排便（拉屎）。"],
			"sweating": ["出汗", "参与者身上有大量汗水滴落。"],
			"urination": ["放尿", "小便。"],
			"vomit": ["呕吐", "胃内容物通过嘴或鼻子反流。"]
		}],
		"Force": ["能力", {
			"chikan": ["痴汉", "以性方式抚摸或触摸他人的行为。很少自愿，经常发生在火车或公共汽车上。"],
			"rape": ["强奸", "强迫或非自愿的性行为。"],
			"sleeping": ["睡奸", "与不清醒的人发生性关系。视情况而定，可能算作强奸。"],
			"time stop": ["时间停止", "至少一名参与者的时间停止或改变，而另一名参与者利用这种情况进行性利用。"]
		}],
		"Sadomasochism": ["施虐受虐", {
			"bdsm": ["性虐待", "一种生活方式，其中至少一个伴侣占主导地位，至少另一个伴侣是顺从的。不需要束缚或���磨标签，但可能导致两者之一或两者。"],
			"bodysuit": ["紧身衣裤", "任何合身的全身套装；必须遮住胳膊和腿。"],
			"blindfold": ["眼罩（失去视力）", "一种旨在使人失去视力的眼罩。"],
			"clamp": ["夹子", "一个或多个夹在身体上以引起疼痛和/或性快感。通常是指专门用于束缚游戏的乳头或阴蒂夹，但也可能涉及常见的家居用品，如衣夹或纸扣。"],
			"collar": ["衣领", "系在脖子上或围住脖子的衣服。经常在bdsm或宠物游戏活动中佩戴，可能包括皮带。"],
			"femdom": ["调教", "女性的性支配。通常超过男性，但可以超过另一个女性。"],
			"food on body": ["身上放食物", "食物（尤其是寿司）呈现在赤裸的身体上。"],
			"forniphilia": ["人体家具", "将参与者用作家具。"],
			"human cattle": ["人类牲畜", "人类作为牲畜饲养，通常用于挤奶和/或繁殖。经常涉及束缚。"],
			"josou seme": ["女装施虐", "一个变装者或假女孩带头/对性伴侣占主导地位。"],
			"latex": ["乳胶", "任何基于橡胶或塑料的衣服，通常是紧身的。"],
			"orgasm denial": ["拒绝高潮", "通过工具等方式阻止某人达到性高潮。"],
			"petplay": ["人类宠物", "将参与者视为宠物。通常涉及项圈和可能的性虐待。"],
			"slave": ["奴隶", "强迫参与者出于性目的而成为奴役。如果这是自愿使用性虐待代替。"],
			"tickling": ["挠痒痒", "以导致不自主抽搐动作或笑声的方式触摸身体。通常用羽毛完成。"]
		}],
		"Bondage": ["束缚", {
			"bondage": ["捆绑", "需要为颈手枷、绳艺、卡在墙上和木马标签。"],
			"gag": ["堵嘴", "任何绑在某人嘴上的东西，部分或完全塞住它。几乎总是涉及束缚。"],
			"harness": ["吊带", "服装由皮革带组成，由金属环固定在一起，环绕穿着者的身体。"],
			"pillory": ["颈手枷", "通常是木制外壳或专门限制头部和手部运动的装置。"],
			"ponygirl": ["小马女", "一个女人穿着齿轮，如钻头/缰绳、眼罩、缰绳或马尾。可以骑在身上或以其他方式像动物一样对待。"],
			"shibari": ["绳艺", "一种艺术绳索系在躯干周围的方法，以创造视觉上独特的图案。"],
			"straitjacket": ["紧身衣", "一种躯干服装，长袖，超过穿着者的手臂，可以系在一起以限制他们的运动。"],
			"stuck in wall": ["卡在墙上", "有人被困在一个长长的表面上，无法移动，经常有生殖器或其他非肢体身体部位悬空。"],
			"vacbed": ["真空床", "用于性虐待或束缚游戏的真空床。"]
		}],
		"Violence": ["暴力", {
			"abortion": ["堕胎", "任何关于杀害未出生婴儿的描述，即使是隐含的。这包括企图杀人，但不包括未对儿童造成明显伤害的未遂企图。"],
			"blood": ["血液", "描绘大量血液，例如从身体伤口流出的血液。"],
			"cannibalism": ["食人", "类人生物被其他类人生物煮熟和/或吃掉（字面意思）。"],
			"catfight": ["两女格斗", "两名女性之间不协调的战斗。"],
			"cbt": ["折磨阴茎睾丸", "阴茎和睾丸的折磨。旨在以任何方式折磨阴茎区域的行为。"],
			"cuntbusting": ["折磨阴道", "物理攻击阴道的行为。"],
			"dismantling": ["拆解（机器人）", "移除机械生物的一部分、肢解或完全破坏。"],
			"guro": ["血腥", "有机物的图形切割。适度的血腥或暴力不符合条件。"],
			"electric shocks": ["电击", "使用电来引起疼痛或愉悦。"],
			"ryona": ["殴打", "暴力、打架或殴打。通常处于不需要酷刑标签的水平。"],
			"snuff": ["杀戮", "一名参与者被明显杀死。"],
			"torture": ["拷问", "用于造成疼痛或不需要的刺激的各种技术。"],
			"trampling": ["践踏", "被一个占主导地位的伙伴践踏。通常是性虐待的一部分。"],
			"whip": ["鞭子", "一种鞭打或打击动物或人以造成中等程度疼痛的工具。以这种方式使用任何性对象也很重要。极有可能涉及性虐待。"],
			"wrestling": ["摔跤", "涉及至少两名参与者之间的格斗和握持的全身战斗。"]
		}],
		"Privacy": ["隐私", {
			"exhibitionism": ["暴露狂", "自愿裸露或有被其他人看到的风险的性活动。还公然暴露于其他人。"],
			"filming": ["拍摄", "某人的性活动被视觉记录/广播的行为。"],
			"forced exposure": ["强迫暴露", "参与者的裸露或性活动是在非参与者的全视范围内不由自主地进行的。"],
			"hidden sex": ["偷吃", "在第三方直接在场的情况下发生的性行为，但看不见。"],
			"humiliation": ["屈辱", "在未参与的观众面前以性方式非自愿地羞辱/贬低一个人。"],
			"voyeurism": ["偷窥", "监视从事性行为、脱衣或在洗手间的参与者。"]
		}],
		"Self Pleasure": ["自慰", {
			"autofellatio": ["自我口交", "对自己进行口交。"],
			"autopaizuri": ["自我乳交", "对自己进行乳交。"],
			"clone": ["克隆", "一个或多个角色的精确复制品同时进行性活动。年龄、性别、体型、精神状态等方面的差异不符合条件。"],
			"masturbation": ["自慰", "自娱自乐。"],
			"phone sex": ["色情通话", "在取悦自己的同时使用通讯设备进行色情对话。"],
			"selfcest": ["自我男女性爱", "同一个人的两个不同版本之间的性行为。通常在某人和他们的性别改变的对手之间。"],
			"solo action": ["借助外物自慰", "一个角色自己从事性活动。使用物体作为刺激是可以接受的（例如杂志、性玩具、暴露癖）。可能会出现其他角色，但不会发生身体或精神上的互动。"],
			"table masturbation": ["桌上自慰", "使用桌子作为自慰工具，用生殖器摩擦桌子。"]
		}],
		"Disability": ["残疾", {
			"amputee": ["截肢者", "一个人失去一个或多个肢体。可以调用血腥标签。"],
			"blind": ["盲人", "眼睛完全不能工作的人。"],
			"handicapped": ["残疾（不能移动）", "自然不能移动自己的一个或多个肢体的人。"],
			"mute": ["哑巴", "不会说话的人。"]
		}],
		"Consumption": ["消耗", {
			"absorption": ["吸收", "吸收某物或某人的行为。可能被丸吞或反向出生调用。"],
			"analphagia": ["肛吞", "通过肛门整个吞下。"],
			"breast feeding": ["母乳喂养", "直接吸吮乳房。不需要任何牛奶可见。"],
			"cannibalism": ["烹饪吃掉", "类人生物被其他类人生物煮熟和/或吃掉（字面意思）。"],
			"cockphagia": ["阴茎吞下", "通过阴茎整个吞下。可能会引起大阴茎和尿道插入。"],
			"coprophagia": ["食粪", "吃粪便。"],
			"gokkun": ["吞精", "饮用或吞咽精液。"],
			"piss drinking": ["饮尿", "喝尿液。"],
			"tailphagia": ["尾吞", "被一条尾巴整个吞下。"],
			"vore": ["丸吞", "通过嘴被整个吞下。"],
			"weight gain": ["体重增加", "通过摄取食物变胖。很可能会调用女胖子或男胖子。"]
		}],
		"Gender": ["性别", {
			"cuntboy": ["男只有阴道", "男性有阴道而没有阴茎。"],
			"feminization": ["伪娘", "男性将他的生活方式改变为变装者的生活方式（例如通过训练或精神控制），或者将他的身体改变为人妖/双胞胎。在任何一种情况下，这个人都必须表现得更加女性化或被视为更加女性化。"],
			"futanari": ["扶她", "参与者既有阴茎又有阴道。"],
			"gender change": ["性转", "角色通过任何方式（例如，性别变形、占有和身体交换）改变其通常的性别。"],
			"gender morph": ["性别变形", "角色的身体通过身体转变从原来的身体改变性别。如果显示为序列而不是突然变化，则可能会调用转换。"],
			"otokofutanari": ["男有阴道和阴茎", "男性同时有阴道和阴茎。"],
			"shemale": ["人妖", "有男性生殖器但没有阴道的女孩。"]
		}],
		"Inter-gender Relations": ["跨性别关系", {
			"bisexual": ["双性恋", "在整个画廊中与同性和异性进行性活动的参与者。"],
			"dickgirl on dickgirl": ["扶她x扶她", "任何有阴茎的女性与另一位有阴茎的女性发生性关系。这包括人妖。"],
			"dickgirl on male": ["扶她x男", "女性阴茎插入男性，无论是肛门还是口腔。"],
			"fft threesome": ["两女一扶她", "三人组包含两名女性和一名变性人（双性人或人妖）。"],
			"male on dickgirl": ["男x扶她", "男性通过肛门、阴道���口腔插入挥舞女性的阴茎。这包括人妖。"],
			"mmt threesome": ["两男一扶她", "三人组，包含两名男性和一名变性人（双性人或人妖）。"],
			"mtf threesome": ["一男一女一变性", "三人组包含一名男性、一名变性人（双性人或人妖）和一名女性。"],
			"ttf threesome": ["两变性一女", "三人组包含两名变性人（双性人或人妖）和一名女性。"],
			"ttm threesome": ["两变性一男", "三人组包含两名变性人（双性人或人妖）和一名男性。"]
		}],
		"Contextual": ["上下文", {
			"blackmail": ["胁迫", "通过威胁或披露信息强迫他人提供性服务的行为。"],
			"coach": ["教练", "体育学科的讲师。"],
			"defloration": ["破瓜", "女性失去童贞的行为。通常包括轻微出血。"],
			"impregnation": ["怀孕或受精", "怀孕的行为。"],
			"oyakodon": ["母娘丼", "一组父母和他们的一个（或多个）孩子同时与同一个伴侣进行性活动。"],
			"prostitution": ["卖淫", "以性为交换金钱的行为。通常涉及以某些挑衅的方式穿着。"],
			"shimaidon": ["姉妹丼", "一群兄弟姐妹同时与同一个伴侣进行性活动。"],
			"teacher": ["老师", "被称为多个学生的教育者的参与者，通常在学校环境中。"],
			"tomboy": ["假小子（男子气概）", "一个穿着、行为和说话都以男孩子气的方式但不隐藏自己的性别的女孩，通常穿着短裤和 T 恤。可能与变装共存，但前提是女孩试图隐瞒自己的性别。"],
			"tomgirl": ["女子气概的男孩", "男性的外表使不经意的观察者很容易将其误认为女性（例如更长的头发、更细/更精致的特征、更圆的眼睛/嘴唇）。可能有害羞、顺从或被动的性格（例如脸红）。经常涉及男女装。"],
			"tutor": ["校外私教", "在校外为学生提供私人学术帮助的人。"],
			"virginity": ["童贞丧失(男)", "一名从事性活动的男性在同一场景中被称为处女。"],
			"vtuber": ["虚拟主播", "主要表现在具有原始虚拟化身的在线视频平台内的参与者。"],
			"widow": ["寡妇", "一个女人，她的另一半（已婚或长期恋爱）已经去世。死者和他们的死亡需要在画廊本身中以口头或视觉方式明确确定。"],
			"widower": ["鳏夫", "男版寡妇。"],
			"yandere": ["病娇", "由痴迷的爱所激发的精神病行为。这包括跟踪或绑架感兴趣的人或恐吓或伤害被认为的竞争对手。如果有任何性活动，疯狂的参与者必须在某个时候直接参与其中。"],
			"yaoi": ["搞基", "至少两名男性之间的性行为。也允许任何具有相同吸引力的男性画廊。"],
			"yuri": ["百合", "至少两名女性之间的性行为。"]
		}],
		"Gallery-Wide": ["画廊范围", {
			"dickgirls only": ["只有扶她", "画廊中的所有性、恋物或亲密互动都仅限于扶她之间。需要至少两个扶她互动。"],
			"females only": ["只有女性", "画廊中的所有性、恋物或亲密互动均仅限于女性之间。需要至少两名女性互动。"],
			"males only": ["只有男性", "画廊中的所有性、恋物或亲密互动均仅限于男性之间。至少需要两个男性互动。"],
			"no penetration": ["没有插入", "不得将任何东西插入阴道、肛门或任何其他身体开口。嘴是唯一的例外。"],
			"nudity only": ["仅限裸露", "整个画廊都没有发生性活动，但存在裸体。"],
			"sole dickgirl": ["唯一扶她", "只有一个扶她或人妖参与整个画廊的所有性或恋物活动。"],
			"sole female": ["唯一女性", "整个画廊中只有一名女性参与任何性或恋物活动（但不一定参与所有活动）。"],
			"sole male": ["唯一男性", "整个画廊中只有一名男性参与任何性或恋物活动（但不一定参与所有活动）。"]
		}],
		"Infidelity": ["不忠", {
			"cheating": ["伴侣之外发生关系", "与伴侣以外的人发生性关系的重要他人。"],
			"netorare": ["NTR", "另一个人的配偶/关系伴侣不忠，而被戴绿帽子的人意识到这种情况。当故事显然是为了代表被戴绿帽子的人引起嫉妒或同情时，也可以接受。"],
			"swinging": ["换妻/夫", "一对夫妇允许一方或双方与第三方发生性关系。"]
		}],
		"Incest": ["乱伦", {
			"aunt": ["姑姑阿姨", "女性与其侄女/侄子之间的任何性行为。"],
			"brother": ["亲兄弟", "男性兄弟姐妹之间的任何性行为。"],
			"cousin": ["堂兄弟", "堂兄弟之间的任何性行为。"],
			"daughter": ["女儿", "父母与其女孩之间的任何性行为。"],
			"father": ["父亲", "男性与其儿子之间的任何性行为。"],
			"granddaughter": ["孙女", "祖父母和孙女之间的任何性行为。"],
			"grandfather": ["爷爷", "男性与其孙子之间的任何性行为。"],
			"grandmother": ["奶奶", "女性和她的孙子之间的任何性行为。"],
			"incest": ["乱伦", "家庭亲属之间的性行为，即使是没有血缘关系的人。"],
			"inseki": ["收养等非血亲乱伦", "涉及姻亲、继父或收养家庭亲属的性行为。"],
			"mother": ["母亲", "女性和她的孩子之间的任何性行为。"],
			"niece": ["侄女", "女性和她的叔叔/阿姨之间的任何性行为。"],
			"sister": ["姐妹", "女性与其兄弟姐妹之间的任何性行为。"],
			"uncle": ["叔叔", "男性与其侄子之间的任何性行为。"]
		}],
		"Low Presence": ["低存在感", {
			"low smegma": ["少量包皮垢", ""]
		}],
		"High Presence": ["高存在感", {
			"focus anal": ["聚焦肛交", "表示肛交的实例超过了图库内容的 50%。"],
			"focus blowjob": ["聚焦口交", "表示口交实例超过图库内容的 50%。"],
			"focus paizuri": ["聚焦乳交", "表示乳交的实例超过了画廊内容的 50%。"]
		}],
		"Technical": ["技术", {
			"3d": ["3d", "计算机生成的图像。"],
			"anaglyph": ["浮雕", "图像以红色和青色编码以实现 3D 效果。"],
			"animated": ["动画", "多帧图像。"],
			"caption": ["文字在图像外", "文本已添加到最初没有文本的图像中。通常放置在实际图像之外。"],
			"comic": ["漫画", "一部源自西方的色情作品，利用一连串的面板来说明一个故事。通常在文字气球中包含文本。"],
			"figure": ["真实世界玩具或娃娃", "现实生活中的小雕像或娃娃。"],
			"first person perspective": ["第一人称视角", "通过一个角色的眼睛看，正如其他角色直视读者或似乎属于读者的身体部位所表明的那样。"],
			"full color": ["全彩", "所有内容的页面都是彩色的。只要不是故事页面，就允许使用数量非常有限的非彩色插图。"],
			"game sprite": ["游戏精灵", "字符的低位图形。通常是动画。"],
			"how to": ["教学图像", "关于如何绘制或设计的一系列教学图像。"],
			"multipanel sequence": ["多面板序列", "一系列从固定角度描绘性活动的面板。每页至少需要 2 个连续面板。"],
			"multi-work series": ["多作品系列", "一部完整的作品，其故事跨越多卷、书籍或版本。"],
			"non-h imageset": ["无H图集", "绘制不构成漫画或cg集的非色情内容（即松散的图像、截图等）。此类画廊中的图像更倾向于具有单一主题（例如单一艺术家、系列、人物或恋物癖）。"],
			"paperchild": ["人物剪纸", "人物剪纸。经常看起来好像他们正在与现实世界互动。"],
			"redraw": ["重绘", "有人替换了部分原始图像。贬低不符合条件。"],
			"screenshots": ["截图", "从电影、[h-] 动漫或电视节目中截取的屏幕截图。"],
			"sketch lines": ["素描线", "在较详细的绘图的初步创作过程中经常使用粗糙的线条，表示绘图不完整或艺术家未清理。"],
			"stereoscopic": ["立体画法", "可以使用立体镜以 3 维方式查看的平行图像。"],
			"story arc": ["故事章节", "一个故事在一个画廊中产生了多个章节。"],
			"themeless": ["无主题", "一个图像集风格的画廊，没有共同的艺术家、模仿、角色、故事、主题或其他焦点。"],
			"western cg": ["西部cg", "一套来自西方的数字色情片，没有面板。通常是彩色的，手绘较少，背景更详细。必须描述一系列事件或作为一个整体出售/分发。从西方色情游戏中提取的帧也可以接受。"],
			"western non-h": ["西部无H", "本质上不是色情的西方起源绘画（一张带有性别的露骨图片会自动取消画廊的资格）。如果它们本质上是非性的（例如乳头滑落），则允许少量裸露。"],
			"western imageset": ["西方影像集", "不构成漫画或 cg 集的西方来源的绘制内容（即松散的图像、屏幕截图等）。此类画廊中的图像首选具有单一主题（例如单一艺术家、系列、角色或恋物癖）。"],
			"x-ray": ["断面图", "通过皮肤或从内部可以看到内部器官。"]
		}],
		"Censorship": ["审查制度", {
			"full censorship": ["全面审查", "任何形式的审查几乎涵盖了参与者的全部或全部生殖器区域。"],
			"mosaic censorship": ["马赛克审查", "任何形式的马赛克审查，几乎涵盖了参与者的全部或全部生殖器区域。"],
			"uncensored": ["无修正", "无论是出版未经审查还是后来被审查，画廊在任何时候都不会受到审查。"]
		}],
		"Cosplay": ["角色扮演", {
			"hardcore": ["铁杆", "对性行为的明确描述，例如阴道或肛门插入。不计入口交或性玩具的使用。"],
			"non-nude": ["非裸体", "没有显示乳头或性孔的角色扮演画廊。"]
		}],
		"Expunging": ["删除", {
			"already uploaded": ["已上传", ""],
			"forbidden content": ["禁止内容", ""],
			"realporn": ["真人色情", ""],
			"replaced": ["替换", ""]
		}],
		"Semi-Expunging": ["半删除", {
			"compilation": ["选辑", "画廊是不允许一起的作品的汇编。"],
			"incomplete": ["不完整", "作品不完整，特别是缺少核心内容。"],
			"missing cover": ["遗漏封面", "缺少封面。"],
			"out of order": ["乱序", "内容不按顺序排序；通常有一个故事。"],
			"sample": ["样本", "完整作品的免费分发部分。指定可以用更完整的版本替换图库（DNP 除外）。"],
			"scanmark": ["扫描", "由翻译器/扫描仪/着色器明显标记的图像。如有无标记版本，可能会被替换。"],
			"watermarked": ["水印", "由与内容的创建、扫描、着色或翻译无关的网站的水印复制品组成的画廊。"]
		}],
		"Format": ["格式", {
			"anthology": ["选集", "多位作者的完整作品集。具有共同主题的同人志选集使用合作本。"],
			"artbook": ["画册", "出版书籍中给定主题的图形集合，通常强调艺术家的性格或设计元素，而不是性或故事内容。"],
			"goudoushi": ["合作本（多作者同主题）", "一本自行出版的书，汇集了多位艺术家的作品，这些艺术家都专注于一个主题，如角色、特许经营或恋物癖。主要仅在同人志或非H 类别中。"],
			"novel": ["小说", "页面包含没有插图的冗长文本。通常占画廊的很大一部分。"],
			"soushuuhen": ["総集编（同一作者多作品）", "一本自行出版的书，汇集了一位艺术家的多部作品。主要仅在同人志或非H 类别中。"],
			"tankoubon": ["单行本", "由第三方出版的单个艺术家的完整书籍。主要仅在漫画或非H 类别中。"],
			"variant set": ["变体集", "从静态角度仅描绘单一风景的 CG 布景。"],
			"webtoon": ["网络漫画（韩漫风）", "任何以垂直布局格式在线发布的网络漫画，利用空白代替或与镶板一起使用。"]
		}],
		"Language": ["语种", {
			"afrikaans": ["南非荷兰语", ""],
			"albanian": ["阿尔巴尼亚语", ""],
			"arabic": ["阿拉伯语", ""],
			"aramaic": ["阿拉姆语", ""],
			"armenian": ["亚美尼亚语", ""],
			"bengali": ["孟加拉语", ""],
			"bosnian": ["波斯尼亚语", ""],
			"bulgarian": ["保加利亚语", ""],
			"burmese": ["缅甸语", ""],
			"catalan": ["加泰罗尼亚语", ""],
			"cebuano": ["宿务语", ""],
			"chinese": ["汉语", ""],
			"cree": ["克里语", ""],
			"creole": ["克里奥尔语", ""],
			"croatian": ["克罗地亚语", ""],
			"czech": ["捷克语", ""],
			"danish": ["丹麦语", ""],
			"dutch": ["荷兰语", ""],
			"english": ["英语", ""],
			"esperanto": ["世界语", ""],
			"estonian": ["爱沙尼亚语", ""],
			"finnish": ["芬兰语", ""],
			"french": ["德语", ""],
			"georgian": ["法语", ""],
			"german": ["格鲁吉亚语", ""],
			"greek": ["希腊语", ""],
			"gujarati": ["古吉拉特语", ""],
			"hebrew": ["希伯来语", ""],
			"hindi": ["赫蒙语", ""],
			"hmong": ["印地语", ""],
			"hungarian": ["匈牙利语", ""],
			"icelandic": ["冰岛语", ""],
			"indonesian": ["印度尼西亚语", ""],
			"irish": ["爱尔兰语", ""],
			"italian": ["意大利语", ""],
			"japanese": ["日语", ""],
			"javanese": ["爪哇语", ""],
			"kannada": ["卡纳达语", ""],
			"kazakh": ["哈萨克语", ""],
			"khmer": ["高棉语", ""],
			"korean": ["韩语", ""],
			"kurdish": ["库尔德语", ""],
			"ladino": ["拉迪诺语", ""],
			"lao": ["老挝语", ""],
			"latin": ["拉丁语", ""],
			"latvian": ["拉脱维亚语", ""],
			"marathi": ["马拉地语", ""],
			"mongolian": ["蒙古语", ""],
			"ndebele": ["古吉拉特语", ""],
			"nepali": ["尼泊尔语", ""],
			"norwegian": ["挪威语", ""],
			"oromo": ["奥罗莫语", ""],
			"papiamento": ["帕皮阿门托语", ""],
			"pashto": ["普什图语", ""],
			"persian": ["波斯语", ""],
			"polish": ["波兰语", ""],
			"portuguese": ["葡萄牙语", ""],
			"punjabi": ["旁遮普语", ""],
			"romanian": ["罗马尼亚语", ""],
			"russian": ["俄语", ""],
			"sango": ["桑戈语", ""],
			"sanskrit": ["梵语", ""],
			"serbian": ["塞尔维亚语", ""],
			"shona": ["绍纳语", ""],
			"slovak": ["斯洛伐克语", ""],
			"slovenian": ["斯洛文尼亚语", ""],
			"somali": ["索马里语", ""],
			"spanish": ["西班牙语", ""],
			"swahili": ["斯瓦希里语", ""],
			"swedish": ["瑞典语", ""],
			"tagalog": ["他加禄语", ""],
			"tamil": ["泰米尔语", ""],
			"telugu": ["泰卢固语", ""],
			"thai": ["泰语", ""],
			"tibetan": ["藏语", ""],
			"tigrinya": ["提格里尼亚语", ""],
			"turkish": ["土耳其语", ""],
			"ukrainian": ["乌克兰语", ""],
			"urdu": ["乌尔都语", ""],
			"vietnamese": ["越南语", ""],
			"welsh": ["威尔士语", ""],
			"yiddish": ["意第绪语", ""],
			"zulu": ["祖鲁语", ""]
		}],
		"Meta-Language": ["语言", {
			"rewrite": ["改写文本", "个人填写了自己的文本来代替原始文本或没有的地方。"],
			"rough grammar": ["粗略语法（部分语法拼写错误）", "任何第三方翻译，包含所需数量的带有语法或拼写错误的句子。要求定义为： 总翻译页数的 25%（四舍五入到最接近的整数）或 10，以较高者为准。"],
			"rough translation": ["粗略翻译（部分翻译错误）", "任何第三方翻译，由所需数量的文本框/气泡组成，并带有翻译错误。要求定义为： 总翻译页数的 25%（四舍五入到最接近的整数）或 10，以较高者为准。翻译错误包括缺少上下文、缺少作者意图、省略故事/情况相关文本或不正确的含义。"],
			"speechless": ["不含任何文本", "画廊中没有任何文字被用作交流或叙述的手段。将画廊的语言指定为“N/A”。"],
			"text cleaned": ["文本清理", "删除了附带文字的漫画或 CG 集。"],
			"translated": ["已翻译", "由第三方对原始语言进行的任何翻译。"]
		}]
	};
}, () => {
	// exhentai 总数据
	categoryData = {
		"Age": ["年龄", {
			"age progression": ["年龄增长", "一个人迅速变老。"],
			"age regression": ["年龄回归", "一名参与者迅速变年轻。瞬时更改不符合条件。"],
			"dilf": ["熟男", "任何年龄在 30-50 岁之间的老年人。不需要当父亲"],
			"infantilism": ["幼稚", "涉及将非儿童伴侣视为婴儿的性活动。可能包括尿布"],
			"milf": ["熟女", "任何年龄在 30-50 岁之间的老年妇女。不需要当妈妈。"],
			"old lady": ["老太太", "明显年老的女性，通常有面部皱纹。如果要估计他们的年龄，至少应该是 50 岁。"],
			"old man": ["老人", "一个明显老年的男性，通常有面部皱纹。如果要估计他们的年龄，至少应该是 50 岁。"]
		}],
		"Body": ["身体", {
			"adventitious penis": ["不定阴茎", "至少有一个阴茎在身体上意想不到的地方（例如手、嘴、尾巴）。"],
			"adventitious vagina": ["不定阴道", "在身体意想不到的地方（例如手、嘴、上身）有阴道。"],
			"amputee": ["截肢者", "一个人失去一个或多个肢体。可以调用血腥标签。"],
			"big muscles": ["大肌肉", "明显的大肌肉。肌肉发达的手臂必须与头部一样宽，或者肌肉发达的大腿与头部一样宽 1.5 倍。"],
			"body modification": ["身体改造", "以某种人工方式改变身体部位，例如非有机增强、身体部位添加或移除以及不寻常的身体部位放置。"],
			"conjoined": ["连体", "两个或多个头共享同一个身体。"],
			"doll joints": ["娃娃关节", "具有明显的圆形或凹形关节。"],
			"gijinka": ["非人类", "一个具有人类/完全拟人化形式的角色，但规范上没有。也可以作为非人形角色进行角色扮演。"],
			"invisible": ["隐形", "一个看不见的参与者。"],
			"multiple arms": ["多臂", "一个人身上有两条以上的手臂。"],
			"multiple breasts": ["多乳房", "单个角色上的任何超过 2 个乳房。"],
			"multiple nipples": ["多乳头", "每个乳房有超过 1 个的任意数量的乳头。包括乳房。"],
			"multiple penises": ["多阴茎", "拥有不止一个阴茎。不适用于触手式阴茎。"],
			"multiple vaginas": ["多阴道", "拥有多个阴道。"],
			"muscle": ["肌肉", "一个明显肌肉发达的参与者。"],
			"muscle growth": ["肌肉生长", "肌肉出现在以前没有的地方或现有的肌肉变大。"],
			"pregnant": ["怀孕", "涉及明显怀孕的参与者的性活动或裸体。"],
			"shapening": ["塑形", "参与者将其压扁、融化或以其他方式变成几何形状，例如球体或立方体。"],
			"stretching": ["伸展", "超出正常人所能做的伸展（例如四肢）。"],
			"tailjob": ["尾交", "用尾巴刺激生殖器区域。"],
			"wingjob": ["翼交", "使用翅膀刺激生殖器区域。"],
			"wings": ["翅膀", "人形生物上任何突出的翅膀。"]
		}],
		"change": ["改变", {
			"absorption": ["吸收", "吸收某物或某人的行为。可能被丸吞或反向出生调用。"],
			"age progression": ["年龄进展", "一个人迅速变老。"],
			"age regression": ["年龄回归", "一名参与者迅速变年轻。瞬时更改不符合条件。"],
			"ass expansion": ["屁股扩张", "臀部因任何原因而增长。很可能招惹大屁股。"],
			"balls expansion": ["睾丸扩张", "睾丸变大。可能导致大球。"],
			"body swap": ["身体交换", "与另一个参与者交换身体。"],
			"breast expansion": ["乳房扩张", "乳房大小的任何显着增加。很可能会引起大乳房，也可能是巨大的乳房。"],
			"breast reduction": ["乳房缩小", "乳房大小的任何显着减少。可唤起小乳房。"],
			"clit growth": ["阴蒂生长", "阴蒂的生长，通常会导致一个大阴蒂。"],
			"corruption": ["腐败", "用魔法或其他超自然力量强行腐蚀参与者的思想，剥夺他们的纯洁。"],
			"dick growth": ["鸡巴生长", "阴茎异常生长。可能会导致阴茎变大。"],
			"feminization": ["女性化", "男性将他的生活方式改变为变装者的生活方式（例如通过训练或精神控制），或者将他的身体改变为人妖/双胞胎。在任何一种情况下，这个人都必须表现得更加女性化或被视为更加女性化。"],
			"gender change": ["性别变化", "角色通过任何方式（例如，性别变形、占有和身体交换）改变其通常的性别。"],
			"gender morph": ["性别变形", "角色的身体通过身体转变从原来的身体改变性别。如果显示为序列而不是突然变化，则可能会调用转换。"],
			"growth": ["成长", "长高了。可能导致女巨人或巨人。"],
			"moral degeneration": ["道德退化", "消除一个人对性的道德立场。必须在不使用强力物质或超自然影响的情况下完成。可能会引发精神崩溃。"],
			"muscle growth": ["肌肉生长", "肌肉出现在以前没有的地方或现有的肌肉变大。"],
			"nipple expansion": ["乳头扩张", "乳头明显增大。可能导致乳头变大。"],
			"personality excretion": ["个性排泄", "参与者将他们的灵魂转移到一个物品中（例如果冻、人造阴道 或精液），然后排出体外，使他们的身体变成一个空壳。"],
			"petrification": ["石化", "成为雕像/岩石般的形态。"],
			"shrinking": ["萎缩", "参与者变小。可能会导致迷你女孩或迷你男孩。不需要转型。"],
			"transformation": ["转化", "显示某种物理、生物学变化的序列。"],
			"weight gain": ["体重增加", "过摄取食物变胖。很可能会调用女胖子或男胖子。"]
		}],
		"Creature": ["生物", {
			"alien": ["外星人", "任何具有强烈特征的男性，旨在唤起非地球起源的存在。通常为人形，缺乏任何真实或神话生物的特征（例如眼柄、无虹膜、球状头部、触手身体部位）。"],
			"alien girl": ["外星女孩", "任何具有强烈特征的女性，旨在唤起非地球起源的存在。通常为人形，缺乏任何真实或神话生物的特征（例如眼柄、无虹膜、球状头部、触手身体部位）。"],
			"angel": ["天使", "有大的，典型的白色翅膀。通常也具有光环。"],
			"bat boy": ["蝙蝠男孩", "男版蝙蝠女。"],
			"bat girl": ["蝙蝠女孩", "一种女性类人生物，有翅膀、耳朵，有时还有尾巴或蝙蝠的其他显着特征。"],
			"bear boy": ["熊男孩", "男版熊女。"],
			"bear girl": ["熊女孩", "一个有着圆耳朵的雌性，可能还有熊的其他特征。男版见熊男孩。"],
			"bee boy": ["蜜蜂男孩", "男版蜂女。"],
			"bee girl": ["蜜蜂女孩", "具有蜜蜂特征的雌性。"],
			"bunny boy": ["兔子男孩", "男版兔女郎。"],
			"bunny girl": ["兔子女孩", "兔耳朵，偶尔也有蓬松的尾巴。"],
			"catboy": ["猫男孩", "男版猫娘。"],
			"catgirl": ["猫女孩", "有耳朵，通常有尾巴或猫的其他特征。"],
			"centaur": ["人马", "半马半人。"],
			"cowgirl": ["牛女孩", "有牛耳朵、牛角，可能还有尾巴和牛铃。可能有荷斯坦图案（白色带黑色斑点）。常与大胸搭配。"],
			"cowman": ["牛男", "男版女牛仔。"],
			"deer boy": ["鹿男孩", "男版鹿女。"],
			"deer girl": ["鹿女孩", "具有鹿或驯鹿的尾巴和角的雌性。男性版本见鹿男孩。"],
			"demon": ["恶魔", "具有强烈恶魔外观（翅膀、角、尖尾巴、皮肤图案/标记等）的男性人形生物，偶尔也有异常的皮肤颜色和眼睛。"],
			"demon girl": ["恶魔女孩", "具有强烈恶魔外观（翅膀、角、尖尾巴、皮肤图案/标记等）的女性人形生物，偶尔也会有异常的皮肤颜色和眼睛。"],
			"dog boy": ["狗男孩", "男版狗女。"],
			"dog girl": ["狗女孩", "一个有狗的尾巴和耳朵的女性。"],
			"draenei": ["魔兽蓝色恶魔", "来自魔兽世界的恶魔类人形生物。蓝色的皮肤，有蹄子和发光的眼睛。"],
			"fairy": ["仙女", "一种小型类人生物，其翅膀通常类似于昆虫或蝴蝶的翅膀。"],
			"fox boy": ["狐狸男孩", "男版狐女。"],
			"fox girl": ["狐狸女孩", "一个长着狐狸耳朵和尾巴的���孩，通常很浓密，有黑色的尖端。男版见狐童。"],
			"frog boy": ["青蛙男孩", "男版蛙女。"],
			"frog girl": ["青蛙女孩", "一个女性，身体矮矮，皮肤光滑，爬虫类的附肢长。可能有长舌头。"],
			"furry": ["福瑞", "具有某些人类个性或特征的拟人化动物角色。"],
			"giraffe boy": ["长颈鹿男孩", "男版长颈鹿少女。"],
			"giraffe girl": ["长颈鹿女孩", "长颈鹿耳朵和尾巴的女孩，衣服或皮毛上通常有黄色和棕色斑点。可能有一个长脖子。"],
			"ghost": ["幽灵", "与非物质的存在发生性关系。"],
			"goblin": ["哥布林", "幻想生物，通常约为正常人身高的 1/2 至 3/4。通常有宽鼻子、尖耳朵、宽嘴和小而锋利的獠牙。"],
			"harpy": ["哈比", "一种鸟人和人类的混血儿，经常有融合的翅膀作为手臂。"],
			"horse boy": ["马男孩", "男版马女。"],
			"horse girl": ["马女孩", "有马的尾巴和其他特征。"],
			"human on furry": ["人类x福瑞", "人形生物和拟人生物之间的性活动。"],
			"insect boy": ["昆虫男孩", "男版虫女"],
			"insect girl": ["昆虫女孩", "有触角，通常有壳或甲壳躯干。"],
			"kemonomimi": ["兽耳", "具有动物耳朵和尾巴但几乎没有其他动物部位的类人生物。"],
			"kappa": ["河童", "乌龟与人类的混血儿。"],
			"lizard girl": ["蜥蜴少女", "一个长着爬行动物鳞片和尾巴的女孩。"],
			"lizard guy": ["蜥蜴人", "男版蜥蜴女。"],
			"mermaid": ["美人鱼", "一种鱼人混合体，鱼的部分位于身体的下半部分。男性版本见人鱼。"],
			"merman": ["人鱼", "男性美人鱼。"],
			"minotaur": ["牛头怪", "任何公牛与人类的混合体。可能会召唤毛茸茸或在极少数情况下是怪物。"],
			"monkey boy": ["猴子男孩", "男版猴女。"],
			"monkey girl": ["猴子女孩", "有耳朵，通常有尾巴或猴子的其他特征。"],
			"monoeye": ["单眼", "一个独眼的类人生物。因任何原因（变形除外）失去一只眼睛的双眼角色不符合资格。"],
			"monster": ["怪物", "任何不是人类、外星人、天使、机器人、恶魔、动物、吸血鬼、仙女、精灵或毛茸茸的东西。"],
			"monster girl": ["怪物女孩", "任何不是人类、外星人、天使、机器人、恶魔、动物、吸血鬼、仙女、精灵或毛茸茸的东西。"],
			"mouse boy": ["老鼠男孩", "男版老鼠娘。"],
			"mouse girl": ["老鼠女孩", "定义特征是大而圆的老鼠耳朵和长长的啮齿动物般的尾巴。通常非常喜欢奶酪。"],
			"necrophilia": ["恋尸癖", "涉及尸体的性行为。"],
			"oni": ["鬼", "一个头上有1-2个角和可能尖耳朵的类人生物。没有翅膀或尾巴。"],
			"orc": ["兽人", "与人类一样高或略高的幻想生物。通常有倾斜的前额、突出的下巴、突出的牙齿和粗大的体毛。"],
			"otter boy": ["水獭男孩", "男版水獭女。"],
			"otter girl": ["水獭女孩", "雌性长着长矛状的长尾巴、圆耳朵和水獭的其他特征。口吻、颈部和躯干通常颜色较浅。"],
			"panda boy": ["熊猫男孩", "男版熊猫女。"],
			"panda girl": ["熊猫女孩", "耳朵圆圆，眼睛周围和身体其他部位有黑色斑块。"],
			"pig girl": ["猪女孩", "有耳朵，通常还有鼻子、卷曲的尾巴或猪的其他特征。"],
			"pig man": ["猪人", "有耳朵，通常还有鼻子、卷曲的尾巴或猪的其他特征。"],
			"plant boy": ["植物男孩", "男版植物少女。"],
			"plant girl": ["植物女孩", "一种雌性植物-人类杂交种。"],
			"raccoon boy": ["浣熊男孩", "男版浣熊女。"],
			"raccoon girl": ["浣熊女孩", "有耳朵，通常有尾巴或浣熊的其他特征。"],
			"robot": ["机器人", "一个机械人形机器人（例如：cyborg、android、fembot）。通常具有可见的金属身体部位或肢体关节。"],
			"shark boy": ["鲨鱼男孩", "雄性以尾鳍作为尾巴而不是身体的下半部分。通常也有锋利的牙齿。"],
			"shark girl": ["鲨鱼女孩", "一种以尾鳍为尾巴而不是下半身的雌性。通常也有锋利的牙齿。男性版本见鲨鱼男孩。"],
			"sheep boy": ["绵羊男孩", "男版羊女。"],
			"sheep girl": ["绵羊女孩", "一个有羊毛和可能是羊角的女性。"],
			"slime": ["史莱姆", "任何与性有关的粘稠/凝胶状物质。基于粘液的生物需要这个和怪物标签。"],
			"slime boy": ["史莱姆男孩", "一个男孩，他的身体完全是用粘液制成的。"],
			"slime girl": ["史莱姆女孩", "一个身体主要由粘液制成的女孩。"],
			"snake boy": ["蛇男孩", "男版蛇女。"],
			"snake girl": ["蛇女孩", "蛇-雌性混合体的任何变体。"],
			"spider boy": ["蜘蛛男孩", "男版蜘蛛女。"],
			"spider girl": ["蜘蛛女孩", "身体是蜘蛛的少女。"],
			"squid boy": ["鱿鱼男孩", "男版鱿鱼娘。"],
			"squid girl": ["鱿鱼女孩", "有许多小触手，可能是鱿鱼或章鱼的尖头。"],
			"squirrel boy": ["松鼠男孩", "男版松鼠少女。"],
			"squirrel girl": ["松鼠少女", "有松鼠的尾巴和其他特征。"],
			"skunk boy": ["臭鼬少年", "男版臭鼬少女。"],
			"skunk girl": ["臭鼬少女", "雌性，具有臭鼬的尾巴和其他显着特征。"],
			"tentacles": ["触手", "用于性目的的长而柔韧的卷须。"],
			"vampire": ["吸血鬼", "有尖牙，喝血。必须使用吸血鬼能力或露出尖牙来展示。"],
			"wolf boy": ["狼少年", "男版狼女。"],
			"wolf girl": ["狼少女", "有尖耳朵，通常有浓密的尾巴或狼的其他特征。"],
			"yukkuri": ["尤库里", "圆形斑点状生物，其面孔基于东方 Project中的角色。经常参与血腥或酷刑。"],
			"zombie": ["僵尸", "一种肉质的不死生物。"]
		}],
		"Animal": ["动物", {
			"animal on animal": ["动物x动物", ""],
			"animal on furry": ["动物x福瑞", ""],
			"bear": ["熊", ""],
			"bestiality": ["兽交", "与动物或昆虫发生性关系的人。"],
			"bull": ["公牛", ""],
			"camel": ["骆驼", ""],
			"cat": ["猫", ""],
			"cow": ["牛", ""],
			"crab": ["螃蟹", ""],
			"deer": ["鹿", ""],
			"dinosaur": ["恐龙", ""],
			"dog": ["狗", ""],
			"dolphin": ["海豚", ""],
			"donkey": ["驴", ""],
			"dragon": ["龙", ""],
			"eel": ["鳗鱼", ""],
			"elephant": ["大象", ""],
			"fish": ["鱼", ""],
			"fox": ["狐狸", ""],
			"frog": ["青蛙", ""],
			"goat": ["山羊", ""],
			"gorilla": ["大猩猩", ""],
			"horse": ["马", ""],
			"insect": ["昆虫", ""],
			"kangaroo": ["袋鼠", ""],
			"lion": ["狮子", ""],
			"lioness": ["母狮", ""],
			"maggot": ["蛆", ""],
			"monkey": ["猴子", ""],
			"mouse": ["老鼠", ""],
			"octopus": ["章鱼", ""],
			"panther": ["豹", ""],
			"pig": ["猪", ""],
			"rabbit": ["兔子", ""],
			"reptile": ["爬行动物", ""],
			"rhinoceros": ["犀牛", ""],
			"sheep": ["羊", ""],
			"shark": ["鲨鱼", ""],
			"slug": ["蛞蝓", "任何类型的腹足类软体动物，即使是那些有壳的。"],
			"snake": ["蛇", ""],
			"spider": ["蜘蛛", ""],
			"tiger": ["老虎", ""],
			"turtle": ["乌龟", ""],
			"unicorn": ["独角兽", ""],
			"whale": ["鲸鱼", ""],
			"wolf": ["狼", ""],
			"worm": ["蠕虫", ""],
			"zebra": ["斑马", ""]
		}],
		"Height": ["身高", {
			"giant": ["巨人", "男版女巨人。使用环境线索来确定角色是大还是小。"],
			"giantess": ["女巨人", "高高在上的女性参与者。她应该能够一只手握住一个正常大小的人。使用环境线索来确定角色是大还是小。"],
			"growth": ["成长", "长高了。可能导致女巨人或巨人。"],
			"midget": ["侏儒", "一个很矮的人。看起来应该等于或小于伴侣的腰高。如果不存在伴侣，请使用环境提示。"],
			"minigirl": ["迷你女孩", "一只手掌大小的女性。使用环境提示来确定角色是小还是大。"],
			"miniguy": ["迷你男孩", "男版迷你女孩。使用环境提示来确定角色是小还是大。"],
			"shrinking": ["缩小", "参与者变小。可能会导致小女孩或小男孩。不需要转型。"],
			"tall girl": ["高个女孩", "一个明显高大的女人。应该看起来至少比她的伴侣高一个头。如果没有伴侣，或者伴侣是正太控、萝莉控、迷你女孩/男孩或侏儒，请使用环境线索。"],
			"tall man": ["高个子", "一个明显高大的男人。应该看起来至少比他的搭档高一个头。如果没有伴侣，或者伴侣是正太控、萝莉控、迷你女孩/男孩或侏儒，请使用环境线索。"]
		}],
		"Skin": ["皮肤", {
			"albino": ["白化病", "红眼睛与非常浅的皮肤相结合。"],
			"body writing": ["身体写字", "在人的身体上制���的各种文字或图画，通常包括贬义词，例如“荡妇”或“精液垃圾箱”。"],
			"body painting": ["人体彩绘", "油漆不仅仅在脸上或身体的一小块区域上。"],
			"crotch tattoo": ["胯部纹身", "下腹部和胯部之间区域的任何明显图案/标志。"],
			"dark skin": ["深色皮肤", "棕色或黑色肤色。"],
			"freckles": ["雀斑", "皮肤表面有许多相互靠近的小色素沉着点。通常出现在脸上，但也可以出现在身体的任何部位。"],
			"gyaru": ["日式辣妹", "各种时装过去尽可能地显得不像日本人，包括人造棕褐色、漂白头发、装饰指甲、浓妆、假睫毛等。"],
			"gyaru-oh": ["日式辣男", "各种时装过去尽可能地显得非日本化，包括人造棕褐色、漂白的头发、浓妆、坚韧的衣服等。"],
			"large tattoo": ["大纹身", "皮肤上的永久性标记/图案，通常用墨水完成。必须足够突出以覆盖至少半个肢体/脸。对于累积满足相同最小值的许多小型设备也可以接受。"],
			"oil": ["油", "参与者至少部分覆盖有润滑剂，如身体油，以赋予其皮肤光滑的质地/光滑的外观。"],
			"scar": ["疤痕", "皮肤上的痕迹或烧伤。必须非常突出。"],
			"skinsuit": ["紧身衣", "穿着另一个人的皮肤，有效地成为佩戴者的皮肤。"],
			"sweating": ["出汗", "参与者身上有大量汗水滴落。"],
			"tanlines": ["晒痕", "较浅的线条，通常来自晒黑后的衣服。"]
		}],
		"Weight": ["重量", {
			"anorexic": ["厌食症", "体重过轻以至于一个人的皮肤凹陷或他们的骨骼结构的任何部分都与他们的皮肤相适应。"],
			"bbm": ["胖子", "胖子。中腹部必须有褶皱。"],
			"bbw": ["女胖子", "胖女人。中腹部必须有褶皱。"],
			"ssbbm": ["男大胖子", "由于体脂而比身高更宽的男性。"],
			"ssbbw": ["女大胖子", "由于体脂而比身高更宽的女性。"],
			"weight gain": ["体重增加", "通过摄取食物变胖。很可能会调用女胖子或男胖子。"]
		}],
		"Head": ["头", {
			"ahegao": ["阿嘿颜", "表示愉悦的夸张面部表情，通常包括卷起的眼睛、张开的嘴巴和伸出的舌头。常发生在性高潮期间。"],
			"beauty mark": ["美人痣", "一种深色的面部痣，通常靠近眼睛。不包括装饰性面部附加物，例如面带、穿孔、纹身或印章。"],
			"brain fuck": ["脑交", "涉及大脑的性行为。"],
			"cockslapping": ["脸交", "用阴茎敲打一个人（通常是在脸上）。"],
			"crown": ["皇冠", "用于头顶的圆形礼仪头饰。多为君主佩戴。"],
			"ear fuck": ["耳交", "涉及穿透耳朵的性行为。"],
			"elf": ["精灵", "有长而尖的耳朵和典型的细长身体。"],
			"facesitting": ["颜面骑乘", "坐在另一位参与者的脸上或上方。可能用于部分窒息它们或用于与肛门/生殖器区域的口腔接触。有时与调教或性虐待配对。"],
			"facial hair": ["胡子", "下巴、脸颊或上唇有明显的毛发。"],
			"gasmask": ["防毒面具", "一种覆盖面部并包括呼吸管或过滤器的塑料面罩。"],
			"headless": ["无头", "任何在预期中缺少头部的生物。"],
			"hood": ["兜帽", "带有开口的头饰，通常附在外套或衬衫上。"],
			"horns": ["角", "人形生物头部的一个或多个角。"],
			"makeup": ["化妆", "涂在嘴唇、脸颊、睫毛或其他面部区域以突出它们的可见颜色。"],
			"masked face": ["蒙面", "完全覆盖参与者面部的不透明面具，通常用于隐藏他们的身份。这包括典型的巴拉克拉法帽式面具。"],
			"thick eyebrows": ["浓眉", "眉毛至少和主人的手指一样粗。"],
			"tiara": ["头饰", "半圆形礼仪头带，款式可能不同，但靠近前额放置。经常被君主和魔法少女佩戴。"]
		}],
		"Hair": ["头发", {
			"afro": ["黑人头型", "蓬松或浓密的毛发，主要向上呈球状、苔藓状或云状，并围绕主人的头部。"],
			"bald": ["秃头", "头皮上很少或没有头发的头部。"],
			"drill hair": ["钻头发型", "大卷曲/盘绕的头发看起来类似于垂直缠绕或锥形钻头。"],
			"eye-covering bang": ["遮眼刘海", "从头皮前发际线垂下的头发始终覆盖至少一只眼睛。头发上的小裂缝是可以接受的。只要眼睛被遮盖，透视眼也可以接受。"],
			"hair_buns": ["发髻", "将大量头发聚集并固定成一个或多个圆形束。"],
			"hairjob": ["头发交", "使用生殖器上的毛发来创造性快感。"],
			"pixie cut": ["小精灵剪裁", "短发发型，一般顶部梳向脸部，两侧剪短，不低于耳朵，而背部可能会达到颈部。"],
			"ponytail": ["马尾辫", "将大量头发收集并固定在头部后部或侧面的一束尾状中，然后自由悬挂。"],
			"prehensile hair": ["卷发", "参与者有能力控制他或她的头发，就像它是一个肢体一样。"],
			"shaved head": ["剃光头", "只有头发茬的头。"],
			"twintails": ["双马尾", "将大量头发聚集并固定在头部相对两侧的两个尾巴状的束中，然后自由悬挂。"],
			"very long hair": ["很长的头发", "参与者的大部分头发足够长到肚脐以下或附近。由于被捆绑而无法达到该长度的头发不符合条件。"]
		}],
		"Mind": ["大脑", {
			"body swap": ["身体交换", "与另一个参与者交换身体。"],
			"chloroform": ["失去知觉", "任何用于在没有物理力量的情况下使某人失去知觉的物质。可能导致强奸和睡觉。"],
			"corruption": ["腐败", "用魔法或其他超自然力量强行腐蚀参与者的思想，剥夺他们的纯洁。"],
			"drugs": ["药物", "任何用于鼓励滥交或享乐的化学物质。"],
			"drunk": ["醉酒", "一名参与者在性交之前或期间饮酒。应该明显改变他们的情绪和/或行为。通常会导致脸颊发红、眼睛朦胧或迷醉，以及对性的态度更加放松。"],
			"emotionless sex": ["没有感情的性爱", "没有表现出来自性活动的情绪。"],
			"mind break": ["精神失常", "训练/将某人精神上变成性奴隶，通常是通过长时间或严格的性刺激。"],
			"mind control": ["精神控制", "强迫参与者自己做某事，但违背自己的意愿。"],
			"moral degeneration": ["道德堕落", "消除一个人对性的道德立场。必须在不使用强力物质或超自然影响的情况下完成。可能会引发精神崩溃。"],
			"parasite": ["寄生虫", "一种感染宿主的小有机体，通常会引起性刺激。在某些情况下可能被视为拥有。"],
			"personality excretion": ["人格排泄", "参与者将他们的灵魂转移到一个物品中（例如果冻、人造阴道 或精液），然后排出体外，使他们的身体变成一个空壳。"],
			"possession": ["占有", "参与者的身体被外部思想接管，实际上被剥夺了自己的意志。"],
			"shared senses": ["共享感官", "某人与某物或其他人分享他们的感官的情况。"],
			"sleeping": ["睡觉", "与不清醒的人发生性关系。视情况而定，可能算作强奸。"],
			"yandere": ["病娇", "由痴迷的爱所激发的精神病行为。这包括跟踪或绑架感兴趣的人或恐吓或伤害被认为的竞争对手。如果有任何性活动，疯狂的参与者必须在某个时候直接参与其中。"]
		}],
		"Eyes": ["眼睛", {
			"blind": ["盲人", "眼睛完全不能工作的人。"],
			"blindfold": ["眼罩（失去视力）", "一种旨在使人失去视力的眼罩。"],
			"closed eyes": ["闭眼", "一个闭着眼睛或假装睡着的角色。"],
			"cum in eye": ["眼睛里的精液", "射入人的眼睛。"],
			"dark sclera": ["深色眼白", "一个人的眼白是深色的。"],
			"eye penetration": ["眼睛穿透", "眼睛或眼窝中的性行为。"],
			"eyemask": ["眼罩", "眼睛周围区域的覆盖物，仍然使脸部的其余部分暴露在外。"],
			"eyepatch": ["遮住眼睛", "一块布或其他材料覆盖一只眼睛。"],
			"glasses": ["眼镜", "任何带框的透明眼镜戴在双眼前面以改善视力。"],
			"heterochromia": ["异色症", "参与者的虹膜颜色不同。"],
			"monoeye": ["单眼", "一个独眼的类人生物。因任何原因（变形除外）失去一只眼睛的双眼角色不符合资格。"],
			"sunglasses": ["太阳镜", "任何用于在阳光下改善视力的带框、不透明眼镜。"],
			"unusual pupils": ["爱心眼", "学生是或包含奇怪的形状，如心形或星星。"]
		}],
		"Nose": ["鼻子", {
			"nose fuck": ["鼻交", "涉及鼻孔的性行为。"],
			"nose hook": ["鼻钩", "一个钩子用来把鼻孔向上拉开。"],
			"smell": ["气味", "发出强烈的、耸人听闻的气味的行为。"]
		}],
		"Mouth": ["嘴巴", {
			"adventitious mouth": ["嘴巴位置不固定", "至少有一张嘴在身体意想不到的地方（例如手、躯干、尾巴）。"],
			"autofellatio": ["自我口交", "对自己进行口交。"],
			"ball sucking": ["吸睾丸", "用嘴在睾丸上取乐。"],
			"big lips": ["大嘴唇", "嘴巴异常大的嘴唇。嘴唇的高度必须超过人眼的高度才有资格。"],
			"blowjob": ["口交", "涉及口腔和阴茎的性行为。"],
			"blowjob face": ["口交脸", "在口交过程中，在阴茎或物体上以管状方式拉长嘴唇和嘴巴区域。"],
			"braces": ["牙套", "用于对齐和拉直牙齿的装置。"],
			"burping": ["打嗝", "可见的打嗝。"],
			"coprophagia": ["食粪", "吃粪便。"],
			"cunnilingus": ["舔阴", "口服刺激阴道引起性唤起。"],
			"deepthroat": ["深喉", "阴茎进入喉咙的口交。"],
			"double blowjob": ["双根单口交", "两个阴茎插入同一个嘴里。"],
			"foot licking": ["舔脚", "用舌头在脚上引起唤醒。"],
			"gag": ["堵嘴", "任何绑在某人嘴上的东西，部分或完全塞住它。几乎总是涉及束缚。"],
			"gokkun": ["吞精", "饮用或吞咽精液。"],
			"kissing": ["接吻", "两个人将嘴唇压在一起的行为，也可能将他们的舌头伸入对方的嘴里或吮吸对方的嘴巴。"],
			"long tongue": ["长舌头", "参与者的舌头，其长度至少应该能够从嘴巴延伸到参与者的眉毛。"],
			"multimouth blowjob": ["单根多口交", "涉及阴茎和两个或更多嘴巴的性行为。"],
			"piss drinking": ["饮尿", "喝尿液。"],
			"rimjob": ["毒龙", "口服刺激肛门引起性唤起。"],
			"saliva": ["唾液", "将大量口腔分泌物用于性目的。舔或吐不质量。"],
			"smoking": ["吸烟", "一种物质，通常是烟草，在性交过程中被燃烧并品尝或吸入烟雾。"],
			"tooth brushing": ["刷牙", "刷牙以引起性唤起。"],
			"unusual teeth": ["不寻常的牙齿", "牙齿非常锋利、凹陷、张开或缺失。"],
			"vampire": ["吸血鬼", "有尖牙，喝血。必须使用吸血鬼能力或露出尖牙来展示。"],
			"vomit": ["呕吐物", "胃内容物通过嘴或鼻子反流。"],
			"vore": ["丸吞", "通过嘴被整个吞下。"]
		}],
		"Neck": ["脖子", {
			"asphyxiation": ["窒息", "故意限制大脑供氧，通常是为了性唤起。"],
			"collar": ["项圈", "用悬吊的绞索或绕在脖子上的结扎线勒死脖子。人本身不必悬挂在地面上。可能会调用杀戮。"],
			"hanging": ["绞刑", "用悬吊的绞索或绕在脖子上的结扎线勒死脖子。人本身不必悬挂在地面上。可能会调用杀戮。"],
			"leash": ["皮带", "通常系在衣领上或缠绕在脖子上的带子、绳索或链条。经常参与性虐待或宠物游戏活动。"]
		}],
		"Arms": ["腋窝", {
			"armpit licking": ["舔腋窝", "舔参与者腋窝的行为。只舔手臂是不可接受的。"],
			"armpit sex": ["腋窝性爱", "使用腋窝区域刺激阴茎。"],
			"hairy armpits": ["多毛腋窝", "参与者的腋下区域毛发过多。必须足够至少是一团毛发。"]
		}],
		"Hands": ["手", {
			"fingering": ["指交", "用手指创造性快感。"],
			"fisting": ["拳交", "将拳头插入阴道或肛门。"],
			"gloves": ["手套", "衣服覆盖手掌，通​​常是手指。可以将手臂向上延伸至肩部。"],
			"handjob": ["打手枪", "手淫另一个参与者的阴茎。"],
			"multiple handjob": ["单根多人打手枪", "多人同时手淫另一名参与者的阴茎。"]
		}],
		"Breasts": ["乳房", {
			"autopaizuri": ["自我乳交", "对自己进行乳交。"],
			"big areolae": ["大乳晕", "乳头周围有明显的大面积。应至少为乳房表面积的 1/3 才符合条件。"],
			"big breasts": ["大乳", "通常是大乳房。每个乳房应该至少和人的头部一样大。对于Cosplay，这需要D罩杯或更大。"],
			"breast expansion": ["乳房扩张", "乳房大小的任何显着增加。很可能会引起大乳房，也可能是巨大的乳房。"],
			"breast feeding": ["喂奶", "直接吸吮乳房。不需要任何牛奶可见。"],
			"breast reduction": ["乳房缩小", "乳房大小的任何显着减少。可唤起小乳房。"],
			"clothed paizuri": ["穿衣服乳交", "当衣服覆盖了大部分乳房时，进行乳交的动作。必须完全覆盖乳头和乳晕。"],
			"gigantic breasts": ["超巨大乳房", "不可能的大乳房。必须等于或大于人身体其他部分的大小。"],
			"huge breasts": ["巨乳", "异常大的乳房。必须至少是主人头部大小的两倍。"],
			"lactation": ["哺乳期", "乳房喷出液体（通常是牛奶）。"],
			"milking": ["挤奶", "用手或机器拉动乳房排出乳汁。不是为了任何阴茎拉动。"],
			"multiple breasts": ["多个乳房", "单个角色上的任何超过 2 个乳房。"],
			"multiple paizuri": ["多个乳交", "超过一对乳房用于乳交，无论数量多少。"],
			"paizuri": ["乳交", "将阴茎（或类似物体）插入乳房之间的行为。"],
			"small breasts": ["小乳房", "必须足够小才能合理地称女孩为“扁平”。"]
		}],
		"Nipples": ["乳头", {
			"big nipples": ["大乳头", "长到可以用一只手抓住的大乳头。"],
			"dark nipples": ["深色乳头", "颜色较深的乳头，有时与怀孕有关。"],
			"dicknipples": ["鸡巴乳头", "出现或表现得像阴茎的乳头。"],
			"inverted nipples": ["乳头内陷", "缩回乳房内的乳头。通常通过刺激或拉动而被带出。"],
			"multiple nipples": ["多个乳头", "每个乳房有超过 1 个的任意数量的乳头。包括乳房。"],
			"nipple birth": ["乳头出生", "通过乳头出生的生物的行为。"],
			"nipple expansion": ["乳头扩张", "乳头明显增大。可能导致乳头变大。"],
			"nipple fuck": ["乳头交", "阴茎物体刺入乳头或乳房。"]
		}],
		"Torso": ["躯干", {
			"cumflation": ["肚子充满精液肿胀", "胃部由于充满精液而像气球一样向外扩张。"],
			"inflation": ["肚子膨胀", "胃部区域像气球一样向外扩张。通常是由于充满了气体、触手、卵、液体，或者来自食肉或未出生的行为。"],
			"navel fuck": ["肚脐交", "穿透肚脐。"],
			"pregnant": ["怀孕", "涉及明显怀孕的参与者的性活动或裸体。"],
			"stomach deformation": ["胃变形", "一个固体物体从内部推向胃并产生可见的突起。通常由大插入或大阴茎引起。"]
		}],
		"Crotch": ["裆部", {
			"bike shorts": ["自行车短裤", "短款、有弹性、紧身裤（但更多地作为内衣穿着），旨在提高骑车时的舒适度。"],
			"bloomers": ["灯笼裤", "主要为日本女学生设计的健身服。通常为蓝色或红色。"],
			"chastity belt": ["贞操带", "用于防止性交或手淫的锁定衣物。有时与性虐待配对。"],
			"crotch tattoo": ["胯部纹身", "下腹部和胯部之间区域的任何明显图案/标志。"],
			"diaper": ["尿布", "一种用于谨慎排便或小便的内衣；经常被婴儿佩戴。通常与年龄退化、粪便、幼稚或排尿配对。"],
			"fundoshi": ["传统日式内衣", "一种传统的日本内衣，由一段棉制成。"],
			"gymshorts": ["运动短裤", "短款运动裤，颜色和长度可能会有所不同。"],
			"hairy": ["大量阴毛", "明显大量的阴毛。"],
			"hotpants": ["热裤", "用于强调臀部和腿部的短裤。"],
			"mesuiki": ["自发高潮", "对象在没有任何物理刺激阴茎或阴道的情况下达到高潮的性行为。"],
			"multiple orgasms": ["多重高潮", "参与者在同一会话中连续达到三个以上的高潮。"],
			"pantyjob": ["内裤交", "在生殖器上摩擦内裤。"],
			"pubic stubble": ["阴毛茬", "剃光的阴部，留有可见的发茬。"],
			"shimapan": ["条纹内裤", "shima pantsu 的缩写，意为条纹内裤。"],
			"urethra insertion": ["尿道插入", "将任何东西引入尿液排出体外的管中。"]
		}],
		"Penile": ["阴茎", {
			"adventitious penis": ["阴茎位置不固定", "至少有一个阴茎在身体上意想不到的地方（例如手、嘴、尾巴）。"],
			"balls expansion": ["睾丸扩张", "睾丸变大。可能导致大球。"],
			"ball sucking": ["吸睾丸", "用嘴在睾丸上取乐。"],
			"balljob": ["睾丸交", "睾丸的使用方式与乳交相同。"],
			"big balls": ["大睾丸", "异常大的睾丸。一个球至少和一只手一样大就足够了。"],
			"big penis": ["大阴茎", "一个异常大的阴茎，至少和主人的前臂一样大。"],
			"cbt": ["折磨阴茎睾丸", "阴茎和睾丸的折磨。旨在以任何方式折磨阴茎区域的行为。"],
			"cockphagia": ["阴茎吞下", "通过阴茎整个吞下。可能会引起大阴茎和尿道插入。"],
			"cuntboy": ["只有屄男孩", "男性有阴道而没有阴茎。"],
			"cock ring": ["阴茎环", "戴在阴茎和/或阴囊轴上的戒指。不要与贞操带混淆，但不会取消它的资格。用作虫洞的环不符合条件。"],
			"cockslapping": ["用阴茎敲打", "用阴茎敲打一个人（通常是在脸上）。"],
			"dick growth": ["阴茎增长", "阴茎异常生长。可能会导致阴茎变大。"],
			"dickgirl on male": ["扶她/人妖x男", "女性阴茎插入男性，无论是肛门还是口腔。"],
			"dickgirls only": ["只有扶她", "画廊中的所有性、恋物或亲密互动都仅限于扶她之间。需要至少两个扶她互动。"],
			"frottage": ["阴茎互相摩擦", "两个或多个阴茎相互摩擦。"],
			"futanari": ["扶她有阴道", "参与者既有阴茎又有阴道。"],
			"horse cock": ["马阴茎", "马形阴茎。很可能会调用大阴茎标签。"],
			"huge penis": ["巨大阴茎", "一个巨大的阴茎；至少与主人的躯干长度或周长相等."],
			"multiple penises": ["多根阴茎", "拥有不止一个阴茎。不适用于触手式阴茎。"],
			"penis birth": ["阴茎分娩", "通过阴茎出生的生物的行为。"],
			"phimosis": ["包茎", "阴茎包皮覆盖度非常高。即使它是直立的，也应该几乎完全覆盖。"],
			"prostate massage": ["前列腺按摩", "摩擦肛门内壁，靠近睾丸。"],
			"shemale": ["人妖", "有男性生殖器但没有阴道的女孩。"],
			"scrotal lingerie": ["阴囊内衣", "在阴茎生殖器上穿的色情服装。"],
			"small penis": ["小阴茎", "异常娇小的阴茎；必须小于其主人的食指。对于正太控，请使用小指。"],
			"smegma": ["包皮垢", "各种物质聚集在龟头和包皮之间或阴蒂和小阴唇周围的潮湿区域。"]
		}],
		"Vaginal": ["阴道", {
			"adventitious vagina": ["阴道位置不固定", "在身体意想不到的地方（例如手、嘴、上身）有阴道。"],
			"big clit": ["大阴蒂", "异常大的阴蒂。"],
			"big vagina": ["大阴道", "异常大的阴道，有时只是嘴唇。"],
			"birth": ["分娩", "一个活生生的生物出生的行为。通常在怀孕之前。"],
			"cervix penetration": ["子宫颈穿透", "女性的子宫颈/子宫被明显穿透。很可能与X 射线标签一起调用。"],
			"cervix prolapse": ["子宫颈脱垂", "阴道壁从阴道外扩张。有时前面会张开。"],
			"clit growth": ["阴蒂增长", "阴蒂的生长，通常会导致一个大阴蒂。"],
			"clit insertion": ["阴蒂插入", "插入阴道或肛门的阴蒂。通常涉及一个大阴蒂。"],
			"clit stimulation": ["阴蒂刺激", "刺激阴蒂。"],
			"cunnilingus": ["舔阴", "口服刺激阴道引起性唤起。"],
			"cuntbusting": ["折磨阴道", "物理攻击阴道的行为。"],
			"defloration": ["破瓜", "女性失去童贞的行为。通常包括轻微出血。"],
			"double vaginal": ["双阴道", "两个阴茎插入同一个阴道。"],
			"multiple vaginas": ["多个阴道", "拥有多个阴道。"],
			"squirting": ["潮吹", "女性射精强烈。"],
			"strap-on": ["绑戴假阳具", "一个可连接的假阳具。很可能是男性被肛交或百合的一部分。"],
			"tribadism": ["磨镜", "涉及女性互相摩擦外阴的性行为。很可能会调用百合。"],
			"triple vaginal": ["三重阴道", "三个阴茎、性玩具或其他物体插入同一个阴道。"],
			"unbirth": ["反向出生", "一名参与者被阴道吞食。基本上是反向出生（因此不需要它或怀孕标签）。"],
			"vaginal sticker": ["阴道贴", "用粘合剂或其他方式覆盖阴道区域的任何类型的贴片。"]
		}],
		"Buttocks": ["臀部", {
			"anal": ["肛门", "穿透肛门。任何方法都可以接受（性玩具、触手等）"],
			"anal birth": ["肛门分娩", "通过肛门出生的生物的行为。通常���怀孕之前。"],
			"anal intercourse": ["肛交", "参与者用阴茎或穿戴的绑带刺入另一参与者的肛门。"],
			"analphagia": ["肛吞", "通过肛门整个吞下。"],
			"anal prolapse": ["脱肛", "肛门壁从肛门扩张。有时前面会张开。"],
			"ass expansion": ["屁股扩张", "臀部因任何原因而增长。很可能招惹大屁股。"],
			"assjob": ["屁股缝交", "在两颊之间摩擦阴茎。"],
			"big ass": ["大屁股", "臀部明显宽或大。"],
			"double anal": ["双根肛门", "两个阴茎插入同一个肛门。"],
			"enema": ["灌肠", "液体或空气注入肛门。可能引起通货膨胀。存在包括所有图像，其中液体在参与者的身体内或流入/流出参与者的身体。"],
			"farting": ["放屁", "可见的胀气。"],
			"multiple assjob": ["多个屁股缝交", "不止一个人在他们的屁股颊之间摩擦阴茎。"],
			"pegging": ["男性被肛交", "男性被绑带或性玩具肛门穿透。"],
			"rimjob": ["毒龙", "口服刺激肛门引起性唤起。"],
			"scat": ["排便", "排便（拉屎）。"],
			"spanking": ["打屁股", "打屁股是一种折磨或性快感。"],
			"tail": ["尾巴", "一个或多个突出的柔性附肢，是身体的一部分，通常从躯干后部突出。没有腿的身体不符合条件。"],
			"tail plug": ["尾巴性玩具", "任何类型的尾巴性玩具。"],
			"tailphagia": ["尾吞", "被一条尾巴整个吞下。"],
			"triple anal": ["三根肛门", "三个阴茎插入同一个肛门。"]
		}],
		"Either Hole": ["任意洞", {
			"eggs": ["鸡蛋", "在自己体内产卵或产卵的行为。经常引发通货膨胀。"],
			"gaping": ["张开", "性交后明显伸展的阴道或肛门。通常由大插入、拳交、大或巨大的阴茎引起。"],
			"large insertions": ["大插入", "将性玩具或其他似乎不太可能舒适地放入接收所述物体的物体中。"],
			"nakadashi": ["中出", "射精停留在嘴以外的任何孔道内。通常包括外部精液池。"],
			"prolapse": ["脱垂", "阴道壁或肛门壁从各自的孔中扩张出来。有时前面会张开。"],
			"sex toys": ["性玩具", "任何用于性目的的玩具。"],
			"speculum": ["窥器", "一种用于扩张开放体腔（如肛门或阴道）的医疗器械。经常调用张开。"],
			"unusual insertions": ["不寻常的插入", "将通常不用于性活动或医疗检查的无生命物体插入生殖器或肛门的行为。"]
		}],
		"Legs": ["腿", {
			"garter belt": ["吊袜带", "一种带夹子的腰带状内衣，用来夹住长袜。"],
			"kneepit sex": ["膝盖性爱", "使用膝盖下方刺激阴茎或类似物体。"],
			"leg lock": ["锁腿", "用双腿抱住性伴侣。"],
			"legjob": ["腿交", "用腿刺激另一个人。"],
			"pantyhose": ["连裤袜", "一种通常透明的单件内衣，能够完全覆盖腿部和生殖器区域。"],
			"stirrup legwear": ["马镫护腿", "覆盖脚踝但不完全覆盖脚底的裤袜。需要长袜或连裤袜标签。"],
			"stockings": ["丝袜", "一种通常透明的弹性服装，覆盖脚部和腿部下部，但不到达生殖器区域。"],
			"sumata": ["素股", "使用大腿刺激阴茎物体的性爱。"]
		}],
		"Feet": ["脚", {
			"denki anma": ["電気按摩", "一名参与者用他们的脚强烈地压迫另一名参与者的胯部区域，通常是同时握住他们的腿。如果这对被压迫的人产生性刺激，则会调用脚交。可能会引发性虐待、两女格斗、调教或摔跤"],
			"foot insertion": ["脚插入", "将一只或多只脚插入阴道等孔口。"],
			"foot licking": ["舔脚", "用舌头在脚上引起唤醒。"],
			"footjob": ["脚交", "用脚对另一名参与者进行性刺激。"],
			"multiple footjob": ["多重脚交", "多人同时使用脚对同一参与者进行性刺激。"],
			"sockjob": ["袜交", "涉及在生殖器上摩擦袜子的性行为。"],
			"stirrup legwear": ["马镫腿装", "覆盖脚踝但不完全覆盖脚底的裤袜。需要长袜或连裤袜标签。"],
			"thigh high boots": ["大腿高筒靴", "超过膝盖的靴子。"]
		}],
		"Costume": ["戏服", {
			"animegao": ["全身动漫服装", "一种全身服装，包括一个全面罩或头部，描绘了一个模仿角色，通常由角色扮演者穿着。"],
			"apparel bukkake": ["精液服装", "旧衣服或其他配饰被精液覆盖或充满。"],
			"apron": ["围裙", "做饭时常穿的保护衣服。通常出于色情目的而穿着。"],
			"bandages": ["绷带", "布条或类似材料缠绕在至少 10% 的人体上并且可见。"],
			"bandaid": ["创可贴", "将创可贴放置在阴部或乳头上。"],
			"bat boy": ["蝙蝠男孩", "男版蝙蝠女。"],
			"bat girl": ["蝙蝠女孩", "一种女性类人生物，有翅膀、耳朵，有时还有尾巴或蝙蝠的其他显着特征。"],
			"bike shorts": ["自行车短裤", "短款、有弹性、紧身裤（但更多地作为内衣穿着），旨在提高骑车时的舒适度。"],
			"bikini": ["比基尼", "覆盖生殖器和乳房的两件式泳装。这两件可以用绳子（又名弹弓比基尼）连接，但更常见的是完全分开。"],
			"blindfold": ["眼罩", "一种旨在使人失去视力的眼罩。"],
			"bloomers": ["灯笼裤", "主要为日本女学生设计的健身服。通常为蓝色或红色。"],
			"bodystocking": ["紧身连衣裤", "一种覆盖大部分身体的长袜。"],
			"bodysuit": ["紧身衣裤", "任何合身的全身套装；必须遮住胳膊和腿。"],
			"bride": ["新娘", "一个穿着婚纱的人。"],
			"bunny boy": ["兔男孩", "男版兔女郎。"],
			"bunny girl": ["兔女郎", "兔耳朵，偶尔也有蓬松的尾巴。"],
			"business suit": ["西装", "一个穿着职业装的人。"],
			"butler": ["管家", "一名家庭佣工，经常为大家庭的富裕家庭服务。穿燕尾服，系领带或领结。"],
			"cashier": ["收银员", "站在柜台后面或在商店工作的人，穿着制服，上面系着围裙。"],
			"catboy": ["猫男孩", "男版猫娘。"],
			"catgirl": ["猫女孩", "有耳朵，通常有尾巴或猫的其他特征。"],
			"cheerleader": ["啦啦队长", "啦啦队制服，通常搭配短裙和配套配饰。"],
			"chinese dress": ["中国装", "一件紧身连体连衣裙，通常带有简单或花卉图案。"],
			"christmas": ["圣诞节", "通常与圣诞老人相关的服装，主要使用红色织物和白色饰边。"],
			"clothed female nude male": ["穿衣女x裸男", "男性的生殖器完全暴露给非裸体女性。"],
			"clothed male nude female": ["穿衣男x裸女", "女性的生殖器完全暴露在非裸体男性面前。"],
			"clown": ["小丑", "带有褶边衣领和衣服的白脸。通常强调面部特征，例如大红鼻子和嘴唇以及颜色醒目的头发。"],
			"cock ring": ["阴茎环", "戴在阴茎和/或阴囊轴上的戒指。不要与贞操带混淆，但不会取消它的资格。用作虫洞的环不符合条件。"],
			"collar": ["衣领", "系在脖子上或围住脖子的衣服。经常在性虐待或宠物游戏活动中佩戴，可能包括皮带。"],
			"condom": ["避孕套", "一种塑料包装，旨在保护用户和伴侣免受不必要的性病和怀孕的伤害。"],
			"corset": ["紧身胸衣", "用来固定和塑造躯干的衣服，通常是沙漏形。"],
			"cosplaying": ["角色扮演", "一个参与者装扮成一个模仿系列中的另一个角色。不包括通用角色扮演，例如学校、护士或女仆制服。"],
			"cowgirl": ["牛女孩", "有牛耳朵、牛角，可能还有尾巴和牛铃。可能有荷斯坦图案（白色带黑色斑点）。常与大胸搭配。"],
			"cowman": ["牛男孩", "男版女牛仔。"],
			"crossdressing": ["变装", "通常男性穿着女性服装，但也可能相反。对于后者，只有在有明确意图让女性穿得像个男人的情况下才应该标记它。"],
			"diaper": ["尿布", "一种用于谨慎排便或小便的内衣；经常被婴儿佩戴。通常与年龄退化、粪便、幼稚或排尿配对。"],
			"dougi": ["武术训练服装", "通常用于各种武术课程和训练的服装。通常单色搭配腰带。"],
			"exposed clothing": ["衣着暴露", "任何一种带有开口的衣服，使他人可以看到生殖器区域、肛门或乳头。"],
			"eyemask": ["眼罩", "眼睛周围区域的覆盖物，仍然使脸部的其余部分暴露在外。"],
			"eyepatch": ["布料遮眼", "一块布或其他材料覆盖一只眼睛。"],
			"fishnets": ["渔网", "由带有开口菱形针织图案的材料制成的服装制品。必须在至少一半的躯干或肢体（例如大腿、前臂等）上可见"],
			"fundoshi": ["传统日式内衣", "一种传统的日本内衣，由一段棉制成。"],
			"gag": ["堵嘴", "任何绑在某人嘴上的东西，部分或完全塞住它。几乎总是涉及束缚。"],
			"garter belt": ["吊袜带", "一种带夹子的腰带状内衣，用来夹住长袜。"],
			"gasmask": ["防毒面具", "一种覆盖面部并包括呼吸管或过滤器的塑料面罩。"],
			"glasses": ["眼镜", "任何带框的透明眼镜戴在双眼前面以改善视力。"],
			"gloves": ["手套", "衣服覆盖手掌，通​​常是手指。可以将手臂向上延伸至肩部。"],
			"gymshorts": ["运动短裤", "短款运动裤，颜色和长度可能会有所不同。"],
			"haigure": ["紧身衣女孩", "一个穿着紧身衣服的女孩，手臂和腿弯曲，强调胯部区域。"],
			"headphones": ["耳机", "将耳机戴在头上或脖子上的人。耳机罩必须足够大以覆盖耳朵。"],
			"hijab": ["头巾", "一种面纱，覆盖头部，通常是胸部，主要隐藏头发。"],
			"hotpants": ["热裤", "用于强调臀部和腿部的短裤。"],
			"kemonomimi": ["兽耳", "具有动物耳朵和尾巴但几乎没有其他动物部位的类人生物。"],
			"kigurumi pajama": ["兽耳睡衣", "带有兜帽的连体衣，描绘了一种动物。"],
			"kimono": ["和服", "带有大丝带和不同图案的传统日本服装。"],
			"kindergarten uniform": ["幼儿园制服", "一个人穿着一件带有假领的简单浅蓝色套头衫，通常搭配黄色无檐小便帽或校帽。"],
			"kunoichi": ["女忍者服装", "女忍者服装。通常是深色长袍和/或带有一些轻型盔甲的渔网。"],
			"lab coat": ["实验服", "一件白色的长外套。医生、科学家或学校护士经常佩戴。"],
			"latex": ["乳胶", "任何基于橡胶或塑料的衣服，通常是紧身的。"],
			"leash": ["皮带", "通常系在衣领上或缠绕在脖子上的带子、绳索或链条。经常参与性虐待或宠物游戏活动。"],
			"leotard": ["紧身衣", "常用于体操、兔女郎和摔跤的塑料服装。"],
			"lingerie": ["内衣", "为了增加性感而穿着的轻薄或性感的内衣；与普通内衣相反。还包括睡衣。"],
			"living clothes": ["生活服", "根据自己的意愿移动的衣服。"],
			"magical girl": ["魔法少女", "一种服装，包括该类型常见的裙子和褶边制服。"],
			"maid": ["女仆", "一种女仆制服，通常由各种长度的连衣裙或裙子和围裙组成。单独的头带不符合条件。"],
			"mecha boy": ["机甲男孩", "男版机甲少女。"],
			"mecha girl": ["机甲女孩", "一名穿着机械零件的女性。"],
			"metal armor": ["金属盔甲", "在中世纪或中世纪幻想时代穿着的金属盔甲。"],
			"miko": ["巫女", "神社少女；一位年轻的女祭司。通常穿着红色长裤或带蝴蝶结的红色略带褶皱的长裙和带有一些白色或红色发带的白色羽织（和服夹克）。"],
			"military": ["军事", "任何常见的军装，如迷彩服或军官制服。"],
			"mouth mask": ["口罩", "只覆盖眼睛下方的面具。"],
			"nazi": ["纳粹", "佩戴任何纳粹用具。"],
			"ninja": ["忍者", "男忍者服装。通常是深色衣服和一些轻型盔甲。"],
			"nose hook": ["鼻钩", "一个钩子用来把鼻孔向上拉开。"],
			"nun": ["修女", "穿着典型的黑色布长袍，按照罗马天主教的命令穿着。也可能戴着头巾、念珠和面纱。"],
			"nurse": ["护士", "穿着常见的白色/粉色套装或磨砂，通常有帽子。"],
			"pantyhose": ["连裤袜", "一种通常透明的单件内衣，能够完全覆盖腿部和生殖器区域。"],
			"pasties": ["馅饼", "贴有粘合剂的覆盖乳头和乳晕的贴片。"],
			"piercing": ["穿孔", "除了耳朵上的任何形式的穿孔。通常在阴蒂或乳头上放置戒指。"],
			"pirate": ["海盗", "海盗装。通常是带有角帽或大手帕的飘逸背心。通常有腰带、马裤和带有蓬松袖子的紧身衣。"],
			"policeman": ["警察", "男版女警。"],
			"policewoman": ["女警察", "穿着典型的警察制服。通常有徽章、衬衫上的小袋和枪套。男性版本见警察。"],
			"ponygirl": ["小马女", "一个女人穿着齿轮，如钻头/缰绳、眼罩、缰绳或马尾。可以骑在身上或以其他方式像动物一样对待。"],
			"priest": ["牧师", "任何宗教团体的神职人员所穿的服装。通常是白领长袍或西装。"],
			"race queen": ["赛车皇后", "一种紧身且通常很轻薄的制服，带有公司标志。可能会调用紧身衣裤或乳胶。"],
			"randoseru": ["皮革背包", "由皮革或类似皮革的合成材料制成的背包，最常用于小学生。"],
			"sarashi": ["束胸", "一种缠在腹部/胸部区域的长而类似绷带的布。对于男性，它通常覆盖女性的腹部和胸部。"],
			"scrotal lingerie": ["阴囊内衣", "在阴茎生殖器上穿的色情服装。"],
			"shimapan": ["条纹内裤", "shima pantsu 的缩写，意为条纹内裤。"],
			"stewardess": ["空姐制服", "在公共汽车、电梯或飞机上工作的人的制服。"],
			"steward": ["管家制服", "在公共汽车、电梯或飞机上工作的人的制服。"],
			"stirrup legwear": ["马镫腿裤", "覆盖脚踝但不完全覆盖脚底的裤袜。需要长袜或连裤袜标签。"],
			"stockings": ["丝袜", "一种通常透明的弹性服装，覆盖脚部和腿部下部，但不到达生殖器区域。"],
			"straitjacket": ["紧身衣", "一种躯干服装，长袖，超过穿着者的手臂，可以系在一起以限制他们的运动。"],
			"swimsuit": ["泳装", "专为游泳或其他水上活动而穿着的服装，通常覆盖整个躯干。"],
			"sundress": ["背心裙", "一种轻质面料的非正式连衣裙，通常是宽松的，没有分层上衣。"],
			"sunglasses": ["太阳镜", "任何用于在阳光下改善视力的带框、不透明眼镜。"],
			"thigh high boots": ["大腿高筒靴", "超过膝盖的靴子。"],
			"tiara": ["头饰", "半圆形礼仪头带，款式可能不同，但靠近前额放置。经常被君主和魔法少女佩戴。"],
			"tights": ["紧身衣", "西方超级英雄经常穿的紧身衣服。既可以用于腿，也可以用于身体。"],
			"tracksuit": ["运动服", "由合成材料制成的配套衬衫和裤子，用于在运动或运动中产生出汗。性交时只需要穿上衣服的一部分。"],
			"transparent clothing": ["透明衣", "任何一种在穿着时覆盖胯部或胸部的透明衣服。仅当服装在这些区域中的任何一个设计为透明时才适用。"],
			"vaginal sticker": ["阴道贴", "用粘合剂或其他方式覆盖阴道区域的任何类型的贴片。"],
			"waiter": ["服务员", "男版女服务员。"],
			"waitress": ["女服务员", "在餐厅工作的女孩穿的制服；通常是浅色连衣裙，有时包括围裙或裙子。"],
			"wet clothes": ["湿衣服", "穿着的衣服因水或其他液体而潮湿和透明。"],
			"witch": ["女巫", "一顶宽檐高尖帽，通常穿着布袍。"]
		}],
		"Multiple Activities": ["多人运动", {
			"bisexual": ["双性恋", "在整个画廊中与同性和异性进行性活动的参与者。"],
			"double anal": ["双根单肛门", "两个阴茎插入同一个肛门。"],
			"double blowjob": ["双根单口交", "两个阴茎插入同一个嘴里。"],
			"double vaginal": ["双阴道", "两个阴茎插入同一个阴道。"],
			"fff threesome": ["三女", "包含三名女性的三人组。"],
			"ffm threesome": ["两女一男", "一个三人组，包含两个女性和一个男性。"],
			"fft threesome": ["两女一变性", "三人组包含两名女性和一名变性人（双性人或人妖）。"],
			"group": ["群交", "两个以上的参与者同时进行性行为。"],
			"harem": ["后宫", "1 ��被至少 3 人追求，所有人同时进行自愿性行为。"],
			"layer cake": ["千层蛋糕", "阴茎在两个阴道之间摩擦。可能涉及每个阴道之间的交替渗透。"],
			"mmf threesome": ["两男一女", "包含两男一女的三人组。"],
			"mmm threesome": ["三男", "三人组包含三名男性。"],
			"mmt threesome": ["两男一变性", "三人组，包含两名男性和一名变性人（双性人或人妖）。"],
			"mtf threesome": ["一男一女一变性", "三人组包含一名男性、一名变性人（双性人或人妖）和一名女性。"],
			"multimouth blowjob": ["多口口交", "涉及阴茎和两个或更多嘴巴的性行为。"],
			"multiple assjob": ["多屁股交", "不止一个人在他们的屁股颊之间摩擦阴茎。"],
			"multiple footjob": ["单根多足交", "多人同时使用脚对同一参与者进行性刺激。"],
			"multiple handjob": ["单根多手交", "多人同时手淫另一名参与者的阴茎。"],
			"multiple paizuri": ["多乳交", "超过一对乳房用于乳交，无论数量多少。"],
			"multiple straddling": ["多跨骑", "多人同时跨骑并与同一参与者发生性关系。可能会调用颜面骑乘。"],
			"oyakodon": ["母娘丼", "一组父母和他们的一个（或多个）孩子同时与同一个伴侣进行性活动。"],
			"shimaidon": ["姉妹丼", "一群兄弟姐妹同时与同一个伴侣进行性活动。"],
			"triple anal": ["三重肛门", "三个阴茎插入同一个肛门。"],
			"triple vaginal": ["三重阴道", "三个阴茎、性玩具或其他物体插入同一个阴道。"],
			"ttf threesome": ["两变性一女", "三人组包含两名变性人（双性人或人妖）和一名女性。"],
			"ttm threesome": ["两变性一男", "三人组包含两名变性人（双性人或人妖）和一名男性。"],
			"ttt threesome": ["三变性", "三人组包含三个扶她或人妖的任意组合。"],
			"twins": ["双胞胎", "一对长相相似的兄弟姐妹与第三人或彼此发生性关系。可能会调用群交和姉妹丼标签。"]
		}],
		"Multiple Holes": ["多个洞", {
			"all the way through": ["全身挿入", "有东西从人的嘴巴穿过人的身体后孔，反之亦然。很可能是通过大插入或触手完成的。"],
			"double penetration": ["二穴", "同时插入两个孔（嘴、阴道或屁股）。很可能调用组标签。"],
			"triple penetration": ["三穴", "三个插入同时发生在一个人身上。组合通常是双渗透，其余孔也被渗透，或双阴道/双肛门，另一个后孔被渗透。"]
		}],
		"Tools": ["工具", {
			"blindfold": ["眼罩（失去视力）", "一种旨在使人失去视力的眼罩。"],
			"clamp": ["夹子", "一个或多个夹在身体上以引起疼痛和/或性快感。通常是指专门用于束缚游戏的乳头或阴蒂夹，但也可能涉及常见的家居用品，如衣夹或纸扣。"],
			"dakimakura": ["动漫抱枕", "一个全身印有人物图案的身体枕头。对于抱枕风格的图像也可以接受。"],
			"gag": ["堵嘴", "任何绑在某人嘴上的东西，部分或完全塞住它。几乎总是涉及束缚。"],
			"glory hole": ["墙洞", "墙上的一个洞是用来进行性活动的。"],
			"machine": ["机器", "具有机械结构的性爱。"],
			"onahole": ["人造阴道", "用于手淫阴茎的人造阴道。"],
			"pillory": ["颈手枷", "通常是木制外壳或专门限制头部和手部运动的装置。"],
			"pole dancing": ["钢管舞", "为了色情目的，带着或绕着一根垂直杆跳舞。"],
			"real doll": ["真人娃娃", "现实生活中的人形娃娃，用于性目的。"],
			"sex toys": ["性玩具", "任何用于性目的的玩具。"],
			"speculum": ["窥镜", "一种用于扩张开放体腔（如肛门或阴道）的医疗器械。经常调用张开。"],
			"strap-on": ["绑带式", "一个可连接的假阳具。很可能是男性被肛交或百合的一部分。"],
			"syringe": ["注射器", "一种由管子、柱塞和连接的针头组成的工具。用于向参与者注射不同种类的液体或气体。"],
			"table masturbation": ["桌上自慰", "使用桌子作为自慰工具，用生殖器摩擦桌子。"],
			"tail plug": ["尾塞", "需要性玩具和肛门标签。不要与真正的尾巴���淆。"],
			"tube": ["管子", "任何插入口腔以输送液体或身体物质的圆柱形管道。"],
			"unusual insertions": ["不寻常的插入", "将通常不用于性活动或医疗检查的无生命物体插入生殖器或肛门的行为。"],
			"vacbed": ["真空床", "用于性虐待或束缚游戏的真空床。"],
			"whip": ["鞭子", "一种鞭打或打击动物或人以造成中等程度疼痛的工具。以这种方式使用任何性对象也很重要。极有可能涉及性虐待。"],
			"wooden horse": ["木马", "任何具有三角形向上指向的装置，受害者被要求跨骑/安装在顶部，通常将他们的体重放在他们的生殖器上。"],
			"wormhole": ["虫洞", "连接两个遥远位置的一个或多个对象。通常表现为“移动荣耀洞”的一种形式，男性或女性可以通过虫洞获得各自的生殖器。"]
		}],
		"Fluids": ["流体", {
			"oil": ["油", "参与者至少部分覆盖有润滑剂，如身体油，以赋予其皮肤光滑的质地/光滑的外观。"],
			"slime": ["史莱姆", "任何与性有关的粘稠/凝胶状物质。基于粘液的生物需要这个和怪物标签。"],
			"slime boy": ["史莱姆男孩", "一个男孩，他的身体完全是用粘液制成的。"],
			"slime girl": ["史莱姆女孩", "一个身体主要由粘液制成的女孩。"],
			"underwater": ["水下", "参与者在性交过程中大部分或完全浸没在液体中。"]
		}],
		"Bodily Fluids": ["体液", {
			"blood": ["血液", "描绘大量血液，例如从身体伤口流出的血液。"],
			"lactation": ["哺乳", "乳房喷出液体（通常是牛奶）。"],
			"milking": ["挤奶", "用手或机器拉动乳房排出乳汁。不是为了任何阴茎拉动。"],
			"saliva": ["唾液", "将大量口腔分泌物用于性目的。舔或吐不质量。"],
			"squirting": ["喷出", "女性射精强烈。"]
		}],
		"Semen": ["精液", {
			"apparel bukkake": ["精液服装", "旧衣服或其他配饰被精液覆盖或充满。"],
			"bukkake": ["颜射", "被精液覆盖的行为，通常不止一个人。"],
			"cum bath": ["精子浴", "浴缸、水池或另一个装满精液的大容器，其中至少有一个人部分浸没在其中。"],
			"cum in eye": ["射在眼睛", "射入人的眼睛。"],
			"cum swap": ["精液交换", "在 2 名或更多参与者之间交换已经射精的精液。"],
			"cumflation": ["胃充满精液像气球", "胃部由于充满精液而像气球一样向外扩张。"],
			"giant sperm": ["肉眼可见精子", "肉眼可见的单个精子细胞，无需任何放大。"],
			"gokkun": ["吞精", "饮用或吞咽精液。"],
			"nakadashi": ["中出", "射精停留在嘴以外的任何孔道内。通常包括外部精液池。"]
		}],
		"Waste": ["排泄", {
			"coprophagia": ["食粪", "吃粪便。"],
			"internal urination": ["小便", "另一名参与者的尿液在除嘴巴外的任何孔口内徘徊。通常包括排尿后。"],
			"menstruation": ["月经", "作为女性月经周期的副产品，阴道流血；不是外伤引起的。与卫生棉条和卫生巾密切相关。"],
			"omorashi": ["漏尿", "一个角色拿着一个充满膀胱，要么弄湿自己，要么靠近。"],
			"piss drinking": ["饮尿", "喝尿液。"],
			"public use": ["肉便器", "一个人保持静止并公开进行性行为，通常与多个伴侣一起。经常涉及它们被用作生活厕所/小便池。可能包括或导致正文写作。"],
			"scat": ["便便", "排便（拉屎）。"],
			"sweating": ["出汗", "参与者身上有大量汗水滴落。"],
			"urination": ["放尿", "小便。"],
			"vomit": ["呕吐", "胃内容物通过嘴或鼻子反流。"]
		}],
		"Force": ["能力", {
			"chikan": ["痴汉", "以性方式抚摸或触摸他人的行为。很少自愿，经常发生在火车或公共汽车上。"],
			"rape": ["强奸", "强迫或非自愿的性行为。"],
			"sleeping": ["睡奸", "与不清醒的人发生性关系。视情况而定，可能算作强奸。"],
			"time stop": ["时间停止", "至少一名参与者的时间停止或改变，而另一名参与者利用这种情况进行性利用。"]
		}],
		"Sadomasochism": ["施虐受虐", {
			"bdsm": ["性虐待", "一种生活方式，其中至少一个伴侣占主导地位，至少另一个伴侣是顺从的。不需要束缚或���磨标签，但可能导致两者之一或两者。"],
			"bodysuit": ["紧身衣裤", "任何合身的全身套装；必须遮住胳膊和腿。"],
			"blindfold": ["眼罩（失去视力）", "一种旨在使人失去视力的眼罩。"],
			"clamp": ["夹子", "一个或多个夹在身体上以引起疼痛和/或性快感。通常是指专门用于束缚游戏的乳头或阴蒂夹，但也可能涉及常见的家居用品，如衣夹或纸扣。"],
			"collar": ["衣领", "系在脖子上或围住脖子的衣服。经常在bdsm或宠物游戏活动中佩戴，可能包括皮带。"],
			"femdom": ["调教", "女性的性支配。通常超过男性，但可以超过另一个女性。"],
			"food on body": ["身上放食物", "食物（尤其是寿司）呈现在赤裸的身体上。"],
			"forniphilia": ["人体家具", "将参与者用作家具。"],
			"human cattle": ["人类牲畜", "人类作为牲畜饲养，通常用于挤奶和/或繁殖。经常涉及束缚。"],
			"josou seme": ["女装施虐", "一个变装者或假女孩带头/对性伴侣占主导地位。"],
			"latex": ["乳胶", "任何基于橡胶或塑料的衣服，通常是紧身的。"],
			"orgasm denial": ["拒绝高潮", "通过工具等方式阻止某人达到性高潮。"],
			"petplay": ["人类宠物", "将参与者视为宠物。通常涉及项圈和可能的性虐待。"],
			"slave": ["奴隶", "强迫参与者出于性目的而成为奴役。如果这是自愿使用性虐待代替。"],
			"tickling": ["挠痒痒", "以导致不自主抽搐动作或笑声的方式触摸身体。通常用羽毛完成。"]
		}],
		"Bondage": ["束缚", {
			"bondage": ["捆绑", "需要为颈手枷、绳艺、卡在墙上和木马标签。"],
			"gag": ["堵嘴", "任何绑在某人嘴上的东西，部分或完全塞住它。几乎总是涉及束缚。"],
			"harness": ["吊带", "服装由皮革带组成，由金属环固定在一起，环绕穿着者的身体。"],
			"pillory": ["颈手枷", "通常是木制外壳或专门限制头部和手部运动的装置。"],
			"ponygirl": ["小马女", "一个女人穿着齿轮，如钻头/缰绳、眼罩、缰绳或马尾。可以骑在身上或以其他方式像动物一样对待。"],
			"shibari": ["绳艺", "一种艺术绳索系在躯干周围的方法，以创造视觉上独特的图案。"],
			"straitjacket": ["紧身衣", "一种躯干服装，长袖，超过穿着者的手臂，可以系在一起以限制他们的运动。"],
			"stuck in wall": ["卡在墙上", "有人被困在一个长长的表面上，无法移动，经常有生殖器或其他非肢体身体部位悬空。"],
			"vacbed": ["真空床", "用于性虐待或束缚游戏的真空床。"]
		}],
		"Violence": ["暴力", {
			"abortion": ["堕胎", "任何关于杀害未出生婴儿的描述，即使是隐含的。这包括企图杀人，但不包括未对儿童造成明显伤害的未遂企图。"],
			"blood": ["血液", "描绘大量血液，例如从身体伤口流出的血液。"],
			"cannibalism": ["食人", "类人生物被其他类人生物煮熟和/或吃掉（字面意思）。"],
			"catfight": ["两女格斗", "两名女性之间不协调的战斗。"],
			"cbt": ["折磨阴茎睾丸", "阴茎和睾丸的折磨。旨在以任何方式折磨阴茎区域的行为。"],
			"cuntbusting": ["折磨阴道", "物理攻击阴道的行为。"],
			"dismantling": ["拆解（机器人）", "移除机械生物的一部分、肢解或完全破坏。"],
			"guro": ["血腥", "有机物的图形切割。适度的血腥或暴力不符合条件。"],
			"electric shocks": ["电击", "使用电来引起疼痛或愉悦。"],
			"ryona": ["殴打", "暴力、打架或殴打。通常处于不需要酷刑标签的水平。"],
			"snuff": ["杀戮", "一名参与者被明显杀死。"],
			"torture": ["拷问", "用于造成疼痛或不需要的刺激的各种技术。"],
			"trampling": ["践踏", "被一个占主导地位的伙伴践踏。通常是性虐待的一部分。"],
			"whip": ["鞭子", "一种鞭打或打击动物或人以造成中等程度疼痛的工具。以这种方式使用任何性对象也很重要。极有可能涉及性虐待。"],
			"wrestling": ["摔跤", "涉及至少两名参与者之间的格斗和握持的全身战斗。"]
		}],
		"Privacy": ["隐私", {
			"exhibitionism": ["暴露狂", "自愿裸露或有被其他人看到的风险的性活动。还公然暴露于其他人。"],
			"filming": ["拍摄", "某人的性活动被视觉记录/广播的行为。"],
			"forced exposure": ["强迫暴露", "参与者的裸露或性活动是在非参与者的全视范围内不由自主地进行的。"],
			"hidden sex": ["偷吃", "在第三方直接在场的情况下发生的性行为，但看不见。"],
			"humiliation": ["屈辱", "在未参与的观众面前以性方式非自愿地羞辱/贬低一个人。"],
			"voyeurism": ["偷窥", "监视从事性行为、脱衣或在洗手间的参与者。"]
		}],
		"Self Pleasure": ["自慰", {
			"autofellatio": ["自我口交", "对自己进行口交。"],
			"autopaizuri": ["自我乳交", "对自己进行乳交。"],
			"clone": ["克隆", "一个或多个角色的精确复制品同时进行性活动。年龄、性别、体型、精神状态等方面的差异不符合条件。"],
			"masturbation": ["自慰", "自娱自乐。"],
			"phone sex": ["色情通话", "在取悦自己的同时使用通讯设备进行色情对话。"],
			"selfcest": ["自我男女性爱", "同一个人的两个不同版本之间的性行为。通常在某人和他们的性别改变的对手之间。"],
			"solo action": ["借助外物自慰", "一个角色自己从事性活动。使用物体作为刺激是可以接受的（例如杂志、性玩具、暴露癖）。可能会出现其他角色，但不会发生身体或精神上的互动。"],
			"table masturbation": ["桌上自慰", "使用桌子作为自慰工具，用生殖器摩擦桌子。"]
		}],
		"Disability": ["残疾", {
			"amputee": ["截肢者", "一个人失去一个或多个肢体。可以调用血腥标签。"],
			"blind": ["盲人", "眼睛完全不能工作的人。"],
			"handicapped": ["残疾（不能移动）", "自然不能移动自己的一个或多个肢体的人。"],
			"mute": ["哑巴", "不会说话的人。"]
		}],
		"Consumption": ["消耗", {
			"absorption": ["吸收", "吸收某物或某人的行为。可能被丸吞或反向出生调用。"],
			"analphagia": ["肛吞", "通过肛门整个吞下。"],
			"breast feeding": ["母乳喂养", "直接吸吮乳房。不需要任何牛奶可见。"],
			"cannibalism": ["烹饪吃掉", "类人生物被其他类人生物煮熟和/或吃掉（字面意思）。"],
			"cockphagia": ["阴茎吞下", "通过阴茎整个吞下。可能会引起大阴茎和尿道插入。"],
			"coprophagia": ["食粪", "吃粪便。"],
			"gokkun": ["吞精", "饮用或吞咽精液。"],
			"piss drinking": ["饮尿", "喝尿液。"],
			"tailphagia": ["尾吞", "被一条尾巴整个吞下。"],
			"vore": ["丸吞", "通过嘴被整个吞下。"],
			"weight gain": ["体重增加", "通过摄取食物变胖。很可能会调用女胖子或男胖子。"]
		}],
		"Gender": ["性别", {
			"cuntboy": ["男只有阴道", "男性有阴道而没有阴茎。"],
			"feminization": ["伪娘", "男性将他的生活方式改变为变装者的生活方式（例如通过训练或精神控制），或者将他的身体改变为人妖/双胞胎。在任何一种情况下，这个人都必须表现得更加女性化或被视为更加女性化。"],
			"futanari": ["扶她", "参与者既有阴茎又有阴道。"],
			"gender change": ["性转", "角色通过任何方式（例如，性别变形、占有和身体交换）改变其通常的性别。"],
			"gender morph": ["性别变形", "角色的身体通过身体转变从原来的身体改变性别。如果显示为序列而不是突然变化，则可能会调用转换。"],
			"otokofutanari": ["男有阴道和阴茎", "男性同时有阴道和阴茎。"],
			"shemale": ["人妖", "有男性生殖器但没有阴道的女孩。"]
		}],
		"Inter-gender Relations": ["跨性别关系", {
			"bisexual": ["双性恋", "在整个画廊中与同性和异性进行性活动的参与者。"],
			"dickgirl on dickgirl": ["扶她x扶她", "任何有阴茎的女性与另一位有阴茎的女性发生性关系。这包括人妖。"],
			"dickgirl on male": ["扶她x男", "女性阴茎插入男性，无论是肛门还是口腔。"],
			"fft threesome": ["两女一扶她", "三人组包含两名女性和一名变性人（双性人或人妖）。"],
			"male on dickgirl": ["男x扶她", "男性通过肛门、阴道���口腔插入挥舞女性的阴茎。这包括人妖。"],
			"mmt threesome": ["两男一扶她", "三人组，包含两名男性和一名变性人（双性人或人妖）。"],
			"mtf threesome": ["一男一女一变性", "三人组包含一名男性、一名变性人（双性人或人妖）和一名女性。"],
			"ttf threesome": ["两变性一女", "三人组包含两名变性人（双性人或人妖）和一名女性。"],
			"ttm threesome": ["两变性一男", "三人组包含两名变性人（双性人或人妖）和一名男性。"]
		}],
		"Contextual": ["上下文", {
			"blackmail": ["胁迫", "通过威胁或披露信息强迫他人提供性服务的行为。"],
			"coach": ["教练", "体育学科的讲师。"],
			"defloration": ["破瓜", "女性失去童贞的行为。通常包括轻微出血。"],
			"impregnation": ["怀孕或受精", "怀孕的行为。"],
			"oyakodon": ["母娘丼", "一组父母和他们的一个（或多个）孩子同时与同一个伴侣进行性活动。"],
			"prostitution": ["卖淫", "以性为交换金钱的行为。通常涉及以某些挑衅的方式穿着。"],
			"shimaidon": ["姉妹丼", "一群兄弟姐妹同时与同一个伴侣进行性活动。"],
			"teacher": ["老师", "被称为多个学生的教育者的参与者，通常在学校环境中。"],
			"tomboy": ["假小子（男子气概）", "一个穿着、行为和说话都以男孩子气的方式但不隐藏自己的性别的女孩，通常穿着短裤和 T 恤。可能与变装共存，但前提是女孩试图隐瞒自己的性别。"],
			"tomgirl": ["女子气概的男孩", "男性的外表使不经意的观察者很容易将其误认为女性（例如更长的头发、更细/更精致的特征、更圆的眼睛/嘴唇）。可能有害羞、顺从或被动的性格（例如脸红）。经常涉及男女装。"],
			"tutor": ["校外私教", "在校外为学生提供私人学术帮助的人。"],
			"virginity": ["童贞丧失(男)", "一名从事性活动的男性在同一场景中被称为处女。"],
			"vtuber": ["虚拟主播", "主要表现在具有原始虚拟化身的在线视频平台内的参与者。"],
			"widow": ["寡妇", "一个女人，她的另一半（已婚或长期恋爱）已经去世。死者和他们的死亡需要在画廊本身中以口头或视觉方式明确确定。"],
			"widower": ["鳏夫", "男版寡妇。"],
			"yandere": ["病娇", "由痴迷的爱所激发的精神病行为。这包括跟踪或绑架感兴趣的人或恐吓或伤害被认为的竞争对手。如果有任何性活动，疯狂的参与者必须在某个时候直接参与其中。"],
			"yaoi": ["搞基", "至少两名男性之间的性行为。也允许任何具有相同吸引力的男性画廊。"],
			"yuri": ["百合", "至少两名女性之间的性行为。"]
		}],
		"Gallery-Wide": ["画廊范围", {
			"dickgirls only": ["只有扶她", "画廊中的所有性、恋物或亲密互动都仅限于扶她之间。需要至少两个扶她互动。"],
			"females only": ["只有女性", "画廊中的所有性、恋物或亲密互动均仅限于女性之间。需要至少两名女性互动。"],
			"males only": ["只有男性", "画廊中的所有性、恋物或亲密互动均仅限于男性之间。至少需要两个男性互动。"],
			"no penetration": ["没有插入", "不得将任何东西插入阴道、肛门或任何其他身体开口。嘴是唯一的例外。"],
			"nudity only": ["仅限裸露", "整个画廊都没有发生性活动，但存在裸体。"],
			"sole dickgirl": ["唯一扶她", "只有一个扶她或人妖参与整个画廊的所有性或恋物活动。"],
			"sole female": ["唯一女性", "整个画廊中只有一名女性参与任何性或恋物活动（但不一定参与所有活动）。"],
			"sole male": ["唯一男性", "整个画廊中只有一名男性参与任何性或恋物活动（但不一定参与所有活动）。"]
		}],
		"Infidelity": ["不忠", {
			"cheating": ["伴侣之外发生关系", "与伴侣以外的人发生性关系的重要他人。"],
			"netorare": ["NTR", "另一个人的配偶/关系伴侣不忠，而被戴绿帽子的人意识到这种情况。当故事显然是为了代表被戴绿帽子的人引起嫉妒或同情时，也可以接受。"],
			"swinging": ["换妻/夫", "一对夫妇允许一方或双方与第三方发生性关系。"]
		}],
		"Incest": ["乱伦", {
			"aunt": ["姑姑阿姨", "女性与其侄女/侄子之间的任何性行为。"],
			"brother": ["亲兄弟", "男性兄弟姐妹之间的任何性行为。"],
			"cousin": ["堂兄弟", "堂兄弟之间的任何性行为。"],
			"daughter": ["女儿", "父母与其女孩之间的任何性行为。"],
			"father": ["父亲", "男性与其儿子之间的任何性行为。"],
			"granddaughter": ["孙女", "祖父母和孙女之间的任何性行为。"],
			"grandfather": ["爷爷", "男性与其孙子之间的任何性行为。"],
			"grandmother": ["奶奶", "女性和她的孙子之间的任何性行为。"],
			"incest": ["乱伦", "家庭亲属之间的性行为，即使是没有血缘关系的人。"],
			"inseki": ["收养等非血亲乱伦", "涉及姻亲、继父或收养家庭亲属的性行为。"],
			"mother": ["母亲", "女性和她的孩子之间的任何性行为。"],
			"niece": ["侄女", "女性和她的叔叔/阿姨之间的任何性行为。"],
			"sister": ["姐妹", "女性与其兄弟姐妹之间的任何性行为。"],
			"uncle": ["叔叔", "男性与其侄子之间的任何性行为。"]
		}],
		"Low Presence": ["低存在感", {
			"low bestiality": ["少量兽交", ""],
			"low guro": ["少量血腥", ""],
			"low lolicon": ["少量萝莉控", ""],
			"low scat": ["少量排便", ""],
			"low shotacon": ["少量正太控", ""],
			"low smegma": ["少量包皮垢", ""]
		}],
		"High Presence": ["高存在感", {
			"focus anal": ["聚焦肛交", "表示肛交的实例超过了图库内容的 50%。"],
			"focus blowjob": ["聚焦口交", "表示口交实例超过图库内容的 50%。"],
			"focus paizuri": ["聚焦乳交", "表示乳交的实例超过了画廊内容的 50%。"]
		}],
		"Technical": ["技术", {
			"3d": ["3d", "计算机生成的图像。"],
			"anaglyph": ["浮雕", "图像以红色和青色编码以实现 3D 效果。"],
			"animated": ["动画", "多帧图像。"],
			"caption": ["文字在图像外", "文本已添加到最初没有文本的图像中。通常放置在实际图像之外。"],
			"comic": ["漫画", "一部源自西方的色情作品，利用一连串的面板来说明一个故事。通常在文字气球中包含文本。"],
			"figure": ["真实世界玩具或娃娃", "现实生活中的小雕像或娃娃。"],
			"first person perspective": ["第一人称视角", "通过一个角色的眼睛看，正如其他角色直视读者或似乎属于读者的身体部位所表明的那样。"],
			"full color": ["全彩", "所有内容的页面都是彩色的。只要不是故事页面，就允许使用数量非常有限的非彩色插图。"],
			"game sprite": ["游戏精灵", "字符的低位图形。通常是动画。"],
			"how to": ["教学图像", "关于如何绘制或设计的一系列教学图像。"],
			"multipanel sequence": ["多面板序列", "一系列从固定角度描绘性活动的面板。每页至少需要 2 个连续面板。"],
			"multi-work series": ["多作品系列", "一部完整的作品，其故事跨越多卷、书籍或版本。"],
			"non-h imageset": ["无H图集", "绘制不构成漫画或cg集的非色情内容（即松散的图像、截图等）。此类画廊中的图像更倾向于具有单一主题（例如单一艺术家、系列、人物或恋物癖）。"],
			"paperchild": ["人物剪纸", "人物剪纸。经常看起来好像他们正在与现实世界互动。"],
			"redraw": ["重绘", "有人替换了部分原始图像。贬低不符合条件。"],
			"screenshots": ["截图", "从电影、[h-] 动漫或电视节目中截取的屏幕截图。"],
			"sketch lines": ["素描线", "在较详细的绘图的初步创作过程中经常使用粗糙的线条，表示绘图不完整或艺术家未清理。"],
			"stereoscopic": ["立体画法", "可以使用立体镜以 3 维方式查看的平行图像。"],
			"story arc": ["故事章节", "一个故事在一个画廊中产生了多个章节。"],
			"themeless": ["无主题", "一个图像集风格的画廊，没有共同的艺术家、模仿、角色、故事、主题或其他焦点。"],
			"western cg": ["西部cg", "一套来自西方的数字色情片，没有面板。通常是彩色的，手绘较少，背景更详细。必须描述一系列事件或作为一个整体出售/分发。从西方色情游戏中提取的帧也可以接受。"],
			"western non-h": ["西部无H", "本质上不是色情的西方起源绘画（一张带有性别的露骨图片会自动取消画廊的资格）。如果它们本质上是非性的（例如乳头滑落），则允许少量裸露。"],
			"western imageset": ["西方影像集", "不构成漫画或 cg 集的西方来源的绘制内容（即松散的图像、屏幕截图等）。此类画廊中的图像首选具有单一主题（例如单一艺术家、系列、角色或恋物癖）。"],
			"x-ray": ["断面图", "通过皮肤或从内部可以看到内部器官。"]
		}],
		"Censorship": ["审查制度", {
			"full censorship": ["全面审查", "任何形式的审查几乎涵盖了参与者的全部或全部生殖器区域。"],
			"mosaic censorship": ["马赛克审查", "任何形式的马赛克审查，几乎涵盖了参与者的全部或全部生殖器区域。"],
			"uncensored": ["无修正", "无论是出版未经审查还是后来被审查，画廊在任何时候都不会受到审查。"]
		}],
		"Cosplay": ["角色扮演", {
			"hardcore": ["铁杆", "对性行为的明确描述，例如阴道或肛门插入。不计入口交或性玩具的使用。"],
			"non-nude": ["非裸体", "没有显示乳头或性孔的角色扮演画廊。"]
		}],
		"Expunging": ["删除", {
			"already uploaded": ["已上传", ""],
			"forbidden content": ["禁止内容", ""],
			"realporn": ["真人色情", ""],
			"replaced": ["替换", ""]
		}],
		"Semi-Expunging": ["半删除", {
			"compilation": ["选辑", "画廊是不允许一起的作品的汇编。"],
			"incomplete": ["不完整", "作品不完整，特别是缺少核心内容。"],
			"missing cover": ["遗漏封面", "缺少封面。"],
			"out of order": ["乱序", "内容不按顺序排序；通常有一个故事。"],
			"sample": ["样本", "完整作品的免费分发部分。指定可以用更完整的版本替换图库（DNP 除外）。"],
			"scanmark": ["扫描", "由翻译器/扫描仪/着色器明显标记的图像。如有无标记版本，可能会被替换。"],
			"watermarked": ["水印", "由与内容的创建、扫描、着色或翻译无关的网站的水印复制品组成的画廊。"]
		}],
		"Format": ["格式", {
			"anthology": ["选集", "多位作者的完整作品集。具有共同主题的同人志选集使用合作本。"],
			"artbook": ["画册", "出版书籍中给定主题的图形集合，通常强调艺术家的性格或设计元素，而不是性或故事内容。"],
			"goudoushi": ["合作本（多作者同主题）", "一本自行出版的书，汇集了多位艺术家的作品，这些艺术家都专注于一个主题，如角色、特许经营或恋物癖。主要仅在同人志或非H 类别中。"],
			"novel": ["小说", "页面包含没有插图的冗长文本。通常占画廊的很大一部分。"],
			"soushuuhen": ["総集编（同一作者多作品）", "一本自行出版的书，汇集了一位艺术家的多部作品。主要仅在同人志或非H 类别中。"],
			"tankoubon": ["单行本", "由第三方出版的单个艺术家的完整书籍。主要仅在漫画或非H 类别中。"],
			"variant set": ["变体集", "从静态角度仅描绘单一风景的 CG 布景。"],
			"webtoon": ["网络漫画（韩漫风）", "任何以垂直布局格式在线发布的网络漫画，利用空白代替或与镶板一起使用。"]
		}],
		"Language": ["语种", {
			"afrikaans": ["南非荷兰语", ""],
			"albanian": ["阿尔巴尼亚语", ""],
			"arabic": ["阿拉伯语", ""],
			"aramaic": ["阿拉姆语", ""],
			"armenian": ["亚美尼亚语", ""],
			"bengali": ["孟加拉语", ""],
			"bosnian": ["波斯尼亚语", ""],
			"bulgarian": ["保加利亚语", ""],
			"burmese": ["缅甸语", ""],
			"catalan": ["加泰罗尼亚语", ""],
			"cebuano": ["宿务语", ""],
			"chinese": ["汉语", ""],
			"cree": ["克里语", ""],
			"creole": ["克里奥尔语", ""],
			"croatian": ["克罗地亚语", ""],
			"czech": ["捷克语", ""],
			"danish": ["丹麦语", ""],
			"dutch": ["荷兰语", ""],
			"english": ["英语", ""],
			"esperanto": ["世界语", ""],
			"estonian": ["爱沙尼亚语", ""],
			"finnish": ["芬兰语", ""],
			"french": ["德语", ""],
			"georgian": ["法语", ""],
			"german": ["格鲁吉亚语", ""],
			"greek": ["希腊语", ""],
			"gujarati": ["古吉拉特语", ""],
			"hebrew": ["希伯来语", ""],
			"hindi": ["赫蒙语", ""],
			"hmong": ["印地语", ""],
			"hungarian": ["匈牙利语", ""],
			"icelandic": ["冰岛语", ""],
			"indonesian": ["印度尼西亚语", ""],
			"irish": ["爱尔兰语", ""],
			"italian": ["意大利语", ""],
			"japanese": ["日语", ""],
			"javanese": ["爪哇语", ""],
			"kannada": ["卡纳达语", ""],
			"kazakh": ["哈萨克语", ""],
			"khmer": ["高棉语", ""],
			"korean": ["韩语", ""],
			"kurdish": ["库尔德语", ""],
			"ladino": ["拉迪诺语", ""],
			"lao": ["老挝语", ""],
			"latin": ["拉丁语", ""],
			"latvian": ["拉脱维亚语", ""],
			"marathi": ["马拉地语", ""],
			"mongolian": ["蒙古语", ""],
			"ndebele": ["古吉拉特语", ""],
			"nepali": ["尼泊尔语", ""],
			"norwegian": ["挪威语", ""],
			"oromo": ["奥罗莫语", ""],
			"papiamento": ["帕皮阿门托语", ""],
			"pashto": ["普什图语", ""],
			"persian": ["波斯语", ""],
			"polish": ["波兰语", ""],
			"portuguese": ["葡萄牙语", ""],
			"punjabi": ["旁遮普语", ""],
			"romanian": ["罗马尼亚语", ""],
			"russian": ["俄语", ""],
			"sango": ["桑戈语", ""],
			"sanskrit": ["梵语", ""],
			"serbian": ["塞尔维亚语", ""],
			"shona": ["绍纳语", ""],
			"slovak": ["斯洛伐克语", ""],
			"slovenian": ["斯洛文尼亚语", ""],
			"somali": ["索马里语", ""],
			"spanish": ["西班牙语", ""],
			"swahili": ["斯瓦希里语", ""],
			"swedish": ["瑞典语", ""],
			"tagalog": ["他加禄语", ""],
			"tamil": ["泰米尔语", ""],
			"telugu": ["泰卢固语", ""],
			"thai": ["泰语", ""],
			"tibetan": ["藏语", ""],
			"tigrinya": ["提格里尼亚语", ""],
			"turkish": ["土耳其语", ""],
			"ukrainian": ["乌克兰语", ""],
			"urdu": ["乌尔都语", ""],
			"vietnamese": ["越南语", ""],
			"welsh": ["威尔士语", ""],
			"yiddish": ["意第绪语", ""],
			"zulu": ["祖鲁语", ""]
		}],
		"Meta-Language": ["语言", {
			"rewrite": ["改写文本", "个人填写了自己的文本来代替原始文本或没有的地方。"],
			"rough grammar": ["粗略语法（部分语法拼写错误）", "任何第三方翻译，包含所需数量的带有语法或拼写错误的句子。要求定义为： 总翻译页数的 25%（四舍五入到最接近的整数）或 10，以较高者为准。"],
			"rough translation": ["粗略翻译（部分翻译错误）", "任何第三方翻译，由所需数量的文本框/气泡组成，并带有翻译错误。要求定义为： 总翻译页数的 25%（四舍五入到最接近的整数）或 10，以较高者为准。翻译错误包括缺少上下文、缺少作者意图、省略故事/情况相关文本或不正确的含义。"],
			"speechless": ["不含任何文本", "画廊中没有任何文字被用作交流或叙述的手段。将画廊的语言指定为“N/A”。"],
			"text cleaned": ["文本清理", "删除了附带文字的漫画或 CG 集。"],
			"translated": ["已翻译", "由第三方对原始语言进行的任何翻译。"]
		}]
	};
});

const parentData = ["Age", "Body", "change", "Creature", "Animal", "Height", "Skin", "Weight",
	"Head", "Hair", "Mind", "Eyes", "Nose", "Mouth", "Neck", "Arms", "Hands", "Breasts", "Nipples",
	"Torso", "Crotch", "Penile", "Vaginal", "Buttocks", "Either Hole", "Legs", "Feet", "Costume",
	"Multiple Activities", "Multiple Holes", "Tools", "Fluids", "Bodily Fluids", "Semen", "Waste",
	"Force", "Sadomasochism", "Bondage", "Violence", "Privacy", "Self Pleasure", "Disability",
	"Consumption", "Gender", "Inter-gender Relations", "Contextual", "Gallery-Wide", "Infidelity",
	"Incest", "Low Presence", "High Presence", "Technical", "Censorship", "Cosplay", "Expunging",
	"Semi-Expunging", "Format", "Language", "Meta-Language"];

const subData = {
	"age progression": ["年龄增长", "一个人迅速变老。"],
	"age regression": ["年龄回归", "一名参与者迅速变年轻。瞬时更改不符合条件。"],
	"dilf": ["熟男", "任何年龄在 30-50 岁之间的老年人。不需要当父亲"],
	"infantilism": ["幼稚", "涉及将非儿童伴侣视为婴儿的性活动。可能包括尿布"],
	"lolicon": ["萝莉控", "处于性关系或裸体的未成年女孩。不要与一般的年轻女孩混淆；应该有不发达的身体。"],
	"milf": ["熟女", "任何年龄在 30-50 岁之间的老年妇女。不需要当妈妈。"],
	"old lady": ["老太太", "明显年老的女性，通常有面部皱纹。如果要估计他们的年龄，至少应该是 50 岁。"],
	"old man": ["老人", "一个明显老年的男性，通常有面部皱纹。如果要估计他们的年龄，至少应该是 50 岁。"],
	"shotacon": ["正太控", "处于性行为或裸体的未成年男孩。不要与一般的年轻人混淆；应该有不发达的身体。"],
	"toddlercon": ["蹒跚学步", "处于性行为或裸体的婴儿。"],
	"adventitious penis": ["不定阴茎", "至少有一个阴茎在身体上意想不到的地方（例如手、嘴、尾巴）。"],
	"adventitious vagina": ["不定阴道", "在身体意想不到的地方（例如手、嘴、上身）有阴道。"],
	"amputee": ["截肢者", "一个人失去一个或多个肢体。可以调用血腥标签。"],
	"big muscles": ["大肌肉", "明显的大肌肉。肌肉发达的手臂必须与头部一样宽，或者肌肉发达的大腿与头部一样宽 1.5 倍。"],
	"body modification": ["身体改造", "以某种人工方式改变身体部位，例如非有机增强、身体部位添加或移除以及不寻常的身体部位放置。"],
	"conjoined": ["连体", "两个或多个头共享同一个身体。"],
	"doll joints": ["娃娃关节", "具有明显的圆形或凹形关节。"],
	"gijinka": ["非人类", "一个具有人类/完全拟人化形式的角色，但规范上没有。也可以作为非人形角色进行角色扮演。"],
	"invisible": ["隐形", "一个看不见的参与者。"],
	"multiple arms": ["多臂", "一个人身上有两条以上的手臂。"],
	"multiple breasts": ["多乳房", "单个角色上的任何超过 2 个乳房。"],
	"multiple nipples": ["多乳头", "每个乳房有超过 1 个的任意数量的乳头。包括乳房。"],
	"multiple penises": ["多阴茎", "拥有不止一个阴茎。不适用于触手式阴茎。"],
	"multiple vaginas": ["多阴道", "拥有多个阴道。"],
	"muscle": ["肌肉", "一个明显肌肉发达的参与者。"],
	"muscle growth": ["肌肉生长", "肌肉出现在以前没有的地方或现有的肌肉变大。"],
	"pregnant": ["怀孕", "涉及明显怀孕的参与者的性活动或裸体。"],
	"shapening": ["塑形", "参与者将其压扁、融化或以其他方式变成几何形状，例如球体或立方体。"],
	"stretching": ["伸展", "超出正常人所能做的伸展（例如四肢）。"],
	"tailjob": ["尾交", "用尾巴刺激生殖器区域。"],
	"wingjob": ["翼交", "使用翅膀刺激生殖器区域。"],
	"wings": ["翅膀", "人形生物上任何突出的翅膀。"],
	"absorption": ["吸收", "吸收某物或某人的行为。可能被丸吞或反向出生调用。"],
	"ass expansion": ["屁股扩张", "臀部因任何原因而增长。很可能招惹大屁股。"],
	"balls expansion": ["睾丸扩张", "睾丸变大。可能导致大球。"],
	"body swap": ["身体交换", "与另一个参与者交换身体。"],
	"breast expansion": ["乳房扩张", "乳房大小的任何显着增加。很可能会引起大乳房，也可能是巨大的乳房。"],
	"breast reduction": ["乳房缩小", "乳房大小的任何显着减少。可唤起小乳房。"],
	"clit growth": ["阴蒂生长", "阴蒂的生长，通常会导致一个大阴蒂。"],
	"corruption": ["腐败", "用魔法或其他超自然力量强行腐蚀参与者的思想，剥夺他们的纯洁。"],
	"dick growth": ["鸡巴生长", "阴茎异常生长。可能会导致阴茎变大。"],
	"feminization": ["女性化", "男性将他的生活方式改变为变装者的生活方式（例如通过训练或精神控制），或者将他的身体改变为人妖/双胞胎。在任何一种情况下，这个人都必须表现得更加女性化或被视为更加女性化。"],
	"gender change": ["性别变化", "角色通过任何方式（例如，性别变形、占有和身体交换）改变其通常的性别。"],
	"gender morph": ["性别变形", "角色的身体通过身体转变从原来的身体改变性别。如果显示为序列而不是突然变化，则可能会调用转换。"],
	"growth": ["成长", "长高了。可能导致女巨人或巨人。"],
	"moral degeneration": ["道德退化", "消除一个人对性的道德立场。必须在不使用强力物质或超自然影响的情况下完成。可能会引发精神崩溃。"],
	"nipple expansion": ["乳头扩张", "乳头明显增大。可能导致乳头变大。"],
	"personality excretion": ["个性排泄", "参与者将他们的灵魂转移到一个物品中（例如果冻、人造阴道 或精液），然后排出体外，使他们的身体变成一个空壳。"],
	"petrification": ["石化", "成为雕像/岩石般的形态。"],
	"shrinking": ["萎缩", "参与者变小。可能会导致迷你女孩或迷你男孩。不需要转型。"],
	"transformation": ["转化", "显示某种物理、生物学变化的序列。"],
	"weight gain": ["体重增加", "过摄取食物变胖。很可能会调用女胖子或男胖子。"],
	"alien": ["外星人", "任何具有强烈特征的男性，旨在唤起非地球起源的存在。通常为人形，缺乏任何真实或神话生物的特征（例如眼柄、无虹膜、球状头部、触手身体部位）。"],
	"alien girl": ["外星女孩", "任何具有强烈特征的女性，旨在唤起非地球起源的存在。通常为人形，缺乏任何真实或神话生物的特征（例如眼柄、无虹膜、球状头部、触手身体部位）。"],
	"angel": ["天使", "有大的，典型的白色翅膀。通常也具有光环。"],
	"bat boy": ["蝙蝠男孩", "男版蝙蝠女。"],
	"bat girl": ["蝙蝠女孩", "一种女性类人生物，有翅膀、耳朵，有时还有尾巴或蝙蝠的其他显着特征。"],
	"bear boy": ["熊男孩", "男版熊女。"],
	"bear girl": ["熊女孩", "一个有着圆耳朵的雌性，可能还有熊的其他特征。男版见熊男孩。"],
	"bee boy": ["蜜蜂男孩", "男版蜂女。"],
	"bee girl": ["蜜蜂女孩", "具有蜜蜂特征的雌性。"],
	"bunny boy": ["兔子男孩", "男版兔女郎。"],
	"bunny girl": ["兔子女孩", "兔耳朵，偶尔也有蓬松的尾巴。"],
	"catboy": ["猫男孩", "男版猫娘。"],
	"catgirl": ["猫女孩", "有耳朵，通常有尾巴或猫的其他特征。"],
	"centaur": ["人马", "半马半人。"],
	"cowgirl": ["牛女孩", "有牛耳朵、牛角，可能还有尾巴和牛铃。可能有荷斯坦图案（白色带黑色斑点）。常与大胸搭配。"],
	"cowman": ["牛男", "男版女牛仔。"],
	"deer boy": ["鹿男孩", "男版鹿女。"],
	"deer girl": ["鹿女孩", "具有鹿或驯鹿的尾巴和角的雌性。男性版本见鹿男孩。"],
	"demon": ["恶魔", "具有强烈恶魔外观（翅膀、角、尖尾巴、皮肤图案/标记等）的男性人形生物，偶尔也有异常的皮肤颜色和眼睛。"],
	"demon girl": ["恶魔女孩", "具有强烈恶魔外观（翅膀、角、尖尾巴、皮肤图案/标记等）的女性人形生物，偶尔也会有异常的皮肤颜色和眼睛。"],
	"dog boy": ["狗男孩", "男版狗女。"],
	"dog girl": ["狗女孩", "一个有狗的尾巴和耳朵的女性。"],
	"draenei": ["魔兽蓝色恶魔", "来自魔兽世界的恶魔类人形生物。蓝色的皮肤，有蹄子和发光的眼睛。"],
	"fairy": ["仙女", "一种小型类人生物，其翅膀通常类似于昆虫或蝴蝶的翅膀。"],
	"fox boy": ["狐狸男孩", "男版狐女。"],
	"fox girl": ["狐狸女孩", "一个长着狐狸耳朵和尾巴的女孩，通常很浓密，有黑色的尖端。男版见狐童。"],
	"frog boy": ["青蛙男孩", "男版蛙女。"],
	"frog girl": ["青蛙女孩", "一个女性，身体矮矮，皮肤光滑，爬虫类的附肢长。可能有长舌头。"],
	"furry": ["福瑞", "具有某些人类个性或特征的拟人化动物角色。"],
	"giraffe boy": ["长颈鹿男孩", "男版长颈鹿少女。"],
	"giraffe girl": ["长颈鹿女孩", "长颈鹿耳朵和尾巴的女孩，衣服或皮毛上通常有黄色和棕色斑点。可能有一个长脖子。"],
	"ghost": ["幽灵", "与非物质的存在发生性关系。"],
	"goblin": ["哥布林", "幻想生物，通常约为正常人身高的 1/2 至 3/4。通常有宽鼻子、尖耳朵、宽嘴和小而锋利的獠牙。"],
	"harpy": ["哈比", "一种鸟人和人类的混血儿，经常有融合的翅膀作为手臂。"],
	"horse boy": ["马男孩", "男版马女。"],
	"horse girl": ["马女孩", "有马的尾巴和其他特征。"],
	"human on furry": ["人类x福瑞", "人形生物和拟人生物之间的性活动。"],
	"insect boy": ["昆虫男孩", "男版虫女"],
	"insect girl": ["昆虫女孩", "有触角，通常有壳或甲壳躯干。"],
	"kemonomimi": ["兽耳", "具有动物耳朵和尾巴但几乎没有其他动物部位的类人生物。"],
	"kappa": ["河童", "乌龟与人类的混血儿。"],
	"lizard girl": ["蜥蜴少女", "一个长着爬行动物鳞片和尾巴的女孩。"],
	"lizard guy": ["蜥蜴人", "男版蜥蜴女。"],
	"mermaid": ["美人鱼", "一种鱼人混合体，鱼的部分位于身体的下半部分。男性版本见人鱼。"],
	"merman": ["人鱼", "男性美人鱼。"],
	"minotaur": ["牛头怪", "任何公牛与人类的混合体。可能会召唤毛茸茸或在极少数情况下是怪物。"],
	"monkey boy": ["猴子男孩", "男版猴女。"],
	"monkey girl": ["猴子女孩", "有耳朵，通常有尾巴或猴子的其他特征。"],
	"monoeye": ["单眼", "一个独眼的类人生物。因任何原因（变形除外）失去一只眼睛的双眼角色不符合资格。"],
	"monster": ["怪物", "任何不是人类、外星人、天使、机器人、恶魔、动物、吸血鬼、仙女、精灵或毛茸茸的东西。"],
	"monster girl": ["怪物女孩", "任何不是人类、外星人、天使、机器人、恶魔、动物、吸血鬼、仙女、精灵或毛茸茸的东西。"],
	"mouse boy": ["老鼠男孩", "男版老鼠娘。"],
	"mouse girl": ["老鼠女孩", "定义特征是大而圆的老鼠耳朵和长长的啮齿动物般的尾巴。通常非常喜欢奶酪。"],
	"necrophilia": ["恋尸癖", "涉及尸体的性行为。"],
	"oni": ["鬼", "一个头上有1-2个角和可能尖耳朵的类人生物。没有翅膀或尾巴。"],
	"orc": ["兽人", "与人类一样高或略高的幻想生物。通常有倾斜的前额、突出的下巴、突出的牙齿和粗大的体毛。"],
	"otter boy": ["水獭男孩", "男版水獭女。"],
	"otter girl": ["水獭女孩", "雌性长着长矛状的长尾巴、圆耳朵和水獭的其他特征。口吻、颈部和躯干通常颜色较浅。"],
	"panda boy": ["熊猫男孩", "男版熊猫女。"],
	"panda girl": ["熊猫女孩", "耳朵圆圆，眼睛周围和身体其他部位有黑色斑块。"],
	"pig girl": ["猪女孩", "有耳朵，通常还有鼻子、卷曲的尾巴或猪的其他特征。"],
	"pig man": ["猪人", "有耳朵，通常还有鼻子、卷曲的尾巴或猪的其他特征。"],
	"plant boy": ["植物男孩", "男版植物少女。"],
	"plant girl": ["植物女孩", "一种雌性植物-人类杂交种。"],
	"raccoon boy": ["浣熊男孩", "男版浣熊女。"],
	"raccoon girl": ["浣熊女孩", "有耳朵，通常有尾巴或浣熊的其他特征。"],
	"robot": ["机器人", "一个机械人形机器人（例如：cyborg、android、fembot）。通常具有可见的金属身体部位或肢体关节。"],
	"shark boy": ["鲨鱼男孩", "雄性以尾鳍作为尾巴而不是身体的下半部分。通常也有锋利的牙齿。"],
	"shark girl": ["鲨鱼女孩", "一种以尾鳍为尾巴而不是下半身的雌性。通常也有锋利的牙齿。男性版本见鲨鱼男孩。"],
	"sheep boy": ["绵羊男孩", "男版羊女。"],
	"sheep girl": ["绵羊女孩", "一个有羊毛和可能是羊角的女性。"],
	"slime": ["史莱姆", "任何与性有关的粘稠/凝胶状物质。基于粘液的生物需要这个和怪物标签。"],
	"slime boy": ["史莱姆男孩", "一个男孩，他的身体完全是用粘液制成的。"],
	"slime girl": ["史莱姆女孩", "一个身体主要由粘液制成的女孩。"],
	"snake boy": ["蛇男孩", "男版蛇女。"],
	"snake girl": ["蛇女孩", "蛇-雌性混合体的任何变体。"],
	"spider boy": ["蜘蛛男孩", "男版蜘蛛女。"],
	"spider girl": ["蜘蛛女孩", "身体是蜘蛛的少女。"],
	"squid boy": ["鱿鱼男孩", "男版鱿鱼娘。"],
	"squid girl": ["鱿鱼女孩", "有许多小触手，可能是鱿鱼或章鱼的尖头。"],
	"squirrel boy": ["松鼠男孩", "男版松鼠少女。"],
	"squirrel girl": ["松鼠少女", "有松鼠的尾巴和其他特征。"],
	"skunk boy": ["臭鼬少年", "男版臭鼬少女。"],
	"skunk girl": ["臭鼬少女", "雌性，具有臭鼬的尾巴和其他显着特征。"],
	"tentacles": ["触手", "用于性目的的长而柔韧的卷须。"],
	"vampire": ["吸血鬼", "有尖牙，喝血。必须使用吸血鬼能力或露出尖牙来展示。"],
	"wolf boy": ["狼少年", "男版狼女。"],
	"wolf girl": ["狼少女", "有尖耳朵，通常有浓密的尾巴或狼的其他特征。"],
	"yukkuri": ["尤库里", "圆形斑点状生物，其面孔基于东方 Project中的角色。经常参与血腥或酷刑。"],
	"zombie": ["僵尸", "一种肉质的不死生物。"],
	"animal on animal": ["动物x动物", ""],
	"animal on furry": ["动物x福瑞", ""],
	"bear": ["熊", ""],
	"bestiality": ["兽交", "与动物或昆虫发生性关系的人。"],
	"bull": ["公牛", ""],
	"camel": ["骆驼", ""],
	"cat": ["猫", ""],
	"cow": ["牛", ""],
	"crab": ["螃蟹", ""],
	"deer": ["鹿", ""],
	"dinosaur": ["恐龙", ""],
	"dog": ["狗", ""],
	"dolphin": ["海豚", ""],
	"donkey": ["驴", ""],
	"dragon": ["龙", ""],
	"eel": ["鳗鱼", ""],
	"elephant": ["大象", ""],
	"fish": ["鱼", ""],
	"fox": ["狐狸", ""],
	"frog": ["青蛙", ""],
	"goat": ["山羊", ""],
	"gorilla": ["大猩猩", ""],
	"horse": ["马", ""],
	"insect": ["昆虫", ""],
	"kangaroo": ["袋鼠", ""],
	"lion": ["狮子", ""],
	"lioness": ["母狮", ""],
	"maggot": ["蛆", ""],
	"monkey": ["猴子", ""],
	"mouse": ["老鼠", ""],
	"octopus": ["章鱼", ""],
	"ostrich": ["鸵鸟", ""],
	"panther": ["豹", ""],
	"pig": ["猪", ""],
	"rabbit": ["兔子", ""],
	"reptile": ["爬行动物", ""],
	"rhinoceros": ["犀牛", ""],
	"sheep": ["羊", ""],
	"shark": ["鲨鱼", ""],
	"slug": ["蛞蝓", "任何类型的腹足类软体动物，即使是那些有壳的。"],
	"snake": ["蛇", ""],
	"spider": ["蜘蛛", ""],
	"tiger": ["老虎", ""],
	"turtle": ["乌龟", ""],
	"unicorn": ["独角兽", ""],
	"whale": ["鲸鱼", ""],
	"wolf": ["狼", ""],
	"worm": ["蠕虫", ""],
	"zebra": ["斑马", ""],
	"giant": ["巨人", "男版女巨人。使用环境线索来确定角色是大还是小。"],
	"giantess": ["女巨人", "高高在上的女性参与者。她应该能够一只手握住一个正常大小的人。使用环境线索来确定角色是大还是小。"],
	"midget": ["侏儒", "一个很矮的人。看起来应该等于或小于伴侣的腰高。如果不存在伴侣，请使用环境提示。"],
	"minigirl": ["迷你女孩", "一只手掌大小的女性。使用环境提示来确定角色是小还是大。"],
	"miniguy": ["迷你男孩", "男版迷你女孩。使用环境提示来确定角色是小还是大。"],
	"tall girl": ["高个女孩", "一个明显高大的女人。应该看起来至少比她的伴侣高一个头。如果没有伴侣，或者伴侣是正太控、萝莉控、迷你女孩/男孩或侏儒，请使用环境线索。"],
	"tall man": ["高个子", "一个明显高大的男人。应该看起来至少比他的搭档高一个头。如果没有伴侣，或者伴侣是正太控、萝莉控、迷你女孩/男孩或侏儒，请使用环境线索。"],
	"albino": ["白化病", "红眼睛与非常浅的皮肤相结合。"],
	"body writing": ["身体写字", "在人的身体上制作的各种文字或图画，通常包括贬义词，例如“荡妇”或“精液垃圾箱”。"],
	"body painting": ["人体彩绘", "油漆不仅仅在脸上或身体的一小块区域上。"],
	"crotch tattoo": ["胯部纹身", "下腹部和胯部之间区域的任何明显图案/标志。"],
	"dark skin": ["深色皮肤", "棕色或黑色肤色。"],
	"freckles": ["雀斑", "皮肤表面有许多相互靠近的小色素沉着点。通常出现在脸上，但也可以出现在身体的任何部位。"],
	"gyaru": ["日式辣妹", "各种时装过去尽可能地显得不像日本人，包括人造棕褐色、漂白头发、装饰指甲、浓妆、假睫毛等。"],
	"gyaru-oh": ["日式辣男", "各种时装过去尽可能地显得非日本化，包括人造棕褐色、漂白的头发、浓妆、坚韧的衣服等。"],
	"large tattoo": ["大纹身", "皮肤上的永久性标记/图案，通常用墨水完成。必须足够突出以覆盖至少半个肢体/脸。对于累积满足相同最小值的许多小型设备也可以接受。"],
	"oil": ["油", "参与者至少部分覆盖有润滑剂，如身体油，以赋予其皮肤光滑的质地/光滑的外观。"],
	"scar": ["疤痕", "皮肤上的痕迹或烧伤。必须非常突出。"],
	"skinsuit": ["紧身衣", "穿着另一个人的皮肤，有效地成为佩戴者的皮肤。"],
	"sweating": ["出汗", "参与者身上有大量汗水滴落。"],
	"tanlines": ["晒痕", "较浅的线条，通常来自晒黑后的衣服。"],
	"anorexic": ["厌食症", "体重过轻以至于一个人的皮肤凹陷或他们的骨骼结构的任何部分都与他们的皮肤相适应。"],
	"bbm": ["胖子", "胖子。中腹部必须有褶皱。"],
	"bbw": ["女胖子", "胖女人。中腹部必须有褶皱。"],
	"ssbbm": ["男大胖子", "由于体脂而比身高更宽的男性。"],
	"ssbbw": ["女大胖子", "由于体脂而比身高更宽的女性。"],
	"ahegao": ["阿嘿颜", "表示愉悦的夸张面部表情，通常包括卷起的眼睛、张开的嘴巴和伸出的舌头。常发生在性高潮期间。"],
	"beauty mark": ["美人痣", "一种深色的面部痣，通常靠近眼睛。不包括装饰性面部附加物，例如面带、穿孔、纹身或印章。"],
	"brain fuck": ["脑交", "涉及大脑的性行为。"],
	"cockslapping": ["脸交", "用阴茎敲打一个人（通常是在脸上）。"],
	"crown": ["皇冠", "用于头顶的圆形礼仪头饰。多为君主佩戴。"],
	"ear fuck": ["耳交", "涉及穿透耳朵的性行为。"],
	"elf": ["精灵", "有长而尖的耳朵和典型的细长身体。"],
	"facesitting": ["颜面骑乘", "坐在另一位参与者的脸上或上方。可能用于部分窒息它们或用于与肛门/生殖器区域的口腔接触。有时与调教或性虐待配对。"],
	"facial hair": ["胡子", "下巴、脸颊或上唇有明显的毛发。"],
	"gasmask": ["防毒面具", "一种覆盖面部并包括呼吸管或过滤器的塑料面罩。"],
	"headless": ["无头", "任何在预期中缺少头部的生物。"],
	"hood": ["兜帽", "带有开口的头饰，通常附在外套或衬衫上。"],
	"horns": ["角", "人形生物头部的一个或多个角。"],
	"makeup": ["化妆", "涂在嘴唇、脸颊、睫毛或其他面部区域以突出它们的可见颜色。"],
	"masked face": ["蒙面", "完全覆盖参与者面部的不透明面具，通常用于隐藏他们的身份。这包括典型的巴拉克拉法帽式面具。"],
	"thick eyebrows": ["浓眉", "眉毛至少和主人的手指一样粗。"],
	"tiara": ["头饰", "半圆形礼仪头带，款式可能不同，但靠近前额放置。经常被君主和魔法少女佩戴。"],
	"afro": ["黑人头型", "蓬松或浓密的毛发，主要向上呈球状、苔藓状或云状，并围绕主人的头部。"],
	"bald": ["秃头", "头皮上很少或没有头发的头部。"],
	"drill hair": ["钻头发型", "大卷曲/盘绕的头发看起来类似于垂直缠绕或锥形钻头。"],
	"eye-covering bang": ["遮眼刘海", "从头皮前发际线垂下的头发始终覆盖至少一只眼睛。头发上的小裂缝是可以接受的。只要眼睛被遮盖，透视眼也可以接受。"],
	"hair_buns": ["发髻", "将大量头发聚集并固定成一个或多个圆形束。"],
	"hairjob": ["头发交", "使用生殖器上的毛发来创造性快感。"],
	"pixie cut": ["小精灵剪裁", "短发发型，一般顶部梳向脸部，两侧剪短，不低于耳朵，而背部可能会达到颈部。"],
	"ponytail": ["马尾辫", "将大量头发收集并固定在头部后部或侧面的一束尾状中，然后自由悬挂。"],
	"prehensile hair": ["卷发", "参与者有能力控制他或她的头发，就像它是一个肢体一样。"],
	"shaved head": ["剃光头", "只有头发茬的头。"],
	"twintails": ["双马尾", "将大量头发聚集并固定在头部相对两侧的两个尾巴状的束中，然后自由悬挂。"],
	"very long hair": ["很长的头发", "参与者的大部分头发足够长到肚脐以下或附近。由于被捆绑而无法达到该长度的头发不符合条件。"],
	"chloroform": ["失去知觉", "任何用于在没有物理力量的情况下使某人失去知觉的物质。可能导致强奸和睡觉。"],
	"drugs": ["药物", "任何用于鼓励滥交或享乐的化学物质。"],
	"drunk": ["醉酒", "一名参与者在性交之前或期间饮酒。应该明显改变他们的情绪和/或行为。通常会导致脸颊发红、眼睛朦胧或迷醉，以及对性的态度更加放松。"],
	"emotionless sex": ["没有感情的性爱", "没有表现出来自性活动的情绪。"],
	"mind break": ["精神失常", "训练/将某人精神上变成性奴隶，通常是通过长时间或严格的性刺激。"],
	"mind control": ["精神控制", "强迫参与者自己做某事，但违背自己的意愿。"],
	"parasite": ["寄生虫", "一种感染宿主的小有机体，通常会引起性刺激。在某些情况下可能被视为拥有。"],
	"possession": ["占有", "参与者的身体被外部思想接管，实际上被剥夺了自己的意志。"],
	"shared senses": ["共享感官", "某人与某物或其他人分享他们的感官的情况。"],
	"sleeping": ["睡觉", "与不清醒的人发生性关系。视情况而定，可能算作强奸。"],
	"yandere": ["病娇", "由痴迷的爱所激发的精神病行为。这包括跟踪或绑架感兴趣的人或恐吓或伤害被认为的竞争对手。如果有任何性活动，疯狂的参与者必须在某个时候直接参与其中。"],
	"blind": ["盲人", "眼睛完全不能工作的人。"],
	"blindfold": ["眼罩（失去视力）", "一种旨在使人失去视力的眼罩。"],
	"closed eyes": ["闭眼", "一个闭着眼睛或假装睡着的角色。"],
	"cum in eye": ["眼睛里的精液", "射入人的眼睛。"],
	"dark sclera": ["深色眼白", "一个人的眼白是深色的。"],
	"eye penetration": ["眼睛穿透", "眼睛或眼窝中的性行为。"],
	"eyemask": ["眼罩", "眼睛周围区域的覆盖物，仍然使脸部的其余部分暴露在外。"],
	"eyepatch": ["遮住眼睛", "一块布或其他材料覆盖一只眼睛。"],
	"glasses": ["眼镜", "任何带框的透明眼镜戴在双眼前面以改善视力。"],
	"heterochromia": ["异色症", "参与者的虹膜颜色不同。"],
	"sunglasses": ["太阳镜", "任何用于在阳光下改善视力的带框、不透明眼镜。"],
	"unusual pupils": ["爱心眼", "学生是或包含奇怪的形状，如心形或星星。"],
	"nose fuck": ["鼻交", "涉及鼻孔的性行为。"],
	"nose hook": ["鼻钩", "一个钩子用来把鼻孔向上拉开。"],
	"smell": ["气味", "发出强烈的、耸人听闻的气味的行为。"],
	"adventitious mouth": ["嘴巴位置不固定", "至少有一张嘴在身体意想不到的地方（例如手、躯干、尾巴）。"],
	"autofellatio": ["自我口交", "对自己进行口交。"],
	"ball sucking": ["吸睾丸", "用嘴在睾丸上取乐。"],
	"big lips": ["大嘴唇", "嘴巴异常大的嘴唇。嘴唇的高度必须超过人眼的高度才有资格。"],
	"blowjob": ["口交", "涉及口腔和阴茎的性行为。"],
	"blowjob face": ["口交脸", "在口交过程中，在阴茎或物体上以管状方式拉长嘴唇和嘴巴区域。"],
	"braces": ["牙套", "用于对齐和拉直牙齿的装置。"],
	"burping": ["打嗝", "可见的打嗝。"],
	"coprophagia": ["食粪", "吃粪便。"],
	"cunnilingus": ["舔阴", "口服刺激阴道引起性唤起。"],
	"deepthroat": ["深喉", "阴茎进入喉咙的口交。"],
	"double blowjob": ["双根单口交", "两个阴茎插入同一个嘴里。"],
	"foot licking": ["舔脚", "用舌头在脚上引起唤醒。"],
	"gag": ["堵嘴", "任何绑在某人嘴上的东西，部分或完全塞住它。几乎总是涉及束缚。"],
	"gokkun": ["吞精", "饮用或吞咽精液。"],
	"kissing": ["接吻", "两个人将嘴唇压在一起的行为，也可能将他们的舌头伸入对方的嘴里或吮吸对方的嘴巴。"],
	"long tongue": ["长舌头", "参与者的舌头，其长度至少应该能够从嘴巴延伸到参与者的眉毛。"],
	"multimouth blowjob": ["单根多口交", "涉及阴茎和两个或更多嘴巴的性行为。"],
	"piss drinking": ["饮尿", "喝尿液。"],
	"rimjob": ["毒龙", "口服刺激肛门引起性唤起。"],
	"saliva": ["唾液", "将大量口腔分泌物用于性目的。舔或吐不质量。"],
	"smoking": ["吸烟", "一种物质，通常是烟草，在性交过程中被燃烧并品尝或吸入烟雾。"],
	"tooth brushing": ["刷牙", "刷牙以引起性唤起。"],
	"unusual teeth": ["不寻常的牙齿", "牙齿非常锋利、凹陷、张开或缺失。"],
	"vomit": ["呕吐物", "胃内容物通过嘴或鼻子反流。"],
	"vore": ["丸吞", "通过嘴被整个吞下。"],
	"asphyxiation": ["窒息", "故意限制大脑供氧，通常是为了性唤起。"],
	"collar": ["项圈", "用悬吊的绞索或绕在脖子上的结扎线勒死脖子。人本身不必悬挂在地面上。可能会调用杀戮。"],
	"hanging": ["绞刑", "用悬吊的绞索或绕在脖子上的结扎线勒死脖子。人本身不必悬挂在地面上。可能会调用杀戮。"],
	"leash": ["皮带", "通常系在衣领上或缠绕在脖子上的带子、绳索或链条。经常参与性虐待或宠物游戏活动。"],
	"armpit licking": ["舔腋窝", "舔参与者腋窝的行为。只舔手臂是不可接受的。"],
	"armpit sex": ["腋窝性爱", "使用腋窝区域刺激阴茎。"],
	"hairy armpits": ["多毛腋窝", "参与者的腋下区域毛发过多。必须足够至少是一团毛发。"],
	"fingering": ["指交", "用手指创造性快感。"],
	"fisting": ["拳交", "将拳头插入阴道或肛门。"],
	"gloves": ["手套", "衣服覆盖手掌，通​​常是手指。可以将手臂向上延伸至肩部。"],
	"handjob": ["打手枪", "手淫另一个参与者的阴茎。"],
	"multiple handjob": ["单根多人打手枪", "多人同时手淫另一名参与者的阴茎。"],
	"autopaizuri": ["自我乳交", "对自己进行乳交。"],
	"big areolae": ["大乳晕", "乳头周围有明显的大面积。应至少为乳房表面积的 1/3 才符合条件。"],
	"big breasts": ["大乳", "通常是大乳房。每个乳房应该至少和人的头部一样大。对于Cosplay，这需要D罩杯或更大。"],
	"breast feeding": ["喂奶", "直接吸吮乳房。不需要任何牛奶可见。"],
	"clothed paizuri": ["穿衣服乳交", "当衣服覆盖了大部分乳房时，进行乳交的动作。必须完全覆盖乳头和乳晕。"],
	"gigantic breasts": ["超巨大乳房", "不可能的大乳房。必须等于或大于人身体其他部分的大小。"],
	"huge breasts": ["巨乳", "异常大的乳房。必须至少是主人头部大小的两倍。"],
	"lactation": ["哺乳期", "乳房喷出液体（通常是牛奶）。"],
	"milking": ["挤奶", "用手或机器拉动乳房排出乳汁。不是为了任何阴茎拉动。"],
	"multiple paizuri": ["多个乳交", "超过一对乳房用于乳交，无论数量多少。"],
	"oppai loli": ["萝莉巨乳", "小女孩却有着巨乳。"],
	"paizuri": ["乳交", "将阴茎（或类似物体）插入乳房之间的行为。"],
	"small breasts": ["小乳房", "必须足够小才能合理地称女孩为“扁平”。"],
	"big nipples": ["大乳头", "长到可以用一只手抓住的大乳头。"],
	"dark nipples": ["深色乳头", "颜色较深的乳头，有时与怀孕有关。"],
	"dicknipples": ["鸡巴乳头", "出现或表现得像阴茎的乳头。"],
	"inverted nipples": ["乳头内陷", "缩回乳房内的乳头。通常通过刺激或拉动而被带出。"],
	"nipple birth": ["乳头出生", "通过乳头出生的生物的行为。"],
	"nipple fuck": ["乳头交", "阴茎物体刺入乳头或乳房。"],
	"cumflation": ["肚子充满精液肿胀", "胃部由于充满精液而像气球一样向外扩张。"],
	"inflation": ["肚子膨胀", "胃部区域像气球一样向外扩张。通常是由于充满了气体、触手、卵、液体，或者来自食肉或未出生的行为。"],
	"navel fuck": ["肚脐交", "穿透肚脐。"],
	"stomach deformation": ["胃变形", "一个固体物体从内部推向胃并产生可见的突起。通常由大插入或大阴茎引起。"],
	"bike shorts": ["自行车短裤", "短款、有弹性、紧身裤（但更多地作为内衣穿着），旨在提高骑车时的舒适度。"],
	"bloomers": ["灯笼裤", "主要为日本女学生设计的健身服。通常为蓝色或红色。"],
	"chastity belt": ["贞操带", "用于防止性交或手淫的锁定衣物。有时与性虐待配对。"],
	"diaper": ["尿布", "一种用于谨慎排便或小便的内衣；经常被婴儿佩戴。通常与年龄退化、粪便、幼稚或排尿配对。"],
	"fundoshi": ["传统日式内衣", "一种传统的日本内衣，由一段棉制成。"],
	"gymshorts": ["运动短裤", "短款运动裤，颜色和长度可能会有所不同。"],
	"hairy": ["大量阴毛", "明显大量的阴毛。"],
	"hotpants": ["热裤", "用于强调臀部和腿部的短裤。"],
	"mesuiki": ["自发高潮", "对象在没有任何物理刺激阴茎或阴道的情况下达到高潮的性行为。"],
	"multiple orgasms": ["多重高潮", "参与者在同一会话中连续达到三个以上的高潮。"],
	"pantyjob": ["内裤交", "在生殖器上摩擦内裤。"],
	"pubic stubble": ["阴毛茬", "剃光的阴部，留有可见的发茬。"],
	"shimapan": ["条纹内裤", "shima pantsu 的缩写，意为条纹内裤。"],
	"urethra insertion": ["尿道插入", "将任何东西引入尿液排出体外的管中。"],
	"balljob": ["睾丸交", "睾丸的使用方式与乳交相同。"],
	"big balls": ["大睾丸", "异常大的睾丸。一个球至少和一只手一样大就足够了。"],
	"big penis": ["大阴茎", "一个异常大的阴茎，至少和主人的前臂一样大。"],
	"cbt": ["折磨阴茎睾丸", "阴茎和睾丸的折磨。旨在以任何方式折磨阴茎区域的行为。"],
	"cockphagia": ["阴茎吞下", "通过阴茎整个吞下。可能会引起大阴茎和尿道插入。"],
	"cuntboy": ["只有屄男孩", "男性有阴道而没有阴茎。"],
	"cock ring": ["阴茎环", "戴在阴茎和/或阴囊轴上的戒指。不要与贞操带混淆，但不会取消它的资格。用作虫洞的环不符合条件。"],
	"dickgirl on male": ["扶她/人妖x男", "女性阴茎插入男性，无论是肛门还是口腔。"],
	"dickgirls only": ["只有扶她", "画廊中的所有性、恋物或亲密互动都仅限于扶她之间。需要至少两个扶她互动。"],
	"frottage": ["阴茎互相摩擦", "两个或多个阴茎相互摩擦。"],
	"futanari": ["扶她有阴道", "参与者既有阴茎又有阴道。"],
	"horse cock": ["马阴茎", "马形阴茎。很可能会调用大阴茎标签。"],
	"huge penis": ["巨大阴茎", "一个巨大的阴茎；至少与主人的躯干长度或周长相等."],
	"penis birth": ["阴茎分娩", "通过阴茎出生的生物的行为。"],
	"phimosis": ["包茎", "阴茎包皮覆盖度非常高。即使它是直立的，也应该几乎完全覆盖。"],
	"prostate massage": ["前列腺按摩", "摩擦肛门内壁，靠近睾丸。"],
	"shemale": ["人妖", "有男性生殖器但没有阴道的女孩。"],
	"scrotal lingerie": ["阴囊内衣", "在阴茎生殖器上穿的色情服装。"],
	"small penis": ["小阴茎", "异常娇小的阴茎；必须小于其主人的食指。对于正太控，请使用小指。"],
	"smegma": ["包皮垢", "各种物质聚集在龟头和包皮之间或阴蒂和小阴唇周围的潮湿区域。"],
	"big clit": ["大阴蒂", "异常大的阴蒂。"],
	"big vagina": ["大阴道", "异常大的阴道，有时只是嘴唇。"],
	"birth": ["分娩", "一个活生生的生物出生的行为。通常在怀孕之前。"],
	"cervix penetration": ["子宫颈穿透", "女性的子宫颈/子宫被明显穿透。很可能与X 射线标签一起调用。"],
	"cervix prolapse": ["子宫颈脱垂", "阴道壁从阴道外扩张。有时前面会张开。"],
	"clit insertion": ["阴蒂插入", "插入阴道或肛门的阴蒂。通常涉及一个大阴蒂。"],
	"clit stimulation": ["阴蒂刺激", "刺激阴蒂。"],
	"cuntbusting": ["折磨阴道", "物理攻击阴道的行为。"],
	"defloration": ["破瓜", "女性失去童贞的行为。通常包括轻微出血。"],
	"double vaginal": ["双阴道", "两个阴茎插入同一个阴道。"],
	"squirting": ["潮吹", "女性射精强烈。"],
	"strap-on": ["绑戴假阳具", "一个可连接的假阳具。很可能是男性被肛交或百合的一部分。"],
	"tribadism": ["磨镜", "涉及女性互相摩擦外阴的性行为。很可能会调用百合。"],
	"triple vaginal": ["三重阴道", "三个阴茎、性玩具或其他物体插入同一个阴道。"],
	"unbirth": ["反向出生", "一名参与者被阴道吞食。基本上是反向出生（因此不需要它或怀孕标签）。"],
	"vaginal sticker": ["阴道贴", "用粘合剂或其他方式覆盖阴道区域的任何类型的贴片。"],
	"anal": ["肛门", "穿透肛门。任何方法都可以接受（性玩具、触手等）"],
	"anal birth": ["肛门分娩", "通过肛门出生的生物的行为。通常在怀孕之前。"],
	"anal intercourse": ["肛交", "参与者用阴茎或穿戴的绑带刺入另一参与者的肛门。"],
	"analphagia": ["肛吞", "通过肛门整个吞下。"],
	"anal prolapse": ["脱肛", "肛门壁从肛门扩张。有时前面会张开。"],
	"assjob": ["屁股缝交", "在两颊之间摩擦阴茎。"],
	"big ass": ["大屁股", "臀部明显宽或大。"],
	"double anal": ["双根肛门", "两个阴茎插入同一个肛门。"],
	"enema": ["灌肠", "液体或空气注入肛门。可能引起通货膨胀。存在包括所有图像，其中液体在参与者的身体内或流入/流出参与者的身体。"],
	"farting": ["放屁", "可见的胀气。"],
	"multiple assjob": ["多个屁股缝交", "不止一个人在他们的屁股颊之间摩擦阴茎。"],
	"pegging": ["男性被肛交", "男性被绑带或性玩具肛门穿透。"],
	"scat": ["排便", "排便（拉屎）。"],
	"spanking": ["打屁股", "打屁股是一种折磨或性快感。"],
	"tail": ["尾巴", "一个或多个突出的柔性附肢，是身体的一部分，通常从躯干后部突出。没有腿的身体不符合条件。"],
	"tail plug": ["尾巴性玩具", "任何类型的尾巴性玩具。"],
	"tailphagia": ["尾吞", "被一条尾巴整个吞下。"],
	"triple anal": ["三根肛门", "三个阴茎插入同一个肛门。"],
	"eggs": ["鸡蛋", "在自己体内产卵或产卵的行为。经常引发通货膨胀。"],
	"gaping": ["张开", "性交后明显伸展的阴道或肛门。通常由大插入、拳交、大或巨大的阴茎引起。"],
	"large insertions": ["大插入", "将性玩具或其他似乎不太可能舒适地放入接收所述物体的物体中。"],
	"nakadashi": ["中出", "射精停留在嘴以外的任何孔道内。通常包括外部精液池。"],
	"prolapse": ["脱垂", "阴道壁或肛门壁从各自的孔中扩张出来。有时前面会张开。"],
	"sex toys": ["性玩具", "任何用于性目的的玩具。"],
	"speculum": ["窥器", "一种用于扩张开放体腔（如肛门或阴道）的医疗器械。经常调用张开。"],
	"unusual insertions": ["不寻常的插入", "将通常不用于性活动或医疗检查的无生命物体插入生殖器或肛门的行为。"],
	"garter belt": ["吊袜带", "一种带夹子的腰带状内衣，用来夹住长袜。"],
	"kneepit sex": ["膝盖性爱", "使用膝盖下方刺激阴茎或类似物体。"],
	"leg lock": ["锁腿", "用双腿抱住性伴侣。"],
	"legjob": ["腿交", "用腿刺激另一个人。"],
	"pantyhose": ["连裤袜", "一种通常透明的单件内衣，能够完全覆盖腿部和生殖器区域。"],
	"stirrup legwear": ["马镫护腿", "覆盖脚踝但不完全覆盖脚底的裤袜。需要长袜或连裤袜标签。"],
	"stockings": ["丝袜", "一种通常透明的弹性服装，覆盖脚部和腿部下部，但不到达生殖器区域。"],
	"sumata": ["素股", "使用大腿刺激阴茎物体的性爱。"],
	"denki anma": ["電気按摩", "一名参与者用他们的脚强烈地压迫另一名参与者的胯部区域，通常是同时握住他们的腿。如果这对被压迫的人产生性刺激，则会调用脚交。可能会引发性虐待、两女格斗、调教或摔跤"],
	"foot insertion": ["脚插入", "将一只或多只脚插入阴道等孔口。"],
	"footjob": ["脚交", "用脚对另一名参与者进行性刺激。"],
	"multiple footjob": ["多重脚交", "多人同时使用脚对同一参与者进行性刺激。"],
	"sockjob": ["袜交", "涉及在生殖器上摩擦袜子的性行为。"],
	"thigh high boots": ["大腿高筒靴", "超过膝盖的靴子。"],
	"animegao": ["全身动漫服装", "一种全身服装，包括一个全面罩或头部，描绘了一个模仿角色，通常由角色扮演者穿着。"],
	"apparel bukkake": ["精液服装", "旧衣服或其他配饰被精液覆盖或充满。"],
	"apron": ["围裙", "做饭时常穿的保护衣服。通常出于色情目的而穿着。"],
	"bandages": ["绷带", "布条或类似材料缠绕在至少 10% 的人体上并且可见。"],
	"bandaid": ["创可贴", "将创可贴放置在阴部或乳头上。"],
	"bikini": ["比基尼", "覆盖生殖器和乳房的两件式泳装。这两件可以用绳子（又名弹弓比基尼）连接，但更常见的是完全分开。"],
	"bodystocking": ["紧身连衣裤", "一种覆盖大部分身体的长袜。"],
	"bodysuit": ["紧身衣裤", "任何合身的全身套装；必须遮住胳膊和腿。"],
	"bride": ["新娘", "一个穿着婚纱的人。"],
	"business suit": ["西装", "一个穿着职业装的人。"],
	"butler": ["管家", "一名家庭佣工，经常为大家庭的富裕家庭服务。穿燕尾服，系领带或领结。"],
	"cashier": ["收银员", "站在柜台后面或在商店工作的人，穿着制服，上面系着围裙。"],
	"cheerleader": ["啦啦队长", "啦啦队制服，通常搭配短裙和配套配饰。"],
	"chinese dress": ["中国装", "一件紧身连体连衣裙，通常带有简单或花卉图案。"],
	"christmas": ["圣诞节", "通常与圣诞老人相关的服装，主要使用红色织物和白色饰边。"],
	"clothed female nude male": ["穿衣女x裸男", "男性的生殖器完全暴露给非裸体女性。"],
	"clothed male nude female": ["穿衣男x裸女", "女性的生殖器完全暴露在非裸体男性面前。"],
	"clown": ["小丑", "带有褶边衣领和衣服的白脸。通常强调面部特征，例如大红鼻子和嘴唇以及颜色醒目的头发。"],
	"condom": ["避孕套", "一种塑料包装，旨在保护用户和伴侣免受不必要的性病和怀孕的伤害。"],
	"corset": ["紧身胸衣", "用来固定和塑造躯干的衣服，通常是沙漏形。"],
	"cosplaying": ["角色扮演", "一个参与者装扮成一个模仿系列中的另一个角色。不包括通用角色扮演，例如学校、护士或女仆制服。"],
	"crossdressing": ["变装", "通常男性穿着女性服装，但也可能相反。对于后者，只有在有明确意图让女性穿得像个男人的情况下才应该标记它。"],
	"dougi": ["武术训练服装", "通常用于各种武术课程和训练的服装。通常单色搭配腰带。"],
	"exposed clothing": ["衣着暴露", "任何一种带有开口的衣服，使他人可以看到生殖器区域、肛门或乳头。"],
	"fishnets": ["渔网", "由带有开口菱形针织图案的材料制成的服装制品。必须在至少一半的躯干或肢体（例如大腿、前臂等）上可见"],
	"gothic lolita": ["哥特式洛丽塔", "一种深色但有褶边的服装。"],
	"haigure": ["紧身衣女孩", "一个穿着紧身衣服的女孩，手臂和腿弯曲，强调胯部区域。"],
	"headphones": ["耳机", "将耳机戴在头上或脖子上的人。耳机罩必须足够大以覆盖耳朵。"],
	"hijab": ["头巾", "一种面纱，覆盖头部，通常是胸部，主要隐藏头发。"],
	"kigurumi pajama": ["兽耳睡衣", "带有兜帽的连体衣，描绘了一种动物。"],
	"kimono": ["和服", "带有大丝带和不同图案的传统日本服装。"],
	"kindergarten uniform": ["幼儿园制服", "一个人穿着一件带有假领的简单浅蓝色套头衫，通常搭配黄色无檐小便帽或校帽。"],
	"kunoichi": ["女忍者服装", "女忍者服装。通常是深色长袍和/或带有一些轻型盔甲的渔网。"],
	"lab coat": ["实验服", "一件白色的长外套。医生、科学家或学校护士经常佩戴。"],
	"latex": ["乳胶", "任何基于橡胶或塑料的衣服，通常是紧身的。"],
	"leotard": ["紧身衣", "常用于体操、兔女郎和摔跤的塑料服装。"],
	"lingerie": ["内衣", "为了增加性感而穿着的轻薄或性感的内衣；与普通内衣相反。还包括睡衣。"],
	"living clothes": ["生活服", "根据自己的意愿移动的衣服。"],
	"magical girl": ["魔法少女", "一种服装，包括该类型常见的裙子和褶边制服。"],
	"maid": ["女仆", "一种女仆制服，通常由各种长度的连衣裙或裙子和围裙组成。单独的头带不符合条件。"],
	"mecha boy": ["机甲男孩", "男版机甲少女。"],
	"mecha girl": ["机甲女孩", "一名穿着机械零件的女性。"],
	"metal armor": ["金属盔甲", "在中世纪或中世纪幻想时代穿着的金属盔甲。"],
	"miko": ["巫女", "神社少女；一位年轻的女祭司。通常穿着红色长裤或带蝴蝶结的红色略带褶皱的长裙和带有一些白色或红色发带的白色羽织（和服夹克）。"],
	"military": ["军事", "任何常见的军装，如迷彩服或军官制服。"],
	"mouth mask": ["口罩", "只覆盖眼睛下方的面具。"],
	"nazi": ["纳粹", "佩戴任何纳粹用具。"],
	"ninja": ["忍者", "男忍者服装。通常是深色衣服和一些轻型盔甲。"],
	"nun": ["修女", "穿着典型的黑色布长袍，按照罗马天主教的命令穿着。也可能戴着头巾、念珠和面纱。"],
	"nurse": ["护士", "穿着常见的白色/粉色套装或磨砂，通常有帽子。"],
	"pasties": ["馅饼", "贴有粘合剂的覆盖乳头和乳晕的贴片。"],
	"piercing": ["穿孔", "除了耳朵上的任何形式的穿孔。通常在阴蒂或乳头上放置戒指。"],
	"pirate": ["海盗", "海盗装。通常是带有角帽或大手帕的飘逸背心。通常有腰带、马裤和带有蓬松袖子的紧身衣。"],
	"policeman": ["警察", "男版女警。"],
	"policewoman": ["女警察", "穿着典型的警察制服。通常有徽章、衬衫上的小袋和枪套。男性版本见警察。"],
	"ponygirl": ["小马女", "一个女人穿着齿轮，如钻头/缰绳、眼罩、缰绳或马尾。可以骑在身上或以其他方式像动物一样对待。"],
	"priest": ["牧师", "任何宗教团体的神职人员所穿的服装。通常是白领长袍或西装。"],
	"race queen": ["赛车皇后", "一种紧身且通常很轻薄的制服，带有公司标志。可能会调用紧身衣裤或乳胶。"],
	"randoseru": ["皮革背包", "由皮革或类似皮革的合成材料制成的背包，最常用于小学生。"],
	"sarashi": ["束胸", "一种缠在腹部/胸部区域的长而类似绷带的布。对于男性，它通常覆盖女性的腹部和胸部。"],
	"schoolboy uniform": ["男学生制服", "男版女学生制服。"],
	"schoolgirl uniform": ["女学生制服", "穿着水手或其他标准校服的人。"],
	"school gym uniform": ["学校运动服", "短袖白色 T 恤，领口和袖口缝有对比色，用作学校体育活动的制服。有时在前面带有等级或名称标签，搭配纯色短裤或灯笼裤。"],
	"school swimsuit": ["学校泳衣", "日本学校通常使用的一种没有遮盖任何腿或手臂的连体泳装。通常是蓝色或白色，有时胸前有一张身份证。"],
	"stewardess": ["空姐制服", "在公共汽车、电梯或飞机上工作的人的制服。"],
	"steward": ["管家制服", "在公共汽车、电梯或飞机上工作的人的制服。"],
	"straitjacket": ["紧身衣", "一种躯干服装，长袖，超过穿着者的手臂，可以系在一起以限制他们的运动。"],
	"swimsuit": ["泳装", "专为游泳或其他水上活动而穿着的服装，通常覆盖整个躯干。"],
	"sundress": ["背心裙", "一种轻质面料的非正式连衣裙，通常是宽松的，没有分层上衣。"],
	"tights": ["紧身衣", "西方超级英雄经常穿的紧身衣服。既可以用于腿，也可以用于身体。"],
	"tracksuit": ["运动服", "由合成材料制成的配套衬衫和裤子，用于在运动或运动中产生出汗。性交时只需要穿上衣服的一部分。"],
	"waiter": ["服务员", "男版女服务员。"],
	"waitress": ["女服务员", "在餐厅工作的女孩穿的制服；通常是浅色连衣裙，有时包括围裙或裙子。"],
	"wet clothes": ["湿衣服", "穿着的衣服因水或其他液体而潮湿和透明。"],
	"witch": ["女巫", "一顶宽檐高尖帽，通常穿着布袍。"],
	"bisexual": ["双性恋", "在整个画廊中与同性和异性进行性活动的参与者。"],
	"fff threesome": ["三女", "包含三名女性的三人组。"],
	"ffm threesome": ["两女一男", "一个三人组，包含两个女性和一个男性。"],
	"fft threesome": ["两女一变性", "三人组包含两名女性和一名变性人（双性人或人妖）。"],
	"group": ["群交", "两个以上的参与者同时进行性行为。"],
	"harem": ["后宫", "1 人被至少 3 人追求，所有人同时进行自愿性行为。"],
	"layer cake": ["千层蛋糕", "阴茎在两个阴道之间摩擦。可能涉及每个阴道之间的交替渗透。"],
	"mmf threesome": ["两男一女", "包含两男一女的三人组。"],
	"mmm threesome": ["三男", "三人组包含三名男性。"],
	"mmt threesome": ["两男一变性", "三人组，包含两名男性和一名变性人（双性人或人妖）。"],
	"mtf threesome": ["一男一女一变性", "三人组包含一名男性、一名变性人（双性人或人妖）和一名女性。"],
	"multiple straddling": ["多跨骑", "多人同时跨骑并与同一参与者发生性关系。可能会调用颜面骑乘。"],
	"oyakodon": ["母娘丼", "一组父母和他们的一个（或多个）孩子同时与同一个伴侣进行性活动。"],
	"shimaidon": ["姉妹丼", "一群兄弟姐妹同时与同一个伴侣进行性活动。"],
	"ttf threesome": ["两变性一女", "三人组包含两名变性人（双性人或人妖）和一名女性。"],
	"ttm threesome": ["两变性一男", "三人组包含两名变性人（双性人或人妖）和一名男性。"],
	"ttt threesome": ["三变性", "三人组包含三个扶她或人妖的任意组合。"],
	"twins": ["双胞胎", "一对长相相似的兄弟姐妹与第三人或彼此发生性关系。可能会调用群交和姉妹丼标签。"],
	"all the way through": ["全身挿入", "有东西从人的嘴巴穿过人的身体后孔，反之亦然。很可能是通过大插入或触手完成的。"],
	"double penetration": ["二穴", "同时插入两个孔（嘴、阴道或屁股）。很可能调用组标签。"],
	"triple penetration": ["三穴", "三个插入同时发生在一个人身上。组合通常是双渗透，其余孔也被渗透，或双阴道/双肛门，另一个后孔被渗透。"],
	"clamp": ["夹子", "一个或多个夹在身体上以引起疼痛和/或性快感。通常是指专门用于束缚游戏的乳头或阴蒂夹，但也可能涉及常见的家居用品，如衣夹或纸扣。"],
	"dakimakura": ["动漫抱枕", "一个全身印有人物图案的身体枕头。对于抱枕风格的图像也可以接受。"],
	"glory hole": ["墙洞", "墙上的一个洞是用来进行性活动的。"],
	"machine": ["机器", "具有机械结构的性爱。"],
	"onahole": ["人造阴道", "用于手淫阴茎的人造阴道。"],
	"pillory": ["颈手枷", "通常是木制外壳或专门限制头部和手部运动的装置。"],
	"pole dancing": ["钢管舞", "为了色情目的，带着或绕着一根垂直杆跳舞。"],
	"real doll": ["真人娃娃", "现实生活中的人形娃娃，用于性目的。"],
	"syringe": ["注射器", "一种由管子、柱塞和连接的针头组成的工具。用于向参与者注射不同种类的液体或气体。"],
	"table masturbation": ["桌上自慰", "使用桌子作为自慰工具，用生殖器摩擦桌子。"],
	"tube": ["管子", "任何插入口腔以输送液体或身体物质的圆柱形管道。"],
	"vacbed": ["真空床", "用于性虐待或束缚游戏的真空床。"],
	"whip": ["鞭子", "一种鞭打或打击动物或人以造成中等程度疼痛的工具。以这种方式使用任何性对象也很重要。极有可能涉及性虐待。"],
	"wooden horse": ["木马", "任何具有三角形向上指向的装置，受害者被要求跨骑/安装在顶部，通常将他们的体重放在他们的生殖器上。"],
	"wormhole": ["虫洞", "连接两个遥远位置的一个或多个对象。通常表现为“移动荣耀洞”的一种形式，男性或女性可以通过虫洞获得各自的生殖器。"],
	"underwater": ["水下", "参与者在性交过程中大部分或完全浸没在液体中。"],
	"blood": ["血液", "描绘大量血液，例如从身体伤口流出的血液。"],
	"bukkake": ["颜射", "被精液覆盖的行为，通常不止一个人。"],
	"cum bath": ["精子浴", "浴缸、水池或另一个装满精液的大容器，其中至少有一个人部分浸没在其中。"],
	"cum swap": ["精液交换", "在 2 名或更多参与者之间交换已经射精的精液。"],
	"giant sperm": ["肉眼可见精子", "肉眼可见的单个精子细胞，无需任何放大。"],
	"internal urination": ["小便", "另一名参与者的尿液在除嘴巴外的任何孔口内徘徊。通常包括排尿后。"],
	"menstruation": ["月经", "作为女性月经周期的副产品，阴道流血；不是外伤引起的。与卫生棉条和卫生巾密切相关。"],
	"omorashi": ["漏尿", "一个角色拿着一个充满膀胱，要么弄湿自己，要么靠近。"],
	"public use": ["肉便器", "一个人保持静止并公开进行性行为，通常与多个伴侣一起。经常涉及它们被用作生活厕所/小便池。可能包括或导致正文写作。"],
	"urination": ["放尿", "小便。"],
	"chikan": ["痴汉", "以性方式抚摸或触摸他人的行为。很少自愿，经常发生在火车或公共汽车上。"],
	"rape": ["强奸", "强迫或非自愿的性行为。"],
	"time stop": ["时间停止", "至少一名参与者的时间停止或改变，而另一名参与者利用这种情况进行性利用。"],
	"bdsm": ["性虐待", "一种生活方式，其中至少一个伴侣占主导地位，至少另一个伴侣是顺从的。不需要束缚或折磨标签，但可能导致两者之一或两者。"],
	"femdom": ["调教", "女性的性支配。通常超过男性，但可以超过另一个女性。"],
	"food on body": ["身上放食物", "食物（尤其是寿司）呈现在赤裸的身体上。"],
	"forniphilia": ["人体家具", "将参与者用作家具。"],
	"human cattle": ["人类牲畜", "人类作为牲畜饲养，通常用于挤奶和/或繁殖。经常涉及束缚。"],
	"josou seme": ["女装施虐", "一个变装者或假女孩带头/对性伴侣占主导地位。"],
	"orgasm denial": ["拒绝高潮", "通过工具等方式阻止某人达到性高潮。"],
	"petplay": ["人类宠物", "将参与者视为宠物。通常涉及项圈和可能的性虐待。"],
	"slave": ["奴隶", "强迫参与者出于性目的而成为奴役。如果这是自愿使用性虐待代替。"],
	"tickling": ["挠痒痒", "以导致不自主抽搐动作或笑声的方式触摸身体。通常用羽毛完成。"],
	"bondage": ["捆绑", "需要为颈手枷、绳艺、卡在墙上和木马标签。"],
	"harness": ["吊带", "服装由皮革带组成，由金属环固定在一起，环绕穿着者的身体。"],
	"shibari": ["绳艺", "一种艺术绳索系在躯干周围的方法，以创造视觉上独特的图案。"],
	"stuck in wall": ["卡在墙上", "有人被困在一个长长的表面上，无法移动，经常有生殖器或其他非肢体身体部位悬空。"],
	"abortion": ["堕胎", "任何关于杀害未出生婴儿的描述，即使是隐含的。这包括企图杀人，但不包括未对儿童造成明显伤害的未遂企图。"],
	"cannibalism": ["食人", "类人生物被其他类人生物煮熟和/或吃掉（字面意思）。"],
	"catfight": ["两女格斗", "两名女性之间不协调的战斗。"],
	"dismantling": ["拆解（机器人）", "移除机械生物的一部分、肢解或完全破坏。"],
	"guro": ["血腥", "有机物的图形切割。适度的血腥或暴力不符合条件。"],
	"electric shocks": ["电击", "使用电来引起疼痛或愉悦。"],
	"ryona": ["殴打", "暴力、打架或殴打。通常处于不需要酷刑标签的水平。"],
	"snuff": ["杀戮", "一名参与者被明显杀死。"],
	"torture": ["拷问", "用于造成疼痛或不需要的刺激的各种技术。"],
	"trampling": ["践踏", "被一个占主导地位的伙伴践踏。通常是性虐待的一部分。"],
	"wrestling": ["摔跤", "涉及至少两名参与者之间的格斗和握持的全身战斗。"],
	"exhibitionism": ["暴露狂", "自愿裸露或有被其他人看到的风险的性活动。还公然暴露于其他人。"],
	"filming": ["拍摄", "某人的性活动被视觉记录/广播的行为。"],
	"forced exposure": ["强迫暴露", "参与者的裸露或性活动是在非参与者的全视范围内不由自主地进行的。"],
	"hidden sex": ["偷吃", "在第三方直接在场的情况下发生的性行为，但看不见。"],
	"humiliation": ["屈辱", "在未参与的观众面前以性方式非自愿地羞辱/贬低一个人。"],
	"voyeurism": ["偷窥", "监视从事性行为、脱衣或在洗手间的参与者。"],
	"clone": ["克隆", "一个或多个角色的精确复制品同时进行性活动。年龄、性别、体型、精神状态等方面的差异不符合条件。"],
	"masturbation": ["自慰", "自娱自乐。"],
	"phone sex": ["色情通话", "在取悦自己的同时使用通讯设备进行色情对话。"],
	"selfcest": ["自我男女性爱", "同一个人的两个不同版本之间的性行为。通常在某人和他们的性别改变的对手之间。"],
	"solo action": ["借助外物自慰", "一个角色自己从事性活动。使用物体作为刺激是可以接受的（例如杂志、性玩具、暴露癖）。可能会出现其他角色，但不会发生身体或精神上的互动。"],
	"handicapped": ["残疾（不能移动）", "自然不能移动自己的一个或多个肢体的人。"],
	"mute": ["哑巴", "不会说话的人。"],
	"otokofutanari": ["男有阴道和阴茎", "男性同时有阴道和阴茎。"],
	"dickgirl on dickgirl": ["扶她x扶她", "任何有阴茎的女性与另一位有阴茎的女性发生性关系。这包括人妖。"],
	"male on dickgirl": ["男x扶她", "男性通过肛门、阴道或口腔插入挥舞女性的阴茎。这包括人妖。"],
	"blackmail": ["胁迫", "通过威胁或披露信息强迫他人提供性服务的行为。"],
	"coach": ["教练", "体育学科的讲师。"],
	"impregnation": ["怀孕或受精", "怀孕的行为。"],
	"prostitution": ["卖淫", "以性为交换金钱的行为。通常涉及以某些挑衅的方式穿着。"],
	"teacher": ["老师", "被称为多个学生的教育者的参与者，通常在学校环境中。"],
	"tomboy": ["假小子（男子气概）", "一个穿着、行为和说话都以男孩子气的方式但不隐藏自己的性别的女孩，通常穿着短裤和 T 恤。可能与变装共存，但前提是女孩试图隐瞒自己的性别。"],
	"tomgirl": ["女子气概的男孩", "男性的外表使不经意的观察者很容易将其误认为女性（例如更长的头发、更细/更精致的特征、更圆的眼睛/嘴唇）。可能有害羞、顺从或被动的性格（例如脸红）。经常涉及男女装。"],
	"tutor": ["校外私教", "在校外为学生提供私人学术帮助的人。"],
	"virginity": ["童贞丧失(男)", "一名从事性活动的男性在同一场景中被称为处女。"],
	"vtuber": ["虚拟主播", "主要表现在具有原始虚拟化身的在线视频平台内的参与者。"],
	"widow": ["寡妇", "一个女人，她的另一半（已婚或长期恋爱）已经去世。死者和他们的死亡需要在画廊本身中以口头或视觉方式明确确定。"],
	"widower": ["鳏夫", "男版寡妇。"],
	"yaoi": ["搞基", "至少两名男性之间的性行为。也允许任何具有相同吸引力的男性画廊。"],
	"yuri": ["百合", "至少两名女性之间的性行为。"],
	"females only": ["只有女性", "画廊中的所有性、恋物或亲密互动均仅限于女性之间。需要至少两名女性互动。"],
	"males only": ["只有男性", "画廊中的所有性、恋物或亲密互动均仅限于男性之间。至少需要两个男性互动。"],
	"no penetration": ["没有插入", "不得将任何东西插入阴道、肛门或任何其他身体开口。嘴是唯一的例外。"],
	"nudity only": ["仅限裸露", "整个画廊都没有发生性活动，但存在裸体。"],
	"sole dickgirl": ["唯一扶她", "只有一个扶她或人妖参与整个画廊的所有性或恋物活动。"],
	"sole female": ["唯一女性", "整个画廊中只有一名女性参与任何性或恋物活动（但不一定参与所有活动）。"],
	"sole male": ["唯一男性", "整个画廊中只有一名男性参与任何性或恋物活动（但不一定参与所有活动）。"],
	"cheating": ["伴侣之外发生关系", "与伴侣以外的人发生性关系的重要他人。"],
	"netorare": ["NTR", "另一个人的配偶/关系伴侣不忠，而被戴绿帽子的人意识到这种情况。当故事显然是为了代表被戴绿帽子的人引起嫉妒或同情时，也可以接受。"],
	"swinging": ["换妻/夫", "一对夫妇允许一方或双方与第三方发生性关系。"],
	"aunt": ["姑姑阿姨", "女性与其侄女/侄子之间的任何性行为。"],
	"brother": ["亲兄弟", "男性兄弟姐妹之间的任何性行为。"],
	"cousin": ["堂兄弟", "堂兄弟之间的任何性行为。"],
	"daughter": ["女儿", "父母与其女孩之间的任何性行为。"],
	"father": ["父亲", "男性与其儿子之间的任何性行为。"],
	"granddaughter": ["孙女", "祖父母和孙女之间的任何性行为。"],
	"grandfather": ["爷爷", "男性与其孙子之间的任何性行为。"],
	"grandmother": ["奶奶", "女性和她的孙子之间的任何性行为。"],
	"incest": ["乱伦", "家庭亲属之间的性行为，即使是没有血缘关系的人。"],
	"inseki": ["收养等非血亲乱伦", "涉及姻亲、继父或收养家庭亲属的性行为。"],
	"mother": ["母亲", "女性和她的孩子之间的任何性行为。"],
	"niece": ["侄女", "女性和她的叔叔/阿姨之间的任何性行为。"],
	"sister": ["姐妹", "女性与其兄弟姐妹之间的任何性行为。"],
	"uncle": ["叔叔", "男性与其侄子之间的任何性行为。"],
	"low bestiality": ["少量兽交", ""],
	"low guro": ["少量血腥", ""],
	"low lolicon": ["少量萝莉控", ""],
	"low scat": ["少量排便", ""],
	"low shotacon": ["少量正太控", ""],
	"low smegma": ["少量包皮垢", ""],
	"focus anal": ["聚焦肛交", "表示肛交的实例超过了图库内容的 50%。"],
	"focus blowjob": ["聚焦口交", "表示口交实例超过图库内容的 50%。"],
	"focus paizuri": ["聚焦乳交", "表示乳交的实例超过了画廊内容的 50%。"],
	"3d": ["3d", "计算机生成的图像。"],
	"anaglyph": ["浮雕", "图像以红色和青色编码以实现 3D 效果。"],
	"animated": ["动画", "多帧图像。"],
	"caption": ["文字在图像外", "文本已添加到最初没有文本的图像中。通常放置在实际图像之外。"],
	"comic": ["漫画", "一部源自西方的色情作品，利用一连串的面板来说明一个故事。通常在文字气球中包含文本。"],
	"figure": ["真实世界玩具或娃娃", "现实生活中的小雕像或娃娃。"],
	"first person perspective": ["第一人称视角", "通过一个角色的眼睛看，正如其他角色直视读者或似乎属于读者的身体部位所表明的那样。"],
	"full color": ["全彩", "所有内容的页面都是彩色的。只要不是故事页面，就允许使用数量非常有限的非彩色插图。"],
	"game sprite": ["游戏精灵", "字符的低位图形。通常是动画。"],
	"how to": ["教学图像", "关于如何绘制或设计的一系列教学图像。"],
	"multipanel sequence": ["多面板序列", "一系列从固定角度描绘性活动的面板。每页至少需要 2 个连续面板。"],
	"multi-work series": ["多作品系列", "一部完整的作品，其故事跨越多卷、书籍或版本。"],
	"non-h imageset": ["无H图集", "绘制不构成漫画或cg集的非色情内容（即松散的图像、截图等）。此类画廊中的图像更倾向于具有单一主题（例如单一艺术家、系列、人物或恋物癖）。"],
	"paperchild": ["人物剪纸", "人物剪纸。经常看起来好像他们正在与现实世界互动。"],
	"redraw": ["重绘", "有人替换了部分原始图像。贬低不符合条件。"],
	"screenshots": ["截图", "从电影、[h-] 动漫或电视节目中截取的屏幕截图。"],
	"sketch lines": ["素描线", "在较详细的绘图的初步创作过程中经常使用粗糙的线条，表示绘图不完整或艺术家未清理。"],
	"stereoscopic": ["立体画法", "可以使用立体镜以 3 维方式查看的平行图像。"],
	"story arc": ["故事章节", "一个故事在一个画廊中产生了多个章节。"],
	"themeless": ["无主题", "一个图像集风格的画廊，没有共同的艺术家、模仿、角色、故事、主题或其他焦点。"],
	"western cg": ["西部cg", "一套来自西方的数字色情片，没有面板。通常是彩色的，手绘较少，背景更详细。必须描述一系列事件或作为一个整体出售/分发。从西方色情游戏中提取的帧也可以接受。"],
	"western non-h": ["西部无H", "本质上不是色情的西方起源绘画（一张带有性别的露骨图片会自动取消画廊的资格）。如果它们本质上是非性的（例如乳头滑落），则允许少量裸露。"],
	"western imageset": ["西方影像集", "不构成漫画或 cg 集的西方来源的绘制内容（即松散的图像、屏幕截图等）。此类画廊中的图像首选具有单一主题（例如单一艺术家、系列、角色或恋物癖）。"],
	"x-ray": ["断面图", "通过皮肤或从内部可以看到内部器官。"],
	"full censorship": ["全面审查", "任何形式的审查几乎涵盖了参与者的全部或全部生殖器区域。"],
	"mosaic censorship": ["马赛克审查", "任何形式的马赛克审查，几乎涵盖了参与者的全部或全部生殖器区域。"],
	"uncensored": ["无修正", "无论是出版未经审查还是后来被审查，画廊在任何时候都不会受到审查。"],
	"hardcore": ["铁杆", "对性行为的明确描述，例如阴道或肛门插入。不计入口交或性玩具的使用。"],
	"non-nude": ["非裸体", "没有显示乳头或性孔的角色扮演画廊。"],
	"already uploaded": ["已上传", ""],
	"forbidden content": ["禁止内容", ""],
	"realporn": ["真人色情", ""],
	"replaced": ["替换", ""],
	"compilation": ["选辑", "画廊是不允许一起的作品的汇编。"],
	"incomplete": ["不完整", "作品不完整，特别是缺少核心内容。"],
	"missing cover": ["遗漏封面", "缺少封面。"],
	"out of order": ["乱序", "内容不按顺序排序；通常有一个故事。"],
	"sample": ["样本", "完整作品的免费分发部分。指定可以用更完整的版本替换图库（DNP 除外）。"],
	"scanmark": ["扫描", "由翻译器/扫描仪/着色器明显标记的图像。如有无标记版本，可能会被替换。"],
	"watermarked": ["水印", "由与内容的创建、扫描、着色或翻译无关的网站的水印复制品组成的画廊。"],
	"anthology": ["选集", "多位作者的完整作品集。具有共同主题的同人志选集使用合作本。"],
	"artbook": ["画册", "出版书籍中给定主题的图形集合，通常强调艺术家的性格或设计元素，而不是性或故事内容。"],
	"goudoushi": ["合作本（多作者同主题）", "一本自行出版的书，汇集了多位艺术家的作品，这些艺术家都专注于一个主题，如角色、特许经营或恋物癖。主要仅在同人志或非H 类别中。"],
	"novel": ["小说", "页面包含没有插图的冗长文本。通常占画廊的很大一部分。"],
	"soushuuhen": ["総集编（同一作者多作品）", "一本自行出版的书，汇集了一位艺术家的多部作品。主要仅在同人志或非H 类别中。"],
	"tankoubon": ["单行本", "由第三方出版的单个艺术家的完整书籍。主要仅在漫画或非H 类别中。"],
	"variant set": ["变体集", "从静态角度仅描绘单一风景的 CG 布景。"],
	"webtoon": ["网络漫画（韩漫风）", "任何以垂直布局格式在线发布的网络漫画，利用空白代替或与镶板一起使用。"],
	"afrikaans": ["南非荷兰语", ""],
	"albanian": ["阿尔巴尼亚语", ""],
	"arabic": ["阿拉伯语", ""],
	"aramaic": ["阿拉姆语", ""],
	"armenian": ["亚美尼亚语", ""],
	"bengali": ["孟加拉语", ""],
	"bosnian": ["波斯尼亚语", ""],
	"bulgarian": ["保加利亚语", ""],
	"burmese": ["缅甸语", ""],
	"catalan": ["加泰罗尼亚语", ""],
	"cebuano": ["宿务语", ""],
	"chinese": ["汉语", ""],
	"cree": ["克里语", ""],
	"creole": ["克里奥尔语", ""],
	"croatian": ["克罗地亚语", ""],
	"czech": ["捷克语", ""],
	"danish": ["丹麦语", ""],
	"dutch": ["荷兰语", ""],
	"english": ["英语", ""],
	"esperanto": ["世界语", ""],
	"estonian": ["爱沙尼亚语", ""],
	"finnish": ["芬兰语", ""],
	"french": ["德语", ""],
	"georgian": ["法语", ""],
	"german": ["格鲁吉亚语", ""],
	"greek": ["希腊语", ""],
	"gujarati": ["古吉拉特语", ""],
	"hebrew": ["希伯来语", ""],
	"hindi": ["赫蒙语", ""],
	"hmong": ["印地语", ""],
	"hungarian": ["匈牙利语", ""],
	"icelandic": ["冰岛语", ""],
	"indonesian": ["印度尼西亚语", ""],
	"irish": ["爱尔兰语", ""],
	"italian": ["意大利语", ""],
	"japanese": ["日语", ""],
	"javanese": ["爪哇语", ""],
	"kannada": ["卡纳达语", ""],
	"kazakh": ["哈萨克语", ""],
	"khmer": ["高棉语", ""],
	"korean": ["韩语", ""],
	"kurdish": ["库尔德语", ""],
	"ladino": ["拉迪诺语", ""],
	"lao": ["老挝语", ""],
	"latin": ["拉丁语", ""],
	"latvian": ["拉脱维亚语", ""],
	"marathi": ["马拉地语", ""],
	"mongolian": ["蒙古语", ""],
	"ndebele": ["古吉拉特语", ""],
	"nepali": ["尼泊尔语", ""],
	"norwegian": ["挪威语", ""],
	"oromo": ["奥罗莫语", ""],
	"papiamento": ["帕皮阿门托语", ""],
	"pashto": ["普什图语", ""],
	"persian": ["波斯语", ""],
	"polish": ["波兰语", ""],
	"portuguese": ["葡萄牙语", ""],
	"punjabi": ["旁遮普语", ""],
	"romanian": ["罗马尼亚语", ""],
	"russian": ["俄语", ""],
	"sango": ["桑戈语", ""],
	"sanskrit": ["梵语", ""],
	"serbian": ["塞尔维亚语", ""],
	"shona": ["绍纳语", ""],
	"slovak": ["斯洛伐克语", ""],
	"slovenian": ["斯洛文尼亚语", ""],
	"somali": ["索马里语", ""],
	"spanish": ["西班牙语", ""],
	"swahili": ["斯瓦希里语", ""],
	"swedish": ["瑞典语", ""],
	"tagalog": ["他加禄语", ""],
	"tamil": ["泰米尔语", ""],
	"telugu": ["泰卢固语", ""],
	"thai": ["泰语", ""],
	"tibetan": ["藏语", ""],
	"tigrinya": ["提格里尼亚语", ""],
	"turkish": ["土耳其语", ""],
	"ukrainian": ["乌克兰语", ""],
	"urdu": ["乌尔都语", ""],
	"vietnamese": ["越南语", ""],
	"welsh": ["威尔士语", ""],
	"yiddish": ["意第绪语", ""],
	"zulu": ["祖鲁语", ""],
	"rewrite": ["改写文本", "个人填写了自己的文本来代替原始文本或没有的地方。"],
	"rough grammar": ["粗略语法（部分语法拼写错误）", "任何第三方翻译，包含所需数量的带有语法或拼写错误的句子。要求定义为： 总翻译页数的 25%（四舍五入到最接近的整数）或 10，以较高者为准。"],
	"rough translation": ["粗略翻译（部分翻译错误）", "任何第三方翻译，由所需数量的文本框/气泡组成，并带有翻译错误。要求定义为： 总翻译页数的 25%（四舍五入到最接近的整数）或 10，以较高者为准。翻译错误包括缺少上下文、缺少作者意图、省略故事/情况相关文本或不正确的含义。"],
	"speechless": ["不含任何文本", "画廊中没有任何文字被用作交流或叙述的手段。将画廊的语言指定为“N/A”。"],
	"text cleaned": ["文本清理", "删除了附带文字的漫画或 CG 集。"],
	"translated": ["已翻译", "由第三方对原始语言进行的任何翻译。"]
};

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

//#region [localStorage 本地存储 版本号、全部列表html、列表折叠位置、收藏数据、收藏折叠数据、头部旧版菜单显示隐藏、标签谷歌机翻_首页、标签谷歌机翻_详情]
// 版本号数据 读取、设置
var currentVersion = "2.1.202203150918.4";
var dbVersionKey = "categoryVersion";
function getVersion() {
	return localStorage.getItem(dbVersionKey);
}
function setVersion(version) {
	localStorage.setItem(dbVersionKey, version);
}

// 全部列表数据 读取、设置
var dbCategoryListHtmlKey = "categoryListHtml";
function getCategoryListHtml() {
	return localStorage.getItem(dbCategoryListHtmlKey);
}
function setCategoryListHtml(categoryListHtml) {
	localStorage.setItem(dbCategoryListHtmlKey, categoryListHtml);
}

// 折叠按钮位置 读取、设置
var dbCategoryListExpendKey = "categoryListExpendArray";
function getCategoryListExpend() {
	return JSON.parse(localStorage.getItem(dbCategoryListExpendKey));
}
function setCategoryListExpend(categoryListExpend) {
	localStorage.setItem(dbCategoryListExpendKey, JSON.stringify(categoryListExpend));
}
function clearCategoryListExpend() {
	localStorage.removeItem(dbCategoryListExpendKey);
}

// 收藏列表数据 读取、设置、清空
var dbFavoriteKey = "favoriteDict";
function getFavoriteDicts() {
	return JSON.parse(localStorage.getItem(dbFavoriteKey))
}
function setFavoriteDicts(favoriteDict) {
	localStorage.setItem(dbFavoriteKey, JSON.stringify(favoriteDict));
}
function clearFavoriteDicts() {
	localStorage.removeItem(dbFavoriteKey);
}

// 收藏列表折叠 读取、设置、清空
var dbFavoriteListExpendKey = "favoriteListExpendArray";
function getFavoriteListExpend() {
	return JSON.parse(localStorage.getItem(dbFavoriteListExpendKey));
}
function setFavoriteListExpend(favoriteListExpend) {
	localStorage.setItem(dbFavoriteListExpendKey, JSON.stringify(favoriteListExpend));
}
function clearFavoriteListExpend() {
	localStorage.removeItem(dbFavoriteListExpendKey);
}

// 头部搜索菜单显示、隐藏
var dbOldSearchDivVisibleKey = "oldSearchDivVisibleKey";
function getOldSearchDivVisible() {
	return localStorage.getItem(dbOldSearchDivVisibleKey);
}
function setOldSearchDivVisible(visible) {
	localStorage.setItem(dbOldSearchDivVisibleKey, visible);
}

// 标签谷歌机翻_首页
var dbGoogleTranslateCategoryFontPage = "googleTranslateCategoryFontPage";
function getGoogleTranslateCategoryFontPage() {
	return localStorage.getItem(dbGoogleTranslateCategoryFontPage);
}
function setGoogleTranslateCategoryFontPage(isChecked) {
	localStorage.setItem(dbGoogleTranslateCategoryFontPage, isChecked);
}

// 标签谷歌机翻_详情页
var dbGoogleTranslateCategoryDetail = "googleTranslateCategoryDetail";
function getGoogleTranslateCategoryDetail() {
	return localStorage.getItem(dbGoogleTranslateCategoryDetail);
}
function setGoogleTranslateCategoryDetail(isChecked) {
	localStorage.setItem(dbGoogleTranslateCategoryDetail, isChecked);
}

//#endregion

//#region [通用工具方法]
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

// 时间类
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



//#endregion

//#region [页面样式和汉化]

// 头部菜单翻译汉化
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
		"HentaiVerse": "變態之道(游戏)",

	};
	var menus = document.getElementById("nb").querySelectorAll("a");
	for (const i in menus) {
		if (Object.hasOwnProperty.call(menus, i)) {
			const a = menus[i];
			a.innerText = fontMenusData[a.innerText] ?? a.innerText;
		}
	}
}

// 首页翻译
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
		"Minimal+": "标题 + 悬浮图 + 账号收藏标签", // 多余（删掉）
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
	if (getGoogleTranslateCategoryFontPage() == 1) {
		translateCheckbox.setAttribute("checked", true);
	}

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
	var gt = document.getElementsByClassName("gt");
	for (const i in gt) {
		if (Object.hasOwnProperty.call(gt, i)) {
			const item = gt[i];
			var innerText = item.innerText;
			if (innerText.indexOf(":") != -1) {
				// 父子标签
				var split = item.title.split(":");
				if (split.length == 2) {
					var parentEn = split[0];
					var subEn = split[1];
					var parentZh = detailParentData[parentEn] ?? parentEn;
					var subZh = getSubZh(subEn);
					if (subZh != subEn) {
						item.innerText = `${parentZh}:${subZh}`;
					}
					else {
						item.classList.add("needTranslate");
					}
				}
			}
			else {
				// 只有子标签
				var subEn = innerText;
				var subZh = getSubZh(subEn);
				if (subZh != subEn) {
					item.innerText = subZh;
				}
				else {
					item.classList.add("needTranslate");
				}
			}
		}
	}
	var gtl = document.getElementsByClassName("gtl");
	for (const i in gtl) {
		if (Object.hasOwnProperty.call(gtl, i)) {
			const item = gtl[i];
			var subEn = item.innerText;
			var subZh = getSubZh(subEn);
			if (subZh != subEn) {
				item.innerText = subZh;
			}
			else {
				item.classList.add("needTranslate");
			}
		}
	}

	function getSubZh(subEn) {
		var subItems = subData[subEn];
		if (subItems && subItems.length > 0) {
			return subData[subEn][0];
		}
		return subEn;
	}

	// 判断一开始是否选中
	if (getGoogleTranslateCategoryFontPage() == 1) {
		translateClickMainPage();
	}

}

var translateDict = {};

// 谷歌翻译，通用方法
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

// 首页谷歌翻译
function translateClickMainPage() {
	var isChecked = translateClick();

	// 更新存储
	setGoogleTranslateCategoryFontPage(isChecked ? 1 : 0);
}

// 详情页谷歌翻译
function translateClickDetail() {
	var isChecked = translateClick();

	// 更新存储
	setGoogleTranslateCategoryDetail(isChecked ? 1 : 0);
}

// 详情页翻译
function detailPageTranslate() {

	// 首页添加 Meta
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
	trList[3].lastChild.innerText = subData[trList[3].lastChild.innerText.toLowerCase()] ?? trList[3].lastChild.innerText;

	// 文件大小
	trList[4].firstChild.innerText = "大小:";

	// 篇幅
	trList[5].firstChild.innerText = "篇幅:";
	trList[5].lastChild.innerText = trList[3].lastChild.innerText.replace("pages", "张图");

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
	var gd5aDict = {
		"Report Gallery": "举报",
		"Archive Download": "档案下载",
		"Petition to Expunge": "申请删除",
		"Petition to Rename": "申请改名",
		"Show Gallery Stats": "画廊统计",
	};

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

// 首页标签功能
function mainPageCategory() {
	//#region [生成基本框架]

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

	// 基本框架代码插入，先创建包裹层div，然后构造包裹层内容
	var webdiv = document.createElement("div");
	webdiv.id = "div_ee8413b2";
	searchBoxDiv.appendChild(webdiv);
	//searchBoxDiv.insertBefore(webdiv, searchBoxDiv.children[0]);
	webdiv.innerHTML = category_html;

	// 读取头部是否隐藏，并应用到页面中
	var oldSearchDivVisible = getOldSearchDivVisible();
	if (oldSearchDivVisible == 0) {
		searchBoxDiv.children[0].style.display = "none";
		hiddenOldDiv.style.display = "none";
		showOldDiv.style.display = "block";
	}

	//#endregion

	//#region [HTML DOM Elements]

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

	// 展示区包裹层div、全部类别Div、收藏Div、类别列表div、收藏列表div
	var displayDiv = document.getElementById("display_div");
	var categoryDisplayDiv = document.getElementById("category_all_div");
	var favoritesDisplayDiv = document.getElementById("category_favorites_div");
	var categoryListDiv = document.getElementById("category_list");
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

	//#region [生成标签列表、收藏列表]

	// 收藏列表判断是否处于清空状态，清空状态下隐藏 展开、折叠、编辑、清空、保存、取消按钮
	function updateFavoriteListBtnStatus() {
		var favoriteItems = favoriteListDiv.querySelectorAll("span");
		if (favoriteItems.length == 0) {
			favoriteAllExtend.style.display = "none";
			favoriteAllCollapse.style.display = "none";
			favoriteEdit.style.display = "none";
			favoriteClear.style.display = "none";
			favoriteSave.style.display = "none";
			favoriteCancel.style.display = "none";
		}
		else {
			favoriteAllExtend.style.display = "block";
			favoriteAllCollapse.style.display = "block";
			favoriteEdit.style.display = "block";
			favoriteClear.style.display = "block";
		}
	}

	// 通过比对版本号，生成全部列表
	// 版本号不同，更新版本号，根据标签表重新生成列表，并存储html代码
	// 版本号相同，且本地缓存了html代码， 套用本地html代码，并读取用户折叠标签的信息
	var localVersion = getVersion();
	var dbCategoryListHtml = getCategoryListHtml();
	if (currentVersion != localVersion || (currentVersion == localVersion && !dbCategoryListHtml)) {
		var categoryHtml = ``;
		for (const enParent in categoryData) {
			if (Object.hasOwnProperty.call(categoryData, enParent)) {
				const subItems = categoryData[enParent];
				var zhParent = subItems[0];
				var itemDict = subItems[1];

				categoryHtml += `<h4>${zhParent}<span data-category="${enParent}" class="category_extend">-</span></h4>`;
				categoryHtml += `<div id="items_div_${enParent}" class="category_items_div">`;

				for (const enItem in itemDict) {
					if (Object.hasOwnProperty.call(itemDict, enItem)) {
						const zhArray = itemDict[enItem];
						categoryHtml += `<span class="c_item" data-item="${enItem}" data-favorite_parent_en="localFavorites" data-favorite_parent_zh="本地" title="[${enItem}] ${zhArray[1]}">${zhArray[0]}</span>`;
					}
				}
				categoryHtml += `</div>`;
			}
		}
		categoryListDiv.innerHTML = categoryHtml;
		setCategoryListHtml(categoryHtml);
		setVersion(currentVersion);
	}
	else {
		categoryListDiv.innerHTML = dbCategoryListHtml;
	}

	// 根据本地存储标签列表的折叠数据，折叠某些父级
	var categoryExpendArray = getCategoryListExpend();
	if (categoryExpendArray) {

		var expendBtns = document.getElementsByClassName("category_extend");
		for (const i in expendBtns) {
			if (Object.hasOwnProperty.call(expendBtns, i)) {
				const btn = expendBtns[i];
				var category = btn.dataset.category;
				if (categoryExpendArray.indexOf(category) != -1) {
					btn.innerText = "+";
					var itemDiv = document.getElementById("items_div_" + category);
					itemDiv.style.display = "none";
				}
			}
		}
	}

	// 根据本地缓存的收藏html代码，如果存在则生成收藏列表，后期收藏和翻译整合
	var favoriteDb = getFavoriteDicts();
	updateFavoriteList(favoriteDb);

	// 根据收藏数据重新生成收藏列表
	function updateFavoriteList(favoriteDb) {
		if (favoriteDb) {
			var favoritesListHtml = ``;
			if (!checkDictNull(favoriteDb)) {
				// 新版收藏，只可能增加，原有的不变
				for (const favoriteParentEn in favoriteDb) {
					if (Object.hasOwnProperty.call(favoriteDb, favoriteParentEn)) {
						var items = favoriteDb[favoriteParentEn]
						var favoriteParentZh = items[0];
						var favoriteDicts = items[1];

						favoritesListHtml += `<h4 id="favorite_h4_${favoriteParentEn}">${favoriteParentZh}<span data-category="${favoriteParentEn}"
						 class="favorite_extend">-</span></h4>`;

						favoritesListHtml += `<div id="favorite_div_${favoriteParentEn}" class="favorite_items_div">`;

						for (const enItem in favoriteDicts) {
							if (Object.hasOwnProperty.call(favoriteDicts, enItem)) {
								const zhItem = favoriteDicts[enItem];

								favoritesListHtml += `<span class="c_item" title="${enItem}" data-item="${enItem}" 
								data-favorite_parent_en="${favoriteParentEn}" data-favorite_parent_zh="${favoriteParentZh}">${zhItem}</span>`;
							}
						}

						favoritesListHtml += `</div>`;
					}
				}
			}

			favoriteListDiv.innerHTML = favoritesListHtml;
		}
	}

	// 更新收藏折叠
	function updateFavoriteExpend() {
		var favoriteExpendArray = getFavoriteListExpend();
		if (favoriteExpendArray) {

			var expendBtns = document.getElementsByClassName("favorite_extend");
			for (const i in expendBtns) {
				if (Object.hasOwnProperty.call(expendBtns, i)) {
					const btn = expendBtns[i];
					var category = btn.dataset.category;
					if (favoriteExpendArray.indexOf(category) != -1) {
						btn.innerText = "+";
						var itemDiv = document.getElementById("favorite_div_" + category);
						itemDiv.style.display = "none";
					}
				}
			}
		}
	}

	// 根据本地存储收藏列表的折叠数据，折叠某些父级
	updateFavoriteExpend();


	// 更新收藏列表按钮状态
	updateFavoriteListBtnStatus();

	//#endregion

	//#region [全部类别模块]

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

	}

	// 全部展开按钮
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
		clearCategoryListExpend();
	}

	// 全部折叠按钮
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

		// 并更新存储全部的父级名称
		setCategoryListExpend(parentData);
	}

	// 标签展开折叠
	for (const i in categoryExtends) {
		if (Object.hasOwnProperty.call(categoryExtends, i)) {
			const item = categoryExtends[i];
			item.addEventListener("click", function () {
				// 获取存储折叠信息
				var expendData = getCategoryListExpend();

				if (!expendData) {
					expendData = [];
				}

				var cateDivName = item.dataset.category;
				if (item.innerHTML == "+") {
					// 需要展开
					item.innerHTML = "-";
					document.getElementById("items_div_" + cateDivName).style.display = "block";
					if (expendData.indexOf(cateDivName) != -1) {
						expendData.remove(cateDivName);
					}
				}
				else {
					// 需要折叠
					item.innerHTML = "+";
					document.getElementById("items_div_" + cateDivName).style.display = "none";
					if (expendData.indexOf(cateDivName) == -1) {
						expendData.push(cateDivName);
					}
				}

				// 保存存储信息
				setCategoryListExpend(expendData);
			});
		}
	}

	// 具体小项点击，加入到搜索框
	for (const i in cItems) {
		if (Object.hasOwnProperty.call(cItems, i)) {
			const searchItem = cItems[i];
			searchItem.addEventListener("click", function () {
				var favoriteParentEn = searchItem.dataset.favorite_parent_en;
				var favoriteParentZh = searchItem.dataset.favorite_parent_zh;
				var enItem = searchItem.dataset.item;
				var zhItem = searchItem.innerHTML;
				addItemToInput(favoriteParentEn, favoriteParentZh, enItem, zhItem);
			});
		}
	}

	// 点击小项加入到搜索框

	function addItemToInput(favoriteParentEn, favoriteParentZh, enItem, zhItem) {

		if (searchItemDict[enItem] == undefined) {
			if (checkDictNull(searchItemDict)) {
				inputClearBtn.style.display = "block";
				searchBtn.innerText = "搜索";
			}


			var newSearchInputItem = document.createElement("span");
			newSearchInputItem.classList.add("input_item");
			newSearchInputItem.id = "input_item_" + enItem;
			newSearchInputItem.title = enItem;

			newSearchInputItem.dataset.item = enItem;
			searchItemDict[enItem] = [zhItem, favoriteParentEn, favoriteParentZh];

			var searchItemText = document.createTextNode(zhItem + " X");
			newSearchInputItem.appendChild(searchItemText);
			newSearchInputItem.addEventListener("click", removeSearchItem);
			readonlyDiv.appendChild(newSearchInputItem);

			addFavoritesBtn.style.display = "block";
			addFavoritesDisabledBtn.style.display = "none";
		}
	}

	//#endregion

	//#region [搜索框模块 + 收起]

	// 进入页面，根据地址栏信息生成搜索栏标签
	var f_searchs = GetQueryString("f_search");
	var favoriteDict = getFavoriteDicts();
	if (f_searchs) {
		var searchArray = f_searchs.replace(/\"/g, "").split("+");
		for (const i in searchArray) {
			if (Object.hasOwnProperty.call(searchArray, i)) {

				var items = searchArray[i].replace("'", "");

				// 从收藏中查询，看是否存在
				var itemArray = items.split(":");
				if (itemArray.length == 2) {
					var parentEn = itemArray[0];
					var subEn = itemArray[1];
					if (favoriteDict[parentEn][1][subEn]) {
						var parentZh = favoriteDict[parentEn][0];
						var subZh = favoriteDict[parentEn][1][subEn];
						addItemToInput(parentEn, parentZh, subEn, subZh);
					}
					else {
						addItemToInput(parentEn, parentEn, subEn, subEn);
					}
				}
				else {
					// 普通搜索
					var enItem = items;
					var valueItems = subData[enItem];
					if (valueItems) {
						addItemToInput("localFavorites", "本地", enItem, valueItems[0]);
					} else {
						addItemToInput("localFavorites", "本地", enItem, enItem);
					}
				}
			}
		}
	}

	// 悬浮显示输入框
	searchInput.onmouseover = function () {
		if (userInput.value == "") {
			userInput.classList.add("user_input_null_backcolor");
		} else {
			userInput.classList.add("user_input_value_backColor");
		}

	}

	// 移除输入框
	searchInput.onmouseout = function () {
		if (userInput.value == "") {
			userInput.classList.remove("user_input_null_backcolor");
			userInput.classList.remove("user_input_value_backColor");
		}
	}


	var inputDict = {};

	function updateInputDict() {
		inputDict = {};
		var cItems = document.getElementsByClassName("c_item");
		for (const i in cItems) {
			if (Object.hasOwnProperty.call(cItems, i)) {
				const span = cItems[i];
				var enItem = span.dataset.item;
				var zhItem = span.innerText;
				if (!inputDict[zhItem]) {
					inputDict[zhItem] = [enItem];
				} else {
					var enArray = inputDict[zhItem];
					if (enArray.indexOf(enItem) == -1) {
						enArray.push(enItem);
						inputDict[zhItem] = enArray;
					}
				}
			}
		}
	}

	// 更新搜索项
	updateInputDict();

	// 输入框输入时候选
	userInput.oninput = function () {
		var inputValue = userInput.value;
		userInputOnInputEvent(inputValue);
	}

	function userInputOnInputEvent(inputValue) {
		var foundKeys = {};
		// 清空候选项
		userInputRecommendDiv.innerHTML = "";
		userInputRecommendDiv.style.display = "block";

		if (!inputValue) {
			categroyInputClear.style.display = "none";
			return;
		}

		for (const zhKey in inputDict) {
			if (Object.hasOwnProperty.call(inputDict, zhKey)) {
				const enArray = inputDict[zhKey];
				if (zhKey.match(inputValue)) {
					foundKeys[zhKey] = enArray;
				}
			}
		}

		// 创建候选项
		for (const zhKey in foundKeys) {
			if (Object.hasOwnProperty.call(foundKeys, zhKey)) {
				const enArray = foundKeys[zhKey];
				for (const i in enArray) {
					if (Object.hasOwnProperty.call(enArray, i)) {
						const enItem = enArray[i];
						var commendDiv = document.createElement("div");
						commendDiv.classList.add("category_user_input_recommend_items");
						var textNode = document.createTextNode(`${zhKey} ${enItem}`);
						commendDiv.appendChild(textNode);
						commendDiv.addEventListener("click", function () {
							var cItems = document.getElementsByClassName("c_item");
							for (const i in cItems) {
								if (Object.hasOwnProperty.call(cItems, i)) {
									const span = cItems[i];
									var spEnItem = span.dataset.item;
									if (spEnItem == enItem) {
										var favoriteParentEn = span.dataset.favorite_parent_en;
										var favoriteParentZh = span.dataset.favorite_parent_zh;
										var zhItem = span.innerText;
										addItemToInput(favoriteParentEn, favoriteParentZh, enItem, zhItem);
										break;
									}
								}
							}
							userInputRecommendDiv.innerHTML = "";
							userInput.value = "";
							userInput.focus();
						});
						userInputRecommendDiv.appendChild(commendDiv);
					}
				}
			}
		}
	}

	// 输入框检测回车事件
	userInput.onkeydown = function (e) {
		var theEvent = window.event || e;
		var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
		if (code == 13) {
			userInputEnter();
		}
	}

	function userInputEnter() {
		var inputValue = userInput.value.replace(/(^\s*)|(\s*$)/g, '');
		if (!inputValue) return;
		// 查询是否是候选值
		var isCommand = false;
		var cItems = document.getElementsByClassName("c_item");
		var inputEnItem = inputDict[inputValue];
		if (inputEnItem) {
			for (const i in cItems) {
				if (Object.hasOwnProperty.call(cItems, i)) {
					const span = cItems[i];
					var enItem = span.dataset.item;
					if (enItem == inputEnItem) {
						isCommand = true;
						var favoriteParentEn = span.dataset.favorite_parent_en;
						var favoriteParentZh = span.dataset.favorite_parent_zh;
						var zhItem = span.innerText;
						addItemToInput(favoriteParentEn, favoriteParentZh, enItem, zhItem);
						break;
					}
				}
			}
		}


		if (!isCommand) {
			// 新增的文本
			addItemToInput("localFavorites", "本地", inputValue, inputValue);
		}

		// 清空文本框
		userInput.value = "";
		userInputRecommendDiv.style.display = "none";
	}

	userInputEnterBtn.onclick = userInputEnter;


	// 搜索框小项点击，从搜索框移除
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

	// 搜索按钮 or 首页按钮
	searchBtn.onclick = function () {
		if (searchBtn.innerText == "首页") {
			searchBtn.innerText = "···";
			window.location.href = `https://${webHost}`;
		}
		else if (searchBtn.innerText == "搜索") {
			var enItemArray = [];
			for (const enItem in searchItemDict) {
				if (Object.hasOwnProperty.call(searchItemDict, enItem)) {
					var favoriteParentEn = searchItemDict[enItem][1];
					if (favoriteParentEn == "localFavorites") {
						enItemArray.push(`"${enItem}"`);
					}
					else {
						enItemArray.push(`"${favoriteParentEn}:${enItem}"`);
					}
				}
			}
			searchBtn.innerText = "···";
			// 构建请求链接
			var searchLink = `https://${webHost}/?seltag=${enItemArray[enItemArray.length - 1]}&f_search=${enItemArray.join("+")}`;
			window.location.href = searchLink;
		}
	}

	// 搜索按钮，点击后如果鼠标悬浮指针改为转圈
	searchBtn.onmouseover = function () {
		if (searchBtn.innerText == "···") {
			searchBtn.style.cursor = "wait";
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

		var newFavoriteDicts = {};

		// 读取本地存储的收藏
		var favoriteDb = getFavoriteDicts();
		if (checkDictNull(favoriteDb)) {
			// 本地存储为空，直接添加
			for (const enItem in searchItemDict) {
				if (Object.hasOwnProperty.call(searchItemDict, enItem)) {
					var items = searchItemDict[enItem];
					var zhItem = items[0];
					var favoriteParentEn = items[1];
					var favoriteParentZh = items[2];
					updateNewFavoriteDicts(enItem);
				}
			}

			setFavoriteDicts(newFavoriteDicts);
		}
		else {
			// 存在，过滤已经存在的，添加新的
			for (const enItem in searchItemDict) {
				if (Object.hasOwnProperty.call(searchItemDict, enItem)) {
					var searchItems = searchItemDict[enItem];
					var favoriteParentEn = searchItems[1];
					var zhItem = searchItems[0];
					var favoiteParent = favoriteDb[favoriteParentEn];
					if (!favoiteParent) {
						// 收藏不存在父级，创建父级
						var favoriteParentZh = searchItems[2];
						favoriteDb[favoriteParentEn] = [favoriteParentZh, {}];
						favoriteDb[favoriteParentEn][1][enItem] = zhItem;
						updateNewFavoriteDicts(enItem);
					}
					else {
						// 存在父级，更新对应子集
						if (!favoiteParent[1][enItem]) {
							favoiteParent[1][enItem] = zhItem;
							updateNewFavoriteDicts(enItem);

						}
					}
				}
			}
			setFavoriteDicts(favoriteDb);
		}

		if (!checkDictNull(newFavoriteDicts)) {
			// 新版收藏，只可能增加，原有的不变
			for (const favoriteParentEn in newFavoriteDicts) {
				if (Object.hasOwnProperty.call(newFavoriteDicts, favoriteParentEn)) {
					var items = newFavoriteDicts[favoriteParentEn]
					var favoriteParentZh = items[0];
					var favoriteDicts = items[1];

					var favoriteH4Id = "favorite_h4_" + favoriteParentEn;
					var favoriteH4 = document.getElementById(favoriteH4Id);
					if (!favoriteH4) {
						var h4 = document.createElement("h4");
						h4.id = favoriteH4Id;
						var h4text = document.createTextNode(favoriteParentZh);
						h4.appendChild(h4text);
						var spanExtend = document.createElement("span");
						spanExtend.dataset.category = favoriteParentEn;
						spanExtend.classList.add("favorite_extend");
						var spanExtendText = document.createTextNode("-");
						spanExtend.appendChild(spanExtendText);

						spanExtend.addEventListener("click", function () {
							favoriteExend(favoriteParentEn);
						});

						h4.appendChild(spanExtend);
						favoriteListDiv.appendChild(h4);
					}

					var favoriteDivId = "favorite_div_" + favoriteParentEn;
					var favoriteDiv = document.getElementById(favoriteDivId);
					if (!favoriteDiv) {
						var div = document.createElement("div");
						div.id = favoriteDivId;
						div.classList.add("favorite_items_div");
						favoriteListDiv.appendChild(div);
						favoriteDiv = document.getElementById(favoriteDivId);
					}

					for (const enItem in favoriteDicts) {
						if (Object.hasOwnProperty.call(favoriteDicts, enItem)) {
							const zhItem = favoriteDicts[enItem];

							var newFavoriteItem = document.createElement("span");
							newFavoriteItem.classList.add("c_item");
							newFavoriteItem.dataset.item = enItem;
							newFavoriteItem.dataset.favorite_parent_en = favoriteParentEn;
							newFavoriteItem.dataset.favorite_parent_zh = favoriteParentZh;
							newFavoriteItem.title = enItem;

							var itemText = document.createTextNode(zhItem);
							newFavoriteItem.appendChild(itemText);

							newFavoriteItem.addEventListener("click", function () {
								addItemToInput(favoriteParentEn, favoriteParentZh, enItem, zhItem);
							});

							favoriteDiv.appendChild(newFavoriteItem);
						}
					}
				}
			}
		}

		// 显示按钮
		favoriteAllExtend.style.display = "block";
		favoriteAllCollapse.style.display = "block";
		favoriteEdit.style.display = "block";
		favoriteClear.style.display = "block";

		// 更新搜索项
		updateInputDict();

		setTimeout(function () {
			addFavoritesBtn.innerText = "完成 √";
		}, 250);
		setTimeout(function () {
			addFavoritesBtn.innerText = "加入收藏";
		}, 500);

		// 更新新增收藏项，用于页面新增收藏项
		function updateNewFavoriteDicts(enItem) {
			if (!newFavoriteDicts[favoriteParentEn]) {
				newFavoriteDicts[favoriteParentEn] = [favoriteParentZh, {}];
				newFavoriteDicts[favoriteParentEn][1][enItem] = zhItem;
			}
			else {
				newFavoriteDicts[favoriteParentEn][1][enItem] = zhItem;
			}
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

	//#endregion

	//#region [收藏模块]

	// 收藏折叠按钮赋能
	for (const i in favoriteExtends) {
		if (Object.hasOwnProperty.call(favoriteExtends, i)) {
			const item = favoriteExtends[i];
			item.addEventListener("click", function () {
				// 获取存储折叠信息
				var expendData = getFavoriteListExpend();

				if (!expendData) {
					expendData = [];
				}

				var favoDivName = item.dataset.category;
				if (item.innerHTML == "+") {
					// 需要展开
					item.innerHTML = "-";
					document.getElementById("favorite_div_" + favoDivName).style.display = "block";
					if (expendData.indexOf(favoDivName) != -1) {
						expendData.remove(favoDivName);
					}
				}
				else {
					// 需要折叠
					item.innerHTML = "+";
					document.getElementById("favorite_div_" + favoDivName).style.display = "none";
					if (expendData.indexOf(favoDivName) == -1) {
						expendData.push(favoDivName);
					}
				}

				// 保存存储信息
				setFavoriteListExpend(expendData);
			});
		}
	}

	// 具体折叠按钮
	function favoriteExend(favoriteExtendName) {
		var h4 = document.getElementById("favorite_h4_" + favoriteExtendName);
		var span = h4.querySelector("span");
		// 获取存储折叠信息
		var expendData = getFavoriteListExpend();

		if (!expendData) {
			expendData = [];
		}

		if (span.innerHTML == "+") {
			// 需要展开
			span.innerHTML = "-";
			document.getElementById("favorite_div_" + favoriteExtendName).style.display = "block";
			if (expendData.indexOf(favoriteExtendName) != -1) {
				expendData.remove(favoriteExtendName);
			}
		}
		else {
			// 需要折叠
			span.innerHTML = "+";
			document.getElementById("favorite_div_" + favoriteExtendName).style.display = "none";
			if (expendData.indexOf(favoriteExtendName) == -1) {
				expendData.push(favoriteExtendName);
			}
		}

		// 保存存储信息
		setFavoriteListExpend(expendData);
	}

	// 收藏全部展开按钮
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
		clearFavoriteListExpend();
	}

	// 收藏全部折叠按钮
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
		setFavoriteListExpend(favoriteParentData);
	}

	// 收藏列表按钮
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

	// 收藏编辑
	var favoriteDict = {};
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

		// 隐藏收藏列表，方便用户取消时直接还原
		favoriteListDiv.style.display = "none";

		// 显示编辑列表, 读取本地收藏, 生成可删除的标签
		favoriteEditDiv.style.display = "block";

		favoriteDict = getFavoriteDicts();

		for (const favoriteParentEn in favoriteDict) {
			if (Object.hasOwnProperty.call(favoriteDict, favoriteParentEn)) {
				var items = favoriteDict[favoriteParentEn]
				var favoriteParentZh = items[0];
				var favoriteDicts = items[1];

				var h4 = document.createElement("h4");
				h4.id = "favorite_edit_h4_" + favoriteParentEn;
				var h4text = document.createTextNode(favoriteParentZh);
				h4.appendChild(h4text);
				var spanClear = document.createElement("span");
				spanClear.dataset.category = favoriteParentEn;
				spanClear.classList.add("favorite_edit_clear");
				var spanClearText = document.createTextNode("x");
				spanClear.appendChild(spanClearText);

				spanClear.addEventListener("click", function () {
					// 清空父项和子项
					removeEditorParent(favoriteParentEn);
				});

				h4.appendChild(spanClear);
				favoriteEditDiv.appendChild(h4);

				var div = document.createElement("div");
				div.id = "favorite_edit_div_" + favoriteParentEn;
				div.classList.add("favorite_edit_items_div");
				favoriteEditDiv.appendChild(div);

				var favoriteEditParentDiv = document.getElementById(div.id);

				for (const enItem in favoriteDicts) {
					if (Object.hasOwnProperty.call(favoriteDicts, enItem)) {
						const zhItem = favoriteDicts[enItem];

						var newEditorItem = document.createElement("span");
						newEditorItem.classList.add("f_edit_item");
						newEditorItem.id = "f_edit_item_" + enItem;
						newEditorItem.dataset.item = enItem;
						newEditorItem.dataset.favorite_parent_en = favoriteParentEn;
						newEditorItem.dataset.favorite_parent_zh = favoriteParentZh;
						newEditorItem.title = enItem;

						var editorItemText = document.createTextNode(zhItem + " X");
						newEditorItem.appendChild(editorItemText);
						favoriteEditDiv.appendChild(newEditorItem);

						newEditorItem.addEventListener("click", function () {
							removeEditorItem(favoriteParentEn, enItem);
						});

						favoriteEditParentDiv.appendChild(newEditorItem);
					}
				}
			}
		}

	}

	function removeEditorItem(favoriteParentEn, enItem) {

		// 如果没有子项了，就删除包裹的div，以及对应的标题h4
		var item = document.getElementById("f_edit_item_" + enItem);
		var editDiv = item.parentNode;
		item.parentNode.removeChild(item);
		delete favoriteDict[favoriteParentEn][1][enItem];

		if (editDiv.childNodes.length == 0) {
			editDiv.parentNode.removeChild(editDiv);
			var h4 = document.getElementById("favorite_edit_h4_" + favoriteParentEn);
			h4.parentNode.removeChild(h4);
			delete favoriteDict[favoriteParentEn];
		}
	}

	function removeEditorParent(favoriteParentEn) {
		var h4 = document.getElementById("favorite_edit_h4_" + favoriteParentEn);
		h4.parentNode.removeChild(h4);
		var div = document.getElementById("favorite_edit_div_" + favoriteParentEn);
		div.parentNode.removeChild(div);
		delete favoriteDict[favoriteParentEn];
	}

	function editToFavorite() {
		// 隐藏保存和取消按钮，显示编辑和清空按钮，以及加入收藏按钮
		favoriteSave.style.display = "none";
		favoriteCancel.style.display = "none";
		favoriteEdit.style.display = "block";
		favoriteClear.style.display = "block";

		if (checkDictNull(searchItemDict)) {
			addFavoritesBtn.style.display = "none";
			addFavoritesDisabledBtn.style.display = "block";
		}
		else {
			addFavoritesBtn.style.display = "block";
			addFavoritesDisabledBtn.style.display = "none";
		}

		// 显示收藏列表
		favoriteListDiv.style.display = "block";

		// 隐藏并清空收藏编辑列表
		favoriteEditDiv.style.display = "none";
		favoriteEditDiv.innerHTML = "";

		// 展开折叠按钮
		updateFavoriteListBtnStatus();
	}

	// 收藏取消
	favoriteCancel.onclick = editToFavorite;

	// 收藏保存
	favoriteSave.onclick = function () {
		editToFavorite();
		// 编辑保存到本地
		setFavoriteDicts(favoriteDict);

		// 过滤掉已经删除的折叠的菜单
		var favoriteExend = getFavoriteListExpend();
		for (const i in favoriteExend) {
			if (Object.hasOwnProperty.call(favoriteExend, i)) {
				const extend = favoriteExend[i];
				if (!favoriteDict[extend]) {
					favoriteExend.remove(extend);
				}
			}
		}
		setFavoriteListExpend(favoriteExend);

		// 清空收藏列表，根据编辑生成收藏列表
		favoriteListDiv.innerHTML = "";

		// 更新收藏列表
		generalFavoriteListDiv(favoriteDict);

		// 更新折叠状态
		updateFavoriteExpend();

		// 编辑列表清空
		favoriteDict = {};

		// 更新收藏按钮
		updateFavoriteListBtnStatus();

		// 更新搜索项
		updateInputDict();
	}

	// 重新生成收藏列表 html
	function generalFavoriteListDiv(favoriteDict) {
		if (!checkDictNull(favoriteDict)) {
			// 新版收藏，只可能增加，原有的不变
			for (const favoriteParentEn in favoriteDict) {
				if (Object.hasOwnProperty.call(favoriteDict, favoriteParentEn)) {
					var items = favoriteDict[favoriteParentEn];
					var favoriteParentZh = items[0];
					var favoriteDicts = items[1];

					var h4 = document.createElement("h4");
					h4.id = "favorite_h4_" + favoriteParentEn;
					var h4text = document.createTextNode(favoriteParentZh);
					h4.appendChild(h4text);
					var spanExtend = document.createElement("span");
					spanExtend.dataset.category = favoriteParentEn;
					spanExtend.classList.add("favorite_extend");
					var spanExtendText = document.createTextNode("-");
					spanExtend.appendChild(spanExtendText);

					spanExtend.addEventListener("click", function () {
						favoriteExend(favoriteParentEn);
					});

					h4.appendChild(spanExtend);
					favoriteListDiv.appendChild(h4);


					var div = document.createElement("div");
					div.id = "favorite_div_" + favoriteParentEn;
					div.classList.add("favorite_items_div");
					favoriteListDiv.appendChild(div);

					var favoriteDiv = document.getElementById(div.id);
					for (const enItem in favoriteDicts) {
						if (Object.hasOwnProperty.call(favoriteDicts, enItem)) {
							const zhItem = favoriteDicts[enItem];

							var newFavoriteItem = document.createElement("span");
							newFavoriteItem.classList.add("c_item");
							newFavoriteItem.dataset.item = enItem;
							newFavoriteItem.dataset.favorite_parent_en = favoriteParentEn;
							newFavoriteItem.dataset.favorite_parent_zh = favoriteParentZh;
							newFavoriteItem.title = enItem;

							var itemText = document.createTextNode(zhItem);
							newFavoriteItem.appendChild(itemText);

							newFavoriteItem.addEventListener("click", function () {
								addItemToInput(favoriteParentEn, favoriteParentZh, enItem, zhItem);
							});

							favoriteDiv.appendChild(newFavoriteItem);
						}
					}
				}
			}
		}
	}

	// 收藏清空
	favoriteClear.onclick = function () {
		var confirmResult = confirm("是否清空本地收藏?");
		if (confirmResult) {
			clearFavoriteDicts();
			favoriteListDiv.innerHTML = "";
			// 更新收藏按钮
			updateFavoriteListBtnStatus();
			// 更新搜索项
			updateInputDict();
		}
	}


	//#endregion

	//#region [数据同步]

	// 页面重新激活数据同步，收藏信息更新、折叠信息更新
	window.onstorage = function (e) {
		if (e.key == dbCategoryListExpendKey) {
			// 标签折叠数据更新
			var newValue = JSON.parse(e.newValue ?? '[]');
			var oldValue = JSON.parse(e.oldValue ?? '[]');

			var expendBtns = document.getElementsByClassName("category_extend");
			if (newValue.length > oldValue.length) {
				// 新增折叠
				var expendDatas = getDiffSet(newValue, oldValue);
				for (const i in expendBtns) {
					if (Object.hasOwnProperty.call(expendBtns, i)) {
						const btn = expendBtns[i];
						var category = btn.dataset.category;
						if (expendDatas && expendDatas.indexOf(category) != -1) {
							btn.innerText = "+";
							var itemDiv = document.getElementById("items_div_" + category);
							itemDiv.style.display = "none";
						}
					}
				}
			}
			else {
				// 减少折叠
				var foldDatas = getDiffSet(oldValue, newValue);
				for (const i in expendBtns) {
					if (Object.hasOwnProperty.call(expendBtns, i)) {
						const btn = expendBtns[i];
						var category = btn.dataset.category;
						if (foldDatas && foldDatas.indexOf(category) != -1) {
							btn.innerText = "-";
							var itemDiv = document.getElementById("items_div_" + category);
							itemDiv.style.display = "block";
						}
					}
				}
			}
		}
		else if (e.key == dbFavoriteListExpendKey) {
			// 收藏折叠数据更新
			var newValue = JSON.parse(e.newValue ?? '[]');
			var oldValue = JSON.parse(e.oldValue ?? '[]');

			var expendBtns = document.getElementsByClassName("favorite_extend");
			if (newValue.length > oldValue.length) {
				// 新增折叠
				var expendDatas = getDiffSet(newValue, oldValue);
				for (const i in expendBtns) {
					if (Object.hasOwnProperty.call(expendBtns, i)) {
						const btn = expendBtns[i];
						var category = btn.dataset.category;
						if (expendDatas && expendDatas.indexOf(category) != -1) {
							btn.innerText = "+";
							var itemDiv = document.getElementById("favorite_div_" + category);
							itemDiv.style.display = "none";
						}
					}
				}
			}
			else {
				// 减少折叠
				var foldDatas = getDiffSet(oldValue, newValue);
				for (const i in expendBtns) {
					if (Object.hasOwnProperty.call(expendBtns, i)) {
						const btn = expendBtns[i];
						var category = btn.dataset.category;
						if (foldDatas && foldDatas.indexOf(category) != -1) {
							btn.innerText = "-";
							var itemDiv = document.getElementById("favorite_div_" + category);
							itemDiv.style.display = "block";
						}
					}
				}
			}
		}
		else if (e.key == dbFavoriteKey) {
			// 收藏折叠数据更新更改

			var newValue = JSON.parse(e.newValue ?? '{}');
			var oldValue = JSON.parse(e.oldValue ?? '{}');

			var newValueForAdd = JSON.parse(e.newValue ?? '{}');;
			var oldValueForAdd = JSON.parse(e.oldValue ?? '{}');;

			// oldValue 有 newValue 没有，减少
			var killItems = {};
			for (const parentEn in oldValue) {
				if (Object.hasOwnProperty.call(oldValue, parentEn)) {
					const keyItems = oldValue[parentEn];
					if (!newValue[parentEn]) {
						// 大项删除
						killItems[parentEn] = keyItems;
					}
					else {
						// 小项比较
						var subItems = keyItems[1];
						for (const enItem in subItems) {
							if (Object.hasOwnProperty.call(subItems, enItem)) {
								if (newValue[parentEn][1][enItem]) {
									delete oldValue[parentEn][1][enItem];
									if (checkDictNull(oldValue[parentEn][1])) {
										delete oldValue[parentEn][1];
									}
								}
							}
						}
						killItems[parentEn] = oldValue[parentEn];
					}
				}
			}

			for (const parentEn in killItems) {
				if (Object.hasOwnProperty.call(killItems, parentEn)) {
					const keyItems = killItems[parentEn];
					var favoriteItems = document.getElementById("favorite_div_" + parentEn).querySelectorAll("span");
					for (const i in favoriteItems) {
						if (Object.hasOwnProperty.call(favoriteItems, i)) {
							const span = favoriteItems[i];
							var dataItem = span.dataset.item;
							if (keyItems[1] && keyItems[1][dataItem]) {
								span.parentNode.removeChild(span);
							}
						}
					}
					var itemDiv = document.getElementById("favorite_div_" + parentEn);
					if (itemDiv.childNodes.length == 0) {
						itemDiv.parentNode.removeChild(itemDiv);
						var h4 = document.getElementById("favorite_h4_" + parentEn);
						h4.parentNode.removeChild(h4);
					}
				}
			}


			// newValueForAdd 有 oldValueForAdd 没有，新增
			var addItems = {};
			for (const parentEn in newValueForAdd) {
				if (Object.hasOwnProperty.call(newValueForAdd, parentEn)) {
					const keyItems = newValueForAdd[parentEn];
					if (!oldValueForAdd[parentEn]) {
						// 大项增加
						addItems[parentEn] = keyItems;
					}
					else {
						// 小项比较
						var subItems = keyItems[1];
						for (const enItem in subItems) {
							if (Object.hasOwnProperty.call(subItems, enItem)) {
								if (oldValueForAdd[parentEn][1][enItem]) {
									delete newValueForAdd[parentEn][1][enItem];
								}
							}
						}
						addItems[parentEn] = newValueForAdd[parentEn];
					}
				}
			}

			for (const parentEn in addItems) {
				if (Object.hasOwnProperty.call(addItems, parentEn)) {
					const keyItems = addItems[parentEn];
					var favoriteParentZh = keyItems[0];

					var h4 = document.getElementById("favorite_h4_" + parentEn);
					if (!h4) {
						var h4 = document.createElement("h4");
						h4.id = "favorite_h4_" + parentEn;
						var h4text = document.createTextNode(favoriteParentZh);
						h4.appendChild(h4text);
						var spanExtend = document.createElement("span");
						spanExtend.dataset.category = parentEn;
						spanExtend.classList.add("favorite_extend");
						var spanExtendText = document.createTextNode("-");
						spanExtend.appendChild(spanExtendText);

						spanExtend.addEventListener("click", function () {
							favoriteExend(parentEn);
						});

						h4.appendChild(spanExtend);
						favoriteListDiv.appendChild(h4);
					}

					var itemDiv = document.getElementById("favorite_div_" + parentEn);
					if (!itemDiv) {
						var div = document.createElement("div");
						div.id = "favorite_div_" + parentEn;
						div.classList.add("favorite_items_div");
						favoriteListDiv.appendChild(div);
						itemDiv = document.getElementById("favorite_div_" + parentEn);
					}

					var items = keyItems[1];
					for (const enItem in items) {
						if (Object.hasOwnProperty.call(items, enItem)) {
							const zhItem = items[enItem];

							var newFavoriteItem = document.createElement("span");
							newFavoriteItem.classList.add("c_item");
							newFavoriteItem.dataset.item = enItem;
							newFavoriteItem.dataset.favorite_parent_en = parentEn;
							newFavoriteItem.dataset.favorite_parent_zh = favoriteParentZh;
							newFavoriteItem.title = enItem;

							var itemText = document.createTextNode(zhItem);
							newFavoriteItem.appendChild(itemText);

							newFavoriteItem.addEventListener("click", function () {
								addItemToInput(parentEn, favoriteParentZh, enItem, zhItem);
							});

							itemDiv.appendChild(newFavoriteItem);
						}
					}
				}
			}


			// 强制收藏页面处于初始状态
			favoriteEdit.style.display = "block";
			favoriteClear.style.display = "block";
			favoriteSave.style.display = "none";
			favoriteCancel.style.display = "none";
			favoriteListDiv.style.display = "block";
			favoriteEditDiv.style.display = "none";

			// 更新收藏按钮
			updateFavoriteListBtnStatus();

			// 更新搜索项
			updateInputDict();
		}
	}

	//#endregion

	//#region [收藏数据导出、恢复]

	// 备份
	favoriteExport.onclick = function () {
		var dbfavoriteDict = getFavoriteDicts();
		if (checkDictNull(dbfavoriteDict)) {
			alert("导出前，请先收藏标签");
			return;
		}
		func_eh_ex(() => {
			saveJSON(dbfavoriteDict, `EH收藏数据备份_${getCurrentDate(2)}.json`);
		}, () => {
			saveJSON(dbfavoriteDict, `EX收藏数据备份_${getCurrentDate(2)}.json`);
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
				var favoriteDb = JSON.parse(fileContent);

				// 存储收藏信息
				setFavoriteDicts(favoriteDb);

				// 清空收藏列表
				favoriteListDiv.innerHTML = "";

				// 生成收藏列表
				generalFavoriteListDiv(favoriteDb);

				// 更新收藏折叠信息
				updateFavoriteExpend();

				// 更新收藏列表按钮状态
				updateFavoriteListBtnStatus();

				// 上传置空
				favoriteUploadFiles.value = "";
			}
		}
	}


	//#endregion
}

// 作品详情页面收藏功能
function detailPageFavorite() {

	// 详情页添加 标签谷歌机翻、清空选择按钮、加入收藏按钮、查询按钮
	var rightDiv = document.getElementById("gd5");

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
	if (getGoogleTranslateCategoryDetail() == 1) {
		translateCheckbox.setAttribute("checked", true);
	}

	translateDiv.appendChild(translateLabel);
	rightDiv.appendChild(translateDiv);

	translateCheckbox.addEventListener("click", translateClickDetail);

	var clearBtn = document.createElement("div");
	clearBtn.id = "div_ee8413b2_detail_clearBtn";
	var clearTxt = document.createTextNode("清空选择");
	clearBtn.appendChild(clearTxt);
	clearBtn.addEventListener("click", categoryCheckClear);

	rightDiv.appendChild(clearBtn);

	var addFavoriteBtn = document.createElement("div");
	addFavoriteBtn.id = "div_ee8413b2_detail_addFavoriteBtn";
	var addFavoriteTxt = document.createTextNode("加入收藏");
	addFavoriteBtn.appendChild(addFavoriteTxt);
	addFavoriteBtn.addEventListener("click", categoryAddFavorite);

	rightDiv.appendChild(addFavoriteBtn);

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

	// 详情页选中的标签信息
	var detailCheckedDict = {};

	// 翻译标签父级
	var tcList = document.getElementsByClassName("tc");
	for (const i in tcList) {
		if (Object.hasOwnProperty.call(tcList, i)) {
			const tc = tcList[i];
			var parentEn = tc.innerText.replace(":", "");
			var parentZh = detailParentData[parentEn] ?? parentEn;
			tc.innerText = `${parentZh}:`;
		}
	}

	// 翻译标签内容
	var aList = document.getElementById("taglist").querySelectorAll("a");
	for (const i in aList) {
		if (Object.hasOwnProperty.call(aList, i)) {
			const a = aList[i];

			// 查询 父级en 和 子级en
			var splitStr = a.id.split("ta_")[1].split(":");
			var parentEn = splitStr[0];

			var subEn;
			var parentId;
			if (splitStr.length == 2) {
				subEn = splitStr[1].replace(new RegExp(/(_)/g), " ");
				parentId = `td_${parentEn}:${subEn}`;
			} else {
				subEn = parentEn;
				parentEn = "temp";
				parentId = `td_${subEn}`;
			}

			var parentZh = detailParentData[parentEn] ?? parentEn;
			var subZh = subEn;

			// 翻译
			var itemInfo = subData[subEn];
			if (itemInfo) {
				subZh = itemInfo[0];
				a.innerText = subZh;
				a.title = `[${subEn}] ${itemInfo[1]}`;
			} else {
				a.title = subEn;
				a.classList.add("needTranslate");
			}

			a.dataset.parent_id = parentId;
			a.dataset.parent_en = parentEn;
			a.dataset.parent_zh = parentZh;
			a.dataset.sub_en = subEn;
			a.dataset.sub_zh = subZh;


			// 点击添加事件，附带颜色
			a.addEventListener("click", detailCategoryClick);
		}
	}

	// 判断一开始是否选中
	if (getGoogleTranslateCategoryDetail() == 1) {
		translateClickDetail();
	}

	// 标签选择事件
	function detailCategoryClick(e) {
		var dataset = e.target.dataset;
		var parentId = dataset.parent_id;
		var parentEn = dataset.parent_en;
		var parentZh = dataset.parent_zh;
		var subEn = dataset.sub_en;
		var subZh = dataset.sub_zh;


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


		if (!detailCheckedDict[parentEn]) {
			detailCheckedDict[parentEn] = [parentZh, {}];
		}
		if (!detailCheckedDict[parentEn][1][subEn]) {
			// 添加
			detailCheckedDict[parentEn][1][subEn] = subZh;
			parentDiv.classList.add("div_ee8413b2_category_checked");
		}
		else {
			// 移除
			delete detailCheckedDict[parentEn][1][subEn];
			// 子项如果清空了就删除父级
			if (checkDictNull(detailCheckedDict[parentEn][1])) {
				delete detailCheckedDict[parentEn];
			}
			parentDiv.classList.remove("div_ee8413b2_category_checked");
		}

		if (checkDictNull(detailCheckedDict)) {
			hideDetailBtn();
		}
		else {
			clearBtn.style.display = "block";
			addFavoriteBtn.style.display = "block";
			searchBtn.style.display = "block";
		}
	}

	function hideDetailBtn() {
		clearBtn.style.display = "none";
		addFavoriteBtn.style.display = "none";
		searchBtn.style.display = "none";
	}

	// 清空按钮
	function categoryCheckClear() {
		for (const parentEn in detailCheckedDict) {
			if (Object.hasOwnProperty.call(detailCheckedDict, parentEn)) {
				const keyItems = detailCheckedDict[parentEn];
				for (const enItem in keyItems[1]) {
					if (Object.hasOwnProperty.call(keyItems[1], enItem)) {
						var parentDiv = document.getElementById(`td_${parentEn}:${enItem.replace(new RegExp(/( )/g), "_")}`);
						parentDiv.classList.remove("div_ee8413b2_category_checked");
					}
				}
			}
		}

		detailCheckedDict = {};
		hideDetailBtn();
	}

	// 加入收藏
	function categoryAddFavorite() {
		addFavoriteBtn.innerText = "收藏中...";

		var favoriteDict = getFavoriteDicts();
		if (!favoriteDict) {
			favoriteDict = {};
		}

		var isChecked = document.getElementById("googleTranslateCheckbox").checked;
		var needTranslate = isChecked && !checkDictNull(translateDict);

		for (const parentEn in detailCheckedDict) {
			if (Object.hasOwnProperty.call(detailCheckedDict, parentEn)) {
				const keyItems = detailCheckedDict[parentEn];
				var parentZh = keyItems[0];

				// 大项是否存在
				if (!favoriteDict[parentEn]) {
					favoriteDict[parentEn] = [parentZh, {}];
				}

				// 修改小项
				for (const enItem in keyItems[1]) {
					if (Object.hasOwnProperty.call(keyItems[1], enItem)) {
						var zhItem = keyItems[1][enItem];
						if (!favoriteDict[parentEn][1][enItem]) {
							if (enItem == zhItem && needTranslate) {
								zhItem = translateDict[enItem] ?? zhItem;
							}
							favoriteDict[parentEn][1][enItem] = zhItem;
						}
					}
				}

				// 保存修改
				setFavoriteDicts(favoriteDict);

			}
		}

		setTimeout(function () {
			addFavoriteBtn.innerText = "完成 √";
		}, 250);
		setTimeout(function () {
			addFavoriteBtn.innerText = "加入收藏";
		}, 500);

	}

	// 搜索
	function categorySearch() {
		var searchArray = [];
		for (const parentEn in detailCheckedDict) {
			if (Object.hasOwnProperty.call(detailCheckedDict, parentEn)) {
				const keyItems = detailCheckedDict[parentEn];

				for (const enItem in keyItems[1]) {
					if (Object.hasOwnProperty.call(keyItems[1], enItem)) {
						searchArray.push(`"${parentEn}:${enItem}"`);
					}
				}
			}
		}

		var searchLink = `https://exhentai.org/?f_search=${searchArray.join("+")}`;
		const w = window.open('about:blank');
		w.location.href = searchLink;
	}

}



// 头部菜单翻译汉化
topMenuTranslateZh();

// 根据地址链接判断当前是首页还是详情页
if (window.location.pathname.indexOf("/g/") != -1) {
	// 详情页
	detailPageTranslate();
	detailPageFavorite();
}
else if (window.location.pathname.length == 1) {
	// 首页
	mainPageTranslate();
	mainPageCategory();
}