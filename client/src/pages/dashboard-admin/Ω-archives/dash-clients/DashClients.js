import React from 'react';
import RegisteredClients from './RegisteredClients';
import DashSectionTitle from '../../DashSectionTitle';

export default function DashClients() {
    return (
        <div>
            <DashSectionTitle title="Dados dos Clientes Cadastrados" />
            <RegisteredClients />
        </div>
    );
}
