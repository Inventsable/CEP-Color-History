/**
 * @requires CSInterface.js
 * @requires exLibs.js
 * @requires cookies.js
 * @requires colorlogic.js
 **/


var listHold = document.getElementById('listHold');
var maxNumber = 29;
var onHandle = false;
var onSnip = false;
var csInterface = new CSInterface();
var appName = csInterface.hostEnvironment.appName;
var highlight = false;

generateSwatches();

function generateSwatches(direction) {
	healHistory();
	console.log("Correcting any history errors.");
	var list = document.createElement("ul");
	list.id = "rowString";
	list.classList.add("rowString");
	for (var index = 0; index < maxNumber; index++){
		var currNumber = (index + 1);
		var listItem = document.createElement("li");
		var sliderItem = document.createElement("div");
		var handleItem = document.createElement("div");
		var sliderSnip = document.createElement("div");
		var handleSnip = document.createElement("div");
		listItem.classList.add("swatch");
		sliderItem.classList.add("slider");
		listItem.appendChild(sliderItem);
		handleItem.classList.add("handle");
		sliderItem.appendChild(handleItem);
		sliderSnip.classList.add("sliderSnip");
		listItem.appendChild(sliderSnip);
		handleSnip.classList.add("handleSnip");
		sliderSnip.appendChild(handleSnip);
		list.appendChild(listItem);
	};
  var parentDiv = document.getElementById("content");
	parentDiv.insertBefore(list, listHold);
	console.log(`Generating ${maxNumber} total swatches, ${colorHistory.length} visible.`)
	hideSwatchesByChild();
	colorSwatchesByChild();
	assignSwatches();
	assignSortable();
	console.log(`${colorHistory.length} swatches: ${colorHistory}`);
}

function assignSortable(){
	var el = document.getElementById('rowString');
	var options = {
		handle: '.handle',
	  group: 'share',
	  animation: 150
	};
	events = [
		// 'onChoose',
		// 'onStart',
		'onEnd'
		// 'onAdd',
		// 'onUpdate',
		// 'onSort',
		// 'onRemove'
	].forEach(function (name) {
		options[name] = function (evt) {
			console.log({
				'event': name,
				'oldIndex': evt.oldIndex,
				'newIndex': evt.newIndex
			});
			var cutArray = colorHistory[evt.oldIndex];
			colorHistory.splice(evt.oldIndex, 1)
			colorHistory.splice(evt.newIndex, 0, cutArray);
			console.log("old color is " + cutArray + ", from " + evt.oldIndex + " to " + evt.newIndex);
			console.log("current history is: " + colorHistory);
			updateHistory();
		};
	});
	Sortable.create(el, options);
}

function whichChild(elem){
    var i = 0;
    while((elem=elem.previousSibling)!=null) ++i;
    return i;
}

function fixFirstHandle(){
	var swatchNext = document.getElementsByClassName('swatch');
	var thisSlider = swatchNext[0].childNodes;
	var thisHandle = thisSlider[0].childNodes;
	// thisHandle.style.left = "3px";
}

function assignSwatches(){
	var swatch = document.getElementById('rowString').childNodes;
	for (var index = maxNumber - 1; index >= 0; index--) {
		(function(index) {
			var swatchClass = document.getElementsByClassName("swatch");
			var thisSlider = swatchClass[index].childNodes;
			var thisHandle = thisSlider[0].childNodes;
			var snipHandle = thisSlider[1].childNodes;
			swatchClass[index].addEventListener("click", function(event) {
				var newColor = event.target.style.backgroundColor;
				var subColor = newColor.substring(4, newColor.length - 1);
				var rgb = subColor.split(",");
				if (onHandle !== true) {
					if (appName === "ILST") {
						csInterface.evalScript(`htmlRGBToHex(${rgb[0]},${rgb[1]},${rgb[2]})`, sendColor)
					} else if (appName === "PHXS") {
						csInterface.evalScript(`htmlRGBToHexPS(${rgb[0]},${rgb[1]},${rgb[2]})`, sendColor)
					}
				}
			}, false);
			if (appName === "ILST") {
				swatchClass[index].addEventListener("mouseover", function( event ) {
					var newColor = event.target.style.backgroundColor;
					var subColor = newColor.substring(4, newColor.length - 1);
					var rgb = subColor.split(",");
					if (onHandle !== true) {
						csInterface.evalScript(`htmlRGBToHex(${rgb[0]},${rgb[1]},${rgb[2]})`, dimColor)
					}
				}, false);
				swatchClass[index].addEventListener("mouseout", function( event ) {
					csInterface.evalScript(`returnOpacity();`)
				}, false);
			}
			thisSlider[0].addEventListener("mouseover", function(event){
				var thisNumber = whichChild(this.parentNode);
				swatchSliderOn(thisNumber);
			}, false);
			thisSlider[0].addEventListener("mouseout", function(event){
				var thisNumber = whichChild(this.parentNode);
				swatchSliderOff(thisNumber)
			}, false);
			thisSlider[0].addEventListener("click", function(event){
				// if (!) {
					var thisNumber = whichChild(this.parentNode);
					moveAltClick(thisNumber);
				// }
			}, false);
			thisHandle[0].addEventListener("click", function(event){
				var thisNumber = whichChild(this.parentNode.parentNode);
				swatchHandleClick(thisNumber)
			}, false);
			thisHandle[0].addEventListener("mouseover", function(event){
				var thisNumber = whichChild(this.parentNode.parentNode);
				swatchHandleOn(thisNumber)
			}, false);
			thisHandle[0].addEventListener("mouseout", function(event){
				var thisNumber = whichChild(this.parentNode.parentNode);
				swatchHandleOff(thisNumber)
			}, false);

			thisSlider[1].addEventListener("mouseover", function(event){
				var thisNumber = whichChild(this.parentNode);
				snipSliderOn(thisNumber);
			}, false);
			thisSlider[1].addEventListener("mouseout", function(event){
				var thisNumber = whichChild(this.parentNode);
				snipSliderOff(thisNumber);
			}, false);

			thisSlider[1].addEventListener("click", function(event){
				if (!onSnip) {
					var thisNumber = whichChild(this.parentNode);
					snipAltClick(thisNumber);
				}
			}, false);

			snipHandle[0].addEventListener("click", function(event) {
				var newColor = event.target.style.backgroundColor;
				var newParent = this.parentNode.parentNode;
				var parentColor = newParent.parentNode.style.backgroundColor;
				var newNumber = whichChild(newParent);
				if (onSnip) {
					console.log((newNumber) + " is " + colorHistory[(newNumber)]);
					colorHistory.splice((newNumber), 1);
					console.log("current history is: " + colorHistory);
					updateHistory();
				}
			}, false);
			snipHandle[0].addEventListener("mouseover", function(event){
				var thisNumber = whichChild(this.parentNode.parentNode);
				snipHandleOn(thisNumber);
			}, false);
			snipHandle[0].addEventListener("mouseout", function(event){
				var thisNumber = whichChild(this.parentNode.parentNode);
				snipHandleOff(thisNumber);
			}, false);
		})(index);
	}
}

function snipAltClick(num){
	if (!onSnip) {
		if (appName === "PHXS") {
			if (isOdd(groundState)){
				csInterface.evalScript(`fgColorToPS('${colorHistory[num]}')`);
			} else {
				csInterface.evalScript(`bgColorToPS('${colorHistory[num]}')`);
			}
		} else if (appName === "ILST") {
			csInterface.evalScript(`giveColor('${colorHistory[num]}')`);
		}
	}
}

function moveAltClick(num){
	// if (!onHandle) {
		if (appName === "PHXS") {
			if (isOdd(groundState)){
				csInterface.evalScript(`fgColorToPS('${colorHistory[num]}')`);
			} else {
				csInterface.evalScript(`bgColorToPS('${colorHistory[num]}')`);
			}
		} else if (appName === "ILST") {
			csInterface.evalScript(`giveColor('${colorHistory[num]}')`);
		}
	// }
}



function snippingColor(newColor){
	if (appName === "PHXS") {
		newColor = newColor.toUpperCase();
	}
	for (var index = 0; index < colorHistory.length; index++){
		if (newColor !== colorHistory[index]) {
			continue
		} else {
			var currIndex = index;
			var thisColor = colorHistory[currIndex];
			console.log(thisColor + " is at " + currIndex);
			break;
		}
	}
	console.log("snip number " + currIndex + ", color:#" + thisColor);
}

function recolorHandles(){
	fixFirstHandle();
	for (var index = 0; index < swatch.length; index++) {
		var sliders = swatch[index].childNodes;
		var handles = sliders[0].childNodes;
		if (appName === "ILST") {
			handles[0].style.backgroundColor = AIpanel_nav;
		} else if (appName === "PHXS") {
			handles[0].style.backgroundColor = PSpanel_nav;
		}
	}
	console.log("Handles synced to " + appName);
}

function newColorFromPS(newColor){
	var thisColor = newColor.toUpperCase();
	console.log(thisColor);
}

function sendColor(newColor){
	if (newColor.length > 6) {
		return
	}
	if (appName === "PHXS") {
		newColor = newColor.toUpperCase();
	}
	for (var index = 0; index < colorHistory.length; index++){
		if (newColor !== colorHistory[index]) {
			continue
		} else {
			var currIndex = index;
			var thisColor = colorHistory[currIndex];
			break;
		}
	}
	console.log("Clicked on swatch" + currIndex + ", color:#" + thisColor);
	if (appName === "PHXS") {
		if (isOdd(groundState)){
			csInterface.evalScript(`fgColorToPS('${thisColor}')`);
		} else {
			csInterface.evalScript(`bgColorToPS('${thisColor}')`);
		}
	} else if (appName === "ILST") {
		csInterface.evalScript(`giveColor('${thisColor}')`);
	}
}

function highlighter(params) {
	var highlight = params;
	// console.log(highlight);
}

function dimColor(newColor){
	if (newColor.length < 7) {
		if (highlight) {
			csInterface.evalScript(`lowerOpacity('${newColor}');`)
			console.log(`higlighting ${newColor}`);
		} else {
			console.log(`Hovering over ${newColor}`);
		}
	}
}


function snippingToggle(params) {
	// var swatch = document.getElementById('rowString').childNodes;
	for (var index = 0; index < maxNumber; index++) {
		var thisHandle = document.getElementsByClassName("handleSnip");
		if (params === "On") {
			thisHandle[index].style.display = "block";
		} else {
			thisHandle[index].style.display = "none";
		}
	}
	if (params === "On") {
		console.log("Snipping on");
		updateHistory();
	} else {
		console.log("Snipping off");
	}
}

function movingToggle(params) {
	// var swatch = document.getElementById('rowString').childNodes;
	for (var index = 0; index < maxNumber; index++) {
		var thisHandle = document.getElementsByClassName("handle");
		if (params === "On") {
			thisHandle[index].style.display = "block";
		} else {
			thisHandle[index].style.display = "none";
		}
	}
	if (params === "On") {
		console.log("Moving on");
		updateHistory();
	} else {
		console.log("Moving off");
	}
}

function snipSliderOn(index) {
	var swatch = document.getElementById('rowString').childNodes;
	var thisSlider = swatch[index].childNodes;
	var thisHandle = thisSlider[1].childNodes;
	thisHandle[0].style.backgroundColor = "red";
	thisHandle[0].style.width = "80%";
}

function snipSliderOff(index) {
	var thisSlider = swatch[index].childNodes;
	var thisHandle = thisSlider[1].childNodes;
	thisHandle[0].style.width = "0%";
}

function snipHandleOn(index) {
	onSnip = true;
	if (onSnip) {
		if (appName === "ILST") {
			swatch[index].style.backgroundColor = AIpanel_nav;
		} else if (appName === "PHXS") {
			swatch[index].style.backgroundColor = PSpanel_bg;
		}
		swatch[index].style.borderColor = "red";
		swatch[index].style.borderWidth = "1px";
	}
}

function snipHandleOff(index) {
	onSnip = false;
	swatch[index].style.backgroundColor = "#" + colorHistory[index];
	swatch[index].style.borderColor = "transparent";
	swatch[index].style.borderWidth = "0px";
}



function swatchSliderOn(index) {
	var thisHandle = document.getElementsByClassName('handle');
	if (appName === "ILST") {
		thisHandle[index].style.backgroundColor = "#262626";
	} else if (appName === "PHXS") {
		thisHandle[index].style.backgroundColor = "rgba(46, 46, 46, 1)";
	} else if (appName === "AEFT") {
		thisHandle[index].style.backgroundColor = "#161616";
	}
	thisHandle[index].style.width = "80%";
	thisHandle[index].style.cursor = "grab";
}

function swatchSliderOff(index) {
	var thisHandle = document.getElementsByClassName('handle');
	thisHandle[index].style.backgroundColor = "transparent";
	thisHandle[index].style.borderColor = "transparent";
	thisHandle[index].style.width = "0%";
}

function swatchHandleClick(index) {
	var thisHandle = document.getElementsByClassName('handle');
}

function swatchHandleOn(index) {
	onHandle = true;
	if (onHandle) {
		var thisHandle = swatch[index].childNodes;
	}
}

function swatchHandleOff(index) {
	var thisHandle = document.getElementsByClassName('handle');
	onHandle = false;
}

function hideSwatchesByChild() {
	var swatch = document.getElementById('rowString').childNodes;
	for (var index = 0; index < maxNumber; index++) {
		if (index < (colorHistory.length)) {
			continue;
		} else {
			swatch[index].style.display = "none";
		}
	}
}

function flipHandles(params){
	for (var index = 0; index < maxNumber; index++) {
		if (!params) {
			swatch[index].style.justifyContent = "flex-end";
			var currentHandle = swatch[index].childNodes;
			currentHandle[0].style.justifyContent = "flex-end";
			currentHandle[0].style.left = "6px";
			currentHandle[1].style.left = "-12px";
			console.log("true");
		} else {
			swatch[index].style.justifyContent = "flex-start";
			var currentHandle = swatch[index].childNodes;
			currentHandle[0].style.justifyContent = "flex-start";
			currentHandle[0].style.left = "1px";
			currentHandle[1].style.left = "5px";
			console.log("false");
		}
	}
}

function showSwatches() {
	for (var index = 0; index < colorHistory.length; index++) {
		swatch[index].style.display = "flex";
	}
}

function addNewSwatch() {
	swatch[(colorHistory.length)].style.display = "flex";
}

function removeLastSwatch(location) {
	swatch[(colorHistory.length + 1)].style.display = "none";
}

function colorSwatches() {
	colorHistory.forEach(function(hexColor, index){
		if (colorHistory.length > maxNumber)
			colorHistory.pop();
		var newSwatchColor = "#" + hexColor;
		swatch[index].backgroundColor = newSwatchColor;
	});
}

function colorSwatchesByChild() {
	healHistory();
	colorHistory.forEach(function(hexColor, index){
		if (colorHistory.length > maxNumber)
			colorHistory.pop();
		var newSwatchColor = "#" + hexColor;
		var swatch = document.getElementById('rowString').childNodes;
		swatch[index].style.backgroundColor = newSwatchColor;
		swatch[index].style.display = "flex";
		swatch[index].style.borderWidth = "0px";
	});
}
