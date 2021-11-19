export default function ConversionRateReportContent({
    mainData,
    percFreeCustomers,
    percProCustomers,
}) {
    const totalCustomersCount =
        mainData && mainData.customersCount ? mainData.customersCount : "...";
    const freeCustomersCount =
        mainData && mainData.freeCustomersCount
            ? mainData.freeCustomersCount
            : "...";
    const proCustomersCount =
        mainData && mainData.proCustomersCount
            ? mainData.proCustomersCount
            : "...";

    const showTitle = () => (
        <div className="my-4 text-center">
            <h2 className="text-subtitle text-purple font-weight-bold">
                Taxa de Conversão
                <br />
                Geral
            </h2>
            <p className="mx-3 text-normal text-purple">
                Relação de clientes que se tornaram pro
            </p>
        </div>
    );

    const showMetricsTable = () => (
        <div className="my-5 conversion-rate-table">
            <div className="mx-3 text-normal shadow-babadoo text-purple">
                <h2 className="text-subtitle font-weight-bold text-center">
                    Parâmetros
                </h2>
                <div className="">
                    <p>
                        <span className="text-pill">&gt;= 15</span> Excelente
                    </p>
                    <p>
                        <span className="text-pill">&gt;= 10</span> Ótimo
                    </p>
                    <p>
                        <span className="text-pill">&gt;= 5</span> Bom
                    </p>
                    <p>
                        <span className="text-pill">&lt; 5</span> Ruim
                    </p>
                </div>
            </div>
            <style jsx>
                {`
                    .conversion-rate-table div {
                        background: var(--mainWhite);
                        border-radius: 20px;
                        padding: 10px;
                    }
                `}
            </style>
        </div>
    );

    return (
        <section>
            {showTitle()}
            <section
                className="d-flex justify-content-around"
                style={{
                    marginTop: 100,
                }}
            >
                <div className="container-center-col">
                    <p
                        className="font-site text-em-2-5 text-purple font-weight-bold text-pill"
                        style={{
                            color: "var(--strongGreen)",
                        }}
                    >
                        {percProCustomers} %
                    </p>
                    <p className="text-center text-normal text-purple">
                        {proCustomersCount} clientes
                        <br />
                        versão paga
                    </p>
                </div>
                <div className="container-center-col">
                    <p className="font-site text-em-2-5 text-purple font-weight-bold">
                        {percFreeCustomers} %
                    </p>
                    <p className="text-center text-normal text-purple">
                        {freeCustomersCount} clientes
                        <br />
                        versão gratis
                    </p>
                </div>
            </section>
            <p className="mt-3 text-purple text-subtitle text-center">
                Total de <strong>{totalCustomersCount} clientes</strong>
            </p>
            {showMetricsTable()}
            <div className="mx-3 text-grey my-5 font-site text-em-1-1">
                <span className="text-purple text-normal font-weight-bold">
                    Notas:
                </span>
                <br />- Clientes com versão gratis incluem tanto aqueles que{" "}
                <strong>nunca compraram um plano pro</strong> ou aqueles que
                tiveram seus planos pro e mês de manutenção{" "}
                <strong>expirados</strong>, assim retornando para a versão
                gratis.
                <br />
                <br />- In the software space, the average lead generation
                conversion rates are from <strong>5-10%</strong>, for SaaS is
                5%.
                <br />
                <br />- For the B2B software industry, it’s been said that{" "}
                <strong>7% is a strong conversion rate</strong>, and it’s been
                suggested that marketers shoot for somewhere in the 5-10% range.
                <br />
                <br />
                - Conversion Rate =
                <br />
                <strong>(num. paid users / total users) * 100</strong>
            </div>
        </section>
    );
}
