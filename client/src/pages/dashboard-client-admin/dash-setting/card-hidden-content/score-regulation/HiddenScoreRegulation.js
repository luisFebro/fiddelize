import React, { useState } from 'react';
import DateWithIcon from '../../../../../components/date-time/DateWithIcon';
import ShowFormText from './ShowFormText';
import ButtonFab from '../../../../../components/buttons/material-ui/ButtonFab';
import "./HiddenScoreRegulation.scss";
import PropTypes from 'prop-types';

HiddenScoreRegulation.propTypes = {
    clientAdmin: PropTypes.object,
}
// DEFINE IF(updatedAt === createdAt) === NO CHANGES MADE....

let showInstru = false;
export default function HiddenScoreRegulation({ clientAdmin }) {
    const [openCommands, setOpenCommands] = useState(false);
    const [generateRegulation, setGenerateRegulation] = useState("");

    const dateUpdated = clientAdmin && clientAdmin.regulation && clientAdmin.regulation.updatedAt;
    if(!dateUpdated) {
        showInstru = true;
    }

    const showCommandText = () => (
        <main className={`${openCommands ? "d-block text" : "d-none"}`}>
            <div className="formatting-commands">
                <p>FORMATADORES DE TEXTO</p>
                <div className="row">
                    <div>
                        <p>*sua expressão negrito*</p>
                        <p>dois asterísticos deixa em negrito</p>
                    </div>
                    <p><strong>*sua expressão negrito*</strong></p>
                </div>
                <div className="row">
                    <div>
                        <p>~sua expressão itálico~</p>
                        <p>dois tils entre enpressão fica em itálico</p>
                    </div>
                    <p><em>sua expressão itálico</em></p>
                </div>
                <div className="row">
                    <div>
                        <p>@sua expressão título@</p>
                        <p>transforma em título, texto centralizado</p>
                    </div>
                    <p style={{color: 'var(--mainPurple)'}}><strong>SUA EMPRESSÃO TÍTULO</strong></p>
                </div>
                <div>
                    - Espaços separam os parágrafos. Pule uma linha no final de cada um.
                </div>
            </div>
            <div className="key-values">
                <p>VALORES CHAVES DO SISTEMA</p>
                <div>
                    <p>##nome-empresa:</p>
                    <p>Nome do seu projeto/empresa</p>
                </div>
                <div>
                    <p>##nome-cliente:</p>
                    <p>Nome do cliente que acessar seu regulamento</p>
                </div>
                <div>
                    <p>##nome-premio:</p>
                    <p>Nome do prêmio que você estipulou</p>
                </div>
                <div>
                    <p>##ponto-premio</p>
                    <p>ponto que o seu cliente precisa alcançar por desafio</p>
                </div>
                <div>
                    <p>##prazo-premio</p>
                    <p>Prazo para o cliente receber o prêmio após alcançar a meta de cada desafio.</p>
                </div>
                <div>
                    <p>##ponto-nivel</p>
                    <p>quanto vale cada nível no total de 5. Se 500 é o ponto-premio, 100 é o ponto-nivel.</p>
                </div>
                <p>
                    - Não é preciso acentuar os valores chaves do sistema e formatadores de texto.
                </p>
            </div>
        </main>
    );

    const showTitleAndExplanation = () => (
        <section style={{padding: '0 20px'}}>
            {showInstru && (
                <p className="text-grey">
                    Seu primeiro regulamento de pontos já foi criado automaticamente para seus clientes.
                    <br />
                    <br />
                    Fique à vontade para alterar ou adicionar mais detalhes.
                </p>
            )}
            <section className="instruction-area">
                <div className="btn container-center-col">
                    <ButtonFab
                        title={openCommands ? "Fechar" : "Ver Comandos"}
                        position="relative"
                        variant="extended"
                        color="var(--mainWhite)"
                        size="medium"
                        backgroundColor="var(--mainPurple)"
                        onClick={() => setOpenCommands(!openCommands)}
                    />
                    <div className="mt-4">
                        <ButtonFab
                            title={generateRegulation ? "Refazer" : "Gerar texto padrão"}
                            position="relative"
                            variant="extended"
                            color="var(--mainWhite)"
                            size="medium"
                            backgroundColor="var(--mainPurple)"
                            onClick={() => {
                                // undo and generate handling
                                if(generateRegulation === "") {
                                    setGenerateRegulation(true);
                                } else {
                                    setGenerateRegulation(!generateRegulation);
                                }
                            }}
                        />
                    </div>
                </div>
                {showCommandText()}
            </section>
        </section>
    );

    return (
        <div className="hidden-content--root text-normal" style={{padding: '20px 0'}}>
            {showTitleAndExplanation()}
            <ShowFormText generateRegulation={generateRegulation} />
            <DateWithIcon
                style={{marginTop: 15}}
                date={dateUpdated}
                msgIfNotValidDate="Nenhuma alteração."
            />
        </div>
    );
}