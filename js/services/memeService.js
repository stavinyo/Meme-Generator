'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
let gCurrLineIdx = 0

let gImgs = [
    { id: 1, url: 'images/1.jpg', keywords: ['funny', 'cat'] },
    { id: 2, url: 'images/2.jpg', keywords: ['funny', 'cat'] },
    { id: 3, url: 'images/3.jpg', keywords: ['funny', 'cat'] },
    { id: 4, url: 'images/4.jpg', keywords: ['funny', 'cat'] },
    { id: 5, url: 'images/5.jpg', keywords: ['funny', 'cat'] },
    { id: 6, url: 'images/6.jpg', keywords: ['funny', 'cat'] },
    { id: 7, url: 'images/7.jpg', keywords: ['funny', 'cat'] },
    { id: 8, url: 'images/8.jpg', keywords: ['funny', 'cat'] },
    { id: 9, url: 'images/9.jpg', keywords: ['funny', 'cat'] },
    { id: 10, url: 'images/10.jpg', keywords: ['funny', 'cat'] },
    { id: 11, url: 'images/11.jpg', keywords: ['funny', 'cat'] },
    { id: 12, url: 'images/12.jpg', keywords: ['funny', 'cat'] },
    { id: 13, url: 'images/13.jpg', keywords: ['funny', 'cat'] },
    { id: 14, url: 'images/14.jpg', keywords: ['funny', 'cat'] },
    { id: 15, url: 'images/15.jpg', keywords: ['funny', 'cat'] },
    { id: 16, url: 'images/16.jpg', keywords: ['funny', 'cat'] },
    { id: 17, url: 'images/17.jpg', keywords: ['funny', 'cat'] },
    { id: 18, url: 'images/18.jpg', keywords: ['funny', 'cat'] },
]

let gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 35,
            color: 'white',
            isGrab: false,
            isSelected: false,
            xPos: 200,
            yPos: 200,
            width: 330,
            height: 40,
        }
    ]
}

let gKeywordSearchCountMap = {
    'funny': 12,
    'cat': 16,
    'baby': 2
}

function getImgs() {
    const imgs = gImgs
    return imgs
}

function getMeme() {
    return gMeme
}

function getImageById(id) {
    id = parseInt(id)
    return gImgs.find(img => img.id === id);
}

function getSelectedMeme() {
    const meme = getMeme()
    const img = getImageById(meme.selectedImgId)
    console.log('img,', img)
    return img
}

function setUpdateText(text) {
    if (gMeme.lines.length <= 0) return
    gMeme.lines[gCurrLineIdx].txt = text
    updateLineMass(gMeme.lines[gCurrLineIdx])
}

function updateFillColor(fillColor) {
    if (gMeme.lines.length <= 0) return
    gMeme.lines[gCurrLineIdx].color = fillColor
}

function updateFontSize(plusOrMinus) {
    const line = gMeme.lines[gCurrLineIdx]
    if (!line) return
    line.size += plusOrMinus * 2
    updateLineMass(line)
}

function createLine(text = 'New Line', size = 40, color = 'white') {
    const newLine = {
        txt: text,
        size: size,
        color: color,
        isGrab: false,
        isSelected: true,
        xPos: gElCanvas.width / 2,
        yPos: calculateNewLineYPosition(),
        width: 0,
        height: 20,
    }

    updateLineMass(newLine)
    gMeme.lines.push(newLine)
    gCurrLineIdx++
    return gMeme.lines.length - 1
}

function calculateNewLineYPosition() {
    const meme = getMeme()
    let totalHeight = 0
    for (const line of meme.lines) {
        totalHeight += line.height
    }
    const spacing = 10
    return totalHeight + spacing
}

function getCurrLineIdx() {
    return gCurrLineIdx
}


function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }
    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}

function updateSelectedLineText(textContent) {
    if (gDragLineIdx !== -1) {
        gMeme.lines[gDragLineIdx].txt = textContent
    }
}

function updateSelectedLine(plusOrMinus) {
    const prevLineIdx = gCurrLineIdx

    gCurrLineIdx += plusOrMinus
    if (gCurrLineIdx < 0) {
        gCurrLineIdx = gMeme.lines.length - 1
    } else if (gCurrLineIdx >= gMeme.lines.length) {
        gCurrLineIdx = 0
    }
    gMeme.lines[prevLineIdx].isSelected = false
    gMeme.lines[gCurrLineIdx].isSelected = true
}

function removeLine() {
    gMeme.lines.splice(gCurrLineIdx, 1)
}

function resetCanvas() {
    const currImg = getMeme().selectedImgId
    gMeme = {
        selectedImgId: currImg,
        selectedLineIdx: -1,
        lines: [],
    }
}



