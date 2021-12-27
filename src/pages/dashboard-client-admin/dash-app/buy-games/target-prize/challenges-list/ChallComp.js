import { useState, Fragment, useEffect } from "react";
import Card from "@material-ui/core/Card";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";
import EditButton from "components/buttons/EditButton";
import handleChange from "utils/form/use-state/handleChange";
import findAndReplaceObjInArray from "utils/arrays/findAndReplaceObjInArray";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import EditLevelIconModalBtn from "./chall-helpers/EditLevelIconModalBtn";
import DeleteModalBtn from "./chall-helpers/DeleteModalBtn";
import PhotoBtn from "./photo/PhotoBtn";

const truncate = (text, leng) => window.Helper.truncate(text, leng);

ChallComp.propTypes = {
    id: PropTypes.string,
    icon: PropTypes.string,
    targetPoints: PropTypes.number,
    prizeDesc: PropTypes.string,
    currChallNumber: PropTypes.number,
};

const getStyles = () => ({
    card: {
        backgroundColor: "var(--themeP)",
        borderRadius: "15px",
        padding: "15px",
        overflow: "visible",
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
});

export default function ChallComp({
    id,
    icon,
    targetPoints,
    prizeDesc,
    prizeImg,
    challengesArray,
    setChallengesArray,
    showToast,
    currChallNumber,
    updateLocalList,
    gotSomePic,
}) {
    const [data, setData] = useState({
        currChallNumber,
        id,
        icon,
        targetPoints,
        prizeDesc,
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

    const txtStyle = "text-shadow font-site text-em-0-9 text-white m-0";
    const styles = getStyles();

    const handleDataChange = () => {
        const updatedArray = [
            {
                id: data.id,
                milestoneIcon: data.icon,
                targetPoints: Number(data.targetPoints),
                prizeDesc: data.prizeDesc && data.prizeDesc.toLowerCase(),
                prizeImg,
            },
        ];
        const newArray = findAndReplaceObjInArray(
            challengesArray,
            updatedArray,
            "id"
        );

        setChallengesArray(newArray);
        updateLocalList({ needMsg: true, updatedData: newArray });

        setTimeout(() => setEdit(false), 2000);
    };

    const showIcon = () => (
        <div
            className="container-center flex-row flex-md-column justify-content-start"
            style={{ flexBasis: "20%" }}
        >
            <p className={txtStyle}>Ícone Desafio:</p>
            <FontAwesomeIcon
                className="ml-md-0 ml-3"
                icon={data.icon}
                style={styles.levelIcon}
            />
            {edit && (
                <Fragment>
                    <div className="ml-3 ml-md-0 container-center animated zoomIn">
                        <EditLevelIconModalBtn
                            currChallNumber={data.currChallNumber}
                            currIcon={data.icon}
                            setSelectedIcon={setSelectedIcon}
                        />
                    </div>
                </Fragment>
            )}
        </div>
    );

    const showtargetPoints = () => (
        <div
            className="container-center flex-row flex-md-column"
            style={{ flexBasis: "20%" }}
        >
            <p className={txtStyle}>Meta em Pontos:</p>
            {!edit ? (
                <p className="text-subtitle font-weight-bold text-center m-0 ml-md-0 ml-3">
                    {data.targetPoints} PTS
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
                    {truncate(data.prizeDesc || " ", 29)}
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
                        name="prizeDesc"
                        value={data.prizeDesc}
                        autoComplete="off"
                        multiline
                        rows="2"
                        fullWidth
                    />
                </div>
            )}
        </div>
    );

    const showEditBtn = () => (
        <section
            className="d-flex justify-content-around"
            style={{ width: "150px" }}
        >
            {saveChangeBtn ? (
                <div className="animated rubberBand delay-2s">
                    <ButtonFab
                        position="relative"
                        onClick={() => {
                            if (!Number(data.targetPoints)) {
                                return showToast(
                                    "Em ponto-prêmio, insira apenas números.",
                                    { type: "error" }
                                );
                            }

                            if (!data.prizeDesc)
                                return showToast("Insira alguma descrição", {
                                    type: "error",
                                });

                            handleDataChange();
                            setEdit(false);
                            setSaveChangeBtn(false);

                            return null;
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
                    {currChallNumber !== 1 && (
                        <DeleteModalBtn
                            id={data.id}
                            challengeNumber={currChallNumber}
                            updateLocalList={updateLocalList}
                        />
                    )}
                    <EditButton onClick={() => setEdit(!edit)} />
                </Fragment>
            )}
        </section>
    );

    const showPhotoBtn = () => {
        const uploadData = {
            challId: id,
            savedPrizeImg: prizeImg,
            targetPoints: data.targetPoints,
            gotSomePic,
        };

        return <PhotoBtn modalData={uploadData} />;
    };

    return (
        <Card style={styles.card}>
            <section className="position-relative">
                <div
                    className="position-absolute"
                    style={{
                        top: -45,
                        right: currChallNumber === 1 ? 20 : 50,
                    }}
                >
                    {showEditBtn()}
                </div>
                <div className="position-absolute target-prize-photo-btn">
                    {showPhotoBtn()}
                    <style jsx global>
                        {`
                            .target-prize-photo-btn {
                                top: -60px;
                                right: -30px;
                            }
                        `}
                    </style>
                </div>
                <section className="d-flex flex-column align-items-start flex-md-row text-white">
                    {showIcon()}
                    {showtargetPoints()}
                    {showPrizeDesc()}
                </section>
            </section>
        </Card>
    );
}
