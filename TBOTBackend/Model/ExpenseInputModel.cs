namespace TBOTBackend.Model;

public class ExpenseInputModel
{
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; }
    public int PaidById { get; set; }
    public List<int> ParticipantIds { get; set; }
    public int Split { get; set; }
}