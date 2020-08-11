import React from 'react';
import PropTypes from 'prop-types';
import { useStoreState } from 'easy-peasy';
import TextField from '@material-ui/core/TextField';
import ButtonFab from '../../../../../../../components/buttons/material-ui/ButtonFab';
import { Load } from '../../../../../../../components/code-splitting/LoadableComp'
import copyTextToClipboard from '../../../../../../../utils/document/copyTextToClipboard';
import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../../../../../../redux/actions/snackbarActions';

const AsyncExtract = Load({ loader: () => import('./AsyncExtract'  /* webpackChunkName: "sms-extract-comp-lazy" */ )});

PanelHiddenContent.propTypes = {
    data: PropTypes.object.isRequired,
};

const getStyles = () => ({
    pointsContainer: {
        position: 'relative'
    },
    fieldFormValue: {
        backgroundColor: 'var(--mainWhite)',
        color: 'var(--themeP)',
        fontSize: '20px',
        fontFamily: 'var(--mainFont)',
        zIndex: 2000
    },
});

export default function PanelHiddenContent({ data }) {
    const { runArray } = useStoreState(state => ({
       runArray: state.globalReducer.cases.runArray,
    }));

    const styles = getStyles();

    const dispatch = useStoreDispatch();

    const handleCopy = () => {
        copyTextToClipboard("#msgArea", () => showSnackbar(dispatch, "Mensagem copiada!", "success"))
    }

    const displayCopyBtn = () => (
        <section className="d-flex justify-content-end my-3">
            <ButtonFab
                size="medium"
                title="Copiar"
                onClick={handleCopy}
                backgroundColor={"var(--themeSDark--default)"}
                variant = 'extended'
            />
        </section>
    );

    const showSentMsg = () => (
        <section className="my-5">
            <p className="mb-2 text-subtitle font-weight-bold text-white text-shadow text-center">
                Mensagem Enviada
            </p>
            <TextField
                multiline
                rows={5}
                id="msgArea"
                name="message"
                InputProps={{
                    style: styles.fieldFormValue,
                }}
                value={data.sentMsgDesc}
                variant="outlined"
                fullWidth
            />
            {displayCopyBtn()}
        </section>
    );

    const showSmsExtract = () => {
        const isOpen = runArray.includes(data._id);

        return(
            isOpen && (
                <AsyncExtract
                    extractId={data._id}
                />
            )
        )
    }

    return (
        <section
            className="position-relative text-normal enabledLink panel-hidden-content--root"
        >
            {showSentMsg()}
            {showSmsExtract()}
        </section>
    );
}

/* ARCHIVES
<p className="animated flip slow delay-2s"> first flip that I was looking for with the style of  a n entire 360 with zooming.
<CreatedAtBr createdAt={createdAt} />
*/