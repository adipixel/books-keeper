import React from 'react';

import { Link } from 'react-router-dom';

import '../../App.css';
import { Book } from '../book/Book';

export function HomePage(props) {
  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>

      <div className="list-books-content">
        {Object.keys(props.shelfTypes)
          .filter((shelf) => !props.shelfTypes[shelf].hide)
          .map((shelf) => (
            <div key={shelf}>
              <div className="bookshelf">
                <h2 className="bookshelf-title">
                  {props.shelfTypes[shelf].displayText}
                </h2>
                <div className="bookshelf-books">
                  <ol className="books-grid">
                    {props.shelves &&
                      props.shelves[shelf] &&
                      props.shelves[shelf].map((bookId) => (
                        <li key={bookId}>
                          <Book
                            bookId={bookId}
                            bookTitle={props.books[bookId].title}
                            author={props.books[bookId].authors.join(', ')}
                            shelf={props.books[bookId].shelf}
                            shelfOptions={Object.values(props.shelfTypes)}
                            imgUrl={props.books[bookId].imageLinks.thumbnail}
                            onChange={props.onShelfChange}
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
  );
}
