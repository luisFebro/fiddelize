import { useState, useEffect, Fragment } from "react";
import MuSelectTable from "components/tables/MuSelectTable";
import NotesSwitcher from "components/buttons/NotesSwitcher";
import getOrderTableList from "./helpers/getOrderTableList";

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

export default function OrdersTableContent({
    needGenerateList = false,
    listData,
    loading,
    orders,
    plan,
    period,
    notesColor,
    showNotes = true,
}) {
    const [list, setList] = useState([]);

    useEffect(() => {
        if (!needGenerateList) return setList(listData);

        const newList = getOrderTableList(orders, {
            period,
            plan,
        });
        setList(newList);
    }, [listData, needGenerateList]);

    const notes = (
        <Fragment>
            - Os pacotes de SMS não tem validade, não expiram.
            <br />
            <br />- Você dá acesso sem restrição aos seus clientes que{" "}
            <strong>já foram cadastrados</strong>. Eles continuam usando o app
            mesmo quando o prazo de seu plano terminar. Você precisa renovar seu
            plano para novos clintes.
            <br />
            <br />
            <br />- Os créditos disponíveis em cada serviço{" "}
            <strong>são acumulativos apenas durante o tempo de uso</strong>.
            Assim, quando um plano é renovado antes de expirar, você não perde
            os créditos não usados e ganha um novo tempo de uso.
            <br />
            <br /> - Porém, quando o tempo de uso termina ou expira, todos os
            créditos restantes <strong>são zerados automaticamente</strong> de
            forma permanente.
            <br />
            <br /> - Você é notificado <strong>5 dias</strong> antes de expirar
            algum plano ou serviço.
            <br />
            <br />- Você consegue renovar um plano mensal para anual ou
            vice-versa quantas vezes precisar.
            <br />
            <br />- Você pode fazer investimentos em{" "}
            <strong>diferentes planos</strong> tanto mensais ou anuais. Cada
            transação de plano possui seu próprio tempo de uso que você
            acompanha no seu histórico de investimentos.
        </Fragment>
    );

    return (
        <Fragment>
            <MuSelectTable
                headCells={headCells}
                rowsData={list}
                loading={loading}
                needMainTitle={false}
                needHighlightColor={false}
                marginBottom=" "
                enumeration=" "
            />
            {showNotes && (
                <NotesSwitcher
                    color={
                        notesColor === "white" ? "text-white" : "text-purple"
                    }
                    btnStyle={{ top: -35, right: -80 }}
                    btnSize="small"
                    notes={notes}
                    rootClassName={notesColor === "purple" ? "mx-3" : undefined}
                    shadowTitle={
                        notesColor === "white" ? "text-shadow" : undefined
                    }
                />
            )}
        </Fragment>
    );
}

/*

<br />
<br />- O seu maior plano investido é o que será identificado como
atual. Você pode investir no <strong>plano ouro</strong>, por
exemplo, e a qualquer momento investir no{" "}
<strong>plano bronze</strong> que ainda continuará no plano ouro. Se
o seu plano for bronze e atualizar para planos maiores, daí sim você
muda de plano atual.

 */
