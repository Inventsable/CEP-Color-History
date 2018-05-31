
function msgAI(params){
  alert(params);
}

function checkIllustrator(){
  alert("Illustrator works");
}

var doc = app.activeDocument
var isFill = app.isFillActive();
var exist = app.documents.length > 0;
var hasPaths = doc.pathItems.length > 0;
var switchNumber = 1;

var allPaths = doc.pathItems.length;
var allTexts = doc.textFrames.length;

var selectedColors = [];
var allColors = [];
var prevOpacityTexts = [];
var prevOpacityPaths = [];



// checkForFill();

// alert(switchScanner());

// giveColor("9900AA");
// setStrokeColor("00AAFF");
// setFillColor("00AAFF");

// alert(colorFromIllustrator());
                                // returns "00AA99"
        // alert(strokeColorFromAI());
        // alert(fillColorFromAI());
                              // returns "00AA99"


function switchScanner() {
  if (app.isFillActive()) {
    return 1;
  } else {
    return 0;
  }
}

function fillColorFromAI() {
  if (exist) {
    var convertColor = rgbToHex(doc.defaultFillColor.red, doc.defaultFillColor.green, doc.defaultFillColor.blue);
    return convertColor;
  } else {
    return "ffffff";
  }
}
function strokeColorFromAI() {
  if (exist) {
    var convertColor = rgbToHex(doc.defaultStrokeColor.red, doc.defaultStrokeColor.green, doc.defaultStrokeColor.blue);
    return convertColor;
  } else {
    return "231f20";
  }
}

function colorToIllustrator(newColor){
  var nColor = new RGBColor;
  nColor.red = hexToRgb(newColor).r;
  nColor.green = hexToRgb(newColor).g;
  nColor.blue = hexToRgb(newColor).b;
  return nColor;
}

function setStrokeColor(newColor) {
  doc.defaultStrokeColor = colorToIllustrator(newColor);
}

function setFillColor(newColor) {
  doc.defaultFillColor = colorToIllustrator(newColor);
}



function colorFromIllustrator() {
  if (app.isFillActive()) {
    defaultColor = fillColorFromAI();
  } else {
    defaultColor = strokeColorFromAI();
  }
  return defaultColor;
}


var text = ["Lorem ipsum", "test this"];

function getText(){
  if (exist && allTexts > 0){
    for (var index = 0; index < allTexts; index++) {
      var fails = 0;
      for (var A_Index = 0; A_Index < text.length; A_Index++) {
        if (doc.textFrames[index].contents !== text[A_Index]) {
          fails++;
        } else {
          break;
        }
        if (fails === text.length) {
          text.push(doc.textFrames[index].contents);
        }
      }
    }
    return text;
  }
}




/// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}



function rgbActiveHex(type, here) {
  var activeObject;
  if (type === "pathItems") {
    if (doc.pathItems[here].stroked) {
      activeObject = doc.pathItems[here].strokeColor
    } else if (doc.pathItems[here].filled) {
      activeObject = doc.pathItems[here].fillColor
    }
  } else if (type === "textFrames") {
    activeObject = doc.textFrames[here].textRange.characterAttributes.fillColor
  }
    var convertColor = rgbToHex(activeObject.red, activeObject.green, activeObject.blue);
    return convertColor;
}



function htmlRGBToHex(r, g, b) {
  if ((r !== 'undefined') && (g !== 'undefined') && (b !== 'undefined')) {
    var nColor = new RGBColor;
    nColor.red = r;
    nColor.green = g;
    nColor.blue = b;
    var convertColor = rgbToHex(nColor.red, nColor.green, nColor.blue);
    return convertColor;
  } else {
    console.log("refuse");
  }
}


function rgbActive(item, which, here) {
  var activeObject;
  if (item === "pathItems") {
    if (which === "stroke") {
      activeObject = doc.pathItems[here].strokeColor
    } else if (which === "fill") {
      activeObject = doc.pathItems[here].fillColor
    }
  } else if (type === "textFrames") {
    activeObject = doc.textFrames[here].textRange.characterAttributes.fillColor
  }
    var convertColor = rgbToHex(activeObject.red, activeObject.green, activeObject.blue);
    return convertColor;
}


function rgbSelectedActive(item, which, here) {
  var activeObject;
  if (item === "pathItems") {
    if (which === "stroke") {
      activeObject = app.selection[here].strokeColor
    } else if (which === "fill") {
      activeObject = app.selection[here].fillColor
    }
  } else if (type === "textFrames") {
    activeObject = doc.textFrames[here].textRange.characterAttributes.fillColor
  }
    var convertColor = rgbToHex(activeObject.red, activeObject.green, activeObject.blue);
    return convertColor;
}

function checkNew(params){
  if (allColors.length > 29) {
    return
  }
  if (allColors.length > 0) {
    var fail = 0;
    for (var index = 0; index < allColors.length; index++) {
      if (params !== allColors[index]) {
        fail++;
      } else {
        break;
      }
      if (fail === allColors.length) {
        allColors.push(params);
      }
    }
  } else {
    allColors.push(params)
  }
// alert(allColors);
}

function checkSelected(params){
  if (params.length < 4) {
    return;
  }
  if (params.length > 7) {
    return;
  }
  if (selectedColors.length > 29) {
    return;
  }
  if (selectedColors.length > 0) {
    var fail = 0;
    for (var index = 0; index < selectedColors.length; index++) {
      if (params !== selectedColors[index]) {
        fail++;
      } else {
        break;
      }
      if (fail === selectedColors.length) {
        selectedColors.push(params);
      }
    }
  } else {
    selectedColors.push(params)
  }
// alert(selectedColors);
}

// alert(selectedArtColors());

// alert(selectedArtColors());
// alert(isSelected);

// var isSelected = app.selection.length > 0;


function selectedArtColors(){
  // while (selectedColors.length > 0) {
  //   selectedColors.pop();
  // }
  selectedColors = [];
  if (exist && app.selection.length > 0){
    // alert(app.selection.length);
    for (var index = 0; index < app.selection.length; index++) {
      var currentSelection = app.selection[index];
      if ((currentSelection.stroked) && !(currentSelection.filled)) {
        checkSelected(rgbSelectedActive("pathItems", "stroke", index));
      } else if ((currentSelection.filled) && !(currentSelection.stroked)) {
        checkSelected(rgbSelectedActive("pathItems", "fill", index));
      } else if ((currentSelection.filled) && (currentSelection.stroked)) {
        checkSelected(rgbSelectedActive("pathItems", "stroke", index));
        checkSelected(rgbSelectedActive("pathItems", "fill", index));
      }
    }
  }
  return selectedColors;
}


function allArtColors(){
  // while (allColors.length > 0) {
  //   allColors.pop();
  // }
  allColors = [];
  if (exist && hasPaths){
    for (var index = 0; index < allPaths; index++) {
      if ((doc.pathItems[index].stroked) && !(doc.pathItems[index].filled)) {
        checkNew(rgbActive("pathItems", "stroke", index));
      } else if ((doc.pathItems[index].filled) && !(doc.pathItems[index].stroked)) {
        checkNew(rgbActive("pathItems", "fill", index));
      } else if ((doc.pathItems[index].filled) && (doc.pathItems[index].stroked)) {
        checkNew(rgbActive("pathItems", "stroke", index));
        checkNew(rgbActive("pathItems", "fill", index));
      }
    }
  }
  return allColors;
}

// create function that receives flyoutmenu prompt in js
// pop current colorHistory, replace with allColors, setCookie and updateHistory


function lowerOpacity(exceptThis) {
  if (exist && hasPaths) {
    while (prevOpacityPaths.length > 0) {
      prevOpacityPaths.pop();
    }
    while (prevOpacityTexts.length > 0) {
      prevOpacityTexts.pop();
    }
    // Path Items
    for (var index = 0; index < allPaths; index++) {
      prevOpacityPaths.push(doc.pathItems[index].opacity)
      if (rgbActiveHex("pathItems", index) === exceptThis) {
        doc.pathItems[index].opacity = 100;
      } else {
        doc.pathItems[index].opacity = 20;
      }
    }
    // Text frames
    for (var index = 0; index < allTexts; index++) {
      prevOpacityTexts.push(doc.textFrames[index].opacity)
      if (rgbActiveHex("textFrames", index) === exceptThis) {
        doc.textFrames[index].opacity = 100;
      } else {
        doc.textFrames[index].opacity = 20;
      }
    }
    //
  }
}

function returnOpacity() {
  if (exist && hasPaths) {
    for (var index = 0; index < allPaths; index++) {
      var previous = prevOpacityPaths[index];
      doc.pathItems[index].opacity = prevOpacityPaths[index];
    }
    for (var index = 0; index < allTexts; index++) {
      var previous = prevOpacityTexts[index];
      doc.textFrames[index].opacity = prevOpacityTexts[index];
    }
  }
}

function giveColor(newColor) {
  if (app.isFillActive()) {
    setFillColor(newColor);
  } else {
    setStrokeColor(newColor);
  }
  if (exist && hasPaths) {
      for (var A_Index = 0; A_Index < app.selection.length; A_Index++) {
        try {
          var currentSelection = app.selection[A_Index];
          if (app.isFillActive()) {
            currentSelection.fillColor = colorToIllustrator(newColor);
          } else {
            currentSelection.strokeColor = colorToIllustrator(newColor);
          }
        }
        catch (e){alert(e)}
      }
    }
};


/*--
// Broken and I don't know why
var doc = app.activeDocument;
var isFill = app.isFillActive();

function fillColorFromAI() {
  if (app.documents.length > 0) {
    var convertColor = rgbToHex(doc.defaultFillColor.red, doc.defaultFillColor.green, doc.defaultFillColor.blue);
    return convertColor;
  } else {
    return "ffffff";
  }
}
function strokeColorFromAI() {
  if (app.documents.length) {
    var convertColor = rgbToHex(doc.defaultStrokeColor.red, doc.defaultStrokeColor.green, doc.defaultStrokeColor.blue);
    return convertColor;
  } else {
    return "231f20";
  }
}

function colorFromIllustrator() {
  var defColor;
  // if (exist) {
    if (isFill) {
      defColor = doc.defaultFillColor;
    } else {
      defColor = doc.defaultStrokeColor;
    }
    var convertColor = rgbToHex(defColor.red, defColor.green, defColor.blue);
    return convertColor;
  // }
}

function msgAI(){
  alert("Illustrator active");
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

--*/
