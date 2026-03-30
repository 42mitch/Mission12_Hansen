import type { CartItem } from '../types/CartItem'
import { useNavigate } from 'react-router-dom'

interface ShoppingCartProps {
  cart: CartItem[]
  updateQuantity: (bookID: number, change: number) => void
  removeFromCart: (bookID: number) => void
}

const ShoppingCart = ({
  cart,
  updateQuantity,
  removeFromCart,
}: ShoppingCartProps) => {
  const navigate = useNavigate()

  const total = cart.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  )

  const lastBookPage = sessionStorage.getItem('lastBookPage') || '/'

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.book.bookID}>
                  <td>{item.book.title}</td>
                  <td>${item.book.price.toFixed(2)}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.book.bookID, -1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.book.bookID, 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>${(item.book.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item.book.bookID)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card mt-4 shadow-sm">
        <div className="card-body">
          <h4>Total: ${total.toFixed(2)}</h4>
        </div>
      </div>

      <div className="mt-4 d-flex gap-2">
        <button
          className="btn btn-secondary"
          onClick={() => navigate(lastBookPage)}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

export default ShoppingCart