import React from "react";
import SpeedometerGauge from "../../../../../../../components/charts/speedometer-gauge/SpeedometerGauge";
import colorsHandler from "../../../helpers/colorsHandler";
import { getTextStatus } from "../../../../../../../components/charts/speedometer-gauge/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const isSmall = window.Helper.isSmallScreen();

export default function NpsContent({ nps }) {
    const { colorNPS } = colorsHandler({ nps });
    const { icon } = getTextStatus(nps);

    const showTitle = () => (
        <div className="my-4">
            <h1
                className="text-subtitle text-purple text-center font-weight-bold"
                style={{ lineHeight: "30px" }}
            >
                Pontuação
                <br />
                Promotores
            </h1>
            <p
                className="text-small text-purple text-center font-weight-bold"
                style={{
                    fontSize: "1.1rem",
                }}
            >
                Promotores são os <strong>fãs do seu negócio</strong>. Quanto
                maior a pontuação, mais clientes satisfeitos trazendo mais
                vendas.
            </p>
        </div>
    );

    const plural = nps !== 1 || nps !== -1 || nps !== 0;
    const showScore = () => (
        <div className="position-relative my-2 text-title text-purple text-center">
            <span
                className={`${colorNPS} d-inline-block font-size text-em-2-1`}
            >
                {nps}
            </span>
            <p
                className={`m-0 ${colorNPS} position-relative text-subtitle font-weight-bold text-center`}
                style={{ top: -25 }}
            >
                {plural ? "pontos" : "ponto"}
            </p>
            <div
                className="position-absolute"
                style={{
                    right: isSmall ? 40 : 70,
                    top: 25,
                }}
            >
                <FontAwesomeIcon
                    icon={icon}
                    className={colorNPS}
                    style={{ fontSize: "4rem" }}
                />
            </div>
        </div>
    );

    return (
        <section className="mx-3">
            {showTitle()}
            {showScore()}
            <section className="container-center">
                <SpeedometerGauge value={nps} />
            </section>
        </section>
    );
}
