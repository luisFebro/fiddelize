import DateRangeIcon from "@material-ui/icons/DateRange";
import EventIcon from "@material-ui/icons/Event";
import AnimaIconsSelect from "components/fields/anima-icons-select/AnimaIconsSelect";
import FilterStatus from "components/fields/anima-icons-select/FilterStatus";

const periodOptions = (isPro) => [
    {
        titleBr: "Tudo",
        title: "all",
        reverseBr: null,
        reverse: null,
        showEmptyOption: null,
        isPro: false,
        Icon: <EventIcon />,
    },
    {
        titleBr: "Hoje",
        title: "today",
        reverseBr: null,
        reverse: null,
        showEmptyOption: null,
        isPro: false,
        Icon: <EventIcon />,
    },
];

export default function TeamTasksFilter({
    listTotal,
    loading,
    handlePeriodFilter,
    emptyType = "filter",
    gotData,
    show = true,
}) {
    const defaultPeriodIcon = <DateRangeIcon />;

    const showCategories = () =>
        ((show && listTotal !== 0) || (show && emptyType === "filter")) && (
            <section className="mt-4 animated fadeInUp position-relative text-p text-left pl-2">
                <AnimaIconsSelect
                    callback={handlePeriodFilter}
                    defaultSelected="Hoje"
                    optionsArray={periodOptions}
                    defaultSideIcon={defaultPeriodIcon}
                    offlineKey="selectedPeriodFilter_memberTasksHistory"
                    width={200}
                    needReverseBtn={false}
                    zIndex={4}
                />
                <section className="mb-3">
                    <FilterStatus loading={loading} gotData={gotData} />
                </section>
            </section>
        );

    return <section>{showCategories()}</section>;
}
