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
        const imgName = `${bizLinkName}-${result.img}`;

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
            body={{}}
            alreadyUploaded={Boolean(targetImg)}
            isShowItem={isShowItem}
        />
    );
}
