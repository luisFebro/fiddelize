import React, { useEffect } from "react";
import useData from "../../../../hooks/useData";
import AccessPassCreation from "../../../dashboard-client-admin/pass-page/AccessPassCreation";
import { getVar } from "../../../../hooks/storage/useVar";
import isThisApp from "../../../../utils/window/isThisApp";
import useBackColor from "../../../../hooks/useBackColor";

const isApp = isThisApp();

export default function AgentNewPassword({ history }) {
    const [userId, name] = useData(["userId", "firstName"]);

    useBackColor("var(--themeP)");

    useEffect(() => {
        (async () => {
            const isDone = await getVar("donePswd");
            if (isDone)
                history.push(isApp ? "/t/app/nucleo-equipe/acesso" : "/acesso");
        })();
    }, []);

    if (userId === "...") {
        return (
            <p className="full-page text-white text-shadow text-subtitle font-weight-bold text-center">
                Carregando...
            </p>
        );
    }

    return (
        <AccessPassCreation userName={name} userId={userId} isBizTeam={true} />
    );
}
