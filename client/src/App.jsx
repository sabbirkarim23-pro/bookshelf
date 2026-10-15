import React, { useEffect, useReducer, useCallback } from 'react';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import { getBooks, createBook, markBookAsRead, deleteBook } from './api/books';

// Initial state
const initialState = {
  books: [],
  isLoading: true,
  error: null,
};

// Reducer function managing all bookshelf state
function booksReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_BOOKS':
      return {
        ...state,
        books: action.payload,
        isLoading: false,
        error: null,
      };
    case 'ADD_BOOK':
      // Prepend the new book to keep newest first
      return {
        ...state,
        books: [action.payload, ...state.books],
        error: null,
      };
    case 'MARK_READ':
      return {
        ...state,
        books: state.books.map((book) =>
          book.id === action.payload.id ? action.payload : book
        ),
        error: null,
      };
    case 'DELETE_BOOK':
      return {
        ...state,
        books: state.books.filter((book) => book.id !== action.payload),
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(booksReducer, initialState);

  // Load books on mount
  const fetchBooks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await getBooks();
      dispatch({ type: 'SET_BOOKS', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to fetch books.' });
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Handler: Add a new book
  const handleAddBook = async (title, author) => {
    try {
      const newBook = await createBook({ title, author });
      dispatch({ type: 'ADD_BOOK', payload: newBook });
      return true;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to add book.' });
      return false;
    }
  };

  // Handler: Mark book as read
  const handleMarkAsRead = async (id) => {
    try {
      const updatedBook = await markBookAsRead(id);
      dispatch({ type: 'MARK_READ', payload: updatedBook });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to update book status.' });
    }
  };

  // Handler: Delete book
  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id);
      dispatch({ type: 'DELETE_BOOK', payload: id });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to delete book.' });
    }
  };

  // Handler: Dismiss error banner
  const handleDismissError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <div>
      <div className="header">
        <h1>BookShelf Manager</h1>
        <p>Personal reading list &amp; library tracker</p>
      </div>

      <div className="content">
        {state.error && (
          <div role="alert" className="error-box">
            <button type="button" onClick={handleDismissError} aria-label="Dismiss error banner">
              X
            </button>
            <b>Request Failed:</b> {state.error}
          </div>
        )}

        <BookForm onAddBook={handleAddBook} />

        <BookList
          books={state.books}
          isLoading={state.isLoading}
          onMarkAsRead={handleMarkAsRead}
          onDeleteBook={handleDeleteBook}
        />
      </div>
    </div>
  );
}
