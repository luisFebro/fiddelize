import Title from "components/Title";
import { useBizData } from "init";
import LoadableVisible from "components/code-splitting/LoadableVisible";
import DashSectionTitle from "../../DashSectionTitle";
import ClientReviews from "./clients-reviews/ClientsReviews";
// import ClientsBirthdayMsgBtn from "./clients-birthday-msg/ClientsBirthdayMsgBtn";

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

    const SectionTitle = getTitle(bizName);

    return (
        <div>
            <DashSectionTitle title={SectionTitle} />
            <ClientReviews />
            <hr className="lazer-purple" />
            <Title
                title="&#187; Pódio Maiores Fãs"
                subTitle="todos os tempos"
                color="var(--themeP)"
                margin="my-5"
                padding=" "
            />
            <AsyncRankingPondium />
            <hr className="lazer-purple" />
            <Title
                title="&#187; Clientes do seu clube de compras"
                color="var(--themeP)"
                margin="mb-0"
            />
            <AsyncRecordedClientsList />
        </div>
    );
}

/* ARCHIVES

<section className="position-relative">
    <div className="automatic-fiddelize-robot position-absolute animated fadeInUp delay-3s slow">
        <img
            className="shadow-elevation-black animated fadeInUp slow delay-1s"
            src="/img/icons/auto-fiddelize-robot.svg"
            height="auto"
            width={100}
            alt="robô fiddelize de automação"
        />
        <style jsx>
            {`
                .automatic-fiddelize-robot {
                    top: -30px;
                    left: -30px;
                }
            `}
        </style>
    </div>
    <Title
        title="&#187; Aniversário de clientes"
        subTitle="Envie automaticamente uma mensagem para todos seus clientes lembrarem da sua marca neste dia importante para eles"
        subTitleClassName="text-small font-weight-bold"
        color="var(--themeP)"
        padding=" "
    />
</section>
<ClientsBirthdayMsgBtn />

 */
