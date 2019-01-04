import { rgb2hex, hex2rgb } from './functions.js'

export const oldColors = {
    red: { red: 255, green: 0, blue: 0 },
    orange: { red: 255, green: 125, blue: 0},
    yellow: { red: 255, green: 255, blue: 0 },
    springGreen: { red: 125, green: 255, blue: 0 },
    green: { red: 0, green: 255, blue: 0 },
    turquoise: { red: 0, green: 255, blue: 125 },
    cyan: { red: 0, green: 255, blue: 255 },
    ocean: { red: 0, green: 125, blue: 255 },
    blue: { red: 0, green: 0, blue: 255 },
    violet: { red: 125, green: 0, blue: 255 },
    magenta: { red: 255, green: 0, blue: 255 },
    raspberry: { red: 255, green: 0, blue: 125 },
}

function objToCSSVariables(prefix, obj, modifier) {
    let output = ''
    for(let key in obj) {
        output += `--${prefix}-${key}: ${modifier(obj[key])};\n`
        // console.log(`#${colorObj.red}${colorObj.green}${colorObj.blue}`)
    }
    return output

} 

export async function CSSVariablesToObj () {
    const resp = await fetch('/_assets/styles/theme.css').then(r => r.text())
    const colorNames = resp.match(/\-\-color-[a-zA-Z\-]+/g).map(colorWithPrefix => colorWithPrefix.replace('--color-', ''))
    const result = {}
    for(let colorName of colorNames) {
        const hex = getComputedStyle(document.body).getPropertyValue(`--color-${colorName}`);
        const rgb = hex2rgb(hex)
        result[colorName] = rgb
    }
    return result
}

export const colors = (() => {
    return CSSVariablesToObj()
})()