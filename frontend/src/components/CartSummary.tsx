import type { CartItem } from '../types/CartItem'
import { Link } from 'react-router-dom'

interface CartSummaryProps {
  cart: CartItem[]
}

const CartSummary = ({ cart }: CartSummaryProps) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  )

  return (
    <div className="card shadow-sm sticky-top" style={{ top: '1rem' }}>
      <div className="card-body">
        <h4 className="card-title">Cart Summary</h4>
        <p className="mb-2">
          <strong>Items:</strong> {totalItems}
        </p>
        <p className="mb-3">
          <strong>Total:</strong> ${totalPrice.toFixed(2)}
        </p>

        <Link to="/cart" className="btn btn-primary w-100">
          View Cart
        </Link>
      </div>
    </div>
  )
}

export default CartSummary