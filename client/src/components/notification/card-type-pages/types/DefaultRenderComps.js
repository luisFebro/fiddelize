import React, { Fragment, useState } from "react";
import ButtonMulti from "../../../../components/buttons/material-ui/ButtonMulti";
import { Link } from "react-router-dom";
import { setRun } from "../../../../hooks/useRunComp";
import { useStoreDispatch } from "easy-peasy";
import { useClientAdmin, useProfile } from "../../../../hooks/useRoleData";
import Img from "../../../../components/Img";
import applyTextStyle from "../../../../utils/string/applyTextStyle";
import { readUser } from "../../../../redux/actions/userActions";
import { showSnackbar } from "../../../../redux/actions/snackbarActions";
import removeImgFormat from "../../../../utils/biz/removeImgFormat";
export const textStyle = "text-purple text-left text-normal mx-3";

export const ShowTitle = ({ text }) => (
    <div className="mt-4">
        <p className="text-subtitle text-purple text-center font-weight-bold">
            {text}
        </p>
    </div>
);

export const ShowIllustration = ({
    role,
    mainImg,
    bizLogo = "https://res.cloudinary.com/fiddelize/image/upload/h_100,w_100/v1593518018/cli-admin-consultoria-cldmh38.png",
}) => {
    const { isSquared, width, height, newImg: thisBizLogo } = removeImgFormat(
        bizLogo
    );

    return (
        <div className="container-center position-relative my-5">
            <Img
                src={mainImg}
                className="shadow-elevation-black"
                alt="ilustração principal"
                width={150}
                height="auto"
            />
            {role === "cliente" && (
                <div
                    className="position-absolute"
                    style={{
                        transform: `translate(${
                            !isSquared ? "65%" : "80%"
                        }, 50%)`,
                    }}
                >
                    <img
                        className={`animated delay-1s ${
                            thisBizLogo ? "shadow-elevation" : ""
                        }`}
                        height="auto"
                        width={!isSquared ? 140 : 90}
                        src={thisBizLogo || "/img/error.png"}
                        alt="logo empresa"
                    />
                </div>
            )}
        </div>
    );
};

export const ShowBrief = ({ brief, module = "fontSize" }) => {
    const styledTxt = applyTextStyle(brief, module, { fontSize: "25px" });
    return (
        <p
            className={`${textStyle} mt-3 font-weight-bold`}
            // dangerouslySetInnerHTML={{ __html: styledTxt }}
        >
            {styledTxt}
        </p>
    );
};

export const ShowActionBtn = ({
    role,
    titleCliUser = "Explorar seu App",
    titleCliAdmin = "Abrir Painel de Controle",
    isConfirmedChall = false,
    children,
    callback,
}) => {
    const [loading, setLoading] = useState(null);
    const dispatch = useStoreDispatch();
    const { bizCodeName } = useClientAdmin();
    const { role: loggedUserRole, _id } = useProfile();

    if (loading) titleCliUser = "processando...";
    if (loading === false) titleCliUser = "reiniciando...";

    const handleBtnClick = () => {
        setLoading(true);
        if (typeof callback === "function") callback(true);
        readUser(dispatch, _id, { role: loggedUserRole }).then((res) => {
            if (res.status !== 200)
                return showSnackbar(
                    dispatch,
                    "Não foi possível atualizar. Reinicie app.",
                    "error"
                );
            if (role === "cliente")
                window.location.href =
                    loggedUserRole === "cliente-admin"
                        ? "/mobile-app?client-admin=1"
                        : "/mobile-app";
            if (role === "cliente-admin") setRun(dispatch, "goDash");
            setLoading(false);
        });
    };

    const handleBtnPath = () => {
        if (role === "cliente") return null;
        if (role === "cliente-admin")
            return `/${bizCodeName}/cliente-admin/painel-de-controle`;
    };

    return (
        <div className="my-4 container-center">
            {children ? (
                children
            ) : (
                <Link
                    className="no-text-decoration"
                    to={handleBtnPath}
                    onClick={handleBtnClick}
                >
                    <ButtonMulti
                        title={
                            role === "cliente" ? titleCliUser : titleCliAdmin
                        }
                        color="var(--mainWhite)"
                        backgroundColor="var(--themeP)"
                    />
                </Link>
            )}
        </div>
    );
};
