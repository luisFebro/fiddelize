import React, { useState } from 'react';
import ButtonFab, {faStyle} from '../material-ui/ButtonFab';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AttentionWaves from './AttentionWaves';
import ModalFullContent from '../../modals/ModalFullContent';
// import { Load } from '../code-splitting/LoadableComp'
// const Async = Load({ loader: () => import('./AsyncPurchaseHistory'  /* webpackChunkName: "premium-feature-full-page-lazy" */ )});

const Test = () => (
   <div className="text-purple text-center text-hero">Hello</div>
);




export default function PremiumButton({
    onClick,
    top,
    left,
    right,
    needAttentionWaves,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    }

    const handleFullClose = () => {
        setFullOpen(false);
    }

    const showPremiumBtn = () => (
        <section
            style={{zIndex: 500, top, left, right}}
            className="position-absolute"
        >
            <AttentionWaves
                isActive={needAttentionWaves}
                waveColor="rgba(255, 242, 0, 0.3)"
                waveSize="40px"
                style={{ top, left, right }}
            />
            <ButtonFab
                position="absolute"
                top={top}
                left={left}
                right={right}
                size="small"
                onClick={handleFullOpen}
                color="var(--mainWhite)"
                backgroundColor="#fbc531" // nice ui yellow
                iconFontAwesome={<FontAwesomeIcon icon="crown" style={{ ...faStyle, fontSize: '23px' }} />}
            />
        </section>
    );

    return (
        <section>
            {showPremiumBtn()}
            <ModalFullContent
                contentComp={<Test/>}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}