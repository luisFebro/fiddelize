export default function getRegulationText({
    expiringCoinsOn,
    benefitsExpDays,
    coinsExpDays,
    registerBonusCoins,
    gameList = [],
    isFromApp,
}) {
    const availableGamesCount = gameList.length;
    const pluralGames = availableGamesCount > 1 ? "s" : "";
    const isPluralGames = pluralGames === "s";

    return `##nome-cliente, no clube de compras da ##nome-empresa, você ganha benefício toda vez que bate uma meta nos jogos usando seu saldo acumulado em moedas digitais PTS (pontos) nas suas compras.

        ${
            registerBonusCoins
                ? `Você ganha *${registerBonusCoins} PTS extras* ao se cadastrar no clube de compras.`
                : ""
        }

        @JOGOS DE COMPRA@
        *${availableGamesCount} jogo${pluralGames} disponíve${
        isPluralGames ? "is" : "l"
    }* atualmente:

        ${gameList.map(
            (game) => `<span class="text-pill">💎 *${game.nameBr}*</span>

            ${game.benefitDesc}.
            <hr class="mt-3 mb-4 lazer-purple" />`
        )}
        ${
            isPluralGames
                ? `
            *Nota:* Para alternar entre os jogos, basta clicar em *abrir jogos disponíveis* na aba *jogo* do seu app.
            <img class="my-5 img-center shadow-elevation" src="/img/demos/buy-club-rules/change-game-btn.png" alt="alternar jogos">
        `
                : ""
        }
        @REGRAS GERAIS@
        1) As moedas digitais PTS tem o *mesmo valor* que o real. R$ 1 em compras vale sempre 1 PTS. Você ganha um *cartão de compra personalizado* toda vez que receber moedas PTS. Você precisa *aplicar as moedas* do cartão para atualizar seu saldo e progresso nos jogos.

        2) Para adicionar moeda PTS, basta informar seu *nome cadastrado* ou apresentar seu código QR do cliente exclusivo em suas compras na ##nome-empresa.

        3) Você recebe um *comprovante digital* junto com o código QR do benefício toda vez que vencer a meta de um jogo de compra. É *obrigatório apresentar o comprovante na ##nome-empresa* para validar e resgatar seu benefício.

        4) Caso ganhe *múltiplos benefícios*, você só pode resgatar *um benefício por vez* - a cada nova compra - enquanto tiver saldo suficiente.

        5) Você usa seu saldo em moedas PTS como troca de benefícios. Seu *saldo é descontado* no mesmo valor da meta de um jogo cada vez que receber um benefício.

        6) Fique atento aos *prazos de expiração*. Tanto as moedas ou benefícios podem ter prazos limites de uso ou resgate no caso de benefício.

        Os *prazos atuais de expiração* são os seguintes:

        - Para seu saldo PTS:
        ${
            expiringCoinsOn
                ? `expira em *${coinsExpDays} dias* ${
                      isFromApp
                          ? "contando a partir da data de seu cadastro."
                          : "contando a partir da data de ativação. Você acompanha quantos dias faltam para expirar no seu app."
                  }`
                : "*não expira.*"
        }

        - Validade dos benefícios:
        ${
            benefitsExpDays
                ? `expira em *${benefitsExpDays} dias* contando a partir da data que a meta foi alcançada.`
                : "*não expira*"
        }
        ${
            !expiringCoinsOn && benefitsExpDays
                ? `*Importante:* Caso seu benefício expire, seu *saldo em PTS também é expirado* para reiniciar as edições dos jogos corretamente.

            Você entende que não é possível recuperar benefícios ou saldo após terem expirados e precisa acumular novamente.`
                : ""
        }
        ${
            !benefitsExpDays && expiringCoinsOn
                ? `*Importante:* Você entende que não é possível recuperar seu saldo após ter expirado e precisa acumular novamente.`
                : ""
        }

        @AVALIE SUAS COMPRAS@
        Você pode *avaliar e comentar sua experiência de compra* dando sua nota ou relato de compra. Você pode fazer isso ao adicionar moedas ou atualizar a qualquer momento no seu app na aba: *avalie*.

        @ATUALIZAÇÕES@
        Ao participar do clube de compras, você está de acordo que as regras e termos podem ser alterados a qualquer momento pela ##nome-empresa com ou sem aviso prévio. E que precisa checar este documento ou notificações para acompanhar eventuais mudanças.

        Alguns dos principais aspectos que podem ser atualizados incluem:

        a) Alteração na *disponibilidade dos jogos* de compras - podendo ser ativados ou desativados;

        b) Atualização de *valores das metas* - podendo aumentar ou diminuir, *mudança de benefícios* como valor do vale desconto ou troca do prêmio divulgado;

        c) Prazos de expiração tanto para o seu saldo como benefícios podem ser alterados.

        Quando ativado, o *prazo mínimo* para resgatar benefícios é a partir de 10 dias, contando da data que a meta do jogo foi alcançada.

        Já o *prazo mínimo de expiração do seu saldo* é a partir de 1 mês, contando da data do seu cadastro - caso já tenha expiração ativa - ou da data que a ativação foi iniciada.

        Uma vez a expiração de moedas é feita, a funcionalidade é *desativada automaticamente* e seu saldo fica sem prazo para expirar até que um novo prazo posterior seja ativado.

        *Você fica ciente e concorda com este documento e que tais regras e termos estão valendo ao usar os serviços do clube de compra.*

        ~Faça sua compra incrível!~

        ~##nome-empresa~`;
}

/* ARCHIVES
The images can have completely different data from the biz and conflict.
<img class="my-5 img-center shadow-elevation" src="/img/illustrations/app-demo-download-page.png" alt="teste1">

@META NO DESAFIO ATUAL@
Você já deve ter visto uma bandeirinha no app indicando sua meta.
Por exemplo, no seu *desafio atual de n.º ##desafio-atual*, você precisa alcançar:

• ##ponto-premio.

• O desafio possui 5 níveis com ##ponto-nivel cada.

@SEGURANÇA DE DADOS@
Adotamos as melhores práticas de segurança para manter os dados e pontos dos nossos clientes seguros como por meios de serviços de cópias de segurança a fim de manter nosso app protegido e íntegro.

Vale notar que quando você concluir um desafio, sua pontuação atual será zerada para receber o novo desafio seguinte. Porém, seu histórico de pontos permanece intacto e você tem detalhes de seus pontos desde sua primeira compra.

Você pode verificar quanto falta exatamente para o próximo nível acessando seu histórico de compras clicando no botão de mais > histórico de compras.
 */

// console.log(JSON.stringify(regulationText))
