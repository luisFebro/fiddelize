export default function ReceivedBenefits() {
    const showTitle = () => (
        <section className="py-4">
            <h1 className="animated fadeIn text-subtitle font-weight-bold text-center">
                Ganhos de Benefícios
            </h1>
            <h2
                className="text-normal text-center animated fadeIn delay-2s"
                style={{
                    lineHeight: "25px",
                }}
            >
                Todos seus benefícios recebidos em um só lugar.
            </h2>
        </section>
    );

    return <section className="text-purple">{showTitle()}</section>;
}
