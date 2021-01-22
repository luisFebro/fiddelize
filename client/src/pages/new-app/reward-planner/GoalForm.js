import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { CLIENT_URL } from "../../../config/clientUrl";
import handleChange from "../../../utils/form/use-state/handleChange";
import { handleNextField } from "../../../utils/form";
import ButtonMulti, {
    faStyle,
} from "../../../components/buttons/material-ui/ButtonMulti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import setValObjWithStr from "../../../utils/objects/setValObjWithStr";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import { withRouter } from "react-router-dom";
import useAnimateElem from "../../../hooks/scroll/useAnimateElem";
import { setMultiVar, getVar, store } from "../../../hooks/storage/useVar";

const isSmall = window.Helper.isSmallScreen();

const useStyles = makeStyles({
    // n1
    root: {
        display: "flex",
        justifyContent: "center",
    },
    outlinedInput: {
        padding: "2px 5px",
        margin: "0px",
    },
    outlinedInput2: {
        padding: "8px 5px 5px",
        margin: "0px",
    },
});

const styles = {
    form: {
        maxWidth: "350px",
        background: "var(--themeSDark)",
        borderRadius: "10px",
        padding: "25px",
    },
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "2.1em",
        padding: "0px 10px",
        maxWidth: "190px",
        zIndex: 2000,
    },
    formIcons: {
        top: -20,
        right: 35,
        zIndex: 3000,
        //animationIterationCount: 2,
    },
    giftBagIcon: {
        right: -30,
        top: -20,
        zIndex: 3000,
    },
    helperFromField: {
        color: "white",
        fontFamily: "Poppins, sans-serif",
        fontSize: isSmall ? ".8em" : ".6em",
        textShadow: "1px 1px 3px black",
    },
};

function GoalForm({ history, bizCodeName, bizName }) {
    const [error, setError] = useState("");
    const [data, setData] = useState({
        rewardScore: undefined,
        mainReward: "",
    });
    const { rewardScore, mainReward } = data;

    useAnimateElem(".goal-form--comp", {
        animaIn: "bounceInUp",
        speed: "normal",
    });

    const dispatch = useStoreDispatch();

    const classes = useStyles();

    const saveData = async () => {
        const score = rewardScore;
        const prize = mainReward;

        if (!score) {
            setError("rewardScore");
            return showSnackbar(
                dispatch,
                "Você precisa inserir o ponto de prêmio",
                "error"
            );
        }
        if (!prize) {
            setError("mainReward");
            return showSnackbar(
                dispatch,
                "Você precisa inserir uma descrição do prêmio",
                "error"
            );
        }

        const priorData = await getVar("clientAdminData", store.pre_register);
        const newData = {
            ...priorData,
            rewardScore: Number(rewardScore),
            mainReward,
        };
        await setMultiVar(
            [{ clientAdminData: newData }, { doneRewardPlanner: true }],
            store.pre_register
        );

        history.push(
            `/${bizCodeName}/novo-app/self-service?nome-cliente=Ana&negocio=${bizName}&ponto-premio=${score}&premio-desc=${prize}`
        );
    };

    const showButtonAction = () => (
        <div className="container-center" style={{ marginTop: "20px" }}>
            <ButtonMulti
                title="Continuar"
                onClick={saveData}
                color="var(--mainWhite)"
                backgroundColor="var(--themeP)"
                backColorOnHover="var(--themeP)"
                iconFontAwesome={
                    <FontAwesomeIcon icon="arrow-right" style={faStyle} />
                }
                textTransform="uppercase"
            />
        </div>
    );

    return (
        <div className="goal-form--comp container-center my-5 text-white">
            <form
                className="card-elevation margin-auto-90"
                onBlur={() => setError("")}
                style={styles.form}
            >
                <p className="text-title text-shadow text-nowrap text-center m-1 p-1">
                    Meta do App
                </p>
                <div className="position-relative margin-auto-90 text-normal font-weight-bold">
                    <p className="text-shadow">
                        Quanto é o seu ponto de prêmio?
                    </p>
                    <div className="position-relative">
                        <TextField
                            placeholder="0"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                            InputProps={{
                                style: styles.fieldFormValue, // alignText is not working here... tried input types and variations
                                classes: {
                                    input: classes.outlinedInput,
                                },
                            }}
                            type="number"
                            helperText={
                                "Lembre-se: é o ponto/R$ que o cliente precisa alcançar em compras"
                            }
                            FormHelperTextProps={{
                                style: styles.helperFromField,
                            }}
                            name="rewardScore"
                            value={rewardScore}
                            onChange={handleChange(setData, data)}
                            onKeyPress={(e) => {
                                handleNextField(e, "field1");
                            }}
                            onBlur={(e) =>
                                handleNextField(e, "field1", {
                                    event: "onBlur",
                                })
                            }
                            variant="outlined"
                            error={error === "rewardScore" ? true : false}
                            autoComplete="off"
                        />
                        <div
                            style={styles.formIcons}
                            className="position-absolute"
                        >
                            <img
                                src={`${CLIENT_URL}/img/icons/new-app/reward-planner/points.svg`}
                                className="svg-elevation"
                                width={70}
                                height="auto"
                                alt="pontos"
                            />
                        </div>
                    </div>
                </div>
                <div
                    id="field2"
                    className={`d-none animated slideInDown fast position-relative mt-4 margin-auto-90 text-white text-normal font-weight-bold`}
                >
                    <p className="text-shadow">
                        Qual é a descrição do prêmio simbólico?
                    </p>
                    <div className="position-relative">
                        <TextField
                            multiline
                            rows={2}
                            placeholder="digite aqui"
                            InputProps={{
                                style: {
                                    ...styles.fieldFormValue,
                                    fontSize: "26px",
                                    maxWidth: "280px",
                                }, // alignText is not working here... tried input types and variations
                                classes: {
                                    input: classes.outlinedInput2,
                                },
                                id: "value2",
                            }}
                            name="mainReward"
                            value={mainReward}
                            helperText={
                                "Lembre-se: um serviço, produto, benefício ou desconto."
                            }
                            FormHelperTextProps={{
                                style: styles.helperFromField,
                            }}
                            onChange={handleChange(setData, data)}
                            onBlur={() =>
                                setData({
                                    ...data,
                                    mainReward:
                                        mainReward &&
                                        mainReward.toLowerCase().trim(),
                                })
                            }
                            variant="outlined"
                            error={error === "mainReward" ? true : false}
                            autoComplete="off"
                        />
                        <div
                            style={styles.giftBagIcon}
                            className="position-absolute"
                        >
                            <img
                                src={`${CLIENT_URL}/img/icons/gift.svg`}
                                className="svg-elevation"
                                width={60}
                                height="auto"
                                alt="prêmio desc"
                            />
                        </div>
                    </div>
                </div>
                {mainReward && (
                    <p className="animated fadeInUp delay-2s mt-3 text-shadow text-white text-small">
                        Nota: Se precisar, você pode mudar esses dados depois no
                        seu painel de controle na sessão de app. 👍
                    </p>
                )}
                {rewardScore && showButtonAction()}
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
