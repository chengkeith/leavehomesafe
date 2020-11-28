var g = (id) => document.getElementById(id);
var imgs = {};
var newImg = (url) => {
	let img = new Image();
	img.src = 'images/' + url + '.png';
	imgs[url] = img;
}

var makePdf = function() {
	// light green: rgb(38, 201, 153)
	// dark green: rgb(19, 177, 135)
	// yellow text: rgb(255, 218, 47)

	// white strip: 33 mm
	// light green strip: 27 mm
	// bottom white strip: 33mm

	// input
	let venueId = Base64.encode(('' + (new Date()).getTime()).substring(7, 13));
	let nameChi = g('nameChi').value;
	let nameEng = g('nameEng').value;
	let addr1 = g('addr1').value;
	let addr2 = g('addr2').value;

	// Default export is a4 paper, portrait, using millimeters for units
	//const doc = new jsPDF();
	const doc = new jspdf.jsPDF();
	// sets to auto print
	doc.autoPrint();

	// background image
	// doc.addImage(fs.readFileSync('image1.png'), "PNG", 0, 0, 210, 297);

	// draw layout
	// top
	doc.addImage(imgs.topleft, "PNG", 10, 6, 68, 22);
	doc.addImage(imgs.topright, "PNG", 149, 10, 52, 13);
	// light green strip
	doc.setFillColor(38, 201, 153);
	doc.rect(0, 33, 210, 27, 'F');
	doc.addImage(imgs.topcenter, "PNG", 47, 33.1, 114, 27);
	// dark green strip
	doc.setFillColor(19, 177, 135);
	doc.rect(0, 60, 210, 205, 'F');
	// bottom four images
	doc.addImage(imgs.bottomleft, "PNG", 0, 267, 77, 27);
	doc.addImage(imgs.apple, "PNG", 97, 276, 34, 11);
	doc.addImage(imgs.google, "PNG", 132.5, 276, 37, 11);
	doc.addImage(imgs.huawei, "PNG", 171, 276, 36, 11);
	// black border
	doc.setFillColor(0, 0, 0);
	doc.rect(0, 0, 210, 297, 'S');

	// font
	if(nameChi.length > 0 || nameEng.length > 0 || addr1.length > 0 || addr2.length > 0) {
		doc.addFont("arial-unicode-ms.ttf", "ArialUnicodeMS", "normal");
		doc.setFont("ArialUnicodeMS");
	}


	// title chinese (yellow)
	if(nameChi.length > 0) {
		doc.setTextColor(255, 218, 47); // yellow
		doc.setFontSize(20);
		doc.text(nameChi, 105, 83, 'center');
	}
	// title eng (yellow)
	if(nameEng.length > 0) {	
		doc.setTextColor(255, 218, 47); // yellow
		doc.setFontSize(16.5);
		doc.text(nameEng, 105, 92, 'center');
	}

	// address chinese (white)
	if(addr1.length > 0) {
		doc.setTextColor(255, 255, 255); // white
		doc.setFontSize(16);
		doc.text(addr1, 105, 242, 'center');
	}

	// address english (white)
	if(addr2.length > 0) {
		doc.setTextColor(255, 255, 255); // white
		doc.setFontSize(14);
		doc.text(addr2, 105, 249, 'center');
	}

	// qrcode 
	let centerX = 105;
	let centerY = 165;
	let size = 109;
	doc.setFillColor(255, 255, 255); // white
	doc.rect(centerX - size * 0.5, centerY - size * 0.5, size, size, 'F');
	let hash = sha256("HKEN" + venueId + "2020");
	// console.log(hash);
	let str = "HKEN:0" + venueId + Base64.encode(JSON.stringify({"metadata":null,"nameZh":nameChi,"nameEn":nameEng,"type":"IMPORT","hash":hash}));
	QRCode.toDataURL(str, {errorCorrectionLevel: 'M'}).then((dataUrl) => {
		size = 98;
		doc.addImage(dataUrl, "PNG", centerX - size * 0.5, centerY - size * 0.5, size, size);

		// add logo in middle of qrcode
		size = 14;
		doc.addImage(imgs.image2, "PNG", centerX - size * 0.5, centerY - size * 0.5, size, size);
		// download prompt
		let blob = new Blob([doc.output('arraybuffer')], { 'type' : 'application/pdf' });
		saveAs(blob, "leavehomesafe.pdf");
	});
}
var makePdfQRCodeOnly = function() {
	// input
	let venueId = Base64.encode(('' + (new Date()).getTime()).substring(7, 13));
	let nameChi = g('nameChi').value;
	let nameEng = g('nameEng').value;
	let addr1 = g('addr1').value;
	let addr2 = g('addr2').value;

	// Default export is a4 paper, portrait, using millimeters for units
	//const doc = new jsPDF();
	const doc = new jspdf.jsPDF();
	// sets to auto print
	doc.autoPrint();

	// background image
	// doc.addImage(fs.readFileSync('image1.png'), "PNG", 0, 0, 210, 297);

	// font
	if(nameChi.length > 0 || nameEng.length > 0 || addr1.length > 0 || addr2.length > 0) {
		doc.addFont("arial-unicode-ms.ttf", "ArialUnicodeMS", "normal");
		doc.setFont("ArialUnicodeMS");
	}


	// title chinese
	doc.setTextColor(0, 0, 0); // black
	if(nameChi.length > 0) {
		doc.setFontSize(20);
		doc.text(nameChi, 105, 83, 'center');
	}
	// title eng
	if(nameEng.length > 0) {
		doc.setFontSize(16.5);
		doc.text(nameEng, 105, 92, 'center');
	}

	// address chinese
	if(addr1.length > 0) {
		doc.setFontSize(16);
		doc.text(addr1, 105, 242, 'center');
	}

	// address english
	if(addr2.length > 0) {
		doc.setFontSize(14);
		doc.text(addr2, 105, 249, 'center');
	}

	// qrcode 
	let centerX = 105;
	let centerY = 165;
	let hash = sha256("HKEN" + venueId + "2020");
	// console.log(hash);
	let str = "HKEN:0" + venueId + Base64.encode(JSON.stringify({"metadata":null,"nameZh":nameChi,"nameEn":nameEng,"type":"IMPORT","hash":hash}));
	QRCode.toDataURL(str, {errorCorrectionLevel: 'M'}).then((dataUrl) => {
		let size = 98;
		doc.addImage(dataUrl, "PNG", centerX - size * 0.5, centerY - size * 0.5, size, size);

		// download prompt
		let blob = new Blob([doc.output('arraybuffer')], { 'type' : 'application/pdf' });
		saveAs(blob, "qrcode.pdf");
	});
}
window.onload = function() {
	// preload images
	newImg('topleft')
	newImg('topright');
	newImg('topcenter');;
	newImg('bottomleft');
	newImg('apple');
	newImg('google');
	newImg('huawei');
	newImg('image2')
	g('submitButton').addEventListener('click', makePdf);;
	g('qrcodeButton').addEventListener('click', makePdfQRCodeOnly);
}