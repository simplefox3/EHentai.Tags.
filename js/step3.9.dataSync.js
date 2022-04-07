//#region step3.9.dataSync.js 数据同步

window.onstorage = function (e) {
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
        case sync_googleTranslate_detailPage_title:
            updateGoogleTranslateDetailPageTitle();
            break;
    }
}

// 头部搜索折叠隐藏
function updatePageTopVisible() {

    removeDbSyncMessage();
}

// 本地列表更新
function updatePageCategoryList() {

    removeDbSyncMessage();
}

// 本地收藏更新
function updatePageFavoriteList() {

    removeDbSyncMessage();
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

    removeDbSyncMessage();
}

// 详情页谷歌翻译标题
function updateGoogleTranslateDetailPageTitle() {

    removeDbSyncMessage();
}

//#endregion