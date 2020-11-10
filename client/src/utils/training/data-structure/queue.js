// F.I.F.O  first in, first out
// The first element is called HEAD
// The last element is called TAILOR
class Queue {
    constructor() {
        this.elements = [];
    }

    enqueue(elem) {
        this.elements.push(elem);
    }

    dequeue() {
        this.elements.shift();
    }
}

module.exports = Queue;

/* USAGE EXEMPLE
const person = new Queue();

person.enqueue("Lucas");
person.enqueue("Gabriel");

const allPeople = person.elements; // [ 'Lucas', 'Gabriel' ]

person.dequeue(); // [ 'Gabriel' ]
person.dequeue(); // []

*/
