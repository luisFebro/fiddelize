import { Fragment } from "react";
import QrCode from "components/QrCode";
import CarouselCard from "components/carousels/CarouselCard";
import ProductCard from "./ProductCard";

export default function CustomerCatalog({ match }) {
    const tableId = match && match.params && match.params.tableId;
    const bizLinkId = match && match.params && match.params.bizLinkId;
    const bizLogo = "/img/test/restaurant.jpg";
    const width = 110;
    const height = 110;
    const url = match && match.url;
    const isQrDisplay = tableId === "qr";
    // show either qr code to be scanned or the product catalog

    const showLogo = () => (
        <div className="mt-5 mb-3 container-center">
            <img
                src={bizLogo}
                width={width}
                height={height}
                title={`logo da ${bizLinkId}`}
                alt={`logo empresa ${bizLinkId}`}
            />
        </div>
    );

    const showQrCode = () => {
        const imageSettings = {
            src: bizLogo,
        };

        const imageSquare = true; // bizLogo && bizLogo.includes("h_100,w_100");

        return (
            <section className="mb-5 container-center">
                <div className="qr-container">
                    <QrCode
                        value={`https:/fiddelize.com.br/${url}`}
                        fgColor="var(--themeP--purple)"
                        imageSettings={imageSettings}
                        imageSquare={imageSquare}
                    />
                </div>
            </section>
        );
    };

    return (
        <section>
            {showLogo()}
            {isQrDisplay ? (
                <Fragment>
                    <h1 className="font-weight-bold mt-5 text-subtitle text-white text-center">
                        Peça seu pedido:
                    </h1>
                    {showQrCode()}
                </Fragment>
            ) : (
                <DigitalMenu />
            )}
        </section>
    );
}

// COMP
function DigitalMenu() {
    const allCategories = ["bebidas", "sanduíches", "gerais"];
    const dataProducts = [
        {
            id: "123",
            category: "bebidas",
            availableQtt: 10,
            img: "/img/test/cardapio-qr/lata-guarana-antactica.jpg",
            desc: "lata guaraná antactica",
            unitAmount: 8.0,
        },
        {
            id: "123fsf",
            category: "bebidas",
            availableQtt: 10,
            img: "/img/test/cardapio-qr/suco-de-uva.jpg",
            desc: "suco de uva",
            unitAmount: 5,
        },
        {
            id: "123fsq232f",
            category: "bebidas",
            availableQtt: 30,
            img: "/img/test/cardapio-qr/coca.jpg",
            desc:
                "coca-cola ma bebida muito gelada, gelada mesmo meu deus, precisa beber essa bebida miraculosa    ",
            unitAmount: 8,
        },
        {
            id: "123fsq232f",
            category: "sanduíches",
            availableQtt: 3,
            img: "/img/test/cardapio-qr/kikao.jpg",
            desc: "kikão com palha",
            unitAmount: 5,
        },
        {
            id: "12321233",
            category: "sanduíches",
            availableQtt: 15,
            img: "/img/test/cardapio-qr/sanduba-x-salada-verduras.jpg",
            desc: "sanduba x-salada muito top",
            unitAmount: 5,
        },
        {
            id: "12321233132",
            category: "sanduíches",
            availableQtt: 5,
            img: "/img/test/cardapio-qr/sanduba-pao-arabe-misto.png",
            desc: "sanduba pão árabe",
            unitAmount: 5,
        },
    ];

    const showCatalog = () => (
        <section className="">
            {allCategories.map((cat) => {
                const filteredCategory =
                    dataProducts.filter((item) => item.category === cat) || [];
                if (!filteredCategory.length) return <div />;

                const ThisCardList = <CardList dataList={filteredCategory} />;

                return (
                    <section className="" key={cat}>
                        <h2
                            className="d-table text-pill ml-3 text-normal text-purple font-weight-bold"
                            style={{
                                backgroundColor: "var(--themePDark)",
                            }}
                        >
                            {cat}
                        </h2>
                        <div>
                            <CarouselCard
                                CardList={ThisCardList}
                                size="large"
                                multi
                            />
                        </div>
                    </section>
                );
            })}
        </section>
    );

    return (
        <section>
            <h1 className="font-weight-bold text-subtitle text-white text-center">
                Cardápio Digital
            </h1>
            {showCatalog()}
        </section>
    );
}

// COMP
function CardList({ dataList = [] }) {
    return (
        <Fragment>
            {dataList.length &&
                dataList.map((card) => (
                    <Fragment key={card.id}>
                        <ProductCard card={card} />
                    </Fragment>
                ))}
        </Fragment>
    );
}
// END COMP
