import React, { Fragment } from 'react';
import ButtonMulti from '../../../../components/buttons/material-ui/ButtonMulti'
import { Link } from 'react-router-dom';
import { setRun } from '../../../../hooks/useRunComp';
import { useStoreDispatch } from 'easy-peasy';
import { useClientAdmin, useProfile, } from '../../../../hooks/useRoleData';
import ImgLoader from '../../../../components/ImgLoader';

export const textStyle = 'text-purple text-left text-normal mx-3';

export const ShowTitle = ({ text }) => (
    <div className="mt-4">
        <p
            className="text-subtitle text-purple text-center font-weight-bold"
        >
            {text}
        </p>
    </div>
);

export const ShowIllustration = ({ role, mainImg, bizLogo }) => {
    const isSquared = bizLogo && bizLogo.includes("h_100,w_100");
    return (
        <div className="container-center position-relative my-5">
            <ImgLoader
                src={mainImg}
                className="shadow-elevation-black"
                alt="ilustração principal"
                width={150}
                height="auto"
                timeout={4000}
            />
            {role === "cliente" && (
                <div
                    className="position-absolute"
                    style={{ transform: `translate(${!isSquared ? "65%" : "80%"}, 50%)`}}
                >
                    <img
                        className={`animated delay-1s ${bizLogo ? "shadow-elevation" : ""}`}
                        height="auto"
                        width={!isSquared ? 140 : 90}
                        src={bizLogo || "/img/error.png"}
                        alt="primeiro dia"
                    />
                </div>
            )}
        </div>
    );
}

export const ShowBrief = ({ brief }) => (
    <p className={`${textStyle} mt-3 font-weight-bold`}>
        {brief}
    </p>
);

export const ShowActionBtn = ({
    role,
    titleCliUser = 'Explorar seu App',
    titleCliAdmin = 'Abrir Painel de Controle',
    isConfirmedChall = false,
    children,
}) => {
    const dispatch = useStoreDispatch();
    const { bizCodeName } = useClientAdmin();
    const { role: loggedUserRole } = useProfile();

    const goDash = () => {
        if(role === "cliente") window.location.href = loggedUserRole === "cliente-admin" ? "/mobile-app?client-admin=1" : "/mobile-app"
        if(role === "cliente-admin") setRun(dispatch, "goDash");
    }

    const handleBtnPath = () => {
        if(role === "cliente") return null;
        if(role === "cliente-admin") return `/${bizCodeName}/cliente-admin/painel-de-controle`
    }

    return (
        <div className="my-5 container-center">
            {children
            ? children : (
                <Link
                    className="no-text-decoration"
                    to={handleBtnPath}
                    onClick={goDash}
                >
                    <ButtonMulti
                        title={role === "cliente" ? titleCliUser : titleCliAdmin}
                        color="var(--mainWhite)"
                        backgroundColor="var(--themeP)"
                    />
                </Link>
            )}
        </div>
    );
}