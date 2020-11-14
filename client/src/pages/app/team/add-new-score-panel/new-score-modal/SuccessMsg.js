import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useClientAdmin } from "../../../../../hooks/useRoleData";
import usePlayAudio from "../../../../../hooks/media/usePlayAudio";
import useData from "../../../../../hooks/useData";

export default function SuccessMsg({
    needDark = false,
    textColor = "text-white",
    closeModal,
}) {
    const [closeMsg, setCloseMsg] = useState(false);

    const [succMsg] = useData(["cli-member_msg-score-text"], {
        storeName: "audios",
    });

    const handleFinishedAudio = () => {
        setCloseMsg(true);
        setTimeout(() => {
            closeModal();
        }, 2000);
    };

    usePlayAudio(null, "cli-member_msg-score-audio", {
        autoplay: true,
        onendedCallback: handleFinishedAudio,
    });

    const { selfBizLogoImg: bizLogo } = useClientAdmin();

    return (
        <section className="full-height">
            <div className="my-5 container-center">
                <img
                    src={
                        bizLogo === "undefined"
                            ? `/img/official-logo-name.png`
                            : bizLogo
                    }
                    className="img-fluid"
                    width={bizLogo === "undefined" && 200}
                    height={bizLogo === "undefined" && 200}
                    title={`logo logo empresa`}
                    alt={`logo empresa`}
                />
            </div>
            <div className="animated fadeInUp">
                <h1
                    className={`text-subtitle ${textColor} mx-3 text-center`}
                    style={{ marginTop: 150 }}
                >
                    {succMsg ? succMsg : "..."}{" "}
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
