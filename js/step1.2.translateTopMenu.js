//#region step1.2.translateTopMenu.js 头部菜单翻译

// TODO 我的上传按钮 域名添加

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
					(pathname == '/toplist.php' && a.innerText == 'Toplists') ||
					(pathname == '/bounty.php' && a.innerText == 'Bounties') ||
					(pathname == '/news.php' && a.innerText == 'News')
				)) {
				a.parentNode.classList.add('headMenu_check');
				isFoundCheck = true;
			}

			a.innerText = fontMenusData[a.innerText] ?? a.innerText;
		}
	}
}

//#endregion