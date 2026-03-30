# Bootstrap Requirements (FOR GRADING)

I forgot to submit with Bootstrap comments. I've included them here for your grading purposes. Thank you.

In addition to using the Bootstrap Grid layout, I implemented two Bootstrap features not covered in class. Below are exactly what was used and where to find them in the code.

---

### 1. Sticky Cart Summary (`sticky-top`)

**What:**  
Keeps the cart summary visible while scrolling.

**Where to find it:**  
- File: `frontend/src/components/CartSummary.tsx`
- Code:

<div className="card shadow-sm sticky-top" style={{ top: '1rem' }}>


### 2. Category Badge Styling

**What:**  
Displays each book’s category as a styled pill badge.

**Where to find it:**  
- File: frontend/src/components/BookList.tsx
- Code:

<span className="badge rounded-pill text-bg-secondary">
  {b.category}
</span>
