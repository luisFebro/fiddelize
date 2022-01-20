import { Fragment, useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectField from "components/fields/SelectField";
import ModalYesNo from "components/modals/ModalYesNo";

export default function MarkBtn() {
    const [fullOpen, setFullOpen] = useState(false);
    const [data, setData] = useState({
        markOpt: "done",
    });
    const { markOpt } = data;
    console.log("markOpt", markOpt);

    const runYes = async () => {
        // save data here
        setData((prev) => ({ ...prev, markOpt: null }));
        // showToast(`Assunto ${subject} finalizado com sucesso!`, {
        //     type: "success",
        // });
    };

    const showSelect = () => {
        const valuesArray = [
            { val: "done", showVal: "Feito" },
            { val: "canceled", showVal: "Cancelado" },
            // { val: "pending", showVal: "Pendente" },
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
                top={5}
                right={5}
                variant="extended"
                size="medium"
            />
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
