import React from 'react';
import ScrollArrow from '../../keyframes/built/scroll-arrow/ScrollArrow';
import AOS from 'aos';

export default function AppShowCase() {
    const isSmall = React.useCallback(window.Helper.isSmallScreen(), []);
    AOS.init();

    return (
        <section>
            <p
                data-aos="fade-up"
                data-aos-duration="1500"
                className="ml-4 text-title text-white"
            >
                Combinamos design, sistema e tecnologia de ponta para entregar
                uma experiência única para empreendedores e seus clientes através
                de nossa plataforma de fidelização.
            </p>
            <div style={{margin: isSmall ? '10px 0 100px 0' : '50px 0 100px 0'}} className="d-flex justify-content-center">
                <ScrollArrow color="white" />
            </div>
            <p
                data-aos="fade-up"
                data-aos-duration="1500"
                className="ml-4 text-title text-white text-center"
            >
                Crie hoje seu multi App de<br />
                pontos de fidelidade com<br />
                tecnologia sob medida movido a<br />
                aumentar sua clientela e vendas<br />
            </p>
            <div
                data-aos="fade-up-right"
                data-aos-duration="1500"
                style={{maxWidth: 800, position: 'relative', left: isSmall ? '-105px' : '-230px'}}
            >
                <picture>
                    <source srcSet="/img/illustrations/one-hand-held-mobile.webp" media="(min-width: 500px)" />
                    <source srcSet="/img/illustrations/one-hand-held-mobile-small.webp" media="(max-width: 500px)" />
                    <source srcSet="/img/illustrations/one-hand-held-mobile.png" media="(min-width: 500px)" />
                    <source srcSet="/img/illustrations/one-hand-held-mobile-small.png" media="(max-width: 500px)" />
                    <img
                        className="img-fluid shape-elevation"
                        src="/img/illustrations/one-hand-held-mobile.png"
                        height="auto"
                        alt="app do celular"
                        onError={e => e.src = "/img/illustrations/one-hand-held-mobile.png"}
                    />
                </picture>
            </div>
        </section>
    );
}