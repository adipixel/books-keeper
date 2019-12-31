import React from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';

import { Route, withRouter } from 'react-router-dom';
import { HomePage } from './components/home-page/HomePage';
import { SearchPage } from './components/search-page/SearchPage';

class BooksApp extends React.Component {
  state = {
    shelfTypes: {
      currentlyReading: {
        value: 'currentlyReading',
        displayText: 'Currently reading',
      },
      wantToRead: {
        value: 'wantToRead',
        displayText: 'Want to read',
      },
      read: {
        value: 'read',
        displayText: 'Read',
      },
      none: {
        value: 'none',
        displayText: 'None',
        hide: true,
      },
    },
  };

  componentDidMount() {
    let allBooks = {};
    BooksAPI.getAll()
      .then((books) => {
        let shelves = books.reduce((acc, book) => {
          // Add book to all books
          allBooks[book.id] = book;

          if (!acc[book.shelf]) {
            acc[book.shelf] = [];
          }
          acc[book.shelf].push(book.id);
          return acc;
        }, {});

        // append books to state
        this.setState((currentState) => ({
          shelves,
          books: allBooks,
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  onShelfChange(event, bookId, context) {
    const newShelf = event.target.value;
    let bookToMove;

    if (context === 'search') {
      let books = { ...this.state.books };
      let searchedBooks = this.state.searchedBooks;

      searchedBooks.forEach((book) => {
        if (book.id === bookId) {
          book['shelf'] = newShelf;
          books[bookId] = { ...book };
          bookToMove = book;
        }
      });
      // update status in search page
      this.setState(() => ({
        searchedBooks,
        books,
      }));
    } else {
      bookToMove = this.state.books[bookId];
      bookToMove.shelf = newShelf;
    }

    BooksAPI.update(bookToMove, newShelf)
      .then((shelves) => {
        this.setState(() => ({
          shelves,
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  searchBooks(event) {
    const searchString = event.target.value.trim();
    if (!searchString) {
      this.setState(() => ({
        searchedBooks: [],
      }));
      return;
    }

    BooksAPI.search(searchString).then((response) => {
      if (response.error) {
        return;
      }

      let searchedBooks = response.map((book) => {
        if (this.state.books[book.id]) {
          book.shelf = this.state.books[book.id].shelf;
        }
        return book;
      });

      this.setState(() => ({
        searchedBooks,
      }));
    });
  }

  render() {
    return (
      <div className="app">
        <Route exact path="/search">
          <SearchPage
            searchedBooks={this.state.searchedBooks}
            shelfTypes={this.state.shelfTypes}
            onShelfChange={this.onShelfChange.bind(this)}
            searchBooks={this.searchBooks.bind(this)}
          ></SearchPage>
        </Route>

        <Route exact path="/">
          <HomePage
            shelfTypes={this.state.shelfTypes}
            shelves={this.state.shelves}
            books={this.state.books}
            onShelfChange={this.onShelfChange.bind(this)}
          ></HomePage>
        </Route>
      </div>
    );
  }
}

export default withRouter(BooksApp);
