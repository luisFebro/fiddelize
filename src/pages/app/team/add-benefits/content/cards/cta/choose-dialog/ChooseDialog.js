import { gameIconsStore } from "components/biz/GamesBadge";
import { useBizData } from "init";
import DiscountBenefitBtn from "../benefit/DiscountBenefitBtn";

const selectBenefitType = (game) => {
    if (game === "discountBack") return "vale";
    return "prêmio";
};

export default function ChooseDialog({ benefitsList, closeModal }) {
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
        <section className="text-white mx-3">
            {showTitle()}
            <section className="d-flex text-shadow justify-content-around animated fadeInUp choose-options-area">
                {benefitsList.map((g) => (
                    <div key={g.game} className="card position-relative">
                        <div className="icon-wrapper">
                            {gameIconsStore[g.game]}
                        </div>
                        <h2 className="text-center text-normal font-weight-bold">
                            {selectBenefitType(g.game)}
                        </h2>
                        <p className="text-small pb-5 font-weight-bold">
                            {g.desc}
                        </p>
                        <div className="cta my-3 container-center position-absolute">
                            <DiscountBenefitBtn
                                title="este aqui"
                                needTxtNoWrap
                                position="relative"
                                gameName={g.game}
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
                            padding: 10px;
                            width: 150px;
                            border-radius: 25px;
                            background: var(--themePDark--${themePColor});
                        }

                        .choose-options-area .card .icon-wrapper {
                            position: relative;
                            min-height: 100px;
                        }

                        .choose-options-area .card svg {
                            font-size: 85px;
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
            </section>
        </section>
    );
}
