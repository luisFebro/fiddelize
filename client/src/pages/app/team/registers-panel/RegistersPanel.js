import React, { Fragment, useState } from "react";
import { useClientAdmin } from "../../../../hooks/useRoleData";
import useDelay from "../../../../hooks/useDelay";
import TypesHandler from "./types-handler/TypesHandler";
import { Link } from "react-router-dom";

const getStyles = () => ({
    clipPathBack: {
        position: "absolute",
        background: "var(--themeP)",
        clipPath: "circle(77.5% at 23% 0)",
        webPackClipPath: "circle(77.5% at 23% 0)",
        padding: "250px",
    },
});

export default function RegistersPanel({ isNewMember = false }) {
    const { selfBizLogoImg, bizCodeName } = useClientAdmin();

    const styles = getStyles();

    const readyTypesHandler = useDelay(3500);

    const showHeader = () => (
        <Fragment>
            <div style={styles.clipPathBack}></div>
            <div className="position-relative container-center-col my-3">
                <img src={selfBizLogoImg} alt="logo" />
                <p className="mt-3 text-shadow animated fadeInUp text-title text-white text-center">
                    {isNewMember ? "Novo Membro Equipe" : "Novo Cliente"}
                </p>
            </div>
        </Fragment>
    );

    const showSharerPageLink = () =>
        readyTypesHandler &&
        !isNewMember && (
            <section className="my-3 text-right mr-3">
                <Link
                    to={`/${bizCodeName}/compartilhar-app`}
                    className="text-link text-small"
                >
                    Mais opções de divulgação
                </Link>
            </section>
        );

    const showTypesHandler = () =>
        readyTypesHandler && (
            <section className="my-5">
                <TypesHandler isNewMember={isNewMember} />
            </section>
        );

    return (
        <section>
            {showHeader()}
            {showTypesHandler()}
            {showSharerPageLink()}
        </section>
    );
}
