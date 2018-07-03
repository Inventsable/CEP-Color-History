var doc = app.activeDocument;
var hasLayers = documents[0].layers.length;


// app.activeDocument = app.documents[0] // set to picture1.jpg
// app.activeDocument = app.documents[1] // set to picture2.jpg

// var ref = doc.artboard.name;
// alert(app.documents[0].artboard.name)
// var idoc = app.activeDocument;
// selec = idoc.selection;
//
// var docw = idoc.width;
// var doch = idoc.height;
// var activeAB = idoc.artboards[idoc.artboards.getActiveArtboardIndex()]; // get active AB
//
// app.activeDocument.artboards[0].artboardRect = [333,1182,1197,318];
//
// alert(activeAB);

 // docLeft = activeAB.artboardRect[0];
 // docTop = activeAB.artboardRect[1];
// alert(ref);


// #target illustrator

// getActiveDocument();

// 58 examples of
// if ( app.documents.length > 0 )

// 34 examples of
// app.documents.add()

function showGlitch(){
  alert(app.documents.length);               // Correct: 3
  alert(app.documents[0].name);              // Correct: 'ScreenScroll.ai'
  alert(app.documents[0].artboards.length);  // Correct: 1
  alert(app.documents[1].name);              // Correct: 'Untitled-2'
  alert(app.documents[1].artboards.length);  // Incorrect: 1 instead of 3
  alert(app.documents[2].name);              // Correct: 'VirusChars.ai'
  alert(app.documents[2].artboards.length);  // Incorrect: 1 instead of 5
  alert(app.documents[3].name);              // Correct: Error, no such element
  alert(app.documents[3].artboards.length);  // Correct: Error, no such element
}

function getActiveDocument(){
  var thisDoc = app.activeDocument;
  var activeAB = thisDoc.artboards.getActiveArtboardIndex();
  var activeName = thisDoc.artboards[activeAB].name;
  // selectObjectsOnActiveArtboard();
  for (var index = 0; index < documents.length; index++) {
    app.documents[index].activate();
    for (var A_Index = 0; A_Index < documents[index].artboards.length; A_Index++) {
      var currAB = documents[index].artboards[A_Index];
      alert(currAB.name + " at " + A_Index + ", need " + activeName);
    }
  }
}



function allArtColors(){
  if (exist && hasPaths){
    for (var index = 0; index < allPaths; index++) {
      if ((documents[0].pathItems[index].stroked) && !(documents[0].pathItems[index].filled)) {
        checkNew(rgbActive("pathItems", "stroke", index));
      } else if ((documents[0].pathItems[index].filled) && !(documents[0].pathItems[index].stroked)) {
        checkNew(rgbActive("pathItems", "fill", index));
      } else if ((documents[0].pathItems[index].filled) && (documents[0].pathItems[index].stroked)) {
        checkNew(rgbActive("pathItems", "stroke", index));
        checkNew(rgbActive("pathItems", "fill", index));
      }
    }
    // for (var index = 0; index < allPaths; index++) {
    //   if ((documents[0].pathItems[index].stroked) && !(documents[0].pathItems[index].filled)) {
    //     checkNew(rgbActive("pathItems", "stroke", index));
    //   } else if ((documents[0].pathItems[index].filled) && !(documents[0].pathItems[index].stroked)) {
    //     checkNew(rgbActive("pathItems", "fill", index));
    //   } else if ((documents[0].pathItems[index].filled) && (documents[0].pathItems[index].stroked)) {
    //     checkNew(rgbActive("pathItems", "stroke", index));
    //     checkNew(rgbActive("pathItems", "fill", index));
    //   }
    // }
  }
  return allColors;
}


// getNames();

function getNames(){
  // loop through all open documents
  var layersDeleted = 0;
  for ( i = 0; i < app.documents.length; i++ ) {
    var targetDocument = app.documents[i];
    var layerCount = targetDocument.layers.length;
    var artboardCount = targetDocument.artboards.length;
    // Loop through layers from the back, to preserve index
    // of remaining layers when we remove one
    // for (var ii = layerCount - 1; ii >= 0; ii-- ) {
    for (var ii = 0; ii < artboardCount; ii++) {
      // targetLayer = targetDocument.layers[ii];
      targetArtboard = targetDocument.artboards[ii];
      var ArtboardName = new String( targetArtboard.name );
      // if ( layerName.indexOf("Temp") == 0 ) {
        // targetDocument.layers[ii].remove();
        // layersDeleted++;
        // }
      alert(ArtboardName);
    }
  }
}





var exist = documents.length > 0;
var noLayers = activeDocument.layers.length < 1;

var docRef = app.activeDocument;
var artboardRef = docRef.artboards;

thisDoc = documents[0];


function createBG() {
  if ((exist) && (!noLayers)) {
    var countOfLayers = activeDocument.layers.length;
    if (countOfLayers > 1) {
      bottomLayer = activeDocument.layers[countOfLayers - 1];
      // bottomLayer.zOrder(zOrderMethod.BRINGTOFRONT);
    }
  }
  // alert(countOfLayers);
}


var countOfLayers = activeDocument.layers.length;
// readBG();

function readBG(){
  var fails = 0;
  var names = [];
  if ((exist) && (!noLayers)) {
    for (var index = countOfLayers - 1; index >= 0; index--) {
      var name = documents[0].layers[index].name;
      names.unshift(name);
      if (name !== "bg") {
        fails++;
      } else if ((index == countOfLayers - 1) && (name == "bg")) {
        alert("correct");
      }
      if (fails === countOfLayers) {
        recreateArtboards();
      }
    }
  }
}


// alert(rect[1])

// recreateArtboards();
syncArtboards();

function syncArtboards(){
  app.documents[0].activate();
  confirm("Sync artboards?");
  var lastLayer = hasLayers - 1;
  var bgLayer = documents[0].layers[lastLayer];
  for (i = 0; i < artboardRef.length; i++) {
    var thisBG = thisDoc.artboards[i];
    var name = thisBG.name;
    for (var e = 0; e < bgLayer.pathItems.length; e++) {
      var bgPath = bgLayer.pathItems[e];
      if (bgPath.name === name) {
        var top = bgPath.geometricBounds[0];
        var left = bgPath.geometricBounds[1];
        var width = bgPath.geometricBounds[2];
        var height = bgPath.geometricBounds[3];
        thisBG.artboardRect = [top,left,width,height];
        break
        // alert(bgPath.name);
        // alert(bgPath.geometricBounds[1]);
      } else {
        continue
      }
    }
  }
}

function recreateArtboards(){
  var rect = [];
  var doc = app.activeDocument;
  var bg = doc.layers.add();
  bg.name = "bg";
  bg.zOrder(ZOrderMethod.SENDTOBACK);
  var newColor = new RGBColor();
  newColor.r = 255;
  newColor.g = 0;
  newColor.b = 0;
  for (i = 0; i < artboardRef.length; i++) {
    var top = artboardRef[i].artboardRect[1] ;
    var left = artboardRef[i].artboardRect[0];
    var width = artboardRef[i].artboardRect[2] - artboardRef[i].artboardRect[0];
    var height = artboardRef[i].artboardRect[1] - artboardRef[i].artboardRect[3];
    var lastLayer = countOfLayers - 1;
    var dynamicBG = bg.pathItems.rectangle(top, left, width, height);
    dynamicBG.name = artboardRef[i].name;
    dynamicBG.fillColor = newColor;
    rect.push(dynamicBG);
  }
}
