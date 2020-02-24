import React from 'react';


const Footer = () => {
    return (
        <footer className="mt-5 theme-p-dark text-s">
            <div className="container-center"> {/*n1*/}
                <div className="text-small text-center py-2 pt-3">
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


/* COMMENTS
n1:
.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;

margin-right stretching the margin and giving a span.
*/