//npm install --save jimp
//import jimp library to the environment
var Jimp = require('jimp');
 
//User-Defined Function to read the images
async function main() {
    const image = await Jimp.read
('./100.png');
//rotate Function having rotation angle as 99, mode and callback function
  image.resize(64, 64, Jimp.RESIZE_NEAREST_NEIGHBOR, function(err){
      if (err) throw err;
  })
      .write('test.png');
}
 
main();
  console.log("Image Processing Completed");