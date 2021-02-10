import React from "react";
import convertToReal from "../../utils/numbers/convertToReal";
import usePro from "../../hooks/pro/usePro";
import ProCreditsBtn from "./pro-credits-btn/ProCreditsBtn";
// import { useRunComp } from '../../hooks/useRunComp';

export default function ProCreditsBadge({ service = "Novvos Clientes" }) {
    let {
        loading,
        isPro,
        credits,
        plan: currPlan,
        usageTimeEnd,
        daysLeft,
    } = usePro({
        service,
    });

    // const { runName } = useRunComp();
    // if(runName === "ProCreditsBadge") credits -= 1;

    const modalData = {
        isCreditsBadge: true, // it will allow period choice and handle individual order
        currPlan: currPlan === "gratis" ? "bronze" : currPlan,
        expiryDate: usageTimeEnd,
    };

    const creditsCond = Boolean(loading && !isPro ? credits : credits >= 0); // avoid displaying zero for pro plans when they got credits.

    return (
        <section className="d-table position-relative">
            <div className="text-pill text-center main-font text-normal font-weight-bold">
                {creditsCond
                    ? `${convertToReal(credits)} crédito${
                          credits === 1 ? "" : "s"
                      }`
                    : `... crédito${credits === 1 ? "" : "s"}`}
            </div>
            {Boolean(isPro && daysLeft) && (
                <p className="text-small text-purple font-weight-bold">
                    Expira em
                    <span className="ml-1 d-inline-block text-normal font-weight-bold">
                        {daysLeft ? `${daysLeft} dias` : "... dias"}
                    </span>
                </p>
            )}
            <div className="position-absolute" style={{ right: -40, top: -10 }}>
                <ProCreditsBtn modalData={modalData} service={service} />
            </div>
        </section>
    );
}
