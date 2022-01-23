import { useEffect, useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { Load } from "components/code-splitting/LoadableComp";
import useBackColor from "hooks/useBackColor";
import ModalFullContent from "components/modals/ModalFullContent";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

const PlusIcon = (
    <AddCircleOutlineIcon
        style={{
            transform: "scale(1.5)",
            color: "#fff",
            filter: "drop-shadow(.1px .1px .9px grey)",
        }}
    />
);

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

const AsyncProductManager = Load({
    loader: () =>
        import(
            "../manager/ProductManager" /* webpackChunkName: "product-manager-page-lazy" */
        ),
});

export default function AdminMenuOrders({ bizLinkName, socket }) {
    useBackColor("var(--mainWhite)");
    const [fullOpen, setFullOpen] = useState(false);
    const [content, setContent] = useState("pendingOrders");
    const isPending = content === "pendingOrders";

    const disconnected = socket && socket.disconnected;
    useEffect(() => {
        if (disconnected) socket.connect();
        // eslint-disable-next-line
    }, [disconnected]);

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
                right: 14,
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
                <div className="ml-3">
                    <ButtonFab
                        size="large"
                        backgroundColor={`var(--themeSDark--${themeSColor})`}
                        onClick={() => setFullOpen(true)}
                        position="relative"
                        iconMu={PlusIcon}
                    />
                </div>
            </div>
        </section>
    );

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            {showTitle()}
            {isPending ? (
                <AsyncPendingOrdersList socket={socket} />
            ) : (
                <AsyncDoneOrdersList />
            )}
            {showCTAs()}
            {fullOpen && (
                <ModalFullContent
                    contentComp={<AsyncProductManager />}
                    fullOpen={fullOpen}
                    setFullOpen={handleFullClose}
                />
            )}
        </section>
    );
}
