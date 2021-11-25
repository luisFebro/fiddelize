export default function FiddelizeSystem({ content }) {
    const showTitle = () => (
        <div className="mt-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Fiddelize informa
            </p>
            <p>{content}</p>
        </div>
    );

    return <section>{showTitle()}</section>;
}
