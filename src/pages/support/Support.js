import { useState, useEffect, Fragment } from "react";
import useScrollUp from "hooks/scroll/useScrollUp";
import useBackColor from "hooks/useBackColor";
import useData from "init";
import SelectField from "components/fields/SelectField";

import { Load } from "components/code-splitting/LoadableComp";

export const AsyncChat = Load({
    loader: () =>
        import(
            "components/chat/Chat" /* webpackChunkName: "history-chat-lazy" */
        ),
});

export default function Support() {
    const [data, setData] = useState({
        subject: null,
        subjectBr: null,
        selected: false,
        success: true,
    });
    const { success, selected } = data;

    useEffect(() => {
        if (!selected) return;
        setTimeout(() => {
            setData((prev) => ({ ...prev, success: true }));
        }, 2000);
    }, [selected]);

    useScrollUp();
    useBackColor("var(--themeP)");
    const { firstName } = useData();

    const showSubjectSelectField = () => {
        const defaultVal = "Selecione assunto:";
        const valuesArray = [
            { val: "question", showVal: "Dúvida" },
            { val: "suggestion", showVal: "Sugestão" },
            { val: "usageHelp", showVal: "Ajuda de uso" },
            { val: "bugReport", showVal: "Relatar falha" },
            { val: "compliment", showVal: "Elogio" },
            { val: "others", showVal: "Outros" },
        ];

        const handleSelectValue = (val) => {
            if (!val || val === defaultVal) return;

            const { showVal, val: originalVal } = valuesArray.find(
                (elem) => elem.val === val
            );
            setData((prev) => ({
                ...prev,
                subject: originalVal,
                subjectBr: showVal,
                selected: true,
            }));
        };

        return (
            <div className="col-md-6">
                <SelectField
                    title={defaultVal}
                    valuesArray={valuesArray}
                    handleValue={handleSelectValue}
                />
            </div>
        );
    };

    const showMain = () => (
        <section className="text-normal text-white">
            <h1 className="my-5">
                <img
                    className="img-center"
                    src="/img/logo.png"
                    alt="fiddelize logo"
                    height="auto"
                    width="100px"
                />
                <p className="mt-3 text-shadow text-white text-subtitle font-weight-bold text-center">
                    Suporte Fiddelize
                </p>
            </h1>
            <section className="mb-md-5 middle-area d-flex flex-column flex-md-row mx-3">
                <p className="col-md-6 text-shadow">
                    Possui alguma dúvida, uma sugestão, ou precisa de ajuda com
                    o seu app? Estamos aqui para te ajudar
                    {firstName ? `, ${firstName}` : ""}!
                </p>
                {showSubjectSelectField()}
            </section>
            {selected && (
                <div className="text-center mt-3 mb-5 animated fadeInUp text-shadow">
                    Iniciando...
                </div>
            )}
            <div
                className="d-block d-md-none position-relative"
                style={{
                    width: "100%",
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

    return (
        <Fragment>
            {success ? (
                <AsyncChat subject={data.subject} subjectBr={data.subjectBr} />
            ) : (
                showMain()
            )}
        </Fragment>
    );
}
