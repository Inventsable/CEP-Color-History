/**
 * @requires CSInterface.js
 * @requires exLibs.js
 * @requires cookies.js
 * @requires colorlogic.js
 * @requires swatches.js
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
	var historyIndex = 1;

	var AIpanel_nav = "#262626";
	var AIpanel_bg = "#323232";
	var PSpanel_nav = "#2e2e2e";
	var PSpanel_bg = "#535353";
	var AEpanel_nav = "#161616";
	var AEpanel_bg = "#232323";

	var swatch = document.getElementById('rowString').childNodes;

	window.onload = assignByApp();
	window.onload = loadLibraries();

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

function scanningToggle(params) {
	if (params === "On") {
		if (appName === "PHXS") {
			timer = setInterval(function(){scanPSColors();}, 200);
		} else if (appName === "ILST") {
			toggleTimer = setInterval(function(){scanIsFill();}, 200);
			timer = setInterval(function(){scanAIColors();}, 200);
		}
		console.log("Scanning on");
	} else {
		if (appName === "ILST") {
			clearInterval(toggleTimer);
		}
		clearInterval(timer);
		console.log("Scanning off");
	}
}

function assignByApp() {
	if (appName === "PHXS") {
		foreground.addEventListener("click", function(){colorSetFG();}, false);
		background.addEventListener("click", function(){colorSetBG();}, false);
		foreground.style.backgroundColor = '#7e7e7e';
	} else if (appName === "ILST") {
		recolorHandles();
		foreground.style.backgroundColor = '#b7b7b7';
		background.style.backgroundColor = '#515151';
		// foreground.addEventListener("click", function(){csInterface.evalScript(`fillColorFromAI();`, fgResult)}, false);
		// background.addEventListener("click", function(){csInterface.evalScript(`strokeColorFromAI();`, bgResult)}, false);
	} else if (appName === "AEFT") {
		foreground.addEventListener("click", function(){csInterface.evalScript(`msgAE();`, msgResult)}, false);
		background.addEventListener("click", function(){location.reload();}, false);
	}
	colorFix();
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
	csInterface.evalScript('strokeColorFromAI();', checkIfColor);
	csInterface.evalScript('fillColorFromAI();', checkIfColor);
}

function checkIfColor(newColor){
	if(newColor.length > 6) {
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
	resetCookie(`'${historyIndex}'`);
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
	}
	console.log(`new history is: ${colorHistory}`);
	updateHistory();
}

function rewriteColors(params) {
	var insert = [];
	console.log(`Deleting history: ${colorHistory}`);
	while (colorHistory.length > 0) {
		colorHistory.pop();
	}
	insert = params.split(",");
	for (var index = 0; index < insert.length; index++)
	{
		colorHistory.push(insert[index]);
	}
	console.log(`Snatched: ${colorHistory}`);
	colorHistory = sortInSpectrum();
	updateHistory();
}

function updateHistory(){
	var thisHistory = "colorHistory" + historyIndex;
	healHistory();
	setCookie(thisHistory, colorHistory, 30);
	hideSwatchesByChild();
	colorSwatchesByChild();
}

function addToHistory(location, color) {
	addNewSwatch();
	healHistory();
	updateCookies(historyIndex, "add", location, color);
	colorSwatchesByChild();
	console.log("History " + historyIndex + " is: " + getCookie("colorHistory" + historyIndex));
}

function removeFromHistory(location) {
	removeLastSwatch();
	healHistory();
	updateCookies(historyIndex, "remove", location, "000000");
	hideSwatchesByChild();
	colorSwatchesByChild();
	console.log("History " + historyIndex + " is: " + getCookie("colorHistory" + historyIndex));
}

function nextHistory(){
	if (historyIndex >= 3) {
		historyIndex = 0;
	}
	historyIndex++;
	convertCookiesToHistory(historyIndex);
	healHistory();
	// showSwatches();
	hideSwatchesByChild();
	colorSwatchesByChild();
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
	healHistory();
	hideSwatchesByChild();
	colorSwatchesByChild();
	console.log("history index:" + historyIndex);
	console.log(colorHistory);
}
///////////////////////////////////

//

// Illustrator ////////////////////
function scanIsFill() {
	csInterface.evalScript('switchScanner();', scanResult)
}

function scanResult(params){
	if (appName === "ILST") {
		if (params === '1') {
			var bounds = document.getElementById('bounds');
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
		}
	}
}

function colorFix(){
	var AIpanel_nav = "#262626";
	var AIpanel_bg = "#323232";
	var PSpanel_nav = "#2e2e2e";
	var PSpanel_bg = "#535353";
	var AEpanel_nav = "#161616";
	var AEpanel_bg = "#232323";
	var htmlBody = document.getElementsByTagName("html");
	var body = document.getElementsByTagName("body");
	var nav = document.getElementById("nav");
	var historyPick = document.getElementById('historyPick');
	var content = document.getElementById("content");
	var rowString = document.getElementsByClassName("rowString");
	historyPick.style.backgroundColor = "transparent";
	backArea.style.backgroundColor = "transparent";
	backArrow.style.borderColor = "transparent";
	forwardArea.style.backgroundColor = "transparent";
	forwardArrow.style.borderColor = "transparent";
	if (appName === "ILST") {
		htmlBody[0].style.backgroundColor = "#323232";
		body[0].style.backgroundColor = AIpanel_bg;
		nav.style.backgroundColor = AIpanel_nav;
		content.style.backgroundColor = AIpanel_bg;
		rowString[0].style.backgroundColor = AIpanel_bg;
		innerStroke.style.display = "block";
	} else if (appName === "PHXS") {
		htmlBody[0].style.backgroundColor = PSpanel_bg;
		body[0].style.backgroundColor = PSpanel_bg;
		nav.style.backgroundColor = PSpanel_nav;
		content.style.backgroundColor = PSpanel_bg;
		rowString[0].style.backgroundColor = PSpanel_bg;
		innerStroke.style.display = "none";
	} else if (appName === "AEFT") {
		htmlBody[0].style.backgroundColor = AEpanel_bg;
		body[0].style.backgroundColor = AEpanel_bg;
		nav.style.backgroundColor = AEpanel_nav;
		content.style.backgroundColor = AEpanel_bg;
		rowString[0].style.backgroundColor = AEpanel_bg;
		innerStroke.style.display = "none";
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
	event.target.style.borderLeftWidth = "7px";
	event.target.style.left = "1px";
});
forwardArea.addEventListener("mouseout", function( event ) {
	event.target.style.borderLeftWidth = "5px";
	event.target.style.left = "0px";
});

backArea.addEventListener("mouseover", function( event ) {
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
	trimUpArrow.style.borderTopWidth = "7px";
	trimUpArrow.style.borderTopColor = "rgba(255, 255, 255, 0.75)";
	trimUpArrow.style.top = "1px";
	var swatch = document.getElementById('rowString').childNodes;
	var thisCross = swatch[0].childNodes;
	if (appName === "ILST") {
		swatch[0].style.backgroundColor = AIpanel_bg;
	} else if (appName === "PHXS") {
		swatch[0].style.backgroundColor = PSpanel_bg;
	} else if (appName === "AEFT") {
		swatch[0].style.backgroundColor = AEpanel_bg;
	}
	swatch[0].style.borderColor = "red";
	swatch[0].style.borderWidth = "1.5px";
});

trimUp.addEventListener("mouseout", function( event ) {
	trimUpArrow.style.borderTopWidth = "5px";
	trimUpArrow.style.borderTopColor = "rgba(50, 50, 50, 1)";
	trimUpArrow.style.borderTopColor = "transparent";
	trimUpArrow.style.top = "0px";
	var swatch = document.getElementById('rowString').childNodes;
	swatch[0].style.backgroundColor = "#" + colorHistory[0];
	swatch[0].style.borderColor = "transparent";
	swatch[0].style.borderWidth = "0px";
});

trimDown.addEventListener("mouseover", function( event ) {
	event.target.style.backgroundColor = "transparent";
	trimDownArrow.style.borderBottomWidth = "7px";
	trimDownArrow.style.borderBottomColor = "rgba(255, 255, 255, 0.75)";
	trimDownArrow.style.bottom = "1px";
	if (appName === "ILST") {
		swatch[(colorHistory.length - 1)].style.backgroundColor = AIpanel_bg;
	} else if (appName === "PHXS") {
		swatch[(colorHistory.length - 1)].style.backgroundColor = PSpanel_bg;
	} else if (appName === "AEFT") {
		swatch[(colorHistory.length - 1)].style.backgroundColor = AEpanel_bg;
	}
	swatch[(colorHistory.length - 1)].style.borderColor = "red";
	swatch[(colorHistory.length - 1)].style.borderWidth = "1.5px";
});

trimDown.addEventListener("mouseout", function( event ) {
	event.target.style.backgroundColor = "transparent";
	trimDownArrow.style.borderBottomWidth = "5px";
	trimDownArrow.style.borderBottomColor = "transparent";
	trimDownArrow.style.bottom = "0px";
		swatch[(colorHistory.length - 1)].style.backgroundColor = "#" + colorHistory[(colorHistory.length - 1)];
		swatch[(colorHistory.length - 1)].style.borderColor = "transparent";
		swatch[(colorHistory.length - 1)].style.borderWidth = "0px";
});
