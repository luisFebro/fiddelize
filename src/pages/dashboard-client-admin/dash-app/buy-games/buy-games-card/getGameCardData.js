import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoyaltyIcon from "@material-ui/icons/Loyalty";

export default function getGameCardData({
    isAdmin,
    gameName,
    isDisabled,
    bizName,
    discountPerc,
}) {
    if (gameName === "targetPrize") {
        return {
            nameBr: "Prêmio Alvo",
            concept: handleConcept("targetPrize", { isAdmin, bizName }),
            article: "TargetPrize",
            icon: (
                <FontAwesomeIcon
                    icon="gift"
                    style={{
                        height: "100%",
                        width: "100%",
                        color: isDisabled ? "#cad3c87d" : "#ff0",
                    }}
                />
            ),
        };
    }
    if (gameName === "discountBack") {
        return {
            nameBr: "Desconto Retornado",
            article: "DiscountBack",
            concept: handleConcept("discountBack", { isAdmin, discountPerc }),
            icon: (
                <LoyaltyIcon
                    style={{
                        height: "100%",
                        width: "100%",
                        color: isDisabled ? "#cad3c87d" : "#ff0",
                    }}
                />
            ),
        };
    }
    if (gameName === "raffleTicket") return {};

    return {};
}

// HELPERS
function handleConcept(type, options = {}) {
    const { isAdmin, bizName, discountPerc } = options;

    if (type === "targetPrize") {
        if (isAdmin)
            // admin not being used, replaced by article
            return "Seu negócio entrega um prêmio (produto, serviço, etc) para clientes que conseguirem atingir determinado quantia em PTS/pontos";
        return `Acumule pontos e troque por um prêmio da ${
            bizName && bizName.toUpperCase()
        } ao completar uma meta em pontos`;
    }

    if (type === "discountBack") {
        if (isAdmin)
            // admin not being used, replaced by article
            return "Seus clientes acumulam X porcento a cada compra definido pelo seu negócio. Após atingirem um valor mínimo que é o resgate em pontos, eles ganham um cupom de desconto como valor também feito pelo seu negócio. O jogo é seu!";
        return `Seu dinheiro é retornado em forma de ${discountPerc}% de desconto acumulado em cada compra. Seus pontos são convertidos em um cupom de desconto ao alcançar a meta de resgate em pontos.`;
    }

    return "";
}
// END HELPERS
