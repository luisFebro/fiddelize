import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Illustration from '../Illustration';
import { CLIENT_URL } from '../../config/clientUrl';
import imgLib from '../../utils/storage/lForageStore';

SearchResult.propTypes = {
    filteredUsersLength: PropTypes.number,
    allUsersLength: PropTypes.number,
    isLoading: PropTypes.bool,
    searchTerm: PropTypes.string,
    mainSubject: PropTypes.string,
    totalCliUserScores: PropTypes.number,
}

export default function SearchResult({
    isLoading,
    filteredUsersLength,
    allUsersLength,
    searchTerm,
    mainSubject = "usuário",
    totalCliUserScores, }) {

    const pluralizeBr = word => {
        let res;
        const wordLastLetter = word.slice(-1);
        const vowals = ["a", "e", "i", "o", "e"];

        if(vowals.includes(wordLastLetter)) {
            res = word + "s";
            return res.cap();
        } else {
            res = word + "es";
            return res.cap();
        }
    }

    return (
        <div className="text-main-container my-5">
            {!filteredUsersLength
            ? (
                <Fragment>
                    {!isLoading && (
                        <Illustration
                            img={imgLib.dash_no_search_illustra}
                            className="dash_no_search_illustra"
                            alt="Busca Vazia"
                            imgStyle={{
                                maxWidth: 400
                            }}
                            txtImgConfig = {{
                                topPos: "15%",
                                txt: `Nenhum ${mainSubject} foi encontrado ${searchTerm.length === 0 ? "" : `para ${searchTerm.toUpperCase()}`}`,
                                txtStyle: "text-title",
                                txtBorder: "border-white",
                            }}
                        />
                    )}
                </Fragment>
            ) : (
                <Fragment>
                    {searchTerm !== ""
                    ? (
                        <div>
                            <h2 className="text-subtitle text-p text-left pl-5">
                                {isLoading
                                ? ""
                                : (
                                    <span>
                                        {`${pluralizeBr(mainSubject)} Encontrados:`} <strong>{filteredUsersLength}</strong>
                                    </span>
                                )}
                            </h2>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-subtitle text-p text-left pl-1">
                                {isLoading
                                ? ""
                                : (
                                    <p className="position-relative" style={{top: '30px'}}>
                                        <span className="text-title">Totais Gerais:</span>
                                        <br />
                                        <strong>• {`${allUsersLength} ${pluralizeBr(mainSubject)}`}</strong>
                                        <br />
                                        <strong>• {`${totalCliUserScores} Pontos/R$`}</strong>
                                    </p>
                                )}
                            </h2>
                        </div>
                    )}
                </Fragment>
            )}
        </div>
    );
}