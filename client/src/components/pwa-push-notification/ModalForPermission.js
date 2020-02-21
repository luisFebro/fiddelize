import React from 'react';
import SubscribeButton from './SubscribeButton';

export default function ModalForPermission() {
    return (
        <div>
            Clique em "Permitir" e receba notificações das novidades, avisos sobre agendamentos, em primeira mão.
            IDEAS: add  a backdrop when then push permission prompt appears for better UX.
            <SubscribeButton />
        </div>
    );
}