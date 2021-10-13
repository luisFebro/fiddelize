import { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";

import ShowImgOrSpinner from "../../../components/ShowImgOrSpinner";
import handleChangeForm from "../../../utils/form/use-state/handleChangeForm";
import isSmallScreen from "../../../utils/isSmallScreen";
import ToggleVisibilityPassword from "../../../components/forms/fields/ToggleVisibilityPassword";
import BackUpToExcel from "./BackUpToExcel";
// Redux
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import {
    readAdmin,
    updateConfig,
    readVerificationPass,
} from "../../../redux/actions/adminActions";
import "./style.scss";

export default function UpdateConfigForm() {
    const [showSpinner, setShowSpinner] = useState(true);
    const [imgMsg, setImgMsg] = useState(false);

    const [data, setData] = useState({
        trademark: "",
        siteBackgroundColor: "",
        verificationPass: "",
        formData: "",
        regulationText: "",
    });
    const {
        trademark,
        siteBackgroundColor,
        verificationPass,
        formData,
        regulationText,
    } = data;
    const dispatch = useStoreDispatch();

    const getBackgroundColor = () => {
        readAdmin(dispatch).then((res) => {
            // if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
            setData({
                siteBackgroundColor: res.data.siteBackgroundColor,
                regulationText: res.data.regulationText,
                formData: new FormData(), // formData isdeclared here, otherwise will be undefined.
            });
        });
    };

    const init = () => {
        readVerificationPass().then((res) => {
            if (res.status !== 200)
                return showSnackbar(dispatch, res.data.msg, "error");
            setData({
                ...data,
                verificationPass: res.data.verificationPass,
            });
            getBackgroundColor();
        });
    };

    useEffect(() => {
        init();
    }, []);

    const updateData = () => {
        updateConfig(dispatch, formData).then((res) => {
            if (res.status !== 200)
                return showSnackbar(dispatch, res.data.msg, "error");
            window.location.reload();
            showSnackbar(
                dispatch,
                "A sua configuração foi efutuada",
                "success"
            );
        });
    };

    // const updateRegText = () => {
    //     showSnackbar(dispatch, "Atualizando Texto...", 'warning', 6000);
    //     const objToSend = {
    //         regulationText,
    //     }
    //     updateAdmin(dispatch, objToSend)
    //     .then(res => {
    //         if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
    //         showSnackbar(dispatch, "Texto acabou de ser atualizado!", 'success');
    //     })
    // }

    // const showRegulationText = () => (
    //     <div className="margin-auto-90">
    //         <p className="text-center text-main-container font-weight-bold">
    //             Editar Texto - Regras Pontos Fidelidade:
    //         </p>
    //         <div className="container-center text-break text-normal">
    //             <TextField
    //                 style={{fontSize: '1.3em'}}
    //                 multiline
    //                 rows={10}
    //                 name="regulationText"
    //                 value={regulationText === "" ? "Carregando..." : regulationText}
    //                 onChange={handleChange(setData, data)}
    //                 variant="outlined"
    //                 fullWidth
    //                 placeholder="Regras para ponto fidelidade"
    //                 margin="dense"
    //             />
    //         </div>
    //         <div className="d-flex justify-content-end mr-2">
    //             <Link to="/:bizLinkName/regras">
    //                 <ButtonMulti
    //                     onClick={updateRegText}
    //                     color="var(--mainWhite)"
    //                     backgroundColor="var(--mainPink)"
    //                     backColorOnHover="var(--mainPink)"
    //                     iconFontAwesome="fas fa-file-alt"
    //                     textTransform='uppercase'
    //                 >
    //                     Ver Página
    //                 </ButtonMulti>
    //             </Link>
    //             <ButtonMulti
    //                 onClick={updateRegText}
    //                 color="var(--mainWhite)"
    //                 backgroundColor="var(--mainPink)"
    //                 backColorOnHover="var(--mainPink)"
    //                 iconFontAwesome="fas fa-exchange-alt"
    //                 textTransform='uppercase'
    //             >
    //                 Atualizar
    //             </ButtonMulti>
    //         </div>
    //     </div>
    // )

    const showImageUploader = () => {
        const displayImg = (idImg) => (
            <div className="mr-md-5">
                <span>
                    <p
                        style={{ backgroundColor: "grey" }}
                        className="text-white py-2 text-center font-weight-bold"
                    >
                        Imagem Atual:
                    </p>
                </span>
                <div className="border-dashed-grey">
                    <ShowImgOrSpinner
                        url="admin"
                        id="5db4301ed39a4e12546277a8" // admin id
                        alt="logomarca studio love beauty"
                        width="200px"
                        height="100px"
                        setStatus={setShowSpinner}
                        status={showSpinner}
                        imgOpt={{
                            className: "image-apresentation",
                        }}
                    />
                </div>
            </div>
        );

        const displayPicker = () => (
            <div>
                <input
                    accept="image/*"
                    onChange={handleChangeForm(
                        setData,
                        data,
                        formData,
                        "trademark"
                    )}
                    name="trademark"
                    style={{ display: "none" }}
                    id="contained-button-file"
                    type="file"
                />
                <label htmlFor="contained-button-file">
                    <ButtonMulti
                        onClick={null}
                        color="var(--mainWhite)"
                        component="span"
                        backgroundColor="var(--mainDark)"
                        backColorOnHover="var(--mainDark)"
                        iconFontAwesome="fas fa-upload"
                        textTransform="uppercase"
                    >
                        Nova Imagem
                    </ButtonMulti>
                </label>
                <div
                    style={{
                        display:
                            typeof trademark === "object" ? "block" : "none",
                    }}
                >
                    <p
                        style={{ backgroundColor: "var(--mainDark)" }}
                        className="text-center text-white"
                    >
                        Nova imagem inserida. Salve para alterar
                    </p>
                </div>
            </div>
        );

        return (
            <div className="mt-4">
                <p className="text-normal font-weight-bold">
                    Trocar Imagem da Logomarca:
                </p>
                <div className="d-flex flex-column flex-md-row justify-content-md-center align-items-md-center">
                    {displayImg()}
                    {displayPicker()}
                </div>
            </div>
        );
    };

    const showVerificationPassField = () => (
        <div className="mt-4">
            <p className="text-normal font-weight-bold">
                Mudar senha de verificação:
            </p>
            <div style={{ margin: "auto", width: "60%" }}>
                <ToggleVisibilityPassword
                    showForgotPass={false}
                    onChange={handleChangeForm(setData, data, formData)}
                    data={data}
                    label=" "
                    name="verificationPass"
                    value={verificationPass}
                    setData={setData}
                />
            </div>
        </div>
    );

    const showColorPicker = () => (
        <div className="mt-4">
            <p className="text-normal my-2 font-weight-bold">
                Escolha outra cor de fundo do site:
            </p>
            <div className="d-flex flex-row">
                <div className="mr-3 font-weight-bold">
                    {`${isSmallScreen() ? "Toque" : "Clique"} e Selecione:`}
                </div>
                <div className="input-color-container mr-3 border-dashed-grey">
                    <input
                        onChange={handleChangeForm(setData, data, formData)}
                        name="siteBackgroundColor"
                        className="input-color"
                        type="color"
                        value={data && siteBackgroundColor}
                    />
                </div>
            </div>
        </div>
    );

    const showActionButton = () => (
        <div className="my-2 d-flex justify-content-center">
            <ButtonMulti
                onClick={() => {
                    updateData();
                    showSnackbar(
                        dispatch,
                        "Salvando suas preferências...",
                        "warning",
                        5000
                    );
                }}
                color="var(--mainWhite)"
                backgroundColor="var(--mainPink)"
                backColorOnHover="var(--mainPink)"
                iconFontAwesome="fas fa-save"
                textTransform="uppercase"
            >
                Salvar
            </ButtonMulti>
        </div>
    );
    return (
        <Card
            className="container-center"
            style={{ margin: "0 auto 600px", width: "90%" }}
        >
            <form className="py-5 px-2">
                {showRegulationText()}
                <BackUpToExcel />
                {showImageUploader()}
                {showVerificationPassField()}
                {showColorPicker()}
                {showActionButton()}
            </form>
        </Card>
    );
}
