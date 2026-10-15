import React, { useState } from 'react';

/**
 * BookItem Component
 * Renders an individual book with title, author, status badge,
 * "Mark as read" button (disabled when read), and "Delete" button.
 */
export default function BookItem({ book, onMarkAsRead, onDeleteBook }) {
  const [isMarking, setIsMarking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isRead = book.status === 'read';

  const handleMarkRead = async () => {
    if (isRead || isMarking) return;
    try {
      setIsMarking(true);
      await onMarkAsRead(book.id);
    } finally {
      setIsMarking(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await onDeleteBook(book.id);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date cleanly
  const formattedDate = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <tr>
      <td className={isRead ? 'read-title' : ''} title={book.title}>
        {book.title}
      </td>
      <td>{book.author}</td>
      <td>{isRead ? 'Read' : 'Unread'}</td>
      <td>{formattedDate}</td>
      <td>
        {!isRead && (
          <button
            type="button"
            onClick={handleMarkRead}
            disabled={isMarking || isDeleting}
            aria-label={`Mark "${book.title}" as read`}
          >
            {isMarking ? 'Please wait...' : 'Mark as read'}
          </button>
        )}{' '}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || isMarking}
          aria-label={`Delete "${book.title}"`}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </td>
    </tr>
  );
}
