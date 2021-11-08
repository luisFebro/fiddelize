// for silver and gold plans
import { Fragment } from "react";
import InstructionBtn from "components/buttons/InstructionBtn";
import convertToReal from "utils/numbers/convertToReal.js";
import getPercentage from "utils/numbers/getPercentage.js";
import { getMinPrice } from "utils/biz/pricing";

export default function ContentAndAdvantages({ isYearly, plan }) {
    return (
        <Fragment>
            <PlanContent isYearly={isYearly} plan={plan} />
            <PlanAdvantages isYearly={isYearly} plan={plan} />
        </Fragment>
    );
}

const newCustomersText = `
    Seus clientes no próximo nível do marketing de relacionamento
    com destaques como <strong>moeda digital</strong> para troca de benecífios, <strong>cartão digital e jogos de compra</strong>.
    Vão ter mais motivos para voltar a comprar do seu negócio.
    Invista em seus clientes!
`;

const newMembersText = `
    Membros da sua equipe te ajudam a cadastrar moedas e
    clientes, ver históricos e avaliações, confirmar
    benefícios, recebimentos e mais!
`;

function PlanContent({ isYearly, plan }) {
    return (
        <Fragment>
            <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                <span className="text-pill">
                    Serviços Principais
                    <br />
                </span>
                {isYearly ? "Anual" : "Mensal"}
            </p>
            <div className="mx-3 mb-5 animated fadeInUp text-center text-purple text-normal">
                <p className="text-left">
                    - <strong>Novvos Clientes &#174;</strong>
                    <br />
                    Quantidade Créditos:
                    <br />
                    <strong className="d-inline-block">
                        {plan === "gold" ? (
                            <span className="text-pill">Sem Limites</span>
                        ) : (
                            <span className="text-pill">
                                +{convertToReal(isYearly ? 24000 : 2000)}
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
                    <br />- <strong>Connecta Membros &#174;</strong>
                    <br />
                    Membros conectados:
                    <br />
                    <strong className="d-inline-block">
                        {plan === "gold" ? (
                            <span className="text-pill">Sem Limites</span>
                        ) : (
                            <span className="text-pill">
                                até {convertToReal(10)}
                            </span>
                        )}
                    </strong>
                    <div className="ml-3 d-inline-block position-absolute">
                        <InstructionBtn text={newMembersText} mode="tooltip" />
                    </div>
                </p>
            </div>
        </Fragment>
    );
}

function PlanAdvantages({ isYearly, plan }) {
    const planPrice = getMinPrice(isYearly ? "yearly" : "monthly")[plan];
    const incAmount = getPercentage(planPrice, 20, { mode: "value" });
    const priceWithoutDiscount = convertToReal(planPrice + incAmount);

    // IMPORTANT: monthly gold plans do not haveextra free month (beyond maintenance month) because if a client pays a whole monthly plan in a year, the next will be free. That's why only yearly is more managable

    return (
        <Fragment>
            <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                <span className="text-pill">Vantagens do Plano</span>
            </p>
            <div className="mx-3 mb-5 text-center text-purple text-normal">
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
