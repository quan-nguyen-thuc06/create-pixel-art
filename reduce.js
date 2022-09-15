class Pixel {
    constructor(src, x, y) {
        this.src = src
        this.lab = src[x][y]
        this.x = x
        this.y = y
        this.group = [this]
    }
    getAverageColors() {
        const colors = this.group.map((x) => x.lab)
        const length = colors.length
        const averageColor = colors.reduce((a, b) => [a[0] + b[0] / length, a[1] + b[1] / length, a[2] + b[2] / length,], [0, 0, 0],)
        return averageColor
    }
    mergeGroup(pixel) {
        const g1 = this.group
        const g2 = pixel.group
        const newGroup = [...g1, ...g2]
        for (let p of newGroup) {
            p.group = newGroup
        }
    }
    deltaE(pixel) {
        const averageColor = this.getAverageColors()
        return Math.sqrt((averageColor[0] - pixel.lab[0]) ** 2 + (averageColor[1] - pixel.lab[1]) ** 2 + (averageColor[2] - pixel.lab[2]) ** 2,)
    }
    draw() {
        const averageColor = this.getAverageColors()
        for (let p of this.group) {
            p.src[p.x][p.y] = averageColor
            p.group = []
        }
    }
}

function processPixel(pixels, x, y, maxDeltaE = 9) {
    const t = pixels[x][y]
    const p = []
    if (x - 1 >= 0) {
        p.push(pixels[x - 1][y])
    }
    if (x + 1 < pixels[0].length) {
        p.push(pixels[x + 1][y])
    }
    if (y - 1 >= 0) {
        p.push(pixels[x][y - 1])
    }
    if (y + 1 < pixels.length) {
        p.push(pixels[x][y + 1])
    }
    let minIndex
    while (minIndex != -1) {
        minIndex = -1
        let minD = 99999
        for (let i = 0; i < p.length; i++) {
            if (p[i].group == t.group) {
                continue
            }
            const d = t.deltaE(p[i])
            if (d > maxDeltaE) {
                continue
            }
            if (d < minD) {
                minD = d
                minIndex = i
            }
        }
        if (minIndex != -1) {
            t.mergeGroup(p[minIndex])
        }
    }
}

function processGroups(pixels, maxDeltaE = 9) {
    const h = pixels.length
    const w = pixels[0].length
    while (true) {
        const groups = []
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                const p = pixels[x][y]
                if (groups.indexOf(p.group) < 0) {
                    groups.push(p.group)
                }
            }
        }
        let isMergeGroup = false
        for (let i = 0; i < groups.length; i++) {
            const groupi = groups[i]
            const pi = groupi[0]
            for (let j = i + 1; j < groups.length; j++) {
                const groupj = groups[j]
                const pj = groupj[0]
                if (pi.deltaE(pj) < maxDeltaE) {
                    pi.mergeGroup(pj)
                    break
                }
            }
            if (isMergeGroup) {
                break
            }
        }
        if (!isMergeGroup)
            break
    }
}

export default function reducePixelColor(img) {
    const lab = convertImageStringToImageRGB(img)
    const h = lab.length
    const w = lab[0].length
    const pixels = []
    for (let x = 0; x < w; x++) {
        const line = []
        for (let y = 0; y < h; y++) {
            line.push(new Pixel(lab, x, y))
        }
        pixels.push(line)
    }
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            processPixel(pixels, x, y, 13)
        }
    }
    processGroups(pixels, 13)
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            pixels[x][y].draw()
        }
    }
    return convertImageRGBToImageString(lab)
}

function convertImageStringToImageRGB(image) {
    return image.map((row) => row.map(stringToRGB))
}

function convertImageRGBToImageString(image) {
    return image.map((row) => row.map((rgb) => rgbToString(Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2])),),)
}

const stringToRGB = (value) => {
    const v = parseInt(value.slice(1), 16)
    return numberToRGB(v)
}

function rgbToString(R, G, B) {
    let r = R.toString(16)
    let g = G.toString(16)
    let b = B.toString(16)
    if (r.length == 1) r = '0' + r
    if (g.length == 1) g = '0' + g
    if (b.length == 1) b = '0' + b
    return '#' + r + g + b + 'ff'
}

const numberToRGB = (value) => {
    const { r, g, b } = { r: (value >> 16) & 0xff, g: (value >> 8) & 0xff, b: (value >> 0) & 0xff, }
    return [r, g, b]
}