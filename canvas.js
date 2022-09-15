const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')

const width = 1200
const height = 630

const canvas = createCanvas(64, 64)
const context = canvas.getContext('2d')

loadImage('./unnamed.png').then(image => {
    context.imageSmoothingEnabled = false
  context.drawImage(image, 0, 0, 569, 569, 0, 0, 90, 90)
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync('./test.png', buffer)
})