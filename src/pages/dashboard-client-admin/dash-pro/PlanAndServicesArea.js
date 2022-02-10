import BillingCycleActiveItems from "./billing-cycle-active-items/BillingCycleActiveItems";
// import AdminFidelidometro from "./admin-fidelidometro/AdminFidelidometro";

export default function PlanAndServicesArea({ isPro, plan, period }) {
    return (
        <section className="my-5">
            <div className="text-subtitle font-weight-bold text-purple">
                Versão {isPro ? "Pro" : "Atual"}:
                <span className="d-block-inline d-flex text-em-1-7 text-relative">
                    {isPro ? "Plano" : ""}
                    <div
                        className={`ml-3 position-relative ${
                            isPro ? "line-height-35" : ""
                        }`}
                    >
                        {plan && plan.toUpperCase()}
                        {isPro && (
                            <p className="font-site text-em-0-6 position-relative">
                                {period}
                            </p>
                        )}
                    </div>
                </span>
            </div>
            <BillingCycleActiveItems />
        </section>
    );
}

/*
<AdminFidelidometro loading={loading} totalScore={totalScore} />
 */
