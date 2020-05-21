import React from 'react';
import OptionCard from './OptionCard';
import { useClientAdmin } from '../../../../../hooks/useRoleData';
import { useAuthUser } from '../../../../../hooks/useAuthUser';
import imgLib, { ImgLoader } from '../../../../../utils/storage/lForageStore';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './style.scss';
import { translateColorToPtBr } from '../../../../../global-data/uiColors';

export default function ShowCards({ setOpenComp }) {
    const {
        selfBizLogoImg,
        selfThemePColor,
        selfThemeSColor,
        selfThemeBackColor,
        selfMilestoneIcon,
    } = useClientAdmin();
    const { isAuthUser } = useAuthUser();

    const logoContent = () => {
        const needClientLogo = selfBizLogoImg || isAuthUser;
        const handleLogoSrc = () => {
            if(needClientLogo) {
                return imgLib.app_biz_logo(selfBizLogoImg);
            } else {
                return imgLib.app_fiddelize_logo;
            }
        }

        const logoSrc = handleLogoSrc();
        const isSquared = selfBizLogoImg && selfBizLogoImg.includes("h_100,w_100");

        return(
            <div className="container-center">
                <ImgLoader
                    className={`${needClientLogo ? "app_biz_logo" : "app_fiddelize_logo"} animated zoomIn slow shadow-elevation`}
                    src={logoSrc}
                    style={{position: 'relative', margin: '15px 0', boxShadow: '0 30px 40px 8px rgba(0, 0, 0, 0.35)'}}
                    width={isSquared ? 100 : 190}
                    height={isSquared ? 100 : 85}
                />
            </div>
        );
    }

    const colorContent = () => {
        const colorP = selfThemePColor;
        const colorS = selfThemeSColor;
        const colorBack = selfThemeBackColor || 'default';

        const translatedColorP = translateColorToPtBr(colorP === "default" ? "defaultP" : colorP);
        const translatedColorS = translateColorToPtBr(colorS === "default" ? "defaultS" : colorS);
        const translatedColorBack = translateColorToPtBr(colorBack === "default" ? "defaultP" : colorBack);
        return(
            <section className="color--root">
                <div>
                    <div className="color-content">
                        <p className="color-text">• Cor Principal: </p>
                        <section className="color-desc">
                            <div className="color-circle" style={{backgroundColor: `var(--themeP--${colorP}` }}></div>
                            <span className="text-center color-title text-purple text-small">{translatedColorP}</span>
                        </section>
                    </div>
                </div>
                <div>
                    <div className="color-content">
                        <p className="color-text">• Cor Secundária: </p>
                        <section className="color-desc">
                            <div className="color-circle" style={{backgroundColor: `var(--themeS--${colorS}` }}></div>
                            <span className="text-center color-title text-purple text-small">{translatedColorS}</span>
                        </section>
                    </div>
                </div>
                <div>
                    <div className="color-content">
                        <p className="color-text">• Cor de Fundo: </p>
                        <section className="color-desc">
                            <div className="color-circle shadow-elevation" style={{backgroundColor: colorBack === "white" ? 'var(--mainWhite)' : `var(--themeBackground--${colorBack}` }}></div>
                            <span className="text-center color-title text-purple text-small">{translatedColorBack}</span>
                        </section>
                    </div>
                </div>
            </section>
        );
    }

    const iconContent = () => {
        const icon = selfMilestoneIcon || "star";
        return(
            <section className="container-center icon--root">
                <div className="icon--circle" style={{backgroundColor: 'var(--themeP)'}}></div>
                <FontAwesomeIcon
                    icon={icon}
                    className="icon--selected-one"
                />
            </section>
        );
    }

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
                title="Ícone de<br />Nível:"
                mainContent={iconContent()}
                onBtnClick={() => setOpenComp("icon")}
            />
        </section>
    );
}