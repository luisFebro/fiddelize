import "./_FacesPromotersScore.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateUser } from "api/frequent";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
// NPS (Net Promoter Score) Rating

const facePatterns = [
    "angry",
    "angry",
    "frown",
    "frown",
    "meh",
    "meh",
    "grimace",
    "grimace",
    "grin-alt",
    "grin-alt",
];

export const getScaleText = (s) => {
    if (s === 1 || s === 2) return "raramente";
    if (s === 3 || s === 4) return "pouco provável";
    if (s === 5 || s === 6) return "talvez";
    if (s === 7 || s === 8) return "provável";
    if (s === 9 || s === 10) return "muito provável";
};

export default function FacesPromotersScore({
    scale,
    setScale,
    userId,
    role,
    showToast,
    removeReportField,
}) {
    const handleUpdate = async () => {
        showToast("Atualizando...", { dur: 3000 });

        const body = {
            "clientUserData.review.nps": scale,
            "clientUserData.review.npsUpdatedAt": new Date(),
        };

        await updateUser(userId, role, body).catch((err) => {
            console.log(`ERROR: ${err.response}`);
        });

        showToast("Avaliação Atualizada!", { type: "success" });
    };

    return (
        <section>
            <section>
                <div className="faces-group container-center shadow-elevation-black">
                    {facePatterns.map((f, ind) => (
                        <FontAwesomeIcon
                            key={ind}
                            icon={f}
                            className={`scale-${ind + 1} ${
                                scale === ind + 1 ? "curr-scale" : ""
                            }`}
                            onClick={() => setScale(ind + 1)}
                        />
                    ))}
                </div>
            </section>
            {removeReportField && (
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
            )}
        </section>
    );
}
