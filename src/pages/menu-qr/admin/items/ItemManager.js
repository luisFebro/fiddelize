import { Fragment } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CarouselCard from "components/carousels/CarouselCard";
import convertToReal from "utils/numbers/convertToReal";
import EditButton from "components/buttons/EditButton";
import ItemHandlerBtn from "./item-handler/ItemHandlerBtn";
// import getId from "utils/getId";

const truncate = (name, leng) => window.Helper.truncate(name, leng);

const PlusIcon = (
    <AddCircleOutlineIcon
        style={{
            transform: "scale(1.5)",
            color: "#fff",
            filter: "drop-shadow(.1px .1px .9px grey)",
        }}
    />
);

export default function ProductManager() {
    const showTitle = () => (
        <div className="mt-5 mb-3 text-center text-purple mx-3">
            <h1 className="text-subtitle text-purple font-weight-bold">
                Gerenciador de itens
            </h1>
        </div>
    );

    const showAddZone = () => (
        <section className="add-zone--root">
            <div className="field">
                <ItemHandlerBtn PlusIcon={PlusIcon} type="item" />
                <div className="mt-3" />
                <ItemHandlerBtn PlusIcon={PlusIcon} type="category" />
            </div>
            <style jsx>
                {`
                    .add-zone--root .field {
                        margin: 10px;
                        padding: 15px;
                        border-radius: 15px;
                        background: var(--themePDark);
                    }
                `}
            </style>
        </section>
    );

    const allCategories = ["bebidas", "sanduíches"];
    const dataProducts = [
        {
            id: "123",
            category: "bebidas",
            availableQtt: 10,
            img: "/img/test/cardapio-qr/lata-guarana-antactica.jpg",
            desc: "lata guaraná antactica",
            price: 8.0,
        },
        {
            id: "123fsf",
            category: "bebidas",
            availableQtt: 10,
            img: "/img/test/cardapio-qr/suco-de-uva.jpg",
            desc: "suco de uva",
            price: 5,
        },
        {
            id: "12321233",
            category: "sanduíches",
            availableQtt: 15,
            img: "/img/test/cardapio-qr/sanduba-x-salada-verduras.jpg",
            desc: "sanduba x-salada muito top",
            price: 5,
        },
        {
            id: "12321233132(((",
            category: "sanduíches",
            availableQtt: 5,
            img: "/img/test/cardapio-qr/sanduba-pao-arabe-misto.png",
            desc: "sanduba pão árabe",
            price: 5,
        },
        {
            id: "12321233132(((",
            category: "bebidas",
            availableQtt: 2,
            img: "/img/test/cardapio-qr/acai-copo.jpg",
            desc: "Açai copo",
            price: 10,
        },
        {
            id: "12321233132(((",
            category: "bebidas",
            availableQtt: 20,
            img: "/img/test/cardapio-qr/guarana_antartica.jpg",
            desc: "Antactica em lata",
            price: 8,
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
                        <h2 className="d-table text-pill ml-3 text-normal text-purple font-weight-bold">
                            {cat}
                        </h2>
                        <div>
                            <CarouselCard
                                CardList={ThisCardList}
                                size="medium"
                                multi
                                lazyLoad
                            />
                        </div>
                    </section>
                );
            })}
        </section>
    );

    return (
        <section>
            {showTitle()}
            {showAddZone()}
            {showCatalog()}
            <div style={{ marginBottom: 150 }} />
        </section>
    );
}

// COMP
const CardList = ({ dataList = [] }) => (
    <Fragment>
        {dataList.length &&
            dataList.map((card) => {
                const ShowImg = () => (
                    <section className="mb-2 container-center">
                        <img
                            data-flickity-lazyload={card.img}
                            className="carousel-cell-image"
                            width="170px"
                            height="170px"
                            alt={card.desc}
                        />
                    </section>
                );

                const showEditBtn = () => {
                    const handleEdit = () => {
                        //
                    };

                    return (
                        <div
                            className="position-absolute"
                            style={{
                                bottom: "10px",
                                right: "10px",
                            }}
                        >
                            <EditButton onClick={handleEdit} zIndex=" " />
                        </div>
                    );
                };

                return (
                    <section key={card.id} className="carousel-cell no-outline">
                        <ShowImg />
                        <section className="text-left">
                            <p className="mb-1 text-em-1-1">
                                {truncate(card.desc, 50)}
                            </p>
                            <p className="d-table text-small text-em-1-1 text-pill">
                                Preço Uni.: R$ {convertToReal(card.price)}
                            </p>
                        </section>
                        {showEditBtn()}
                    </section>
                );
            })}
    </Fragment>
);
// END COMP
