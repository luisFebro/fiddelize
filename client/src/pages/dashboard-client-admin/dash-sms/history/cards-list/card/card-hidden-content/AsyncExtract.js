import React from 'react';
import MuSelectTable from '../../../../../../../components/tables/MuSelectTable';
import ButtonFab from '../../../../../../../components/buttons/material-ui/ButtonFab';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDelay from '../../../../../../../hooks/useDelay';
import scrollIntoView from '../../../../../../../utils/document/scrollIntoView';
import click from '../../../../../../../utils/event/click';
import { setRun } from '../../../../../../../hooks/useRunComp';
import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../../../../../../redux/actions/snackbarActions';

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    title: {
        marginTop: 80,
    }
});

const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Nome' },
    { id: 'phone', numeric: false, disablePadding: false, label: 'Contato' },
    { id: 'carrier', numeric: false, disablePadding: false, label: 'Operadora' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
]

export default function AsyncExtract({ extractId }) {
    const loading = false;
    let list = [
        { name: "Febro Feitoza", phone: "(92) 99281-7363", carrier: "OI", "status": "recebido"},
        { name: "Patrícia Queiroz", phone: "(92) 9888-8888", carrier: "NEXTEL", "status": "enviando"},
        { name: "Fernando Lima", phone: "(92) 9777-7777", carrier: "TIM", "status": "agendado"},
        { name: "Kelly Ribeiro", phone: "(92) 9666-6666", carrier: "CLARO", "status": "falhou"},
        { name: "Gustavo Augusto", phone: "(92) 9555-5555", carrier: "VIVO", "status": "recebido"},
    ]

    const dispatch = useStoreDispatch();

    const styles = getStyles();

    const vanishMsgReady = useDelay(8000);

    const handleResending = () => {
        const handleTabFunc = () => {
            list.forEach(data => {
                delete data.carrier;
                delete data.status;
            })
            setRun(dispatch, "asyncExtractList", { array: list });
            showSnackbar(dispatch, "Pronto!")
        }

        const postFunction = () => {
            click("#bubbleTabsBtn2", { callback: () => handleTabFunc() });
        }

        const config = {
            mode: "center",
            offset: 10,
            duration: 3000,
            onDone: () => postFunction(),
        }
        showSnackbar(dispatch, "Adicionando contatos... Um momento!", "warning", 7000)
        scrollIntoView("#recipientOptions", config)
    }

    const displayCTA = () => (
        <ButtonFab
            size="medium"
            title="Novo reenvio"
            onClick={handleResending}
            position="relative"
            needTxtNoWrap={true}
            backgroundColor={"var(--themeSDark--default)"}
            variant = 'extended'
        />
    );

    return (
        <section className="animated fadeInUp slow delay-1s">
            <div
                className="mb-3 d-flex justify-content-center"
                style={styles.title}
            >
                <p className="align-items-center mb-2 mr-3 text-subtitle font-weight-bold text-white text-shadow text-center">
                    Extrato
                </p>
                {displayCTA()}
            </div>
            {isSmall && (
                <p
                    className={`${vanishMsgReady ? "animated zoomOut" : ""} align-items-center mb-2 mr-3 text-normal font-weight-bold text-white text-shadow text-center`}
                    style={{ display: vanishMsgReady ? "none" : "block", transition: "all 4s"}}
                >
                    Deslize para mais <FontAwesomeIcon icon="arrow-right" />
                </p>
            )}
            <MuSelectTable
                headCells={headCells}
                rowsData={list}
                enumeration="number"
                loading={loading}
                needMainTitle={false}
                needHighlightColor={false}
            />
        </section>
    );
}

/*
<MuSelectTable
    headCells={headCells}
    rowsData={list}
    enumeration="number"
    loading={loading}
    callback={checkSelected}
    emptySelection={emptySelection}
/>
 */