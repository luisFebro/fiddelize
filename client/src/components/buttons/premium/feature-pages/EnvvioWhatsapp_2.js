import React from "react";
import { ShowTitle, ShowPicture, useElemShowOnScroll } from "./DefaultProComps";
import ButtonFab from "../../../../components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const checkIcon = {
    fontSize: "25px",
    marginRight: "10px",
    color: "var(--themeP)",
};

const S_NAME = "Envvio Whatsapp";
export default function ProFeature({ data }) {
    const { handleFullClose, isFromDash } = data;

    const opts = {
        withObserver: true,
        loadImgs: true,
        imgWrapper: true,
    };
    useElemShowOnScroll(".envvio-whatsapp--picture", opts);

    const showMainBenefit = () => (
        <section>
            <p className="mx-3 text-purple text-normal font-weight-bold">
                Agilize o processo de compra de seus clientes enviando o convite
                de cadastro via Whatsapp.
            </p>
        </section>
    );

    const showMainFeatures = () => (
        <section className="mt-5">
            <h2 className="text-subtitle text-center font-weight-bold text-purple">
                Principais Benefícios
            </h2>
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={checkIcon} />O Whatsapp é o
                mais popular meio de comunicação hoje em dia. O serviço {S_NAME}{" "}
                te oferece a modalidade de envio de convite de cadastro direto
                para o Whatsapp dos seus clientes.
            </p>
            <ShowPicture
                imgContainerClass="envvio-whatsapp--picture"
                dataSrc="/img/pro-features/envvio-whatsapp/pic-1.png"
                reference=""
                subtitle="disponível no painel de cadastro, é uma alternativa do SMS para envios rápidos de convites de cadastro"
            />
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={checkIcon} />A sua página
                convite de cadastro é <strong>totalmente personalizada</strong>{" "}
                com suas preferências como logo e combinações de cores. É onde
                seus clientes fazem primeiro contato e baixam o seu app de
                fidelidade.
                <br />
                <br />
                Assim como toda a plataforma da Fiddelize, esta página funciona
                em todos os formatos de dispositivos para seus clientes ter
                acesso de qualquer lugar.
                <br />
                <br />
                No primeiro acesso, o cliente faz o cadastro após baixar o app e
                você acompanha os novos cadastros no seu painel de controle em
                tempo real.
            </p>
            <ShowPicture
                imgContainerClass="envvio-whatsapp--picture"
                dataSrc="/img/pro-features/envvio-whatsapp/pic-2.png"
                reference=""
                subtitle="exemplo página convite de cadastro"
            />
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={checkIcon} /> No painel de
                controle, o convite de painel visa agilidade. Basta preencher
                com o primeiro nome do seu cliente e um contato para gerar
                automaticamente o link do convite. É aqui que entra o serviço{" "}
                {S_NAME} junto com o SMS. Você também tem a opção de envio via
                email.
            </p>
            <ShowPicture
                imgContainerClass="envvio-whatsapp--picture"
                dataSrc="/img/pro-features/envvio-whatsapp/pic-3.png"
                reference=""
                subtitle="por padrão, fica selecionado o modo de envio por número de contato, bastando apenas preencher nome e telefone do cliente."
            />
            <ShowPicture
                imgContainerClass="envvio-whatsapp--picture"
                dataSrc="/img/pro-features/envvio-whatsapp/pic-4.png"
                reference=""
                subtitle="exemplo de link de convite de cadastro gerado"
            />
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={checkIcon} /> Além do mais,
                o painel de cadastro te dá a opção de cadastro na hora, caso
                precise cadastrar o cliente antes de enviar o convite do seu
                app.
            </p>
            <ShowPicture
                imgContainerClass="envvio-whatsapp--picture"
                dataSrc="/img/pro-features/envvio-whatsapp/pic-4-b.png"
                reference=""
                subtitle="exemplo de link de convite de cadastro gerado"
            />
            <p className="text-normal text-purple">
                <FontAwesomeIcon icon="check" style={checkIcon} /> Pronto!
                Informando apenas o primeiro nome e um contato ou email, fica
                prático enviar seus convites. O {S_NAME} te ajuda a enviar
                rapidamente onde seus clientes estão conectados.
            </p>
        </section>
    );

    const showWhereFind = () => (
        <section className="mt-5">
            <h2 className="text-subtitle text-center font-weight-bold text-purple">
                Onde encontro o serviço no App?
            </h2>
            <ShowPicture
                imgContainerClass="envvio-whatsapp--picture"
                dataSrc="/img/pro-features/envvio-whatsapp/pic-final.png"
                reference=""
                subtitle="o botão no canto aparece enquanto estiver no histórico de compras"
            />
            <p className="text-normal text-purple">
                O {S_NAME} está disponível no{" "}
                <strong>Painel de Cadastros</strong> através do botão{" "}
                <strong>novo cadastro</strong> disponível na sessão{" "}
                <strong>clientes >> histórico de cadastro</strong> do seu painel
                de controle.
            </p>
        </section>
    );

    const callToAction = () => (
        <section>
            <p className="my-5 text-subtitle text-purple">
                Parabéns! Agora você conhece o serviço {S_NAME}.
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
            <ShowTitle title={S_NAME} />
            <ShowPicture
                src="/img/pro-features/fiddelize-throne.svg"
                srcIcon="/img/pro-features/envvio-whatsapp/envvio-whatsapp.svg"
                iconWidth={100}
                iconHeight={100}
                timeout={2000}
                reference=""
                main={true}
            />
            {showMainBenefit()}
            <section className="mx-3">
                {showMainFeatures()}
                {showWhereFind()}
                {callToAction()}
            </section>
        </section>
    );
}
