import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import CommentField from "components/fields/CommentField";
// import { useEffect } from "react";
// import showToast from "components/toasts";
// import getId from "utils/getId";

export default function CoreOptionsForm({
    benefitDesc,
    setData, // required
    isPlatform = false,
    callback,
    // history, // only for platform to continue new club creation
}) {
    // const GAME = "balloonPop";

    return (
        <form className="text-normal my-5 discount-back-form text-shadow">
            {false && ( // !isPlatform
                <h2 className="text-center text-subtitle font-weight-bold my-3">
                    Null
                </h2>
            )}
            <CommentField
                setValue={setData}
                name="benefitDesc"
                value={benefitDesc}
                placeholder="Descreva seu benefício. Ex.: desconto, brinde, etc"
                rows={2}
                maxLen={200}
                maxLenColor="#fff"
                maxLenTxtSize="0-7"
            />
            <div className="container-center mb-4 mt-5">
                <ButtonFab
                    position="relative"
                    onClick={callback}
                    title={isPlatform ? "continuar" : "adicionar"}
                    iconFontAwesome={
                        <FontAwesomeIcon
                            icon={isPlatform ? "arrow-right" : "plus"}
                        />
                    }
                    variant="extended"
                    width="90%"
                    size="large"
                    color="white"
                    backgroundColor="var(--themeSDark--default)"
                />
            </div>
            <style jsx>
                {`
                    .discount-back-form {
                        color: #fff;
                        padding: 10px;
                        background-color: var(--themeP);
                        border-radius: 20px;
                    }

                    .discount-back-form .goal-value {
                        background-color: var(--themePDark);
                    }
                `}
            </style>
        </form>
    );
}

/* ARCHIVES


const handleUpdateFromSite = async () => {
    if (!targetPoints)
        return showToast("Insira o valor da META EM PONTOS", {
            type: "error",
        });

    const data = {
        game: GAME,
        doneGamesPanel: true,
        clientAdminData: {
            games: {
                discountBack: {
                    on: true,
                    challList: [
                        {
                            id: getId(),
                            targetPoints,
                            targetMoney,
                            perc,
                        },
                    ],
                },
            },
        },
    };

    const { setVars } = await import("init/var");
    await setVars(data, "pre_register");
    history.push("/novo-clube/info-negocio");
    return null;
};

 */
