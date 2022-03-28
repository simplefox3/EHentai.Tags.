﻿/// 获取标签数据

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
    var url = `https://cdn.jsdelivr.net/gh/SunBrook/ehWiki.fetishListing.translate.zh_CN@${version}/fetish.oneLevel.withoutLang.json`;
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
        objectStore.createIndex('parent_en', 'parent_en', { unique: false });
        objectStore.createIndex('parent_zh', 'parent_zh', { unique: false });
        objectStore.createIndex('sub_en', 'sub_en', { unique: false });
        objectStore.createIndex('sub_zh', 'sub_zh', { unique: false });
    }

    // EhTag 父子标签表
    if (!db.objectStoreNames.contains(table_EhTagSubItems)) {
        objectStore = db.createObjectStore(table_EhTagSubItems, { keyPath: table_EhTagSubItems_key });
        objectStore.createIndex('parent_en', 'parent_en', { unique: false });
        objectStore.createIndex('parent_zh', 'parent_zh', { unique: false });
        objectStore.createIndex('sub_en', 'sub_en', { unique: false });
        objectStore.createIndex('sub_zh', 'sub_zh', { unique: false });
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

function batchAdd(tableName, keyName, dataList) {
    var request = db.transaction([tableName], 'readwrite')
        .objectStore(tableName);
    for (const key in dataList) {
        if (Object.hasOwnProperty.call(dataList, key)) {
            const item = dataList[key];
            item[keyName] = key;
            request.add(item);
        }
    }
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


window.onload = function () {
    // 全部类别按钮
    var categoryAllDiv = document.getElementById("category_all_div");
    var categoryList = document.getElementById("category_list");
    categoryAllDiv.style.display = "block";
    categoryList.style.display = "block";

    // 获取数据
    indexDbInit(() => {
        // TODO 验证数据完整性，如果数据不完整，则清空版本号数据



        // 获取并更新恋物的父子项、父级信息
        fetishListDataInit(newData => {

            // 批量添加父子项
            batchAdd(table_fetishListSubItems, table_fetishListSubItems_key, newData.data);

            // 更新父级信息
            var settings_fetishList_parentEnArray = {
                item: table_Settings_key_FetishList_ParentEnArray,
                value: newData.parent_en_array
            };
            update(table_Settings, settings_fetishList_parentEnArray, () => { }, error => { });

            // 生成页面 html

            read(table_Settings, table_Settings_key_FetishList_ParentEnArray, parentData => {
                var categoryFetishListHtml = ``;
                const parent_en = parentData.value[0];
                readByCursorIndex(table_fetishListSubItems, "parent_en", parent_en, subItems => {
                    console.log(subItems);
                });
                
                // 添加到页面
                // 保存页面 html
            }, error => {
                console.log('fetish 获取 父级列表失败');
            });



        }, () => {
            console.log('fet', "没有新数据");
            // 读取页面 html
            // 添加到页面
        });


        ehTagDataInit(newData => {
            // 更新本地数据库 indexDB
            // 存储完成之后，更新版本号

            // 需要过滤的项
            var filterParents = ["rows", "reclass"];

            var psDict = {};
            var parentEnArray = [];

            for (const index in newData) {
                if (Object.hasOwnProperty.call(newData, index)) {
                    // var example = { ps_en: "male:bo", parent_en: "male", parent_zh: "男性", sub_en: "bo", sub_zh: "波", sub_desc: "波波" };

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
                            var ps_en = `${parent_en}:${sub_en}`;
                            psDict[ps_en] = { parent_en, parent_zh, sub_en, sub_zh, sub_desc };
                        }
                    }
                }
            }

            // 批量添加父子项
            batchAdd(table_EhTagSubItems, table_EhTagSubItems_key, psDict);

            var settings_ehTag_parentEnArray = {
                item: table_Settings_key_EhTag_ParentEnArray,
                value: parentEnArray
            };

            // 更新父级信息
            update(table_Settings, settings_ehTag_parentEnArray, () => { }, error => { });

            // 生成页面 html

            // 更新到页面

            // 存储页面 html

        }, () => {
            console.log('ehtag', "没有新数据");
            // 读取页面 Html
            // 更新到页面
        });

    });
}