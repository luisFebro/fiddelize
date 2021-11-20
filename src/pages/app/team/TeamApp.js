import { Fragment } from "react";
import useData, { useBizData } from "init";
import { Load } from "components/code-splitting/LoadableComp";
import getDayGreetingBr from "utils/getDayGreetingBr";
import removeImgFormat from "utils/biz/removeImgFormat";
import NotifPermissionBanner from "components/pwa-push-notification/NotifPermissionBanner";
import useBackColor from "hooks/useBackColor";
import getColor from "styles/txt";
import TeamSpeedDialBtn from "./TeamSpeedDialBtn";
import "./_TeamApp.scss";
import RegisterPanelBtn from "../../dashboard-client-admin/dash-clients/clients-history/register-panel-btn/RegisterPanelBtn";
import AddTempPointsBtn from "./add-points/AddTempPointsBtn";
import AddBenefitsBtn from "./add-benefits/AddBenefitsBtn";
import BtnBackTestMode from "../../mobile-app/content/test-mode-btn/BtnBackTestMode";
// import ReturnBtn from 'components/buttons/ReturnBtn';

export const AsyncBellNotifBtn = Load({
    loading: false,
    loader: () =>
        import(
            "components/notification/BellNotifBtn" /* webpackChunkName: "bell-notif-team-lazy" */
        ),
});

export default function TeamApp({
    history,
    location,
    isCliAdmin,
    // toTab = "Cliente",
}) {
    const [firstName, userId, bizId] = useData([
        "firstName",
        "userId",
        "bizId",
    ]);
    const isPreviewMode = location && location.search.includes("modo-prev=1");

    const { notifCount } = useData();

    const needAdminDefaultTheme = isCliAdmin && !isPreviewMode;

    const {
        bizLogo,
        themeBackColor: backColor,
        themeSColor: sColor,
        themePColor: pColor,
    } = useBizData();
    const { needDark, txtColor } = getColor(backColor);

    const { newImg: thisBizLogo, width, height } = removeImgFormat(bizLogo);

    useBackColor(
        `var(--themeBackground--${
            needAdminDefaultTheme ? "default" : backColor
        })`
    );

    const showNotifBell = () => {
        const displayBack = () => (
            <section
                className="back"
                style={{
                    background: `var(--themeP${
                        backColor === "black" ? "Light" : "Dark"
                    }--${pColor})`,
                }}
            />
        );

        const totalNotifications = isPreviewMode ? 0 : notifCount;
        const displayBell = () => (
            <section
                style={{
                    float: "right", // float solves the problem of aligning and clickable div inside absolute container
                }}
            >
                <AsyncBellNotifBtn
                    needClick={!isPreviewMode}
                    position="relative"
                    top={-25}
                    right={25}
                    notifBorderColor={`var(--themeP${
                        backColor === "black" ? "Light" : "Dark"
                    }--${pColor})`}
                    notifBackColor={
                        backColor === "red"
                            ? "var(--themePLight--black)"
                            : "var(--expenseRed)"
                    }
                    badgeValue={totalNotifications}
                    userId={userId}
                    bizId={bizId}
                />
            </section>
        );

        return (
            <section className="animated slideInRight delay-3s">
                <div className="team-app__notif">{displayBack()}</div>
                {displayBell()}
            </section>
        );
    };

    const showMainAppTitle = () => (
        <section
            className="position-relative animated fadeIn my-5 container-center-col"
            style={{ left: !isCliAdmin ? "20px" : undefined }}
        >
            <div className="mb-3">
                <img
                    src={
                        thisBizLogo === undefined
                            ? "/img/official-logo-name.png"
                            : thisBizLogo
                    }
                    width={width} // bizLogo === "undefined" && 200
                    height={height}
                    title="logo empresa"
                    alt="logo empresa"
                />
            </div>
            <h1
                className={`d-table main-font text-em-1-8 text-center font-weight-bold ${txtColor} text-pill`}
                style={{
                    background: `var(--themeP${
                        backColor === "black" ? "Light" : "Dark"
                    }--${pColor})`,
                    padding: "8px 20px",
                    lineHeight: "35px",
                }}
            >
                Painel de
                <br />
                Cadastros
            </h1>
        </section>
    );

    const showCTAs = () => (
        <section className="main-ctas position-relative animated fadeInUp my-5 container-center-col">
            <div>
                <h2 className={`m-0 text-center text-title ${txtColor}`}>
                    {firstName},{" "}
                    {getDayGreetingBr({ lowercase: true, lateHours: false })}!
                </h2>
                <h2
                    className={`text-center animated fadeIn delay-3s text-subtitle ${txtColor} font-weight-bold`}
                >
                    o que cadastrar?
                </h2>
            </div>
            <section className="animated fadeIn mt-4 container-center">
                <AddTempPointsBtn
                    backColor={needAdminDefaultTheme ? "default" : backColor}
                    sColor={needAdminDefaultTheme ? "default" : sColor}
                    needClick={!isPreviewMode}
                />
                <div className="ml-3">
                    <RegisterPanelBtn
                        title="CLIENTES"
                        needPlusIcon
                        backColor={
                            needAdminDefaultTheme ? "default" : backColor
                        }
                        sColor={needAdminDefaultTheme ? "default" : sColor}
                        needClick={!isPreviewMode}
                    />
                </div>
            </section>
            <section className="mt-4 container-center animated fadeIn delay-1s">
                <AddBenefitsBtn needClick={!isPreviewMode} />
            </section>
            <style jsx>
                {`
                    .main-ctas {
                        top: -30px;
                    }
                `}
            </style>
        </section>
    );

    const showAdminTestMsg = () => (
        <section style={{ left: 10, bottom: "0px", position: "fixed" }}>
            <div className="admin-design-mode d-flex justify-content-center">
                <div>
                    <p className={`m-0 text-small text-center ${txtColor}`}>
                        Admin, funcionalidades
                        <br />
                        desativas no modo design.
                        <br />
                        Somente para <strong>fins visuais</strong>.
                    </p>
                    <style jsx>
                        {`
                            .admin-design-mode {
                                border-radius: 30px;
                                padding: 7px;
                                border: ${needDark
                                    ? "1px solid #000;"
                                    : "1px solid #fff;"};
                            }
                        `}
                    </style>
                </div>
            </div>
        </section>
    );

    const showBackTestAdminBtn = () => (
        <BtnBackTestMode
            isActive={!!isPreviewMode}
            mode="Membro"
            btnBackColor={backColor}
        />
    );

    return (
        <Fragment>
            {isPreviewMode && showBackTestAdminBtn()}
            {(isPreviewMode || !isCliAdmin) && showNotifBell()}
            {showMainAppTitle()}
            {showCTAs()}
            {(isPreviewMode || !isCliAdmin) && (
                <section className="animated zoomIn delay-3s">
                    <TeamSpeedDialBtn
                        sColor={sColor}
                        disableClick={!!isPreviewMode}
                        history={history}
                    />
                </section>
            )}
            {isPreviewMode && showAdminTestMsg()}
            {!isPreviewMode && (
                <NotifPermissionBanner
                    title="Receba notificações para agilizar seu trabalho!"
                    subtitle="Saiba quando um cliente estiver apto a receber algum benefício"
                />
            )}
        </Fragment>
    );
}

/*
const showAdminBackBtn = () => (
    <section
        className="position-absolute"
        style={{ top: 15, left: 15 }}
    >
        <ReturnBtn
            toTab={toTab}
        />
    </section>
);
 */
