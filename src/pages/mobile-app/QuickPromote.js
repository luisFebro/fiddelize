import QrInvitationModal from "../app/team/registers-panel/types-handler/qr-code-invitation-btn/QrInvitationModal";
import { useClientAdmin } from "../../hooks/useRoleData";
import { CLIENT_URL } from "../../config/clientUrl";
import ButtonFab from "../../components/buttons/material-ui/ButtonFab";
import ShareSocialMediaButtons from "../../components/buttons/ShareSocialMediaButtons";

export default function QuickPromote({ handleFullClose }) {
    const {
        selfBizLogoImg: bizLogo,
        bizCodeName,
        selfThemeSColor: sColor,
    } = useClientAdmin();

    const indLastSlash = bizCodeName.lastIndexOf("-");
    const onlyBizCode = bizCodeName.slice(indLastSlash + 1);
    const officialAdminLink = `${CLIENT_URL}/app/${onlyBizCode}`;

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
                className="position-relative container-center mb-5"
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
