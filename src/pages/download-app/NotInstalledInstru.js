import { Fragment } from "react";

const isSmall = window.Helper.isSmallScreen();

export default function NotInstalledInstru() {
    return (
        <Fragment>
            {isSmall ? (
                <Fragment>
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
                    <div className="mt-3">
                        3) Por último, se ainda não apareceu na sua tela
                        inicial, instale o app manualmente.
                        <br />
                        a) clique no botão no canto superior para mostrar mais
                        opções nesta mesma página.
                        <div className="container-center">
                            <img
                                src="/img/demos/pwa/not-found-app-instru-1.jpg"
                                width="260px"
                                height="auto"
                                alt="botão abri app desktop"
                            />
                        </div>
                        <br />
                        b) Nas opções, procure e clique em{" "}
                        <strong>instalar aplicativo</strong> e confirme para
                        baixar.
                        <div className="container-center">
                            <img
                                src="/img/demos/pwa/not-found-app-instru-2.jpg"
                                width="310px"
                                height="auto"
                                alt="botão abrir app desktop"
                            />
                        </div>
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
                </Fragment>
            ) : (
                <Fragment>
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
                </Fragment>
            )}
        </Fragment>
    );
}
