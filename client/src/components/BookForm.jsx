import React, { useState } from 'react';

/**
 * BookForm Component
 * Renders inputs for title and author with client-side validation,
 * inline error messages, and loading state during submission.
 */
export default function BookForm({ onAddBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required and cannot be empty.';
    }
    if (!author.trim()) {
      newErrors.author = 'Author is required and cannot be empty.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const success = await onAddBook(title.trim(), author.trim());
      if (success) {
        setTitle('');
        setAuthor('');
        setErrors({});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: '' }));
    }
  };

  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);
    if (errors.author) {
      setErrors((prev) => ({ ...prev, author: '' }));
    }
  };

  return (
    <div className="form-box">
      <h2>Add a New Book</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label htmlFor="book-title">Book Title *</label>
          <input
            id="book-title"
            name="title"
            type="text"
            placeholder="e.g. The Pragmatic Programmer"
            value={title}
            onChange={handleTitleChange}
            disabled={isSubmitting}
          />
          {errors.title && <p className="field-error">{errors.title}</p>}
        </div>

        <div className="form-row">
          <label htmlFor="book-author">Author *</label>
          <input
            id="book-author"
            name="author"
            type="text"
            placeholder="e.g. Andrew Hunt & David Thomas"
            value={author}
            onChange={handleAuthorChange}
            disabled={isSubmitting}
          />
          {errors.author && <p className="field-error">{errors.author}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding Book...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
}
