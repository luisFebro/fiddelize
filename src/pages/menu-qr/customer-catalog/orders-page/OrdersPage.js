import { useState } from "react";
import useScrollUp from "hooks/scroll/useScrollUp";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { setItems } from "init/lStorage";
import { Load } from "components/code-splitting/LoadableComp";
import { ReturnBtn } from "../OrdersCart";
import OrdersMenuTable from "./OrdersMenuTable";

export const AsyncExternalOrderForm = Load({
    loader: () =>
        import(
            "../external-order-form/ExternalOrderForm" /* webpackChunkName: "external-order-comp-lazy" */
        ),
});

export default function OrdersPage({
    setCatalogData,
    setNextPage,
    itemList,
    itemsCount,
    investAmount,
    adminId,
    placeId,
    customerId,
    socket,
    isOnline,
}) {
    useScrollUp();
    const [data, setData] = useState({
        openExternalOrder: false,
    });
    const { openExternalOrder } = data;

    const showTitle = () => (
        <div className="my-3">
            <p className="main-font text-em-1-9 text-white text-center font-weight-bold">
                Meu Pedido
                <br />
                <span className="d-block text-center font-weight-bold position-relative mx-3 text-normal">
                    Confira os itens adicionados.
                </span>
            </p>
        </div>
    );

    const runSuccessOrder = (dataOrder = {}) => {
        const { customerName, customerPhone, customerAddress } = dataOrder;

        const body = {
            customerId,
            customerName,
            customerPhone,
            customerAddress,
            placeId,
            adminId,
            order: {
                stage: "queue",
                totalCount: itemsCount,
                totalAmount: investAmount,
                orderList: itemList,
            },
        };

        if (socket) {
            socket.emit("updateCustomerOrder", body);
            socket.emit("updateAdminList");
            socket.emit("getAdminListCount", { adminId });
        }

        setItems("global", {
            digitalMenuData: {
                orderCount: itemsCount,
                orderAmount: investAmount,
                orderList: itemList,
            },
            digitalMenuCurrPage: "success",
        });
        setNextPage("success");
    };

    const showDoneOrderBtn = () => (
        <section className="container-center mt-3">
            <ButtonFab
                title="Confirmar e Pedir"
                backgroundColor="var(--themeSDark--default)"
                onClick={() => {
                    if (isOnline)
                        return setData((prev) => ({
                            ...prev,
                            openExternalOrder: true,
                        }));
                    return runSuccessOrder();
                }}
                position="relative"
                variant="extended"
                size="large"
            />
        </section>
    );

    return (
        <section>
            <ReturnBtn setNextPage={setNextPage} />
            {showTitle()}
            <OrdersMenuTable
                setData={setCatalogData}
                investAmount={investAmount}
                itemList={itemList}
                itemsCount={itemsCount}
                removeVar={() => null}
                setNextPage={setNextPage}
            />
            {showDoneOrderBtn()}
            {isOnline && openExternalOrder && (
                <AsyncExternalOrderForm
                    setMainData={setData}
                    runSuccessOrder={runSuccessOrder}
                />
            )}
            <div style={{ marginBottom: 150 }} />
        </section>
    );
}
