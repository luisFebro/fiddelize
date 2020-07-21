import React from 'react';
import {
    ShowTitle,
    ShowPicture,
    ShowArticleTitle,
    textStyle,
    useElemShowOnScroll, } from '../DefaultArticleComps';

const Body = () => {
    const opts = {
        withObserver: true, loadImgs: true, imgWrapper: true };
    useElemShowOnScroll(".gift-visibility--picture", opts)

    return(
        <article style={{position: 'relative'}} className={textStyle} >
            <p>O app do seu cliente, por padrão, mantem oculto a descrição do prêmio e revela apenas quando o desafio atual estiver concluído.</p>

            <ShowPicture
                imgContainerClass="gift-visibility--picture"
                dataSrc="/img/articles/gift-visibility/pic-1.png"
                reference=""
                subtitle="presente oculto por padrão"
            />

            <p>Na caixa de presente dos seus clientes aparecerá uma interrogação, que quando clicado, um balão informando que o cliente precisa concluir o desafio para saber qual é o prêmio.</p>

            <ShowPicture
                imgContainerClass="gift-visibility--picture"
                dataSrc="/img/articles/gift-visibility/pic-2.png"
                reference=""
                subtitle="mensagem do presente oculto quando clicado"
            />

            <p>Na galeria de prêmios também aparecerá somente a sombra dos troféus com interrogação, não revelando também as metas em pontos seguintes.</p>

            <ShowPicture
                imgContainerClass="gift-visibility--picture"
                dataSrc="/img/articles/gift-visibility/pic-3.png"
                reference=""
                subtitle="metas e prêmios ocultos, revelado apenas quando desafio concluído"
            />

            <p>Isso é o que faz a opção <strong>escondido durante desafios</strong>, selecionada por padrão.</p>

            <p>Agora, se você quer deixar sempre visível suas metas e prêmios, basta selecionar <strong>sempre revelado</strong> que seus clientes ficarão sabendo do prêmio desde o começo.</p>

            <ShowPicture
                imgContainerClass="gift-visibility--picture"
                dataSrc="/img/articles/gift-visibility/pic-4.png"
                reference=""
                subtitle="descrição do prêmio atual visível quando clicado"
            />

            <ShowPicture
                imgContainerClass="gift-visibility--picture"
                dataSrc="/img/articles/gift-visibility/pic-5.png"
                reference=""
                subtitle="metas e prêmios visíveis na galeria"
            />

            <p>A <strong>galeria de prêmios</strong> é revelado assim que o cliente bater sua meta em pontos em cada desafio.</p>

            <ShowPicture
                imgContainerClass="gift-visibility--picture"
                dataSrc="/img/articles/gift-visibility/pic-6.png"
                reference=""
                subtitle="botão galeria no cartão prêmio após abrir caixa com prazo de resgate"
            />

            <p>Esta sessão é acessado clicando na caixa de presente via <strong>botão galeria</strong> ou pelo <strong>histórico de compras</strong> do cliente.</p>

            <ShowPicture
                imgContainerClass="gift-visibility--picture"
                dataSrc="/img/articles/gift-visibility/pic-7.png"
                reference=""
                subtitle="botão ver seu prêmio no histórico de compras"
            />
        </article>
    );
}


export default function GiftVisibility_art1() {
    return (
        <section>
            <ShowTitle title="Fiddelize Ensina" />
            <ShowArticleTitle title="Revelar prêmios e metas no app dos seus clientes" />
            <ShowPicture
                src="/img/articles/gift-visibility/main.jpg"
                timeout={2000}
                reference="pexels.com"
                main={true}
            />
            <Body />
        </section>
    );
}