import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStoreDispatch } from 'easy-peasy';
import uuidv1 from 'uuid/v1';
import { setRun } from '../../../hooks/useRunComp';
import { markOneClicked } from '../../../redux/actions/notificationActions';
import ButtonMulti, {faStyle} from '../../../components/buttons/material-ui/ButtonMulti';
import ModalFullContent from '../../../components/modals/ModalFullContent';
import pickCardType from './pickCardType';
import Spinner from '../../../components/loadingIndicators/Spinner';
import { useProfile } from '../../../hooks/useRoleData';

export default function CardActionBtn({
        userId,
        cardId,
        cardType,
        clicked,
        backColor,
        content, // string
        subtype,
    }) {
    const [fullOpen, setFullOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [seen, setSeen] = useState(false);
    const dispatch = useStoreDispatch();
    const { role } = useProfile();


    const handlePickedComp = () => {
        const PickedComp = pickCardType(cardType, { content, subtype, role });
        return(<PickedComp />)
    }


    const handleFullOpen = () => {
        setFullOpen(true);
    }

    const handleFullClose = () => {
        setFullOpen(false);
    }

    const handleClickedCard = () => {
        setIsLoading(true);
        markOneClicked(userId, cardId)
        .then(res => {
            if(res.status !== 200) { return setIsLoading(false); }
            setRun(dispatch, `notificationCount${uuidv1()}`)
            handleFullOpen();
            setTimeout(() => { setIsLoading(false); setSeen(true); }, 3000);
        })
    }

    const handleBtnTitle = () => {
        if(isLoading) {
            return <Spinner size="mini" marginY="5px" />
        } else if(seen) {
            return "Visto";
        } else {
            return !clicked ? "Ver" : `Ok ✔️`
        }
    }

    return (
        <section className="action-btn">
            <ButtonMulti
                onClick={handleClickedCard}
                iconFontAwesome={!clicked && !isLoading && !seen ? <FontAwesomeIcon icon="bolt" style={{...faStyle, fontSize: 22}} /> : null}
                textShadow={!clicked ? null : " "}
                color={!clicked ? "var(--mainWhite)" : "var(--mainDark)"}
                backgroundColor={!clicked ? "var(--themeSDark--" +  backColor + ")" : "var(--lightGrey)"}
            >
                {handleBtnTitle()}
            </ButtonMulti>
            <ModalFullContent
                contentComp={handlePickedComp()}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}

CardActionBtn.whyDidYouUpdate = true;