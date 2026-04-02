import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { Book } from '../types/Book'
import type { CartItem } from '../types/CartItem'
import CartSummary from './CartSummary'

interface ApiResponse {
  books: Book[]
  totalNumBooks: number
}

interface BookListProps {
  cart: CartItem[]
  addToCart: (book: Book) => void
}

const BookList = ({ cart, addToCart }: BookListProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const apiUrl = import.meta.env.VITE_API_URL || 'https://mission13-hansen.azurewebsites.net/'

  const initialPageNum = Number(searchParams.get('pageNum')) || 1
  const initialPageSize = Number(searchParams.get('pageSize')) || 5
  const initialSortOrder = searchParams.get('sortOrder') || 'asc'
  const initialCategory = searchParams.get('category') || 'All'

  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [pageSize, setPageSize] = useState<number>(initialPageSize)
  const [pageNum, setPageNum] = useState<number>(initialPageNum)
  const [totalNumBooks, setTotalNumBooks] = useState<number>(0)
  const [sortOrder, setSortOrder] = useState<string>(initialSortOrder)
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/Books/categories`)

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        const data: string[] = await response.json()
        setCategories(['All', ...data])
      } catch (err) {
        console.error('Category fetch failed:', err)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    setSearchParams({
      pageNum: pageNum.toString(),
      pageSize: pageSize.toString(),
      sortOrder,
      category: selectedCategory,
    })

    sessionStorage.setItem(
      'lastBookPage',
      `/?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}&category=${encodeURIComponent(selectedCategory)}`
    )
  }, [pageNum, pageSize, sortOrder, selectedCategory, setSearchParams])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setError('')

        const response = await fetch(
          `${apiUrl}/Books?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}&category=${encodeURIComponent(selectedCategory)}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        const data: ApiResponse = await response.json()
        setBooks(data.books ?? [])
        setTotalNumBooks(data.totalNumBooks ?? 0)
      } catch (err) {
        console.error(err)
        setError('Could not load books from the backend.')
      }
    }

    fetchBooks()
  }, [pageSize, pageNum, sortOrder, selectedCategory])

  const totalPages = Math.ceil(totalNumBooks / pageSize)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setPageNum(1)
  }

  const handleAddToCart = (book: Book) => {
    addToCart(book)

    sessionStorage.setItem(
      'lastBookPage',
      `/?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}&category=${encodeURIComponent(selectedCategory)}`
    )

    navigate('/cart')
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-lg-9">
          <h1 className="mb-4">Online Bookstore</h1>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <label className="form-label">Results per page</label>
              <select
                className="form-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPageNum(1)
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Sort by title</label>
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value)
                  setPageNum(1)
                }}
              >
                <option value="asc">A to Z</option>
                <option value="desc">Z to A</option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Filter by category</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            {books.map((b) => (
              <div className="col-md-6 col-xl-4 mb-4" key={b.bookID}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title">{b.title}</h5>
                      <span className="badge rounded-pill text-bg-secondary">
                        {b.category}
                      </span>
                    </div>

                    <p className="card-text mb-1">
                      <strong>Author:</strong> {b.author}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Publisher:</strong> {b.publisher}
                    </p>
                    <p className="card-text mb-1">
                      <strong>ISBN:</strong> {b.isbn}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Classification:</strong> {b.classification}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Pages:</strong> {b.pageCount}
                    </p>
                    <p className="card-text mb-3">
                      <strong>Price:</strong> ${b.price.toFixed(2)}
                    </p>

                    <button
                      className="btn btn-success mt-auto"
                      onClick={() => handleAddToCart(b)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 0 && (
            <nav>
              <ul className="pagination">
                <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPageNum(pageNum - 1)}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <li
                    key={num}
                    className={`page-item ${pageNum === num ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPageNum(num)}
                    >
                      {num}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPageNum(pageNum + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>

        <div className="col-lg-3">
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default BookList