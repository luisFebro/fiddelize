import { Fragment, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ButtonLink from "components/buttons/material-ui/ButtonLink";

const isSmall = window.Helper.isSmallScreen();

/*
<p>
    1) Verifique sua conexão. Mesmo que tenha aparecido uma
    mensagem de instalação bem-sucedida, às vezes, o
    download pode demorar alguns segundos.
</p>
<div>
    2) Tente arrastar o ícone caso seu dispositivo tenha a
    opção abaixo:
    <div className="container-center">
        <img
            src="/img/demos/pwa/add-to-home-drag-and-drop-option.jpg"
            width="260px"
            height="auto"
            alt="botão abri app desktop"
        />
    </div>
    Assim você sabe exatamente onde instalou o app. Ajuda a
    localizar caso tenha muitos apps.
</div>

<p className="mt-3">
    Seguindo essas soluções, agora o app web já deve está
    disponível na sua tela inicial.
</p>
<p>
    Caso o problema ainda persista, descreva-o, informe a
    marca do seu celular e se você usa android ou Iphone
    para quem te enviou o link para acharmos uma solução
    para você.
</p>
 */

export default function DownloadAppGuide() {
    const [open, setOpen] = useState(false);

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
                        seguindo 3 passos.
                        <br />
                        <br />
                        <p>
                            1) clique no botão no canto superior (3 pontos ou
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
                    <p className="mt-3">
                        Seguindo essas soluções, agora o app web já deve está
                        disponível na sua tela inicial.
                    </p>
                    <p>
                        Caso o problema ainda persista, descreva-o para quem te
                        enviou o link para acharmos uma solução para você.
                    </p>
                    <ButtonLink title="mais soluções" />
                </section>
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
