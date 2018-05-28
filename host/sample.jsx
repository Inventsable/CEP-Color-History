var doc = app.activeDocument
var isFill = app.isFillActive();
var exist = app.documents.length > 0;
var hasPaths = doc.pathItems.length > 0;
var allPaths = doc.pathItems.length;
var allTexts = doc.textFrames.length;

var prevOpacityTexts = [];
var prevOpacityPaths = [];

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

function rgbActiveHex(type, here) {
  var activeObject;
  if (type === "pathItems") {
    if ((doc.pathItems[here].stroked) && !(doc.pathItems[here].filled)) {
      activeObject = doc.pathItems[here].strokeColor
    } else if ((doc.pathItems[here].filled) && !(doc.pathItems[here].stroked)) {
      activeObject = doc.pathItems[here].fillColor
    } else {
      //
    }
  } else if (type === "textFrames") {
    activeObject = doc.textFrames[here].textRange.characterAttributes.fillColor
  }
    var convertColor = rgbToHex(activeObject.red, activeObject.green, activeObject.blue);
    return convertColor;
}

/// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
// componentToHex(c);
// rgbToHex(r, g, b);
// hexToRgb(hex);
