import { useState } from "react";
import { useBizData } from "init";
import { setImgToProvider } from "api";
import UploadItemArea from "./UploadItemArea";
// import getId from "utils/getId";

// const randomId = getId();
export default function ImgHandler({ setData, savedImg }) {
    const [targetImg, setTargetImg] = useState(null);
    const { bizLinkName } = useBizData();

    const handleUploadCallback = (result) => {
        const removedImg = !result.uploadedPic;
        setTargetImg(removedImg ? null : result.img);

        if (removedImg) setData((prev) => ({ ...prev, img: null }));
        else setData((prev) => ({ ...prev, img: result.img }));
    };

    return (
        <UploadItemArea
            savedImg={savedImg}
            loadingMsg="Adicionando..."
            callback={handleUploadCallback}
            urlFunc={setImgToProvider}
            body={{
                targetImg, // only for remove mode
                folder: `digital-menu/${bizLinkName}`, // folder to be stored in the provider, add / for subfolders. When remove an img, the folders remain intact
                nameId: "dMenu",
                tags: "cliente-admin",
                backup: false,
            }}
            alreadyUploaded={Boolean(targetImg)}
        />
    );
}
