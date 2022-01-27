import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ItemHandlerBtn from "./item-handler/ItemHandlerBtn";
// import getId from "utils/getId";

const PlusIcon = (
    <AddCircleOutlineIcon
        style={{
            transform: "scale(1.5)",
            color: "#fff",
            filter: "drop-shadow(.1px .1px .9px grey)",
        }}
    />
);

export default function ItemManager({ updateItem }) {
    return (
        <section className="add-zone--root">
            <div className="field">
                <ItemHandlerBtn
                    updateItem={updateItem}
                    PlusIcon={PlusIcon}
                    type="item"
                />
                <div className="mt-3" />
                <ItemHandlerBtn
                    updateItem={updateItem}
                    PlusIcon={PlusIcon}
                    type="category"
                />
            </div>
            <style jsx>
                {`
                    .add-zone--root .field {
                        margin: 10px;
                        padding: 15px;
                        border-radius: 15px;
                        background: var(--themePDark);
                    }
                `}
            </style>
        </section>
    );
}
