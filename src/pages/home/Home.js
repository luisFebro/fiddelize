import { useEffect } from "react";
import { setVar } from "init/var";
import { CLIENT_URL } from "config/clientUrl";
import "./_Home.scss";
import FeaturesSection from "./sections/features/FeaturesSection";
import CtaSection from "./sections/CtaSection";
import preloadMedia from "utils/media/preloadMedia";
// import CompLoader from "../../components/CompLoader";
// import AppShowCase from "./AppShowCase";
// import { Link } from 'react-router-dom';

export default function Home({ match }) {
    useEffect(() => {
        preloadMedia({
            href: `${CLIENT_URL}/img/illustrations/home/feature-mobiles/cli-admin.gif`,
        });
        preloadMedia({
            href: `${CLIENT_URL}/img/illustrations/home/feature-mobiles/cli-member.gif`,
        });
        preloadMedia({
            href: `${CLIENT_URL}/img/illustrations/home/feature-mobiles/cli-user.gif`,
        });

        const gotReferrer = match.params.associateId;
        if (gotReferrer) {
            setVar({ referrer: gotReferrer }, "pre_register");
        }
    }, [match]);
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
                                Faça seu app hoje. Ofereça aos seus clientes{" "}
                                <strong>pontos</strong> como moeda digital para
                                trocarem por benefícios com{" "}
                                <strong>jogos de compra</strong>.
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
