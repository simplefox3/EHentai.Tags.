//#region step3.2.frontPageTopStyle 首页头部搜索显示隐藏

// 添加样式和逻辑，从 localstroage 中读取显示隐藏
function frontPageTopStyleStep01() {
    // 调整头部样式
    var searchBoxDiv = document.getElementById("searchbox");
    searchBoxDiv.style.width = "auto";
    searchBoxDiv.style.border = "0";

    // 头部添加隐藏按钮和显示按钮
    var hiddenOldDiv = document.createElement("div");
    hiddenOldDiv.id = "div_old_hidden_btn";
    var hiddenOldText = document.createTextNode("隐藏");
    hiddenOldDiv.appendChild(hiddenOldText);
    hiddenOldDiv.addEventListener("click", hideOldSearchDiv);
    searchBoxDiv.appendChild(hiddenOldDiv);
    var showOldDiv = document.createElement("div");
    showOldDiv.id = "div_old_show_btn";
    var showOldText = document.createTextNode("显示");
    showOldDiv.appendChild(showOldText);
    showOldDiv.addEventListener("click", showOldSearchDiv);
    searchBoxDiv.appendChild(showOldDiv);

    function hideOldSearchDiv() {
        searchBoxDiv.children[0].style.display = "none";
        hiddenOldDiv.style.display = "none";
        showOldDiv.style.display = "block";
        setOldSearchDivVisible(0);
    }
    function showOldSearchDiv() {
        searchBoxDiv.children[0].style.display = "block";
        hiddenOldDiv.style.display = "block";
        showOldDiv.style.display = "none";
        setOldSearchDivVisible(1);
    }

    // 读取头部是否隐藏，并应用到页面中
    var oldSearchDivVisible = getOldSearchDivVisible();
    if (oldSearchDivVisible == 0) {
        searchBoxDiv.children[0].style.display = "none";
        hiddenOldDiv.style.display = "none";
        showOldDiv.style.display = "block";
    }
}

// 从indexedDB 中读取隐藏折叠
function frontPageTopStyleStep02() {
    var searchBoxDiv = document.getElementById("searchbox");
    var hiddenOldDiv = document.getElementById("div_old_hidden_btn");
    var showOldDiv = document.getElementById("div_old_show_btn");

    var oldSearchDivVisible = getOldSearchDivVisible();
    if (oldSearchDivVisible == null) {
        // 尝试从 indexedDB 中读取配置，如果存在则说明 localstroage 配置丢失，需要补充，页面对应隐藏折叠
        read(table_Settings, table_Settings_key_OldSearchDiv_Visible, result => {
            if (result) {
                if (!result.value) {
                    searchBoxDiv.children[0].style.display = "none";
                    hiddenOldDiv.style.display = "none";
                    showOldDiv.style.display = "block";
                }
                setOldSearchDivVisible(result.value ? 1 : 0);
            }
        }, () => { });

    }

    // 添加按钮点击事件，用于将配置存储到 indexDB 中
    hiddenOldDiv.addEventListener("click", hiddenTopIndexedDb);
    showOldDiv.addEventListener("click", showTopIndexedDb);
    function hiddenTopIndexedDb() {
        var settings_oldSearchDivVisible = {
            item: table_Settings_key_OldSearchDiv_Visible,
            value: false
        };
        update(table_Settings, settings_oldSearchDivVisible, () => {
            setDbSyncMessage(sync_oldSearchTopVisible);
         }, error => { });
    }

    function showTopIndexedDb() {
        var settings_oldSearchDivVisible = {
            item: table_Settings_key_OldSearchDiv_Visible,
            value: true
        };
        update(table_Settings, settings_oldSearchDivVisible, () => {
            setDbSyncMessage(sync_oldSearchTopVisible);
         }, error => { });
    }
}

//#endregion