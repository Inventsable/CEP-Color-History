// msgPS();
var doc = app.activeDocument;

// alert(htmlRGBToHexPS(255,102,244));

function msgPS(){
  alert(app.foregroundColor.rgb.hexValue);
}

function fgColorFromPS(){
    // console.log(app.foregroundColor.rgb.hexValue);
    return app.foregroundColor.rgb.hexValue;
};

function bgColorFromPS(){
    // console.log(app.backgroundColor.rgb.hexValue);
    return app.backgroundColor.rgb.hexValue;
};

function getPSForegroundColor(){
    return app.foregroundColor.rgb.hexValue;
};

function getPSBackgroundColor(){
    return app.backgroundColor.rgb.hexValue;
};

function fgColorToPS(newColor) {
  app.foregroundColor.rgb.hexValue = newColor;
}

function bgColorToPS(newColor) {
  app.backgroundColor.rgb.hexValue = newColor;
}

function htmlRGBToHexPS(r, g, b) {
  if ((r !== 'undefined') && (g !== 'undefined') && (b !== 'undefined')) {
    var convertColor = rgbToHex(r, g, b);
    return convertColor;
  } else {
    console.log("refuse");
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
