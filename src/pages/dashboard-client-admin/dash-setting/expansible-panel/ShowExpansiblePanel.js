import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useData from "init";
import ConfigExpansiblePanel from "./ConfigExpansiblePanel";
import HiddenVerifPass from "../card-hidden-content/HiddenVerifPass";
import HiddenProfile from "../card-hidden-content/HiddenProfile";
import HiddenPushNotif from "../card-hidden-content/push-notif/HiddenPushNotif";
import HiddenBizDataAndBackup from "../card-hidden-content/biz-data-and-backup/HiddenBizDataAndBackup";

const faStyle = {
    fontSize: "40px",
    filter: "drop-shadow(.5px .5px 1.5px black)",
    color: "white",
};

export default function ShowExpansiblePanel() {
    const userData = useData();

    const configList = [
        {
            id: 0,
            name: "Seu Perfil",
            leftIcon: <FontAwesomeIcon icon="user" />,
            hiddenContent: <HiddenProfile userData={userData} />,
        },
        {
            id: 1,
            name: "Senhas",
            leftIcon: <FontAwesomeIcon icon="lock" />,
            hiddenContent: <HiddenVerifPass userData={userData} />,
        },
        {
            id: 2,
            name: "Notificações",
            leftIcon: <FontAwesomeIcon icon="comment" />,
            hiddenContent: <HiddenPushNotif />,
        },
        {
            id: 3,
            name: "Dados Projeto<br />e Segurança",
            leftIcon: <FontAwesomeIcon icon="database" />,
            hiddenContent: <HiddenBizDataAndBackup userData={userData} />,
        },
    ];

    const handleMainHeading = (config) => (
        <section className="card-main-heading--root">
            <div className="icon" style={faStyle}>
                {config.leftIcon}
            </div>
            <p className="text text-nowrap text-subtitle font-weight-bold text-shadow">
                {parse(config.name)}
            </p>
        </section>
    );

    const actions = configList.map((config) => ({
        _id: config.id,
        mainHeading: handleMainHeading(config),
        secondaryHeading: null,
        configData: config,
        hiddenContent: config.hiddenContent,
    }));

    return (
        <ConfigExpansiblePanel
            actions={actions}
            backgroundColor="var(--themePLight)"
            color="white"
            needToggleButton={false}
        />
    );
}
