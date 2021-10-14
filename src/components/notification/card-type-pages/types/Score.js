import { Fragment } from "react";
import { withRouter } from "react-router-dom";
import ButtonMulti from "../../../buttons/material-ui/ButtonMulti";
import resetAddPtsData from "pages/client/points-panel/helpers/resetAddPtsData";

// import extractStrData from "../../../../utils/string/extractStrData";
// import useCount from '../../../../hooks/useCount';
import {
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
    subtype,
    // bizName,
    // userName,
    // isWelcome = false,
    // content,
}) {
    const isNewPoints = subtype === "pointPlus";

    // const contentData = content && extractStrData(content);

    const handleCTA = () => {
        resetAddPtsData().then(() => {
            history.push("/cartao-virtual");
        });
    };

    const showMainIllustration = () => (
        <Fragment>
            <ShowIllustration role={role} mainImg={mainImg} bizLogo={bizLogo} />
        </Fragment>
    );

    const handleTitle = () => {
        if (isNewPoints) return "Nova pontuação";
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
