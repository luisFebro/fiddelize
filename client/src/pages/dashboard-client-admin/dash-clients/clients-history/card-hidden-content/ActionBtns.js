import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LocalMallIcon from '@material-ui/icons/LocalMall';
import { muStyle } from '../../../../../components/buttons/material-ui/ButtonFab';
import { faStyle } from '../../../../../components/buttons/material-ui/ButtonMulti';
import { default as YesNoModalBtn } from './modal/modal-conf-yes-no/ModalBtn';
import { default as DiscountModalBtn } from "./modal/modal-text-field/ModalBtn";
import { default as FullModalBtn } from "./modal/modal-full-screen/ModalBtn";
import { default as FullModalBtnHistory } from "./modal/modal-full-screen_history/ModalBtn";
import { useStoreState } from 'easy-peasy';
import ClientProfile from './modal-content-pages/ClientProfile';
import PurchaseHistory from './modal-content-pages/PurchaseHistory';
import defineCurrChallenge from './helpers/defineCurrChallenge';
import getFirstName from '../../../../../utils/string/getFirstName';

const isSmall = window.Helper.isSmallScreen();

const Div = styled.div`
    .title-blob-action {
        font-size: .5em;
    }
    .star-blob-medium {
        font-size: 3em;
    }
`;

export default function ActionBtns({ data, needBadgeForTestMode }) {
    const { clientAdminData } = useStoreState(state => ({
        clientAdminData: state.userReducer.cases.clientAdmin
    }))

    return (
        <Div
            cssProps={{compName: null}}
        >
            {showBlobActionBtns(data, clientAdminData)}
            {showDeleteBtn(data, needBadgeForTestMode)}
        </Div>
    );
}

const showDiscountBtn = (data, clientAdminData) => {
    const currScore = data.clientUserData && data.clientUserData.currScore;
    const rewardScore = clientAdminData.rewardScore;
    return(
        <div>
            <DiscountModalBtn
                button={{
                    iconFontAwesome: <FontAwesomeIcon icon="minus-circle" />,
                    backgroundColor: 'var(--themeSDark)',
                    title: "Descontar Pontos",
                    variant: 'extended',
                    position: 'relative',
                    size: "large",
                }}
                modalData={{
                    title: "Desconto de Pontos<br />do Cliente",
                    subTitle: currScore >= rewardScore
                    ? `Esse cliente chegou lá!<br />${data.name.cap()}<br />ATINGIU a meta de ${rewardScore} Pontos 🎉`
                    : `Cliente<br />${data.name.cap()}<br/>ainda NÃO ATINGIU a meta de ${rewardScore} Pontos`,
                    labelTxtField: "Valor para ser descontado:",
                    txtBtn: "Descontar",
                    iconBtn: <FontAwesomeIcon icon="minus-circle" />,
                    userCurrScore: currScore,
                    rewardScore: rewardScore,
                    userId: data._id,
                }}
            />
        </div>
    );
};
// NEed change to database structure
const showHistoryBtn = data => {
    const challengeN = defineCurrChallenge(data.clientUserData.totalPurchasePrize);
    // This structure is required because both cliuser and cliadmin have access to this component.
    const dataToSendModal = {
        _id: data._id,
        name: data.name,
        clientUserData: {
            purchaseHistory: data.clientUserData.purchaseHistory,
        },
        totalGeneralScore: data.clientUserData.totalGeneralScore,
        totalPurchasePrize: data.clientUserData.totalPurchasePrize,
    }
    return(
        <div>
            <FullModalBtnHistory
                button={{
                    iconMu: <LocalMallIcon style={muStyle} />,
                    backgroundColor: 'var(--themeSDark)',
                    title: "Ver Histórico",
                    variant: 'extended',
                    position: 'relative',
                    size: "medium",
                }}
                modalData={{
                    title: `&#187; Histórico de<br />Compras ${challengeN ? `de ${data && data.name && getFirstName(data.name)}` : ""}`,
                    subTitle: null,
                    componentContent: <PurchaseHistory data={dataToSendModal} />,
                    challengeN: challengeN,
                    currUserScore: data.clientUserData.currScore,
                    userName: data.name,
                    totalGeneralScore: dataToSendModal && dataToSendModal.totalGeneralScore,
                }}
            />
        </div>
    );
}

const showProfileBtn = data => (
    <div>
        <FullModalBtn
            button={{
                iconFontAwesome: <FontAwesomeIcon icon="user" />,
                backgroundColor: 'var(--themeSDark)',
                title: "Ver Perfil",
                variant: 'extended',
                position: 'relative',
                size: "medium",
            }}
            modalData={{
                title: "&#187; Perfil do Cliente",
                subTitle: <p><span className="font-weight-bold text-normal">• NOME:</span><br/>{data.name && data.name.cap()},</p>,
                componentContent: <ClientProfile data={data} />,
            }}
        />
    </div>
);

const showBlobActionBtns = (data, clientAdminData) => (
    <main className="text-white container-center flex-column blob-action-btns--root">
        <p className="position-relative text-center text-title text-shadow" style={{top: '40px'}}>
            <FontAwesomeIcon icon="star" className="title-blob-action" /> Ações
        </p>
        <div className="blob-action-btn--root position-relative">
            <p className="star position-absolute">
                <FontAwesomeIcon icon="star" className="star-blob-medium animated rotateIn fast delay-4s" />
            </p>
            {showDiscountBtn(data, clientAdminData)}
        </div>
        <section className={`container-center ${isSmall && "flex-column"}`}>
            <div className="blob-action-btn--root history-btn position-relative">
                <p className="star position-absolute star-align">
                    <FontAwesomeIcon icon="star" className="star-blob-medium animated rotateIn fast delay-5s" />
                </p>
                {showHistoryBtn(data)}
            </div>
            <div className="position-relative blob-action-btn--root">
                <p className="star position-absolute star-align">
                    <FontAwesomeIcon icon="star" className="star-blob-medium animated rotateIn fast delay-5s" />
                </p>
                {showProfileBtn(data)}
            </div>
        </section>
    </main>
);

const showDeleteBtn = (data, needBadgeForTestMode) => (
    !needBadgeForTestMode &&
    <div className="animated zoomIn mt-5">
        <YesNoModalBtn
            button={{
                iconFontAwesome: <FontAwesomeIcon icon="trash-alt" />,
                backgroundColor: 'var(--expenseRed)',
                title: "excluir",
                variant: 'extended',
                position: 'relative',
                size: "small",
            }}
            modalData={{
                title: `Confirmação<br />de Exclusão de Cliente`,
                subTitle: `Confirmado a exclusão de:<br /><strong>${data.name.cap()}</strong> ?`,
                itemData: data,
            }}
            setRun={null}
            run={null}
        />
    </div>
);