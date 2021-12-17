import { useState, useEffect } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import showToast from "components/toasts";
import getAPI from "api";
import useData from "init";

export default function UploadBtn({
    isMultiple = false,
    body = {},
    callback,
    loadingMsg = "Salvando...",
    selectMsg = "Selecione foto",
    removeMsg = "Remover",
    alreadyUploaded = false,
    urlFunc = () => null, // url request path from api
}) {
    const [uploadedPic, setUploadedPic] = useState(false);
    const [loading, setLoading] = useState(false);
    const { userId } = useData();

    useEffect(() => {
        if (alreadyUploaded) setUploadedPic(true);
    }, [alreadyUploaded]);

    const handleMediaChange = async (e) => {
        setLoading(true);

        // multiple photos not implemented
        const imgDataList = isMultiple ? e.target.files : e.target.files[0];

        const handleDataForm = () => {
            const formData = new FormData();
            // IMPORTANT: req.files only works if formData.set has name of file
            formData.append("file", imgDataList); // n1 - set and append diff
            // all this data below is accessed in req.body
            formData.append("userId", userId);
            formData.append("mode", "create");
            // further data for image
            Object.keys(body).forEach((field) => {
                formData.append(field, body[field]);
            });

            return formData;
        };

        // Validattion
        if (!imgDataList)
            return console.log("Nenhuma imagem encontrada. Tente novamente.");
        // Size Reference: 1mb = 1.000.000 / 1kb 1.000
        if (imgDataList.size > 3000000)
            return showToast(
                `A imagem ${imgDataList.name.cap()} possui mais de 3 MB permitido. Por favor, escolha arquivo menor.`,
                { type: "error" }
            );

        if (uploadedPic && !body.targetImg) {
            return showToast(
                "Algo deu errado ao remover a foto. Feche esta tela e entre novamente.",
                { type: "error" }
            );
        }

        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/gif",
            "image/svg",
            "image/svg+xml",
            "image/ai",
        ];
        if (allowedTypes.every((type) => imgDataList.type !== type)) {
            return showToast(
                ` Formato '${imgDataList.type.cap()}' não é suportado.`,
                { type: "error" }
            );
        }
        // End Validation

        const img = await getAPI({
            method: "post",
            url: urlFunc(),
            body: handleDataForm(),
            headers: {
                "content-type": "multipart/form-data",
            },
            fullCatch: true,
        }).catch(() => {
            setLoading(false);
            showToast("Algo deu errado. Verifique sua conexão.", {
                type: "error",
            });
            callback({
                img: null,
                loading: false,
                picName: null,
                uploadedPic: false,
            });
        });

        setUploadedPic(true);
        setLoading(false);

        if (typeof callback !== "function") return null;

        const picName = imgDataList && imgDataList.name;

        return callback({
            img,
            loading,
            picName,
            uploadedPic: true,
        });
    };

    const handleTitle = () => {
        if (loading) return uploadedPic ? "Removendo..." : loadingMsg;
        return uploadedPic ? removeMsg : selectMsg;
    };

    return (
        <section>
            <input
                accept="image/*"
                onChange={uploadedPic ? undefined : handleMediaChange}
                onClick={
                    uploadedPic
                        ? async () => {
                              setLoading(true);

                              await removeImg({ ...body, urlFunc, userId });

                              setUploadedPic(false);
                              setLoading(false);

                              showToast("Foto removida com sucesso", {
                                  type: "success",
                              });

                              return callback({
                                  img: null,
                                  loading: false,
                                  picName: null,
                                  uploadedPic: false,
                              });
                          }
                        : undefined
                }
                name="file"
                style={{ display: "none" }}
                id="uploaded-file"
                type={uploadedPic ? undefined : "file"}
                multiple={isMultiple}
            />
            <label htmlFor="uploaded-file">
                <div className="container-center-col">
                    <ButtonFab
                        disabled={loading}
                        component="span" // the button requires to be a span instead of button. Otherwise it will not work
                        title={handleTitle()}
                        iconFontAwesome={
                            !loading && (
                                <FontAwesomeIcon
                                    icon="image"
                                    style={{ fontSize: 30 }}
                                />
                            )
                        }
                        backgroundColor={
                            uploadedPic
                                ? "var(--expenseRed)"
                                : "var(--themeSDark)"
                        }
                        onClick={null}
                        position="relative"
                        variant="extended"
                        size={uploadedPic ? "small" : "large"}
                        width={uploadedPic ? undefined : "100%"}
                        // textTransform="uppercase"
                    />
                    {!uploadedPic && (
                        <p className="mt-3 text-grey text-small mx-3 position-relative">
                            formatos: <strong>.jpg, .png, .svg, .ai</strong>
                        </p>
                    )}
                </div>
            </label>
        </section>
    );
}

export async function removeImg(data) {
    return await getAPI({
        method: "post",
        url: data.urlFunc(),
        body: {
            mode: "remove",
            userId: data.userId,
            nameId: data.nameId, // this will be like nameId_photoName,
            imgId: data.imgId, // imgId is the elem id where the img is in it
            img: data.targetImg,
            folder: data.folder, // folder to be stored in the provider
            ...data,
        },
        fullCatch: true,
    });
}
