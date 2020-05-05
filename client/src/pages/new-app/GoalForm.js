import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { CLIENT_URL } from '../../config/clientUrl';
import handleChange from '../../utils/form/use-state/handleChange';
import AOS from 'aos';
import { handleNextField } from '../../utils/form';
import ButtonMulti, { faStyle } from '../../components/buttons/material-ui/ButtonMulti';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import setValObjWithStr from '../../utils/objects/setValObjWithStr';
import { updateUser } from '../../redux/actions/userActions';
import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../redux/actions/snackbarActions';
import { withRouter } from 'react-router-dom';

const isSmall = window.Helper.isSmallScreen();

const useStyles = makeStyles({  // n1
    root: {
        display: 'flex',
        justifyContent: 'center',
    },
    outlinedInput: {
        padding: '2px 5px',
        margin: '0px',
    },
    outlinedInput2: {
        padding: '8px 5px 5px',
        margin: '0px',
    },
});

function GoalForm({
    history, bizId, bizName, bizCodeName, name }) {
    const [error, setError] = useState("");
    const [showThisField, setShowThisField] = useState(false);
    const [data, setData] = useState({
        clientAdminData: { rewardScore: undefined, mainReward: '' },
    })

    const { clientAdminData } = data;

    const dispatch = useStoreDispatch();

    AOS.init({
        offset: 150
    });

    const classes = useStyles();

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
            padding: '0px 10px',
            maxWidth: '190px',
            zIndex: 2000
        },
        formIcons: {
            top: isSmall ? '70px' : '90px',
            left: '160px',
            zIndex: 3000
            //animationIterationCount: 2,
        },
        giftBagIcon: {
            top: isSmall ? '60px' : '70px',
            left: isSmall ? '210px' : '240px',
            zIndex: 3000,
        },
        helperFromField: {
            color: 'white',
            fontFamily: 'Poppins, sans-serif',
            fontSize: isSmall ? '.8em' : '.6em',
        },
    }

    const handleNextFieldFunc = (type, e) => handleNextField(type, setShowThisField, {nextField: "field2", delay: 1500 })(e);

    const handleShowCurrField = field => {
        const field2 =  showThisField === "field2" &&  clientAdminData.rewardScore && clientAdminData.rewardScore.length >= 1 || showThisField === "field3" || showThisField === "field4" || showThisField === "otherFields";

        switch(field) {
            case "field2":
                return field2;

            default:
                console.log("something went wrong with handleShowCurrField...")
        }
    }

    const sendDataBackend = () => {
        const score = clientAdminData.rewardScore;
        const prize = clientAdminData.mainReward;
        if(!score) { setError("rewardScore"); showSnackbar(dispatch, "Você precisa inserir o ponto de prêmio", "error"); return; }
        if(!prize) { setError("mainReward"); showSnackbar(dispatch, "Você precisa inserir uma descrição do prêmio", "error"); return; }
        const dataToSend = {
            "clientAdminData.rewardScore": score,
            "clientAdminData.mainReward": prize,
        };

        updateUser(dispatch, dataToSend, bizId)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error');
            setTimeout(() => history.push(`/${bizCodeName}/novo-app/self-service/${bizId}?nome-cliente=${name}&negocio=${bizName}&ponto-premio=${score}`), 1500);
        })
    }

    const showButtonAction = () => (
        <div className="container-center" style={{marginTop: '20px'}}>
            <ButtonMulti
                title="Prosseguir"
                onClick={() => {
                    sendDataBackend();
                }}
                color="var(--mainWhite)"
                backgroundColor="var(--themeP)"
                backColorOnHover="var(--themeP)"
                iconFontAwesome={<FontAwesomeIcon icon="paper-plane" style={faStyle} />}
                textTransform='uppercase'
            />
        </div>
    );

    return (
        <div className="container-center my-5 text-white" data-aos="flip-left">
            <form className="card-elevation margin-auto-90" onBlur={() => setError("")} style={styles.form}>
                <p className="text-title text-nowrap text-center m-1 p-1">Meta do App</p>
                <div className="position-relative margin-auto-90 text-normal font-weight-bold">
                    <div style={styles.formIcons} className="position-absolute">
                        <img
                            src={`${CLIENT_URL}/img/icons/coins.svg`}
                            className="svg-elevation"
                            width={70}
                            height="auto"
                            alt="pontos"
                        />
                    </div>
                    <p>Qual é o ponto de prêmio?</p>
                    <TextField
                        placeholder="0"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                        InputProps={{
                            style: styles.fieldFormValue, // alignText is not working here... tried input types and variations
                            classes: {
                                input: classes.outlinedInput,
                            }
                        }}
                        type="number"
                        helperText={"Lembre-se: é o ponto/valor que o cliente precisa alcançar em compras"}
                        FormHelperTextProps={{ style: styles.helperFromField }}
                        name="clientAdminData.rewardScore"
                        value={clientAdminData.rewardScore}
                        onChange={handleChange(setData, data, true)}
                        onBlur={e => handleNextFieldFunc("onBlur", e)}
                        onKeyPress={e => handleNextFieldFunc("onKeyPress", e)}
                        variant="outlined"
                        error={error === "rewardScore" ? true : false}
                        autoComplete="off"
                    />
                </div>
                <div className={`animated slideInDown fast position-relative mt-4 margin-auto-90 text-white text-normal font-weight-bold ${handleShowCurrField("field2") ? "d-block" : "d-none"}`}>
                    <div style={styles.giftBagIcon} className="position-absolute">
                        <img
                            src={`${CLIENT_URL}/img/icons/gift.svg`}
                            className="svg-elevation"
                            width={60}
                            height="auto"
                            alt="prêmio desc"
                        />
                    </div>
                    <p>Qual é a descrição do prêmio?</p>
                    <TextField
                        id="field2"
                        multiline
                        rows={2}
                        placeholder="digite aqui"
                        InputProps={{
                            style: { ...styles.fieldFormValue, fontSize: '26px', maxWidth: '280px' }, // alignText is not working here... tried input types and variations
                            classes: {
                                input: classes.outlinedInput2,
                            }
                        }}
                        name="clientAdminData.mainReward"
                        value={clientAdminData.mainReward}
                        helperText={"Lembre-se: um serviço, produto, benefício ou desconto. Você vai poder modificar depois no seu painel de controle 👍"}
                        FormHelperTextProps={{ style: styles.helperFromField }}
                        onChange={handleChange(setData, data, true)}
                        onBlur={() => setValObjWithStr(data, "clientAdminData.mainReward", clientAdminData.mainReward.cap())}
                        variant="outlined"
                        error={error === "mainReward" ? true : false}
                        autoComplete="off"
                    />
                </div>
                {showButtonAction()}
            </form>
        </div>
    );
}

export default withRouter(GoalForm);

/* COMMENTS
n1:
Shorthand
The above code example can be condensed by using the same CSS API as the child component. In this example, the withStyles() higher-order component is injecting a classes property that is used by the Button component.

const StyledButton = withStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  label: {
    textTransform: 'capitalize',
  },
})(Button);
*/