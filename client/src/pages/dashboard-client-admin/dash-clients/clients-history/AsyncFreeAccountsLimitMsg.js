import React from "react";
import {
    useProfile,
    useClientAdmin,
    useCentralAdmin,
} from "../../../../hooks/useRoleData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import getFirstName from "../../../../utils/string/getFirstName";

const showTxtDefault = (txt) => (
    <div className="mx-2 text-left text-normal animated rubberBand my-5">
        <p className="text-purple text-subtitle font-weight-bold m-0">
            Nota <FontAwesomeIcon icon="info-circle" />
        </p>
        {txt}
    </div>
);

// EXPIRING MSGS
const aboutToExpireMsg = ({
    limitFreePlanNewUsers,
    totalClientUsers,
    name,
}) => {
    const leftRegisters = limitFreePlanNewUsers - totalClientUsers;
    const txt = (
        <span>
            - Seus clientes estão começando a aparecer, {getFirstName(name)}.
            Ótimo! Faltam mais
            <br />
            <strong>{leftRegisters} cadastros</strong> na versão grátis. Que tal
            ganhar mais alcance e resultado?{" "}
            <Link to="/planos?cliente-admin=1" className="text-link">
                Invista em mais cadastros aqui e faça seu negócio brilhar.
            </Link>
        </span>
    );

    return showTxtDefault(txt);
};

const expiredMsg = () => {
    const txt = (
        <span>
            - O limite de cadastros para seu plano terminou. Mas calma, esse é
            só o começo. <br />
            <Link to="/planos?cliente-admin=1" className="text-link">
                Invista em mais cadastros aqui e continue fidelizando.
            </Link>
        </span>
    );
    return showTxtDefault(txt);
};
// END EXPIRING MSGS

// Need to reload to update. And even after reloaded, there's a delay to update...
// insert bizPlan checking in the component which holds this.
export default function AsyncFreeAccountsLimitMsg() {
    const { name } = useProfile();
    const { totalClientUsers } = useClientAdmin();
    const { limitFreePlanNewUsers } = useCentralAdmin();

    if (totalClientUsers >= limitFreePlanNewUsers) {
        return expiredMsg();
    } else if (totalClientUsers >= 7) {
        return aboutToExpireMsg({
            limitFreePlanNewUsers,
            totalClientUsers,
            name,
        });
    } else {
        return null;
    }
}
