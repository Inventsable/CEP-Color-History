/**
 * @requires CSInterface.js
 *
 * cookies.js
 *
 * @function convertCookiesToHistory(num)
 *	 @param num  	    digit ("1") to set colorHistory from corresponding cookie.
 *     resets colorHistory to match cookie
 *
 * @function updateCookies(num,type,location,color)
 *	 @param  num      digit (historyIndex) of corresponding cookie.
 *	 @param  type     'add' or 'remove'.
 *	 @param  location 'start' or 'end'.
 *	 @param  color    hexadecimal value ('ff0000') of color.
 *
 * @function resetCookie(name)
 *	 @param  name     string to reset cookie ("colorHistory1") to placeholder values.
 *
 * @function resetAllCookies()
 *	 (over)writes 3 cookies with placeholder values into memory.
 *
 * @function deleteCookie(name)
 *	 @param  name     string to delete cookie of this name ("colorHistory1").
 *
 * @function deleteAllCookies()
 *   erases all current cookies from memory.
 *
 * @function addRandomCookie(num)
 *   @param num       digit (historyIndex) of corresponding cookie.
 *
 *
 */

var csInterface = new CSInterface();
var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/client/";
var colorHistory = [];

if (document.cookie.length < 1) {
  console.log("Creating first cookies");
  resetAllCookies();
} else {
  console.log("Cookies already exist");
  convertCookiesToHistory("1");
}


function convertCookiesToHistory(num){
  colorHistory = [];
  // var newNum = num + 1;
  var newNum = num;
  var whichHistory = "colorHistory" + newNum;
	var cookies = getCookie(whichHistory).split(",");
	for (var index = 0; index < cookies.length; index++)
	{
		// console.log(cookies[index]);
		colorHistory.push(cookies[index]);
	}
}

function updateCookies(num, type, location, color){
  if (type === "remove") {
    if (location === "start") {
      colorHistory.shift();
    } else {
      colorHistory.pop();
    }
  } else if (type === "add") {
    if (location === "start") {
      colorHistory.unshift(color);
    } else {
      colorHistory.push(color);
    }
  }
  var thisHistory = "colorHistory" + num;
  setCookie(thisHistory, colorHistory, 30);
}

function resetCookie(num){
  var whichHistory = "colorHistory" + num;
  if (num === "1") {
    colorHistory = ["ffffff", "000000"];
  } else if (num === "2") {
    colorHistory = ["ffffff", "000000"];
  } else if (num === "3") {
    colorHistory = ["ffffff", "000000"];
  }
  setCookie(whichHistory, colorHistory, 30);
}




function addRandomCookie(num) {
	//	https://stackoverflow.com/a/5092872
	var randomColor = "000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
		// colorHistory.unshift(randomColor);
		console.log("Adding " + randomColor + " to cookie " + num);
    updateCookies(num, "add", "start", randomColor)
}

function resetAllCookies(){
	resetCookie("1");
	resetCookie("2");
	resetCookie("3");
  console.log("All cookies reset");
}

function removeLastComma(str) {
   return str.replace(/,(\s+)?$/, '');
}

// var path = extensionRoot + "lib";
// var result = window.cep.fs.writeFile(path, colorHistory);
// if (0 == result.err) {
//     console.log("Success");
//      // ...// success
// }
// else {
//   console.log(result.err);
//      // ...// fail
// }
// console.log(result);




function alertCookie() {
  alert(document.cookie);
}


// document.cookie = "colorHistorycolorHistory2=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=" + extensionRoot + ";";

function deleteAllCookies() {
  var cookies = document.cookie.split(";");
	for (var index = 1; index <= cookies.length; index++)
	{
		console.log("colorHistory" + index);
    document.cookie = "colorHistory" + index + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=" + extensionRoot + ";";
    console.log("all cookies cleared");
	}
}


function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=C:/Users/PortablePawnShop/AppData/Local/Temp/cep_cache/ILST_22.1.0_com.multi.app.panel";
}


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var historyCookie=getCookie("colorHistory");
    if (historyCookie != "") {
        alert("Welcome again " + historyCookie);
    } else {
       historyCookie = prompt("Please enter your name:","");
       if (historyCookie != "" && historyCookie != null) {
           setCookie("colorHistory", historyCookie, 30);
       }
    }
}


function deleteCookie(cookiename)
    {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        var expires = ";expires="+d;
        var path = ";path=" + extensionRoot + ";";
        var name=cookiename;
        //alert(name);
        var value="";
        document.cookie = name + "=" + value + expires + path;
    }


function clearListCookies()
{
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++)
    {
        var spcook =  cookies[i].split("=");
        deleteCookie(spcook[0]);
    }
    function deleteCookie(cookiename)
    {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        var expires = ";expires="+d;
        var name=cookiename;
        //alert(name);
        var value="";
        document.cookie = name + "=" + value + expires + "; path=/acc/html";
    }
    window.location = ""; // TO REFRESH THE PAGE
}
