import { Fragment, useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectField from "components/fields/SelectField";
import ModalYesNo from "components/modals/ModalYesNo";

export default function MarkBtn({ socket, adminId }) {
    const [fullOpen, setFullOpen] = useState(false);
    const [data, setData] = useState({
        markOpt: "queue",
    });
    const { markOpt } = data;

    const runYes = async () => {
        // save data here
        const socketData = { newStage: markOpt, adminId };
        if (socket) socket.emit("updateCustomerOrderStage", socketData);
        setData((prev) => ({ ...prev, markOpt: null }));
        // showToast(`Assunto ${subject} finalizado com sucesso!`, {
        //     type: "success",
        // });
    };

    const showSelect = () => {
        const valuesArray = [
            { val: "queue", showVal: "Fila" },
            { val: "preparing", showVal: "Preparando" },
            { val: "done", showVal: "Feito" },
            { val: "canceled", showVal: "Cancelado" },
        ];

        const handleSelected = (select) => {
            if (!select) return;

            setData((prev) => ({
                ...prev,
                markOpt: select,
            }));
        };

        return (
            <div className="mt-3">
                <SelectField
                    valuesArray={valuesArray}
                    handleValue={handleSelected}
                    needSetTitle={false}
                    firstDefault
                />
            </div>
        );
    };

    return (
        <Fragment>
            <div className="position-relative">
                <p
                    className="text-pill position-absolute text-white text-shadow text-em-0-8"
                    style={{
                        top: -15,
                        right: 10,
                    }}
                >
                    Estágio: {handleStage(markOpt)}
                </p>
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
                    position="absolute"
                    top={15}
                    right={5}
                    variant="extended"
                    size="medium"
                />
            </div>
            {fullOpen && (
                <ModalYesNo
                    title="Marcar pedido como:"
                    subTitle=""
                    fullOpen={fullOpen}
                    setFullOpen={setFullOpen}
                    actionFunc={runYes}
                    needIndex={false}
                    contentComp={
                        <div className="container-center">{showSelect()}</div>
                    }
                    yesBtnColor="green"
                    yesBtnIcon="check"
                />
            )}
        </Fragment>
    );
}

// HELPERS
function handleStage(stage) {
    if (stage === "queue") return "Fila";
    if (stage === "preparing") return "Preparando"; // if curr is preparing which means the next ready to be selected
    return "Feito";
}
// END HELPERS
