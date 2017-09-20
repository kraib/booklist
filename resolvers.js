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
    books(_, args) {
      console.log(_, args.title);
      return books;
    }
  }
};
