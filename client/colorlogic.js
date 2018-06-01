// var colorHistory = ["ff0000", "00aaff", "fcfcfc", "b0b0b0", "ff9911"];
function sortInSpectrum(direction){
  console.log("Sorting: " + colorHistory);
  var n = [];
  for (var index = 0; index < colorHistory.length; index++){
    var c = [];
    c.push(hexToRgb(colorHistory[index]).r);
    c.push(hexToRgb(colorHistory[index]).g);
    c.push(hexToRgb(colorHistory[index]).b);
    n.push(rgbToHsl(c));
  }

  n.sort(function(a, b){
    return a[0] - b[0];
  });
  var sorted = [];
  for (var index = 0; index < n.length; index++) {
    if (direction === "forward") {
      sorted.push(hslToHex(n[index][0], n[index][1], n[index][2]));
    } else {
      sorted.unshift(hslToHex(n[index][0], n[index][1], n[index][2]));
    }
  }
  console.log("Sorted: " + sorted);
  while (colorHistory.length > 0) {
    colorHistory.pop()
  }
  return sorted;
}

function healHistory() {
	var bug = 0;
	for (var index = 0; index < colorHistory.length; index++) {
		try {
			if (!isAlphaNumeric(colorHistory[index])) {
				console.log("//DIA: Alphanumeric bug at: " + colorHistory[index]);
				if (index < 1) {
					colorHistory.shift();
				} else if (index === colorHistory.length) {
					colorHistory.pop();
				} else {
					colorHistory.splice(index,1);
				}
				bug++;
				continue;
			}
			if (!isHexColor(colorHistory[index])) {
				console.log("//DIA: Invalid hex color at: " + colorHistory[index]);
				if (index < 1) {
					colorHistory.shift();
				} else if (index === colorHistory.length) {
					colorHistory.pop();
				} else {
					colorHistory.splice(index,1);
				}
				bug++;
				continue;
			}
		}
		catch (e){
			console.log("//DIA: Undefined bug at: " + colorHistory[index]);
			if (index < 1) {
				colorHistory.shift();
			} else if (index === colorHistory.length) {
				colorHistory.pop();
			} else {
				colorHistory.splice(index,1);
			}
			bug++;
		}
	}
	// console.log("//DIA: " + colorHistory.length + " passes for " + colorHistory);
	if (bug === 0) {
		// console.log("History is healthy");
	} else {
		console.log("Corrected history error");
	}

  // if (colorHistory.length < 1) {
  //   colorHistory.push("000000");
  //   colorHistory.push("ffffff");
  //   console.log("Error: no history, creating a generic one.");
  // }
}

function correctCookie(name) {
	var correct = 0;
	var num = 0;
	var whichHistory = "colorHistory" + num;
	var cookies = getCookie(name).split(",");
	for (var index = 0; index < cookies.length; index++)
	{
		try {
			if (typeof cookies[index] != 'undefined') {
				if (!isHexColor(cookies[index])) {
					if (index < 1) {
						cookies.shift();
					} else if (index === cookies.length) {
						cookies.pop();
					} else {
						cookies.splice(index, 1)
					}
				} else {
					correct++;
				}
			} else {
				if (index < 1) {
					cookies.shift();
				} else if (index === cookies.length) {
					cookies.pop();
				} else {
					cookies.splice(index, 1)
				}
			}
		}
		catch(e) {
			if (index < 1) {
				cookies.shift();
			} else if (index === cookies.length) {
				cookies.pop();
			} else {
				cookies.splice(index, 1)
			}
		}
	}
	setCookie(whichHistory, cookies, 30)
}
