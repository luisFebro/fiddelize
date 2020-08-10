import React, { useState, Fragment } from 'react';
import getQueryByName from '../../utils/string/getQueryByName';
import { Link } from 'react-router-dom';
import ButtonMulti, {faStyle} from '../../components/buttons/material-ui/ButtonMulti';
import { CLIENT_URL } from '../../config/clientUrl';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@material-ui/core/TextField';
import handleChange from '../../utils/form/use-state/handleChange';
import { handleEnterPress } from '../../utils/event/isKeyPressed';
import addSpacingPlusToQuery from '../../utils/string/addSpacingPlusToQuery';
import scrollIntoView from '../../utils/document/scrollIntoView';
import getFirstName from '../../utils/string/getFirstName';
import ShareSocialMediaButtons from '../../components/buttons/ShareSocialMediaButtons';
import parse from 'html-react-parser';
import Card from '@material-ui/core/Card';
import RadiusBtn from '../../components/buttons/RadiusBtn';
import { handleFocus } from '../../utils/form/handleFocus';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import { useStoreDispatch } from 'easy-peasy';
import copyTextToClipboard from '../../utils/document/copyTextToClipboard';
import { showSnackbar } from '../../redux/actions/snackbarActions';


const addSpace = str => addSpacingPlusToQuery(str);

const isSmall = window.Helper.isSmallScreen();
const fluidTextAlign = `${isSmall ? "ml-2 text-left" : "text-center"}`;

export default function AppSharer({ location, match }) {
    const [showLink, setShowLink] = useState(false);
    const [data, setData] = useState({
        clientName: '',
        openSharingAreaTo: '',
        generatedLink: '',
    })
    const {
        clientName,
        openSharingAreaTo,
        generatedLink,
    } = data;

    const dispatch = useStoreDispatch();

    const role = getQueryByName("role", location.search);
    const bizCodeName = match.params.bizCodeName;
    const bizName = getQueryByName("negocio", location.search);
    const cliAdminName = getQueryByName("adminName", location.search);
    const bizId = getQueryByName("id", location.search);

    const indLastSlash = bizCodeName.lastIndexOf("-");
    const onlyBizCode = bizCodeName.slice(indLastSlash + 1);

    const styles = {
        form: {
            maxWidth: isSmall ? '' : '350px',
            width: '100%',
            background: 'var(--themeSDark)',
            borderRadius: '10px',
            padding: '25px'
        },
        fieldFormValue: {
            backgroundColor: 'var(--mainWhite)',
            zIndex: 2000,
            color: 'var(--themeP)',
            font: 'normal 26px Poppins, sans-serif',
            paddingLeft: 5,
        },
        fieldLink: {
            font: 'normal 20px Poppins, sans-serif',
            color: 'var(--mainPurple)',
            textAlign: 'center',
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
            top: '-20%',
            transform: 'translateX(-70%)',
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
                />
            </Link>
        </div>
    );

    const showHeader = () => (
        <header className={`${fluidTextAlign} container-center-col`}>
            <p className="text-hero text-center">
                {!isSmall
                ? <span>Compartilhe ou baixe<br />seu App onde estiver</span>
                : <span>Comparti-<br />lhe ou baixe seu App onde estiver</span>}
            </p>
        </header>
    );

    const handleGeneratedLink = (targetBr) => {

        let link;
        if(targetBr === "cliente-admin") {
            link = `${CLIENT_URL}/baixe-app/${getFirstName(cliAdminName)}?negocio=${bizName && addSpace(bizName.cap())}&id=${bizId}&admin=1&painel=1`;
            setData({...data, generatedLink: link, openSharingAreaTo: 'cliente-admin' })
        } else {
            clientName
            ? link = `${CLIENT_URL}/app/${getFirstName(clientName.toLowerCase())}_${onlyBizCode}`
            : link = `${CLIENT_URL}/app/${onlyBizCode}`

            setData({...data, clientName: clientName.cap() ,openSharingAreaTo: 'cliente-usuário', generatedLink: link })
        }
    }

    const showBlob = () => (
        <div className="position-absolute animated slideIn" style={{left: '-200px', top: '-200px'}}>
            <img style={{zIndex: -1000}} width={300} height={300} src={`${CLIENT_URL}/img/shapes/blob-sharing-page.svg`} alt="blob página de compartilhar"/>
        </div>
    );

    const showButtonAction = (targetBr) => {

        return(
            <div className="container-center mt-4">
                <ButtonMulti
                    title={"Gerar link"}
                    needParse={true}
                    onClick={() => { handleGeneratedLink(targetBr); scrollIntoView(`#${targetBr}`, { delay: 1000 }); }}
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeP)"
                    iconFontAwesome={<FontAwesomeIcon icon="angle-double-right" style={faStyle} />}
                />
            </div>
        );
    }

    const showCliAdminArea = () => (
        <section className="my-5">
            <div className="text-title text-white text-center">
                Use seu App Admin
                <br />
                em outros aparelhos
            </div>
            <section className="container-center mt-4 mx-2 position-relative">
                <div className="shadow-elevation margin-auto-90" style={styles.form}>
                    <ImportantDevicesIcon
                        style={{fontSize: '70px', color: 'var(--mainWhite)', filter:  'drop-shadow(.5px .5px 1.5px black)',}}
                    />
                    {showButtonAction("cliente-admin")}
                </div>
            </section>
            {showSharingBtns("cliente-admin")}
        </section>
    );

    const showCliUserArea = () => (
        <section className="my-5">
            <p className="text-title text-white text-center">
                Divulgue para <br /> seus clientes.
            </p>
            <section className="container-center mx-2 mt-4">
                <form className="shadow-elevation margin-auto-90" style={styles.form}>
                    <div className={`animated zoomIn fast position-relative margin-auto-90 text-white`}>
                        <p className="text-shadow text-normal font-weight-bold">
                            {role === "cliente-admin"
                            ? (
                                <span>Insira aqui o nome do seu cliente para divulgar</span>
                            ) : (
                                <span>Insira o nome de alguém para divulgar</span>
                            )}
                        </p>
                        <div className="position-relative">
                            <TextField
                                id="form1"
                                onChange={handleChange(setData, data)}
                                name="clientName"
                                onKeyPress={e => { handleEnterPress(e, handleGeneratedLink); scrollIntoView("#cliente-usuário", { delay: 2000 }); }}
                                value={clientName}
                                variant="outlined"
                                type="text"
                                InputProps={{
                                    style: styles.fieldFormValue, // alignText is not working here... tried input types and variations
                                }}
                                helperText="ou deixe em branco se for enviar para um grupo, sem especificar nome."
                                FormHelperTextProps={{ style: styles.helperFromField }}
                            />
                            <div style={styles.megaPhoneIcon} className="position-absolute">
                                <img
                                    src={`${CLIENT_URL}/img/icons/megaphone.svg`}
                                    className="svg-elevation"
                                    width={85}
                                    height="auto"
                                    alt="megafone"
                                />
                            </div>
                        </div>
                    </div>
                    {showButtonAction()}
                </form>
            </section>
            {showSharingBtns("cliente-usuário")}
        </section>
    );

    const showSharingBtns = (targetBr) => {
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
            <section className="user-select-text">
                <div className="container-center justify-content-around my-3">
                    <RadiusBtn
                        title={showLink ? "esconder link" : 'ver link'}
                        backgroundColor="var(--mainDark)"
                        size="small"
                        onClick={() => setShowLink(!showLink)}
                    />
                    <RadiusBtn
                        title="copiar link"
                        backgroundColor="var(--mainDark)"
                        size="small"
                        onClick={() => copyTextToClipboard("#linkArea", () => showSnackbar(dispatch, "Link copiado!", "success"))}
                    />
                </div>
                {showLink
                ? (
                    <section>
                        <div className="animated zoomIn faster">
                            <TextField
                                id="linkArea"
                                type="text"
                                InputProps={{
                                    style: styles.fieldLink,
                                }}
                                name="generatedLink"
                                value={generatedLink}
                                variant="outlined"
                                autoComplete="off"
                                multiline
                                rows={4}
                                fullWidth
                            />
                        </div>
                        {targetBr === "cliente-admin" && (
                            <p className="mt-3 font-weight-bold text-purple text-small text-left">
                                Abra o link no dispositivo
                                <br />
                                que você quer baixar.
                            </p>
                        )}
                    </section>
                ) : null}
            </section>
        );

        return(
            openSharingAreaTo === targetBr && (
                <section className="my-5">
                    <p id={targetBr} className="my-4 animated zoomIn text-center text-white text-title">
                        Novo Link gerado e pronto!
                    </p>
                    <section className="container-center mx-2">
                        <Card style={{maxWidth: 350, width: '100%', backgroundColor: 'var(--mainWhite)'}} className="align-self-center animated zoomIn delay-2s fast card-elevation p-4">
                            <p className="text-center text-normal font-weight-bold">
                                {targetBr === "cliente-admin" ? "Baixe app via:" : "Escolha meio de divulgação:"}
                            </p>
                            <ShareSocialMediaButtons
                                config={{size: 50, radius: 50}}
                                data={sharingData}
                            />
                            {displayLink()}
                        </Card>
                    </section>
                    {targetBr !== "cliente-admin" && (
                        <div className="mt-4 container-center">
                            <RadiusBtn
                                title="gerar novo link"
                                backgroundColor="var(--themeSDark)"
                                className="my-2"
                                onClick={() => { setData({ ...data, openSharingAreaTo: '', clientName: '' }); handleFocus("form1") }}
                            />
                        </div>
                    )}
                    {targetBr !== "cliente-admin" && (
                        <div className="mt-5 text-center text-normal font-weight-bold">
                            {clientName && (
                                <span>
                                    O link gerado possui uma página personalizada feita para {clientName && clientName.cap()}
                                </span>
                            )}
                        </div>
                    )}
                </section>
            )
        );
    }

    return (
        <div className="text-white text-center text-title">
            {showBackBtn()}
            {showHeader()}
            <section className="container-center justify-content-around align-items-start">
                {showCliAdminArea()}
                {showCliUserArea()}
            </section>
            <img width="100%" height="auto" style={{overflow: 'hidden'}} src={`${CLIENT_URL}/img/shapes/wave1.svg`} alt="onda"/>
        </div>
    );
}

/*ARCHIVES
// const pickTargetBr = (currRole, target) => {
//     const cliAdmin = "cliente-admin";
//     const staff = "colaborador";
//     const cliUser = "cliente-usuário";

//     if(currRole === cliAdmin) {
//         if(target === cliAdmin) {
//             setData({...data, target: cliAdmin })
//             return cliAdmin;
//         } else {
//             setData({...data, target: staff })
//             return staff;
//         }
//     } else {
//         setData({...data, target: cliUser })
//     }
//         return cliUser;
// }
*/