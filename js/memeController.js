'use strict'

let gElCanvas
let gCtx
let gPrevPos
let gDragLineIdx = -1
let gFont = 'Impact'

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    onInitGallery()
    eventListenersMemes()
    renderMeme()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function eventListenersMemes() {
    const input = document.querySelector(".text-input")
    input.addEventListener("input", onUpdateText)

    const addLine = document.querySelector(".add-line-input")
    addLine.addEventListener("click", onAddLine)

    const galleryBtn = document.querySelector(".gallery-btn")
    galleryBtn.addEventListener("click", onGalleryPage)

    const logoBtn = document.querySelector(".logo")
    logoBtn.addEventListener("click", onGalleryPage)

    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)

    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}

function renderMeme() {
    const img = getSelectedMeme()
    renderImgAndText(img)
}

function renderImgAndText(img) {
    const elImg = new Image()
    elImg.src = `${img.url}`

    elImg.onload = () => {
        gElCanvas.width = elImg.width
        gElCanvas.height = elImg.height
        resizeCanvas()
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        const meme = getMeme()
        meme.lines.forEach((_, idx) => {
            renderText(idx)
        })
    }
}

function renderText(idx) {
    const meme = getMeme()
    const line = meme.lines[idx]

    gCtx.lineWidth = 1
    gCtx.strokeStyle = 'black'
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    gCtx.fillStyle = line.color
    gCtx.font = `${line.size}px ${gFont}`

    gCtx.fillText(line.txt, line.xPos, line.yPos)
    gCtx.strokeText(line.txt, line.xPos, line.yPos)

    if (line.isSelected) {
        drawRect(line.xPos, line.width, line.yPos, line.size)
    }
}

function onGalleryPage() {
    document.querySelector(".editor").classList.add('hide')
    document.querySelector(".gallery").classList.remove('hide')
}

function onResetCanvas() {
    resetCanvas()
    renderMeme()
}

function onUpdateText(ev) {
    const textContent = ev.target.value
    setUpdateText(textContent)
    renderMeme()
}

function downloadMeme(elLink) {
    turnOffRect()
    renderMeme()
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

function onUpdateFillColor(ev) {
    const fillColor = ev.target.value
    updateFillColor(fillColor)
    renderMeme()
}

function onUpdateFontSize(plusOrMinus) {
    updateFontSize(plusOrMinus)
    renderMeme()
}

function onAddLine() {
    gCurrLineIdx = createLine()
    gMeme.lines.forEach((line, idx) => {
        line.isSelected = idx === gCurrLineIdx
    })
    resetInputTub()
    renderMeme()
}

function onRemoveLine() {
    removeLine()
    renderMeme()
}

function resetInputTub() {
    const input = document.querySelector(".text-input")
    input.value = ''
}

function onDown(ev) {
    const pos = getEvPos(ev)
    gDragLineIdx = isObjectClicked(pos)
    gPrevPos = pos
    gMeme.lines.forEach((line, idx) => {
        line.isSelected = idx === gDragLineIdx
    })
    if (gDragLineIdx !== -1) {
        _updateInputBarContent(gDragLineIdx)
    } else turnOffRect()
    renderMeme()
}

function onMove(ev) {
    if (gDragLineIdx !== -1) {
        const pos = getEvPos(ev)
        const offsetX = pos.x - gPrevPos.x
        const offsetY = pos.y - gPrevPos.y

        let meme = getMeme()
        const line = meme.lines[gDragLineIdx]
        if (!line) return
        line.xPos += offsetX
        line.yPos += offsetY

        gPrevPos = pos
        renderMeme()
    }
    return
}

function onUp() {
    if (gDragLineIdx !== -1) {
        _onChooseLine()
        gDragLineIdx = -1
        renderMeme()
    }
    return
}

function _updateInputBarContent(lineIdx) {
    const textContent = gMeme.lines[lineIdx].txt
    const input = document.querySelector('.text-input')
    input.value = textContent
}

function onUpdateSelectedLine(plusOrMinus) {
    if (gMeme.lines.length === 0) return
    updateSelectedLine(plusOrMinus)
    _updateInputBarContent(gCurrLineIdx)
    renderMeme()
}

function _onChooseLine() {
    let meme = getMeme()
    const currTextContent = meme.lines[gDragLineIdx].txt
    const currFillColor = meme.lines[gDragLineIdx].color
    gCurrLineIdx = gDragLineIdx
    setUpdateText(currTextContent)
    updateFillColor(currFillColor)
}

function isObjectClicked(clickedPos) {
    const meme = getMeme()
    for (let idx = 0; idx < meme.lines.length; idx++) {
        const line = meme.lines[idx]
        const textWidth = gCtx.measureText(line.txt).width
        const textHeight = line.size

        const textLeft = line.xPos - textWidth / 2
        const textRight = line.xPos + textWidth / 2
        const textTop = line.yPos - textHeight / 2
        const textBottom = line.yPos + textHeight / 2

        if (
            clickedPos.x >= textLeft &&
            clickedPos.x <= textRight &&
            clickedPos.y >= textTop &&
            clickedPos.y <= textBottom
        ) {
            return idx
        }
    }
    return -1
}

function drawRect(xPos, xWidth, yPos, yHeight) {
    gCtx.beginPath()
    gCtx.rect(xPos - xWidth / 2, yPos - yHeight / 2, xWidth, yHeight)
    gCtx.strokeStyle = '#9F0D7F'
    gCtx.lineWidth = 2
    gCtx.stroke()
}

function onObjectSelection(ev) {
    const { offsetX, offsetY } = ev
    console.log('offsetX', offsetX)
    console.log('offsetY', offsetY)
}

function updateLineMass(line) {
    const ctx = gCtx
    ctx.font = `${line.size}px Impact`
    const metrics = ctx.measureText(line.txt)
    line.width = metrics.width
    line.height = line.size
}

function onUploadCanvasToFacebook() {
    turnOffRect()
    renderMeme()
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg')

    function onSuccess(uploadedImgUrl) {
        const url = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
    }
    doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}

function turnOffRect() {
    gMeme.lines.forEach((line) => {
        line.isSelected = false
    })
}

function onChangeFontCanvas(font) {
    gFont = font
    renderMeme()
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()

    reader.onload = function (event) {
        let img = new Image()
        img.src = event.target.result
        img.onload = () => onImageReady(img)
    }
    reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    renderImgAndText(img)
}
