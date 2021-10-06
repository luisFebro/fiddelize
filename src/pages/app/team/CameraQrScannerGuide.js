import { Fragment, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import CameraAltIcon from "@material-ui/icons/CameraAlt";

export default function CameraQrScannerGuide() {
    const [open, setOpen] = useState(false);

    const mainContent = () => (
        <section className="mx-3 font-site text-em-1-1 text-purple">
            <h2 className="my-3 text-normal font-weight-bold text-center">
                Guia ativar câmera escaneador
            </h2>
            <section>
                <div className="mt-3">
                    Quando você entra nesta página, uma placa é automaticamente
                    exibida para confirmar a{" "}
                    <strong>autorização da sua câmera</strong> para ser usada
                    como escaneador do código QR.
                    <div className="my-3 container-center">
                        <img
                            src="/img/demos/qr-camera-scanner/pic-1.png"
                            width="310px"
                            className="shadow-babadoo"
                            height="auto"
                            alt="placa de permissão"
                        />
                    </div>
                    <p>
                        Neste pequeno guia, mostramos o passo a passo para
                        ativar a câmera se a placa não apareceu.
                    </p>
                    <p>
                        Para começar, vá nas configurações do seu dispositivo e
                        procure a opção apps.
                    </p>
                    <div className="my-3 container-center">
                        <img
                            src="/img/demos/qr-camera-scanner/pic-2.png"
                            width="310px"
                            className="shadow-babadoo"
                            height="auto"
                            alt="opção apps"
                        />
                    </div>
                    <p>
                        Basta procurar pelo seu navegador. Os mais comuns são
                        Firefox, Chrome, Edge e Opera.
                    </p>
                    <p>
                        Abrindo as opções do navegador, você vai encontrar a
                        opção câmera. Basta ativar e voltar para o app.
                    </p>
                    <div className="my-3 container-center">
                        <img
                            src="/img/demos/qr-camera-scanner/pic-3.png"
                            width="310px"
                            className="shadow-babadoo"
                            height="auto"
                            alt="opção câmera"
                        />
                    </div>
                    <p>
                        Pronto! A placa deve aparecer normalmente. Clique em
                        permitir e a câmera deve funcionar corretamente.
                    </p>
                    <p>
                        Se ainda não apareceu ou caso tenha rejeitado a placa
                        anteriormente, você precisa acessar as opções
                        diretamente do seu navegador.
                    </p>
                    <p>
                        Acesse seu app no navegador via{" "}
                        <strong className="text-link">
                            https://fiddelize.com.br/app
                        </strong>
                        . Em seu navegador, procure por configurações =>
                        permissões => ativar câmera.
                    </p>
                    <p>
                        O seu app roda em cima da tecnologia dos navegadores
                        modernos. E, por isso, permissões são feitas diretamente
                        pelo navegador ao invés do app.
                    </p>
                    <p>
                        Seguindo esses passos, sua câmera já deve está
                        funcionando. Caso tenha alguma dúvida adicional ou se o
                        problema persistir, contate nosso suporte.
                    </p>
                </div>
            </section>
            <div className="py-5 mx-3">
                <ButtonFab
                    title="Entendi"
                    color="#fff"
                    backgroundColor="var(--themeSDark)"
                    onClick={() => setOpen((prev) => !prev)}
                    position="relative"
                    variant="extended"
                    width="100%"
                    size="large"
                />
            </div>
        </section>
    );

    const showActionBtn = () => (
        <section className="mx-3 text-normal camera-scanner-guide container-center-col">
            <div className="container-center mt-4">
                <CameraAltIcon
                    style={{ fontSize: 50, color: "var(--themeP)" }}
                />
            </div>
            <p className="text-purple mx-3" style={{ textShadow: "none" }}>
                A câmera <strong>não</strong> apareceu?
            </p>
            <div className="mb-3">
                <ButtonFab
                    title="Abrir guia câmera"
                    color="#fff"
                    backgroundColor="var(--themeSDark)"
                    onClick={() => setOpen((prev) => !prev)}
                    position="relative"
                    variant="extended"
                    width="100%"
                    size="large"
                />
            </div>
            <style jsx>
                {`
                    .camera-scanner-guide {
                        background-color: var(--mainWhite);
                        border-radius: 15px;
                    }
                `}
            </style>
        </section>
    );

    return (
        <Fragment>
            {showActionBtn()}
            <Dialog
                PaperProps={{ style: { backgroundColor: "var(--mainWhite)" } }}
                style={{ zIndex: 9000 }}
                open={open}
                aria-labelledby="form-dialog-title"
                className="animated slideInLeft faster"
            >
                {mainContent()}
            </Dialog>
        </Fragment>
    );
}
