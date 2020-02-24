import React from 'react';


const Footer = () => {
    return (
        <footer className="mt-5 theme-p-dark text-s">
            <div className="container-center">
                <div className="col-10 mx-auto text-small text-center py-2 pt-3">
                    <strong>
                        Fiddelize
                    </strong>
                        <br />
                        Sistema de Pontos de Fidelidade
                        <br />
                        Roraima - {new Date().getFullYear()}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
