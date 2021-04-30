import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePlayAudio from "../../../../../hooks/media/usePlayAudio";
import useData from "../../../../../hooks/useData";
import { useBizData } from "init";
import removeImgFormat from "../../../../../utils/biz/removeImgFormat";

export default function SuccessMsg({
    needDark = false,
    textColor = "text-white",
    closeModal,
}) {
    const [closeMsg, setCloseMsg] = useState(false);

    const [succMsg] = useData(["text_cli-member_msg-score"], {
        storeName: "audios",
    });

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

    const { selfBizLogoImg: bizLogo } = useBizData();
    const { newImg: thisBizLogo, width, height } = removeImgFormat(bizLogo);

    return (
        <section className="full-height">
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
                    style={{ marginTop: 150 }}
                >
                    {succMsg || "..."}{" "}
                    <FontAwesomeIcon
                        icon="check-circle"
                        style={{
                            fontSize: 25,
                            color: needDark
                                ? "var(--mainDark)"
                                : "var(--mainWhite)",
                        }}
                        className="ml-2 animated rubberBand delay-3s"
                    />
                </h1>
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
