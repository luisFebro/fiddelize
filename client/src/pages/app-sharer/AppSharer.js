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
// import Card from '@material-ui/core/Card';

const addSpace = str => addSpacingPlusToQuery(str);

const isSmall = window.Helper.isSmallScreen();
const fluidTextAlign = `${isSmall ? "ml-2 text-left" : "text-center"}`;

export default function AppSharer({ location, match }) {
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
            top: isSmall ? '70px' : '115px',
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
                ? <span>Compartilhe seu App</span>
                : <span>Comparti-<br />-lhe seu App</span>}
            </p>
            <br />
            <span>
                Divulgue aqui<br />para seus clientes ou contatos.
            </span>
        </header>
    );

    const handleGeneratedLink = (contactSharingLink = false) => {
        let link;
        clientName
        ? link = `${CLIENT_URL}/baixe-app/${addSpace(clientName)}?negocio=${bizName && addSpace(bizName.cap())}&id=${bizId}&cliente=1`
        : link = `${CLIENT_URL}/baixe-app?negocio=${bizName && addSpace(bizName.cap())}&id=${bizId}&cliente=1`

        if(contactSharingLink) {
            link = CLIENT_URL
        }

        setData({...data, clientName: clientName.cap() ,isSharingBtnsOpen: true, generatedLink: link })
    }

    const showButtonAction = () => (
        <div className="container-center" style={{marginTop: '20px'}}>
            <ButtonMulti
                title="Gerar link"
                needParse={true}
                onClick={() => handleGeneratedLink()}
                color="var(--mainWhite)"
                backgroundColor="var(--themeP)"
                backColorOnHover="var(--themeP)"
                iconFontAwesome={<FontAwesomeIcon icon="angle-double-right" style={faStyle} />}
                textTransform='uppercase'
            />
        </div>
    );

    const showMain = () => (
        <div className="my-5">
            <form className="shadow-elevation margin-auto-90" style={styles.form}>
                <div className={`animated zoomIn fast position-relative mt-4 margin-auto-90 text-white text-normal font-weight-bold`}>
                    <div style={styles.megaPhoneIcon} className="position-absolute">
                        <img
                            src={`${CLIENT_URL}/img/icons/megaphone.svg`}
                            className="svg-elevation"
                            width={85}
                            height="auto"
                            alt="megafone"
                        />
                    </div>
                    <p className="text-shadow text-normal">
                        Insira o nome do seu cliente para divulgar
                    </p>
                    <TextField
                        style={styles.fieldFormValue}
                        onChange={handleChange(setData, data)}
                        name="clientName"
                        onKeyPress={e => handleEnterPress(e, handleGeneratedLink)}
                        value={clientName}
                        variant="outlined"
                        type="text"
                        InputProps={{
                            style: styles.fieldFormValue, // alignText is not working here... tried input types and variations
                        }}
                        helperText="ou deixe em branco para enviar para um grupo, sem espeficar nome"
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

    return (
        <div className="text-white text-center text-title">
            {showBackBtn()}
            {showHeader()}
            {showMain()}
            <div style={{margin: '100px 0'}} className="text-break">
                {JSON.stringify(data)}
            </div>
        </div>
    );
}