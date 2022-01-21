import { Fragment } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CarouselCard from "components/carousels/CarouselCard";
import convertToReal from "utils/numbers/convertToReal";
import EditButton from "components/buttons/EditButton";
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
                Gerenciador de produtos
            </h1>
        </div>
    );

    const showAddZone = () => (
        <section className="add-zone--root">
            <div className="field">
                <ButtonFab
                    size="large"
                    title="adicionar produto"
                    backgroundColor="var(--themeSDark)"
                    onClick={null}
                    position="relative"
                    variant="extended"
                    iconMu={PlusIcon}
                />
                <div className="mt-3" />
                <ButtonFab
                    size="large"
                    title="adicionar categoria"
                    backgroundColor="var(--themeSDark)"
                    onClick={null}
                    position="relative"
                    variant="extended"
                    iconMu={PlusIcon}
                />
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
            id: "12321233",
            category: "sanduíches",
            availableQtt: 15,
            img: "/img/test/cardapio-qr/sanduba-x-salada-verduras.jpg",
            desc: "sanduba x-salada muito top",
            unitAmount: 5,
        },
        {
            id: "12321233132(((",
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
                        <h2 className="d-table text-pill ml-3 text-normal text-purple font-weight-bold">
                            {cat}
                        </h2>
                        <div>
                            <CarouselCard
                                CardList={ThisCardList}
                                size="medium"
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
                            width="150px"
                            height="150px"
                            src={card.img}
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
                                Preço Uni.: R$ {convertToReal(card.unitAmount)}
                            </p>
                        </section>
                        {showEditBtn()}
                    </section>
                );
            })}
    </Fragment>
);
// END COMP
