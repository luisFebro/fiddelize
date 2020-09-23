import React, { useState, useEffect } from "react";
import "flickity/dist/flickity.css";
// jquery module is required to run this path
import Flickity from "flickity";
import "./CarouselCard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setRun } from "../../redux/actions/globalActions";
import { useStoreDispatch } from "easy-peasy";
import { getIconIndex } from "../../global-data/milestoneIconsSorted.js";

const isSmall = window.Helper.isSmallScreen();

export default function CarouselCard({
    CardList,
    style,
    currIconInd,
    setOpenModal,
    size,
}) {
    const [iconSelected, setIconSelected] = useState(null);
    const [iconReady, setIconReady] = useState(false);
    const dispatch = useStoreDispatch();

    const [carouselElem2, setCarouselElem2] = useState("");
    useEffect(() => {
        const carouselElem2 = document.querySelector(".main-carousel");
        setCarouselElem2(carouselElem2);
    }, []);

    const iconChanged = currIconInd !== getIconIndex(iconSelected);

    const carouselElem = document.querySelector(".main-carousel");
    if (carouselElem || carouselElem2) {
        var flkty = new Flickity(carouselElem, {
            // options
            cellAlign: "center",
            wrapAround: true,
            freeScroll: false, // if true, this produces an awkward alignment of cards when dragging them
            pageDots: false,
            prevNextButtons: isSmall ? false : true, //
            friction: 0.28, // default: 0.28
            dragThreshold: 3, // default: 3
            percentagePosition: false, // default: true;
            selectedAttraction: 0.1, // default: 0.025
            on: {
                ready: function () {
                    console.log("Flickity ready");
                    setIconReady(true);
                },
            },
        });

        // g (delaying function execution) to delay by 2 second to avoid crash app.
        // flkty.on('change', index => setTimeout(() => setIconSelected(data[index].icon), 1000));
        setTimeout(
            () =>
                !iconReady &&
                currIconInd &&
                flkty.selectCell(currIconInd, false, false),
            3000
        );
    }

    return (
        <section className="mb-5 container-center-max-width-500">
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
