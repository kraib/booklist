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
module.exports = {
  Query: {
    books(root, args, context, info) {
      console.log(info.fieldNodes.find(fn => fn.kind == "Field").selectionSet.selections.map(selection => selection.name.value));
      //console.log(info.operation.selectionSet.selections.map(selection => selection.name.value));
      return books;
    }
  }
};
