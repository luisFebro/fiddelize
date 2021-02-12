import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import truncateWords from "../utils/string/truncateWords";
import { ButtonContainerPressedEffectDark as Dark } from "../components/buttons/Ω-archives/Default";
import parse from "html-react-parser";
import Spinner from "./loadingIndicators/Spinner";

const isSmall = window.Helper.isSmallScreen();

Illustration.propTypes = {
    img: PropTypes.string,
    imgStyle: PropTypes.object,
    title: PropTypes.node,
    alt: PropTypes.string,
    actionButton: PropTypes.shape({
        btnName: PropTypes.string.isRequired,
        txt: PropTypes.string.isRequired,
        alt: PropTypes.string,
        to: PropTypes.string,
    }),
    txtImgConfig: PropTypes.shape({
        txt: PropTypes.node,
        fontSize: PropTypes.string,
        txtStyle: PropTypes.string,
        txtColor: PropTypes.string,
        txtAlign: PropTypes.string,
        txtBorder: PropTypes.string,
        topPos: PropTypes.string,
        leftPos: PropTypes.string,
        truncatedLimit: PropTypes.number,
    }),
};

export default function Illustration({
    spinnerHeight,
    spinnerWidth,
    spinnerSize = "large",
    title,
    img,
    imgStyle,
    className,
    alt = "conteúdo da página está vazio",
    actionButton = {},
    txtImgConfig = {},
    txtClassName,
    wrapperClassName,
}) {
    const [status, setStatus] = useState(true);

    const {
        txt,
        txtColor,
        txtStyle,
        fontSize,
        txtAlign,
        txtBorder,
        topPos,
        leftPos,
        truncatedLimit,
    } = txtImgConfig;

    const showActionButton = (actionButton) => {
        const { btnName, txt, to } = actionButton;
        return (
            btnName === "dark" && (
                <div className="container-center">
                    <Dark className="mt-5">{txt}</Dark>
                </div>
            )
        );
    };

    return (
        <Fragment>
            <DivWrapper
                className={`${
                    wrapperClassName
                        ? `${wrapperClassName} container-center`
                        : "container-center mt-5"
                }`}
                style={{ overflowX: "hidden" }}
            >
                <div style={{ display: status ? "block" : "none" }}>
                    <Spinner
                        marginX={spinnerWidth}
                        marginY={spinnerHeight}
                        isCenter={false}
                        size={spinnerSize}
                    />
                </div>
                <section style={{ display: status ? "none" : "block" }}>
                    <img
                        className={`${
                            className ? className : ""
                        } image-center svg-elevation`}
                        src={img}
                        width=""
                        height=""
                        style={{
                            ...imgStyle,
                            overflowX: "hidden",
                            maxWidth: 400,
                        }}
                        alt={alt}
                        onLoad={() => setStatus(false)}
                    />
                    <div className="container-center">
                        <p
                            className={`move-txt-from-center ${
                                txtBorder ? txtBorder : ""
                            } ${
                                txtClassName
                                    ? `${txtClassName} text-subtitle font-weight-bold`
                                    : "text-subtitle font-weight-bold text-purple"
                            }`}
                            style={{
                                overflowY: "visible",
                                minWidth: `${isSmall ? "300px" : "500px"}`,
                                fontSize: fontSize || "2rem",
                                textAlign: txtAlign || "center",
                                top: topPos || "-2%",
                                left: leftPos || "50%",
                            }}
                        >
                            {txt &&
                                parse(truncateWords(txt, truncatedLimit || 55))}
                        </p>
                    </div>
                </section>
            </DivWrapper>
            {showActionButton(actionButton)}
        </Fragment>
    );
}

const DivWrapper = styled.div`
    position: relative;

    .move-txt-from-center {
        font-size: 1.3em;
        position: absolute;
        transform: translate(-50%, -50%);
    }

    // BORDERS
    .border-white {
        //border in the font
        text-shadow: -2px 0 #fff, 0 2px #fff, 2px 0 #fff, 0 -2px #fff;
    }
`;

/* ARCHIVES
return (
    btnName === "dark" && (
        <div className="container-center">
            <HashLink smooth to={to || "/#inicio"}>
                <Dark className="mt-5">{txt}</Dark>
            </HashLink>
        </div>
    )
);
 */
