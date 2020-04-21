import React from 'react';
import { useClientAdmin } from '../../hooks/useRoleData';
import { Link } from 'react-router-dom';
import ButtonMulti, { faStyle } from '../../components/buttons/material-ui/ButtonMulti';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStoreDispatch } from 'easy-peasy';
import { setRun } from '../../redux/actions/globalActions';

export default function PlansPage({ location }) {
    const isCliAdmin = location.search === "?cliente-admin=1";
    const { bizCodeName } = useClientAdmin();
    const dispatch = useStoreDispatch();

    const showBackBtn = () => (
        <div className="d-flex justify-content-start my-3">
            {isCliAdmin && (
                <Link className="no-text-decoration" to={`/${bizCodeName}/cliente-admin/painel-de-controle`} onClick={() => setRun(dispatch, "goDash")}>
                    <ButtonMulti
                        title="voltar painel"
                        color="var(--mainWhite)"
                        backgroundColor="var(--themeSDark)"
                        backColorOnHover="var(--themeSDark)"
                        iconFontAwesome={<FontAwesomeIcon icon="home" style={faStyle} />}
                        textTransform='uppercase'
                    />
                </Link>
            )}
        </div>
    );

    return (
        <div className="text-center text-white text-hero">
            {showBackBtn()}
            I am the PlansPage
        </div>
    );
}