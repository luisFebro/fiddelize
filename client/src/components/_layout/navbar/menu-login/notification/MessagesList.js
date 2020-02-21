import React from 'react';
import Message from './Message';

// TODO: only allow users to send message if they are authenticated.
export default function MessageList({ data }) {
    return (
        <div>
            {data.map(messageData => (
                <Message key={messageData.id} data={messageData} />
            ))}
        </div>
    );
}
