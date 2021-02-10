import React, { useState, Fragment } from "react";
import getQueryByName from "../../../utils/string/getQueryByName";
import { CLIENT_URL } from "../../../config/clientUrl";
import Illustration from "../../../components/Illustration";
import ScrollArrow from "../../../keyframes/built/scroll-arrow/ScrollArrow";
import useAnimateElem from "../../../hooks/scroll/useAnimateElem";
import ShowPasswordForm from "./ShowPasswordForm";
import { Load } from "../../../components/code-splitting/LoadableComp";
export const AsyncAccessPassCreation = Load({
    loader: () =>
        import(
            "./AccessPassCreation" /* webpackChunkName: "access-pass-comp-lazy" */
        ),
});

const isSmall = window.Helper.isSmallScreen();

export default function PasswordPage({ location, match, history }) {
    const [next, setNext] = useState(false); // false

    const clientAdminId = getQueryByName("id", location.search);
    const clientAdminName = getQueryByName("name", location.search).cap();
    const bizCodeName = match.params.bizCodeName;

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
        bizCodeName,
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
                className={`text-title ${
                    isSmall ? "ml-3 text-left" : "text-center"
                } container-center`}
            >
                {!isSmall ? (
                    <p
                        className="password-page--txt"
                        style={{ marginTop: "80px" }}
                    >
                        Defina uma <strong>senha de verificação</strong> para
                        <br />
                        validar a compra dos seus clientes.
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

    const showAccessPassContent = () => (
        <AsyncAccessPassCreation
            userName={clientAdminName}
            userId={clientAdminId}
        />
    );

    return (
        <Fragment>
            {next ? showAccessPassContent() : showVerifPassContent()}
        </Fragment>
    );
}
