import React, { useState, useEffect } from "react";
import ButtonMulti from "../../../components/buttons/material-ui/ButtonMulti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDelay from "../../../hooks/useDelay";
import convertToReal from "../../../utils/numbers/convertToReal";
import { useStoreDispatch } from "easy-peasy";
import { setRun } from "../../../redux/actions/globalActions";
import { useClientAdmin } from "../../../hooks/useRoleData";
import { Link } from "react-router-dom";
import getOrderTableList from "./helpers/getOrderTableList";
import OrdersTableContent from "./OrdersTableContent";

const isSmall = window.Helper.isSmallScreen();

export default function OrdersTable({
    plan,
    period,
    orders,
    orderTotal,
    setVar,
    handleCancel,
    handleServicesData,
    useGetVar,
    notesColor,
}) {
    const [list, setList] = useState([]);
    const [totalServs, setTotalServs] = useState(0);
    const loading = false;

    const dispatch = useStoreDispatch();
    const { bizCodeName } = useClientAdmin();

    const { data: totalMoney, loading: loadMoney } = useGetVar(
        "totalMoney_clientAdmin"
    );
    orderTotal = !orderTotal ? totalMoney : orderTotal;
    const rawOrderTotal = orderTotal; // because it receives R$ and becames string in the first run

    if (!loadMoney) setVar({ totalMoney_clientAdmin: orderTotal });

    useEffect(() => {
        const { newList, thisTotalServ } = getOrderTableList(orders, {
            period,
            plan,
        });

        setList(newList);
        setTotalServs(thisTotalServ);
        setVar({ totalServices_clientAdmin: thisTotalServ });
        handleServicesData({
            servicesTotal: thisTotalServ,
            servicesAmount: rawOrderTotal,
        }); // it is here for cases when orderTotal loads as undefined when user jumps right to checkout page if h/s decides to come back later.
    }, [orders]);

    orderTotal = convertToReal(orderTotal, { moneySign: true });

    const vanishMsgReady = useDelay(6000);

    return (
        <section className="animated fadeInUp normal">
            <p className="mt-3 mx-3 text-subtitle font-weight-bold text-purple">
                Plano {plan} {period === "yearly" ? "anual" : "mensal"}
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
                listData={list}
                loading={loading}
                notesColor={notesColor}
            />
            <p className="mt-3 mr-3 d-flex justify-content-end text-normal text-purple">
                {totalServs} serviços por:{" "}
                <span className="d-inline-block ml-3 font-weight-bold">
                    {orderTotal}
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
                    to={`/${bizCodeName}/cliente-admin/painel-de-controle`}
                    onClick={() => setRun(dispatch, "goDash")}
                >
                    <ButtonMulti
                        title="cancelar pedido"
                        onClick={() => handleCancel("explicit")}
                        variant="link"
                        margin={"0px"}
                        color="var(--mainRed)"
                        underline={true}
                        textTransform="lowercase"
                    />
                </Link>
            </div>
        </section>
    );
}
