import { Fragment } from "react";
import WhatsappBtn from "components/buttons/WhatsappBtn";
import { useFiddelizeAdmin } from "init";
import { useBizData } from "init";
import removeImgFormat from "utils/biz/removeImgFormat";

export default function SupportBizContact() {
    const { mainTechWhatsapp } = useFiddelizeAdmin();

    const { bizLogo, bizName } = useBizData();
    const { newImg: thisBizLogo, width, height } = removeImgFormat(bizLogo);

    const showTitle = () => (
        <div className="my-5 pt-3">
            <div className="mb-3 container-center">
                <img
                    src={
                        thisBizLogo === undefined
                            ? "/img/official-logo-name.png"
                            : thisBizLogo
                    }
                    className="shadow-babadoo"
                    width={width} // prior: bizLogo === "undefined" && 200
                    height={height}
                    title="logo empresa"
                    alt="logo empresa"
                />
            </div>
            <p className="mx-3 text-subtitle text-purple text-center font-weight-bold">
                Fale com a {bizName}
            </p>
        </div>
    );

    const showNote = () => (
        <div className="mt-5 mx-3 text-purple text-normal font-weight-bold">
            Notas:
            <span className="d-block text-small font-weight-bold">
                - Atendimento em <strong>horário comercial</strong>.
                <br />- Atendimentos aos fins de semana podem ser respondidos
                até Segunda-Feira.
            </span>
        </div>
    );

    return (
        <Fragment>
            {showTitle()}
            <div style={{ height: "100%" }} className="container-center">
                <WhatsappBtn />
            </div>

            <p
                className="text-subtitle text-purple font-weight-bold text-center"
                style={{ margin: "50px 0" }}
            >
                ou
            </p>
            <section className="pb-4">
                <h1 className="animated text-purple fadeIn text-subtitle font-weight-bold text-center">
                    Suporte Técnico
                </h1>
            </section>
            <p className="mx-3 text-normal text-grey">
                sugestões, dúvidas, relatar falhas, design, assuntos sobre seu
                app
            </p>
            <section className="container-center">
                <WhatsappBtn
                    icon="cogs"
                    title="iniciar suporte"
                    isDisabled={false}
                    elsePhone={mainTechWhatsapp}
                />
            </section>
            {showNote()}
            <div style={{ marginBottom: 150 }} />
        </Fragment>
    );
}
