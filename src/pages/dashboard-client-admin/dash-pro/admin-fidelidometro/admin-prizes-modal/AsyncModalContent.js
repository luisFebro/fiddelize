import Img from "../../../../../components/Img";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
import RedirectLink from "../../../../../components/RedirectLink";

export default function AsyncModalContent() {
    // const { _id: userId } = useProfile();

    const showTitle = () => (
        <div className="mt-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Fiddelize Prêmios
            </p>
        </div>
    );

    const showNoDataIllustra = () =>
        true && ( // needEmptyIllustra && !isOffline
            <div className="container-center my-5">
                <Img
                    src="/img/illustrations/club-pro/empty-admin-prizes.png"
                    mode="skeleton"
                    width="100%"
                    alt="Ilustração prêmios admin"
                    offline
                    title={
                        '<span class="d-inline-block text-subtitle font-weight-bold text-purple">Nenhum prêmio.</span><p class="mx-3 text-normal font-weight-bold text-purple">Acumule pontos e ganhe prêmios da Fiddelize!</p>'
                    }
                />
                <RedirectLink to="/planos?cliente-admin=1">
                    <ButtonFab
                        size="large"
                        title="Começar"
                        onClick={null}
                        backgroundColor="var(--themeSDark--default)"
                        variant="extended"
                        position="relative"
                    />
                </RedirectLink>
            </div>
        );

    return (
        <section className="mb-5">
            {showTitle()}
            {showNoDataIllustra()}
        </section>
    );
}

/*
const {
    list = [], listTotal,
    readyShowElems, needEmptyIllustra,
    loading, ShowLoadingSkeleton,
    error, ShowError,
    isPlural,
    hasMore,
} = useAPIList({ url: readTasks(userId, true), trigger, skip, listName: "automaticTaskListDone" });

const detectedCard = useElemDetection({ loading, hasMore, setSkip });

const showTotalTasks = () => {
    if(readyShowElems) {
        return(
            <div className="text-center my-3 text-normal font-weight-bold text-purple">
                <span style={{fontSize: '25px'}}>✔ {listTotal}</span> tarefa{isPlural}.
            </div>
        );
    }

    if(isOffline) {
        return(
            <div className="text-center my-3 text-normal font-weight-bold text-purple">
                <span style={{fontSize: '25px'}}>✔ Últimas Tarefas Offline</span>
            </div>
        );
    }
}

const listMap = list.map((task, ind) => {
    const  props = {
        key: task._id,
        data: task,
        defaultStatus: true,
        className: "mx-2"
    }

    return checkDetectedElem({ list, ind, indFromLast: 2 })
    ? <TaskCard {...props} ref={detectedCard} />
    : <TaskCard {...props} />
})

const showOverMsg = () => (
    !hasMore && readyShowElems &&
    <p
        className="text-normal text-center font-weight-bold text-purple"
        style={{margin: '100px 0'}}
    >
        Isso é tudo.
    </p>
);

{showTotalTasks()}
{listMap}
{loading && <ShowLoadingSkeleton size="large" />}
{error && <ShowError />}
{showOverMsg()}
 */
