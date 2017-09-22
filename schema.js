const resolvers = require("./resolvers");
const { makeExecutableSchema, addMockFunctionsToSchema } = require("graphql-tools");

const typeDefs = `

type Author {
    _id: String!
    name: String
    address: Address
}

type Address {
    _id: String!
    authors: [Author]
}

type Book {
   _id: String!
   title: String
   publisher: String
   author(first: Int): Author
}

# This type specifies the entry points into our API. In this case
# there is only one - "books" - which returns a list of books.
type Query {
   books(title: String, _id: String): [Book]    
   authors(name: String, _id: String): [Author]
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
module.exports = schema;
