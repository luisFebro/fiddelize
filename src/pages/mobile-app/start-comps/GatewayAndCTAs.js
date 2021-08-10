import getColor from "styles/txt";
import RedirectLink from "components/RedirectLink";
import RadiusBtn from "components/buttons/RadiusBtn";
import disconnect from "auth/disconnect";

import AccessGateKeeper from "auth/pages/access-password/mobile-app/AccessGateKeeper";

export default function GatewayAndCTAs({
    isSessionOver,
    themeBackColor,
    themeSColor,
    fullName,
    bizLinkName,
    loadingAccess,
}) {
    const handleLogout = () => {
        disconnect({ msg: true });
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
                <section className="container-center mt-2">
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
                <AccessGateKeeper
                    backColor={themeBackColor}
                    sColor={themeSColor}
                />
            )}
        </section>
    );
}
