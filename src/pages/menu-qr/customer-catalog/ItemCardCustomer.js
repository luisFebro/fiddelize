import { useState, useEffect, forwardRef } from "react";
import convertToReal from "utils/numbers/convertToReal";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useContext from "context";
// import showToast from "components/toasts";

const truncate = (name, leng) => window.Helper.truncate(name, leng);

function ItemCardCustomer({ card, flickity, carouselInd }, ref) {
    const { itemData } = useContext();
    const { handleItem, orderList } = itemData;

    const [data, setData] = useState({
        added: false,
        qtt: 0,
        totalAmount: 0,
    });
    const { added, qtt, totalAmount } = data;
    const itemDesc = card.adName;

    useEffect(() => {
        const foundItem = orderList.find(
            (item) => item.adName === itemDesc && item.count >= 1
        );

        if (itemDesc && foundItem) {
            setData((prev) => ({
                ...prev,
                added: true,
                qtt: foundItem.count,
                totalAmount: card.price * foundItem.count || 1,
            }));
        } else {
            setData((prev) => ({
                ...prev,
                totalAmount: card.price * 1,
            }));
        }
    }, [itemDesc, JSON.stringify(orderList)]);

    const showImg = () => (
        <section
            className="mb-2 container-center"
            onClick={() => {
                flickity &&
                    flickity[carouselInd] &&
                    flickity[carouselInd].viewFullscreen();
            }}
        >
            <img
                data-flickity-lazyload={card.img}
                className="carousel-cell-image"
                width="150px"
                height="150px"
                alt={itemDesc}
            />
        </section>
    );

    const showAddedBadge = () => (
        <section className="animated fadeInUp show-added-badge text-shadow text-small">
            adicionado <FontAwesomeIcon icon="check" style={{ fontSize: 20 }} />
            <style jsx>
                {`
                    .show-added-badge {
                        position: absolute;
                        top: 7px;
                        right: 45px;
                        background: var(--themePDark);
                        border-radius: 15px;
                        padding: 3px;
                        border: solid white 1px;
                    }
                `}
            </style>
        </section>
    );

    return (
        <section
            ref={ref}
            key={card.itemId}
            className="carousel-cell no-outline"
        >
            {added && showAddedBadge()}
            {showImg()}
            <section className="desc text-left">
                <p
                    className="mb-1 m-0 text-em-1-1"
                    style={{
                        minHeight: 50,
                    }}
                >
                    {truncate(itemDesc, 40)}
                </p>
                <p className="d-table text-normal text-shadow text-em-1-3 text-pill text-nowrap">
                    R$ {convertToReal(totalAmount, { needFraction: true })}{" "}
                    {qtt > 1 ? (
                        <span className="text-em-0-9">
                            {" "}
                            &gt; R$ {convertToReal(card.price)} (cada)
                        </span>
                    ) : (
                        ""
                    )}
                </p>
                <MinusPlusBtns
                    qtt={qtt}
                    card={card}
                    handleItem={handleItem}
                    setData={setData}
                />
            </section>
        </section>
    );
}

export function MinusPlusBtns({ qtt, card, handleItem, setData }) {
    return (
        <div className="d-flex">
            <ButtonFab
                disabled={qtt === 0}
                size="small"
                backgroundColor={qtt <= 0 ? "grey" : "var(--expenseRed)"}
                onClick={() => {
                    const isZeroQtt = qtt === 0;
                    if (isZeroQtt) return;

                    const newCount = qtt - 1;
                    const newAmount = card.price * newCount;
                    const item = {
                        adName: card.adName,
                        count: newCount,
                        amount: newAmount,
                        price: card.price,
                        img: card.img,
                    };

                    if (newCount === 0) handleItem("remove", card.adName);
                    else handleItem("update", { item });

                    setData((prev) => ({
                        ...prev,
                        qtt: newCount <= 0 ? 0 : newCount,
                        added: newCount <= 0 ? false : true,
                        totalAmount: newAmount,
                    }));
                }}
                position="relative"
                iconMu={
                    <FontAwesomeIcon icon="minus" style={{ fontSize: 15 }} />
                }
            />
            <p className="d-table text-shadow text-subtitle text-em-1-8 mx-2">
                {qtt} x
            </p>
            <ButtonFab
                size="small"
                backgroundColor="var(--themeSDark)"
                onClick={() => {
                    setData((prev) => {
                        const newCount = prev.qtt + 1;
                        const newAmount = card.price * newCount;

                        const item = {
                            adName: card.adName,
                            count: newCount,
                            amount: newAmount,
                            img: card.img,
                            price: card.price,
                        };
                        handleItem("update", { item });

                        return {
                            ...prev,
                            qtt: newCount,
                            added: true,
                            totalAmount: newAmount,
                        };
                    });
                }}
                position="relative"
                iconMu={
                    <FontAwesomeIcon icon="plus" style={{ fontSize: 25 }} />
                }
            />
        </div>
    );
}

/*
As per React Official Docs, By default React will only shallowly compare complex objects in the props object. If you want control over the comparison, you can also provide a custom comparison function as the second argument.
 */
export default forwardRef(ItemCardCustomer);
