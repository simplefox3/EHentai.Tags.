//#region step6.1.backgroundImage.js 设置背景图片

// 头部按钮点击事件
var bgDiv = document.getElementById("div_background_btn");
bgDiv.onclick = function () {
    backgroundFormDiv.style.display = "block";
    bgDiv.style.display = "none";

    // TODO 读取存储设置值
}

opacityRange.oninput = function () {
    opacityVal.innerText = opacityRange.value;
}


//#endregion