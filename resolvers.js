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

let books = [
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

const newBook = {
  _id: 4,
  title: "Book 4",
  publisher: "Publisher C",
  isRead: false
};

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
    },
    newBook() {
      books.push(newBook);
      return newBook;
    },
    deleteBook(root, args) {
      let toDelete = books.find(b => b._id != args._id);
      books = books.filter(b => b._id != args._id);
      return toDelete;
    },
    junk(root, args) {
      return {
        books: [{ ...books[1], title: "JUNK" }],
        tags: [{ ...tags[1], name: "NEWWWW" }]
      };
    }
  }
};

let Schema = `

  type Tag {
    _id
    name
  }

  type Todo {
    _id: Int!
    tags: [Int]  #Int - not Tag
  }
`;

/*
  So Todo's are stored with an array if tag ID's (in Mongo, say). With Redux, I'd initially just load up all Tags, 
  and then as Todo's came in, I'd just match up each tag int Id, with the right Tag object from my reducer. Normalizing
  my redux data made this trivial.
  
  What's the GraphQL way?  I **don't** want N + 1 queries.  I assume I'm missing something fundamental here - I want to tell 
  Apollo that each id in the tags array if a FK to the list of Tags it already brought down.  Is there a way to specify that?

  As near as I can tell, from what I've been playing with, if I nest these relationships in my GQL schema, then my resolver will
  be responsible for fetching the data as needed (N + 1 queries)
*/
