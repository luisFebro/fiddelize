import { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "@material-ui/core/Card";
import handleChange from "../../../utils/form/use-state/handleChange";
import { handleNextField } from "../../../utils/form/kit";
import ButtonMulti, {
    faStyle,
} from "../../../components/buttons/material-ui/ButtonMulti";
import { setMultiVar, store } from "../../../hooks/storage/useVar";
import generateBizCodeName from "../../download-app/instant-app/helpers/generateBizCodeName";
import showToast from "../../../components/toasts";
import AutoCompleteSearch from "../../../components/search/AutoCompleteSearch";
import { API } from "../../../config/api";

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

export default function BizForm() {
    const [data, setData] = useState({
        bizName: "",
        bizCodeName: "",
        field: "",
        selectedValue: "", // field in the autoselect
    });
    const { bizCodeName, field, bizName, selectedValue } = data;

    useEffect(() => {
        if (selectedValue) {
            setData({ ...data, field: selectedValue });
        }
    }, [selectedValue]);

    const styles = getStyles();

    // error options: bizName or field
    const [fieldError, setFieldError] = useState(null);
    const autocompleteUrl = `${API}/user/pre-register/fields-list?limit=30`;

    const generateThisBizCode = (ultimateBizName) => {
        if (ultimateBizName) {
            const finalDashedName = generateBizCodeName(ultimateBizName);
            setData({
                ...data,
                bizCodeName: finalDashedName,
            });
        }
    };

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
                        handleNextField(e, "field1");
                        setData({
                            ...data,
                            bizName: e.target.value && e.target.value.cap(),
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
                        generateThisBizCode(ultimateBizName);
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
            <div id="field2" className="mt-3">
                Qual ramo de atividade?
                <AutoCompleteSearch
                    autocompleteUrl={autocompleteUrl}
                    setData={setData}
                    placeholder=""
                    openOnFocus={false}
                    selectOnFocus={false}
                    searchIcon="map-marked-alt"
                    noOptionsText="Nada encontrado"
                    maxHistory={7}
                    inputId="value2"
                />
            </div>
        </form>
    );

    const handleContinue = async () => {
        if (!bizName) {
            setFieldError("bizName");
            return showToast("Informe nome do seu negócio", { type: "error" });
        }

        if (!field) {
            setFieldError("field");
            return showToast("Informe ramo de atividade.", { type: "error" });
        }

        const data = [
            { doneBizInfo: true },
            { clientAdminData: { bizName, bizCodeName, bizField: field } },
        ];
        await setMultiVar(data, store.pre_register);

        // need to be reloaded since the other fields are prevented to be opened somehow.
        window.location.href = `/${bizCodeName}/novo-app/metas`;
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

/*
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
