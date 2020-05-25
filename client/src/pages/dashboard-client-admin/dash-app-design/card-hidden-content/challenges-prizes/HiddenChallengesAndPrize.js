import React, { useState } from 'react';
import Title from '../../../../../components/Title';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from '../../../../../components/buttons/material-ui/ButtonFab';
import InstructionBtn from '../../../../../components/buttons/InstructionBtn';
import List from './List.js';
import uuidv1 from 'uuid/v1';
// import

export default function HiddenGoalsAndRewards() {
    const [mode, setMode] = useState("Constante");

    const styles = {
        iconPos: {
            top: 0,
            right: -50,
        }
    }

    const showTitle = () => (
        <div className="container-center mt-3">
            <section className="position-relative">
                <Title
                    title="&#187; Modo Atual:"
                    subTitle={mode}
                    color="var(--themeP)"
                    margin=" "
                    padding=" "
                    subTitleClassName="font-weight-bold"
                />
                <div className="position-absolute" style={styles.iconPos}>
                    <InstructionBtn
                        onClick={null}
                    />
                </div>
            </section>
        </div>
    );

    const showBtnAction = () => (
        <div className="container-center mt-5">
            <ButtonFab
                position="relative"
                onClick={null}
                title="adicionar"
                iconFontAwesome={<FontAwesomeIcon icon="plus" />}
                iconFontSize="25px"
                variant="extended"
                fontWeight="bolder"
                fontSize=".9em"
                size="large"
                color={"white"}
                backgroundColor={"var(--themeSDark--default)"}
                needBtnShadow={false}
            />
        </div>
    );

    return (
        <div className="hidden-content--root text-normal">
            {showTitle()}
            <List setMode={setMode} />
            {showBtnAction()}
        </div>
    );
}