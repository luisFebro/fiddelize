import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import ModalFullContent from "components/modals/ModalFullContent";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import CarouselFlickity from "components/carousels/CarouselFlickity";
import {
    milestoneIconsSorted,
    getIconIndex,
} from "global-data/milestoneIconsSorted";

EditLevelIconModalBtn.propTypes = {
    currChallNumber: PropTypes.number,
    currIcon: PropTypes.string,
};

export default function EditLevelIconModalBtn({
    currChallNumber,
    currIcon,
    setSelectedIcon,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    return (
        <section>
            <ButtonFab
                position="relative"
                onClick={() => setFullOpen(!fullOpen)}
                title="trocar"
                iconFontAwesome={<FontAwesomeIcon icon="sync-alt" />}
                iconFontSize="15px"
                variant="extended"
                fontWeight="bolder"
                fontSize=".4.5em"
                size="small"
                color="white"
                backgroundColor="var(--themeSDark--default)"
                needBtnShadow={false}
            />
            <ModalFullContent
                contentComp={
                    <LevelIconComp
                        currChallNumber={currChallNumber}
                        currIcon={currIcon}
                        setSelectedIcon={setSelectedIcon}
                        setFullOpen={setFullOpen}
                    />
                }
                fullOpen={fullOpen}
                setFullOpen={setFullOpen}
            />
        </section>
    );
}

const LevelIconComp = ({
    currChallNumber,
    currIcon,
    setSelectedIcon,
    setFullOpen,
}) => {
    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Mude Ícone de Nível
                <br />
                do <strong>Desafio tipo n.º {currChallNumber}</strong>
            </p>
        </div>
    );

    const selectedMilestoneIcons = milestoneIconsSorted;
    const currIconInd = getIconIndex(currIcon);
    const showIconsCarousel = () => (
        <div className="mt-5">
            <CarouselFlickity
                data={selectedMilestoneIcons}
                isFromDash
                setSelectedIcon={setSelectedIcon}
                setOpenModal={setFullOpen}
                currIconInd={currIconInd}
                style={{
                    maxWidth: "100%",
                    boxShadow: "0 31px 120px -6px rgba(0, 0, 0, 0.35)",
                }}
            />
        </div>
    );

    return (
        <section>
            {showTitle()}
            {showIconsCarousel()}
        </section>
    );
};
