import { useState, forwardRef } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import "./_AppCard.scss";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { useGlobalContext } from "context";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import { useBizData } from "init";
import Skeleton from "components/multimedia/Skeleton";
import showToast from "components/toasts";
import handleOpenApp from "./helpers/appAccessAlgorithm";
//

const handleAppType = (role) => {
    if (role === "cliente-admin")
        return { type: "admin", icon: <VpnKeyIcon /> };
    if (role === "cliente-membro")
        return { type: "equipe", icon: <PeopleAltIcon /> };
    if (role === "nucleo-equipe")
        return { type: "fiddelize", icon: <MonetizationOnIcon /> };

    return { type: "cliente", icon: <LocalMallIcon /> };
};

export default forwardRef(AppCard);

function AppCard({ data, payload, loading }, ref) {
    const { uify } = useGlobalContext();
    const [opening, setOpening] = useState(false);

    const {
        userId: clickedAppUserId,
        appId,
        bizImg,
        bizName,
        role,
        isDefaultAccess: isCurrApp,
    } = data;

    const {
        appId_loggedIn,
        history,
        dispatch,
        role_loggedIn,
        bizLinkName,
        userId,
    } = payload;

    const { bizId } = useBizData();

    const dataAppType = role && handleAppType(role);

    const showFooter = () => (
        <section className="card-footer">
            <div className="desc font-weight-bold">
                {isCurrApp && (
                    <p className="default-access-badge">
                        APP ATUAL <DoneOutlineIcon />
                    </p>
                )}
                <p className={`app-type-badge ${isCurrApp ? "curr-app" : ""}`}>
                    app {dataAppType.type}
                    {dataAppType.icon}
                </p>
            </div>
        </section>
    );

    const payloadOpen = {
        uify,
        dispatch,
        history,
        appId,
        appRole: role,
        role_loggedIn,
        appId_loggedIn,
        bizLinkName,
        bizId,
        clickedAppUserId,
        userId,
    };
    // console.log("payloadOpen", payloadOpen);

    let finalBizLogo =
        bizImg && bizImg.replace(/\/h_100,w_100|\/h_85,w_190/gi, "");
    finalBizLogo =
        finalBizLogo === "" ? "/img/official-logo-name.png" : finalBizLogo;
    const showCard = () => (
        <section className="shadow-babadoo app-card--root">
            <section className="upper-audio-camera">
                <div>
                    <span className="audio" />
                    <span className="cam" />
                </div>
            </section>
            <section className="two-btns-left">
                <div>
                    {" "}
                    <span className="up" />
                    <span className="down" />
                </div>
            </section>
            <div className="power-btn-right" />
            <div className="two-btns-left" />
            <div className="img-container p-1 p-sm-3">
                <img
                    src={finalBizLogo || "/img/error.png"}
                    alt={bizName}
                    className="shadow-elevation-black"
                />
            </div>
            {showFooter()}
            <section className="cta">
                <ButtonFab
                    title={`${opening ? "iniciando..." : "abrir"}`}
                    variant="extended"
                    size="small"
                    position="relative"
                    backgroundColor="var(--themeSDark--default)"
                    onClick={() => {
                        (async () => {
                            setOpening(true);
                            await handleOpenApp(payloadOpen).catch((err) => {
                                showToast("Ocorreu um erro ao iniciar app", {
                                    type: "error",
                                });
                                setOpening(false);
                            });
                            setOpening(false);
                        })();
                    }}
                />
            </section>
        </section>
    );

    const showSkeleton = () => <Skeleton paddingTop="160%" margin=" " />;

    return (
        <section
            className="col-6 mx-auto mb-4 col-md-4 col-lg-3" // if you are in a modal, use only two cols, remove col-md-4 col-lg-3
            ref={ref}
        >
            {loading ? showSkeleton() : showCard()}
        </section>
    );
}
