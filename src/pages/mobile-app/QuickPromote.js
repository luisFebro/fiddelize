import { useBizData } from "init";
import QrInvitationModal from "../app/team/registers-panel/types-handler/qr-code-invitation-btn/QrInvitationModal";
import { Link } from "react-router-dom";
import ButtonFab from "../../components/buttons/material-ui/ButtonFab";
import ShareSocialMediaButtons from "../../components/buttons/ShareSocialMediaButtons";

export default function QuickPromote({ handleFullClose }) {
    const { bizLogo, bizLinkName, themeSColor: sColor } = useBizData();

    const officialAdminLink = `https://fiddelize.com/${bizLinkName}`;

    const showSharingOpts = () => {
        const sharingData = {
            titleShare: "",
            pageImg: "",
            pageTitle: "Convite para participar do clube de fiddelidade",
            pageDescription: officialAdminLink,
            pageURL: officialAdminLink,
        };

        return (
            <div
                className="position-relative container-center"
                style={{
                    top: -20,
                }}
            >
                <ShareSocialMediaButtons
                    config={{ size: 50, radius: 50 }}
                    data={sharingData}
                />
            </div>
        );
    };

    return (
        <div>
            <QrInvitationModal
                isAdminQuickPromote
                handleFullClose={handleFullClose}
                img={bizLogo}
                qrValue={officialAdminLink}
            />
            {showSharingOpts()}
            <div className="text-center">
                <Link
                    to={`/${bizLinkName}/compartilhar-app`}
                    className="text-link text-white font-site text-em-1"
                >
                    Mais opções
                </Link>
            </div>
            <div style={{ marginBottom: 100 }} />
            <div
                className="position-relative container-center my-3"
                style={{
                    top: -15,
                }}
            >
                <ButtonFab
                    title="Voltar"
                    backgroundColor={`var(--themeSDark--${sColor})`}
                    onClick={handleFullClose}
                    position="relative"
                    variant="extended"
                    size="large"
                />
            </div>
        </div>
    );
}
