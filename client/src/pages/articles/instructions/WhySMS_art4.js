import React from 'react';
import {
    ShowTitle,
    ShowPicture,
    ShowArticleTitle,
    textStyle,
    useElemShowOnScroll, } from '../DefaultArticleComps';
/*
title; <h3 className="my-3 font-site text-purple">
 */

const Body = () => {
    const opts = {
        withObserver: true, loadImgs: true, imgWrapper: true };
    useElemShowOnScroll(".score-discount--picture", opts)

    return(
        <article
            style={{position: 'relative'}}
            className={textStyle}
        >
            <p>Clientes visualizam rápido sua mensagem SMS, flexibilidade de estratégias de marketing, melhoria no processo de compras, maior engajamento com clientes e divulgação da sua marca e produtos para toda sua rede de clientes são alguns dos motivos para você começar a investir.</p>

            <ShowPicture
                imgContainerClass="score-discount--picture"
                dataSrc="/img/articles/score-discount/pic-1.png"
                reference=""
                subtitle="notificação de conclusão de desafio"
            />

            <p>Fica super prático e você não precisa ficar se preocupando sobre quem já bateu ou não as suas metas dos desafios. Você ver todas suas notificações logo que acessa seu app via sininho.</p>

            <ShowPicture
                imgContainerClass="score-discount--picture"
                dataSrc="/img/articles/score-discount/pic-2.png"
                reference=""
                subtitle="página após clicar na notificação com botão de desconto"
            />

            <p>Você tem acesso direto à página de desconto do cliente com informações como número do desafio concluído, pontuação atual do cliente e se há pontos restantes para o próximo desafio.</p>

            <ShowPicture
                imgContainerClass="score-discount--picture"
                dataSrc="/img/articles/score-discount/pic-3.png"
                reference=""
                subtitle="página de desconto de pontos"
            />

            <p>Somente a pontuação do desafio que é descontado. Se um desafio é de 100 pontos, então é descontado esse <strong>mesmo valor</strong>. No histórico automático de compras fica registrado <strong>todas as pontuações do cliente</strong> desde a sua primeira compra.</p>
        </article>
    );
}


export default function Article() {
    return (
        <section>
            <ShowTitle title="Fiddelize Ensina" />
            <ShowArticleTitle title="Por que investir em SMS?" />
            <ShowPicture
                src="/img/articles/why-sms/main.jpg"
                timeout={2000}
                reference="pexels.com"
                main={true}
            />
            <Body />
        </section>
    );
}