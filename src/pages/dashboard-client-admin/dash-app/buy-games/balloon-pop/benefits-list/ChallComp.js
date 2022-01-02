import { useState, Fragment } from "react";
import Card from "@material-ui/core/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";
import EditButton from "components/buttons/EditButton";
import handleChange from "utils/form/use-state/handleChange";
import findAndReplaceObjInArray from "utils/arrays/findAndReplaceObjInArray";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
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
    desc,
    challengesArray,
    setChallengesArray,
    showToast,
    currChallNumber,
    updateLocalList,
}) {
    const [data, setData] = useState({
        currChallNumber,
        id,
        desc,
    });

    const [saveChangeBtn, setSaveChangeBtn] = useState(false);
    const [edit, setEdit] = useState(false);

    const txtStyle =
        "text-shadow font-site text-em-0-9 text-white text-center m-0";
    const styles = getStyles();

    const handleDataChange = () => {
        const updatedArray = [
            {
                id: data.id,
                desc: data.desc,
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

    const showBenefitDesc = () => (
        <div className="">
            <p className={txtStyle}>Descrição:</p>
            {!edit ? (
                <p className="text-normal font-weight-bold text-center">
                    {data.desc}
                </p>
            ) : (
                <div className="animated zoomIn ml-md-0 ml-3">
                    <TextField
                        InputProps={{
                            style: { ...styles.fieldForm },
                        }}
                        multiline
                        rows={2}
                        inputProps={{
                            maxLength: 200,
                        }}
                        margin="dense"
                        type="text"
                        onChange={(e) => {
                            handleChange(setData, data)(e);
                            setSaveChangeBtn(true);
                        }}
                        name="desc"
                        value={data.desc}
                        width="100%"
                        autoComplete="off"
                        fullWidth
                    />
                </div>
            )}
        </div>
    );

    const showNothing = () => (
        <div
            className="container-center flex-column align-self-center"
            style={{ flexBasis: "60%" }}
        />
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
                            if (!data.desc) {
                                return showToast(
                                    "Favor, insira a descrição do benefício.",
                                    {
                                        type: "error",
                                    }
                                );
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
                    {Boolean(currChallNumber >= 3) && (
                        <DeleteModalBtn
                            subject="benefício"
                            id={data.id}
                            challengeNumber={currChallNumber}
                            updateLocalList={updateLocalList}
                            needType={false}
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
                    {showBenefitDesc()}
                    {showNothing()}
                </section>
            </section>
        </Card>
    );
}
