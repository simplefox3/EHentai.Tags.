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