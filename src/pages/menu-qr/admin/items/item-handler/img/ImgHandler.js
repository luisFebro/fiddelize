import { useState } from "react";
import { useBizData } from "init";
import { setImgToProvider } from "api";
import UploadItemArea from "./UploadItemArea";
// import getId from "utils/getId";

// const randomId = getId();
export default function ImgHandler({ setData, savedImg, isShowItem }) {
    const [targetImg, setTargetImg] = useState(null);
    const { bizLinkName } = useBizData();

    const handleUploadCallback = (result) => {
        const removedImg = !result.uploadedPic;
        const imgName = result.img;

        setTargetImg(removedImg ? null : imgName);

        if (removedImg) setData((prev) => ({ ...prev, img: null }));
        else
            setData((prev) => ({
                ...prev,
                img: imgName,
                finishedUpload: result.finishedUpload,
            }));
    };

    return (
        <UploadItemArea
            savedImg={savedImg}
            loadingMsg="Adicionando..."
            callback={handleUploadCallback}
            urlFunc={setImgToProvider}
            body={{
                targetImg, // only for remove mode
                folder: "digital-menu", // don't include bizName here because it can change and lose reference - folder to be stored in the provider, add / for subfolders. When remove an img, the folders remain intact
                nameId: bizLinkName,
                tags: "cliente-admin",
                backup: false,
            }}
            alreadyUploaded={Boolean(targetImg)}
            isShowItem={isShowItem}
        />
    );
}
