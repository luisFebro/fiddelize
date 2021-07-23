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
import convertToReal from "utils/numbers/convertToReal";
import getPercentage from "utils/numbers/getPercentage";
import useData from "init";

export default function DiscountBackOptions({ setComp }) {
    const [optionData, setOptionData] = useState({
        on: null,
        targetMoney: null,
        perc: null,
        targetPoints: 0,
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
        if (targetPoints && perc)
            setOptionData((prev) => ({
                ...prev,
                targetMoney: getPercentage(targetPoints, perc, {
                    mode: "value",
                }),
            }));
        else setOptionData((prev) => ({ ...prev, targetMoney: 0 }));
    }, [targetPoints, perc]);

    useEffect(() => {
        if (!data) return;

        const {
            on: thisOn,
            targetMoney: voucherVal,
            targetPoints: pts,
            perc: buyPerc,
        } = data.clientAdminData.games[GAME];
        setOptionData((prev) => ({
            ...prev,
            on: thisOn,
            targetMoney: voucherVal,
            targetPoints: pts,
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

    const handleUpdate = async () => {
        if (!targetMoney)
            return showToast("Insira valor do VALE DESCONTO", {
                type: "error",
            });
        if (!perc)
            return showToast("Insira PERCENTUAL de cada compra", {
                type: "error",
            });
        if (!targetPoints)
            return showToast("Insira o valor da META RESGATE", {
                type: "error",
            });

        const dataToSend = {
            [`clientAdminData.games.${GAME}.targetMoney`]: targetMoney,
            [`clientAdminData.games.${GAME}.perc`]: perc,
            [`clientAdminData.games.${GAME}.targetPoints`]: targetPoints,
        };

        await updateUser(userId, "cliente-admin", dataToSend);

        return showToast("Alterações salvas", { type: "success" });
    };

    const showGameOptions = () => (
        <form className="my-5 discount-back-form text-shadow">
            <h2 className="text-center text-subtitle font-weight-bold my-3">
                Ajustes Principais
            </h2>
            <p className="mb-1 d-inline-block line-height-25 text-left font-weight-bold">
                Meta de Resgate:
            </p>
            <span className="ml-3 d-inline-block">
                <InstructionBtn
                    text={`
                        META DE RESGATE é o "TAL VALOR" na famosa frase de marketing: "a cada TAL VALOR em compras, ganhe X% de desconto".
                        <br />
                        <br />
                        Ou seja, é a meta mínima que o cliente precisa alcançar para receber um desconto.
                        <br />
                        <br />
                        Você pode dizer tanto PTS/pontos ou reais; como preferir: 1 PTS vale o mesmo que R$ 1!
                    `}
                    mode="tooltip"
                    animated={false}
                />
            </span>
            <NumberField
                type="integer"
                name="targetPoints"
                textAlign="text-left"
                size="large"
                width={170}
                placeholder="R$ 0"
                value={targetPoints}
                onChangeCallback={setOptionData}
                zIndex={0}
            />
            <p className="mb-1 d-inline-block mt-4 line-height-25 text-left font-weight-bold">
                Percentual
                <br />
                acumulativo:
            </p>
            <span className="ml-3 d-inline-block">
                <InstructionBtn
                    text={`
                        PERCENTUAL ACUMULATIVO é o "TAL DESCONTO" na famosa frase de marketing: "a cada R$ X em compras, ganhe TAL DESCONTO"
                        <br />
                        <br />
                        Seus clientes acumulam a cada compra este valor percentual até atingirem a meta de resgate onde trocam por um vale desconto.
                        <br />
                        <br />
                        Valores percentuais frequentes estão entre 5% até 20%, ou você escolhe outro valor de acordo com sua estratégia comercial.
                    `}
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
                Vale Desconto fica:
            </p>
            <span className="ml-3 d-inline-block">
                <InstructionBtn
                    text={`
                        O VALE DESCONTO é o valor em reais final que o cliente recebe ao alcançar a meta de resgate em PTS.
                        <br />
                        <br />
                        Seu valor é gerado automaticamente e é o resultado percentual da meta de resgate acima.
                        <br />
                        <br />
                        Seu cliente recebe sempre o mesmo valor de vale desconto. Se as compras acumuladas excederem a meta de resgate, o restante fica para a próxima meta de resgate.
                        <br />
                        <br />
                        No app dos seus clientes, o valor de PTS acumulado é convertido automaticamente no valor acumulado do vale desconto para assim o cliente acompanhar seu progresso até alcançar 100% do valor.
                    `}
                    mode="tooltip"
                    animated={false}
                />
            </span>
            <p className="text-title d-table text-pill goal-value">
                {convertToReal(targetMoney, { moneySign: true })}
            </p>
            <div className="container-center mb-4 mt-5">
                <ButtonFab
                    position="relative"
                    onClick={handleUpdate}
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
            <p className="mt-2 text-grey font-italic font-weight-bold">
                &quot;A cada{" "}
                <span className="text-pill">R$ {targetPoints}</span> em compras,
                nossa clientela ganha <span className="text-pill">{perc}%</span>{" "}
                de desconto!&quot;
            </p>
            <p className="text-grey font-italic font-weight-bold">ou</p>
            <p className="text-grey font-italic font-weight-bold">
                &quot;A cada{" "}
                <span className="text-pill">{targetPoints} PTS</span> em
                compras, você ganha um vale desconto no valor de{" "}
                <span className="text-pill">R${targetMoney}</span>&quot;
            </p>
            <p className="text-grey font-italic font-weight-bold">ou</p>
            <p className="text-grey font-italic font-weight-bold">
                &quot;A cada compra, você ganha PTS - a moeda digital de pontos
                de compra para troca de benefícios - e acumula até{" "}
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
