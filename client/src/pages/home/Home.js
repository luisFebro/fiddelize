import React, { useEffect } from "react";
import { CLIENT_URL } from "../../config/clientUrl";
import ScrollArrow from "../../keyframes/built/scroll-arrow/ScrollArrow";
import "./_Home.scss";
import FeaturesSection from "./sections/features/FeaturesSection";
import CtaSection from "./sections/CtaSection.js";
import preloadMedia from "../../utils/media/preloadMedia";
// import CompLoader from "../../components/CompLoader";
// import AppShowCase from "./AppShowCase";
// import { Link } from 'react-router-dom';

const isSmall = window.Helper.isSmallScreen();

export default function Home() {
    useEffect(() => {
        preloadMedia({
            href:
                CLIENT_URL +
                "/img/illustrations/home/feature-mobiles/cli-admin.gif",
        });
        preloadMedia({
            href:
                CLIENT_URL +
                "/img/illustrations/home/feature-mobiles/cli-member.gif",
        });
        preloadMedia({
            href:
                CLIENT_URL +
                "/img/illustrations/home/feature-mobiles/cli-user.gif",
        });
    }, []);
    // const [viewPhone, setViewPhone] = useState(false);
    const showHero = () => (
        <section className="hero-section">
            <div className="container">
                <section className="row justify-content-center">
                    <div className="col-lg-45 order-lg-2">
                        <div className="hero-image">
                            <img
                                src="/img/illustrations/home/3d-illustra/hero-image-fiddelize.png"
                                alt="Criamos motivos para clientes comprarem do seu negócio."
                            />
                        </div>
                    </div>
                    <div className="col-lg-55 order-lg-1">
                        <div className="hero-content">
                            <h1 className="text-title line-height-hero">
                                Criamos mais motivos para os clientes comprarem
                                do seu negócio.
                            </h1>
                            <p className="mt-4 text-white">
                                Faça seu app hoje. Transforme seu negócio em
                                jogo de compras com{" "}
                                <strong>pontos de fidelidade</strong>.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );

    return (
        <section className="home-page--root">
            {showHero()}
            <FeaturesSection />
            <CtaSection />
        </section>
    );
}

/* ARCHIVES
    <div
        style={{
            margin: isSmall ? "10px 0 100px 0" : "50px 0 100px 0",
        }}
        className="d-flex justify-content-center"
    >
        <ScrollArrow color="white" />
    </div>
</section>
<AppShowCase setData={setViewPhone} />

 const showSlogon = () => (
        <section className="mt-5 d-flex flex-column flex-md-row justify-content-center align-items-center">
            <h1
                className="mx-2 mx-md-5 text-center align-item-center text-md-left text-title text-white"
                style={{ maxWidth: "700px" }}
            >
                Conquiste clientes. Faça eles retornarem. Ganhe uma carteira de fãs para o seu negócio.
            </h1>
        </section>
    );

<div className="align-self-center m-1">
    <picture>
        <source
            srcSet="/img/official-logo-white.webp"
            type="image/webp"
        />
        <source
            srcSet="/img/official-logo-white.png"
            type="image/png"
        />
        <img
            className="svg-elevation"
            src={`${CLIENT_URL}/img/official-logo-white.webp`}
            alt="logo"
            width={150}
            height="auto"
        />
    </picture>
</div>

<div className="mt-3 text-subtitle text-center">Acumule pontos e ganhe produtos e serviços</div>
<Link to="/regulamento">
    <div
        className="my-5 text-subtitle font-weight-italic text-center"
        style={{color: "var(--mainPink)", cursor: "pointer"}}
    >
        Consulte<br />as Regras Aqui
    </div>
</Link>
*/
