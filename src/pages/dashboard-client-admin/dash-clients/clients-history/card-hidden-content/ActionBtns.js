import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getFirstName from "utils/string/getFirstName";
import { useBizData } from "init";
import { default as YesNoModalBtn } from "./modal/modal-conf-yes-no/ModalBtn";
import { default as FullModalBtn } from "./modal/modal-full-screen/ModalBtn";
import ClientProfile from "./modal-content-pages/ClientProfile";
import PurchaseHistoryBtn from "./history-purchase-btn/PurchaseHistoryBtn";

const isSmall = window.Helper.isSmallScreen();

export default function ActionBtns({ data }) {
    const { bizPlanData } = useBizData();
    const isPro = bizPlanData && bizPlanData.isPro;

    return (
        <section>
            {showBlobActionBtns(data)}
            {showDeleteBtn(data, isPro)}
            <style jsx global>
                {`
                    .title-blob-action {
                        font-size: 0.5em;
                    }
                    .star-blob-medium {
                        font-size: 3em;
                    }
                `}
            </style>
        </section>
    );
}

const ShowHistoryBtn = ({ data, isFromDashboard = true }) => {
    const { name, _id, clientUserData } = data;

    const getModalData = () => ({
        cliUserFirstName: getFirstName(name && name.cap()),
        cliUserId: _id,
        totalGeneralPoints: clientUserData.totalGeneralPoints,
        isStaff: true,
    });

    const modalData = getModalData();

    return <PurchaseHistoryBtn {...modalData} />;
};

const showProfileBtn = (data) => (
    <div>
        <FullModalBtn
            button={{
                iconFontAwesome: <FontAwesomeIcon icon="user" />,
                backgroundColor: "var(--themeSDark)",
                title: "Ver Perfil",
                variant: "extended",
                position: "relative",
                size: "medium",
            }}
            modalData={{
                title: "&#187; Perfil do Cliente",
                subTitle: (
                    <p>
                        <span className="font-weight-bold text-normal">
                            • NOME:
                        </span>
                        <br />
                        {data.name && data.name.cap()},
                    </p>
                ),
                componentContent: <ClientProfile data={data} />,
            }}
        />
    </div>
);

const showBlobActionBtns = (data) => (
    <main className="text-white container-center flex-column blob-action-btns--root">
        <p
            className="mb-5 position-relative text-center text-title text-shadow"
            style={{ top: "40px" }}
        >
            <FontAwesomeIcon icon="star" className="title-blob-action" /> Ações
        </p>
        <section className={`container-center ${isSmall && "flex-column"}`}>
            <div className="blob-action-btn--root history-btn position-relative">
                <ShowHistoryBtn data={data} />
            </div>
            <div className="position-relative blob-action-btn--root">
                {showProfileBtn(data)}
            </div>
        </section>
    </main>
);

function showDeleteBtn(data, isPro) {
    const handleSubtitle = () => {
        const target = "cliente";
        const defaultChunk = `Confirmado a exclusão de: <strong>${data.name.cap()}</strong> ?`;
        let custom = `<br /><strong>1 crédito</strong> do ${target} removido será adicionado de volta ao seu saldo em créditos`;
        if (!isPro)
            custom =
                "Na versão grátis, créditos não são restaurados. Atualize para um <strong>plano pro</strong> para restaurar créditos";

        return `Créditos Restauráveis: ${custom}<br /><br />${defaultChunk}`;
    };

    return (
        <div className="animated zoomIn mt-5">
            <YesNoModalBtn
                button={{
                    iconFontAwesome: <FontAwesomeIcon icon="trash-alt" />,
                    backgroundColor: "var(--expenseRed)",
                    title: "excluir",
                    variant: "extended",
                    position: "relative",
                    size: "small",
                }}
                modalData={{
                    title: "Exclusão de Cliente",
                    subTitle: handleSubtitle(),
                    itemData: data,
                    isPro,
                }}
                setRun={null}
                run={null}
            />
        </div>
    );
}
