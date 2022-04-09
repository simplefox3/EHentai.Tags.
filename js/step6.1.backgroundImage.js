//#region step6.1.backgroundImage.js 设置背景图片

// 头部按钮点击事件
var bgDiv = document.getElementById("div_background_btn");
bgDiv.onclick = function () {
    backgroundFormDiv.style.display = "block";
    bgDiv.style.display = "none";

    // TODO 读取存储设置值
}



// div头部拖拽事件
var x = 0, y = 0;
var left = 0, top = 0;
var isMouseDown = false;
// 鼠标按下事件
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
// 鼠标移动
window.onmousemove = function (e) {
    if (!isMouseDown) return;
    // 计算偏移量
    var nLeft = e.clientX - (x - left);
    var nTop = e.clientY - (y - top);
    backgroundFormDiv.style.left = `${nLeft}px`;
    backgroundFormDiv.style.top = `${nTop}px`;
}
// 鼠标抬起
backgroundFormTop.onmouseup = function () {
    isMouseDown = false;
}

// 点击上传图片
bgUploadBtn.onclick = function () {
    bgUploadFile.click();
}

var imgBase64 = '';

bgUploadFile.onchange = function () {
    var resultFile = bgUploadFile.files[0];
    if (resultFile) {
        var reader = new FileReader();
        reader.readAsDataURL(resultFile);
        reader.onload = function (e) {
            var fileContent = e.target.result;
            console.log(fileContent);

            var arr = fileContent.split(",");
            imgBase64 = arr[1];
            var bg = 'url(' + 'data:image/png;base64,' + imgBase64 + ') 0 / cover';
            var style = document.createElement('style');
            style.innerHTML = `#div_ee8413b2_bg::before{background:${bg}}`;
            document.head.appendChild(style);

            // 上传置空
            bgUploadFile.value = "";
        }
    }
}

var t_opacity = 0;

// 不透明度
opacityRange.oninput = function () {
    t_opacity = opacityRange.value;
    opacityVal.innerText = t_opacity;
    var style = document.createElement('style');
    style.innerHTML = `#div_ee8413b2_bg::before{opacity:${t_opacity}}`;
    document.head.appendChild(style);
}

var t_mask = 0;

// 遮罩浓度
maskRange.oninput = function () {
    t_mask = maskRange.value;
    maskVal.innerText = t_mask;
    var style = document.createElement('style');
    style.innerHTML = `#div_ee8413b2_bg::before{filter:blur(${t_mask}px)}`;
    document.head.appendChild(style);
}

//#endregion