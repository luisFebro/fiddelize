import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LocalMallIcon from '@material-ui/icons/LocalMall';
import { muStyle } from '../../../../../components/buttons/material-ui/ButtonFab';
import { faStyle } from '../../../../../components/buttons/material-ui/ButtonMulti';
import { default as YesNoModalBtn } from './modal/modal-conf-yes-no/ModalBtn';
import { default as DiscountModalBtn } from "./modal/modal-text-field/ModalBtn";
import { default as FullModalBtn } from "./modal/modal-full-screen/ModalBtn";
import { useStoreState } from 'easy-peasy';
import ClientProfile from './modal-content-pages/ClientProfile';
import defineCurrChallenge from '../../../../../utils/biz/defineCurrChallenge';
import getFirstName from '../../../../../utils/string/getFirstName';
import PurchaseHistoryBtn from '../../../../mobile-app/history-purchase-btn/PurchaseHistoryBtn';

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
    const totalPrizes = data.clientUserData && data.clientUserData.totalPurchasePrize;
    let totalActiveScore = data.clientUserData && data.clientUserData.totalActiveScore;
    const totalGeneralScore = data.clientUserData && data.clientUserData.totalGeneralScore;
    if(!totalActiveScore) { totalActiveScore = totalGeneralScore };
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
                    subTitle: null,
                    labelTxtField: "Valor para ser descontado:",
                    txtBtn: "Descontar",
                    iconBtn: <FontAwesomeIcon icon="minus-circle" />,
                    userCurrScore: currScore,
                    name: data.name.cap(),
                    rewardScore: rewardScore,
                    userId: data._id,
                    totalPrizes,
                    totalActiveScore,
                }}
            />
        </div>
    );
};

const ShowHistoryBtn = ({ data }) => {
    const { name, _id, clientUserData } = data;
    const { totalGeneralScore, totalPurchasePrize, currScore } = clientUserData;

    const getModalData = () => ({
        cliUserName: name,
        cliUserId: _id,
        currUserScore: currScore,
        totalGeneralScore,
        totalPurchasePrize,
    });

    const modalData = getModalData();

    return(
        <PurchaseHistoryBtn
            from="clientsHistory"
            modalData={modalData}
        />
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
                <ShowHistoryBtn data={data} />
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