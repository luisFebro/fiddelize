import { useState, useEffect, Fragment } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import useData, { useBizData } from "init";
import showToast from "components/toasts";
import getAPI, { readAllDbData } from "api";
import Img from "components/Img";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import CheckBoxForm from "components/CheckBoxForm";
// import ButtonDropdown from "components/buttons/material-ui/ButtonDropdown";

const dbData = {
    users: {
        dbModelName: "user",
    },
};

export default function BackUpToExcel() {
    const [data, setData] = useState({
        dbDataList: [],
        brDbName: "",
        dbModelName: "",
        selectedButton: "SELECIONE BOTÃO",
        isLoading: false,
        securityAlertOn: false, // use agreed with security text
    });
    const {
        securityAlertOn,
        dbDataList,
        selectedButton,
        dbModelName,
        brDbName,
        isLoading,
    } = data;

    const isArrayReady = dbDataList.length !== 0;

    const [adminId] = useData(["userId"]);
    const { bizLinkName } = useBizData();

    const switchLoading = (status) => {
        setData((prev) => ({
            ...prev,
            isLoading: status,
        }));
    };

    const handleSubmit = async () => {
        const params = {
            modelName: dbModelName,
            thisRole: "cliente-admin",
        };

        switchLoading(true);
        const allDbData = await getAPI({
            url: readAllDbData(adminId),
            params,
            fullCatch: true,
        }).catch((err) => {
            switchLoading(false);
            if (err.status === 404) {
                showToast(err.data.error, { type: "error" });
            }
            if (err.status !== 200) {
                showToast("Ocorreu um erro ao carregar dados de clientes", {
                    type: "error",
                });
            }
        });
        if (!allDbData) return null;

        return setData({
            ...data,
            dbDataList: allDbData,
        });
        switchLoading(false);
    };

    useEffect(() => {
        if (adminId !== "..." && selectedButton !== "SELECIONE BOTÃO") {
            handleSubmit(adminId);
        }
    }, [selectedButton, adminId]);

    const showExcelDownloadBtn = () => (
        <div className="my-3">
            <ReactHTMLTableToExcel
                id=""
                className={
                    selectedButton === "SELECIONE BOTÃO" || isLoading
                        ? "d-none"
                        : `${
                              !securityAlertOn ? "" : "text-voca-cyan theme-p"
                          } MuiButtonBase-root MuiFab-root MuiFab-extended text-normal font-weight-bold ${
                              isArrayReady && !securityAlertOn
                                  ? "disabledLink"
                                  : ""
                          }`
                }
                table={brDbName} // file`s name
                filename={brDbName}
                sheet={`${brDbName} - dados`}
                buttonText={isLoading ? "CARREGANDO..." : "BAIXAR CÓPIA"}
            />
            <table id={brDbName} className="d-none">
                <thead>
                    <tr>
                        {isArrayReady &&
                            dbDataList.fields.map((field, ind) => (
                                <th key={ind}>{field}</th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {dbDataList.length !== 0 &&
                        dbDataList.docs.map((doc, ind) => (
                            <tr key={ind}>
                                {dbDataList.fields.map((field, ind) => (
                                    <td key={ind}>{doc[field]}</td>
                                ))}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );

    const onSelectedValue = (value) => {
        if (value !== "SELECIONE BOTÃO") {
            const model = "users";
            setData({
                ...data,
                selectedButton: value,
                brDbName: `clientes-da-${bizLinkName}`,
                dbModelName: dbData[model].dbModelName,
            });
        }
    };

    const showActionBtn = () => (
        <Fragment>
            <ButtonFab
                title={isLoading ? "Solicitando..." : "Solicitar Cópia"}
                backgroundColor="var(--themeSDark--default)"
                onClick={() => onSelectedValue("users")}
                position="relative"
                variant="extended"
                size="large"
            />
        </Fragment>
    );

    const handleChecked = (status) => {
        setData({
            ...data,
            securityAlertOn: status,
        });
    };

    const showAgreementAndBtn = () => (
        <Fragment>
            <section className="mt-5 text-small text-purple mx-3">
                <h2 className="text-center text-normal font-weight-bold">
                    Acordo de Segurança
                </h2>
                <p>
                    <strong>Sua solicitação foi autorizada!</strong> Mas antes
                    de baixar o arquivo, leia atentamente sobre a segurança dos
                    dados.
                </p>
                <p>
                    A Fiddelize prioriza a segurança dos dados com criptografia.
                    No caso das cópias de segurança, os dados são
                    excepcionalmente descriptografados após ter verificado que
                    seu <strong>acesso é autêntico</strong> como admin.
                </p>
                <p>
                    É dado o <strong>direito exclusivo</strong> para os admins
                    de ter acesso aos dados dos seus clientes ao usar os apps na
                    plataforma da Fiddelize.
                </p>
                <p>Ao baixar o arquivo, você concarda que:</p>
                <p>
                    {" "}
                    - Usará o arquivo de <strong>forma privada</strong> e apenas
                    para{" "}
                    <strong>fins informativos ou transferência de dados</strong>{" "}
                    para seu sistema comercial.
                </p>
                <p>
                    {" "}
                    - Após usar o arquivo,{" "}
                    <strong>vai excluí-lo do seu dispositivo</strong>. Afinal, o
                    arquivo vai ficar desatulizado logo. Você pode baixar a
                    versão mais atual voltando aqui.
                </p>
                <p>
                    {" "}
                    - <strong>Evitar de enviar ou compartilhar</strong> o
                    arquivo por quaisquer meios de comunicação online: email,
                    chats, ou outros meios que permitam o envio e armazenamento
                    de arquivos.
                </p>
                <CheckBoxForm
                    text="concordo com as condições de uso"
                    setIsBoxChecked={handleChecked}
                />
            </section>
            {showExcelDownloadBtn()}
            {!isArrayReady && (
                <p className="animated fadeInUp delay-2s text-small font-weight-bold mx-3 text-grey my-3">
                    Pode levar alguns instantes...
                    <br />
                    depende da sua conexão de internet ou tamanho de clientes
                    cadastrados.
                </p>
            )}
        </Fragment>
    );

    return (
        <div className="mt-5 container-center-col">
            <Img
                className="img-fluid"
                src="/img/icons/backup-excel.svg"
                offline
                width={120}
                height="auto"
                alt="ícone excel"
            />
            <p className="text-center text-normal font-weight-bold">
                Se precisar, faça aqui a cópia de dados mais recente dos seus
                clientes
            </p>
            {isArrayReady ? showAgreementAndBtn() : showActionBtn()}
        </div>
    );
}

/* ARCHIVES

function handleDbSelection(selectedButton) {
    switch (selectedButton) {
        case "GERAR DADOS - CLIENTES":
            return "users";
        default:
            console.log("none selected");
    }
};

const showDropDownBtn = () => (
    <span className="position-relative my-4">
        <ButtonDropdown
            dropdown={{
                titleOptions: ["SELECIONE BOTÃO", "GERAR DADOS - CLIENTES"],
            }}
            onSelectedValue={(value) => onSelectedValue(value)}
        />
    </span>
);
 */
