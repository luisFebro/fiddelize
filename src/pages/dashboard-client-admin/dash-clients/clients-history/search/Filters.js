// custom icons
import SortByAlphaIcon from "@material-ui/icons/SortByAlpha";
import CakeIcon from "@material-ui/icons/Cake";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import StarsIcon from "@material-ui/icons/Stars";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import DateRangeIcon from "@material-ui/icons/DateRange";
import EventIcon from "@material-ui/icons/Event";
import PremiumButton from "components/buttons/premium/PremiumButton";
import AnimaIconsSelect from "components/fields/anima-icons-select/AnimaIconsSelect";
import FilterStatus from "components/fields/anima-icons-select/FilterStatus";

// do not include btn styling for free options...
const mainOptions = (isPro) => [
    {
        titleBr: "Ordem Alfabética A-Z",
        title: "alphabeticOrder",
        reverseBr: "Ordem Alfabética Z-A",
        reverse: "alphabeticOrderZA",
        isPro: false,
        Icon: <SortByAlphaIcon />,
    },
    {
        titleBr: "Maiores Pontos Ativos",
        title: "highestActiveScores",
        reverseBr: "Menores Pontos Ativos",
        reverse: "lowestActiveScores",
        isPro: false,
        Icon: <FiberManualRecordIcon />,
    },
    {
        titleBr: "Clientes Novos",
        title: "newCustomers",
        reverseBr: "Clientes Veteranos",
        reverse: "veteranCustomers",
        isPro: false,
        Icon: <StarsIcon />,
    },
    {
        titleBr: "Clientes Aniversariantes",
        title: "birthdayCustomers",
        reverseBr: null,
        reverse: null,
        isPro: true,
        Icon: <CakeIcon style={{ color: isPro ? undefined : "grey" }} />,
    },
    {
        titleBr: "Clientes Fãs (compram mais)",
        title: "buyMoreCustomers",
        reverseBr: "Clientes Compram Menos",
        reverse: "buyLessCustomers",
        isPro: true,
        Icon: <LoyaltyIcon style={{ color: isPro ? undefined : "grey" }} />,
    },
    {
        titleBr: "Maiores Valores por Compra",
        title: "highestSinglePurchases",
        reverseBr: "Menores Valores por Compra",
        reverse: "lowestSinglePurchases",
        isPro: true,
        Icon: (
            <MonetizationOnIcon style={{ color: isPro ? undefined : "grey" }} />
        ),
    },
    {
        titleBr: "Últimas Compras",
        title: "lastPurchases",
        reverseBr: "Primeiras Compras",
        reverse: "firstPurchases",
        isPro: true,
        Icon: <LocalMallIcon style={{ color: isPro ? undefined : "grey" }} />,
    },
];

const periodOptions = (isPro) => [
    {
        titleBr: "Tudo",
        title: "all",
        reverseBr: null,
        reverse: null,
        isPro: false,
        Icon: <EventIcon />,
    },
    {
        titleBr: "Hoje",
        title: "day",
        reverseBr: null,
        reverse: null,
        isPro: false,
        Icon: <EventIcon />,
    },
    {
        titleBr: "Semana atual",
        title: "week",
        reverseBr: null,
        reverse: null,
        isPro: true,
        Icon: <EventIcon style={{ color: isPro ? undefined : "grey" }} />,
    },
    {
        titleBr: "Mês atual",
        title: "month",
        reverseBr: null,
        reverse: null,
        isPro: true,
        Icon: <EventIcon style={{ color: isPro ? undefined : "grey" }} />,
    },
    {
        titleBr: "Ano atual",
        title: "year",
        reverseBr: null,
        reverse: null,
        isPro: true,
        Icon: <EventIcon style={{ color: isPro ? undefined : "grey" }} />,
    },
];

export default function Filters({
    listTotal,
    handleSelectedFilter,
    loading,
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
                    <PremiumButton
                        right={20}
                        service="Orgganize Clientes"
                        proPage="OrgganizeClients_1"
                    />
                </div>

                <br />
                <AnimaIconsSelect
                    callback={handleSelectedFilter}
                    optionsArray={mainOptions}
                    defaultSideIcon={defaultMainIcon}
                    offlineKey="selectedMainFilter"
                    checkServicePro="orgganize_clients"
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
                    checkServicePro="orgganize_clients"
                />
                <section className="my-3">
                    <FilterStatus loading={loading} />
                </section>
            </section>
        );

    return <section>{showCategories()}</section>;
}
