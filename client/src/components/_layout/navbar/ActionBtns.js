import React, { Fragment } from 'react';
import ButtonFab, {faStyle} from '../../../components/buttons/material-ui/ButtonFab';
import RadiusBtn from '../../../components/buttons/RadiusBtn';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useClientAdmin } from '../../../hooks/useRoleData';
import lStorage from '../../../utils/storage/lStorage';

//AppSystem
const appSystem = lStorage("getItems", { collection: "appSystem"});
const bizId = appSystem && appSystem.businessId;

export default function ActionBtns({ role, location }) {
    const { bizCodeName, bizName, bizPlan } = useClientAdmin();

    if(role === "cliente-admin") {
        return(
            <Fragment>
                <PlanBadges role={role} bizPlan={bizPlan} location={location} />
                <ClientAdminBtns role={role} bizCodeName={bizCodeName} bizName={bizName} />
            </Fragment>
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

const PlanBadges = ({ role, bizPlan, location }) => (
    <Fragment>
        {location.includes("/cliente-admin/painel-de-controle")
        ? (
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
        ) : null}
    </Fragment>
);
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