import { useEffect, useState } from 'react'
import type { Book } from '../types/Book'

const emptyBook: Book = {
  bookID: 0,
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
}

const AdminBooks = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [formData, setFormData] = useState<Book>(emptyBook)
  const [isEditing, setIsEditing] = useState(false)

  const apiUrl = import.meta.env.VITE_API_URL || 'https://mission13-hansen.azurewebsites.net/'

  const fetchBooks = async () => {
    const response = await fetch(`${apiUrl}?pageSize=100&pageNum=1&sortOrder=asc&category=All`)
    const data = await response.json()
    setBooks(data.books ?? [])
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'pageCount' || name === 'price'
          ? Number(value)
          : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditing) {
        await fetch(`${apiUrl}/Books/${formData.bookID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    } else {
      const bookToCreate = {
        title: formData.title,
        author: formData.author,
        publisher: formData.publisher,
        isbn: formData.isbn,
        classification: formData.classification,
        category: formData.category,
        pageCount: formData.pageCount,
        price: formData.price,
      }

      await fetch(`${apiUrl}/Books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookToCreate),
      })
    }

    setFormData(emptyBook)
    setIsEditing(false)
    fetchBooks()
  }

  const handleEdit = (book: Book) => {
    setFormData(book)
    setIsEditing(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    await fetch(`${apiUrl}/Books/${id}`, {
      method: 'DELETE',
    })

    fetchBooks()
  }

  const handleCancelEdit = () => {
    setFormData(emptyBook)
    setIsEditing(false)
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Book Management</h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title mb-3">
            {isEditing ? 'Update Book' : 'Add Book'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Author</label>
                <input
                  className="form-control"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Publisher</label>
                <input
                  className="form-control"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">ISBN</label>
                <input
                  className="form-control"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Classification</label>
                <input
                  className="form-control"
                  name="classification"
                  value={formData.classification}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <input
                  className="form-control"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Page Count</label>
                <input
                  type="number"
                  className="form-control"
                  name="pageCount"
                  value={formData.pageCount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary me-2">
              {isEditing ? 'Update Book' : 'Add Book'}
            </button>

            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Pages</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookID}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>${book.price.toFixed(2)}</td>
                <td>{book.pageCount}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(book.bookID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminBooks