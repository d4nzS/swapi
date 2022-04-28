"use strict";

const urlSWAPI = 'https://swapi.dev/api';
const category = '/people';

const search = document.querySelector('.header__search');
const listCards = document.querySelector('.main__list');
const listPagination = document.querySelector('.footer__list');
const popupInfo = document.querySelector('.popup');
const modalInPopupInfo = popupInfo.querySelector('.modal');

createStartPage(urlSWAPI + category);

search.oninput = function () {
    createStartPage(urlSWAPI + category + `/?search=${search.value}`);
}

listCards.onclick = function (event) {
    const mainItem = event.target;

    if (mainItem.classList.contains('main__item')) {
        popupInfo.classList.add('popup_active');

        createModal(urlSWAPI + category + `/?search=${mainItem.textContent}`, modalInPopupInfo)
    }
}

popupInfo.onclick = function () {
    popupInfo.classList.remove('popup_active')
}

listPagination.onclick = function (event) {
    const footerItem = event.target;

    if (footerItem.classList.contains('footer__item')) {
        document.querySelectorAll('.footer__item')
            .forEach(item => item.classList.remove('footer__item_active'));
        footerItem.classList.add('footer__item_active');

        createCards(urlSWAPI + category + `/?search=${search.value}&page=${footerItem.textContent}`, listCards);
    }
}

async function getData(url) {
    const response = await fetch(url);
    return await response.json();
}

function createStartPage(url) {
    getData(url)
        .then(function (result) {
            listCards.innerHTML = '';
            listPagination.innerHTML = '';

            const pagesCount = Math.ceil(result.count / 10);

            if (result.count > 10) drawPagination(pagesCount, listPagination);
            drawCards(result.results, listCards);
        });
}

function createCards(url, list) {
    getData(url)
        .then(function (result) {
            list.innerHTML = ''
            drawCards(result.results, list)
        });
}

function drawPagination(pagesCount, list) {
    list.insertAdjacentHTML('beforeend', `<li class="footer__item footer__item_active">1</li>`)
    for (let i = 2; i <= pagesCount; i++) {
        list.insertAdjacentHTML('beforeend', `<li class="footer__item">${i}</li>`);
    }
}

function drawCards(peopleArr, list) {
    for (let person of peopleArr) {
        list.insertAdjacentHTML('beforeend', `<li class="main__item">${person.name}</li>`)
    }
}

function createModal(url, modal) {
    getData(url)
        .then(function (result) {
            modal.innerHTML = '';
            drawModal(result.results, modal);
        });
}

function drawModal(person, modal) {
    modal.insertAdjacentHTML('beforeend', `<p>Name: ${person[0].name}</p>`);
    modal.insertAdjacentHTML('beforeend', `<p>Birth: ${person[0].birth_year}</p>`);
    modal.insertAdjacentHTML('beforeend', `<p>Gender: ${person[0].gender}</p>`);
    modal.insertAdjacentHTML('beforeend', `<p>Hair color: ${person[0].hair_color}</p>`);
    modal.insertAdjacentHTML('beforeend', `<p>Skin color: ${person[0].skin_color}</p>`);
    modal.insertAdjacentHTML('beforeend', `<p>Eye color: ${person[0].eye_color}</p>`);
    modal.insertAdjacentHTML('beforeend', `<p>Weight: ${person[0].mass} kg</p>`);
    modal.insertAdjacentHTML('beforeend', `<p>Height: ${person[0].height} cm</p>`);
}