import React, { Fragment, useEffect, useState, useContext } from 'react';
import { calendar } from '../../../../utils/dates/dateFns';
import parse from 'html-react-parser';
import { convertDotToComma } from '../../../../utils/numbers/convertDotComma';
import { Link } from 'react-router-dom';
import getFirstName from '../../../../utils/string/getFirstName';
// Redux
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { updateUser } from '../../../../redux/actions/userActions';
import { showSnackbar } from '../../../../redux/actions/snackbarActions';
import UserCardExpansiblePanel from './expansible-panel/UserCardExpansiblePanel';
import PanelHiddenContent from './card-hidden-content/PanelHiddenContent';
// End Redux
import Spinner from '../../../../components/loadingIndicators/Spinner';
import Title from '../../../../components/Title';
import { useAppSystem, useProfile, useClientAdmin, useCentralAdmin } from '../../../../hooks/useRoleData';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAPIList, { readUserList } from '../../../../hooks/api/useAPIList';
import useElemDetection, { checkDetectedElem } from '../../../../hooks/api/useElemDetection';
import extractStrData from '../../../../utils/string/extractStrData';
// import ClientsSearch from './search/ClientsSearch';

export default function AsyncRecordedClientsList() {
    const [skip, setSkip] = useState(0);
    const { businessId } = useAppSystem();
    const { limitFreePlanNewUsers } = useCentralAdmin();
    const { bizPlan, totalClientUsers } = useClientAdmin();

    const { name } = useProfile();

    const [data, setData] = useState({
        totalCliUserScores: 0,
        totalActiveScores: 0,
    });
    const { totalCliUserScores, totalActiveScores } = data;

    const { run, runName } = useStoreState(state => ({
        run: state.globalReducer.cases.run,
        runName: state.globalReducer.cases.runName,
    }));

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
        // trigger,
        listName: "recordedClientsList"
    })

    useEffect(() => {
        if(content) {
            const {
                totalCliUserScores, // NEED IMPLEMENT IN BACKEND
                totalActiveScores
            } = extractStrData(content);
            console.log("totalActiveScores", totalActiveScores);
            console.log("totalCliUserScores", totalCliUserScores);
            setData({ ...data, totalCliUserScores, totalActiveScores });
        }
    }, [content])

    useEffect(() => {
        if(runName === "registered") localStorage.removeItem("userProfile");
    }, [run, runName])

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
                    : ` • ${convertDotToComma(user.clientUserData.currScore)} Pontos`}
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

    const showExpansionPanel = () => (
        <UserCardExpansiblePanel
            actions={actions}
            backgroundColor="var(--themePLight)"
            color="white"
            needToggleButton={true}
        />
    );
    //End Accordion Content

    const showFilteredListTitle = () => (
        list.length !== 0 &&
        <p style={{top: '40px'}} className="text-p position-relative text-normal text-left pl-2 font-weight-bold">
            Últimos Registros:
        </p>
    );

    return (
        <Fragment>
            <Title
                title="&#187; Histórico de Cadastro"
                color="var(--themeP)"
                margin="my-4"
            />
            {/*<ClientsSearch />*/}
            {loading
            ? (
                <Spinner
                    marginY={100}
                    size="large"
                    logo="purple"
                />
            ): (
                <Fragment>
                    {showFilteredListTitle()}
                    {showExpansionPanel()}
                    {loading && <ShowLoadingSkeleton size="large" />}
                    {error && <ShowError />}
                    <ShowOverMsg />
                    {listTotal >= 7 && generateMsgToFreeAccounts(bizPlan, {
                        totalClientUsers,
                        limitFreePlanNewUsers,
                        name,
                    })}
                </Fragment>
            )}
        </Fragment>
    );
}

// Need to reload to update. And even after reloaded, there's a delay to update...
const  generateMsgToFreeAccounts = (plan, opts) => {
    const { totalClientUsers, limitFreePlanNewUsers, name } = opts;

    const showTxtDefault = txt => (
        <div className="text-center text-normal animated rubberBand my-5">
            <p className="text-purple text-subtitle font-weight-bold m-0">
                Nota <FontAwesomeIcon icon="info-circle" />
            </p>
            {txt}
        </div>
    );

    const aboutToExpireMsg = () => {
        const leftRegisters = limitFreePlanNewUsers - totalClientUsers;
        const txt =
        <span>
            - {getFirstName(name)}, faltam mais
            <br />
            <strong>{leftRegisters} cadastros</strong> para atingir limite do seu plano gratis.{" "}
            <Link to="/planos?cliente-admin=1" className="text-purple font-weight-bold">Escolha um PLANO PREMIUM para mais cadastros!</Link>
        </span>
        return showTxtDefault(txt);
    }

    const expiredMsg = () => {
        const txt =
        <span>
            - O limite de cadastros para seu plano terminou.{" "}
            <br />
            <Link to="/planos?cliente-admin=1" className="text-purple font-weight-bold">Escolha um PLANO PREMIUM para mais cadastros!</Link>
        </span>
        return showTxtDefault(txt);
    };

    if(plan === "gratis") {
        if(totalClientUsers >= limitFreePlanNewUsers) {
            return expiredMsg();
        } else if(totalClientUsers >= 7) {
            return aboutToExpireMsg();
        }
    }

    return null;
}

/* COMMENTS
n1: <span> does not work with alignments and lineheight, only <p> elemnets...
*/