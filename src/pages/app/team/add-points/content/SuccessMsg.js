import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useData, { useBizData } from "init";
import usePlayAudio from "hooks/media/usePlayAudio";
import removeImgFormat from "utils/biz/removeImgFormat";
import getAPI, { removeTempPoints } from "api";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import showToast from "components/toasts";
import { useVar } from "init/var";
import getFirstName from "utils/string/getFirstName";
import getColor from "styles/txt";

export default function SuccessMsg({
    needDark = false,
    textColor = "text-white",
    closeModal,
    customerId = "601df6b42be9a28986c2a821",
    customerName,
}) {
    const [closeMsg, setCloseMsg] = useState(false);
    const [disabledUndo, setDisabledUndo] = useState(false);

    // const [succMsg] = useData(["text_cli-member_msg-score"], "audios");
    const { userId: memberId, name: memberName } = useData();

    const lastTempPoints = useVar("lastTempPoints", { dots: true });

    const { bizLogo, themeBackColor } = useBizData();
    const { txtColorStyle } = getColor(themeBackColor);
    const { newImg: thisBizLogo, width, height } = removeImgFormat(bizLogo);

    const handleFinishedAudio = () => {
        setCloseMsg(true);
        setTimeout(() => {
            closeModal();
        }, 2000);
    };

    usePlayAudio(null, "audio_cli-member_msg-score", {
        autoplay: true,
        onendedCallback: handleFinishedAudio,
    });

    const undoTempPoints = async () => {
        setDisabledUndo(true);
        showToast("Desfazendo...");

        const body = {
            userId: memberId, // for auth
            customerId,
        };

        await getAPI({
            method: "post",
            needAuth: true,
            url: removeTempPoints(),
            body,
            errMsg: true,
        });

        // LESSON: this line won't be executed if there is an 400 status error.
        // No need to set a if(!data) return.
        showToast(
            `Saldo de ${lastTempPoints} PTS desfeito e removido da conta do cliente`,
            { dur: 10000 }
        );
        closeModal();
    };

    const showUndoButton = () => (
        <section className="mt-4 container-center">
            <ButtonFab
                disabled={disabledUndo}
                size="large"
                title="Desfazer"
                position="relative"
                variant="extended"
                onClick={undoTempPoints}
                color={txtColorStyle}
                backgroundColor="var(--expenseRed)"
            />
        </section>
    );

    const cliUserName = getFirstName(customerName && customerName.cap(), {
        addSurname: true,
    });

    const showBrief = () => (
        <section className="text-center mx-3">
            <h2 className="text-title" style={{ lineHeight: "35px" }}>
                {cliUserName}
                <br />
                <span className="text-subtitle">recebeu:</span>{" "}
                <strong className="text-title">{lastTempPoints} PTS</strong>
                <br />
                <strong className="text-normal">Feito por: {memberName}</strong>
            </h2>
            {showUndoButton()}
        </section>
    );

    return (
        <section className={`${textColor} full-height`}>
            <div className="my-5 container-center">
                <img
                    src={
                        thisBizLogo === undefined
                            ? "/img/official-logo-name.png"
                            : thisBizLogo
                    }
                    width={width} // prior: bizLogo === "undefined" && 200
                    height={height}
                    title="logo empresa"
                    alt="logo empresa"
                />
            </div>
            <div className="animated fadeInUp">
                <h1
                    className={`text-subtitle ${textColor} mx-3 text-center`}
                    style={{ marginTop: 50 }}
                >
                    <FontAwesomeIcon
                        icon="check-circle"
                        style={{
                            fontSize: 50,
                            color: needDark
                                ? "var(--mainDark)"
                                : "var(--mainWhite)",
                        }}
                        className="ml-2 animated rubberBand delay-3s"
                    />
                </h1>
                {showBrief()}
                {closeMsg && (
                    <p
                        className={`${textColor} mt-5 text-subtitle font-weight-bold text-center`}
                    >
                        Finalizando...
                    </p>
                )}
            </div>
        </section>
    );
}
