'use strict'

var gElCanvas
var gCtx
var gPrevPos
let gDragLineIdx = -1

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    onInitGallery()
    eventListenersMemes()
    renderMeme()
}

function eventListenersMemes() {
    const input = document.querySelector(".text-input")
    input.addEventListener("input", onUpdateText)

    const fillColor = document.querySelector(".input-fill-color")
    fillColor.addEventListener("change", onUpdateFillColor)

    const addLine = document.querySelector(".add-line-input")
    addLine.addEventListener("click", onAddLine)

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
        gElCanvas.height = (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)

        const meme = getMeme()
        meme.lines.forEach((_, idx) => {
            renderText(idx)
        })
    }
}

// FIXME: coor diffult on the middle of the canvas
function renderText(idx) {
    const meme = getMeme()
    const line = meme.lines[idx]

    gCtx.lineWidth = 1
    gCtx.strokeStyle = 'black'
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    gCtx.fillStyle = line.color
    gCtx.font = `${line.size}px Impact`

    // FIXME: coor on the middle of the canvas
    gCtx.fillText(line.txt, line.xPos, line.yPos)
    gCtx.strokeText(line.txt, line.xPos, line.yPos)

    if (line.isSelected) {
        drawRect(line.xPos, line.width, line.yPos, line.size)
    }
    // drawRect(x, y)
}

function onUpdateText(ev) {
    const textContent = ev.target.value
    console.log("ev", textContent)
    setUpdateText(textContent)
    // updateSelectedLineText(textContent)
    renderMeme()
}

function downloadMeme(elLink) {
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

function resetInputTub() {
    const input = document.querySelector(".text-input")
    input.value = ''
}

function onDown(ev) {
    const pos = getEvPos(ev)
    gDragLineIdx = isObjectClicked(pos)
    gPrevPos = pos

    console.log("gDragLineIdx", gDragLineIdx)
    gMeme.lines.forEach((line, idx) => {
        line.isSelected = idx === gDragLineIdx
    })

    if (gDragLineIdx !== -1) {
        _updateInputBarContent(gDragLineIdx)
        renderMeme()
    }
    return
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
    return null
}

function drawRect(xPos, xWidth, yPos, yHeight) {
    gCtx.beginPath()
    gCtx.rect(xPos - xWidth / 2, yPos - yHeight / 2, xWidth, yHeight)
    gCtx.strokeStyle = '#9F0D7F'
    gCtx.lineWidth = 2
    gCtx.stroke()
}

//FIXME:
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


