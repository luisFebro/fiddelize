import useScrollUp from "hooks/scroll/useScrollUp";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { setItems } from "init/lStorage";
import showToast from "components/toasts";
import { ReturnBtn } from "../OrdersCart";
import OrdersMenuTable from "./OrdersMenuTable";

// import useBackColor from "hooks/useBackColor";
// import { useState } from "react";

export default function OrdersPage({
    setData,
    setNextPage,
    itemList,
    itemsCount,
    investAmount,
    adminId,
    placeId,
    customerId,
    socket,
}) {
    useScrollUp();

    const showTitle = () => (
        <div className="my-3">
            <p className="main-font text-em-1-9 text-white text-center font-weight-bold">
                Meu Pedido
                <br />
                <span className="d-block text-center font-weight-bold position-relative mx-3 text-normal">
                    Confira os items adicionados.
                </span>
            </p>
        </div>
    );

    const showDoneOrderBtn = () => (
        <section className="container-center mt-3">
            <ButtonFab
                title="Confirmar e Pedir"
                backgroundColor="var(--themeSDark--default)"
                onClick={async () => {
                    const body = {
                        adminId,
                        placeId,
                        customerId,
                        order: {
                            stage: "queue",
                            totalCount: itemsCount,
                            totalAmount: investAmount,
                            orderList: itemList,
                        },
                    };

                    showToast("Enviando pedido...", { dur: 2000 });

                    if (socket) {
                        socket.emit("updateCustomerOrder", {
                            adminId,
                            placeId,
                            customerId,
                            body,
                        });
                        socket.emit("updateAdminList");
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
                setData={setData}
                investAmount={investAmount}
                itemList={itemList}
                itemsCount={itemsCount}
                removeVar={() => null}
                setNextPage={setNextPage}
            />
            {showDoneOrderBtn()}
            <div style={{ marginBottom: 150 }} />
        </section>
    );
}
