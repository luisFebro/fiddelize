import { Fragment, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import Button from "@material-ui/core/Button";

const isSmall = window.Helper.isSmallScreen();

export default function DownloadAppGuide({ bizName }) {
    const [open, setOpen] = useState(true);
    const [moreOpts, setMoreOpts] = useState(false);

    const showMoreOptions = () => (
        <Fragment>
            <h2 className="my-3 text-normal font-weight-bold text-center">
                Mais Opções
            </h2>
            <p>
                - Verifique sua conexão. Mesmo que tenha aparecido uma mensagem
                de instalação bem-sucedida, às vezes, o download pode demorar
                alguns segundos.
            </p>
            <div>
                - Tente arrastar o ícone do app para sua tela caso seu
                dispositivo tenha a opção abaixo:
                <div className="my-3 container-center">
                    <img
                        className="shadow-babadoo"
                        src="/img/demos/pwa/add-to-home-drag-and-drop-option.jpg"
                        width="260px"
                        height="auto"
                        alt="botão abri app desktop"
                    />
                </div>
                <p>
                    Assim você sabe exatamente onde instalou o app. Ajuda a
                    localizar caso tenha muitos apps.
                </p>
            </div>
            <p>
                Em último caso, você pode usar o app da{" "}
                <strong>{bizName}</strong> direto do seu navegador favorito
                acessando de qualquer dispositivo com internet via{" "}
                <strong>fiddelize.com.br/app</strong>.
            </p>
        </Fragment>
    );

    const mainContent = () => (
        <section className="mx-3 font-site text-em-1-1 text-purple">
            <h2 className="my-3 text-normal font-weight-bold text-center">
                Guia baixar app
            </h2>
            {isSmall ? (
                <section>
                    <div className="mt-3">
                        Se a placa para baixar o app não aparecer em até 30
                        segundos nesta página, você pode baixar manualmente
                        seguindo os 3 passos a seguir.
                        <br />
                        <br />
                        <p>
                            1) clique no botão no canto superior (três pontos ou
                            similar) para mostrar mais opções nesta mesma
                            página.
                        </p>
                        <div className="my-3 container-center">
                            <img
                                src="/img/demos/pwa/not-found-app-instru-1.jpg"
                                width="310px"
                                className="shadow-babadoo"
                                height="auto"
                                alt="botão abri app desktop"
                            />
                        </div>
                        <p>
                            2) Nas opções, procure e clique em{" "}
                            <strong>instalar aplicativo</strong> e confirme para
                            baixar.
                        </p>
                        <div className="my-3 container-center">
                            <img
                                src="/img/demos/pwa/not-found-app-instru-2.jpg"
                                width="310px"
                                className="shadow-babadoo"
                                height="auto"
                                alt="botão abrir app desktop"
                            />
                        </div>
                        <p>
                            3) Pronto, seu app vai baixar e aparecerá na sua
                            tela inicial para rápido acesso.
                        </p>
                    </div>
                </section>
            ) : (
                <section>
                    <p>
                        No Desktop, caso não tenha encontrado o app na tela
                        inicial, você pode abrir o app com um botão similar a
                        este:
                    </p>
                    <div className="container-center">
                        <img
                            src="/img/demos/pwa/button-to-open-pwa-desktop.png"
                            width="189"
                            height="auto"
                            alt="botão abrir app desktop"
                        />
                    </div>
                    <p>
                        Caso o problema ainda persista, descreva-o para quem te
                        enviou o link para acharmos uma solução para você.
                    </p>
                </section>
            )}
            {moreOpts ? (
                showMoreOptions()
            ) : (
                <div className="container-center">
                    <Button
                        onClick={() => setMoreOpts(true)}
                        className="font-weight-bold text-underline"
                        style={{
                            color: "var(--themeP)",
                        }}
                    >
                        mais opções
                    </Button>
                </div>
            )}
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
        <div
            className="mx-3 position-relative"
            style={{
                top: -50,
            }}
        >
            <ButtonFab
                title="Guia baixar app"
                color="#fff"
                backgroundColor="var(--themeSDark)"
                onClick={() => setOpen((prev) => !prev)}
                position="relative"
                variant="extended"
                width="100%"
                size="large"
            />
        </div>
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
