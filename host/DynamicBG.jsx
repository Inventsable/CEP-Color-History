var doc = app.activeDocument;



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


var exist = documents.length > 0;
var noLayers = activeDocument.layers.length < 1;

var docRef = app.activeDocument;
var artboardRef = docRef.artboards;




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
// createBG();
readBG();


function readBG(){

  var fails = 0;
  var names = [];
  if ((exist) && (!noLayers)) {
    for (var index = 0; index < countOfLayers; index++) {
      var name = app.activeDocument.layers[index].name;
      names.push(name);
      if (name !== "bg") {
        fails++;
      } else if ((index == countOfLayers - 1) && (name == "bg")) {
        // alert("correct");
      }
      if (fails === countOfLayers) {
        recreateArtboards();
        // alert("failed");
      }
    }
  }
  // alert(names + fails);
}


// alert(rect[1])

// recreateArtboards();

function syncArtboards(){

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
    rect.push(bg.pathItems.rectangle(top, left, width, height));
    // rect.strokeColor = new NoColor();
    rect.fillColor = newColor;
  }
}
