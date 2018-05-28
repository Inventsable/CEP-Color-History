/**
 * @requires CSInterface.js
 * @requires cookies.js
 * @requires main.js
 *
 * flyoutmenu.js
 *
 * @function setPanelCallback(event)
 *
 *
*/

var csInterface = new CSInterface();
var appName = csInterface.hostEnvironment.appName;
var isChecked = true;
var isFlipped = true;

if (appName === "ILST") {
  var menuXML = '<Menu> \
    <MenuItem Id="scanning" Label="Scan on/off" Enabled="true" Checked="true"/> \
    <MenuItem Id="highlighting" Label="Highlight on/off" Enabled="false" Checked="false"/> \
    <MenuItem Id="refreshPanel" Label="Refresh panel" Enabled="true" Checked="false"/> \
    <MenuItem Id="showHistory" Label="Log current history" Enabled="true" Checked="false"/> \
    <MenuItem Id="flipHandles" Label="Flip handles" Enabled="false" Checked="false"/> \
    \
    <MenuItem Label="---" /> \
    \
    <MenuItem Id="resetThisCookie" Label="Reset this cookie" Enabled="true" Checked="false"/> \
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
    <MenuItem Id="scanning" Label="Scan on/off" Enabled="true" Checked="true"/> \
    <MenuItem Id="refreshPanel" Label="Refresh panel" Enabled="true" Checked="false"/> \
    <MenuItem Id="showHistory" Label="Log current history" Enabled="true" Checked="false"/> \
    <MenuItem Id="flipHandles" Label="Flip handles" Enabled="false" Checked="false"/> \
    \
    <MenuItem Label="---" /> \
    \
  	<MenuItem Id="resetThisCookie" Label="Reset this cookie" Enabled="true" Checked="false"/> \
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
  } else if (event.data.menuId=="flipHandles") {
    isFlipped = !isFlipped;
    flipHandles(isFlipped);
  } else if (event.data.menuId=="highlighting") {
    isHighlight = !isHighlight;
    highlight(isHighlight);
  } else if (event.data.menuId=="scanning") {
    isChecked = !isChecked;
    csInterface.updatePanelMenuItem("Scan on/off", true, isChecked);
    if (isChecked) {
      scannerToggle("On");
    } else {
      scannerToggle("Off");
    }
  }
  // console.log(event.data.menuId + " clicked");
}
