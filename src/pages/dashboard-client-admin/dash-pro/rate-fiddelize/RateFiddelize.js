import { Fragment, useState, useEffect } from "react";
import { useStoreDispatch } from "easy-peasy";
import TextField from "@material-ui/core/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showSnackbar } from "../../../../redux/actions/snackbarActions";
import Title from "../../../../components/Title";
import handleChange from "../../../../utils/form/use-state/handleChange";
import FacesPromotersScore, {
    getScaleText,
} from "./faces-promoters-score/FacesPromotersScore";
import useData from "../../../../hooks/useData";
import ButtonFab from "../../../../components/buttons/material-ui/ButtonFab";
import "./faces-promoters-score/_FacesPromotersScore.css";
import getAPI, {
    updateUser,
    readUser,
} from "../../../../utils/promises/getAPI";

const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function RateFiddelize() {
    const [dataDB, setDataDB] = useState({
        nps: null,
        xpReport: "",
    });
    const { nps, xpReport } = dataDB;

    const dispatch = useStoreDispatch();
    const [userId] = useData(["userId"]);
    const loadingData = userId === "...";

    useEffect(() => {
        if (loadingData) return;

        (async () => {
            const res = await getAPI({
                url: readUser(userId, "cliente-admin", false),
                params: {
                    select:
                        "clientAdminData.review.nps clientAdminData.review.xpReport",
                    clientAdminRequest: true,
                },
            }).catch((err) => {
                console.log(`ERROR: ${err}`);
            });

            const reviewData = res.data.review;

            setDataDB((prev) => ({
                ...prev,
                nps: reviewData && reviewData.nps,
                xpReport: reviewData && reviewData.xpReport,
            }));
        })();
    }, [userId, loadingData]);

    return (
        <section>
            <Title
                title="&#187; Avalie a Fiddelize"
                color="var(--themeP)"
                margin="mt-5"
                padding=" "
            />
            <ShowNPS
                dbNps={nps}
                dispatch={dispatch}
                userId={userId}
                loadingData={loadingData}
            />
            <ShowXpReportField
                dbXpReport={xpReport}
                dispatch={dispatch}
                userId={userId}
                loadingData={loadingData}
            />
        </section>
    );
}

const getStyles = () => ({
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "20px",
        fontFamily: "var(--mainFont)",
    },
});

const handleText = ({ scale }) => {
    const scaleText = getScaleText(scale);

    if (!scale) return "Clique na carinha que identifica com sua avaliação";
    return scaleText;
};

const getSmiley = (g) => {
    if (!g) return {};
    if (g === 1 || g === 2) return { icon: "angry" };
    if (g === 3 || g === 4) return { icon: "frown" };
    if (g === 5 || g === 6) return { icon: "meh" };
    if (g === 7 || g === 8) return { icon: "grimace" };
    if (g === 9 || g === 10) return { icon: "grin-alt" };
};

function ShowNPS({ dbNps, dispatch, userId, loadingData }) {
    const [scale, setScale] = useState(null);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        if (dbNps) {
            setScale(dbNps);
        }
    }, [dbNps]);

    const { icon } = getSmiley(scale);

    const showNpsSmiley = () => (
        <section className="nps-rating--root">
            <div
                className="faces-group shadow-elevation-black"
                style={{
                    backgroundColor: "transparent",
                    padding: 0,
                }}
            >
                <FontAwesomeIcon
                    icon={icon}
                    className={`scale-${scale} curr-scale`}
                    style={{
                        margin: 0,
                        transform: "scale(0.8)",
                    }}
                />
            </div>
        </section>
    );

    const showAlreadyDbDataMode = () => (
        <Fragment>
            <section className="mb-3 text-center">
                <h2 className="m-0 text-purple text-center text-subtitle font-weight-bold">
                    Última recomendação:
                </h2>
                <section className="container-center-col">
                    <div className="position-relative d-flex justify-content-center align-items-center">
                        <p className="m-0 text-subtitle text-purple font-weight-bold">
                            {scale && "Escala"} {scale}
                        </p>
                        {showNpsSmiley()}
                    </div>
                    <div className="container-center">
                        <p className="m-0 text-center text-pill text-normal">
                            {handleText({ scale })}
                        </p>
                    </div>
                </section>
            </section>
            <div
                className="position-relative d-flex justify-content-end"
                style={{
                    top: -15,
                }}
            >
                <ButtonFab
                    title="editar"
                    backgroundColor="var(--themeSDark--default)"
                    onClick={() => setEdit(true)}
                    position="relative"
                    variant="extended"
                    size="small"
                />
            </div>
        </Fragment>
    );

    const showResearchMode = () => (
        <Fragment>
            <h2 className="text-purple text-normal font-weight-bold">
                Em uma escala de 1 a 10, quão provável você recomendaria a{" "}
                <span className="text-underline">Fiddelize</span> para
                empreendedores de outras áreas de atuação?
            </h2>
            <section className="my-3 text-center">
                <p className="m-0 text-subtitle text-purple font-weight-bold">
                    {scale && "Escala"} {scale}
                </p>
                <div className="container-center">
                    <p className="m-0 text-center text-pill text-normal">
                        {handleText({ scale })}
                    </p>
                </div>
            </section>
            {loadingData ? (
                <p className="container-center text-purple text-normal font-weight-bold">
                    Carregando...
                </p>
            ) : (
                <FacesPromotersScore
                    scale={scale}
                    setScale={setScale}
                    userId={userId}
                    dispatch={dispatch}
                    showSnackbar={showSnackbar}
                />
            )}
        </Fragment>
    );

    const isResearchMode = !dbNps || (!dbNps && edit) || edit;
    return (
        <Fragment>
            {isResearchMode ? showResearchMode() : showAlreadyDbDataMode()}
        </Fragment>
    );
}

function ShowXpReportField({
    dbXpReport,
    dispatch,
    userId,
    role = "cliente-admin",
    loadingData,
}) {
    const [xpReport, setXpReport] = useState("");
    const [edit, setEdit] = useState(false);
    const styles = getStyles();

    useEffect(() => {
        if (dbXpReport) {
            setXpReport(dbXpReport);
        }
    }, [dbXpReport]);

    const handleReportEditDone = async () => {
        if (loadingData) return;
        showSnackbar(dispatch, "Atualizando...", "warning", 6000);
        await getAPI({
            method: "put",
            url: updateUser(userId, role),
            body: {
                "clientAdminData.review.xpReport": xpReport,
                "clientAdminData.review.reportUpdatedAt": new Date(),
            },
        }).catch((err) => {
            console.log(`ERROR: ${err}`);
        });
        showSnackbar(
            dispatch,
            "Relato Enviado.<br />Obrigada por compartilhar!",
            "success"
        );
        setEdit(false);
    };

    const showResearchMode = () => (
        <Fragment>
            <TextField
                multiline
                placeholder="Escreva sobre sua experiência, resultados e/ou sugestões de melhorias usando os serviços da Fiddelize."
                rows={5}
                InputProps={{
                    style: styles.fieldFormValue,
                }}
                // eslint-disable-next-line
                inputProps={{
                    maxLength: 280,
                }}
                name="xpReport"
                value={xpReport}
                onChange={handleChange(setXpReport)}
                onBlur={null}
                variant="outlined"
                fullWidth
            />
            <div
                className="mb-3 position-relative text-white text-left"
                style={{ top: "5px" }}
            >
                <span className="text-purple text-small font-weight-bold">
                    {xpReport.length}/280 characteres
                </span>
            </div>
            {xpReport && (
                <div className="container-center animated fadeInUp mx-3">
                    <ButtonFab
                        title={
                            dbXpReport ? "atualizar relato" : "enviar relato"
                        }
                        backgroundColor="var(--themeSDark--default)"
                        onClick={handleReportEditDone}
                        width="100%"
                        position="relative"
                        variant="extended"
                        size="large"
                    />
                </div>
            )}
        </Fragment>
    );

    const showAlreadyDbDataMode = () => (
        <Fragment>
            <section className="my-3 text-center">
                <p
                    className="m-0 text-normal text-purple"
                    style={{
                        fontStyle: "italic",
                    }}
                >
                    &quot;{truncate(xpReport || dbXpReport, 55)}&quot;
                </p>
            </section>
            <div
                className="position-relative d-flex justify-content-end"
                style={{
                    top: -15,
                }}
            >
                <ButtonFab
                    title="editar"
                    backgroundColor="var(--themeSDark--default)"
                    onClick={() => setEdit(true)}
                    position="relative"
                    variant="extended"
                    size="small"
                />
            </div>
        </Fragment>
    );

    const isResearchMode = !dbXpReport || (!dbXpReport && edit) || edit;

    const isEdit = edit ? "Atualize seu relato:" : "Dê seu relato";
    return (
        <Fragment>
            <h2 className="mt-3 text-purple text-center text-subtitle font-weight-bold">
                {isResearchMode ? isEdit : "Seu último relato:"}
            </h2>
            {isResearchMode ? showResearchMode() : showAlreadyDbDataMode()}
        </Fragment>
    );
}
