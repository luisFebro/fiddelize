// In this step, you'll finish implementing the doBFS function, which performs a breadth-first search on a graph and returns an array of objects describing each vertex.

// For each vertex v, the object's distance property should be vertex v's distance from the source, and the predecessor property should be vertex v's predecessor on a shortest path from the source. If there is no path from the source to vertex v, then v's distance and predecessor should both be null. The source's predecessor should also be null.

// In the starter code, the function initializes the distance and predecessor values to null, and then enqueues the source vertex. It is up to you to implement the rest of the algorithm, as described in the pseudocode.

// Once implemented, uncomment the Program.assertEqual() at the bottom to verify that the test assertions pass.

// while (!queue.isEmpty()) {
//     var ____ = queue.dequeue();

//     for (___;___ ;___ ) {
//  var ___ = graph[___][___];

//  if (bfsInfo[___].___ ===___ ) {
//    ___;
//    ___;
//    ___;
//        }
//     }
// }

/* A Queue object for queue-like functionality over JavaScript arrays. */
const Queue = function () {
    this.items = [];
};
Queue.prototype.enqueue = function (obj) {
    this.items.push(obj);
};
Queue.prototype.dequeue = function () {
    return this.items.shift();
};
Queue.prototype.isEmpty = function () {
    return this.items.length === 0;
};

/*
 * Performs a breadth-first search on a graph
 * @param {array} graph - Graph, represented as adjacency lists.
 * @param {number} source - The index of the source vertex.
 * @returns {array} Array of objects describing each vertex, like
 *     [{distance: _, predecessor: _ }]
 */
const doBFS = function (graph, source) {
    const bfsInfo = [];

    for (let i = 0; i < graph.length; i++) {
        bfsInfo[i] = {
            distance: null,
            predecessor: null,
        };
    }

    bfsInfo[source].distance = 0;

    const queue = new Queue();
    queue.enqueue(source);

    // Traverse the graph
    // As long as the queue is not empty:
    while (!queue.isEmpty()) {
        //  Repeatedly dequeue a vertex u from the queue.
        const vertex = queue.dequeue();
        // For each neighbor v of u that has not been visited:
        for (let u = 0; u < graph[vertex].length; u++) {
            const neighbor = graph[vertex][u];

            if (bfsInfo[neighbor].distance === null) {
                // Set distance to 1 greater than u's distance
                bfsInfo[neighbor].distance = bfsInfo[vertex].distance + 1;
                // Set predecessor to u
                bfsInfo[neighbor].predecessor = vertex;
                // Enqueue v
                queue.enqueue(neighbor);
            }
        }
    }

    return bfsInfo;
};

const adjList = [
    [1],
    [0, 4, 5],
    [3, 4, 5],
    [2, 6],
    [1, 2],
    [1, 2, 6],
    [3, 5],
    [],
];

const bfsInfo = doBFS(adjList, 3);
for (let i = 0; i < adjList.length; i++) {
    console.log(
        `vertex ${i}: distance = ${bfsInfo[i].distance}, predecessor = ${bfsInfo[i].predecessor}`
    );
}
