import React, { Fragment } from "react";
import ImportantDevicesIcon from "@material-ui/icons/ImportantDevices";
import removeImgFormat from "../../../utils/biz/removeImgFormat";

export default function ClientAdminText({
    isFromAdminPanel,
    userName,
    iconStyle,
    ScrollArrow,
    styles,
    bizName,
    bizLogo,
    showMainScrollArray,
}) {
    const { newImg: thisBizLogo, width, height } = removeImgFormat(bizLogo);

    const showLogo = () => (
        <div className="my-5 container-center">
            <img
                src={
                    thisBizLogo === undefined
                        ? `/img/official-logo-name.png`
                        : thisBizLogo
                }
                width={width}
                height={height}
                title={`logo da ${bizName}`}
                alt={`logo empresa ${bizName}`}
            />
        </div>
    );

    return (
        <section className="text-center text-title mt-5">
            {isFromAdminPanel ? (
                <Fragment>
                    <p className="text-hero container-center-col">
                        <ImportantDevicesIcon style={iconStyle} />
                        {userName && userName.cap()}, baixe seu app seja para
                        celular, tablet ou desktop.
                    </p>
                    <div className="pt-1 pb-5">
                        <ScrollArrow margin={50} />
                    </div>
                    <p className="download-app--txt" style={styles.margin}>
                        Clique no banner que aparece a baixo,
                        <br />e comece a baixar em instantes.
                    </p>
                </Fragment>
            ) : (
                <Fragment>
                    {showLogo()}
                    <p className="text-title">
                        O App da {bizName && bizName.cap()} ficou pronto!
                        <i
                            className="pl-3"
                            style={{ ...styles.margin, fontSize: "2rem" }}
                        >
                            🎉
                        </i>
                    </p>
                    <div className="pt-1 pb-5">
                        <ScrollArrow margin={50} />
                    </div>
                    <p className="download-app--txt" style={styles.margin}>
                        Baixe logo a baixo,
                        <br />e já comece a usar.
                    </p>
                </Fragment>
            )}
            {showMainScrollArray()}
        </section>
    );
}
