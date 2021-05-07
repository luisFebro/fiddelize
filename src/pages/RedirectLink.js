import { useEffect, useState } from "react";
import { setVar } from "init/var";
import getAPI, { getUrlLink } from "api";

// linkCode example: alan_yvs493z0
export default function RedirectLink({ match }) {
    const [error, setError] = useState("");
    const code = match.params.nameAndCode;

    useEffect(() => {
        getAPI({
            url: getUrlLink(code),
            fullCatch: true,
        }).then((res) => {
            if (res.status === 500)
                return setError("Problema de Conexão. Tente novamente...");
            if (res.status !== 200) return setError("Link Inválido!");

            (async () => {
                await setVar({ linkCode: code }, "user");
                window.location.href = res.data;
            })();
        });
    }, [code]);

    return (
        <div
            style={{ backgroundColor: "var(--mainWhite)", minHeight: "350px" }}
            className="mt-2"
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
