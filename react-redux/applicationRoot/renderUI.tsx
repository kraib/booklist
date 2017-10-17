import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { store } from "./store";
import { render } from "react-dom";

import { ApolloProvider, ApolloClient as RClient, gql, graphql, withApollo } from "react-apollo";
import { ApolloClient } from "apollo-client";
export const client = new ApolloClient();

const ApolloClientAny: any = ApolloClient;

import { HttpLink, createHttpLink } from "apollo-link-http";

export const client2 = new ApolloClientAny({
  link: createHttpLink({ fetcherOptions: { method: "get" } })
});

let title = null;
client2
  .query({
    query: gql`
      query GetMyBooks($title: String) {
        books2(title: $title) {
          title
        }
      }
    `,
    variables: {}
  })
  .then(res => {
    debugger;
  });

import ajaxUtil from "util/ajaxUtil";

export function clearUI() {
  render(<div />, document.getElementById("home"));
}

ajaxUtil.get("/graphql", { query: `{books(title:"aaaa",_id:"12"){_id,title}}` }).then(resp => {
  //console.log(resp);
});

const Junk = graphql(gql`
  mutation {
    junk {
      books {
        _id
        title
      }
      tags {
        _id
        name
      }
    }
  }
`)(JunkRaw);
function JunkRaw({ todoID, mutate }) {
  return <button onClick={() => mutate()}>Junk</button>;
}

const DeleteBook = graphql(gql`
  mutation {
    deleteBook(_id: 2) {
      _id
    }
  }
`)(DeleteBookRaw);
function DeleteBookRaw({ todoID, mutate }) {
  return <button onClick={() => mutate()}>Delete</button>;
}

const ReadBulk = graphql(gql`
  mutation {
    setIsRead(_ids: ["1", "2"]) {
      _id
      isRead
    }
  }
`)(ReadBulkRaw);
function ReadBulkRaw({ todoID, mutate }) {
  return <button onClick={() => mutate()}>Complete</button>;
}

const NewBook = graphql(
  gql`
    mutation {
      newBook {
        _id
        title
        publisher
        isRead
      }
    }
  `,
  {
    // options: (props: any) => ({
    //   variables: {
    //     index: props.index
    //   }
    // })
    props: ({ ownProps, mutate }) => {
      return {
        mutate: X => {
          return mutate({
            //variables: { repoFullName, commentContent },
            update: (store, { data }) => {
              debugger;

              let q = gql`
                query books {
                  books {
                    _id
                    title
                    publisher
                    isRead
                  }
                }
              `;

              let qIndex = gql`
                query BookIndex($index: Int!) {
                  bookIndex(index: $index) {
                    _id
                    title
                    publisher
                    isRead
                  }
                }
              `;

              let storeData: any = store.readQuery({
                query: qIndex,
                variables: { index: 1 }
              });

              storeData.books[1].title = "Updaaaaated";
              store.writeQuery({
                query: qIndex,
                data: { books: [] }
              });
              debugger;
              // Read the data from our cache for this query.
              //const data = store.readQuery({ query: CommentAppQuery });
              // Add our comment from the mutation to the end.
              //data.comments.push(submitComment);
              // Write our data back to the cache.
            }
          });
        }
      };
    }
  }
)(NewBookRaw);
function NewBookRaw({ mutate }: any) {
  return <button onClick={() => mutate()}>NEW</button>;
}

class BooksRaw extends Component<any, any> {
  refetch = () => {
    this.props.data.refetch();
  };
  componentDidUpdate(prevProps, prevState) {
    let { data: { bookIndex } } = this.props;
    let { data: { bookIndex: prevBookIndex } } = prevProps;

    if (bookIndex !== prevBookIndex) {
      this.props.client.query({ query: bookQuery, variables: { index: this.props.index + 1 } });
    }
  }
  render() {
    let { data: { books, bookIndex, refetch } } = this.props;
    //debugger;
    if (bookIndex) {
      books = bookIndex;
    }

    return null;

    // return books && books.length ? (
    //   <div>
    //     <ReadBulk />
    //     <br />
    //     <br />
    //     <button onClick={this.refetch}>Re-fetch</button>

    //     <table>
    //       <tbody>
    //         {books.map(b => (
    //           <tr key={b._id}>
    //             <td>{b._id}</td>
    //             <td>{b.title}</td>
    //             <td>{b.isRead ? "True" : "False"}</td>
    //             <td>{b.publisher}</td>
    //             <td>{b.isRead}</td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // ) : null;
  }
}
const Books = graphql(gql`
  query books {
    books {
      _id
      title
      publisher
      isRead
    }
  }
`)(BooksRaw);

class TagsRaw extends Component<any, any> {
  render() {
    let { data: { tags, bookIndex, refetch } } = this.props;
    //debugger;

    return tags && tags.length ? <ul>{tags.map(b => <li key={b._id}>{b.name}</li>)}</ul> : null;
  }
}
const Tags = graphql(gql`
  query tags {
    tags {
      _id
      name
    }
  }
`)(TagsRaw);

const bookQuery = gql`
  query BookIndex($index: Int!) {
    bookIndex(index: $index) {
      _id
      title
      publisher
      isRead
    }
  }
`;

const BooksByIndex = withApollo(
  graphql(bookQuery, {
    options: (props: any) => ({
      variables: {
        index: props.index
      },

      /* HERE -> */
      onNewData: (props, { data: newData, client }) => {
        if (newData.bookIndex && newData.bookIndex.length === props.pageSize) {
          //there may be a next page - fetch it
          client.query({ query: bookQuery, variables: { index: props.index + 1 } });
        }
      }
    })
  })(BooksRaw)
);

class BookList extends Component<any, any> {
  state = { index: 0, show: true };

  componentDidMount() {
    setInterval(() => this.setState({ show: !this.state.show }), 3000);
  }
  getState = () => {
    let state = store.getState();
    debugger;
  };

  render() {
    return null;
    // return (
    //   <div>
    //     <Junk />
    //     <br />
    //     <br />
    //     <DeleteBook />
    //     <br />
    //     <br />
    //     <Tags />
    //     <br />
    //     <br />
    //     <NewBook />
    //     <br />
    //     <button onClick={this.getState}>State</button>
    //     <button onClick={() => this.setState({ index: this.state.index - 1 })}>Prev</button>
    //     {this.state.index}
    //     <button onClick={() => this.setState({ index: this.state.index + 1 })}>Next</button>
    //     {0 ? <Books /*index={this.state.index}*/ /> : null}
    //     {1 ? <BooksByIndex index={this.state.index} /> : null}
    //   </div>
    // );
  }
}

export function renderUI(component) {
  render(
    <ApolloProvider client={client}>
      <BookList />
    </ApolloProvider>,
    document.getElementById("home")
  );
}
