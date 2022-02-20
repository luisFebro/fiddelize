import { useEffect, useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { Load } from "components/code-splitting/LoadableComp";
import useBackColor from "hooks/useBackColor";
import { readUser } from "api/frequent";

const AsyncPendingOrdersList = Load({
    loader: () =>
        import(
            "./PendingOrdersList" /* webpackChunkName: "pending-orders-page-lazy" */
        ),
});

const AsyncDoneOrdersList = Load({
    loader: () =>
        import(
            "./DoneOrdersList" /* webpackChunkName: "done-orders-page-lazy" */
        ),
});

export default function Orders({ adminId, bizLinkName, socket }) {
    useBackColor("var(--mainWhite)");
    const [content, setContent] = useState("pendingOrders");
    const [onlineGames, setOnlineGames] = useState(null);
    const isPending = content === "pendingOrders";

    const disconnected = socket && socket.disconnected;
    useEffect(() => {
        if (disconnected) socket.connect();
        // eslint-disable-next-line
    }, [disconnected]);

    useEffect(() => {
        readUser(adminId, "cliente-admin", "clientAdminData.onlineGames").then(
            (dataAdmin) => {
                const thisOnlineGames =
                    dataAdmin && dataAdmin.clientAdminData.onlineGames;
                if (thisOnlineGames) setOnlineGames(thisOnlineGames);
            }
        );
    }, [adminId]);

    const themeSColor = "default";

    const bizLogo = "/img/test/restaurant.jpg";
    const width = 110;
    const height = 110;

    const showLogo = () => (
        <div className="mt-2 container-center">
            <img
                src={bizLogo}
                width={width}
                height={height}
                title={`logo da ${bizLinkName}`}
                alt={`logo empresa ${bizLinkName}`}
            />
        </div>
    );

    const showTitle = () => (
        <div className="text-center text-purple mx-3">
            {showLogo()}
            <h1 className="text-subtitle text-purple font-weight-bold">
                Pedidos {isPending ? "Pendentes" : "Realizados"}
            </h1>
        </div>
    );

    const showCTAs = () => (
        <section
            style={{
                position: "fixed",
                bottom: 14,
                left: 14,
            }}
        >
            <div className="container-center">
                <ButtonFab
                    size="medium"
                    title={isPending ? "VER FEITOS" : "VER PENDENTES"}
                    backgroundColor={`var(--themeSDark--${themeSColor})`}
                    onClick={() =>
                        setContent(isPending ? "doneOrders" : "pendingOrders")
                    }
                    position="relative"
                    variant="extended"
                />
            </div>
        </section>
    );

    return (
        <section>
            {showTitle()}
            {isPending ? (
                <AsyncPendingOrdersList
                    socket={socket}
                    onlineGames={onlineGames}
                />
            ) : (
                <AsyncDoneOrdersList />
            )}
            {showCTAs()}
        </section>
    );
}
