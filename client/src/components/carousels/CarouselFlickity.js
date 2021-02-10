import React, { useState, useEffect } from "react";
import "flickity/dist/flickity.css";
// jquery module is required to run this path
import Flickity from "flickity";
import "./CarouselFlickity.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setRun } from "../../redux/actions/globalActions";
import { useStoreDispatch } from "easy-peasy";
import ShowActionBtns from "../../pages/new-app/self-service/pickers/ShowActionBtns";
import { getIconIndex } from "../../global-data/milestoneIconsSorted.js";
import ButtonMulti, {
    faStyle,
} from "../../components/buttons/material-ui/ButtonMulti";
import { useClientAdmin, useAppSystem } from "../../hooks/useRoleData";
import findAndReplaceObjInArray from "../../utils/arrays/findAndReplaceObjInArray";

const isSmall = window.Helper.isSmallScreen();

export default function CarouselFlickity({
    data,
    style,
    isFromDash,
    currIconInd,
    setSelectedIcon,
    setOpenModal,
}) {
    const [iconSelected, setIconSelected] = useState(data[0].icon);
    const [iconReady, setIconReady] = useState(false);
    const [needUpdateBtn, setNeedUpdateBtn] = useState(false);
    const dispatch = useStoreDispatch();

    const { businessId } = useAppSystem();
    const { mainReward, maxScore, rewardList } = useClientAdmin();

    const [carouselElem2, setCarouselElem2] = useState("");
    useEffect(() => {
        const carouselElem2 = document.querySelector(".main-carousel");
        setCarouselElem2(carouselElem2);
    }, []);

    const iconChanged = currIconInd !== getIconIndex(iconSelected);

    useEffect(() => {
        // do not insert "iconReady" in the update array for now since it is wrongly inserting the btn right before necessary.
        if (isFromDash) {
            if (iconChanged && iconReady) setNeedUpdateBtn(true);
        }
    }, [iconChanged, isFromDash, iconReady]);

    useEffect(() => {
        if (!isFromDash) {
            setRun(dispatch, iconSelected);
        }
    }, [isFromDash, iconSelected, dispatch]);

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
        const condRunSelect = isFromDash ? !iconReady : true;
        flkty.on("change", (index) =>
            setTimeout(
                () => condRunSelect && setIconSelected(data[index].icon),
                1000
            )
        );
        setTimeout(
            () =>
                !iconReady &&
                currIconInd &&
                flkty.selectCell(currIconInd, false, false),
            3000
        );
    }

    // const dataFlickity = Flickity.data(elem)
    // console.log("data", dataFlickity);

    // Updating rewardList as well:
    let updatedArray;
    if (!setSelectedIcon) {
        updatedArray = [
            {
                id: businessId,
                icon: iconSelected,
                rewardScore: maxScore,
                rewardDesc: mainReward,
            },
        ];
    }

    return (
        <div className="carousel--root my-2 text-white" style={style}>
            <div className="main-carousel">
                {data.map((card) => {
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
            {isFromDash && !setSelectedIcon && (
                <ShowActionBtns
                    needUpdateBtn={needUpdateBtn}
                    objToSend={{
                        "clientAdminData.selfMilestoneIcon": iconSelected,
                        "clientAdminData.rewardList": findAndReplaceObjInArray(
                            rewardList,
                            updatedArray,
                            "id"
                        ),
                    }}
                    titleBeforeOk="Salvando novo ícone..."
                    titleAfterOk="Ícone salvo."
                />
            )}
            {setSelectedIcon && needUpdateBtn && (
                <section className="animated zoomIn container-center">
                    <ButtonMulti
                        onClick={() => {
                            setSelectedIcon(iconSelected);
                            setOpenModal(false);
                        }}
                        title="selecionar"
                        color="var(--mainWhite)"
                        backgroundColor="var(--themeSDark)"
                        iconFontAwesome={
                            <FontAwesomeIcon
                                icon="paper-plane"
                                style={faStyle}
                            />
                        }
                    />
                </section>
            )}
        </div>
    );
}
