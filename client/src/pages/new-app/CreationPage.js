import React from 'react';
import CarouselSlick from '../../components/carousels/CarouselSlick';

export default function CreationPage() {
    return (
        <section>
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