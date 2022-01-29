import { useState, useEffect } from "react";
import NewItemForm from "./items/NewItemForm";
import ImgHandler from "./img/ImgHandler";

export default function AddItemContent({ card, isEditBtn, handleFullClose }) {
    const [data, setData] = useState({
        itemId: null,
        img: null,
        adName: null,
        price: null,
        errorAdName: false,
        errorPrice: false,
    });
    const { img } = data;

    // handle card data from ItemCardAdmin for edit
    useEffect(() => {
        if (!card) return;

        setData((prev) => ({
            ...prev,
            itemId: card.itemId,
            img: card.img,
            adName: card.adName,
            price: card.price,
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
