import { useState, useEffect } from "react";
import "flickity/dist/flickity.css";
// jquery module is required to run this path
import Flickity from "flickity";
import "./CarouselCard.scss";

const isSmall = window.Helper.isSmallScreen();

export default function CarouselCard({
    CardList,
    style,
    currIconInd,
    setOpenModal,
    size,
}) {
    const [flkty, setFlkty] = useState(null);

    useEffect(() => {
        const carouselElem2 = document.querySelector(".main-carousel");

        const flkty = new Flickity(carouselElem2, {
            // options
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
        });

        setFlkty(flkty);
    }, []);

    return (
        <section
            id="carouselCard--root"
            className="mb-5 container-center-max-width-500"
        >
            <div
                className={`carousel--root ${
                    size === "compact" ? "compact" : ""
                } my-2 text-white`}
            >
                <div className="main-carousel">{CardList}</div>
            </div>
        </section>
    );
}
