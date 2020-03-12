import React from 'react';
import CarouselSlick from '../../components/carousels/CarouselSlick';
const isSmall = window.Helper.isSmallScreen();
const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function CreationPage({ location }) {
    console.log("location.search", location.search) // ?name=Luis%20Fdsfd&phone=(99)%2099281-7363&bizName=You%20Vipp%20Shop
    return (
        <section>
            <p
                className={`pl-3 text-center text-white text-hero`}
                style={{lineHeight: 1}}
            >
                Oi,<br /> {truncate('userName'.cap(), isSmall ? 22 : 30)}
            </p>
            <div className="text-title text-white text-center">
                I am the Creation Page.
            </div>
            <div className="text-title text-white text-center">
                Qual é o seu objetivo em pontos que seu cliente precisa atingir para ganhar um prêmio?
            </div>
            <div className="text-title text-white text-center">
                Qual é o prêmio que seu cliente ganha após atingir os objetivos em pontos
            </div>
            <div className="text-title text-white text-center">
                Selecione a principal cor da sua empresa.
            </div>
            <CarouselSlick />
        </section>
    );
}