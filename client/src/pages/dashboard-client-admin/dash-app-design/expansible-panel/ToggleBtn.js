import React from "react";
import ButtonFab, {
    faStyle,
} from "../../../../components/buttons/material-ui/ButtonFab";
import { setRun } from "../../../../redux/actions/globalActions";
import { useStoreDispatch } from "easy-peasy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ToggleBtn({ cardId, onClick }) {
    // const [panelId, setPanelId] = useState("");

    const dispatch = useStoreDispatch();

    return (
        <ButtonFab
            backgroundColor="var(--themeSDark)"
            size="medium"
            iconFontAwesome={<FontAwesomeIcon icon="plus" style={faStyle} />}
            iconAfterClick={<FontAwesomeIcon icon="minus" style={faStyle} />}
            toggleStatus={cardId}
            needClickAndToggle={true}
            onClick={() => setRun(dispatch, cardId)}
        />
    );
}
