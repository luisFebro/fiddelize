import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStoreDispatch } from 'easy-peasy';
import uuidv1 from 'uuid/v1';
import { setRun } from '../../../hooks/useRunComp';
import { markOneClicked } from '../../../redux/actions/notificationActions';
import ButtonMulti, {faStyle} from '../../../components/buttons/material-ui/ButtonMulti';
import ModalFullContent from '../../../components/modals/ModalFullContent';
import pickCardType from './pickCardType';

export default function CardActionBtn({
        userId,
        cardId,
        cardType,
        clicked,
        backColor,
    }) {
    const [fullOpen, setFullOpen] = useState(false);
    const dispatch = useStoreDispatch();


    const handlePickedComp = () => {
        const PickedComp = pickCardType(cardType);
        return(<PickedComp />)
    }


    const handleFullOpen = () => {
        setFullOpen(true);
    }

    const handleFullClose = () => {
        setFullOpen(false);
    }

    const handleClickedCard = () => {
        markOneClicked(userId, cardId)
        .then(res => {
            if(res.status !== 200) return console.log("smt worng with handleClickedCard")
            setRun(dispatch, `notificationCount${uuidv1()}`)
            handleFullOpen();
        })
    }

    return (
        <section className="action-btn">
            <ButtonMulti
                onClick={handleClickedCard}
                title={!clicked ? "Ver" : `Ok ✔️`} // Need to add a mini loadingspinner indicator
                iconFontAwesome={!clicked ? <FontAwesomeIcon icon="bolt" style={{...faStyle, fontSize: 22}} /> : null}
                textShadow={!clicked ? null : " "}
                color={!clicked ? "var(--mainWhite)" : "var(--mainDark)"}
                backgroundColor={!clicked ? "var(--themeSDark--" +  backColor + ")" : "var(--lightGrey)"}
            />
            <ModalFullContent
                contentComp={handlePickedComp()}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}

CardActionBtn.whyDidYouUpdate = true;