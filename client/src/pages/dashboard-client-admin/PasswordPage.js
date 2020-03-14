import React, { useState } from 'react';
import getQueryByName from '../../utils/string/getQueryByName';
import ToggleVisibilityPassword from '../../components/forms/fields/ToggleVisibilityPassword';
import handleChange from '../../utils/form/use-state/handleChange';
import { CLIENT_URL } from '../../config/clientUrl';
import ButtonMulti, { stylesFA } from '../../components/buttons/material-ui/ButtonMulti';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateUser } from '../../redux/actions/userActions';
import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../redux/actions/snackbarActions';
import { withRouter } from 'react-router-dom';

const isSmall = window.Helper.isSmallScreen();

export default function PasswordPage({ location, match, history }) {
    const [error, setError] = useState("");
    const [data, setData] = useState({
        clientAdminData: { verificationPass: '' },
    })
    const { clientAdminData } = data;

    const dispatch = useStoreDispatch();

    const clientAdminId = getQueryByName("id", location.search);
    const clientAdminName = getQueryByName("name", location.search).cap();
    const bizCodeName = match.params.bizCodeName;

    const styles = {
        form: {
            maxWidth: '350px',
            background: 'var(--themeSDark)',
            borderRadius: '10px',
            padding: '25px'
        },
        fieldFormValue: {
            backgroundColor: 'var(--mainWhite)',
            color: 'var(--themeP)',
            fontSize: '2.1em',
            fontFamily: 'var(--mainFont)',
            // textAlign: 'center', it does not works
            fontSize: '26px',
            padding: '10px 14px',
            zIndex: 2000
        },
        lockIcon: {
            top: isSmall ? '110px' : '120px',
            left: '-70px',
            zIndex: 3000,
        },
    }


    const sendDataBackend = () => {
        if(!clientAdminData.verificationPass) { setError(true); showSnackbar(dispatch, "Você precisa inserir a senha de verificação", "error"); return; }

        const dataToSend = {
            "clientAdminData.verificationPass": clientAdminData.verificationPass,
        };

        updateUser(dispatch, dataToSend, clientAdminId)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error');
            showSnackbar(dispatch, "Preparando seu painel...")
            setTimeout(() => history.push(`/${bizCodeName}/cliente-admin/painel-de-controle`), 1500);
        })
    }

    const showButtonAction = () => (
        <div className="container-center" style={{marginTop: '20px'}}>
            <ButtonMulti
                title="Salvar e acessar<br />seu painel de controle"
                needParse={true}
                onClick={() => {
                    sendDataBackend();
                }}
                color="var(--mainWhite)"
                backgroundColor="var(--themeP)"
                backColorOnHover="var(--themeP)"
                iconFontAwesome={<FontAwesomeIcon icon="save" style={stylesFA} />}
                textTransform='uppercase'
            />
        </div>
    );

    const showVerificationPassField = () => (
        <div style={{bottom: isSmall ? '-50px' : '-300px'}} className="mt-4 position-relative">
            <form className="shadow-elevation margin-auto-90" onBlur={() => setError("")} style={styles.form}>
                <div className={`animated zoomIn fast position-relative mt-4 margin-auto-90 text-white text-normal font-weight-bold`}>
                    <div style={styles.lockIcon} className="position-absolute">
                        <img
                            src={`${CLIENT_URL}/img/icons/lock.svg`}
                            className="svg-elevation"
                            width={90}
                            height="auto"
                            alt="cadeado"
                        />
                    </div>
                    <p>
                        {clientAdminName && clientAdminName.cap()},
                        <br />
                        Insira sua senha de verificação
                    </p>
                    <ToggleVisibilityPassword
                        showGeneratePass={true}
                        generatePassObj={{
                            setObj: setData,
                            obj: data,
                        }}
                        style={styles.fieldFormValue}
                        onChange={handleChange(setData, data, true)}
                        label=" "
                        name="clientAdminData.verificationPass"
                        value={clientAdminData.verificationPass}
                    />
                </div>
                {showButtonAction()}
            </form>
        </div>
    );

    return (
        <div className="text-white">
            {showVerificationPassField()}
            <img width="100%" height="auto" style={{overflow: 'hidden'}} src={`${CLIENT_URL}/img/shapes/wave1.svg`} alt="onda"/>
        </div>
    );
}