//#region step1.2.translateTopMenu.js 头部菜单翻译
function topMenuTranslateZh() {
	var menus = document.getElementById("nb").querySelectorAll("a");
	for (const i in menus) {
		if (Object.hasOwnProperty.call(menus, i)) {
			const a = menus[i];
			a.innerText = fontMenusData[a.innerText] ?? a.innerText;
		}
	}
}

//#endregion