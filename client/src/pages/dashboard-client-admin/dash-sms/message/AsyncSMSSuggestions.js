import React, { Fragment } from 'react';
import CarouselCard from '../../../../components/carousels/CarouselCard';
import ButtonFab from '../../../../components/buttons/material-ui/ButtonFab';
import { useClientAdmin } from '../../../../hooks/useRoleData';

// todo: automation of scores with SMS optionally.
const data = ({ bizName }) => [
    {
        title: "Aniversário",
        msg: `Parabéns pelo seu aniversario! Você ganhou na ${bizName.toUpperCase()} 10% de desconto para comemorar esse dia especial.`,
    },
    {
        title: "Aviso Novo Horário",
        msg: `Avisamos aos nossos clientes que no Sábado funcionaremos das 8 até as 17 horas. De: ${bizName.toUpperCase()}`
    },
    {
        title: "Baixe App",
        msg: `Baixe o app da ${bizName.toUpperCase()} e ganhe prêmios nas suas compras. Acesse https://fiddelize.com.br/app/ycds123`,
    },
    {
        title: "Colaboradores",
        msg: `REUNIÃO ${bizName.toUpperCase()} - Aviso para toda equipe de vendas que teremos uma reunião amanhã às 15:00 na sala de apresentação.`,
    },
    {
        title: "Negócio não abre",
        msg: `${bizName.toUpperCase()} informa aos nossos clientes que Sábado não abriremos devido a (motivo). Agradecemos sua compreensão!`,
    },
    {
        title: "Promoção",
        msg: `Estamos com uma super promoção especial para você. (Descrição promoção)`,
    },
    {
        title: "Sentimos sua falta",
        msg: `Sentimos sua falta. A ${bizName.toUpperCase()} não esqueceu de você e está sempre de portas abertas.`,
    },
]

const CardList = ({ data, handleSuggestionMsg }) => {
    const handleCopy = msg => {
        handleSuggestionMsg(msg);
    }

    return(
        <Fragment>
            {data.map(card => {
                return (
                    <section
                        key={card.title}
                        className="carousel-cell no-outline"
                    >
                        <p className="my-3 text-grey text-subtitle text-center font-weight-bold">
                            {card.title}
                        </p>
                        <div
                            className="text-break my-2 text-light-grey text-light-grey text-left text-normal font-weight-bold"
                        >
                            {card.msg}
                        </div>
                        <section className="my-1 container-center">
                            <ButtonFab
                                size="medium"
                                title="Copiar"
                                onClick={() => handleCopy(card.msg)}
                                backgroundColor={"var(--themeSDark--default)"}
                                variant = 'extended'
                                position = 'relative'
                            />
                        </section>
                    </section>
                );
            })}
        </Fragment>
    );
}

export default function AsyncSMSSuggestions({ handleSuggestionMsg }) {
    const { bizName } = useClientAdmin();
    // const [selectedCard, setSelectedCard] = useState(null);
    const thisData = data({ bizName });
    const ThisCardList = <CardList data={thisData} handleSuggestionMsg={handleSuggestionMsg} />
    return (
        <Fragment>
            <p
                className="mt-5 text-center text-purple font-weight-bold text-subtitle"
            >Sugestões de SMS</p>
            <CarouselCard
                CardList={ThisCardList}
            />
        </Fragment>
    );
}