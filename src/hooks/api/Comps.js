import Skeleton from "@material-ui/lab/Skeleton";
import Spinner from "../../components/loadingIndicators/Spinner";

export const ShowLoadingComp = ({ size = "small" }) => (
    <Spinner marginY={100} size={size} />
);

const taskSkeleton = {
    rect: {
        backgroundColor: "grey",
    },
    text: {
        backgroundColor: "grey",
        marginLeft: 150,
    },
};
export const ShowTaskSkeleton = () => (
    <section className="my-2">
        <Skeleton
            width={350}
            height={135}
            variant="rect"
            style={taskSkeleton.rect}
        />
        <Skeleton
            variant="text"
            width={200}
            height={40}
            style={taskSkeleton.text}
        />
    </section>
);
