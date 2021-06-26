import { useState, useEffect } from "react";
import SelectField from "components/fields/SelectField";
import CommentField from "components/fields/CommentField";

const defaultVal = "Selecione motivo:";
const valuesArray = [
    { val: "incorrectAmount", showVal: "Valor Incorreto de PTS " },
    { val: "duplicated", showVal: "Valor enviado mais de uma vez" },
    { val: "wrongCustomer", showVal: "Valor enviado para cliente errado" },
    { val: "reimbursement", showVal: "Reembolso" },
    { val: "custom", showVal: "Escrever Motivo" },
];

export default function PtsRemovalPanel({
    setNeedBackBtn,
    selected,
    setSelected,
}) {
    const [comment, setComment] = useState("");

    const didUserSelect = selected && selected !== defaultVal;

    useEffect(() => {
        if (didUserSelect) setNeedBackBtn(false);
        else setNeedBackBtn(true);

        // eslint-disable-next-line
    }, [didUserSelect]);

    useEffect(() => {
        if (!comment) return;
        setSelected((prev) => ({
            ...prev,
            comment,
        }));
        // eslint-disable-next-line
    }, [comment]);

    const isCommentField = selected === "Escrever Motivo";

    const showReasonSelectField = () => {
        const handleSelectValue = (val) => {
            if (!val || val === defaultVal) return;
            const { showVal } = valuesArray.find((elem) => elem.val === val);
            setSelected({
                selected: showVal,
                comment,
            });
        };

        return (
            <SelectField
                title={defaultVal}
                valuesArray={valuesArray}
                handleValue={handleSelectValue}
            />
        );
    };

    const showCommentField = () => (
        <div className="my-5 animated fadeInUp">
            <CommentField
                setValue={setComment}
                value={comment}
                placeholder="Escreva um motivo breve sobre a remoção de PTS para mostrar ao cliente"
                maxLen={200}
            />
        </div>
    );

    return (
        <section className="mx-3 text-small text-purple font-weight-bold">
            <p className="text-normal font-weight-bold">
                Motivo para mostrar no histórico de compras do cliente:
            </p>
            {showReasonSelectField()}
            {isCommentField && showCommentField()}
            {didUserSelect && (
                <p className="animated fadeIn mt-3 m-0 font-weight-bold text-center text-normal">
                    Confirmado?
                </p>
            )}
        </section>
    );
}

/*
&gt; O benefício adicionado é <strong>REMOVIDO</strong> do histórico
do cliente
<br />
<br />
&gt; O saldo do cliente e o número do desafio são restaurados para
os valores antes da aplicação do benefício.
 */
