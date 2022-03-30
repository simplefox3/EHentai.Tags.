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

window.onload = function () {
	// 全部类别按钮
	var categoryAllDiv = document.getElementById("category_all_div");
	var categoryList = document.getElementById("category_list");
	categoryAllDiv.style.display = "block";
	categoryList.style.display = "block";

	tagDataDispose();
}