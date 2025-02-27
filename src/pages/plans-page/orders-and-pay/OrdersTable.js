import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useBizData } from "init";
import { setRun, useAction } from "global-data/ui";
import ButtonMulti from "components/buttons/material-ui/ButtonMulti";
import useDelay from "hooks/useDelay";
import convertToReal from "utils/numbers/convertToReal";
import OrdersTableContent from "./OrdersTableContent";

const isSmall = window.Helper.isSmallScreen();

export default function OrdersTable({
    planBr,
    period,
    itemList,
    itemsCount,
    investAmount,
    handleCancel,
    setData,
}) {
    const loading = false;

    const uify = useAction();

    const { bizLinkName } = useBizData();

    const vanishMsgReady = useDelay(6000);

    return (
        <section>
            <p className="mt-3 mx-3 text-subtitle font-weight-bold text-purple">
                Plano {planBr} {period === "yearly" ? "anual" : "mensal"}
            </p>
            {isSmall && (
                <p
                    className={`${
                        vanishMsgReady ? "animated zoomOut" : ""
                    } align-items-center mb-2 mr-3 text-normal font-weight-bold text-purple text-center`}
                    style={{ display: vanishMsgReady ? "none" : "block" }}
                >
                    Deslize para mais{" "}
                    <FontAwesomeIcon
                        icon="arrow-right"
                        style={{ color: "var(--themeP)" }}
                    />
                </p>
            )}
            <OrdersTableContent
                deleteBtns
                planBr={planBr}
                period={period}
                listData={itemList}
                loading={loading}
                setData={setData}
            />
            <p className="m-0 mt-3 mr-3 d-flex justify-content-end text-normal text-purple">
                {itemsCount} serviço{itemsCount > 1 ? "s" : ""} por:{" "}
                <span className="d-inline-block ml-3 font-weight-bold">
                    R$ {convertToReal(investAmount)}
                </span>
            </p>
            <div className="text-right text-normal text-purple">
                salvo{" "}
                <FontAwesomeIcon
                    icon="check-circle"
                    className="animated rubberBand delay-3s"
                    style={{ color: "var(--themeP)", fontSize: "20px" }}
                />
                <Link
                    to={`/${bizLinkName}/cliente-admin/painel-de-controle`}
                    onClick={() => setRun("runName", "goDash", uify)}
                >
                    <ButtonMulti
                        title="cancelar pedido"
                        onClick={() => handleCancel("explicit")}
                        variant="link"
                        margin="0px"
                        color="var(--mainRed)"
                        underline
                        textTransform="lowercase"
                    />
                </Link>
            </div>
        </section>
    );
}
