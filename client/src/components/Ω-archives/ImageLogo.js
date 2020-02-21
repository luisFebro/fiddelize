import React, { useState } from 'react';
import ShowImgOrSpinner from './ShowImgOrSpinner';

export default function ImageLogo() {
    const [showSpinner, setShowSpinner] = useState(true);
    return (
        <div className="mr-md-5 mt-md-5">
            <ShowImgOrSpinner
                url="admin"
                id="5db4301ed39a4e12546277a8" //admin id
                alt='logomarca studio love beauty'
                width={400}
                height={300}
                setStatus={setShowSpinner}
                status={showSpinner}
                imgOpt= {{
                    className: "image-apresentation"
                }}
            />
        </div>
    );
}