//#region main.js
// 主方法

// 头部菜单汉化
topMenuTranslateZh();

// 根据地址链接判断当前是首页还是详情页
if (window.location.pathname.indexOf("/g/") != -1) {
	// 详情页
	detailPage();
}
else if (window.location.pathname.length == 1) {
	// 首页
	mainPageCategory();
}

function mainPageCategory() {

	// 从localstroge 读取，头部隐藏折叠
	frontPageTopStyleStep01();

	// 首页框架搭建
	frontPageHtml();

	// TODO 消息通知提前，只要数据改变就应该马上通知，方便快速其他页面快速反应	
	// 初始化用户配置信息
	initUserSettings(() => {
		console.log('初始化用户配置信息完毕');

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
								read(table_EhTagSubItems, items, ehTagData => {
									addItemToInput(ehTagData.parent_en, ehTagData.parent_zh, ehTagData.sub_en, ehTagData.sub_zh, ehTagData.sub_desc);
								}, () => {
									addItemToInput(parentEn, subEn, subEn, subEn, '');
								});
							}
							else {
								// 从恋物列表中查询，看是否存在
								readByIndex(table_fetishListSubItems, table_fetishListSubItems_index_subEn, itemArray[0], fetishData => {
									addItemToInput(fetishData.parent_en, fetishData.parent_zh, fetishData.sub_en, fetishData.sub_zh, fetishData.sub_desc);
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
						favoritesListHtml += `<span class="c_item c_item_favorite" title="[${item.sub_en}] ${item.sub_desc}" data-item="${item.sub_en}" 
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
					console.log('批量添加本地收藏表完成');
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
				// try {
				console.log(e);
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
				}
				// } catch (error) {
				//     removeDbSyncMessage();
				// }
			}

			// 头部搜索折叠隐藏
			function updatePageTopVisible() {
				indexDbInit(() => {
					read(table_Settings, table_Settings_key_OldSearchDiv_Visible, result => {
						var searchBoxDiv = document.getElementById("searchbox");
						var hiddenOldDiv = document.getElementById("div_old_hidden_btn");
						var showOldDiv = document.getElementById("div_old_show_btn");
						if (result && result.value) {
							// 显示
							searchBoxDiv.children[0].style.display = "block";
							hiddenOldDiv.style.display = "block";
							showOldDiv.style.display = "none";
						} else {
							// 隐藏
							searchBoxDiv.children[0].style.display = "none";
							hiddenOldDiv.style.display = "none";
							showOldDiv.style.display = "block";
						}
						removeDbSyncMessage();
					}, () => {
						removeDbSyncMessage();
					});
				});
			}

			// 本地列表更新
			function updatePageCategoryList() {

				removeDbSyncMessage();
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

				removeDbSyncMessage();
			}

			// 本地收藏折叠更新
			function updatePageFavoriteListExtend() {

				removeDbSyncMessage();
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

			//#endregion


		});
	});



}

function detailPage() {
	// 初始化用户配置信息
	initUserSettings(() => {
		// 保证完整数据
		tagDataDispose(() => {
			detailPageTranslate();
			detailPageFavorite();
		});

		//#region step5.2.dataSync.detailPage.js 详情页数据同步

		window.onstorage = function (e) {
			// try {
			console.log(e);
			switch (e.newValue) {
				case sync_googleTranslate_detailPage_title:
					updateGoogleTranslateDetailPageTitle();
					break;
			}
			// } catch (error) {
			//     removeDbSyncMessage();
			// }
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