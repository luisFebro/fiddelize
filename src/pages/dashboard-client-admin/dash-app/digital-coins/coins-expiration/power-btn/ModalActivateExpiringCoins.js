import { useState } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import SelectField from "components/fields/SelectField";
import showToast from "components/toasts";
import ButtonMulti from "components/buttons/material-ui/ButtonMulti";
import useData from "init";

export default function ModalActivateExpiringCoins(props) {
    const { fullOpen, setFullOpen } = props;

    return (
        <ModalFullContent
            contentComp={<MainContent {...props} />}
            fullOpen={fullOpen}
            needIndex={false}
            setFullOpen={() => setFullOpen(false)}
        />
    );
}

function MainContent({
    actionFunc,
    setFullOpen,
    // fullOpen,
}) {
    const { userId } = useData();
    const isCoreAdmin = userId === "5e8b0bfc8c616719b01abc9c";

    const [data, setData] = useState({
        pickedDaysCount: null,
        pickedExecution: "once",
    });

    const [actionBtnDisabled, setActionBtnDisabled] = useState(false);

    const showTitle = () => (
        <p className="mt-3 mx-3 text-subtitle text-purple text-center font-weight-bold">
            Ativação prazo de expiração moedas digitais
        </p>
    );

    const showDaysCountField = () => {
        const defaultVal = "Selecione prazo:";
        const defaultValues = [
            { val: 30, showVal: "30 dias (1 mês)" },
            { val: 60, showVal: "60 dias (2 meses)" },
            { val: 90, showVal: "90 dias (3 meses)" },
            { val: 120, showVal: "120 dias (4 meses)" },
            { val: 150, showVal: "150 dias (5 meses)" },
            { val: 180, showVal: "180 dias (6 meses)" },
        ];
        const valuesArray = isCoreAdmin
            ? [{ val: 2, showVal: "2 dias" }, ...defaultValues]
            : [...defaultValues];

        const handleSelectValue = (val) => {
            if (!val || val === defaultVal) return;

            const { val: originalVal } = valuesArray.find(
                (elem) => elem.val === val
            );
            setData((prev) => ({
                ...prev,
                pickedDaysCount: originalVal,
            }));
        };

        return (
            <SelectField
                title={defaultVal}
                valuesArray={valuesArray}
                handleValue={handleSelectValue}
            />
        );
    };

    const showActionBtns = () => (
        <div className="my-5 d-flex justify-content-center">
            <ButtonMulti
                title="VOLTAR"
                onClick={() => setFullOpen(false)}
                variant="link"
            />
            <ButtonMulti
                size="large"
                title="ATIVAR"
                disabled={!!actionBtnDisabled}
                onClick={() => {
                    if (!data.pickedDaysCount)
                        return showToast(
                            "Insira prazo máximo para clientes usarem as moedas",
                            { type: "error" }
                        );
                    actionFunc(data);
                    setActionBtnDisabled(true);
                    setFullOpen(false);

                    return null;
                }}
                backgroundColor="var(--themeSDark)"
            />
        </div>
    );

    return (
        <section className="text-purple mx-3">
            {showTitle()}
            <form className="mt-5">
                <div>
                    <p className="text-normal">
                        Qual <strong>prazo máximo</strong> que cada cliente pode
                        usar as moedas digitais no seu negócio?
                    </p>
                    {showDaysCountField()}
                </div>
                <p className="mt-5 text-grey font-site text-em-1-1">
                    Para <strong>novos clientes</strong>, o prazo para uso das
                    moedas começa a contar a partir da data de cadastro. Para os{" "}
                    <strong>demais clientes</strong> já cadastrados, a partir da
                    data de ativação desta funcionalidade. Todos os clientes
                    recebem o mesmo prazo de uso.
                </p>
                <p className="text-grey font-site text-em-1-1">
                    Ao ativar, todos seus clientes ficam cientes do prazo toda
                    vez que acessarem o app e também recebem uma notificação.
                </p>
                {showActionBtns()}
            </form>
        </section>
    );
}

/* ARCHIVES

const showExecutionField = () => {
    const defaultVal = "apenas 1 vez";
    const valuesArray = [
        { val: "once", showVal: "apenas 1 vez" },
        { val: "always", showVal: "sempre repetir mesmo prazo" },
    ];

    const handleSelectValue = (val) => {
        if (!val || val === defaultVal) return;

        const { val: originalVal } = valuesArray.find((elem) => elem.val === val);
        setData(prev => ({
            ...prev,
            pickedExecution: originalVal,
        }));
    }

    return(
        <SelectField
            title={defaultVal}
            valuesArray={valuesArray}
            handleValue={handleSelectValue}
        />
    );
}

<div className="mt-5">
    <p className="text-normal">
        Quantas <strong>vezes</strong> executar expiração?
    </p>
    {showExecutionField()}
</div>

*/
