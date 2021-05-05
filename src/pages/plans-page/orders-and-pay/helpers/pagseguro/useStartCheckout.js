import { useEffect } from "react";
import useAPI, { startCheckout } from "api/useAPI";

// start checkout and get and set session id.
export default function useStartCheckout({ userId, trigger }) {
    const { data: sessionId, loading, error, ShowError } = useAPI({
        method: "post",
        url: startCheckout(),
        params: { userId },
        trigger,
        needAuth: true,
        timeout: 30000,
    });

    useEffect(() => {
        const PagSeguro = window.PagSeguroDirectPayment;
        if (sessionId && PagSeguro) {
            PagSeguro.setSessionId(sessionId);
            console.log("Checkout started and sessionId set.");
        }
    }, [sessionId]);

    return {
        loading,
        error,
        ShowError,
    };
}
