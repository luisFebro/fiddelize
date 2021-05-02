import { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { useBizData } from "init";
import getQueryByName from "utils/string/getQueryByName";
import Img from "components/Img";
import removeImgFormat from "utils/biz/removeImgFormat";
import useData from "init";
import ClientUserAppContent from "./content/ClientUserAppContent";

const isSmall = window.Helper.isSmallScreen();

function ClientAppPreview({ location }) {
    // useCount("ClientAppPreview.js"); // RT =1 (ok)

    const runName = getQueryByName("runName", location.search);
    const clientName = getQueryByName("clientName", location.search);
    const logoUrlPreview = getQueryByName("logoUrlPreview", location.search);
    const colorP = getQueryByName("colorP", location.search);
    const colorS = getQueryByName("colorS", location.search);
    const colorBack = getQueryByName("colorBack", location.search);
    const rewardScore = getQueryByName("rewardScore", location.search);
    const currScore = getQueryByName("currScore", location.search);

    const useThisData = () => ({
        currScore: Number(currScore) || 100,
        lastScore: 20,
    });

    const { newImg: formattedImg, isSquared } = removeImgFormat(logoUrlPreview);
    const logoSrc = logoUrlPreview
        ? formattedImg
        : "/img/official-logo-name.png";

    const showLogo = () => (
        <div className="container-center">
            <Img
                className={`${
                    logoUrlPreview ? "app_biz_logo" : null
                } animated zoomIn slow`}
                style={{
                    position: "relative",
                    margin: "15px 0",
                    left: isSmall ? "5px" : "20px",
                }}
                src={logoSrc}
                alt="Logomarca Principal"
                width={isSquared ? 100 : 190}
                height={isSquared ? 100 : 85}
            />
        </div>
    );

    const [userId, role, fullName, firstName] = useData([
        "userId",
        "role",
        "name",
        "firstName",
    ]);

    const mainContent = () => (
        <Fragment>
            {showLogo()}
            <ClientUserAppContent
                useThisData={useThisData}
                useBizData={useBizData}
                needAppForPreview
                runName={runName}
                rewardScoreTest={rewardScore}
                clientNameTest={clientName}
                colorP={colorP}
                colorS={colorS}
                colorBack={colorBack}
                role={role}
                firstName={firstName}
                fullName={fullName}
                userId={userId}
            />
        </Fragment>
    );

    return (
        <div
            style={{
                backgroundColor: `var(--themeBackground--${
                    colorBack || colorP
                })`,
                overflowX: "hidden",
                overflowY: "auto",
                cursor: "pointer",
            }}
        >
            {mainContent()}
        </div>
    );
}

export default withRouter(ClientAppPreview);
