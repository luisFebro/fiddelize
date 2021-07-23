import { useState, useEffect } from "react";
import BackButton from "components/buttons/BackButton";
import { gameIconsStore } from "components/biz/GamesBadge";
import { useReadUser, updateUser } from "api/frequent";
import showToast from "components/toasts";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn.js";
import NumberField from "components/fields/NumberField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import InstructionBtn from "components/buttons/InstructionBtn";
import useData from "init";

export default function DiscountBackOptions({ setComp }) {
    const [optionData, setOptionData] = useState({
        on: null,
        targetPoints: null,
        targetMoney: null,
        perc: null,
    });
    const GAME = "discountBack";

    const { on, targetPoints, targetMoney, perc } = optionData;
    const needShowResult = Boolean(targetMoney && targetMoney && perc);

    const { userId } = useData();

    const { data, loading } = useReadUser(
        userId,
        "cliente-admin",
        `clientAdminData.games.${GAME}`,
        {
            trigger: userId,
        }
    );

    useEffect(() => {
        if (!data) return;

        const {
            on: thisOn,
            targetMoney: voucherVal,
            targetPoints: tPts,
            perc: buyPerc,
        } = data.clientAdminData.games[GAME];
        setOptionData((prev) => ({
            ...prev,
            on: thisOn,
            targetMoney: voucherVal,
            targetPoints: tPts,
            perc: buyPerc,
        }));
    }, [data]);

    const showBackBtn = () => (
        <div className="d-flex justify-content-start">
            <BackButton title="Voltar" onClick={() => setComp(null)} />
        </div>
    );

    const showGameTitle = () => (
        <section className="my-3 container-center">
            {gameIconsStore[GAME]}
            <h1
                className="discount-back-title ml-1 text-pill font-site text-subtitle font-weight-bold text-center"
                style={{
                    backgroundColor: on ? "var(--themeP)" : "grey",
                }}
            >
                Desconto
                <br />
                Retornado
                <style jsx>
                    {`
                        .discount-back-title {
                            line-height: 25px;
                            padding: 5px 20px;
                        }
                    `}
                </style>
            </h1>
        </section>
    );

    const showPowerSwitch = () => {
        const handleActivation = async (res) => {
            const isTruthy = res && res.includes("true");

            const dataToSend = {
                [`clientAdminData.games.${GAME}.on`]: isTruthy,
            };

            await updateUser(userId, "cliente-admin", dataToSend);
            setOptionData((prev) => ({ ...prev, on: isTruthy }));
            const selectedMsg = `Jogo DESCONTO RETORNADO está agora ${
                isTruthy ? "ATIVADO" : "DESATIVADO"
            } para todos seus clientes`;

            showToast(selectedMsg, {
                type: isTruthy ? "success" : "warning",
                dur: 9000,
            });
        };

        return (
            <section>
                <p className="text-center font-weight-bold">Jogo Ativado?</p>
                <SwitchBtn
                    titleLeft="Não"
                    titleRight="Sim"
                    defaultStatus={on}
                    loading={loading}
                    callback={handleActivation}
                />
            </section>
        );
    };

    const showGameOptions = () => (
        <form className="my-5 discount-back-form text-shadow">
            <h2 className="text-center text-subtitle font-weight-bold my-3">
                Ajustes Principais
            </h2>
            <p className="mb-1 d-inline-block line-height-25 text-left font-weight-bold">
                Valor em R$
                <br />
                do Vale Desconto:
            </p>
            <span className="ml-3 d-inline-block">
                <InstructionBtn
                    text={`
                        O VALE DESCONTO é o valor final que o cliente recebe e é sempre fixo.
                        <br />
                        <br />
                        Para receber esse vale, o cliente precisa alcançar a meta de resgate em pontos.
                    `}
                    mode="tooltip"
                    animated={false}
                />
            </span>
            <NumberField
                type="integer"
                name="targetMoney"
                textAlign="text-left"
                size="large"
                width={170}
                placeholder="R$ 0"
                value={targetMoney}
                onChangeCallback={setOptionData}
                zIndex={0}
            />
            <p className="mb-1 d-inline-block mt-4 line-height-25 text-left font-weight-bold">
                Percentual
                <br />
                por compra:
            </p>
            <span className="ml-3 d-inline-block">
                <InstructionBtn
                    text="PERCENTUAL POR COMPRA é o valor percentual que seus clientes acumulam a cada compra. Valores frequentes estão entre 5% até 20%, ou você escolhe de acordo com sua estratégia comercial."
                    mode="tooltip"
                    animated={false}
                />
            </span>
            <div className="d-flex">
                <NumberField
                    type="integer"
                    name="perc"
                    value={perc}
                    textAlign="text-left"
                    size="large"
                    width={100}
                    placeholder="0"
                    onChangeCallback={setOptionData}
                    zIndex={0}
                />
                <p className="d-inline-block text-subtitle font-weight-bold">
                    %
                </p>
            </div>
            <p className="m-0 mt-4 d-inline-block text-left font-weight-bold">
                Meta de Resgate:
            </p>
            <span className="ml-3 d-inline-block">
                <InstructionBtn
                    text={`
                        META DE RESGATE é o valor total mínimo em pontos/PTS que o cliente precisa acumular para receber um cupom de desconto. 1 PTS vale R$ 1.
                        <br />
                        <br />
                        A meta de resgate é calculada automaticamente e a fórmula é simples:
                        <br />
                        <br />
                        V = valor vale desconto
                        <br />
                        P = percetual por compra
                        <br />
                        <br />
                        V x P = meta de resgate
                    `}
                    mode="tooltip"
                    animated={false}
                />
            </span>
            <p className="text-title d-table text-pill goal-value">
                {targetPoints} PTS
            </p>
            <div className="container-center mb-4 mt-5">
                <ButtonFab
                    position="relative"
                    onClick={() => null}
                    title="salvar alterações"
                    iconFontAwesome={<FontAwesomeIcon icon="save" />}
                    variant="extended"
                    width="90%"
                    size="large"
                    color="white"
                    backgroundColor="var(--themeSDark--default)"
                />
            </div>
            <style jsx>
                {`
                    .discount-back-form {
                        color: #fff;
                        padding: 10px;
                        background-color: var(--themeP);
                        border-radius: 20px;
                    }

                    .discount-back-form .goal-value {
                        background-color: var(--themePDark);
                    }
                `}
            </style>
        </form>
    );

    const showGeneratedAd = () => (
        <section className="animated fadeInUp my-5 font-site text-em-0-8">
            <h2 className="text-center text-subtitle font-weight-bold">
                Resultado
            </h2>
            <h2 className="text-normal font-weight-bold">
                Exemplos práticos de divulgação para clientes:
            </h2>
            <p className="text-grey font-italic font-weight-bold">
                &quot;A cada{" "}
                <span className="text-pill">R$ {targetPoints}</span> em compras,
                você ganha um vale desconto no valor de{" "}
                <span className="text-pill">R${targetMoney}</span>&quot;
            </p>
            <p className="text-grey font-italic font-weight-bold">ou</p>
            <p className="text-grey font-italic font-weight-bold">
                &quot;A cada compra, você ganha PTS - a moeda digital de pontos
                de compra para troca de benefícios - e acumula{" "}
                <span className="text-pill">{perc}%</span> de desconto no nosso
                clube de compras&quot;
            </p>
        </section>
    );

    return (
        <section
            className={`hidden-content--root text-normal ${
                on ? "text-purple" : "text-grey"
            }`}
        >
            {showBackBtn()}
            {showGameTitle()}
            {showPowerSwitch()}
            {showGameOptions()}
            {needShowResult && showGeneratedAd()}
        </section>
    );
}
