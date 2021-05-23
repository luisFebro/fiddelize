import { Fragment } from "react";
import Card from "@material-ui/core/Card";
import { formatDMY } from "utils/dates/dateFns";
import convertToReal from "utils/numbers/convertToReal";
// points are removed for these 4 main reasons:
// 1. incorrect amount of points
// 2. points sent more than once
// 3. points sent to a wrong customer.
// 4. reinbursement
// 5. custom short justification by cli-admin

export default function InOutCard({ historyData }) {
    const { cardType, desc, value, createdAt = new Date() } = historyData;

    const isCardIn = cardType === "in";
    const mainTitle = `Pontos ${isCardIn ? "Adicionados" : "Removidos"}`;

    const showPoints = () => (
        <Fragment>
            <div className="discounted-points--root">
                <p className="mb-1 ml-3 discounted-points text-subtitle font-weight-bold">
                    {isCardIn ? "" : "-"}
                    {convertToReal(value)}
                    <span className="d-inline-block text-small font-weight-bold ml-1">
                        pts
                    </span>
                </p>
            </div>
            <style jsx>
                {`
                    .discounted-points--root {
                        display: flex;
                        justify-content: flex-end;
                    }
                    .discounted-points {
                        padding: 0px 8px;
                        background: ${isCardIn
                            ? "var(--mainDark)"
                            : "var(--mainWhite)"};
                        color: ${isCardIn
                            ? "rgb(255, 255, 0)"
                            : "var(--expenseRed)"};
                        border-radius: 25px;
                        text-shadow: none;
                    }
                `}
            </style>
        </Fragment>
    );

    const showTimestamp = () => (
        <Fragment>
            <div className="text-left timestamp mt-1 text-small font-weight-bold">
                {formatDMY(createdAt)}
            </div>
            <style jsx>
                {`
                    .timestamp {
                        line-height: 18px;
                    }
                `}
            </style>
        </Fragment>
    );

    const displayMainContent = () => (
        <section className="p-2 text-shadow text-white text-center">
            <main className="title container-center">
                <span className="benefit-title d-inline-block ml-3 text-normal font-weight-bold">
                    {mainTitle}
                </span>
                <style jsx>
                    {`
                        .main-title {
                            padding-top: 10px;
                        }

                        .main-title div svg {
                            font-size: 50px;
                            filter: drop-shadow(0 0 25px grey);
                            color: #ff0;
                        }
                        .title {
                            line-height: 17px;
                        }
                    `}
                </style>
            </main>
            <p className="m-0 my-2 text-left font-site text-em-1-1">
                Motivo:{" "}
                <span className="d-inline-block text-normal font-weight-bold">
                    {desc}
                </span>
            </p>
            {showPoints()}
            {showTimestamp()}
        </section>
    );

    return (
        <section className="my-5 position-relative">
            <Card
                key={historyData.desc}
                style={{
                    background: isCardIn
                        ? "var(--incomeGreen)"
                        : "var(--expenseRed)",
                }}
            >
                {displayMainContent()}
            </Card>
        </section>
    );
}
