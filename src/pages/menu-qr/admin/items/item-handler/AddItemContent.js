import { useState } from "react";
import NewItemForm from "./items/NewItemForm";
import ImgHandler from "./img/ImgHandler";

export default function AddItemContent({ handleFullClose }) {
    const [data, setData] = useState({
        img: null,
        name: "",
        price: "",
        errorName: false,
        errorPrice: false,
    });
    const { img } = data;

    const showTitle = () => (
        <h2 className="my-4 text-subtitle text-white text-shadow text-center font-weight-bold">
            Adicione Novo Item
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
            />
        </section>
    );
}
