import { useState } from "react";
import { useStoreDispatch } from "easy-peasy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab, {
    faStyle,
} from "../../../../../../../components/buttons/material-ui/ButtonFab";
import { setRun } from "../../../../../../../redux/actions/globalActions";

export default function ToggleBtn({ cardId, onClick }) {
    const [panelId, setPanelId] = useState("");
    const [togglePanel, setTogglePanel] = useState(false);

    const dispatch = useStoreDispatch();

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
            onClick={() => setRun(dispatch, cardId)}
        />
    );
}
