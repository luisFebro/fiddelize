import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonMulti, {
    faStyle,
} from "components/buttons/material-ui/ButtonMulti";
import CheckBoxForm from "components/CheckBoxForm";
import RadioGroupForm from "components/RadioGroupForm";
import { CLIENT_URL } from "config/clientUrl";
import showToast from "components/toasts";
import { readUser } from "api/frequent";
import getAPI, { uploadImages, updateImages } from "api";
import { deleteImage } from "utils/storage/lForage";
import { useBizData } from "init";
import getVar, { setVars } from "init/var";
import ShowActionBtns from "./ShowActionBtns";

PickLogo.propTypes = {
    step: PropTypes.number,
};

const setLogo = async ({ generatedImg, setLogoUrlPreview }) => {
    const priorAdminData = await getVar("clientAdminData", "pre_register");
    const newAdminData = { ...priorAdminData, bizLogo: generatedImg };
    await setVars(
        {
            clientAdminData: newAdminData,
            doneSSLogo: true,
        },
        "pre_register"
    );
    setLogoUrlPreview && setLogoUrlPreview(generatedImg);
};

export default function PickLogo({
    step,
    setNextDisabled,
    bizId,
    bizLinkName,
    setLogoUrlPreview,
    isFromDash = false,
}) {
    // useCount("pickLogo"); //RT 3 (OK) || COMPLETE INTERACTION RT: 49 (ATTENTION) - last rendering after running all functionalaties: 49 times.

    const [isBoxChecked, setIsBoxChecked] = useState(false);
    const [uploadedPic, setUploadedPic] = useState("");
    const [tempImgUrl, setTempImgUrl] = useState("");
    const [isLoadingPic, setIsLoadingPic] = useState(false);
    const [editArea, setEditArea] = useState(false);
    const [data, setData] = useState({
        sizeRect: false,
        sizeSquare: false,
    });

    const { sizeSquare, sizeRect } = data;
    const [needUpdateBtn, setNeedUpdateBtn] = useState(false);

    const { bizLogo } = useBizData();

    const goNext = () => setNextDisabled(false);

    const updateThisImg = (body) => {
        // body: lastUrl, paramArray, customParam
        const thisBizId = isFromDash ? bizId : undefined;
        getAPI({
            method: "put",
            url: updateImages(thisBizId),
            fullCatch: true,
            body,
        }).then((res) => {
            if (res.status !== 200)
                return showToast(res.data.msg, { type: "error" });
            setTempImgUrl(res.data);
            if (isFromDash) {
                readUser(bizId, { role: "cliente-admin" }).then((res) => {
                    if (res.status !== 200)
                        return showToast(res.data.msg, { type: "error" });
                    showToast("Formato Atualizado!", { type: "success" });
                });
            }
            if (!isFromDash) {
                (async () => {
                    await setLogo({
                        generatedImg: res.data,
                        setLogoUrlPreview,
                    });
                })();
            }
        });
    };

    useEffect(() => {
        let dataToUpdate = { lastUrl: tempImgUrl };
        if (sizeSquare) {
            dataToUpdate = { ...dataToUpdate, paramArray: ["sizeSquare"] };
            showToast("Fazendo alteração no formato da imagem...");
            updateThisImg(dataToUpdate);
            setData({ sizeRect: false });
        }
        if (sizeRect) {
            dataToUpdate = { ...dataToUpdate, paramArray: ["sizeRect"] };
            showToast("Fazendo alteração no formato da imagem...");
            updateThisImg(dataToUpdate);
            setData({ sizeSquare: false });
        }
    }, [sizeSquare, sizeRect]);

    const gotPic = typeof uploadedPic === "object";
    const picName = uploadedPic && uploadedPic.name;
    useEffect(() => {
        if (!isFromDash) {
            gotPic && tempImgUrl && goNext();
        }
    }, [gotPic, tempImgUrl, isFromDash]);

    useEffect(() => {
        if (!isFromDash) {
            if (isBoxChecked) {
                (async () => {
                    await setLogo({
                        generatedImg: "/img/official-logo-name.png",
                    });
                    goNext();
                })();
            } else {
                setNextDisabled(true);
            }
        }
    }, [isBoxChecked, isFromDash]);

    const handleMediaChange = (e) => {
        const formData = new FormData();

        const { name } = e.target;
        const fileValue = e.target.files[0];

        // Validattion
        if (!fileValue)
            return console.log("Nenhuma imagem encontrada. Tente novamente.");
        // Size Reference: 1mb = 1.000.000 / 1kb 1.000
        if (fileValue.size > 1000000)
            return showToast(
                `A imagem ${fileValue.name.cap()} possui mais de 1 MB permitido. Por favor, escolha arquivo menor.`,
                { type: "error" }
            );

        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/gif",
            "image/svg",
            "image/svg+xml",
            "image/ai",
        ];
        if (allowedTypes.every((type) => fileValue.type !== type)) {
            return showToast(
                ` Formato '${fileValue.type.cap()}' não é suportado.`,
                { type: "error" }
            );
        }
        // End Validation

        formData.set(name, fileValue); // n1 - set and append diff
        setUploadedPic(fileValue);

        setIsLoadingPic(true);

        setEditArea(false);
        // n1
        getAPI({
            method: "post",
            url: uploadImages(bizLinkName),
            body: formData,
            fullCatch: true,
        }).then((res) => {
            if (res.status !== 200) {
                setIsLoadingPic(false);
                showToast("Algo deu errado. Verifique sua conexão.", {
                    type: "error",
                });
                return;
            }
            const generatedImg = res.data;
            if (!isFromDash) {
                (async () => {
                    await setLogo({
                        generatedImg,
                        setLogoUrlPreview,
                    });
                })();
            }

            const commonActions = () => {
                setTempImgUrl(generatedImg);
                setIsLoadingPic(false);
                setEditArea(true);
            };
            if (isFromDash) {
                deleteImage("logos", "app_biz_logo").then((res) => {
                    readUser(bizId, { role: "cliente-admin" }).then((res) => {
                        if (res.status !== 200)
                            return showToast(res.data.msg, { type: "error" });
                        showToast("Nova logo salva. Alterando no app...", {
                            type: "success",
                        });
                        setNeedUpdateBtn(true);
                        commonActions();
                    });
                });
            } else {
                commonActions();
            }
        });
    };

    const showUploadingBtn = () => (
        <div className={!isFromDash && "animated rubberBand delay-3s"}>
            <input
                accept="image/*"
                onChange={handleMediaChange}
                name="file"
                style={{ display: "none" }}
                id="uploaded-file"
                type="file"
                multiple={false}
            />
            <label htmlFor="uploaded-file">
                <ButtonMulti
                    title={
                        uploadedPic || isFromDash
                            ? "Trocar Logo"
                            : "Selecione sua Logo"
                    }
                    onClick={null}
                    color="var(--mainWhite)"
                    iconFontAwesome={
                        <FontAwesomeIcon icon="image" style={faStyle} />
                    }
                    backgroundColor="var(--themeSDark)"
                    backColorOnHover="var(--themeSDark)"
                    textTransform="uppercase"
                    component="span"
                />
            </label>
            <p
                className="text-grey text-small mx-3 position-relative"
                style={{ top: -20 }}
            >
                formatos: <strong>.jpg, .png, .svg, .ai</strong>
            </p>
            <div
                style={{ display: gotPic ? "block" : "none" }}
                className="zoomIn text-center text-small text-purple"
            >
                <FontAwesomeIcon
                    className="mr-2 animated rubberBand"
                    icon="check-circle"
                    style={{
                        fontSize: "20px",
                        color: "var(--incomeGreen)",
                        animationIterationCount: 2,
                    }}
                />
                <span>
                    A image
                    <br />
                    <span className="font-weight-bold">{picName}</span>
                    <br />
                    foi carregada!
                    <br />
                    <br />
                </span>
            </div>
        </div>
    );

    const showLoadingStatus = () =>
        isLoadingPic && (
            <div
                style={{ display: gotPic ? "block" : "none" }}
                className="animated bounce text-center font-weight-bold text-small text-purple mb-3"
            >
                Enviando para app. Processando...
            </div>
        );

    const showEditArea = () =>
        editArea && (
            <div className="animated zoomIn">
                <p className="text-center text-subtitle font-weight-bold text-purple">
                    Opções de Edição
                </p>
                <RadioGroupForm setData={setData} data={data} />
            </div>
        );

    const isSquared = bizLogo && bizLogo.includes("h_100,w_100");
    const showCurrLogoForDash = () =>
        isFromDash && (
            <div className="container-center my-3">
                <img
                    className="animated zoomIn slow shadow-elevation"
                    src={bizLogo}
                    style={{
                        position: "relative",
                        margin: "15px 0",
                        boxShadow: "0 30px 40px 8px rgba(0, 0, 0, 0.35)",
                    }}
                    width={isSquared ? 100 : 190}
                    height={isSquared ? 100 : 85}
                    alt="logo"
                />
            </div>
        );

    const showLogoUploadingArea = () => (
        <section className="text-normal text-white container-center">
            <Card
                style={{
                    width: "100%",
                    backgroundColor: "var(--mainWhite)",
                    boxShadow:
                        isFromDash && "0 31px 120px -6px rgba(0, 0, 0, 0.35)",
                }}
                className="p-2 text-purple text-center text-normal font-weight-bold animated zoomIn fast"
            >
                {showLoadingStatus()}
                <section
                    className={`${isFromDash ? "mt-3" : ""} container-center`}
                >
                    <img
                        src={`${CLIENT_URL}/img/icons/picture-upload.svg`}
                        className="svg-elevation"
                        width={85}
                        height="auto"
                        alt="ícone logo"
                    />
                    <p className="text-subtitle text-purple m-0 ml-3 font-weight-bold">
                        Logo
                    </p>
                </section>
                <section>{showCurrLogoForDash()}</section>
                <section className="container-center">
                    {showUploadingBtn()}
                </section>
                <section
                    style={{ display: gotPic || isFromDash ? "none" : "block" }}
                >
                    <p className="text-normal text-purple m-0">ou</p>
                    <CheckBoxForm
                        text="Escolher depois no meu painel de controle."
                        setIsBoxChecked={setIsBoxChecked}
                    />
                </section>
                {showEditArea()}
            </Card>
            {isFromDash && (
                <ShowActionBtns
                    needUpdateBtn={needUpdateBtn}
                    titleBeforeOk="Salvando nova palheta de cores..."
                    titleAfterOk="Palheta de cores salva."
                />
            )}
        </section>
    );

    const showCondition = isFromDash ? true : step === 1;

    return (
        showCondition && (
            <div>
                {isFromDash ? (
                    <p className="text-purple text-normal text-center">
                        • Envie nova logo do App:
                    </p>
                ) : (
                    <p className="text-normal text-white text-shadow text-center">
                        • Envie a logo do seu negócio:
                    </p>
                )}
                {showLogoUploadingArea()}
            </div>
        )
    );
}

/* COMMENTS
n1: THe user`s generated link is updated on the backend, no need to do it on frontend.
*/
/* ARCHIVES
 const [effectShadow, setEffectShadow] = useState(false);
const [effectBgRemoval, setEffectBgRemoval] = useState(false);

let whichFormat;
        if(!sizeSquare && !sizeRect || sizeRect) {
            whichFormat = "sizeRect";
        } else {
            whichFormat = "sizeSquare";
        }
        console.log("whichFormat", whichFormat);
        if(effectShadow) {
            dataToUpdate = {  ...dataToUpdate, paramArray: [whichFormat, "effectShadow"] }
            showToast(dispatch, "Adicionando sombra na imagem...");
            updateThisImg(dataToUpdate);
        }
        if(effectBgRemoval) {
            dataToUpdate = {  ...dataToUpdate, paramArray: [whichFormat, "effectBgRemoval"] }
            showToast(dispatch, "Removendo fundo da imagem...");
            updateThisImg(dataToUpdate);
        }
<div className="container-center-col m-0" style={{backgroundColor: 'var(--lightGrey)'}}>
    <p className="m-0 text-center text-normal font-weight-bold text-purple">
        Efeitos:
    </p>
    <div>
        <CheckBoxForm text="Remover fundo." setIsBoxChecked={setEffectBgRemoval} />
        <CheckBoxForm text="Aplicar sombra." setIsBoxChecked={setEffectShadow} />
    </div>
</div>
 */

/* COMMENTS
n1: The difference between FormData. set and append() is that if the specified key already exists, FormData. set will overwrite all existing values with the new one, whereas append() will append the new value onto the end of the existing set of values
*/
