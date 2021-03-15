import BuyReviewsBtn from "../../../../../dashboard-client-admin/dash-clients/clients-reviews/buy-reviews/BuyReviewsBtn";

export default function XpReports({
    uncheckedReviews = 0,
    lastDateChecked = new Date(),
}) {
    const pluralReviews = uncheckedReviews > 1 ? "s" : "";

    return (
        <section className="my-3">
            <h2 className="text-normal font-weight-bold mx-3 mt-5 mb-3 text-center text-purple">
                O que os clientes estão falando da Fiddelize?
            </h2>
            <p className="my-2 text-normal text-purple text-center">
                <span
                    className={`d-inline-block text-hero ${
                        uncheckedReviews !== "..." && uncheckedReviews > 0
                            ? "animated bounce delay-2s repeat-2"
                            : ""
                    }`}
                >
                    {uncheckedReviews}
                </span>{" "}
                relato{pluralReviews}
                <br />
                não lido{pluralReviews}
            </p>
            <section className="container-center mt-4">
                <BuyReviewsBtn lastDateChecked={lastDateChecked} />
            </section>
        </section>
    );
}
