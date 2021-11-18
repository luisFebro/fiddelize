export default function ProPlanData({ mainData }) {
    const planData = mainData && mainData.planData ? mainData.planData : {};

    const {
        periodMonthly,
        periodYearly,
        periodInfinite,
        planBronze,
        planGold,
        planSilver,
    } = planData;

    const showPlans = () => (
        <section>
            <div className="d-flex justify-content-around">
                <p
                    className="text-normal text-pill font-weight-bold"
                    style={{
                        color: "#d0bcb6",
                    }}
                >
                    {planBronze || 0} bronze
                </p>
                <p
                    className="text-normal text-pill font-weight-bold"
                    style={{
                        color: "var(--mainWhite)",
                    }}
                >
                    {planSilver || 0} prata
                </p>
            </div>
            <div className="container-center">
                <p
                    className="text-normal text-pill font-weight-bold"
                    style={{
                        color: "var(--lightYellow)",
                    }}
                >
                    {planGold || 0} ouro
                </p>
            </div>
        </section>
    );

    const showPeriods = () => (
        <section>
            <p className="text-purple text-subtitle font-weight-bold text-center">
                Períodos
            </p>
            <div className="d-flex justify-content-around">
                <p className="text-normal text-pill">
                    {periodMonthly || 0} mensais
                </p>
                <p className="text-normal text-pill">
                    {periodYearly || 0} anuais
                </p>
            </div>
            <div className="container-center">
                <p className="text-normal text-pill">
                    {periodInfinite || 0} ilimitado
                </p>
            </div>
        </section>
    );

    return (
        <section>
            <p className="mt-5 text-purple text-subtitle font-weight-bold text-center">
                Dados Gerais
                <br />
                Venda de Planos
                <br />
                <span className="text-normal text-grey">
                    (inclui renovações e extras)
                </span>
            </p>
            {showPlans()}
            <div className="mt-2" />
            {showPeriods()}
        </section>
    );
}
