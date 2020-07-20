import React from 'react';
import {
    ShowTitle,
    ShowPicture,
    ShowArticleTitle,
    textStyle, } from '../DefaultArticleComps';

const Body = () => (
    <article className={textStyle}>
        <p>O app do seu cliente, por padrão, mantem oculto a descrição do prêmio e revela apenas quando o desafio atual estiver concluído.</p>

        <ShowPicture
            pic="/img/articles/gift-visibility/pic-1.png"
            source=""
            subtitle="presente oculto por padrão"
        />

        <p>Na caixa de presente dos seus clientes aparecerá uma interrogação, que quando clicado, um balão informando que o cliente precisa concluir o desafio para saber qual é o prêmio.</p>

        <ShowPicture
            pic="/img/articles/gift-visibility/pic-2.png"
            source=""
            subtitle="mensagem do presente oculto quando clicado"
        />

        <p>Na galeria de prêmios também aparecerá somente a sombra dos troféus com interrogação, não revelando também as metas em pontos seguintes.</p>

        <ShowPicture
            pic="/img/articles/gift-visibility/pic-3.png"
            source=""
            subtitle="metas e prêmios ocultos, revelado apenas quando desafio concluído"
        />

        <p>Isso é o que faz a opção <strong>escondido durante desafios</strong>, selecionada por padrão.</p>

        <p>Agora, se você quer deixar sempre visível suas metas e prêmios, basta selecionar <strong>sempre revelado</strong> que seus clientes ficarão sabendo do prêmio desde o começo.</p>

        <ShowPicture
            pic="/img/articles/gift-visibility/pic-4.png"
            source=""
            subtitle="descrição do prêmio atual visível quando clicado"
        />

        <ShowPicture
            pic="/img/articles/gift-visibility/pic-5.png"
            source=""
            subtitle="metas e prêmios visíveis na galeria"
        />

        <p>A <strong>galeria de prêmios</strong> é revelado assim que o cliente bater sua meta em pontos em cada desafio.</p>

        <ShowPicture
            pic="/img/articles/gift-visibility/pic-6.png"
            source=""
            subtitle="botão galeria no cartão prêmio após abrir caixa com prazo de resgate"
        />

        <p>Esta sessão é acessado clicando na caixa de presente via <strong>botão galeria</strong> ou pelo <strong>histórico de compras</strong> do cliente.</p>

        <ShowPicture
            pic="/img/articles/gift-visibility/pic-7.png"
            source=""
            subtitle="botão ver seu prêmio no histórico de compras"
        />
    </article>
);


export default function GiftVisibility_art1() {
    return (
        <section>
            <ShowTitle />
            <ShowArticleTitle title="Revelar prêmios e metas para seus clientes" />
            <ShowPicture
                pic="/img/articles/gift-visibility/main.jpg"
                source="pexels.com"
                main={true}
            />
            <Body />
        </section>
    );
}