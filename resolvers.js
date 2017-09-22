const tags = [
  {
    _id: 1,
    name: "Tag 1"
  },
  {
    _id: 2,
    name: "Tag 2"
  },
  {
    _id: 3,
    name: "Tag 3"
  },
  {
    _id: 4,
    name: "Tag 4"
  }
];

const books = [
  {
    _id: 1,
    title: "Book 1",
    publisher: "Publisher A",
    isRead: false
  },
  {
    _id: 2,
    title: "Book 2",
    publisher: "Publisher A",
    isRead: false
  },
  {
    _id: 3,
    title: "Book 3",
    publisher: "Publisher B",
    isRead: false
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
      console.log("BOOKS");
      //console.log(info.fieldNodes.find(fn => fn.kind == "Field").selectionSet.selections.map(selection => selection.name.value));
      //console.log(info.operation.selectionSet.selections.map(selection => selection.name.value));
      return books;
    },
    bookIndex(root, args) {
      console.log("BOOK INDEX");
      let index = args.index;
      return [books[index]];
    },
    authors(root, args, context, info) {
      console.log("AUTHORS");
      //console.log(info.fieldNodes.find(fn => fn.kind == "Field").selectionSet.selections.map(selection => selection.name.value));
      //console.log(info.operation.selectionSet.selections.map(selection => selection.name.value));
      return authors;
    },
    tags() {
      return tags;
    }
  },
  Mutation: {
    setIsRead(root, args, context, info) {
      console.log("MUTATION");
      args._ids.forEach(id => {
        let book = books.find(b => b._id == id);
        book.isRead = true;
      });
      return books;
    }
  }
};
