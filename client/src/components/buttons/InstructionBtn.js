import React from 'react';
import ButtonFab from './material-ui/ButtonFab';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from '../tooltips/Tooltip';
// a question instruction button for some functionalities explanations...
export default function InstructionBtn({ toolTipTxt, onClick }) {
    return (
        <ButtonFab
            position="relative"
            onClick={onClick}
            color="var(--mainDark)"
            backgroundColor="#CAD3C8" // light grey
            iconFontAwesome={<FontAwesomeIcon icon="question-circle" className="d-flex align-items-center" style={{fontSize: 30}} />}
            needIconShadow={false}
        />
    );
}