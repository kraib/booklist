const resolvers = require("./resolvers");
const { makeExecutableSchema, addMockFunctionsToSchema } = require("graphql-tools");

const typeDefs = `
type Book {
   _id: String!                # "!" denotes a required field
   title: String
}
# This type specifies the entry points into our API. In this case
# there is only one - "books" - which returns a list of books.
type Query {
   books(title: String, _id: String): [Book]    # "[]" means this is a list of Books
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
module.exports = schema;
