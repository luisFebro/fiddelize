import { Fragment } from "react";
import ButtonFab, { faStyle } from "components/buttons/material-ui/ButtonFab";
import { Link } from "react-router-dom";
import Img from "components/Img";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const isSmall = window.Helper.isSmallScreen();

export default function FiddelizeContact() {
    return (
        <Fragment>
            <div className="animated fadeInUp my-5 container-center mx-5">
                <Img
                    src="/img/official-logo-name.png"
                    className="img-fluid"
                    offline
                    coll="logos"
                    height="auto"
                    style={{
                        maxHeight: !isSmall ? "210px" : "220px",
                        width: "100%",
                    }}
                    alt="chat_fiddelize"
                />
                <p className="mt-3 text-voca-cyan font-site text-em-1-3 text-center">
                    Conquiste clientes no próximo nível
                </p>
            </div>
            <div className="animated fadeInUp delay-2s mx-3 mb-5 text-center text-normal text-white">
                <span
                    className="text-subtitle text-pill"
                    style={{
                        backgroundColor: "var(--themePDark)",
                    }}
                >
                    Atendimento
                </span>
                <br />
                das 9:00 às 18:00
                <br />
                de Segunda a Sábado.
            </div>
            <div className="mx-5 animated fadeInUp delay-2s container-center">
                <Link className="no-text-decoration" to="/suporte">
                    <ButtonFab
                        title="INICIAR"
                        backgroundColor="var(--themeSDark)"
                        iconFontAwesome={
                            <FontAwesomeIcon icon="comment" style={faStyle} />
                        }
                        onClick={null}
                        position="relative"
                        variant="extended"
                        size="large"
                        width="100%"
                    />
                </Link>
            </div>
        </Fragment>
    );
}
