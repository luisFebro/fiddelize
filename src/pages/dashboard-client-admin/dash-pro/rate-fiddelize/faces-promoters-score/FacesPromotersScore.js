import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateUser } from "api/frequent";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import "./_FacesPromotersScore.css";
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
    role = "cliente-admin",
    showToast,
}) {
    const handleUpdate = async () => {
        const body = {
            "clientAdminData.review.nps": scale,
            "clientAdminData.review.npsUpdatedAt": new Date(),
        };

        await updateUser(userId, role, body);
        showToast("Avaliação recebida. Obrigada pelo retorno!", {
            type: "success",
        });
    };

    return (
        <section className="nps-rating--root">
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
            {scale && (
                <div className="my-4 mx-3 animated fadeInUp">
                    <ButtonFab
                        title="enviar avaliação"
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
