import { Load } from "components/code-splitting/LoadableComp";

const AsyncRegisterBonusCoins = Load({
    loader: () =>
        import(
            "./register-bonus-coins/RegisterBonusCoins" /* webpackChunkName: "bonus-coins-comp-lazy" */
        ),
});

const AsyncCoinsExpiration = Load({
    loader: () =>
        import(
            "./coins-expiration/CoinsExpiration" /* webpackChunkName: "coins-expiration-comp-lazy" */
        ),
});

export default function DigitalCoins() {
    return (
        <section className="hidden-content--root">
            <AsyncRegisterBonusCoins />
            <hr className="lazer-purple" />
            <AsyncCoinsExpiration />
        </section>
    );
}
