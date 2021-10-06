import { gameIconsStore } from "components/biz/GamesBadge";
import { useBizData } from "init";
import DiscountBenefitBtn from "../benefit/DiscountBenefitBtn";

const selectBenefitType = (game) => {
    if (game === "discountBack") return "vale";
    return "prêmio";
};

export default function ChooseDialog(props) {
    const { allBenefitGames = [] } = props;
    const { themePColor } = useBizData();

    const showTitle = () => (
        <div className="mt-3 text-center text-purple mx-3">
            <h1 className="text-subtitle font-weight-bold">
                Qual benefício
                <br />o cliente prefere?
            </h1>
        </div>
    );

    return (
        <section className="text-white mx-1">
            {showTitle()}
            <section
                className={`${
                    allBenefitGames.length <= 2 ? "animated fadeInUp" : ""
                } container text-shadow choose-options-area`}
            >
                <div className="row">
                    {allBenefitGames.map((g) => (
                        <div
                            key={g.game}
                            className="col-2 mx-auto mb-4 card position-relative"
                        >
                            <div className="icon-wrapper">
                                {gameIconsStore[g.game]}
                            </div>
                            <h2 className="text-center text-normal font-weight-bold">
                                {selectBenefitType(g.game)}
                            </h2>
                            <p className="text-small pb-5 font-weight-bold">
                                {g.benefitDesc}
                            </p>
                            <div className="cta my-3 container-center position-absolute">
                                <DiscountBenefitBtn
                                    title="este aqui"
                                    needTxtNoWrap
                                    position="relative"
                                    totalBenefitsList={
                                        allBenefitGames &&
                                        allBenefitGames.length
                                    }
                                    {...props}
                                    {...g}
                                    gameName={g.game} // LESSON: this order matters, DO NOT CHANGE IT! to override undefined gameName picked from one single benefit select
                                />
                            </div>
                        </div>
                    ))}
                    <style jsx>
                        {`
                            .choose-options-area {
                                margin-top: 100px;
                            }

                            .choose-options-area .card {
                                max-width: 140px;
                                padding: 0px 10px;
                                border-radius: 25px;
                                background: var(--themePDark--${themePColor});
                            }

                            .choose-options-area .card .icon-wrapper {
                                position: relative;
                                min-height: 100px;
                            }

                            .choose-options-area .card .icon-wrapper svg {
                                font-size: 80px !important;
                                color: #ff0;
                                padding: 5px;
                            }

                            .choose-options-area .card .cta {
                                bottom: 0px;
                                left: 50%;
                                transform: translateX(-50%);
                            }
                        `}
                    </style>
                </div>
            </section>
        </section>
    );
}
