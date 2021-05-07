import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { markOneClicked } from "../../../redux/actions/notificationActions";
import ButtonMulti, { faStyle } from "../../buttons/material-ui/ButtonMulti";
import ModalFullContent from "../../modals/ModalFullContent";
import pickCardType from "./pickCardType";
import Spinner from "../../loadingIndicators/Spinner";
// import getId from "../../../utils/getId";

function CardActionBtn(props) {
    const {
        bizId,
        cardId,
        userId,
        clicked,
        backColor,
        cardType,
        role,
        forceCliUser,
    } = props;

    const [fullOpen, setFullOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [seen, setSeen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const handlePickedComp = () => {
        const opts = {
            ...props,
            handleFullClose,
        };
        const PickedComp = pickCardType(cardType, opts);
        return <PickedComp />;
    };

    const handleClickedCard = async () => {
        setIsLoading(true);

        const updatedBy = props.userName;

        const res = await markOneClicked(bizId || userId, cardId, {
            forceCliUser,
            thisRole: bizId ? "cliente-admin" : role,
            updatedBy:
                role === "cliente-admin" || role === "cliente-membro"
                    ? updatedBy
                    : undefined,
            cliMemberId: userId,
        });

        if (res.status !== 200) {
            return setIsLoading(false);
        }

        handleFullOpen();
        setTimeout(() => {
            setIsLoading(false);
            setSeen(true);
        }, 3000);

        return false;
    };

    const handleBtnTitle = () => {
        if (isLoading) {
            return <Spinner size="mini" marginY="5px" />;
        }
        if (seen) {
            return "Visto";
        }
        return !clicked ? "Ver" : "Ok ✔️";
    };

    return (
        <section className="action-btn">
            <ButtonMulti
                onClick={handleClickedCard}
                iconFontAwesome={
                    !clicked && !isLoading && !seen ? (
                        <FontAwesomeIcon
                            icon="bolt"
                            style={{ ...faStyle, fontSize: 22 }}
                        />
                    ) : null
                }
                textShadow={!clicked ? null : " "}
                color={!clicked ? "var(--mainWhite)" : "var(--mainDark)"}
                backgroundColor={
                    !clicked
                        ? `var(--themeSDark--${backColor})`
                        : "var(--lightGrey)"
                }
            >
                {handleBtnTitle()}
            </ButtonMulti>
            <ModalFullContent
                contentComp={handlePickedComp()}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                exitBtn="text"
            />
        </section>
    );
}

export default React.memo(CardActionBtn);
