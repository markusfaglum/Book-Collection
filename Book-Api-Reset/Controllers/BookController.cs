using Book_Api_Reset.Data;
using Book_Api_Reset.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Book_Api_Reset.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class BookController : ControllerBase

    { private readonly DataContext context;

    public BookController(DataContext context)
    {
        this.context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Book>>> GetAllBooks()
    {
        var books = await context.Books.ToListAsync();
        return Ok(books);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<List<Book>>> GetBookById(int id)
    {
        var book = await context.Books.FindAsync(id);
        if (book == null)
        {
            return NotFound("Could not find book with id: " + id);
        }
        return Ok(book);
    }

    [HttpPost]
    public async Task<ActionResult<List<Book>>> CreateBook(Book book)
    {
            System.Diagnostics.Trace.TraceInformation($"Received date: {book.PublishingDate}");
            
            context.Books.Add(book);
        await context.SaveChangesAsync();
        return Ok(await context.Books.ToListAsync());
    }

    [HttpPut]
    public async Task<ActionResult<List<Book>>> UpdateBook(Book updatedBook)
    {
        var dbBook = await context.Books.FindAsync(updatedBook.Id);
        if (dbBook == null)
        {
            return NotFound("Could not find book with id: " + updatedBook.Id);
        }
        dbBook.Title = updatedBook.Title;
        dbBook.Author = updatedBook.Author;
        dbBook.Description = updatedBook.Description;
        dbBook.PublishingDate = updatedBook.PublishingDate;
        await context.SaveChangesAsync();
        return Ok(await context.Books.ToListAsync());
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<List<Book>>> DeleteBook(int id)
    {
        var dbBook = await context.Books.FindAsync(id);
        if (dbBook == null)
        {
            return NotFound();
        }
        context.Books.Remove(dbBook);
        await context.SaveChangesAsync();
        return Ok(new { message = $"Deleted book, id: {dbBook.Id}, title: {dbBook.Title}" });
    }

};
}
