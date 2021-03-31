import * as subscription from "../../subscription";

export default function SubscribeButton() {
    const handleSubscribe = () => {
        // subscription.subscribeUser();
        subscription.notifyMe();
    };

    return (
        <div>
            {JSON.stringify(Notification.permission)}
            {!Notification.permission ? (
                <button onClick={handleSubscribe}>Ask Permission</button>
            ) : null}
        </div>
    );
}
