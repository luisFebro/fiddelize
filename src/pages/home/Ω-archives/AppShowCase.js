import React from "react";
import ScrollArrow from "../../keyframes/built/scroll-arrow/ScrollArrow";
import useAnimateElem from "../../hooks/scroll/useAnimateElem";
import Picture from "../../components/Picture";

export default function AppShowCase({ setData }) {
    const isSmall = React.useCallback(window.Helper.isSmallScreen(), []);
    useAnimateElem(".app-show-case--text1", {
        animaIn: "fadeInUp",
        speed: "slower",
        rootMargin: 50,
    });
    useAnimateElem(".app-show-case--text2", {
        animaIn: "fadeInUp",
        speed: "slower",
        threshold: 0.2,
    });

    return (
        <section>
            <p className="app-show-case--text1 mx-2 mx-md-5 text-title text-white">
                Combinamos design, sistema e tecnologia de ponta para entregar
                uma experiência única para empreendedores e seus clientes
                através de nossa plataforma de fidelização.
            </p>
            <div
                style={{ margin: "50px 0 100px 0" }}
                className="d-flex justify-content-center"
            >
                <ScrollArrow color="white" />
            </div>
            <p className="app-show-case--text2 mx-2 mx-md-5 text-title text-white">
                Crie hoje seu multi App de
                <br />
                pontos de compra com
                <br />
                tecnologia sob medida movido a<br />
                aumentar sua clientela e vendas
                <br />
            </p>
            <div
                style={{
                    maxWidth: 650,
                    position: "relative",
                    left: isSmall ? "-105px" : "-110px",
                    opacity: 1,
                    transform: "rotate(16deg)",
                }}
            >
                <Picture
                    isResponsive
                    path="/img/illustrations/hand-held-mobile/one-hand-held-mobile"
                    className="img-fluid shape-elevation"
                    dataClass="one-hand-held-mobile"
                    dataSrc="/img/illustrations/home/hand-held-mobile/one-hand-held-mobile.webp"
                    height="auto"
                    alt="app do celular"
                    onError={(e) => e}
                    callback={() => setData(true)}
                />
            </div>
        </section>
    );
}
