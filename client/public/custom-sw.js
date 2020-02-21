self.addEventListener('push', event => { //n1
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: "http://image.ibb.co/frYOFd/tmlogo.png",
        requireInteraction: true,
    }

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
})


/* COMMENTS
n1: traversy version:
console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: "Notified by Traversy Media!",
    icon: "http://image.ibb.co/frYOFd/tmlogo.png"
  });
});
*/

