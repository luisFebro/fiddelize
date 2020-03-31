import React from 'react';
import ButtonFab from './material-ui/ButtonFab';
// a question instruction button for some functionalities explanations...
export default function InstructionBtn({ toolTipTxt, onClick, iconFontAwesome }) {
    return (
        <ButtonFab
            position="relative"
            onClick={onClick}
            color="var(--mainDark)"
            backgroundColor="#CAD3C8" // light grey
            iconFontAwesome={iconFontAwesome}
            needIconShadow={false}
        />
    );
}