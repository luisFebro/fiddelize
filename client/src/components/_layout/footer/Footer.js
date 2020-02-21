import React from 'react';

const Footer = () => {
    return (
        <footer className="container-fluid mt-5" style={{backgroundColor: "var(--mainDark)", color: 'white'}}>
            <div className="row">
                <div className="col-10 mx-auto text-center p-1 pt-3">
                    <strong>
                        New Project
                        <br />
                        {new Date().getFullYear()}
                        <br />
                    </strong>
                    City
                </div>
            </div>
        </footer>
    );
};

export default Footer;
