import { query as BookQuery, mutation as BookMutation, type as BookType } from "./Book/schema";

export default `

  type Person {
    name: String,
    age: Int,
    addressIds: [Int],
    addresses: [Address]
  }

  type Address {
    _id: Int,
    streetAddress: String
    City: String,
    State: String,
    Zip: String
  }

  type QueryResultsMetadata {
    count: Int
  }

  input StringArrayUpdate {
    index: Int,
    value: String
  }

  input IntArrayUpdate {
    index: Int,
    value: Int
  }

  input FloatArrayUpdate {
    index: Int,
    value: Float
  }

  ${BookType}

  type Query {
    ${BookQuery}

    allPeople: [Person]
  }

  type Mutation {
    ${BookMutation}
  }

`;
