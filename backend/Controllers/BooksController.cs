using Microsoft.AspNetCore.Mvc;
using backend.Data;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _context;

        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        [HttpGet("categories")]
        public IActionResult GetCategories()
        {
            var categories = _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            return Ok(categories);
        }

        [HttpGet]
        public IActionResult GetBooks(
            int pageSize = 5,
            int pageNum = 1,
            string sortOrder = "asc",
            string? category = null
        )
        {
            var query = _context.Books.AsQueryable();

            if (!string.IsNullOrEmpty(category) && category.ToLower() != "all")
            {
                query = query.Where(b => b.Category == category);
            }

            query = sortOrder.ToLower() == "desc"
                ? query.OrderByDescending(b => b.Title)
                : query.OrderBy(b => b.Title);

            var totalNumBooks = query.Count();

            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var result = new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            };

            return Ok(result);
        }
    }
}