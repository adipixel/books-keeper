import React from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';

import { Book } from './components/book/Book';

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
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

        console.log(this.state);
      })
      .catch();
  }

  onShelfChange(event, bookId) {
    const newShelf = event.target.value;
    let bookToMove = { ...this.state.books[bookId] };

    bookToMove.shelf = newShelf;

    BooksAPI.update(bookToMove, newShelf)
      .then((shelves) => {
        this.setState(() => ({
          shelves,
        }));
      })
      .catch();
  }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <button
                className="close-search"
                onClick={() => this.setState({ showSearchPage: false })}
              >
                Close
              </button>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author" />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
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

            <div className="open-search">
              <button onClick={() => this.setState({ showSearchPage: true })}>
                Add a book
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BooksApp;
