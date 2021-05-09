import { useState, useEffect } from "react";
import useAPIList, {
    getBuyReviewsList,
    getXpReviewList,
    getTrigger,
} from "api/useAPIList";
import useData from "init";
import { updateUser } from "api/frequent";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import "./_BuyReviewList.scss";
import { isAfter } from "utils/dates/dateFns";
import BuyReviewCard from "./BuyReviewCard";
import BuyReviewFilter from "./BuyReviewFilter";

export default function BuyReviewList({ lastDateChecked, isBizAdmin = false }) {
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
    const params = { userId: isBizAdmin ? undefined : bizId, skip, filterBy };
    const trigger =
        bizId !== "..." &&
        getTrigger(null, null, { cond2: `filter_${filterBy}` });

    useAdminChecked(trigger, bizId, isBizAdmin);

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
        url: isBizAdmin ? getXpReviewList() : getBuyReviewsList(),
        skip,
        params,
        listName: isBizAdmin ? "xpReviewList" : "buyReviewList",
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

function useAdminChecked(trigger, bizId, isBizAdmin) {
    useEffect(() => {
        const runCheck = async () => {
            const path = isBizAdmin
                ? "bizTeamData.reviewLastChecked"
                : "clientAdminData.reviewLastChecked";
            const thisRole = isBizAdmin ? "nucleo-equipe" : "cliente-admin";
            const thisId = isBizAdmin ? "604a9b7dff36c40017476cee" : bizId; // for now, it will track only primary account, after can track dinamically to check who read the last time the reports

            const body = {
                [`${path}`]: new Date(),
            };

            await updateUser(thisId, thisRole, body);
        };

        if (trigger) {
            runCheck();
        }
    }, [trigger, isBizAdmin, bizId]);
}
