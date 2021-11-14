export default function ShowPhotoContent() {
    const showTitle = () => (
        <div className="mt-4 mx-3 text-purple">
            <h1 className="text-subtitle text-center font-weight-bold">
                Foto do Prêmio
            </h1>
            <p className="text-normal">
                No app dos seus clientes, a foto do prêmio fica na caixa de
                prêmio.
            </p>
            <p>Clique na caixa</p>
        </div>
    );

    return <section>{showTitle()}</section>;
}
