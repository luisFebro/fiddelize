import { useState, useEffect } from "react";
import showToast from "components/toasts";
import { readUser, updateUser } from "api/frequent";
import useData from "init";
import NumberField from "components/fields/NumberField";
import RadiusBtn from "components/buttons/RadiusBtn";

export default function GeneralTweaksContent() {
    const [data, setData] = useState({
        benefitsExpDays: null,
    });
    const { benefitsExpDays } = data;

    const { userId } = useData();
    // userId === "5e8b0bfc8c616719b01abc9c";

    useEffect(() => {
        (async () => {
            const adminData = await readUser(
                userId,
                "cliente-admin",
                "clientAdminData.gameTweaks.benefitsExpDays"
            );
            const thisExpDays =
                adminData &&
                adminData.clientAdminData.gameTweaks &&
                adminData.clientAdminData.gameTweaks.benefitsExpDays;
            if (thisExpDays)
                setData((prev) => ({ ...prev, benefitsExpDays: thisExpDays }));
        })();
    }, [userId]);

    const handleBenefitsDeadline = async () => {
        const isDisabled = benefitsExpDays === 0;
        if (!isDisabled && benefitsExpDays < 10)
            // !isDev
            return showToast(
                "Prazo mínimo é partir de 10 dias. Digite zero para desativar",
                { type: "error", dur: "8000" }
            );
        if (benefitsExpDays > 180)
            return showToast("Prazo máximo é até 180 dias (6 meses).", {
                type: "error",
                dur: "8000",
            });

        const dataToSend = {
            [`clientAdminData.gameTweaks.benefitsExpDays`]: benefitsExpDays,
        };
        await updateUser(userId, "cliente-admin", dataToSend);

        if (isDisabled)
            return showToast(
                "Prazo de expiração de benefício desativado com sucesso.",
                { type: "success", dur: 8000 }
            );

        return showToast(
            `Salvo! Novo prazo de ${benefitsExpDays} DIAS será mostrado no app dos clientes assim que ganharem algum benefício.`,
            { type: "success", dur: 9000 }
        );
    };

    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Ajustes Gerais de Benefícios
            </p>
        </div>
    );

    return (
        <section className="mx-3 text-normal text-purple">
            {showTitle()}
            <p className="mt-5 text-center font-weight-bold">
                Prazo Resgate Benefícios:
            </p>
            <div className="d-flex">
                <NumberField
                    type="integer"
                    name="benefitsExpDays"
                    textAlign="text-center"
                    size="large"
                    width={100}
                    placeholder="0"
                    value={benefitsExpDays}
                    onChangeCallback={setData}
                />
                <p className="d-inline-block font-weight-bold">Dias</p>
            </div>
            <div className="mt-2" />
            <RadiusBtn
                position="relative"
                backgroundColor="var(--themeSDark)"
                title="salvar"
                size="medium"
                fontSize="15px"
                onClick={handleBenefitsDeadline}
            />
            <section className="my-5 text-grey font-site text-em-1">
                <p className="font-weight-bold text-normal text-purple">
                    Notas:
                </p>
                <p>
                    - Cada cliente, ao ganhar algum benefício, recebem o mesmo
                    prazo de expiração contando a partir da data que foi batido
                    a meta em moedas PTS.
                </p>
                <p>
                    - Diferente da expiração de moedas onde a desativação é
                    automática após efetuar a operação, este prazo para
                    benefícios continua em vigor e só é desativado por você.
                    Para desativar, basta atualizar para{" "}
                    <strong>0 (zero) dias</strong>.
                </p>
                <p>
                    - Alterações no prazo não afetam clientes com benefícios
                    pendentes. Somente passa a valer para os próximos clientes.
                </p>
            </section>
        </section>
    );
}

/*
<TextField
    placeholder="0"
    InputProps={{
        style: styles.fieldFormValueForPts,
    }}
    // eslint-disable-next-line
    inputProps={{ style: styles.input }}
    name="targetPoints"
    value={targetPoints}
    type="number"
    variant="outlined"
    onChange={(e) =>
        setData((prev) => ({
            ...prev,
            targetPoints: e.target.value,
        }))
    }
    error={false}
    autoComplete="off"
/>
 */
