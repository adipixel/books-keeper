import React from 'react';
import '../../App.css';

export function Book(props) {
  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width: 128,
            height: 193,
            backgroundImage: `url("${props.imgUrl}")`,
          }}
        ></div>
        <div className="book-shelf-changer">
          <select
            readOnly
            value={props.shelf}
            onChange={(e) => props.onChange(e, props.bookId, props.shelf)}
          >
            <option value="move" disabled>
              Move to...
            </option>
            {props.shelfOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.displayText}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="book-title">{props.bookTitle}</div>
      <div className="book-authors">{props.author}</div>
    </div>
  );
}
