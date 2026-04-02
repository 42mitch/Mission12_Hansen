import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import BookList from './components/BookList'
import ShoppingCart from './components/ShoppingCart'
import AdminBooks from './components/AdminBooks'
import type { CartItem } from './types/CartItem'
import type { Book } from './types/Book'

function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = sessionStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (book: Book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.book.bookID === book.bookID
      )

      if (existingItem) {
        return prevCart.map((item) =>
          item.book.bookID === book.bookID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prevCart, { book, quantity: 1 }]
    })
  }

  const updateQuantity = (bookID: number, change: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.book.bookID === bookID
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (bookID: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.book.bookID !== bookID)
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<BookList cart={cart} addToCart={addToCart} />}
        />
        <Route
          path="/cart"
          element={
            <ShoppingCart
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          }
        />
        <Route path="/adminbooks" element={<AdminBooks />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App