import usePayMethods from "../../../helpers/usePayMethods";

export default function ShowAvailableCards({ modalData }) {
    const { itemAmount } = modalData;

    const { payMethod: cardsAvailable, error } = usePayMethods(
        "CREDIT_CARD",
        itemAmount
    );

    return (
        <section
            className="mt-5"
            style={{
                marginBottom: "150px",
            }}
        >
            {!cardsAvailable ? (
                <p className="text-normal text-purple font-weight-bold">
                    Verificando disponíveis...
                </p>
            ) : (
                <p className="text-normal text-purple font-weight-bold">
                    {cardsAvailable ? cardsAvailable.length : 0} cartões
                    disponíveis:
                </p>
            )}
            <section className="container-center">
                {cardsAvailable &&
                    cardsAvailable.map((card) => (
                        <section key={card.name}>
                            <img
                                width={68}
                                height={30}
                                src={card.image}
                                alt={card.name}
                            />
                        </section>
                    ))}
            </section>
        </section>
    );
}
