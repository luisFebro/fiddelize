import DashSectionTitle from "../../DashSectionTitle";
import Title from "../../../components/Title";
import { useBizData } from "init";
import { useProfile } from "init";
import LoadableVisible from "../../../components/code-splitting/LoadableVisible";
import ClientReviews from "./clients-reviews/ClientsReviews";
import ClientsBirthdayMsgBtn from "./clients-birthday-msg/ClientsBirthdayMsgBtn";

const AsyncAutomaticToDoList = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./automatic-to-do-list" /* webpackChunkName: "auto-tasks-comp-lazy" */
        ),
});

const AsyncRankingPondium = LoadableVisible({
    loading: true,
    loader: () =>
        import("./RankingPondium" /* webpackChunkName: "podium-comp-lazy" */),
});
const AsyncRecordedClientsList = LoadableVisible({
    logo: true,
    loading: true,
    loader: () =>
        import(
            "./clients-history/AsyncRecordedClientsList" /* webpackChunkName: "clients-history-session-lazy" */
        ),
});
// END COMPONENTS

const getTitle = (bizName) => (
    <span className="text-subtitle font-weight-bold">
        Clientes da
        <br />
        <span className="text-title">{bizName && bizName.cap()}</span>
    </span>
);

export default function DashClients() {
    const { bizName } = useBizData();
    const { name } = useProfile();

    const SectionTitle = getTitle(bizName);

    return (
        <div>
            <DashSectionTitle title={SectionTitle} />
            <ClientReviews />
            <hr className="lazer-purple" />
            <AsyncAutomaticToDoList />
            <hr className="lazer-purple" />
            <Title
                title="&#187; Pódio Fidelidade"
                color="var(--themeP)"
                margin="my-5"
                padding=" "
            />
            <AsyncRankingPondium />
            <Title
                title="&#187; Aniversário de clientes"
                subTitle="Envie automaticamente uma mensagem para todos seus clientes lembrarem da sua marca em um dia especial"
                subTitleClassName="text-small font-weight-bold"
                color="var(--themeP)"
                padding=" "
            />
            <ClientsBirthdayMsgBtn />
            <hr className="lazer-purple" />
            <Title
                title="&#187; Histórico de Clientes"
                color="var(--themeP)"
                margin=""
            />
            <AsyncRecordedClientsList />
        </div>
    );
}
