import { useState } from "react";
import useScrollUp from "hooks/scroll/useScrollUp";
import useBackColor from "hooks/useBackColor";
import useData from "init";
import SelectField from "components/fields/SelectField";

export default function Support() {
    const [data, setData] = useState({
        subject: null,
        success: false,
    });

    useScrollUp();
    useBackColor("var(--themeP)");
    const { role, firstName } = useData();

    const showSubjectSelectField = () => {
        const defaultVal = "Selecione assunto:";
        const valuesArray = [
            { val: "question", showVal: "Dúvida" },
            { val: "suggestion", showVal: "Sugestão ou Ideia" },
            { val: "usageHelp", showVal: "Ajuda de uso" },
            { val: "bugReport", showVal: "Relatar falha" },
            { val: "compliment", showVal: "Elogio" },
            { val: "others", showVal: "Outros" },
        ];

        const handleSelectValue = (val) => {
            if (!val || val === defaultVal) return;

            const { showVal } = valuesArray.find((elem) => elem.val === val);
            setData({
                subject: showVal,
                success: true,
            });
        };

        return (
            <SelectField
                title={defaultVal}
                valuesArray={valuesArray}
                handleValue={handleSelectValue}
            />
        );
    };

    return (
        <section>
            <h1 className="my-5 text-shadow text-white">
                <img
                    className="img-center"
                    src="/img/logo.png"
                    alt="fiddelize logo"
                    height="auto"
                    width="100px"
                />
                <p className="mt-3 text-subtitle font-weight-bold text-center">
                    Suporte Fiddelize
                </p>
                <p className="text-normal mx-3">
                    Possui alguma dúvida, uma sugestão, ou precisa de ajuda com
                    o seu app? Estamos aqui para te ajudar
                    {firstName ? `, ${firstName}` : ""}!
                </p>
            </h1>
            {showSubjectSelectField()}
            <div
                className="position-fixed"
                style={{
                    left: 0,
                    right: 0,
                    bottom: -30,
                }}
            >
                <img
                    width="100%"
                    height="auto"
                    style={{ overflow: "hidden" }}
                    src="/img/shapes/wave2.svg"
                    alt="onda"
                />
            </div>
        </section>
    );
}
