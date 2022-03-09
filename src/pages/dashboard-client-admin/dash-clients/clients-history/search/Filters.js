// custom icons
import SortByAlphaIcon from "@material-ui/icons/SortByAlpha";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import StarsIcon from "@material-ui/icons/Stars";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import DateRangeIcon from "@material-ui/icons/DateRange";
import EventIcon from "@material-ui/icons/Event";
import InstructionBtn from "components/buttons/InstructionBtn";
import AnimaIconsSelect from "components/fields/anima-icons-select/AnimaIconsSelect";
import FilterStatus from "components/fields/anima-icons-select/FilterStatus";
// import CakeIcon from "@material-ui/icons/Cake";

// do not include btn styling for free options...
const mainOptions = () => [
    {
        titleBr: "Ordem Alfabética A-Z",
        title: "alphabeticOrder",
        reverseBr: "Ordem Alfabética Z-A",
        reverse: "alphabeticOrderZA",
        Icon: <SortByAlphaIcon />,
    },
    {
        titleBr: "Clientes Novos",
        title: "newCustomers",
        reverseBr: "Clientes Veteranos",
        reverse: "veteranCustomers",
        Icon: <StarsIcon />,
    },
    {
        titleBr: "Clientes Fãs (compram mais)",
        title: "buyMoreCustomers",
        reverseBr: "Clientes Compram Menos",
        reverse: "buyLessCustomers",
        Icon: <LoyaltyIcon />,
    },
    {
        titleBr: "Maiores Valores por Compra",
        title: "highestSinglePurchases",
        reverseBr: "Menores Valores por Compra",
        reverse: "lowestSinglePurchases",
        Icon: <MonetizationOnIcon />,
    },
    {
        titleBr: "Últimas Compras",
        title: "lastPurchases",
        reverseBr: "Primeiras Compras",
        reverse: "firstPurchases",
        Icon: <LocalMallIcon />,
    },
];

const periodOptions = () => [
    {
        titleBr: "Tudo",
        title: "all",
        reverseBr: null,
        reverse: null,
        Icon: <EventIcon />,
    },
    {
        titleBr: "Hoje",
        title: "day",
        reverseBr: null,
        reverse: null,
        Icon: <EventIcon />,
    },
    {
        titleBr: "Semana atual",
        title: "week",
        reverseBr: null,
        reverse: null,
        Icon: <EventIcon />,
    },
    {
        titleBr: "Mês atual",
        title: "month",
        reverseBr: null,
        reverse: null,
        Icon: <EventIcon />,
    },
    {
        titleBr: "Ano atual",
        title: "year",
        reverseBr: null,
        reverse: null,
        Icon: <EventIcon />,
    },
];

export default function Filters({
    listTotal,
    loading,
    handleMainFilter,
    handlePeriodFilter,
    emptyType,
}) {
    const defaultMainIcon = <StarsIcon />;
    const defaultPeriodIcon = <DateRangeIcon />;

    const showCategories = () =>
        (listTotal !== 0 || emptyType === "filter") && (
            <section className="mt-5 position-relative text-p text-left pl-2">
                <div className="d-flex">
                    <span className="mr-5 d-inline-block text-p text-subtitle font-weight-bold text-p text-left font-weight-bold">
                        Organize por:
                    </span>
                    <div className="position-absolute" style={{ right: 20 }}>
                        <InstructionBtn
                            mode="modal"
                            article="OrgganizeClientsFilter"
                        />
                    </div>
                </div>

                <br />
                <AnimaIconsSelect
                    callback={handleMainFilter}
                    optionsArray={mainOptions}
                    defaultSelected="Clientes Novos"
                    defaultSideIcon={defaultMainIcon}
                    offlineKey="selectedMainFilter"
                />
                <span className="d-inline-block mt-4 mb-1 text-p text-normal text-left font-weight-bold" />
                <AnimaIconsSelect
                    callback={handlePeriodFilter}
                    defaultSelected="Hoje"
                    optionsArray={periodOptions}
                    defaultSideIcon={defaultPeriodIcon}
                    offlineKey="selectedPeriodFilter"
                    width={200}
                    needReverseBtn={false}
                    zIndex={4}
                />
                <section className="my-3">
                    <FilterStatus loading={loading} />
                </section>
            </section>
        );

    return <section>{showCategories()}</section>;
}

/* ARCHIVES

{
    titleBr: "Clientes Aniversariantes",
    title: "birthdayCustomers",
    reverseBr: null,
    reverse: null,
    Icon: <CakeIcon />,
},

{
    titleBr: "Maiores Pontos Ativos",
    title: "highestActiveScores",
    reverseBr: "Menores Pontos Ativos",
    reverse: "lowestActiveScores",
    Icon: <FiberManualRecordIcon />,
},
 */
