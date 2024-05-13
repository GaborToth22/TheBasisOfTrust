using System.Text.Json.Serialization;

namespace TBOTBackend.Model;

public class Expense
{
    public int Id { get; set; }
    public decimal Amount { get; init; }
    public DateTime Date { get; init; }
    public string Description { get; init; }
    public int PaidById { get; init; }
    public ICollection<ExpenseParticipant> Participants { get; set; }
    public Split Split { get; init; }
}