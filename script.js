"use strict";

const urlSWAPI = 'https://swapi.dev/api';
const category = '/people';

const headerSearch = document.querySelector('.header__search');
const mainList = document.querySelector('.main__list');
const footerList = document.querySelector('.footer__list');
const popup = document.querySelector('.popup');
const modal = popup.querySelector('.modal');

createStartPage(urlSWAPI + category);

headerSearch.oninput = function () {
    createStartPage(urlSWAPI + category + `/?search=${headerSearch.value}`);
}

mainList.onclick = function (event) {
    const mainItem = event.target;

    if (mainItem.classList.contains('main__item')) {
        popup.classList.add('popup_active');

        createModal(urlSWAPI + category + `/?search=${mainItem.textContent}`, modal)
    }
}

popup.onclick = function () {
    popup.classList.remove('popup_active')
}

footerList.onclick = function (event) {
    const footerItem = event.target;

    if (footerItem.classList.contains('footer__item')) {
        document.querySelectorAll('.footer__item')
            .forEach(item => item.classList.remove('footer__item_active'));
        footerItem.classList.add('footer__item_active');

        createCards(urlSWAPI + category + `/?search=${headerSearch.value}&page=${footerItem.textContent}`, mainList);
    }
}

async function getData(url) {
    const response = await fetch(url);
    return await response.json();
}

function createStartPage(url) {
    mainList.innerHTML = '';
    footerList.innerHTML = '';

    getData(url)
        .then(function (result) {
            const pagesCount = Math.ceil(result.count / 10);

            drawPagination(pagesCount, footerList);
            drawCards(result.results, mainList)
        });
}

function createCards(url, list) {
    list.innerHTML = '';

    getData(url)
        .then(function (result) {
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
    modal.innerHTML = '';

    getData(url)
        .then(function (result) {
            drawModal(result.results, modal);
        });
}

function drawModal(person, modal) {
    modal.insertAdjacentHTML('beforeend',`<p>Name: ${person[0].name}</p>`);
    modal.insertAdjacentHTML('beforeend',`<p>Birth: ${person[0].birth_year}</p>`);
    modal.insertAdjacentHTML('beforeend',`<p>Gender: ${person[0].gender}</p>`);
}