import { useEffect, useState } from "react";
import getQueryByName from "utils/string/getQueryByName";
import { Load } from "components/code-splitting/LoadableComp";
import generateAlphaNumeric from "utils/string/generateAlphaNumeric";
// import { CLIENT_URL } from "config/clientUrl";
// import useAnimateElem from "hooks/scroll/useAnimateElem";
// import ScrollArrow from "components/animations/scroll-arrow/ScrollArrow";
// import Illustration from "components/Illustration";
// import ShowPasswordForm from "./ShowPasswordForm";

export const AsyncAccessPassCreation = Load({
    loader: () =>
        import(
            "./AccessPassCreation" /* webpackChunkName: "access-pass-comp-lazy" */
        ),
});

export default function PasswordPage({ location }) {
    const [cliMembersPass, setCliMembersPass] = useState(null);

    useEffect(() => {
        const thisCliMembersPass = generateAlphaNumeric(7, "a#@");
        setCliMembersPass(thisCliMembersPass);
    }, []);

    const clientAdminId = getQueryByName("id", location.search);
    const clientAdminName = getQueryByName("name", location.search).cap();
    // const { bizLinkName } = match.params;

    return (
        <AsyncAccessPassCreation
            userName={clientAdminName}
            userId={clientAdminId}
            cliMembersPass={cliMembersPass}
        />
    );
}

/* ARCHIVES

useAnimateElem(".password-page--img", {
    animaIn: "fadeInTopLeft",
    speed: "slow",
});
useAnimateElem(".password-page--txt", {
    animaIn: "fadeInUp",
    speed: "slow",
});

const dataFromPassPage = {
    clientAdminId,
    clientAdminName,
    bizLinkName,
    history,
};

const showExplanation = () => (
    <Fragment>
        <div className="password-page--img container-center">
            <Illustration
                img={`${CLIENT_URL}/img/illustrations/woman-typing-password.svg`}
                alt="mulher digitando"
                txtImgConfig={{
                    topPos: isSmall ? "40%" : "30%",
                    txt: isSmall
                        ? ""
                        : `${clientAdminName},<br/>defina uma senha aqui.`,
                    txtStyle: "text-title",
                }}
            />
        </div>
        <div className="pt-1 pb-5">
            <ScrollArrow margin={50} />
        </div>
        <section
            className={`text-normal ${
                isSmall ? "ml-3 text-left" : "text-center"
            } container-center`}
        >
            {!isSmall ? (
                <p
                    className="password-page--txt"
                    style={{ marginTop: "80px" }}
                >
                    Defina sua <strong>senha de verificação</strong>.
                    <br />
                    Com ela, outros membros de sua equipe têm acesso validar a compra dos seus clientes.
                    <br />
                </p>
            ) : (
                <p
                    className="password-page--txt"
                    style={{ marginTop: "80px" }}
                >
                    {clientAdminName},
                    <br />
                    Defina uma <strong>senha de verificação</strong> para
                    <br />
                    validar a compra dos seus clientes.
                    <br />
                </p>
            )}
            <p className="password-page--txt" style={{ marginTop: "80px" }}>
                Você pode consultar ou trocar essa senha no painel de
                controle quando precisar. Não é preciso memorizar!
                <br />
                <br />
                Ah! E temos um <strong>gerador de senhas</strong>
                <br />
                para facilitar na criação de novas senhas.
            </p>
        </section>
    </Fragment>
);

const showVerifPassContent = () => (
    <div className="text-white">
        {showExplanation()}
        {
            <ShowPasswordForm
                dataFromPassPage={dataFromPassPage}
                btnAction={setNext}
            />
        }
        <img
            width="100%"
            height="auto"
            style={{ overflow: "hidden" }}
            src={`${CLIENT_URL}/img/shapes/wave1.svg`}
            alt="onda"
        />
    </div>
);

 */
