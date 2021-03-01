import { useEffect, useState } from "react";
import { IS_DEV } from "../../../../../config/clientUrl";

const sandboxMode = IS_DEV;
const payUrl = sandboxMode
    ? "https://stc.sandbox.pagseguro.uol.com.br"
    : "https://stc.pagseguro.uol.com.br";

export { sandboxMode };
export default function useStartPagseguro() {
    const [start, setStart] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");

        script.type = "text/javascript";
        script.src = `${payUrl}/pagseguro/api/v2/checkout/pagseguro.directpayment.js`;
        script.async = true;
        script.crossorigin = "anonymous";

        document.body.appendChild(script);
        setStart(true);
        console.log(
            `Pagseguro direct pay started on ${
                sandboxMode ? "DEV" : "PRODUCTION"
            }`
        );

        return () => {
            // document.body.removeChild(script);
        };
    }, []);

    return start;
}
