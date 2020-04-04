import React from 'react';
import ButtonFab, {faStyle} from '../../components/buttons/material-ui/ButtonFab';
import RadiusBtn from '../../components/buttons/RadiusBtn';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useClientAdmin, appSystem, useProfile } from '../../hooks/useRoleData';
import lStorage from '../../utils/storage/lStorage';
import { logout } from '../../redux/actions/authActions';
import { useStoreDispatch } from 'easy-peasy';

// IMPORTANT: This was moved from navbar since it was not running the buttons at the start.

const bizId = appSystem && appSystem.businessId;

export default function ActionBtns({ location }) {
    const { role } = useProfile();
    const { bizCodeName, bizName, bizPlan } = useClientAdmin();

    const locationNow = location.pathname;

    if(role === "cliente-admin") {
        return(
            <div>
                <PlanBadges role={role} bizPlan={bizPlan} />
                <ClientAdminBtns role={role} bizCodeName={bizCodeName} bizName={bizName} />
                <ShowLogoutBtn locationNow={locationNow} />
            </div>
        );
    }
}

const ClientAdminBtns = ({ bizCodeName, bizName, role }) => { // L
    return(
        <section style={{zIndex: 3000, right: '15px', top: 5 }} className="position-absolute container-center">
            <div style={{marginRight: '15px'}}>
                <ButtonFab
                    backgroundColor="var(--themeSDark)"
                    position="relative"
                    size="medium"
                    iconFontAwesome={<FontAwesomeIcon icon="mobile-alt" style={faStyle} />}
                    onClick={null}
                />
            </div>
            <Link to={`/${bizCodeName}/compartilhar-app?negocio=${bizName}&id=${bizId}&role=${role}`}>
                <ButtonFab
                    backgroundColor="var(--themeSDark)"
                    position="relative"
                    size="medium"
                    iconFontAwesome={<FontAwesomeIcon icon="share-alt" style={faStyle} />}
                    onClick={null}
                />
            </Link>
        </section>
    );
}

const PlanBadges = ({ role, bizPlan }) => (
    <section className="plan-badge--root text-small text-white animated slideInLeft slow delay-5s">
        <div className={`${bizPlan}`}>
            <span className="title">{bizPlan === "cortesia" && "Seu plano:"}</span>
            <span className="plan text-center font-weight-bold">{bizPlan}</span>
        </div>
        {bizPlan === "cortesia"
        ? (
            <div className="upgrade-btn position-relative">
                <RadiusBtn
                    title="atualizar"
                    onClick={null}
                    backgroundColor="var(--mainYellow)"
                    padding='5px 10px'
                    fontSize="18px"
                    color="black"
                    needTxtShadow={false}
                />
                <div className="crown-icon position-absolute">
                    <FontAwesomeIcon icon="crown" />
                </div>
            </div>
        ) : (
            <div className={`${bizPlan}-icon position-absolute`}>
                <FontAwesomeIcon icon="crown" />
            </div>
        )}
    </section>
);

const ShowLogoutBtn = ({ locationNow }) => {

    const dispatch = useStoreDispatch();

    const btnLogout = () => (
        <button
            className="font-weight-bold text-small text-shadow"
            style={{
                position: 'absolute',
                top: '65px',
                right: '5px',
                color: "white",
                padding: '2px 5px',
                borderRadius: '20px',
                backgroundColor: 'var(--themeSDark)',
                outline: "none",
            }}
            onClick={() => logout(dispatch)}
        >
            sair
        </button>
    );

    return (
        <div
            style={{ display: locationNow.includes("/nova-senha-verificacao") ? "none" : "block" }}
        >
            {btnLogout()}
        </div>
    );
}

/*
<ButtonFab
    position="relative"
    title="Atualizar"
    variant="extended"
    size="small"
    iconFontAwesome={}
    onClick={null}
/>
 */


/* COMMENTS
n1: LESSON: don not forget the curly braces when declaring React props;
(bizCodeName, bizName, role) this will produces crazy results.crazy
({ bizCodeName, bizName, role }) OKAY
*/