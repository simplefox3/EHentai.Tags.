//#region step3.3.frontHtml.js 首页HTML 

// 首页代码
const category_html = `
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