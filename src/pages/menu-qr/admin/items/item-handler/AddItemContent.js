import { useState, useEffect } from "react";
import NewItemForm from "./items/NewItemForm";
import ImgHandler from "./img/ImgHandler";

export default function AddItemContent({ card, isEditBtn, handleFullClose }) {
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

    // handle card data from ItemCardAdmin for edit
    useEffect(() => {
        if (!card) return;

        setData((prev) => ({
            ...prev,
            _id: card._id,
            category: card.category,
            itemId: card.itemId,
            img: card.img,
            adName: card.adName,
            price: card.price && card.price.toFixed(2),
        }));
    }, [card]);

    const showTitle = () => (
        <h2 className="my-4 text-subtitle text-white text-shadow text-center font-weight-bold">
            {isEditBtn ? "Edição de Item" : "Adicione Novo Item"}
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
