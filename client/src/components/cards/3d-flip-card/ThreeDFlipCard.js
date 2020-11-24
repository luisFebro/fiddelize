// reference: https://codepen.io/kivanfan/pen/BGxXKR
import React, { Fragment, useEffect } from "react";
import "./_ThreeDFlipCard.scss";
import useBackColor from "../../../hooks/useBackColor";
import { useClientAdmin } from "../../../hooks/useRoleData";

function getTransformValue(v1, v2, value) {
    return (((v1 / v2) * value - value / 2) * 1).toFixed(1);
}

function handleMouseMove(event) {
    const card_x = getTransformValue(event.clientX, window.innerWidth, 56);
    const card_y = getTransformValue(event.clientY, window.innerHeight, 56);
    const shadow_x = getTransformValue(event.clientX, window.innerWidth, 20);
    const shadow_y = getTransformValue(event.clientY, window.innerHeight, 20);
    const text_shadow_x = getTransformValue(
        event.clientX,
        window.innerWidth,
        28
    );
    const text_shadow_y = getTransformValue(
        event.clientY,
        window.innerHeight,
        28
    );

    const floating = document.querySelector(".floating");
    const svgShadow = document.querySelector(".svg-shadow");
    const textShadow = document.querySelector(".text-3d-shadow");

    floating.style.transform = `rotateX(${
        card_y / 1
    }deg) rotateY(${card_x}deg)`;
    floating.style.boxShadow = `${-card_x}px ${
        card_y / 1
    }px 55px rgba(0, 0, 0, .55)`;
    svgShadow.style.filter = `drop-shadow(${-shadow_x}px ${
        shadow_y / 1
    }px 4px rgba(0, 0, 0, .6))`;
    textShadow.style.textShadow = `${-text_shadow_x}px ${
        text_shadow_y / 1
    }px 6px rgba(0, 0, 0, .8)`;
}

export default function ThreeDFlipCard({ name, score }) {
    useBackColor("linear-gradient(125deg, #fbd7e5, #bdf4fa)");
    const { selfBizLogoImg: bizLogo } = useClientAdmin();

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);

        (() => {
            setTimeout(() => {
                const body = document.querySelector(".body");
                body.classList.remove("active");
            }, 2200);
        })();
    }, []);

    const setCardThickness = () => (
        <Fragment>
            <div className="thickness"></div>
            <div className="thickness"></div>
            <div className="thickness"></div>
        </Fragment>
    );

    const setBody = () => (
        <main className="card-body">
            <div className="biz-logo svg-shadow">
                <div
                    className="d-flex"
                    style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}
                >
                    <img
                        className="animated fadeInUp delay-1s"
                        src={bizLogo}
                        alt="logo negócio"
                    />
                    <div className="ml-5">
                        <p
                            className="text-subtitle font-weight-bold text-white"
                            style={{ lineHeight: "35px" }}
                        >
                            Cartão Fidelidade
                        </p>
                    </div>
                </div>
            </div>
            <div className="score-text pt-3 text-center text-subtitle text-white text-3d-shadow">
                Vale
                <span className="text-title"> {score} </span>
                pontos
            </div>
            <div className="holder text-3d-shadow">
                {name && name.toUpperCase()}
            </div>
        </main>
    );

    return (
        <section className="body active">
            <div className="floating">
                {setCardThickness()}
                {setBody()}
            </div>
        </section>
    );
}

/* ARCHIVES
original  credit card HTML
<section className="body active">
    <div className="floating">
        <div className="thickness"></div>
        <div className="thickness"></div>
        <div className="thickness"></div>
        <div className="card_body">
            <div className="paypal_center svg"></div>
            <div className="logo svg"></div>
            <div className="paywave svg"></div>
            <div className="chips svg"></div>
            <div className="card_no text">1234-5678-9012-3456</div>
            <div className="valid text">
                VALID <br /> THUR
            </div>
            <div className="valid_date text">12/20</div>
            <div className="holder text">LUIS FEBRO</div>
            <div className="mastercard_icon svg"></div>
        </div>
    </div>
</section>
 */
