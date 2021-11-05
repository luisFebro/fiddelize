import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { ShowTitle, ShowPicture, useElemShowOnScroll } from "./DefaultProComps";
import ButtonFab from "../../material-ui/ButtonFab";

const checkIcon = {
    fontSize: "25px",
    marginRight: "10px",
    color: "var(--themeP)",
};

const S_NAME = "Prêmmios Clientes";
export default function ProFeature({ data }) {
    const { handleFullClose, isFromDash } = data;

    const opts = {
        withObserver: true,
        loadImgs: true,
        imgWrapper: true,
    };
    useElemShowOnScroll(".premmios-clientes--picture", opts);

    const showIllustration = () => (
        <ShowPicture
            src="/img/pro-features/fiddelize-throne.svg"
            srcIcon="/img/pro-features/premmios-clientes/premmios-clientes.svg"
            iconWidth={100}
            iconHeight={100}
            timeout={2000}
            reference=""
            main
        />
    );

    const showMainBenefit = () => (
        <section>
            <p className="mx-3 text-purple text-normal font-weight-bold">
                Mantenha seus clientes ainda mais engajados oferecendo mais
                opções de desafios, prêmios e metas.
            </p>
        </section>
    );

    const showMainFeatures = () => (
        <section className="mt-5">
            <h2 className="text-subtitle text-center font-weight-bold text-purple">
                Principais Benefícios
            </h2>
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={checkIcon} />
                Na versão gratis, você pode adicionar até 3 desafios diferentes.{" "}
                O serviço {S_NAME} te entrega{" "}
                <strong>mais opções de prêmios e desafios</strong>.
                <br />
                <br />
                Você pode escolher diferentes ícones para cada desafio assim
                como a descrição do seu prêmio junto com sua meta em pontos, ou
                o ponto-prêmio. Adicione quantos desafios personalizados
                precisar com o {S_NAME}!
            </p>
            <ShowPicture
                imgContainerClass="premmios-clientes--picture"
                dataSrc="/img/pro-features/premmios-clientes/pic-1.png"
                reference=""
                subtitle="modo progressivo - múltiplas opções prêmios"
            />
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={checkIcon} /> O serviço{" "}
                {S_NAME} da Fiddelize gerencia de forma individual e
                personalizada o app de cada um de seus clientes e mostra os seus
                desafios de acordo o nível atual deles, seguindo a ordem da sua
                lista de prêmios.
            </p>
            <ShowPicture
                imgContainerClass="premmios-clientes--picture"
                dataSrc="/img/pro-features/premmios-clientes/pic-2.png"
                reference=""
                subtitle="edição de um desafio"
            />
            <ShowPicture
                imgContainerClass="premmios-clientes--picture"
                dataSrc="/img/pro-features/premmios-clientes/pic-3.png"
                reference=""
                subtitle="editor de ícones de nível"
            />
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={checkIcon} /> Além do mais,
                a Fiddelize complementa o serviço com a assistente que te avisa
                das novidades, inclusive quando seu cliente bate sua meta em
                pontos. Não precisa se preocupar em procurar na lista de
                clientes. Basta acompanhar suas notificações para ver os
                resultados acontencendo em tempo real!
            </p>
        </section>
    );

    const showWhereFind = () => (
        <section className="mt-5">
            <h2 className="text-subtitle text-center font-weight-bold text-purple">
                Onde encontro o serviço no App?
            </h2>
            <p className="text-normal text-purple">
                O serviço {S_NAME} está na sessão{" "}
                <strong>App >> Desafios e Prêmios</strong> do seu painel de
                controle.
            </p>
            <ShowPicture
                imgContainerClass="premmios-clientes--picture"
                dataSrc="/img/pro-features/premmios-clientes/pic-4.png"
                reference=""
                subtitle="sessão app"
            />
        </section>
    );

    const callToAction = () => (
        <section>
            <p className="my-5 text-subtitle text-purple">
                Conheça mais sobre {S_NAME} como os dois modos de desafios:
                constante e progressivo, e sobre recurso de revelar prêmios e
                metas indo na sessão app.
            </p>
            <section className="my-5 container-center">
                {isFromDash ? (
                    <Link
                        className="no-text-decoration"
                        to="/planos?cliente-admin=1"
                    >
                        <ButtonFab
                            title="Ver Planos"
                            iconMarginLeft=" "
                            backgroundColor="var(--themeSDark--default)"
                            onClick={handleFullClose}
                            position="relative"
                            variant="extended"
                            size="large"
                        />
                    </Link>
                ) : (
                    <ButtonFab
                        title="Voltar"
                        iconMarginLeft=" "
                        backgroundColor="var(--themeSDark--default)"
                        onClick={handleFullClose}
                        position="relative"
                        variant="extended"
                        size="large"
                    />
                )}
            </section>
        </section>
    );

    return (
        <section>
            <ShowTitle title="Prêmmios Clientes" />
            {showIllustration()}
            {showMainBenefit()}
            <section className="mx-3">
                {showMainFeatures()}
                {showWhereFind()}
                {callToAction()}
            </section>
        </section>
    );
}
