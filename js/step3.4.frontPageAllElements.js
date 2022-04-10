//#region step3.4.frontPageAllElements.js 列出首页全部可操作元素
// 全部类别按钮、收藏按钮
var allCategoryBtn = document.getElementById("category_all_button");
var categoryFavoritesBtn = document.getElementById("category_favorites_button");

// 搜索框标签收集栏、输入框、回车按钮、候选div、可用按钮、清空按钮、搜索按钮
var searchInput = document.getElementById("input_info");
var readonlyDiv = document.getElementById("readonly_div");
var userInput = document.getElementById("user_input");
var userInputEnterBtn = document.getElementById("user_input_enter");
var userInputRecommendDiv = document.getElementById("category_user_input_recommend");
var inputClearBtn = document.getElementById("input_clear");
var searchBtn = document.getElementById("category_enter_button");

// 加入收藏按钮、不可用的加入收藏按钮、收起按钮
var addFavoritesBtn = document.getElementById("category_addFavorites_button");
var addFavoritesDisabledBtn = document.getElementById("category_addFavorites_button_disabled");
var searchCloseBtn = document.getElementById("search_close");

// 展示区包裹层div、全部类别Div、收藏Div、类别列表div、类别_恋物列表div、类别_ehtag列表div、收藏列表div
var displayDiv = document.getElementById("display_div");
var categoryDisplayDiv = document.getElementById("category_all_div");
var favoritesDisplayDiv = document.getElementById("category_favorites_div");
var categoryListDiv = document.getElementById("category_list");
var categoryList_fetishDiv = document.getElementById("category_list_fetishList");
var categoryList_ehTagDiv = document.getElementById("category_list_ehTag");
var favoriteListDiv = document.getElementById("favorites_list");

// [标签 + 收藏] 全部展开按钮、标签全部折叠按钮、标签展开折叠按钮、标签
var allExtend = document.getElementById("all_expand");
var allCollapse = document.getElementById("all_collapse");
var categoryExtends = document.getElementsByClassName("category_extend");
var favoriteAllExtend = document.getElementById("favorites_all_expand");
var favoriteAllCollapse = document.getElementById("favorites_all_collapse");
var favoriteExtends = document.getElementsByClassName("favorite_extend");
var cItems = document.getElementsByClassName("c_item");

// 收藏编辑div、收藏编辑按钮、收藏保存按钮、收藏取消按钮、收藏清空按钮
var favoriteEditDiv = document.getElementById("favorites_edit_list");
var favoriteEdit = document.getElementById("favorites_edit");
var favoriteSave = document.getElementById("favorites_save");
var favoriteCancel = document.getElementById("favorites_cancel");
var favoriteClear = document.getElementById("favorites_clear");

// 备份收藏按钮、恢复收藏按钮、上传按钮
var favoriteExport = document.getElementById("favorites_export");
var favoriteRecover = document.getElementById("favorites_recover");
var favoriteUploadFiles = document.getElementById("favorite_upload_files");

// 背景图片包裹层div、头部div、上传图片按钮、不透明度、不透明度值、模糊程度、模糊程度值、保存按钮、取消按钮、关闭按钮
var backgroundFormDiv = document.getElementById("background_form");
var backgroundFormTop = document.getElementById("background_form_top");
var bgUploadBtn = document.getElementById("bgUploadBtn");
var bgUploadFile = document.getElementById("bg_upload_file");
var opacityRange = document.getElementById("opacity_range");
var opacityVal = document.getElementById("opacity_val");
var maskRange = document.getElementById("mask_range");
var maskVal = document.getElementById("mask_val");
var bgImgClearBtn = document.getElementById("bgImg_clear_btn");
var bgImgSaveBtn = document.getElementById("bgImg_save_btn");
var bgImgCancelBtn = document.getElementById("bgImg_cancel_btn");
var bgImgCloseBtn = document.getElementById("background_form_close");
//#endregion