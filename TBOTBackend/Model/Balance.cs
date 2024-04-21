namespace TBOTBackend.Model;

public class Balance
{
    public int Id { get; init; }
    public int ExpenseId { get; init; }
    public Expense Expense { get; init; }
    public int UserId { get; init; }
    public User User { get; init; }
    public decimal Amount { get; init; }
    public int ParticipantUserId { get; init; }
    public User ParticipantUser { get; init; }
}