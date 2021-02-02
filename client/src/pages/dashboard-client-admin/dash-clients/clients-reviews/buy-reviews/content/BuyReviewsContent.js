import React, { Fragment } from "react";
import NotesSwitcher from "../../../../../../components/buttons/NotesSwitcher";
import BuyReviewList from "../buy-review-list/BuyReviewList.js";

const notes = (
    <Fragment>
        - Cada cliente pode escrever <strong>apenas um relato</strong> com até
        280 characteres.
        <br />
        <br />- O relato <strong>pode ser atualizado</strong> pelo cliente pela
        opção <strong>Sua avaliação</strong> no app ou feita após o registro de
        pontos do cartão virtual.
        <br />
        <br />- <strong>A nota final do cliente</strong> é a média entre a
        pontuação dos promotores e a nota XP.
        <br />
        <br />- O filtro por <strong>notas menores</strong> são aquelas entre 1
        a 6 (incluso). Consequentemente, <strong>notas maiores</strong> são as
        maiores de 6 pontos.
    </Fragment>
);

export default function BuyReviewsContent({ lastDateChecked }) {
    const showTitle = () => (
        <div className="my-4">
            <h1
                className="text-subtitle text-purple text-center font-weight-bold"
                style={{ lineHeight: "30px" }}
            >
                Relatos de
                <br />
                Compra
            </h1>
            <p
                className="m-0 mx-3 text-small text-purple text-center font-weight-bold"
                style={{
                    fontSize: "1.1rem",
                }}
            >
                Saiba o que seus clientes relatam sobre suas experiências de
                compra mais recentes
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
            <BuyReviewList lastDateChecked={lastDateChecked} />
            <NotesSwitcher
                color="text-purple"
                btnStyle={{ top: 0, right: 0 }}
                notes={notes}
                rootClassName="mx-3 mb-5"
                shadowTitle={undefined}
            />
        </section>
    );
}
