import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InstructionBtn from "components/buttons/InstructionBtn";
import NumberField from "components/fields/NumberField";
import convertToReal from "utils/numbers/convertToReal";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import getPercentage from "utils/numbers/getPercentage";
import showToast from "components/toasts";
import getId from "utils/getId";

export default function CoreOptionsForm({
    targetPoints, // required
    perc, // required
    targetMoney, // required
    setData, // required
    userId, // only cli-admin dashboard
    history, // only for platform to continue new club creation
    callback,
    isPlatform = false,
    isDigitalMenu = false,
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

        // eslint-disable-next-line
    }, [targetPoints, perc]);

    const handleUpdateFromSite = async () => {
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

        const data = {
            game: "discountBack",
            doneGamesPanel: true,
            clientAdminData: {
                games: {
                    discountBack: {
                        on: true,
                        challList: [
                            {
                                id: getId(),
                                targetPoints,
                                targetMoney,
                                perc,
                            },
                        ],
                    },
                },
            },
        };

        const { setVars } = await import("init/var");
        await setVars(data, "pre_register");
        history.push("/novo-clube/info-negocio");
        return null;
    };

    const handleTweaksCond = () => {
        if (isDigitalMenu) return false;
        return !isPlatform;
    };

    const handleCompsCond = (type) => {
        if (type === "onClick") {
            if (isPlatform) return handleUpdateFromSite;
            return callback;
        }

        if (type === "title") {
            if (isDigitalMenu) return "atualizar";
            return isPlatform ? "continuar" : "adicionar";
        }

        // icon
        if (isDigitalMenu) return "check";
        return isPlatform ? "arrow-right" : "plus";
    };

    return (
        <form className="text-normal my-5 discount-back-form text-shadow">
            {handleTweaksCond() && (
                <h2 className="text-center text-subtitle font-weight-bold my-3">
                    Ajustes Principais
                </h2>
            )}
            <p className="mb-1 d-inline-block line-height-25 text-left font-weight-bold">
                Meta em pontos:
            </p>
            <span className="ml-3 d-inline-block">
                <InstructionBtn
                    text={`
                        <p class="m-0 text-center">META EM PONTOS</p>
                        É a meta do desafio que o cliente precisa alcançar para poder resgatar o valor do vale desconto.
                        <br />
                        <br />
                        Por exemplo, na frase: acumule 100 PTS, ganhe 10% de desconto. 100 PTS é a sua meta em pontos.
                        <br />
                        <br />
                        1 PTS tem o mesmo valor que R$ 1 em compras. E o valor líquido que o cliente recebe é o valor do vale desconto.
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
                desconto:
            </p>
            <span className="ml-3 d-inline-block">
                <InstructionBtn
                    text={`
                        <p class="m-0 text-center">PERCENTUAL DE DESCONTO</p>
                        É a porcentagem sobre a meta em pontos que define o valor final do vale desconto quando o cliente finaliza a meta do desafio.
                        <br />
                        <br />
                        Por exemplo, na frase: acumule 100 PTS, ganhe 10% de desconto. Este 10% é o seu percentual de desconto.
                        <br />
                        <br />
                        O valor do vale desconto é calculado automaticamente. Neste exemplo, 10% de 100 PTS o cliente ganha um vale desconto de R$ 10 a cada 100 PTS acumulado em compras. Lembre-se que R$ 100 vale o mesmo que 100 PTS.
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
                        <p class="m-0 text-center">VALE DESCONTO</p>
                        É o valor em reais final que o cliente recebe ao alcançar a meta em pontos.
                        <br />
                        <br />
                        Seu valor é gerado automaticamente e é o resultado percentual da meta em pontos definido acima.
                        <br />
                        <br />
                        Se as compras acumuladas excederem a meta em pontos, o restante fica para o desafio seguinte.
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
                    onClick={handleCompsCond("onClick")}
                    title={handleCompsCond("title")}
                    iconFontAwesome={
                        <FontAwesomeIcon icon={handleCompsCond("icon")} />
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
