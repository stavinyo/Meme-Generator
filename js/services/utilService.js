'use strict'

function makeId(length = 6) {
    var id = ''
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        id += possible.charAt(getRandomInt(0, possible.length))
    }
    return id
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

function handleClassEl(className, selector, isAdd) {
    isAdd ?
        document.querySelector(`.${selector}`).classList.add(className) :
        document.querySelector(`.${selector}`).classList.remove(className)
}

function removeClass(className, selector) {
    document.querySelector(`.${selector}`).classList.remove(className)
}

function addClass(className, selector) {
    document.querySelector(`.${selector}`).classList.add(className)
}

function setElText(selector, txt) {
    const el = document.querySelector(`.${selector}`)
    el.innerText = txt
}

function setElHtml(selector, html) {
    const el = document.querySelector(`.${selector}`)
    el.innerHTML = html
}

function navigateToPage(page) {
    window.location = `${page}.html`;
}

function makeLorem(wordCount = 100) {
    const words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (wordCount > 0) {
        wordCount--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}
