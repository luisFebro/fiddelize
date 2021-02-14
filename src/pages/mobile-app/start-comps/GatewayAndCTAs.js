import { useStoreDispatch } from "easy-peasy";
import selectTxtStyle from "../../../utils/biz/selectTxtStyle";
import RedirectLink from "../../../components/RedirectLink";
import RadiusBtn from "../../../components/buttons/RadiusBtn";
import { logout } from "../../../redux/actions/authActions";
import { Load } from "../../../components/code-splitting/LoadableComp";

const AsyncAccessGateKeeper = Load({
    loader: () =>
        import(
            "../password/AccessGateKeeper" /* webpackChunkName: "gate-keeper-comp-lazy" */
        ),
});

export default function GatewayAndCTAs({
    isSessionOver,
    selfThemeBackColor,
    selfThemeSColor,
    fullName,
    bizCodeName,
    loadingAccess,
}) {
    const dispatch = useStoreDispatch();

    const handleLogout = () => {
        logout(dispatch);
    };

    return (
        <section
            className={`${
                isSessionOver ? "" : "my-5"
            } container-center-col text-white text-normal text-center`}
        >
            <span
                className={`${selectTxtStyle(
                    selfThemeBackColor
                )} font-weight-bold`}
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
                        to={`/${bizCodeName}/cliente-admin/painel-de-controle`}
                    >
                        <RadiusBtn
                            title="acessar"
                            backgroundColor={`var(--themeSDark--${selfThemeSColor})`}
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
                    backColor={selfThemeBackColor}
                    sColor={selfThemeSColor}
                />
            )}
        </section>
    );
}
