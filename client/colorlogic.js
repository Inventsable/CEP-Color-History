// var colorHistory = ["ff0000", "00aaff", "fcfcfc"];

function sortInSpectrum(){
  // var newVar = [255,200,60];
  for (var index = 0; index < colorHistory.length; index++){
    console.log(hexToRgb(colorHistory[index]).r + ", " + hexToRgb(colorHistory[index]).g + ", " + hexToRgb(colorHistory[index]).b);
    // console.log(rgbToHsl(newVar));
    console.log(rgbToHsl(hexToRgb(colorHistory[index]).r + ", " + hexToRgb(colorHistory[index]).g + ", " + hexToRgb(colorHistory[index]).b));
  }
}

// sortInSpectrum();

//
//
// const sort = data => {
//     data = Object.assign([], data);
//     const sorted = [data.shift()];
//     while(data.length) {
//         const a = data.shift(), c = { d: Infinity };
//         for(let [i, b] of Object.entries(sorted)) {
//             const average = Math.floor((
//                 Math.abs(a.r - b.r) +
//                 Math.abs(a.g - b.g) +
//                 Math.abs(a.b - b.b)
//             ) / 3);
//             if(average < c.d) {
//                 Object.assign(c, { d: average, i: i });
//             }
//         }
//         sorted.splice(c.i, 0, a);
//     }
//     return sorted.reverse();
// };

// const test = (title, data) => {
//     document.body.insertAdjacentHTML('beforeend', `<h2>${title}</h2>`);
//
//     for(let c of data) {
//         document.body.insertAdjacentHTML('beforeend', `<swatch style="background: rgb(${c.r},${c.g},${c.b})"></swatch>`);
//     }
//
//     return test;
// }





// function convertHistory(){
//   let data = [
//       {"hex": "#fe4670"},{"hex": "#5641bc"},{"hex": "#d53fc3"},{"hex": "#6b5e09"},
//       {"hex": "#4dd685"},{"hex": "#88d63f"},{"hex": "#eb93f3"},{"hex": "#f44847"},
//       {"hex": "#32d159"},{"hex": "#6e9bde"},{"hex": "#c3ec64"},{"hex": "#81cce5"},
//       {"hex": "#7233b6"},{"hex": "#bb90c3"},{"hex": "#728fde"},{"hex": "#7ef46a"},
//       {"hex": "#f7cfff"},{"hex": "#c8b708"},{"hex": "#b45a35"},{"hex": "#589279"},
//       {"hex": "#51f1e1"},{"hex": "#b1d770"},{"hex": "#db463d"},{"hex": "#5b02a2"},
//       {"hex": "#909440"},{"hex": "#6f53fe"},{"hex": "#4c29bd"},{"hex": "#3b24f8"},
//       {"hex": "#465271"},{"hex": "#6243"},  {"hex": "#dbcc4"}, {"hex": "#187c6"},
//       {"hex": "#1085e2"},{"hex": "#b521e9"},{"hex": "#4bd36d"},{"hex": "#11bc34"},
//       {"hex": "#455c47"},{"hex": "#a71bbf"},{"hex": "#988fc2"},{"hex": "#226cfe"}
//   ].reduce((m, e) => (m.push(Object.assign(e, {
//       r: parseInt(e.hex.substring(1, 3), 16) || 0,
//       g: parseInt(e.hex.substring(3, 5), 16) || 0,
//       b: parseInt(e.hex.substring(5, 7), 16) || 0
//   })), m), []);
// }

// const bigdata = (() => {
//     const data = [];
//
//     const rand = () => Math.floor(Math.random() * 256);
//
//     for(let i = 0; i < 1000; ++i) {
//         data.push({r: rand(), g: rand(), b: rand()});
//     }
//
//     return data;
// })();



//////
// for(let c of sort(data)) {
//   console.log(`${c.r},${c.g},${c.b}`);
// }
//////

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

  if (colorHistory.length < 1) {
    colorHistory.push("000000");
    colorHistory.push("ffffff");
    console.log("Error: no history, creating a generic one.");
  }
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
