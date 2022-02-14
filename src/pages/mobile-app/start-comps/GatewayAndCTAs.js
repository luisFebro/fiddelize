import { Fragment } from "react";
import getColor from "styles/txt";
import RedirectLink from "components/RedirectLink";
import RadiusBtn from "components/buttons/RadiusBtn";
import disconnect from "auth/disconnect";
import getFirstName from "utils/string/getFirstName";
import { useBizData } from "init";

import AccessGateKeeper from "auth/pages/access-password/mobile-app/AccessGateKeeper";

export default function GatewayAndCTAs({
    isSessionOver,
    themeBackColor,
    themeSColor,
    fullName,
    bizLinkName,
    loadingAccess,
}) {
    const { interfaceDigitalMenu } = useBizData();
    const isIntDgMenu = interfaceDigitalMenu;

    const handleLogout = () => {
        disconnect({ msg: true });
    };

    const showTitleArea = () => (
        <Fragment>
            {isIntDgMenu ? (
                <span
                    className={`${
                        getColor(themeBackColor).txtColor
                    } font-weight-bold`}
                >
                    <strong className="text-normal font-weight-bold">
                        {getFirstName(fullName)}, escolha painel:
                    </strong>
                    <br />
                </span>
            ) : (
                <span
                    className={`${
                        getColor(themeBackColor).txtColor
                    } font-weight-bold`}
                >
                    {!isSessionOver && "Conectado por"}
                    {!isSessionOver && <br />}
                    <strong className="text-title">{fullName}</strong>
                    <br />
                </span>
            )}
        </Fragment>
    );

    function InterfaceFormat() {
        if (isIntDgMenu) {
            return (
                <Fragment>
                    <section className="container-center mt-2">
                        <RedirectLink
                            className="mr-3"
                            to={`/${bizLinkName}/cliente-admin/painel-de-controle`}
                        >
                            <RadiusBtn
                                title="marketing"
                                backgroundColor={`var(--themeSDark--${themeSColor})`}
                            />
                        </RedirectLink>
                        <RedirectLink
                            className="ml-3"
                            to={`/${bizLinkName}/menu/p/admin`}
                        >
                            <RadiusBtn
                                position="relative"
                                title="menu digital"
                                backgroundColor={`var(--themeSDark--${themeSColor})`}
                            />
                        </RedirectLink>
                    </section>
                    <div className="my-3 container-center">
                        <RadiusBtn
                            title="sair"
                            backgroundColor="var(--mainRed)"
                            onClick={handleLogout}
                        />
                    </div>
                </Fragment>
            );
        }

        return (
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
        );
    }

    return (
        <section
            className={`${
                isSessionOver ? "" : "my-5"
            } container-center-col text-white text-normal text-center`}
        >
            {showTitleArea()}
            {!isSessionOver && <InterfaceFormat />}
            {isSessionOver && !loadingAccess && (
                <AccessGateKeeper
                    backColor={themeBackColor}
                    sColor={themeSColor}
                />
            )}
        </section>
    );
}
