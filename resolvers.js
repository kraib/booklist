const books = [
  {
    _id: "01235",
    title: "Book 1"
  },
  {
    _id: 355219,
    title: "Book 2"
  }
];

const authors = [
  {
    _id: "1",
    name: "Adam"
  },
  {
    _id: "2",
    name: "Bob"
  }
];
module.exports = {
  Query: {
    books(root, args, context, info) {
      debugger;
      console.log("BOOKS");
      //console.log(info.fieldNodes.find(fn => fn.kind == "Field").selectionSet.selections.map(selection => selection.name.value));
      //console.log(info.operation.selectionSet.selections.map(selection => selection.name.value));
      return books;
    },
    authors(root, args, context, info) {
      debugger;
      console.log("AUTHORS");
      //console.log(info.fieldNodes.find(fn => fn.kind == "Field").selectionSet.selections.map(selection => selection.name.value));
      //console.log(info.operation.selectionSet.selections.map(selection => selection.name.value));
      return authors;
    }
  }
};
