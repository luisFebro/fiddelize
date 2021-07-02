import { Fragment } from "react";
import WhatsappBtn from "components/buttons/WhatsappBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonMulti, {
    faStyle,
} from "components/buttons/material-ui/ButtonMulti";
import { useFiddelizeAdmin } from "init";

export default function SupportBizContact() {
    const { mainTechWhatsapp } = useFiddelizeAdmin();

    const showTitle = () => (
        <section className="py-4">
            <h1 className="animated text-purple fadeIn text-subtitle font-weight-bold text-center">
                Fale Conosco
            </h1>
        </section>
    );

    const showNote = () => (
        <div className="mx-3 text-purple text-normal font-weight-bold">
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
            <div className="mx-4">
                <img
                    className="img-fluid"
                    height="auto"
                    src="/img/illustrations/online-chat.svg"
                    alt="chat online"
                />
            </div>
            <div style={{ height: "100%" }} className="container-center">
                <WhatsappBtn />
            </div>

            <section className="py-4">
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
                    title="técnico"
                    isDisabled={false}
                    elsePhone={mainTechWhatsapp}
                />
            </section>
            {showNote()}
            <div style={{ marginBottom: 150 }} />
        </Fragment>
    );
}
