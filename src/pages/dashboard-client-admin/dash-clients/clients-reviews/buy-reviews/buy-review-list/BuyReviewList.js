import { useState, useEffect } from "react";
import BuyReviewCard from "./BuyReviewCard";
import BuyReviewFilter from "./BuyReviewFilter";
import useAPIList, {
    getBuyReviewsList,
    getTrigger,
} from "../../../../../../hooks/api/useAPIList";
import useData from "../../../../../../hooks/useData";
import useElemDetection, {
    checkDetectedElem,
} from "../../../../../../hooks/api/useElemDetection";
import getAPI, { updateUser } from "../../../../../../utils/promises/getAPI";
import "./_BuyReviewList.scss";
import { isAfter } from "../../../../../../utils/dates/dateFns";

export default function BuyReviewList({ lastDateChecked }) {
    const [skip, setSkip] = useState(0);
    const [data, setData] = useState({
        filterBy: "all",
        isFiltering: false,
    });
    const { filterBy, isFiltering } = data;

    const handlePeriodFilter = (dataFilter) => {
        setSkip(0);
        setData({ filterBy: dataFilter.selected, isFiltering: true });
        setTimeout(() => {
            setData((prev) => ({ ...prev, isFiltering: false }));
        }, 4000);
    };

    const [bizId] = useData(["userId"]); // yep! userId is the same for bizId when it is the cli-admin logged in
    const params = { userId: bizId, skip, filterBy };
    const trigger =
        bizId !== "..." &&
        getTrigger(null, null, { cond2: `filter_${filterBy}` });

    useAdminChecked(trigger, bizId);

    const {
        list: reviewsList,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        needEmptyIllustra,
        hasMore,
        isOffline,
        ShowOverMsg,
        gotData,
        listTotal,
    } = useAPIList({
        url: getBuyReviewsList(),
        skip,
        params,
        listName: "buyReviewList",
        trigger,
        isFiltering,
    });

    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
    });

    const showFilter = () => (
        <section className="container-center my-3">
            <BuyReviewFilter
                gotData={gotData}
                listTotal={listTotal}
                handlePeriodFilter={handlePeriodFilter}
                loading={loading}
            />
        </section>
    );

    const showList = () => (
        <section className="container-center-col">
            {reviewsList.map((re, ind) => {
                const isCardNew = isAfter(
                    // is reportUpdated newest/latest than when admin checked it in the last time?
                    new Date(re.reportUpdatedAt),
                    new Date(lastDateChecked)
                );
                const commonCardData = {
                    isCardNew,
                    data: re,
                };

                return checkDetectedElem({
                    list: reviewsList,
                    ind,
                    indFromLast: 5,
                }) ? (
                    <section key={ind} ref={detectedCard}>
                        <BuyReviewCard {...commonCardData} />
                    </section>
                ) : (
                    <section key={ind}>
                        <BuyReviewCard {...commonCardData} />
                    </section>
                );
            })}
        </section>
    );

    const totalReviews = listTotal;
    const plural = totalReviews === 1 ? "" : "s";
    const showTotalReviews = () => (
        <p className="text-p text-normal my-3 text-left">
            <span className="font-weight-bold">Total:</span>
            {loading
                ? " ..."
                : ` ${totalReviews} relato${plural} publicado${plural}.`}
        </p>
    );

    return (
        <section className="mx-3">
            {showFilter()}
            {showTotalReviews()}
            {showList()}
            {error && <ShowError />}
            {loading && <ShowLoadingSkeleton />}
            <ShowOverMsg />
        </section>
    );
}

function useAdminChecked(trigger, bizId) {
    useEffect(() => {
        const runCheck = async () => {
            await getAPI({
                method: "put",
                url: updateUser(bizId, "cliente-admin"),
                body: {
                    "clientAdminData.reviewLastChecked": new Date(),
                },
                trigger,
            }).catch((err) => {
                console.log(`ERROR: ${err}`);
            });
        };

        trigger && runCheck();
    }, [trigger]);
}
