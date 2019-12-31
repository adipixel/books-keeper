import React from 'react';

import { Link } from 'react-router-dom';
import { Book } from '../book/Book';
import DebounceInput from 'react-debounce-input';
import '../../App.css';

export function SearchPage(props) {
  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link to="/" className="close-search"></Link>
        <div className="search-books-input-wrapper">
          <DebounceInput
            debounceTimeout={400}
            type="text"
            placeholder="Search by title or author"
            onChange={props.searchBooks}
          />
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {Array.isArray(props.searchedBooks) &&
            props.searchedBooks.map((book) => (
              <li key={book.id}>
                <Book
                  bookId={book.id}
                  bookTitle={book.title}
                  author={book.authors && book.authors.join(', ')}
                  shelf={book.shelf || 'none'}
                  shelfOptions={Object.values(props.shelfTypes)}
                  imgUrl={book.imageLinks ? book.imageLinks.thumbnail : ''}
                  onChange={props.onShelfChange}
                  context="search"
                ></Book>
              </li>
            ))}
        </ol>
      </div>
    </div>
  );
}
