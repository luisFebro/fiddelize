import AddPointsBtn from "./add-points-btn/AddPointsBtn";

export default function PtsBalance({ showMoreComps, currPointsRef, txtColor }) {
    return (
        <section className="text-subtitle mt-3 text-white text-center">
            <span className={`text-title ${txtColor}`}>Seu Saldo:</span>
            <br />
            <div className="d-flex justify-content-center">
                <p className={`m-0 text-hero ${txtColor}`} ref={currPointsRef}>
                    ...
                </p>
                {showMoreComps ? (
                    <span
                        className={`animated fadeIn delay-1s ml-2 ${txtColor}`}
                    >
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
                ) : (
                    <span className={`ml-2 ${txtColor}`}>Pontos</span>
                )}
            </div>
            <div className="animated fadeInUp delay-2s mt-3 mb-4 container-center">
                <AddPointsBtn />
            </div>
        </section>
    );
}
