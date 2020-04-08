import React from 'react';
import ButtonFab, {faStyle} from './material-ui/ButtonFab';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AttentionWaves from './AttentionWaves';

export default function PremiumButton({ onClick, top, left, needAttentionWaves }) {
    return (
        <div style={{top, left}} className="position-absolute">
            <AttentionWaves
                isActive={needAttentionWaves}
                waveColor="rgba(255, 242, 0, 0.3)"
                waveSize="40px"
                style={{top: -10, left: 25}}
            />
            <ButtonFab
                position="absolute"
                top={top}
                left={left}
                size="medium"
                onClick={onClick}
                    color="var(--mainWhite)"
                    backgroundColor="#fbc531" // nice ui yellow
                    iconFontAwesome={<FontAwesomeIcon icon="crown" style={faStyle} />}
                />
        </div>
    );
}