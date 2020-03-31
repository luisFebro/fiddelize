import React from 'react';
import PropTypes from 'prop-types';
import ActionBtns from './ActionBtns';
import { useStoreState } from 'easy-peasy';

PanelHiddenContent.propTypes = {
    data: PropTypes.object.isRequired,
};

export default function PanelHiddenContent({ data }) {
    const { runArray } = useStoreState(state => ({
       runArray: state.globalReducer.cases.runArray,
    }));

    const styles = {
        pointsContainer: {
            position: 'relative'
        }
    }

    const showInfos = () => {
        const infos = {
            "Última Pontuação": data && data.clientUserData.cashCurrScore
        }

        const infoKeys = Object.keys(infos);
        const infoValues = Object.values(infos);

        return(
            <div>
                {infoKeys.map((key, ind) => (
                    <p key={key} className="text-shadow text-normal">
                        <span className="font-weight-bold">• {key}:</span>
                        <br />
                        {infoValues[ind]
                        ? `${infoValues[ind]} Pontos`
                        : <span className="text-small font-weight-bold">Sem pontos.</span>}
                    </p>
                ))}
            </div>
        );
    };

    const needShowActionBtns = runArray.includes(data._id);

    return (
        needShowActionBtns &&
        <div
            className="text-normal enabledLink panel-hidden-content--root"
        >
            {showInfos()}
            <div className="animated flipInY slow delay-1s">
                <ActionBtns data={data} />
            </div>
        </div>
    );
}

/* ARCHIVES
<p className="animated flip slow delay-2s"> first flip that I was looking for with the style of  a n entire 360 with zooming.
<CreatedAtBr createdAt={createdAt} />
*/