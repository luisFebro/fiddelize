import { useStoreDispatch } from "easy-peasy";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getVar, { removeVar } from "init/var";
import { textStyle } from "../DefaultRenderComps";
import ButtonFab from "../../../../buttons/material-ui/ButtonFab";
import useData from "init";
import showToast from "../../../../toasts";
import { readUser } from "../../../../../redux/actions/userActions";
import defineCurrChallenge from "../../../../../utils/biz/defineCurrChallenge";

export default function CliUserConfirmedChall({
    userName,
    currChall,
    prizeDesc,
    prizeDeadline,
    deadlineDate,
}) {
    const [role, userId] = useData(["role", "userId"]);
    const [loading, setLoading] = useState(false);

    const dispatch = useStoreDispatch();

    const { totalPurchasePrize } = useData();
    const updatedCurrChall = defineCurrChallenge(totalPurchasePrize);

    const handleCTA = (res) => {
        if (userId === "..." || !updatedCurrChall) return;

        setLoading(true);
        readUser(dispatch, userId, { role }).then((res) => {
            if (res.status !== 200)
                return showToast("Não foi possível atualizar. Reinicie app.", {
                    type: "error",
                });

            removeVersion({
                key: "alreadyAlertChallenge",
                value: updatedCurrChall,
            }).then((res) => {
                window.location.href =
                    role === "cliente-admin"
                        ? "/mobile-app?client-admin=1"
                        : "/mobile-app";

                removeVar("pendingChall");
                setLoading(false);
            });
        });
    };

    return (
        <section className={textStyle}>
            <header className="font-weight-bold">
                {userName}, segue os detalhes:
            </header>
            <br />
            <p>
                ✔ Prêmio do desafio nº {currChall}:
                <br />
                <strong> • {prizeDesc}</strong>
            </p>
            <p>
                ✔ Prazo para resgatar prêmio:
                <br />
                <strong>
                    • {prizeDeadline} dias
                    <br />
                    <span> (até {deadlineDate})</span>
                </strong>
            </p>
            <section className="container-center my-5">
                <ButtonFab
                    title={loading ? "Processando..." : "Começar novo desafio"}
                    onClick={handleCTA}
                    iconFontAwesome={<FontAwesomeIcon icon="minus-circle" />}
                    backgroundColor="var(--themeSDark)"
                    variant="extended"
                    position="relative"
                    size="large"
                />
            </section>
        </section>
    );
}

// HELPERS
// handle the variable version to be removed - challenge_1 - always insert _1 to get the version.
function removeVersion({ key, value }) {
    if (!key || !value) return null;

    return getVar(key).then((storedVersion) => {
        const currVersion = Number(value);
        if (currVersion >= Number(storedVersion)) {
            removeVar(key);
        }
    });
}
// END HELPERS
