import React, { useState, useEffect } from "react";
import ButtonFab, { faStyle } from "../material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AttentionWaves from "./AttentionWaves";
import ModalFullContent from "../../modals/ModalFullContent";
import useStorage from "../../../hooks/storage/useStorage";
import pickFeature from "./pickFeature";
import usePro from "../../../hooks/pro/usePro";

export default function PremiumButton({
    callback,
    proFeature = "OrgganizeClients_1",
    top,
    left,
    right,
}) {
    const [fullOpen, setFullOpen] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [waveOn, setWaveOn] = useState(false);

    let { isProUser } = usePro();
    isProUser = false;

    const { gotData, loading } = useStorage({ key: proFeature, trigger });

    useEffect(() => {
        if (!loading && !gotData) {
            setWaveOn(true);
        }
    }, [gotData, loading]);

    const handlePickedComp = () => {
        const PickedComp = pickFeature({ feature: proFeature });
        return <PickedComp />;
    };

    const PickedFeature = handlePickedComp();

    const handleFullOpen = () => {
        setTrigger(true);
        setWaveOn(false);
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const showPremiumBtn = () => (
        <section
            style={{ zIndex: 1000, top, left, right }}
            className="position-absolute"
        >
            <AttentionWaves
                isActive={waveOn ? true : false}
                waveColor="rgba(255, 242, 0, 0.3)"
                waveSize="40px"
            />
            <ButtonFab
                position="relative"
                size="small"
                onClick={handleFullOpen}
                color="var(--mainWhite)"
                backgroundColor="#fbc531" // nice ui yellow
                iconFontAwesome={
                    <FontAwesomeIcon
                        icon="crown"
                        style={{ ...faStyle, fontSize: "23px" }}
                    />
                }
            />
        </section>
    );

    return (
        !isProUser && (
            <section className="animated fadeIn delay-2s">
                {showPremiumBtn()}
                <ModalFullContent
                    contentComp={PickedFeature}
                    fullOpen={fullOpen}
                    setFullOpen={handleFullClose}
                />
            </section>
        )
    );
}
