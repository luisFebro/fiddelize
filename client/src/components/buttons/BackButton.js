import React from 'react';
import ButtonMulti, {faStyle} from './material-ui/ButtonMulti';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BackButton({ title, variant = "rect", onClick, }) {
    return (
        <ButtonMulti
            onClick={onClick}
            title={title || "Voltar"}
            color="var(--mainWhite)"
            backgroundColor="var(--themeSDark)"
            iconFontAwesome={<FontAwesomeIcon icon="reply" style={faStyle} />}
        />
    );
}