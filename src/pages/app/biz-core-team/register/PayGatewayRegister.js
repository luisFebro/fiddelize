import { Fragment } from "react";
import useData from "init";
import ButtonFab from "../../../../components/buttons/material-ui/ButtonFab";
import getVar, { setVar } from "init/var";
import useBackColor from "../../../../hooks/useBackColor";
// import isThisApp from "../../../../utils/window/isThisApp";

// const isApp = isThisApp();
// register agent in the payment gateway provider (Pagseguro)
export default function PayGatewayRegister({ history, location }) {
    useBackColor("var(--themeP)");

    const isSuccess = location.search.includes(
        "successFiddelizeAuthorization=true"
    );

    // useEffect(() => {
    //     (async () => {
    //         const isDone = await getVar("donePayGateway");
    //         if (isDone)
    //             history.push(
    //                 isApp
    //                     ? "/t/app/nucleo-equipe/acesso"
    //                     : "/acesso/verificacao"
    //             );
    //     })();
    // }, []);

    return (
        <Fragment>
            {isSuccess ? (
                <GatewaySuccess history={history} />
            ) : (
                <AgentRedirect />
            )}
        </Fragment>
    );
}

function AgentRedirect() {
    const [firstName, redirectLink] = useData([
        "firstName",
        "redirectPayGatewayLink",
    ]);

    const showTitle = () => (
        <div className="my-4">
            <p className="text-center font-weight-bold  text-subtitle text-white">
                Conecte-se com o Pagseguro
            </p>
        </div>
    );

    return (
        <section className="mx-3 text-white">
            {showTitle()}
            <section>
                <p className="text-normal">
                    {firstName}, o seu dinheiro das suas vendas são depositados
                    de <strong>forma automática</strong> na sua conta do
                    Pagseguro.
                </p>
                <p className="text-normal">
                    Você precisa <strong>autorizar a Fiddelize</strong> para
                    fazer os depósitos na sua conta.
                </p>
                <p className="text-normal">
                    Acesse logo abaixo o seu{" "}
                    <strong>link de autorização</strong>.
                </p>
            </section>
            <div className="my-5 container-center">
                <a
                    className="no-text-decoration"
                    href={redirectLink}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <ButtonFab
                        size="medium"
                        title="Ir para Pagseguro"
                        onClick={null}
                        backgroundColor="var(--themeSDark--default)"
                        variant="extended"
                        position="relative"
                    />
                </a>
            </div>
        </section>
    );
}

function GatewaySuccess({ history }) {
    const handleClick = async () => {
        await setVar({ donePayGateway: true });
        history.push("/t/app/nucleo-equipe/acesso");
    };

    return (
        <section className="full-page mx-3 text-white font-weight-bold">
            <div className="container-center">
                <img
                    width={200}
                    height="auto"
                    src="/img/icons/pay/logo-pagseguro-uol.png"
                    alt="pagseguro logo"
                />
            </div>
            <h1 className="text-subtitle mt-5">
                Conectado pelo Pagseguro com sucesso!
            </h1>
            <div className="my-5">
                <ButtonFab
                    size="medium"
                    title="Acessar App"
                    onClick={handleClick}
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                    position="relative"
                />
            </div>
        </section>
    );
}
