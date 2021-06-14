export default function UndoContent() {
    return (
        <section className="mx-3 text-small text-purple font-weight-bold">
            <p className="text-normal font-weight-bold">
                Todas as seguintes ações são desfeitas:
            </p>
            &gt; O benefício adicionado é <strong>REMOVIDO</strong> do histórico
            do cliente
            <br />
            <br />
            &gt; O saldo do cliente e o número do desafio são restaurados para
            os valores antes da aplicação do benefício.
            <p className="mt-3 m-0 font-weight-bold text-center text-normal">
                Confirmado?
            </p>
        </section>
    );
}
