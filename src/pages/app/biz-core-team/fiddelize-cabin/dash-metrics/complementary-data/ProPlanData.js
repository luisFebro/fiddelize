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
                    {planBronze} bronze
                </p>
                <p
                    className="text-normal text-pill font-weight-bold"
                    style={{
                        color: "var(--mainWhite)",
                    }}
                >
                    {planSilver} prata
                </p>
                <p
                    className="text-normal text-pill font-weight-bold"
                    style={{
                        color: "var(--lightYellow)",
                    }}
                >
                    {planGold} ouro
                </p>
            </div>
            <p className="mt-2 text-purple text-subtitle font-weight-bold text-center">
                Períodos
            </p>
            <div className="d-flex justify-content-around">
                <p className="text-normal text-pill">{periodMonthly} mensais</p>
                <p className="text-normal text-pill">{periodYearly} anuais</p>
            </div>
        </section>
    );
}
