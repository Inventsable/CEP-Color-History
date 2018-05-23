var csInterface = new CSInterface();
var appName = csInterface.hostEnvironment.appName;
var foreground = document.getElementById("foreground");
var background = document.getElementById("background");
window.onload = assignButton();
window.onload = loadLibraries();
window.onload = colorFix();

function loadLibraries(){
	loadJSX("libPS.jsx");
	loadJSX("libAI.jsx");
}

function assignButton() {
	if (appName === "PHXS") {
		foreground.addEventListener("click", function(){csInterface.evalScript('fgColorFromPS();', fgResult)}, false);
		background.addEventListener("click", function(){csInterface.evalScript('bgColorFromPS();', bgResult)}, false);
	} else if (appName === "ILST") {
		foreground.addEventListener("click", function(){csInterface.evalScript(`fillColorFromAI();`, fgResult)}, false);
		background.addEventListener("click", function(){csInterface.evalScript(`strokeColorFromAI();`, bgResult)}, false);
	}
}

function fgResult(result){
	foreground.style.backgroundColor = "#" + result;
}

function bgResult(result){
	background.style.backgroundColor = "#" + result;
}

function colorFix(){
	if (appName === "ILST") {
		var htmlBody = document.getElementsByTagName("html");
		htmlBody[0].style.backgroundColor = "#323232"
		var body = document.getElementsByTagName("body");
		body[0].style.backgroundColor = "#323232"
		var content = document.getElementByID("content");
		content.style.backgroundColor = "#262626";
	} else {
		content.style.backgroundColor = "#424242"
	}
}

// https://www.davidebarranca.com/2014/01/html-panels-tips-2-including-multiple-jsx/
function loadJSX(fileName) {
    var csInterface = new CSInterface();
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/host/";
    csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
}
