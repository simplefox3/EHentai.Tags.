//#region step4.2.detailbtn.js 详情页主要按钮功能

// 详情页选中的标签信息
var detailCheckedDict = {};

// 谷歌机翻
function translateClickDetail() {
    var isChecked = translateClick();

    // 更新存储
    var settings_translateDetailPageTags = {
        item: table_Settings_key_TranslateDetailPageTags,
        value: isChecked
    };
    update(table_Settings, settings_translateDetailPageTags, () => { }, () => { });
}

// 清空选择
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

function hideDetailBtn() {
    clearBtn.style.display = "none";
    addFavoriteBtn.style.display = "none";
    searchBtn.style.display = "none";
}

// 加入收藏
function categoryAddFavorite() {
    //TODO
}

// 搜索
function categorySearch() {
    //TODO
}



function detailPageFavorite() {
    // 右侧操作列
    var rightDiv = document.getElementById("gd5");

    // 标签谷歌机翻按钮
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
    read(table_Settings, table_Settings_key_TranslateDetailPageTags, result => {
        if (result && result.value) {
            translateCheckbox.setAttribute("checked", true);
        }
    }, () => { });

    translateDiv.appendChild(translateLabel);
    rightDiv.appendChild(translateDiv);
    translateCheckbox.addEventListener("click", translateClickDetail);

    // 清空选择按钮
    var clearBtn = document.createElement("div");
    clearBtn.id = "div_ee8413b2_detail_clearBtn";
    var clearTxt = document.createTextNode("清空选择");
    clearBtn.appendChild(clearTxt);
    clearBtn.addEventListener("click", categoryCheckClear);
    rightDiv.appendChild(clearBtn);

    // 加入收藏按钮
    var addFavoriteBtn = document.createElement("div");
    addFavoriteBtn.id = "div_ee8413b2_detail_addFavoriteBtn";
    var addFavoriteTxt = document.createTextNode("加入收藏");
    addFavoriteBtn.appendChild(addFavoriteTxt);
    addFavoriteBtn.addEventListener("click", categoryAddFavorite);
    rightDiv.appendChild(addFavoriteBtn);

    // 查询按钮
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

    
}

//#endregion