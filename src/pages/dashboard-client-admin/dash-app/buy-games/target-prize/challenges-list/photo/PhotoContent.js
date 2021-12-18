import { useState, useEffect } from "react";
import UploadBtn from "components/multimedia/UploadBtn";
import GiftBox from "pages/mobile-app/content/bottom-menu-contents/all-games/target-prize/gift-box/GiftBox";
import { useBizData } from "init";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { setTargetPrizeImg } from "api";

export default function PhotoContent({
    modalData,
    handleCloseModal,
    newImg,
    setNewImg,
}) {
    const {
        savedPrizeImg, // when the user already uploaded
        challId,
        targetPoints,
    } = modalData;

    const [prizeImg, setPrizeImg] = useState(null);
    const {
        bizLinkName,
        themePColor: colorP,
        themeBackColor: colorBack,
    } = useBizData();

    useEffect(() => {
        // first check if there is a newImg set here. Otherwise if savedImg is null, it will returns falsy result
        if (!newImg && !savedPrizeImg) return;
        setPrizeImg(newImg || savedPrizeImg);
    }, [savedPrizeImg, newImg]);

    const showTitle = () => (
        <div className="mt-4 mx-3 text-purple">
            <h1 className="text-subtitle text-center font-weight-bold">
                {prizeImg ? "Edição" : "Envio"} Foto Prêmio
            </h1>
            {prizeImg ? (
                <p className="text-normal">
                    No app dos seus clientes, a foto do prêmio é mostrada toda
                    vez que é clicado na caixa de prêmio.
                </p>
            ) : (
                <p className="text-normal">
                    Envie uma foto do prêmio para empolgar visualmente seus
                    clientes nas compras
                </p>
            )}
        </div>
    );

    const handleUpload = (result) => {
        const removedImg = !result.uploadedPic;
        setPrizeImg(removedImg ? null : result.img);

        if (removedImg) setNewImg(null);
        else setNewImg(result.img);
    };

    const showMainContent = () => {
        if (prizeImg) {
            return (
                <div
                    style={{
                        margin: "80px 0 15px",
                    }}
                    className="position-relative animated fadeInUp"
                >
                    <GiftBox
                        className="bounce repeat-2 delay-3s"
                        boxPColor={colorP}
                        backColor={colorBack}
                        targetPoints={targetPoints}
                        prizeImg={prizeImg}
                        callback={null}
                        disableOpenBox={false}
                        needSmallBox={false}
                        // prizeDesc={prizeDesc} doesn't inserted to display img
                    />
                    <p className="text-center text-normal text-white text-shadow">
                        Clique na caixa
                    </p>
                    {showSvgBackGiftBoxBlob(
                        `var(--themeBackColor--${colorBack})`
                    )}
                </div>
            );
        }

        return (
            <div className="container-center">
                <img
                    className="img-center"
                    src="/img/illustrations/media/photo-prize-target.svg"
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
                {prizeImg && (
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
                    urlFunc={setTargetPrizeImg}
                    loadingMsg="Adicionando..."
                    callback={handleUpload}
                    body={{
                        challId,
                        nameId: bizLinkName, // this will be like nameId_photoName
                        targetImg: prizeImg, // only for remove mode
                        folder: "target-prize-game-pics", // folder to be stored in the provider
                        tags: "cliente-admin",
                        backup: false,
                    }}
                    alreadyUploaded={Boolean(prizeImg)}
                />
            </div>
            {!prizeImg && (
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
                    dispositivo do cliente e fica centralizado com altura de
                    acordo com sua foto e largura de até 230px.
                </section>
            )}
        </section>
    );
}

function showSvgBackGiftBoxBlob(fill = "#FF0066") {
    return (
        <section
            style={{
                position: "absolute",
                top: -130,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -10,
            }}
        >
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                    fill={fill}
                    d="M43.5,-37.5C57.8,-29.2,71.7,-14.6,74.7,3C77.7,20.7,69.8,41.3,55.6,50.8C41.3,60.3,20.7,58.6,-0.8,59.4C-22.2,60.2,-44.5,63.5,-52.7,54C-60.9,44.5,-55.2,22.2,-55.7,-0.6C-56.3,-23.4,-63.2,-46.7,-55,-55C-46.7,-63.2,-23.4,-56.2,-4.4,-51.9C14.6,-47.5,29.2,-45.7,43.5,-37.5Z"
                    transform="translate(100 100)"
                />
            </svg>
        </section>
    );
}

/* COMMENTS
n1: The difference between FormData. set and append() is that if the specified key already exists, FormData. set will overwrite all existing values with the new one, whereas append() will append the new value onto the end of the existing set of values
*/
