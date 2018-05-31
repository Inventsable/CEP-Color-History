/**
 * @requires CSInterface.js
 * @requires cookies.js
 * @requires main.js
 *
 * @function setPanelCallback(event)
 *
 *
*/

var csInterface = new CSInterface();
var appName = csInterface.hostEnvironment.appName;
var isFlipped = true;
var isHighlight = false;

var isScanning = true;
window.onload = scanningToggle("On");
var isSnip = false;
window.onload = snippingToggle("Off");
var isMove = false;
window.onload = movingToggle("Off");

if (appName === "ILST") {
  var menuXML = '<Menu> \
    <MenuItem Id="moving" Label="Move on/off" Enabled="true" Checked="false"/> \
    <MenuItem Id="snipping" Label="Snip on/off" Enabled="true" Checked="false"/> \
    <MenuItem Id="scanning" Label="Scan on/off" Enabled="true" Checked="true"/> \
    <MenuItem Id="highlighting" Label="Highlight on/off" Enabled="false" Checked="false"/> \
    \
    <MenuItem Label="---" /> \
    \
    <MenuItem Id="snatchColors" Label="Snatch all colors" Enabled="true" Checked="false"/> \
    <MenuItem Id="snatchSelection" Label="Snatch selected colors" Enabled="true" Checked="false"/> \
    <MenuItem Id="flipHandles" Label="Flip handles" Enabled="false" Checked="false"/> \
    \
    <MenuItem Label="---" /> \
    \
    <MenuItem Id="showHistory" Label="Log current history" Enabled="true" Checked="false"/> \
    <MenuItem Id="refreshPanel" Label="Refresh panel" Enabled="true" Checked="false"/> \
    \
    <MenuItem Label="---" /> \
    \
    <MenuItem Id="resetThisCookie" Label="Reset this cookie" Enabled="false" Checked="false"/> \
  	<MenuItem Id="resetAllCookies" Label="Reset all cookies" Enabled="true" Checked="false"/> \
    <MenuItem Id="deleteAllCookies" Label="Delete all cookies" Enabled="true" Checked="false"/> \
    \
    <MenuItem Label="---" /> \
    \
    <MenuItem Id="SendAE" Label="Send to After Effects" Enabled="false" Checked="false"/> \
    <MenuItem Id="SendPS" Label="Send to Photoshop" Enabled="false" Checked="false"/> \
  </Menu>';
} else {
  var menuXML = '<Menu> \
    <MenuItem Id="moving" Label="Move on/off" Enabled="true" Checked="true"/> \
    <MenuItem Id="snipping" Label="Snip on/off" Enabled="true" Checked="false"/> \
    <MenuItem Id="scanning" Label="Scan on/off" Enabled="true" Checked="true"/> \
    \
    <MenuItem Label="---" /> \
    \
    <MenuItem Id="refreshPanel" Label="Refresh panel" Enabled="true" Checked="false"/> \
    <MenuItem Id="showHistory" Label="Log current history" Enabled="true" Checked="false"/> \
    <MenuItem Id="flipHandles" Label="Flip handles" Enabled="false" Checked="false"/> \
    \
    <MenuItem Label="---" /> \
    \
  	<MenuItem Id="resetThisCookie" Label="Reset this cookie" Enabled="false" Checked="false"/> \
  	<MenuItem Id="resetAllCookies" Label="Reset all cookies" Enabled="true" Checked="false"/> \
    <MenuItem Id="deleteAllCookies" Label="Delete all cookies" Enabled="true" Checked="false"/> \
    \
    <MenuItem Label="---" /> \
    \
    <MenuItem Id="SendAI" Label="Send to Illustrator" Enabled="false" Checked="false"/> \
    <MenuItem Id="SendAE" Label="Send to After Effects" Enabled="false" Checked="false"/> \
  </Menu>';
}

csInterface.setPanelFlyoutMenu(menuXML);
csInterface.addEventListener("com.adobe.csxs.events.flyoutMenuClicked", setPanelCallback);

function setPanelCallback(event) {
  if (event.data.menuId=="resetAllCookies") {
    resetAllCookies();
    location.reload();
  } else if (event.data.menuId=="deleteAllCookies") {
    deleteAllCookies();
  } else if (event.data.menuId=="resetThisCookie") {
    resetThisHistory();
  } else if (event.data.menuId=="refreshPanel") {
    location.reload();
  } else if (event.data.menuId=="showHistory") {
    showColorHistory();
  } else if (event.data.menuId=="snatchColors") {
    snatchColors();
  } else if (event.data.menuId=="snatchSelection") {
    snatchSelectedColors();
  } else if (event.data.menuId=="flipHandles") {
    isFlipped = !isFlipped;
    flipHandles(isFlipped);
  } else if (event.data.menuId=="highlighting") {
    isHighlight = !isHighlight;
    csInterface.updatePanelMenuItem("Highlight on/off", true, isHighlight);
    // if (isHighlight) {
      highlighter(isHighlight);
    // } else {
      // scanningToggle("Off");
    // }
  } else if (event.data.menuId=="scanning") {
    isScanning = !isScanning;
    csInterface.updatePanelMenuItem("Scan on/off", true, isScanning);
    if (isScanning) {
      scanningToggle("On");
    } else {
      scanningToggle("Off");
    }
  } else if (event.data.menuId=="snipping") {
    isSnip = !isSnip;
    csInterface.updatePanelMenuItem("Snip on/off", true, isSnip);
    if (isSnip) {
      snippingToggle("On");
      // console.log("snipping on");
    } else {
      snippingToggle("Off");
      // console.log("snipping off");
    }
  } else if (event.data.menuId=="moving") {
    isMove = !isMove;
    csInterface.updatePanelMenuItem("Move on/off", true, isMove);
    if (isMove) {
      movingToggle("On");
      // console.log("snipping on");
    } else {
      movingToggle("Off");
      // console.log("snipping off");
    }
  }
}
