import { useState, Fragment } from "react";
import HideButton from "components/buttons/HideButton";
import ModalYesNo from "components/modals/ModalYesNo";
// import { Load } from "components/code-splitting/LoadableComp";
// import showToast from "components/toasts";

// const AsyncModalYesNo = Load({
//     loader: () =>
//         import(
//             "components/modals/ModalYesNo" /* webpackChunkName: "yes-no-modal-lazy" */
//         ),
// });

export const updateHideItems = async ({
    updateItem,
    needHide,
    selectionList,
    bizId,
}) => {
    const newItem = {
        // this newItem is being used here exclusively for sending data to DB
        adminId: bizId,
        type: "updateMany",
        hideItemIds: selectionList,
        updateQuery: { isHidden: needHide },
    };

    return updateItem("update", {
        newItem,
    });
};

export default function HideConfirmBtn({
    updateItem,
    bizId,
    selectionList,
    needHide,
    // bizLinkName,
    // dbItemlist = [],
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const totalItems = (selectionList && selectionList.length) || 0;

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const itemPluralTxt = totalItems === 1 ? "item" : "itens";
    const isPlural = totalItems > 1;

    const updateAll = async () =>
        await updateHideItems({
            updateItem,
            bizId,
            selectionList,
            needHide,
        });

    const handleTxtHide = () => {
        if (isPlural)
            return `${totalItems} itens serão escondidos para seus clientes porque esgotaram ou não disponíveis`;
        return "1 item será escondido automaticamente para seus clientes porque esgotou ou não disponível";
    };

    const handleTxtVisible = () => {
        if (isPlural)
            return `${totalItems} itens ficarão visíveis para seus clientes`;
        return "1 item ficará visível para seus clientes";
    };

    return (
        <Fragment>
            <HideButton
                iconHidden={needHide}
                onClick={() => {
                    handleFullOpen();
                    // setFullOpen(false);
                    // return closeCategoryForm();
                }}
            />
            {fullOpen && (
                <ModalYesNo
                    title={`${
                        needHide
                            ? `Esconder ${itemPluralTxt} selecionado${
                                  isPlural ? "s" : ""
                              }?`
                            : `Tornar disponível ${itemPluralTxt} selecionado${
                                  isPlural ? "s" : ""
                              }?`
                    }`}
                    subTitle={needHide ? handleTxtHide() : handleTxtVisible()}
                    yesTitle={needHide ? "Esconder" : "Tornar disponível"}
                    yesBtnIcon="check"
                    yesBtnColor="var(--themeP)"
                    noTitle="voltar"
                    fullOpen={fullOpen}
                    setFullOpen={setFullOpen}
                    actionFunc={updateAll}
                />
            )}
        </Fragment>
    );
}
