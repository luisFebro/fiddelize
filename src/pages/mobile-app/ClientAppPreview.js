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
    console.log("runName", runName);
    const logoUrlPreview = getQueryByName("logoUrlPreview", location.search);
    console.log("logoUrlPreview", logoUrlPreview);
    const colorP = "red"; //getQueryByName("colorP", location.search);
    const colorS = "default"; //getQueryByName("colorS", location.search);
    const colorBack = "red"; //getQueryByName("colorBack", location.search);
    const targetPoints = getQueryByName("targetPoints", location.search);
    console.log("targetPoints", targetPoints);
    const currPoints = getQueryByName("currPoints", location.search);
    console.log("currPoints", currPoints);
    const game = getQueryByName("game", location.search);
    const clientName = getQueryByName("clientName", location.search);
    console.log("clientName", clientName);
    console.log("game", game);

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
                useBizData={useBizData}
                runName={runName}
                role={role}
                userId={userId}
                fullName={fullName}
                colorP={colorP}
                needAppForPreview
                colorSPreview={colorS}
                colorBackPreview={colorBack}
                gameClubPreview={game}
                firstNamePreview={clientName || firstName}
                targetPointsPreview={targetPoints}
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
