import {
    ShowTitle,
    ShowPicture,
    ShowArticleTitle,
    textStyle,
    useElemShowOnScroll,
} from "../DefaultArticleComps";
/*
title; <h3 className="my-3 font-site text-purple">
 */

const Body = () => {
    const opts = {
        withObserver: true,
        loadImgs: true,
        imgWrapper: true,
    };
    useElemShowOnScroll(".why-sms--picture", opts);

    return (
        <article style={{ position: "relative" }} className={textStyle}>
            <p>
                Visualização rápida com alta taxa de abertura, comunicação
                instantânea, flexibilidade de estratégias de marketing, melhoria
                no processo de compras, mensagens personalizadas, divulgação da
                sua marca incluindo lançamentos, eventos, redes sociais e
                produtos para toda sua rede de clientes são alguns dos motivos
                para você começar a investir.
            </p>

            <ShowPicture
                imgContainerClass="why-sms--picture"
                dataSrc="/img/articles/why-sms/pic-1.jpg"
                reference=""
                subtitle="cyborgs em todos os lugares..."
            />

            <p>
                Com a crescente e iminente tecnologia, já somos praticamente
                "cyborgs" onde o celular já se tornou uma extensão do corpo
                humano. Praticamente todo mundo tem um considerável tempo de uso
                com seus <em>smartphones</em>. E é aí que entra o SMS como{" "}
                <strong>forma de comunicação efetiva</strong> para suas
                campanhas e o alcance simultâneo de sua mensagem.
            </p>

            <ShowPicture
                imgContainerClass="why-sms--picture"
                dataSrc="/img/articles/why-sms/pic-2.jpg"
                reference=""
                subtitle=""
            />

            <h3 className="my-3 font-site text-purple">Tipos de SMS</h3>

            <p>
                Conheça quais são os 4 tipos de SMS mais usados hoje que trazem
                um alto ROI (taxa de conversão) para diferentes formatos de
                negócio.
            </p>

            <p>
                <strong>1. SMS promocional</strong> - divulga novos produtos,
                serviços, promoções e ofertas.
            </p>

            <p>
                <strong>2. SMS transacional</strong> - Informa sobre alguma
                transição no processo de compra do cliente. Exemplos incluem
                Alerta de entrega de produtos, confirmação de pagamentos, envio
                de produtos, chegada de estoque.
            </p>

            <p>
                <strong>3. SMS sazonal</strong> - divulgação de ofertas em datas
                como Natal, Páscoa, Ano Novo para ofertas exclusivas nestes
                eventos com aumento de venda do mercado em geral.
            </p>

            <p>
                <strong>4. SMS para tráfego</strong> - objetiva levar seu
                cliente para seu site, rede social, blog ou loja virtual.
            </p>

            <ShowPicture
                imgContainerClass="why-sms--picture"
                dataSrc="/img/articles/why-sms/pic-3-a.png"
                reference=""
                subtitle="prepare seu lançamento de envios em 1, 2, 3..."
            />

            <h3 className="my-3 font-site text-purple">
                Conheça os motivos para investir SMS na Fiddelize
            </h3>

            <p>
                Acreditamos em usar a tecnologia moderna para para trazer
                resultados reais para empreendedores através de uma experiência
                rica dentro de um design minimalista e intuitivo para que seus
                objetivos de envio de SMS sejam alcançados da forma mais simples
                e rápida possível.
            </p>

            <p>
                <strong>As 3 etapas de envio, incluindo uma automática.</strong>
            </p>

            <p>
                São apenas 3 etapas para envio para qualquer quantidade ou
                categoria de contatos. São elas:
            </p>

            <p>
                1. Para quem enviar?
                <br />
                2. Escreva sua Mensagem.
                <br />
                3. Histórico de SMS
            </p>

            <p>
                E o melhor é que a última etapa a FIddelize gera em tempo real e
                de forma automática seu histórico SMS. Não precisa nem
                recarregar seu app para atualizar. Veja só - a seguir - como
                funciona cada etapa brevemente.
            </p>

            <p>
                <strong>1.º Etapa - Para quem enviar?</strong>
            </p>

            <ShowPicture
                imgContainerClass="why-sms--picture"
                dataSrc="/img/articles/why-sms/pic-4.png"
                reference=""
                subtitle="modo lista de clientes"
            />

            <p>
                Aqui você pode enviar para todo a sua rede de contatos
                cadastrados (gerados em ordem alfabética) ou selecionar grupos
                de contatos. Por padrão, todos os contatos já ficam selecionados
                e prontos para o envio. Nosso algoritmo de envio permite{" "}
                <strong>
                    enviar com eficiência para qualquer quantidade de envios
                    simultâneos
                </strong>{" "}
                em diversos blocos menores em um técnica chamada de "piscina de
                pedidos".
            </p>

            <p>
                O provedor de SMS da Fiddelize possui{" "}
                <strong>certificação com a Anatel</strong>, podendo enviar em
                até 10 segundos - após o disparo de envio - a sua mensagem para
                todas as operadores que incluem Claro, Oi, Nextel, Vivo, Tim.
            </p>

            <ShowPicture
                imgContainerClass="why-sms--picture"
                dataSrc="/img/articles/why-sms/pic-5.png"
                reference=""
                subtitle="contatos selecionados"
            />

            <p>
                E se você precisar enviar para contatos que não estejam na lista
                como um colaborador ou um fornecedor ou até uma pessoa sem
                cadastro? Isso é o que resolve a parte de{" "}
                <strong>contatos selecionados</strong> onde você ainda pode
                procurar por <strong>clientes específicos</strong> da sua rede
                de clientes.
            </p>

            <p>
                Após seus contatos de destino estiverem selecionados, basta
                clicar em no botão de "colocar mensagem" para ir para etapa
                seguinte.
            </p>

            <p>
                <strong>2.º Etapa - Escolha da Mensagem</strong>
            </p>

            <ShowPicture
                imgContainerClass="why-sms--picture"
                dataSrc="/img/articles/why-sms/pic-6.png"
                reference=""
                subtitle="campo de mensagem"
            />

            <p>
                Aqui você usa sua criatividade e suas estratégias prediletas
                para enviar sua mensagem para todos os seus contatos
                selecionados. Ficou sem ideia do que enviar? Sem problema! Temos
                logo abaixo uma área para te dar{" "}
                <strong>
                    sugestões das mensagens mais usadas pelo mercado
                </strong>{" "}
                que você pode copiar e modificar como quiser.
            </p>

            <ShowPicture
                imgContainerClass="why-sms--picture"
                dataSrc="/img/articles/why-sms/pic-7.png"
                reference=""
                subtitle="Basta deslizar para os lados e escolher uma sugestão"
            />

            <p>
                <strong>3.º Etapa - Histórico de SMS</strong>
            </p>

            <p>
                Após o envio de SMS, você é direcionado automaticamente para a
                sessão do histórico com atualização em tempo real do seu último
                envio.
            </p>

            <ShowPicture
                imgContainerClass="why-sms--picture"
                dataSrc="/img/articles/why-sms/pic-8.png"
                reference=""
                subtitle="histórico de SMS"
            />

            <p>
                Cada <strong>card de envio</strong> possui informações para
                fácil identificação como data de envio e quantidade de SMS. Ao
                clicar no botão de mais, você tem acesso ao{" "}
                <strong>extrato de envio</strong> com lista com todos os
                contatos com status de recebimento e das operadores. Além, é
                claro, a mensagem que foi enviada junto com uma{" "}
                <strong>opção de reenvio</strong> para os mesmos contatos.
            </p>

            <p>
                E isso é tudo que você precisa para enviar suas mensagens de
                forma rápida e fácil.
            </p>

            <p>
                <strong>Outros motivos para investir na Fiddelize:</strong>
            </p>

            <p>
                <strong>✔ Créditos não expiram.</strong> Use quando e como
                quiser sem data de expiração.
            </p>

            <p>
                <strong>✔ Agendamentos de Envio.</strong> Escolha uma data e
                hora para envio de seus SMS. Você pode agendar que uma mensagem
                seja enviada em datas importantes ou comemorativas como
                lembretes de reuniões, eventos, Ano Novo, Natal e outras datas.
                Agende o envio para um ou vários contatos que receberão
                simultanemente sua mensagem.
            </p>

            <ShowPicture
                imgContainerClass="why-sms--picture"
                dataSrc="/img/articles/why-sms/pic-9-a.png"
                reference=""
                subtitle="agende o envio para quem e quando precisar"
            />

            <p>
                <strong>✔ Flexibilidade da plataforma.</strong> Você pode
                escolher de qual dispositivo enviar, visto que a plataforma da
                Fiddelize roda em diversos dispositivos modernos como
                smartphones, tabletes, notebooks e computadores. Tenha acesso
                rápido via <strong>https://fiddelize.com.br/app</strong>
            </p>
            <p>
                <strong>
                    ✔ Investimos em Performance e experiência personalizada
                </strong>
                . Todas as sessão do seu painel de controle são microsserviços
                que só são carregados quando você estiver usando. Além de que
                cada componente só é carregado quando visível na tela. Isso
                aumenta a{" "}
                <strong>
                    rapidez de acesso em qualquer velocidade de conexão com a
                    internet
                </strong>
                . Inclusive você pode acessar offline.
            </p>

            <ShowPicture
                imgContainerClass="why-sms--picture"
                dataSrc="/img/articles/why-sms/pic-9-b.png"
                reference=""
                subtitle="resultado de performance da Fiddelize via Pagespeed Insights"
            />

            <p>
                Esperamos que você tenha gostado da leitura. A Fiddelize está de
                portas abertas para melhorar sua comunicação com seus contatos e
                clientes.
            </p>
        </article>
    );
};

export default function Article() {
    return (
        <section>
            <ShowTitle title="Fiddelize Ensina" />
            <ShowArticleTitle title="Por que investir em SMS?" />
            <ShowPicture
                src="/img/articles/why-sms/main.jpg"
                timeout={2000}
                reference="pixabay.com"
                main
            />
            <Body />
        </section>
    );
}
