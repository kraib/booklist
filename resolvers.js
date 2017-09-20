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
    books(root, args, context) {
      console.log(context.user._id);
      return books;
    }
  }
};
