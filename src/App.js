import React from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';

import { Book } from './components/book/Book';
import { Link, Route, withRouter } from 'react-router-dom';

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
    const searchString = event.target.value;
    if (!searchString) {
      this.setState(() => ({
        searchedBooks: [],
      }));
      return;
    }

    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setTimeout(() => {
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
    }, 400);
  }

  render() {
    return (
      <div className="app">
        <Route exact path="/search">
          <div className="search-books">
            <div className="search-books-bar">
              <Link to="/" className="close-search"></Link>
              <div className="search-books-input-wrapper">
                <input
                  type="text"
                  placeholder="Search by title or author"
                  onInput={this.searchBooks.bind(this)}
                />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {Array.isArray(this.state.searchedBooks) &&
                  this.state.searchedBooks.map((book) => (
                    <li key={book.id}>
                      <Book
                        bookId={book.id}
                        bookTitle={book.title}
                        author={book.authors && book.authors.join(', ')}
                        shelf={book.shelf || 'none'}
                        shelfOptions={Object.values(this.state.shelfTypes)}
                        imgUrl={
                          book.imageLinks ? book.imageLinks.thumbnail : ''
                        }
                        onChange={this.onShelfChange.bind(this)}
                        context="search"
                      ></Book>
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        </Route>

        <Route exact path="/">
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>

            <div className="list-books-content">
              {Object.keys(this.state.shelfTypes)
                .filter((shelf) => !this.state.shelfTypes[shelf].hide)
                .map((shelf) => (
                  <div key={shelf}>
                    <div className="bookshelf">
                      <h2 className="bookshelf-title">
                        {this.state.shelfTypes[shelf].displayText}
                      </h2>
                      <div className="bookshelf-books">
                        <ol className="books-grid">
                          {this.state.shelves &&
                            this.state.shelves[shelf] &&
                            this.state.shelves[shelf].map((bookId) => (
                              <li key={bookId}>
                                <Book
                                  bookId={bookId}
                                  bookTitle={this.state.books[bookId].title}
                                  author={this.state.books[bookId].authors.join(
                                    ', '
                                  )}
                                  shelf={this.state.books[bookId].shelf}
                                  shelfOptions={Object.values(
                                    this.state.shelfTypes
                                  )}
                                  imgUrl={
                                    this.state.books[bookId].imageLinks
                                      .thumbnail
                                  }
                                  onChange={this.onShelfChange.bind(this)}
                                ></Book>
                              </li>
                            ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <Link to="/search" className="open-search">
              Search books
            </Link>
          </div>
        </Route>
      </div>
    );
  }
}

export default withRouter(BooksApp);
