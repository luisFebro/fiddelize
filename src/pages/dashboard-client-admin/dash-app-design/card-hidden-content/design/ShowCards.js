import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OptionCard from "./OptionCard";
import useData, { useBizData } from "init";
import useAuth from "auth/useAuth";
import "./style.scss";
import { translateColorToPtBr } from "../../../../../global-data/uiColors";
import useImg, { Img } from "../../../../../hooks/media/useImg";
import removeImgFormat from "../../../../../utils/biz/removeImgFormat";

export default function ShowCards({ setOpenComp }) {
    const { adminGame } = useData();
    const { milestoneIcon } = adminGame.targetPrize;

    const { bizLogo, themePColor, themeSColor, themeBackColor } = useBizData();

    const isAuth = useAuth();

    const [url, setUrl] = useState({
        logoBiz: "",
        logoFid: "",
    });

    const logoBiz = useImg(url.logoBiz, {
        trigger: url.logoBiz,
        coll: "logos",
        key: "app_biz_logo",
    });
    const logoFid = useImg(url.logoFid, {
        trigger: url.logoFid,
        coll: "logos",
        key: "app_fiddelize_logo",
    });
    const logoSrc = logoBiz || logoFid;

    const needClientLogo = bizLogo || isAuth;

    const handleLogoSrc = () => {
        if (needClientLogo) {
            const { newImg: thisbizLogo } = removeImgFormat(bizLogo);
            return setUrl({ ...url, logoBiz: thisbizLogo });
        }
        return setUrl({ ...url, logoFid: "/img/official-logo-name.png" });
    };

    useEffect(() => {
        handleLogoSrc();
    }, [needClientLogo]);

    const logoContent = () => {
        const isSquared = bizLogo && bizLogo.includes("h_100,w_100");

        return (
            <div className="container-center">
                {bizLogo ? (
                    <Img
                        src={logoSrc}
                        alt="logo negócio"
                        className="animated zoomIn slow shadow-elevation"
                        style={{
                            position: "relative",
                            margin: "15px 0",
                            boxShadow: "0 30px 40px 8px rgba(0, 0, 0, 0.35)",
                        }}
                        width={isSquared ? 100 : 190}
                        height={isSquared ? 100 : 85}
                    />
                ) : (
                    <p className="text-normal font-weight-bold text-center text-purple">
                        Sem logo
                    </p>
                )}
            </div>
        );
    };

    const colorContent = React.useCallback(() => {
        const colorP = themePColor;
        const colorS = themeSColor;
        const colorBack = themeBackColor || "default";

        const translatedColorP = translateColorToPtBr(
            colorP === "default" ? "purple" : colorP
        );
        const translatedColorS = translateColorToPtBr(
            colorS === "default" ? "defaultS" : colorS
        );
        const translatedColorBack = translateColorToPtBr(
            colorBack === "default" ? "purple" : colorBack
        );

        return (
            <section className="color--root">
                <div>
                    <div className="color-content">
                        <p className="color-text">• Cor Principal: </p>
                        <section className="color-desc">
                            <div
                                className="color-circle"
                                style={{
                                    backgroundColor: `var(--themeP--${colorP}`,
                                }}
                            />
                            <span className="text-center color-title text-purple text-small">
                                {translatedColorP}
                            </span>
                        </section>
                    </div>
                </div>
                <div>
                    <div className="color-content">
                        <p className="color-text">• Cor Secundária: </p>
                        <section className="color-desc">
                            <div
                                className="color-circle"
                                style={{
                                    backgroundColor: `var(--themeS--${colorS}`,
                                }}
                            />
                            <span className="text-center color-title text-purple text-small">
                                {translatedColorS}
                            </span>
                        </section>
                    </div>
                </div>
                <div>
                    <div className="color-content">
                        <p className="color-text">• Cor de Fundo: </p>
                        <section className="color-desc">
                            <div
                                className="color-circle shadow-elevation"
                                style={{
                                    backgroundColor:
                                        colorBack === "white"
                                            ? "var(--mainWhite)"
                                            : `var(--themeBackground--${colorBack}`,
                                }}
                            />
                            <span className="text-center color-title text-purple text-small">
                                {translatedColorBack}
                            </span>
                        </section>
                    </div>
                </div>
            </section>
        );
    }, []);

    const iconContent = React.useCallback(() => {
        const icon = milestoneIcon || "star";
        return (
            <section className="container-center icon--root">
                <div
                    className="icon--circle"
                    style={{ backgroundColor: "var(--themeP)" }}
                />
                <FontAwesomeIcon icon={icon} className="icon--selected-one" />
            </section>
        );
    }, []);

    return (
        <section
            id="cards"
            className="container-center justify-content-around my-5"
        >
            <OptionCard
                title="Logo App<br />Atual:"
                mainContent={logoContent()}
                onBtnClick={() => setOpenComp("logo")}
            />
            <OptionCard
                title="Cores do<br />App:"
                mainContent={colorContent()}
                onBtnClick={() => setOpenComp("colors")}
            />
            <OptionCard
                title="Ícone de<br />Nível Principal:"
                mainContent={iconContent()}
                onBtnClick={() => setOpenComp("icon")}
            />
        </section>
    );
}
