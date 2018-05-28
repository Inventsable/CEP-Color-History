
// ------------------------
// ---------------- Head --
//
	var csInterface = new CSInterface();
	var appName = csInterface.hostEnvironment.appName;
	var style = window.getComputedStyle(document.body);




	var groundState = 1;

	var maxNumber = 30;
	var count = 1;
	var justifyCount = 0;
	var stateSwitchCount = 0;
	var foreground = document.getElementById('foreground');
	var background = document.getElementById('background');
	var controlMaster = document.getElementById('controlMaster');

	// var reloadButton = document.getElementById("reload")
	// reloadButton.addEventListener("click", function(){reloadPanel();}, false);
	foreground.style.backgroundColor = "#7e7e7e";
	foreground.addEventListener("click", function(){colorSetFG();}, false);
	background.addEventListener("click", function(){colorSetBG();}, false);

	// window.onload = generateSwatches("normal");

	// window.onload = colorSwatches();
	window.onload = checkApp();
	window.onload = loadLibraries();
	window.onload = generateSwatches("normal");
	window.onload = generateClickEvents();



function checkApp() {
	if (appName === "PHXS") {
		loadForPhotoshop();
	} else if (appName === "ILST") {
		loadForIllustrator();
	} else if (appName === "AEFT") {
		loadForAfterEffects();
	}
}

function loadForPhotoshop(){
		loadJSX("libPS.jsx");
		// csInterface.evalScript('checkPhotoshop();');
		setInterval(function(){scanPSColors();}, 200);
		console.log("Booting for Photoshop");
		// reloadButton.style.display = "none";
		// grabPSDefaultColors();
}

function loadForIllustrator(){
	// reloadButton.style.display = "none";
	// csInterface.evalScript('checkIllustrator();');
	// setInterval(function(){scanAIColors();}, 200);
	console.log("Booting for Illustrator");
	document.getElementById('content').style.backgroundColor = "#323232";
	var htmlBody = document.getElementsByTagName("html");
	htmlBody[0].style.backgroundColor = "#323232"
	var body = document.getElementsByTagName("body");
	body[0].style.backgroundColor = "#323232"
	document.getElementById('rowString').style.backgroundColor = "#323232";
	grabAIDefaultColors();
}


function	loadForAfterEffects(){
	alert("Loading for After Effects");
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


// ------------------------
// -------- CEP / Photoshop
//

	function scanPSColors(){
		csInterface.evalScript('fgColorFromPS();', checkIfColor);
		csInterface.evalScript('bgColorFromPS();', checkIfColor);
	}


	function scanAIColors(){
		// csInterface.evalScript('getAIFillColor();', checkIfColor);
		// csInterface.evalScript('getAIStrokeColor();', checkIfColor);
		csInterface.evalScript('colorFromIllustrator();', checkIfColor);
		console.log(colorHistory);
	}

//
	function checkIfColor(newColor){
		// console.log("new: " + newColor);
		var fails = 0;
		for (var index = 0; index < colorHistory.length; index++){
			if (newColor !== colorHistory[index]) {
				fails++;
			} else {
				// console.log("//CEP: No color change.");
				break;
			}
			if (fails === (colorHistory.length)) {
					fails = 0;
					colorHistory.unshift(newColor);
					plusSwatch("normal");
					colorSwatches();
					console.log(`//CEP: ${newColor} added to history.`);
			}
		}
	}

// function takeColor(){
// 	csInterface.evalScript('getPSForegroundColor();', makeSwatchFromAppColor)
// }

function makeSwatchFromAppColor(newColor) {
	if (newColor !== colorHistory[(colorHistory.length - 1)]) {
		colorHistory.unshift(newColor);
		plusSwatch("normal");
		colorSwatches();
	} else {
		console.log(`Duplicate colors`);
	}
}

function grabPSDefaultColors(){
	csInterface.evalScript('fgColorFromPS();', makeSwatchFromAppColor);
	csInterface.evalScript('bgColorFromPS();', makeSwatchFromAppColor);
}

function grabAIDefaultColors(){
	csInterface.evalScript('getAIFillColor();', makeSwatchFromAppColor);
	csInterface.evalScript('getAIStrokeColor();', makeSwatchFromAppColor);
}


// ------------------------
// Click events and buttons
//

// Creates click events for initial swatches / starting array length
function generateClickEvents(){
	var swatches = document.getElementsByClassName('swatch');
	for(var index = 0; index < swatches.length; index++) {
		(function(index) {
			swatches[index].addEventListener("click", function() {
				swatchClick(index);
			 })
		})(index);
	}
}
//

// addRandomSwatch("alt");
// minusSwatch("alt");



// creates the parent <ul> and maximum <li>'s, appends them to HTML body.
// Sets the current direction of build and flex-direction
function generateSwatches(direction) {
	var list = document.createElement("ul");
	list.id = "rowString";
	list.classList.add("rowString");
		for (var index = 0; index < maxNumber; index++){
			var listItem = document.createElement("li");
			if (direction === "alt") {
				list.style = "flex-direction: row-reverse; justifyContent: center;";
				var currNumber = ((maxNumber + 1) - (index + 1));
				listItem.id = "swatch" + currNumber;
			} else {
				list.style = "flex-direction: row; justifyContent: center;";
				var currNumber = (index + 1);
				listItem.id = "swatch" + currNumber;
			}
			listItem.classList.add("swatch");
			list.appendChild(listItem);
		};
	  var parentDiv = document.getElementById("content");
		parentDiv.insertBefore(list, controlMaster);
		hideSwatches();
		console.log("Added parent <ul> and default");
		var thisJustify = document.getElementById("rowString");
		thisJustify.style.justifyContent = "center";
		// checkApp();
}


function hideSwatches() {
	for (var index = maxNumber; index > colorHistory.length; index--) {
		var newID = "swatch" + index;
		document.getElementById(newID).style.display = "none";
	}
}


function addClickEvents(direction) {
	if (direction === "alt") {
		for(var index = 1; index <= maxNumber; index++) {
			(function(index) {
				var currSwatch = "swatch" + index;
				document.getElementById(currSwatch).addEventListener("click", function() {
					swatchSecondClick(index, direction);
					// console.log("click active for " + currSwatch);
				 })
			})(index);
		}
	} else {
		for(var index = maxNumber; index > 0; index--) {
			(function(index) {
				var currSwatch = "swatch" + index;
				document.getElementById(currSwatch).addEventListener("click", function() {
					swatchSecondClick(index, direction);
					// console.log("click active for " + currSwatch);
				 })
			})(index);
		}
	}
}

function deleteSwatches(direction) {
	for (var index = 1; index <= maxNumber; index++){
		var pastSwatch = "swatch" + index;
		document.getElementById(pastSwatch).remove();
		console.log("Deleting all <li>s");
	}
}


function rebuildSwatches(direction) {
	var list = document.getElementById('rowString');
	for (var index = 1; index <= maxNumber; index++) {
		var listItem = document.createElement("li");
		if (direction === "alt") {
			list.style = "flex-direction: row-reverse;";
			var currNumber = (maxNumber + 1) - (index);
			listItem.id = "swatch" + currNumber;
		} else {
			list.style = "flex-direction: row;";
			var currNumber = index;
			listItem.id = "swatch" + (currNumber);
		}
		listItem.classList.add("swatch");
		list.appendChild(listItem);
	}
	hideSwatches();
	console.log("Rebuilding all <li>s");
	colorSwatches("normal");
	if (direction === "alt") {
		addClickEvents("alt");
		console.log("added alt events");
	} else {
		addClickEvents("normal");
		console.log("added normal events");
	}
	stateSwitchCount++;
}

//
function swatchClick(index) {
	var currIndex = (index);
	var resultSwatch = "swatch" + (index + 1);
	var assignColor = colorHistory[currIndex];
	if (appName === "PHXS") {
		if (isOdd(groundState)){
			csInterface.evalScript(`fgColorToPS('${assignColor}')`);
			console.log(`Set foreground color to ${resultSwatch}, value:# ${colorHistory[currIndex]}`);
		} else {
			csInterface.evalScript(`bgColorToPS('${assignColor}')`);
			console.log(`Set background color to ${resultSwatch}, value:# ${colorHistory[currIndex]}`);
		}
	} else if (appName === "ILST") {
			csInterface.evalScript(`giveColor('${assignColor}')`);
			console.log(`Set current Illustrator color to ${assignColor}.`);
	}
}


//
function colorSwatches(direction){
	console.log("coloring... " + colorHistory + " with total of " + colorHistory.length);
	console.log(colorHistory[0]);
	// console.log("this is" + colorHistory[(colorHistory.length - 1)]);
	colorHistory.forEach(function(hexColor, index){
		if (colorHistory.length > maxNumber)
			colorHistory.pop();
		var newSwatchColor = "#" + hexColor;
    var newSwatchNumber = "swatch" + (index + 1);
		// var newSwatchNumber = "swatch" + index;
    var currentSwatch = document.getElementById(newSwatchNumber).style;
		currentSwatch.backgroundColor = newSwatchColor;
		console.log(newSwatchNumber);
	});
	console.log("colored... " + colorHistory);
	// console.log("Syncing swatches to Color History");
}

function plusSwatch(direction) {
	var newSwatch = "swatch" + colorHistory.length;
	document.getElementById(newSwatch).style.display = "block";
	// console.log(colorHistory.length + " total, swatch1 is now #" + colorHistory[0]);
}

function minusSwatch(direction) {
	var lastSwatch = "swatch" + colorHistory.length;
	document.getElementById(lastSwatch).style.display = "none";
	colorHistory.pop();
	console.log("Removing " + lastSwatch);
}



function clearAllSwatches() {
	while(colorHistory.length > 0) {
    colorHistory.pop();
	}
	for (var index = (colorHistory.length + 1); index <= maxNumber; index++) {
		var thisSwatch = "swatch" + index;
		document.getElementById(thisSwatch).style.display = "none";
	}
	grabPSDefaultColors();
	colorSwatches();
	console.log("Reset Color History");
}


function changeDirection() {
	count++;
	var parentDIV = document.getElementById('rowString');
	if (count === 1) {
		deleteSwatches();
		rebuildSwatches("normal");
		parentDIV.style.flexDirection = "row";
	} else if (count === 2) {
		parentDIV.style.flexDirection = "row-reverse";
	} else if (count === 3) {
		deleteSwatches();
		rebuildSwatches("alt");
		parentDIV.style.flexDirection = "row";
	} else {
		parentDIV.style.flexDirection = "row-reverse";
		count = 0;
	}
	console.log("flex-direction: " + parentDIV.style.flexDirection);
}





/////////// ALT
//
function swatchSecondClick(index, direction) {
	if (direction === "alt") {
		var currIndex = (index - 1);
		var resultSwatch = "swatch" + (index);
		console.log("altClicked on " + resultSwatch + ", color:#" + colorHistory[currIndex]);
	} else {
		var currIndex = (index - 1);
		var resultSwatch = "swatch" + (index);
		console.log("Clicked on " + resultSwatch + ", color:#" + colorHistory[currIndex]);
	}
	var assignColor = colorHistory[currIndex];
	// csInterface.evalScript(`setForegroundColor('${assignColor}')`);
}




// ---------------------
// ------------ Footer -

	//  https://stackoverflow.com/a/6211660
	function isEven(n) {
	   return n % 2 == 0;
	}

	function isOdd(n) {
	   return Math.abs(n % 2) == 1;
	}

	function addRandomSwatch(direction) {
		//	https://stackoverflow.com/a/5092872
	 	var randomColor = "000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
		if (direction === "normal") {
			colorHistory.push(randomColor);
		}	else {
			colorHistory.unshift(randomColor);
		}
		if (colorHistory.length <= maxNumber) {
			if (direction === "normal") {
				plusSwatch("normal");
			}	else {
				plusSwatch("alt");
			}
		}
		colorSwatches();
	}

	// https://stackoverflow.com/a/18120786
	Element.prototype.remove = function() {
	    this.parentElement.removeChild(this);
	}
	NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
	    for(var i = this.length - 1; i >= 0; i--) {
	        if(this[i] && this[i].parentElement) {
	            this[i].parentElement.removeChild(this[i]);
	        }
	    }
	}
// ---------------------

// https://www.davidebarranca.com/2014/01/html-panels-tips-2-including-multiple-jsx/
function loadJSX(fileName) {
    var csInterface = new CSInterface();
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/host/";
    csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
}
