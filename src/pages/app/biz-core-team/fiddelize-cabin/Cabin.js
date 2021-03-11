import useBackColor from "../../../../hooks/useBackColor";

export default function Cabin() {
    useBackColor("var(--mainWhite)");

    const showTitle = () => (
        <div className="mt-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Cabine Fiddelize
            </p>
        </div>
    );

    return <section>{showTitle()}</section>;
}
