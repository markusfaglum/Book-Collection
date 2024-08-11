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
    public class QuoteController : ControllerBase
    {

        private readonly DataContext context;

        public QuoteController(DataContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Book>>> GetAllQuotes()
        {
            var quotes = await context.Quotes.ToListAsync();
            return Ok(quotes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<List<Book>>> GetQuoteById(int id)
        {
            var quote = await context.Quotes.FindAsync(id);
            if (quote == null)
            {
                return NotFound("Could not find quote with id: " + id);
            }
            return Ok(quote);
        }

        [HttpPost]
        public async Task<ActionResult<List<Book>>> CreateQuote(Quote quote)
        {
            context.Quotes.Add(quote);
            await context.SaveChangesAsync();
            return Ok(await context.Quotes.ToListAsync());
        }

        [HttpPut]
        public async Task<ActionResult<List<Book>>> UpdateQuote(Quote updatedQuote)
        {
            var dbQuote = await context.Quotes.FindAsync(updatedQuote.Id);
            if (dbQuote == null)
            {
                return NotFound("Could not find quote with id: " + updatedQuote.Id);
            }
            dbQuote.Quotation = updatedQuote.Quotation;
            dbQuote.Attributed = updatedQuote.Attributed;
            dbQuote.DateOfQuote = updatedQuote.DateOfQuote;
            await context.SaveChangesAsync();
            return Ok(await context.Quotes.ToListAsync());
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<List<Book>>> DeleteQuote(int id)
        {
            var dbQuote = await context.Quotes.FindAsync(id);
            if (dbQuote == null)
            {
                return NotFound();
            }
            context.Quotes.Remove(dbQuote);
            await context.SaveChangesAsync();
            return Ok(new { message = $"Deleted book, id: {dbQuote.Id}" });
        }

    };
}
