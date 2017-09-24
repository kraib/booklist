const resolvers = require("./resolvers");
const { makeExecutableSchema, addMockFunctionsToSchema } = require("graphql-tools");

const typeDefs = `

type Tag {
    _id: String!
    name: String
}

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
   isRead: Boolean
   authors: [Author]
}

# This type specifies the entry points into our API. In this case
# there is only one - "books" - which returns a list of books.
type Query {
   books(title: String, _id: String): [Book]    
   bookIndex(index: Int): [Book]
   authors(name: String, _id: String): [Author]
   tags: [Tag]
}

type JunkResult {
    books: [Book]
    tags: [Tag]
}

type Mutation {
    setIsRead(_ids: [String]): [Book]
    newBook: Book
    deleteBook(_id: Int!): Book
    junk: JunkResult
}

`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
module.exports = schema;
