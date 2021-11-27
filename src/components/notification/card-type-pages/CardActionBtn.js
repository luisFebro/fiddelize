import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getAPI, { markOneClicked } from "api";
import ButtonMulti, { faStyle } from "../../buttons/material-ui/ButtonMulti";
import ModalFullContent from "../../modals/ModalFullContent";
import pickCardType from "./pickCardType";
import Spinner from "../../loadingIndicators/Spinner";
// import getId from "../../../utils/getId";

export default function CardActionBtn(props) {
    const { bizId, cardId, userId, clicked, backColor, cardType, role } = props;

    // LESSON: use setData instead of multiple separate useState to avoid unexpexted page reloading or even missed data
    const [data, setData] = useState({
        fullOpen: false,
        loading: false,
        seen: false,
    });

    const { fullOpen, loading, seen } = data;

    const handleFullClose = () => {
        setData((prev) => ({ ...prev, fullOpen: false }));
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
        setData((prev) => ({ ...prev, loading: true }));

        const updatedBy = props.userName;

        const roleForNotif =
            role === "cliente-admin" || role === "cliente-membro"
                ? updatedBy
                : undefined;

        setData((prev) => ({
            ...prev,
            fullOpen: true,
            loading: false,
            seen: true,
        }));

        const body = {
            cardId,
            thisRole: bizId ? "cliente-admin" : role,
            updatedBy: roleForNotif,
            cliMemberId: roleForNotif && userId,
        };

        await getAPI({
            method: "put",
            url: markOneClicked(bizId || userId),
            body,
        });

        return false;
    };

    const handleBtnTitle = () => {
        if (loading) {
            return <Spinner size="mini" marginY="5px" />;
        }
        if (seen) {
            return "Visto";
        }
        return !clicked ? "Ver" : "Ok ✔️";
    };

    const ThisPickedComp = handlePickedComp();

    return (
        <section className="action-btn">
            <ButtonMulti
                onClick={handleClickedCard}
                iconFontAwesome={
                    !clicked && !loading && !seen ? (
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
                contentComp={ThisPickedComp}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                exitBtn="text"
            />
        </section>
    );
}
