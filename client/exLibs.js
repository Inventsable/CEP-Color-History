


// https://stackoverflow.com/a/8027444
function isHexColor(param) {
	var isOk = /^[0-9A-F]{6}$/i.test(param);
	return isOk;
}

// https://stackoverflow.com/a/25352300
function isAlphaNumeric(str) {
  var code, i, len;
  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
};


// https://stackoverflow.com/a/11923973
function rgbToHsl(c) {
  var r = c[0]/255, g = c[1]/255, b = c[2]/255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return new Array(h, s, l);
  // return new Array(h * 360, s * 100, l * 100);
}

// var sortedRgbArr = rgbArr.map(function(c, i) {
//   // Convert to HSL and keep track of original indices
//   return {color: rgbToHsl(c), index: i};
// }).sort(function(c1, c2) {
//   // Sort by hue
//   return c1.color[0] - c2.color[0];
// }).map(function(data) {
//   // Retrieve original RGB color
//   return rgbArr[data.index];
// });


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
