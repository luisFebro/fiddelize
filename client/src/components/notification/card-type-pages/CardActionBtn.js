import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStoreDispatch } from "easy-peasy";
import { setRun } from "../../../hooks/useRunComp";
import { markOneClicked } from "../../../redux/actions/notificationActions";
import ButtonMulti, {
    faStyle,
} from "../../../components/buttons/material-ui/ButtonMulti";
import ModalFullContent from "../../../components/modals/ModalFullContent";
import pickCardType from "./pickCardType";
import Spinner from "../../../components/loadingIndicators/Spinner";
import { useClientAdmin, useProfile } from "../../../hooks/useRoleData";
import getId from "../../../utils/getId";

function CardActionBtn({
    userId,
    senderId,
    cardId,
    cardType,
    clicked,
    backColor,
    content, // string
    subtype,
    brief,
    circularImg,
    role,
    forceCliUser = false,
}) {
    const [fullOpen, setFullOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [seen, setSeen] = useState(false);
    const dispatch = useStoreDispatch();
    const { selfBizLogoImg, bizName } = useClientAdmin();
    const { name: userName } = useProfile();

    const handlePickedComp = () => {
        const opts = {
            content,
            subtype,
            role,
            brief,
            circularImg,
            senderId,
            selfBizLogoImg,
            bizName,
            userName,
        };
        const PickedComp = pickCardType(cardType, opts);
        return <PickedComp />;
    };

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const handleClickedCard = () => {
        setIsLoading(true);
        markOneClicked(userId, cardId, { forceCliUser }).then((res) => {
            if (res.status !== 200) {
                return setIsLoading(false);
            }
            setRun(dispatch, `notificationCount${getId()}`);
            handleFullOpen();
            setTimeout(() => {
                setIsLoading(false);
                setSeen(true);
            }, 3000);
        });
    };

    const handleBtnTitle = () => {
        if (isLoading) {
            return <Spinner size="mini" marginY="5px" />;
        } else if (seen) {
            return "Visto";
        } else {
            return !clicked ? "Ver" : `Ok ✔️`;
        }
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
                        ? "var(--themeSDark--" + backColor + ")"
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
CardActionBtn.whyDidYouRender = false;
