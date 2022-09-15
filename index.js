const fs = require('fs')
const Jimp = require('jimp')


const getLevel = ()=>{
    return new Promise((resolve, reject) => {
        let data = []
        let mapColor = new Map()
        Jimp.read('./img-opt.png',  (err, image)=> {
            const width = image.bitmap.width
            const height = image.bitmap.height
            const size = Math.max(width, height)
            console.log(width, height)
            const resultMapColor = new Map()
            for (let y = 0; y < size; y++) {
                data[y] = []
                for (let x = 0; x < size; x++) {
                    data[y][x] = 0
                    
                    const colorRGBA = Jimp.intToRGBA(image.getPixelColor(x, y))
                    // console.log(colorRGBA)
                    if(colorRGBA.a >0) {
                        const color = (colorRGBA.r << 16) + (colorRGBA.g << 8) + (colorRGBA.b)
                        if (!resultMapColor.has(color)) {
                            const idColor = resultMapColor.size + 1
                            resultMapColor.set(color, idColor)
                        }
                        data[y][x] = resultMapColor.get(color)
                    }
                }
                
                for (const map of resultMapColor.entries()) {
                    mapColor.set(map[1], map[0])
                }
            }
            
            // console.log(mapColor)
            // const catalog = {
            //     mapColor: JSON.stringify(Array.from(mapColor.entries())),
            //     data: data,
            // }
            // fs.writeFile("./levels.json", JSON.stringify(catalog), function(err, result) {
            //     if(err) console.log('error', err);
            // });
            resolve([data,mapColor])
        })
        // resolve(data)
    })
}

console.log(getLevel().then(data => {
    console.log(data[1])
}
    ))
    // console.log(data)
