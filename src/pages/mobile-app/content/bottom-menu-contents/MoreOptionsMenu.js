import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import useContext from "global/Context";
import { disconnect } from "../../../../hooks/useAuthUser";

const allMenuList = ({ needAppForPreview, needAppForCliAdmin, history }) => [
    {
        icon: "sync-alt",
        title: "trocar app",
        onClick: () => {
            if (!needAppForPreview) history.push("/painel-de-apps");
        },
    },
    {
        icon: "file-contract",
        title: "regulamento",
        onClick: () => {
            if (needAppForPreview) return;
            if (needAppForCliAdmin) history.push("/regulamento?client-admin=1");
            else history.push("/regulamento");
        },
    },
    {
        icon: <ExitToAppIcon style={{ fontSize: 50 }} />,
        title: "sair",
        onClick: () => {
            if (needAppForPreview) return;
            disconnect();
        },
    },
];

export default function MoreOptionsMenu({ history }) {
    const { needAppForCliAdmin, needAppForPreview } = useContext();
    const payload = {
        history,
        needAppForCliAdmin,
        needAppForPreview,
        // colorS,
    };

    const menuList = allMenuList(payload).map((item) => (
        <div
            role="button"
            key={item.title}
            className="cursor-pointer py-3 shadow-babadoo col-6 mb-4 container-center-col"
            onClick={item.onClick}
        >
            {typeof item.icon === "string" ? (
                <FontAwesomeIcon
                    icon={item.icon}
                    style={{
                        fontSize: 50,
                    }}
                />
            ) : (
                item.icon
            )}
            <p className="m-0 text-normal font-weight-bold text-center">
                {item.title}
            </p>
        </div>
    ));

    return (
        <section className="text-normal text-purple">
            <h2 className="animated fadeInUp text-subtitle font-weight-bold text-center">
                Mais opções
            </h2>
            <section className="animated fadeInUp container my-3">
                <div className="row">{menuList}</div>
            </section>
        </section>
    );
}
