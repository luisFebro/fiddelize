import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { useStoreDispatch } from "easy-peasy";
import { updateUser } from "../../../../../redux/actions/userActions";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import ButtonMulti, {
    faStyle,
} from "../../../../../components/buttons/material-ui/ButtonMulti";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
import handleChange from "../../../../../utils/form/use-state/handleChange";
import { useBizData } from "init";
import { useAppSystem } from "../../../../../hooks/useRoleData";
import { regulationText as generatedRegTxt } from "../../../regulationText";
import RadiusBtn from "../../../../../components/buttons/RadiusBtn";
import { handleEnterPress } from "../../../../../utils/event/isKeyPressed";

const isSmall = window.Helper.isSmallScreen();

let temp = "";

// NEXT UPDATE: using debouncing and throttling technique to save in real time without any further action like currently as clicking outside the box.
function RegulationText({ generateRegulation }) {
    const { rewardDeadline, regulation, bizLinkName } = useBizData();

    const [msgStatus, setMsgStatus] = useState("atualizado.");
    const [disabledBtn, setDisabledBtn] = useState(false);
    const [showDeadline, setShowDeadline] = useState(false);
    const [data, setData] = useState({
        regulationText: "",
        deadline: rewardDeadline,
    });
    const { regulationText, deadline } = data;

    const { businessId } = useAppSystem();

    const init = (regulation) => {
        setData({ ...data, regulationText: regulation && regulation.text });
    };

    useEffect(() => {
        init(regulation);
    }, [regulation]);

    useEffect(() => {
        if (generateRegulation) {
            temp = regulationText;
            setData({ ...data, regulationText: generatedRegTxt });
        }
        if (generateRegulation === false) {
            setData({ ...data, regulationText: temp });
        }
    }, [generateRegulation]);

    // const userName = currentUser && currentUser.name.cap();
    // const bizName = clientAdmin && clientAdmin.bizName.cap();
    // const mainReward = clientAdmin && clientAdmin.mainReward.cap();
    // const targetPoints = clientAdmin && clientAdmin.targetPoints;
    // const levelScore = clientAdmin && clientAdmin.targetPoints / 5;

    // const variablesObj = {
    //     "nome-empresa": bizName,
    //     "nome-cliente": userName,
    //     "nome-premio": mainReward,
    //     "ponto-premio": `${targetPoints} pontos`,
    //     "ponto-nivel": `${levelScore} pontos`,
    // }

    const styles = {
        form: {
            width: "100%",
            background: "var(--themeSDark)",
            borderRadius: "10px",
            padding: isSmall ? "25px 5px" : "25px",
        },
        shortFieldFormValue: {
            width: "90px",
            backgroundColor: "var(--mainWhite)",
            color: "var(--themeP)",
            font: "bold 35px var(--mainFont)",
            zIndex: 2000,
        },
        fieldFormValue: {
            backgroundColor: "var(--mainWhite)",
            color: "var(--themeP)",
            fontSize: "20px",
            fontFamily: "var(--mainFont)",
            zIndex: 2000,
        },
        helperFromField: {
            color: "var(--mainWhite)",
            fontFamily: "Poppins, sans-serif",
            fontSize: isSmall ? ".8em" : ".6em",
            textShadow: "1px 1px 3px black",
        },
    };

    const dispatch = useStoreDispatch();

    const updateField = (fieldName) => {
        if (Number(deadline) < 0 || isNaN(deadline))
            return showSnackbar(
                dispatch,
                "Valor Inválido. Insira apenas números positivos",
                "error"
            );
        if (Number(deadline) > 365)
            return showSnackbar(
                dispatch,
                "Prazo máximo é de até 365 dias.",
                "error"
            );

        showSnackbar(dispatch, "Atualizando...");
        if (fieldName === "deadline") {
            const objToSend = {
                "clientAdminData.rewardDeadline": deadline,
            };
            updateUser(dispatch, objToSend, businessId).then((res) => {
                if (res.status !== 200)
                    return showSnackbar(dispatch, res.data.msg, "error");
                showSnackbar(dispatch, "O prazo foi atualizado!", "success");
            });
        }
    };

    const updateRegText = (onlyChangeStatus) => {
        if (onlyChangeStatus) {
            setMsgStatus("salvando...");
            setDisabledBtn(true);
        } else {
            const objToSend = {
                "clientAdminData.regulation.text": regulationText,
                "clientAdminData.regulation.updatedAt": new Date(),
            };
            updateUser(dispatch, objToSend, businessId).then((res) => {
                if (res.status !== 200)
                    return showSnackbar(dispatch, res.data.msg, "error");
                setMsgStatus("salvo");
                setDisabledBtn(false);
                const updatedText = res.data.clientAdminData.regulation.text;
                setData({ ...data, regulationText: updatedText });
            });
        }
    };

    const showActionBtn = () => (
        <section className="d-flex justify-content-center mt-3">
            {disabledBtn && (
                <p className="animated zoomIn text-normal text-center mt-2">
                    Clique em qualquer lugar
                    <br />
                    fora da caixa para salvar.
                </p>
            )}
            <Link
                className={`${disabledBtn && "disabledLink"} no-outline`}
                to={`/regulamento?cliAdmin=1&bizLinkName=${bizLinkName}`}
            >
                <ButtonMulti
                    disabled={!!disabledBtn}
                    onClick={updateRegText}
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeP)"
                    backColorOnHover="var(--themeP)"
                    iconFontAwesome={
                        <FontAwesomeIcon icon="file-alt" style={faStyle} />
                    }
                    textTransform="uppercase"
                >
                    {disabledBtn ? "Aguardando..." : "Ver Resultado App"}
                </ButtonMulti>
            </Link>
        </section>
    );

    // const handleChangeVariables = () => {
    //     const newText = replaceVariablesInTxt(regulationText, variablesObj, {needBold: true, needMainPattern: false});
    //     setData({ regulationText: newText })
    // };

    const showPrizeDeadlineArea = () =>
        showDeadline && (
            <section className="container-center animated zoomIn">
                <div className="relative mb-3">
                    <p className="text-shadow text-center text-normal text-white">
                        Edite prazo de validade
                        <br />
                        do prêmio após cliente bater meta.
                        <br />
                        Use ##prazo-premio para inserir no regulamento.
                    </p>
                    <div className="container-center position-relative">
                        <TextField
                            InputProps={{ style: styles.shortFieldFormValue }}
                            // helperText=""
                            // FormHelperTextProps={{ style: styles.helperFromField }}
                            variant="outlined"
                            onChange={handleChange(setData, data)}
                            onKeyPress={(e) =>
                                handleEnterPress(e, () =>
                                    updateField("deadline")
                                )
                            }
                            autoComplete="off"
                            type="number"
                            name="deadline"
                            value={deadline}
                        />
                        <p className="ml-5 position-relative text-shadow text-title text-white">
                            DIAS
                        </p>
                        <div
                            className="mr-4 position-absolute"
                            style={{ bottom: "-10px", right: "60px" }}
                        >
                            <RadiusBtn
                                size="small"
                                title="mudar"
                                backgroundColor="var(--themeP)"
                                needTxtShadow
                                onClick={() => updateField("deadline")}
                            />
                        </div>
                    </div>
                </div>
            </section>
        );

    const showTextForm = () => (
        <form className="shadow-elevation" style={styles.form}>
            <p className="text-center text-shadow text-white text-subtitle font-weight-bold">
                Regulamento de Pontos
            </p>
            {!showDeadline && (
                <div className="my-4 container-center">
                    <ButtonFab
                        title="Editar Prazo Prêmio"
                        position="relative"
                        variant="extended"
                        color="var(--mainWhite)"
                        fontSize="18px"
                        size="small"
                        backgroundColor="var(--mainPurple)"
                        onClick={() => setShowDeadline(true)}
                    />
                </div>
            )}
            {showPrizeDeadlineArea()}
            <TextField
                multiline
                rows={15}
                name="regulationText"
                InputProps={{
                    style: styles.fieldFormValue,
                }}
                value={regulationText === "" ? "..." : regulationText}
                onChange={(e) => {
                    handleChange(setData, data)(e);
                    updateRegText(true);
                }}
                onBlur={() => updateRegText(false)}
                variant="outlined"
                fullWidth
            />
            <div
                className="position-relative text-white text-shadow text-nowrap pl-1"
                style={{ top: "10px" }}
            >
                <span className="font-weight-bold">Status: {msgStatus}</span>{" "}
                {msgStatus === "salvo" && (
                    <FontAwesomeIcon
                        className="animated rubberBand"
                        icon="check-circle"
                        style={{
                            marginLeft: "5px",
                            animationIterationCount: 2,
                            filter: "drop-shadow(.5px .5px 1.5px black)",
                        }}
                    />
                )}
            </div>
        </form>
    );

    return (
        <section className="text-normal">
            {showTextForm()}
            {showActionBtn()}
        </section>
    );
}

export default React.memo(RegulationText);
