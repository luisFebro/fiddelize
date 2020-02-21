import React, {useState, useEffect, Fragment} from 'react';
import axios from 'axios';
import { useStoreDispatch } from 'easy-peasy';
import PropTypes from 'prop-types';
import { showSnackbar } from '../../redux/actions/snackbarActions';
import ButtonMulti from './material-ui/ButtonMulti';
import { getHeaderJson } from '../../utils/server/getHeaders';
import getValObjWithStr from '../../utils/objects/getValObjWithStr';

LoadMoreItemsButton.propTypes = {
    url: PropTypes.string.isRequired,
    objPathes: PropTypes.shape({
        strList: PropTypes.string,
        strChunkSize: PropTypes.string,
        strTotalSize: PropTypes.string,
    }).isRequired,
    setData: PropTypes.func.isRequired,
    data: PropTypes.object,
    msgAfterDone: PropTypes.string,
    limitDocs: PropTypes.number,
    button: PropTypes.shape({
        loadingIndicator: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        title: PropTypes.string,
        backgroundColor: PropTypes.string,
    })
}
// NOTES
// Need to declare chunkSize and totalSize and sent them from backend.
// need tosend skip in the url in uppercase like this: /api/finance/cash-ops/list/all?skip=SKIP
// update happens throu redux
export default function LoadMoreItemsButton({
    url,
    objPathes,
    setData,
    data,
    currLoadedDocs,
    msgAfterDone,
    remainingText = "Items Restantes:",
    button,
    limitDocs,
    customLoadingIndicator}) {
    const [isThisLoading, setIsThisLoading] = useState(false);
    const [docsLoaded, setDocsLoaded] = useState({
        skip: 0,
        limit: limitDocs || 5,
        chunkSize: 5,
        totalSize: 0,
        btnLoadingIndicator: "Pra já! Carregando agora..."
    })
    const {
        skip,
        limit,
        chunkSize,
        totalSize,
        btnLoadingIndicator
    } = docsLoaded;

    const { loadingIndicator, title, backgroundColor } = button;
    const { strList, strChunkSize, strTotalSize } = objPathes;

    const dispatch = useStoreDispatch();

    const searchTerm = "";

    useEffect(() => {
        setDocsLoaded({ ...docsLoaded, chunkSize: data.chunkSize})
    }, [data.chunkSize])

    const loadMoreDocs = () => {
        const moreDocsToSkip = skip + limit;
        const modifiedUrl = url.replace("SKIP", moreDocsToSkip);

        setIsThisLoading(true);
        axios.get(modifiedUrl, getHeaderJson)
        .then(res => {
            if(res.status !== 200) {
                setIsThisLoading(false);
                showSnackbar(dispatch, res.data.msg, 'error');
                return;
            }
            const list = getValObjWithStr(res, strList);
            setData({...data, list: [...data.list, ...list]})
            setDocsLoaded({
                ...docsLoaded,
                chunkSize: chunkSize + getValObjWithStr(res, strChunkSize),
                totalSize: getValObjWithStr(res, strTotalSize),
                skip: moreDocsToSkip,
            })
            setIsThisLoading(false);
        })
    };

    const showMoreButton = () => {
        return(
            <Fragment>
                {chunkSize === totalSize && chunkSize >= limit
                ? (
                  <p className="text-main-container text-center my-3">
                    {msgAfterDone || `Isso é tudo. Não há mais items.`}
                  </p>
                ) : (
                    searchTerm.length === 0 && data.totalSize > limit && (
                    <section>
                        <div className="container-center mt-5 mb-3">
                            <ButtonMulti
                                title={isThisLoading ? loadingIndicator || btnLoadingIndicator : title || "Carregar Mais Clientes"}
                                onClick={loadMoreDocs}
                                backgroundColor={backgroundColor || "var(--mainPink)"}
                                backColorOnHover={backgroundColor || "var(--mainPink)"}
                                iconFontAwesome={isThisLoading ? "" : "fas fa-chevron-circle-down"}
                            />
                        </div>
                        <p className="text-center text-normal my-3">{remainingText} <strong className="text-em-2-0">{data.totalSize - chunkSize}</strong></p>
                    </section>)
                )}
            </Fragment>
        );
    };

    return (
        <div>
            {showMoreButton()}
        </div>
    );
}