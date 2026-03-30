using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class BookstoreContext : DbContext
    {
        public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options)
        {
        }

        public DbSet<Book> Books { get; set; }
    }
}