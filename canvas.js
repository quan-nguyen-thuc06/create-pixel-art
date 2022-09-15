const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')

const width = 1200
const height = 630

const canvas = createCanvas(60, 76)
const context = canvas.getContext('2d')

loadImage('./pokemon.png').then(image => {
    context.imageSmoothingEnabled = false
  context.drawImage(image, 0, 0, 300, 377, 0, 0, 60, 76)
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync('./poke.png', buffer)
})