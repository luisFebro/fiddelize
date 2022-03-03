import { Fragment } from "react";
import Flickity from "react-flickity-component";
import ItemCardCustomer from "pages/menu-qr/customer-catalog/ItemCardCustomer.js";
// const flickityOptions = {
//     initialIndex: 2
// }

export default function Test({
    lazyLoad,
    size,
    pageDots,
    pageDotsColor = "var(--themeP)",
    fullscreen,
}) {
    function Carousel() {
        const options = {
            // options
            lazyLoad, // n1
            pageDots,
            fullscreen, // flkty.viewFullscreen(); || flkty.exitFullscreen(); || flkty.toggleFullscreen();
            cellAlign: "center",
            wrapAround: true,
            freeScroll: false, // if true, this produces an awkward alignment of cards when dragging them
            prevNextButtons: false, //!isSmall, //
            friction: 0.28, // default: 0.28
            dragThreshold: 3, // default: 3
            percentagePosition: false, // default: true;
            selectedAttraction: 0.1, // default: 0.025
            initialIndex: 0,
            on: {
                ready() {
                    console.log("Flickity ready");
                },
            },
        };

        return (
            <Flickity
                className="main-carousel" // default ''
                elementType="div" // default 'div'
                options={options} // takes flickity options {}
                disableImagesLoaded={false} // default false
                // reloadOnUpdate // default false
                // static // default false
            >
                <section
                    id="carouselCard--root"
                    className="mb-5 container-center-max-width-500"
                >
                    <div
                        className={`carousel--root ${
                            lazyLoad ? "lazy-load" : ""
                        } ${size || ""} my-2 text-white`}
                    >
                        <div className="main-carousel">
                            <CarouselList />
                        </div>
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
                                z-index: 6000 !important;
                            }

                            .flickity-enabled.is-fullscreen
                                .flickity-page-dots {
                                bottom: 10px;
                            }

                            .flickity-enabled.is-fullscreen
                                .flickity-page-dots
                                .dot {
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
                                position: absolute !important;
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

                            .flickity-enabled.is-fullscreen
                                .carousel-cell
                                .desc {
                                position: absolute;
                                bottom: -10px;
                            }

                            .flickity-enabled.is-fullscreen
                                .carousel-cell
                                .desc
                                > p {
                                color: var(--mainWhite);
                                text-shadow: 1px 3px 5px black;
                                border-radius: 15px;
                            }

                            .flickity-enabled.is-fullscreen
                                .carousel-cell
                                section
                                img {
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
                    <style>
                        {`
                            .flickity-page-dots .dot {
                                background: ${pageDotsColor};
                            }
                    `}
                    </style>
                </section>
            </Flickity>
        );
    }

    return <Carousel />;
}

function CarouselList(props) {
    const { detectedCard, flickity, carouselInd } = props;
    const dataList = [
        {
            adName: "misto arabe",
            category: "salgados",
            createdAt: "2022-02-21T19:12:17.887Z",
            img:
                "https://res.cloudinary.com/fiddelize/image/upload/v1645470730/digital-menu/fiddelize_sandubapaoarabemisto.png",
            itemId: "itemIcqmd5yyyzM_Mj7P1pGn",
            price: 8,
            updatedAt: "2022-02-23T22:33:07.805Z",
            _id: "6213e412c2f5c55adceab718",
        },
        {
            adName: "mini pizza",
            category: "pizzas",
            createdAt: "2022-02-21T18:34:10.855Z",
            img:
                "https://res.cloudinary.com/fiddelize/image/upload/v1645468443/digital-menu/fiddelize_minipizzajpeg.jpg",
            itemId: "item14dIR9_FXMHWa0awYC6L",
            price: 10,
            updatedAt: "2022-02-23T22:31:54.227Z",
            _id: "6213db23c2f5c55adce9998c",
        },
        {
            adName: "x-salada",
            category: "salgados",
            createdAt: "2022-02-21T19:13:15.796Z",
            img:
                "https://res.cloudinary.com/fiddelize/image/upload/v1645470786/digital-menu/fiddelize_sandubaxsaladaverduras.jpg",
            itemId: "itemNgxQZvylk-T-3wHpQri5",
            price: 5,
            updatedAt: "2022-02-23T22:33:07.805Z",
            _id: "6213e44cc2f5c55adceabdfc",
        },
    ];
    return (
        <Fragment>
            {dataList.length &&
                dataList
                    .map((card, ind) => (
                        <Fragment key={card._id}>
                            <ItemCardCustomer
                                card={card}
                                flickity={flickity}
                                carouselInd={carouselInd}
                            />
                        </Fragment>
                    ))
                    .slice(0, 5)}
        </Fragment>
    );
}
/*

<img src="/img/test/cardapio-qr/acai-copo.jpg"/>
<img src="/img/test/cardapio-qr/lata-guarana-antactica.jpg"/>
<img src="/img/test/cardapio-qr/pepsi-lata.jpg"/>

 */
