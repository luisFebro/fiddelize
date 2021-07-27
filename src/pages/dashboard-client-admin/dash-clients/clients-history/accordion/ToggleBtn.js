import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab, { faStyle } from "components/buttons/material-ui/ButtonFab";
import { setRun, useAction } from "global-data/ui";

export default function ToggleBtn({ cardId, onClick }) {
    const uify = useAction();

    return (
        <ButtonFab
            backgroundColor="var(--themeSDark)"
            size="medium"
            position="relative"
            right={-35}
            iconFontAwesome={<FontAwesomeIcon icon="plus" style={faStyle} />}
            iconAfterClick={<FontAwesomeIcon icon="minus" style={faStyle} />}
            toggleStatus={cardId}
            needClickAndToggle
            onClick={() => setRun("runArray", cardId, uify)}
        />
    );
}
