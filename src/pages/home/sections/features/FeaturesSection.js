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
                        Isso mesmo. Não um, mas 3 deles! Todos os membros com um
                        app.
                    </p>
                </div>
            </header>
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
            <section className="tabs">
                <div className="container">
                    {showHeader()}
                    <FeatureTabs tabsData={tabsData} />
                </div>
            </section>
        </section>
    );
}
