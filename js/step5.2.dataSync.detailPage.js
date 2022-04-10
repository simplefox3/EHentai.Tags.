//#region step5.2.dataSync.detailPage.js 详情页数据同步

window.onstorage = function (e) {
    try {
        console.log(e);
        switch (e.newValue) {
            case sync_googleTranslate_detailPage_title:
                updateGoogleTranslateDetailPageTitle();
                break;
        }
    } catch (error) {
        removeDbSyncMessage();
    }
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