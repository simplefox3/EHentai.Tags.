// 获取标签数据

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


//#region indexdb 模块

var request = window.indexedDB.open("EXH_DYZYFTS", 1);
var db;

// 设置表
const table_Settings = "t_settings";
const table_Settings_key_EhTagVersion = "f_ehTagVersion";
const table_Settings_key_ParentEnArray = "f_parentEnArray";


// EhTag 父子信息表
const table_EhTagSubItems = "t_ehTagSubItems";
const table_EhTagSubItems_key = "ps_en";

function indexDbInit(func_start_use) {
    if (request) {
        db = request.result;
        func_start_use();
    }
    else {
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
    // 包含：EhTag版本号、EhTag总数据、EhTag父标签、EhTag页面数据
    if (!db.objectStoreNames.contains(table_Settings)) {
        objectStore = db.createObjectStore(table_Settings, { keyPath: 'item' });
    }

    // EhTag 父子标签表
    if (!db.objectStoreNames.contains(table_EhTagSubItems)) {
        objectStore = db.createObjectStore(table_EhTagSubItems, { keyPath: table_EhTagSubItems_key });
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
        }
        else {
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
        }
        else {
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
        }
        else {
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

function dataInit(update_func, local_func) {

    // 获取本地版本号
    read(table_Settings, table_Settings_key_EhTagVersion, localVersion => {
        console.log('v', localVersion);
        getEhTagGitHubReleaseVersion(version => {
            // 和本地的版本号进行比较，如果不同这进行更新
            if (version != localVersion) {
                getEhTagTranslate(version, json => {
                    update_func(json.data);
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
        // TODO 获取恋物的父子项、父级信息、版本号



        dataInit(newData => {
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

            var settings_parentEnArray = {
                item: table_Settings_key_ParentEnArray,
                value: parentEnArray
            };

            // 更新父级信息
            update(table_Settings, settings_parentEnArray, () => { }, error => { });

            // 更新页面

            // 存储页面 html

            // 更新版本号



        }, () => {
            // 读取页面 Html
            console.log('加载页面');
        });

    })
}
