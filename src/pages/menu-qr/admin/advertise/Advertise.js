import { useState } from "react";
import { Link } from "react-router-dom";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import SelectField from "components/fields/SelectField";

export default function Advertise() {
    const [data, setData] = useState({
        markOpt: null,
        markPlaceId: null,
    });
    const { markOpt, markPlaceId } = data;

    const showSelect = () => {
        const valuesArray = [
            { val: "local", showVal: "Local" },
            { val: "online", showVal: "Online" },
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
                    title="Selecione forma divulgação:"
                    valuesArray={valuesArray}
                    handleValue={handleSelected}
                    needSetTitle={false}
                    defaultValue={markOpt}
                />
            </div>
        );
    };

    const showSelectPlaceId = () => {
        const valuesArray = [
            { val: "01", showVal: "01" },
            { val: "02", showVal: "02" },
            { val: "03", showVal: "03" },
            { val: "03", showVal: "03" },
            { val: "04", showVal: "04" },
            { val: "04", showVal: "04" },
            { val: "05", showVal: "05" },
            { val: "06", showVal: "06" },
            { val: "07", showVal: "07" },
            { val: "08", showVal: "08" },
            { val: "09", showVal: "09" },
            { val: "10", showVal: "10" },
            { val: "11", showVal: "11" },
            { val: "12", showVal: "12" },
            { val: "13", showVal: "13" },
            { val: "14", showVal: "14" },
            { val: "15", showVal: "15" },
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
                    defaultValue={markOpt}
                />
            </div>
        );
    };

    const showPrintServiceBtn = () => (
        <section>
            <p className="m-0 text-shadow">
                Quer ter menu impresso personalizado com seu código QR?
            </p>
            <div className="container-center mb-5">
                <Link className="no-text-decoration" to="/suporte">
                    <ButtonFab
                        title="Fale Conosco"
                        backgroundColor="var(--themeSDark)"
                        onClick={null}
                        position="relative"
                        variant="extended"
                        size="large"
                    />
                </Link>
            </div>
        </section>
    );

    return (
        <section className="mx-3 text-normal text-white">
            <div className="mb-5" style={{ marginTop: 150 }}>
                {showSelect()}
                <h2 className="text-subtitle">Selecione Id Lugar:</h2>
                {showSelectPlaceId()}
            </div>
            <div style={{ marginTop: 100 }} />
            {showPrintServiceBtn()}
        </section>
    );
}
