import { useEffect } from "react";
import isOffline from "utils/server/isOffline";
import showToast from "components/toasts";
import useData from "init";
import getVar, { setVar, removeVar } from "init/var";

const isConexionOff = isOffline();
console.log("isConexionOff", isConexionOff);

export default function useOffline() {
    const [firstName, loading] = useData(["firstName"]);

    useEffect(() => {
        if (loading) return;

        handleConectionMsg(firstName);

        // check conection every time see the screen
        window.addEventListener("focus", async () => {
            await handleConectionMsg(firstName);
        });
    }, [firstName, loading]);

    return { isOffline: isConexionOff };
}

// HELPERS
async function handleConectionMsg(firstName) {
    // need to recheck the connection again.
    const isOff = isOffline();

    if (isOff) {
        return await getVar("offlineApp").then(async (gotOfflineMsg) => {
            if (gotOfflineMsg) return null;

            showToast(
                `MODO OFFLINE ATIVADO! ${
                    firstName ? `${firstName}, algumas` : "Algumas"
                } funcionalidades estão temporariamente desativadas.`,
                { dur: 20000 }
            );

            return await setVar({ offlineApp: true });
        });
    }

    return await getVar("offlineApp").then(async (gotOfflineMsg) => {
        if (!gotOfflineMsg) return null;

        const internetBackTxt = firstName
            ? `Legal! A internet voltou, ${firstName}!`
            : `Legal! A internet voltou. Tenha uma ótima navegação!`;

        showToast(internetBackTxt, {
            type: "success",
            dur: 15000,
        });

        return await removeVar("offlineApp");
    });
}
// END HELPERS
