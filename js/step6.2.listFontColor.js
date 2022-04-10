//#region step6.2.listFontColor.js 列表字体颜色设置

var defaultFrontParentColor;
var defaultFrontSubColor;
var defaultFrontSubHoverColor;

func_eh_ex(() => {
    defaultFrontParentColor = defaultFontParentColor_EH;
    defaultFrontSubColor = defaultFontSubColor_EH;
    defaultFrontSubHoverColor = defaultFontSubHoverColor_EH;
}, () => {
    defaultFrontParentColor = defaultFontParentColor_EX;
    defaultFrontSubColor = defaultFontSubColor_EX;
    defaultFrontSubHoverColor = defaultFontSubHoverColor_EX;
});

var t_parentColor = defaultFrontParentColor;
var t_subColor = defaultFrontSubColor;
var t_subHoverColor = defaultFrontSubHoverColor;

// 头部按钮点击事件
var frontDiv = document.getElementById("div_fontColor_btn");
frontDiv.onclick = function () {
    listFontColorDiv.style.display = "block";
    frontDiv.style.display = "none";
}

// 读取存储的值，读取完成前，隐藏头部按钮，读取完成在显示出来
function initFontColor(func_compelete) {
    frontDiv.style.display = "none";
    var completeParentColor = false;
    var completeSubColor = false;
    var completeSubHoverColor = false;
    read(table_Settings, table_Settings_key_FrontPageFontParentColor, result => {
        if (result && result.value) {
            t_parentColor = result.value;
        } else {
            t_parentColor = defaultFrontParentColor;
        }
        // 设置父级颜色
        setFontPrentColor(t_parentColor);
        setDialogFontParentColor(t_parentColor);
        completeParentColor = true;
    }, () => { completeParentColor = true; });
    read(table_Settings, table_Settings_key_FrontPageFontSubColor, result => {
        if (result && result.value) {
            t_subColor = result.value;
        } else {
            t_subColor = defaultFrontSubColor;
        }
        // 设置子级颜色
        setFontSubColor(t_subColor);
        setDialogFontSubColor(t_subColor);
        completeSubColor = true;
    }, () => { completeSubColor = true; });
    read(table_Settings, table_Settings_Key_FrontPageFontSubHoverColor, result => {
        if (result && result.value) {
            t_subHoverColor = result.value;
        } else {
            t_subHoverColor = defaultFrontSubHoverColor;
        }
        // 设置子级悬浮颜色
        setFontSubHoverColor(t_subHoverColor);
        setDialogFontSubHoverColor(t_subHoverColor);
        completeSubHoverColor = true;
    }, () => { completeSubHoverColor = true; });

    var tInit = setInterval(() => {
        if (completeParentColor && completeSubColor && completeSubHoverColor) {
            tInit && clearInterval(tInit);
            frontDiv.style.display = "block";
            func_compelete();
        }
    }, 50);
}

initFontColor(() => { });

// 父级颜色
listFontColorParentColor.onchange = function () {
    t_parentColor = listFontColorParentColor.value;
    listFontColorParentColorVal.innerText = t_parentColor;
    setFontPrentColor(t_parentColor);
}
// 设置父级颜色效果
function setFontPrentColor(parentColor) {
    var style = document.createElement('style');
    style.innerHTML = `#div_ee8413b2 #category_all_div h4, 
    #div_ee8413b2 #favorites_list h4, 
    #div_ee8413b2 #favorites_edit_list h4
    {color:${parentColor}}
    
    #div_ee8413b2 #category_all_div .category_extend, 
    #div_ee8413b2 #favorites_list .favorite_extend, 
    #div_ee8413b2 #favorites_edit_list .favorite_edit_clear
    {border: 1px solid ${parentColor}; color:${parentColor};}`;
    document.head.appendChild(style);
}

// 设置弹窗页父级颜色数值
function setDialogFontParentColor(parentColor) {
    listFontColorParentColor.value = parentColor;
    listFontColorParentColorVal.innerText = parentColor;
}

// 子级颜色
listFontColorSubColor.onchange = function () {
    t_subColor = listFontColorSubColor.value;
    listFontColorSubColorVal.innerText = t_subColor;
    setFontSubColor(t_subColor);
}
// 设置子级颜色效果
function setFontSubColor(subColor) {
    var style = document.createElement('style');
    style.innerHTML = `#div_ee8413b2 #category_all_div .c_item, 
    #div_ee8413b2 #category_favorites_div #favorites_list .c_item
    {color:${subColor}}`;
    document.head.appendChild(style);
}
// 设置弹窗页子级颜色数值
function setDialogFontSubColor(subColor) {
    listFontColorSubColor.value = subColor;
    listFontColorSubColorVal.innerText = subColor;
}

// 子级悬浮颜色
listFontColorSubHoverColor.onchange = function () {
    t_subHoverColor = listFontColorSubHoverColor.value;
    listFontColorSubHoverColorVal.innerText = t_subHoverColor;
    setFontSubHoverColor(t_subHoverColor);
}
// 设置子级悬浮颜色效果
function setFontSubHoverColor(subHoverColor) {
    var style = document.createElement('style');
    style.innerHTML = `#div_ee8413b2 #category_all_div .c_item:hover,
    #div_ee8413b2 #category_favorites_div #favorites_list .c_item:hover
    {color:${subHoverColor}}`;
    document.head.appendChild(style);
}

// 设置弹窗页子级悬浮颜色数值
function setDialogFontSubHoverColor(subHoverColor) {
    listFontColorSubHoverColor.value = subHoverColor;
    listFontColorSubHoverColorVal.innerText = subHoverColor;
}

// 点击关闭 + 取消关闭
function closeFontColorDialog() {
    // 初始化设置
    initFontColor(() => {
        listFontColorDiv.style.display = "none";
        frontDiv.style.display = "block";
    });
}
listFontColorCancelBtn.onclick = closeFontColorDialog;
listFontColorCloseBtn.onclick = closeFontColorDialog;


// 重置
listFontColorClearBtn.onclick = function () {
    var confirmResult = confirm("是否重置字体颜色相关参数?");
    if (confirmResult) {
        listFontColorClearBtn.innerText = "重置中...";
        var clearcomplete1 = false;
        var clearcomplete2 = false;
        var clearcomplete3 = false;
        remove(table_Settings, table_Settings_key_FrontPageFontParentColor, () => {
            t_parentColor = defaultFrontParentColor;
            setFontPrentColor(t_parentColor);
            setDialogFontParentColor(t_parentColor);
            clearcomplete1 = true;
        }, () => { clearcomplete1 = true; });
        remove(table_Settings, table_Settings_key_FrontPageFontSubColor, () => {
            t_subColor = defaultFrontSubColor;
            setFontSubColor(t_subColor);
            setDialogFontSubColor(t_subColor);
            clearcomplete2 = true;
        }, () => { clearcomplete2 = true; });
        remove(table_Settings, table_Settings_Key_FrontPageFontSubHoverColor, () => {
            t_subHoverColor = defaultFrontSubHoverColor;
            setFontSubHoverColor(t_subHoverColor);
            setDialogFontSubHoverColor(t_subHoverColor);
            clearcomplete3 = true;
        }, () => { clearcomplete3 = true; });

        var tClear = setInterval(() => {
            if (clearcomplete1 && clearcomplete2 && clearcomplete3) {
                tClear && clearInterval(tClear);
                setDbSyncMessage(sync_setting_frontPageFontColor);
                setTimeout(function () {
                    listFontColorClearBtn.innerText = "重置成功";
                }, 250);
                setTimeout(function () {
                    listFontColorClearBtn.innerText = "重置 !";
                }, 500);
            }
        }, 50);
    }
}

// 保存
listFontColorSaveBtn.onclick = function () {
    listFontColorSaveBtn.innerText = "保存中...";

    // 存储
    var complete1 = false;
    var complete2 = false;
    var complete3 = false;

    // 父级颜色
    var settings_Key_FrontPageFontParentColor = {
        item: table_Settings_key_FrontPageFontParentColor,
        value: t_parentColor
    };
    update(table_Settings, settings_Key_FrontPageFontParentColor, () => { complete1 = true; }, () => { complete1 = true; });

    // 子级颜色
    var settings_Key_FrontPageFontSubColor = {
        item: table_Settings_key_FrontPageFontSubColor,
        value: t_subColor
    };
    update(table_Settings, settings_Key_FrontPageFontSubColor, () => { complete2 = true; }, () => { complete2 = true; });

    // 子级悬浮颜色
    var settings_Key_FrontPageFontSubHoverColor = {
        item: table_Settings_Key_FrontPageFontSubHoverColor,
        value: t_subHoverColor
    };
    update(table_Settings, settings_Key_FrontPageFontSubHoverColor, () => { complete3 = true; }, () => { complete3 = true; });

    var t = setInterval(() => {
        if (complete1 && complete2 && complete3) {
            t && clearInterval(t);
            setDbSyncMessage(sync_setting_frontPageFontColor);
            setTimeout(function () {
                listFontColorSaveBtn.innerText = "保存成功";
            }, 250);
            setTimeout(function () {
                listFontColorSaveBtn.innerText = "保存 √";
            }, 500);
        }
    }, 50);
}

//#endregion