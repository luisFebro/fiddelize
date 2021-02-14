import { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab, { faStyle } from "../material-ui/ButtonFab";
import RadiusBtn from "../RadiusBtn";
import AttentionWaves from "./AttentionWaves";
import ModalFullContent from "../../modals/ModalFullContent";
import useStorage from "../../../hooks/storage/useStorage";
import pickFeature from "./pickFeature";
import usePro from "../../../hooks/pro/usePro";

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    crownIcon: {
        transform: "rotate(45deg)",
        top: -8,
        right: -8,
        color: "var(--themeP)",
        fontSize: "20px",
    },
});

export default function PremiumButton({
    btnType = "crown", // crown or pill (conhecer)
    callback,
    service, // "Orgganize Clientes"
    proPage = "OrgganizeClients_1",
    top,
    left,
    right,
    size,
}) {
    const styles = getStyles();

    const [fullOpen, setFullOpen] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [waveOn, setWaveOn] = useState(false);

    const { isActive } = usePro({ service });

    const { gotData, loading } = useStorage({ key: service, trigger });

    useEffect(() => {
        if (!loading && !gotData) {
            setWaveOn(true);
        }
    }, [gotData, loading]);

    const handleFullOpen = () => {
        setTrigger(true);
        setWaveOn(false);
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const data = {
        handleFullClose,
        isFromDash: true,
    };

    const handlePickedComp = () => {
        const PickedComp = pickFeature({ feature: proPage, data });
        return <PickedComp />;
    };

    const PickedFeature = handlePickedComp();

    const showPremiumBtn = () => (
        <Fragment>
            {btnType === "pill" && (
                <RadiusBtn
                    size={`${size || "extra-small"}`}
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
                        isActive={!!waveOn}
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

    const showProActiveBadge = () => (
        <section
            style={{ zIndex: 5, top, left, right }}
            className="position-absolute"
        >
            <section
                className="animated fadeIn delay-2s position-relative"
                style={{ width: isSmall ? 85 : 95 }}
            >
                <p className="text-pill d-table text-small font-weight-bold">
                    Pro Ativo
                </p>
                <FontAwesomeIcon
                    icon="crown"
                    style={styles.crownIcon}
                    className="position-absolute"
                />
            </section>
        </section>
    );

    return (
        <Fragment>
            {!isActive ? (
                <section className="animated fadeIn delay-2s">
                    {showPremiumBtn()}
                    <ModalFullContent
                        contentComp={PickedFeature}
                        fullOpen={fullOpen}
                        setFullOpen={handleFullClose}
                    />
                </section>
            ) : (
                showProActiveBadge()
            )}
        </Fragment>
    );
}
