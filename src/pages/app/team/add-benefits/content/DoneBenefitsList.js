import DoneCard from "./cards/DoneCard";

export default function DoneBenefitsList() {
    const benefitsCount = 0;
    const needIllustration = benefitsCount === 0;
    const plural = benefitsCount > 1 ? "s" : "";

    const showEmptyIllustration = () => (
        <section className="mx-3 my-5 container-center-col">
            <img
                width={300}
                src="/img/illustrations/empty-benefits.svg"
                alt="nenhum benefício"
            />
            <h2 className="mt-3 text-normal font-weight-bold text-grey">
                Nenhum benefício realizado.
            </h2>
        </section>
    );

    if (needIllustration) return showEmptyIllustration();

    const data = {
        name: "Luis Febro",
    };

    return (
        <section className="text-purple mx-3">
            {Boolean(benefitsCount) && (
                <h2 className="my-3 text-normal font-weight-bold text-center">
                    <span className="text-subtitle font-weight-bold">
                        {benefitsCount} benefício{plural}
                    </span>{" "}
                    recebido{plural}.
                </h2>
            )}
            <DoneCard data={data} />
            <div style={{ marginBottom: 150 }} />
        </section>
    );
}
