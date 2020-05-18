import React, { useState, useEffect } from 'react';
import "flickity/dist/flickity.css";
// jquery module is required to run this path
import Flickity from 'flickity';
import './style.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setRun } from '../../redux/actions/globalActions';
import { useStoreDispatch } from 'easy-peasy';
import ShowActionBtns from '../../pages/new-app/self-service/pickers/ShowActionBtns';
import { getIconIndex } from '../../global-data/milestoneIconsSorted.js';

const isSmall = window.Helper.isSmallScreen();

export default function CarouselFlickity({
    data,
    style,
    isFromDash,
    currIconInd = 0, }) {
    const [iconSelected, setIconSelected] = useState(data[0].icon);
    const [iconReady, setIconReady] = useState(false);
    const [needUpdateBtn, setNeedUpdateBtn] = useState(false);
    const dispatch = useStoreDispatch();

    const iconChanged = currIconInd !== getIconIndex(iconSelected);

    useEffect(() => {
        if(isFromDash) {
            if(iconChanged && iconReady) setNeedUpdateBtn(true);
        }
    }, [iconChanged])

    useEffect(() => {
        if(!isFromDash) { setRun(dispatch, iconSelected) };
    }, [isFromDash])

    const carouselElem = document.querySelector('.main-carousel');
    if(carouselElem) {
        var flkty = new Flickity(carouselElem, {
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
                    setIconReady(true);
              }
          }
        });

        // g (delaying function execution) to delay by 2 second to avoid crash app.
        flkty.on('change', index => setTimeout(() => !iconReady && setIconSelected(data[index].icon), 1000));
        setTimeout(() => !iconReady && flkty.selectCell(currIconInd, false, false), 3500);
    }

    // const dataFlickity = Flickity.data(elem)
    // console.log("data", dataFlickity);

    return (
        <div
            className="carousel--root my-2 text-white"
            style={style}
        >
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
            {isFromDash && (
                <ShowActionBtns
                    needUpdateBtn={needUpdateBtn}
                    objToSend={{
                        "clientAdminData.selfMilestoneIcon": iconSelected,
                    }}
                    titleBeforeOk="Salvando novo ícone..."
                    titleAfterOk="Ícone salvo."
                />
            )}
        </div>
    );
}