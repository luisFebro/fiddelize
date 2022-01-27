import { useState, useEffect } from "react";
import "flickity/dist/flickity.css";
// jquery module is required to run this path
import Flickity from "flickity";

const isSmall = window.Helper.isSmallScreen();

export default function CarouselCard({
    CardList,
    size,
    multi = false, // for itialize multiple carousel in the same page
    lazyLoad = false,
    // style,
    // currIconInd,
    // setOpenModal,
}) {
    const [, setFlkty] = useState(null);

    useEffect(() => {
        const options = {
            // options
            lazyLoad, // n1
            cellAlign: "center",
            wrapAround: true,
            freeScroll: false, // if true, this produces an awkward alignment of cards when dragging them
            pageDots: false,
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

        if (multi) {
            const galleryCarousels = document.querySelectorAll(
                ".main-carousel"
            );
            let i;
            let len;
            for (i = 0, len = galleryCarousels.length; i < len; i++) {
                const thisCarousel = galleryCarousels[i];
                // eslint-disable-next-line
                new Flickity(thisCarousel, options);
            }
            return;
        }

        const carouselElem2 = document.querySelector(".main-carousel");

        const flkty = new Flickity(carouselElem2, options);
        setFlkty(flkty);
    }, [multi]);

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

                    .lazy-load .carousel-cell-image {
                        display: block;
                        max-height: 100%;
                        margin: 0 auto;
                        max-width: 100%;
                        opacity: 0;
                        -webkit-transition: opacity 0.4s;
                        transition: opacity 0.4s;
                    }

                    /* fade in lazy loaded image */
                    .lazy-load .carousel-cell-image.flickity-lazyloaded,
                    .lazy-load .carousel-cell-image.flickity-lazyerror {
                        opacity: 1;
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
