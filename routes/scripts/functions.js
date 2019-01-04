import { colorDifference, scaleRGB, rgb2hsv } from './equations.js'
import { colors as oldColors } from './constants.js'

const parsePixel = async ({column:x, row:y}, canvas, overlay) => {
    const colors = await oldColors
    overlay.getContext('2d').fillStyle = `rgb(0,0,0)`
    overlay.getContext('2d').fillRect(x,y,1,1);

    const [red, green, blue, alpha ] = canvas.getContext('2d').getImageData(x, y, 1, 1).data
    let closestColor = {}
    let closestColorName = ''
    let closestDistance = 100000
    for(let colorName in colors) {
        const distance = colorDifference({red, green, blue}, colors[colorName])
        if(distance < closestDistance) {
            closestColor = colors[colorName]
            closestColorName = colorName
            closestDistance = distance
        }
    }
    
    overlay.getContext('2d').fillStyle = `rgb(${closestColor.red}, ${closestColor.green}, ${closestColor.blue})`
    overlay.getContext('2d').fillRect(x,y,1,1);
    // console.log(closestColorName)
    // document.querySelector(`.swatch.${closestColorName} .totals`).innerHTML = Number(document.querySelector(`.swatch.${closestColorName} .totals`).innerHTML) + 1

    const scaledRGB = scaleRGB({red, green, blue})
    const hsv = rgb2hsv(scaledRGB)
    return {red, green, blue, alpha, ...hsv}
}

export function* parsePixels(canvas, overlay, img) {
    yield {
        pixels: canvas.width * canvas.height,
        rows:canvas.height, 
        columns:canvas.width,
        resolution: `${canvas.height}x${canvas.width}`
    } 
    for(let row=0; row < canvas.height; row++) {
        for(let column=0; column < canvas.width; column++) {
            yield parsePixel({column, row}, canvas, overlay)
        }
    }
    return pixels
}

export function rgb2hex(rgb, noHash = false) {
    if(!noHash) return `#${Object.values(rgb).map(n => n.toString(16).padStart(2, '0')).join('')}`
    else return `${Object.values(rgb).map(n => n.toString(16).padStart(2, '0')).join('')}`
}

export function hex2rgb(hex) {
    let [match, red, green, blue] = hex.replace('#', '').match(/([a-z0-9]{2})([a-z0-9]{2})([a-z0-9]{2})/i)
    red = parseInt(red, 16)
    green = parseInt(green, 16)
    blue = parseInt(blue, 16)
    return {red, green, blue}
}