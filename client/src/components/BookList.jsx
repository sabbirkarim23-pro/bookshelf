import React from 'react';
import BookItem from './BookItem';

/**
 * BookList Component
 * Displays the reading list, loading state skeletons, or an empty state message.
 */
export default function BookList({ books, isLoading, onMarkAsRead, onDeleteBook }) {
  if (isLoading) {
    return <p className="message">Loading books...</p>;
  }

  if (!books || books.length === 0) {
    return (
      <div>
        <h2 className="list-title">Your Bookshelf</h2>
        <p className="message">No books yet. Add a book using the form above.</p>
      </div>
    );
  }

  const readCount = books.filter((b) => b.status === 'read').length;
  const unreadCount = books.length - readCount;

  return (
    <div>
      <h2 className="list-title">Your Bookshelf ({books.length})</h2>
      <p className="counts">
        {readCount} read, {unreadCount} unread
      </p>

      <table className="books" aria-label="Book list">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
            <th>Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <BookItem
              key={book.id}
              book={book}
              onMarkAsRead={onMarkAsRead}
              onDeleteBook={onDeleteBook}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
