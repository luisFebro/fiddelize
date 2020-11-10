// L.I.F.0 - last in, first out like dishwashing and piling and dirty plates.
// e.x ctrl + z removes the last error because every time you type, characters are added on a pile.
// The first element is called "EDGE/TOP
// the last element is called "BASE"
class Pile {
    constructor() {
        this.elements = [];
    }

    push(elem) {
        this.elements.push(elem);
    }

    pop() {
        this.elements.pop();
    }
}

module.exports = Pile;

/* USAGE EXAMPLE
const plate = new Pile();

plate.push(1);
plate.push(2);
plate.push(3);
plate.push(4);
plate.push(5);

const allPlates = plate.elements;
console.log("allPlates", allPlates); // [ 1, 2, 3, 4, 5 ]

plate.pop(); // [ 1, 2, 3, 4 ]
plate.pop(); // [ 1, 2, 3 ]
plate.pop(); // [ 1, 2 ]
plate.pop(); // [ 1 ]
plate.pop(); // [  ]
*/
