import React, { Fragment } from "react";
import { useClientAdmin } from "../../../hooks/useRoleData";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Load } from "../../../components/code-splitting/LoadableComp";
import "./_TeamApp.scss";

export const AsyncBellNotifBtn = Load({
    loading: false,
    loader: () =>
        import(
            "../../../components/notification/BellNotifBtn" /* webpackChunkName: "bell-notif-team-lazy" */
        ),
});

const muStyle = {
    transform: "scale(1.5)",
    color: "#fff",
    filter: "drop-shadow(.1px .1px .9px grey)",
};

const PlusIcon = <AddCircleOutlineIcon style={muStyle} />;

export default function TeamApp() {
    const {
        selfBizLogoImg: bizLogo,
        selfThemeBackColor: backColor,
    } = useClientAdmin();

    const showNotifBell = () => {
        const displayBack = () => (
            <section
                className="back"
                style={{ background: "var(--themePDark--default)" }}
            ></section>
        );

        const totalNotifications = 3;
        const displayBell = () => (
            <AsyncBellNotifBtn
                position="absolute"
                top={-20}
                right={25}
                notifBorderColor={"var(--themeBackground--" + backColor + ")"}
                notifBackColor={
                    backColor === "red"
                        ? "var(--themePLight--black)"
                        : "var(--expenseRed)"
                }
                badgeValue={totalNotifications}
            />
        );

        return (
            <section className="animated slideInRight delay-4s">
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
                className="d-table main-font text-em-1-8 text-center font-weight-bold text-white text-pill"
                style={{
                    background: "var(--themePDark--default)",
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
        <section className="animated fadeInUp delay-1s my-5 container-center">
            <div className="text-center">
                <p className="m-0 text-left text-title text-white">Luis,</p>
                <h2 className="text-subtitle text-white font-weight-bold">
                    o que cadastrar?
                </h2>
            </div>
            <section className="animated fadeIn delay-2s mt-4 container-center">
                <ButtonFab
                    title="PONTOS"
                    backgroundColor="var(--themeSDark--default)"
                    onClick={null}
                    iconMu={PlusIcon}
                    position="relative"
                    variant="extended"
                    size="large"
                />
                <div className="ml-3">
                    <ButtonFab
                        title="CLIENTES"
                        backgroundColor="var(--themeSDark--default)"
                        onClick={null}
                        iconMu={PlusIcon}
                        position="relative"
                        variant="extended"
                        size="large"
                    />
                </div>
            </section>
        </section>
    );

    return (
        <Fragment>
            {showNotifBell()}
            {showMainAppTitle()}
            {showCTAs()}
        </Fragment>
    );
}
