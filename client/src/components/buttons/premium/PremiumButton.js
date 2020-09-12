import React, { useState, useEffect, Fragment } from "react";
import ButtonFab, { faStyle } from "../material-ui/ButtonFab";
import RadiusBtn from "../RadiusBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AttentionWaves from "./AttentionWaves";
import ModalFullContent from "../../modals/ModalFullContent";
import useStorage from "../../../hooks/storage/useStorage";
import pickFeature from "./pickFeature";
import usePro from "../../../hooks/pro/usePro";

export default function PremiumButton({
    btnType = "crown", // crown or pill (conhecer)
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
        <Fragment>
            {btnType === "pill" && (
                <RadiusBtn
                    size="extra-small"
                    title="conhecer"
                    onClick={handleFullOpen}
                    backgroundColor="var(--themeSDark)"
                />
            )}

            {btnType === "crown" && (
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
            )}
        </Fragment>
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
