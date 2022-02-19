import { useState, useEffect } from "react";
import getId from "utils/getId";
import showToast from "components/toasts";
import { readUser, updateUser, pushElemToField } from "api/frequent";
import useData from "init";
import CoreOptionsForm from "./CoreOptionsForm";

export default function AddNewChallContent({
    isDigitalMenu = false,
    updateLocalList = () => null,
    closeModal = () => null,
}) {
    const [data, setData] = useState({
        targetPoints: "",
        targetMoney: 0,
        perc: 0,
    });
    const { targetPoints, targetMoney, perc } = data;
    // const allDataReady = Boolean(targetMoney && targetMoney && perc);

    const { userId } = useData();
    useEffect(() => {
        if (!isDigitalMenu || !userId) return;
        readUser(
            userId,
            "cliente-admin",
            "clientAdminData.onlineGames.discountBack.challList"
        ).then((res) => {
            const dataOnlineGame =
                res && res.clientAdminData.onlineGames.discountBack.challList;
            if (dataOnlineGame && dataOnlineGame[0]) setData(dataOnlineGame[0]);
        });
    }, [isDigitalMenu, userId]);

    const handleUpdateData = async () => {
        if (!targetPoints)
            return showToast("Insira o valor da META EM PONTOS", {
                type: "error",
            });

        if (!perc)
            return showToast("Insira PERCENTUAL do desconto", {
                type: "error",
            });

        if (!targetMoney)
            return showToast("Insira valor do VALE DESCONTO", {
                type: "error",
            });

        const itemData = {
            id: getId(),
            targetPoints,
            targetMoney,
            perc,
        };

        // create onGames in the backend to split between default panel and digital menu values
        const field = {
            [`clientAdminData.${
                isDigitalMenu ? "onlineGames" : "games"
            }.discountBack.challList`]: itemData,
        };

        if (isDigitalMenu) {
            await updateUser(userId, "cliente-admin", field);
        } else {
            await pushElemToField(userId, "cliente-admin", field);
        }

        const defaultTxt = "Novo tipo de desafio adicionado com sucesso!";
        const msg = isDigitalMenu ? "atualizado com sucesso!" : defaultTxt;

        showToast(msg, {
            type: "success",
        });

        if (!isDigitalMenu) {
            updateLocalList({
                updateOnlyLocalItem: itemData,
            });
            closeModal();
        }

        return "ok";
    };

    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Novo Vale Desconto
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
            <CoreOptionsForm
                isDigitalMenu={isDigitalMenu}
                callback={handleUpdateData}
                targetPoints={targetPoints}
                perc={perc}
                targetMoney={targetMoney}
                setData={setData}
                userId={userId}
            />
            {isDigitalMenu && (
                <section className="mx-3 text-em-1">
                    <p>
                        No menu digital, seus clientes fazem pedidos e acumulam
                        pontos de forma automática, bastando você marcar o
                        pedido como feito na <strong>sessão de pedidos</strong>.
                    </p>
                    <p>
                        Quando baterem a sua meta em pontos, o desconto do vale
                        é feito direto no pedido na compra e você e o cliente
                        ficam informados em tempo real.
                    </p>
                </section>
            )}
            <div
                style={{
                    marginBottom: 150,
                }}
            />
        </section>
    );
}

/* ARCHIVES
Removed because now the system allow multiple types of challenges, so saying each purchase is no longer apropriate since the discount coupon may vay in goals

/{allDataReady && <ShowGeneratedAd targetPoints={targetPoints} targetMoney={targetMoney} perc={perc} />}
function ShowGeneratedAd({
    targetPoints,
    targetMoney,
    perc,
}) {
    return(
        <section className="text-purple mx-3 animated fadeInUp my-5 font-site text-em-1">
            <h2 className="text-center text-normal font-weight-bold">
                Exemplos práticos de divulgação para clientes
            </h2>
            <p className="mt-2 text-grey font-italic font-weight-bold">
                &quot;A cada{" "}
                <span className="text-pill">R$ {targetPoints}</span> em compras,
                ganhe <span className="text-pill">{perc}%</span>{" "}
                de desconto!&quot;
            </p>
            <p className="text-grey font-italic font-weight-bold">
                &quot;A cada{" "}
                <span className="text-pill">{targetPoints} PTS</span> em
                compras, você ganha um vale desconto no valor de{" "}
                <span className="text-pill">R${targetMoney}</span>&quot;
            </p>
            <p className="text-grey font-italic font-weight-bold">
                &quot;A cada compra, você acumula moedas digitais PTS e troca por vale desconto de
                <span className="text-pill">R$ {targetMoney}</span> em nosso clube de compras&quot;
            </p>
        </section>
    );
}

*/
