//#region step3.7.search.js 搜索框功能

// 进入页面，根据地址栏信息生成搜索栏标签
var f_searchs = GetQueryString("f_search");
if (f_searchs) {
    var searchArray = f_searchs.replace(/\"/g, "").split("+");

    for (const i in searchArray) {
        if (Object.hasOwnProperty.call(searchArray, i)) {

            var items = searchArray[i].replace("'", "");
            var itemArray = items.split(":");
            if (itemArray.length == 2) {
                var parentEn = itemArray[0];
                var subEn = itemArray[1];
                // 从EhTag中查询，看是否存在
                readByIndex(table_EhTagSubItems, table_EhTagSubItems_index_subEn, subEn, ehTagData => {
                    addItemToInput(ehTagData.parent_en, ehTagData.parent_zh, ehTagData.sub_en, ehTagData.sub_zh);
                }, () => { });
            }
            else {
                // 从恋物列表中查询，看是否存在
                readByIndex(table_fetishListSubItems, table_fetishListSubItems_index_subEn, items, fetishData => {
                    addItemToInput(fetishData.parent_en, fetishData.parent_zh, fetishData.sub_en, fetishData.sub_zh);
                }, () => {
                    // 用户自定义搜索关键字
                    addItemToInput("userCustom", "自定义", items, items);
                });
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
            var parentEn = item.parentEn;
            var subEn = item.enItem;
            if (fetishParentArray.indexOf(parentEn) != -1) {
                enItemArray.push(`"${subEn}"`);
            }
            else if (parentEn == "userCustom") {
                enItemArray.push(`"${subEn}"`);
            } else {
                enItemArray.push(`"${parentEn}:${subEn}"`);
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
            var parentEn = item.parentEn;
            var subEn = item.enItem;
            if (parentEn == "userCustom") {
                enItemArray.push(`"${subEn}"`);
            } else if (enItemArray.indexOf(subEn) == -1) {
                enItemArray.push(`"${subEn}"`);
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
    var foundKeys = {};
    // 清空候选项
    userInputRecommendDiv.innerHTML = "";
    userInputRecommendDiv.style.display = "block";

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
                    addItemToInput(item.parent_en, item.parent_zh, item.sub_en, item.sub_zh);
                    userInputRecommendDiv.innerHTML = "";
                    userInput.value = "";
                    userInput.focus();
                });
                userInputRecommendDiv.appendChild(commendDiv);
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

}

// TODO 候选透光

//#endregion