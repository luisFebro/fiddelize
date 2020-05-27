import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import RadiusColorBtn from '../../../../components/buttons/RadiusColorBtn';
import Card from '@material-ui/core/Card';
import CheckBoxForm from '../../../../components/CheckBoxForm';
import { CLIENT_URL } from '../../../../config/clientUrl';
import ModalFullContent from '../../../../components/modals/ModalFullContent';
import { uiColors, translateColorToEng, translateColorToPtBr } from '../../../../global-data/uiColors';
import gotArrayThisItem from '../../../../utils/arrays/gotArrayThisItem';
import ButtonMulti, {faStyle} from '../../../../components/buttons/material-ui/ButtonMulti';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ShowActionBtns from './ShowActionBtns';
import { useClientAdmin } from '../../../../hooks/useRoleData';

PickTheming.propTypes = {
    step: PropTypes.number,
    setNextDisabled: PropTypes.func,
}

export default function PickTheming({
    step,
    setNextDisabled,
    theme,
    setTheme,
    isFromDash, }) {
    const [isBoxChecked, setIsBoxChecked] = useState(false);
    const [fullOpen, setFullOpen] = useState(false);
    const [data, setData] = useState({
        primaryColorBr: 'padrão',
        secondaryColorBr: 'padrão',
        backColorBr: 'padrão',
        hexValuePrimary: 'var(--themeP)',
        hexValueSecondary: 'var(--themeS)',
        hexBackValue: 'var(--themeP)',
        currColorModal: '',
        needUpdateBtn: false,
    })

    const {
        primaryColorBr,
        secondaryColorBr,
        backColorBr,
        currColorModal,
        needUpdateBtn,
        hexValuePrimary, hexValueSecondary, hexBackValue } = data;

    const needHideCheckBox = Boolean(primaryColorBr !== "padrão" || secondaryColorBr !== "padrão");

    const goNext = () => setNextDisabled(false);

    const { selfThemePColor, selfThemeSColor, selfThemeBackColor } = useClientAdmin();
    useEffect(() => {
        if(isFromDash) {
            const primaryCond = selfThemePColor === "default" ? "purple" : selfThemePColor;
            const secondaryCond = selfThemeSColor === "default" ? "defaultS" : selfThemeSColor;
            const backCond = selfThemeBackColor === "default" ? "purple" : selfThemeBackColor;

            setData({
                ...data,
                primaryColorBr: translateColorToPtBr(primaryCond),
                secondaryColorBr: translateColorToPtBr(secondaryCond),
                backColorBr: translateColorToPtBr(backCond),
                hexValuePrimary: `var(--themeP--${selfThemePColor})`,
                hexValueSecondary: `var(--themeS--${selfThemeSColor})`,
                hexBackValue: selfThemeBackColor === "" ? `var(--themeP--default)` : `var(--themeP--${selfThemeBackColor})`,
            })
        }
    }, [
    isFromDash,
    selfThemePColor,
    selfThemeSColor,
    selfThemeBackColor])

    useEffect(() => {
        if(!isFromDash) {
            secondaryColorBr && goNext();
        }
    }, [secondaryColorBr, isFromDash])

    useEffect(() => {
        if(primaryColorBr !== "padrão" || secondaryColorBr !== "padrão" || backColorBr !== "padrão") {
            if(!isFromDash) {
                const doc = document.querySelector("#status");
                doc.style.display = "block";
                setTimeout(() => doc.style.display = "none", 5000);
            }
        }
    }, [primaryColorBr, secondaryColorBr, backColorBr])

    useEffect(() => {
        if(!isFromDash) {
            if(isBoxChecked) {
                goNext();
            } else {
                setNextDisabled(true);
            }
        }
    }, [isBoxChecked, isFromDash])

    const handleIsSelectedBackColor = () => {
        if(backColorBr !== "padrão" && primaryColorBr !== "padrão") {
            return true;
        } else if(primaryColorBr !== "padrão") {
           return false;
        } else {
           return true;
        }
    }
    const showBackColorBtn = () => (
        primaryColorBr !== "padrão" &&
        <div className="flex-column animated zoomIn mt-3">
            <p className="m-0 text-purple text-center text-normal font-weight-bold">
                {isFromDash ? "Fundo" : "Cor de Fundo"}
            </p>
            <div className="mt-2 d-flex container-center-col">
                <RadiusColorBtn
                    selectedColor={handleIsSelectedBackColor() ? hexBackValue : hexValuePrimary}
                    onClick={() => {setFullOpen(!fullOpen); setData({ ...data, currColorModal: "de Fundo", needUpdateBtn: isFromDash && true });}}
                />
                <span className="mt-2 text-small text-center text-purple font-weight-bold">
                    {handleIsSelectedBackColor() ? backColorBr : primaryColorBr}
                </span>
            </div>
        </div>
    );

    const showThemingArea = () => (
        <section className="text-normal text-white container-center mb-md-5">
            <Card
                style={{
                    width: '100%',
                    maxWidth: isFromDash ? '' : 330,
                    backgroundColor: 'var(--mainWhite)',
                    boxShadow: isFromDash && '0 31px 120px -6px rgba(0, 0, 0, 0.35)',
                }}
                className="p-2 text-purple text-center text-normal font-weight-bold animated zoomIn fast"
            >
                <section className="container-center">
                    <img
                        src={`${CLIENT_URL}/img/icons/color-palette.svg`}
                        className="svg-elevation"
                        width={85}
                        height="auto"
                        alt="palheta de cores"
                    />
                    <p className="text-subtitle text-purple m-0 ml-3 font-weight-bold">
                        Cor
                    </p>
                </section>
                <section className="container-center justify-content-around my-3">
                    <div className={`flex-column ${isFromDash ? "" : "animated rubberBand delay-3s"} mt-3`} style={{animationIterationCount: 2}}>
                        <p className="m-0 text-purple text-center text-normal font-weight-bold">Principal</p>
                        <div className="mt-2 d-flex container-center-col">
                            <RadiusColorBtn
                                selectedColor={hexValuePrimary}
                                onClick={() => {setFullOpen(!fullOpen); setData({ ...data, currColorModal: "Principal", needUpdateBtn: isFromDash && true});}}
                            />
                            <span className="mt-2 text-small text-center text-purple font-weight-bold">
                                {primaryColorBr}
                            </span>
                        </div>
                    </div>
                    <div className={`flex-column ${isFromDash ? "" : "animated rubberBand delay-5s"} mt-3`} style={{animationIterationCount: 2}}>
                        <p className="m-0 text-purple text-center text-normal font-weight-bold">Secundária</p>
                        <div className="mt-2 d-flex container-center-col">
                            <RadiusColorBtn
                                selectedColor={hexValueSecondary}
                                onClick={() => {setFullOpen(!fullOpen); setData({ ...data, currColorModal: "Secundária", needUpdateBtn: isFromDash && true});}}
                            />
                            <span className="mt-2 text-small text-center text-purple font-weight-bold">
                                {secondaryColorBr}
                            </span>
                        </div>
                    </div>
                    {showBackColorBtn()}
                </section>
                <section style={{display: (needHideCheckBox || isFromDash) ? "none" : "block" }}>
                    <p className="text-normal text-purple m-0">ou</p>
                    <CheckBoxForm text="Selecionar cores acima e editar depois." setIsBoxChecked={setIsBoxChecked} />
                </section>
                <section
                    id="status"
                    className="animated bounce font-weight-bold text-small text-center text-purple"
                    style={{ display: "none", animationIterationCount: 2 }}
                >
                    Aplicando nova cor ao app...
                </section>
            </Card>
        </section>
    );

    const showCondition = isFromDash ? true : step === 2;
    return (
        showCondition &&
        <div>
            {isFromDash ? (
                <p className="text-normal text-purple text-center">
                    • Escolha aqui outras cores para o app:
                </p>
            ) : (
                <p className="text-normal text-white text-shadow text-center">
                    • Escolha as cores do app:
                </p>
            )}
            {showThemingArea()}
            {isFromDash && (
                <ShowActionBtns
                    needUpdateBtn={needUpdateBtn}
                    objToSend={{
                        "clientAdminData.selfThemePColor": translateColorToEng(primaryColorBr),
                        "clientAdminData.selfThemeSColor": translateColorToEng(secondaryColorBr),
                        "clientAdminData.selfThemeBackColor": translateColorToEng(backColorBr),
                    }}
                    titleBeforeOk="Salvando nova palheta de cores..."
                    titleAfterOk="Palheta de cores salva."
                />
            )}
            <ModalFullContent
                contentComp={<ColorPicker
                    notIncludeColorPrimary={primaryColorBr}
                    notIncludeColorSecondary={secondaryColorBr}
                    whichColorModal={currColorModal}
                    setData={setData}
                    data={data}
                    setFullOpen={setFullOpen}
                    theme={theme}
                    setTheme={setTheme}
                    isFromDash={isFromDash}
                />}
                fullOpen={fullOpen}
                setFullOpen={setFullOpen}
                animatedClass="none"
            />
        </div>
    );
}

const ColorPicker = ({
    notIncludeColorPrimary,
    notIncludeColorSecondary,
    whichColorModal,
    setData,
    data,
    setFullOpen,
    theme,
    setTheme,
    isFromDash, }) => {

    const isPrimary = whichColorModal === "Principal";
    const isBackground = whichColorModal === "de Fundo";
    const dontNeedShowColor = loopColor => {
        if(isBackground) {
            let colorArray;
            "pretobranco".includes(notIncludeColorPrimary) ? colorArray = ["branco", "preto"] : colorArray = ["branco", "preto", notIncludeColorPrimary];
            return !gotArrayThisItem(colorArray, loopColor);
        } else {
            return Boolean(loopColor === notIncludeColorPrimary || loopColor === notIncludeColorSecondary);
        }
    }

    const showTitle = () => (
        <div className="my-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                &#187; Seleção de Cores
                <br />
                <br />
                Escolha a Cor {whichColorModal}
            </p>
        </div>
    );


    return(
        <div>
            {showTitle()}
            <section className="mx-3">
                <div className="container-center">
                    {uiColors.map(eachColor => (
                        <div key={eachColor.id} style={{display: (dontNeedShowColor(eachColor.ptColorName) || eachColor.isDefault) ? "none" : "block"}}>
                            <div
                                className="d-flex container-center-col m-3"
                            >
                                <RadiusColorBtn
                                    selectedColor={eachColor.hexValue}
                                    padding="5px"
                                    name={eachColor.ptColorName}
                                    value={eachColor.hexValue}
                                    onClick={e => {
                                        const brColorName = e.currentTarget.name;
                                        const colorName = translateColorToEng(e.currentTarget.name);
                                        const hexValue = e.currentTarget.value;

                                        setFullOpen(false);

                                        if(isPrimary) {
                                            setData({ ...data, primaryColorBr: brColorName , hexValuePrimary: hexValue });
                                            !isFromDash && setTheme({...theme, colorP: colorName })
                                        } else if(isBackground) {
                                            setData({ ...data, backColorBr: brColorName, hexBackValue: hexValue });
                                            !isFromDash && setTheme({...theme, colorBack: colorName })
                                        } else {
                                            setData({ ...data, secondaryColorBr: brColorName, hexValueSecondary: hexValue });
                                            !isFromDash && setTheme({...theme, colorS: colorName })
                                        }
                                    }}
                                    size="65px"
                                />
                                <span className="text-center text-purple font-weight-bold">
                                    {eachColor.ptColorName}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}