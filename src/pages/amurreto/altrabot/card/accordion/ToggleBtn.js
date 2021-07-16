import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab, { faStyle } from "components/buttons/material-ui/ButtonFab";
import { setRun, useAction } from "global-data/ui";

export default function ToggleBtn({ cardId, onClick }) {
    const [panelId, setPanelId] = useState("");
    const [togglePanel, setTogglePanel] = useState(false);

    const uify = useAction();

    return (
        <ButtonFab
            backgroundColor="var(--themeSDark)"
            size="medium"
            position="absolute"
            top={-10}
            right={-25}
            iconFontAwesome={<FontAwesomeIcon icon="plus" style={faStyle} />}
            iconAfterClick={<FontAwesomeIcon icon="minus" style={faStyle} />}
            toggleStatus={cardId}
            needClickAndToggle
            onClick={() => setRun("runName", cardId, uify)}
        />
    );
}
