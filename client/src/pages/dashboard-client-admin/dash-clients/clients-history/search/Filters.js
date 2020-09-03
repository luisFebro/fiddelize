import React from "react";
import AnimaIconsSelect from "../../../../../components/selects/anima-icons-select/AnimaIconsSelect";
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

export default function Filters({ listTotal, handleSelectedFilter, loading }) {
    const defaultMainIcon = <StarsIcon />;
    const defaultPeriodIcon = <DateRangeIcon />;

    const showCategories = () =>
        listTotal !== 0 && (
            <section className="my-5 text-p position-relative text-subtitle text-left pl-2 font-weight-bold">
                Organize por:
                <br />
                <AnimaIconsSelect
                    callback={handleSelectedFilter}
                    loading={loading}
                    optionsArray={mainOptions}
                    defaultSideIcon={defaultMainIcon}
                    offlineKey="selectedMainFilter"
                />
                <span className="text-p text-normal text-left font-weight-bold">
                    Período:
                </span>
                <br />
                <AnimaIconsSelect
                    callback={null}
                    loading={loading}
                    optionsArray={periodOptions}
                    defaultSideIcon={defaultPeriodIcon}
                    offlineKey="selectedPeriodFilter"
                />
            </section>
        );

    return <section>{showCategories()}</section>;
}
