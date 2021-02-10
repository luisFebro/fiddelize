import React, { Fragment } from "react";
import ButtonMulti from "../../../../components/buttons/material-ui/ButtonMulti";
import { withRouter } from "react-router-dom";
// import extractStrData from "../../../../utils/string/extractStrData";
// import useCount from '../../../../hooks/useCount';
import {
    // textStyle,
    ShowTitle,
    ShowIllustration,
    ShowBrief,
    ShowActionBtn,
} from "./DefaultRenderComps";

function Score({
    history,
    brief,
    role,
    mainImg,
    bizLogo,
    bizName,
    userName,
    isWelcome = false,
    subtype,
    content,
}) {
    const isNewScore = subtype === "scorePlus   ";

    // const contentData = content && extractStrData(content);

    const handleCTA = () => {
        history.push("/cartao-virtual");
    };

    const showMainIllustration = () => (
        <Fragment>
            <ShowIllustration role={role} mainImg={mainImg} bizLogo={bizLogo} />
        </Fragment>
    );

    const handleTitle = () => {
        if (isNewScore) return "Nova pontuação";
    };

    const ChildrenBtn = () => (
        <ButtonMulti
            title="Abrir Cartão"
            color="var(--mainWhite)"
            backgroundColor="var(--themeP)"
            onClick={handleCTA}
        />
    );

    return (
        <section>
            <ShowTitle text={handleTitle()} />
            {showMainIllustration()}
            <ShowBrief brief={brief} />
            <ShowActionBtn children={<ChildrenBtn />} />
        </section>
    );
}

export default withRouter(Score);
