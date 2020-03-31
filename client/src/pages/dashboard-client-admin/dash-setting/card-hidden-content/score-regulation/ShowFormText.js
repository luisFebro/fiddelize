import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { useStoreDispatch, useStoreState } from 'easy-peasy';
import { updateUser } from '../../../../../redux/actions/userActions';
import { showSnackbar } from '../../../../../redux/actions/snackbarActions';
import ButtonMulti, { faStyle } from '../../../../../components/buttons/material-ui/ButtonMulti';
import handleChange from '../../../../../utils/form/use-state/handleChange';
import replaceVariablesInTxt from '../../../../../utils/string/replaceVariablesInTxt';
const isSmall = window.Helper.isSmallScreen();

export default function RegulationText() {
    const [msgStatus, setMsgStatus] = useState("atualizado.")
    const [data, setData] = useState({ regulationText: '' })
    const { regulationText } = data;

    const { cliAdminId, regTxt, clientAdmin } = useStoreState(state => ({
        cliAdminId: state.userReducer.cases.currentUser._id,
        clientAdmin: state.userReducer.cases.clientAdmin.clientAdminData,
        // currentUser: state.userReducer.cases.currentUser,
        regTxt: state.userReducer.cases.clientAdmin.clientAdminData.regulation.text,
    }));

    const bizCodeName = clientAdmin && clientAdmin.bizCodeName;

    // const userName = currentUser && currentUser.name.cap();
    // const bizName = clientAdmin && clientAdmin.bizName.cap();
    // const mainReward = clientAdmin && clientAdmin.mainReward.cap();
    // const rewardScore = clientAdmin && clientAdmin.rewardScore;
    // const levelScore = clientAdmin && clientAdmin.rewardScore / 5;

    // const variablesObj = {
    //     "nome-empresa": bizName,
    //     "nome-cliente": userName,
    //     "nome-premio": mainReward,
    //     "ponto-premio": `${rewardScore} pontos`,
    //     "ponto-nivel": `${levelScore} pontos`,
    // }

    const styles = {
        form: {
            width: '100%',
            background: 'var(--themeSDark)',
            borderRadius: '10px',
            padding: isSmall ? '25px 5px' : '25px',
        },
        fieldFormValue: {
            backgroundColor: 'var(--mainWhite)',
            color: 'var(--themeP)',
            fontSize: '20px',
            fontFamily: 'var(--mainFont)',
            zIndex: 2000
        },
    }

    const dispatch = useStoreDispatch();


    const init = regTxt => {
        setData({ regulationText: regTxt });
    }

    useEffect(() => {
        init(regTxt);
    }, [regTxt])

    const updateRegText = () => {
        setMsgStatus("salvando...");
        // Testing
        setTimeout(() => setMsgStatus("salvo"), 3000);
        // end

        // const objToSend = { regulationText }
        // updateUser(dispatch, objToSend, cliAdminId)
        // .then(res => {
        //     if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
        //     setMsgStatus("salvo");
        // })
    }

    const showActionBtn = () => (
        <section className="d-flex justify-content-center mt-3">
            <Link to={`/regulamento?cliAdmin=1&bizCodeName=${bizCodeName}`}>
                <ButtonMulti
                    onClick={updateRegText}
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeP)"
                    backColorOnHover="var(--themeP)"
                    iconFontAwesome={<FontAwesomeIcon icon="file-alt" style={faStyle} />}
                    textTransform='uppercase'
                >
                    Ver Resultado
                </ButtonMulti>
            </Link>
        </section>
    );

    // const handleChangeVariables = () => {
    //     const newText = replaceVariablesInTxt(regulationText, variablesObj, {needBold: true, needMainPattern: false});
    //     setData({ regulationText: newText })
    // };

    const showTextForm = () => (
        <form className="shadow-elevation" style={styles.form}>
            <p className="text-center text-shadow text-white text-normal font-weight-bold">
                Regulamento de Pontos
            </p>
            <TextField
                multiline
                rows={15}
                name="regulationText"
                InputProps={{
                    style: styles.fieldFormValue,
                }}
                value={regulationText === "" ? "Carregando..." : regulationText}
                onChange={e => { handleChange(setData, data)(e); updateRegText(); }}
                variant="outlined"
                fullWidth
            />
            <div className="position-relative text-white text-shadow text-nowrap pl-1" style={{top: '10px'}}>
                <span className="font-weight-bold">Status: {msgStatus}</span>{" "}
                {msgStatus === "salvo" && (
                    <FontAwesomeIcon
                        className="animated rubberBand"
                        icon="check-circle"
                        style={{marginLeft: '5px', animationIterationCount: 2, filter:  'drop-shadow(.5px .5px 1.5px black)'}}
                    />
                )}
            </div>
        </form>
    )

    return (
        <section className="text-normal">
            {showTextForm()}
            {showActionBtn()}
        </section>
    );
}