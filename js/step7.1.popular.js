//#region 7.1.popular.js 热门

function popularPage() {

    // 跨域
    var meta = document.createElement("meta");
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = "upgrade-insecure-requests";
    document.getElementsByTagName("head")[0].appendChild(meta);

    // 头部标题改成中文
    var ihTitle = document.getElementsByClassName("ih");
    if (ihTitle.length > 0) {
        ihTitle[0].innerText = "近期热门作品";
    }

    var toppane = document.getElementById("toppane");
    toppane.classList.add("t_popular_toppane"); // 添加样式避免干扰其他页面

    // 标题机翻
    var translateDiv = document.createElement("div");
    translateDiv.id = "googleTranslateDiv";
    var translateCheckbox = document.createElement("input");
    translateCheckbox.setAttribute("type", "checkbox");
    translateCheckbox.id = "googleTranslateCheckbox";
    translateDiv.appendChild(translateCheckbox);
    var translateLabel = document.createElement("label");
    translateLabel.setAttribute("for", translateCheckbox.id);
    translateLabel.id = "translateLabel";
    translateLabel.innerText = "谷歌机翻 : 标题";

    translateDiv.appendChild(translateLabel);
    translateCheckbox.addEventListener("click", translateMainPageTitle);
    toppane.insertBefore(translateDiv, toppane.lastChild);

    // 头部添加词库升级提示
    var dataUpdateDiv = document.createElement("div");
    dataUpdateDiv.id = "data_update_tip";
    var dataUpdateText = document.createTextNode("词库升级中...");
    dataUpdateDiv.appendChild(dataUpdateText);
    toppane.insertBefore(dataUpdateDiv, toppane.lastChild);


    // 翻译下拉折叠菜单
    var dms = document.getElementById("dms");
    dms.classList.add("t_popular_dms"); // 添加样式避免干扰其他页面
    dropDownlistTranslate();

    // 表头翻译
    tableHeadTranslate();

    // 作品类型翻译
    bookTypeTranslate();


    indexDbInit(() => {
        // 谷歌机翻标题
        read(table_Settings, table_Settings_key_TranslateFrontPageTitles, result => {
            if (result && result.value) {
                translateCheckbox.setAttribute("checked", true);
                translateMainPageTitleDisplay();
            }
        }, () => { });

        // 确保存在标签数据
        tagDataDispose(() => {
            // 表格标签翻译
            tableTagTranslate();
        })
    });

    // 同步谷歌机翻标题
    DataSyncCommonTranslateTitle();
}



//#endregion