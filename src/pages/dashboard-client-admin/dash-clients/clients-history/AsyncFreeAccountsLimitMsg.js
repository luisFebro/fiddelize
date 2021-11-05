import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useData, { useBizData, useFiddelizeAdmin } from "init";
import getFirstName from "utils/string/getFirstName";
import usePro from "init/pro";
import { Load } from "components/code-splitting/LoadableComp";
import ProBtn from "components/pro/ProBtn";

const showTxtDefault = (txt) => (
    <div className="mx-2 text-left text-normal animated rubberBand my-5">
        <p className="text-purple text-subtitle font-weight-bold m-0">
            Nota <FontAwesomeIcon icon="info-circle" />
        </p>
        {txt}
    </div>
);

// EXPIRING MSGS
const aboutToExpireMsg = ({ name }) => {
    // const leftRegisters = limitFreePlanNewUsers - countCliUsers;
    const txt = (
        <span>
            - Seus clientes estão começando a aparecer, {getFirstName(name)}.
            Ótimo! Faltam mais alguns cadastros na versão grátis. Que tal ganhar
            mais alcance e resultado?{" "}
            <div className="container-center">
                <ProBtn type="link" linkTitle="Ver planos pro" />
            </div>
        </span>
    );

    return <Fragment>{showTxtDefault(txt)}</Fragment>;
};

const expiredMsg = () => {
    const txt = (
        <section>
            - O limite de cadastros para seu plano terminou. Todos seus clientes
            cadastraram usam suas moedas digitais por mais 1 mês.
            <br />
            <div className="container-center">
                <ProBtn
                    type="link"
                    linkTitle="Precisa cadastrar novos clientes? Invista em um plano pro"
                />
            </div>
        </section>
    );
    return <Fragment>{showTxtDefault(txt)}</Fragment>;
};
// END EXPIRING MSGS

// Need to reload to update. And even after reloaded, there's a delay to update...
// insert bizPlan checking in the component which holds this.

export default function AsyncFreeAccountsLimitMsg() {
    const { name } = useData();
    const { countCliUsers } = useBizData();
    const { limitFreePlanNewUsers } = useFiddelizeAdmin();

    const { credits } = usePro("Novvos Clientes");

    if (countCliUsers >= limitFreePlanNewUsers || !credits) {
        return expiredMsg();
    }
    if (countCliUsers >= 15) {
        return aboutToExpireMsg({
            name,
        });
    }
    return null;
}
