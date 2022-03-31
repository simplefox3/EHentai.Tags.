// 主方法

// 根据地址链接判断当前是首页还是详情页
if (window.location.pathname.indexOf("/g/") != -1) {
	// 详情页
	// detailPageTranslate();
	// detailPageFavorite();
}
else if (window.location.pathname.length == 1) {
	// 首页
	// mainPageTranslate();
	// mainPageCategory();
}

// 首页逻辑
window.onload = function () {
	// 全部类别按钮
	var categoryAllDiv = document.getElementById("category_all_div");
	var categoryList = document.getElementById("category_list");
	categoryAllDiv.style.display = "block";
	categoryList.style.display = "block";

	// 初始化用户配置信息
	initUserSettings(() => {
		console.log('初始化用户配置信息完毕');

		// 头部菜单汉化
		//topMenuTranslateZh();

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