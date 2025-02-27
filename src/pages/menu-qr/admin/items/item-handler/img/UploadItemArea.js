import { useState, useEffect, Fragment } from "react";
import showToast from "components/toasts";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import useData from "init";
import getAPI, { setImgToProvider } from "api";
import RadiusBtn from "components/buttons/RadiusBtn";

export default function UploadItemArea({
    savedImg,
    isCustomer = false,
    isMultiple = false,
    body = {},
    callback,
    alreadyUploaded = false,
    urlFunc = () => null, // url request path from api
    isShowItem,
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
        setUploadedPic(false);
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

        setUploadedPic(true);
        setLoading(false);

        if (typeof callback !== "function") return null;

        const picName = imgDataList && imgDataList.name;

        if (!savedImg) {
            callback({
                img: URL.createObjectURL(imgDataList),
                loading,
                picName,
                uploadedPic: true,
            });
        }

        const ultimateImg = await getAPI({
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

        callback({
            img: ultimateImg,
            loading,
            picName,
            uploadedPic: true,
            finishedUpload: true,
        });
    };

    const showAddImgArea = () => (
        <section className="container-center-col" style={{ minHeight: 250 }}>
            {isCustomer ? (
                //   Falha ao carregar
                <p className="text-small text-white text-shadow"></p>
            ) : (
                <Fragment>
                    <input
                        accept="image/*;capture=camera"
                        onChange={handleMediaChange}
                        onClick={undefined}
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
                </Fragment>
            )}
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
            {!isShowItem && (
                <section
                    className="position-absolute"
                    style={{
                        bottom: 10,
                        right: 10,
                    }}
                >
                    <RadiusBtn
                        position="relative"
                        backgroundColor="var(--mainRed)"
                        title="remover imagem"
                        size="extra-small"
                        fontSize="15px"
                        onClick={async () => {
                            if (savedImg && savedImg.includes("blob")) return;
                            await removeImg({ folder: body.folder, savedImg });
                            showToast("Imagem removida", { type: "success" });

                            callback({
                                img: null,
                                loading: false,
                                picName: null,
                                uploadedPic: false,
                            });
                        }}
                    />
                </section>
            )}
        </section>
    );

    return <Fragment>{savedImg ? showSavedImg() : showAddImgArea()}</Fragment>;
}

// HELPERS
export async function removeImg(data) {
    return await getAPI({
        method: "post",
        url: setImgToProvider(),
        body: {
            mode: "remove",
            img: data.savedImg,
            folder: data.folder, // folder to be stored in the provider
        },
        timeoutMsgOn: false,
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
