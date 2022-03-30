// 判断域名选择 exhentai 还是 e-henatai
const webHost = window.location.host;
function func_eh_ex(ehFunc, exFunc) {
	if (webHost == "e-hentai.org") {
		ehFunc();
	}
	else if (webHost == "exhentai.org") {
		exFunc();
	}
}