import { Load } from "components/code-splitting/LoadableComp";
import AddPointsBtn from "./add-points-btn/AddPointsBtn";

export const AsyncExpiringCoinsBadge = Load({
    loading: false,
    loader: () =>
        import(
            "./ExpiringCoinsBadge" /* webpackChunkName: "expiring-coins-badge-lazy" */
        ),
});

export default function PtsBalance({ showMoreComps, currPointsRef, txtColor }) {
    return (
        <section
            className={`text-subtitle ${
                showMoreComps && "mt-3"
            } text-white text-center`}
        >
            {showMoreComps && (
                <span
                    className={`animated fadeInUp d-block mb-3 text-title ${txtColor}`}
                >
                    Saldo:
                </span>
            )}
            <div className="d-flex justify-content-center">
                <p className={`m-0 text-hero ${txtColor}`} ref={currPointsRef}>
                    ...
                </p>
                {showMoreComps ? (
                    <section className="position-relative">
                        <span className={`animated fadeIn ml-2 ${txtColor}`}>
                            <img
                                className="pts-coin"
                                width={50}
                                height={50}
                                src="/img/app-pts-coin.svg"
                                alt="moeda digital pts para benefícios"
                            />
                            <style jsx>
                                {`
                                    .pts-coin {
                                        filter: drop-shadow(
                                            0.001em 0.001em 0.18em grey
                                        );
                                    }
                                `}
                            </style>
                        </span>
                        <div
                            className="animated fadeIn delay-2s position-absolute"
                            style={{
                                bottom: -5,
                                right: -75,
                            }}
                        >
                            <AsyncExpiringCoinsBadge />
                        </div>
                    </section>
                ) : (
                    <span className={`ml-2 ${txtColor}`}>Pontos</span>
                )}
            </div>
            <div
                className={`animated fadeInUp delay-2s ${
                    showMoreComps && "mt-3"
                } mb-4 container-center`}
            >
                <AddPointsBtn />
            </div>
        </section>
    );
}
