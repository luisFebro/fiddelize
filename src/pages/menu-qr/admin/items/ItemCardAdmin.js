import { forwardRef } from "react";
import convertToReal from "utils/numbers/convertToReal";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import ItemHandlerBtn from "./item-handler/ItemHandlerBtn";

const truncate = (name, leng) => window.Helper.truncate(name, leng);

function ItemCardAdmin({ card, flickity, carouselInd }, ref) {
    const isHidden = card && card.isHidden;

    const showImg = () => (
        <section
            className="mb-2 container-center-col"
            onClick={() =>
                flickity &&
                flickity[carouselInd] &&
                flickity[carouselInd].viewFullscreen()
            }
        >
            <img
                // data-flickity-lazyload={card.img}
                src={card.img}
                style={{
                    opacity: isHidden ? 0.5 : 1,
                }}
                className="carousel-cell-image"
                width="150px"
                height="150px"
                alt={card.adName}
            />
            {isHidden && (
                <div
                    className="position-absolute"
                    style={{
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    <VisibilityOffIcon
                        style={{
                            fontSize: 40,
                            color: "var(--mainWhite)",
                        }}
                    />
                </div>
            )}
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
