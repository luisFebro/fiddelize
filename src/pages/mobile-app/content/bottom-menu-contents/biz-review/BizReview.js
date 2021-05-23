import { useEffect, useState, Fragment } from "react";
import { readUser } from "api/frequent";
import useData, { useBizData } from "init";
import removeImgFormat from "utils/biz/removeImgFormat";
import { Load } from "components/code-splitting/LoadableComp";

export const AsyncBuyRating = Load({
    loader: () =>
        import(
            "pages/client/loyalty-client-scores/rating/BuyRating" /* webpackChunkName: "buy-rating-comp-lazy" */
        ),
});

export default function BizReview() {
    const [data, setData] = useState({
        nps: null,
        xpScore: null,
        buyReport: null,
        gotReview: undefined,
        isLoading: true,
        error: false,
    });
    const { nps, error, xpScore, buyReport, gotReview, isLoading } = data;

    const [role, userId] = useData(["role", "userId"]);

    useEffect(() => {
        if (userId === "...") return;

        (async () => {
            const select = "clientUserData.review";
            const dataCliReview = await readUser(userId, role, select).catch(
                () => {
                    setData((prev) => ({
                        ...prev,
                        error: true,
                    }));
                }
            );
            const thisReview =
                dataCliReview && dataCliReview.clientUserData.review;
            const noReview = !thisReview || !thisReview.nps;

            if (noReview) {
                return setData((prev) => ({
                    ...prev,
                    gotReview: false,
                    isLoading: false,
                }));
            }

            setData((prev) => ({
                ...prev,
                nps: thisReview.nps,
                xpScore: thisReview.xpScore,
                buyReport: thisReview.buyReport,
                gotReview: true,
                isLoading: false,
            }));
        })();
    }, [userId, role]);

    const { bizLogo, bizName } = useBizData();
    const { newImg: thisBizLogo, width, height } = removeImgFormat(bizLogo);

    const showTitle = () => (
        <div className="my-5 pt-3">
            <div className="mb-3 container-center">
                <img
                    src={
                        thisBizLogo === undefined
                            ? "/img/official-logo-name.png"
                            : thisBizLogo
                    }
                    className="shadow-babadoo"
                    width={width} // prior: bizLogo === "undefined" && 200
                    height={height}
                    title="logo empresa"
                    alt="logo empresa"
                />
            </div>
            <p className="mx-3 text-subtitle text-purple text-center font-weight-bold">
                Suas Avaliações da {bizName}
            </p>
        </div>
    );

    if (error) {
        return (
            <Fragment>
                {showTitle()}
                <p
                    className="text-grey font-weight-bold text-normal text-center mx-3"
                    style={{ marginTop: 150 }}
                >
                    Não foi possível carregar no momento devido a conexão. Tente
                    novamente!
                </p>
            </Fragment>
        );
    }

    return (
        <section>
            {showTitle()}
            {isLoading && !error ? (
                <p
                    className="text-purple font-weight-bold text-subtitle text-center"
                    style={{ marginTop: 150 }}
                >
                    Carregando...
                </p>
            ) : (
                <section>
                    {gotReview === false ? (
                        <p
                            className="text-grey text-normal text-center mx-3"
                            style={{ marginTop: 150 }}
                        >
                            Nenhuma encontrada. Suas avaliações aparecerão aqui.
                        </p>
                    ) : (
                        <p className="text-grey text-normal text-left mx-3">
                            Aqui você pode atualizar suas avaliações e relato de
                            compra sempre que precisar.
                            <br />
                            Sua opinião é importante!
                        </p>
                    )}
                    {(nps || xpScore) && (
                        <AsyncBuyRating
                            defaultBuyReport={buyReport || " "}
                            onlyReportField
                        />
                    )}
                    {xpScore && (
                        <AsyncBuyRating
                            type="stars"
                            defaultGrade={xpScore}
                            removeReportField
                        />
                    )}
                    {nps && (
                        <AsyncBuyRating
                            type="nps"
                            defaultScale={nps}
                            removeReportField
                        />
                    )}
                </section>
            )}
        </section>
    );
}
