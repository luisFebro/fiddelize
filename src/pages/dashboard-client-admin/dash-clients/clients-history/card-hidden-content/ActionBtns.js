import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStoreState } from "easy-peasy";
import { default as YesNoModalBtn } from "./modal/modal-conf-yes-no/ModalBtn";
import { default as FullModalBtn } from "./modal/modal-full-screen/ModalBtn";
import ClientProfile from "./modal-content-pages/ClientProfile";
import PurchaseHistoryBtn from "../../../../mobile-app/history-purchase-btn/PurchaseHistoryBtn";

const isSmall = window.Helper.isSmallScreen();

const Div = styled.div`
    .title-blob-action {
        font-size: 0.5em;
    }
    .star-blob-medium {
        font-size: 3em;
    }
`;

export default function ActionBtns({ data, needBadgeForTestMode }) {
    return (
        <Div cssProps={{ compName: null }}>
            {showBlobActionBtns(data)}
            {showDeleteBtn(data, needBadgeForTestMode)}
        </Div>
    );
}

const ShowHistoryBtn = ({ data, isFromDashboard = true }) => {
    const { name, _id, clientUserData } = data;
    const {
        totalGeneralPoints,
        totalPurchasePrize,
        currPoints,
    } = clientUserData;

    const getModalData = () => ({
        cliUserName: name,
        cliUserId: _id,
        currUserScore: currPoints,
        totalGeneralPoints,
        totalPurchasePrize,
        isFromDashboard,
    });

    const modalData = getModalData();

    return <PurchaseHistoryBtn from="clientsHistory" modalData={modalData} />;
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
                <p className="star position-absolute star-align">
                    <FontAwesomeIcon
                        icon="star"
                        className="star-blob-medium animated rotateIn fast delay-5s"
                    />
                </p>
                <ShowHistoryBtn data={data} />
            </div>
            <div className="position-relative blob-action-btn--root">
                <p className="star position-absolute star-align">
                    <FontAwesomeIcon
                        icon="star"
                        className="star-blob-medium animated rotateIn fast delay-5s"
                    />
                </p>
                {showProfileBtn(data)}
            </div>
        </section>
    </main>
);

const showDeleteBtn = (data, needBadgeForTestMode) =>
    !needBadgeForTestMode && (
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
                    title: "Confirmação<br />de Exclusão de Cliente",
                    subTitle: `Nota: o crédito usado não é reutilizado. Confirmado a exclusão de:<br /><strong>${data.name.cap()}</strong> ?`,
                    itemData: data,
                }}
                setRun={null}
                run={null}
            />
        </div>
    );
