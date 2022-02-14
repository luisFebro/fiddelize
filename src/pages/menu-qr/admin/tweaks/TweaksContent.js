import ShowMainPanels from "pages/dashboard-client-admin/dash-app/main-panels/ShowMainPanels.js";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { Link } from "react-router-dom";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

const getStyles = () => ({
    muStyle: {
        transform: "scale(1.5)",
        color: "#fff",
        filter: "drop-shadow(.1px .1px .9px grey)",
    },
});

export default function TweaksContent() {
    const styles = getStyles();
    const PlusIcon = <AddCircleOutlineIcon style={styles.muStyle} />;

    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Ajustes
            </p>
        </div>
    );

    const showProBtn = () => (
        <div
            className="position-fixed animated fadeInUp"
            style={{ bottom: 15, right: 15 }}
        >
            <Link
                to="/planos?cliente-admin=1&store=1"
                className="no-text-decoration"
            >
                <ButtonFab
                    title="Atualize Plano"
                    backgroundColor="var(--niceUiYellow)"
                    onClick={null}
                    position="relative"
                    variant="extended"
                    size="large"
                    iconMu={PlusIcon}
                />
            </Link>
        </div>
    );

    return (
        <section>
            {showTitle()}
            <main className="mt-2">
                <ShowMainPanels isDigitalMenu />
                <style jsx>
                    {`
                        .hidden-content--root {
                            min-height: 500px;
                            color: var(--mainPurple);
                            width: 100%;
                            padding: 20px;
                            background-color: var(--mainWhite);
                        }

                        .card-main-heading--root {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }

                        .card-main-heading--root .icon {
                            margin-right: 20px;
                        }

                        .card-main-heading--root p {
                            margin: 0;
                        }

                        // BOTTOM-ACTION-BTNS--ROOT
                        .bottom-action-btns--root {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        }
                    `}
                </style>
            </main>
            {showProBtn()}
        </section>
    );
}
