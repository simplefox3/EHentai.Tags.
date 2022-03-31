/// 获取标签数据

//#region 恋物数据和ehTag数据
function getFetishListGitHubReleaseVersion(func) {
    var httpRequest = new XMLHttpRequest();
    var url = `https://api.github.com/repos/SunBrook/ehWiki.fetishListing.translate.zh_CN/branches/master`;
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            var version = json.commit.sha;
            func(version);
        }
    }
}

function getEhTagGitHubReleaseVersion(func) {
    var httpRequest = new XMLHttpRequest();
    var url = `https://api.github.com/repos/EhTagTranslation/DatabaseReleases/branches/master`;
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            var version = json.commit.sha;
            func(version);
        }
    }
}

function getFetishListTranslate(version, func) {
    var httpRequest = new XMLHttpRequest();
    var url = `https://cdn.jsdelivr.net/gh/SunBrook/ehWiki.fetishListing.translate.zh_CN@${version}/fetish.oneLevel.withoutLang.searchKey.json`;
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            func(json);
        }
    }
}

function getEhTagTranslate(version, func) {
    var httpRequest = new XMLHttpRequest();
    var url = `https://cdn.jsdelivr.net/gh/EhTagTranslation/DatabaseReleases@${version}/db.text.json`;
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            func(json);
        }
    }
}
//#endregion


//#region indexdb 模块

var request = window.indexedDB.open("EXH_DYZYFTS", 1);
var db;

// 设置表
const table_Settings = "t_settings";
const table_Settings_key_FetishListVersion = "f_fetishListVersion";
const table_Settings_key_EhTagVersion = "f_ehTagVersion";
const table_Settings_key_FetishList_ParentEnArray = "f_fetish_parentEnArray";
const table_Settings_key_EhTag_ParentEnArray = "f_ehTag_parentEnArray";
const table_Settings_key_FetishList_Html = "f_fetishListHtml";
const table_Settings_key_EhTag_Html = "f_ehTagHtml";
const table_Settings_key_CategoryList_Extend = "f_categoryListExtend";
const table_Settings_key_FavoriteList_Extend = "f_favoriteListExtend";
const table_Settings_key_OldSearchDiv_Visible = "f_oldSearchDivVisible";
const table_settings_key_TranslateFrontPageTags = "f_translateFrontPageTags";
const table_Settings_key_TranslateDetailPageTags = "f_translateDetailPageTags";
const table_Settings_key_TranslateFrontPageTitles = "f_translateFrontPageTitles";
const table_Settings_key_TranslateDetailPageTitles = "f_translateDetailPageTitles";


// fetishList 父子信息表
const table_fetishListSubItems = "t_fetishListSubItems";
const table_fetishListSubItems_key = "ps_en";

// EhTag 父子信息表
const table_EhTagSubItems = "t_ehTagSubItems";
const table_EhTagSubItems_key = "ps_en";

function indexDbInit(func_start_use) {
    if (request.readyState == "done") {
        db = request.result;
        func_start_use();
    } else {
        request.onsuccess = function () {
            db = request.result;
            console.log("数据库打开成功", db);
            func_start_use();
        }
    }
}

request.onerror = function (event) {
    console.log("数据库打开报错", event);
}

request.onupgradeneeded = function (event) {
    db = event.target.result;
    console.log("升级数据库", db);

    // 对象仓库 Settings
    // 
    // EhTag子菜单

    // 设置表
    // 包含：FetishList版本号、父子数据、父标签、页面Html
    // 包含：EhTag版本号、总数据、父标签、页面Html
    if (!db.objectStoreNames.contains(table_Settings)) {
        objectStore = db.createObjectStore(table_Settings, { keyPath: 'item' });
    }

    // FetishList 父子标签表
    if (!db.objectStoreNames.contains(table_fetishListSubItems)) {
        objectStore = db.createObjectStore(table_fetishListSubItems, { keyPath: table_fetishListSubItems_key });
        // objectStore.createIndex('parent_en', 'parent_en', { unique: false });
        // objectStore.createIndex('parent_zh', 'parent_zh', { unique: false });
        // objectStore.createIndex('sub_en', 'sub_en', { unique: false });
        // objectStore.createIndex('sub_zh', 'sub_zh', { unique: false });
        objectStore.createIndex('search_key', 'search_key', { unique: true });
    }

    // EhTag 父子标签表
    if (!db.objectStoreNames.contains(table_EhTagSubItems)) {
        objectStore = db.createObjectStore(table_EhTagSubItems, { keyPath: table_EhTagSubItems_key });
        // objectStore.createIndex('parent_en', 'parent_en', { unique: false });
        // objectStore.createIndex('parent_zh', 'parent_zh', { unique: false });
        // objectStore.createIndex('sub_en', 'sub_en', { unique: false });
        // objectStore.createIndex('sub_zh', 'sub_zh', { unique: false });
        objectStore.createIndex('search_key', 'search_key', { unique: true });
    }
}

function read(tableName, key, func_success, func_error) {
    var transaction = db.transaction(tableName);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.get(key);

    request.onerror = function (event) {
        console.log('读取事务失败', event);
        func_error(event);
    }

    request.onsuccess = function (event) {
        func_success(request.result);
    }
}

function readAll(tableName, func_success, func_end) {
    var objectStore = db.transaction(tableName).objectStore(tableName);
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            func_success(cursor.key, cursor.value);
            cursor.continue();
        } else {
            console.log('没有更多数据了');
            func_end();
        }
    }
}

function readByIndex(tableName, indexName, indexValue, func_success, func_none) {
    var transaction = db.transaction([tableName], 'readonly');
    var store = transaction.objectStore(tableName);
    var index = store.index(indexName);
    var request = index.get(indexValue);
    request.onsuccess = function (e) {
        var result = e.target.result;
        if (result) {
            func_success(result);
        } else {
            console.log('没找到');
            func_none();
        }
    }
}

function readByCursorIndex(tableName, indexName, indexValue, func_success) {
    const IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
    var transaction = db.transaction([tableName], 'readonly');
    var store = transaction.objectStore(tableName);
    var index = store.index(indexName);
    var c = index.openCursor(IDBKeyRange.only(indexValue));
    var data = [];
    c.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            data.push(cursor.value);
            cursor.continue();
        }
        else {
            func_success(data);
        }
    }

}

function fuzzySearch(tableName, field, keyword, func_success) {
    var objectStore = db.transaction(tableName).objectStore(tableName);
    const data = [];
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            if (cursor.value[field].indexOf(keyword) != -1) {
                data.push(cursor.value);
            }
            cursor.continue;
        } else {
            console.log('没有更多数据了');
            func_success(data);
        }
    }
}

function add(tableName, data, func_success, func_error) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .add(data);

    request.onsuccess = function (event) {
        console.log('数据写入成功', event);
        func_success(event);
    }

    request.onerror = function (event) {
        console.log('数据写入失败', event);
        func_error(event);
    }
}

function batchAdd(tableName, keyName, dataList, count, func_compelete) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName);

    var index = 0;
    for (const key in dataList) {
        if (Object.hasOwnProperty.call(dataList, key)) {
            const item = dataList[key];
            item[keyName] = key;
            request.add(item);
            index++;
        }
    }

    var t = setInterval(() => {
        if (count == index) {
            t && clearInterval(t);
            func_compelete();
        }
    }, 10);
}

function update(tableName, data, func_success, func_error) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .put(data);

    request.onsuccess = function (event) {
        console.log("数据更新成功", event);
        func_success();
    }

    request.onerror = function (event) {
        console.log("数据更新失败");
        func_error(event);
    }
}

function remove(tableName, key, func_success, func_error) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .delete(key);
    request.onsuccess = function (event) {
        console.log("数据删除成功", event);
        func_success();
    }
    request.onerror = function (event) {
        console.log('数据删除失败', event);
        func_error(event);
    }
}

function checkTableEmpty(tableName, func_empty, func_hasData) {
    var transaction = db.transaction(tableName);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.count();

    request.onsuccess = function (event) {
        if (request.result == 0) {
            // 数量为空
            func_empty();
        } else {
            // 存在数据
            func_hasData();
        }
    }
}

function checkFieldEmpty(tableName, filedName, func_empty, func_hasData) {
    var transaction = db.transaction(tableName);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.get(filedName);

    request.onsuccess = function (event) {
        if (!request.result) {
            // 数据为空
            func_empty();
        } else {
            // 存在数据
            func_hasData();
        }
    }
}

function clearTable(tableName, func_clear) {
    var transaction = db.transaction(tableName);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.clear();
    request.onsuccess = function (event) {
        func_clear();
    }
}
//#endregion

function fetishListDataInit(update_func, local_func) {
    // fetishList 获取本地版本号
    read(table_Settings, table_Settings_key_FetishListVersion, localVersion => {
        getFetishListGitHubReleaseVersion(version => {
            // 和本地的版本号进行比较，如果不同就进行更新
            if (!localVersion || version != localVersion.value) {
                getFetishListTranslate(version, json => {
                    update_func(json);
                    // 更新版本号
                    var settings_fetishList_version = {
                        item: table_Settings_key_FetishListVersion,
                        value: version
                    };
                    update(table_Settings, settings_fetishList_version, () => { }, error => { });
                });
            } else {
                local_func();
            }
        });
    }, error => {
        console.log('error', error);
    })
}

function ehTagDataInit(update_func, local_func) {
    // Ehtag 获取本地版本号
    read(table_Settings, table_Settings_key_EhTagVersion, localVersion => {
        getEhTagGitHubReleaseVersion(version => {
            // 和本地的版本号进行比较，如果不同就进行更新
            if (!localVersion || version != localVersion.value) {
                getEhTagTranslate(version, json => {
                    update_func(json.data);
                    // 更新版本号
                    var settings_ehTag_version = {
                        item: table_Settings_key_EhTagVersion,
                        value: version
                    };
                    update(table_Settings, settings_ehTag_version, () => { }, error => { });
                });
            } else {
                local_func();
            }
        });

    }, error => {
        console.log('error', error);
    });
}

// 验证数据完整性
function checkDataIntact(func_compelete) {
    // 如果数据表数据为空，则清空存储数据

    var complete1 = false;
    var complete2 = false;
    var complete3 = false;
    var complete4 = false;

    checkTableEmpty(table_fetishListSubItems, () => {
        // 为空
        remove(table_Settings, table_Settings_key_FetishListVersion, () => { complete1 = true; }, () => { complete1 = true; });
    }, () => {
        // 存在数据
        complete1 = true;
    });
    checkTableEmpty(table_EhTagSubItems, () => {
        // 为空
        remove(table_Settings, table_Settings_key_EhTagVersion, () => { complete2 = true; }, () => { complete2 = true; });
    }, () => {
        // 存在数据
        complete2 = true;
    });

    checkFieldEmpty(table_Settings, table_Settings_key_FetishList_Html, () => {
        // 为空
        remove(table_Settings, table_Settings_key_FetishListVersion, () => { complete3 = true; }, () => { complete3 = true; });
    }, () => {
        // 存在数据
        complete3 = true;
    });
    checkFieldEmpty(table_Settings, table_Settings_key_EhTag_Html, () => {
        // 为空
        remove(table_Settings, table_Settings_key_EhTagVersion, () => { complete4 = true; }, () => { complete4 = true; });
    }, () => {
        // 存在数据
        complete4 = true;
    });

    var t = setInterval(() => {
        if (complete1 && complete2 && complete3 && complete4) {
            t && clearInterval(t);
            func_compelete();
        }
    }, 60);
}

// 准备关键数据
function tagDataDispose(func_compelete) {
    // 获取数据
    indexDbInit(() => {

        // 验证数据完整性
        checkDataIntact(() => {

            var complete1 = false;
            var complete2 = false;
            var complete3 = false;
            var complete4 = false;
            var complete5 = false;
            var complete6 = false;

            // 获取并更新恋物的父子项、父级信息
            fetishListDataInit(newData => {

                // 批量添加父子项
                batchAdd(table_fetishListSubItems, table_fetishListSubItems_key, newData.data, newData.count, () => {
                    complete1 = true;
                    console.log('批量添加完成');
                });

                // 更新父级信息
                var settings_fetishList_parentEnArray = {
                    item: table_Settings_key_FetishList_ParentEnArray,
                    value: newData.parent_en_array
                };
                update(table_Settings, settings_fetishList_parentEnArray, () => { complete2 = true; }, error => { complete2 = true; });

                // 生成页面 html，并保存
                var categoryFetishListHtml = ``;
                var lastParentEn = '';
                for (const i in newData.data) {
                    if (Object.hasOwnProperty.call(newData.data, i)) {
                        const item = newData.data[i];
                        if (item.parent_en != lastParentEn) {
                            if (lastParentEn != '') {
                                categoryFetishListHtml += `</div>`;
                            }
                            lastParentEn = item.parent_en;
                            // 新建父级
                            categoryFetishListHtml += `<h4>${item.parent_zh}<span data-category="${item.parent_en}" class="category_extend">-</span></h4>`;
                            categoryFetishListHtml += `<div id="items_div_${item.parent_en}" class="category_items_div">`;
                        }

                        // 添加子级
                        categoryFetishListHtml += `<span class="c_item" data-item="${item.sub_en}" data-favorite_parent_en="${item.parent_en}" data-favorite_parent_zh="${item.parent_zh}" title="[${item.sub_en}] ${item.sub_desc}">${item.sub_zh}</span>`;
                    }
                }
                if (categoryFetishListHtml != ``) {
                    categoryFetishListHtml += `</div>`;
                }

                // 存储恋物列表Html
                var settings_fetish_html = {
                    item: table_Settings_key_FetishList_Html,
                    value: categoryFetishListHtml
                };
                update(table_Settings, settings_fetish_html, () => { complete3 = true; }, error => { complete3 = true; });

                var category_list_fetishList = document.getElementById("category_list_fetishList");
                category_list_fetishList.innerHTML = categoryFetishListHtml;

            }, () => {
                complete1 = true;
                complete2 = true;
                complete3 = true;
                console.log('fet', "没有新数据");
            });

            // 获取并更新EhTag的父子项、父级信息
            ehTagDataInit(newData => {
                // 更新本地数据库 indexDB
                // 存储完成之后，更新版本号

                // 需要过滤的项
                var filterParents = ["rows", "reclass"];

                var psDict = {};
                var psDictCount = 0;
                var parentEnArray = [];

                for (const index in newData) {
                    if (Object.hasOwnProperty.call(newData, index)) {
                        // var example = { ps_en: "male:bo", search_key: "male,男性,bo,波", parent_en: "male", parent_zh: "男性", sub_en: "bo", sub_zh: "波", sub_desc: "波波" };

                        const element = newData[index];
                        var parent_en = element.namespace;
                        if (filterParents.indexOf(parent_en) != -1) continue;
                        parentEnArray.push(parent_en);

                        var parent_zh = element.frontMatters.name;

                        var subItems = element.data;
                        for (const sub_en in subItems) {
                            if (Object.hasOwnProperty.call(subItems, sub_en)) {
                                const subItem = subItems[sub_en];
                                var sub_zh = subItem.name;
                                var sub_desc = subItem.intro;
                                var search_key = `${parent_en},${parent_zh},${sub_en},${sub_zh}`;
                                var ps_en = `${parent_en}:${sub_en}`;
                                psDict[ps_en] = { search_key, parent_en, parent_zh, sub_en, sub_zh, sub_desc };
                                psDictCount++;
                            }
                        }
                    }
                }

                // 批量添加父子项
                batchAdd(table_EhTagSubItems, table_EhTagSubItems_key, psDict, psDictCount, () => {
                    complete4 = true;
                    console.log("批量添加完成");
                });

                var settings_ehTag_parentEnArray = {
                    item: table_Settings_key_EhTag_ParentEnArray,
                    value: parentEnArray
                };

                // 更新父级信息
                update(table_Settings, settings_ehTag_parentEnArray, () => { complete5 = true; }, error => { complete5 = true; });

                // 生成页面 html
                var categoryEhTagHtml = ``;
                var lastParentEn = '';
                for (const i in psDict) {
                    if (Object.hasOwnProperty.call(psDict, i)) {
                        const item = psDict[i];
                        if (item.parent_en != lastParentEn) {
                            if (lastParentEn != '') {
                                categoryEhTagHtml += `</div>`;
                            }
                            lastParentEn = item.parent_en;
                            // 新建父级
                            categoryEhTagHtml += `<h4>${item.parent_zh}<span data-category="${item.parent_en}" class="category_extend">-</span></h4>`;
                            categoryEhTagHtml += `<div id="items_div_${item.parent_en}" class="category_items_div">`;
                        }

                        // 添加子级
                        categoryEhTagHtml += `<span class="c_item" data-item="${item.sub_en}" data-favorite_parent_en="${item.parent_en}" data-favorite_parent_zh="${item.parent_zh}" title="[${item.sub_en}] ${item.sub_desc}">${item.sub_zh}</span>`;
                    }
                }
                if (categoryEhTagHtml != ``) {
                    categoryEhTagHtml += `</div>`;
                }

                // 存储页面 html
                var settings_ehTag_html = {
                    item: table_Settings_key_EhTag_Html,
                    value: categoryEhTagHtml
                };
                update(table_Settings, settings_ehTag_html, () => { complete6 = true; }, error => { complete6 = true; });

                var category_list_ehTag = document.getElementById("category_list_ehTag");
                category_list_ehTag.innerHTML = categoryEhTagHtml;

            }, () => {
                complete4 = true;
                complete5 = true;
                complete6 = true;
                console.log('ehtag', "没有新数据");
            });


            var t = setInterval(() => {
                if (complete1 && complete2 && complete3 && complete4 && complete5 && complete6) {
                    t && clearInterval(t);
                    func_compelete();
                }
            }, 50);

        });
    });
}

// 准备用户存储的关键信息，此为过渡功能，将localstroage 上的存储的配置数据存储到 indexedDB 中，然后清空 localstroage
function initUserSettings(func_compelete) {
    indexDbInit(() => {
        var complete1 = false;
        var complete2 = false;
        var complete3 = false;
        var complete4 = false;
        var complete5 = false;

        // 本地折叠按钮
        var categoryListExpendArray = getCategoryListExpend();
        if (categoryListExpendArray != null) {
            var settings_categoryListExpendArray = {
                item: table_Settings_key_CategoryList_Extend,
                value: categoryListExpendArray
            };
            update(table_Settings, settings_categoryListExpendArray, () => {
                removeCategoryListExpend();
                complete1 = true;
            }, error => { complete1 = true; });
        } else {
            complete1 = true;
        }



        // 收藏折叠按钮
        var favoriteListExpendArray = getFavoriteDicts();
        if (favoriteListExpendArray != null) {
            var settings_favoriteListExpendArray = {
                item: table_Settings_key_FavoriteList_Extend,
                value: favoriteListExpendArray
            };
            update(table_Settings, settings_favoriteListExpendArray, () => {
                removeFavoriteDicts();
                complete2 = true;
            }, error => { complete2 = true; });
        } else {
            complete2 = true;
        }



        // 头部搜索菜单显示隐藏开关
        var oldSearchDivVisible = getOldSearchDivVisible();
        if (oldSearchDivVisible != null) {
            var settings_oldSearchDivVisible = {
                item: table_Settings_key_OldSearchDiv_Visible,
                value: oldSearchDivVisible == 1
            };
            update(table_Settings, settings_oldSearchDivVisible, () => {
                removeOldSearchDivVisible();
                complete3 = true;
            }, error => { complete3 = true; });
        } else {
            complete3 = true;
        }


        // 标签谷歌机翻_首页开关
        var translateCategoryFrontPage = getGoogleTranslateCategoryFontPage();
        if (translateCategoryFrontPage != null) {
            var settings_translateCategoryFontPage = {
                item: table_settings_key_TranslateFrontPageTags,
                value: translateCategoryFrontPage == 1
            };
            update(table_Settings, settings_translateCategoryFontPage, () => {
                removeGoogleTranslateCategoryFontPage();
                complete4 = true;
            }, error => { complete4 = true; });
        } else {
            complete4 = true;
        }


        // 标签谷歌机翻_详情页开关
        var translateCategoryDetailPage = getGoogleTranslateCategoryDetail();
        if (translateCategoryDetailPage != null) {
            var settings_translateCategoryDetailPage = {
                item: table_Settings_key_TranslateDetailPageTags,
                value: translateCategoryDetailPage == 1
            };
            update(table_Settings, settings_translateCategoryDetailPage, () => {
                removeGoogleTranslateCategoryDetail();
                complete5 = true;
            }, error => { complete5 = true; });
        } else {
            complete5 = true;
        }

        var t = setInterval(() => {
            if (complete1 && complete2 && complete3 && complete4 && complete5) {
                t && clearInterval(t);
                func_compelete();
            }
        }, 50);
    })
}

// TODO 用户收藏列表 等待转换 (本地从本地读取，网络从EhTag读取)