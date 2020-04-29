import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ButtonMulti, {faStyle} from '../../../../components/buttons/material-ui/ButtonMulti';
import Card from '@material-ui/core/Card';
import CheckBoxForm from '../../../../components/CheckBoxForm';
import { CLIENT_URL } from '../../../../config/clientUrl';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { showSnackbar } from '../../../../redux/actions/snackbarActions';
// import { useStoreDispatch } from 'easy-peasy';
// showSnackbar(dispatch, "Carregando...");
// const dispatch = useStoreDispatch();

PickLogo.propTypes = {
    step: PropTypes.number,
    setNextDisabled: PropTypes.func,
}

export default function PickLogo({ step, setNextDisabled }) {
    const [isBoxChecked, setIsBoxChecked] = useState(false);
    const [uploadedPic, setUploadedPic] = useState("");


    const goNext = () => setNextDisabled(false);

    const gotPic = typeof uploadedPic === "object";
    const picName = uploadedPic && uploadedPic.name;

    useEffect(() => {
        uploadedPic && gotPic && goNext();
    }, [gotPic, uploadedPic])

    useEffect(() => {
        if(isBoxChecked) {
            goNext();
        } else {
            setNextDisabled(true);
        }
    }, [isBoxChecked])


    const showUploadingBtn = () => (
        <div className="animated rubberBand delay-3s" style={{animationIterationCount: 2}}>
            <input
                accept="image/*"
                onChange={e => {setUploadedPic(e.target.files[0]); }}
                name="trademark"
                style={{ display: 'none'}}
                id="uploaded-file"
                type="file"
                multiple={false}
            />
            <label htmlFor="uploaded-file">
                <ButtonMulti
                    title="Selecione sua Logo"
                    onClick={null}
                    color="var(--mainWhite)"
                    iconFontAwesome={<FontAwesomeIcon icon="image" style={faStyle} />}
                    backgroundColor="var(--themeSDark)"
                    backColorOnHover="var(--themeSDark)"
                    textTransform='uppercase'
                    component="span"
                />
            </label>
            <div
                style={{display: gotPic ? "block" : "none"}}
                className=" zoomIn text-center text-small text-purple"
            >
                <FontAwesomeIcon
                    className="mr-2 animated rubberBand"
                    icon="check-circle"
                    style={{fontSize: '20px', color: 'var(--incomeGreen)', animationIterationCount: 2}}
                />
                <span>
                    A image
                    <br />
                    <span className="font-weight-bold">{picName}</span>
                    <br/>
                    foi carregada!
                </span>
            </div>
        </div>
    );

    const showLogoUploadingArea = () => (
        <section className="text-normal text-white margin-auto-90">
            <Card style={{minWidth: '330px', backgroundColor: 'var(--mainWhite)'}} className="p-2 text-purple text-center text-normal font-weight-bold animated zoomIn fast">
                <section className="container-center">
                    <img
                        src={`${CLIENT_URL}/img/icons/picture-upload.svg`}
                        className="svg-elevation"
                        width={85}
                        height="auto"
                        alt="ícone logo"
                    />
                    <p className="text-subtitle text-purple m-0 ml-3 font-weight-bold">
                        Logo
                    </p>
                </section>
                <section className="container-center">
                    {showUploadingBtn()}
                </section>
                <section style={{display: gotPic ? "none" : "block" }}>
                    <p className="text-normal text-purple m-0">ou</p>
                    <CheckBoxForm text="Escolher depois no meu painel de controle." setIsBoxChecked={setIsBoxChecked} />
                </section>
            </Card>
        </section>
    );

    return (
        step === 1 &&
        <div>
            <p className="text-normal text-white text-shadow text-center">
                • Envie a logo da sua empresa/projeto:
            </p>
            {showLogoUploadingArea()}
        </div>
    );
}