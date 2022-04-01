//#region step3.1.frontTranslate.js 首页谷歌翻译

var translateDict = {};

// 谷歌翻译:标签，通用方法
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

// 首页谷歌翻译：标签
function translateClickMainPage() {
	var isChecked = translateClick();

	// 更新存储
	var settings_translateFrontPageTags = {
		item: table_settings_key_TranslateFrontPageTags,
		value: isChecked
	};
	update(table_Settings, settings_translateFrontPageTags, () => { }, () => { });
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
	const dropData = {
		"Minimal": "标题 + 悬浮图",
		"Minimal+": "标题 + 悬浮图 + 账号收藏标签",
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
	read(table_Settings, table_settings_key_TranslateFrontPageTags, result => {
		if (result && result.value) {
			translateCheckbox.setAttribute("checked", true);
		}
	}, () => { });

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

					getSubZh(subEn, subZh => {
						item.innerText = `${parentZh}:${subZh}`;
					}, () => {
						item.classList.add("needTranslate");
					});
				}
			}
			else {
				// 只有子标签
				var subEn = innerText;
				getSubZh(subEn, subZh => {
					item.innerText = subZh;
				}, () => {
					item.classList.add("needTranslate");
				});
			}
		}
	}
	var gtl = document.getElementsByClassName("gtl");
	for (const i in gtl) {
		if (Object.hasOwnProperty.call(gtl, i)) {
			const item = gtl[i];
			var subEn = item.innerText;
			getSubZh(subEn, subZh => {
				item.innerText = subZh;
			}, () => {
				item.classList.add("needTranslate");
			});
		}
	}

	function getSubZh(subEn, func_hasData, func_none) {
		// 先从 恋物父子表尝试取出数据，如果不能找到再从EhTag表取数据
		readByIndex(table_fetishListSubItems, table_fetishListSubItems_index_subEn, subEn, result1 => {
			func_hasData(result1.sub_zh);
		}, () => {
			readByIndex(table_EhTagSubItems, table_EhTagSubItems_index_subEn, subEn, result2 => {
				func_hasData(result2.sub_zh);
			}, () => { func_none(); });
		});
	}

	// 判断一开始是否选中
	read(table_Settings, table_settings_key_TranslateFrontPageTags, result => {
		if (result && result.value) {
			translateClickMainPage();
		}
	}, () => { });

}

//#endregion