import DeleteButton from "components/buttons/DeleteButton";
import { Fragment, useState } from "react";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import convertToReal from "utils/numbers/convertToReal";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import showToast from "components/toasts";

const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function ProductCard({ card }) {
    const [data, setData] = useState({
        added: false,
        qtt: 1,
    });
    const { added, qtt } = data;
    const totalAmount = card.unitAmount * qtt;

    const showImg = () => (
        <section className="mb-2 container-center">
            <img width="150px" height="150px" src={card.img} alt={card.desc} />
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

    const handleAddClick = () => {
        setData((prev) => ({ ...prev, added: true }));
        // showToast("Adicionado com sucesso!", { dur: 3000, type: "success" })
    };

    const showAddBtn = () => (
        <Fragment>
            {!added ? (
                <div
                    className="position-absolute"
                    style={{
                        bottom: "10px",
                        right: "10px",
                    }}
                >
                    <ButtonFab
                        size="large"
                        backgroundColor="var(--themeSDark)"
                        onClick={handleAddClick}
                        position="relative"
                        iconMu={
                            <AddShoppingCartIcon
                                style={{
                                    transform: "scale(1.5)",
                                    zIndex: 1,
                                }}
                            />
                        }
                    />
                </div>
            ) : (
                <div
                    className="position-absolute"
                    style={{
                        bottom: "10px",
                        right: "10px",
                    }}
                >
                    <DeleteButton
                        onClick={() =>
                            setData((prev) => ({
                                ...prev,
                                qtt: 1,
                                added: false,
                            }))
                        }
                        transform="scale(1.5)"
                        size="medium"
                    />
                </div>
            )}
        </Fragment>
    );

    return (
        <section key={card.id} className="carousel-cell no-outline">
            {added && showAddedBadge()}
            {showImg()}
            <section className="text-left">
                <p
                    className="mb-1 text-em-1-1"
                    style={{
                        minHeight: 50,
                    }}
                >
                    {truncate(card.desc, 40)}
                </p>
                <p className="d-table text-normal text-shadow text-em-1-3 text-pill text-nowrap">
                    R$ {convertToReal(totalAmount)}{" "}
                    {qtt > 1 ? (
                        <span className="text-em-0-9">
                            {" "}
                            > R$ {convertToReal(card.unitAmount)} (cada)
                        </span>
                    ) : (
                        ""
                    )}
                </p>
                <div className="d-flex">
                    <ButtonFab
                        size="small"
                        backgroundColor="var(--themeSDark)"
                        onClick={() =>
                            setData((prev) => ({
                                ...prev,
                                qtt: prev.qtt <= 1 ? 1 : (prev.qtt -= 1),
                            }))
                        }
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
                        onClick={() =>
                            setData((prev) => ({
                                ...prev,
                                qtt: (prev.qtt += 1),
                            }))
                        }
                        position="relative"
                        iconMu={
                            <FontAwesomeIcon
                                icon="plus"
                                style={{ fontSize: 15 }}
                            />
                        }
                    />
                </div>
            </section>
            {showAddBtn()}
        </section>
    );
}
