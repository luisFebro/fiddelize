import React, { useState, useEffect } from "react";
import MuSelectTable from "../../../components/tables/MuSelectTable";
import ButtonMulti from "../../../components/buttons/material-ui/ButtonMulti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDelay from "../../../hooks/useDelay";
import convertToReal from "../../../utils/numbers/convertToReal";
import { useStoreDispatch } from "easy-peasy";
import { setRun } from "../../../redux/actions/globalActions";
import { useClientAdmin } from "../../../hooks/useRoleData";
import { Link } from "react-router-dom";

const isSmall = window.Helper.isSmallScreen();

const headCells = [
    { id: "quantity", numeric: false, disablePadding: false, label: "Qtde." },
    { id: "service", numeric: false, disablePadding: false, label: "Serviço" },
    {
        id: "finalValue",
        numeric: false,
        disablePadding: false,
        label: "Valor final",
    },
];

export default function OrdersTable({
    plan,
    period,
    orders,
    orderTotal,
    setVar,
    handleCancel,
    handleServicesData,
    useGetVar,
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
        const newList = [];
        let thisTotalServ = 0;
        for (let serv in orders) {
            let { amount, price, totalPackage, isPreSale } = orders[serv];
            price = convertToReal(price, {
                moneySign: true,
                needFraction: true,
            });

            let packageQtt;
            if (totalPackage) {
                packageQtt = amount;
                amount = 1;
            }

            thisTotalServ += amount;

            const handleServiceName = () => {
                if (serv === "currPlan")
                    return `Plano ${plan ? plan : "profissional"} ${
                        period === "yearly" ? "anual" : "mensal"
                    } com ${amount} serviços`;

                if (serv === "sms")
                    return `${totalPackage} ${
                        totalPackage === 1 ? "pacote" : "pacotes"
                    } com ${convertToReal(packageQtt)} SMS`;

                if (serv === "customers")
                    return `Novvos Clientes - ${totalPackage} ${
                        totalPackage === 1 ? "pacote" : "pacotes"
                    } com ${convertToReal(packageQtt)} clientes`;

                return serv;
            };

            const getElem = (elem) => (
                <span
                    className="d-flex justify-content-center"
                    style={{ fontSize: 20 }}
                >
                    {elem}
                </span>
            );

            const serviceElem = (
                <span className="d-inline-block" style={{ width: 250 }}>
                    {handleServiceName()}
                    {isPreSale && (
                        <span className="d-inline-block ml-2 text-pill theme-back-blue">
                            pré-venda
                        </span>
                    )}
                </span>
            );

            const orderItem = {
                quantity: getElem(amount),
                service: serviceElem,
                finalValue: getElem(price),
            };
            newList.push(orderItem);
        }

        setList(newList);
        setTotalServs(thisTotalServ);
        setVar({ totalServices_clientAdmin: thisTotalServ });
        handleServicesData({
            servicesTotal: thisTotalServ,
            servicesAmount: rawOrderTotal,
        }); // it is here for cases when orderTotal loads as undefined when user jumps right to checkout page if h/s decides to come back later.
    }, [orders]);

    // useEffect(() => {
    // }, [orderTotal, loadMoney])

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
            <MuSelectTable
                headCells={headCells}
                rowsData={list}
                loading={loading}
                needMainTitle={false}
                needHighlightColor={false}
                marginBottom=" "
                enumeration=" "
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
