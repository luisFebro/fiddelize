import useBackColor from "../../hooks/useBackColor";
import AppList from "./apps-list/AppList";

export default function AppsPanel({ history }) {
    useBackColor("var(--mainWhite)");

    return (
        <section className="text-p text-center mx-3">
            <header className="my-4">
                <h1 className="font-weight-bold text-em-1-9 main-font">
                    Painel de Apps
                </h1>
                <h2 className="text-normal font-weight-bold">
                    Uma conta. Acesse todos seus apps.
                </h2>
            </header>
            <AppList history={history} />
        </section>
    );
}
