"use strict";

let handlers = new WeakMap();

function newGameFactory(wrapper_class_name) {
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

let games = [ newGameFactory('game1'), newGameFactory('game2'), newGameFactory('game3') ];

let tables = document.querySelectorAll('.tables .table');
let games_wrapper = document.querySelector('.games_wrapper');

let currentGameIndex = 0;
let currentGame = games[currentGameIndex];

setTimeout(() => currentGame.play(), 500);

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
