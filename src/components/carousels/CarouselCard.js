import { useState, useEffect } from "react";
import "flickity/dist/flickity.css";
import "flickity-fullscreen";
// jquery module is required to run this path
import Flickity from "flickity";

const isSmall = window.Helper.isSmallScreen();

export default function CarouselCard({
    CardList,
    size,
    multi = false, // for itialize multiple carousel in the same page
    lazyLoad = false,
    pageDots = false,
    fullscreen,
    trigger,
    // for multiple carousels
    setOuterFlickity,
    carouselInd = 0,
    // style,
    // currIconInd,
    // setOpenModal,
}) {
    const [flktyList, setFlktyList] = useState([]);

    const options = {
        // options
        lazyLoad, // n1
        pageDots,
        fullscreen, // flkty.viewFullscreen(); || flkty.exitFullscreen(); || flkty.toggleFullscreen();
        cellAlign: "center",
        wrapAround: true,
        freeScroll: false, // if true, this produces an awkward alignment of cards when dragging them
        prevNextButtons: !isSmall, //
        friction: 0.28, // default: 0.28
        dragThreshold: 3, // default: 3
        percentagePosition: false, // default: true;
        selectedAttraction: 0.1, // default: 0.025
        on: {
            ready() {
                console.log("Flickity ready");
            },
        },
    };

    const startFlickity = () => {
        if (multi) {
            const galleryCarousels = document.querySelectorAll(
                ".main-carousel"
            );
            let i;
            let len;
            const allCreatedCarousels = [];
            for (i = 0, len = galleryCarousels.length; i < len; i++) {
                const thisCarousel = galleryCarousels[i];
                const fkcktMulti = new Flickity(thisCarousel, options);
                allCreatedCarousels.push(fkcktMulti);
            }

            return setFlktyList(allCreatedCarousels);
        }

        const carouselElem2 = document.querySelector(".main-carousel");

        const flkty = new Flickity(carouselElem2, options);
        setFlktyList([flkty]);
    };

    const flktyData = flktyList[carouselInd];

    useEffect(() => {
        if (typeof setOuterFlickity === "function") {
            if (flktyData) {
                flktyData.select(0);
                setOuterFlickity(flktyList);
            }
        }

        startFlickity(multi);
    }, [multi, trigger, flktyData]);

    return (
        <section
            id="carouselCard--root"
            className="mb-5 container-center-max-width-500"
        >
            <div
                className={`carousel--root ${lazyLoad ? "lazy-load" : ""} ${
                    size || ""
                } my-2 text-white`}
            >
                <div className="main-carousel">{CardList}</div>
            </div>
            <style jsx>
                {`
                    .carousel--root {
                        /*background: var(--mainWhite);*/
                        height: 440px;
                        box-shadow: rgba(0, 0, 0, 0.35) 0px 31px 120px -6px;
                    }

                    .flickity-viewport {
                        height: 440px !important;
                    }

                    .carousel-cell {
                        box-shadow: 0 31px 120px -6px rgba(0, 0, 0, 0.35);
                        width: 62%;
                        margin: 5px;
                        padding: 10px;
                        height: 420px;
                        background: var(--mainWhite);
                        color: var(--mainPurple);
                        cursor: pointer;
                        border: none;
                        text-align: center;
                        border-radius: 15px;
                    }

                    .carousel--root.large {
                        height: 350px;
                    }
                    .carousel--root.large .flickity-viewport {
                        height: 350px !important;
                    }

                    .carousel--root.large .carousel-cell {
                        height: 325px;
                    }

                    .carousel--root.medium {
                        height: 300px;
                    }
                    .carousel--root.medium .flickity-viewport {
                        height: 300px !important;
                    }

                    .carousel--root.medium .carousel-cell {
                        height: 275px;
                    }

                    .carousel--root.compact {
                        height: 260px;
                    }
                    .carousel--root.compact .flickity-viewport {
                        height: 260px !important;
                    }

                    .carousel--root.compact .carousel-cell {
                        height: 235px;
                    }

                    .card-icons {
                        font-size: 60px;
                    }

                    .flickity-button {
                        background-color: var(--themeSDark);
                    }
                    .flickity-button:hover {
                        background-color: var(--themeSDark);
                    }

                    .flickity-prev-next-button {
                        width: 54px;
                    }

                    .flickity-prev-next-button .arrow {
                        fill: var(--mainWhite);
                        height: 20px;
                    }
                    .flickity-prev-next-button.no-svg {
                        fill: var(--themeS);
                    }

                    .is-selected {
                        background-color: var(
                            --lightPurple
                        ) !important; /* var(--lightPurple) */
                    }

                    .is-selected p,
                    .is-selected div {
                        color: #fff !important;
                    }

                    /* lazy load */
                    .lazy-load .carousel-cell-image {
                        display: block;
                        max-height: 100%;
                        margin: 0 auto;
                        max-width: 100%;
                        opacity: 0;
                        -webkit-transition: opacity 0.4s;
                        transition: opacity 0.4s;
                    }

                    /* fade in lazy effect */
                    .lazy-load .carousel-cell-image.flickity-lazyloaded,
                    .lazy-load .carousel-cell-image.flickity-lazyerror {
                        opacity: 1;
                    }

                    /* fullscreen */
                    .main-carousel.is-fullscreen .carousel-cell,
                    .main-carousel.is-fullscreen .flickity-viewport {
                        height: 100% !important;
                    }

                    .flickity-enabled.is-fullscreen {
                        position: fixed;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        background: hsla(0, 0%, 0%, 0.9);
                        padding-bottom: 35px;
                        z-index: 1;
                    }

                    .flickity-enabled.is-fullscreen .flickity-page-dots {
                        bottom: 10px;
                    }

                    .flickity-enabled.is-fullscreen .flickity-page-dots .dot {
                        background: white;
                    }

                    /* prevent page scrolling when flickity is fullscreen */
                    html.is-flickity-fullscreen {
                        overflow: hidden;
                    }

                    /* ---- flickity-fullscreen-button ---- */

                    .flickity-fullscreen-button {
                        display: fixed;
                        //z-index: 2;
                        right: 10px;
                        top: 10px;
                        width: 28px;
                        height: 28px;
                        border-radius: 4px;
                    }

                    /* right-to-left */
                    .flickity-rtl .flickity-fullscreen-button {
                        right: auto;
                        left: 10px;
                    }

                    .flickity-fullscreen-button-exit {
                        display: none;
                    }

                    .flickity-enabled.is-fullscreen
                        .flickity-fullscreen-button-exit {
                        display: block;
                    }
                    .flickity-enabled.is-fullscreen
                        .flickity-fullscreen-button-view {
                        display: none;
                    }

                    .flickity-fullscreen-button .flickity-button-icon {
                        position: absolute;
                        width: 16px;
                        height: 16px;
                        left: 4px;
                        top: 4px;
                    }

                    .flickity-enabled.is-fullscreen .carousel-cell {
                        width: 100%; /* full width */
                        height: 200px;
                        background: transparent !important;
                    }

                    .flickity-enabled.is-fullscreen .carousel-cell .desc {
                        position: absolute;
                        bottom: -10px;
                    }

                    .flickity-enabled.is-fullscreen .carousel-cell .desc > p {
                        color: var(--mainWhite);
                        text-shadow: 1px 3px 5px black;
                        border-radius: 15px;
                    }

                    .flickity-enabled.is-fullscreen .carousel-cell section img {
                        display: block;
                        max-width: 100%;
                        max-height: 100%;
                        position: absolute;
                        //margin: auto;
                        //overflow: auto;
                        top: 0;
                        right: 0;
                        left: 0;
                        bottom: 0;
                        -o-object-fit: contain;
                        object-fit: contain;
                        width: 100% !important;
                        height: 100% !important;
                    }
                `}
            </style>
        </section>
    );
}

/* COMMENTS
n1:
lazyLoad: 2
// load images in selected slide
// and next 2 slides
// and previous 2 slides
// total: 5 images are loaded including the current one.
*/
