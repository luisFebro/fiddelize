import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import useContext from "context";
import disconnect from "auth/disconnect";

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
        title: "regras",
        onClick: () => {
            if (needAppForPreview) return;
            if (needAppForCliAdmin) history.push("/regulamento?client-admin=1");
            else history.push("/regulamento");
        },
    },
    {
        icon: (
            <ExitToAppIcon className="icon-shadow" style={{ fontSize: 50 }} />
        ),
        title: "sair",
        onClick: () => {
            if (needAppForPreview) return;
            disconnect({ msg: true });
        },
    },
];

export default function MoreOptionsMenu({ history }) {
    const {
        txtColor,
        needAppForCliAdmin,
        needAppForPreview,
        themeBackColor: colorBack,
    } = useContext();

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
            style={{
                background: `var(--themePLight--${colorBack})`,
            }}
        >
            {typeof item.icon === "string" ? (
                <FontAwesomeIcon
                    icon={item.icon}
                    className="icon-shadow"
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
        <section className={`mx-3 text-normal ${txtColor}`}>
            <h2 className="py-4 animated fadeIn text-subtitle font-weight-bold text-center">
                Mais opções
            </h2>
            <section className="animated fadeInUp container mb-5">
                <div className="row justify-content-around">{menuList}</div>
            </section>
        </section>
    );
}
