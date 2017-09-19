"use strict";

class Poker {
    constructor(wrapper) {
        this._paused = true;
        this.wrapper = wrapper;

        this.render();
        this.bindEvents();
    }

    _renderPlayers() {
        for (let i = 1; i <= 9; i++) {
            let player = `
                <div class="player player${i}">
                    <div class="playerImage"></div>
                    <div class="playerName">player${i}</div>
                    <div class="playerMoney">${Poker.randomInRange(1e3, 1e5).toFixed(2)}</div>
                </div>
            `;
            this.wrapper.insertAdjacentHTML('beforeend', player)
        }
    }

    _renderCards() {
        for (let i = 1; i <= 18 + 5; i++) {
            let player = `
                <div class="card card${i}"></div>
            `;
            this.wrapper.insertAdjacentHTML('beforeend', player)
        }
    }

    render() {
        this._renderPlayers();
        this._renderCards();

        this.cards = this.wrapper.querySelectorAll('.card');
        this.myFirstCard = this.wrapper.querySelector('.card9');
        this.mySecondCard = this.wrapper.querySelector('.card10');
        this.tableCards = this.wrapper.querySelectorAll('.card19, .card20, .card21, .card22, .card23');
        this.lastTableCard = this.wrapper.querySelector('.card23');
    }

    bindEvents() {
        [ this.myFirstCard, this.mySecondCard ].forEach(c => {
            c.on('animationend', function (e) {
                let card = e.target;
                let style = card.style;
                style.backgroundImage = `url(img/Asset.svg)`;
                card._cardIndexX = Poker.getRandomCardIndex();
                card._cardIndexY = Poker.getRandomCardIndex();
                Poker.setBG(card);
            });
        });

        for (let c of this.cards) {
            c.on('animationend', (e) => {
                let card = e.target;
                card._animationComplete = true;
                card._animationInProgress = false;

                if (card === this.myFirstCard || card === this.mySecondCard) return;

                requestAnimationFrame(() => {
                    card.style.zIndex = 2;
                })
            });

            c.on('animationstart', function (e) {
                e.target._animationInProgress = true;
                e.target._animationComplete = false;
            });
        }

        this.lastTableCard.on('animationend', (e) => {
            if (e.animationName === 'card23_open') {
                if (!this.paused) {
                    this._restartHandler = setTimeout(() => this.restart(), 200);
                }
            } else if (e.animationName === 'card23') {
                for (let card of this.tableCards) {
                    let style = card.style;
                    style.backgroundImage = `url(img/Asset.svg)`;
                    card._cardIndexX = Poker.getRandomCardIndex();
                    card._cardIndexY = Poker.getRandomCardIndex();
                    Poker.setBG(card);
                    card.addClass('open');
                }
            }
        });

        window.addEventListener('resize', () => {
            [ this.myFirstCard, this.mySecondCard, ...this.tableCards ]
                .forEach(card => {
                    card._boundingRectHeight = null;
                    card._animationComplete && Poker.setBG(card)
                });
        });
    }

    reset() {
        let propsToReset = [ 'zIndex', 'backgroundSize',
            'backgroundPositionX', 'backgroundPositionY', 'backgroundImage' ];

        this.wrapper.removeClass('game_in_progress');

        for (let card of this.cards) {
            card._cardIndexX = null;
            card._cardIndexY = null;
            card._animationComplete = null;
            card._animationInProgress = null;
            card.removeClass('open');

            propsToReset.forEach(p => card.style[p] = null);
        }

        clearTimeout(this._restartHandler);
    }

    _start() {
        this.wrapper.addClass('game_in_progress');
    }

    get paused() {
        return this._paused;
    }

    pause() {
        this._paused = true;
        clearTimeout(this.restartTimeout);
    }

    play() {
        this._paused = false;
        this.restart();
    }

    playPause() {
        this.paused ? this.play() : this.pause();
    }

    restart() {
        if (this._paused) return;
        this.reset();
        this.restartTimeout = setTimeout(() => this._start(), 50); // leave time for re-render reset changes
    }

    static setBG(card) {
        let style = card.style;
        if (!card._boundingRectHeight) {
            let rect = card.getBoundingClientRect();
            card._boundingRectHeight = rect.height;
            card._boundingRectWidth = rect.width;
        }
        let height = card._boundingRectHeight;
        let width = card._boundingRectWidth;
        style.backgroundSize = `${5 * width}px ${4 * height}px`;
        style.backgroundPositionX = `${width * card._cardIndexX}px`;
        style.backgroundPositionY = `${height * card._cardIndexY}px`;
    }

    static randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    static getRandomCardIndex() {
        return parseInt(Poker.randomInRange(0, 4 * 5 - 1));
    }
}