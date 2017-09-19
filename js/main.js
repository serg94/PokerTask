"use strict";

let handlers = new WeakMap();

function gameFactory(wrapper_class_name) {
    let wrapper = document.querySelector(`.${wrapper_class_name}`);
    let game = new Poker(wrapper);

    let playBtn = wrapper.querySelector('.play-pause-btn');

    let clickHandler = function () {
        game.playPause();
        playBtn.value = game.paused ? 'replay' : 'pause';
    };
    playBtn.addEventListener('click', clickHandler);

    handlers.set(game, clickHandler);

    return game;
}

let games = [ gameFactory('game1'), gameFactory('game2'), gameFactory('game3') ];

let tables = document.querySelectorAll('.tables .table');
let games_wrapper = document.querySelector('.games_wrapper');

let currentGameIndex = 0;
let currentGame = games[currentGameIndex];

let svg = window.cardSVG = new Image();

svg.onload = function () {
    setTimeout(() => currentGame.play(), 500);
};
svg.src = 'img/cards.png';
let use_canvas_check = document.getElementById('use_canvas');

let previousTimeoutId = null;
Array.from(tables).forEach((t, i) => {
    t.addEventListener('click', () => {
        if (i === currentGameIndex) return;

        currentGame.pause();
        games_wrapper.style.left = `${-i * 100}%`;
        currentGameIndex = i;
        currentGame = games[currentGameIndex];

        clearTimeout(previousTimeoutId);
        previousTimeoutId = setTimeout(() => handlers.get(currentGame)(), 550);
    });
});
