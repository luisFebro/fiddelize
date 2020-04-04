import React, { useState } from 'react';
import getQueryByName from '../../utils/string/getQueryByName';
import { Link } from 'react-router-dom';
import ButtonMulti, {faStyle} from '../../components/buttons/material-ui/ButtonMulti';
import { CLIENT_URL } from '../../config/clientUrl';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@material-ui/core/TextField';
import handleChange from '../../utils/form/use-state/handleChange';
import { handleEnterPress } from '../../utils/event/isKeyPressed';
import addSpacingPlusToQuery from '../../utils/string/addSpacingPlusToQuery';
import ShareSocialMediaButtons from '../../components/buttons/ShareSocialMediaButtons';
import parse from 'html-react-parser';
import Card from '@material-ui/core/Card';
import RadiusBtn from '../../components/buttons/RadiusBtn';
// import animateCSS from '../../utils/animateCSS';
import { handleFocus } from '../../utils/form/handleFocus';

const addSpace = str => addSpacingPlusToQuery(str);

const isSmall = window.Helper.isSmallScreen();
const fluidTextAlign = `${isSmall ? "ml-2 text-left" : "text-center"}`;

export default function AppSharer({ location, match }) {
    const [showLink, setShowLink] = useState(false);
    const [data, setData] = useState({
        clientName: '',
        isSharingBtnsOpen: false,
        generatedLink: '',
    })
    const { clientName, isSharingBtnsOpen, generatedLink } = data;

    const role = getQueryByName("role", location.search);
    const bizCodeName = match.params.bizCodeName;
    const bizName = getQueryByName("negocio", location.search);
    const bizId = getQueryByName("id", location.search);

    const styles = {
        form: {
            maxWidth: '350px',
            background: 'var(--themeSDark)',
            borderRadius: '10px',
            padding: '25px'
        },
        fieldFormValue: {
            backgroundColor: 'var(--mainWhite)',
            zIndex: 2000,
            color: 'var(--themeP)',
            font: 'normal 26px Poppins, sans-serif',
        },
        helperFromField: {
            color: 'white',
            backgroundColor: 'var(--themeSDark)',
            textShadow: '1px 1px 3px black',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '16px',
            margin: 0,
            padding: '10px 0',
            border: 0,
        },
        megaPhoneIcon: {
            top: isSmall ? '60px' : '105px',
            left: '-65px',
            zIndex: 3000,
        },
    }

    const showBackBtn = () => (
        <div className="mt-2 ml-5 d-flex align-self-start">
            <Link
                to={role !== "cliente-admin" ? "/mobile-app" : `/${bizCodeName}/cliente-admin/painel-de-controle`}
                className="text-decoration-none"
            >
                <ButtonMulti
                    title="Voltar"
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeSDark)"
                    backColorOnHover="var(--themeSDark)"
                    textTransform='uppercase'
                />
            </Link>
        </div>
    );

    const showHeader = () => (
        <header className={`${fluidTextAlign} container-center`}>
            <p className="text-hero text-center">
                {!isSmall
                ? <span>Compartilhe {role === "cliente-admin" ? "seu App" : "nosso App"}</span>
                : <span>Comparti-<br />lhe {role === "cliente-admin" ? "seu App" : "nosso App"}</span>}
            </p>
            <p>
                {role === "cliente-admin" ?
                (
                    <span>
                        Divulgue aqui<br />para seus clientes.
                    </span>
                ) : (
                    <span>
                        Passe para a galera.<br />Divulgue para amigos e familiares aqui.
                    </span>
                )}
            </p>
        </header>
    );

    const handleGeneratedLink = () => {
        let link;
        clientName
        ? link = `${CLIENT_URL}/baixe-app/${addSpace(clientName)}?negocio=${bizName && addSpace(bizName.cap())}&id=${bizId}&cliente=1`
        : link = `${CLIENT_URL}/baixe-app?negocio=${bizName && addSpace(bizName.cap())}&id=${bizId}&cliente=1`

        setData({...data, clientName: clientName.cap() ,isSharingBtnsOpen: true, generatedLink: link })
    }

    const showButtonAction = () => (
        <div className="container-center" style={{marginTop: '20px'}}>
            <ButtonMulti
                title="Gerar link"
                needParse={true}
                onClick={() => { handleGeneratedLink(); handleScrollIntoView("view1", 1000); }}
                color="var(--mainWhite)"
                backgroundColor="var(--themeP)"
                backColorOnHover="var(--themeP)"
                iconFontAwesome={<FontAwesomeIcon icon="angle-double-right" style={faStyle} />}
                textTransform='uppercase'
            />
        </div>
    );

    const handleScrollIntoView = (thisElem, delay = 0) => {
        // const elem = ;
        if(thisElem) {
            setTimeout(() => document.getElementById(thisElem).scrollIntoView(), delay);
        }
    }

    const showMain = () => (
        <div className="my-5">
            <form className="shadow-elevation margin-auto-90" style={styles.form}>
                <div className={`animated zoomIn fast position-relative mt-4 margin-auto-90 text-white`}>
                    <div style={styles.megaPhoneIcon} className="position-absolute">
                        <img
                            src={`${CLIENT_URL}/img/icons/megaphone.svg`}
                            className="svg-elevation"
                            width={85}
                            height="auto"
                            alt="megafone"
                        />
                    </div>
                    <p className="text-shadow text-normal font-weight-bold">
                        {role === "cliente-admin"
                        ? (
                            <span>Insira o nome do seu cliente para divulgar</span>
                        ) : (
                            <span>Insira o nome de alguém para divulgar</span>
                        )}
                    </p>
                    <TextField
                        id="form1"
                        style={styles.fieldFormValue}
                        onChange={handleChange(setData, data)}
                        name="clientName"
                        onKeyPress={e => { handleEnterPress(e, handleGeneratedLink); handleScrollIntoView("view1", 3000); }}
                        value={clientName}
                        variant="outlined"
                        type="text"
                        InputProps={{
                            style: styles.fieldFormValue, // alignText is not working here... tried input types and variations
                        }}
                        helperText="ou deixe em branco se for enviar para um grupo, sem especificar nome."
                        FormHelperTextProps={{ style: styles.helperFromField }}
                    />
                </div>
                {showButtonAction()}
            </form>
        </div>
    );

    const showBlob = () => (
        <div className="position-absolute animated slideIn" style={{left: '-200px', top: '-200px'}}>
            <img style={{zIndex: -1000}} width='200%' height={600} src={`${CLIENT_URL}/img/shapes/blob-sharing-page.svg`} alt="blob página de compartilhar"/>
        </div>
    );

    const showSharingBtns = () => {
        const sharingData = {
            titleShare: '',
            pageURL: generatedLink,
            pageImg: 'i.imgur.com/9GjtAiW',
            pageTitle: '',//`Ei, baixe o App de pontos de fidelidade`,
            // get pageDescription() {
            //     return `Baixe nosso App de pontos de fidelidade`;
            // }
        };
        const displayLink = () => (
            <div className="user-select-text">
                <RadiusBtn
                        title={showLink ? "esconder link" : 'mostrar link'}
                        backgroundColor="var(--mainDark)"
                        size="small"
                        onClick={() => { setShowLink(!showLink)}}
                />
                {showLink
                ? (
                    <p style={{margin: 0}} className="animated zoomIn faster text-break text-normal text-purple text-center">
                        {generatedLink}
                    </p>
                ) : null}
            </div>
        );

        return(
            isSharingBtnsOpen && (
                <div className="my-5">
                    <p className="animated zoomIn text-center text-white text-title">
                        Novo Link gerado e pronto!
                    </p>
                    <div className={`d-md-flex justify-content-md-center flex-md-column ${isSmall && "margin-auto-90"}`}>
                        <Card style={{maxWidth: '600px'}} className="align-self-center animated zoomIn delay-2s fast card-elevation p-4">
                            <p className="text-center text-normal font-weight-bold">Escolha um meio:</p>
                            <ShareSocialMediaButtons config={{size: 50, radius: 50}} data={sharingData} />
                            {displayLink()}
                        </Card>
                        <div id="view1" className={`mt-2`}>
                            <RadiusBtn
                                title="gerar novo link"
                                backgroundColor="var(--themeSDark)"
                                className="my-2"
                                onClick={() => { setData({ ...data, isSharingBtnsOpen: false, clientName: '' }); handleFocus("form1") }}
                            />
                        </div>
                    </div>

                    <div className="mt-5 text-center text-normal font-weight-bold">
                        {clientName && (
                            <span>
                                O link gerado possui uma página personalizada feita para o(a) {clientName && clientName.cap()}
                            </span>
                        )}
                    </div>
                </div>
            )
        );
    }

    return (
        <div className="text-white text-center text-title">
            {showBackBtn()}
            {showHeader()}
            {showMain()}
            {showSharingBtns()}
            <img width="100%" height="auto" style={{overflow: 'hidden'}} src={`${CLIENT_URL}/img/shapes/wave1.svg`} alt="onda"/>
        </div>
    );
}