import { useState, useEffect } from "react";
import UploadBtn from "components/multimedia/UploadBtn";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { setBizReceiptImg } from "api";
import { getCurrMonth } from "utils/dates/dateFns";

export default function PhotoContent({
    modalData,
    handleCloseModal,
    newImg,
    setNewImg,
}) {
    const {
        savedImg, // when the user already uploaded
        imgId,
        month = getCurrMonth(),
        year = new Date().getFullYear(),
    } = modalData;
    const subject = "comprovante";

    const [targetImg, setTargetImg] = useState(null);

    useEffect(() => {
        // first check if there is a newImg set here. Otherwise if savedImg is null, it will returns falsy result
        if (!newImg && !savedImg) return;
        setTargetImg(newImg || savedImg);
    }, [savedImg, newImg]);

    const showTitle = () => (
        <div className="mt-4 mx-3 text-purple">
            <h1 className="text-subtitle text-center font-weight-bold">
                {targetImg ? "Edição" : "Envio"} Foto
                <br />
                {subject.cap()}
            </h1>
            <p className="text-normal">
                Envie foto de notas fiscais, recibos para registro dos custos da
                Fiddelize
            </p>
        </div>
    );

    const handleUpload = (result) => {
        const removedImg = !result.uploadedPic;
        setTargetImg(removedImg ? null : result.img);

        if (removedImg) setNewImg(null);
        else setNewImg(result.img);
    };

    const showMainContent = () => {
        if (targetImg) {
            return (
                <div
                    style={{
                        margin: "20px 0",
                    }}
                    className="position-relative animated fadeInUp"
                >
                    <img
                        className="img-center shadow-babadoo"
                        src={targetImg}
                        height="auto"
                        width={300}
                        alt=""
                    />
                </div>
            );
        }

        return (
            <div className="container-center">
                <img
                    className="img-center"
                    src="/img/illustrations/media/camera.svg"
                    alt="envio foto prêmio"
                    height="auto"
                    width="85%"
                />
            </div>
        );
    };

    return (
        <section>
            {showTitle()}
            {showMainContent()}
            <div className="container-center-col mt-1 mx-5">
                {targetImg && (
                    <ButtonFab
                        title="Finalizar"
                        backgroundColor="var(--themeSDark)"
                        onClick={() => handleCloseModal()}
                        position="relative"
                        variant="extended"
                        size="large"
                        width="100%"
                        // textTransform="uppercase"
                    />
                )}
                <div className="mb-3" />
                <UploadBtn
                    loadingMsg="Adicionando..."
                    callback={handleUpload}
                    urlFunc={setBizReceiptImg}
                    body={{
                        imgId,
                        nameId: "comprov",
                        targetImg, // only for remove mode
                        folder: `biz-receipts/${year}/${month}`, // folder to be stored in the provider, add / for subfolders. When remove an img, the folders remain intact
                        tags: "nucleo-equipe",
                        backup: false,
                        // custom
                        year,
                        month,
                    }}
                    alreadyUploaded={Boolean(targetImg)}
                />
            </div>
        </section>
    );
}

/* COMMENTS
n1: The difference between FormData. set and append() is that if the specified key already exists, FormData. set will overwrite all existing values with the new one, whereas append() will append the new value onto the end of the existing set of values
*/
