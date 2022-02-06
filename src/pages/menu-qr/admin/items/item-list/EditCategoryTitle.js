import { useState, useEffect, Fragment } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import EditButton from "components/buttons/EditButton";
import Field from "components/fields";
import { useBizData } from "init";

export default function EditCategoryTitle({ thisCat = "", updateItem }) {
    const [data, setData] = useState({
        category: "",
        openField: false,
    });
    const { category, openField } = data;
    const { bizId } = useBizData();

    useEffect(() => {
        if (thisCat) setData((prev) => ({ ...prev, category: thisCat }));
    }, [thisCat]);

    const handleNewCategory = () => {
        setData((prev) => ({ ...prev, openField: false }));
        updateItem("update", {
            newItem: {
                adminId: bizId,
                type: "updateMany",
                categoryUpdate: {
                    oldCategory: thisCat,
                    newCategory: category,
                },
            },
            newCategory: category,
            oldCategory: thisCat,
            needReload: false,
        });
    };

    return (
        <h2 className="text-normal text-purple">
            {openField
                ? "Altere o nome da categoria:"
                : "Selecione itens para categoria:"}{" "}
            {!openField ? (
                <Fragment>
                    <span className="text-subtitle font-weight-bold">
                        {category}{" "}
                        {thisCat !== "gerais" && thisCat !== "Gerais" && (
                            <EditButton
                                onClick={() =>
                                    setData((prev) => ({
                                        ...prev,
                                        openField: true,
                                    }))
                                }
                            />
                        )}
                    </span>
                </Fragment>
            ) : (
                <span className="text-subtitle font-weight-bold">
                    <Field
                        autoFocus
                        textAlign="text-center"
                        size="medium"
                        name="category"
                        value={category}
                        onChangeCallback={setData}
                    />
                    <div className="d-flex justify-content-end ml-3">
                        <ButtonFab
                            title="salvar"
                            backgroundColor="var(--themeSDark)"
                            onClick={handleNewCategory}
                            position="relative"
                            variant="extended"
                            size="medium"
                        />
                    </div>
                </span>
            )}
        </h2>
    );
}
