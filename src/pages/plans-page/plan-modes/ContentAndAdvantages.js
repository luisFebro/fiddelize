import { Fragment } from "react";
import InstructionBtn from "components/buttons/InstructionBtn";
import convertToReal from "utils/numbers/convertToReal.js";
import getPercentage from "utils/numbers/getPercentage.js";
import { proVersion } from "./sessions/services/proVersion";

const newCustomersText = `
    Seus clientes no próximo nível do marketing de relacionamento
    com destaques como <strong>moeda digital</strong> para troca de benecífios, <strong>cartão digital e jogos de compra</strong>.
    Vão ter mais motivos para voltar a comprar do seu negócio.
    Invista em seus clientes!
    <br />
    <br />
    No plano prata e no período anual, os créditos são renovados todo mês no mesmo dia que seu investimento foi aprovado.
`;

const newMembersText = `
    Membros da sua equipe te ajudam a cadastrar moedas e
    clientes, ver históricos e avaliações, confirmar
    benefícios, recebimentos e mais!
    <br />
    <br />
    No plano prata e no período anual, a quantidade de créditos é única e assim não é renovada mensalmente.
`;

export function PlanContent({ isYearly, plan }) {
    return (
        <Fragment>
            <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                <span className="text-pill">
                    Conteúdo do Plano
                    <br />
                </span>
                {isYearly ? "Anual" : "Mensal"}
            </p>
            <div className="mx-3 mb-5 animated fadeInUp text-center text-purple text-normal font-weight-bold">
                <p className="text-left">
                    - <strong>Novvos Clientes &#174;</strong>
                    <br />
                    Quantidade Créditos:
                    <br />
                    <strong className="d-inline-block">
                        {plan === "gold" ? (
                            "Ilimitado"
                        ) : (
                            <span className="text-pill">
                                +{convertToReal(2000)}
                            </span>
                        )}
                    </strong>
                    <div className="ml-3 d-inline-block position-absolute">
                        <InstructionBtn
                            text={newCustomersText}
                            mode="tooltip"
                        />
                    </div>
                    <br />
                    <br />- <strong>Novvos Membros &#174;</strong>
                    <br />
                    Quantidade Créditos:
                    <br />
                    <strong className="d-inline-block">
                        {plan === "gold" ? (
                            "Ilimitado"
                        ) : (
                            <span className="text-pill">
                                +{convertToReal(10)}
                            </span>
                        )}
                    </strong>
                    <div className="ml-3 d-inline-block position-absolute">
                        <InstructionBtn text={newMembersText} mode="tooltip" />
                    </div>
                    <br />
                    <br />-{" "}
                    <strong>Todos os serviços integrados Fiddelize</strong>
                </p>
            </div>
        </Fragment>
    );
}

export function PlanAdvantages({ isYearly, plan }) {
    const planData = proVersion().find((pro) => pro[plan].plan === plan);
    const planPrice = planData[plan].price[isYearly ? "yearly" : "monthly"];
    const incAmount = getPercentage(planPrice, 20, { mode: "value" });
    const priceWithoutDiscount = convertToReal(planPrice + incAmount);

    return (
        <Fragment>
            <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                <span className="text-pill">Vantagens do Plano</span>
            </p>
            <div className="mx-3 mb-5 text-center text-purple text-normal font-weight-bold">
                {isYearly && (
                    <Fragment>
                        <p className="text-left">
                            - você economiza{" "}
                            <span className="text-pill">20%</span>
                            <br />
                            no plano anual
                        </p>
                        <p>
                            de{" "}
                            <span style={{ textDecoration: "line-through" }}>
                                R$ {priceWithoutDiscount}
                            </span>
                            <br />
                            por R$ {convertToReal(planPrice)}
                        </p>
                    </Fragment>
                )}
                <p className="text-left">
                    - você ganha{" "}
                    <span className="text-pill">
                        +{isYearly ? 2 : 1} {isYearly ? "meses" : "mês"}
                    </span>
                    {isYearly
                        ? " extras: 1 mês para continuar aproveitando seu plano e mais 1 mês de manutenção"
                        : " de manutenção do plano após expiração. Ou seja, seu negócio ainda pode usar todos os serviços e seus clientes continuam se beneficiando do seu clube por mais 1 mês."}
                </p>
            </div>
        </Fragment>
    );
}
