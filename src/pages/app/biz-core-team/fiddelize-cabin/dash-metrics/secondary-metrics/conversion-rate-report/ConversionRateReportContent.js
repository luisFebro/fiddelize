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
                Total de clientes que tornarem-se pro
            </p>
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
        </section>
    );
}
