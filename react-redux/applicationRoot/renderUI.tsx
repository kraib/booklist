import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { store } from "./store";
import { render } from "react-dom";

import { ApolloProvider, ApolloClient, gql, graphql } from "react-apollo";

export const client = new ApolloClient();

import ajaxUtil from "util/ajaxUtil";

export function clearUI() {
  render(<div />, document.getElementById("home"));
}

ajaxUtil.get("/graphql", { query: `{books(title:"aaaa",_id:"12"){_id,title}}` }).then(resp => {
  //console.log(resp);
});

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

const NewBook = graphql(gql`
  mutation {
    newBook {
      _id
      title
      publisher
      isRead
    }
  }
`)(NewBookRaw);
function NewBookRaw({ todoID, mutate }) {
  return <button onClick={() => mutate()}>NEW</button>;
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

const Books____ = graphql(
  gql`
    query BookIndex($index: Int!) {
      bookIndexxxx(index: $index) {
        _idxxx
        titlexx
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
  state = { index: 0, show: true };

  componentDidMount() {
    setInterval(() => this.setState({ show: !this.state.show }), 3000);
  }
  getState = () => {
    let state = store.getState();
    debugger;
  };

  render() {
    return (
      <div>
        <NewBook />
        <br />
        <button onClick={this.getState}>State</button>
        <button onClick={() => this.setState({ index: this.state.index - 1 })}>Prev</button>
        {this.state.index}
        <button onClick={() => this.setState({ index: this.state.index + 1 })}>Next</button>
        {this.state.show ? <Books /> : null}
      </div>
    );
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
