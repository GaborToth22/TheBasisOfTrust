namespace TBOTBackend.Model;

public class Expense
{
    public int Id { get; init; }
    public decimal Amount { get; init; }
    public User PaidBy { get; init; }
    public string Description { get; init; }
    public string? Note { get; set; }
    public Split Split { get; init; }
    public DateTime Date { get; init; }
    public IList<User> Participants { get; init; }
    
}