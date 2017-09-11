"use strict";

HTMLElement.prototype.on = HTMLElement.prototype.addEventListener;
HTMLElement.prototype.off = HTMLElement.prototype.removeEventListener;

HTMLElement.prototype.hasClass = function (className) {
    return [ ...this.classList ].includes(className);
};

HTMLElement.prototype.addClass = function (className) {
    this.className += ' ' + className;
};

HTMLElement.prototype.removeClass = function(classNames) {
    classNames.split(' ').forEach(className => {
        let classes = this.className.split(' ');
        let idx = classes.indexOf(className);

        if (idx > -1) {
            classes.splice(idx, 1);
        }

        this.className = classes.join(' ');
    });
};

HTMLElement.prototype.css = function (key, value) {
    this.style[key] = value;
};

Array.prototype.first = function () {
    return this[0];
};

Array.prototype.last = function () {
    return this[this.length - 1];
};

const Util = {
    loadImages(urls, success, failure) {
        let remainingCount = urls.length;
        let count = remainingCount;
        const images = [];
        let failed = false;

        const load = function () {
            if (failed) return;

            if (--remainingCount <= 0) {
                success(images)
            }
        };

        const error = function (e) {
            console.error(new Error('Error loading image: ' + e.target.src));
            if (failed) {
                return;
            }
            failed = true;
            typeof failure === 'function' && failure();
        };

        while (count) {
            const img = new Image();
            img.onload = load;
            img.onerror = error;
            img.src = urls[urls.length - count];
            images.push(img);
            count--;
        }
    }
};
