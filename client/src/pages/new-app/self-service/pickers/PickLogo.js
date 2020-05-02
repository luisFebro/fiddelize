import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ButtonMulti, {faStyle} from '../../../../components/buttons/material-ui/ButtonMulti';
import Card from '@material-ui/core/Card';
import CheckBoxForm from '../../../../components/CheckBoxForm';
import RadioGroupForm from '../../../../components/RadioGroupForm';
import { CLIENT_URL } from '../../../../config/clientUrl';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showSnackbar } from '../../../../redux/actions/snackbarActions';
import { useStoreDispatch } from 'easy-peasy';
import { uploadImages, updateImages } from '../../../../redux/actions/userActions';
import { setImage } from '../../../../utils/storage/lForage';

PickLogo.propTypes = {
    step: PropTypes.number,
    setNextDisabled: PropTypes.func,
}

export default function PickLogo({
    step, setNextDisabled, bizId, bizCodeName, setLogoUrlPreview }) {
    const [isBoxChecked, setIsBoxChecked] = useState(false);
    const [uploadedPic, setUploadedPic] = useState("");
    const [tempImgUrl, setTempImgUrl] = useState("");
    const [isLoadingPic, setIsLoadingPic] = useState(false);
    const [editArea, setEditArea] = useState(false);
    const [data, setData] = useState({
        sizeRect: false,
        sizeSquare: false,
    })
    const { sizeSquare, sizeRect } = data;

    setImage("data_logo", "biz_logo", "https://res.cloudinary.com/fiddelize/image/upload/h_150,w_150/v1588293249/you-vipp-shop-scvfdsfd.jpg")
    const dispatch = useStoreDispatch();

    const goNext = () => setNextDisabled(false);

    const updateThisImg = data => {
        updateImages(bizId, data)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
            setTempImgUrl(res.data);
            setLogoUrlPreview(res.data);
        })
    };
    useEffect(() => {
        let dataToUpdate = { lastUrl: tempImgUrl };
        if(sizeSquare) {
            dataToUpdate = {  ...dataToUpdate, paramArray: ["sizeSquare"] }
            showSnackbar(dispatch, "Fazendo alteração no formato da imagem...");
            updateThisImg(dataToUpdate);
        }
        if(sizeRect) {
            dataToUpdate = {  ...dataToUpdate, paramArray: ["sizeRect"] }
            showSnackbar(dispatch, "Fazendo alteração no formato da imagem...");
            updateThisImg(dataToUpdate);
        }
    }, [sizeSquare, sizeRect])

    const gotPic = typeof uploadedPic === "object";
    const picName = uploadedPic && uploadedPic.name;
    useEffect(() => {
        gotPic && tempImgUrl && goNext();
    }, [gotPic, tempImgUrl])

    useEffect(() => {
        if(isBoxChecked) {
            goNext();
        } else {
            setNextDisabled(true);
        }
    }, [isBoxChecked])

    const handleMediaChange = e => {
        const formData = new FormData();

        const name = e.target.name;
        const fileValue = e.target.files[0];

        // Validattion
        if(!fileValue) return console.log(`Nenhuma imagem encontrada. Tente novamente.`);
        // Size Reference: 1mb = 1.000.000 / 1kb 1.000
        if (fileValue.size > 1000000) return showSnackbar(dispatch, `A imagem ${fileValue.name.cap()} possui mais de 1 MB permitido. Por favor, escolha arquivo menor.`, 'error', 8000);

        const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/svg', 'image/svg+xml', 'image/ai'];
        if (allowedTypes.every(type => fileValue.type !== type)) {
            return showSnackbar(dispatch, ` Formato '${fileValue.type.cap()}' não é suportado.`, 'error');
        }
        // End Validation

        formData.set(name, fileValue); // n1 - set and append diff
        setUploadedPic(fileValue);

        const options = { _id: bizId, fileName: bizCodeName }
        setIsLoadingPic(true);
        uploadImages(formData, options)
        .then(res => {
            if(res.status !== 200) {
                setIsLoadingPic(false);
                showSnackbar(dispatch, "Algo deu errado. Verifique sua conexão.", 'error');
                return;
            }
            const generatedImg = res.data;
            setLogoUrlPreview(generatedImg);
            setTempImgUrl(generatedImg);
            setIsLoadingPic(false);
            setEditArea(true);
        })
    };

    const showUploadingBtn = () => (
        <div className="animated rubberBand delay-3s" style={{animationIterationCount: 2}}>
            <input
                accept="image/*"
                onChange={handleMediaChange}
                name="file"
                style={{ display: 'none'}}
                id="uploaded-file"
                type="file"
                multiple={false}
            />
            <label htmlFor="uploaded-file">
                <ButtonMulti
                    title={uploadedPic ? "Trocar Logo" : "Selecione sua Logo"}
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
                    <br />
                    <br />
                    {isLoadingPic && <span className="font-weight-bold">Enviando para app. Processando...</span>}
                </span>
            </div>
        </div>
    );

    const showEditArea = () => (
        editArea &&
        <div className="animated zoomIn">
            <p className="text-center text-subtitle font-weight-bold text-purple">
                Opções de Edição
            </p>
            <RadioGroupForm setData={setData} data={data} />
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
                {showEditArea()}
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

/* ARCHIVES
 const [effectShadow, setEffectShadow] = useState(false);
const [effectBgRemoval, setEffectBgRemoval] = useState(false);

let whichFormat;
        if(!sizeSquare && !sizeRect || sizeRect) {
            whichFormat = "sizeRect";
        } else {
            whichFormat = "sizeSquare";
        }
        console.log("whichFormat", whichFormat);
        if(effectShadow) {
            dataToUpdate = {  ...dataToUpdate, paramArray: [whichFormat, "effectShadow"] }
            showSnackbar(dispatch, "Adicionando sombra na imagem...");
            updateThisImg(dataToUpdate);
        }
        if(effectBgRemoval) {
            dataToUpdate = {  ...dataToUpdate, paramArray: [whichFormat, "effectBgRemoval"] }
            showSnackbar(dispatch, "Removendo fundo da imagem...");
            updateThisImg(dataToUpdate);
        }
<div className="container-center-col m-0" style={{backgroundColor: 'var(--lightGrey)'}}>
    <p className="m-0 text-center text-normal font-weight-bold text-purple">
        Efeitos:
    </p>
    <div>
        <CheckBoxForm text="Remover fundo." setIsBoxChecked={setEffectBgRemoval} />
        <CheckBoxForm text="Aplicar sombra." setIsBoxChecked={setEffectShadow} />
    </div>
</div>
 */

/* COMMENTS
n1: The difference between FormData. set and append() is that if the specified key already exists, FormData. set will overwrite all existing values with the new one, whereas append() will append the new value onto the end of the existing set of values
*/