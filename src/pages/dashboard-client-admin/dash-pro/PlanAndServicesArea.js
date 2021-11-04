import BillingCycleActiveItems from "./billing-cycle-active-items/BillingCycleActiveItems";
// import AdminFidelidometro from "./admin-fidelidometro/AdminFidelidometro";

export default function PlanAndServicesArea({ isPro, plan }) {
    return (
        <section className="my-5">
            <div className="text-subtitle font-weight-bold text-purple">
                Versão {isPro ? "Pro" : "Atual"}:
                <span className="d-block text-em-1-7">
                    {isPro ? "Plano" : ""} {plan && plan.toUpperCase()}
                </span>
            </div>
            <BillingCycleActiveItems />
        </section>
    );
}

/*
<AdminFidelidometro loading={loading} totalScore={totalScore} />
 */
