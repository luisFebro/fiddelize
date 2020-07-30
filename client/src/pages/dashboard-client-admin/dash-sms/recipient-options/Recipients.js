import React from 'react';

export default function Recipients({
    mode = "allCustomers"
}) {
    return (
        <section>
            {mode === "allCustomers" && (
                <p>allCustomers</p>
            )}

            {mode === "specificCustomer" && (
                <p>specificCustomer</p>
            )}

            {mode === "customerGroups" && (
                <p>customerGroups</p>
            )}
        </section>
    );
}