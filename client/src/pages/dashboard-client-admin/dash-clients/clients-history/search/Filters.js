import React from "react";
import AnimaIconsSelect from "../../../../../components/selects/anima-icons-select/AnimaIconsSelect";
import FilterStatus from "../../../../../components/selects/anima-icons-select/FilterStatus";
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

const mainOptions = (isUserPro) => [
    {
        titleBr: "Ordem Alfabética A-Z",
        title: "alphabeticOrder",
        reverseBr: "Ordem Alfabética Z-A",
        reverse: "alphabeticOrderZA",
        showEmptyOption: false,
        isPro: false,
        Icon: <SortByAlphaIcon />,
    },
    {
        titleBr: "Maiores Pontos Ativos",
        title: "highestActiveScores",
        reverseBr: "Menores Pontos Ativos",
        reverse: "lowestActiveScores",
        showEmptyOption: true,
        isPro: false,
        Icon: (
            <FiberManualRecordIcon
                style={{ color: isUserPro ? undefined : "grey" }}
            />
        ),
    },
    {
        titleBr: "Clientes Novos",
        title: "newCustomers",
        reverseBr: "Clientes Veteranos",
        reverse: "veteranCustomers",
        showEmptyOption: false,
        isPro: false,
        Icon: <StarsIcon />,
    },
    {
        titleBr: "Clientes Aniversariantes",
        title: "birthdayCustomers",
        reverseBr: null,
        showEmptyOption: false,
        reverse: null,
        isPro: true,
        Icon: <CakeIcon style={{ color: isUserPro ? undefined : "grey" }} />,
    },
    {
        titleBr: "Clientes Fãs (compram mais)",
        title: "buyMoreCustomers",
        reverseBr: "Clientes Compram Menos",
        reverse: "buyLessCustomers",
        showEmptyOption: true,
        isPro: true,
        Icon: <LoyaltyIcon style={{ color: isUserPro ? undefined : "grey" }} />,
    },
    {
        titleBr: "Maiores Valores por Compra",
        title: "highestSinglePurchases",
        reverseBr: "Menores Valores por Compra",
        reverse: "lowestSinglePurchases",
        showEmptyOption: true,
        isPro: true,
        Icon: (
            <MonetizationOnIcon
                style={{ color: isUserPro ? undefined : "grey" }}
            />
        ),
    },
    {
        titleBr: "Últimas Compras",
        title: "lastPurchases",
        reverseBr: "Primeiras Compras",
        reverse: "firstPurchases",
        showEmptyOption: true,
        isPro: true,
        Icon: (
            <LocalMallIcon style={{ color: isUserPro ? undefined : "grey" }} />
        ),
    },
];

const periodOptions = (isUserPro) => [
    {
        titleBr: "Tudo",
        title: "all",
        reverseBr: null,
        reverse: null,
        showEmptyOption: null,
        isPro: false,
        Icon: <EventIcon style={{ color: isUserPro ? undefined : "grey" }} />,
    },
    {
        titleBr: "Hoje",
        title: "today",
        reverseBr: null,
        reverse: null,
        showEmptyOption: null,
        isPro: false,
        Icon: <EventIcon style={{ color: isUserPro ? undefined : "grey" }} />,
    },
    {
        titleBr: "Semana atual",
        title: "week",
        reverseBr: null,
        reverse: null,
        showEmptyOption: null,
        isPro: true,
        Icon: <EventIcon style={{ color: isUserPro ? undefined : "grey" }} />,
    },
    {
        titleBr: "Mês atual",
        title: "month",
        reverseBr: null,
        reverse: null,
        showEmptyOption: null,
        isPro: true,
        Icon: <EventIcon style={{ color: isUserPro ? undefined : "grey" }} />,
    },
    {
        titleBr: "Ano atual",
        title: "year",
        reverseBr: null,
        reverse: null,
        showEmptyOption: null,
        isPro: true,
        Icon: <EventIcon style={{ color: isUserPro ? undefined : "grey" }} />,
    },
];

export default function Filters({
    listTotal,
    handleSelectedFilter,
    loading,
    handlePeriodFilter,
}) {
    const defaultMainIcon = <StarsIcon />;
    const defaultPeriodIcon = <DateRangeIcon />;

    const showCategories = () =>
        listTotal !== 0 && (
            <section className="mt-5 position-relative text-p text-left pl-2">
                <span className="d-inline-block mb-3 text-p text-subtitle font-weight-bold text-p text-left font-weight-bold">
                    Organize por:
                </span>
                <br />
                <AnimaIconsSelect
                    callback={handleSelectedFilter}
                    optionsArray={mainOptions}
                    defaultSideIcon={defaultMainIcon}
                    offlineKey="selectedMainFilter"
                />
                <span className="d-inline-block mt-4 mb-1 text-p text-normal text-left font-weight-bold">
                    Período:
                </span>
                <AnimaIconsSelect
                    callback={handlePeriodFilter}
                    defaultSelected="Tudo"
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
