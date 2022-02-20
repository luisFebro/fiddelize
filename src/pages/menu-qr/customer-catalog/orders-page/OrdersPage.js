import { useState, useEffect } from "react";
import useScrollUp from "hooks/scroll/useScrollUp";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import CommentField from "components/fields/CommentField";
import { setItems } from "init/lStorage";
import { Load } from "components/code-splitting/LoadableComp";
import useContext from "context";
import { getCustomerGameData } from "pages/menu-qr/customer-catalog/customer-area/customer-panel/CustomerPanelContent";
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
    const { currGame, bizLinkName, loginData } = useContext();
    const customerEmail = loginData && loginData.email;
    const [customerNote, setCustomerNote] = useState("");
    const [customerPoints, setCustomerPoints] = useState(0);

    const [data, setData] = useState({
        openExternalOrder: false,
    });
    const { openExternalOrder } = data;

    useEffect(() => {
        if (!socket || !currGame) return;
        getCustomerGameData({
            socket,
            adminId,
            email: customerEmail,
            currGame,
            callback: (data) => setCustomerPoints(data && data.currPoints),
        });
    }, [adminId, customerEmail]);

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
            customerNote,
            customerEmail,
            customerPoints,
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
                [bizLinkName]: {
                    orderCount: itemsCount,
                    orderAmount: investAmount,
                    orderList: itemList,
                },
            },
            digitalMenuCurrPage: "success",
        });
        setNextPage("success");
    };

    const showCustomerNote = () => (
        <div className="mt-5">
            <h2 className="text-normal mx-3 text-white">
                Alguma observação do pedido? (opcional)
            </h2>
            <CommentField
                setValue={setCustomerNote}
                value={customerNote}
                placeholder=""
                rows={2}
                maxLen={200}
                maxLenColor="white"
            />
        </div>
    );

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
            {showCustomerNote()}
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
