import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import RadiusColorBtn from '../../../../components/buttons/RadiusColorBtn';
import Card from '@material-ui/core/Card';
import CheckBoxForm from '../../../../components/CheckBoxForm';
import { CLIENT_URL } from '../../../../config/clientUrl';
import ModalFullContent from '../../../../components/modals/ModalFullContent';
import { uiColors } from '../../../../global-data/uiColors';

PickTheming.propTypes = {
    step: PropTypes.number,
    setNextDisabled: PropTypes.func,
}
export default function PickTheming({ step, setNextDisabled }) {
    const [isBoxChecked, setIsBoxChecked] = useState(false);
    const [fullOpen, setFullOpen] = useState(false);
    const [data, setData] = useState({
        primaryColor: 'padrão',
        secondaryColor: 'padrão',
        hexValuePrimary: 'var(--themeP)',
        hexValueSecondary: 'var(--themeS)',
        currColorModal: '',
    })

    const {
        primaryColor,
        secondaryColor, currColorModal,
        hexValuePrimary, hexValueSecondary } = data;

    const needHideCheckBox = Boolean(primaryColor !== "padrão" || secondaryColor !== "padrão");

    const goNext = () => setNextDisabled(false);

    useEffect(() => {
        secondaryColor && goNext();
    }, [secondaryColor])

    useEffect(() => {
        if(isBoxChecked) {
            goNext();
        } else {
            setNextDisabled(true);
        }
    }, [isBoxChecked])

    const showThemingArea = () => (
        <section className="text-normal text-white margin-auto-90">
            <Card style={{minWidth: '330px', backgroundColor: 'var(--mainWhite)'}} className="p-2 text-purple text-center text-normal font-weight-bold animated zoomIn fast">
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
                <section className="container-center mt-3">
                    <div className="flex-column animated rubberBand delay-3s" style={{animationIterationCount: 2}}>
                        <p className="m-0 text-purple text-center text-normal font-weight-bold">Principal</p>
                        <div className="mt-2 d-flex container-center-col">
                            <RadiusColorBtn
                                selectedColor={hexValuePrimary}
                                onClick={() => {setFullOpen(!fullOpen); setData({ ...data, currColorModal: "Principal"});}}
                            />
                            <span className="mt-2 text-small text-center text-purple font-weight-bold">
                                {primaryColor}
                            </span>
                        </div>
                    </div>
                    <div className="flex-column animated rubberBand delay-5s ml-4" style={{animationIterationCount: 2}}>
                        <p className="m-0 text-purple text-center text-normal font-weight-bold">Secundária</p>
                        <div className="mt-2 d-flex container-center-col">
                            <RadiusColorBtn
                                selectedColor={hexValueSecondary}
                                onClick={() => {setFullOpen(!fullOpen); setData({ ...data, currColorModal: "Secundária"});}}
                            />
                            <span className="mt-2 text-small text-center text-purple font-weight-bold">
                                {secondaryColor}
                            </span>
                        </div>
                    </div>
                </section>
                <section style={{display: needHideCheckBox ? "none" : "block" }}>
                    <p className="text-normal text-purple m-0">ou</p>
                    <CheckBoxForm text="Selecionar cores acima e editar depois." setIsBoxChecked={setIsBoxChecked} />
                </section>
            </Card>
        </section>
    );

    return (
        step === 2 &&
        <div>
            <p className="text-normal text-white text-shadow text-center">
                • Escolha as cores do app:
            </p>
            {showThemingArea()}
            <ModalFullContent
                contentComp={<ColorPicker
                    notIncludeColorPrimary={primaryColor}
                    notIncludeColorSecondary={secondaryColor}
                    whichColorModal={currColorModal}
                    setData={setData}
                    data={data}
                    setFullOpen={setFullOpen}
                />}
                fullOpen={fullOpen}
                setFullOpen={setFullOpen}
            />
        </div>
    );
}

const ColorPicker = ({
    notIncludeColorPrimary,
    notIncludeColorSecondary,
    whichColorModal, setData, data, setFullOpen }) => {

    const isPrimary = whichColorModal === "Principal";
    const dontNeedShowColor = loopColor => Boolean(loopColor === notIncludeColorPrimary || loopColor === notIncludeColorSecondary);

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
                        <div key={eachColor.ptColorName} style={{display: dontNeedShowColor(eachColor.ptColorName) ? "none" : "block"}}>
                            <div
                                className="d-flex container-center-col m-3"
                            >
                                <RadiusColorBtn
                                    selectedColor={eachColor.hexValue}
                                    padding="5px"
                                    name={eachColor.ptColorName}
                                    value={eachColor.hexValue}
                                    onClick={e => {
                                        const ptColorName = e.currentTarget.name;
                                        const hexValue = e.currentTarget.value;

                                        if(isPrimary) {
                                            setData({ ...data, primaryColor: ptColorName , hexValuePrimary: hexValue });
                                        } else {
                                            setData({ ...data, secondaryColor: ptColorName, hexValueSecondary: hexValue });
                                        }
                                        setFullOpen(false);
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