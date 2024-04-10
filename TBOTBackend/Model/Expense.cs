namespace TBOTBackend.Model;

public class Expense
{
    public int Id { get; init; }
    public decimal Amount { get; init; }
    public string PaidByUserId { get; init; }
    public IList<string> ParticipantsId { get; init; }
    public string Description { get; init; }
    public Split Split { get; init; }
    public DateTime Date { get; init; }
    
}