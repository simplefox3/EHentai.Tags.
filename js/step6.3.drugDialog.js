//#region step6.3.drugDialog.js 鼠标拖拽设置对话框

var x = 0, y = 0;
var left = 0, top = 0;
var isMouseDown = false;

var x1 = 0, y1 = 0;
var left1 = 0, top1 = 0;
var isMouseDown1 = false;

// 背景对话框 鼠标按下事件
backgroundFormTop.onmousedown = function (e) {
    // 获取坐标xy
    x = e.clientX;
    y = e.clientY;

    // 获取左和头的偏移量
    left = backgroundFormDiv.offsetLeft;
    top = backgroundFormDiv.offsetTop;

    // 鼠标按下
    isMouseDown = true;
}

// 字体对话框 鼠标按下事件
listFontColorTop.onmousedown = function (e) {
    //获取坐标x1,y1
    x1 = e.clientX;
    y1 = e.clientY;

    // 获取左和头的偏移量
    left1 = listFontColorDiv.offsetLeft;
    top1 = listFontColorDiv.offsetTop;

    // 鼠标按下
    isMouseDown1 = true;
}

// 鼠标移动
window.onmousemove = function (e) {
    if (isMouseDown) {
        var nLeft = e.clientX - (x - left);
        var nTop = e.clientY - (y - top);
        backgroundFormDiv.style.left = `${nLeft}px`;
        backgroundFormDiv.style.top = `${nTop}px`;
    }

    if (isMouseDown1){
        var nLeft1 = e.clientX - (x1 - left1);
        var nTop1 = e.clientY - (y1 - top1);
        listFontColorDiv.style.left = `${nLeft1}px`;
        listFontColorDiv.style.top = `${nTop1}px`;
    }
}

// 鼠标抬起
backgroundFormTop.onmouseup = function () {
    isMouseDown = false;
}

listFontColorDiv.onmouseup = function () {
    isMouseDown1 = false;
}

//#endregion