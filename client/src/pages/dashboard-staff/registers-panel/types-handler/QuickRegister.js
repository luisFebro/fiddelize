import React, { useState } from 'react';
import AsyncShowNewContactForm from '../../../dashboard-client-admin/dash-sms/recipient-options/options/comps/AsyncShowNewContactForm';
import ButtonFab from '../../../../components/buttons/material-ui/ButtonFab';
import generateAppDownloadLink from '../../../../utils/biz/generateAppDownloadLink';
import { useProfile, useClientAdmin } from '../../../../hooks/useRoleData';

const getStyles = () => ({
    msgField: {
        background: 'var(--themeP)',
        borderRadius: '30px',
    },
});


export default function QuickRegister() {
    const [data, setData] = useState({ mean: "", meanType: "", name: "" }); // number or email
    const { mean, meanType, name } = data;
    const { bizName, bizCodeName } = useClientAdmin();
    const { name: userName } = useProfile();

    const styles = getStyles();

    const handleMeanData = (data) => {
        console.log("data", data);
        const { mean, meanType, name } = data;
        setData({ mean, meanType, name });
    }


    const showNumberCTAs = () => (
        <section className="animated fadeInUp delay-1s container-center my-4">
            <section className="d-flex justify-content-center">
                <div className="mr-4">
                    <ButtonFab
                        size="medium"
                        needTxtNoWrap={true}
                        title="Enviar SMS"
                        onClick={null}
                        backgroundColor={"var(--themeSDark--default)"}
                        variant = 'extended'
                        position = 'relative'
                    />
                </div>
                <ButtonFab
                    size="medium"
                    needTxtNoWrap={true}
                    title="Enviar W"
                    onClick={null}
                    backgroundColor={"var(--themeSDark--default)"}
                    variant = 'extended'
                    position = 'relative'
                />
            </section>
        </section>
    );

    const showEmailCTA = () => (
        <section className="animated fadeInUp delay-1s container-center my-4">
            <ButtonFab
                size="medium"
                needTxtNoWrap={true}
                title="Enviar Email"
                onClick={null}
                backgroundColor={"var(--themeSDark--default)"}
                variant = 'extended'
                position = 'relative'
            />
        </section>
    );

    const downloadLink = generateAppDownloadLink({ bizCodeName, name });

    return (
        <section>
            <div className="my-5">
                <AsyncShowNewContactForm
                   isQuickRegister={true}
                   handleMeanData={handleMeanData}
                />
            </div>
            {meanType && meanType === "number" && showNumberCTAs()}
            {meanType && meanType === "email" && showEmailCTA()}
            <section>
                <p className="mt-5 text-purple text-subtitle text-center font-weight-bold">
                    {name ? "Convite gerado:" : ""}
                </p>
                <main
                    style={styles.msgField}
                >
                    {name ? (
                        <p className="m-0 p-3 text-normal text-white text-break text-left mx-3" >
                            {name.toUpperCase()}, segue convite para o programa de fidelidade da {bizName && bizName.toUpperCase()}. Acesse seu link exclusivo: {downloadLink}
                       </p>
                    ) : (
                        <p className="m-0 p-3 text-normal text-white text-break text-left mx-3">
                          {userName.cap()}, no aguardo do nome do cliente e um meio de envio...
                        </p>
                    )}
                </main>
            </section>
        </section>
    );
}
