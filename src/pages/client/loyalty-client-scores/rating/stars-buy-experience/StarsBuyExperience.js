import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateUser } from "api/frequent";
import MuSlider from "components/sliders/MuSlider";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import "./_StarsBuyExperience.css";

export const getGradeText = (g) => {
    if (g === 1) return "Péssimo";
    if (g === 2 || g === 3) return "Ruim";
    if (g === 4) return "Regular";
    if (g === 5) return "Indiferente";
    if (g === 6) return "Normal";
    if (g === 7) return "Satisfatório";
    if (g === 8) return "Bom";
    if (g === 9) return "Ótimo";
    if (g === 10) return "Excelente";
};

// 3 STAR STATUS
const showEmptyStar = () => (
    <FontAwesomeIcon icon="star" className="empty-star" />
);

const showHalfStar = () => (
    <div className="half-star">
        <FontAwesomeIcon className="half" icon="star-half" />
        <FontAwesomeIcon className="full" icon="star" />
    </div>
);

const showFullStar = (currStar) => (
    <FontAwesomeIcon
        icon="star"
        className={`entire-full ${
            currStar ? "curr-star-full animated rubberBand" : ""
        }`}
    />
);

const starStatus = (currStar) => ({
    empty: showEmptyStar(),
    half: showHalfStar(),
    full: showFullStar(currStar),
});

const starPatterns = {
    1: ["half", "empty", "empty", "empty", "empty"],
    2: ["full", "empty", "empty", "empty", "empty"],
    3: ["full", "half", "empty", "empty", "empty"],
    4: ["full", "full", "empty", "empty", "empty"],
    5: ["full", "full", "half", "empty", "empty"],
    6: ["full", "full", "full", "empty", "empty"],
    7: ["full", "full", "full", "half", "empty"],
    8: ["full", "full", "full", "full", "empty"],
    9: ["full", "full", "full", "full", "half"],
    10: ["full", "full", "full", "full", "full"],
};
// END 3 STAR STATUS

export default function StarsBuyExperience({
    handleGrade,
    grade,
    userId,
    role,
    showToast,
    removeReportField,
}) {
    const handleUpdate = async () => {
        showToast("Atualizando...", { dur: 3000 });
        const body = {
            "clientUserData.review.xpScore": grade,
            "clientUserData.review.xpUpdatedAt": new Date(),
        };

        await updateUser(userId, role, body);
        showToast("Avaliação da experiência de compra atualizada!", {
            type: "success",
        });
    };

    return (
        <Fragment>
            <section className="stars-rating--root d-flex justify-content-center">
                {starPatterns[grade].map((patt, ind) => {
                    const isCurrStar = ind + 1 === Math.ceil(grade / 2);

                    return (
                        <div
                            key={ind}
                            className="stars-group shadow-elevation-black"
                        >
                            {starStatus(isCurrStar)[patt]}
                        </div>
                    );
                })}
            </section>
            <MuSlider
                color="var(--niceUiYellow)"
                width="85%"
                value={grade}
                callback={handleGrade}
                disabled={false}
                max={10}
                min={1}
                defaultValue={5}
                valueLabelDisplay="off"
            />
            {removeReportField ? (
                <div className="my-4 mx-3">
                    <ButtonFab
                        title="atualizar"
                        size="large"
                        onClick={handleUpdate}
                        width="100%"
                        position="relative"
                        backgroundColor="var(--themeSDark)"
                        variant="extended"
                    />
                </div>
            ) : (
                <div className="instru text-shadow my-3 container-center">
                    <FontAwesomeIcon icon="arrow-left" />
                    {"  "}
                    Deslize para mudar
                    {"  "}
                    <FontAwesomeIcon icon="arrow-right" />
                </div>
            )}
        </Fragment>
    );
}
