import { Fragment, useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { Load } from "components/code-splitting/LoadableComp";
import useBackColor from "hooks/useBackColor";
import useAPI, { getTotalResults } from "api/useAPI";
import convertToReal from "utils/numbers/convertToReal";

const isSmall = window.Helper.isSmallScreen();

const AsyncLiveTradesList = Load({
    loader: () =>
        import(
            "./LiveTradesList" /* webpackChunkName: "pending-live-trading-list-lazy" */
        ),
});

const AsyncDoneList = Load({
    loader: () =>
        import(
            "./DoneTradesList" /* webpackChunkName: "done-trading-list-lazy" */
        ),
});

export default function MainAltrabot() {
    const [content, setContent] = useState("pending"); // done
    const isPending = content === "pending";

    useBackColor("var(--mainWhite)");

    const { data } = useAPI({
        url: getTotalResults(),
    });

    const totalNetProfitAmount = Math.abs(data && data.totalNetProfitAmount);
    const totalNetProfitPerc = data && data.totalNetProfitPerc;
    const isPlusProfit = totalNetProfitPerc >= 0;

    const showContentSwitcher = () => (
        <section className="my-4">
            <div className="d-flex justify-content-end mr-3">
                <ButtonFab
                    size={isSmall ? "small" : "large"}
                    title={isPending ? "VER HISTÓRICO" : "VER PENDENTES"}
                    backgroundColor="var(--themeSDark)"
                    onClick={() => setContent(isPending ? "done" : "pending")}
                    position="absolute"
                    top={15}
                    right={15}
                    variant="extended"
                />
            </div>
        </section>
    );

    const showTotalResults = () => (
        <section className="total-result font-site text-white text-shadow">
            <h2 className="pt-1 px-3 text-small font-weight-bold">
                Lucro Líquido Total:
            </h2>
            <p className="m-0 mb-1 container-center core-data d-table text-pill">
                {!isPlusProfit ? "- " : ""}
                {convertToReal(totalNetProfitAmount, {
                    moneySign: true,
                    needFraction: true,
                })}
                <br />({totalNetProfitPerc}%)
            </p>
            <style jsx>
                {`
                    .total-result {
                        position: absolute;
                        top: 0;
                        left: 0;
                        background: var(--themeP);
                        border-radius: 0 0 30px;
                    }

                    .total-result .core-data {
                        background-color: #fff;
                        border-radius: 20px;
                        color: ${isPlusProfit ? "green" : "var(--expenseRed)"};
                        text-shadow: none;
                    }
                `}
            </style>
        </section>
    );

    return (
        <Fragment>
            <section className="container-center">
                <section className="position-relative" width={300}>
                    <div
                        className="position-absolute animated fadeInUp slow delay-2s"
                        style={{
                            top: isSmall ? 90 : 30,
                            left: isSmall ? -80 : -150,
                        }}
                    >
                        <img
                            width={isSmall ? 100 : 200}
                            src="/img/icons/amurreto-altrabot.svg"
                            alt="altrabot"
                        />
                    </div>
                    <h1 // Altrabot - Algorithmic Trading Bot - Robo de Negociação Algorítmico
                        className="mx-3 text-title text-center text-purple"
                        style={{ marginTop: 100 }}
                    >
                        Amurreto
                        <br />
                        Altrabot
                    </h1>
                </section>
            </section>
            {showTotalResults()}
            {showContentSwitcher()}
            {isPending ? <AsyncLiveTradesList /> : <AsyncDoneList />}
        </Fragment>
    );
}
