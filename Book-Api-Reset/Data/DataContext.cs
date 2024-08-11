using Book_Api_Reset.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Book_Api_Reset.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Book> Books { get; set; }
        public DbSet<Quote> Quotes { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
