import { parsePixels } from './functions.js'
import { colors as moreColors } from './constants.js';

(async () => {
    const colors = await moreColors
    // const res = colorDifference(colors.yellow, colors.blue)
    // console.log(res)
    let processed = 0
    const [canvas, overlay, img] = [document.createElement('canvas'), document.createElement('canvas'), document.createElement('img')]

    // img.src = "_assets/data/example.png"

    img.onload = () => {
        document.body.appendChild(img)
        canvas.width = img.width;
        canvas.height = img.height;
        overlay.width = canvas.width
        overlay.height = canvas.height
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        document.body.removeChild(img)
        document.body.appendChild(overlay)
        document.body.appendChild(canvas)

        const sequence = parsePixels(canvas, overlay, img);
        const { pixels, rows, columns, resolution } = sequence.next().value
        const [currentCount, totalCount] = [ document.querySelectorAll('.currentCount'), document.querySelectorAll('.totalCount') ]
        const [rowsElement, columnsElement, resolutionElement] = [ document.querySelector('#rows'), document.querySelector('#columns'), document.querySelector('#resolution')]
        totalCount.forEach(el => el.innerHTML = pixels.toLocaleString())
        rowsElement.innerHTML = rows.toLocaleString()
        columnsElement.innerHTML = columns.toLocaleString()
        resolutionElement.innerHTML = resolution


        const { value, done } = sequence.next()
        if(done) {
            window.clearInterval(intvl)
        }
        processed++
        updatePreview({...value})
        currentCount.forEach(el => el.innerHTML = processed.toLocaleString())
        
        
        const intvl = window.setInterval(async () => {
            const { value, done } = sequence.next()
            // console.log(value, done)
            if(done) {
                window.clearInterval(intvl)
            }
            // progress.value = value
            processed++
            updatePreview(value)
            currentCount.forEach(el => el.innerHTML = processed.toLocaleString())
            // currentCount.innerHTML = value.toLocaleString()
        }, 1)
    }


    document.querySelector('#bands > input').addEventListener('input', (e) => {
        document.querySelector('#bands > span').textContent = e.target.value
        let colorBands = ''
        switch (e.target.value) {
            case '3':
                colorBands = "Red, Green, Blue"
                break;
            case '6':
                colorBands = "Red, Orange, Yellow, Green, Blue, Violet"
                break;
            case '9':
                colorBands = "Nine Color Bands"
                break;
            case '12':
                colorBands = "Twelve Color Bands"
                break;
        }

        document.querySelector('#colorBands').innerHTML = colorBands

    })
    document.querySelector('#bands > span').addEventListener('input', (e) => {
        document.querySelector('#bands > input').value = e.target.textContent
    })

    document.querySelector('#uploadPhoto').addEventListener('submit', e => {
        e.preventDefault()
        var file = e.target.querySelector('input[type=file]').files[0];
        var reader  = new FileReader();

        reader.addEventListener("load", function () {
            img.src = reader.result;
        }, false);
      
        if (file) {
          reader.readAsDataURL(file);
          document.querySelector('img-stats').removeAttribute('hidden')
          e.target.toggleAttribute('hidden')
        }
      
    })

    for(let colorName in colors ) {
        const swatch = colors[colorName]
        const div = document.createElement('div')
        div.innerHTML = `<p><span class="swatch ${colorName}" style="background-color: rgb(${swatch.red}, ${swatch.green}, ${swatch.blue})"></span><br/><span class="totals">0</span></p>`
        document.querySelector('color-swatches').appendChild(div)
    }
    // document.querySelector('color-swatches')

})()


async function updatePreview(colorSwatches) {
    const { red, green, blue, ...stuff } = await colorSwatches

    const previewExists = document.querySelector('color-preview')
    if(previewExists) previewExists.parentElement.removeChild(previewExists)
    
    const preview = document.createElement('color-preview')
    const swatch = document.createElement('color-swatch')

    swatch.style=`background-color: rgb(${red}, ${green}, ${blue});`

    preview.appendChild(swatch)
    document.querySelector('dialog').appendChild(preview)

}