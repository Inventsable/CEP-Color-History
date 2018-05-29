var listHold = document.getElementById('listHold');
var maxNumber = 29;
var onHandle = false;
var onSnip = false;
var csInterface = new CSInterface();
var appName = csInterface.hostEnvironment.appName;
var highlight = false;

generateSwatches();

function generateSwatches(direction) {
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
		listItem.id = "swatch" + currNumber;
		listItem.classList.add("swatch");
		sliderItem.id = "slider" + currNumber;
		sliderItem.classList.add("slider");
		listItem.appendChild(sliderItem);
		handleItem.id = "handle" + currNumber;
		handleItem.classList.add("handle");
		sliderItem.appendChild(handleItem);

		sliderSnip.id = "sliderSnip" + currNumber;
		sliderSnip.classList.add("sliderSnip");
		listItem.appendChild(sliderSnip);
		handleSnip.id = "handleSnip" + currNumber;
		handleSnip.classList.add("handleSnip");
		sliderSnip.appendChild(handleSnip);

		list.appendChild(listItem);
	};
  var parentDiv = document.getElementById("content");
	parentDiv.insertBefore(list, listHold);
	hideSwatches();
	colorSwatchesByChild();
	assignSwatches();
	assignSortable();
	console.log("Added parent <ul> and default");
	console.log(colorHistory);
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
			// var newCut = colorHistory[evt.newIndex];
			colorHistory.splice(evt.oldIndex, 1)
			colorHistory.splice(evt.newIndex, 0, cutArray);
			console.log("old color is " + cutArray + ", from " + evt.oldIndex + " to " + evt.newIndex);
			console.log("current history is: " + colorHistory);
			updateHistory();
		};
	});
	Sortable.create(el, options);
}


function assignSwatches(){
	for (var index = maxNumber; index > 0; index--) {
		(function(index) {
			var thisSwatch = document.getElementById("swatch" + index);
			var thisSlider = document.getElementById("slider" + index);
			var thisHandle = document.getElementById("handle" + index);
			var snipSlider = document.getElementById("sliderSnip" + index);
			var snipHandle = document.getElementById("handleSnip" + index);
			// thisSwatch.addEventListener("click", function(){swatchClick(index)});
			thisSwatch.addEventListener("click", function(event) {
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
				thisSwatch.addEventListener("mouseover", function( event ) {
					var newColor = event.target.style.backgroundColor;
					var subColor = newColor.substring(4, newColor.length - 1);
					var rgb = subColor.split(",");
					if (onHandle !== true) {
						csInterface.evalScript(`htmlRGBToHex(${rgb[0]},${rgb[1]},${rgb[2]})`, dimColor)
					}
				}, false);
				thisSwatch.addEventListener("mouseout", function( event ) {
					csInterface.evalScript(`returnOpacity();`)
				}, false);
			}
			thisSlider.addEventListener("mouseover", function(){swatchSliderOn(index)});
			thisSlider.addEventListener("mouseout", function(){swatchSliderOff(index)});
			thisHandle.addEventListener("click", function(){swatchHandleClick(index)});
			thisHandle.addEventListener("mouseover", function(){swatchHandleOn(index)});
			thisHandle.addEventListener("mouseout", function(){swatchHandleOff(index)});

			snipSlider.addEventListener("mouseover", function(){snipSliderOn(index)});
			snipSlider.addEventListener("mouseout", function(){snipSliderOff(index)});
			// snipHandle.addEventListener("click", function(){snipClick(index)});

			snipHandle.addEventListener("click", function(event) {
				var newColor = event.target.style.backgroundColor;
				var newParent = this.parentNode.parentNode;
				var parentColor = newParent.parentNode.style.backgroundColor;
				var newNumber = newParent.id.substring(6, 7);

				// @@ Fix this. Currently uses id, will snip wrong swatch if swatches are dragged.
				// Needs to call program, reconvert, scan and dynamically find index like sendColor

				// Need to get the backgroundColor prior to snipping change

				// var someNumber = event.target.id;
				// console.log(newParent.id + " and " + someNumber);
				// var subColor = newColor.substring(4, newColor.length - 1);
				// var rgb = subColor.split(",");
				// if (appName === "ILST") {
				// 	csInterface.evalScript(`htmlRGBToHex(${rgb[0]},${rgb[1]},${rgb[2]})`, snippingColor)
				// } else if (appName === "PHXS") {
				// 	csInterface.evalScript(`htmlRGBToHexPS(${rgb[0]},${rgb[1]},${rgb[2]})`, snippingColor)
				// }
				if (onSnip === true) {
					console.log((newNumber - 1) + " is " + colorHistory[(newNumber - 1)]);
					colorHistory.splice((newNumber - 1), 1);
					console.log("current history is: " + colorHistory);
					updateHistory();

					// console.log(`htmlRGBToHex(${rgb[0]},${rgb[1]},${rgb[2]})`);
				}
			}, false);

			snipHandle.addEventListener("mouseover", function(){snipHandleOn(index)});
			snipHandle.addEventListener("mouseout", function(){snipHandleOff(index)});
		})(index);
	}
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
	var swatches = document.getElementById('rowString').childNodes;
	for (var index = 0; index < swatches.length; index++) {
		var sliders = swatches[index].childNodes;
		var handles = sliders[0].childNodes;
		if (appName === "ILST") {
			handles[0].style.backgroundColor = "#262626";
		}
		console.log("this is " + handles[0].style.backgroundColor);
	}
	console.log("Recolored");
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
			console.log(thisColor + " is at " + currIndex);
			break;
		}
	}
	console.log("Clicked on swatch" + currIndex + ", color:#" + thisColor);
	if (appName === "PHXS") {
		if (isOdd(groundState)){
			csInterface.evalScript(`fgColorToPS('${thisColor}')`);
			console.log(groundState + " foreground");
		} else {
			csInterface.evalScript(`bgColorToPS('${thisColor}')`);
			console.log(groundState + " background");
		}
	} else if (appName === "ILST") {
		csInterface.evalScript(`giveColor('${thisColor}')`);
	}
}

function highlighter(params) {
	var highlight = params;
	console.log(highlight);
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

function snipSliderOn(index) {
	var thisHandle = document.getElementById('handleSnip' + index);
	// if (appName === "ILST") {
	// 	thisHandle.style.backgroundColor = "#262626";
	// } else if (appName === "PHXS") {
	// 	thisHandle.style.backgroundColor = "rgba(46, 46, 46, 1)";
	// } else if (appName === "AEFT") {
	// 	thisHandle.style.backgroundColor = "#161616";
	// }
	thisHandle.style.backgroundColor = "red";
	thisHandle.style.borderColor = "rgba(255, 255, 255, .25)";
	thisHandle.style.width = "80%";
	thisHandle.style.cursor = "grab";
}

function snipSliderOff(index) {
	var thisHandle = document.getElementById('handleSnip' + index);
	thisHandle.style.backgroundColor = "transparent";
	thisHandle.style.borderColor = "transparent";
	thisHandle.style.width = "0%";
}

function snipHandleOn(index) {
	var swatch = document.getElementById('rowString').childNodes;
	onSnip = true;
	if (onSnip) {
		var thisHandle = swatch[index].childNodes;
		// swatch[index].style.borderColor = "red";
		console.log("snip handle");
		swatch[(index - 1)].style.backgroundColor = "#323232";
		swatch[(index - 1)].style.borderColor = "red";
		swatch[(index - 1)].style.borderWidth = "1px";
	}
}

function snipHandleOff(index) {
	onSnip = false;
	var thisHandle = document.getElementById('handle' + index);
	swatch[(index - 1)].style.borderColor = "transparent";
	swatch[(index - 1)].style.backgroundColor = "#" + colorHistory[(index - 1)];
	swatch[(index - 1)].style.borderColor = "transparent";
	swatch[(index - 1)].style.borderWidth = "0px";
}


function swatchSliderOn(index) {
	var thisHandle = document.getElementById('handle' + index);
	if (appName === "ILST") {
		thisHandle.style.backgroundColor = "#262626";
	} else if (appName === "PHXS") {
		thisHandle.style.backgroundColor = "rgba(46, 46, 46, 1)";
	} else if (appName === "AEFT") {
		thisHandle.style.backgroundColor = "#161616";
	}
	thisHandle.style.borderColor = "rgba(255, 255, 255, .25)";
	thisHandle.style.width = "80%";
	thisHandle.style.cursor = "grab";
}

function swatchSliderOff(index) {
	var thisHandle = document.getElementById('handle' + index);
	thisHandle.style.backgroundColor = "transparent";
	thisHandle.style.borderColor = "transparent";
	thisHandle.style.width = "0%";
}

function swatchHandleClick(index) {
	var thisHandle = document.getElementById('handle' + index);
}

function swatchHandleOn(index) {
	var swatch = document.getElementById('rowString').childNodes;
	onHandle = true;
	if (onHandle) {
		var thisHandle = swatch[index].childNodes;
		thisHandle[0].style.borderColor = "rgba(255,255,255,.25)"
		console.log("on handle");
	}
}

function swatchHandleOff(index) {
	onHandle = false;
	var thisHandle = document.getElementById('handle' + index);
}

function hideSwatches() {
	// var currentSwatch = document.getElementById('rowString').childNodes;
	for (var index = maxNumber; index > colorHistory.length; index--) {
		// currentSwatch[index].style.display = "none";
		// console.log(index);
		var newID = "swatch" + index;
		document.getElementById(newID).style.display = "none";
	}
}

function hideSwatchesByChild() {
	var currentSwatch = document.getElementById('rowString').childNodes;
	for (var index = 0; index < maxNumber; index++) {
		if (index < (colorHistory.length)) {
			continue;
		} else {
			currentSwatch[index].style.display = "none";
		}
	}
}

function flipHandles(params){
	var currentSwatch = document.getElementById('rowString').childNodes;
	for (var index = 0; index < maxNumber; index++) {
		if (!params) {
			currentSwatch[index].style.justifyContent = "flex-end";
			var currentHandle = currentSwatch[index].childNodes;
			currentHandle[0].style.justifyContent = "flex-end";
			currentHandle[0].style.left = "6px";
			currentHandle[1].style.left = "-12px";
			console.log("true");
		} else {
			currentSwatch[index].style.justifyContent = "flex-start";
			var currentHandle = currentSwatch[index].childNodes;
			currentHandle[0].style.justifyContent = "flex-start";
			currentHandle[0].style.left = "1px";
			currentHandle[1].style.left = "5px";
			console.log("false");
		}
	}
}


function showSwatches() {
	for (var index = 0; index <= colorHistory.length; index++) {
		var currentSwatch = document.getElementById('rowString').childNodes;
		currentSwatch[index].style.display = "flex";
	}
}

function addNewSwatch() {
	var currentSwatch = document.getElementById('rowString').childNodes;
	currentSwatch[(colorHistory.length)].style.display = "flex";
}

function removeLastSwatch(location) {
	var currentSwatch = document.getElementById('rowString').childNodes;
	currentSwatch[(colorHistory.length + 1)].style.display = "none";
}

function colorSwatches() {
	colorHistory.forEach(function(hexColor, index){
		if (colorHistory.length > maxNumber)
			colorHistory.pop();
		var newSwatchColor = "#" + hexColor;
		var newSwatchNumber = "swatch" + (index + 1);
		var currentSwatch = document.getElementById(newSwatchNumber).style;
		currentSwatch.backgroundColor = newSwatchColor;
	});
}

function colorSwatchesByChild() {
	colorHistory.forEach(function(hexColor, index){
		if (colorHistory.length > maxNumber)
			colorHistory.pop();
		var newSwatchColor = "#" + hexColor;
		var currentSwatch = document.getElementById('rowString').childNodes;
		currentSwatch[index].style.backgroundColor = newSwatchColor;
		currentSwatch[index].style.display = "flex";
		currentSwatch[index].style.borderWidth = "0px";
	});
}
