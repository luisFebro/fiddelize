import React, { useState, useEffect } from 'react';
import "flickity/dist/flickity.css";
// jquery module is required to run this path
import Flickity from 'flickity';
import './style.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const isSmall = window.Helper.isSmallScreen();

let lastIcon = "";
export default function CarouselFlickity({ data }) {
    const [iconSelected, setIconSelected] = useState('');
    console.log("iconSelected", iconSelected);

    useEffect(() => {
        if(iconSelected) {
            // handleSelection(iconSelected)
        }
    }, [iconSelected])

    var elem = document.querySelector('.main-carousel');
    var flkty = new Flickity( elem, {
      // options
      cellAlign: 'center',
      wrapAround: true,
      freeScroll: true,
      pageDots: false,
      prevNextButtons: isSmall ? false : true,
      friction: 0.28, // default: 0.28
      dragThreshold: 3, // default: 3
      percentagePosition: false, // default: true;
      selectedAttraction: 0.1, // default: 0.025

    });

    const dataFlickity = Flickity.data(elem)
    console.log("data", dataFlickity);

    const handleSelection = nameIcon => {
        const currElem = document.getElementById(nameIcon);
        if(nameIcon === iconSelected) {
                currElem.style.cssText="color: var(--mainWhite); background-color: var(--mainPurple)";
                // currElem.style.backgroundColor = "var(--mainPurple)";
                // currElem.style.color = "var(--mainWhite)";
                lastIcon = nameIcon;
                console.log("lastIcon", lastIcon);
        }
        // console.log("lastIcon", lastIcon);
        // if(lastIcon && lastIcon !== nameIcon) {
        //     const lastElem = document.getElementById(lastIcon);
        //     lastElem.style.backgroundColor = "var(--mainWhite)";
        //     lastElem.style.color = "var(--mainPurple)";
        // }
    };

    return (
        <div className="carousel--root my-2 text-white">
            <div class="main-carousel">
                {data.map(card => {
                    return (
                        <div
                            id={card.icon}
                            key={card.icon}
                            className="carousel-cell no-outline d-flex flex-column justify-content-center align-content-item"
                            onClick={() => setIconSelected(card.icon)}
                        >
                            <div className="container-center">
                                <FontAwesomeIcon
                                    icon={card.icon}
                                    className="card-icons"
                                />
                            </div>
                            <p className="mt-5 text-capitalize text-normal text-center font-weight-bold">
                                {card.ptBr}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}