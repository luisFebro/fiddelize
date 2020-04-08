import React, { Fragment, useEffect, useState, useContext } from 'react';
import SearchFilter from "../../../../components/search/SearchFilter";
import SearchResult from "../../../../components/search/SearchResult";
import moment from 'moment';
import parse from 'html-react-parser';
import { convertDotToComma } from '../../../../utils/numbers/convertDotComma';
// Redux
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { readUserList } from '../../../../redux/actions/userActions';
import { showSnackbar } from '../../../../redux/actions/snackbarActions';
import UserCardExpansiblePanel from './expansible-panel/UserCardExpansiblePanel';
import PanelHiddenContent from './card-hidden-content/PanelHiddenContent';
// End Redux
import LoadingThreeDots from '../../../../components/loadingIndicators/LoadingThreeDots';
import LoadMoreItemsButton from '../../../../components/buttons/LoadMoreItemsButton';
import Title from '../../../../components/Title';
import { useAppSystem } from '../../../../hooks/useRoleData';
import PremiumButton from '../../../../components/buttons/PremiumButton';

moment.updateLocale('pt-br');

const initialSkip = 0;
let searchTerm = "";
export default function RegisteredClientsList() {
    const [init, setInit] = useState(true);
    const { businessId } = useAppSystem();

    const [clientsData, setClientsData] = useState({
        list: [],
        chunkSize: 0,
        totalSize: 0,
    });
    let { list, totalSize } = clientsData;

    // test
    const purchaseHistory = {
        history: [{
            challengeN: 1,
            icon: "star",
            desc: "Primeira Compra",
            createdAt: new Date(),
            value: 20.50
        }],
        updatedAt: new Date(),
    }
    // end test

    const { isLoading, adminName, run, runName } = useStoreState(state => ({
        run: state.globalReducer.cases.run,
        runName: state.globalReducer.cases.runName,
        isLoading: state.globalReducer.cases.isLinearPLoading,
        adminName: state.userReducer.cases.currentUser.name,
    }));

    const dispatch = useStoreDispatch();

    useEffect(() => {
        if(init || runName === "registered") {
            readUserList(dispatch, initialSkip, "cliente", "", businessId)
            .then(res => {
                if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
                setClientsData({
                    ...clientsData,
                    list: res.data.list,
                    chunkSize: res.data.chunkSize,
                    totalSize: res.data.totalSize
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
                totalSize: res.data.totalSize
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
                    {!(user.clientUserData && user.clientUserData.purchase)
                    ? <span className="text-small font-weight-bold">Sem data registrada.</span>
                    : (
                        <span className="text-small font-weight-bold">
                            {moment(
                                user.clientUserData.purchase.updatedAt
                            ).calendar(null, { sameElse: 'lll'})}.
                        </span>
                    )}
                </span>
            </div>
        );


        const truncate = (name, leng) => window.Helper.truncate(name, leng);
        return({
           _id: user._id,
           mainHeading: <span
                className="text-subtitle font-weight-bold text-shadow">
                {truncate(user.name.cap(), window.Helper.isSmallScreen() ? 17 : 40)}</span>,
           secondaryHeading: handleSecHeading(user),
           userData: user,
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
            url={`/api/user/list/all?skip=${"SKIP"}&role=cliente`}
            objPathes={{
                strList: "data.list",
                strChunkSize: "data.chunkSize",
                strTotalSize: "data.totalSize",
            }}
            setData={setClientsData}
            data={clientsData}
            remainingText="Clientes Restantes:"
            msgAfterDone={`${adminName}, Isso é tudo! Não há mais Clientes`}
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
                    {showExpansionPanel()}
                    {showMoreItemsBtn()}
                </Fragment>
            )}
        </Fragment>
    );
}

/* COMMENTS
n1: <span> does not work with alignments and lineheight, only <p> elemnets...
*/