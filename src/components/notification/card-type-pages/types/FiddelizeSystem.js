export default function FiddelizeSystem() {
    const showTitle = () => (
        <div className="mt-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Fiddelize informe
            </p>
        </div>
    );

    return <section>{showTitle()}</section>;
}
