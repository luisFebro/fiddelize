import React, { Fragment, forwardRef } from "react";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import ButtonMulti from "../../../components/buttons/material-ui/ButtonMulti";
import "./_AppCard.scss";
import Skeleton from "../../../components/multimedia/Skeleton";
import {
    handleOpenApp,
    dontRememberAccess,
} from "./helpers/appAccessAlgorithm";
// icons
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";

const handleAppType = (role) => {
    if (role === "cliente-admin")
        return { type: "admin", icon: <VpnKeyIcon /> };
    if (role === "cliente-membro")
        return { type: "equipe", icon: <PeopleAltIcon /> };
    if (role === "nucleo-equipe")
        return { type: "fiddelize", icon: <MonetizationOnIcon /> };
    if (role === "cliente") return { type: "cliente", icon: <LocalMallIcon /> };
};

export default forwardRef(AppCard);

function AppCard({ data, payload, loading, loadingDefaultAccess }, ref) {
    const { appId, bizImg, bizName, role, isDefaultAccess } = data;
    const {
        appId_loggedIn,
        history,
        dispatch,
        role_loggedIn,
        bizCodeName,
        handleSelectedDefaultAccess,
    } = payload;

    const dataAppType = role && handleAppType(role);

    const showFooter = () => (
        <section className="card-footer">
            <div className="desc font-weight-bold">
                {isDefaultAccess ? (
                    <p className="default-access-badge">
                        acesso padrão <DoneOutlineIcon />
                    </p>
                ) : (
                    <div
                        className={
                            loadingDefaultAccess === appId
                                ? "access-check loading"
                                : "access-check"
                        }
                    >
                        {loadingDefaultAccess === appId ? (
                            <p className="text-p text-small font-weight-bold">
                                ativando padrão...
                            </p>
                        ) : (
                            <ButtonMulti
                                title="acesso padrão"
                                onClick={() => {
                                    (async () => {
                                        await dontRememberAccess({
                                            role: "team-apps",
                                            role_loggedIn,
                                        });
                                        handleSelectedDefaultAccess(appId);
                                    })();
                                }}
                                variant="link"
                                textTransform="lowercase"
                            />
                        )}
                    </div>
                )}
                <p className="app-type-badge">
                    app {dataAppType.type}
                    {dataAppType.icon}
                </p>
            </div>
        </section>
    );

    const payloadOpen = {
        history,
        appId,
        appRole: role,
        role_loggedIn,
        appId_loggedIn,
        dispatch,
        bizCodeName,
    };

    const finalBizLogo =
        bizImg && bizImg.replace(/\/h_100,w_100|\/h_85,w_190/gi, "");
    const showCard = () => (
        <section className="shadow-babadoo app-card--root">
            <section className="upper-audio-camera">
                <div>
                    <span className="audio"></span>
                    <span className="cam"></span>
                </div>
            </section>
            <section className="two-btns-left">
                <div>
                    <span className="up"></span>
                    <span className="down"></span>
                </div>
            </section>
            <div className="power-btn-right"></div>
            <div className="two-btns-left"></div>
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
                    title="abrir"
                    variant="extended"
                    size="small"
                    backgroundColor="var(--default)"
                    position="relative"
                    backgroundColor={`var(--themeSDark--default)`}
                    onClick={() => handleOpenApp(payloadOpen)}
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
