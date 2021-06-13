import { useBizData } from "init";
import { gameIconsStore } from "components/biz/GamesBadge";
import { calendar } from "utils/dates/dateFns";
import UndoContentBtn from "./undo/UndoContentBtn";

export default function DoneCard({ data }) {
    const {
        game,
        benefitDesc,
        doneBy,
        customerName,
        beatGameList,
        updatedAt,
    } = data;

    const { themePColor } = useBizData();

    const selectBenefitType = () => {
        if (game === "discountBack") return "vale";
        return "prêmio";
    };

    const showStatusBadge = () => (
        <section className="done-card-status position-absolute">
            <section className="d-flex">
                <div className="container-center">
                    <p className="badge text-pill">Aplicado</p>
                </div>
                <UndoContentBtn />
            </section>
            <style jsx>
                {`
                    .done-card-status {
                        bottom: 10px;
                        right: -15px;
                    }

                    .done-card-status .badge {
                        background: var(--incomeGreen);
                    }
                `}
            </style>
        </section>
    );

    return (
        <section className="benefit-card--root mb-4 position-relative text-normal text-white text-shadow">
            <h2
                className="text-subtitle font-weight-bold"
                style={{ lineHeight: "25px" }}
            >
                {customerName && customerName.cap()}
                <span className="d-inline-block m-0 ml-2 text-normal">
                    recebeu:
                </span>
            </h2>
            <section className="d-flex my-2">
                <div className="container-center-col">
                    {gameIconsStore[game]}
                    <span className="font-weight-bold text-small">
                        {selectBenefitType(game)}
                    </span>
                </div>
                <div className="benefit-desc px-2 position-relative text-normal ml-3">
                    {benefitDesc}
                </div>
            </section>
            <div className="text-small">
                <strong>feito por:</strong>
                <br />
                {doneBy}
                <strong className="mt-1 d-block">{calendar(updatedAt)}</strong>
            </div>
            {showStatusBadge()}
            <style jsx>
                {`
                    .benefit-card--root {
                        padding: 8px 12px;
                        background: var(--themePDark--${themePColor});
                        border-radius: 15px;
                    }

                    .benefit-card--root svg {
                        font-size: 35px;
                    }

                    .benefit-card--root .benefit-desc {
                        line-height: 25px;
                        background: var(--mainWhite);
                        color: var(--themePDark--${themePColor});
                        text-shadow: none;
                        border-radius: 15px;
                        padding: 5px 0 5px 5px;
                        box-shadow: inset -0.1em -0.1em 0.2em grey;
                    }
                `}
            </style>
        </section>
    );
}
