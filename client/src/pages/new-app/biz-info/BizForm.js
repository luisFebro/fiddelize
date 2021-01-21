import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import handleChange from "../../../utils/form/use-state/handleChange";
import { handleNextField } from "../../../utils/form/kit";
import setValObjWithStr from "../../../utils/objects/setValObjWithStr";
import InputAdornment from "@material-ui/core/InputAdornment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "@material-ui/core/Card";
import ButtonMulti, {
    faStyle,
} from "../../../components/buttons/material-ui/ButtonMulti";
import { setMultiVar, store } from "../../../hooks/storage/useVar";
import generateBizCodeName from "../../../pages/download-app/instant-accout/helpers/generateBizCodeName";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import AutoCompleteSearch from "../../../components/search/AutoCompleteSearch";

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
        clientAdminData: { bizName: "", bizCodeName: "" },
        field: "",
        selectedValue: "", // field in the autoselect
    });
    const { clientAdminData, field, selectedValue } = data;

    useEffect(() => {
        if (selectedValue) {
            setData({ ...data, field: selectedValue });
        }
    }, [selectedValue]);

    const dispatch = useStoreDispatch();

    const styles = getStyles();

    //error options: bizName or field
    const [fieldError, setFieldError] = useState(null);
    const autocompleteUrl = `/api/user/pre-register/fields-list?limit=20`;

    const generateThisBizCode = () => {
        const thisBizName = clientAdminData.bizName;
        if (thisBizName) {
            const finalDashedName = generateBizCodeName(thisBizName);
            setValObjWithStr(
                data,
                "clientAdminData.bizCodeName",
                finalDashedName
            );
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
                    onChange={handleChange(setData, data, true)}
                    error={fieldError === "bizName" ? true : false}
                    variant="outlined"
                    margin="dense"
                    name="clientAdminData.bizName"
                    value={clientAdminData.bizName}
                    onKeyPress={(e) => {
                        handleNextField(e, "field1");
                        setValObjWithStr(
                            data,
                            "clientAdminData.bizName",
                            clientAdminData.bizName.cap()
                        );
                    }}
                    onBlur={(e) => {
                        handleNextField(e, "field1", { event: "onBlur" });
                        generateThisBizCode();
                        setValObjWithStr(
                            data,
                            "clientAdminData.bizName",
                            clientAdminData.bizName.cap()
                        );
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
                    }}
                />
            </div>
            <div id="field2" className={`mt-3`}>
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
                />
            </div>
        </form>
    );

    const handleContinue = async () => {
        if (!clientAdminData.bizName) {
            setFieldError("bizName");
            return showSnackbar(
                dispatch,
                "Informe nome do seu negócio",
                "error"
            );
        }

        if (!field) {
            setFieldError("field");
            return showSnackbar(
                dispatch,
                "Informe ramo de atividade.",
                "error"
            );
        }

        const data = [{ doneBizInfo: true }, { field }, { clientAdminData }];
        await setMultiVar(data, store.pre_register);
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
