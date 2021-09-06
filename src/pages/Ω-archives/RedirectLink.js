import { useEffect, useState } from "react";
import { setVar } from "init/var";
import getAPI, { getUrlLink } from "api";

// This page was moved to official website fiddelize.com

// linkCode example: alan_yvs493z0
export default function RedirectLink({ match }) {
    const [error, setError] = useState("");
    const code = match.params.nameAndCode;

    useEffect(() => {
        getAPI({
            url: getUrlLink(code),
            timeout: 10000000,
        })
            .then((link) => {
                (async () => {
                    await setVar({ linkCode: code }, "user");
                    window.location.href = link;
                })();
            })
            .catch((err) => {
                if (!err)
                    return setError("Problema de Conexão. Tente novamente...");
                return setError(err);
            });
    }, [code]);

    return (
        <div
            style={{ backgroundColor: "var(--mainWhite)", minHeight: "350px" }}
            className="mt-3 pt-1"
        >
            <div className="text-title text-purple m-3">
                {error ? (
                    <p className="text-red">{error}</p>
                ) : (
                    "Redirecionando..."
                )}
            </div>
        </div>
    );
}
