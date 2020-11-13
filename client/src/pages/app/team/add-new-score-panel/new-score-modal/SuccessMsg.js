import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useClientAdmin } from "../../../../../hooks/useRoleData";
import usePlayAudio from "../../../../../hooks/media/usePlayAudio";

export default function SuccessMsg({
    needDark = false,
    textColor = "text-white",
}) {
    const audio =
        "/sounds/tts/cli-member-app/success-score-addition/certo-tempo-real-cliente.mp3";
    usePlayAudio(audio, "cli-member_msg-score", { autoplay: true });

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
                    Certo! Pontos de fidelidade adicionados em tempo real para o
                    cliente.{" "}
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
            </div>
        </section>
    );
}
