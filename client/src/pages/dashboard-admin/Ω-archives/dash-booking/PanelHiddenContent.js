import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CreatedAtBr from '../CreatedAtBr';
import parse from 'html-react-parser';
import { fromNow, calendar } from '../../../utils/dates/dateFns';
import ButtonFab from '../../../components/buttons/material-ui/ButtonFab';
import ButtonMulti from '../../../components/buttons/material-ui/ButtonMulti';
// import ModalBtn from "./modal/ModalBtn";
// CUSTOMIZED DATA
import StaffPanelHiddenContent from './staff-expansible-panel/StaffPanelHiddenContent';
import StaffExpansiblePanel from './staff-expansible-panel/StaffExpansiblePanel';
import { useStoreState, useStoreDispatch } from 'easy-peasy'
import { getStaffBookingListForAdmin, getAllClientsNameFromStaff } from '../../../redux/actions/staffBookingActions';
import { showSnackbar } from '../../../redux/actions/snackbarActions';
import AsyncAutoCompleteSearch from '../../../components/search/AsyncAutoCompleteSearch';
import LoadingThreeDots from '../../../components/loadingIndicators/LoadingThreeDots';
// END CUSTOMIZED DATA

PanelHiddenContent.propTypes = {
    data: PropTypes.object.isRequired,
};

export default function PanelHiddenContent({ data, setRun, run }) {
    const [bookings, setBookings] = useState([]);
    const [docsLoading, setDocsLoading] = useState({
        skip: 0,
        limit: 5,
        sizeLoaded: 0,
        totalDocsSize: 0,
        loadingIndicator: "Pra já! Carregando agora..."
    })
    const {
        skip,
        limit,
        sizeLoaded,
        totalDocsSize,
        loadingIndicator
    } = docsLoading;

    const [search, setSearch] = useState({
        searchTerm: ""
    });
    const { searchTerm } = search;

    const {
        _id,
    } = data;

    const autoCompleteUrl = `/api/staff-booking/list/clients-name-from-staff?staffId=${_id}`;

    const { adminName, isCustomLoading, isCustom2Loading } = useStoreState(state => ({
        isCustomLoading: state.globalReducer.cases.isCustomLoading,
        isCustom2Loading: state.globalReducer.cases.isCustom2Loading,
        adminName: state.userReducer.cases.currentUser.name
    }));
    const dispatch = useStoreDispatch();

    useEffect(() => {
        const docsToSkip = 0;
        getStaffBookingListForAdmin(dispatch, _id, docsToSkip)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
            setBookings(res.data.docs);
            setDocsLoading({
                ...docsLoading,
                skip: 0,
                sizeLoaded: res.data.size,
                totalDocsSize: res.data.totalSize,
            })
        })
    }, [run])

    const onAutoSelectChange = selectedValue => {
        const initialSkip = 0;
        getStaffBookingListForAdmin(dispatch, _id, initialSkip, false, selectedValue)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
            setBookings(res.data.docs);
        })
    }

    const showStaffAutoCompleteBar = () => (
        <div
            style={{marginBottom: '75px'}}
            className="container-center mt-5"
        >
            <AsyncAutoCompleteSearch
                url={autoCompleteUrl}
                circularProgressColor="secondary"
                onAutoSelectChange={onAutoSelectChange}
                placeholder="Procure por cliente"
            />
        </div>
    );

    // ExpansionPanel Content
    const actions = bookings.map(booking => {
        return({
           _id: booking._id,
           mainHeading: booking.clientName.cap(),
           secondaryHeading: parse(`
                > Data e Horário Agendamento:
                <br />
                ${typeof booking.bookingDate === "undefined" ? "Sem Agendamento" : calendar(booking.bookingDate)}
                <br />
                > Atualizado ${fromNow(booking.updatedAt)}  atrás.`),
           staffBooking: booking,
           hiddenContent: <StaffPanelHiddenContent data={booking} />
        });
    })

    const showExpansionPanel = () => (
        <StaffExpansiblePanel
            actions={actions}
            backgroundColor="#7f8c8d" // grey color
            color="white"
            ToggleButton={
                <ButtonFab
                    backgroundColor="var(--mainPink)"
                    size="small"
                    iconFontAwesome="fas fa-plus"
                    iconMarginLeft="0"
                    iconAfterClick="fas fa-minus"
                />
            }
            allUsers={bookings}
            setRun={setRun}
            run={run}
        />
    );
    //End ExpansionPanel Content

    const loadMoreDocs = () => {
        const moreDocsToSkip = skip + limit;
        getStaffBookingListForAdmin(dispatch, _id, moreDocsToSkip, true)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
            setBookings([...bookings, ...res.data.docs])
            setDocsLoading({
                ...docsLoading,
                sizeLoaded: sizeLoaded + res.data.size,
                skip: moreDocsToSkip,
                totalDocsSize: res.data.totalSize,
            })
        })
    };

    const showMoreButton = () => {
        return(
            sizeLoaded === totalDocsSize && sizeLoaded >= limit
            ? <p className="text-main-container text-center my-3">
                {`${adminName && adminName.cap()}, isso é tudo. Não há mais clientes para mostrar.`}
              </p>
            : searchTerm.length === 0 && sizeLoaded >= limit && (
                <div className="container-center my-3">
                    <ButtonMulti
                        title={isCustom2Loading ? loadingIndicator : "Carregar Mais Clientes"}
                        onClick={loadMoreDocs}
                        backgroundColor="var(--mainPink)"
                        backColorOnHover="var(--mainPink)"
                        iconFontAwesome={isCustom2Loading ? "" : "fas fa-chevron-circle-down"}
                    />
                </div>
            )
        );
    };

    const showStaffClientList = () => (
        <div>
            {isCustomLoading
            ? <LoadingThreeDots color="white" />
            : (
                <div>
                    <div className="text-normal">{showExpansionPanel()}</div>
                    {showMoreButton()}
                </div>
            )}
        </div>
    );

    return (
        <div
            className="text-normal enabledLink"
            style={{userSelect: 'text', margin: 'auto', width: '100%'}}
        >
            {showStaffAutoCompleteBar()}
            {showStaffClientList()}
        </div>
    );
}
