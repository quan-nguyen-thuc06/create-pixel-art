// var Tesseract = require('tesseract.js');
var Jimp = require("jimp");


Jimp.read("resize2.png").then(function (image) {
    image
    .color([{apply: 'shade', params: [255]}])
    .contrast(1)
    .write("img-opt.png");
})