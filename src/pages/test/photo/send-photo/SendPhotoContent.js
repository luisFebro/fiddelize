import { useState, useEffect } from "react";
import UploadBtn from "components/multimedia/UploadBtn";

export default function SendPhotoContent({
    savedPrizeImg, // when the user already uploaded
}) {
    const [prizeImg, setPrizeImg] = useState(null);

    useEffect(() => {
        if (!savedPrizeImg) return;
        setPrizeImg(savedPrizeImg);
    }, [savedPrizeImg]);

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

    const handleUpload = (result) => {
        const removedImg = !result.uploadedPic;
        setPrizeImg(removedImg ? null : result.img);
    };

    const showMainContent = () => {
        if (prizeImg) {
            return (
                <div className="animated fadeInUp">
                    <img
                        className="img-center"
                        src={prizeImg || "/img/error.png"}
                        alt="envio foto prêmio"
                        height="auto"
                        width={300}
                    />
                </div>
            );
        }

        return (
            <img
                className="img-center"
                src="/img/illustrations/games/photo-prize-target.svg"
                alt="envio foto prêmio"
                height="auto"
                width="85%"
            />
        );
    };

    return (
        <section>
            {showTitle()}
            <div
                style={{
                    margin: "20px",
                }}
            >
                {showMainContent()}
            </div>
            <div className="mt-3">
                <UploadBtn
                    loadingMsg="Adicionando..."
                    callback={handleUpload}
                    body={{
                        challId: "bhmTQYAM7lSJo-kVavxy",
                        folder: "target-prize-game-pics", // folder to be stored in the provider
                        tags: "cliente-admin",
                        backup: false,
                        prizeImg, // only for remove mode
                    }}
                />
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
