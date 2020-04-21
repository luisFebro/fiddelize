import React, { Fragment, useEffect, useState, useContext } from 'react';
import SearchFilter from "../../../../components/search/SearchFilter";
import SearchResult from "../../../../components/search/SearchResult";
import moment from 'moment';
import parse from 'html-react-parser';
import { convertDotToComma } from '../../../../utils/numbers/convertDotComma';
import { Link } from 'react-router-dom';
import getFirstName from '../../../../utils/string/getFirstName';
// Redux
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { readUserList, updateUser } from '../../../../redux/actions/userActions';
import { showSnackbar } from '../../../../redux/actions/snackbarActions';
import UserCardExpansiblePanel from './expansible-panel/UserCardExpansiblePanel';
import PanelHiddenContent from './card-hidden-content/PanelHiddenContent';
// End Redux
import LoadingThreeDots from '../../../../components/loadingIndicators/LoadingThreeDots';
import LoadMoreItemsButton from '../../../../components/buttons/LoadMoreItemsButton';
import Title from '../../../../components/Title';
import { useAppSystem, useProfile, useClientAdmin, useCentralAdmin } from '../../../../hooks/useRoleData';
import PremiumButton from '../../../../components/buttons/PremiumButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

moment.updateLocale('pt-br');

const initialSkip = 0;
let searchTerm = "";
// let accumulatedChunks = 5;
export default function RegisteredClientsList() {
    const [init, setInit] = useState(true);
    const { businessId } = useAppSystem();
    const { name } = useProfile();
    const { bizPlan, totalClientUsers } = useClientAdmin();
    const { limitFreePlanNewUsers } = useCentralAdmin();

    const [clientsData, setClientsData] = useState({
        list: [],
        chunkSize: 0,
        totalSize: 0,
        totalCliUserScores: 0,
    });
    let { chunkSize, list, totalSize, totalCliUserScores } = clientsData;

    const { isLoading, run, runName } = useStoreState(state => ({
        run: state.globalReducer.cases.run,
        runName: state.globalReducer.cases.runName,
        isLoading: state.globalReducer.cases.isLinearPLoading,
    }));

    const dispatch = useStoreDispatch();

    useEffect(() => {
        const objToSend = {
            "clientAdminData.totalClientUserScores": totalCliUserScores,
        }
        updateUser(dispatch, objToSend, businessId)
    }, [totalCliUserScores])

    useEffect(() => {
        if(init || runName === "registered") {
            readUserList(dispatch, initialSkip, "cliente", "", businessId)
            .then(res => {
                if(res.status !== 200) return console.log("Something went wrong with readUserList");
                setClientsData({
                    ...clientsData,
                    list: res.data.list,
                    chunkSize: res.data.chunkSize,
                    totalSize: res.data.totalSize,
                    totalCliUserScores: res.data.totalCliUserScores,
                })
                setInit(false);
            })
        }
    }, [run, runName])

    // search
    const onSearchChange = e => {
        const querySearched = e.target.value;
        searchTerm = querySearched;

        readUserList(dispatch, initialSkip, "cliente", querySearched, businessId)
        .then(res => {

            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
            setClientsData({
                ...clientsData,
                list: res.data.list,
                chunkSize: res.data.chunkSize,
                totalSize: res.data.totalSize,
                totalCliUserScores: res.data.totalCliUserScores,
            })
        })
    }

    const showSearchBar = () => (
        <section className="container-center my-4">
            <span className="position-relative">
                <SearchFilter
                    placeholder="Admin, procure cliente"
                    searchChange={onSearchChange}
                />
                <PremiumButton
                    needAttentionWaves={true}
                    onClick={null}
                    left={10}
                    top={-20}
                />
            </span>
        </section>
    );
    // end search

    // ExpansionPanel Content
    const actions = list.map(user => {
        const handleSecHeading = user => (
            <div>
                <p className="text-subtitle text-shadow font-weight-bold mb-1">
                    {!user.clientUserData.currScore
                    ? "• 0 Pontos"
                    : ` • ${convertDotToComma(user.clientUserData.currScore)} Pontos`}
                </p>
                <br />
                <span
                    className="text-shadow text-normal font-weight-bold mt-5"
                    style={{lineHeight: '18px'}}
                >
                    • Última compra:
                    <br />
                    {!(user.clientUserData && user.clientUserData.purchaseHistory[0])
                    ? <span className="text-small font-weight-bold">Sem data registrada.</span>
                    : (
                        <span className="text-small font-weight-bold">
                            {moment(
                                user.clientUserData.purchaseHistory[0].createdAt,
                            ).calendar(null, { sameElse: 'lll'})}.
                        </span>
                    )}
                </span>
            </div>
        );


        const truncate = (name, leng) => window.Helper.truncate(name, leng);
        const isTestMode = name === user.name.cap();

        return({
           _id: user._id,
           mainHeading: <span
                className="text-subtitle font-weight-bold text-shadow">
                {truncate(user.name.cap(), window.Helper.isSmallScreen() ? 17 : 40)}</span>,
           secondaryHeading: handleSecHeading(user),
           userData: user,
           needBadgeForTestMode: isTestMode,
           hiddenContent: <PanelHiddenContent data={user} />
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
    //End ExpansionPanel Content


    const showMoreItemsBtn = () => (
        <LoadMoreItemsButton
            url={`/api/user/list/all?skip=${"SKIP"}&role=cliente&bizId=${businessId}`}
            objPathes={{
                strList: "data.list",
                strChunkSize: "data.chunkSize",
                strTotalSize: "data.totalSize",
            }}
            setData={setClientsData}
            data={clientsData}
            remainingText="Clientes Restantes:"
            msgAfterDone={`${getFirstName(name)}, Isso é tudo! Não há mais Clientes`}
            button={{
                title: "Carregar mais Clientes",
                loadingIndicator: "Carregando mais agora...",
                backgroundColor: 'var(--themeP)',
            }}
        />
    );

    return (
        <Fragment>
            <Title
                title="&#187; Histórico de Cadastro"
                color="var(--themeP)"
                margin="my-4"
            />
            {showSearchBar()}
            <SearchResult
                isLoading={isLoading}
                filteredUsersLength={totalSize}
                totalCliUserScores={totalCliUserScores}
                allUsersLength={totalSize}
                searchTerm={searchTerm}
                mainSubject="cliente"
            />
            {list.length !== 0 && (
                <p style={{top: '40px'}} className="text-p position-relative text-normal text-left pl-2 font-weight-bold">
                    Últimos Registros:
                </p>
            )}
            {isLoading
            ? <LoadingThreeDots />
            : (
                <Fragment>
                <div>
                </div>
                    {showExpansionPanel()}
                    {showMoreItemsBtn()}
                    {totalSize >= 7 && generateMsgToFreeAccounts(bizPlan, {
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