import { Fragment, useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectField from "components/fields/SelectField";
import ModalYesNo from "components/modals/ModalYesNo";
import showToast from "components/toasts";

export default function MarkBtn({ socket, adminId, placeId, customerId }) {
    const [fullOpen, setFullOpen] = useState(false);
    const [data, setData] = useState({
        markOpt: "queue",
    });
    const { markOpt } = data;

    const showSelect = () => {
        const valuesArray = [
            { val: "queue", showVal: "Fila" },
            { val: "preparing", showVal: "Preparo" },
            { val: "done", showVal: "Feito" },
        ];

        const handleSelected = (select) => {
            if (!select) return;

            setData((prev) => ({
                ...prev,
                markOpt: select,
            }));

            const isDone = select === "done";
            if (isDone)
                showToast(`Pedido do lugar ${placeId} movido para feito`, {
                    dur: 3000,
                    type: "success",
                });
            const socketData = {
                adminId,
                placeId,
                customerId,
                "order.stage": select,
            };
            if (socket) {
                const notifData = {
                    stage: select,
                };
                socket.emit("updateCustomerOrder", socketData, notifData);
                if (isDone) socket.emit("updateAdminList");
            }
            if (select !== markOpt) setFullOpen(false);
        };

        return (
            <div className="mt-3">
                <SelectField
                    valuesArray={valuesArray}
                    handleValue={handleSelected}
                    needSetTitle={false}
                    defaultValue={markOpt}
                />
            </div>
        );
    };

    return (
        <Fragment>
            <div
                style={{
                    position: "absolute",
                    bottom: -20,
                    right: 5,
                }}
            >
                <ButtonFab
                    title="Marcar"
                    iconFontAwesome={
                        <FontAwesomeIcon
                            icon="check"
                            style={{
                                fontSize: "20px",
                                filter: "drop-shadow(.5px .5px 1.5px grey)",
                                color: "white",
                            }}
                        />
                    }
                    backgroundColor="var(--themeSDark)"
                    onClick={() => setFullOpen(true)}
                    position="relative"
                    variant="extended"
                    size="medium"
                />
            </div>
            <p
                className="text-pill position-absolute text-white text-shadow text-em-0-8"
                style={{
                    bottom: -25,
                    right: 160,
                    backgroundColor: selectStageColor(markOpt),
                }}
            >
                Estágio: {handleStage(markOpt)}
            </p>
            {fullOpen && (
                <ModalYesNo
                    title="Marcar estágio pedido como:"
                    subTitle=""
                    fullOpen={fullOpen}
                    setFullOpen={setFullOpen}
                    actionFunc={null}
                    needIndex
                    needCTAs={false}
                    contentComp={
                        <div className="container-center">{showSelect()}</div>
                    }
                />
            )}
        </Fragment>
    );
}

// HELPERS
function handleStage(stage) {
    if (stage === "queue") return "Fila";
    if (stage === "preparing") return "Preparo"; // if curr is preparing which means the next ready to be selected
    return "Feito";
}
function selectStageColor(stage) {
    if (stage === "queue") return "#87870a";
    if (stage === "preparing") return "orange"; // if curr is preparing which means the next ready to be selected
    return "green";
}
// END HELPERS
