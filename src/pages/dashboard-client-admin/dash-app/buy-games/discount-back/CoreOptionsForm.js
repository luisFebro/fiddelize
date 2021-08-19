import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InstructionBtn from "components/buttons/InstructionBtn";
import NumberField from "components/fields/NumberField";
import convertToReal from "utils/numbers/convertToReal";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import getPercentage from "utils/numbers/getPercentage";
import showToast from "components/toasts";

export default function CoreOptionsForm({
    targetPoints, // required
    perc, // required
    targetMoney, // required
    setData, // required
    isPlatform = false,
    userId, // only cli-admin dashboard
    history, // only for platform to continue new club creation
}) {
    const GAME = "discountBack";

    useEffect(() => {
        const gotAllData = targetPoints && perc;
        if (gotAllData) {
            setData((prev) => ({
                ...prev,
                targetMoney: getPercentage(targetPoints, perc, {
                    mode: "value",
                }),
            }));
        } else setData((prev) => ({ ...prev, targetMoney: 0 }));
    }, [targetPoints, perc]);

    const handleUpdate = async () => {
        if (!targetPoints)
            return showToast("Insira o valor da META RESGATE", {
                type: "error",
            });
        if (!perc)
            return showToast("Insira PERCENTUAL de cada compra", {
                type: "error",
            });
        if (!targetMoney)
            return showToast("Insira valor do VALE DESCONTO", {
                type: "error",
            });

        const dataToSend = {
            [`clientAdminData.games.${GAME}.targetMoney`]: targetMoney,
            [`clientAdminData.games.${GAME}.perc`]: perc,
            [`clientAdminData.games.${GAME}.targetPoints`]: targetPoints,
        };

        if (isPlatform) {
            const data = {
                game: "discountBack",
                doneGamesPanel: true,
                clientAdminData: {
                    games: {
                        discountBack: {
                            on: true,
                            perc,
                            targetMoney,
                            targetPoints,
                        },
                    },
                },
            };
            const { setVars } = await import("init/var");
            await setVars(data, "pre_register");
            history.push("/novo-clube/info-negocio");
            return null;
        }

        const { updateUser } = await import(
            "api/frequent" /* webpackChunkName: "dynamic-import-update-user" */
        );
        await updateUser(userId, "cliente-admin", dataToSend);

        setData((prev) => ({ ...prev, updatedOnce: true }));
        return showToast("Alterações salvas", { type: "success" });
    };

    return (
        <form className="text-normal my-5 discount-back-form text-shadow">
            {!isPlatform && (
                <h2 className="text-center text-subtitle font-weight-bold my-3">
                    Ajustes Principais
                </h2>
            )}
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
            <div className="d-flex">
                <NumberField
                    type="integer"
                    name="targetPoints"
                    textAlign="text-left"
                    size="large"
                    width={170}
                    placeholder="0"
                    value={targetPoints}
                    onChangeCallback={setData}
                    zIndex={0}
                />
                <p className="d-inline-block text-subtitle font-weight-bold">
                    PTS
                </p>
            </div>
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
                    onChangeCallback={setData}
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
                    title={isPlatform ? "continuar" : "salvar alterações"}
                    iconFontAwesome={
                        <FontAwesomeIcon
                            icon={isPlatform ? "arrow-right" : "save"}
                        />
                    }
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
}
