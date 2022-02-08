import NewCategoryForm from "./categories/NewCategoryForm";

export default function AddCategoryContent({ updateItem, handleFullClose }) {
    return (
        <NewCategoryForm
            updateItem={updateItem}
            handleFullClose={handleFullClose}
        />
    );
}
