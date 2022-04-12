//#region step5.3.datasync.common.translateTitle.js 热门页数据同步

function DataSyncCommonTranslateTitle() {
    // 谷歌机翻：标题
    window.onstorage = function (e) {
        try {
            console.log(e);
            switch (e.newValue) {
                case sync_googleTranslate_frontPage_title:
                    updateGoogleTranslateFrontPageTitle();
                    break;
            }
        } catch (error) {
            removeDbSyncMessage();
        }
    }

    // 热门谷歌翻译标题
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
}

//#endregion