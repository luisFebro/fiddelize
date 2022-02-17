export default function CustomerPanelContent() {
    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-white text-shadow text-center font-weight-bold">
                Painel do Cliente
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
            <p className="text-subtitle text-white text-shadow text-center font-weight-bold">
                Em breve
            </p>
        </section>
    );
}
