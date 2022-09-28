let unCaptchNums;
fetch(browser.runtime.getURL("numbers.json"))
.then((req) => req.json())
.then((json)=>{unCaptchNums=json;});

let canvas = document.createElement('canvas');

let ctx = canvas.getContext('2d');

function getImg() {
    let img = document.createElement('img');
    img.onload = () => {main(img)};
    img.src = document.getElementsByTagName("img")[0].src;
}
function rgbToInt([red, green, blue, alpha]) {
	return (((((red << 8) | green) << 8) | blue));
}

let bg = rgbToInt([246, 243, 240, 255]);
let fn = rgbToInt([214, 191, 168, 255]);

function rgbToName(num) {
	if(num == bg) {
		return 0;
	}
	if(num == fn) {
		return 1;
	}
	return num;
}



function convImageData(imageData) {
	
	let out = [];
	
	let h = imageData.height;
	let w = imageData.width;
	
	let data = imageData.data;
	
	for(let i = 0; i < h; i++) {
		out.push([]);
		for(let j = 0; j < w; j++) {
			let idx = (i * w + j) * 4;
			let color = rgbToInt([data[idx + 0], data[idx + 1], data[idx + 2], data[idx + 3]]);
			out[i].push(rgbToName(color));
		}
	}
	
	return out;
}

function trimNum(arr) {
	let out = [];
	
	let i = 0;
	
	for(; i < arr.length; i++) {
		let flag = false;
		for(let j = 0; j < arr[i].length; j++) {
			if(arr[i][j] == 1) {
				flag = true;
			}
		}
		if(flag) {
			break;
		}
	}
	
	let min_idx = arr[0].length;
	let max_idx = 0;
	
	for(; i < arr.length; i++) {
		let line = [];
		let flag = false;
		
		for(let j = 0; j < arr[i].length; j++) {
			if(arr[i][j] == 1) {
				flag = true;
				if(j > max_idx) {
					max_idx = j;
				}
				if(j < min_idx) {
					min_idx = j;
				}
			}
			line.push(arr[i][j]);
		}
		if(flag) {
			out.push(line);
		} else {
			break;
		}
	}
	
	for(i = 0; i < out.length; i++) {
		out[i] = out[i].slice(min_idx, max_idx+1);
	}
	
	return out;
}

function isEqual(arr1, arr2) {
	if(arr1.length != arr2.length) {
		return false;
	}
	for(let i = 0; i < arr1.length; i++) {
		if(arr1[i].length != arr2[i].length) {
			return false;
		}
		for(let j = 0; j < arr1[i].length; j++) {
			if(arr1[i][j] != arr2[i][j]) {
				return false;
			}
		}
	}
	return true;
}

function arrToChar(arr) {
	let font = arr.length == 19 ? 0 : 1;
	
	for(let i = 0; i < 10; i++) {
		if(isEqual(unCaptchNums[font][i], arr)) {
			return i;
		}
	}
}

function main(img) {

	let s = '';
	ctx.drawImage(img, 0, 0);
	
	let nums = [];
	
	for(let i = 0; i < 6; i++) {
		let data = ctx.getImageData(20 * i, 0, 20, 30);
		let arr = trimNum(convImageData(data));
		let char = arrToChar(arr);
		s += char.toString();
	}
	document.getElementById('uCрt').value = s;
}

setTimeout(function run() {
    if(document.getElementById('content').getElementsByTagName('img').length > 0) {
        getImg();
    } else {
        setTimeout(run, 200);
    }
}, 200);
