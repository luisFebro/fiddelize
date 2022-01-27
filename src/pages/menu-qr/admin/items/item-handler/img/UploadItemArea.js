import { useState, useEffect, Fragment } from "react";
import showToast from "components/toasts";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import useData from "init";
import Spinner from "components/loadingIndicators/Spinner";
import getAPI, { setImgToProvider } from "api";
import DeleteButton from "components/buttons/DeleteButton";

export default function UploadItemArea({
    setMainData,
    savedImg,
    isMultiple = false,
    body = {},
    callback,
    alreadyUploaded = false,
    urlFunc = () => null, // url request path from api
    // loadingMsg = "Salvando...",
    // selectMsg = "Selecione foto",
    // removeMsg = "Remover",
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

    const showAddImgArea = () => (
        <section className="container-center-col" style={{ minHeight: 250 }}>
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
                type="file"
                multiple={isMultiple}
            />
            <label
                className="container-center-col position-relative"
                style={{
                    cursor: "pointer",
                    width: "100%",
                    padding: 100,
                    zIndex: 1000,
                }}
                htmlFor="uploaded-file"
            >
                <AddAPhotoIcon
                    style={{ color: "var(--mainWhite)", fontSize: 35 }}
                />
                <p className="text-small text-white text-shadow">
                    adicione
                    <br />
                    imagem
                </p>
            </label>
        </section>
    );

    const showSavedImg = () => (
        <section className="position-relative" style={{ minHeight: 250 }}>
            <img
                src={savedImg}
                style={{
                    maxHeight: 500,
                }}
                width="100%"
                alt="imagem"
            />
            <section
                className="position-absolute"
                style={{
                    bottom: 10,
                    right: 10,
                }}
            >
                <DeleteButton
                    onClick={() => {
                        removeImg({ folder: body.folder, savedImg });
                        showToast("Imagem removida", { type: "success" });
                        setMainData((prev) => ({
                            ...prev,
                            img: null,
                        }));
                    }}
                />
            </section>
        </section>
    );

    if (loading) {
        return (
            <section className="container-center" style={{ minHeight: 250 }}>
                <Spinner size="large" />
            </section>
        );
    }

    return <Fragment>{savedImg ? showSavedImg() : showAddImgArea()}</Fragment>;
}

// HELPERS
async function removeImg(data) {
    return await getAPI({
        method: "post",
        url: setImgToProvider(),
        body: {
            mode: "remove",
            img: data.savedImg,
            folder: data.folder, // folder to be stored in the provider
        },
        fullCatch: true,
    });
}

// async function updateImg(data) {
//     return await getAPI({
//         method: "post",
//         url: setImgToProvider(),
//         body: {
//             mode: "update",
//             folder: data.folder, // folder to be stored in the provider
//             tags: data.tags,
//             nameId: data.nameId,
//             img: data.savedImg,
//         },
//         fullCatch: true,
//     });
// }
// END HELPERS
