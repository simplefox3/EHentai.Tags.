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
		background-color: #e3e0d1;
		max-height: 500px;
		overflow-y: scroll;
		position: relative;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend .category_user_input_recommend_items {
		font-size: 10px;
		cursor: pointer;
		padding: 2px 5px;
		height: 20px;
    	line-height: 20px;
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
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar-track,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar-track,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar-track,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar-track {
		background-color: #cdcaba;
		border-radius: 10px;
	}
	
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
		height: 20px;
    	line-height: 20px;
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
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar {
		width: 10px;
		height: 1px;
	}
	
	#div_ee8413b2 #category_search_input #category_user_input_recommend::-webkit-scrollbar-track,
	#div_ee8413b2 #category_all_div #category_list::-webkit-scrollbar-track,
	#div_ee8413b2 #category_favorites_div #favorites_list::-webkit-scrollbar-track,
	#div_ee8413b2 #category_favorites_div #favorites_edit_list::-webkit-scrollbar-track {
		background-color: #2d2e32;
		border-radius: 10px;
	}
	
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