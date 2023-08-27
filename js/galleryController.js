'use strict'

function onInitGallery() {
    renderGallery()
    addEventListenersGallery()
}

function renderGallery() {
    const imgs = getImgs()
    const strHtmls = imgs.map(img =>
        `<img 
        data-idx = "${img.id}"
        onerror="this.src='img/default.png'" 
        src="images/${img.id}.jpg" 
        alt="${img.url}">`
    )
    document.querySelector('.gallery-container').innerHTML = strHtmls.join('')
}

function addEventListenersGallery() {
    const images = document.querySelectorAll("img")
    images.forEach(image => {
        image.addEventListener("click", onSelectedImage)
    })
}

function onSelectedImage(ev) {
    const dataIdx = ev.target.getAttribute('data-idx')
    gMeme.selectedImgId = dataIdx
    renderMeme()
    document.querySelector(".gallery").classList.add('hide')
    document.querySelector(".editor").classList.remove('hide')

}

