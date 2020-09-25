import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const faStyle = {
    fontSize: "25px",
    color: "var(--themeP)",
};

const ShowPayWatermarks = ({ needAnima = true }) => (
    <section className="d-flex justify-content-around">
        <div className="d-flex paycontent--safe-msg">
            <section className="d-flex position-relative">
                <FontAwesomeIcon icon="lock" className="mr-2" style={faStyle} />
                <p
                    className="text-purple font-weight-bold text-small"
                    style={{ lineHeight: "20px" }}
                >
                    Ambiente
                    <br />
                    Seguro
                </p>
            </section>
        </div>
        <section
            className={`${
                needAnima ? "animated fadeInUp delay-3s" : ""
            } pagseguro-mark container-center-col`}
        >
            <p
                className="main-font position-relative m-0 shadow-elevation-black text-left text-white font-weight-bold"
                style={{ left: "10px" }}
            >
                protegido pelo
            </p>
            <img
                className="shadow-elevation-black"
                src="/img/icons/pay/logo-pagseguro-uol.png"
                width={160}
                height={30}
                alt="pagamento processado via PagSeguro Transparente"
            />
        </section>
    </section>
);

export { ShowPayWatermarks };
