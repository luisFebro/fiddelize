import { useState, useEffect } from "react";
import getAPI, { readMainItemList } from "api";
import { useBizData } from "init";
import NewItemForm from "./items/NewItemForm";
import ImgHandler from "./img/ImgHandler";

export default function AddItemContent({
    card,
    isEditBtn,
    itemSearch,
    handleFullClose,
}) {
    const isShowItem = Boolean(itemSearch);
    const { bizId } = useBizData();

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
    });
    const { img } = data;

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

        const params = {
            // userId, // for auth
            adminId: bizId,
            search: itemSearch,
            skip: 0,
            limit: 1,
            needAllCategories: false,
        };

        getAPI({
            method: "get",
            url: readMainItemList(),
            params,
        }).then((res) => {
            const dataRes = res.list && res.list[0];
            if (dataRes) handleCardData(dataRes);
        });
    }, [itemSearch]);

    useEffect(() => {
        if (!card) return;
        handleCardData(card);
    }, [card]);

    // handle card data from ItemCardAdmin for edit
    useEffect(() => {
        if (!card) return;
        handleCardData(card);
    }, [card]);

    const handleTitle = () => {
        if (isShowItem) return "Detalhes do Item";
        return isEditBtn ? "Edição de Item" : "Adicione Novo Item";
    };
    const showTitle = () => (
        <h2 className="my-4 text-subtitle text-white text-shadow text-center font-weight-bold">
            {handleTitle()}
        </h2>
    );

    return (
        <section>
            {showTitle()}
            <ImgHandler setData={setData} savedImg={img} />
            <NewItemForm
                setData={setData}
                handleFullClose={handleFullClose}
                data={data}
                isEditBtn={isEditBtn}
            />
        </section>
    );
}
