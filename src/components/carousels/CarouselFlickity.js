import { useState, useEffect } from "react";
import "flickity/dist/flickity.css";
// jquery module is required to run this path
import Flickity from "flickity";
import useData, { useBizData } from "init";
import "./CarouselFlickity.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setRun, useAction } from "global-data/ui";
import { useReadUser } from "api/frequent";
import ShowActionBtns from "../../pages/new-app/self-service/pickers/ShowActionBtns";
import { getIconIndex } from "../../global-data/milestoneIconsSorted.js";
import ButtonMulti, { faStyle } from "../buttons/material-ui/ButtonMulti";
import findAndReplaceObjInArray from "../../utils/arrays/findAndReplaceObjInArray";

const isSmall = window.Helper.isSmallScreen();

export default function CarouselFlickity({
    data,
    style,
    isFromDash,
    currIconInd,
    setSelectedIcon,
    selectOnlyIcon = false,
    setOpenModal,
}) {
    const [iconSelected, setIconSelected] = useState(data[0].icon);
    const [iconReady, setIconReady] = useState(false);
    const [needUpdateBtn, setNeedUpdateBtn] = useState(false);

    const uify = useAction();

    const { bizId } = useBizData();

    const { data: dataChall, loading } = useReadUser(
        bizId,
        "cliente-admin",
        "clientAdminData.games.targetPrize.challList"
    );

    const handledData = dataChall
        ? dataChall.clientAdminData.games.targetPrize.challList
        : [];
    const challList = !loading ? handledData : [];

    const { adminGame } = useData();

    const prizeDesc = adminGame ? adminGame.targetPrize.prizeDesc : "";
    const targetPoints = adminGame ? adminGame.targetPrize.targetPoints : 0;

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
    }, [iconChanged]);

    useEffect(() => {
        if (!isFromDash) {
            setRun("runName", iconSelected, uify);
        }
        if (selectOnlyIcon) setSelectedIcon(iconSelected);
    }, [isFromDash, iconSelected]);

    const carouselElem = document.querySelector(".main-carousel");
    if (carouselElem || carouselElem2) {
        const flkty = new Flickity(carouselElem, {
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

    // Updating challList as well:
    let updatedArray;
    if (!setSelectedIcon) {
        updatedArray = [
            {
                id: bizId,
                milestoneIcon: iconSelected,
                targetPoints,
                prizeDesc,
                prizeDeadline: 30,
            },
        ];
    }

    return (
        <div className="carousel--root my-2 text-white" style={style}>
            <div className="main-carousel">
                {data.map((card) => (
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
                ))}
            </div>
            {isFromDash && !setSelectedIcon && (
                <ShowActionBtns
                    needUpdateBtn={needUpdateBtn}
                    objToSend={null}
                    titleBeforeOk="Salvando novo ícone..."
                    titleAfterOk="Ícone salvo."
                />
            )}
            {!selectOnlyIcon && setSelectedIcon && needUpdateBtn && (
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

/*
objToSend={{
    "clientAdminData.milestoneIcon": iconSelected,
    "clientAdminData.challList": findAndReplaceObjInArray(
        challList,
        updatedArray,
        "id"
    ),
}}
 */
