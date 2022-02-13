import { useState } from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "@material-ui/core/Card";
import handleChange from "utils/form/use-state/handleChange";
import { handleNextField } from "utils/form/kit";
import ButtonMulti, {
    faStyle,
} from "components/buttons/material-ui/ButtonMulti";
import { getVars, setVars } from "init/var";
import showToast from "components/toasts";
import isKeyPressed from "utils/event/isKeyPressed";
import { useLocation } from "react-router-dom";
import generateBizCodeName from "../../download-app/instant-app/helpers/generateBizCodeName";
import { useNeedRedirectPage } from "../helpers/handleRedirectPages";
// import { ROOT } from "api/root";
// import AutoCompleteSearch from "components/search/AutoCompleteSearch";

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    fieldForm: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        zIndex: 2000,
        font: "normal 1em Poppins, sans-serif",
    },
    card: {
        margin: "auto",
        width: "90%",
        maxWidth: isSmall ? "" : 360,
        boxShadow: "0 31px 120px -6px rgba(0, 0, 0, 0.35)",
    },
    helperFromField: {
        color: "grey",
        fontFamily: "Poppins, sans-serif",
        fontSize: isSmall ? ".8em" : ".6em",
    },
});

export default function BizForm({ history }) {
    const [data, setData] = useState({
        bizName: "",
        // field: "",
        // selectedValue: "", // field in the autoselect
    });
    const { bizName } = data;

    const { search } = useLocation();
    // for digital menu - even if the user skip the custom, it is still required to inform biz name before custom app panel
    const needCustomApp = search && search.includes("customApp=1");

    useNeedRedirectPage({ history, priorPageId: "doneGamesPanel" });

    // useEffect(() => {
    //     if (selectedValue)
    //         setData((prev) => ({ ...prev, field: selectedValue }));
    // }, [selectedValue]);
    // error options: bizName or field

    const styles = getStyles();
    const [fieldError, setFieldError] = useState(null);

    const showForm = () => (
        <form
            style={{ margin: "auto", width: "90%" }}
            className="text-p text-normal"
            onBlur={() => setFieldError(null)}
        >
            <div id="field1" className="mt-3">
                Qual o nome do seu negócio?
                <TextField
                    required
                    onChange={handleChange(setData, data)}
                    error={fieldError === "bizName"}
                    variant="outlined"
                    margin="dense"
                    name="bizName"
                    value={bizName}
                    onKeyPress={(e) => {
                        if (!isKeyPressed(e, "Enter")) return null;

                        const ultimateBizName =
                            e.target.value && e.target.value.cap();
                        handleNextField(e, "field1");
                        setData({
                            ...data,
                            bizName: ultimateBizName,
                        });
                    }}
                    onBlur={(e) => {
                        handleNextField(e, "field1", { event: "onBlur" });
                        const ultimateBizName =
                            e.target.value && e.target.value.cap();
                        setData({
                            ...data,
                            bizName: ultimateBizName,
                        });
                    }}
                    autoComplete="off"
                    type="text"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FontAwesomeIcon icon="store" />
                            </InputAdornment>
                        ),
                        style: styles.fieldForm,
                        id: "value1",
                    }}
                />
            </div>
        </form>
    );

    const handleContinue = async () => {
        if (!bizName) {
            setFieldError("bizName");
            return showToast("Informe nome do seu negócio", { type: "error" });
        }

        showToast("Salvando...", { dur: 3000 });
        const bizLinkName = await generateUltimateBizCode(bizName);

        const [priorAdminData, selectedGame] = await getVars(
            ["clientAdminData", "game"],
            "pre_register"
        );
        const games = priorAdminData && priorAdminData.games;

        // target prize game only required data for this game since it will be inserted as query string. Other games should be using local forage directly in the component game.
        const targetPoints =
            games.targetPrize && games.targetPrize.challList[0].targetPoints;
        const prizeDesc =
            games.targetPrize && games.targetPrize.challList[0].prizeDesc;

        const newData = {
            ...priorAdminData,
            bizName,
            bizLinkName,
        };

        const finalData = {
            doneBizInfo: true,
            doneSSRatingIcon: needCustomApp, // for digital menu
            clientAdminData: newData,
        };
        await setVars(finalData, "pre_register");

        const gameUrl = handleGameUrl({
            game: selectedGame,
            bizLinkName,
            bizName,
            targetPoints,
            prizeDesc,
            // only for digital menu
            needCustomApp,
        });

        history.push(gameUrl);

        return null;
    };

    const showButtonActions = () => (
        <div className="container-center mt-3">
            <ButtonMulti
                onClick={handleContinue}
                color="var(--mainWhite)"
                backgroundColor="var(--themeSDark)"
                backColorOnHover="var(--themeSDark)"
                iconFontAwesome={
                    <FontAwesomeIcon icon="arrow-right" style={faStyle} />
                }
                textTransform="uppercase"
            >
                Continuar
            </ButtonMulti>
        </div>
    );

    return (
        <Card
            className="animated fadeInUp card-elevation mb-5"
            style={styles.card}
        >
            {showForm()}
            {showButtonActions()}
        </Card>
    );
}

// HELPERS
async function generateUltimateBizCode(bizName) {
    const finalDashedName = await generateBizCodeName(bizName);
    return finalDashedName;
}

function handleGameUrl({
    game,
    bizLinkName,
    bizName,
    targetPoints,
    prizeDesc,
    needCustomApp,
}) {
    if (game === "digitalMenu") {
        if (needCustomApp)
            return `/${bizLinkName}/novo-clube/self-service?negocio=${bizName}`;
        // no need to custom app
        return `/${bizLinkName}/novo-clube/cadastro-admin`;
    }

    if (game === "targetPrize")
        return `/${bizLinkName}/novo-clube/self-service?negocio=${bizName}&ponto-premio=${targetPoints}&premio-desc=${prizeDesc}&nome-cliente=Ana&g=${game}`;
    return `/${bizLinkName}/novo-clube/self-service?nome-cliente=Ana&g=${game}`;
}
// END HELPERS

/* ARCHIVES
// const autocompleteUrl = `${ROOT}/user/pre-register/fields-list?limit=30`;

if (!field) {
    setFieldError("field");
    return showToast("Informe ramo de atividade.", { type: "error" });
}

<div id="field2" className="mt-3">
    Qual ramo de atividade?
    <AutoCompleteSearch
        autocompleteUrl={autocompleteUrl}
        setData={setData}
        clearOnEscape={false}
        clearOnBlur={false}
        placeholder=""
        openOnFocus={false}
        selectOnFocus={false}
        searchIcon="map-marked-alt"
        noOptionsText="Sem sugestões"
        maxHistory={7}
        inputId="value2"
        txtFont="1em"
    />
</div>

<TextField
    required
    onChange={handleChange(setData, data)}
    error={fieldError === "field" ? true : false}
    variant="outlined"
    margin="dense"
    name="field"
    value={field}
    onKeyPress={null}
    onBlur={null}
    autoComplete="off"
    type="text"
    fullWidth
    helperText={"ex: restaurante, clínicas, etc"}
    FormHelperTextProps={{ style: styles.helperFromField }}
    InputProps={{
        startAdornment: (
            <InputAdornment position="start">
                <FontAwesomeIcon icon="map-marked-alt" />
            </InputAdornment>
        ),
        style: styles.fieldForm,
        id: "value2",
    }}
/>
 */
