import { Fragment, useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import TextField from "@material-ui/core/TextField";
import handleChange from "utils/form/use-state/handleChange";
import showToast from "components/toasts";
import { Load } from "components/code-splitting/LoadableComp";
import ModalFullContent from "components/modals/ModalFullContent";

const AsyncCategoryList = Load({
    loader: () =>
        import(
            "../../item-list/CategoryList" /* webpackChunkName: "item-list-page-lazy" */
        ),
});

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    fieldForm: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        // zIndex: 2000,
        font: "normal 1em Poppins, sans-serif",
    },
    helperFromField: {
        color: "grey",
        fontFamily: "Poppins, sans-serif",
        fontSize: isSmall ? ".8em" : ".6em",
    },
});

export default function NewCategoryForm({ handleFullClose }) {
    const [fullOpen, setFullOpen] = useState(false);
    const [data, setData] = useState({
        category: null,
        errorCategory: false,
    });
    const { category, errorCategory } = data;

    const styles = getStyles();

    const switchError = (error) => {
        setData((prev) => ({ ...prev, ...error }));
    };
    const addCategory = async () => {
        if (!category) {
            return showToast("Insira o nome da categoria", { type: "error" });
        }

        setFullOpen(true);
    };

    const showForm = () => (
        <Fragment>
            <form
                style={{
                    margin: "auto",
                    width: "100%",
                    backgroundColor: "var(--mainWhite)",
                    color: "var(--themeP)",
                }}
                className="text-p text-normal py-3"
                onFocus={() =>
                    switchError({
                        errorCategory: false,
                    })
                }
            >
                <div id="field1" className="mx-2 mt-3">
                    <span className="font-weight-bold">Nome Categoria:</span>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        error={errorCategory}
                        name="category"
                        variant="standard"
                        value={category}
                        type="text"
                        autoComplete="off"
                        fullWidth
                        InputProps={{
                            style: styles.fieldForm,
                            id: "value4",
                        }}
                    />
                </div>
                <section className="container-center my-3">
                    <ButtonFab
                        title="adicionar"
                        backgroundColor="var(--themeSDark"
                        onClick={addCategory}
                        position="relative"
                        variant="extended"
                        size="large"
                    />
                </section>
            </form>
            {fullOpen && (
                <ModalFullContent
                    contentComp={
                        <AsyncCategoryList
                            category={category}
                            isAddCategory
                            setFullOpen={setFullOpen}
                            closeCategoryForm={handleFullClose}
                        />
                    }
                    fullOpen={fullOpen}
                    setFullOpen={setFullOpen}
                    zIndex={3000}
                />
            )}
        </Fragment>
    );

    return <Fragment>{showForm()}</Fragment>;
}

/*
const showFloatCTA = () => (
        <div
            className="position-fixed animated fadeInUp delay-2s"
            style={{
                bottom: 15,
                right: 15,
            }}
        >
            <ButtonFab
                title="Salvar"
                backgroundColor={`var(--themeSDark--${sColor})`}
                onClick={addCategory}
                position="relative"
                variant="extended"
                size="large"
            />
        </div>
    );
 */
