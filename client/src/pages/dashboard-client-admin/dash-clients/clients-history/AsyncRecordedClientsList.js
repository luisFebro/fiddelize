import React, { Fragment, useEffect, useState, useContext } from 'react';
import { calendar } from '../../../../utils/dates/dateFns';
import parse from 'html-react-parser';
import RegisteredClientsAccordion from './accordion/RegisteredClientsAccordion';
import PanelHiddenContent from './card-hidden-content/PanelHiddenContent';
import convertToReal from '../../../../utils/numbers/convertToReal';
import { useStoreDispatch } from 'easy-peasy';
import { updateUser } from '../../../../redux/actions/userActions';
import { showSnackbar } from '../../../../redux/actions/snackbarActions';
import Title from '../../../../components/Title';
import { useAppSystem, useProfile, useClientAdmin } from '../../../../hooks/useRoleData';
import useAPIList, { readUserList, getUniqueId } from '../../../../hooks/api/useAPIList';
// import { setRun } from '../../../../hooks/useRunComp';
import useElemDetection, { checkDetectedElem } from '../../../../hooks/api/useElemDetection';
import extractStrData from '../../../../utils/string/extractStrData';
import { Load } from '../../../../components/code-splitting/LoadableComp';
import NewsPanelBtn from './news-panel-btn/NewsPanelBtn';
import useElemShowOnScroll from '../../../../hooks/scroll/useElemShowOnScroll';
// import ClientsSearch from './search/ClientsSearch';

const AsyncFreeAccountsLimitMsg = Load({ loader: () => import('./AsyncFreeAccountsLimitMsg' /* webpackChunkName: "free-limit-msg-lazy" */)});
const AsyncShowIllustra = Load({ loader: () => import('./AsyncShowIllustra' /* webpackChunkName: "empty-illustra-comp-lazy" */)});
const Filters = Load({ loader: () => import('./search/Filters' /* webpackChunkName: "filters-comp-lazy" */)});

export default function AsyncRecordedClientsList() {
    const [skip, setSkip] = useState(0);
    const [trigger, setTrigger] = useState(false);
    const { businessId } = useAppSystem();
    const { name } = useProfile();
    const { bizPlan } = useClientAdmin();

    const showCTA = useElemShowOnScroll("#showNewCTA");

    const [data, setData] = useState({
        totalCliUserScores: 0,
        totalActiveScores: 0,
    });
    const { totalCliUserScores, totalActiveScores } = data;

    const dispatch = useStoreDispatch();

    // update current amount of accumulative and active scores from all cli-users of which cli-admin.
    // this is necessary so that we can have variables to gather these numbers sincedatabase just process them on the fly
    // useful for central admin to know the general scores from all cli-admins
    useEffect(() => {
        const objToSend = {
            "clientAdminData.totalClientUserScores": totalCliUserScores,
            "clientAdminData.totalActiveScores": totalActiveScores,
        }
        updateUser(dispatch, objToSend, businessId)
    }, [totalCliUserScores, totalActiveScores])

    const handleUpdateList = () => {
        const uniqueId = getUniqueId();
        setTrigger(uniqueId);
    }

    const params = { role: "cliente" };

    const {
        list,
        content,
        loading, ShowLoadingSkeleton,
        error, ShowError,
        needEmptyIllustra,
        hasMore,
        isOffline,
        listTotal,
        ShowOverMsg,
    } = useAPIList({
        url: readUserList(businessId),
        skip,
        params,
        trigger,
        listName: "recordedClientsList"
    })
    const detectedCard = useElemDetection({ loading, hasMore, setSkip, isOffline });

    useEffect(() => {
        if(content) {
            const {
                totalCliUserScores, // NEED IMPLEMENT IN BACKEND
                totalActiveScores
            } = extractStrData(content);
            setData({ ...data, totalCliUserScores, totalActiveScores });
        }
    }, [content])

    // Accordion Content
    const actions = list.map(user => {
        const { clientUserData: cliUser } = user;

        const handleSecHeading = user => (
            <div>
                <p
                    className="text-subtitle text-shadow font-weight-bold m-0 mt-4"
                    style={{ lineHeight: '19px' }}
                >
                    {!user.clientUserData.totalPurchasePrize
                    ? "• 0 Pontos"
                    : ` • ${convertToReal(user.clientUserData.currScore)} Pontos`}
                    {Boolean(user.clientUserData.totalPurchasePrize) && (
                        <Fragment>
                            <br />
                            <span className="text-small font-weight-bold">(Desafio Atual N.º {user.clientUserData.totalPurchasePrize + 1})</span>
                        </Fragment>
                    )}
                </p>
                <span
                    className="text-shadow text-normal font-weight-bold d-block m-0 mt-3"
                    style={{lineHeight: '20px'}}
                >
                    • Última compra:
                    <br />
                    {!(user.clientUserData && user.clientUserData.purchaseHistory && user.clientUserData.purchaseHistory[0])
                    ? <span className="text-small font-weight-bold">Sem data registrada.</span>
                    : (
                        <span className="text-small font-weight-bold">
                            {calendar(user.clientUserData.purchaseHistory[0].createdAt)}.
                        </span>
                    )}
                </span>
            </div>
        );

        const truncate = (name, leng) => window.Helper.truncate(name, leng);
        const isTestMode = name === user.name.cap();
        const needCliPrizes = cliUser.totalPurchasePrize; // 0 by default.

        return({
           _id: user._id,
           mainHeading: <span
                className="text-subtitle font-weight-bold text-shadow">
                {truncate(user.name.cap(), window.Helper.isSmallScreen() ? 17 : 40)}</span>,
           secondaryHeading: handleSecHeading(user),
           userData: user,
           needBadgeForTestMode: isTestMode,
           needCliPrizes,
           hiddenContent: <PanelHiddenContent data={user} needBadgeForTestMode={isTestMode} />
        });
    })

    const showAccordion = () => (
        <section id="showNewCTA">
            <RegisteredClientsAccordion
                detectedCard={detectedCard}
                checkDetectedElem={checkDetectedElem}
                handleUpdateList={handleUpdateList}
                actions={actions}
                backgroundColor="var(--themePLight)"
                color="white"
                needToggleButton={true}
            />
        </section>
    );
    //End Accordion Content


    const showFixedCTA = () => (
        showCTA &&
        <section className="animated fadeInUp" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
            <NewsPanelBtn
               title="Novo Cliente"
               size="medium"
            />
        </section>
    );

    const needFreeAlert = Boolean(listTotal >= 7 && bizPlan === "gratis");
    return (
        <Fragment>
            <Title
                title="&#187; Histórico de Cadastro"
                color="var(--themeP)"
                margin="my-4"
            />
            {/*<ClientsSearch />*/}
            <Fragment>
                {needEmptyIllustra
                ? (<AsyncShowIllustra handleUpdateList={handleUpdateList} />)
                : (
                    <Fragment>
                        <Filters listTotal={listTotal} />
                        {showAccordion()}
                        {loading && <ShowLoadingSkeleton size="large" />}
                        {error && <ShowError />}
                        <ShowOverMsg />
                        {needFreeAlert && <AsyncFreeAccountsLimitMsg />}
                        {showFixedCTA()}
                    </Fragment>
                )}
            </Fragment>
        </Fragment>
    );
}

/* COMMENTS
n1: <span> does not work with alignments and lineheight, only <p> elemnets...
*/