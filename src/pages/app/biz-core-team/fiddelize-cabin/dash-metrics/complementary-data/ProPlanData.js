export default function ProPlanData({ mainData }) {
    const planData = mainData && mainData.planData ? mainData.planData : {};

    const {
        periodMonthly,
        periodYearly,
        planBronze,
        planGold,
        planSilver,
    } = planData;

    return (
        <section>
            <p className="mt-5 text-purple text-subtitle font-weight-bold text-center">
                Dados Gerais
                <br />
                Venda de Planos
            </p>
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
                <p
                    className="text-normal text-pill font-weight-bold"
                    style={{
                        color: "var(--lightYellow)",
                    }}
                >
                    {planGold || 0} ouro
                </p>
            </div>
            <p className="mt-2 text-purple text-subtitle font-weight-bold text-center">
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
        </section>
    );
}
