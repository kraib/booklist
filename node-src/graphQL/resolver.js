import Book from "./Book/resolver";

const { Query: BookQuery, Mutation: BookMutation, ...BookRest } = Book;

import DataLoader from "dataloader";

const userLoader = new DataLoader(keys => {
  console.log(keys);
  return new Promise(res => res(keys.map(_id => ({ _id }))));
});

let a = userLoader.load(1);
let b = userLoader.load(1);

let manyA = userLoader.loadMany([3, 4, 5]);

let aAndBEqual = a === b;

console.log("A", aAndBEqual);
console.log("aa", aAndBEqual);

setTimeout(() => {
  try {
    let c = userLoader.load(1);
    let d = userLoader.load(2);

    let nextTick = a === c;
    let nextTickb = b === c;

    console.log("B", nextTick);
    console.log("C", nextTickb);
  } catch (e) {
    console.log(e);
  }
}, 1);

setTimeout(() => {
  try {
    let c = userLoader.loadMany([1, 2, 3, 6]);

    c.then(vals => console.log(vals));

    let nextTick = a === c;
    let nextTickb = b === c;

    console.log("B", nextTick);
    console.log("C", nextTickb);
  } catch (e) {
    console.log(e);
  }
}, 100);

export default {
  Person: {
    async addresses(root, args, context, ast, x, y, z) {
      return [];
    }
  },
  Query: Object.assign({}, BookQuery, {
    async allPeople(root, args, context, ast, x, y, z) {
      return [
        { name: "Adam", age: 35, addressIds: [1, 2, 3] },
        { name: "Bob", age: 25, addressIds: [4] },
        { name: "Laura", age: 35, addressIds: [1, 3] }
      ];
    }
  }),
  Mutation: Object.assign({}, BookMutation),
  ...BookRest
};
