//#region step3.2.frontPageTopStyle 首页头部搜索显示隐藏

function frontPageTopStyle() {
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

        var settings_oldSearchDivVisible = {
            item: table_Settings_key_OldSearchDiv_Visible,
            value: false
        };
        update(table_Settings, settings_oldSearchDivVisible, () => { }, error => { });
    }
    function showOldSearchDiv() {
        searchBoxDiv.children[0].style.display = "block";
        hiddenOldDiv.style.display = "block";
        showOldDiv.style.display = "none";
        var settings_oldSearchDivVisible = {
            item: table_Settings_key_OldSearchDiv_Visible,
            value: true
        };
        update(table_Settings, settings_oldSearchDivVisible, () => { }, error => { });
    }

    // 读取头部是否隐藏，并应用到页面中
    read(table_Settings, table_Settings_key_OldSearchDiv_Visible, result => {
        if (result && !result.value) {
            searchBoxDiv.children[0].style.display = "none";
            hiddenOldDiv.style.display = "none";
            showOldDiv.style.display = "block";
        }
    }, () => { });
}

//#endregion
