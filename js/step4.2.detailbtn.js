//#region step4.2.detailbtn.js 详情页主要按钮功能

// 详情页选中的标签信息

// 谷歌机翻
function translateDetailPageTitle() {
    var isChecked = document.getElementById("googleTranslateCheckbox").checked;

    // 更新存储
    var settings_translateDetailPageTitles = {
        item: table_Settings_key_TranslateDetailPageTitles,
        value: isChecked
    };
    update(table_Settings, settings_translateDetailPageTitles, () => { }, () => { });

    var h1 = document.getElementById("gj");


    var signDictArray = [];
    var txtArray = [];
    var translateDict = {};
    var specialChars = [
        '(', ')', '（', '）',
        '[', ']', '【', '】',
        '{', '}', '｛', '｝',
        '<', '>', '《', '》',
        '|', '&', '!', '@', '#', '$', '￥', '%', '^', '*', '`', '~'
    ];

    if (isChecked) {
        // 翻译标题
        if (h1.dataset.translate) {
            // 已经翻译过
            h1.innerText = h1.dataset.translate;
        } else {
            // 需要翻译
            h1.title = h1.innerText;

            var cstr = '';
            for (let i = 0; i < h1.title.length; i++) {
                const c = h1.title[i];

                if (specialChars.indexOf(c) != -1) {
                    signDictArray.push({ i, c });
                    if (cstr != '') {
                        txtArray.push(cstr);
                        cstr = '';
                    }
                } else {
                    cstr += c;
                }
            }

            if (cstr != '') {
                txtArray.push(cstr);
            }

            console.log(txtArray);
            console.log(signDictArray);

            var totalCount = txtArray.length;
            var indexCount = 0;
            for (const i in txtArray) {
                if (Object.hasOwnProperty.call(txtArray, i)) {
                    const text = txtArray[i];
                    getTranslate(text, i);
                }
            }

            function getTranslate(text, i) {
                getGoogleTranslate(text, function (data) {
                    var sentences = data.sentences;
                    var longtext = '';
                    for (const i in sentences) {
                        if (Object.hasOwnProperty.call(sentences, i)) {
                            const sentence = sentences[i];
                            longtext += sentence.trans;
                        }
                    }
                    translateDict[i] = longtext;
                    indexCount++;
                });
            }

            var t = setInterval(() => {
                if (totalCount == indexCount) {
                    t && clearInterval(t);
                    translateCompelete();
                }
            }, 50);

            function translateCompelete() {
                console.log(translateDict);
                if (signDictArray.length == 0 && txtArray.length > 0) {
                    // 纯文字
                    var str = '';
                    for (const i in translateDict) {
                        if (Object.hasOwnProperty.call(translateDict, i)) {
                            str += translateDict[i];
                        }
                    }
                    h1.innerText = str;
                    h1.dataset.translate = h1.innerText;

                } else if (signDictArray.length > 0 && txtArray.length == 0) {
                    // 纯符号
                    var str = '';
                    for (const i in signDictArray) {
                        if (Object.hasOwnProperty.call(signDictArray, i)) {
                            const item = signDictArray[i];
                            str += item.c;
                        }
                    }
                    h1.innerText = str;
                    h1.dataset.translate = h1.innerText;

                } else if (signDictArray.length > 0 || txtArray.length > 0) {
                    // 文字 + 符号
                    var signIndex = 0;
                    var translateIndex = 0;
                    var str = '';
                    if (signDictArray[0].i == 0) {
                        // 符号在前 TODO 符号索引间隔是否为1
                        while (signIndex < signDictArray.length &&
                            translateIndex < txtArray.length) {
                            if (signIndex < signDictArray.length) {
                                str += signDictArray[signIndex].c;
                                signIndex++;
                            }
                            if (translateIndex < txtArray.length) {
                                str += translateDict[translateIndex];
                                translateIndex++;
                            }
                        }
                    } else {
                        // 文字在前 TODO 符号索引间隔是否为1
                        while (signIndex < signDictArray.length &&
                            translateIndex < txtArray.length) {
                            if (translateIndex < txtArray.length) {
                                str += translateDict[translateIndex];
                                translateIndex++;
                            }

                            if (signIndex < signDictArray.length) {
                                str += signDictArray[signIndex].c;
                                signIndex++;
                            }
                        }
                    }

                    h1.innerText = str;
                    h1.dataset.translate = h1.innerText;
                }
            }


            // var encodeText = urlEncode(h1.innerText);
            // getGoogleTranslate(encodeText, function (data) {
            //     var sentences = data.sentences;
            //     var longtext = '';
            //     for (const i in sentences) {
            //         if (Object.hasOwnProperty.call(sentences, i)) {
            //             const sentence = sentences[i];
            //             longtext += sentence.trans;
            //         }
            //     }

            //     h1.innerText = longtext;
            //     h1.dataset.translate = longtext;
            // });
        }

    } else {
        // 显示原文
        if (h1.title) {
            h1.innerText = h1.title;
        }
    }
}

// 清空选择
function categoryCheckClear() {
    for (const parentEn in detailCheckedDict) {
        if (Object.hasOwnProperty.call(detailCheckedDict, parentEn)) {
            const keyItems = detailCheckedDict[parentEn];
            for (const enItem in keyItems[1]) {
                if (Object.hasOwnProperty.call(keyItems[1], enItem)) {
                    var parentDiv = document.getElementById(`td_${parentEn}:${enItem.replace(new RegExp(/( )/g), "_")}`);
                    parentDiv.classList.remove("div_ee8413b2_category_checked");
                }
            }
        }
    }

    detailCheckedDict = {};
    hideDetailBtn();
}

function hideDetailBtn() {
    clearBtn.style.display = "none";
    addFavoriteBtn.style.display = "none";
    searchBtn.style.display = "none";
}

// 加入收藏
function categoryAddFavorite() {
    //TODO
}

// 搜索
function categorySearch() {
    //TODO
}



function detailPageFavorite() {
    // 右侧操作列
    var rightDiv = document.getElementById("gd5");

    // 标签谷歌机翻按钮
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
    rightDiv.appendChild(translateDiv);
    translateCheckbox.addEventListener("click", translateDetailPageTitle);

    // 读取是否选中
    read(table_Settings, table_Settings_key_TranslateDetailPageTitles, result => {
        if (result && result.value) {
            translateCheckbox.setAttribute("checked", true);
            translateDetailPageTitle();
        }
    }, () => { });

    // 清空选择按钮
    var clearBtn = document.createElement("div");
    clearBtn.id = "div_ee8413b2_detail_clearBtn";
    var clearTxt = document.createTextNode("清空选择");
    clearBtn.appendChild(clearTxt);
    clearBtn.addEventListener("click", categoryCheckClear);
    rightDiv.appendChild(clearBtn);

    // 加入收藏按钮
    var addFavoriteBtn = document.createElement("div");
    addFavoriteBtn.id = "div_ee8413b2_detail_addFavoriteBtn";
    var addFavoriteTxt = document.createTextNode("加入收藏");
    addFavoriteBtn.appendChild(addFavoriteTxt);
    addFavoriteBtn.addEventListener("click", categoryAddFavorite);
    rightDiv.appendChild(addFavoriteBtn);

    // 查询按钮
    var searchBtn = document.createElement("div");
    searchBtn.id = "div_ee8413b2_detail_searchBtn";
    var searchBtnTxt = document.createTextNode("搜索");
    searchBtn.appendChild(searchBtnTxt);
    searchBtn.addEventListener("click", categorySearch);
    rightDiv.appendChild(searchBtn);

    // 详情页右侧标签样式修改
    var rightP = rightDiv.querySelectorAll("p");
    for (const i in rightP) {
        if (Object.hasOwnProperty.call(rightP, i)) {
            const p = rightP[i];
            p.classList.remove("gsp");
        }
    }

    // 翻译标签父级
    var tcList = document.getElementsByClassName("tc");
    for (const i in tcList) {
        if (Object.hasOwnProperty.call(tcList, i)) {
            const tc = tcList[i];
            var parentEn = tc.innerText.replace(":", "");
            var parentZh = detailParentData[parentEn] ?? parentEn;
            tc.innerText = `${parentZh}:`;
        }
    }


}

//#endregion