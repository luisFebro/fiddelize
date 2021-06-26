// custom icons
import SortIcon from "@material-ui/icons/Sort";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import AnimaIconsSelect from "components/fields/anima-icons-select/AnimaIconsSelect";
import FilterStatus from "components/fields/anima-icons-select/FilterStatus";

const filterOptions = (isPro) => [
    {
        titleBr: "Tudo",
        title: "all",
        reverseBr: null,
        reverse: null,
        showEmptyOption: null,
        isPro: false,
        Icon: <SortIcon />,
    },
    {
        titleBr: "Notas Maiores",
        title: "highGrades",
        reverseBr: null,
        reverse: null,
        showEmptyOption: null,
        isPro: false,
        Icon: <ArrowUpwardIcon />,
    },
    {
        titleBr: "Notas Menores",
        title: "lowGrades",
        reverseBr: null,
        reverse: null,
        showEmptyOption: null,
        isPro: false,
        Icon: <ArrowDownwardIcon />,
    },
];

export default function TeamTasksFilter({
    listTotal,
    loading,
    handlePeriodFilter,
    emptyType = "filter",
    gotData,
}) {
    const defaultPeriodIcon = <SortIcon />;

    const showCategories = () =>
        (listTotal !== 0 || emptyType === "filter") && (
            <section className="mt-5 position-relative text-p text-left pl-2">
                <AnimaIconsSelect
                    callback={handlePeriodFilter}
                    defaultSelected="Tudo"
                    optionsArray={filterOptions}
                    defaultSideIcon={defaultPeriodIcon}
                    offlineKey=""
                    width={200}
                    needReverseBtn={false}
                    zIndex={4}
                />
                <section className="my-3">
                    <FilterStatus loading={loading} gotData={gotData} />
                </section>
            </section>
        );

    return <section>{showCategories()}</section>;
}
