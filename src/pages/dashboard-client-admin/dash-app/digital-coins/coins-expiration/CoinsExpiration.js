import InstructionBtn from "components/buttons/InstructionBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExpirationPowerBtn from "./power-btn/ExpirationPowerBtn";

export default function CoinsExpiration() {
    return (
        <section>
            <h2 className="text-normal font-weight-bold text-center text-purple">
                Expiração de Moedas Digitais PTS
            </h2>
            <p className="text-normal text-grey">
                Estabeleça um <strong>senso de urgência de tempo</strong> para
                seus clientes usarem as moedas por benefícios até certo prazo.
            </p>
            <ExpirationPowerBtn />
            <div className="text-grey position-relative my-5">
                <div className="container-center">
                    <span className="text-grey d-inline-block text-p text-normal">
                        Saiba mais
                    </span>
                    <FontAwesomeIcon
                        className="pl-2"
                        icon="arrow-right"
                        style={{ fontSize: 35 }}
                    />
                    <div className="pl-3 position-relative">
                        <InstructionBtn
                            mode="modal"
                            zIndex={0}
                            article="ExpiringCoinsDeadline"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
