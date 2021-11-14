import { useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import showToast from "components/toasts";

export default function SendPhotoContent() {
    const showTitle = () => (
        <div className="mt-4 mx-3 text-purple">
            <h1 className="text-subtitle text-center font-weight-bold">
                Envio Foto Prêmio
            </h1>
            <p className="text-normal">
                Envie uma foto do prêmio para empolgar visualmente seus clientes
                nas compras
            </p>
        </div>
    );

    function UploadBtn() {
        const [uploadedPic, setUploadedPic] = useState("");
        const gotPic = typeof uploadedPic === "object";
        const picName = uploadedPic && uploadedPic.name;

        const handleMediaChange = (e) => {
            const formData = new FormData();

            const { name } = e.target;
            const fileValue = e.target.files[0];
            console.log("e.target", e.target);
            console.log("fileValue", fileValue);

            // Validattion
            if (!fileValue)
                return console.log(
                    "Nenhuma imagem encontrada. Tente novamente."
                );
            // Size Reference: 1mb = 1.000.000 / 1kb 1.000
            if (fileValue.size > 3000000)
                return showToast(
                    `A imagem ${fileValue.name.cap()} possui mais de 3 MB permitido. Por favor, escolha arquivo menor.`,
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

            // setIsLoadingPic(true);

            // setEditArea(false);
            // n1
            // const dataAdminClub = await getVar("clientAdminData", "pre_register");
            // const clubBizLinkName = dataAdminClub && dataAdminClub.bizLinkName;
            // // n1
            // const generatedImg = await getAPI({
            //     method: "post",
            //     url: uploadImages(clubBizLinkName || bizLinkName),
            //     body: formData,
            //     fullCatch: true,
            // }).catch(() => {
            //     setIsLoadingPic(false);
            //     showToast("Algo deu errado. Verifique sua conexão.", {
            //         type: "error",
            //     });
            // });

            return true;
        };

        return (
            <section>
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
                    <div className="mx-3 container-center">
                        <ButtonFab
                            component="span" // the button requires to be a span instead of button. Otherwise it will not work
                            title={
                                uploadedPic ? "Trocar foto" : "Selecione foto"
                            }
                            iconFontAwesome={
                                <FontAwesomeIcon
                                    icon="image"
                                    style={{ fontSize: 30 }}
                                />
                            }
                            backgroundColor="var(--themeSDark)"
                            onClick={null}
                            position="relative"
                            variant="extended"
                            size="large"
                            width="100%"
                            // textTransform="uppercase"
                        />
                        <p className="mt-3 text-grey text-small mx-3 position-relative">
                            formatos: <strong>.jpg, .png, .svg, .ai</strong>
                        </p>
                    </div>
                </label>
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
                        A foto
                        <br />
                        <span className="font-weight-bold">{picName}</span>
                        <br />
                        foi carregada!
                        <br />
                        <br />
                    </span>
                </div>
            </section>
        );
    }

    return (
        <section>
            {showTitle()}
            <div
                style={{
                    margin: "20px",
                }}
            >
                <img
                    className="img-center"
                    src="/img/illustrations/games/photo-prize-target.svg"
                    alt="envio foto prêmio"
                    height="auto"
                    width="85%"
                />
            </div>
            <div className="mt-3">
                <UploadBtn />
            </div>
            <section className="mx-3 mb-5 text-purple text-normal">
                <div className="container-center">
                    <h2 className="text-pill d-flex text-normal font-weight-bold">
                        Dicas para foto
                    </h2>
                </div>
                <p>
                    Uma foto do prêmio incrível segue{" "}
                    <strong>3 simples critérios</strong>:
                </p>
                <p>1) a imagem é nítida, evitando imagens embaçadas;</p>
                <p>
                    2) possui iluminação adequada, evitando muito flash da
                    câmera ou imagens apagadas;
                </p>
                <p>
                    3) tem uma distância apropriada, não muito distante da
                    câmera;
                </p>
                O formato da foto do prêmio é adaptado de acordo com o
                dispositivo do cliente e fica centralizado com até 300px de
                largura e altura é de acordo com sua foto original.
            </section>
        </section>
    );
}

/* COMMENTS
n1: The difference between FormData. set and append() is that if the specified key already exists, FormData. set will overwrite all existing values with the new one, whereas append() will append the new value onto the end of the existing set of values
*/
