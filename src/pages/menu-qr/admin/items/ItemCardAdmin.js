import { forwardRef } from "react";
import convertToReal from "utils/numbers/convertToReal";
import ItemHandlerBtn from "./item-handler/ItemHandlerBtn";

const truncate = (name, leng) => window.Helper.truncate(name, leng);

function ItemCardAdmin({ card }, ref) {
    const showImg = () => (
        <section className="mb-2 container-center-col">
            <img
                data-flickity-lazyload={card.img}
                className="carousel-cell-image"
                width="150px"
                height="150px"
                alt={card.adName}
            />
        </section>
    );

    return (
        <section ref={ref} key={card._id} className="carousel-cell no-outline">
            {showImg()}
            <section className="text-left">
                <div className="desc">
                    <p
                        className="mb-1 text-em-1-1"
                        style={{
                            minHeight: 50,
                        }}
                    >
                        {truncate(card.adName, 40)}
                    </p>
                    <p className="d-table text-normal text-shadow text-em-1-3 text-pill text-nowrap">
                        R$ {convertToReal(card.price, { needFraction: true })}{" "}
                    </p>
                </div>
                <div
                    className="position-absolute"
                    style={{ bottom: 5, right: 5 }}
                >
                    <ItemHandlerBtn card={card} isEditBtn />
                </div>
            </section>
        </section>
    );
}

export default forwardRef(ItemCardAdmin);
