import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { store, apolloClient as client } from "./store";
import { render } from "react-dom";

import { ApolloProvider } from "react-apollo";
import { ApolloClient, gql, graphql } from "react-apollo";

export function clearUI() {
  render(<div />, document.getElementById("home"));
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

class BooksRaw extends Component<any, any> {
  render() {
    let { data: { books, bookIndex, refetch } } = this.props;
    //debugger;
    if (bookIndex) {
      books = bookIndex;
    }

    return books && books.length ? (
      <div>
        <ReadBulk />
        <br />
        <br />

        <table>
          <tbody>
            {books.map(b => (
              <tr key={b._id}>
                <td>{b._id}</td>
                <td>{b.title}</td>
                <td>{b.isRead ? "True" : "False"}</td>
                <td>{b.publisher}</td>
                <td>{b.isRead}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : null;
  }
}

// const Books____ = graphql(gql`
//   query books {
//     books {
//       _id
//       title
//       publisher
//       isRead
//     }
//   }
// `)(BooksRaw);

const Books = graphql(
  gql`
    query BookIndex($index: Int!) {
      bookIndex(index: $index) {
        _id
        title
        publisher
        isRead
      }
    }
  `,
  {
    options: (props: any) => ({
      variables: {
        index: props.index
      }
    })
  }
)(BooksRaw);

class BookList extends Component<any, any> {
  state = { index: 0 };

  getState = () => {
    let state = store.getState();
    debugger;
  };

  render() {
    return (
      <div>
        <button onClick={this.getState}>State</button>
        <button onClick={() => this.setState({ index: this.state.index - 1 })}>Prev</button>
        {this.state.index}
        <button onClick={() => this.setState({ index: this.state.index + 1 })}>Next</button>
        <Books index={this.state.index} />
      </div>
    );
  }
}

export function renderUI(component) {
  render(
    <ApolloProvider client={client} store={store}>
      <BookList />
    </ApolloProvider>,
    document.getElementById("home")
  );
}
