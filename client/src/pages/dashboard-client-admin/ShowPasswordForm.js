import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import { useStoreDispatch } from 'easy-peasy';
import { CLIENT_URL } from '../../config/clientUrl';
import ToggleVisibilityPassword from '../../components/forms/fields/ToggleVisibilityPassword';
import handleChange from '../../utils/form/use-state/handleChange';
import ButtonMulti, { faStyle } from '../../components/buttons/material-ui/ButtonMulti';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showSnackbar } from '../../redux/actions/snackbarActions';
import { updateUser } from '../../redux/actions/userActions';
import { readVerificationPass } from '../../redux/actions/adminActions';
import setValObjWithStr from '../../utils/objects/setValObjWithStr';
import { regulationText } from './regulationText';
import { useAppSystem } from '../../hooks/useRoleData';
const isSmall = window.Helper.isSmallScreen();

export default function ShowPasswordForm({
    isFromCliAdminDash = false, dataFromPassPage = {}}) {
    const [error, setError] = useState("");
    const [data, setData] = useState({
        clientAdminData: { verificationPass: '' }, // We can simply declare clientAdminData.verificationPass in the sendDataToBackend obj
    })
    const { clientAdminData } = data;

    const { businessId } = useAppSystem();


    const history = dataFromPassPage.history;
    const clientAdminName = dataFromPassPage.clientAdminName;
    const bizCodeName = dataFromPassPage.bizCodeName;


    const dispatch = useStoreDispatch();

    useEffect(() => {
        if(isFromCliAdminDash) {
            readVerificationPass(businessId)
            .then(res => {
                if(res.status !== 200) return console.log("CODE ERROR: There is no businessId...")
                    const passValue = res.data.verificationPass;
                    const keyName = "clientAdminData.verificationPass";

                    setValObjWithStr(data, keyName, passValue);
                    const newObj = data;
                    setData(Object.assign({}, data, newObj));
            })
        }
    }, [businessId])

    AOS.init({
        offset: 50,
    });

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
            fontSize: '26px',
            fontFamily: 'var(--mainFont)',
            // textAlign: 'center', it does not works
            padding: '10px 14px',
            zIndex: 2000
        },
        lockIcon: {
            top: 0,
            left: '-70px',
            zIndex: 3000,
        },
    }

    const sendDataBackend = () => {
        if(!clientAdminData.verificationPass) { setError(true); showSnackbar(dispatch, "Você precisa inserir a senha de verificação", "error"); return; }
        let dataToSend;
        if(isFromCliAdminDash) {
            dataToSend = { "clientAdminData.verificationPass": clientAdminData.verificationPass, }
        } else {
            dataToSend = {
                "clientAdminData.verificationPass": clientAdminData.verificationPass,
                "clientAdminData.regulation.text": regulationText,
            };
        }

        showSnackbar(dispatch, "Ok, registrando...")
        updateUser(dispatch, dataToSend, businessId)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error');
            if(isFromCliAdminDash) {
                showSnackbar(dispatch, "Senha foi alterada!", "success")
            } else {
                showSnackbar(dispatch, "Preparando seu painel...")
                setTimeout(() => history.push(`/${bizCodeName}/cliente-admin/painel-de-controle`), 1500);
            }

        })
    }

    const showButtonAction = () => (
        <div className="container-center" style={{marginTop: '20px'}}>
            <ButtonMulti
                title={isFromCliAdminDash ? "Alterar senha" : "Salvar e acessar<br />seu painel de controle"}
                needParse={true}
                onClick={() => {
                    sendDataBackend();
                }}
                color="var(--mainWhite)"
                backgroundColor="var(--themeP)"
                backColorOnHover="var(--themeP)"
                iconFontAwesome={<FontAwesomeIcon icon="save" style={faStyle} />}
                textTransform='uppercase'
            />
        </div>
    );

    const handleBottomValues = () => {
        if(isFromCliAdminDash) {
            return "";
        } else {
            return isSmall
            ? '-50px'
            : '-300px'
        }
    };

    return (
        <div data-aos={!isFromCliAdminDash && "zoom-in-up"} style={{zIndex: 1000, bottom: handleBottomValues()}} className="mt-4 position-relative">
            <form className="shadow-elevation margin-auto-90" onBlur={() => setError("")} style={styles.form}>
                <div className={`animated zoomIn fast position-relative mt-4 margin-auto-90 text-white text-normal font-weight-bold`}>
                    <p className="text-shadow">
                        {isFromCliAdminDash
                        ? "Altere aqui sua senha sempre que precisar"
                        : "Insira aqui sua senha de verificação"}
                    </p>
                    <div className="position-relative" >
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
                        <div style={styles.lockIcon} className="position-absolute">
                            <img
                                src={`${CLIENT_URL}/img/icons/lock.svg`}
                                className="svg-elevation"
                                width={90}
                                height="auto"
                                alt="cadeado"
                            />
                        </div>
                    </div>
                </div>
                {showButtonAction()}
            </form>
        </div>
    );
}