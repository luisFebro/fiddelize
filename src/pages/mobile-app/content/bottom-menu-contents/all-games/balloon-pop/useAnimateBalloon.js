import { useEffect } from "react";

export default function useAnimateBalloon(backColor, loading) {
    const backC = backColor;

    useEffect(() => {
        // Main
        const svgList = document.querySelectorAll("svg");
        if (svgList) svgList.forEach((svg) => setNewAnimation(svg));

        function setNewAnimation(svg = {}) {
            if (svg === null) svg = {};
            const balloon = svg.querySelector(".balloon");
            const headGroup = svg.querySelector(".balloon__head-group");
            const effect = svg.querySelector(".balloon__effect");
            const head = svg.querySelector(".balloon__head");
            const tail = svg.querySelector(".balloon__tail");
            const brokenPieces = svg.querySelector(".balloon__broken-pieces");
            const brokenPiece1 = svg.querySelector(".balloon__broken-piece1");
            const brokenPiece2 = svg.querySelector(".balloon__broken-piece2");
            const brokenPiece3 = svg.querySelector(".balloon__broken-piece3");
            const brokenPiece4 = svg.querySelector(".balloon__broken-piece4");
            const brokenPiece5 = svg.querySelector(".balloon__broken-piece5");
            const brokenPiece6 = svg.querySelector(".balloon__broken-piece6");
            const brokenPiece7 = svg.querySelector(".balloon__broken-piece7");
            const ratio = getBaseRatio(svg);
            const transformer = createTransformer();

            setOriginPosition(
                headGroup,
                getOriginPosition(headGroup, 50, 100, ratio, svg)
            );
            setOriginPosition(
                effect,
                getOriginPosition(effect, 50, 60, ratio, svg)
            );
            setOriginPosition(
                brokenPieces,
                getOriginPosition(brokenPieces, 48, 108, ratio, svg)
            );
            setOriginPosition(
                brokenPiece1,
                getOriginPosition(brokenPiece1, 47, 100, ratio, svg)
            );
            setOriginPosition(
                brokenPiece2,
                getOriginPosition(brokenPiece2, 50, 50, ratio, svg)
            );
            setOriginPosition(
                brokenPiece3,
                getOriginPosition(brokenPiece3, 50, 50, ratio, svg)
            );
            setOriginPosition(
                brokenPiece4,
                getOriginPosition(brokenPiece4, 50, 50, ratio, svg)
            );
            setOriginPosition(
                brokenPiece5,
                getOriginPosition(brokenPiece5, 50, 50, ratio, svg)
            );
            setOriginPosition(
                brokenPiece6,
                getOriginPosition(brokenPiece6, 50, 50, ratio, svg)
            );
            setOriginPosition(
                brokenPiece7,
                getOriginPosition(brokenPiece7, 50, 50, ratio, svg)
            );

            const bouncer = step(
                backward((n) => {
                    transformer(balloon)
                        .translate(0, n * -60)
                        .update();
                }),
                true,
                3000
            );

            const tilter = step(
                backward((n) => {
                    const rotate = -10 + n * 20;
                    transformer(headGroup).rotate(rotate).update();
                    transformer(brokenPieces).rotate(rotate).update();
                    transformer(brokenPiece1).rotate(rotate).update();
                }),
                true,
                9000
            );

            if (head)
                head.addEventListener("click", () => {
                    head.style.display = "none";
                    bouncer.stop();
                    tilter.stop();
                    step(
                        outexpo((n) => {
                            const opacity = 1 - n;
                            const scale = 1 - n * 0.4;
                            transformer(brokenPiece1).scale(scale).update();
                            transformer(brokenPiece2)
                                .translate(24 * n, getSinY(24, 32, n))
                                .scale(scale)
                                .update();
                            transformer(brokenPiece3)
                                .translate(24 * n, getSinY(24, -6, n))
                                .scale(scale)
                                .update();
                            transformer(brokenPiece4)
                                .translate(14 * n, getSinY(24, -90, n))
                                .scale(scale)
                                .update();
                            transformer(brokenPiece5)
                                .translate(-24 * n, getSinY(-24, 75, n))
                                .scale(scale)
                                .update();
                            transformer(brokenPiece6)
                                .translate(-24 * n, getSinY(-24, 0, n))
                                .scale(scale)
                                .update();
                            transformer(brokenPiece7)
                                .translate(-24 * n, getSinY(-24, -32, n))
                                .scale(scale)
                                .update();
                            transformer(effect)
                                .scale(0.5 + n * 0.5)
                                .update();
                            transformer(tail)
                                .translate(0, getSinY(24, 90, n))
                                .update();
                            if (svg) svg.style.opacity = opacity;
                        }),
                        false,
                        600
                    );
                });
        }
    }, [backC, loading]);
}

// HELPERS
function backward(callback) {
    let flag = false;
    return function (n) {
        callback(flag ? 1 - n : n);
        if (n >= 1) {
            flag = !flag;
        }
    };
}

function outexpo(callback) {
    return function (n) {
        callback(1 == n ? n : 1 - Math.pow(2, -10 * n));
    };
}

function step(callback, loop, duration) {
    let reqId = 0;
    let startTime = 0;
    const stepping = (timestamp) => {
        if (!startTime) {
            startTime = timestamp;
        }
        const pastTime = timestamp - startTime;
        const progress = pastTime / duration;
        if (pastTime >= duration) {
            callback(1);
            if (loop) {
                startTime = timestamp;
            } else {
                return;
            }
        } else {
            callback(progress);
        }
        reqId = window.requestAnimationFrame(stepping);
    };
    reqId = window.requestAnimationFrame(stepping);
    return {
        stop() {
            window.cancelAnimationFrame(reqId);
        },
    };
}

function createTransformer() {
    const cache = [];
    return function (element) {
        if (!element) element = {};
        let transformer = cache.find((t) => t._element === element);
        if (transformer) {
            return transformer;
        }
        transformer = {
            _element: element,
            _scale: 1,
            _translateX: 0,
            _translateY: 0,
            _rotate: 0,
            scale(value) {
                this._scale = value;
                return this;
            },
            translate(x, y) {
                this._translateX = x;
                this._translateY = y;
                return this;
            },
            rotate(value) {
                this._rotate = value;
                return this;
            },
            update() {
                const { _scale, _translateX, _translateY, _rotate } = this;
                if (this._element && this._element.style)
                    this._element.style.transform = `translate(${_translateX}px, ${_translateY}px) scale(${_scale}) rotate(${_rotate}deg)`;
            },
        };
        cache.push(transformer);
        return transformer;
    };
}

function getBaseRatio(svg) {
    const baseWidth = svg && svg.viewBox.baseVal.width;
    const baseHeight = svg && svg.viewBox.baseVal.height;
    const dataBounding = svg.getBoundingClientRect();

    const width = dataBounding && dataBounding.width;
    const height = dataBounding && dataBounding.height;

    return {
        x: baseWidth / width,
        y: baseHeight / height,
    };
}

function getOriginPosition(element, xOffset, yOffset, ratio, svg = {}) {
    if (svg === null) svg = {};

    const dataElem = element ? element.getBoundingClientRect() : {};
    const { left, top, width, height } = dataElem;
    const baseLeft = svg && svg.getBoundingClientRect().left;
    const baseTop = svg && svg.getBoundingClientRect().top;
    const x = (left - baseLeft) * ratio.x;
    const y = (top - baseTop) * ratio.y;
    return {
        x: width * ratio.x * (xOffset / 100) + x,
        y: height * ratio.y * (yOffset / 100) + y,
    };
}

function setOriginPosition(element, position) {
    if (element)
        element.style.transformOrigin = `${position.x}px ${position.y}px`;
}

function getSinY(x, degree, progress) {
    return Math.sin((degree * Math.PI) / 180) * progress * x;
}
// END HELPERS
