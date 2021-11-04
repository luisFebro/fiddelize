export default function ActiveItemsContent() {
    const showTitle = () => (
        <div className="mt-5 text-purple">
            <h1 className="text-subtitle text-center font-weight-bold">
                Serviços Ativos do Plano
            </h1>
            <h2
                className="text-normal text-center"
                style={{
                    lineHeight: "25px",
                }}
            >
                Na Fiddelize, seus{" "}
                <strong>créditos não usados acumulam ao renovar</strong> seu
                plano dentro do período de duração e você ganha mais tempo para
                usar.
            </h2>
        </div>
    );

    return <section className="text-normal text-purple">{showTitle()}</section>;
}
