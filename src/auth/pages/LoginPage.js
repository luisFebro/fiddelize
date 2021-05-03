import { Fragment } from "react";
import AsyncLogin from "components/auth/AsyncLogin";
import CompLoader from "components/CompLoader";
import { Load } from "components/code-splitting/LoadableComp";
import useBackColor from "hooks/useBackColor";
import useScrollUp from "hooks/scroll/useScrollUp";
import useData from "init";

export const AsyncAccessGateKeeper = Load({
    loader: () =>
        import(
            "auth/pages/access-password/mobile-app/AccessGateKeeper" /* webpackChunkName: "remember-access-cómp-lazy" */
        ),
});

export default function LoginPage() {
    useScrollUp();
    useBackColor("var(--themeP)");

    const [rememberAccess, name, role] = useData([
        "rememberAccess",
        "name",
        "role",
    ]);
    const needGateKeeper = rememberAccess === true && role === "cliente-admin";

    return (
        <Fragment>
            {rememberAccess === "..." ? (
                <section
                    className="text-center text-title text-white"
                    style={{ margin: "100px 0" }}
                >
                    Carregando...
                </section>
            ) : (
                <section
                    className="container-center"
                    style={{ margin: "30px 0" }}
                >
                    {needGateKeeper && (
                        <section className="container-center-col">
                            <p className="my-3 font-weight-bold text-subtitle text-center text-white">
                                {name && name.cap()}
                            </p>
                            <AsyncAccessGateKeeper
                                backColor="default"
                                sColor="default"
                                accessClassname="mt-5"
                            />
                        </section>
                    )}
                    <div>
                        {!needGateKeeper && (
                            <div>
                                <CompLoader
                                    comp={<AsyncLogin rootClassname="mb-5" />}
                                    width={330}
                                    marginY={100}
                                    timeout={3500}
                                />
                            </div>
                        )}
                    </div>
                </section>
            )}
        </Fragment>
    );
}

/*
{rememberAccess !== true && (
    <div style={{ margin: "70px 0" }}>
        <AsyncLoyaltyScoreHandler />
    </div>
)}
 */
