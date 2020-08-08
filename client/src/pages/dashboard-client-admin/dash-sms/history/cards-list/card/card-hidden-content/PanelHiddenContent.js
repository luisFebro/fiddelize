import React from 'react';
import PropTypes from 'prop-types';
import { useStoreState } from 'easy-peasy';
import { Load } from '../../../../../../../components/code-splitting/LoadableComp'

const AsyncExtract = Load({ loader: () => import('./AsyncExtract'  /* webpackChunkName: "sms-extract-comp-lazy" */ )});

PanelHiddenContent.propTypes = {
    data: PropTypes.object.isRequired,
};

const getStyles = () => ({
    pointsContainer: {
        position: 'relative'
    }
});

export default function PanelHiddenContent({ data, needBadgeForTestMode }) {
    const { runArray } = useStoreState(state => ({
       runArray: state.globalReducer.cases.runArray,
    }));

    const styles = getStyles();

    const showSentMsg = () => (
        <p className="mt-5 mb-2 text-subtitle font-weight-bold text-white text-shadow text-center">
            Mensagem Enviada
        </p>
    );

    const showSmsExtract = () => {
        const isOpen = runArray.includes(data._id);

        return(
            isOpen &&
            <div className="animated fadeInUp slow delay-1s">
                <AsyncExtract />
            </div>
        );
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