import { useEffect } from "react";
import isOffline from "../utils/server/isOffline";
import { setVar, removeVar, getVar } from "./storage/useVar";
import showToast from "../components/toasts";
import useData from "./useData";

const isConexionOff = isOffline();

export default function useOffline() {
    const [firstName] = useData(["firstName"]);

    useEffect(() => {
        if (firstName === "...") return;

        if (isConexionOff) {
            getVar("offlineApp").then((res) => {
                if (!res)
                    showToast(
                        `MODO OFFLINE ATIVADO! ${
                            `${firstName}, algumas` || "Algumas"
                        } funcionalidades estão temporariamente desativadas.`,
                        { dur: 20000 }
                    );
            });
            setVar({ offlineApp: true });
        } else {
            getVar("offlineApp")
                .then((res) => {
                    if (res) {
                        removeVar("offlineApp");
                        const internetBackTxt = firstName
                            ? `Legal! A internet voltou, ${firstName}!`
                            : `Legal! A internet voltou. Tenha uma ótima navegação!`;
                        showToast(internetBackTxt, {
                            type: "success",
                            dur: 15000,
                        });
                    }
                })
                .catch((e) =>
                    console.log(`smg wrong with offlineApp. Details: ${e}`)
                );
        }
    }, [firstName]);

    return { isOffline: isConexionOff };
}
