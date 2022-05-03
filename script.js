"use strict";

const urlSWAPI = 'https://swapi.dev/api';
const category = '/people';
const peopleParams = {
    name: "Name",
    birth_year: "Birth",
    gender: "Gender",
    hair_color: "Hair color",
    skin_color: "Skin color",
    eye_color: "Eye color",
    mass: "Weight",
    height: "Height"
};

const search = document.querySelector('.header__search');
const listCards = document.querySelector('.main__list');
const listPagination = document.querySelector('.footer__list');
const popupInfo = document.querySelector('.popup');
const modalInPopupInfo = popupInfo.querySelector('.modal');

createPage(category);

let delay = 500;
let timer;

search.onkeyup = function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
        const subUrl = category + `/?search=${search.value}`;
        createPage(subUrl);
    }, delay);
};

listCards.onclick = function (event) {
    const mainItem = event.target;

    if (mainItem.classList.contains('main__item')) {
        popupInfo.classList.add('popup_active');

        createModal(mainItem.id, modalInPopupInfo)
    }
};

listPagination.onclick = function (event) {
    const footerItem = event.target;

    if (footerItem.classList.contains('footer__item')) {
        document.querySelectorAll('.footer__item')
            .forEach(item => item.classList.remove('footer__item_active'));
        footerItem.classList.add('footer__item_active');

        createCards(category + `/?search=${search.value}&page=${footerItem.textContent}`, listCards);
    }
};

popupInfo.onclick = function () {
    popupInfo.classList.remove('popup_active')
};

async function getData(url) {
    const response = await fetch(url);
    return await response.json();
}

function createPage(subUrl) {
    const url = urlSWAPI + subUrl;

    getData(url)
        .then(function (result) {
            listCards.innerHTML = '';
            listPagination.innerHTML = '';

            const pagesCount = Math.ceil(result.count / 10);

            if (result.count > 10) drawPagination(pagesCount, listPagination);
            drawCards(result.results, listCards);
        });
}

function createCards(subUrl, list) {
    const url = urlSWAPI + subUrl;

    getData(url)
        .then(function (result) {
            list.innerHTML = ''
            drawCards(result.results, list)
        });
}

function drawPagination(pagesCount, list) {
    for (let i = 1; i <= pagesCount; i++) {
        list.insertAdjacentHTML('beforeend', `<li class="footer__item ${i === 1 ? 'footer__item_active' : ''}">${i}</li>`);
    }
}

function drawCards(peopleArr, list) {
    list.innerHTML = peopleArr.reduce((str, person, index, arr) =>
        str += `<li id="${arr[index].url}" class="main__item">${person.name}</li>`, '');
}

function createModal(url, modal) {
    getData(url)
        .then(function (result) {
            modal.innerHTML = '';
            drawModal(result, modal);
        });
}

function drawModal(person, modal) {
    modal.innerHTML = Object.keys(peopleParams).reduce((str, item) =>
        str += `<p>${peopleParams[item]}: ${person[item]}</p>`, '');
}