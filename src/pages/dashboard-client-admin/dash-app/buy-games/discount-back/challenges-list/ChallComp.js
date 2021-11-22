import { useState, Fragment, useEffect } from "react";
import Card from "@material-ui/core/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";
import EditButton from "components/buttons/EditButton";
import handleChange from "utils/form/use-state/handleChange";
import findAndReplaceObjInArray from "utils/arrays/findAndReplaceObjInArray";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import convertToReal, { convertToDollar } from "utils/numbers/convertToReal";
import getPercentage from "utils/numbers/getPercentage";
import DeleteModalBtn from "../../target-prize/challenges-list/chall-helpers/DeleteModalBtn";

const getStyles = () => ({
    card: {
        backgroundColor: "var(--themeP)",
        borderRadius: "15px",
        padding: "15px",
        overflow: "visible",
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
    perc,
    targetPoints,
    targetMoney,
    challengesArray,
    setChallengesArray,
    showToast,
    currChallNumber,
    updateLocalList,
}) {
    const [data, setData] = useState({
        currChallNumber,
        id,
        perc,
        targetPoints,
        targetMoney,
    });

    useEffect(() => {
        const gotAllData = data.targetPoints && data.perc;
        if (gotAllData) {
            setData((prev) => ({
                ...prev,
                targetMoney: getPercentage(data.targetPoints, data.perc, {
                    mode: "value",
                }),
            }));
        } else setData((prev) => ({ ...prev, targetMoney: 0 }));
    }, [data.targetPoints, data.perc]);

    const [saveChangeBtn, setSaveChangeBtn] = useState(false);
    const [edit, setEdit] = useState(false);

    const txtStyle =
        "text-shadow font-site text-em-0-9 text-white text-center m-0";
    const styles = getStyles();

    const handleDataChange = () => {
        const updatedArray = [
            {
                id: data.id,
                perc: data.perc,
                targetPoints: Number(data.targetPoints),
                targetMoney: convertToDollar(data.targetMoney),
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

    const showPerc = () => (
        <div
            className="container-center flex-row flex-md-column justify-content-start"
            style={{ flexBasis: "20%" }}
        >
            <p className={txtStyle}>Percentual:</p>
            {!edit ? (
                <p className="text-subtitle font-weight-bold text-center m-0 ml-md-0 ml-3">
                    {data.perc} %
                </p>
            ) : (
                <Fragment>
                    <div className="ml-3 ml-md-0 container-center animated zoomIn">
                        <div className="position-relative">
                            <TextField
                                InputProps={{
                                    style: {
                                        ...styles.fieldForm,
                                        width: "100px",
                                    },
                                }}
                                margin="dense"
                                type="tel"
                                onChange={(e) => {
                                    handleChange(setData, data)(e);
                                    setSaveChangeBtn(true);
                                }}
                                name="perc"
                                value={data.perc}
                                autoComplete="off"
                                fullWidth
                            />
                            <span
                                className="position-absolute font-weight-bold text-subtitle"
                                style={{
                                    top: 15,
                                    right: -30,
                                }}
                            >
                                %
                            </span>
                        </div>
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

    const showDiscountCoupon = () => (
        <div
            className="container-center flex-column align-self-center"
            style={{ flexBasis: "60%" }}
        >
            <p className={txtStyle}>Valor Vale Desconto:</p>
            <p className="text-left text-subtitle font-weight-bold m-0">
                R$ {convertToReal(data.targetMoney)}
            </p>
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
                            if (!data.targetPoints) {
                                return showToast("Insira a meta em pontos", {
                                    type: "error",
                                });
                            }

                            if (!data.perc) {
                                return showToast("Insira o valor percentual", {
                                    type: "error",
                                });
                            }

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
                            subject="desconto"
                            id={data.id}
                            challengeNumber={currChallNumber}
                            updateLocalList={updateLocalList}
                        />
                    )}
                    <EditButton zIndex={1} onClick={() => setEdit(!edit)} />
                </Fragment>
            )}
        </section>
    );

    return (
        <Card style={styles.card}>
            <section className="position-relative">
                <div
                    className="position-absolute"
                    style={{
                        top: -45,
                        right: -45,
                    }}
                >
                    {showEditBtn()}
                </div>
                <section className="d-flex flex-column align-items-start flex-md-row text-white">
                    {showtargetPoints()}
                    {showPerc()}
                    {showDiscountCoupon()}
                </section>
            </section>
        </Card>
    );
}
