import { useState } from "react";
import getId from "utils/getId";
import showToast from "components/toasts";
import { pushElemToField } from "api/frequent";
import useData from "init";
import CoreOptionsForm from "./CoreOptionsForm";

export default function AddNewChallContent({ updateLocalList, closeModal }) {
    const [data, setData] = useState({
        targetPoints: "",
        targetMoney: 0,
        perc: 0,
    });
    const { targetPoints, targetMoney, perc } = data;
    // const allDataReady = Boolean(targetMoney && targetMoney && perc);

    const { userId } = useData();

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

        const field = {
            "clientAdminData.games.discountBack.challList": itemData,
        };

        await pushElemToField(userId, "cliente-admin", field);

        updateLocalList({
            updateOnlyLocalItem: itemData,
        });

        showToast("Novo tipo de desafio adicionado com sucesso!", {
            type: "success",
        });
        closeModal();

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
                callback={handleUpdateData}
                targetPoints={targetPoints}
                perc={perc}
                targetMoney={targetMoney}
                setData={setData}
                userId={userId}
            />
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
