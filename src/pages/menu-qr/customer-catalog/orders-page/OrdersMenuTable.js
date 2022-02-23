import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDelay from "hooks/useDelay";
import convertToReal from "utils/numbers/convertToReal";
import OrdersTableContent from "./OrdersTableContent";

const isSmall = window.Helper.isSmallScreen();

export default function OrdersMenuTable({
    setData,
    itemList,
    itemsCount,
    investAmount,
    discountAmount,
    currGame,
    adminGame,
    needShowPromo,
}) {
    const loading = false;
    const vanishMsgReady = useDelay(6000);

    const handleTotalOrder = () => {
        if (needShowPromo) {
            if (currGame === "discountBack") {
                const targetMoney = adminGame && adminGame.targetMoney;
                return investAmount - targetMoney;
            }
        }

        return investAmount;
    };

    return (
        <section>
            {isSmall && (
                <p
                    className={`${
                        vanishMsgReady ? "animated zoomOut" : ""
                    } align-items-center mb-2 mr-3 text-normal font-weight-bold text-white text-center`}
                    style={{ display: vanishMsgReady ? "none" : "block" }}
                >
                    Deslize para mais{" "}
                    <FontAwesomeIcon
                        icon="arrow-right"
                        style={{ color: "var(--mainWhite)" }}
                    />
                </p>
            )}
            <OrdersTableContent
                deleteBtns
                listData={itemList}
                loading={loading}
                setData={setData}
            />
            {discountAmount && (
                <p className="m-0 mt-3 mr-3 d-flex justify-content-end text-normal text-white">
                    Desconto:{" "}
                    <span className="d-inline-block ml-3 font-weight-bold">
                        - R$ {convertToReal(discountAmount)}
                    </span>
                </p>
            )}
            <p className="m-0 mt-3 mr-3 d-flex justify-content-end text-normal text-white">
                {itemsCount} item{itemsCount > 1 ? "s" : ""} por:{" "}
                <span
                    className="d-inline-block ml-3 font-weight-bold text-pill"
                    style={{
                        backgroundColor: "green",
                    }}
                >
                    R$ {convertToReal(handleTotalOrder())}
                </span>
            </p>
        </section>
    );
}
