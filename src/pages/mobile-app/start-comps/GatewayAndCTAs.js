import getColor from "styles/txt";
import RedirectLink from "components/RedirectLink";
import RadiusBtn from "components/buttons/RadiusBtn";
import { Load } from "components/code-splitting/LoadableComp";
import disconnect from "auth/disconnect";

const AsyncAccessGateKeeper = Load({
    loading: false,
    loader: () =>
        import(
            "auth/pages/access-password/mobile-app/AccessGateKeeper" /* webpackChunkName: "gate-keeper-comp-lazy" */
        ),
});

export default function GatewayAndCTAs({
    isSessionOver,
    themeBackColor,
    themeSColor,
    fullName,
    bizLinkName,
    loadingAccess,
}) {
    const handleLogout = () => {
        disconnect();
    };

    return (
        <section
            className={`${
                isSessionOver ? "" : "my-5"
            } container-center-col text-white text-normal text-center`}
        >
            <span
                className={`${
                    getColor(themeBackColor).txtColor
                } font-weight-bold`}
            >
                {!isSessionOver && "Conectado por"}
                {!isSessionOver && <br />}
                <strong className="text-title animated bounce">
                    {fullName}
                </strong>
                <br />
            </span>
            {!isSessionOver && (
                <section className="container-center mt-4">
                    <RedirectLink
                        className="mr-3"
                        to={`/${bizLinkName}/cliente-admin/painel-de-controle`}
                    >
                        <RadiusBtn
                            title="painel"
                            backgroundColor={`var(--themeSDark--${themeSColor})`}
                        />
                    </RedirectLink>
                    <span>
                        <RadiusBtn
                            title="sair"
                            backgroundColor="var(--mainRed)"
                            onClick={handleLogout}
                        />
                    </span>
                </section>
            )}
            {isSessionOver && !loadingAccess && (
                <AsyncAccessGateKeeper
                    backColor={themeBackColor}
                    sColor={themeSColor}
                />
            )}
        </section>
    );
}
