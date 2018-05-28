/**
 * @requires CSInterface.js
 * @requires cookies.js
 *
 * history.js
 *
 * @function loadLibraries()
 *	 @return  injects app-specific .jsx files
 *
 * @function addToHistory(location,color)
 *	 @param location	add to 'start' or 'end' of active colorHistory array.
 *	 @param color			new hexadecimal ('ff0000') value to add.
 *
 * @function removeFromHistory(location)
 *	 @param location	remove from 'start' or 'end' of active colorHistory array.
 *
 * @function nextHistory()
 *	 @return  convertCookiesToHistory(historyIndex++)
 *
 * @function previousHistory()
 *	 @return  convertCookiesToHistory(historyIndex--)
 *
 */


// global //////////////////////////
var csInterface = new CSInterface();
	var appName = csInterface.hostEnvironment.appName;
	// var foreground = document.getElementById("foreground");
	// var background = document.getElementById("background");
	// var backgroundStroke = document.getElementById('bgStroke');
	// var reloadButton = document.getElementById('reload');
	// var sendButton = document.getElementById('send');
	// var takeButton = document.getElementById('take');
	// var upButton = document.getElementById('up');
	// var downButton = document.getElementById('down');
	// var allControls = document.getElementById('footer');
	window.onload = assignByApp();
	window.onload = loadLibraries();
	window.onload = hideControls();
	window.onload = colorFix();
	var historyIndex = 1;
////////////////////////////////////

//

// head ////////////////////////////
convertCookiesToHistory(historyIndex - 1);

function loadLibraries() {
	loadJSX("libAI.jsx");
	loadJSX("libJS.jsx");
	loadJSX("libAE.jsx");
}

// function assignByApp() {
// 	if (appName === "PHXS") {
// 		foreground.addEventListener("click", function(){csInterface.evalScript('fgColorFromPS();', fgResult)}, false);
// 		background.addEventListener("click", function(){csInterface.evalScript('bgColorFromPS();', bgResult)}, false);
// 	} else if (appName === "ILST") {
// 		setInterval(function(){scanIsFill();}, 200);
// 		foreground.addEventListener("click", function(){csInterface.evalScript(`getAIFillColor();`, fgResult)}, false);
// 		background.addEventListener("click", function(){csInterface.evalScript(`getAIStrokeColor();`, bgResult)}, false);
// 	}
// }

// function fgResult(result){
// 	foreground.style.backgroundColor = "#" + result;
// 	// alert(result);
// }
//
// function bgResult(result){
// 	background.style.backgroundColor = "#" + result;
// 	// alert(result);
// }
////////////////////////////////////

//

// cookies /////////////////////////
function addToHistory(location, color) {
	addRandomCookie(historyIndex);
	// updateCookies(historyIndex, "add", location, color);
	console.log("History " + historyIndex + " is: " + getCookie("colorHistory" + historyIndex));
}

function removeFromHistory(location) {
	updateCookies(historyIndex, "remove", location, "000000");
	console.log("History " + historyIndex + " is: " + getCookie("colorHistory" + historyIndex));
}

function nextHistory(){
	if (historyIndex >= 3) {
		historyIndex = 0;
	}
	convertCookiesToHistory(historyIndex++);
	console.log("history index:" + historyIndex);
	console.log(colorHistory);
}

function previousHistory(){
	if (historyIndex <= 1) {
		historyIndex = 4;
	}
	historyIndex--;
	convertCookiesToHistory(historyIndex - 1);
	console.log("history index:" + historyIndex);
	console.log(colorHistory);
}
///////////////////////////////////

//

// Illustrator ////////////////////
function scanIsFill() {
	// console.log("working");
	csInterface.evalScript('switchScanner();', scanResult)
}

function scanResult(params){
	if (params === '1') {
		foreground.style.zIndex = "1"
		foreground.style.backgroundColor = "#646464";
		foreground.style.borderRadius = "3rem";
		background.style.backgroundColor = "#323232";
		background.style.borderRadius = "0px";
		backgroundStroke.style.borderRadius = "0px";
	} else {
		foreground.style.zIndex = "0"
		foreground.style.backgroundColor = "#323232";
		foreground.style.borderRadius = "0px";
		background.style.backgroundColor = "#646464";
		background.style.borderRadius = "3rem";
		backgroundStroke.style.borderRadius = "3rem";
		// console.log("0");
	}
}

// sendButton.addEventListener("mouseover", function( event ) {
// 	var newColor = "ff3333";
// 	csInterface.evalScript(`lowerOpacity('${newColor}');`)
// 	event.target.style.backgroundColor = "#" + newColor;
// }, false);
//
// sendButton.addEventListener("mouseout", function( event ) {
// 	csInterface.evalScript(`returnOpacity();`)
// 	event.target.style.backgroundColor = "#ff3333";
// }, false);
//
// takeButton.addEventListener("mouseover", function( event ) {
// 	var newColor = "645cff"; // Placeholder for testing
// 	csInterface.evalScript(`lowerOpacity('${newColor}');`)
// 	event.target.style.backgroundColor = "#" + newColor;
// }, false);
//
// takeButton.addEventListener("mouseout", function( event ) {
// 	var newColor = "645cff"; // Placeholder for testing
// 	csInterface.evalScript(`returnOpacity();`)
// 	event.target.style.backgroundColor = "#645cff";
// }, false);

// sendButton.addEventListener("click", function(){
// 	var newColor = "ff0000";
// 	csInterface.evalScript(`colorFromIllustrator();`, returnColor)
// }, false);

// reloadButton.addEventListener("click", function(){
	// var newColor = "66ff66";
	// csInterface.evalScript(`giveColor('${newColor}');`)
	// event.target.style.backgroundColor = "#66ff66";
// }, false);

function colorFix(){
	if (appName === "ILST") {
		var htmlBody = document.getElementsByTagName("html");
		htmlBody[0].style.backgroundColor = "#323232"
		var body = document.getElementsByTagName("body");
		body[0].style.backgroundColor = "#323232"
		var content = document.getElementById("content");
		content.style.backgroundColor = "#262626";
		var footer = document.getElementById('footer');
		footer.style.backgroundColor = "#323232";
	} else {
		content.style.backgroundColor = "#424242"
	}
}
///////////////////////


// footer /////////////
// https://www.davidebarranca.com/2014/01/html-panels-tips-2-including-multiple-jsx/
function loadJSX(fileName) {
    var csInterface = new CSInterface();
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/host/";
    csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
}
