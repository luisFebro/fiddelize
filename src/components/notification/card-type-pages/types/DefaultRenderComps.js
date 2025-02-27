import { useState } from "react";
import useData, { useBizData } from "init";
import { Link } from "react-router-dom";
import ButtonMulti from "../../../buttons/material-ui/ButtonMulti";
import { setRun, useAction } from "global-data/ui";
import Img from "../../../Img";
import applyTextStyle from "../../../../utils/string/applyTextStyle";
import removeImgFormat from "../../../../utils/biz/removeImgFormat";

export const textStyle = "text-purple text-left text-normal mx-3";

export const ShowTitle = ({ text }) => (
    <div className="mt-4">
        <p className="text-subtitle text-purple text-center font-weight-bold">
            {text}
        </p>
    </div>
);

export const ShowIllustration = ({ role, mainImg, bizLogo }) => {
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
            {role !== "cliente-admin" && (
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
                        alt="logo"
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
    titleCliUser = "Conhecer seu App",
    titleCliAdmin = "Abrir Painel de Controle",
    titleCliMember = "Conhecer App",
    children,
    callback,
}) => {
    const [loading, setLoading] = useState(null);

    const uify = useAction();
    const { bizLinkName } = useBizData();
    const { role: loggedUserRole, userId } = useData();

    if (loading) titleCliUser = "processando...";
    if (loading === false) titleCliUser = "reiniciando...";

    const handleBtnClick = () => {
        setLoading(true);
        if (role === "cliente-membro") {
            window.location.href = "/t/app/equipe";
        }
        if (typeof callback === "function") callback(true);

        if (role === "cliente")
            window.location.href =
                loggedUserRole === "cliente-admin"
                    ? "/app?client-admin=1"
                    : "/app";
        if (role === "cliente-admin") setRun("runName", "goDash", uify);
        setLoading(false);
    };

    const handleBtnPath = () => {
        if (role === "cliente") return null;
        if (role === "cliente-admin")
            return `/${bizLinkName}/cliente-admin/painel-de-controle`;
    };

    function handleBtnTitle() {
        if (role === "cliente-admin") return titleCliAdmin;
        if (role === "cliente-membro") return titleCliMember;
        if (role === "cliente") return titleCliUser;
    }

    const buttonTitle = handleBtnTitle();
    return (
        <div className="my-4 container-center">
            {children || (
                <Link
                    className="no-text-decoration"
                    to={handleBtnPath}
                    onClick={handleBtnClick}
                >
                    <ButtonMulti
                        title={buttonTitle}
                        color="var(--mainWhite)"
                        backgroundColor="var(--themeP)"
                    />
                </Link>
            )}
        </div>
    );
};
