import React, { Fragment } from "react";
import Img from "../../../Img";
import useElemShowOnScroll from "../../../../hooks/scroll/useElemShowOnScroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export { useElemShowOnScroll };

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    clipPathBack: {
        position: "absolute",
        background: "var(--themeP)",
        clipPath: "polygon(3% 0px, 91% 0px, 72% 25%, 7% 21%)",
        webPackClipPath: "polygon(3% 0px, 91% 0px, 72% 25%, 7% 21%)",
        padding: isSmall ? "220px" : "290px",
        top: 0,
    },
    crownIcon: {
        position: "relative",
        top: "-15px",
        right: "18px",
        transform: "rotate(40deg)",
        color: "#fff",
        fontSize: "23px",
    },
});

export const ShowTitle = ({
    title = "Orgganize Clientes",
    offplan = false,
}) => {
    const styles = getStyles();

    return (
        <div className="mt-2">
            <div style={styles.clipPathBack}></div>
            <h1 className="text-shadow position-relative text-white text-subtitle text-purple text-center font-weight-bold">
                Fiddelize{" "}
                {offplan ? (
                    <span className="d-inline-block position-relative">
                        Pré-venda
                    </span>
                ) : (
                    <span className="d-inline-block position-relative">
                        Pro{" "}
                        <FontAwesomeIcon
                            icon="crown"
                            style={styles.crownIcon}
                        />
                    </span>
                )}
                <br />
                <span className="text-em-1-2">{title}</span>
            </h1>
        </div>
    );
};

export const ShowPicture = ({
    src,
    srcIcon,
    dataSrc,
    reference,
    subtitle,
    timeout,
    main = false,
    imgContainerClass, // for reading intersection observer
    iconWidth,
    iconHeight,
    floatit = true,
}) => {
    // images loaded with intersection observer...
    const showImg = () => (
        <Fragment>
            {main ? (
                <section className="position-relative">
                    <Img
                        dataSrc={dataSrc}
                        timeout={timeout}
                        src={src}
                        mode="skeleton"
                        imgContainerClass={imgContainerClass}
                        alt="fiddelize pro imagem"
                    />
                    <div
                        className="position-absolute"
                        style={{
                            top: "30%",
                            left: "50%",
                            transform: "translate(-50%, -30%)",
                        }}
                    >
                        <Img
                            dataSrc={dataSrc}
                            timeout={timeout}
                            className={floatit ? "float-it-5" : ""}
                            src={srcIcon}
                            width={iconWidth}
                            height={iconHeight}
                            mode="skeleton"
                            imgContainerClass={imgContainerClass}
                            alt="fiddelize pro imagem"
                        />
                    </div>
                </section>
            ) : (
                <Img
                    dataSrc={dataSrc}
                    timeout={timeout}
                    className="img-center"
                    src={src}
                    mode="skeleton"
                    imgContainerClass={imgContainerClass}
                    alt="fiddelize pro imagem"
                />
            )}
        </Fragment>
    );

    return (
        <div
            className={`position-relative ${main ? "" : "my-3"}`}
            style={{ margin: main && "20px 0 0px" }}
        >
            {showImg()}
            {reference && (
                <p className="mt-2 text-purple text-right text-small font-weight-bold">
                    fonte: {reference}
                </p>
            )}

            {subtitle && (
                <p className="mt-2 text-purple text-center text-small font-weight-bold">
                    {subtitle}
                </p>
            )}
        </div>
    );
};
