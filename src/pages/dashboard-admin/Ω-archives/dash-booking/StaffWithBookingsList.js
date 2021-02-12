import React, { Fragment, useEffect, useState } from 'react';
import SearchFilter from "../../../components/search/SearchFilter";
import SearchResult from "../../../components/search/SearchResult";
import ButtonFab from '../../../components/buttons/material-ui/ButtonFab';
import ButtonMulti from '../../../components/buttons/material-ui/ButtonMulti';
import moment from 'moment';
import parse from 'html-react-parser';
import Illustration from '../../../components/Illustration';
import { CLIENT_URL } from '../../../config/clientUrl';
// Redux
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { getStaffWithBookingsList } from '../../../redux/actions/adminActions';
import { showSnackbar } from '../../../redux/actions/snackbarActions';
import ExpansiblePanel from './ExpansiblePanel';
import PanelHiddenContent from './PanelHiddenContent';
// End Redux
import LoadingThreeDots from '../../../components/loadingIndicators/LoadingThreeDots';
import LoadMoreItemsButton from '../../../components/buttons/LoadMoreItemsButton';

moment.updateLocale('pt-br');

const initialSkip = 0;
let searchTerm = "";
export default function StaffWithBookingsList() {
    const [run, setRun] = useState(false);
    const [docsLoading, setDocsLoading] = useState({
        list: [],
        chunkSize: 0,
        totalSize: 0,
    })
    const {
        list,
        chunkSize,
        totalSize,
    } = docsLoading;

    const { isLoading, isCustomLoading, adminName } = useStoreState(state => ({
        isLoading: state.globalReducer.cases.isLinearPLoading,
        isCustomLoading: state.globalReducer.cases.isCustomLoading,
        adminName: state.userReducer.cases.currentUser.name,
    }));

    const dispatch = useStoreDispatch();

    useEffect(() => {
        getStaffWithBookingsList(dispatch, initialSkip)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
            setDocsLoading({
                ...docsLoading,
                skip: 0,
                list: res.data.list,
                chunkSize: res.data.chunkSize,
                totalSize: res.data.totalSize,
            })
        })
    }, [])

    // Accordion Content
    const actions = list.map(staff => {
        return({
           _id: staff._id,
           mainHeading: staff.name.cap(),
           secondaryHeading: parse(`> Último agendamento/modificação foi ${moment(staff.updatedAt).fromNow()}  atrás.`),
           staffBooking: staff,
           hiddenContent: <PanelHiddenContent data={staff} setRun={setRun} run={run} />
        });
    })

    const showExpansionPanel = () => (
        <ExpansiblePanel
            actions={actions}
            backgroundColor="var(--mainDark)"
            color="var(--mainWhite)"
            ToggleButton={
                <ButtonFab
                    backgroundColor="var(--mainPink)"
                    size="small"
                    iconFontAwesome="fas fa-plus"
                    iconMarginLeft="0"
                    iconAfterClick="fas fa-minus"
                />
            }
        />
    );
    //End Accordion Content

    // NOT WORKING... DISABLED LIMIT IN BACKEND
    const showMoreItemsBtn = () => (
        <LoadMoreItemsButton
            url={`/api/admin/list/staff-with-bookings?skip="SKIP"`}
            objPathes={{
                strList: "data.list",
                strChunkSize: "data.chunkSize",
                strTotalSize: "data.totalSize",
            }}
            setData={setDocsLoading}
            data={docsLoading}
            remainingText="Colaboradores Restantes:"
            msgAfterDone={`${adminName}, Isso é tudo! Não há mais Colaboradores`}
            button={{
                title: "Carregar mais Colaboradores",
                loadingIndicator: "Carregando mais agora...",
                backgroundColor: 'var(--mainPink)',
            }}
        />
    );


    return (
        <Fragment>
            {isLoading
            ? <LoadingThreeDots />
            : (
                <Fragment>
                    {list.length === 0
                    ? (
                        <div className="py-5">
                            <Illustration
                                img={`${CLIENT_URL}/img/illustrations/empty-booking.svg`}
                                alt="Nenhum Agendamento"
                                imgStyle={{
                                    maxWidth: 400
                                }}
                                txtImgConfig = {{
                                    fontSize: '2.2rem',
                                    topPos: "100%",
                                    txt: `Não há colaboradores com agendamentos`,
                                    txtBorder: "border-white",
                                }}
                            />
                        </div>
                    ) : (
                        <Fragment>
                            <SearchResult
                                isLoading={isLoading}
                                filteredUsersLength={totalSize}
                                allUsersLength={totalSize}
                                searchTerm={searchTerm}
                                mainSubject="colaborador"
                            />
                            <div className="text-normal">{showExpansionPanel()}</div>
                            {showMoreItemsBtn()}
                        </Fragment>
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}
