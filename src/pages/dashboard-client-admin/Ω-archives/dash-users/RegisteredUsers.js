// import { Fragment, useEffect, useState } from "react";
// import moment from "moment";
// import parse from "html-react-parser";
// import SearchFilter from "../../../components/search/SearchFilter";
// import SearchResult from "../../../components/search/SearchResult";
// import ExpansiblePanel from "../ExpansiblePanel";
// import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
// // Redux
// import { readAllCliUsers } from "../../../redux/actions/userActions";
// import { showSnackbar } from "../../../redux/actions/snackbarActions";
// import PanelHiddenContent from "./PanelHiddenContent";
// // End Redux
// import LoadingThreeDots from "../../../components/loadingIndicators/LoadingThreeDots";
// import LoadMoreItemsButton from "../../../components/buttons/LoadMoreItemsButton";

// const initialSkip = 0;
// let searchTerm = "";
// export default function RegisteredUsersList() {
//     const [configBtns, setConfigBtns] = useState(false);
//     const [init, setInit] = useState(true);
//     const [clientsData, setClientsData] = useState({
//         list: [],
//         chunkSize: 0,
//         totalSize: 0,
//     });
//     const { list, chunkSize, totalSize } = clientsData;

//     const dispatch = useStoreDispatch();

//     useEffect(() => {
//         if (init || runName === "registered") {
//             readAllCliUsers(dispatch, initialSkip, "colaborador-e-admin").then(
//                 (res) => {
//                     if (res.status !== 200)
//                         return showSnackbar(dispatch, res.data.msg, "error");
//                     setClientsData({
//                         ...clientsData,
//                         list: res.data.list,
//                         chunkSize: res.data.chunkSize,
//                         totalSize: res.data.totalSize,
//                     });
//                     setInit(false);
//                 }
//             );
//         }
//     }, [run, runName]);

//     // search
//     const onSearchChange = (e) => {
//         const querySearched = e.target.value;
//         searchTerm = querySearched;

//         readAllCliUsers(
//             dispatch,
//             initialSkip,
//             "colaborador-e-admin",
//             querySearched
//         ).then((res) => {
//             if (res.status !== 200)
//                 return showSnackbar(dispatch, res.data.msg, "error");
//             setClientsData({
//                 ...clientsData,
//                 list: res.data.list,
//                 chunkSize: res.data.chunkSize,
//                 totalSize: res.data.totalSize,
//             });
//         });
//     };

//     const showSearchBar = () => (
//         <div className="container-center my-4">
//             <SearchFilter
//                 placeholder="Admin, procure usuário interno"
//                 searchChange={onSearchChange}
//             />
//         </div>
//     );
//     // end search

//     // Accordion Content
//     const actions = list.map((user) => ({
//         _id: user._id,
//         mainHeading: user.name.cap(),
//         secondaryHeading: parse(
//             `> Função Gerenciamento: ${user.role.cap()} <br />> Atualizado ${moment(
//                 user.updatedAt
//             ).fromNow()}  atrás.`
//         ),
//         userData: user,
//         hiddenContent: <PanelHiddenContent data={user} />,
//     }));

//     const showExpansionPanel = () => (
//         <ExpansiblePanel
//             actions={actions}
//             backgroundColor="var(--mainDark)"
//             color="var(--mainWhite)"
//             statusAfterClick={configBtns}
//             ToggleButton={
//                 <ButtonFab
//                     backgroundColor="var(--mainPink)"
//                     size="small"
//                     iconFontAwesome="fas fa-plus"
//                     iconMarginLeft="0"
//                     iconAfterClick="fas fa-minus"
//                     actionAfterClick={{
//                         setStatus: setConfigBtns,
//                         status: configBtns,
//                     }}
//                 />
//             }
//         />
//     );
//     // End Accordion Content

//     const showMoreItemsBtn = () => (
//         <LoadMoreItemsButton
//             url={`/api/user/list/all?skip=${"SKIP"}&role=colaborador-e-admin`}
//             objPathes={{
//                 strList: "data.list",
//                 strChunkSize: "data.chunkSize",
//                 strTotalSize: "data.totalSize",
//             }}
//             setData={setClientsData}
//             data={clientsData}
//             remainingText="Clientes Restantes:"
//             msgAfterDone={`${adminName}, Isso é tudo! Não há mais Usuários`}
//             button={{
//                 title: "Carregar mais Usuários",
//                 loadingIndicator: "Carregando mais agora...",
//                 backgroundColor: "var(--mainPink)",
//             }}
//         />
//     );

//     return (
//         <Fragment>
//             {showSearchBar()}
//             <SearchResult
//                 isLoading={isLoading}
//                 filteredUsersLength={totalSize} // need change
//                 allUsersLength={totalSize}
//                 searchTerm={searchTerm}
//             />
//             {isLoading ? (
//                 <LoadingThreeDots />
//             ) : (
//                 <Fragment>
//                     <div className="text-normal">{showExpansionPanel()}</div>
//                     {showMoreItemsBtn()}
//                 </Fragment>
//             )}
//         </Fragment>
//     );
// }
