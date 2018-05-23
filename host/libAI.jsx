var exist = app.documents.length > 0;
var doc = app.activeDocument;
var isFill = app.isFillActive();

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

function colorFromIllustrator() {
  var defColor;
  if (exist) {
    if (isFill) {
      defColor = doc.defaultFillColor;
    } else {
      defColor = doc.defaultStrokeColor;
    }
    var convertColor = rgbToHex(defColor.red, defColor.green, defColor.blue);
    return convertColor;
  }
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
