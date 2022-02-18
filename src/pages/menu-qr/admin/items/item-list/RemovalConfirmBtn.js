import { useState, Fragment } from "react";
import DeleteButton from "components/buttons/DeleteButton";
import ModalYesNo from "components/modals/ModalYesNo";
// import { Load } from "components/code-splitting/LoadableComp";
// import showToast from "components/toasts";

// const AsyncModalYesNo = Load({
//     loader: () =>
//         import(
//             "components/modals/ModalYesNo" /* webpackChunkName: "yes-no-modal-lazy" */
//         ),
// });

export default function RemovalConfirmBtn({
    dbItemlist = [],
    updateItem,
    bizId,
    selectionList,
    bizLinkName,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const totalItems = (selectionList && selectionList.length) || 0;

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const removeAll = async () => {
        const newItem = {
            // this newItem is being used here exclusively for sending data to DB
            adminId: bizId,
            type: "delete",
            removalItemIds: selectionList,
        };

        const getRemovalImgs = () => {
            const imgs = [];
            if (!dbItemlist.length) return null;
            dbItemlist.forEach((item) => {
                if (selectionList.includes(item.itemId)) {
                    imgs.push(item.img);
                }
            });

            return imgs;
        };

        return updateItem("delete", {
            newItem,
            removalImg: {
                savedImg: getRemovalImgs(),
                folder: "digital-menu",
            },
        });
    };

    return (
        <Fragment>
            <DeleteButton
                onClick={() => {
                    handleFullOpen();
                    // setFullOpen(false);
                    // return closeCategoryForm();
                }}
            />
            {fullOpen && (
                <ModalYesNo
                    title={`Tem certeza que deseja excluir ${totalItems} ${
                        totalItems === 1 ? "item" : "itens"
                    }`}
                    subTitle={null}
                    fullOpen={fullOpen}
                    setFullOpen={setFullOpen}
                    actionFunc={removeAll}
                />
            )}
        </Fragment>
    );
}
