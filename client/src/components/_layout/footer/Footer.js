import React from 'react';

const Footer = () => {
    return (
        <footer style={{bottom: 0, marginTop: 'calc(5% + 60px)'}} className="position-relative target-download theme-p-dark text-s">
            <div className="container-center"> {/*n1*/}
                <div className="text-center py-3">
                    <strong style={{fontSize: '24px'}}>
                        Fiddelize
                    </strong>
                    <span className="font-weight-bold text-small">
                        <br />
                        Plataforma de Pontos de Fidelidade Digital
                        <br />
                        Roraima - {new Date().getFullYear()}
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;


/* COMMENTS
n1:
.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;

margin-right stretching the margin and giving a span.
*/