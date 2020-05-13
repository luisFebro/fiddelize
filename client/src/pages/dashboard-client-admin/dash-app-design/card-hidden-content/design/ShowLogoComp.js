import React from 'react';
import PickLogo from '../../../../../pages/new-app/self-service/pickers/PickLogo';
import { useAppSystem, useClientAdmin } from '../../../../../hooks/useRoleData';
import BackButton from '../../../../../components/buttons/BackButton';

export default function ShowLogoComp({ openComp, onBackBtnClick }) {
    const { businessId } = useAppSystem();
    const { bizCodeName } = useClientAdmin();

    const showBackBtn = () => (
        <div className="d-flex justify-content-start">
            <BackButton
                title="Voltar Opções"
                onClick={onBackBtnClick}
            />
        </div>
    );

    return (
        <div>
            {openComp === "logo" && (
                <div className="animated slideInLeft fast container-center text-purple text-hero">
                    {showBackBtn()}
                    <PickLogo
                        bizId={businessId}
                        bizCodeName={bizCodeName}
                        isFromDash={true}
                    />
                </div>
            )}
        </div>
    );
}