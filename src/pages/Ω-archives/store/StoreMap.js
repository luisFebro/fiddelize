import React from 'react';
import Title from '../../components/Title';

export default function StoreMap() {
    return (
        <React.Fragment>
            <div className="container">
                <Title title="Loja Física" />
                <div className="row">
                    <div className="col-10 mx-auto mt-3 d-flex justify-content-center">
                        <iframe
                            title="Babadoo Endereço Loja Física Manaus"
                            src="https://www.google.com/maps/d/u/0/embed?mid=1dLVS3XTjPFctn-W8KYPxxjaIgXI9YViM"
                            width="640"
                            height="480"
                        ></iframe>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
