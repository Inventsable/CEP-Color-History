/**
 * @requires CSInterface.js
 * @requires cookies.js
 *
 * main.js
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
 *
 */

// global //////////////////////////
var csInterface = new CSInterface();
	var appName = csInterface.hostEnvironment.appName;
	var foreground = document.getElementById("foreground");
	var background = document.getElementById("background");
	var innerStroke = document.getElementById('innerStroke');
	var trimUp = document.getElementById('trimUp');
	var trimDown = document.getElementById('trimDown');
	var trimUpArrow = document.getElementById('trimUp_Arrow');
	var trimDownArrow = document.getElementById('trimDown_Arrow');

	var historyPick = document.getElementById('historyPick');
	var forwardArea = document.getElementById('forwardArea');
	var forwardArrow = document.getElementById('forward_Arrow');
	var backArea = document.getElementById('backArea');
	var backArrow = document.getElementById('back_Arrow');
	var timer;
	var toggleTimer;
	var groundState = 1;
	var count = 0;

	// var backgroundStroke = document.getElementById('bgStroke');
	// var reloadButton = document.getElementById('reload');
	// var sendButton = document.getElementById('send');
	// var takeButton = document.getElementById('take');
	// var upButton = document.getElementById('up');
	// var downButton = document.getElementById('down');
	// var allControls = document.getElementById('footer');

	window.onload = assignByApp();
	window.onload = loadLibraries();
	window.onload = snippingToggle("Off");
	// window.onload = hideControls();
	// window.onload = readHistory();

	var historyIndex = 1;
////////////////////////////////////

// head ////////////////////////////
convertCookiesToHistory(historyIndex);

function loadLibraries() {
	if (appName === "AEFT") {
		loadJSX("libAE.jsx");
		console.log("ae only");
	} else {
		loadJSX("libAI.jsx");
		loadJSX("libPS.jsx");
	}
}

function alertResult(params) {
	alert(params);
}


function snippingToggle(params) {
	var swatch = document.getElementById('rowString').childNodes;
	for (var index = 1; index <= maxNumber; index++) {
		var thisHandle = document.getElementById('handleSnip' + index);
		if (params === "On") {
			thisHandle.style.display = "block";
		} else {
			thisHandle.style.display = "none";
		}
		// var sliders = swatch[index].childNodes;
		// var handles = sliders[1].childNodes;
		// if (params === "On") {
		// 	sliders[1].style.display = "block";
		// 	handles[0].style.display = "block";
		// } else {
		// 	sliders[1].style.display = "none";
		// 	handles[0].style.display = "none";
		// }
	}
	if (params === "On") {
		updateHistory();
	}
}


function scannerToggle(params) {
	// var timer;
	// var toggleTimer;
	if (params === "On") {
		if (appName === "PHXS") {
			timer = setInterval(function(){scanPSColors();}, 200);
		} else if (appName === "ILST") {
			toggleTimer = setInterval(function(){scanIsFill();}, 200);
			timer = setInterval(function(){scanAIColors();}, 200);
		}
		console.log("scanning on");
	} else {
		if (appName === "ILST") {
			clearInterval(toggleTimer);
		}
		clearInterval(timer);
		console.log("scanning off");
	}
}


function assignByApp() {
	if (appName === "PHXS") {
		// csInterface.evalScript('bgColorFromPS();', alertResult);
		// grabPSColors();
		// setInterval(function(){scanPSColors();}, 200);
		scannerToggle("On");
		// foreground.addEventListener("click", function(){csInterface.evalScript('fgColorFromPS();', fgResult)}, false);
		// background.addEventListener("click", function(){csInterface.evalScript('bgColorFromPS();', bgResult)}, false);
		foreground.addEventListener("click", function(){colorSetFG();}, false);
		background.addEventListener("click", function(){colorSetBG();}, false);
		foreground.style.backgroundColor = '#7e7e7e';
		// foreground.addEventListener("click", function(){csInterface.evalScript('fgColorFromPS();', fgResult)}, false);
		// background.addEventListener("click", function(){csInterface.evalScript('bgColorFromPS();', bgResult)}, false);
	} else if (appName === "ILST") {
		scannerToggle("On");
		recolorHandles();
		// setInterval(function(){scanIsFill();}, 200);
		// setInterval(function(){scanAIColors();}, 200);
		foreground.style.backgroundColor = '#b7b7b7';
		background.style.backgroundColor = '#515151';
		foreground.addEventListener("click", function(){csInterface.evalScript(`fillColorFromAI();`, fgResult)}, false);
		background.addEventListener("click", function(){csInterface.evalScript(`strokeColorFromAI();`, bgResult)}, false);
	} else if (appName === "AEFT") {
		foreground.addEventListener("click", function(){csInterface.evalScript(`msgAE();`, msgResult)}, false);
		background.addEventListener("click", function(){location.reload();}, false);
		// colorHistory = ["ff0000", "00AAFF", "000000", "ffffff", "AA00FF"]
		// updateHistory();
	}
	colorFix();
}

function msgResult(params){
	console.log(params);
}

function fgResult(result){
	foreground.style.backgroundColor = "#" + result;
}
function bgResult(result){
	background.style.backgroundColor = "#" + result;
}

function colorSetFG(){
	if (isOdd(groundState)){
		console.log(`Foreground is already set.`);
	} else {
		groundState++;
		foreground.style.backgroundColor = '#7e7e7e';
		background.style.backgroundColor = '#535353';
		console.log(`Foreground is set to ${groundState}`);
	}
}

function colorSetBG(){
	if (isEven(groundState)){
		console.log(`Background is already set.`);
	} else {
		groundState++;
		foreground.style.backgroundColor = '#535353';
		background.style.backgroundColor = '#7e7e7e';
		console.log(`Background set to ${groundState}`);
	}
}

////////////////////////////////////

function scanPSColors(){
	// evalScript('JSX function as string', JS function that receives returned data)
	csInterface.evalScript('getPSForegroundColor();', checkIfColor);
	csInterface.evalScript('getPSBackgroundColor();', checkIfColor);
}

function scanAIColors(){
	// csInterface.evalScript('colorFromIllustrator();', checkIfColor);
	csInterface.evalScript('strokeColorFromAI();', checkIfColor);
	csInterface.evalScript('fillColorFromAI();', checkIfColor);
	// console.log(colorHistory);
}

function checkIfColor(newColor){
	if(newColor.length > 6) {
		// console.log("Undefined.");
	} else {
		var fails = 0;
		for (var index = 0; index < colorHistory.length; index++){
			if (newColor !== colorHistory[index]) {
				fails++;
			} else {
				console.log("No color change.");
				break;
			}
			if (fails === (colorHistory.length)) {
					fails = 0;
					addToHistory("start", newColor)
					console.log(`//CEP: ${newColor} added to history.`);
			}
		}
	}
}


// cookies /////////////////////////
function showColorHistory(){
	console.log(`colorhistory${historyIndex} is ${colorHistory}`);
}

function resetThisHistory(){
	// var thisHistory = "colorHistory" + historyIndex;
	// console.log(`resetCookie('${historyIndex}')`);
	resetCookie(`'${historyIndex}'`);
	// convertCookiesToHistory(`'${historyIndex}'`);
	updateHistory();
	console.log("reset");
}


function snatchColors(){
		csInterface.evalScript('allArtColors();', rewriteColors);
}

function snatchSelectedColors(){
		csInterface.evalScript('selectedArtColors();', appendColors);
}


function appendColors(params) {
	// while (append.length > 0) {
	// 	append.pop();
	// }
	// console.log(params);
	var append = [];
	console.log(`old history is: ${colorHistory}`);
	append = params.split(",");
	for (var index = 0; index < append.length; index++)
	{
		var fails = 0;
		for (var indexA = 0; indexA < colorHistory.length; indexA++) {
			if (append[index] !== colorHistory[indexA]) {
				fails++;
			} else {
				break;
			}
			if (fails === colorHistory.length) {
				colorHistory.push(append[index]);
			}
		}
		// colorHistory.push(insert[index]);
	}
	console.log(`new history is: ${colorHistory}`);
	updateHistory();
}

function rewriteColors(params) {
	// while (insert.length > 0) {
	// 	insert.pop();
	// }
	var insert = [];
	console.log(`old history is: ${colorHistory}`);
	while (colorHistory.length > 0) {
		colorHistory.pop();
	}
	insert = params.split(",");
	for (var index = 0; index < insert.length; index++)
	{
		colorHistory.push(insert[index]);
	}
	console.log(`new history is: ${colorHistory}`);
	updateHistory();
}

function updateHistory(){
	var thisHistory = "colorHistory" + historyIndex;
	setCookie(thisHistory, colorHistory, 30);
	hideSwatches();
	hideSwatchesByChild();
	colorSwatchesByChild();
	resetAllCrossesAndStrokes();
	fixLastHighlight();
	fixFirstHandle();
	refreshAllHandles();
	// updateCookies(historyIndex, "add", location, color);
}

function addToHistory(location, color) {
	addNewSwatch();
	showSwatches();
	updateCookies(historyIndex, "add", location, color);
	colorSwatchesByChild();
	resetAllCrossesAndStrokes();
	fixLastHighlight();
	fixFirstHandle();
	refreshAllHandles();
	// hideCrossesInCenter();
	console.log("History " + historyIndex + " is: " + getCookie("colorHistory" + historyIndex));
}

function removeFromHistory(location) {
	removeLastSwatch();
	updateCookies(historyIndex, "remove", location, "000000");
	hideSwatches();
	hideSwatchesByChild();
	colorSwatchesByChild();
	resetAllCrossesAndStrokes();
	fixLastHighlight();
	fixFirstHandle();
	refreshAllHandles();
	// hideCrossesInCenter();
	console.log("History " + historyIndex + " is: " + getCookie("colorHistory" + historyIndex));
}

function nextHistory(){
	if (historyIndex >= 3) {
		historyIndex = 0;
	}
	historyIndex++;
	convertCookiesToHistory(historyIndex);
	hideSwatches();
	showSwatches();
	hideSwatchesByChild();
	colorSwatchesByChild();
	resetAllCrossesAndStrokes();
	fixLastHighlight();
	fixFirstHandle();
	// hideCrossesInCenter();
	console.log("history index:" + historyIndex);
	console.log(colorHistory);
}

function addRandom(){
	var randomColor = "000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
	addNewSwatch();
	updateCookies(historyIndex, "add", "start", randomColor);
	colorSwatchesByChild();
	console.log("History " + historyIndex + " is: " + getCookie("colorHistory" + historyIndex));
}

function previousHistory(){
	if (historyIndex <= 1) {
		historyIndex = 4;
	}
	historyIndex--;
	convertCookiesToHistory(historyIndex);
	hideSwatches();
	showSwatches();
	hideSwatchesByChild();
	colorSwatchesByChild();
	resetAllCrossesAndStrokes();
	// hideCrossesInCenter();
	// colorSwatches();
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
	if (appName === "ILST") {
		if (params === '1') {
			var bounds = document.getElementById('bounds');
			// bounds.style.left = "1px";
			foreground.style.zIndex = "1"
			foreground.style.backgroundColor = "#b7b7b7";
			foreground.style.borderRadius = ".25rem";
			background.style.backgroundColor = "#515151";
			background.style.borderRadius = "0px";
			background.style.top = "-7px";
			background.style.left = "7px";
			innerStroke.style.borderRadius = "0px";
			background.style.borderColor = "#b7b7b7";
			innerStroke.style.borderColor = "#b7b7b7";
		} else {
			foreground.style.zIndex = "0"
			foreground.style.backgroundColor = "#515151";
			foreground.style.borderColor = "#b7b7b7";
			foreground.style.borderRadius = "0px";
			background.style.top = "-7px";
			background.style.left = "7px";
			background.style.backgroundColor = "#b7b7b7";
			background.style.borderRadius = ".25rem";
			innerStroke.style.borderRadius = ".25rem";
			background.style.borderColor = "#b7b7b7";
			innerStroke.style.borderColor = "#b7b7b7";
			// console.log("0");
		}
	}
}

function colorFix(){
	if (appName === "ILST") {
		var htmlBody = document.getElementsByTagName("html");
		htmlBody[0].style.backgroundColor = "#323232";
		var body = document.getElementsByTagName("body");
		body[0].style.backgroundColor = "#323232";
		var nav = document.getElementById("nav");
		nav.style.backgroundColor = "#262626";
		var content = document.getElementById("content");
		content.style.backgroundColor = "#323232";
		var rowString = document.getElementsByClassName("rowString");
		rowString[0].style.backgroundColor = "#323232";
		innerStroke.style.display = "block";
		// innerStroke.style.zIndex = "1";
		// var footer = document.getElementById('footer');
		// footer.style.backgroundColor = "#323232";
	} else if (appName === "PHXS") {
		var content = document.getElementById("content");
		backArea.style.backgroundColor = "#2e2e2e";
		forwardArea.style.backgroundColor = "#2e2e2e";
		content.style.backgroundColor = "#535353";
		innerStroke.style.display = "none";
	} else if (appName === "AEFT") {
		var htmlBody = document.getElementsByTagName("html");
		htmlBody[0].style.backgroundColor = "#232323";
		var body = document.getElementsByTagName("body");
		body[0].style.backgroundColor = "#232323";
		var nav = document.getElementById("nav");
		nav.style.backgroundColor = "#161616";
		var content = document.getElementById("content");
		content.style.backgroundColor = "#232323";
		var rowString = document.getElementsByClassName("rowString");
		rowString[0].style.backgroundColor = "#232323";
		innerStroke.style.display = "none";
		var historyPick = document.getElementById('historyPick');
		historyPick.style.backgroundColor = "transparent";
		backArea.style.backgroundColor = "transparent";
		backArrow.style.borderColor = "transparent";
		forwardArea.style.backgroundColor = "transparent";
		forwardArrow.style.borderColor = "transparent";
		resizePanelForAE();
	}
}
///////////////////////

function resizePanelForAE(){
 var fullsize = document.getElementById('content');
 fullsize.style.width = "34px";
var nav = document.getElementById('nav');
nav.style.paddingLeft = "0px";
nav.style.paddingRight = "0px";
var rowString = document.getElementById('rowString');
rowString.style.width = "90%";
rowString.style.paddingLeft = "0px";
rowString.style.paddingRight = "0px";
rowString.style.marginLeft = "0px";
rowString.style.marginRight = "0px";
var swatch = document.getElementsByClassName('swatch');
for (var index = 0; index < swatch.length; index++) {
	swatch[index].style.width = "100%";
	var thisCross = swatch[index].childNodes;
	thisCross[1].style.left = "5px";
	thisCross[1].style.bottom = "7px";
	thisCross[1].style.height = "180%";
	thisCross[1].style.transform = "rotate(57deg)";
}
trimUp.style.justifyContent = "center";
trimUp.style.marginLeft = "0px";
trimDown.style.justifyContent = "center";
trimDown.style.marginLeft = "0px";
}


historyPick.addEventListener("mouseover", function( event ) {
	backArrow.style.borderRightColor = "rgba(255, 255, 255, 0.75)";
	forwardArrow.style.borderLeftColor = "rgba(255, 255, 255, 0.75)";
});
historyPick.addEventListener("mouseout", function( event ) {
	backArrow.style.borderRightColor = "transparent";
	forwardArrow.style.borderLeftColor = "transparent";
});

forwardArea.addEventListener("click", function(){
	nextHistory();
	count++;
}, false);

backArea.addEventListener("click", function(){
	previousHistory();
}, false);

forwardArea.addEventListener("mouseover", function( event ) {
	// console.log("working");
	event.target.style.borderLeftWidth = "7px";
	event.target.style.left = "1px";
	// event.target.style.borderRightColor = "rgba(255, 255, 255, 0.75)";
});
forwardArea.addEventListener("mouseout", function( event ) {
	event.target.style.borderLeftWidth = "5px";
	event.target.style.left = "0px";
});

backArea.addEventListener("mouseover", function( event ) {
	// console.log("working");
	event.target.style.borderRightWidth = "7px";
	event.target.style.right = "1px";
});
backArea.addEventListener("mouseout", function( event ) {
	event.target.style.borderRightWidth = "5px";
	event.target.style.right = "0px";
});


trimUp.addEventListener("click", function(){
	removeFromHistory("start");
}, false);

trimDown.addEventListener("click", function(){
	removeFromHistory("end");
}, false);

function fixFirstHandle(){
	var swatch = document.getElementById('rowString').childNodes;
	// swatch[0].addEventListener("mouseover", function( event ) {
		// event.target.style.borderColor = "rgba(255, 255, 255, 0.75)";
		var handle = swatch[0].childNodes;
		handle[1].style.display = "none";
		var slider = handle[0].childNodes;
		slider[0].style.borderColor = "transparent";
		var lastHandle = swatch[(colorHistory.length - 1)].childNodes;
		lastHandle[1].style.display = "none";
		var lastSlider = lastHandle[0].childNodes;
		lastSlider[0].style.borderColor = "transparent";
		// handle[0].style.borderColor = "rgba(255, 255, 255, .25)";
	};

function refreshAllHandles(){
	var swatch = document.getElementById('rowString').childNodes;
	for (var index = 0; index < colorHistory.length; index++) {
		var thisHandle = swatch[index].childNodes;
		thisHandle[1].style.borderColor = 'transparent';
		var thisSlider = thisHandle[0].childNodes;
		thisSlider[0].style.borderColor = 'transparent';
	}
}

function fixLastHighlight(){
	var swatch = document.getElementById('rowString').childNodes;
	swatch[(colorHistory.length - 1)].addEventListener("mouseover", function( event ) {
		// event.target.style.borderColor = "rgba(255, 255, 255, 0.75)";
		event.target.style.borderColor = "transparent";
		var handle = swatch[(colorHistory.length - 1)].childNodes;
		handle[1].style.display = 'none';
		// handle[0].style.borderColor = "rgba(255, 255, 255, .25)";
	});

	swatch[(colorHistory.length - 1)].addEventListener("mouseout", function( event ) {
		event.target.style.borderColor = "transparent";
		var handle = swatch[(colorHistory.length - 1)].childNodes;
		handle[1].style.display = 'block';
	});
}

var swatch = document.getElementById('rowString').childNodes;
swatch[0].addEventListener("mouseover", function( event ) {
	event.target.style.borderColor = "transparent";
	var handle = swatch[0].childNodes;
	handle[1].style.display = 'none';
});

swatch[0].addEventListener("mouseout", function( event ) {
	event.target.style.borderColor = "transparent";
	var handle = swatch[0].childNodes;
	handle[1].style.display = 'block';
});

trimUp.addEventListener("mouseover", function( event ) {
	event.target.style.backgroundColor = "transparent";
	trimUpArrow.style.borderTopWidth = "7px";
	trimUpArrow.style.borderTopColor = "rgba(255, 255, 255, 0.75)";
	trimUpArrow.style.top = "1px";
	var swatch = document.getElementById('rowString').childNodes;
	var thisCross = swatch[0].childNodes;
	if (appName === "ILST") {
		swatch[0].style.backgroundColor = "#323232";
	} else if (appName === "PHXS") {
		swatch[0].style.backgroundColor = "#535353";
	} else if (appName === "AEFT") {
		swatch[0].style.backgroundColor = "#232323";
	}
	swatch[0].style.borderColor = "red";
	thisCross[1].style.borderColor = "red";
	swatch[0].style.borderWidth = "1.5px";
	thisCross[1].style.borderWidth = "1px";
	thisCross[1].style.display = "flex";
});

trimUp.addEventListener("mouseout", function( event ) {
	event.target.style.backgroundColor = "transparent";
	trimUpArrow.style.borderTopWidth = "5px";
	trimUpArrow.style.borderTopColor = "rgba(50, 50, 50, 1)";
	trimUpArrow.style.borderTopColor = "transparent";
	trimUpArrow.style.top = "0px";
	var swatch = document.getElementById('rowString').childNodes;
	swatch[0].style.backgroundColor = "#" + colorHistory[0];
	swatch[0].style.borderColor = "transparent";
	var thisCross = swatch[0].childNodes;
	var thisHandle = thisCross[0].childNodes;
	thisCross[1].style.borderColor = "transparent";
	thisHandle[0].style.borderColor = "transparent";
	swatch[0].style.borderWidth = "0px";
	thisCross[1].style.borderWidth = "0px";
	thisCross[1].style.display = "none";
});

trimDown.addEventListener("mouseover", function( event ) {
	event.target.style.backgroundColor = "transparent";
	trimDownArrow.style.borderBottomWidth = "7px";
	trimDownArrow.style.borderBottomColor = "rgba(255, 255, 255, 0.75)";
	trimDownArrow.style.bottom = "1px";
	var swatch = document.getElementById('rowString').childNodes;
	if (appName === "ILST") {
		swatch[(colorHistory.length - 1)].style.backgroundColor = "#323232";
	} else if (appName === "PHXS") {
		swatch[(colorHistory.length - 1)].style.backgroundColor = "#535353";
	} else if (appName === "AEFT") {
		swatch[(colorHistory.length - 1)].style.backgroundColor = "#232323";
	}
	swatch[(colorHistory.length - 1)].style.borderColor = "red";
	swatch[(colorHistory.length - 1)].style.borderWidth = "1.5px";
	var thisCross = swatch[(colorHistory.length - 1)].childNodes;
	thisCross[1].style.borderColor = "red";
	thisCross[1].style.borderWidth = "1px";
});

trimDown.addEventListener("mouseout", function( event ) {
	event.target.style.backgroundColor = "transparent";
	trimDownArrow.style.borderBottomWidth = "5px";
	trimDownArrow.style.borderBottomColor = "transparent";
	trimDownArrow.style.bottom = "0px";
	var swatch = document.getElementById('rowString').childNodes;
	// if (count < 1) {
		swatch[(colorHistory.length - 1)].style.backgroundColor = "#" + colorHistory[(colorHistory.length - 1)];
		swatch[(colorHistory.length - 1)].style.borderColor = "transparent";
		swatch[(colorHistory.length - 1)].style.borderWidth = "0px";
		var thisCross = swatch[(colorHistory.length - 1)].childNodes;
		var thisHandle = thisCross[0].childNodes;
		thisCross[1].style.borderColor = "transparent";
		thisHandle[0].style.borderColor = "transparent";
		thisCross[1].style.borderWidth = "0px";
		thisHandle[0].style.borderWidth = "0px";
	fixLastHighlight();
});


function hideCrossesInCenter(){
	var swatch = document.getElementById('rowString').childNodes;
	for (var index = 1; index < colorHistory.length; index++) {
		var thisCross = swatch[index].childNodes;

		thisCross[1].style.borderColor = "transparent";
		console.log(index);
	}
}

function resetAllCrossesAndStrokes(){
	var swatch = document.getElementById('rowString').childNodes;
	for (var index = 0; index < colorHistory.length; index++) {
		var thisCross = swatch[index].childNodes;
		thisCross[1].style.borderColor = "transparent";
		swatch[index].style.borderColor = "rgba(255, 255, 255, 0.25)";
	}
}

// function hideCrossesByChild(){
// 	var swatch = document.getElementById('rowString').childNodes;
// 	for (var index = maxNumber; colorHistory.length <= index; index--) {
// 		var thisCross = swatch[index].childNodes;
// 		thisCross[1].style.borderColor = "transparent";
// 		swatch.style.borderColor = "rgba(255, 255, 255, 0.25)";
// 	}
	// swatch[(colorHistory.length - 1)].style.backgroundColor = "grey";
	// var thisCross = swatch[(colorHistory.length - 1)].childNodes;
	// thisCross[1].style.borderColor = "transparent";
// }


//

// https://www.davidebarranca.com/2014/01/html-panels-tips-2-including-multiple-jsx/
function loadJSX(fileName) {
    var csInterface = new CSInterface();
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/host/";
    csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
		console.log("loading " + extensionRoot + fileName);
}

//  https://stackoverflow.com/a/6211660
function isEven(n) {
	 return n % 2 == 0;
}

function isOdd(n) {
	 return Math.abs(n % 2) == 1;
}
