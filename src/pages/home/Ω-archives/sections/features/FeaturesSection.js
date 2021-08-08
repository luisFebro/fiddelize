import "./_FeaturesSection.scss";
import FeatureTabs from "./feature-tabs/FeatureTabs";
import tabsData from "./tabsData";

export default function FeaturesSection() {
    const showHeader = () => (
        <section className="row">
            <header className="col-lg-12">
                <div className="section-title">
                    <h2>
                        Você ganha <strong>3 tipos de apps</strong>.
                    </h2>
                    <p>
                        Cada um com seu melhor:
                        <br />
                        Seus clientes compram. A equipe ajuda. Você conquista!
                    </p>
                </div>
            </header>
        </section>
    );

    const showPtsCoin = () => (
        <section className="container-center-col my-5">
            <img
                className="pts-coin"
                width={200}
                height={200}
                src="/img/pts-coin.svg"
                alt="moeda digital pts para benefícios"
            />
            <section className="pts-coin-titles">
                <h2 className="mx-2 title-pts-coin text-purple text-normal text-center mt-3">
                    <strong>A moeda digital para seu negócio</strong>
                </h2>
                <p className="mx-3 parag-pts-coin">
                    A{" "}
                    <strong>
                        PTS{" "}
                        <em className="font-site text-em-0-8 font-weight-bold">
                            (pronúncia: pítis)
                        </em>
                    </strong>{" "}
                    é a <strong>primeira moeda digital</strong> para negócios
                    usada como <strong>troca de benefícios</strong> como
                    descontos e prêmios.
                </p>
                <p className="mx-3 parag-pts-coin mt-3">
                    <strong>Valores da moeda</strong> somente podem ser lidos e
                    modificados pelo seu negócio e usada exclusivamente pelos
                    seus clientes.
                </p>
                <p className="mx-3 parag-pts-coin mt-3">
                    <strong>Integridade e segurança</strong> da PTS é feita com
                    a mesma criptografia usada em carteiras que protegem o
                    Bitcoin (algoritmo AES 256) que torna o armazenamento
                    virtualmente impenetrável mesmo com ataques de força bruta.
                </p>
            </section>
            <style jsx>
                {`
                    .pts-coin {
                        filter: drop-shadow(0.003em 0.003em 0.3em grey);
                    }
                    .title-pts-coin {
                        position: relative;
                        line-height: 18px;
                    }

                    @media only screen and (min-width: 768px) {
                        .pts-coin-titles {
                            width: 500px;
                        }
                    }
                `}
            </style>
        </section>
    );

    return (
        <section className="feature-section--root">
            <div className="shape">
                <img
                    src="/img/illustrations/home/shapes/landing-1-shape.svg"
                    alt="shape 1"
                />
            </div>
            {showPtsCoin()}
            <section className="tabs">
                <div className="container">
                    {showHeader()}
                    <FeatureTabs tabsData={tabsData} />
                </div>
            </section>
        </section>
    );
}
