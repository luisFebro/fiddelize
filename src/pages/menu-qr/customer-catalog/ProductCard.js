import { useState, useEffect } from "react";
import convertToReal from "utils/numbers/convertToReal";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import showToast from "components/toasts";

const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function ProductCard({ card, itemData }) {
    const { handleItem, orderList } = itemData;

    const [data, setData] = useState({
        added: false,
        qtt: 0,
        totalAmount: 0,
    });
    const { added, qtt, totalAmount } = data;
    const itemDesc = card.name;

    useEffect(() => {
        const foundItem = orderList.find(
            (item) => item.name === itemDesc && item.count >= 1
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
    }, [itemDesc, orderList]);

    const showImg = () => (
        <section className="mb-2 container-center">
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
                        right: 7px;
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
        <section key={card.itemId} className="carousel-cell no-outline">
            {added && showAddedBadge()}
            {showImg()}
            <section className="text-left">
                <p
                    className="mb-1 text-em-1-1"
                    style={{
                        minHeight: 50,
                    }}
                >
                    {truncate(itemDesc, 40)}
                </p>
                <p className="d-table text-normal text-shadow text-em-1-3 text-pill text-nowrap">
                    R$ {convertToReal(totalAmount)}{" "}
                    {qtt > 1 ? (
                        <span className="text-em-0-9">
                            {" "}
                            &gt; R$ {convertToReal(card.price)} (cada)
                        </span>
                    ) : (
                        ""
                    )}
                </p>
                <div className="d-flex">
                    <ButtonFab
                        disabled={qtt === 0}
                        size="small"
                        backgroundColor={
                            qtt <= 0 ? "grey" : "var(--expenseRed)"
                        }
                        onClick={() => {
                            const isZeroQtt = qtt === 0;
                            if (isZeroQtt) return;

                            const newCount = qtt - 1;
                            const newAmount = card.price * newCount;
                            const item = {
                                name: itemDesc,
                                count: newCount,
                                amount: newAmount,
                                price: card.price,
                                img: card.img,
                            };

                            if (newCount === 0) handleItem("remove", itemDesc);
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
                            <FontAwesomeIcon
                                icon="minus"
                                style={{ fontSize: 15 }}
                            />
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
                                    name: itemDesc,
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
                            <FontAwesomeIcon
                                icon="plus"
                                style={{ fontSize: 25 }}
                            />
                        }
                    />
                </div>
            </section>
        </section>
    );
}
