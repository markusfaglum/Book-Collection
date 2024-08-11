namespace Book_Api_Reset.Entities
{
    public class Quote
    {
        public int Id { get; set; }
        public required string Quotation { get; set; }
        public string Attributed { get; set; } = string.Empty;
        public DateTime? DateOfQuote { get; set; }
    }
}
