import React from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import extractStrData from "utils/string/extractStrData";
// import useCount from "hooks/useCount";
import {
    // textStyle,
    ShowTitle,
    ShowIllustration,
    ShowBrief,
} from "./DefaultRenderComps";

// const areEqual = ({state:prev}, {state:next}) =>
//   JSON.stringify(prev) !== JSON.stringify(next)

export default React.memo(Announcement);

function Announcement({ mainImg, content }) {
    const { brief, title, learnMoreUrl } = extractStrData(content);

    const showCTA = () => (
        <section className="container-center my-4">
            <ButtonFab
                title="Conhecer mais"
                backgroundColor="var(--themeSDark--default)"
                onClick={() => (window.location.href = learnMoreUrl)}
                position="relative"
                variant="extended"
                size="large"
            />
        </section>
    );

    return (
        <section>
            <ShowTitle text={title} />
            <ShowIllustration mainImg={mainImg} />
            <ShowBrief brief={brief} />
            {showCTA()}
        </section>
    );
}
