import { Fragment, useEffect, useState } from "react";
import SearchField from "components/search/SearchField";
import useData, { useBizData } from "init";
import useAPIList, {
    readBenefitCards,
    benefitCardsAutocomplete,
} from "api/useAPIList";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import { setItems } from "init/lStorage";
import useRun, { setRun, useAction } from "global-data/ui";
import { getScannedData } from "hooks/media/useQrScanner";
import { Load } from "components/code-splitting/LoadableComp";
import ModalFullContent from "components/modals/ModalFullContent";
import showToast from "components/toasts";
import BenefitScannerBtn from "./benefit-scanner/BenefitScannerBtn";
import PendingCard from "./cards/PendingCard";

export const AsyncScannerHandler = Load({
    loader: () =>
        import(
            "./cards/cta/scanner-handler/BenefitScannerHandler" /* webpackChunkName: "scanner-handler" */
        ),
});

setItems("global", { lastDatePendingBenefitCard: new Date() });

export default function PendingBenefitsList() {
    const [skip, setSkip] = useState(0);
    const [search, setSearch] = useState("");
    const { bizId } = useBizData();
    const { userId } = useData();

    // SCANNER PANEL
    const [scanner, setScanner] = useState({
        scannerOpen: false,
        scannerData: null,
    });
    const { scannerData, scannerOpen } = scanner;
    const handleScannerClose = () => {
        setScanner((prev) => ({
            ...prev,
            scannerData: null,
            scannerOpen: false,
        }));
    };

    const scannerProps = {
        closeModal: handleScannerClose,
        scannerData,
    };
    // END SCANNER PANEL

    const params = {
        type: "pending",
        userId, // for auth
        adminId: bizId,
        search,
    };

    // UPDATE
    const { runName } = useRun(); // for update list from other comps
    const uify = useAction();
    useEffect(() => {
        if (runName && runName.includes("PendingBenefitsList")) {
            setSkip(0);
            setSearch("");
            setRun("runName", null, uify);
        }
        // eslint-disable-next-line
    }, [runName, search]);
    // END UPDATE

    const {
        list = [],
        listTotal: benefitsCount,
        needEmptyIllustra,
        isPlural,
        hasMore,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        isOffline,
        ShowOverMsg,
    } = useAPIList({
        url: readBenefitCards(),
        skip,
        params,
        listName: "PendingBenefitsList",
        filterId: "customerId", // IMPORTANT: this is to avoid duplication. the default is _id, if not found, it will be loading issue. Set here the actual id of each card
        trigger: search || runName || true,
    });

    // SEARCH
    const handleSearch = (entry) => {
        if (entry === "_cleared") {
            setSearch("");
            return;
        }

        setSkip(0);
        setSearch(entry);
    };

    const autocompleteProps = {
        placeholder: "Procure nome cliente",
        noOptionsText: "Cliente não encontrado ou sem benefícios pendentes",
    };

    const handleScannedVal = (val) => {
        const qrCodeData = getScannedData(val);
        if (!qrCodeData)
            return showToast("Código QR inválido.", { type: "error" });

        return setScanner({
            scannerData: qrCodeData,
            scannerOpen: true,
        });
    };

    const showCustomerSearch = () => (
        <Fragment>
            <SearchField
                callback={handleSearch}
                searchUrl={benefitCardsAutocomplete(bizId, {
                    isReceived: false,
                })}
                autocompleteProps={autocompleteProps}
            />
            <div className="or-scanner position-relative d-flex justify-content-end align-items-center mr-3">
                <span className="d-inline-block text-normal font-weight-bold mr-3">
                    ou
                </span>
                <BenefitScannerBtn callback={handleScannedVal} />
                <style jsx>
                    {`
                        .or-scanner {
                            top: -10px;
                        }
                    `}
                </style>
            </div>
        </Fragment>
    );
    // END SEARCH

    // INFINITY LOADING LIST
    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
    });
    const showCard = (data) => <PendingCard data={data} />;

    const listMap = list.map((data, ind) =>
        checkDetectedElem({ list, ind, indFromLast: 2 }) ? (
            <section key={data._id} ref={detectedCard}>
                {showCard(data)}
            </section>
        ) : (
            <section key={data._id}>{showCard(data)}</section>
        )
    );
    // END INFINITY LOADING LIST

    const showEmptyIllustration = () => (
        <section className="mx-3 my-5 container-center-col">
            <img
                width={300}
                src="/img/illustrations/empty-benefits.svg"
                alt="nenhum benefício"
            />
            <h2 className="mt-3 text-normal font-weight-bold text-grey">
                Nenhum cliente com benefício a receber no momento.
            </h2>
        </section>
    );

    return (
        <section className="text-purple mx-3">
            {!needEmptyIllustra && showCustomerSearch()}
            {Boolean(benefitsCount) && (
                <h2 className="my-3 text-normal font-weight-bold text-center">
                    <span className="text-subtitle font-weight-bold">
                        {benefitsCount} cliente{isPlural}
                    </span>{" "}
                    com benefício{isPlural} a receber.
                </h2>
            )}
            {listMap}
            {loading && <ShowLoadingSkeleton />}
            {needEmptyIllustra && showEmptyIllustration()}
            {error && <ShowError />}
            <ShowOverMsg />
            {scannerOpen && (
                <ModalFullContent
                    contentComp={<AsyncScannerHandler {...scannerProps} />}
                    fullOpen={scannerOpen}
                    setFullOpen={handleScannerClose}
                />
            )}
            {!needEmptyIllustra && (
                <section className="text-grey mx-3 font-site text-em-1-1 my-5">
                    <p>
                        <strong>Clientes verificados:</strong> cada cliente que
                        aparece nesta lista foi verificado com sucesso e está
                        qualificado para receber o benefício.
                    </p>
                    <p>
                        Clientes com <strong>benefícios expirados</strong> ou
                        que ficaram com{" "}
                        <strong>saldo em moedas insuficiente</strong> são
                        removidos da lista.
                    </p>
                    <p>
                        Clientes com saldo suficiente para resgatar{" "}
                        <strong>múltiplos benefícios</strong> do mesmo jogo de
                        compra, validam e resgatam o benefício seguinte{" "}
                        <strong>
                            após adicionarem qualquer quantia de moedas PTS na
                            próxima compra
                        </strong>
                        . Após isso, o benefício aparecerá novamente na lista
                        enquanto o saldo for suficiente para resgatar algum
                        benefício.
                    </p>
                </section>
            )}
        </section>
    );
}
