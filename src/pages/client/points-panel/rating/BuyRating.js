import { useState, useEffect, Fragment } from "react";
import useData, { useBizData } from "init";
import TextField from "@material-ui/core/TextField";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { updateUser } from "api/frequent";
import showToast from "components/toasts";
import handleChange from "utils/form/use-state/handleChange";
import StarsBuyExperience, {
    getGradeText,
} from "./stars-buy-experience/StarsBuyExperience";
import FacesPromotersScore, {
    getScaleText,
} from "./faces-promoters-score/FacesPromotersScore";
import "./_BuyRating.css";

const getStyles = () => ({
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "20px",
        fontFamily: "var(--mainFont)",
    },
});

const handleText = ({ isNPS, grade, scale }) => {
    const gradeText = getGradeText(grade);
    const scaleText = getScaleText(scale);
    if (isNPS) {
        if (!scale) return "Clique na carinha que identifica com sua avaliação";
        return scaleText;
    }

    return gradeText;
};

export default function BuyRating({
    type = "stars",
    // colorP,
    handleBuyRating,
    defaultScale,
    defaultGrade,
    defaultBuyReport,
    removeReportField,
    onlyReportField,
}) {
    const [scale, setScale] = useState(null);
    const [grade, setGrade] = useState(5);
    const [buyReport, setBuyReport] = useState("");
    const [switchEdit, setSwitchEdit] = useState(false);

    const styles = getStyles();

    const [firstName, customerName, userId, role] = useData([
        "firstName",
        "name",
        "userId",
        "role",
    ]);

    const { bizId, bizName, bizLogo } = useBizData();

    useEffect(() => {
        if (typeof handleBuyRating === "function") {
            handleBuyRating({
                buyReport,
                xpScore: grade,
                nps: scale,
            });
        }
    }, [buyReport, grade, scale]);

    useEffect(() => {
        if (defaultScale) setScale(defaultScale);
        if (defaultBuyReport) setBuyReport(defaultBuyReport);
        if (defaultGrade) setGrade(defaultGrade);
    }, [defaultScale, defaultBuyReport]);

    const handleGrade = (newGrade) => {
        setGrade(newGrade);
    };

    const isNPS = type === "nps";
    const title = isNPS
        ? `Em um escala de 1 a 10, quão provável você recomendaria a ${
              bizName && bizName.toUpperCase()
          } para um amigo ou conhecido?`
        : `Qual foi sua experiência de compra hoje, ${firstName}?`;

    const handleReportDisplay = () => {
        if (onlyReportField) return "block";
        if (removeReportField) return "none";

        if (isNPS) {
            return !scale ? "none" : "block";
        }

        return "block";
    };

    const handleReportEditDone = async () => {
        if (!buyReport) return;
        showToast("Atualizando...", { dur: 3000 });
        const body = {
            "clientUserData.review.buyReport": buyReport,
            "clientUserData.review.reportUpdatedAt": new Date(),
            customerName,
            bizLogo,
            businessId: bizId,
            report: buyReport,
        };
        updateUser(userId, role, body).catch((err) => {
            showToast("Ocorreu um erro ao atualizar", { type: "error" });
            console.log(`ERROR: ${err.response}`);
        });
        showToast("Relato Atualizado!", { type: "success" });
        setSwitchEdit(false);
    };

    const MAX_LEN = 300;
    return (
        <section
            className="nps-rating--root my-5"
            style={{ backgroundColor: "var(--themePLight--default)" }}
        >
            {!onlyReportField && (
                <Fragment>
                    <h2
                        className="question text-shadow"
                        style={{
                            fontSize: isNPS ? "1.4rem" : undefined,
                            textAlign: isNPS ? "left" : undefined,
                        }}
                    >
                        {title}
                    </h2>
                    <section className="my-3 grade-area text-center text-shadow">
                        <p className="m-0 grade">
                            {isNPS ? (scale ? "Escala" : "") : "Nota"}{" "}
                            {scale || (!isNPS && grade)}
                        </p>
                        <p
                            className={`m-0 text ${
                                !scale && isNPS ? "text-pill" : ""
                            }`}
                        >
                            {handleText({ isNPS, grade, scale })}
                        </p>
                    </section>
                </Fragment>
            )}
            {isNPS && !onlyReportField && (
                <FacesPromotersScore
                    scale={scale}
                    setScale={setScale}
                    userId={userId}
                    role={role}
                    showToast={showToast}
                    removeReportField={removeReportField}
                />
            )}
            {!isNPS && !onlyReportField && (
                <StarsBuyExperience
                    grade={grade}
                    handleGrade={handleGrade}
                    userId={userId}
                    role={role}
                    showToast={showToast}
                    removeReportField={removeReportField}
                />
            )}
            <section
                className="animated fadeInUp"
                style={{
                    display: handleReportDisplay(),
                }}
            >
                <h2
                    className={`${
                        onlyReportField ? "" : "mt-5"
                    } mb-3 text-shadow text-white text-center`}
                >
                    {defaultBuyReport && "Seu Último "}Relato de Compra
                </h2>
                {Boolean(defaultBuyReport) && !switchEdit ? (
                    <section className="mt-3">
                        <p className="text-white text-shadow text-normal font-weight-bold mx-3">
                            {buyReport
                                ? `"${buyReport}"`
                                : defaultBuyReport === " "
                                ? "nenhum."
                                : `"${defaultBuyReport}"`}
                        </p>
                        <div className="my-4 mx-3">
                            <ButtonFab
                                title="editar"
                                size="large"
                                onClick={() => setSwitchEdit(true)}
                                width="100%"
                                position="relative"
                                backgroundColor="var(--themeSDark)"
                                variant="extended"
                            />
                        </div>
                    </section>
                ) : (
                    <Fragment>
                        <TextField
                            multiline
                            placeholder="Escreva sobre sua última compra... relate se precisa de melhorias, ou diga o que mais gostou, etc."
                            rows={5}
                            InputProps={{
                                style: styles.fieldFormValue,
                            }}
                            // eslint-disable-next-line
                            inputProps={{
                                maxLength: MAX_LEN,
                            }}
                            name="buyReport"
                            value={buyReport}
                            onChange={(e) => handleChange(setBuyReport)(e)}
                            onBlur={null}
                            variant="outlined"
                            fullWidth
                        />
                        <div className="mb-3 position-relative text-white text-left">
                            <span className="font-site text-em-0-7 font-weight-bold text-shadow">
                                {buyReport.length}/{MAX_LEN} characteres
                            </span>
                        </div>
                        {Boolean(defaultBuyReport) && (
                            <div className="my-4 mx-3">
                                <ButtonFab
                                    title="atualizar"
                                    size="large"
                                    onClick={handleReportEditDone}
                                    width="100%"
                                    position="relative"
                                    backgroundColor="var(--themeSDark)"
                                    variant="extended"
                                />
                            </div>
                        )}
                    </Fragment>
                )}
            </section>
        </section>
    );
}
