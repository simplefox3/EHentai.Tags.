//#region step7.2.favorite.js 收藏列表

function favoritePage() {

    // 标题添加类 t_favorite_ido，方便添加样式
    var ido = document.getElementsByClassName("ido");
    if (ido.length > 0) {
        ido[0].classList.add("t_favorite_ido");
    }

    // 标题直接删除
    var h1 = document.getElementsByTagName("h1");
    if (h1.length > 0) {
        var pageTitle = h1[0];
        pageTitle.parentNode.removeChild(pageTitle);
    }

    // 显示全部按钮改名
    var favoriteBtns = document.getElementsByClassName("fp");
    if (favoriteBtns.length > 0){
        var showAllFavorites = favoriteBtns[favoriteBtns.length - 1];
        showAllFavorites.innerText = "点我显示：全部收藏";
    }

    // 搜索框大小调整，搜索按钮清空按钮翻译，筛选文本框排成一行

    // 排序翻译、搜索行数翻译（包含没有搜索结果）

    // 谷歌机翻标题

    // 折叠按钮翻译

    // 表头翻译、表格标签翻译

    // 底部删除选中翻译


}



//#endregion