//#region step3.7.search.js 搜索框功能

// 进入页面，根据地址栏信息生成搜索栏标签
var f_searchs = GetQueryString("f_search");
if (f_searchs) {
    var searchArray = f_searchs.replace(/\"/g, "").split("+");
    for (const i in searchArray) {
        if (Object.hasOwnProperty.call(searchArray, i)) {

            var items = searchArray[i].replace("'", "");

            // 从收藏中查询，看是否存在
            var itemArray = items.split(":");
            if (itemArray.length == 2) {
                var parentEn = itemArray[0];
                var subEn = itemArray[1];

                readByIndex(table_fetishListSubItems, table_fetishListSubItems_index_subEn, subEn, fetishResult => {
                    var fetishData = fetishResult.value;
                    addItemToInput(fetishData.parent_en, fetishData.parent_zh, fetishData.sub_en, fetishData.sub_zh);
                }, () => {
                    readByIndex(table_EhTagSubItems, table_EhTagSubItems_index_subEn, subEn, ehTagResult => {
                        var ehTagData = ehTagResult.value;
                        addItemToInput(ehTagData.parent_en, ehTagData.parent_zh, ehTagData.sub_en, ehTagData.sub_zh);
                    }, () => { });
                })


                // if (favoriteDict[parentEn][1][subEn]) {
                //     var parentZh = favoriteDict[parentEn][0];
                //     var subZh = favoriteDict[parentEn][1][subEn];
                //     addItemToInput(parentEn, parentZh, subEn, subZh);
                // }
                // else {
                //     addItemToInput(parentEn, parentEn, subEn, subEn);
                // }
            }
            else {
                // // 普通搜索
                // var enItem = items;
                // var valueItems = subData[enItem];
                // if (valueItems) {
                //     addItemToInput("localFavorites", "本地", enItem, valueItems[0]);
                // } else {
                //     addItemToInput("localFavorites", "本地", enItem, enItem);
                // }
            }
        }
    }
}


// 删除搜索框子项
function removeSearchItem() { }

//#endregion