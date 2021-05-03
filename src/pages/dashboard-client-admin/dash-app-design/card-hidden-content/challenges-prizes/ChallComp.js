import { useState, Fragment, useEffect } from "react";
import Card from "@material-ui/core/Card";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";
import EditButton from "../../../../../components/buttons/EditButton";
import handleChange from "../../../../../utils/form/use-state/handleChange";
import findAndReplaceObjInArray from "../../../../../utils/arrays/findAndReplaceObjInArray";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
import EditLevelIconModalBtn from "./EditLevelIconModalBtn";
import DeleteModalBtn from "./DeleteModalBtn";
import getId from "../../../../../utils/getId";

const truncate = (text, leng) => window.Helper.truncate(text, leng);

ChallComp.propTypes = {
    id: PropTypes.string,
    icon: PropTypes.string,
    targetPoints: PropTypes.number,
    rewardDesc: PropTypes.string,
    isFirst: PropTypes.bool,
    currChallNumber: PropTypes.number,
};

export default function ChallComp({
    id,
    icon,
    targetPoints,
    rewardDesc,
    isFirst,
    setNeedUpdateData,
    challengesArray,
    setChallengesArray,
    showToast,
    currChallNumber,
    milestoneIcon,
    updateThisUser,
}) {
    const [data, setData] = useState({
        currChallNumber,
        id,
        icon,
        targetPoints,
        rewardDesc,
    });

    const [edit, setEdit] = useState(false);
    const [saveChangeBtn, setSaveChangeBtn] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState("");
    useEffect(() => {
        if (selectedIcon) {
            setData({ ...data, icon: selectedIcon });
            setSaveChangeBtn(true);
        }
    }, [selectedIcon]);

    const txtStyle = "text-small text-white text-center m-0";
    const styles = {
        card: {
            backgroundColor: "var(--themeP)",
            borderRadius: "15px",
            padding: "15px",
            overflow: "visible",
        },
        actionBtns: {
            top: -45,
            right: -20,
        },
        levelIcon: {
            fontSize: 40,
            color: "#ff0",
            filter: "drop-shadow(0 0 40px #ffc)",
        },
        iconBanner: {
            width: 80,
            lineHeight: "18px",
            backgroundColor: "var(--mainWhite)",
            boxShadow: "inset 0 0 .3em #000",
        },
        fieldForm: {
            padding: "5px 10px",
            color: "var(--mainPurple)",
            backgroundColor: "var(--mainWhite)",
            font: "normal 1em Poppins, sans-serif",
        },
    };

    const handleDataChange = () => {
        showToast("Fazendo alterações...");
        const updatedArray = [
            {
                id: data.id,
                icon: isFirst ? milestoneIcon : data.icon,
                targetPoints: Number(data.targetPoints),
                rewardDesc: data.rewardDesc && data.rewardDesc.toLowerCase(),
            },
        ];
        const newArray = findAndReplaceObjInArray(
            challengesArray,
            updatedArray,
            "id"
        );
        setChallengesArray(newArray);
        setNeedUpdateData(getId());
        setTimeout(() => setEdit(false), 2000);
    };

    const showIcon = () => (
        <div
            className="container-center flex-row flex-md-column justify-content-start"
            style={{ flexBasis: "20%" }}
        >
            <p className={txtStyle}>
                {isFirst ? "Ícone Principal:" : "Ícone Desafio:"}
            </p>
            <FontAwesomeIcon
                className="ml-md-0 ml-3"
                icon={data.icon}
                style={styles.levelIcon}
            />
            {edit && (
                <Fragment>
                    {isFirst ? (
                        <p
                            className="ml-3 ml-md-0 mt-2 text-center animated zoomIn position-relative text-small text-purple"
                            style={styles.iconBanner}
                        >
                            Edite em design
                        </p>
                    ) : (
                        <div className="ml-3 ml-md-0 container-center animated zoomIn">
                            <EditLevelIconModalBtn
                                currChallNumber={data.currChallNumber}
                                currIcon={data.icon}
                                setSelectedIcon={setSelectedIcon}
                            />
                        </div>
                    )}
                </Fragment>
            )}
        </div>
    );

    const showtargetPoints = () => (
        <div
            className="container-center flex-row flex-md-column"
            style={{ flexBasis: "20%" }}
        >
            <p className={txtStyle}>Ponto-Prêmio:</p>
            {!edit ? (
                <p className="text-subtitle font-weight-bold text-center m-0 ml-md-0 ml-3">
                    {data.targetPoints}
                </p>
            ) : (
                <div className="animated zoomIn ml-md-0 ml-3">
                    <TextField
                        InputProps={{
                            style: { ...styles.fieldForm, width: "100px" },
                        }}
                        margin="dense"
                        type="tel"
                        onChange={(e) => {
                            handleChange(setData, data)(e);
                            setSaveChangeBtn(true);
                        }}
                        name="targetPoints"
                        value={data.targetPoints}
                        autoComplete="off"
                        fullWidth
                    />
                </div>
            )}
        </div>
    );

    const showPrizeDesc = () => (
        <div
            className="container-center flex-column align-self-center"
            style={{ flexBasis: "60%" }}
        >
            <p className={txtStyle}>Descrição Prêmio:</p>
            {!edit ? (
                <p className="text-left text-normal m-0">
                    {truncate(data.rewardDesc || " ", 29)}
                </p>
            ) : (
                <div className="animated zoomIn">
                    <TextField
                        InputProps={{
                            style: styles.fieldForm,
                        }}
                        margin="dense"
                        type="text"
                        onChange={(e) => {
                            handleChange(setData, data)(e);
                            setSaveChangeBtn(true);
                        }}
                        name="rewardDesc"
                        value={data.rewardDesc}
                        autoComplete="off"
                        multiline
                        rows="2"
                        fullWidth
                    />
                </div>
            )}
        </div>
    );

    const showActionBtns = () => (
        <section
            className="d-flex justify-content-around"
            style={{ width: "120px" }}
        >
            {saveChangeBtn ? (
                <div
                    className="animated rubberBand delay-2s"
                    style={{ animationIterationCount: 2 }}
                >
                    <ButtonFab
                        position="relative"
                        onClick={() => {
                            const lastButOnetargetPoints = isFirst
                                ? 0
                                : challengesArray[challengesArray.length - 2]
                                      .targetPoints;
                            if (
                                !isFirst &&
                                data.targetPoints < lastButOnetargetPoints
                            )
                                return showToast(
                                    "O ponto-prêmio do desafio atual deve ser maior que o anterior",
                                    { type: "error" }
                                );
                            if (!Number(data.targetPoints)) {
                                showToast(
                                    "Em ponto-prêmio, insira apenas números.",
                                    { type: "error" }
                                );
                            } else {
                                handleDataChange();
                                setEdit(false);
                                setSaveChangeBtn(false);
                            }
                        }}
                        title="salvar"
                        iconFontAwesome={<FontAwesomeIcon icon="save" />}
                        iconFontSize="25px"
                        variant="extended"
                        fontWeight="bolder"
                        fontSize=".9em"
                        size="medium"
                        color="white"
                        backgroundColor="var(--themeSDark--default)"
                        needBtnShadow={false}
                    />
                </div>
            ) : (
                <Fragment>
                    {!isFirst && (
                        <DeleteModalBtn
                            id={data.id}
                            challengeNumber={currChallNumber}
                            updateThisUser={updateThisUser}
                        />
                    )}
                    <EditButton onClick={() => setEdit(!edit)} />
                </Fragment>
            )}
        </section>
    );

    return (
        <Card style={styles.card}>
            <section className="position-relative">
                <section className="d-flex flex-column align-items-start flex-md-row text-white">
                    {showIcon()}
                    {showtargetPoints()}
                    {showPrizeDesc()}
                </section>
                <div className="position-absolute" style={styles.actionBtns}>
                    {showActionBtns()}
                </div>
            </section>
        </Card>
    );
}
