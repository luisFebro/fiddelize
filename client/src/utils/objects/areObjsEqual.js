export default function areObjsEqual(obj1, obj2) {
    if(!obj1 || !obj2) return false;
     return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// const obj1 ={
// role: "fdfdfd",
// _id: "123abc",
// name: "...",
// currScore: 0,
// lastScore: 0,
// purchase: {history: Array(1), updatedAt: 0}}

// const obj2 = {
// role: "",
// _id: "123abc",
// name: "...",
// currScore: 0,
// lastScore: 0,
// purchase: {history: Array(1), updatedAt: 0}}

// console.log(areObjsEqual(obj1, obj2))