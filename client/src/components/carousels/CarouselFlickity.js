import React, { useState, useEffect } from 'react';
import "flickity/dist/flickity.css";
// jquery module is required to run this path
import Flickity from 'flickity';
import './style.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setRun } from '../../redux/actions/globalActions';
import { useStoreDispatch } from 'easy-peasy';

const isSmall = window.Helper.isSmallScreen();

let lastIcon = "";
export default function CarouselFlickity({ data }) {
    const [iconSelected, setIconSelected] = useState('star');
    const dispatch = useStoreDispatch();

    useEffect(() => {
        setRun(dispatch, iconSelected);
    }, [iconSelected])

    var elem = document.querySelector('.main-carousel');
    var flkty = new Flickity(elem, {
      // options
      cellAlign: 'center',
      wrapAround: true,
      freeScroll: false, // if true, this produces an awkward alignment of cards when dragging them
      pageDots: false,
      prevNextButtons: isSmall ? false : true, //
      friction: 0.28, // default: 0.28
      dragThreshold: 3, // default: 3
      percentagePosition: false, // default: true;
      selectedAttraction: 0.1, // default: 0.025
      on: {
          ready: function() {
            console.log('Flickity ready');
          }
      }
    });

    flkty.on('change', index => setTimeout(() => setIconSelected(data[index].icon), 2000));

    // const dataFlickity = Flickity.data(elem)
    // console.log("data", dataFlickity);

    return (
        <div className="carousel--root my-2 text-white">
            <div className="main-carousel">
                {data.map(card => {
                    return (
                        <div
                            key={card.icon}
                            className="carousel-cell no-outline d-flex flex-column justify-content-center align-content-item"
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