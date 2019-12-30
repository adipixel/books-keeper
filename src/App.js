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
      },
    },
  };

  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => {
        let shelves = books.reduce((acc, book) => {
          if (!acc[book.shelf]) {
            acc[book.shelf] = [];
          }
          acc[book.shelf].push(book);
          return acc;
        }, {});

        // append books to state
        this.setState((currentState) => ({
          shelves,
          books,
        }));

        console.log(this.state);
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
              {this.state.shelves &&
                Object.keys(this.state.shelves).map((shelf) => (
                  <div>
                    <div className="bookshelf">
                      <h2 className="bookshelf-title">
                        {this.state.shelfTypes[shelf].displayText}
                      </h2>
                      <div className="bookshelf-books">
                        <ol className="books-grid">
                          {this.state.shelves[shelf].map((book) => (
                            <li>
                              <Book
                                bookTitle={book.title}
                                author={book.authors.join(', ')}
                                status={book.shelf}
                                statusOptions={Object.values(
                                  this.state.shelfTypes
                                )}
                                imgUrl={book.imageLinks.thumbnail}
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
