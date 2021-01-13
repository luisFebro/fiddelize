import React, { Fragment } from "react";
import { useClientAdmin } from "../../../hooks/useRoleData";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import { Load } from "../../../components/code-splitting/LoadableComp";
import useData from "../../../hooks/useData";
import getDayGreetingBr from "../../../utils/getDayGreetingBr";
import TeamSpeedDialBtn from "./TeamSpeedDialBtn";
import "./_TeamApp.scss";
import RegisterPanelBtn from "../../dashboard-client-admin/dash-clients/clients-history/register-panel-btn/RegisterPanelBtn";
import AddNewScoreBtn from "./add-new-score-panel/AddNewScoreBtn";
import selectTxtStyle from "../../../utils/biz/selectTxtStyle";
import useBackColor from "../../../hooks/useBackColor";
import useAuth from "../../../hooks/useAuthUser";
import BtnBackTestMode from "../../mobile-app/content/test-mode-btn/BtnBackTestMode";
// import ReturnBtn from '../../../components/buttons/ReturnBtn';

export const AsyncBellNotifBtn = Load({
    loading: false,
    loader: () =>
        import(
            "../../../components/notification/BellNotifBtn" /* webpackChunkName: "bell-notif-team-lazy" */
        ),
});

const getStyles = (needDark) => ({
    rootProtectionMsg: {
        borderRadius: "30px",
        padding: "7px",
        border: needDark ? "1px solid #000" : "1px solid #fff",
    },
});

export default function TeamApp({
    history,
    location,
    isCliAdmin,
    toTab = "Cliente",
}) {
    const [firstName] = useData(["firstName"]);

    // redirect if not auth
    useAuth({ history, roles: "cliente-membro, cliente-admin" });

    const isPreviewMode = location && location.search.includes("modo-prev=1");

    const needAdminDefaultTheme = isCliAdmin && !isPreviewMode;

    const {
        selfBizLogoImg: bizLogo,
        selfThemeBackColor: backColor,
        selfThemeSColor: sColor,
        selfThemePColor: pColor,
    } = useClientAdmin();

    useBackColor(
        `var(--themeBackground--${
            needAdminDefaultTheme ? "default" : backColor
        })`
    );
    const txtColor = selectTxtStyle(backColor);

    const needDark = selectTxtStyle(backColor, { needDarkBool: true });
    const styles = getStyles(needDark);

    const showNotifBell = () => {
        const displayBack = () => (
            <section
                className="back"
                style={{
                    background: `var(--themeP${
                        backColor === "black" ? "Light" : "Dark"
                    }--${pColor})`,
                }}
            ></section>
        );

        const allMemberNotif = 0; // member notif.
        const totalNotifications = isPreviewMode ? 0 : allMemberNotif;
        const displayBell = () => (
            <AsyncBellNotifBtn
                needClick={isPreviewMode ? false : true}
                position="absolute"
                top={-20}
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
            />
        );

        return (
            <section className="animated slideInRight delay-3s">
                <div className="team-app__notif">{displayBack()}</div>
                {displayBell()}
            </section>
        );
    };

    const showMainAppTitle = () => (
        <section className="animated fadeIn my-5 container-center-col">
            <div className="mb-3">
                <img
                    src={
                        bizLogo === "undefined"
                            ? `/img/official-logo-name.png`
                            : bizLogo
                    }
                    className="img-fluid"
                    width={bizLogo === "undefined" && 200}
                    height={bizLogo === "undefined" && 200}
                    title={`logo empresa`}
                    alt={`logo empresa`}
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
        <section className="animated fadeInUp delay-1s my-5 container-center-col">
            <div>
                <h2 className={`m-0 text-center text-title ${txtColor}`}>
                    {firstName},{" "}
                    {getDayGreetingBr({ lowercase: true, lateHours: false })}!
                </h2>
                <h2
                    className={`text-center animated fadeIn delay-2s text-subtitle ${txtColor} font-weight-bold`}
                >
                    o que cadastrar?
                </h2>
            </div>
            <section className="animated fadeIn delay-2s mt-4 container-center">
                <AddNewScoreBtn
                    backColor={needAdminDefaultTheme ? "default" : backColor}
                    sColor={needAdminDefaultTheme ? "default" : sColor}
                    needClick={isPreviewMode ? false : true}
                />
                <div className="ml-3">
                    <RegisterPanelBtn
                        title="CLIENTE"
                        needPlusIcon={true}
                        backColor={
                            needAdminDefaultTheme ? "default" : backColor
                        }
                        sColor={needAdminDefaultTheme ? "default" : sColor}
                        needClick={isPreviewMode ? false : true}
                    />
                </div>
            </section>
        </section>
    );

    const showAdminTestMsg = () => (
        <section style={{ left: 10, bottom: "0px", position: "fixed" }}>
            <div className="d-flex justify-content-center">
                <div style={styles.rootProtectionMsg}>
                    <p
                        className={`m-0 text-small text-center ${selectTxtStyle(
                            backColor
                        )}`}
                    >
                        Admin, funcionalidades
                        <br />
                        desativas no modo teste.
                        <br />
                        Somente para <strong>fins visuais</strong>.
                    </p>
                </div>
            </div>
        </section>
    );

    const showBackTestAdminBtn = () => (
        <BtnBackTestMode
            isActive={isPreviewMode ? true : false}
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
                        disableClick={isPreviewMode ? true : false}
                        history={history}
                    />
                </section>
            )}
            {isPreviewMode && showAdminTestMsg()}
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
