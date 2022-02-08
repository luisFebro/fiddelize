import { useState, useEffect } from "react";
import getAPI, { readMainItemList } from "api";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import Card from "@material-ui/core/Card";
import convertToReal from "utils/numbers/convertToReal";
import useContext from "context";
import Spinner from "components/loadingIndicators/Spinner";
import showToast from "components/toasts";
import { MinusPlusBtns } from "../ItemCardCustomer";
import ImgHandler from "./img/ImgHandler";

export default function ShowSingleItem({
    sColor = "default",
    itemSearch,
    handleFullClose = () => null,
    adminId,
}) {
    const [data, setData] = useState({
        _id: null,
        itemId: null,
        img: null,
        adName: null,
        price: null,
        category: null,
        errorAdName: false,
        errorPrice: false,
        finishedUpload: false,
        // minus plus btn
        added: false,
        qtt: 0,
        totalAmount: 0,
    });

    const { handleItem } = useContext();
    console.log("handleItem", handleItem);
    const { img, adName, price, category, added, qtt, totalAmount } = data;

    const [loadingShowItem, setLoadingShowItem] = useState(false);

    const handleCardData = (thisCard) =>
        setData((prev) => ({
            ...prev,
            _id: thisCard._id,
            category: thisCard.category,
            itemId: thisCard.itemId,
            img: thisCard.img,
            adName: thisCard.adName,
            price: thisCard.price && thisCard.price.toFixed(2),
        }));

    useEffect(() => {
        if (!itemSearch) return;

        setLoadingShowItem(true);

        const params = {
            adminId,
            search: itemSearch,
            skip: 0,
            limit: 1,
            needAllCategories: false,
        };

        getAPI({
            method: "get",
            url: readMainItemList(),
            params,
        })
            .then((res) => {
                const dataRes = res.list && res.list[0];
                if (dataRes) handleCardData(dataRes);
                setLoadingShowItem(false);
            })
            .catch(() => setLoadingShowItem(false));
    }, [itemSearch]);

    const showTitle = () => (
        <h2 className="my-4 text-subtitle text-white text-shadow text-center font-weight-bold">
            Detalhes do Item
        </h2>
    );

    const saveItem = () => {
        showToast("item saved");
        handleFullClose();
        return null;
    };

    const showFloatCTA = () => (
        <div
            className="position-fixed animated fadeInUp delay-1s"
            style={{
                bottom: 15,
                right: 15,
            }}
        >
            <section className="container-center">
                <div className="ml-2">
                    <ButtonFab
                        title="Salvar"
                        backgroundColor={`var(--themeSDark--${sColor})`}
                        onClick={saveItem}
                        position="relative"
                        variant="extended"
                        size="large"
                    />
                </div>
            </section>
        </div>
    );

    const showCardInfo = () => (
        <section
            style={{
                overflowY: "scroll",
            }}
        >
            <Card
                className="mb-3"
                style={{
                    margin: "auto",
                    boxShadow: "0 31px 120px -6px rgba(0, 0, 0, 0.35)",
                    width: "100%",
                    // maxWidth: isSmall ? "" : 360,
                }}
            >
                <p className="mt-3 text-center text-purple text-subtitle font-weight-bold mx-3">
                    Informações
                </p>
                <main className="mx-3 text-p text-normal position-relative">
                    <div className="mt-3">
                        <span className="font-weight-bold">
                            Nome Divulgação:
                        </span>
                        <p className="font-italic">{adName}</p>
                    </div>
                    <div className="mt-3">
                        <span className="font-weight-bold">Preço:</span>
                        <p className="font-italic">
                            R$ {convertToReal(price, { needFraction: true })}
                        </p>
                    </div>
                    <div className="mt-3">
                        <span className="font-weight-bold">Categoria:</span>
                        <p className="font-italic">
                            {category === "_general" ? "gerais" : category}
                        </p>
                    </div>
                    <div style={{ marginBottom: 50 }} />
                </main>
            </Card>
        </section>
    );

    const showMinusPlusBtns = () => (
        <section
            className="position-absolute"
            style={{
                bottom: 10,
                left: 10,
            }}
        >
            <MinusPlusBtns
                qtt={10}
                handleItem={handleItem}
                setData={setData}
                card={{
                    adName: "teste",
                    price: 15,
                    img: "teste.png",
                }}
            />
        </section>
    );

    return (
        <section>
            {showTitle()}
            {loadingShowItem ? (
                <div className="my-5" style={{ minHeight: 150 }}>
                    <Spinner size="large" />
                </div>
            ) : (
                <ImgHandler setData={setData} savedImg={img} isShowItem />
            )}
            {showCardInfo()}
            {showFloatCTA()}
            {showMinusPlusBtns()}
        </section>
    );
}
